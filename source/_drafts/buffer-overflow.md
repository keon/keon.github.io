---
date: 2016-12-21 12:00:00
title: Buffer Overflow
author: Keon Kim
categories:
  - hacking
---



```c
typedef struct {
  int a[2];
  double d;
} struct_t;

double fun(int i) {
  volatile struct_t s;
  s.d = 3.14;
  s.a[i] = 1073741824;
  return s.d;
}
```

fun(0)  -> 3.14
fun(1)  -> 3.14
fun(2)  -> 3.1399998664856
fun(3)  -> 2.00000061035156
fun(4)  -> 3.14
fun(6)  -> Segmentation fault

This kind of problem is generally called a “buffer overflow”. It happens when exceeding the memory size allocated for an array. it is the #1 technical cause of security vulnerabilities Most common form of the buffer overflows come from:
 - Unchecked lengths on string inputs
 - Particularly for bounded character arrays on the stack

<!--more-->

## Bad APIs of stdlib make buffer overflow likely

### gets()
```c
/* Get string from stdin */
char *gets(char *dest)
{
  int c = getchar();
  char *p = dest;
  while (c != EOF && c != '\n') {
    *p++ = c;
    c = getchar();
  }
  *p = '\0';
  return dest;
}
```
There is no way to specify limit on number of characters to read. strcpy, strcat, scanf, fscanf, sscanf all have the same problem.

## Vulnerable Buffer Code
```c
/* Echo Line */
void echo()
{
  char buf[4];  /* Way too small! */
  gets(buf);
  puts(buf);
}
```
If you run the code above, you will likely get...
```
unix>./a.out
Type a string:0123456789012345678901234
Segmentation Fault
```

Overflowed buffer and corrupted return pointer.

## What’s the big deal about buffer overflow?

Even if the buffer overflow did not make the program to stop, it can be a serious problem.
After the execution of the function, the %rsp “Returns” to unrelated code.
Lots of things can happen, without modifying critical state and the program will eventually execute `retq` back to `main`

* How does attackers take advantage of this bug?
  1. overwrite with a carefully chosen return address
  2. executes malicious code (injected by attacker or elsewhere in the running process)
* What can attackers do once they are executing code?
  - To gain easier access, e.g. execute a shell
  - Take advantage of the permissions granted to the hacked process
    + if the process is running as “root”....
    + read user database, send spam etc.

## Example Exploit - Code Injection Attacks

```c
void P(){
  Q();
  ...
}
int Q() {
   char buf[64];
   gets(buf);
   ...
   return ...;
}
```

Input string contains byte representation of executable code.
Overwrite return address A with address of buffer B.
When Q executes ret, will jump to exploit code.

Buffer overflow bugs can allow remote machines to execute arbitrary code on victim machines.
Common in real progams
Examples across the decades
 - “Internet worm” (1988)
 - Attacks on Xbox
 - Jaibreaks on iPhone
Recent measures make these attacks much more difficult


## Avoid Overflow Vulnerabilities

* Better coding practices
 - e.g. use library routines that limit string lengths, fgets instead of gets, strncpy instead of strcpy
* Use a memory-safe language instead of C
* bug finding tools?

A buffer overflow attack typically needs two components:

1. Control-flow hijacking
 - overwrite a code pointer (e.g. return address) that’s later invoked
2. Need some interesting code in the process’ memory
 - e.g. put code in the buffer
 - Process already contains a lot of code in predictable location

How to mitigate attacks? make #1 or #2 hard

## Mitigate #1 - Canaries

Idea: Catch over-written return address before invocation!
Place special value (“canary”) on stack just beyond buffer
Check for corruption before exiting function
GCC Implementation
 -  -fstack-protector
 -  Now the default

```
unix>./bufdemo-sp
Type a string:01234567
*** stack smashing detected ***
```

```
40072f:sub    $0x18,     %rsp
400733:mov    %fs:0x28,  %rax               #
40073c:mov    %rax,      0x8(%rsp)          #
400741:xor    %eax,      %eax
400743:mov    %rsp,      %rdi
400746:callq  4006e0 <gets>
40074b:mov    %rsp,      %rdi
40074e:callq  400570 <puts@plt>
400753:mov    0x8(%rsp), %rax               #
400758:xor    %fs:0x28,  %rax               #
400761:je     400768 <echo+0x39>
400763:callq  400580 <__stack_chk_fail@plt> #
400768:add    $0x18,     %rsp
40076c:retq 
```
```c
/* Echo Line */
void echo()
{
  char buf[4]; 
  gets(buf);
  puts(buf);
}
```
```
echo:
  . . .
  movq  8(%rsp),  %rax      # Retrieve from stack
  xorq  %fs:40,   %rax      # Compare to canary
stack
  je  .L6                   # If same, OK
  call  __stack_chk_fail    # FAIL
.L6:  . . .
```

### What isn't caught by Canaries?

Overwrite a code pointer before canary

```c
void myFunc(char *s) {
 ...
}
void echo()
{
  void (*f)(char *);
  f = myFunc;
  char buf[8]; 
  gets(buf);
  f();
}
```

Overwrite a data pointer before canary
```c
void echo()
{
  long *ptr;
  char buf[8];
  gets(buf); 
  *ptr = *(long *)buf;
}
```

## Mitigate #2 attempts to craft “attacking code”

### NX
* NX: Non-executable code segments
 - Traditional x86 has no “executable” permission bit, X86-64 added  explicit “execute” permission
 - Stack marked as non-executable
* Does not defend against:
 - Modify return address to point to code in stdlib (which has functions to execute any programs e.g. shell)

### ASLR
* Insight: attacks often use hard-coded address make it difficult for attackers to figure out the address to use
* Address Space Layout Randomization
 - Stack randomization
   + Makes it difficult to determine where the return addresses are located
 - Randomize the heap, location of dynamically loaded libraries etc.


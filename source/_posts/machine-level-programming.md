---
date: 2016-12-21 11:00:00
title: Machine Level Programming (Assembly)
author: Keon Kim
categories:
  - assembly
---

Let's learn assembly!

<!--more-->

## ISA

ISA (instruction set architecture) is a specification of the machine instructions implemented by a processor (the “API” of the CPU).

## Machine Code View

![machine-code-view](/images/machine-prog/machine-code-view.png)

### (Programmer-Visible) CPU State
* PC: Program counter - Store address of next instruction (Also called “IP” or “RIP”)
* Registers - Store frequently used program data
* Condition codes - Contain status of most recent arithmetic or logical operation. Used for conditional branching.
* Memory - Byte addressable array. Contain both code and data

## x86-64 Integer Registers

![registers](/images/machine-prog/registers.png)

## Assembly

### Moving Data

  `movq source, dest`

Operand Types
* Immediate: Constant integer data
  - Example: $0x400, $-533
  - Encoded with 1, 2, or 4 bytes
* Register: One of 16 integer registers
  - Example: %rax, %r13
  - Some have special uses for particular instructions: e.g. %rsp
* Memory: 8 consecutive bytes of memory at address given by register
  - Various “address modes”
  - Simplest example: (%rax)

Note that it is impossible to do memory-to-memory transfer with a single instruction.

### Simple Memory Addressing Modes

* Normal (R) Mem[Reg[R]]
  - Register R specifies memory address
  - `movq (%rcx),%rax`

* Displacement D(R) Mem[Reg[R]+D]
  - Register R specifies start of memory region
  - Constant displacement D specifies offset
  - `movq 8(%rbp),%rdx`

### Address Computation Examples

Given %rdx = 0xf000 and %rcx = 0x0100

Expression    | Address Computation | Address
--------------|---------------------|---------------
0x8(%rdx)     | 0xf000 + 0x8        | 0xf008
(%rdx,%rcx)   | 0xf000 + 0x100      | 0xf100
(%rdx,%rcx,4) | 0xf000 + 4\*0x100   | 0xf400
0x80(,%rdx,2) | 2\*0xf000 + 0x80    | 0x1e080



### Two Operand Instructions

Assembly Expression      | C Expression
-------------------------|-----------------
addq Src,Dest            |Dest = Dest + Src
subq Src,Dest            |Dest = Dest  Src
imulq Src,Dest           |Dest = Dest * Src
salq Src,Dest (aka shlq) |Dest = Dest << Src 
sarq Src,Dest            |Dest = Dest >> Src Arithmetic
shrq Src,Dest            |Dest = Dest >> Src Logical
xorq Src,Dest            |Dest = Dest ^ Src
andq Src,Dest            |Dest = Dest & Src
orq Src,Dest             |Dest = Dest or Src

### One Operand Instructions
Assembly Expression      | C Expression
-------------------------|-----------------
incq Dest                | Dest = Dest + 1
decq Dest                |Dest = Dest - 1
negq Dest                |Dest = -Dest
notq Dest                |Dest = ~Dest


### Load Effective Address

`leaq src, dst` - set dst to address denoted by src address mode expression.


*Uses*
* Computing addresses without a memory reference
  - E.g., translation of p = &x[i];
* Computing arithmetic expressions of the form x + k\*y
  - k = 1, 2, 4, or 8
  - y = x * 3 == leaq (%rdi, %rdi, 2), %rdx # t = x + x * 2

## Control Flow

Condition Codes (Single bit registers)
 - [CF] [ZF] [SF] [OF]

### Implicitly set by arithmetic operations
 - Example: addq Src, Dest  // t = a + b 
 - Not set by leaq

* CF (Carry Flag)    set if unsigned overflow
* ZF (Zero Flag)     set if t == 0
* SF (Sign Flag)     set if t < 0 (as signed)
* OF (OverFlow Flag) set if signed overflow
  - (a>0 && b>0 && t<0) || (a<0 && b<0 && t>=0)

### Explicitly Set by Compare Instruction

`cmpq b,a` like computing a-b without setting destination

* CF set if unsigned overflow
* ZF set if a == b
* SF set if (a-b) < 0 (as signed)
* OF set if two’s-complement (signed) overflow
  - (a>=0 && b<0 && (a-b)<0) || (a<0 && b>0 && (a-b)>0)

### Explicitly Set by Test Instruction

`testq b, a` (like computing a&b without setting destination) 

* ZF set when a&b == 0
* SF set when a&b < 0

Examples:
 - testq %rax, %rax  (when is ZF/SF set?)

### Setx Instructions

  ```c
  int gt (long x, long y)
  {
    return x > y;
  }
  ```
is equal to 
  ```
  cmpq   %rsi,  %rdi    # Compare x:y
  setg   %al            # Set when >
  movzbl %al,   %eax    # Zero rest of %eax
  ret
  ```

### Jump Instructions

jX Instructions: jump to different part of code

```c
 int sum(int n)
{
  int sum = 0;
  for (int i=0; i<n; i++){
    sum += i;
  }
  return sum;
}
```
can be translated to 
```
# %rdi = argument x, %rax = return value
sum:
  movl	$0,	%edx
  movl	$0,	%eax
  jmp	.L5
.L6:
  addl	%edx,	%eax
  addl	$1,	%edx
.L5:
  cmpl	%edi,	%edx
  jl	.L6
  rep	ret
```

## Data

### Arrays

```c
int get_digit(int *z, int ind)
{
  return z[ind];
}
# %rdi = z
# %rsi = ind
movl (%rdi,%rsi,4), %eax  # z[ind]
```
Array Loop Example
```c
void mystery(int *z) {
   for (long i = 0; i <= 4; i++) {
      z[i]++;
   }
}
```
this can be translated to:
```
  # %rdi = z
  movl    $0,  %rax          #   i = 0
  jmp     .L3                #   goto middle
.L4:                         # loop:
  addl    $1,  (%rdi,%rax,4) #   z[i]++
  addq    $1,  %rax          #   i++
.L3:                         # middle
  cmpq    $4,  %rax          #   i:4
  jbe     .L4                #   if <=, goto loop
  rep;    ret
```

### 2D Arrays
```c
#define ROW 4
#define COL 5
int A[ROW][COL] = 
  {{1, 5, 2, 0, 6},
   {1, 5, 2, 1, 3 },
   {1, 5, 2, 1, 7 },
   {1, 5, 2, 2, 1 }};

```
“Row-Major” ordering of all elements in memory
x->[1,5,2,0,6,1,5,2,1,31,5,2,1,7,1,5,2,2,1]<-x+80
**x+(i\*COL+j)\*sizeof(int)**

### 2D Array Element Access

```c
int A[4][5]

int get_digit(int i, int j)
{
  return A[i][j];
}
```
```
leaq (%rdi,%rdi,4),     %rax     # 5*i
addl %rax,              %rsi     # 5*i+j
movl 0x890d0d(,%rsi,4), %eax     # Memory[A + 4*(5*i+j)]
```

### Row Vectors
when A is a 2d array:
```c
int *get_array(int i)
{
  return A[i];
}
```
```
# %rdi = i
leaq (%rdi,%rdi,4),   %rax        # 5 * i
leaq 0x80de(,%rax,4), %rax        # A + (20 * i)
```

### Multi-Level Arrays
```c
int A[5] = { 1, 5, 2, 1, 3 };
int B[5] = { 0, 2, 1, 3, 9 };
int C[5] = { 9, 4, 7, 2, 0 };
int *aofa[3] = {A, B, C};

int get_digit(long i, long j)
{
  return a2a[i][j];
}
```

```
salq    $2,              %rsi  # 4*j
addq    0x8eaf(,%rdi,8), %rsi  # p = a2a[i] + 4*j
movl    (%rsi),          %eax  # return *p
ret
```
How does this differ from accessing 2d array?
`Mem[A+4*(5*i+j)]`(2d) vs `Mem[Mem[aofa+8*i]+4*j]`(multi)

### Structures

#### Following Linked List
  ```c
  struct node {
    int a[4];
    long i;
    struct node *next;
  };

  void set_val (struct node *r, int val)
  {
    while (r) {
      int i = r->i;
      r->a[i] = val;
      r = r->next;
    }
  }
  ```
  ```
  # %rdi = r, %rsi = val
  .L11:                             # loop:
    movslq  16(%rdi), %rax          #   i = M[r+16]   
    movl    %esi,     (%rdi,%rax,4) #   M[r+4*i] = val
    movq    24(%rdi), %rdi          #   r = M[r+24]
    testq   %rdi,     %rdi          #   Test r
    jne     .L11                    #   if !=0 goto loop
  ```

* Within structure:
  - Must satisfy each element’s alignment requirement
* Initial address must also be aligned
  - K = Largest alignment of any element
  - Initial address & structure length must be multiples of K
* Example:
```c
struct S1 {
  char c;
  int i[2];
  double v;
}
```
K = 8, due to double element

#### Tip: put large data first

When struct is organized as below:
```c
struct S4 {
  char c;
  int i;
  char d;
}
```
![saving-space1](/images/machine-prog/saving-space1.png)

But memory spaces can be saved when it is organized as below:
```c
struct S4 {
  int i;
  char c;
  char d;
}
```
![saving-space2](/images/machine-prog/saving-space2.png)

### Union vs Struct
```c
 union my_union {
    unsigned char b[4];
    int x;
 }
 union my_union U;
```
All members in a union start at the same location
 - i.e. only one member can contain a value at a given time

```c
typedef union {
  char c;
  int i[2];
  double v;
} u_t;

int get_member(u_t *u, int first) {
  if (first) {
        return U->c;
  }else{
        return U->i[1];
  }

}
```

```
  testl  %esi,    %esi
  je     .L2
  movsbl (%rdi),  %eax
  ret
.L2:
  movl   4(%rdi), %eax
  ret

```

### Pointers & Arrays

Decl      | An cmp | An bad | An size | \*An cmp | \*An bad | \*An sizeof
----------|-------|-----|------|-----|-----|-------
int A1[3] | Y     | N   | 12   | Y   | N   | 4
int \*A2  | Y     | N   | 8    | Y   | Y   | 4

* Cmp: Compiles (Y/N)
* Bad: Possible bad pointer reference (Y/N)
* Size: Value returned by sizeof


## Procedure Calls

What are the requirements of procedure calls?
- Passing control
- Passing Arguments & return value
- Allocate / deallocate local variables

### x86-64 Stack

* Region of memory managed like a stack
* Grows toward lower addresses
* Register %rsp contains lowest  stack address
  - address of “top” element

### Push and Pop Instructions

`pushq src`
 - fetch operand src
 - Decrement %rsp by 8
 - Write operand at address given by %rsp

`popq dest`
 - Read value at address given by %rsp
 - Increment %rsp by 8
 - Store value at Dest (must be register)

### Call and Ret instructions

`call label`
- Push return address (next instruction after the call insruction) on stack 
- Jump to label

`ret`
- Pop 8 bytes (address) from stack
- Jump to address

### Allocate & Deallocate from Stack

* Allocate local variables on the stack
 - subq  $0x8,%rsp  //allocate 8 bytes
 - movq $1,  8(%rsp) //store 1 in the allocated 8 bytes
* De-allocate then from the stack before returning
 - addq   $0x8,%rsp

### Passing Arguments and Return Values

We could store arguments/return values on the stack but it is not very efficient.
So C tries to pass arguments and return values using registers

#### Calling Convention

When procedure f calls g: f is the *caller*, g is the *callee*
Can caller assume register values do not change when callee returns?
If not, caller must save register values (in memory) that it needs to use them later

Some registers are “caller saved”, others are “callee saved”
Caller saved - Caller saves “caller saved” registers on stack before the call
Callee saved - Callee saves “callee saved” registers on stack before using. Callee restores them before returning to caller

```c
long func(long x) {
    long v1 = 15213;
    long v2 = incr(&v1);
    return x+v2;
}
```
```
func:
  pushq   %rbx
  subq    $16,     %rsp
  movq    %rdi,    %rbx
  movq    $15213,  8(%rsp)
  leaq    8(%rsp), %rdi
  call    incr
  addq    %rbx,    %rax
  addq    $16,     %rsp
  popq    %rbx
  ret
```

We view the part of stack pertaining to each function invocation as a “stack frame”

Content of stack frame:
 - Local variables
 - Saved registers
 - Arguments
 - Return address


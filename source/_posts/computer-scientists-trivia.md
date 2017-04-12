---
date: 2016-12-20 12:00:00
title: Computer Scientist's Trivia
author: Keon Kim
categories:
  - cs
---


It is crucial for programmers to understand how long a certain operation takes in and out of a computer. For example, fetching a word from cache, memory, disk, and from other computers.
Inspired by [Teach Yourself Programming in Ten Years](http://norvig.com/21-days.html#answers), I would like to discuss this in a little more detail. (Most information is taken from [here](https://gist.github.com/jboner/2841832))

<!--more-->

The analogy is:

+ L1 Cache - There is a sandwich in front of you.
+ L2 Cache - Walk to the kitchen and make a sandwich
+ RAM - Drive to the store, purchase sandwich fixings, drive home and make sandwich
+ Hard Drive - Drive to the store. purchase seeds. grow seeds, harvest lettuce, wheat, etc. Make sandwich.

To be more specific:

Latency Comparisons                | Nanosec      | Microsec      | Millisec      |
:----------------------------------|-------------:|--------------:|--------------:|
L1 cache reference                 |           0.5|               |
Branch mispredict                  |             5|               |
L2 cache reference                 |             7|               |
Mutex lock/unlock                  |            25|               |
Main memory reference              |           100|               |
Compress 1K bytes with Zippy       |         3,000|              3|
Send 1K bytes over 1 Gbps network  |        10,000|             10|
Read 4K randomly from SSD          |       150,000|            150|
Read 1 MB sequentially from memory |       250,000|            250|
Round trip within same datacenter  |       500,000|            500|
Read 1 MB sequentially from SSD    |     1,000,000|          1,000|   1
Disk seek                          |    10,000,000|         10,000|  10
Read 1 MB sequentially from disk   |    20,000,000|         20,000|  20
Send packet CA->Netherlands->CA    |   150,000,000|        150,000| 150

#### Notes
 - 1 ns = 10^-9 seconds
 - 1 us = 10^-6 seconds = 1,000 ns
 - 1 ms = 10^-3 seconds = 1,000 us = 1,000,000 ns

It is important to have this information in mind because you have to understand what you should be optimizing for. Optimizing the CPU caching like hell will improve the web-api's latency only a little, because most of the latency comes from the traveling time of the data.

If L1 access takes a second, then reading 1 MB sequentially from disk takes about 462 days. Sending packet form California to Netherlands and back to California would take 3472 days.


If visualized :

![latency](/images/machine-prog/latency.png)

## Numbers and Bits

These numbers come naturally to programmers. First ten powers of 2 numbers:

1 2 4 8 16 32 64 128 256 512 1024

* 2^10 = Kibi ~ Kilo = 10^3
* 2^20 = Mebi ~ Mega = 10^6
* 2^30 = Gibi ~ Giga = 10^9
* 2^40 = Tebi ~ Tera = 10^12

It is good to know the answers for the questions below.

**What’s  the number  1111  1111?**: 255
**What’s  1111  1111  in  Hex?**: 0xff
**What’s  the number  1000  0000?**: 2^7=128
**What’s  the largest 8-bit number?**: 255
**How to represent negative numbers?**: 2's Complement

## Notes - Two's Complement

To obtain the two's complement of X, you first obtain the one's complement by inverting (flipping) all the bits of X, then add 1 to the one's complement to yield the two's complement. A negative number in two's complement representation always has the most-significant bit set.
Therefore, the conversion is:

```
 128 64 32 16 8 4 2 1
   0  0  0  0 0 0 1 1    =  3

-128 64 32 16 8 4 2 1
   1  1  1  1 1 1 0 1    = -3
```

## Byte Ordering

Conceptually, memory is a big array, addressable at each byte.

*Big Endian*: most significant byte in smallest address (0x01020304)
*Little Endian*: least significant byte in smallest address (0x04030201)

## Bit Twiddling
Bitwise operations and tricks can be found in [here](https://github.com/keonkim/awesome-bits).

## Floating Points

(-1)^(sign) * Mantissa (aka significand) * 2^E

Type   | Sign Bit  | Encoded E     | Encoded M     | Precision | Magnitude
-------|-----------|---------------|---------------|-----------|----------
Single |sign(1bit) | exp (8-bits)  | frac(23-bits) |  2^-149   | 2^128
Double |sign(1bit) | exp (11-bits) | frac(52-bits) | 2^(-1074) | 2^1025

Floating points are tricky because the precision diminishes as magnitude grows and it is prone to overflow and rounding error.

Many real world disasters due to floating point trickiness. Patriot Missile failed to intercept due to 0.1 rounding error (1991). Ariane 5 explosion due to overflow in converting from double to int (1996) 

## Extract Sign, Mantissa, and E from a Float

To display sign-bit, 8-bit exp field, and 23-bit frac field...

```c
unsigned int *f =  (unsigned int *)(&x);
unsigned int sign = (* f) >> 31;
unsigned int exp = (* f) << 1 >> 24;
unsigned int frac = ((* f) << 9) >> 9;
```

GCC and Clang also support an extension that lets you use a union:
```c
 union {
      int32_t bits;
      float val;
 };

 f.val = 123.0;
 use(f.bits)
```

## Special Values

**Infinite** : exp = 111…1, frac = 000…0
(ex., 1.0/0.0 = −1.0/−0.0 = +∞,  1.0/−0.0 = −∞)
**Not-a-Number(NaN**) : exp = 111…1, frac ≠ 000…0
(ex., sqrt(–1), ∞ − ∞, ∞ × 0)

## C data types

I personally do not think that every programmers should know C in order to succeed in programming in other langauges. However, I think it is very important to know how data is stored in C (especially pointers). This knowledge broadens the perspective of how memory and cpu works. And you'll appreciate more on how modern languages made everything so easy.

## Primitive Types in C

It depends on OS by OS but, most commonly...

Type   | Size (32-bit) | Size (64-bit)
-------|---------------|---------------
char   | 1 (8 bit)     | 1 (8  bit)
short  | 2 (16 bit)    | 2 (16 bit)
int    | 4 (32 bit)    | 4 (32 bit)
long   | 8 (32 bit)    | 8 (64 bit)
float  | 4 (32 bit)    | 4 (32 bit)
double | 8 (64 bit)    | 8 (64 bit)
pointer| 4 (32 bit)    | 8 (64 bit)

## 2D Array vs. Array of  Pointers

```c
int m[2][3] = { {1, 2, 3}, {4, 5,6}};
int *n[2];
```

*Diagram to show the difference*
m: |\_|\_|\_|\_|\_|\_|\_|
n: |\_|\_|

n[0] = &m[0][0]; // equivalent to n[0] = m[0]
n[1] = &m[1][0]; // equivalent to n[1] = m[1]

what is n[0][1]? // 2
m[0][1]?         // same as n[0][1]

What is n[1][1]? // 5
What is m[1][1]? // same as n[1][1]

What about n[0][5]? // 6

n[1] = m[0];
what is n[1][1] now? // 2

n[1][1]++;
what are all elements of m? // 1 3 3 4 5 6

n[1][3]++;
what are all elements of m? // 1 3 3 5 5 6


## Performance Realities

Programmers must optimize at multiple levels
* Big-O: algorithm, data representations
* Systems: optimize memory access, I/O, parallelize execution

## Steps of manual optimization

1. Identify bottlenecks - Bottleneck is CPU? Disk/SSD? Network? others?
2. Measure program performance - If CPU is the bottleneck, profile a program’s execution to figure out which code path takes the most time

One sentence short, the biggest challenge for every programmers is: *how to improve performance without destroying code modularity and readability*. While contributing to [mlpack](https://github.com/mlpack/mlpack), I saw maintainers giving up the use of GPU for performance improvements because it made the code too messy and unmaintainable.

You cannot rely on compiler optimization because compiler must generate the safe machine code that behaves same in any circumstances, which limits the scope of optimization. When in doubt, the compiler must be conservative.

## Getting Higher Performance

Use compiler optimization flags and watch out for:
 - hidden algorithmic inefficiencies
 - Watch out for optimization blockers
 - procedure calls & memory aliasing

Always profile the program’s performance.

## Code Motion
 - Reduce frequency with which computation performed
 - If it will always produce same result

```c
void set_row(double *a, double *b, long i, long n)
{
  long j;
  for (j = 0; j < n; j++)
    a[n*i+j] = b[j];
}
```
In assembly the above function looks like below:
```
set_row:
  testq		%rcx,		%rcx	# Test n
  jle		.L1			# If 0, goto done
  imulq		%rcx,		%rdx	# ni = n*i  redundant!!
  leaq		(%rdi,%rdx,8),	%rdx 	# rowp = A + ni*8
  movl		$0, 		%eax	# j = 0
.L3:					# loop:
  movsd		(%rsi,%rax,8),	%xmm0	# t = b[j]
  movsd		%xmm0, 	(%rdx,%rax,8)	# M[A+ni*8 + j*8] = t
  addq		$1,		%rax	# j++
  cmpq		%rcx,		%rax	# j:n
  jne		.L3			# if !=, goto loop
.L1:					# done:
  rep ; 	ret
```
To improve the performance, take the redundant multiplication out of the loop like below:
```c
long j;
int ni = n*i;
for (j = 0; j < n; j++)
	a[ni+j] = b[j];
```

## Replace Costly Operation with Simpler One

* Shift, add instead of multiply or divide (ex: `16*x-->x << 4`)
* Recognize sequence of products

```c
for (i = 0; i < n; i++) {
  int ni = n*i;
  for (j = 0; j < n; j++)
    a[ni + j] = b[j];
  }
}
```
In this case, replacing the multiplication with addition improves the performance.
```c
int ni = 0;
for (i = 0; i < n; i++) {
  for (j = 0; j < n; j++)
    a[ni + j] = b[j];
    ni += n;
  }
}
```

## Share Common Subexpressions
Reuse portions of expressions (GCC will do this with –O1).

The below code has 3 multiplications: i\*n, (i–1)\*n, (i+1)\*n.
```c
/* Sum neighbors of i,j */
up =    val[(i-1)*n + j  ];
down =  val[(i+1)*n + j  ];
left =  val[i*n     + j-1];
right = val[i*n     + j+1];
sum = up + down + left + right;
```
In assembly the above function looks like below:
```
leaq	1(%rsi),	%rax	# i+1
leaq	-1(%rsi),	%r8	# i-1
imulq	%rcx,		%rsi	# i*n
imulq	%rcx,		%rax	# (i+1)*n
imulq	%rcx,		%r8	# (i-1)*n
addq	%rdx,		%rsi	# i*n+j
addq	%rdx,		%rax	# (i+1)*n+j
addq	%rdx,		%r8	# (i-1)*n+j
```

This code the the same work but there is only 1 multiplication in the code below: i\*n.
```c
long inj = i*n + j;
up =    val[inj - n];
down =  val[inj + n];
left =  val[inj - 1];
right = val[inj + 1];
sum = up + down + left + right;
```
In assembly the above function looks like below:
```
imulq	%rcx,		%rsi	# i*n
addq	%rdx,		%rsi	# i*n+j
movq	%rsi,		%rax	# i*n+j
subq	%rcx,		%rax	# i*n+j-n
leaq	(%rsi,%rcx),	%rcx	# i*n+j+n
```

## Optimization Blocker 1. Procedure Calls

```c
void lower(char *s)
{
  size_t i;
  for (i = 0; i < strlen(s); i++)
    if (s[i] >= 'A' && s[i] <= 'Z')
      s[i] -= ('A' - 'a');
}
```

Question: What’s the big-O runtime of lower, O(n)?  

![lower-case-graph](/images/machine-prog/lower-case-graph.png)
Answer: Quadratic performance!

Strlen takes O(n) to finish and strlen is called n times, which makes the whole function O(n^2).

```c
void lower2(char *s)
{
  size_t i;
  size_t len = strlen(s);
  for (i = 0; i < len; i++)
    if (s[i] >= 'A' && s[i] <= 'Z')
      s[i] -= ('A' - 'a');
}
```

In order to remedy this, we move call to strlen outside of loop. Since result does not change from one iteration to another. The improved performance is shown below.

![lower-case-optimized](/images/machine-prog/lower-case-optimized.png)


## Optimization Blocker 2. Memory Aliasing

Aliasing means when two different memory references specify single location. It is easy to happen in C since it is allowed to do address arithmetic and direct access to storage structures is possible. In order to control this, get in habit of introducing local variables. See the variables accumulating within loops.

The aggressive reuse of memory is one of the ways through which programmers make code fast, and it is important for the correctness and speed of your program that you understand how a program might alias buffers.

```c
/* Sum rows is of n X n matrix a and store in vector b  */
void sum_rows1(double *a, double *b, long n) {
    long i, j;
    for (i = 0; i < n; i++) {
      b[i] = 0;
      for (j = 0; j < n; j++)
        b[i] += a[i*n + j];
    }
}
```
In assembly the above function looks like below:
```
# sum_rows1 inner loop
.L4:
        movsd   (%rsi,%rax,8),	%xmm0	# FP load
        addsd   (%rdi),		%xmm0	# FP add
        movsd   %xmm0,	(%rsi,%rax,8)	# FP store
        addq    $8,		%rdi
        cmpq    %rcx,		%rdi
        jne     .L4
```
Code updates b[i] on every iteration. Programmers must consider possibility that these updates will affect program behavior. Let's remove the aliasing like below.

```c
/* Sum rows is of n X n matrix a and store in vector b  */
void sum_rows2(double *a, double *b, long n) {
  long i, j;
  for (i = 0; i < n; i++) {
    int val = 0;
    for (j = 0; j < n; j++){
        val += a[i*n + j];
         b[i] = val;
    }
  }
}
```
In assembly the above function looks like below:
```
# sum_rows2 inner loop
.L10:
        addsd   (%rdi),	%xmm0	# FP load + add
        addq    $8,	%rdi
        cmpq    %rax,	%rdi
        jne     .L10
```
There is no need to store intermediate results anymore.

## Memory Layout

* Stack
 - Runtime stack (8MB limit)
 - E. g., local variables
* Heap
 - Dynamically allocated as needed
 - When call  malloc(), calloc(), new()
* Data
 - Statically allocated data
 - E.g., global vars, static vars, string constants
* Text  / Shared Libraries
 - Executable machine instructions
 - Read-only

Each memory segment can be readable, executable, writable (or none at all). Segmentation fault occurs when program tries to access illegal memory. For example, when reading from segment with no permission or writing to read-only segments of the memory.


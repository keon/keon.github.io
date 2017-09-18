---
date: 2017-09-08 12:00:00
title: Concurrent Programming With Go
author: Keon Kim
categories:
  - cs
---


![gorace](/images/goroutine/gorace.png)

Things that are happening in the world are not ordered. We are living in a world of interacting, independently behaving things. If you want to simulate or interact with the real world, we need concurrency, a term that [Rob Pike from Google/IO](https://www.youtube.com/watch?v=f6kdp27TYZs) defines as *the composition of independently executing computations*.

Concurrency feature is one of the strongest features of Go. Using Go, You can write concurrent programs without considering all the details such as threads, locks, barriers, and etc.

<!--more-->

## Concurrency vs Parallelism

Concurrency is not parallelism. A program is a parallel when it executes instructions at the same time, which is not possible if you have only one processor. Concurrency still can happen on just one CPU if you are dealing with the tasks independently. Parallelism is doing a lot of things at once (simultaneous execution) and Concurrency is dealing with a lot of things at once (structuring tasks).

Concurrency gives you a way to structure a program into many independent pieces. But you have to coordinate those pieces. To make that work, you need some form of communication.

## What Is A Goroutine?

**Goroutines** are independently executing functions launched by the `go` statement. Goroutines are not threads, but they act just like threads. You can think of it as an extremely cheap and lightweight threads. It is so cheap that we could call thousands of goroutines running concurrently. It has its own call stack, and it can grow and shrink the size of the call stack as required. You don't need to worry about managing the stack since it is managed by the Go runtime. Just launch goroutines and you don't have to think about it much.

## Basic Goroutine Examples

Here is a boring function that counts in the loop while sleeping for one second in each iteration.

```go
func boring(msg string) {
  for i := 0; ; i++ {
    fmt.Println(msg, i)
    time.Sleep(time.Second)
  }
}
```

If we want to make this function a concurrent one, we should use `go` keyword. Whenever `go` keyword is called, it launches a new goroutine. You can think of goroutine as an independent program. So in the example below, `main()` is launching a new goroutine `boring()` in a completely new environment.

```go
func boring(msg string) {
  for i := 0; i++ {
    fmt.Println(msg, i)
    time.Sleep(time.Duration(rand.Intn(1e3)) * time.Millisecond)
  }
}

func main() {
  go boring("boring!")
}
```

However, the example above does not print out anything in the console. That is because `main()` finishes before `boring()`. All `go` keyword is doing is launching a function independently. It does not wait for `boring()` to finish and return. I mean, that is the whole point of the goroutine. `boring()` and `main()` are running concurrently. If this was a complex program, `main()` could be doing one thing while `boring()` is working on something else.

If we want to see the outputs of `boring()`, we need to keep `main()` busy and wait until `boring()` finishes.

```go
func main() {
  go boring("boring!")
  time.Sleep(5 * time.Second)
}
```

Now you will see the outputs of `boring()`. But if you are a good programmer, you will instantly realize that this is very flaky.

## Using Channels For Communication Between Goroutines

![channel](/images/goroutine/channel.jpg)

The example above was kind of pointless. They were not communicating or synchronizing their behavior in any way. It was like running two programs independently. We need goroutines to communicate with each other to do more useful things. In order to communicate among the goroutines, we need to use a concept of a **channel** in Go. A channel in Go can be declared with `make()`.

```go
c := make(chan int)
```

The channel `c` we created above can be used to send or receive integer variables across the goroutines. You can use an arrow when you want to send a value on a channel.

```go
c <- 1
```

And you can receive a value from the channel using the arrow again. The arrow indicates the direction of dataflow.

```go
value = <- c
```
"
The Go approach to a concurrent software is characterized as "Don't communicate by sharing memory, share memory by communicating". In order words you don't have some blob of memory and then put locks, mutexes and condition variables around it to protect it from parallel access. Instead, you actually use the channel to pass the data back and forth between the goroutines.
"

## Concurrency Patterns in Go

#### Generator: function that returns a channel

Channels are first-class values, just like strings or integers. You can return a channel from a function.
We could launch the goroutine inside the function which wraps the anonymous function literal launched with the `go` keyword. When `boring()` is called, it starts the computation concurrently and returns the results back via the channel.
```go
// returns receive-only channels of strings
func boring(msg string) <-chan string {
  c := make(chan string)
  // launch the goroutine from inside the function
  go func() {
    for i:=0; ; i++ {
      c <- fmt.Sprintf("%s %d", msg, i)
      time.Sleep(time.Duration(rand.Intn(1e3)*time.Millisecond))
    }
  }()
  // return the channel to the caller
  return c
}
```
In the main function, we call the boring function and it returns the channel.

```go
c := boring("boring!")
for i := 0; i < 5; i++ {
  fmt.Printf("You say: %q\n", <-c)
}
fmt.Println("you are boring, I am leaving")
```

This is very much like handling a service. Our boring function returns a channel that lets us communicate with the boring service it provides. We can have more instances of the service.

```go
func main() {
  joe := boring("Joe")
  ann := boring("Ann")
  for := 0; i < 5; i++ {
    fmt.Println(<-joe)
    fmt.Println(<-ann)
  }
}
```

The out put of the function above is synchronized, which means `joe` and `ann` will take turns. This is because the blocking nature of the channels. This might be useful for some cases, but it won't be so useful when they should be running independently. If Ann is ready to send a value but Joe hasn't done that yet, Ann will still be blocked, waiting to deliver the value to main.

#### Multiplexing

We can instead use a fan-in function to let whosoever is ready to talk.

```go
func fanIn(input1, input2 <-chan string) <-chan string {
  c := make(chan string)
  go func() { for { c <- <-input1 } }()
  go func() { for { c <- <-input2 } }()
  return c
}
```

We stitch the two guys together with the fan-in function and construct a single channel, from which we can receive from both of them. We internally launch two goroutines, one copying the output from input1 to the channel and the other one copying the data from input2 to the channel. You can think of it as the image below. Two goroutines are both talking to one goroutine which forwards the info to the caller.

![gophermegaphones.jpg](/images/goroutine/gophermegaphones.jpg)

And this could be used in `main()` as below. When we run this, you will see that Ann and Joe are now completely independent and runs not necessarily in sequential order.

```go
func main() {
  c := fanIn(boring("Joe"), boring("Ann"))
  for i := 0; i < 10; i++ {
    fmt.Println(<-c)
  }
}
```

#### Sequential Running

Channels are first-class values in Go. That means we can pass a channel on a channel. We can send inside a channel another channel to be used for the answer to come back. To do this, what we do is we construct a message structure that includes the message that we want to print, and we include inside there another channel that is what we call a wait channel.

```go
type Message struct {
  str string
  wait chan bool
}
```

The guy will block on the wait channel until the next person says, OK, I want you to go ahead.

```go
for i := 0; i < 5; i++ {
  msg1 := <-c; fmt.Println(msg1.str)
  msg2 := <-c; fmt.Println(msg2.str)
  msg1.wait <- true
  msg2.wait <- true
}
```

```go
// shared between all messages
waitForIt := make(chan bool)
```

```go
c <- Message(fmt.Sprint("%s: %d", msg, i), waitForIt)
time.Sleep(time.Duration(rand.Intn(1e3)*time.Millisecond))
<-waitForIt
```

## Select Statement

A select is like a switch that lets you control the behavior of your program based on what communications are able to proceed at any moment. It looks a lot like a switch, but each case is a communication instead of an expression.


```go
select {
case v1 := <-c1:
  fmt.Printf("received form %v from c1\n", v1)
case v1 := <-c2:
  fmt.Printf("received form %v from c2\n", v1)
case c3 <- 23:
  fmt.Printf("sent %v to c3\n", 23)  
default:
  fmt.Printf("no one was ready to communicate\n", v1)
}

```

When Go reaches the top of the select, it evaluates all of the channels that could be used for communication inside the cases, and then it blocks until one of them is ready to run. And once one is available to run, that case executes and the whole select goes on. So it is much like a regular switch statement, except it blocks until a communication can proceed. You can set a default case, and if there's no default, then the select will block forever until the channel can proceed. If there is a default, if nobody can proceed right away, then just executes the default. This gives you the way to do non-blocking communication.

Sometimes multiple channels are available at the same time. When that happens, the select statement chooses one randomly. So you can't depend on the order in which the communications will proceed.

We can rewrite the original fan-in function using only one goroutine with the help of select statement.

```go
func fanIn(input1, input2 <-chan string) <-chan string {
  c := make(chan string)
  go func() {
    for {
      select {
      case s := <-input1: c <- s
      case s := <-input2: c <- s
      }
    }
  }()
  return c
}
```

#### Timeout Using Select

We can simulate timeout using a call to a function in the library called time.After.
The time.After function returns a channel that blocks for the specified duration. After the interval, the channel delivers the current time, once.

```go
c := boring("Joe")
for {
![gophermegaphones.jpg](/images/goroutine/gophermegaphones.jpg)gophereartrumpet.jpg
  select {
  case s := <-c:
    fmt.Println(s)
  case <-time.After(1 * time.Second):
    fmt.Println("You're too slow. Timeout")
    return
  }
}
```
This select statement says either we can get a message from Joe, or a second's gone by and he hasn't said anything, in which case, we'll just get out of here. So time.After is a function inside the standard library that returns a channel that will deliver a value after the specified interval.

In some cases we might just care only about the total time elapsed running the loop, not the time taken for each iteration. If we want the entire loop (not just one iteration) to timeout after the specified interval, we could save the timeout channel by calling `time.After` outside of the loop. The example below will end the loop after five seconds irrelevant to the number of iterations.

```go
c := boring("Joe")
timeout := time.After(5 * time.Second)
for {
  select {
  case s := <-c:
    fmt.Println(s)
  case <-timeout:
    fmt.Println("You're too slow. Timeout")
    return
  }
}
```

#### Quit Channel Using Select

We can turn this around and tell Joe to stop when we're tired of listening to him. Instead of using timeout, we can deterministically tell the goroutine to

```go
quit := make(chan bool)
c := boring("Joe", quit)
for i := rand.Intn(10); i >= 0; i-- { fmt.Println(<-c) }
quit <- true
```

```go
select {
case c <- fmt.Sprintf("%s: %d", msg, i):
  // do nothing
case <- quit:
  return
}
```

If we want to synchronize the calller and callee before shutting down, we can use `quit` channel for the round-trip communication.

```go
quit := make(chan string)
c := boring("Joe", quit)
for i := rand.Intn(10); i >= 0; i-- { fmt.Println(<-c) }
quit <- "Bye!"
fmt.Printf("Joe says: %q\n", <-quit)
```

```go
select {
case c <- fmt.Sprintf("%s: %d", msg, i):
  // do nothing
case <- quit:
  cleanup()
  quit <- "See you!"
  return
}
```

## Chinese Whispers, Gopher Style

![gophereartrumpet.jpg](/images/goroutine/gophereartrumpet.jpg)

Hey guys I heard you like channels so I put a channel in your channel. By putting a channel in a channel in a channel in a channel... we can play Chinese Whispers game.

```go
func f(left, right chan int) {
  left <- 1 + <- right
}

func main() {
  const n = 10000
  leftmost := make(chan int)
  right := leftmost
  left := leftmost
  for i:=0; i<n; i++ {
    right = make(chan int)
    go f(left, right)
    left = right
  }
  go func(c chan int) { c <- 1 }(right)
  fmt.Println(<-leftmost)
}
```

You'd be surprised to see how fast it finishes the loop. This example verifies that goroutines are very very cheap and lightweight.



## References

* [Google I/O 2012 - Go Concurrency Patterns (Video)](https://www.youtube.com/watch?v=f6kdp27TYZs)
* [Google I/O 2013 - Advanced Go Concurrency Patterns (Video)](https://www.youtube.com/watch?v=QDDwwePbDtw&t=169s)
* [Rob Pike - 'Concurrency Is Not Parallelism' (Video)](https://www.youtube.com/watch?v=cN_DpYBzKso&t=181s)
* [Vincent Batts - Golang: The good, the bad, & the ugly (Video)](https://www.youtube.com/watch?v=cMYhGNofHA4)
* [Gopherfest 2017: The State of Go by Francesc Campoy (Video)](https://www.youtube.com/watch?v=dyvpF0jF3AY)
* [Go Talks 2014](https://talks.golang.org/2014/)
* [Advanced Go Concurrency Patterns](https://talks.golang.org/2013/advconc.slide)
* [How Goroutines Work](http://blog.nindalf.com/how-goroutines-work/)
* [Learn Concurrency](https://github.com/golang/go/wiki/LearnConcurrency)

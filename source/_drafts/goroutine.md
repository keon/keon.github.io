---
date: 2017-07-21 12:00:00
title: Concurrent Programming with Goroutine
author: Keon Kim
categories:
  - cs
---


![gorace](/images/goroutine/gorace.png)

Things that are happening in the world are not ordered. We are living in a world of interacting, independently behaving things. If you want to simulate or interact with the real world, we need concurrency, the composition of independently executing computations.

<!--more-->

Concurrency feature is one of the strongest feature of Go. Using Go, You can write concurrent programs without considering all the details such as threads, locks, barriers, and etc.

## Concurrency vs Parallelism

Concurrency is not parallelism, although it enables parallelism. A program is a parallel when it executes instructions at the same time, which is not possible if you have only one processor. Concurrency still can happen on just one CPU if you are dealing with the tasks independently. Parallelism is doing a lot of things at once (simultaneous execution) and Concurrency is dealing with a lot of things at once (structuring tasks).

Concurrency gives you a way to structure a program into many independent pieces. But you have to coordinate those pieces. To make that work, you need some form of communication.

## Basics

```
func boring(msg string) {
  for i := 0; i++ {
    fmt.Println(msg, i)
    time.Sleep(time.Duration(rand.Intn(1e3)) * time.Millisecond)
  }
}
```

```
func main() {
  go boring("boring!")
}
```



## References

* [Google I/O 2012 - Go Concurrency Patterns (Video)](https://www.youtube.com/watch?v=f6kdp27TYZs)
* [Google I/O 2013 - Advanced Go Concurrency Patterns (Video)](https://www.youtube.com/watch?v=QDDwwePbDtw&t=169s)
* [Rob Pike - 'Concurrency Is Not Parallelism' (Video)](https://www.youtube.com/watch?v=cN_DpYBzKso&t=181s)
* [Vincent Batts - Golang: The good, the bad, & the ugly (Video)](https://www.youtube.com/watch?v=cMYhGNofHA4)
* [Gopherfest 2017: The State of Go by Francesc Campoy (Video)](https://www.youtube.com/watch?v=dyvpF0jF3AY)
* [Go Talks 2014](https://talks.golang.org/2014/)
* [Advanced Go Concurrency Patterns](https://talks.golang.org/2013/advconc.slide)
* [How Goroutines Work](http://blog.nindalf.com/how-goroutines-work/)

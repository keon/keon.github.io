---
date: 2017-03-03 12:00:00
title: Intro to High Performance Computing in MPI
author: Keon Kim
---


This blog post will teach you

- underastand the message-passing model for parallel programming
- write parallel programs in C using the MPI library

The MPI library is the most important piece of software in parallel programming. All the world's largest supercomputers are programmed using MPI. Writing parallel programming using MPI is fun!
<!--more-->

It is surprisingly different from serial programming. It does make you think a bit.

## Message Passing Concepts

There are many languages and implementations in Serial Programming. In message-passing parallel programming, there is only MPI. There are lots of implementations such as Intel MPI, OpenMPI, Cray MPI. But there is only one library, which is a good thing. If you learn MPI, you will be able to code every super computers in the world.

The message passing model is based on the notion of processes. In teh message passing model, parallelism is achieved by having many processes co-operate on the same task. Each process has access only to its own data (all variables are private). Processes communicate with each other by sending and receiving messages. Typically library calls from a conventional sequential languages.

Python also has a nice interface to MPI.

In order for the two processes to communicate, the sender and receiver of the messages should be explicitly programmed. For example, when you want Process 1 to send data to Process 2, you have to use the send() in Process 1 and use receive() in Process 2 to fully implement the communication.

## Single Program Multiple Data (SPMD)

Most message passing programs use the Single-Program-Multiple-Data (SPMD) model. All processes run (their own copy of) the same program. Each process has a separate copy of the data. To make this useful, each process has a unique identifier. Processes can follow different control paths through the program, depending on their process ID. Usually run one process per processor / core. 

```c
int main (int argc, char**argv) {
  if (controller_process) {
    Controller(/* Arguments */)
  } else {
    Worker (/*Arguments*/)
  }
}
```

## What Are Messages?

A message transfers a number of data items in a certain type from the memory of one process to the memory of another process.

A message typically contains:

- the ID of the sending processor
- the ID of the receiving processor
- the type of the data items
- the number of data items
- the data itself
- a message type identifier

We cannot construct a complicated data types in messages. It is just a raw data.


## Synchronous vs Asynchronous

Sending a message can either be synchronous or asynchronous. A synchronous send is not completed until the message has started to be received. An asynchronous send completes as soon as the message has gone. Receives are usually synchronous - the receiving process must wait until the message arrives.

It is very easy to cause a deadlock. If one process is expecting an message and the other process is not sending it, the receiver will just sit there forever waiting.



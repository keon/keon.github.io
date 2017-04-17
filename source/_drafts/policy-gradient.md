---
date: 2017-02-26 12:00:00
title: Building A Simple Pong AI Using Policy Gradient
author: Keon Kim
---

![animation](/images/policy-gradient/animation.gif)

This blog post will demonstrate how to implement a simple game AI using policy gradient algorithm. We'll them apply it to master the Pong game using Keras and Gym. The whole code is about 100 lines.
<!--more-->
I briefly went over the definition of reinforcement learning in [this post.](https://keon.io/rl/deep-q-learning-with-keras-and-gym/) So please take a look if you are unfamiliar with the concept.

The code used for this article is on [GitHub.](https://github.com/keon/policy-gradient)

## What Is Policy Gradient?

Note that Policy Gradient (PG for short) is one of the most popular reinforcement learning algorithms. It is even popular than DQN. Even AlphaGo's algorithm was also derived from this algorithm. According to this famoous [blog post](http://karpathy.github.io/2016/05/31/rl/), it turns out that Q learning is not that great after all. And most people tend to use Policy Gradient instead.

**PG works better than Q learning because it is end-to-end**. In DQN, the neural net approximated the value based on the states. And policy (action) was generated greedily from the approximated value using `argmax()`, which just picked the action with a higher reward. This is called `value-based` reinforcement learning. In Policy Gradient, we will directly output policy instead of the reward, and we call this `policy-based` reinforcement learning.

## What Are The Advantages Of Using PG?

An advantage of this approach is that it can work effectively in high-dimensional or continuous action spaces. Also, it can learn stochastic policies, meaning that it can learn to act randomly when it is the best policy. For example, it would be optimal to act randomly when you are playing rock-paper-scissors game. Trying to learn any optimal policy other than random policy will result in opponent learning that certain pattern, losing the game.

So for those reasons, we'll approximate the policy directly from the input. 

## Pong Game

## Convolutional Neural Network

Since it is a 'deep' reinforcement model which uses more than two neural net layers, we have to have some understanding of them.

## Why Does It Take So Long To Train?

This is because our agent does not have any common sense. When we learn to play a game, we already have a background knowledge about the world. For example, we already know what a ball and a wall looks like, and when a ball hits a wall, it will bounce off. This model we created does not know any of that. It has to start by learning some pixels represent ball and paddle. This is the cause of very slow learning rate at the beginning 1~6000 episodes. After that, the learning rate slowly improves as it now made good sense of the world and finally started learning the game.


## References

* [Deep Reinforcement Learning: Pong from Pixels](http://karpathy.github.io/2016/05/31/rl/)

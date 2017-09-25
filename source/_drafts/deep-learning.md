---
date: 2017-09-24 12:00:00
title: Building Blocks Of Deep Learning
author: Keon Kim
categories:
  - dl
---

We will sweep through the some basics and recent trends of deep learning. That's right. We are going to shallowly learn different parts of deep learning. I am writing this to refresh my fundamentals, so I guess it could be useful to those who want to do the same.

<!--more-->


## Artificial Neuron


<!-- neuron input activation (pre activation) -->
$$
a(x) = b + \sum_i{ w_i x_i } = b + \textbf{w}^\top \textbf{x}
$$

And we pass this through the activation function. The output range is determined by g().

$$
h(x) = g(a(x)) = g(b + \textbf{w}^\top \textbf{x})
$$

## Activation Functions

#### Linear Activation Function

Performs no input squashing. Not interesting

#### Sigmoid

$$
sigm(a) = \sigma(a) =  \frac{1}{1+exp(-a)}
$$

squashes the neuron's pre-activation between 0 and 1.
Always positive.
bounded.
stricktly increasing.


#### Hyperbolic Tangent (tanh)


$$
tanh(a) = \frac{exp(a) - exp(-a)}{exp(a) + exp(-a)} = \frac{exp(2a)-1}{exp(2a)+1}
$$

squashes the neuron's input between -1 and 1.
Can be positive or negative.
Bounded. Stricktly increasing.

#### Rectified Linear Activation function

$$
reclin(a) = max(0, a)
$$

bounded below by 0 and not upper bounded.
monotonically increasing
tends to give neurons with sparse activities.
(gives exact 0)

## Capacity of A Single Neuron

Could do binary classification.
We can interpret neuron as estimating p(y = 1|x)
if greater than 0.5, predict class 1, otherwise predict class 0.
(similar idea can be applied to tanh)

Decision boundary is linear.
It draws a straight line between two classes.

However, it cannot solve non linearly separable problems.

we can solve this problem by using multiple neurons.


## Multi-Layered Neural Networks




## References

I referred to the following sources while writing this article. Please check them out if you wish to more.


* [Stanford's Deep Learning for Natural Langauge Processing Course Materials](http://cs224d.stanford.edu/index.html)
* [Oxford's Deep Natural Language Processing Course Materials](https://github.com/oxford-cs-deepnlp-2017/lectures)
* [Word Embeddings: Encoding Lexical Semantics](http://pytorch.org/tutorials/beginner/nlp/word_embeddings_tutorial.html)
* [Natural Language Understanding with Distributed Representation][2]

[1]: http://web.eecs.utk.edu/~itamar/courses/ECE-692/Bobby_paper1.pdf "LSTM"
[2]: https://arxiv.org/abs/1511.07916 "Natural Language Understanding with Distributed Representation"

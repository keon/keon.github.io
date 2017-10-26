---
date: 2017-07-21 12:00:00
title: Variational Autoencoder For Text Generation
author: Keon Kim
categories:
  - cs
---


Bayesian inference offers a unique framework to reason about uncertainty.
Its an approach to statistics in which all forms uncertainty are expressed in terms of probability.
At anytime when there is an evidence for and against something, which leads to probability, a chance that it is true.
When you learn something new, you have to fold this new evidence into what you already know to create a new probability.
Bayesian theory describes this process mathematically.

The idea for the VAE came when these two ideas merged. Bayesian and Deep Learning.

Looking at it through a Bayesian likeness, we treat the inputs, hidden representations, and reconstructed outputs of a VAE, as a probabilistic random variables within a directed graphical model.
So it contains a specific probability model of some data, x, and latent or hidden variables, z.

We


* [Generating Sentences from a Continuous Space](https://arxiv.org/pdf/1511.06349.pdf)

---
date: 2017-09-26 12:00:00
title: Deep Learning For Natural Language Processing
author: Keon Kim
categories:
  - dl
---

![seq2seq.png](/images/deep-nlp/seq2seq.png)

By the end of the article, you will understand the thoughts and techniques behind Google Translate, Siri, and recent advances in natural language processing using deep learning. We will casually sweep the important components, not going into too much details. Minimal code examples using PyTorch will be accompanying with the explanations, so this is geared towards those who already know basic machine learning and neural networks. We will also talk about what advances can be made in the near future. Let's get it.

<!--more-->

## Deep Learning

This is our special ingredient for doing what we are doing in this article. They are magical.

#### Recurrent Neural Networks (RNN)

#### Long Short-Term Memory (LSTM)

[[1][1]]

## Word Embeddings

Think how we should represent the meaning of a word in a computer. There are some questions we should think about: How do we represent the intensity and nuances of each words? How do we keep our algorithm up to date?

Just grouping them by the synonyms will be very labor intensive and won't be able to answer all the questions above. In order to make this better, we need to make the computer *learn* to represent the words in the *continuous space*. Similar words will be placed next to each other, but not lose the nuances. How do we make the computer learn the vocabularies?

I

We can apply math and do all kinds of fun things with this.

There is an answer that will satisfy.


## Text Generation

## Text Classification

## Sequence-to-Sequence

#### Encoder Decoder

#### Attention Mechanism

#### Memory Networks

## Applications of Seq2Seq

#### Question Answering

#### Machine Translation


## References

I referred to the following sources while writing this article. Please check them out if you wish to more.

[1]: http://web.eecs.utk.edu/~itamar/courses/ECE-692/Bobby_paper1.pdf "LSTM"

* [Stanford's Deep Learning for Natural Langauge Processing Course Materials](http://cs224d.stanford.edu/index.html)
* [Oxford's Deep Natural Language Processing Course Materials](https://github.com/oxford-cs-deepnlp-2017/lectures)
* [Word Embeddings: Encoding Lexical Semantics](http://pytorch.org/tutorials/beginner/nlp/word_embeddings_tutorial.html)

---
date: 2017-10-17 12:00:00
title: Methods For Adversarial Deep Text Generation
author: Keon Kim
categories:
  - dl
---


<!--more-->

## Deep Learning for Text Generation

## Generative Adversarial Networks for Text Generation

[1] original shit

[3] Yu et al. - policy gradient
[6] Che et al. - importance sampling

[8] Rajeswar et al.
To summarize the technical contribution of the paper (and the authors are welcome to correct me in the comments if I missed something), adversarial training for discrete sequences (like RNN generators) is hard, for the following technical reason: the output of each RNN time step is a multinomial distribution over the vocabulary (a softmax), but when we want to actually generate the sequence of symbols, we have to pick a single item from this distribution (convert to a one-hot vector). And this selection is hard to back-prop the gradients through, because its non-differentiable. The proposal of this paper is to overcome this difficulty by feeding the discriminator with the softmaxes (which are differentiable) instead of the one-hot vectors. That’s pretty much it.

t needs to separate one-hot vectors from non-one-hot-vectors. This is… kind of a weak adversary. And has nothing to do with natural languageness.

 Dzmitry Bahdanau, in the comments, points that the adversary may be more effective and less naive than what I am saying, because of its being a Wasserstein GAN. This may well be, I’d trust Dzmitry’s opinion on this more than my own, I am not an expert in this. But I still would like to see the point about spikiness being mentioned and evaluated explicitly. It is possible that the W-GAN is doing more than it seems, but show me the experiments to support that!




## Variational Autoencoder for Text Generation


## References

[1]: https://arxiv.org/abs/1406.2661 "Goodfellow er al., Generative Adversarial Networks"
[2]: https://arxiv.org/abs/1605.07725 "Miyato et al., Adversarial Training Methods for Semi-Supervised Text Classification"
[3]: https://arxiv.org/abs/1609.05473 "Yu et al., SeqGAN: Sequence Generative Adversarial Nets with Policy Gradient"
[4]: https://arxiv.org/abs/1701.06547 "Li et al., Adversarial Learning for Neural Dialogue Generation"
[5]: https://arxiv.org/abs/1701.07875 "Arjovsky et al., Wasserstein GAN"
[6]: https://arxiv.org/abs/1702.07983 "Che et al., Maximum-Likelihood Augmented Discrete Generative Adversarial Networks"
[7]: https://arxiv.org/abs/1704.00028 "Gulrajani et al., Improved Training of Wasserstein GANs"
[8]: https://arxiv.org/abs/1705.10929 "Rajeswar et al., Adversarial Generation of Natural Language"
[9]: https://medium.com/@yoav.goldberg/an-adversarial-review-of-adversarial-generation-of-natural-language-409ac3378bd7 "An Adversarial Review of 'Adversarial Generation of Natural Language'"
[10]: https://arxiv.org/abs/1707.02812 "Samanta et al., Towards Crafting Text Adversarial Samples"

---
date: 2017-09-24 12:00:00
title: Deriving Cross Entropy
author: Keon Kim
categories:
  - dl
---


## Information Theory

According to Shannon's information theory, the concept of information strongly depends on the context.
"""
For instance, my full first name is Lê Nguyên. But in western countries, people simply call me Lê. Meanwhile, in Vietnam, people rather use my full first name. Somehow, the word Lê is not enough to identify me in Vietnam, as it’s a common name over there. In other words, the word Lê has less information in Vietnam than in western countries. Similarly, if you talk about “the man with hair”, you are not giving away a lot of information, unless you are surrounded by soldiers who nearly all have their hair cut.

But what is a context in mathematical terms?
A context corresponds to what messages you expect. More precisely, the context is defined by the probability of the messages. In our example, the probability of calling someone Lê in western countries is much less likely than in Vietnam. Thus, the context of messages in Vietnam strongly differs from the context of western countries.

OK… So now, what’s information?
Well, we said that the information of Lê is greater in western countries…

So the rarer the message, the more information it has?
Yes! If *p* is the probability of the message, then its information is related to 1/*p*. But this is not how Shannon quantified it, as this quantification would not have nice properties. Shannon’s great idea was to define information rather as the number of bits required to write the number 1/*p*. This number is **its logarithm in base 2**, which we denote as:

$$ \log_2({\frac{1}{p(x)}}) $$

Now, this means that it would require more bits to digitize the word Lê in western countries than in Vietnam

## Entropy

Entropy represents the average of information. In other words, it is a measure of the scarcity of the information of some X. It is defined as:

Simply saying, the quantity of information implies how surprising the probability of the event x is. For example, if someone wins a lottery, it is a freakin surprising information. This deserves to have high information. We use log in base 2 to describe how many bits are required to represent this 1/p(x).

To get entropy we multiply this value with the probability and add them up.

$$
H_{p}(X) = -\sum_x p(x) log_2({p(x)})
$$

In other words, this is the calculation of the average of all events' information of some probability distribution p(x). This is a measure of information that p(x) has. For example, a coin that has 50% chance for each sides has more entropy than the one that has 80% to 20% for each sides.

In case of 5:5, the entropy is -{0.5 \* -1 + 0.5 \* -1} = 1
In case of 8:2, the entropy is -{0.8 \* -0.332 + 0.2 \* -2.322} = 0.722

1. sigmoid function은 확률값을 리턴합니다.
단순히 0과 1사이여서 확률값을 리턴하는게 아니구요.
통계에서는 odds와 probability 가 있습니다.
likelihood와 probability와 비슷합니다. 쉽게 말하면 관점이 데이터 관측치와 확률의 차이입니다.
이 odd ratio와 probability를 매핑해주는 함수를 logit, logistics 함수라고 하구요.

logit: probability -> odd ratio로 바꿔줍니다.
logistics: odd ratio -> probability를 바꿔줍니다.

즉, logit의 역함수이죠. 여기서 logistics이 logistics regression과 sigmoid에서 쓰이는 함수 이구요.
그래서 저 식을 구하면 sigmoid랑 비슷하게 나오게 되는데 과정에 log가 들어가는데
log는 수학에서 natural log를 선호하기 때문에 자연상수가 여기서 나오게 되고 겸사겸사 미분 식도 간단해지기 때문에 현재와 같은 sigmoid를 사용합니다.

2. Activation Function은 비선형 함수이기만 하면 됩니다. 이미 하나의 뉴론이 모든 로직게이트를 표현 할 수 있고 비선형성만 추가해주면 모든 함수를 나타낼 수 있기 때문이죠. 그러면 모든 문제를 풀 수 있게 되구요. 그런데 여기서 Activation Function으로 가장 만만한 sigmoid를 사용했던 것입니다. 사용한 이유는 이미 로지스틱 회귀 함수에서 쓰이는 함수였고 위와 같은 이유로 통계를 근거로 되기도 쉬웠고 0과 1사이 값으로 바운드 되어있고 미분이 쉽고 게다가 monotonic 이었기 때문이죠.

그런데 여러가지 문제점이 있었기 때문에 좀더 다른 함수들이 나타나게 된 것이구요. 그럼에도 아직 RNN이나 여러 부문에서 계속 사용되고 있습니다.

'여러가지 문제점'에 대해 코멘트 드리겠습니다. 이런 문제들 때문에 최근에는 Relu등의 사용을 더 선호하는 편입니다.

1. 자연상수 사용으로 인한 상대적으로 높은 계산부하
2. 미분값 소멸: 시그모이드의 미분식 특성상, 시그모이드의 결과값이 0 또는 1에 수렴할 경우 미분값은 0에 수렴합니다. 이런 상황이 예기치않게 반복되면 학습이 잘 되지 않겠죠. (weight가 업데이트되지 않으므로)
3. Non-zero centered output: 시그모이드의 결과값은 (0,1) range를 갖게 됩니다. (위 댓글에 그래프도 있네요.) 이는 모든 결과값이 양수라는 말인데요. 이로인해 시그모이드의 미분값 또한 항상 양수가 되어, weight를 최적화하는 과정에서 zig-zagging이 일어나기 쉽습니다. 즉, 최적값을 찾는데 오랜시간이 걸리게 됩니다. (e.g. z=wx + b이고 sigmoid(z)=a. 이때 모든 x값이 양수면,
dsigmoid(z)/dw = x*a*(1-a) 이므로 모든 weight에 대만 미분값도 양수가 됨.)

normal distribution에 대한 cross entropy가 mse입니다.
네트웍 아웃풋이 Multinomial distribution을 가진다고 했을때, 이 분포가 True distribution (true label의 one-hot vector) 에 가까워 지도록 MLE(Maximum Likelihood Estimation)로 학습을 하게 되는데, 이때 log prob을 maximize 한다고 하면 cross entropy 형태로 loss가 나오게 됩니다.. 아래 Hwalsuk Lee 님이 링크해주신 글에 설명이 상세히 나와 있네요.. 물론 네트웍 아웃풋이 Normal Distribution이면 MSE형태로 loss가 나오구요..

## Otehr

* C(H(x), y) = - ylog(H(x)) - (1-y)log(1-H(x)) 이지요?

S1를 y=1일 때의 p(x)인 H(x)로 대체하고,
따라서
S0는 y=일 때의 p(x)이므로 1-H(x)가 되겠네요.

Li는 y가 1일 때, 0일 대로 나누면 결국 cross entopy는 Logistic cost와 같습니다.

사실 이것은
확률론에서 나온,  Negative Log Likelihood와 같습니다.
주어진 data(x)로부터 특정 결론(y)가 나왔을 때,
이러한 결과가 나올 확률이 lilelihood 이고,
이러한 결과가 최대가 되도록
- Log Likelihood도 최대가 되고
- Negative Log Likelihood는 최소가 되고.. --> Loss function, Cost Function

------------------------------------------------------------------
logistic 에서는 y값이 0 또는 1 이있는데,
이를 one-hot encoding 벡터로 바꿔서 cross entropy를 적용해 보세요.
0=>[1, 0], 1=>[0, 1].
------------------------------------------------------------------
logistic 을 풀자면
-log(H(x))   : y = 1 => [0, 1]
-log(1-H(x)) : y = 0 => [1, 0]

cross entropy 를 풀자면
sigma(Li * -log(Si))

y = L, H(x) = S 이므로

L:[0, 1], S:H(x)
sigma([0, 1] ( * ) -log[0, 1]) = 0

L:[1, 0], S:1-H(x)
sigma([1, 0] ( * ) -log[1-0, 1-1]) = sigma([1,0] ( * ) -log[1,0]) = 0

이 대입으로 보면 logistic cost & cross entropy 는 같은 의미입니다.﻿

## References

* [Shannon's Information Theory][1]
* [Why You Should Use Cross-Entropy Error Instead Of Classification Error Or Mean Squared Error For Neural Network Classifier Training][2]
* [Kullback-Leibler Divergence Explained][3]
* [Information Theory / Distance Metric for PDF (Korean)](http://newsight.tistory.com/119)
* [Likelihood & LogLikelihood](https://onlinecourses.science.psu.edu/stat504/node/27?fref=gc&dti=255834461424286)
* [Cross Entropy and KL Divergence](https://tdhopper.com/blog/2015/Sep/04/cross-entropy-and-kl-divergence/)
* [Maximum Likelihood as Minimize KL-Divergence](http://www.hongliangjie.com/2012/07/12/maximum-likelihood-as-minimize-kl-divergence/)
* [Probability vs Likelihood (Korean)](http://rstudio-pubs-static.s3.amazonaws.com/204928_c2d6c62565b74a4987e935f756badfba.html#----maximum-likelihood-estimator-mle)

[1]: http://www.science4all.org/article/shannons-information-theory/ "Shannon's Information Theory"
[2]: https://jamesmccaffrey.wordpress.com/2013/11/05/why-you-should-use-cross-entropy-error-instead-of-classification-error-or-mean-squared-error-for-neural-network-classifier-training/ "why CEE"
[3]: https://www.countbayesie.com/blog/2017/5/9/kullback-leibler-divergence-explained "Kullback-Leibler Divergence Explained"

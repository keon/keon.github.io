---
date: 2017-08-19 12:00:00
title: Learning To Predict The Speed Of A Car
author: Keon Kim
categories:
  - dl
---

![train_normal](/images/speed/speed.png)

Basically, your goal is to predict the speed of a car from a video.

<!--more-->

## Comma.ai Programming Challenge


```
Welcome to the comma.ai 2017 Programming Challenge!

Basically, your goal is to predict the speed of a car from a video.

data/train.mp4 is a video of driving containing 20400 frames. Video is shot at 20 fps.
data/train.txt contains the speed of the car at each frame, one speed on each line.

data/test.mp4 is a different driving video containing 10798 frames. Video is shot at 20 fps.
Your deliverable is test.txt

We will evaluate your test.txt using mean squared error. <10 is good. <5 is better. <3 is heart.
```

## Dataset Analysis

### Train Dataset

<img src="/images/speed/plot_train_speed.png" alt="plot_train_speed" style="width: 100%; max-width: 400px;"/>

Total 17 minutes
0:00 ~ 12:30 highway
12:31 ~ 17:00 house area (4 min 30 sec)


### Test Dataset

Test dataset is total of 9 minutes.
0:00 to 1:30 we are trained (1 min 30 sec)
From 1:30 to 4:30 it gets into the highway (3 min)
4:30 to 9:00 is the house area. (4 min 30 sec)

## Considerations

Sliding window

## Result


## References

* [End to End Learning for Self-Driving Cars - Bojarski et al.](https://arxiv.org/abs/1604.07316)
* [Large-scale Video Classification with Convolutional Neural Network - Karpathy et al.](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/42455.pdf)
* [Playing Atari with Deep Reinforcement Learning](https://arxiv.org/abs/1312.5602)
* [An augmentation based deep neural network approach to learn human driving behavior](https://chatbotslife.com/using-augmentation-to-mimic-human-driving-496b569760a9)
* [Autonomous Vehicle Speed Estimation from dashboard cam](https://chatbotslife.com/autonomous-vehicle-speed-estimation-from-dashboard-cam-ca96c24120e4)

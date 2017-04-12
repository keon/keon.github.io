---
date: 2016-12-26 12:00:00
title: The Light Speed is Not Fast Enough
author: Keon Kim
categories:
  - etc
---


A thought came to my head while playing Overwatch. Light is known to travel Earth 7.5 times in a second. In other words, it takes 133.333ms for a light signal to do a round trip. Imagine a client and a server is on the exact opposite side of the Earth. No matter how advanced the technology is, it is impossible to shorten the latency below 133.333ms, even if the overhead is 0.
<!--more-->
Most recognize the importance of the bandwidth, but not the latency. People tend to overlook the cause of the latency and blame the routers for the lag in the game. Latency is the time delay that is caused while a signal travels between a node to another node. The signal can be anything, ranging from electricity, wave, or light. Any form of those signals can be categorized as electromagnetic signals.

The maximum speed of any type of information transfer is limited to the speed of light. And we know that nothing in the universe can travel faster than the light, as long as Einstein’s Theory of Relativity is still in effect.

![http://www.feasa.ie/fiberoptics.html](/images/light-speed/fiberoptic.jpg)

It is not a problem for ordinary network applications. It is usually the bandwidth that causes the problems for them. But in the real-time applications like games or high-frequency-trading, where time literally defines the fun and the value, latency becomes an important problem. We have fiber optic cables which allow us to communicate in light speed (Light travels 31% slower in Optic Fibre, but let us ignore it for now), but it is the light speed that is making all the problems. The speed of 300,000 KM/S is just too slow for two users from New York and Seoul to play a real-time game.

‘Frame’ is the currency for Games. Everything in a game (position of each character, bullets, and etc) is processed in each frame. Good real time games have to show 60 frames in a second. This means the game has to show a new frame in every 16.666ms. If the roundtrip takes 133.33ms, it takes about 4 frames for information to be sent to the server on the other side of the earth, and another 4 frames to receive. 8 frames are about 133.328ms. This might look not that bad, but in a real-time game, it is a noticeable time.

So most games today overcome this difficulty by setting up regional servers for each continent. This shortens the physical distance between the server and clients. However, this still does not guarantee the latency to drop below 1 frame. Even though we use light as a medium of transferring information, it would be impossible for two players from different continents to play FPS game; they will experience serious lag.

In the real world situation, where we have to use devices to send and receive the signals and fiber optic cable for the communication, the performance drops significantly.

According to [Theoretical vs real-world speed limit of Ping](http://royal.pingdom.com/2007/06/01/theoretical-vs-real-world-speed-limit-of-ping/),

> The actual distance traveled will be longer, more like zigzag than a straight line. Repeaters, switches, and routers will slow down transfer speeds. The more equipment the signal has to pass through (for example routers), the longer it will take to reach its target…Even with fiber optics (glass) the speed of light is about 30% slower than through vacuum or air, and most of the distance covered will be through the fiber.
> With all this in mind, you should probably double the “ideal” response times shown above for a more realistic target to aim at. It’s useful to know when there is room to push for better network performance, and when the actual physical limits set in.

## Bandwidth vs Latency

Telecommunication companies advertise the increase of bandwidth as faster network speed, which is misleading. Bandwidth never means the speed of the network, but the amount of data that can be sent in a unit of time. We so far discussed in terms of the physical limit of speed, but in reality, a signal has to go through multiple routers to reach the designated address. When the router receives the signal, it stores the signal in the buffer. Then it calculates which way the signal is heading, and this slows down the process of the communication.

If you take a closer look, there is also a small delay in the network card, too. When a program requests a data signal to be sent to the network card, the signal stays in the buffer of the network card for a moment and sent as soon as the line is available. Counting everything, the traveling time of a signal, in reality, is a lot slower than the light speed even if we use lights as the communication medium.

Try to ping a server on the opposite side of the world. You will discover that it is impossible to get below 100 milliseconds. If you do get any number below 100, you are going to win the Nobel Prize for the monumental discovery. In conclusion, the latency is the physical limit that humanity can never overcome.

![ping](/images/light-speed/ping.png)

On top of that, latency is variable in real life. The latency always changes according to the condition of the network card, router, and everything that works as the middle man. In order to overcome the limits, software engineers use various techniques such as dead reckoning. Today’s game engine developers deserve some appreciation for their work.

## Could This Problem Be Solved In The Future?

Even in the distant future where technology is so advanced, it will still be impossible to decrease the network latency between opposite sides of the Earth below 133.333ms. Bandwidth will increase, but we cannot decrease the latency. It will forever be a burden for software engineers. This is all because the light speed is not fast enough.

-----------
## References

* [When the Speed of Light is Too Slow](http://www.kurzweilai.net/when-the-speed-of-light-is-too-slow)
* [Theoretical vs real-world speed limit of Ping](http://royal.pingdom.com/2007/06/01/theoretical-vs-real-world-speed-limit-of-ping/)
* [Speed of Light is Not Fast Enough](http://www.scientiareview.org/pdfs/109.pdf)

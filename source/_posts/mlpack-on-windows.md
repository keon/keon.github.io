---
date: 2016-11-27 16:57:04
title: How to install mlpack on windows
author: Keon Kim
categories:
  - mlpack
---

<img src="/images/mlpack-on-windows/mlpack.svg" style="background-color:rgba(0,0,0,0);" height=150 alt="mlpack: a scalable C++ machine learning library">
I usually use Vim on Ubuntu for any type of development.
Lately I tried installing mlpack on Windows 10 to try programming on Visual Studio 2015, which I heard is very good for debugging.

<!--more-->

I used [appveyor](https://github.com/mlpack/mlpack/blob/master/.appveyor.yml) instructions to build mlpack. I think this is the simplest way of building mlpack since most of the dependencies (except for armadillo) used is pre-compiled.

If you want to compile every dependencies from source, please refer to [this blog](http://qtandopencv.blogspot.kr/2015/09/deep-learning-04-compile-mlpack-1012-on.html)

## Prerequisites

The following tools are needed:

* CMake [Windows win64-x64 Installer](https://cmake.org/download/)
* Visual Studio 2015 (Visual Studio 2013 lacks some powerful C++11 features, that mlpack uses.)

## Step 1, Download mlpack.

First, create a project folder. For this example, I used `C:/projects/` folder. And download the latest stable version of mlpack and place it under projects folder. So the folder structure now becomes `C:/projects/mlpack-2.0.1/`.

`Warning`: I got unsuccessful with 2.0.1 release. Instead, download from the [master branch on github](https://github.com/mlpack/mlpack).

## Step 2. Setup mlpack in Visual Studio and download some dependencies using NuGet.

![step2-1](/images/mlpack-on-windows/1.png)

open Visual Studio and click `File > New > Project from Existing Code`.

![step2-2](/images/mlpack-on-windows/2.png)
![step2-3](/images/mlpack-on-windows/3.png)

Select Visual C++ (not that important) and select the file location (in this case, `C:/projects/mlpack-2.0.1/`). Give any project name (can be anything, but I used mlpack for this example) and click `Finish`.


Next, it is time to download the dependencies using NuGet. NuGet is something like apt-get for debian. It makes things a lot easier and less time consuming.

![step2-4](/images/mlpack-on-windows/4.png)

Go to `Tools > NuGet Package Manager > Manage NuGet Packages for Solution` and click `Browse` tab.

![step2-5](/images/mlpack-on-windows/5.png)

I want to download OpenBLAS so search for it and click the project (mlpack) which you want to apply.

![step2-9](/images/mlpack-on-windows/9.png)

You can search for the names of the dependencies to download. If somehow you don't see NuGet Package Manager on your menu, you need to install [NuGet for Visual Studio](https://visualstudiogallery.msdn.microsoft.com/5d345edc-2e2d-4a9c-b73b-d53956dc458d).

Do the same for the following dependencies.

* boost
* boost_unit_test_framework-vc140
* boost_program_options-vc140
* boost_random-vc140
* boost_serialization-vc140
* boost_math_c99-vc140
* OpenBLAS

![step2-10](/images/mlpack-on-windows/10.png)

When you are done, you should see the packages installed in `C:projects/mlpack-2.0.1/packages`. To make them easier to work with CMake, you should gather all boost libraries into one folder. To do that, make a new folder named `boost_libs` under `packages` folder.

Now copy and paste everything (total of 5) under the following folders to `boost_libs`

* boost_math_c99-vc140.1.60.0.0/lib/native/address-model-64/lib
* boost_program_options-vc140.1.60.0.0/lib/native/address-model-64/lib
* boost_unit_test_framework-vc140.1.60.0.0/lib/native/address-model-64/lib
* boost_serialization-vc140.1.60.0.0/lib/native/address-model-64/lib
* boost_random-vc140.1.60.0.0/lib/native/address-model-64/lib

now `boost_libs` should look like the following picture.

![step2-12](/images/mlpack-on-windows/12.png)

## Step 3, Download Armadillo and Build it.

Unfortunately, there is no NuGet package of Armadillo. So we need to build it manually.

Download the latest stable version of [Armadillo](http://arma.sourceforge.net/download.html). As a courtesy, the Armadillo package contains pre-compiled 64bit versions of standard LAPACK and BLAS. You extract it anywhere, but for this example I extracted it under `C:/projects/` folder. `projects` folder now cotains `armadillo-7.100.3` and `mlpack-2.0.1`

Under `armadillo-7.100.3`, create a new folder named `build`. And now go to command prompt by pressing windows button and typing cmd. Make sure you can use cmake in the command prompt.
go to the `build` folder you just made, and copy and paste the following (all in one line).

![step3-13](/images/mlpack-on-windows/13.png)

```
cmake -G "Visual Studio 14 2015 Win64" -DBLAS_LIBRARY:FILEPATH="C:/projects/mlpack-2.0.1/packages/OpenBLAS.0.2.14.1/lib/native/lib/x64/libopenblas.dll.a" -DLAPACK_LIBRARY:FILEPATH="C:/projects/mlpack-2.0.1/packages/OpenBLAS.0.2.14.1/lib/native/lib/x64/libopenblas.dll.a" -DCMAKE_PREFIX:FILEPATH="C:/projects/armadillo" -DBUILD_SHARED_LIBS=OFF ..
```

If you used different directories other than ones used in this example, you must change the input accordingly. I broke the lines so that it is easier for you to edit.

```
cmake
-G "Visual Studio 14 2015 Win64"
-DBLAS_LIBRARY:FILEPATH="C:/projects/mlpack-2.0.1/packages/OpenBLAS.0.2.14.1/lib/native/lib/x64/libopenblas.dll.a"
-DLAPACK_LIBRARY:FILEPATH="C:/projects/mlpack-2.0.1/packages/OpenBLAS.0.2.14.1/lib/native/lib/x64/libopenblas.dll.a"
-DCMAKE_PREFIX:FILEPATH="C:/projects/armadillo"
-DBUILD_SHARED_LIBS=OFF ..
```

![step3-14](/images/mlpack-on-windows/14.png)

Cmake then should create many files below build folder. click on `armadillo.sln` file to open with Visual Studio. Next, click "Build > Build Solution" to build armadillo.
When you are done, close Visual Studio and go to step 4.

## Step 4, Build mlpack.

Now you can finally build mlpack!

The instructions are same as building armadillo, so it should be easier as you've already done it once.

![step3-15](/images/mlpack-on-windows/15.png)

Copy and paste the following to the commandline.


```
cmake -G "Visual Studio 14 2015 Win64" -DBLAS_LIBRARY:FILEPATH="C:/projects/mlpack-2.0.1/packages/OpenBLAS.0.2.14.1/lib/native/lib/x64/libopenblas.dll.a" -DLAPACK_LIBRARY:FILEPATH="C:/projects/mlpack-2.0.1/packages/OpenBLAS.0.2.14.1/lib/native/lib/x64/libopenblas.dll.a" -DARMADILLO_INCLUDE_DIR="C:/projects/armadillo-7.100.3/include" -DARMADILLO_LIBRARY:FILEPATH="C:/projects/armadillo-7.100.3/build/Debug/armadillo.lib" -DBOOST_INCLUDEDIR:PATH="C:/projects/mlpack-2.0.1/packages/boost.1.60.0.0/lib/native/include" -DBOOST_LIBRARYDIR:PATH="C:/projects/mlpack-2.0.1/packages/boost_libs" -DDEBUG=OFF -DPROFILE=OFF ..
```
Again, if you used different directories along the way, you must edit it accordingly. I broke down the flags for you.

```
cmake
-G "Visual Studio 14 2015 Win64"
-DBLAS_LIBRARY:FILEPATH="C:/projects/mlpack-2.0.1/packages/OpenBLAS.0.2.14.1/lib/native/lib/x64/libopenblas.dll.a"
-DLAPACK_LIBRARY:FILEPATH="C:/projects/mlpack-2.0.1/packages/OpenBLAS.0.2.14.1/lib/native/lib/x64/libopenblas.dll.a"
-DARMADILLO_INCLUDE_DIR="C:/projects/armadillo-7.100.3/include"
-DARMADILLO_LIBRARY:FILEPATH="C:/projects/armadillo-7.100.3/build/Debug/armadillo.lib"
-DBOOST_INCLUDEDIR:PATH="C:/projects/mlpack-2.0.1/packages/boost.1.60.0.0/lib/native/include"
-DBOOST_LIBRARYDIR:PATH="C:/projects/mlpack-2.0.1/packages/boost_libs"
-DDEBUG=OFF -DPROFILE=OFF ..
```

![step3-16](/images/mlpack-on-windows/16.png)

now open the `mlpack.sln` file (under the build folder) with Visual Studio.

![step3-17](/images/mlpack-on-windows/17.png)

Click `Build > Build Solution`. It is going to take a while to build. And congratulations!

You just successfully built mlpack.


*notice*

if while building mlpack in a windows Visual Studio environment and you receive error C1128 go to the the specific project in Solution Explorer highlight it > Next go to 'Project' > 'Properties' > 'C/C++' > 'Command Line' and add /bigobj to 'Additional Options. After that mlpack will build successfully on Visual Studios 15'

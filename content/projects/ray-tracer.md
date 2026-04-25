---
dropcap: "false"
aliases: []
description:
title: Parallel Ray Tracer
tags:
  - cpp
  - graphics
  - project
date created: Saturday, April 25th 2026, 12:18 am
date modified: Saturday, April 25th 2026, 1:25 am
file_title: ray-tracer
draft: "true"
---

**Tech Stack:** C++, oneTBB, CMake

![Raytracer](/static/raytracer-1920-150-50.png)

## Overview

A custom parallel ray tracing solution built in C++.

## Features

* **Physically-Based Rendering (PBR):** Implements diffuse (Lambertian), metallic, and dielectric (glass/water) materials.
* **Parallelism:** Utilizes **oneTBB** to distribute rendering across multiple CPU cores.
* **Antialiasing:** Samples each pixel with multiple rays in order to smooth out edges.
* **Depth of Field:** Implements a positionable camera with depth of field, resulting in blurred background objects.


## Links

* [Source Code](https://github.com/augustryder/Ray-Tracer)

---

[[index|Back to Projects]]

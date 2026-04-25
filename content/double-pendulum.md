---
dropcap: "false"
aliases: []
description:
title: Chaotic Pendulum
tags:
  - physics
  - project
date created: Saturday, February 7th 2026, 8:10 pm
date modified: Saturday, April 25th 2026, 1:27 am
file_title: double-pendulum
---

<iframe src="/static/projects/double-pendulum/index.html" width="100%" height="700" style="border: none; border-radius: 8px;"></iframe>

<p style="text-align: center;"><a href="/static/projects/double-pendulum/index.html" target="_blank">Open fullscreen</a> | <a href="https://github.com/augustryder/Chaotic-Pendulum" target="_blank">Source Code</a></p>

## Overview

An interactive chaotic pendulum simulation showcasing chaotic dynamics. Simulation logic written in C++ and compiled to WebAssembly (WASM). Rendered using PixiJS and TypeScript.

The double pendulum, or chaotic pendulum, is a system that comprises of a pendulum attached to the end of another pendulum. This system is governed by a set of coupled non-linear ordinary differential equations that cannot be solved analytically. In my simulation I implement fourth-order Runge-Kutta (RK4) integration to numerically solve the differential equations.

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { useSpring, a, config } from '@react-spring/three';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';
// Import user's photo
import mpPhoto from '../assets/mp.jpg';
import cardImage from '../assets/image.png';
import Spline from '@splinetool/react-spline';

export default function InteractiveCard() {
  return (
    <Spline scene="https://prod.spline.design/PhsjEHQ1TczC5KZo/scene.splinecode" />
  );
}
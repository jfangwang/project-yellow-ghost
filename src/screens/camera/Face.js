import React, { useEffect, useState } from 'react'
import * as facemesh from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import './Face.css'
import { isMobile } from 'react-device-detect';
import Stats from 'stats.js';
import * as tfjsWasm from '@tensorflow/tfjs-backend-wasm';
import { TRIANGULATION } from './triangulation';

export default function Face({ height, width, flipCamCounter, incFlipCam }) {

  const [vidh, setVidh] = useState(null);
  const [vidw, setVidw] = useState(null);
  const [portrait, setPortrait] = useState(false);
  const [ar, setAr] = useState(16 / 9.5);

  tfjsWasm.setWasmPaths(
    `https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm@${tfjsWasm.version_wasm}/dist/`);

  const NUM_KEYPOINTS = 468;
  const NUM_IRIS_KEYPOINTS = 5;
  const GREEN = '#32EEDB';
  const RED = "#FF2C35";
  const BLUE = "#157AB3";

  function distance(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
  }

  function drawPath(ctx, points, closePath) {
    const region = new Path2D();
    region.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      const point = points[i];
      region.lineTo(point[0], point[1]);
    }

    if (closePath) {
      region.closePath();
    }
    ctx.stroke(region);
  }

  let model, ctx, videoWidth, videoHeight, video, canvas, rafID;

  const VIDEO_SIZE = 500;
  const stats = new Stats();
  const state = {
    backend: 'webgl',
    maxFaces: 1,
    triangulateMesh: true,
    predictIrises: true
  };

  async function setupCamera() {
    video = document.getElementById('video');

    const stream = await navigator.mediaDevices.getUserMedia({
      'audio': false,
      'video': {
        facingMode: 'user',
      },
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        resolve(video);
      };
    });
  }

  async function renderPrediction() {
    stats.begin();

    const predictions = await model.estimateFaces({
      input: video
    });
    ctx.drawImage(
      video, 0, 0, videoWidth, videoHeight, 0, 0, canvas.width, canvas.height);

    if (predictions.length > 0) {
      predictions.forEach(prediction => {
        const keypoints = prediction.scaledMesh;

        if (state.triangulateMesh) {
          ctx.strokeStyle = GREEN;
          ctx.lineWidth = 0.5;

          for (let i = 0; i < TRIANGULATION.length / 3; i++) {
            const points = [
              TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1],
              TRIANGULATION[i * 3 + 2]
            ].map(index => keypoints[index]);

            drawPath(ctx, points, true);
          }
        } else {
          ctx.fillStyle = GREEN;

          for (let i = 0; i < NUM_KEYPOINTS; i++) {
            const x = keypoints[i][0];
            const y = keypoints[i][1];

            ctx.beginPath();
            ctx.arc(x, y, 1 /* radius */, 0, 2 * Math.PI);
            ctx.fill();
          }
        }

        if (keypoints.length > NUM_KEYPOINTS) {
          ctx.strokeStyle = RED;
          ctx.lineWidth = 1;

          const leftCenter = keypoints[NUM_KEYPOINTS];
          const leftDiameterY = distance(
            keypoints[NUM_KEYPOINTS + 4],
            keypoints[NUM_KEYPOINTS + 2]);
          const leftDiameterX = distance(
            keypoints[NUM_KEYPOINTS + 3],
            keypoints[NUM_KEYPOINTS + 1]);

          ctx.beginPath();
          ctx.ellipse(leftCenter[0], leftCenter[1], leftDiameterX / 2, leftDiameterY / 2, 0, 0, 2 * Math.PI);
          ctx.stroke();

          if (keypoints.length > NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS) {
            const rightCenter = keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS];
            const rightDiameterY = distance(
              keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 2],
              keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 4]);
            const rightDiameterX = distance(
              keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 3],
              keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 1]);

            ctx.beginPath();
            ctx.ellipse(rightCenter[0], rightCenter[1], rightDiameterX / 2, rightDiameterY / 2, 0, 0, 2 * Math.PI);
            ctx.stroke();
          }
        }
      });
    }

    stats.end();
    rafID = requestAnimationFrame(renderPrediction);
  };

  async function main() {
    await tf.setBackend(state.backend);

    stats.showPanel(0);  // 0: fps, 1: ms, 2: mb, 3+: custom
    document.getElementById('main').appendChild(stats.dom);

    await setupCamera();
    video.play();
    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    video.width = videoWidth;
    video.height = videoHeight;

    canvas = document.getElementById('output');
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.fillStyle = GREEN;
    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 0.5;

    model = await facemesh.load();
    renderPrediction();
  };

  useEffect(() => {
    main();
  }, [])

  useEffect(() => {
    if (isMobile && height > width) {
      setPortrait(true)
    } else {
      setPortrait(false)
    }
  }, [height, width])

  useEffect(() => {
    if (isMobile) {
      if (video) {
        video.pause()
      }
      main();
    }
  }, [portrait])

  return (
    <div
      className="main2"
      id="main"
      style={{
        width: width,
        height: height
      }}
    >
      <video
        autoPlay
        playsInline
        id="video"
        style={{
          transform: "scaleX(-1)",
          width: "100%",
          height: "100%",
          position: "absolute",
          display: "none"
        }}
      />
      <canvas
        id="output"
        style={{
          width: isMobile ? '100%' : (width / height < ar ? "100%" : "auto"),
          height: isMobile ? '100%' : (width / height > ar ? "100%" : "auto"),
          position: "absolute",
        }}
      >
      </canvas>
    </div>
  )
}

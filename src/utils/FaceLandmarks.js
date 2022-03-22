// import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
// import * as tf from '@tensorflow/tfjs-core';
import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-wasm';
import { useEffect } from 'react';
import { drawMesh } from "./drawMesh";
export default function FaceLandmarks(videoId, backend) {

  function distance(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
  }

  async function main() {
    await tf.setBackend(backend)
    console.log("main is called")
    const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');

    // Load the faceLandmarksDetection model assets.
    const model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
    console.log("model loaded")


    // Pass in a video stream to the model to obtain an array of detected faces from the MediaPipe graph.
    // For Node users, the `estimateFaces` API also accepts a `tf.Tensor3D`, or an ImageData object.
    const video = document.getElementById(videoId);
    const canvas = document.getElementById("drawingCanvas")
    const ctx = canvas.getContext('2d');
    const GREEN = '#32EEDB';
    const RED = "#FF2C35";
    const BLUE = "#157AB3";
    const NUM_KEYPOINTS = 468;
    const NUM_IRIS_KEYPOINTS = 5;



    const a = await model.estimateFaces({ input: video, flipHorizontal: true });
    console.log(a[0])
    // ctx.translate(canvas.width, 0);
    async function renderPrediction() {
      const predictions = await model.estimateFaces({ input: video, flipHorizontal: true });

      if (predictions.length > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMesh(predictions, ctx)
      }
      console.log("running")
      if (document.getElementById("stopFace")) {
        requestAnimationFrame(renderPrediction)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    renderPrediction()
  }
  main()
}
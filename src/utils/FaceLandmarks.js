// import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
// import * as tf from '@tensorflow/tfjs-core';
import * as tf from "@tensorflow/tfjs";
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-wasm';
import { useEffect } from 'react';
export default function FaceLandmarks(videoId) {

  main()

  async function main() {
    await tf.setBackend('webgl')
    console.log("main is called")
    const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');

    // Load the faceLandmarksDetection model assets.
    const model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
    console.log("model loaded")

    // Pass in a video stream to the model to obtain an array of detected faces from the MediaPipe graph.
    // For Node users, the `estimateFaces` API also accepts a `tf.Tensor3D`, or an ImageData object.
    const video = document.querySelector("video");
    async function renderPrediction() {
      const faces = await model.estimateFaces({ input: video });
      console.log("faces loaded: ", faces)
      requestAnimationFrame(renderPrediction)
    }
    renderPrediction()
  }
}
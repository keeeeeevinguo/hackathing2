import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { generateAdScript } from './scriptGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});




/**
 * Generate video using Sora API
 */
async function generateVideoWithSora(soraPrompt, imagePath) {
  console.log('Generating video with audio using Sora...');
  console.log('Sora prompt:', soraPrompt);

  try {
    // Resize reference image to 720x1280
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const resizedPath = path.join(outputDir, `reference-720x1280-${Date.now()}.jpg`);
    await sharp(imagePath)
      .resize(720, 1280, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toFile(resizedPath);
    console.log(`Reference image resized to 720x1280: ${resizedPath}`);

    const imageBuffer = fs.readFileSync(resizedPath);
    const inputReferenceFile = await OpenAI.toFile(imageBuffer, 'reference.jpg', { type: 'image/jpeg' });

    const response = await openai.videos.create({
      prompt: soraPrompt,
      size: "720x1280",
      seconds: 8,
      input_reference: inputReferenceFile,
    });

    console.log('Sora API response:', response);

    let video = response;
    while (video.status === 'queued' || video.status === 'in_progress') {
      console.log('Video status:', video.status);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      video = await openai.videos.retrieve(response.id);
    }
    if (video.status === 'failed') {
      throw new Error(video.error?.message || 'Video generation failed');
    }
    console.log('Video finished');

    const downloadResponse = await openai.videos.downloadContent(response.id);
    const content = await downloadResponse.arrayBuffer();

    const videoFilename = `ad-${Date.now()}.mp4`;
    const videoPath = path.join(outputDir, videoFilename);

    fs.writeFileSync(videoPath, Buffer.from(content));
    console.log(`Video saved to: ${videoPath}`);

    return `/output/${videoFilename}`;

  } catch (error) {
    console.error('Error generating video with Sora:', error);

    // If Sora API fails, create a detailed error message
    if (error.response) {
      console.error('Sora API error response:', error.response.data);
    }

    throw new Error(`Sora video generation failed: ${error.message}`);
  }
}

/**
 * Main function to orchestrate the entire video generation pipeline
 */
export async function generateVideoAd({ imagePath, productName, productDescription, consumerProfile }) {
  try {
    console.log('=== Starting AI Video Ad Generation Pipeline ===');
    console.log(`Product: ${productName}`);

    const { script: adScript, scriptPath } = await generateAdScript(productName, productDescription, consumerProfile, imagePath);

    const videoUrl = await generateVideoWithSora(adScript, imagePath);

    console.log('=== Video Ad Generation Complete ===');

    return { videoUrl, scriptPath };

  } catch (error) {
    console.error('Error in video generation pipeline:', error);
    throw error;
  }
}

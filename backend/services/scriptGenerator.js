import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const grok = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: "https://api.x.ai/v1",
  });

export async function generateAdScript(productName, productDescription, consumerProfile, imagePath) {
    console.log('Step 2: Generating ad script and video concept with GPT-4...');

    const isProfile = consumerProfile && typeof consumerProfile === 'object' && Object.keys(consumerProfile).length > 0;
    const consumerProfileText = isProfile
      ? Object.entries(consumerProfile).map(([k, v]) => `${k}: ${v}`).join('\n')
      : '';

    const prompt = `You are a creative advertising director and consumer psychologist. Based on the product and audience profile below, create an entertaining short-form video concept that people would actually want to watch and share.
    Tailor the ad specifically for the following consumer based on their demographics, interests, personality, values and other characteristics: ${consumerProfileText}
    Don't explicitly mention the consumer profile in the script, but use it to tailor the ad to them.

    You will be provided with an image that includes a reference to the product, but the entire ad should be a creative ad video that gets created and scripted for. The first frame is going to be just the product, but you need to change away and then go into the rest of the video
  
    Product Name: ${productName}
  Product Description: ${productDescription || 'Not provided'}

  Create a short video script designed to entertain first, not sell. Think about:
  1. What format would this audience actually engage with? (POV, reaction video, "day in the life", unexpected hook, text-on-screen with trending audio, etc.)
  2. What emotional hook or relatable moment makes someone stop scrolling?
  3. How can you showcase the product naturally within a story, joke, or insight rather than selling it directly?
  4. What would make this person laugh, say "same", or immediately send it to a friend?

  Requirements:
  1. 8 seconds exactly
  2. Specify frame-by-frame detail (what the viewer should see/feel) using the reference image of the product as visual guidance
  3. Make it feel creator-made, not brand-made
  4. No obvious call-to-action or sales language

  Be bold with the creative direction. Surprise me with the format you choose.
  Remember: Every second matters. The more specific the shot breakdown, the more authentic the final video feels. No text overlays ever. All dialogue must finish by the 8-second mark (can trail off naturally).`;

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const ext = path.extname(imagePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
  
    const response = await grok.chat.completions.create({
      model: "grok-4",
      messages: [
        {
          role: "system",
          content: "You are an expert advertising creative director specializing in short-form video ads."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
                detail: "high"
              },
            }
          ]
        }
      ],
      max_tokens: 2000
    });
  
    const script = response.choices[0].message.content;
 
    console.log('Ad script generated');
    
    // Save script to output directory
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const scriptFilename = `script-${Date.now()}.txt`;
    const scriptPath = path.join(outputDir, scriptFilename);
    fs.writeFileSync(scriptPath, script);
    console.log(`Script saved to: ${scriptPath}`);
    
    return { script, scriptPath: `/output/${scriptFilename}` };
  }
# AI Video Ad Generator

A full-stack application that uses AI to generate professional video advertisements from product images. Powered by OpenAI's GPT-4 Vision and Sora.

## Features

- Upload product images with drag-and-drop support
- AI-powered image analysis using GPT-4 Vision
- Target consumer profile customization for tailored ad scripts
- Automatic ad script generation based on product and audience
- Video generation with audio using OpenAI Sora
- AI-generated background music and sound effects
- Real-time progress tracking
- Video preview and download
- Modern, responsive UI

## Tech Stack

### Backend
- Node.js + Express
- OpenAI API (GPT-4 Vision, GPT-4, Sora)
- Multer (file uploads)

### Frontend
- React 18
- Vite
- Axios

## Prerequisites

- Node.js 18+ installed
- OpenAI API key with Sora access

## Setup Instructions

### 1. Install All Dependencies

From the root directory, run:

```bash
npm run install:all
```

This will install dependencies for the root, backend, and frontend.

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your OpenAI API key:

```
PORT=5001
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the Application

From the root directory, simply run:

```bash
npm run dev
```

This will start both the backend (http://localhost:5001) and frontend (http://localhost:3000) simultaneously.

**Alternative - Run Separately:**

If you prefer to run them separately:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

### 4. Use the Application

1. Open http://localhost:3000 in your browser
2. Enter a product name
3. Optionally add a product description
4. Optionally add a target consumer profile (demographics, interests, values, etc.)
5. Upload a product image (drag-and-drop or browse)
6. Click "Generate Video Ad"
7. Wait 1-3 minutes for the AI to generate your video
8. Preview and download your video ad

**Consumer Profile Examples:**
- "Young professionals aged 25-35 who value work-life balance, tech-savvy, environmentally conscious"
- "Parents with young children, budget-conscious, prioritize safety and convenience"
- "Fitness enthusiasts, health-focused, active lifestyle, willing to invest in quality products"

## How It Works

### AI Pipeline

1. **Image Analysis** - GPT-4 Vision analyzes the uploaded product image to identify:
   - Product type and features
   - Colors and visual style
   - Target audience
   - Unique selling points

2. **Script Generation** - GPT-4 creates:
   - Compelling ad script tailored to target consumer profile
   - Key selling points that resonate with the audience
   - Tone and emotion appropriate for the demographic
   - Call-to-action

3. **Video Prompt Creation** - AI generates an optimized Sora prompt with:
   - Specific visual descriptions
   - Camera movements
   - Lighting and atmosphere
   - Professional cinematography techniques

4. **Video Generation** - Sora generates a 10-15 second professional video ad with synchronized audio (background music, sound effects, and ambiance)

## Project Structure

```
hackathing2/
├── backend/
│   ├── server.js              # Express server
│   ├── services/
│   │   └── videoGenerator.js  # AI pipeline
│   ├── uploads/               # Uploaded images
│   ├── output/                # Generated videos
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── App.css            # Styling
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Available Scripts

From the root directory:

- `npm run install:all` - Install all dependencies (root, backend, frontend)
- `npm run dev` - Run both backend and frontend in development mode
- `npm run dev:backend` - Run only the backend server
- `npm run dev:frontend` - Run only the frontend dev server
- `npm run start:backend` - Run backend in production mode
- `npm run build:frontend` - Build frontend for production

## API Endpoints

### `POST /api/generate-ad`

Generate a video ad from a product image.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `image` (file): Product image (JPEG, PNG, WebP)
  - `productName` (string): Name of the product
  - `productDescription` (string, optional): Additional product details
  - `consumerProfile` (string, optional): Target consumer demographics and characteristics

**Response:**
```json
{
  "success": true,
  "videoUrl": "/output/ad-1234567890.mp4",
  "message": "Video ad generated successfully"
}
```

## Troubleshooting

### Sora API Issues

If you encounter Sora API errors, ensure:
- Your OpenAI API key has Sora access enabled
- You're using the correct model name (`sora-turbo`)
- Check the console logs for detailed error messages

### File Upload Issues

- Make sure the image is under 10MB
- Supported formats: JPEG, PNG, WebP

### CORS Issues

The frontend proxy is configured in `vite.config.js` to forward requests to the backend on port 5000.

## Cost Considerations

- GPT-4 Vision: ~$0.01 per image analysis
- GPT-4: ~$0.03 per script generation
- Sora: ~$0.10-0.50 per video (varies by duration and quality)

Estimated cost per video: $0.15-0.55

## Future Enhancements

- Add text overlays with FFmpeg
- Support multiple video styles
- Video templates
- Batch processing
- Cloud storage integration (S3)
- User authentication
- Video editing capabilities

## License

MIT

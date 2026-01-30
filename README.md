# AI Video Ad Generator

A full-stack application that generates personalized video advertisements using AI. Upload a product image, connect your Google Sheet with consumer profiles, and automatically generate tailored video ads for each target audience using OpenAI's GPT-4 Vision and Sora.

## Features

- **Google Sheets Integration** - Automatically read consumer profiles from your spreadsheet
- **Batch Video Generation** - Create personalized videos for multiple consumer segments at once
- **AI-Powered Personalization** - Each video is tailored to specific demographics and preferences
- **Image Analysis** - GPT-4 Vision analyzes product images to identify key features
- **Custom Script Generation** - AI creates compelling ad scripts for each consumer profile
- **Video Creation with Sora** - OpenAI Sora generates professional vertical videos (720x1280, 8 seconds)
- **Automated Email Delivery** - Optionally send generated videos directly to consumers
- **Modern UI** - Clean, responsive interface with drag-and-drop uploads
- **Real-time Progress** - Track video generation progress for multiple ads

## How It Works

1. **Upload Product** - Provide product name, description, and image
2. **Consumer Profiles** - System reads target audiences from your Google Sheet
3. **AI Analysis** - GPT-4 Vision analyzes the product image
4. **Personalized Scripts** - GPT-4 generates custom ad scripts for each consumer profile
5. **Video Generation** - Sora creates a unique video for each target audience
6. **Email Delivery** - Videos are automatically sent to consumers (if email column exists)

## Tech Stack

### Backend
- Node.js + Express
- OpenAI API (GPT-4o, Sora)
- Google Sheets API
- Nodemailer (SMTP email)
- Multer (file uploads)

### Frontend
- React 18
- Vite
- Axios
- Modern CSS with gradients

## Prerequisites

- Node.js 18+
- OpenAI API key with Sora access
- Google Sheets API key
- Google Sheet with consumer profiles
- SMTP credentials (for email delivery)

## Setup Instructions

### 1. Install Dependencies

From the root directory:

```bash
npm run install:all
```

This installs dependencies for root, backend, and frontend.

### 2. Create Google Sheet

Create a Google Sheet with consumer profile data. Example structure:

| Name | Age | Gender | Interests | Location | Email |
|------|-----|--------|-----------|----------|-------|
| John Doe | 28 | Male | Tech, Fitness | NYC | john@example.com |
| Jane Smith | 35 | Female | Fashion, Travel | LA | jane@example.com |
| Mike Johnson | 42 | Male | Business, Golf | Chicago | mike@example.com |

**Column Guidelines:**
- First row = headers (column names)
- Each subsequent row = one consumer profile
- Include an "Email" column if you want videos sent automatically
- All columns are used to build the consumer profile for personalization

### 3. Get Google Sheets API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google Sheets API**
4. Create credentials → API key
5. Copy your API key
6. Make your Google Sheet publicly viewable:
   - Click "Share" → "Anyone with the link" can view

### 4. Get Your Spreadsheet ID

From your Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/1ZJq5rLYNMHLLJA0cQ-F6dqiY-T096KoDsG9O8OB0Wik/edit
                                      ↑ This is your Spreadsheet ID ↑
```

### 5. Configure Environment Variables

Create `backend/.env` (copy from `backend/.env.example`):

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your credentials:

```env
PORT=5001
BASE_URL=http://localhost:5001

# OpenAI
OPENAI_API_KEY=sk-proj-your_openai_api_key_here

# Google Sheets
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here

# Email (Optional - for sending videos to consumers)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Ad Generator" <your_email@gmail.com>
```

**Email Setup Notes:**
- For Gmail: Use an [App Password](https://support.google.com/accounts/answer/185833)
- For testing: Use [Ethereal Email](https://ethereal.email/) (free fake SMTP)
- Email is optional - videos will still generate without SMTP config

### 6. Run the Application

From the root directory:

```bash
npm run dev
```

This starts:
- **Backend**: http://localhost:5001
- **Frontend**: http://localhost:3000

Open http://localhost:3000 in your browser.

## Usage

### Basic Workflow

1. **Open the app** at http://localhost:3000

2. **Enter product details:**
   - Product Name (required)
   - Product Description (optional - adds context)

3. **Upload product image:**
   - Drag and drop or click to browse
   - Supports JPG, PNG, WebP (max 10MB)

4. **Click "Generate Video Ad"**

5. **Wait for generation:**
   - System reads all profiles from your Google Sheet
   - Generates one personalized video per profile
   - Takes 1-3 minutes per video
   - Progress shown in real-time

6. **Review and download:**
   - All videos displayed with their target audience
   - Download individually
   - Videos automatically emailed (if email column exists)

### Example Consumer Profiles

Your Google Sheet might look like:

| Age | Income | Lifestyle | Values | Email |
|-----|--------|-----------|--------|-------|
| 25-35 | $50k-$75k | Active, tech-savvy | Convenience, innovation | segment1@example.com |
| 35-50 | $100k+ | Family-focused | Quality, reliability | segment2@example.com |
| 18-25 | <$40k | Student, social | Affordability, trends | segment3@example.com |

Each row generates a unique video tailored to that demographic.

## Project Structure

```
hackathing2/
├── backend/
│   ├── server.js                    # Express server, Google Sheets integration
│   ├── services/
│   │   ├── videoGenerator.js        # AI pipeline (GPT-4, Sora)
│   │   └── emailSender.js           # Email delivery with Nodemailer
│   ├── uploads/                     # Uploaded product images
│   ├── output/                      # Generated video files
│   ├── .env                         # Environment variables (not in git)
│   ├── .env.example                 # Template for environment setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Main React component
│   │   ├── App.css                  # Component styles
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── vite.config.js               # Vite configuration with proxy
│   └── package.json
├── package.json                     # Root scripts for convenience
└── README.md
```

## API Endpoints

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### `POST /api/generate-ad`

Generate personalized video ads for all consumer profiles in the Google Sheet.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `image` (file): Product image (JPEG, PNG, WebP, max 10MB)
  - `productName` (string): Name of the product
  - `productDescription` (string, optional): Additional product details

**Response:**
```json
{
  "success": true,
  "videos": [
    {
      "videoUrl": "/output/ad-1234567890.mp4",
      "scriptPath": "/output/script-1234567890.txt",
      "consumerProfile": {
        "Age": "25-35",
        "Interests": "Tech, Fitness",
        "Email": "john@example.com"
      },
      "emailSent": true
    }
  ],
  "message": "3 video ad(s) generated successfully"
}
```

## AI Pipeline Details

### Step 1: Google Sheets Data Fetch
- Reads all rows from your spreadsheet
- Each row becomes a consumer profile object
- Skips empty rows automatically

### Step 2: Image Analysis (GPT-4 Vision)
- Analyzes product image once
- Identifies: product type, colors, features, mood, target audience
- Cost: ~$0.01 per request

### Step 3: Script Generation (GPT-4)
- Creates a unique ad script for **each consumer profile**
- Tailors messaging to demographics, interests, and values
- Generates: script, selling points, tone, call-to-action
- Cost: ~$0.01-$0.03 per profile

### Step 4: Video Prompt Creation (GPT-4)
- Optimizes prompts for Sora video generation
- Includes: visuals, camera movements, lighting, cinematography
- One prompt per consumer profile
- Cost: ~$0.01 per profile

### Step 5: Video Generation (Sora)
- Creates 8-second vertical videos (720x1280)
- Professional quality, optimized for social media
- One video per consumer profile
- Cost: ~$0.10-$0.50 per video

### Step 6: Email Delivery (Optional)
- Sends video as email attachment
- Only if "Email" column exists and contains valid email
- Free (uses your SMTP server)

## Cost Estimation

Per video (per consumer profile):
- GPT-4 Vision (image analysis, shared): ~$0.01 total
- GPT-4 (script + prompt): ~$0.02-$0.04
- Sora (video generation): ~$0.10-$0.50
- **Total: ~$0.13-$0.55 per video**

For 10 consumer profiles: ~$1.30-$5.50 per product

## Available Scripts

From the root directory:

- `npm run install:all` - Install all dependencies
- `npm run dev` - Run both backend and frontend
- `npm run dev:backend` - Run only backend (port 5001)
- `npm run dev:frontend` - Run only frontend (port 3000)
- `npm run start:backend` - Run backend in production
- `npm run build:frontend` - Build frontend for production

## Troubleshooting

### Google Sheets Errors

**"No consumer profiles found"**
- Ensure your sheet has data rows below the header
- Check the Spreadsheet ID is correct
- Verify the sheet is publicly viewable

**"Failed to fetch sheet data"**
- Verify your Google Sheets API key
- Enable Google Sheets API in Google Cloud Console
- Check sheet permissions (must be viewable by anyone with link)

### Sora API Errors

**"Sora video generation failed"**
- Verify your OpenAI API key has Sora access
- Check you have sufficient API credits
- Sora may have rate limits or waitlist requirements

### Email Delivery Issues

**Videos generate but emails don't send**
- Check SMTP credentials in `.env`
- For Gmail: use App Password, not account password
- Verify "Email" column exists in your Google Sheet
- Check email addresses are valid

**"Email sent to their email" badge doesn't appear**
- This is normal if SMTP is not configured
- Email delivery is optional - videos still generate and display

### Port Already in Use

**"EADDRINUSE: address already in use"**
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Or change PORT in backend/.env
PORT=5002
```

### File Upload Errors

- Maximum file size: 10MB
- Supported formats: JPEG, PNG, WebP
- Ensure uploads/ directory has write permissions

## Security Notes

- Never commit `.env` files to git (already in `.gitignore`)
- Keep API keys secure and rotate them regularly
- Use App Passwords for Gmail (not your account password)
- Limit Google Sheets API key permissions if possible
- Consider rate limiting for production deployments

## Future Enhancements

- [ ] Video length customization (5-15 seconds)
- [ ] Multiple video styles/templates
- [ ] Custom aspect ratios (square, landscape, vertical)
- [ ] Text overlays and captions with FFmpeg
- [ ] Cloud storage integration (AWS S3, Google Cloud Storage)
- [ ] Batch processing queue for large datasets
- [ ] Analytics dashboard (video views, email opens)
- [ ] User authentication and project management
- [ ] Video editing capabilities
- [ ] A/B testing support

## License

MIT

## Support

For issues or questions:
- Check the troubleshooting section above
- Review environment variable configuration
- Verify API keys and permissions
- Check console logs for detailed error messages

---

Built with OpenAI GPT-4, Sora, Google Sheets API, and React.

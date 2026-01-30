# Personalized AI Ad Generator

A platform that generates personalized video advertisements using AI. Upload a product image and brief description, connect a Google Sheet with consumer profiles, and automatically generate and send a tailored video ad for each consumer.

## Features

- **Google Sheets Integration** - Automatically read consumer profiles from your spreadsheet
- **Batch Video Generation** - Create personalized videos for multiple consumers automatically
- **AI-Powered Personalization** - Each video is tailored to specific demographics, preferences, personalities, etc.
- **Custom Script Generation** - AI creates compelling ad scripts for each consumer profile
- **Video Creation with Sora** - OpenAI Sora generates high quality videos (720x1280, 8 seconds)
- **Automated Email Delivery** - Send generated videos directly to consumers

## How It Works

1. Provide product name, description, and image
2. System reads consumer profiles from Google Sheet
3. Grok-4 analyzes the product image and generates custom ad scripts for each consumer profile
5. Sora creates a video based on the script
6. Videos are automatically sent to consumers via email

## Prerequisites

- Node.js 18+
- OpenAI API key with Sora access
- Grok API key
- Google Sheets API key
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
- For testing: Use [Ethereal Email](https://ethereal.email/) (free fake SMTP)

### 6. Run the Application

From the root directory:

```bash
npm run dev
```

This starts:
- **Backend**: http://localhost:5001
- **Frontend**: http://localhost:3000

Open http://localhost:3000 in your browser.

## Acknowledgements
- [I Built the Ultimate AI UGC Video Ad Generator (Using Sora 2 + n8n)](https://www.youtube.com/watch?v=-HnyKkP2K2c)
- [Open AI Docs + API Reference](https://platform.openai.com/docs/overview)
- [XAI Docs + API Reference](https://docs.x.ai/docs/overview)
- Claude Code

## License

MIT

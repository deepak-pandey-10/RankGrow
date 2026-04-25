# AI SEO & AEO Analyzer

A full-stack web application that analyzes any website for **SEO** (Search Engine Optimization) and **AEO** (Answer Engine Optimization) performance.

## Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | React + Vite + Tailwind CSS         |
| Backend  | Node.js + Express                   |
| HTTP     | Axios (client ↔ server)             |
| Parsing  | Cheerio (server-side HTML analysis) |

## Project Structure

```
SEO and AEO/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # App header with gradient title
│   │   │   ├── UrlInput.jsx        # URL input form
│   │   │   ├── ScoreCard.jsx       # Circular score display
│   │   │   ├── ResultItem.jsx      # Individual check result
│   │   │   ├── AnalysisResults.jsx # Full results container
│   │   │   ├── LoadingState.jsx    # Skeleton loading UI
│   │   │   └── ErrorMessage.jsx    # Error display
│   │   ├── services/
│   │   │   └── api.js              # Axios API calls
│   │   ├── App.jsx                 # Root component
│   │   └── index.css               # Tailwind + custom styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                  # Express backend
│   ├── routes/
│   │   └── analyze.js              # POST /api/analyze endpoint
│   ├── services/
│   │   ├── seoAnalyzer.js          # SEO analysis (10 checks)
│   │   └── aeoAnalyzer.js          # AEO analysis (9 checks)
│   ├── utils/
│   │   └── fetchPage.js            # URL fetcher with axios
│   ├── index.js                    # Express entry point
│   └── package.json
│
└── README.md
```

## Getting Started

### 1. Start the backend

```bash
cd server
node index.js
```

Server runs on `http://localhost:5000`.

### 2. Start the frontend

```bash
cd client
npm run dev
```

Client runs on `http://localhost:3000` with API proxy to the backend.

### 3. Use the app

1. Open `http://localhost:3000` in your browser
2. Enter a website URL (e.g., `github.com`)
3. Click **Analyze** to see SEO & AEO scores

## API Reference

### `POST /api/analyze`

**Request:**
```json
{ "url": "example.com" }
```

**Response:**
```json
{
  "success": true,
  "url": "https://example.com",
  "overallScore": 72,
  "seo": { "score": 85, "results": [...] },
  "aeo": { "score": 59, "results": [...] },
  "analysisTimeMs": 1234
}
```

## What Gets Analyzed

### SEO Checks (10)
- Title tag length & presence
- Meta description optimization
- Heading hierarchy (H1, H2, H3)
- Image alt attributes
- Internal & external links
- Canonical URL
- Viewport meta tag
- Language attribute
- Open Graph tags
- Content word count

### AEO Checks (9)
- JSON-LD structured data
- FAQ schema / Q&A content
- Featured snippet readiness
- Lists & tables (structured content)
- Semantic HTML elements
- HowTo schema detection
- Voice search / Speakable specification
- Topic focus & entity clarity
- Direct answer definitions
# RankGrow

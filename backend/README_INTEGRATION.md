# Mina Backend

This directory contains the Python backend for the Mina AI Shopping Concierge, integrated from [wildhash/Mina](https://github.com/wildhash/Mina).

## Setup

1. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. (Optional) Configure API keys in `.env`:
```bash
cp .env.example .env
# Edit .env and add your API keys
```

API keys are optional - the system works with mock data and fallbacks when keys are not configured.

## Testing the Backend

Test the Python wrapper directly:

```bash
cd backend
python3 api_wrapper.py '{"category": "laptop", "budget_max": 3000, "priorities": ["Performance", "Battery Life"]}'
```

## Integration with Next.js

The Next.js frontend calls the Python backend through:
- **API Route**: `/app/api/search/route.ts` - Accepts POST requests with search parameters
- **Python Wrapper**: `/backend/api_wrapper.py` - Processes requests and returns JSON

## Features

- **AI-Powered Analysis**: Uses Claude for product analysis (with fallback)
- **Multi-Retailer Search**: Browser Use integration for web scraping (with mock data fallback)
- **Confidence Scoring**: Galileo-inspired multi-factor confidence metrics
- **Safe Execution**: Daytona sandbox support for secure processing

## Files

- `mina_agent.py` - Main agent logic
- `api_wrapper.py` - JSON API wrapper for Next.js
- `mina_cli.py` - CLI interface
- `requirements.txt` - Python dependencies
- `.env.example` - Environment variable template

## Documentation

See the markdown files in this directory for detailed documentation:
- `README.md` - Main documentation (from wildhash/Mina)
- `INTEGRATION.md` - Integration guide
- `BACKEND_INTEGRATIONS.md` - Backend service integrations

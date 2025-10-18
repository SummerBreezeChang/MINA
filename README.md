# Mina - AI Shopping Concierge

An intelligent shopping agent that helps you make confident high-end purchase decisions by researching products, analyzing reviews, and providing transparent recommendations with confidence scores.

This project integrates:
- **Frontend**: Next.js/React landing page and product search interface (SummerBreezeChang/mina)
- **Backend**: Python AI agent with Claude, Browser Use, Daytona, and Galileo integrations (wildhash/Mina)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm (for frontend)
- Python 3.8+ and pip (for backend)

### Installation

1. **Install Frontend Dependencies**
```bash
npm install --legacy-peer-deps
```

2. **Install Backend Dependencies**
```bash
cd backend
pip install -r requirements.txt
cd ..
```

3. **Configure Environment (Optional)**
```bash
cd backend
cp .env.example .env
# Edit .env to add your API keys (optional - works without them)
cd ..
```

### Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see the landing page and http://localhost:3000/search to use the product search interface.

## 📁 Project Structure

```
mina/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── search/        # Product search API
│   ├── search/            # Product search page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── backend/               # Python backend (from wildhash/Mina)
│   ├── mina_agent.py      # Main AI agent logic
│   ├── api_wrapper.py     # JSON API wrapper for Next.js
│   ├── requirements.txt   # Python dependencies
│   └── README_INTEGRATION.md  # Backend documentation
├── components/            # React components
│   ├── ui/               # UI primitives
│   ├── hero.tsx          # Hero section
│   ├── how-it-works.tsx  # How it works section
│   └── use-cases.tsx     # Use cases section
└── lib/                  # Utilities
```

## 🎯 Features

### Frontend
- **Modern Landing Page**: Beautiful, responsive design with dark mode
- **Interactive Search Interface**: Multi-step product search wizard
- **Category Selection**: Laptops, Furniture, and Appliances
- **Priority-Based Filtering**: Select what matters most to you
- **Results Display**: Detailed product cards with confidence scores, pros/cons, and specs

### Backend (Python Agent)
- **AI-Powered Analysis**: Claude Sonnet 4 for intelligent product analysis
- **Multi-Retailer Research**: Browser Use integration for web scraping
- **Confidence Scoring**: Multi-factor confidence metrics (rating, fit, reviews, data completeness)
- **Safe Execution**: Daytona sandbox for secure code processing
- **Observability**: Galileo logging and tracing
- **Graceful Fallbacks**: Works without API keys using mock data

## 🔧 How It Works

### User Flow
1. **Visit Landing Page** → Learn about Mina and its features
2. **Start Search** → Click "Start Shopping with Mina"
3. **Select Category** → Choose Laptop, Furniture, or Appliance
4. **Specify Requirements** → Set budget and priorities
5. **Get Recommendations** → View AI-analyzed products with confidence scores

### Technical Flow
```
Frontend (Next.js)
    ↓ POST /api/search
API Route (TypeScript)
    ↓ Execute Python script
Backend (Python)
    ↓ MinaAgent.browse_retailers()
    ↓ MinaAgent.analyze_with_claude()
    ↓ MinaAgent.calculate_confidence_scores()
    ↓ MinaAgent.generate_recommendations()
    ↓ Return JSON
API Route
    ↓ Return to frontend
Results Page (React)
```

## 🛠️ Development

### Frontend Development
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Lint code
```

### Backend Testing
Test the Python backend directly:
```bash
cd backend
python3 api_wrapper.py '{"category": "laptop", "budget_max": 3000, "priorities": ["Performance", "Battery Life"]}'
```

### Adding API Keys (Optional)

The system works without API keys using mock data and fallbacks. To enable full features:

1. **Claude (Anthropic)**: Get key from [console.anthropic.com](https://console.anthropic.com/)
2. **Browser Use**: Get key from [cloud.browser-use.com](https://cloud.browser-use.com/) ($10 free credits)
3. **Daytona**: Get key from [daytona.io](https://www.daytona.io/) ($200 free credits)
4. **Galileo**: Get key from [galileo.ai](https://www.galileo.ai/)

Add keys to `backend/.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-xxxxx
BROWSER_USE_API_KEY=your-key-here
DAYTONA_API_KEY=your-key-here
GALILEO_API_KEY=your-key-here
```

## 📊 Confidence Score Methodology

Mina calculates confidence scores using multiple factors:

- **Customer Ratings (25%)**: Verified buyer ratings and review sentiment
- **Requirements Fit (40%)**: How well the product matches your priorities
- **Review Confidence (20%)**: Volume and consistency of reviews
- **Data Completeness (15%)**: Availability of comprehensive specifications

Scores range from 0-100%, with higher scores indicating greater confidence.

## 🎨 Tech Stack

### Frontend
- Next.js 15 (React 19)
- TypeScript
- Tailwind CSS
- Radix UI components
- Lucide icons

### Backend
- Python 3.8+
- Claude (Anthropic) - AI analysis
- Browser Use - Web scraping
- Daytona - Sandbox execution
- Galileo - Observability
- Pandas & NumPy - Data processing

## 📖 Documentation

- [Backend Integration Guide](backend/README_INTEGRATION.md)
- [Original Backend README](backend/README.md)
- [Backend Integrations Details](backend/BACKEND_INTEGRATIONS.md)
- [Integration Guide](backend/INTEGRATION.md)

## 🤝 Contributing

This project integrates two repositories:
- Frontend: [SummerBreezeChang/mina](https://github.com/SummerBreezeChang/mina)
- Backend: [wildhash/Mina](https://github.com/wildhash/Mina)

Contributions are welcome! Please submit pull requests to the appropriate repository.

## 📝 License

This project integrates code from wildhash/Mina which is licensed under the MIT License.

## 🙏 Acknowledgments

- Backend development by [wildhash](https://github.com/wildhash)
- Frontend design and integration by SummerBreezeChang
- Built with [Anthropic Claude](https://www.anthropic.com/)
- Browser automation powered by [Browser Use](https://browser-use.com/)
- Sandbox execution by [Daytona.io](https://www.daytona.io/)
- Observability by [Galileo.ai](https://www.galileo.ai/)

---

**Made with ❤️ for confident high-end shopping decisions**

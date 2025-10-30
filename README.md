# MINA - Discover Startup Insights in Real-Time

![MINA Banner](./public/images/banner.png) <!-- Add your banner image -->

**Live Demo:** [https://www.mina.ltd/](https://www.mina.ltd/)

## 🚀 Overview

MINA is an AI-powered startup intelligence platform that delivers real-time insights across trends, companies, and funding. Built for founders, investors, and anyone researching the startup ecosystem—all in one clean interface.

Stop jumping between Crunchbase, TechCrunch, and LinkedIn. Get everything you need in real-time, powered by You.com API.

## ✨ Features

### Three Intelligence Modes

🔍 **Trend Research**
- Discover emerging topics across AI, fintech, healthtech, and more
- Track what's gaining momentum right now
- Real-time industry insights

🎯 **Startup Radar**
- Find new companies as they launch
- Track early-stage startups before they hit mainstream
- Company launches and media coverage

💰 **Funding Research**
- Monitor investment rounds in real-time
- Track seed to Series C funding
- See who's raising capital and how much

### Core Capabilities

- **Real-time Data:** Live insights powered by You.com API
- **Smart Categorization:** Automatic industry tagging (AI, SaaS, Fintech, etc.)
- **Detailed Views:** Click any card for summaries and full source articles
- **Clean Interface:** Intuitive design built for fast research
- **Responsive Design:** Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **API:** [You.com Search API](https://documentation.you.com/)
- **Deployment:** Vercel
- **Development:** Built with [V0](https://v0.dev/)

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- You.com API key ([Get one here](https://api.you.com/))

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mina.git
cd mina
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
YOU_API_KEY=your_you_api_key_here
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure
```
mina/
├── app/
│   ├── actions/
│   │   └── search-companies.ts    # You.com API integration
│   ├── results/
│   │   └── page.tsx               # Results page
│   └── page.tsx                   # Home page
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── company-card.tsx           # Insight card component
│   ├── company-detail.tsx         # Detail modal
│   ├── header.tsx                 # Navigation header
│   └── signal-tabs.tsx            # Tab navigation & grid
├── lib/
│   └── utils.ts                   # Utility functions
└── public/
    └── images/                    # Static assets
```

## 🎯 How It Works

1. **Search:** Enter a topic (e.g., "AI", "Fintech", "Climate Tech")
2. **Select Mode:** Choose Trend Research, Startup Radar, or Funding Research
3. **Browse Results:** View real-time insights displayed as cards
4. **Explore Details:** Click any card to see summaries and read full articles
5. **Track Sources:** Each insight links back to the original source

## 🔑 Key Features Explained

### Real-Time Intelligence
Unlike static databases, MINA queries You.com API in real-time to fetch the latest startup news, trends, and funding announcements.

### Smart Parsing
The platform intelligently extracts:
- Company names
- Funding stages (Seed, Series A/B/C)
- Industry categories
- Locations
- Funding amounts
- Publication dates

### Clean UX
Built with designers and researchers in mind:
- Intuitive three-mode navigation
- Scannable card layouts
- Quick access to source articles
- Responsive across all devices

## 🚧 Roadmap

Future enhancements I'm planning:

- [ ] **Data Validation:** Improve accuracy and deduplication
- [ ] **Personalization:** Save searches and create custom feeds
- [ ] **Investor Features:** Market signals, competitor mapping, trend predictions
- [ ] **Export:** Download insights as CSV/PDF
- [ ] **Notifications:** Alert users about new funding rounds or launches
- [ ] **Advanced Filters:** Filter by location, funding stage, company size
- [ ] **API Access:** Let developers integrate MINA data

## 🎨 Design Philosophy

As a designer who codes, I built MINA with these principles:

- **Speed:** Get insights in seconds, not hours
- **Clarity:** Clean interface, no clutter
- **Action:** Every insight links to actionable information
- **Real-time:** Live data, not stale databases

## 🤝 Contributing

This is a hackathon project and learning experiment. Feedback, issues, and pull requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 About

Built by **Summer Chang** - Product Designer & Developer

I created MINA because nothing existed that gave real-time startup intelligence in one place. This project showcases my approach: find the gap, build the solution, iterate.

- **Portfolio:** https://summerchang.co/
- **LinkedIn:** [https://www.linkedin.com/in/summerchang/](https://www.linkedin.com/in/summerchang/)
- **X:** https://x.com/SummerChangCo

## 🙏 Acknowledgments

- Built with [V0](https://v0.dev/) for rapid development
- Powered by [You.com API](https://you.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Inspiration from the startup community

## 📧 Contact

Have feedback or want to collaborate? Reach out!

- Email: your.email@example.com
- LinkedIn: [Connect with me](https://www.linkedin.com/in/summerchang/)

---

**⭐ If you find MINA useful, please star this repository!**

Built with ❤️ for the startup community.

# Nexus Twin: AI-Powered Health & Fitness Digital Twin

## Project Description
Nexus Twin is an innovative health and fitness platform that creates a digital twin of your wellness journey. It uses advanced machine learning models to predict energy levels, recovery, and readiness scores based on your biometric data. The platform combines real-time health metrics analysis with personalized AI coaching and a social matching system for workout partners.

### Key Features
- 🔮 Predictive Health Analytics
- 🤖 AI-Powered Health Coaching
- 🤝 Smart Partner Matching
- 📊 Real-time Health Metrics Dashboard
- 🗺️ Location-based Activity Planning
- 📱 Mobile & Web Interfaces

## Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                      NEXUS-TWIN ECOSYSTEM                       │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js)          │  Backend (FastAPI)               │
│  ├── Authentication          │  ├── ML Prediction Engine        │
│  ├── Dashboard               │  ├── LLM Coach Service           │
│  ├── Health Analytics        │  ├── Matching Algorithm          │
│  ├── Social Matching         │  └── Location/Weather Service    │
│  ├── Location Services       │                                  │
│  └── AI Coach Interface      │                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack
**Frontend:**
- **Framework:** Next.js 14 with TypeScript
- **UI Library:** Radix UI components with shadcn/ui
- **Styling:** Tailwind CSS with custom theme
- **State Management:** React Context API
- **Fonts:** Geist Sans & Mono
- **Analytics:** Vercel Analytics

**Backend:**
- **Framework:** FastAPI (Python)
- **ML/AI:** XGBoost, scikit-learn, pandas, numpy
- **LLM Integration:** OpenRouter API (GPT-3.5-turbo)
- **HTTP Client:** requests
- **Data Processing:** joblib for model serialization

**Infrastructure:**
- **Containerization:** Docker
- **Development:** Hot reload with uvicorn
- **CORS:** Full cross-origin support


## How to Run

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker
- npm (for frontend package management)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
python -m venv venv
# On Windows
.\venv\Scripts\activate
# On Unix
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

### Using Docker
```bash
cd backend
docker stop neurobytes-backend
docker rm neurobytes-backend
docker build -t neurobytes-backend .
docker run -d -p 8000:8000 --name neurobytes-backend neurobytes-backend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## External Sources

### Technologies
- [Next.js](https://nextjs.org/) - React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [XGBoost](https://xgboost.readthedocs.io/) - Machine learning
- [OpenRouter](https://openrouter.ai/) - AI models
- [Shadcn UI](https://ui.shadcn.com/) - UI components
- [Docker](https://www.docker.com/) - Containerization

### APIs & Services
- [MET Norway Weather API](https://api.met.no/) - Weather data
- [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) - Reverse geocoding
- [Overpass API](https://overpass-api.de/) - Location-based fitness venues
- [OpenRouter](https://openrouter.ai/) - LLM services for AI coaching

### Data Sources
- Real-time biometric data
- Weather and environmental data
- Location-based fitness facilities
- User activity and nutrition logs

## Team Members

### Core Contributors
- Balti Mohamed Aziz - Member
- Silini Ahmed - Member
- Ben Ammou Marwen - Member
- Achach Ala Eddine - Member

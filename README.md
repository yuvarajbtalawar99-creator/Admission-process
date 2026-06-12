# College ERP System

A comprehensive, production-ready Enterprise Resource Planning (ERP) system for college management, from admission to graduation.

## Features

### 🎓 Admission Management
- Online admission form
- Multi-step validation (Validator → Principal)
- Automated credential generation
- Status tracking and notifications

### 👨‍🎓 Student Portal
- Academic performance tracking
- Attendance monitoring
- Fee payment and status
- Study materials and assignments
- Performance analytics
- Grievance resolution

### 👨‍🏫 Teacher Portal
- Attendance marking with auto-sync
- Marks entry and grade calculation
- Study material upload
- Assignment management
- Student performance analysis

### 🏫 HOD Dashboard
- Department analytics
- Faculty management
- Student records and performance
- Department reports

### 💼 Admin Management
- Student enrollment
- Fee collection and reporting
- Timetable and exam scheduling
- Document verification
- ID card and certificate generation

### 🎯 Principal Dashboard
- College-wide analytics
- Staff management and approvals
- Budget overview
- Annual report generation

### 👨‍👩‍👦 Parent Portal
- Child academic tracking
- Attendance monitoring
- Fee status and payment
- Real-time notifications

## Tech Stack

- **Frontend:** React 18 + TypeScript + Tailwind CSS + Redux Toolkit
- **Backend:** Node.js + Express + TypeScript + Sequelize ORM
- **Database:** PostgreSQL + Redis
- **Cloud:** AWS (EC2, RDS, S3, CloudFront)
- **DevOps:** Docker, Docker Compose, GitHub Actions
- **Integrations:** Razorpay, SendGrid, Twilio, Firebase

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Docker & Docker Compose

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/college-erp.git
cd college-erp

# Start with Docker
docker-compose up -d

# Or setup manually
# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Project Structure

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed structure.

## API Documentation

See [API.md](./docs/API.md) for complete API endpoints.

## Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for production deployment guide.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## License

MIT License - See [LICENSE](./LICENSE) for details.

## Support

For issues and feature requests, please use GitHub Issues.

For documentation, refer to the [docs](./docs/) folder.
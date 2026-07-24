# 🚀 QUICK START CHECKLIST - First Day Setup

**Document Purpose:** Get your entire team up and running on the project in first day (8 hours)

---

## PRE-WORK (Before First Day)

### All Team Members
- [ ] Create GitHub account (if needed)
- [ ] Install Git
- [ ] Install Node.js 18+
- [ ] Install Docker
- [ ] Install VS Code
- [ ] Install Postman
- [ ] Get added to GitHub organization
- [ ] Get AWS account access (Team Lead + DevOps)

### Team Lead
- [ ] Clone repository
- [ ] Set up GitHub teams
- [ ] Create Slack channels
- [ ] Set up Jira project
- [ ] Prepare onboarding deck

---

## FIRST DAY SCHEDULE (8 Hours)

### 9:00 AM - 9:30 AM: KICKOFF MEETING

**Location:** Conference room / Zoom  
**Attendees:** All 4 team members + stakeholders

**Agenda:**
```
1. Project overview (5 mins)
   - Goals: Production-ready in 12 weeks
   - Scale: 5000+ concurrent users
   - Current: 45% complete

2. Team structure (5 mins)
   - Backend Engineer responsibilities
   - Frontend Engineer responsibilities
   - DevOps/QA Engineer responsibilities
   - Team Lead coordination

3. Success metrics (5 mins)
   - Test coverage: ≥80%
   - Performance: P95 <200ms
   - Uptime: 99.9%

4. Q&A (10 mins)

Materials:
├─ PRODUCTION_IMPLEMENTATION_GUIDE.md
├─ TEAM_ROLES_QUICK_REFERENCE.md
└─ This checklist
```

**Action Items:**
- [ ] Everyone has read the guides
- [ ] Questions clarified
- [ ] Roles confirmed
- [ ] Next standup scheduled

---

### 10:00 AM - 11:30 AM: ENVIRONMENT SETUP (Backend Lead)

**Location:** Dev Environment / Zoom breakout

**All Team Members:**

1. **Clone Repository** (5 mins)
```bash
# Create working directory
mkdir ~/college-erp-dev
cd ~/college-erp-dev

# Clone repo
git clone https://github.com/your-org/college-erp.git
cd college-erp

# Verify structure
ls -la
# You should see: backend/, frontend/, docker-compose.yml, docs/
```

2. **Verify Git Configuration** (5 mins)
```bash
# Check Git version
git --version   # Should be 2.30+

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@college.com"

# Verify
git config --global --list
```

3. **Verify Node.js & npm** (5 mins)
```bash
# Check versions
node --version  # Should be 18.0.0+
npm --version   # Should be 8.0.0+

# Check npm cache
npm cache verify
```

4. **Verify Docker** (5 mins)
```bash
# Check Docker
docker --version
docker run hello-world

# Check Docker Compose
docker-compose --version  # Should be 2.0+

# Note: If not installed, install from:
# macOS: brew install docker
# Windows: https://docs.docker.com/desktop/install/windows-install/
# Ubuntu: https://docs.docker.com/engine/install/ubuntu/
```

5. **Start Database & Cache** (10 mins)
```bash
# From project root
cd college-erp

# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Wait 30 seconds for services to start
sleep 30

# Verify PostgreSQL
docker exec college_erp_postgres pg_isready -U erp_user -d college_erp_db
# Expected: accepting connections

# Verify Redis
docker exec college_erp_redis redis-cli ping
# Expected: PONG
```

**Troubleshooting:**
```
If PostgreSQL won't start:
- Run: docker-compose logs postgres
- Check disk space: df -h
- Delete old containers: docker-compose down && docker system prune

If Redis won't start:
- Run: docker-compose logs redis
- Port conflict? Change in docker-compose.yml
```

---

### 11:30 AM - 12:00 PM: BACKEND SETUP (Backend Engineer Focus)

**Location:** Dev Environment / Pair with team lead

```bash
# Navigate to backend
cd backend

# Install dependencies (3 mins)
npm install

# Expected output:
# added XXX packages

# Copy environment file (1 min)
cp .env.example .env

# Verify environment
cat .env | head -20

# Install TypeScript globally (1 min)
npm install -g typescript

# Test build (1 min)
npm run build

# Should complete without errors
```

**Environment File Check:**
```bash
# backend/.env should have:
NODE_ENV=development
PORT=5000
DB_HOST=localhost    # Must be 'localhost' for Docker
DB_USER=erp_user
DB_PASSWORD=erp_password_change_me_123
REDIS_HOST=localhost
JWT_SECRET=xxx (will be set)
```

**⚠️ Important Notes:**
- Don't commit `.env` file
- Update JWT secrets later
- Use Secrets Manager in production

---

### 12:00 PM - 1:00 PM: LUNCH BREAK

---

### 1:00 PM - 2:00 PM: FRONTEND SETUP (Frontend Engineer Focus)

**Location:** Dev Environment / Pair with team lead

```bash
# Navigate to frontend
cd frontend

# Install dependencies (2 mins)
npm install

# Copy environment file (1 min)
cp .env.example .env

# Verify environment
cat .env

# Test build (2 mins)
npm run build

# Expected output:
# dist/index.html file created
```

**Environment File Check:**
```bash
# frontend/.env should have:
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

**Verify Installation:**
```bash
# Test TypeScript compilation
npm run type-check

# Should pass without errors
```

---

### 2:00 PM - 3:00 PM: DATABASE SETUP (DevOps/QA Lead)

**Location:** Database / Terminal

```bash
# From backend directory
cd backend

# Run migrations (creates tables)
npm run migrate

# Expected output:
# ✓ Connected to database
# ✓ Running migrations...
# ✓ Created 33 tables
# ✓ Migrations completed
```

**Verify Tables Created:**
```bash
# Connect to database
psql -h localhost -U erp_user -d college_erp_db

# List tables
\dt

# Expected output: 33+ tables listed

# Exit
\q
```

**Load Sample Data (Optional):**
```bash
# Seed initial data
npm run seed

# Expected output:
# ✓ Created 10 admin users
# ✓ Created 5 principal users
# ✓ Created 20 faculty users
# ✓ Created 100 student users
# ✓ Created sample marks and attendance
```

---

### 3:00 PM - 3:30 PM: START SERVERS (Full Team)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev

# Expected output:
# 🚀 Server running at http://localhost:5000
# ✓ Database connected
# ✓ Redis connected
# ✓ Socket.io listening on :5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# Expected output:
# VITE v5.0.0 ready in XXX ms
# ➜ Local: http://localhost:5173/
```

**Terminal 3 - Logs/Monitoring:**
```bash
# Watch logs
docker-compose logs -f postgres redis
```

---

### 3:30 PM - 4:00 PM: VERIFY SETUP (All Team Members)

#### Test 1: Access Frontend
```
Open browser: http://localhost:5173
Expected: Login page loads
```

#### Test 2: Test Backend API
```bash
# Open Postman
# Method: GET
# URL: http://localhost:5000/api/health
# Expected: { "status": "ok" }
```

#### Test 3: Login
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "admin@college.com",
  "password": "admin123"
}
Expected: {
  "accessToken": "eyJ...",
  "user": { "id": "...", "email": "...", "role": "ADMIN" }
}
```

#### Test 4: Access Protected API
```bash
# Get the token from test 3
# Add Authorization header: Bearer {token}
GET http://localhost:5000/api/students
Expected: [ { ... student data ... } ]
```

**Troubleshooting:**
```
If frontend won't load:
- Check: http://localhost:5173 in address bar
- Check terminal: Are there build errors?
- Try: npm run build
- Kill port: lsof -i :5173 | kill -9 PID

If backend won't start:
- Check database: docker exec college_erp_postgres pg_isready ...
- Check Redis: docker exec college_erp_redis redis-cli ping
- Kill port: lsof -i :5000 | kill -9 PID
- Check logs: npm run dev (full error output)

If migrations fail:
- Database not running? Start Docker
- Connection error? Check DB_HOST in .env (must be 'localhost')
- Wrong credentials? Check DB_USER and DB_PASSWORD match

If health check fails:
- Backend not running? Start: npm run dev
- Wrong port? Check PORT in .env (should be 5000)
- Firewall? Check port is accessible
```

---

### 4:00 PM - 4:30 PM: TOOLS SETUP (Each Role)

#### Backend Engineer
```bash
# DBeaver (Database GUI)
1. Download: https://dbeaver.io
2. Create connection:
   - Host: localhost
   - Port: 5432
   - Database: college_erp_db
   - User: erp_user
   - Password: erp_password_change_me_123
3. Test connection
4. Browse tables

# Redis Insight
1. Download: https://redis.com/redis-enterprise/redis-insight/
2. Add connection:
   - Host: localhost
   - Port: 6379
3. Test connection
```

#### Frontend Engineer
```bash
# React DevTools
1. Install Chrome extension
2. Verify it works on http://localhost:5173

# Redux DevTools
1. Install: npm install --save-dev redux-devtools-extension
2. Use in browser
3. Test state changes

# Storybook (for components)
npm install -D storybook
npx storybook init
npm run storybook
```

#### DevOps/QA Engineer
```bash
# Jest configuration (already done)
# Verify: npm test -- --version

# Vitest setup (already done)
# Verify: npm test -- --version

# Postman collections
1. Create collection for API tests
2. Add authentication
3. Create test endpoints
```

#### Team Lead
```bash
# GitHub Desktop (optional)
Download: https://desktop.github.com

# Figma (for design reviews)
Access: https://www.figma.com

# Linear/Jira
Setup board with columns:
- Backlog
- Todo
- In Progress
- In Review
- Done
```

---

### 4:30 PM - 5:00 PM: GIT WORKFLOW SETUP (Team Lead)

#### Create Your Feature Branches
```bash
# Each person creates their branch
git checkout -b dev/your-name

# Team Lead creates branches for each module:
git checkout -b dev/backend-apis
git checkout -b dev/frontend-pages
git checkout -b dev/testing-infrastructure
```

#### Configure Git Hooks
```bash
# Install husky for pre-commit hooks
npm install husky --save-dev
npx husky install

# Add pre-commit linting
echo "npm run lint" > .husky/pre-commit
chmod +x .husky/pre-commit
```

#### Set Up Slack Notifications
```bash
# Each commit automatically posts to #erp-commits
# Configure in GitHub: Settings → Integrations → Slack
```

---

### 5:00 PM - 5:30 PM: FINAL CHECKLIST & STANDUP

#### Verification Checklist
- [ ] Backend running (http://localhost:5000)
- [ ] Frontend running (http://localhost:5173)
- [ ] Database connected (33 tables created)
- [ ] Redis connected (redis-cli ping returns PONG)
- [ ] Can login (admin@college.com / admin123)
- [ ] Can access API (Bearer token authentication working)
- [ ] All team members have cloned repo
- [ ] All tools installed (DBeaver, Postman, DevTools, etc.)
- [ ] Git branches created
- [ ] Slack channels configured
- [ ] Jira board created
- [ ] Daily standup time confirmed (10:00 AM)
- [ ] Weekly sync time confirmed (Friday 2 PM)

#### Questions to Ask
1. Does everything work on your local machine? (Everyone: Yes/No)
2. Did you encounter any errors? (List them)
3. Which role are you taking?
4. When can you start contributing?

---

## AFTER FIRST DAY

### Before Day 2

```bash
# Pull latest changes
git pull origin main

# Make sure everything still runs
npm install (both backend & frontend)
npm run dev (backend)
npm run dev (frontend)

# Verify database
npm run migrate
npm run seed (if needed)
```

### Week 1 Expectations

**Backend Engineer:**
- [ ] Create first 5 API endpoints
- [ ] Write 30+ unit tests
- [ ] Set up Postman collection
- [ ] Document endpoints

**Frontend Engineer:**
- [ ] Create 5 reusable components
- [ ] Set up Redux store
- [ ] Create login page
- [ ] Create component tests

**DevOps/QA Engineer:**
- [ ] Set up CI/CD pipeline
- [ ] Write 50+ tests
- [ ] Set up Sentry
- [ ] Create Grafana dashboard

**Team Lead:**
- [ ] Hold architecture review
- [ ] Set up git workflow
- [ ] Review code (every PR)
- [ ] Track milestones

---

## COMMON ISSUES & SOLUTIONS

### Issue: "Port 5000 already in use"
```bash
# Find process using port
lsof -i :5000

# Kill it
kill -9 <PID>

# Or change port in backend/.env
PORT=5001
```

### Issue: "PostgreSQL connection refused"
```bash
# Check container running
docker ps | grep postgres

# Restart container
docker-compose restart postgres

# Wait 30 seconds
sleep 30

# Try again
```

### Issue: "npm install failing"
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install
```

### Issue: "TypeScript compilation error"
```bash
# Verify TypeScript installed
npm list typescript

# Run type check
npm run type-check

# Fix errors shown
```

### Issue: "Redis connection error"
```bash
# Check Redis running
docker ps | grep redis

# Test connection
redis-cli ping
# Expected: PONG

# If not working:
docker-compose down
docker-compose up -d redis
sleep 10
redis-cli ping
```

---

## NEXT STEPS (End of Day 1)

### Immediate (Next 24 hours)
- [ ] Everyone can run the project locally
- [ ] Everyone understands their role
- [ ] Daily standup scheduled
- [ ] Slack channels set up
- [ ] Jira board created

### Week 1 Focus
- [ ] Set up testing infrastructure
- [ ] Fix secrets management
- [ ] Create basic CI/CD
- [ ] Begin first 15 endpoints

### Week 2 Focus
- [ ] Database optimization
- [ ] Complete 30+ API endpoints
- [ ] Create component library
- [ ] 100+ tests passing

---

## HELPFUL COMMANDS (Keep Handy)

```bash
# Docker commands
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f backend    # Watch backend logs
docker exec college_erp_postgres psql -U erp_user -d college_erp_db  # Connect to DB

# Backend
npm run dev                       # Start development server
npm run build                     # Build for production
npm run migrate                   # Run migrations
npm run seed                      # Load seed data
npm test                          # Run tests
npm run lint                      # Check code style

# Frontend
npm run dev                       # Start dev server
npm run build                     # Build for production
npm test                          # Run tests
npm run type-check               # Check TypeScript

# Git
git status                        # Check status
git checkout -b feature-name      # Create new branch
git add .                         # Stage changes
git commit -m "message"           # Commit
git push origin feature-name      # Push to GitHub
git pull origin main              # Pull latest
```

---

## SUCCESS METRICS (Day 1)

By end of first day, you should have:
- ✅ Full development environment running locally
- ✅ Can start/stop servers
- ✅ Can access frontend & backend
- ✅ Can make database queries
- ✅ Can run tests
- ✅ Can commit to Git
- ✅ Know your role & responsibilities
- ✅ Know who to ask for help
- ✅ Know the timeline & milestones
- ✅ Know how to communicate (Slack, standups, syncs)

**If you can do all of above, you're ready to start production work! 🎉**

---

**Questions?** Slack #erp-support or ask your Team Lead  
**Stuck?** Check this guide's troubleshooting section first, then escalate

**Good Luck! Let's build something amazing! 🚀**

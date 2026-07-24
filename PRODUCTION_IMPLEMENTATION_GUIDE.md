# 🚀 College ERP System - Production Implementation Guide
## Complete Step-by-Step Plan for 4-Person Team

**Document Version:** 1.0  
**Created:** July 6, 2026  
**Timeline:** 12 weeks to production  
**Team Size:** 4 members  
**Status:** Implementation Ready

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Team Structure (4 Members)](#team-structure-4-members)
3. [Phase Breakdown](#phase-breakdown)
4. [Installation & Setup](#installation--setup)
5. [Database Guide](#database-guide)
6. [Backend Development](#backend-development)
7. [Frontend Development](#frontend-development)
8. [Testing Strategy](#testing-strategy)
9. [Deployment & DevOps](#deployment--devops)
10. [Communication & Workflows](#communication--workflows)

---

# PROJECT OVERVIEW

## Current Status
- **Completion:** 45%
- **Issues:** 6 Critical, 10 High Priority
- **Production Ready:** NO ❌
- **Target Users:** 5000+ concurrent

## What's Already Done ✅
```
✓ Tech stack selected & configured
✓ Docker development environment
✓ Basic project structure
✓ Database schema (33 tables)
✓ Authentication foundation (JWT)
✓ Socket.io setup
✓ Error handling middleware
✓ Security headers (Helmet.js)
```

## What Needs To Be Done ❌
```
❌ Test suite (0% → 80%+ coverage)
❌ Monitoring & logging
❌ Database optimization (indexes, partitioning)
❌ CI/CD pipeline
❌ Complete API endpoints (40 → 100+)
❌ Real-time features (50% → 100%)
❌ Frontend pages (30 → 70+)
❌ Email/SMS system
❌ Kubernetes deployment
❌ Load testing & optimization
```

---

# TEAM STRUCTURE (4 Members)

## Role Distribution

### 1️⃣ TEAM LEAD / FULLSTACK ARCHITECT
**Name:** [Assign]  
**Responsibility:** Overall technical direction & integration  
**Time Allocation:** 100% (40 hours/week)

#### Weekly Responsibilities:
- Architecture decisions
- Integration between frontend & backend
- Database schema reviews
- Performance optimization
- Team coordination

#### Tools:
- Git (branch management)
- Jira (project tracking)
- Architecture diagrams (Lucidchart/draw.io)

#### Meetings:
- Daily standup (15 mins)
- Weekly architecture review (1 hour)
- Weekly with backend & frontend leads

---

### 2️⃣ BACKEND ENGINEER
**Name:** [Assign]  
**Responsibility:** APIs, Database, Business Logic  
**Time Allocation:** 100% (40 hours/week)

#### Primary Tasks:
- Complete 60+ API endpoints (Week 1-4)
- Database optimization (indexes, partitioning)
- Background jobs & queues
- Authentication & Authorization
- Payment gateway integration
- Email/SMS integration
- Monitoring & logging
- Performance optimization

#### Weekly Breakdown:
```
Week 1-2:  API endpoints + error handling
Week 3-4:  Database optimization + caching
Week 5-6:  Background jobs + notifications
Week 7-8:  Integration testing
Week 9-10: Performance tuning
Week 11-12: Load testing & fixes
```

#### Tech Stack:
- Node.js + Express
- TypeScript
- PostgreSQL
- Redis
- Bull Queue
- Jest (testing)

#### Tools:
- Postman (API testing)
- DBeaver (database management)
- Redis Insight (cache management)
- DataGrip (database IDE)

---

### 3️⃣ FRONTEND ENGINEER
**Name:** [Assign]  
**Responsibility:** UI/UX, Pages, State Management  
**Time Allocation:** 100% (40 hours/week)

#### Primary Tasks:
- Build 40+ remaining pages
- Responsive design (mobile-first)
- Redux state management
- Real-time features (WebSocket integration)
- Performance optimization
- Component library
- E2E testing

#### Weekly Breakdown:
```
Week 1-2:  Setup + component library
Week 3-4:  Admin pages (15 pages)
Week 5-6:  Principal + HOD pages (20 pages)
Week 7-8:  Student + Teacher pages (25 pages)
Week 9-10: Mobile optimization + polish
Week 11-12: E2E testing & optimization
```

#### Tech Stack:
- React 18 + TypeScript
- Tailwind CSS
- Redux Toolkit
- Socket.io Client
- Vitest/Cypress (testing)

#### Tools:
- Figma (design reference)
- Storybook (component library)
- Lighthouse (performance)
- React DevTools

---

### 4️⃣ DEVOPS / QA ENGINEER
**Name:** [Assign]  
**Responsibility:** Testing, CI/CD, Infrastructure  
**Time Allocation:** 100% (40 hours/week)

#### Primary Tasks:
- Test suite (80%+ coverage)
- CI/CD pipeline setup
- Docker & Kubernetes
- Performance & load testing
- Security testing
- Monitoring & alerting
- Backup & disaster recovery

#### Weekly Breakdown:
```
Week 1-2:  Test suite (backend) + CI/CD
Week 3-4:  Test suite (frontend) + Docker
Week 5-6:  Kubernetes setup
Week 7-8:  Load testing setup
Week 9-10: Performance testing
Week 11-12: Final testing + monitoring
```

#### Tech Stack:
- Jest (backend testing)
- Vitest (frontend testing)
- Cypress (E2E testing)
- Docker & Docker Compose
- Kubernetes
- GitHub Actions
- Prometheus + Grafana
- Sentry

#### Tools:
- GitHub Actions (CI/CD)
- Jenkins (optional)
- K6 / Apache JMeter (load testing)
- AWS Console
- Lens (K8s IDE)

---

## Team Collaboration Matrix

| Phase | Backend | Frontend | DevOps/QA | Architect |
|-------|---------|----------|-----------|-----------|
| Week 1-2 | APIs + Tests | Components + Tests | CI/CD + Tests | Coordinate |
| Week 3-4 | DB Optimize | Pages | Docker | Review |
| Week 5-6 | Background Jobs | Real-time | K8s | Integrate |
| Week 7-8 | Integration | Polish | Monitoring | Test |
| Week 9-10 | Performance | Optimization | Load Testing | Optimize |
| Week 11-12 | Final | Launch | Rollback Plan | Deploy |

---

## Communication Protocol

### Daily (10 AM)
- **Duration:** 15 minutes
- **Attendees:** All 4 members
- **Format:** What did you do? What will you do? Any blockers?
- **Platform:** Zoom / In-person
- **Note:** Record & post summary in Slack

### Weekly (Friday 2 PM)
- **Duration:** 1 hour
- **Format:** Sprint review & planning
- **Attendees:** All 4 members
- **Topics:** 
  - Progress against milestones
  - Integration status
  - Blockers & solutions
  - Upcoming week priorities

### Documentation
- **Git commits:** Detailed messages with ticket numbers
- **Slack channels:**
  - #erp-general (announcements)
  - #erp-backend (backend discussion)
  - #erp-frontend (frontend discussion)
  - #erp-devops (infrastructure)
  - #erp-blockers (issues requiring escalation)

---

# PHASE BREAKDOWN

## ⏱️ COMPLETE 12-WEEK TIMELINE

### PHASE 1: FOUNDATION & SECURITY (Weeks 1-2) 🔴 CRITICAL

**Goal:** Fix critical blockers, establish development practices  
**Owner:** Team Lead + Backend Engineer + DevOps/QA

#### Week 1 Tasks

**Monday-Tuesday (Days 1-2):**
1. Environment setup (all team members)
   - Clone repo
   - Install dependencies
   - Docker Compose up
   - Verify local setup

2. Secrets management (Backend + DevOps)
   - Remove .env from git: `git rm --cached .env`
   - Create new JWT secrets
   - Set up AWS Secrets Manager
   - Configure GitHub Secrets for CI/CD
   - Add .env to .gitignore

3. Git workflow setup (Team Lead)
   - Create branch protection rules
   - Set up PR templates
   - Define commit message conventions
   - Create GitHub teams

**Wednesday-Thursday (Days 3-4):**

4. Testing infrastructure (DevOps/QA)
   - Install Jest, ts-jest (backend)
   - Install Vitest (frontend)
   - Create test directory structure
   - Create base test utilities

5. CI/CD Foundation (DevOps/QA)
   - Create `.github/workflows/test.yml`
   - Create `.github/workflows/lint.yml`
   - Create `.github/workflows/build.yml`
   - Test on a dummy PR

6. Backend: Authentication Tests (Backend)
   - Write login endpoint tests
   - Write token refresh tests
   - Write logout tests
   - Write permission check tests
   - Target: 30+ test cases

**Friday (Day 5):**

7. Monitoring Setup (DevOps/QA)
   - Install Sentry (error tracking)
   - Install Prometheus client
   - Create basic Grafana dashboard
   - Set up CloudWatch logs

8. Frontend: First Tests (Frontend)
   - Create login page tests
   - Create component tests
   - Create Redux reducer tests
   - Target: 20+ test cases

9. Sprint Review (All)
   - Demo test coverage
   - Review CI/CD pipeline
   - Identify blockers

#### Week 1 Deliverables
```
✓ All team members have working local environment
✓ Secrets removed from git, moved to AWS Secrets Manager
✓ CI/CD pipeline passes on main branch
✓ 50+ backend tests passing
✓ 20+ frontend tests passing
✓ Monitoring dashboard created
✓ GitHub workflows automated
```

---

#### Week 2 Tasks

**Monday-Tuesday (Days 6-7):**

1. Database Optimization (Backend)
   - Analyze current queries
   - Identify N+1 problems
   - Create indexes on:
     - Users (email, enrollment_number)
     - Students (user_id, enrollment_number)
     - Marks (student_id, subject_id, semester)
     - Attendance (student_id, date, class_id)
     - Fees (student_id, payment_status)
   - Test index performance
   - Document indexes created

2. Admission Workflow Tests (Backend)
   - Test submission endpoint
   - Test validation endpoint
   - Test approval endpoint
   - Test error scenarios
   - Target: 40+ test cases

3. Frontend: Redux Setup (Frontend)
   - Test Redux slices
   - Test async thunks
   - Test selectors
   - Target: 30+ test cases

**Wednesday-Thursday (Days 8-9):**

4. API Endpoint Completion - Phase 1 (Backend)
   - Student dashboard endpoint (/api/students/dashboard)
   - Teacher dashboard endpoint (/api/teachers/dashboard)
   - Admin dashboard endpoint (/api/admin/dashboard)
   - Admission endpoints (5)
   - Mark endpoints (5)
   - Attendance endpoints (5)
   - Write tests for each

5. Frontend: Pages - Phase 1 (Frontend)
   - Student dashboard page
   - Teacher dashboard page
   - Admin dashboard page
   - Login page tests
   - Redux integration tests

6. Security Review (Team Lead + Backend)
   - Review authentication flow
   - Check CORS configuration
   - Verify rate limiting
   - Review input validation

**Friday (Day 10):**

7. Load Testing Setup (DevOps/QA)
   - Install K6
   - Create basic load test scripts
   - Test on 100 concurrent users
   - Document baseline metrics

8. Documentation (Team Lead)
   - Create architecture diagram
   - Document API endpoint structure
   - Create database schema docs

9. Sprint Review (All)
   - Demo endpoints
   - Show test coverage (target: 50%)
   - Review performance metrics

#### Week 2 Deliverables
```
✓ Database indexes created (20+ indexes)
✓ 100+ backend tests passing
✓ 50+ frontend tests passing
✓ 15 new API endpoints completed
✓ 3 main dashboard pages built
✓ Admission workflow fully tested
✓ Load test baseline established
✓ Test coverage: 40%
```

#### Phase 1 Completion Criteria
- [ ] All secrets removed from codebase
- [ ] CI/CD pipeline passing
- [ ] ≥100 tests passing
- [ ] Database indexes created
- [ ] Monitoring dashboard active
- [ ] Load test baseline established
- [ ] 15+ API endpoints completed
- [ ] 3+ dashboard pages completed

---

### PHASE 2: API & BACKEND COMPLETION (Weeks 3-4) 🟡 HIGH

**Goal:** Complete all 100+ API endpoints, optimize database  
**Owner:** Backend Engineer

#### Week 3 Tasks

**Focus:** Admin & HOD Endpoints

1. Admin Configuration Endpoints (20 endpoints)
   - Get/Create academic year
   - Get/Create semester
   - Get/Create department
   - Get/Create fee structure
   - Get/Create grading system
   - Get/Create dashboard configuration
   - Get/Create feature flags
   - Get/Create user roles
   - Get/Update system settings
   - Get/List audit logs
   - Write tests for all (80+ test cases)

2. HOD Endpoints (15 endpoints)
   - Get department analytics
   - Get faculty list
   - Get student performance
   - Create/Update timetable
   - Approve/Reject leaves
   - Get department budget
   - View reports
   - Write tests (60+ test cases)

3. Database Query Optimization
   - Analyze slow queries
   - Add query caching (Redis)
   - Implement connection pooling
   - Create query indexes

4. Admission System Completion
   - Document verification endpoint
   - Credential generation endpoint
   - Email notification on approval
   - SMS notification on approval

**Deliverables:**
```
✓ 35+ new API endpoints
✓ 140+ test cases
✓ Database query caching
✓ Connection pooling configured
✓ Test coverage: 60%
```

#### Week 4 Tasks

**Focus:** Principal & Report Endpoints

1. Principal Approval Endpoints (20 endpoints)
   - Get pending approvals
   - Approve admission
   - Reject admission
   - Approve budget
   - Get analytics
   - View compliance
   - Generate reports
   - Set strategic goals
   - View announcements
   - Publish announcements

2. Report Endpoints (15 endpoints)
   - Generate student transcript
   - Generate attendance report
   - Generate fee collection report
   - Generate performance report
   - Generate department report
   - Generate annual report
   - Export to PDF/Excel

3. Grievance & Leave Endpoints (16 endpoints)
   - File grievance
   - Update grievance
   - Resolve grievance
   - Request leave
   - Approve/Reject leave
   - Get leave balance
   - Appeal rejection

4. Background Jobs Setup
   - Daily fee reminder job
   - Attendance calculation job
   - CGPA recalculation job
   - Database backup job
   - Cache cleanup job

**Deliverables:**
```
✓ 51+ new API endpoints (Total: 100+)
✓ 150+ test cases
✓ All background jobs implemented
✓ Test coverage: 70%
```

#### Phase 2 Completion Criteria
- [ ] 100+ API endpoints completed
- [ ] All endpoints documented
- [ ] 250+ test cases passing
- [ ] Database optimized (query caching)
- [ ] Background jobs working
- [ ] Load test with 500 users passing

---

### PHASE 3: FRONTEND BUILD (Weeks 5-6) 🟡 HIGH

**Goal:** Build 40+ remaining pages  
**Owner:** Frontend Engineer

#### Week 5 Tasks

**Focus:** Admin & HOD Pages (20 pages)

1. Admin Pages (15 pages)
   - Dashboard (KPIs, pending actions)
   - User management (create, edit, deactivate, bulk import)
   - Admission queue (verification, approval)
   - Fee configuration
   - Grading system setup
   - Academic year management
   - Semester management
   - Department management
   - Feature flags
   - Workflow configuration
   - Email template management
   - Audit logs viewer
   - System settings
   - Reports page
   - API key management

2. HOD Pages (5 pages)
   - Department dashboard
   - Faculty management
   - Student performance analytics
   - Timetable creator
   - Budget management

3. Component Library (6 components)
   - Advanced data table with sorting/filtering
   - Chart components (line, bar, pie)
   - Modal dialog system
   - Form builder
   - File uploader
   - Notification system

**Deliverables:**
```
✓ 20 admin/HOD pages
✓ 6 reusable components
✓ 100+ component tests
✓ Mobile responsive (50% complete)
✓ Redux integration for all pages
```

#### Week 6 Tasks

**Focus:** Principal, Student & Teacher Pages (20 pages)

1. Principal Pages (10 pages)
   - Dashboard (college KPIs)
   - Admission approvals
   - Staff approvals
   - Budget approvals
   - Analytics & insights
   - Compliance checklist
   - Strategic goals
   - Announcements
   - Grievances
   - Reports

2. Student Pages (5 pages)
   - Dashboard
   - Marks view
   - Attendance tracking
   - Fee payment
   - Documents upload

3. Teacher Pages (3 pages)
   - Class management
   - Mark submission
   - Assignment creation

4. Parent Pages (2 pages)
   - Child tracking
   - Fee status

5. Performance Optimization
   - Image optimization (lazy loading)
   - Code splitting
   - Bundle optimization
   - Lighthouse score >85

**Deliverables:**
```
✓ 40+ total pages (70 target reached)
✓ All pages mobile responsive
✓ 200+ component tests
✓ Redux fully integrated
✓ Lighthouse score: 85+
✓ Performance: FCP <1.5s, LCP <2.5s
```

#### Phase 3 Completion Criteria
- [ ] 70+ frontend pages completed
- [ ] All pages mobile responsive
- [ ] Component library (20+ reusable components)
- [ ] 200+ frontend tests
- [ ] Lighthouse score >85
- [ ] Performance targets met

---

### PHASE 4: REAL-TIME & TESTING (Weeks 7-8) 🟡 HIGH

**Goal:** Complete real-time features, integrate testing  
**Owner:** All (coordinated)

#### Week 7 Tasks

**Real-Time Features (Backend + Frontend)**

1. Socket.io Event Handlers (Backend)
   - admission:approved event
   - marks:published event
   - fee:payment_received event
   - attendance:marked event
   - grievance:resolved event
   - announcement:new event
   - config:updated event
   - approval:required event
   - Test all events (40+ test cases)

2. Socket.io Client Integration (Frontend)
   - Connect socket on app load
   - Join rooms by role/department
   - Listen for events
   - Update Redux on event
   - Show notifications
   - Automatic reconnection
   - Offline queue

3. Real-Time Dashboard Updates
   - Backend: Push KPI updates every 30s
   - Frontend: Display live updates
   - Test with 100 concurrent users

4. Email/SMS Notification System (Backend)
   - Create email templates (20+):
     - Welcome email
     - Password reset
     - 2FA OTP
     - Admission approved/rejected
     - Marks published
     - Fee reminder (1 week, 3 days, 1 day)
     - Fee receipt
     - Attendance warning
     - Leave approved/rejected
     - Grievance updates
     - Performance alerts
     - Assignment posted
   - SMS messages (5):
     - OTP delivery
     - Admission approved
     - Fee due reminder
     - Marks published
     - Attendance warning

5. Bull Queue Integration
   - Send email job
   - Send SMS job
   - Generate report job
   - Calculate attendance job
   - Recalculate CGPA job
   - Test job execution & retry

**Deliverables:**
```
✓ Real-time events working with 100 users
✓ 20 email templates created
✓ SMS integration complete
✓ Bull queue jobs automated
✓ 80+ integration tests
✓ Real-time dashboard updates working
```

#### Week 8 Tasks

**Integration & Comprehensive Testing**

1. API Integration Tests (Backend)
   - Full admission workflow (submit → validate → approve)
   - Full mark submission workflow
   - Full attendance workflow
   - Full fee payment workflow
   - Test with multiple roles
   - 100+ integration test cases

2. Frontend Integration Tests (Frontend)
   - User login → dashboard → data view
   - Admin create user → student login
   - Teacher mark submission → student view marks
   - Test with Cypress (E2E)
   - 50+ E2E test cases

3. Load Testing (DevOps/QA)
   - Test with 1000 concurrent users
   - Measure P50, P95, P99 latency
   - Identify bottlenecks
   - Stress test to failure
   - Document scaling limits

4. Security Testing (DevOps/QA + Backend)
   - OWASP ZAP scanning
   - SQL injection testing
   - XSS prevention verification
   - CSRF protection testing
   - Authentication bypass testing
   - Authorization testing

5. Performance Profiling (Backend + Frontend)
   - Backend: Identify slow endpoints
   - Frontend: Identify slow components
   - Database: Analyze slow queries
   - Optimize top 10 bottlenecks

**Deliverables:**
```
✓ 100+ integration tests passing
✓ 50+ E2E tests passing
✓ Load tested with 1000 users
✓ Security issues identified & fixed
✓ Performance improved by 30%
✓ Test coverage: 80%+
```

#### Phase 4 Completion Criteria
- [ ] All real-time events working
- [ ] Email/SMS system fully functional
- [ ] 200+ integration tests
- [ ] 50+ E2E tests
- [ ] Test coverage: 80%+
- [ ] Load test: 1000 concurrent users
- [ ] Security audit: 0 critical issues
- [ ] Performance: P95 <200ms

---

### PHASE 5: INFRASTRUCTURE & OPTIMIZATION (Weeks 9-10) 🟠 MEDIUM

**Goal:** Deploy on Kubernetes, optimize for 5000 users  
**Owner:** DevOps/QA Engineer + Backend

#### Week 9 Tasks

**Kubernetes Deployment**

1. Create Kubernetes Manifests
   - Backend deployment (4 replicas, scale to 10)
   - Frontend deployment (2 replicas)
   - PostgreSQL StatefulSet
   - Redis deployment
   - Service definitions (ClusterIP, LoadBalancer)
   - Ingress configuration
   - ConfigMaps (non-secret config)
   - Secrets (vault integration)

2. Health Checks & Probes
   - Liveness probes (HTTP)
   - Readiness probes (database check)
   - Startup probes
   - Define thresholds

3. Resource Limits
   - Backend: CPU 500m-2000m, Memory 512Mi-2Gi
   - Frontend: CPU 200m-1000m, Memory 256Mi-1Gi
   - PostgreSQL: CPU 1000m-4000m, Memory 2Gi-8Gi
   - Redis: CPU 200m-1000m, Memory 256Mi-2Gi

4. HPA Configuration
   - CPU utilization triggers (>70%)
   - Memory triggers (>80%)
   - Min replicas: 4, Max replicas: 10

5. Networking
   - Network policies (restrict traffic)
   - Pod anti-affinity (spread across nodes)
   - Persistent volumes (database, Redis)

6. Monitoring in K8s
   - Prometheus for metrics
   - Grafana dashboards
   - Pod logs aggregation
   - Container resource usage

**Deliverables:**
```
✓ All Kubernetes manifests created
✓ K8s cluster configured
✓ Health checks active
✓ Auto-scaling working
✓ Pod logs aggregated
✓ Metrics dashboard created
```

#### Week 9 Tasks (Continued)

**Performance Optimization**

1. Backend Optimization
   - Database connection pooling tuned
   - Redis cache hit rate >80%
   - Query optimization (batch requests)
   - Compression enabled
   - CDN headers configured

2. Frontend Optimization
   - Bundle size <500KB
   - Images optimized (<100KB each)
   - CSS minified
   - JavaScript minified
   - Service worker enabled (PWA)

3. Load Testing - 5000 Users
   - Gradual ramp-up to 5000 users
   - Measure P50, P95, P99
   - Identify bottlenecks
   - Scale infrastructure as needed
   - Document results

**Deliverables:**
```
✓ Backend optimized: P95 <200ms
✓ Frontend optimized: Lighthouse >90
✓ Load test: 5000 concurrent users
✓ Results documented
```

#### Week 10 Tasks

**Disaster Recovery & Backup**

1. Database Backups
   - Automated daily backups to S3
   - Point-in-time recovery
   - Test backup restoration
   - Document procedures

2. Configuration Backup
   - Backup all secrets
   - Backup K8s manifests
   - Backup application config

3. Disaster Recovery Plan
   - RTO (Recovery Time Objective): <1 hour
   - RPO (Recovery Point Objective): <15 minutes
   - Document procedures
   - Test failover

4. Monitoring & Alerting
   - CPU >70% alert
   - Memory >80% alert
   - Error rate >1% alert
   - Response time P95 >200ms alert
   - Database down alert
   - Redis down alert
   - PagerDuty integration

5. Log Aggregation
   - CloudWatch logs
   - Application logs
   - Database logs
   - System logs
   - Query logs

**Deliverables:**
```
✓ Daily backups automated
✓ Backup restoration tested
✓ Alerts configured
✓ Log aggregation working
✓ Disaster recovery plan documented
```

#### Phase 5 Completion Criteria
- [ ] K8s deployment fully functional
- [ ] Auto-scaling working (4-10 replicas)
- [ ] Load test: 5000 concurrent users at P95 <200ms
- [ ] Performance: P50 <100ms, P95 <200ms, P99 <500ms
- [ ] Backups automated & tested
- [ ] Alerts & monitoring active
- [ ] Zero critical production issues
- [ ] RTO <1 hour

---

### PHASE 6: DOCUMENTATION & GO-LIVE (Weeks 11-12) 🟢 FINAL

**Goal:** Complete documentation, team training, go-live  
**Owner:** Team Lead + All

#### Week 11 Tasks

**Documentation**

1. API Documentation
   - Swagger/OpenAPI spec (all 100+ endpoints)
   - Request/response examples
   - Error codes explained
   - Authentication methods
   - Rate limits per endpoint

2. Architecture Documentation
   - System architecture diagram
   - Component interaction diagram
   - Database schema diagram
   - Data flow diagrams
   - API gateway flow

3. Database Documentation
   - All 33 tables described
   - Column types and constraints
   - Indexes and relationships
   - Sample queries
   - Common issues

4. Deployment Documentation
   - Prerequisites checklist
   - Step-by-step deployment
   - Environment variables
   - Database migration steps
   - Backup procedures
   - Restore procedures
   - Scaling instructions

5. Operations Runbooks
   - Incident response procedures
   - Common issues & solutions
   - Performance troubleshooting
   - Database troubleshooting
   - Network troubleshooting

6. Code Documentation
   - Code comments for complex logic
   - Architecture decision records (ADRs)
   - Git workflow documentation
   - Testing guidelines
   - Security guidelines

**Deliverables:**
```
✓ Complete API documentation
✓ Architecture diagrams
✓ Database documentation
✓ Deployment guide
✓ Operations runbooks
✓ Code standards guide
```

#### Week 11 Tasks (Continued)

**Team Training**

1. Backend Team Session
   - Architecture walkthrough (1 hour)
   - Database design review (1 hour)
   - API structure (1 hour)
   - Testing practices (1 hour)
   - Q&A (1 hour)

2. Frontend Team Session
   - Component architecture (1 hour)
   - Redux patterns (1 hour)
   - Performance optimization (1 hour)
   - Testing practices (1 hour)
   - Q&A (1 hour)

3. DevOps Team Session
   - K8s deployment (2 hours)
   - Monitoring & alerting (1 hour)
   - Incident response (1 hour)
   - Scaling procedures (1 hour)
   - Q&A (1 hour)

4. Team Training
   - Git workflow (30 mins)
   - Incident response (30 mins)
   - On-call rotation (30 mins)
   - Escalation procedures (30 mins)

**Deliverables:**
```
✓ All team members trained
✓ Recorded training videos
✓ Quick reference guides
✓ Decision trees for common issues
```

#### Week 12 Tasks

**Go-Live Preparation**

1. Final Quality Assurance
   - Full regression testing
   - Performance verification
   - Security audit review
   - Load test confirmation

2. Go-Live Checklist
   - [ ] All critical tests passing
   - [ ] Performance targets met
   - [ ] Monitoring active
   - [ ] Backups working
   - [ ] Team trained
   - [ ] Documentation complete
   - [ ] Incident response plan ready
   - [ ] Rollback plan ready

3. Go-Live Plan
   - Deployment window (off-peak hours)
   - Deployment steps
   - Rollback steps
   - Monitoring during deployment
   - Communication plan
   - Post-deployment verification

4. First Week of Production
   - 24-hour on-call rotation
   - Daily standup with production team
   - Continuous monitoring
   - Quick bug fixes
   - Performance validation

5. Post-Launch Optimization
   - Address any production issues
   - Performance optimization
   - User feedback incorporation
   - Scaling adjustments

**Deliverables:**
```
✓ Go-live checklist complete
✓ System deployed to production
✓ Users successfully on-boarded
✓ Post-launch issues tracked & fixed
✓ System stable at 99.9% uptime
```

#### Phase 6 Completion Criteria
- [ ] Complete documentation
- [ ] All team members trained
- [ ] Final security audit passed
- [ ] All performance tests passing
- [ ] Go-live executed successfully
- [ ] Production system stable
- [ ] Zero data loss
- [ ] SLA: 99.9% uptime maintained

---

# INSTALLATION & SETUP

## Prerequisites

### System Requirements
```
OS: Ubuntu 22.04 LTS (or macOS 12+, Windows 10+ with WSL2)
RAM: 16GB minimum (32GB recommended)
Storage: 50GB free space
CPU: 8 cores minimum (16+ recommended)
```

### Software Requirements
```
Node.js: 18.0.0+
npm: 8.0.0+
PostgreSQL: 15+
Redis: 7+
Docker: 24.0+
Docker Compose: 2.0+
Git: 2.30+
```

### Accounts Needed
```
GitHub: For code repository
AWS: For Secrets Manager, S3, CloudWatch
Sentry: For error tracking
Postman: For API testing
```

---

## Complete Installation Guide

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-org/college-erp.git
cd college-erp

# Create your working branch
git checkout -b dev/implementation

# Verify structure
ls -la
# Expected output:
# - backend/
# - frontend/
# - docker-compose.yml
# - docker-compose.prod.yml
# - docs/
# - .github/
```

### Step 2: Install Node.js & npm

**macOS:**
```bash
# Using Homebrew
brew install node@18

# Verify installation
node --version    # v18.x.x
npm --version     # 8.x.x
```

**Ubuntu/Debian:**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

**Windows:**
- Download from https://nodejs.org/
- Run installer
- Follow prompts
- Restart terminal
- Verify: `node --version`

### Step 3: Install Backend Dependencies

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Verify installation
npm list | head -20
# Should show multiple packages
```

### Step 4: Install Frontend Dependencies

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Verify
npm list | head -20
```

### Step 5: Configure Environment Variables

#### Backend (.env)

```bash
# backend/.env
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=college_erp_db
DB_USER=erp_user
DB_PASSWORD=erp_password_change_me_123

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT (Generate new secrets!)
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,jpg,jpeg,png,gif

# Logging
LOG_LEVEL=debug
LOG_DIR=./logs

# For production (add later)
# SENDGRID_API_KEY=xxx
# TWILIO_ACCOUNT_SID=xxx
# RAZORPAY_KEY_ID=xxx
# AWS_ACCESS_KEY_ID=xxx
```

#### Frontend (.env)

```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=College ERP System
VITE_APP_VERSION=1.0.0
VITE_SOCKET_URL=http://localhost:5000
```

### Step 6: Install PostgreSQL & Redis

#### Using Docker (Recommended)

```bash
# Start PostgreSQL and Redis
cd ..
docker-compose up -d postgres redis

# Verify containers running
docker ps
# Should see college_erp_postgres and college_erp_redis

# Check PostgreSQL is ready
docker exec college_erp_postgres pg_isready -U erp_user -d college_erp_db

# Check Redis is ready
docker exec college_erp_redis redis-cli ping
# Should return "PONG"
```

#### Manual Installation (Ubuntu/macOS)

**PostgreSQL:**
```bash
# macOS
brew install postgresql

# Ubuntu
sudo apt-get install postgresql postgresql-contrib

# Start service
sudo service postgresql start

# Create user and database
sudo -u postgres psql
postgres=# CREATE USER erp_user WITH PASSWORD 'erp_password_change_me_123';
postgres=# CREATE DATABASE college_erp_db OWNER erp_user;
postgres=# GRANT ALL PRIVILEGES ON DATABASE college_erp_db TO erp_user;
postgres=# \q
```

**Redis:**
```bash
# macOS
brew install redis

# Ubuntu
sudo apt-get install redis-server

# Start service
brew services start redis    # macOS
redis-server                 # Manual start

# Test connection
redis-cli ping
# Should return "PONG"
```

### Step 7: Run Database Migrations

```bash
# From backend directory
cd backend

# Run migrations (creates tables)
npm run migrate

# Expected output:
# Running migrations...
# Created tables: users, students, marks, attendance, etc.
# Migrations completed successfully

# Verify tables created
npm run migrate:status
```

### Step 8: Seed Sample Data (Optional)

```bash
# Run seed data
npm run seed

# This creates:
# - 10 admin users
# - 5 principal users
# - 20 faculty users
# - 100 student users
# - Sample marks, attendance, fees

# Check data
npm run seed:status
```

### Step 9: Start Backend

```bash
# From backend directory
npm run dev

# Expected output:
# [Backend Server] 🚀 Server running at http://localhost:5000
# Database connected ✓
# Redis connected ✓
```

### Step 10: Start Frontend (New Terminal)

```bash
# From frontend directory
npm run dev

# Expected output:
# VITE v5.0.0 running at:
# ➜ Local: http://localhost:5173/
```

### Step 11: Access Application

```
Frontend: http://localhost:5173
Backend API: http://localhost:5000/api
API Documentation: http://localhost:5000/api-docs
Database: localhost:5432 (user: erp_user)
Redis: localhost:6379
```

### Step 12: Test Authentication

```bash
# Using Postman or curl

# Get Login Token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@college.com",
    "password": "admin123"
  }'

# Response should include access_token:
# {
#   "accessToken": "eyJ...",
#   "refreshToken": "eyJ...",
#   "user": {
#     "id": "...",
#     "email": "admin@college.com",
#     "role": "ADMIN"
#   }
# }
```

### Step 13: Docker Compose Setup (Full Stack)

```bash
# From project root
docker-compose up -d

# Verify all services
docker-compose ps

# Expected output:
# college_erp_postgres - Up
# college_erp_redis - Up
# college_erp_backend - Up
# college_erp_frontend - Up

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop all services
docker-compose down
```

---

# DATABASE GUIDE

## Database Architecture

### Design Principles
```
✓ Normalized (3NF minimum)
✓ Foreign key constraints enforced
✓ Indexed for performance
✓ Partitioned for large tables
✓ Row-Level Security (RLS) for data access
```

### 33 Tables Overview

```
Authentication:
├─ users (all system users)
├─ roles (ADMIN, PRINCIPAL, HOD, TEACHER, STUDENT, PARENT, VALIDATOR)
├─ permissions (fine-grained access control)
└─ sessions (active user sessions)

Academic:
├─ students
├─ attendance_records (daily attendance)
├─ marks (course marks)
├─ subjects
├─ classes
├─ semesters
├─ academic_years
└─ departments

Admission:
├─ admissions (application records)
├─ admission_documents
├─ admission_verification
└─ enrollment

Finance:
├─ fees
├─ transactions (payments, refunds)
├─ fee_collection_reports
└─ budget_requests

Communication:
├─ notifications
├─ announcements
├─ messages
└─ email_logs

Administration:
├─ timetables
├─ exam_schedules
├─ grievances
├─ leave_requests
└─ audit_logs
```

---

## Database Operations

### Connect to Database

#### Using DBeaver (GUI)

```
1. Download: https://dbeaver.io
2. New Database Connection
3. Select PostgreSQL
4. Settings:
   - Host: localhost
   - Port: 5432
   - Database: college_erp_db
   - User: erp_user
   - Password: erp_password_change_me_123
5. Test Connection
6. Browse tables
```

#### Using psql (Command Line)

```bash
# Connect
psql -h localhost -U erp_user -d college_erp_db

# List tables
\dt

# Describe table
\d students

# Run query
SELECT * FROM students LIMIT 5;

# Exit
\q
```

### Common Database Tasks

#### 1. Check Table Structure

```sql
-- View students table structure
\d students

-- Expected columns:
-- id (bigint, PK)
-- user_id (bigint, FK)
-- enrollment_number (varchar)
-- semester (int)
-- branch (varchar)
-- date_of_birth (date)
-- phone_number (varchar)
-- address (text)
-- created_at (timestamp)
-- updated_at (timestamp)
```

#### 2. Query Students

```sql
-- Get all students
SELECT * FROM students;

-- Get student with user details
SELECT s.*, u.email, u.name
FROM students s
JOIN users u ON s.user_id = u.id;

-- Get student by enrollment number
SELECT * FROM students WHERE enrollment_number = 'USN-2024-001';

-- Get students in semester 1
SELECT * FROM students WHERE semester = 1;
```

#### 3. Check Attendance

```sql
-- Get attendance for a student
SELECT * FROM attendance_records
WHERE student_id = 1
ORDER BY date DESC;

-- Calculate attendance percentage
SELECT 
  student_id,
  COUNT(*) as total_days,
  SUM(CASE WHEN present = true THEN 1 ELSE 0 END) as present_days,
  ROUND(100 * SUM(CASE WHEN present = true THEN 1 ELSE 0 END)::NUMERIC / COUNT(*), 2) as percentage
FROM attendance_records
GROUP BY student_id;
```

#### 4. Query Marks

```sql
-- Get all marks for a student
SELECT m.*, su.subject_name, s.semester
FROM marks m
JOIN subjects su ON m.subject_id = su.id
JOIN semesters s ON m.semester_id = s.id
WHERE m.student_id = 1;

-- Calculate CGPA
SELECT 
  student_id,
  ROUND(AVG(marks), 2) as cgpa
FROM marks
GROUP BY student_id;
```

#### 5. Check Fees

```sql
-- Get fee status for a student
SELECT * FROM fees WHERE student_id = 1;

-- Get payment transactions
SELECT * FROM transactions
WHERE fee_id = 1
ORDER BY created_at DESC;

-- Calculate fee collection
SELECT 
  DATE(created_at) as date,
  COUNT(*) as payments,
  SUM(amount) as total_collected
FROM transactions
WHERE status = 'SUCCESS'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

#### 6. Manage Users

```sql
-- Get all admins
SELECT * FROM users WHERE role = 'ADMIN';

-- Get all teachers
SELECT * FROM users WHERE role = 'TEACHER';

-- Get all students with count
SELECT u.*, COUNT(s.id) as total_students
FROM users u
LEFT JOIN students s ON u.id = s.user_id
WHERE u.role = 'STUDENT'
GROUP BY u.id;
```

#### 7. View Audit Logs

```sql
-- Get recent changes
SELECT * FROM audit_logs
ORDER BY created_at DESC
LIMIT 100;

-- Track user actions
SELECT * FROM audit_logs
WHERE user_id = 1
ORDER BY created_at DESC;

-- Track table changes
SELECT * FROM audit_logs
WHERE table_name = 'students'
ORDER BY created_at DESC;
```

---

## Database Optimization

### Creating Indexes

```sql
-- User lookups (frequently used)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_enrollment_number ON users(enrollment_number);
CREATE INDEX idx_users_role ON users(role);

-- Student queries
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_department_id ON students(department_id);
CREATE INDEX idx_students_semester ON students(semester);

-- Attendance queries (frequently joined)
CREATE INDEX idx_attendance_student_id ON attendance_records(student_id);
CREATE INDEX idx_attendance_date ON attendance_records(date);
CREATE INDEX idx_attendance_class_id ON attendance_records(class_id);

-- Marks queries
CREATE INDEX idx_marks_student_id ON marks(student_id);
CREATE INDEX idx_marks_subject_id ON marks(subject_id);
CREATE INDEX idx_marks_semester_id ON marks(semester_id);

-- Fee queries
CREATE INDEX idx_fees_student_id ON fees(student_id);
CREATE INDEX idx_fees_payment_status ON fees(payment_status);

-- Transaction queries
CREATE INDEX idx_transactions_fee_id ON transactions(fee_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Notification queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);

-- Audit log queries
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### Enable Table Partitioning

```sql
-- Partition attendance_records by month
-- This improves query performance for large tables

-- First, create partitioned table:
CREATE TABLE attendance_records_partitioned (
  id BIGSERIAL,
  student_id BIGINT NOT NULL,
  class_id BIGINT NOT NULL,
  date DATE NOT NULL,
  present BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (id, date)
) PARTITION BY RANGE (date);

-- Create monthly partitions:
CREATE TABLE attendance_records_202401
  PARTITION OF attendance_records_partitioned
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE attendance_records_202402
  PARTITION OF attendance_records_partitioned
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Migrate data and rename
-- ... (migration scripts provided separately)
```

### Redis Caching Strategy

```
Cache Layer:
├─ User sessions: 24 hours
├─ Student data: 1 hour
├─ Marks data: 6 hours
├─ Fee data: 2 hours
├─ Dashboard KPIs: 30 minutes
├─ Configuration: 24 hours
└─ Attendance: 1 hour
```

### Slow Query Analysis

```sql
-- Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries >1 second
SELECT pg_reload_conf();

-- View slow queries
SELECT query, mean_exec_time, max_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- EXPLAIN ANALYZE for optimization
EXPLAIN ANALYZE
SELECT s.*, u.email
FROM students s
JOIN users u ON s.user_id = u.id
WHERE s.semester = 1;
```

---

## Backup & Recovery

### Automated Daily Backups

```bash
#!/bin/bash
# File: scripts/backup.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
DB_NAME="college_erp_db"
DB_USER="erp_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h localhost -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$TIMESTAMP.sql.gz s3://college-erp-backups/

# Keep only last 30 days locally
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $TIMESTAMP"
```

### Restore from Backup

```bash
# Restore from local backup
gunzip < backups/backup_20260706_120000.sql.gz | psql -h localhost -U erp_user college_erp_db

# Restore from S3 backup
aws s3 cp s3://college-erp-backups/backup_20260706_120000.sql.gz - | gunzip | psql -h localhost -U erp_user college_erp_db
```

---

# BACKEND DEVELOPMENT

## Backend Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── env.ts
│   ├── models/           # Sequelize models
│   │   ├── User.ts
│   │   ├── Student.ts
│   │   ├── Marks.ts
│   │   └── ...
│   ├── routes/           # API routes
│   │   ├── auth.ts
│   │   ├── students.ts
│   │   ├── teachers.ts
│   │   ├── admin.ts
│   │   └── ...
│   ├── controllers/      # Business logic
│   │   ├── AuthController.ts
│   │   ├── StudentController.ts
│   │   └── ...
│   ├── services/         # Complex business logic
│   │   ├── AuthService.ts
│   │   ├── AdmissionService.ts
│   │   └── ...
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── ...
│   ├── validators/       # Input validation
│   │   ├── authValidator.ts
│   │   └── ...
│   ├── utils/            # Utility functions
│   │   ├── logger.ts
│   │   ├── emailService.ts
│   │   └── ...
│   ├── socket/           # WebSocket handlers
│   │   └── events.ts
│   ├── migrations/       # Database migrations
│   │   └── init.sql
│   ├── seeds/            # Seed data
│   │   └── index.ts
│   ├── app.ts            # Express app setup
│   └── index.ts          # Entry point
├── tests/
│   ├── unit/             # Unit tests
│   │   ├── controllers/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/      # Integration tests
│   │   ├── auth.test.ts
│   │   ├── admission.test.ts
│   │   └── ...
│   └── fixtures/         # Test data
├── package.json
├── tsconfig.json
└── Dockerfile
```

---

## Creating a New API Endpoint

### Example: Create Student Marks Endpoint

#### 1. Create Model (if not exists)

```typescript
// src/models/Marks.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Student from './Student';
import Subject from './Subject';

class Marks extends Model {
  public id!: number;
  public studentId!: number;
  public subjectId!: number;
  public semesterId!: number;
  public internalMarks!: number;
  public externalMarks!: number;
  public totalMarks!: number;
  public grade!: string;
}

Marks.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: 'students', key: 'id' },
    },
    subjectId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: { model: 'subjects', key: 'id' },
    },
    internalMarks: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    externalMarks: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    totalMarks: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    grade: {
      type: DataTypes.STRING(2),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Marks',
    tableName: 'marks',
  }
);

export default Marks;
```

#### 2. Create Controller

```typescript
// src/controllers/MarksController.ts
import { Request, Response } from 'express';
import Marks from '../models/Marks';
import Student from '../models/Student';
import Subject from '../models/Subject';
import redis from '../config/redis';

export class MarksController {
  // Get marks for a student
  async getStudentMarks(req: Request, res: Response) {
    try {
      const studentId = req.params.studentId;
      
      // Check cache
      const cacheKey = `marks:student:${studentId}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      const marks = await Marks.findAll({
        where: { studentId },
        include: [
          { model: Subject, attributes: ['id', 'name', 'code'] },
        ],
      });

      // Cache for 6 hours
      await redis.setex(cacheKey, 21600, JSON.stringify(marks));

      res.json(marks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch marks' });
    }
  }

  // Submit marks
  async submitMarks(req: Request, res: Response) {
    try {
      const { studentId, subjectId, internalMarks, externalMarks } = req.body;

      // Validate input
      if (!studentId || !subjectId || internalMarks === undefined || externalMarks === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Calculate total and grade
      const totalMarks = internalMarks + externalMarks;
      const grade = this.calculateGrade(totalMarks);

      // Create/Update marks
      const [marks, created] = await Marks.findOrCreate({
        where: { studentId, subjectId },
        defaults: {
          internalMarks,
          externalMarks,
          totalMarks,
          grade,
        },
      });

      if (!created) {
        await marks.update({
          internalMarks,
          externalMarks,
          totalMarks,
          grade,
        });
      }

      // Invalidate cache
      await redis.del(`marks:student:${studentId}`);

      res.json({ success: true, marks });
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit marks' });
    }
  }

  private calculateGrade(totalMarks: number): string {
    if (totalMarks >= 90) return 'A+';
    if (totalMarks >= 80) return 'A';
    if (totalMarks >= 70) return 'B+';
    if (totalMarks >= 60) return 'B';
    if (totalMarks >= 50) return 'C';
    return 'F';
  }
}
```

#### 3. Create Validator

```typescript
// src/validators/marksValidator.ts
import Joi from 'joi';

export const submitMarksSchema = Joi.object({
  studentId: Joi.number().integer().positive().required(),
  subjectId: Joi.number().integer().positive().required(),
  internalMarks: Joi.number().min(0).max(40).required(),
  externalMarks: Joi.number().min(0).max(60).required(),
});
```

#### 4. Create Routes

```typescript
// src/routes/marks.ts
import express from 'express';
import { MarksController } from '../controllers/MarksController';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/role';
import { validate } from '../middleware/validate';
import { submitMarksSchema } from '../validators/marksValidator';

const router = express.Router();
const controller = new MarksController();

// Get student marks (student can see own, teacher can see class)
router.get(
  '/student/:studentId',
  authMiddleware,
  controller.getStudentMarks.bind(controller)
);

// Submit marks (teacher only)
router.post(
  '/submit',
  authMiddleware,
  roleMiddleware(['TEACHER']),
  validate(submitMarksSchema),
  controller.submitMarks.bind(controller)
);

export default router;
```

#### 5. Register Routes in App

```typescript
// src/app.ts
import express from 'express';
import marksRouter from './routes/marks';

const app = express();

// ... other middleware

// API routes
app.use('/api/marks', marksRouter);
```

#### 6. Write Tests

```typescript
// tests/integration/marks.test.ts
import request from 'supertest';
import app from '../../src/app';
import sequelize from '../../src/config/database';

describe('Marks Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync();
  });

  describe('GET /api/marks/student/:studentId', () => {
    it('should return student marks', async () => {
      const response = await request(app)
        .get('/api/marks/student/1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 401 without auth', async () => {
      const response = await request(app)
        .get('/api/marks/student/1');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/marks/submit', () => {
    it('should submit marks', async () => {
      const response = await request(app)
        .post('/api/marks/submit')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          studentId: 1,
          subjectId: 1,
          internalMarks: 35,
          externalMarks: 55,
        });

      expect(response.status).toBe(200);
      expect(response.body.marks).toBeDefined();
    });

    it('should validate input', async () => {
      const response = await request(app)
        .post('/api/marks/submit')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          studentId: 1,
          // missing required fields
        });

      expect(response.status).toBe(400);
    });
  });
});
```

---

## Testing Backend Code

### Unit Tests

```typescript
// tests/unit/services/MarksService.test.ts
import { MarksService } from '../../../src/services/MarksService';
import Marks from '../../../src/models/Marks';

jest.mock('../../../src/models/Marks');

describe('MarksService', () => {
  let service: MarksService;

  beforeEach(() => {
    service = new MarksService();
  });

  describe('calculateGrade', () => {
    it('should return A+ for 90+', () => {
      const grade = service.calculateGrade(95);
      expect(grade).toBe('A+');
    });

    it('should return F for <50', () => {
      const grade = service.calculateGrade(40);
      expect(grade).toBe('F');
    });
  });

  describe('getStudentMarks', () => {
    it('should return student marks', async () => {
      (Marks.findAll as jest.Mock).mockResolvedValue([
        { studentId: 1, totalMarks: 85 },
      ]);

      const marks = await service.getStudentMarks(1);

      expect(marks).toHaveLength(1);
      expect(Marks.findAll).toHaveBeenCalled();
    });
  });
});
```

### Integration Tests

```typescript
// tests/integration/auth.test.ts
describe('Authentication Flow', () => {
  it('should complete full login workflow', async () => {
    // 1. Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'student@college.com',
        password: 'password123',
      });

    expect(loginRes.status).toBe(200);
    const { accessToken, refreshToken } = loginRes.body;
    
    // 2. Use token to access protected route
    const protectedRes = await request(app)
      .get('/api/students/dashboard')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(protectedRes.status).toBe(200);

    // 3. Refresh token
    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(refreshRes.status).toBe(200);

    // 4. Logout
    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(logoutRes.status).toBe(200);
  });
});
```

---

# FRONTEND DEVELOPMENT

## Frontend Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── dashboard/
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── TeacherDashboard.tsx
│   │   │   └── ...
│   │   └── forms/
│   │       ├── AdmissionForm.tsx
│   │       ├── MarkSubmissionForm.tsx
│   │       └── ...
│   ├── pages/                # Page components
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── StudentMarks.tsx
│   │   ├── TeacherAttendance.tsx
│   │   └── ...
│   ├── services/             # API calls
│   │   ├── api.ts            # Axios config
│   │   ├── authService.ts
│   │   ├── studentService.ts
│   │   └── ...
│   ├── store/                # Redux
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   └── ...
│   │   └── index.ts
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   └── ...
│   ├── utils/                # Utilities
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── ...
│   ├── types/                # TypeScript types
│   │   ├── User.ts
│   │   ├── Student.ts
│   │   └── ...
│   ├── styles/               # Global styles
│   │   └── globals.css
│   ├── App.tsx               # Main component
│   └── main.tsx              # Entry point
├── tests/
│   ├── unit/                 # Unit tests
│   │   ├── components/
│   │   └── hooks/
│   ├── integration/          # E2E tests
│   │   └── auth.cy.ts        # Cypress
│   └── fixtures/             # Test data
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── Dockerfile
```

---

## Creating a New Page

### Example: Student Marks Page

#### 1. Create API Service

```typescript
// src/services/marksService.ts
import api from './api';

export interface Mark {
  id: number;
  subject: string;
  internal: number;
  external: number;
  total: number;
  grade: string;
}

export const marksService = {
  async getStudentMarks(): Promise<Mark[]> {
    const response = await api.get('/marks/student/me');
    return response.data;
  },

  async getMarksHistory(semesterId: number): Promise<Mark[]> {
    const response = await api.get(`/marks/history/${semesterId}`);
    return response.data;
  },
};
```

#### 2. Create Redux Slice

```typescript
// src/store/slices/marksSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { marksService, Mark } from '../../services/marksService';

interface MarksState {
  marks: Mark[];
  loading: boolean;
  error: string | null;
}

const initialState: MarksState = {
  marks: [],
  loading: false,
  error: null,
};

export const fetchStudentMarks = createAsyncThunk(
  'marks/fetchStudentMarks',
  async (_, { rejectWithValue }) => {
    try {
      return await marksService.getStudentMarks();
    } catch (error) {
      return rejectWithValue('Failed to fetch marks');
    }
  }
);

const marksSlice = createSlice({
  name: 'marks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentMarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentMarks.fulfilled, (state, action) => {
        state.loading = false;
        state.marks = action.payload;
      })
      .addCase(fetchStudentMarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default marksSlice.reducer;
```

#### 3. Create Custom Hook

```typescript
// src/hooks/useMarks.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentMarks } from '../store/slices/marksSlice';
import { RootState } from '../store/store';

export const useMarks = () => {
  const dispatch = useDispatch();
  const { marks, loading, error } = useSelector((state: RootState) => state.marks);

  useEffect(() => {
    dispatch(fetchStudentMarks());
  }, [dispatch]);

  return { marks, loading, error };
};
```

#### 4. Create Component

```typescript
// src/components/dashboard/StudentMarks.tsx
import React from 'react';
import { useMarks } from '../../hooks/useMarks';
import { Card, Table, Badge, Spinner } from '../common';
import './StudentMarks.css';

export const StudentMarks: React.FC = () => {
  const { marks, loading, error } = useMarks();

  if (loading) return <Spinner />;
  if (error) return <div className="error">{error}</div>;

  const calculateCGPA = () => {
    if (marks.length === 0) return 0;
    const total = marks.reduce((sum, mark) => sum + mark.total, 0);
    return (total / marks.length).toFixed(2);
  };

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      'A+': 'bg-green-600',
      'A': 'bg-green-500',
      'B+': 'bg-blue-600',
      'B': 'bg-blue-500',
      'C': 'bg-yellow-500',
      'F': 'bg-red-600',
    };
    return colors[grade] || 'bg-gray-500';
  };

  return (
    <div className="student-marks">
      <Card title="Academic Performance">
        <div className="cgpa-section">
          <div className="cgpa-display">
            <h3>CGPA</h3>
            <p className="cgpa-value">{calculateCGPA()}</p>
          </div>
        </div>

        <Table
          columns={[
            { key: 'subject', label: 'Subject' },
            { key: 'internal', label: 'Internal' },
            { key: 'external', label: 'External' },
            { key: 'total', label: 'Total' },
            { key: 'grade', label: 'Grade', render: (grade) => (
              <Badge className={getGradeColor(grade)}>{grade}</Badge>
            )},
          ]}
          data={marks}
        />
      </Card>
    </div>
  );
};
```

#### 5. Create Page

```typescript
// src/pages/StudentMarks.tsx
import React from 'react';
import { Layout } from '../components/layout/Layout';
import { StudentMarks } from '../components/dashboard/StudentMarks';

export const StudentMarksPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Marks</h1>
        <StudentMarks />
      </div>
    </Layout>
  );
};
```

#### 6. Add Route

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StudentMarksPage } from './pages/StudentMarks';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/student/marks"
          element={<ProtectedRoute roles={['STUDENT']} component={StudentMarksPage} />}
        />
      </Routes>
    </BrowserRouter>
  );
};
```

#### 7. Write Tests

```typescript
// tests/unit/components/StudentMarks.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { StudentMarks } from '../../../src/components/dashboard/StudentMarks';
import { store } from '../../../src/store/store';

describe('StudentMarks', () => {
  it('should render marks table', () => {
    render(
      <Provider store={store}>
        <StudentMarks />
      </Provider>
    );

    expect(screen.getByText('Academic Performance')).toBeInTheDocument();
  });

  it('should calculate CGPA correctly', () => {
    // Test CGPA calculation
  });
});
```

---

## Frontend Best Practices

### 1. Component Organization

```typescript
// Functional components with hooks
import React, { useState, useEffect } from 'react';

interface MyComponentProps {
  title: string;
  onSubmit: (data: any) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, onSubmit }) => {
  const [state, setState] = useState('');

  useEffect(() => {
    // Side effects
  }, []);

  return (
    <div>{title}</div>
  );
};
```

### 2. Redux Pattern

```typescript
// Actions → Reducer → Selector
// Use slices (Redux Toolkit)
// Create async thunks for API calls
// Keep components focused on rendering
```

### 3. Error Handling

```typescript
try {
  await API_CALL();
} catch (error) {
  // Show toast notification
  // Log error
  // Update Redux state
}
```

### 4. Performance Optimization

```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// Use useCallback for function memoization
const handleClick = useCallback(() => {
  // Handle click
}, [dependencies]);

// Use useMemo for computed values
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.value, 0);
}, [items]);
```

---

# TESTING STRATEGY

## Testing Pyramid

```
        /\         E2E Tests (10%)
       /  \        - Full user workflows
      /____\       - Cypress/Selenium
     
      /    \       Integration Tests (30%)
     /______\      - API + Database
     
    /        \     Unit Tests (60%)
   /__________\    - Functions, components
```

---

## Running Tests

### Backend Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# All tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Frontend Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

---

# DEPLOYMENT & DEVOPS

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
      
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker images
        run: |
          docker build -t myregistry/backend:latest backend/
          docker build -t myregistry/frontend:latest frontend/
      
      - name: Push to registry
        run: |
          echo ${{ secrets.REGISTRY_PASSWORD }} | docker login -u ${{ secrets.REGISTRY_USER }} --password-stdin
          docker push myregistry/backend:latest
          docker push myregistry/frontend:latest
      
      - name: Deploy to K8s
        run: |
          kubectl set image deployment/backend backend=myregistry/backend:latest
          kubectl set image deployment/frontend frontend=myregistry/frontend:latest
```

---

# COMMUNICATION & WORKFLOWS

## Git Workflow

### Branch Naming Convention

```
Feature: feature/short-description
Bug Fix: bugfix/issue-number
Hotfix: hotfix/critical-issue
Release: release/version-number
```

### Commit Message Convention

```
[TICKET-123] Feature: Add student marks submission endpoint

- Implement POST /api/marks endpoint
- Add validation for marks
- Add database transaction
- Add unit tests (90% coverage)

Closes #123
```

### Pull Request Process

```
1. Create branch from main
2. Make changes with tests
3. Push branch
4. Create PR with detailed description
5. Request review (minimum 2 approvals)
6. Address feedback
7. Squash commits if needed
8. Merge to main
9. Delete branch
```

---

## Weekly Milestones

### Week 1-2: Foundation
- [ ] Team onboarding complete
- [ ] Development environment setup
- [ ] CI/CD pipeline working
- [ ] Database structure verified
- [ ] 100+ tests passing

### Week 3-4: Backend
- [ ] 50+ API endpoints implemented
- [ ] Database optimized
- [ ] 250+ tests passing

### Week 5-6: Frontend
- [ ] 40+ pages built
- [ ] Components library complete
- [ ] Mobile responsive

### Week 7-8: Integration
- [ ] Real-time features working
- [ ] 200+ integration tests
- [ ] Load test: 1000 users

### Week 9-10: Infrastructure
- [ ] K8s deployment ready
- [ ] Load test: 5000 users
- [ ] Monitoring active

### Week 11-12: Launch
- [ ] Documentation complete
- [ ] Team trained
- [ ] Production deployment
- [ ] System stable

---

## Success Metrics

### Code Quality
- Test coverage: ≥80%
- Linting: 0 errors
- Type checking: 0 errors
- Code review: All PRs reviewed

### Performance
- Backend: P95 <200ms
- Frontend: Lighthouse >90
- Load test: 5000 users
- Error rate: <0.1%

### Team
- Daily standups: 100% attendance
- Code reviews: <24 hour turnaround
- Issue resolution: <48 hours
- Documentation: Complete

---

## Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check PostgreSQL running
docker ps | grep postgres

# Check credentials
psql -h localhost -U erp_user -d college_erp_db

# Restart container
docker-compose restart postgres
```

#### Redis Connection Error
```bash
# Check Redis running
docker ps | grep redis

# Test connection
redis-cli ping

# Restart container
docker-compose restart redis
```

#### Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

#### Test Failures
```bash
# Run single test file
npm test -- marks.test.ts

# Run with verbose output
npm test -- --verbose

# Update snapshots if needed
npm test -- -u
```

---

## Support & Escalation

### Support Channels
- Slack: #erp-support
- Email: erp-team@college.com
- GitHub Issues: Direct link

### Escalation Path
1. Team Lead (immediate)
2. CTO (24 hours)
3. CEO (critical only)

---

## Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-06 | Initial release |
| 1.1 | - | Pending |

---

**Document Owner:** Team Lead  
**Last Updated:** July 6, 2026  
**Next Review:** July 20, 2026

---

**END OF DOCUMENT**

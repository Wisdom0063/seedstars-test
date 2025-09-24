# SIGMA Card Framework Navigator

A modern, flexible card navigation system built for SIGMA's business design platform. This project implements a Notion-like, multi-view interface that transforms static framework cards into a dynamic, scalable, and collaborative experience for entrepreneurs working with Business Model Canvas, Value Proposition Canvas, and Customer Segments.

## 🎯 Project Overview

This implementation addresses SIGMA's core pain points:
- **Framework cards are hard to navigate at scale** → Multi-view system with smooth transitions
- **Tables feel rigid for power users** → Flexible views with inline editing and auto-save
- **Need for modern, AI-native productivity platform** → Future-ready architecture

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- SQLite (for database)

### Installation & Setup

1. **Clone and install dependencies:**
```bash
cd card-navigation
npm install
```

2. **Set up the database:**
```bash
# Set up Mock database
npx prisma generate
npx prisma migrate dev
npx prisma db push

# Seed with sample data
npm run seed
```

3. **Start the development server:**
```bash
npm run dev
```

4. **Open the application:**
Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed` - Populate database with sample data
- `npm run lint` - Run ESLint

## 🏗️ Architecture & Design Decisions

### Core Architecture

#### **1. Multi-View System**
```
┌─────────────────────────────────────────┐
│              View Manager               │
├─────────────────────────────────────────┤
│  Card View  │  Table View │ Kanban View │
├─────────────────────────────────────────┤
│           Detail Drawer                 │
└─────────────────────────────────────────┘
```

**Design Decision:** Implemented a flexible view management system that allows users to switch between different data representations without losing context.

**Benefits:**
- Scalable rendering for large datasets
- Consistent UX across different view types
- Easy to extend with new view formats

#### **2. Component Structure**
```
/components
├── view-manager/           # Core view management
│   ├── generic-view-manager.tsx   # Main orchestrator
│   ├── view-detail-drawer.tsx # Universal drawer
│   └── view-*.tsx         # View implementations
├── views/                 # Framework-specific components
│   ├── business-model/    # Business Model Canvas
│   ├── value-proposition/ # Value Proposition Canvas
│   └── customer-segment/  # Customer Segments & Personas
└── ui/                   # Reusable UI components
```

**Design Decision:** Separated view management logic from framework-specific implementations to enable easy extension and maintenance.


### Mock API
Mock API is used for development and testing purposes.


## 🎨 Key Features Implemented

### **1. Multi-View Navigation**
- **Card View:** Visual card-based layout with drag-and-drop
- **Table View:** Sortable, filterable data tables
- **Kanban View:** Workflow-based organization
- **Smooth Transitions:** No page reloads between views

### **2. Side-Drawer Detail View**
- **2-Column Layout:** Optimized for Business Model Canvas structure
- **Auto-Save:** Real-time saving with visual status indicators
- **Responsive Design:** Adapts to tablet and desktop screens
- **Framework-Specific:** Tailored layouts for each business framework

## 🔧 Technical Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React features
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling


## ⚠️ Known Limitations & Trade-offs




# Sovereign Finance - Admin Terminal

Sovereign Finance is a frontend-only finance dashboard built for the internship assignment. It helps users view account health, inspect transactions, and understand spending behavior through charts and insights.

## Setup Instructions

### Prerequisites
- Node.js 18 or newer
- npm

### Install
```bash
npm install
```

### Run in Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

Open the app in your browser at the local URL shown in terminal.

## Overview of Approach

### Product thinking
- Organized the app around three primary user surfaces: Dashboard, Transactions, and Insights.
- Designed for clarity first: high-level summary at top, details and actions beneath.
- Kept interactions realistic for a demo assignment without adding unnecessary backend complexity.

### Architecture
- Framework: Next.js App Router
- Language: TypeScript
- Styling: global CSS design tokens and reusable utility classes
- Charts: Recharts
- Icons: Lucide
- Motion: Framer Motion

### State management
- Uses React Context in `lib/DashboardContext.tsx`.
- Centralized state includes:
  - Current role (`admin` or `viewer`)
  - Transactions list
  - Global category filter
  - Toast notifications
  - Mobile sidebar state

### Code organization
- `app/`: route-level pages and root layout
- `components/`: domain-based reusable UI components
- `lib/`: shared types, hooks, mock data, and utility helpers

## Explanation of Features

### 1) Dashboard Overview
- KPI summary cards for total balance, income, expenses, and savings.
- Time-based trend chart for account movement.
- Categorical spending breakdown.
- Quick actions and smart insight cards.

### 2) Transactions Section
- Tabular transaction listing with category/type/status/account/date/amount.
- Search and filtering.
- Sorting by key columns.
- Pagination.
- Empty-state messaging when filters produce no results.

### 3) Basic Role-Based UI
- Role toggle between `admin` and `viewer`.
- Admin can add/edit/delete transactions.
- Viewer can inspect data but cannot mutate records.

### 4) Insights Section
- Income vs expense comparison chart.
- Balance trend chart.
- Spending distribution donut chart.
- Performance metrics and summary observations.

### 5) User Experience
- Responsive layout across desktop/tablet/mobile.
- Sidebar collapse and mobile navigation behavior.
- Animated transitions and toast feedback.
- Dark/light theme support.

### 6) Technical Quality
- Type-safe models in `lib/types.ts`.
- Reusable components for cards/charts/layout shells.
- Clear separation between data, state, and presentation.

## Assignment Criteria Mapping

- Design and Creativity: consistent visual language, hierarchy, and polished financial UI.
- Responsiveness: breakpoint-based adaptive layouts and mobile nav behavior.
- Functionality: dashboard stats/charts, RBAC demo, transaction tools, insight views.
- User Experience: smooth navigation, visual feedback, and practical interactions.
- Technical Quality: modular structure, typed contracts, reusable components.
- State Management Approach: centralized context with predictable UI state flow.
- Documentation: this README covers setup, approach, and features.
- Attention to Detail: edge-state handling, formatting consistency, and transitions.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Framer Motion
- Recharts
- Lucide React
- CSS (design-token based global styling)
# Sovereign-Finance

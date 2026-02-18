# Teacup - No-Code SaaS Platform

Teacup is a 100% no-code SaaS platform for retail, ecommerce, and service businesses who want a powerful website without technical headaches. Launch a fast, professional site that boosts customer acquisition automatically.

## 🎯 What Teacup Can Do

Teacup is designed to be a comprehensive website management platform that enables businesses to:

- **Create and Manage Websites** - Build professional websites without coding knowledge
- **Blog Management** - Create, edit, and publish blog posts with a rich text editor
- **Customer Communication** - Manage multiple contact inboxes to handle customer inquiries
- **Analytics Tracking** - Monitor website performance with detailed analytics dashboards
- **AI-Powered Assistance** - Get help with website tasks through the "Hold My Tea" AI assistant
- **Multi-User Collaboration** - Share website access with team members
- **Custom Domains** - Connect your own domain to your Teacup-powered website
- **Subscription Management** - Offer monthly or lifetime subscription plans

## ✅ What's Currently Implemented

### Public Features (Fully Functional)

- ✅ **Landing Page** - Professional homepage with hero section and call-to-action
- ✅ **Authentication System** - Complete user registration and login via Supabase
- ✅ **About Page** - Company information and mission statement
- ✅ **Pricing Page** - Display of subscription plans (Monthly $40/month, Lifetime $500)
- ✅ **Blog Listing** - Public blog posts with category filtering (demo data)
- ✅ **Individual Blog Posts** - Full blog post view with author info (demo data)
- ✅ **Responsive Design** - Mobile-friendly interface across all pages
- ✅ **Theme Support** - Dark/light mode toggle

### Dashboard Features (Backend-Connected)

- ✅ **Main Dashboard** - Overview of company data, recent messages, and blog posts
- ✅ **Blog Management** - Full CRUD operations for blog posts
  - Create new blog posts with rich text editor (Quill)
  - Edit existing blog posts
  - Delete blog posts
  - View all user blogs
- ✅ **Inbox Management** - Complete inbox system
  - Create multiple inboxes for different purposes
  - View messages in each inbox
  - Delete inboxes and messages
  - Latest messages overview on dashboard
- ✅ **Analytics Dashboard** - Track website performance
  - Page view analytics
  - Form submission tracking
  - Button click tracking
  - Interactive charts with date range filtering
- ✅ **Company Management** - Manage company information and settings
- ✅ **AI Assistant ("Hold My Tea")** - AI-powered help for website tasks
- ✅ **Settings Page** - User preferences and profile management

### Demo/Placeholder Features (Not Yet Connected)

- ⚠️ **Contact Form** - Form UI exists but doesn't submit to backend
- ⚠️ **Checkout Page** - Payment form UI exists but no payment processing
- ⚠️ **Order Free Site** - Form exists but doesn't process orders
- ⚠️ **Welcome Page** - Onboarding UI exists but limited functionality

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: TailwindCSS v4 with custom components
- **State Management**: React Query (@tanstack/react-query) for server state
- **UI Components**:
  - Radix UI primitives for accessibility
  - Custom shadcn/ui inspired components
  - Lucide React icons
- **Rich Text Editor**: Quill for blog post creation
- **Charts**: Recharts for analytics visualization
- **Forms**: React Hook Form with Zod validation
- **Notifications**: Sonner toast notifications

### Backend Integration

- **Authentication**: Supabase Auth (fully integrated)
- **API**: Custom REST API (configured via BACKEND env var)
- **Data Fetching**: React Query with automatic caching and revalidation

### Development Tools

- **Language**: TypeScript
- **Linting**: ESLint
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── providers.tsx            # React Query & Theme providers
│   ├── auth/                    # Authentication pages
│   │   ├── login/              # Login page
│   │   └── signup/             # Signup page
│   ├── dashboard/              # Protected dashboard routes
│   │   ├── page.tsx            # Main dashboard
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   ├── analytics/          # Analytics dashboard
│   │   ├── blogs/              # Blog management
│   │   │   ├── new/           # Create new blog
│   │   │   └── edit/[id]/     # Edit blog
│   │   ├── inboxes/           # Inbox management
│   │   │   └── [id]/          # Individual inbox view
│   │   └── settings/          # Settings page
│   ├── blogs/                  # Public blog pages
│   │   ├── page.tsx           # Blog listing
│   │   └── [id]/              # Individual blog post
│   ├── about/                  # About page
│   ├── contact/                # Contact page
│   ├── pricing/                # Pricing page
│   ├── checkout/               # Checkout page
│   ├── order-site/             # Free site order page
│   └── welcome/                # Welcome/onboarding page
├── components/                  # Reusable UI components
│   ├── ui/                     # Base UI components (buttons, cards, etc.)
│   ├── app-sidebar.tsx         # Dashboard sidebar
│   ├── dashboard-content.tsx   # Main dashboard content
│   ├── data-table.tsx          # Reusable data table
│   └── chart-area-interactive.tsx # Interactive charts
├── Components/                  # Legacy components (mixed case)
│   ├── Navbar.tsx              # Main navigation
│   ├── Footer.tsx              # Page footer
│   ├── HoldMyTea.tsx           # AI assistant component
│   ├── Modal.tsx               # Modal component
│   └── ThemeToggle.tsx         # Theme switcher
├── Dashboard/                   # Dashboard-specific components
│   ├── Dashboard.tsx           # Dashboard wrapper
│   ├── Inboxes.tsx            # Inbox list component
│   ├── Inbox.tsx              # Individual inbox component
│   └── Analytics/             # Analytics components
│       ├── Analytics.tsx      # Analytics wrapper
│       ├── AnalyticsClient.tsx # Analytics client component
│       └── Chart.tsx          # Chart component
├── lib/                        # Utility libraries
│   ├── analytics.ts           # Analytics utilities
│   ├── blogs.ts               # Blog utilities
│   └── utils.ts               # General utilities
├── hooks/                      # Custom React hooks
│   └── use-mobile.ts          # Mobile detection hook
├── backendProvider.tsx         # API integration layer (React Query)
├── AuthProvider.tsx            # Authentication context
├── ThemeProvider.tsx           # Theme context
├── supabaseClient.ts           # Supabase client configuration
└── envData.ts                  # Environment variables

public/
├── Assets/                     # Static assets
│   ├── icon.png               # App icon
│   ├── icon-beside.png        # Alternative icon
│   └── favicon.ico            # Favicon
├── _redirects                  # Netlify redirects
└── netlify.toml               # Netlify configuration
```

## 🔌 Backend API Integration

The [`backendProvider.tsx`](src/backendProvider.tsx:1) file contains all API integration hooks using React Query.

### API Configuration

- **Base URL**: `process.env.BACKEND || 'http://localhost:8000'`
- **Authentication**: Uses Supabase auth tokens in request headers
- **Caching**: React Query handles automatic caching and revalidation

### Available API Hooks

#### Blog Management

```typescript
useUserBlogs(companyId); // GET /dashboard/blogs/${companyId}
useBlog(companyId, id); // GET /dashboard/blogs/${companyId}/${id}
useCreateBlog(); // POST /dashboard/blogs
useUpdateBlog(); // PUT /dashboard/blogs/${id}
useDeleteBlog(); // DELETE /dashboard/blogs/${id}
```

#### Inbox Management

```typescript
useUserInboxes(companyId); // GET /dashboard/inbox/${companyId}
useCreateInbox(); // POST /dashboard/inbox
useDeleteInbox(); // DELETE /dashboard/inbox/${id}
useInboxData(id); // GET /dashboard/inbox/data/${id}
useDeleteInboxData(); // DELETE /dashboard/inbox/data/${id}
useLatestMessages(companyId, limit); // Aggregated latest messages
```

#### Company Management

```typescript
useCompany(companyId); // GET /dashboard/company/${companyId}
useCreateCompany(); // POST /dashboard/company
useUpdateCompany(); // PUT /dashboard/company/${id}
```

#### Analytics

```typescript
useAnalytics(owner, event); // GET /api/analytics/${owner}?event=${event}
useTrackAnalytics(); // POST /api/analytics
```

#### AI Assistant

```typescript
useHoldMyTea(owner, question); // POST /holdmytea/ask
```

### Data Types

```typescript
export type blogType = {
  id?: number;
  title: string;
  image: string;
  data: string;
  owner: string;
};

export type inboxType = {
  id?: number;
  owner: string;
  name: string;
};

export type CompanyType = {
  id?: string;
  name: string;
  owner: string;
  domain: string;
  activity_data?: ActivityDataType[];
  info?: InfoItemType[];
  sharing?: SharingMemberType[];
  key: string;
};

export type ActivityDataType = {
  day: string;
  visits: number;
};

export type InfoItemType = {
  icon: string;
  title: string;
  data: string[] | number;
  description: string;
};

export type SharingMemberType = {
  name: string;
  email: string;
  status: string;
};
```

## 🏗️ Development Setup

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Supabase account (for authentication)
- Backend API server (optional for full functionality)

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd teacupnet
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Environment variables**:
   Create a `.env.local` file in the root directory:

   ```env
   # Backend API URL (optional - defaults to localhost:8000)
   BACKEND=http://localhost:8000

   # Supabase Configuration (required for authentication)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Run development server**:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

### Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🔐 Authentication

The application uses Supabase for authentication with the following features:

- **Email/Password Authentication** - Traditional login/signup
- **Social Authentication** - Support for OAuth providers (configurable in Supabase)
- **Session Management** - Automatic token refresh and session persistence
- **Protected Routes** - All `/dashboard/*` routes require authentication
- **Auth Context** - Global authentication state via [`AuthProvider.tsx`](src/AuthProvider.tsx:1)

### Authentication Flow

1. User signs up or logs in via [`/auth/login`](src/app/auth/login/page.tsx:1) or [`/auth/signup`](src/app/auth/signup/page.tsx:1)
2. Supabase handles authentication and returns user session
3. Session token is stored and used for API requests
4. Protected routes check authentication status before rendering
5. Unauthenticated users are redirected to login page

## 🎨 UI Components

The application uses a comprehensive component system:

### Base Components (shadcn/ui inspired)

- [`Button`](src/components/ui/button.tsx:1) - Various button styles and sizes
- [`Card`](src/components/ui/card.tsx:1) - Content containers
- [`Input`](src/components/ui/input.tsx:1) - Form inputs
- [`Select`](src/components/ui/select.tsx:1) - Dropdown selects
- [`Table`](src/components/ui/table.tsx:1) - Data tables
- [`Tabs`](src/components/ui/tabs.tsx:1) - Tabbed interfaces
- [`Modal/Dialog`](src/components/ui/drawer.tsx:1) - Modal dialogs
- [`Tooltip`](src/components/ui/tooltip.tsx:1) - Hover tooltips
- [`Avatar`](src/components/ui/avatar.tsx:1) - User avatars
- [`Badge`](src/components/ui/badge.tsx:1) - Status badges
- [`Checkbox`](src/components/ui/checkbox.tsx:1) - Checkboxes
- [`Separator`](src/components/ui/separator.tsx:1) - Visual dividers
- [`Skeleton`](src/components/ui/skeleton.tsx:1) - Loading skeletons

### Custom Components

- [`Navbar`](src/Components/Navbar.tsx:1) - Main navigation header
- [`Footer`](src/Components/Footer.tsx:1) - Page footer
- [`ThemeToggle`](src/Components/ThemeToggle.tsx:1) - Dark/light mode switcher
- [`HoldMyTea`](src/Components/HoldMyTea.tsx:1) - AI assistant interface
- [`Modal`](src/Components/Modal.tsx:1) - Custom modal system
- [`Spinner`](src/Components/Spinner.tsx:1) - Loading indicators
- [`AILoadingSpinner`](src/Components/AILoadingSpinner.tsx:1) - AI-specific loading animation

### Dashboard Components

- [`app-sidebar`](src/components/app-sidebar.tsx:1) - Dashboard sidebar navigation
- [`dashboard-content`](src/components/dashboard-content.tsx:1) - Main dashboard layout
- [`data-table`](src/components/data-table.tsx:1) - Advanced data table with sorting/filtering
- [`chart-area-interactive`](src/components/chart-area-interactive.tsx:1) - Interactive analytics charts

## 📊 Key Features Breakdown

### 1. Blog Management System

- **Rich Text Editor**: Quill-based editor with formatting options
- **Image Upload**: Support for blog post images
- **CRUD Operations**: Create, read, update, delete blog posts
- **Draft System**: Save drafts before publishing
- **Category Support**: Organize blogs by categories
- **Public View**: Separate public-facing blog pages

### 2. Inbox Management

- **Multiple Inboxes**: Create separate inboxes for different purposes
- **Message Viewing**: View all messages in each inbox
- **Message Management**: Delete individual messages or entire inboxes
- **Dashboard Integration**: Latest messages shown on main dashboard
- **Real-time Updates**: React Query keeps data fresh

### 3. Analytics Dashboard

- **Event Tracking**: Track page views, form submissions, button clicks
- **Interactive Charts**: Recharts-powered visualizations
- **Date Range Filtering**: View analytics for specific time periods
- **Multiple Event Types**: Separate tracking for different event types
- **Visual Insights**: Area charts, bar charts, and trend lines

### 4. AI Assistant ("Hold My Tea")

- **Natural Language Interface**: Ask questions in plain English
- **Website Help**: Get assistance with website-related tasks
- **Modal Interface**: Clean, focused interaction design
- **Loading States**: Visual feedback during AI processing
- **Success Notifications**: Confirmation when tasks complete

### 5. Company Management

- **Company Profiles**: Store company information
- **Domain Management**: Connect custom domains
- **Activity Tracking**: Monitor company activity
- **Team Collaboration**: Share access with team members
- **Settings Management**: Configure company preferences

## 🚀 Deployment

### Netlify Deployment (Recommended)

The project is pre-configured for Netlify deployment:

1. **Connect Repository**: Link your Git repository to Netlify
2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18.x or higher
3. **Environment Variables**: Add all required environment variables in Netlify dashboard
4. **Deploy**: Netlify will automatically build and deploy

Configuration files:

- [`public/_redirects`](public/_redirects:1) - Handles client-side routing
- [`public/netlify.toml`](public/netlify.toml:1) - Netlify-specific configuration

### Other Deployment Options

The application can also be deployed to:

- **Vercel** - Native Next.js support
- **AWS Amplify** - Full-stack deployment
- **Docker** - Containerized deployment
- **Traditional Hosting** - Build and serve static files

## 📝 Current Limitations & Future Enhancements

### Current Limitations

- Payment processing is not implemented (checkout page is UI only)
- Contact form doesn't submit to backend
- Free site order form is not functional
- Some demo data is hardcoded (public blog posts)
- Welcome page has limited functionality

### Planned Enhancements

- [ ] Stripe/PayPal payment integration
- [ ] Functional contact form with email notifications
- [ ] Website builder interface
- [ ] Template marketplace
- [ ] Advanced SEO tools
- [ ] Email marketing integration
- [ ] Custom form builder
- [ ] E-commerce functionality
- [ ] Multi-language support
- [ ] Advanced analytics (conversion tracking, A/B testing)

## 🔧 Configuration

### Theme Configuration

The application supports dark and light themes via [`ThemeProvider.tsx`](src/ThemeProvider.tsx:1). Theme preference is persisted in localStorage.

### API Configuration

Backend API URL is configured via environment variable:

```typescript
const API_URL = process.env.BACKEND || 'http://localhost:8000';
```

### Supabase Configuration

Supabase client is configured in [`supabaseClient.ts`](src/supabaseClient.ts:1) using environment variables.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use existing component patterns
- Write meaningful commit messages
- Test thoroughly before submitting PR
- Update documentation for new features

## 📄 License

[Add your license information here]

## 🆘 Support

For support, please:

- Open an issue on GitHub
- Contact the development team
- Check the documentation

## 🙏 Acknowledgments

- Built with Next.js and React
- UI components inspired by shadcn/ui
- Icons by Lucide and Tabler Icons
- Authentication by Supabase
- Charts by Recharts

---

**Version**: 0.0.0  
**Last Updated**: February 2026  
**Status**: Active Development

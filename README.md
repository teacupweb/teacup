# Teacup - No-Code SaaS Platform

Teacup is a 100% no-code SaaS platform for retail, ecommerce, and service businesses who want a powerful website without technical headaches. Launch a fast, professional site that boosts customer acquisition automatically.

## 🚀 Tech Stack

- **Frontend**: Next.js 16 with TypeScript
- **Styling**: TailwindCSS with custom components
- **State Management**: React Query (@tanstack/react-query)
- **Authentication**: Supabase Auth
- **UI Components**: Radix UI + Lucide Icons
- **Backend API**: Custom REST API (configured via BACKEND env var)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Protected dashboard routes
│   └── [public-routes]    # Public pages
├── Components/            # Reusable UI components
├── Dashboard/             # Dashboard-specific components
├── backendProvider.tsx    # API integration layer
└── AuthProvider.tsx       # Authentication context
```

## 🛣️ Routes Documentation

### Public Routes

#### `/` - Homepage
- **Description**: Landing page with hero section and call-to-action
- **Backend Required**: ❌ No
- **Components**: Uses `Navbar`, `Footer`
- **Features**: 
  - Hero section with "Get Started" button
  - Forces light theme
  - Links to authentication

#### `/auth/login` - Login Page
- **Description**: User authentication login
- **Backend Required**: ✅ Yes (Supabase Auth)
- **Components**: Uses `AuthPage` with `isLogin={true}`
- **Features**: Email/password login, social auth options

#### `/auth/signup` - Signup Page  
- **Description**: New user registration
- **Backend Required**: ✅ Yes (Supabase Auth)
- **Components**: Uses `AuthPage` with `isLogin={false}`
- **Features**: User registration, email verification

#### `/blogs` - Blog Listing
- **Description**: Public blog posts listing
- **Backend Required**: ❌ No (uses demo data)
- **Components**: Uses `Navbar`, `Footer`
- **Features**: 
  - Grid layout of blog posts
  - Category filtering
  - Read time indicators
  - Demo blog data (6 posts)

#### `/blogs/[id]` - Individual Blog Post
- **Description**: Single blog post view
- **Backend Required**: ❌ No (uses demo data)
- **Components**: Uses `Navbar`, `Footer`
- **Features**: 
  - Full blog post content
  - Author information
  - Related posts navigation
  - Demo content for 6 blog posts

#### `/about` - About Page
- **Description**: Company information and mission
- **Backend Required**: ❌ No
- **Components**: Uses `Navbar`, `Footer`
- **Features**: Static content about Teacup

#### `/contact` - Contact Page
- **Description**: Contact form and information
- **Backend Required**: ❌ No (form is not functional)
- **Components**: Uses `Navbar`, `Footer`
- **Features**: 
  - Contact form (demo only)
  - Contact information display
  - Social media links

#### `/pricing` - Pricing Page
- **Description**: Subscription plans and pricing
- **Backend Required**: ❌ No
- **Components**: Uses `Navbar`, `Footer`
- **Features**: 
  - Monthly ($40/month) and Lifetime ($500 one-time) plans
  - Feature comparison
  - Links to checkout
  - Free site order banner

#### `/checkout` - Checkout Page
- **Description**: Payment processing for subscriptions
- **Backend Required**: ⚠️ Partial (user auth only)
- **Components**: Uses `Navbar`, `Footer`
- **Features**: 
  - Requires authentication
  - Plan selection from URL params
  - Payment form (demo only - no actual processing)
  - Order summary
- **Backend Dependencies**:
  - `useAuth()` for user authentication
  - Query params: `?plan=monthly|lifetime`

#### `/order-site` - Free Site Order
- **Description**: Order a free website
- **Backend Required**: ❌ No (form is not functional)
- **Components**: Uses `Navbar`, `Footer`
- **Features**: 
  - Site details form (demo only)
  - Industry selection
  - Features overview
  - Authentication is commented out (accessible to all)

#### `/welcome` - Welcome Page
- **Description**: Post-registration welcome
- **Backend Required**: ❌ No
- **Components**: Uses `Welcome` component
- **Features**: Onboarding and introduction

### Dashboard Routes (Protected)

All dashboard routes require authentication and use the dashboard layout.

#### `/dashboard` - Main Dashboard
- **Description**: Primary dashboard interface
- **Backend Required**: ✅ Yes
- **Components**: Uses `Dashboard` component
- **Backend Dependencies**:
  - `useCompany(companyId)` - Company information
  - `useLatestMessages(companyId)` - Recent inbox messages
  - `useUserBlogs(companyId)` - User's blog posts
  - `useUserInboxes(companyId)` - User's inboxes

#### `/dashboard/analytics` - Analytics Dashboard
- **Description**: Website analytics and metrics
- **Backend Required**: ✅ Yes
- **Components**: Uses `Analytics` component
- **Backend Dependencies**:
  - `useAnalytics(owner, event)` - Analytics data
    - Event types: 'page', 'form', 'button'
  - `useTrackAnalytics()` - Track analytics events
- **API Endpoints**:
  - `GET /api/analytics/${owner}?event=${event}`
  - `POST /api/analytics`

#### `/dashboard/blogs` - Blog Management
- **Description**: Manage blog posts
- **Backend Required**: ✅ Yes
- **Components**: Uses `Blogs` component
- **Backend Dependencies**:
  - `useUserBlogs(companyId)` - Fetch user's blogs
  - `useDeleteBlog()` - Delete blog functionality
- **API Endpoints**:
  - `GET /dashboard/blogs/${companyId}`

#### `/dashboard/blogs/new` - Create Blog
- **Description**: Create new blog post
- **Backend Required**: ✅ Yes
- **Components**: Uses `NewBlog` component
- **Backend Dependencies**:
  - `useCreateBlog()` - Create new blog
- **API Endpoints**:
  - `POST /dashboard/blogs`

#### `/dashboard/blogs/edit/[id]` - Edit Blog
- **Description**: Edit existing blog post
- **Backend Required**: ✅ Yes
- **Components**: Uses `NewBlog` component with `isEditMode`
- **Backend Dependencies**:
  - `useBlog(companyId, id)` - Fetch specific blog
  - `useUpdateBlog()` - Update blog functionality
- **API Endpoints**:
  - `GET /dashboard/blogs/${companyId}/${id}`
  - `PUT /dashboard/blogs/${id}`

#### `/dashboard/inboxes` - Inbox Management
- **Description**: Manage contact inboxes
- **Backend Required**: ✅ Yes
- **Components**: Uses `Inboxes` component
- **Backend Dependencies**:
  - `useUserInboxes(companyId)` - Fetch user's inboxes
  - `useCreateInbox()` - Create new inbox
  - `useDeleteInbox()` - Delete inbox
- **API Endpoints**:
  - `GET /dashboard/inbox/${companyId}`
  - `POST /dashboard/inbox`
  - `DELETE /dashboard/inbox/${id}`

#### `/dashboard/inboxes/[id]` - Individual Inbox
- **Description**: View specific inbox messages
- **Backend Required**: ✅ Yes
- **Components**: Uses `Inbox` component
- **Backend Dependencies**:
  - `useInboxData(id)` - Fetch inbox messages
  - `useDeleteInboxData()` - Delete inbox messages
- **API Endpoints**:
  - `GET /dashboard/inbox/data/${id}`
  - `DELETE /dashboard/inbox/data/${id}`

#### `/dashboard/settings` - Settings
- **Description**: User and application settings
- **Backend Required**: ⚠️ Partial
- **Components**: Uses `Settings` component
- **Features**: Profile settings, preferences (backend integration may be partial)

## 🔌 Backend Provider API

The `backendProvider.tsx` file contains all API integration hooks using React Query.

### API Configuration
- **Base URL**: `process.env.BACKEND || 'http://localhost:8000'`
- **Authentication**: Uses Supabase auth tokens
- **Data Fetching**: React Query for caching and state management

### Available API Hooks

#### Blog Management
```typescript
useUserBlogs(companyId)           // GET /dashboard/blogs/${companyId}
useBlog(companyId, id)           // GET /dashboard/blogs/${companyId}/${id}
useCreateBlog()                  // POST /dashboard/blogs
useUpdateBlog()                  // PUT /dashboard/blogs/${id}
useDeleteBlog()                  // DELETE /dashboard/blogs/${id}
```

#### Inbox Management
```typescript
useUserInboxes(companyId)        // GET /dashboard/inbox/${companyId}
useCreateInbox()                 // POST /dashboard/inbox
useDeleteInbox()                 // DELETE /dashboard/inbox/${id}
useInboxData(id)                 // GET /dashboard/inbox/data/${id}
useDeleteInboxData()             // DELETE /dashboard/inbox/data/${id}
useLatestMessages(companyId, limit) // Aggregated latest messages
```

#### Company Management
```typescript
useCompany(companyId)             // GET /dashboard/company/${companyId}
useCreateCompany()               // POST /dashboard/company
useUpdateCompany()               // PUT /dashboard/company/${id}
```

#### Analytics
```typescript
useAnalytics(owner, event)       // GET /api/analytics/${owner}?event=${event}
useTrackAnalytics()              // POST /api/analytics
```

#### AI Assistant
```typescript
useHoldMyTea(owner, question)    // POST /holdmytea/ask
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
```

## 🏗️ Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment variables**:
   ```env
   BACKEND=http://localhost:8000  # Your backend API URL
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 🔐 Authentication

The application uses Supabase for authentication:
- **Provider**: `AuthProvider.tsx`
- **Protected Routes**: All `/dashboard/*` routes
- **Auth Pages**: `/auth/login`, `/auth/signup`
- **User State**: Managed via React Context

## 🎨 UI Components

The application uses a custom component system built with:
- **TailwindCSS** for styling
- **Radix UI** for accessible primitives
- **Lucide React** for icons
- **shadcn/ui** inspired components

### Key Components
- `Navbar` - Navigation header
- `Footer` - Page footer
- `ThemeToggle` - Dark/light mode toggle
- `Modal` - Reusable modal component
- `Spinner` - Loading states
- `DisplayCards` - Card grid layouts

## 📊 Features

### Public Features
- Responsive design
- Dark/light theme support
- Blog system (demo data)
- Contact forms (demo)
- Pricing page
- Free site ordering (demo)

### Dashboard Features
- Blog CRUD operations
- Inbox management
- Analytics dashboard
- Company management
- Settings management
- AI assistant integration

## 🚀 Deployment

The application is configured for deployment on Netlify (based on `.netlify/` directory presence).

### Build Configuration
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Node Version**: Latest LTS

## 📝 Notes

- Some forms are demo-only and don't connect to backend
- Blog system uses static demo data
- Payment processing is demo-only
- Authentication is fully functional with Supabase
- Dashboard features require backend API integration
- The application uses TypeScript for type safety

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

[Add your license information here]

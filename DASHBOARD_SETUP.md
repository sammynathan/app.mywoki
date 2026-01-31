# Mywoki Dashboard Setup Guide

## Overview
This guide will help you set up the complete dashboard system for your Mywoki application. The dashboard provides tool management, user analytics, and Mywoki integration features.

## 📋 Prerequisites
- Existing Mywoki authentication system
- Supabase project configured
- Node.js and npm installed

## 🗄️ Database Setup

### 1. Run the Dashboard Schema
Execute the SQL in `src/dashboard-schema.sql` in your Supabase SQL editor:

```sql
-- This will create:
-- - tools table with sample data
-- - user_tool_activations table
-- - Add Mywoki fields to your existing users table
-- - Set up RLS policies and triggers
```

### 2. Environment Variables
Add these to your `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏗️ Components Created

### Core Dashboard Files:
- `src/lib/types.ts` - TypeScript interfaces
- `src/lib/supabase.ts` - Database client
- `src/components/ui/` - Reusable UI components
- `src/components/Dashboard.tsx` - Main dashboard page
- `src/components/tool-card.tsx` - Tool management cards
- `src/components/sidebar.tsx` - Navigation sidebar
- `src/components/DashboardLayout.tsx` - Layout wrapper

### Key Features:
- ✅ Tool activation/deactivation
- ✅ Category filtering
- ✅ Usage statistics
- ✅ Mywoki OAuth integration
- ✅ Responsive design
- ✅ Real-time updates

## 🚀 Usage

### Accessing the Dashboard
Navigate to `/dashboard` after logging in. The dashboard includes:

1. **Stats Overview** - Total, active, inactive tools and issues
2. **Recommended Tools** - Popular tools based on usage
3. **Tool Management** - Activate/deactivate tools with filtering
4. **Sidebar Navigation** - Access to tools, analytics, settings

### Tool Activation
- **Standard Tools**: Click activate to use immediately
- **Mywoki Tools**: Requires Mywoki account linking for activation

## 🔧 Integration Points

### With Existing Auth System
The dashboard integrates with your existing authentication:
- Uses your `users` table structure
- Respects your RLS policies
- Works with your login flow

### Database Relationships
```
users (your existing table)
├── mywoki_account_linked
├── mywoki_user_id
└── user_tool_activations (new table)
    └── tools (new table)
```

## 🎨 Customization

### Branding
- Logo: Update `src/components/sidebar.tsx` line 25
- Colors: Modify Tailwind classes for green theme
- Icons: Add new icons to `getIcon()` function in `tool-card.tsx`

### Adding New Tools
Insert into the `tools` table:
```sql
INSERT INTO tools (name, description, icon_name, category, requires_mywoki_login)
VALUES ('Your Tool', 'Description', 'icon-name', 'Category', false);
```

### New Dashboard Pages
1. Create component in `src/components/`
2. Add route to `src/App.tsx` in dashboard routes section
3. Add navigation item to `src/components/sidebar.tsx`

## 🔒 Security

### RLS Policies
- Users can only see their own tool activations
- Anyone can view available tools
- Mywoki account linking is user-specific

### Authentication
- Dashboard routes are protected
- Session validation on page load
- Automatic redirect to login if not authenticated

## 📊 Analytics & Monitoring

### Usage Tracking
- Automatic usage stats updates via database triggers
- Tool activation counts
- Last used timestamps

### Available Metrics
- Total tools per user
- Activation rates
- Popular tools
- Issue tracking

## 🐛 Troubleshooting

### Common Issues:
1. **Build Errors**: Run `npm install` to ensure all dependencies
2. **Database Connection**: Verify Supabase credentials
3. **Auth Issues**: Check your existing auth setup
4. **Type Errors**: Ensure TypeScript types are properly imported

### Debug Mode:
Set `VITE_DEBUG=true` in environment for additional logging.

## 📝 API Reference

### Tool Management
- `GET /tools` - List all available tools
- `POST /user_tool_activations` - Activate tool
- `PATCH /user_tool_activations/{id}` - Update activation status

### User Data
- `GET /users/me` - Current user profile
- `PATCH /users/me` - Update user preferences

## 🎯 Next Steps

1. **Deploy**: Push changes to production
2. **Test**: Verify all features work in production
3. **Monitor**: Set up error tracking and analytics
4. **Extend**: Add more dashboard features as needed

## 📞 Support

For issues with the dashboard setup:
1. Check the browser console for errors
2. Verify database schema is applied correctly
3. Ensure environment variables are set
4. Check Supabase logs for database errors

The dashboard is now fully integrated with your existing Mywoki authentication system! 🎉

# Sammy Nathan Business Portal Setup

This document explains how to set up the Sammy Nathan business portal at `https://business.mywoki.com/`.

## Overview

The Sammy Nathan business portal is a separate professional landing page designed for business consulting, marketing, and campaign management services. It operates independently from the main Mywoki platform.

## Features

- **Professional Landing Page**: Clean, modern design showcasing services
- **SEO Optimized**: Structured data for "Sammy Nathan" searches
- **Contact Integration**: Built-in contact form and CTA buttons
- **Service Showcase**: Digital Marketing, Business Consulting, Brand Development, Campaign Management
- **Testimonials**: Client feedback and success metrics
- **Responsive Design**: Works on all devices

## Current Implementation

### Files Created/Modified:
- `src/components/SammyNathanPage.tsx` - Main business portal component
- `src/App.tsx` - Added `/sammy-nathan` route
- `index.html` - Added SEO structured data for Sammy Nathan
- `vercel.business.json` - Vercel configuration for subdomain

### Route
- **URL**: `/sammy-nathan` (accessible at `https://yourdomain.com/sammy-nathan`)
- **Component**: `SammyNathanPage`
- **Access**: Public (no authentication required)

## Vercel Deployment Setup

### Option 1: Separate Vercel Project (Recommended)

1. **Create a new Vercel project** for the business subdomain:
   ```bash
   # Clone or copy this repository to a new directory
   git clone <your-repo> business-portal
   cd business-portal

   # Install dependencies
   npm install

   # Build the project
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   npx vercel --prod
   ```

3. **Configure custom domain** in Vercel dashboard:
   - Go to your project settings
   - Add domain: `business.mywoki.com`
   - Vercel will provide DNS configuration
   - Update your DNS records as instructed

### Option 2: Same Project with Subdomain Routing

If you prefer to keep it in the same Vercel project:

1. **Update `vercel.json`** to handle subdomain routing:
   ```json
   {
     "version": 2,
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ],
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           }
         ]
       }
     ]
   }
   ```

2. **Configure subdomain** in Vercel dashboard to point to the same project.

## SEO Configuration

The portal includes comprehensive SEO setup:

### Structured Data
- **Person Schema**: Sammy Nathan profile with business information
- **Professional Service Schema**: Business consulting services
- **Organization Schema**: Mywoki company information

### Search Optimization
- Meta tags optimized for "Sammy Nathan" searches
- Professional service keywords
- Business consulting focus
- Geographic targeting (Kenya/Global)

## Customization

### Personal Information
Update the following in `SammyNathanPage.tsx`:
- Contact information (email, phone, location)
- Services offered
- Testimonials
- Achievement numbers
- Social media links

### Branding
- Logo and branding colors
- Professional headshots
- Company information
- Service descriptions

### Content
- Update service descriptions
- Add/remove services as needed
- Customize testimonials
- Update achievement metrics

## Development

### Local Development
```bash
# Start development server
npm run dev

# Visit the business portal
# http://localhost:5173/sammy-nathan
```

### Testing
- Test all contact forms
- Verify responsive design
- Check SEO structured data
- Test social sharing

## Deployment Checklist

- [ ] Update personal information and branding
- [ ] Test contact forms functionality
- [ ] Verify SEO structured data
- [ ] Set up domain/subdomain in Vercel
- [ ] Configure DNS records
- [ ] Test live deployment
- [ ] Submit to search engines for indexing

## Future Enhancements

- **CMS Integration**: Connect to a headless CMS for content management
- **Analytics**: Add Google Analytics or similar
- **Lead Generation**: Integrate with CRM systems
- **Blog Section**: Add blog/news functionality

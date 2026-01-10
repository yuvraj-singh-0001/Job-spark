# Social Media Sharing Setup Guide

This guide explains how to set up proper social media sharing for job detail pages.

## Problem
When sharing job links like `https://jobion.in/jobs/21` on social media platforms (Facebook, Twitter, LinkedIn, etc.), they show the home page meta tags instead of job-specific information because:
- Social media crawlers don't execute JavaScript
- They only see the initial HTML served by the server
- React Helmet meta tags are rendered client-side only

## Solution Implemented
Server-side meta tag injection that detects crawlers and serves HTML with proper meta tags.

## What Was Changed

### 1. Server-side Middleware (`server/server.js`)
- Added crawler detection function
- Added `/jobs/:id` route handler for crawlers
- Generates HTML with proper Open Graph and Twitter Card meta tags
- Includes JobPosting structured data (JSON-LD)

### 2. React Component (`client/src/modules/guest/jobs/job-list-details.jsx`)
- Enhanced Helmet meta tags with OG images
- Added Twitter Card meta tags
- Improved meta tag structure

## Nginx Configuration (Required for VPS)

If you're using Nginx as a reverse proxy (typical on Hostinger VPS), you need to configure it to proxy crawler requests to Express.

### Option 1: Proxy all `/jobs/*` requests to Express (Recommended)

Add this to your Nginx configuration:

```nginx
server {
    listen 80;
    server_name jobion.in www.jobion.in;
    
    # ... other configuration ...
    
    location /jobs/ {
        # Detect if request is from a crawler
        set $crawler 0;
        
        # Facebook
        if ($http_user_agent ~* "facebookexternalhit|Facebot") {
            set $crawler 1;
        }
        # Twitter
        if ($http_user_agent ~* "Twitterbot") {
            set $crawler 1;
        }
        # LinkedIn
        if ($http_user_agent ~* "LinkedInBot") {
            set $crawler 1;
        }
        # WhatsApp
        if ($http_user_agent ~* "WhatsApp") {
            set $crawler 1;
        }
        # Other common crawlers
        if ($http_user_agent ~* "bot|crawler|spider") {
            set $crawler 1;
        }
        
        # Proxy crawler requests to Express
        if ($crawler = 1) {
            proxy_pass http://localhost:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            break;
        }
        
        # For regular users, serve React app
        try_files $uri $uri/ /index.html;
    }
    
    # Serve React app for all other routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to Express
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Option 2: Always proxy `/jobs/*` to Express (Simpler)

If you want Express to handle all `/jobs/*` routes (crawlers and users):

```nginx
location /jobs/ {
    proxy_pass http://localhost:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Note: With Option 2, Express middleware will detect crawlers and serve HTML, while regular users get redirected to the React app.

## Environment Variables

Make sure these are set in your `.env` file:

```env
BASE_URL=https://jobion.in
API_URL=https://api.jobion.in  # or your API base URL
```

## Testing

After setup, test your job pages with:

1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
   - Enter: `https://jobion.in/jobs/21`
   - Click "Scrape Again" to refresh cache

2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
   - Enter: `https://jobion.in/jobs/21`

3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
   - Enter: `https://jobion.in/jobs/21`

4. **OpenGraph.xyz**: https://www.opengraph.xyz/
   - Enter: `https://jobion.in/jobs/21`

## Default OG Image

Make sure you have a default OG image at `/og-image.jpg` in your public folder. Recommended size: 1200x630 pixels.

If you don't have one, social media platforms will either show nothing or use a generic image.

## Troubleshooting

### Issue: Still showing home page meta tags
- **Solution**: Clear social media cache using their debugging tools
- Check Nginx configuration is correct
- Verify Express server is running and accessible
- Check logs: `tail -f /var/log/nginx/error.log`

### Issue: Images not showing in preview
- **Solution**: Ensure image URLs are absolute (start with `http://` or `https://`)
- Verify images are publicly accessible
- Check image size (should be at least 200x200px, recommended 1200x630px)

### Issue: Express middleware not being hit
- **Solution**: Check if Nginx is proxying correctly
- Test directly: `curl -A "facebookexternalhit/1.1" http://localhost:5000/jobs/21`
- Check Express logs for crawler detection

## Files Modified

1. `server/server.js` - Added crawler detection and meta tag injection
2. `client/src/modules/guest/jobs/job-list-details.jsx` - Enhanced meta tags

## Additional Notes

- The server caches meta tag HTML for 1 hour (`Cache-Control: public, max-age=3600`)
- Structured data (JSON-LD) is included for better SEO
- All text is properly escaped to prevent XSS attacks
- Fallback handling if job is not found or database query fails


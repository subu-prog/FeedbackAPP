# TechSambad Feedback Form

A beautiful, modern feedback form for the TechSambad newsletter that stores submissions on GitHub without requiring a database.

## Features

✨ **Modern Design**
- Dark theme with vibrant gradient accents
- Glassmorphism effects and smooth animations
- Fully responsive design for all devices
- Premium visual effects and micro-interactions

📝 **Comprehensive Feedback Collection**
- Name and email capture
- Feedback type categorization
- 5-star rating system
- Detailed message textarea with character counter
- Optional newsletter updates subscription

💾 **GitHub Integration**
- Stores feedback as GitHub Issues
- No database required
- Version controlled feedback
- Easy to review and manage

🎯 **User Experience**
- Auto-save drafts to localStorage
- Form validation with helpful feedback
- Success confirmation with smooth animations
- Mobile-friendly interface

## Setup Instructions

### Option 1: GitHub Issues (Recommended)

1. **Create a GitHub Personal Access Token**
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name like "TechSambad Feedback"
   - Select scope: `public_repo` (or `repo` if using a private repository)
   - Click "Generate token" and copy it

2. **Configure the Form**
   - Open `script.js`
   - Find the `submitToGitHub` function (around line 75)
   - Replace these values:
     ```javascript
     const GITHUB_TOKEN = 'your_token_here';
     const REPO_OWNER = 'your-github-username';
     const REPO_NAME = 'your-repo-name';
     ```

3. **Security Note**
   - ⚠️ **IMPORTANT**: Never commit your GitHub token to a public repository!
   - For production use, implement a backend API or use GitHub Actions
   - See "Production Deployment" section below

### Option 2: Alternative Services

If you prefer not to use GitHub Issues directly from the frontend, you can use:

#### **Formspree** (Easy, Free Tier Available)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Replace the form submission code with:
   ```javascript
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(formData)
   });
   ```

#### **EmailJS** (Send to Email)
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Set up an email service
3. Use their JavaScript SDK to send emails

#### **Netlify Forms** (If hosting on Netlify)
1. Add `netlify` attribute to the form
2. Netlify automatically handles form submissions

## Production Deployment

### Secure GitHub Integration

For production, use a serverless function to keep your token secure:

1. **Using Netlify Functions**
   ```javascript
   // netlify/functions/submit-feedback.js
   exports.handler = async (event) => {
       const data = JSON.parse(event.body);
       const response = await fetch('https://api.github.com/repos/...', {
           headers: { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }
       });
       return { statusCode: 200, body: JSON.stringify(response) };
   };
   ```

2. **Using Vercel Functions**
   ```javascript
   // api/submit-feedback.js
   export default async function handler(req, res) {
       // Similar implementation
   }
   ```

3. **Set environment variables** in your hosting platform's dashboard

### GitHub Pages Deployment

1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select your branch and root folder
4. Your site will be available at `https://username.github.io/repo-name`

## File Structure

```
Feedback/
├── index.html          # Main HTML structure
├── styles.css          # Comprehensive styling with design system
├── script.js           # Interactive functionality and GitHub integration
└── README.md          # This file
```

## Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-gradient-start: #667eea;
    --primary-gradient-end: #764ba2;
    /* ... more colors */
}
```

### Form Fields
Add or remove fields in `index.html` and update the submission logic in `script.js`

### Feedback Categories
Modify the `feedbackType` select options in `index.html`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Local Development

Simply open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Viewing Submitted Feedback

### GitHub Issues
- Go to your repository on GitHub
- Click on the "Issues" tab
- All feedback will appear as issues with labels

### localStorage (Backup)
- Open browser DevTools (F12)
- Go to Application → Local Storage
- Look for `techsambad_feedbacks` key

## License

Free to use and modify for your newsletter!

## Support

For questions or issues, please create an issue in the repository or contact the TechSambad team.

---

Made with ❤️ for TechSambad Newsletter

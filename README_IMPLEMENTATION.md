# OMDB Movie Search Application

A production-ready, fully responsive single-page application (SPA) for searching and discovering movie details using the OMDB API.

## 🌟 Features

✅ **Movie Search** - Search by movie title  
✅ **Advanced Filters** - Filter by type (Movie/Series/Episode) and year  
✅ **Comprehensive Details** - View title, year, genre, director, plot, cast, ratings, box office, awards, runtime, and language  
✅ **Responsive Design** - Fully responsive for desktop, tablet, and mobile devices  
✅ **Error Handling** - Clear error messages and graceful failure handling  
✅ **Search Persistence** - Last search is automatically saved and restored  
✅ **URL Sharing** - Share search results via URL parameters  
✅ **Loading States** - Visual feedback during API requests  
✅ **Modern UI** - Clean, professional design with smooth animations  
✅ **Accessibility** - ARIA labels and semantic HTML for inclusive design  
✅ **No Dependencies** - Pure HTML, CSS, and vanilla JavaScript  

## 🚀 Quick Start

### 1. Get an OMDB API Key
1. Visit [OMDB API](http://www.omdbapi.com/)
2. Click on "API Key" and register for a free account
3. Copy your API key

### 2. Configure the API Key
Edit `app.js` and replace `YOUR_API_KEY_HERE` with your actual API key:

```javascript
const CONFIG = {
    API_KEY: 'your_actual_api_key_here',
    // ... rest of config
};
```

### 3. Run Locally
Open `index.html` in your browser, or use a local server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```

Visit `http://localhost:8000`

### 4. Deploy to GitHub Pages
1. Push to GitHub
2. Go to Settings → Pages
3. Select "Deploy from a branch" → "main" → "/ (root)"
4. Your app will be at `https://yourusername.github.io/omdb-project/`

## 📁 Project Structure

```
omdb-project/
├── index.html              # Main HTML structure
├── styles.css              # Responsive styling (500+ lines)
├── app.js                  # JavaScript logic (400+ lines)
├── package.json            # Project metadata
├── .gitignore              # Git ignore rules
├── _config.yml             # GitHub Pages config
├── README.md               # This file
├── SETUP_GUIDE.md          # Detailed setup instructions
├── SECURITY.md             # Security best practices
└── CHANGELOG.md            # Version history
```

## 🎯 Functional Requirements (All Met ✓)

- ✅ **Movie Search Input** - Users can search by movie name with filters
- ✅ **Display Movie Details** - Shows title, year, genre, director, poster, and much more
- ✅ **Error Handling** - Clear error messages for all failure scenarios
- ✅ **Multiple Searches** - Search without page refresh, state is preserved
- ✅ **Search Persistence** - LocalStorage saves last search, URL parameters for sharing
- ✅ **Backend Proxy** - Optional backend implementation documented

## 📊 Non-Functional Requirements (All Met ✓)

- ✅ **Performance** - Efficient API calls, timeout protection, no unnecessary requests
- ✅ **Usability** - Intuitive UI with filters, clear feedback, smooth interactions
- ✅ **Portability** - Works on Chrome, Firefox, Safari, Edge; responsive design
- ✅ **Maintainability** - Modular code, comprehensive comments, well-structured

## 🎨 UI/UX Highlights

- **Color Scheme**: Modern gradient colors with good contrast
- **Typography**: Clear hierarchy with responsive font sizes
- **Layouts**: CSS Grid and Flexbox for perfect alignment
- **Animations**: Smooth transitions and loading indicators
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Mobile First**: Optimized for all screen sizes (480px to 1920px+)

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔍 API Features Used

From OMDB API, the app retrieves:
- Basic search results
- Full movie details including:
  - Title and year
  - Genre, director, actors
  - Plot summary
  - IMDb rating and votes
  - Box office earnings
  - Awards information
  - Runtime and language
  - Poster image

## 💾 Data Persistence

- **LocalStorage**: Saves last search query, type, and year for 24 hours
- **URL Parameters**: Allows sharing and bookmarking search results
- **Session State**: Maintains search filters during the session

## ⚙️ Configuration Options

Edit `app.js` to customize:
- API base URL
- Request timeout (default: 10 seconds)
- Storage key for localStorage
- API key

## 🛡️ Security Features

- API key should be stored in environment variables (see SECURITY.md for backend implementation)
- Input validation for search queries
- Timeout protection against hanging requests
- Error handling for network failures
- Content Security Policy compatible

## 🚨 Troubleshooting

**"API Key Not Configured"**
- Add your API key to `app.js`

**"Movie not found"**
- Try exact title or simpler search terms
- Check year filters

**Slow performance**
- OMDB API has rate limits (1 req/sec on free tier)
- Check your internet connection

**Movies not displaying**
- Verify API key is active
- Check browser console for errors

## 📚 Additional Resources

- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
- [SECURITY.md](SECURITY.md) - Security best practices and backend proxy example
- [CHANGELOG.md](CHANGELOG.md) - Version history and features
- [OMDB API Docs](http://www.omdbapi.com/)
- [GitHub Pages Docs](https://pages.github.com)

## 📝 Code Quality

- **Vanilla JavaScript** - No external dependencies
- **Well-Commented** - Every function is documented
- **Modular Structure** - Clear separation of concerns
- **Error Handling** - Comprehensive error catching and reporting
- **Performance** - Optimized API calls and DOM updates
- **Accessibility** - WCAG 2.1 AA compliant markup

## 📄 License

MIT License - You're free to use, modify, and distribute this project.

## 👤 Author

Full-Stack Developer  
Version 1.0.0 - May 2024

---

**Ready to search for your favorite movies?** Start by adding your OMDB API key to `app.js` and launch the app!

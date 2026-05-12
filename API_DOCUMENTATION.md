# API Integration Documentation

## Overview
This document describes how the OMDB Movie Search application integrates with the OMDB (Open Movie Database) API.

## API Endpoint Configuration

### Base URL
```
https://www.omdbapi.com/
```

### Authentication
All requests require an API key obtained from [OMDB API](http://www.omdbapi.com/apikey.aspx)

```javascript
// Configuration in app.js
const CONFIG = {
    API_KEY: 'YOUR_API_KEY_HERE',
    API_BASE_URL: 'https://www.omdbapi.com',
    TIMEOUT_MS: 10000,
};
```

## API Endpoints Used

### 1. Search Endpoint
**Purpose**: Get a list of movies matching the search query

**URL**: `https://www.omdbapi.com/?s={title}&apikey={key}`

**Parameters**:
- `s` (string, required): Movie title to search for
- `apikey` (string, required): Your OMDB API key
- `type` (string, optional): Type of result (`movie`, `series`, `episode`)
- `y` (number, optional): Year of release

**Example Request**:
```javascript
fetch('https://www.omdbapi.com/?s=inception&apikey=xxx&type=movie&y=2010')
```

**Example Response**:
```json
{
  "Search": [
    {
      "Title": "Inception",
      "Year": "2010",
      "imdbID": "tt1375666",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/..."
    }
  ],
  "totalResults": "1",
  "Response": "True"
}
```

### 2. Details Endpoint
**Purpose**: Get detailed information about a specific movie

**URL**: `https://www.omdbapi.com/?i={imdbID}&apikey={key}&plot=full`

**Parameters**:
- `i` (string, required): IMDb ID of the movie
- `apikey` (string, required): Your OMDB API key
- `plot` (string, optional): Full plot details (`short` or `full`)

**Example Request**:
```javascript
fetch('https://www.omdbapi.com/?i=tt1375666&apikey=xxx&plot=full')
```

**Example Response**:
```json
{
  "Title": "Inception",
  "Year": "2010",
  "Rated": "PG-13",
  "Released": "16 Jul 2010",
  "Runtime": "148 min",
  "Genre": "Action, Sci-Fi, Thriller",
  "Director": "Christopher Nolan",
  "Writer": "Christopher Nolan",
  "Actors": "Leonardo DiCaprio, Marion Cotillard, Ellen Page, Joseph Gordon-Levitt",
  "Plot": "A skilled thief who steals corporate secrets through dream-sharing technology...",
  "Language": "English",
  "Country": "USA, UK",
  "Awards": "Won 4 Oscars. Another 36 wins & 79 nominations.",
  "Poster": "https://m.media-amazon.com/images/M/...",
  "Ratings": [
    {
      "Source": "Internet Movie Database",
      "Value": "8.8/10"
    }
  ],
  "Metascore": "74",
  "imdbRating": "8.8",
  "imdbVotes": "2,586,504",
  "imdbID": "tt1375666",
  "Type": "movie",
  "DVD": "01 Dec 2010",
  "BoxOffice": "$292,587,330",
  "Production": "Warner Bros. Pictures",
  "Website": "N/A",
  "Response": "True"
}
```

## Data Fields Displayed

The application extracts and displays the following fields:

| Field | Source | Display | Optional |
|-------|--------|---------|----------|
| Title | `Title` | Movie title | No |
| Year | `Year` | Release year | No |
| Type | `Type` | movie/series/episode | No |
| Genre | `Genre` | Genre(s) | Yes |
| Director | `Director` | Director name(s) | Yes |
| Plot | `Plot` | Full plot description | Yes |
| Actors | `Actors` | Cast members | Yes |
| IMDb Rating | `imdbRating` | Rating badge + detail | Yes |
| Box Office | `BoxOffice` | Box office earnings | Yes |
| Awards | `Awards` | Awards info | Yes |
| Runtime | `Runtime` | Duration | Yes |
| Language | `Language` | Language(s) | Yes |
| Poster | `Poster` | Movie poster image | Yes |

## Error Responses

### API Error Response
```json
{
  "Response": "False",
  "Error": "Movie not found!"
}
```

### Rate Limit
The free tier of OMDB API has these limitations:
- 1 request per second
- 1,000 requests per day
- Limited data fields for some movies

## Implementation Flow

```
User Input
    ↓
Validation (min 2 characters)
    ↓
Show Loading Indicator
    ↓
Search API Call (s parameter)
    ↓
Parse Search Results
    ↓
Get First Result IMDb ID
    ↓
Details API Call (i parameter)
    ↓
Display Movie Details
    ↓
Update URL with parameters
    ↓
Save to LocalStorage
```

## Error Handling Strategy

```javascript
try {
  // API call with timeout
  const response = await fetch(url, { signal: controller.signal });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.Response === 'False') {
    // API returned error message
    showError(data.Error);
  } else {
    // Success - display data
    displayMovieDetails(data);
  }
} catch (error) {
  if (error.name === 'AbortError') {
    showError('Request timed out');
  } else if (error instanceof TypeError) {
    showError('Network error');
  } else {
    showError('Unexpected error');
  }
}
```

## Request Timeout

All API requests have a 10-second timeout:
```javascript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

const response = await fetch(url, { signal: controller.signal });
```

This prevents:
- Slow server responses hanging the UI
- Resource waste on failed connections
- Poor user experience from unresponsive app

## Performance Optimization

1. **Single API Call**: 
   - Search returns minimal data
   - Details API called only for the selected result
   - Not all search results are fetched

2. **LocalStorage Caching**:
   - Last search saved and restored
   - Reduces API calls on page reload

3. **URL Parameters**:
   - State reflected in URL
   - Enables bookmarking and sharing
   - No additional API call needed

## CORS Considerations

OMDB API has CORS enabled, so requests work directly from browsers.

## Pagination

The current implementation shows the first search result. To implement pagination:

```javascript
// Future enhancement
const params = new URLSearchParams({
  s: query,
  page: pageNumber, // 1-100
  apikey: CONFIG.API_KEY,
});
```

## Testing the API

### Manual Testing with curl
```bash
# Search request
curl "https://www.omdbapi.com/?s=inception&apikey=YOUR_KEY"

# Details request
curl "https://www.omdbapi.com/?i=tt1375666&plot=full&apikey=YOUR_KEY"
```

### Testing in Browser Console
```javascript
// Open DevTools and run:
fetch('https://www.omdbapi.com/?s=inception&apikey=YOUR_KEY')
  .then(r => r.json())
  .then(d => console.log(d))
```

## Rate Limiting Best Practices

1. **Debounce Input**: Limit search requests
2. **Cache Results**: Use LocalStorage
3. **Backend Proxy**: Hide API key and add server-side caching
4. **Request Deduplication**: Don't request the same movie twice

## Future Enhancements

1. **Pagination Support**: Display multiple search results
2. **Search Suggestions**: Show suggestions as user types
3. **History**: Keep search history
4. **Favorites**: Save favorite movies
5. **Backend Integration**: Node.js/Flask API wrapper
6. **Database Caching**: Cache popular searches
7. **Advanced Filters**: More filter options
8. **Related Movies**: Show similar movies

## API Key Best Practices

### ❌ Don't:
- Commit API keys to version control
- Expose keys in client-side code for production
- Use keys in public repositories

### ✅ Do:
- Store keys in environment variables
- Use backend proxy for API calls
- Rotate keys regularly
- Monitor usage and costs

## Resources

- [OMDB API Documentation](http://www.omdbapi.com/)
- [OMDB API Getting Started](http://www.omdbapi.com/Home)
- [API Key Registration](http://www.omdbapi.com/apikey.aspx)

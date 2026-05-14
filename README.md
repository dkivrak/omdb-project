# FindYourMovie - OMDb Movie Search App

FindYourMovie is a responsive single-page movie search application built with HTML, CSS, and JavaScript.  
It consumes the [OMDb API](https://www.omdbapi.com/) to search for movies, series, and episodes, then displays detailed information about the selected result.

## Live Demo

[View the deployed project on GitHub Pages](https://dkivrak.github.io/omdb-project/)

## Features

- Search movies, series, and episodes using the OMDb API
- Filter results by type and release year
- Display multiple search results as responsive cards
- View detailed information in a modal
- Display title, year, genre, director, poster, plot, actors, rating, runtime, country, and IMDb link
- Handle API errors and empty search results with user-friendly messages
- Perform multiple searches without refreshing the page
- Preserve the last search using URL parameters and local storage
- Responsive layout for desktop, tablet, and mobile screens
- Dark/light theme toggle
- Watchlist functionality using local storage
- Clear search and reset UI state

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- OMDb API
- GitHub Pages

## Project Structure

```txt
omdb-project/
├── index.html
├── styles.css
├── app.js
├── README.md
├── package.json
├── _config.yml
└── .gitignore
```

## How It Works
1.The user enters a movie, series, or episode name.
2.The application sends a request to the OMDb API.
3.Search results are displayed as cards.
4.Clicking a card fetches detailed information using the IMDb ID.
5.Details are shown inside a modal without refreshing the page.
6.The latest search state is saved so the page can restore the previous view after refresh.


## Main Requirements Covered

**Movie Search Input**

Users can search by title using the input field and search button.
The app also supports pressing Enter to search.

**Display Movie Details**

The app displays the required movie details:

- Title
- Year
- Genre
- Director
- Poster

Additional details are also shown if available.


## Error Handling

The app handles:
- Empty search input
- Movie not found responses
- API errors
- Network issues
- Timeout cases
- Missing poster images

 
## Multiple Searches

Users can perform multiple searches without refreshing the page.
The UI updates dynamically after each search.


## Search Persistence

The app preserves search state using:

- URL parameters
- Local storage

Refreshing the page restores the latest search view.


## Responsiveness

The layout is responsive and works across different screen sizes, including mobile, tablet, and desktop.


## Deployment

The project is deployed using GitHub Pages.

Deployment URL:

```bash
https://dkivrak.github.io/omdb-project/
```


## Running Locally

Clone the repository:

```bash
git clone https://github.com/dkivrak/omdb-project.git
```

Navigate into the project folder:

```bash
cd omdb-project
```

Start a local server:

```bash
python3 -m http.server 8000
```
Open the app in your browser:

```txt
http://localhost:8000
```


## API Usage

This project uses the OMDb API directly from the frontend.

Example OMDb search request:

```bash
https://www.omdbapi.com/?apikey=API_KEY&s=interstellar
```

Example OMDb detail request:

```bash
https://www.omdbapi.com/?apikey=API_KEY&i=tt0816692&plot=full
```


## Notes

This is a frontend only project.

The OMDb API key is used client-side for demonstration purposes. In a production environment, API keys should preferably be handled through a backend service or proxy.


## Author

Created by Devrim Kıvrak.

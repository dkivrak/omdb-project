/**
 * OMDB Movie Search Application
 * A fully responsive single-page application for searching and displaying movie details
 * API: Open Movie Database (OMDB)
 * Author: Devrim Kıvrak
 */

// ========================================
// CONFIGURATION
// ========================================

const CONFIG = {
    API_KEY: '305d086',
    API_BASE_URL: 'https://www.omdbapi.com',
    STORAGE_KEY: 'omdb_lastSearch',
    THEME_KEY: 'omdb_theme',
    TIMEOUT_MS: 10000,
    RESULTS_PER_PAGE: 10,
};

// ========================================
// DOM ELEMENTS
// ========================================

const elements = {
    // Search and filter
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    clearBtn: document.getElementById('clearBtn'),
    typeFilter: document.getElementById('typeFilter'),
    yearFilter: document.getElementById('yearFilter'),
    
    // Loading, error, welcome
    loadingIndicator: document.getElementById('loadingIndicator'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    welcomeMessage: document.getElementById('welcomeMessage'),
    
    // Search results
    searchResultsSection: document.getElementById('searchResults'),
    resultsGrid: document.getElementById('resultsGrid'),
    
    // Pagination
    paginationControls: document.getElementById('paginationControls'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    pageInfo: document.getElementById('pageInfo'),
    
    // Modal/Details
    movieModal: document.getElementById('movieModal'),
    modalClose: null, // Will be set after DOM is ready
    modalPosterImg: document.getElementById('modalPosterImg'),
    modalRatingBadge: document.getElementById('modalRatingBadge'),
    modalTitle: document.getElementById('modalTitle'),
    modalYear: document.getElementById('modalYear'),
    modalType: document.getElementById('modalType'),
    modalRated: document.getElementById('modalRated'),
    modalGenre: document.getElementById('modalGenre'),
    modalDirector: document.getElementById('modalDirector'),
    modalPlot: document.getElementById('modalPlot'),
    modalActors: document.getElementById('modalActors'),
    modalImdbRating: document.getElementById('modalImdbRating'),
    modalRuntime: document.getElementById('modalRuntime'),
    modalLanguage: document.getElementById('modalLanguage'),
    modalCountry: document.getElementById('modalCountry'),
    modalWriter: document.getElementById('modalWriter'),
    modalImdbLink: document.getElementById('modalImdbLink'),
    
    homeLogo: document.getElementById('homeLogo'),
    // Theme
    themeToggle: document.getElementById('themeToggle'),
};

// ========================================
// STATE MANAGEMENT
// ========================================

const state = {
    currentQuery: '',
    currentType: '',
    currentYear: '',
    currentPage: 1,
    totalResults: 0,
    searchResults: [],
    selectedImdbId: '',
    isLoading: false,
};

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    restoreTheme();
    checkApiKey();
    restoreFromUrl();
});

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    // Set modal close button after DOM is ready
    elements.modalClose = document.querySelector('.modal-close');
    
    // Search
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Clear
    elements.clearBtn.addEventListener('click', handleClear);
    
    // Filters
    const debouncedSearch = debounce(handleSearch, 500);
    elements.typeFilter.addEventListener('change', debouncedSearch);
    elements.yearFilter.addEventListener('change', debouncedSearch);
    
    // Pagination
    elements.prevBtn.addEventListener('click', handlePreviousPage);
    elements.nextBtn.addEventListener('click', handleNextPage);
    
    // Modal
    elements.modalClose.addEventListener('click', closeModal);
    elements.movieModal.addEventListener('click', (e) => {
        if (e.target === elements.movieModal) {
            closeModal();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.movieModal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    // Input clear on new input
    elements.searchInput.addEventListener('input', () => {
        hideError();
    });
    
    // Home logo
    elements.homeLogo.addEventListener('click', goHome);
    // Theme
    elements.themeToggle.addEventListener('click', toggleTheme);
}

/**
 * Check if API key is configured
 */
function checkApiKey() {
    if (CONFIG.API_KEY === 'YOUR_API_KEY_HERE') {
        showError('API Key Not Configured: Please add your OMDB API key to the app.js file. Get one at http://www.omdbapi.com/apikey.aspx');
        elements.searchBtn.disabled = true;
    }
}

// ========================================
// EVENT HANDLERS
// ========================================

/**
 * Handle search button click and filter changes
 */
async function handleSearch() {
    const query = elements.searchInput.value.trim();
    
    if (!query) {
        showError('Please enter a movie name to search');
        return;
    }

    if (query.length < 2) {
        showError('Search query must be at least 2 characters long');
        return;
    }

    // Update state
    state.currentQuery = query;
    state.currentType = elements.typeFilter.value;
    state.currentYear = elements.yearFilter.value;
    state.currentPage = 1;

    // Perform search
    await searchMovies(query, state.currentType, state.currentYear, 1);

    // Save to localStorage
    saveSearchState();
}

/**
 * Handle clear button click
 */
function handleClear() {
    elements.searchInput.value = '';
    elements.typeFilter.value = '';
    elements.yearFilter.value = '';
    
    state.currentQuery = '';
    state.currentType = '';
    state.currentYear = '';
    state.currentPage = 1;
    state.totalResults = 0;
    state.searchResults = [];
    state.selectedImdbId = '';
    
    hideError();
    hideSearchResults();
    hidePagination();
    closeModal();
    showWelcomeMessage();
    
    // Clear URL
    window.history.replaceState(null, '', window.location.pathname);
    
    // Clear localStorage
    localStorage.removeItem(CONFIG.STORAGE_KEY);
}

// Handle home logo click - reset everything
function goHome() {
    elements.searchInput.value = '';
    elements.typeFilter.value = '';
    elements.yearFilter.value = '';

    state.currentQuery = '';
    state.currentType = '';
    state.currentYear = '';
    state.currentPage = 1;
    state.totalResults = 0;
    state.searchResults = [];
    state.selectedImdbId = '';

    hideError();
    hideSearchResults();
    hidePagination();
    closeModal();
    showWelcomeMessage();

    window.history.replaceState(null, '', window.location.pathname);
    localStorage.removeItem(CONFIG.STORAGE_KEY);

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Handle previous page button
 */
async function handlePreviousPage() {
    if (state.currentPage > 1) {
        state.currentPage--;
        await searchMovies(state.currentQuery, state.currentType, state.currentYear, state.currentPage);
        scrollToResults();
    }
}

/**
 * Handle next page button
 */
async function handleNextPage() {
    const totalPages = Math.ceil(state.totalResults / CONFIG.RESULTS_PER_PAGE);
    if (state.currentPage < totalPages) {
        state.currentPage++;
        await searchMovies(state.currentQuery, state.currentType, state.currentYear, state.currentPage);
        scrollToResults();
    }
}

/**
 * Scroll to search results section
 */
function scrollToResults() {
    elements.searchResultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========================================
// SEARCH & API CALLS
// ========================================

/**
 * Search for movies using OMDB API
 * @param {string} query - Search query
 * @param {string} type - Filter by type (movie, series, episode)
 * @param {string} year - Filter by year
 * @param {number} page - Page number
 */
async function searchMovies(query, type = '', year = '', page = 1) {
    if (state.isLoading) return;

    state.isLoading = true;
    showLoading(true);
    hideError();
    hideSearchResults();
    hidePagination();

    try {
        const params = new URLSearchParams();
        params.append('apikey', CONFIG.API_KEY);
        params.append('s', query);
        params.append('type', type || '');
        params.append('y', year || '');
        params.append('page', page);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

        const response = await fetch(
            `${CONFIG.API_BASE_URL}/?${params}`,
            { signal: controller.signal }
        );

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === 'False') {
            showError('Search failed. Try a different search.');
            hideWelcomeMessage();
            return;
        }

        if (!data.Search || !Array.isArray(data.Search)) {
            showError('No results found. Please try another search.');
            return;
        }

        // Update state with results
        state.searchResults = data.Search;
        state.totalResults = parseInt(data.totalResults, 10) || 0;

        // Display results
        displaySearchResults(state.searchResults);
        updatePagination();
        updateUrl();
        hideWelcomeMessage();

    } catch (error) {
        if (error.name === 'AbortError') {
            showError('⏱️ Request timed out. Please try again.');
        } else if (error instanceof TypeError) {
            showError('🌐 Network error. Please check your connection.');
        } else {
            showError(`❌ Error: ${error.message || 'An unexpected error occurred.'}`);
        }
        console.error('Search error:', error);
    } finally {
        state.isLoading = false;
        showLoading(false);
    }
}

/**
 * Fetch detailed information about a specific movie
 * @param {string} imdbId - IMDb ID
 */
async function fetchMovieDetails(imdbId) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

        const response = await fetch(
            `${CONFIG.API_BASE_URL}/?apikey=${CONFIG.API_KEY}&i=${imdbId}&plot=full`,
            { signal: controller.signal }
        );

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.Response === 'False') {
            showError('Failed to load movie details. Please try again.');
            return;
        }

        displayMovieDetailsModal(data);
        state.selectedImdbId = imdbId;
        updateUrl();

    } catch (error) {
        if (error.name === 'AbortError') {
            showError('⏱️ Request timed out. Please try again.');
        } else {
            showError(`❌ Error loading details: ${error.message}`);
        }
        console.error('Details fetch error:', error);
    }
}

// ========================================
// DISPLAY FUNCTIONS
// ========================================

/**
 * Display search results as a grid of cards
 * @param {Array} results - Array of movie results
 */
function displaySearchResults(results) {
    elements.resultsGrid.innerHTML = '';

    results.forEach((movie) => {
        const card = createResultCard(movie);
        elements.resultsGrid.appendChild(card);
    });

    elements.searchResultsSection.classList.remove('hidden');
}

/**
 * Create a single result card element
 * @param {Object} movie - Movie data
 * @returns {HTMLElement} Card element
 */
function createResultCard(movie) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    const posterSrc = movie.Poster && movie.Poster !== 'N/A' 
        ? movie.Poster 
        : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="225"%3E%3Crect fill="%23333" width="150" height="225"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="12" fill="%23999"%3ENo Poster%3C/text%3E%3C/svg%3E';

    card.innerHTML = `
        <div class="result-card-poster">
            <img src="${posterSrc}" alt="${movie.Title}" class="result-card-img" loading="lazy">
        </div>
        <div class="result-card-content">
            <h3 class="result-card-title">${movie.Title}</h3>
            <div class="result-card-meta">
                <span class="result-card-year">${movie.Year}</span>
                <span class="result-card-type">${capitalizeFirst(movie.Type)}</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => {
        openMovieDetails(movie.imdbID);
    });

    return card;
}

/**
 * Display movie details in the modal
 * @param {Object} movie - Movie data object
 */
function displayMovieDetailsModal(movie) {
    // Validate poster
    const validPoster = movie.Poster && movie.Poster !== 'N/A' 
        ? movie.Poster 
        : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%23333" width="200" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14" fill="%23999"%3ENo Poster Available%3C/text%3E%3C/svg%3E';

    elements.modalPosterImg.src = validPoster;
    elements.modalPosterImg.alt = `${movie.Title} poster`;

    elements.modalTitle.textContent = movie.Title || 'N/A';
    elements.modalYear.textContent = movie.Year || 'N/A';
    elements.modalType.textContent = capitalizeFirst(movie.Type) || 'N/A';
    elements.modalRated.textContent = movie.Rated || 'N/A';

    elements.modalGenre.textContent = movie.Genre || 'N/A';
    elements.modalDirector.textContent = movie.Director || 'N/A';
    elements.modalPlot.textContent = movie.Plot || 'No plot information available.';
    elements.modalActors.textContent = movie.Actors || 'N/A';
    elements.modalRuntime.textContent = movie.Runtime || 'N/A';
    elements.modalLanguage.textContent = movie.Language || 'N/A';
    elements.modalCountry.textContent = movie.Country || 'N/A';
    elements.modalWriter.textContent = movie.Writer || 'N/A';

    // Rating with color coding
    const rating = parseFloat(movie.imdbRating);
    elements.modalImdbRating.textContent = movie.imdbRating !== 'N/A' ? `${movie.imdbRating}/10` : 'N/A';
    
    if (movie.imdbRating !== 'N/A') {
        if (rating >= 8) {
            elements.modalImdbRating.style.color = '#06a77d';
        } else if (rating >= 6) {
            elements.modalImdbRating.style.color = '#f4a460';
        } else {
            elements.modalImdbRating.style.color = '#d63230';
        }
    } else {
        elements.modalImdbRating.style.color = 'inherit';
    }

    // IMDb link
    elements.modalRatingBadge.textContent = movie.imdbRating !== 'N/A' ? movie.imdbRating : '—';
    elements.modalImdbLink.href = `https://www.imdb.com/title/${movie.imdbID}/`;

    openModal();
}

/**
 * Open movie details modal
 */
function openMovieDetails(imdbId) {
    state.selectedImdbId = imdbId;
    fetchMovieDetails(imdbId);
}

/**
 * Open modal dialog
 */
function openModal() {
    elements.movieModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * Close modal dialog
 */
function closeModal() {
    elements.movieModal.classList.add('hidden');
    document.body.style.overflow = '';
    state.selectedImdbId = '';
    updateUrl();
}

/**
 * Show search results section
 */
function showSearchResults() {
    elements.searchResultsSection.classList.remove('hidden');
}

/**
 * Hide search results section
 */
function hideSearchResults() {
    elements.searchResultsSection.classList.add('hidden');
}

/**
 * Show pagination controls
 */
function showPagination() {
    elements.paginationControls.classList.remove('hidden');
}

/**
 * Hide pagination controls
 */
function hidePagination() {
    elements.paginationControls.classList.add('hidden');
}

/**
 * Update pagination controls
 */
function updatePagination() {
    const totalPages = Math.ceil(state.totalResults / CONFIG.RESULTS_PER_PAGE);

    elements.pageInfo.textContent = `Page ${state.currentPage} of ${totalPages}`;

    elements.prevBtn.disabled = state.currentPage === 1;
    elements.nextBtn.disabled = state.currentPage === totalPages;

    showPagination();
}

/**
 * Show loading indicator
 * @param {boolean} show - Whether to show
 */
function showLoading(show) {
    if (show) {
        elements.loadingIndicator.classList.add('show');
    } else {
        elements.loadingIndicator.classList.remove('show');
    }
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.classList.remove('hidden');
}

/**
 * Hide error message
 */
function hideError() {
    elements.errorMessage.classList.add('hidden');
}

/**
 * Show welcome message
 */
function showWelcomeMessage() {
    elements.welcomeMessage.classList.remove('hidden');
}

/**
 * Hide welcome message
 */
function hideWelcomeMessage() {
    elements.welcomeMessage.classList.add('hidden');
}

// ========================================
// URL & PERSISTENCE
// ========================================

/**
 * Update URL with current search parameters
 */
function updateUrl() {
    const params = new URLSearchParams();
    
    if (state.currentQuery) params.append('q', state.currentQuery);
    if (state.currentType) params.append('type', state.currentType);
    if (state.currentYear) params.append('year', state.currentYear);
    if (state.currentPage > 1) params.append('page', state.currentPage);
    if (state.selectedImdbId) params.append('id', state.selectedImdbId);

    const newUrl = params.toString() 
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
    
    window.history.replaceState(null, '', newUrl);
}

/**
 * Restore state from URL parameters
 */
function restoreFromUrl() {
    const params = new URLSearchParams(window.location.search);
    
    const query = params.get('q');
    const type = params.get('type');
    const year = params.get('year');
    const page = parseInt(params.get('page'), 10) || 1;
    const id = params.get('id');

    if (query) {
        elements.searchInput.value = query;
        if (type) elements.typeFilter.value = type;
        if (year) elements.yearFilter.value = year;
        
        state.currentQuery = query;
        state.currentType = type || '';
        state.currentYear = year || '';
        state.currentPage = page;

        // Perform search
        searchMovies(query, type, year, page).then(() => {
            if (id) {
                // Open specific movie details if id is provided
                state.selectedImdbId = id;
                fetchMovieDetails(id);
            }
        });
    }
}

/**
 * Save search state to localStorage
 */
function saveSearchState() {
    const searchState = {
        query: state.currentQuery,
        type: state.currentType,
        year: state.currentYear,
        timestamp: new Date().getTime(),
    };
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(searchState));
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Capitalize the first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Debounce function to limit API calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// ERROR HANDLING
// ========================================

/**
 * Global error handler for uncaught errors
 */
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    showError('An unexpected error occurred. Please try again.');
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
    showError('An unexpected error occurred. Please try again.');
});


// ========================================
// THEME SYSTEM
// ========================================

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');

    const isDark = body.classList.contains('dark-theme');

    elements.themeToggle.textContent = isDark ? '☀️' : '🌙';

    localStorage.setItem(
        CONFIG.THEME_KEY,
        isDark ? 'dark' : 'light'
    );
}

function restoreTheme() {
    const savedTheme = localStorage.getItem(CONFIG.THEME_KEY);

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        elements.themeToggle.textContent = '☀️';
    } else {
        elements.themeToggle.textContent = '🌙';
    }
}
# Fast Food Review

## Overview

Fast Food Review is a mobile-friendly hybrid app built with web technologies and packaged for Cordova/Monaca. The app lets users submit restaurant reviews with ratings, waiting time, and GPS location. Reviews are stored through a PHP/MySQL backend and displayed in a responsive table.

## How it works

- The frontend lives in `www/index.html` and uses Bootstrap for layout and UI.
- `www/components/js/main.js` loads the Google Maps JavaScript API and initializes an interactive map.
- Users can place or drag a map pin to capture latitude and longitude for each review.
- When the form is submitted, the frontend sends the review data to `saveReview.php` on the configured backend.
- The review list is fetched from `getReviews.php` and rendered into the table.
- Reviews can be deleted by sending the review `id` to `deleteReview.php`.

## Technology stack

- Frontend: HTML, CSS, JavaScript
- UI: Bootstrap 5
- Maps: Google Maps JavaScript API
- Packaging: Cordova / Monaca hybrid app
- Backend: PHP
- Database: MySQL or MariaDB

## Project structure

- `config.xml` - Cordova/Monaca app configuration
- `www/index.html` - main app page
- `www/components/js/config.js` - runtime configuration for server URL and Google Maps API key
- `www/components/js/main.js` - app logic, map handling, form submission, AJAX calls

## Backend requirements

This repository does not include the PHP backend files. The frontend expects a running PHP server that exposes these endpoints:

- `saveReview.php` — saves new reviews from POST data
- `getReviews.php` — returns review records as JSON
- `deleteReview.php` — deletes a review by POST `id`

### Example database setup

Use MySQL or MariaDB and create a database table like this:

```sql
CREATE DATABASE fast_food_review; -- or use your own database name
USE fast_food_review;

CREATE TABLE reviews (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  restaurantName VARCHAR(255) NOT NULL,
  dateReview DATE NOT NULL,
  starRating TINYINT UNSIGNED NOT NULL,
  waitingTime VARCHAR(64) NOT NULL,
  reviewDesc TEXT NOT NULL,
  userLatitude DECIMAL(10,6) NOT NULL,
  userLongitude DECIMAL(10,6) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

### PHP backend notes

Your PHP scripts should:

- connect to the MySQL database
- sanitize POST input
- return JSON responses
- set the response header: `Content-Type: application/json`

Expected response examples:

- success: `{"status": "success"}`
- error: `{"status": "error", "message": "..."}`

## Configuration

Update `www/components/js/config.js` with your backend URL and Google Maps API key:

```js
window.APP_CONFIG = {
  SERVER_URL: "https://your-server.com/fastfood/",
  GOOGLE_MAP_API: "YOUR_GOOGLE_MAPS_API_KEY"
};
```

Make sure the `SERVER_URL` ends with a slash and points to the folder containing the PHP scripts.

## Initial setup

1. Install Node.js and npm.
2. Install dependencies if needed:
   ```bash
   npm install
   ```
3. Run a local preview server from the project root:
   ```bash
   npm run dev
   ```
4. Ensure your PHP backend is hosted and reachable from the app.
5. Build the Cordova/Monaca app for Android/iOS if required.

## Notes

- The current project does not include the PHP backend code, so you must create or deploy the PHP endpoints separately.
- If you are using this as a local app, ensure CORS and Content Security Policy settings allow requests to your backend.
- The map uses Google Maps API, so a valid API key is required.



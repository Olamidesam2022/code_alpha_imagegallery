# CodeAlpha_Image_Gallery

Image gallery built for the CodeAlpha frontend development internship (Task 1).

Built with plain HTML, CSS and JavaScript. No frameworks or libraries.

## Features

- Responsive masonry layout that moves from three columns to two to one
- Lightbox viewer with previous and next buttons, a counter and captions
- Keyboard navigation: arrow keys, Home, End and Escape
- Swipe left or right on touch screens
- Hover effects: image zoom and a sliding caption
- Smooth transitions when opening the viewer and when changing images
- Bonus: filter by collection (Landscapes, Cities, Abstract), and the lightbox follows the active filter
- Neighbouring images are preloaded so navigation feels instant
- Accessible: real links and buttons, alt text on every image, focus styles and screen reader status messages
- Works without JavaScript: each image is a link to its full size version

## Files

- `index.html` page structure and the list of images
- `styles.css` layout, hover effects and lightbox styling
- `script.js` filtering and the lightbox
- `images/thumbs` small versions shown in the grid
- `images/full` large versions shown in the lightbox

## Use your own photos

1. Put a large version in `images/full` and a smaller one (about 640px wide) in `images/thumbs`.
2. Copy one `<li>` block in `index.html` and update `href`, `src`, `alt`, `data-title`, the caption text, and `data-category`.
3. To add a new collection, add a `data-category` value and a matching filter button.

## Run locally

Open `index.html` in a browser.

## Deploy

Push to GitHub, then turn on GitHub Pages under Settings, Pages, and pick the `main` branch.
# code_alpha_imagegallery

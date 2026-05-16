<<<<<<< HEAD
# SIBAT - Bilingual Statistics Dictionary

## Project Overview

**SIBAT** (A Bilingual Statistics Dictionary for Students) is an interactive web-based dictionary designed to help students learn and understand statistical and data science terms in both **English and Filipino**. The website provides simple definitions, examples, and an easy-to-navigate interface for exploring various statistical concepts.

## Features

- 📚 Comprehensive dictionary of statistical and data science terms
- 🌐 Bilingual support (English & Filipino)
- 🔍 Filter terms by category
- 📱 Responsive web design
- ✨ Interactive user interface

## Project Structure

```
Dictionary Website/
├── index.html              # Main home page
├── README.md               # Project documentation (this file)
├── css/
│   └── style.css          # All styling for the website
├── html/
│   ├── about.html         # About page
│   ├── details.html       # Term details page
│   └── dictionary.html    # Dictionary page with search and filter
├── images/
│   └── icons/             # Icon assets
├── js/
│   ├── details.js         # JavaScript for details page
│   └── script.js          # Main JavaScript functionality
└── json/
    └── terms.json         # Database of all statistical terms
```

## Important: Directory Structure Caution

⚠️ **DO NOT CHANGE OR MOVE the directory structure without updating file references.** The HTML files contain hardcoded file paths for linking stylesheets, scripts, and navigation. Changing directory locations or filenames will break the application.

### Current File Path References

The following paths are used throughout the project and **must remain consistent**:

- `/css/style.css` - Stylesheet reference in HTML files
- `/js/script.js` - Main script reference in index.html
- `/images/logo.png` - Logo reference in navigation
- `/images/home-image.png` - Home page image reference
- `/html/dictionary.html` - Dictionary page link
- `/html/about.html` - About page link
- `/html/details.html` - Details page link
- `/json/terms.json` - Terms data reference in JavaScript

### If You Need to Reorganize Files

If you must change the directory structure, you will need to:

1. Update all file paths in HTML files (`index.html`, `html/about.html`, `html/dictionary.html`, `html/details.html`)
2. Update all import statements in JavaScript files (`js/script.js`, `js/details.js`)
3. Update all CSS and image references
4. Test all links and resources to ensure they load correctly

## Getting Started

1. Open `index.html` in a web browser to start using the dictionary
2. Click on "Dictionary" to browse all available terms
3. Use the filter dropdown to view terms by category
4. Click on any term to see its full definition and example

## Files Overview

| File | Purpose |
|------|---------|
| `index.html` | Landing page with project introduction |
| `html/dictionary.html` | Main dictionary with browsing and filtering functionality |
| `html/about.html` | Information about the project |
| `html/details.html` | Detailed view of individual dictionary terms |
| `css/style.css` | All styling and responsive design |
| `js/script.js` | Core JavaScript functionality for the website |
| `js/details.js` | JavaScript for the details page |
| `json/terms.json` | Complete database of statistical terms with definitions |

## Term Categories

The dictionary includes terms organized in categories such as:

- Statistics
- Data Science
- Probability
- Sampling
- Research
- Survey Design
- And more...

## Notes

- All terms are provided with both English and Filipino translations
- Each term includes a definition and practical example
- The website is fully responsive and works on desktop and mobile devices
- All styling is centralized in `style.css` for easy maintenance

## Adding New Terms

### ⚠️ Important: terms.json Format Caution

The `json/terms.json` file contains all dictionary terms and is critical to the application. When adding new terms, you **must** follow the exact JSON format and structure, otherwise the website will break and terms won't display properly.

### Term Structure & Fields

Each term object in the JSON file must follow this format:

```json
{
  "id": 123,
  "english": "Term Name",
  "category": "Category Name",
  "definition": "English definition here.",
  "filipino": "or Filipino Translation",
  "example": "Example showing how the term is used."
}
```

### Field Descriptions

| Field | Type | Required? | Description |
|-------|------|-----------|-------------|
| `id` | Number | ✅ Yes | Unique identifier for each term (must be different from all other terms) |
| `english` | String | ✅ Yes | English name of the term |
| `category` | String | ✅ Yes | Category classification (e.g., "Statistics", "Data Science", "Sampling", etc.) |
| `definition` | String | ✅ Yes | Definition of the term (in Filipino as shown in existing terms) |
| `filipino` | String | ❌ Optional | Filipino translation, typically formatted as "or Filipino Term" |
| `example` | String | ❌ Optional | A practical example showing how the term is used |

### How to Add a New Term

1. Open `json/terms.json` in a text editor
2. Find the location where you want to add your term (terms don't need to be in order)
3. Add a new term object **before the closing bracket** and **after the last term**
4. Add a comma after the previous term if adding to the middle of the list
5. Follow the format exactly as shown above

### Example: Adding a New Term

```json
{
  "id": 100,
  "english": "Sample Size",
  "category": "Sampling",
  "definition": "Ang bilang ng mga respondents o observations na kinukunin sa isang pag-aaral.",
  "filipino": "or Laki ng Sample",
  "example": "Kung ang survey ay may 500 respondents, ang sample size ay 500."
}
```

### Important Rules When Editing terms.json

⚠️ **Do NOT forget:**
- Each `id` must be **unique** - no duplicate IDs
- **All commas must be correct** - missing or extra commas will break the JSON
- Use **quotation marks** around all text values
- The last term in the array should **NOT have a comma** after it
- The entire file must be valid JSON or the website won't load terms

### Valid JSON Check

After editing `terms.json`, you can validate the JSON by:
1. Opening the file in VS Code and checking for syntax errors
2. Using an online JSON validator like [jsonlint.com](https://www.jsonlint.com/)
3. Testing the website - if terms don't appear, there's likely a JSON formatting error

## Browser Compatibility

This website works best in modern browsers (Chrome, Firefox, Safari, Edge) with JavaScript enabled.
=======
# SIBAT
>>>>>>> 8c306fd6176d4b97221529c6893e2c760b127cd5

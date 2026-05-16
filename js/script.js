const container = document.getElementById("dictionary-container");
const filterSelect = document.getElementById("filter");
const searchInput = document.querySelector(".search");
const paginationContainer = document.getElementById("pagination-container");

let allTerms = [];
let currentPage = 1;
const itemsPerPage = 8;
let filteredTerms = [];

// Flatten nested terms into a single array
function flattenTerms(data) {
  let flattened = [];
  
  data.forEach(term => {
    // Add the main term
    flattened.push(term);
    
    // If the term has details (nested items), add them as well
    if (term.details && Array.isArray(term.details)) {
      term.details.forEach(detail => {
        // For items with types (like Quota Sampling), also add the types
        if (detail.types && Array.isArray(detail.types)) {
          flattened.push(detail);
          detail.types.forEach(type => {
            flattened.push(type);
          });
        } else {
          flattened.push(detail);
        }
      });
    }
  });
  
  return flattened;
}

function populateCategoryOptions(terms) {
  const categories = new Set();
  terms.forEach(term => {
    if (term.category) {
      categories.add(term.category);
    }
  });

  if (!filterSelect) return;

  filterSelect.innerHTML = '<option value="All">All</option>';
  categories.forEach(category => {
    filterSelect.innerHTML += `<option value="${category}">${category}</option>`;
  });
}

function displayTerms(terms, page = 1) {
  filteredTerms = terms.slice().sort((a, b) => {
    const textA = a.english ? a.english.toLowerCase() : "";
    const textB = b.english ? b.english.toLowerCase() : "";
    return textA.localeCompare(textB);
  });
  currentPage = page;
  
  container.innerHTML = "";
  
  if (filteredTerms.length === 0) {
    container.innerHTML = "<p>No terms found.</p>";
    paginationContainer.innerHTML = "";
    return;
  }

  // Calculate pagination
  const totalPages = Math.ceil(terms.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTerms = terms.slice(startIndex, endIndex);

  // Display terms
  paginatedTerms.forEach(term => {
    container.innerHTML += `
      <a class="card" href="details.html?id=${term.id}">
        <h2>${term.english}</h2>
        <p>${term.filipino || ""}</p>
      </a>
    `;
  });

  // Display pagination controls
  displayPagination(totalPages, page);
}

function displayPagination(totalPages, currentPageNum) {
  paginationContainer.innerHTML = "";
  
  if (totalPages <= 1) return;

  let paginationHTML = `<div class="pagination">`;

  // Previous button
  if (currentPageNum > 1) {
    paginationHTML += `<button onclick="goToPage(${currentPageNum - 1})">Previous</button>`;
  } else {
    paginationHTML += `<button disabled>Previous</button>`;
  }

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPageNum) {
      paginationHTML += `<button class="active" disabled>${i}</button>`;
    } else if (i <= currentPageNum + 2 && i >= currentPageNum - 2) {
      paginationHTML += `<button onclick="goToPage(${i})">${i}</button>`;
    } else if (i === currentPageNum + 3 || i === currentPageNum - 3) {
      paginationHTML += `<button disabled>...</button>`;
    }
  }

  // Next button
  if (currentPageNum < totalPages) {
    paginationHTML += `<button onclick="goToPage(${currentPageNum + 1})">Next</button>`;
  } else {
    paginationHTML += `<button disabled>Next</button>`;
  }

  paginationHTML += `</div>`;
  paginationContainer.innerHTML = paginationHTML;
}

function goToPage(page) {
  displayTerms(filteredTerms, page);
  container.scrollIntoView({ behavior: 'smooth' });
}

function filterAndSearch() {
  const selectedCategory = filterSelect.value;
  const searchTerm = searchInput.value.toLowerCase();

  let filtered = allTerms;

  // Filter by category
  if (selectedCategory !== "All") {
    filtered = filtered.filter(term => term.category === selectedCategory);
  }

  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(term => 
      term.english.toLowerCase().includes(searchTerm) ||
      (term.filipino && term.filipino.toLowerCase().includes(searchTerm))
    );
  }

  displayTerms(filtered, 1);
}

fetch("../json/terms.json")
  .then(res => {
    console.log("Response received:", res);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    console.log("Data loaded:", data);
    allTerms = flattenTerms(data);
    console.log("Flattened terms:", allTerms);
    populateCategoryOptions(allTerms);
    displayTerms(allTerms);
  })
  .catch(error => {
    console.error("Error loading terms:", error);
    container.innerHTML = "<p>Error loading dictionary: " + error.message + "</p>";
  });

// Add event listeners
if (filterSelect) {
  filterSelect.addEventListener("change", filterAndSearch);
}

if (searchInput) {
  searchInput.addEventListener("input", filterAndSearch);
}

// Scroll reveal effect
const elements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
    else {
      entry.target.classList.remove('visible');
    }
  });
}, {
  threshold: 0.1
});

elements.forEach(el => observer.observe(el));


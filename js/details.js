const container = document.getElementById("details-container");

// get id from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// Flatten nested terms into a single array for searching
function flattenTermsForSearch(data) {
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

fetch("../json/terms.json")
  .then(res => {
    console.log("Details page - Response received:", res);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    console.log("Details page - Data loaded:", data);
    const flattenedData = flattenTermsForSearch(data);
    console.log("Details page - Flattened data:", flattenedData);
    const term = flattenedData.find(t => t.id == id);
    console.log("Looking for term with id:", id);
    console.log("Found term:", term);

    if (!term) {
      container.innerHTML = "<p>Term not found</p>";
      return;
    }

    let html = `
      <div class="category">${term.category}</div>

      <h1>${term.english}</h1>
      ${term.filipino ? `<p id="filipino" class="filipino">${term.filipino}</p>` : ''}

      <hr>

      ${term.definition ? `<section>
        <h3>Ano ang kahulugan ng <span class="english">${term.english}</span>?</h3>
        <p>${term.definition}</p>
      </section>` : ''}
    `;

    // Add details section if the term has nested items
    if (term.details && Array.isArray(term.details)) {
      html += `<section><h3>Mga Detalye / Details:</h3><ol>`;
      term.details.forEach(detail => {
        // Check if this detail has types (like Quota Sampling)
        if (detail.types && Array.isArray(detail.types)) {
          html += `<li>
            <strong>${detail.english}</strong>
            ${detail.filipino ? `<br><em>${detail.filipino}</em>` : ''}
            ${detail.definition ? `<br>${detail.definition}` : ''}
            ${detail.example ? `<br><strong>Halimbawa:</strong> ${detail.example}` : ''}`;
          html += `<ol>`;
          detail.types.forEach(type => {
            html += `<li>
              <strong>${type.english}</strong>
              ${type.filipino ? `<br><em>${type.filipino}</em>` : ''}
              ${type.definition ? `<br>${type.definition}` : ''}
              ${type.example ? `<br><strong>Halimbawa:</strong> ${type.example}` : ''}
            </li>`;
          });
          html += `</ol></li>`;
        } else {
          html += `<li>
            <strong>${detail.english}</strong>
            ${detail.filipino ? `<br><em>${detail.filipino}</em>` : ''}
            ${detail.definition ? `<br>${detail.definition}` : ''}
            ${detail.example ? `<br><strong>Halimbawa:</strong> ${detail.example}` : ''}
          </li>`;
        }
      });
      html += `</ol></section>`;
    }

    // Add types section if the term has types (like Quota Sampling)
    if (term.types && Array.isArray(term.types)) {
      html += `<section><h3>Mga Uri / Types:</h3><ol>`;
      term.types.forEach(type => {
        html += `<li>
          <strong>${type.english}</strong>
          ${type.filipino ? `<br><em>${type.filipino}</em>` : ''}
          ${type.definition ? `<br>${type.definition}` : ''}
          ${type.example ? `<br><strong>Halimbawa:</strong> ${type.example}` : ''}
        </li>`;
      });
      html += `</ol></section>`;
    }

    // Add optional fields if they exist
    if (term.formula) {
      html += `<section>
        <h3>Formula</h3>
        <p><code>${term.formula}</code></p>
      </section>`;
    }

    if (term.example && !term.details && !term.types) {
      html += `<section>
        <h3>Halimbawa</h3>
        <p>${term.example}</p>
      </section>`;
    }

    if (term.image) {
      html += `<section>
        <h3>Sample Image</h3>
        <img src="${term.image}" alt="${term.english}" style="max-width: 100%; height: auto;">
      </section>`;
    }

    if (term.problem) {
      html += `<section>
        <h3>Problem</h3>
        <p>${term.problem}</p>
      </section>`;
    }

    if (term.given) {
      let givenHtml = '<section><h3>Given</h3>';
      if (typeof term.given === 'object') {
        givenHtml += '<ul>';
        for (let key in term.given) {
          givenHtml += `<li><strong>${key}:</strong> ${term.given[key]}</li>`;
        }
        givenHtml += '</ul>';
      } else {
        givenHtml += `<p>${term.given}</p>`;
      }
      givenHtml += '</section>';
      html += givenHtml;
    }

    if (term.sampleProblem) {
      html += `<section><h3>Sample Problem</h3>`;
      if (term.sampleProblem['general-question']) {
        html += `<p><strong>General Question:</strong> ${term.sampleProblem['general-question']}</p>`;
      }
      if (term.sampleProblem.question) {
        html += `<p><strong>Question:</strong> ${term.sampleProblem.question}</p>`;
      }
      if (term.sampleProblem.solution) {
        html += `<ol>`;
        term.sampleProblem.solution.forEach(step => {
          html += `<li>${step}</li>`;
        });
        html += `</ol>`;
      }
      if (term.sampleProblem.answer) {
        html += `<p><strong>Answer:</strong> ${term.sampleProblem.answer}</p>`;
      }
      html += `</section>`;
    }

    if (term.additionalProblems && Array.isArray(term.additionalProblems)) {
      html += `<section><h3>Additional Problems</h3>`;
      term.additionalProblems.forEach((problem, index) => {
        html += `<div style="margin-bottom: 20px;">`;
        html += `<h4>Problem ${index + 1}</h4>`;
        if (problem.question) {
          html += `<p><strong>Question:</strong> ${problem.question}</p>`;
        }
        if (problem.solution && Array.isArray(problem.solution)) {
          html += `<ol>`;
          problem.solution.forEach(step => {
            html += `<li>${step}</li>`;
          });
          html += `</ol>`;
        }
        if (problem.answer) {
          html += `<p><strong>Answer:</strong> ${problem.answer}</p>`;
        }
        html += `</div>`;
      });
      html += `</section>`;
    }

    if (term.answer && !term.sampleProblem && !term.additionalProblems) {
      html += `<section>
        <h3>Answer</h3>
        <p>${term.answer}</p>
      </section>`;
    }

    container.innerHTML = html;

  })
  .catch(error => {
    console.error("Error loading term details:", error);
    container.innerHTML = "<p>Error loading details: " + error.message + "</p>";
  });
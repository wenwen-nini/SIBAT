const container = document.getElementById("details-container");

// get id from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("../json/terms.json")
  .then(res => res.json())
  .then(data => {

    const term = data.find(t => t.id == id);

    if (!term) {
      container.innerHTML = "<p>Term not found</p>";
      return;
    }

    let html = `
      <div class="category">${term.category}</div>

      <h1>${term.english}</h1>
      ${term.filipino ? `<p id="filipino" class="filipino">${term.filipino}</p>` : ''}

      <hr>

      <section>
        <h3>Ano ang kahulugan ng <span class="english">${term.english}</span>?</h3>
        <p>${term.definition}</p>
      </section>
    `;

    // Add optional fields if they exist
    if (term.formula) {
      html += `<section>
        <h3>Formula</h3>
        <p><code>${term.formula}</code></p>
      </section>`;
    }

    if (term.example) {
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
      if (term.sampleProblem.general_question) {
        html += `<p><strong>General Question:</strong> ${term.sampleProblem.general_question}</p>`;
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

  });
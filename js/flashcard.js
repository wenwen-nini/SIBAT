let allTerms = [];
let flashcards = [];
let currentCardIndex = 0;
let markedGood = [];
let markedBad = [];
let isFlipped = false;

// Flatten nested terms
function flattenTerms(data) {
  let flattened = [];
  
  data.forEach(term => {
    if (term.definition) {
      flattened.push(term);
    }
    
    if (term.details && Array.isArray(term.details)) {
      term.details.forEach(detail => {
        if (detail.definition) {
          flattened.push(detail);
        }
        
        if (detail.types && Array.isArray(detail.types)) {
          detail.types.forEach(type => {
            if (type.definition) {
              flattened.push(type);
            }
          });
        }
      });
    }
  });
  
  return flattened;
}

// Shuffle array
function shuffleArray(array) {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Display current flashcard
function displayCard() {
  const cardContainer = document.querySelector('.flashcard-container');
  const progressText = document.querySelector('.flashcard-progress');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  
  if (currentCardIndex >= flashcards.length) {
    showFlashcardResults();
    return;
  }
  
  const card = flashcards[currentCardIndex];
  
  // Update progress
  progressText.textContent = `Card ${currentCardIndex + 1} of ${flashcards.length}`;
  
  // Reset flip state
  isFlipped = false;
  cardContainer.classList.remove('flipped');
  
  // Display front (term)
  const frontElement = document.querySelector('.flashcard-front');
  frontElement.innerHTML = `
    <div class="flashcard-content">
      <h2>${card.english}</h2>
      <p class="flashcard-hint">${card.filipino || 'Click to flip'}</p>
    </div>
    <p class="flip-hint">Click card to flip</p>
  `;
  
  // Display back (definition and example)
  const backElement = document.querySelector('.flashcard-back');
  backElement.innerHTML = `
    <div class="flashcard-content">
      <h3>Definition</h3>
      <p>${card.definition}</p>
      ${card.example ? `<hr><h4>Example:</h4><p>${card.example}</p>` : ''}
    </div>
    <p class="flip-hint">Click card to flip</p>
  `;
  
  // Make card clickable to flip
  cardContainer.onclick = () => flipCard();
  
  // Navigation buttons
  prevBtn.disabled = currentCardIndex === 0;
  nextBtn.disabled = currentCardIndex === flashcards.length - 1;
}

// Flip card
function flipCard() {
  const cardContainer = document.querySelector('.flashcard-container');
  isFlipped = !isFlipped;
  cardContainer.classList.toggle('flipped');
}

// Mark as good
function markGood() {
  const card = flashcards[currentCardIndex];
  if (!markedGood.includes(card.id)) {
    markedGood.push(card.id);
  }
  if (markedBad.includes(card.id)) {
    markedBad = markedBad.filter(id => id !== card.id);
  }
  nextCard();
}

// Mark as bad
function markBad() {
  const card = flashcards[currentCardIndex];
  if (!markedBad.includes(card.id)) {
    markedBad.push(card.id);
  }
  if (markedGood.includes(card.id)) {
    markedGood = markedGood.filter(id => id !== card.id);
  }
  nextCard();
}

// Next card
function nextCard() {
  if (currentCardIndex < flashcards.length - 1) {
    currentCardIndex++;
    displayCard();
  }
}

// Previous card
function previousCard() {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    displayCard();
  }
}

// Show results
function showFlashcardResults() {
  const container = document.querySelector('.flashcard-study-container');
  const goodCount = markedGood.length;
  const badCount = markedBad.length;
  const reviewCount = flashcards.length - goodCount - badCount;
  
  container.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <h2>Study Session Complete!</h2>
      <div style="margin: 30px 0; font-size: 18px;">
        <p><strong style="color: #28a745;">✓ Good:</strong> ${goodCount} cards</p>
        <p><strong style="color: #ffc107;">◐ Review:</strong> ${reviewCount} cards</p>
        <p><strong style="color: #dc3545;">✗ Bad:</strong> ${badCount} cards</p>
      </div>
      <div style="margin-top: 30px;">
        <a href="flashcard.html" style="display: inline-block; background: #667eea; color: white; padding: 10px 30px; border-radius: 5px; text-decoration: none; margin-right: 10px;">Study Again</a>
        <a href="quiz.html" style="display: inline-block; background: #764ba2; color: white; padding: 10px 30px; border-radius: 5px; text-decoration: none;">Back to Quiz Menu</a>
      </div>
    </div>
  `;
}

// Load and initialize flashcards
fetch('../json/terms.json')
  .then(res => res.json())
  .then(data => {
    allTerms = flattenTerms(data);
    flashcards = shuffleArray(allTerms);
    displayCard();
  })
  .catch(error => {
    console.error('Error loading flashcards:', error);
    document.querySelector('.flashcard-study-container').innerHTML = '<p>Error loading flashcards. Please try again.</p>';
  });

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const goodBtn = document.querySelector('.good-btn');
  const badBtn = document.querySelector('.bad-btn');
  
  if (nextBtn) nextBtn.onclick = nextCard;
  if (prevBtn) prevBtn.onclick = previousCard;
  if (goodBtn) goodBtn.onclick = markGood;
  if (badBtn) badBtn.onclick = markBad;
});

let allTerms = [];
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = [];

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

// Generate MCQ questions from terms
function generateQuestions(terms, count = 20) {
  let questions = [];
  let selectedTerms = shuffleArray(terms).slice(0, Math.min(count, terms.length));
  
  selectedTerms.forEach(correctTerm => {
    // Get 3 random wrong answers
    let wrongOptions = [];
    while (wrongOptions.length < 3) {
      let randomTerm = terms[Math.floor(Math.random() * terms.length)];
      if (randomTerm.id !== correctTerm.id && !wrongOptions.includes(randomTerm)) {
        wrongOptions.push(randomTerm);
      }
    }
    
    let allOptions = [correctTerm, ...wrongOptions];
    allOptions = shuffleArray(allOptions);
    
    questions.push({
      question: `What is the definition of "${correctTerm.english}"?`,
      correctAnswer: correctTerm.definition,
      correctId: correctTerm.id,
      options: allOptions.map(term => ({
        text: term.definition,
        id: term.id,
        isCorrect: term.id === correctTerm.id
      })),
      english: correctTerm.english
    });
  });
  
  return questions;
}

// Display question
function displayQuestion() {
  const questionContainer = document.querySelector('.question-container');
  const questionNumber = document.querySelector('.question-number');
  const questionText = document.querySelector('.question');
  const optionsContainer = document.querySelector('.options');
  const nextBtn = document.querySelector('.next-btn');
  
  if (currentQuestionIndex >= quizQuestions.length) {
    showResults();
    return;
  }
  
  const question = quizQuestions[currentQuestionIndex];
  
  questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
  questionText.textContent = question.question;
  
  optionsContainer.innerHTML = '';
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option';
    button.textContent = option.text;
    button.onclick = () => selectAnswer(option.id, option.isCorrect, button);
    optionsContainer.appendChild(button);
  });
  
  nextBtn.disabled = true;
  nextBtn.style.opacity = '0.5';
}

// Handle answer selection
function selectAnswer(selectedId, isCorrect, buttonElement) {
  const optionsContainer = document.querySelector('.options');
  const buttons = optionsContainer.querySelectorAll('.option');
  const nextBtn = document.querySelector('.next-btn');
  
  // Disable all buttons
  buttons.forEach(btn => btn.disabled = true);
  
  // Show correct/incorrect
  if (isCorrect) {
    buttonElement.classList.add('correct');
    score++;
  } else {
    buttonElement.classList.add('incorrect');
    // Show the correct answer
    buttons.forEach(btn => {
      if (btn.dataset.correct === 'true') {
        btn.classList.add('correct');
      }
    });
  }
  
  answeredQuestions.push({
    question: quizQuestions[currentQuestionIndex].english,
    isCorrect: isCorrect
  });
  
  // Enable next button
  nextBtn.disabled = false;
  nextBtn.style.opacity = '1';
}

// Next question
function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    displayQuestion();
  } else {
    showResults();
  }
}

// Show results
function showResults() {
  const container = document.querySelector('.quiz-container');
  const percentage = Math.round((score / quizQuestions.length) * 100);
  
  // Calculate stars based on percentage
  const stars = Math.ceil(percentage / 20);
  let starsHTML = '';
  for (let i = 1; i <= 5; i++) {
    starsHTML += `<span style="font-size: 40px; color: ${i <= stars ? '#FFD700' : '#ddd'};">★</span>`;
  }
  
  let resultMessage = '';
  if (percentage >= 80) {
    resultMessage = 'Excellent! You have a great understanding!';
  } else if (percentage >= 60) {
    resultMessage = 'Good job! Keep practicing to improve!';
  } else if (percentage >= 40) {
    resultMessage = 'Not bad! Review the terms and try again!';
  } else {
    resultMessage = 'Keep practicing! You\'ll improve with more study!';
  }
  
  container.innerHTML = `
    <div style="text-align: center; padding: 40px;">
      <h2>Quiz Complete!</h2>
      <div style="margin: 20px 0;">${starsHTML}</div>
      <p style="font-size: 24px; margin: 20px 0;">Your Score: <strong>${score}/${quizQuestions.length} (${percentage}%)</strong></p>
      <p style="font-size: 16px; margin: 20px 0;">${resultMessage}</p>
      <div style="margin-top: 30px;">
        <a href="mcq.html" style="display: inline-block; background: #667eea; color: white; padding: 10px 30px; border-radius: 12px; text-decoration: none; margin-right: 10px;">Retake Quiz</a>
        <a href="quiz.html" style="display: inline-block; background: #764ba2; color: white; padding: 10px 30px; border-radius: 12px; text-decoration: none;">Back to Quiz Menu</a>
      </div>
    </div>
  `;
}

// Load and initialize quiz
fetch('../json/terms.json')
  .then(res => res.json())
  .then(data => {
    allTerms = flattenTerms(data);
    quizQuestions = generateQuestions(allTerms);
    displayQuestion();
  })
  .catch(error => {
    console.error('Error loading quiz:', error);
    document.querySelector('.quiz-container').innerHTML = '<p>Error loading quiz. Please try again.</p>';
  });

// Set data-correct attribute for options
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.next-btn').onclick = nextQuestion;
});

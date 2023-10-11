// URL base de la API de preguntas
const API_BASE_URL = 'https://opentdb.com/api.php?';
const categorySelect = document.getElementById("category");
// Función para cargar preguntas desde la API
async function loadQuestions(category, difficulty, type) {
  const url = `${API_BASE_URL}amount=10&category=${category}&difficulty=${difficulty}&type=${type}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
  }
}

// Función para mostrar preguntas y respuestas
function displayQuestions(questions) {
  const quizContainer = document.getElementById('quiz-container');
  let score = 0;

  questions.forEach((question, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');
    questionDiv.classList.add('card');
    questionDiv.innerHTML = `
      <h4>Pregunta ${index + 1}:</h4>
      <p>${question.question}</p>
    `;

    const answers = question.incorrect_answers.concat(question.correct_answer);
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {
      const answerDiv = document.createElement('div');
      answerDiv.classList.add('answer');
      answerDiv.innerHTML = `
        <input type="radio" name="q${index}" value="${answer}">
        <label>${answer}</label>
      `;
      questionDiv.appendChild(answerDiv);
    });

    questionDiv.querySelectorAll('input[type=radio]').forEach(input => {
      input.addEventListener('change', (event) => {
        if (event.target.value === question.correct_answer) {
          score += 100;
        }
      });
    });

    quizContainer.appendChild(questionDiv);
  });

  const scoreDisplay = document.getElementById('score-display');
  scoreDisplay.textContent = `Puntaje final: ${score} puntos`;
}

// Función para generar una nueva trivia
function generateTrivia() {
  const category = categorySelect.value;
  const difficulty = document.getElementById('difficulty').value;
  const type = document.getElementById('type').value;

  const quizContainer = document.getElementById('quiz-container');
  quizContainer.innerHTML = ''; // Limpiamos las preguntas anteriores
  loadQuestions(category, difficulty, type)
    .then(questions => {
      displayQuestions(questions);
    });
}

// Evento para el botón "Crear nueva trivia"
const newTriviaButton = document.getElementById('new-trivia-button');
newTriviaButton.addEventListener('click', generateTrivia);

fetch("https://opentdb.com/api_category.php")
  .then(response => response.json())
  .then(data => {
      const categories = data.trivia_categories;
      categories.forEach(category => {
          const option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
      });
  });

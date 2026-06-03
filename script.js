const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const questionCount = document.getElementById('question-count');
const scoreLive = document.getElementById('score-live');
const progressBar = document.getElementById('progress-bar');
const questionText = document.getElementById('question-text');
const answersDiv = document.getElementById('answers');
const feedback = document.getElementById('feedback');
const finalScore = document.getElementById('final-score');
const resultMessage = document.getElementById('result-message');
const reviewList = document.getElementById('review-list');

let current = 0;
let score = 0;
let userAnswers = [];

function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

function startQuiz() {
  current = 0;
  score = 0;
  userAnswers = [];
  showScreen(quizScreen);
  loadQuestion();
}

function loadQuestion() {
  const q = questions[current];
  questionCount.textContent = `Question ${current + 1} of ${questions.length}`;
  scoreLive.textContent = `Score: ${score}`;
  progressBar.style.width = `${(current / questions.length) * 100}%`;
  questionText.textContent = q.question;
  answersDiv.innerHTML = '';
  feedback.textContent = '';
  feedback.className = 'feedback';
  nextBtn.classList.add('hidden');

  q.choices.forEach((choice, index) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = choice;
    btn.addEventListener('click', () => chooseAnswer(index, btn));
    answersDiv.appendChild(btn);
  });
}

function chooseAnswer(index) {
  const q = questions[current];
  const buttons = Array.from(document.querySelectorAll('.answer-btn'));
  buttons.forEach(btn => btn.disabled = true);

  const isCorrect = index === q.answer;
  if (isCorrect) score++;
  userAnswers.push({ question: q.question, chosen: q.choices[index], correct: q.choices[q.answer], isCorrect });

  buttons[q.answer].classList.add('correct');
  if (!isCorrect) buttons[index].classList.add('wrong');

  feedback.textContent = isCorrect ? 'Correct!' : `Wrong. Correct answer: ${q.choices[q.answer]}`;
  feedback.classList.add(isCorrect ? 'good' : 'bad');
  scoreLive.textContent = `Score: ${score}`;
  nextBtn.textContent = current === questions.length - 1 ? 'See Results' : 'Next Question';
  nextBtn.classList.remove('hidden');
}

function nextQuestion() {
  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  showScreen(resultScreen);
  progressBar.style.width = '100%';
  const percent = Math.round((score / questions.length) * 100);
  finalScore.textContent = `${score} / ${questions.length} (${percent}%)`;
  if (percent >= 90) resultMessage.textContent = 'Excellent. You are very prepared for Software Analyst job duties and concepts.';
  else if (percent >= 75) resultMessage.textContent = 'Good work. Review the missed questions and focus on the weaker areas.';
  else if (percent >= 60) resultMessage.textContent = 'Passing practice, but keep studying application support, SQL, SDLC, testing, and documentation.';
  else resultMessage.textContent = 'Keep practicing. Review the job duties and core Software Analyst skills again.';

  reviewList.innerHTML = userAnswers.map((item, i) => `
    <div class="review-item">
      <strong>${i + 1}. ${item.isCorrect ? 'Correct' : 'Incorrect'}</strong>
      <div>${item.question}</div>
      <div>Your answer: ${item.chosen}</div>
      <div>Correct answer: ${item.correct}</div>
    </div>`).join('');
}

startBtn.addEventListener('click', startQuiz);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', startQuiz);

$(window).load(function(){$('#preloader').fadeOut();});
let questions = [];
let currentQuestionIndex = 0;

// Check for saved progress
const savedProgress = localStorage.getItem("flashcardProgress");
if (savedProgress !== null) {
  const shouldResume = confirm("Do you want to continue from where you left off?");
  if (shouldResume) {
    currentQuestionIndex = parseInt(savedProgress, 10);
  } else {
    localStorage.removeItem("flashcardProgress");
  }
}

const questionText = document.getElementById("question-text");
const choicesContainer = document.getElementById("choices-container");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");

// Fetch questions from the JSON file
fetch("questions.json")
  .then(response => response.json())
  .then(data => {
    questions = data;
    createHistoryPanel();
    loadQuestion();
  })
  .catch(error => {
    questionText.textContent = "Error loading questions.";
    console.error("Error fetching questions:", error);
  });

  function loadQuestion() {
    nextButton.disabled = true;
    const questionData = questions[currentQuestionIndex];
  
    // Handle image
    const imageElement = document.getElementById("question-image");
    if (questionData.image) {
      imageElement.src = questionData.image;
      imageElement.style.display = "block";
    } else {
      imageElement.style.display = "none";
    }
  
    // Set question text
    questionText.textContent = questionData.question;
    choicesContainer.innerHTML = "";
  
    // Create choices (same as before)
    questionData.choices.forEach((choice, index) => {
      const choiceCard = document.createElement("div");
      choiceCard.classList.add("choice-card");
      choiceCard.innerHTML = `
        <div class="choice-card-inner">
          <div class="choice-card-front">${choice}</div>
          <div class="choice-card-back">${choice}</div>
        </div>
      `;
      choiceCard.addEventListener("click", () => checkAnswer(index, choiceCard));
      choicesContainer.appendChild(choiceCard);
    });
  
    prevButton.disabled = currentQuestionIndex === 0;
    updateHistoryStyles();
  }
  

function showQuizResult() {
  const correctCount = questions.filter(q => q.isCorrect).length;
  const totalQuestions = questions.length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  let grade = "Bad";
  if (scorePercent >= 90) grade = "Excellent";
  else if (scorePercent >= 80) grade = "Very Good";
  else if (scorePercent >= 70) grade = "Good";
  else if (scorePercent >= 60) grade = "Average";

  questionText.textContent = "📊 Quiz Result";
  choicesContainer.innerHTML = `
    <div class="quiz-result-box">
      <p><strong>You scored:</strong> ${correctCount}/${totalQuestions} (${scorePercent}%)</p>
      <p><strong>Grade:</strong> ${grade}</p>
    </div>
  `;

  nextButton.style.display = "none";
  prevButton.style.display = "none";

  // Remove progress storage
  localStorage.removeItem("flashcardProgress");
  document.getElementById("question-image").style.display = "none";

}


function updateHistoryStyles() {
  const historyItems = document.querySelectorAll("#question-history-list li");
  historyItems.forEach((li, idx) => {
    li.classList.remove("active");

    // Skip the result tab (which is the last item)
    if (idx >= questions.length) return;

    if (idx === currentQuestionIndex) {
      li.classList.add("active");
    }
    if (questions[idx]?.userAnswered) {
      li.classList.add("answered");
    }
  });
}



function checkAnswer(selectedIndex, selectedCard) {
  const questionData = questions[currentQuestionIndex]; 


  questions[currentQuestionIndex].userAnswered = true;

  if (selectedIndex === questionData.correct) {
    selectedCard.querySelector(".choice-card-back").classList.add("correct");
    questions[currentQuestionIndex].isCorrect = true; // ⬅️ Track correct
  } else {
    selectedCard.querySelector(".choice-card-back").classList.add("wrong");
    questions[currentQuestionIndex].isCorrect = false; // ⬅️ Track incorrect
  }

  updateHistoryStyles();

  // Flip only the selected card
  selectedCard.classList.add("flipped");

  // Apply color based on correctness
  if (selectedIndex === questionData.correct) {
    selectedCard.querySelector(".choice-card-back").classList.add("correct");
  } else {
    selectedCard.querySelector(".choice-card-back").classList.add("wrong");
  }

  // Disable further clicking on all cards
  const choiceCards = document.querySelectorAll(".choice-card");
  choiceCards.forEach(card => {
    card.style.pointerEvents = "none";
  });

  // Enable the Next button after an answer is chosen
  nextButton.disabled = false;
}


nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
    localStorage.setItem("flashcardProgress", currentQuestionIndex.toString());
  } else {
   // Quiz complete — show result
showQuizResult();

// Visually activate result tab
const historyItems = document.querySelectorAll("#question-history-list li");
historyItems.forEach(item => item.classList.remove("active"));

// Activate last li (quiz result)
const resultTab = historyItems[historyItems.length - 1];
if (resultTab) {
  resultTab.classList.add("active");
}

// Clear saved progress
localStorage.removeItem("flashcardProgress");

  }
});


prevButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
  localStorage.setItem("flashcardProgress", currentQuestionIndex.toString());
});

function createHistoryPanel() {
  const historyList = document.getElementById("question-history-list");
  historyList.innerHTML = "";

  questions.forEach((_, index) => {
    const li = document.createElement("li");
    li.textContent = `Question ${index + 1}`;
    li.dataset.index = index;

    li.addEventListener("click", () => {
      currentQuestionIndex = index;
      loadQuestion();
    });

    historyList.appendChild(li);
  });

  // ➕ Add the Quiz Result tab at the end
  const resultTab = document.createElement("li");
  resultTab.textContent = "📊 Quiz Result";
  resultTab.classList.add("result-tab");
  resultTab.addEventListener("click", () => {
    showQuizResult();
  });
  historyList.appendChild(resultTab);
}


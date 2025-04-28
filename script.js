const questions = [
  {
    question: "What can be assessed by visualizing the intervertebral disc spaces in the provided radiograph?",
    choices: ["Alignment of the vertebral bodies", "Symmetry of the transverse processes", "Proper penetration of the radiograph", "Contour of the spinous process"],
    correct: 0,
    image: "images/img1.webp",
    explanation: "Patients have the right to confidentiality under HIPAA. Informed consent ensures they understand treatments and rights."
  },
  {
    question: "Where is the central ray directed for the trauma AP axial (Towne) projection of the skull?",
    choices: ["5 cm above the glabella", "At the nasion", "Midway between the EAMs", "At the mandibular symphysis"],
    correct: 0,
    explanation: "The central ray for the trauma AP axial (Towne) projection of the skull is directed 5 cm above the glabella."
  },
  {
    question: "What is the angulation required to perform this radiographic image?",
    choices: ["20° cephalad", "10° caudad", "15° cephalad", "15° caudad"],
    correct: 2,
    image: "images/img2.png",
    explanation: "The required angulation to perform this radiographic image is 15° cephalad."
  }
];

let currentQuestionIndex = 0;

// Declaring all DOM Elements
const questionCounter = document.getElementById("question-counter");
const questionText = document.getElementById("question-text");
const choicesContainer = document.getElementById("choices-container");
const prevButton = document.getElementById("prev-btn");
const nextButton = document.getElementById("next-btn");
const explanationBtn = document.getElementById("explanation-btn");
const zoomButton = document.getElementById('zoomButton');
const closeZoomButton = document.getElementById('closeZoomButton');
const zoomModal = document.getElementById('zoomModal');
const zoomedImage = document.getElementById('zoomedImage');
const questionImage = document.getElementById('question-image');
const imageWrapper = document.getElementById('question-image-wrapper');


// Function to load the current question STart
function loadQuestion() {
  const questionData = questions[currentQuestionIndex];

  // Set question text
  questionText.textContent = questionData.question;
  choicesContainer.innerHTML = "";

  questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  // Load choices (From choice container ID and create choice cards (New divs and their styling is flex))
  questionData.choices.forEach((choice, index) => {
    const choiceCard = document.createElement("div");
    choiceCard.classList.add("choice-card");

    const isCorrect = index === questionData.correct;
    const feedbackText = isCorrect ? "Correct Answer" : "Incorrect Answer";

    choiceCard.innerHTML = `
      <div class="choice-card-inner">
        <div class="choice-card-front">${choice}</div>
        <div class="choice-card-back ${isCorrect ? 'correct' : 'wrong'}">${feedbackText}</div>
      </div>
    `;

    choiceCard.addEventListener("click", () => {
      choiceCard.classList.toggle("flipped");
    });

    choicesContainer.appendChild(choiceCard);
  });

  // Handle image and zoom button
  if (questionData.image) {
    questionImage.src = questionData.image;
    questionImage.style.display = "block";
    zoomButton.style.display = "block";
    imageWrapper.style.display = "inline-block"; // 🟢 Show the wrapper normally
    questionText.style.flex = "unset"; // 🟢 Reset text width to normal
  } else {
    questionImage.style.display = "none";
    zoomButton.style.display = "none";
    imageWrapper.style.display = "none"; // 🔴 Hide the whole image wrapper
    questionText.style.flex = "1"; // 🟢 Expand the text to take full width
  }

  // Disable prev/next appropriately
  prevButton.disabled = currentQuestionIndex === 0;
  nextButton.disabled = currentQuestionIndex === questions.length - 1;
}

// Navigation
prevButton.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
});

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  }
});

// Explanation Popup
explanationBtn.addEventListener("click", () => {
  const questionData = questions[currentQuestionIndex];
  const popup = document.createElement("div");
  popup.className = "popup-overlay";

  popup.innerHTML = `
    <div class="popup-content animate">
      <span class="popup-close">&times;</span>
      <h3>💡 Explanation</h3>
      <p>${questionData.explanation}</p>
    </div>
  `;

  document.body.appendChild(popup);

  const content = popup.querySelector(".popup-content");

  const closePopup = () => {
    content.classList.remove("animate");
    content.classList.add("fade-out");
    setTimeout(() => popup.remove(), 300);
  };

  popup.querySelector(".popup-close").addEventListener("click", closePopup);
  popup.addEventListener("click", (e) => {
    if (e.target === popup) closePopup();
  });
});

// Zoom Modal for image
zoomButton.addEventListener('click', () => {
  if (questionImage.src) {
    zoomedImage.src = questionImage.src;
    zoomModal.style.display = 'flex';
  }
});

closeZoomButton.addEventListener('click', () => {
  zoomModal.style.display = 'none';
});

zoomModal.addEventListener('click', (event) => {
  if (event.target === zoomModal) {
    zoomModal.style.display = 'none';
  }
});

// Initial Load
loadQuestion();

// Save input values automatically
document.querySelectorAll("input").forEach((input) => {
  const key = input.previousElementSibling.innerText;

  // Load saved value
  const savedValue = localStorage.getItem(key);
  if (savedValue) {
    input.value = savedValue;
  }

  // Save on typing
  input.addEventListener("input", () => {
    localStorage.setItem(key, input.value);
  });
});
// ===== JOURNAL PAGE LOGIC =====

document.addEventListener("DOMContentLoaded", () => {
  const journalForm = document.getElementById("journalForm");
  const dateTimeInput = document.getElementById("dateTime");
  const reflectiveContainer = document.getElementById("reflectiveQuestions");

  // Reflective questions (flexible)
  const reflectiveQs = [
    "How would you describe your day?",
    "What emotion stayed with you the longest?",
    "What are you grateful for today?"
  ];

  // Set current date & time
  const now = new Date();
  const options = { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" };
  dateTimeInput.value = now.toLocaleString("en-US", options);

  // Generate reflective questions inputs
  reflectiveQs.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "field-box";
    div.innerHTML = `
      <label>${q}</label>
      <input type="text" id="reflective${i}" placeholder="Your answer..." />
    `;
    reflectiveContainer.appendChild(div);
  });

  // Form submit
  journalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Load previous entries
    let entries = JSON.parse(localStorage.getItem("journalEntries")) || [];

    // Save Step 1–3 answers for first-time users
    let onboardingCompleted = localStorage.getItem("onboardingCompleted") === "true";
    let stepAnswers = {};
    if (!onboardingCompleted) {
      stepAnswers = {
        step1: JSON.parse(localStorage.getItem("step1")) || {},
        step2: JSON.parse(localStorage.getItem("step2")) || {},
        step3: JSON.parse(localStorage.getItem("step3")) || {}
      };
      localStorage.setItem("onboardingCompleted", "true"); // Mark onboarding complete
    }

    // Gather reflective answers
    const reflectiveAnswers = {};
    reflectiveQs.forEach((q, i) => {
      reflectiveAnswers[q] = document.getElementById(`reflective${i}`).value;
    });

    // Add new entry
    entries.push({
      date: now.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" }),
      time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      month: now.toLocaleString("en-US", { month: "long", year: "numeric" }),
      stepAnswers: stepAnswers,
      journalText: document.getElementById("journalText").value,
      reflectiveAnswers: reflectiveAnswers
    });

    // Save to localStorage
    localStorage.setItem("journalEntries", JSON.stringify(entries));

    alert("Your entry has been saved 🌿");
    journalForm.reset();
    dateTimeInput.value = now.toLocaleString("en-US", options);
  });
});




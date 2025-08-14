const categories = [
  {
    name: "Strategy",
    questions: [
      "We have a clear AI strategy aligned with business goals.",
      "Leadership actively supports AI initiatives.",
      "AI is considered in long-term planning."
    ]
  },
  {
    name: "Culture",
    questions: [
      "Our teams embrace innovation and experimentation.",
      "Employees understand AI’s role in our future.",
      "There is open communication about AI adoption."
    ]
  },
  {
    name: "Skills",
    questions: [
      "Staff receive AI-related training and upskilling.",
      "We have in-house AI expertise.",
      "We partner with external AI experts when needed."
    ]
  },
  {
    name: "Data & Technology",
    questions: [
      "Our data is well-governed, clean, and accessible.",
      "We have the right infrastructure to run AI solutions.",
      "Data security is prioritized in AI projects."
    ]
  },
  {
    name: "Ethics & Governance",
    questions: [
      "We follow ethical AI guidelines.",
      "Bias in AI models is regularly monitored.",
      "AI compliance and regulations are followed."
    ]
  },
  {
    name: "Measurement & Improvement",
    questions: [
      "We track the ROI of AI initiatives.",
      "AI models are regularly updated and improved.",
      "We learn from AI project successes and failures."
    ]
  }
];

const container = document.getElementById("questionsContainer");

categories.forEach(cat => {
  const catDiv = document.createElement("div");
  catDiv.className = "category";
  catDiv.innerHTML = `<h3>${cat.name}</h3>`;
  cat.questions.forEach((q, idx) => {
    const qDiv = document.createElement("div");
    qDiv.className = "question";
    qDiv.innerHTML = `
      <label>${q}</label>
      <select>
        <option value="1">1 - Strongly Disagree</option>
        <option value="2">2 - Disagree</option>
        <option value="3">3 - Neutral</option>
        <option value="4">4 - Agree</option>
        <option value="5">5 - Strongly Agree</option>
      </select>
    `;
    catDiv.appendChild(qDiv);
  });
  container.appendChild(catDiv);
});

document.getElementById("calculateBtn").addEventListener("click", () => {
  const selects = document.querySelectorAll("select");
  let total = 0;
  selects.forEach(s => total += parseInt(s.value));
  const max = selects.length * 5;
  const percentage = (total / max) * 100;

  let suggestion = "";
  if (percentage < 40) {
    suggestion = "Your AI readiness is low. Focus on building a clear strategy and investing in skills.";
  } else if (percentage < 70) {
    suggestion = "Your AI readiness is moderate. Improve infrastructure and strengthen governance.";
  } else {
    suggestion = "Your organization is AI-ready. Focus on continuous improvement.";
  }

  document.getElementById("totalScore").textContent = `Score: ${total} / ${max} (${percentage.toFixed(1)}%)`;
  document.getElementById("suggestions").textContent = suggestion;
  document.getElementById("results").style.display = "block";
});

document.getElementById("exportPdfBtn").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont("courier", "normal");
  doc.text("AI Implementation Maturity Assessment", 10, 10);
  doc.text(document.getElementById("totalScore").textContent, 10, 20);
  doc.text(document.getElementById("suggestions").textContent, 10, 30);
  doc.save("AI_Maturity_Assessment.pdf");
});

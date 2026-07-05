const completed = new Set();
const progressText = document.querySelector("#progressText");
const goalButtons = document.querySelectorAll("[data-complete]");
const evidenceChecks = document.querySelectorAll("[data-evidence]");
const evidenceResult = document.querySelector("#evidenceResult");
const quizForm = document.querySelector("#quizForm");
const quizResult = document.querySelector("#quizResult");

function recordEvent(type, payload) {
  const key = "p4t2_learning_events";
  const events = JSON.parse(localStorage.getItem(key) || "[]");
  events.push({
    type,
    payload,
    at: new Date().toISOString()
  });
  localStorage.setItem(key, JSON.stringify(events.slice(-80)));
}

function updateProgress() {
  progressText.textContent = `${completed.size} / ${goalButtons.length}`;
}

goalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.complete;
    if (completed.has(id)) {
      completed.delete(id);
      button.classList.remove("done");
    } else {
      completed.add(id);
      button.classList.add("done");
    }
    updateProgress();
    recordEvent("capability_progress", { id, done: completed.has(id) });
  });
});

function updateEvidence() {
  const done = [...evidenceChecks].filter((item) => item.checked).length;
  evidenceResult.textContent = `证据链完整度：${done} / ${evidenceChecks.length}`;
  evidenceResult.style.color = done === evidenceChecks.length ? "#28745d" : "#a76512";
}

evidenceChecks.forEach((item) => {
  item.addEventListener("change", () => {
    updateEvidence();
    recordEvent("evidence_check", { id: item.dataset.evidence, checked: item.checked });
  });
});

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(quizForm);
  const answers = ["q1", "q2", "q3"].map((key) => (form.get(key) || "").trim());
  const answered = answers.filter((answer) => answer.length >= 20).length;
  quizResult.textContent = answered === 3
    ? "已形成完整作答记录，等待教师或平台评分。"
    : `已记录 ${answered} 道有效作答，建议补全剩余题目。`;
  recordEvent("assessment_submit", { answered, total: 3 });
});

updateProgress();
updateEvidence();

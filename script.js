const CHOICES = ["rock", "paper", "scissors"];
const ICONS = { rock: "✊", paper: "✋", scissors: "✌️" };

const pScoreEl = document.getElementById("pScore");
const cScoreEl = document.getElementById("cScore");
const resultBox = document.getElementById("result");
const resultText = document.getElementById("resultText");
const resultIcon = document.getElementById("resultIcon");
const chipsEl = document.getElementById("lastRound");
const resetBtn = document.getElementById("reset");
const bestBtn = document.getElementById("bestOf");

let pScore = 0;
let cScore = 0;
let round = 0;
let seriesLen = 0;

const randChoice = () => CHOICES[Math.floor(Math.random() * 3)];

function outcome(p, c) {
  if (p === c) return "draw";
  if (
    (p === "rock" && c === "scissors") ||
    (p === "paper" && c === "rock") ||
    (p === "scissors" && c === "paper")
  ) return "win";
  return "lose";
}

function updateScores() {
  pScoreEl.textContent = pScore;
  cScoreEl.textContent = cScore;
}

function showResult(state, msg, icon) {
  resultBox.className = `result ${state}`;
  resultText.textContent = msg;
  resultIcon.textContent = icon;
  resultBox.classList.remove("pulse");
  void resultBox.offsetWidth;
  resultBox.classList.add("pulse");
}

function updateChips(p, c) {
  chipsEl.innerHTML = `
    <span class="chip">You: ${ICONS[p]} ${p}</span>
    <span class="chip">Computer: ${ICONS[c]} ${c}</span>
    <span class="chip">Round: ${round}</span>
  `;
}

function finishSeries() {
  if (!seriesLen) return false;
  const need = Math.ceil(seriesLen / 2);
  if (pScore === need || cScore === need) {
    const youWon = pScore > cScore;
    showResult(
      youWon ? "win" : "lose",
      youWon ? `You win the series ${pScore}–${cScore}!` : `Computer wins the series ${cScore}–${pScore}.`,
      youWon ? "🏆" : "🤖"
    );
    seriesLen = 0;
    bestBtn.textContent = "🎯 Best of 5";
    return true;
  }
  return false;
}

function playRound(player) {
  const comp = randChoice();
  const state = outcome(player, comp);

  round++;
  if (state === "win") pScore++;
  if (state === "lose") cScore++;

  updateScores();
  updateChips(player, comp);

  const msg =
    state === "win"  ? `You win! ${cap(player)} beats ${cap(comp)}.` :
    state === "lose" ? `You lose! ${cap(comp)} beats ${cap(player)}.` :
                       `It's a draw — you both chose ${cap(player)}.`;

  const ico = state === "win" ? "🎉" : state === "lose" ? "😵" : "😶";
  showResult(state, msg, ico);

  finishSeries();
}

function cap(w) { return w[0].toUpperCase() + w.slice(1); }

function resetGame() {
  pScore = 0; cScore = 0; round = 0;
  updateScores();
  chipsEl.innerHTML = `
    <span class="chip">You: —</span>
    <span class="chip">Computer: —</span>
    <span class="chip">Round: 0</span>
  `;
  showResult("draw", "Make your move", "😶");
}

function toggleBestOf() {
  if (seriesLen === 5) {
    seriesLen = 0;
    bestBtn.textContent = "🎯 Best of 5";
    showResult("draw", "Best-of mode off. Make your move.", "😶");
  } else {
    seriesLen = 5;
    bestBtn.textContent = "🔥 Best of 5 — ON";
    pScore = 0; cScore = 0; round = 0;
    updateScores();
    chipsEl.innerHTML = `<span class="chip">Series started!</span><span class="chip">First to 3 wins</span>`;
    showResult("draw", "Best of 5 started — first to 3!", "🎯");
  }
}

document.querySelectorAll(".choice").forEach(btn => {
  btn.addEventListener("pointerdown", e => {
    const r = btn.getBoundingClientRect();
    const x = ((e.clientX || 0) - r.left) / r.width * 100;
    const y = ((e.clientY || 0) - r.top) / r.height * 100;
    btn.style.setProperty("--x", x + "%");
    btn.style.setProperty("--y", y + "%");
  });
  btn.addEventListener("click", () => playRound(btn.dataset.choice));
});

resetBtn.addEventListener("click", resetGame);
bestBtn.addEventListener("click", toggleBestOf);

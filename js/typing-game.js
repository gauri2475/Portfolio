/* ==========================================================================
   Typing Speed Test Mini-Game Widget
   ========================================================================== */

class TypingGame {
  constructor() {
    this.sampleTexts = {
      easy: [
        "HTML and CSS form the foundational backbone of every web interface.",
        "React makes creating interactive and responsive user interfaces simple and efficient.",
        "Clean code is easy to read, test, maintain, and enhance over time."
      ],
      medium: [
        "Frontend developers translate creative design vision into functional interactive web applications.",
        "Asynchronous JavaScript handles API fetches without interrupting the primary user experience flow.",
        "Cybersecurity dashboards require real-time data visibility and clear information hierarchy."
      ],
      hard: [
        "Building scalable SOC automation interfaces demands seamless state management and instant visual feedback.",
        "Micro-interactions and subtle glassmorphic UI components significantly enhance user retention and aesthetic impression.",
        "Optimizing critical rendering paths ensures lightning-fast performance across all modern mobile browsers."
      ]
    };

    this.timer = null;
    this.timeLeft = 30;
    this.maxTime = 30;
    this.isTyping = false;
    this.charIndex = 0;
    this.mistakes = 0;
    this.difficulty = 'medium';
    this.currentText = "";

    this.initElements();
  }

  initElements() {
    this.textDisplay = document.getElementById('typing-text-display');
    this.inputArea = document.getElementById('typing-input');
    this.wpmDisplay = document.getElementById('typing-wpm');
    this.accDisplay = document.getElementById('typing-acc');
    this.timeDisplay = document.getElementById('typing-time');
    this.diffSelect = document.getElementById('typing-difficulty');
    this.resetBtn = document.getElementById('typing-reset-btn');

    if (!this.inputArea) return;

    this.diffSelect.addEventListener('change', (e) => {
      this.difficulty = e.target.value;
      this.resetGame();
    });

    this.inputArea.addEventListener('input', () => this.handleTyping());
    this.resetBtn.addEventListener('click', () => this.resetGame());
  }

  loadParagraph() {
    const list = this.sampleTexts[this.difficulty];
    const randomIndex = Math.floor(Math.random() * list.length);
    this.currentText = list[randomIndex];

    this.textDisplay.innerHTML = "";
    this.currentText.split("").forEach((char, index) => {
      let charSpan = document.createElement("span");
      charSpan.innerText = char;
      if (index === 0) charSpan.classList.add("current");
      this.textDisplay.appendChild(charSpan);
    });
  }

  handleTyping() {
    const characters = this.textDisplay.querySelectorAll("span");
    let typedChar = this.inputArea.value.split("")[this.charIndex];

    if (this.charIndex < characters.length && this.timeLeft > 0) {
      if (!this.isTyping) {
        this.timer = setInterval(() => this.initTimer(), 1000);
        this.isTyping = true;
      }

      if (typedChar == null) {
        // Backspacing
        if (this.charIndex > 0) {
          this.charIndex--;
          if (characters[this.charIndex].classList.contains("incorrect")) {
            this.mistakes--;
          }
          characters[this.charIndex].classList.remove("correct", "incorrect");
        }
      } else {
        if (characters[this.charIndex].innerText === typedChar) {
          characters[this.charIndex].classList.add("correct");
        } else {
          this.mistakes++;
          characters[this.charIndex].classList.add("incorrect");
        }
        this.charIndex++;
      }

      characters.forEach(span => span.classList.remove("current"));
      if (this.charIndex < characters.length) {
        characters[this.charIndex].classList.add("current");
      }

      // Calculate Stats
      let wpm = Math.round((((this.charIndex - this.mistakes) / 5) / (this.maxTime - this.timeLeft)) * 60);
      wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

      let accuracy = Math.round(((this.charIndex - this.mistakes) / (this.charIndex || 1)) * 100);
      accuracy = accuracy < 0 ? 0 : accuracy;

      this.wpmDisplay.innerText = wpm;
      this.accDisplay.innerText = accuracy + "%";
    } else {
      clearInterval(this.timer);
      this.inputArea.value = "";
    }
  }

  initTimer() {
    if (this.timeLeft > 0) {
      this.timeLeft--;
      this.timeDisplay.innerText = this.timeLeft + "s";
      let wpm = Math.round((((this.charIndex - this.mistakes) / 5) / (this.maxTime - this.timeLeft)) * 60);
      this.wpmDisplay.innerText = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    } else {
      clearInterval(this.timer);
      this.inputArea.disabled = true;
      this.timeDisplay.innerText = "Time's Up!";
    }
  }

  resetGame() {
    clearInterval(this.timer);
    this.timeLeft = this.maxTime;
    this.charIndex = 0;
    this.mistakes = 0;
    this.isTyping = false;
    this.inputArea.value = "";
    this.inputArea.disabled = false;
    this.wpmDisplay.innerText = "0";
    this.accDisplay.innerText = "100%";
    this.timeDisplay.innerText = this.timeLeft + "s";
    this.loadParagraph();
  }
}

window.TypingGame = TypingGame;

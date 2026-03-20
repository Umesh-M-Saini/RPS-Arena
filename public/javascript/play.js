const choices = document.querySelectorAll('.choice');
const result = document.getElementById('result');
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');
const timerEl = document.getElementById('time');
const pauseBtn = document.getElementById('pauseBtn');

let playerScore = 0;
let computerScore = 0;
let allowMoves = true;
let isPaused = false;
let countdown;

const isAuthenticated = typeof window.IS_AUTHENTICATED !== 'undefined' ? (window.IS_AUTHENTICATED === true || window.IS_AUTHENTICATED === 'true') : false;
let time = typeof window.MATCH_TIME === 'number' ? window.MATCH_TIME : (isAuthenticated ? 40 : 20);

if (timerEl) timerEl.innerText = time;

const computerChoices = ['rock', 'paper', 'scissors'];

const toast = document.getElementById('toast');
const resultModal = document.getElementById('resultModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

choices.forEach((button) => {
    button.addEventListener('click', () => {
        if (isPaused) return;
        if (!allowMoves) {
            showToast('Time is over. You cannot make a move.');
            return;
        }
        const playerChoice = button.dataset.choice;
        const computerChoice = computerChoices[Math.floor(Math.random() * 3)];
        playGame(playerChoice, computerChoice);
    });
});

function playGame(player, computer) {
    if (player === computer) {
        result.innerText = 'Draw 🤝';
    } else if (
        (player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')
    ) {
        playerScore++;
        playerScoreEl.innerText = playerScore;
        result.innerText = `You Win 🎉 (${player} beats ${computer})`;
    } else {
        computerScore++;
        computerScoreEl.innerText = computerScore;
        result.innerText = `Computer Wins 🤖 (${computer} beats ${player})`;
    }
}

function startTimer() {
    countdown = setInterval(() => {
        if (isPaused) return;
        time--;
        if (timerEl) timerEl.innerText = time;
        if (time <= 0) {
            clearInterval(countdown);
            endMatch();
        }
    }, 1000);
}

startTimer();

if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
        if (!allowMoves) return;
        isPaused = !isPaused;
        if (isPaused) {
            pauseBtn.innerText = '▶ Resume';
            pauseBtn.classList.add('resuming');
            choices.forEach((b) => (b.disabled = true));
            result.innerText = '⏸ Game Paused';
        } else {
            pauseBtn.innerText = '⏸ Pause';
            pauseBtn.classList.remove('resuming');
            choices.forEach((b) => (b.disabled = false));
            result.innerText = 'Make your move!';
        }
    });
}

function endMatch() {
    allowMoves = false;
    if (pauseBtn) pauseBtn.disabled = true;
    choices.forEach((b) => (b.disabled = true));
    
    let outcome = 'draw';
    if (playerScore > computerScore) {
        outcome = 'win';
        showResultModal('You Win!', 'success');
    } else if (playerScore < computerScore) {
        outcome = 'lose';
        showResultModal('You Lose!', 'danger');
    } else {
        showResultModal('Draw!', 'neutral');
    }

    if (isAuthenticated) {
        fetch('/api/match/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ outcome }),
        })
        .catch((err) => console.error('Fetch error:', err))
        .finally(() => {
            setTimeout(() => (window.location.href = '/'), 1800);
        });
    } else {
        document.cookie = 'guestPlayed=true; max-age=31536000; samesite=lax; path=/';
        setTimeout(() => (window.location.href = '/'), 1800);
    }
    
    if (result) result.innerText = '⏰ Time Over!';
}

function restartGame() {
    location.reload();
}

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 1600);
}

function showResultModal(message, type) {
    if (!resultModal) return;
    if (modalTitle) modalTitle.textContent = 'Match Result';
    if (modalBody) modalBody.textContent = message;
    resultModal.classList.remove('hidden');
}

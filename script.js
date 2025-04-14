class TreasureHuntGame {
    constructor() {
        this.mapSize = 10;
        this.totalTreasures = 5;
        this.treasuresFound = 0;
        this.gameStarted = false;
        this.startTime = null;
        this.timerInterval = null;
        this.treasureLocations = new Set();
        this.checkedCells = new Set();

        // DOM Elements
        this.gameMap = document.getElementById('game-map');
        this.startButton = document.getElementById('start-game');
        this.resetButton = document.getElementById('reset-game');
        this.treasuresFoundElement = document.getElementById('treasures-found');
        this.timerElement = document.getElementById('timer');
        this.totalTreasuresElement = document.getElementById('total-treasures');

        // Bind event listeners
        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.resetGame());

        // Initialize the game
        this.initializeMap();
    }

    initializeMap() {
        this.gameMap.innerHTML = '';
        for (let i = 0; i < this.mapSize; i++) {
            for (let j = 0; j < this.mapSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => this.handleCellClick(cell));
                this.gameMap.appendChild(cell);
            }
        }
    }

    placeTreasures() {
        this.treasureLocations.clear();
        while (this.treasureLocations.size < this.totalTreasures) {
            const row = Math.floor(Math.random() * this.mapSize);
            const col = Math.floor(Math.random() * this.mapSize);
            this.treasureLocations.add(`${row},${col}`);
        }
    }

    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.treasuresFound = 0;
        this.checkedCells.clear();
        this.treasuresFoundElement.textContent = '0';
        this.startTime = Date.now();
        this.startTimer();
        this.placeTreasures();
        
        // Reset all cells
        document.querySelectorAll('.cell').forEach(cell => {
            cell.className = 'cell';
        });
    }

    resetGame() {
        this.gameStarted = false;
        clearInterval(this.timerInterval);
        this.timerElement.textContent = '00:00';
        this.treasuresFound = 0;
        this.treasuresFoundElement.textContent = '0';
        this.checkedCells.clear();
        this.treasureLocations.clear();
        
        // Reset all cells
        document.querySelectorAll('.cell').forEach(cell => {
            cell.className = 'cell';
        });
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
            const seconds = (elapsedTime % 60).toString().padStart(2, '0');
            this.timerElement.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    handleCellClick(cell) {
        if (!this.gameStarted) return;

        const row = cell.dataset.row;
        const col = cell.dataset.col;
        const cellKey = `${row},${col}`;

        if (this.checkedCells.has(cellKey)) return;

        this.checkedCells.add(cellKey);

        if (this.treasureLocations.has(cellKey)) {
            cell.classList.add('treasure', 'found');
            this.treasuresFound++;
            this.treasuresFoundElement.textContent = this.treasuresFound;

            if (this.treasuresFound === this.totalTreasures) {
                clearInterval(this.timerInterval);
                setTimeout(() => {
                    alert(`Congratulations! You found all treasures in ${this.timerElement.textContent}!`);
                    this.resetGame();
                }, 500);
            }
        } else {
            cell.classList.add('checked');
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TreasureHuntGame();
}); 
// Multi-Game Center - Complete Game Collection
window.initMultiGames = function () {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    // Modal and UI elements
    const gameModal = document.getElementById('gameModal');
    const openGameBtn = document.getElementById('gamesButton');
    const closeGameBtn = gameModal?.querySelector('.game-close-btn');
    const fullscreenCloseBtn = document.getElementById('fullscreenCloseBtn');
    const gameSelection = document.getElementById('gameSelection');
    const gameInstructionsScreen = document.getElementById('gameInstructionsScreen');
    const gameContainer = document.getElementById('gameContainer');
    const backToMenu = document.getElementById('backToMenu');
    const currentGameTitle = document.getElementById('currentGameTitle');

    // Instruction screen elements
    const instructionGameTitle = document.getElementById('instructionGameTitle');
    const instructionGameIcon = document.getElementById('instructionGameIcon');
    const instructionText = document.getElementById('instructionText');
    const backToGamesBtn = document.getElementById('backToGamesBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');

    // Game elements
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas?.getContext('2d');
    const gameScore = document.getElementById('gameScore');
    const gameInstructions = document.getElementById('gameInstructions');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const finalScore = document.getElementById('finalScore');
    const restartGameBtn = document.getElementById('restartGameBtn');

    // Game state
    let currentGame = null;
    let gameRunning = false;
    let selectedDifficulty = null;
    let gameDifficulty = null; // Store the difficulty used for the current game session
    let gameSpeeds = { slow: 0.5, normal: 1, fast: 1.5 };
    let animationId;
    let gameData = {};
    let playerScore = 0;
    let resizeObserver = null;

    // Game configurations
    const gameConfigs = {
        dino: {
            title: 'Dino Jump',
            icon: '🦕',
            instructions: 'Help the dinosaur survive by jumping over obstacles!',
            detailedInstructions: [
                '🎯 Objective: Jump over cacti and birds to survive as long as possible',
                '⌨️ Controls: Press SPACEBAR or CLICK to make the dino jump',
                '🏃 Speed: The game gets faster as you progress',
                '⭐ Scoring: Points increase the longer you survive'
            ],
            colors: { bg: '#29272a', ground: '#444444', player: '#00ff9d', obstacle: '#ff79c6' }
        },
        snake: {
            title: 'Snake',
            icon: '🐍',
            instructions: 'Control the snake to eat apples and grow longer!',
            detailedInstructions: [
                '🎯 Objective: Eat red apples to grow your snake and score points',
                '⌨️ Controls: Use ARROW KEYS (↑↓←→) to change direction',
                '🚫 Avoid: Don\'t hit walls or your own body',
                '⭐ Scoring: Each apple gives you points and makes you longer'
            ],
            colors: { bg: '#29272a', snake: '#00ff9d', food: '#ff79c6', wall: '#bd93f9' }
        },
        tetris: {
            title: 'Tetris',
            icon: '🧱',
            instructions: 'Stack falling blocks to complete horizontal lines!',
            detailedInstructions: [
                '🎯 Objective: Clear horizontal lines by filling them completely',
                '⌨️ Controls: ← → to move, ↑ to rotate, ↓ to drop faster',
                '🧩 Strategy: Plan ahead to avoid stacking too high',
                '⭐ Scoring: More points for clearing multiple lines at once'
            ],
            colors: { bg: '#29272a', blocks: ['#00ff9d', '#ff79c6', '#8be9fd', '#bd93f9', '#ffeb3b', '#ffb86c', '#ff5555'] }
        },
        pong: {
            title: 'Pong',
            icon: '🏓',
            instructions: 'Classic paddle ball game - first to 10 points wins!',
            detailedInstructions: [
                '🎯 Objective: Hit the ball with your paddle to score against the computer',
                '⌨️ Controls: Use ↑ and ↓ arrow keys to move your paddle',
                '🏆 Win Condition: First player to reach 10 points wins',
                '⭐ Strategy: Try to hit the ball at different angles'
            ],
            colors: { bg: '#29272a', paddle: '#00ff9d', ball: '#ffeb3b', text: '#ececec' }
        },
        breakout: {
            title: 'Breakout',
            icon: '⚡',
            instructions: 'Use your paddle to break all the bricks!',
            detailedInstructions: [
                '🎯 Objective: Break all colored bricks by bouncing the ball',
                '⌨️ Controls: Use ← and → arrow keys to move your paddle',
                '🎱 Keep the ball in play by catching it with your paddle',
                '⭐ Scoring: Different colored bricks give different points'
            ],
            colors: { bg: '#29272a', paddle: '#00ff9d', ball: '#ffeb3b', brick: '#bd93f9' }
        },
        space: {
            title: 'Space Shooter',
            icon: '🚀',
            instructions: 'Pilot your spaceship and shoot down asteroids!',
            detailedInstructions: [
                '🎯 Objective: Destroy asteroids before they hit your spaceship',
                '⌨️ Controls: Arrow keys to move, SPACEBAR to shoot',
                '🛸 Avoid: Don\'t let asteroids crash into your ship',
                '⭐ Scoring: Larger asteroids give more points when destroyed'
            ],
            colors: { bg: '#29272a', player: '#00ff9d', bullet: '#ffeb3b', enemy: '#ff79c6' }
        }
    };

    // Initialize modal
    console.log('Initializing game modal...');
    console.log('Game modal element:', gameModal);
    console.log('Open game button:', openGameBtn);
    console.log('Game selection element:', gameSelection);
    console.log('Game container element:', gameContainer);

    openGameBtn?.addEventListener('click', openGameModal);
    closeGameBtn?.addEventListener('click', closeGameModal);
    backToMenu?.addEventListener('click', showGameSelection);
    restartGameBtn?.addEventListener('click', restartCurrentGame);
    fullscreenCloseBtn?.addEventListener('click', showGameSelection);
    backToGamesBtn?.addEventListener('click', showGameSelection);
    startGameBtn?.addEventListener('click', startSelectedGame);

    // Game over overlay click to dismiss
    gameOverOverlay?.addEventListener('click', (e) => {
        if (e.target === gameOverOverlay) {
            gameOverOverlay.style.display = 'none';
        }
    });

    // Difficulty selection event listeners
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selected class from all buttons
            difficultyButtons.forEach(b => b.classList.remove('selected'));
            // Add selected class to clicked button
            btn.classList.add('selected');
            selectedDifficulty = btn.dataset.speed;
            startGameBtn.disabled = false;
        });
    });

    // Handle ESC key for full-screen mode
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modalBody = document.querySelector('.game-modal-body');
            if (modalBody && modalBody.classList.contains('game-active')) {
                showGameSelection();
            }
        }
    });

    // Game selection - Handle both card and button clicks via Delegation
    // gameSelection is already defined at top of file
    if (gameSelection) {
        gameSelection.addEventListener('click', (e) => {
            const card = e.target.closest('.game-card');
            if (card) {
                e.preventDefault();
                e.stopPropagation();
                const gameType = card.dataset.game;
                console.log('Selected game via click:', gameType);
                showGameInstructions(gameType);
            }
        });
    }

    /* 
    // Removed static listeners in favor of delegation above
    document.querySelectorAll('.game-card').forEach(card => { ... });
    document.querySelectorAll('.select-game-btn').forEach(btn => { ... });
    */

    function resizeGameCanvas() {
        if (!gameCanvas) return;
        const wrapper = gameCanvas.parentElement;
        if (!wrapper) return;

        const width = Math.max(300, wrapper.clientWidth - 12);
        const height = Math.max(220, Math.min(wrapper.clientHeight - 16, Math.floor(width * 0.62)));

        if (gameCanvas.width !== width || gameCanvas.height !== height) {
            gameCanvas.width = width;
            gameCanvas.height = height;
        }
    }

    if (window.ResizeObserver && gameCanvas?.parentElement) {
        resizeObserver = new ResizeObserver(() => {
            if (gameModal?.classList.contains('is-open')) {
                resizeGameCanvas();
            }
        });
        resizeObserver.observe(gameCanvas.parentElement);
    }

    window.addEventListener('resize', resizeGameCanvas, { passive: true });

    function openGameModal() {
        console.log('Opening game modal...');
        if (gameModal) {
            gameModal.classList.add('is-open');
            gameModal.style.display = 'flex';
            document.body.classList.add('game-modal-open');

            // Ensure game container is hidden initially
            if (gameContainer) {
                gameContainer.style.display = 'none';
                gameContainer.style.opacity = '0';
                gameContainer.style.pointerEvents = 'none';
            }

            // Force show game selection menu immediately
            showGameSelection();
            resizeGameCanvas();

            console.log('Game modal opened successfully');
        } else {
            console.error('Game modal element not found! Check index.html for #gameModal');
        }
    }

    function closeGameModal() {
        console.log('Closing game modal...');
        gameModal.classList.remove('is-open');
        gameModal.style.display = 'none';
        document.body.classList.remove('game-modal-open');
        stopGame();
    }

    function showGameSelection() {
        console.log('Showing game selection menu...');

        // Remove game-active class from modal body
        const modalBody = document.querySelector('.game-modal-body');
        if (modalBody) {
            modalBody.classList.remove('game-active');
        }

        if (gameModal) {
            gameModal.dataset.view = 'selection';
        }

        // Stop current game first
        stopGame();

        // Remove side-by-side layout class
        const layoutContainer = document.querySelector('.game-layout-container');
        if (layoutContainer) {
            layoutContainer.classList.remove('show-instructions');
            layoutContainer.style.display = 'flex'; // Show the layout container
        }

        // Hide all other screens immediately
        if (gameContainer) {
            gameContainer.style.display = 'none';
        }

        if (gameInstructionsScreen) {
            gameInstructionsScreen.style.display = 'none';
        }

        // Show game selection menu immediately
        if (gameSelection) {
            gameSelection.style.display = 'block';
            gameSelection.style.opacity = '1';
            gameSelection.style.pointerEvents = 'auto';
            console.log('Game selection display set to block');
        } else {
            console.error('Game selection element not found');
        }

        // Reset game state
        currentGame = null;
        selectedDifficulty = null;
        gameDifficulty = null; // Reset stored game difficulty

        const controls = document.querySelector('.canvas-wrapper .game-touch-controls');
        if (controls) controls.classList.add('is-hidden');
    }

    function showGameInstructions(gameType) {
        console.log('Showing instructions for game:', gameType);
        currentGame = gameType;
        const config = gameConfigs[gameType];

        // Reset difficulty selection
        selectedDifficulty = null;
        startGameBtn.disabled = true;
        difficultyButtons.forEach(btn => btn.classList.remove('selected'));

        // Update instruction screen content
        instructionGameTitle.textContent = config.title;
        instructionGameIcon.textContent = config.icon;
        instructionText.innerHTML = config.detailedInstructions.map(instruction =>
            `<div class="instruction-item">${instruction}</div>`
        ).join('');

        // Add the show-instructions class to enable side-by-side layout
        const layoutContainer = document.querySelector('.game-layout-container');
        if (layoutContainer) {
            layoutContainer.classList.add('show-instructions');
        }

        if (gameModal) {
            gameModal.dataset.view = 'instructions';
        }

        // Show instructions screen
        if (gameInstructionsScreen) {
            gameInstructionsScreen.style.display = 'block';
        }

        // Hide game selection menu
        const gameSelection = document.getElementById('gameSelection');
        if (gameSelection) {
            gameSelection.style.display = 'none';
        }
    }

    function startSelectedGame() {
        console.log('Starting game with difficulty:', selectedDifficulty);

        // Store the difficulty for this game session
        if (selectedDifficulty) {
            gameDifficulty = selectedDifficulty;
        }

        // Immediate transition: hide instructions and start game
        if (gameInstructionsScreen) {
            gameInstructionsScreen.style.display = 'none';
        }

        // Start the actual game immediately
        startGame(currentGame);
    }

    function getDifficultyMultiplier() {
        // Use gameDifficulty if available (during restart), otherwise use selectedDifficulty
        const difficulty = gameDifficulty || selectedDifficulty || 'normal';
        const multiplier = gameSpeeds[difficulty] || 1;
        console.log(`Using difficulty: ${difficulty}, Speed multiplier: ${multiplier}`);
        return multiplier;
    }

    function startGame(gameType) {
        console.log('Starting game:', gameType);
        currentGame = gameType;
        const config = gameConfigs[gameType];

        // Add game-active class to modal body
        const modalBody = document.querySelector('.game-modal-body');
        if (modalBody) {
            modalBody.classList.add('game-active');
        }

        if (gameModal) {
            gameModal.dataset.view = 'playing';
        }

        // Remove side-by-side layout class when starting game
        const layoutContainer = document.querySelector('.game-layout-container');
        if (layoutContainer) {
            layoutContainer.classList.remove('show-instructions');
            // Keep layout container visible (it contains the game canvas)
            layoutContainer.style.display = 'flex';
        }

        // Ensure all previous screens are hidden
        if (gameSelection) {
            gameSelection.style.display = 'none';
        }
        if (gameInstructionsScreen) {
            gameInstructionsScreen.style.display = 'none';
        }

        // Show game container immediately
        if (gameContainer) {
            gameContainer.style.display = 'flex';
            gameContainer.style.opacity = '1';
            gameContainer.style.pointerEvents = 'auto';
            console.log('Game container shown immediately');
        }

        resizeGameCanvas();

        // Update game UI
        if (currentGameTitle) {
            currentGameTitle.textContent = config.title;
        }
        if (gameInstructions) {
            gameInstructions.textContent = config.instructions;
        }

        // Reset game state
        playerScore = 0;
        updateScore();

        if (gameOverOverlay) {
            gameOverOverlay.style.display = 'none';
        }
        if (restartGameBtn) {
            restartGameBtn.style.display = 'none';
        }

        // Initialize specific game after transition
        setTimeout(() => {
            initializeGame(gameType);
        }, 100);
    }

    function initializeGame(gameType) {
        gameRunning = true;
        gameData = {};
        resizeGameCanvas();

        switch (gameType) {
            case 'dino':
                initDinoGame();
                break;
            case 'snake':
                initSnakeGame();
                break;
            case 'tetris':
                initTetrisGame();
                break;
            case 'pong':
                initPongGame();
                break;
            case 'breakout':
                initBreakoutGame();
                break;
            case 'space':
                initSpaceGame();
                break;
        }

        gameLoop();
        setupTouchControls();
    }

    function setTouchKey(key, active) {
        keys[key] = active;
        if (active) {
            document.dispatchEvent(new KeyboardEvent('keydown', { key }));
        } else {
            document.dispatchEvent(new KeyboardEvent('keyup', { key }));
        }
    }

    function setupTouchControls() {
        const wrapper = document.querySelector('.canvas-wrapper');
        if (!wrapper || !isTouchDevice) return;

        let controls = wrapper.querySelector('.game-touch-controls');
        if (!controls) {
            controls = document.createElement('div');
            controls.className = 'game-touch-controls';
            controls.innerHTML = `
                <div class="touch-dpad">
                    <button class="touch-btn up" data-key="ArrowUp">▲</button>
                    <button class="touch-btn left" data-key="ArrowLeft">◀</button>
                    <button class="touch-btn down" data-key="ArrowDown">▼</button>
                    <button class="touch-btn right" data-key="ArrowRight">▶</button>
                </div>
                <div class="touch-actions">
                    <button class="touch-btn action" data-key=" ">A</button>
                </div>
            `;
            wrapper.appendChild(controls);

            controls.querySelectorAll('.touch-btn').forEach(btn => {
                const key = btn.dataset.key;
                const press = (e) => {
                    e.preventDefault();
                    setTouchKey(key, true);
                };
                const release = (e) => {
                    e.preventDefault();
                    setTouchKey(key, false);
                };

                btn.addEventListener('touchstart', press, { passive: false });
                btn.addEventListener('touchend', release, { passive: false });
                btn.addEventListener('touchcancel', release, { passive: false });
            });
        }

        controls.classList.toggle('is-hidden', !gameRunning);
    }

    // DINO GAME
    function initDinoGame() {
        const speedMultiplier = getDifficultyMultiplier();
        gameData = {
            dino: { x: 50, y: gameCanvas.height - 70, width: 30, height: 30, jumping: false, velocityY: 0, speed: 4 * speedMultiplier },
            obstacles: [],
            ground: gameCanvas.height - 40,
            gameSpeed: 2 * speedMultiplier
        };
    }

    function updateDinoGame() {
        const { dino, obstacles } = gameData;

        // Gravity
        if (dino.jumping) {
            dino.y -= dino.velocityY;
            dino.velocityY -= 0.8;
            if (dino.y >= gameData.ground - dino.height) {
                dino.y = gameData.ground - dino.height;
                dino.jumping = false;
                dino.velocityY = 0;
            }
        }

        // Add obstacles
        if (Math.random() < 0.01 * getDifficultyMultiplier()) {
            obstacles.push({ x: gameCanvas.width, y: gameData.ground - 20, width: 20, height: 20 });
        }

        // Move obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= gameData.gameSpeed;
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                playerScore += 10;
            } else if (checkCollision(dino, obstacles[i])) {
                endGame();
                return;
            }
        }

        playerScore += 0.1;
    }

    function drawDinoGame() {
        const config = gameConfigs.dino;
        const { dino, obstacles } = gameData;

        // Clear canvas with sky
        ctx.fillStyle = config.colors.bg;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw ground
        ctx.fillStyle = config.colors.ground;
        ctx.fillRect(0, gameData.ground, gameCanvas.width, gameCanvas.height - gameData.ground);

        // Draw clouds
        drawCloud(100, 50, 60, 30);
        drawCloud(300, 80, 80, 40);

        // Draw dino
        ctx.fillStyle = config.colors.player;
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

        // Draw obstacles
        ctx.fillStyle = config.colors.obstacle;
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    // SNAKE GAME
    function initSnakeGame() {
        const speedMultiplier = getDifficultyMultiplier();
        const gridSize = 20;
        gameData = {
            snake: [{ x: 200, y: 200 }],
            direction: { x: gridSize, y: 0 },
            food: { x: 0, y: 0 },
            gridSize: gridSize,
            updateInterval: Math.max(50, 150 / speedMultiplier),
            lastUpdate: 0
        };
        generateFood();
    }

    function updateSnakeGame() {
        const currentTime = Date.now();
        if (currentTime - gameData.lastUpdate < gameData.updateInterval) {
            return;
        }
        gameData.lastUpdate = currentTime;

        const { snake, direction, food, gridSize } = gameData;
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // Wall collision
        if (head.x < 0 || head.x >= gameCanvas.width || head.y < 0 || head.y >= gameCanvas.height) {
            endGame();
            return;
        }

        // Self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endGame();
            return;
        }

        snake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
            playerScore += 100;
            generateFood();
        } else {
            snake.pop();
        }
    }

    function drawSnakeGame() {
        const config = gameConfigs.snake;
        const { snake, food } = gameData;

        // Clear canvas
        ctx.fillStyle = config.colors.bg;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw snake
        ctx.fillStyle = config.colors.snake;
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, gameData.gridSize, gameData.gridSize);
        });

        // Draw food
        ctx.fillStyle = config.colors.food;
        ctx.fillRect(food.x, food.y, gameData.gridSize, gameData.gridSize);
    }

    function generateFood() {
        const { gridSize, snake } = gameData;
        do {
            gameData.food = {
                x: Math.floor(Math.random() * gameCanvas.width / gridSize) * gridSize,
                y: Math.floor(Math.random() * gameCanvas.height / gridSize) * gridSize
            };
        } while (snake.some(segment => segment.x === gameData.food.x && segment.y === gameData.food.y));
    }

    // TETRIS GAME
    function initTetrisGame() {
        const speedMultiplier = getDifficultyMultiplier();
        gameData = {
            board: Array(20).fill().map(() => Array(10).fill(0)),
            currentPiece: null,
            nextPiece: null,
            dropTime: 0,
            dropInterval: Math.max(200, 1000 / speedMultiplier) // Faster drop for higher difficulty
        };
        spawnPiece();
    }

    function updateTetrisGame() {
        gameData.dropTime += 16; // Assuming 60fps

        if (gameData.dropTime > gameData.dropInterval) {
            if (!movePiece(0, 1)) {
                placePiece();
                clearLines();
                spawnPiece();
                if (isGameOver()) {
                    endGame();
                    return;
                }
            }
            gameData.dropTime = 0;
        }
    }

    function drawTetrisGame() {
        const config = gameConfigs.tetris;
        const { board, currentPiece } = gameData;
        const blockSize = Math.min(gameCanvas.width / 10, gameCanvas.height / 20);

        // Clear canvas
        ctx.fillStyle = config.colors.bg;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw board
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                if (board[y][x]) {
                    ctx.fillStyle = config.colors.blocks[board[y][x] - 1];
                    ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
                }
            }
        }

        // Draw current piece
        if (currentPiece) {
            ctx.fillStyle = config.colors.blocks[currentPiece.color];
            currentPiece.shape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        ctx.fillRect((currentPiece.x + x) * blockSize, (currentPiece.y + y) * blockSize, blockSize - 1, blockSize - 1);
                    }
                });
            });
        }
    }

    // PONG GAME
    function initPongGame() {
        const speedMultiplier = getDifficultyMultiplier();
        gameData = {
            leftPaddle: { x: 20, y: gameCanvas.height / 2 - 50, width: 10, height: 100, speed: 5 * speedMultiplier },
            rightPaddle: { x: gameCanvas.width - 30, y: gameCanvas.height / 2 - 50, width: 10, height: 100, speed: 5 * speedMultiplier },
            ball: { x: gameCanvas.width / 2, y: gameCanvas.height / 2, dx: 5 * speedMultiplier, dy: 3 * speedMultiplier, radius: 8 },
            leftScore: 0,
            rightScore: 0,
            aiDifficulty: speedMultiplier // Store AI difficulty
        };
    }

    function updatePongGame() {
        const { leftPaddle, rightPaddle, ball } = gameData;

        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with top/bottom
        if (ball.y <= ball.radius || ball.y >= gameCanvas.height - ball.radius) {
            ball.dy = -ball.dy;
        }

        // Paddle collisions
        if (ball.x <= leftPaddle.x + leftPaddle.width &&
            ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + leftPaddle.height) {
            ball.dx = -ball.dx;
        }

        if (ball.x >= rightPaddle.x &&
            ball.y >= rightPaddle.y && ball.y <= rightPaddle.y + rightPaddle.height) {
            ball.dx = -ball.dx;
        }

        // Score
        if (ball.x < 0) {
            gameData.rightScore++;
            resetBall();
        } else if (ball.x > gameCanvas.width) {
            gameData.leftScore++;
            resetBall();
        }

        playerScore = gameData.leftScore * 100;

        // AI for right paddle with difficulty-based behavior
        const paddleCenter = rightPaddle.y + rightPaddle.height / 2;
        const aiReactionZone = 35 / gameData.aiDifficulty; // Smaller zone = harder AI
        const aiSpeed = rightPaddle.speed * (0.7 + (gameData.aiDifficulty * 0.2)); // Faster on higher difficulty

        if (paddleCenter < ball.y - aiReactionZone) {
            rightPaddle.y = Math.min(gameCanvas.height - rightPaddle.height, rightPaddle.y + aiSpeed);
        } else if (paddleCenter > ball.y + aiReactionZone) {
            rightPaddle.y = Math.max(0, rightPaddle.y - aiSpeed);
        }

        // Check win condition
        if (gameData.leftScore >= 10 || gameData.rightScore >= 10) {
            endGame();
        }
    }

    function drawPongGame() {
        const config = gameConfigs.pong;
        const { leftPaddle, rightPaddle, ball } = gameData;

        // Clear canvas
        ctx.fillStyle = config.colors.bg;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw paddles
        ctx.fillStyle = config.colors.paddle;
        ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
        ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

        // Draw ball
        ctx.fillStyle = config.colors.ball;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw scores
        ctx.fillStyle = config.colors.text;
        ctx.font = '24px Arial';
        ctx.fillText(gameData.leftScore, gameCanvas.width / 4, 40);
        ctx.fillText(gameData.rightScore, 3 * gameCanvas.width / 4, 40);

        // Draw center line
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(gameCanvas.width / 2, 0);
        ctx.lineTo(gameCanvas.width / 2, gameCanvas.height);
        ctx.strokeStyle = config.colors.text;
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // BREAKOUT GAME
    function initBreakoutGame() {
        const speedMultiplier = getDifficultyMultiplier();
        const bricks = [];
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 10; col++) {
                bricks.push({
                    x: col * 60 + 5,
                    y: row * 20 + 30,
                    width: 55,
                    height: 15,
                    active: true
                });
            }
        }

        gameData = {
            paddle: { x: gameCanvas.width / 2 - 50, y: gameCanvas.height - 30, width: 100, height: 10, speed: 8 * speedMultiplier },
            ball: { x: gameCanvas.width / 2, y: gameCanvas.height - 50, dx: 4 * speedMultiplier, dy: -4 * speedMultiplier, radius: 8 },
            bricks: bricks
        };
    }

    function updateBreakoutGame() {
        const { paddle, ball, bricks } = gameData;

        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with walls
        if (ball.x <= ball.radius || ball.x >= gameCanvas.width - ball.radius) {
            ball.dx = -ball.dx;
        }
        if (ball.y <= ball.radius) {
            ball.dy = -ball.dy;
        }

        // Ball collision with paddle
        if (ball.y + ball.radius >= paddle.y &&
            ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        }

        // Ball collision with bricks
        bricks.forEach(brick => {
            if (brick.active &&
                ball.x >= brick.x && ball.x <= brick.x + brick.width &&
                ball.y >= brick.y && ball.y <= brick.y + brick.height) {
                ball.dy = -ball.dy;
                brick.active = false;
                playerScore += 50;
            }
        });

        // Check win condition
        if (bricks.every(brick => !brick.active)) {
            endGame();
        }

        // Check lose condition
        if (ball.y > gameCanvas.height) {
            endGame();
        }
    }

    function drawBreakoutGame() {
        const config = gameConfigs.breakout;
        const { paddle, ball, bricks } = gameData;

        // Clear canvas
        ctx.fillStyle = config.colors.bg;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw paddle
        ctx.fillStyle = config.colors.paddle;
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

        // Draw ball
        ctx.fillStyle = config.colors.ball;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw bricks
        ctx.fillStyle = config.colors.brick;
        bricks.forEach(brick => {
            if (brick.active) {
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });
    }

    // SPACE SHOOTER GAME
    function initSpaceGame() {
        const speedMultiplier = getDifficultyMultiplier();
        gameData = {
            player: { x: gameCanvas.width / 2 - 15, y: gameCanvas.height - 60, width: 30, height: 30, speed: 6 * speedMultiplier },
            bullets: [],
            enemies: [],
            stars: Array(50).fill().map(() => ({
                x: Math.random() * gameCanvas.width,
                y: Math.random() * gameCanvas.height,
                speed: Math.random() * 2 + 1
            }))
        };
    }

    function updateSpaceGame() {
        const { player, bullets, enemies, stars } = gameData;

        // Move bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].y -= 8;
            if (bullets[i].y < 0) {
                bullets.splice(i, 1);
            }
        }

        // Move enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].y += enemies[i].speed;
            if (enemies[i].y > gameCanvas.height) {
                enemies.splice(i, 1);
            }
        }

        // Spawn enemies
        if (Math.random() < 0.02 * getDifficultyMultiplier()) {
            enemies.push({
                x: Math.random() * (gameCanvas.width - 30),
                y: -30,
                width: 30,
                height: 30,
                speed: (Math.random() * 3 + 2) * getDifficultyMultiplier()
            });
        }

        // Check bullet-enemy collisions
        for (let i = bullets.length - 1; i >= 0; i--) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (checkCollision(bullets[i], enemies[j])) {
                    bullets.splice(i, 1);
                    enemies.splice(j, 1);
                    playerScore += 100;
                    break;
                }
            }
        }

        // Check player-enemy collisions
        enemies.forEach(enemy => {
            if (checkCollision(player, enemy)) {
                endGame();
            }
        });

        // Update stars
        stars.forEach(star => {
            star.y += star.speed;
            if (star.y > gameCanvas.height) {
                star.y = 0;
                star.x = Math.random() * gameCanvas.width;
            }
        });
    }

    function drawSpaceGame() {
        const config = gameConfigs.space;
        const { player, bullets, enemies, stars } = gameData;

        // Clear canvas
        ctx.fillStyle = config.colors.bg;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw stars
        ctx.fillStyle = '#fff';
        stars.forEach(star => {
            ctx.fillRect(star.x, star.y, 2, 2);
        });

        // Draw player
        ctx.fillStyle = config.colors.player;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw bullets
        ctx.fillStyle = config.colors.bullet;
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        // Draw enemies
        ctx.fillStyle = config.colors.enemy;
        enemies.forEach(enemy => {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    // UTILITY FUNCTIONS
    function gameLoop() {
        if (!gameRunning) return;

        // Handle continuous input for smooth movement
        handleContinuousInput();

        // Update current game
        switch (currentGame) {
            case 'dino':
                updateDinoGame();
                drawDinoGame();
                break;
            case 'snake':
                updateSnakeGame();
                drawSnakeGame();
                break;
            case 'tetris':
                updateTetrisGame();
                drawTetrisGame();
                break;
            case 'pong':
                updatePongGame();
                drawPongGame();
                break;
            case 'breakout':
                updateBreakoutGame();
                drawBreakoutGame();
                break;
            case 'space':
                updateSpaceGame();
                drawSpaceGame();
                break;
        }

        updateScore();
        animationId = requestAnimationFrame(gameLoop);
    }

    function checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y;
    }

    function drawCloud(x, y, width, height) {
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(x, y, width / 3, 0, Math.PI * 2);
        ctx.arc(x + width / 3, y, width / 3, 0, Math.PI * 2);
        ctx.arc(x + 2 * width / 3, y, width / 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    function updateScore() {
        if (gameScore) {
            gameScore.textContent = `Score: ${Math.floor(playerScore)}`;
        }
    }

    function endGame() {
        gameRunning = false;

        // Show game over overlay
        if (gameOverOverlay) {
            gameOverOverlay.style.display = 'flex';
        }

        // Update final score in the overlay
        if (finalScore) {
            finalScore.textContent = `Score: ${Math.floor(playerScore)}`;
        }

        // Show restart button in controls
        if (restartGameBtn) {
            restartGameBtn.style.display = 'block';
        }

        // Save score (simplified)
        console.log(`Game Over! Final Score: ${Math.floor(playerScore)} in ${currentGame}`);
    }

    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }

        const controls = document.querySelector('.canvas-wrapper .game-touch-controls');
        if (controls) controls.classList.add('is-hidden');
    }

    function restartCurrentGame() {
        if (currentGame) {
            startGame(currentGame);
        }
    }

    // KEYBOARD CONTROLS
    const keys = {};

    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;

        if (!gameRunning) return;

        switch (currentGame) {
            case 'dino':
                if (e.key === ' ' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (!gameData.dino.jumping) {
                        gameData.dino.jumping = true;
                        gameData.dino.velocityY = 15;
                    }
                }
                break;

            case 'snake':
                const gridSize = gameData.gridSize;
                const currentDirection = gameData.direction;
                let newDirection = null;

                switch (e.key) {
                    case 'ArrowUp':
                        // Prevent reversing into self
                        if (currentDirection.y === 0) {
                            newDirection = { x: 0, y: -gridSize };
                        }
                        break;
                    case 'ArrowDown':
                        if (currentDirection.y === 0) {
                            newDirection = { x: 0, y: gridSize };
                        }
                        break;
                    case 'ArrowLeft':
                        if (currentDirection.x === 0) {
                            newDirection = { x: -gridSize, y: 0 };
                        }
                        break;
                    case 'ArrowRight':
                        if (currentDirection.x === 0) {
                            newDirection = { x: gridSize, y: 0 };
                        }
                        break;
                }

                if (newDirection) {
                    gameData.direction = newDirection;
                }
                break;

            case 'tetris':
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        movePiece(-1, 0);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        movePiece(1, 0);
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        movePiece(0, 1);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        rotatePiece();
                        break;
                }
                break;

            case 'pong':
                // Continuous movement is now handled in handleContinuousInput()
                break;

            case 'breakout':
                // Continuous movement is now handled in handleContinuousInput()
                break;

            case 'space':
                // Movement is now handled in handleContinuousInput()
                // Only handle shooting here
                if (e.key === ' ') {
                    e.preventDefault();
                    gameData.bullets.push({
                        x: gameData.player.x + gameData.player.width / 2 - 2,
                        y: gameData.player.y,
                        width: 4,
                        height: 10
                    });
                }
                break;
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    // MOUSE/CLICK CONTROLS
    gameCanvas?.addEventListener('click', (e) => {
        if (!gameRunning) return;

        switch (currentGame) {
            case 'dino':
                // Click to jump
                if (!gameData.dino.jumping) {
                    gameData.dino.jumping = true;
                    gameData.dino.velocityY = 15;
                }
                break;

            case 'space':
                // Click to shoot
                gameData.bullets.push({
                    x: gameData.player.x + gameData.player.width / 2 - 2,
                    y: gameData.player.y,
                    width: 4,
                    height: 10
                });
                break;
        }
    });

    // CONTINUOUS KEY HANDLING for smooth movement
    function handleContinuousInput() {
        if (!gameRunning) return;

        switch (currentGame) {
            case 'breakout':
                if (keys['ArrowLeft']) {
                    gameData.paddle.x = Math.max(0, gameData.paddle.x - gameData.paddle.speed);
                }
                if (keys['ArrowRight']) {
                    gameData.paddle.x = Math.min(gameCanvas.width - gameData.paddle.width, gameData.paddle.x + gameData.paddle.speed);
                }
                break;

            case 'space':
                if (keys['ArrowLeft']) {
                    gameData.player.x = Math.max(0, gameData.player.x - gameData.player.speed);
                }
                if (keys['ArrowRight']) {
                    gameData.player.x = Math.min(gameCanvas.width - gameData.player.width, gameData.player.x + gameData.player.speed);
                }
                if (keys['ArrowUp']) {
                    gameData.player.y = Math.max(0, gameData.player.y - gameData.player.speed);
                }
                if (keys['ArrowDown']) {
                    gameData.player.y = Math.min(gameCanvas.height - gameData.player.height, gameData.player.y + gameData.player.speed);
                }
                break;

            case 'pong':
                if (keys['ArrowUp']) {
                    gameData.leftPaddle.y = Math.max(0, gameData.leftPaddle.y - gameData.leftPaddle.speed);
                }
                if (keys['ArrowDown']) {
                    gameData.leftPaddle.y = Math.min(gameCanvas.height - gameData.leftPaddle.height, gameData.leftPaddle.y + gameData.leftPaddle.speed);
                }
                break;
        }
    }

    // ADDITIONAL HELPER FUNCTIONS
    function resetBall() {
        const speedMultiplier = getDifficultyMultiplier();
        gameData.ball = {
            x: gameCanvas.width / 2,
            y: gameCanvas.height / 2,
            dx: (Math.random() > 0.5 ? 1 : -1) * 5 * speedMultiplier,
            dy: (Math.random() > 0.5 ? 1 : -1) * 3 * speedMultiplier,
            radius: 8
        };
    }

    function spawnPiece() {
        const pieces = [
            { shape: [[1, 1, 1, 1]], color: 0 }, // I
            { shape: [[1, 1], [1, 1]], color: 1 }, // O
            { shape: [[0, 1, 0], [1, 1, 1]], color: 2 }, // T
            { shape: [[0, 1, 1], [1, 1, 0]], color: 3 }, // S
            { shape: [[1, 1, 0], [0, 1, 1]], color: 4 }, // Z
            { shape: [[1, 0, 0], [1, 1, 1]], color: 5 }, // J
            { shape: [[0, 0, 1], [1, 1, 1]], color: 6 }  // L
        ];

        const piece = pieces[Math.floor(Math.random() * pieces.length)];
        gameData.currentPiece = {
            shape: piece.shape,
            color: piece.color,
            x: Math.floor(gameData.board[0].length / 2) - Math.floor(piece.shape[0].length / 2),
            y: 0
        };
    }

    function movePiece(dx, dy) {
        gameData.currentPiece.x += dx;
        gameData.currentPiece.y += dy;

        if (!isValidMove()) {
            gameData.currentPiece.x -= dx;
            gameData.currentPiece.y -= dy;
            return false;
        }
        return true;
    }

    function rotatePiece() {
        const oldShape = gameData.currentPiece.shape;
        const newShape = oldShape[0].map((_, colIndex) =>
            oldShape.map(row => row[colIndex]).reverse()
        );

        gameData.currentPiece.shape = newShape;
        if (!isValidMove()) {
            gameData.currentPiece.shape = oldShape;
        }
    }

    function isValidMove() {
        const { currentPiece, board } = gameData;

        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const newX = currentPiece.x + x;
                    const newY = currentPiece.y + y;

                    if (newX < 0 || newX >= board[0].length || newY >= board.length) {
                        return false;
                    }

                    if (newY >= 0 && board[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function placePiece() {
        const { currentPiece, board } = gameData;

        currentPiece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    if (currentPiece.y + y >= 0) {
                        board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color + 1;
                    }
                }
            });
        });
    }

    function clearLines() {
        const { board } = gameData;

        for (let y = board.length - 1; y >= 0; y--) {
            if (board[y].every(cell => cell !== 0)) {
                board.splice(y, 1);
                board.unshift(Array(10).fill(0));
                playerScore += 1000;
                y++; // Check the same line again
            }
        }
    }

    function isGameOver() {
        return gameData.board[0].some(cell => cell !== 0);
    }

    // Initialize game modal on page load
    console.log('Multi-Game Center initialized successfully!');
    if (gameSelection) {
        gameSelection.style.display = 'block';
        console.log('Game selection menu is ready');
    }
    if (gameContainer) {
        gameContainer.style.display = 'none';
        console.log('Game container is hidden');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Game variables
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let canFlip = true;
    
    // DOM elements
    const gameBoard = document.getElementById('game-board');
    const movesElement = document.getElementById('moves');
    const pairsElement = document.getElementById('pairs');
    const messageElement = document.getElementById('message');
    const restartButton = document.getElementById('restart-btn');
    
    // Letters for card pairs (A-H, each twice)
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    // Initialize the game
    initGame();
    
    // Event listener for restart button
    restartButton.addEventListener('click', initGame);
    
    function initGame() {
        // Reset game variables
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        canFlip = true;
        
        // Update UI
        movesElement.textContent = moves;
        pairsElement.textContent = matchedPairs;
        messageElement.textContent = '';
        messageElement.classList.remove('win-message');
        
        // Clear the game board
        gameBoard.innerHTML = '';
        
        // Create shuffled array of letters (pairs)
        const cardValues = [...letters, ...letters];
        shuffleArray(cardValues);
        
        // Create cards and add them to the game board
        cardValues.forEach((letter, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.value = letter;
            card.dataset.index = index;
            
            // Create card inner container (for flipping)
            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');
            
            // Create front face (question mark)
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.textContent = '?';
            
            // Create back face (letter)
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');
            cardBack.textContent = letter;
            
            // Puts together card
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            
            card.addEventListener('click', () => flipCard(card));
            
            gameBoard.appendChild(card);
            cards.push(card);
        });
    }
    
    function flipCard(card) {
        // Check if card can be flipped
        if (!canFlip || flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        // Flip the card
        card.classList.add('flipped');
        flippedCards.push(card);
        
        // Check if two cards are flipped
        if (flippedCards.length === 2) {
            moves++;
            movesElement.textContent = moves;
            
            // Check if the cards match
            if (flippedCards[0].dataset.value === flippedCards[1].dataset.value) {
                // Cards match
                matchedPairs++;
                pairsElement.textContent = matchedPairs;
                
                flippedCards.forEach(card => {
                    card.classList.add('matched');
                });
                
                flippedCards = [];
                
                // Check if all pairs are found
                if (matchedPairs === letters.length) {
                    // Game won
                    messageElement.textContent = 'Congratulations! You found all pairs!';
                    messageElement.classList.add('win-message');
                }
            } else {
                // Cards don't match - flip them back after delay
                canFlip = false;
                setTimeout(() => {
                    flippedCards.forEach(card => {
                        card.classList.remove('flipped');
                    });
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }
    
    // Fisher-Yates algorithm to shuffle cards
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
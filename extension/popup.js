// EZ 21 Chrome Extension - Converted from React App
class BlackjackExtension {
  constructor() {
    this.gameState = {
      dealerCards: [],
      playerCards: [],
      handCount: 0
    };
    
    this.dealerSlots = [null];
    this.playerSlots = [null, null];
    this.currentSlot = null;
    this.selectedAmount = '5.00';
    this.paypalDonation = new window.PayPalDonation();
    
    this.CARD_VALUES = [
      { value: 1, display: 'A' },
      { value: 2, display: '2' },
      { value: 3, display: '3' },
      { value: 4, display: '4' },
      { value: 5, display: '5' },
      { value: 6, display: '6' },
      { value: 7, display: '7' },
      { value: 8, display: '8' },
      { value: 9, display: '9' },
      { value: 10, display: '10' },
      { value: 10, display: 'J' },
      { value: 10, display: 'Q' },
      { value: 10, display: 'K' }
    ];
    
    this.init();
  }
  
  init() {
    this.loadGameStats();
    this.setupEventListeners();
    this.renderCards();
    this.updateDisplay();
  }
  
  setupEventListeners() {
    // Card slot clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('card-slot')) {
        const section = e.target.dataset.section;
        const index = parseInt(e.target.dataset.index);
        
        if (e.target.classList.contains('filled')) {
          this.removeCard(section, index);
        } else {
          this.selectCard(section, index);
        }
      }
    });
    
    // Reset button
    document.getElementById('reset-btn').addEventListener('click', () => {
      this.resetHand();
    });
    
    // Deal again button
    document.getElementById('deal-btn').addEventListener('click', () => {
      this.dealAgain();
    });
    
    // Modal cancel
    document.getElementById('cancel-btn').addEventListener('click', () => {
      this.hideModal();
    });
    
    // Modal backdrop click
    document.getElementById('card-modal').addEventListener('click', (e) => {
      if (e.target.id === 'card-modal') {
        this.hideModal();
      }
    });
    
    // Support button
    document.getElementById('support-btn').addEventListener('click', () => {
      this.showDonationModal();
    });
    
    // Donation modal events
    document.getElementById('donation-cancel-btn').addEventListener('click', () => {
      this.hideDonationModal();
    });
    
    document.getElementById('donation-modal').addEventListener('click', (e) => {
      if (e.target.id === 'donation-modal') {
        this.hideDonationModal();
      }
    });
    
    // Amount selection
    document.querySelectorAll('.amount-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectAmount(e.target.dataset.amount);
      });
    });
    
    // Method tabs
    document.querySelectorAll('.method-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.switchMethod(e.target.dataset.method);
      });
    });
    
    // Crypto copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.copyToClipboard(e.target.dataset.address, e.target);
      });
    });
  }
  
  selectCard(section, index) {
    this.currentSlot = { section, index };
    this.showModal();
  }
  
  showModal() {
    const modal = document.getElementById('card-modal');
    const cardGrid = document.getElementById('card-grid');
    
    // Clear existing cards
    cardGrid.innerHTML = '';
    
    // Add card buttons
    this.CARD_VALUES.forEach(card => {
      const button = document.createElement('button');
      button.className = 'card-btn';
      button.textContent = card.display;
      button.addEventListener('click', () => {
        this.selectCardValue(card);
      });
      cardGrid.appendChild(button);
    });
    
    modal.classList.add('show');
  }
  
  hideModal() {
    document.getElementById('card-modal').classList.remove('show');
    this.currentSlot = null;
  }
  
  selectCardValue(card) {
    if (!this.currentSlot) return;
    
    const { section, index } = this.currentSlot;
    
    if (section === 'dealer') {
      this.gameState.dealerCards[index] = card.value;
      this.dealerSlots[index] = card.display;
    } else {
      this.gameState.playerCards[index] = card.value;
      this.playerSlots[index] = card.display;
    }
    
    this.hideModal();
    this.renderCards();
    this.updateDisplay();
    this.checkForAutoAddSlot();
  }
  
  removeCard(section, index) {
    if (section === 'dealer') {
      this.gameState.dealerCards.splice(index, 1);
      this.dealerSlots.splice(index, 1);
      
      if (this.dealerSlots.length === 0) {
        this.dealerSlots = [null];
      }
    } else {
      this.gameState.playerCards.splice(index, 1);
      this.playerSlots.splice(index, 1);
      
      if (this.playerSlots.length < 2) {
        this.playerSlots.push(null);
      }
    }
    
    this.renderCards();
    this.updateDisplay();
  }
  
  renderCards() {
    // Render dealer cards
    const dealerContainer = document.getElementById('dealer-cards');
    dealerContainer.innerHTML = '';
    
    this.dealerSlots.forEach((slot, index) => {
      const cardSlot = document.createElement('div');
      cardSlot.className = 'card-slot dealer';
      cardSlot.dataset.section = 'dealer';
      cardSlot.dataset.index = index;
      cardSlot.textContent = slot || '?';
      
      if (slot) {
        cardSlot.classList.add('filled');
      }
      
      dealerContainer.appendChild(cardSlot);
    });
    
    // Render player cards
    const playerContainer = document.getElementById('player-cards');
    playerContainer.innerHTML = '';
    
    this.playerSlots.forEach((slot, index) => {
      const cardSlot = document.createElement('div');
      cardSlot.className = 'card-slot';
      cardSlot.dataset.section = 'player';
      cardSlot.dataset.index = index;
      cardSlot.textContent = slot || '?';
      
      if (slot) {
        cardSlot.classList.add('filled');
      }
      
      playerContainer.appendChild(cardSlot);
    });
  }
  
  updateDisplay() {
    // Update hand value
    const handValue = this.calculateHandValue(this.gameState.playerCards);
    const handValueElement = document.getElementById('hand-value');
    handValueElement.textContent = handValue;
    handValueElement.className = 'hand-value-number';
    
    if (handValue > 21) {
      handValueElement.textContent += ' (BUST)';
      handValueElement.classList.add('bust');
    } else if (handValue === 21) {
      handValueElement.textContent += ' (BLACKJACK)';
      handValueElement.classList.add('blackjack');
    }
    
    // Update probabilities
    const probabilities = this.calculateBlackjackProbabilities();
    
    document.getElementById('recommendation').textContent = probabilities.recommendation;
    document.getElementById('recommendation').className = `recommendation ${probabilities.recommendationColor}`;
    
    document.getElementById('win-prob').textContent = `${probabilities.winProbability}%`;
    document.getElementById('bust-prob').textContent = `${probabilities.bustProbability}%`;
  }
  
  checkForAutoAddSlot() {
    const probabilities = this.calculateBlackjackProbabilities();
    
    if (probabilities.recommendation === 'HIT' && this.playerSlots.length > 0) {
      const lastSlotFilled = this.playerSlots[this.playerSlots.length - 1] !== null;
      const playerValue = this.calculateHandValue(this.gameState.playerCards);
      
      if (lastSlotFilled && playerValue < 21 && this.playerSlots.length < 5) {
        this.playerSlots.push(null);
        this.renderCards();
      }
    }
  }
  
  resetHand() {
    this.gameState.dealerCards = [];
    this.gameState.playerCards = [];
    this.dealerSlots = [null];
    this.playerSlots = [null, null];
    
    this.renderCards();
    this.updateDisplay();
  }
  
  dealAgain() {
    this.resetHand();
    this.gameState.handCount++;
    this.saveGameStats();
    this.updateHandsPlayed();
  }
  
  calculateHandValue(cards) {
    let value = 0;
    let aces = 0;
    
    cards.forEach(card => {
      if (card === 1) {
        aces++;
        value += 11;
      } else {
        value += card;
      }
    });
    
    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }
    
    return value;
  }
  
  calculatePlayerBustProbability(playerValue) {
    if (playerValue >= 21) return playerValue > 21 ? 100 : 0;
    
    const bustCards = Math.max(0, 13 - (21 - playerValue));
    return Math.round((bustCards / 13) * 100);
  }
  
  getBasicStrategyRecommendation(playerValue, dealerUpCard, playerCards) {
    if (playerValue > 21) {
      return { recommendation: 'BUST', recommendationColor: 'text-red-500' };
    }
    
    if (playerValue === 21) {
      return { recommendation: 'BLACKJACK', recommendationColor: 'text-yellow-500' };
    }
    
    const hasAce = playerCards.includes(1);
    const isPair = playerCards.length === 2 && playerCards[0] === playerCards[1];
    
    if (isPair) {
      const pairValue = playerCards[0];
      if (pairValue === 1 || pairValue === 8) {
        return { recommendation: 'SPLIT', recommendationColor: 'text-purple-500' };
      }
    }
    
    if (hasAce && playerCards.length === 2) {
      const otherCard = playerCards.find(card => card !== 1);
      if (otherCard >= 2 && otherCard <= 6) {
        return dealerUpCard >= 4 && dealerUpCard <= 6 
          ? { recommendation: 'DOUBLE', recommendationColor: 'text-blue-500' }
          : { recommendation: 'HIT', recommendationColor: 'text-green-500' };
      }
    }
    
    if (playerValue >= 17) {
      return { recommendation: 'STAND', recommendationColor: 'text-orange-500' };
    } else if (playerValue <= 11) {
      return { recommendation: 'HIT', recommendationColor: 'text-green-500' };
    } else if (playerValue >= 12 && playerValue <= 16) {
      return dealerUpCard >= 2 && dealerUpCard <= 6 
        ? { recommendation: 'STAND', recommendationColor: 'text-orange-500' }
        : { recommendation: 'HIT', recommendationColor: 'text-green-500' };
    }
    
    return { recommendation: 'HIT', recommendationColor: 'text-green-500' };
  }
  
  calculateWinProbability(playerValue, dealerUpCard, recommendation) {
    if (playerValue > 21) return 0;
    if (playerValue === 21) return 85;
    
    let baseProb = 45;
    
    if (recommendation === 'STAND') {
      if (playerValue >= 17) baseProb = 55;
      else if (dealerUpCard >= 7) baseProb = 25;
      else baseProb = 65;
    } else if (recommendation === 'HIT') {
      if (playerValue <= 11) baseProb = 70;
      else if (playerValue <= 16) baseProb = 35;
    } else if (recommendation === 'DOUBLE') {
      baseProb = 60;
    }
    
    return Math.max(0, Math.min(85, baseProb));
  }
  
  calculateBlackjackProbabilities() {
    if (this.gameState.dealerCards.length === 0 || this.gameState.playerCards.length === 0) {
      return {
        winProbability: 0,
        bustProbability: 0,
        recommendation: 'SELECT CARDS',
        recommendationColor: 'text-gray-400'
      };
    }
    
    const playerValue = this.calculateHandValue(this.gameState.playerCards);
    const dealerUpCard = this.gameState.dealerCards[0];
    const bustProbability = this.calculatePlayerBustProbability(playerValue);
    const strategy = this.getBasicStrategyRecommendation(playerValue, dealerUpCard, this.gameState.playerCards);
    const winProbability = this.calculateWinProbability(playerValue, dealerUpCard, strategy.recommendation);
    
    return {
      winProbability,
      bustProbability,
      recommendation: strategy.recommendation,
      recommendationColor: strategy.recommendationColor
    };
  }
  
  saveGameStats() {
    const stats = {
      handsPlayed: this.gameState.handCount,
      lastPlayed: new Date().toISOString()
    };
    
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ gameStats: stats });
    } else {
      localStorage.setItem('gameStats', JSON.stringify(stats));
    }
  }
  
  loadGameStats() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['gameStats'], (result) => {
        const stats = result.gameStats || { handsPlayed: 0 };
        this.gameState.handCount = stats.handsPlayed;
        this.updateHandsPlayed();
      });
    } else {
      const stats = localStorage.getItem('gameStats');
      if (stats) {
        const parsed = JSON.parse(stats);
        this.gameState.handCount = parsed.handsPlayed || 0;
      }
      this.updateHandsPlayed();
    }
  }
  
  updateHandsPlayed() {
    document.getElementById('hands-played').textContent = this.gameState.handCount;
  }
  
  showDonationModal() {
    this.initializePayPal();
    document.getElementById('donation-modal').classList.add('show');
    // Set default selected amount
    this.selectAmount(this.selectedAmount);
  }
  
  hideDonationModal() {
    document.getElementById('donation-modal').classList.remove('show');
  }
  
  selectAmount(amount) {
    this.selectedAmount = amount;
    
    // Update button states
    document.querySelectorAll('.amount-btn').forEach(btn => {
      btn.classList.remove('selected');
      if (btn.dataset.amount === amount) {
        btn.classList.add('selected');
      }
    });
    
    // Update PayPal button if visible
    if (document.getElementById('paypal-method').classList.contains('active')) {
      this.updatePayPalButton();
    }
  }
  
  switchMethod(method) {
    // Update tab states
    document.querySelectorAll('.method-tab').forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.method === method) {
        tab.classList.add('active');
      }
    });
    
    // Update panel visibility
    document.querySelectorAll('.method-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(`${method}-method`).classList.add('active');
    
    // Initialize PayPal if needed
    if (method === 'paypal') {
      this.updatePayPalButton();
    }
  }
  
  updatePayPalButton() {
    const button = document.createElement('button');
    button.style.cssText = 'width: 100%; padding: 12px; background: #0070ba; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;';
    button.textContent = `Donate $${this.selectedAmount} via PayPal`;
    button.addEventListener('click', () => {
      this.paypalDonation.openDonation(this.selectedAmount);
    });
    
    const container = document.getElementById('paypal-button');
    container.innerHTML = '';
    container.appendChild(button);
  }
  
  copyToClipboard(address, button) {
    navigator.clipboard.writeText(address).then(() => {
      // Show success feedback
      const originalText = button.textContent;
      button.textContent = 'Copied!';
      button.classList.add('copied');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = address;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      button.textContent = 'Copied!';
      button.classList.add('copied');
      setTimeout(() => {
        button.textContent = 'Copy';
        button.classList.remove('copied');
      }, 2000);
    });
  }
  
  async initializePayPal() {
    this.updatePayPalButton();
  }
  

}

// Initialize the extension when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BlackjackExtension();
});
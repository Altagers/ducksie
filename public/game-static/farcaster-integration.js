// Farcaster Integration Module
let farcasterUser = null;
window.farcasterUser = null; // Делаем переменную доступной глобально

// Function to check if user is logged in
async function checkFarcasterLogin() {
  try {
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        farcasterUser = data.user;
        window.farcasterUser = data.user; // Устанавливаем глобальную переменную
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Failed to check login status:', error);
    return false;
  }
}

// Function to login with Farcaster using Warpcast
async function loginWithWarpcast() {
  try {
    // Проверяем, доступен ли Warpcast API
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isFarcaster) {
      // Запрашиваем FID через Warpcast
      const fid = await window.ethereum.request({ method: 'eth_requestFarcasterAccount' });
      
      if (fid) {
        return await loginWithFarcaster(fid);
      }
    } else {
      // Если Warpcast недоступен, показываем обычное модальное окно
      showLoginModal();
    }
  } catch (error) {
    console.error('Failed to login with Warpcast:', error);
    // Если произошла ошибка, показываем обычное модальное окно
    showLoginModal();
  }
}

// Function to login with Farcaster FID
async function loginWithFarcaster(fid) {
  try {
    const response = await fetch('/api/auth/farcaster-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fid }),
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      farcasterUser = data.user;
      window.farcasterUser = data.user; // 
      
      // Load game data after login
      await loadGameData();
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to login:', error);
    return false;
  }
}

// Save game data to server
async function saveGameData() {
  if (!farcasterUser) return false;
  
  try {
    // Get current game state
    const gameState = window.game ? window.game.getState() : null;
    
    if (!gameState) return false;
    
    const response = await fetch('/api/game/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gameState),
      credentials: 'include'
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to save game data:', error);
    return false;
  }
}

// Load game data from server
async function loadGameData() {
  if (!farcasterUser) return false;
  
  try {
    const response = await fetch('/api/game/load', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.gameData && window.game) {
        window.game.loadState(data.gameData);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Failed to load game data:', error);
    return false;
  }
}

// Show login modal
// Update the showLoginModal function to create modal elements if they don't exist
function showLoginModal() {
  // Check if DOM object exists
  if (typeof window.DOM === 'undefined') {
    window.DOM = {};
  }
  
  // Create modal elements if they don't exist
  if (!DOM.modal) {
    console.log('Creating modal element');
    DOM.modal = document.getElementById('modal');
    
    // If modal still doesn't exist, create it
    if (!DOM.modal) {
      DOM.modal = document.createElement('div');
      DOM.modal.id = 'modal';
      DOM.modal.style.display = 'none';
      DOM.modal.style.position = 'fixed';
      DOM.modal.style.zIndex = '1000';
      DOM.modal.style.left = '0';
      DOM.modal.style.top = '0';
      DOM.modal.style.width = '100%';
      DOM.modal.style.height = '100%';
      DOM.modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
      DOM.modal.style.display = 'flex';
      DOM.modal.style.justifyContent = 'center';
      DOM.modal.style.alignItems = 'center';
      document.body.appendChild(DOM.modal);
    }
  }
  
  if (!DOM.modalContent) {
    console.log('Creating modal content element');
    DOM.modalContent = document.getElementById('modal-content');
    
    // If modal content still doesn't exist, create it
    if (!DOM.modalContent) {
      DOM.modalContent = document.createElement('div');
      DOM.modalContent.id = 'modal-content';
      DOM.modalContent.style.backgroundColor = '#fff';
      DOM.modalContent.style.padding = '20px';
      DOM.modalContent.style.borderRadius = '5px';
      DOM.modalContent.style.maxWidth = '500px';
      DOM.modalContent.style.width = '80%';
      DOM.modal.appendChild(DOM.modalContent);
    }
  }
  
  DOM.modalContent.innerHTML = '';
  
  const textElement = document.createElement('p');
  textElement.id = 'modal-text';
  textElement.textContent = 'Enter your Farcaster FID to login:';
  DOM.modalContent.appendChild(textElement);
  
  const inputContainer = document.createElement('div');
  inputContainer.className = 'login-input-container';
  
  const fidInput = document.createElement('input');
  fidInput.type = 'number';
  fidInput.id = 'fid-input';
  fidInput.placeholder = 'Your Farcaster FID';
  inputContainer.appendChild(fidInput);
  
  DOM.modalContent.appendChild(inputContainer);
  
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'modal-buttons';
  
  const loginButton = document.createElement('button');
  loginButton.id = 'login-button';
  loginButton.textContent = 'Login';
  loginButton.onclick = async () => {
    const fid = fidInput.value.trim();
    if (!fid) {
      alert('Please enter your Farcaster FID');
      return;
    }
    
    const success = await loginWithFarcaster(fid);
    if (success) {
      DOM.modal.style.display = 'none';
      if (typeof window.queueNotification === 'function') {
        window.queueNotification(`Welcome, ${farcasterUser.displayName || farcasterUser.username}!`);
      }
    } else {
      alert('Login failed. Please check your FID and try again.');
    }
  };
  buttonsContainer.appendChild(loginButton);
  
  const cancelButton = document.createElement('button');
  cancelButton.id = 'cancel-button';
  cancelButton.textContent = 'Cancel';
  cancelButton.onclick = () => {
    DOM.modal.style.display = 'none';
  };
  buttonsContainer.appendChild(cancelButton);
  
  DOM.modalContent.appendChild(buttonsContainer);
  DOM.modal.style.display = 'flex';
}

// Add login button to sidebar
function addLoginButton() {
  const loginButton = document.createElement('button');
  loginButton.className = 'icon-button';
  loginButton.id = 'login-button';
  loginButton.setAttribute('aria-label', 'Login with Farcaster');
  loginButton.textContent = '👤';
  loginButton.onclick = loginWithWarpcast; // Используем новую функцию для логина
  
  // Add to sidebar after theme button
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.appendChild(loginButton);
  }
}

// Initialize Farcaster integration
async function initFarcasterIntegration() {
  // Add login button
  addLoginButton();
  
  // Check if user is already logged in
  const isLoggedIn = await checkFarcasterLogin();
  
  // Если пользователь авторизован, загружаем данные игры
  if (isLoggedIn && typeof window.queueNotification === 'function') {
    window.queueNotification(`Welcome back, ${farcasterUser.displayName || farcasterUser.username}!`);
    await loadGameData();
  }
  
  // Добавляем автосохранение каждые 5 минут
  setInterval(saveGameData, 300000);
}

// Export functions to be used in game.js
window.farcasterIntegration = {
  checkFarcasterLogin,
  loginWithFarcaster,
  loginWithWarpcast,
  saveGameData,
  loadGameData,
  showLoginModal,
  initFarcasterIntegration
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Farcaster integration
  initFarcasterIntegration();
});
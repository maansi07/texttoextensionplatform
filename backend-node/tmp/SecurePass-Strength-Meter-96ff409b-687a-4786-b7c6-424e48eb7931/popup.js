document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('password-input');
  const toggleVisibilityBtn = document.getElementById('toggle-visibility');
  const meter = document.getElementById('meter');
  const strengthLabel = document.getElementById('strength-label');
  const generateBtn = document.getElementById('generate-btn');
  const fillBtn = document.getElementById('fill-btn');

  const criteria = {
    length: document.getElementById('c-length'),
    upper: document.getElementById('c-upper'),
    lower: document.getElementById('c-lower'),
    number: document.getElementById('c-number'),
    special: document.getElementById('c-special')
  };

  passwordInput.addEventListener('input', checkPassword);

  toggleVisibilityBtn.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleVisibilityBtn.textContent = '🔒';
    } else {
      passwordInput.type = 'password';
      toggleVisibilityBtn.textContent = '👁️';
    }
  });

  generateBtn.addEventListener('click', () => {
    passwordInput.value = generateStrongPassword();
    checkPassword();
  });

  fillBtn.addEventListener('click', async () => {
    const password = passwordInput.value;
    if (!password) {
      alert('Please enter or generate a password first!');
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    chrome.tabs.sendMessage(tab.id, { action: "fillPassword", password: password }, (response) => {
      if (chrome.runtime.lastError) {
        alert("Please make sure your target webpage is loaded and active, then try again.");
      } else if (response && response.success) {
        window.close();
      } else {
        alert("Could not find an active text/password input field. Click inside your form input and retry!");
      }
    });
  });

  function checkPassword() {
    const val = passwordInput.value;
    let score = 0;

    const hasLength = val.length >= 8;
    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasNumber = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);

    toggleCriteria(criteria.length, hasLength);
    toggleCriteria(criteria.upper, hasUpper);
    toggleCriteria(criteria.lower, hasLower);
    toggleCriteria(criteria.number, hasNumber);
    toggleCriteria(criteria.special, hasSpecial);

    if (hasLength) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    if (val.length >= 12 && score > 0) score++;
    if (val.length >= 16 && score > 0) score++;

    let maxScore = 7;
    let percentage = (score / maxScore) * 100;
    if (val.length === 0) percentage = 0;

    meter.style.width = percentage + '%';

    if (percentage === 0) {
      meter.style.backgroundColor = '#e0e0e0';
      strengthLabel.textContent = 'Empty';
      strengthLabel.style.color = '#888';
    } else if (percentage < 30) {
      meter.style.backgroundColor = '#e74c3c';
      strengthLabel.textContent = 'Very Weak';
      strengthLabel.style.color = '#e74c3c';
    } else if (percentage < 55) {
      meter.style.backgroundColor = '#e67e22';
      strengthLabel.textContent = 'Weak';
      strengthLabel.style.color = '#e67e22';
    } else if (percentage < 80) {
      meter.style.backgroundColor = '#f1c40f';
      strengthLabel.textContent = 'Medium';
      strengthLabel.style.color = '#f1c40f';
    } else if (percentage < 100) {
      meter.style.backgroundColor = '#2ecc71';
      strengthLabel.textContent = 'Strong';
      strengthLabel.style.color = '#2ecc71';
    } else {
      meter.style.backgroundColor = '#1abc9c';
      strengthLabel.textContent = 'Excellent (Very Secure)';
      strengthLabel.style.color = '#1abc9c';
    }
  }

  function toggleCriteria(element, isValid) {
    if (isValid) {
      element.classList.add('valid');
    } else {
      element.classList.remove('valid');
    }
  }

  function generateStrongPassword() {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    
    // Ensure all criteria are filled natively
    password += "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 26));
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(Math.random() * 26));
    password += "0123456789".charAt(Math.floor(Math.random() * 10));
    password += "!@#$%^&*()".charAt(Math.floor(Math.random() * 10));

    for (let i = 4; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    // Shuffle the result
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }
});
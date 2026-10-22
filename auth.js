/**
 * IoT Quest — Professional Authentication Engine & Pilot Station
 * Features:
 * - Option-specific Popups: Direct opening of Sign In and Login windows
 * - Sign In Fields: Name, Email, Password, Confirm Password (with real-time match check)
 * - Login Fields: Email, Password (with 1-click Demo Pilot teleport)
 * - Quantum Energy Shield Strong Password Engine + Generator
 * - 8-Bit Web Audio Synthesizer (Arcade audio cues)
 * - Session Persistence & Navbar State Sync
 * - Global Gatekeeper: Unauthenticated actions prompt login
 */

(function () {
  const STORAGE_USERS_KEY = 'iot_quest_users';
  const STORAGE_SESSION_KEY = 'iot_quest_session';
  const STORAGE_SOUND_KEY = 'iot_quest_sound';

  let isSoundEnabled = localStorage.getItem(STORAGE_SOUND_KEY) !== 'false';
  let audioCtx = null;

  // Web Audio Synthesizer
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playRetroSound(type) {
    if (!isSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'open') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(660, now + 0.06);
        osc.frequency.setValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.start(now);
        osc.stop(now + 0.22);
      } else if (type === 'shield-power') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.08);
        osc.frequency.setValueAtTime(783.99, now + 0.16);
        osc.frequency.setValueAtTime(1046.50, now + 0.24);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'cypher-roll') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300 + Math.random() * 400, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'success') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.09);
        osc.frequency.setValueAtTime(659.25, now + 0.18);
        osc.frequency.setValueAtTime(880, now + 0.27);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  // Users store
  function getStoredUsers() {
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      if (!data) {
        const defaultUsers = [
          {
            name: 'Alex Pilot',
            avatar: '🚀',
            email: 'demo@iotquest.dev',
            password: 'Password123!',
            xp: 250,
            joinedAt: new Date().toISOString()
          }
        ];
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(defaultUsers));
        return defaultUsers;
      }
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }

  function saveStoredUsers(users) {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {}
  }

  function getCurrentSession() {
    try {
      const data = localStorage.getItem(STORAGE_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function setCurrentSession(user) {
    if (!user) {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } else {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
    }
    syncNavbarAuth();
  }

  function showToast(message, type = 'success') {
    let toast = document.getElementById('authToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'authToast';
      toast.className = 'auth-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `auth-toast is-visible ${type === 'error' ? 'toast-error' : 'toast-success'}`;
    playRetroSound(type === 'error' ? 'click' : 'success');
    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4000);
  }

  // Strong Password Generator
  function generateStrongPassword() {
    const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowers = 'abcdefghijkmnopqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%^&*()_+~=';
    const all = uppers + lowers + numbers + symbols;

    let pwd = [
      uppers[Math.floor(Math.random() * uppers.length)],
      lowers[Math.floor(Math.random() * lowers.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    for (let i = 4; i < 14; i++) {
      pwd.push(all[Math.floor(Math.random() * all.length)]);
    }

    for (let i = pwd.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pwd[i], pwd[j]] = [pwd[j], pwd[i]];
    }

    return pwd.join('');
  }

  // Password validation
  function evaluatePassword(pwd) {
    const checks = {
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd)
    };

    let score = 0;
    if (checks.length) score++;
    if (checks.upper) score++;
    if (checks.lower) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    return { checks, score, isStrong: score === 5 };
  }

  // Navbar sync
  function syncNavbarAuth() {
    const session = getCurrentSession();
    const authGroups = document.querySelectorAll('.nav-auth-group, .nav-auth-deck, .nav-auth-cluster');
    const userChips = document.querySelectorAll('.nav-user-chip');

    if (session) {
      authGroups.forEach(el => (el.hidden = true));
      userChips.forEach(el => {
        el.hidden = false;
        const nameEl = el.querySelector('.user-chip-name');
        const avatarEl = el.querySelector('.user-avatar-badge');
        const xpEl = el.querySelector('.user-chip-xp');

        if (nameEl) nameEl.textContent = session.name;
        if (avatarEl) avatarEl.textContent = session.avatar || '🚀';
        if (xpEl) xpEl.textContent = `⚡ ${session.xp || 150} XP`;
      });
    } else {
      authGroups.forEach(el => (el.hidden = false));
      userChips.forEach(el => (el.hidden = true));
    }
  }

  function initAuth() {
    getStoredUsers();

    const authModal = document.getElementById('authModal');
    if (!authModal) return;

    const closeAuthBtn = document.getElementById('closeAuthModal');
    const tabLogin = document.getElementById('tabLogin');
    const tabSignin = document.getElementById('tabSignin');
    const loginPanel = document.getElementById('loginPanel');
    const signinPanel = document.getElementById('signinPanel');
    const authAlert = document.getElementById('authAlert');
    const heading = document.getElementById('authModalHeading');

    const switchToSignin = document.getElementById('switchToSignin');
    const switchToLogin = document.getElementById('switchToLogin');
    const soundToggleBtn = document.getElementById('soundToggleBtn');

    // Selected Avatar state
    let selectedAvatar = '🚀';
    const avatarChoiceBtns = document.querySelectorAll('.avatar-choice-btn');
    avatarChoiceBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        avatarChoiceBtns.forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        selectedAvatar = btn.dataset.avatar || '🚀';
        playRetroSound('click');
      });
    });

    // Sound toggle
    if (soundToggleBtn) {
      soundToggleBtn.textContent = isSoundEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
      soundToggleBtn.addEventListener('click', () => {
        isSoundEnabled = !isSoundEnabled;
        localStorage.setItem(STORAGE_SOUND_KEY, String(isSoundEnabled));
        soundToggleBtn.textContent = isSoundEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
        if (isSoundEnabled) playRetroSound('click');
      });
    }

    // Sign In form elements
    const signinForm = document.getElementById('signinForm');
    const signinName = document.getElementById('signinName');
    const signinEmail = document.getElementById('signinEmail');
    const signinPassword = document.getElementById('signinPassword');
    const signinConfirmPassword = document.getElementById('signinConfirmPassword');
    const passMatchStatus = document.getElementById('passMatchStatus');
    const toggleSigninPass = document.getElementById('toggleSigninPass');
    const toggleConfirmPass = document.getElementById('toggleConfirmPass');
    const generatePasswordBtn = document.getElementById('generatePasswordBtn');
    const shieldGlyph = document.getElementById('shieldGlyph');
    const shieldStatusText = document.getElementById('shieldStatusText');
    const shieldFillLevel = document.getElementById('shieldFillLevel');
    const signinSubmitBtn = document.getElementById('signinSubmitBtn');

    // Circuit requirement nodes
    const nodeLength = document.getElementById('nodeLength');
    const nodeUpper = document.getElementById('nodeUpper');
    const nodeLower = document.getElementById('nodeLower');
    const nodeNumber = document.getElementById('nodeNumber');
    const nodeSpecial = document.getElementById('nodeSpecial');

    // Login form elements
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const toggleLoginPass = document.getElementById('toggleLoginPass');
    const quickDemoBtn = document.getElementById('quickDemoBtn');

    function showAlert(msg, isError = true) {
      if (!authAlert) return;
      authAlert.hidden = false;
      authAlert.className = `auth-alert ${isError ? 'alert-error' : 'alert-success'}`;
      authAlert.innerHTML = `<span>${isError ? '⚠' : '✓'}</span> ${msg}`;
    }

    function hideAlert() {
      if (authAlert) {
        authAlert.hidden = true;
        authAlert.textContent = '';
      }
    }

    function switchTab(targetTab) {
      hideAlert();
      playRetroSound('click');
      if (targetTab === 'signin') {
        if (tabSignin) {
          tabSignin.classList.add('is-active');
          tabSignin.setAttribute('aria-selected', 'true');
        }
        if (tabLogin) {
          tabLogin.classList.remove('is-active');
          tabLogin.setAttribute('aria-selected', 'false');
        }
        if (signinPanel) signinPanel.hidden = false;
        if (loginPanel) loginPanel.hidden = true;
        if (heading) heading.textContent = 'ENLIST NEW PILOT (SIGN IN)';
        setTimeout(() => {
          if (signinName) signinName.focus();
        }, 50);
      } else {
        if (tabLogin) {
          tabLogin.classList.add('is-active');
          tabLogin.setAttribute('aria-selected', 'true');
        }
        if (tabSignin) {
          tabSignin.classList.remove('is-active');
          tabSignin.setAttribute('aria-selected', 'false');
        }
        if (loginPanel) loginPanel.hidden = false;
        if (signinPanel) signinPanel.hidden = true;
        if (heading) heading.textContent = 'PILOT SYSTEM ACCESS (LOGIN)';
        setTimeout(() => {
          if (loginEmail) loginEmail.focus();
        }, 50);
      }
    }

    function openModal(mode = 'login') {
      playRetroSound('open');
      switchTab(mode);
      if (authModal) {
        try {
          if (!authModal.open) {
            if (typeof authModal.showModal === 'function') {
              authModal.showModal();
            } else {
              authModal.setAttribute('open', '');
            }
          }
        } catch (err) {
          authModal.setAttribute('open', '');
        }
      }
    }

    function closeModal() {
      playRetroSound('click');
      hideAlert();
      if (authModal) {
        try {
          if (typeof authModal.close === 'function') {
            authModal.close();
          }
        } catch (e) {}
        authModal.removeAttribute('open');
      }
    }

    // =========================================================================
    // GLOBAL AUTH GATEKEEPER & TRIGGER BINDINGS (Capture Phase)
    // - Sign In button -> Opens Sign In popup
    // - Login button -> Opens Login popup
    // - Unauthenticated button clicks -> Block action & prompt Login
    // =========================================================================
    document.addEventListener('click', function (e) {
      // 1. Inside modal interactions are always allowed
      if (e.target.closest('#authModal')) {
        return;
      }

      // 2. Specific Sign In trigger -> explicitly opens Sign In window
      const signinBtn = e.target.closest('#navSigninBtn, .signin-button, #openSigninBtn, .creative-signin-btn');
      if (signinBtn) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openModal('signin');
        return;
      }

      // 3. Specific Login trigger -> explicitly opens Login window
      const loginBtn = e.target.closest('#navLoginBtn, .login-button, #openLoginBtn, .creative-login-btn');
      if (loginBtn) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openModal('login');
        return;
      }

      // 4. Logout trigger
      const logoutBtn = e.target.closest('.user-logout-btn, #logoutBtn');
      if (logoutBtn) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setCurrentSession(null);
        showToast('Pilot logged out. Terminal offline.', 'success');
        return;
      }

      // 5. If authenticated, allow everything!
      const session = getCurrentSession();
      if (session) {
        return;
      }

      // 6. User is NOT authenticated:
      // Block any interactive button or link and open the Login popup!
      const interactiveTarget = e.target.closest(
        'button, ' +
        'a.journey-button, ' +
        'a.module-card, ' +
        'a.pixel-button, ' +
        'a.game-tile, ' +
        'a.hub-pill, ' +
        '.quiz-option, ' +
        '.bonus-claim-btn, ' +
        '.ref-btn, ' +
        '.ref-copy-btn, ' +
        '.mode-toggle-btn'
      );

      if (interactiveTarget) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        playRetroSound('click');
        showToast('🔒 Pilot Authentication Required! Please log in or sign in to continue.', 'error');
        openModal('login');
      }
    }, true);

    if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeModal);

    authModal.addEventListener('click', e => {
      if (e.target === authModal) closeModal();
    });

    if (tabLogin) tabLogin.addEventListener('click', () => switchTab('login'));
    if (tabSignin) tabSignin.addEventListener('click', () => switchTab('signin'));
    if (switchToSignin) switchToSignin.addEventListener('click', () => switchTab('signin'));
    if (switchToLogin) switchToLogin.addEventListener('click', () => switchTab('login'));

    // Quick demo login
    if (quickDemoBtn) {
      quickDemoBtn.addEventListener('click', () => {
        playRetroSound('shield-power');
        if (loginEmail) loginEmail.value = 'demo@iotquest.dev';
        if (loginPassword) loginPassword.value = 'Password123!';
        showAlert('Demo Pilot credentials loaded! Press LOG IN to engage.', false);
      });
    }

    // Password visibility toggles
    if (toggleLoginPass && loginPassword) {
      toggleLoginPass.addEventListener('click', () => {
        playRetroSound('click');
        const isPass = loginPassword.type === 'password';
        loginPassword.type = isPass ? 'text' : 'password';
        toggleLoginPass.textContent = isPass ? '🔒' : '👁';
      });
    }

    if (toggleSigninPass && signinPassword) {
      toggleSigninPass.addEventListener('click', () => {
        playRetroSound('click');
        const isPass = signinPassword.type === 'password';
        signinPassword.type = isPass ? 'text' : 'password';
        toggleSigninPass.textContent = isPass ? '🔒' : '👁';
      });
    }

    if (toggleConfirmPass && signinConfirmPassword) {
      toggleConfirmPass.addEventListener('click', () => {
        playRetroSound('click');
        const isPass = signinConfirmPassword.type === 'password';
        signinConfirmPassword.type = isPass ? 'text' : 'password';
        toggleConfirmPass.textContent = isPass ? '🔒' : '👁';
      });
    }

    // Real-Time Password Match & Strength Evaluator
    let lastStrengthScore = 0;
    function updatePasswordStrength() {
      if (!signinPassword) return;
      const pwd = signinPassword.value;
      const confirmPwd = signinConfirmPassword ? signinConfirmPassword.value : '';
      const { checks, score, isStrong } = evaluatePassword(pwd);

      if (score > lastStrengthScore) {
        if (score === 5) playRetroSound('shield-power');
        else playRetroSound('click');
      }
      lastStrengthScore = score;

      const pct = (score / 5) * 100;
      if (shieldFillLevel) {
        shieldFillLevel.style.width = `${pct}%`;
        shieldFillLevel.className = 'shield-fill-level';
        if (score <= 2) shieldFillLevel.classList.add('is-weak');
        else if (score <= 4) shieldFillLevel.classList.add('is-medium');
        else shieldFillLevel.classList.add('is-strong');
      }

      if (shieldStatusText) {
        if (score === 0) shieldStatusText.textContent = 'DEPLETED (0%)';
        else if (score === 1) shieldStatusText.textContent = 'LOW (20%)';
        else if (score === 2) shieldStatusText.textContent = 'STABILIZING (40%)';
        else if (score === 3) shieldStatusText.textContent = 'ONLINE (60%)';
        else if (score === 4) shieldStatusText.textContent = 'HIGH POWER (80%)';
        else shieldStatusText.textContent = 'MAX OVERDRIVE (100%)';
      }

      if (shieldGlyph) {
        if (score <= 2) shieldGlyph.style.color = '#f43f5e';
        else if (score <= 4) shieldGlyph.style.color = '#f59e0b';
        else shieldGlyph.style.color = '#10b981';
      }

      if (nodeLength) nodeLength.classList.toggle('is-powered', checks.length);
      if (nodeUpper) nodeUpper.classList.toggle('is-powered', checks.upper);
      if (nodeLower) nodeLower.classList.toggle('is-powered', checks.lower);
      if (nodeNumber) nodeNumber.classList.toggle('is-powered', checks.number);
      if (nodeSpecial) nodeSpecial.classList.toggle('is-powered', checks.special);

      // Confirm Password Matching Validation
      let passwordsMatch = false;
      if (passMatchStatus) {
        if (!confirmPwd) {
          passMatchStatus.textContent = '';
        } else if (pwd === confirmPwd) {
          passMatchStatus.textContent = '✓ Passwords match';
          passMatchStatus.style.color = '#10b981';
          passwordsMatch = true;
        } else {
          passMatchStatus.textContent = '⚠ Passwords do not match';
          passMatchStatus.style.color = '#f43f5e';
          passwordsMatch = false;
        }
      }

      const hasName = signinName && signinName.value.trim().length > 0;
      const hasEmail = signinEmail && signinEmail.value.trim().length > 0;

      if (signinSubmitBtn) {
        signinSubmitBtn.disabled = !(isStrong && passwordsMatch && hasName && hasEmail);
      }
    }

    if (signinPassword) signinPassword.addEventListener('input', updatePasswordStrength);
    if (signinConfirmPassword) signinConfirmPassword.addEventListener('input', updatePasswordStrength);
    if (signinName) signinName.addEventListener('input', updatePasswordStrength);
    if (signinEmail) signinEmail.addEventListener('input', updatePasswordStrength);

    // Cypher Key Generator
    let isGenerating = false;
    if (generatePasswordBtn && signinPassword) {
      generatePasswordBtn.addEventListener('click', () => {
        if (isGenerating) return;
        isGenerating = true;

        const targetPass = generateStrongPassword();
        let rollCount = 0;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

        const interval = setInterval(() => {
          let scramble = '';
          for (let i = 0; i < 14; i++) {
            scramble += chars[Math.floor(Math.random() * chars.length)];
          }
          signinPassword.value = scramble;
          if (signinConfirmPassword) signinConfirmPassword.value = scramble;
          signinPassword.type = 'text';
          if (signinConfirmPassword) signinConfirmPassword.type = 'text';
          playRetroSound('cypher-roll');
          rollCount++;

          if (rollCount > 8) {
            clearInterval(interval);
            signinPassword.value = targetPass;
            if (signinConfirmPassword) signinConfirmPassword.value = targetPass;
            isGenerating = false;
            playRetroSound('shield-power');

            if (toggleSigninPass) toggleSigninPass.textContent = '🔒';
            if (toggleConfirmPass) toggleConfirmPass.textContent = '🔒';

            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(targetPass).catch(() => {});
            }

            updatePasswordStrength();
            showAlert('Strong Password Generated & Auto-Filled in Confirm Password!', false);
          }
        }, 35);
      });
    }

    // Sign In Submission
    if (signinForm) {
      signinForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = signinName.value.trim();
        const email = signinEmail.value.trim().toLowerCase();
        const password = signinPassword.value;
        const confirmPassword = signinConfirmPassword ? signinConfirmPassword.value : '';

        if (!name || !email || !password || !confirmPassword) {
          showAlert('Please fill in Name, Email, Password, and Confirm Password.');
          return;
        }

        if (password !== confirmPassword) {
          showAlert('Passwords do not match! Please verify your password.');
          return;
        }

        const { isStrong } = evaluatePassword(password);
        if (!isStrong) {
          showAlert('Password requirements not met. Please satisfy all 5 criteria.');
          return;
        }

        const users = getStoredUsers();
        if (users.some(u => u.email === email)) {
          showAlert('An explorer with this email is already registered! Please log in.');
          return;
        }

        const newUser = {
          name,
          avatar: selectedAvatar,
          email,
          password,
          xp: 150,
          joinedAt: new Date().toISOString()
        };

        users.push(newUser);
        saveStoredUsers(users);

        setCurrentSession({
          name: newUser.name,
          avatar: newUser.avatar,
          email: newUser.email,
          xp: newUser.xp
        });

        closeModal();
        signinForm.reset();
        updatePasswordStrength();
        showToast(`Welcome Pilot ${name}! ${selectedAvatar} Account created & +150 XP bonus granted!`, 'success');
      });
    }

    // Login Submission
    if (loginForm) {
      loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = loginEmail.value.trim().toLowerCase();
        const password = loginPassword.value;

        if (!email || !password) {
          showAlert('Please enter your email and password.');
          return;
        }

        const users = getStoredUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
          showAlert('Access Denied: Invalid email or password.');
          playRetroSound('click');
          return;
        }

        setCurrentSession({
          name: user.name,
          avatar: user.avatar || '🚀',
          email: user.email,
          xp: user.xp || 150
        });

        closeModal();
        loginForm.reset();
        showToast(`Welcome back, Pilot ${user.name}! ${user.avatar || '🚀'} Signals active`, 'success');
      });
    }

    syncNavbarAuth();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }

  window.IoTQuestAuth = {
    getCurrentSession,
    setCurrentSession,
    generateStrongPassword,
    syncNavbarAuth,
    playRetroSound,
    openModal
  };
})();

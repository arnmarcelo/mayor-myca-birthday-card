/**
 * MAYOR MYCA VERGARA - INTERACTIVE BIRTHDAY CARD
 * Built with clean vanilla JavaScript, responsive mobile-first architecture,
 * zero heavy frameworks, instant tap interactions, and synthesized Web Audio.
 */

(function () {
  'use strict';

  // State Management
  let currentStep = 1;
  let lightsOn = false;
  let candlesLit = true;
  let isMusicPlaying = false;
  let ambientConfettiTimer = null;
  let easterEggDismissTimer = null;

  // DOM Elements
  const cardStage = document.getElementById('cardStage');
  const roomDimmer = document.getElementById('roomDimmer');
  const fairyLights = document.getElementById('fairyLights');
  const birthdayAudio = document.getElementById('birthdayAudio');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicLabel = document.getElementById('musicLabel');

  const lanternWrapper = document.getElementById('lanternWrapper');
  const turnOnLightsBtn = document.getElementById('turnOnLightsBtn');
  const openCardBtn = document.getElementById('openCardBtn');
  const timeForCakeBtn = document.getElementById('timeForCakeBtn');
  const cakeClickTarget = document.getElementById('cakeClickTarget');
  const cakeCandlelightHalo = document.getElementById('cakeCandlelightHalo');
  const wishRevealCard = document.getElementById('wishRevealCard');
  const cakePrompt = document.getElementById('cakePrompt');
  const replayBtn = document.getElementById('replayBtn');

  // Easter Egg Elements
  const easterEggZones = document.querySelectorAll('.easter-egg-zone');
  const easterEggToast = document.getElementById('easterEggToast');
  const toastText = document.getElementById('toastText');
  const toastPointer = document.getElementById('toastPointer');
  const toastCloseBtn = document.getElementById('toastCloseBtn');

  const stepCards = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
    document.getElementById('step4')
  ];

  const stepDots = document.querySelectorAll('.step-dots .dot');

  // =========================================================================
  // TACTILE WEB AUDIO SYNTHESIZER (Built-in AudioContext - Zero extra audio files)
  // =========================================================================
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(function () {});
    }
    return audioCtx;
  }

  // 1. Mechanical switch click + warm gentle chord shimmer on lights turn-on
  function playSwitchClick() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Crisp soft mechanical click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(1200, t);
    clickOsc.frequency.exponentialRampToValueAtTime(140, t + 0.025);

    clickGain.gain.setValueAtTime(0.0001, t);
    clickGain.gain.linearRampToValueAtTime(0.09, t + 0.003);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(t);
    clickOsc.stop(t + 0.028);

    // Warm gentle chord shimmer (Fmaj7: F5, A5, C6, E6)
    const chordNotes = [698.46, 880.0, 1046.5, 1318.51];
    chordNotes.forEach(function (freq, i) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteStart = t + 0.03 + i * 0.025;
      const noteDur = 0.65;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.linearRampToValueAtTime(0.032, noteStart + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(noteStart);
      osc.stop(noteStart + noteDur + 0.01);
    });
  }

  // 2. Very subtle, soft paper-slide sound on card navigation / swipe
  function playPaperSwipe() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.08); // 80ms buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1100, t);
    filter.Q.setValueAtTime(1.2, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.038, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(t);
    noise.stop(t + 0.08);
  }

  // 3. Gentle airy whoosh + crystalline celebratory sparkle chime on candle blowout
  function playCandleBlowout() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Airy whoosh (sweep downward)
    const whooshLen = Math.floor(ctx.sampleRate * 0.38);
    const buffer = ctx.createBuffer(1, whooshLen, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < whooshLen; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, t);
    filter.frequency.exponentialRampToValueAtTime(260, t + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.055, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.36);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(t);
    noise.stop(t + 0.37);

    // Celebratory sparkle chimes (crystalline bells after whoosh)
    const bells = [1046.5, 1318.51, 1567.98, 1975.53, 2349.32]; // C6, E6, G6, B6, D7
    bells.forEach(function (freq, idx) {
      const bellOsc = ctx.createOscillator();
      const bellGain = ctx.createGain();
      const bellStart = t + 0.18 + idx * 0.055;
      const bellDur = 0.55;

      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(freq, bellStart);

      bellGain.gain.setValueAtTime(0.0001, bellStart);
      bellGain.gain.linearRampToValueAtTime(0.032, bellStart + 0.004);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, bellStart + bellDur);

      bellOsc.connect(bellGain);
      bellGain.connect(ctx.destination);

      bellOsc.start(bellStart);
      bellOsc.stop(bellStart + bellDur + 0.01);
    });
  }

  // 4. Playful tactile pop for Easter Egg taps
  function playEasterEggPop() {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(960, t + 0.07);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.045, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.19);
  }

  // =========================================================================
  // AUDIO CONTROLS (Zero initial bandwidth, toggled on demand)
  // =========================================================================
  function initAudioControls() {
    if (!birthdayAudio || !musicToggleBtn) return;

    musicToggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      getAudioContext();
      toggleMusic();
    });

    birthdayAudio.addEventListener('ended', function () {
      birthdayAudio.currentTime = 0;
      birthdayAudio.play().catch(function () {});
    });
  }

  function toggleMusic(forcePlay) {
    if (!birthdayAudio) return;

    if (forcePlay === true || (!isMusicPlaying && forcePlay !== false)) {
      const playPromise = birthdayAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(function () {
            isMusicPlaying = true;
            updateMusicButtonUI(true);
          })
          .catch(function (err) {
            console.log('Audio autoplay blocked or waiting for user gesture:', err);
            isMusicPlaying = false;
            updateMusicButtonUI(false);
          });
      }
    } else {
      birthdayAudio.pause();
      isMusicPlaying = false;
      updateMusicButtonUI(false);
    }
  }

  function updateMusicButtonUI(playing) {
    if (!musicToggleBtn || !musicLabel) return;
    if (playing) {
      musicToggleBtn.classList.add('playing');
      musicLabel.textContent = 'Music On';
      musicToggleBtn.setAttribute('aria-label', 'Pause background music');
    } else {
      musicToggleBtn.classList.remove('playing');
      musicLabel.textContent = 'Music Off';
      musicToggleBtn.setAttribute('aria-label', 'Play background music');
    }
  }

  // =========================================================================
  // STEP NAVIGATION & PAGINATION SYNC (Under 400ms snappy response)
  // =========================================================================
  function goToStep(stepIndex) {
    if (stepIndex < 1 || stepIndex > 4) return;
    currentStep = stepIndex;

    stepCards.forEach(function (card, idx) {
      const stepNum = idx + 1;
      if (stepNum === currentStep) {
        card.removeAttribute('hidden');
        void card.offsetWidth; // Force reflow
        card.classList.add('active');
      } else {
        card.classList.remove('active');
        setTimeout(function () {
          if (stepNum !== currentStep) {
            card.setAttribute('hidden', '');
          }
        }, 360);
      }
    });

    // Strictly sync dots
    stepDots.forEach(function (dot, idx) {
      const dotStep = idx + 1;
      if (dotStep === currentStep) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      }
    });

    // Dismiss any active easter egg toast when navigating away from cake step
    if (currentStep !== 4) {
      dismissEasterEggToast();
    }
  }

  // Clickable Pagination Dots
  stepDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const targetStep = parseInt(this.getAttribute('data-step'), 10);
      if (targetStep === currentStep) return;
      if (targetStep === 1 || lightsOn) {
        getAudioContext();
        goToStep(targetStep);
        playPaperSwipe();
      }
    });
  });

  // =========================================================================
  // MOBILE TOUCH-SWIPE GESTURE NAVIGATION (Slides 2, 3, and 4)
  // =========================================================================
  let touchStartX = 0;
  let touchStartY = 0;

  if (cardStage) {
    cardStage.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        getAudioContext();
      }
    }, { passive: true });

    cardStage.addEventListener('touchend', function (e) {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      // Prevent swipes before lights are turned on in Slide 1
      if (!lightsOn || currentStep < 2) return;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Horizontal swipe threshold: 45px, horizontal dominant
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
        if (deltaX < 0) {
          // Swipe Left -> Next Slide
          if (currentStep < 4) {
            goToStep(currentStep + 1);
            playPaperSwipe();
          }
        } else {
          // Swipe Right -> Previous Slide
          if (currentStep > 2) {
            goToStep(currentStep - 1);
            playPaperSwipe();
          }
        }
      }
    }, { passive: true });
  }

  // =========================================================================
  // TABLETOP EASTER EGGS (On Slide 4 Cake Finale Screen)
  // =========================================================================
  const easterEggMessages = {
    tricycle: {
      text: 'Tricycle Capital pride — keeping Cabanatuan moving forward! 🛺',
      pointerOffset: '45px'
    },
    gift: {
      text: 'A small token of gratitude from your CPDO Family! 🎁',
      pointerOffset: '36px'
    },
    mug: {
      text: 'For all the dedicated planning sessions for our city! ☕',
      pointerOffset: '104px'
    }
  };

  function showEasterEggToast(eggKey) {
    const eggData = easterEggMessages[eggKey];
    if (!eggData || !easterEggToast || !toastText) return;

    if (easterEggDismissTimer) {
      clearTimeout(easterEggDismissTimer);
      easterEggDismissTimer = null;
    }

    toastText.textContent = eggData.text;
    if (toastPointer) {
      toastPointer.style.left = eggData.pointerOffset;
    }

    easterEggToast.classList.remove('hide', 'dismissing');
    void easterEggToast.offsetWidth; // Force reflow
    playEasterEggPop();

    // Auto-dismiss smoothly after 3 seconds
    easterEggDismissTimer = setTimeout(function () {
      dismissEasterEggToast();
    }, 3000);
  }

  function dismissEasterEggToast() {
    if (!easterEggToast || easterEggToast.classList.contains('hide')) return;
    if (easterEggDismissTimer) {
      clearTimeout(easterEggDismissTimer);
      easterEggDismissTimer = null;
    }
    easterEggToast.classList.add('dismissing');
    setTimeout(function () {
      easterEggToast.classList.add('hide');
      easterEggToast.classList.remove('dismissing');
    }, 250);
  }

  easterEggZones.forEach(function (zone) {
    zone.addEventListener('click', function (e) {
      e.stopPropagation();
      const eggType = this.getAttribute('data-egg');
      showEasterEggToast(eggType);
    });
  });

  if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      dismissEasterEggToast();
    });
  }

  // Dismiss toast when tapping anywhere else on the document
  document.addEventListener('click', function (e) {
    if (easterEggToast && !easterEggToast.classList.contains('hide')) {
      if (!easterEggToast.contains(e.target)) {
        dismissEasterEggToast();
      }
    }
  });

  // =========================================================================
  // CONFETTI PARTICLES SYSTEM
  // =========================================================================
  const pastelColors = ['#f4a5ae', '#7dd3fc', '#fde047', '#86efac', '#d8b4fe', '#fbbf24', '#ffffff'];

  function triggerCelebratoryBurst() {
    if (typeof window.confetti === 'function') {
      window.confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.65 },
        colors: pastelColors,
        ticks: 200,
        gravity: 0.85,
        scalar: 0.9,
        disableForReducedMotion: true
      });
    } else {
      triggerFallbackBurst(50, 0.5, 0.65);
    }
  }

  function triggerGrandFinaleConfetti() {
    if (typeof window.confetti === 'function') {
      const end = Date.now() + 1400;

      const frame = function () {
        window.confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.75 },
          colors: pastelColors
        });
        window.confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.75 },
          colors: pastelColors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      // Big center burst
      setTimeout(function () {
        window.confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.55 },
          colors: pastelColors,
          gravity: 0.75
        });
      }, 250);
    } else {
      triggerFallbackBurst(80, 0.5, 0.5);
    }
  }

  function startAmbientConfettiDrift() {
    if (ambientConfettiTimer) return;
    
    ambientConfettiTimer = setInterval(function () {
      if (document.hidden) return;
      if (typeof window.confetti === 'function') {
        window.confetti({
          particleCount: 3,
          angle: 90,
          spread: 60,
          origin: { x: Math.random() * 0.8 + 0.1, y: -0.05 },
          colors: pastelColors,
          gravity: 0.4,
          drift: (Math.random() - 0.5) * 0.6,
          scalar: 0.75,
          ticks: 280,
          disableForReducedMotion: true
        });
      }
    }, 1800);
  }

  // Pure Vanilla Canvas Confetti Fallback
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let fallbackParticles = [];
  let isCanvasAnimating = false;

  function resizeCanvas() {
    if (!canvas || !cardStage) return;
    canvas.width = cardStage.clientWidth;
    canvas.height = cardStage.clientHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function triggerFallbackBurst(count, normX, normY) {
    if (!ctx || !canvas) return;
    resizeCanvas();
    const originX = normX * canvas.width;
    const originY = normY * canvas.height;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 3;
      fallbackParticles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 6 + 4,
        color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 8,
        alpha: 1,
        life: 1
      });
    }

    if (!isCanvasAnimating) {
      isCanvasAnimating = true;
      requestAnimationFrame(updateFallbackCanvas);
    }
  }

  function updateFallbackCanvas() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = fallbackParticles.length - 1; i >= 0; i--) {
      const p = fallbackParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // Gravity
      p.vx *= 0.98;
      p.rotation += p.vRot;
      p.life -= 0.012;
      p.alpha = Math.max(0, p.life);

      if (p.life <= 0 || p.y > canvas.height + 20) {
        fallbackParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }

    if (fallbackParticles.length > 0) {
      requestAnimationFrame(updateFallbackCanvas);
    } else {
      isCanvasAnimating = false;
    }
  }

  // =========================================================================
  // INTERACTION FLOW
  // =========================================================================

  // STEP 1 -> STEP 2: Turn on the lights!
  function turnOnTheLights() {
    if (lightsOn) return;
    lightsOn = true;

    // Tactile sound: Switch click + warm chord shimmer
    playSwitchClick();

    // Smoothly animate the dark room overlay away (~500ms transition)
    if (roomDimmer) {
      roomDimmer.classList.add('lights-on');
    }

    // Activate glowing fairy lights along the bunting
    if (fairyLights) {
      fairyLights.classList.add('active');
    }

    // Play background music if not already started
    if (!isMusicPlaying) {
      toggleMusic(true);
    }

    // Confetti celebrations
    triggerCelebratoryBurst();
    startAmbientConfettiDrift();

    // Advance to Step 2
    goToStep(2);
  }

  if (turnOnLightsBtn) {
    turnOnLightsBtn.addEventListener('click', function () {
      getAudioContext();
      turnOnTheLights();
    });
  }

  if (lanternWrapper) {
    lanternWrapper.addEventListener('click', function () {
      getAudioContext();
      turnOnTheLights();
    });
    lanternWrapper.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        getAudioContext();
        turnOnTheLights();
      }
    });
  }

  // STEP 2 -> STEP 3: Open Card
  if (openCardBtn) {
    openCardBtn.addEventListener('click', function () {
      getAudioContext();
      goToStep(3);
      playPaperSwipe();
    });
  }

  // STEP 3 -> STEP 4: Time for Cake!
  if (timeForCakeBtn) {
    timeForCakeBtn.addEventListener('click', function () {
      getAudioContext();
      goToStep(4);
      playPaperSwipe();
    });
  }

  // STEP 4: Extinguish Candles on Tap & Make a Wish
  function extinguishCandles() {
    if (!candlesLit) return;
    candlesLit = false;

    // Play whoosh + celebratory sparkle bells
    playCandleBlowout();

    // Extinguish each SVG flame
    const flames = document.querySelectorAll('.svg-flame, .flame-group');
    flames.forEach(function (flame) {
      flame.classList.add('extinguished');
    });

    // Fade out candlelight halo
    if (cakeCandlelightHalo) {
      cakeCandlelightHalo.classList.add('extinguished');
    }

    // Animate rising smoke wisps
    const smokes = document.querySelectorAll('.svg-smoke, .smoke-wisp');
    smokes.forEach(function (smoke) {
      smoke.classList.add('rising');
    });

    // Hide Prompt Pill
    if (cakePrompt) {
      cakePrompt.style.opacity = '0';
      setTimeout(function () {
        cakePrompt.style.display = 'none';
      }, 300);
    }

    // Launch Grand Celebration Confetti
    triggerGrandFinaleConfetti();

    // Reveal Wish Card
    setTimeout(function () {
      if (wishRevealCard) {
        wishRevealCard.classList.remove('hide');
      }
    }, 350);
  }

  if (cakeClickTarget) {
    cakeClickTarget.addEventListener('click', function () {
      getAudioContext();
      extinguishCandles();
    });
    cakeClickTarget.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        getAudioContext();
        extinguishCandles();
      }
    });
  }

  // Replay Functionality
  if (replayBtn) {
    replayBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      getAudioContext();
      playPaperSwipe();

      // Relight candles
      candlesLit = true;
      const flames = document.querySelectorAll('.svg-flame, .flame-group');
      flames.forEach(function (flame) {
        flame.classList.remove('extinguished');
      });

      // Restore candlelight halo
      if (cakeCandlelightHalo) {
        cakeCandlelightHalo.classList.remove('extinguished');
      }

      const smokes = document.querySelectorAll('.svg-smoke, .smoke-wisp');
      smokes.forEach(function (smoke) {
        smoke.classList.remove('rising');
      });

      // Reset prompt and hide reveal card
      if (wishRevealCard) {
        wishRevealCard.classList.add('hide');
      }
      if (cakePrompt) {
        cakePrompt.style.display = 'inline-flex';
        cakePrompt.style.opacity = '1';
      }

      // Return to Step 2 (Greeting) with lights still beautifully on!
      goToStep(2);
      triggerCelebratoryBurst();
    });
  }

  // Initialize
  initAudioControls();
  goToStep(1);

})();

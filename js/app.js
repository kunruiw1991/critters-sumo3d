(function () {
  'use strict';

  // --- Boot Robustness Guard ---
  if (typeof window.THREE === 'undefined' || parseInt(window.THREE.REVISION, 10) < 155) {
    const wrap = document.getElementById('game-wrap');
    if (wrap) {
      wrap.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:64px;color:#ffe047;">⚠️ 🔄</div>';
    }
    return;
  }

  // --- 8 Selectable Smiling Critters (Each with Unique Gameplay Stats & 3D Top Accessory) ---
  const CRITTERS = [
    { id: 'catnap',     emoji: '🐱', icon: 'icons/catnap.jpg',     color: 0x9b5de5, rim: 0xc77dff, mass: 1.18, accel: 33, cdMult: [0.82, 1.0, 1.0], whirlBonus: 0.7, accessory: 'cat',      pips: '🌪️⚖️' },
    { id: 'dogday',     emoji: '🐶', icon: 'icons/dogday.jpg',     color: 0xff9f1c, rim: 0xffd166, mass: 1.22, accel: 34, cdMult: [0.95, 0.9, 0.95], whirlBonus: 0.2, accessory: 'dog',      pips: '⚡⚖️' },
    { id: 'picky',      emoji: '🐷', icon: 'icons/picky.jpg',      color: 0xff5d8f, rim: 0xff9ebb, mass: 1.32, accel: 29, cdMult: [1.0, 1.0, 0.80], whirlBonus: 0.0, accessory: 'pig',      pips: '💥⚖️' },
    { id: 'craftycorn', emoji: '🦄', icon: 'icons/craftycorn.jpg', color: 0x00bbf9, rim: 0x90e0ef, mass: 1.08, accel: 35, cdMult: [0.88, 0.88, 0.88], whirlBonus: 0.4, accessory: 'unicorn',  pips: '🌈⚡' },
    { id: 'kickin',     emoji: '🐥', icon: 'icons/kickin.jpg',     color: 0xfee440, rim: 0xfff3b0, mass: 0.96, accel: 38, cdMult: [0.90, 0.80, 1.0], whirlBonus: 0.0, accessory: 'chick',    pips: '⚡💨' },
    { id: 'bobby',      emoji: '🐻', icon: 'icons/bobby.jpg',      color: 0xe63946, rim: 0xff758f, mass: 1.28, accel: 30, cdMult: [1.0, 1.0, 0.78], whirlBonus: 0.0, accessory: 'bear',     pips: '💥🛡️' },
    { id: 'hoppy',      emoji: '🐰', icon: 'icons/hoppy.jpg',      color: 0x06d6a0, rim: 0x80ffdb, mass: 1.02, accel: 37, cdMult: [1.0, 0.76, 1.0], whirlBonus: 0.0, accessory: 'bunny',    pips: '⚡🐰' },
    { id: 'bubba',      emoji: '🐘', icon: 'icons/bubba.jpg',      color: 0x4361ee, rim: 0x4cc9f0, mass: 1.38, accel: 27, cdMult: [1.0, 1.0, 0.84], whirlBonus: 0.0, accessory: 'elephant', pips: '🛡️⚖️' }
  ];

  // --- 8 Radically Distinct Floating Sky-Ring Stage Themes (All > ΔE 25 Apart in Sky, Deck & Rim) ---
  const STAGES = [
    { id: 0, theme: 'sunny',    emoji: '🌤️', radius: 17.5, minRadius: 10.5, duration: 38, deckColor: 0x4ade80, rimColor: 0xfacc15, posts: 3, postRadius: 8.5, aiSkill: 0.45, skyTop: 0x38bdf8, skyHorizon: 0xbae6fd, skyBot: 0xfef08a, cloudColor: 0xffffff },
    { id: 1, theme: 'rainbow',  emoji: '🌈', radius: 17.0, minRadius: 10.0, duration: 40, deckColor: 0xa855f7, rimColor: 0x00f5d4, posts: 4, postRadius: 8.8, aiSkill: 0.52, skyTop: 0xf472b6, skyHorizon: 0xc084fc, skyBot: 0x7dd3fc, cloudColor: 0xffe4f3 },
    { id: 2, theme: 'candy',    emoji: '🍭', radius: 16.8, minRadius: 9.8,  duration: 40, deckColor: 0xff477e, rimColor: 0xffffff, posts: 4, postRadius: 7.8, aiSkill: 0.60, skyTop: 0xff85b3, skyHorizon: 0xffd6e8, skyBot: 0xb8f2ff, cloudColor: 0xfff0f6 },
    { id: 3, theme: 'carnival', emoji: '🎪', radius: 16.5, minRadius: 9.5,  duration: 42, deckColor: 0xf97316, rimColor: 0xef4444, posts: 5, postRadius: 8.6, aiSkill: 0.68, skyTop: 0x4338ca, skyHorizon: 0xd946ef, skyBot: 0xfbbf24, cloudColor: 0xfef3c7 },
    { id: 4, theme: 'star',     emoji: '⭐', radius: 16.2, minRadius: 9.2,  duration: 42, deckColor: 0x0d9488, rimColor: 0xfde047, posts: 5, postRadius: 7.4, aiSkill: 0.75, skyTop: 0x0f172a, skyHorizon: 0x1d4ed8, skyBot: 0x38bdf8, cloudColor: 0xbae6fd },
    { id: 5, theme: 'space',    emoji: '🚀', radius: 16.0, minRadius: 9.0,  duration: 44, deckColor: 0x2563eb, rimColor: 0xf43f5e, posts: 6, postRadius: 8.2, aiSkill: 0.82, skyTop: 0x090418, skyHorizon: 0x3b0764, skyBot: 0x06b6d4, cloudColor: null },
    { id: 6, theme: 'volcano',  emoji: '🌋', radius: 15.8, minRadius: 8.8,  duration: 45, deckColor: 0x991b1b, rimColor: 0xff9e00, posts: 6, postRadius: 7.5, aiSkill: 0.89, skyTop: 0x450a0a, skyHorizon: 0xea580c, skyBot: 0xfde047, cloudColor: 0x44403c },
    { id: 7, theme: 'royal',    emoji: '👑', radius: 15.5, minRadius: 8.5,  duration: 46, deckColor: 0xd97706, rimColor: 0x38bdf8, posts: 7, postRadius: 8.0, aiSkill: 0.95, skyTop: 0x3b0764, skyHorizon: 0x9333ea, skyBot: 0xfde68a, cloudColor: 0xfef9c3 }
  ];

  // --- Synthesized Web Audio SFX (Normalized Impact Range + Noise 'Thock' + Coin Ding + Fever Fanfare) ---
  const SFX = {
    ctx: null,
    noiseBuf: null,
    muted: false,
    lastTeeterTime: 0,
    ensure() {
      if (this.muted) return null;
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) {
          this.ctx = new AC();
          const sr = this.ctx.sampleRate || 44100;
          const len = Math.floor(sr * 0.08);
          this.noiseBuf = this.ctx.createBuffer(1, len, sr);
          const data = this.noiseBuf.getChannelData(0);
          for (let i = 0; i < len; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.3));
          }
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    },
    playBump(normK) {
      const ctx = this.ensure();
      if (!ctx) return;
      const k = Math.max(0, Math.min(1, normK));
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = k > 0.55 ? 'sawtooth' : 'triangle';
      const startHz = 140 + 280 * k;
      osc.frequency.setValueAtTime(startHz, now);
      osc.frequency.exponentialRampToValueAtTime(48 + 25 * k, now + 0.14);
      const peakGain = 0.07 + 0.23 * k;
      gain.gain.setValueAtTime(peakGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);

      if (k > 0.55 && this.noiseBuf) {
        const src = ctx.createBufferSource();
        src.buffer = this.noiseBuf;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.18 * k, now);
        ng.gain.exponentialRampToValueAtTime(0.001, now + 0.075);
        src.connect(ng);
        ng.connect(ctx.destination);
        src.start(now);
      }
    },
    playCoinDing(stepIdx) {
      const ctx = this.ensure();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const freq = 660 * Math.pow(1.08, stepIdx % 8);
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.09);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.11);
    },
    playTeeter() {
      const nowMs = performance.now();
      if (nowMs - this.lastTeeterTime < 420) return;
      this.lastTeeterTime = nowMs;
      const ctx = this.ensure();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.linearRampToValueAtTime(590, now + 0.12);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    },
    playPedal(type) {
      const ctx = this.ensure();
      if (!ctx) return;
      const now = ctx.currentTime;
      if (type === 1) {
        // 🌪️ Whirlwind Spin: dual-detuned cyclone harmonic sweep
        [1, 1.06].forEach((detune, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx === 0 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(220 * detune, now);
          osc.frequency.exponentialRampToValueAtTime(720 * detune, now + 0.16);
          osc.frequency.exponentialRampToValueAtTime(460 * detune, now + 0.28);
          gain.gain.setValueAtTime(0.13, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.29);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.30);
        });
      } else if (type === 2) {
        // ⚡ Rocket Ram: noise ignition burst + dual-octave jet boost sweep
        [185, 92.5].forEach((baseF, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx === 0 ? 'square' : 'sawtooth';
          osc.frequency.setValueAtTime(baseF, now);
          osc.frequency.exponentialRampToValueAtTime(baseF * 3.2, now + 0.24);
          gain.gain.setValueAtTime(idx === 0 ? 0.16 : 0.14, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.27);
        });
        if (this.noiseBuf) {
          const src = ctx.createBufferSource();
          src.buffer = this.noiseBuf;
          const ng = ctx.createGain();
          ng.gain.setValueAtTime(0.18, now);
          ng.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          src.connect(ng);
          ng.connect(ctx.destination);
          src.start(now);
        }
      } else {
        // 💥 Belly Shockwave: sub-bass seismic drop + percussive noise slam
        const sub = ctx.createOscillator();
        const subG = ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(165, now);
        sub.frequency.exponentialRampToValueAtTime(36, now + 0.32);
        subG.gain.setValueAtTime(0.28, now);
        subG.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
        sub.connect(subG);
        subG.connect(ctx.destination);
        sub.start(now);
        sub.stop(now + 0.35);

        const punch = ctx.createOscillator();
        const punchG = ctx.createGain();
        punch.type = 'triangle';
        punch.frequency.setValueAtTime(320, now);
        punch.frequency.exponentialRampToValueAtTime(55, now + 0.20);
        punchG.gain.setValueAtTime(0.18, now);
        punchG.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        punch.connect(punchG);
        punchG.connect(ctx.destination);
        punch.start(now);
        punch.stop(now + 0.23);

        if (this.noiseBuf) {
          const src = ctx.createBufferSource();
          src.buffer = this.noiseBuf;
          const ng = ctx.createGain();
          ng.gain.setValueAtTime(0.22, now);
          ng.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          src.connect(ng);
          ng.connect(ctx.destination);
          src.start(now);
        }
      }
    },
    playLaunch() {
      const ctx = this.ensure();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Sumo taiko drum thump + bright launch whistle sweep
      const drum = ctx.createOscillator();
      const drumG = ctx.createGain();
      drum.type = 'sine';
      drum.frequency.setValueAtTime(150, now);
      drum.frequency.exponentialRampToValueAtTime(48, now + 0.18);
      drumG.gain.setValueAtTime(0.24, now);
      drumG.gain.exponentialRampToValueAtTime(0.001, now + 0.20);
      drum.connect(drumG);
      drumG.connect(ctx.destination);
      drum.start(now);
      drum.stop(now + 0.21);

      [587.33, 880.0].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const t0 = now + 0.06 + i * 0.07;
        osc.frequency.setValueAtTime(freq, t0);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.12, t0 + 0.12);
        gain.gain.setValueAtTime(0.16, t0);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.15);
      });
    },
    playStar() {
      const ctx = this.ensure();
      if (!ctx) return;
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.045);
        gain.gain.setValueAtTime(0.14, now + i * 0.045);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.045 + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.045);
        osc.stop(now + i * 0.045 + 0.15);
      });
    },
    playFeverFanfare() {
      const ctx = this.ensure();
      if (!ctx) return;
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.18, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.19);
      });
    },
    playVictoryFanfare() {
      const ctx = this.ensure();
      if (!ctx) return;
      const now = ctx.currentTime;
      const notes = [
        { f: 523.25, t: 0.00, d: 0.12 },
        { f: 659.25, t: 0.09, d: 0.12 },
        { f: 783.99, t: 0.18, d: 0.12 },
        { f: 1046.50, t: 0.27, d: 0.36 },
        { f: 1318.51, t: 0.27, d: 0.36 }
      ];
      notes.forEach((n) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);
        gain.gain.setValueAtTime(0.16, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.02);
      });
    },
    playDefeatTrombone() {
      const ctx = this.ensure();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Classic 4-note descending "wah-wah-wah-waaaah" sad trombone
      const steps = [
        { f0: 392.00, f1: 375.00, t: 0.00, d: 0.18 },
        { f0: 369.99, f1: 353.00, t: 0.20, d: 0.18 },
        { f0: 349.23, f1: 333.00, t: 0.40, d: 0.18 },
        { f0: 329.63, f1: 246.94, t: 0.60, d: 0.46 }
      ];
      steps.forEach((s) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(s.f0, now + s.t);
        osc.frequency.linearRampToValueAtTime(s.f1, now + s.t + s.d);
        gain.gain.setValueAtTime(0.14, now + s.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + s.t + s.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + s.t);
        osc.stop(now + s.t + s.d + 0.02);
      });
    },
    playKO() {
      const ctx = this.ensure();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.35);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    }
  };

  // --- Persistent Progress ---
  const STORAGE_KEY = 'critters_sumo3d_save_v1';
  let saveState = {
    unlockedStage: 0,
    stageStars: [0, 0, 0, 0, 0, 0, 0, 0],
    selectedCritter: 'catnap'
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.unlockedStage === 'number') saveState.unlockedStage = Math.max(0, Math.min(7, parsed.unlockedStage));
      if (Array.isArray(parsed.stageStars) && parsed.stageStars.length === 8) saveState.stageStars = parsed.stageStars;
      if (parsed.selectedCritter && CRITTERS.some((c) => c.id === parsed.selectedCritter)) {
        saveState.selectedCritter = parsed.selectedCritter;
      }
    }
  } catch (_) {}

  function persistSave() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveState));
    } catch (_) {}
  }

  // --- Three.js Scene & Renderer Setup (r161 Optimized + PCFSoftShadowMap + Context Recovery) ---
  const canvas = document.getElementById('webgl-canvas');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (err) {
    const wrap = document.getElementById('game-wrap');
    if (wrap) {
      wrap.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:64px;color:#ffe047;">⚠️ 🔄</div>';
    }
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xbae6fd, 60, 175);

  const camera = new THREE.PerspectiveCamera(46, window.innerWidth / Math.max(1, window.innerHeight), 0.5, 240);
  let cameraMode = 0;
  let currentPitch = 0.80;
  let contextLost = false;
  let studioEnvRT = null;

  // --- Screen-Space Sky Gradient Texture (`scene.background = skyTex`) ---
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 16;
  skyCanvas.height = 256;
  const skyCtx = skyCanvas.getContext('2d');
  const skyTex = new THREE.CanvasTexture(skyCanvas);
  skyTex.colorSpace = THREE.SRGBColorSpace;
  scene.background = skyTex;

  function updateSkyGradient(topHex, horizonHex, botHex) {
    const topStr = '#' + topHex.toString(16).padStart(6, '0');
    const horStr = '#' + horizonHex.toString(16).padStart(6, '0');
    const botStr = '#' + botHex.toString(16).padStart(6, '0');
    const grad = skyCtx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, topStr);
    grad.addColorStop(0.52, horStr);
    grad.addColorStop(1.0, botStr);
    skyCtx.fillStyle = grad;
    skyCtx.fillRect(0, 0, 16, 256);
    skyTex.needsUpdate = true;
    if (scene.fog) {
      scene.fog.color.setHex(horizonHex);
    }
  }

  function buildStudioEnvironment() {
    if (studioEnvRT) {
      studioEnvRT.dispose();
      studioEnvRT = null;
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x3a247a);
    const panelGeo = new THREE.PlaneGeometry(20, 20);
    const topMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const topPanel = new THREE.Mesh(panelGeo, topMat);
    topPanel.position.set(0, 15, 0);
    topPanel.rotation.x = Math.PI / 2;
    envScene.add(topPanel);

    const warmMat = new THREE.MeshBasicMaterial({ color: 0xffbe0b });
    const warmPanel = new THREE.Mesh(panelGeo, warmMat);
    warmPanel.position.set(15, 6, 12);
    warmPanel.lookAt(0, 0, 0);
    envScene.add(warmPanel);

    const coolMat = new THREE.MeshBasicMaterial({ color: 0x00f5d4 });
    const coolPanel = new THREE.Mesh(panelGeo, coolMat);
    coolPanel.position.set(-15, 6, -12);
    coolPanel.lookAt(0, 0, 0);
    envScene.add(coolPanel);

    studioEnvRT = pmrem.fromScene(envScene, 0.04);
    scene.environment = studioEnvRT.texture;
    panelGeo.dispose();
    topMat.dispose();
    warmMat.dispose();
    coolMat.dispose();
    pmrem.dispose();
  }
  buildStudioEnvironment();

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    contextLost = true;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    contextLost = false;
    buildStudioEnvironment();
  });

  // Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x3a1c71, 0.85);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xfff8e7, 3.6);
  dirLight.position.set(16, 32, 20);
  dirLight.castShadow = true;
  const isTouchOrHiDPI = (window.devicePixelRatio || 1) > 1.5 || ('ontouchstart' in window);
  const shadowRes = isTouchOrHiDPI ? 1024 : 2048;
  dirLight.shadow.mapSize.set(shadowRes, shadowRes);
  dirLight.shadow.bias = -0.0005;
  dirLight.shadow.normalBias = 0.03;
  dirLight.shadow.camera.near = 10;
  dirLight.shadow.camera.far = 80;
  scene.add(dirLight);

  const rimLight = new THREE.DirectionalLight(0x00f5d4, 1.35);
  rimLight.position.set(-20, 18, -16);
  scene.add(rimLight);

  // --- Soft Radial-Gradient Contact Shadow Texture, Stripe Texture & Emoji Fallbacks ---
  function createSoftShadowBlobTexture() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 8, 64, 64, 62);
    grad.addColorStop(0.0, 'rgba(6, 2, 18, 0.72)');
    grad.addColorStop(0.55, 'rgba(6, 2, 18, 0.34)');
    grad.addColorStop(1.0, 'rgba(6, 2, 18, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  const shadowBlobTexture = createSoftShadowBlobTexture();

  function createCandyStripeTexture() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#ff2a85';
    for (let i = -128; i < 256; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 16, 0);
      ctx.lineTo(i + 16 + 128, 128);
      ctx.lineTo(i + 128, 128);
      ctx.closePath();
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }
  const candyStripeTexture = createCandyStripeTexture();

  function createEmojiFallback(critter) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');
    const hex = '#' + critter.color.toString(16).padStart(6, '0');
    const rimHex = '#' + critter.rim.toString(16).padStart(6, '0');
    const grad = ctx.createRadialGradient(128, 100, 16, 128, 128, 124);
    grad.addColorStop(0, rimHex);
    grad.addColorStop(1, hex);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(128, 128, 124, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#ffe047';
    ctx.stroke();
    ctx.font = '132px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(critter.emoji, 128, 136);
    const dataUrl = c.toDataURL('image/png');
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.generateMipmaps = true;
    return { dataUrl, tex };
  }

  // --- Texture Cache with LoadingManager, Pre-Upload initTexture & Fallback ---
  const textureCache = {};
  const fallbackCache = {};
  let assetsReady = false;

  CRITTERS.forEach((c) => {
    const fb = createEmojiFallback(c);
    fallbackCache[c.id] = fb;
    c.fallbackDataUrl = fb.dataUrl;
    textureCache[c.id] = fb.tex;
  });

  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy ? renderer.capabilities.getMaxAnisotropy() : 4);
  const loadingManager = new THREE.LoadingManager(
    () => {
      assetsReady = true;
    },
    undefined,
    () => {
      assetsReady = true;
    }
  );
  const texLoader = new THREE.TextureLoader(loadingManager);

  CRITTERS.forEach((c) => {
    texLoader.load(
      c.icon,
      (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.generateMipmaps = true;
        loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
        loadedTex.magFilter = THREE.LinearFilter;
        loadedTex.anisotropy = maxAniso;
        try {
          renderer.initTexture(loadedTex);
        } catch (_) {}
        textureCache[c.id] = loadedTex;
        bumpers.forEach((b) => {
          if (b.critter.id === c.id && b.visual && b.visual.medMat) {
            b.visual.medMat.map = loadedTex;
            b.visual.medMat.needsUpdate = true;
          }
        });
      },
      undefined,
      () => {
        textureCache[c.id] = fallbackCache[c.id].tex;
      }
    );
  });

  function attachImgFallback(imgEl, critter) {
    if (!imgEl || !critter) return;
    imgEl.onerror = function () {
      if (this.src !== critter.fallbackDataUrl) {
        this.src = critter.fallbackDataUrl;
      }
    };
  }

  // --- Shared Reusable Geometries & Materials (Zero GPU Leak) ---
  const SHARED_GEO = {
    topBody: new THREE.CylinderGeometry(1.55, 0.92, 0.95, 28),
    topRim: new THREE.TorusGeometry(1.52, 0.24, 16, 32),
    topTip: new THREE.ConeGeometry(0.45, 0.65, 20),
    medallion: new THREE.CircleGeometry(1.18, 28),
    medallionRing: new THREE.RingGeometry(1.14, 1.38, 28),
    playerOuterRing: new THREE.RingGeometry(1.38, 1.56, 28),
    playerFloorHalo: new THREE.RingGeometry(1.82, 2.25, 32),
    playerChevron: new THREE.ConeGeometry(0.38, 0.62, 4),
    shadowDecal: new THREE.PlaneGeometry(3.8, 3.8),
    whirlRing: new THREE.TorusGeometry(2.25, 0.14, 12, 28),
    ramFlameCone: new THREE.ConeGeometry(1.35, 2.9, 16, 1, true),
    crown: new THREE.ConeGeometry(0.42, 0.55, 6),
    earCone: new THREE.ConeGeometry(0.34, 0.62, 12),
    earSphere: new THREE.SphereGeometry(0.36, 12, 10),
    bunnyEar: new THREE.CylinderGeometry(0.18, 0.22, 0.85, 10),
    unicornHorn: new THREE.ConeGeometry(0.24, 0.88, 12),
    postBody: new THREE.CylinderGeometry(1.05, 1.15, 1.6, 24),
    postBumper: new THREE.TorusGeometry(1.15, 0.26, 14, 24),
    tentRoof: new THREE.ConeGeometry(1.55, 1.15, 16),
    lollipopHead: new THREE.CylinderGeometry(1.4, 1.4, 0.42, 24),
    lollipopStick: new THREE.CylinderGeometry(0.16, 0.16, 3.2, 10),
    volcanoCone: new THREE.ConeGeometry(2.8, 4.5, 12),
    planetSphere: new THREE.SphereGeometry(5.2, 20, 16),
    planetRing: new THREE.RingGeometry(6.8, 9.6, 36),
    starOcta: new THREE.OctahedronGeometry(0.85, 0),
    starRing: new THREE.RingGeometry(0.95, 1.25, 24),
    sparkBox: new THREE.OctahedronGeometry(0.24, 0),
    starCoinBody: new THREE.CylinderGeometry(0.46, 0.46, 0.12, 20),
    starCoinStar: new THREE.OctahedronGeometry(0.28, 0),
    shockwaveRing: new THREE.RingGeometry(0.82, 1.0, 36),
    cloudPuff: new THREE.SphereGeometry(2.4, 12, 10)
  };

  // --- Arena Group & Dynamic Theme Props ---
  const arenaGroup = new THREE.Group();
  scene.add(arenaGroup);

  let deckMesh = null;
  let outerDangerZoneMesh = null;
  let innerRingMesh = null;
  let edgeRopeMesh = null;
  let stagePosts = [];
  let stageClouds = [];
  let stageAnimatedProps = [];

  function clearArenaMeshes() {
    arenaGroup.traverse((obj) => {
      if (obj.userData && obj.userData.disposeGeo && obj.geometry) {
        obj.geometry.dispose();
      }
      if (obj.userData && obj.userData.disposeMat && obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    });
    while (arenaGroup.children.length > 0) {
      arenaGroup.remove(arenaGroup.children[0]);
    }
    stagePosts = [];
    stageClouds = [];
    stageAnimatedProps = [];
  }

  function buildArenaForStage(stageCfg) {
    clearArenaMeshes();
    updateSkyGradient(stageCfg.skyTop, stageCfg.skyHorizon, stageCfg.skyBot);

    const iconEl = document.getElementById('stage-theme-icon');
    if (iconEl) iconEl.textContent = stageCfg.emoji;
    const modalStageEl = document.getElementById('modal-stage-icon');
    if (modalStageEl) modalStageEl.textContent = stageCfg.emoji;

    const shadowExtent = stageCfg.radius + 3.2;
    dirLight.shadow.camera.left = -shadowExtent;
    dirLight.shadow.camera.right = shadowExtent;
    dirLight.shadow.camera.top = shadowExtent;
    dirLight.shadow.camera.bottom = -shadowExtent;
    dirLight.shadow.camera.updateProjectionMatrix();

    const deckGeo = new THREE.CylinderGeometry(1, 0.88, 1.8, 64);
    const deckMat = new THREE.MeshStandardMaterial({
      color: stageCfg.deckColor,
      roughness: stageCfg.theme === 'royal' ? 0.32 : 0.52,
      metalness: stageCfg.theme === 'royal' ? 0.45 : 0.08
    });
    deckMesh = new THREE.Mesh(deckGeo, deckMat);
    deckMesh.position.y = -0.9;
    deckMesh.scale.set(stageCfg.radius, 1, stageCfg.radius);
    deckMesh.receiveShadow = true;
    deckMesh.userData = { disposeGeo: true, disposeMat: true };
    arenaGroup.add(deckMesh);

    const ropeGeo = new THREE.TorusGeometry(0.96, 0.035, 14, 64);
    const ropeMat = new THREE.MeshStandardMaterial({
      color: stageCfg.rimColor,
      emissive: stageCfg.rimColor,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.6
    });
    edgeRopeMesh = new THREE.Mesh(ropeGeo, ropeMat);
    edgeRopeMesh.rotation.x = Math.PI / 2;
    edgeRopeMesh.position.y = 0.03;
    edgeRopeMesh.scale.set(stageCfg.radius, stageCfg.radius, 1);
    edgeRopeMesh.userData = { disposeGeo: true, disposeMat: true };
    arenaGroup.add(edgeRopeMesh);

    const innerGeo = new THREE.RingGeometry(3.6, 4.1, 48);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    innerRingMesh = new THREE.Mesh(innerGeo, innerMat);
    innerRingMesh.rotation.x = -Math.PI / 2;
    innerRingMesh.position.y = 0.02;
    innerRingMesh.userData = { disposeGeo: true, disposeMat: true };
    arenaGroup.add(innerRingMesh);

    const dangerGeo = new THREE.RingGeometry(0.86, 1.0, 64);
    const dangerMat = new THREE.MeshBasicMaterial({
      color: 0xff3b6b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    outerDangerZoneMesh = new THREE.Mesh(dangerGeo, dangerMat);
    outerDangerZoneMesh.rotation.x = -Math.PI / 2;
    outerDangerZoneMesh.position.y = 0.015;
    outerDangerZoneMesh.scale.set(stageCfg.radius, stageCfg.radius, 1);
    outerDangerZoneMesh.userData = { disposeGeo: true, disposeMat: true };
    arenaGroup.add(outerDangerZoneMesh);

    const postBodyMat = new THREE.MeshStandardMaterial({
      color: stageCfg.theme === 'royal' ? 0xffd166 : stageCfg.theme === 'volcano' ? 0x292524 : 0xffffff,
      map: (stageCfg.theme === 'candy' || stageCfg.theme === 'carnival') ? candyStripeTexture : null,
      roughness: stageCfg.theme === 'royal' ? 0.2 : 0.3,
      metalness: stageCfg.theme === 'royal' ? 0.85 : 0.35
    });

    const postRingMat = new THREE.MeshStandardMaterial({
      color: stageCfg.rimColor,
      emissive: stageCfg.rimColor,
      emissiveIntensity: 0.38,
      roughness: 0.2,
      metalness: 0.72
    });

    const tentCapMat = new THREE.MeshStandardMaterial({
      color: stageCfg.rimColor,
      map: stageCfg.theme === 'carnival' ? candyStripeTexture : null,
      roughness: 0.3,
      metalness: 0.3
    });

    for (let i = 0; i < stageCfg.posts; i++) {
      const angle = (i / stageCfg.posts) * Math.PI * 2 + (stageCfg.id * 0.35);
      const px = Math.cos(angle) * stageCfg.postRadius;
      const pz = Math.sin(angle) * stageCfg.postRadius;

      const postGroup = new THREE.Group();
      postGroup.position.set(px, 0.8, pz);

      const pBody = new THREE.Mesh(SHARED_GEO.postBody, postBodyMat);
      pBody.castShadow = true;
      pBody.receiveShadow = true;
      if (i === 0) pBody.userData = { disposeMat: true };
      postGroup.add(pBody);

      const pRing = new THREE.Mesh(SHARED_GEO.postBumper, postRingMat);
      pRing.rotation.x = Math.PI / 2;
      pRing.position.y = 0.15;
      pRing.castShadow = true;
      if (i === 0) pRing.userData = { disposeMat: true };
      postGroup.add(pRing);

      if (stageCfg.theme === 'carnival') {
        const cap = new THREE.Mesh(SHARED_GEO.tentRoof, tentCapMat);
        cap.position.y = 1.25;
        cap.castShadow = true;
        if (i === 0) cap.userData = { disposeMat: true };
        postGroup.add(cap);
      } else if (stageCfg.theme === 'royal' || stageCfg.theme === 'star') {
        const jewel = new THREE.Mesh(SHARED_GEO.starOcta, postRingMat);
        jewel.position.y = 1.35;
        jewel.scale.setScalar(0.58);
        postGroup.add(jewel);
        stageAnimatedProps.push(jewel);
      } else if (stageCfg.theme === 'candy') {
        const lolli = new THREE.Mesh(SHARED_GEO.lollipopHead, postBodyMat);
        lolli.rotation.x = Math.PI / 2;
        lolli.position.y = 1.4;
        lolli.scale.setScalar(0.65);
        postGroup.add(lolli);
      } else if (i === 0) {
        tentCapMat.dispose();
      }

      arenaGroup.add(postGroup);
      stagePosts.push({
        x: px,
        z: pz,
        vx: 0,
        vz: 0,
        baseAngle: angle,
        orbitRadius: stageCfg.postRadius,
        radius: 1.38,
        mesh: postGroup,
        pulse: 0
      });
    }

    if (stageCfg.theme === 'rainbow') {
      const rainbowColors = [0xff0055, 0xff7700, 0xffdd00, 0x22dd55, 0x00bbff, 0x4455ff, 0xaa33ff];
      rainbowColors.forEach((col, bIdx) => {
        const arcGeo = new THREE.TorusGeometry(stageCfg.radius + 3.5 + bIdx * 0.55, 0.28, 10, 48, Math.PI);
        const arcMat = new THREE.MeshBasicMaterial({ color: col, fog: false });
        const arcMesh = new THREE.Mesh(arcGeo, arcMat);
        arcMesh.position.set(0, -1.0, -stageCfg.radius - 4.0);
        arcMesh.userData = { disposeGeo: true, disposeMat: true };
        arenaGroup.add(arcMesh);
      });
    } else if (stageCfg.theme === 'candy') {
      const stickMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const headMat = new THREE.MeshStandardMaterial({ map: candyStripeTexture, roughness: 0.25 });
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2 + 0.2;
        const r = stageCfg.radius + 3.8;
        const lg = new THREE.Group();
        lg.position.set(Math.cos(a) * r, 0.5, Math.sin(a) * r);
        lg.lookAt(0, 1.5, 0);
        const stick = new THREE.Mesh(SHARED_GEO.lollipopStick, stickMat);
        if (k === 0) stick.userData = { disposeMat: true };
        lg.add(stick);
        const head = new THREE.Mesh(SHARED_GEO.lollipopHead, headMat);
        head.rotation.x = Math.PI / 2;
        head.position.y = 2.1;
        if (k === 0) head.userData = { disposeMat: true };
        lg.add(head);
        arenaGroup.add(lg);
      }
    } else if (stageCfg.theme === 'star' || stageCfg.theme === 'space') {
      const starPts = [];
      for (let s = 0; s < 160; s++) {
        const ang = Math.random() * Math.PI * 2;
        const rad = stageCfg.radius + 6 + Math.random() * 42;
        const py = -14 + Math.random() * 34;
        starPts.push(Math.cos(ang) * rad, py, Math.sin(ang) * rad);
      }
      const ptGeo = new THREE.BufferGeometry();
      ptGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPts, 3));
      const ptMat = new THREE.PointsMaterial({ color: 0xfff3b0, size: 1.1, fog: false });
      const pts = new THREE.Points(ptGeo, ptMat);
      pts.userData = { disposeGeo: true, disposeMat: true };
      arenaGroup.add(pts);

      if (stageCfg.theme === 'space') {
        const planetGroup = new THREE.Group();
        planetGroup.position.set(-stageCfg.radius - 10, 6, -stageCfg.radius - 12);
        const pMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4, metalness: 0.3 });
        const planet = new THREE.Mesh(SHARED_GEO.planetSphere, pMat);
        planet.userData = { disposeMat: true };
        planetGroup.add(planet);

        const rMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.78, fog: false });
        const pring = new THREE.Mesh(SHARED_GEO.planetRing, rMat);
        pring.rotation.x = 1.15;
        pring.rotation.y = 0.35;
        pring.userData = { disposeMat: true };
        planetGroup.add(pring);
        arenaGroup.add(planetGroup);
        stageAnimatedProps.push(planetGroup);
      }
    } else if (stageCfg.theme === 'volcano') {
      const lavaGeo = new THREE.RingGeometry(stageCfg.radius * 0.7, stageCfg.radius + 7.5, 48);
      const lavaMat = new THREE.MeshBasicMaterial({ color: 0xff4500, side: THREE.DoubleSide, transparent: true, opacity: 0.65, fog: false });
      const lavaMesh = new THREE.Mesh(lavaGeo, lavaMat);
      lavaMesh.rotation.x = -Math.PI / 2;
      lavaMesh.position.y = -3.2;
      lavaMesh.userData = { disposeGeo: true, disposeMat: true };
      arenaGroup.add(lavaMesh);

      const cragMat = new THREE.MeshStandardMaterial({ color: 0x291515, emissive: 0x7f1d1d, emissiveIntensity: 0.35, roughness: 0.8 });
      for (let v = 0; v < 6; v++) {
        const va = (v / 6) * Math.PI * 2 + 0.4;
        const vr = stageCfg.radius + 5.5;
        const crag = new THREE.Mesh(SHARED_GEO.volcanoCone, cragMat);
        crag.position.set(Math.cos(va) * vr, -1.2, Math.sin(va) * vr);
        if (v === 0) crag.userData = { disposeMat: true };
        arenaGroup.add(crag);
      }
    }

    if (stageCfg.cloudColor !== null) {
      const cloudMat = new THREE.MeshStandardMaterial({ color: stageCfg.cloudColor, roughness: 0.85, metalness: 0.05 });
      for (let c = 0; c < 10; c++) {
        const ca = (c / 10) * Math.PI * 2;
        const cr = stageCfg.radius + 7 + (c % 3) * 3;
        const puff = new THREE.Mesh(SHARED_GEO.cloudPuff, cloudMat);
        puff.position.set(Math.cos(ca) * cr, -2.5 + (c % 3) * 1.4, Math.sin(ca) * cr);
        puff.scale.set(1.6, 0.75, 1.2);
        if (c === 0) puff.userData = { disposeMat: true };
        arenaGroup.add(puff);
        stageClouds.push({ mesh: puff, baseAngle: ca, radius: cr, yBase: puff.position.y });
      }
    }
  }

  // --- Single-Draw-Call InstancedMesh Spark System (120 Sparks, 20 Reserved for KOs) ---
  const SPARK_TOTAL = 120;
  const SPARK_KO_START = 100;
  const sparkInstMat = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false, toneMapped: false });
  const sparkInstMesh = new THREE.InstancedMesh(SHARED_GEO.sparkBox, sparkInstMat, SPARK_TOTAL);
  sparkInstMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const sparkDummy = new THREE.Object3D();
  const sparkColorTmp = new THREE.Color();
  const sparkData = [];
  for (let i = 0; i < SPARK_TOTAL; i++) {
    sparkDummy.position.set(0, -999, 0);
    sparkDummy.scale.setScalar(0);
    sparkDummy.updateMatrix();
    sparkInstMesh.setMatrixAt(i, sparkDummy.matrix);
    sparkInstMesh.setColorAt(i, sparkColorTmp.setHex(0xffe047));
    sparkData.push({
      x: 0, y: -999, z: 0,
      vx: 0, vy: 0, vz: 0,
      rx: 0, ry: 0,
      life: 0, maxLife: 0.45
    });
  }
  scene.add(sparkInstMesh);

  function spawnSparkBurst(x, y, z, colorHex, count, dirX, dirZ, isKO) {
    let spawned = 0;
    const startIdx = isKO ? SPARK_KO_START : 0;
    const endIdx = isKO ? SPARK_TOTAL : SPARK_KO_START;
    const hasDir = typeof dirX === 'number' && typeof dirZ === 'number' && (dirX !== 0 || dirZ !== 0);
    const baseAngle = hasDir ? Math.atan2(dirZ, dirX) : 0;
    sparkColorTmp.setHex(colorHex);

    for (let i = startIdx; i < endIdx && spawned < count; i++) {
      const s = sparkData[i];
      if (s.life <= 0) {
        s.life = 0.40 + Math.random() * 0.24;
        s.maxLife = s.life;
        s.x = x;
        s.y = Math.max(0.25, y);
        s.z = z;
        const ang = hasDir
          ? baseAngle + (Math.random() - 0.5) * 1.9
          : Math.random() * Math.PI * 2;
        const spd = 7 + Math.random() * 14;
        s.vx = Math.cos(ang) * spd;
        s.vy = 5.5 + Math.random() * 9.5;
        s.vz = Math.sin(ang) * spd;
        s.rx = Math.random() * 6;
        s.ry = Math.random() * 6;
        sparkInstMesh.setColorAt(i, sparkColorTmp);
        spawned++;
      }
    }
    if (spawned > 0 && sparkInstMesh.instanceColor) {
      sparkInstMesh.instanceColor.needsUpdate = true;
    }
  }

  // --- Pooled 3D Flying Star-Coins (`STAR_COIN_POOL_SIZE = 28`) ---
  const STAR_COIN_POOL_SIZE = 28;
  const starCoinPool = [];
  const coinBodyMat = new THREE.MeshStandardMaterial({
    color: 0xffe047,
    emissive: 0xff9f1c,
    emissiveIntensity: 0.65,
    roughness: 0.18,
    metalness: 0.88,
    fog: false
  });
  const coinStarMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    fog: false,
    toneMapped: false
  });

  for (let i = 0; i < STAR_COIN_POOL_SIZE; i++) {
    const coinGroup = new THREE.Group();
    const cyl = new THREE.Mesh(SHARED_GEO.starCoinBody, coinBodyMat);
    cyl.rotation.x = Math.PI / 2;
    coinGroup.add(cyl);

    const emblem = new THREE.Mesh(SHARED_GEO.starCoinStar, coinStarMat);
    emblem.scale.set(1.1, 1.1, 0.55);
    coinGroup.add(emblem);

    coinGroup.visible = false;
    scene.add(coinGroup);
    starCoinPool.push({
      group: coinGroup,
      active: false,
      age: 0,
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      targetIdx: 0,
      bonusPoints: 50,
      dingStep: 0
    });
  }

  function spawnFlyingStarCoins(x, y, z, targetBumperIdx, count, bonusPerCoin) {
    let spawned = 0;
    for (let i = 0; i < starCoinPool.length && spawned < count; i++) {
      const c = starCoinPool[i];
      if (!c.active) {
        c.active = true;
        c.age = 0;
        c.x = x;
        c.y = Math.max(0.6, y);
        c.z = z;
        const ang = (spawned / Math.max(1, count)) * Math.PI * 2 + Math.random() * 0.5;
        const hSpd = 4.5 + Math.random() * 4.2;
        c.vx = Math.cos(ang) * hSpd;
        c.vy = 9.5 + Math.random() * 4.0;
        c.vz = Math.sin(ang) * hSpd;
        c.targetIdx = targetBumperIdx >= 0 ? targetBumperIdx : 0;
        c.bonusPoints = bonusPerCoin || 50;
        c.dingStep = spawned;
        c.group.position.set(c.x, c.y, c.z);
        c.group.scale.setScalar(1.0);
        c.group.visible = true;
        spawned++;
      }
    }
  }

  // --- Shockwave Ring Pool ---
  const SHOCKWAVE_POOL_SIZE = 10;
  const shockwavePool = [];
  for (let i = 0; i < SHOCKWAVE_POOL_SIZE; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffbe0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
      fog: false,
      toneMapped: false
    });
    const mesh = new THREE.Mesh(SHARED_GEO.shockwaveRing, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.visible = false;
    scene.add(mesh);
    shockwavePool.push({ mesh, life: 0, maxLife: 0.32, targetRadius: 6.8 });
  }

  function spawnShockwaveRing(x, z, colorHex, targetRadius, duration) {
    for (let i = 0; i < shockwavePool.length; i++) {
      const sw = shockwavePool[i];
      if (sw.life <= 0) {
        sw.maxLife = duration || 0.32;
        sw.life = sw.maxLife;
        sw.targetRadius = targetRadius || 6.8;
        sw.mesh.position.set(x, 0.18, z);
        sw.mesh.scale.set(0.6, 0.6, 1);
        sw.mesh.material.color.setHex(colorHex);
        sw.mesh.material.opacity = 0.94;
        sw.mesh.visible = true;
        break;
      }
    }
  }

  // --- Collectible Growth Stars Pool (Max 4 Active on Arena) ---
  const STAR_COUNT = 4;
  const arenaStars = [];
  for (let i = 0; i < STAR_COUNT; i++) {
    const group = new THREE.Group();
    const octa = new THREE.Mesh(
      SHARED_GEO.starOcta,
      new THREE.MeshStandardMaterial({
        color: 0xffe047,
        emissive: 0xff9f1c,
        emissiveIntensity: 0.55,
        roughness: 0.15,
        metalness: 0.85
      })
    );
    octa.position.y = 1.15;
    octa.castShadow = true;
    group.add(octa);

    const halo = new THREE.Mesh(
      SHARED_GEO.starRing,
      new THREE.MeshBasicMaterial({ color: 0xffe047, side: THREE.DoubleSide, transparent: true, opacity: 0.55 })
    );
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.06;
    group.add(halo);

    scene.add(group);
    arenaStars.push({
      group,
      octa,
      x: 0,
      z: 0,
      active: true,
      respawnTimer: 0
    });
  }

  function relocateStar(star, maxR) {
    const r = (0.25 + Math.random() * 0.52) * maxR;
    const a = Math.random() * Math.PI * 2;
    star.x = Math.cos(a) * r;
    star.z = Math.sin(a) * r;
    star.active = true;
    star.respawnTimer = 0;
    star.group.position.set(star.x, 0, star.z);
    star.group.visible = true;
  }

  // --- Build Critter-Specific 3D Accessory on Spinning Top ---
  function attachCritterAccessory(spinGroup, critter, accMat) {
    const accGroup = new THREE.Group();
    accGroup.position.y = 0.42;
    if (critter.accessory === 'cat') {
      const e1 = new THREE.Mesh(SHARED_GEO.earCone, accMat);
      e1.position.set(-0.95, 0.25, 0);
      e1.rotation.z = 0.25;
      const e2 = new THREE.Mesh(SHARED_GEO.earCone, accMat);
      e2.position.set(0.95, 0.25, 0);
      e2.rotation.z = -0.25;
      accGroup.add(e1, e2);
    } else if (critter.accessory === 'unicorn') {
      const horn = new THREE.Mesh(SHARED_GEO.unicornHorn, accMat);
      horn.position.set(0, 0.38, 0.85);
      horn.rotation.x = 0.35;
      accGroup.add(horn);
    } else if (critter.accessory === 'bunny') {
      const b1 = new THREE.Mesh(SHARED_GEO.bunnyEar, accMat);
      b1.position.set(-0.75, 0.42, 0);
      const b2 = new THREE.Mesh(SHARED_GEO.bunnyEar, accMat);
      b2.position.set(0.75, 0.42, 0);
      accGroup.add(b1, b2);
    } else if (critter.accessory === 'bear' || critter.accessory === 'pig' || critter.accessory === 'dog') {
      const s1 = new THREE.Mesh(SHARED_GEO.earSphere, accMat);
      s1.position.set(-1.05, 0.18, 0);
      const s2 = new THREE.Mesh(SHARED_GEO.earSphere, accMat);
      s2.position.set(1.05, 0.18, 0);
      accGroup.add(s1, s2);
    } else if (critter.accessory === 'elephant') {
      const f1 = new THREE.Mesh(SHARED_GEO.earSphere, accMat);
      f1.scale.set(0.6, 1.3, 1.3);
      f1.position.set(-1.35, 0.12, 0);
      const f2 = new THREE.Mesh(SHARED_GEO.earSphere, accMat);
      f2.scale.set(0.6, 1.3, 1.3);
      f2.position.set(1.35, 0.12, 0);
      accGroup.add(f1, f2);
    } else if (critter.accessory === 'chick') {
      const c1 = new THREE.Mesh(SHARED_GEO.earCone, accMat);
      c1.position.set(0, 0.32, 0);
      accGroup.add(c1);
    }
    spinGroup.add(accGroup);
  }

  // --- 5 Sumo Bumper-Top Competitors ---
  const bumpers = [];

  function createBumperMesh(critter, isPlayer) {
    const root = new THREE.Group();

    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowBlobTexture,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(SHARED_GEO.shadowDecal, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.04;
    root.add(shadowMesh);

    let playerHaloMesh = null;
    let playerHaloMat = null;
    if (isPlayer) {
      playerHaloMat = new THREE.MeshBasicMaterial({
        color: 0xffe047,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
        fog: false,
        toneMapped: false
      });
      playerHaloMesh = new THREE.Mesh(SHARED_GEO.playerFloorHalo, playerHaloMat);
      playerHaloMesh.rotation.x = -Math.PI / 2;
      playerHaloMesh.position.y = 0.06;
      root.add(playerHaloMesh);
    }

    const tiltGroup = new THREE.Group();
    tiltGroup.position.y = 0.88;
    root.add(tiltGroup);

    const spinGroup = new THREE.Group();
    tiltGroup.add(spinGroup);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: critter.color,
      emissive: 0xffffff,
      emissiveIntensity: 0.0,
      roughness: 0.28,
      metalness: 0.45
    });
    const bodyMesh = new THREE.Mesh(SHARED_GEO.topBody, bodyMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    spinGroup.add(bodyMesh);

    const rimMat = new THREE.MeshStandardMaterial({
      color: critter.rim,
      emissive: critter.color,
      emissiveIntensity: 0.28,
      roughness: 0.16,
      metalness: 0.85
    });
    const rimMesh = new THREE.Mesh(SHARED_GEO.topRim, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.12;
    rimMesh.castShadow = true;
    spinGroup.add(rimMesh);

    attachCritterAccessory(spinGroup, critter, rimMat);

    const tipMat = new THREE.MeshStandardMaterial({
      color: 0xffe047,
      roughness: 0.25,
      metalness: 0.8
    });
    const tipMesh = new THREE.Mesh(SHARED_GEO.topTip, tipMat);
    tipMesh.rotation.x = Math.PI;
    tipMesh.position.y = -0.62;
    tipMesh.castShadow = true;
    spinGroup.add(tipMesh);

    // Pedal 1: Whirlwind Spin Dual Vortex Aura Rings
    const whirlMat = new THREE.MeshBasicMaterial({
      color: 0x00f5d4,
      transparent: true,
      opacity: 0.0,
      fog: false,
      toneMapped: false
    });
    const whirlMesh = new THREE.Mesh(SHARED_GEO.whirlRing, whirlMat);
    whirlMesh.rotation.x = Math.PI / 2;
    whirlMesh.position.y = 0.18;
    spinGroup.add(whirlMesh);

    // Pedal 2: Rocket Ram 3D Flame Dash Cone Aura
    const ramAuraMat = new THREE.MeshBasicMaterial({
      color: 0xff9e00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
      fog: false,
      toneMapped: false
    });
    const ramAuraMesh = new THREE.Mesh(SHARED_GEO.ramFlameCone, ramAuraMat);
    ramAuraMesh.rotation.x = -Math.PI / 2;
    ramAuraMesh.position.y = 0.15;
    tiltGroup.add(ramAuraMesh);

    const badgeGroup = new THREE.Group();
    badgeGroup.position.y = 3.0;
    root.add(badgeGroup);

    const medMat = new THREE.MeshBasicMaterial({
      map: textureCache[critter.id],
      toneMapped: false,
      fog: false
    });
    const medMesh = new THREE.Mesh(SHARED_GEO.medallion, medMat);
    badgeGroup.add(medMesh);

    const ringMat = new THREE.MeshBasicMaterial({
      color: isPlayer ? 0xffe047 : 0xffffff,
      side: THREE.DoubleSide,
      toneMapped: false,
      fog: false
    });
    const ringMesh = new THREE.Mesh(SHARED_GEO.medallionRing, ringMat);
    ringMesh.position.z = 0.01;
    badgeGroup.add(ringMesh);

    let playerChevronMesh = null;
    let playerOuterMat = null;
    if (isPlayer) {
      playerOuterMat = new THREE.MeshBasicMaterial({
        color: 0xff9f1c,
        side: THREE.DoubleSide,
        toneMapped: false,
        fog: false
      });
      const outerRing = new THREE.Mesh(SHARED_GEO.playerOuterRing, playerOuterMat);
      outerRing.position.z = 0.015;
      badgeGroup.add(outerRing);

      playerChevronMesh = new THREE.Mesh(SHARED_GEO.playerChevron, ringMat);
      playerChevronMesh.rotation.x = Math.PI;
      playerChevronMesh.position.set(0, 2.05, 0.02);
      badgeGroup.add(playerChevronMesh);
    }

    const crownMat = new THREE.MeshStandardMaterial({
      color: 0xffe047,
      emissive: 0xff9f1c,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.9,
      fog: false
    });
    const crownMesh = new THREE.Mesh(SHARED_GEO.crown, crownMat);
    crownMesh.position.set(0, 1.56, 0.02);
    crownMesh.visible = false;
    badgeGroup.add(crownMesh);

    scene.add(root);
    return {
      root,
      tiltGroup,
      spinGroup,
      badgeGroup,
      bodyMat,
      medMat,
      whirlMesh,
      whirlMat,
      ramAuraMesh,
      ramAuraMat,
      rimMat,
      ringMat,
      crownMesh,
      shadowMesh,
      shadowMat,
      playerHaloMesh,
      playerHaloMat,
      playerChevronMesh,
      dispose() {
        scene.remove(root);
        shadowMat.dispose();
        if (playerHaloMat) playerHaloMat.dispose();
        if (playerOuterMat) playerOuterMat.dispose();
        bodyMat.dispose();
        rimMat.dispose();
        tipMat.dispose();
        whirlMat.dispose();
        ramAuraMat.dispose();
        medMat.dispose();
        ringMat.dispose();
        crownMat.dispose();
      }
    };
  }

  // --- Persistent Standings Chips ---
  const standingChipNodes = [];
  function initStandingsDOM() {
    const standingsEl = document.getElementById('live-standings');
    if (!standingsEl || standingChipNodes.length === 5) return;
    standingsEl.innerHTML = '';
    for (let i = 0; i < 5; i++) {
      const chip = document.createElement('div');
      chip.className = 'standing-chip';
      const medalSpan = document.createElement('span');
      medalSpan.className = 'standing-medal';
      const img = document.createElement('img');
      img.alt = '';
      const pipsDiv = document.createElement('div');
      pipsDiv.className = 'standing-pips';
      const pipSpans = [];
      for (let p = 0; p < 5; p++) {
        const ps = document.createElement('span');
        ps.className = 'ko-pip';
        ps.style.display = 'none';
        pipsDiv.appendChild(ps);
        pipSpans.push(ps);
      }
      chip.appendChild(medalSpan);
      chip.appendChild(img);
      chip.appendChild(pipsDiv);
      standingsEl.appendChild(chip);
      standingChipNodes.push({ chip, medalSpan, img, pipSpans, lastCritterId: '' });
    }
  }
  initStandingsDOM();

  // --- Game State ---
  let currentStageIdx = saveState.unlockedStage || 0;
  let currentStage = STAGES[currentStageIdx];
  let currentRadius = currentStage.radius;
  let stageElapsed = 0;
  let roundEnded = false;
  let selectOverlayOpen = true;
  let screenShake = 0;
  let hitStopTimer = 0;
  let feverMeter = 0;
  let feverTimer = 0;
  let physAccum = 0;
  let fxTrailTick = 0;
  let koFocusX = 0;
  let koFocusZ = 0;
  let koFocusTimer = 0;

  const pairCooldowns = new Float32Array(25);
  let pendingWaveHits = [];

  // Input State
  const keysHeld = { up: false, down: false, left: false, right: false };
  const pedalCooldowns = [0, 0, 0];
  const BASE_PEDAL_CD = [4.0, 2.6, 5.2];

  function getPlayerMaxCd(idx) {
    const player = bumpers[0];
    const mult = player && player.critter && player.critter.cdMult ? player.critter.cdMult[idx] : 1.0;
    return BASE_PEDAL_CD[idx] * mult;
  }

  // --- Shared Rainbow Fever Activation Helper (`addFever(amount)`) ---
  function addFever(amount) {
    if (feverTimer > 0) return;
    feverMeter = Math.min(100, feverMeter + amount);
    if (feverMeter >= 100) {
      feverMeter = 100;
      feverTimer = 6.0;
      SFX.playFeverFanfare();
      screenShake = Math.max(screenShake, 0.42);
      const player = bumpers[0];
      if (player && !player.falling) {
        player.squashTimer = 0.18;
        spawnShockwaveRing(player.x, player.z, 0xffe047, 7.8, 0.34);
        spawnShockwaveRing(player.x, player.z, 0x00f5d4, 5.6, 0.25);
        spawnSparkBurst(player.x, 1.2, player.z, 0xffe047, 14, 0, 0, false);
        spawnFlyingStarCoins(player.x, 1.4, player.z, 0, 3, 25);
      }
    }
  }

  function clearAllBumpers() {
    while (bumpers.length > 0) {
      const b = bumpers.pop();
      b.visual.dispose();
    }
  }

  function openCritterSelectModal() {
    selectOverlayOpen = true;
    const modal = document.getElementById('critter-modal');
    if (modal) modal.classList.remove('hidden');
    document.getElementById('podium-modal').classList.add('hidden');
    renderCritterPicker();
  }

  function closeCritterSelectModal() {
    selectOverlayOpen = false;
    const modal = document.getElementById('critter-modal');
    if (modal) modal.classList.add('hidden');
  }

  function swapPlayerCritterInPlace(critterId) {
    const newCritter = CRITTERS.find((c) => c.id === critterId);
    if (!newCritter) return;
    saveState.selectedCritter = newCritter.id;
    persistSave();

    const player = bumpers[0];
    if (player) {
      player.visual.dispose();
      player.critter = newCritter;
      player.mass = newCritter.mass;
      player.accel = newCritter.accel;
      player.visual = createBumperMesh(newCritter, true);
    }
    renderCritterPicker();
    sync3DVisuals(0.016);
    updateHUD();
  }

  function findSafeRespawnPosition(selfBumper) {
    const safeR = currentRadius * 0.34;
    let bestX = 0;
    let bestZ = 0;
    let bestMinClearance = -1;

    for (let attempt = 0; attempt < 16; attempt++) {
      const ang = (attempt / 16) * Math.PI * 2 + stageElapsed * 0.7;
      const dist = attempt === 0 ? 0 : safeR * (0.45 + 0.55 * ((attempt % 3) / 2));
      const cx = Math.cos(ang) * dist;
      const cz = Math.sin(ang) * dist;

      let minD = 999;
      bumpers.forEach((other) => {
        if (other !== selfBumper && !other.falling) {
          const d = Math.hypot(cx - other.x, cz - other.z);
          if (d < minD) minD = d;
        }
      });
      stagePosts.forEach((p) => {
        const d = Math.hypot(cx - p.x, cz - p.z);
        if (d < minD) minD = d;
      });

      if (minD > bestMinClearance) {
        bestMinClearance = minD;
        bestX = cx;
        bestZ = cz;
      }
    }
    return { x: bestX, z: bestZ };
  }

  function startMatch(stageIdx) {
    currentStageIdx = Math.max(0, Math.min(STAGES.length - 1, stageIdx));
    currentStage = STAGES[currentStageIdx];
    currentRadius = currentStage.radius;
    stageElapsed = 0;
    roundEnded = false;
    screenShake = 0;
    hitStopTimer = 0;
    feverMeter = 0;
    feverTimer = 0;
    physAccum = 0;
    fxTrailTick = 0;
    koFocusTimer = 0;
    pairCooldowns.fill(0);
    pendingWaveHits = [];
    pedalCooldowns[0] = 0;
    pedalCooldowns[1] = 0;
    pedalCooldowns[2] = 0;

    starCoinPool.forEach((c) => {
      c.active = false;
      c.group.visible = false;
    });
    shockwavePool.forEach((sw) => {
      sw.life = 0;
      sw.mesh.visible = false;
    });
    sparkDummy.position.set(0, -999, 0);
    sparkDummy.scale.setScalar(0);
    sparkDummy.updateMatrix();
    for (let i = 0; i < SPARK_TOTAL; i++) {
      sparkData[i].life = 0;
      sparkInstMesh.setMatrixAt(i, sparkDummy.matrix);
    }
    sparkInstMesh.instanceMatrix.needsUpdate = true;

    document.getElementById('podium-modal').classList.add('hidden');
    buildArenaForStage(currentStage);

    const playerCritter = CRITTERS.find((c) => c.id === saveState.selectedCritter) || CRITTERS[0];
    const pool = CRITTERS.filter((c) => c.id !== playerCritter.id);
    const chosenRivals = [];
    for (let i = 0; i < 4; i++) {
      chosenRivals.push(pool[(i + currentStageIdx) % pool.length]);
    }
    const roster = [playerCritter, ...chosenRivals];

    clearAllBumpers();
    const spawnDist = currentStage.radius * 0.45;
    roster.forEach((critter, idx) => {
      const angle = (idx / 5) * Math.PI * 2 - Math.PI / 2;
      const sx = Math.cos(angle) * spawnDist;
      const sz = Math.sin(angle) * spawnDist;
      const visual = createBumperMesh(critter, idx === 0);

      bumpers.push({
        index: idx,
        isPlayer: idx === 0,
        critter,
        visual,
        x: sx,
        y: 0,
        z: sz,
        vx: 0,
        vy: 0,
        vz: 0,
        hopVy: 0,
        facingX: -Math.cos(angle),
        facingZ: -Math.sin(angle),
        baseRadius: 1.58,
        mass: idx === 0 ? critter.mass : critter.mass * (0.76 + 0.03 * currentStageIdx),
        accel: idx === 0 ? critter.accel : critter.accel * 0.72,
        scaleBonus: 1.0,
        growthTimer: 0,
        whirlTimer: 0,
        ramTimer: 0,
        invulnTimer: 0,
        squashTimer: 0,
        hitFlashTimer: 0,
        alive: true,
        falling: false,
        respawnTimer: 0,
        koScore: 0,
        knockoutsDealt: 0,
        fallsTaken: 0,
        lastHitBy: -1,
        lastHitTimer: 0,
        aiTimer: 0.18 + idx * 0.16,
        aiDashCd: 1.2 + idx * 0.35,
        aiTargetIdx: idx === 1 ? 0 : ((idx % 4) + 1)
      });
    });

    arenaStars.forEach((s) => relocateStar(s, currentRadius * 0.72));
    syncCameraFraming(1.0);
    sync3DVisuals(0.016);
    updateHUD();
    renderStageRail();
    renderCritterPicker();
  }

  // --- 3 Distinct Power Pedals (1: Whirlwind Spin, 2: Rocket Ram, 3: Belly Shockwave) ---
  function triggerPedal(pedalNum) {
    if (roundEnded) return false;
    if (selectOverlayOpen) closeCritterSelectModal();
    const player = bumpers[0];
    if (!player || !player.alive || player.falling) return false;
    const idx = pedalNum - 1;
    if (idx < 0 || idx > 2) return false;
    if (pedalCooldowns[idx] > 0) return false;

    pedalCooldowns[idx] = getPlayerMaxCd(idx);
    SFX.playPedal(pedalNum);

    const btn = document.getElementById('pedal-' + pedalNum);
    if (btn) {
      btn.classList.add('triggered');
      setTimeout(() => btn.classList.remove('triggered'), 160);
    }

    const feverMult = feverTimer > 0 ? 1.25 : 1.0;

    if (pedalNum === 1) {
      // 🌪️ Whirlwind Spin: high-RPM cyan vortex spin aura + continuous tangential/outward fling!
      const R_EFF = 6.8;
      player.whirlTimer = 2.6 + (player.critter.whirlBonus || 0);
      player.squashTimer = 0.14;
      spawnShockwaveRing(player.x, player.z, 0x00f5d4, R_EFF, 0.26);
      spawnSparkBurst(player.x, 1.1, player.z, 0x00f5d4, 12, 0, 0, false);
      bumpers.forEach((other) => {
        if (other === player || !other.alive || other.falling || other.invulnTimer > 0) return;
        const dx = other.x - player.x;
        const dz = other.z - player.z;
        const dist = Math.hypot(dx, dz) || 0.001;
        if (dist <= R_EFF) {
          const push = ((1 - dist / R_EFF) * 20 + 9) * feverMult;
          const delay = (dist / R_EFF) * 0.16;
          pendingWaveHits.push({
            delay,
            targetIdx: other.index,
            attackerIdx: 0,
            dirX: dx / dist,
            dirZ: dz / dist,
            push,
            color: 0x00f5d4
          });
        }
      });
      screenShake = Math.max(screenShake, 0.28);
    } else if (pedalNum === 2) {
      // ⚡ Rocket Ram: high-impulse forward dash with 3D flame cone aura & continuous afterburner spark stream!
      player.ramTimer = 0.55;
      player.squashTimer = 0.14;
      let dirX = player.facingX;
      let dirZ = player.facingZ;
      if (!keysHeld.up && !keysHeld.down && !keysHeld.left && !keysHeld.right) {
        let bestDist = 999;
        bumpers.forEach((other) => {
          if (other === player || !other.alive || other.falling) return;
          const d = Math.hypot(other.x - player.x, other.z - player.z);
          if (d < bestDist) {
            bestDist = d;
            dirX = (other.x - player.x) / (d || 1);
            dirZ = (other.z - player.z) / (d || 1);
          }
        });
      }
      const norm = Math.hypot(dirX, dirZ) || 1;
      dirX /= norm;
      dirZ /= norm;
      player.facingX = dirX;
      player.facingZ = dirZ;
      player.vx += dirX * 27 * feverMult;
      player.vz += dirZ * 27 * feverMult;
      spawnSparkBurst(player.x - dirX * 1.2, 0.9, player.z - dirZ * 1.2, 0xffbe0b, 12, -dirX, -dirZ, false);
      screenShake = Math.max(screenShake, 0.34);
    } else if (pedalNum === 3) {
      // 💥 Belly Shockwave: vertical Belly Hop + double concentric shockwave rings (0xff007f + 0xffe047)!
      const R_EFF = 8.8;
      player.hopVy = 9.2;
      player.squashTimer = 0.20;
      spawnShockwaveRing(player.x, player.z, 0xff007f, R_EFF, 0.32);
      spawnShockwaveRing(player.x, player.z, 0xffe047, 6.2, 0.24);
      screenShake = Math.max(screenShake, 0.54);
      bumpers.forEach((other) => {
        if (other === player || !other.alive || other.falling || other.invulnTimer > 0) return;
        const dx = other.x - player.x;
        const dz = other.z - player.z;
        const dist = Math.hypot(dx, dz) || 0.001;
        if (dist <= R_EFF) {
          const blast = ((1 - dist / R_EFF) * 26 + 11) * feverMult;
          const delay = (dist / R_EFF) * 0.22;
          pendingWaveHits.push({
            delay,
            targetIdx: other.index,
            attackerIdx: 0,
            dirX: dx / dist,
            dirZ: dz / dist,
            push: blast,
            color: 0xff007f
          });
        }
      });
    }
    return true;
  }

  // --- Single Fixed-Timestep Substep (`dt = 1/120` s) ---
  function stepPhysicsSubstep(dt) {
    stageElapsed += dt;
    fxTrailTick += dt;

    // Update Cooldowns (1.8x Faster Recharge During Rainbow Fever!), Pair Cooldowns & Fever Timer
    const cdRate = feverTimer > 0 ? 1.8 : 1.0;
    for (let i = 0; i < 3; i++) {
      if (pedalCooldowns[i] > 0) pedalCooldowns[i] = Math.max(0, pedalCooldowns[i] - dt * cdRate);
    }
    for (let k = 0; k < 25; k++) {
      if (pairCooldowns[k] > 0) pairCooldowns[k] = Math.max(0, pairCooldowns[k] - dt);
    }
    if (feverTimer > 0) {
      feverTimer = Math.max(0, feverTimer - dt);
      feverMeter = (feverTimer / 6.0) * 100;
    }

    // Continuous 3D Particle Streams for Active Whirlwind Spin, Rocket Ram & Rainbow Fever!
    const player = bumpers[0];
    if (player && !player.falling && fxTrailTick >= 0.045) {
      fxTrailTick = 0;
      if (player.whirlTimer > 0) {
        const spinAng = stageElapsed * 18;
        const wx = player.x + Math.cos(spinAng) * 2.1;
        const wz = player.z + Math.sin(spinAng) * 2.1;
        spawnSparkBurst(wx, 0.9, wz, 0x00f5d4, 2, -Math.sin(spinAng), Math.cos(spinAng), false);
      }
      if (player.ramTimer > 0) {
        const bx = player.x - player.facingX * 1.45;
        const bz = player.z - player.facingZ * 1.45;
        spawnSparkBurst(bx, 0.85, bz, 0xff9e00, 3, -player.facingX, -player.facingZ, false);
      }
      if (feverTimer > 0) {
        const hueCol = sparkColorTmp.setHSL((stageElapsed * 2.2) % 1, 1.0, 0.55).getHex();
        spawnSparkBurst(player.x, 0.7, player.z, hueCol, 2, 0, 0, false);
      }
    }

    // Process Delayed Wavefront Blasts when visual ring reaches each target (+8 Fever per hit!)
    for (let i = pendingWaveHits.length - 1; i >= 0; i--) {
      const hit = pendingWaveHits[i];
      hit.delay -= dt;
      if (hit.delay <= 0) {
        pendingWaveHits.splice(i, 1);
        const target = bumpers[hit.targetIdx];
        if (target && target.alive && !target.falling && target.invulnTimer <= 0) {
          target.vx += hit.dirX * hit.push;
          target.vz += hit.dirZ * hit.push;
          target.lastHitBy = hit.attackerIdx;
          target.lastHitTimer = 4.5;
          target.squashTimer = 0.15;
          target.hitFlashTimer = 0.18;
          spawnSparkBurst(target.x, 1.0, target.z, hit.color, 10, hit.dirX, hit.dirZ, false);
          SFX.playBump(Math.min(1, hit.push / 32));
          if (hit.attackerIdx === 0) {
            bumpers[0].koScore += 35;
            addFever(8);
          }
        }
      }
    }

    // Shrinking Sky Ring Radius
    const progress = Math.min(1, stageElapsed / currentStage.duration);
    currentRadius = currentStage.radius - (currentStage.radius - currentStage.minRadius) * progress;

    // Rigid Single-Direction Post Orbit
    const postOrbitR = Math.min(currentStage.postRadius, currentRadius * 0.56);
    const postOmega = 0.34 + currentStageIdx * 0.04;
    stagePosts.forEach((p) => {
      const ang = p.baseAngle + stageElapsed * postOmega;
      p.x = Math.cos(ang) * postOrbitR;
      p.z = Math.sin(ang) * postOrbitR;
      p.vx = -Math.sin(ang) * postOrbitR * postOmega;
      p.vz = Math.cos(ang) * postOrbitR * postOmega;
      p.mesh.position.x = p.x;
      p.mesh.position.z = p.z;
      if (p.pulse > 0) {
        p.pulse = Math.max(0, p.pulse - dt * 4);
        const s = 1 + p.pulse * 0.35;
        p.mesh.scale.set(s, 1, s);
      }
    });

    // Update Collectible Stars
    arenaStars.forEach((star) => {
      if (!star.active) {
        star.respawnTimer -= dt;
        if (star.respawnTimer <= 0) {
          relocateStar(star, currentRadius * 0.68);
        }
        return;
      }
      const distFromCenter = Math.hypot(star.x, star.z);
      if (distFromCenter > currentRadius * 0.78) {
        const scaleBack = (currentRadius * 0.72) / (distFromCenter || 1);
        star.x *= scaleBack;
        star.z *= scaleBack;
        star.group.position.x = star.x;
        star.group.position.z = star.z;
      }
      star.octa.rotation.y += dt * 2.8;
      star.octa.position.y = 1.15 + Math.sin(stageElapsed * 4 + star.x) * 0.22;
    });

    // Update Each Competitor Bumper-Top
    bumpers.forEach((b) => {
      if (b.lastHitTimer > 0) {
        b.lastHitTimer = Math.max(0, b.lastHitTimer - dt);
        if (b.lastHitTimer === 0) b.lastHitBy = -1;
      }
      if (b.growthTimer > 0) b.growthTimer = Math.max(0, b.growthTimer - dt);
      if (b.whirlTimer > 0) b.whirlTimer = Math.max(0, b.whirlTimer - dt);
      if (b.ramTimer > 0) b.ramTimer = Math.max(0, b.ramTimer - dt);
      if (b.invulnTimer > 0) b.invulnTimer = Math.max(0, b.invulnTimer - dt);
      if (b.squashTimer > 0) b.squashTimer = Math.max(0, b.squashTimer - dt);
      if (b.hitFlashTimer > 0) b.hitFlashTimer = Math.max(0, b.hitFlashTimer - dt);
      if (b.aiDashCd > 0) b.aiDashCd = Math.max(0, b.aiDashCd - dt);

      const isFever = b.isPlayer && feverTimer > 0;
      const targetScale = 1.0 + (b.growthTimer > 0 ? 0.32 : 0) + (isFever ? 0.35 : 0);
      b.scaleBonus += (targetScale - b.scaleBonus) * Math.min(1, dt * 8);

      // Handle Parabolic Sky-Arc Falling & Safe Ghost Respawn
      if (b.falling) {
        const airDrag = Math.exp(-0.95 * dt);
        b.vx *= airDrag;
        b.vz *= airDrag;
        b.x += b.vx * dt;
        b.z += b.vz * dt;
        b.y += b.vy * dt;
        b.vy -= 26 * dt;
        b.respawnTimer -= dt;
        if (b.respawnTimer <= 0) {
          b.falling = false;
          b.alive = true;
          b.invulnTimer = 0.85;
          b.aiTimer = 0.05;
          const safeSpot = findSafeRespawnPosition(b);
          b.x = safeSpot.x;
          b.z = safeSpot.z;
          b.y = 0;
          b.vx = 0;
          b.vy = 0;
          b.vz = 0;
          b.hopVy = 0;
          b.visual.tiltGroup.rotation.set(0, 0, 0);
          spawnShockwaveRing(b.x, b.z, b.critter.rim, 3.2, 0.25);
        }
        return;
      }

      // Belly Shockwave vertical hop physics on deck
      if (b.y > 0 || b.hopVy > 0) {
        b.y += b.hopVy * dt;
        b.hopVy -= 36 * dt;
        if (b.y <= 0) {
          b.y = 0;
          b.hopVy = 0;
          b.squashTimer = 0.14;
        }
      }

      // Steering Forces (+25% Speed Boost During Rainbow Fever!)
      let ax = 0;
      let az = 0;
      const feverSpeedBoost = isFever ? 1.25 : 1.0;
      const baseAccel = b.isPlayer ? b.accel * feverSpeedBoost : b.accel * currentStage.aiSkill;

      if (b.isPlayer) {
        if (keysHeld.up) az -= 1;
        if (keysHeld.down) az += 1;
        if (keysHeld.left) ax -= 1;
        if (keysHeld.right) ax += 1;
        if (ax !== 0 || az !== 0) {
          const mag = Math.hypot(ax, az);
          ax /= mag;
          az /= mag;
          b.facingX = ax;
          b.facingZ = az;
          b.vx += ax * baseAccel * dt;
          b.vz += az * baseAccel * dt;
        } else {
          const distCenter = Math.hypot(b.x, b.z);
          if (distCenter > currentRadius * 0.72) {
            b.vx += (-b.x / distCenter) * 14 * dt;
            b.vz += (-b.z / distCenter) * 14 * dt;
          }
        }
      } else {
        b.aiTimer -= dt;
        if (b.aiTimer <= 0) {
          b.aiTimer = 0.42 + Math.random() * 0.48;
          const maxPlayerAttackers = currentStageIdx <= 1 ? 1 : 2;
          let otherPlayerAttackers = 0;
          for (let r = 1; r < bumpers.length; r++) {
            const rival = bumpers[r];
            if (rival !== b && !rival.falling && rival.aiTargetIdx === 0) {
              otherPlayerAttackers++;
            }
          }
          let candidates = bumpers.filter((other) => other !== b && !other.falling && other.invulnTimer <= 0);
          if (otherPlayerAttackers >= maxPlayerAttackers && candidates.length > 1) {
            const nonPlayer = candidates.filter((other) => other.index !== 0);
            if (nonPlayer.length > 0) candidates = nonPlayer;
          }
          if (candidates.length > 0) {
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            b.aiTargetIdx = pick.index;
          }
        }

        const rimSafeRatio = 0.82 - 0.017 * currentStageIdx;
        const distFromCenter = Math.hypot(b.x, b.z);
        if (distFromCenter > currentRadius * rimSafeRatio) {
          ax = -b.x / (distFromCenter || 1);
          az = -b.z / (distFromCenter || 1);
        } else {
          let steeredToStar = false;
          if (currentStageIdx >= 2 && b.growthTimer <= 0) {
            let bestStar = null;
            let bestStarDist = 4.5;
            for (let s = 0; s < arenaStars.length; s++) {
              const st = arenaStars[s];
              if (!st.active) continue;
              const sd = Math.hypot(st.x - b.x, st.z - b.z);
              if (sd < bestStarDist && Math.hypot(st.x, st.z) < currentRadius * rimSafeRatio) {
                bestStarDist = sd;
                bestStar = st;
              }
            }
            if (bestStar) {
              const d = bestStarDist || 1;
              ax = (bestStar.x - b.x) / d;
              az = (bestStar.z - b.z) / d;
              steeredToStar = true;
            }
          }

          if (!steeredToStar) {
            const target = bumpers[b.aiTargetIdx] || bumpers[0];
            if (target && !target.falling) {
              const dx = target.x - b.x;
              const dz = target.z - b.z;
              const d = Math.hypot(dx, dz) || 1;
              ax = dx / d;
              az = dz / d;
              if (d < 5.5 && b.aiDashCd <= 0) {
                b.aiDashCd = 2.6 - 1.1 * currentStage.aiSkill;
                b.ramTimer = 0.35;
                b.squashTimer = 0.12;
                b.vx += ax * 13 * currentStage.aiSkill;
                b.vz += az * 13 * currentStage.aiSkill;
                spawnSparkBurst(b.x - ax * 1.1, 0.85, b.z - az * 1.1, b.critter.rim, 6, -ax, -az, false);
              }
            }
          }
        }
        b.facingX = ax || b.facingX;
        b.facingZ = az || b.facingZ;
        b.vx += ax * baseAccel * dt;
        b.vz += az * baseAccel * dt;
      }

      // Apply velocity & damping
      const drag = Math.exp(-2.6 * dt);
      b.vx *= drag;
      b.vz *= drag;
      b.x += b.vx * dt;
      b.z += b.vz * dt;

      // Star Pickup Check (+3 Flying Star-Coins + addFever(34)!)
      const effRadius = b.baseRadius * b.scaleBonus;
      arenaStars.forEach((star) => {
        if (!star.active) return;
        const d = Math.hypot(b.x - star.x, b.z - star.z);
        if (d < effRadius + 0.95) {
          star.active = false;
          star.respawnTimer = 4.0;
          star.group.visible = false;
          b.growthTimer = 6.0;
          b.squashTimer = 0.14;
          b.koScore += 75;
          spawnFlyingStarCoins(star.x, 1.1, star.z, b.index, 3, 25);
          if (b.isPlayer) {
            SFX.playStar();
            addFever(34);
          }
          spawnSparkBurst(star.x, 1.0, star.z, 0xffe047, 10, 0, 0, false);
        }
      });

      // Stage Trampoline Post Collisions
      if (b.invulnTimer <= 0) {
        stagePosts.forEach((p) => {
          const dx = b.x - p.x;
          const dz = b.z - p.z;
          const dist = Math.hypot(dx, dz) || 0.001;
          const minDist = effRadius + p.radius;
          if (dist < minDist) {
            const nx = dx / dist;
            const nz = dz / dist;
            b.x = p.x + nx * minDist;
            b.z = p.z + nz * minDist;

            const rvx = b.vx - p.vx;
            const rvz = b.vz - p.vz;
            const vn = rvx * nx + rvz * nz;
            if (vn < 0) {
              const targetVn = Math.max(13.0, -1.1 * vn);
              const deltaVn = targetVn - vn;
              b.vx += deltaVn * nx;
              b.vz += deltaVn * nz;
              p.pulse = 1.0;
              b.squashTimer = 0.12;
              b.hitFlashTimer = 0.12;
              const normK = Math.min(1, Math.abs(vn) / 26);
              spawnSparkBurst(p.x + nx * p.radius, 1.0, p.z + nz * p.radius, currentStage.rimColor, 6, nx, nz, false);
              if (b.isPlayer) {
                SFX.playBump(normK);
                screenShake = Math.max(screenShake, 0.16 + 0.18 * normK);
              }
            }
          }
        });
      }

      // Edge Teeter Warning & Ring-Out Detection
      const radialDist = Math.hypot(b.x, b.z);
      if (b.isPlayer && radialDist > currentRadius - 0.65 && radialDist <= currentRadius + 0.55) {
        SFX.playTeeter();
      }

      if (radialDist > currentRadius + 0.55) {
        b.falling = true;
        const hSpd = Math.hypot(b.vx, b.vz);
        b.vy = Math.min(16, 8.5 + 0.14 * hSpd);
        b.respawnTimer = 2.2;
        b.fallsTaken++;
        SFX.playKO();
        hitStopTimer = Math.max(hitStopTimer, 0.068);
        koFocusX = b.x * 0.25;
        koFocusZ = b.z * 0.25;
        koFocusTimer = 0.38;

        const outNx = b.x / (radialDist || 1);
        const outNz = b.z / (radialDist || 1);
        spawnShockwaveRing(b.x, b.z, 0xff3b6b, 4.8, 0.30);
        spawnSparkBurst(b.x, 1.0, b.z, b.critter.rim, 16, outNx, outNz, true);
        screenShake = Math.max(screenShake, 0.62);
        if (navigator.vibrate) {
          try { navigator.vibrate(55); } catch (_) {}
        }

        let attackerIdx = b.lastHitBy;
        if (attackerIdx < 0 || attackerIdx === b.index) {
          let nearestD = 999;
          bumpers.forEach((other) => {
            if (other !== b && !other.falling) {
              const d = Math.hypot(other.x - b.x, other.z - b.z);
              if (d < nearestD) {
                nearestD = d;
                attackerIdx = other.index;
              }
            }
          });
        }
        if (attackerIdx >= 0 && bumpers[attackerIdx]) {
          const attacker = bumpers[attackerIdx];
          attacker.knockoutsDealt++;
          attacker.koScore += 100;
          spawnFlyingStarCoins(b.x, 1.2, b.z, attacker.index, 6, 50);
          if (attacker.isPlayer) {
            addFever(45);
          }
        }
      }
    });

    // Pairwise Elastic Bumper-Top Collisions (With Whirlwind Outward Bonus, Fever +25% Knockback, & Heavy Hit Fever Gain!)
    for (let i = 0; i < bumpers.length; i++) {
      const a = bumpers[i];
      if (a.falling || a.invulnTimer > 0) continue;
      for (let j = i + 1; j < bumpers.length; j++) {
        const b = bumpers[j];
        if (b.falling || b.invulnTimer > 0) continue;
        const dx = b.x - a.x;
        const dz = b.z - a.z;
        const dist = Math.hypot(dx, dz) || 0.001;
        const rA = a.baseRadius * a.scaleBonus;
        const rB = b.baseRadius * b.scaleBonus;
        const minDist = rA + rB;

        if (dist < minDist) {
          const nx = dx / dist;
          const nz = dz / dist;
          const overlap = minDist - dist;

          const aFever = a.isPlayer && feverTimer > 0 ? 1.35 : 1.0;
          const bFever = b.isPlayer && feverTimer > 0 ? 1.35 : 1.0;
          const massA = a.mass * a.scaleBonus * aFever * (a.ramTimer > 0 ? 1.55 : 1) * (a.whirlTimer > 0 ? 1.35 : 1);
          const massB = b.mass * b.scaleBonus * bFever * (b.ramTimer > 0 ? 1.55 : 1) * (b.whirlTimer > 0 ? 1.35 : 1);
          const invMA = 1 / massA;
          const invMB = 1 / massB;
          const invSum = invMA + invMB;

          a.x -= nx * overlap * (invMA / invSum);
          a.z -= nz * overlap * (invMA / invSum);
          b.x += nx * overlap * (invMB / invSum);
          b.z += nz * overlap * (invMB / invSum);

          const rvx = b.vx - a.vx;
          const rvz = b.vz - a.vz;
          const vn = rvx * nx + rvz * nz;
          const pairKey = i * 5 + j;

          if (vn < 0 && pairCooldowns[pairKey] <= 0) {
            pairCooldowns[pairKey] = 0.11;

            const e = 1.12;
            const rawJ = -(1 + e) * vn / invSum;

            const vA_into = (a.vx * nx + a.vz * nz) + (a.ramTimer > 0 ? 12 : 0) + (a.whirlTimer > 0 ? 6 : 0);
            const vB_into = -(b.vx * nx + b.vz * nz) + (b.ramTimer > 0 ? 12 : 0) + (b.whirlTimer > 0 ? 6 : 0);
            const aIsAttacker = vA_into >= vB_into;

            const scaleA = aIsAttacker ? 0.65 : 1.15;
            const scaleB = aIsAttacker ? 1.15 : 0.65;

            // Direct Whirlwind Outward Deflection Bonus (+6.5 u/s) + Fever +25% Knockback Bonus!
            const whirlBonusOnB = (a.whirlTimer > 0 ? 6.5 : 0) + (a.isPlayer && feverTimer > 0 ? 4.5 : 0);
            const whirlBonusOnA = (b.whirlTimer > 0 ? 6.5 : 0) + (b.isPlayer && feverTimer > 0 ? 4.5 : 0);

            const dvA = Math.max(aIsAttacker ? 4.5 : 9.5, rawJ * invMA * scaleA) + whirlBonusOnA;
            const dvB = Math.max(aIsAttacker ? 9.5 : 4.5, rawJ * invMB * scaleB) + whirlBonusOnB;

            a.vx -= nx * dvA;
            a.vz -= nz * dvA;
            b.vx += nx * dvB;
            b.vz += nz * dvB;

            a.lastHitBy = b.index;
            a.lastHitTimer = 4.0;
            b.lastHitBy = a.index;
            b.lastHitTimer = 4.0;

            a.squashTimer = 0.13;
            b.squashTimer = 0.13;
            a.hitFlashTimer = 0.15;
            b.hitFlashTimer = 0.15;

            const normK = Math.max(0.12, Math.min(1.0, Math.abs(vn) / 28));
            const contactCount = Math.round(4 + 8 * normK);
            spawnSparkBurst((a.x + b.x) * 0.5, 1.0, (a.z + b.z) * 0.5, 0xffe047, contactCount, -dz / dist, dx / dist, false);

            if (a.isPlayer || b.isPlayer) {
              if (a.isPlayer) a.koScore += 25;
              if (b.isPlayer) b.koScore += 25;
              SFX.playBump(normK);
              screenShake = Math.max(screenShake, 0.15 + 0.42 * normK);
              if (normK > 0.55) {
                hitStopTimer = Math.max(hitStopTimer, 0.055);
                addFever(10); // +10 Rainbow Fever on heavy bumper slams!
                const victim = a.isPlayer ? b : a;
                spawnFlyingStarCoins(victim.x, 1.1, victim.z, 0, 2, 25);
              }
              if (navigator.vibrate) {
                try { navigator.vibrate(Math.min(55, Math.round(12 + 42 * normK))); } catch (_) {}
              }
            }
          }
        }
      }
    }

    if (stageElapsed >= currentStage.duration || (bumpers[0] && bumpers[0].knockoutsDealt >= 6)) {
      finishMatchByStandings();
    }
  }

  function stepSimulation(dt) {
    if (roundEnded || contextLost || selectOverlayOpen) return;
    dt = Math.min(dt, 0.05);

    if (hitStopTimer > 0) {
      hitStopTimer = Math.max(0, hitStopTimer - dt);
      dt *= 0.06;
    }

    const FIXED_DT = 1 / 120;
    physAccum = Math.min(physAccum + dt, FIXED_DT * 6);
    while (physAccum >= FIXED_DT && !roundEnded) {
      stepPhysicsSubstep(FIXED_DT);
      physAccum -= FIXED_DT;
    }

    if (deckMesh) deckMesh.scale.set(currentRadius, 1, currentRadius);
    if (edgeRopeMesh) edgeRopeMesh.scale.set(currentRadius, currentRadius, 1);
    if (outerDangerZoneMesh) {
      outerDangerZoneMesh.scale.set(currentRadius, currentRadius, 1);
      outerDangerZoneMesh.material.opacity = 0.25 + 0.2 * Math.sin(stageElapsed * 6);
    }
  }

  function getSortedStandings() {
    return bumpers.slice().sort((a, b) => {
      const scoreA = a.knockoutsDealt * 400 + a.koScore - a.fallsTaken * 180;
      const scoreB = b.knockoutsDealt * 400 + b.koScore - b.fallsTaken * 180;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return a.index - b.index;
    });
  }

  function finishMatchByStandings() {
    if (roundEnded) return;
    const standings = getSortedStandings();
    const playerRank = standings.findIndex((b) => b.isPlayer) + 1;
    showPodiumModal(playerRank, standings);
  }

  // --- Strict Top-3 Podium Qualification ---
  let lastRoundQualified = false;

  function showPodiumModal(playerRank, customStandings) {
    roundEnded = true;
    closeCritterSelectModal();
    const rank = Math.max(1, Math.min(5, playerRank));
    const starsEarned = rank === 1 ? 3 : rank === 2 ? 2 : rank === 3 ? 1 : 0;
    const qualified = rank <= 3;
    lastRoundQualified = qualified;

    if (qualified) {
      saveState.stageStars[currentStageIdx] = Math.max(saveState.stageStars[currentStageIdx] || 0, starsEarned);
      if (currentStageIdx + 1 > saveState.unlockedStage && currentStageIdx + 1 < STAGES.length) {
        saveState.unlockedStage = currentStageIdx + 1;
      }
      persistSave();
      SFX.playVictoryFanfare();
    } else {
      SFX.playDefeatTrombone();
    }

    const podiumCard = document.getElementById('podium-card');
    const bannerEl = document.getElementById('podium-banner');
    const starsEl = document.getElementById('podium-stars');
    const colsEl = document.getElementById('podium-columns');
    const nextBtn = document.getElementById('btn-next-stage');
    const retryBtn = document.getElementById('btn-retry');

    if (podiumCard) {
      podiumCard.classList.toggle('defeat-mode', !qualified);
    }

    const rankMedals = ['🥇', '🥈', '🥉', '😢', '💔'];
    bannerEl.textContent = qualified ? '🏆 ' + rankMedals[rank - 1] : '😢 ' + rankMedals[rank - 1];
    starsEl.textContent = qualified
      ? '⭐'.repeat(starsEarned) + '☆'.repeat(3 - starsEarned)
      : '☆☆☆ 💔';

    let ordered = customStandings ? customStandings.slice() : getSortedStandings();
    const pIdx = ordered.findIndex((b) => b.isPlayer);
    if (pIdx !== -1 && pIdx !== rank - 1) {
      const [playerObj] = ordered.splice(pIdx, 1);
      ordered.splice(rank - 1, 0, playerObj);
    }

    const heights = [110, 88, 70, 50, 40];
    colsEl.innerHTML = '';
    ordered.forEach((b, idx) => {
      const slot = document.createElement('div');
      slot.className = 'podium-slot' + (b.isPlayer ? ' player-slot' : '') + (idx >= 3 ? ' unqualified' : '');
      const img = document.createElement('img');
      img.src = b.critter.icon;
      img.alt = '';
      attachImgFallback(img, b.critter);

      const pillar = document.createElement('div');
      pillar.className = 'podium-pillar rank-' + (idx + 1);
      pillar.style.height = heights[idx] + 'px';
      const koCount = Math.min(5, b.knockoutsDealt || 0);
      const koPips = koCount > 0 ? '💥'.repeat(koCount) : '';
      pillar.innerHTML = `<span class="podium-medal">${rankMedals[idx]}</span><span class="podium-ko-pips">${koPips}</span>`;

      slot.appendChild(img);
      slot.appendChild(pillar);
      colsEl.appendChild(slot);
    });

    if (qualified) {
      nextBtn.classList.remove('hidden');
      nextBtn.disabled = false;
      nextBtn.classList.add('primary-pulse');
      if (retryBtn) retryBtn.classList.remove('primary-pulse');
    } else {
      nextBtn.classList.add('hidden');
      nextBtn.disabled = true;
      nextBtn.classList.remove('primary-pulse');
      if (retryBtn) retryBtn.classList.add('primary-pulse');
    }

    renderStageRail();
    document.getElementById('podium-modal').classList.remove('hidden');
  }

  // --- Pitch-Aware Frustum-Fit Camera Calculation + Post-LookAt Trauma-Squared Rotational Shake ---
  function syncCameraFraming(lerpFactor) {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    const aspect = w / h;
    const targetFov = aspect < 1 ? 58 : 46;
    if (camera.fov !== targetFov || Math.abs(camera.aspect - aspect) > 1e-4) {
      camera.fov = targetFov;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }

    const halfV = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const halfH = Math.atan(Math.tan(halfV) * aspect);

    const fitR = (cameraMode === 0 ? currentRadius : currentStage.radius) + 2.5;
    currentPitch = cameraMode === 0 ? 0.80 : 0.88;

    const distH = (fitR / Math.tan(halfH)) * 1.08;
    const distV = (fitR * Math.sin(currentPitch) / Math.tan(halfV)) * 1.44;
    const dist = Math.max(distH, distV);

    if (scene.fog) {
      scene.fog.near = dist + fitR * 1.15;
      scene.fog.far = dist + fitR * 4.2;
    }

    const player = bumpers[0];
    let panX = 0;
    let panZ = 0;
    if (player && !player.falling && cameraMode === 0) {
      panX = THREE.MathUtils.clamp(player.x * 0.12, -2.0, 2.0);
      panZ = THREE.MathUtils.clamp(player.z * 0.12, -2.0, 2.0);
    }
    if (koFocusTimer > 0) {
      panX += koFocusX * 0.5;
      panZ += koFocusZ * 0.5;
    }

    const lookX = panX;
    const lookZ = panZ + fitR * 0.12;

    const desiredX = lookX;
    const desiredY = Math.sin(currentPitch) * dist;
    const desiredZ = lookZ + Math.cos(currentPitch) * dist;

    camera.position.x += (desiredX - camera.position.x) * lerpFactor;
    camera.position.y += (desiredY - camera.position.y) * lerpFactor;
    camera.position.z += (desiredZ - camera.position.z) * lerpFactor;
    if (screenShake > 0.001) {
      const trauma = Math.min(1.0, screenShake * 1.2);
      const s = trauma * trauma;
      const t = performance.now() * 0.001;
      camera.position.x += Math.sin(t * 21.0) * 0.10 * s;
      camera.position.y += Math.cos(t * 26.0) * 0.08 * s;
    }
    camera.lookAt(lookX, 0, lookZ);
  }

  // --- Visual Sync & HUD Updates ---
  function sync3DVisuals(dt) {
    if (screenShake > 0) screenShake = Math.max(0, screenShake - dt * 2.2);
    if (koFocusTimer > 0) koFocusTimer = Math.max(0, koFocusTimer - dt);
    syncCameraFraming(Math.min(1, dt * 7));

    const standings = getSortedStandings();
    const leader = standings[0];
    const h = Math.max(1, window.innerHeight);
    const aspect = window.innerWidth / h;
    const halfV = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const minFacePx = aspect < 1 ? 42 : 54;

    bumpers.forEach((b) => {
      const v = b.visual;
      v.root.position.set(b.x, b.y, b.z);

      const ghostScale = b.invulnTimer > 0 ? (0.92 + 0.12 * Math.sin(stageElapsed * 35)) : 1.0;
      v.root.scale.setScalar(b.scaleBonus * ghostScale);

      if (b.squashTimer > 0) {
        const sq = (b.squashTimer / 0.14) * Math.sin((b.squashTimer / 0.14) * Math.PI);
        v.tiltGroup.scale.set(1 + 0.24 * sq, 1 - 0.24 * sq, 1 + 0.24 * sq);
      } else {
        v.tiltGroup.scale.set(1, 1, 1);
      }

      if (b.falling) {
        v.shadowMesh.visible = false;
        if (v.playerHaloMesh) v.playerHaloMesh.visible = false;
        v.tiltGroup.rotation.x += 8.5 * dt;
        v.tiltGroup.rotation.z += 6.5 * dt;
      } else {
        const distFromCenter = Math.hypot(b.x, b.z);
        const effR = b.baseRadius * b.scaleBonus;
        const edgeFade = THREE.MathUtils.clamp((currentRadius - distFromCenter) / effR, 0, 1);
        v.shadowMesh.visible = edgeFade > 0.02;
        v.shadowMat.opacity = 0.55 * edgeFade;
        if (v.playerHaloMesh) {
          v.playerHaloMesh.visible = true;
          const pulse = 1.0 + 0.10 * Math.sin(stageElapsed * 8);
          v.playerHaloMesh.scale.set(pulse, pulse, 1);
          if (feverTimer > 0) {
            v.playerHaloMat.color.setHSL((stageElapsed * 2.0) % 1, 1.0, 0.56);
          } else {
            v.playerHaloMat.color.setHex(0xffe047);
          }
        }

        let teeterWobble = 0;
        if (distFromCenter > currentRadius - 0.65) {
          teeterWobble = Math.sin(stageElapsed * 28 + b.index) * 0.22;
        }
        v.tiltGroup.rotation.z = THREE.MathUtils.clamp(-b.vx * 0.025, -0.35, 0.35) + teeterWobble;
        v.tiltGroup.rotation.x = THREE.MathUtils.clamp(b.vz * 0.025, -0.35, 0.35);
      }

      const spinSpeed = (b.whirlTimer > 0 ? 32 : 11) + Math.hypot(b.vx, b.vz) * 0.6;
      v.spinGroup.rotation.y += spinSpeed * dt;

      // Screen-Space Sized & Cap-Clearing Camera-Billboarded Portrait Medallion
      const depth = Math.max(10, camera.position.distanceTo(v.root.position));
      const pxPerUnit = h / (2 * depth * Math.tan(halfV));
      const badgeScale = THREE.MathUtils.clamp(minFacePx / (2.36 * pxPerUnit * b.scaleBonus), 1.0, 2.35);

      v.badgeGroup.quaternion.copy(camera.quaternion);
      v.badgeGroup.scale.setScalar(badgeScale);
      v.badgeGroup.position.y = 1.98 + 1.24 * badgeScale * Math.cos(currentPitch);

      if (v.playerChevronMesh) {
        v.playerChevronMesh.position.y = 1.95 + 0.16 * Math.sin(stageElapsed * 8);
      }

      // Pedal 1: Whirlwind Spin Aura Ring
      if (b.whirlTimer > 0) {
        v.whirlMat.opacity = 0.85;
        v.whirlMesh.scale.setScalar(1.0 + 0.22 * Math.sin(stageElapsed * 24));
      } else {
        v.whirlMat.opacity = 0;
      }

      // Pedal 2: Rocket Ram 3D Flame Dash Cone Aura
      if (b.ramTimer > 0) {
        v.ramAuraMat.opacity = 0.85;
        const dashAngle = Math.atan2(b.facingX, b.facingZ);
        v.ramAuraMesh.rotation.set(Math.PI / 2, dashAngle, 0);
        const s = 1.0 + 0.25 * Math.sin(stageElapsed * 35);
        v.ramAuraMesh.scale.set(s, 1.25, s);
      } else {
        v.ramAuraMat.opacity = 0;
      }

      // Emissive Hit Flash or Rainbow Fever Glow
      if (b.hitFlashTimer > 0) {
        v.rimMat.emissive.setHex(0xffffff);
        v.rimMat.emissiveIntensity = 1.45;
        v.bodyMat.emissiveIntensity = 0.55;
      } else if (b.isPlayer && feverTimer > 0) {
        const hue = (stageElapsed * 1.8) % 1;
        v.rimMat.emissive.setHSL(hue, 1.0, 0.55);
        v.rimMat.emissiveIntensity = 0.95;
        v.bodyMat.emissiveIntensity = 0.18;
      } else {
        v.rimMat.emissive.setHex(b.critter.color);
        v.rimMat.emissiveIntensity = 0.28;
        v.bodyMat.emissiveIntensity = 0.0;
      }

      v.crownMesh.visible = leader === b && !b.falling;
    });

    stageAnimatedProps.forEach((prop) => {
      prop.rotation.y += dt * 1.2;
    });

    // Update InstancedMesh Sparks
    let sparksDirty = false;
    for (let i = 0; i < SPARK_TOTAL; i++) {
      const s = sparkData[i];
      if (s.life > 0) {
        sparksDirty = true;
        s.life -= dt;
        if (s.life <= 0) {
          sparkDummy.position.set(0, -999, 0);
          sparkDummy.scale.setScalar(0);
          sparkDummy.updateMatrix();
          sparkInstMesh.setMatrixAt(i, sparkDummy.matrix);
        } else {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.z += s.vz * dt;
          s.vy -= 24 * dt;
          if (s.y < 0.08 && s.vy < 0 && Math.hypot(s.x, s.z) <= currentRadius) {
            s.y = 0.08;
            s.vy = -s.vy * 0.48;
            s.vx *= 0.72;
            s.vz *= 0.72;
          }
          s.rx += 9 * dt;
          s.ry += 9 * dt;
          sparkDummy.position.set(s.x, s.y, s.z);
          sparkDummy.rotation.set(s.rx, s.ry, 0);
          sparkDummy.scale.setScalar(Math.max(0.1, s.life / s.maxLife));
          sparkDummy.updateMatrix();
          sparkInstMesh.setMatrixAt(i, sparkDummy.matrix);
        }
      }
    }
    if (sparksDirty) {
      sparkInstMesh.instanceMatrix.needsUpdate = true;
    }

    // Update Pooled 3D Flying Star-Coins
    starCoinPool.forEach((c) => {
      if (!c.active) return;
      c.age += dt;
      c.group.rotation.y += 14 * dt;

      const target = bumpers[c.targetIdx] || bumpers[0];
      if (c.age < 0.42 || !target) {
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.z += c.vz * dt;
        c.vy -= 28 * dt;
        if (c.y < 0.24 && c.vy < 0 && Math.hypot(c.x, c.z) <= currentRadius) {
          c.y = 0.24;
          c.vy = -c.vy * 0.48;
          c.vx *= 0.75;
          c.vz *= 0.75;
        }
        c.group.position.set(c.x, c.y, c.z);
      } else {
        const tx = target.x;
        const ty = Math.max(1.2, target.y + 2.2);
        const tz = target.z;
        const dx = tx - c.x;
        const dy = ty - c.y;
        const dz = tz - c.z;
        const dist = Math.hypot(dx, dy, dz);
        const homeSpd = 28 + (c.age - 0.42) * 35;
        if (dist < 1.1 || c.age > 1.6) {
          c.active = false;
          c.group.visible = false;
          target.koScore += c.bonusPoints;
          if (target.isPlayer) {
            SFX.playCoinDing(c.dingStep);
          }
          spawnSparkBurst(tx, ty, tz, 0xffe047, 3, 0, 0, false);
        } else {
          c.x += (dx / dist) * homeSpd * dt;
          c.y += (dy / dist) * homeSpd * dt;
          c.z += (dz / dist) * homeSpd * dt;
          c.group.position.set(c.x, c.y, c.z);
        }
      }
    });

    // Update Shockwave Pool
    shockwavePool.forEach((sw) => {
      if (sw.life > 0) {
        sw.life -= dt;
        if (sw.life <= 0) {
          sw.mesh.visible = false;
        } else {
          const t = 1 - sw.life / sw.maxLife;
          const easeOut = 1 - Math.pow(1 - t, 3);
          const radius = Math.max(0.5, easeOut * sw.targetRadius);
          sw.mesh.scale.set(radius, radius, 1);
          sw.mesh.material.opacity = (1 - t) * 0.88;
        }
      }
    });

    stageClouds.forEach((c, i) => {
      const a = c.baseAngle + stageElapsed * 0.04 * (i % 2 === 0 ? 1 : -1);
      c.mesh.position.x = Math.cos(a) * c.radius;
      c.mesh.position.z = Math.sin(a) * c.radius;
      c.mesh.position.y = c.yBase + Math.sin(stageElapsed * 1.4 + i) * 0.35;
    });
  }

  // --- HUD & 4x2 Critter Select Modal Rendering ---
  function renderCritterPicker() {
    const activeCritter = CRITTERS.find((c) => c.id === saveState.selectedCritter) || CRITTERS[0];

    const container = document.getElementById('critter-picker');
    if (container) {
      container.innerHTML = '';
      CRITTERS.forEach((c) => {
        const btn = document.createElement('button');
        btn.className = 'critter-pick-btn' + (c.id === saveState.selectedCritter ? ' active' : '');
        btn.setAttribute('aria-label', c.id);
        const img = document.createElement('img');
        img.src = c.icon;
        img.alt = '';
        attachImgFallback(img, c);
        btn.appendChild(img);
        btn.addEventListener('click', () => {
          if (c.id === saveState.selectedCritter) return;
          swapPlayerCritterInPlace(c.id);
        });
        container.appendChild(btn);
      });
    }

    const grid = document.getElementById('critter-grid');
    if (grid) {
      grid.innerHTML = '';
      CRITTERS.forEach((c) => {
        const card = document.createElement('button');
        card.className = 'critter-card' + (c.id === saveState.selectedCritter ? ' active' : '');
        card.setAttribute('aria-label', c.id);
        const img = document.createElement('img');
        img.src = c.icon;
        img.alt = '';
        attachImgFallback(img, c);
        const pips = document.createElement('span');
        pips.className = 'critter-card-pips';
        pips.textContent = c.pips;
        card.appendChild(img);
        card.appendChild(pips);
        card.addEventListener('click', () => {
          SFX.playStar();
          swapPlayerCritterInPlace(c.id);
        });
        grid.appendChild(card);
      });
    }

    ['player-mini-img', 'mobile-picker-img'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.src = activeCritter.icon;
        attachImgFallback(el, activeCritter);
      }
    });
  }

  function renderStageRail() {
    const rail = document.getElementById('stage-rail');
    if (!rail) return;
    rail.innerHTML = '';
    STAGES.forEach((st, idx) => {
      const unlocked = idx <= saveState.unlockedStage;
      const stars = saveState.stageStars[idx] || 0;
      const btn = document.createElement('button');
      btn.className = 'stage-pill' + (idx === currentStageIdx ? ' active' : '') + (!unlocked ? ' locked' : '');
      btn.setAttribute('aria-label', 'Stage ' + (idx + 1));
      btn.innerHTML = `
        <span>${unlocked ? st.emoji : '🔒'}</span>
        <span class="stage-stars-mini">${stars > 0 ? '⭐'.repeat(stars) : ''}</span>
      `;
      btn.addEventListener('click', () => {
        if (idx <= saveState.unlockedStage && idx !== currentStageIdx) {
          startMatch(idx);
        }
      });
      rail.appendChild(btn);
    });
  }

  function updateHUD() {
    const remRatio = Math.max(0, 1 - stageElapsed / currentStage.duration);
    document.getElementById('ring-shrink-fill').style.width = (remRatio * 100).toFixed(1) + '%';
    const timerPill = document.getElementById('ring-timer-pill');
    if (timerPill) {
      if (remRatio < 0.45 && !roundEnded) timerPill.classList.add('danger-pulse');
      else timerPill.classList.remove('danger-pulse');
    }
    document.getElementById('fever-fill').style.width = Math.min(100, feverMeter).toFixed(1) + '%';
    const feverBadge = document.getElementById('fever-badge');
    if (feverTimer > 0) feverBadge.classList.add('fever-active');
    else feverBadge.classList.remove('fever-active');

    for (let i = 0; i < 3; i++) {
      const maxCd = getPlayerMaxCd(i);
      const ratio = 1 - pedalCooldowns[i] / maxCd;
      const fill = document.getElementById('cd-fill-' + (i + 1));
      const btn = document.getElementById('pedal-' + (i + 1));
      if (fill) fill.style.width = (Math.max(0, Math.min(1, ratio)) * 100).toFixed(1) + '%';
      if (btn) {
        if (pedalCooldowns[i] > 0.05) btn.classList.add('on-cooldown');
        else btn.classList.remove('on-cooldown');
      }
    }

    const standings = getSortedStandings();
    const rankMedals = ['🥇', '🥈', '🥉', '😢', '💔'];
    const playerRankIdx = standings.findIndex((b) => b.isPlayer);
    if (playerRankIdx >= 0) {
      document.getElementById('player-rank-emoji').textContent = rankMedals[playerRankIdx];
    }

    initStandingsDOM();
    standings.forEach((b, rIdx) => {
      const node = standingChipNodes[rIdx];
      if (!node) return;
      node.chip.className = 'standing-chip' + (b.isPlayer ? ' is-player' : '') + (b.falling ? ' knocked-out' : '');
      node.medalSpan.textContent = rankMedals[rIdx];
      if (node.lastCritterId !== b.critter.id) {
        node.lastCritterId = b.critter.id;
        node.img.src = b.critter.icon;
        attachImgFallback(node.img, b.critter);
      }
      const pipCount = Math.min(5, b.knockoutsDealt);
      for (let p = 0; p < 5; p++) {
        node.pipSpans[p].style.display = p < pipCount ? 'inline-block' : 'none';
      }
    });
  }

  // --- Controls & Event Listeners ---
  const KEY_MAP = {
    ArrowUp: 'up', KeyW: 'up',
    ArrowDown: 'down', KeyS: 'down',
    ArrowLeft: 'left', KeyA: 'left',
    ArrowRight: 'right', KeyD: 'right'
  };

  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (roundEnded && !selectOverlayOpen && (e.code === 'Enter' || e.code === 'Space')) {
      e.preventDefault();
      if (lastRoundQualified) {
        document.getElementById('btn-next-stage').click();
      } else {
        document.getElementById('btn-retry').click();
      }
      return;
    }
    if (KEY_MAP[e.code]) {
      if (selectOverlayOpen) closeCritterSelectModal();
      keysHeld[KEY_MAP[e.code]] = true;
      const btn = document.getElementById('steer-' + KEY_MAP[e.code]);
      if (btn) btn.classList.add('pressed');
    } else if (e.code === 'Digit1' || e.code === 'Numpad1') {
      triggerPedal(1);
    } else if (e.code === 'Digit2' || e.code === 'Numpad2' || e.code === 'Space') {
      e.preventDefault();
      triggerPedal(2);
    } else if (e.code === 'Digit3' || e.code === 'Numpad3') {
      triggerPedal(3);
    } else if (e.code === 'Enter' && selectOverlayOpen) {
      closeCritterSelectModal();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (KEY_MAP[e.code]) {
      keysHeld[KEY_MAP[e.code]] = false;
      const btn = document.getElementById('steer-' + KEY_MAP[e.code]);
      if (btn) btn.classList.remove('pressed');
    }
  });

  function clearHeldInputs() {
    keysHeld.up = keysHeld.down = keysHeld.left = keysHeld.right = false;
    document.querySelectorAll('.steer-btn').forEach((b) => b.classList.remove('pressed'));
  }

  window.addEventListener('blur', clearHeldInputs);
  document.addEventListener('visibilitychange', () => {
    clearHeldInputs();
    if (!document.hidden) {
      lastTime = performance.now();
    }
  });

  document.querySelectorAll('.steer-btn').forEach((btn) => {
    const dir = btn.getAttribute('data-dir');
    const release = () => {
      keysHeld[dir] = false;
      btn.classList.remove('pressed');
    };
    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (selectOverlayOpen) closeCritterSelectModal();
      keysHeld[dir] = true;
      btn.classList.add('pressed');
    });
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointerleave', release);
    btn.addEventListener('pointercancel', release);
  });

  [1, 2, 3].forEach((num) => {
    const btn = document.getElementById('pedal-' + num);
    if (btn) {
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        triggerPedal(num);
      });
    }
  });

  ['btn-mobile-picker', 'btn-open-grid', 'btn-podium-critter'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        openCritterSelectModal();
      });
    }
  });

  const startBtn = document.getElementById('btn-start-match');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      SFX.playLaunch();
      closeCritterSelectModal();
      if (roundEnded) {
        startMatch(currentStageIdx);
      }
    });
  }

  document.getElementById('btn-camera').addEventListener('click', () => {
    cameraMode = (cameraMode + 1) % 2;
    syncCameraFraming(1.0);
  });

  document.getElementById('btn-sound').addEventListener('click', (e) => {
    SFX.muted = !SFX.muted;
    e.currentTarget.textContent = SFX.muted ? '🔇' : '🔊';
  });

  document.getElementById('btn-retry').addEventListener('click', () => {
    SFX.playLaunch();
    closeCritterSelectModal();
    startMatch(currentStageIdx);
  });

  document.getElementById('btn-next-stage').addEventListener('click', () => {
    if (!lastRoundQualified) return;
    SFX.playLaunch();
    closeCritterSelectModal();
    const nextIdx = (currentStageIdx + 1) % STAGES.length;
    if (nextIdx <= saveState.unlockedStage) {
      startMatch(nextIdx);
    } else {
      startMatch(currentStageIdx);
    }
  });

  function handleViewportResize() {
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    syncCameraFraming(1.0);
    sync3DVisuals(0);
    if (!contextLost) {
      renderer.render(scene, camera);
    }
  }

  window.addEventListener('resize', handleViewportResize);
  window.addEventListener('orientationchange', handleViewportResize);

  // --- Main Render Loop ---
  let lastTime = performance.now();
  let hudTick = 0;

  function animate(now) {
    requestAnimationFrame(animate);
    if (contextLost) return;
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;

    if (assetsReady && !selectOverlayOpen) {
      stepSimulation(dt);
    }
    sync3DVisuals(dt);

    hudTick += dt;
    if (hudTick >= 0.12) {
      hudTick = 0;
      updateHUD();
    }

    renderer.render(scene, camera);
  }

  // --- Deterministic QA & Testing Hook (`window.SUMO_GAME`) ---
  window.SUMO_GAME = {
    getState() {
      const standings = getSortedStandings();
      return {
        assetsReady,
        selectOverlayOpen,
        stageIdx: currentStageIdx,
        stageTheme: currentStage.theme,
        unlockedStage: saveState.unlockedStage,
        stageStars: saveState.stageStars.slice(),
        selectedCritter: saveState.selectedCritter,
        currentRadius,
        stageElapsed,
        roundEnded,
        lastRoundQualified,
        feverMeter,
        feverTimer,
        hitStopTimer,
        activeCoins: starCoinPool.filter((c) => c.active).length,
        pedalCooldowns: pedalCooldowns.slice(),
        geometries: renderer.info.memory.geometries,
        textures: renderer.info.memory.textures,
        shadowMapEnabled: renderer.shadowMap.enabled,
        playerRank: standings.findIndex((b) => b.isPlayer) + 1,
        bumpers: bumpers.map((b) => ({
          id: b.critter.id,
          isPlayer: b.isPlayer,
          mass: b.mass,
          accel: b.accel,
          x: b.x,
          y: b.y,
          z: b.z,
          vx: b.vx,
          vy: b.vy,
          vz: b.vz,
          whirlTimer: b.whirlTimer,
          ramTimer: b.ramTimer,
          falling: b.falling,
          invulnTimer: b.invulnTimer,
          knockoutsDealt: b.knockoutsDealt,
          fallsTaken: b.fallsTaken,
          koScore: b.koScore
        }))
      };
    },
    forceFinish(rank) {
      assetsReady = true;
      closeCritterSelectModal();
      showPodiumModal(rank);
      return this.getState();
    },
    stepSim(seconds) {
      assetsReady = true;
      closeCritterSelectModal();
      hitStopTimer = 0;
      const step = 1 / 120;
      const steps = Math.max(1, Math.round(seconds / step));
      for (let i = 0; i < steps && !roundEnded; i++) {
        stepPhysicsSubstep(step);
      }
      if (deckMesh) deckMesh.scale.set(currentRadius, 1, currentRadius);
      if (edgeRopeMesh) edgeRopeMesh.scale.set(currentRadius, currentRadius, 1);
      sync3DVisuals(1 / 60);
      updateHUD();
      renderer.render(scene, camera);
      return this.getState();
    },
    selectCritter(id) {
      if (CRITTERS.some((c) => c.id === id)) {
        swapPlayerCritterInPlace(id);
      }
      return this.getState();
    },
    selectStage(idx) {
      closeCritterSelectModal();
      startMatch(idx);
      return this.getState();
    },
    usePedal(num) {
      assetsReady = true;
      closeCritterSelectModal();
      return triggerPedal(num);
    }
  };

  // Start at saveState.unlockedStage!
  startMatch(saveState.unlockedStage || 0);
  requestAnimationFrame(animate);
})();

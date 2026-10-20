// Tiny sound manager (no React, no dependencies). Sound effects play on demand,
// and the lobby music loops on the menu screens. Browsers only allow audio after
// the player has interacted with the page, so music starts on the first click.
import click from '../assets/audio/click.mp3';
import correct from '../assets/audio/correct.mp3';
import wrong from '../assets/audio/wrong.mp3';
import levelWin from '../assets/audio/level-win.mp3';
import powerUp from '../assets/audio/power-up.mp3';
import musicLobby from '../assets/audio/music-lobby.mp3';

const SFX = { click, correct, wrong, levelWin, powerUp };
const SFX_VOLUME = 0.8;
const MUSIC_VOLUME = 0.3;
const MUTE_KEY = 'disaster-ready-muted-v1';

let muted = readMuted();
let wantMusic = false;
let music = null;
let fadeTimer = null;
const listeners = new Set();
const sfxCache = {};

function readMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

function safePlay(audio) {
  // play() returns a promise that rejects if the browser blocks autoplay.
  const result = audio.play();
  if (result && typeof result.catch === 'function') result.catch(() => {});
}

export function playSound(name, { delayMs = 0 } = {}) {
  if (muted || !SFX[name]) return;
  const run = () => {
    if (muted) return;
    const audio = (sfxCache[name] ??= new Audio(SFX[name]));
    audio.volume = SFX_VOLUME;
    audio.currentTime = 0;
    safePlay(audio);
  };
  if (delayMs > 0) setTimeout(run, delayMs);
  else run();
}

// Short synthesised beep for the last seconds of Timed Mode (no audio file needed).
let audioContext = null;
export function playTick() {
  if (muted) return;
  try {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    osc.type = 'square';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain).connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // Web Audio unavailable: the visual warning still shows.
  }
}

function getMusic() {
  if (!music) {
    music = new Audio(musicLobby);
    music.loop = true;
    music.volume = MUSIC_VOLUME;
  }
  return music;
}

function fadeTo(target, done) {
  clearInterval(fadeTimer);
  const audio = getMusic();
  fadeTimer = setInterval(() => {
    const step = (target - audio.volume) / 4;
    audio.volume = Math.abs(target - audio.volume) < 0.02 ? target : audio.volume + step;
    if (audio.volume === target) {
      clearInterval(fadeTimer);
      done?.();
    }
  }, 60);
}

function syncMusic() {
  const audio = getMusic();
  if (wantMusic && !muted) {
    audio.volume = 0;
    safePlay(audio);
    fadeTo(MUSIC_VOLUME);
  } else if (!audio.paused) {
    fadeTo(0, () => audio.pause());
  }
}

// Ask for the lobby music on (true) or off (false). It only actually starts
// once the player has interacted with the page.
export function setMusicWanted(value) {
  wantMusic = value;
  syncMusic();
}

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = value;
  try {
    localStorage.setItem(MUTE_KEY, value ? '1' : '0');
  } catch {
    // Storage unavailable: the choice just won't persist.
  }
  syncMusic();
  listeners.forEach((fn) => fn());
}

export function subscribeMuted(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Browsers block autoplay, so retry the music after the first real interaction.
if (typeof document !== 'undefined') {
  const unlock = () => {
    if (wantMusic) syncMusic();
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
  };
  document.addEventListener('pointerdown', unlock);
  document.addEventListener('keydown', unlock);
  // Pause when the tab is hidden so music never plays in the background.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) music?.pause();
    else if (wantMusic && !muted) safePlay(getMusic());
  });
}

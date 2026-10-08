const defaultAd = {
  title: 'Oferta imperdível',
  text: 'Aproveite agora e ganhe bônus exclusivos por tempo limitado.',
  interval: 8,
  color: '#ff7a18',
};

const modal = document.getElementById('adModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const adTitleInput = document.getElementById('adTitle');
const adTextInput = document.getElementById('adText');
const adIntervalInput = document.getElementById('adInterval');
const adColorInput = document.getElementById('adColor');
const adStatusDot = document.getElementById('adStatusDot');
const floatingTitle = document.getElementById('floatingTitle');
const closeBtn = document.getElementById('closeAd');
const bannerBtn = document.getElementById('bannerBtn');
const openPromo = document.getElementById('openPromo');
const ctaButton = document.getElementById('ctaButton');
const heroOffer = document.getElementById('heroOffer');
const toggleAdMode = document.getElementById('toggleAdMode');

let adState = { ...defaultAd };
let adTimer = null;
let adEnabled = true;

function loadState() {
  const saved = JSON.parse(localStorage.getItem('promoAdState') || 'null');
  adState = saved ? { ...defaultAd, ...saved } : { ...defaultAd };

  adTitleInput.value = adState.title;
  adTextInput.value = adState.text;
  adIntervalInput.value = String(adState.interval);
  adColorInput.value = adState.color;

  applyVisualState();
}

function saveState() {
  localStorage.setItem('promoAdState', JSON.stringify(adState));
}

function applyVisualState() {
  const root = document.documentElement;
  root.style.setProperty('--accent', adState.color);
  root.style.setProperty('--accent-2', '#ffd166');

  modalTitle.textContent = adState.title;
  modalText.textContent = adState.text;
  floatingTitle.textContent = adState.title;
  document.documentElement.style.setProperty('--status-color', adState.color);
  adStatusDot.style.background = adEnabled ? '#54d394' : '#ff4d6d';
}

function openAd(force = false) {
  if (!adEnabled && !force) return;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeAd() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  setTimeout(() => {
    if (adEnabled) {
      openAd(true);
    }
  }, 600);
}

function restartLoop() {
  if (adTimer) clearInterval(adTimer);

  adTimer = setInterval(() => {
    if (adEnabled) {
      openAd();
    }
  }, Number(adState.interval) * 1000);
}

function updateAdFromForm(event) {
  event.preventDefault();

  adState.title = adTitleInput.value.trim() || defaultAd.title;
  adState.text = adTextInput.value.trim() || defaultAd.text;
  adState.interval = Math.min(60, Math.max(3, Number(adIntervalInput.value) || 8));
  adState.color = adColorInput.value || defaultAd.color;

  saveState();
  applyVisualState();
  restartLoop();
  openAd(true);
}

function toggleAdModeState() {
  adEnabled = !adEnabled;
  adStatusDot.style.background = adEnabled ? '#54d394' : '#ff4d6d';
  if (adEnabled) {
    restartLoop();
    openAd(true);
  } else {
    clearInterval(adTimer);
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

[closeBtn, bannerBtn, openPromo, ctaButton, heroOffer].forEach((el) => {
  el.addEventListener('click', () => {
    openAd(true);
  });
});

closeBtn.addEventListener('click', (event) => {
  event.preventDefault();
  closeAd();
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeAd();
  }
});

document.getElementById('adForm').addEventListener('submit', updateAdFromForm);
toggleAdMode.addEventListener('click', toggleAdModeState);

window.addEventListener('load', () => {
  loadState();
  restartLoop();
  setTimeout(() => openAd(true), 900);
});

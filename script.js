const storageKey = 'iceMixConfig';
const adminPassword = 'icemix2026';
const adminParam = new URLSearchParams(window.location.search).get('admin');
let isAdminMode = adminParam === '1';

const defaultConfig = {
  brand: 'ICE MIX',
  eyebrow: 'Granizados frescos • Cocteles fríos • Dulce momento',
  headline: 'ICE MIX SABORES MIX',
  heroText: 'Descubre combinaciones irresistibles con frutas, sabores tropicales y una mezcla única de granizados y cocteles para disfrutar al máximo.',
  buttonText: 'Pide tu bebida',
  recommendTitle: 'Hoy te recomendamos',
  recommendName: 'Tropical Sunrise',
  recommendDesc: 'Piña, mango y un toque de limón',
  flavorsTitle: 'Sabores estrella',
  flavorOneTitle: 'Mango Passion',
  flavorOneText: 'Granizado tropical con mango, maracuyá y hielo finísimo.',
  flavorTwoTitle: 'Berry Breeze',
  flavorTwoText: 'Coctel refrescante con fresa, mora y un toque cítrico.',
  flavorThreeTitle: 'Coco Splash',
  flavorThreeText: 'Granizado cremoso con coco, piña y un sabor muy tropical.',
  aboutEyebrow: '¿Por qué elegir Ice Mix?',
  aboutTitle: 'Un espacio fresco, alegre y lleno de sabor',
  aboutText: 'Ice Mix nace para ofrecerte experiencias refrescantes con un estilo moderno, atención cercana y bebidas preparadas con frutas frescas y mucho sabor.',
  highlightTitle: '✨ Refrescante y rápido',
  highlightText: 'Preparación en minutos y bebidas ideales para compartir y disfrutar.',
  contactEyebrow: 'Contáctanos',
  contactTitle: 'Haz tu pedido hoy',
  contactText: 'Escríbenos o visítanos para disfrutar de tus granizados y cocteles favoritos.',
  image1: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80',
  image2: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  image3: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  phone: '+57 300 123 4567',
  email: 'hola@icemix.com',
  hours: 'Lunes a Domingo · 12:00 p.m. a 10:00 p.m.',
  primary: '#ff4fa3',
  secondary: '#3a7cff',
  background: '#f8f6ff',
  text: '#3d3d4f',
  surface: '#ffffff'
};

const form = document.getElementById('configForm');
const resetBtn = document.getElementById('resetBtn');
const statusMessage = document.getElementById('statusMessage');
const panel = document.getElementById('adminPanel');
const adminBtn = document.getElementById('adminBtn');
const adminPasswordInput = document.getElementById('adminPassword');

function loadConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return {
      ...defaultConfig,
      ...saved,
      ...(saved && saved.colors ? saved.colors : {})
    };
  } catch (error) {
    return { ...defaultConfig };
  }
}

function saveConfig(config) {
  localStorage.setItem(storageKey, JSON.stringify(config));
}

function applyConfig(config) {
  document.documentElement.style.setProperty('--primary', config.primary);
  document.documentElement.style.setProperty('--secondary', config.secondary);
  document.documentElement.style.setProperty('--background', config.background);
  document.documentElement.style.setProperty('--text', config.text);
  document.documentElement.style.setProperty('--surface', config.surface);

  document.querySelectorAll('[data-bind]').forEach((element) => {
    const key = element.getAttribute('data-bind');
    if (key && config[key] !== undefined) {
      element.textContent = config[key];
    }
  });

  document.querySelectorAll('[data-bind-image]').forEach((element) => {
    const key = element.getAttribute('data-bind-image');
    if (key && config[key]) {
      element.src = config[key];
      element.alt = config[key] || 'Imagen de bebida';
    }
  });
}

function populateForm(config) {
  if (!form) {
    return;
  }

  const elements = form.elements;

  for (const element of elements) {
    if (!element.name || element.type === 'button' || element.type === 'submit') continue;

    if (element.type === 'color') {
      element.value = config[element.name] || defaultConfig[element.name];
    } else {
      element.value = config[element.name] || '';
    }
  }
}

function updateStatus(message) {
  if (statusMessage) {
    statusMessage.textContent = message;
    clearTimeout(updateStatus.timeout);
    updateStatus.timeout = setTimeout(() => {
      statusMessage.textContent = 'Los cambios se guardan automáticamente.';
    }, 1800);
  }
}

function handleInput(event) {
  const { name, value, type } = event.target;
  const config = loadConfig();
  config[name] = type === 'color' ? value : value;
  saveConfig(config);
  applyConfig(config);
  updateStatus('Cambios aplicados');
}

function resetConfig() {
  const config = { ...defaultConfig };
  saveConfig(config);
  populateForm(config);
  applyConfig(config);
  updateStatus('Configuración restablecida');
}

function setupAdminMode() {
  if (panel) {
    panel.classList.toggle('hidden', !isAdminMode);
  }

  if (adminBtn && adminPasswordInput) {
    adminBtn.onclick = () => {
      const value = adminPasswordInput.value.trim();
      if (value === adminPassword) {
        isAdminMode = true;
        setupAdminMode();
        adminPasswordInput.value = '';
        updateStatus('Modo administrador activo.');
      } else {
        alert('Clave incorrecta');
      }
    };
  }

  if (!form) {
    return;
  }

  form.addEventListener('input', handleInput);
  form.addEventListener('change', handleInput);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const config = loadConfig();
    saveConfig(config);
    applyConfig(config);
    updateStatus('Configuración guardada');
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', resetConfig);
  }

  if (isAdminMode) {
    const initialConfig = loadConfig();
    populateForm(initialConfig);
    applyConfig(initialConfig);
    updateStatus('Modo administrador activo.');
  } else {
    const initialConfig = loadConfig();
    applyConfig(initialConfig);
  }
}

setupAdminMode();

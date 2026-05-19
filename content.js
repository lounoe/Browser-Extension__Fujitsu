// Variables para controlar el estado del silenciado
let isAdMuted = false; // Indica si el video está silenciado por un anuncio
let userMuted = false; // Indica si el usuario ha silenciado manualmente el video

// Función para incrementar el contador de anuncios silenciados
function incrementAdCounter() {
  chrome.runtime.sendMessage({ action: 'incrementAdCounter' }, (response) => {
    if (response && response.success) {
      console.log('Contador de anuncios incrementado.');
    }
  });
}

// Función para detectar y silenciar anuncios en YouTube
function muteYouTubeAds() {
  const video = document.querySelector('video'); // Obtener el elemento de video

  if (video && document.querySelector('.ad-showing, .ad-interrupting')) {
    if (!video.muted) {
      isAdMuted = true; // Marcar que el video está silenciado por un anuncio
      video.muted = true; // Silenciar el video si hay un anuncio
      incrementAdCounter(); // Incrementar el contador
      console.log('Anuncio de YouTube detectado y silenciado.');
    }
  } else if (video && isAdMuted && !userMuted) {
    video.muted = false; // Restaurar el sonido si no hay anuncio y el usuario no ha silenciado manualmente
    isAdMuted = false; // Restablecer el estado
    console.log('Anuncio de YouTube terminado, restaurando el sonido.');
  }
}

// Función para detectar y silenciar anuncios en Twitch
function muteTwitchAds() {
  const video = document.querySelector('video'); // Obtener el elemento de video
  const adElement = document.querySelector('.video-ad__overlay, .twitch-ads'); // Elementos de anuncio en Twitch

  if (video && adElement) {
    if (!video.muted) {
      isAdMuted = true; // Marcar que el video está silenciado por un anuncio
      video.muted = true; // Silenciar el video si hay un anuncio
      incrementAdCounter(); // Incrementar el contador
      console.log('Anuncio de Twitch detectado y silenciado.');
    }
  } else if (video && isAdMuted && !userMuted) {
    video.muted = false; // Restaurar el sonido si no hay anuncio y el usuario no ha silenciado manualmente
    isAdMuted = false; // Restablecer el estado
    console.log('Anuncio de Twitch terminado, restaurando el sonido.');
  }
}

// Monitorear cambios en el DOM
const observer = new MutationObserver(() => {
  if (window.location.hostname.includes('youtube.com')) {
    muteYouTubeAds(); // Ejecutar la función para YouTube
  } else if (window.location.hostname.includes('twitch.tv')) {
    muteTwitchAds(); // Ejecutar la función para Twitch
  }
});

// Configurar el observer para monitorear cambios en el cuerpo del documento
observer.observe(document.body, {
  childList: true,    // Observar cambios en los hijos del nodo
  subtree: true       // Observar cambios en todo el subárbol del DOM
});

// Ejecutar la función inicialmente
if (window.location.hostname.includes('youtube.com')) {
  muteYouTubeAds();
} else if (window.location.hostname.includes('twitch.tv')) {
  muteTwitchAds();
}

// Escuchar eventos de reproducción de video
document.addEventListener('play', () => {
  if (window.location.hostname.includes('youtube.com')) {
    muteYouTubeAds();
  } else if (window.location.hostname.includes('twitch.tv')) {
    muteTwitchAds();
  }
}, true);

// Escuchar cambios en el estado de silenciado del video
document.addEventListener('volumechange', () => {
  const video = document.querySelector('video');
  if (video) {
    userMuted = video.muted; // Actualizar el estado de silenciado manual
    if (userMuted) {
      isAdMuted = false; // Si el usuario silencia manualmente, desactivar el silenciado automático
    }
  }
});
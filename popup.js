// Obtener el contador de anuncios silenciados desde el almacenamiento
chrome.storage.local.get(['adCounter'], function (result) {
  const counterElement = document.getElementById('counter');
  if (result.adCounter) {
    counterElement.textContent = result.adCounter; // Mostrar el contador
  } else {
    counterElement.textContent = '0'; // Si no hay contador, mostrar 0
  }
});

// Botón para resetear el contador
document.getElementById('resetButton').addEventListener('click', () => {
  chrome.storage.local.set({ adCounter: 0 }, function () {
    document.getElementById('counter').textContent = '0'; // Actualizar el contador en el popup
  });
});
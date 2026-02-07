const overlay = document.getElementById('overlay');
const overlayImageContainer = document.getElementById('overlay-image-container');
const overlayImage = document.getElementById('overlay-image');
const credits = document.getElementById('credits');
const closeButton = document.getElementById('close-button');

function openImage(file, character) {
    overlayImage.src = file;
    credits.innerHTML = `Character: ${character}`;
    overlay.style.display = 'block';
}

function closeImage() {
    overlay.style.display = 'none';
}
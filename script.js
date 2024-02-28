function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.getElementById("sticker").src = "stickers/"+randomInteger(1, 7)+".webp"
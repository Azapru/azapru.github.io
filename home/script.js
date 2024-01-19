function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(randomInteger(1, 10))
document.getElementById("sticker").src = "stickers/"+randomInteger(1, 12)+".webp"
window.addEventListener('scroll', updateBackground);

function updateBackground() {
    const scrollY = window.scrollY;
    const parallax = document.getElementById('parallax-bg');
    parallax.style.transform = `translateY(${scrollY * -0.5 - 500}px)`;
}

updateBackground();
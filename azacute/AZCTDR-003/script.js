(function () {
        const supportsTimeline = CSS.supports("animation-timeline: scroll(root block)");

        if (supportsTimeline) return;

        const doc = document.documentElement;
        const bg = document.body;

        function updateBackground() {
        const scrollTop = doc.scrollTop || document.body.scrollTop;
        const maxScroll = doc.scrollHeight - doc.clientHeight;
        const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
        document.body.style.setProperty(
            "--bg-pos",
            `${progress * 100}%`
        );
        document.body.style.setProperty(
            "--bg-pos",
            `${progress * 100}%`
        );
        document.body.style.setProperty(
            "--bg-pos",
            `${progress * 100}%`
        );
    }

    // Instead of body background, we target the ::before element
    const style = document.createElement("style");
    style.textContent = `
        body::before {
            background-position: center var(--bg-pos, 0%);
        }
        `;
    document.head.appendChild(style);

    window.addEventListener("scroll", updateBackground, { passive: true });
    updateBackground();
})();
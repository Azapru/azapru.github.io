let currentDrag = null;
let currentResize = null;
let offsetX = 0;
let offsetY = 0;
let zIndexCounter = 1;

// Function for creating windows for apps
function createWindow(app, title, x, y, width, height, allowResize, center) {
    const appWindow = document.createElement('div');
    appWindow.className = "appWindow";
    appWindow.style.zIndex = zIndexCounter++; // Make sure it on top
    document.getElementById("watermark").style.zIndex = zIndexCounter++; // Make sure the watermark always stays on top
    if (center == true) {
        appWindow.style.left = `${window.innerWidth/2 - width/2}px`;
        appWindow.style.top = `${window.innerHeight/2 - height/2}px`;
    } else {
        appWindow.style.left = `${x}px`;
        appWindow.style.top = `${y}px`;
    }
    // Check if the user is on mobile to set proper window position
    if (window.matchMedia("(max-width: 768px)").matches) {
        appWindow.style.left = `0px`;
        appWindow.style.top = `0px`;
    }
    appWindow.style.width = `${width}px`
    appWindow.style.height = `${height}px`
    
    // Bar
    const bar = document.createElement("div");
    bar.className = "bar";
    appWindow.appendChild(bar);

    // App icon
    const appIcon = document.createElement("div");
    appIcon.className = "appIcon";
    appIcon.style.backgroundImage = `url("apps/${app}/icon.png")`;
    bar.appendChild(appIcon);
    
    // App title
    const appTitle = document.createElement("h3");
    appTitle.className = "appTitle";
    appTitle.textContent = title;
    bar.appendChild(appTitle);
    
    // Close button
    const close = document.createElement("div");
    close.className = "close";
    close.addEventListener("click", (e) => {
        appWindow.classList.add("close-anim");
        appWindow.addEventListener("animationend", () => {
            e.stopPropagation();
            appWindow.remove();
        })
    });
    close.oncontextmenu = close.oncontextmenu = function() {return false;} // Disable right click menu for the close button
    bar.appendChild(close);
    
    // App area
    const appArea = document.createElement("div");
    appArea.className = "appArea";
    fetch(`apps/${app}/app.html`)
        .then(response => {
            return response.text();
        })
        .then(text => {
            appArea.innerHTML = text;
        });
    appWindow.appendChild(appArea);

    // Resize
    const resize = document.createElement("div");
    resize.className = "resize";
    if (allowResize == true) {
        appWindow.appendChild(resize);
    }

    document.body.appendChild(appWindow); // Add the window to the body
}

document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains("appWindow")) {
        currentDrag = e.target;

        currentDrag.style.zIndex = zIndexCounter++;
        document.getElementById("watermark").style.zIndex = zIndexCounter++; // Make sure the watermark always stays on top

        offsetX = e.clientX - currentDrag.offsetLeft;
        offsetY = e.clientY - currentDrag.offsetTop;
    }
    
    // Once clicked, loops through parent elements until it finds a window to bring it to top.
    let currentElement = e.target;
    while (currentElement) {
        if (currentElement.classList.contains("appArea")) {
            currentElement.parentElement.style.zIndex = zIndexCounter++;
            document.getElementById("watermark").style.zIndex = zIndexCounter++; // Make sure the watermark always stays on top
            break;
        }
        currentElement = currentElement.parentElement;
    }

    if (e.target.classList.contains("resize")) {
        currentResize = e.target.parentElement;

        currentResize.style.zIndex = zIndexCounter++;
        document.getElementById("watermark").style.zIndex = zIndexCounter++;

        // This simple math got me dizzy idk why it took me so long
        offsetX = e.clientX - currentResize.offsetWidth - currentResize.offsetLeft + 4;
        offsetY = e.clientY - currentResize.offsetHeight - currentResize.offsetTop + 4;
    }
});

document.addEventListener('mousemove', (e) => {
    if (currentDrag) {
        currentDrag.style.left = `${e.clientX - offsetX}px`;
        currentDrag.style.top = `${e.clientY - offsetY}px`;
        
        document.body.style.userSelect = 'none';

        // Make sure the window bar can't go to the void
        if (e.clientX - offsetX < 0) {
            currentDrag.style.left = "0px";
        }
        if (e.clientY - offsetY < 0) {
            currentDrag.style.top = "0px";
        }
        if (e.clientX - offsetX + currentDrag.offsetWidth > window.innerWidth) {
            currentDrag.style.left = `${window.innerWidth - currentDrag.offsetWidth}px`;
        }
        if (e.clientY - offsetY + currentDrag.offsetHeight > window.innerHeight) {
            currentDrag.style.top = `${window.innerHeight - currentDrag.offsetHeight}px`;
        }
    }

    if (currentResize) {
        currentResize.style.width = `${e.clientX - currentResize.offsetLeft - offsetX}px`;
        currentResize.style.height = `${e.clientY - currentResize.offsetTop - offsetY}px`;

        document.body.style.userSelect = 'none';
    }
});

document.addEventListener('mouseup', () => {
    if (currentDrag) {
        currentDrag = null;
        document.body.style.userSelect = 'auto';
    }

    if (currentResize) {
        currentResize = null;
        document.body.style.userSelect = 'auto';
    }
});

createWindow('aboutme', 'About Me!', 0, 0, 820, 510, true, true) // Create the initial window
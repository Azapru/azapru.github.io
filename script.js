let currentDrag = null;
let currentResize = null;
let offsetX = 0;
let offsetY = 0;
let zIndexCounter = 1;

let desktopDragPosX = 0
let desktopDragPosY = 0
let desktopDrag = false

// Function for creating windows for apps
function createWindow(app) {
    fetch(`apps/${app}/app.json`)
        .then(response => response.json())
        .then(data => {
            title = data["window_title"]
            x = data["x"]
            y = data["y"]
            width = data["width"]
            height = data["height"]
            allowResize = data["allow_resizing"]
            center = data["center"]

            const appWindow = document.createElement('div');
            appWindow.className = "appWindow";
            appWindow.style.zIndex = zIndexCounter++; // Make sure it on top
            document.getElementById("watermark").style.zIndex = zIndexCounter++; // Make sure the watermark always stays on top
            if (center == true) {
                appWindow.style.left = `${window.innerWidth/2 - width/2}px`;
                appWindow.style.top = `${window.innerHeight/2 - height/2}px`;
            } else {
                let posX = x/100 * window.innerWidth
                let posY = y/100 * window.innerHeight

                if (posX > (window.innerWidth / 2)) {
                    posX = posX - width
                }
                if (posY > (window.innerHeight / 2)) {
                    posY = posY - height
                }

                appWindow.style.left = `${posX}px`;
                appWindow.style.top = `${posY}px`;
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
            const appArea = document.createElement("iframe");
            appArea.className = "appArea";
            appArea.src = `apps/${app}/`
            appWindow.appendChild(appArea);

            // Resize
            const resize = document.createElement("div");
            resize.className = "resize";
            if (allowResize == true) {
                appWindow.appendChild(resize);
            }

            document.body.appendChild(appWindow); // Add the window to the body
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains("appWindow")) {
        currentDrag = e.target;

        currentDrag.style.zIndex = zIndexCounter++;
        document.getElementById("watermark").style.zIndex = zIndexCounter++; // Make sure the watermark always stays on top

        offsetX = e.clientX - currentDrag.offsetLeft;
        offsetY = e.clientY - currentDrag.offsetTop;

        // Making all app areas un-interactable so they don't break moving the windows
        document.querySelectorAll(".appArea").forEach(element => {
            element.style.pointerEvents = "none";
        });
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

        // Making all app areas un-interactable so they don't break moving the windows
        document.querySelectorAll(".appArea").forEach(element => {
            element.style.pointerEvents = "none";
        });
    }

    // Dragging on desktop
    if (e.target.classList.contains("grid")) {
        desktopDragPosX = e.clientX
        desktopDragPosY = e.clientY
        desktopDrag = true

        document.getElementById("drag").style.left = `${desktopDragPosX}px`
        document.getElementById("drag").style.top = `${desktopDragPosY}px`
        document.getElementById("drag").style.width = `${Math.abs(e.clientX - desktopDragPosX)}px`
        document.getElementById("drag").style.height = `${Math.abs(e.clientY - desktopDragPosY)}px`
        document.getElementById("drag").style.display = "block"
        document.getElementById("drag").classList.remove("fadeOutAnim")

        // Making all app areas un-interactable so they don't break moving the windows
        document.querySelectorAll(".appArea").forEach(element => {
            element.style.pointerEvents = "none";
        });
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

    if (desktopDrag) {
        document.getElementById("drag").style.left = `${(e.clientX - desktopDragPosX) < 0 ? e.clientX : desktopDragPosX}px`
        document.getElementById("drag").style.top = `${(e.clientY- desktopDragPosY) < 0 ? e.clientY : desktopDragPosY}px`
        document.getElementById("drag").style.width = `${Math.abs(e.clientX - desktopDragPosX)}px`
        document.getElementById("drag").style.height = `${Math.abs(e.clientY - desktopDragPosY)}px`
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

    if (desktopDrag) {
        document.getElementById("drag").classList.add("fadeOutAnim")
        desktopDrag = false;
    }

    // Making all app areas interactable again
    document.querySelectorAll(".appArea").forEach(element => {
        element.style.pointerEvents = "all";
    });
});

document.getElementById("drag").addEventListener("animationend", () => {
    document.getElementById("drag").classList.remove("fadeOutAnim")
    document.getElementById("drag").style.display = "none"
})

createWindow("aboutme") // Create the initial window
const urlParams = new URLSearchParams(window.location.search);

const verTitle = "Azzierium Desktop ALPHA v0.6-26.2.7"

let currentDrag = null;
let currentResize = null;
let offsetX = 0;
let offsetY = 0;
let zIndexCounter = 1;

let desktopDragPosX = 0
let desktopDragPosY = 0
let desktopDrag = false

function getElementWithHighestZIndex(className) {
    const elements = document.querySelectorAll(`.${className}`);
    if (elements.length === 0) return null;

    let maxZIndex = -Infinity;
    let highestElement = null;

    elements.forEach(element => {
        const style = window.getComputedStyle(element);
        // Skip elements with display: none
        if (style.display === 'none') return;

        const zIndexStr = style.zIndex;
        // Convert to number; treat 'auto' or non-numeric as 0
        const zIndex = parseInt(zIndexStr, 10);
        const numericZIndex = isNaN(zIndex) ? 0 : zIndex;

        if (numericZIndex > maxZIndex) {
            maxZIndex = numericZIndex;
            highestElement = element;
        }
    });

    return highestElement;
}

// Frame rate monitor
const times = [];
let fps = 0;
let lastDisplayTime = 0;
const DISPLAY_INTERVAL = 250;

function refreshLoop() {
    window.requestAnimationFrame(() => {
        const now = performance.now();
        
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;
        
        if (now - lastDisplayTime >= DISPLAY_INTERVAL) {
            document.getElementById("watermark").innerHTML = verTitle + "<br>FPS: " + fps;
            lastDisplayTime = now;
        }
        
        refreshLoop();
    });
}

refreshLoop();

// z-index fuckery
function orderNotifs() {
    const notifs = document.getElementsByClassName("notifBox");
    for (let i = 0; i < notifs.length; i++) {
        notifs[i].style.zIndex = zIndexCounter++;
    }
}

function layerElements() {
    orderNotifs()
    document.getElementById("watermark").style.zIndex = zIndexCounter++;
    document.getElementById("crt").style.zIndex = zIndexCounter++;
    document.getElementById("bloom").style.zIndex = zIndexCounter++;
}

function sendNotification(title, content, height, timeout) {
    // Move past notifications up
    const notifs = document.getElementsByClassName("notifBox");
    for (let i = 0; i < notifs.length; i++) {
        const currentBottom = parseInt(getComputedStyle(notifs[i]).bottom) || 0;
        notifs[i].style.bottom = (currentBottom + height+16) + 'px';
    }

    // Create notification
    const notification = document.createElement("div");
    notification.className = "notifBox";
    notification.style.height = height + "px";

    const notifBoxTitleArea = document.createElement("div");
    notifBoxTitleArea.className = "notifBoxTitleArea";

    const notifTitle = document.createElement("span");
    notifTitle.className = "notifTitle";
    notifTitle.innerText = title;
    notifBoxTitleArea.appendChild(notifTitle);

    const notifClose = document.createElement("div");
    notifClose.className = "notifClose";
    notifClose.addEventListener("click", (e) => {
        notification.classList.add("slide-out-anim");
        notification.addEventListener("animationend", (e) => {
            notification.remove();
        })
    })
    notifBoxTitleArea.appendChild(notifClose);

    notification.appendChild(notifBoxTitleArea);

    const notifContent = document.createElement("div");
    notifContent.className = "notifContent";
    notifContent.innerHTML = content;
    notification.appendChild(notifContent);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("slide-out-anim");
        notification.addEventListener("animationend", (e) => {
            notification.remove();
        })
    }, timeout);

    layerElements()
}

// Function for creating windows for apps
function createWindow(app) {
    fetch(`apps/${app}/app.json`)
        .then(response => response.json())
        .then(data => {
            title = data["window_title"];
            x = data["x"];
            y = data["y"];
            width = data["width"];
            height = data["height"];
            allowResize = data["allow_resizing"];
            center = data["center"];

            // Create app window
            const appWindow = document.createElement('div');
            appWindow.className = "appWindow";
            appWindow.style.zIndex = zIndexCounter++; // Make sure its on top
            layerElements()
            // Set initial window position
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
            
            // Link button
            const linkBtn = document.createElement("div");
            linkBtn.className = "linkBtn";
            linkBtn.addEventListener("click", (e) => {
                sendNotification("Copied to clipboard", "Link to directly open this app has been copied to your clipboard!", 100, 3000)
                navigator.clipboard.writeText(window.location.origin + window.location.pathname + "?app=" + app);
            });
            linkBtn.oncontextmenu = linkBtn.oncontextmenu = function() {return false;} // Disable right click menu for the link button
            bar.appendChild(linkBtn);

            // Minimize button
            const minimize = document.createElement("div");
            minimize.className = "minimize";
            minimize.addEventListener("click", (e) => {
                task.classList.add("taskHidden");
                appWindow.classList.remove("window-show-anim");
                appWindow.classList.remove("window-focus-anim");
                appWindow.classList.add("window-hide-anim");
                const handleAnimationEnd = (e) => {
                    appWindow.style.display = "none";
                    appWindow.classList.remove("window-hide-anim");
                    appWindow.removeEventListener("animationend", handleAnimationEnd);
                }
                appWindow.addEventListener("animationend", handleAnimationEnd);
            });
            minimize.oncontextmenu = minimize.oncontextmenu = function() {return false;} // Disable right click menu for the minimize button
            bar.appendChild(minimize);

            // Close button
            const close = document.createElement("div");
            close.className = "close";
            close.addEventListener("click", (e) => {
                // Close task
                task.classList.add("task-close-anim");
                task.addEventListener("animationend", (e) => {
                    task.remove();
                });

                // Close window
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
            appArea.onload = function () { // Bring window to top if clicked inside the frame
                const iframeDoc = appArea.contentWindow.document;
                iframeDoc.addEventListener("mousedown", function () {
                    appArea.parentElement.style.zIndex = zIndexCounter++;
                    layerElements()
                });
            };

            // Resize area
            const resize = document.createElement("div");
            resize.className = "resize";
            if (allowResize == true) {
                appWindow.appendChild(resize);
            }

            // Pop out animation
            appWindow.classList.add("pop-out-anim");
            const handleAnimationEnd = (e) => {
                appWindow.classList.remove("pop-out-anim");
                appWindow.removeEventListener("animationend", handleAnimationEnd);
            }
            appWindow.addEventListener("animationend", handleAnimationEnd);

            document.body.appendChild(appWindow); // Add the window to the body
            
            // Make sure it cant spawn outside the frame of the desktop
            if (parseInt(appWindow.style.left) < 0) {
                appWindow.style.left = "0px";
            }
            if (parseInt(appWindow.style.top) < 0) {
                appWindow.style.top = "0px";
            }
            if (parseInt(appWindow.style.left) + parseInt(appWindow.style.width) > window.innerWidth - 6) {
                appWindow.style.width = `${window.innerWidth - parseInt(appWindow.style.left) - 6}px`
            }
            if (parseInt(appWindow.style.top) + parseInt(appWindow.style.height) > window.innerHeight - 6 - 48) {
                appWindow.style.height = `${window.innerHeight - parseInt(appWindow.style.top) - 6 - 48}px`
            }

            // Task bar stuff //
            
            // Add taskbar entry
            const task = document.createElement("div");
            task.className = "task";
            
            task.addEventListener("mousedown", (e) => {
                if (getElementWithHighestZIndex("appWindow") == appWindow) {
                    if (appWindow.style.display == "none") {
                        task.classList.remove("taskHidden");
                        appWindow.style.display = "block";
                        appWindow.classList.remove("window-hide-anim");
                        appWindow.classList.remove("window-focus-anim");
                        appWindow.classList.add("window-show-anim");
                        const handleAnimationEnd = (e) => {
                            appWindow.classList.remove("window-show-anim");
                            appWindow.removeEventListener("animationend", handleAnimationEnd);
                        }
                        appWindow.addEventListener("animationend", handleAnimationEnd);
                    } else {
                        task.classList.add("taskHidden");
                        appWindow.classList.remove("window-show-anim");
                        appWindow.classList.remove("window-focus-anim");
                        appWindow.classList.add("window-hide-anim");
                        const handleAnimationEnd = (e) => {
                            appWindow.style.display = "none";
                            appWindow.classList.remove("window-hide-anim");
                            appWindow.removeEventListener("animationend", handleAnimationEnd);
                        }
                        appWindow.addEventListener("animationend", handleAnimationEnd);
                    }
                } else {
                    appWindow.style.zIndex = zIndexCounter++;
                    layerElements()

                    if (appWindow.style.display == "none") {
                        task.classList.remove("taskHidden");
                        appWindow.style.display = "block";
                        appWindow.classList.remove("window-hide-anim");
                        appWindow.classList.remove("window-focus-anim");
                        appWindow.classList.add("window-show-anim");
                        const handleAnimationEnd = (e) => {
                            appWindow.classList.remove("window-show-anim");
                            appWindow.removeEventListener("animationend", handleAnimationEnd);
                        }
                        appWindow.addEventListener("animationend", handleAnimationEnd);
                    } else {
                        appWindow.classList.add("window-focus-anim");
                        const handleAnimationEnd = (e) => {
                            appWindow.classList.remove("window-focus-anim");
                            appWindow.removeEventListener("animationend", handleAnimationEnd);
                        }
                        appWindow.addEventListener("animationend", handleAnimationEnd);
                    }
                }
            });
            
            // Task icon
            const taskIcon = document.createElement("div");
            taskIcon.className = "taskIcon";
            taskIcon.style.backgroundImage = `url("apps/${app}/icon.png")`;
            task.appendChild(taskIcon);

            // Task title
            const taskTitle = document.createElement("h3");
            taskTitle.className = "taskTitle";
            taskTitle.innerText = title;
            task.appendChild(taskTitle);

            document.getElementById("taskbar").appendChild(task);

        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains("appWindow")) {
        currentDrag = e.target;

        currentDrag.style.zIndex = zIndexCounter++;
        layerElements()

        offsetX = e.clientX - currentDrag.offsetLeft;
        offsetY = e.clientY - currentDrag.offsetTop;

        // Making all app areas un-interactable so they don't break moving the windows
        document.querySelectorAll(".appArea").forEach(element => {
            element.style.pointerEvents = "none";
        });
    }

    if (e.target.classList.contains("resize")) {
        currentResize = e.target.parentElement;

        currentResize.style.zIndex = zIndexCounter++;
        layerElements()

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
        if (e.clientX - offsetX + currentDrag.offsetWidth > window.innerWidth - 2) {
            currentDrag.style.left = `${window.innerWidth - currentDrag.offsetWidth - 2}px`;
        }
        if (e.clientY - offsetY + currentDrag.offsetHeight > window.innerHeight - 2 - 48) {
            currentDrag.style.top = `${window.innerHeight - currentDrag.offsetHeight - 2 - 48}px`;
        }
    }

    if (currentResize) {
        currentResize.style.width = `${e.clientX - currentResize.offsetLeft - offsetX}px`;
        currentResize.style.height = `${e.clientY - currentResize.offsetTop - offsetY}px`;

        // Lock resizing to the desktop frame
        if (parseInt(currentResize.style.left) + parseInt(currentResize.style.width) > window.innerWidth - 6) {
            currentResize.style.width = `${window.innerWidth - parseInt(currentResize.style.left) - 6}px`
        }
        if (parseInt(currentResize.style.top) + parseInt(currentResize.style.height) > window.innerHeight - 6 - 48) {
            currentResize.style.height = `${window.innerHeight - parseInt(currentResize.style.top) - 6 - 48}px`
        }

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

// Update reset
let reset_value = 8

if (localStorage.getItem("reset_value") != null) {
    if (parseInt(localStorage.getItem("reset_value")) < reset_value) {
        localStorage.setItem("bloom", "on")
        localStorage.setItem("crt", "on")
        localStorage.setItem("welcome", "on")
        localStorage.setItem("theme", "night-storm")

        localStorage.setItem("reset_value", reset_value);
    }
} else {
    localStorage.setItem("reset_value", reset_value);
}

// Set default settings
if (localStorage.getItem("bloom") == null) {
    localStorage.setItem("bloom", "on")
}
if (localStorage.getItem("crt") == null) {
    localStorage.setItem("crt", "on")
}
if (localStorage.getItem("welcome") == null) {
    localStorage.setItem("welcome", "on")
}
if (localStorage.getItem("theme") == null) {
    localStorage.setItem("theme", "night-storm")
}

// Load settings
if (localStorage.getItem("bloom") == "on") {
    document.getElementById("bloom").style.display = "block"
    document.getElementById("body").classList.add("bloomColorCorrection")
} else {
    document.getElementById("bloom").style.display = "none"
    document.getElementById("body").classList.remove("bloomColorCorrection")
}

if (localStorage.getItem("crt") == "on") {
    document.getElementById("crt").style.display = "block"
} else {
    document.getElementById("crt").style.display = "none"
}

if (urlParams.has("app")) {
    let startup_app = urlParams.get("app")
    if (startup_app != "")  {
        createWindow(startup_app)
    }
} else if (localStorage.getItem("welcome") == "on") {
    createWindow("aboutme") // Create the initial window
}

//document.getElementById("theme").href = "apps/" + localStorage.getItem("theme") + "/desktop.css"

// API
window.addEventListener("message", (event) => {
    let data = JSON.parse(event.data)

    if (data["type"] == "open_app") {
        createWindow(data["id"])
    }

    if (data["type"] == "refresh") {
        location.reload()
    }

    if (data["type"] == "change_setting") {
        if (data["setting"] == "bloom") {
            if (data["status"] == "on") {
                document.getElementById("bloom").style.display = "block"
                document.getElementById("body").classList.add("bloomColorCorrection")
            } else if (data["status"] == "off") {
                document.getElementById("bloom").style.display = "none"
                document.getElementById("body").classList.remove("bloomColorCorrection")
            }
        }

        if (data["setting"] == "crt") {
            if (data["status"] == "on") {
                document.getElementById("crt").style.display = "block"
            } else if (data["status"] == "off") {
                document.getElementById("crt").style.display = "none"
            }
        }
        

        localStorage.setItem(data["setting"], data["status"]);
    }
});

function playSound(sound) {
    const audio = new Audio('assets/' + sound + '.mp3');
    audio.volume = 0.25;
    audio.play();
}
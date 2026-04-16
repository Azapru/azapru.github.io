document.getElementById("reset_value").innerText = localStorage.getItem("reset_value")

// Load
if (localStorage.getItem("bloom") == "on") {
    document.getElementById("checkbox-bloom").checked = true
} else {
    document.getElementById("checkbox-bloom").checked = false
}

if (localStorage.getItem("crt") == "on") {
    document.getElementById("checkbox-crt").checked = true
} else {
    document.getElementById("checkbox-crt").checked = false
}

if (localStorage.getItem("welcome") == "on") {
    document.getElementById("checkbox-welcome").checked = true
} else {
    document.getElementById("checkbox-welcome").checked = false
}

//document.getElementById("select-theme").value = localStorage.getItem("theme")

// Set
function bloomChanged() {
    let bloom = document.getElementById("checkbox-bloom").checked
    if (bloom) {
        change_setting("bloom", "on")
    } else {
        change_setting("bloom", "off")
    }
}

function crtChanged() {
    let crt = document.getElementById("checkbox-crt").checked
    if (crt) {
        change_setting("crt", "on")
    } else {
        change_setting("crt", "off")
    }
}

function welcomeChanged() {
    let welcome = document.getElementById("checkbox-welcome").checked
    if (welcome) {
        change_setting("welcome", "on")
    } else {
        change_setting("welcome", "off")
    }
}

function themeChanged() {
    let theme = document.getElementById("select-theme").value
    change_setting("theme", theme)
    refresh()
}

// Wallpapers

const wallpapersRoll = document.getElementById("wallpapers-roll")

const wallpapers = [
    "night_storm_background.jpg",
    "197924243923533824.jpg",
    "reminiscent_dystopia.jpg"
]

wallpapers.forEach(imgName => {
    const img = document.createElement("img")
    img.src = `../../wallpapers/${imgName}`
    img.classList.add("wallpaper-image")
    img.classList.add("pointer")
    img.onclick = () => {
        change_setting("wallpaper", imgName)
        refresh_wallpaper()

        document.querySelectorAll(".wallpaper-image").forEach((wallpaperItem, index) => {
            wallpaperItem.classList.remove("wallpaper-selected")
        })

        img.classList.add("wallpaper-selected")
    }

    if (imgName == localStorage.getItem("wallpaper")) {
        img.classList.add("wallpaper-selected")
    }

    wallpapersRoll.appendChild(img)
})
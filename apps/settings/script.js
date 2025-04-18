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

document.getElementById("select-theme").value = localStorage.getItem("theme")

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
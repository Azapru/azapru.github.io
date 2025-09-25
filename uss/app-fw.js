function msg_show(title, content, button) {
    document.getElementById("msg-title").innerText = title;
    document.getElementById("msg-content").innerText = content;
    document.getElementById("msg-button").innerText = button;
    
    const msg = document.getElementById("msg-frame");
    msg.style.display = "flex";
    msg.classList.add("fade-in");
}

function msg_close() {
    const msg = document.getElementById("msg-frame");
    msg.classList.remove("fade-in");
    msg.classList.add("fade-out");
    setTimeout(() => {
        document.getElementById("msg-frame").style.display = "none";
        msg.classList.remove("fade-out");
    }, 200)
}

var snackbarTimeout = null

function snackbar_show(text, button, timeout) {
    snackbar_hide()

    document.getElementById("snackbar-content").innerHTML = text;
    document.getElementById("snackbar-btn").innerHTML = button;

    document.getElementById("snackbar-frame").classList.remove("hideSnackbarAnim");
    document.getElementById("snackbar-frame").classList.add("showSnackbarAnim");

    snackbarTimeout = setTimeout(() => {
        snackbar_hide();
    }, timeout*1000);
}

function snackbar_hide() {
    document.getElementById("snackbar-frame").classList.remove("showSnackbarAnim");
    document.getElementById("snackbar-frame").classList.add("hideSnackbarAnim");
    clearTimeout(snackbarTimeout);
}
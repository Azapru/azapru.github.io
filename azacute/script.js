function openlink() {
    document.getElementById("warning-bg").style.display = "block"
    document.getElementById("warning").style.display = "flex"
}

function continueToLink() {
    window.open("https://x.com/nymphh001")
    document.getElementById("warning-bg").style.display = "none"
    document.getElementById("warning").style.display = "none"
}

function cancelLink() {
    document.getElementById("warning-bg").style.display = "none"
    document.getElementById("warning").style.display = "none"
}
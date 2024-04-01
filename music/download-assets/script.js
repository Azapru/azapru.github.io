let download = document.getElementById("download");
let followMessage = document.getElementById("followMessage");

function unlockDownload() {
    followMessage.style.display = "none";
    download.removeAttribute("disabled");
}
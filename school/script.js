const msgBox = document.getElementById("msgbox");
const msgFrame = document.getElementById("msgframe");
const msgText = document.getElementById("msgtext");
const blur = document.getElementById("blur");

function showMsgBox(text, width, height) {
    msgFrame.style.height = height+"px";
    msgFrame.style.width = width+"px";
    msgText.innerHTML = "<h1>" + text + "</h1>"
    msgBox.style.display = "flex";
    blur.style.filter = "blur(8px)";
}

function closeMsgBox() {
    msgBox.style.display = "none";
    blur.style.filter = "blur(0px)";
}
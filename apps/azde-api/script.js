function open_app(id) {
    window.parent.postMessage(`{"type": "open_app", "id": "${id}"}`, "*");
}

function refresh() {
    window.parent.postMessage(`{"type": "refresh"}`, "*");
}

function change_setting(setting, status) {
    window.parent.postMessage(`{"type": "change_setting", "setting": "${setting}", "status": "${status}"}`, "*");
}

function refresh_wallpaper() {
    window.parent.postMessage(`{"type": "refresh_wallpaper"}`, "*");
}

function send_notification(title, content, height, timeout) {
    window.parent.postMessage(`{"type": "send_notification", "title": "${title}", "content": "${content}", "height": "${height}", "timeout": "${timeout}"}`, "*");
}

//document.getElementById("theme").href = "../" + localStorage.getItem("theme") + "/apps.css";
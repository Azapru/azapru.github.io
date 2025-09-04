function open_app(id) {
    window.parent.postMessage(`{"type": "open_app", "id": "${id}"}`, "*");
}

function refresh() {
    window.parent.postMessage(`{"type": "refresh"}`, "*");
}

function change_setting(setting, status) {
    window.parent.postMessage(`{"type": "change_setting", "setting": "${setting}", "status": "${status}"}`, "*")
}

//document.getElementById("theme").href = "../" + localStorage.getItem("theme") + "/apps.css"
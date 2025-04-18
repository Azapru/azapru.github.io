function open_app(id) {
    window.parent.postMessage(`{"type": "open_app", "id": "${id}"}`, "*");
}

function change_setting(setting, status) {
    window.parent.postMessage(`{"type": "change_setting", "setting": "${setting}", "status": "${status}"}`, "*")
}
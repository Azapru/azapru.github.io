function open_app(id) {
    window.parent.postMessage(`{"type": "open_app", "id": "${id}"}`, "*");
}
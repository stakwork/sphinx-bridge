"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEventer = exports.addEventer = exports.postMessage = void 0;
function postMessage(data) {
    var win = window;
    if (win.sendToElectron) { // electron
        return win.sendToElectron('sphinx-bridge', data);
    }
    // browser iframe
    win.parent.postMessage(data, '*');
}
exports.postMessage = postMessage;
function addEventer(func) {
    var win = window;
    if (win.sendToElectron) {
        if (win.EE)
            win.EE.once('sphinx-bridge', func);
        return;
    }
    win.addEventListener('message', func);
}
exports.addEventer = addEventer;
function removeEventer(func) {
    var win = window;
    if (win.sendToElectron) {
        return; // no need because EE.once
    }
    win.removeEventListener('message', func);
}
exports.removeEventer = removeEventer;

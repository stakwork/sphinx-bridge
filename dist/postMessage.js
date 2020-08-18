"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEventer = exports.addEventer = exports.postMessage = void 0;
function postMessage(data) {
    var win = window;
    if (win.sendToElectron) { // electron
        return win.sendToElectron('sphinx-bridge', data);
    }
    if (win.ReactNativeWebView && win.ReactNativeWebView.postMessage) {
        win.ReactNativeWebView.postMessage(JSON.stringify(data));
    }
    if (win.webkit && win.webkit.messageHandlers && win.webkit.messageHandlers.sphinx && win.webkit.messageHandlers.sphinx) {
        win.webkit.messageHandlers.sphinx.postMessage(data);
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
    if (win.ReactNativeWebView && win.ReactNativeWebView.postMessage) { // android ReactNativeWebview
        document.addEventListener('message', function (e) {
            var final = {};
            try {
                final = JSON.parse(e.data);
            }
            catch (e) { }
            func({ data: final });
        });
    }
    if (win.webkit && win.webkit.messageHandlers && win.webkit.messageHandlers.sphinx && win.webkit.messageHandlers.sphinx) {
        win.sphinxMessage = function (e) {
            var final = {};
            try {
                final = JSON.parse(e);
            }
            catch (e) { }
            func({ data: final });
        };
    }
    win.addEventListener('message', func);
}
exports.addEventer = addEventer;
function removeEventer(func) {
    var win = window;
    if (win.sendToElectron) {
        return; // no need because EE.once
    }
    if (win.ReactNativeWebView && win.ReactNativeWebView.postMessage) { // android ReactNativeWebview
        document.removeEventListener('message', func);
    }
    if (win.webkit && win.webkit.messageHandlers && win.webkit.messageHandlers.sphinx && win.webkit.messageHandlers.sphinx) {
        win.sphinxMessage = null;
    }
    win.removeEventListener('message', func);
}
exports.removeEventer = removeEventer;

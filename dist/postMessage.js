"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEventer = exports.addEventer = exports.postMessage = void 0;
function postMessage(data) {
    var win = window;
    if (win.sendToElectron) { // electron
        return win.sendToElectron('sphinx-bridge', data);
    }
    else if (win.ReactNativeWebView && win.ReactNativeWebView.postMessage) {
        win.ReactNativeWebView.postMessage(JSON.stringify(data));
    }
    else if (win.webkit && win.webkit.messageHandlers && win.webkit.messageHandlers.sphinx && win.webkit.messageHandlers.sphinx) {
        win.webkit.messageHandlers.sphinx.postMessage(data);
    }
    else {
        win.parent.postMessage(data, '*'); // browser iframe
    }
}
exports.postMessage = postMessage;
function addEventer(func) {
    var win = window;
    if (win.sendToElectron) {
        if (win.EE)
            win.EE.once('sphinx-bridge', func);
        return;
    }
    else if (win.ReactNativeWebView && win.ReactNativeWebView.postMessage) { // android ReactNativeWebview
        document.addEventListener('message', function (e) {
            var final = {};
            try {
                final = JSON.parse(e.data);
            }
            catch (e) { }
            func({ data: final });
        });
    }
    else if (win.webkit && win.webkit.messageHandlers && win.webkit.messageHandlers.sphinx && win.webkit.messageHandlers.sphinx) {
        win.sphinxMessage = function (e) {
            var final = {};
            try {
                final = JSON.parse(e);
            }
            catch (e) { }
            func({ data: final });
        };
    }
    else {
        win.addEventListener('message', func);
    }
}
exports.addEventer = addEventer;
function removeEventer(func) {
    var win = window;
    if (win.sendToElectron) {
        return; // no need because EE.once
    }
    else if (win.ReactNativeWebView && win.ReactNativeWebView.postMessage) { // android ReactNativeWebview
        document.removeEventListener('message', func);
    }
    else if (win.webkit && win.webkit.messageHandlers && win.webkit.messageHandlers.sphinx && win.webkit.messageHandlers.sphinx) {
        win.sphinxMessage = null;
    }
    else {
        win.removeEventListener('message', func);
    }
}
exports.removeEventer = removeEventer;

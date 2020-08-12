"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestProvider = void 0;
function requestProvider() {
    return new Promise(function (resolve, reject) {
        if (typeof window === 'undefined') {
            return reject(new Error('Must be called in a browser context'));
        }
        var sphinx = window.sphinx;
        if (!sphinx) {
            return reject(new Error('Your browser has no Sphinx provider'));
        }
        sphinx.enable().then(function () { return resolve(sphinx); });
    });
}
exports.requestProvider = requestProvider;

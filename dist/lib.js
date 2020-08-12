"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSG_TYPE = void 0;
var MSG_TYPE;
(function (MSG_TYPE) {
    MSG_TYPE["AUTHORIZE"] = "AUTHORIZE";
    MSG_TYPE["INFO"] = "INFO";
    MSG_TYPE["KEYSEND"] = "KEYSEND";
    MSG_TYPE["UPDATED"] = "UPDATED";
    MSG_TYPE["PAYMENT"] = "PAYMENT";
    MSG_TYPE["INVOICE"] = "INVOICE";
    MSG_TYPE["SIGN"] = "SIGN";
    MSG_TYPE["VERIFY"] = "VERIFY";
})(MSG_TYPE = exports.MSG_TYPE || (exports.MSG_TYPE = {}));
var APP_NAME = 'Sphinx';
var Sphinx = /** @class */ (function () {
    function Sphinx() {
        this.isEnabled = false;
        this.active = null;
        this.budget = 0;
        this.pubkey = '';
    }
    Sphinx.prototype.enable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isEnabled) {
                            return [2 /*return*/, {
                                    budget: this.budget,
                                    pubkey: this.pubkey,
                                    application: APP_NAME
                                }];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.postMsg(MSG_TYPE.AUTHORIZE)];
                    case 2:
                        r = _a.sent();
                        if (r.budget && r.pubkey) {
                            this.isEnabled = true;
                            this.budget = r.budget;
                            this.pubkey = r.pubkey;
                            return [2 /*return*/, r];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, null];
                }
            });
        });
    };
    Sphinx.prototype.keysend = function (dest, amt) {
        return __awaiter(this, void 0, void 0, function () {
            var args, r, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isEnabled)
                            return [2 /*return*/, null];
                        if (!dest || !amt)
                            return [2 /*return*/, null];
                        if (dest.length !== 66)
                            return [2 /*return*/, null];
                        if (amt < 1)
                            return [2 /*return*/, null];
                        if (amt > this.budget)
                            return [2 /*return*/, null];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        args = { dest: dest, amt: amt };
                        return [4 /*yield*/, this.postMsg(MSG_TYPE.KEYSEND, args)];
                    case 2:
                        r = _a.sent();
                        if (r && r.success) {
                            this.budget = this.budget - amt;
                            r.budget = this.budget;
                        }
                        return [2 /*return*/, r];
                    case 3:
                        e_2 = _a.sent();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Sphinx.prototype.updated = function () {
        return __awaiter(this, void 0, void 0, function () {
            var r, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isEnabled)
                            return [2 /*return*/, null];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.postMsg(MSG_TYPE.UPDATED)];
                    case 2:
                        r = _a.sent();
                        return [2 /*return*/, r];
                    case 3:
                        e_3 = _a.sent();
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Internal prompt handler
    Sphinx.prototype.postMsg = function (type, args) {
        var self = this;
        if (self.active) {
            Promise.reject(new Error('User is busy'));
        }
        self.active = type;
        return new Promise(function (resolve, reject) {
            window.parent.postMessage(__assign({ application: APP_NAME, type: type }, (args || {})), '*');
            function handleWindowMessage(ev) {
                if (!ev.data || ev.data.application !== APP_NAME) {
                    return;
                }
                if (ev.data.error) {
                    self.active = null;
                    reject(ev.data.error);
                }
                else {
                    self.active = null;
                    resolve(ev.data);
                }
                window.removeEventListener('message', handleWindowMessage);
            }
            window.addEventListener('message', handleWindowMessage);
        });
    };
    return Sphinx;
}());
exports.default = Sphinx;

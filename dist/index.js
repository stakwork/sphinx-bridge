"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("./lib");
var lib_webln_1 = require("./lib_webln");
var sphinx = new lib_1.default();
var webLn = new lib_webln_1.default();
module.exports = { sphinx: sphinx, webLn: webLn };

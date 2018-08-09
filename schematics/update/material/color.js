"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const colorFns = {
    'b': chalk_1.bold,
    'g': chalk_1.green,
    'r': chalk_1.red,
};
function color(message) {
    // 'r{{text}}' with red 'text', 'g{{text}}' with green 'text', and 'b{{text}}' with bold 'text'.
    return message.replace(/(.){{(.*?)}}/g, (_m, fnName, text) => {
        const fn = colorFns[fnName];
        return fn ? fn(text) : text;
    });
}
exports.color = color;
//# sourceMappingURL=color.js.map
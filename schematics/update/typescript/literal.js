"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Returns the text of a string literal without the quotes. */
function getLiteralTextWithoutQuotes(literal) {
    return literal.getText().substring(1, literal.getText().length - 1);
}
exports.getLiteralTextWithoutQuotes = getLiteralTextWithoutQuotes;
/** Method that can be used to replace all search occurrences in a string. */
function findAll(str, search) {
    const result = [];
    let i = -1;
    while ((i = str.indexOf(search, i + 1)) !== -1) {
        result.push(i);
    }
    return result;
}
exports.findAll = findAll;
//# sourceMappingURL=literal.js.map
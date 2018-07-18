"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
/** Returns the original symbol from an node. */
function getOriginalSymbolFromNode(node, checker) {
    const baseSymbol = checker.getSymbolAtLocation(node);
    // tslint:disable-next-line:no-bitwise
    if (baseSymbol && baseSymbol.flags & ts.SymbolFlags.Alias) {
        return checker.getAliasedSymbol(baseSymbol);
    }
    return baseSymbol;
}
exports.getOriginalSymbolFromNode = getOriginalSymbolFromNode;
//# sourceMappingURL=identifiers.js.map
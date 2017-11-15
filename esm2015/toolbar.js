/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { isDevMode } from '@angular/core';
import { mixinColor } from '@angular/material/core';
import '@angular/cdk/platform';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * \@docs-private
 */
class MatToolbarBase {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
}
const _MatToolbarMixinBase = mixinColor(MatToolbarBase);
class MatToolbarRow {
}
class MatToolbar extends _MatToolbarMixinBase {
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _platform
     */
    constructor(renderer, elementRef, _platform) {
        super(renderer, elementRef);
        this._platform = _platform;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (!isDevMode() || !this._platform.isBrowser) {
            return;
        }
        this._checkToolbarMixedModes();
        this._toolbarRows.changes.subscribe(() => this._checkToolbarMixedModes());
    }
    /**
     * Throws an exception when developers are attempting to combine the different toolbar row modes.
     * @return {?}
     */
    _checkToolbarMixedModes() {
        if (!this._toolbarRows.length) {
            return;
        }
        // Check if there are any other DOM nodes that can display content but aren't inside of
        // a <mat-toolbar-row> element.
        const /** @type {?} */ isCombinedUsage = [].slice.call(this._elementRef.nativeElement.childNodes)
            .filter(node => !(node.classList && node.classList.contains('mat-toolbar-row')))
            .filter(node => node.nodeType !== Node.COMMENT_NODE)
            .some(node => node.textContent.trim());
        if (isCombinedUsage) {
            throwToolbarMixedModesError();
        }
    }
}
/**
 * Throws an exception when attempting to combine the different toolbar row modes.
 * \@docs-private
 * @return {?}
 */
function throwToolbarMixedModesError() {
    throw Error('MatToolbar: Attempting to combine different toolbar modes. ' +
        'Either specify multiple `<mat-toolbar-row>` elements explicitly or just place content ' +
        'inside of a `<mat-toolbar>` for a single row.');
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatToolbarModule {
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatToolbarModule, MatToolbarBase, _MatToolbarMixinBase, MatToolbarRow, MatToolbar, throwToolbarMixedModesError };
//# sourceMappingURL=toolbar.js.map

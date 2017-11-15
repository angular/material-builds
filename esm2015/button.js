/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '@angular/core';
import '@angular/common';
import { mixinColor, mixinDisableRipple, mixinDisabled } from '@angular/material/core';
import '@angular/cdk/a11y';
import '@angular/cdk/platform';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * Default color palette for round buttons (mat-fab and mat-mini-fab)
 */
const DEFAULT_ROUND_BUTTON_COLOR = 'accent';
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MatButtonCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MatRaisedButtonCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MatIconButtonCssMatStyler {
}
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * \@docs-private
 */
class MatFab {
    /**
     * @param {?} button
     * @param {?} anchor
     */
    constructor(button, anchor) {
        // Set the default color palette for the mat-fab components.
        (button || anchor).color = DEFAULT_ROUND_BUTTON_COLOR;
    }
}
/**
 * Directive that targets mini-fab buttons and anchors. It's used to apply the `mat-` class
 * to all mini-fab buttons and also is responsible for setting the default color palette.
 * \@docs-private
 */
class MatMiniFab {
    /**
     * @param {?} button
     * @param {?} anchor
     */
    constructor(button, anchor) {
        // Set the default color palette for the mat-mini-fab components.
        (button || anchor).color = DEFAULT_ROUND_BUTTON_COLOR;
    }
}
/**
 * \@docs-private
 */
class MatButtonBase {
    /**
     * @param {?} _renderer
     * @param {?} _elementRef
     */
    constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
}
const _MatButtonMixinBase = mixinColor(mixinDisabled(mixinDisableRipple(MatButtonBase)));
/**
 * Material design button.
 */
class MatButton extends _MatButtonMixinBase {
    /**
     * @param {?} renderer
     * @param {?} elementRef
     * @param {?} _platform
     * @param {?} _focusMonitor
     */
    constructor(renderer, elementRef, _platform, _focusMonitor) {
        super(renderer, elementRef);
        this._platform = _platform;
        this._focusMonitor = _focusMonitor;
        this._focusMonitor.monitor(this._elementRef.nativeElement, true);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this._elementRef.nativeElement);
    }
    /**
     * Focuses the button.
     * @return {?}
     */
    focus() {
        this._getHostElement().focus();
    }
    /**
     * @return {?}
     */
    _getHostElement() {
        return this._elementRef.nativeElement;
    }
    /**
     * @return {?}
     */
    _isRippleDisabled() {
        return this.disableRipple || this.disabled;
    }
    /**
     * Gets whether the button has one of the given attributes.
     * @param {...?} attributes
     * @return {?}
     */
    _hasHostAttributes(...attributes) {
        // If not on the browser, say that there are none of the attributes present.
        // Since these only affect how the ripple displays (and ripples only happen on the client),
        // detecting these attributes isn't necessary when not on the browser.
        if (!this._platform.isBrowser) {
            return false;
        }
        return attributes.some(attribute => this._getHostElement().hasAttribute(attribute));
    }
}
/**
 * Raised Material design button.
 */
class MatAnchor extends MatButton {
    /**
     * @param {?} platform
     * @param {?} focusMonitor
     * @param {?} elementRef
     * @param {?} renderer
     */
    constructor(platform, focusMonitor, elementRef, renderer) {
        super(renderer, elementRef, platform, focusMonitor);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _haltDisabledEvents(event) {
        // A disabled button shouldn't apply any actions
        if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatButtonModule {
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

export { MatButtonModule, MatButtonCssMatStyler, MatRaisedButtonCssMatStyler, MatIconButtonCssMatStyler, MatFab, MatMiniFab, MatButtonBase, _MatButtonMixinBase, MatButton, MatAnchor };
//# sourceMappingURL=button.js.map

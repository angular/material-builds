/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, Inject, Input, NgModule, NgZone, Optional } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { A11yModule, AriaDescriber } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

let nextId = 0;
/**
 * Directive to display a text badge.
 */
class MatBadge {
    /**
     * @param {?} _document
     * @param {?} _ngZone
     * @param {?} _elementRef
     * @param {?} _ariaDescriber
     */
    constructor(_document, _ngZone, _elementRef, _ariaDescriber) {
        this._document = _document;
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._ariaDescriber = _ariaDescriber;
        this._color = 'primary';
        this._overlap = true;
        /**
         * Position the badge should reside.
         * Accepts any combination of 'above'|'below' and 'before'|'after'
         */
        this.position = 'above after';
        /**
         * Size of the badge. Can be 'small', 'medium', or 'large'.
         */
        this.size = 'medium';
        /**
         * Unique id for the badge
         */
        this._id = nextId++;
    }
    /**
     * The color of the badge. Can be `primary`, `accent`, or `warn`.
     * @return {?}
     */
    get color() { return this._color; }
    /**
     * @param {?} value
     * @return {?}
     */
    set color(value) {
        this._setColor(value);
        this._color = value;
    }
    /**
     * Whether the badge should overlap its contents or not
     * @return {?}
     */
    get overlap() { return this._overlap; }
    /**
     * @param {?} val
     * @return {?}
     */
    set overlap(val) {
        this._overlap = coerceBooleanProperty(val);
    }
    /**
     * The content for the badge
     * @return {?}
     */
    get content() { return this._content; }
    /**
     * @param {?} val
     * @return {?}
     */
    set content(val) {
        this._content = val;
        this._updateTextContent();
    }
    /**
     * Message used to describe the decorated element via aria-describedby
     * @return {?}
     */
    get description() { return this._description; }
    /**
     * @param {?} val
     * @return {?}
     */
    set description(val) {
        if (this._description) {
            this._updateHostAriaDescription(val, this._description);
        }
        this._description = val;
    }
    /**
     * Whether the badge is hidden.
     * @return {?}
     */
    get hidden() { return this._hidden; }
    /**
     * @param {?} val
     * @return {?}
     */
    set hidden(val) {
        this._hidden = coerceBooleanProperty(val);
    }
    /**
     * Whether the badge is above the host or not
     * @return {?}
     */
    isAbove() {
        return this.position.indexOf('below') === -1;
    }
    /**
     * Whether the badge is after the host or not
     * @return {?}
     */
    isAfter() {
        return this.position.indexOf('before') === -1;
    }
    /**
     * Injects a span element into the DOM with the content.
     * @return {?}
     */
    _updateTextContent() {
        if (!this._badgeElement) {
            this._badgeElement = this._createBadgeElement();
        }
        else {
            this._badgeElement.textContent = this.content;
        }
        return this._badgeElement;
    }
    /**
     * Creates the badge element
     * @return {?}
     */
    _createBadgeElement() {
        const /** @type {?} */ badgeElement = this._document.createElement('span');
        badgeElement.setAttribute('id', `mat-badge-content-${this._id}`);
        badgeElement.classList.add('mat-badge-content');
        badgeElement.textContent = this.content;
        if (this.description) {
            badgeElement.setAttribute('aria-label', this.description);
        }
        this._elementRef.nativeElement.appendChild(badgeElement);
        // animate in after insertion
        this._ngZone.runOutsideAngular(() => requestAnimationFrame(() => {
            // ensure content available
            if (badgeElement) {
                badgeElement.classList.add('mat-badge-active');
            }
        }));
        return badgeElement;
    }
    /**
     * Sets the aria-label property on the element
     * @param {?} val
     * @param {?} prevVal
     * @return {?}
     */
    _updateHostAriaDescription(val, prevVal) {
        // ensure content available before setting label
        const /** @type {?} */ content = this._updateTextContent();
        this._ariaDescriber.removeDescription(content, prevVal);
        this._ariaDescriber.describe(content, val);
    }
    /**
     * Adds css theme class given the color to the component host
     * @param {?} colorPalette
     * @return {?}
     */
    _setColor(colorPalette) {
        if (colorPalette !== this._color) {
            if (this._color) {
                this._elementRef.nativeElement.classList.remove(`mat-badge-${this._color}`);
            }
            if (colorPalette) {
                this._elementRef.nativeElement.classList.add(`mat-badge-${colorPalette}`);
            }
        }
    }
}
MatBadge.decorators = [
    { type: Directive, args: [{
                selector: '[matBadge]',
                host: {
                    'class': 'mat-badge',
                    '[class.mat-badge-overlap]': '_overlap',
                    '[class.mat-badge-above]': 'isAbove()',
                    '[class.mat-badge-below]': '!isAbove()',
                    '[class.mat-badge-before]': '!isAfter()',
                    '[class.mat-badge-after]': 'isAfter()',
                    '[class.mat-badge-small]': 'size === "small"',
                    '[class.mat-badge-medium]': 'size === "medium"',
                    '[class.mat-badge-large]': 'size === "large"',
                    '[class.mat-badge-hidden]': 'hidden',
                },
            },] },
];
/** @nocollapse */
MatBadge.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] },] },
    { type: NgZone, },
    { type: ElementRef, },
    { type: AriaDescriber, },
];
MatBadge.propDecorators = {
    "color": [{ type: Input, args: ['matBadgeColor',] },],
    "overlap": [{ type: Input, args: ['matBadgeOverlap',] },],
    "position": [{ type: Input, args: ['matBadgePosition',] },],
    "content": [{ type: Input, args: ['matBadge',] },],
    "description": [{ type: Input, args: ['matBadgeDescription',] },],
    "size": [{ type: Input, args: ['matBadgeSize',] },],
    "hidden": [{ type: Input, args: ['matBadgeHidden',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

class MatBadgeModule {
}
MatBadgeModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    MatCommonModule,
                    A11yModule,
                ],
                exports: [
                    MatBadge,
                ],
                declarations: [
                    MatBadge,
                ],
            },] },
];
/** @nocollapse */
MatBadgeModule.ctorParameters = () => [];

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

export { MatBadgeModule, MatBadge };
//# sourceMappingURL=badge.js.map

/**
 * @fileoverview added by tsickle
 * Generated from: src/material/badge/badge.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AriaDescriber } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, Inject, Input, NgZone, Optional, Renderer2, isDevMode, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
/** @type {?} */
let nextId = 0;
// Boilerplate for applying mixins to MatBadge.
/**
 * \@docs-private
 */
class MatBadgeBase {
}
/** @type {?} */
const _MatBadgeMixinBase = mixinDisabled(MatBadgeBase);
/**
 * Directive to display a text badge.
 */
export class MatBadge extends _MatBadgeMixinBase {
    /**
     * @param {?} _ngZone
     * @param {?} _elementRef
     * @param {?} _ariaDescriber
     * @param {?} _renderer
     * @param {?=} _animationMode
     */
    constructor(_ngZone, _elementRef, _ariaDescriber, _renderer, _animationMode) {
        super();
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._ariaDescriber = _ariaDescriber;
        this._renderer = _renderer;
        this._animationMode = _animationMode;
        /**
         * Whether the badge has any content.
         */
        this._hasContent = false;
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
        if (isDevMode()) {
            /** @type {?} */
            const nativeElement = _elementRef.nativeElement;
            if (nativeElement.nodeType !== nativeElement.ELEMENT_NODE) {
                throw Error('matBadge must be attached to an element node.');
            }
        }
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
     * Message used to describe the decorated element via aria-describedby
     * @return {?}
     */
    get description() { return this._description; }
    /**
     * @param {?} newDescription
     * @return {?}
     */
    set description(newDescription) {
        if (newDescription !== this._description) {
            /** @type {?} */
            const badgeElement = this._badgeElement;
            this._updateHostAriaDescription(newDescription, this._description);
            this._description = newDescription;
            if (badgeElement) {
                newDescription ? badgeElement.setAttribute('aria-label', newDescription) :
                    badgeElement.removeAttribute('aria-label');
            }
        }
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
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const contentChange = changes['content'];
        if (contentChange) {
            /** @type {?} */
            const value = contentChange.currentValue;
            this._hasContent = value != null && `${value}`.trim().length > 0;
            this._updateTextContent();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        /** @type {?} */
        const badgeElement = this._badgeElement;
        if (badgeElement) {
            if (this.description) {
                this._ariaDescriber.removeDescription(badgeElement, this.description);
            }
            // When creating a badge through the Renderer, Angular will keep it in an index.
            // We have to destroy it ourselves, otherwise it'll be retained in memory.
            if (this._renderer.destroyNode) {
                this._renderer.destroyNode(badgeElement);
            }
        }
    }
    /**
     * Gets the element into which the badge's content is being rendered.
     * Undefined if the element hasn't been created (e.g. if the badge doesn't have content).
     * @return {?}
     */
    getBadgeElement() {
        return this._badgeElement;
    }
    /**
     * Injects a span element into the DOM with the content.
     * @private
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
     * @private
     * @return {?}
     */
    _createBadgeElement() {
        /** @type {?} */
        const badgeElement = this._renderer.createElement('span');
        /** @type {?} */
        const activeClass = 'mat-badge-active';
        /** @type {?} */
        const contentClass = 'mat-badge-content';
        // Clear any existing badges which may have persisted from a server-side render.
        this._clearExistingBadges(contentClass);
        badgeElement.setAttribute('id', `mat-badge-content-${this._id}`);
        badgeElement.classList.add(contentClass);
        badgeElement.textContent = this.content;
        if (this._animationMode === 'NoopAnimations') {
            badgeElement.classList.add('_mat-animation-noopable');
        }
        if (this.description) {
            badgeElement.setAttribute('aria-label', this.description);
        }
        this._elementRef.nativeElement.appendChild(badgeElement);
        // animate in after insertion
        if (typeof requestAnimationFrame === 'function' && this._animationMode !== 'NoopAnimations') {
            this._ngZone.runOutsideAngular((/**
             * @return {?}
             */
            () => {
                requestAnimationFrame((/**
                 * @return {?}
                 */
                () => {
                    badgeElement.classList.add(activeClass);
                }));
            }));
        }
        else {
            badgeElement.classList.add(activeClass);
        }
        return badgeElement;
    }
    /**
     * Sets the aria-label property on the element
     * @private
     * @param {?} newDescription
     * @param {?} oldDescription
     * @return {?}
     */
    _updateHostAriaDescription(newDescription, oldDescription) {
        // ensure content available before setting label
        /** @type {?} */
        const content = this._updateTextContent();
        if (oldDescription) {
            this._ariaDescriber.removeDescription(content, oldDescription);
        }
        if (newDescription) {
            this._ariaDescriber.describe(content, newDescription);
        }
    }
    /**
     * Adds css theme class given the color to the component host
     * @private
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
    /**
     * Clears any existing badges that might be left over from server-side rendering.
     * @private
     * @param {?} cssClass
     * @return {?}
     */
    _clearExistingBadges(cssClass) {
        /** @type {?} */
        const element = this._elementRef.nativeElement;
        /** @type {?} */
        let childCount = element.children.length;
        // Use a reverse while, because we'll be removing elements from the list as we're iterating.
        while (childCount--) {
            /** @type {?} */
            const currentChild = element.children[childCount];
            if (currentChild.classList.contains(cssClass)) {
                element.removeChild(currentChild);
            }
        }
    }
}
MatBadge.decorators = [
    { type: Directive, args: [{
                selector: '[matBadge]',
                inputs: ['disabled: matBadgeDisabled'],
                host: {
                    'class': 'mat-badge',
                    '[class.mat-badge-overlap]': 'overlap',
                    '[class.mat-badge-above]': 'isAbove()',
                    '[class.mat-badge-below]': '!isAbove()',
                    '[class.mat-badge-before]': '!isAfter()',
                    '[class.mat-badge-after]': 'isAfter()',
                    '[class.mat-badge-small]': 'size === "small"',
                    '[class.mat-badge-medium]': 'size === "medium"',
                    '[class.mat-badge-large]': 'size === "large"',
                    '[class.mat-badge-hidden]': 'hidden || !_hasContent',
                    '[class.mat-badge-disabled]': 'disabled',
                },
            },] }
];
/** @nocollapse */
MatBadge.ctorParameters = () => [
    { type: NgZone },
    { type: ElementRef },
    { type: AriaDescriber },
    { type: Renderer2 },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
MatBadge.propDecorators = {
    color: [{ type: Input, args: ['matBadgeColor',] }],
    overlap: [{ type: Input, args: ['matBadgeOverlap',] }],
    position: [{ type: Input, args: ['matBadgePosition',] }],
    content: [{ type: Input, args: ['matBadge',] }],
    description: [{ type: Input, args: ['matBadgeDescription',] }],
    size: [{ type: Input, args: ['matBadgeSize',] }],
    hidden: [{ type: Input, args: ['matBadgeHidden',] }]
};
if (false) {
    /** @type {?} */
    MatBadge.ngAcceptInputType_disabled;
    /** @type {?} */
    MatBadge.ngAcceptInputType_hidden;
    /** @type {?} */
    MatBadge.ngAcceptInputType_overlap;
    /**
     * Whether the badge has any content.
     * @type {?}
     */
    MatBadge.prototype._hasContent;
    /**
     * @type {?}
     * @private
     */
    MatBadge.prototype._color;
    /**
     * @type {?}
     * @private
     */
    MatBadge.prototype._overlap;
    /**
     * Position the badge should reside.
     * Accepts any combination of 'above'|'below' and 'before'|'after'
     * @type {?}
     */
    MatBadge.prototype.position;
    /**
     * The content for the badge
     * @type {?}
     */
    MatBadge.prototype.content;
    /**
     * @type {?}
     * @private
     */
    MatBadge.prototype._description;
    /**
     * Size of the badge. Can be 'small', 'medium', or 'large'.
     * @type {?}
     */
    MatBadge.prototype.size;
    /**
     * @type {?}
     * @private
     */
    MatBadge.prototype._hidden;
    /**
     * Unique id for the badge
     * @type {?}
     */
    MatBadge.prototype._id;
    /**
     * @type {?}
     * @private
     */
    MatBadge.prototype._badgeElement;
    /**
     * @type {?}
     * @private
     */
    MatBadge.prototype._ngZone;
    /**
     * @type {?}
     * @private
     */
    MatBadge.prototype._elementRef;
    /**
     * @type {?}
     * @private
     */
    MatBadge.prototype._ariaDescriber;
    /**
     * @type {?}
     * @private
     */
    MatBadge.prototype._renderer;
    /**
     * @type {?}
     * @private
     */
    MatBadge.prototype._animationMode;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYmFkZ2UvYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsRUFDUixTQUFTLEVBRVQsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBNkIsYUFBYSxFQUFlLE1BQU0sd0JBQXdCLENBQUM7QUFDL0YsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7O0lBR3ZFLE1BQU0sR0FBRyxDQUFDOzs7OztBQUlkLE1BQU0sWUFBWTtDQUFHOztNQUVmLGtCQUFrQixHQUNtQixhQUFhLENBQUMsWUFBWSxDQUFDOzs7O0FBNEJ0RSxNQUFNLE9BQU8sUUFBUyxTQUFRLGtCQUFrQjs7Ozs7Ozs7SUErRDlDLFlBQ1ksT0FBZSxFQUNmLFdBQW9DLEVBQ3BDLGNBQTZCLEVBQzdCLFNBQW9CLEVBQ3VCLGNBQXVCO1FBQzFFLEtBQUssRUFBRSxDQUFDO1FBTEEsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUNwQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUM3QixjQUFTLEdBQVQsU0FBUyxDQUFXO1FBQ3VCLG1CQUFjLEdBQWQsY0FBYyxDQUFTOzs7O1FBbEU5RSxnQkFBVyxHQUFHLEtBQUssQ0FBQztRQVNaLFdBQU0sR0FBaUIsU0FBUyxDQUFDO1FBUWpDLGFBQVEsR0FBWSxJQUFJLENBQUM7Ozs7O1FBTU4sYUFBUSxHQUFxQixhQUFhLENBQUM7Ozs7UUF1Qi9DLFNB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QS9ENUMsS0FBSyxTQUFDLGVBQWU7c0JBU3JCLEtBQUssU0FBQyxpQkFBaUI7dUJBV3ZCLEtBQUssU0FBQyxrQkFBa0I7c0JBR3hCLEtBQUssU0FBQyxVQUFVOzBCQUdoQixLQUFLLFNBQUMscUJBQXFCO21CQWlCM0IsS0FBSyxTQUFDLGNBQWM7cUJBR3BCLEtBQUssU0FBQyxnQkFBZ0I7Ozs7SUErSnZCLG9DQUFnRDs7SUFDaEQsa0NBQThDOztJQUM5QyxtQ0FBK0M7Ozs7O0lBbE4vQywrQkFBb0I7Ozs7O0lBU3BCLDBCQUF5Qzs7Ozs7SUFRekMsNEJBQWlDOzs7Ozs7SUFNakMsNEJBQXNFOzs7OztJQUd0RSwyQkFBbUM7Ozs7O0lBaUJuQyxnQ0FBNkI7Ozs7O0lBRzdCLHdCQUFxRDs7Ozs7SUFRckQsMkJBQXlCOzs7OztJQUd6Qix1QkFBdUI7Ozs7O0lBRXZCLGlDQUErQzs7Ozs7SUFHM0MsMkJBQXVCOzs7OztJQUN2QiwrQkFBNEM7Ozs7O0lBQzVDLGtDQUFxQzs7Ozs7SUFDckMsNkJBQTRCOzs7OztJQUM1QixrQ0FBMEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBcmlhRGVzY3JpYmVyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBpc0Rldk1vZGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvciwgbWl4aW5EaXNhYmxlZCwgVGhlbWVQYWxldHRlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbmxldCBuZXh0SWQgPSAwO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEJhZGdlLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdEJhZGdlQmFzZSB7fVxuXG5jb25zdCBfTWF0QmFkZ2VNaXhpbkJhc2U6XG4gICAgQ2FuRGlzYWJsZUN0b3IgJiB0eXBlb2YgTWF0QmFkZ2VCYXNlID0gbWl4aW5EaXNhYmxlZChNYXRCYWRnZUJhc2UpO1xuXG4vKiogQWxsb3dlZCBwb3NpdGlvbiBvcHRpb25zIGZvciBtYXRCYWRnZVBvc2l0aW9uICovXG5leHBvcnQgdHlwZSBNYXRCYWRnZVBvc2l0aW9uID1cbiAgICAnYWJvdmUgYWZ0ZXInIHwgJ2Fib3ZlIGJlZm9yZScgfCAnYmVsb3cgYmVmb3JlJyB8ICdiZWxvdyBhZnRlcicgfFxuICAgICdiZWZvcmUnIHwgJ2FmdGVyJyB8ICdhYm92ZScgfCAnYmVsb3cnO1xuXG4vKiogQWxsb3dlZCBzaXplIG9wdGlvbnMgZm9yIG1hdEJhZGdlU2l6ZSAqL1xuZXhwb3J0IHR5cGUgTWF0QmFkZ2VTaXplID0gJ3NtYWxsJyB8ICdtZWRpdW0nIHwgJ2xhcmdlJztcblxuLyoqIERpcmVjdGl2ZSB0byBkaXNwbGF5IGEgdGV4dCBiYWRnZS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRCYWRnZV0nLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQ6IG1hdEJhZGdlRGlzYWJsZWQnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtYmFkZ2UnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLW92ZXJsYXBdJzogJ292ZXJsYXAnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWFib3ZlXSc6ICdpc0Fib3ZlKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWJlbG93XSc6ICchaXNBYm92ZSgpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1iZWZvcmVdJzogJyFpc0FmdGVyKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWFmdGVyXSc6ICdpc0FmdGVyKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLXNtYWxsXSc6ICdzaXplID09PSBcInNtYWxsXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLW1lZGl1bV0nOiAnc2l6ZSA9PT0gXCJtZWRpdW1cIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtbGFyZ2VdJzogJ3NpemUgPT09IFwibGFyZ2VcIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtaGlkZGVuXSc6ICdoaWRkZW4gfHwgIV9oYXNDb250ZW50JyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCYWRnZSBleHRlbmRzIF9NYXRCYWRnZU1peGluQmFzZSBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBDYW5EaXNhYmxlIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGhhcyBhbnkgY29udGVudC4gKi9cbiAgX2hhc0NvbnRlbnQgPSBmYWxzZTtcblxuICAvKiogVGhlIGNvbG9yIG9mIHRoZSBiYWRnZS4gQ2FuIGJlIGBwcmltYXJ5YCwgYGFjY2VudGAsIG9yIGB3YXJuYC4gKi9cbiAgQElucHV0KCdtYXRCYWRnZUNvbG9yJylcbiAgZ2V0IGNvbG9yKCk6IFRoZW1lUGFsZXR0ZSB7IHJldHVybiB0aGlzLl9jb2xvcjsgfVxuICBzZXQgY29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIHRoaXMuX3NldENvbG9yKHZhbHVlKTtcbiAgICB0aGlzLl9jb2xvciA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2NvbG9yOiBUaGVtZVBhbGV0dGUgPSAncHJpbWFyeSc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIHNob3VsZCBvdmVybGFwIGl0cyBjb250ZW50cyBvciBub3QgKi9cbiAgQElucHV0KCdtYXRCYWRnZU92ZXJsYXAnKVxuICBnZXQgb3ZlcmxhcCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX292ZXJsYXA7IH1cbiAgc2V0IG92ZXJsYXAodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fb3ZlcmxhcCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpO1xuICB9XG4gIHByaXZhdGUgX292ZXJsYXA6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiB0aGUgYmFkZ2Ugc2hvdWxkIHJlc2lkZS5cbiAgICogQWNjZXB0cyBhbnkgY29tYmluYXRpb24gb2YgJ2Fib3ZlJ3wnYmVsb3cnIGFuZCAnYmVmb3JlJ3wnYWZ0ZXInXG4gICAqL1xuICBASW5wdXQoJ21hdEJhZGdlUG9zaXRpb24nKSBwb3NpdGlvbjogTWF0QmFkZ2VQb3NpdGlvbiA9ICdhYm92ZSBhZnRlcic7XG5cbiAgLyoqIFRoZSBjb250ZW50IGZvciB0aGUgYmFkZ2UgKi9cbiAgQElucHV0KCdtYXRCYWRnZScpIGNvbnRlbnQ6IHN0cmluZztcblxuICAvKiogTWVzc2FnZSB1c2VkIHRvIGRlc2NyaWJlIHRoZSBkZWNvcmF0ZWQgZWxlbWVudCB2aWEgYXJpYS1kZXNjcmliZWRieSAqL1xuICBASW5wdXQoJ21hdEJhZGdlRGVzY3JpcHRpb24nKVxuICBnZXQgZGVzY3JpcHRpb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0aW9uOyB9XG4gIHNldCBkZXNjcmlwdGlvbihuZXdEZXNjcmlwdGlvbjogc3RyaW5nKSB7XG4gICAgaWYgKG5ld0Rlc2NyaXB0aW9uICE9PSB0aGlzLl9kZXNjcmlwdGlvbikge1xuICAgICAgY29uc3QgYmFkZ2VFbGVtZW50ID0gdGhpcy5fYmFkZ2VFbGVtZW50O1xuICAgICAgdGhpcy5fdXBkYXRlSG9zdEFyaWFEZXNjcmlwdGlvbihuZXdEZXNjcmlwdGlvbiwgdGhpcy5fZGVzY3JpcHRpb24pO1xuICAgICAgdGhpcy5fZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgICAgaWYgKGJhZGdlRWxlbWVudCkge1xuICAgICAgICBuZXdEZXNjcmlwdGlvbiA/IGJhZGdlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBuZXdEZXNjcmlwdGlvbikgOlxuICAgICAgICAgICAgYmFkZ2VFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBwcml2YXRlIF9kZXNjcmlwdGlvbjogc3RyaW5nO1xuXG4gIC8qKiBTaXplIG9mIHRoZSBiYWRnZS4gQ2FuIGJlICdzbWFsbCcsICdtZWRpdW0nLCBvciAnbGFyZ2UnLiAqL1xuICBASW5wdXQoJ21hdEJhZGdlU2l6ZScpIHNpemU6IE1hdEJhZGdlU2l6ZSA9ICdtZWRpdW0nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBpcyBoaWRkZW4uICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VIaWRkZW4nKVxuICBnZXQgaGlkZGVuKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faGlkZGVuOyB9XG4gIHNldCBoaWRkZW4odmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5faGlkZGVuID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbCk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZGVuOiBib29sZWFuO1xuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoZSBiYWRnZSAqL1xuICBfaWQ6IG51bWJlciA9IG5leHRJZCsrO1xuXG4gIHByaXZhdGUgX2JhZGdlRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgcHJpdmF0ZSBfYXJpYURlc2NyaWJlcjogQXJpYURlc2NyaWJlcixcbiAgICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgICAgc3VwZXIoKTtcblxuICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7XG4gICAgICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgICBpZiAobmF0aXZlRWxlbWVudC5ub2RlVHlwZSAhPT0gbmF0aXZlRWxlbWVudC5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcignbWF0QmFkZ2UgbXVzdCBiZSBhdHRhY2hlZCB0byBhbiBlbGVtZW50IG5vZGUuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGFib3ZlIHRoZSBob3N0IG9yIG5vdCAqL1xuICBpc0Fib3ZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmluZGV4T2YoJ2JlbG93JykgPT09IC0xO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGFmdGVyIHRoZSBob3N0IG9yIG5vdCAqL1xuICBpc0FmdGVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmluZGV4T2YoJ2JlZm9yZScpID09PSAtMTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBjb250ZW50Q2hhbmdlID0gY2hhbmdlc1snY29udGVudCddO1xuXG4gICAgaWYgKGNvbnRlbnRDaGFuZ2UpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udGVudENoYW5nZS5jdXJyZW50VmFsdWU7XG4gICAgICB0aGlzLl9oYXNDb250ZW50ID0gdmFsdWUgIT0gbnVsbCAmJiBgJHt2YWx1ZX1gLnRyaW0oKS5sZW5ndGggPiAwO1xuICAgICAgdGhpcy5fdXBkYXRlVGV4dENvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBiYWRnZUVsZW1lbnQgPSB0aGlzLl9iYWRnZUVsZW1lbnQ7XG5cbiAgICBpZiAoYmFkZ2VFbGVtZW50KSB7XG4gICAgICBpZiAodGhpcy5kZXNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLnJlbW92ZURlc2NyaXB0aW9uKGJhZGdlRWxlbWVudCwgdGhpcy5kZXNjcmlwdGlvbik7XG4gICAgICB9XG5cbiAgICAgIC8vIFdoZW4gY3JlYXRpbmcgYSBiYWRnZSB0aHJvdWdoIHRoZSBSZW5kZXJlciwgQW5ndWxhciB3aWxsIGtlZXAgaXQgaW4gYW4gaW5kZXguXG4gICAgICAvLyBXZSBoYXZlIHRvIGRlc3Ryb3kgaXQgb3Vyc2VsdmVzLCBvdGhlcndpc2UgaXQnbGwgYmUgcmV0YWluZWQgaW4gbWVtb3J5LlxuICAgICAgaWYgKHRoaXMuX3JlbmRlcmVyLmRlc3Ryb3lOb2RlKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLmRlc3Ryb3lOb2RlKGJhZGdlRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGVsZW1lbnQgaW50byB3aGljaCB0aGUgYmFkZ2UncyBjb250ZW50IGlzIGJlaW5nIHJlbmRlcmVkLlxuICAgKiBVbmRlZmluZWQgaWYgdGhlIGVsZW1lbnQgaGFzbid0IGJlZW4gY3JlYXRlZCAoZS5nLiBpZiB0aGUgYmFkZ2UgZG9lc24ndCBoYXZlIGNvbnRlbnQpLlxuICAgKi9cbiAgZ2V0QmFkZ2VFbGVtZW50KCk6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fYmFkZ2VFbGVtZW50O1xuICB9XG5cbiAgLyoqIEluamVjdHMgYSBzcGFuIGVsZW1lbnQgaW50byB0aGUgRE9NIHdpdGggdGhlIGNvbnRlbnQuICovXG4gIHByaXZhdGUgX3VwZGF0ZVRleHRDb250ZW50KCk6IEhUTUxTcGFuRWxlbWVudCB7XG4gICAgaWYgKCF0aGlzLl9iYWRnZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2JhZGdlRWxlbWVudCA9IHRoaXMuX2NyZWF0ZUJhZGdlRWxlbWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9iYWRnZUVsZW1lbnQudGV4dENvbnRlbnQgPSB0aGlzLmNvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9iYWRnZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogQ3JlYXRlcyB0aGUgYmFkZ2UgZWxlbWVudCAqL1xuICBwcml2YXRlIF9jcmVhdGVCYWRnZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGJhZGdlRWxlbWVudCA9IHRoaXMuX3JlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBhY3RpdmVDbGFzcyA9ICdtYXQtYmFkZ2UtYWN0aXZlJztcbiAgICBjb25zdCBjb250ZW50Q2xhc3MgPSAnbWF0LWJhZGdlLWNvbnRlbnQnO1xuXG4gICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIGJhZGdlcyB3aGljaCBtYXkgaGF2ZSBwZXJzaXN0ZWQgZnJvbSBhIHNlcnZlci1zaWRlIHJlbmRlci5cbiAgICB0aGlzLl9jbGVhckV4aXN0aW5nQmFkZ2VzKGNvbnRlbnRDbGFzcyk7XG4gICAgYmFkZ2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnaWQnLCBgbWF0LWJhZGdlLWNvbnRlbnQtJHt0aGlzLl9pZH1gKTtcbiAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChjb250ZW50Q2xhc3MpO1xuICAgIGJhZGdlRWxlbWVudC50ZXh0Q29udGVudCA9IHRoaXMuY29udGVudDtcblxuICAgIGlmICh0aGlzLl9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnX21hdC1hbmltYXRpb24tbm9vcGFibGUnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZXNjcmlwdGlvbikge1xuICAgICAgYmFkZ2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHRoaXMuZGVzY3JpcHRpb24pO1xuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZChiYWRnZUVsZW1lbnQpO1xuXG4gICAgLy8gYW5pbWF0ZSBpbiBhZnRlciBpbnNlcnRpb25cbiAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLl9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuICAgIH1cblxuICAgIHJldHVybiBiYWRnZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgYXJpYS1sYWJlbCBwcm9wZXJ0eSBvbiB0aGUgZWxlbWVudCAqL1xuICBwcml2YXRlIF91cGRhdGVIb3N0QXJpYURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcsIG9sZERlc2NyaXB0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBlbnN1cmUgY29udGVudCBhdmFpbGFibGUgYmVmb3JlIHNldHRpbmcgbGFiZWxcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5fdXBkYXRlVGV4dENvbnRlbnQoKTtcblxuICAgIGlmIChvbGREZXNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbihjb250ZW50LCBvbGREZXNjcmlwdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKG5ld0Rlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLmRlc2NyaWJlKGNvbnRlbnQsIG5ld0Rlc2NyaXB0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvKiogQWRkcyBjc3MgdGhlbWUgY2xhc3MgZ2l2ZW4gdGhlIGNvbG9yIHRvIHRoZSBjb21wb25lbnQgaG9zdCAqL1xuICBwcml2YXRlIF9zZXRDb2xvcihjb2xvclBhbGV0dGU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIGlmIChjb2xvclBhbGV0dGUgIT09IHRoaXMuX2NvbG9yKSB7XG4gICAgICBpZiAodGhpcy5fY29sb3IpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYG1hdC1iYWRnZS0ke3RoaXMuX2NvbG9yfWApO1xuICAgICAgfVxuICAgICAgaWYgKGNvbG9yUGFsZXR0ZSkge1xuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbWF0LWJhZGdlLSR7Y29sb3JQYWxldHRlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBDbGVhcnMgYW55IGV4aXN0aW5nIGJhZGdlcyB0aGF0IG1pZ2h0IGJlIGxlZnQgb3ZlciBmcm9tIHNlcnZlci1zaWRlIHJlbmRlcmluZy4gKi9cbiAgcHJpdmF0ZSBfY2xlYXJFeGlzdGluZ0JhZGdlcyhjc3NDbGFzczogc3RyaW5nKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBsZXQgY2hpbGRDb3VudCA9IGVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoO1xuXG4gICAgLy8gVXNlIGEgcmV2ZXJzZSB3aGlsZSwgYmVjYXVzZSB3ZSdsbCBiZSByZW1vdmluZyBlbGVtZW50cyBmcm9tIHRoZSBsaXN0IGFzIHdlJ3JlIGl0ZXJhdGluZy5cbiAgICB3aGlsZSAoY2hpbGRDb3VudC0tKSB7XG4gICAgICBjb25zdCBjdXJyZW50Q2hpbGQgPSBlbGVtZW50LmNoaWxkcmVuW2NoaWxkQ291bnRdO1xuXG4gICAgICBpZiAoY3VycmVudENoaWxkLmNsYXNzTGlzdC5jb250YWlucyhjc3NDbGFzcykpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChjdXJyZW50Q2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGlkZGVuOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vdmVybGFwOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYmFkZ2UvYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDaEQsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUNSLFNBQVMsRUFFVCxTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUE2QixhQUFhLEVBQWUsTUFBTSx3QkFBd0IsQ0FBQztBQUMvRixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQzs7SUFHdkUsTUFBTSxHQUFHLENBQUM7Ozs7O0FBSWQsTUFBTSxZQUFZO0NBQUc7O01BRWYsa0JBQWtCLEdBQ21CLGFBQWEsQ0FBQyxZQUFZLENBQUM7Ozs7QUF1QnRFLE1BQU0sT0FBTyxRQUFTLFNBQVEsa0JBQWtCOzs7Ozs7OztJQStEOUMsWUFDWSxPQUFlLEVBQ2YsV0FBb0MsRUFDcEMsY0FBNkIsRUFDN0IsU0FBb0IsRUFDdUIsY0FBdUI7UUFDMUUsS0FBSyxFQUFFLENBQUM7UUFMQSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ3BDLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQzdCLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFDdUIsbUJBQWMsR0FBZCxjQUFjLENBQVM7Ozs7UUFsRTlFLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBU1osV0FBTSxHQUFpQixTQUFTLENBQUM7UUFRakMsYUFBUSxHQUFZLElBQUksQ0FBQzs7Ozs7UUFNTixhQUFRLEdBQXFCLGFBQWEsQ0FBQzs7OztRQXVCL0MsU0FB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L0Q1QyxLQUFLLFNBQUMsZUFBZTtzQkFTckIsS0FBSyxTQUFDLGlCQUFpQjt1QkFXdkIsS0FBSyxTQUFDLGtCQUFrQjtzQkFHeEIsS0FBSyxTQUFDLFVBQVU7MEJBR2hCLEtBQUssU0FBQyxxQkFBcUI7bUJBaUIzQixLQUFLLFNBQUMsY0FBYztxQkFHcEIsS0FBSyxTQUFDLGdCQUFnQjs7Ozs7OztJQWpEdkIsK0JBQW9COzs7OztJQVNwQiwwQkFBeUM7Ozs7O0lBUXpDLDRCQUFpQzs7Ozs7O0lBTWpDLDRCQUFzRTs7Ozs7SUFHdEUsMkJBQW1DOzs7OztJQWlCbkMsZ0NBQTZCOzs7OztJQUc3Qix3QkFBcUQ7Ozs7O0lBUXJELDJCQUF5Qjs7Ozs7SUFHekIsdUJBQXVCOzs7OztJQUV2QixpQ0FBK0M7Ozs7O0lBRzNDLDJCQUF1Qjs7Ozs7SUFDdkIsK0JBQTRDOzs7OztJQUM1QyxrQ0FBcUM7Ozs7O0lBQ3JDLDZCQUE0Qjs7Ozs7SUFDNUIsa0NBQTBFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QXJpYURlc2NyaWJlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIGlzRGV2TW9kZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkRpc2FibGUsIENhbkRpc2FibGVDdG9yLCBtaXhpbkRpc2FibGVkLCBUaGVtZVBhbGV0dGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cblxubGV0IG5leHRJZCA9IDA7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0QmFkZ2UuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0QmFkZ2VCYXNlIHt9XG5cbmNvbnN0IF9NYXRCYWRnZU1peGluQmFzZTpcbiAgICBDYW5EaXNhYmxlQ3RvciAmIHR5cGVvZiBNYXRCYWRnZUJhc2UgPSBtaXhpbkRpc2FibGVkKE1hdEJhZGdlQmFzZSk7XG5cbmV4cG9ydCB0eXBlIE1hdEJhZGdlUG9zaXRpb24gPSAnYWJvdmUgYWZ0ZXInIHwgJ2Fib3ZlIGJlZm9yZScgfCAnYmVsb3cgYmVmb3JlJyB8ICdiZWxvdyBhZnRlcic7XG5leHBvcnQgdHlwZSBNYXRCYWRnZVNpemUgPSAnc21hbGwnIHwgJ21lZGl1bScgfCAnbGFyZ2UnO1xuXG4vKiogRGlyZWN0aXZlIHRvIGRpc3BsYXkgYSB0ZXh0IGJhZGdlLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdEJhZGdlXScsXG4gIGlucHV0czogWydkaXNhYmxlZDogbWF0QmFkZ2VEaXNhYmxlZCddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1iYWRnZScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2Utb3ZlcmxhcF0nOiAnb3ZlcmxhcCcsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYWJvdmVdJzogJ2lzQWJvdmUoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYmVsb3ddJzogJyFpc0Fib3ZlKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWJlZm9yZV0nOiAnIWlzQWZ0ZXIoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYWZ0ZXJdJzogJ2lzQWZ0ZXIoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2Utc21hbGxdJzogJ3NpemUgPT09IFwic21hbGxcIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtbWVkaXVtXSc6ICdzaXplID09PSBcIm1lZGl1bVwiJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1sYXJnZV0nOiAnc2l6ZSA9PT0gXCJsYXJnZVwiJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1oaWRkZW5dJzogJ2hpZGRlbiB8fCAhX2hhc0NvbnRlbnQnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEJhZGdlIGV4dGVuZHMgX01hdEJhZGdlTWl4aW5CYXNlIGltcGxlbWVudHMgT25EZXN0cm95LCBPbkNoYW5nZXMsIENhbkRpc2FibGUge1xuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaGFzIGFueSBjb250ZW50LiAqL1xuICBfaGFzQ29udGVudCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgY29sb3Igb2YgdGhlIGJhZGdlLiBDYW4gYmUgYHByaW1hcnlgLCBgYWNjZW50YCwgb3IgYHdhcm5gLiAqL1xuICBASW5wdXQoJ21hdEJhZGdlQ29sb3InKVxuICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHsgcmV0dXJuIHRoaXMuX2NvbG9yOyB9XG4gIHNldCBjb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgdGhpcy5fc2V0Q29sb3IodmFsdWUpO1xuICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfY29sb3I6IFRoZW1lUGFsZXR0ZSA9ICdwcmltYXJ5JztcblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2Ugc2hvdWxkIG92ZXJsYXAgaXRzIGNvbnRlbnRzIG9yIG5vdCAqL1xuICBASW5wdXQoJ21hdEJhZGdlT3ZlcmxhcCcpXG4gIGdldCBvdmVybGFwKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fb3ZlcmxhcDsgfVxuICBzZXQgb3ZlcmxhcCh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9vdmVybGFwID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbCk7XG4gIH1cbiAgcHJpdmF0ZSBfb3ZlcmxhcDogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIHRoZSBiYWRnZSBzaG91bGQgcmVzaWRlLlxuICAgKiBBY2NlcHRzIGFueSBjb21iaW5hdGlvbiBvZiAnYWJvdmUnfCdiZWxvdycgYW5kICdiZWZvcmUnfCdhZnRlcidcbiAgICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VQb3NpdGlvbicpIHBvc2l0aW9uOiBNYXRCYWRnZVBvc2l0aW9uID0gJ2Fib3ZlIGFmdGVyJztcblxuICAvKiogVGhlIGNvbnRlbnQgZm9yIHRoZSBiYWRnZSAqL1xuICBASW5wdXQoJ21hdEJhZGdlJykgY29udGVudDogc3RyaW5nO1xuXG4gIC8qKiBNZXNzYWdlIHVzZWQgdG8gZGVzY3JpYmUgdGhlIGRlY29yYXRlZCBlbGVtZW50IHZpYSBhcmlhLWRlc2NyaWJlZGJ5ICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VEZXNjcmlwdGlvbicpXG4gIGdldCBkZXNjcmlwdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZGVzY3JpcHRpb247IH1cbiAgc2V0IGRlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3RGVzY3JpcHRpb24gIT09IHRoaXMuX2Rlc2NyaXB0aW9uKSB7XG4gICAgICBjb25zdCBiYWRnZUVsZW1lbnQgPSB0aGlzLl9iYWRnZUVsZW1lbnQ7XG4gICAgICB0aGlzLl91cGRhdGVIb3N0QXJpYURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uLCB0aGlzLl9kZXNjcmlwdGlvbik7XG4gICAgICB0aGlzLl9kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgICBpZiAoYmFkZ2VFbGVtZW50KSB7XG4gICAgICAgIG5ld0Rlc2NyaXB0aW9uID8gYmFkZ2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIG5ld0Rlc2NyaXB0aW9uKSA6XG4gICAgICAgICAgICBiYWRnZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Rlc2NyaXB0aW9uOiBzdHJpbmc7XG5cbiAgLyoqIFNpemUgb2YgdGhlIGJhZGdlLiBDYW4gYmUgJ3NtYWxsJywgJ21lZGl1bScsIG9yICdsYXJnZScuICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VTaXplJykgc2l6ZTogTWF0QmFkZ2VTaXplID0gJ21lZGl1bSc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGhpZGRlbi4gKi9cbiAgQElucHV0KCdtYXRCYWRnZUhpZGRlbicpXG4gIGdldCBoaWRkZW4oKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9oaWRkZW47IH1cbiAgc2V0IGhpZGRlbih2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9oaWRkZW4gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsKTtcbiAgfVxuICBwcml2YXRlIF9oaWRkZW46IGJvb2xlYW47XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhlIGJhZGdlICovXG4gIF9pZDogbnVtYmVyID0gbmV4dElkKys7XG5cbiAgcHJpdmF0ZSBfYmFkZ2VFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICBwcml2YXRlIF9hcmlhRGVzY3JpYmVyOiBBcmlhRGVzY3JpYmVyLFxuICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwcml2YXRlIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgICBzdXBlcigpO1xuXG4gICAgICBpZiAoaXNEZXZNb2RlKCkpIHtcbiAgICAgICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGlmIChuYXRpdmVFbGVtZW50Lm5vZGVUeXBlICE9PSBuYXRpdmVFbGVtZW50LkVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgIHRocm93IEVycm9yKCdtYXRCYWRnZSBtdXN0IGJlIGF0dGFjaGVkIHRvIGFuIGVsZW1lbnQgbm9kZS4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaXMgYWJvdmUgdGhlIGhvc3Qgb3Igbm90ICovXG4gIGlzQWJvdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24uaW5kZXhPZignYmVsb3cnKSA9PT0gLTE7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaXMgYWZ0ZXIgdGhlIGhvc3Qgb3Igbm90ICovXG4gIGlzQWZ0ZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24uaW5kZXhPZignYmVmb3JlJykgPT09IC0xO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IGNvbnRlbnRDaGFuZ2UgPSBjaGFuZ2VzWydjb250ZW50J107XG5cbiAgICBpZiAoY29udGVudENoYW5nZSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb250ZW50Q2hhbmdlLmN1cnJlbnRWYWx1ZTtcbiAgICAgIHRoaXMuX2hhc0NvbnRlbnQgPSB2YWx1ZSAhPSBudWxsICYmIGAke3ZhbHVlfWAudHJpbSgpLmxlbmd0aCA+IDA7XG4gICAgICB0aGlzLl91cGRhdGVUZXh0Q29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGJhZGdlRWxlbWVudCA9IHRoaXMuX2JhZGdlRWxlbWVudDtcblxuICAgIGlmIChiYWRnZUVsZW1lbnQpIHtcbiAgICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXIucmVtb3ZlRGVzY3JpcHRpb24oYmFkZ2VFbGVtZW50LCB0aGlzLmRlc2NyaXB0aW9uKTtcbiAgICAgIH1cblxuICAgICAgLy8gV2hlbiBjcmVhdGluZyBhIGJhZGdlIHRocm91Z2ggdGhlIFJlbmRlcmVyLCBBbmd1bGFyIHdpbGwga2VlcCBpdCBpbiBhbiBpbmRleC5cbiAgICAgIC8vIFdlIGhhdmUgdG8gZGVzdHJveSBpdCBvdXJzZWx2ZXMsIG90aGVyd2lzZSBpdCdsbCBiZSByZXRhaW5lZCBpbiBtZW1vcnkuXG4gICAgICBpZiAodGhpcy5fcmVuZGVyZXIuZGVzdHJveU5vZGUpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuZGVzdHJveU5vZGUoYmFkZ2VFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZWxlbWVudCBpbnRvIHdoaWNoIHRoZSBiYWRnZSdzIGNvbnRlbnQgaXMgYmVpbmcgcmVuZGVyZWQuXG4gICAqIFVuZGVmaW5lZCBpZiB0aGUgZWxlbWVudCBoYXNuJ3QgYmVlbiBjcmVhdGVkIChlLmcuIGlmIHRoZSBiYWRnZSBkb2Vzbid0IGhhdmUgY29udGVudCkuXG4gICAqL1xuICBnZXRCYWRnZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9iYWRnZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogSW5qZWN0cyBhIHNwYW4gZWxlbWVudCBpbnRvIHRoZSBET00gd2l0aCB0aGUgY29udGVudC4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVGV4dENvbnRlbnQoKTogSFRNTFNwYW5FbGVtZW50IHtcbiAgICBpZiAoIXRoaXMuX2JhZGdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fYmFkZ2VFbGVtZW50ID0gdGhpcy5fY3JlYXRlQmFkZ2VFbGVtZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2JhZGdlRWxlbWVudC50ZXh0Q29udGVudCA9IHRoaXMuY29udGVudDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2JhZGdlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIHRoZSBiYWRnZSBlbGVtZW50ICovXG4gIHByaXZhdGUgX2NyZWF0ZUJhZGdlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgYmFkZ2VFbGVtZW50ID0gdGhpcy5fcmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGFjdGl2ZUNsYXNzID0gJ21hdC1iYWRnZS1hY3RpdmUnO1xuICAgIGNvbnN0IGNvbnRlbnRDbGFzcyA9ICdtYXQtYmFkZ2UtY29udGVudCc7XG5cbiAgICAvLyBDbGVhciBhbnkgZXhpc3RpbmcgYmFkZ2VzIHdoaWNoIG1heSBoYXZlIHBlcnNpc3RlZCBmcm9tIGEgc2VydmVyLXNpZGUgcmVuZGVyLlxuICAgIHRoaXMuX2NsZWFyRXhpc3RpbmdCYWRnZXMoY29udGVudENsYXNzKTtcbiAgICBiYWRnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIGBtYXQtYmFkZ2UtY29udGVudC0ke3RoaXMuX2lkfWApO1xuICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGNvbnRlbnRDbGFzcyk7XG4gICAgYmFkZ2VFbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy5jb250ZW50O1xuXG4gICAgaWYgKHRoaXMuX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdfbWF0LWFuaW1hdGlvbi1ub29wYWJsZScpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uKSB7XG4gICAgICBiYWRnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgdGhpcy5kZXNjcmlwdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKGJhZGdlRWxlbWVudCk7XG5cbiAgICAvLyBhbmltYXRlIGluIGFmdGVyIGluc2VydGlvblxuICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nICYmIHRoaXMuX2FuaW1hdGlvbk1vZGUgIT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhZGdlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBhcmlhLWxhYmVsIHByb3BlcnR5IG9uIHRoZSBlbGVtZW50ICovXG4gIHByaXZhdGUgX3VwZGF0ZUhvc3RBcmlhRGVzY3JpcHRpb24obmV3RGVzY3JpcHRpb246IHN0cmluZywgb2xkRGVzY3JpcHRpb246IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIGVuc3VyZSBjb250ZW50IGF2YWlsYWJsZSBiZWZvcmUgc2V0dGluZyBsYWJlbFxuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLl91cGRhdGVUZXh0Q29udGVudCgpO1xuXG4gICAgaWYgKG9sZERlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLnJlbW92ZURlc2NyaXB0aW9uKGNvbnRlbnQsIG9sZERlc2NyaXB0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAobmV3RGVzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXIuZGVzY3JpYmUoY29udGVudCwgbmV3RGVzY3JpcHRpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBZGRzIGNzcyB0aGVtZSBjbGFzcyBnaXZlbiB0aGUgY29sb3IgdG8gdGhlIGNvbXBvbmVudCBob3N0ICovXG4gIHByaXZhdGUgX3NldENvbG9yKGNvbG9yUGFsZXR0ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgaWYgKGNvbG9yUGFsZXR0ZSAhPT0gdGhpcy5fY29sb3IpIHtcbiAgICAgIGlmICh0aGlzLl9jb2xvcikge1xuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShgbWF0LWJhZGdlLSR7dGhpcy5fY29sb3J9YCk7XG4gICAgICB9XG4gICAgICBpZiAoY29sb3JQYWxldHRlKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBtYXQtYmFkZ2UtJHtjb2xvclBhbGV0dGV9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENsZWFycyBhbnkgZXhpc3RpbmcgYmFkZ2VzIHRoYXQgbWlnaHQgYmUgbGVmdCBvdmVyIGZyb20gc2VydmVyLXNpZGUgcmVuZGVyaW5nLiAqL1xuICBwcml2YXRlIF9jbGVhckV4aXN0aW5nQmFkZ2VzKGNzc0NsYXNzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGxldCBjaGlsZENvdW50ID0gZWxlbWVudC5jaGlsZHJlbi5sZW5ndGg7XG5cbiAgICAvLyBVc2UgYSByZXZlcnNlIHdoaWxlLCBiZWNhdXNlIHdlJ2xsIGJlIHJlbW92aW5nIGVsZW1lbnRzIGZyb20gdGhlIGxpc3QgYXMgd2UncmUgaXRlcmF0aW5nLlxuICAgIHdoaWxlIChjaGlsZENvdW50LS0pIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRDaGlsZCA9IGVsZW1lbnQuY2hpbGRyZW5bY2hpbGRDb3VudF07XG5cbiAgICAgIGlmIChjdXJyZW50Q2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKGNzc0NsYXNzKSkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGN1cnJlbnRDaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=
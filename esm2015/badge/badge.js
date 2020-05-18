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
let MatBadge = /** @class */ (() => {
    /**
     * Directive to display a text badge.
     */
    class MatBadge extends _MatBadgeMixinBase {
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
    return MatBadge;
})();
export { MatBadge };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYmFkZ2UvYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsRUFDUixTQUFTLEVBRVQsU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBNkIsYUFBYSxFQUFlLE1BQU0sd0JBQXdCLENBQUM7QUFDL0YsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7O0lBR3ZFLE1BQU0sR0FBRyxDQUFDOzs7OztBQUlkLE1BQU0sWUFBWTtDQUFHOztNQUVmLGtCQUFrQixHQUNtQixhQUFhLENBQUMsWUFBWSxDQUFDOzs7O0FBV3RFOzs7O0lBQUEsTUFpQmEsUUFBUyxTQUFRLGtCQUFrQjs7Ozs7Ozs7UUErRDlDLFlBQ1ksT0FBZSxFQUNmLFdBQW9DLEVBQ3BDLGNBQTZCLEVBQzdCLFNBQW9CLEVBQ3VCLGNBQXVCO1lBQzFFLEtBQUssRUFBRSxDQUFDO1lBTEEsWUFBTyxHQUFQLE9BQU8sQ0FBUTtZQUNmLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtZQUNwQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtZQUM3QixjQUFTLEdBQVQsU0FBUyxDQUFXO1lBQ3VCLG1CQUFjLEdBQWQsY0FBYyxDQUFTOzs7O1lBbEU5RSxnQkFBVyxHQUFHLEtBQUssQ0FBQztZQVNaLFdBQU0sR0FBaUIsU0FBUyxDQUFDO1lBUWpDLGFBQVEsR0FBWSxJQUFJLENBQUM7Ozs7O1lBTU4sYUFBUSxHQUFxQixhQUFhLENBQUM7Ozs7WUF1Qi9D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QkFXbkIsU0FBUzs2Q0ErR0osUUFBUSxZQUFJLE1BQU0sU0FBQyxxQkFBcUI7Ozt3QkEvRDVDLEtBQUssU0FBQyxlQUFlOzBCQVNyQixLQUFLLFNBQUMsaUJBQWlCOzJCQVd2QixLQUFLLFNBQUMsa0JBQWtCOzBCQUd4QixLQUFLLFNBQUMsVUFBVTs4QkFHaEIsS0FBSyxTQUFDLHFCQUFxQjt1QkFpQjNCLEtBQUssU0FBQyxjQUFjO3lCQUdwQixLQUFLLFNBQUMsZ0JBQWdCOztJQWtLekIsZUFBQztLQUFBO1NBck5ZLFFBQVE7OztJQWtObkIsb0NBQWdEOztJQUNoRCxrQ0FBOEM7O0lBQzlDLG1DQUErQzs7Ozs7SUFsTi9DLCtCQUFvQjs7Ozs7SUFTcEIsMEJBQXlDOzs7OztJQVF6Qyw0QkFBaUM7Ozs7OztJQU1qQyw0QkFBc0U7Ozs7O0lBR3RFLDJCQUFtQzs7Ozs7SUFpQm5DLGdDQUE2Qjs7Ozs7SUFHN0Isd0JBQXFEOzs7OztJQVFyRCwyQkFBeUI7Ozs7O0lBR3pCLHVCQUF1Qjs7Ozs7SUFFdkIsaUNBQStDOzs7OztJQUczQywyQkFBdUI7Ozs7O0lBQ3ZCLCtCQUE0Qzs7Ozs7SUFDNUMsa0NBQXFDOzs7OztJQUNyQyw2QkFBNEI7Ozs7O0lBQzVCLGtDQUEwRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FyaWFEZXNjcmliZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjIsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIGlzRGV2TW9kZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkRpc2FibGUsIENhbkRpc2FibGVDdG9yLCBtaXhpbkRpc2FibGVkLCBUaGVtZVBhbGV0dGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cblxubGV0IG5leHRJZCA9IDA7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0QmFkZ2UuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0QmFkZ2VCYXNlIHt9XG5cbmNvbnN0IF9NYXRCYWRnZU1peGluQmFzZTpcbiAgICBDYW5EaXNhYmxlQ3RvciAmIHR5cGVvZiBNYXRCYWRnZUJhc2UgPSBtaXhpbkRpc2FibGVkKE1hdEJhZGdlQmFzZSk7XG5cbi8qKiBBbGxvd2VkIHBvc2l0aW9uIG9wdGlvbnMgZm9yIG1hdEJhZGdlUG9zaXRpb24gKi9cbmV4cG9ydCB0eXBlIE1hdEJhZGdlUG9zaXRpb24gPVxuICAgICdhYm92ZSBhZnRlcicgfCAnYWJvdmUgYmVmb3JlJyB8ICdiZWxvdyBiZWZvcmUnIHwgJ2JlbG93IGFmdGVyJyB8XG4gICAgJ2JlZm9yZScgfCAnYWZ0ZXInIHwgJ2Fib3ZlJyB8ICdiZWxvdyc7XG5cbi8qKiBBbGxvd2VkIHNpemUgb3B0aW9ucyBmb3IgbWF0QmFkZ2VTaXplICovXG5leHBvcnQgdHlwZSBNYXRCYWRnZVNpemUgPSAnc21hbGwnIHwgJ21lZGl1bScgfCAnbGFyZ2UnO1xuXG4vKiogRGlyZWN0aXZlIHRvIGRpc3BsYXkgYSB0ZXh0IGJhZGdlLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdEJhZGdlXScsXG4gIGlucHV0czogWydkaXNhYmxlZDogbWF0QmFkZ2VEaXNhYmxlZCddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1iYWRnZScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2Utb3ZlcmxhcF0nOiAnb3ZlcmxhcCcsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYWJvdmVdJzogJ2lzQWJvdmUoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYmVsb3ddJzogJyFpc0Fib3ZlKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWJlZm9yZV0nOiAnIWlzQWZ0ZXIoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYWZ0ZXJdJzogJ2lzQWZ0ZXIoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2Utc21hbGxdJzogJ3NpemUgPT09IFwic21hbGxcIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtbWVkaXVtXSc6ICdzaXplID09PSBcIm1lZGl1bVwiJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1sYXJnZV0nOiAnc2l6ZSA9PT0gXCJsYXJnZVwiJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1oaWRkZW5dJzogJ2hpZGRlbiB8fCAhX2hhc0NvbnRlbnQnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEJhZGdlIGV4dGVuZHMgX01hdEJhZGdlTWl4aW5CYXNlIGltcGxlbWVudHMgT25EZXN0cm95LCBPbkNoYW5nZXMsIENhbkRpc2FibGUge1xuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaGFzIGFueSBjb250ZW50LiAqL1xuICBfaGFzQ29udGVudCA9IGZhbHNlO1xuXG4gIC8qKiBUaGUgY29sb3Igb2YgdGhlIGJhZGdlLiBDYW4gYmUgYHByaW1hcnlgLCBgYWNjZW50YCwgb3IgYHdhcm5gLiAqL1xuICBASW5wdXQoJ21hdEJhZGdlQ29sb3InKVxuICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHsgcmV0dXJuIHRoaXMuX2NvbG9yOyB9XG4gIHNldCBjb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgdGhpcy5fc2V0Q29sb3IodmFsdWUpO1xuICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfY29sb3I6IFRoZW1lUGFsZXR0ZSA9ICdwcmltYXJ5JztcblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2Ugc2hvdWxkIG92ZXJsYXAgaXRzIGNvbnRlbnRzIG9yIG5vdCAqL1xuICBASW5wdXQoJ21hdEJhZGdlT3ZlcmxhcCcpXG4gIGdldCBvdmVybGFwKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fb3ZlcmxhcDsgfVxuICBzZXQgb3ZlcmxhcCh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9vdmVybGFwID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbCk7XG4gIH1cbiAgcHJpdmF0ZSBfb3ZlcmxhcDogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIHRoZSBiYWRnZSBzaG91bGQgcmVzaWRlLlxuICAgKiBBY2NlcHRzIGFueSBjb21iaW5hdGlvbiBvZiAnYWJvdmUnfCdiZWxvdycgYW5kICdiZWZvcmUnfCdhZnRlcidcbiAgICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VQb3NpdGlvbicpIHBvc2l0aW9uOiBNYXRCYWRnZVBvc2l0aW9uID0gJ2Fib3ZlIGFmdGVyJztcblxuICAvKiogVGhlIGNvbnRlbnQgZm9yIHRoZSBiYWRnZSAqL1xuICBASW5wdXQoJ21hdEJhZGdlJykgY29udGVudDogc3RyaW5nO1xuXG4gIC8qKiBNZXNzYWdlIHVzZWQgdG8gZGVzY3JpYmUgdGhlIGRlY29yYXRlZCBlbGVtZW50IHZpYSBhcmlhLWRlc2NyaWJlZGJ5ICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VEZXNjcmlwdGlvbicpXG4gIGdldCBkZXNjcmlwdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZGVzY3JpcHRpb247IH1cbiAgc2V0IGRlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3RGVzY3JpcHRpb24gIT09IHRoaXMuX2Rlc2NyaXB0aW9uKSB7XG4gICAgICBjb25zdCBiYWRnZUVsZW1lbnQgPSB0aGlzLl9iYWRnZUVsZW1lbnQ7XG4gICAgICB0aGlzLl91cGRhdGVIb3N0QXJpYURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uLCB0aGlzLl9kZXNjcmlwdGlvbik7XG4gICAgICB0aGlzLl9kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgICBpZiAoYmFkZ2VFbGVtZW50KSB7XG4gICAgICAgIG5ld0Rlc2NyaXB0aW9uID8gYmFkZ2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIG5ld0Rlc2NyaXB0aW9uKSA6XG4gICAgICAgICAgICBiYWRnZUVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWxhYmVsJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX2Rlc2NyaXB0aW9uOiBzdHJpbmc7XG5cbiAgLyoqIFNpemUgb2YgdGhlIGJhZGdlLiBDYW4gYmUgJ3NtYWxsJywgJ21lZGl1bScsIG9yICdsYXJnZScuICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VTaXplJykgc2l6ZTogTWF0QmFkZ2VTaXplID0gJ21lZGl1bSc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGhpZGRlbi4gKi9cbiAgQElucHV0KCdtYXRCYWRnZUhpZGRlbicpXG4gIGdldCBoaWRkZW4oKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9oaWRkZW47IH1cbiAgc2V0IGhpZGRlbih2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9oaWRkZW4gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsKTtcbiAgfVxuICBwcml2YXRlIF9oaWRkZW46IGJvb2xlYW47XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhlIGJhZGdlICovXG4gIF9pZDogbnVtYmVyID0gbmV4dElkKys7XG5cbiAgcHJpdmF0ZSBfYmFkZ2VFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICBwcml2YXRlIF9hcmlhRGVzY3JpYmVyOiBBcmlhRGVzY3JpYmVyLFxuICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwcml2YXRlIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nKSB7XG4gICAgICBzdXBlcigpO1xuXG4gICAgICBpZiAoaXNEZXZNb2RlKCkpIHtcbiAgICAgICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIGlmIChuYXRpdmVFbGVtZW50Lm5vZGVUeXBlICE9PSBuYXRpdmVFbGVtZW50LkVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgIHRocm93IEVycm9yKCdtYXRCYWRnZSBtdXN0IGJlIGF0dGFjaGVkIHRvIGFuIGVsZW1lbnQgbm9kZS4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaXMgYWJvdmUgdGhlIGhvc3Qgb3Igbm90ICovXG4gIGlzQWJvdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24uaW5kZXhPZignYmVsb3cnKSA9PT0gLTE7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaXMgYWZ0ZXIgdGhlIGhvc3Qgb3Igbm90ICovXG4gIGlzQWZ0ZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24uaW5kZXhPZignYmVmb3JlJykgPT09IC0xO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IGNvbnRlbnRDaGFuZ2UgPSBjaGFuZ2VzWydjb250ZW50J107XG5cbiAgICBpZiAoY29udGVudENoYW5nZSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb250ZW50Q2hhbmdlLmN1cnJlbnRWYWx1ZTtcbiAgICAgIHRoaXMuX2hhc0NvbnRlbnQgPSB2YWx1ZSAhPSBudWxsICYmIGAke3ZhbHVlfWAudHJpbSgpLmxlbmd0aCA+IDA7XG4gICAgICB0aGlzLl91cGRhdGVUZXh0Q29udGVudCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGNvbnN0IGJhZGdlRWxlbWVudCA9IHRoaXMuX2JhZGdlRWxlbWVudDtcblxuICAgIGlmIChiYWRnZUVsZW1lbnQpIHtcbiAgICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXIucmVtb3ZlRGVzY3JpcHRpb24oYmFkZ2VFbGVtZW50LCB0aGlzLmRlc2NyaXB0aW9uKTtcbiAgICAgIH1cblxuICAgICAgLy8gV2hlbiBjcmVhdGluZyBhIGJhZGdlIHRocm91Z2ggdGhlIFJlbmRlcmVyLCBBbmd1bGFyIHdpbGwga2VlcCBpdCBpbiBhbiBpbmRleC5cbiAgICAgIC8vIFdlIGhhdmUgdG8gZGVzdHJveSBpdCBvdXJzZWx2ZXMsIG90aGVyd2lzZSBpdCdsbCBiZSByZXRhaW5lZCBpbiBtZW1vcnkuXG4gICAgICBpZiAodGhpcy5fcmVuZGVyZXIuZGVzdHJveU5vZGUpIHtcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIuZGVzdHJveU5vZGUoYmFkZ2VFbGVtZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZWxlbWVudCBpbnRvIHdoaWNoIHRoZSBiYWRnZSdzIGNvbnRlbnQgaXMgYmVpbmcgcmVuZGVyZWQuXG4gICAqIFVuZGVmaW5lZCBpZiB0aGUgZWxlbWVudCBoYXNuJ3QgYmVlbiBjcmVhdGVkIChlLmcuIGlmIHRoZSBiYWRnZSBkb2Vzbid0IGhhdmUgY29udGVudCkuXG4gICAqL1xuICBnZXRCYWRnZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9iYWRnZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogSW5qZWN0cyBhIHNwYW4gZWxlbWVudCBpbnRvIHRoZSBET00gd2l0aCB0aGUgY29udGVudC4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlVGV4dENvbnRlbnQoKTogSFRNTFNwYW5FbGVtZW50IHtcbiAgICBpZiAoIXRoaXMuX2JhZGdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fYmFkZ2VFbGVtZW50ID0gdGhpcy5fY3JlYXRlQmFkZ2VFbGVtZW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2JhZGdlRWxlbWVudC50ZXh0Q29udGVudCA9IHRoaXMuY29udGVudDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2JhZGdlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIHRoZSBiYWRnZSBlbGVtZW50ICovXG4gIHByaXZhdGUgX2NyZWF0ZUJhZGdlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgYmFkZ2VFbGVtZW50ID0gdGhpcy5fcmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGFjdGl2ZUNsYXNzID0gJ21hdC1iYWRnZS1hY3RpdmUnO1xuICAgIGNvbnN0IGNvbnRlbnRDbGFzcyA9ICdtYXQtYmFkZ2UtY29udGVudCc7XG5cbiAgICAvLyBDbGVhciBhbnkgZXhpc3RpbmcgYmFkZ2VzIHdoaWNoIG1heSBoYXZlIHBlcnNpc3RlZCBmcm9tIGEgc2VydmVyLXNpZGUgcmVuZGVyLlxuICAgIHRoaXMuX2NsZWFyRXhpc3RpbmdCYWRnZXMoY29udGVudENsYXNzKTtcbiAgICBiYWRnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIGBtYXQtYmFkZ2UtY29udGVudC0ke3RoaXMuX2lkfWApO1xuICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGNvbnRlbnRDbGFzcyk7XG4gICAgYmFkZ2VFbGVtZW50LnRleHRDb250ZW50ID0gdGhpcy5jb250ZW50O1xuXG4gICAgaWYgKHRoaXMuX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdfbWF0LWFuaW1hdGlvbi1ub29wYWJsZScpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uKSB7XG4gICAgICBiYWRnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgdGhpcy5kZXNjcmlwdGlvbik7XG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKGJhZGdlRWxlbWVudCk7XG5cbiAgICAvLyBhbmltYXRlIGluIGFmdGVyIGluc2VydGlvblxuICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nICYmIHRoaXMuX2FuaW1hdGlvbk1vZGUgIT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhZGdlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBhcmlhLWxhYmVsIHByb3BlcnR5IG9uIHRoZSBlbGVtZW50ICovXG4gIHByaXZhdGUgX3VwZGF0ZUhvc3RBcmlhRGVzY3JpcHRpb24obmV3RGVzY3JpcHRpb246IHN0cmluZywgb2xkRGVzY3JpcHRpb246IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIGVuc3VyZSBjb250ZW50IGF2YWlsYWJsZSBiZWZvcmUgc2V0dGluZyBsYWJlbFxuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLl91cGRhdGVUZXh0Q29udGVudCgpO1xuXG4gICAgaWYgKG9sZERlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLnJlbW92ZURlc2NyaXB0aW9uKGNvbnRlbnQsIG9sZERlc2NyaXB0aW9uKTtcbiAgICB9XG5cbiAgICBpZiAobmV3RGVzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXIuZGVzY3JpYmUoY29udGVudCwgbmV3RGVzY3JpcHRpb24pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBBZGRzIGNzcyB0aGVtZSBjbGFzcyBnaXZlbiB0aGUgY29sb3IgdG8gdGhlIGNvbXBvbmVudCBob3N0ICovXG4gIHByaXZhdGUgX3NldENvbG9yKGNvbG9yUGFsZXR0ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgaWYgKGNvbG9yUGFsZXR0ZSAhPT0gdGhpcy5fY29sb3IpIHtcbiAgICAgIGlmICh0aGlzLl9jb2xvcikge1xuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShgbWF0LWJhZGdlLSR7dGhpcy5fY29sb3J9YCk7XG4gICAgICB9XG4gICAgICBpZiAoY29sb3JQYWxldHRlKSB7XG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGBtYXQtYmFkZ2UtJHtjb2xvclBhbGV0dGV9YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENsZWFycyBhbnkgZXhpc3RpbmcgYmFkZ2VzIHRoYXQgbWlnaHQgYmUgbGVmdCBvdmVyIGZyb20gc2VydmVyLXNpZGUgcmVuZGVyaW5nLiAqL1xuICBwcml2YXRlIF9jbGVhckV4aXN0aW5nQmFkZ2VzKGNzc0NsYXNzOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGxldCBjaGlsZENvdW50ID0gZWxlbWVudC5jaGlsZHJlbi5sZW5ndGg7XG5cbiAgICAvLyBVc2UgYSByZXZlcnNlIHdoaWxlLCBiZWNhdXNlIHdlJ2xsIGJlIHJlbW92aW5nIGVsZW1lbnRzIGZyb20gdGhlIGxpc3QgYXMgd2UncmUgaXRlcmF0aW5nLlxuICAgIHdoaWxlIChjaGlsZENvdW50LS0pIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRDaGlsZCA9IGVsZW1lbnQuY2hpbGRyZW5bY2hpbGRDb3VudF07XG5cbiAgICAgIGlmIChjdXJyZW50Q2hpbGQuY2xhc3NMaXN0LmNvbnRhaW5zKGNzc0NsYXNzKSkge1xuICAgICAgICBlbGVtZW50LnJlbW92ZUNoaWxkKGN1cnJlbnRDaGlsZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oaWRkZW46IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX292ZXJsYXA6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==
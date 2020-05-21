/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { AriaDescriber } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, Inject, Input, NgZone, Optional, Renderer2, isDevMode, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
let nextId = 0;
// Boilerplate for applying mixins to MatBadge.
/** @docs-private */
class MatBadgeBase {
}
const _MatBadgeMixinBase = mixinDisabled(MatBadgeBase);
/** Directive to display a text badge. */
let MatBadge = /** @class */ (() => {
    let MatBadge = class MatBadge extends _MatBadgeMixinBase {
        constructor(_ngZone, _elementRef, _ariaDescriber, _renderer, _animationMode) {
            super();
            this._ngZone = _ngZone;
            this._elementRef = _elementRef;
            this._ariaDescriber = _ariaDescriber;
            this._renderer = _renderer;
            this._animationMode = _animationMode;
            /** Whether the badge has any content. */
            this._hasContent = false;
            this._color = 'primary';
            this._overlap = true;
            /**
             * Position the badge should reside.
             * Accepts any combination of 'above'|'below' and 'before'|'after'
             */
            this.position = 'above after';
            /** Size of the badge. Can be 'small', 'medium', or 'large'. */
            this.size = 'medium';
            /** Unique id for the badge */
            this._id = nextId++;
            if (isDevMode()) {
                const nativeElement = _elementRef.nativeElement;
                if (nativeElement.nodeType !== nativeElement.ELEMENT_NODE) {
                    throw Error('matBadge must be attached to an element node.');
                }
            }
        }
        /** The color of the badge. Can be `primary`, `accent`, or `warn`. */
        get color() { return this._color; }
        set color(value) {
            this._setColor(value);
            this._color = value;
        }
        /** Whether the badge should overlap its contents or not */
        get overlap() { return this._overlap; }
        set overlap(val) {
            this._overlap = coerceBooleanProperty(val);
        }
        /** Message used to describe the decorated element via aria-describedby */
        get description() { return this._description; }
        set description(newDescription) {
            if (newDescription !== this._description) {
                const badgeElement = this._badgeElement;
                this._updateHostAriaDescription(newDescription, this._description);
                this._description = newDescription;
                if (badgeElement) {
                    newDescription ? badgeElement.setAttribute('aria-label', newDescription) :
                        badgeElement.removeAttribute('aria-label');
                }
            }
        }
        /** Whether the badge is hidden. */
        get hidden() { return this._hidden; }
        set hidden(val) {
            this._hidden = coerceBooleanProperty(val);
        }
        /** Whether the badge is above the host or not */
        isAbove() {
            return this.position.indexOf('below') === -1;
        }
        /** Whether the badge is after the host or not */
        isAfter() {
            return this.position.indexOf('before') === -1;
        }
        ngOnChanges(changes) {
            const contentChange = changes['content'];
            if (contentChange) {
                const value = contentChange.currentValue;
                this._hasContent = value != null && `${value}`.trim().length > 0;
                this._updateTextContent();
            }
        }
        ngOnDestroy() {
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
         */
        getBadgeElement() {
            return this._badgeElement;
        }
        /** Injects a span element into the DOM with the content. */
        _updateTextContent() {
            if (!this._badgeElement) {
                this._badgeElement = this._createBadgeElement();
            }
            else {
                this._badgeElement.textContent = this.content;
            }
            return this._badgeElement;
        }
        /** Creates the badge element */
        _createBadgeElement() {
            const badgeElement = this._renderer.createElement('span');
            const activeClass = 'mat-badge-active';
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
                this._ngZone.runOutsideAngular(() => {
                    requestAnimationFrame(() => {
                        badgeElement.classList.add(activeClass);
                    });
                });
            }
            else {
                badgeElement.classList.add(activeClass);
            }
            return badgeElement;
        }
        /** Sets the aria-label property on the element */
        _updateHostAriaDescription(newDescription, oldDescription) {
            // ensure content available before setting label
            const content = this._updateTextContent();
            if (oldDescription) {
                this._ariaDescriber.removeDescription(content, oldDescription);
            }
            if (newDescription) {
                this._ariaDescriber.describe(content, newDescription);
            }
        }
        /** Adds css theme class given the color to the component host */
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
        /** Clears any existing badges that might be left over from server-side rendering. */
        _clearExistingBadges(cssClass) {
            const element = this._elementRef.nativeElement;
            let childCount = element.children.length;
            // Use a reverse while, because we'll be removing elements from the list as we're iterating.
            while (childCount--) {
                const currentChild = element.children[childCount];
                if (currentChild.classList.contains(cssClass)) {
                    element.removeChild(currentChild);
                }
            }
        }
    };
    __decorate([
        Input('matBadgeColor'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MatBadge.prototype, "color", null);
    __decorate([
        Input('matBadgeOverlap'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatBadge.prototype, "overlap", null);
    __decorate([
        Input('matBadgePosition'),
        __metadata("design:type", String)
    ], MatBadge.prototype, "position", void 0);
    __decorate([
        Input('matBadge'),
        __metadata("design:type", String)
    ], MatBadge.prototype, "content", void 0);
    __decorate([
        Input('matBadgeDescription'),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MatBadge.prototype, "description", null);
    __decorate([
        Input('matBadgeSize'),
        __metadata("design:type", String)
    ], MatBadge.prototype, "size", void 0);
    __decorate([
        Input('matBadgeHidden'),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatBadge.prototype, "hidden", null);
    MatBadge = __decorate([
        Directive({
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
        }),
        __param(4, Optional()), __param(4, Inject(ANIMATION_MODULE_TYPE)),
        __metadata("design:paramtypes", [NgZone,
            ElementRef,
            AriaDescriber,
            Renderer2, String])
    ], MatBadge);
    return MatBadge;
})();
export { MatBadge };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYmFkZ2UvYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFHTixRQUFRLEVBQ1IsU0FBUyxFQUVULFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQTZCLGFBQWEsRUFBZSxNQUFNLHdCQUF3QixDQUFDO0FBQy9GLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBRzNFLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQztBQUVmLCtDQUErQztBQUMvQyxvQkFBb0I7QUFDcEIsTUFBTSxZQUFZO0NBQUc7QUFFckIsTUFBTSxrQkFBa0IsR0FDbUIsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBVXZFLHlDQUF5QztBQWtCekM7SUFBQSxJQUFhLFFBQVEsR0FBckIsTUFBYSxRQUFTLFNBQVEsa0JBQWtCO1FBK0Q5QyxZQUNZLE9BQWUsRUFDZixXQUFvQyxFQUNwQyxjQUE2QixFQUM3QixTQUFvQixFQUN1QixjQUF1QjtZQUMxRSxLQUFLLEVBQUUsQ0FBQztZQUxBLFlBQU8sR0FBUCxPQUFPLENBQVE7WUFDZixnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7WUFDcEMsbUJBQWMsR0FBZCxjQUFjLENBQWU7WUFDN0IsY0FBUyxHQUFULFNBQVMsQ0FBVztZQUN1QixtQkFBYyxHQUFkLGNBQWMsQ0FBUztZQW5FOUUseUNBQXlDO1lBQ3pDLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1lBU1osV0FBTSxHQUFpQixTQUFT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Q0FBNEM7SUFHbkQ7UUFBbEIsS0FBSyxDQUFDLFVBQVUsQ0FBQzs7NkNBQWlCO0lBSW5DO1FBREMsS0FBSyxDQUFDLHFCQUFxQixDQUFDOzs7K0NBQzBCO0lBZ0JoQztRQUF0QixLQUFLLENBQUMsY0FBYyxDQUFDOzswQ0FBK0I7SUFJckQ7UUFEQyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7OzswQ0FDc0I7SUFwRG5DLFFBQVE7UUFqQnBCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxZQUFZO1lBQ3RCLE1BQU0sRUFBRSxDQUFDLDRCQUE0QixDQUFDO1lBQ3RDLElBQUksRUFBRTtnQkFDSixPQUFPLEVBQUUsV0FBVztnQkFDcEIsMkJBQTJCLEVBQUUsU0FBUztnQkFDdEMseUJBQXlCLEVBQUUsV0FBVztnQkFDdEMseUJBQXlCLEVBQUUsWUFBWTtnQkFDdkMsMEJBQTBCLEVBQUUsWUFBWTtnQkFDeEMseUJBQXlCLEVBQUUsV0FBVztnQkFDdEMseUJBQXlCLEVBQUUsa0JBQWtCO2dCQUM3QywwQkFBMEIsRUFBRSxtQkFBbUI7Z0JBQy9DLHlCQUF5QixFQUFFLGtCQUFrQjtnQkFDN0MsMEJBQTBCLEVBQUUsd0JBQXdCO2dCQUNwRCw0QkFBNEIsRUFBRSxVQUFVO2FBQ3pDO1NBQ0YsQ0FBQztRQXFFSyxXQUFBLFFBQVEsRUFBRSxDQUFBLEVBQUUsV0FBQSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQTt5Q0FKekIsTUFBTTtZQUNGLFVBQVU7WUFDUCxhQUFhO1lBQ2xCLFNBQVM7T0FuRXJCLFFBQVEsQ0FxTnBCO0lBQUQsZUFBQztLQUFBO1NBck5ZLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBcmlhRGVzY3JpYmVyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBpc0Rldk1vZGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvciwgbWl4aW5EaXNhYmxlZCwgVGhlbWVQYWxldHRlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5cbmxldCBuZXh0SWQgPSAwO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEJhZGdlLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdEJhZGdlQmFzZSB7fVxuXG5jb25zdCBfTWF0QmFkZ2VNaXhpbkJhc2U6XG4gICAgQ2FuRGlzYWJsZUN0b3IgJiB0eXBlb2YgTWF0QmFkZ2VCYXNlID0gbWl4aW5EaXNhYmxlZChNYXRCYWRnZUJhc2UpO1xuXG4vKiogQWxsb3dlZCBwb3NpdGlvbiBvcHRpb25zIGZvciBtYXRCYWRnZVBvc2l0aW9uICovXG5leHBvcnQgdHlwZSBNYXRCYWRnZVBvc2l0aW9uID1cbiAgICAnYWJvdmUgYWZ0ZXInIHwgJ2Fib3ZlIGJlZm9yZScgfCAnYmVsb3cgYmVmb3JlJyB8ICdiZWxvdyBhZnRlcicgfFxuICAgICdiZWZvcmUnIHwgJ2FmdGVyJyB8ICdhYm92ZScgfCAnYmVsb3cnO1xuXG4vKiogQWxsb3dlZCBzaXplIG9wdGlvbnMgZm9yIG1hdEJhZGdlU2l6ZSAqL1xuZXhwb3J0IHR5cGUgTWF0QmFkZ2VTaXplID0gJ3NtYWxsJyB8ICdtZWRpdW0nIHwgJ2xhcmdlJztcblxuLyoqIERpcmVjdGl2ZSB0byBkaXNwbGF5IGEgdGV4dCBiYWRnZS4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRCYWRnZV0nLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQ6IG1hdEJhZGdlRGlzYWJsZWQnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtYmFkZ2UnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLW92ZXJsYXBdJzogJ292ZXJsYXAnLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWFib3ZlXSc6ICdpc0Fib3ZlKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWJlbG93XSc6ICchaXNBYm92ZSgpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1iZWZvcmVdJzogJyFpc0FmdGVyKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWFmdGVyXSc6ICdpc0FmdGVyKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLXNtYWxsXSc6ICdzaXplID09PSBcInNtYWxsXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLW1lZGl1bV0nOiAnc2l6ZSA9PT0gXCJtZWRpdW1cIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtbGFyZ2VdJzogJ3NpemUgPT09IFwibGFyZ2VcIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtaGlkZGVuXSc6ICdoaWRkZW4gfHwgIV9oYXNDb250ZW50JyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCYWRnZSBleHRlbmRzIF9NYXRCYWRnZU1peGluQmFzZSBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBDYW5EaXNhYmxlIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGhhcyBhbnkgY29udGVudC4gKi9cbiAgX2hhc0NvbnRlbnQgPSBmYWxzZTtcblxuICAvKiogVGhlIGNvbG9yIG9mIHRoZSBiYWRnZS4gQ2FuIGJlIGBwcmltYXJ5YCwgYGFjY2VudGAsIG9yIGB3YXJuYC4gKi9cbiAgQElucHV0KCdtYXRCYWRnZUNvbG9yJylcbiAgZ2V0IGNvbG9yKCk6IFRoZW1lUGFsZXR0ZSB7IHJldHVybiB0aGlzLl9jb2xvcjsgfVxuICBzZXQgY29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIHRoaXMuX3NldENvbG9yKHZhbHVlKTtcbiAgICB0aGlzLl9jb2xvciA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2NvbG9yOiBUaGVtZVBhbGV0dGUgPSAncHJpbWFyeSc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIHNob3VsZCBvdmVybGFwIGl0cyBjb250ZW50cyBvciBub3QgKi9cbiAgQElucHV0KCdtYXRCYWRnZU92ZXJsYXAnKVxuICBnZXQgb3ZlcmxhcCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX292ZXJsYXA7IH1cbiAgc2V0IG92ZXJsYXAodmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5fb3ZlcmxhcCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpO1xuICB9XG4gIHByaXZhdGUgX292ZXJsYXA6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiB0aGUgYmFkZ2Ugc2hvdWxkIHJlc2lkZS5cbiAgICogQWNjZXB0cyBhbnkgY29tYmluYXRpb24gb2YgJ2Fib3ZlJ3wnYmVsb3cnIGFuZCAnYmVmb3JlJ3wnYWZ0ZXInXG4gICAqL1xuICBASW5wdXQoJ21hdEJhZGdlUG9zaXRpb24nKSBwb3NpdGlvbjogTWF0QmFkZ2VQb3NpdGlvbiA9ICdhYm92ZSBhZnRlcic7XG5cbiAgLyoqIFRoZSBjb250ZW50IGZvciB0aGUgYmFkZ2UgKi9cbiAgQElucHV0KCdtYXRCYWRnZScpIGNvbnRlbnQ6IHN0cmluZztcblxuICAvKiogTWVzc2FnZSB1c2VkIHRvIGRlc2NyaWJlIHRoZSBkZWNvcmF0ZWQgZWxlbWVudCB2aWEgYXJpYS1kZXNjcmliZWRieSAqL1xuICBASW5wdXQoJ21hdEJhZGdlRGVzY3JpcHRpb24nKVxuICBnZXQgZGVzY3JpcHRpb24oKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0aW9uOyB9XG4gIHNldCBkZXNjcmlwdGlvbihuZXdEZXNjcmlwdGlvbjogc3RyaW5nKSB7XG4gICAgaWYgKG5ld0Rlc2NyaXB0aW9uICE9PSB0aGlzLl9kZXNjcmlwdGlvbikge1xuICAgICAgY29uc3QgYmFkZ2VFbGVtZW50ID0gdGhpcy5fYmFkZ2VFbGVtZW50O1xuICAgICAgdGhpcy5fdXBkYXRlSG9zdEFyaWFEZXNjcmlwdGlvbihuZXdEZXNjcmlwdGlvbiwgdGhpcy5fZGVzY3JpcHRpb24pO1xuICAgICAgdGhpcy5fZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgICAgaWYgKGJhZGdlRWxlbWVudCkge1xuICAgICAgICBuZXdEZXNjcmlwdGlvbiA/IGJhZGdlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCBuZXdEZXNjcmlwdGlvbikgOlxuICAgICAgICAgICAgYmFkZ2VFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBwcml2YXRlIF9kZXNjcmlwdGlvbjogc3RyaW5nO1xuXG4gIC8qKiBTaXplIG9mIHRoZSBiYWRnZS4gQ2FuIGJlICdzbWFsbCcsICdtZWRpdW0nLCBvciAnbGFyZ2UnLiAqL1xuICBASW5wdXQoJ21hdEJhZGdlU2l6ZScpIHNpemU6IE1hdEJhZGdlU2l6ZSA9ICdtZWRpdW0nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBpcyBoaWRkZW4uICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VIaWRkZW4nKVxuICBnZXQgaGlkZGVuKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faGlkZGVuOyB9XG4gIHNldCBoaWRkZW4odmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5faGlkZGVuID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbCk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZGVuOiBib29sZWFuO1xuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoZSBiYWRnZSAqL1xuICBfaWQ6IG51bWJlciA9IG5leHRJZCsrO1xuXG4gIHByaXZhdGUgX2JhZGdlRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgcHJpdmF0ZSBfYXJpYURlc2NyaWJlcjogQXJpYURlc2NyaWJlcixcbiAgICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgICAgc3VwZXIoKTtcblxuICAgICAgaWYgKGlzRGV2TW9kZSgpKSB7XG4gICAgICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgICBpZiAobmF0aXZlRWxlbWVudC5ub2RlVHlwZSAhPT0gbmF0aXZlRWxlbWVudC5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgICB0aHJvdyBFcnJvcignbWF0QmFkZ2UgbXVzdCBiZSBhdHRhY2hlZCB0byBhbiBlbGVtZW50IG5vZGUuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGFib3ZlIHRoZSBob3N0IG9yIG5vdCAqL1xuICBpc0Fib3ZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmluZGV4T2YoJ2JlbG93JykgPT09IC0xO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGFmdGVyIHRoZSBob3N0IG9yIG5vdCAqL1xuICBpc0FmdGVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmluZGV4T2YoJ2JlZm9yZScpID09PSAtMTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBjb250ZW50Q2hhbmdlID0gY2hhbmdlc1snY29udGVudCddO1xuXG4gICAgaWYgKGNvbnRlbnRDaGFuZ2UpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY29udGVudENoYW5nZS5jdXJyZW50VmFsdWU7XG4gICAgICB0aGlzLl9oYXNDb250ZW50ID0gdmFsdWUgIT0gbnVsbCAmJiBgJHt2YWx1ZX1gLnRyaW0oKS5sZW5ndGggPiAwO1xuICAgICAgdGhpcy5fdXBkYXRlVGV4dENvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBiYWRnZUVsZW1lbnQgPSB0aGlzLl9iYWRnZUVsZW1lbnQ7XG5cbiAgICBpZiAoYmFkZ2VFbGVtZW50KSB7XG4gICAgICBpZiAodGhpcy5kZXNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLnJlbW92ZURlc2NyaXB0aW9uKGJhZGdlRWxlbWVudCwgdGhpcy5kZXNjcmlwdGlvbik7XG4gICAgICB9XG5cbiAgICAgIC8vIFdoZW4gY3JlYXRpbmcgYSBiYWRnZSB0aHJvdWdoIHRoZSBSZW5kZXJlciwgQW5ndWxhciB3aWxsIGtlZXAgaXQgaW4gYW4gaW5kZXguXG4gICAgICAvLyBXZSBoYXZlIHRvIGRlc3Ryb3kgaXQgb3Vyc2VsdmVzLCBvdGhlcndpc2UgaXQnbGwgYmUgcmV0YWluZWQgaW4gbWVtb3J5LlxuICAgICAgaWYgKHRoaXMuX3JlbmRlcmVyLmRlc3Ryb3lOb2RlKSB7XG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLmRlc3Ryb3lOb2RlKGJhZGdlRWxlbWVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGVsZW1lbnQgaW50byB3aGljaCB0aGUgYmFkZ2UncyBjb250ZW50IGlzIGJlaW5nIHJlbmRlcmVkLlxuICAgKiBVbmRlZmluZWQgaWYgdGhlIGVsZW1lbnQgaGFzbid0IGJlZW4gY3JlYXRlZCAoZS5nLiBpZiB0aGUgYmFkZ2UgZG9lc24ndCBoYXZlIGNvbnRlbnQpLlxuICAgKi9cbiAgZ2V0QmFkZ2VFbGVtZW50KCk6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fYmFkZ2VFbGVtZW50O1xuICB9XG5cbiAgLyoqIEluamVjdHMgYSBzcGFuIGVsZW1lbnQgaW50byB0aGUgRE9NIHdpdGggdGhlIGNvbnRlbnQuICovXG4gIHByaXZhdGUgX3VwZGF0ZVRleHRDb250ZW50KCk6IEhUTUxTcGFuRWxlbWVudCB7XG4gICAgaWYgKCF0aGlzLl9iYWRnZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2JhZGdlRWxlbWVudCA9IHRoaXMuX2NyZWF0ZUJhZGdlRWxlbWVudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9iYWRnZUVsZW1lbnQudGV4dENvbnRlbnQgPSB0aGlzLmNvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9iYWRnZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogQ3JlYXRlcyB0aGUgYmFkZ2UgZWxlbWVudCAqL1xuICBwcml2YXRlIF9jcmVhdGVCYWRnZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGJhZGdlRWxlbWVudCA9IHRoaXMuX3JlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBhY3RpdmVDbGFzcyA9ICdtYXQtYmFkZ2UtYWN0aXZlJztcbiAgICBjb25zdCBjb250ZW50Q2xhc3MgPSAnbWF0LWJhZGdlLWNvbnRlbnQnO1xuXG4gICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIGJhZGdlcyB3aGljaCBtYXkgaGF2ZSBwZXJzaXN0ZWQgZnJvbSBhIHNlcnZlci1zaWRlIHJlbmRlci5cbiAgICB0aGlzLl9jbGVhckV4aXN0aW5nQmFkZ2VzKGNvbnRlbnRDbGFzcyk7XG4gICAgYmFkZ2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnaWQnLCBgbWF0LWJhZGdlLWNvbnRlbnQtJHt0aGlzLl9pZH1gKTtcbiAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChjb250ZW50Q2xhc3MpO1xuICAgIGJhZGdlRWxlbWVudC50ZXh0Q29udGVudCA9IHRoaXMuY29udGVudDtcblxuICAgIGlmICh0aGlzLl9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnX21hdC1hbmltYXRpb24tbm9vcGFibGUnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kZXNjcmlwdGlvbikge1xuICAgICAgYmFkZ2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIHRoaXMuZGVzY3JpcHRpb24pO1xuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZChiYWRnZUVsZW1lbnQpO1xuXG4gICAgLy8gYW5pbWF0ZSBpbiBhZnRlciBpbnNlcnRpb25cbiAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLl9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuICAgIH1cblxuICAgIHJldHVybiBiYWRnZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgYXJpYS1sYWJlbCBwcm9wZXJ0eSBvbiB0aGUgZWxlbWVudCAqL1xuICBwcml2YXRlIF91cGRhdGVIb3N0QXJpYURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcsIG9sZERlc2NyaXB0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBlbnN1cmUgY29udGVudCBhdmFpbGFibGUgYmVmb3JlIHNldHRpbmcgbGFiZWxcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5fdXBkYXRlVGV4dENvbnRlbnQoKTtcblxuICAgIGlmIChvbGREZXNjcmlwdGlvbikge1xuICAgICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbihjb250ZW50LCBvbGREZXNjcmlwdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKG5ld0Rlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLmRlc2NyaWJlKGNvbnRlbnQsIG5ld0Rlc2NyaXB0aW9uKTtcbiAgICB9XG4gIH1cblxuICAvKiogQWRkcyBjc3MgdGhlbWUgY2xhc3MgZ2l2ZW4gdGhlIGNvbG9yIHRvIHRoZSBjb21wb25lbnQgaG9zdCAqL1xuICBwcml2YXRlIF9zZXRDb2xvcihjb2xvclBhbGV0dGU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIGlmIChjb2xvclBhbGV0dGUgIT09IHRoaXMuX2NvbG9yKSB7XG4gICAgICBpZiAodGhpcy5fY29sb3IpIHtcbiAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoYG1hdC1iYWRnZS0ke3RoaXMuX2NvbG9yfWApO1xuICAgICAgfVxuICAgICAgaWYgKGNvbG9yUGFsZXR0ZSkge1xuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChgbWF0LWJhZGdlLSR7Y29sb3JQYWxldHRlfWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBDbGVhcnMgYW55IGV4aXN0aW5nIGJhZGdlcyB0aGF0IG1pZ2h0IGJlIGxlZnQgb3ZlciBmcm9tIHNlcnZlci1zaWRlIHJlbmRlcmluZy4gKi9cbiAgcHJpdmF0ZSBfY2xlYXJFeGlzdGluZ0JhZGdlcyhjc3NDbGFzczogc3RyaW5nKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBsZXQgY2hpbGRDb3VudCA9IGVsZW1lbnQuY2hpbGRyZW4ubGVuZ3RoO1xuXG4gICAgLy8gVXNlIGEgcmV2ZXJzZSB3aGlsZSwgYmVjYXVzZSB3ZSdsbCBiZSByZW1vdmluZyBlbGVtZW50cyBmcm9tIHRoZSBsaXN0IGFzIHdlJ3JlIGl0ZXJhdGluZy5cbiAgICB3aGlsZSAoY2hpbGRDb3VudC0tKSB7XG4gICAgICBjb25zdCBjdXJyZW50Q2hpbGQgPSBlbGVtZW50LmNoaWxkcmVuW2NoaWxkQ291bnRdO1xuXG4gICAgICBpZiAoY3VycmVudENoaWxkLmNsYXNzTGlzdC5jb250YWlucyhjc3NDbGFzcykpIHtcbiAgICAgICAgZWxlbWVudC5yZW1vdmVDaGlsZChjdXJyZW50Q2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9kaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGlkZGVuOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9vdmVybGFwOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=
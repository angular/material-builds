/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AriaDescriber, InteractivityChecker } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, inject, Inject, Input, NgZone, Optional, Renderer2, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
let nextId = 0;
// Boilerplate for applying mixins to MatBadge.
/** @docs-private */
const _MatBadgeBase = mixinDisabled(class {
});
const BADGE_CONTENT_CLASS = 'mat-badge-content';
/** Directive to display a text badge. */
export class MatBadge extends _MatBadgeBase {
    /** The color of the badge. Can be `primary`, `accent`, or `warn`. */
    get color() {
        return this._color;
    }
    set color(value) {
        this._setColor(value);
        this._color = value;
    }
    /** Whether the badge should overlap its contents or not */
    get overlap() {
        return this._overlap;
    }
    set overlap(val) {
        this._overlap = coerceBooleanProperty(val);
    }
    /** The content for the badge */
    get content() {
        return this._content;
    }
    set content(newContent) {
        this._updateRenderedContent(newContent);
    }
    /** Message used to describe the decorated element via aria-describedby */
    get description() {
        return this._description;
    }
    set description(newDescription) {
        this._updateDescription(newDescription);
    }
    /** Whether the badge is hidden. */
    get hidden() {
        return this._hidden;
    }
    set hidden(val) {
        this._hidden = coerceBooleanProperty(val);
    }
    constructor(_ngZone, _elementRef, _ariaDescriber, _renderer, _animationMode) {
        super();
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._ariaDescriber = _ariaDescriber;
        this._renderer = _renderer;
        this._animationMode = _animationMode;
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
        /** Whether the OnInit lifecycle hook has run yet */
        this._isInitialized = false;
        /** InteractivityChecker to determine if the badge host is focusable. */
        this._interactivityChecker = inject(InteractivityChecker);
        this._document = inject(DOCUMENT);
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            const nativeElement = _elementRef.nativeElement;
            if (nativeElement.nodeType !== nativeElement.ELEMENT_NODE) {
                throw Error('matBadge must be attached to an element node.');
            }
        }
    }
    /** Whether the badge is above the host or not */
    isAbove() {
        return this.position.indexOf('below') === -1;
    }
    /** Whether the badge is after the host or not */
    isAfter() {
        return this.position.indexOf('before') === -1;
    }
    /**
     * Gets the element into which the badge's content is being rendered. Undefined if the element
     * hasn't been created (e.g. if the badge doesn't have content).
     */
    getBadgeElement() {
        return this._badgeElement;
    }
    ngOnInit() {
        // We may have server-side rendered badge that we need to clear.
        // We need to do this in ngOnInit because the full content of the component
        // on which the badge is attached won't necessarily be in the DOM until this point.
        this._clearExistingBadges();
        if (this.content && !this._badgeElement) {
            this._badgeElement = this._createBadgeElement();
            this._updateRenderedContent(this.content);
        }
        this._isInitialized = true;
    }
    ngOnDestroy() {
        // ViewEngine only: when creating a badge through the Renderer, Angular remembers its index.
        // We have to destroy it ourselves, otherwise it'll be retained in memory.
        if (this._renderer.destroyNode) {
            this._renderer.destroyNode(this._badgeElement);
            this._inlineBadgeDescription?.remove();
        }
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
    }
    /** Gets whether the badge's host element is interactive. */
    _isHostInteractive() {
        // Ignore visibility since it requires an expensive style caluclation.
        return this._interactivityChecker.isFocusable(this._elementRef.nativeElement, {
            ignoreVisibility: true,
        });
    }
    /** Creates the badge element */
    _createBadgeElement() {
        const badgeElement = this._renderer.createElement('span');
        const activeClass = 'mat-badge-active';
        badgeElement.setAttribute('id', `mat-badge-content-${this._id}`);
        // The badge is aria-hidden because we don't want it to appear in the page's navigation
        // flow. Instead, we use the badge to describe the decorated element with aria-describedby.
        badgeElement.setAttribute('aria-hidden', 'true');
        badgeElement.classList.add(BADGE_CONTENT_CLASS);
        if (this._animationMode === 'NoopAnimations') {
            badgeElement.classList.add('_mat-animation-noopable');
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
    /** Update the text content of the badge element in the DOM, creating the element if necessary. */
    _updateRenderedContent(newContent) {
        const newContentNormalized = `${newContent ?? ''}`.trim();
        // Don't create the badge element if the directive isn't initialized because we want to
        // append the badge element to the *end* of the host element's content for backwards
        // compatibility.
        if (this._isInitialized && newContentNormalized && !this._badgeElement) {
            this._badgeElement = this._createBadgeElement();
        }
        if (this._badgeElement) {
            this._badgeElement.textContent = newContentNormalized;
        }
        this._content = newContentNormalized;
    }
    /** Updates the host element's aria description via AriaDescriber. */
    _updateDescription(newDescription) {
        // Always start by removing the aria-describedby; we will add a new one if necessary.
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
        // NOTE: We only check whether the host is interactive here, which happens during
        // when then badge content changes. It is possible that the host changes
        // interactivity status separate from one of these. However, watching the interactivity
        // status of the host would require a `MutationObserver`, which is likely more code + overhead
        // than it's worth; from usages inside Google, we see that the vats majority of badges either
        // never change interactivity, or also set `matBadgeHidden` based on the same condition.
        if (!newDescription || this._isHostInteractive()) {
            this._removeInlineDescription();
        }
        this._description = newDescription;
        // We don't add `aria-describedby` for non-interactive hosts elements because we
        // instead insert the description inline.
        if (this._isHostInteractive()) {
            this._ariaDescriber.describe(this._elementRef.nativeElement, newDescription);
        }
        else {
            this._updateInlineDescription();
        }
    }
    _updateInlineDescription() {
        // Create the inline description element if it doesn't exist
        if (!this._inlineBadgeDescription) {
            this._inlineBadgeDescription = this._document.createElement('span');
            this._inlineBadgeDescription.classList.add('cdk-visually-hidden');
        }
        this._inlineBadgeDescription.textContent = this.description;
        this._badgeElement?.appendChild(this._inlineBadgeDescription);
    }
    _removeInlineDescription() {
        this._inlineBadgeDescription?.remove();
        this._inlineBadgeDescription = undefined;
    }
    /** Adds css theme class given the color to the component host */
    _setColor(colorPalette) {
        const classList = this._elementRef.nativeElement.classList;
        classList.remove(`mat-badge-${this._color}`);
        if (colorPalette) {
            classList.add(`mat-badge-${colorPalette}`);
        }
    }
    /** Clears any existing badges that might be left over from server-side rendering. */
    _clearExistingBadges() {
        // Only check direct children of this host element in order to avoid deleting
        // any badges that might exist in descendant elements.
        const badges = this._elementRef.nativeElement.querySelectorAll(`:scope > .${BADGE_CONTENT_CLASS}`);
        for (const badgeElement of Array.from(badges)) {
            if (badgeElement !== this._badgeElement) {
                badgeElement.remove();
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatBadge, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i1.AriaDescriber }, { token: i0.Renderer2 }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.1", type: MatBadge, selector: "[matBadge]", inputs: { disabled: ["matBadgeDisabled", "disabled"], color: ["matBadgeColor", "color"], overlap: ["matBadgeOverlap", "overlap"], position: ["matBadgePosition", "position"], content: ["matBadge", "content"], description: ["matBadgeDescription", "description"], size: ["matBadgeSize", "size"], hidden: ["matBadgeHidden", "hidden"] }, host: { properties: { "class.mat-badge-overlap": "overlap", "class.mat-badge-above": "isAbove()", "class.mat-badge-below": "!isAbove()", "class.mat-badge-before": "!isAfter()", "class.mat-badge-after": "isAfter()", "class.mat-badge-small": "size === \"small\"", "class.mat-badge-medium": "size === \"medium\"", "class.mat-badge-large": "size === \"large\"", "class.mat-badge-hidden": "hidden || !content", "class.mat-badge-disabled": "disabled" }, classAttribute: "mat-badge" }, usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatBadge, decorators: [{
            type: Directive,
            args: [{
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
                        '[class.mat-badge-hidden]': 'hidden || !content',
                        '[class.mat-badge-disabled]': 'disabled',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i1.AriaDescriber }, { type: i0.Renderer2 }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { color: [{
                type: Input,
                args: ['matBadgeColor']
            }], overlap: [{
                type: Input,
                args: ['matBadgeOverlap']
            }], position: [{
                type: Input,
                args: ['matBadgePosition']
            }], content: [{
                type: Input,
                args: ['matBadge']
            }], description: [{
                type: Input,
                args: ['matBadgeDescription']
            }], size: [{
                type: Input,
                args: ['matBadgeSize']
            }], hidden: [{
                type: Input,
                args: ['matBadgeHidden']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYmFkZ2UvYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3RFLE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUNSLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQWEsYUFBYSxFQUFlLE1BQU0sd0JBQXdCLENBQUM7QUFDL0UsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7OztBQUUzRSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFZiwrQ0FBK0M7QUFDL0Msb0JBQW9CO0FBQ3BCLE1BQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQztDQUFRLENBQUMsQ0FBQztBQWdCOUMsTUFBTSxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztBQUVoRCx5Q0FBeUM7QUFrQnpDLE1BQU0sT0FBTyxRQUFTLFNBQVEsYUFBYTtJQUN6QyxxRUFBcUU7SUFDckUsSUFDSSxLQUFLO1FBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFDRCxJQUFJLEtBQUssQ0FBQyxLQUFtQjtRQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFHRCwyREFBMkQ7SUFDM0QsSUFDSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENB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a0I7d0JBQzdDLDBCQUEwQixFQUFFLG1CQUFtQjt3QkFDL0MseUJBQXlCLEVBQUUsa0JBQWtCO3dCQUM3QywwQkFBMEIsRUFBRSxvQkFBb0I7d0JBQ2hELDRCQUE0QixFQUFFLFVBQVU7cUJBQ3pDO2lCQUNGOzswQkFvRkksUUFBUTs7MEJBQUksTUFBTTsyQkFBQyxxQkFBcUI7NENBaEZ2QyxLQUFLO3NCQURSLEtBQUs7dUJBQUMsZUFBZTtnQkFZbEIsT0FBTztzQkFEVixLQUFLO3VCQUFDLGlCQUFpQjtnQkFhRyxRQUFRO3NCQUFsQyxLQUFLO3VCQUFDLGtCQUFrQjtnQkFJckIsT0FBTztzQkFEVixLQUFLO3VCQUFDLFVBQVU7Z0JBV2IsV0FBVztzQkFEZCxLQUFLO3VCQUFDLHFCQUFxQjtnQkFVTCxJQUFJO3NCQUExQixLQUFLO3VCQUFDLGNBQWM7Z0JBSWpCLE1BQU07c0JBRFQsS0FBSzt1QkFBQyxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtBcmlhRGVzY3JpYmVyLCBJbnRlcmFjdGl2aXR5Q2hlY2tlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIGluamVjdCxcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIFJlbmRlcmVyMixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkRpc2FibGUsIG1peGluRGlzYWJsZWQsIFRoZW1lUGFsZXR0ZX0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxubGV0IG5leHRJZCA9IDA7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0QmFkZ2UuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdEJhZGdlQmFzZSA9IG1peGluRGlzYWJsZWQoY2xhc3Mge30pO1xuXG4vKiogQWxsb3dlZCBwb3NpdGlvbiBvcHRpb25zIGZvciBtYXRCYWRnZVBvc2l0aW9uICovXG5leHBvcnQgdHlwZSBNYXRCYWRnZVBvc2l0aW9uID1cbiAgfCAnYWJvdmUgYWZ0ZXInXG4gIHwgJ2Fib3ZlIGJlZm9yZSdcbiAgfCAnYmVsb3cgYmVmb3JlJ1xuICB8ICdiZWxvdyBhZnRlcidcbiAgfCAnYmVmb3JlJ1xuICB8ICdhZnRlcidcbiAgfCAnYWJvdmUnXG4gIHwgJ2JlbG93JztcblxuLyoqIEFsbG93ZWQgc2l6ZSBvcHRpb25zIGZvciBtYXRCYWRnZVNpemUgKi9cbmV4cG9ydCB0eXBlIE1hdEJhZGdlU2l6ZSA9ICdzbWFsbCcgfCAnbWVkaXVtJyB8ICdsYXJnZSc7XG5cbmNvbnN0IEJBREdFX0NPTlRFTlRfQ0xBU1MgPSAnbWF0LWJhZGdlLWNvbnRlbnQnO1xuXG4vKiogRGlyZWN0aXZlIHRvIGRpc3BsYXkgYSB0ZXh0IGJhZGdlLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdEJhZGdlXScsXG4gIGlucHV0czogWydkaXNhYmxlZDogbWF0QmFkZ2VEaXNhYmxlZCddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1iYWRnZScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2Utb3ZlcmxhcF0nOiAnb3ZlcmxhcCcsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYWJvdmVdJzogJ2lzQWJvdmUoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYmVsb3ddJzogJyFpc0Fib3ZlKCknLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWJlZm9yZV0nOiAnIWlzQWZ0ZXIoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYWZ0ZXJdJzogJ2lzQWZ0ZXIoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2Utc21hbGxdJzogJ3NpemUgPT09IFwic21hbGxcIicsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtbWVkaXVtXSc6ICdzaXplID09PSBcIm1lZGl1bVwiJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1sYXJnZV0nOiAnc2l6ZSA9PT0gXCJsYXJnZVwiJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1oaWRkZW5dJzogJ2hpZGRlbiB8fCAhY29udGVudCcsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QmFkZ2UgZXh0ZW5kcyBfTWF0QmFkZ2VCYXNlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIENhbkRpc2FibGUge1xuICAvKiogVGhlIGNvbG9yIG9mIHRoZSBiYWRnZS4gQ2FuIGJlIGBwcmltYXJ5YCwgYGFjY2VudGAsIG9yIGB3YXJuYC4gKi9cbiAgQElucHV0KCdtYXRCYWRnZUNvbG9yJylcbiAgZ2V0IGNvbG9yKCk6IFRoZW1lUGFsZXR0ZSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xuICB9XG4gIHNldCBjb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgdGhpcy5fc2V0Q29sb3IodmFsdWUpO1xuICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfY29sb3I6IFRoZW1lUGFsZXR0ZSA9ICdwcmltYXJ5JztcblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2Ugc2hvdWxkIG92ZXJsYXAgaXRzIGNvbnRlbnRzIG9yIG5vdCAqL1xuICBASW5wdXQoJ21hdEJhZGdlT3ZlcmxhcCcpXG4gIGdldCBvdmVybGFwKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9vdmVybGFwO1xuICB9XG4gIHNldCBvdmVybGFwKHZhbDogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fb3ZlcmxhcCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpO1xuICB9XG4gIHByaXZhdGUgX292ZXJsYXA6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbiB0aGUgYmFkZ2Ugc2hvdWxkIHJlc2lkZS5cbiAgICogQWNjZXB0cyBhbnkgY29tYmluYXRpb24gb2YgJ2Fib3ZlJ3wnYmVsb3cnIGFuZCAnYmVmb3JlJ3wnYWZ0ZXInXG4gICAqL1xuICBASW5wdXQoJ21hdEJhZGdlUG9zaXRpb24nKSBwb3NpdGlvbjogTWF0QmFkZ2VQb3NpdGlvbiA9ICdhYm92ZSBhZnRlcic7XG5cbiAgLyoqIFRoZSBjb250ZW50IGZvciB0aGUgYmFkZ2UgKi9cbiAgQElucHV0KCdtYXRCYWRnZScpXG4gIGdldCBjb250ZW50KCk6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9jb250ZW50O1xuICB9XG4gIHNldCBjb250ZW50KG5ld0NvbnRlbnQ6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwpIHtcbiAgICB0aGlzLl91cGRhdGVSZW5kZXJlZENvbnRlbnQobmV3Q29udGVudCk7XG4gIH1cbiAgcHJpdmF0ZSBfY29udGVudDogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkIHwgbnVsbDtcblxuICAvKiogTWVzc2FnZSB1c2VkIHRvIGRlc2NyaWJlIHRoZSBkZWNvcmF0ZWQgZWxlbWVudCB2aWEgYXJpYS1kZXNjcmliZWRieSAqL1xuICBASW5wdXQoJ21hdEJhZGdlRGVzY3JpcHRpb24nKVxuICBnZXQgZGVzY3JpcHRpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZGVzY3JpcHRpb247XG4gIH1cbiAgc2V0IGRlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcpIHtcbiAgICB0aGlzLl91cGRhdGVEZXNjcmlwdGlvbihuZXdEZXNjcmlwdGlvbik7XG4gIH1cbiAgcHJpdmF0ZSBfZGVzY3JpcHRpb246IHN0cmluZztcblxuICAvKiogU2l6ZSBvZiB0aGUgYmFkZ2UuIENhbiBiZSAnc21hbGwnLCAnbWVkaXVtJywgb3IgJ2xhcmdlJy4gKi9cbiAgQElucHV0KCdtYXRCYWRnZVNpemUnKSBzaXplOiBNYXRCYWRnZVNpemUgPSAnbWVkaXVtJztcblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaXMgaGlkZGVuLiAqL1xuICBASW5wdXQoJ21hdEJhZGdlSGlkZGVuJylcbiAgZ2V0IGhpZGRlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZGVuO1xuICB9XG4gIHNldCBoaWRkZW4odmFsOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9oaWRkZW4gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsKTtcbiAgfVxuICBwcml2YXRlIF9oaWRkZW46IGJvb2xlYW47XG5cbiAgLyoqIFVuaXF1ZSBpZCBmb3IgdGhlIGJhZGdlICovXG4gIF9pZDogbnVtYmVyID0gbmV4dElkKys7XG5cbiAgLyoqIFZpc2libGUgYmFkZ2UgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfYmFkZ2VFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAvKiogSW5saW5lIGJhZGdlIGRlc2NyaXB0aW9uLiBVc2VkIHdoZW4gdGhlIGJhZGdlIGlzIGFwcGxpZWQgdG8gbm9uLWludGVyYWN0aXZlIGhvc3QgZWxlbWVudHMuICovXG4gIHByaXZhdGUgX2lubGluZUJhZGdlRGVzY3JpcHRpb246IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBPbkluaXQgbGlmZWN5Y2xlIGhvb2sgaGFzIHJ1biB5ZXQgKi9cbiAgcHJpdmF0ZSBfaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gIC8qKiBJbnRlcmFjdGl2aXR5Q2hlY2tlciB0byBkZXRlcm1pbmUgaWYgdGhlIGJhZGdlIGhvc3QgaXMgZm9jdXNhYmxlLiAqL1xuICBwcml2YXRlIF9pbnRlcmFjdGl2aXR5Q2hlY2tlciA9IGluamVjdChJbnRlcmFjdGl2aXR5Q2hlY2tlcik7XG5cbiAgcHJpdmF0ZSBfZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByaXZhdGUgX2FyaWFEZXNjcmliZXI6IEFyaWFEZXNjcmliZXIsXG4gICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgaWYgKG5hdGl2ZUVsZW1lbnQubm9kZVR5cGUgIT09IG5hdGl2ZUVsZW1lbnQuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdtYXRCYWRnZSBtdXN0IGJlIGF0dGFjaGVkIHRvIGFuIGVsZW1lbnQgbm9kZS4nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaXMgYWJvdmUgdGhlIGhvc3Qgb3Igbm90ICovXG4gIGlzQWJvdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24uaW5kZXhPZignYmVsb3cnKSA9PT0gLTE7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2UgaXMgYWZ0ZXIgdGhlIGhvc3Qgb3Igbm90ICovXG4gIGlzQWZ0ZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMucG9zaXRpb24uaW5kZXhPZignYmVmb3JlJykgPT09IC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGVsZW1lbnQgaW50byB3aGljaCB0aGUgYmFkZ2UncyBjb250ZW50IGlzIGJlaW5nIHJlbmRlcmVkLiBVbmRlZmluZWQgaWYgdGhlIGVsZW1lbnRcbiAgICogaGFzbid0IGJlZW4gY3JlYXRlZCAoZS5nLiBpZiB0aGUgYmFkZ2UgZG9lc24ndCBoYXZlIGNvbnRlbnQpLlxuICAgKi9cbiAgZ2V0QmFkZ2VFbGVtZW50KCk6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5fYmFkZ2VFbGVtZW50O1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gV2UgbWF5IGhhdmUgc2VydmVyLXNpZGUgcmVuZGVyZWQgYmFkZ2UgdGhhdCB3ZSBuZWVkIHRvIGNsZWFyLlxuICAgIC8vIFdlIG5lZWQgdG8gZG8gdGhpcyBpbiBuZ09uSW5pdCBiZWNhdXNlIHRoZSBmdWxsIGNvbnRlbnQgb2YgdGhlIGNvbXBvbmVudFxuICAgIC8vIG9uIHdoaWNoIHRoZSBiYWRnZSBpcyBhdHRhY2hlZCB3b24ndCBuZWNlc3NhcmlseSBiZSBpbiB0aGUgRE9NIHVudGlsIHRoaXMgcG9pbnQuXG4gICAgdGhpcy5fY2xlYXJFeGlzdGluZ0JhZGdlcygpO1xuXG4gICAgaWYgKHRoaXMuY29udGVudCAmJiAhdGhpcy5fYmFkZ2VFbGVtZW50KSB7XG4gICAgICB0aGlzLl9iYWRnZUVsZW1lbnQgPSB0aGlzLl9jcmVhdGVCYWRnZUVsZW1lbnQoKTtcbiAgICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmVkQ29udGVudCh0aGlzLmNvbnRlbnQpO1xuICAgIH1cblxuICAgIHRoaXMuX2lzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgLy8gVmlld0VuZ2luZSBvbmx5OiB3aGVuIGNyZWF0aW5nIGEgYmFkZ2UgdGhyb3VnaCB0aGUgUmVuZGVyZXIsIEFuZ3VsYXIgcmVtZW1iZXJzIGl0cyBpbmRleC5cbiAgICAvLyBXZSBoYXZlIHRvIGRlc3Ryb3kgaXQgb3Vyc2VsdmVzLCBvdGhlcndpc2UgaXQnbGwgYmUgcmV0YWluZWQgaW4gbWVtb3J5LlxuICAgIGlmICh0aGlzLl9yZW5kZXJlci5kZXN0cm95Tm9kZSkge1xuICAgICAgdGhpcy5fcmVuZGVyZXIuZGVzdHJveU5vZGUodGhpcy5fYmFkZ2VFbGVtZW50KTtcbiAgICAgIHRoaXMuX2lubGluZUJhZGdlRGVzY3JpcHRpb24/LnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2FyaWFEZXNjcmliZXIucmVtb3ZlRGVzY3JpcHRpb24odGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLmRlc2NyaXB0aW9uKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGJhZGdlJ3MgaG9zdCBlbGVtZW50IGlzIGludGVyYWN0aXZlLiAqL1xuICBwcml2YXRlIF9pc0hvc3RJbnRlcmFjdGl2ZSgpOiBib29sZWFuIHtcbiAgICAvLyBJZ25vcmUgdmlzaWJpbGl0eSBzaW5jZSBpdCByZXF1aXJlcyBhbiBleHBlbnNpdmUgc3R5bGUgY2FsdWNsYXRpb24uXG4gICAgcmV0dXJuIHRoaXMuX2ludGVyYWN0aXZpdHlDaGVja2VyLmlzRm9jdXNhYmxlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwge1xuICAgICAgaWdub3JlVmlzaWJpbGl0eTogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIHRoZSBiYWRnZSBlbGVtZW50ICovXG4gIHByaXZhdGUgX2NyZWF0ZUJhZGdlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgYmFkZ2VFbGVtZW50ID0gdGhpcy5fcmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGFjdGl2ZUNsYXNzID0gJ21hdC1iYWRnZS1hY3RpdmUnO1xuXG4gICAgYmFkZ2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnaWQnLCBgbWF0LWJhZGdlLWNvbnRlbnQtJHt0aGlzLl9pZH1gKTtcblxuICAgIC8vIFRoZSBiYWRnZSBpcyBhcmlhLWhpZGRlbiBiZWNhdXNlIHdlIGRvbid0IHdhbnQgaXQgdG8gYXBwZWFyIGluIHRoZSBwYWdlJ3MgbmF2aWdhdGlvblxuICAgIC8vIGZsb3cuIEluc3RlYWQsIHdlIHVzZSB0aGUgYmFkZ2UgdG8gZGVzY3JpYmUgdGhlIGRlY29yYXRlZCBlbGVtZW50IHdpdGggYXJpYS1kZXNjcmliZWRieS5cbiAgICBiYWRnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoQkFER0VfQ09OVEVOVF9DTEFTUyk7XG5cbiAgICBpZiAodGhpcy5fYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ19tYXQtYW5pbWF0aW9uLW5vb3BhYmxlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKGJhZGdlRWxlbWVudCk7XG5cbiAgICAvLyBhbmltYXRlIGluIGFmdGVyIGluc2VydGlvblxuICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nICYmIHRoaXMuX2FuaW1hdGlvbk1vZGUgIT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhZGdlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBVcGRhdGUgdGhlIHRleHQgY29udGVudCBvZiB0aGUgYmFkZ2UgZWxlbWVudCBpbiB0aGUgRE9NLCBjcmVhdGluZyB0aGUgZWxlbWVudCBpZiBuZWNlc3NhcnkuICovXG4gIHByaXZhdGUgX3VwZGF0ZVJlbmRlcmVkQ29udGVudChuZXdDb250ZW50OiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgfCBudWxsKTogdm9pZCB7XG4gICAgY29uc3QgbmV3Q29udGVudE5vcm1hbGl6ZWQ6IHN0cmluZyA9IGAke25ld0NvbnRlbnQgPz8gJyd9YC50cmltKCk7XG5cbiAgICAvLyBEb24ndCBjcmVhdGUgdGhlIGJhZGdlIGVsZW1lbnQgaWYgdGhlIGRpcmVjdGl2ZSBpc24ndCBpbml0aWFsaXplZCBiZWNhdXNlIHdlIHdhbnQgdG9cbiAgICAvLyBhcHBlbmQgdGhlIGJhZGdlIGVsZW1lbnQgdG8gdGhlICplbmQqIG9mIHRoZSBob3N0IGVsZW1lbnQncyBjb250ZW50IGZvciBiYWNrd2FyZHNcbiAgICAvLyBjb21wYXRpYmlsaXR5LlxuICAgIGlmICh0aGlzLl9pc0luaXRpYWxpemVkICYmIG5ld0NvbnRlbnROb3JtYWxpemVkICYmICF0aGlzLl9iYWRnZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2JhZGdlRWxlbWVudCA9IHRoaXMuX2NyZWF0ZUJhZGdlRWxlbWVudCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9iYWRnZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2JhZGdlRWxlbWVudC50ZXh0Q29udGVudCA9IG5ld0NvbnRlbnROb3JtYWxpemVkO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbnRlbnQgPSBuZXdDb250ZW50Tm9ybWFsaXplZDtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBob3N0IGVsZW1lbnQncyBhcmlhIGRlc2NyaXB0aW9uIHZpYSBBcmlhRGVzY3JpYmVyLiAqL1xuICBwcml2YXRlIF91cGRhdGVEZXNjcmlwdGlvbihuZXdEZXNjcmlwdGlvbjogc3RyaW5nKTogdm9pZCB7XG4gICAgLy8gQWx3YXlzIHN0YXJ0IGJ5IHJlbW92aW5nIHRoZSBhcmlhLWRlc2NyaWJlZGJ5OyB3ZSB3aWxsIGFkZCBhIG5ldyBvbmUgaWYgbmVjZXNzYXJ5LlxuICAgIHRoaXMuX2FyaWFEZXNjcmliZXIucmVtb3ZlRGVzY3JpcHRpb24odGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLmRlc2NyaXB0aW9uKTtcblxuICAgIC8vIE5PVEU6IFdlIG9ubHkgY2hlY2sgd2hldGhlciB0aGUgaG9zdCBpcyBpbnRlcmFjdGl2ZSBoZXJlLCB3aGljaCBoYXBwZW5zIGR1cmluZ1xuICAgIC8vIHdoZW4gdGhlbiBiYWRnZSBjb250ZW50IGNoYW5nZXMuIEl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIGhvc3QgY2hhbmdlc1xuICAgIC8vIGludGVyYWN0aXZpdHkgc3RhdHVzIHNlcGFyYXRlIGZyb20gb25lIG9mIHRoZXNlLiBIb3dldmVyLCB3YXRjaGluZyB0aGUgaW50ZXJhY3Rpdml0eVxuICAgIC8vIHN0YXR1cyBvZiB0aGUgaG9zdCB3b3VsZCByZXF1aXJlIGEgYE11dGF0aW9uT2JzZXJ2ZXJgLCB3aGljaCBpcyBsaWtlbHkgbW9yZSBjb2RlICsgb3ZlcmhlYWRcbiAgICAvLyB0aGFuIGl0J3Mgd29ydGg7IGZyb20gdXNhZ2VzIGluc2lkZSBHb29nbGUsIHdlIHNlZSB0aGF0IHRoZSB2YXRzIG1ham9yaXR5IG9mIGJhZGdlcyBlaXRoZXJcbiAgICAvLyBuZXZlciBjaGFuZ2UgaW50ZXJhY3Rpdml0eSwgb3IgYWxzbyBzZXQgYG1hdEJhZGdlSGlkZGVuYCBiYXNlZCBvbiB0aGUgc2FtZSBjb25kaXRpb24uXG5cbiAgICBpZiAoIW5ld0Rlc2NyaXB0aW9uIHx8IHRoaXMuX2lzSG9zdEludGVyYWN0aXZlKCkpIHtcbiAgICAgIHRoaXMuX3JlbW92ZUlubGluZURlc2NyaXB0aW9uKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fZGVzY3JpcHRpb24gPSBuZXdEZXNjcmlwdGlvbjtcblxuICAgIC8vIFdlIGRvbid0IGFkZCBgYXJpYS1kZXNjcmliZWRieWAgZm9yIG5vbi1pbnRlcmFjdGl2ZSBob3N0cyBlbGVtZW50cyBiZWNhdXNlIHdlXG4gICAgLy8gaW5zdGVhZCBpbnNlcnQgdGhlIGRlc2NyaXB0aW9uIGlubGluZS5cbiAgICBpZiAodGhpcy5faXNIb3N0SW50ZXJhY3RpdmUoKSkge1xuICAgICAgdGhpcy5fYXJpYURlc2NyaWJlci5kZXNjcmliZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIG5ld0Rlc2NyaXB0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdXBkYXRlSW5saW5lRGVzY3JpcHRpb24oKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVJbmxpbmVEZXNjcmlwdGlvbigpIHtcbiAgICAvLyBDcmVhdGUgdGhlIGlubGluZSBkZXNjcmlwdGlvbiBlbGVtZW50IGlmIGl0IGRvZXNuJ3QgZXhpc3RcbiAgICBpZiAoIXRoaXMuX2lubGluZUJhZGdlRGVzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2lubGluZUJhZGdlRGVzY3JpcHRpb24gPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICB0aGlzLl9pbmxpbmVCYWRnZURlc2NyaXB0aW9uLmNsYXNzTGlzdC5hZGQoJ2Nkay12aXN1YWxseS1oaWRkZW4nKTtcbiAgICB9XG5cbiAgICB0aGlzLl9pbmxpbmVCYWRnZURlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gdGhpcy5kZXNjcmlwdGlvbjtcbiAgICB0aGlzLl9iYWRnZUVsZW1lbnQ/LmFwcGVuZENoaWxkKHRoaXMuX2lubGluZUJhZGdlRGVzY3JpcHRpb24pO1xuICB9XG5cbiAgcHJpdmF0ZSBfcmVtb3ZlSW5saW5lRGVzY3JpcHRpb24oKSB7XG4gICAgdGhpcy5faW5saW5lQmFkZ2VEZXNjcmlwdGlvbj8ucmVtb3ZlKCk7XG4gICAgdGhpcy5faW5saW5lQmFkZ2VEZXNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKiBBZGRzIGNzcyB0aGVtZSBjbGFzcyBnaXZlbiB0aGUgY29sb3IgdG8gdGhlIGNvbXBvbmVudCBob3N0ICovXG4gIHByaXZhdGUgX3NldENvbG9yKGNvbG9yUGFsZXR0ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdDtcbiAgICBjbGFzc0xpc3QucmVtb3ZlKGBtYXQtYmFkZ2UtJHt0aGlzLl9jb2xvcn1gKTtcbiAgICBpZiAoY29sb3JQYWxldHRlKSB7XG4gICAgICBjbGFzc0xpc3QuYWRkKGBtYXQtYmFkZ2UtJHtjb2xvclBhbGV0dGV9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENsZWFycyBhbnkgZXhpc3RpbmcgYmFkZ2VzIHRoYXQgbWlnaHQgYmUgbGVmdCBvdmVyIGZyb20gc2VydmVyLXNpZGUgcmVuZGVyaW5nLiAqL1xuICBwcml2YXRlIF9jbGVhckV4aXN0aW5nQmFkZ2VzKCkge1xuICAgIC8vIE9ubHkgY2hlY2sgZGlyZWN0IGNoaWxkcmVuIG9mIHRoaXMgaG9zdCBlbGVtZW50IGluIG9yZGVyIHRvIGF2b2lkIGRlbGV0aW5nXG4gICAgLy8gYW55IGJhZGdlcyB0aGF0IG1pZ2h0IGV4aXN0IGluIGRlc2NlbmRhbnQgZWxlbWVudHMuXG4gICAgY29uc3QgYmFkZ2VzID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICBgOnNjb3BlID4gLiR7QkFER0VfQ09OVEVOVF9DTEFTU31gLFxuICAgICk7XG4gICAgZm9yIChjb25zdCBiYWRnZUVsZW1lbnQgb2YgQXJyYXkuZnJvbShiYWRnZXMpKSB7XG4gICAgICBpZiAoYmFkZ2VFbGVtZW50ICE9PSB0aGlzLl9iYWRnZUVsZW1lbnQpIHtcbiAgICAgICAgYmFkZ2VFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19
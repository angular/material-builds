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
class MatBadge extends _MatBadgeBase {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatBadge, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i1.AriaDescriber }, { token: i0.Renderer2 }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatBadge, selector: "[matBadge]", inputs: { disabled: ["matBadgeDisabled", "disabled"], color: ["matBadgeColor", "color"], overlap: ["matBadgeOverlap", "overlap"], position: ["matBadgePosition", "position"], content: ["matBadge", "content"], description: ["matBadgeDescription", "description"], size: ["matBadgeSize", "size"], hidden: ["matBadgeHidden", "hidden"] }, host: { properties: { "class.mat-badge-overlap": "overlap", "class.mat-badge-above": "isAbove()", "class.mat-badge-below": "!isAbove()", "class.mat-badge-before": "!isAfter()", "class.mat-badge-after": "isAfter()", "class.mat-badge-small": "size === \"small\"", "class.mat-badge-medium": "size === \"medium\"", "class.mat-badge-large": "size === \"large\"", "class.mat-badge-hidden": "hidden || !content", "class.mat-badge-disabled": "disabled" }, classAttribute: "mat-badge" }, usesInheritance: true, ngImport: i0 }); }
}
export { MatBadge };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatBadge, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYmFkZ2UvYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3RFLE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUNSLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQWEsYUFBYSxFQUFlLE1BQU0sd0JBQXdCLENBQUM7QUFDL0UsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7OztBQUUzRSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFFZiwrQ0FBK0M7QUFDL0Msb0JBQW9CO0FBQ3BCLE1BQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQztDQUFRLENBQUMsQ0FBQztBQWdCOUMsTUFBTSxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztBQUVoRCx5Q0FBeUM7QUFDekMsTUFpQmEsUUFBUyxTQUFRLGFBQWE7SUFDekMscUVBQXFFO0lBQ3JFLElBQ0ksS0FBSztRQUNQLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBQ0QsSUFBSSxLQUFLLENBQUMsS0FBbUI7UUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDO0lBR0QsMkRBQTJEO0lBQzNELElBQ0ksT0FBTztRQUNULE9BQU8sSUFBSSxDQUFDLFFB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LGtCQUFrQjt3QkFDN0MsMEJBQTBCLEVBQUUsbUJBQW1CO3dCQUMvQyx5QkFBeUIsRUFBRSxrQkFBa0I7d0JBQzdDLDBCQUEwQixFQUFFLG9CQUFvQjt3QkFDaEQsNEJBQTRCLEVBQUUsVUFBVTtxQkFDekM7aUJBQ0Y7OzBCQW9GSSxRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQjs0Q0FoRnZDLEtBQUs7c0JBRFIsS0FBSzt1QkFBQyxlQUFlO2dCQVlsQixPQUFPO3NCQURWLEtBQUs7dUJBQUMsaUJBQWlCO2dCQWFHLFFBQVE7c0JBQWxDLEtBQUs7dUJBQUMsa0JBQWtCO2dCQUlyQixPQUFPO3NCQURWLEtBQUs7dUJBQUMsVUFBVTtnQkFXYixXQUFXO3NCQURkLEtBQUs7dUJBQUMscUJBQXFCO2dCQVVMLElBQUk7c0JBQTFCLEtBQUs7dUJBQUMsY0FBYztnQkFJakIsTUFBTTtzQkFEVCxLQUFLO3VCQUFDLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FyaWFEZXNjcmliZXIsIEludGVyYWN0aXZpdHlDaGVja2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgaW5qZWN0LFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgUmVuZGVyZXIyLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q2FuRGlzYWJsZSwgbWl4aW5EaXNhYmxlZCwgVGhlbWVQYWxldHRlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuXG5sZXQgbmV4dElkID0gMDtcblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRCYWRnZS5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0QmFkZ2VCYXNlID0gbWl4aW5EaXNhYmxlZChjbGFzcyB7fSk7XG5cbi8qKiBBbGxvd2VkIHBvc2l0aW9uIG9wdGlvbnMgZm9yIG1hdEJhZGdlUG9zaXRpb24gKi9cbmV4cG9ydCB0eXBlIE1hdEJhZGdlUG9zaXRpb24gPVxuICB8ICdhYm92ZSBhZnRlcidcbiAgfCAnYWJvdmUgYmVmb3JlJ1xuICB8ICdiZWxvdyBiZWZvcmUnXG4gIHwgJ2JlbG93IGFmdGVyJ1xuICB8ICdiZWZvcmUnXG4gIHwgJ2FmdGVyJ1xuICB8ICdhYm92ZSdcbiAgfCAnYmVsb3cnO1xuXG4vKiogQWxsb3dlZCBzaXplIG9wdGlvbnMgZm9yIG1hdEJhZGdlU2l6ZSAqL1xuZXhwb3J0IHR5cGUgTWF0QmFkZ2VTaXplID0gJ3NtYWxsJyB8ICdtZWRpdW0nIHwgJ2xhcmdlJztcblxuY29uc3QgQkFER0VfQ09OVEVOVF9DTEFTUyA9ICdtYXQtYmFkZ2UtY29udGVudCc7XG5cbi8qKiBEaXJlY3RpdmUgdG8gZGlzcGxheSBhIHRleHQgYmFkZ2UuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0QmFkZ2VdJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkOiBtYXRCYWRnZURpc2FibGVkJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWJhZGdlJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1vdmVybGFwXSc6ICdvdmVybGFwJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1hYm92ZV0nOiAnaXNBYm92ZSgpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1iZWxvd10nOiAnIWlzQWJvdmUoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYmVmb3JlXSc6ICchaXNBZnRlcigpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1hZnRlcl0nOiAnaXNBZnRlcigpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1zbWFsbF0nOiAnc2l6ZSA9PT0gXCJzbWFsbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1tZWRpdW1dJzogJ3NpemUgPT09IFwibWVkaXVtXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWxhcmdlXSc6ICdzaXplID09PSBcImxhcmdlXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWhpZGRlbl0nOiAnaGlkZGVuIHx8ICFjb250ZW50JyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCYWRnZSBleHRlbmRzIF9NYXRCYWRnZUJhc2UgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQ2FuRGlzYWJsZSB7XG4gIC8qKiBUaGUgY29sb3Igb2YgdGhlIGJhZGdlLiBDYW4gYmUgYHByaW1hcnlgLCBgYWNjZW50YCwgb3IgYHdhcm5gLiAqL1xuICBASW5wdXQoJ21hdEJhZGdlQ29sb3InKVxuICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5fY29sb3I7XG4gIH1cbiAgc2V0IGNvbG9yKHZhbHVlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICB0aGlzLl9zZXRDb2xvcih2YWx1ZSk7XG4gICAgdGhpcy5fY29sb3IgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9jb2xvcjogVGhlbWVQYWxldHRlID0gJ3ByaW1hcnknO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBzaG91bGQgb3ZlcmxhcCBpdHMgY29udGVudHMgb3Igbm90ICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VPdmVybGFwJylcbiAgZ2V0IG92ZXJsYXAoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX292ZXJsYXA7XG4gIH1cbiAgc2V0IG92ZXJsYXAodmFsOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9vdmVybGFwID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbCk7XG4gIH1cbiAgcHJpdmF0ZSBfb3ZlcmxhcDogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIHRoZSBiYWRnZSBzaG91bGQgcmVzaWRlLlxuICAgKiBBY2NlcHRzIGFueSBjb21iaW5hdGlvbiBvZiAnYWJvdmUnfCdiZWxvdycgYW5kICdiZWZvcmUnfCdhZnRlcidcbiAgICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VQb3NpdGlvbicpIHBvc2l0aW9uOiBNYXRCYWRnZVBvc2l0aW9uID0gJ2Fib3ZlIGFmdGVyJztcblxuICAvKiogVGhlIGNvbnRlbnQgZm9yIHRoZSBiYWRnZSAqL1xuICBASW5wdXQoJ21hdEJhZGdlJylcbiAgZ2V0IGNvbnRlbnQoKTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnQ7XG4gIH1cbiAgc2V0IGNvbnRlbnQobmV3Q29udGVudDogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkIHwgbnVsbCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmVkQ29udGVudChuZXdDb250ZW50KTtcbiAgfVxuICBwcml2YXRlIF9jb250ZW50OiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgfCBudWxsO1xuXG4gIC8qKiBNZXNzYWdlIHVzZWQgdG8gZGVzY3JpYmUgdGhlIGRlY29yYXRlZCBlbGVtZW50IHZpYSBhcmlhLWRlc2NyaWJlZGJ5ICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VEZXNjcmlwdGlvbicpXG4gIGdldCBkZXNjcmlwdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9kZXNjcmlwdGlvbjtcbiAgfVxuICBzZXQgZGVzY3JpcHRpb24obmV3RGVzY3JpcHRpb246IHN0cmluZykge1xuICAgIHRoaXMuX3VwZGF0ZURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uKTtcbiAgfVxuICBwcml2YXRlIF9kZXNjcmlwdGlvbjogc3RyaW5nO1xuXG4gIC8qKiBTaXplIG9mIHRoZSBiYWRnZS4gQ2FuIGJlICdzbWFsbCcsICdtZWRpdW0nLCBvciAnbGFyZ2UnLiAqL1xuICBASW5wdXQoJ21hdEJhZGdlU2l6ZScpIHNpemU6IE1hdEJhZGdlU2l6ZSA9ICdtZWRpdW0nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBpcyBoaWRkZW4uICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VIaWRkZW4nKVxuICBnZXQgaGlkZGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9oaWRkZW47XG4gIH1cbiAgc2V0IGhpZGRlbih2YWw6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2hpZGRlbiA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWwpO1xuICB9XG4gIHByaXZhdGUgX2hpZGRlbjogYm9vbGVhbjtcblxuICAvKiogVW5pcXVlIGlkIGZvciB0aGUgYmFkZ2UgKi9cbiAgX2lkOiBudW1iZXIgPSBuZXh0SWQrKztcblxuICAvKiogVmlzaWJsZSBiYWRnZSBlbGVtZW50LiAqL1xuICBwcml2YXRlIF9iYWRnZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBJbmxpbmUgYmFkZ2UgZGVzY3JpcHRpb24uIFVzZWQgd2hlbiB0aGUgYmFkZ2UgaXMgYXBwbGllZCB0byBub24taW50ZXJhY3RpdmUgaG9zdCBlbGVtZW50cy4gKi9cbiAgcHJpdmF0ZSBfaW5saW5lQmFkZ2VEZXNjcmlwdGlvbjogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIE9uSW5pdCBsaWZlY3ljbGUgaG9vayBoYXMgcnVuIHlldCAqL1xuICBwcml2YXRlIF9pc0luaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgLyoqIEludGVyYWN0aXZpdHlDaGVja2VyIHRvIGRldGVybWluZSBpZiB0aGUgYmFkZ2UgaG9zdCBpcyBmb2N1c2FibGUuICovXG4gIHByaXZhdGUgX2ludGVyYWN0aXZpdHlDaGVja2VyID0gaW5qZWN0KEludGVyYWN0aXZpdHlDaGVja2VyKTtcblxuICBwcml2YXRlIF9kb2N1bWVudCA9IGluamVjdChET0NVTUVOVCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJpdmF0ZSBfYXJpYURlc2NyaWJlcjogQXJpYURlc2NyaWJlcixcbiAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwcml2YXRlIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgY29uc3QgbmF0aXZlRWxlbWVudCA9IF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBpZiAobmF0aXZlRWxlbWVudC5ub2RlVHlwZSAhPT0gbmF0aXZlRWxlbWVudC5FTEVNRU5UX05PREUpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ21hdEJhZGdlIG11c3QgYmUgYXR0YWNoZWQgdG8gYW4gZWxlbWVudCBub2RlLicpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBpcyBhYm92ZSB0aGUgaG9zdCBvciBub3QgKi9cbiAgaXNBYm92ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi5pbmRleE9mKCdiZWxvdycpID09PSAtMTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBpcyBhZnRlciB0aGUgaG9zdCBvciBub3QgKi9cbiAgaXNBZnRlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi5pbmRleE9mKCdiZWZvcmUnKSA9PT0gLTE7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZWxlbWVudCBpbnRvIHdoaWNoIHRoZSBiYWRnZSdzIGNvbnRlbnQgaXMgYmVpbmcgcmVuZGVyZWQuIFVuZGVmaW5lZCBpZiB0aGUgZWxlbWVudFxuICAgKiBoYXNuJ3QgYmVlbiBjcmVhdGVkIChlLmcuIGlmIHRoZSBiYWRnZSBkb2Vzbid0IGhhdmUgY29udGVudCkuXG4gICAqL1xuICBnZXRCYWRnZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9iYWRnZUVsZW1lbnQ7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBXZSBtYXkgaGF2ZSBzZXJ2ZXItc2lkZSByZW5kZXJlZCBiYWRnZSB0aGF0IHdlIG5lZWQgdG8gY2xlYXIuXG4gICAgLy8gV2UgbmVlZCB0byBkbyB0aGlzIGluIG5nT25Jbml0IGJlY2F1c2UgdGhlIGZ1bGwgY29udGVudCBvZiB0aGUgY29tcG9uZW50XG4gICAgLy8gb24gd2hpY2ggdGhlIGJhZGdlIGlzIGF0dGFjaGVkIHdvbid0IG5lY2Vzc2FyaWx5IGJlIGluIHRoZSBET00gdW50aWwgdGhpcyBwb2ludC5cbiAgICB0aGlzLl9jbGVhckV4aXN0aW5nQmFkZ2VzKCk7XG5cbiAgICBpZiAodGhpcy5jb250ZW50ICYmICF0aGlzLl9iYWRnZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2JhZGdlRWxlbWVudCA9IHRoaXMuX2NyZWF0ZUJhZGdlRWxlbWVudCgpO1xuICAgICAgdGhpcy5fdXBkYXRlUmVuZGVyZWRDb250ZW50KHRoaXMuY29udGVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICAvLyBWaWV3RW5naW5lIG9ubHk6IHdoZW4gY3JlYXRpbmcgYSBiYWRnZSB0aHJvdWdoIHRoZSBSZW5kZXJlciwgQW5ndWxhciByZW1lbWJlcnMgaXRzIGluZGV4LlxuICAgIC8vIFdlIGhhdmUgdG8gZGVzdHJveSBpdCBvdXJzZWx2ZXMsIG90aGVyd2lzZSBpdCdsbCBiZSByZXRhaW5lZCBpbiBtZW1vcnkuXG4gICAgaWYgKHRoaXMuX3JlbmRlcmVyLmRlc3Ryb3lOb2RlKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5kZXN0cm95Tm9kZSh0aGlzLl9iYWRnZUVsZW1lbnQpO1xuICAgICAgdGhpcy5faW5saW5lQmFkZ2VEZXNjcmlwdGlvbj8ucmVtb3ZlKCk7XG4gICAgfVxuXG4gICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuZGVzY3JpcHRpb24pO1xuICB9XG5cbiAgLyoqIEdldHMgd2hldGhlciB0aGUgYmFkZ2UncyBob3N0IGVsZW1lbnQgaXMgaW50ZXJhY3RpdmUuICovXG4gIHByaXZhdGUgX2lzSG9zdEludGVyYWN0aXZlKCk6IGJvb2xlYW4ge1xuICAgIC8vIElnbm9yZSB2aXNpYmlsaXR5IHNpbmNlIGl0IHJlcXVpcmVzIGFuIGV4cGVuc2l2ZSBzdHlsZSBjYWx1Y2xhdGlvbi5cbiAgICByZXR1cm4gdGhpcy5faW50ZXJhY3Rpdml0eUNoZWNrZXIuaXNGb2N1c2FibGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB7XG4gICAgICBpZ25vcmVWaXNpYmlsaXR5OiB0cnVlLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgdGhlIGJhZGdlIGVsZW1lbnQgKi9cbiAgcHJpdmF0ZSBfY3JlYXRlQmFkZ2VFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCBiYWRnZUVsZW1lbnQgPSB0aGlzLl9yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgY29uc3QgYWN0aXZlQ2xhc3MgPSAnbWF0LWJhZGdlLWFjdGl2ZSc7XG5cbiAgICBiYWRnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdpZCcsIGBtYXQtYmFkZ2UtY29udGVudC0ke3RoaXMuX2lkfWApO1xuXG4gICAgLy8gVGhlIGJhZGdlIGlzIGFyaWEtaGlkZGVuIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCBpdCB0byBhcHBlYXIgaW4gdGhlIHBhZ2UncyBuYXZpZ2F0aW9uXG4gICAgLy8gZmxvdy4gSW5zdGVhZCwgd2UgdXNlIHRoZSBiYWRnZSB0byBkZXNjcmliZSB0aGUgZGVjb3JhdGVkIGVsZW1lbnQgd2l0aCBhcmlhLWRlc2NyaWJlZGJ5LlxuICAgIGJhZGdlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChCQURHRV9DT05URU5UX0NMQVNTKTtcblxuICAgIGlmICh0aGlzLl9hbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnX21hdC1hbmltYXRpb24tbm9vcGFibGUnKTtcbiAgICB9XG5cbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQoYmFkZ2VFbGVtZW50KTtcblxuICAgIC8vIGFuaW1hdGUgaW4gYWZ0ZXIgaW5zZXJ0aW9uXG4gICAgaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5fYW5pbWF0aW9uTW9kZSAhPT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYmFkZ2VFbGVtZW50O1xuICB9XG5cbiAgLyoqIFVwZGF0ZSB0aGUgdGV4dCBjb250ZW50IG9mIHRoZSBiYWRnZSBlbGVtZW50IGluIHRoZSBET00sIGNyZWF0aW5nIHRoZSBlbGVtZW50IGlmIG5lY2Vzc2FyeS4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlUmVuZGVyZWRDb250ZW50KG5ld0NvbnRlbnQ6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwpOiB2b2lkIHtcbiAgICBjb25zdCBuZXdDb250ZW50Tm9ybWFsaXplZDogc3RyaW5nID0gYCR7bmV3Q29udGVudCA/PyAnJ31gLnRyaW0oKTtcblxuICAgIC8vIERvbid0IGNyZWF0ZSB0aGUgYmFkZ2UgZWxlbWVudCBpZiB0aGUgZGlyZWN0aXZlIGlzbid0IGluaXRpYWxpemVkIGJlY2F1c2Ugd2Ugd2FudCB0b1xuICAgIC8vIGFwcGVuZCB0aGUgYmFkZ2UgZWxlbWVudCB0byB0aGUgKmVuZCogb2YgdGhlIGhvc3QgZWxlbWVudCdzIGNvbnRlbnQgZm9yIGJhY2t3YXJkc1xuICAgIC8vIGNvbXBhdGliaWxpdHkuXG4gICAgaWYgKHRoaXMuX2lzSW5pdGlhbGl6ZWQgJiYgbmV3Q29udGVudE5vcm1hbGl6ZWQgJiYgIXRoaXMuX2JhZGdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fYmFkZ2VFbGVtZW50ID0gdGhpcy5fY3JlYXRlQmFkZ2VFbGVtZW50KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2JhZGdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fYmFkZ2VFbGVtZW50LnRleHRDb250ZW50ID0gbmV3Q29udGVudE5vcm1hbGl6ZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5fY29udGVudCA9IG5ld0NvbnRlbnROb3JtYWxpemVkO1xuICB9XG5cbiAgLyoqIFVwZGF0ZXMgdGhlIGhvc3QgZWxlbWVudCdzIGFyaWEgZGVzY3JpcHRpb24gdmlhIEFyaWFEZXNjcmliZXIuICovXG4gIHByaXZhdGUgX3VwZGF0ZURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAvLyBBbHdheXMgc3RhcnQgYnkgcmVtb3ZpbmcgdGhlIGFyaWEtZGVzY3JpYmVkYnk7IHdlIHdpbGwgYWRkIGEgbmV3IG9uZSBpZiBuZWNlc3NhcnkuXG4gICAgdGhpcy5fYXJpYURlc2NyaWJlci5yZW1vdmVEZXNjcmlwdGlvbih0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuZGVzY3JpcHRpb24pO1xuXG4gICAgLy8gTk9URTogV2Ugb25seSBjaGVjayB3aGV0aGVyIHRoZSBob3N0IGlzIGludGVyYWN0aXZlIGhlcmUsIHdoaWNoIGhhcHBlbnMgZHVyaW5nXG4gICAgLy8gd2hlbiB0aGVuIGJhZGdlIGNvbnRlbnQgY2hhbmdlcy4gSXQgaXMgcG9zc2libGUgdGhhdCB0aGUgaG9zdCBjaGFuZ2VzXG4gICAgLy8gaW50ZXJhY3Rpdml0eSBzdGF0dXMgc2VwYXJhdGUgZnJvbSBvbmUgb2YgdGhlc2UuIEhvd2V2ZXIsIHdhdGNoaW5nIHRoZSBpbnRlcmFjdGl2aXR5XG4gICAgLy8gc3RhdHVzIG9mIHRoZSBob3N0IHdvdWxkIHJlcXVpcmUgYSBgTXV0YXRpb25PYnNlcnZlcmAsIHdoaWNoIGlzIGxpa2VseSBtb3JlIGNvZGUgKyBvdmVyaGVhZFxuICAgIC8vIHRoYW4gaXQncyB3b3J0aDsgZnJvbSB1c2FnZXMgaW5zaWRlIEdvb2dsZSwgd2Ugc2VlIHRoYXQgdGhlIHZhdHMgbWFqb3JpdHkgb2YgYmFkZ2VzIGVpdGhlclxuICAgIC8vIG5ldmVyIGNoYW5nZSBpbnRlcmFjdGl2aXR5LCBvciBhbHNvIHNldCBgbWF0QmFkZ2VIaWRkZW5gIGJhc2VkIG9uIHRoZSBzYW1lIGNvbmRpdGlvbi5cblxuICAgIGlmICghbmV3RGVzY3JpcHRpb24gfHwgdGhpcy5faXNIb3N0SW50ZXJhY3RpdmUoKSkge1xuICAgICAgdGhpcy5fcmVtb3ZlSW5saW5lRGVzY3JpcHRpb24oKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuXG4gICAgLy8gV2UgZG9uJ3QgYWRkIGBhcmlhLWRlc2NyaWJlZGJ5YCBmb3Igbm9uLWludGVyYWN0aXZlIGhvc3RzIGVsZW1lbnRzIGJlY2F1c2Ugd2VcbiAgICAvLyBpbnN0ZWFkIGluc2VydCB0aGUgZGVzY3JpcHRpb24gaW5saW5lLlxuICAgIGlmICh0aGlzLl9pc0hvc3RJbnRlcmFjdGl2ZSgpKSB7XG4gICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLmRlc2NyaWJlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgbmV3RGVzY3JpcHRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl91cGRhdGVJbmxpbmVEZXNjcmlwdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZUlubGluZURlc2NyaXB0aW9uKCkge1xuICAgIC8vIENyZWF0ZSB0aGUgaW5saW5lIGRlc2NyaXB0aW9uIGVsZW1lbnQgaWYgaXQgZG9lc24ndCBleGlzdFxuICAgIGlmICghdGhpcy5faW5saW5lQmFkZ2VEZXNjcmlwdGlvbikge1xuICAgICAgdGhpcy5faW5saW5lQmFkZ2VEZXNjcmlwdGlvbiA9IHRoaXMuX2RvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHRoaXMuX2lubGluZUJhZGdlRGVzY3JpcHRpb24uY2xhc3NMaXN0LmFkZCgnY2RrLXZpc3VhbGx5LWhpZGRlbicpO1xuICAgIH1cblxuICAgIHRoaXMuX2lubGluZUJhZGdlRGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSB0aGlzLmRlc2NyaXB0aW9uO1xuICAgIHRoaXMuX2JhZGdlRWxlbWVudD8uYXBwZW5kQ2hpbGQodGhpcy5faW5saW5lQmFkZ2VEZXNjcmlwdGlvbik7XG4gIH1cblxuICBwcml2YXRlIF9yZW1vdmVJbmxpbmVEZXNjcmlwdGlvbigpIHtcbiAgICB0aGlzLl9pbmxpbmVCYWRnZURlc2NyaXB0aW9uPy5yZW1vdmUoKTtcbiAgICB0aGlzLl9pbmxpbmVCYWRnZURlc2NyaXB0aW9uID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqIEFkZHMgY3NzIHRoZW1lIGNsYXNzIGdpdmVuIHRoZSBjb2xvciB0byB0aGUgY29tcG9uZW50IGhvc3QgKi9cbiAgcHJpdmF0ZSBfc2V0Q29sb3IoY29sb3JQYWxldHRlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgIGNsYXNzTGlzdC5yZW1vdmUoYG1hdC1iYWRnZS0ke3RoaXMuX2NvbG9yfWApO1xuICAgIGlmIChjb2xvclBhbGV0dGUpIHtcbiAgICAgIGNsYXNzTGlzdC5hZGQoYG1hdC1iYWRnZS0ke2NvbG9yUGFsZXR0ZX1gKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xlYXJzIGFueSBleGlzdGluZyBiYWRnZXMgdGhhdCBtaWdodCBiZSBsZWZ0IG92ZXIgZnJvbSBzZXJ2ZXItc2lkZSByZW5kZXJpbmcuICovXG4gIHByaXZhdGUgX2NsZWFyRXhpc3RpbmdCYWRnZXMoKSB7XG4gICAgLy8gT25seSBjaGVjayBkaXJlY3QgY2hpbGRyZW4gb2YgdGhpcyBob3N0IGVsZW1lbnQgaW4gb3JkZXIgdG8gYXZvaWQgZGVsZXRpbmdcbiAgICAvLyBhbnkgYmFkZ2VzIHRoYXQgbWlnaHQgZXhpc3QgaW4gZGVzY2VuZGFudCBlbGVtZW50cy5cbiAgICBjb25zdCBiYWRnZXMgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgIGA6c2NvcGUgPiAuJHtCQURHRV9DT05URU5UX0NMQVNTfWAsXG4gICAgKTtcbiAgICBmb3IgKGNvbnN0IGJhZGdlRWxlbWVudCBvZiBBcnJheS5mcm9tKGJhZGdlcykpIHtcbiAgICAgIGlmIChiYWRnZUVsZW1lbnQgIT09IHRoaXMuX2JhZGdlRWxlbWVudCkge1xuICAgICAgICBiYWRnZUVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=
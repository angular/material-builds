/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AriaDescriber, InteractivityChecker } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { booleanAttribute, Directive, ElementRef, inject, Inject, Input, NgZone, Optional, Renderer2, } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
let nextId = 0;
const BADGE_CONTENT_CLASS = 'mat-badge-content';
/** Directive to display a text badge. */
export class MatBadge {
    /** The color of the badge. Can be `primary`, `accent`, or `warn`. */
    get color() {
        return this._color;
    }
    set color(value) {
        this._setColor(value);
        this._color = value;
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
    constructor(_ngZone, _elementRef, _ariaDescriber, _renderer, _animationMode) {
        this._ngZone = _ngZone;
        this._elementRef = _elementRef;
        this._ariaDescriber = _ariaDescriber;
        this._renderer = _renderer;
        this._animationMode = _animationMode;
        this._color = 'primary';
        /** Whether the badge should overlap its contents or not */
        this.overlap = true;
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
            const matIconTagName = 'mat-icon';
            // Heads-up for developers to avoid putting matBadge on <mat-icon>
            // as it is aria-hidden by default docs mention this at:
            // https://material.angular.io/components/badge/overview#accessibility
            if (nativeElement.tagName.toLowerCase() === matIconTagName &&
                nativeElement.getAttribute('aria-hidden') === 'true') {
                console.warn(`Detected a matBadge on an "aria-hidden" "<mat-icon>". ` +
                    `Consider setting aria-hidden="false" in order to surface the information assistive technology.` +
                    `\n${nativeElement.outerHTML}`);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatBadge, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i1.AriaDescriber }, { token: i0.Renderer2 }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.0.4", type: MatBadge, selector: "[matBadge]", inputs: { color: ["matBadgeColor", "color"], overlap: ["matBadgeOverlap", "overlap", booleanAttribute], disabled: ["matBadgeDisabled", "disabled", booleanAttribute], position: ["matBadgePosition", "position"], content: ["matBadge", "content"], description: ["matBadgeDescription", "description"], size: ["matBadgeSize", "size"], hidden: ["matBadgeHidden", "hidden", booleanAttribute] }, host: { properties: { "class.mat-badge-overlap": "overlap", "class.mat-badge-above": "isAbove()", "class.mat-badge-below": "!isAbove()", "class.mat-badge-before": "!isAfter()", "class.mat-badge-after": "isAfter()", "class.mat-badge-small": "size === \"small\"", "class.mat-badge-medium": "size === \"medium\"", "class.mat-badge-large": "size === \"large\"", "class.mat-badge-hidden": "hidden || !content", "class.mat-badge-disabled": "disabled" }, classAttribute: "mat-badge" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatBadge, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matBadge]',
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
        }], ctorParameters: () => [{ type: i0.NgZone }, { type: i0.ElementRef }, { type: i1.AriaDescriber }, { type: i0.Renderer2 }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }], propDecorators: { color: [{
                type: Input,
                args: ['matBadgeColor']
            }], overlap: [{
                type: Input,
                args: [{ alias: 'matBadgeOverlap', transform: booleanAttribute }]
            }], disabled: [{
                type: Input,
                args: [{ alias: 'matBadgeDisabled', transform: booleanAttribute }]
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
                args: [{ alias: 'matBadgeHidden', transform: booleanAttribute }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYmFkZ2UvYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3RFLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7OztBQUUzRSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFnQmYsTUFBTSxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztBQUVoRCx5Q0FBeUM7QUFpQnpDLE1BQU0sT0FBTyxRQUFRO0lBQ25CLHFFQUFxRTtJQUNyRSxJQUNJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUNELElBQUksS0FBSyxDQUFDLEtBQW1CO1FBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDdEIsQ0FBQztJQWVELGdDQUFnQztJQUNoQyxJQUNJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDdkIsQ0FBQztJQUNELElBQUksT0FBTyxDQUFDLFVBQThDO1FBQ3hELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBR0QsMEVBQTBFO0lBQzFFLElBQ0ksV0FBVztRQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVks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QUF0RSxLQUFLO3VCQUFDLEVBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQztnQkFHRyxRQUFRO3NCQUF4RSxLQUFLO3VCQUFDLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQztnQkFNcEMsUUFBUTtzQkFBbEMsS0FBSzt1QkFBQyxrQkFBa0I7Z0JBSXJCLE9BQU87c0JBRFYsS0FBSzt1QkFBQyxVQUFVO2dCQVdiLFdBQVc7c0JBRGQsS0FBSzt1QkFBQyxxQkFBcUI7Z0JBVUwsSUFBSTtzQkFBMUIsS0FBSzt1QkFBQyxjQUFjO2dCQUcwQyxNQUFNO3NCQUFwRSxLQUFLO3VCQUFDLEVBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FyaWFEZXNjcmliZXIsIEludGVyYWN0aXZpdHlDaGVja2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBpbmplY3QsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtUaGVtZVBhbGV0dGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cbmxldCBuZXh0SWQgPSAwO1xuXG4vKiogQWxsb3dlZCBwb3NpdGlvbiBvcHRpb25zIGZvciBtYXRCYWRnZVBvc2l0aW9uICovXG5leHBvcnQgdHlwZSBNYXRCYWRnZVBvc2l0aW9uID1cbiAgfCAnYWJvdmUgYWZ0ZXInXG4gIHwgJ2Fib3ZlIGJlZm9yZSdcbiAgfCAnYmVsb3cgYmVmb3JlJ1xuICB8ICdiZWxvdyBhZnRlcidcbiAgfCAnYmVmb3JlJ1xuICB8ICdhZnRlcidcbiAgfCAnYWJvdmUnXG4gIHwgJ2JlbG93JztcblxuLyoqIEFsbG93ZWQgc2l6ZSBvcHRpb25zIGZvciBtYXRCYWRnZVNpemUgKi9cbmV4cG9ydCB0eXBlIE1hdEJhZGdlU2l6ZSA9ICdzbWFsbCcgfCAnbWVkaXVtJyB8ICdsYXJnZSc7XG5cbmNvbnN0IEJBREdFX0NPTlRFTlRfQ0xBU1MgPSAnbWF0LWJhZGdlLWNvbnRlbnQnO1xuXG4vKiogRGlyZWN0aXZlIHRvIGRpc3BsYXkgYSB0ZXh0IGJhZGdlLiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdEJhZGdlXScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWJhZGdlJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1vdmVybGFwXSc6ICdvdmVybGFwJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1hYm92ZV0nOiAnaXNBYm92ZSgpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1iZWxvd10nOiAnIWlzQWJvdmUoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYmVmb3JlXSc6ICchaXNBZnRlcigpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1hZnRlcl0nOiAnaXNBZnRlcigpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1zbWFsbF0nOiAnc2l6ZSA9PT0gXCJzbWFsbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1tZWRpdW1dJzogJ3NpemUgPT09IFwibWVkaXVtXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWxhcmdlXSc6ICdzaXplID09PSBcImxhcmdlXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWhpZGRlbl0nOiAnaGlkZGVuIHx8ICFjb250ZW50JyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCYWRnZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgLyoqIFRoZSBjb2xvciBvZiB0aGUgYmFkZ2UuIENhbiBiZSBgcHJpbWFyeWAsIGBhY2NlbnRgLCBvciBgd2FybmAuICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VDb2xvcicpXG4gIGdldCBjb2xvcigpOiBUaGVtZVBhbGV0dGUge1xuICAgIHJldHVybiB0aGlzLl9jb2xvcjtcbiAgfVxuICBzZXQgY29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIHRoaXMuX3NldENvbG9yKHZhbHVlKTtcbiAgICB0aGlzLl9jb2xvciA9IHZhbHVlO1xuICB9XG4gIHByaXZhdGUgX2NvbG9yOiBUaGVtZVBhbGV0dGUgPSAncHJpbWFyeSc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIHNob3VsZCBvdmVybGFwIGl0cyBjb250ZW50cyBvciBub3QgKi9cbiAgQElucHV0KHthbGlhczogJ21hdEJhZGdlT3ZlcmxhcCcsIHRyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pIG92ZXJsYXA6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KHthbGlhczogJ21hdEJhZGdlRGlzYWJsZWQnLCB0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogUG9zaXRpb24gdGhlIGJhZGdlIHNob3VsZCByZXNpZGUuXG4gICAqIEFjY2VwdHMgYW55IGNvbWJpbmF0aW9uIG9mICdhYm92ZSd8J2JlbG93JyBhbmQgJ2JlZm9yZSd8J2FmdGVyJ1xuICAgKi9cbiAgQElucHV0KCdtYXRCYWRnZVBvc2l0aW9uJykgcG9zaXRpb246IE1hdEJhZGdlUG9zaXRpb24gPSAnYWJvdmUgYWZ0ZXInO1xuXG4gIC8qKiBUaGUgY29udGVudCBmb3IgdGhlIGJhZGdlICovXG4gIEBJbnB1dCgnbWF0QmFkZ2UnKVxuICBnZXQgY29udGVudCgpOiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudDtcbiAgfVxuICBzZXQgY29udGVudChuZXdDb250ZW50OiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgfCBudWxsKSB7XG4gICAgdGhpcy5fdXBkYXRlUmVuZGVyZWRDb250ZW50KG5ld0NvbnRlbnQpO1xuICB9XG4gIHByaXZhdGUgX2NvbnRlbnQ6IHN0cmluZyB8IG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGw7XG5cbiAgLyoqIE1lc3NhZ2UgdXNlZCB0byBkZXNjcmliZSB0aGUgZGVjb3JhdGVkIGVsZW1lbnQgdmlhIGFyaWEtZGVzY3JpYmVkYnkgKi9cbiAgQElucHV0KCdtYXRCYWRnZURlc2NyaXB0aW9uJylcbiAgZ2V0IGRlc2NyaXB0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0aW9uO1xuICB9XG4gIHNldCBkZXNjcmlwdGlvbihuZXdEZXNjcmlwdGlvbjogc3RyaW5nKSB7XG4gICAgdGhpcy5fdXBkYXRlRGVzY3JpcHRpb24obmV3RGVzY3JpcHRpb24pO1xuICB9XG4gIHByaXZhdGUgX2Rlc2NyaXB0aW9uOiBzdHJpbmc7XG5cbiAgLyoqIFNpemUgb2YgdGhlIGJhZGdlLiBDYW4gYmUgJ3NtYWxsJywgJ21lZGl1bScsIG9yICdsYXJnZScuICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VTaXplJykgc2l6ZTogTWF0QmFkZ2VTaXplID0gJ21lZGl1bSc7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGhpZGRlbi4gKi9cbiAgQElucHV0KHthbGlhczogJ21hdEJhZGdlSGlkZGVuJywgdHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSkgaGlkZGVuOiBib29sZWFuO1xuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoZSBiYWRnZSAqL1xuICBfaWQ6IG51bWJlciA9IG5leHRJZCsrO1xuXG4gIC8qKiBWaXNpYmxlIGJhZGdlIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX2JhZGdlRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIElubGluZSBiYWRnZSBkZXNjcmlwdGlvbi4gVXNlZCB3aGVuIHRoZSBiYWRnZSBpcyBhcHBsaWVkIHRvIG5vbi1pbnRlcmFjdGl2ZSBob3N0IGVsZW1lbnRzLiAqL1xuICBwcml2YXRlIF9pbmxpbmVCYWRnZURlc2NyaXB0aW9uOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblxuICAvKiogV2hldGhlciB0aGUgT25Jbml0IGxpZmVjeWNsZSBob29rIGhhcyBydW4geWV0ICovXG4gIHByaXZhdGUgX2lzSW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAvKiogSW50ZXJhY3Rpdml0eUNoZWNrZXIgdG8gZGV0ZXJtaW5lIGlmIHRoZSBiYWRnZSBob3N0IGlzIGZvY3VzYWJsZS4gKi9cbiAgcHJpdmF0ZSBfaW50ZXJhY3Rpdml0eUNoZWNrZXIgPSBpbmplY3QoSW50ZXJhY3Rpdml0eUNoZWNrZXIpO1xuXG4gIHByaXZhdGUgX2RvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIF9hcmlhRGVzY3JpYmVyOiBBcmlhRGVzY3JpYmVyLFxuICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHByaXZhdGUgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIGNvbnN0IG5hdGl2ZUVsZW1lbnQgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgaWYgKG5hdGl2ZUVsZW1lbnQubm9kZVR5cGUgIT09IG5hdGl2ZUVsZW1lbnQuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIHRocm93IEVycm9yKCdtYXRCYWRnZSBtdXN0IGJlIGF0dGFjaGVkIHRvIGFuIGVsZW1lbnQgbm9kZS4nKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWF0SWNvblRhZ05hbWU6IHN0cmluZyA9ICdtYXQtaWNvbic7XG5cbiAgICAgIC8vIEhlYWRzLXVwIGZvciBkZXZlbG9wZXJzIHRvIGF2b2lkIHB1dHRpbmcgbWF0QmFkZ2Ugb24gPG1hdC1pY29uPlxuICAgICAgLy8gYXMgaXQgaXMgYXJpYS1oaWRkZW4gYnkgZGVmYXVsdCBkb2NzIG1lbnRpb24gdGhpcyBhdDpcbiAgICAgIC8vIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9jb21wb25lbnRzL2JhZGdlL292ZXJ2aWV3I2FjY2Vzc2liaWxpdHlcbiAgICAgIGlmIChcbiAgICAgICAgbmF0aXZlRWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09IG1hdEljb25UYWdOYW1lICYmXG4gICAgICAgIG5hdGl2ZUVsZW1lbnQuZ2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicpID09PSAndHJ1ZSdcbiAgICAgICkge1xuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgYERldGVjdGVkIGEgbWF0QmFkZ2Ugb24gYW4gXCJhcmlhLWhpZGRlblwiIFwiPG1hdC1pY29uPlwiLiBgICtcbiAgICAgICAgICAgIGBDb25zaWRlciBzZXR0aW5nIGFyaWEtaGlkZGVuPVwiZmFsc2VcIiBpbiBvcmRlciB0byBzdXJmYWNlIHRoZSBpbmZvcm1hdGlvbiBhc3Npc3RpdmUgdGVjaG5vbG9neS5gICtcbiAgICAgICAgICAgIGBcXG4ke25hdGl2ZUVsZW1lbnQub3V0ZXJIVE1MfWAsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGFib3ZlIHRoZSBob3N0IG9yIG5vdCAqL1xuICBpc0Fib3ZlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmluZGV4T2YoJ2JlbG93JykgPT09IC0xO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJhZGdlIGlzIGFmdGVyIHRoZSBob3N0IG9yIG5vdCAqL1xuICBpc0FmdGVyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmluZGV4T2YoJ2JlZm9yZScpID09PSAtMTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBlbGVtZW50IGludG8gd2hpY2ggdGhlIGJhZGdlJ3MgY29udGVudCBpcyBiZWluZyByZW5kZXJlZC4gVW5kZWZpbmVkIGlmIHRoZSBlbGVtZW50XG4gICAqIGhhc24ndCBiZWVuIGNyZWF0ZWQgKGUuZy4gaWYgdGhlIGJhZGdlIGRvZXNuJ3QgaGF2ZSBjb250ZW50KS5cbiAgICovXG4gIGdldEJhZGdlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuX2JhZGdlRWxlbWVudDtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIC8vIFdlIG1heSBoYXZlIHNlcnZlci1zaWRlIHJlbmRlcmVkIGJhZGdlIHRoYXQgd2UgbmVlZCB0byBjbGVhci5cbiAgICAvLyBXZSBuZWVkIHRvIGRvIHRoaXMgaW4gbmdPbkluaXQgYmVjYXVzZSB0aGUgZnVsbCBjb250ZW50IG9mIHRoZSBjb21wb25lbnRcbiAgICAvLyBvbiB3aGljaCB0aGUgYmFkZ2UgaXMgYXR0YWNoZWQgd29uJ3QgbmVjZXNzYXJpbHkgYmUgaW4gdGhlIERPTSB1bnRpbCB0aGlzIHBvaW50LlxuICAgIHRoaXMuX2NsZWFyRXhpc3RpbmdCYWRnZXMoKTtcblxuICAgIGlmICh0aGlzLmNvbnRlbnQgJiYgIXRoaXMuX2JhZGdlRWxlbWVudCkge1xuICAgICAgdGhpcy5fYmFkZ2VFbGVtZW50ID0gdGhpcy5fY3JlYXRlQmFkZ2VFbGVtZW50KCk7XG4gICAgICB0aGlzLl91cGRhdGVSZW5kZXJlZENvbnRlbnQodGhpcy5jb250ZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLl9pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIC8vIFZpZXdFbmdpbmUgb25seTogd2hlbiBjcmVhdGluZyBhIGJhZGdlIHRocm91Z2ggdGhlIFJlbmRlcmVyLCBBbmd1bGFyIHJlbWVtYmVycyBpdHMgaW5kZXguXG4gICAgLy8gV2UgaGF2ZSB0byBkZXN0cm95IGl0IG91cnNlbHZlcywgb3RoZXJ3aXNlIGl0J2xsIGJlIHJldGFpbmVkIGluIG1lbW9yeS5cbiAgICBpZiAodGhpcy5fcmVuZGVyZXIuZGVzdHJveU5vZGUpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLmRlc3Ryb3lOb2RlKHRoaXMuX2JhZGdlRWxlbWVudCk7XG4gICAgICB0aGlzLl9pbmxpbmVCYWRnZURlc2NyaXB0aW9uPy5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLnJlbW92ZURlc2NyaXB0aW9uKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5kZXNjcmlwdGlvbik7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBiYWRnZSdzIGhvc3QgZWxlbWVudCBpcyBpbnRlcmFjdGl2ZS4gKi9cbiAgcHJpdmF0ZSBfaXNIb3N0SW50ZXJhY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgLy8gSWdub3JlIHZpc2liaWxpdHkgc2luY2UgaXQgcmVxdWlyZXMgYW4gZXhwZW5zaXZlIHN0eWxlIGNhbHVjbGF0aW9uLlxuICAgIHJldHVybiB0aGlzLl9pbnRlcmFjdGl2aXR5Q2hlY2tlci5pc0ZvY3VzYWJsZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHtcbiAgICAgIGlnbm9yZVZpc2liaWxpdHk6IHRydWUsXG4gICAgfSk7XG4gIH1cblxuICAvKiogQ3JlYXRlcyB0aGUgYmFkZ2UgZWxlbWVudCAqL1xuICBwcml2YXRlIF9jcmVhdGVCYWRnZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIGNvbnN0IGJhZGdlRWxlbWVudCA9IHRoaXMuX3JlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBhY3RpdmVDbGFzcyA9ICdtYXQtYmFkZ2UtYWN0aXZlJztcblxuICAgIGJhZGdlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgYG1hdC1iYWRnZS1jb250ZW50LSR7dGhpcy5faWR9YCk7XG5cbiAgICAvLyBUaGUgYmFkZ2UgaXMgYXJpYS1oaWRkZW4gYmVjYXVzZSB3ZSBkb24ndCB3YW50IGl0IHRvIGFwcGVhciBpbiB0aGUgcGFnZSdzIG5hdmlnYXRpb25cbiAgICAvLyBmbG93LiBJbnN0ZWFkLCB3ZSB1c2UgdGhlIGJhZGdlIHRvIGRlc2NyaWJlIHRoZSBkZWNvcmF0ZWQgZWxlbWVudCB3aXRoIGFyaWEtZGVzY3JpYmVkYnkuXG4gICAgYmFkZ2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKEJBREdFX0NPTlRFTlRfQ0xBU1MpO1xuXG4gICAgaWYgKHRoaXMuX2FuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdfbWF0LWFuaW1hdGlvbi1ub29wYWJsZScpO1xuICAgIH1cblxuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZChiYWRnZUVsZW1lbnQpO1xuXG4gICAgLy8gYW5pbWF0ZSBpbiBhZnRlciBpbnNlcnRpb25cbiAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLl9hbmltYXRpb25Nb2RlICE9PSAnTm9vcEFuaW1hdGlvbnMnKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGJhZGdlRWxlbWVudC5jbGFzc0xpc3QuYWRkKGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuICAgIH1cblxuICAgIHJldHVybiBiYWRnZUVsZW1lbnQ7XG4gIH1cblxuICAvKiogVXBkYXRlIHRoZSB0ZXh0IGNvbnRlbnQgb2YgdGhlIGJhZGdlIGVsZW1lbnQgaW4gdGhlIERPTSwgY3JlYXRpbmcgdGhlIGVsZW1lbnQgaWYgbmVjZXNzYXJ5LiAqL1xuICBwcml2YXRlIF91cGRhdGVSZW5kZXJlZENvbnRlbnQobmV3Q29udGVudDogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkIHwgbnVsbCk6IHZvaWQge1xuICAgIGNvbnN0IG5ld0NvbnRlbnROb3JtYWxpemVkOiBzdHJpbmcgPSBgJHtuZXdDb250ZW50ID8/ICcnfWAudHJpbSgpO1xuXG4gICAgLy8gRG9uJ3QgY3JlYXRlIHRoZSBiYWRnZSBlbGVtZW50IGlmIHRoZSBkaXJlY3RpdmUgaXNuJ3QgaW5pdGlhbGl6ZWQgYmVjYXVzZSB3ZSB3YW50IHRvXG4gICAgLy8gYXBwZW5kIHRoZSBiYWRnZSBlbGVtZW50IHRvIHRoZSAqZW5kKiBvZiB0aGUgaG9zdCBlbGVtZW50J3MgY29udGVudCBmb3IgYmFja3dhcmRzXG4gICAgLy8gY29tcGF0aWJpbGl0eS5cbiAgICBpZiAodGhpcy5faXNJbml0aWFsaXplZCAmJiBuZXdDb250ZW50Tm9ybWFsaXplZCAmJiAhdGhpcy5fYmFkZ2VFbGVtZW50KSB7XG4gICAgICB0aGlzLl9iYWRnZUVsZW1lbnQgPSB0aGlzLl9jcmVhdGVCYWRnZUVsZW1lbnQoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fYmFkZ2VFbGVtZW50KSB7XG4gICAgICB0aGlzLl9iYWRnZUVsZW1lbnQudGV4dENvbnRlbnQgPSBuZXdDb250ZW50Tm9ybWFsaXplZDtcbiAgICB9XG5cbiAgICB0aGlzLl9jb250ZW50ID0gbmV3Q29udGVudE5vcm1hbGl6ZWQ7XG4gIH1cblxuICAvKiogVXBkYXRlcyB0aGUgaG9zdCBlbGVtZW50J3MgYXJpYSBkZXNjcmlwdGlvbiB2aWEgQXJpYURlc2NyaWJlci4gKi9cbiAgcHJpdmF0ZSBfdXBkYXRlRGVzY3JpcHRpb24obmV3RGVzY3JpcHRpb246IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIEFsd2F5cyBzdGFydCBieSByZW1vdmluZyB0aGUgYXJpYS1kZXNjcmliZWRieTsgd2Ugd2lsbCBhZGQgYSBuZXcgb25lIGlmIG5lY2Vzc2FyeS5cbiAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLnJlbW92ZURlc2NyaXB0aW9uKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5kZXNjcmlwdGlvbik7XG5cbiAgICAvLyBOT1RFOiBXZSBvbmx5IGNoZWNrIHdoZXRoZXIgdGhlIGhvc3QgaXMgaW50ZXJhY3RpdmUgaGVyZSwgd2hpY2ggaGFwcGVucyBkdXJpbmdcbiAgICAvLyB3aGVuIHRoZW4gYmFkZ2UgY29udGVudCBjaGFuZ2VzLiBJdCBpcyBwb3NzaWJsZSB0aGF0IHRoZSBob3N0IGNoYW5nZXNcbiAgICAvLyBpbnRlcmFjdGl2aXR5IHN0YXR1cyBzZXBhcmF0ZSBmcm9tIG9uZSBvZiB0aGVzZS4gSG93ZXZlciwgd2F0Y2hpbmcgdGhlIGludGVyYWN0aXZpdHlcbiAgICAvLyBzdGF0dXMgb2YgdGhlIGhvc3Qgd291bGQgcmVxdWlyZSBhIGBNdXRhdGlvbk9ic2VydmVyYCwgd2hpY2ggaXMgbGlrZWx5IG1vcmUgY29kZSArIG92ZXJoZWFkXG4gICAgLy8gdGhhbiBpdCdzIHdvcnRoOyBmcm9tIHVzYWdlcyBpbnNpZGUgR29vZ2xlLCB3ZSBzZWUgdGhhdCB0aGUgdmF0cyBtYWpvcml0eSBvZiBiYWRnZXMgZWl0aGVyXG4gICAgLy8gbmV2ZXIgY2hhbmdlIGludGVyYWN0aXZpdHksIG9yIGFsc28gc2V0IGBtYXRCYWRnZUhpZGRlbmAgYmFzZWQgb24gdGhlIHNhbWUgY29uZGl0aW9uLlxuXG4gICAgaWYgKCFuZXdEZXNjcmlwdGlvbiB8fCB0aGlzLl9pc0hvc3RJbnRlcmFjdGl2ZSgpKSB7XG4gICAgICB0aGlzLl9yZW1vdmVJbmxpbmVEZXNjcmlwdGlvbigpO1xuICAgIH1cblxuICAgIHRoaXMuX2Rlc2NyaXB0aW9uID0gbmV3RGVzY3JpcHRpb247XG5cbiAgICAvLyBXZSBkb24ndCBhZGQgYGFyaWEtZGVzY3JpYmVkYnlgIGZvciBub24taW50ZXJhY3RpdmUgaG9zdHMgZWxlbWVudHMgYmVjYXVzZSB3ZVxuICAgIC8vIGluc3RlYWQgaW5zZXJ0IHRoZSBkZXNjcmlwdGlvbiBpbmxpbmUuXG4gICAgaWYgKHRoaXMuX2lzSG9zdEludGVyYWN0aXZlKCkpIHtcbiAgICAgIHRoaXMuX2FyaWFEZXNjcmliZXIuZGVzY3JpYmUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBuZXdEZXNjcmlwdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3VwZGF0ZUlubGluZURlc2NyaXB0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlSW5saW5lRGVzY3JpcHRpb24oKSB7XG4gICAgLy8gQ3JlYXRlIHRoZSBpbmxpbmUgZGVzY3JpcHRpb24gZWxlbWVudCBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAgaWYgKCF0aGlzLl9pbmxpbmVCYWRnZURlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9pbmxpbmVCYWRnZURlc2NyaXB0aW9uID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgdGhpcy5faW5saW5lQmFkZ2VEZXNjcmlwdGlvbi5jbGFzc0xpc3QuYWRkKCdjZGstdmlzdWFsbHktaGlkZGVuJyk7XG4gICAgfVxuXG4gICAgdGhpcy5faW5saW5lQmFkZ2VEZXNjcmlwdGlvbi50ZXh0Q29udGVudCA9IHRoaXMuZGVzY3JpcHRpb247XG4gICAgdGhpcy5fYmFkZ2VFbGVtZW50Py5hcHBlbmRDaGlsZCh0aGlzLl9pbmxpbmVCYWRnZURlc2NyaXB0aW9uKTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlbW92ZUlubGluZURlc2NyaXB0aW9uKCkge1xuICAgIHRoaXMuX2lubGluZUJhZGdlRGVzY3JpcHRpb24/LnJlbW92ZSgpO1xuICAgIHRoaXMuX2lubGluZUJhZGdlRGVzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogQWRkcyBjc3MgdGhlbWUgY2xhc3MgZ2l2ZW4gdGhlIGNvbG9yIHRvIHRoZSBjb21wb25lbnQgaG9zdCAqL1xuICBwcml2YXRlIF9zZXRDb2xvcihjb2xvclBhbGV0dGU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgY2xhc3NMaXN0LnJlbW92ZShgbWF0LWJhZGdlLSR7dGhpcy5fY29sb3J9YCk7XG4gICAgaWYgKGNvbG9yUGFsZXR0ZSkge1xuICAgICAgY2xhc3NMaXN0LmFkZChgbWF0LWJhZGdlLSR7Y29sb3JQYWxldHRlfWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDbGVhcnMgYW55IGV4aXN0aW5nIGJhZGdlcyB0aGF0IG1pZ2h0IGJlIGxlZnQgb3ZlciBmcm9tIHNlcnZlci1zaWRlIHJlbmRlcmluZy4gKi9cbiAgcHJpdmF0ZSBfY2xlYXJFeGlzdGluZ0JhZGdlcygpIHtcbiAgICAvLyBPbmx5IGNoZWNrIGRpcmVjdCBjaGlsZHJlbiBvZiB0aGlzIGhvc3QgZWxlbWVudCBpbiBvcmRlciB0byBhdm9pZCBkZWxldGluZ1xuICAgIC8vIGFueSBiYWRnZXMgdGhhdCBtaWdodCBleGlzdCBpbiBkZXNjZW5kYW50IGVsZW1lbnRzLlxuICAgIGNvbnN0IGJhZGdlcyA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgYDpzY29wZSA+IC4ke0JBREdFX0NPTlRFTlRfQ0xBU1N9YCxcbiAgICApO1xuICAgIGZvciAoY29uc3QgYmFkZ2VFbGVtZW50IG9mIEFycmF5LmZyb20oYmFkZ2VzKSkge1xuICAgICAgaWYgKGJhZGdlRWxlbWVudCAhPT0gdGhpcy5fYmFkZ2VFbGVtZW50KSB7XG4gICAgICAgIGJhZGdlRWxlbWVudC5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
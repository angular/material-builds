import * as i0 from '@angular/core';
import { inject, Directive, Optional, Inject, Input, NgModule } from '@angular/core';
import { mixinDisabled, MatCommonModule } from '@angular/material/core';
import * as i1 from '@angular/cdk/a11y';
import { InteractivityChecker, A11yModule } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

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

class MatBadgeModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatBadgeModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.1.1", ngImport: i0, type: MatBadgeModule, declarations: [MatBadge], imports: [A11yModule, MatCommonModule], exports: [MatBadge, MatCommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatBadgeModule, imports: [A11yModule, MatCommonModule, MatCommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatBadgeModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [A11yModule, MatCommonModule],
                    exports: [MatBadge, MatCommonModule],
                    declarations: [MatBadge],
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { MatBadge, MatBadgeModule };
//# sourceMappingURL=badge.mjs.map

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AriaDescriber } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Directive, ElementRef, Inject, Input, NgZone, Optional, Renderer2, } from '@angular/core';
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
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
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
    /** The content for the badge */
    get content() {
        return this._content;
    }
    set content(newContent) {
        this._updateRenderedContent(newContent);
    }
    /** Message used to describe the decorated element via aria-describedby */
    get description() { return this._description; }
    set description(newDescription) {
        this._updateHostAriaDescription(newDescription);
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
        }
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
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
    _updateHostAriaDescription(newDescription) {
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.description);
        if (newDescription) {
            this._ariaDescriber.describe(this._elementRef.nativeElement, newDescription);
        }
        this._description = newDescription;
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
}
MatBadge.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatBadge, deps: [{ token: i0.NgZone }, { token: i0.ElementRef }, { token: i1.AriaDescriber }, { token: i0.Renderer2 }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatBadge.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatBadge, selector: "[matBadge]", inputs: { disabled: ["matBadgeDisabled", "disabled"], color: ["matBadgeColor", "color"], overlap: ["matBadgeOverlap", "overlap"], position: ["matBadgePosition", "position"], content: ["matBadge", "content"], description: ["matBadgeDescription", "description"], size: ["matBadgeSize", "size"], hidden: ["matBadgeHidden", "hidden"] }, host: { properties: { "class.mat-badge-overlap": "overlap", "class.mat-badge-above": "isAbove()", "class.mat-badge-below": "!isAbove()", "class.mat-badge-before": "!isAfter()", "class.mat-badge-after": "isAfter()", "class.mat-badge-small": "size === \"small\"", "class.mat-badge-medium": "size === \"medium\"", "class.mat-badge-large": "size === \"large\"", "class.mat-badge-hidden": "hidden || !content", "class.mat-badge-disabled": "disabled" }, classAttribute: "mat-badge" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatBadge, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFkZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYmFkZ2UvYmFkZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2hELE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUdOLFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFhLGFBQWEsRUFBZSxNQUFNLHdCQUF3QixDQUFDO0FBQy9FLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDOzs7QUFHM0UsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBRWYsK0NBQStDO0FBQy9DLG9CQUFvQjtBQUNwQixNQUFNLGFBQWEsR0FBRyxhQUFhLENBQUM7Q0FBUSxDQUFDLENBQUM7QUFVOUMsTUFBTSxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztBQUVoRCx5Q0FBeUM7QUFrQnpDLE1BQU0sT0FBTyxRQUFTLFNBQVEsYUFBYTtJQThEekMsWUFDWSxPQUFlLEVBQ2YsV0FBb0MsRUFDcEMsY0FBNkIsRUFDN0IsU0FBb0IsRUFDdUIsY0FBdUI7UUFDMUUsS0FBSyxFQUFFLENBQUM7UUFMQSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ3BDLG1CQUFjLEdBQWQsY0FBYyxDQUFlO1FBQzdCLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFDdUIsbUJBQWMsR0FBZCxjQUFjLENBQVM7UUEzRHRFLFdBQU0sR0FBaUIsU0FBUyxDQUFDO1FBUWpDLGFBQVEsR0FBWSxJQUFJLENBQUM7UUFFakM7OztXQUdHO1FBQ3dCLGFBQVEs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Szt1QkFBQyxlQUFlO2dCQVVsQixPQUFPO3NCQURWLEtBQUs7dUJBQUMsaUJBQWlCO2dCQVdHLFFBQVE7c0JBQWxDLEtBQUs7dUJBQUMsa0JBQWtCO2dCQUlyQixPQUFPO3NCQURWLEtBQUs7dUJBQUMsVUFBVTtnQkFXYixXQUFXO3NCQURkLEtBQUs7dUJBQUMscUJBQXFCO2dCQVFMLElBQUk7c0JBQTFCLEtBQUs7dUJBQUMsY0FBYztnQkFJakIsTUFBTTtzQkFEVCxLQUFLO3VCQUFDLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FyaWFEZXNjcmliZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBSZW5kZXJlcjIsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBtaXhpbkRpc2FibGVkLCBUaGVtZVBhbGV0dGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cblxubGV0IG5leHRJZCA9IDA7XG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0QmFkZ2UuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdEJhZGdlQmFzZSA9IG1peGluRGlzYWJsZWQoY2xhc3Mge30pO1xuXG4vKiogQWxsb3dlZCBwb3NpdGlvbiBvcHRpb25zIGZvciBtYXRCYWRnZVBvc2l0aW9uICovXG5leHBvcnQgdHlwZSBNYXRCYWRnZVBvc2l0aW9uID1cbiAgICAnYWJvdmUgYWZ0ZXInIHwgJ2Fib3ZlIGJlZm9yZScgfCAnYmVsb3cgYmVmb3JlJyB8ICdiZWxvdyBhZnRlcicgfFxuICAgICdiZWZvcmUnIHwgJ2FmdGVyJyB8ICdhYm92ZScgfCAnYmVsb3cnO1xuXG4vKiogQWxsb3dlZCBzaXplIG9wdGlvbnMgZm9yIG1hdEJhZGdlU2l6ZSAqL1xuZXhwb3J0IHR5cGUgTWF0QmFkZ2VTaXplID0gJ3NtYWxsJyB8ICdtZWRpdW0nIHwgJ2xhcmdlJztcblxuY29uc3QgQkFER0VfQ09OVEVOVF9DTEFTUyA9ICdtYXQtYmFkZ2UtY29udGVudCc7XG5cbi8qKiBEaXJlY3RpdmUgdG8gZGlzcGxheSBhIHRleHQgYmFkZ2UuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0QmFkZ2VdJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkOiBtYXRCYWRnZURpc2FibGVkJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWJhZGdlJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1vdmVybGFwXSc6ICdvdmVybGFwJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1hYm92ZV0nOiAnaXNBYm92ZSgpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1iZWxvd10nOiAnIWlzQWJvdmUoKScsXG4gICAgJ1tjbGFzcy5tYXQtYmFkZ2UtYmVmb3JlXSc6ICchaXNBZnRlcigpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1hZnRlcl0nOiAnaXNBZnRlcigpJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1zbWFsbF0nOiAnc2l6ZSA9PT0gXCJzbWFsbFwiJyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1tZWRpdW1dJzogJ3NpemUgPT09IFwibWVkaXVtXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWxhcmdlXSc6ICdzaXplID09PSBcImxhcmdlXCInLFxuICAgICdbY2xhc3MubWF0LWJhZGdlLWhpZGRlbl0nOiAnaGlkZGVuIHx8ICFjb250ZW50JyxcbiAgICAnW2NsYXNzLm1hdC1iYWRnZS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRCYWRnZSBleHRlbmRzIF9NYXRCYWRnZUJhc2UgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQ2FuRGlzYWJsZSB7XG4gIC8qKiBUaGUgY29sb3Igb2YgdGhlIGJhZGdlLiBDYW4gYmUgYHByaW1hcnlgLCBgYWNjZW50YCwgb3IgYHdhcm5gLiAqL1xuICBASW5wdXQoJ21hdEJhZGdlQ29sb3InKVxuICBnZXQgY29sb3IoKTogVGhlbWVQYWxldHRlIHsgcmV0dXJuIHRoaXMuX2NvbG9yOyB9XG4gIHNldCBjb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgdGhpcy5fc2V0Q29sb3IodmFsdWUpO1xuICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XG4gIH1cbiAgcHJpdmF0ZSBfY29sb3I6IFRoZW1lUGFsZXR0ZSA9ICdwcmltYXJ5JztcblxuICAvKiogV2hldGhlciB0aGUgYmFkZ2Ugc2hvdWxkIG92ZXJsYXAgaXRzIGNvbnRlbnRzIG9yIG5vdCAqL1xuICBASW5wdXQoJ21hdEJhZGdlT3ZlcmxhcCcpXG4gIGdldCBvdmVybGFwKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fb3ZlcmxhcDsgfVxuICBzZXQgb3ZlcmxhcCh2YWw6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9vdmVybGFwID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbCk7XG4gIH1cbiAgcHJpdmF0ZSBfb3ZlcmxhcDogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFBvc2l0aW9uIHRoZSBiYWRnZSBzaG91bGQgcmVzaWRlLlxuICAgKiBBY2NlcHRzIGFueSBjb21iaW5hdGlvbiBvZiAnYWJvdmUnfCdiZWxvdycgYW5kICdiZWZvcmUnfCdhZnRlcidcbiAgICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VQb3NpdGlvbicpIHBvc2l0aW9uOiBNYXRCYWRnZVBvc2l0aW9uID0gJ2Fib3ZlIGFmdGVyJztcblxuICAvKiogVGhlIGNvbnRlbnQgZm9yIHRoZSBiYWRnZSAqL1xuICBASW5wdXQoJ21hdEJhZGdlJylcbiAgZ2V0IGNvbnRlbnQoKTogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRlbnQ7XG4gIH1cbiAgc2V0IGNvbnRlbnQobmV3Q29udGVudDogc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkIHwgbnVsbCkge1xuICAgIHRoaXMuX3VwZGF0ZVJlbmRlcmVkQ29udGVudChuZXdDb250ZW50KTtcbiAgfVxuICBwcml2YXRlIF9jb250ZW50OiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgfCBudWxsO1xuXG4gIC8qKiBNZXNzYWdlIHVzZWQgdG8gZGVzY3JpYmUgdGhlIGRlY29yYXRlZCBlbGVtZW50IHZpYSBhcmlhLWRlc2NyaWJlZGJ5ICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VEZXNjcmlwdGlvbicpXG4gIGdldCBkZXNjcmlwdGlvbigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZGVzY3JpcHRpb247IH1cbiAgc2V0IGRlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcpIHtcbiAgICB0aGlzLl91cGRhdGVIb3N0QXJpYURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uKTtcbiAgfVxuICBwcml2YXRlIF9kZXNjcmlwdGlvbjogc3RyaW5nO1xuXG4gIC8qKiBTaXplIG9mIHRoZSBiYWRnZS4gQ2FuIGJlICdzbWFsbCcsICdtZWRpdW0nLCBvciAnbGFyZ2UnLiAqL1xuICBASW5wdXQoJ21hdEJhZGdlU2l6ZScpIHNpemU6IE1hdEJhZGdlU2l6ZSA9ICdtZWRpdW0nO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBpcyBoaWRkZW4uICovXG4gIEBJbnB1dCgnbWF0QmFkZ2VIaWRkZW4nKVxuICBnZXQgaGlkZGVuKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5faGlkZGVuOyB9XG4gIHNldCBoaWRkZW4odmFsOiBib29sZWFuKSB7XG4gICAgdGhpcy5faGlkZGVuID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbCk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZGVuOiBib29sZWFuO1xuXG4gIC8qKiBVbmlxdWUgaWQgZm9yIHRoZSBiYWRnZSAqL1xuICBfaWQ6IG51bWJlciA9IG5leHRJZCsrO1xuXG4gIC8qKiBWaXNpYmxlIGJhZGdlIGVsZW1lbnQuICovXG4gIHByaXZhdGUgX2JhZGdlRWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIE9uSW5pdCBsaWZlY3ljbGUgaG9vayBoYXMgcnVuIHlldCAqL1xuICBwcml2YXRlIF9pc0luaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgcHJpdmF0ZSBfYXJpYURlc2NyaWJlcjogQXJpYURlc2NyaWJlcixcbiAgICAgIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHJpdmF0ZSBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuICAgICAgc3VwZXIoKTtcblxuICAgICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICAgICAgaWYgKG5hdGl2ZUVsZW1lbnQubm9kZVR5cGUgIT09IG5hdGl2ZUVsZW1lbnQuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgdGhyb3cgRXJyb3IoJ21hdEJhZGdlIG11c3QgYmUgYXR0YWNoZWQgdG8gYW4gZWxlbWVudCBub2RlLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBpcyBhYm92ZSB0aGUgaG9zdCBvciBub3QgKi9cbiAgaXNBYm92ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi5pbmRleE9mKCdiZWxvdycpID09PSAtMTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBiYWRnZSBpcyBhZnRlciB0aGUgaG9zdCBvciBub3QgKi9cbiAgaXNBZnRlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi5pbmRleE9mKCdiZWZvcmUnKSA9PT0gLTE7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgZWxlbWVudCBpbnRvIHdoaWNoIHRoZSBiYWRnZSdzIGNvbnRlbnQgaXMgYmVpbmcgcmVuZGVyZWQuIFVuZGVmaW5lZCBpZiB0aGUgZWxlbWVudFxuICAgKiBoYXNuJ3QgYmVlbiBjcmVhdGVkIChlLmcuIGlmIHRoZSBiYWRnZSBkb2Vzbid0IGhhdmUgY29udGVudCkuXG4gICAqL1xuICBnZXRCYWRnZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLl9iYWRnZUVsZW1lbnQ7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBXZSBtYXkgaGF2ZSBzZXJ2ZXItc2lkZSByZW5kZXJlZCBiYWRnZSB0aGF0IHdlIG5lZWQgdG8gY2xlYXIuXG4gICAgLy8gV2UgbmVlZCB0byBkbyB0aGlzIGluIG5nT25Jbml0IGJlY2F1c2UgdGhlIGZ1bGwgY29udGVudCBvZiB0aGUgY29tcG9uZW50XG4gICAgLy8gb24gd2hpY2ggdGhlIGJhZGdlIGlzIGF0dGFjaGVkIHdvbid0IG5lY2Vzc2FyaWx5IGJlIGluIHRoZSBET00gdW50aWwgdGhpcyBwb2ludC5cbiAgICB0aGlzLl9jbGVhckV4aXN0aW5nQmFkZ2VzKCk7XG5cbiAgICBpZiAodGhpcy5jb250ZW50ICYmICF0aGlzLl9iYWRnZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2JhZGdlRWxlbWVudCA9IHRoaXMuX2NyZWF0ZUJhZGdlRWxlbWVudCgpO1xuICAgICAgdGhpcy5fdXBkYXRlUmVuZGVyZWRDb250ZW50KHRoaXMuY29udGVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5faXNJbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICAvLyBWaWV3RW5naW5lIG9ubHk6IHdoZW4gY3JlYXRpbmcgYSBiYWRnZSB0aHJvdWdoIHRoZSBSZW5kZXJlciwgQW5ndWxhciByZW1lbWJlcnMgaXRzIGluZGV4LlxuICAgIC8vIFdlIGhhdmUgdG8gZGVzdHJveSBpdCBvdXJzZWx2ZXMsIG90aGVyd2lzZSBpdCdsbCBiZSByZXRhaW5lZCBpbiBtZW1vcnkuXG4gICAgaWYgKHRoaXMuX3JlbmRlcmVyLmRlc3Ryb3lOb2RlKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5kZXN0cm95Tm9kZSh0aGlzLl9iYWRnZUVsZW1lbnQpO1xuICAgIH1cblxuICAgIHRoaXMuX2FyaWFEZXNjcmliZXIucmVtb3ZlRGVzY3JpcHRpb24odGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLmRlc2NyaXB0aW9uKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIHRoZSBiYWRnZSBlbGVtZW50ICovXG4gIHByaXZhdGUgX2NyZWF0ZUJhZGdlRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3QgYmFkZ2VFbGVtZW50ID0gdGhpcy5fcmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGNvbnN0IGFjdGl2ZUNsYXNzID0gJ21hdC1iYWRnZS1hY3RpdmUnO1xuXG4gICAgYmFkZ2VFbGVtZW50LnNldEF0dHJpYnV0ZSgnaWQnLCBgbWF0LWJhZGdlLWNvbnRlbnQtJHt0aGlzLl9pZH1gKTtcblxuICAgIC8vIFRoZSBiYWRnZSBpcyBhcmlhLWhpZGRlbiBiZWNhdXNlIHdlIGRvbid0IHdhbnQgaXQgdG8gYXBwZWFyIGluIHRoZSBwYWdlJ3MgbmF2aWdhdGlvblxuICAgIC8vIGZsb3cuIEluc3RlYWQsIHdlIHVzZSB0aGUgYmFkZ2UgdG8gZGVzY3JpYmUgdGhlIGRlY29yYXRlZCBlbGVtZW50IHdpdGggYXJpYS1kZXNjcmliZWRieS5cbiAgICBiYWRnZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoQkFER0VfQ09OVEVOVF9DTEFTUyk7XG5cbiAgICBpZiAodGhpcy5fYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJykge1xuICAgICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ19tYXQtYW5pbWF0aW9uLW5vb3BhYmxlJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKGJhZGdlRWxlbWVudCk7XG5cbiAgICAvLyBhbmltYXRlIGluIGFmdGVyIGluc2VydGlvblxuICAgIGlmICh0eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID09PSAnZnVuY3Rpb24nICYmIHRoaXMuX2FuaW1hdGlvbk1vZGUgIT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgYmFkZ2VFbGVtZW50LmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBiYWRnZUVsZW1lbnQuY2xhc3NMaXN0LmFkZChhY3RpdmVDbGFzcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJhZGdlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBVcGRhdGUgdGhlIHRleHQgY29udGVudCBvZiB0aGUgYmFkZ2UgZWxlbWVudCBpbiB0aGUgRE9NLCBjcmVhdGluZyB0aGUgZWxlbWVudCBpZiBuZWNlc3NhcnkuICovXG4gIHByaXZhdGUgX3VwZGF0ZVJlbmRlcmVkQ29udGVudChuZXdDb250ZW50OiBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQgfCBudWxsKTogdm9pZCB7XG4gICAgY29uc3QgbmV3Q29udGVudE5vcm1hbGl6ZWQ6IHN0cmluZyA9IGAke25ld0NvbnRlbnQgPz8gJyd9YC50cmltKCk7XG5cbiAgICAvLyBEb24ndCBjcmVhdGUgdGhlIGJhZGdlIGVsZW1lbnQgaWYgdGhlIGRpcmVjdGl2ZSBpc24ndCBpbml0aWFsaXplZCBiZWNhdXNlIHdlIHdhbnQgdG9cbiAgICAvLyBhcHBlbmQgdGhlIGJhZGdlIGVsZW1lbnQgdG8gdGhlICplbmQqIG9mIHRoZSBob3N0IGVsZW1lbnQncyBjb250ZW50IGZvciBiYWNrd2FyZHNcbiAgICAvLyBjb21wYXRpYmlsaXR5LlxuICAgIGlmICh0aGlzLl9pc0luaXRpYWxpemVkICYmIG5ld0NvbnRlbnROb3JtYWxpemVkICYmICF0aGlzLl9iYWRnZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2JhZGdlRWxlbWVudCA9IHRoaXMuX2NyZWF0ZUJhZGdlRWxlbWVudCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9iYWRnZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuX2JhZGdlRWxlbWVudC50ZXh0Q29udGVudCA9IG5ld0NvbnRlbnROb3JtYWxpemVkO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbnRlbnQgPSBuZXdDb250ZW50Tm9ybWFsaXplZDtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBob3N0IGVsZW1lbnQncyBhcmlhIGRlc2NyaXB0aW9uIHZpYSBBcmlhRGVzY3JpYmVyLiAqL1xuICBwcml2YXRlIF91cGRhdGVIb3N0QXJpYURlc2NyaXB0aW9uKG5ld0Rlc2NyaXB0aW9uOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLnJlbW92ZURlc2NyaXB0aW9uKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5kZXNjcmlwdGlvbik7XG4gICAgaWYgKG5ld0Rlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9hcmlhRGVzY3JpYmVyLmRlc2NyaWJlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgbmV3RGVzY3JpcHRpb24pO1xuICAgIH1cbiAgICB0aGlzLl9kZXNjcmlwdGlvbiA9IG5ld0Rlc2NyaXB0aW9uO1xuICB9XG5cbiAgLyoqIEFkZHMgY3NzIHRoZW1lIGNsYXNzIGdpdmVuIHRoZSBjb2xvciB0byB0aGUgY29tcG9uZW50IGhvc3QgKi9cbiAgcHJpdmF0ZSBfc2V0Q29sb3IoY29sb3JQYWxldHRlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICBjb25zdCBjbGFzc0xpc3QgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0O1xuICAgIGNsYXNzTGlzdC5yZW1vdmUoYG1hdC1iYWRnZS0ke3RoaXMuX2NvbG9yfWApO1xuICAgIGlmIChjb2xvclBhbGV0dGUpIHtcbiAgICAgIGNsYXNzTGlzdC5hZGQoYG1hdC1iYWRnZS0ke2NvbG9yUGFsZXR0ZX1gKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xlYXJzIGFueSBleGlzdGluZyBiYWRnZXMgdGhhdCBtaWdodCBiZSBsZWZ0IG92ZXIgZnJvbSBzZXJ2ZXItc2lkZSByZW5kZXJpbmcuICovXG4gIHByaXZhdGUgX2NsZWFyRXhpc3RpbmdCYWRnZXMoKSB7XG4gICAgLy8gT25seSBjaGVjayBkaXJlY3QgY2hpbGRyZW4gb2YgdGhpcyBob3N0IGVsZW1lbnQgaW4gb3JkZXIgdG8gYXZvaWQgZGVsZXRpbmdcbiAgICAvLyBhbnkgYmFkZ2VzIHRoYXQgbWlnaHQgZXhpc3QgaW4gZGVzY2VuZGFudCBlbGVtZW50cy5cbiAgICBjb25zdCBiYWRnZXMgPVxuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChgOnNjb3BlID4gLiR7QkFER0VfQ09OVEVOVF9DTEFTU31gKTtcbiAgICBmb3IgKGNvbnN0IGJhZGdlRWxlbWVudCBvZiBBcnJheS5mcm9tKGJhZGdlcykpIHtcbiAgICAgIGlmIChiYWRnZUVsZW1lbnQgIT09IHRoaXMuX2JhZGdlRWxlbWVudCkge1xuICAgICAgICBiYWRnZUVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oaWRkZW46IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX292ZXJsYXA6IEJvb2xlYW5JbnB1dDtcbn1cbiJdfQ==
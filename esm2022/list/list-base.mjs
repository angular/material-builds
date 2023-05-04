/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ContentChildren, Directive, ElementRef, inject, Inject, Input, NgZone, Optional, QueryList, } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleRenderer, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subscription, merge } from 'rxjs';
import { MatListItemIcon, MatListItemAvatar, } from './list-item-sections';
import { MAT_LIST_CONFIG } from './tokens';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
class MatListBase {
    constructor() {
        this._isNonInteractive = true;
        this._disableRipple = false;
        this._disabled = false;
        this._defaultOptions = inject(MAT_LIST_CONFIG, { optional: true });
    }
    /** Whether ripples for all list items is disabled. */
    get disableRipple() {
        return this._disableRipple;
    }
    set disableRipple(value) {
        this._disableRipple = coerceBooleanProperty(value);
    }
    /**
     * Whether the entire list is disabled. When disabled, the list itself and each of its list items
     * are disabled.
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatListBase, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatListBase, inputs: { disableRipple: "disableRipple", disabled: "disabled" }, host: { properties: { "attr.aria-disabled": "disabled" } }, ngImport: i0 }); }
}
export { MatListBase };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatListBase, decorators: [{
            type: Directive,
            args: [{
                    host: {
                        '[attr.aria-disabled]': 'disabled',
                    },
                }]
        }], propDecorators: { disableRipple: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });
class MatListItemBase {
    /**
     * The number of lines this list item should reserve space for. If not specified,
     * lines are inferred based on the projected content.
     *
     * Explicitly specifying the number of lines is useful if you want to acquire additional
     * space and enable the wrapping of text. The unscoped text content of a list item will
     * always be able to take up the remaining space of the item, unless it represents the title.
     *
     * A maximum of three lines is supported as per the Material Design specification.
     */
    set lines(lines) {
        this._explicitLines = coerceNumberProperty(lines, null);
        this._updateItemLines(false);
    }
    get disableRipple() {
        return (this.disabled ||
            this._disableRipple ||
            this._noopAnimations ||
            !!this._listBase?.disableRipple);
    }
    set disableRipple(value) {
        this._disableRipple = coerceBooleanProperty(value);
    }
    /** Whether the list-item is disabled. */
    get disabled() {
        return this._disabled || !!this._listBase?.disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
    /**
     * Implemented as part of `RippleTarget`.
     * @docs-private
     */
    get rippleDisabled() {
        return this.disableRipple || !!this.rippleConfig.disabled;
    }
    constructor(_elementRef, _ngZone, _listBase, _platform, globalRippleOptions, animationMode) {
        this._elementRef = _elementRef;
        this._ngZone = _ngZone;
        this._listBase = _listBase;
        this._platform = _platform;
        this._explicitLines = null;
        this._disableRipple = false;
        this._disabled = false;
        this._subscriptions = new Subscription();
        this._rippleRenderer = null;
        /** Whether the list item has unscoped text content. */
        this._hasUnscopedTextContent = false;
        this.rippleConfig = globalRippleOptions || {};
        this._hostElement = this._elementRef.nativeElement;
        this._isButtonElement = this._hostElement.nodeName.toLowerCase() === 'button';
        this._noopAnimations = animationMode === 'NoopAnimations';
        if (_listBase && !_listBase._isNonInteractive) {
            this._initInteractiveListItem();
        }
        // If no type attribute is specified for a host `<button>` element, set it to `button`. If a
        // type attribute is already specified, we do nothing. We do this for backwards compatibility.
        // TODO: Determine if we intend to continue doing this for the MDC-based list.
        if (this._isButtonElement && !this._hostElement.hasAttribute('type')) {
            this._hostElement.setAttribute('type', 'button');
        }
    }
    ngAfterViewInit() {
        this._monitorProjectedLinesAndTitle();
        this._updateItemLines(true);
    }
    ngOnDestroy() {
        this._subscriptions.unsubscribe();
        if (this._rippleRenderer !== null) {
            this._rippleRenderer._removeTriggerEvents();
        }
    }
    /** Whether the list item has icons or avatars. */
    _hasIconOrAvatar() {
        return !!(this._avatars.length || this._icons.length);
    }
    _initInteractiveListItem() {
        this._hostElement.classList.add('mat-mdc-list-item-interactive');
        this._rippleRenderer = new RippleRenderer(this, this._ngZone, this._hostElement, this._platform);
        this._rippleRenderer.setupTriggerEvents(this._hostElement);
    }
    /**
     * Subscribes to changes in the projected title and lines. Triggers a
     * item lines update whenever a change occurs.
     */
    _monitorProjectedLinesAndTitle() {
        this._ngZone.runOutsideAngular(() => {
            this._subscriptions.add(merge(this._lines.changes, this._titles.changes).subscribe(() => this._updateItemLines(false)));
        });
    }
    /**
     * Updates the lines of the list item. Based on the projected user content and optional
     * explicit lines setting, the visual appearance of the list item is determined.
     *
     * This method should be invoked whenever the projected user content changes, or
     * when the explicit lines have been updated.
     *
     * @param recheckUnscopedContent Whether the projected unscoped content should be re-checked.
     *   The unscoped content is not re-checked for every update as it is a rather expensive check
     *   for content that is expected to not change very often.
     */
    _updateItemLines(recheckUnscopedContent) {
        // If the updated is triggered too early before the view and content is initialized,
        // we just skip the update. After view initialization the update is triggered again.
        if (!this._lines || !this._titles || !this._unscopedContent) {
            return;
        }
        // Re-check the DOM for unscoped text content if requested. This needs to
        // happen before any computation or sanity checks run as these rely on the
        // result of whether there is unscoped text content or not.
        if (recheckUnscopedContent) {
            this._checkDomForUnscopedTextContent();
        }
        // Sanity check the list item lines and title in the content. This is a dev-mode only
        // check that can be dead-code eliminated by Terser in production.
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
            sanityCheckListItemContent(this);
        }
        const numberOfLines = this._explicitLines ?? this._inferLinesFromContent();
        const unscopedContentEl = this._unscopedContent.nativeElement;
        // Update the list item element to reflect the number of lines.
        this._hostElement.classList.toggle('mat-mdc-list-item-single-line', numberOfLines <= 1);
        this._hostElement.classList.toggle('mdc-list-item--with-one-line', numberOfLines <= 1);
        this._hostElement.classList.toggle('mdc-list-item--with-two-lines', numberOfLines === 2);
        this._hostElement.classList.toggle('mdc-list-item--with-three-lines', numberOfLines === 3);
        // If there is no title and the unscoped content is the is the only line, the
        // unscoped text content will be treated as the title of the list-item.
        if (this._hasUnscopedTextContent) {
            const treatAsTitle = this._titles.length === 0 && numberOfLines === 1;
            unscopedContentEl.classList.toggle('mdc-list-item__primary-text', treatAsTitle);
            unscopedContentEl.classList.toggle('mdc-list-item__secondary-text', !treatAsTitle);
        }
        else {
            unscopedContentEl.classList.remove('mdc-list-item__primary-text');
            unscopedContentEl.classList.remove('mdc-list-item__secondary-text');
        }
    }
    /**
     * Infers the number of lines based on the projected user content. This is useful
     * if no explicit number of lines has been specified on the list item.
     *
     * The number of lines is inferred based on whether there is a title, the number of
     * additional lines (secondary/tertiary). An additional line is acquired if there is
     * unscoped text content.
     */
    _inferLinesFromContent() {
        let numOfLines = this._titles.length + this._lines.length;
        if (this._hasUnscopedTextContent) {
            numOfLines += 1;
        }
        return numOfLines;
    }
    /** Checks whether the list item has unscoped text content. */
    _checkDomForUnscopedTextContent() {
        this._hasUnscopedTextContent = Array.from(this._unscopedContent.nativeElement.childNodes)
            .filter(node => node.nodeType !== node.COMMENT_NODE)
            .some(node => !!(node.textContent && node.textContent.trim()));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatListItemBase, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: MatListBase, optional: true }, { token: i1.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatListItemBase, inputs: { lines: "lines", disableRipple: "disableRipple", disabled: "disabled" }, host: { properties: { "class.mdc-list-item--disabled": "disabled", "attr.aria-disabled": "disabled", "attr.disabled": "(_isButtonElement && disabled) || null" } }, queries: [{ propertyName: "_avatars", predicate: MatListItemAvatar }, { propertyName: "_icons", predicate: MatListItemIcon }], ngImport: i0 }); }
}
export { MatListItemBase };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatListItemBase, decorators: [{
            type: Directive,
            args: [{
                    host: {
                        '[class.mdc-list-item--disabled]': 'disabled',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.disabled]': '(_isButtonElement && disabled) || null',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: MatListBase, decorators: [{
                    type: Optional
                }] }, { type: i1.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RIPPLE_GLOBAL_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { _avatars: [{
                type: ContentChildren,
                args: [MatListItemAvatar, { descendants: false }]
            }], _icons: [{
                type: ContentChildren,
                args: [MatListItemIcon, { descendants: false }]
            }], lines: [{
                type: Input
            }], disableRipple: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });
/**
 * Sanity checks the configuration of the list item with respect to the amount
 * of lines, whether there is a title, or if there is unscoped text content.
 *
 * The checks are extracted into a top-level function that can be dead-code
 * eliminated by Terser or other optimizers in production mode.
 */
function sanityCheckListItemContent(item) {
    const numTitles = item._titles.length;
    const numLines = item._titles.length;
    if (numTitles > 1) {
        throw Error('A list item cannot have multiple titles.');
    }
    if (numTitles === 0 && numLines > 0) {
        throw Error('A list item line can only be used if there is a list item title.');
    }
    if (numTitles === 0 &&
        item._hasUnscopedTextContent &&
        item._explicitLines !== null &&
        item._explicitLines > 1) {
        throw Error('A list item cannot have wrapping content without a title.');
    }
    if (numLines > 2 || (numLines === 2 && item._hasUnscopedTextContent)) {
        throw Error('A list item can have at maximum three lines.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xpc3QvbGlzdC1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBZSxxQkFBcUIsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hHLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBRUwsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLHlCQUF5QixFQUd6QixjQUFjLEdBRWYsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsWUFBWSxFQUFFLEtBQUssRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBR0wsZUFBZSxFQUNmLGlCQUFpQixHQUNsQixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxVQUFVLENBQUM7OztBQUV6QyxNQU1zQixXQUFXO0lBTmpDO1FBT0Usc0JBQWlCLEdBQVksSUFBSSxDQUFDO1FBVTFCLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBYWhDLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFaEIsb0JBQWUsR0FBRyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7S0FDdkU7SUF4QkMsc0RBQXNEO0lBQ3RELElBQ0ksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsSUFBSSxhQUFhLENBQUMsS0FBbUI7UUFDbkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsSUFDSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFtQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7OEdBdkJtQixXQUFXO2tHQUFYLFdBQVc7O1NBQVgsV0FBVzsyRkFBWCxXQUFXO2tCQU5oQyxTQUFTO21CQUFDO29CQUNULElBQUksRUFBRTt3QkFDSixzQkFBc0IsRUFBRSxVQUFVO3FCQUNuQztpQkFDRjs4QkFPSyxhQUFhO3NCQURoQixLQUFLO2dCQWNGLFFBQVE7c0JBRFgsS0FBSzs7QUFZUixNQVFzQixlQUFlO0lBMkJuQzs7Ozs7Ozs7O09BU0c7SUFDSCxJQUNJLEtBQUssQ0FBQyxLQUE2QjtRQUNyQyxJQUFJLENBQUMsY0FBYyxHQUFHLG9CQUFvQixDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUdELElBQ0ksYUFBYTtRQUNmLE9BQU8sQ0FDTCxJQUFJLENBQUMsUUFBUTtZQUNiLElBQUksQ0FBQyxjQUFjO1lBQ25CLElBQUksQ0FBQyxlQUFlO1lBQ3BCLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FDaEMsQ0FBQztJQUNKLENBQUM7SUFDRCxJQUFJLGFBQWEsQ0FBQyxLQUFjO1FBQzlCLElBQUksQ0FBQyxjQUFjLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUdELHlDQUF5QztJQUN6QyxJQUNJLFFBQVE7UUFDVixPQUFPLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO0lBQ3RELENBQUM7SUFDRCxJQUFJLFFBQVEsQ0FBQyxLQUFtQjtRQUM5QixJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFlRDs7O09BR0c7SUFDSCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQztJQUM1RCxDQUFDO0lBRUQsWUFDUyxXQUFvQyxFQUNqQyxPQUFlLEVBQ0wsU0FBNkIsRUFDekMsU0FBbUIsRUFHM0IsbUJBQXlDLEVBQ0UsYUFBc0I7UUFQMUQsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBQ2pDLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDTCxjQUFTLEdBQVQsU0FBUyxDQUFvQjtRQUN6QyxjQUFTLEdBQVQsU0FBUyxDQUFVO1FBbEQ3QixtQkFBYyxHQUFrQixJQUFJLENBQUM7UUFjN0IsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFVaEMsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUVsQixtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDcEMsb0JBQWUsR0FBMEIsSUFBSSxDQUFDO1FBRXRELHVEQUF1RDtRQUN2RCw0QkFBdUIsR0FBWSxLQUFLLENBQUM7UUEwQnZDLElBQUksQ0FBQyxZQUFZLEdBQUcsbUJBQW1CLElBQUksRUFBRSxDQUFDO1FBQzlDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7UUFDbkQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLFFBQVEsQ0FBQztRQUM5RSxJQUFJLENBQUMsZUFBZSxHQUFHLGFBQWEsS0FBSyxnQkFBZ0IsQ0FBQztRQUUxRCxJQUFJLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRTtZQUM3QyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztTQUNqQztRQUVELDRGQUE0RjtRQUM1Riw4RkFBOEY7UUFDOUYsOEVBQThFO1FBQzlFLElBQUksSUFBSSxDQUFDLGdCQUFnQixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDcEUsSUFBSSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0gsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsOEJBQThCLEVBQUUsQ0FBQztRQUN0QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2xDLElBQUksSUFBSSxDQUFDLGVBQWUsS0FBSyxJQUFJLEVBQUU7WUFDakMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1NBQzdDO0lBQ0gsQ0FBQztJQUVELGtEQUFrRDtJQUNsRCxnQkFBZ0I7UUFDZCxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVPLHdCQUF3QjtRQUM5QixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksY0FBYyxDQUN2QyxJQUFJLEVBQ0osSUFBSSxDQUFDLE9BQU8sRUFDWixJQUFJLENBQUMsWUFBWSxFQUNqQixJQUFJLENBQUMsU0FBUyxDQUNmLENBQUM7UUFDRixJQUFJLENBQUMsZUFBZSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssOEJBQThCO1FBQ3BDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO1lBQ2xDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUNyQixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU8sQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQ2hFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FDN0IsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNILGdCQUFnQixDQUFDLHNCQUErQjtRQUM5QyxvRkFBb0Y7UUFDcEYsb0ZBQW9GO1FBQ3BGLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUMzRCxPQUFPO1NBQ1I7UUFFRCx5RUFBeUU7UUFDekUsMEVBQTBFO1FBQzFFLDJEQUEyRDtRQUMzRCxJQUFJLHNCQUFzQixFQUFFO1lBQzFCLElBQUksQ0FBQywrQkFBK0IsRUFBRSxDQUFDO1NBQ3hDO1FBRUQscUZBQXFGO1FBQ3JGLGtFQUFrRTtRQUNsRSxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLEVBQUU7WUFDakQsMEJBQTBCLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDbEM7UUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsY0FBYyxJQUFJLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzNFLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQztRQUU5RCwrREFBK0Q7UUFDL0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLCtCQUErQixFQUFFLGFBQWEsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4RixJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsOEJBQThCLEVBQUUsYUFBYSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQywrQkFBK0IsRUFBRSxhQUFhLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDekYsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGlDQUFpQyxFQUFFLGFBQWEsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUUzRiw2RUFBNkU7UUFDN0UsdUVBQXVFO1FBQ3ZFLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO1lBQ2hDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxhQUFhLEtBQUssQ0FBQyxDQUFDO1lBQ3RFLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsNkJBQTZCLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDaEYsaUJBQWlCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQywrQkFBK0IsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3BGO2FBQU07WUFDTCxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLDZCQUE2QixDQUFDLENBQUM7WUFDbEUsaUJBQWlCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1NBQ3JFO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSyxzQkFBc0I7UUFDNUIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQVEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU8sQ0FBQyxNQUFNLENBQUM7UUFDNUQsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUU7WUFDaEMsVUFBVSxJQUFJLENBQUMsQ0FBQztTQUNqQjtRQUNELE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRCw4REFBOEQ7SUFDdEQsK0JBQStCO1FBQ3JDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUN2QyxJQUFJLENBQUMsZ0JBQWlCLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FDaEQ7YUFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDOzhHQXhPbUIsZUFBZSxrSUE4RnpCLHlCQUF5Qiw2QkFFYixxQkFBcUI7a0dBaEd2QixlQUFlLHlTQXdCbEIsaUJBQWlCLHlDQUNqQixlQUFlOztTQXpCWixlQUFlOzJGQUFmLGVBQWU7a0JBUnBDLFNBQVM7bUJBQUM7b0JBQ1QsSUFBSSxFQUFFO3dCQUNKLGlDQUFpQyxFQUFFLFVBQVU7d0JBQzdDLHNCQUFzQixFQUFFLFVBQVU7d0JBQ2xDLGlCQUFpQixFQUFFLHdDQUF3QztxQkFDNUQ7aUJBQ0Y7OzBCQTZGSSxRQUFROzswQkFFUixRQUFROzswQkFDUixNQUFNOzJCQUFDLHlCQUF5Qjs7MEJBRWhDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzRDQXhFZSxRQUFRO3NCQUFqRSxlQUFlO3VCQUFDLGlCQUFpQixFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQztnQkFDQSxNQUFNO3NCQUE3RCxlQUFlO3VCQUFDLGVBQWUsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUM7Z0JBYWxELEtBQUs7c0JBRFIsS0FBSztnQkFRRixhQUFhO3NCQURoQixLQUFLO2dCQWdCRixRQUFRO3NCQURYLEtBQUs7O0FBZ0xSOzs7Ozs7R0FNRztBQUNILFNBQVMsMEJBQTBCLENBQUMsSUFBcUI7SUFDdkQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQVEsQ0FBQyxNQUFNLENBQUM7SUFDdkMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQVEsQ0FBQyxNQUFNLENBQUM7SUFFdEMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxFQUFFO1FBQ2pCLE1BQU0sS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7S0FDekQ7SUFDRCxJQUFJLFNBQVMsS0FBSyxDQUFDLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTtRQUNuQyxNQUFNLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO0tBQ2pGO0lBQ0QsSUFDRSxTQUFTLEtBQUssQ0FBQztRQUNmLElBQUksQ0FBQyx1QkFBdUI7UUFDNUIsSUFBSSxDQUFDLGNBQWMsS0FBSyxJQUFJO1FBQzVCLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxFQUN2QjtRQUNBLE1BQU0sS0FBSyxDQUFDLDJEQUEyRCxDQUFDLENBQUM7S0FDMUU7SUFDRCxJQUFJLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFO1FBQ3BFLE1BQU0sS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7S0FDN0Q7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHksIGNvZXJjZU51bWJlclByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBpbmplY3QsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsXG4gIFJpcHBsZUNvbmZpZyxcbiAgUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgUmlwcGxlUmVuZGVyZXIsXG4gIFJpcHBsZVRhcmdldCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7U3Vic2NyaXB0aW9uLCBtZXJnZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBNYXRMaXN0SXRlbUxpbmUsXG4gIE1hdExpc3RJdGVtVGl0bGUsXG4gIE1hdExpc3RJdGVtSWNvbixcbiAgTWF0TGlzdEl0ZW1BdmF0YXIsXG59IGZyb20gJy4vbGlzdC1pdGVtLXNlY3Rpb25zJztcbmltcG9ydCB7TUFUX0xJU1RfQ09ORklHfSBmcm9tICcuL3Rva2Vucyc7XG5cbkBEaXJlY3RpdmUoe1xuICBob3N0OiB7XG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgfSxcbn0pXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdExpc3RCYXNlIHtcbiAgX2lzTm9uSW50ZXJhY3RpdmU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIC8qKiBXaGV0aGVyIHJpcHBsZXMgZm9yIGFsbCBsaXN0IGl0ZW1zIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZVJpcHBsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZVJpcHBsZTtcbiAgfVxuICBzZXQgZGlzYWJsZVJpcHBsZSh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZVJpcHBsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZVJpcHBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBlbnRpcmUgbGlzdCBpcyBkaXNhYmxlZC4gV2hlbiBkaXNhYmxlZCwgdGhlIGxpc3QgaXRzZWxmIGFuZCBlYWNoIG9mIGl0cyBsaXN0IGl0ZW1zXG4gICAqIGFyZSBkaXNhYmxlZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgX2RlZmF1bHRPcHRpb25zID0gaW5qZWN0KE1BVF9MSVNUX0NPTkZJRywge29wdGlvbmFsOiB0cnVlfSk7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5tZGMtbGlzdC1pdGVtLS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJ1thdHRyLmRpc2FibGVkXSc6ICcoX2lzQnV0dG9uRWxlbWVudCAmJiBkaXNhYmxlZCkgfHwgbnVsbCcsXG4gIH0sXG59KVxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXRMaXN0SXRlbUJhc2UgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIFJpcHBsZVRhcmdldCB7XG4gIC8qKiBRdWVyeSBsaXN0IG1hdGNoaW5nIGxpc3QtaXRlbSBsaW5lIGVsZW1lbnRzLiAqL1xuICBhYnN0cmFjdCBfbGluZXM6IFF1ZXJ5TGlzdDxNYXRMaXN0SXRlbUxpbmU+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBRdWVyeSBsaXN0IG1hdGNoaW5nIGxpc3QtaXRlbSB0aXRsZSBlbGVtZW50cy4gKi9cbiAgYWJzdHJhY3QgX3RpdGxlczogUXVlcnlMaXN0PE1hdExpc3RJdGVtVGl0bGU+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBFbGVtZW50IHJlZmVyZW5jZSB0byB0aGUgdW5zY29wZWQgY29udGVudCBpbiBhIGxpc3QgaXRlbS5cbiAgICpcbiAgICogVW5zY29wZWQgY29udGVudCBpcyB1c2VyLXByb2plY3RlZCB0ZXh0IGNvbnRlbnQgaW4gYSBsaXN0IGl0ZW0gdGhhdCBpc1xuICAgKiBub3QgcGFydCBvZiBhbiBleHBsaWNpdCBsaW5lIG9yIHRpdGxlLlxuICAgKi9cbiAgYWJzdHJhY3QgX3Vuc2NvcGVkQ29udGVudDogRWxlbWVudFJlZjxIVE1MU3BhbkVsZW1lbnQ+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBIb3N0IGVsZW1lbnQgZm9yIHRoZSBsaXN0IGl0ZW0uICovXG4gIF9ob3N0RWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIGluZGljYXRlIHdoZXRoZXIgdGhlIGhvc3QgZWxlbWVudCBpcyBhIGJ1dHRvbiBvciBub3QgKi9cbiAgX2lzQnV0dG9uRWxlbWVudDogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciBhbmltYXRpb25zIGFyZSBkaXNhYmxlZC4gKi9cbiAgX25vb3BBbmltYXRpb25zOiBib29sZWFuO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGlzdEl0ZW1BdmF0YXIsIHtkZXNjZW5kYW50czogZmFsc2V9KSBfYXZhdGFyczogUXVlcnlMaXN0PG5ldmVyPjtcbiAgQENvbnRlbnRDaGlsZHJlbihNYXRMaXN0SXRlbUljb24sIHtkZXNjZW5kYW50czogZmFsc2V9KSBfaWNvbnM6IFF1ZXJ5TGlzdDxuZXZlcj47XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgbGluZXMgdGhpcyBsaXN0IGl0ZW0gc2hvdWxkIHJlc2VydmUgc3BhY2UgZm9yLiBJZiBub3Qgc3BlY2lmaWVkLFxuICAgKiBsaW5lcyBhcmUgaW5mZXJyZWQgYmFzZWQgb24gdGhlIHByb2plY3RlZCBjb250ZW50LlxuICAgKlxuICAgKiBFeHBsaWNpdGx5IHNwZWNpZnlpbmcgdGhlIG51bWJlciBvZiBsaW5lcyBpcyB1c2VmdWwgaWYgeW91IHdhbnQgdG8gYWNxdWlyZSBhZGRpdGlvbmFsXG4gICAqIHNwYWNlIGFuZCBlbmFibGUgdGhlIHdyYXBwaW5nIG9mIHRleHQuIFRoZSB1bnNjb3BlZCB0ZXh0IGNvbnRlbnQgb2YgYSBsaXN0IGl0ZW0gd2lsbFxuICAgKiBhbHdheXMgYmUgYWJsZSB0byB0YWtlIHVwIHRoZSByZW1haW5pbmcgc3BhY2Ugb2YgdGhlIGl0ZW0sIHVubGVzcyBpdCByZXByZXNlbnRzIHRoZSB0aXRsZS5cbiAgICpcbiAgICogQSBtYXhpbXVtIG9mIHRocmVlIGxpbmVzIGlzIHN1cHBvcnRlZCBhcyBwZXIgdGhlIE1hdGVyaWFsIERlc2lnbiBzcGVjaWZpY2F0aW9uLlxuICAgKi9cbiAgQElucHV0KClcbiAgc2V0IGxpbmVzKGxpbmVzOiBudW1iZXIgfCBzdHJpbmcgfCBudWxsKSB7XG4gICAgdGhpcy5fZXhwbGljaXRMaW5lcyA9IGNvZXJjZU51bWJlclByb3BlcnR5KGxpbmVzLCBudWxsKTtcbiAgICB0aGlzLl91cGRhdGVJdGVtTGluZXMoZmFsc2UpO1xuICB9XG4gIF9leHBsaWNpdExpbmVzOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZVJpcHBsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5kaXNhYmxlZCB8fFxuICAgICAgdGhpcy5fZGlzYWJsZVJpcHBsZSB8fFxuICAgICAgdGhpcy5fbm9vcEFuaW1hdGlvbnMgfHxcbiAgICAgICEhdGhpcy5fbGlzdEJhc2U/LmRpc2FibGVSaXBwbGVcbiAgICApO1xuICB9XG4gIHNldCBkaXNhYmxlUmlwcGxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZVJpcHBsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZVJpcHBsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsaXN0LWl0ZW0gaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQgfHwgISF0aGlzLl9saXN0QmFzZT8uZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICBwcml2YXRlIF9zdWJzY3JpcHRpb25zID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICBwcml2YXRlIF9yaXBwbGVSZW5kZXJlcjogUmlwcGxlUmVuZGVyZXIgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgbGlzdCBpdGVtIGhhcyB1bnNjb3BlZCB0ZXh0IGNvbnRlbnQuICovXG4gIF9oYXNVbnNjb3BlZFRleHRDb250ZW50OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgYFJpcHBsZVRhcmdldGAuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnICYgUmlwcGxlR2xvYmFsT3B0aW9ucztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBgUmlwcGxlVGFyZ2V0YC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHJpcHBsZURpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVSaXBwbGUgfHwgISF0aGlzLnJpcHBsZUNvbmZpZy5kaXNhYmxlZDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJvdGVjdGVkIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9saXN0QmFzZTogTWF0TGlzdEJhc2UgfCBudWxsLFxuICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKVxuICAgIEBJbmplY3QoTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUylcbiAgICBnbG9iYWxSaXBwbGVPcHRpb25zPzogUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uTW9kZT86IHN0cmluZyxcbiAgKSB7XG4gICAgdGhpcy5yaXBwbGVDb25maWcgPSBnbG9iYWxSaXBwbGVPcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuX2hvc3RFbGVtZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuX2lzQnV0dG9uRWxlbWVudCA9IHRoaXMuX2hvc3RFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdidXR0b24nO1xuICAgIHRoaXMuX25vb3BBbmltYXRpb25zID0gYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJztcblxuICAgIGlmIChfbGlzdEJhc2UgJiYgIV9saXN0QmFzZS5faXNOb25JbnRlcmFjdGl2ZSkge1xuICAgICAgdGhpcy5faW5pdEludGVyYWN0aXZlTGlzdEl0ZW0oKTtcbiAgICB9XG5cbiAgICAvLyBJZiBubyB0eXBlIGF0dHJpYnV0ZSBpcyBzcGVjaWZpZWQgZm9yIGEgaG9zdCBgPGJ1dHRvbj5gIGVsZW1lbnQsIHNldCBpdCB0byBgYnV0dG9uYC4gSWYgYVxuICAgIC8vIHR5cGUgYXR0cmlidXRlIGlzIGFscmVhZHkgc3BlY2lmaWVkLCB3ZSBkbyBub3RoaW5nLiBXZSBkbyB0aGlzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAgICAvLyBUT0RPOiBEZXRlcm1pbmUgaWYgd2UgaW50ZW5kIHRvIGNvbnRpbnVlIGRvaW5nIHRoaXMgZm9yIHRoZSBNREMtYmFzZWQgbGlzdC5cbiAgICBpZiAodGhpcy5faXNCdXR0b25FbGVtZW50ICYmICF0aGlzLl9ob3N0RWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3R5cGUnKSkge1xuICAgICAgdGhpcy5faG9zdEVsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2J1dHRvbicpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9tb25pdG9yUHJvamVjdGVkTGluZXNBbmRUaXRsZSgpO1xuICAgIHRoaXMuX3VwZGF0ZUl0ZW1MaW5lcyh0cnVlKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMudW5zdWJzY3JpYmUoKTtcbiAgICBpZiAodGhpcy5fcmlwcGxlUmVuZGVyZXIgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxpc3QgaXRlbSBoYXMgaWNvbnMgb3IgYXZhdGFycy4gKi9cbiAgX2hhc0ljb25PckF2YXRhcigpIHtcbiAgICByZXR1cm4gISEodGhpcy5fYXZhdGFycy5sZW5ndGggfHwgdGhpcy5faWNvbnMubGVuZ3RoKTtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXRJbnRlcmFjdGl2ZUxpc3RJdGVtKCkge1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hdC1tZGMtbGlzdC1pdGVtLWludGVyYWN0aXZlJyk7XG4gICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIgPSBuZXcgUmlwcGxlUmVuZGVyZXIoXG4gICAgICB0aGlzLFxuICAgICAgdGhpcy5fbmdab25lLFxuICAgICAgdGhpcy5faG9zdEVsZW1lbnQsXG4gICAgICB0aGlzLl9wbGF0Zm9ybSxcbiAgICApO1xuICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyLnNldHVwVHJpZ2dlckV2ZW50cyh0aGlzLl9ob3N0RWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyB0byBjaGFuZ2VzIGluIHRoZSBwcm9qZWN0ZWQgdGl0bGUgYW5kIGxpbmVzLiBUcmlnZ2VycyBhXG4gICAqIGl0ZW0gbGluZXMgdXBkYXRlIHdoZW5ldmVyIGEgY2hhbmdlIG9jY3Vycy5cbiAgICovXG4gIHByaXZhdGUgX21vbml0b3JQcm9qZWN0ZWRMaW5lc0FuZFRpdGxlKCkge1xuICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICB0aGlzLl9zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgbWVyZ2UodGhpcy5fbGluZXMhLmNoYW5nZXMsIHRoaXMuX3RpdGxlcyEuY2hhbmdlcykuc3Vic2NyaWJlKCgpID0+XG4gICAgICAgICAgdGhpcy5fdXBkYXRlSXRlbUxpbmVzKGZhbHNlKSxcbiAgICAgICAgKSxcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgbGluZXMgb2YgdGhlIGxpc3QgaXRlbS4gQmFzZWQgb24gdGhlIHByb2plY3RlZCB1c2VyIGNvbnRlbnQgYW5kIG9wdGlvbmFsXG4gICAqIGV4cGxpY2l0IGxpbmVzIHNldHRpbmcsIHRoZSB2aXN1YWwgYXBwZWFyYW5jZSBvZiB0aGUgbGlzdCBpdGVtIGlzIGRldGVybWluZWQuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBpbnZva2VkIHdoZW5ldmVyIHRoZSBwcm9qZWN0ZWQgdXNlciBjb250ZW50IGNoYW5nZXMsIG9yXG4gICAqIHdoZW4gdGhlIGV4cGxpY2l0IGxpbmVzIGhhdmUgYmVlbiB1cGRhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0gcmVjaGVja1Vuc2NvcGVkQ29udGVudCBXaGV0aGVyIHRoZSBwcm9qZWN0ZWQgdW5zY29wZWQgY29udGVudCBzaG91bGQgYmUgcmUtY2hlY2tlZC5cbiAgICogICBUaGUgdW5zY29wZWQgY29udGVudCBpcyBub3QgcmUtY2hlY2tlZCBmb3IgZXZlcnkgdXBkYXRlIGFzIGl0IGlzIGEgcmF0aGVyIGV4cGVuc2l2ZSBjaGVja1xuICAgKiAgIGZvciBjb250ZW50IHRoYXQgaXMgZXhwZWN0ZWQgdG8gbm90IGNoYW5nZSB2ZXJ5IG9mdGVuLlxuICAgKi9cbiAgX3VwZGF0ZUl0ZW1MaW5lcyhyZWNoZWNrVW5zY29wZWRDb250ZW50OiBib29sZWFuKSB7XG4gICAgLy8gSWYgdGhlIHVwZGF0ZWQgaXMgdHJpZ2dlcmVkIHRvbyBlYXJseSBiZWZvcmUgdGhlIHZpZXcgYW5kIGNvbnRlbnQgaXMgaW5pdGlhbGl6ZWQsXG4gICAgLy8gd2UganVzdCBza2lwIHRoZSB1cGRhdGUuIEFmdGVyIHZpZXcgaW5pdGlhbGl6YXRpb24gdGhlIHVwZGF0ZSBpcyB0cmlnZ2VyZWQgYWdhaW4uXG4gICAgaWYgKCF0aGlzLl9saW5lcyB8fCAhdGhpcy5fdGl0bGVzIHx8ICF0aGlzLl91bnNjb3BlZENvbnRlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBSZS1jaGVjayB0aGUgRE9NIGZvciB1bnNjb3BlZCB0ZXh0IGNvbnRlbnQgaWYgcmVxdWVzdGVkLiBUaGlzIG5lZWRzIHRvXG4gICAgLy8gaGFwcGVuIGJlZm9yZSBhbnkgY29tcHV0YXRpb24gb3Igc2FuaXR5IGNoZWNrcyBydW4gYXMgdGhlc2UgcmVseSBvbiB0aGVcbiAgICAvLyByZXN1bHQgb2Ygd2hldGhlciB0aGVyZSBpcyB1bnNjb3BlZCB0ZXh0IGNvbnRlbnQgb3Igbm90LlxuICAgIGlmIChyZWNoZWNrVW5zY29wZWRDb250ZW50KSB7XG4gICAgICB0aGlzLl9jaGVja0RvbUZvclVuc2NvcGVkVGV4dENvbnRlbnQoKTtcbiAgICB9XG5cbiAgICAvLyBTYW5pdHkgY2hlY2sgdGhlIGxpc3QgaXRlbSBsaW5lcyBhbmQgdGl0bGUgaW4gdGhlIGNvbnRlbnQuIFRoaXMgaXMgYSBkZXYtbW9kZSBvbmx5XG4gICAgLy8gY2hlY2sgdGhhdCBjYW4gYmUgZGVhZC1jb2RlIGVsaW1pbmF0ZWQgYnkgVGVyc2VyIGluIHByb2R1Y3Rpb24uXG4gICAgaWYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkge1xuICAgICAgc2FuaXR5Q2hlY2tMaXN0SXRlbUNvbnRlbnQodGhpcyk7XG4gICAgfVxuXG4gICAgY29uc3QgbnVtYmVyT2ZMaW5lcyA9IHRoaXMuX2V4cGxpY2l0TGluZXMgPz8gdGhpcy5faW5mZXJMaW5lc0Zyb21Db250ZW50KCk7XG4gICAgY29uc3QgdW5zY29wZWRDb250ZW50RWwgPSB0aGlzLl91bnNjb3BlZENvbnRlbnQubmF0aXZlRWxlbWVudDtcblxuICAgIC8vIFVwZGF0ZSB0aGUgbGlzdCBpdGVtIGVsZW1lbnQgdG8gcmVmbGVjdCB0aGUgbnVtYmVyIG9mIGxpbmVzLlxuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ21hdC1tZGMtbGlzdC1pdGVtLXNpbmdsZS1saW5lJywgbnVtYmVyT2ZMaW5lcyA8PSAxKTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdtZGMtbGlzdC1pdGVtLS13aXRoLW9uZS1saW5lJywgbnVtYmVyT2ZMaW5lcyA8PSAxKTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdtZGMtbGlzdC1pdGVtLS13aXRoLXR3by1saW5lcycsIG51bWJlck9mTGluZXMgPT09IDIpO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ21kYy1saXN0LWl0ZW0tLXdpdGgtdGhyZWUtbGluZXMnLCBudW1iZXJPZkxpbmVzID09PSAzKTtcblxuICAgIC8vIElmIHRoZXJlIGlzIG5vIHRpdGxlIGFuZCB0aGUgdW5zY29wZWQgY29udGVudCBpcyB0aGUgaXMgdGhlIG9ubHkgbGluZSwgdGhlXG4gICAgLy8gdW5zY29wZWQgdGV4dCBjb250ZW50IHdpbGwgYmUgdHJlYXRlZCBhcyB0aGUgdGl0bGUgb2YgdGhlIGxpc3QtaXRlbS5cbiAgICBpZiAodGhpcy5faGFzVW5zY29wZWRUZXh0Q29udGVudCkge1xuICAgICAgY29uc3QgdHJlYXRBc1RpdGxlID0gdGhpcy5fdGl0bGVzLmxlbmd0aCA9PT0gMCAmJiBudW1iZXJPZkxpbmVzID09PSAxO1xuICAgICAgdW5zY29wZWRDb250ZW50RWwuY2xhc3NMaXN0LnRvZ2dsZSgnbWRjLWxpc3QtaXRlbV9fcHJpbWFyeS10ZXh0JywgdHJlYXRBc1RpdGxlKTtcbiAgICAgIHVuc2NvcGVkQ29udGVudEVsLmNsYXNzTGlzdC50b2dnbGUoJ21kYy1saXN0LWl0ZW1fX3NlY29uZGFyeS10ZXh0JywgIXRyZWF0QXNUaXRsZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVuc2NvcGVkQ29udGVudEVsLmNsYXNzTGlzdC5yZW1vdmUoJ21kYy1saXN0LWl0ZW1fX3ByaW1hcnktdGV4dCcpO1xuICAgICAgdW5zY29wZWRDb250ZW50RWwuY2xhc3NMaXN0LnJlbW92ZSgnbWRjLWxpc3QtaXRlbV9fc2Vjb25kYXJ5LXRleHQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5mZXJzIHRoZSBudW1iZXIgb2YgbGluZXMgYmFzZWQgb24gdGhlIHByb2plY3RlZCB1c2VyIGNvbnRlbnQuIFRoaXMgaXMgdXNlZnVsXG4gICAqIGlmIG5vIGV4cGxpY2l0IG51bWJlciBvZiBsaW5lcyBoYXMgYmVlbiBzcGVjaWZpZWQgb24gdGhlIGxpc3QgaXRlbS5cbiAgICpcbiAgICogVGhlIG51bWJlciBvZiBsaW5lcyBpcyBpbmZlcnJlZCBiYXNlZCBvbiB3aGV0aGVyIHRoZXJlIGlzIGEgdGl0bGUsIHRoZSBudW1iZXIgb2ZcbiAgICogYWRkaXRpb25hbCBsaW5lcyAoc2Vjb25kYXJ5L3RlcnRpYXJ5KS4gQW4gYWRkaXRpb25hbCBsaW5lIGlzIGFjcXVpcmVkIGlmIHRoZXJlIGlzXG4gICAqIHVuc2NvcGVkIHRleHQgY29udGVudC5cbiAgICovXG4gIHByaXZhdGUgX2luZmVyTGluZXNGcm9tQ29udGVudCgpIHtcbiAgICBsZXQgbnVtT2ZMaW5lcyA9IHRoaXMuX3RpdGxlcyEubGVuZ3RoICsgdGhpcy5fbGluZXMhLmxlbmd0aDtcbiAgICBpZiAodGhpcy5faGFzVW5zY29wZWRUZXh0Q29udGVudCkge1xuICAgICAgbnVtT2ZMaW5lcyArPSAxO1xuICAgIH1cbiAgICByZXR1cm4gbnVtT2ZMaW5lcztcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgbGlzdCBpdGVtIGhhcyB1bnNjb3BlZCB0ZXh0IGNvbnRlbnQuICovXG4gIHByaXZhdGUgX2NoZWNrRG9tRm9yVW5zY29wZWRUZXh0Q29udGVudCgpIHtcbiAgICB0aGlzLl9oYXNVbnNjb3BlZFRleHRDb250ZW50ID0gQXJyYXkuZnJvbTxDaGlsZE5vZGU+KFxuICAgICAgdGhpcy5fdW5zY29wZWRDb250ZW50IS5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXMsXG4gICAgKVxuICAgICAgLmZpbHRlcihub2RlID0+IG5vZGUubm9kZVR5cGUgIT09IG5vZGUuQ09NTUVOVF9OT0RFKVxuICAgICAgLnNvbWUobm9kZSA9PiAhIShub2RlLnRleHRDb250ZW50ICYmIG5vZGUudGV4dENvbnRlbnQudHJpbSgpKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTYW5pdHkgY2hlY2tzIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSBsaXN0IGl0ZW0gd2l0aCByZXNwZWN0IHRvIHRoZSBhbW91bnRcbiAqIG9mIGxpbmVzLCB3aGV0aGVyIHRoZXJlIGlzIGEgdGl0bGUsIG9yIGlmIHRoZXJlIGlzIHVuc2NvcGVkIHRleHQgY29udGVudC5cbiAqXG4gKiBUaGUgY2hlY2tzIGFyZSBleHRyYWN0ZWQgaW50byBhIHRvcC1sZXZlbCBmdW5jdGlvbiB0aGF0IGNhbiBiZSBkZWFkLWNvZGVcbiAqIGVsaW1pbmF0ZWQgYnkgVGVyc2VyIG9yIG90aGVyIG9wdGltaXplcnMgaW4gcHJvZHVjdGlvbiBtb2RlLlxuICovXG5mdW5jdGlvbiBzYW5pdHlDaGVja0xpc3RJdGVtQ29udGVudChpdGVtOiBNYXRMaXN0SXRlbUJhc2UpIHtcbiAgY29uc3QgbnVtVGl0bGVzID0gaXRlbS5fdGl0bGVzIS5sZW5ndGg7XG4gIGNvbnN0IG51bUxpbmVzID0gaXRlbS5fdGl0bGVzIS5sZW5ndGg7XG5cbiAgaWYgKG51bVRpdGxlcyA+IDEpIHtcbiAgICB0aHJvdyBFcnJvcignQSBsaXN0IGl0ZW0gY2Fubm90IGhhdmUgbXVsdGlwbGUgdGl0bGVzLicpO1xuICB9XG4gIGlmIChudW1UaXRsZXMgPT09IDAgJiYgbnVtTGluZXMgPiAwKSB7XG4gICAgdGhyb3cgRXJyb3IoJ0EgbGlzdCBpdGVtIGxpbmUgY2FuIG9ubHkgYmUgdXNlZCBpZiB0aGVyZSBpcyBhIGxpc3QgaXRlbSB0aXRsZS4nKTtcbiAgfVxuICBpZiAoXG4gICAgbnVtVGl0bGVzID09PSAwICYmXG4gICAgaXRlbS5faGFzVW5zY29wZWRUZXh0Q29udGVudCAmJlxuICAgIGl0ZW0uX2V4cGxpY2l0TGluZXMgIT09IG51bGwgJiZcbiAgICBpdGVtLl9leHBsaWNpdExpbmVzID4gMVxuICApIHtcbiAgICB0aHJvdyBFcnJvcignQSBsaXN0IGl0ZW0gY2Fubm90IGhhdmUgd3JhcHBpbmcgY29udGVudCB3aXRob3V0IGEgdGl0bGUuJyk7XG4gIH1cbiAgaWYgKG51bUxpbmVzID4gMiB8fCAobnVtTGluZXMgPT09IDIgJiYgaXRlbS5faGFzVW5zY29wZWRUZXh0Q29udGVudCkpIHtcbiAgICB0aHJvdyBFcnJvcignQSBsaXN0IGl0ZW0gY2FuIGhhdmUgYXQgbWF4aW11bSB0aHJlZSBsaW5lcy4nKTtcbiAgfVxufVxuIl19
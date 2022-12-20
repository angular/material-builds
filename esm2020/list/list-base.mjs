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
/** @docs-private */
export class MatListBase {
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
}
MatListBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatListBase, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatListBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: MatListBase, inputs: { disableRipple: "disableRipple", disabled: "disabled" }, host: { properties: { "attr.aria-disabled": "disabled" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatListBase, decorators: [{
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
/** @docs-private */
export class MatListItemBase {
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
        this._noopAnimations = animationMode === 'NoopAnimations';
        if (_listBase && !_listBase._isNonInteractive) {
            this._initInteractiveListItem();
        }
        // If no type attribute is specified for a host `<button>` element, set it to `button`. If a
        // type attribute is already specified, we do nothing. We do this for backwards compatibility.
        // TODO: Determine if we intend to continue doing this for the MDC-based list.
        if (this._hostElement.nodeName.toLowerCase() === 'button' &&
            !this._hostElement.hasAttribute('type')) {
            this._hostElement.setAttribute('type', 'button');
        }
    }
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
}
MatListItemBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatListItemBase, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: MatListBase, optional: true }, { token: i1.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatListItemBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0", type: MatListItemBase, inputs: { lines: "lines", disableRipple: "disableRipple", disabled: "disabled" }, host: { properties: { "class.mdc-list-item--disabled": "disabled", "attr.aria-disabled": "disabled" } }, queries: [{ propertyName: "_avatars", predicate: MatListItemAvatar }, { propertyName: "_icons", predicate: MatListItemIcon }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatListItemBase, decorators: [{
            type: Directive,
            args: [{
                    host: {
                        '[class.mdc-list-item--disabled]': 'disabled',
                        '[attr.aria-disabled]': 'disabled',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xpc3QvbGlzdC1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBZSxxQkFBcUIsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hHLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBRUwsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLHlCQUF5QixFQUd6QixjQUFjLEdBRWYsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsWUFBWSxFQUFFLEtBQUssRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUN6QyxPQUFPLEVBR0wsZUFBZSxFQUNmLGlCQUFpQixHQUNsQixNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxVQUFVLENBQUM7OztBQU96QyxvQkFBb0I7QUFDcEIsTUFBTSxPQUFnQixXQUFXO0lBTmpDO1FBT0Usc0JBQWlCLEdBQVksSUFBSSxDQUFDO1FBVTFCLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBYWhDLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFaEIsb0JBQWUsR0FBRyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7S0FDdkU7SUF4QkMsc0RBQXNEO0lBQ3RELElBQ0ksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsSUFB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LEtBQUssQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7UUFDbkMsTUFBTSxLQUFLLENBQUMsa0VBQWtFLENBQUMsQ0FBQztLQUNqRjtJQUNELElBQ0UsU0FBUyxLQUFLLENBQUM7UUFDZixJQUFJLENBQUMsdUJBQXVCO1FBQzVCLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSTtRQUM1QixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsRUFDdkI7UUFDQSxNQUFNLEtBQUssQ0FBQywyREFBMkQsQ0FBQyxDQUFDO0tBQzFFO0lBQ0QsSUFBSSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsdUJBQXVCLENBQUMsRUFBRTtRQUNwRSxNQUFNLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO0tBQzdEO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5LCBjb2VyY2VOdW1iZXJQcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgaW5qZWN0LFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLFxuICBSaXBwbGVDb25maWcsXG4gIFJpcHBsZUdsb2JhbE9wdGlvbnMsXG4gIFJpcHBsZVJlbmRlcmVyLFxuICBSaXBwbGVUYXJnZXQsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbiwgbWVyZ2V9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgTWF0TGlzdEl0ZW1MaW5lLFxuICBNYXRMaXN0SXRlbVRpdGxlLFxuICBNYXRMaXN0SXRlbUljb24sXG4gIE1hdExpc3RJdGVtQXZhdGFyLFxufSBmcm9tICcuL2xpc3QtaXRlbS1zZWN0aW9ucyc7XG5pbXBvcnQge01BVF9MSVNUX0NPTkZJR30gZnJvbSAnLi90b2tlbnMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgaG9zdDoge1xuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gIH0sXG59KVxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXRMaXN0QmFzZSB7XG4gIF9pc05vbkludGVyYWN0aXZlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciByaXBwbGVzIGZvciBhbGwgbGlzdCBpdGVtcyBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVSaXBwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVSaXBwbGU7XG4gIH1cbiAgc2V0IGRpc2FibGVSaXBwbGUodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVSaXBwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZW50aXJlIGxpc3QgaXMgZGlzYWJsZWQuIFdoZW4gZGlzYWJsZWQsIHRoZSBsaXN0IGl0c2VsZiBhbmQgZWFjaCBvZiBpdHMgbGlzdCBpdGVtc1xuICAgKiBhcmUgZGlzYWJsZWQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIF9kZWZhdWx0T3B0aW9ucyA9IGluamVjdChNQVRfTElTVF9DT05GSUcsIHtvcHRpb25hbDogdHJ1ZX0pO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgaG9zdDoge1xuICAgICdbY2xhc3MubWRjLWxpc3QtaXRlbS0tZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICB9LFxufSlcbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0TGlzdEl0ZW1CYXNlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBSaXBwbGVUYXJnZXQge1xuICAvKiogUXVlcnkgbGlzdCBtYXRjaGluZyBsaXN0LWl0ZW0gbGluZSBlbGVtZW50cy4gKi9cbiAgYWJzdHJhY3QgX2xpbmVzOiBRdWVyeUxpc3Q8TWF0TGlzdEl0ZW1MaW5lPiB8IHVuZGVmaW5lZDtcblxuICAvKiogUXVlcnkgbGlzdCBtYXRjaGluZyBsaXN0LWl0ZW0gdGl0bGUgZWxlbWVudHMuICovXG4gIGFic3RyYWN0IF90aXRsZXM6IFF1ZXJ5TGlzdDxNYXRMaXN0SXRlbVRpdGxlPiB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogRWxlbWVudCByZWZlcmVuY2UgdG8gdGhlIHVuc2NvcGVkIGNvbnRlbnQgaW4gYSBsaXN0IGl0ZW0uXG4gICAqXG4gICAqIFVuc2NvcGVkIGNvbnRlbnQgaXMgdXNlci1wcm9qZWN0ZWQgdGV4dCBjb250ZW50IGluIGEgbGlzdCBpdGVtIHRoYXQgaXNcbiAgICogbm90IHBhcnQgb2YgYW4gZXhwbGljaXQgbGluZSBvciB0aXRsZS5cbiAgICovXG4gIGFic3RyYWN0IF91bnNjb3BlZENvbnRlbnQ6IEVsZW1lbnRSZWY8SFRNTFNwYW5FbGVtZW50PiB8IHVuZGVmaW5lZDtcblxuICAvKiogSG9zdCBlbGVtZW50IGZvciB0aGUgbGlzdCBpdGVtLiAqL1xuICBfaG9zdEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBXaGV0aGVyIGFuaW1hdGlvbnMgYXJlIGRpc2FibGVkLiAqL1xuICBfbm9vcEFuaW1hdGlvbnM6IGJvb2xlYW47XG5cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRMaXN0SXRlbUF2YXRhciwge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIF9hdmF0YXJzOiBRdWVyeUxpc3Q8bmV2ZXI+O1xuICBAQ29udGVudENoaWxkcmVuKE1hdExpc3RJdGVtSWNvbiwge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIF9pY29uczogUXVlcnlMaXN0PG5ldmVyPjtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBsaW5lcyB0aGlzIGxpc3QgaXRlbSBzaG91bGQgcmVzZXJ2ZSBzcGFjZSBmb3IuIElmIG5vdCBzcGVjaWZpZWQsXG4gICAqIGxpbmVzIGFyZSBpbmZlcnJlZCBiYXNlZCBvbiB0aGUgcHJvamVjdGVkIGNvbnRlbnQuXG4gICAqXG4gICAqIEV4cGxpY2l0bHkgc3BlY2lmeWluZyB0aGUgbnVtYmVyIG9mIGxpbmVzIGlzIHVzZWZ1bCBpZiB5b3Ugd2FudCB0byBhY3F1aXJlIGFkZGl0aW9uYWxcbiAgICogc3BhY2UgYW5kIGVuYWJsZSB0aGUgd3JhcHBpbmcgb2YgdGV4dC4gVGhlIHVuc2NvcGVkIHRleHQgY29udGVudCBvZiBhIGxpc3QgaXRlbSB3aWxsXG4gICAqIGFsd2F5cyBiZSBhYmxlIHRvIHRha2UgdXAgdGhlIHJlbWFpbmluZyBzcGFjZSBvZiB0aGUgaXRlbSwgdW5sZXNzIGl0IHJlcHJlc2VudHMgdGhlIHRpdGxlLlxuICAgKlxuICAgKiBBIG1heGltdW0gb2YgdGhyZWUgbGluZXMgaXMgc3VwcG9ydGVkIGFzIHBlciB0aGUgTWF0ZXJpYWwgRGVzaWduIHNwZWNpZmljYXRpb24uXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgbGluZXMobGluZXM6IG51bWJlciB8IHN0cmluZyB8IG51bGwpIHtcbiAgICB0aGlzLl9leHBsaWNpdExpbmVzID0gY29lcmNlTnVtYmVyUHJvcGVydHkobGluZXMsIG51bGwpO1xuICAgIHRoaXMuX3VwZGF0ZUl0ZW1MaW5lcyhmYWxzZSk7XG4gIH1cbiAgX2V4cGxpY2l0TGluZXM6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlUmlwcGxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmRpc2FibGVkIHx8XG4gICAgICB0aGlzLl9kaXNhYmxlUmlwcGxlIHx8XG4gICAgICB0aGlzLl9ub29wQW5pbWF0aW9ucyB8fFxuICAgICAgISF0aGlzLl9saXN0QmFzZT8uZGlzYWJsZVJpcHBsZVxuICAgICk7XG4gIH1cbiAgc2V0IGRpc2FibGVSaXBwbGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9kaXNhYmxlUmlwcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlUmlwcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxpc3QtaXRlbSBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZCB8fCAhIXRoaXMuX2xpc3RCYXNlPy5kaXNhYmxlZDtcbiAgfVxuICBzZXQgZGlzYWJsZWQodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVkID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlZCA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX3N1YnNjcmlwdGlvbnMgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gIHByaXZhdGUgX3JpcHBsZVJlbmRlcmVyOiBSaXBwbGVSZW5kZXJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBsaXN0IGl0ZW0gaGFzIHVuc2NvcGVkIHRleHQgY29udGVudC4gKi9cbiAgX2hhc1Vuc2NvcGVkVGV4dENvbnRlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBgUmlwcGxlVGFyZ2V0YC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmlwcGxlQ29uZmlnOiBSaXBwbGVDb25maWcgJiBSaXBwbGVHbG9iYWxPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIGBSaXBwbGVUYXJnZXRgLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICBnZXQgcmlwcGxlRGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZVJpcHBsZSB8fCAhIXRoaXMucmlwcGxlQ29uZmlnLmRpc2FibGVkO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcm90ZWN0ZWQgX25nWm9uZTogTmdab25lLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2xpc3RCYXNlOiBNYXRMaXN0QmFzZSB8IG51bGwsXG4gICAgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKVxuICAgIGdsb2JhbFJpcHBsZU9wdGlvbnM/OiBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICB0aGlzLnJpcHBsZUNvbmZpZyA9IGdsb2JhbFJpcHBsZU9wdGlvbnMgfHwge307XG4gICAgdGhpcy5faG9zdEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5fbm9vcEFuaW1hdGlvbnMgPSBhbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnO1xuXG4gICAgaWYgKF9saXN0QmFzZSAmJiAhX2xpc3RCYXNlLl9pc05vbkludGVyYWN0aXZlKSB7XG4gICAgICB0aGlzLl9pbml0SW50ZXJhY3RpdmVMaXN0SXRlbSgpO1xuICAgIH1cblxuICAgIC8vIElmIG5vIHR5cGUgYXR0cmlidXRlIGlzIHNwZWNpZmllZCBmb3IgYSBob3N0IGA8YnV0dG9uPmAgZWxlbWVudCwgc2V0IGl0IHRvIGBidXR0b25gLiBJZiBhXG4gICAgLy8gdHlwZSBhdHRyaWJ1dGUgaXMgYWxyZWFkeSBzcGVjaWZpZWQsIHdlIGRvIG5vdGhpbmcuIFdlIGRvIHRoaXMgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LlxuICAgIC8vIFRPRE86IERldGVybWluZSBpZiB3ZSBpbnRlbmQgdG8gY29udGludWUgZG9pbmcgdGhpcyBmb3IgdGhlIE1EQy1iYXNlZCBsaXN0LlxuICAgIGlmIChcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdidXR0b24nICYmXG4gICAgICAhdGhpcy5faG9zdEVsZW1lbnQuaGFzQXR0cmlidXRlKCd0eXBlJylcbiAgICApIHtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fbW9uaXRvclByb2plY3RlZExpbmVzQW5kVGl0bGUoKTtcbiAgICB0aGlzLl91cGRhdGVJdGVtTGluZXModHJ1ZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnVuc3Vic2NyaWJlKCk7XG4gICAgaWYgKHRoaXMuX3JpcHBsZVJlbmRlcmVyICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9yaXBwbGVSZW5kZXJlci5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBsaXN0IGl0ZW0gaGFzIGljb25zIG9yIGF2YXRhcnMuICovXG4gIF9oYXNJY29uT3JBdmF0YXIoKSB7XG4gICAgcmV0dXJuICEhKHRoaXMuX2F2YXRhcnMubGVuZ3RoIHx8IHRoaXMuX2ljb25zLmxlbmd0aCk7XG4gIH1cblxuICBwcml2YXRlIF9pbml0SW50ZXJhY3RpdmVMaXN0SXRlbSgpIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtbWRjLWxpc3QtaXRlbS1pbnRlcmFjdGl2ZScpO1xuICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyID0gbmV3IFJpcHBsZVJlbmRlcmVyKFxuICAgICAgdGhpcyxcbiAgICAgIHRoaXMuX25nWm9uZSxcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LFxuICAgICAgdGhpcy5fcGxhdGZvcm0sXG4gICAgKTtcbiAgICB0aGlzLl9yaXBwbGVSZW5kZXJlci5zZXR1cFRyaWdnZXJFdmVudHModGhpcy5faG9zdEVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN1YnNjcmliZXMgdG8gY2hhbmdlcyBpbiB0aGUgcHJvamVjdGVkIHRpdGxlIGFuZCBsaW5lcy4gVHJpZ2dlcnMgYVxuICAgKiBpdGVtIGxpbmVzIHVwZGF0ZSB3aGVuZXZlciBhIGNoYW5nZSBvY2N1cnMuXG4gICAqL1xuICBwcml2YXRlIF9tb25pdG9yUHJvamVjdGVkTGluZXNBbmRUaXRsZSgpIHtcbiAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgdGhpcy5fc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICAgIG1lcmdlKHRoaXMuX2xpbmVzIS5jaGFuZ2VzLCB0aGlzLl90aXRsZXMhLmNoYW5nZXMpLnN1YnNjcmliZSgoKSA9PlxuICAgICAgICAgIHRoaXMuX3VwZGF0ZUl0ZW1MaW5lcyhmYWxzZSksXG4gICAgICAgICksXG4gICAgICApO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGxpbmVzIG9mIHRoZSBsaXN0IGl0ZW0uIEJhc2VkIG9uIHRoZSBwcm9qZWN0ZWQgdXNlciBjb250ZW50IGFuZCBvcHRpb25hbFxuICAgKiBleHBsaWNpdCBsaW5lcyBzZXR0aW5nLCB0aGUgdmlzdWFsIGFwcGVhcmFuY2Ugb2YgdGhlIGxpc3QgaXRlbSBpcyBkZXRlcm1pbmVkLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgaW52b2tlZCB3aGVuZXZlciB0aGUgcHJvamVjdGVkIHVzZXIgY29udGVudCBjaGFuZ2VzLCBvclxuICAgKiB3aGVuIHRoZSBleHBsaWNpdCBsaW5lcyBoYXZlIGJlZW4gdXBkYXRlZC5cbiAgICpcbiAgICogQHBhcmFtIHJlY2hlY2tVbnNjb3BlZENvbnRlbnQgV2hldGhlciB0aGUgcHJvamVjdGVkIHVuc2NvcGVkIGNvbnRlbnQgc2hvdWxkIGJlIHJlLWNoZWNrZWQuXG4gICAqICAgVGhlIHVuc2NvcGVkIGNvbnRlbnQgaXMgbm90IHJlLWNoZWNrZWQgZm9yIGV2ZXJ5IHVwZGF0ZSBhcyBpdCBpcyBhIHJhdGhlciBleHBlbnNpdmUgY2hlY2tcbiAgICogICBmb3IgY29udGVudCB0aGF0IGlzIGV4cGVjdGVkIHRvIG5vdCBjaGFuZ2UgdmVyeSBvZnRlbi5cbiAgICovXG4gIF91cGRhdGVJdGVtTGluZXMocmVjaGVja1Vuc2NvcGVkQ29udGVudDogYm9vbGVhbikge1xuICAgIC8vIElmIHRoZSB1cGRhdGVkIGlzIHRyaWdnZXJlZCB0b28gZWFybHkgYmVmb3JlIHRoZSB2aWV3IGFuZCBjb250ZW50IGlzIGluaXRpYWxpemVkLFxuICAgIC8vIHdlIGp1c3Qgc2tpcCB0aGUgdXBkYXRlLiBBZnRlciB2aWV3IGluaXRpYWxpemF0aW9uIHRoZSB1cGRhdGUgaXMgdHJpZ2dlcmVkIGFnYWluLlxuICAgIGlmICghdGhpcy5fbGluZXMgfHwgIXRoaXMuX3RpdGxlcyB8fCAhdGhpcy5fdW5zY29wZWRDb250ZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gUmUtY2hlY2sgdGhlIERPTSBmb3IgdW5zY29wZWQgdGV4dCBjb250ZW50IGlmIHJlcXVlc3RlZC4gVGhpcyBuZWVkcyB0b1xuICAgIC8vIGhhcHBlbiBiZWZvcmUgYW55IGNvbXB1dGF0aW9uIG9yIHNhbml0eSBjaGVja3MgcnVuIGFzIHRoZXNlIHJlbHkgb24gdGhlXG4gICAgLy8gcmVzdWx0IG9mIHdoZXRoZXIgdGhlcmUgaXMgdW5zY29wZWQgdGV4dCBjb250ZW50IG9yIG5vdC5cbiAgICBpZiAocmVjaGVja1Vuc2NvcGVkQ29udGVudCkge1xuICAgICAgdGhpcy5fY2hlY2tEb21Gb3JVbnNjb3BlZFRleHRDb250ZW50KCk7XG4gICAgfVxuXG4gICAgLy8gU2FuaXR5IGNoZWNrIHRoZSBsaXN0IGl0ZW0gbGluZXMgYW5kIHRpdGxlIGluIHRoZSBjb250ZW50LiBUaGlzIGlzIGEgZGV2LW1vZGUgb25seVxuICAgIC8vIGNoZWNrIHRoYXQgY2FuIGJlIGRlYWQtY29kZSBlbGltaW5hdGVkIGJ5IFRlcnNlciBpbiBwcm9kdWN0aW9uLlxuICAgIGlmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpIHtcbiAgICAgIHNhbml0eUNoZWNrTGlzdEl0ZW1Db250ZW50KHRoaXMpO1xuICAgIH1cblxuICAgIGNvbnN0IG51bWJlck9mTGluZXMgPSB0aGlzLl9leHBsaWNpdExpbmVzID8/IHRoaXMuX2luZmVyTGluZXNGcm9tQ29udGVudCgpO1xuICAgIGNvbnN0IHVuc2NvcGVkQ29udGVudEVsID0gdGhpcy5fdW5zY29wZWRDb250ZW50Lm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAvLyBVcGRhdGUgdGhlIGxpc3QgaXRlbSBlbGVtZW50IHRvIHJlZmxlY3QgdGhlIG51bWJlciBvZiBsaW5lcy5cbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdtYXQtbWRjLWxpc3QtaXRlbS1zaW5nbGUtbGluZScsIG51bWJlck9mTGluZXMgPD0gMSk7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnbWRjLWxpc3QtaXRlbS0td2l0aC1vbmUtbGluZScsIG51bWJlck9mTGluZXMgPD0gMSk7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnbWRjLWxpc3QtaXRlbS0td2l0aC10d28tbGluZXMnLCBudW1iZXJPZkxpbmVzID09PSAyKTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKCdtZGMtbGlzdC1pdGVtLS13aXRoLXRocmVlLWxpbmVzJywgbnVtYmVyT2ZMaW5lcyA9PT0gMyk7XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBubyB0aXRsZSBhbmQgdGhlIHVuc2NvcGVkIGNvbnRlbnQgaXMgdGhlIGlzIHRoZSBvbmx5IGxpbmUsIHRoZVxuICAgIC8vIHVuc2NvcGVkIHRleHQgY29udGVudCB3aWxsIGJlIHRyZWF0ZWQgYXMgdGhlIHRpdGxlIG9mIHRoZSBsaXN0LWl0ZW0uXG4gICAgaWYgKHRoaXMuX2hhc1Vuc2NvcGVkVGV4dENvbnRlbnQpIHtcbiAgICAgIGNvbnN0IHRyZWF0QXNUaXRsZSA9IHRoaXMuX3RpdGxlcy5sZW5ndGggPT09IDAgJiYgbnVtYmVyT2ZMaW5lcyA9PT0gMTtcbiAgICAgIHVuc2NvcGVkQ29udGVudEVsLmNsYXNzTGlzdC50b2dnbGUoJ21kYy1saXN0LWl0ZW1fX3ByaW1hcnktdGV4dCcsIHRyZWF0QXNUaXRsZSk7XG4gICAgICB1bnNjb3BlZENvbnRlbnRFbC5jbGFzc0xpc3QudG9nZ2xlKCdtZGMtbGlzdC1pdGVtX19zZWNvbmRhcnktdGV4dCcsICF0cmVhdEFzVGl0bGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1bnNjb3BlZENvbnRlbnRFbC5jbGFzc0xpc3QucmVtb3ZlKCdtZGMtbGlzdC1pdGVtX19wcmltYXJ5LXRleHQnKTtcbiAgICAgIHVuc2NvcGVkQ29udGVudEVsLmNsYXNzTGlzdC5yZW1vdmUoJ21kYy1saXN0LWl0ZW1fX3NlY29uZGFyeS10ZXh0Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluZmVycyB0aGUgbnVtYmVyIG9mIGxpbmVzIGJhc2VkIG9uIHRoZSBwcm9qZWN0ZWQgdXNlciBjb250ZW50LiBUaGlzIGlzIHVzZWZ1bFxuICAgKiBpZiBubyBleHBsaWNpdCBudW1iZXIgb2YgbGluZXMgaGFzIGJlZW4gc3BlY2lmaWVkIG9uIHRoZSBsaXN0IGl0ZW0uXG4gICAqXG4gICAqIFRoZSBudW1iZXIgb2YgbGluZXMgaXMgaW5mZXJyZWQgYmFzZWQgb24gd2hldGhlciB0aGVyZSBpcyBhIHRpdGxlLCB0aGUgbnVtYmVyIG9mXG4gICAqIGFkZGl0aW9uYWwgbGluZXMgKHNlY29uZGFyeS90ZXJ0aWFyeSkuIEFuIGFkZGl0aW9uYWwgbGluZSBpcyBhY3F1aXJlZCBpZiB0aGVyZSBpc1xuICAgKiB1bnNjb3BlZCB0ZXh0IGNvbnRlbnQuXG4gICAqL1xuICBwcml2YXRlIF9pbmZlckxpbmVzRnJvbUNvbnRlbnQoKSB7XG4gICAgbGV0IG51bU9mTGluZXMgPSB0aGlzLl90aXRsZXMhLmxlbmd0aCArIHRoaXMuX2xpbmVzIS5sZW5ndGg7XG4gICAgaWYgKHRoaXMuX2hhc1Vuc2NvcGVkVGV4dENvbnRlbnQpIHtcbiAgICAgIG51bU9mTGluZXMgKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIG51bU9mTGluZXM7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGxpc3QgaXRlbSBoYXMgdW5zY29wZWQgdGV4dCBjb250ZW50LiAqL1xuICBwcml2YXRlIF9jaGVja0RvbUZvclVuc2NvcGVkVGV4dENvbnRlbnQoKSB7XG4gICAgdGhpcy5faGFzVW5zY29wZWRUZXh0Q29udGVudCA9IEFycmF5LmZyb208Q2hpbGROb2RlPihcbiAgICAgIHRoaXMuX3Vuc2NvcGVkQ29udGVudCEubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzLFxuICAgIClcbiAgICAgIC5maWx0ZXIobm9kZSA9PiBub2RlLm5vZGVUeXBlICE9PSBub2RlLkNPTU1FTlRfTk9ERSlcbiAgICAgIC5zb21lKG5vZGUgPT4gISEobm9kZS50ZXh0Q29udGVudCAmJiBub2RlLnRleHRDb250ZW50LnRyaW0oKSkpO1xuICB9XG59XG5cbi8qKlxuICogU2FuaXR5IGNoZWNrcyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgbGlzdCBpdGVtIHdpdGggcmVzcGVjdCB0byB0aGUgYW1vdW50XG4gKiBvZiBsaW5lcywgd2hldGhlciB0aGVyZSBpcyBhIHRpdGxlLCBvciBpZiB0aGVyZSBpcyB1bnNjb3BlZCB0ZXh0IGNvbnRlbnQuXG4gKlxuICogVGhlIGNoZWNrcyBhcmUgZXh0cmFjdGVkIGludG8gYSB0b3AtbGV2ZWwgZnVuY3Rpb24gdGhhdCBjYW4gYmUgZGVhZC1jb2RlXG4gKiBlbGltaW5hdGVkIGJ5IFRlcnNlciBvciBvdGhlciBvcHRpbWl6ZXJzIGluIHByb2R1Y3Rpb24gbW9kZS5cbiAqL1xuZnVuY3Rpb24gc2FuaXR5Q2hlY2tMaXN0SXRlbUNvbnRlbnQoaXRlbTogTWF0TGlzdEl0ZW1CYXNlKSB7XG4gIGNvbnN0IG51bVRpdGxlcyA9IGl0ZW0uX3RpdGxlcyEubGVuZ3RoO1xuICBjb25zdCBudW1MaW5lcyA9IGl0ZW0uX3RpdGxlcyEubGVuZ3RoO1xuXG4gIGlmIChudW1UaXRsZXMgPiAxKSB7XG4gICAgdGhyb3cgRXJyb3IoJ0EgbGlzdCBpdGVtIGNhbm5vdCBoYXZlIG11bHRpcGxlIHRpdGxlcy4nKTtcbiAgfVxuICBpZiAobnVtVGl0bGVzID09PSAwICYmIG51bUxpbmVzID4gMCkge1xuICAgIHRocm93IEVycm9yKCdBIGxpc3QgaXRlbSBsaW5lIGNhbiBvbmx5IGJlIHVzZWQgaWYgdGhlcmUgaXMgYSBsaXN0IGl0ZW0gdGl0bGUuJyk7XG4gIH1cbiAgaWYgKFxuICAgIG51bVRpdGxlcyA9PT0gMCAmJlxuICAgIGl0ZW0uX2hhc1Vuc2NvcGVkVGV4dENvbnRlbnQgJiZcbiAgICBpdGVtLl9leHBsaWNpdExpbmVzICE9PSBudWxsICYmXG4gICAgaXRlbS5fZXhwbGljaXRMaW5lcyA+IDFcbiAgKSB7XG4gICAgdGhyb3cgRXJyb3IoJ0EgbGlzdCBpdGVtIGNhbm5vdCBoYXZlIHdyYXBwaW5nIGNvbnRlbnQgd2l0aG91dCBhIHRpdGxlLicpO1xuICB9XG4gIGlmIChudW1MaW5lcyA+IDIgfHwgKG51bUxpbmVzID09PSAyICYmIGl0ZW0uX2hhc1Vuc2NvcGVkVGV4dENvbnRlbnQpKSB7XG4gICAgdGhyb3cgRXJyb3IoJ0EgbGlzdCBpdGVtIGNhbiBoYXZlIGF0IG1heGltdW0gdGhyZWUgbGluZXMuJyk7XG4gIH1cbn1cbiJdfQ==
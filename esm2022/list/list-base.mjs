/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ContentChildren, Directive, ElementRef, inject, Inject, Input, NgZone, Optional, QueryList, ANIMATION_MODULE_TYPE, Injector, } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleRenderer, } from '@angular/material/core';
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatListBase, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.2", type: MatListBase, isStandalone: true, inputs: { disableRipple: "disableRipple", disabled: "disabled" }, host: { properties: { "attr.aria-disabled": "disabled" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatListBase, decorators: [{
            type: Directive,
            args: [{
                    host: {
                        '[attr.aria-disabled]': 'disabled',
                    },
                    standalone: true,
                }]
        }], propDecorators: { disableRipple: [{
                type: Input
            }], disabled: [{
                type: Input
            }] } });
/** @docs-private */
export class MatListItemBase {
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
    /** Whether ripples for list items are disabled. */
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
        this._rippleRenderer = new RippleRenderer(this, this._ngZone, this._hostElement, this._platform, inject(Injector));
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatListItemBase, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: MatListBase, optional: true }, { token: i1.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.0-next.2", type: MatListItemBase, isStandalone: true, inputs: { lines: "lines", disableRipple: "disableRipple", disabled: "disabled" }, host: { properties: { "class.mdc-list-item--disabled": "disabled", "attr.aria-disabled": "disabled", "attr.disabled": "(_isButtonElement && disabled) || null" } }, queries: [{ propertyName: "_avatars", predicate: MatListItemAvatar }, { propertyName: "_icons", predicate: MatListItemIcon }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.0-next.2", ngImport: i0, type: MatListItemBase, decorators: [{
            type: Directive,
            args: [{
                    host: {
                        '[class.mdc-list-item--disabled]': 'disabled',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.disabled]': '(_isButtonElement && disabled) || null',
                    },
                    standalone: true,
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: MatListBase, decorators: [{
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
                }] }], propDecorators: { _avatars: [{
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
    const numLines = item._lines.length;
    if (numTitles > 1) {
        console.warn('A list item cannot have multiple titles.');
    }
    if (numTitles === 0 && numLines > 0) {
        console.warn('A list item line can only be used if there is a list item title.');
    }
    if (numTitles === 0 &&
        item._hasUnscopedTextContent &&
        item._explicitLines !== null &&
        item._explicitLines > 1) {
        console.warn('A list item cannot have wrapping content without a title.');
    }
    if (numLines > 2 || (numLines === 2 && item._hasUnscopedTextContent)) {
        console.warn('A list item can have at maximum three lines.');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xpc3QvbGlzdC1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBZSxxQkFBcUIsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hHLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBRUwsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUVOLFFBQVEsRUFDUixTQUFTLEVBQ1QscUJBQXFCLEVBQ3JCLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wseUJBQXlCLEVBR3pCLGNBQWMsR0FFZixNQUFNLHdCQUF3QixDQUFDO0FBRWhDLE9BQU8sRUFBQyxZQUFZLEVBQUUsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFHTCxlQUFlLEVBQ2YsaUJBQWlCLEdBQ2xCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLFVBQVUsQ0FBQzs7O0FBUXpDLG9CQUFvQjtBQUNwQixNQUFNLE9BQWdCLFdBQVc7SUFQakM7UUFRRSxzQkFBaUIsR0FBWSxJQUFJLENBQUM7UUFVMUIsbUJBQWMsR0FBWSxLQUFLLENBQUM7UUFhaEMsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUVoQixvQkFBZSxHQUFHLE1BQU0sQ0FBQyxlQUFlLEVBQUUsRUFBQyxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztLQUN2RTtJQXhCQyxzREFBc0Q7SUFDdEQsSUFDSSxhQUFhO1FBQ2YsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7SUFDRCxJQUFJLGFBQWEsQ0FBQyxLQUFtQjtRQUNu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O0dBTUc7QUFDSCxTQUFTLDBCQUEwQixDQUFDLElBQXFCO0lBQ3ZELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFRLENBQUMsTUFBTSxDQUFDO0lBQ3ZDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFPLENBQUMsTUFBTSxDQUFDO0lBRXJDLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBQ0QsSUFBSSxTQUFTLEtBQUssQ0FBQyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLGtFQUFrRSxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUNELElBQ0UsU0FBUyxLQUFLLENBQUM7UUFDZixJQUFJLENBQUMsdUJBQXVCO1FBQzVCLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSTtRQUM1QixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsRUFDdkIsQ0FBQztRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsMkRBQTJELENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBQ0QsSUFBSSxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsdUJBQXVCLENBQUMsRUFBRSxDQUFDO1FBQ3JFLE9BQU8sQ0FBQyxJQUFJLENBQUMsOENBQThDLENBQUMsQ0FBQztJQUMvRCxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5LCBjb2VyY2VOdW1iZXJQcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgaW5qZWN0LFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgQU5JTUFUSU9OX01PRFVMRV9UWVBFLFxuICBJbmplY3Rvcixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TLFxuICBSaXBwbGVDb25maWcsXG4gIFJpcHBsZUdsb2JhbE9wdGlvbnMsXG4gIFJpcHBsZVJlbmRlcmVyLFxuICBSaXBwbGVUYXJnZXQsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtfQ2RrUHJpdmF0ZVN0eWxlTG9hZGVyfSBmcm9tICdAYW5ndWxhci9jZGsvcHJpdmF0ZSc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbiwgbWVyZ2V9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgTWF0TGlzdEl0ZW1MaW5lLFxuICBNYXRMaXN0SXRlbVRpdGxlLFxuICBNYXRMaXN0SXRlbUljb24sXG4gIE1hdExpc3RJdGVtQXZhdGFyLFxufSBmcm9tICcuL2xpc3QtaXRlbS1zZWN0aW9ucyc7XG5pbXBvcnQge01BVF9MSVNUX0NPTkZJR30gZnJvbSAnLi90b2tlbnMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgaG9zdDoge1xuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gIH0sXG4gIHN0YW5kYWxvbmU6IHRydWUsXG59KVxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXRMaXN0QmFzZSB7XG4gIF9pc05vbkludGVyYWN0aXZlOiBib29sZWFuID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciByaXBwbGVzIGZvciBhbGwgbGlzdCBpdGVtcyBpcyBkaXNhYmxlZC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVSaXBwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVSaXBwbGU7XG4gIH1cbiAgc2V0IGRpc2FibGVSaXBwbGUodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVSaXBwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZW50aXJlIGxpc3QgaXMgZGlzYWJsZWQuIFdoZW4gZGlzYWJsZWQsIHRoZSBsaXN0IGl0c2VsZiBhbmQgZWFjaCBvZiBpdHMgbGlzdCBpdGVtc1xuICAgKiBhcmUgZGlzYWJsZWQuXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIF9kZWZhdWx0T3B0aW9ucyA9IGluamVjdChNQVRfTElTVF9DT05GSUcsIHtvcHRpb25hbDogdHJ1ZX0pO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgaG9zdDoge1xuICAgICdbY2xhc3MubWRjLWxpc3QtaXRlbS0tZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci5kaXNhYmxlZF0nOiAnKF9pc0J1dHRvbkVsZW1lbnQgJiYgZGlzYWJsZWQpIHx8IG51bGwnLFxuICB9LFxuICBzdGFuZGFsb25lOiB0cnVlLFxufSlcbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0TGlzdEl0ZW1CYXNlIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBSaXBwbGVUYXJnZXQge1xuICAvKiogUXVlcnkgbGlzdCBtYXRjaGluZyBsaXN0LWl0ZW0gbGluZSBlbGVtZW50cy4gKi9cbiAgYWJzdHJhY3QgX2xpbmVzOiBRdWVyeUxpc3Q8TWF0TGlzdEl0ZW1MaW5lPiB8IHVuZGVmaW5lZDtcblxuICAvKiogUXVlcnkgbGlzdCBtYXRjaGluZyBsaXN0LWl0ZW0gdGl0bGUgZWxlbWVudHMuICovXG4gIGFic3RyYWN0IF90aXRsZXM6IFF1ZXJ5TGlzdDxNYXRMaXN0SXRlbVRpdGxlPiB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogRWxlbWVudCByZWZlcmVuY2UgdG8gdGhlIHVuc2NvcGVkIGNvbnRlbnQgaW4gYSBsaXN0IGl0ZW0uXG4gICAqXG4gICAqIFVuc2NvcGVkIGNvbnRlbnQgaXMgdXNlci1wcm9qZWN0ZWQgdGV4dCBjb250ZW50IGluIGEgbGlzdCBpdGVtIHRoYXQgaXNcbiAgICogbm90IHBhcnQgb2YgYW4gZXhwbGljaXQgbGluZSBvciB0aXRsZS5cbiAgICovXG4gIGFic3RyYWN0IF91bnNjb3BlZENvbnRlbnQ6IEVsZW1lbnRSZWY8SFRNTFNwYW5FbGVtZW50PiB8IHVuZGVmaW5lZDtcblxuICAvKiogSG9zdCBlbGVtZW50IGZvciB0aGUgbGlzdCBpdGVtLiAqL1xuICBfaG9zdEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBpbmRpY2F0ZSB3aGV0aGVyIHRoZSBob3N0IGVsZW1lbnQgaXMgYSBidXR0b24gb3Igbm90ICovXG4gIF9pc0J1dHRvbkVsZW1lbnQ6IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQuICovXG4gIF9ub29wQW5pbWF0aW9uczogYm9vbGVhbjtcblxuICBAQ29udGVudENoaWxkcmVuKE1hdExpc3RJdGVtQXZhdGFyLCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgX2F2YXRhcnM6IFF1ZXJ5TGlzdDxuZXZlcj47XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGlzdEl0ZW1JY29uLCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgX2ljb25zOiBRdWVyeUxpc3Q8bmV2ZXI+O1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGxpbmVzIHRoaXMgbGlzdCBpdGVtIHNob3VsZCByZXNlcnZlIHNwYWNlIGZvci4gSWYgbm90IHNwZWNpZmllZCxcbiAgICogbGluZXMgYXJlIGluZmVycmVkIGJhc2VkIG9uIHRoZSBwcm9qZWN0ZWQgY29udGVudC5cbiAgICpcbiAgICogRXhwbGljaXRseSBzcGVjaWZ5aW5nIHRoZSBudW1iZXIgb2YgbGluZXMgaXMgdXNlZnVsIGlmIHlvdSB3YW50IHRvIGFjcXVpcmUgYWRkaXRpb25hbFxuICAgKiBzcGFjZSBhbmQgZW5hYmxlIHRoZSB3cmFwcGluZyBvZiB0ZXh0LiBUaGUgdW5zY29wZWQgdGV4dCBjb250ZW50IG9mIGEgbGlzdCBpdGVtIHdpbGxcbiAgICogYWx3YXlzIGJlIGFibGUgdG8gdGFrZSB1cCB0aGUgcmVtYWluaW5nIHNwYWNlIG9mIHRoZSBpdGVtLCB1bmxlc3MgaXQgcmVwcmVzZW50cyB0aGUgdGl0bGUuXG4gICAqXG4gICAqIEEgbWF4aW11bSBvZiB0aHJlZSBsaW5lcyBpcyBzdXBwb3J0ZWQgYXMgcGVyIHRoZSBNYXRlcmlhbCBEZXNpZ24gc3BlY2lmaWNhdGlvbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBsaW5lcyhsaW5lczogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbCkge1xuICAgIHRoaXMuX2V4cGxpY2l0TGluZXMgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eShsaW5lcywgbnVsbCk7XG4gICAgdGhpcy5fdXBkYXRlSXRlbUxpbmVzKGZhbHNlKTtcbiAgfVxuICBfZXhwbGljaXRMaW5lczogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBmb3IgbGlzdCBpdGVtcyBhcmUgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlUmlwcGxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmRpc2FibGVkIHx8XG4gICAgICB0aGlzLl9kaXNhYmxlUmlwcGxlIHx8XG4gICAgICB0aGlzLl9ub29wQW5pbWF0aW9ucyB8fFxuICAgICAgISF0aGlzLl9saXN0QmFzZT8uZGlzYWJsZVJpcHBsZVxuICAgICk7XG4gIH1cbiAgc2V0IGRpc2FibGVSaXBwbGUodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2Rpc2FibGVSaXBwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgbGlzdC1pdGVtIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkIHx8ICEhdGhpcy5fbGlzdEJhc2U/LmRpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9ucyA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgcHJpdmF0ZSBfcmlwcGxlUmVuZGVyZXI6IFJpcHBsZVJlbmRlcmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxpc3QgaXRlbSBoYXMgdW5zY29wZWQgdGV4dCBjb250ZW50LiAqL1xuICBfaGFzVW5zY29wZWRUZXh0Q29udGVudDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBJbXBsZW1lbnRlZCBhcyBwYXJ0IG9mIGBSaXBwbGVUYXJnZXRgLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByaXBwbGVDb25maWc6IFJpcHBsZUNvbmZpZyAmIFJpcHBsZUdsb2JhbE9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgYFJpcHBsZVRhcmdldGAuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIGdldCByaXBwbGVEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlUmlwcGxlIHx8ICEhdGhpcy5yaXBwbGVDb25maWcuZGlzYWJsZWQ7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIHByb3RlY3RlZCBfbmdab25lOiBOZ1pvbmUsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfbGlzdEJhc2U6IE1hdExpc3RCYXNlIHwgbnVsbCxcbiAgICBwcml2YXRlIF9wbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKClcbiAgICBASW5qZWN0KE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMpXG4gICAgZ2xvYmFsUmlwcGxlT3B0aW9ucz86IFJpcHBsZUdsb2JhbE9wdGlvbnMsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHRoaXMucmlwcGxlQ29uZmlnID0gZ2xvYmFsUmlwcGxlT3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLl9ob3N0RWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLl9pc0J1dHRvbkVsZW1lbnQgPSB0aGlzLl9ob3N0RWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYnV0dG9uJztcbiAgICB0aGlzLl9ub29wQW5pbWF0aW9ucyA9IGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucyc7XG5cbiAgICBpZiAoX2xpc3RCYXNlICYmICFfbGlzdEJhc2UuX2lzTm9uSW50ZXJhY3RpdmUpIHtcbiAgICAgIHRoaXMuX2luaXRJbnRlcmFjdGl2ZUxpc3RJdGVtKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gdHlwZSBhdHRyaWJ1dGUgaXMgc3BlY2lmaWVkIGZvciBhIGhvc3QgYDxidXR0b24+YCBlbGVtZW50LCBzZXQgaXQgdG8gYGJ1dHRvbmAuIElmIGFcbiAgICAvLyB0eXBlIGF0dHJpYnV0ZSBpcyBhbHJlYWR5IHNwZWNpZmllZCwgd2UgZG8gbm90aGluZy4gV2UgZG8gdGhpcyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuXG4gICAgLy8gVE9ETzogRGV0ZXJtaW5lIGlmIHdlIGludGVuZCB0byBjb250aW51ZSBkb2luZyB0aGlzIGZvciB0aGUgTURDLWJhc2VkIGxpc3QuXG4gICAgaWYgKHRoaXMuX2lzQnV0dG9uRWxlbWVudCAmJiAhdGhpcy5faG9zdEVsZW1lbnQuaGFzQXR0cmlidXRlKCd0eXBlJykpIHtcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICdidXR0b24nKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5fbW9uaXRvclByb2plY3RlZExpbmVzQW5kVGl0bGUoKTtcbiAgICB0aGlzLl91cGRhdGVJdGVtTGluZXModHJ1ZSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9zdWJzY3JpcHRpb25zLnVuc3Vic2NyaWJlKCk7XG4gICAgaWYgKHRoaXMuX3JpcHBsZVJlbmRlcmVyICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9yaXBwbGVSZW5kZXJlci5fcmVtb3ZlVHJpZ2dlckV2ZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBsaXN0IGl0ZW0gaGFzIGljb25zIG9yIGF2YXRhcnMuICovXG4gIF9oYXNJY29uT3JBdmF0YXIoKSB7XG4gICAgcmV0dXJuICEhKHRoaXMuX2F2YXRhcnMubGVuZ3RoIHx8IHRoaXMuX2ljb25zLmxlbmd0aCk7XG4gIH1cblxuICBwcml2YXRlIF9pbml0SW50ZXJhY3RpdmVMaXN0SXRlbSgpIHtcbiAgICB0aGlzLl9ob3N0RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdtYXQtbWRjLWxpc3QtaXRlbS1pbnRlcmFjdGl2ZScpO1xuICAgIHRoaXMuX3JpcHBsZVJlbmRlcmVyID0gbmV3IFJpcHBsZVJlbmRlcmVyKFxuICAgICAgdGhpcyxcbiAgICAgIHRoaXMuX25nWm9uZSxcbiAgICAgIHRoaXMuX2hvc3RFbGVtZW50LFxuICAgICAgdGhpcy5fcGxhdGZvcm0sXG4gICAgICBpbmplY3QoSW5qZWN0b3IpLFxuICAgICk7XG4gICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIuc2V0dXBUcmlnZ2VyRXZlbnRzKHRoaXMuX2hvc3RFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIHRvIGNoYW5nZXMgaW4gdGhlIHByb2plY3RlZCB0aXRsZSBhbmQgbGluZXMuIFRyaWdnZXJzIGFcbiAgICogaXRlbSBsaW5lcyB1cGRhdGUgd2hlbmV2ZXIgYSBjaGFuZ2Ugb2NjdXJzLlxuICAgKi9cbiAgcHJpdmF0ZSBfbW9uaXRvclByb2plY3RlZExpbmVzQW5kVGl0bGUoKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICBtZXJnZSh0aGlzLl9saW5lcyEuY2hhbmdlcywgdGhpcy5fdGl0bGVzIS5jaGFuZ2VzKS5zdWJzY3JpYmUoKCkgPT5cbiAgICAgICAgICB0aGlzLl91cGRhdGVJdGVtTGluZXMoZmFsc2UpLFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBsaW5lcyBvZiB0aGUgbGlzdCBpdGVtLiBCYXNlZCBvbiB0aGUgcHJvamVjdGVkIHVzZXIgY29udGVudCBhbmQgb3B0aW9uYWxcbiAgICogZXhwbGljaXQgbGluZXMgc2V0dGluZywgdGhlIHZpc3VhbCBhcHBlYXJhbmNlIG9mIHRoZSBsaXN0IGl0ZW0gaXMgZGV0ZXJtaW5lZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGludm9rZWQgd2hlbmV2ZXIgdGhlIHByb2plY3RlZCB1c2VyIGNvbnRlbnQgY2hhbmdlcywgb3JcbiAgICogd2hlbiB0aGUgZXhwbGljaXQgbGluZXMgaGF2ZSBiZWVuIHVwZGF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSByZWNoZWNrVW5zY29wZWRDb250ZW50IFdoZXRoZXIgdGhlIHByb2plY3RlZCB1bnNjb3BlZCBjb250ZW50IHNob3VsZCBiZSByZS1jaGVja2VkLlxuICAgKiAgIFRoZSB1bnNjb3BlZCBjb250ZW50IGlzIG5vdCByZS1jaGVja2VkIGZvciBldmVyeSB1cGRhdGUgYXMgaXQgaXMgYSByYXRoZXIgZXhwZW5zaXZlIGNoZWNrXG4gICAqICAgZm9yIGNvbnRlbnQgdGhhdCBpcyBleHBlY3RlZCB0byBub3QgY2hhbmdlIHZlcnkgb2Z0ZW4uXG4gICAqL1xuICBfdXBkYXRlSXRlbUxpbmVzKHJlY2hlY2tVbnNjb3BlZENvbnRlbnQ6IGJvb2xlYW4pIHtcbiAgICAvLyBJZiB0aGUgdXBkYXRlZCBpcyB0cmlnZ2VyZWQgdG9vIGVhcmx5IGJlZm9yZSB0aGUgdmlldyBhbmQgY29udGVudCBpcyBpbml0aWFsaXplZCxcbiAgICAvLyB3ZSBqdXN0IHNraXAgdGhlIHVwZGF0ZS4gQWZ0ZXIgdmlldyBpbml0aWFsaXphdGlvbiB0aGUgdXBkYXRlIGlzIHRyaWdnZXJlZCBhZ2Fpbi5cbiAgICBpZiAoIXRoaXMuX2xpbmVzIHx8ICF0aGlzLl90aXRsZXMgfHwgIXRoaXMuX3Vuc2NvcGVkQ29udGVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlLWNoZWNrIHRoZSBET00gZm9yIHVuc2NvcGVkIHRleHQgY29udGVudCBpZiByZXF1ZXN0ZWQuIFRoaXMgbmVlZHMgdG9cbiAgICAvLyBoYXBwZW4gYmVmb3JlIGFueSBjb21wdXRhdGlvbiBvciBzYW5pdHkgY2hlY2tzIHJ1biBhcyB0aGVzZSByZWx5IG9uIHRoZVxuICAgIC8vIHJlc3VsdCBvZiB3aGV0aGVyIHRoZXJlIGlzIHVuc2NvcGVkIHRleHQgY29udGVudCBvciBub3QuXG4gICAgaWYgKHJlY2hlY2tVbnNjb3BlZENvbnRlbnQpIHtcbiAgICAgIHRoaXMuX2NoZWNrRG9tRm9yVW5zY29wZWRUZXh0Q29udGVudCgpO1xuICAgIH1cblxuICAgIC8vIFNhbml0eSBjaGVjayB0aGUgbGlzdCBpdGVtIGxpbmVzIGFuZCB0aXRsZSBpbiB0aGUgY29udGVudC4gVGhpcyBpcyBhIGRldi1tb2RlIG9ubHlcbiAgICAvLyBjaGVjayB0aGF0IGNhbiBiZSBkZWFkLWNvZGUgZWxpbWluYXRlZCBieSBUZXJzZXIgaW4gcHJvZHVjdGlvbi5cbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBzYW5pdHlDaGVja0xpc3RJdGVtQ29udGVudCh0aGlzKTtcbiAgICB9XG5cbiAgICBjb25zdCBudW1iZXJPZkxpbmVzID0gdGhpcy5fZXhwbGljaXRMaW5lcyA/PyB0aGlzLl9pbmZlckxpbmVzRnJvbUNvbnRlbnQoKTtcbiAgICBjb25zdCB1bnNjb3BlZENvbnRlbnRFbCA9IHRoaXMuX3Vuc2NvcGVkQ29udGVudC5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gVXBkYXRlIHRoZSBsaXN0IGl0ZW0gZWxlbWVudCB0byByZWZsZWN0IHRoZSBudW1iZXIgb2YgbGluZXMuXG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnbWF0LW1kYy1saXN0LWl0ZW0tc2luZ2xlLWxpbmUnLCBudW1iZXJPZkxpbmVzIDw9IDEpO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ21kYy1saXN0LWl0ZW0tLXdpdGgtb25lLWxpbmUnLCBudW1iZXJPZkxpbmVzIDw9IDEpO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ21kYy1saXN0LWl0ZW0tLXdpdGgtdHdvLWxpbmVzJywgbnVtYmVyT2ZMaW5lcyA9PT0gMik7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnbWRjLWxpc3QtaXRlbS0td2l0aC10aHJlZS1saW5lcycsIG51bWJlck9mTGluZXMgPT09IDMpO1xuXG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gdGl0bGUgYW5kIHRoZSB1bnNjb3BlZCBjb250ZW50IGlzIHRoZSBpcyB0aGUgb25seSBsaW5lLCB0aGVcbiAgICAvLyB1bnNjb3BlZCB0ZXh0IGNvbnRlbnQgd2lsbCBiZSB0cmVhdGVkIGFzIHRoZSB0aXRsZSBvZiB0aGUgbGlzdC1pdGVtLlxuICAgIGlmICh0aGlzLl9oYXNVbnNjb3BlZFRleHRDb250ZW50KSB7XG4gICAgICBjb25zdCB0cmVhdEFzVGl0bGUgPSB0aGlzLl90aXRsZXMubGVuZ3RoID09PSAwICYmIG51bWJlck9mTGluZXMgPT09IDE7XG4gICAgICB1bnNjb3BlZENvbnRlbnRFbC5jbGFzc0xpc3QudG9nZ2xlKCdtZGMtbGlzdC1pdGVtX19wcmltYXJ5LXRleHQnLCB0cmVhdEFzVGl0bGUpO1xuICAgICAgdW5zY29wZWRDb250ZW50RWwuY2xhc3NMaXN0LnRvZ2dsZSgnbWRjLWxpc3QtaXRlbV9fc2Vjb25kYXJ5LXRleHQnLCAhdHJlYXRBc1RpdGxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdW5zY29wZWRDb250ZW50RWwuY2xhc3NMaXN0LnJlbW92ZSgnbWRjLWxpc3QtaXRlbV9fcHJpbWFyeS10ZXh0Jyk7XG4gICAgICB1bnNjb3BlZENvbnRlbnRFbC5jbGFzc0xpc3QucmVtb3ZlKCdtZGMtbGlzdC1pdGVtX19zZWNvbmRhcnktdGV4dCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbmZlcnMgdGhlIG51bWJlciBvZiBsaW5lcyBiYXNlZCBvbiB0aGUgcHJvamVjdGVkIHVzZXIgY29udGVudC4gVGhpcyBpcyB1c2VmdWxcbiAgICogaWYgbm8gZXhwbGljaXQgbnVtYmVyIG9mIGxpbmVzIGhhcyBiZWVuIHNwZWNpZmllZCBvbiB0aGUgbGlzdCBpdGVtLlxuICAgKlxuICAgKiBUaGUgbnVtYmVyIG9mIGxpbmVzIGlzIGluZmVycmVkIGJhc2VkIG9uIHdoZXRoZXIgdGhlcmUgaXMgYSB0aXRsZSwgdGhlIG51bWJlciBvZlxuICAgKiBhZGRpdGlvbmFsIGxpbmVzIChzZWNvbmRhcnkvdGVydGlhcnkpLiBBbiBhZGRpdGlvbmFsIGxpbmUgaXMgYWNxdWlyZWQgaWYgdGhlcmUgaXNcbiAgICogdW5zY29wZWQgdGV4dCBjb250ZW50LlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5mZXJMaW5lc0Zyb21Db250ZW50KCkge1xuICAgIGxldCBudW1PZkxpbmVzID0gdGhpcy5fdGl0bGVzIS5sZW5ndGggKyB0aGlzLl9saW5lcyEubGVuZ3RoO1xuICAgIGlmICh0aGlzLl9oYXNVbnNjb3BlZFRleHRDb250ZW50KSB7XG4gICAgICBudW1PZkxpbmVzICs9IDE7XG4gICAgfVxuICAgIHJldHVybiBudW1PZkxpbmVzO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBsaXN0IGl0ZW0gaGFzIHVuc2NvcGVkIHRleHQgY29udGVudC4gKi9cbiAgcHJpdmF0ZSBfY2hlY2tEb21Gb3JVbnNjb3BlZFRleHRDb250ZW50KCkge1xuICAgIHRoaXMuX2hhc1Vuc2NvcGVkVGV4dENvbnRlbnQgPSBBcnJheS5mcm9tPENoaWxkTm9kZT4oXG4gICAgICB0aGlzLl91bnNjb3BlZENvbnRlbnQhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2RlcyxcbiAgICApXG4gICAgICAuZmlsdGVyKG5vZGUgPT4gbm9kZS5ub2RlVHlwZSAhPT0gbm9kZS5DT01NRU5UX05PREUpXG4gICAgICAuc29tZShub2RlID0+ICEhKG5vZGUudGV4dENvbnRlbnQgJiYgbm9kZS50ZXh0Q29udGVudC50cmltKCkpKTtcbiAgfVxufVxuXG4vKipcbiAqIFNhbml0eSBjaGVja3MgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIGxpc3QgaXRlbSB3aXRoIHJlc3BlY3QgdG8gdGhlIGFtb3VudFxuICogb2YgbGluZXMsIHdoZXRoZXIgdGhlcmUgaXMgYSB0aXRsZSwgb3IgaWYgdGhlcmUgaXMgdW5zY29wZWQgdGV4dCBjb250ZW50LlxuICpcbiAqIFRoZSBjaGVja3MgYXJlIGV4dHJhY3RlZCBpbnRvIGEgdG9wLWxldmVsIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIGRlYWQtY29kZVxuICogZWxpbWluYXRlZCBieSBUZXJzZXIgb3Igb3RoZXIgb3B0aW1pemVycyBpbiBwcm9kdWN0aW9uIG1vZGUuXG4gKi9cbmZ1bmN0aW9uIHNhbml0eUNoZWNrTGlzdEl0ZW1Db250ZW50KGl0ZW06IE1hdExpc3RJdGVtQmFzZSkge1xuICBjb25zdCBudW1UaXRsZXMgPSBpdGVtLl90aXRsZXMhLmxlbmd0aDtcbiAgY29uc3QgbnVtTGluZXMgPSBpdGVtLl9saW5lcyEubGVuZ3RoO1xuXG4gIGlmIChudW1UaXRsZXMgPiAxKSB7XG4gICAgY29uc29sZS53YXJuKCdBIGxpc3QgaXRlbSBjYW5ub3QgaGF2ZSBtdWx0aXBsZSB0aXRsZXMuJyk7XG4gIH1cbiAgaWYgKG51bVRpdGxlcyA9PT0gMCAmJiBudW1MaW5lcyA+IDApIHtcbiAgICBjb25zb2xlLndhcm4oJ0EgbGlzdCBpdGVtIGxpbmUgY2FuIG9ubHkgYmUgdXNlZCBpZiB0aGVyZSBpcyBhIGxpc3QgaXRlbSB0aXRsZS4nKTtcbiAgfVxuICBpZiAoXG4gICAgbnVtVGl0bGVzID09PSAwICYmXG4gICAgaXRlbS5faGFzVW5zY29wZWRUZXh0Q29udGVudCAmJlxuICAgIGl0ZW0uX2V4cGxpY2l0TGluZXMgIT09IG51bGwgJiZcbiAgICBpdGVtLl9leHBsaWNpdExpbmVzID4gMVxuICApIHtcbiAgICBjb25zb2xlLndhcm4oJ0EgbGlzdCBpdGVtIGNhbm5vdCBoYXZlIHdyYXBwaW5nIGNvbnRlbnQgd2l0aG91dCBhIHRpdGxlLicpO1xuICB9XG4gIGlmIChudW1MaW5lcyA+IDIgfHwgKG51bUxpbmVzID09PSAyICYmIGl0ZW0uX2hhc1Vuc2NvcGVkVGV4dENvbnRlbnQpKSB7XG4gICAgY29uc29sZS53YXJuKCdBIGxpc3QgaXRlbSBjYW4gaGF2ZSBhdCBtYXhpbXVtIHRocmVlIGxpbmVzLicpO1xuICB9XG59XG4iXX0=
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ContentChildren, Directive, ElementRef, Inject, Input, NgZone, Optional, QueryList, } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleRenderer, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { Subscription, merge } from 'rxjs';
import { MatListItemIcon, MatListItemAvatar, } from './list-item-sections';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
/** @docs-private */
export class MatListBase {
    constructor() {
        this._isNonInteractive = true;
        this._disableRipple = false;
        this._disabled = false;
    }
    /** Whether ripples for all list items is disabled. */
    get disableRipple() {
        return this._disableRipple;
    }
    set disableRipple(value) {
        this._disableRipple = coerceBooleanProperty(value);
    }
    /** Whether all list items are disabled. */
    get disabled() {
        return this._disabled;
    }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);
    }
}
MatListBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatListBase, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatListBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatListBase, inputs: { disableRipple: "disableRipple", disabled: "disabled" }, host: { properties: { "class.mat-mdc-list-non-interactive": "_isNonInteractive", "attr.aria-disabled": "disabled" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatListBase, decorators: [{
            type: Directive,
            args: [{
                    host: {
                        '[class.mat-mdc-list-non-interactive]': '_isNonInteractive',
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
        if (!this._listBase._isNonInteractive) {
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
        return (this.disabled || this._disableRipple || this._listBase.disableRipple || this._noopAnimations);
    }
    set disableRipple(value) {
        this._disableRipple = coerceBooleanProperty(value);
    }
    /** Whether the list-item is disabled. */
    get disabled() {
        return this._disabled || (this._listBase && this._listBase.disabled);
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
MatListItemBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatListItemBase, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: MatListBase }, { token: i1.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatListItemBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.2.0-rc.0", type: MatListItemBase, inputs: { lines: "lines", disableRipple: "disableRipple", disabled: "disabled" }, host: { properties: { "class.mdc-list-item--disabled": "disabled", "attr.aria-disabled": "disabled" } }, queries: [{ propertyName: "_avatars", predicate: MatListItemAvatar }, { propertyName: "_icons", predicate: MatListItemIcon }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.0-rc.0", ngImport: i0, type: MatListItemBase, decorators: [{
            type: Directive,
            args: [{
                    host: {
                        '[class.mdc-list-item--disabled]': 'disabled',
                        '[attr.aria-disabled]': 'disabled',
                    },
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: MatListBase }, { type: i1.Platform }, { type: undefined, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1iYXNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xpc3QvbGlzdC1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBZSxxQkFBcUIsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hHLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBRUwsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4sUUFBUSxFQUNSLFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wseUJBQXlCLEVBR3pCLGNBQWMsR0FFZixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBQzNFLE9BQU8sRUFBQyxZQUFZLEVBQUUsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3pDLE9BQU8sRUFHTCxlQUFlLEVBQ2YsaUJBQWlCLEdBQ2xCLE1BQU0sc0JBQXNCLENBQUM7OztBQVE5QixvQkFBb0I7QUFDcEIsTUFBTSxPQUFnQixXQUFXO0lBUGpDO1FBUUUsc0JBQWlCLEdBQVksSUFBSSxDQUFDO1FBVTFCLG1CQUFjLEdBQVksS0FBSyxDQUFDO1FBVWhDLGNBQVMsR0FBRyxLQUFLLENBQUM7S0FDM0I7SUFuQkMsc0RBQXNEO0lBQ3RELElBQ0ksYUFBYTtRQUNmLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQztJQUM3QixDQUFDO0lBQ0QsSUFBSSxhQUFhLENBQUMsS0FBbUI7UUFDbkMsSUFBSSxDQUFDLGNBQWMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBR0QsMkNBQTJDO0lBQzNDLElBQ0ksUUFBUTtRQUNWLE9BQU8sSUFB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akY7SUFDRCxJQUNFLFNBQVMsS0FBSyxDQUFDO1FBQ2YsSUFBSSxDQUFDLHVCQUF1QjtRQUM1QixJQUFJLENBQUMsY0FBYyxLQUFLLElBQUk7UUFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLEVBQ3ZCO1FBQ0EsTUFBTSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztLQUMxRTtJQUNELElBQUksUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLHVCQUF1QixDQUFDLEVBQUU7UUFDcEUsTUFBTSxLQUFLLENBQUMsOENBQThDLENBQUMsQ0FBQztLQUM3RDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgY29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25EZXN0cm95LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMsXG4gIFJpcHBsZUNvbmZpZyxcbiAgUmlwcGxlR2xvYmFsT3B0aW9ucyxcbiAgUmlwcGxlUmVuZGVyZXIsXG4gIFJpcHBsZVRhcmdldCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7U3Vic2NyaXB0aW9uLCBtZXJnZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1xuICBNYXRMaXN0SXRlbUxpbmUsXG4gIE1hdExpc3RJdGVtVGl0bGUsXG4gIE1hdExpc3RJdGVtSWNvbixcbiAgTWF0TGlzdEl0ZW1BdmF0YXIsXG59IGZyb20gJy4vbGlzdC1pdGVtLXNlY3Rpb25zJztcblxuQERpcmVjdGl2ZSh7XG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLm1hdC1tZGMtbGlzdC1ub24taW50ZXJhY3RpdmVdJzogJ19pc05vbkludGVyYWN0aXZlJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICB9LFxufSlcbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0TGlzdEJhc2Uge1xuICBfaXNOb25JbnRlcmFjdGl2ZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBmb3IgYWxsIGxpc3QgaXRlbXMgaXMgZGlzYWJsZWQuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlUmlwcGxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlUmlwcGxlO1xuICB9XG4gIHNldCBkaXNhYmxlUmlwcGxlKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlUmlwcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlUmlwcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgYWxsIGxpc3QgaXRlbXMgYXJlIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG59XG5cbkBEaXJlY3RpdmUoe1xuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5tZGMtbGlzdC1pdGVtLS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci5hcmlhLWRpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gIH0sXG59KVxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXRMaXN0SXRlbUJhc2UgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIFJpcHBsZVRhcmdldCB7XG4gIC8qKiBRdWVyeSBsaXN0IG1hdGNoaW5nIGxpc3QtaXRlbSBsaW5lIGVsZW1lbnRzLiAqL1xuICBhYnN0cmFjdCBfbGluZXM6IFF1ZXJ5TGlzdDxNYXRMaXN0SXRlbUxpbmU+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBRdWVyeSBsaXN0IG1hdGNoaW5nIGxpc3QtaXRlbSB0aXRsZSBlbGVtZW50cy4gKi9cbiAgYWJzdHJhY3QgX3RpdGxlczogUXVlcnlMaXN0PE1hdExpc3RJdGVtVGl0bGU+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBFbGVtZW50IHJlZmVyZW5jZSB0byB0aGUgdW5zY29wZWQgY29udGVudCBpbiBhIGxpc3QgaXRlbS5cbiAgICpcbiAgICogVW5zY29wZWQgY29udGVudCBpcyB1c2VyLXByb2plY3RlZCB0ZXh0IGNvbnRlbnQgaW4gYSBsaXN0IGl0ZW0gdGhhdCBpc1xuICAgKiBub3QgcGFydCBvZiBhbiBleHBsaWNpdCBsaW5lIG9yIHRpdGxlLlxuICAgKi9cbiAgYWJzdHJhY3QgX3Vuc2NvcGVkQ29udGVudDogRWxlbWVudFJlZjxIVE1MU3BhbkVsZW1lbnQ+IHwgdW5kZWZpbmVkO1xuXG4gIC8qKiBIb3N0IGVsZW1lbnQgZm9yIHRoZSBsaXN0IGl0ZW0uICovXG4gIF9ob3N0RWxlbWVudDogSFRNTEVsZW1lbnQ7XG5cbiAgLyoqIFdoZXRoZXIgYW5pbWF0aW9ucyBhcmUgZGlzYWJsZWQuICovXG4gIF9ub29wQW5pbWF0aW9uczogYm9vbGVhbjtcblxuICBAQ29udGVudENoaWxkcmVuKE1hdExpc3RJdGVtQXZhdGFyLCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgX2F2YXRhcnM6IFF1ZXJ5TGlzdDxuZXZlcj47XG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0TGlzdEl0ZW1JY29uLCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgX2ljb25zOiBRdWVyeUxpc3Q8bmV2ZXI+O1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGxpbmVzIHRoaXMgbGlzdCBpdGVtIHNob3VsZCByZXNlcnZlIHNwYWNlIGZvci4gSWYgbm90IHNwZWNpZmllZCxcbiAgICogbGluZXMgYXJlIGluZmVycmVkIGJhc2VkIG9uIHRoZSBwcm9qZWN0ZWQgY29udGVudC5cbiAgICpcbiAgICogRXhwbGljaXRseSBzcGVjaWZ5aW5nIHRoZSBudW1iZXIgb2YgbGluZXMgaXMgdXNlZnVsIGlmIHlvdSB3YW50IHRvIGFjcXVpcmUgYWRkaXRpb25hbFxuICAgKiBzcGFjZSBhbmQgZW5hYmxlIHRoZSB3cmFwcGluZyBvZiB0ZXh0LiBUaGUgdW5zY29wZWQgdGV4dCBjb250ZW50IG9mIGEgbGlzdCBpdGVtIHdpbGxcbiAgICogYWx3YXlzIGJlIGFibGUgdG8gdGFrZSB1cCB0aGUgcmVtYWluaW5nIHNwYWNlIG9mIHRoZSBpdGVtLCB1bmxlc3MgaXQgcmVwcmVzZW50cyB0aGUgdGl0bGUuXG4gICAqXG4gICAqIEEgbWF4aW11bSBvZiB0aHJlZSBsaW5lcyBpcyBzdXBwb3J0ZWQgYXMgcGVyIHRoZSBNYXRlcmlhbCBEZXNpZ24gc3BlY2lmaWNhdGlvbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIHNldCBsaW5lcyhsaW5lczogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbCkge1xuICAgIHRoaXMuX2V4cGxpY2l0TGluZXMgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eShsaW5lcywgbnVsbCk7XG4gICAgdGhpcy5fdXBkYXRlSXRlbUxpbmVzKGZhbHNlKTtcbiAgfVxuICBfZXhwbGljaXRMaW5lczogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgQElucHV0KClcbiAgZ2V0IGRpc2FibGVSaXBwbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuZGlzYWJsZWQgfHwgdGhpcy5fZGlzYWJsZVJpcHBsZSB8fCB0aGlzLl9saXN0QmFzZS5kaXNhYmxlUmlwcGxlIHx8IHRoaXMuX25vb3BBbmltYXRpb25zXG4gICAgKTtcbiAgfVxuICBzZXQgZGlzYWJsZVJpcHBsZSh2YWx1ZTogYm9vbGVhbikge1xuICAgIHRoaXMuX2Rpc2FibGVSaXBwbGUgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgbGlzdC1pdGVtIGlzIGRpc2FibGVkLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkIHx8ICh0aGlzLl9saXN0QmFzZSAmJiB0aGlzLl9saXN0QmFzZS5kaXNhYmxlZCk7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcblxuICBwcml2YXRlIF9zdWJzY3JpcHRpb25zID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICBwcml2YXRlIF9yaXBwbGVSZW5kZXJlcjogUmlwcGxlUmVuZGVyZXIgfCBudWxsID0gbnVsbDtcblxuICAvKiogV2hldGhlciB0aGUgbGlzdCBpdGVtIGhhcyB1bnNjb3BlZCB0ZXh0IGNvbnRlbnQuICovXG4gIF9oYXNVbnNjb3BlZFRleHRDb250ZW50OiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEltcGxlbWVudGVkIGFzIHBhcnQgb2YgYFJpcHBsZVRhcmdldGAuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnICYgUmlwcGxlR2xvYmFsT3B0aW9ucztcblxuICAvKipcbiAgICogSW1wbGVtZW50ZWQgYXMgcGFydCBvZiBgUmlwcGxlVGFyZ2V0YC5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHJpcHBsZURpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVSaXBwbGUgfHwgISF0aGlzLnJpcHBsZUNvbmZpZy5kaXNhYmxlZDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJvdGVjdGVkIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIF9saXN0QmFzZTogTWF0TGlzdEJhc2UsXG4gICAgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIEBPcHRpb25hbCgpXG4gICAgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKVxuICAgIGdsb2JhbFJpcHBsZU9wdGlvbnM/OiBSaXBwbGVHbG9iYWxPcHRpb25zLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBhbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICB0aGlzLnJpcHBsZUNvbmZpZyA9IGdsb2JhbFJpcHBsZU9wdGlvbnMgfHwge307XG4gICAgdGhpcy5faG9zdEVsZW1lbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5fbm9vcEFuaW1hdGlvbnMgPSBhbmltYXRpb25Nb2RlID09PSAnTm9vcEFuaW1hdGlvbnMnO1xuXG4gICAgaWYgKCF0aGlzLl9saXN0QmFzZS5faXNOb25JbnRlcmFjdGl2ZSkge1xuICAgICAgdGhpcy5faW5pdEludGVyYWN0aXZlTGlzdEl0ZW0oKTtcbiAgICB9XG5cbiAgICAvLyBJZiBubyB0eXBlIGF0dHJpYnV0ZSBpcyBzcGVjaWZpZWQgZm9yIGEgaG9zdCBgPGJ1dHRvbj5gIGVsZW1lbnQsIHNldCBpdCB0byBgYnV0dG9uYC4gSWYgYVxuICAgIC8vIHR5cGUgYXR0cmlidXRlIGlzIGFscmVhZHkgc3BlY2lmaWVkLCB3ZSBkbyBub3RoaW5nLiBXZSBkbyB0aGlzIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS5cbiAgICAvLyBUT0RPOiBEZXRlcm1pbmUgaWYgd2UgaW50ZW5kIHRvIGNvbnRpbnVlIGRvaW5nIHRoaXMgZm9yIHRoZSBNREMtYmFzZWQgbGlzdC5cbiAgICBpZiAoXG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnYnV0dG9uJyAmJlxuICAgICAgIXRoaXMuX2hvc3RFbGVtZW50Lmhhc0F0dHJpYnV0ZSgndHlwZScpXG4gICAgKSB7XG4gICAgICB0aGlzLl9ob3N0RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnYnV0dG9uJyk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHRoaXMuX21vbml0b3JQcm9qZWN0ZWRMaW5lc0FuZFRpdGxlKCk7XG4gICAgdGhpcy5fdXBkYXRlSXRlbUxpbmVzKHRydWUpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fc3Vic2NyaXB0aW9ucy51bnN1YnNjcmliZSgpO1xuICAgIGlmICh0aGlzLl9yaXBwbGVSZW5kZXJlciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIuX3JlbW92ZVRyaWdnZXJFdmVudHMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgbGlzdCBpdGVtIGhhcyBpY29ucyBvciBhdmF0YXJzLiAqL1xuICBfaGFzSWNvbk9yQXZhdGFyKCkge1xuICAgIHJldHVybiAhISh0aGlzLl9hdmF0YXJzLmxlbmd0aCB8fCB0aGlzLl9pY29ucy5sZW5ndGgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaW5pdEludGVyYWN0aXZlTGlzdEl0ZW0oKSB7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnbWF0LW1kYy1saXN0LWl0ZW0taW50ZXJhY3RpdmUnKTtcbiAgICB0aGlzLl9yaXBwbGVSZW5kZXJlciA9IG5ldyBSaXBwbGVSZW5kZXJlcihcbiAgICAgIHRoaXMsXG4gICAgICB0aGlzLl9uZ1pvbmUsXG4gICAgICB0aGlzLl9ob3N0RWxlbWVudCxcbiAgICAgIHRoaXMuX3BsYXRmb3JtLFxuICAgICk7XG4gICAgdGhpcy5fcmlwcGxlUmVuZGVyZXIuc2V0dXBUcmlnZ2VyRXZlbnRzKHRoaXMuX2hvc3RFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdWJzY3JpYmVzIHRvIGNoYW5nZXMgaW4gdGhlIHByb2plY3RlZCB0aXRsZSBhbmQgbGluZXMuIFRyaWdnZXJzIGFcbiAgICogaXRlbSBsaW5lcyB1cGRhdGUgd2hlbmV2ZXIgYSBjaGFuZ2Ugb2NjdXJzLlxuICAgKi9cbiAgcHJpdmF0ZSBfbW9uaXRvclByb2plY3RlZExpbmVzQW5kVGl0bGUoKSB7XG4gICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICBtZXJnZSh0aGlzLl9saW5lcyEuY2hhbmdlcywgdGhpcy5fdGl0bGVzIS5jaGFuZ2VzKS5zdWJzY3JpYmUoKCkgPT5cbiAgICAgICAgICB0aGlzLl91cGRhdGVJdGVtTGluZXMoZmFsc2UpLFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBsaW5lcyBvZiB0aGUgbGlzdCBpdGVtLiBCYXNlZCBvbiB0aGUgcHJvamVjdGVkIHVzZXIgY29udGVudCBhbmQgb3B0aW9uYWxcbiAgICogZXhwbGljaXQgbGluZXMgc2V0dGluZywgdGhlIHZpc3VhbCBhcHBlYXJhbmNlIG9mIHRoZSBsaXN0IGl0ZW0gaXMgZGV0ZXJtaW5lZC5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGludm9rZWQgd2hlbmV2ZXIgdGhlIHByb2plY3RlZCB1c2VyIGNvbnRlbnQgY2hhbmdlcywgb3JcbiAgICogd2hlbiB0aGUgZXhwbGljaXQgbGluZXMgaGF2ZSBiZWVuIHVwZGF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSByZWNoZWNrVW5zY29wZWRDb250ZW50IFdoZXRoZXIgdGhlIHByb2plY3RlZCB1bnNjb3BlZCBjb250ZW50IHNob3VsZCBiZSByZS1jaGVja2VkLlxuICAgKiAgIFRoZSB1bnNjb3BlZCBjb250ZW50IGlzIG5vdCByZS1jaGVja2VkIGZvciBldmVyeSB1cGRhdGUgYXMgaXQgaXMgYSByYXRoZXIgZXhwZW5zaXZlIGNoZWNrXG4gICAqICAgZm9yIGNvbnRlbnQgdGhhdCBpcyBleHBlY3RlZCB0byBub3QgY2hhbmdlIHZlcnkgb2Z0ZW4uXG4gICAqL1xuICBfdXBkYXRlSXRlbUxpbmVzKHJlY2hlY2tVbnNjb3BlZENvbnRlbnQ6IGJvb2xlYW4pIHtcbiAgICAvLyBJZiB0aGUgdXBkYXRlZCBpcyB0cmlnZ2VyZWQgdG9vIGVhcmx5IGJlZm9yZSB0aGUgdmlldyBhbmQgY29udGVudCBpcyBpbml0aWFsaXplZCxcbiAgICAvLyB3ZSBqdXN0IHNraXAgdGhlIHVwZGF0ZS4gQWZ0ZXIgdmlldyBpbml0aWFsaXphdGlvbiB0aGUgdXBkYXRlIGlzIHRyaWdnZXJlZCBhZ2Fpbi5cbiAgICBpZiAoIXRoaXMuX2xpbmVzIHx8ICF0aGlzLl90aXRsZXMgfHwgIXRoaXMuX3Vuc2NvcGVkQ29udGVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFJlLWNoZWNrIHRoZSBET00gZm9yIHVuc2NvcGVkIHRleHQgY29udGVudCBpZiByZXF1ZXN0ZWQuIFRoaXMgbmVlZHMgdG9cbiAgICAvLyBoYXBwZW4gYmVmb3JlIGFueSBjb21wdXRhdGlvbiBvciBzYW5pdHkgY2hlY2tzIHJ1biBhcyB0aGVzZSByZWx5IG9uIHRoZVxuICAgIC8vIHJlc3VsdCBvZiB3aGV0aGVyIHRoZXJlIGlzIHVuc2NvcGVkIHRleHQgY29udGVudCBvciBub3QuXG4gICAgaWYgKHJlY2hlY2tVbnNjb3BlZENvbnRlbnQpIHtcbiAgICAgIHRoaXMuX2NoZWNrRG9tRm9yVW5zY29wZWRUZXh0Q29udGVudCgpO1xuICAgIH1cblxuICAgIC8vIFNhbml0eSBjaGVjayB0aGUgbGlzdCBpdGVtIGxpbmVzIGFuZCB0aXRsZSBpbiB0aGUgY29udGVudC4gVGhpcyBpcyBhIGRldi1tb2RlIG9ubHlcbiAgICAvLyBjaGVjayB0aGF0IGNhbiBiZSBkZWFkLWNvZGUgZWxpbWluYXRlZCBieSBUZXJzZXIgaW4gcHJvZHVjdGlvbi5cbiAgICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgICBzYW5pdHlDaGVja0xpc3RJdGVtQ29udGVudCh0aGlzKTtcbiAgICB9XG5cbiAgICBjb25zdCBudW1iZXJPZkxpbmVzID0gdGhpcy5fZXhwbGljaXRMaW5lcyA/PyB0aGlzLl9pbmZlckxpbmVzRnJvbUNvbnRlbnQoKTtcbiAgICBjb25zdCB1bnNjb3BlZENvbnRlbnRFbCA9IHRoaXMuX3Vuc2NvcGVkQ29udGVudC5uYXRpdmVFbGVtZW50O1xuXG4gICAgLy8gVXBkYXRlIHRoZSBsaXN0IGl0ZW0gZWxlbWVudCB0byByZWZsZWN0IHRoZSBudW1iZXIgb2YgbGluZXMuXG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnbWF0LW1kYy1saXN0LWl0ZW0tc2luZ2xlLWxpbmUnLCBudW1iZXJPZkxpbmVzIDw9IDEpO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ21kYy1saXN0LWl0ZW0tLXdpdGgtb25lLWxpbmUnLCBudW1iZXJPZkxpbmVzIDw9IDEpO1xuICAgIHRoaXMuX2hvc3RFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ21kYy1saXN0LWl0ZW0tLXdpdGgtdHdvLWxpbmVzJywgbnVtYmVyT2ZMaW5lcyA9PT0gMik7XG4gICAgdGhpcy5faG9zdEVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnbWRjLWxpc3QtaXRlbS0td2l0aC10aHJlZS1saW5lcycsIG51bWJlck9mTGluZXMgPT09IDMpO1xuXG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gdGl0bGUgYW5kIHRoZSB1bnNjb3BlZCBjb250ZW50IGlzIHRoZSBpcyB0aGUgb25seSBsaW5lLCB0aGVcbiAgICAvLyB1bnNjb3BlZCB0ZXh0IGNvbnRlbnQgd2lsbCBiZSB0cmVhdGVkIGFzIHRoZSB0aXRsZSBvZiB0aGUgbGlzdC1pdGVtLlxuICAgIGlmICh0aGlzLl9oYXNVbnNjb3BlZFRleHRDb250ZW50KSB7XG4gICAgICBjb25zdCB0cmVhdEFzVGl0bGUgPSB0aGlzLl90aXRsZXMubGVuZ3RoID09PSAwICYmIG51bWJlck9mTGluZXMgPT09IDE7XG4gICAgICB1bnNjb3BlZENvbnRlbnRFbC5jbGFzc0xpc3QudG9nZ2xlKCdtZGMtbGlzdC1pdGVtX19wcmltYXJ5LXRleHQnLCB0cmVhdEFzVGl0bGUpO1xuICAgICAgdW5zY29wZWRDb250ZW50RWwuY2xhc3NMaXN0LnRvZ2dsZSgnbWRjLWxpc3QtaXRlbV9fc2Vjb25kYXJ5LXRleHQnLCAhdHJlYXRBc1RpdGxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdW5zY29wZWRDb250ZW50RWwuY2xhc3NMaXN0LnJlbW92ZSgnbWRjLWxpc3QtaXRlbV9fcHJpbWFyeS10ZXh0Jyk7XG4gICAgICB1bnNjb3BlZENvbnRlbnRFbC5jbGFzc0xpc3QucmVtb3ZlKCdtZGMtbGlzdC1pdGVtX19zZWNvbmRhcnktdGV4dCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbmZlcnMgdGhlIG51bWJlciBvZiBsaW5lcyBiYXNlZCBvbiB0aGUgcHJvamVjdGVkIHVzZXIgY29udGVudC4gVGhpcyBpcyB1c2VmdWxcbiAgICogaWYgbm8gZXhwbGljaXQgbnVtYmVyIG9mIGxpbmVzIGhhcyBiZWVuIHNwZWNpZmllZCBvbiB0aGUgbGlzdCBpdGVtLlxuICAgKlxuICAgKiBUaGUgbnVtYmVyIG9mIGxpbmVzIGlzIGluZmVycmVkIGJhc2VkIG9uIHdoZXRoZXIgdGhlcmUgaXMgYSB0aXRsZSwgdGhlIG51bWJlciBvZlxuICAgKiBhZGRpdGlvbmFsIGxpbmVzIChzZWNvbmRhcnkvdGVydGlhcnkpLiBBbiBhZGRpdGlvbmFsIGxpbmUgaXMgYWNxdWlyZWQgaWYgdGhlcmUgaXNcbiAgICogdW5zY29wZWQgdGV4dCBjb250ZW50LlxuICAgKi9cbiAgcHJpdmF0ZSBfaW5mZXJMaW5lc0Zyb21Db250ZW50KCkge1xuICAgIGxldCBudW1PZkxpbmVzID0gdGhpcy5fdGl0bGVzIS5sZW5ndGggKyB0aGlzLl9saW5lcyEubGVuZ3RoO1xuICAgIGlmICh0aGlzLl9oYXNVbnNjb3BlZFRleHRDb250ZW50KSB7XG4gICAgICBudW1PZkxpbmVzICs9IDE7XG4gICAgfVxuICAgIHJldHVybiBudW1PZkxpbmVzO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBsaXN0IGl0ZW0gaGFzIHVuc2NvcGVkIHRleHQgY29udGVudC4gKi9cbiAgcHJpdmF0ZSBfY2hlY2tEb21Gb3JVbnNjb3BlZFRleHRDb250ZW50KCkge1xuICAgIHRoaXMuX2hhc1Vuc2NvcGVkVGV4dENvbnRlbnQgPSBBcnJheS5mcm9tPENoaWxkTm9kZT4oXG4gICAgICB0aGlzLl91bnNjb3BlZENvbnRlbnQhLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2RlcyxcbiAgICApXG4gICAgICAuZmlsdGVyKG5vZGUgPT4gbm9kZS5ub2RlVHlwZSAhPT0gbm9kZS5DT01NRU5UX05PREUpXG4gICAgICAuc29tZShub2RlID0+ICEhKG5vZGUudGV4dENvbnRlbnQgJiYgbm9kZS50ZXh0Q29udGVudC50cmltKCkpKTtcbiAgfVxufVxuXG4vKipcbiAqIFNhbml0eSBjaGVja3MgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIGxpc3QgaXRlbSB3aXRoIHJlc3BlY3QgdG8gdGhlIGFtb3VudFxuICogb2YgbGluZXMsIHdoZXRoZXIgdGhlcmUgaXMgYSB0aXRsZSwgb3IgaWYgdGhlcmUgaXMgdW5zY29wZWQgdGV4dCBjb250ZW50LlxuICpcbiAqIFRoZSBjaGVja3MgYXJlIGV4dHJhY3RlZCBpbnRvIGEgdG9wLWxldmVsIGZ1bmN0aW9uIHRoYXQgY2FuIGJlIGRlYWQtY29kZVxuICogZWxpbWluYXRlZCBieSBUZXJzZXIgb3Igb3RoZXIgb3B0aW1pemVycyBpbiBwcm9kdWN0aW9uIG1vZGUuXG4gKi9cbmZ1bmN0aW9uIHNhbml0eUNoZWNrTGlzdEl0ZW1Db250ZW50KGl0ZW06IE1hdExpc3RJdGVtQmFzZSkge1xuICBjb25zdCBudW1UaXRsZXMgPSBpdGVtLl90aXRsZXMhLmxlbmd0aDtcbiAgY29uc3QgbnVtTGluZXMgPSBpdGVtLl90aXRsZXMhLmxlbmd0aDtcblxuICBpZiAobnVtVGl0bGVzID4gMSkge1xuICAgIHRocm93IEVycm9yKCdBIGxpc3QgaXRlbSBjYW5ub3QgaGF2ZSBtdWx0aXBsZSB0aXRsZXMuJyk7XG4gIH1cbiAgaWYgKG51bVRpdGxlcyA9PT0gMCAmJiBudW1MaW5lcyA+IDApIHtcbiAgICB0aHJvdyBFcnJvcignQSBsaXN0IGl0ZW0gbGluZSBjYW4gb25seSBiZSB1c2VkIGlmIHRoZXJlIGlzIGEgbGlzdCBpdGVtIHRpdGxlLicpO1xuICB9XG4gIGlmIChcbiAgICBudW1UaXRsZXMgPT09IDAgJiZcbiAgICBpdGVtLl9oYXNVbnNjb3BlZFRleHRDb250ZW50ICYmXG4gICAgaXRlbS5fZXhwbGljaXRMaW5lcyAhPT0gbnVsbCAmJlxuICAgIGl0ZW0uX2V4cGxpY2l0TGluZXMgPiAxXG4gICkge1xuICAgIHRocm93IEVycm9yKCdBIGxpc3QgaXRlbSBjYW5ub3QgaGF2ZSB3cmFwcGluZyBjb250ZW50IHdpdGhvdXQgYSB0aXRsZS4nKTtcbiAgfVxuICBpZiAobnVtTGluZXMgPiAyIHx8IChudW1MaW5lcyA9PT0gMiAmJiBpdGVtLl9oYXNVbnNjb3BlZFRleHRDb250ZW50KSkge1xuICAgIHRocm93IEVycm9yKCdBIGxpc3QgaXRlbSBjYW4gaGF2ZSBhdCBtYXhpbXVtIHRocmVlIGxpbmVzLicpO1xuICB9XG59XG4iXX0=
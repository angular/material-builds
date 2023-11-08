/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, Directive, ElementRef, Inject, Input, QueryList, ViewEncapsulation, } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
export class MatToolbarRow {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatToolbarRow, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.0", type: MatToolbarRow, selector: "mat-toolbar-row", host: { classAttribute: "mat-toolbar-row" }, exportAs: ["matToolbarRow"], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatToolbarRow, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-toolbar-row',
                    exportAs: 'matToolbarRow',
                    host: { 'class': 'mat-toolbar-row' },
                }]
        }] });
export class MatToolbar {
    constructor(_elementRef, _platform, document) {
        this._elementRef = _elementRef;
        this._platform = _platform;
        // TODO: make the document a required param when doing breaking changes.
        this._document = document;
    }
    ngAfterViewInit() {
        if (this._platform.isBrowser) {
            this._checkToolbarMixedModes();
            this._toolbarRows.changes.subscribe(() => this._checkToolbarMixedModes());
        }
    }
    /**
     * Throws an exception when developers are attempting to combine the different toolbar row modes.
     */
    _checkToolbarMixedModes() {
        if (this._toolbarRows.length && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            // Check if there are any other DOM nodes that can display content but aren't inside of
            // a <mat-toolbar-row> element.
            const isCombinedUsage = Array.from(this._elementRef.nativeElement.childNodes)
                .filter(node => !(node.classList && node.classList.contains('mat-toolbar-row')))
                .filter(node => node.nodeType !== (this._document ? this._document.COMMENT_NODE : 8))
                .some(node => !!(node.textContent && node.textContent.trim()));
            if (isCombinedUsage) {
                throwToolbarMixedModesError();
            }
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatToolbar, deps: [{ token: i0.ElementRef }, { token: i1.Platform }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.0.0", type: MatToolbar, selector: "mat-toolbar", inputs: { color: "color" }, host: { properties: { "class": "color ? \"mat-\" + color : \"\"", "class.mat-toolbar-multiple-rows": "_toolbarRows.length > 0", "class.mat-toolbar-single-row": "_toolbarRows.length === 0" }, classAttribute: "mat-toolbar" }, queries: [{ propertyName: "_toolbarRows", predicate: MatToolbarRow, descendants: true }], exportAs: ["matToolbar"], ngImport: i0, template: "<ng-content></ng-content>\n<ng-content select=\"mat-toolbar-row\"></ng-content>\n", styles: [".mat-toolbar{background:var(--mat-toolbar-container-background-color);color:var(--mat-toolbar-container-text-color)}.mat-toolbar,.mat-toolbar h1,.mat-toolbar h2,.mat-toolbar h3,.mat-toolbar h4,.mat-toolbar h5,.mat-toolbar h6{font-family:var(--mat-toolbar-title-text-font);font-size:var(--mat-toolbar-title-text-size);line-height:var(--mat-toolbar-title-text-line-height);font-weight:var(--mat-toolbar-title-text-weight);letter-spacing:var(--mat-toolbar-title-text-tracking);margin:0}.cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar .mat-form-field-underline,.mat-toolbar .mat-form-field-ripple,.mat-toolbar .mat-focused .mat-form-field-ripple{background-color:currentColor}.mat-toolbar .mat-form-field-label,.mat-toolbar .mat-focused .mat-form-field-label,.mat-toolbar .mat-select-value,.mat-toolbar .mat-select-arrow,.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow{color:inherit}.mat-toolbar .mat-input-element{caret-color:currentColor}.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed{--mdc-text-button-label-text-color: inherit;--mdc-outlined-button-label-text-color: inherit}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap;height:var(--mat-toolbar-standard-height)}@media(max-width: 599px){.mat-toolbar-row,.mat-toolbar-single-row{height:var(--mat-toolbar-mobile-height)}}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%;min-height:var(--mat-toolbar-standard-height)}@media(max-width: 599px){.mat-toolbar-multiple-rows{min-height:var(--mat-toolbar-mobile-height)}}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatToolbar, decorators: [{
            type: Component,
            args: [{ selector: 'mat-toolbar', exportAs: 'matToolbar', host: {
                        'class': 'mat-toolbar',
                        '[class]': 'color ? "mat-" + color : ""',
                        '[class.mat-toolbar-multiple-rows]': '_toolbarRows.length > 0',
                        '[class.mat-toolbar-single-row]': '_toolbarRows.length === 0',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<ng-content></ng-content>\n<ng-content select=\"mat-toolbar-row\"></ng-content>\n", styles: [".mat-toolbar{background:var(--mat-toolbar-container-background-color);color:var(--mat-toolbar-container-text-color)}.mat-toolbar,.mat-toolbar h1,.mat-toolbar h2,.mat-toolbar h3,.mat-toolbar h4,.mat-toolbar h5,.mat-toolbar h6{font-family:var(--mat-toolbar-title-text-font);font-size:var(--mat-toolbar-title-text-size);line-height:var(--mat-toolbar-title-text-line-height);font-weight:var(--mat-toolbar-title-text-weight);letter-spacing:var(--mat-toolbar-title-text-tracking);margin:0}.cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar .mat-form-field-underline,.mat-toolbar .mat-form-field-ripple,.mat-toolbar .mat-focused .mat-form-field-ripple{background-color:currentColor}.mat-toolbar .mat-form-field-label,.mat-toolbar .mat-focused .mat-form-field-label,.mat-toolbar .mat-select-value,.mat-toolbar .mat-select-arrow,.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow{color:inherit}.mat-toolbar .mat-input-element{caret-color:currentColor}.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed{--mdc-text-button-label-text-color: inherit;--mdc-outlined-button-label-text-color: inherit}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap;height:var(--mat-toolbar-standard-height)}@media(max-width: 599px){.mat-toolbar-row,.mat-toolbar-single-row{height:var(--mat-toolbar-mobile-height)}}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%;min-height:var(--mat-toolbar-standard-height)}@media(max-width: 599px){.mat-toolbar-multiple-rows{min-height:var(--mat-toolbar-mobile-height)}}"] }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i1.Platform }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }], propDecorators: { color: [{
                type: Input
            }], _toolbarRows: [{
                type: ContentChildren,
                args: [MatToolbarRow, { descendants: true }]
            }] } });
/**
 * Throws an exception when attempting to combine the different toolbar row modes.
 * @docs-private
 */
export function throwToolbarMixedModesError() {
    throw Error('MatToolbar: Attempting to combine different toolbar modes. ' +
        'Either specify multiple `<mat-toolbar-row>` elements explicitly or just place content ' +
        'inside of a `<mat-toolbar>` for a single row.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90b29sYmFyL3Rvb2xiYXIudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdG9vbGJhci90b29sYmFyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7OztBQU92QixNQUFNLE9BQU8sYUFBYTs4R0FBYixhQUFhO2tHQUFiLGFBQWE7OzJGQUFiLGFBQWE7a0JBTHpCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsUUFBUSxFQUFFLGVBQWU7b0JBQ3pCLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBQztpQkFDbkM7O0FBaUJELE1BQU0sT0FBTyxVQUFVO0lBVXJCLFlBQ1ksV0FBdUIsRUFDekIsU0FBbUIsRUFDVCxRQUFjO1FBRnRCLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQ3pCLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFHM0Isd0VBQXdFO1FBQ3hFLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQzVCLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFBRTtZQUM1QixJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztTQUMzRTtJQUNILENBQUM7SUFFRDs7T0FFRztJQUNLLHVCQUF1QjtRQUM3QixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxTQUFTLEtBQUssV0FBVyxJQUFJLFNBQVMsQ0FBQyxFQUFFO1lBQy9FLHVGQUF1RjtZQUN2RiwrQkFBK0I7WUFDL0IsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBYyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7aUJBQ3ZGLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztpQkFDL0UsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDcEYsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUVqRSxJQUFJLGVBQWUsRUFBRTtnQkFDbkIsMkJBQTJCLEVBQUUsQ0FBQzthQUMvQjtTQUNGO0lBQ0gsQ0FBQzs4R0ExQ1UsVUFBVSxvRUFhWCxRQUFRO2tHQWJQLFVBQVUsNFVBUUosYUFBYSwwRUNwRGhDLG1GQUVBOzsyRkQwQ2EsVUFBVTtrQkFkdEIsU0FBUzsrQkFDRSxhQUFhLFlBQ2IsWUFBWSxRQUdoQjt3QkFDSixPQUFPLEVBQUUsYUFBYTt3QkFDdEIsU0FBUyxFQUFFLDZCQUE2Qjt3QkFDeEMsbUNBQW1DLEVBQUUseUJBQXlCO3dCQUM5RCxnQ0FBZ0MsRUFBRSwyQkFBMkI7cUJBQzlELG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJOzswQkFlbEMsTUFBTTsyQkFBQyxRQUFRO3lDQVZULEtBQUs7c0JBQWIsS0FBSztnQkFLK0MsWUFBWTtzQkFBaEUsZUFBZTt1QkFBQyxhQUFhLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOztBQXFDckQ7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLDJCQUEyQjtJQUN6QyxNQUFNLEtBQUssQ0FDVCw2REFBNkQ7UUFDM0Qsd0ZBQXdGO1FBQ3hGLCtDQUErQyxDQUNsRCxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBRdWVyeUxpc3QsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LXRvb2xiYXItcm93JyxcbiAgZXhwb3J0QXM6ICdtYXRUb29sYmFyUm93JyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtdG9vbGJhci1yb3cnfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VG9vbGJhclJvdyB7fVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtdG9vbGJhcicsXG4gIGV4cG9ydEFzOiAnbWF0VG9vbGJhcicsXG4gIHRlbXBsYXRlVXJsOiAndG9vbGJhci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3Rvb2xiYXIuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRvb2xiYXInLFxuICAgICdbY2xhc3NdJzogJ2NvbG9yID8gXCJtYXQtXCIgKyBjb2xvciA6IFwiXCInLFxuICAgICdbY2xhc3MubWF0LXRvb2xiYXItbXVsdGlwbGUtcm93c10nOiAnX3Rvb2xiYXJSb3dzLmxlbmd0aCA+IDAnLFxuICAgICdbY2xhc3MubWF0LXRvb2xiYXItc2luZ2xlLXJvd10nOiAnX3Rvb2xiYXJSb3dzLmxlbmd0aCA9PT0gMCcsXG4gIH0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUb29sYmFyIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCB7XG4gIC8vIFRPRE86IHNob3VsZCBiZSB0eXBlZCBhcyBgVGhlbWVQYWxldHRlYCBidXQgaW50ZXJuYWwgYXBwcyBwYXNzIGluIGFyYml0cmFyeSBzdHJpbmdzLlxuICAvKiogUGFsZXR0ZSBjb2xvciBvZiB0aGUgdG9vbGJhci4gKi9cbiAgQElucHV0KCkgY29sb3I/OiBzdHJpbmcgfCBudWxsO1xuXG4gIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudDtcblxuICAvKiogUmVmZXJlbmNlIHRvIGFsbCB0b29sYmFyIHJvdyBlbGVtZW50cyB0aGF0IGhhdmUgYmVlbiBwcm9qZWN0ZWQuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0VG9vbGJhclJvdywge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3Rvb2xiYXJSb3dzOiBRdWVyeUxpc3Q8TWF0VG9vbGJhclJvdz47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudD86IGFueSxcbiAgKSB7XG4gICAgLy8gVE9ETzogbWFrZSB0aGUgZG9jdW1lbnQgYSByZXF1aXJlZCBwYXJhbSB3aGVuIGRvaW5nIGJyZWFraW5nIGNoYW5nZXMuXG4gICAgdGhpcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5fcGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLl9jaGVja1Rvb2xiYXJNaXhlZE1vZGVzKCk7XG4gICAgICB0aGlzLl90b29sYmFyUm93cy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGVja1Rvb2xiYXJNaXhlZE1vZGVzKCkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaHJvd3MgYW4gZXhjZXB0aW9uIHdoZW4gZGV2ZWxvcGVycyBhcmUgYXR0ZW1wdGluZyB0byBjb21iaW5lIHRoZSBkaWZmZXJlbnQgdG9vbGJhciByb3cgbW9kZXMuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja1Rvb2xiYXJNaXhlZE1vZGVzKCkge1xuICAgIGlmICh0aGlzLl90b29sYmFyUm93cy5sZW5ndGggJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGFyZSBhbnkgb3RoZXIgRE9NIG5vZGVzIHRoYXQgY2FuIGRpc3BsYXkgY29udGVudCBidXQgYXJlbid0IGluc2lkZSBvZlxuICAgICAgLy8gYSA8bWF0LXRvb2xiYXItcm93PiBlbGVtZW50LlxuICAgICAgY29uc3QgaXNDb21iaW5lZFVzYWdlID0gQXJyYXkuZnJvbTxIVE1MRWxlbWVudD4odGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXMpXG4gICAgICAgIC5maWx0ZXIobm9kZSA9PiAhKG5vZGUuY2xhc3NMaXN0ICYmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXQtdG9vbGJhci1yb3cnKSkpXG4gICAgICAgIC5maWx0ZXIobm9kZSA9PiBub2RlLm5vZGVUeXBlICE9PSAodGhpcy5fZG9jdW1lbnQgPyB0aGlzLl9kb2N1bWVudC5DT01NRU5UX05PREUgOiA4KSlcbiAgICAgICAgLnNvbWUobm9kZSA9PiAhIShub2RlLnRleHRDb250ZW50ICYmIG5vZGUudGV4dENvbnRlbnQudHJpbSgpKSk7XG5cbiAgICAgIGlmIChpc0NvbWJpbmVkVXNhZ2UpIHtcbiAgICAgICAgdGhyb3dUb29sYmFyTWl4ZWRNb2Rlc0Vycm9yKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVGhyb3dzIGFuIGV4Y2VwdGlvbiB3aGVuIGF0dGVtcHRpbmcgdG8gY29tYmluZSB0aGUgZGlmZmVyZW50IHRvb2xiYXIgcm93IG1vZGVzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dUb29sYmFyTWl4ZWRNb2Rlc0Vycm9yKCkge1xuICB0aHJvdyBFcnJvcihcbiAgICAnTWF0VG9vbGJhcjogQXR0ZW1wdGluZyB0byBjb21iaW5lIGRpZmZlcmVudCB0b29sYmFyIG1vZGVzLiAnICtcbiAgICAgICdFaXRoZXIgc3BlY2lmeSBtdWx0aXBsZSBgPG1hdC10b29sYmFyLXJvdz5gIGVsZW1lbnRzIGV4cGxpY2l0bHkgb3IganVzdCBwbGFjZSBjb250ZW50ICcgK1xuICAgICAgJ2luc2lkZSBvZiBhIGA8bWF0LXRvb2xiYXI+YCBmb3IgYSBzaW5nbGUgcm93LicsXG4gICk7XG59XG4iLCI8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48bmctY29udGVudCBzZWxlY3Q9XCJtYXQtdG9vbGJhci1yb3dcIj48L25nLWNvbnRlbnQ+XG4iXX0=
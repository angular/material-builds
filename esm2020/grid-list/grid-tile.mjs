/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ViewEncapsulation, ElementRef, Input, Optional, ContentChildren, QueryList, Directive, ChangeDetectionStrategy, Inject, } from '@angular/core';
import { MatLine, setLines } from '@angular/material/core';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MAT_GRID_LIST } from './grid-list-base';
import * as i0 from "@angular/core";
export class MatGridTile {
    constructor(_element, _gridList) {
        this._element = _element;
        this._gridList = _gridList;
        this._rowspan = 1;
        this._colspan = 1;
    }
    /** Amount of rows that the grid tile takes up. */
    get rowspan() {
        return this._rowspan;
    }
    set rowspan(value) {
        this._rowspan = Math.round(coerceNumberProperty(value));
    }
    /** Amount of columns that the grid tile takes up. */
    get colspan() {
        return this._colspan;
    }
    set colspan(value) {
        this._colspan = Math.round(coerceNumberProperty(value));
    }
    /**
     * Sets the style of the grid-tile element.  Needs to be set manually to avoid
     * "Changed after checked" errors that would occur with HostBinding.
     */
    _setStyle(property, value) {
        this._element.nativeElement.style[property] = value;
    }
}
MatGridTile.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatGridTile, deps: [{ token: i0.ElementRef }, { token: MAT_GRID_LIST, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatGridTile.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.1", type: MatGridTile, selector: "mat-grid-tile", inputs: { rowspan: "rowspan", colspan: "colspan" }, host: { properties: { "attr.rowspan": "rowspan", "attr.colspan": "colspan" }, classAttribute: "mat-grid-tile" }, exportAs: ["matGridTile"], ngImport: i0, template: "<div class=\"mat-grid-tile-content\">\n  <ng-content></ng-content>\n</div>\n", styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}\n"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatGridTile, decorators: [{
            type: Component,
            args: [{ selector: 'mat-grid-tile', exportAs: 'matGridTile', host: {
                        'class': 'mat-grid-tile',
                        // Ensures that the "rowspan" and "colspan" input value is reflected in
                        // the DOM. This is needed for the grid-tile harness.
                        '[attr.rowspan]': 'rowspan',
                        '[attr.colspan]': 'colspan',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"mat-grid-tile-content\">\n  <ng-content></ng-content>\n</div>\n", styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_GRID_LIST]
                }] }]; }, propDecorators: { rowspan: [{
                type: Input
            }], colspan: [{
                type: Input
            }] } });
export class MatGridTileText {
    constructor(_element) {
        this._element = _element;
    }
    ngAfterContentInit() {
        setLines(this._lines, this._element);
    }
}
MatGridTileText.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatGridTileText, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component });
MatGridTileText.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.0.1", type: MatGridTileText, selector: "mat-grid-tile-header, mat-grid-tile-footer", queries: [{ propertyName: "_lines", predicate: MatLine, descendants: true }], ngImport: i0, template: "<ng-content select=\"[mat-grid-avatar], [matGridAvatar]\"></ng-content>\n<div class=\"mat-grid-list-text\"><ng-content select=\"[mat-line], [matLine]\"></ng-content></div>\n<ng-content></ng-content>\n", changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatGridTileText, decorators: [{
            type: Component,
            args: [{ selector: 'mat-grid-tile-header, mat-grid-tile-footer', changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<ng-content select=\"[mat-grid-avatar], [matGridAvatar]\"></ng-content>\n<div class=\"mat-grid-list-text\"><ng-content select=\"[mat-line], [matLine]\"></ng-content></div>\n<ng-content></ng-content>\n" }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { _lines: [{
                type: ContentChildren,
                args: [MatLine, { descendants: true }]
            }] } });
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export class MatGridAvatarCssMatStyler {
}
MatGridAvatarCssMatStyler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatGridAvatarCssMatStyler, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatGridAvatarCssMatStyler.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.1", type: MatGridAvatarCssMatStyler, selector: "[mat-grid-avatar], [matGridAvatar]", host: { classAttribute: "mat-grid-avatar" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatGridAvatarCssMatStyler, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-grid-avatar], [matGridAvatar]',
                    host: { 'class': 'mat-grid-avatar' },
                }]
        }] });
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export class MatGridTileHeaderCssMatStyler {
}
MatGridTileHeaderCssMatStyler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatGridTileHeaderCssMatStyler, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatGridTileHeaderCssMatStyler.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.1", type: MatGridTileHeaderCssMatStyler, selector: "mat-grid-tile-header", host: { classAttribute: "mat-grid-tile-header" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatGridTileHeaderCssMatStyler, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-grid-tile-header',
                    host: { 'class': 'mat-grid-tile-header' },
                }]
        }] });
/**
 * Directive whose purpose is to add the mat- CSS styling to this selector.
 * @docs-private
 */
export class MatGridTileFooterCssMatStyler {
}
MatGridTileFooterCssMatStyler.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatGridTileFooterCssMatStyler, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatGridTileFooterCssMatStyler.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.1", type: MatGridTileFooterCssMatStyler, selector: "mat-grid-tile-footer", host: { classAttribute: "mat-grid-tile-footer" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatGridTileFooterCssMatStyler, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-grid-tile-footer',
                    host: { 'class': 'mat-grid-tile-footer' },
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC10aWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLXRpbGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L2dyaWQtdGlsZS5odG1sIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLXRpbGUtdGV4dC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLFVBQVUsRUFDVixLQUFLLEVBQ0wsUUFBUSxFQUNSLGVBQWUsRUFDZixTQUFTLEVBRVQsU0FBUyxFQUNULHVCQUF1QixFQUN2QixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUN6RCxPQUFPLEVBQUMsb0JBQW9CLEVBQWMsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RSxPQUFPLEVBQUMsYUFBYSxFQUFrQixNQUFNLGtCQUFrQixDQUFDOztBQWlCaEUsTUFBTSxPQUFPLFdBQVc7SUFJdEIsWUFDVSxRQUFpQyxFQUNDLFNBQTJCO1FBRDdELGFBQVEsR0FBUixRQUFRLENBQXlCO1FBQ0MsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFMdkUsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUNyQixhQUFRLEdBQVcsQ0FBQyxDQUFDO0lBS2xCLENBQUM7SUFFSixrREFBa0Q7SUFDbEQsSUFDSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxxREFBcUQ7SUFDckQsSUFDSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxJQUFJLE9BQU8sQ0FBQyxLQUFhO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRDs7O09BR0c7SUFDSCxTQUFTLENBQUMsUUFBZ0IsRUFBRSxLQUFVO1FBQ25DLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQWEsQ0FBQyxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDL0QsQ0FBQzs7d0dBakNVLFdBQVcsNENBTUEsYUFBYTs0RkFOeEIsV0FBVyxxUEN4Q3hCLDhFQUdBOzJGRHFDYSxXQUFXO2tCQWZ2QixTQUFTOytCQUNFLGVBQWUsWUFDZixhQUFhLFFBQ2pCO3dCQUNKLE9BQU8sRUFBRSxlQUFlO3dCQUN4Qix1RUFBdUU7d0JBQ3ZFLHFEQUFxRDt3QkFDckQsZ0JBQWdCLEVBQUUsU0FBUzt3QkFDM0IsZ0JBQWdCLEVBQUUsU0FBUztxQkFDNUIsaUJBR2MsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTTs7MEJBUTVDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMsYUFBYTs0Q0FLL0IsT0FBTztzQkFEVixLQUFLO2dCQVVGLE9BQU87c0JBRFYsS0FBSzs7QUEwQlIsTUFBTSxPQUFPLGVBQWU7SUFHMUIsWUFBb0IsUUFBaUM7UUFBakMsYUFBUSxHQUFSLFFBQVEsQ0FBeUI7SUFBRyxDQUFDO0lBRXpELGtCQUFrQjtRQUNoQixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkMsQ0FBQzs7NEdBUFUsZUFBZTtnR0FBZixlQUFlLHlHQUNULE9BQU8sZ0RFdEYxQiwwTUFHQTsyRkZrRmEsZUFBZTtrQkFOM0IsU0FBUzsrQkFDRSw0Q0FBNEMsbUJBRXJDLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUk7aUdBR1UsTUFBTTtzQkFBcEQsZUFBZTt1QkFBQyxPQUFPLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDOztBQVMvQzs7O0dBR0c7QUFLSCxNQUFNLE9BQU8seUJBQXlCOztzSEFBekIseUJBQXlCOzBHQUF6Qix5QkFBeUI7MkZBQXpCLHlCQUF5QjtrQkFKckMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0NBQW9DO29CQUM5QyxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUM7aUJBQ25DOztBQUdEOzs7R0FHRztBQUtILE1BQU0sT0FBTyw2QkFBNkI7OzBIQUE3Qiw2QkFBNkI7OEdBQTdCLDZCQUE2QjsyRkFBN0IsNkJBQTZCO2tCQUp6QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBQztpQkFDeEM7O0FBR0Q7OztHQUdHO0FBS0gsTUFBTSxPQUFPLDZCQUE2Qjs7MEhBQTdCLDZCQUE2Qjs4R0FBN0IsNkJBQTZCOzJGQUE3Qiw2QkFBNkI7a0JBSnpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtvQkFDaEMsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFDO2lCQUN4QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT3B0aW9uYWwsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgUXVlcnlMaXN0LFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBEaXJlY3RpdmUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBJbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRMaW5lLCBzZXRMaW5lc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7TUFUX0dSSURfTElTVCwgTWF0R3JpZExpc3RCYXNlfSBmcm9tICcuL2dyaWQtbGlzdC1iYXNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWdyaWQtdGlsZScsXG4gIGV4cG9ydEFzOiAnbWF0R3JpZFRpbGUnLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1ncmlkLXRpbGUnLFxuICAgIC8vIEVuc3VyZXMgdGhhdCB0aGUgXCJyb3dzcGFuXCIgYW5kIFwiY29sc3BhblwiIGlucHV0IHZhbHVlIGlzIHJlZmxlY3RlZCBpblxuICAgIC8vIHRoZSBET00uIFRoaXMgaXMgbmVlZGVkIGZvciB0aGUgZ3JpZC10aWxlIGhhcm5lc3MuXG4gICAgJ1thdHRyLnJvd3NwYW5dJzogJ3Jvd3NwYW4nLFxuICAgICdbYXR0ci5jb2xzcGFuXSc6ICdjb2xzcGFuJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdncmlkLXRpbGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydncmlkLWxpc3QuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRHcmlkVGlsZSB7XG4gIF9yb3dzcGFuOiBudW1iZXIgPSAxO1xuICBfY29sc3BhbjogbnVtYmVyID0gMTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9HUklEX0xJU1QpIHB1YmxpYyBfZ3JpZExpc3Q/OiBNYXRHcmlkTGlzdEJhc2UsXG4gICkge31cblxuICAvKiogQW1vdW50IG9mIHJvd3MgdGhhdCB0aGUgZ3JpZCB0aWxlIHRha2VzIHVwLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcm93c3BhbigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9yb3dzcGFuO1xuICB9XG4gIHNldCByb3dzcGFuKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9yb3dzcGFuID0gTWF0aC5yb3VuZChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSkpO1xuICB9XG5cbiAgLyoqIEFtb3VudCBvZiBjb2x1bW5zIHRoYXQgdGhlIGdyaWQgdGlsZSB0YWtlcyB1cC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGNvbHNwYW4oKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fY29sc3BhbjtcbiAgfVxuICBzZXQgY29sc3Bhbih2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fY29sc3BhbiA9IE1hdGgucm91bmQoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBzdHlsZSBvZiB0aGUgZ3JpZC10aWxlIGVsZW1lbnQuICBOZWVkcyB0byBiZSBzZXQgbWFudWFsbHkgdG8gYXZvaWRcbiAgICogXCJDaGFuZ2VkIGFmdGVyIGNoZWNrZWRcIiBlcnJvcnMgdGhhdCB3b3VsZCBvY2N1ciB3aXRoIEhvc3RCaW5kaW5nLlxuICAgKi9cbiAgX3NldFN0eWxlKHByb3BlcnR5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlIGFzIGFueSlbcHJvcGVydHldID0gdmFsdWU7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfcm93c3BhbjogTnVtYmVySW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jb2xzcGFuOiBOdW1iZXJJbnB1dDtcbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWdyaWQtdGlsZS1oZWFkZXIsIG1hdC1ncmlkLXRpbGUtZm9vdGVyJyxcbiAgdGVtcGxhdGVVcmw6ICdncmlkLXRpbGUtdGV4dC5odG1sJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlVGV4dCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICBAQ29udGVudENoaWxkcmVuKE1hdExpbmUsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF9saW5lczogUXVlcnlMaXN0PE1hdExpbmU+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+KSB7fVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBzZXRMaW5lcyh0aGlzLl9saW5lcywgdGhpcy5fZWxlbWVudCk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXJlY3RpdmUgd2hvc2UgcHVycG9zZSBpcyB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcgdG8gdGhpcyBzZWxlY3Rvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdC1ncmlkLWF2YXRhcl0sIFttYXRHcmlkQXZhdGFyXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LWdyaWQtYXZhdGFyJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRBdmF0YXJDc3NNYXRTdHlsZXIge31cblxuLyoqXG4gKiBEaXJlY3RpdmUgd2hvc2UgcHVycG9zZSBpcyB0byBhZGQgdGhlIG1hdC0gQ1NTIHN0eWxpbmcgdG8gdGhpcyBzZWxlY3Rvci5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWdyaWQtdGlsZS1oZWFkZXInLFxuICBob3N0OiB7J2NsYXNzJzogJ21hdC1ncmlkLXRpbGUtaGVhZGVyJ30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRUaWxlSGVhZGVyQ3NzTWF0U3R5bGVyIHt9XG5cbi8qKlxuICogRGlyZWN0aXZlIHdob3NlIHB1cnBvc2UgaXMgdG8gYWRkIHRoZSBtYXQtIENTUyBzdHlsaW5nIHRvIHRoaXMgc2VsZWN0b3IuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLXRpbGUtZm9vdGVyJyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtZ3JpZC10aWxlLWZvb3Rlcid9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRHcmlkVGlsZUZvb3RlckNzc01hdFN0eWxlciB7fVxuIiwiPGRpdiBjbGFzcz1cIm1hdC1ncmlkLXRpbGUtY29udGVudFwiPlxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48L2Rpdj5cbiIsIjxuZy1jb250ZW50IHNlbGVjdD1cIlttYXQtZ3JpZC1hdmF0YXJdLCBbbWF0R3JpZEF2YXRhcl1cIj48L25nLWNvbnRlbnQ+XG48ZGl2IGNsYXNzPVwibWF0LWdyaWQtbGlzdC10ZXh0XCI+PG5nLWNvbnRlbnQgc2VsZWN0PVwiW21hdC1saW5lXSwgW21hdExpbmVdXCI+PC9uZy1jb250ZW50PjwvZGl2PlxuPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuIl19
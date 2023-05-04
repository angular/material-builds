/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Component, ViewEncapsulation, Input, ContentChildren, QueryList, ElementRef, Optional, ChangeDetectionStrategy, } from '@angular/core';
import { MatGridTile } from './grid-tile';
import { TileCoordinator } from './tile-coordinator';
import { FitTileStyler, RatioTileStyler, FixedTileStyler, } from './tile-styler';
import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MAT_GRID_LIST } from './grid-list-base';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
// TODO(kara): Conditional (responsive) column count / row size.
// TODO(kara): Re-layout on window resize / media change (debounced).
// TODO(kara): gridTileHeader and gridTileFooter.
const MAT_FIT_MODE = 'fit';
class MatGridList {
    constructor(_element, _dir) {
        this._element = _element;
        this._dir = _dir;
        /** The amount of space between tiles. This will be something like '5px' or '2em'. */
        this._gutter = '1px';
    }
    /** Amount of columns in the grid list. */
    get cols() {
        return this._cols;
    }
    set cols(value) {
        this._cols = Math.max(1, Math.round(coerceNumberProperty(value)));
    }
    /** Size of the grid list's gutter in pixels. */
    get gutterSize() {
        return this._gutter;
    }
    set gutterSize(value) {
        this._gutter = `${value == null ? '' : value}`;
    }
    /** Set internal representation of row height from the user-provided value. */
    get rowHeight() {
        return this._rowHeight;
    }
    set rowHeight(value) {
        const newValue = `${value == null ? '' : value}`;
        if (newValue !== this._rowHeight) {
            this._rowHeight = newValue;
            this._setTileStyler(this._rowHeight);
        }
    }
    ngOnInit() {
        this._checkCols();
        this._checkRowHeight();
    }
    /**
     * The layout calculation is fairly cheap if nothing changes, so there's little cost
     * to run it frequently.
     */
    ngAfterContentChecked() {
        this._layoutTiles();
    }
    /** Throw a friendly error if cols property is missing */
    _checkCols() {
        if (!this.cols && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error(`mat-grid-list: must pass in number of columns. ` + `Example: <mat-grid-list cols="3">`);
        }
    }
    /** Default to equal width:height if rowHeight property is missing */
    _checkRowHeight() {
        if (!this._rowHeight) {
            this._setTileStyler('1:1');
        }
    }
    /** Creates correct Tile Styler subtype based on rowHeight passed in by user */
    _setTileStyler(rowHeight) {
        if (this._tileStyler) {
            this._tileStyler.reset(this);
        }
        if (rowHeight === MAT_FIT_MODE) {
            this._tileStyler = new FitTileStyler();
        }
        else if (rowHeight && rowHeight.indexOf(':') > -1) {
            this._tileStyler = new RatioTileStyler(rowHeight);
        }
        else {
            this._tileStyler = new FixedTileStyler(rowHeight);
        }
    }
    /** Computes and applies the size and position for all children grid tiles. */
    _layoutTiles() {
        if (!this._tileCoordinator) {
            this._tileCoordinator = new TileCoordinator();
        }
        const tracker = this._tileCoordinator;
        const tiles = this._tiles.filter(tile => !tile._gridList || tile._gridList === this);
        const direction = this._dir ? this._dir.value : 'ltr';
        this._tileCoordinator.update(this.cols, tiles);
        this._tileStyler.init(this.gutterSize, tracker, this.cols, direction);
        tiles.forEach((tile, index) => {
            const pos = tracker.positions[index];
            this._tileStyler.setStyle(tile, pos.row, pos.col);
        });
        this._setListStyle(this._tileStyler.getComputedHeight());
    }
    /** Sets style on the main grid-list element, given the style name and value. */
    _setListStyle(style) {
        if (style) {
            this._element.nativeElement.style[style[0]] = style[1];
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatGridList, deps: [{ token: i0.ElementRef }, { token: i1.Directionality, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0", type: MatGridList, selector: "mat-grid-list", inputs: { cols: "cols", gutterSize: "gutterSize", rowHeight: "rowHeight" }, host: { properties: { "attr.cols": "cols" }, classAttribute: "mat-grid-list" }, providers: [
            {
                provide: MAT_GRID_LIST,
                useExisting: MatGridList,
            },
        ], queries: [{ propertyName: "_tiles", predicate: MatGridTile, descendants: true }], exportAs: ["matGridList"], ngImport: i0, template: "<div>\n  <ng-content></ng-content>\n</div>", styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatGridList };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatGridList, decorators: [{
            type: Component,
            args: [{ selector: 'mat-grid-list', exportAs: 'matGridList', host: {
                        'class': 'mat-grid-list',
                        // Ensures that the "cols" input value is reflected in the DOM. This is
                        // needed for the grid-list harness.
                        '[attr.cols]': 'cols',
                    }, providers: [
                        {
                            provide: MAT_GRID_LIST,
                            useExisting: MatGridList,
                        },
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div>\n  <ng-content></ng-content>\n</div>", styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }]; }, propDecorators: { _tiles: [{
                type: ContentChildren,
                args: [MatGridTile, { descendants: true }]
            }], cols: [{
                type: Input
            }], gutterSize: [{
                type: Input
            }], rowHeight: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLWxpc3QudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L2dyaWQtbGlzdC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsaUJBQWlCLEVBR2pCLEtBQUssRUFDTCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixRQUFRLEVBQ1IsdUJBQXVCLEdBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFFTCxhQUFhLEVBQ2IsZUFBZSxFQUNmLGVBQWUsR0FFaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxvQkFBb0IsRUFBYyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxhQUFhLEVBQWtCLE1BQU0sa0JBQWtCLENBQUM7OztBQUVoRSxnRUFBZ0U7QUFDaEUscUVBQXFFO0FBQ3JFLGlEQUFpRDtBQUVqRCxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUM7QUFFM0IsTUFvQmEsV0FBVztJQXdCdEIsWUFDVSxRQUFpQyxFQUNyQixJQUFvQjtRQURoQyxhQUFRLEdBQVIsUUFBUSxDQUF5QjtRQUNyQixTQUFJLEdBQUosSUFBSSxDQUFnQjtRQVgxQyxxRkFBcUY7UUFDN0UsWUFBTyxHQUFXLEtBQUssQ0FBQztJQVc3QixDQUFDO0lBRUosMENBQTBDO0lBQzFDLElBQ0ksSUFBSTtRQUNOLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFD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VztrQkFwQnZCLFNBQVM7K0JBQ0UsZUFBZSxZQUNmLGFBQWEsUUFHakI7d0JBQ0osT0FBTyxFQUFFLGVBQWU7d0JBQ3hCLHVFQUF1RTt3QkFDdkUsb0NBQW9DO3dCQUNwQyxhQUFhLEVBQUUsTUFBTTtxQkFDdEIsYUFDVTt3QkFDVDs0QkFDRSxPQUFPLEVBQUUsYUFBYTs0QkFDdEIsV0FBVyxhQUFhO3lCQUN6QjtxQkFDRixtQkFDZ0IsdUJBQXVCLENBQUMsTUFBTSxpQkFDaEMsaUJBQWlCLENBQUMsSUFBSTs7MEJBNEJsQyxRQUFROzRDQUp3QyxNQUFNO3NCQUF4RCxlQUFlO3VCQUFDLFdBQVcsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7Z0JBUzdDLElBQUk7c0JBRFAsS0FBSztnQkFVRixVQUFVO3NCQURiLEtBQUs7Z0JBVUYsU0FBUztzQkFEWixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgUXVlcnlMaXN0LFxuICBFbGVtZW50UmVmLFxuICBPcHRpb25hbCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRHcmlkVGlsZX0gZnJvbSAnLi9ncmlkLXRpbGUnO1xuaW1wb3J0IHtUaWxlQ29vcmRpbmF0b3J9IGZyb20gJy4vdGlsZS1jb29yZGluYXRvcic7XG5pbXBvcnQge1xuICBUaWxlU3R5bGVyLFxuICBGaXRUaWxlU3R5bGVyLFxuICBSYXRpb1RpbGVTdHlsZXIsXG4gIEZpeGVkVGlsZVN0eWxlcixcbiAgVGlsZVN0eWxlVGFyZ2V0LFxufSBmcm9tICcuL3RpbGUtc3R5bGVyJztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHksIE51bWJlcklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtNQVRfR1JJRF9MSVNULCBNYXRHcmlkTGlzdEJhc2V9IGZyb20gJy4vZ3JpZC1saXN0LWJhc2UnO1xuXG4vLyBUT0RPKGthcmEpOiBDb25kaXRpb25hbCAocmVzcG9uc2l2ZSkgY29sdW1uIGNvdW50IC8gcm93IHNpemUuXG4vLyBUT0RPKGthcmEpOiBSZS1sYXlvdXQgb24gd2luZG93IHJlc2l6ZSAvIG1lZGlhIGNoYW5nZSAoZGVib3VuY2VkKS5cbi8vIFRPRE8oa2FyYSk6IGdyaWRUaWxlSGVhZGVyIGFuZCBncmlkVGlsZUZvb3Rlci5cblxuY29uc3QgTUFUX0ZJVF9NT0RFID0gJ2ZpdCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLWxpc3QnLFxuICBleHBvcnRBczogJ21hdEdyaWRMaXN0JyxcbiAgdGVtcGxhdGVVcmw6ICdncmlkLWxpc3QuaHRtbCcsXG4gIHN0eWxlVXJsczogWydncmlkLWxpc3QuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWdyaWQtbGlzdCcsXG4gICAgLy8gRW5zdXJlcyB0aGF0IHRoZSBcImNvbHNcIiBpbnB1dCB2YWx1ZSBpcyByZWZsZWN0ZWQgaW4gdGhlIERPTS4gVGhpcyBpc1xuICAgIC8vIG5lZWRlZCBmb3IgdGhlIGdyaWQtbGlzdCBoYXJuZXNzLlxuICAgICdbYXR0ci5jb2xzXSc6ICdjb2xzJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge1xuICAgICAgcHJvdmlkZTogTUFUX0dSSURfTElTVCxcbiAgICAgIHVzZUV4aXN0aW5nOiBNYXRHcmlkTGlzdCxcbiAgICB9LFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZExpc3QgaW1wbGVtZW50cyBNYXRHcmlkTGlzdEJhc2UsIE9uSW5pdCwgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgVGlsZVN0eWxlVGFyZ2V0IHtcbiAgLyoqIE51bWJlciBvZiBjb2x1bW5zIGJlaW5nIHJlbmRlcmVkLiAqL1xuICBwcml2YXRlIF9jb2xzOiBudW1iZXI7XG5cbiAgLyoqIFVzZWQgZm9yIGRldGVybWluaW5nIHRoZSBwb3NpdGlvbiBvZiBlYWNoIHRpbGUgaW4gdGhlIGdyaWQuICovXG4gIHByaXZhdGUgX3RpbGVDb29yZGluYXRvcjogVGlsZUNvb3JkaW5hdG9yO1xuXG4gIC8qKlxuICAgKiBSb3cgaGVpZ2h0IHZhbHVlIHBhc3NlZCBpbiBieSB1c2VyLiBUaGlzIGNhbiBiZSBvbmUgb2YgdGhyZWUgdHlwZXM6XG4gICAqIC0gTnVtYmVyIHZhbHVlIChleDogXCIxMDBweFwiKTogIHNldHMgYSBmaXhlZCByb3cgaGVpZ2h0IHRvIHRoYXQgdmFsdWVcbiAgICogLSBSYXRpbyB2YWx1ZSAoZXg6IFwiNDozXCIpOiBzZXRzIHRoZSByb3cgaGVpZ2h0IGJhc2VkIG9uIHdpZHRoOmhlaWdodCByYXRpb1xuICAgKiAtIFwiRml0XCIgbW9kZSAoZXg6IFwiZml0XCIpOiBzZXRzIHRoZSByb3cgaGVpZ2h0IHRvIHRvdGFsIGhlaWdodCBkaXZpZGVkIGJ5IG51bWJlciBvZiByb3dzXG4gICAqL1xuICBwcml2YXRlIF9yb3dIZWlnaHQ6IHN0cmluZztcblxuICAvKiogVGhlIGFtb3VudCBvZiBzcGFjZSBiZXR3ZWVuIHRpbGVzLiBUaGlzIHdpbGwgYmUgc29tZXRoaW5nIGxpa2UgJzVweCcgb3IgJzJlbScuICovXG4gIHByaXZhdGUgX2d1dHRlcjogc3RyaW5nID0gJzFweCc7XG5cbiAgLyoqIFNldHMgcG9zaXRpb24gYW5kIHNpemUgc3R5bGVzIGZvciBhIHRpbGUgKi9cbiAgcHJpdmF0ZSBfdGlsZVN0eWxlcjogVGlsZVN0eWxlcjtcblxuICAvKiogUXVlcnkgbGlzdCBvZiB0aWxlcyB0aGF0IGFyZSBiZWluZyByZW5kZXJlZC4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRHcmlkVGlsZSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3RpbGVzOiBRdWVyeUxpc3Q8TWF0R3JpZFRpbGU+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICkge31cblxuICAvKiogQW1vdW50IG9mIGNvbHVtbnMgaW4gdGhlIGdyaWQgbGlzdC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGNvbHMoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fY29scztcbiAgfVxuICBzZXQgY29scyh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9jb2xzID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSkpKTtcbiAgfVxuXG4gIC8qKiBTaXplIG9mIHRoZSBncmlkIGxpc3QncyBndXR0ZXIgaW4gcGl4ZWxzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZ3V0dGVyU2l6ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9ndXR0ZXI7XG4gIH1cbiAgc2V0IGd1dHRlclNpemUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMuX2d1dHRlciA9IGAke3ZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlfWA7XG4gIH1cblxuICAvKiogU2V0IGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIHJvdyBoZWlnaHQgZnJvbSB0aGUgdXNlci1wcm92aWRlZCB2YWx1ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJvd0hlaWdodCgpOiBzdHJpbmcgfCBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9yb3dIZWlnaHQ7XG4gIH1cbiAgc2V0IHJvd0hlaWdodCh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBgJHt2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZX1gO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9yb3dIZWlnaHQpIHtcbiAgICAgIHRoaXMuX3Jvd0hlaWdodCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fc2V0VGlsZVN0eWxlcih0aGlzLl9yb3dIZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2NoZWNrQ29scygpO1xuICAgIHRoaXMuX2NoZWNrUm93SGVpZ2h0KCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGxheW91dCBjYWxjdWxhdGlvbiBpcyBmYWlybHkgY2hlYXAgaWYgbm90aGluZyBjaGFuZ2VzLCBzbyB0aGVyZSdzIGxpdHRsZSBjb3N0XG4gICAqIHRvIHJ1biBpdCBmcmVxdWVudGx5LlxuICAgKi9cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIHRoaXMuX2xheW91dFRpbGVzKCk7XG4gIH1cblxuICAvKiogVGhyb3cgYSBmcmllbmRseSBlcnJvciBpZiBjb2xzIHByb3BlcnR5IGlzIG1pc3NpbmcgKi9cbiAgcHJpdmF0ZSBfY2hlY2tDb2xzKCkge1xuICAgIGlmICghdGhpcy5jb2xzICYmICh0eXBlb2YgbmdEZXZNb2RlID09PSAndW5kZWZpbmVkJyB8fCBuZ0Rldk1vZGUpKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgYG1hdC1ncmlkLWxpc3Q6IG11c3QgcGFzcyBpbiBudW1iZXIgb2YgY29sdW1ucy4gYCArIGBFeGFtcGxlOiA8bWF0LWdyaWQtbGlzdCBjb2xzPVwiM1wiPmAsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZWZhdWx0IHRvIGVxdWFsIHdpZHRoOmhlaWdodCBpZiByb3dIZWlnaHQgcHJvcGVydHkgaXMgbWlzc2luZyAqL1xuICBwcml2YXRlIF9jaGVja1Jvd0hlaWdodCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3Jvd0hlaWdodCkge1xuICAgICAgdGhpcy5fc2V0VGlsZVN0eWxlcignMToxJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENyZWF0ZXMgY29ycmVjdCBUaWxlIFN0eWxlciBzdWJ0eXBlIGJhc2VkIG9uIHJvd0hlaWdodCBwYXNzZWQgaW4gYnkgdXNlciAqL1xuICBwcml2YXRlIF9zZXRUaWxlU3R5bGVyKHJvd0hlaWdodDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3RpbGVTdHlsZXIpIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIucmVzZXQodGhpcyk7XG4gICAgfVxuXG4gICAgaWYgKHJvd0hlaWdodCA9PT0gTUFUX0ZJVF9NT0RFKSB7XG4gICAgICB0aGlzLl90aWxlU3R5bGVyID0gbmV3IEZpdFRpbGVTdHlsZXIoKTtcbiAgICB9IGVsc2UgaWYgKHJvd0hlaWdodCAmJiByb3dIZWlnaHQuaW5kZXhPZignOicpID4gLTEpIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIgPSBuZXcgUmF0aW9UaWxlU3R5bGVyKHJvd0hlaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIgPSBuZXcgRml4ZWRUaWxlU3R5bGVyKHJvd0hlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENvbXB1dGVzIGFuZCBhcHBsaWVzIHRoZSBzaXplIGFuZCBwb3NpdGlvbiBmb3IgYWxsIGNoaWxkcmVuIGdyaWQgdGlsZXMuICovXG4gIHByaXZhdGUgX2xheW91dFRpbGVzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fdGlsZUNvb3JkaW5hdG9yKSB7XG4gICAgICB0aGlzLl90aWxlQ29vcmRpbmF0b3IgPSBuZXcgVGlsZUNvb3JkaW5hdG9yKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdHJhY2tlciA9IHRoaXMuX3RpbGVDb29yZGluYXRvcjtcbiAgICBjb25zdCB0aWxlcyA9IHRoaXMuX3RpbGVzLmZpbHRlcih0aWxlID0+ICF0aWxlLl9ncmlkTGlzdCB8fCB0aWxlLl9ncmlkTGlzdCA9PT0gdGhpcyk7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5fZGlyID8gdGhpcy5fZGlyLnZhbHVlIDogJ2x0cic7XG5cbiAgICB0aGlzLl90aWxlQ29vcmRpbmF0b3IudXBkYXRlKHRoaXMuY29scywgdGlsZXMpO1xuICAgIHRoaXMuX3RpbGVTdHlsZXIuaW5pdCh0aGlzLmd1dHRlclNpemUsIHRyYWNrZXIsIHRoaXMuY29scywgZGlyZWN0aW9uKTtcblxuICAgIHRpbGVzLmZvckVhY2goKHRpbGUsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBwb3MgPSB0cmFja2VyLnBvc2l0aW9uc1tpbmRleF07XG4gICAgICB0aGlzLl90aWxlU3R5bGVyLnNldFN0eWxlKHRpbGUsIHBvcy5yb3csIHBvcy5jb2wpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc2V0TGlzdFN0eWxlKHRoaXMuX3RpbGVTdHlsZXIuZ2V0Q29tcHV0ZWRIZWlnaHQoKSk7XG4gIH1cblxuICAvKiogU2V0cyBzdHlsZSBvbiB0aGUgbWFpbiBncmlkLWxpc3QgZWxlbWVudCwgZ2l2ZW4gdGhlIHN0eWxlIG5hbWUgYW5kIHZhbHVlLiAqL1xuICBfc2V0TGlzdFN0eWxlKHN0eWxlOiBbc3RyaW5nLCBzdHJpbmcgfCBudWxsXSB8IG51bGwpOiB2b2lkIHtcbiAgICBpZiAoc3R5bGUpIHtcbiAgICAgICh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUgYXMgYW55KVtzdHlsZVswXV0gPSBzdHlsZVsxXTtcbiAgICB9XG4gIH1cbn1cbiIsIjxkaXY+XG4gIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbjwvZGl2PiJdfQ==
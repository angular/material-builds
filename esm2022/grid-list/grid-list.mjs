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
export class MatGridList {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatGridList, deps: [{ token: i0.ElementRef }, { token: i1.Directionality, optional: true }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatGridList, selector: "mat-grid-list", inputs: { cols: "cols", gutterSize: "gutterSize", rowHeight: "rowHeight" }, host: { properties: { "attr.cols": "cols" }, classAttribute: "mat-grid-list" }, providers: [
            {
                provide: MAT_GRID_LIST,
                useExisting: MatGridList,
            },
        ], queries: [{ propertyName: "_tiles", predicate: MatGridTile, descendants: true }], exportAs: ["matGridList"], ngImport: i0, template: "<div>\n  <ng-content></ng-content>\n</div>", styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-header{font-size:var(--mat-grid-list-tile-header-primary-text-size)}.mat-grid-tile-header .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-grid-tile-header .mat-line:nth-child(n+2){font-size:var(--mat-grid-list-tile-header-secondary-text-size)}.mat-grid-tile-footer{font-size:var(--mat-grid-list-tile-footer-primary-text-size)}.mat-grid-tile-footer .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-grid-tile-footer .mat-line:nth-child(n+2){font-size:var(--mat-grid-list-tile-footer-secondary-text-size)}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}"], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatGridList, decorators: [{
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
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div>\n  <ng-content></ng-content>\n</div>", styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}.mat-grid-tile-header{font-size:var(--mat-grid-list-tile-header-primary-text-size)}.mat-grid-tile-header .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-grid-tile-header .mat-line:nth-child(n+2){font-size:var(--mat-grid-list-tile-header-secondary-text-size)}.mat-grid-tile-footer{font-size:var(--mat-grid-list-tile-footer-primary-text-size)}.mat-grid-tile-footer .mat-line{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;box-sizing:border-box}.mat-grid-tile-footer .mat-line:nth-child(n+2){font-size:var(--mat-grid-list-tile-footer-secondary-text-size)}.mat-grid-tile-content{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}"] }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLWxpc3QudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZ3JpZC1saXN0L2dyaWQtbGlzdC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsaUJBQWlCLEVBR2pCLEtBQUssRUFDTCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixRQUFRLEVBQ1IsdUJBQXVCLEdBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFFTCxhQUFhLEVBQ2IsZUFBZSxFQUNmLGVBQWUsR0FFaEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxvQkFBb0IsRUFBYyxNQUFNLHVCQUF1QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxhQUFhLEVBQWtCLE1BQU0sa0JBQWtCLENBQUM7OztBQUVoRSxnRUFBZ0U7QUFDaEUscUVBQXFFO0FBQ3JFLGlEQUFpRDtBQUVqRCxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUM7QUFzQjNCLE1BQU0sT0FBTyxXQUFXO0lBd0J0QixZQUNVLFFBQWlDLEVBQ3JCLElBQW9CO1FBRGhDLGFBQVEsR0FBUixRQUFRLENBQXlCO1FBQ3JCLFNBQUksR0FBSixJQUFJLENBQWdCO1FBWDFDLHFGQUFxRjtRQUM3RSxZQUFPLEdBQVcsS0FBSyxDQUFDO0lBVzdCLENBQUM7SUFFSiwwQ0FBMEM7SUFDMUMsSUFDSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BC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cEJ2QixTQUFTOytCQUNFLGVBQWUsWUFDZixhQUFhLFFBR2pCO3dCQUNKLE9BQU8sRUFBRSxlQUFlO3dCQUN4Qix1RUFBdUU7d0JBQ3ZFLG9DQUFvQzt3QkFDcEMsYUFBYSxFQUFFLE1BQU07cUJBQ3RCLGFBQ1U7d0JBQ1Q7NEJBQ0UsT0FBTyxFQUFFLGFBQWE7NEJBQ3RCLFdBQVcsYUFBYTt5QkFDekI7cUJBQ0YsbUJBQ2dCLHVCQUF1QixDQUFDLE1BQU0saUJBQ2hDLGlCQUFpQixDQUFDLElBQUk7OzBCQTRCbEMsUUFBUTs0Q0FKd0MsTUFBTTtzQkFBeEQsZUFBZTt1QkFBQyxXQUFXLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQVM3QyxJQUFJO3NCQURQLEtBQUs7Z0JBVUYsVUFBVTtzQkFEYixLQUFLO2dCQVVGLFNBQVM7c0JBRFosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBPbkluaXQsXG4gIElucHV0LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIFF1ZXJ5TGlzdCxcbiAgRWxlbWVudFJlZixcbiAgT3B0aW9uYWwsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0R3JpZFRpbGV9IGZyb20gJy4vZ3JpZC10aWxlJztcbmltcG9ydCB7VGlsZUNvb3JkaW5hdG9yfSBmcm9tICcuL3RpbGUtY29vcmRpbmF0b3InO1xuaW1wb3J0IHtcbiAgVGlsZVN0eWxlcixcbiAgRml0VGlsZVN0eWxlcixcbiAgUmF0aW9UaWxlU3R5bGVyLFxuICBGaXhlZFRpbGVTdHlsZXIsXG4gIFRpbGVTdHlsZVRhcmdldCxcbn0gZnJvbSAnLi90aWxlLXN0eWxlcic7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7TUFUX0dSSURfTElTVCwgTWF0R3JpZExpc3RCYXNlfSBmcm9tICcuL2dyaWQtbGlzdC1iYXNlJztcblxuLy8gVE9ETyhrYXJhKTogQ29uZGl0aW9uYWwgKHJlc3BvbnNpdmUpIGNvbHVtbiBjb3VudCAvIHJvdyBzaXplLlxuLy8gVE9ETyhrYXJhKTogUmUtbGF5b3V0IG9uIHdpbmRvdyByZXNpemUgLyBtZWRpYSBjaGFuZ2UgKGRlYm91bmNlZCkuXG4vLyBUT0RPKGthcmEpOiBncmlkVGlsZUhlYWRlciBhbmQgZ3JpZFRpbGVGb290ZXIuXG5cbmNvbnN0IE1BVF9GSVRfTU9ERSA9ICdmaXQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZ3JpZC1saXN0JyxcbiAgZXhwb3J0QXM6ICdtYXRHcmlkTGlzdCcsXG4gIHRlbXBsYXRlVXJsOiAnZ3JpZC1saXN0Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZ3JpZC1saXN0LmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1ncmlkLWxpc3QnLFxuICAgIC8vIEVuc3VyZXMgdGhhdCB0aGUgXCJjb2xzXCIgaW5wdXQgdmFsdWUgaXMgcmVmbGVjdGVkIGluIHRoZSBET00uIFRoaXMgaXNcbiAgICAvLyBuZWVkZWQgZm9yIHRoZSBncmlkLWxpc3QgaGFybmVzcy5cbiAgICAnW2F0dHIuY29sc10nOiAnY29scycsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE1BVF9HUklEX0xJU1QsXG4gICAgICB1c2VFeGlzdGluZzogTWF0R3JpZExpc3QsXG4gICAgfSxcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRMaXN0IGltcGxlbWVudHMgTWF0R3JpZExpc3RCYXNlLCBPbkluaXQsIEFmdGVyQ29udGVudENoZWNrZWQsIFRpbGVTdHlsZVRhcmdldCB7XG4gIC8qKiBOdW1iZXIgb2YgY29sdW1ucyBiZWluZyByZW5kZXJlZC4gKi9cbiAgcHJpdmF0ZSBfY29sczogbnVtYmVyO1xuXG4gIC8qKiBVc2VkIGZvciBkZXRlcm1pbmluZyB0aGUgcG9zaXRpb24gb2YgZWFjaCB0aWxlIGluIHRoZSBncmlkLiAqL1xuICBwcml2YXRlIF90aWxlQ29vcmRpbmF0b3I6IFRpbGVDb29yZGluYXRvcjtcblxuICAvKipcbiAgICogUm93IGhlaWdodCB2YWx1ZSBwYXNzZWQgaW4gYnkgdXNlci4gVGhpcyBjYW4gYmUgb25lIG9mIHRocmVlIHR5cGVzOlxuICAgKiAtIE51bWJlciB2YWx1ZSAoZXg6IFwiMTAwcHhcIik6ICBzZXRzIGEgZml4ZWQgcm93IGhlaWdodCB0byB0aGF0IHZhbHVlXG4gICAqIC0gUmF0aW8gdmFsdWUgKGV4OiBcIjQ6M1wiKTogc2V0cyB0aGUgcm93IGhlaWdodCBiYXNlZCBvbiB3aWR0aDpoZWlnaHQgcmF0aW9cbiAgICogLSBcIkZpdFwiIG1vZGUgKGV4OiBcImZpdFwiKTogc2V0cyB0aGUgcm93IGhlaWdodCB0byB0b3RhbCBoZWlnaHQgZGl2aWRlZCBieSBudW1iZXIgb2Ygcm93c1xuICAgKi9cbiAgcHJpdmF0ZSBfcm93SGVpZ2h0OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBhbW91bnQgb2Ygc3BhY2UgYmV0d2VlbiB0aWxlcy4gVGhpcyB3aWxsIGJlIHNvbWV0aGluZyBsaWtlICc1cHgnIG9yICcyZW0nLiAqL1xuICBwcml2YXRlIF9ndXR0ZXI6IHN0cmluZyA9ICcxcHgnO1xuXG4gIC8qKiBTZXRzIHBvc2l0aW9uIGFuZCBzaXplIHN0eWxlcyBmb3IgYSB0aWxlICovXG4gIHByaXZhdGUgX3RpbGVTdHlsZXI6IFRpbGVTdHlsZXI7XG5cbiAgLyoqIFF1ZXJ5IGxpc3Qgb2YgdGlsZXMgdGhhdCBhcmUgYmVpbmcgcmVuZGVyZWQuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0R3JpZFRpbGUsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF90aWxlczogUXVlcnlMaXN0PE1hdEdyaWRUaWxlPjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICApIHt9XG5cbiAgLyoqIEFtb3VudCBvZiBjb2x1bW5zIGluIHRoZSBncmlkIGxpc3QuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xzKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbHM7XG4gIH1cbiAgc2V0IGNvbHModmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fY29scyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpKSk7XG4gIH1cblxuICAvKiogU2l6ZSBvZiB0aGUgZ3JpZCBsaXN0J3MgZ3V0dGVyIGluIHBpeGVscy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGd1dHRlclNpemUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZ3V0dGVyO1xuICB9XG4gIHNldCBndXR0ZXJTaXplKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLl9ndXR0ZXIgPSBgJHt2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZX1gO1xuICB9XG5cbiAgLyoqIFNldCBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiBvZiByb3cgaGVpZ2h0IGZyb20gdGhlIHVzZXItcHJvdmlkZWQgdmFsdWUuICovXG4gIEBJbnB1dCgpXG4gIGdldCByb3dIZWlnaHQoKTogc3RyaW5nIHwgbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcm93SGVpZ2h0O1xuICB9XG4gIHNldCByb3dIZWlnaHQodmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gYCR7dmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWV9YDtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fcm93SGVpZ2h0KSB7XG4gICAgICB0aGlzLl9yb3dIZWlnaHQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuX3NldFRpbGVTdHlsZXIodGhpcy5fcm93SGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9jaGVja0NvbHMoKTtcbiAgICB0aGlzLl9jaGVja1Jvd0hlaWdodCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsYXlvdXQgY2FsY3VsYXRpb24gaXMgZmFpcmx5IGNoZWFwIGlmIG5vdGhpbmcgY2hhbmdlcywgc28gdGhlcmUncyBsaXR0bGUgY29zdFxuICAgKiB0byBydW4gaXQgZnJlcXVlbnRseS5cbiAgICovXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICB0aGlzLl9sYXlvdXRUaWxlcygpO1xuICB9XG5cbiAgLyoqIFRocm93IGEgZnJpZW5kbHkgZXJyb3IgaWYgY29scyBwcm9wZXJ0eSBpcyBtaXNzaW5nICovXG4gIHByaXZhdGUgX2NoZWNrQ29scygpIHtcbiAgICBpZiAoIXRoaXMuY29scyAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgIGBtYXQtZ3JpZC1saXN0OiBtdXN0IHBhc3MgaW4gbnVtYmVyIG9mIGNvbHVtbnMuIGAgKyBgRXhhbXBsZTogPG1hdC1ncmlkLWxpc3QgY29scz1cIjNcIj5gLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGVmYXVsdCB0byBlcXVhbCB3aWR0aDpoZWlnaHQgaWYgcm93SGVpZ2h0IHByb3BlcnR5IGlzIG1pc3NpbmcgKi9cbiAgcHJpdmF0ZSBfY2hlY2tSb3dIZWlnaHQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9yb3dIZWlnaHQpIHtcbiAgICAgIHRoaXMuX3NldFRpbGVTdHlsZXIoJzE6MScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGNvcnJlY3QgVGlsZSBTdHlsZXIgc3VidHlwZSBiYXNlZCBvbiByb3dIZWlnaHQgcGFzc2VkIGluIGJ5IHVzZXIgKi9cbiAgcHJpdmF0ZSBfc2V0VGlsZVN0eWxlcihyb3dIZWlnaHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLl90aWxlU3R5bGVyKSB7XG4gICAgICB0aGlzLl90aWxlU3R5bGVyLnJlc2V0KHRoaXMpO1xuICAgIH1cblxuICAgIGlmIChyb3dIZWlnaHQgPT09IE1BVF9GSVRfTU9ERSkge1xuICAgICAgdGhpcy5fdGlsZVN0eWxlciA9IG5ldyBGaXRUaWxlU3R5bGVyKCk7XG4gICAgfSBlbHNlIGlmIChyb3dIZWlnaHQgJiYgcm93SGVpZ2h0LmluZGV4T2YoJzonKSA+IC0xKSB7XG4gICAgICB0aGlzLl90aWxlU3R5bGVyID0gbmV3IFJhdGlvVGlsZVN0eWxlcihyb3dIZWlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aWxlU3R5bGVyID0gbmV3IEZpeGVkVGlsZVN0eWxlcihyb3dIZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDb21wdXRlcyBhbmQgYXBwbGllcyB0aGUgc2l6ZSBhbmQgcG9zaXRpb24gZm9yIGFsbCBjaGlsZHJlbiBncmlkIHRpbGVzLiAqL1xuICBwcml2YXRlIF9sYXlvdXRUaWxlcygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3RpbGVDb29yZGluYXRvcikge1xuICAgICAgdGhpcy5fdGlsZUNvb3JkaW5hdG9yID0gbmV3IFRpbGVDb29yZGluYXRvcigpO1xuICAgIH1cblxuICAgIGNvbnN0IHRyYWNrZXIgPSB0aGlzLl90aWxlQ29vcmRpbmF0b3I7XG4gICAgY29uc3QgdGlsZXMgPSB0aGlzLl90aWxlcy5maWx0ZXIodGlsZSA9PiAhdGlsZS5fZ3JpZExpc3QgfHwgdGlsZS5fZ3JpZExpc3QgPT09IHRoaXMpO1xuICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMuX2RpciA/IHRoaXMuX2Rpci52YWx1ZSA6ICdsdHInO1xuXG4gICAgdGhpcy5fdGlsZUNvb3JkaW5hdG9yLnVwZGF0ZSh0aGlzLmNvbHMsIHRpbGVzKTtcbiAgICB0aGlzLl90aWxlU3R5bGVyLmluaXQodGhpcy5ndXR0ZXJTaXplLCB0cmFja2VyLCB0aGlzLmNvbHMsIGRpcmVjdGlvbik7XG5cbiAgICB0aWxlcy5mb3JFYWNoKCh0aWxlLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgcG9zID0gdHJhY2tlci5wb3NpdGlvbnNbaW5kZXhdO1xuICAgICAgdGhpcy5fdGlsZVN0eWxlci5zZXRTdHlsZSh0aWxlLCBwb3Mucm93LCBwb3MuY29sKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3NldExpc3RTdHlsZSh0aGlzLl90aWxlU3R5bGVyLmdldENvbXB1dGVkSGVpZ2h0KCkpO1xuICB9XG5cbiAgLyoqIFNldHMgc3R5bGUgb24gdGhlIG1haW4gZ3JpZC1saXN0IGVsZW1lbnQsIGdpdmVuIHRoZSBzdHlsZSBuYW1lIGFuZCB2YWx1ZS4gKi9cbiAgX3NldExpc3RTdHlsZShzdHlsZTogW3N0cmluZywgc3RyaW5nIHwgbnVsbF0gfCBudWxsKTogdm9pZCB7XG4gICAgaWYgKHN0eWxlKSB7XG4gICAgICAodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlIGFzIGFueSlbc3R5bGVbMF1dID0gc3R5bGVbMV07XG4gICAgfVxuICB9XG59XG4iLCI8ZGl2PlxuICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48L2Rpdj4iXX0=
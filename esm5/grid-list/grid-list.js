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
import { FitTileStyler, RatioTileStyler, FixedTileStyler } from './tile-styler';
import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { MAT_GRID_LIST } from './grid-list-base';
// TODO(kara): Conditional (responsive) column count / row size.
// TODO(kara): Re-layout on window resize / media change (debounced).
// TODO(kara): gridTileHeader and gridTileFooter.
var MAT_FIT_MODE = 'fit';
var MatGridList = /** @class */ (function () {
    function MatGridList(_element, _dir) {
        this._element = _element;
        this._dir = _dir;
        /** The amount of space between tiles. This will be something like '5px' or '2em'. */
        this._gutter = '1px';
    }
    Object.defineProperty(MatGridList.prototype, "cols", {
        /** Amount of columns in the grid list. */
        get: function () { return this._cols; },
        set: function (value) {
            this._cols = Math.max(1, Math.round(coerceNumberProperty(value)));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatGridList.prototype, "gutterSize", {
        /** Size of the grid list's gutter in pixels. */
        get: function () { return this._gutter; },
        set: function (value) { this._gutter = "" + (value == null ? '' : value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatGridList.prototype, "rowHeight", {
        /** Set internal representation of row height from the user-provided value. */
        get: function () { return this._rowHeight; },
        set: function (value) {
            var newValue = "" + (value == null ? '' : value);
            if (newValue !== this._rowHeight) {
                this._rowHeight = newValue;
                this._setTileStyler(this._rowHeight);
            }
        },
        enumerable: true,
        configurable: true
    });
    MatGridList.prototype.ngOnInit = function () {
        this._checkCols();
        this._checkRowHeight();
    };
    /**
     * The layout calculation is fairly cheap if nothing changes, so there's little cost
     * to run it frequently.
     */
    MatGridList.prototype.ngAfterContentChecked = function () {
        this._layoutTiles();
    };
    /** Throw a friendly error if cols property is missing */
    MatGridList.prototype._checkCols = function () {
        if (!this.cols) {
            throw Error("mat-grid-list: must pass in number of columns. " +
                "Example: <mat-grid-list cols=\"3\">");
        }
    };
    /** Default to equal width:height if rowHeight property is missing */
    MatGridList.prototype._checkRowHeight = function () {
        if (!this._rowHeight) {
            this._setTileStyler('1:1');
        }
    };
    /** Creates correct Tile Styler subtype based on rowHeight passed in by user */
    MatGridList.prototype._setTileStyler = function (rowHeight) {
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
    };
    /** Computes and applies the size and position for all children grid tiles. */
    MatGridList.prototype._layoutTiles = function () {
        var _this = this;
        if (!this._tileCoordinator) {
            this._tileCoordinator = new TileCoordinator();
        }
        var tracker = this._tileCoordinator;
        var tiles = this._tiles.filter(function (tile) { return !tile._gridList || tile._gridList === _this; });
        var direction = this._dir ? this._dir.value : 'ltr';
        this._tileCoordinator.update(this.cols, tiles);
        this._tileStyler.init(this.gutterSize, tracker, this.cols, direction);
        tiles.forEach(function (tile, index) {
            var pos = tracker.positions[index];
            _this._tileStyler.setStyle(tile, pos.row, pos.col);
        });
        this._setListStyle(this._tileStyler.getComputedHeight());
    };
    /** Sets style on the main grid-list element, given the style name and value. */
    MatGridList.prototype._setListStyle = function (style) {
        if (style) {
            this._element.nativeElement.style[style[0]] = style[1];
        }
    };
    MatGridList.decorators = [
        { type: Component, args: [{
                    selector: 'mat-grid-list',
                    exportAs: 'matGridList',
                    template: "<div>\n  <ng-content></ng-content>\n</div>",
                    host: {
                        'class': 'mat-grid-list',
                    },
                    providers: [{
                            provide: MAT_GRID_LIST,
                            useExisting: MatGridList
                        }],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-figure{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}\n"]
                }] }
    ];
    /** @nocollapse */
    MatGridList.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Directionality, decorators: [{ type: Optional }] }
    ]; };
    MatGridList.propDecorators = {
        _tiles: [{ type: ContentChildren, args: [MatGridTile, { descendants: true },] }],
        cols: [{ type: Input }],
        gutterSize: [{ type: Input }],
        rowHeight: [{ type: Input }]
    };
    return MatGridList;
}());
export { MatGridList };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLWxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFHakIsS0FBSyxFQUNMLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFFBQVEsRUFDUix1QkFBdUIsR0FDeEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxFQUFhLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFGLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsb0JBQW9CLEVBQWMsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RSxPQUFPLEVBQUMsYUFBYSxFQUFrQixNQUFNLGtCQUFrQixDQUFDO0FBR2hFLGdFQUFnRTtBQUNoRSxxRUFBcUU7QUFDckUsaURBQWlEO0FBRWpELElBQU0sWUFBWSxHQUFHLEtBQUssQ0FBQztBQUUzQjtJQXVDRSxxQkFBb0IsUUFBaUMsRUFDckIsSUFBb0I7UUFEaEMsYUFBUSxHQUFSLFFBQVEsQ0FBeUI7UUFDckIsU0FBSSxHQUFKLElBQUksQ0FBZ0I7UUFWcEQscUZBQXFGO1FBQzdFLFlBQU8sR0FBVyxLQUFLLENBQUM7SUFTdUIsQ0FBQztJQUd4RCxzQkFDSSw2QkFBSTtRQUZSLDBDQUEwQzthQUMxQyxjQUNxQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ3pDLFVBQVMsS0FBYTtZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FB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YTs0QkFDdEIsV0FBVyxFQUFFLFdBQVc7eUJBQ3pCLENBQUM7b0JBQ0YsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOztpQkFDdEM7Ozs7Z0JBaENDLFVBQVU7Z0JBT0osY0FBYyx1QkFtRFAsUUFBUTs7O3lCQUhwQixlQUFlLFNBQUMsV0FBVyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzt1QkFNaEQsS0FBSzs2QkFPTCxLQUFLOzRCQUtMLEtBQUs7O0lBb0ZSLGtCQUFDO0NBQUEsQUEzSUQsSUEySUM7U0E1SFksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBPbkluaXQsXG4gIElucHV0LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIFF1ZXJ5TGlzdCxcbiAgRWxlbWVudFJlZixcbiAgT3B0aW9uYWwsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0R3JpZFRpbGV9IGZyb20gJy4vZ3JpZC10aWxlJztcbmltcG9ydCB7VGlsZUNvb3JkaW5hdG9yfSBmcm9tICcuL3RpbGUtY29vcmRpbmF0b3InO1xuaW1wb3J0IHtUaWxlU3R5bGVyLCBGaXRUaWxlU3R5bGVyLCBSYXRpb1RpbGVTdHlsZXIsIEZpeGVkVGlsZVN0eWxlcn0gZnJvbSAnLi90aWxlLXN0eWxlcic7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7TUFUX0dSSURfTElTVCwgTWF0R3JpZExpc3RCYXNlfSBmcm9tICcuL2dyaWQtbGlzdC1iYXNlJztcblxuXG4vLyBUT0RPKGthcmEpOiBDb25kaXRpb25hbCAocmVzcG9uc2l2ZSkgY29sdW1uIGNvdW50IC8gcm93IHNpemUuXG4vLyBUT0RPKGthcmEpOiBSZS1sYXlvdXQgb24gd2luZG93IHJlc2l6ZSAvIG1lZGlhIGNoYW5nZSAoZGVib3VuY2VkKS5cbi8vIFRPRE8oa2FyYSk6IGdyaWRUaWxlSGVhZGVyIGFuZCBncmlkVGlsZUZvb3Rlci5cblxuY29uc3QgTUFUX0ZJVF9NT0RFID0gJ2ZpdCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1ncmlkLWxpc3QnLFxuICBleHBvcnRBczogJ21hdEdyaWRMaXN0JyxcbiAgdGVtcGxhdGVVcmw6ICdncmlkLWxpc3QuaHRtbCcsXG4gIHN0eWxlVXJsczogWydncmlkLWxpc3QuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWdyaWQtbGlzdCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW3tcbiAgICBwcm92aWRlOiBNQVRfR1JJRF9MSVNULFxuICAgIHVzZUV4aXN0aW5nOiBNYXRHcmlkTGlzdFxuICB9XSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRMaXN0IGltcGxlbWVudHMgTWF0R3JpZExpc3RCYXNlLCBPbkluaXQsIEFmdGVyQ29udGVudENoZWNrZWQge1xuICAvKiogTnVtYmVyIG9mIGNvbHVtbnMgYmVpbmcgcmVuZGVyZWQuICovXG4gIHByaXZhdGUgX2NvbHM6IG51bWJlcjtcblxuICAvKiogVXNlZCBmb3IgZGV0ZXJtaW5pbmd0aGUgcG9zaXRpb24gb2YgZWFjaCB0aWxlIGluIHRoZSBncmlkLiAqL1xuICBwcml2YXRlIF90aWxlQ29vcmRpbmF0b3I6IFRpbGVDb29yZGluYXRvcjtcblxuICAvKipcbiAgICogUm93IGhlaWdodCB2YWx1ZSBwYXNzZWQgaW4gYnkgdXNlci4gVGhpcyBjYW4gYmUgb25lIG9mIHRocmVlIHR5cGVzOlxuICAgKiAtIE51bWJlciB2YWx1ZSAoZXg6IFwiMTAwcHhcIik6ICBzZXRzIGEgZml4ZWQgcm93IGhlaWdodCB0byB0aGF0IHZhbHVlXG4gICAqIC0gUmF0aW8gdmFsdWUgKGV4OiBcIjQ6M1wiKTogc2V0cyB0aGUgcm93IGhlaWdodCBiYXNlZCBvbiB3aWR0aDpoZWlnaHQgcmF0aW9cbiAgICogLSBcIkZpdFwiIG1vZGUgKGV4OiBcImZpdFwiKTogc2V0cyB0aGUgcm93IGhlaWdodCB0byB0b3RhbCBoZWlnaHQgZGl2aWRlZCBieSBudW1iZXIgb2Ygcm93c1xuICAgKi9cbiAgcHJpdmF0ZSBfcm93SGVpZ2h0OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBhbW91bnQgb2Ygc3BhY2UgYmV0d2VlbiB0aWxlcy4gVGhpcyB3aWxsIGJlIHNvbWV0aGluZyBsaWtlICc1cHgnIG9yICcyZW0nLiAqL1xuICBwcml2YXRlIF9ndXR0ZXI6IHN0cmluZyA9ICcxcHgnO1xuXG4gIC8qKiBTZXRzIHBvc2l0aW9uIGFuZCBzaXplIHN0eWxlcyBmb3IgYSB0aWxlICovXG4gIHByaXZhdGUgX3RpbGVTdHlsZXI6IFRpbGVTdHlsZXI7XG5cbiAgLyoqIFF1ZXJ5IGxpc3Qgb2YgdGlsZXMgdGhhdCBhcmUgYmVpbmcgcmVuZGVyZWQuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0R3JpZFRpbGUsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF90aWxlczogUXVlcnlMaXN0PE1hdEdyaWRUaWxlPjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSkge31cblxuICAvKiogQW1vdW50IG9mIGNvbHVtbnMgaW4gdGhlIGdyaWQgbGlzdC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGNvbHMoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2NvbHM7IH1cbiAgc2V0IGNvbHModmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2NvbHMgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKSkpO1xuICB9XG5cbiAgLyoqIFNpemUgb2YgdGhlIGdyaWQgbGlzdCdzIGd1dHRlciBpbiBwaXhlbHMuICovXG4gIEBJbnB1dCgpXG4gIGdldCBndXR0ZXJTaXplKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9ndXR0ZXI7IH1cbiAgc2V0IGd1dHRlclNpemUodmFsdWU6IHN0cmluZykgeyB0aGlzLl9ndXR0ZXIgPSBgJHt2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZX1gOyB9XG5cbiAgLyoqIFNldCBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiBvZiByb3cgaGVpZ2h0IGZyb20gdGhlIHVzZXItcHJvdmlkZWQgdmFsdWUuICovXG4gIEBJbnB1dCgpXG4gIGdldCByb3dIZWlnaHQoKTogc3RyaW5nIHwgbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3Jvd0hlaWdodDsgfVxuICBzZXQgcm93SGVpZ2h0KHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGAke3ZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlfWA7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX3Jvd0hlaWdodCkge1xuICAgICAgdGhpcy5fcm93SGVpZ2h0ID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLl9zZXRUaWxlU3R5bGVyKHRoaXMuX3Jvd0hlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fY2hlY2tDb2xzKCk7XG4gICAgdGhpcy5fY2hlY2tSb3dIZWlnaHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbGF5b3V0IGNhbGN1bGF0aW9uIGlzIGZhaXJseSBjaGVhcCBpZiBub3RoaW5nIGNoYW5nZXMsIHNvIHRoZXJlJ3MgbGl0dGxlIGNvc3RcbiAgICogdG8gcnVuIGl0IGZyZXF1ZW50bHkuXG4gICAqL1xuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgdGhpcy5fbGF5b3V0VGlsZXMoKTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBhIGZyaWVuZGx5IGVycm9yIGlmIGNvbHMgcHJvcGVydHkgaXMgbWlzc2luZyAqL1xuICBwcml2YXRlIF9jaGVja0NvbHMoKSB7XG4gICAgaWYgKCF0aGlzLmNvbHMpIHtcbiAgICAgIHRocm93IEVycm9yKGBtYXQtZ3JpZC1saXN0OiBtdXN0IHBhc3MgaW4gbnVtYmVyIG9mIGNvbHVtbnMuIGAgK1xuICAgICAgICAgICAgICAgICAgYEV4YW1wbGU6IDxtYXQtZ3JpZC1saXN0IGNvbHM9XCIzXCI+YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERlZmF1bHQgdG8gZXF1YWwgd2lkdGg6aGVpZ2h0IGlmIHJvd0hlaWdodCBwcm9wZXJ0eSBpcyBtaXNzaW5nICovXG4gIHByaXZhdGUgX2NoZWNrUm93SGVpZ2h0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fcm93SGVpZ2h0KSB7XG4gICAgICB0aGlzLl9zZXRUaWxlU3R5bGVyKCcxOjEnKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ3JlYXRlcyBjb3JyZWN0IFRpbGUgU3R5bGVyIHN1YnR5cGUgYmFzZWQgb24gcm93SGVpZ2h0IHBhc3NlZCBpbiBieSB1c2VyICovXG4gIHByaXZhdGUgX3NldFRpbGVTdHlsZXIocm93SGVpZ2h0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fdGlsZVN0eWxlcikge1xuICAgICAgdGhpcy5fdGlsZVN0eWxlci5yZXNldCh0aGlzKTtcbiAgICB9XG5cbiAgICBpZiAocm93SGVpZ2h0ID09PSBNQVRfRklUX01PREUpIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIgPSBuZXcgRml0VGlsZVN0eWxlcigpO1xuICAgIH0gZWxzZSBpZiAocm93SGVpZ2h0ICYmIHJvd0hlaWdodC5pbmRleE9mKCc6JykgPiAtMSkge1xuICAgICAgdGhpcy5fdGlsZVN0eWxlciA9IG5ldyBSYXRpb1RpbGVTdHlsZXIocm93SGVpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGlsZVN0eWxlciA9IG5ldyBGaXhlZFRpbGVTdHlsZXIocm93SGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICAvKiogQ29tcHV0ZXMgYW5kIGFwcGxpZXMgdGhlIHNpemUgYW5kIHBvc2l0aW9uIGZvciBhbGwgY2hpbGRyZW4gZ3JpZCB0aWxlcy4gKi9cbiAgcHJpdmF0ZSBfbGF5b3V0VGlsZXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl90aWxlQ29vcmRpbmF0b3IpIHtcbiAgICAgIHRoaXMuX3RpbGVDb29yZGluYXRvciA9IG5ldyBUaWxlQ29vcmRpbmF0b3IoKTtcbiAgICB9XG5cblxuICAgIGNvbnN0IHRyYWNrZXIgPSB0aGlzLl90aWxlQ29vcmRpbmF0b3I7XG4gICAgY29uc3QgdGlsZXMgPSB0aGlzLl90aWxlcy5maWx0ZXIodGlsZSA9PiAhdGlsZS5fZ3JpZExpc3QgfHwgdGlsZS5fZ3JpZExpc3QgPT09IHRoaXMpO1xuICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMuX2RpciA/IHRoaXMuX2Rpci52YWx1ZSA6ICdsdHInO1xuXG4gICAgdGhpcy5fdGlsZUNvb3JkaW5hdG9yLnVwZGF0ZSh0aGlzLmNvbHMsIHRpbGVzKTtcbiAgICB0aGlzLl90aWxlU3R5bGVyLmluaXQodGhpcy5ndXR0ZXJTaXplLCB0cmFja2VyLCB0aGlzLmNvbHMsIGRpcmVjdGlvbik7XG5cbiAgICB0aWxlcy5mb3JFYWNoKCh0aWxlLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgcG9zID0gdHJhY2tlci5wb3NpdGlvbnNbaW5kZXhdO1xuICAgICAgdGhpcy5fdGlsZVN0eWxlci5zZXRTdHlsZSh0aWxlLCBwb3Mucm93LCBwb3MuY29sKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3NldExpc3RTdHlsZSh0aGlzLl90aWxlU3R5bGVyLmdldENvbXB1dGVkSGVpZ2h0KCkpO1xuICB9XG5cbiAgLyoqIFNldHMgc3R5bGUgb24gdGhlIG1haW4gZ3JpZC1saXN0IGVsZW1lbnQsIGdpdmVuIHRoZSBzdHlsZSBuYW1lIGFuZCB2YWx1ZS4gKi9cbiAgX3NldExpc3RTdHlsZShzdHlsZTogW3N0cmluZywgc3RyaW5nIHwgbnVsbF0gfCBudWxsKTogdm9pZCB7XG4gICAgaWYgKHN0eWxlKSB7XG4gICAgICAodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlIGFzIGFueSlbc3R5bGVbMF1dID0gc3R5bGVbMV07XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NvbHM6IE51bWJlcklucHV0O1xufVxuIl19
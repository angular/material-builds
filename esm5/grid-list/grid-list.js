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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLWxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFHakIsS0FBSyxFQUNMLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFFBQVEsRUFDUix1QkFBdUIsR0FDeEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxFQUFhLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFGLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsYUFBYSxFQUFrQixNQUFNLGtCQUFrQixDQUFDO0FBR2hFLGdFQUFnRTtBQUNoRSxxRUFBcUU7QUFDckUsaURBQWlEO0FBRWpELElBQU0sWUFBWSxHQUFHLEtBQUssQ0FBQztBQUUzQjtJQXVDRSxxQkFBb0IsUUFBaUMsRUFDckIsSUFBb0I7UUFEaEMsYUFBUSxHQUFSLFFBQVEsQ0FBeUI7UUFDckIsU0FBSSxHQUFKLElBQUksQ0FBZ0I7UUFWcEQscUZBQXFGO1FBQzdFLFlBQU8sR0FBVyxLQUFLLENBQUM7SUFTdUIsQ0FBQztJQUd4RCxzQkFDSSw2QkFBSTtRQUZSLDBDQUEwQzthQUMxQyxjQUNxQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ3pDLFVBQVMsS0FBYTtZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FB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YTs0QkFDdEIsV0FBVyxFQUFFLFdBQVc7eUJBQ3pCLENBQUM7b0JBQ0YsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOztpQkFDdEM7Ozs7Z0JBaENDLFVBQVU7Z0JBT0osY0FBYyx1QkFtRFAsUUFBUTs7O3lCQUhwQixlQUFlLFNBQUMsV0FBVyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzt1QkFNaEQsS0FBSzs2QkFPTCxLQUFLOzRCQUtMLEtBQUs7O0lBb0ZSLGtCQUFDO0NBQUEsQUEzSUQsSUEySUM7U0E1SFksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBPbkluaXQsXG4gIElucHV0LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIFF1ZXJ5TGlzdCxcbiAgRWxlbWVudFJlZixcbiAgT3B0aW9uYWwsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TWF0R3JpZFRpbGV9IGZyb20gJy4vZ3JpZC10aWxlJztcbmltcG9ydCB7VGlsZUNvb3JkaW5hdG9yfSBmcm9tICcuL3RpbGUtY29vcmRpbmF0b3InO1xuaW1wb3J0IHtUaWxlU3R5bGVyLCBGaXRUaWxlU3R5bGVyLCBSYXRpb1RpbGVTdHlsZXIsIEZpeGVkVGlsZVN0eWxlcn0gZnJvbSAnLi90aWxlLXN0eWxlcic7XG5pbXBvcnQge0RpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtNQVRfR1JJRF9MSVNULCBNYXRHcmlkTGlzdEJhc2V9IGZyb20gJy4vZ3JpZC1saXN0LWJhc2UnO1xuXG5cbi8vIFRPRE8oa2FyYSk6IENvbmRpdGlvbmFsIChyZXNwb25zaXZlKSBjb2x1bW4gY291bnQgLyByb3cgc2l6ZS5cbi8vIFRPRE8oa2FyYSk6IFJlLWxheW91dCBvbiB3aW5kb3cgcmVzaXplIC8gbWVkaWEgY2hhbmdlIChkZWJvdW5jZWQpLlxuLy8gVE9ETyhrYXJhKTogZ3JpZFRpbGVIZWFkZXIgYW5kIGdyaWRUaWxlRm9vdGVyLlxuXG5jb25zdCBNQVRfRklUX01PREUgPSAnZml0JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWdyaWQtbGlzdCcsXG4gIGV4cG9ydEFzOiAnbWF0R3JpZExpc3QnLFxuICB0ZW1wbGF0ZVVybDogJ2dyaWQtbGlzdC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2dyaWQtbGlzdC5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZ3JpZC1saXN0JyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe1xuICAgIHByb3ZpZGU6IE1BVF9HUklEX0xJU1QsXG4gICAgdXNlRXhpc3Rpbmc6IE1hdEdyaWRMaXN0XG4gIH1dLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0R3JpZExpc3QgaW1wbGVtZW50cyBNYXRHcmlkTGlzdEJhc2UsIE9uSW5pdCwgQWZ0ZXJDb250ZW50Q2hlY2tlZCB7XG4gIC8qKiBOdW1iZXIgb2YgY29sdW1ucyBiZWluZyByZW5kZXJlZC4gKi9cbiAgcHJpdmF0ZSBfY29sczogbnVtYmVyO1xuXG4gIC8qKiBVc2VkIGZvciBkZXRlcm1pbmluZ3RoZSBwb3NpdGlvbiBvZiBlYWNoIHRpbGUgaW4gdGhlIGdyaWQuICovXG4gIHByaXZhdGUgX3RpbGVDb29yZGluYXRvcjogVGlsZUNvb3JkaW5hdG9yO1xuXG4gIC8qKlxuICAgKiBSb3cgaGVpZ2h0IHZhbHVlIHBhc3NlZCBpbiBieSB1c2VyLiBUaGlzIGNhbiBiZSBvbmUgb2YgdGhyZWUgdHlwZXM6XG4gICAqIC0gTnVtYmVyIHZhbHVlIChleDogXCIxMDBweFwiKTogIHNldHMgYSBmaXhlZCByb3cgaGVpZ2h0IHRvIHRoYXQgdmFsdWVcbiAgICogLSBSYXRpbyB2YWx1ZSAoZXg6IFwiNDozXCIpOiBzZXRzIHRoZSByb3cgaGVpZ2h0IGJhc2VkIG9uIHdpZHRoOmhlaWdodCByYXRpb1xuICAgKiAtIFwiRml0XCIgbW9kZSAoZXg6IFwiZml0XCIpOiBzZXRzIHRoZSByb3cgaGVpZ2h0IHRvIHRvdGFsIGhlaWdodCBkaXZpZGVkIGJ5IG51bWJlciBvZiByb3dzXG4gICAqL1xuICBwcml2YXRlIF9yb3dIZWlnaHQ6IHN0cmluZztcblxuICAvKiogVGhlIGFtb3VudCBvZiBzcGFjZSBiZXR3ZWVuIHRpbGVzLiBUaGlzIHdpbGwgYmUgc29tZXRoaW5nIGxpa2UgJzVweCcgb3IgJzJlbScuICovXG4gIHByaXZhdGUgX2d1dHRlcjogc3RyaW5nID0gJzFweCc7XG5cbiAgLyoqIFNldHMgcG9zaXRpb24gYW5kIHNpemUgc3R5bGVzIGZvciBhIHRpbGUgKi9cbiAgcHJpdmF0ZSBfdGlsZVN0eWxlcjogVGlsZVN0eWxlcjtcblxuICAvKiogUXVlcnkgbGlzdCBvZiB0aWxlcyB0aGF0IGFyZSBiZWluZyByZW5kZXJlZC4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRHcmlkVGlsZSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX3RpbGVzOiBRdWVyeUxpc3Q8TWF0R3JpZFRpbGU+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2VsZW1lbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5KSB7fVxuXG4gIC8qKiBBbW91bnQgb2YgY29sdW1ucyBpbiB0aGUgZ3JpZCBsaXN0LiAqL1xuICBASW5wdXQoKVxuICBnZXQgY29scygpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5fY29sczsgfVxuICBzZXQgY29scyh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fY29scyA9IE1hdGgubWF4KDEsIE1hdGgucm91bmQoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpKSk7XG4gIH1cblxuICAvKiogU2l6ZSBvZiB0aGUgZ3JpZCBsaXN0J3MgZ3V0dGVyIGluIHBpeGVscy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGd1dHRlclNpemUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX2d1dHRlcjsgfVxuICBzZXQgZ3V0dGVyU2l6ZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMuX2d1dHRlciA9IGAke3ZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlfWA7IH1cblxuICAvKiogU2V0IGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIHJvdyBoZWlnaHQgZnJvbSB0aGUgdXNlci1wcm92aWRlZCB2YWx1ZS4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHJvd0hlaWdodCgpOiBzdHJpbmcgfCBudW1iZXIgeyByZXR1cm4gdGhpcy5fcm93SGVpZ2h0OyB9XG4gIHNldCByb3dIZWlnaHQodmFsdWU6IHN0cmluZyB8IG51bWJlcikge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gYCR7dmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWV9YDtcblxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5fcm93SGVpZ2h0KSB7XG4gICAgICB0aGlzLl9yb3dIZWlnaHQgPSBuZXdWYWx1ZTtcbiAgICAgIHRoaXMuX3NldFRpbGVTdHlsZXIodGhpcy5fcm93SGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9jaGVja0NvbHMoKTtcbiAgICB0aGlzLl9jaGVja1Jvd0hlaWdodCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBsYXlvdXQgY2FsY3VsYXRpb24gaXMgZmFpcmx5IGNoZWFwIGlmIG5vdGhpbmcgY2hhbmdlcywgc28gdGhlcmUncyBsaXR0bGUgY29zdFxuICAgKiB0byBydW4gaXQgZnJlcXVlbnRseS5cbiAgICovXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICB0aGlzLl9sYXlvdXRUaWxlcygpO1xuICB9XG5cbiAgLyoqIFRocm93IGEgZnJpZW5kbHkgZXJyb3IgaWYgY29scyBwcm9wZXJ0eSBpcyBtaXNzaW5nICovXG4gIHByaXZhdGUgX2NoZWNrQ29scygpIHtcbiAgICBpZiAoIXRoaXMuY29scykge1xuICAgICAgdGhyb3cgRXJyb3IoYG1hdC1ncmlkLWxpc3Q6IG11c3QgcGFzcyBpbiBudW1iZXIgb2YgY29sdW1ucy4gYCArXG4gICAgICAgICAgICAgICAgICBgRXhhbXBsZTogPG1hdC1ncmlkLWxpc3QgY29scz1cIjNcIj5gKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGVmYXVsdCB0byBlcXVhbCB3aWR0aDpoZWlnaHQgaWYgcm93SGVpZ2h0IHByb3BlcnR5IGlzIG1pc3NpbmcgKi9cbiAgcHJpdmF0ZSBfY2hlY2tSb3dIZWlnaHQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl9yb3dIZWlnaHQpIHtcbiAgICAgIHRoaXMuX3NldFRpbGVTdHlsZXIoJzE6MScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGNvcnJlY3QgVGlsZSBTdHlsZXIgc3VidHlwZSBiYXNlZCBvbiByb3dIZWlnaHQgcGFzc2VkIGluIGJ5IHVzZXIgKi9cbiAgcHJpdmF0ZSBfc2V0VGlsZVN0eWxlcihyb3dIZWlnaHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLl90aWxlU3R5bGVyKSB7XG4gICAgICB0aGlzLl90aWxlU3R5bGVyLnJlc2V0KHRoaXMpO1xuICAgIH1cblxuICAgIGlmIChyb3dIZWlnaHQgPT09IE1BVF9GSVRfTU9ERSkge1xuICAgICAgdGhpcy5fdGlsZVN0eWxlciA9IG5ldyBGaXRUaWxlU3R5bGVyKCk7XG4gICAgfSBlbHNlIGlmIChyb3dIZWlnaHQgJiYgcm93SGVpZ2h0LmluZGV4T2YoJzonKSA+IC0xKSB7XG4gICAgICB0aGlzLl90aWxlU3R5bGVyID0gbmV3IFJhdGlvVGlsZVN0eWxlcihyb3dIZWlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90aWxlU3R5bGVyID0gbmV3IEZpeGVkVGlsZVN0eWxlcihyb3dIZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDb21wdXRlcyBhbmQgYXBwbGllcyB0aGUgc2l6ZSBhbmQgcG9zaXRpb24gZm9yIGFsbCBjaGlsZHJlbiBncmlkIHRpbGVzLiAqL1xuICBwcml2YXRlIF9sYXlvdXRUaWxlcygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3RpbGVDb29yZGluYXRvcikge1xuICAgICAgdGhpcy5fdGlsZUNvb3JkaW5hdG9yID0gbmV3IFRpbGVDb29yZGluYXRvcigpO1xuICAgIH1cblxuXG4gICAgY29uc3QgdHJhY2tlciA9IHRoaXMuX3RpbGVDb29yZGluYXRvcjtcbiAgICBjb25zdCB0aWxlcyA9IHRoaXMuX3RpbGVzLmZpbHRlcih0aWxlID0+ICF0aWxlLl9ncmlkTGlzdCB8fCB0aWxlLl9ncmlkTGlzdCA9PT0gdGhpcyk7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5fZGlyID8gdGhpcy5fZGlyLnZhbHVlIDogJ2x0cic7XG5cbiAgICB0aGlzLl90aWxlQ29vcmRpbmF0b3IudXBkYXRlKHRoaXMuY29scywgdGlsZXMpO1xuICAgIHRoaXMuX3RpbGVTdHlsZXIuaW5pdCh0aGlzLmd1dHRlclNpemUsIHRyYWNrZXIsIHRoaXMuY29scywgZGlyZWN0aW9uKTtcblxuICAgIHRpbGVzLmZvckVhY2goKHRpbGUsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBwb3MgPSB0cmFja2VyLnBvc2l0aW9uc1tpbmRleF07XG4gICAgICB0aGlzLl90aWxlU3R5bGVyLnNldFN0eWxlKHRpbGUsIHBvcy5yb3csIHBvcy5jb2wpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc2V0TGlzdFN0eWxlKHRoaXMuX3RpbGVTdHlsZXIuZ2V0Q29tcHV0ZWRIZWlnaHQoKSk7XG4gIH1cblxuICAvKiogU2V0cyBzdHlsZSBvbiB0aGUgbWFpbiBncmlkLWxpc3QgZWxlbWVudCwgZ2l2ZW4gdGhlIHN0eWxlIG5hbWUgYW5kIHZhbHVlLiAqL1xuICBfc2V0TGlzdFN0eWxlKHN0eWxlOiBbc3RyaW5nLCBzdHJpbmcgfCBudWxsXSB8IG51bGwpOiB2b2lkIHtcbiAgICBpZiAoc3R5bGUpIHtcbiAgICAgICh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUgYXMgYW55KVtzdHlsZVswXV0gPSBzdHlsZVsxXTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfY29sczogbnVtYmVyIHwgc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZDtcbn1cbiJdfQ==
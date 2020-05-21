/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
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
const MAT_FIT_MODE = 'fit';
let MatGridList = /** @class */ (() => {
    var MatGridList_1;
    let MatGridList = MatGridList_1 = class MatGridList {
        constructor(_element, _dir) {
            this._element = _element;
            this._dir = _dir;
            /** The amount of space between tiles. This will be something like '5px' or '2em'. */
            this._gutter = '1px';
        }
        /** Amount of columns in the grid list. */
        get cols() { return this._cols; }
        set cols(value) {
            this._cols = Math.max(1, Math.round(coerceNumberProperty(value)));
        }
        /** Size of the grid list's gutter in pixels. */
        get gutterSize() { return this._gutter; }
        set gutterSize(value) { this._gutter = `${value == null ? '' : value}`; }
        /** Set internal representation of row height from the user-provided value. */
        get rowHeight() { return this._rowHeight; }
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
            if (!this.cols) {
                throw Error(`mat-grid-list: must pass in number of columns. ` +
                    `Example: <mat-grid-list cols="3">`);
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
    };
    __decorate([
        ContentChildren(MatGridTile, { descendants: true }),
        __metadata("design:type", QueryList)
    ], MatGridList.prototype, "_tiles", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], MatGridList.prototype, "cols", null);
    __decorate([
        Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MatGridList.prototype, "gutterSize", null);
    __decorate([
        Input(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], MatGridList.prototype, "rowHeight", null);
    MatGridList = MatGridList_1 = __decorate([
        Component({
            selector: 'mat-grid-list',
            exportAs: 'matGridList',
            template: "<div>\n  <ng-content></ng-content>\n</div>",
            host: {
                'class': 'mat-grid-list',
                // Ensures that the "cols" input value is reflected in the DOM. This is
                // needed for the grid-list harness.
                '[attr.cols]': 'cols',
            },
            providers: [{
                    provide: MAT_GRID_LIST,
                    useExisting: MatGridList_1
                }],
            changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: ViewEncapsulation.None,
            styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-figure{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;width:100%;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}\n"]
        }),
        __param(1, Optional()),
        __metadata("design:paramtypes", [ElementRef,
            Directionality])
    ], MatGridList);
    return MatGridList;
})();
export { MatGridList };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLWxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFDTCxTQUFTLEVBQ1QsaUJBQWlCLEVBR2pCLEtBQUssRUFDTCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixRQUFRLEVBQ1IsdUJBQXVCLEdBQ3hCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ25ELE9BQU8sRUFBYSxhQUFhLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMxRixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLG9CQUFvQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGFBQWEsRUFBa0IsTUFBTSxrQkFBa0IsQ0FBQztBQUdoRSxnRUFBZ0U7QUFDaEUscUVBQXFFO0FBQ3JFLGlEQUFpRDtBQUVqRCxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUM7QUFvQjNCOztJQUFBLElBQWEsV0FBVyxtQkFBeEIsTUFBYSxXQUFXO1FBd0J0QixZQUFvQixRQUFpQyxFQUNyQixJQUFvQjtZQURoQyxhQUFRLEdBQVIsUUFBUSxDQUF5QjtZQUNyQixTQUFJLEdBQUosSUFBSSxDQUFnQjtZQVZwRCxxRkFBcUY7WUFDN0UsWUFBTyxHQUFXLEtBQUssQ0FBQztRQVN1QixDQUFDO1FBRXhELDBDQUEwQztRQUUxQyxJQUFJLElBQUksS0FBYSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLElBQUksSUFBSSxDQUFDLEtBQWE7WUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBRUQsZ0RBQWdEO1FBRWhELElBQUksVUFBVSxLQUFhLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBSSxVQUFVLENBQUMsS0FBYSxJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVqRiw4RUFBOEU7UUFFOUUsSUFBSSxTQUFTLEtBQXNCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDNUQsSUFBSSxTQUFTLENBQUMsS0FBc0I7WUFDbEMsTUFBTSxRQUFRLEdBQUcsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRWpELElBQUksUUFBUSxLQUFLLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO2dCQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUN0QztRQUNILENBQUM7UUFFRCxRQUFRO1lBQ04sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN6QixDQUFDO1FBRUQ7OztXQUdHO1FBQ0gscUJBQXFCO1lBQ25CLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDO1FBRUQseURBQXlEO1FBQ2pELFVBQVU7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2QsTUFBTSxLQUFLLENBQUMsaURBQWlEO29CQUNqRCxtQ0FBbUMsQ0FBQyxDQUFDO2FBQ2xEO1FBQ0gsQ0FBQztRQUVELHFFQUFxRTtRQUM3RCxlQUFlO1lBQ3JCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNwQixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzVCO1FBQ0gsQ0FBQztRQUVELCtFQUErRTtRQUN2RSxjQUFjLENBQUMsU0FBaUI7WUFDdEMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUM5QjtZQUVELElBQUksU0FBUyxLQUFLLFlBQVksRUFBRTtnQkFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGFBQWEsRUFBRSxDQUFDO2FBQ3hDO2lCQUFNLElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ25ELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDbkQ7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUNuRDtRQUNILENBQUM7UUFFRCw4RUFBOEU7UUFDdEUsWUFBWTtZQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUMxQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQzthQUMvQztZQUdELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUN0QyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBQ3JGLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFFdEQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFFdEUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRTtnQkFDNUIsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGlCQUFpQixFQUFFLENBQUMsQ0FBQztRQUMzRCxDQUFDO1FBRUQsZ0ZBQWdGO1FBQ2hGLGFBQWEsQ0FBQyxLQUFxQztZQUNqRCxJQUFJLEtBQUssRUFBRTtnQkFDUixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pFO1FBQ0gsQ0FBQztLQUdGLENBQUE7SUF0R29EO1FBQWxELGVBQWUsQ0FBQyxXQUFXLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDLENBQUM7a0NBQVMsU0FBUzsrQ0FBYztJQU9sRjtRQURDLEtBQUssRUFBRTs7OzJDQUNpQztJQU96QztRQURDLEtBQUssRUFBRTs7O2lEQUN5QztJQUtqRDtRQURDLEtBQUssRUFBRTs7O2dEQUNvRDtJQXpDakQsV0FBVztRQWxCdkIsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGVBQWU7WUFDekIsUUFBUSxFQUFFLGFBQWE7WUFDdkIsc0RBQTZCO1lBRTdCLElBQUksRUFBRTtnQkFDSixPQUFPLEVBQUUsZUFBZTtnQkFDeEIsdUVBQXVFO2dCQUN2RSxvQ0FBb0M7Z0JBQ3BDLGFBQWEsRUFBRSxNQUFNO2FBQ3RCO1lBQ0QsU0FBUyxFQUFFLENBQUM7b0JBQ1YsT0FBTyxFQUFFLGFBQWE7b0JBQ3RCLFdBQVcsRUFBRSxhQUFXO2lCQUN6QixDQUFDO1lBQ0YsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07WUFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O1NBQ3RDLENBQUM7UUEwQmEsV0FBQSxRQUFRLEVBQUUsQ0FBQTt5Q0FETyxVQUFVO1lBQ0YsY0FBYztPQXpCekMsV0FBVyxDQTRIdkI7SUFBRCxrQkFBQztLQUFBO1NBNUhZLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgT25Jbml0LFxuICBJbnB1dCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBRdWVyeUxpc3QsXG4gIEVsZW1lbnRSZWYsXG4gIE9wdGlvbmFsLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01hdEdyaWRUaWxlfSBmcm9tICcuL2dyaWQtdGlsZSc7XG5pbXBvcnQge1RpbGVDb29yZGluYXRvcn0gZnJvbSAnLi90aWxlLWNvb3JkaW5hdG9yJztcbmltcG9ydCB7VGlsZVN0eWxlciwgRml0VGlsZVN0eWxlciwgUmF0aW9UaWxlU3R5bGVyLCBGaXhlZFRpbGVTdHlsZXJ9IGZyb20gJy4vdGlsZS1zdHlsZXInO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtjb2VyY2VOdW1iZXJQcm9wZXJ0eSwgTnVtYmVySW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge01BVF9HUklEX0xJU1QsIE1hdEdyaWRMaXN0QmFzZX0gZnJvbSAnLi9ncmlkLWxpc3QtYmFzZSc7XG5cblxuLy8gVE9ETyhrYXJhKTogQ29uZGl0aW9uYWwgKHJlc3BvbnNpdmUpIGNvbHVtbiBjb3VudCAvIHJvdyBzaXplLlxuLy8gVE9ETyhrYXJhKTogUmUtbGF5b3V0IG9uIHdpbmRvdyByZXNpemUgLyBtZWRpYSBjaGFuZ2UgKGRlYm91bmNlZCkuXG4vLyBUT0RPKGthcmEpOiBncmlkVGlsZUhlYWRlciBhbmQgZ3JpZFRpbGVGb290ZXIuXG5cbmNvbnN0IE1BVF9GSVRfTU9ERSA9ICdmaXQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtZ3JpZC1saXN0JyxcbiAgZXhwb3J0QXM6ICdtYXRHcmlkTGlzdCcsXG4gIHRlbXBsYXRlVXJsOiAnZ3JpZC1saXN0Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnZ3JpZC1saXN0LmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1ncmlkLWxpc3QnLFxuICAgIC8vIEVuc3VyZXMgdGhhdCB0aGUgXCJjb2xzXCIgaW5wdXQgdmFsdWUgaXMgcmVmbGVjdGVkIGluIHRoZSBET00uIFRoaXMgaXNcbiAgICAvLyBuZWVkZWQgZm9yIHRoZSBncmlkLWxpc3QgaGFybmVzcy5cbiAgICAnW2F0dHIuY29sc10nOiAnY29scycsXG4gIH0sXG4gIHByb3ZpZGVyczogW3tcbiAgICBwcm92aWRlOiBNQVRfR1JJRF9MSVNULFxuICAgIHVzZUV4aXN0aW5nOiBNYXRHcmlkTGlzdFxuICB9XSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEdyaWRMaXN0IGltcGxlbWVudHMgTWF0R3JpZExpc3RCYXNlLCBPbkluaXQsIEFmdGVyQ29udGVudENoZWNrZWQge1xuICAvKiogTnVtYmVyIG9mIGNvbHVtbnMgYmVpbmcgcmVuZGVyZWQuICovXG4gIHByaXZhdGUgX2NvbHM6IG51bWJlcjtcblxuICAvKiogVXNlZCBmb3IgZGV0ZXJtaW5pbmd0aGUgcG9zaXRpb24gb2YgZWFjaCB0aWxlIGluIHRoZSBncmlkLiAqL1xuICBwcml2YXRlIF90aWxlQ29vcmRpbmF0b3I6IFRpbGVDb29yZGluYXRvcjtcblxuICAvKipcbiAgICogUm93IGhlaWdodCB2YWx1ZSBwYXNzZWQgaW4gYnkgdXNlci4gVGhpcyBjYW4gYmUgb25lIG9mIHRocmVlIHR5cGVzOlxuICAgKiAtIE51bWJlciB2YWx1ZSAoZXg6IFwiMTAwcHhcIik6ICBzZXRzIGEgZml4ZWQgcm93IGhlaWdodCB0byB0aGF0IHZhbHVlXG4gICAqIC0gUmF0aW8gdmFsdWUgKGV4OiBcIjQ6M1wiKTogc2V0cyB0aGUgcm93IGhlaWdodCBiYXNlZCBvbiB3aWR0aDpoZWlnaHQgcmF0aW9cbiAgICogLSBcIkZpdFwiIG1vZGUgKGV4OiBcImZpdFwiKTogc2V0cyB0aGUgcm93IGhlaWdodCB0byB0b3RhbCBoZWlnaHQgZGl2aWRlZCBieSBudW1iZXIgb2Ygcm93c1xuICAgKi9cbiAgcHJpdmF0ZSBfcm93SGVpZ2h0OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBhbW91bnQgb2Ygc3BhY2UgYmV0d2VlbiB0aWxlcy4gVGhpcyB3aWxsIGJlIHNvbWV0aGluZyBsaWtlICc1cHgnIG9yICcyZW0nLiAqL1xuICBwcml2YXRlIF9ndXR0ZXI6IHN0cmluZyA9ICcxcHgnO1xuXG4gIC8qKiBTZXRzIHBvc2l0aW9uIGFuZCBzaXplIHN0eWxlcyBmb3IgYSB0aWxlICovXG4gIHByaXZhdGUgX3RpbGVTdHlsZXI6IFRpbGVTdHlsZXI7XG5cbiAgLyoqIFF1ZXJ5IGxpc3Qgb2YgdGlsZXMgdGhhdCBhcmUgYmVpbmcgcmVuZGVyZWQuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0R3JpZFRpbGUsIHtkZXNjZW5kYW50czogdHJ1ZX0pIF90aWxlczogUXVlcnlMaXN0PE1hdEdyaWRUaWxlPjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSkge31cblxuICAvKiogQW1vdW50IG9mIGNvbHVtbnMgaW4gdGhlIGdyaWQgbGlzdC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGNvbHMoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuX2NvbHM7IH1cbiAgc2V0IGNvbHModmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX2NvbHMgPSBNYXRoLm1heCgxLCBNYXRoLnJvdW5kKGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKSkpO1xuICB9XG5cbiAgLyoqIFNpemUgb2YgdGhlIGdyaWQgbGlzdCdzIGd1dHRlciBpbiBwaXhlbHMuICovXG4gIEBJbnB1dCgpXG4gIGdldCBndXR0ZXJTaXplKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLl9ndXR0ZXI7IH1cbiAgc2V0IGd1dHRlclNpemUodmFsdWU6IHN0cmluZykgeyB0aGlzLl9ndXR0ZXIgPSBgJHt2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZX1gOyB9XG5cbiAgLyoqIFNldCBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiBvZiByb3cgaGVpZ2h0IGZyb20gdGhlIHVzZXItcHJvdmlkZWQgdmFsdWUuICovXG4gIEBJbnB1dCgpXG4gIGdldCByb3dIZWlnaHQoKTogc3RyaW5nIHwgbnVtYmVyIHsgcmV0dXJuIHRoaXMuX3Jvd0hlaWdodDsgfVxuICBzZXQgcm93SGVpZ2h0KHZhbHVlOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGAke3ZhbHVlID09IG51bGwgPyAnJyA6IHZhbHVlfWA7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX3Jvd0hlaWdodCkge1xuICAgICAgdGhpcy5fcm93SGVpZ2h0ID0gbmV3VmFsdWU7XG4gICAgICB0aGlzLl9zZXRUaWxlU3R5bGVyKHRoaXMuX3Jvd0hlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fY2hlY2tDb2xzKCk7XG4gICAgdGhpcy5fY2hlY2tSb3dIZWlnaHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbGF5b3V0IGNhbGN1bGF0aW9uIGlzIGZhaXJseSBjaGVhcCBpZiBub3RoaW5nIGNoYW5nZXMsIHNvIHRoZXJlJ3MgbGl0dGxlIGNvc3RcbiAgICogdG8gcnVuIGl0IGZyZXF1ZW50bHkuXG4gICAqL1xuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgdGhpcy5fbGF5b3V0VGlsZXMoKTtcbiAgfVxuXG4gIC8qKiBUaHJvdyBhIGZyaWVuZGx5IGVycm9yIGlmIGNvbHMgcHJvcGVydHkgaXMgbWlzc2luZyAqL1xuICBwcml2YXRlIF9jaGVja0NvbHMoKSB7XG4gICAgaWYgKCF0aGlzLmNvbHMpIHtcbiAgICAgIHRocm93IEVycm9yKGBtYXQtZ3JpZC1saXN0OiBtdXN0IHBhc3MgaW4gbnVtYmVyIG9mIGNvbHVtbnMuIGAgK1xuICAgICAgICAgICAgICAgICAgYEV4YW1wbGU6IDxtYXQtZ3JpZC1saXN0IGNvbHM9XCIzXCI+YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIERlZmF1bHQgdG8gZXF1YWwgd2lkdGg6aGVpZ2h0IGlmIHJvd0hlaWdodCBwcm9wZXJ0eSBpcyBtaXNzaW5nICovXG4gIHByaXZhdGUgX2NoZWNrUm93SGVpZ2h0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fcm93SGVpZ2h0KSB7XG4gICAgICB0aGlzLl9zZXRUaWxlU3R5bGVyKCcxOjEnKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ3JlYXRlcyBjb3JyZWN0IFRpbGUgU3R5bGVyIHN1YnR5cGUgYmFzZWQgb24gcm93SGVpZ2h0IHBhc3NlZCBpbiBieSB1c2VyICovXG4gIHByaXZhdGUgX3NldFRpbGVTdHlsZXIocm93SGVpZ2h0OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fdGlsZVN0eWxlcikge1xuICAgICAgdGhpcy5fdGlsZVN0eWxlci5yZXNldCh0aGlzKTtcbiAgICB9XG5cbiAgICBpZiAocm93SGVpZ2h0ID09PSBNQVRfRklUX01PREUpIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIgPSBuZXcgRml0VGlsZVN0eWxlcigpO1xuICAgIH0gZWxzZSBpZiAocm93SGVpZ2h0ICYmIHJvd0hlaWdodC5pbmRleE9mKCc6JykgPiAtMSkge1xuICAgICAgdGhpcy5fdGlsZVN0eWxlciA9IG5ldyBSYXRpb1RpbGVTdHlsZXIocm93SGVpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fdGlsZVN0eWxlciA9IG5ldyBGaXhlZFRpbGVTdHlsZXIocm93SGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICAvKiogQ29tcHV0ZXMgYW5kIGFwcGxpZXMgdGhlIHNpemUgYW5kIHBvc2l0aW9uIGZvciBhbGwgY2hpbGRyZW4gZ3JpZCB0aWxlcy4gKi9cbiAgcHJpdmF0ZSBfbGF5b3V0VGlsZXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl90aWxlQ29vcmRpbmF0b3IpIHtcbiAgICAgIHRoaXMuX3RpbGVDb29yZGluYXRvciA9IG5ldyBUaWxlQ29vcmRpbmF0b3IoKTtcbiAgICB9XG5cblxuICAgIGNvbnN0IHRyYWNrZXIgPSB0aGlzLl90aWxlQ29vcmRpbmF0b3I7XG4gICAgY29uc3QgdGlsZXMgPSB0aGlzLl90aWxlcy5maWx0ZXIodGlsZSA9PiAhdGlsZS5fZ3JpZExpc3QgfHwgdGlsZS5fZ3JpZExpc3QgPT09IHRoaXMpO1xuICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMuX2RpciA/IHRoaXMuX2Rpci52YWx1ZSA6ICdsdHInO1xuXG4gICAgdGhpcy5fdGlsZUNvb3JkaW5hdG9yLnVwZGF0ZSh0aGlzLmNvbHMsIHRpbGVzKTtcbiAgICB0aGlzLl90aWxlU3R5bGVyLmluaXQodGhpcy5ndXR0ZXJTaXplLCB0cmFja2VyLCB0aGlzLmNvbHMsIGRpcmVjdGlvbik7XG5cbiAgICB0aWxlcy5mb3JFYWNoKCh0aWxlLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgcG9zID0gdHJhY2tlci5wb3NpdGlvbnNbaW5kZXhdO1xuICAgICAgdGhpcy5fdGlsZVN0eWxlci5zZXRTdHlsZSh0aWxlLCBwb3Mucm93LCBwb3MuY29sKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX3NldExpc3RTdHlsZSh0aGlzLl90aWxlU3R5bGVyLmdldENvbXB1dGVkSGVpZ2h0KCkpO1xuICB9XG5cbiAgLyoqIFNldHMgc3R5bGUgb24gdGhlIG1haW4gZ3JpZC1saXN0IGVsZW1lbnQsIGdpdmVuIHRoZSBzdHlsZSBuYW1lIGFuZCB2YWx1ZS4gKi9cbiAgX3NldExpc3RTdHlsZShzdHlsZTogW3N0cmluZywgc3RyaW5nIHwgbnVsbF0gfCBudWxsKTogdm9pZCB7XG4gICAgaWYgKHN0eWxlKSB7XG4gICAgICAodGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LnN0eWxlIGFzIGFueSlbc3R5bGVbMF1dID0gc3R5bGVbMV07XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2NvbHM6IE51bWJlcklucHV0O1xufVxuIl19
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
const MAT_FIT_MODE = 'fit';
export class MatGridList {
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
}
MatGridList.decorators = [
    { type: Component, args: [{
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
                        useExisting: MatGridList
                    }],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                styles: [".mat-grid-list{display:block;position:relative}.mat-grid-tile{display:block;position:absolute;overflow:hidden}.mat-grid-tile .mat-figure{top:0;left:0;right:0;bottom:0;position:absolute;display:flex;align-items:center;justify-content:center;height:100%;padding:0;margin:0}.mat-grid-tile .mat-grid-tile-header,.mat-grid-tile .mat-grid-tile-footer{display:flex;align-items:center;height:48px;color:#fff;background:rgba(0,0,0,.38);overflow:hidden;padding:0 16px;position:absolute;left:0;right:0}.mat-grid-tile .mat-grid-tile-header>*,.mat-grid-tile .mat-grid-tile-footer>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-tile-header.mat-2-line,.mat-grid-tile .mat-grid-tile-footer.mat-2-line{height:68px}.mat-grid-tile .mat-grid-list-text{display:flex;flex-direction:column;flex:auto;box-sizing:border-box;overflow:hidden}.mat-grid-tile .mat-grid-list-text>*{margin:0;padding:0;font-weight:normal;font-size:inherit}.mat-grid-tile .mat-grid-list-text:empty{display:none}.mat-grid-tile .mat-grid-tile-header{top:0}.mat-grid-tile .mat-grid-tile-footer{bottom:0}.mat-grid-tile .mat-grid-avatar{padding-right:16px}[dir=rtl] .mat-grid-tile .mat-grid-avatar{padding-right:0;padding-left:16px}.mat-grid-tile .mat-grid-avatar:empty{display:none}\n"]
            },] }
];
MatGridList.ctorParameters = () => [
    { type: ElementRef },
    { type: Directionality, decorators: [{ type: Optional }] }
];
MatGridList.propDecorators = {
    _tiles: [{ type: ContentChildren, args: [MatGridTile, { descendants: true },] }],
    cols: [{ type: Input }],
    gutterSize: [{ type: Input }],
    rowHeight: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC1saXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2dyaWQtbGlzdC9ncmlkLWxpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxpQkFBaUIsRUFHakIsS0FBSyxFQUNMLGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFFBQVEsRUFDUix1QkFBdUIsR0FDeEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sb0JBQW9CLENBQUM7QUFDbkQsT0FBTyxFQUFhLGFBQWEsRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFGLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQUMsb0JBQW9CLEVBQWMsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RSxPQUFPLEVBQUMsYUFBYSxFQUFrQixNQUFNLGtCQUFrQixDQUFDO0FBR2hFLGdFQUFnRTtBQUNoRSxxRUFBcUU7QUFDckUsaURBQWlEO0FBRWpELE1BQU0sWUFBWSxHQUFHLEtBQUssQ0FBQztBQW9CM0IsTUFBTSxPQUFPLFdBQVc7SUF3QnRCLFlBQW9CLFFBQWlDLEVBQ3JCLElBQW9CO1FBRGhDLGFBQVEsR0FBUixRQUFRLENBQXlCO1FBQ3JCLFNBQUksR0FBSixJQUFJLENBQWdCO1FBVnBELHFGQUFxRjtRQUM3RSxZQUFPLEdBQVcsS0FBSyxDQUFDO0lBU3VCLENBQUM7SUFFeEQsMENBQTBDO0lBQzFDLElBQ0ksSUFBSSxLQUFhLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDekMsSUFBSSxJQUFJLENBQUMsS0FBYTtRQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElB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QkFDekIsQ0FBQztnQkFDRixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3RDOzs7WUFuQ0MsVUFBVTtZQU9KLGNBQWMsdUJBc0RQLFFBQVE7OztxQkFIcEIsZUFBZSxTQUFDLFdBQVcsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7bUJBTWhELEtBQUs7eUJBT0wsS0FBSzt3QkFLTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIE9uSW5pdCxcbiAgSW5wdXQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgUXVlcnlMaXN0LFxuICBFbGVtZW50UmVmLFxuICBPcHRpb25hbCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNYXRHcmlkVGlsZX0gZnJvbSAnLi9ncmlkLXRpbGUnO1xuaW1wb3J0IHtUaWxlQ29vcmRpbmF0b3J9IGZyb20gJy4vdGlsZS1jb29yZGluYXRvcic7XG5pbXBvcnQge1RpbGVTdHlsZXIsIEZpdFRpbGVTdHlsZXIsIFJhdGlvVGlsZVN0eWxlciwgRml4ZWRUaWxlU3R5bGVyfSBmcm9tICcuL3RpbGUtc3R5bGVyJztcbmltcG9ydCB7RGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHksIE51bWJlcklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtNQVRfR1JJRF9MSVNULCBNYXRHcmlkTGlzdEJhc2V9IGZyb20gJy4vZ3JpZC1saXN0LWJhc2UnO1xuXG5cbi8vIFRPRE8oa2FyYSk6IENvbmRpdGlvbmFsIChyZXNwb25zaXZlKSBjb2x1bW4gY291bnQgLyByb3cgc2l6ZS5cbi8vIFRPRE8oa2FyYSk6IFJlLWxheW91dCBvbiB3aW5kb3cgcmVzaXplIC8gbWVkaWEgY2hhbmdlIChkZWJvdW5jZWQpLlxuLy8gVE9ETyhrYXJhKTogZ3JpZFRpbGVIZWFkZXIgYW5kIGdyaWRUaWxlRm9vdGVyLlxuXG5jb25zdCBNQVRfRklUX01PREUgPSAnZml0JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWdyaWQtbGlzdCcsXG4gIGV4cG9ydEFzOiAnbWF0R3JpZExpc3QnLFxuICB0ZW1wbGF0ZVVybDogJ2dyaWQtbGlzdC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2dyaWQtbGlzdC5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtZ3JpZC1saXN0JyxcbiAgICAvLyBFbnN1cmVzIHRoYXQgdGhlIFwiY29sc1wiIGlucHV0IHZhbHVlIGlzIHJlZmxlY3RlZCBpbiB0aGUgRE9NLiBUaGlzIGlzXG4gICAgLy8gbmVlZGVkIGZvciB0aGUgZ3JpZC1saXN0IGhhcm5lc3MuXG4gICAgJ1thdHRyLmNvbHNdJzogJ2NvbHMnLFxuICB9LFxuICBwcm92aWRlcnM6IFt7XG4gICAgcHJvdmlkZTogTUFUX0dSSURfTElTVCxcbiAgICB1c2VFeGlzdGluZzogTWF0R3JpZExpc3RcbiAgfV0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRHcmlkTGlzdCBpbXBsZW1lbnRzIE1hdEdyaWRMaXN0QmFzZSwgT25Jbml0LCBBZnRlckNvbnRlbnRDaGVja2VkIHtcbiAgLyoqIE51bWJlciBvZiBjb2x1bW5zIGJlaW5nIHJlbmRlcmVkLiAqL1xuICBwcml2YXRlIF9jb2xzOiBudW1iZXI7XG5cbiAgLyoqIFVzZWQgZm9yIGRldGVybWluaW5ndGhlIHBvc2l0aW9uIG9mIGVhY2ggdGlsZSBpbiB0aGUgZ3JpZC4gKi9cbiAgcHJpdmF0ZSBfdGlsZUNvb3JkaW5hdG9yOiBUaWxlQ29vcmRpbmF0b3I7XG5cbiAgLyoqXG4gICAqIFJvdyBoZWlnaHQgdmFsdWUgcGFzc2VkIGluIGJ5IHVzZXIuIFRoaXMgY2FuIGJlIG9uZSBvZiB0aHJlZSB0eXBlczpcbiAgICogLSBOdW1iZXIgdmFsdWUgKGV4OiBcIjEwMHB4XCIpOiAgc2V0cyBhIGZpeGVkIHJvdyBoZWlnaHQgdG8gdGhhdCB2YWx1ZVxuICAgKiAtIFJhdGlvIHZhbHVlIChleDogXCI0OjNcIik6IHNldHMgdGhlIHJvdyBoZWlnaHQgYmFzZWQgb24gd2lkdGg6aGVpZ2h0IHJhdGlvXG4gICAqIC0gXCJGaXRcIiBtb2RlIChleDogXCJmaXRcIik6IHNldHMgdGhlIHJvdyBoZWlnaHQgdG8gdG90YWwgaGVpZ2h0IGRpdmlkZWQgYnkgbnVtYmVyIG9mIHJvd3NcbiAgICovXG4gIHByaXZhdGUgX3Jvd0hlaWdodDogc3RyaW5nO1xuXG4gIC8qKiBUaGUgYW1vdW50IG9mIHNwYWNlIGJldHdlZW4gdGlsZXMuIFRoaXMgd2lsbCBiZSBzb21ldGhpbmcgbGlrZSAnNXB4JyBvciAnMmVtJy4gKi9cbiAgcHJpdmF0ZSBfZ3V0dGVyOiBzdHJpbmcgPSAnMXB4JztcblxuICAvKiogU2V0cyBwb3NpdGlvbiBhbmQgc2l6ZSBzdHlsZXMgZm9yIGEgdGlsZSAqL1xuICBwcml2YXRlIF90aWxlU3R5bGVyOiBUaWxlU3R5bGVyO1xuXG4gIC8qKiBRdWVyeSBsaXN0IG9mIHRpbGVzIHRoYXQgYXJlIGJlaW5nIHJlbmRlcmVkLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdEdyaWRUaWxlLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfdGlsZXM6IFF1ZXJ5TGlzdDxNYXRHcmlkVGlsZT47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICAgICAgICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHkpIHt9XG5cbiAgLyoqIEFtb3VudCBvZiBjb2x1bW5zIGluIHRoZSBncmlkIGxpc3QuICovXG4gIEBJbnB1dCgpXG4gIGdldCBjb2xzKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9jb2xzOyB9XG4gIHNldCBjb2xzKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLl9jb2xzID0gTWF0aC5tYXgoMSwgTWF0aC5yb3VuZChjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSkpKTtcbiAgfVxuXG4gIC8qKiBTaXplIG9mIHRoZSBncmlkIGxpc3QncyBndXR0ZXIgaW4gcGl4ZWxzLiAqL1xuICBASW5wdXQoKVxuICBnZXQgZ3V0dGVyU2l6ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fZ3V0dGVyOyB9XG4gIHNldCBndXR0ZXJTaXplKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5fZ3V0dGVyID0gYCR7dmFsdWUgPT0gbnVsbCA/ICcnIDogdmFsdWV9YDsgfVxuXG4gIC8qKiBTZXQgaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2Ygcm93IGhlaWdodCBmcm9tIHRoZSB1c2VyLXByb3ZpZGVkIHZhbHVlLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcm93SGVpZ2h0KCk6IHN0cmluZyB8IG51bWJlciB7IHJldHVybiB0aGlzLl9yb3dIZWlnaHQ7IH1cbiAgc2V0IHJvd0hlaWdodCh2YWx1ZTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBgJHt2YWx1ZSA9PSBudWxsID8gJycgOiB2YWx1ZX1gO1xuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLl9yb3dIZWlnaHQpIHtcbiAgICAgIHRoaXMuX3Jvd0hlaWdodCA9IG5ld1ZhbHVlO1xuICAgICAgdGhpcy5fc2V0VGlsZVN0eWxlcih0aGlzLl9yb3dIZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2NoZWNrQ29scygpO1xuICAgIHRoaXMuX2NoZWNrUm93SGVpZ2h0KCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGxheW91dCBjYWxjdWxhdGlvbiBpcyBmYWlybHkgY2hlYXAgaWYgbm90aGluZyBjaGFuZ2VzLCBzbyB0aGVyZSdzIGxpdHRsZSBjb3N0XG4gICAqIHRvIHJ1biBpdCBmcmVxdWVudGx5LlxuICAgKi9cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIHRoaXMuX2xheW91dFRpbGVzKCk7XG4gIH1cblxuICAvKiogVGhyb3cgYSBmcmllbmRseSBlcnJvciBpZiBjb2xzIHByb3BlcnR5IGlzIG1pc3NpbmcgKi9cbiAgcHJpdmF0ZSBfY2hlY2tDb2xzKCkge1xuICAgIGlmICghdGhpcy5jb2xzKSB7XG4gICAgICB0aHJvdyBFcnJvcihgbWF0LWdyaWQtbGlzdDogbXVzdCBwYXNzIGluIG51bWJlciBvZiBjb2x1bW5zLiBgICtcbiAgICAgICAgICAgICAgICAgIGBFeGFtcGxlOiA8bWF0LWdyaWQtbGlzdCBjb2xzPVwiM1wiPmApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBEZWZhdWx0IHRvIGVxdWFsIHdpZHRoOmhlaWdodCBpZiByb3dIZWlnaHQgcHJvcGVydHkgaXMgbWlzc2luZyAqL1xuICBwcml2YXRlIF9jaGVja1Jvd0hlaWdodCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuX3Jvd0hlaWdodCkge1xuICAgICAgdGhpcy5fc2V0VGlsZVN0eWxlcignMToxJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENyZWF0ZXMgY29ycmVjdCBUaWxlIFN0eWxlciBzdWJ0eXBlIGJhc2VkIG9uIHJvd0hlaWdodCBwYXNzZWQgaW4gYnkgdXNlciAqL1xuICBwcml2YXRlIF9zZXRUaWxlU3R5bGVyKHJvd0hlaWdodDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3RpbGVTdHlsZXIpIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIucmVzZXQodGhpcyk7XG4gICAgfVxuXG4gICAgaWYgKHJvd0hlaWdodCA9PT0gTUFUX0ZJVF9NT0RFKSB7XG4gICAgICB0aGlzLl90aWxlU3R5bGVyID0gbmV3IEZpdFRpbGVTdHlsZXIoKTtcbiAgICB9IGVsc2UgaWYgKHJvd0hlaWdodCAmJiByb3dIZWlnaHQuaW5kZXhPZignOicpID4gLTEpIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIgPSBuZXcgUmF0aW9UaWxlU3R5bGVyKHJvd0hlaWdodCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIgPSBuZXcgRml4ZWRUaWxlU3R5bGVyKHJvd0hlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIENvbXB1dGVzIGFuZCBhcHBsaWVzIHRoZSBzaXplIGFuZCBwb3NpdGlvbiBmb3IgYWxsIGNoaWxkcmVuIGdyaWQgdGlsZXMuICovXG4gIHByaXZhdGUgX2xheW91dFRpbGVzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fdGlsZUNvb3JkaW5hdG9yKSB7XG4gICAgICB0aGlzLl90aWxlQ29vcmRpbmF0b3IgPSBuZXcgVGlsZUNvb3JkaW5hdG9yKCk7XG4gICAgfVxuXG5cbiAgICBjb25zdCB0cmFja2VyID0gdGhpcy5fdGlsZUNvb3JkaW5hdG9yO1xuICAgIGNvbnN0IHRpbGVzID0gdGhpcy5fdGlsZXMuZmlsdGVyKHRpbGUgPT4gIXRpbGUuX2dyaWRMaXN0IHx8IHRpbGUuX2dyaWRMaXN0ID09PSB0aGlzKTtcbiAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLl9kaXIgPyB0aGlzLl9kaXIudmFsdWUgOiAnbHRyJztcblxuICAgIHRoaXMuX3RpbGVDb29yZGluYXRvci51cGRhdGUodGhpcy5jb2xzLCB0aWxlcyk7XG4gICAgdGhpcy5fdGlsZVN0eWxlci5pbml0KHRoaXMuZ3V0dGVyU2l6ZSwgdHJhY2tlciwgdGhpcy5jb2xzLCBkaXJlY3Rpb24pO1xuXG4gICAgdGlsZXMuZm9yRWFjaCgodGlsZSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHBvcyA9IHRyYWNrZXIucG9zaXRpb25zW2luZGV4XTtcbiAgICAgIHRoaXMuX3RpbGVTdHlsZXIuc2V0U3R5bGUodGlsZSwgcG9zLnJvdywgcG9zLmNvbCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9zZXRMaXN0U3R5bGUodGhpcy5fdGlsZVN0eWxlci5nZXRDb21wdXRlZEhlaWdodCgpKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHN0eWxlIG9uIHRoZSBtYWluIGdyaWQtbGlzdCBlbGVtZW50LCBnaXZlbiB0aGUgc3R5bGUgbmFtZSBhbmQgdmFsdWUuICovXG4gIF9zZXRMaXN0U3R5bGUoc3R5bGU6IFtzdHJpbmcsIHN0cmluZyB8IG51bGxdIHwgbnVsbCk6IHZvaWQge1xuICAgIGlmIChzdHlsZSkge1xuICAgICAgKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZSBhcyBhbnkpW3N0eWxlWzBdXSA9IHN0eWxlWzFdO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9jb2xzOiBOdW1iZXJJbnB1dDtcbn1cbiJdfQ==
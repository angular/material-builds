/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata, __param } from "tslib";
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, Directive, ElementRef, Inject, isDevMode, QueryList, ViewEncapsulation, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
// Boilerplate for applying mixins to MatToolbar.
/** @docs-private */
class MatToolbarBase {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
const _MatToolbarMixinBase = mixinColor(MatToolbarBase);
let MatToolbarRow = /** @class */ (() => {
    let MatToolbarRow = class MatToolbarRow {
    };
    MatToolbarRow = __decorate([
        Directive({
            selector: 'mat-toolbar-row',
            exportAs: 'matToolbarRow',
            host: { 'class': 'mat-toolbar-row' },
        })
    ], MatToolbarRow);
    return MatToolbarRow;
})();
export { MatToolbarRow };
let MatToolbar = /** @class */ (() => {
    let MatToolbar = class MatToolbar extends _MatToolbarMixinBase {
        constructor(elementRef, _platform, document) {
            super(elementRef);
            this._platform = _platform;
            // TODO: make the document a required param when doing breaking changes.
            this._document = document;
        }
        ngAfterViewInit() {
            if (!isDevMode() || !this._platform.isBrowser) {
                return;
            }
            this._checkToolbarMixedModes();
            this._toolbarRows.changes.subscribe(() => this._checkToolbarMixedModes());
        }
        /**
         * Throws an exception when developers are attempting to combine the different toolbar row modes.
         */
        _checkToolbarMixedModes() {
            if (!this._toolbarRows.length) {
                return;
            }
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
    };
    __decorate([
        ContentChildren(MatToolbarRow, { descendants: true }),
        __metadata("design:type", QueryList)
    ], MatToolbar.prototype, "_toolbarRows", void 0);
    MatToolbar = __decorate([
        Component({
            selector: 'mat-toolbar',
            exportAs: 'matToolbar',
            template: "<ng-content></ng-content>\n<ng-content select=\"mat-toolbar-row\"></ng-content>\n",
            inputs: ['color'],
            host: {
                'class': 'mat-toolbar',
                '[class.mat-toolbar-multiple-rows]': '_toolbarRows.length > 0',
                '[class.mat-toolbar-single-row]': '_toolbarRows.length === 0',
            },
            changeDetection: ChangeDetectionStrategy.OnPush,
            encapsulation: ViewEncapsulation.None,
            styles: [".cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%}\n"]
        }),
        __param(2, Inject(DOCUMENT)),
        __metadata("design:paramtypes", [ElementRef,
            Platform, Object])
    ], MatToolbar);
    return MatToolbar;
})();
export { MatToolbar };
/**
 * Throws an exception when attempting to combine the different toolbar row modes.
 * @docs-private
 */
export function throwToolbarMixedModesError() {
    throw Error('MatToolbar: Attempting to combine different toolbar modes. ' +
        'Either specify multiple `<mat-toolbar-row>` elements explicitly or just place content ' +
        'inside of a `<mat-toolbar>` for a single row.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90b29sYmFyL3Rvb2xiYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBeUIsVUFBVSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFHMUUsaURBQWlEO0FBQ2pELG9CQUFvQjtBQUNwQixNQUFNLGNBQWM7SUFDbEIsWUFBbUIsV0FBdUI7UUFBdkIsZ0JBQVcsR0FBWCxXQUFXLENBQVk7SUFBRyxDQUFDO0NBQy9DO0FBQ0QsTUFBTSxvQkFBb0IsR0FBeUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBTzlGO0lBQUEsSUFBYSxhQUFhLEdBQTFCLE1BQWEsYUFBYTtLQUFHLENBQUE7SUFBaEIsYUFBYTtRQUx6QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLFFBQVEsRUFBRSxlQUFlO1lBQ3pCLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBQztTQUNuQyxDQUFDO09BQ1csYUFBYSxDQUFHO0lBQUQsb0JBQUM7S0FBQTtTQUFoQixhQUFhO0FBZ0IxQjtJQUFBLElBQWEsVUFBVSxHQUF2QixNQUFhLFVBQVcsU0FBUSxvQkFBb0I7UUFNbEQsWUFDRSxVQUFzQixFQUNkLFNBQW1CLEVBQ1QsUUFBYztZQUNoQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFGVixjQUFTLEdBQVQsU0FBUyxDQUFVO1lBSTNCLHdFQUF3RTtZQUN4RSxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUM1QixDQUFDO1FBRUQsZUFBZTtZQUNiLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO2dCQUM3QyxPQUFPO2FBQ1I7WUFFRCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBRUQ7O1dBRUc7UUFDSyx1QkFBdUI7WUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO2dCQUM3QixPQUFPO2FBQ1I7WUFFRCx1RkFBdUY7WUFDdkYsK0JBQStCO1lBQy9CLE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQWMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO2lCQUN2RixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7aUJBQy9FLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3BGLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFakUsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLDJCQUEyQixFQUFFLENBQUM7YUFDL0I7UUFDSCxDQUFDO0tBQ0YsQ0FBQTtJQXhDc0Q7UUFBcEQsZUFBZSxDQUFDLGFBQWEsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQztrQ0FBZSxTQUFTO29EQUFnQjtJQUpqRixVQUFVO1FBZHRCLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLDZGQUEyQjtZQUUzQixNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7WUFDakIsSUFBSSxFQUFFO2dCQUNKLE9BQU8sRUFBRSxhQUFhO2dCQUN0QixtQ0FBbUMsRUFBRSx5QkFBeUI7Z0JBQzlELGdDQUFnQyxFQUFFLDJCQUEyQjthQUM5RDtZQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO1lBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOztTQUN0QyxDQUFDO1FBVUcsV0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUE7eUNBRkwsVUFBVTtZQUNILFFBQVE7T0FSbEIsVUFBVSxDQTRDdEI7SUFBRCxpQkFBQztLQUFBO1NBNUNZLFVBQVU7QUE4Q3ZCOzs7R0FHRztBQUNILE1BQU0sVUFBVSwyQkFBMkI7SUFDekMsTUFBTSxLQUFLLENBQUMsNkRBQTZEO1FBQ3ZFLHdGQUF3RjtRQUN4RiwrQ0FBK0MsQ0FBQyxDQUFDO0FBQ3JELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQbGF0Zm9ybX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBpc0Rldk1vZGUsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5Db2xvciwgQ2FuQ29sb3JDdG9yLCBtaXhpbkNvbG9yfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFRvb2xiYXIuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY2xhc3MgTWF0VG9vbGJhckJhc2Uge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG59XG5jb25zdCBfTWF0VG9vbGJhck1peGluQmFzZTogQ2FuQ29sb3JDdG9yICYgdHlwZW9mIE1hdFRvb2xiYXJCYXNlID0gbWl4aW5Db2xvcihNYXRUb29sYmFyQmFzZSk7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC10b29sYmFyLXJvdycsXG4gIGV4cG9ydEFzOiAnbWF0VG9vbGJhclJvdycsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnbWF0LXRvb2xiYXItcm93J30sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRvb2xiYXJSb3cge31cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRvb2xiYXInLFxuICBleHBvcnRBczogJ21hdFRvb2xiYXInLFxuICB0ZW1wbGF0ZVVybDogJ3Rvb2xiYXIuaHRtbCcsXG4gIHN0eWxlVXJsczogWyd0b29sYmFyLmNzcyddLFxuICBpbnB1dHM6IFsnY29sb3InXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtdG9vbGJhcicsXG4gICAgJ1tjbGFzcy5tYXQtdG9vbGJhci1tdWx0aXBsZS1yb3dzXSc6ICdfdG9vbGJhclJvd3MubGVuZ3RoID4gMCcsXG4gICAgJ1tjbGFzcy5tYXQtdG9vbGJhci1zaW5nbGUtcm93XSc6ICdfdG9vbGJhclJvd3MubGVuZ3RoID09PSAwJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRvb2xiYXIgZXh0ZW5kcyBfTWF0VG9vbGJhck1peGluQmFzZSBpbXBsZW1lbnRzIENhbkNvbG9yLCBBZnRlclZpZXdJbml0IHtcbiAgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50O1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gYWxsIHRvb2xiYXIgcm93IGVsZW1lbnRzIHRoYXQgaGF2ZSBiZWVuIHByb2plY3RlZC4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRUb29sYmFyUm93LCB7ZGVzY2VuZGFudHM6IHRydWV9KSBfdG9vbGJhclJvd3M6IFF1ZXJ5TGlzdDxNYXRUb29sYmFyUm93PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBkb2N1bWVudD86IGFueSkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYpO1xuXG4gICAgLy8gVE9ETzogbWFrZSB0aGUgZG9jdW1lbnQgYSByZXF1aXJlZCBwYXJhbSB3aGVuIGRvaW5nIGJyZWFraW5nIGNoYW5nZXMuXG4gICAgdGhpcy5fZG9jdW1lbnQgPSBkb2N1bWVudDtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAoIWlzRGV2TW9kZSgpIHx8ICF0aGlzLl9wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9jaGVja1Rvb2xiYXJNaXhlZE1vZGVzKCk7XG4gICAgdGhpcy5fdG9vbGJhclJvd3MuY2hhbmdlcy5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fY2hlY2tUb29sYmFyTWl4ZWRNb2RlcygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaHJvd3MgYW4gZXhjZXB0aW9uIHdoZW4gZGV2ZWxvcGVycyBhcmUgYXR0ZW1wdGluZyB0byBjb21iaW5lIHRoZSBkaWZmZXJlbnQgdG9vbGJhciByb3cgbW9kZXMuXG4gICAqL1xuICBwcml2YXRlIF9jaGVja1Rvb2xiYXJNaXhlZE1vZGVzKCkge1xuICAgIGlmICghdGhpcy5fdG9vbGJhclJvd3MubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIGFueSBvdGhlciBET00gbm9kZXMgdGhhdCBjYW4gZGlzcGxheSBjb250ZW50IGJ1dCBhcmVuJ3QgaW5zaWRlIG9mXG4gICAgLy8gYSA8bWF0LXRvb2xiYXItcm93PiBlbGVtZW50LlxuICAgIGNvbnN0IGlzQ29tYmluZWRVc2FnZSA9IEFycmF5LmZyb208SFRNTEVsZW1lbnQ+KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzKVxuICAgICAgLmZpbHRlcihub2RlID0+ICEobm9kZS5jbGFzc0xpc3QgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ21hdC10b29sYmFyLXJvdycpKSlcbiAgICAgIC5maWx0ZXIobm9kZSA9PiBub2RlLm5vZGVUeXBlICE9PSAodGhpcy5fZG9jdW1lbnQgPyB0aGlzLl9kb2N1bWVudC5DT01NRU5UX05PREUgOiA4KSlcbiAgICAgIC5zb21lKG5vZGUgPT4gISEobm9kZS50ZXh0Q29udGVudCAmJiBub2RlLnRleHRDb250ZW50LnRyaW0oKSkpO1xuXG4gICAgaWYgKGlzQ29tYmluZWRVc2FnZSkge1xuICAgICAgdGhyb3dUb29sYmFyTWl4ZWRNb2Rlc0Vycm9yKCk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogVGhyb3dzIGFuIGV4Y2VwdGlvbiB3aGVuIGF0dGVtcHRpbmcgdG8gY29tYmluZSB0aGUgZGlmZmVyZW50IHRvb2xiYXIgcm93IG1vZGVzLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dUb29sYmFyTWl4ZWRNb2Rlc0Vycm9yKCkge1xuICB0aHJvdyBFcnJvcignTWF0VG9vbGJhcjogQXR0ZW1wdGluZyB0byBjb21iaW5lIGRpZmZlcmVudCB0b29sYmFyIG1vZGVzLiAnICtcbiAgICAnRWl0aGVyIHNwZWNpZnkgbXVsdGlwbGUgYDxtYXQtdG9vbGJhci1yb3c+YCBlbGVtZW50cyBleHBsaWNpdGx5IG9yIGp1c3QgcGxhY2UgY29udGVudCAnICtcbiAgICAnaW5zaWRlIG9mIGEgYDxtYXQtdG9vbGJhcj5gIGZvciBhIHNpbmdsZSByb3cuJyk7XG59XG4iXX0=
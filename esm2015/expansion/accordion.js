/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, ContentChildren, QueryList } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkAccordion } from '@angular/cdk/accordion';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { HOME, END, hasModifierKey } from '@angular/cdk/keycodes';
import { startWith } from 'rxjs/operators';
import { MAT_ACCORDION } from './accordion-base';
import { MatExpansionPanelHeader } from './expansion-panel-header';
/**
 * Directive for a Material Design Accordion.
 */
export class MatAccordion extends CdkAccordion {
    constructor() {
        super(...arguments);
        /**
         * Headers belonging to this accordion.
         */
        this._ownHeaders = new QueryList();
        this._hideToggle = false;
        /**
         * Display mode used for all expansion panels in the accordion. Currently two display
         * modes exist:
         *  default - a gutter-like spacing is placed around any expanded panel, placing the expanded
         *     panel at a different elevation from the rest of the accordion.
         *  flat - no spacing is placed around expanded panels, showing all panels at the same
         *     elevation.
         */
        this.displayMode = 'default';
        /**
         * The position of the expansion indicator.
         */
        this.togglePosition = 'after';
    }
    /**
     * Whether the expansion indicator should be hidden.
     * @return {?}
     */
    get hideToggle() { return this._hideToggle; }
    /**
     * @param {?} show
     * @return {?}
     */
    set hideToggle(show) { this._hideToggle = coerceBooleanProperty(show); }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._headers.changes
            .pipe(startWith(this._headers))
            .subscribe((/**
         * @param {?} headers
         * @return {?}
         */
        (headers) => {
            this._ownHeaders.reset(headers.filter((/**
             * @param {?} header
             * @return {?}
             */
            header => header.panel.accordion === this)));
            this._ownHeaders.notifyOnChanges();
        }));
        this._keyManager = new FocusKeyManager(this._ownHeaders).withWrap();
    }
    /**
     * Handles keyboard events coming in from the panel headers.
     * @param {?} event
     * @return {?}
     */
    _handleHeaderKeydown(event) {
        const { keyCode } = event;
        /** @type {?} */
        const manager = this._keyManager;
        if (keyCode === HOME) {
            if (!hasModifierKey(event)) {
                manager.setFirstItemActive();
                event.preventDefault();
            }
        }
        else if (keyCode === END) {
            if (!hasModifierKey(event)) {
                manager.setLastItemActive();
                event.preventDefault();
            }
        }
        else {
            this._keyManager.onKeydown(event);
        }
    }
    /**
     * @param {?} header
     * @return {?}
     */
    _handleHeaderFocus(header) {
        this._keyManager.updateActiveItem(header);
    }
}
MatAccordion.decorators = [
    { type: Directive, args: [{
                selector: 'mat-accordion',
                exportAs: 'matAccordion',
                inputs: ['multi'],
                providers: [{
                        provide: MAT_ACCORDION,
                        useExisting: MatAccordion
                    }],
                host: {
                    class: 'mat-accordion'
                }
            },] }
];
MatAccordion.propDecorators = {
    _headers: [{ type: ContentChildren, args: [MatExpansionPanelHeader, { descendants: true },] }],
    hideToggle: [{ type: Input }],
    displayMode: [{ type: Input }],
    togglePosition: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    MatAccordion.ngAcceptInputType_hideToggle;
    /** @type {?} */
    MatAccordion.ngAcceptInputType_multi;
    /**
     * @type {?}
     * @private
     */
    MatAccordion.prototype._keyManager;
    /**
     * Headers belonging to this accordion.
     * @type {?}
     * @private
     */
    MatAccordion.prototype._ownHeaders;
    /**
     * All headers inside the accordion. Includes headers inside nested accordions.
     * @type {?}
     */
    MatAccordion.prototype._headers;
    /**
     * @type {?}
     * @private
     */
    MatAccordion.prototype._hideToggle;
    /**
     * Display mode used for all expansion panels in the accordion. Currently two display
     * modes exist:
     *  default - a gutter-like spacing is placed around any expanded panel, placing the expanded
     *     panel at a different elevation from the rest of the accordion.
     *  flat - no spacing is placed around expanded panels, showing all panels at the same
     *     elevation.
     * @type {?}
     */
    MatAccordion.prototype.displayMode;
    /**
     * The position of the expansion indicator.
     * @type {?}
     */
    MatAccordion.prototype.togglePosition;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2V4cGFuc2lvbi9hY2NvcmRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsU0FBUyxFQUFtQixNQUFNLGVBQWUsQ0FBQztBQUM3RixPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDcEQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsYUFBYSxFQUlkLE1BQU0sa0JBQWtCLENBQUM7QUFDMUIsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sMEJBQTBCLENBQUM7Ozs7QUFpQmpFLE1BQU0sT0FBTyxZQUFhLFNBQVEsWUFBWTtJQVo5Qzs7Ozs7UUFnQlUsZ0JBQVcsR0FBRyxJQUFJLFNBQVMsRUFBMkIsQ0FBQztRQVV2RCxnQkFBVyxHQUFZLEtBQUssQ0FBQzs7Ozs7Ozs7O1FBVTVCLGdCQUFXLEdBQTRCLFNBQVMsQ0FBQzs7OztRQUdqRCxtQkFBYyxHQUErQixPQUFPLENBQUM7SUF1Q2hFLENBQUM7Ozs7O0lBdkRDLElBQ0ksVUFBVSxLQUFjLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ3RELElBQUksVUFBVSxDQUFDLElBQWEsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7OztJQWdCakYsa0JBQWtCO1FBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTzthQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM5QixTQUFTOzs7O1FBQUMsQ0FBQyxPQUEyQyxFQUFFLEVBQUU7WUFDekQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU07Ozs7WUFBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxLQUFLLElBQUksRUFBQyxDQUFDLENBQUM7WUFDbEYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUNyQyxDQUFDLEVBQUMsQ0FBQztRQUVMLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3RFLENBQUM7Ozs7OztJQUdELG9CQUFvQixDQUFDLEtBQW9CO2NBQ2pDLEVBQUMsT0FBTyxFQUFDLEdBQUcsS0FBSzs7Y0FDakIsT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXO1FBRWhDLElBQUksT0FBTyxLQUFLLElBQUksRUFBRTtZQUNwQixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUMxQixPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztnQkFDN0IsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQ3hCO1NBQ0Y7YUFBTSxJQUFJLE9BQU8sS0FBSyxHQUFHLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDMUIsT0FBTyxDQUFDLGlCQUFpQixFQUFFLENBQUM7Z0JBQzVCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN4QjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7Ozs7O0lBRUQsa0JBQWtCLENBQUMsTUFBK0I7UUFDaEQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QyxDQUFDOzs7WUExRUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixRQUFRLEVBQUUsY0FBYztnQkFDeEIsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDO2dCQUNqQixTQUFTLEVBQUUsQ0FBQzt3QkFDVixPQUFPLEVBQUUsYUFBYTt3QkFDdEIsV0FBVyxFQUFFLFlBQVk7cUJBQzFCLENBQUM7Z0JBQ0YsSUFBSSxFQUFFO29CQUNKLEtBQUssRUFBRSxlQUFlO2lCQUN2QjthQUNGOzs7dUJBUUUsZUFBZSxTQUFDLHVCQUF1QixFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzt5QkFJNUQsS0FBSzswQkFhTCxLQUFLOzZCQUdMLEtBQUs7Ozs7SUFxQ04sMENBQXlFOztJQUN6RSxxQ0FBb0U7Ozs7O0lBaEVwRSxtQ0FBOEQ7Ozs7OztJQUc5RCxtQ0FBK0Q7Ozs7O0lBRy9ELGdDQUM2Qzs7Ozs7SUFNN0MsbUNBQXFDOzs7Ozs7Ozs7O0lBVXJDLG1DQUEwRDs7Ozs7SUFHMUQsc0NBQThEIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dCwgQ29udGVudENoaWxkcmVuLCBRdWVyeUxpc3QsIEFmdGVyQ29udGVudEluaXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0Nka0FjY29yZGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2FjY29yZGlvbic7XG5pbXBvcnQge0ZvY3VzS2V5TWFuYWdlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtIT01FLCBFTkQsIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtzdGFydFdpdGh9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7XG4gIE1BVF9BQ0NPUkRJT04sXG4gIE1hdEFjY29yZGlvbkJhc2UsXG4gIE1hdEFjY29yZGlvbkRpc3BsYXlNb2RlLFxuICBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvblxufSBmcm9tICcuL2FjY29yZGlvbi1iYXNlJztcbmltcG9ydCB7TWF0RXhwYW5zaW9uUGFuZWxIZWFkZXJ9IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsLWhlYWRlcic7XG5cbi8qKlxuICogRGlyZWN0aXZlIGZvciBhIE1hdGVyaWFsIERlc2lnbiBBY2NvcmRpb24uXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1hY2NvcmRpb24nLFxuICBleHBvcnRBczogJ21hdEFjY29yZGlvbicsXG4gIGlucHV0czogWydtdWx0aSddLFxuICBwcm92aWRlcnM6IFt7XG4gICAgcHJvdmlkZTogTUFUX0FDQ09SRElPTixcbiAgICB1c2VFeGlzdGluZzogTWF0QWNjb3JkaW9uXG4gIH1dLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtYXQtYWNjb3JkaW9uJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE1hdEFjY29yZGlvbiBleHRlbmRzIENka0FjY29yZGlvbiBpbXBsZW1lbnRzIE1hdEFjY29yZGlvbkJhc2UsIEFmdGVyQ29udGVudEluaXQge1xuICBwcml2YXRlIF9rZXlNYW5hZ2VyOiBGb2N1c0tleU1hbmFnZXI8TWF0RXhwYW5zaW9uUGFuZWxIZWFkZXI+O1xuXG4gIC8qKiBIZWFkZXJzIGJlbG9uZ2luZyB0byB0aGlzIGFjY29yZGlvbi4gKi9cbiAgcHJpdmF0ZSBfb3duSGVhZGVycyA9IG5ldyBRdWVyeUxpc3Q8TWF0RXhwYW5zaW9uUGFuZWxIZWFkZXI+KCk7XG5cbiAgLyoqIEFsbCBoZWFkZXJzIGluc2lkZSB0aGUgYWNjb3JkaW9uLiBJbmNsdWRlcyBoZWFkZXJzIGluc2lkZSBuZXN0ZWQgYWNjb3JkaW9ucy4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRFeHBhbnNpb25QYW5lbEhlYWRlciwge2Rlc2NlbmRhbnRzOiB0cnVlfSlcbiAgX2hlYWRlcnM6IFF1ZXJ5TGlzdDxNYXRFeHBhbnNpb25QYW5lbEhlYWRlcj47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGV4cGFuc2lvbiBpbmRpY2F0b3Igc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpZGVUb2dnbGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9oaWRlVG9nZ2xlOyB9XG4gIHNldCBoaWRlVG9nZ2xlKHNob3c6IGJvb2xlYW4pIHsgdGhpcy5faGlkZVRvZ2dsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShzaG93KTsgfVxuICBwcml2YXRlIF9oaWRlVG9nZ2xlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgbW9kZSB1c2VkIGZvciBhbGwgZXhwYW5zaW9uIHBhbmVscyBpbiB0aGUgYWNjb3JkaW9uLiBDdXJyZW50bHkgdHdvIGRpc3BsYXlcbiAgICogbW9kZXMgZXhpc3Q6XG4gICAqICBkZWZhdWx0IC0gYSBndXR0ZXItbGlrZSBzcGFjaW5nIGlzIHBsYWNlZCBhcm91bmQgYW55IGV4cGFuZGVkIHBhbmVsLCBwbGFjaW5nIHRoZSBleHBhbmRlZFxuICAgKiAgICAgcGFuZWwgYXQgYSBkaWZmZXJlbnQgZWxldmF0aW9uIGZyb20gdGhlIHJlc3Qgb2YgdGhlIGFjY29yZGlvbi5cbiAgICogIGZsYXQgLSBubyBzcGFjaW5nIGlzIHBsYWNlZCBhcm91bmQgZXhwYW5kZWQgcGFuZWxzLCBzaG93aW5nIGFsbCBwYW5lbHMgYXQgdGhlIHNhbWVcbiAgICogICAgIGVsZXZhdGlvbi5cbiAgICovXG4gIEBJbnB1dCgpIGRpc3BsYXlNb2RlOiBNYXRBY2NvcmRpb25EaXNwbGF5TW9kZSA9ICdkZWZhdWx0JztcblxuICAvKiogVGhlIHBvc2l0aW9uIG9mIHRoZSBleHBhbnNpb24gaW5kaWNhdG9yLiAqL1xuICBASW5wdXQoKSB0b2dnbGVQb3NpdGlvbjogTWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb24gPSAnYWZ0ZXInO1xuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9oZWFkZXJzLmNoYW5nZXNcbiAgICAgIC5waXBlKHN0YXJ0V2l0aCh0aGlzLl9oZWFkZXJzKSlcbiAgICAgIC5zdWJzY3JpYmUoKGhlYWRlcnM6IFF1ZXJ5TGlzdDxNYXRFeHBhbnNpb25QYW5lbEhlYWRlcj4pID0+IHtcbiAgICAgICAgdGhpcy5fb3duSGVhZGVycy5yZXNldChoZWFkZXJzLmZpbHRlcihoZWFkZXIgPT4gaGVhZGVyLnBhbmVsLmFjY29yZGlvbiA9PT0gdGhpcykpO1xuICAgICAgICB0aGlzLl9vd25IZWFkZXJzLm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcih0aGlzLl9vd25IZWFkZXJzKS53aXRoV3JhcCgpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMga2V5Ym9hcmQgZXZlbnRzIGNvbWluZyBpbiBmcm9tIHRoZSBwYW5lbCBoZWFkZXJzLiAqL1xuICBfaGFuZGxlSGVhZGVyS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGNvbnN0IHtrZXlDb2RlfSA9IGV2ZW50O1xuICAgIGNvbnN0IG1hbmFnZXIgPSB0aGlzLl9rZXlNYW5hZ2VyO1xuXG4gICAgaWYgKGtleUNvZGUgPT09IEhPTUUpIHtcbiAgICAgIGlmICghaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgIG1hbmFnZXIuc2V0Rmlyc3RJdGVtQWN0aXZlKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChrZXlDb2RlID09PSBFTkQpIHtcbiAgICAgIGlmICghaGFzTW9kaWZpZXJLZXkoZXZlbnQpKSB7XG4gICAgICAgIG1hbmFnZXIuc2V0TGFzdEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fa2V5TWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIF9oYW5kbGVIZWFkZXJGb2N1cyhoZWFkZXI6IE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKGhlYWRlcik7XG4gIH1cblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfaGlkZVRvZ2dsZTogYm9vbGVhbiB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9tdWx0aTogYm9vbGVhbiB8IHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ7XG59XG4iXX0=
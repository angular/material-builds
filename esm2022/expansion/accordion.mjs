/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, ContentChildren, QueryList, } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkAccordion } from '@angular/cdk/accordion';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { startWith } from 'rxjs/operators';
import { MAT_ACCORDION, } from './accordion-base';
import { MatExpansionPanelHeader } from './expansion-panel-header';
import * as i0 from "@angular/core";
/**
 * Directive for a Material Design Accordion.
 */
export class MatAccordion extends CdkAccordion {
    constructor() {
        super(...arguments);
        /** Headers belonging to this accordion. */
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
        /** The position of the expansion indicator. */
        this.togglePosition = 'after';
    }
    /** Whether the expansion indicator should be hidden. */
    get hideToggle() {
        return this._hideToggle;
    }
    set hideToggle(show) {
        this._hideToggle = coerceBooleanProperty(show);
    }
    ngAfterContentInit() {
        this._headers.changes
            .pipe(startWith(this._headers))
            .subscribe((headers) => {
            this._ownHeaders.reset(headers.filter(header => header.panel.accordion === this));
            this._ownHeaders.notifyOnChanges();
        });
        this._keyManager = new FocusKeyManager(this._ownHeaders).withWrap().withHomeAndEnd();
    }
    /** Handles keyboard events coming in from the panel headers. */
    _handleHeaderKeydown(event) {
        this._keyManager.onKeydown(event);
    }
    _handleHeaderFocus(header) {
        this._keyManager.updateActiveItem(header);
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this._keyManager?.destroy();
        this._ownHeaders.destroy();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatAccordion, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.4", type: MatAccordion, selector: "mat-accordion", inputs: { multi: "multi", hideToggle: "hideToggle", displayMode: "displayMode", togglePosition: "togglePosition" }, host: { properties: { "class.mat-accordion-multi": "this.multi" }, classAttribute: "mat-accordion" }, providers: [
            {
                provide: MAT_ACCORDION,
                useExisting: MatAccordion,
            },
        ], queries: [{ propertyName: "_headers", predicate: MatExpansionPanelHeader, descendants: true }], exportAs: ["matAccordion"], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatAccordion, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-accordion',
                    exportAs: 'matAccordion',
                    inputs: ['multi'],
                    providers: [
                        {
                            provide: MAT_ACCORDION,
                            useExisting: MatAccordion,
                        },
                    ],
                    host: {
                        class: 'mat-accordion',
                        // Class binding which is only used by the test harness as there is no other
                        // way for the harness to detect if multiple panel support is enabled.
                        '[class.mat-accordion-multi]': 'this.multi',
                    },
                }]
        }], propDecorators: { _headers: [{
                type: ContentChildren,
                args: [MatExpansionPanelHeader, { descendants: true }]
            }], hideToggle: [{
                type: Input
            }], displayMode: [{
                type: Input
            }], togglePosition: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2V4cGFuc2lvbi9hY2NvcmRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsZUFBZSxFQUNmLFNBQVMsR0FHVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQWUscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDcEQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQ0wsYUFBYSxHQUlkLE1BQU0sa0JBQWtCLENBQUM7QUFDMUIsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sMEJBQTBCLENBQUM7O0FBRWpFOztHQUVHO0FBa0JILE1BQU0sT0FBTyxZQUNYLFNBQVEsWUFBWTtJQWxCdEI7O1FBdUJFLDJDQUEyQztRQUNuQyxnQkFBVyxHQUFHLElBQUksU0FBUyxFQUEyQixDQUFDO1FBY3ZELGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBRXJDOzs7Ozs7O1dBT0c7UUFDTSxnQkFBVyxHQUE0QixTQUFTLENBQUM7UUFFMUQsK0NBQStDO1FBQ3RDLG1CQUFjLEdBQStCLE9BQU8sQ0FBQztLQTJCL0Q7SUFoREMsd0RBQXdEO0lBQ3hELElBQ0ksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBQ0QsSUFBSSxVQUFVLENBQUMsSUFBa0I7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBZ0JELGtCQUFrQjtRQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU87YUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDOUIsU0FBUyxDQUFDLENBQUMsT0FBMkMsRUFBRSxFQUFFO1lBQ3pELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFFTCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN2RixDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLG9CQUFvQixDQUFDLEtBQW9CO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxNQUErQjtRQUNoRCxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFUSxXQUFXO1FBQ2xCLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQzs4R0E1RFUsWUFBWTtrR0FBWixZQUFZLGtRQWJaO1lBQ1Q7Z0JBQ0UsT0FBTyxFQUFFLGFBQWE7Z0JBQ3RCLFdBQVcsRUFBRSxZQUFZO2FBQzFCO1NBQ0YsbURBa0JnQix1QkFBdUI7OzJGQVY3QixZQUFZO2tCQWpCeEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztvQkFDakIsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxhQUFhOzRCQUN0QixXQUFXLGNBQWM7eUJBQzFCO3FCQUNGO29CQUNELElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsZUFBZTt3QkFDdEIsNEVBQTRFO3dCQUM1RSxzRUFBc0U7d0JBQ3RFLDZCQUE2QixFQUFFLFlBQVk7cUJBQzVDO2lCQUNGOzhCQVlDLFFBQVE7c0JBRFAsZUFBZTt1QkFBQyx1QkFBdUIsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7Z0JBS3pELFVBQVU7c0JBRGIsS0FBSztnQkFpQkcsV0FBVztzQkFBbkIsS0FBSztnQkFHRyxjQUFjO3NCQUF0QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgUXVlcnlMaXN0LFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBPbkRlc3Ryb3ksXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Q2RrQWNjb3JkaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYWNjb3JkaW9uJztcbmltcG9ydCB7Rm9jdXNLZXlNYW5hZ2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge3N0YXJ0V2l0aH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgTUFUX0FDQ09SRElPTixcbiAgTWF0QWNjb3JkaW9uQmFzZSxcbiAgTWF0QWNjb3JkaW9uRGlzcGxheU1vZGUsXG4gIE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uLFxufSBmcm9tICcuL2FjY29yZGlvbi1iYXNlJztcbmltcG9ydCB7TWF0RXhwYW5zaW9uUGFuZWxIZWFkZXJ9IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsLWhlYWRlcic7XG5cbi8qKlxuICogRGlyZWN0aXZlIGZvciBhIE1hdGVyaWFsIERlc2lnbiBBY2NvcmRpb24uXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1hY2NvcmRpb24nLFxuICBleHBvcnRBczogJ21hdEFjY29yZGlvbicsXG4gIGlucHV0czogWydtdWx0aSddLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBNQVRfQUNDT1JESU9OLFxuICAgICAgdXNlRXhpc3Rpbmc6IE1hdEFjY29yZGlvbixcbiAgICB9LFxuICBdLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtYXQtYWNjb3JkaW9uJyxcbiAgICAvLyBDbGFzcyBiaW5kaW5nIHdoaWNoIGlzIG9ubHkgdXNlZCBieSB0aGUgdGVzdCBoYXJuZXNzIGFzIHRoZXJlIGlzIG5vIG90aGVyXG4gICAgLy8gd2F5IGZvciB0aGUgaGFybmVzcyB0byBkZXRlY3QgaWYgbXVsdGlwbGUgcGFuZWwgc3VwcG9ydCBpcyBlbmFibGVkLlxuICAgICdbY2xhc3MubWF0LWFjY29yZGlvbi1tdWx0aV0nOiAndGhpcy5tdWx0aScsXG4gIH0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEFjY29yZGlvblxuICBleHRlbmRzIENka0FjY29yZGlvblxuICBpbXBsZW1lbnRzIE1hdEFjY29yZGlvbkJhc2UsIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveVxue1xuICBwcml2YXRlIF9rZXlNYW5hZ2VyOiBGb2N1c0tleU1hbmFnZXI8TWF0RXhwYW5zaW9uUGFuZWxIZWFkZXI+O1xuXG4gIC8qKiBIZWFkZXJzIGJlbG9uZ2luZyB0byB0aGlzIGFjY29yZGlvbi4gKi9cbiAgcHJpdmF0ZSBfb3duSGVhZGVycyA9IG5ldyBRdWVyeUxpc3Q8TWF0RXhwYW5zaW9uUGFuZWxIZWFkZXI+KCk7XG5cbiAgLyoqIEFsbCBoZWFkZXJzIGluc2lkZSB0aGUgYWNjb3JkaW9uLiBJbmNsdWRlcyBoZWFkZXJzIGluc2lkZSBuZXN0ZWQgYWNjb3JkaW9ucy4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRFeHBhbnNpb25QYW5lbEhlYWRlciwge2Rlc2NlbmRhbnRzOiB0cnVlfSlcbiAgX2hlYWRlcnM6IFF1ZXJ5TGlzdDxNYXRFeHBhbnNpb25QYW5lbEhlYWRlcj47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGV4cGFuc2lvbiBpbmRpY2F0b3Igc2hvdWxkIGJlIGhpZGRlbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpZGVUb2dnbGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hpZGVUb2dnbGU7XG4gIH1cbiAgc2V0IGhpZGVUb2dnbGUoc2hvdzogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5faGlkZVRvZ2dsZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShzaG93KTtcbiAgfVxuICBwcml2YXRlIF9oaWRlVG9nZ2xlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgbW9kZSB1c2VkIGZvciBhbGwgZXhwYW5zaW9uIHBhbmVscyBpbiB0aGUgYWNjb3JkaW9uLiBDdXJyZW50bHkgdHdvIGRpc3BsYXlcbiAgICogbW9kZXMgZXhpc3Q6XG4gICAqICBkZWZhdWx0IC0gYSBndXR0ZXItbGlrZSBzcGFjaW5nIGlzIHBsYWNlZCBhcm91bmQgYW55IGV4cGFuZGVkIHBhbmVsLCBwbGFjaW5nIHRoZSBleHBhbmRlZFxuICAgKiAgICAgcGFuZWwgYXQgYSBkaWZmZXJlbnQgZWxldmF0aW9uIGZyb20gdGhlIHJlc3Qgb2YgdGhlIGFjY29yZGlvbi5cbiAgICogIGZsYXQgLSBubyBzcGFjaW5nIGlzIHBsYWNlZCBhcm91bmQgZXhwYW5kZWQgcGFuZWxzLCBzaG93aW5nIGFsbCBwYW5lbHMgYXQgdGhlIHNhbWVcbiAgICogICAgIGVsZXZhdGlvbi5cbiAgICovXG4gIEBJbnB1dCgpIGRpc3BsYXlNb2RlOiBNYXRBY2NvcmRpb25EaXNwbGF5TW9kZSA9ICdkZWZhdWx0JztcblxuICAvKiogVGhlIHBvc2l0aW9uIG9mIHRoZSBleHBhbnNpb24gaW5kaWNhdG9yLiAqL1xuICBASW5wdXQoKSB0b2dnbGVQb3NpdGlvbjogTWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb24gPSAnYWZ0ZXInO1xuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9oZWFkZXJzLmNoYW5nZXNcbiAgICAgIC5waXBlKHN0YXJ0V2l0aCh0aGlzLl9oZWFkZXJzKSlcbiAgICAgIC5zdWJzY3JpYmUoKGhlYWRlcnM6IFF1ZXJ5TGlzdDxNYXRFeHBhbnNpb25QYW5lbEhlYWRlcj4pID0+IHtcbiAgICAgICAgdGhpcy5fb3duSGVhZGVycy5yZXNldChoZWFkZXJzLmZpbHRlcihoZWFkZXIgPT4gaGVhZGVyLnBhbmVsLmFjY29yZGlvbiA9PT0gdGhpcykpO1xuICAgICAgICB0aGlzLl9vd25IZWFkZXJzLm5vdGlmeU9uQ2hhbmdlcygpO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcih0aGlzLl9vd25IZWFkZXJzKS53aXRoV3JhcCgpLndpdGhIb21lQW5kRW5kKCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlib2FyZCBldmVudHMgY29taW5nIGluIGZyb20gdGhlIHBhbmVsIGhlYWRlcnMuICovXG4gIF9oYW5kbGVIZWFkZXJLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICB9XG5cbiAgX2hhbmRsZUhlYWRlckZvY3VzKGhlYWRlcjogTWF0RXhwYW5zaW9uUGFuZWxIZWFkZXIpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oaGVhZGVyKTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5nT25EZXN0cm95KCkge1xuICAgIHN1cGVyLm5nT25EZXN0cm95KCk7XG4gICAgdGhpcy5fa2V5TWFuYWdlcj8uZGVzdHJveSgpO1xuICAgIHRoaXMuX293bkhlYWRlcnMuZGVzdHJveSgpO1xuICB9XG59XG4iXX0=
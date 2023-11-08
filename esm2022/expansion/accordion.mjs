/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, ContentChildren, QueryList, booleanAttribute, } from '@angular/core';
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
        /** Whether the expansion indicator should be hidden. */
        this.hideToggle = false;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatAccordion, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.0.0", type: MatAccordion, selector: "mat-accordion", inputs: { multi: "multi", hideToggle: ["hideToggle", "hideToggle", booleanAttribute], displayMode: "displayMode", togglePosition: "togglePosition" }, host: { properties: { "class.mat-accordion-multi": "this.multi" }, classAttribute: "mat-accordion" }, providers: [
            {
                provide: MAT_ACCORDION,
                useExisting: MatAccordion,
            },
        ], queries: [{ propertyName: "_headers", predicate: MatExpansionPanelHeader, descendants: true }], exportAs: ["matAccordion"], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0", ngImport: i0, type: MatAccordion, decorators: [{
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
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], displayMode: [{
                type: Input
            }], togglePosition: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2V4cGFuc2lvbi9hY2NvcmRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBQ0wsZUFBZSxFQUNmLFNBQVMsRUFHVCxnQkFBZ0IsR0FDakIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3BELE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUNMLGFBQWEsR0FJZCxNQUFNLGtCQUFrQixDQUFDO0FBQzFCLE9BQU8sRUFBQyx1QkFBdUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDOztBQUVqRTs7R0FFRztBQWtCSCxNQUFNLE9BQU8sWUFDWCxTQUFRLFlBQVk7SUFsQnRCOztRQXVCRSwyQ0FBMkM7UUFDbkMsZ0JBQVcsR0FBRyxJQUFJLFNBQVMsRUFBMkIsQ0FBQztRQU0vRCx3REFBd0Q7UUFFeEQsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUU1Qjs7Ozs7OztXQU9HO1FBQ00sZ0JBQVcsR0FBNEIsU0FBUyxDQUFDO1FBRTFELCtDQUErQztRQUN0QyxtQkFBYyxHQUErQixPQUFPLENBQUM7S0EyQi9EO0lBekJDLGtCQUFrQjtRQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU87YUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDOUIsU0FBUyxDQUFDLENBQUMsT0FBMkMsRUFBRSxFQUFFO1lBQ3pELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFFTCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN2RixDQUFDO0lBRUQsZ0VBQWdFO0lBQ2hFLG9CQUFvQixDQUFDLEtBQW9CO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxNQUErQjtRQUNoRCxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFUSxXQUFXO1FBQ2xCLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwQixJQUFJLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQzs4R0F0RFUsWUFBWTtrR0FBWixZQUFZLGdHQWNKLGdCQUFnQixvTEEzQnhCO1lBQ1Q7Z0JBQ0UsT0FBTyxFQUFFLGFBQWE7Z0JBQ3RCLFdBQVcsRUFBRSxZQUFZO2FBQzFCO1NBQ0YsbURBa0JnQix1QkFBdUI7OzJGQVY3QixZQUFZO2tCQWpCeEIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQztvQkFDakIsU0FBUyxFQUFFO3dCQUNUOzRCQUNFLE9BQU8sRUFBRSxhQUFhOzRCQUN0QixXQUFXLGNBQWM7eUJBQzFCO3FCQUNGO29CQUNELElBQUksRUFBRTt3QkFDSixLQUFLLEVBQUUsZUFBZTt3QkFDdEIsNEVBQTRFO3dCQUM1RSxzRUFBc0U7d0JBQ3RFLDZCQUE2QixFQUFFLFlBQVk7cUJBQzVDO2lCQUNGOzhCQVlDLFFBQVE7c0JBRFAsZUFBZTt1QkFBQyx1QkFBdUIsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7Z0JBSzdELFVBQVU7c0JBRFQsS0FBSzt1QkFBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQztnQkFXM0IsV0FBVztzQkFBbkIsS0FBSztnQkFHRyxjQUFjO3NCQUF0QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgUXVlcnlMaXN0LFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBPbkRlc3Ryb3ksXG4gIGJvb2xlYW5BdHRyaWJ1dGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDZGtBY2NvcmRpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9hY2NvcmRpb24nO1xuaW1wb3J0IHtGb2N1c0tleU1hbmFnZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7c3RhcnRXaXRofSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1xuICBNQVRfQUNDT1JESU9OLFxuICBNYXRBY2NvcmRpb25CYXNlLFxuICBNYXRBY2NvcmRpb25EaXNwbGF5TW9kZSxcbiAgTWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb24sXG59IGZyb20gJy4vYWNjb3JkaW9uLWJhc2UnO1xuaW1wb3J0IHtNYXRFeHBhbnNpb25QYW5lbEhlYWRlcn0gZnJvbSAnLi9leHBhbnNpb24tcGFuZWwtaGVhZGVyJztcblxuLyoqXG4gKiBEaXJlY3RpdmUgZm9yIGEgTWF0ZXJpYWwgRGVzaWduIEFjY29yZGlvbi5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LWFjY29yZGlvbicsXG4gIGV4cG9ydEFzOiAnbWF0QWNjb3JkaW9uJyxcbiAgaW5wdXRzOiBbJ211bHRpJ10sXG4gIHByb3ZpZGVyczogW1xuICAgIHtcbiAgICAgIHByb3ZpZGU6IE1BVF9BQ0NPUkRJT04sXG4gICAgICB1c2VFeGlzdGluZzogTWF0QWNjb3JkaW9uLFxuICAgIH0sXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ21hdC1hY2NvcmRpb24nLFxuICAgIC8vIENsYXNzIGJpbmRpbmcgd2hpY2ggaXMgb25seSB1c2VkIGJ5IHRoZSB0ZXN0IGhhcm5lc3MgYXMgdGhlcmUgaXMgbm8gb3RoZXJcbiAgICAvLyB3YXkgZm9yIHRoZSBoYXJuZXNzIHRvIGRldGVjdCBpZiBtdWx0aXBsZSBwYW5lbCBzdXBwb3J0IGlzIGVuYWJsZWQuXG4gICAgJ1tjbGFzcy5tYXQtYWNjb3JkaW9uLW11bHRpXSc6ICd0aGlzLm11bHRpJyxcbiAgfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QWNjb3JkaW9uXG4gIGV4dGVuZHMgQ2RrQWNjb3JkaW9uXG4gIGltcGxlbWVudHMgTWF0QWNjb3JkaW9uQmFzZSwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95XG57XG4gIHByaXZhdGUgX2tleU1hbmFnZXI6IEZvY3VzS2V5TWFuYWdlcjxNYXRFeHBhbnNpb25QYW5lbEhlYWRlcj47XG5cbiAgLyoqIEhlYWRlcnMgYmVsb25naW5nIHRvIHRoaXMgYWNjb3JkaW9uLiAqL1xuICBwcml2YXRlIF9vd25IZWFkZXJzID0gbmV3IFF1ZXJ5TGlzdDxNYXRFeHBhbnNpb25QYW5lbEhlYWRlcj4oKTtcblxuICAvKiogQWxsIGhlYWRlcnMgaW5zaWRlIHRoZSBhY2NvcmRpb24uIEluY2x1ZGVzIGhlYWRlcnMgaW5zaWRlIG5lc3RlZCBhY2NvcmRpb25zLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyLCB7ZGVzY2VuZGFudHM6IHRydWV9KVxuICBfaGVhZGVyczogUXVlcnlMaXN0PE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyPjtcblxuICAvKiogV2hldGhlciB0aGUgZXhwYW5zaW9uIGluZGljYXRvciBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBASW5wdXQoe3RyYW5zZm9ybTogYm9vbGVhbkF0dHJpYnV0ZX0pXG4gIGhpZGVUb2dnbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogRGlzcGxheSBtb2RlIHVzZWQgZm9yIGFsbCBleHBhbnNpb24gcGFuZWxzIGluIHRoZSBhY2NvcmRpb24uIEN1cnJlbnRseSB0d28gZGlzcGxheVxuICAgKiBtb2RlcyBleGlzdDpcbiAgICogIGRlZmF1bHQgLSBhIGd1dHRlci1saWtlIHNwYWNpbmcgaXMgcGxhY2VkIGFyb3VuZCBhbnkgZXhwYW5kZWQgcGFuZWwsIHBsYWNpbmcgdGhlIGV4cGFuZGVkXG4gICAqICAgICBwYW5lbCBhdCBhIGRpZmZlcmVudCBlbGV2YXRpb24gZnJvbSB0aGUgcmVzdCBvZiB0aGUgYWNjb3JkaW9uLlxuICAgKiAgZmxhdCAtIG5vIHNwYWNpbmcgaXMgcGxhY2VkIGFyb3VuZCBleHBhbmRlZCBwYW5lbHMsIHNob3dpbmcgYWxsIHBhbmVscyBhdCB0aGUgc2FtZVxuICAgKiAgICAgZWxldmF0aW9uLlxuICAgKi9cbiAgQElucHV0KCkgZGlzcGxheU1vZGU6IE1hdEFjY29yZGlvbkRpc3BsYXlNb2RlID0gJ2RlZmF1bHQnO1xuXG4gIC8qKiBUaGUgcG9zaXRpb24gb2YgdGhlIGV4cGFuc2lvbiBpbmRpY2F0b3IuICovXG4gIEBJbnB1dCgpIHRvZ2dsZVBvc2l0aW9uOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbiA9ICdhZnRlcic7XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2hlYWRlcnMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2hlYWRlcnMpKVxuICAgICAgLnN1YnNjcmliZSgoaGVhZGVyczogUXVlcnlMaXN0PE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyPikgPT4ge1xuICAgICAgICB0aGlzLl9vd25IZWFkZXJzLnJlc2V0KGhlYWRlcnMuZmlsdGVyKGhlYWRlciA9PiBoZWFkZXIucGFuZWwuYWNjb3JkaW9uID09PSB0aGlzKSk7XG4gICAgICAgIHRoaXMuX293bkhlYWRlcnMubm90aWZ5T25DaGFuZ2VzKCk7XG4gICAgICB9KTtcblxuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgRm9jdXNLZXlNYW5hZ2VyKHRoaXMuX293bkhlYWRlcnMpLndpdGhXcmFwKCkud2l0aEhvbWVBbmRFbmQoKTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyBjb21pbmcgaW4gZnJvbSB0aGUgcGFuZWwgaGVhZGVycy4gKi9cbiAgX2hhbmRsZUhlYWRlcktleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gIH1cblxuICBfaGFuZGxlSGVhZGVyRm9jdXMoaGVhZGVyOiBNYXRFeHBhbnNpb25QYW5lbEhlYWRlcikge1xuICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbShoZWFkZXIpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyPy5kZXN0cm95KCk7XG4gICAgdGhpcy5fb3duSGVhZGVycy5kZXN0cm95KCk7XG4gIH1cbn1cbiJdfQ==
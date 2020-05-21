/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __decorate, __metadata } from "tslib";
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
let MatAccordion = /** @class */ (() => {
    var MatAccordion_1;
    let MatAccordion = MatAccordion_1 = class MatAccordion extends CdkAccordion {
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
        get hideToggle() { return this._hideToggle; }
        set hideToggle(show) { this._hideToggle = coerceBooleanProperty(show); }
        ngAfterContentInit() {
            this._headers.changes
                .pipe(startWith(this._headers))
                .subscribe((headers) => {
                this._ownHeaders.reset(headers.filter(header => header.panel.accordion === this));
                this._ownHeaders.notifyOnChanges();
            });
            this._keyManager = new FocusKeyManager(this._ownHeaders).withWrap();
        }
        /** Handles keyboard events coming in from the panel headers. */
        _handleHeaderKeydown(event) {
            const { keyCode } = event;
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
        _handleHeaderFocus(header) {
            this._keyManager.updateActiveItem(header);
        }
    };
    __decorate([
        ContentChildren(MatExpansionPanelHeader, { descendants: true }),
        __metadata("design:type", QueryList)
    ], MatAccordion.prototype, "_headers", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], MatAccordion.prototype, "hideToggle", null);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatAccordion.prototype, "displayMode", void 0);
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], MatAccordion.prototype, "togglePosition", void 0);
    MatAccordion = MatAccordion_1 = __decorate([
        Directive({
            selector: 'mat-accordion',
            exportAs: 'matAccordion',
            inputs: ['multi'],
            providers: [{
                    provide: MAT_ACCORDION,
                    useExisting: MatAccordion_1
                }],
            host: {
                class: 'mat-accordion',
                // Class binding which is only used by the test harness as there is no other
                // way for the harness to detect if multiple panel support is enabled.
                '[class.mat-accordion-multi]': 'this.multi',
            }
        })
    ], MatAccordion);
    return MatAccordion;
})();
export { MatAccordion };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2V4cGFuc2lvbi9hY2NvcmRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQW1CLE1BQU0sZUFBZSxDQUFDO0FBQzdGLE9BQU8sRUFBZSxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzFFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsZUFBZSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDbEQsT0FBTyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDaEUsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFDTCxhQUFhLEVBSWQsTUFBTSxrQkFBa0IsQ0FBQztBQUMxQixPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSwwQkFBMEIsQ0FBQztBQUVqRTs7R0FFRztBQWdCSDs7SUFBQSxJQUFhLFlBQVksb0JBQXpCLE1BQWEsWUFBYSxTQUFRLFlBQVk7UUFBOUM7O1lBR0UsMkNBQTJDO1lBQ25DLGdCQUFXLEdBQUcsSUFBSSxTQUFTLEVBQTJCLENBQUM7WUFVdkQsZ0JBQVcsR0FBWSxLQUFLLENBQUM7WUFFckM7Ozs7Ozs7ZUFPRztZQUNNLGdCQUFXLEdBQTRCLFNBQVMsQ0FBQztZQUUxRCwrQ0FBK0M7WUFDdEMsbUJBQWMsR0FBK0IsT0FBTyxDQUFDO1FBc0NoRSxDQUFDO1FBdkRDLHdEQUF3RDtRQUV4RCxJQUFJLFVBQVUsS0FBYyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQ3RELElBQUksVUFBVSxDQUFDLElBQWEsSUFBSSxJQUFJLENBQUMsV0FBVyxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQWdCakYsa0JBQWtCO1lBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTztpQkFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQzlCLFNBQVMsQ0FBQyxDQUFDLE9BQTJDLEVBQUUsRUFBRTtnQkFDekQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ2xGLElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUM7WUFFTCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0RSxDQUFDO1FBRUQsZ0VBQWdFO1FBQ2hFLG9CQUFvQixDQUFDLEtBQW9CO1lBQ3ZDLE1BQU0sRUFBQyxPQUFPLEVBQUMsR0FBRyxLQUFLLENBQUM7WUFDeEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUVqQyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUU7b0JBQzFCLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO29CQUM3QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7aUJBQ3hCO2FBQ0Y7aUJBQU0sSUFBSSxPQUFPLEtBQUssR0FBRyxFQUFFO2dCQUMxQixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUMxQixPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztvQkFDNUIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO2lCQUN4QjthQUNGO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQztRQUVELGtCQUFrQixDQUFDLE1BQStCO1lBQ2hELElBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsQ0FBQztLQUdGLENBQUE7SUF6REM7UUFEQyxlQUFlLENBQUMsdUJBQXVCLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDLENBQUM7a0NBQ3BELFNBQVM7a0RBQTBCO0lBSTdDO1FBREMsS0FBSyxFQUFFOzs7a0RBQzhDO0lBWTdDO1FBQVIsS0FBSyxFQUFFOztxREFBa0Q7SUFHakQ7UUFBUixLQUFLLEVBQUU7O3dEQUFzRDtJQTNCbkQsWUFBWTtRQWZ4QixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsZUFBZTtZQUN6QixRQUFRLEVBQUUsY0FBYztZQUN4QixNQUFNLEVBQUUsQ0FBQyxPQUFPLENBQUM7WUFDakIsU0FBUyxFQUFFLENBQUM7b0JBQ1YsT0FBTyxFQUFFLGFBQWE7b0JBQ3RCLFdBQVcsRUFBRSxjQUFZO2lCQUMxQixDQUFDO1lBQ0YsSUFBSSxFQUFFO2dCQUNKLEtBQUssRUFBRSxlQUFlO2dCQUN0Qiw0RUFBNEU7Z0JBQzVFLHNFQUFzRTtnQkFDdEUsNkJBQTZCLEVBQUUsWUFBWTthQUM1QztTQUNGLENBQUM7T0FDVyxZQUFZLENBaUV4QjtJQUFELG1CQUFDO0tBQUE7U0FqRVksWUFBWSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIENvbnRlbnRDaGlsZHJlbiwgUXVlcnlMaXN0LCBBZnRlckNvbnRlbnRJbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Qm9vbGVhbklucHV0LCBjb2VyY2VCb29sZWFuUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge0Nka0FjY29yZGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2FjY29yZGlvbic7XG5pbXBvcnQge0ZvY3VzS2V5TWFuYWdlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtIT01FLCBFTkQsIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtzdGFydFdpdGh9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7XG4gIE1BVF9BQ0NPUkRJT04sXG4gIE1hdEFjY29yZGlvbkJhc2UsXG4gIE1hdEFjY29yZGlvbkRpc3BsYXlNb2RlLFxuICBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvblxufSBmcm9tICcuL2FjY29yZGlvbi1iYXNlJztcbmltcG9ydCB7TWF0RXhwYW5zaW9uUGFuZWxIZWFkZXJ9IGZyb20gJy4vZXhwYW5zaW9uLXBhbmVsLWhlYWRlcic7XG5cbi8qKlxuICogRGlyZWN0aXZlIGZvciBhIE1hdGVyaWFsIERlc2lnbiBBY2NvcmRpb24uXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1hY2NvcmRpb24nLFxuICBleHBvcnRBczogJ21hdEFjY29yZGlvbicsXG4gIGlucHV0czogWydtdWx0aSddLFxuICBwcm92aWRlcnM6IFt7XG4gICAgcHJvdmlkZTogTUFUX0FDQ09SRElPTixcbiAgICB1c2VFeGlzdGluZzogTWF0QWNjb3JkaW9uXG4gIH1dLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdtYXQtYWNjb3JkaW9uJyxcbiAgICAvLyBDbGFzcyBiaW5kaW5nIHdoaWNoIGlzIG9ubHkgdXNlZCBieSB0aGUgdGVzdCBoYXJuZXNzIGFzIHRoZXJlIGlzIG5vIG90aGVyXG4gICAgLy8gd2F5IGZvciB0aGUgaGFybmVzcyB0byBkZXRlY3QgaWYgbXVsdGlwbGUgcGFuZWwgc3VwcG9ydCBpcyBlbmFibGVkLlxuICAgICdbY2xhc3MubWF0LWFjY29yZGlvbi1tdWx0aV0nOiAndGhpcy5tdWx0aScsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTWF0QWNjb3JkaW9uIGV4dGVuZHMgQ2RrQWNjb3JkaW9uIGltcGxlbWVudHMgTWF0QWNjb3JkaW9uQmFzZSwgQWZ0ZXJDb250ZW50SW5pdCB7XG4gIHByaXZhdGUgX2tleU1hbmFnZXI6IEZvY3VzS2V5TWFuYWdlcjxNYXRFeHBhbnNpb25QYW5lbEhlYWRlcj47XG5cbiAgLyoqIEhlYWRlcnMgYmVsb25naW5nIHRvIHRoaXMgYWNjb3JkaW9uLiAqL1xuICBwcml2YXRlIF9vd25IZWFkZXJzID0gbmV3IFF1ZXJ5TGlzdDxNYXRFeHBhbnNpb25QYW5lbEhlYWRlcj4oKTtcblxuICAvKiogQWxsIGhlYWRlcnMgaW5zaWRlIHRoZSBhY2NvcmRpb24uIEluY2x1ZGVzIGhlYWRlcnMgaW5zaWRlIG5lc3RlZCBhY2NvcmRpb25zLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyLCB7ZGVzY2VuZGFudHM6IHRydWV9KVxuICBfaGVhZGVyczogUXVlcnlMaXN0PE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyPjtcblxuICAvKiogV2hldGhlciB0aGUgZXhwYW5zaW9uIGluZGljYXRvciBzaG91bGQgYmUgaGlkZGVuLiAqL1xuICBASW5wdXQoKVxuICBnZXQgaGlkZVRvZ2dsZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2hpZGVUb2dnbGU7IH1cbiAgc2V0IGhpZGVUb2dnbGUoc2hvdzogYm9vbGVhbikgeyB0aGlzLl9oaWRlVG9nZ2xlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHNob3cpOyB9XG4gIHByaXZhdGUgX2hpZGVUb2dnbGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogRGlzcGxheSBtb2RlIHVzZWQgZm9yIGFsbCBleHBhbnNpb24gcGFuZWxzIGluIHRoZSBhY2NvcmRpb24uIEN1cnJlbnRseSB0d28gZGlzcGxheVxuICAgKiBtb2RlcyBleGlzdDpcbiAgICogIGRlZmF1bHQgLSBhIGd1dHRlci1saWtlIHNwYWNpbmcgaXMgcGxhY2VkIGFyb3VuZCBhbnkgZXhwYW5kZWQgcGFuZWwsIHBsYWNpbmcgdGhlIGV4cGFuZGVkXG4gICAqICAgICBwYW5lbCBhdCBhIGRpZmZlcmVudCBlbGV2YXRpb24gZnJvbSB0aGUgcmVzdCBvZiB0aGUgYWNjb3JkaW9uLlxuICAgKiAgZmxhdCAtIG5vIHNwYWNpbmcgaXMgcGxhY2VkIGFyb3VuZCBleHBhbmRlZCBwYW5lbHMsIHNob3dpbmcgYWxsIHBhbmVscyBhdCB0aGUgc2FtZVxuICAgKiAgICAgZWxldmF0aW9uLlxuICAgKi9cbiAgQElucHV0KCkgZGlzcGxheU1vZGU6IE1hdEFjY29yZGlvbkRpc3BsYXlNb2RlID0gJ2RlZmF1bHQnO1xuXG4gIC8qKiBUaGUgcG9zaXRpb24gb2YgdGhlIGV4cGFuc2lvbiBpbmRpY2F0b3IuICovXG4gIEBJbnB1dCgpIHRvZ2dsZVBvc2l0aW9uOiBNYXRBY2NvcmRpb25Ub2dnbGVQb3NpdGlvbiA9ICdhZnRlcic7XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2hlYWRlcnMuY2hhbmdlc1xuICAgICAgLnBpcGUoc3RhcnRXaXRoKHRoaXMuX2hlYWRlcnMpKVxuICAgICAgLnN1YnNjcmliZSgoaGVhZGVyczogUXVlcnlMaXN0PE1hdEV4cGFuc2lvblBhbmVsSGVhZGVyPikgPT4ge1xuICAgICAgICB0aGlzLl9vd25IZWFkZXJzLnJlc2V0KGhlYWRlcnMuZmlsdGVyKGhlYWRlciA9PiBoZWFkZXIucGFuZWwuYWNjb3JkaW9uID09PSB0aGlzKSk7XG4gICAgICAgIHRoaXMuX293bkhlYWRlcnMubm90aWZ5T25DaGFuZ2VzKCk7XG4gICAgICB9KTtcblxuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgRm9jdXNLZXlNYW5hZ2VyKHRoaXMuX293bkhlYWRlcnMpLndpdGhXcmFwKCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlib2FyZCBldmVudHMgY29taW5nIGluIGZyb20gdGhlIHBhbmVsIGhlYWRlcnMuICovXG4gIF9oYW5kbGVIZWFkZXJLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgY29uc3Qge2tleUNvZGV9ID0gZXZlbnQ7XG4gICAgY29uc3QgbWFuYWdlciA9IHRoaXMuX2tleU1hbmFnZXI7XG5cbiAgICBpZiAoa2V5Q29kZSA9PT0gSE9NRSkge1xuICAgICAgaWYgKCFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgICAgbWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGtleUNvZGUgPT09IEVORCkge1xuICAgICAgaWYgKCFoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgICAgbWFuYWdlci5zZXRMYXN0SXRlbUFjdGl2ZSgpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9rZXlNYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgfVxuICB9XG5cbiAgX2hhbmRsZUhlYWRlckZvY3VzKGhlYWRlcjogTWF0RXhwYW5zaW9uUGFuZWxIZWFkZXIpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oaGVhZGVyKTtcbiAgfVxuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9oaWRlVG9nZ2xlOiBCb29sZWFuSW5wdXQ7XG59XG4iXX0=
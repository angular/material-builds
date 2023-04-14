/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CDK_TABLE_TEMPLATE, CdkTable, CDK_TABLE, _CoalescedStyleScheduler, _COALESCED_STYLE_SCHEDULER, STICKY_POSITIONING_LISTENER, } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';
import { _DisposeViewRepeaterStrategy, _RecycleViewRepeaterStrategy, _VIEW_REPEATER_STRATEGY, } from '@angular/cdk/collections';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/table";
/**
 * Enables the recycle view repeater strategy, which reduces rendering latency. Not compatible with
 * tables that animate rows.
 * @deprecated Use `MatRecycleRows` from `@angular/material/table` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyRecycleRows {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.7", ngImport: i0, type: MatLegacyRecycleRows, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0-next.7", type: MatLegacyRecycleRows, selector: "mat-table[recycleRows], table[mat-table][recycleRows]", providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }], ngImport: i0 }); }
}
export { MatLegacyRecycleRows };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.7", ngImport: i0, type: MatLegacyRecycleRows, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-table[recycleRows], table[mat-table][recycleRows]',
                    providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }],
                }]
        }] });
/**
 * Wrapper for the CdkTable with Material design styles.
 * @deprecated Use `MatTable` from `@angular/material/table` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacyTable extends CdkTable {
    constructor() {
        super(...arguments);
        /** Overrides the sticky CSS class set by the `CdkTable`. */
        this.stickyCssClass = 'mat-table-sticky';
        /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
        this.needsPositionStickyOnElement = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0-next.7", ngImport: i0, type: MatLegacyTable, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.0-next.7", type: MatLegacyTable, selector: "mat-table, table[mat-table]", host: { attributes: { "ngSkipHydration": "true" }, properties: { "class.mat-table-fixed-layout": "fixedLayout" }, classAttribute: "mat-table" }, providers: [
            // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
            //  is only included in the build if used.
            { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
            { provide: CdkTable, useExisting: MatLegacyTable },
            { provide: CDK_TABLE, useExisting: MatLegacyTable },
            { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
            // Prevent nested tables from seeing this table's StickyPositioningListener.
            { provide: STICKY_POSITIONING_LISTENER, useValue: null },
        ], exportAs: ["matTable"], usesInheritance: true, ngImport: i0, template: "\n  <ng-content select=\"caption\"></ng-content>\n  <ng-content select=\"colgroup, col\"></ng-content>\n  <ng-container headerRowOutlet></ng-container>\n  <ng-container rowOutlet></ng-container>\n  <ng-container noDataRowOutlet></ng-container>\n  <ng-container footerRowOutlet></ng-container>\n", isInline: true, styles: ["mat-table{display:block}mat-header-row{min-height:56px}mat-row,mat-footer-row{min-height:48px}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}table.mat-table{border-spacing:0}tr.mat-header-row{height:56px}tr.mat-row,tr.mat-footer-row{height:48px}th.mat-header-cell{text-align:left}[dir=rtl] th.mat-header-cell{text-align:right}th.mat-header-cell,td.mat-cell,td.mat-footer-cell{padding:0;border-bottom-width:1px;border-bottom-style:solid}th.mat-header-cell:first-of-type,td.mat-cell:first-of-type,td.mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] th.mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] td.mat-cell:first-of-type:not(:only-of-type),[dir=rtl] td.mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}th.mat-header-cell:last-of-type,td.mat-cell:last-of-type,td.mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] th.mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] td.mat-cell:last-of-type:not(:only-of-type),[dir=rtl] td.mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}.mat-table-sticky{position:sticky !important}.mat-table-fixed-layout{table-layout:fixed}"], dependencies: [{ kind: "directive", type: i1.DataRowOutlet, selector: "[rowOutlet]" }, { kind: "directive", type: i1.HeaderRowOutlet, selector: "[headerRowOutlet]" }, { kind: "directive", type: i1.FooterRowOutlet, selector: "[footerRowOutlet]" }, { kind: "directive", type: i1.NoDataRowOutlet, selector: "[noDataRowOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
export { MatLegacyTable };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0-next.7", ngImport: i0, type: MatLegacyTable, decorators: [{
            type: Component,
            args: [{ selector: 'mat-table, table[mat-table]', exportAs: 'matTable', template: CDK_TABLE_TEMPLATE, host: {
                        'class': 'mat-table',
                        '[class.mat-table-fixed-layout]': 'fixedLayout',
                        'ngSkipHydration': 'true',
                    }, providers: [
                        // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
                        //  is only included in the build if used.
                        { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
                        { provide: CdkTable, useExisting: MatLegacyTable },
                        { provide: CDK_TABLE, useExisting: MatLegacyTable },
                        { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
                        // Prevent nested tables from seeing this table's StickyPositioningListener.
                        { provide: STICKY_POSITIONING_LISTENER, useValue: null },
                    ], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, styles: ["mat-table{display:block}mat-header-row{min-height:56px}mat-row,mat-footer-row{min-height:48px}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}table.mat-table{border-spacing:0}tr.mat-header-row{height:56px}tr.mat-row,tr.mat-footer-row{height:48px}th.mat-header-cell{text-align:left}[dir=rtl] th.mat-header-cell{text-align:right}th.mat-header-cell,td.mat-cell,td.mat-footer-cell{padding:0;border-bottom-width:1px;border-bottom-style:solid}th.mat-header-cell:first-of-type,td.mat-cell:first-of-type,td.mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] th.mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] td.mat-cell:first-of-type:not(:only-of-type),[dir=rtl] td.mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}th.mat-header-cell:last-of-type,td.mat-cell:last-of-type,td.mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] th.mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] td.mat-cell:last-of-type:not(:only-of-type),[dir=rtl] td.mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}.mat-table-sticky{position:sticky !important}.mat-table-fixed-layout{table-layout:fixed}"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LXRhYmxlL3RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxrQkFBa0IsRUFDbEIsUUFBUSxFQUNSLFNBQVMsRUFDVCx3QkFBd0IsRUFDeEIsMEJBQTBCLEVBQzFCLDJCQUEyQixHQUM1QixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFBQyx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9GLE9BQU8sRUFDTCw0QkFBNEIsRUFDNUIsNEJBQTRCLEVBQzVCLHVCQUF1QixHQUN4QixNQUFNLDBCQUEwQixDQUFDOzs7QUFFbEM7Ozs7O0dBS0c7QUFDSCxNQUlhLG9CQUFvQjtxSEFBcEIsb0JBQW9CO3lHQUFwQixvQkFBb0IsZ0ZBRnBCLENBQUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFDLENBQUM7O1NBRTVFLG9CQUFvQjtrR0FBcEIsb0JBQW9CO2tCQUpoQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx1REFBdUQ7b0JBQ2pFLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBQyxDQUFDO2lCQUN4Rjs7QUFHRDs7OztHQUlHO0FBQ0gsTUF5QmEsY0FBa0IsU0FBUSxRQUFXO0lBekJsRDs7UUEwQkUsNERBQTREO1FBQ3pDLG1CQUFjLEdBQUcsa0JBQWtCLENBQUM7UUFFdkQsNkZBQTZGO1FBQzFFLGlDQUE0QixHQUFHLEtBQUssQ0FBQztLQUN6RDtxSEFOWSxjQUFjO3lHQUFkLGNBQWMsdU1BZmQ7WUFDVCxnR0FBZ0c7WUFDaEcsMENBQTBDO1lBQzFDLEVBQUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBQztZQUMxRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBQztZQUNoRCxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBQztZQUNqRCxFQUFDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxRQUFRLEVBQUUsd0JBQXdCLEVBQUM7WUFDekUsNEVBQTRFO1lBQzVFLEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7U0FDdkQ7O1NBTVUsY0FBYztrR0FBZCxjQUFjO2tCQXpCMUIsU0FBUzsrQkFDRSw2QkFBNkIsWUFDN0IsVUFBVSxZQUNWLGtCQUFrQixRQUV0Qjt3QkFDSixPQUFPLEVBQUUsV0FBVzt3QkFDcEIsZ0NBQWdDLEVBQUUsYUFBYTt3QkFDL0MsaUJBQWlCLEVBQUUsTUFBTTtxQkFDMUIsYUFDVTt3QkFDVCxnR0FBZ0c7d0JBQ2hHLDBDQUEwQzt3QkFDMUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFDO3dCQUMxRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxnQkFBZ0IsRUFBQzt3QkFDaEQsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsZ0JBQWdCLEVBQUM7d0JBQ2pELEVBQUMsT0FBTyxFQUFFLDBCQUEwQixFQUFFLFFBQVEsRUFBRSx3QkFBd0IsRUFBQzt3QkFDekUsNEVBQTRFO3dCQUM1RSxFQUFDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO3FCQUN2RCxpQkFDYyxpQkFBaUIsQ0FBQyxJQUFJLG1CQUdwQix1QkFBdUIsQ0FBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENES19UQUJMRV9URU1QTEFURSxcbiAgQ2RrVGFibGUsXG4gIENES19UQUJMRSxcbiAgX0NvYWxlc2NlZFN0eWxlU2NoZWR1bGVyLFxuICBfQ09BTEVTQ0VEX1NUWUxFX1NDSEVEVUxFUixcbiAgU1RJQ0tZX1BPU0lUSU9OSU5HX0xJU1RFTkVSLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBEaXJlY3RpdmUsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIF9EaXNwb3NlVmlld1JlcGVhdGVyU3RyYXRlZ3ksXG4gIF9SZWN5Y2xlVmlld1JlcGVhdGVyU3RyYXRlZ3ksXG4gIF9WSUVXX1JFUEVBVEVSX1NUUkFURUdZLFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuXG4vKipcbiAqIEVuYWJsZXMgdGhlIHJlY3ljbGUgdmlldyByZXBlYXRlciBzdHJhdGVneSwgd2hpY2ggcmVkdWNlcyByZW5kZXJpbmcgbGF0ZW5jeS4gTm90IGNvbXBhdGlibGUgd2l0aFxuICogdGFibGVzIHRoYXQgYW5pbWF0ZSByb3dzLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRSZWN5Y2xlUm93c2AgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvdGFibGVgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LXRhYmxlW3JlY3ljbGVSb3dzXSwgdGFibGVbbWF0LXRhYmxlXVtyZWN5Y2xlUm93c10nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogX1ZJRVdfUkVQRUFURVJfU1RSQVRFR1ksIHVzZUNsYXNzOiBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeVJlY3ljbGVSb3dzIHt9XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RhYmxlIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0VGFibGVgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3RhYmxlYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWJsZSwgdGFibGVbbWF0LXRhYmxlXScsXG4gIGV4cG9ydEFzOiAnbWF0VGFibGUnLFxuICB0ZW1wbGF0ZTogQ0RLX1RBQkxFX1RFTVBMQVRFLFxuICBzdHlsZVVybHM6IFsndGFibGUuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXRhYmxlJyxcbiAgICAnW2NsYXNzLm1hdC10YWJsZS1maXhlZC1sYXlvdXRdJzogJ2ZpeGVkTGF5b3V0JyxcbiAgICAnbmdTa2lwSHlkcmF0aW9uJzogJ3RydWUnLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICAvLyBUT0RPKG1pY2hhZWxqYW1lc3BhcnNvbnMpIEFic3RyYWN0IHRoZSB2aWV3IHJlcGVhdGVyIHN0cmF0ZWd5IHRvIGEgZGlyZWN0aXZlIEFQSSBzbyB0aGlzIGNvZGVcbiAgICAvLyAgaXMgb25seSBpbmNsdWRlZCBpbiB0aGUgYnVpbGQgaWYgdXNlZC5cbiAgICB7cHJvdmlkZTogX1ZJRVdfUkVQRUFURVJfU1RSQVRFR1ksIHVzZUNsYXNzOiBfRGlzcG9zZVZpZXdSZXBlYXRlclN0cmF0ZWd5fSxcbiAgICB7cHJvdmlkZTogQ2RrVGFibGUsIHVzZUV4aXN0aW5nOiBNYXRMZWdhY3lUYWJsZX0sXG4gICAge3Byb3ZpZGU6IENES19UQUJMRSwgdXNlRXhpc3Rpbmc6IE1hdExlZ2FjeVRhYmxlfSxcbiAgICB7cHJvdmlkZTogX0NPQUxFU0NFRF9TVFlMRV9TQ0hFRFVMRVIsIHVzZUNsYXNzOiBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXJ9LFxuICAgIC8vIFByZXZlbnQgbmVzdGVkIHRhYmxlcyBmcm9tIHNlZWluZyB0aGlzIHRhYmxlJ3MgU3RpY2t5UG9zaXRpb25pbmdMaXN0ZW5lci5cbiAgICB7cHJvdmlkZTogU1RJQ0tZX1BPU0lUSU9OSU5HX0xJU1RFTkVSLCB1c2VWYWx1ZTogbnVsbH0sXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIFNlZSBub3RlIG9uIENka1RhYmxlIGZvciBleHBsYW5hdGlvbiBvbiB3aHkgdGhpcyB1c2VzIHRoZSBkZWZhdWx0IGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3kuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5VGFibGU8VD4gZXh0ZW5kcyBDZGtUYWJsZTxUPiB7XG4gIC8qKiBPdmVycmlkZXMgdGhlIHN0aWNreSBDU1MgY2xhc3Mgc2V0IGJ5IHRoZSBgQ2RrVGFibGVgLiAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgc3RpY2t5Q3NzQ2xhc3MgPSAnbWF0LXRhYmxlLXN0aWNreSc7XG5cbiAgLyoqIE92ZXJyaWRlcyB0aGUgbmVlZCB0byBhZGQgcG9zaXRpb246IHN0aWNreSBvbiBldmVyeSBzdGlja3kgY2VsbCBlbGVtZW50IGluIGBDZGtUYWJsZWAuICovXG4gIHByb3RlY3RlZCBvdmVycmlkZSBuZWVkc1Bvc2l0aW9uU3RpY2t5T25FbGVtZW50ID0gZmFsc2U7XG59XG4iXX0=
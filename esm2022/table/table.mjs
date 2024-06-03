/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation } from '@angular/core';
import { CdkTable, _CoalescedStyleScheduler, _COALESCED_STYLE_SCHEDULER, CDK_TABLE, STICKY_POSITIONING_LISTENER, HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet, } from '@angular/cdk/table';
import { _DisposeViewRepeaterStrategy, _RecycleViewRepeaterStrategy, _VIEW_REPEATER_STRATEGY, } from '@angular/cdk/collections';
import * as i0 from "@angular/core";
/**
 * Enables the recycle view repeater strategy, which reduces rendering latency. Not compatible with
 * tables that animate rows.
 */
export class MatRecycleRows {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatRecycleRows, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.0.0", type: MatRecycleRows, isStandalone: true, selector: "mat-table[recycleRows], table[mat-table][recycleRows]", providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatRecycleRows, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-table[recycleRows], table[mat-table][recycleRows]',
                    providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }],
                    standalone: true,
                }]
        }] });
export class MatTable extends CdkTable {
    constructor() {
        super(...arguments);
        /** Overrides the sticky CSS class set by the `CdkTable`. */
        this.stickyCssClass = 'mat-mdc-table-sticky';
        /** Overrides the need to add position: sticky on every sticky cell element in `CdkTable`. */
        this.needsPositionStickyOnElement = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatTable, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.0.0", type: MatTable, isStandalone: true, selector: "mat-table, table[mat-table]", host: { properties: { "class.mdc-table-fixed-layout": "fixedLayout" }, classAttribute: "mat-mdc-table mdc-data-table__table" }, providers: [
            { provide: CdkTable, useExisting: MatTable },
            { provide: CDK_TABLE, useExisting: MatTable },
            { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
            // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
            //  is only included in the build if used.
            { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
            // Prevent nested tables from seeing this table's StickyPositioningListener.
            { provide: STICKY_POSITIONING_LISTENER, useValue: null },
        ], exportAs: ["matTable"], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="caption"/>
    <ng-content select="colgroup, col"/>

    <!--
      Unprojected content throws a hydration error so we need this to capture it.
      It gets removed on the client so it doesn't affect the layout.
    -->
    @if (_isServer) {
      <ng-content/>
    }

    @if (_isNativeHtmlTable) {
      <thead role="rowgroup">
        <ng-container headerRowOutlet/>
      </thead>
      <tbody class="mdc-data-table__content" role="rowgroup">
        <ng-container rowOutlet/>
        <ng-container noDataRowOutlet/>
      </tbody>
      <tfoot role="rowgroup">
        <ng-container footerRowOutlet/>
      </tfoot>
    } @else {
      <ng-container headerRowOutlet/>
      <ng-container rowOutlet/>
      <ng-container noDataRowOutlet/>
      <ng-container footerRowOutlet/>
    }
  `, isInline: true, styles: [".mat-mdc-table-sticky{position:sticky !important}mat-table{display:block}mat-header-row{min-height:56px}mat-row,mat-footer-row{min-height:48px}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}.mat-mdc-table{min-width:100%;border:0;border-spacing:0;table-layout:auto;white-space:normal;background-color:var(--mat-table-background-color)}.mdc-data-table__cell{box-sizing:border-box;overflow:hidden;text-align:left;text-overflow:ellipsis}[dir=rtl] .mdc-data-table__cell{text-align:right}.mdc-data-table__cell,.mdc-data-table__header-cell{padding:0 16px}.mat-mdc-header-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-header-container-height, 56px);color:var(--mat-table-header-headline-color, rgba(0, 0, 0, 0.87));font-family:var(--mat-table-header-headline-font, Roboto, sans-serif);line-height:var(--mat-table-header-headline-line-height);font-size:var(--mat-table-header-headline-size, 14px);font-weight:var(--mat-table-header-headline-weight, 500)}.mat-mdc-row{height:var(--mat-table-row-item-container-height, 52px);color:var(--mat-table-row-item-label-text-color, rgba(0, 0, 0, 0.87))}.mat-mdc-row,.mdc-data-table__content{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-table-row-item-label-text-font, Roboto, sans-serif);line-height:var(--mat-table-row-item-label-text-line-height);font-size:var(--mat-table-row-item-label-text-size, 14px);font-weight:var(--mat-table-row-item-label-text-weight)}.mat-mdc-footer-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-footer-container-height, 52px);color:var(--mat-table-row-item-label-text-color, rgba(0, 0, 0, 0.87));font-family:var(--mat-table-footer-supporting-text-font, Roboto, sans-serif);line-height:var(--mat-table-footer-supporting-text-line-height);font-size:var(--mat-table-footer-supporting-text-size, 14px);font-weight:var(--mat-table-footer-supporting-text-weight);letter-spacing:var(--mat-table-footer-supporting-text-tracking)}.mat-mdc-header-cell{border-bottom-color:var(--mat-table-row-item-outline-color, rgba(0, 0, 0, 0.12));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-header-headline-tracking);font-weight:inherit;line-height:inherit;box-sizing:border-box;text-overflow:ellipsis;overflow:hidden;outline:none;text-align:left}[dir=rtl] .mat-mdc-header-cell{text-align:right}.mat-mdc-cell{border-bottom-color:var(--mat-table-row-item-outline-color, rgba(0, 0, 0, 0.12));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-row-item-label-text-tracking);line-height:inherit}.mdc-data-table__row:last-child .mat-mdc-cell{border-bottom:none}.mat-mdc-footer-cell{letter-spacing:var(--mat-table-row-item-label-text-tracking)}mat-row.mat-mdc-row,mat-header-row.mat-mdc-header-row,mat-footer-row.mat-mdc-footer-row{border-bottom:none}.mat-mdc-table tbody,.mat-mdc-table tfoot,.mat-mdc-table thead,.mat-mdc-cell,.mat-mdc-footer-cell,.mat-mdc-header-row,.mat-mdc-row,.mat-mdc-footer-row,.mat-mdc-table .mat-mdc-header-cell{background:inherit}.mat-mdc-table mat-header-row.mat-mdc-header-row,.mat-mdc-table mat-row.mat-mdc-row,.mat-mdc-table mat-footer-row.mat-mdc-footer-cell{height:unset}mat-header-cell.mat-mdc-header-cell,mat-cell.mat-mdc-cell,mat-footer-cell.mat-mdc-footer-cell{align-self:stretch}"], dependencies: [{ kind: "directive", type: HeaderRowOutlet, selector: "[headerRowOutlet]" }, { kind: "directive", type: DataRowOutlet, selector: "[rowOutlet]" }, { kind: "directive", type: NoDataRowOutlet, selector: "[noDataRowOutlet]" }, { kind: "directive", type: FooterRowOutlet, selector: "[footerRowOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.0.0", ngImport: i0, type: MatTable, decorators: [{
            type: Component,
            args: [{ selector: 'mat-table, table[mat-table]', exportAs: 'matTable', template: `
    <ng-content select="caption"/>
    <ng-content select="colgroup, col"/>

    <!--
      Unprojected content throws a hydration error so we need this to capture it.
      It gets removed on the client so it doesn't affect the layout.
    -->
    @if (_isServer) {
      <ng-content/>
    }

    @if (_isNativeHtmlTable) {
      <thead role="rowgroup">
        <ng-container headerRowOutlet/>
      </thead>
      <tbody class="mdc-data-table__content" role="rowgroup">
        <ng-container rowOutlet/>
        <ng-container noDataRowOutlet/>
      </tbody>
      <tfoot role="rowgroup">
        <ng-container footerRowOutlet/>
      </tfoot>
    } @else {
      <ng-container headerRowOutlet/>
      <ng-container rowOutlet/>
      <ng-container noDataRowOutlet/>
      <ng-container footerRowOutlet/>
    }
  `, host: {
                        'class': 'mat-mdc-table mdc-data-table__table',
                        '[class.mdc-table-fixed-layout]': 'fixedLayout',
                    }, providers: [
                        { provide: CdkTable, useExisting: MatTable },
                        { provide: CDK_TABLE, useExisting: MatTable },
                        { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
                        // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
                        //  is only included in the build if used.
                        { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
                        // Prevent nested tables from seeing this table's StickyPositioningListener.
                        { provide: STICKY_POSITIONING_LISTENER, useValue: null },
                    ], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, standalone: true, imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet], styles: [".mat-mdc-table-sticky{position:sticky !important}mat-table{display:block}mat-header-row{min-height:56px}mat-row,mat-footer-row{min-height:48px}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}.mat-mdc-table{min-width:100%;border:0;border-spacing:0;table-layout:auto;white-space:normal;background-color:var(--mat-table-background-color)}.mdc-data-table__cell{box-sizing:border-box;overflow:hidden;text-align:left;text-overflow:ellipsis}[dir=rtl] .mdc-data-table__cell{text-align:right}.mdc-data-table__cell,.mdc-data-table__header-cell{padding:0 16px}.mat-mdc-header-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-header-container-height, 56px);color:var(--mat-table-header-headline-color, rgba(0, 0, 0, 0.87));font-family:var(--mat-table-header-headline-font, Roboto, sans-serif);line-height:var(--mat-table-header-headline-line-height);font-size:var(--mat-table-header-headline-size, 14px);font-weight:var(--mat-table-header-headline-weight, 500)}.mat-mdc-row{height:var(--mat-table-row-item-container-height, 52px);color:var(--mat-table-row-item-label-text-color, rgba(0, 0, 0, 0.87))}.mat-mdc-row,.mdc-data-table__content{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-table-row-item-label-text-font, Roboto, sans-serif);line-height:var(--mat-table-row-item-label-text-line-height);font-size:var(--mat-table-row-item-label-text-size, 14px);font-weight:var(--mat-table-row-item-label-text-weight)}.mat-mdc-footer-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-footer-container-height, 52px);color:var(--mat-table-row-item-label-text-color, rgba(0, 0, 0, 0.87));font-family:var(--mat-table-footer-supporting-text-font, Roboto, sans-serif);line-height:var(--mat-table-footer-supporting-text-line-height);font-size:var(--mat-table-footer-supporting-text-size, 14px);font-weight:var(--mat-table-footer-supporting-text-weight);letter-spacing:var(--mat-table-footer-supporting-text-tracking)}.mat-mdc-header-cell{border-bottom-color:var(--mat-table-row-item-outline-color, rgba(0, 0, 0, 0.12));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-header-headline-tracking);font-weight:inherit;line-height:inherit;box-sizing:border-box;text-overflow:ellipsis;overflow:hidden;outline:none;text-align:left}[dir=rtl] .mat-mdc-header-cell{text-align:right}.mat-mdc-cell{border-bottom-color:var(--mat-table-row-item-outline-color, rgba(0, 0, 0, 0.12));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-row-item-label-text-tracking);line-height:inherit}.mdc-data-table__row:last-child .mat-mdc-cell{border-bottom:none}.mat-mdc-footer-cell{letter-spacing:var(--mat-table-row-item-label-text-tracking)}mat-row.mat-mdc-row,mat-header-row.mat-mdc-header-row,mat-footer-row.mat-mdc-footer-row{border-bottom:none}.mat-mdc-table tbody,.mat-mdc-table tfoot,.mat-mdc-table thead,.mat-mdc-cell,.mat-mdc-footer-cell,.mat-mdc-header-row,.mat-mdc-row,.mat-mdc-footer-row,.mat-mdc-table .mat-mdc-header-cell{background:inherit}.mat-mdc-table mat-header-row.mat-mdc-header-row,.mat-mdc-table mat-row.mat-mdc-row,.mat-mdc-table mat-footer-row.mat-mdc-footer-cell{height:unset}mat-header-cell.mat-mdc-header-cell,mat-cell.mat-mdc-cell,mat-footer-cell.mat-mdc-footer-cell{align-self:stretch}"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDL0YsT0FBTyxFQUNMLFFBQVEsRUFDUix3QkFBd0IsRUFDeEIsMEJBQTBCLEVBQzFCLFNBQVMsRUFDVCwyQkFBMkIsRUFDM0IsZUFBZSxFQUNmLGFBQWEsRUFDYixlQUFlLEVBQ2YsZUFBZSxHQUNoQixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFDTCw0QkFBNEIsRUFDNUIsNEJBQTRCLEVBQzVCLHVCQUF1QixHQUN4QixNQUFNLDBCQUEwQixDQUFDOztBQUVsQzs7O0dBR0c7QUFNSCxNQUFNLE9BQU8sY0FBYzs4R0FBZCxjQUFjO2tHQUFkLGNBQWMsb0dBSGQsQ0FBQyxFQUFDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsNEJBQTRCLEVBQUMsQ0FBQzs7MkZBRzVFLGNBQWM7a0JBTDFCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHVEQUF1RDtvQkFDakUsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFDLENBQUM7b0JBQ3ZGLFVBQVUsRUFBRSxJQUFJO2lCQUNqQjs7QUE2REQsTUFBTSxPQUFPLFFBQVksU0FBUSxRQUFXO0lBMUQ1Qzs7UUEyREUsNERBQTREO1FBQ3pDLG1CQUFjLEdBQUcsc0JBQXNCLENBQUM7UUFFM0QsNkZBQTZGO1FBQzFFLGlDQUE0QixHQUFHLEtBQUssQ0FBQztLQUN6RDs4R0FOWSxRQUFRO2tHQUFSLFFBQVEsME1BakJSO1lBQ1QsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUM7WUFDMUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUM7WUFDM0MsRUFBQyxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsUUFBUSxFQUFFLHdCQUF3QixFQUFDO1lBQ3pFLGdHQUFnRztZQUNoRywwQ0FBMEM7WUFDMUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFDO1lBQzFFLDRFQUE0RTtZQUM1RSxFQUFDLE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1NBQ3ZELHlFQTVDUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2QlQseXdJQXFCUyxlQUFlLDhEQUFFLGFBQWEsd0RBQUUsZUFBZSw4REFBRSxlQUFlOzsyRkFFL0QsUUFBUTtrQkExRHBCLFNBQVM7K0JBQ0UsNkJBQTZCLFlBQzdCLFVBQVUsWUFJVjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2QlQsUUFFSzt3QkFDSixPQUFPLEVBQUUscUNBQXFDO3dCQUM5QyxnQ0FBZ0MsRUFBRSxhQUFhO3FCQUNoRCxhQUNVO3dCQUNULEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLFVBQVUsRUFBQzt3QkFDMUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsVUFBVSxFQUFDO3dCQUMzQyxFQUFDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxRQUFRLEVBQUUsd0JBQXdCLEVBQUM7d0JBQ3pFLGdHQUFnRzt3QkFDaEcsMENBQTBDO3dCQUMxQyxFQUFDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsNEJBQTRCLEVBQUM7d0JBQzFFLDRFQUE0RTt3QkFDNUUsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztxQkFDdkQsaUJBQ2MsaUJBQWlCLENBQUMsSUFBSSxtQkFHcEIsdUJBQXVCLENBQUMsT0FBTyxjQUNwQyxJQUFJLFdBQ1AsQ0FBQyxlQUFlLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBEaXJlY3RpdmUsIFZpZXdFbmNhcHN1bGF0aW9ufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENka1RhYmxlLFxuICBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXIsXG4gIF9DT0FMRVNDRURfU1RZTEVfU0NIRURVTEVSLFxuICBDREtfVEFCTEUsXG4gIFNUSUNLWV9QT1NJVElPTklOR19MSVNURU5FUixcbiAgSGVhZGVyUm93T3V0bGV0LFxuICBEYXRhUm93T3V0bGV0LFxuICBOb0RhdGFSb3dPdXRsZXQsXG4gIEZvb3RlclJvd091dGxldCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3RhYmxlJztcbmltcG9ydCB7XG4gIF9EaXNwb3NlVmlld1JlcGVhdGVyU3RyYXRlZ3ksXG4gIF9SZWN5Y2xlVmlld1JlcGVhdGVyU3RyYXRlZ3ksXG4gIF9WSUVXX1JFUEVBVEVSX1NUUkFURUdZLFxufSBmcm9tICdAYW5ndWxhci9jZGsvY29sbGVjdGlvbnMnO1xuXG4vKipcbiAqIEVuYWJsZXMgdGhlIHJlY3ljbGUgdmlldyByZXBlYXRlciBzdHJhdGVneSwgd2hpY2ggcmVkdWNlcyByZW5kZXJpbmcgbGF0ZW5jeS4gTm90IGNvbXBhdGlibGUgd2l0aFxuICogdGFibGVzIHRoYXQgYW5pbWF0ZSByb3dzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdtYXQtdGFibGVbcmVjeWNsZVJvd3NdLCB0YWJsZVttYXQtdGFibGVdW3JlY3ljbGVSb3dzXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSwgdXNlQ2xhc3M6IF9SZWN5Y2xlVmlld1JlcGVhdGVyU3RyYXRlZ3l9XSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0UmVjeWNsZVJvd3Mge31cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXRhYmxlLCB0YWJsZVttYXQtdGFibGVdJyxcbiAgZXhwb3J0QXM6ICdtYXRUYWJsZScsXG4gIC8vIE5vdGUgdGhhdCBhY2NvcmRpbmcgdG8gTUROLCB0aGUgYGNhcHRpb25gIGVsZW1lbnQgaGFzIHRvIGJlIHByb2plY3RlZCBhcyB0aGUgKipmaXJzdCoqXG4gIC8vIGVsZW1lbnQgaW4gdGhlIHRhYmxlLiBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRNTC9FbGVtZW50L2NhcHRpb25cbiAgLy8gV2UgY2FuJ3QgcmV1c2UgYENES19UQUJMRV9URU1QTEFURWAgYmVjYXVzZSBpdCdzIGluY29tcGF0aWJsZSB3aXRoIGxvY2FsIGNvbXBpbGF0aW9uIG1vZGUuXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiY2FwdGlvblwiLz5cbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjb2xncm91cCwgY29sXCIvPlxuXG4gICAgPCEtLVxuICAgICAgVW5wcm9qZWN0ZWQgY29udGVudCB0aHJvd3MgYSBoeWRyYXRpb24gZXJyb3Igc28gd2UgbmVlZCB0aGlzIHRvIGNhcHR1cmUgaXQuXG4gICAgICBJdCBnZXRzIHJlbW92ZWQgb24gdGhlIGNsaWVudCBzbyBpdCBkb2Vzbid0IGFmZmVjdCB0aGUgbGF5b3V0LlxuICAgIC0tPlxuICAgIEBpZiAoX2lzU2VydmVyKSB7XG4gICAgICA8bmctY29udGVudC8+XG4gICAgfVxuXG4gICAgQGlmIChfaXNOYXRpdmVIdG1sVGFibGUpIHtcbiAgICAgIDx0aGVhZCByb2xlPVwicm93Z3JvdXBcIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciBoZWFkZXJSb3dPdXRsZXQvPlxuICAgICAgPC90aGVhZD5cbiAgICAgIDx0Ym9keSBjbGFzcz1cIm1kYy1kYXRhLXRhYmxlX19jb250ZW50XCIgcm9sZT1cInJvd2dyb3VwXCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgcm93T3V0bGV0Lz5cbiAgICAgICAgPG5nLWNvbnRhaW5lciBub0RhdGFSb3dPdXRsZXQvPlxuICAgICAgPC90Ym9keT5cbiAgICAgIDx0Zm9vdCByb2xlPVwicm93Z3JvdXBcIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciBmb290ZXJSb3dPdXRsZXQvPlxuICAgICAgPC90Zm9vdD5cbiAgICB9IEBlbHNlIHtcbiAgICAgIDxuZy1jb250YWluZXIgaGVhZGVyUm93T3V0bGV0Lz5cbiAgICAgIDxuZy1jb250YWluZXIgcm93T3V0bGV0Lz5cbiAgICAgIDxuZy1jb250YWluZXIgbm9EYXRhUm93T3V0bGV0Lz5cbiAgICAgIDxuZy1jb250YWluZXIgZm9vdGVyUm93T3V0bGV0Lz5cbiAgICB9XG4gIGAsXG4gIHN0eWxlVXJsOiAndGFibGUuY3NzJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWRjLXRhYmxlIG1kYy1kYXRhLXRhYmxlX190YWJsZScsXG4gICAgJ1tjbGFzcy5tZGMtdGFibGUtZml4ZWQtbGF5b3V0XSc6ICdmaXhlZExheW91dCcsXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBDZGtUYWJsZSwgdXNlRXhpc3Rpbmc6IE1hdFRhYmxlfSxcbiAgICB7cHJvdmlkZTogQ0RLX1RBQkxFLCB1c2VFeGlzdGluZzogTWF0VGFibGV9LFxuICAgIHtwcm92aWRlOiBfQ09BTEVTQ0VEX1NUWUxFX1NDSEVEVUxFUiwgdXNlQ2xhc3M6IF9Db2FsZXNjZWRTdHlsZVNjaGVkdWxlcn0sXG4gICAgLy8gVE9ETyhtaWNoYWVsamFtZXNwYXJzb25zKSBBYnN0cmFjdCB0aGUgdmlldyByZXBlYXRlciBzdHJhdGVneSB0byBhIGRpcmVjdGl2ZSBBUEkgc28gdGhpcyBjb2RlXG4gICAgLy8gIGlzIG9ubHkgaW5jbHVkZWQgaW4gdGhlIGJ1aWxkIGlmIHVzZWQuXG4gICAge3Byb3ZpZGU6IF9WSUVXX1JFUEVBVEVSX1NUUkFURUdZLCB1c2VDbGFzczogX0Rpc3Bvc2VWaWV3UmVwZWF0ZXJTdHJhdGVneX0sXG4gICAgLy8gUHJldmVudCBuZXN0ZWQgdGFibGVzIGZyb20gc2VlaW5nIHRoaXMgdGFibGUncyBTdGlja3lQb3NpdGlvbmluZ0xpc3RlbmVyLlxuICAgIHtwcm92aWRlOiBTVElDS1lfUE9TSVRJT05JTkdfTElTVEVORVIsIHVzZVZhbHVlOiBudWxsfSxcbiAgXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gU2VlIG5vdGUgb24gQ2RrVGFibGUgZm9yIGV4cGxhbmF0aW9uIG9uIHdoeSB0aGlzIHVzZXMgdGhlIGRlZmF1bHQgY2hhbmdlIGRldGVjdGlvbiBzdHJhdGVneS5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbSGVhZGVyUm93T3V0bGV0LCBEYXRhUm93T3V0bGV0LCBOb0RhdGFSb3dPdXRsZXQsIEZvb3RlclJvd091dGxldF0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRhYmxlPFQ+IGV4dGVuZHMgQ2RrVGFibGU8VD4ge1xuICAvKiogT3ZlcnJpZGVzIHRoZSBzdGlja3kgQ1NTIGNsYXNzIHNldCBieSB0aGUgYENka1RhYmxlYC4gKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIHN0aWNreUNzc0NsYXNzID0gJ21hdC1tZGMtdGFibGUtc3RpY2t5JztcblxuICAvKiogT3ZlcnJpZGVzIHRoZSBuZWVkIHRvIGFkZCBwb3NpdGlvbjogc3RpY2t5IG9uIGV2ZXJ5IHN0aWNreSBjZWxsIGVsZW1lbnQgaW4gYENka1RhYmxlYC4gKi9cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIG5lZWRzUG9zaXRpb25TdGlja3lPbkVsZW1lbnQgPSBmYWxzZTtcbn1cbiJdfQ==
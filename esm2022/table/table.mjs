/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation, } from '@angular/core';
import { CdkTable, _CoalescedStyleScheduler, _COALESCED_STYLE_SCHEDULER, CDK_TABLE, STICKY_POSITIONING_LISTENER, } from '@angular/cdk/table';
import { _DisposeViewRepeaterStrategy, _RecycleViewRepeaterStrategy, _VIEW_REPEATER_STRATEGY, } from '@angular/cdk/collections';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/table";
/**
 * Enables the recycle view repeater strategy, which reduces rendering latency. Not compatible with
 * tables that animate rows.
 */
export class MatRecycleRows {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0-rc.2", ngImport: i0, type: MatRecycleRows, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "17.0.0-rc.2", type: MatRecycleRows, selector: "mat-table[recycleRows], table[mat-table][recycleRows]", providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0-rc.2", ngImport: i0, type: MatRecycleRows, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-table[recycleRows], table[mat-table][recycleRows]',
                    providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }],
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
    ngOnInit() {
        super.ngOnInit();
        // After ngOnInit, the `CdkTable` has created and inserted the table sections (thead, tbody,
        // tfoot). MDC requires the `mdc-data-table__content` class to be added to the body. Note that
        // this only applies to native tables, because we don't wrap the content of flexbox-based ones.
        if (this._isNativeHtmlTable) {
            const tbody = this._elementRef.nativeElement.querySelector('tbody');
            tbody.classList.add('mdc-data-table__content');
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.0-rc.2", ngImport: i0, type: MatTable, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.0.0-rc.2", type: MatTable, selector: "mat-table, table[mat-table]", host: { attributes: { "ngSkipHydration": "" }, properties: { "class.mdc-table-fixed-layout": "fixedLayout" }, classAttribute: "mat-mdc-table mdc-data-table__table" }, providers: [
            { provide: CdkTable, useExisting: MatTable },
            { provide: CDK_TABLE, useExisting: MatTable },
            { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
            // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
            //  is only included in the build if used.
            { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
            // Prevent nested tables from seeing this table's StickyPositioningListener.
            { provide: STICKY_POSITIONING_LISTENER, useValue: null },
        ], exportAs: ["matTable"], usesInheritance: true, ngImport: i0, template: `
    <ng-content select="caption"></ng-content>
    <ng-content select="colgroup, col"></ng-content>
    <ng-container headerRowOutlet></ng-container>
    <ng-container rowOutlet></ng-container>
    <ng-container noDataRowOutlet></ng-container>
    <ng-container footerRowOutlet></ng-container>
  `, isInline: true, styles: [".mat-mdc-table-sticky{position:sticky !important}.mdc-data-table{-webkit-overflow-scrolling:touch;display:inline-flex;flex-direction:column;box-sizing:border-box;position:relative}.mdc-data-table__table-container{-webkit-overflow-scrolling:touch;overflow-x:auto;width:100%}.mdc-data-table__table{min-width:100%;border:0;white-space:nowrap;border-spacing:0;table-layout:fixed}.mdc-data-table__cell{box-sizing:border-box;overflow:hidden;text-align:left;text-overflow:ellipsis}[dir=rtl] .mdc-data-table__cell,.mdc-data-table__cell[dir=rtl]{text-align:right}.mdc-data-table__cell--numeric{text-align:right}[dir=rtl] .mdc-data-table__cell--numeric,.mdc-data-table__cell--numeric[dir=rtl]{text-align:left}.mdc-data-table__header-cell{box-sizing:border-box;text-overflow:ellipsis;overflow:hidden;outline:none;text-align:left}[dir=rtl] .mdc-data-table__header-cell,.mdc-data-table__header-cell[dir=rtl]{text-align:right}.mdc-data-table__header-cell--numeric{text-align:right}[dir=rtl] .mdc-data-table__header-cell--numeric,.mdc-data-table__header-cell--numeric[dir=rtl]{text-align:left}.mdc-data-table__header-cell-wrapper{align-items:center;display:inline-flex;vertical-align:middle}.mdc-data-table__cell,.mdc-data-table__header-cell{padding:0 16px 0 16px}.mdc-data-table__header-cell--checkbox,.mdc-data-table__cell--checkbox{padding-left:4px;padding-right:0}[dir=rtl] .mdc-data-table__header-cell--checkbox,[dir=rtl] .mdc-data-table__cell--checkbox,.mdc-data-table__header-cell--checkbox[dir=rtl],.mdc-data-table__cell--checkbox[dir=rtl]{padding-left:0;padding-right:4px}mat-table{display:block}mat-header-row{min-height:56px}mat-row,mat-footer-row{min-height:48px}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}.mat-mdc-table{table-layout:auto;white-space:normal;background-color:var(--mat-table-background-color)}.mat-mdc-header-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-header-container-height, 56px);color:var(--mat-table-header-headline-color, rgba(0, 0, 0, 0.87));font-family:var(--mat-table-header-headline-font, Roboto, sans-serif);line-height:var(--mat-table-header-headline-line-height);font-size:var(--mat-table-header-headline-size, 14px);font-weight:var(--mat-table-header-headline-weight, 500)}.mat-mdc-row{height:var(--mat-table-row-item-container-height, 52px);color:var(--mat-table-row-item-label-text-color, rgba(0, 0, 0, 0.87))}.mat-mdc-row,.mdc-data-table__content{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-table-row-item-label-text-font, Roboto, sans-serif);line-height:var(--mat-table-row-item-label-text-line-height);font-size:var(--mat-table-row-item-label-text-size, 14px);font-weight:var(--mat-table-row-item-label-text-weight)}.mat-mdc-footer-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-footer-container-height, 52px);color:var(--mat-table-row-item-label-text-color, rgba(0, 0, 0, 0.87));font-family:var(--mat-table-footer-supporting-text-font, Roboto, sans-serif);line-height:var(--mat-table-footer-supporting-text-line-height);font-size:var(--mat-table-footer-supporting-text-size, 14px);font-weight:var(--mat-table-footer-supporting-text-weight);letter-spacing:var(--mat-table-footer-supporting-text-tracking)}.mat-mdc-header-cell{border-bottom-color:var(--mat-table-row-item-outline-color, rgba(0, 0, 0, 0.12));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-header-headline-tracking);font-weight:inherit;line-height:inherit}.mat-mdc-cell{border-bottom-color:var(--mat-table-row-item-outline-color, rgba(0, 0, 0, 0.12));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-row-item-label-text-tracking);line-height:inherit}.mdc-data-table__row:last-child .mat-mdc-cell{border-bottom:none}.mat-mdc-footer-cell{letter-spacing:var(--mat-table-row-item-label-text-tracking)}mat-row.mat-mdc-row,mat-header-row.mat-mdc-header-row,mat-footer-row.mat-mdc-footer-row{border-bottom:none}.mat-mdc-table tbody,.mat-mdc-table tfoot,.mat-mdc-table thead,.mat-mdc-cell,.mat-mdc-footer-cell,.mat-mdc-header-row,.mat-mdc-row,.mat-mdc-footer-row,.mat-mdc-table .mat-mdc-header-cell{background:inherit}.mat-mdc-table mat-header-row.mat-mdc-header-row,.mat-mdc-table mat-row.mat-mdc-row,.mat-mdc-table mat-footer-row.mat-mdc-footer-cell{height:unset}mat-header-cell.mat-mdc-header-cell,mat-cell.mat-mdc-cell,mat-footer-cell.mat-mdc-footer-cell{align-self:stretch}"], dependencies: [{ kind: "directive", type: i1.DataRowOutlet, selector: "[rowOutlet]" }, { kind: "directive", type: i1.HeaderRowOutlet, selector: "[headerRowOutlet]" }, { kind: "directive", type: i1.FooterRowOutlet, selector: "[footerRowOutlet]" }, { kind: "directive", type: i1.NoDataRowOutlet, selector: "[noDataRowOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.0-rc.2", ngImport: i0, type: MatTable, decorators: [{
            type: Component,
            args: [{ selector: 'mat-table, table[mat-table]', exportAs: 'matTable', template: `
    <ng-content select="caption"></ng-content>
    <ng-content select="colgroup, col"></ng-content>
    <ng-container headerRowOutlet></ng-container>
    <ng-container rowOutlet></ng-container>
    <ng-container noDataRowOutlet></ng-container>
    <ng-container footerRowOutlet></ng-container>
  `, host: {
                        'class': 'mat-mdc-table mdc-data-table__table',
                        '[class.mdc-table-fixed-layout]': 'fixedLayout',
                        'ngSkipHydration': '',
                    }, providers: [
                        { provide: CdkTable, useExisting: MatTable },
                        { provide: CDK_TABLE, useExisting: MatTable },
                        { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
                        // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
                        //  is only included in the build if used.
                        { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
                        // Prevent nested tables from seeing this table's StickyPositioningListener.
                        { provide: STICKY_POSITIONING_LISTENER, useValue: null },
                    ], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, styles: [".mat-mdc-table-sticky{position:sticky !important}.mdc-data-table{-webkit-overflow-scrolling:touch;display:inline-flex;flex-direction:column;box-sizing:border-box;position:relative}.mdc-data-table__table-container{-webkit-overflow-scrolling:touch;overflow-x:auto;width:100%}.mdc-data-table__table{min-width:100%;border:0;white-space:nowrap;border-spacing:0;table-layout:fixed}.mdc-data-table__cell{box-sizing:border-box;overflow:hidden;text-align:left;text-overflow:ellipsis}[dir=rtl] .mdc-data-table__cell,.mdc-data-table__cell[dir=rtl]{text-align:right}.mdc-data-table__cell--numeric{text-align:right}[dir=rtl] .mdc-data-table__cell--numeric,.mdc-data-table__cell--numeric[dir=rtl]{text-align:left}.mdc-data-table__header-cell{box-sizing:border-box;text-overflow:ellipsis;overflow:hidden;outline:none;text-align:left}[dir=rtl] .mdc-data-table__header-cell,.mdc-data-table__header-cell[dir=rtl]{text-align:right}.mdc-data-table__header-cell--numeric{text-align:right}[dir=rtl] .mdc-data-table__header-cell--numeric,.mdc-data-table__header-cell--numeric[dir=rtl]{text-align:left}.mdc-data-table__header-cell-wrapper{align-items:center;display:inline-flex;vertical-align:middle}.mdc-data-table__cell,.mdc-data-table__header-cell{padding:0 16px 0 16px}.mdc-data-table__header-cell--checkbox,.mdc-data-table__cell--checkbox{padding-left:4px;padding-right:0}[dir=rtl] .mdc-data-table__header-cell--checkbox,[dir=rtl] .mdc-data-table__cell--checkbox,.mdc-data-table__header-cell--checkbox[dir=rtl],.mdc-data-table__cell--checkbox[dir=rtl]{padding-left:0;padding-right:4px}mat-table{display:block}mat-header-row{min-height:56px}mat-row,mat-footer-row{min-height:48px}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}.mat-mdc-table{table-layout:auto;white-space:normal;background-color:var(--mat-table-background-color)}.mat-mdc-header-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-header-container-height, 56px);color:var(--mat-table-header-headline-color, rgba(0, 0, 0, 0.87));font-family:var(--mat-table-header-headline-font, Roboto, sans-serif);line-height:var(--mat-table-header-headline-line-height);font-size:var(--mat-table-header-headline-size, 14px);font-weight:var(--mat-table-header-headline-weight, 500)}.mat-mdc-row{height:var(--mat-table-row-item-container-height, 52px);color:var(--mat-table-row-item-label-text-color, rgba(0, 0, 0, 0.87))}.mat-mdc-row,.mdc-data-table__content{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-table-row-item-label-text-font, Roboto, sans-serif);line-height:var(--mat-table-row-item-label-text-line-height);font-size:var(--mat-table-row-item-label-text-size, 14px);font-weight:var(--mat-table-row-item-label-text-weight)}.mat-mdc-footer-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-footer-container-height, 52px);color:var(--mat-table-row-item-label-text-color, rgba(0, 0, 0, 0.87));font-family:var(--mat-table-footer-supporting-text-font, Roboto, sans-serif);line-height:var(--mat-table-footer-supporting-text-line-height);font-size:var(--mat-table-footer-supporting-text-size, 14px);font-weight:var(--mat-table-footer-supporting-text-weight);letter-spacing:var(--mat-table-footer-supporting-text-tracking)}.mat-mdc-header-cell{border-bottom-color:var(--mat-table-row-item-outline-color, rgba(0, 0, 0, 0.12));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-header-headline-tracking);font-weight:inherit;line-height:inherit}.mat-mdc-cell{border-bottom-color:var(--mat-table-row-item-outline-color, rgba(0, 0, 0, 0.12));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-row-item-label-text-tracking);line-height:inherit}.mdc-data-table__row:last-child .mat-mdc-cell{border-bottom:none}.mat-mdc-footer-cell{letter-spacing:var(--mat-table-row-item-label-text-tracking)}mat-row.mat-mdc-row,mat-header-row.mat-mdc-header-row,mat-footer-row.mat-mdc-footer-row{border-bottom:none}.mat-mdc-table tbody,.mat-mdc-table tfoot,.mat-mdc-table thead,.mat-mdc-cell,.mat-mdc-footer-cell,.mat-mdc-header-row,.mat-mdc-row,.mat-mdc-footer-row,.mat-mdc-table .mat-mdc-header-cell{background:inherit}.mat-mdc-table mat-header-row.mat-mdc-header-row,.mat-mdc-table mat-row.mat-mdc-row,.mat-mdc-table mat-footer-row.mat-mdc-footer-cell{height:unset}mat-header-cell.mat-mdc-header-cell,mat-cell.mat-mdc-cell,mat-footer-cell.mat-mdc-footer-cell{align-self:stretch}"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsU0FBUyxFQUVULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsUUFBUSxFQUNSLHdCQUF3QixFQUN4QiwwQkFBMEIsRUFDMUIsU0FBUyxFQUNULDJCQUEyQixHQUM1QixNQUFNLG9CQUFvQixDQUFDO0FBQzVCLE9BQU8sRUFDTCw0QkFBNEIsRUFDNUIsNEJBQTRCLEVBQzVCLHVCQUF1QixHQUN4QixNQUFNLDBCQUEwQixDQUFDOzs7QUFFbEM7OztHQUdHO0FBS0gsTUFBTSxPQUFPLGNBQWM7bUhBQWQsY0FBYzt1R0FBZCxjQUFjLGdGQUZkLENBQUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLDRCQUE0QixFQUFDLENBQUM7O2dHQUU1RSxjQUFjO2tCQUoxQixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx1REFBdUQ7b0JBQ2pFLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBQyxDQUFDO2lCQUN4Rjs7QUFzQ0QsTUFBTSxPQUFPLFFBQVksU0FBUSxRQUFXO0lBbkM1Qzs7UUFvQ0UsNERBQTREO1FBQ3pDLG1CQUFjLEdBQUcsc0JBQXNCLENBQUM7UUFFM0QsNkZBQTZGO1FBQzFFLGlDQUE0QixHQUFHLEtBQUssQ0FBQztLQWF6RDtJQVhVLFFBQVE7UUFDZixLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFakIsNEZBQTRGO1FBQzVGLDhGQUE4RjtRQUM5RiwrRkFBK0Y7UUFDL0YsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDM0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BFLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDaEQ7SUFDSCxDQUFDO21IQWpCVSxRQUFRO3VHQUFSLFFBQVEsNk5BZlI7WUFDVCxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBQztZQUMxQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBQztZQUMzQyxFQUFDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxRQUFRLEVBQUUsd0JBQXdCLEVBQUM7WUFDekUsZ0dBQWdHO1lBQ2hHLDBDQUEwQztZQUMxQyxFQUFDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsNEJBQTRCLEVBQUM7WUFDMUUsNEVBQTRFO1lBQzVFLEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7U0FDdkQseUVBdkJTOzs7Ozs7O0dBT1Q7O2dHQXNCVSxRQUFRO2tCQW5DcEIsU0FBUzsrQkFDRSw2QkFBNkIsWUFDN0IsVUFBVSxZQUlWOzs7Ozs7O0dBT1QsUUFFSzt3QkFDSixPQUFPLEVBQUUscUNBQXFDO3dCQUM5QyxnQ0FBZ0MsRUFBRSxhQUFhO3dCQUMvQyxpQkFBaUIsRUFBRSxFQUFFO3FCQUN0QixhQUNVO3dCQUNULEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLFVBQVUsRUFBQzt3QkFDMUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsVUFBVSxFQUFDO3dCQUMzQyxFQUFDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxRQUFRLEVBQUUsd0JBQXdCLEVBQUM7d0JBQ3pFLGdHQUFnRzt3QkFDaEcsMENBQTBDO3dCQUMxQyxFQUFDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsNEJBQTRCLEVBQUM7d0JBQzFFLDRFQUE0RTt3QkFDNUUsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztxQkFDdkQsaUJBQ2MsaUJBQWlCLENBQUMsSUFBSSxtQkFHcEIsdUJBQXVCLENBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIE9uSW5pdCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ2RrVGFibGUsXG4gIF9Db2FsZXNjZWRTdHlsZVNjaGVkdWxlcixcbiAgX0NPQUxFU0NFRF9TVFlMRV9TQ0hFRFVMRVIsXG4gIENES19UQUJMRSxcbiAgU1RJQ0tZX1BPU0lUSU9OSU5HX0xJU1RFTkVSLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGFibGUnO1xuaW1wb3J0IHtcbiAgX0Rpc3Bvc2VWaWV3UmVwZWF0ZXJTdHJhdGVneSxcbiAgX1JlY3ljbGVWaWV3UmVwZWF0ZXJTdHJhdGVneSxcbiAgX1ZJRVdfUkVQRUFURVJfU1RSQVRFR1ksXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2xsZWN0aW9ucyc7XG5cbi8qKlxuICogRW5hYmxlcyB0aGUgcmVjeWNsZSB2aWV3IHJlcGVhdGVyIHN0cmF0ZWd5LCB3aGljaCByZWR1Y2VzIHJlbmRlcmluZyBsYXRlbmN5LiBOb3QgY29tcGF0aWJsZSB3aXRoXG4gKiB0YWJsZXMgdGhhdCBhbmltYXRlIHJvd3MuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC10YWJsZVtyZWN5Y2xlUm93c10sIHRhYmxlW21hdC10YWJsZV1bcmVjeWNsZVJvd3NdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IF9WSUVXX1JFUEVBVEVSX1NUUkFURUdZLCB1c2VDbGFzczogX1JlY3ljbGVWaWV3UmVwZWF0ZXJTdHJhdGVneX1dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRSZWN5Y2xlUm93cyB7fVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtdGFibGUsIHRhYmxlW21hdC10YWJsZV0nLFxuICBleHBvcnRBczogJ21hdFRhYmxlJyxcbiAgLy8gTm90ZSB0aGF0IGFjY29yZGluZyB0byBNRE4sIHRoZSBgY2FwdGlvbmAgZWxlbWVudCBoYXMgdG8gYmUgcHJvamVjdGVkIGFzIHRoZSAqKmZpcnN0KipcbiAgLy8gZWxlbWVudCBpbiB0aGUgdGFibGUuIFNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVE1ML0VsZW1lbnQvY2FwdGlvblxuICAvLyBXZSBjYW4ndCByZXVzZSBgQ0RLX1RBQkxFX1RFTVBMQVRFYCBiZWNhdXNlIGl0J3MgaW5jb21wYXRpYmxlIHdpdGggbG9jYWwgY29tcGlsYXRpb24gbW9kZS5cbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGVudCBzZWxlY3Q9XCJjYXB0aW9uXCI+PC9uZy1jb250ZW50PlxuICAgIDxuZy1jb250ZW50IHNlbGVjdD1cImNvbGdyb3VwLCBjb2xcIj48L25nLWNvbnRlbnQ+XG4gICAgPG5nLWNvbnRhaW5lciBoZWFkZXJSb3dPdXRsZXQ+PC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciByb3dPdXRsZXQ+PC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciBub0RhdGFSb3dPdXRsZXQ+PC9uZy1jb250YWluZXI+XG4gICAgPG5nLWNvbnRhaW5lciBmb290ZXJSb3dPdXRsZXQ+PC9uZy1jb250YWluZXI+XG4gIGAsXG4gIHN0eWxlVXJsczogWyd0YWJsZS5jc3MnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWRjLXRhYmxlIG1kYy1kYXRhLXRhYmxlX190YWJsZScsXG4gICAgJ1tjbGFzcy5tZGMtdGFibGUtZml4ZWQtbGF5b3V0XSc6ICdmaXhlZExheW91dCcsXG4gICAgJ25nU2tpcEh5ZHJhdGlvbic6ICcnLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogQ2RrVGFibGUsIHVzZUV4aXN0aW5nOiBNYXRUYWJsZX0sXG4gICAge3Byb3ZpZGU6IENES19UQUJMRSwgdXNlRXhpc3Rpbmc6IE1hdFRhYmxlfSxcbiAgICB7cHJvdmlkZTogX0NPQUxFU0NFRF9TVFlMRV9TQ0hFRFVMRVIsIHVzZUNsYXNzOiBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXJ9LFxuICAgIC8vIFRPRE8obWljaGFlbGphbWVzcGFyc29ucykgQWJzdHJhY3QgdGhlIHZpZXcgcmVwZWF0ZXIgc3RyYXRlZ3kgdG8gYSBkaXJlY3RpdmUgQVBJIHNvIHRoaXMgY29kZVxuICAgIC8vICBpcyBvbmx5IGluY2x1ZGVkIGluIHRoZSBidWlsZCBpZiB1c2VkLlxuICAgIHtwcm92aWRlOiBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSwgdXNlQ2xhc3M6IF9EaXNwb3NlVmlld1JlcGVhdGVyU3RyYXRlZ3l9LFxuICAgIC8vIFByZXZlbnQgbmVzdGVkIHRhYmxlcyBmcm9tIHNlZWluZyB0aGlzIHRhYmxlJ3MgU3RpY2t5UG9zaXRpb25pbmdMaXN0ZW5lci5cbiAgICB7cHJvdmlkZTogU1RJQ0tZX1BPU0lUSU9OSU5HX0xJU1RFTkVSLCB1c2VWYWx1ZTogbnVsbH0sXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIFNlZSBub3RlIG9uIENka1RhYmxlIGZvciBleHBsYW5hdGlvbiBvbiB3aHkgdGhpcyB1c2VzIHRoZSBkZWZhdWx0IGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3kuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFibGU8VD4gZXh0ZW5kcyBDZGtUYWJsZTxUPiBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIC8qKiBPdmVycmlkZXMgdGhlIHN0aWNreSBDU1MgY2xhc3Mgc2V0IGJ5IHRoZSBgQ2RrVGFibGVgLiAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgc3RpY2t5Q3NzQ2xhc3MgPSAnbWF0LW1kYy10YWJsZS1zdGlja3knO1xuXG4gIC8qKiBPdmVycmlkZXMgdGhlIG5lZWQgdG8gYWRkIHBvc2l0aW9uOiBzdGlja3kgb24gZXZlcnkgc3RpY2t5IGNlbGwgZWxlbWVudCBpbiBgQ2RrVGFibGVgLiAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgbmVlZHNQb3NpdGlvblN0aWNreU9uRWxlbWVudCA9IGZhbHNlO1xuXG4gIG92ZXJyaWRlIG5nT25Jbml0KCkge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG5cbiAgICAvLyBBZnRlciBuZ09uSW5pdCwgdGhlIGBDZGtUYWJsZWAgaGFzIGNyZWF0ZWQgYW5kIGluc2VydGVkIHRoZSB0YWJsZSBzZWN0aW9ucyAodGhlYWQsIHRib2R5LFxuICAgIC8vIHRmb290KS4gTURDIHJlcXVpcmVzIHRoZSBgbWRjLWRhdGEtdGFibGVfX2NvbnRlbnRgIGNsYXNzIHRvIGJlIGFkZGVkIHRvIHRoZSBib2R5LiBOb3RlIHRoYXRcbiAgICAvLyB0aGlzIG9ubHkgYXBwbGllcyB0byBuYXRpdmUgdGFibGVzLCBiZWNhdXNlIHdlIGRvbid0IHdyYXAgdGhlIGNvbnRlbnQgb2YgZmxleGJveC1iYXNlZCBvbmVzLlxuICAgIGlmICh0aGlzLl9pc05hdGl2ZUh0bWxUYWJsZSkge1xuICAgICAgY29uc3QgdGJvZHkgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcigndGJvZHknKTtcbiAgICAgIHRib2R5LmNsYXNzTGlzdC5hZGQoJ21kYy1kYXRhLXRhYmxlX19jb250ZW50Jyk7XG4gICAgfVxuICB9XG59XG4iXX0=
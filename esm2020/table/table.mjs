/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation, } from '@angular/core';
import { CDK_TABLE_TEMPLATE, CdkTable, _CoalescedStyleScheduler, _COALESCED_STYLE_SCHEDULER, CDK_TABLE, STICKY_POSITIONING_LISTENER, } from '@angular/cdk/table';
import { _DisposeViewRepeaterStrategy, _RecycleViewRepeaterStrategy, _VIEW_REPEATER_STRATEGY, } from '@angular/cdk/collections';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/table";
/**
 * Enables the recycle view repeater strategy, which reduces rendering latency. Not compatible with
 * tables that animate rows.
 */
export class MatRecycleRows {
}
MatRecycleRows.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0-next.1", ngImport: i0, type: MatRecycleRows, deps: [], target: i0.ɵɵFactoryTarget.Directive });
MatRecycleRows.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.0.0-next.1", type: MatRecycleRows, selector: "mat-table[recycleRows], table[mat-table][recycleRows]", providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }], ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0-next.1", ngImport: i0, type: MatRecycleRows, decorators: [{
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
}
MatTable.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0-next.1", ngImport: i0, type: MatTable, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatTable.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0-next.1", type: MatTable, selector: "mat-table, table[mat-table]", host: { properties: { "class.mdc-table-fixed-layout": "fixedLayout" }, classAttribute: "mat-mdc-table mdc-data-table__table" }, providers: [
        { provide: CdkTable, useExisting: MatTable },
        { provide: CDK_TABLE, useExisting: MatTable },
        { provide: _COALESCED_STYLE_SCHEDULER, useClass: _CoalescedStyleScheduler },
        // TODO(michaeljamesparsons) Abstract the view repeater strategy to a directive API so this code
        //  is only included in the build if used.
        { provide: _VIEW_REPEATER_STRATEGY, useClass: _DisposeViewRepeaterStrategy },
        // Prevent nested tables from seeing this table's StickyPositioningListener.
        { provide: STICKY_POSITIONING_LISTENER, useValue: null },
    ], exportAs: ["matTable"], usesInheritance: true, ngImport: i0, template: "\n  <ng-content select=\"caption\"></ng-content>\n  <ng-content select=\"colgroup, col\"></ng-content>\n  <ng-container headerRowOutlet></ng-container>\n  <ng-container rowOutlet></ng-container>\n  <ng-container noDataRowOutlet></ng-container>\n  <ng-container footerRowOutlet></ng-container>\n", isInline: true, styles: [".mdc-data-table{border-radius:var(--mdc-shape-medium, 4px);border-width:1px;border-style:solid;-webkit-overflow-scrolling:touch;display:inline-flex;flex-direction:column;box-sizing:border-box;position:relative}.mdc-data-table .mdc-data-table__header-cell:first-child{border-top-left-radius:var(--mdc-shape-medium, 4px)}[dir=rtl] .mdc-data-table .mdc-data-table__header-cell:first-child,.mdc-data-table .mdc-data-table__header-cell:first-child[dir=rtl]{border-top-right-radius:var(--mdc-shape-medium, 4px);border-top-left-radius:0}.mdc-data-table .mdc-data-table__header-cell:last-child{border-top-right-radius:var(--mdc-shape-medium, 4px)}[dir=rtl] .mdc-data-table .mdc-data-table__header-cell:last-child,.mdc-data-table .mdc-data-table__header-cell:last-child[dir=rtl]{border-top-left-radius:var(--mdc-shape-medium, 4px);border-top-right-radius:0}.mdc-data-table.mdc-data-table--without-footer .mdc-data-table__row:last-child .mdc-data-table__cell:first-child{border-bottom-left-radius:var(--mdc-shape-medium, 4px)}[dir=rtl] .mdc-data-table.mdc-data-table--without-footer .mdc-data-table__row:last-child .mdc-data-table__cell:first-child,.mdc-data-table.mdc-data-table--without-footer .mdc-data-table__row:last-child .mdc-data-table__cell:first-child[dir=rtl]{border-bottom-right-radius:var(--mdc-shape-medium, 4px);border-bottom-left-radius:0}.mdc-data-table.mdc-data-table--without-footer .mdc-data-table__row:last-child .mdc-data-table__cell:last-child{border-bottom-right-radius:var(--mdc-shape-medium, 4px)}[dir=rtl] .mdc-data-table.mdc-data-table--without-footer .mdc-data-table__row:last-child .mdc-data-table__cell:last-child,.mdc-data-table.mdc-data-table--without-footer .mdc-data-table__row:last-child .mdc-data-table__cell:last-child[dir=rtl]{border-bottom-left-radius:var(--mdc-shape-medium, 4px);border-bottom-right-radius:0}.mdc-data-table__cell,.mdc-data-table__header-cell{border-bottom-width:1px;border-bottom-style:solid}.mdc-data-table__pagination{border-top-width:1px;border-top-style:solid}.mdc-data-table__row:last-child .mdc-data-table__cell{border-bottom:none}.mdc-data-table__row{height:52px}.mdc-data-table__pagination{min-height:52px}.mdc-data-table__header-row{height:56px}.mdc-data-table__cell,.mdc-data-table__header-cell{padding:0 16px 0 16px}.mdc-data-table__header-cell--checkbox,.mdc-data-table__cell--checkbox{padding-left:4px;padding-right:0}[dir=rtl] .mdc-data-table__header-cell--checkbox,[dir=rtl] .mdc-data-table__cell--checkbox,.mdc-data-table__header-cell--checkbox[dir=rtl],.mdc-data-table__cell--checkbox[dir=rtl]{padding-left:0;padding-right:4px}.mdc-data-table__table-container{-webkit-overflow-scrolling:touch;overflow-x:auto;width:100%}.mdc-data-table__table{min-width:100%;border:0;white-space:nowrap;border-spacing:0;table-layout:fixed}.mdc-data-table__cell{box-sizing:border-box;overflow:hidden;text-align:left;text-overflow:ellipsis}[dir=rtl] .mdc-data-table__cell,.mdc-data-table__cell[dir=rtl]{text-align:right}.mdc-data-table__cell--numeric{text-align:right}[dir=rtl] .mdc-data-table__cell--numeric,.mdc-data-table__cell--numeric[dir=rtl]{text-align:left}.mdc-data-table__cell--checkbox{width:1px}.mdc-data-table__header-cell{box-sizing:border-box;text-overflow:ellipsis;overflow:hidden;outline:none;text-align:left}[dir=rtl] .mdc-data-table__header-cell,.mdc-data-table__header-cell[dir=rtl]{text-align:right}.mdc-data-table__header-cell--checkbox{width:1px}.mdc-data-table__header-cell--numeric{text-align:right}[dir=rtl] .mdc-data-table__header-cell--numeric,.mdc-data-table__header-cell--numeric[dir=rtl]{text-align:left}.mdc-data-table__sort-icon-button{width:28px;height:28px;padding:2px;transform:rotate(0.0001deg);margin-left:4px;margin-right:0;opacity:0}.mdc-data-table__sort-icon-button .mdc-icon-button__focus-ring{max-height:28px;max-width:28px}.mdc-data-table__sort-icon-button.mdc-icon-button--reduced-size .mdc-icon-button__ripple{width:28px;height:28px;margin-top:0px;margin-bottom:0px;margin-right:0px;margin-left:0px}.mdc-data-table__sort-icon-button.mdc-icon-button--reduced-size .mdc-icon-button__focus-ring{max-height:28px;max-width:28px}.mdc-data-table__sort-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:28px;left:50%;width:28px;transform:translate(-50%, -50%)}[dir=rtl] .mdc-data-table__sort-icon-button,.mdc-data-table__sort-icon-button[dir=rtl]{margin-left:0;margin-right:4px}.mdc-data-table__header-cell--numeric .mdc-data-table__sort-icon-button{margin-left:0;margin-right:4px}[dir=rtl] .mdc-data-table__header-cell--numeric .mdc-data-table__sort-icon-button,.mdc-data-table__header-cell--numeric .mdc-data-table__sort-icon-button[dir=rtl]{margin-left:4px;margin-right:0}.mdc-data-table__header-cell--sorted-descending .mdc-data-table__sort-icon-button{transform:rotate(-180deg)}.mdc-data-table__sort-icon-button:focus,.mdc-data-table__header-cell:hover .mdc-data-table__sort-icon-button,.mdc-data-table__header-cell--sorted .mdc-data-table__sort-icon-button{opacity:1}.mdc-data-table__header-cell-wrapper{align-items:center;display:inline-flex;vertical-align:middle}.mdc-data-table__header-cell--with-sort{cursor:pointer}.mdc-data-table__sort-status-label{clip:rect(1px, 1px, 1px, 1px);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px}.mdc-data-table--sticky-header .mdc-data-table__header-cell{position:sticky;top:0;z-index:1}mat-table{display:block}mat-header-row{min-height:56px}mat-row,mat-footer-row{min-height:48px}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}.mat-mdc-table-sticky{position:sticky !important}.mat-mdc-table{table-layout:auto;white-space:normal}mat-row.mat-mdc-row,mat-header-row.mat-mdc-header-row,mat-footer-row.mat-mdc-footer-row{border-bottom:none}.mat-mdc-table tbody,.mat-mdc-table tfoot,.mat-mdc-table thead,.mat-mdc-cell,.mat-mdc-footer-cell,.mat-mdc-header-row,.mat-mdc-row,.mat-mdc-footer-row,.mat-mdc-table .mat-mdc-header-cell{background:inherit}.mat-mdc-table .mat-mdc-row:hover,.mat-mdc-table .mat-mdc-footer-row:hover{background-color:inherit}.mat-mdc-table mat-header-row.mat-mdc-header-row,.mat-mdc-table mat-row.mat-mdc-row,.mat-mdc-table mat-footer-row.mat-mdc-footer-cell{height:unset}mat-header-cell.mat-mdc-header-cell,mat-cell.mat-mdc-cell,mat-footer-cell.mat-mdc-footer-cell{align-self:stretch}"], dependencies: [{ kind: "directive", type: i1.DataRowOutlet, selector: "[rowOutlet]" }, { kind: "directive", type: i1.HeaderRowOutlet, selector: "[headerRowOutlet]" }, { kind: "directive", type: i1.FooterRowOutlet, selector: "[footerRowOutlet]" }, { kind: "directive", type: i1.NoDataRowOutlet, selector: "[noDataRowOutlet]" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0-next.1", ngImport: i0, type: MatTable, decorators: [{
            type: Component,
            args: [{ selector: 'mat-table, table[mat-table]', exportAs: 'matTable', template: CDK_TABLE_TEMPLATE, host: {
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
                    ], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, styles: [".mdc-data-table{border-radius:var(--mdc-shape-medium, 4px);border-width:1px;border-style:solid;-webkit-overflow-scrolling:touch;display:inline-flex;flex-direction:column;box-sizing:border-box;position:relative}.mdc-data-table .mdc-data-table__header-cell:first-child{border-top-left-radius:var(--mdc-shape-medium, 4px)}[dir=rtl] .mdc-data-table .mdc-data-table__header-cell:first-child,.mdc-data-table .mdc-data-table__header-cell:first-child[dir=rtl]{border-top-right-radius:var(--mdc-shape-medium, 4px);border-top-left-radius:0}.mdc-data-table .mdc-data-table__header-cell:last-child{border-top-right-radius:var(--mdc-shape-medium, 4px)}[dir=rtl] .mdc-data-table .mdc-data-table__header-cell:last-child,.mdc-data-table .mdc-data-table__header-cell:last-child[dir=rtl]{border-top-left-radius:var(--mdc-shape-medium, 4px);border-top-right-radius:0}.mdc-data-table.mdc-data-table--without-footer .mdc-data-table__row:last-child .mdc-data-table__cell:first-child{border-bottom-left-radius:var(--mdc-shape-medium, 4px)}[dir=rtl] .mdc-data-table.mdc-data-table--without-footer .mdc-data-table__row:last-child .mdc-data-table__cell:first-child,.mdc-data-table.mdc-data-table--without-footer .mdc-data-table__row:last-child .mdc-data-table__cell:first-child[dir=rtl]{border-bottom-right-radius:var(--mdc-shape-medium, 4px);border-bottom-left-radius:0}.mdc-data-table.mdc-data-table--without-footer .mdc-data-table__row:last-child .mdc-data-table__cell:last-child{border-bottom-right-radius:var(--mdc-shape-medium, 4px)}[dir=rtl] .mdc-data-table.mdc-data-table--without-footer .mdc-data-table__row:last-child .mdc-data-table__cell:last-child,.mdc-data-table.mdc-data-table--without-footer .mdc-data-table__row:last-child .mdc-data-table__cell:last-child[dir=rtl]{border-bottom-left-radius:var(--mdc-shape-medium, 4px);border-bottom-right-radius:0}.mdc-data-table__cell,.mdc-data-table__header-cell{border-bottom-width:1px;border-bottom-style:solid}.mdc-data-table__pagination{border-top-width:1px;border-top-style:solid}.mdc-data-table__row:last-child .mdc-data-table__cell{border-bottom:none}.mdc-data-table__row{height:52px}.mdc-data-table__pagination{min-height:52px}.mdc-data-table__header-row{height:56px}.mdc-data-table__cell,.mdc-data-table__header-cell{padding:0 16px 0 16px}.mdc-data-table__header-cell--checkbox,.mdc-data-table__cell--checkbox{padding-left:4px;padding-right:0}[dir=rtl] .mdc-data-table__header-cell--checkbox,[dir=rtl] .mdc-data-table__cell--checkbox,.mdc-data-table__header-cell--checkbox[dir=rtl],.mdc-data-table__cell--checkbox[dir=rtl]{padding-left:0;padding-right:4px}.mdc-data-table__table-container{-webkit-overflow-scrolling:touch;overflow-x:auto;width:100%}.mdc-data-table__table{min-width:100%;border:0;white-space:nowrap;border-spacing:0;table-layout:fixed}.mdc-data-table__cell{box-sizing:border-box;overflow:hidden;text-align:left;text-overflow:ellipsis}[dir=rtl] .mdc-data-table__cell,.mdc-data-table__cell[dir=rtl]{text-align:right}.mdc-data-table__cell--numeric{text-align:right}[dir=rtl] .mdc-data-table__cell--numeric,.mdc-data-table__cell--numeric[dir=rtl]{text-align:left}.mdc-data-table__cell--checkbox{width:1px}.mdc-data-table__header-cell{box-sizing:border-box;text-overflow:ellipsis;overflow:hidden;outline:none;text-align:left}[dir=rtl] .mdc-data-table__header-cell,.mdc-data-table__header-cell[dir=rtl]{text-align:right}.mdc-data-table__header-cell--checkbox{width:1px}.mdc-data-table__header-cell--numeric{text-align:right}[dir=rtl] .mdc-data-table__header-cell--numeric,.mdc-data-table__header-cell--numeric[dir=rtl]{text-align:left}.mdc-data-table__sort-icon-button{width:28px;height:28px;padding:2px;transform:rotate(0.0001deg);margin-left:4px;margin-right:0;opacity:0}.mdc-data-table__sort-icon-button .mdc-icon-button__focus-ring{max-height:28px;max-width:28px}.mdc-data-table__sort-icon-button.mdc-icon-button--reduced-size .mdc-icon-button__ripple{width:28px;height:28px;margin-top:0px;margin-bottom:0px;margin-right:0px;margin-left:0px}.mdc-data-table__sort-icon-button.mdc-icon-button--reduced-size .mdc-icon-button__focus-ring{max-height:28px;max-width:28px}.mdc-data-table__sort-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:28px;left:50%;width:28px;transform:translate(-50%, -50%)}[dir=rtl] .mdc-data-table__sort-icon-button,.mdc-data-table__sort-icon-button[dir=rtl]{margin-left:0;margin-right:4px}.mdc-data-table__header-cell--numeric .mdc-data-table__sort-icon-button{margin-left:0;margin-right:4px}[dir=rtl] .mdc-data-table__header-cell--numeric .mdc-data-table__sort-icon-button,.mdc-data-table__header-cell--numeric .mdc-data-table__sort-icon-button[dir=rtl]{margin-left:4px;margin-right:0}.mdc-data-table__header-cell--sorted-descending .mdc-data-table__sort-icon-button{transform:rotate(-180deg)}.mdc-data-table__sort-icon-button:focus,.mdc-data-table__header-cell:hover .mdc-data-table__sort-icon-button,.mdc-data-table__header-cell--sorted .mdc-data-table__sort-icon-button{opacity:1}.mdc-data-table__header-cell-wrapper{align-items:center;display:inline-flex;vertical-align:middle}.mdc-data-table__header-cell--with-sort{cursor:pointer}.mdc-data-table__sort-status-label{clip:rect(1px, 1px, 1px, 1px);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px}.mdc-data-table--sticky-header .mdc-data-table__header-cell{position:sticky;top:0;z-index:1}mat-table{display:block}mat-header-row{min-height:56px}mat-row,mat-footer-row{min-height:48px}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}.mat-mdc-table-sticky{position:sticky !important}.mat-mdc-table{table-layout:auto;white-space:normal}mat-row.mat-mdc-row,mat-header-row.mat-mdc-header-row,mat-footer-row.mat-mdc-footer-row{border-bottom:none}.mat-mdc-table tbody,.mat-mdc-table tfoot,.mat-mdc-table thead,.mat-mdc-cell,.mat-mdc-footer-cell,.mat-mdc-header-row,.mat-mdc-row,.mat-mdc-footer-row,.mat-mdc-table .mat-mdc-header-cell{background:inherit}.mat-mdc-table .mat-mdc-row:hover,.mat-mdc-table .mat-mdc-footer-row:hover{background-color:inherit}.mat-mdc-table mat-header-row.mat-mdc-header-row,.mat-mdc-table mat-row.mat-mdc-row,.mat-mdc-table mat-footer-row.mat-mdc-footer-cell{height:unset}mat-header-cell.mat-mdc-header-cell,mat-cell.mat-mdc-cell,mat-footer-cell.mat-mdc-footer-cell{align-self:stretch}"] }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFibGUvdGFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsU0FBUyxFQUVULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsa0JBQWtCLEVBQ2xCLFFBQVEsRUFDUix3QkFBd0IsRUFDeEIsMEJBQTBCLEVBQzFCLFNBQVMsRUFDVCwyQkFBMkIsR0FDNUIsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QixPQUFPLEVBQ0wsNEJBQTRCLEVBQzVCLDRCQUE0QixFQUM1Qix1QkFBdUIsR0FDeEIsTUFBTSwwQkFBMEIsQ0FBQzs7O0FBRWxDOzs7R0FHRztBQUtILE1BQU0sT0FBTyxjQUFjOztrSEFBZCxjQUFjO3NHQUFkLGNBQWMsZ0ZBRmQsQ0FBQyxFQUFDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsNEJBQTRCLEVBQUMsQ0FBQztrR0FFNUUsY0FBYztrQkFKMUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsdURBQXVEO29CQUNqRSxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsNEJBQTRCLEVBQUMsQ0FBQztpQkFDeEY7O0FBMkJELE1BQU0sT0FBTyxRQUFZLFNBQVEsUUFBVztJQXhCNUM7O1FBeUJFLDREQUE0RDtRQUN6QyxtQkFBYyxHQUFHLHNCQUFzQixDQUFDO1FBRTNELDZGQUE2RjtRQUMxRSxpQ0FBNEIsR0FBRyxLQUFLLENBQUM7S0FhekQ7SUFYVSxRQUFRO1FBQ2YsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWpCLDRGQUE0RjtRQUM1Riw4RkFBOEY7UUFDOUYsK0ZBQStGO1FBQy9GLElBQUksSUFBSSxDQUFDLGtCQUFrQixFQUFFO1lBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNwRSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQ2hEO0lBQ0gsQ0FBQzs7NEdBakJVLFFBQVE7Z0dBQVIsUUFBUSxzTEFmUjtRQUNULEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFDO1FBQzFDLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFDO1FBQzNDLEVBQUMsT0FBTyxFQUFFLDBCQUEwQixFQUFFLFFBQVEsRUFBRSx3QkFBd0IsRUFBQztRQUN6RSxnR0FBZ0c7UUFDaEcsMENBQTBDO1FBQzFDLEVBQUMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFFBQVEsRUFBRSw0QkFBNEIsRUFBQztRQUMxRSw0RUFBNEU7UUFDNUUsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztLQUN2RDtrR0FNVSxRQUFRO2tCQXhCcEIsU0FBUzsrQkFDRSw2QkFBNkIsWUFDN0IsVUFBVSxZQUNWLGtCQUFrQixRQUV0Qjt3QkFDSixPQUFPLEVBQUUscUNBQXFDO3dCQUM5QyxnQ0FBZ0MsRUFBRSxhQUFhO3FCQUNoRCxhQUNVO3dCQUNULEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxXQUFXLFVBQVUsRUFBQzt3QkFDMUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsVUFBVSxFQUFDO3dCQUMzQyxFQUFDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxRQUFRLEVBQUUsd0JBQXdCLEVBQUM7d0JBQ3pFLGdHQUFnRzt3QkFDaEcsMENBQTBDO3dCQUMxQyxFQUFDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsNEJBQTRCLEVBQUM7d0JBQzFFLDRFQUE0RTt3QkFDNUUsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztxQkFDdkQsaUJBQ2MsaUJBQWlCLENBQUMsSUFBSSxtQkFHcEIsdUJBQXVCLENBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBEaXJlY3RpdmUsXG4gIE9uSW5pdCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgQ0RLX1RBQkxFX1RFTVBMQVRFLFxuICBDZGtUYWJsZSxcbiAgX0NvYWxlc2NlZFN0eWxlU2NoZWR1bGVyLFxuICBfQ09BTEVTQ0VEX1NUWUxFX1NDSEVEVUxFUixcbiAgQ0RLX1RBQkxFLFxuICBTVElDS1lfUE9TSVRJT05JTkdfTElTVEVORVIsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90YWJsZSc7XG5pbXBvcnQge1xuICBfRGlzcG9zZVZpZXdSZXBlYXRlclN0cmF0ZWd5LFxuICBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5LFxuICBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvbGxlY3Rpb25zJztcblxuLyoqXG4gKiBFbmFibGVzIHRoZSByZWN5Y2xlIHZpZXcgcmVwZWF0ZXIgc3RyYXRlZ3ksIHdoaWNoIHJlZHVjZXMgcmVuZGVyaW5nIGxhdGVuY3kuIE5vdCBjb21wYXRpYmxlIHdpdGhcbiAqIHRhYmxlcyB0aGF0IGFuaW1hdGUgcm93cy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LXRhYmxlW3JlY3ljbGVSb3dzXSwgdGFibGVbbWF0LXRhYmxlXVtyZWN5Y2xlUm93c10nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogX1ZJRVdfUkVQRUFURVJfU1RSQVRFR1ksIHVzZUNsYXNzOiBfUmVjeWNsZVZpZXdSZXBlYXRlclN0cmF0ZWd5fV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFJlY3ljbGVSb3dzIHt9XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC10YWJsZSwgdGFibGVbbWF0LXRhYmxlXScsXG4gIGV4cG9ydEFzOiAnbWF0VGFibGUnLFxuICB0ZW1wbGF0ZTogQ0RLX1RBQkxFX1RFTVBMQVRFLFxuICBzdHlsZVVybHM6IFsndGFibGUuY3NzJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy10YWJsZSBtZGMtZGF0YS10YWJsZV9fdGFibGUnLFxuICAgICdbY2xhc3MubWRjLXRhYmxlLWZpeGVkLWxheW91dF0nOiAnZml4ZWRMYXlvdXQnLFxuICB9LFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogQ2RrVGFibGUsIHVzZUV4aXN0aW5nOiBNYXRUYWJsZX0sXG4gICAge3Byb3ZpZGU6IENES19UQUJMRSwgdXNlRXhpc3Rpbmc6IE1hdFRhYmxlfSxcbiAgICB7cHJvdmlkZTogX0NPQUxFU0NFRF9TVFlMRV9TQ0hFRFVMRVIsIHVzZUNsYXNzOiBfQ29hbGVzY2VkU3R5bGVTY2hlZHVsZXJ9LFxuICAgIC8vIFRPRE8obWljaGFlbGphbWVzcGFyc29ucykgQWJzdHJhY3QgdGhlIHZpZXcgcmVwZWF0ZXIgc3RyYXRlZ3kgdG8gYSBkaXJlY3RpdmUgQVBJIHNvIHRoaXMgY29kZVxuICAgIC8vICBpcyBvbmx5IGluY2x1ZGVkIGluIHRoZSBidWlsZCBpZiB1c2VkLlxuICAgIHtwcm92aWRlOiBfVklFV19SRVBFQVRFUl9TVFJBVEVHWSwgdXNlQ2xhc3M6IF9EaXNwb3NlVmlld1JlcGVhdGVyU3RyYXRlZ3l9LFxuICAgIC8vIFByZXZlbnQgbmVzdGVkIHRhYmxlcyBmcm9tIHNlZWluZyB0aGlzIHRhYmxlJ3MgU3RpY2t5UG9zaXRpb25pbmdMaXN0ZW5lci5cbiAgICB7cHJvdmlkZTogU1RJQ0tZX1BPU0lUSU9OSU5HX0xJU1RFTkVSLCB1c2VWYWx1ZTogbnVsbH0sXG4gIF0sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIC8vIFNlZSBub3RlIG9uIENka1RhYmxlIGZvciBleHBsYW5hdGlvbiBvbiB3aHkgdGhpcyB1c2VzIHRoZSBkZWZhdWx0IGNoYW5nZSBkZXRlY3Rpb24gc3RyYXRlZ3kuXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VGFibGU8VD4gZXh0ZW5kcyBDZGtUYWJsZTxUPiBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIC8qKiBPdmVycmlkZXMgdGhlIHN0aWNreSBDU1MgY2xhc3Mgc2V0IGJ5IHRoZSBgQ2RrVGFibGVgLiAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgc3RpY2t5Q3NzQ2xhc3MgPSAnbWF0LW1kYy10YWJsZS1zdGlja3knO1xuXG4gIC8qKiBPdmVycmlkZXMgdGhlIG5lZWQgdG8gYWRkIHBvc2l0aW9uOiBzdGlja3kgb24gZXZlcnkgc3RpY2t5IGNlbGwgZWxlbWVudCBpbiBgQ2RrVGFibGVgLiAqL1xuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgbmVlZHNQb3NpdGlvblN0aWNreU9uRWxlbWVudCA9IGZhbHNlO1xuXG4gIG92ZXJyaWRlIG5nT25Jbml0KCkge1xuICAgIHN1cGVyLm5nT25Jbml0KCk7XG5cbiAgICAvLyBBZnRlciBuZ09uSW5pdCwgdGhlIGBDZGtUYWJsZWAgaGFzIGNyZWF0ZWQgYW5kIGluc2VydGVkIHRoZSB0YWJsZSBzZWN0aW9ucyAodGhlYWQsIHRib2R5LFxuICAgIC8vIHRmb290KS4gTURDIHJlcXVpcmVzIHRoZSBgbWRjLWRhdGEtdGFibGVfX2NvbnRlbnRgIGNsYXNzIHRvIGJlIGFkZGVkIHRvIHRoZSBib2R5LiBOb3RlIHRoYXRcbiAgICAvLyB0aGlzIG9ubHkgYXBwbGllcyB0byBuYXRpdmUgdGFibGVzLCBiZWNhdXNlIHdlIGRvbid0IHdyYXAgdGhlIGNvbnRlbnQgb2YgZmxleGJveC1iYXNlZCBvbmVzLlxuICAgIGlmICh0aGlzLl9pc05hdGl2ZUh0bWxUYWJsZSkge1xuICAgICAgY29uc3QgdGJvZHkgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcigndGJvZHknKTtcbiAgICAgIHRib2R5LmNsYXNzTGlzdC5hZGQoJ21kYy1kYXRhLXRhYmxlX19jb250ZW50Jyk7XG4gICAgfVxuICB9XG59XG4iXX0=
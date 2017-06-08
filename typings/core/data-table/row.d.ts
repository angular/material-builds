import { IterableDiffer, IterableDiffers, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { CdkCellDef } from './cell';
import { Subject } from 'rxjs/Subject';
/**
 * Base class for the CdkHeaderRowDef and CdkRowDef that handles checking their columns inputs
 * for changes and notifying the table.
 */
export declare abstract class BaseRowDef {
    template: TemplateRef<any>;
    protected _differs: IterableDiffers;
    /** The columns to be displayed on this row. */
    columns: string[];
    /** Event stream that emits when changes are made to the columns. */
    columnsChange: Subject<void>;
    /** Differ used to check if any changes were made to the columns. */
    protected _columnsDiffer: IterableDiffer<any>;
    private viewInitialized;
    constructor(template: TemplateRef<any>, _differs: IterableDiffers);
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngDoCheck(): void;
}
/**
 * Header row definition for the CDK data-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
export declare class CdkHeaderRowDef extends BaseRowDef {
    constructor(template: TemplateRef<any>, _differs: IterableDiffers);
}
/**
 * Data row definition for the CDK data-table.
 * Captures the header row's template and other row properties such as the columns to display.
 */
export declare class CdkRowDef extends BaseRowDef {
    constructor(template: TemplateRef<any>, _differs: IterableDiffers);
}
/**
 * Outlet for rendering cells inside of a row or header row.
 * @docs-private
 */
export declare class CdkCellOutlet {
    private _viewContainer;
    /** The ordered list of cells to render within this outlet's view container */
    cells: CdkCellDef[];
    /** The data context to be provided to each cell */
    context: any;
    /**
     * Static property containing the latest constructed instance of this class.
     * Used by the CDK data-table when each CdkHeaderRow and CdkRow component is created using
     * createEmbeddedView. After one of these components are created, this property will provide
     * a handle to provide that component's cells and context. After init, the CdkCellOutlet will
     * construct the cells with the provided context.
     */
    static mostRecentCellOutlet: CdkCellOutlet;
    constructor(_viewContainer: ViewContainerRef);
    ngOnInit(): void;
}
/** Header template container that contains the cell outlet. Adds the right class and role. */
export declare class CdkHeaderRow {
}
/** Data row template container that contains the cell outlet. Adds the right class and role. */
export declare class CdkRow {
}

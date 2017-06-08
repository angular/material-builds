import { ChangeDetectorRef, IterableDiffers, NgIterable, QueryList, ViewContainerRef } from '@angular/core';
import { CollectionViewer, DataSource } from './data-source';
import { CdkHeaderRowDef, CdkRowDef } from './row';
import { CdkCellDef, CdkColumnDef, CdkHeaderCellDef } from './cell';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/combineLatest';
/**
 * Provides a handle for the table to grab the view container's ng-container to insert data rows.
 * @docs-private
 */
export declare class RowPlaceholder {
    viewContainer: ViewContainerRef;
    constructor(viewContainer: ViewContainerRef);
}
/**
 * Provides a handle for the table to grab the view container's ng-container to insert the header.
 * @docs-private
 */
export declare class HeaderRowPlaceholder {
    viewContainer: ViewContainerRef;
    constructor(viewContainer: ViewContainerRef);
}
/**
 * A data table that connects with a data source to retrieve data of type T and renders
 * a header row and data rows. Updates the rows when new data is provided by the data source.
 */
export declare class CdkTable<T> implements CollectionViewer {
    private readonly _differs;
    private readonly _changeDetectorRef;
    /**
     * Provides a stream containing the latest data array to render. Influenced by the table's
     * stream of view window (what rows are currently on screen).
     */
    dataSource: DataSource<T>;
    /**
     * Stream containing the latest information on what rows are being displayed on screen.
     * Can be used by the data source to as a heuristic of what data should be provided.
     */
    viewChange: BehaviorSubject<{
        start: number;
        end: number;
    }>;
    /** Stream that emits when a row def has a change to its array of columns to render. */
    _columnsChange: Observable<void>;
    /**
     * Map of all the user's defined columns identified by name.
     * Contains the header and data-cell templates.
     */
    private _columnDefinitionsByName;
    /** Differ used to find the changes in the data provided by the data source. */
    private _dataDiffer;
    _rowPlaceholder: RowPlaceholder;
    _headerRowPlaceholder: HeaderRowPlaceholder;
    /**
     * The column definitions provided by the user that contain what the header and cells should
     * render for each column.
     */
    _columnDefinitions: QueryList<CdkColumnDef>;
    /** Template used as the header container. */
    _headerDefinition: CdkHeaderRowDef;
    /** Set of templates that used as the data row containers. */
    _rowDefinitions: QueryList<CdkRowDef>;
    constructor(_differs: IterableDiffers, _changeDetectorRef: ChangeDetectorRef);
    ngOnDestroy(): void;
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    /**
     * Create the embedded view for the header template and place it in the header row view container.
     */
    renderHeaderRow(): void;
    /** Check for changes made in the data and render each change (row added/removed/moved). */
    renderRowChanges(dataRows: NgIterable<T>): void;
    /**
     * Create the embedded view for the data row template and place it in the correct index location
     * within the data row view container.
     */
    insertRow(rowData: T, index: number): void;
    /**
     * Returns the cell template definitions to insert into the header
     * as defined by its list of columns to display.
     */
    getHeaderCellTemplatesForRow(headerDef: CdkHeaderRowDef): CdkHeaderCellDef[];
    /**
     * Returns the cell template definitions to insert in the provided row
     * as defined by its list of columns to display.
     */
    getCellTemplatesForRow(rowDef: CdkRowDef): CdkCellDef[];
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { OnChanges, OnInit, SimpleChanges, ElementRef } from '@angular/core';
import { MatDialog } from './dialog';
import { MatDialogRef } from './dialog-ref';
/**
 * Button that will close the current dialog.
 */
export declare class MatDialogClose implements OnInit, OnChanges {
    /**
     * Reference to the containing dialog.
     * @deprecated `dialogRef` property to become private.
     * @breaking-change 13.0.0
     */
    dialogRef: MatDialogRef<any>;
    private _elementRef;
    private _dialog;
    /** Screenreader label for the button. */
    ariaLabel: string;
    /** Default to "button" to prevents accidental form submits. */
    type: 'submit' | 'button' | 'reset';
    /** Dialog close input. */
    dialogResult: any;
    _matDialogClose: any;
    constructor(
    /**
     * Reference to the containing dialog.
     * @deprecated `dialogRef` property to become private.
     * @breaking-change 13.0.0
     */
    dialogRef: MatDialogRef<any>, _elementRef: ElementRef<HTMLElement>, _dialog: MatDialog);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    _onButtonClick(event: MouseEvent): void;
}
/**
 * Title of a dialog element. Stays fixed to the top of the dialog when scrolling.
 */
export declare class MatDialogTitle implements OnInit {
    private _dialogRef;
    private _elementRef;
    private _dialog;
    /** Unique id for the dialog title. If none is supplied, it will be auto-generated. */
    id: string;
    constructor(_dialogRef: MatDialogRef<any>, _elementRef: ElementRef<HTMLElement>, _dialog: MatDialog);
    ngOnInit(): void;
}
/**
 * Scrollable content container of a dialog.
 */
export declare class MatDialogContent {
}
/**
 * Container for the bottom action buttons in a dialog.
 * Stays fixed to the bottom when scrolling.
 */
export declare class MatDialogActions {
}

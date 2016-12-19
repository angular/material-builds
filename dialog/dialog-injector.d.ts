import { Injector } from '@angular/core';
import { MdDialogRef } from './dialog-ref';
/** Custom injector type specifically for instantiating components with a dialog. */
export declare class DialogInjector implements Injector {
    private _dialogRef;
    private _parentInjector;
    constructor(_dialogRef: MdDialogRef<any>, _parentInjector: Injector);
    get(token: any, notFoundValue?: any): any;
}

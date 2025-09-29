import { BooleanInput } from '@angular/cdk/coercion';
import * as i0 from '@angular/core';
import * as i2 from '@angular/cdk/bidi';

declare class MatDivider {
    /** Whether the divider is vertically aligned. */
    get vertical(): boolean;
    set vertical(value: BooleanInput);
    private _vertical;
    /** Whether the divider is an inset divider. */
    get inset(): boolean;
    set inset(value: BooleanInput);
    private _inset;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDivider, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatDivider, "mat-divider", never, { "vertical": { "alias": "vertical"; "required": false; }; "inset": { "alias": "inset"; "required": false; }; }, {}, never, never, true, never>;
}

declare class MatDividerModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatDividerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatDividerModule, never, [typeof MatDivider], [typeof MatDivider, typeof i2.BidiModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatDividerModule>;
}

export { MatDivider, MatDividerModule };

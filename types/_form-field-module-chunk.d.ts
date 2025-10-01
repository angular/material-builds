import * as i0 from '@angular/core';
import * as i1 from '@angular/cdk/observers';
import { MatFormField, MatError, MatHint, MatPrefix, MatSuffix } from './_form-field-chunk.js';
import * as i2 from '@angular/cdk/bidi';

/** The floating label for a `mat-form-field`. */
declare class MatLabel {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLabel, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatLabel, "mat-label", never, {}, {}, never, never, true, never>;
}

declare class MatFormFieldModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatFormFieldModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatFormFieldModule, never, [typeof i1.ObserversModule, typeof MatFormField, typeof MatLabel, typeof MatError, typeof MatHint, typeof MatPrefix, typeof MatSuffix], [typeof MatFormField, typeof MatLabel, typeof MatHint, typeof MatError, typeof MatPrefix, typeof MatSuffix, typeof i2.BidiModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatFormFieldModule>;
}

export { MatFormFieldModule, MatLabel };

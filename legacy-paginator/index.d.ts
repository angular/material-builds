import { ChangeDetectorRef } from '@angular/core';
import * as i0 from '@angular/core';
import * as i2 from '@angular/common';
import * as i3 from '@angular/material/legacy-button';
import * as i4 from '@angular/material/legacy-select';
import * as i5 from '@angular/material/legacy-tooltip';
import * as i6 from '@angular/material/core';
import { InjectionToken } from '@angular/core';
import { MAT_PAGINATOR_INTL_PROVIDER } from '@angular/material/paginator';
import { MAT_PAGINATOR_INTL_PROVIDER_FACTORY } from '@angular/material/paginator';
import { MatLegacyFormFieldAppearance } from '@angular/material/legacy-form-field';
import { _MatPaginatorBase } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorSelectConfig } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

declare namespace i1 {
    export {
        MatPaginatorDefaultOptions,
        MAT_PAGINATOR_DEFAULT_OPTIONS,
        MatLegacyPaginator
    }
}

/** Injection token that can be used to provide the default options for the paginator module. */
export declare const MAT_PAGINATOR_DEFAULT_OPTIONS: InjectionToken<MatPaginatorDefaultOptions>;

export { MAT_PAGINATOR_INTL_PROVIDER }

export { MAT_PAGINATOR_INTL_PROVIDER_FACTORY }

/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
export declare class MatLegacyPaginator extends _MatPaginatorBase<MatPaginatorDefaultOptions> {
    /** If set, styles the "page size" form field with the designated style. */
    _formFieldAppearance?: MatLegacyFormFieldAppearance;
    constructor(intl: MatPaginatorIntl, changeDetectorRef: ChangeDetectorRef, defaults?: MatPaginatorDefaultOptions);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLegacyPaginator, [null, null, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatLegacyPaginator, "mat-paginator", ["matPaginator"], { "disabled": "disabled"; }, {}, never, never, false>;
}

export declare class MatLegacyPaginatorModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLegacyPaginatorModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatLegacyPaginatorModule, [typeof i1.MatLegacyPaginator], [typeof i2.CommonModule, typeof i3.MatLegacyButtonModule, typeof i4.MatLegacySelectModule, typeof i5.MatLegacyTooltipModule, typeof i6.MatCommonModule], [typeof i1.MatLegacyPaginator]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatLegacyPaginatorModule>;
}

export { _MatPaginatorBase }

/** Object that can be used to configure the default options for the paginator module. */
export declare interface MatPaginatorDefaultOptions {
    /** Number of items to display on a page. By default set to 50. */
    pageSize?: number;
    /** The set of provided page size options to display to the user. */
    pageSizeOptions?: number[];
    /** Whether to hide the page size selection UI from the user. */
    hidePageSize?: boolean;
    /** Whether to show the first/last buttons UI to the user. */
    showFirstLastButtons?: boolean;
    /** The default form-field appearance to apply to the page size options selector. */
    formFieldAppearance?: MatLegacyFormFieldAppearance;
}

export { MatPaginatorIntl }

export { MatPaginatorSelectConfig }

export { PageEvent }

export { }

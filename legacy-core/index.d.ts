import { AnimationCurves } from '@angular/material/core';
import { AnimationDurations } from '@angular/material/core';
import { CanColor } from '@angular/material/core';
import { CanDisable } from '@angular/material/core';
import { CanDisableRipple } from '@angular/material/core';
import { CanUpdateErrorState } from '@angular/material/core';
import { ChangeDetectorRef } from '@angular/core';
import { _countGroupLabelsBeforeOption } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { defaultRippleAnimationConfig } from '@angular/material/core';
import { ElementRef } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { _getOptionScrollPosition } from '@angular/material/core';
import { GranularSanityChecks } from '@angular/material/core';
import { HasInitialized } from '@angular/material/core';
import { HasTabIndex } from '@angular/material/core';
import * as i0 from '@angular/core';
import * as i3 from '@angular/material/core';
import * as i4 from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DATE_LOCALE_FACTORY } from '@angular/material/core';
import { MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { MAT_OPTGROUP } from '@angular/material/core';
import { MAT_OPTION_PARENT_COMPONENT } from '@angular/material/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatCommonModule as MatLegacyCommonModule } from '@angular/material/core';
import { MatDateFormats as MatLegacyDateFormats } from '@angular/material/core';
import { MatLineModule as MatLegacyLineModule } from '@angular/material/core';
import { MatNativeDateModule as MatLegacyNativeDateModule } from '@angular/material/core';
import { MatPseudoCheckbox as MatLegacyPseudoCheckbox } from '@angular/material/core';
import { MatPseudoCheckboxModule as MatLegacyPseudoCheckboxModule } from '@angular/material/core';
import { MatPseudoCheckboxState as MatLegacyPseudoCheckboxState } from '@angular/material/core';
import { MatRipple as MatLegacyRipple } from '@angular/material/core';
import { MatRippleModule as MatLegacyRippleModule } from '@angular/material/core';
import { MatLine } from '@angular/material/core';
import { _MatOptgroupBase } from '@angular/material/core';
import { _MatOptionBase } from '@angular/material/core';
import { MatOptionParentComponent } from '@angular/material/core';
import { MatOptionSelectionChange } from '@angular/material/core';
import { mixinColor } from '@angular/material/core';
import { mixinDisabled } from '@angular/material/core';
import { mixinDisableRipple } from '@angular/material/core';
import { mixinErrorState } from '@angular/material/core';
import { mixinInitialized } from '@angular/material/core';
import { mixinTabIndex } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';
import { NativeDateModule } from '@angular/material/core';
import { RippleAnimationConfig } from '@angular/material/core';
import { RippleConfig } from '@angular/material/core';
import { RippleGlobalOptions } from '@angular/material/core';
import { RippleRef } from '@angular/material/core';
import { RippleRenderer } from '@angular/material/core';
import { RippleState } from '@angular/material/core';
import { RippleTarget } from '@angular/material/core';
import { SanityChecks } from '@angular/material/core';
import { setLines } from '@angular/material/core';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { ThemePalette } from '@angular/material/core';
import { VERSION } from '@angular/material/core';

export { AnimationCurves }

export { AnimationDurations }

export { CanColor }

export { CanDisable }

export { CanDisableRipple }

export { CanUpdateErrorState }

export { _countGroupLabelsBeforeOption }

export { DateAdapter }

export { defaultRippleAnimationConfig }

export { ErrorStateMatcher }

export { _getOptionScrollPosition }

export { GranularSanityChecks }

export { HasInitialized }

export { HasTabIndex }

declare namespace i1 {
    export {
        MatLegacyOption
    }
}

declare namespace i2 {
    export {
        MatLegacyOptgroup
    }
}

export { MAT_DATE_FORMATS }

export { MAT_DATE_LOCALE }

export { MAT_DATE_LOCALE_FACTORY }

export { MAT_NATIVE_DATE_FORMATS }

export { MAT_OPTGROUP }

export { MAT_OPTION_PARENT_COMPONENT }

export { MAT_RIPPLE_GLOBAL_OPTIONS }

export { MATERIAL_SANITY_CHECKS }

export { MatLegacyCommonModule }

export { MatLegacyDateFormats }

export { MatLegacyLineModule }

export { MatLegacyNativeDateModule }

/**
 * Component that is used to group instances of `mat-option`.
 * @deprecated Use `MatOptgroup` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export declare class MatLegacyOptgroup extends _MatOptgroupBase {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLegacyOptgroup, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatLegacyOptgroup, "mat-optgroup", ["matOptgroup"], { "disabled": "disabled"; }, {}, never, ["*", "mat-option, ng-container"], false, never>;
}

/**
 * Single option inside of a `<mat-select>` element.
 * @deprecated Use `MatOption` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export declare class MatLegacyOption<T = any> extends _MatOptionBase<T> {
    constructor(element: ElementRef<HTMLElement>, changeDetectorRef: ChangeDetectorRef, parent: MatOptionParentComponent, group: MatLegacyOptgroup);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLegacyOption<any>, [null, null, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatLegacyOption<any>, "mat-option", ["matOption"], {}, {}, never, ["*"], false, never>;
}

/**
 * @deprecated Use `MatOptionModule` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export declare class MatLegacyOptionModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLegacyOptionModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatLegacyOptionModule, [typeof i1.MatLegacyOption, typeof i2.MatLegacyOptgroup], [typeof i3.MatRippleModule, typeof i4.CommonModule, typeof i3.MatCommonModule, typeof i3.MatPseudoCheckboxModule], [typeof i1.MatLegacyOption, typeof i2.MatLegacyOptgroup]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatLegacyOptionModule>;
}

export { MatLegacyPseudoCheckbox }

export { MatLegacyPseudoCheckboxModule }

export { MatLegacyPseudoCheckboxState }

export { MatLegacyRipple }

export { MatLegacyRippleModule }

export { MatLine }

export { _MatOptgroupBase }

export { _MatOptionBase }

export { MatOptionParentComponent }

export { MatOptionSelectionChange }

export { mixinColor }

export { mixinDisabled }

export { mixinDisableRipple }

export { mixinErrorState }

export { mixinInitialized }

export { mixinTabIndex }

export { NativeDateAdapter }

export { NativeDateModule }

export { RippleAnimationConfig }

export { RippleConfig }

export { RippleGlobalOptions }

export { RippleRef }

export { RippleRenderer }

export { RippleState }

export { RippleTarget }

export { SanityChecks }

export { setLines }

export { ShowOnDirtyErrorStateMatcher }

export { ThemePalette }

export { VERSION }

export { }

import { ChangeDetectorRef } from '@angular/core';
import { _countGroupLabelsBeforeOption as _countGroupLabelsBeforeLegacyOption } from '@angular/material/core';
import { ElementRef } from '@angular/core';
import { _getOptionScrollPosition as _getLegacyOptionScrollPosition } from '@angular/material/core';
import * as i0 from '@angular/core';
import * as i3 from '@angular/material/core';
import * as i4 from '@angular/common';
import { VERSION as LEGACY_VERSION } from '@angular/material/core';
import { AnimationCurves as LegacyAnimationCurves } from '@angular/material/core';
import { AnimationDurations as LegacyAnimationDurations } from '@angular/material/core';
import { CanColor as LegacyCanColor } from '@angular/material/core';
import { CanDisable as LegacyCanDisable } from '@angular/material/core';
import { CanDisableRipple as LegacyCanDisableRipple } from '@angular/material/core';
import { CanUpdateErrorState as LegacyCanUpdateErrorState } from '@angular/material/core';
import { DateAdapter as LegacyDateAdapter } from '@angular/material/core';
import { defaultRippleAnimationConfig as legacyDefaultRippleAnimationConfig } from '@angular/material/core';
import { ErrorStateMatcher as LegacyErrorStateMatcher } from '@angular/material/core';
import { GranularSanityChecks as LegacyGranularSanityChecks } from '@angular/material/core';
import { HasInitialized as LegacyHasInitialized } from '@angular/material/core';
import { HasTabIndex as LegacyHasTabIndex } from '@angular/material/core';
import { mixinColor as legacyMixinColor } from '@angular/material/core';
import { mixinDisabled as legacyMixinDisabled } from '@angular/material/core';
import { mixinDisableRipple as legacyMixinDisableRipple } from '@angular/material/core';
import { mixinErrorState as legacyMixinErrorState } from '@angular/material/core';
import { mixinInitialized as legacyMixinInitialized } from '@angular/material/core';
import { mixinTabIndex as legacyMixinTabIndex } from '@angular/material/core';
import { NativeDateAdapter as LegacyNativeDateAdapter } from '@angular/material/core';
import { NativeDateModule as LegacyNativeDateModule } from '@angular/material/core';
import { RippleAnimationConfig as LegacyRippleAnimationConfig } from '@angular/material/core';
import { RippleConfig as LegacyRippleConfig } from '@angular/material/core';
import { RippleGlobalOptions as LegacyRippleGlobalOptions } from '@angular/material/core';
import { RippleRef as LegacyRippleRef } from '@angular/material/core';
import { RippleRenderer as LegacyRippleRenderer } from '@angular/material/core';
import { RippleState as LegacyRippleState } from '@angular/material/core';
import { RippleTarget as LegacyRippleTarget } from '@angular/material/core';
import { SanityChecks as LegacySanityChecks } from '@angular/material/core';
import { setLines as legacySetLines } from '@angular/material/core';
import { ShowOnDirtyErrorStateMatcher as LegacyShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { ThemePalette as LegacyThemePalette } from '@angular/material/core';
import { MAT_DATE_FORMATS as MAT_LEGACY_DATE_FORMATS } from '@angular/material/core';
import { MAT_DATE_LOCALE as MAT_LEGACY_DATE_LOCALE } from '@angular/material/core';
import { MAT_DATE_LOCALE_FACTORY as MAT_LEGACY_DATE_LOCALE_FACTORY } from '@angular/material/core';
import { MAT_NATIVE_DATE_FORMATS as MAT_LEGACY_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { MAT_OPTGROUP as MAT_LEGACY_OPTGROUP } from '@angular/material/core';
import { MAT_OPTION_PARENT_COMPONENT as MAT_LEGACY_OPTION_PARENT_COMPONENT } from '@angular/material/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS as MAT_LEGACY_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { MATERIAL_SANITY_CHECKS as MATERIAL_LEGACY_SANITY_CHECKS } from '@angular/material/core';
import { MatCommonModule as MatLegacyCommonModule } from '@angular/material/core';
import { MatDateFormats as MatLegacyDateFormats } from '@angular/material/core';
import { MatLine as MatLegacyLine } from '@angular/material/core';
import { MatLineModule as MatLegacyLineModule } from '@angular/material/core';
import { MatNativeDateModule as MatLegacyNativeDateModule } from '@angular/material/core';
import { _MatOptgroupBase as _MatLegacyOptgroupBase } from '@angular/material/core';
import { _MatOptionBase as _MatLegacyOptionBase } from '@angular/material/core';
import { MatOptionParentComponent as MatLegacyOptionParentComponent } from '@angular/material/core';
import { MatOptionSelectionChange as MatLegacyOptionSelectionChange } from '@angular/material/core';
import { MatPseudoCheckbox as MatLegacyPseudoCheckbox } from '@angular/material/core';
import { MatPseudoCheckboxModule as MatLegacyPseudoCheckboxModule } from '@angular/material/core';
import { MatPseudoCheckboxState as MatLegacyPseudoCheckboxState } from '@angular/material/core';
import { MatRipple as MatLegacyRipple } from '@angular/material/core';
import { MatRippleModule as MatLegacyRippleModule } from '@angular/material/core';

export { _countGroupLabelsBeforeLegacyOption }

export { _getLegacyOptionScrollPosition }

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

export { LEGACY_VERSION }

export { LegacyAnimationCurves }

export { LegacyAnimationDurations }

export { LegacyCanColor }

export { LegacyCanDisable }

export { LegacyCanDisableRipple }

export { LegacyCanUpdateErrorState }

export { LegacyDateAdapter }

export { legacyDefaultRippleAnimationConfig }

export { LegacyErrorStateMatcher }

export { LegacyGranularSanityChecks }

export { LegacyHasInitialized }

export { LegacyHasTabIndex }

export { legacyMixinColor }

export { legacyMixinDisabled }

export { legacyMixinDisableRipple }

export { legacyMixinErrorState }

export { legacyMixinInitialized }

export { legacyMixinTabIndex }

export { LegacyNativeDateAdapter }

export { LegacyNativeDateModule }

export { LegacyRippleAnimationConfig }

export { LegacyRippleConfig }

export { LegacyRippleGlobalOptions }

export { LegacyRippleRef }

export { LegacyRippleRenderer }

export { LegacyRippleState }

export { LegacyRippleTarget }

export { LegacySanityChecks }

export { legacySetLines }

export { LegacyShowOnDirtyErrorStateMatcher }

export { LegacyThemePalette }

export { MAT_LEGACY_DATE_FORMATS }

export { MAT_LEGACY_DATE_LOCALE }

export { MAT_LEGACY_DATE_LOCALE_FACTORY }

export { MAT_LEGACY_NATIVE_DATE_FORMATS }

export { MAT_LEGACY_OPTGROUP }

export { MAT_LEGACY_OPTION_PARENT_COMPONENT }

export { MAT_LEGACY_RIPPLE_GLOBAL_OPTIONS }

export { MATERIAL_LEGACY_SANITY_CHECKS }

export { MatLegacyCommonModule }

export { MatLegacyDateFormats }

export { MatLegacyLine }

export { MatLegacyLineModule }

export { MatLegacyNativeDateModule }

/**
 * Component that is used to group instances of `mat-option`.
 * @deprecated Use `MatOptgroup` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export declare class MatLegacyOptgroup extends _MatLegacyOptgroupBase {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLegacyOptgroup, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatLegacyOptgroup, "mat-optgroup", ["matOptgroup"], { "disabled": { "alias": "disabled"; "required": false; }; }, {}, never, ["*", "mat-option, ng-container"], false, never>;
}

export { _MatLegacyOptgroupBase }

/**
 * Single option inside of a `<mat-select>` element.
 * @deprecated Use `MatOption` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export declare class MatLegacyOption<T = any> extends _MatLegacyOptionBase<T> {
    constructor(element: ElementRef<HTMLElement>, changeDetectorRef: ChangeDetectorRef, parent: MatLegacyOptionParentComponent, group: MatLegacyOptgroup);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLegacyOption<any>, [null, null, { optional: true; }, { optional: true; }]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MatLegacyOption<any>, "mat-option", ["matOption"], {}, {}, never, ["*"], false, never>;
}

export { _MatLegacyOptionBase }

/**
 * @deprecated Use `MatOptionModule` from `@angular/material/core` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export declare class MatLegacyOptionModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatLegacyOptionModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatLegacyOptionModule, [typeof i1.MatLegacyOption, typeof i2.MatLegacyOptgroup], [typeof i3.MatRippleModule, typeof i4.CommonModule, typeof i3.MatCommonModule, typeof i3.MatPseudoCheckboxModule], [typeof i1.MatLegacyOption, typeof i2.MatLegacyOptgroup]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatLegacyOptionModule>;
}

export { MatLegacyOptionParentComponent }

export { MatLegacyOptionSelectionChange }

export { MatLegacyPseudoCheckbox }

export { MatLegacyPseudoCheckboxModule }

export { MatLegacyPseudoCheckboxState }

export { MatLegacyRipple }

export { MatLegacyRippleModule }

export { }

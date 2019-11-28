/**
 * @fileoverview added by tsickle
 * Generated from: src/material/core/public-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export { VERSION } from './version';
export { AnimationCurves, AnimationDurations } from './animation/animation';
export { MatCommonModule, MATERIAL_SANITY_CHECKS, mixinDisabled, mixinColor, mixinDisableRipple, mixinTabIndex, mixinErrorState, mixinInitialized } from './common-behaviors/index';
export { NativeDateModule, MatNativeDateModule, MAT_DATE_LOCALE_FACTORY, MAT_DATE_LOCALE, MAT_DATE_LOCALE_PROVIDER, DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter, MAT_NATIVE_DATE_FORMATS } from './datetime/index';
export { ShowOnDirtyErrorStateMatcher, ErrorStateMatcher } from './error/error-options';
export {} from './gestures/gesture-annotations';
export { MAT_HAMMER_OPTIONS, GestureConfig } from './gestures/gesture-config';
export { setLines, MatLine, MatLineSetter, MatLineModule } from './line/line';
export { MatOptionModule, _countGroupLabelsBeforeOption, _getOptionScrollPosition, MatOptionSelectionChange, MAT_OPTION_PARENT_COMPONENT, MatOption, MatOptgroup } from './option/index';
export { MAT_LABEL_GLOBAL_OPTIONS } from './label/label-options';
export { MatRippleModule, MAT_RIPPLE_GLOBAL_OPTIONS, MatRipple, RippleState, RippleRef, defaultRippleAnimationConfig, RippleRenderer } from './ripple/index';
export { MatPseudoCheckboxModule, MatPseudoCheckbox } from './selection/index';
// TODO(devversion): remove this with v8
export { JAN, FEB, MAR, APR, MAY, JUN, JUL, AUG, SEP, OCT, NOV, DEC } from './month-constants';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3B1YmxpYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBUUEsd0JBQWMsV0FBVyxDQUFDO0FBQzFCLG9EQUFjLHVCQUF1QixDQUFDO0FBQ3RDLHlKQUFjLDBCQUEwQixDQUFDO0FBQ3pDLHFNQUFjLGtCQUFrQixDQUFDO0FBQ2pDLGdFQUFjLHVCQUF1QixDQUFDO0FBQ3RDLGVBQWMsZ0NBQWdDLENBQUM7QUFDL0Msa0RBQWMsMkJBQTJCLENBQUM7QUFDMUMsZ0VBQWMsYUFBYSxDQUFDO0FBQzVCLHdLQUFjLGdCQUFnQixDQUFDO0FBQy9CLHlDQUFjLHVCQUF1QixDQUFDO0FBQ3RDLDRJQUFjLGdCQUFnQixDQUFDO0FBQy9CLDJEQUFjLG1CQUFtQixDQUFDOztBQUdsQywyRUFBYyxtQkFBbUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5leHBvcnQgKiBmcm9tICcuL3ZlcnNpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9hbmltYXRpb24vYW5pbWF0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vY29tbW9uLWJlaGF2aW9ycy9pbmRleCc7XG5leHBvcnQgKiBmcm9tICcuL2RhdGV0aW1lL2luZGV4JztcbmV4cG9ydCAqIGZyb20gJy4vZXJyb3IvZXJyb3Itb3B0aW9ucyc7XG5leHBvcnQgKiBmcm9tICcuL2dlc3R1cmVzL2dlc3R1cmUtYW5ub3RhdGlvbnMnO1xuZXhwb3J0ICogZnJvbSAnLi9nZXN0dXJlcy9nZXN0dXJlLWNvbmZpZyc7XG5leHBvcnQgKiBmcm9tICcuL2xpbmUvbGluZSc7XG5leHBvcnQgKiBmcm9tICcuL29wdGlvbi9pbmRleCc7XG5leHBvcnQgKiBmcm9tICcuL2xhYmVsL2xhYmVsLW9wdGlvbnMnO1xuZXhwb3J0ICogZnJvbSAnLi9yaXBwbGUvaW5kZXgnO1xuZXhwb3J0ICogZnJvbSAnLi9zZWxlY3Rpb24vaW5kZXgnO1xuXG4vLyBUT0RPKGRldnZlcnNpb24pOiByZW1vdmUgdGhpcyB3aXRoIHY4XG5leHBvcnQgKiBmcm9tICcuL21vbnRoLWNvbnN0YW50cyc7XG4iXX0=
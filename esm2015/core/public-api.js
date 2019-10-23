/**
 * @fileoverview added by tsickle
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9jb3JlL3B1YmxpYy1hcGkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSx3QkFBYyxXQUFXLENBQUM7QUFDMUIsb0RBQWMsdUJBQXVCLENBQUM7QUFDdEMseUpBQWMsMEJBQTBCLENBQUM7QUFDekMscU1BQWMsa0JBQWtCLENBQUM7QUFDakMsZ0VBQWMsdUJBQXVCLENBQUM7QUFDdEMsZUFBYyxnQ0FBZ0MsQ0FBQztBQUMvQyxrREFBYywyQkFBMkIsQ0FBQztBQUMxQyxnRUFBYyxhQUFhLENBQUM7QUFDNUIsd0tBQWMsZ0JBQWdCLENBQUM7QUFDL0IseUNBQWMsdUJBQXVCLENBQUM7QUFDdEMsNElBQWMsZ0JBQWdCLENBQUM7QUFDL0IsMkRBQWMsbUJBQW1CLENBQUM7O0FBR2xDLDJFQUFjLG1CQUFtQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmV4cG9ydCAqIGZyb20gJy4vdmVyc2lvbic7XG5leHBvcnQgKiBmcm9tICcuL2FuaW1hdGlvbi9hbmltYXRpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9jb21tb24tYmVoYXZpb3JzL2luZGV4JztcbmV4cG9ydCAqIGZyb20gJy4vZGF0ZXRpbWUvaW5kZXgnO1xuZXhwb3J0ICogZnJvbSAnLi9lcnJvci9lcnJvci1vcHRpb25zJztcbmV4cG9ydCAqIGZyb20gJy4vZ2VzdHVyZXMvZ2VzdHVyZS1hbm5vdGF0aW9ucyc7XG5leHBvcnQgKiBmcm9tICcuL2dlc3R1cmVzL2dlc3R1cmUtY29uZmlnJztcbmV4cG9ydCAqIGZyb20gJy4vbGluZS9saW5lJztcbmV4cG9ydCAqIGZyb20gJy4vb3B0aW9uL2luZGV4JztcbmV4cG9ydCAqIGZyb20gJy4vbGFiZWwvbGFiZWwtb3B0aW9ucyc7XG5leHBvcnQgKiBmcm9tICcuL3JpcHBsZS9pbmRleCc7XG5leHBvcnQgKiBmcm9tICcuL3NlbGVjdGlvbi9pbmRleCc7XG5cbi8vIFRPRE8oZGV2dmVyc2lvbik6IHJlbW92ZSB0aGlzIHdpdGggdjhcbmV4cG9ydCAqIGZyb20gJy4vbW9udGgtY29uc3RhbnRzJztcbiJdfQ==
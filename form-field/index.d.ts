export { a as MatFormFieldModule, M as MatLabel } from '../module.d-d670423d.js';
export { F as FloatLabelType, M as MAT_ERROR, i as MAT_FORM_FIELD, j as MAT_FORM_FIELD_DEFAULT_OPTIONS, c as MAT_PREFIX, e as MAT_SUFFIX, a as MatError, k as MatFormField, g as MatFormFieldAppearance, h as MatFormFieldDefaultOptions, b as MatHint, d as MatPrefix, f as MatSuffix, S as SubscriptSizing } from '../form-field.d-8f5f115a.js';
export { M as MatFormFieldControl } from '../form-field-control.d-d7b3a431.js';
import '@angular/core';
import '../common-module.d-1b789e68.js';
import '@angular/cdk/bidi';
import '@angular/cdk/observers';
import '@angular/cdk/coercion';
import '@angular/forms';
import '../palette.d-f5ca9a2b.js';
import 'rxjs';

/** @docs-private */
declare function getMatFormFieldPlaceholderConflictError(): Error;
/** @docs-private */
declare function getMatFormFieldDuplicatedHintError(align: string): Error;
/** @docs-private */
declare function getMatFormFieldMissingControlError(): Error;

/**
 * Animations used by the MatFormField.
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
declare const matFormFieldAnimations: {
    readonly transitionMessages: any;
};

export { getMatFormFieldDuplicatedHintError, getMatFormFieldMissingControlError, getMatFormFieldPlaceholderConflictError, matFormFieldAnimations };

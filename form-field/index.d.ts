export { a as MatFormFieldModule, M as MatLabel } from '../module.d-c17c834e.js';
export { F as FloatLabelType, M as MAT_ERROR, i as MAT_FORM_FIELD, j as MAT_FORM_FIELD_DEFAULT_OPTIONS, c as MAT_PREFIX, e as MAT_SUFFIX, a as MatError, k as MatFormField, g as MatFormFieldAppearance, h as MatFormFieldDefaultOptions, b as MatHint, d as MatPrefix, f as MatSuffix, S as SubscriptSizing } from '../form-field.d-2edbc094.js';
export { M as MatFormFieldControl } from '../form-field-control.d-eb86711c.js';
import '@angular/core';
import '../common-module.d-0e6515ae.js';
import '@angular/cdk/bidi';
import '@angular/cdk/observers';
import '@angular/cdk/coercion';
import '@angular/forms';
import '../palette.d-ec4a617c.js';
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

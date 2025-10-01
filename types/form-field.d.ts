export { MatFormFieldModule, MatLabel } from './_form-field-module-chunk.js';
export { FloatLabelType, MAT_ERROR, MAT_FORM_FIELD, MAT_FORM_FIELD_DEFAULT_OPTIONS, MAT_PREFIX, MAT_SUFFIX, MatError, MatFormField, MatFormFieldAppearance, MatFormFieldDefaultOptions, MatHint, MatPrefix, MatSuffix, SubscriptSizing } from './_form-field-chunk.js';
export { MatFormFieldControl } from './_form-field-control-chunk.js';
import '@angular/core';
import '@angular/cdk/observers';
import '@angular/cdk/bidi';
import '@angular/cdk/coercion';
import '@angular/forms';
import './_palette-chunk.js';
import 'rxjs';

/** @docs-private */
declare function getMatFormFieldPlaceholderConflictError(): Error;
/** @docs-private */
declare function getMatFormFieldDuplicatedHintError(align: string): Error;
/** @docs-private */
declare function getMatFormFieldMissingControlError(): Error;

export { getMatFormFieldDuplicatedHintError, getMatFormFieldMissingControlError, getMatFormFieldPlaceholderConflictError };

export { a as MAT_ERROR, h as MAT_FORM_FIELD, i as MAT_FORM_FIELD_DEFAULT_OPTIONS, d as MAT_PREFIX, f as MAT_SUFFIX, b as MatError, j as MatFormField, k as MatFormFieldControl, c as MatHint, M as MatLabel, e as MatPrefix, g as MatSuffix, m as getMatFormFieldDuplicatedHintError, n as getMatFormFieldMissingControlError, l as getMatFormFieldPlaceholderConflictError } from './form-field-CFbrnFED.mjs';
export { M as MatFormFieldModule } from './module-B62K-792.mjs';
import '@angular/cdk/a11y';
import '@angular/cdk/bidi';
import '@angular/cdk/coercion';
import '@angular/cdk/platform';
import '@angular/common';
import '@angular/core';
import 'rxjs';
import 'rxjs/operators';
import '@angular/cdk/observers/private';
import './animation-DfMFjxHu.mjs';
import '@angular/cdk/layout';
import '@angular/cdk/observers';
import './common-module-cKSwHniA.mjs';

/**
 * Animations used by the MatFormField.
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
const matFormFieldAnimations = {
    // Represents:
    // trigger('transitionMessages', [
    //   // TODO(mmalerba): Use angular animations for label animation as well.
    //   state('enter', style({opacity: 1, transform: 'translateY(0%)'})),
    //   transition('void => enter', [
    //     style({opacity: 0, transform: 'translateY(-5px)'}),
    //     animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'),
    //   ]),
    // ])
    /** Animation that transitions the form field's error and hint messages. */
    transitionMessages: {
        type: 7,
        name: 'transitionMessages',
        definitions: [
            {
                type: 0,
                name: 'enter',
                styles: {
                    type: 6,
                    styles: { opacity: 1, transform: 'translateY(0%)' },
                    offset: null,
                },
            },
            {
                type: 1,
                expr: 'void => enter',
                animation: [
                    { type: 6, styles: { opacity: 0, transform: 'translateY(-5px)' }, offset: null },
                    { type: 4, styles: null, timings: '300ms cubic-bezier(0.55, 0, 0.55, 0.2)' },
                ],
                options: null,
            },
        ],
        options: {},
    },
};

export { matFormFieldAnimations };
//# sourceMappingURL=form-field.mjs.map

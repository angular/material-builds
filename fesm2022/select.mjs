export { a as MatOptgroup, M as MatOption } from './option-BzhYL_xC.mjs';
export { b as MatError, j as MatFormField, c as MatHint, M as MatLabel, e as MatPrefix, g as MatSuffix } from './form-field-CFbrnFED.mjs';
export { c as MAT_SELECT_CONFIG, a as MAT_SELECT_SCROLL_STRATEGY, d as MAT_SELECT_SCROLL_STRATEGY_PROVIDER, b as MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY, e as MAT_SELECT_TRIGGER, g as MatSelect, f as MatSelectChange, M as MatSelectModule, h as MatSelectTrigger } from './module-B0CLRw5e.mjs';
import '@angular/cdk/a11y';
import '@angular/cdk/keycodes';
import '@angular/core';
import 'rxjs';
import './ripple-BYgV4oZC.mjs';
import '@angular/cdk/platform';
import '@angular/cdk/coercion';
import '@angular/cdk/private';
import './animation-DfMFjxHu.mjs';
import '@angular/cdk/layout';
import './pseudo-checkbox-DDmgx3P4.mjs';
import './structural-styles-CObeNzjn.mjs';
import '@angular/cdk/bidi';
import '@angular/common';
import 'rxjs/operators';
import '@angular/cdk/observers/private';
import '@angular/cdk/overlay';
import '@angular/cdk/scrolling';
import '@angular/cdk/collections';
import '@angular/forms';
import './error-options-DCNQlTOA.mjs';
import './error-state-Dtb1IHM-.mjs';
import './index-DwiL-HGk.mjs';
import './index-BFRo2fUq.mjs';
import './common-module-cKSwHniA.mjs';
import './pseudo-checkbox-module-4F8Up4PL.mjs';
import './module-B62K-792.mjs';
import '@angular/cdk/observers';

/**
 * The following are all the animations for the mat-select component, with each
 * const containing the metadata for one animation.
 *
 * The values below match the implementation of the AngularJS Material mat-select animation.
 * @docs-private
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 */
const matSelectAnimations = {
    // Represents
    // trigger('transformPanel', [
    //   state(
    //     'void',
    //     style({
    //       opacity: 0,
    //       transform: 'scale(1, 0.8)',
    //     }),
    //   ),
    //   transition(
    //     'void => showing',
    //     animate(
    //       '120ms cubic-bezier(0, 0, 0.2, 1)',
    //       style({
    //         opacity: 1,
    //         transform: 'scale(1, 1)',
    //       }),
    //     ),
    //   ),
    //   transition('* => void', animate('100ms linear', style({opacity: 0}))),
    // ])
    /** This animation transforms the select's overlay panel on and off the page. */
    transformPanel: {
        type: 7,
        name: 'transformPanel',
        definitions: [
            {
                type: 0,
                name: 'void',
                styles: {
                    type: 6,
                    styles: { opacity: 0, transform: 'scale(1, 0.8)' },
                    offset: null,
                },
            },
            {
                type: 1,
                expr: 'void => showing',
                animation: {
                    type: 4,
                    styles: {
                        type: 6,
                        styles: { opacity: 1, transform: 'scale(1, 1)' },
                        offset: null,
                    },
                    timings: '120ms cubic-bezier(0, 0, 0.2, 1)',
                },
                options: null,
            },
            {
                type: 1,
                expr: '* => void',
                animation: {
                    type: 4,
                    styles: { type: 6, styles: { opacity: 0 }, offset: null },
                    timings: '100ms linear',
                },
                options: null,
            },
        ],
        options: {},
    },
};

export { matSelectAnimations };
//# sourceMappingURL=select.mjs.map

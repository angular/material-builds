export { MatOptgroup, MatOption } from './option-CI_ptN6G.mjs';
export { MatError, MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix } from './form-field-ScdCZBIR.mjs';
export { MAT_SELECT_CONFIG, MAT_SELECT_SCROLL_STRATEGY, MAT_SELECT_SCROLL_STRATEGY_PROVIDER, MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY, MAT_SELECT_TRIGGER, MatSelect, MatSelectChange, MatSelectModule, MatSelectTrigger } from './module-D0ZKPWef.mjs';
import '@angular/cdk/a11y';
import '@angular/cdk/keycodes';
import '@angular/core';
import 'rxjs';
import './ripple-CSpmxbGi.mjs';
import '@angular/cdk/platform';
import '@angular/cdk/coercion';
import '@angular/cdk/private';
import './animation-DYWs964N.mjs';
import '@angular/cdk/layout';
import './pseudo-checkbox-BYnaWCwT.mjs';
import './structural-styles-B6PnAnft.mjs';
import '@angular/cdk/bidi';
import '@angular/common';
import 'rxjs/operators';
import '@angular/cdk/observers/private';
import '@angular/cdk/overlay';
import '@angular/cdk/scrolling';
import '@angular/cdk/collections';
import '@angular/forms';
import './error-options-f2L_D2TV.mjs';
import './error-state-DAicm3pw.mjs';
import './module-DLlzjQQf.mjs';
import '@angular/cdk/observers';
import './common-module-BTLyTce6.mjs';
import './index-CPRPXhfK.mjs';
import './index-DD8f9bSt.mjs';
import './pseudo-checkbox-module-DnFwfV7H.mjs';

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

export { e as MatOptgroup, a as MatOption } from './option-07c3c660.mjs';
export { d as MatError, k as MatFormField, e as MatHint, b as MatLabel, g as MatPrefix, i as MatSuffix } from './form-field-6d755764.mjs';
export { d as MAT_SELECT_CONFIG, b as MAT_SELECT_SCROLL_STRATEGY, e as MAT_SELECT_SCROLL_STRATEGY_PROVIDER, c as MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY, f as MAT_SELECT_TRIGGER, M as MatSelect, g as MatSelectChange, a as MatSelectModule, h as MatSelectTrigger } from './module-3bf2775f.mjs';
import '@angular/cdk/a11y';
import '@angular/cdk/keycodes';
import '@angular/core';
import 'rxjs';
import './ripple-9939d1f5.mjs';
import '@angular/cdk/platform';
import '@angular/cdk/coercion';
import '@angular/cdk/private';
import './pseudo-checkbox-af5a4ea4.mjs';
import './structural-styles-d5ada3b3.mjs';
import '@angular/cdk/bidi';
import '@angular/common';
import 'rxjs/operators';
import '@angular/cdk/observers/private';
import '@angular/cdk/overlay';
import '@angular/cdk/scrolling';
import '@angular/cdk/collections';
import '@angular/forms';
import './error-options-4a00765e.mjs';
import './error-state-8f4ce1af.mjs';
import './index-1763d3a6.mjs';
import './index-4bc1d6d3.mjs';
import './common-module-2d64df09.mjs';
import './pseudo-checkbox-module-216fae38.mjs';
import './module-d757bba0.mjs';
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

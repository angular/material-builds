export { a as MatOptgroup, M as MatOption } from './option-ChV6uQgD.mjs';
export { b as MatError, j as MatFormField, c as MatHint, M as MatLabel, e as MatPrefix, g as MatSuffix } from './form-field-DqPi4knt.mjs';
export { c as MAT_SELECT_CONFIG, a as MAT_SELECT_SCROLL_STRATEGY, d as MAT_SELECT_SCROLL_STRATEGY_PROVIDER, b as MAT_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY, e as MAT_SELECT_TRIGGER, g as MatSelect, f as MatSelectChange, M as MatSelectModule, h as MatSelectTrigger } from './module-Cbt8Fcmv.mjs';
import '@angular/cdk/a11y';
import '@angular/cdk/keycodes';
import '@angular/core';
import 'rxjs';
import './ripple-BT3tzh6F.mjs';
import '@angular/cdk/platform';
import '@angular/cdk/coercion';
import '@angular/cdk/private';
import './pseudo-checkbox-CJ7seqQH.mjs';
import './structural-styles-BQUT6wsL.mjs';
import '@angular/cdk/bidi';
import '@angular/common';
import 'rxjs/operators';
import '@angular/cdk/observers/private';
import '@angular/cdk/overlay';
import '@angular/cdk/scrolling';
import '@angular/cdk/collections';
import '@angular/forms';
import './error-options-Dm2JJUbF.mjs';
import './error-state-Dtb1IHM-.mjs';
import './index-DOxJc1m4.mjs';
import './index-SYVYjXwK.mjs';
import './common-module-WayjW0Pb.mjs';
import './pseudo-checkbox-module-CAX2sutq.mjs';
import './module-BXZhw7pQ.mjs';
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
    // trigger('transformPanelWrap', [
    //   transition('* => void', query('@transformPanel', [animateChild()], {optional: true})),
    // ])
    /**
     * This animation ensures the select's overlay panel animation (transformPanel) is called when
     * closing the select.
     * This is needed due to https://github.com/angular/angular/issues/23302
     */
    transformPanelWrap: {
        type: 7,
        name: 'transformPanelWrap',
        definitions: [
            {
                type: 1,
                expr: '* => void',
                animation: {
                    type: 11,
                    selector: '@transformPanel',
                    animation: [{ type: 9, options: null }],
                    options: { optional: true },
                },
                options: null,
            },
        ],
        options: {},
    },
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

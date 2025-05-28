export { d as MAT_TOOLTIP_DEFAULT_OPTIONS, c as MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY, M as MAT_TOOLTIP_SCROLL_STRATEGY, a as MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY, b as MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, e as MatTooltip, h as MatTooltipModule, S as SCROLL_THROTTLE_MS, T as TOOLTIP_PANEL_CLASS, f as TooltipComponent, g as getMatTooltipInvalidPositionError } from './module-CWxMD37a.mjs';
import '@angular/core';
import '@angular/cdk/a11y';
import '@angular/cdk/overlay';
import '@angular/cdk/scrolling';
import 'rxjs/operators';
import '@angular/cdk/coercion';
import '@angular/cdk/keycodes';
import '@angular/common';
import '@angular/cdk/platform';
import '@angular/cdk/bidi';
import '@angular/cdk/portal';
import 'rxjs';
import './animation-DfMFjxHu.mjs';
import '@angular/cdk/layout';
import './common-module-cKSwHniA.mjs';

/**
 * Animations used by MatTooltip.
 * @docs-private
 * @deprecated No longer being used, to be removed.
 * @breaking-change 21.0.0
 */
const matTooltipAnimations = {
    // Represents:
    // trigger('state', [
    //   state('initial, void, hidden', style({opacity: 0, transform: 'scale(0.8)'})),
    //   state('visible', style({transform: 'scale(1)'})),
    //   transition('* => visible', animate('150ms cubic-bezier(0, 0, 0.2, 1)')),
    //   transition('* => hidden', animate('75ms cubic-bezier(0.4, 0, 1, 1)')),
    // ])
    /** Animation that transitions a tooltip in and out. */
    tooltipState: {
        type: 7,
        name: 'state',
        definitions: [
            {
                type: 0,
                name: 'initial, void, hidden',
                styles: { type: 6, styles: { opacity: 0, transform: 'scale(0.8)' }, offset: null },
            },
            {
                type: 0,
                name: 'visible',
                styles: { type: 6, styles: { transform: 'scale(1)' }, offset: null },
            },
            {
                type: 1,
                expr: '* => visible',
                animation: { type: 4, styles: null, timings: '150ms cubic-bezier(0, 0, 0.2, 1)' },
                options: null,
            },
            {
                type: 1,
                expr: '* => hidden',
                animation: { type: 4, styles: null, timings: '75ms cubic-bezier(0.4, 0, 1, 1)' },
                options: null,
            },
        ],
        options: {},
    },
};

export { matTooltipAnimations };
//# sourceMappingURL=tooltip.mjs.map

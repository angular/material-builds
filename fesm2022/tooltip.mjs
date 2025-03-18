export { f as MAT_TOOLTIP_DEFAULT_OPTIONS, e as MAT_TOOLTIP_DEFAULT_OPTIONS_FACTORY, b as MAT_TOOLTIP_SCROLL_STRATEGY, c as MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY, d as MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, M as MatTooltip, a as MatTooltipModule, S as SCROLL_THROTTLE_MS, T as TOOLTIP_PANEL_CLASS, h as TooltipComponent, g as getMatTooltipInvalidPositionError } from './module-087ecec3.mjs';
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
import './common-module-a39ee957.mjs';

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

import { MediaMatcher } from '@angular/cdk/layout';
import { InjectionToken, inject, ANIMATION_MODULE_TYPE } from '@angular/core';

/** Injection token used to configure the animations in Angular Material. */
const MATERIAL_ANIMATIONS = new InjectionToken('MATERIAL_ANIMATIONS');
let reducedMotion = null;
/**
 * Gets the the configured animations state.
 * @docs-private
 */
function _getAnimationsState() {
    if (inject(MATERIAL_ANIMATIONS, { optional: true })?.animationsDisabled ||
        inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations') {
        return 'di-disabled';
    }
    reducedMotion ??= inject(MediaMatcher).matchMedia('(prefers-reduced-motion)').matches;
    return reducedMotion ? 'reduced-motion' : 'enabled';
}
/**
 * Returns whether animations have been disabled by DI. Must be called in a DI context.
 * @docs-private
 */
function _animationsDisabled() {
    return _getAnimationsState() !== 'enabled';
}

export { MATERIAL_ANIMATIONS, _animationsDisabled, _getAnimationsState };
//# sourceMappingURL=animation-Rv7qYCaa.mjs.map

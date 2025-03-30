import { InjectionToken, inject, ANIMATION_MODULE_TYPE } from '@angular/core';

/** Injection token used to configure the animations in Angular Material. */
const MATERIAL_ANIMATIONS = new InjectionToken('MATERIAL_ANIMATIONS');
/**
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 * @docs-private
 */
class AnimationCurves {
    static STANDARD_CURVE = 'cubic-bezier(0.4,0.0,0.2,1)';
    static DECELERATION_CURVE = 'cubic-bezier(0.0,0.0,0.2,1)';
    static ACCELERATION_CURVE = 'cubic-bezier(0.4,0.0,1,1)';
    static SHARP_CURVE = 'cubic-bezier(0.4,0.0,0.6,1)';
}
/**
 * @deprecated No longer used, will be removed.
 * @breaking-change 21.0.0
 * @docs-private
 */
class AnimationDurations {
    static COMPLEX = '375ms';
    static ENTERING = '225ms';
    static EXITING = '195ms';
}
/**
 * Returns whether animations have been disabled by DI. Must be called in a DI context.
 * @docs-private
 */
function _animationsDisabled() {
    const customToken = inject(MATERIAL_ANIMATIONS, { optional: true });
    if (customToken) {
        return customToken.animationsDisabled;
    }
    return inject(ANIMATION_MODULE_TYPE, { optional: true }) === 'NoopAnimations';
}

export { AnimationCurves as A, MATERIAL_ANIMATIONS as M, _animationsDisabled as _, AnimationDurations as a };
//# sourceMappingURL=animation-89957083.mjs.map

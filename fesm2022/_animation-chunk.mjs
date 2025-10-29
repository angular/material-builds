import { MediaMatcher } from '@angular/cdk/layout';
import { InjectionToken, inject, ANIMATION_MODULE_TYPE } from '@angular/core';

const MATERIAL_ANIMATIONS = new InjectionToken('MATERIAL_ANIMATIONS');
let reducedMotion = null;
function _getAnimationsState() {
  if (inject(MATERIAL_ANIMATIONS, {
    optional: true
  })?.animationsDisabled || inject(ANIMATION_MODULE_TYPE, {
    optional: true
  }) === 'NoopAnimations') {
    return 'di-disabled';
  }
  reducedMotion ??= inject(MediaMatcher).matchMedia('(prefers-reduced-motion)').matches;
  return reducedMotion ? 'reduced-motion' : 'enabled';
}
function _animationsDisabled() {
  return _getAnimationsState() !== 'enabled';
}

export { MATERIAL_ANIMATIONS, _animationsDisabled, _getAnimationsState };
//# sourceMappingURL=_animation-chunk.mjs.map

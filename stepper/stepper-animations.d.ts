/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationTriggerMetadata } from '@angular/animations';
export declare const DEFAULT_HORIZONTAL_ANIMATION_DURATION = "500ms";
export declare const DEFAULT_VERTICAL_ANIMATION_DURATION = "225ms";
/**
 * Animations used by the Material steppers.
 * @docs-private
 */
export declare const matStepperAnimations: {
    readonly horizontalStepTransition: AnimationTriggerMetadata;
    readonly verticalStepTransition: AnimationTriggerMetadata;
};

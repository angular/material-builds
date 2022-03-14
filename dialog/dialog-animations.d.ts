/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AnimationTriggerMetadata } from '@angular/animations';
/**
 * Default parameters for the animation for backwards compatibility.
 * @docs-private
 */
export declare const defaultParams: {
    params: {
        enterAnimationDuration: string;
        exitAnimationDuration: string;
    };
};
/**
 * Animations used by MatDialog.
 * @docs-private
 */
export declare const matDialogAnimations: {
    readonly dialogContainer: AnimationTriggerMetadata;
};

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
/** InjectionToken that can be used to specify the global placeholder options. */
export declare const MAT_PLACEHOLDER_GLOBAL_OPTIONS: InjectionToken<PlaceholderOptions>;
/** Type for the available floatPlaceholder values. */
export declare type FloatPlaceholderType = 'always' | 'never' | 'auto';
/** Configurable options for floating placeholders. */
export interface PlaceholderOptions {
    /**
     * Whether the placeholder should float `always`, `never`, or `auto` (only when necessary).
     * Default behavior is assumed to be `auto`.
     */
    float?: FloatPlaceholderType;
}

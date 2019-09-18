/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/material/schematics/ng-add/theming/theming" />
import { Tree } from '@angular-devkit/schematics';
import { Schema } from '../schema';
/** Add pre-built styles to the main project style file. */
export declare function addThemeToAppStyles(options: Schema): (host: Tree) => Tree;

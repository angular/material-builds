/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/cli-workspace" />
import { WorkspaceProject, WorkspaceSchema } from '@schematics/angular/utility/workspace-models';
import * as ts from 'typescript';
/** Finds all projects which contain the given path. */
export declare function getMatchingProjectsByPath(workspace: WorkspaceSchema, searchPath: string): WorkspaceProject[];
/**
 * Gets the matching Angular CLI workspace project from the given program. Project
 * is determined by checking root file names of the program against project paths.
 *
 * If there is only one project set up, the project will be returned regardless of
 * whether it matches any of the specified program files.
 */
export declare function getProjectFromProgram(workspace: WorkspaceSchema, program: ts.Program): WorkspaceProject | null;

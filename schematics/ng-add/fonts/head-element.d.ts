/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { WorkspaceProject } from '@angular-devkit/core/src/workspace';
import { Tree } from '@angular-devkit/schematics';
import { DefaultTreeElement } from 'parse5';
/** Appends the given element HTML fragment to the index.html head tag. */
export declare function appendElementToHead(host: Tree, project: WorkspaceProject, elementHtml: string): void;
/** Parses the given HTML file and returns the head element if available. */
export declare function getHeadTagElement(src: string): DefaultTreeElement | null;

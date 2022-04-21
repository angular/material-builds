/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TemplateRef } from '@angular/core';
import { MatExpansionPanelBase } from './expansion-panel-base';
import * as i0 from "@angular/core";
/**
 * Expansion panel content that will be rendered lazily
 * after the panel is opened for the first time.
 */
export declare class MatExpansionPanelContent {
    _template: TemplateRef<any>;
    _expansionPanel?: MatExpansionPanelBase | undefined;
    constructor(_template: TemplateRef<any>, _expansionPanel?: MatExpansionPanelBase | undefined);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatExpansionPanelContent, [null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatExpansionPanelContent, "ng-template[matExpansionPanelContent]", never, {}, {}, never, never, false>;
}

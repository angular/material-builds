/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, TemplateRef, Inject, Optional } from '@angular/core';
import { MAT_EXPANSION_PANEL } from './expansion-panel-base';
import * as i0 from "@angular/core";
/**
 * Expansion panel content that will be rendered lazily
 * after the panel is opened for the first time.
 */
class MatExpansionPanelContent {
    constructor(_template, _expansionPanel) {
        this._template = _template;
        this._expansionPanel = _expansionPanel;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatExpansionPanelContent, deps: [{ token: i0.TemplateRef }, { token: MAT_EXPANSION_PANEL, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatExpansionPanelContent, selector: "ng-template[matExpansionPanelContent]", ngImport: i0 }); }
}
export { MatExpansionPanelContent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatExpansionPanelContent, decorators: [{
            type: Directive,
            args: [{
                    selector: 'ng-template[matExpansionPanelContent]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_EXPANSION_PANEL]
                }, {
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLWNvbnRlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZXhwYW5zaW9uL2V4cGFuc2lvbi1wYW5lbC1jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdkUsT0FBTyxFQUFDLG1CQUFtQixFQUF3QixNQUFNLHdCQUF3QixDQUFDOztBQUVsRjs7O0dBR0c7QUFDSCxNQUdhLHdCQUF3QjtJQUNuQyxZQUNTLFNBQTJCLEVBQ2MsZUFBdUM7UUFEaEYsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFDYyxvQkFBZSxHQUFmLGVBQWUsQ0FBd0I7SUFDdEYsQ0FBQzs4R0FKTyx3QkFBd0IsNkNBR3pCLG1CQUFtQjtrR0FIbEIsd0JBQXdCOztTQUF4Qix3QkFBd0I7MkZBQXhCLHdCQUF3QjtrQkFIcEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsdUNBQXVDO2lCQUNsRDs7MEJBSUksTUFBTTsyQkFBQyxtQkFBbUI7OzBCQUFHLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtEaXJlY3RpdmUsIFRlbXBsYXRlUmVmLCBJbmplY3QsIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TUFUX0VYUEFOU0lPTl9QQU5FTCwgTWF0RXhwYW5zaW9uUGFuZWxCYXNlfSBmcm9tICcuL2V4cGFuc2lvbi1wYW5lbC1iYXNlJztcblxuLyoqXG4gKiBFeHBhbnNpb24gcGFuZWwgY29udGVudCB0aGF0IHdpbGwgYmUgcmVuZGVyZWQgbGF6aWx5XG4gKiBhZnRlciB0aGUgcGFuZWwgaXMgb3BlbmVkIGZvciB0aGUgZmlyc3QgdGltZS5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbmctdGVtcGxhdGVbbWF0RXhwYW5zaW9uUGFuZWxDb250ZW50XScsXG59KVxuZXhwb3J0IGNsYXNzIE1hdEV4cGFuc2lvblBhbmVsQ29udGVudCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBfdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT4sXG4gICAgQEluamVjdChNQVRfRVhQQU5TSU9OX1BBTkVMKSBAT3B0aW9uYWwoKSBwdWJsaWMgX2V4cGFuc2lvblBhbmVsPzogTWF0RXhwYW5zaW9uUGFuZWxCYXNlLFxuICApIHt9XG59XG4iXX0=
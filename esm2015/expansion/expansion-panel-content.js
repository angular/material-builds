/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, TemplateRef } from '@angular/core';
/**
 * Expansion panel content that will be rendered lazily
 * after the panel is opened for the first time.
 */
let MatExpansionPanelContent = /** @class */ (() => {
    class MatExpansionPanelContent {
        constructor(_template) {
            this._template = _template;
        }
    }
    MatExpansionPanelContent.decorators = [
        { type: Directive, args: [{
                    selector: 'ng-template[matExpansionPanelContent]'
                },] }
    ];
    /** @nocollapse */
    MatExpansionPanelContent.ctorParameters = () => [
        { type: TemplateRef }
    ];
    return MatExpansionPanelContent;
})();
export { MatExpansionPanelContent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLXBhbmVsLWNvbnRlbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZXhwYW5zaW9uL2V4cGFuc2lvbi1wYW5lbC1jb250ZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxTQUFTLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXJEOzs7R0FHRztBQUNIO0lBQUEsTUFHYSx3QkFBd0I7UUFDbkMsWUFBbUIsU0FBMkI7WUFBM0IsY0FBUyxHQUFULFNBQVMsQ0FBa0I7UUFBRyxDQUFDOzs7Z0JBSm5ELFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsdUNBQXVDO2lCQUNsRDs7OztnQkFSa0IsV0FBVzs7SUFXOUIsK0JBQUM7S0FBQTtTQUZZLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgVGVtcGxhdGVSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEV4cGFuc2lvbiBwYW5lbCBjb250ZW50IHRoYXQgd2lsbCBiZSByZW5kZXJlZCBsYXppbHlcbiAqIGFmdGVyIHRoZSBwYW5lbCBpcyBvcGVuZWQgZm9yIHRoZSBmaXJzdCB0aW1lLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICduZy10ZW1wbGF0ZVttYXRFeHBhbnNpb25QYW5lbENvbnRlbnRdJ1xufSlcbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbENvbnRlbnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgX3RlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+KSB7fVxufVxuIl19
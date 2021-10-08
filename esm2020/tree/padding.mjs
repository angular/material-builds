/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkTreeNodePadding } from '@angular/cdk/tree';
import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Wrapper for the CdkTree padding with Material design styles.
 */
export class MatTreeNodePadding extends CdkTreeNodePadding {
    /** The level of depth of the tree node. The padding will be `level * indent` pixels. */
    get level() { return this._level; }
    set level(value) { this._setLevelInput(value); }
    /** The indent for each level. Default number 40px from material design menu sub-menu spec. */
    get indent() { return this._indent; }
    set indent(indent) { this._setIndentInput(indent); }
}
MatTreeNodePadding.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTreeNodePadding, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatTreeNodePadding.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-next.15", type: MatTreeNodePadding, selector: "[matTreeNodePadding]", inputs: { level: ["matTreeNodePadding", "level"], indent: ["matTreeNodePaddingIndent", "indent"] }, providers: [{ provide: CdkTreeNodePadding, useExisting: MatTreeNodePadding }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-next.15", ngImport: i0, type: MatTreeNodePadding, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTreeNodePadding]',
                    providers: [{ provide: CdkTreeNodePadding, useExisting: MatTreeNodePadding }]
                }]
        }], propDecorators: { level: [{
                type: Input,
                args: ['matTreeNodePadding']
            }], indent: [{
                type: Input,
                args: ['matTreeNodePaddingIndent']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFkZGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL3BhZGRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBRS9DOztHQUVHO0FBS0gsTUFBTSxPQUFPLGtCQUE2QixTQUFRLGtCQUF3QjtJQUV4RSx3RkFBd0Y7SUFDeEYsSUFDYSxLQUFLLEtBQWEsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNwRCxJQUFhLEtBQUssQ0FBQyxLQUFhLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFakUsOEZBQThGO0lBQzlGLElBQ2EsTUFBTSxLQUFzQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQy9ELElBQWEsTUFBTSxDQUFDLE1BQXVCLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7O3VIQVZuRSxrQkFBa0I7MkdBQWxCLGtCQUFrQixtSkFGbEIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQzttR0FFaEUsa0JBQWtCO2tCQUo5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFdBQVcsb0JBQW9CLEVBQUMsQ0FBQztpQkFDNUU7OEJBS2MsS0FBSztzQkFEakIsS0FBSzt1QkFBQyxvQkFBb0I7Z0JBTWQsTUFBTTtzQkFEbEIsS0FBSzt1QkFBQywwQkFBMEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7Q2RrVHJlZU5vZGVQYWRkaW5nfSBmcm9tICdAYW5ndWxhci9jZGsvdHJlZSc7XG5pbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBDZGtUcmVlIHBhZGRpbmcgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VHJlZU5vZGVQYWRkaW5nXScsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBDZGtUcmVlTm9kZVBhZGRpbmcsIHVzZUV4aXN0aW5nOiBNYXRUcmVlTm9kZVBhZGRpbmd9XVxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTm9kZVBhZGRpbmc8VCwgSyA9IFQ+IGV4dGVuZHMgQ2RrVHJlZU5vZGVQYWRkaW5nPFQsIEs+IHtcblxuICAvKiogVGhlIGxldmVsIG9mIGRlcHRoIG9mIHRoZSB0cmVlIG5vZGUuIFRoZSBwYWRkaW5nIHdpbGwgYmUgYGxldmVsICogaW5kZW50YCBwaXhlbHMuICovXG4gIEBJbnB1dCgnbWF0VHJlZU5vZGVQYWRkaW5nJylcbiAgb3ZlcnJpZGUgZ2V0IGxldmVsKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9sZXZlbDsgfVxuICBvdmVycmlkZSBzZXQgbGV2ZWwodmFsdWU6IG51bWJlcikgeyB0aGlzLl9zZXRMZXZlbElucHV0KHZhbHVlKTsgfVxuXG4gIC8qKiBUaGUgaW5kZW50IGZvciBlYWNoIGxldmVsLiBEZWZhdWx0IG51bWJlciA0MHB4IGZyb20gbWF0ZXJpYWwgZGVzaWduIG1lbnUgc3ViLW1lbnUgc3BlYy4gKi9cbiAgQElucHV0KCdtYXRUcmVlTm9kZVBhZGRpbmdJbmRlbnQnKVxuICBvdmVycmlkZSBnZXQgaW5kZW50KCk6IG51bWJlciB8IHN0cmluZyB7IHJldHVybiB0aGlzLl9pbmRlbnQ7IH1cbiAgb3ZlcnJpZGUgc2V0IGluZGVudChpbmRlbnQ6IG51bWJlciB8IHN0cmluZykgeyB0aGlzLl9zZXRJbmRlbnRJbnB1dChpbmRlbnQpOyB9XG59XG4iXX0=
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
    get level() {
        return this._level;
    }
    set level(value) {
        this._setLevelInput(value);
    }
    /** The indent for each level. Default number 40px from material design menu sub-menu spec. */
    get indent() {
        return this._indent;
    }
    set indent(indent) {
        this._setIndentInput(indent);
    }
}
MatTreeNodePadding.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatTreeNodePadding, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatTreeNodePadding.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.1", type: MatTreeNodePadding, selector: "[matTreeNodePadding]", inputs: { level: ["matTreeNodePadding", "level"], indent: ["matTreeNodePaddingIndent", "indent"] }, providers: [{ provide: CdkTreeNodePadding, useExisting: MatTreeNodePadding }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatTreeNodePadding, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTreeNodePadding]',
                    providers: [{ provide: CdkTreeNodePadding, useExisting: MatTreeNodePadding }],
                }]
        }], propDecorators: { level: [{
                type: Input,
                args: ['matTreeNodePadding']
            }], indent: [{
                type: Input,
                args: ['matTreeNodePaddingIndent']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFkZGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL3BhZGRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBRS9DOztHQUVHO0FBS0gsTUFBTSxPQUFPLGtCQUE2QixTQUFRLGtCQUF3QjtJQUN4RSx3RkFBd0Y7SUFDeEYsSUFDYSxLQUFLO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBQ0QsSUFBYSxLQUFLLENBQUMsS0FBYTtRQUM5QixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCw4RkFBOEY7SUFDOUYsSUFDYSxNQUFNO1FBQ2pCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN0QixDQUFDO0lBQ0QsSUFBYSxNQUFNLENBQUMsTUFBdUI7UUFDekMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDOzsrR0FqQlUsa0JBQWtCO21HQUFsQixrQkFBa0IsbUpBRmxCLENBQUMsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLGtCQUFrQixFQUFDLENBQUM7MkZBRWhFLGtCQUFrQjtrQkFKOUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxXQUFXLG9CQUFvQixFQUFDLENBQUM7aUJBQzVFOzhCQUljLEtBQUs7c0JBRGpCLEtBQUs7dUJBQUMsb0JBQW9CO2dCQVVkLE1BQU07c0JBRGxCLEtBQUs7dUJBQUMsMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0Nka1RyZWVOb2RlUGFkZGluZ30gZnJvbSAnQGFuZ3VsYXIvY2RrL3RyZWUnO1xuaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgQ2RrVHJlZSBwYWRkaW5nIHdpdGggTWF0ZXJpYWwgZGVzaWduIHN0eWxlcy5cbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW21hdFRyZWVOb2RlUGFkZGluZ10nLFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogQ2RrVHJlZU5vZGVQYWRkaW5nLCB1c2VFeGlzdGluZzogTWF0VHJlZU5vZGVQYWRkaW5nfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdFRyZWVOb2RlUGFkZGluZzxULCBLID0gVD4gZXh0ZW5kcyBDZGtUcmVlTm9kZVBhZGRpbmc8VCwgSz4ge1xuICAvKiogVGhlIGxldmVsIG9mIGRlcHRoIG9mIHRoZSB0cmVlIG5vZGUuIFRoZSBwYWRkaW5nIHdpbGwgYmUgYGxldmVsICogaW5kZW50YCBwaXhlbHMuICovXG4gIEBJbnB1dCgnbWF0VHJlZU5vZGVQYWRkaW5nJylcbiAgb3ZlcnJpZGUgZ2V0IGxldmVsKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2xldmVsO1xuICB9XG4gIG92ZXJyaWRlIHNldCBsZXZlbCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fc2V0TGV2ZWxJbnB1dCh2YWx1ZSk7XG4gIH1cblxuICAvKiogVGhlIGluZGVudCBmb3IgZWFjaCBsZXZlbC4gRGVmYXVsdCBudW1iZXIgNDBweCBmcm9tIG1hdGVyaWFsIGRlc2lnbiBtZW51IHN1Yi1tZW51IHNwZWMuICovXG4gIEBJbnB1dCgnbWF0VHJlZU5vZGVQYWRkaW5nSW5kZW50JylcbiAgb3ZlcnJpZGUgZ2V0IGluZGVudCgpOiBudW1iZXIgfCBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9pbmRlbnQ7XG4gIH1cbiAgb3ZlcnJpZGUgc2V0IGluZGVudChpbmRlbnQ6IG51bWJlciB8IHN0cmluZykge1xuICAgIHRoaXMuX3NldEluZGVudElucHV0KGluZGVudCk7XG4gIH1cbn1cbiJdfQ==
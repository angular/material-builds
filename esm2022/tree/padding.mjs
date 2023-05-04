import { CdkTreeNodePadding } from '@angular/cdk/tree';
import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Wrapper for the CdkTree padding with Material design styles.
 */
class MatTreeNodePadding extends CdkTreeNodePadding {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTreeNodePadding, deps: null, target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.0.0", type: MatTreeNodePadding, selector: "[matTreeNodePadding]", inputs: { level: ["matTreeNodePadding", "level"], indent: ["matTreeNodePaddingIndent", "indent"] }, providers: [{ provide: CdkTreeNodePadding, useExisting: MatTreeNodePadding }], usesInheritance: true, ngImport: i0 }); }
}
export { MatTreeNodePadding };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.0", ngImport: i0, type: MatTreeNodePadding, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFkZGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90cmVlL3BhZGRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBUUEsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDckQsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBRS9DOztHQUVHO0FBQ0gsTUFJYSxrQkFBNkIsU0FBUSxrQkFBd0I7SUFDeEUsd0ZBQXdGO0lBQ3hGLElBQ2EsS0FBSztRQUNoQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUNELElBQWEsS0FBSyxDQUFDLEtBQWtCO1FBQ25DLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELDhGQUE4RjtJQUM5RixJQUNhLE1BQU07UUFDakIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7SUFDRCxJQUFhLE1BQU0sQ0FBQyxNQUF1QjtRQUN6QyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLENBQUM7OEdBakJVLGtCQUFrQjtrR0FBbEIsa0JBQWtCLG1KQUZsQixDQUFDLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxrQkFBa0IsRUFBQyxDQUFDOztTQUVoRSxrQkFBa0I7MkZBQWxCLGtCQUFrQjtrQkFKOUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsc0JBQXNCO29CQUNoQyxTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxXQUFXLG9CQUFvQixFQUFDLENBQUM7aUJBQzVFOzhCQUljLEtBQUs7c0JBRGpCLEtBQUs7dUJBQUMsb0JBQW9CO2dCQVVkLE1BQU07c0JBRGxCLEtBQUs7dUJBQUMsMEJBQTBCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge051bWJlcklucHV0fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtDZGtUcmVlTm9kZVBhZGRpbmd9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RyZWUgcGFkZGluZyB3aXRoIE1hdGVyaWFsIGRlc2lnbiBzdHlsZXMuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1ttYXRUcmVlTm9kZVBhZGRpbmddJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1RyZWVOb2RlUGFkZGluZywgdXNlRXhpc3Rpbmc6IE1hdFRyZWVOb2RlUGFkZGluZ31dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUcmVlTm9kZVBhZGRpbmc8VCwgSyA9IFQ+IGV4dGVuZHMgQ2RrVHJlZU5vZGVQYWRkaW5nPFQsIEs+IHtcbiAgLyoqIFRoZSBsZXZlbCBvZiBkZXB0aCBvZiB0aGUgdHJlZSBub2RlLiBUaGUgcGFkZGluZyB3aWxsIGJlIGBsZXZlbCAqIGluZGVudGAgcGl4ZWxzLiAqL1xuICBASW5wdXQoJ21hdFRyZWVOb2RlUGFkZGluZycpXG4gIG92ZXJyaWRlIGdldCBsZXZlbCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9sZXZlbDtcbiAgfVxuICBvdmVycmlkZSBzZXQgbGV2ZWwodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fc2V0TGV2ZWxJbnB1dCh2YWx1ZSk7XG4gIH1cblxuICAvKiogVGhlIGluZGVudCBmb3IgZWFjaCBsZXZlbC4gRGVmYXVsdCBudW1iZXIgNDBweCBmcm9tIG1hdGVyaWFsIGRlc2lnbiBtZW51IHN1Yi1tZW51IHNwZWMuICovXG4gIEBJbnB1dCgnbWF0VHJlZU5vZGVQYWRkaW5nSW5kZW50JylcbiAgb3ZlcnJpZGUgZ2V0IGluZGVudCgpOiBudW1iZXIgfCBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLl9pbmRlbnQ7XG4gIH1cbiAgb3ZlcnJpZGUgc2V0IGluZGVudChpbmRlbnQ6IG51bWJlciB8IHN0cmluZykge1xuICAgIHRoaXMuX3NldEluZGVudElucHV0KGluZGVudCk7XG4gIH1cbn1cbiJdfQ==
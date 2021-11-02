/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CdkTreeNodeToggle } from '@angular/cdk/tree';
import { Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Wrapper for the CdkTree's toggle with Material design styles.
 */
// tslint:disable-next-line: coercion-types
export class MatTreeNodeToggle extends CdkTreeNodeToggle {
    get recursive() {
        return this._recursive;
    }
    set recursive(value) {
        // TODO: when we remove support for ViewEngine, change this setter to an input
        // alias in the decorator metadata.
        this._recursive = coerceBooleanProperty(value);
    }
}
MatTreeNodeToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatTreeNodeToggle, deps: null, target: i0.ɵɵFactoryTarget.Directive });
MatTreeNodeToggle.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.0-rc.3", type: MatTreeNodeToggle, selector: "[matTreeNodeToggle]", inputs: { recursive: ["matTreeNodeToggleRecursive", "recursive"] }, providers: [{ provide: CdkTreeNodeToggle, useExisting: MatTreeNodeToggle }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.0-rc.3", ngImport: i0, type: MatTreeNodeToggle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[matTreeNodeToggle]',
                    providers: [{ provide: CdkTreeNodeToggle, useExisting: MatTreeNodeToggle }],
                }]
        }], propDecorators: { recursive: [{
                type: Input,
                args: ['matTreeNodeToggleRecursive']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvdG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDOztBQUUvQzs7R0FFRztBQUtILDJDQUEyQztBQUMzQyxNQUFNLE9BQU8saUJBQTRCLFNBQVEsaUJBQXVCO0lBQ3RFLElBQ2EsU0FBUztRQUNwQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUNELElBQWEsU0FBUyxDQUFDLEtBQWM7UUFDbkMsOEVBQThFO1FBQzlFLG1DQUFtQztRQUNuQyxJQUFJLENBQUMsVUFBVSxHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pELENBQUM7O21IQVRVLGlCQUFpQjt1R0FBakIsaUJBQWlCLGtIQUhqQixDQUFDLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBQyxDQUFDO2dHQUc5RCxpQkFBaUI7a0JBTDdCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtvQkFDL0IsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxtQkFBbUIsRUFBQyxDQUFDO2lCQUMxRTs4QkFJYyxTQUFTO3NCQURyQixLQUFLO3VCQUFDLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Q2RrVHJlZU5vZGVUb2dnbGV9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIENka1RyZWUncyB0b2dnbGUgd2l0aCBNYXRlcmlhbCBkZXNpZ24gc3R5bGVzLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0VHJlZU5vZGVUb2dnbGVdJyxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IENka1RyZWVOb2RlVG9nZ2xlLCB1c2VFeGlzdGluZzogTWF0VHJlZU5vZGVUb2dnbGV9XSxcbn0pXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGNvZXJjaW9uLXR5cGVzXG5leHBvcnQgY2xhc3MgTWF0VHJlZU5vZGVUb2dnbGU8VCwgSyA9IFQ+IGV4dGVuZHMgQ2RrVHJlZU5vZGVUb2dnbGU8VCwgSz4ge1xuICBASW5wdXQoJ21hdFRyZWVOb2RlVG9nZ2xlUmVjdXJzaXZlJylcbiAgb3ZlcnJpZGUgZ2V0IHJlY3Vyc2l2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fcmVjdXJzaXZlO1xuICB9XG4gIG92ZXJyaWRlIHNldCByZWN1cnNpdmUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICAvLyBUT0RPOiB3aGVuIHdlIHJlbW92ZSBzdXBwb3J0IGZvciBWaWV3RW5naW5lLCBjaGFuZ2UgdGhpcyBzZXR0ZXIgdG8gYW4gaW5wdXRcbiAgICAvLyBhbGlhcyBpbiB0aGUgZGVjb3JhdG9yIG1ldGFkYXRhLlxuICAgIHRoaXMuX3JlY3Vyc2l2ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==
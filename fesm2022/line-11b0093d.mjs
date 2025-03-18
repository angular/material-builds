import * as i0 from '@angular/core';
import { Directive, NgModule } from '@angular/core';
import { startWith } from 'rxjs/operators';
import { M as MatCommonModule } from './common-module-a39ee957.mjs';

/**
 * Shared directive to count lines inside a text area, such as a list item.
 * Line elements can be extracted with a @ContentChildren(MatLine) query, then
 * counted by checking the query list's length.
 */
class MatLine {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: MatLine, deps: [], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "19.2.0", type: MatLine, isStandalone: true, selector: "[mat-line], [matLine]", host: { classAttribute: "mat-line" }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: MatLine, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-line], [matLine]',
                    host: { 'class': 'mat-line' },
                }]
        }] });
/**
 * Helper that takes a query list of lines and sets the correct class on the host.
 * @docs-private
 */
function setLines(lines, element, prefix = 'mat') {
    // Note: doesn't need to unsubscribe, because `changes`
    // gets completed by Angular when the view is destroyed.
    lines.changes.pipe(startWith(lines)).subscribe(({ length }) => {
        setClass(element, `${prefix}-2-line`, false);
        setClass(element, `${prefix}-3-line`, false);
        setClass(element, `${prefix}-multi-line`, false);
        if (length === 2 || length === 3) {
            setClass(element, `${prefix}-${length}-line`, true);
        }
        else if (length > 3) {
            setClass(element, `${prefix}-multi-line`, true);
        }
    });
}
/** Adds or removes a class from an element. */
function setClass(element, className, isAdd) {
    element.nativeElement.classList.toggle(className, isAdd);
}
class MatLineModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: MatLineModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "19.2.0", ngImport: i0, type: MatLineModule, imports: [MatCommonModule, MatLine], exports: [MatLine, MatCommonModule] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: MatLineModule, imports: [MatCommonModule, MatCommonModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.0", ngImport: i0, type: MatLineModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [MatCommonModule, MatLine],
                    exports: [MatLine, MatCommonModule],
                }]
        }] });

export { MatLine as M, MatLineModule as a, setLines as s };
//# sourceMappingURL=line-11b0093d.mjs.map

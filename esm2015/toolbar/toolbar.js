/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, Directive, ElementRef, Inject, isDevMode, QueryList, ViewEncapsulation, } from '@angular/core';
import { mixinColor } from '@angular/material/core';
// Boilerplate for applying mixins to MatToolbar.
/** @docs-private */
class MatToolbarBase {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
    }
}
const _MatToolbarMixinBase = mixinColor(MatToolbarBase);
let MatToolbarRow = /** @class */ (() => {
    class MatToolbarRow {
    }
    MatToolbarRow.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-toolbar-row',
                    exportAs: 'matToolbarRow',
                    host: { 'class': 'mat-toolbar-row' },
                },] }
    ];
    return MatToolbarRow;
})();
export { MatToolbarRow };
let MatToolbar = /** @class */ (() => {
    class MatToolbar extends _MatToolbarMixinBase {
        constructor(elementRef, _platform, document) {
            super(elementRef);
            this._platform = _platform;
            // TODO: make the document a required param when doing breaking changes.
            this._document = document;
        }
        ngAfterViewInit() {
            if (!isDevMode() || !this._platform.isBrowser) {
                return;
            }
            this._checkToolbarMixedModes();
            this._toolbarRows.changes.subscribe(() => this._checkToolbarMixedModes());
        }
        /**
         * Throws an exception when developers are attempting to combine the different toolbar row modes.
         */
        _checkToolbarMixedModes() {
            if (!this._toolbarRows.length) {
                return;
            }
            // Check if there are any other DOM nodes that can display content but aren't inside of
            // a <mat-toolbar-row> element.
            const isCombinedUsage = Array.from(this._elementRef.nativeElement.childNodes)
                .filter(node => !(node.classList && node.classList.contains('mat-toolbar-row')))
                .filter(node => node.nodeType !== (this._document ? this._document.COMMENT_NODE : 8))
                .some(node => !!(node.textContent && node.textContent.trim()));
            if (isCombinedUsage) {
                throwToolbarMixedModesError();
            }
        }
    }
    MatToolbar.decorators = [
        { type: Component, args: [{
                    selector: 'mat-toolbar',
                    exportAs: 'matToolbar',
                    template: "<ng-content></ng-content>\n<ng-content select=\"mat-toolbar-row\"></ng-content>\n",
                    inputs: ['color'],
                    host: {
                        'class': 'mat-toolbar',
                        '[class.mat-toolbar-multiple-rows]': '_toolbarRows.length > 0',
                        '[class.mat-toolbar-single-row]': '_toolbarRows.length === 0',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    styles: [".cdk-high-contrast-active .mat-toolbar{outline:solid 1px}.mat-toolbar-row,.mat-toolbar-single-row{display:flex;box-sizing:border-box;padding:0 16px;width:100%;flex-direction:row;align-items:center;white-space:nowrap}.mat-toolbar-multiple-rows{display:flex;box-sizing:border-box;flex-direction:column;width:100%}\n"]
                }] }
    ];
    /** @nocollapse */
    MatToolbar.ctorParameters = () => [
        { type: ElementRef },
        { type: Platform },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
    ];
    MatToolbar.propDecorators = {
        _toolbarRows: [{ type: ContentChildren, args: [MatToolbarRow, { descendants: true },] }]
    };
    return MatToolbar;
})();
export { MatToolbar };
/**
 * Throws an exception when attempting to combine the different toolbar row modes.
 * @docs-private
 */
export function throwToolbarMixedModesError() {
    throw Error('MatToolbar: Attempting to combine different toolbar modes. ' +
        'Either specify multiple `<mat-toolbar-row>` elements explicitly or just place content ' +
        'inside of a `<mat-toolbar>` for a single row.');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90b29sYmFyL3Rvb2xiYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF5QixVQUFVLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUcxRSxpREFBaUQ7QUFDakQsb0JBQW9CO0FBQ3BCLE1BQU0sY0FBYztJQUNsQixZQUFtQixXQUF1QjtRQUF2QixnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUFHLENBQUM7Q0FDL0M7QUFDRCxNQUFNLG9CQUFvQixHQUF5QyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7QUFFOUY7SUFBQSxNQUthLGFBQWE7OztnQkFMekIsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLFFBQVEsRUFBRSxlQUFlO29CQUN6QixJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUM7aUJBQ25DOztJQUMyQixvQkFBQztLQUFBO1NBQWhCLGFBQWE7QUFFMUI7SUFBQSxNQWNhLFVBQVcsU0FBUSxvQkFBb0I7UUFNbEQsWUFDRSxVQUFzQixFQUNkLFNBQW1CLEVBQ1QsUUFBYztZQUNoQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7WUFGVixjQUFTLEdBQVQsU0FBUyxDQUFVO1lBSTNCLHdFQUF3RTtZQUN4RSxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUM1QixDQUFDO1FBRUQsZUFBZTtZQUNiLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFO2dCQUM3QyxPQUFPO2FBQ1I7WUFFRCxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FBQztRQUM1RSxDQUFDO1FBRUQ7O1dBRUc7UUFDSyx1QkFBdUI7WUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO2dCQUM3QixPQUFPO2FBQ1I7WUFFRCx1RkFBdUY7WUFDdkYsK0JBQStCO1lBQy9CLE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQWMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDO2lCQUN2RixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7aUJBQy9FLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3BGLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFakUsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLDJCQUEyQixFQUFFLENBQUM7YUFDL0I7UUFDSCxDQUFDOzs7Z0JBekRGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsYUFBYTtvQkFDdkIsUUFBUSxFQUFFLFlBQVk7b0JBQ3RCLDZGQUEyQjtvQkFFM0IsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDO29CQUNqQixJQUFJLEVBQUU7d0JBQ0osT0FBTyxFQUFFLGFBQWE7d0JBQ3RCLG1DQUFtQyxFQUFFLHlCQUF5Qjt3QkFDOUQsZ0NBQWdDLEVBQUUsMkJBQTJCO3FCQUM5RDtvQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2lCQUN0Qzs7OztnQkFwQ0MsVUFBVTtnQkFSSixRQUFRO2dEQXNEWCxNQUFNLFNBQUMsUUFBUTs7OytCQUxqQixlQUFlLFNBQUMsYUFBYSxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzs7SUF3Q3JELGlCQUFDO0tBQUE7U0E1Q1ksVUFBVTtBQThDdkI7OztHQUdHO0FBQ0gsTUFBTSxVQUFVLDJCQUEyQjtJQUN6QyxNQUFNLEtBQUssQ0FBQyw2REFBNkQ7UUFDdkUsd0ZBQXdGO1FBQ3hGLCtDQUErQyxDQUFDLENBQUM7QUFDckQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIGlzRGV2TW9kZSxcbiAgUXVlcnlMaXN0LFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkNvbG9yLCBDYW5Db2xvckN0b3IsIG1peGluQ29sb3J9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0VG9vbGJhci5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRUb29sYmFyQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBfZWxlbWVudFJlZjogRWxlbWVudFJlZikge31cbn1cbmNvbnN0IF9NYXRUb29sYmFyTWl4aW5CYXNlOiBDYW5Db2xvckN0b3IgJiB0eXBlb2YgTWF0VG9vbGJhckJhc2UgPSBtaXhpbkNvbG9yKE1hdFRvb2xiYXJCYXNlKTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnbWF0LXRvb2xiYXItcm93JyxcbiAgZXhwb3J0QXM6ICdtYXRUb29sYmFyUm93JyxcbiAgaG9zdDogeydjbGFzcyc6ICdtYXQtdG9vbGJhci1yb3cnfSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VG9vbGJhclJvdyB7fVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtdG9vbGJhcicsXG4gIGV4cG9ydEFzOiAnbWF0VG9vbGJhcicsXG4gIHRlbXBsYXRlVXJsOiAndG9vbGJhci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3Rvb2xiYXIuY3NzJ10sXG4gIGlucHV0czogWydjb2xvciddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10b29sYmFyJyxcbiAgICAnW2NsYXNzLm1hdC10b29sYmFyLW11bHRpcGxlLXJvd3NdJzogJ190b29sYmFyUm93cy5sZW5ndGggPiAwJyxcbiAgICAnW2NsYXNzLm1hdC10b29sYmFyLXNpbmdsZS1yb3ddJzogJ190b29sYmFyUm93cy5sZW5ndGggPT09IDAnLFxuICB9LFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0VG9vbGJhciBleHRlbmRzIF9NYXRUb29sYmFyTWl4aW5CYXNlIGltcGxlbWVudHMgQ2FuQ29sb3IsIEFmdGVyVmlld0luaXQge1xuICBwcml2YXRlIF9kb2N1bWVudDogRG9jdW1lbnQ7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byBhbGwgdG9vbGJhciByb3cgZWxlbWVudHMgdGhhdCBoYXZlIGJlZW4gcHJvamVjdGVkLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdFRvb2xiYXJSb3csIHtkZXNjZW5kYW50czogdHJ1ZX0pIF90b29sYmFyUm93czogUXVlcnlMaXN0PE1hdFRvb2xiYXJSb3c+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIGRvY3VtZW50PzogYW55KSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZik7XG5cbiAgICAvLyBUT0RPOiBtYWtlIHRoZSBkb2N1bWVudCBhIHJlcXVpcmVkIHBhcmFtIHdoZW4gZG9pbmcgYnJlYWtpbmcgY2hhbmdlcy5cbiAgICB0aGlzLl9kb2N1bWVudCA9IGRvY3VtZW50O1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICghaXNEZXZNb2RlKCkgfHwgIXRoaXMuX3BsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2NoZWNrVG9vbGJhck1peGVkTW9kZXMoKTtcbiAgICB0aGlzLl90b29sYmFyUm93cy5jaGFuZ2VzLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9jaGVja1Rvb2xiYXJNaXhlZE1vZGVzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhbiBleGNlcHRpb24gd2hlbiBkZXZlbG9wZXJzIGFyZSBhdHRlbXB0aW5nIHRvIGNvbWJpbmUgdGhlIGRpZmZlcmVudCB0b29sYmFyIHJvdyBtb2Rlcy5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrVG9vbGJhck1peGVkTW9kZXMoKSB7XG4gICAgaWYgKCF0aGlzLl90b29sYmFyUm93cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB0aGVyZSBhcmUgYW55IG90aGVyIERPTSBub2RlcyB0aGF0IGNhbiBkaXNwbGF5IGNvbnRlbnQgYnV0IGFyZW4ndCBpbnNpZGUgb2ZcbiAgICAvLyBhIDxtYXQtdG9vbGJhci1yb3c+IGVsZW1lbnQuXG4gICAgY29uc3QgaXNDb21iaW5lZFVzYWdlID0gQXJyYXkuZnJvbTxIVE1MRWxlbWVudD4odGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXMpXG4gICAgICAuZmlsdGVyKG5vZGUgPT4gIShub2RlLmNsYXNzTGlzdCAmJiBub2RlLmNsYXNzTGlzdC5jb250YWlucygnbWF0LXRvb2xiYXItcm93JykpKVxuICAgICAgLmZpbHRlcihub2RlID0+IG5vZGUubm9kZVR5cGUgIT09ICh0aGlzLl9kb2N1bWVudCA/IHRoaXMuX2RvY3VtZW50LkNPTU1FTlRfTk9ERSA6IDgpKVxuICAgICAgLnNvbWUobm9kZSA9PiAhIShub2RlLnRleHRDb250ZW50ICYmIG5vZGUudGV4dENvbnRlbnQudHJpbSgpKSk7XG5cbiAgICBpZiAoaXNDb21iaW5lZFVzYWdlKSB7XG4gICAgICB0aHJvd1Rvb2xiYXJNaXhlZE1vZGVzRXJyb3IoKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBUaHJvd3MgYW4gZXhjZXB0aW9uIHdoZW4gYXR0ZW1wdGluZyB0byBjb21iaW5lIHRoZSBkaWZmZXJlbnQgdG9vbGJhciByb3cgbW9kZXMuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd1Rvb2xiYXJNaXhlZE1vZGVzRXJyb3IoKSB7XG4gIHRocm93IEVycm9yKCdNYXRUb29sYmFyOiBBdHRlbXB0aW5nIHRvIGNvbWJpbmUgZGlmZmVyZW50IHRvb2xiYXIgbW9kZXMuICcgK1xuICAgICdFaXRoZXIgc3BlY2lmeSBtdWx0aXBsZSBgPG1hdC10b29sYmFyLXJvdz5gIGVsZW1lbnRzIGV4cGxpY2l0bHkgb3IganVzdCBwbGFjZSBjb250ZW50ICcgK1xuICAgICdpbnNpZGUgb2YgYSBgPG1hdC10b29sYmFyPmAgZm9yIGEgc2luZ2xlIHJvdy4nKTtcbn1cbiJdfQ==
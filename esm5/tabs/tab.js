/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as tslib_1 from "tslib";
import { TemplatePortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { Subject } from 'rxjs';
import { MatTabContent } from './tab-content';
import { MatTabLabel } from './tab-label';
// Boilerplate for applying mixins to MatTab.
/** @docs-private */
var MatTabBase = /** @class */ (function () {
    function MatTabBase() {
    }
    return MatTabBase;
}());
var _MatTabMixinBase = mixinDisabled(MatTabBase);
var MatTab = /** @class */ (function (_super) {
    tslib_1.__extends(MatTab, _super);
    function MatTab(_viewContainerRef) {
        var _this = _super.call(this) || this;
        _this._viewContainerRef = _viewContainerRef;
        /** Plain text label for the tab, used when there is no template label. */
        _this.textLabel = '';
        /** Portal that will be the hosted content of the tab */
        _this._contentPortal = null;
        /** Emits whenever the internal state of the tab changes. */
        _this._stateChanges = new Subject();
        /**
         * The relatively indexed position where 0 represents the center, negative is left, and positive
         * represents the right.
         */
        _this.position = null;
        /**
         * The initial relatively index origin of the tab if it was created and selected after there
         * was already a selected tab. Provides context of what position the tab should originate from.
         */
        _this.origin = null;
        /**
         * Whether the tab is currently active.
         */
        _this.isActive = false;
        return _this;
    }
    Object.defineProperty(MatTab.prototype, "templateLabel", {
        /** Content for the tab label given by `<ng-template mat-tab-label>`. */
        get: function () { return this._templateLabel; },
        set: function (value) {
            // Only update the templateLabel via query if there is actually
            // a MatTabLabel found. This works around an issue where a user may have
            // manually set `templateLabel` during creation mode, which would then get clobbered
            // by `undefined` when this query resolves.
            if (value) {
                this._templateLabel = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatTab.prototype, "content", {
        /** @docs-private */
        get: function () {
            return this._contentPortal;
        },
        enumerable: true,
        configurable: true
    });
    MatTab.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty('textLabel') || changes.hasOwnProperty('disabled')) {
            this._stateChanges.next();
        }
    };
    MatTab.prototype.ngOnDestroy = function () {
        this._stateChanges.complete();
    };
    MatTab.prototype.ngOnInit = function () {
        this._contentPortal = new TemplatePortal(this._explicitContent || this._implicitContent, this._viewContainerRef);
    };
    MatTab.decorators = [
        { type: Component, args: [{
                    moduleId: module.id,
                    selector: 'mat-tab',
                    template: "<!-- Create a template for the content of the <mat-tab> so that we can grab a reference to this\n    TemplateRef and use it in a Portal to render the tab content in the appropriate place in the\n    tab-group. -->\n<ng-template><ng-content></ng-content></ng-template>\n",
                    inputs: ['disabled'],
                    // tslint:disable-next-line:validate-decorators
                    changeDetection: ChangeDetectionStrategy.Default,
                    encapsulation: ViewEncapsulation.None,
                    exportAs: 'matTab'
                }] }
    ];
    /** @nocollapse */
    MatTab.ctorParameters = function () { return [
        { type: ViewContainerRef }
    ]; };
    MatTab.propDecorators = {
        templateLabel: [{ type: ContentChild, args: [MatTabLabel, { static: false },] }],
        _explicitContent: [{ type: ContentChild, args: [MatTabContent, { read: TemplateRef, static: true },] }],
        _implicitContent: [{ type: ViewChild, args: [TemplateRef, { static: true },] }],
        textLabel: [{ type: Input, args: ['label',] }],
        ariaLabel: [{ type: Input, args: ['aria-label',] }],
        ariaLabelledby: [{ type: Input, args: ['aria-labelledby',] }]
    };
    return MatTab;
}(_MatTabMixinBase));
export { MatTab };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFLTCxXQUFXLEVBQ1gsU0FBUyxFQUNULGdCQUFnQixFQUNoQixpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUE2QixhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNqRixPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzdCLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDNUMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUd4Qyw2Q0FBNkM7QUFDN0Msb0JBQW9CO0FBQ3BCO0lBQUE7SUFBa0IsQ0FBQztJQUFELGlCQUFDO0FBQUQsQ0FBQyxBQUFuQixJQUFtQjtBQUNuQixJQUFNLGdCQUFnQixHQUNsQixhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFOUI7SUFVNEIsa0NBQWdCO0lBZ0UxQyxnQkFBb0IsaUJBQW1DO1FBQXZELFlBQ0UsaUJBQU8sU0FDUjtRQUZtQix1QkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBeEN2RCwwRUFBMEU7UUFDMUQsZUFBUyxHQUFXLEVBQUUsQ0FBQztRQVd2Qyx3REFBd0Q7UUFDaEQsb0JBQWMsR0FBMEIsSUFBSSxDQUFDO1FBT3JELDREQUE0RDtRQUNuRCxtQkFBYSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUFFN0M7OztXQUdHO1FBQ0gsY0FBUSxHQUFrQixJQUFJLENBQUM7UUFFL0I7OztXQUdHO1FBQ0gsWUFBTSxHQUFrQixJQUFJLENBQUM7UUFFN0I7O1dBRUc7UUFDSCxjQUFRLEdBQUcsS0FBSyxDQUFDOztJQUlqQixDQUFDO0lBaEVELHNCQUNJLGlDQUFhO1FBRmpCLHdFQUF3RTthQUN4RSxjQUNtQyxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2FBQ2hFLFVBQWtCLEtBQWtCO1lBQ2xDLCtEQUErRDtZQUMvRCx3RUFBd0U7WUFDeEUsb0ZBQW9GO1lBQ3BGLDJDQUEyQztZQUMzQyxJQUFJLEtBQUssRUFBRTtnQkFDVCxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQzthQUM3QjtRQUNILENBQUM7OztPQVQrRDtJQXFDaEUsc0JBQUksMkJBQU87UUFEWCxvQkFBb0I7YUFDcEI7WUFDRSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDN0IsQ0FBQzs7O09BQUE7SUEwQkQsNEJBQVcsR0FBWCxVQUFZLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzdFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRUQsNEJBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDaEMsQ0FBQztJQUVELHlCQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksY0FBYyxDQUNwQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzlFLENBQUM7O2dCQTNGRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLE1BQU0sQ0FBQyxFQUFFO29CQUNuQixRQUFRLEVBQUUsU0FBUztvQkFDbkIseVJBQXVCO29CQUN2QixNQUFNLEVBQUUsQ0FBQyxVQUFVLENBQUM7b0JBQ3BCLCtDQUErQztvQkFDL0MsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE9BQU87b0JBQ2hELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxRQUFRLEVBQUUsUUFBUTtpQkFDbkI7Ozs7Z0JBeEJDLGdCQUFnQjs7O2dDQTJCZixZQUFZLFNBQUMsV0FBVyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQzttQ0FnQnpDLFlBQVksU0FBQyxhQUFhLEVBQUUsRUFBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUM7bUNBSTdELFNBQVMsU0FBQyxXQUFXLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDOzRCQUdyQyxLQUFLLFNBQUMsT0FBTzs0QkFHYixLQUFLLFNBQUMsWUFBWTtpQ0FNbEIsS0FBSyxTQUFDLGlCQUFpQjs7SUFnRDFCLGFBQUM7Q0FBQSxBQTVGRCxDQVU0QixnQkFBZ0IsR0FrRjNDO1NBbEZZLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NhbkRpc2FibGUsIENhbkRpc2FibGVDdG9yLCBtaXhpbkRpc2FibGVkfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge01hdFRhYkNvbnRlbnR9IGZyb20gJy4vdGFiLWNvbnRlbnQnO1xuaW1wb3J0IHtNYXRUYWJMYWJlbH0gZnJvbSAnLi90YWItbGFiZWwnO1xuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0VGFiLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdFRhYkJhc2Uge31cbmNvbnN0IF9NYXRUYWJNaXhpbkJhc2U6IENhbkRpc2FibGVDdG9yICYgdHlwZW9mIE1hdFRhYkJhc2UgPVxuICAgIG1peGluRGlzYWJsZWQoTWF0VGFiQmFzZSk7XG5cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC10YWInLFxuICB0ZW1wbGF0ZVVybDogJ3RhYi5odG1sJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRUYWInLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWIgZXh0ZW5kcyBfTWF0VGFiTWl4aW5CYXNlIGltcGxlbWVudHMgT25Jbml0LCBDYW5EaXNhYmxlLCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKiBDb250ZW50IGZvciB0aGUgdGFiIGxhYmVsIGdpdmVuIGJ5IGA8bmctdGVtcGxhdGUgbWF0LXRhYi1sYWJlbD5gLiAqL1xuICBAQ29udGVudENoaWxkKE1hdFRhYkxhYmVsLCB7c3RhdGljOiBmYWxzZX0pXG4gIGdldCB0ZW1wbGF0ZUxhYmVsKCk6IE1hdFRhYkxhYmVsIHsgcmV0dXJuIHRoaXMuX3RlbXBsYXRlTGFiZWw7IH1cbiAgc2V0IHRlbXBsYXRlTGFiZWwodmFsdWU6IE1hdFRhYkxhYmVsKSB7XG4gICAgLy8gT25seSB1cGRhdGUgdGhlIHRlbXBsYXRlTGFiZWwgdmlhIHF1ZXJ5IGlmIHRoZXJlIGlzIGFjdHVhbGx5XG4gICAgLy8gYSBNYXRUYWJMYWJlbCBmb3VuZC4gVGhpcyB3b3JrcyBhcm91bmQgYW4gaXNzdWUgd2hlcmUgYSB1c2VyIG1heSBoYXZlXG4gICAgLy8gbWFudWFsbHkgc2V0IGB0ZW1wbGF0ZUxhYmVsYCBkdXJpbmcgY3JlYXRpb24gbW9kZSwgd2hpY2ggd291bGQgdGhlbiBnZXQgY2xvYmJlcmVkXG4gICAgLy8gYnkgYHVuZGVmaW5lZGAgd2hlbiB0aGlzIHF1ZXJ5IHJlc29sdmVzLlxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5fdGVtcGxhdGVMYWJlbCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF90ZW1wbGF0ZUxhYmVsOiBNYXRUYWJMYWJlbDtcblxuICAvKipcbiAgICogVGVtcGxhdGUgcHJvdmlkZWQgaW4gdGhlIHRhYiBjb250ZW50IHRoYXQgd2lsbCBiZSB1c2VkIGlmIHByZXNlbnQsIHVzZWQgdG8gZW5hYmxlIGxhenktbG9hZGluZ1xuICAgKi9cbiAgQENvbnRlbnRDaGlsZChNYXRUYWJDb250ZW50LCB7cmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZX0pXG4gIF9leHBsaWNpdENvbnRlbnQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqIFRlbXBsYXRlIGluc2lkZSB0aGUgTWF0VGFiIHZpZXcgdGhhdCBjb250YWlucyBhbiBgPG5nLWNvbnRlbnQ+YC4gKi9cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZiwge3N0YXRpYzogdHJ1ZX0pIF9pbXBsaWNpdENvbnRlbnQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqIFBsYWluIHRleHQgbGFiZWwgZm9yIHRoZSB0YWIsIHVzZWQgd2hlbiB0aGVyZSBpcyBubyB0ZW1wbGF0ZSBsYWJlbC4gKi9cbiAgQElucHV0KCdsYWJlbCcpIHRleHRMYWJlbDogc3RyaW5nID0gJyc7XG5cbiAgLyoqIEFyaWEgbGFiZWwgZm9yIHRoZSB0YWIuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnQgdGhhdCB0aGUgdGFiIGlzIGxhYmVsbGVkIGJ5LlxuICAgKiBXaWxsIGJlIGNsZWFyZWQgaWYgYGFyaWEtbGFiZWxgIGlzIHNldCBhdCB0aGUgc2FtZSB0aW1lLlxuICAgKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuXG4gIC8qKiBQb3J0YWwgdGhhdCB3aWxsIGJlIHRoZSBob3N0ZWQgY29udGVudCBvZiB0aGUgdGFiICovXG4gIHByaXZhdGUgX2NvbnRlbnRQb3J0YWw6IFRlbXBsYXRlUG9ydGFsIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IGNvbnRlbnQoKTogVGVtcGxhdGVQb3J0YWwgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudFBvcnRhbDtcbiAgfVxuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIHRhYiBjaGFuZ2VzLiAqL1xuICByZWFkb25seSBfc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogVGhlIHJlbGF0aXZlbHkgaW5kZXhlZCBwb3NpdGlvbiB3aGVyZSAwIHJlcHJlc2VudHMgdGhlIGNlbnRlciwgbmVnYXRpdmUgaXMgbGVmdCwgYW5kIHBvc2l0aXZlXG4gICAqIHJlcHJlc2VudHMgdGhlIHJpZ2h0LlxuICAgKi9cbiAgcG9zaXRpb246IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5pdGlhbCByZWxhdGl2ZWx5IGluZGV4IG9yaWdpbiBvZiB0aGUgdGFiIGlmIGl0IHdhcyBjcmVhdGVkIGFuZCBzZWxlY3RlZCBhZnRlciB0aGVyZVxuICAgKiB3YXMgYWxyZWFkeSBhIHNlbGVjdGVkIHRhYi4gUHJvdmlkZXMgY29udGV4dCBvZiB3aGF0IHBvc2l0aW9uIHRoZSB0YWIgc2hvdWxkIG9yaWdpbmF0ZSBmcm9tLlxuICAgKi9cbiAgb3JpZ2luOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdGFiIGlzIGN1cnJlbnRseSBhY3RpdmUuXG4gICAqL1xuICBpc0FjdGl2ZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KCd0ZXh0TGFiZWwnKSB8fCBjaGFuZ2VzLmhhc093blByb3BlcnR5KCdkaXNhYmxlZCcpKSB7XG4gICAgICB0aGlzLl9zdGF0ZUNoYW5nZXMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuX3N0YXRlQ2hhbmdlcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5fY29udGVudFBvcnRhbCA9IG5ldyBUZW1wbGF0ZVBvcnRhbChcbiAgICAgICAgdGhpcy5fZXhwbGljaXRDb250ZW50IHx8IHRoaXMuX2ltcGxpY2l0Q29udGVudCwgdGhpcy5fdmlld0NvbnRhaW5lclJlZik7XG4gIH1cbn1cbiJdfQ==
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TemplatePortal } from '@angular/cdk/portal';
import { ChangeDetectionStrategy, Component, ContentChild, Input, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation, InjectionToken, Inject, Optional, } from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { Subject } from 'rxjs';
import { MatTabContent } from './tab-content';
import { MatTabLabel } from './tab-label';
// Boilerplate for applying mixins to MatTab.
/**
 * \@docs-private
 */
class MatTabBase {
}
/** @type {?} */
const _MatTabMixinBase = mixinDisabled(MatTabBase);
/**
 * Used to provide a tab group to a tab without causing a circular dependency.
 * \@docs-private
 * @type {?}
 */
export const MAT_TAB_GROUP = new InjectionToken('MAT_TAB_GROUP');
export class MatTab extends _MatTabMixinBase {
    /**
     * @param {?} _viewContainerRef
     * @param {?=} _closestTabGroup
     */
    constructor(_viewContainerRef, _closestTabGroup) {
        super();
        this._viewContainerRef = _viewContainerRef;
        this._closestTabGroup = _closestTabGroup;
        /**
         * Plain text label for the tab, used when there is no template label.
         */
        this.textLabel = '';
        /**
         * Portal that will be the hosted content of the tab
         */
        this._contentPortal = null;
        /**
         * Emits whenever the internal state of the tab changes.
         */
        this._stateChanges = new Subject();
        /**
         * The relatively indexed position where 0 represents the center, negative is left, and positive
         * represents the right.
         */
        this.position = null;
        /**
         * The initial relatively index origin of the tab if it was created and selected after there
         * was already a selected tab. Provides context of what position the tab should originate from.
         */
        this.origin = null;
        /**
         * Whether the tab is currently active.
         */
        this.isActive = false;
    }
    /**
     * Content for the tab label given by `<ng-template mat-tab-label>`.
     * @return {?}
     */
    get templateLabel() { return this._templateLabel; }
    /**
     * @param {?} value
     * @return {?}
     */
    set templateLabel(value) {
        // Only update the templateLabel via query if there is actually
        // a MatTabLabel found. This works around an issue where a user may have
        // manually set `templateLabel` during creation mode, which would then get clobbered
        // by `undefined` when this query resolves.
        if (value) {
            this._templateLabel = value;
        }
    }
    /**
     * \@docs-private
     * @return {?}
     */
    get content() {
        return this._contentPortal;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes.hasOwnProperty('textLabel') || changes.hasOwnProperty('disabled')) {
            this._stateChanges.next();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._stateChanges.complete();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._contentPortal = new TemplatePortal(this._explicitContent || this._implicitContent, this._viewContainerRef);
    }
}
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
MatTab.ctorParameters = () => [
    { type: ViewContainerRef },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [MAT_TAB_GROUP,] }] }
];
MatTab.propDecorators = {
    templateLabel: [{ type: ContentChild, args: [MatTabLabel, { static: false },] }],
    _explicitContent: [{ type: ContentChild, args: [MatTabContent, { read: TemplateRef, static: true },] }],
    _implicitContent: [{ type: ViewChild, args: [TemplateRef, { static: true },] }],
    textLabel: [{ type: Input, args: ['label',] }],
    ariaLabel: [{ type: Input, args: ['aria-label',] }],
    ariaLabelledby: [{ type: Input, args: ['aria-labelledby',] }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    MatTab.prototype._templateLabel;
    /**
     * Template provided in the tab content that will be used if present, used to enable lazy-loading
     * @type {?}
     */
    MatTab.prototype._explicitContent;
    /**
     * Template inside the MatTab view that contains an `<ng-content>`.
     * @type {?}
     */
    MatTab.prototype._implicitContent;
    /**
     * Plain text label for the tab, used when there is no template label.
     * @type {?}
     */
    MatTab.prototype.textLabel;
    /**
     * Aria label for the tab.
     * @type {?}
     */
    MatTab.prototype.ariaLabel;
    /**
     * Reference to the element that the tab is labelled by.
     * Will be cleared if `aria-label` is set at the same time.
     * @type {?}
     */
    MatTab.prototype.ariaLabelledby;
    /**
     * Portal that will be the hosted content of the tab
     * @type {?}
     * @private
     */
    MatTab.prototype._contentPortal;
    /**
     * Emits whenever the internal state of the tab changes.
     * @type {?}
     */
    MatTab.prototype._stateChanges;
    /**
     * The relatively indexed position where 0 represents the center, negative is left, and positive
     * represents the right.
     * @type {?}
     */
    MatTab.prototype.position;
    /**
     * The initial relatively index origin of the tab if it was created and selected after there
     * was already a selected tab. Provides context of what position the tab should originate from.
     * @type {?}
     */
    MatTab.prototype.origin;
    /**
     * Whether the tab is currently active.
     * @type {?}
     */
    MatTab.prototype.isActive;
    /**
     * @type {?}
     * @private
     */
    MatTab.prototype._viewContainerRef;
    /**
     * @deprecated `_closestTabGroup` parameter to become required.
     * \@breaking-change 10.0.0
     * @type {?}
     */
    MatTab.prototype._closestTabGroup;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RhYnMvdGFiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBUUEsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ25ELE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBS0wsV0FBVyxFQUNYLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2pCLGNBQWMsRUFDZCxNQUFNLEVBQ04sUUFBUSxHQUNULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBNkIsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDakYsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM3QixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxhQUFhLENBQUM7Ozs7O0FBS3hDLE1BQU0sVUFBVTtDQUFHOztNQUNiLGdCQUFnQixHQUNsQixhQUFhLENBQUMsVUFBVSxDQUFDOzs7Ozs7QUFNN0IsTUFBTSxPQUFPLGFBQWEsR0FBRyxJQUFJLGNBQWMsQ0FBTSxlQUFlLENBQUM7QUFZckUsTUFBTSxPQUFPLE1BQU8sU0FBUSxnQkFBZ0I7Ozs7O0lBZ0UxQyxZQUNVLGlCQUFtQyxFQUtELGdCQUFzQjtRQUNoRSxLQUFLLEVBQUUsQ0FBQztRQU5BLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFLRCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQU07Ozs7UUE3Q2xELGNBQVMsR0FBVyxFQUFFLENBQUM7Ozs7UUFZL0IsbUJBQWMsR0FBMEIsSUFBSSxDQUFDOzs7O1FBUTVDLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQzs7Ozs7UUFNN0MsYUFBUSxHQUFrQixJQUFJLENBQUM7Ozs7O1FBTS9CLFdBQU0sR0FBa0IsSUFBSSxDQUFDOzs7O1FBSzdCLGFBQVEsR0FBRyxLQUFLLENBQUM7SUFVakIsQ0FBQzs7Ozs7SUF0RUQsSUFDSSxhQUFhLEtBQWtCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Ozs7O0lBQ2hFLElBQUksYUFBYSxDQUFDLEtBQWtCO1FBQ2xDLCtEQUErRDtRQUMvRCx3RUFBd0U7UUFDeEUsb0ZBQW9GO1FBQ3BGLDJDQUEyQztRQUMzQyxJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQzs7Ozs7SUE0QkQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO0lBQzdCLENBQUM7Ozs7O0lBZ0NELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUM3RSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQzs7OztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2hDLENBQUM7Ozs7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FDcEMsSUFBSSxDQUFDLGdCQUFnQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUM5RSxDQUFDOzs7WUFqR0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtnQkFDbkIsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLHlSQUF1QjtnQkFDdkIsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDOztnQkFFcEIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE9BQU87Z0JBQ2hELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxRQUFRLEVBQUUsUUFBUTthQUNuQjs7OztZQWpDQyxnQkFBZ0I7NENBd0diLFFBQVEsWUFBSSxNQUFNLFNBQUMsYUFBYTs7OzRCQXBFbEMsWUFBWSxTQUFDLFdBQVcsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUM7K0JBZ0J6QyxZQUFZLFNBQUMsYUFBYSxFQUFFLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDOytCQUk3RCxTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQzt3QkFHckMsS0FBSyxTQUFDLE9BQU87d0JBR2IsS0FBSyxTQUFDLFlBQVk7NkJBTWxCLEtBQUssU0FBQyxpQkFBaUI7Ozs7Ozs7SUFyQnhCLGdDQUFvQzs7Ozs7SUFLcEMsa0NBQ21DOzs7OztJQUduQyxrQ0FBMkU7Ozs7O0lBRzNFLDJCQUF1Qzs7Ozs7SUFHdkMsMkJBQXVDOzs7Ozs7SUFNdkMsZ0NBQWlEOzs7Ozs7SUFHakQsZ0NBQXFEOzs7OztJQVFyRCwrQkFBNkM7Ozs7OztJQU03QywwQkFBK0I7Ozs7OztJQU0vQix3QkFBNkI7Ozs7O0lBSzdCLDBCQUFpQjs7Ozs7SUFHZixtQ0FBMkM7Ozs7OztJQUszQyxrQ0FBZ0UiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtUZW1wbGF0ZVBvcnRhbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbiAgT3B0aW9uYWwsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvciwgbWl4aW5EaXNhYmxlZH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge1N1YmplY3R9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRUYWJDb250ZW50fSBmcm9tICcuL3RhYi1jb250ZW50JztcbmltcG9ydCB7TWF0VGFiTGFiZWx9IGZyb20gJy4vdGFiLWxhYmVsJztcblxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdFRhYi5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jbGFzcyBNYXRUYWJCYXNlIHt9XG5jb25zdCBfTWF0VGFiTWl4aW5CYXNlOiBDYW5EaXNhYmxlQ3RvciAmIHR5cGVvZiBNYXRUYWJCYXNlID1cbiAgICBtaXhpbkRpc2FibGVkKE1hdFRhYkJhc2UpO1xuXG4vKipcbiAqIFVzZWQgdG8gcHJvdmlkZSBhIHRhYiBncm91cCB0byBhIHRhYiB3aXRob3V0IGNhdXNpbmcgYSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgTUFUX1RBQl9HUk9VUCA9IG5ldyBJbmplY3Rpb25Ub2tlbjxhbnk+KCdNQVRfVEFCX0dST1VQJyk7XG5cbkBDb21wb25lbnQoe1xuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICBzZWxlY3RvcjogJ21hdC10YWInLFxuICB0ZW1wbGF0ZVVybDogJ3RhYi5odG1sJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJ10sXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp2YWxpZGF0ZS1kZWNvcmF0b3JzXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgZXhwb3J0QXM6ICdtYXRUYWInLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWIgZXh0ZW5kcyBfTWF0VGFiTWl4aW5CYXNlIGltcGxlbWVudHMgT25Jbml0LCBDYW5EaXNhYmxlLCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIC8qKiBDb250ZW50IGZvciB0aGUgdGFiIGxhYmVsIGdpdmVuIGJ5IGA8bmctdGVtcGxhdGUgbWF0LXRhYi1sYWJlbD5gLiAqL1xuICBAQ29udGVudENoaWxkKE1hdFRhYkxhYmVsLCB7c3RhdGljOiBmYWxzZX0pXG4gIGdldCB0ZW1wbGF0ZUxhYmVsKCk6IE1hdFRhYkxhYmVsIHsgcmV0dXJuIHRoaXMuX3RlbXBsYXRlTGFiZWw7IH1cbiAgc2V0IHRlbXBsYXRlTGFiZWwodmFsdWU6IE1hdFRhYkxhYmVsKSB7XG4gICAgLy8gT25seSB1cGRhdGUgdGhlIHRlbXBsYXRlTGFiZWwgdmlhIHF1ZXJ5IGlmIHRoZXJlIGlzIGFjdHVhbGx5XG4gICAgLy8gYSBNYXRUYWJMYWJlbCBmb3VuZC4gVGhpcyB3b3JrcyBhcm91bmQgYW4gaXNzdWUgd2hlcmUgYSB1c2VyIG1heSBoYXZlXG4gICAgLy8gbWFudWFsbHkgc2V0IGB0ZW1wbGF0ZUxhYmVsYCBkdXJpbmcgY3JlYXRpb24gbW9kZSwgd2hpY2ggd291bGQgdGhlbiBnZXQgY2xvYmJlcmVkXG4gICAgLy8gYnkgYHVuZGVmaW5lZGAgd2hlbiB0aGlzIHF1ZXJ5IHJlc29sdmVzLlxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5fdGVtcGxhdGVMYWJlbCA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIF90ZW1wbGF0ZUxhYmVsOiBNYXRUYWJMYWJlbDtcblxuICAvKipcbiAgICogVGVtcGxhdGUgcHJvdmlkZWQgaW4gdGhlIHRhYiBjb250ZW50IHRoYXQgd2lsbCBiZSB1c2VkIGlmIHByZXNlbnQsIHVzZWQgdG8gZW5hYmxlIGxhenktbG9hZGluZ1xuICAgKi9cbiAgQENvbnRlbnRDaGlsZChNYXRUYWJDb250ZW50LCB7cmVhZDogVGVtcGxhdGVSZWYsIHN0YXRpYzogdHJ1ZX0pXG4gIF9leHBsaWNpdENvbnRlbnQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqIFRlbXBsYXRlIGluc2lkZSB0aGUgTWF0VGFiIHZpZXcgdGhhdCBjb250YWlucyBhbiBgPG5nLWNvbnRlbnQ+YC4gKi9cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZiwge3N0YXRpYzogdHJ1ZX0pIF9pbXBsaWNpdENvbnRlbnQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqIFBsYWluIHRleHQgbGFiZWwgZm9yIHRoZSB0YWIsIHVzZWQgd2hlbiB0aGVyZSBpcyBubyB0ZW1wbGF0ZSBsYWJlbC4gKi9cbiAgQElucHV0KCdsYWJlbCcpIHRleHRMYWJlbDogc3RyaW5nID0gJyc7XG5cbiAgLyoqIEFyaWEgbGFiZWwgZm9yIHRoZSB0YWIuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnQgdGhhdCB0aGUgdGFiIGlzIGxhYmVsbGVkIGJ5LlxuICAgKiBXaWxsIGJlIGNsZWFyZWQgaWYgYGFyaWEtbGFiZWxgIGlzIHNldCBhdCB0aGUgc2FtZSB0aW1lLlxuICAgKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuXG4gIC8qKiBQb3J0YWwgdGhhdCB3aWxsIGJlIHRoZSBob3N0ZWQgY29udGVudCBvZiB0aGUgdGFiICovXG4gIHByaXZhdGUgX2NvbnRlbnRQb3J0YWw6IFRlbXBsYXRlUG9ydGFsIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgZ2V0IGNvbnRlbnQoKTogVGVtcGxhdGVQb3J0YWwgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5fY29udGVudFBvcnRhbDtcbiAgfVxuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciB0aGUgaW50ZXJuYWwgc3RhdGUgb2YgdGhlIHRhYiBjaGFuZ2VzLiAqL1xuICByZWFkb25seSBfc3RhdGVDaGFuZ2VzID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKipcbiAgICogVGhlIHJlbGF0aXZlbHkgaW5kZXhlZCBwb3NpdGlvbiB3aGVyZSAwIHJlcHJlc2VudHMgdGhlIGNlbnRlciwgbmVnYXRpdmUgaXMgbGVmdCwgYW5kIHBvc2l0aXZlXG4gICAqIHJlcHJlc2VudHMgdGhlIHJpZ2h0LlxuICAgKi9cbiAgcG9zaXRpb246IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5pdGlhbCByZWxhdGl2ZWx5IGluZGV4IG9yaWdpbiBvZiB0aGUgdGFiIGlmIGl0IHdhcyBjcmVhdGVkIGFuZCBzZWxlY3RlZCBhZnRlciB0aGVyZVxuICAgKiB3YXMgYWxyZWFkeSBhIHNlbGVjdGVkIHRhYi4gUHJvdmlkZXMgY29udGV4dCBvZiB3aGF0IHBvc2l0aW9uIHRoZSB0YWIgc2hvdWxkIG9yaWdpbmF0ZSBmcm9tLlxuICAgKi9cbiAgb3JpZ2luOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdGFiIGlzIGN1cnJlbnRseSBhY3RpdmUuXG4gICAqL1xuICBpc0FjdGl2ZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgYF9jbG9zZXN0VGFiR3JvdXBgIHBhcmFtZXRlciB0byBiZWNvbWUgcmVxdWlyZWQuXG4gICAgICogQGJyZWFraW5nLWNoYW5nZSAxMC4wLjBcbiAgICAgKi9cbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9UQUJfR1JPVVApIHB1YmxpYyBfY2xvc2VzdFRhYkdyb3VwPzogYW55KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgndGV4dExhYmVsJykgfHwgY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZGlzYWJsZWQnKSkge1xuICAgICAgdGhpcy5fc3RhdGVDaGFuZ2VzLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9zdGF0ZUNoYW5nZXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbnRlbnRQb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwoXG4gICAgICAgIHRoaXMuX2V4cGxpY2l0Q29udGVudCB8fCB0aGlzLl9pbXBsaWNpdENvbnRlbnQsIHRoaXMuX3ZpZXdDb250YWluZXJSZWYpO1xuICB9XG59XG4iXX0=
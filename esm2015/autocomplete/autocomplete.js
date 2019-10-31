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
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Inject, InjectionToken, Input, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MAT_OPTION_PARENT_COMPONENT, MatOptgroup, MatOption, mixinDisableRipple, } from '@angular/material/core';
/**
 * Autocomplete IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 * @type {?}
 */
let _uniqueAutocompleteIdCounter = 0;
/**
 * Event object that is emitted when an autocomplete option is selected.
 */
export class MatAutocompleteSelectedEvent {
    /**
     * @param {?} source
     * @param {?} option
     */
    constructor(source, option) {
        this.source = source;
        this.option = option;
    }
}
if (false) {
    /**
     * Reference to the autocomplete panel that emitted the event.
     * @type {?}
     */
    MatAutocompleteSelectedEvent.prototype.source;
    /**
     * Option that was selected.
     * @type {?}
     */
    MatAutocompleteSelectedEvent.prototype.option;
}
// Boilerplate for applying mixins to MatAutocomplete.
/**
 * \@docs-private
 */
class MatAutocompleteBase {
}
/** @type {?} */
const _MatAutocompleteMixinBase = mixinDisableRipple(MatAutocompleteBase);
/**
 * Default `mat-autocomplete` options that can be overridden.
 * @record
 */
export function MatAutocompleteDefaultOptions() { }
if (false) {
    /**
     * Whether the first option should be highlighted when an autocomplete panel is opened.
     * @type {?|undefined}
     */
    MatAutocompleteDefaultOptions.prototype.autoActiveFirstOption;
}
/**
 * Injection token to be used to override the default options for `mat-autocomplete`.
 * @type {?}
 */
export const MAT_AUTOCOMPLETE_DEFAULT_OPTIONS = new InjectionToken('mat-autocomplete-default-options', {
    providedIn: 'root',
    factory: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY,
});
/**
 * \@docs-private
 * @return {?}
 */
export function MAT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY() {
    return { autoActiveFirstOption: false };
}
export class MatAutocomplete extends _MatAutocompleteMixinBase {
    /**
     * @param {?} _changeDetectorRef
     * @param {?} _elementRef
     * @param {?} defaults
     */
    constructor(_changeDetectorRef, _elementRef, defaults) {
        super();
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        /**
         * Whether the autocomplete panel should be visible, depending on option length.
         */
        this.showPanel = false;
        this._isOpen = false;
        /**
         * Function that maps an option's control value to its display value in the trigger.
         */
        this.displayWith = null;
        /**
         * Event that is emitted whenever an option from the list is selected.
         */
        this.optionSelected = new EventEmitter();
        /**
         * Event that is emitted when the autocomplete panel is opened.
         */
        this.opened = new EventEmitter();
        /**
         * Event that is emitted when the autocomplete panel is closed.
         */
        this.closed = new EventEmitter();
        this._classList = {};
        /**
         * Unique ID to be used by autocomplete trigger's "aria-owns" property.
         */
        this.id = `mat-autocomplete-${_uniqueAutocompleteIdCounter++}`;
        this._autoActiveFirstOption = !!defaults.autoActiveFirstOption;
    }
    /**
     * Whether the autocomplete panel is open.
     * @return {?}
     */
    get isOpen() { return this._isOpen && this.showPanel; }
    /**
     * Whether the first option should be highlighted when the autocomplete panel is opened.
     * Can be configured globally through the `MAT_AUTOCOMPLETE_DEFAULT_OPTIONS` token.
     * @return {?}
     */
    get autoActiveFirstOption() { return this._autoActiveFirstOption; }
    /**
     * @param {?} value
     * @return {?}
     */
    set autoActiveFirstOption(value) {
        this._autoActiveFirstOption = coerceBooleanProperty(value);
    }
    /**
     * Takes classes set on the host mat-autocomplete element and applies them to the panel
     * inside the overlay container to allow for easy styling.
     * @param {?} value
     * @return {?}
     */
    set classList(value) {
        if (value && value.length) {
            this._classList = value.split(' ').reduce((/**
             * @param {?} classList
             * @param {?} className
             * @return {?}
             */
            (classList, className) => {
                classList[className.trim()] = true;
                return classList;
            }), (/** @type {?} */ ({})));
        }
        else {
            this._classList = {};
        }
        this._setVisibilityClasses(this._classList);
        this._elementRef.nativeElement.className = '';
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        this._keyManager = new ActiveDescendantKeyManager(this.options).withWrap();
        // Set the initial visibility state.
        this._setVisibility();
    }
    /**
     * Sets the panel scrollTop. This allows us to manually scroll to display options
     * above or below the fold, as they are not actually being focused when active.
     * @param {?} scrollTop
     * @return {?}
     */
    _setScrollTop(scrollTop) {
        if (this.panel) {
            this.panel.nativeElement.scrollTop = scrollTop;
        }
    }
    /**
     * Returns the panel's scrollTop.
     * @return {?}
     */
    _getScrollTop() {
        return this.panel ? this.panel.nativeElement.scrollTop : 0;
    }
    /**
     * Panel should hide itself when the option list is empty.
     * @return {?}
     */
    _setVisibility() {
        this.showPanel = !!this.options.length;
        this._setVisibilityClasses(this._classList);
        this._changeDetectorRef.markForCheck();
    }
    /**
     * Emits the `select` event.
     * @param {?} option
     * @return {?}
     */
    _emitSelectEvent(option) {
        /** @type {?} */
        const event = new MatAutocompleteSelectedEvent(this, option);
        this.optionSelected.emit(event);
    }
    /**
     * Sets the autocomplete visibility classes on a classlist based on the panel is visible.
     * @private
     * @param {?} classList
     * @return {?}
     */
    _setVisibilityClasses(classList) {
        classList['mat-autocomplete-visible'] = this.showPanel;
        classList['mat-autocomplete-hidden'] = !this.showPanel;
    }
}
MatAutocomplete.decorators = [
    { type: Component, args: [{
                moduleId: module.id,
                selector: 'mat-autocomplete',
                template: "<ng-template>\n  <div class=\"mat-autocomplete-panel\" role=\"listbox\" [id]=\"id\" [ngClass]=\"_classList\" #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n",
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                exportAs: 'matAutocomplete',
                inputs: ['disableRipple'],
                host: {
                    'class': 'mat-autocomplete'
                },
                providers: [
                    { provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }
                ],
                styles: [".mat-autocomplete-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative;width:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}.mat-autocomplete-panel-above .mat-autocomplete-panel{border-radius:0;border-top-left-radius:4px;border-top-right-radius:4px}.mat-autocomplete-panel .mat-divider-horizontal{margin-top:-1px}@media(-ms-high-contrast: active){.mat-autocomplete-panel{outline:solid 1px}}\n"]
            }] }
];
/** @nocollapse */
MatAutocomplete.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: undefined, decorators: [{ type: Inject, args: [MAT_AUTOCOMPLETE_DEFAULT_OPTIONS,] }] }
];
MatAutocomplete.propDecorators = {
    template: [{ type: ViewChild, args: [TemplateRef, { static: true },] }],
    panel: [{ type: ViewChild, args: ['panel',] }],
    options: [{ type: ContentChildren, args: [MatOption, { descendants: true },] }],
    optionGroups: [{ type: ContentChildren, args: [MatOptgroup, { descendants: true },] }],
    displayWith: [{ type: Input }],
    autoActiveFirstOption: [{ type: Input }],
    panelWidth: [{ type: Input }],
    optionSelected: [{ type: Output }],
    opened: [{ type: Output }],
    closed: [{ type: Output }],
    classList: [{ type: Input, args: ['class',] }]
};
if (false) {
    /** @type {?} */
    MatAutocomplete.ngAcceptInputType_autoActiveFirstOption;
    /** @type {?} */
    MatAutocomplete.ngAcceptInputType_disableRipple;
    /**
     * Manages active item in option list based on key events.
     * @type {?}
     */
    MatAutocomplete.prototype._keyManager;
    /**
     * Whether the autocomplete panel should be visible, depending on option length.
     * @type {?}
     */
    MatAutocomplete.prototype.showPanel;
    /** @type {?} */
    MatAutocomplete.prototype._isOpen;
    /**
     * \@docs-private
     * @type {?}
     */
    MatAutocomplete.prototype.template;
    /**
     * Element for the panel containing the autocomplete options.
     * @type {?}
     */
    MatAutocomplete.prototype.panel;
    /**
     * \@docs-private
     * @type {?}
     */
    MatAutocomplete.prototype.options;
    /**
     * \@docs-private
     * @type {?}
     */
    MatAutocomplete.prototype.optionGroups;
    /**
     * Function that maps an option's control value to its display value in the trigger.
     * @type {?}
     */
    MatAutocomplete.prototype.displayWith;
    /**
     * @type {?}
     * @private
     */
    MatAutocomplete.prototype._autoActiveFirstOption;
    /**
     * Specify the width of the autocomplete panel.  Can be any CSS sizing value, otherwise it will
     * match the width of its host.
     * @type {?}
     */
    MatAutocomplete.prototype.panelWidth;
    /**
     * Event that is emitted whenever an option from the list is selected.
     * @type {?}
     */
    MatAutocomplete.prototype.optionSelected;
    /**
     * Event that is emitted when the autocomplete panel is opened.
     * @type {?}
     */
    MatAutocomplete.prototype.opened;
    /**
     * Event that is emitted when the autocomplete panel is closed.
     * @type {?}
     */
    MatAutocomplete.prototype.closed;
    /** @type {?} */
    MatAutocomplete.prototype._classList;
    /**
     * Unique ID to be used by autocomplete trigger's "aria-owns" property.
     * @type {?}
     */
    MatAutocomplete.prototype.id;
    /**
     * @type {?}
     * @private
     */
    MatAutocomplete.prototype._changeDetectorRef;
    /**
     * @type {?}
     * @private
     */
    MatAutocomplete.prototype._elementRef;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1gsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBR0wsMkJBQTJCLEVBQzNCLFdBQVcsRUFDWCxTQUFTLEVBQ1Qsa0JBQWtCLEdBQ25CLE1BQU0sd0JBQXdCLENBQUM7Ozs7OztJQU81Qiw0QkFBNEIsR0FBRyxDQUFDOzs7O0FBR3BDLE1BQU0sT0FBTyw0QkFBNEI7Ozs7O0lBQ3ZDLFlBRVMsTUFBdUIsRUFFdkIsTUFBaUI7UUFGakIsV0FBTSxHQUFOLE1BQU0sQ0FBaUI7UUFFdkIsV0FBTSxHQUFOLE1BQU0sQ0FBVztJQUFJLENBQUM7Q0FDaEM7Ozs7OztJQUhHLDhDQUE4Qjs7Ozs7SUFFOUIsOENBQXdCOzs7Ozs7QUFNNUIsTUFBTSxtQkFBbUI7Q0FBRzs7TUFDdEIseUJBQXlCLEdBQzNCLGtCQUFrQixDQUFDLG1CQUFtQixDQUFDOzs7OztBQUczQyxtREFHQzs7Ozs7O0lBREMsOERBQWdDOzs7Ozs7QUFJbEMsTUFBTSxPQUFPLGdDQUFnQyxHQUN6QyxJQUFJLGNBQWMsQ0FBZ0Msa0NBQWtDLEVBQUU7SUFDcEYsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxF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QUFlLFNBQUMsU0FBUyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzsyQkFHOUMsZUFBZSxTQUFDLFdBQVcsRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7MEJBR2hELEtBQUs7b0NBTUwsS0FBSzt5QkFXTCxLQUFLOzZCQUdMLE1BQU07cUJBSU4sTUFBTTtxQkFHTixNQUFNO3dCQU1OLEtBQUssU0FBQyxPQUFPOzs7O0lBb0VkLHdEQUFpRTs7SUFDakUsZ0RBQXlEOzs7OztJQWhJekQsc0NBQW1EOzs7OztJQUduRCxvQ0FBMkI7O0lBSTNCLGtDQUF5Qjs7Ozs7SUFPekIsbUNBQW1FOzs7OztJQUduRSxnQ0FBc0M7Ozs7O0lBR3RDLGtDQUErRTs7Ozs7SUFHL0UsdUNBQXdGOzs7OztJQUd4RixzQ0FBNkQ7Ozs7O0lBVzdELGlEQUF3Qzs7Ozs7O0lBTXhDLHFDQUFxQzs7Ozs7SUFHckMseUNBQ3FEOzs7OztJQUdyRCxpQ0FBeUU7Ozs7O0lBR3pFLGlDQUF5RTs7SUFvQnpFLHFDQUEwQzs7Ozs7SUFHMUMsNkJBQWtFOzs7OztJQUdoRSw2Q0FBNkM7Ozs7O0lBQzdDLHNDQUE0QyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBDYW5EaXNhYmxlUmlwcGxlQ3RvcixcbiAgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULFxuICBNYXRPcHRncm91cCxcbiAgTWF0T3B0aW9uLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuXG5cbi8qKlxuICogQXV0b2NvbXBsZXRlIElEcyBuZWVkIHRvIGJlIHVuaXF1ZSBhY3Jvc3MgY29tcG9uZW50cywgc28gdGhpcyBjb3VudGVyIGV4aXN0cyBvdXRzaWRlIG9mXG4gKiB0aGUgY29tcG9uZW50IGRlZmluaXRpb24uXG4gKi9cbmxldCBfdW5pcXVlQXV0b2NvbXBsZXRlSWRDb3VudGVyID0gMDtcblxuLyoqIEV2ZW50IG9iamVjdCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiBhbiBhdXRvY29tcGxldGUgb3B0aW9uIGlzIHNlbGVjdGVkLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZVNlbGVjdGVkRXZlbnQge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogUmVmZXJlbmNlIHRvIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgICBwdWJsaWMgc291cmNlOiBNYXRBdXRvY29tcGxldGUsXG4gICAgLyoqIE9wdGlvbiB0aGF0IHdhcyBzZWxlY3RlZC4gKi9cbiAgICBwdWJsaWMgb3B0aW9uOiBNYXRPcHRpb24pIHsgfVxufVxuXG5cbi8vIEJvaWxlcnBsYXRlIGZvciBhcHBseWluZyBtaXhpbnMgdG8gTWF0QXV0b2NvbXBsZXRlLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNsYXNzIE1hdEF1dG9jb21wbGV0ZUJhc2Uge31cbmNvbnN0IF9NYXRBdXRvY29tcGxldGVNaXhpbkJhc2U6IENhbkRpc2FibGVSaXBwbGVDdG9yICYgdHlwZW9mIE1hdEF1dG9jb21wbGV0ZUJhc2UgPVxuICAgIG1peGluRGlzYWJsZVJpcHBsZShNYXRBdXRvY29tcGxldGVCYXNlKTtcblxuLyoqIERlZmF1bHQgYG1hdC1hdXRvY29tcGxldGVgIG9wdGlvbnMgdGhhdCBjYW4gYmUgb3ZlcnJpZGRlbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnMge1xuICAvKiogV2hldGhlciB0aGUgZmlyc3Qgb3B0aW9uIHNob3VsZCBiZSBoaWdobGlnaHRlZCB3aGVuIGFuIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuZWQuICovXG4gIGF1dG9BY3RpdmVGaXJzdE9wdGlvbj86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdG8gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciBgbWF0LWF1dG9jb21wbGV0ZWAuICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlMgPVxuICAgIG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucz4oJ21hdC1hdXRvY29tcGxldGUtZGVmYXVsdC1vcHRpb25zJywge1xuICAgICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgICAgZmFjdG9yeTogTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbiAgICB9KTtcblxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OU19GQUNUT1JZKCk6IE1hdEF1dG9jb21wbGV0ZURlZmF1bHRPcHRpb25zIHtcbiAgcmV0dXJuIHthdXRvQWN0aXZlRmlyc3RPcHRpb246IGZhbHNlfTtcbn1cblxuQENvbXBvbmVudCh7XG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gIHNlbGVjdG9yOiAnbWF0LWF1dG9jb21wbGV0ZScsXG4gIHRlbXBsYXRlVXJsOiAnYXV0b2NvbXBsZXRlLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnYXV0b2NvbXBsZXRlLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZXhwb3J0QXM6ICdtYXRBdXRvY29tcGxldGUnLFxuICBpbnB1dHM6IFsnZGlzYWJsZVJpcHBsZSddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1hdXRvY29tcGxldGUnXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIHtwcm92aWRlOiBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQsIHVzZUV4aXN0aW5nOiBNYXRBdXRvY29tcGxldGV9XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlIGV4dGVuZHMgX01hdEF1dG9jb21wbGV0ZU1peGluQmFzZSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsXG4gIENhbkRpc2FibGVSaXBwbGUge1xuXG4gIC8qKiBNYW5hZ2VzIGFjdGl2ZSBpdGVtIGluIG9wdGlvbiBsaXN0IGJhc2VkIG9uIGtleSBldmVudHMuICovXG4gIF9rZXlNYW5hZ2VyOiBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcjxNYXRPcHRpb24+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgc2hvdWxkIGJlIHZpc2libGUsIGRlcGVuZGluZyBvbiBvcHRpb24gbGVuZ3RoLiAqL1xuICBzaG93UGFuZWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW4uICovXG4gIGdldCBpc09wZW4oKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl9pc09wZW4gJiYgdGhpcy5zaG93UGFuZWw7IH1cbiAgX2lzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8vIFRoZSBAVmlld0NoaWxkIHF1ZXJ5IGZvciBUZW1wbGF0ZVJlZiBoZXJlIG5lZWRzIHRvIGJlIHN0YXRpYyBiZWNhdXNlIHNvbWUgY29kZSBwYXRoc1xuICAvLyBsZWFkIHRvIHRoZSBvdmVybGF5IGJlaW5nIGNyZWF0ZWQgYmVmb3JlIGNoYW5nZSBkZXRlY3Rpb24gaGFzIGZpbmlzaGVkIGZvciB0aGlzIGNvbXBvbmVudC5cbiAgLy8gTm90YWJseSwgYW5vdGhlciBjb21wb25lbnQgbWF5IHRyaWdnZXIgYGZvY3VzYCBvbiB0aGUgYXV0b2NvbXBsZXRlLXRyaWdnZXIuXG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZiwge3N0YXRpYzogdHJ1ZX0pIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKiBFbGVtZW50IGZvciB0aGUgcGFuZWwgY29udGFpbmluZyB0aGUgYXV0b2NvbXBsZXRlIG9wdGlvbnMuICovXG4gIEBWaWV3Q2hpbGQoJ3BhbmVsJykgcGFuZWw6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRPcHRpb24sIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbnM6IFF1ZXJ5TGlzdDxNYXRPcHRpb24+O1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0T3B0Z3JvdXAsIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbkdyb3VwczogUXVlcnlMaXN0PE1hdE9wdGdyb3VwPjtcblxuICAvKiogRnVuY3Rpb24gdGhhdCBtYXBzIGFuIG9wdGlvbidzIGNvbnRyb2wgdmFsdWUgdG8gaXRzIGRpc3BsYXkgdmFsdWUgaW4gdGhlIHRyaWdnZXIuICovXG4gIEBJbnB1dCgpIGRpc3BsYXlXaXRoOiAoKHZhbHVlOiBhbnkpID0+IHN0cmluZykgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZmlyc3Qgb3B0aW9uIHNob3VsZCBiZSBoaWdobGlnaHRlZCB3aGVuIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3BlbmVkLlxuICAgKiBDYW4gYmUgY29uZmlndXJlZCBnbG9iYWxseSB0aHJvdWdoIHRoZSBgTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNgIHRva2VuLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGF1dG9BY3RpdmVGaXJzdE9wdGlvbigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2F1dG9BY3RpdmVGaXJzdE9wdGlvbjsgfVxuICBzZXQgYXV0b0FjdGl2ZUZpcnN0T3B0aW9uKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fYXV0b0FjdGl2ZUZpcnN0T3B0aW9uID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9hdXRvQWN0aXZlRmlyc3RPcHRpb246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIHdpZHRoIG9mIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICBDYW4gYmUgYW55IENTUyBzaXppbmcgdmFsdWUsIG90aGVyd2lzZSBpdCB3aWxsXG4gICAqIG1hdGNoIHRoZSB3aWR0aCBvZiBpdHMgaG9zdC5cbiAgICovXG4gIEBJbnB1dCgpIHBhbmVsV2lkdGg6IHN0cmluZyB8IG51bWJlcjtcblxuICAvKiogRXZlbnQgdGhhdCBpcyBlbWl0dGVkIHdoZW5ldmVyIGFuIG9wdGlvbiBmcm9tIHRoZSBsaXN0IGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3B0aW9uU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50PiA9XG4gICAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdEF1dG9jb21wbGV0ZVNlbGVjdGVkRXZlbnQ+KCk7XG5cbiAgLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3BlbmVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3BlbmVkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgY2xvc2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2xvc2VkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG1hdC1hdXRvY29tcGxldGUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIHRvIHRoZSBwYW5lbFxuICAgKiBpbnNpZGUgdGhlIG92ZXJsYXkgY29udGFpbmVyIHRvIGFsbG93IGZvciBlYXN5IHN0eWxpbmcuXG4gICAqL1xuICBASW5wdXQoJ2NsYXNzJylcbiAgc2V0IGNsYXNzTGlzdCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgdGhpcy5fY2xhc3NMaXN0ID0gdmFsdWUuc3BsaXQoJyAnKS5yZWR1Y2UoKGNsYXNzTGlzdCwgY2xhc3NOYW1lKSA9PiB7XG4gICAgICAgIGNsYXNzTGlzdFtjbGFzc05hbWUudHJpbSgpXSA9IHRydWU7XG4gICAgICAgIHJldHVybiBjbGFzc0xpc3Q7XG4gICAgICB9LCB7fSBhcyB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jbGFzc0xpc3QgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLl9zZXRWaXNpYmlsaXR5Q2xhc3Nlcyh0aGlzLl9jbGFzc0xpc3QpO1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc05hbWUgPSAnJztcbiAgfVxuICBfY2xhc3NMaXN0OiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcblxuICAvKiogVW5pcXVlIElEIHRvIGJlIHVzZWQgYnkgYXV0b2NvbXBsZXRlIHRyaWdnZXIncyBcImFyaWEtb3duc1wiIHByb3BlcnR5LiAqL1xuICBpZDogc3RyaW5nID0gYG1hdC1hdXRvY29tcGxldGUtJHtfdW5pcXVlQXV0b2NvbXBsZXRlSWRDb3VudGVyKyt9YDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQEluamVjdChNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OUykgZGVmYXVsdHM6IE1hdEF1dG9jb21wbGV0ZURlZmF1bHRPcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX2F1dG9BY3RpdmVGaXJzdE9wdGlvbiA9ICEhZGVmYXVsdHMuYXV0b0FjdGl2ZUZpcnN0T3B0aW9uO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8TWF0T3B0aW9uPih0aGlzLm9wdGlvbnMpLndpdGhXcmFwKCk7XG4gICAgLy8gU2V0IHRoZSBpbml0aWFsIHZpc2liaWxpdHkgc3RhdGUuXG4gICAgdGhpcy5fc2V0VmlzaWJpbGl0eSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBhbmVsIHNjcm9sbFRvcC4gVGhpcyBhbGxvd3MgdXMgdG8gbWFudWFsbHkgc2Nyb2xsIHRvIGRpc3BsYXkgb3B0aW9uc1xuICAgKiBhYm92ZSBvciBiZWxvdyB0aGUgZm9sZCwgYXMgdGhleSBhcmUgbm90IGFjdHVhbGx5IGJlaW5nIGZvY3VzZWQgd2hlbiBhY3RpdmUuXG4gICAqL1xuICBfc2V0U2Nyb2xsVG9wKHNjcm9sbFRvcDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHBhbmVsJ3Mgc2Nyb2xsVG9wLiAqL1xuICBfZ2V0U2Nyb2xsVG9wKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwgPyB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wIDogMDtcbiAgfVxuXG4gIC8qKiBQYW5lbCBzaG91bGQgaGlkZSBpdHNlbGYgd2hlbiB0aGUgb3B0aW9uIGxpc3QgaXMgZW1wdHkuICovXG4gIF9zZXRWaXNpYmlsaXR5KCkge1xuICAgIHRoaXMuc2hvd1BhbmVsID0gISF0aGlzLm9wdGlvbnMubGVuZ3RoO1xuICAgIHRoaXMuX3NldFZpc2liaWxpdHlDbGFzc2VzKHRoaXMuX2NsYXNzTGlzdCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogRW1pdHMgdGhlIGBzZWxlY3RgIGV2ZW50LiAqL1xuICBfZW1pdFNlbGVjdEV2ZW50KG9wdGlvbjogTWF0T3B0aW9uKTogdm9pZCB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgTWF0QXV0b2NvbXBsZXRlU2VsZWN0ZWRFdmVudCh0aGlzLCBvcHRpb24pO1xuICAgIHRoaXMub3B0aW9uU2VsZWN0ZWQuZW1pdChldmVudCk7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgYXV0b2NvbXBsZXRlIHZpc2liaWxpdHkgY2xhc3NlcyBvbiBhIGNsYXNzbGlzdCBiYXNlZCBvbiB0aGUgcGFuZWwgaXMgdmlzaWJsZS4gKi9cbiAgcHJpdmF0ZSBfc2V0VmlzaWJpbGl0eUNsYXNzZXMoY2xhc3NMaXN0OiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0pIHtcbiAgICBjbGFzc0xpc3RbJ21hdC1hdXRvY29tcGxldGUtdmlzaWJsZSddID0gdGhpcy5zaG93UGFuZWw7XG4gICAgY2xhc3NMaXN0WydtYXQtYXV0b2NvbXBsZXRlLWhpZGRlbiddID0gIXRoaXMuc2hvd1BhbmVsO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2F1dG9BY3RpdmVGaXJzdE9wdGlvbjogYm9vbGVhbiB8IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IGJvb2xlYW4gfCBzdHJpbmc7XG59XG5cbiJdfQ==
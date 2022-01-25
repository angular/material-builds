/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty, coerceStringArray } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Inject, InjectionToken, Input, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation, Directive, } from '@angular/core';
import { MAT_OPTGROUP, MAT_OPTION_PARENT_COMPONENT, mixinDisableRipple, MatOption, } from '@angular/material/core';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/platform";
import * as i2 from "@angular/common";
/**
 * Autocomplete IDs need to be unique across components, so this counter exists outside of
 * the component definition.
 */
let _uniqueAutocompleteIdCounter = 0;
/** Event object that is emitted when an autocomplete option is selected. */
export class MatAutocompleteSelectedEvent {
    constructor(
    /** Reference to the autocomplete panel that emitted the event. */
    source, 
    /** Option that was selected. */
    option) {
        this.source = source;
        this.option = option;
    }
}
// Boilerplate for applying mixins to MatAutocomplete.
/** @docs-private */
const _MatAutocompleteMixinBase = mixinDisableRipple(class {
});
/** Injection token to be used to override the default options for `mat-autocomplete`. */
export const MAT_AUTOCOMPLETE_DEFAULT_OPTIONS = new InjectionToken('mat-autocomplete-default-options', {
    providedIn: 'root',
    factory: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY,
});
/** @docs-private */
export function MAT_AUTOCOMPLETE_DEFAULT_OPTIONS_FACTORY() {
    return { autoActiveFirstOption: false };
}
/** Base class with all of the `MatAutocomplete` functionality. */
export class _MatAutocompleteBase extends _MatAutocompleteMixinBase {
    constructor(_changeDetectorRef, _elementRef, defaults, platform) {
        super();
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._activeOptionChanges = Subscription.EMPTY;
        /** Whether the autocomplete panel should be visible, depending on option length. */
        this.showPanel = false;
        this._isOpen = false;
        /** Function that maps an option's control value to its display value in the trigger. */
        this.displayWith = null;
        /** Event that is emitted whenever an option from the list is selected. */
        this.optionSelected = new EventEmitter();
        /** Event that is emitted when the autocomplete panel is opened. */
        this.opened = new EventEmitter();
        /** Event that is emitted when the autocomplete panel is closed. */
        this.closed = new EventEmitter();
        /** Emits whenever an option is activated using the keyboard. */
        this.optionActivated = new EventEmitter();
        this._classList = {};
        /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
        this.id = `mat-autocomplete-${_uniqueAutocompleteIdCounter++}`;
        // TODO(crisbeto): the problem that the `inertGroups` option resolves is only present on
        // Safari using VoiceOver. We should occasionally check back to see whether the bug
        // wasn't resolved in VoiceOver, and if it has, we can remove this and the `inertGroups`
        // option altogether.
        this.inertGroups = platform?.SAFARI || false;
        this._autoActiveFirstOption = !!defaults.autoActiveFirstOption;
    }
    /** Whether the autocomplete panel is open. */
    get isOpen() {
        return this._isOpen && this.showPanel;
    }
    /**
     * Whether the first option should be highlighted when the autocomplete panel is opened.
     * Can be configured globally through the `MAT_AUTOCOMPLETE_DEFAULT_OPTIONS` token.
     */
    get autoActiveFirstOption() {
        return this._autoActiveFirstOption;
    }
    set autoActiveFirstOption(value) {
        this._autoActiveFirstOption = coerceBooleanProperty(value);
    }
    /**
     * Takes classes set on the host mat-autocomplete element and applies them to the panel
     * inside the overlay container to allow for easy styling.
     */
    set classList(value) {
        if (value && value.length) {
            this._classList = coerceStringArray(value).reduce((classList, className) => {
                classList[className] = true;
                return classList;
            }, {});
        }
        else {
            this._classList = {};
        }
        this._setVisibilityClasses(this._classList);
        this._elementRef.nativeElement.className = '';
    }
    ngAfterContentInit() {
        this._keyManager = new ActiveDescendantKeyManager(this.options).withWrap();
        this._activeOptionChanges = this._keyManager.change.subscribe(index => {
            if (this.isOpen) {
                this.optionActivated.emit({ source: this, option: this.options.toArray()[index] || null });
            }
        });
        // Set the initial visibility state.
        this._setVisibility();
    }
    ngOnDestroy() {
        this._activeOptionChanges.unsubscribe();
    }
    /**
     * Sets the panel scrollTop. This allows us to manually scroll to display options
     * above or below the fold, as they are not actually being focused when active.
     */
    _setScrollTop(scrollTop) {
        if (this.panel) {
            this.panel.nativeElement.scrollTop = scrollTop;
        }
    }
    /** Returns the panel's scrollTop. */
    _getScrollTop() {
        return this.panel ? this.panel.nativeElement.scrollTop : 0;
    }
    /** Panel should hide itself when the option list is empty. */
    _setVisibility() {
        this.showPanel = !!this.options.length;
        this._setVisibilityClasses(this._classList);
        this._changeDetectorRef.markForCheck();
    }
    /** Emits the `select` event. */
    _emitSelectEvent(option) {
        const event = new MatAutocompleteSelectedEvent(this, option);
        this.optionSelected.emit(event);
    }
    /** Gets the aria-labelledby for the autocomplete panel. */
    _getPanelAriaLabelledby(labelId) {
        if (this.ariaLabel) {
            return null;
        }
        const labelExpression = labelId ? labelId + ' ' : '';
        return this.ariaLabelledby ? labelExpression + this.ariaLabelledby : labelId;
    }
    /** Sets the autocomplete visibility classes on a classlist based on the panel is visible. */
    _setVisibilityClasses(classList) {
        classList[this._visibleClass] = this.showPanel;
        classList[this._hiddenClass] = !this.showPanel;
    }
}
_MatAutocompleteBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0-rc.1", ngImport: i0, type: _MatAutocompleteBase, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS }, { token: i1.Platform }], target: i0.ɵɵFactoryTarget.Directive });
_MatAutocompleteBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.2.0-rc.1", type: _MatAutocompleteBase, inputs: { ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], displayWith: "displayWith", autoActiveFirstOption: "autoActiveFirstOption", panelWidth: "panelWidth", classList: ["class", "classList"] }, outputs: { optionSelected: "optionSelected", opened: "opened", closed: "closed", optionActivated: "optionActivated" }, viewQueries: [{ propertyName: "template", first: true, predicate: TemplateRef, descendants: true, static: true }, { propertyName: "panel", first: true, predicate: ["panel"], descendants: true }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0-rc.1", ngImport: i0, type: _MatAutocompleteBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_AUTOCOMPLETE_DEFAULT_OPTIONS]
                }] }, { type: i1.Platform }]; }, propDecorators: { template: [{
                type: ViewChild,
                args: [TemplateRef, { static: true }]
            }], panel: [{
                type: ViewChild,
                args: ['panel']
            }], ariaLabel: [{
                type: Input,
                args: ['aria-label']
            }], ariaLabelledby: [{
                type: Input,
                args: ['aria-labelledby']
            }], displayWith: [{
                type: Input
            }], autoActiveFirstOption: [{
                type: Input
            }], panelWidth: [{
                type: Input
            }], optionSelected: [{
                type: Output
            }], opened: [{
                type: Output
            }], closed: [{
                type: Output
            }], optionActivated: [{
                type: Output
            }], classList: [{
                type: Input,
                args: ['class']
            }] } });
export class MatAutocomplete extends _MatAutocompleteBase {
    constructor() {
        super(...arguments);
        this._visibleClass = 'mat-autocomplete-visible';
        this._hiddenClass = 'mat-autocomplete-hidden';
    }
}
MatAutocomplete.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.2.0-rc.1", ngImport: i0, type: MatAutocomplete, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatAutocomplete.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.2.0-rc.1", type: MatAutocomplete, selector: "mat-autocomplete", inputs: { disableRipple: "disableRipple" }, host: { classAttribute: "mat-autocomplete" }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], queries: [{ propertyName: "optionGroups", predicate: MAT_OPTGROUP, descendants: true }, { propertyName: "options", predicate: MatOption, descendants: true }], exportAs: ["matAutocomplete"], usesInheritance: true, ngImport: i0, template: "<ng-template let-formFieldId=\"id\">\n  <div class=\"mat-autocomplete-panel\"\n       role=\"listbox\"\n       [id]=\"id\"\n       [attr.aria-label]=\"ariaLabel || null\"\n       [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n       [ngClass]=\"_classList\"\n       #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: [".mat-autocomplete-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative;width:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}.mat-autocomplete-panel-above .mat-autocomplete-panel{border-radius:0;border-top-left-radius:4px;border-top-right-radius:4px}.mat-autocomplete-panel .mat-divider-horizontal{margin-top:-1px}.cdk-high-contrast-active .mat-autocomplete-panel{outline:solid 1px}mat-autocomplete{display:none}\n"], directives: [{ type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.2.0-rc.1", ngImport: i0, type: MatAutocomplete, decorators: [{
            type: Component,
            args: [{ selector: 'mat-autocomplete', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, exportAs: 'matAutocomplete', inputs: ['disableRipple'], host: {
                        'class': 'mat-autocomplete',
                    }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], template: "<ng-template let-formFieldId=\"id\">\n  <div class=\"mat-autocomplete-panel\"\n       role=\"listbox\"\n       [id]=\"id\"\n       [attr.aria-label]=\"ariaLabel || null\"\n       [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n       [ngClass]=\"_classList\"\n       #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: [".mat-autocomplete-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative;width:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}.mat-autocomplete-panel-above .mat-autocomplete-panel{border-radius:0;border-top-left-radius:4px;border-top-right-radius:4px}.mat-autocomplete-panel .mat-divider-horizontal{margin-top:-1px}.cdk-high-contrast-active .mat-autocomplete-panel{outline:solid 1px}mat-autocomplete{display:none}\n"] }]
        }], propDecorators: { optionGroups: [{
                type: ContentChildren,
                args: [MAT_OPTGROUP, { descendants: true }]
            }], options: [{
                type: ContentChildren,
                args: [MatOption, { descendants: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzdELE9BQU8sRUFBZSxxQkFBcUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdGLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1gsU0FBUyxFQUNULGlCQUFpQixFQUVqQixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUVMLFlBQVksRUFDWiwyQkFBMkIsRUFHM0Isa0JBQWtCLEVBQ2xCLFNBQVMsR0FFVixNQUFNLHdCQUF3QixDQUFDO0FBQ2hDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxNQUFNLENBQUM7Ozs7QUFFbEM7OztHQUdHO0FBQ0gsSUFBSSw0QkFBNEIsR0FBRyxDQUFDLENBQUM7QUFFckMsNEVBQTRFO0FBQzVFLE1BQU0sT0FBTyw0QkFBNEI7SUFDdkM7SUFDRSxrRUFBa0U7SUFDM0QsTUFBNEI7SUFDbkMsZ0NBQWdDO0lBQ3pCLE1BQXNCO1FBRnRCLFdBQU0sR0FBTixNQUFNLENBQXNCO1FBRTVCLFdBQU0sR0FBTixNQUFNLENBQWdCO0lBQzVCLENBQUM7Q0FDTDtBQVdELHNE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WTtnQkFHTyxjQUFjO3NCQUF2QyxLQUFLO3VCQUFDLGlCQUFpQjtnQkFHZixXQUFXO3NCQUFuQixLQUFLO2dCQU9GLHFCQUFxQjtzQkFEeEIsS0FBSztnQkFhRyxVQUFVO3NCQUFsQixLQUFLO2dCQUdhLGNBQWM7c0JBQWhDLE1BQU07Z0JBSVksTUFBTTtzQkFBeEIsTUFBTTtnQkFHWSxNQUFNO3NCQUF4QixNQUFNO2dCQUdZLGVBQWU7c0JBQWpDLE1BQU07Z0JBUUgsU0FBUztzQkFEWixLQUFLO3VCQUFDLE9BQU87O0FBbUhoQixNQUFNLE9BQU8sZUFBZ0IsU0FBUSxvQkFBb0I7SUFiekQ7O1FBa0JZLGtCQUFhLEdBQUcsMEJBQTBCLENBQUM7UUFDM0MsaUJBQVksR0FBRyx5QkFBeUIsQ0FBQztLQUNwRDs7aUhBUFksZUFBZTtxR0FBZixlQUFlLHFJQUZmLENBQUMsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBQyxDQUFDLHVEQUloRSxZQUFZLDZEQUVaLFNBQVMsc0dDN1M1QixnV0FXQTtnR0Q4UmEsZUFBZTtrQkFiM0IsU0FBUzsrQkFDRSxrQkFBa0IsaUJBR2IsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxZQUNyQyxpQkFBaUIsVUFDbkIsQ0FBQyxlQUFlLENBQUMsUUFDbkI7d0JBQ0osT0FBTyxFQUFFLGtCQUFrQjtxQkFDNUIsYUFDVSxDQUFDLEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLFdBQVcsaUJBQWlCLEVBQUMsQ0FBQzs4QkFJN0IsWUFBWTtzQkFBL0QsZUFBZTt1QkFBQyxZQUFZLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUVELE9BQU87c0JBQXZELGVBQWU7dUJBQUMsU0FBUyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5LCBjb2VyY2VTdHJpbmdBcnJheX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uRGVzdHJveSxcbiAgRGlyZWN0aXZlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIE1BVF9PUFRHUk9VUCxcbiAgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULFxuICBfTWF0T3B0Z3JvdXBCYXNlLFxuICBfTWF0T3B0aW9uQmFzZSxcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBNYXRPcHRpb24sXG4gIE1hdE9wdGdyb3VwLFxufSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9jb3JlJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxuLyoqXG4gKiBBdXRvY29tcGxldGUgSURzIG5lZWQgdG8gYmUgdW5pcXVlIGFjcm9zcyBjb21wb25lbnRzLCBzbyB0aGlzIGNvdW50ZXIgZXhpc3RzIG91dHNpZGUgb2ZcbiAqIHRoZSBjb21wb25lbnQgZGVmaW5pdGlvbi5cbiAqL1xubGV0IF91bmlxdWVBdXRvY29tcGxldGVJZENvdW50ZXIgPSAwO1xuXG4vKiogRXZlbnQgb2JqZWN0IHRoYXQgaXMgZW1pdHRlZCB3aGVuIGFuIGF1dG9jb21wbGV0ZSBvcHRpb24gaXMgc2VsZWN0ZWQuICovXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlU2VsZWN0ZWRFdmVudCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IF9NYXRBdXRvY29tcGxldGVCYXNlLFxuICAgIC8qKiBPcHRpb24gdGhhdCB3YXMgc2VsZWN0ZWQuICovXG4gICAgcHVibGljIG9wdGlvbjogX01hdE9wdGlvbkJhc2UsXG4gICkge31cbn1cblxuLyoqIEV2ZW50IG9iamVjdCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiBhbiBhdXRvY29tcGxldGUgb3B0aW9uIGlzIGFjdGl2YXRlZC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0QXV0b2NvbXBsZXRlQWN0aXZhdGVkRXZlbnQge1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgc291cmNlOiBfTWF0QXV0b2NvbXBsZXRlQmFzZTtcblxuICAvKiogT3B0aW9uIHRoYXQgd2FzIHNlbGVjdGVkLiAqL1xuICBvcHRpb246IF9NYXRPcHRpb25CYXNlIHwgbnVsbDtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRBdXRvY29tcGxldGUuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdEF1dG9jb21wbGV0ZU1peGluQmFzZSA9IG1peGluRGlzYWJsZVJpcHBsZShjbGFzcyB7fSk7XG5cbi8qKiBEZWZhdWx0IGBtYXQtYXV0b2NvbXBsZXRlYCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEF1dG9jb21wbGV0ZURlZmF1bHRPcHRpb25zIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGZpcnN0IG9wdGlvbiBzaG91bGQgYmUgaGlnaGxpZ2h0ZWQgd2hlbiBhbiBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3BlbmVkLiAqL1xuICBhdXRvQWN0aXZlRmlyc3RPcHRpb24/OiBib29sZWFuO1xuXG4gIC8qKiBDbGFzcyBvciBsaXN0IG9mIGNsYXNzZXMgdG8gYmUgYXBwbGllZCB0byB0aGUgYXV0b2NvbXBsZXRlJ3Mgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3ZlcmxheVBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtYXV0b2NvbXBsZXRlYC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucz4oXG4gICdtYXQtYXV0b2NvbXBsZXRlLWRlZmF1bHQtb3B0aW9ucycsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbiAgfSxcbik7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpOiBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7YXV0b0FjdGl2ZUZpcnN0T3B0aW9uOiBmYWxzZX07XG59XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0QXV0b2NvbXBsZXRlYCBmdW5jdGlvbmFsaXR5LiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdEF1dG9jb21wbGV0ZUJhc2VcbiAgZXh0ZW5kcyBfTWF0QXV0b2NvbXBsZXRlTWl4aW5CYXNlXG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQ2FuRGlzYWJsZVJpcHBsZSwgT25EZXN0cm95XG57XG4gIHByaXZhdGUgX2FjdGl2ZU9wdGlvbkNoYW5nZXMgPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIENsYXNzIHRvIGFwcGx5IHRvIHRoZSBwYW5lbCB3aGVuIGl0J3MgdmlzaWJsZS4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF92aXNpYmxlQ2xhc3M6IHN0cmluZztcblxuICAvKiogQ2xhc3MgdG8gYXBwbHkgdG8gdGhlIHBhbmVsIHdoZW4gaXQncyBoaWRkZW4uICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfaGlkZGVuQ2xhc3M6IHN0cmluZztcblxuICAvKiogTWFuYWdlcyBhY3RpdmUgaXRlbSBpbiBvcHRpb24gbGlzdCBiYXNlZCBvbiBrZXkgZXZlbnRzLiAqL1xuICBfa2V5TWFuYWdlcjogQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8X01hdE9wdGlvbkJhc2U+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgc2hvdWxkIGJlIHZpc2libGUsIGRlcGVuZGluZyBvbiBvcHRpb24gbGVuZ3RoLiAqL1xuICBzaG93UGFuZWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW4uICovXG4gIGdldCBpc09wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzT3BlbiAmJiB0aGlzLnNob3dQYW5lbDtcbiAgfVxuICBfaXNPcGVuOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLy8gVGhlIEBWaWV3Q2hpbGQgcXVlcnkgZm9yIFRlbXBsYXRlUmVmIGhlcmUgbmVlZHMgdG8gYmUgc3RhdGljIGJlY2F1c2Ugc29tZSBjb2RlIHBhdGhzXG4gIC8vIGxlYWQgdG8gdGhlIG92ZXJsYXkgYmVpbmcgY3JlYXRlZCBiZWZvcmUgY2hhbmdlIGRldGVjdGlvbiBoYXMgZmluaXNoZWQgZm9yIHRoaXMgY29tcG9uZW50LlxuICAvLyBOb3RhYmx5LCBhbm90aGVyIGNvbXBvbmVudCBtYXkgdHJpZ2dlciBgZm9jdXNgIG9uIHRoZSBhdXRvY29tcGxldGUtdHJpZ2dlci5cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBAVmlld0NoaWxkKFRlbXBsYXRlUmVmLCB7c3RhdGljOiB0cnVlfSkgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqIEVsZW1lbnQgZm9yIHRoZSBwYW5lbCBjb250YWluaW5nIHRoZSBhdXRvY29tcGxldGUgb3B0aW9ucy4gKi9cbiAgQFZpZXdDaGlsZCgncGFuZWwnKSBwYW5lbDogRWxlbWVudFJlZjtcblxuICAvKiogUmVmZXJlbmNlIHRvIGFsbCBvcHRpb25zIHdpdGhpbiB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBhYnN0cmFjdCBvcHRpb25zOiBRdWVyeUxpc3Q8X01hdE9wdGlvbkJhc2U+O1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gYWxsIG9wdGlvbiBncm91cHMgd2l0aGluIHRoZSBhdXRvY29tcGxldGUuICovXG4gIGFic3RyYWN0IG9wdGlvbkdyb3VwczogUXVlcnlMaXN0PF9NYXRPcHRncm91cEJhc2U+O1xuXG4gIC8qKiBBcmlhIGxhYmVsIG9mIHRoZSBhdXRvY29tcGxldGUuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbCcpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gIC8qKiBJbnB1dCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgdGhlIGBhcmlhLWxhYmVsbGVkYnlgIGF0dHJpYnV0ZS4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsbGVkYnknKSBhcmlhTGFiZWxsZWRieTogc3RyaW5nO1xuXG4gIC8qKiBGdW5jdGlvbiB0aGF0IG1hcHMgYW4gb3B0aW9uJ3MgY29udHJvbCB2YWx1ZSB0byBpdHMgZGlzcGxheSB2YWx1ZSBpbiB0aGUgdHJpZ2dlci4gKi9cbiAgQElucHV0KCkgZGlzcGxheVdpdGg6ICgodmFsdWU6IGFueSkgPT4gc3RyaW5nKSB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBmaXJzdCBvcHRpb24gc2hvdWxkIGJlIGhpZ2hsaWdodGVkIHdoZW4gdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuZWQuXG4gICAqIENhbiBiZSBjb25maWd1cmVkIGdsb2JhbGx5IHRocm91Z2ggdGhlIGBNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OU2AgdG9rZW4uXG4gICAqL1xuICBASW5wdXQoKVxuICBnZXQgYXV0b0FjdGl2ZUZpcnN0T3B0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hdXRvQWN0aXZlRmlyc3RPcHRpb247XG4gIH1cbiAgc2V0IGF1dG9BY3RpdmVGaXJzdE9wdGlvbih2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fYXV0b0FjdGl2ZUZpcnN0T3B0aW9uID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9hdXRvQWN0aXZlRmlyc3RPcHRpb246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIHdpZHRoIG9mIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICBDYW4gYmUgYW55IENTUyBzaXppbmcgdmFsdWUsIG90aGVyd2lzZSBpdCB3aWxsXG4gICAqIG1hdGNoIHRoZSB3aWR0aCBvZiBpdHMgaG9zdC5cbiAgICovXG4gIEBJbnB1dCgpIHBhbmVsV2lkdGg6IHN0cmluZyB8IG51bWJlcjtcblxuICAvKiogRXZlbnQgdGhhdCBpcyBlbWl0dGVkIHdoZW5ldmVyIGFuIG9wdGlvbiBmcm9tIHRoZSBsaXN0IGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3B0aW9uU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50PigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb3NlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhbiBvcHRpb24gaXMgYWN0aXZhdGVkIHVzaW5nIHRoZSBrZXlib2FyZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wdGlvbkFjdGl2YXRlZDogRXZlbnRFbWl0dGVyPE1hdEF1dG9jb21wbGV0ZUFjdGl2YXRlZEV2ZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVBY3RpdmF0ZWRFdmVudD4oKTtcblxuICAvKipcbiAgICogVGFrZXMgY2xhc3NlcyBzZXQgb24gdGhlIGhvc3QgbWF0LWF1dG9jb21wbGV0ZSBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZW0gdG8gdGhlIHBhbmVsXG4gICAqIGluc2lkZSB0aGUgb3ZlcmxheSBjb250YWluZXIgdG8gYWxsb3cgZm9yIGVhc3kgc3R5bGluZy5cbiAgICovXG4gIEBJbnB1dCgnY2xhc3MnKVxuICBzZXQgY2xhc3NMaXN0KHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2NsYXNzTGlzdCA9IGNvZXJjZVN0cmluZ0FycmF5KHZhbHVlKS5yZWR1Y2UoKGNsYXNzTGlzdCwgY2xhc3NOYW1lKSA9PiB7XG4gICAgICAgIGNsYXNzTGlzdFtjbGFzc05hbWVdID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGNsYXNzTGlzdDtcbiAgICAgIH0sIHt9IGFzIHtba2V5OiBzdHJpbmddOiBib29sZWFufSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NsYXNzTGlzdCA9IHt9O1xuICAgIH1cblxuICAgIHRoaXMuX3NldFZpc2liaWxpdHlDbGFzc2VzKHRoaXMuX2NsYXNzTGlzdCk7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTmFtZSA9ICcnO1xuICB9XG4gIF9jbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuXG4gIC8qKiBVbmlxdWUgSUQgdG8gYmUgdXNlZCBieSBhdXRvY29tcGxldGUgdHJpZ2dlcidzIFwiYXJpYS1vd25zXCIgcHJvcGVydHkuICovXG4gIGlkOiBzdHJpbmcgPSBgbWF0LWF1dG9jb21wbGV0ZS0ke191bmlxdWVBdXRvY29tcGxldGVJZENvdW50ZXIrK31gO1xuXG4gIC8qKlxuICAgKiBUZWxscyBhbnkgZGVzY2VuZGFudCBgbWF0LW9wdGdyb3VwYCB0byB1c2UgdGhlIGluZXJ0IGExMXkgcGF0dGVybi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5lcnRHcm91cHM6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlMpIGRlZmF1bHRzOiBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyxcbiAgICBwbGF0Zm9ybT86IFBsYXRmb3JtLFxuICApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoZSBwcm9ibGVtIHRoYXQgdGhlIGBpbmVydEdyb3Vwc2Agb3B0aW9uIHJlc29sdmVzIGlzIG9ubHkgcHJlc2VudCBvblxuICAgIC8vIFNhZmFyaSB1c2luZyBWb2ljZU92ZXIuIFdlIHNob3VsZCBvY2Nhc2lvbmFsbHkgY2hlY2sgYmFjayB0byBzZWUgd2hldGhlciB0aGUgYnVnXG4gICAgLy8gd2Fzbid0IHJlc29sdmVkIGluIFZvaWNlT3ZlciwgYW5kIGlmIGl0IGhhcywgd2UgY2FuIHJlbW92ZSB0aGlzIGFuZCB0aGUgYGluZXJ0R3JvdXBzYFxuICAgIC8vIG9wdGlvbiBhbHRvZ2V0aGVyLlxuICAgIHRoaXMuaW5lcnRHcm91cHMgPSBwbGF0Zm9ybT8uU0FGQVJJIHx8IGZhbHNlO1xuICAgIHRoaXMuX2F1dG9BY3RpdmVGaXJzdE9wdGlvbiA9ICEhZGVmYXVsdHMuYXV0b0FjdGl2ZUZpcnN0T3B0aW9uO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8X01hdE9wdGlvbkJhc2U+KHRoaXMub3B0aW9ucykud2l0aFdyYXAoKTtcbiAgICB0aGlzLl9hY3RpdmVPcHRpb25DaGFuZ2VzID0gdGhpcy5fa2V5TWFuYWdlci5jaGFuZ2Uuc3Vic2NyaWJlKGluZGV4ID0+IHtcbiAgICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgICB0aGlzLm9wdGlvbkFjdGl2YXRlZC5lbWl0KHtzb3VyY2U6IHRoaXMsIG9wdGlvbjogdGhpcy5vcHRpb25zLnRvQXJyYXkoKVtpbmRleF0gfHwgbnVsbH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2V0IHRoZSBpbml0aWFsIHZpc2liaWxpdHkgc3RhdGUuXG4gICAgdGhpcy5fc2V0VmlzaWJpbGl0eSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fYWN0aXZlT3B0aW9uQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBhbmVsIHNjcm9sbFRvcC4gVGhpcyBhbGxvd3MgdXMgdG8gbWFudWFsbHkgc2Nyb2xsIHRvIGRpc3BsYXkgb3B0aW9uc1xuICAgKiBhYm92ZSBvciBiZWxvdyB0aGUgZm9sZCwgYXMgdGhleSBhcmUgbm90IGFjdHVhbGx5IGJlaW5nIGZvY3VzZWQgd2hlbiBhY3RpdmUuXG4gICAqL1xuICBfc2V0U2Nyb2xsVG9wKHNjcm9sbFRvcDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHBhbmVsJ3Mgc2Nyb2xsVG9wLiAqL1xuICBfZ2V0U2Nyb2xsVG9wKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwgPyB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wIDogMDtcbiAgfVxuXG4gIC8qKiBQYW5lbCBzaG91bGQgaGlkZSBpdHNlbGYgd2hlbiB0aGUgb3B0aW9uIGxpc3QgaXMgZW1wdHkuICovXG4gIF9zZXRWaXNpYmlsaXR5KCkge1xuICAgIHRoaXMuc2hvd1BhbmVsID0gISF0aGlzLm9wdGlvbnMubGVuZ3RoO1xuICAgIHRoaXMuX3NldFZpc2liaWxpdHlDbGFzc2VzKHRoaXMuX2NsYXNzTGlzdCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogRW1pdHMgdGhlIGBzZWxlY3RgIGV2ZW50LiAqL1xuICBfZW1pdFNlbGVjdEV2ZW50KG9wdGlvbjogX01hdE9wdGlvbkJhc2UpOiB2b2lkIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50KHRoaXMsIG9wdGlvbik7XG4gICAgdGhpcy5vcHRpb25TZWxlY3RlZC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcmlhLWxhYmVsbGVkYnkgZm9yIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIF9nZXRQYW5lbEFyaWFMYWJlbGxlZGJ5KGxhYmVsSWQ6IHN0cmluZyB8IG51bGwpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5hcmlhTGFiZWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGxhYmVsRXhwcmVzc2lvbiA9IGxhYmVsSWQgPyBsYWJlbElkICsgJyAnIDogJyc7XG4gICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsbGVkYnkgPyBsYWJlbEV4cHJlc3Npb24gKyB0aGlzLmFyaWFMYWJlbGxlZGJ5IDogbGFiZWxJZDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBhdXRvY29tcGxldGUgdmlzaWJpbGl0eSBjbGFzc2VzIG9uIGEgY2xhc3NsaXN0IGJhc2VkIG9uIHRoZSBwYW5lbCBpcyB2aXNpYmxlLiAqL1xuICBwcml2YXRlIF9zZXRWaXNpYmlsaXR5Q2xhc3NlcyhjbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSkge1xuICAgIGNsYXNzTGlzdFt0aGlzLl92aXNpYmxlQ2xhc3NdID0gdGhpcy5zaG93UGFuZWw7XG4gICAgY2xhc3NMaXN0W3RoaXMuX2hpZGRlbkNsYXNzXSA9ICF0aGlzLnNob3dQYW5lbDtcbiAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtYXV0b2NvbXBsZXRlJyxcbiAgdGVtcGxhdGVVcmw6ICdhdXRvY29tcGxldGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydhdXRvY29tcGxldGUuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBleHBvcnRBczogJ21hdEF1dG9jb21wbGV0ZScsXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWF1dG9jb21wbGV0ZScsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQsIHVzZUV4aXN0aW5nOiBNYXRBdXRvY29tcGxldGV9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlIGV4dGVuZHMgX01hdEF1dG9jb21wbGV0ZUJhc2Uge1xuICAvKiogUmVmZXJlbmNlIHRvIGFsbCBvcHRpb24gZ3JvdXBzIHdpdGhpbiB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1BVF9PUFRHUk9VUCwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uR3JvdXBzOiBRdWVyeUxpc3Q8TWF0T3B0Z3JvdXA+O1xuICAvKiogUmVmZXJlbmNlIHRvIGFsbCBvcHRpb25zIHdpdGhpbiB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdE9wdGlvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uczogUXVlcnlMaXN0PE1hdE9wdGlvbj47XG4gIHByb3RlY3RlZCBfdmlzaWJsZUNsYXNzID0gJ21hdC1hdXRvY29tcGxldGUtdmlzaWJsZSc7XG4gIHByb3RlY3RlZCBfaGlkZGVuQ2xhc3MgPSAnbWF0LWF1dG9jb21wbGV0ZS1oaWRkZW4nO1xufVxuIiwiPG5nLXRlbXBsYXRlIGxldC1mb3JtRmllbGRJZD1cImlkXCI+XG4gIDxkaXYgY2xhc3M9XCJtYXQtYXV0b2NvbXBsZXRlLXBhbmVsXCJcbiAgICAgICByb2xlPVwibGlzdGJveFwiXG4gICAgICAgW2lkXT1cImlkXCJcbiAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbCB8fCBudWxsXCJcbiAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiX2dldFBhbmVsQXJpYUxhYmVsbGVkYnkoZm9ybUZpZWxkSWQpXCJcbiAgICAgICBbbmdDbGFzc109XCJfY2xhc3NMaXN0XCJcbiAgICAgICAjcGFuZWw+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=
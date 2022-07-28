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
import { MAT_OPTGROUP, MAT_OPTION_PARENT_COMPONENT, MatLegacyOption, } from '@angular/material/legacy-core';
import { mixinDisableRipple } from '@angular/material/core';
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
    return { autoActiveFirstOption: false, autoSelectActiveOption: false };
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
        /** Emits whenever an option is activated. */
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
        this._autoSelectActiveOption = !!defaults.autoSelectActiveOption;
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
    /** Whether the active option should be selected as the user is navigating. */
    get autoSelectActiveOption() {
        return this._autoSelectActiveOption;
    }
    set autoSelectActiveOption(value) {
        this._autoSelectActiveOption = coerceBooleanProperty(value);
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
_MatAutocompleteBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: _MatAutocompleteBase, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS }, { token: i1.Platform }], target: i0.ɵɵFactoryTarget.Directive });
_MatAutocompleteBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: _MatAutocompleteBase, inputs: { ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], displayWith: "displayWith", autoActiveFirstOption: "autoActiveFirstOption", autoSelectActiveOption: "autoSelectActiveOption", panelWidth: "panelWidth", classList: ["class", "classList"] }, outputs: { optionSelected: "optionSelected", opened: "opened", closed: "closed", optionActivated: "optionActivated" }, viewQueries: [{ propertyName: "template", first: true, predicate: TemplateRef, descendants: true, static: true }, { propertyName: "panel", first: true, predicate: ["panel"], descendants: true }], usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: _MatAutocompleteBase, decorators: [{
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
            }], autoSelectActiveOption: [{
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
MatAutocomplete.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatAutocomplete, deps: null, target: i0.ɵɵFactoryTarget.Component });
MatAutocomplete.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.1", type: MatAutocomplete, selector: "mat-autocomplete", inputs: { disableRipple: "disableRipple" }, host: { classAttribute: "mat-autocomplete" }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], queries: [{ propertyName: "optionGroups", predicate: MAT_OPTGROUP, descendants: true }, { propertyName: "options", predicate: MatLegacyOption, descendants: true }], exportAs: ["matAutocomplete"], usesInheritance: true, ngImport: i0, template: "<ng-template let-formFieldId=\"id\">\n  <div class=\"mat-autocomplete-panel\"\n       role=\"listbox\"\n       [id]=\"id\"\n       [attr.aria-label]=\"ariaLabel || null\"\n       [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n       [ngClass]=\"_classList\"\n       #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: [".mat-autocomplete-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative;width:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}.mat-autocomplete-panel-above .mat-autocomplete-panel{border-radius:0;border-top-left-radius:4px;border-top-right-radius:4px}.mat-autocomplete-panel .mat-divider-horizontal{margin-top:-1px}.cdk-high-contrast-active .mat-autocomplete-panel{outline:solid 1px}mat-autocomplete{display:none}"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatAutocomplete, decorators: [{
            type: Component,
            args: [{ selector: 'mat-autocomplete', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, exportAs: 'matAutocomplete', inputs: ['disableRipple'], host: {
                        'class': 'mat-autocomplete',
                    }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], template: "<ng-template let-formFieldId=\"id\">\n  <div class=\"mat-autocomplete-panel\"\n       role=\"listbox\"\n       [id]=\"id\"\n       [attr.aria-label]=\"ariaLabel || null\"\n       [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n       [ngClass]=\"_classList\"\n       #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: [".mat-autocomplete-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;visibility:hidden;max-width:none;max-height:256px;position:relative;width:100%;border-bottom-left-radius:4px;border-bottom-right-radius:4px}.mat-autocomplete-panel.mat-autocomplete-visible{visibility:visible}.mat-autocomplete-panel.mat-autocomplete-hidden{visibility:hidden}.mat-autocomplete-panel-above .mat-autocomplete-panel{border-radius:0;border-top-left-radius:4px;border-top-right-radius:4px}.mat-autocomplete-panel .mat-divider-horizontal{margin-top:-1px}.cdk-high-contrast-active .mat-autocomplete-panel{outline:solid 1px}mat-autocomplete{display:none}"] }]
        }], propDecorators: { optionGroups: [{
                type: ContentChildren,
                args: [MAT_OPTGROUP, { descendants: true }]
            }], options: [{
                type: ContentChildren,
                args: [MatLegacyOption, { descendants: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQywwQkFBMEIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzdELE9BQU8sRUFBZSxxQkFBcUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzdGLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQyxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1gsU0FBUyxFQUNULGlCQUFpQixFQUVqQixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLFlBQVksRUFDWiwyQkFBMkIsRUFHM0IsZUFBZSxHQUVoQixNQUFNLCtCQUErQixDQUFDO0FBQ3ZDLE9BQU8sRUFBbUIsa0JBQWtCLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUM1RSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7O0FBRWxDOzs7R0FHRztBQUNILElBQUksNEJBQTRCLEdBQUcsQ0FBQyxDQUFDO0FBRXJDLDRFQUE0RTtBQUM1RSxNQUFNLE9BQU8sNEJBQTRCO0lBQ3ZDO0lBQ0Usa0VBQWtFO0lBQzNELE1BQTRCO0lBQ25DLGdDQUFnQztJQUN6QixNQUFzQjtRQUZ0QixXQUFNLEdBQU4sTUFBTSxDQUFzQjtRQUU1QixXQUFNLEdBQU4sTUFBTSxDQUFnQjtJQUM1QixDQUFDO0NBQ0w7QUFXRCxzREFBc0Q7QUFDdEQsb0JBQW9CO0FBQ3BCLE1BQU0seUJBQXlCLEdBQUcsa0JBQWtCLENBQUM7Q0FBUSxDQUFDLENBQUM7QUFjL0QseUZBQXlGO0FBQ3pGLE1BQU0sQ0FBQyxNQUFNLGdDQUFnQyxHQUFHLElBQUksY0FBYyxDQUNoRSxrQ0FBa0MsRUFDbEM7SUFDRSxVQUFVLEVBQUUsTUFBTTtJQUNsQixPQUFPLEVBQUUsd0NBQXdDO0NBQ2xELENBQ0YsQ0FBQztBQUVGLG9CQUFvQjtBQUNwQixNQUFNLFVBQVUsd0NBQXdDO0lBQ3RELE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxLQUFLLEVBQUUsc0JBQXNCLEVBQUUsS0FBSyxFQUFDLENBQUM7QUFDdkUsQ0FBQztBQUVELGtFQUFrRTtBQUVsRSxNQUFNLE9BQWdCLG9CQUNwQixTQUFRLHlCQUF5QjtJQXdIakMsWUFDVSxrQkFBcUMsRUFDckMsV0FBb0MsRUFDRixRQUF1QyxFQUNqRixRQUFtQjtRQUVuQixLQUFLLEVBQUUsQ0FBQztRQUxBLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7UUFDckMsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBdkh0Qyx5QkFBb0IsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBV2xELG9GQUFvRjtRQUNwRixjQUFTLEdBQVksS0FBSyxDQUFDO1FBTTNCLFlBQU8sR0FBWSxLQUFLLENBQUM7UUF3QnpCLHdGQUF3RjtRQUMvRSxnQkFBVyxHQUFvQyxJQUFJLENBQUM7UUErQjdELDBFQUEwRTtRQUN2RCxtQkFBYyxHQUMvQixJQUFJLFlBQVksRUFBZ0MsQ0FBQztRQUVuRCxtRUFBbUU7UUFDaEQsV0FBTSxHQUF1QixJQUFJLFlBQVksRUFBUSxDQUFDO1FBRXpFLG1FQUFtRTtRQUNoRCxXQUFNLEdBQXVCLElBQUksWUFBWSxFQUFRLENBQUM7UUFFekUsNkNBQTZDO1FBQzFCLG9CQUFlLEdBQ2hDLElBQUksWUFBWSxFQUFpQyxDQUFDO1FBb0JwRCxlQUFVLEdBQTZCLEVBQUUsQ0FBQztRQUUxQywyRUFBMkU7UUFDM0UsT0FBRSxHQUFXLG9CQUFvQiw0QkFBNEIsRUFBRSxFQUFFLENBQUM7UUFnQmhFLHdGQUF3RjtRQUN4RixtRkFBbUY7UUFDbkYsd0ZBQXdGO1FBQ3hGLHFCQUFxQjtRQUNyQixJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDO1FBQzdDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDO1FBQy9ELElBQUksQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDO0lBQ25FLENBQUM7SUF0SEQsOENBQThDO0lBQzlDLElBQUksTUFBTTtRQUNSLE9BQU8sSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3hDLENBQUM7SUE0QkQ7OztPQUdHO0lBQ0gsSUFDSSxxQkFBcUI7UUFDdkIsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUM7SUFDckMsQ0FBQztJQUNELElBQUkscUJBQXFCLENBQUMsS0FBbUI7UUFDM0MsSUFBSSxDQUFDLHNCQUFzQixHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFHRCw4RUFBOEU7SUFDOUUsSUFDSSxzQkFBc0I7UUFDeEIsT0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUM7SUFDdEMsQ0FBQztJQUNELElBQUksc0JBQXNCLENBQUMsS0FBbUI7UUFDNUMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlELENBQUM7SUF1QkQ7OztPQUdHO0lBQ0gsSUFDSSxTQUFTLENBQUMsS0FBd0I7UUFDcEMsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBRTtnQkFDekUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDNUIsT0FBTyxTQUFTLENBQUM7WUFDbkIsQ0FBQyxFQUFFLEVBQThCLENBQUMsQ0FBQztTQUNwQzthQUFNO1lBQ0wsSUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7U0FDdEI7UUFFRCxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDaEQsQ0FBQztJQTZCRCxrQkFBa0I7UUFDaEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLDBCQUEwQixDQUFpQixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDM0YsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNwRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBQyxDQUFDLENBQUM7YUFDMUY7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILG9DQUFvQztRQUNwQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDMUMsQ0FBQztJQUVEOzs7T0FHRztJQUNILGFBQWEsQ0FBQyxTQUFpQjtRQUM3QixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1NBQ2hEO0lBQ0gsQ0FBQztJQUVELHFDQUFxQztJQUNyQyxhQUFhO1FBQ1gsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsOERBQThEO0lBQzlELGNBQWM7UUFDWixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUN2QyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsZ0NBQWdDO0lBQ2hDLGdCQUFnQixDQUFDLE1BQXNCO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUksNEJBQTRCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRCwyREFBMkQ7SUFDM0QsdUJBQXVCLENBQUMsT0FBc0I7UUFDNUMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNyRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFDL0UsQ0FBQztJQUVELDZGQUE2RjtJQUNyRixxQkFBcUIsQ0FBQyxTQUFtQztRQUMvRCxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDL0MsU0FBUyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDakQsQ0FBQzs7aUhBcE1tQixvQkFBb0IsNkVBNEg5QixnQ0FBZ0M7cUdBNUh0QixvQkFBb0IsaWVBNkI3QixXQUFXOzJGQTdCRixvQkFBb0I7a0JBRHpDLFNBQVM7OzBCQTZITCxNQUFNOzJCQUFDLGdDQUFnQzttRUEvRkYsUUFBUTtzQkFBL0MsU0FBUzt1QkFBQyxXQUFXLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQUdsQixLQUFLO3NCQUF4QixTQUFTO3VCQUFDLE9BQU87Z0JBU0csU0FBUztzQkFBN0IsS0FBSzt1QkFBQyxZQUFZO2dCQUdPLGNBQWM7c0JBQXZDLEtBQUs7dUJBQUMsaUJBQWlCO2dCQUdmLFdBQVc7c0JBQW5CLEtBQUs7Z0JBT0YscUJBQXFCO3NCQUR4QixLQUFLO2dCQVdGLHNCQUFzQjtzQkFEekIsS0FBSztnQkFhRyxVQUFVO3NCQUFsQixLQUFLO2dCQUdhLGNBQWM7c0JBQWhDLE1BQU07Z0JBSVksTUFBTTtzQkFBeEIsTUFBTTtnQkFHWSxNQUFNO3NCQUF4QixNQUFNO2dCQUdZLGVBQWU7c0JBQWpDLE1BQU07Z0JBUUgsU0FBUztzQkFEWixLQUFLO3VCQUFDLE9BQU87O0FBb0hoQixNQUFNLE9BQU8sZUFBZ0IsU0FBUSxvQkFBb0I7SUFiekQ7O1FBa0JZLGtCQUFhLEdBQUcsMEJBQTBCLENBQUM7UUFDM0MsaUJBQVksR0FBRyx5QkFBeUIsQ0FBQztLQUNwRDs7NEdBUFksZUFBZTtnR0FBZixlQUFlLHFJQUZmLENBQUMsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBQyxDQUFDLHVEQUloRSxZQUFZLDZEQUVaLGVBQWUsc0dDMVRsQyxnV0FXQTsyRkQyU2EsZUFBZTtrQkFiM0IsU0FBUzsrQkFDRSxrQkFBa0IsaUJBR2IsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxZQUNyQyxpQkFBaUIsVUFDbkIsQ0FBQyxlQUFlLENBQUMsUUFDbkI7d0JBQ0osT0FBTyxFQUFFLGtCQUFrQjtxQkFDNUIsYUFDVSxDQUFDLEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLFdBQVcsaUJBQWlCLEVBQUMsQ0FBQzs4QkFJN0IsWUFBWTtzQkFBL0QsZUFBZTt1QkFBQyxZQUFZLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUVLLE9BQU87c0JBQTdELGVBQWU7dUJBQUMsZUFBZSxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0FjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5LCBjb2VyY2VTdHJpbmdBcnJheX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uRGVzdHJveSxcbiAgRGlyZWN0aXZlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIE1BVF9PUFRHUk9VUCxcbiAgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULFxuICBfTWF0T3B0Z3JvdXBCYXNlLFxuICBfTWF0T3B0aW9uQmFzZSxcbiAgTWF0TGVnYWN5T3B0aW9uLFxuICBNYXRMZWdhY3lPcHRncm91cCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGVnYWN5LWNvcmUnO1xuaW1wb3J0IHtDYW5EaXNhYmxlUmlwcGxlLCBtaXhpbkRpc2FibGVSaXBwbGV9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIEF1dG9jb21wbGV0ZSBJRHMgbmVlZCB0byBiZSB1bmlxdWUgYWNyb3NzIGNvbXBvbmVudHMsIHNvIHRoaXMgY291bnRlciBleGlzdHMgb3V0c2lkZSBvZlxuICogdGhlIGNvbXBvbmVudCBkZWZpbml0aW9uLlxuICovXG5sZXQgX3VuaXF1ZUF1dG9jb21wbGV0ZUlkQ291bnRlciA9IDA7XG5cbi8qKiBFdmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gYW4gYXV0b2NvbXBsZXRlIG9wdGlvbiBpcyBzZWxlY3RlZC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogX01hdEF1dG9jb21wbGV0ZUJhc2UsXG4gICAgLyoqIE9wdGlvbiB0aGF0IHdhcyBzZWxlY3RlZC4gKi9cbiAgICBwdWJsaWMgb3B0aW9uOiBfTWF0T3B0aW9uQmFzZSxcbiAgKSB7fVxufVxuXG4vKiogRXZlbnQgb2JqZWN0IHRoYXQgaXMgZW1pdHRlZCB3aGVuIGFuIGF1dG9jb21wbGV0ZSBvcHRpb24gaXMgYWN0aXZhdGVkLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRBdXRvY29tcGxldGVBY3RpdmF0ZWRFdmVudCB7XG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICBzb3VyY2U6IF9NYXRBdXRvY29tcGxldGVCYXNlO1xuXG4gIC8qKiBPcHRpb24gdGhhdCB3YXMgc2VsZWN0ZWQuICovXG4gIG9wdGlvbjogX01hdE9wdGlvbkJhc2UgfCBudWxsO1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEF1dG9jb21wbGV0ZS5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0QXV0b2NvbXBsZXRlTWl4aW5CYXNlID0gbWl4aW5EaXNhYmxlUmlwcGxlKGNsYXNzIHt9KTtcblxuLyoqIERlZmF1bHQgYG1hdC1hdXRvY29tcGxldGVgIG9wdGlvbnMgdGhhdCBjYW4gYmUgb3ZlcnJpZGRlbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnMge1xuICAvKiogV2hldGhlciB0aGUgZmlyc3Qgb3B0aW9uIHNob3VsZCBiZSBoaWdobGlnaHRlZCB3aGVuIGFuIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuZWQuICovXG4gIGF1dG9BY3RpdmVGaXJzdE9wdGlvbj86IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFjdGl2ZSBvcHRpb24gc2hvdWxkIGJlIHNlbGVjdGVkIGFzIHRoZSB1c2VyIGlzIG5hdmlnYXRpbmcuICovXG4gIGF1dG9TZWxlY3RBY3RpdmVPcHRpb24/OiBib29sZWFuO1xuXG4gIC8qKiBDbGFzcyBvciBsaXN0IG9mIGNsYXNzZXMgdG8gYmUgYXBwbGllZCB0byB0aGUgYXV0b2NvbXBsZXRlJ3Mgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3ZlcmxheVBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtYXV0b2NvbXBsZXRlYC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucz4oXG4gICdtYXQtYXV0b2NvbXBsZXRlLWRlZmF1bHQtb3B0aW9ucycsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbiAgfSxcbik7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpOiBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7YXV0b0FjdGl2ZUZpcnN0T3B0aW9uOiBmYWxzZSwgYXV0b1NlbGVjdEFjdGl2ZU9wdGlvbjogZmFsc2V9O1xufVxuXG4vKiogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdEF1dG9jb21wbGV0ZWAgZnVuY3Rpb25hbGl0eS4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRBdXRvY29tcGxldGVCYXNlXG4gIGV4dGVuZHMgX01hdEF1dG9jb21wbGV0ZU1peGluQmFzZVxuICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIENhbkRpc2FibGVSaXBwbGUsIE9uRGVzdHJveVxue1xuICBwcml2YXRlIF9hY3RpdmVPcHRpb25DaGFuZ2VzID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBDbGFzcyB0byBhcHBseSB0byB0aGUgcGFuZWwgd2hlbiBpdCdzIHZpc2libGUuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfdmlzaWJsZUNsYXNzOiBzdHJpbmc7XG5cbiAgLyoqIENsYXNzIHRvIGFwcGx5IHRvIHRoZSBwYW5lbCB3aGVuIGl0J3MgaGlkZGVuLiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2hpZGRlbkNsYXNzOiBzdHJpbmc7XG5cbiAgLyoqIE1hbmFnZXMgYWN0aXZlIGl0ZW0gaW4gb3B0aW9uIGxpc3QgYmFzZWQgb24ga2V5IGV2ZW50cy4gKi9cbiAgX2tleU1hbmFnZXI6IEFjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyPF9NYXRPcHRpb25CYXNlPjtcblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHNob3VsZCBiZSB2aXNpYmxlLCBkZXBlbmRpbmcgb24gb3B0aW9uIGxlbmd0aC4gKi9cbiAgc2hvd1BhbmVsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuLiAqL1xuICBnZXQgaXNPcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pc09wZW4gJiYgdGhpcy5zaG93UGFuZWw7XG4gIH1cbiAgX2lzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8vIFRoZSBAVmlld0NoaWxkIHF1ZXJ5IGZvciBUZW1wbGF0ZVJlZiBoZXJlIG5lZWRzIHRvIGJlIHN0YXRpYyBiZWNhdXNlIHNvbWUgY29kZSBwYXRoc1xuICAvLyBsZWFkIHRvIHRoZSBvdmVybGF5IGJlaW5nIGNyZWF0ZWQgYmVmb3JlIGNoYW5nZSBkZXRlY3Rpb24gaGFzIGZpbmlzaGVkIGZvciB0aGlzIGNvbXBvbmVudC5cbiAgLy8gTm90YWJseSwgYW5vdGhlciBjb21wb25lbnQgbWF5IHRyaWdnZXIgYGZvY3VzYCBvbiB0aGUgYXV0b2NvbXBsZXRlLXRyaWdnZXIuXG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZiwge3N0YXRpYzogdHJ1ZX0pIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKiBFbGVtZW50IGZvciB0aGUgcGFuZWwgY29udGFpbmluZyB0aGUgYXV0b2NvbXBsZXRlIG9wdGlvbnMuICovXG4gIEBWaWV3Q2hpbGQoJ3BhbmVsJykgcGFuZWw6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byBhbGwgb3B0aW9ucyB3aXRoaW4gdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgYWJzdHJhY3Qgb3B0aW9uczogUXVlcnlMaXN0PF9NYXRPcHRpb25CYXNlPjtcblxuICAvKiogUmVmZXJlbmNlIHRvIGFsbCBvcHRpb24gZ3JvdXBzIHdpdGhpbiB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBhYnN0cmFjdCBvcHRpb25Hcm91cHM6IFF1ZXJ5TGlzdDxfTWF0T3B0Z3JvdXBCYXNlPjtcblxuICAvKiogQXJpYSBsYWJlbCBvZiB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAvKiogSW5wdXQgdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZztcblxuICAvKiogRnVuY3Rpb24gdGhhdCBtYXBzIGFuIG9wdGlvbidzIGNvbnRyb2wgdmFsdWUgdG8gaXRzIGRpc3BsYXkgdmFsdWUgaW4gdGhlIHRyaWdnZXIuICovXG4gIEBJbnB1dCgpIGRpc3BsYXlXaXRoOiAoKHZhbHVlOiBhbnkpID0+IHN0cmluZykgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZmlyc3Qgb3B0aW9uIHNob3VsZCBiZSBoaWdobGlnaHRlZCB3aGVuIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3BlbmVkLlxuICAgKiBDYW4gYmUgY29uZmlndXJlZCBnbG9iYWxseSB0aHJvdWdoIHRoZSBgTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNgIHRva2VuLlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IGF1dG9BY3RpdmVGaXJzdE9wdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYXV0b0FjdGl2ZUZpcnN0T3B0aW9uO1xuICB9XG4gIHNldCBhdXRvQWN0aXZlRmlyc3RPcHRpb24odmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2F1dG9BY3RpdmVGaXJzdE9wdGlvbiA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfYXV0b0FjdGl2ZUZpcnN0T3B0aW9uOiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBhY3RpdmUgb3B0aW9uIHNob3VsZCBiZSBzZWxlY3RlZCBhcyB0aGUgdXNlciBpcyBuYXZpZ2F0aW5nLiAqL1xuICBASW5wdXQoKVxuICBnZXQgYXV0b1NlbGVjdEFjdGl2ZU9wdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fYXV0b1NlbGVjdEFjdGl2ZU9wdGlvbjtcbiAgfVxuICBzZXQgYXV0b1NlbGVjdEFjdGl2ZU9wdGlvbih2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fYXV0b1NlbGVjdEFjdGl2ZU9wdGlvbiA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfYXV0b1NlbGVjdEFjdGl2ZU9wdGlvbjogYm9vbGVhbjtcblxuICAvKipcbiAgICogU3BlY2lmeSB0aGUgd2lkdGggb2YgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC4gIENhbiBiZSBhbnkgQ1NTIHNpemluZyB2YWx1ZSwgb3RoZXJ3aXNlIGl0IHdpbGxcbiAgICogbWF0Y2ggdGhlIHdpZHRoIG9mIGl0cyBob3N0LlxuICAgKi9cbiAgQElucHV0KCkgcGFuZWxXaWR0aDogc3RyaW5nIHwgbnVtYmVyO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbmV2ZXIgYW4gb3B0aW9uIGZyb20gdGhlIGxpc3QgaXMgc2VsZWN0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBvcHRpb25TZWxlY3RlZDogRXZlbnRFbWl0dGVyPE1hdEF1dG9jb21wbGV0ZVNlbGVjdGVkRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdEF1dG9jb21wbGV0ZVNlbGVjdGVkRXZlbnQ+KCk7XG5cbiAgLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3BlbmVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3BlbmVkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgY2xvc2VkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2xvc2VkOiBFdmVudEVtaXR0ZXI8dm9pZD4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqIEVtaXRzIHdoZW5ldmVyIGFuIG9wdGlvbiBpcyBhY3RpdmF0ZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBvcHRpb25BY3RpdmF0ZWQ6IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVBY3RpdmF0ZWRFdmVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0QXV0b2NvbXBsZXRlQWN0aXZhdGVkRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIFRha2VzIGNsYXNzZXMgc2V0IG9uIHRoZSBob3N0IG1hdC1hdXRvY29tcGxldGUgZWxlbWVudCBhbmQgYXBwbGllcyB0aGVtIHRvIHRoZSBwYW5lbFxuICAgKiBpbnNpZGUgdGhlIG92ZXJsYXkgY29udGFpbmVyIHRvIGFsbG93IGZvciBlYXN5IHN0eWxpbmcuXG4gICAqL1xuICBASW5wdXQoJ2NsYXNzJylcbiAgc2V0IGNsYXNzTGlzdCh2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pIHtcbiAgICBpZiAodmFsdWUgJiYgdmFsdWUubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9jbGFzc0xpc3QgPSBjb2VyY2VTdHJpbmdBcnJheSh2YWx1ZSkucmVkdWNlKChjbGFzc0xpc3QsIGNsYXNzTmFtZSkgPT4ge1xuICAgICAgICBjbGFzc0xpc3RbY2xhc3NOYW1lXSA9IHRydWU7XG4gICAgICAgIHJldHVybiBjbGFzc0xpc3Q7XG4gICAgICB9LCB7fSBhcyB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jbGFzc0xpc3QgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLl9zZXRWaXNpYmlsaXR5Q2xhc3Nlcyh0aGlzLl9jbGFzc0xpc3QpO1xuICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc05hbWUgPSAnJztcbiAgfVxuICBfY2xhc3NMaXN0OiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0gPSB7fTtcblxuICAvKiogVW5pcXVlIElEIHRvIGJlIHVzZWQgYnkgYXV0b2NvbXBsZXRlIHRyaWdnZXIncyBcImFyaWEtb3duc1wiIHByb3BlcnR5LiAqL1xuICBpZDogc3RyaW5nID0gYG1hdC1hdXRvY29tcGxldGUtJHtfdW5pcXVlQXV0b2NvbXBsZXRlSWRDb3VudGVyKyt9YDtcblxuICAvKipcbiAgICogVGVsbHMgYW55IGRlc2NlbmRhbnQgYG1hdC1vcHRncm91cGAgdG8gdXNlIHRoZSBpbmVydCBhMTF5IHBhdHRlcm4uXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlYWRvbmx5IGluZXJ0R3JvdXBzOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBASW5qZWN0KE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TKSBkZWZhdWx0czogTWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnMsXG4gICAgcGxhdGZvcm0/OiBQbGF0Zm9ybSxcbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGUgcHJvYmxlbSB0aGF0IHRoZSBgaW5lcnRHcm91cHNgIG9wdGlvbiByZXNvbHZlcyBpcyBvbmx5IHByZXNlbnQgb25cbiAgICAvLyBTYWZhcmkgdXNpbmcgVm9pY2VPdmVyLiBXZSBzaG91bGQgb2NjYXNpb25hbGx5IGNoZWNrIGJhY2sgdG8gc2VlIHdoZXRoZXIgdGhlIGJ1Z1xuICAgIC8vIHdhc24ndCByZXNvbHZlZCBpbiBWb2ljZU92ZXIsIGFuZCBpZiBpdCBoYXMsIHdlIGNhbiByZW1vdmUgdGhpcyBhbmQgdGhlIGBpbmVydEdyb3Vwc2BcbiAgICAvLyBvcHRpb24gYWx0b2dldGhlci5cbiAgICB0aGlzLmluZXJ0R3JvdXBzID0gcGxhdGZvcm0/LlNBRkFSSSB8fCBmYWxzZTtcbiAgICB0aGlzLl9hdXRvQWN0aXZlRmlyc3RPcHRpb24gPSAhIWRlZmF1bHRzLmF1dG9BY3RpdmVGaXJzdE9wdGlvbjtcbiAgICB0aGlzLl9hdXRvU2VsZWN0QWN0aXZlT3B0aW9uID0gISFkZWZhdWx0cy5hdXRvU2VsZWN0QWN0aXZlT3B0aW9uO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8X01hdE9wdGlvbkJhc2U+KHRoaXMub3B0aW9ucykud2l0aFdyYXAoKTtcbiAgICB0aGlzLl9hY3RpdmVPcHRpb25DaGFuZ2VzID0gdGhpcy5fa2V5TWFuYWdlci5jaGFuZ2Uuc3Vic2NyaWJlKGluZGV4ID0+IHtcbiAgICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgICB0aGlzLm9wdGlvbkFjdGl2YXRlZC5lbWl0KHtzb3VyY2U6IHRoaXMsIG9wdGlvbjogdGhpcy5vcHRpb25zLnRvQXJyYXkoKVtpbmRleF0gfHwgbnVsbH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2V0IHRoZSBpbml0aWFsIHZpc2liaWxpdHkgc3RhdGUuXG4gICAgdGhpcy5fc2V0VmlzaWJpbGl0eSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fYWN0aXZlT3B0aW9uQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBhbmVsIHNjcm9sbFRvcC4gVGhpcyBhbGxvd3MgdXMgdG8gbWFudWFsbHkgc2Nyb2xsIHRvIGRpc3BsYXkgb3B0aW9uc1xuICAgKiBhYm92ZSBvciBiZWxvdyB0aGUgZm9sZCwgYXMgdGhleSBhcmUgbm90IGFjdHVhbGx5IGJlaW5nIGZvY3VzZWQgd2hlbiBhY3RpdmUuXG4gICAqL1xuICBfc2V0U2Nyb2xsVG9wKHNjcm9sbFRvcDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHBhbmVsJ3Mgc2Nyb2xsVG9wLiAqL1xuICBfZ2V0U2Nyb2xsVG9wKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwgPyB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wIDogMDtcbiAgfVxuXG4gIC8qKiBQYW5lbCBzaG91bGQgaGlkZSBpdHNlbGYgd2hlbiB0aGUgb3B0aW9uIGxpc3QgaXMgZW1wdHkuICovXG4gIF9zZXRWaXNpYmlsaXR5KCkge1xuICAgIHRoaXMuc2hvd1BhbmVsID0gISF0aGlzLm9wdGlvbnMubGVuZ3RoO1xuICAgIHRoaXMuX3NldFZpc2liaWxpdHlDbGFzc2VzKHRoaXMuX2NsYXNzTGlzdCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogRW1pdHMgdGhlIGBzZWxlY3RgIGV2ZW50LiAqL1xuICBfZW1pdFNlbGVjdEV2ZW50KG9wdGlvbjogX01hdE9wdGlvbkJhc2UpOiB2b2lkIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50KHRoaXMsIG9wdGlvbik7XG4gICAgdGhpcy5vcHRpb25TZWxlY3RlZC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcmlhLWxhYmVsbGVkYnkgZm9yIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIF9nZXRQYW5lbEFyaWFMYWJlbGxlZGJ5KGxhYmVsSWQ6IHN0cmluZyB8IG51bGwpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5hcmlhTGFiZWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGxhYmVsRXhwcmVzc2lvbiA9IGxhYmVsSWQgPyBsYWJlbElkICsgJyAnIDogJyc7XG4gICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsbGVkYnkgPyBsYWJlbEV4cHJlc3Npb24gKyB0aGlzLmFyaWFMYWJlbGxlZGJ5IDogbGFiZWxJZDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBhdXRvY29tcGxldGUgdmlzaWJpbGl0eSBjbGFzc2VzIG9uIGEgY2xhc3NsaXN0IGJhc2VkIG9uIHRoZSBwYW5lbCBpcyB2aXNpYmxlLiAqL1xuICBwcml2YXRlIF9zZXRWaXNpYmlsaXR5Q2xhc3NlcyhjbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSkge1xuICAgIGNsYXNzTGlzdFt0aGlzLl92aXNpYmxlQ2xhc3NdID0gdGhpcy5zaG93UGFuZWw7XG4gICAgY2xhc3NMaXN0W3RoaXMuX2hpZGRlbkNsYXNzXSA9ICF0aGlzLnNob3dQYW5lbDtcbiAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtYXV0b2NvbXBsZXRlJyxcbiAgdGVtcGxhdGVVcmw6ICdhdXRvY29tcGxldGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydhdXRvY29tcGxldGUuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBleHBvcnRBczogJ21hdEF1dG9jb21wbGV0ZScsXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LWF1dG9jb21wbGV0ZScsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQsIHVzZUV4aXN0aW5nOiBNYXRBdXRvY29tcGxldGV9XSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlIGV4dGVuZHMgX01hdEF1dG9jb21wbGV0ZUJhc2Uge1xuICAvKiogUmVmZXJlbmNlIHRvIGFsbCBvcHRpb24gZ3JvdXBzIHdpdGhpbiB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1BVF9PUFRHUk9VUCwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uR3JvdXBzOiBRdWVyeUxpc3Q8TWF0TGVnYWN5T3B0Z3JvdXA+O1xuICAvKiogUmVmZXJlbmNlIHRvIGFsbCBvcHRpb25zIHdpdGhpbiB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdExlZ2FjeU9wdGlvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uczogUXVlcnlMaXN0PE1hdExlZ2FjeU9wdGlvbj47XG4gIHByb3RlY3RlZCBfdmlzaWJsZUNsYXNzID0gJ21hdC1hdXRvY29tcGxldGUtdmlzaWJsZSc7XG4gIHByb3RlY3RlZCBfaGlkZGVuQ2xhc3MgPSAnbWF0LWF1dG9jb21wbGV0ZS1oaWRkZW4nO1xufVxuIiwiPG5nLXRlbXBsYXRlIGxldC1mb3JtRmllbGRJZD1cImlkXCI+XG4gIDxkaXYgY2xhc3M9XCJtYXQtYXV0b2NvbXBsZXRlLXBhbmVsXCJcbiAgICAgICByb2xlPVwibGlzdGJveFwiXG4gICAgICAgW2lkXT1cImlkXCJcbiAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbCB8fCBudWxsXCJcbiAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiX2dldFBhbmVsQXJpYUxhYmVsbGVkYnkoZm9ybUZpZWxkSWQpXCJcbiAgICAgICBbbmdDbGFzc109XCJfY2xhc3NMaXN0XCJcbiAgICAgICAjcGFuZWw+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=
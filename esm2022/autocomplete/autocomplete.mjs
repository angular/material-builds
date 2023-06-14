/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, EventEmitter, Inject, InjectionToken, Input, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MAT_OPTGROUP, MAT_OPTION_PARENT_COMPONENT, MatOption, mixinDisableRipple, } from '@angular/material/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty, coerceStringArray } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { panelAnimation } from './animations';
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
    return {
        autoActiveFirstOption: false,
        autoSelectActiveOption: false,
        hideSingleSelectionIndicator: false,
    };
}
/** Base class with all of the `MatAutocomplete` functionality. */
export class _MatAutocompleteBase extends _MatAutocompleteMixinBase {
    /** Whether the autocomplete panel is open. */
    get isOpen() {
        return this._isOpen && this.showPanel;
    }
    /** @docs-private Sets the theme color of the panel. */
    _setColor(value) {
        this._color = value;
        this._setThemeClasses(this._classList);
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
        this._setThemeClasses(this._classList);
        this._elementRef.nativeElement.className = '';
    }
    constructor(_changeDetectorRef, _elementRef, _defaults, platform) {
        super();
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._defaults = _defaults;
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
        this._autoActiveFirstOption = !!_defaults.autoActiveFirstOption;
        this._autoSelectActiveOption = !!_defaults.autoSelectActiveOption;
    }
    ngAfterContentInit() {
        this._keyManager = new ActiveDescendantKeyManager(this.options)
            .withWrap()
            .skipPredicate(this._skipPredicate);
        this._activeOptionChanges = this._keyManager.change.subscribe(index => {
            if (this.isOpen) {
                this.optionActivated.emit({ source: this, option: this.options.toArray()[index] || null });
            }
        });
        // Set the initial visibility state.
        this._setVisibility();
    }
    ngOnDestroy() {
        this._keyManager?.destroy();
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
    /** Sets the theming classes on a classlist based on the theme of the panel. */
    _setThemeClasses(classList) {
        classList['mat-primary'] = this._color === 'primary';
        classList['mat-warn'] = this._color === 'warn';
        classList['mat-accent'] = this._color === 'accent';
    }
    _skipPredicate(option) {
        return option.disabled;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: _MatAutocompleteBase, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS }, { token: i1.Platform }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.1", type: _MatAutocompleteBase, inputs: { ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], displayWith: "displayWith", autoActiveFirstOption: "autoActiveFirstOption", autoSelectActiveOption: "autoSelectActiveOption", panelWidth: "panelWidth", classList: ["class", "classList"] }, outputs: { optionSelected: "optionSelected", opened: "opened", closed: "closed", optionActivated: "optionActivated" }, viewQueries: [{ propertyName: "template", first: true, predicate: TemplateRef, descendants: true, static: true }, { propertyName: "panel", first: true, predicate: ["panel"], descendants: true }], usesInheritance: true, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: _MatAutocompleteBase, decorators: [{
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
        this._visibleClass = 'mat-mdc-autocomplete-visible';
        this._hiddenClass = 'mat-mdc-autocomplete-hidden';
        this._hideSingleSelectionIndicator = this._defaults.hideSingleSelectionIndicator ?? false;
    }
    /** Whether checkmark indicator for single-selection options is hidden. */
    get hideSingleSelectionIndicator() {
        return this._hideSingleSelectionIndicator;
    }
    set hideSingleSelectionIndicator(value) {
        this._hideSingleSelectionIndicator = coerceBooleanProperty(value);
        this._syncParentProperties();
    }
    /** Syncs the parent state with the individual options. */
    _syncParentProperties() {
        if (this.options) {
            for (const option of this.options) {
                option._changeDetectorRef.markForCheck();
            }
        }
    }
    // `skipPredicate` determines if key manager should avoid putting a given option in the tab
    // order. Allow disabled list items to receive focus via keyboard to align with WAI ARIA
    // recommendation.
    //
    // Normally WAI ARIA's instructions are to exclude disabled items from the tab order, but it
    // makes a few exceptions for compound widgets.
    //
    // From [Developing a Keyboard Interface](
    // https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/):
    //   "For the following composite widget elements, keep them focusable when disabled: Options in a
    //   Listbox..."
    //
    // The user can focus disabled options using the keyboard, but the user cannot click disabled
    // options.
    _skipPredicate(_option) {
        return false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatAutocomplete, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatAutocomplete, selector: "mat-autocomplete", inputs: { disableRipple: "disableRipple", hideSingleSelectionIndicator: "hideSingleSelectionIndicator" }, host: { attributes: { "ngSkipHydration": "" }, classAttribute: "mat-mdc-autocomplete" }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], queries: [{ propertyName: "optionGroups", predicate: MAT_OPTGROUP, descendants: true }, { propertyName: "options", predicate: MatOption, descendants: true }], exportAs: ["matAutocomplete"], usesInheritance: true, ngImport: i0, template: "<ng-template let-formFieldId=\"id\">\n  <div\n    class=\"mat-mdc-autocomplete-panel mdc-menu-surface mdc-menu-surface--open\"\n    role=\"listbox\"\n    [id]=\"id\"\n    [ngClass]=\"_classList\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n    [@panelAnimation]=\"isOpen ? 'visible' : 'hidden'\"\n    #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: ["div.mat-mdc-autocomplete-panel{box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);width:100%;max-height:256px;visibility:hidden;transform-origin:center top;overflow:auto;padding:8px 0;border-radius:4px;box-sizing:border-box;position:static;background-color:var(--mat-autocomplete-background-color)}.cdk-high-contrast-active div.mat-mdc-autocomplete-panel{outline:solid 1px}.cdk-overlay-pane:not(.mat-mdc-autocomplete-panel-above) div.mat-mdc-autocomplete-panel{border-top-left-radius:0;border-top-right-radius:0}.mat-mdc-autocomplete-panel-above div.mat-mdc-autocomplete-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;transform-origin:center bottom}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-visible{visibility:visible}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-hidden{visibility:hidden}mat-autocomplete{display:none}"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], animations: [panelAnimation], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatAutocomplete, decorators: [{
            type: Component,
            args: [{ selector: 'mat-autocomplete', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, exportAs: 'matAutocomplete', inputs: ['disableRipple'], host: {
                        'class': 'mat-mdc-autocomplete',
                        'ngSkipHydration': '',
                    }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], animations: [panelAnimation], template: "<ng-template let-formFieldId=\"id\">\n  <div\n    class=\"mat-mdc-autocomplete-panel mdc-menu-surface mdc-menu-surface--open\"\n    role=\"listbox\"\n    [id]=\"id\"\n    [ngClass]=\"_classList\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n    [@panelAnimation]=\"isOpen ? 'visible' : 'hidden'\"\n    #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: ["div.mat-mdc-autocomplete-panel{box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);width:100%;max-height:256px;visibility:hidden;transform-origin:center top;overflow:auto;padding:8px 0;border-radius:4px;box-sizing:border-box;position:static;background-color:var(--mat-autocomplete-background-color)}.cdk-high-contrast-active div.mat-mdc-autocomplete-panel{outline:solid 1px}.cdk-overlay-pane:not(.mat-mdc-autocomplete-panel-above) div.mat-mdc-autocomplete-panel{border-top-left-radius:0;border-top-right-radius:0}.mat-mdc-autocomplete-panel-above div.mat-mdc-autocomplete-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;transform-origin:center bottom}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-visible{visibility:visible}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-hidden{visibility:hidden}mat-autocomplete{display:none}"] }]
        }], propDecorators: { optionGroups: [{
                type: ContentChildren,
                args: [MAT_OPTGROUP, { descendants: true }]
            }], options: [{
                type: ContentChildren,
                args: [MatOption, { descendants: true }]
            }], hideSingleSelectionIndicator: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1gsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsWUFBWSxFQUNaLDJCQUEyQixFQUUzQixTQUFTLEVBQ1Qsa0JBQWtCLEdBS25CLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0QsT0FBTyxFQUFlLHFCQUFxQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0YsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDNUMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQzs7OztBQUVsQzs7O0dBR0c7QUFDSCxJQUFJLDRCQUE0QixHQUFHLENBQUMsQ0FBQztBQUVyQyw0RUFBNEU7QUFDNUUsTUFBTSxPQUFPLDRCQUE0QjtJQUN2QztJQUNFLGtFQUFrRTtJQUMzRCxNQUE0QjtJQUNuQyxnQ0FBZ0M7SUFDekIsTUFBc0I7UUFGdEIsV0FBTSxHQUFOLE1BQU0sQ0FBc0I7UUFFNUIsV0FB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QWtFO0lBQ2xFLGtHQUFrRztJQUNsRyxnQkFBZ0I7SUFDaEIsRUFBRTtJQUNGLDZGQUE2RjtJQUM3RixXQUFXO0lBQ1EsY0FBYyxDQUFDLE9BQXVCO1FBQ3ZELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQzs4R0E3Q1UsZUFBZTtrR0FBZixlQUFlLDhPQUhmLENBQUMsRUFBQyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBQyxDQUFDLHVEQUtoRSxZQUFZLDZEQUVaLFNBQVMsc0dDN1Y1Qix3YkFhQSxxaUNEMFVjLENBQUMsY0FBYyxDQUFDOzsyRkFFakIsZUFBZTtrQkFmM0IsU0FBUzsrQkFDRSxrQkFBa0IsaUJBR2IsaUJBQWlCLENBQUMsSUFBSSxtQkFDcEIsdUJBQXVCLENBQUMsTUFBTSxZQUNyQyxpQkFBaUIsVUFDbkIsQ0FBQyxlQUFlLENBQUMsUUFDbkI7d0JBQ0osT0FBTyxFQUFFLHNCQUFzQjt3QkFDL0IsaUJBQWlCLEVBQUUsRUFBRTtxQkFDdEIsYUFDVSxDQUFDLEVBQUMsT0FBTyxFQUFFLDJCQUEyQixFQUFFLFdBQVcsaUJBQWlCLEVBQUMsQ0FBQyxjQUNyRSxDQUFDLGNBQWMsQ0FBQzs4QkFJd0IsWUFBWTtzQkFBL0QsZUFBZTt1QkFBQyxZQUFZLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUVELE9BQU87c0JBQXZELGVBQWU7dUJBQUMsU0FBUyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQztnQkFNM0MsNEJBQTRCO3NCQUQvQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdGlvblRva2VuLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgTUFUX09QVEdST1VQLFxuICBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQsXG4gIE1hdE9wdGdyb3VwLFxuICBNYXRPcHRpb24sXG4gIG1peGluRGlzYWJsZVJpcHBsZSxcbiAgQ2FuRGlzYWJsZVJpcHBsZSxcbiAgX01hdE9wdGlvbkJhc2UsXG4gIF9NYXRPcHRncm91cEJhc2UsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5LCBjb2VyY2VTdHJpbmdBcnJheX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge3BhbmVsQW5pbWF0aW9ufSBmcm9tICcuL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIEF1dG9jb21wbGV0ZSBJRHMgbmVlZCB0byBiZSB1bmlxdWUgYWNyb3NzIGNvbXBvbmVudHMsIHNvIHRoaXMgY291bnRlciBleGlzdHMgb3V0c2lkZSBvZlxuICogdGhlIGNvbXBvbmVudCBkZWZpbml0aW9uLlxuICovXG5sZXQgX3VuaXF1ZUF1dG9jb21wbGV0ZUlkQ291bnRlciA9IDA7XG5cbi8qKiBFdmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gYW4gYXV0b2NvbXBsZXRlIG9wdGlvbiBpcyBzZWxlY3RlZC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogX01hdEF1dG9jb21wbGV0ZUJhc2UsXG4gICAgLyoqIE9wdGlvbiB0aGF0IHdhcyBzZWxlY3RlZC4gKi9cbiAgICBwdWJsaWMgb3B0aW9uOiBfTWF0T3B0aW9uQmFzZSxcbiAgKSB7fVxufVxuXG4vKiogRXZlbnQgb2JqZWN0IHRoYXQgaXMgZW1pdHRlZCB3aGVuIGFuIGF1dG9jb21wbGV0ZSBvcHRpb24gaXMgYWN0aXZhdGVkLiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYXRBdXRvY29tcGxldGVBY3RpdmF0ZWRFdmVudCB7XG4gIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICBzb3VyY2U6IF9NYXRBdXRvY29tcGxldGVCYXNlO1xuXG4gIC8qKiBPcHRpb24gdGhhdCB3YXMgc2VsZWN0ZWQuICovXG4gIG9wdGlvbjogX01hdE9wdGlvbkJhc2UgfCBudWxsO1xufVxuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIE1hdEF1dG9jb21wbGV0ZS5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5jb25zdCBfTWF0QXV0b2NvbXBsZXRlTWl4aW5CYXNlID0gbWl4aW5EaXNhYmxlUmlwcGxlKGNsYXNzIHt9KTtcblxuLyoqIERlZmF1bHQgYG1hdC1hdXRvY29tcGxldGVgIG9wdGlvbnMgdGhhdCBjYW4gYmUgb3ZlcnJpZGRlbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnMge1xuICAvKiogV2hldGhlciB0aGUgZmlyc3Qgb3B0aW9uIHNob3VsZCBiZSBoaWdobGlnaHRlZCB3aGVuIGFuIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuZWQuICovXG4gIGF1dG9BY3RpdmVGaXJzdE9wdGlvbj86IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFjdGl2ZSBvcHRpb24gc2hvdWxkIGJlIHNlbGVjdGVkIGFzIHRoZSB1c2VyIGlzIG5hdmlnYXRpbmcuICovXG4gIGF1dG9TZWxlY3RBY3RpdmVPcHRpb24/OiBib29sZWFuO1xuXG4gIC8qKiBDbGFzcyBvciBsaXN0IG9mIGNsYXNzZXMgdG8gYmUgYXBwbGllZCB0byB0aGUgYXV0b2NvbXBsZXRlJ3Mgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3ZlcmxheVBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogV2hldGVyIGljb24gaW5kaWNhdG9ycyBzaG91bGQgYmUgaGlkZGVuIGZvciBzaW5nbGUtc2VsZWN0aW9uLiAqL1xuICBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yPzogYm9vbGVhbjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtYXV0b2NvbXBsZXRlYC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucz4oXG4gICdtYXQtYXV0b2NvbXBsZXRlLWRlZmF1bHQtb3B0aW9ucycsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbiAgfSxcbik7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpOiBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgYXV0b0FjdGl2ZUZpcnN0T3B0aW9uOiBmYWxzZSxcbiAgICBhdXRvU2VsZWN0QWN0aXZlT3B0aW9uOiBmYWxzZSxcbiAgICBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yOiBmYWxzZSxcbiAgfTtcbn1cblxuLyoqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRBdXRvY29tcGxldGVgIGZ1bmN0aW9uYWxpdHkuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBfTWF0QXV0b2NvbXBsZXRlQmFzZVxuICBleHRlbmRzIF9NYXRBdXRvY29tcGxldGVNaXhpbkJhc2VcbiAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBDYW5EaXNhYmxlUmlwcGxlLCBPbkRlc3Ryb3lcbntcbiAgcHJpdmF0ZSBfYWN0aXZlT3B0aW9uQ2hhbmdlcyA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcblxuICAvKiogQ2xhc3MgdG8gYXBwbHkgdG8gdGhlIHBhbmVsIHdoZW4gaXQncyB2aXNpYmxlLiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX3Zpc2libGVDbGFzczogc3RyaW5nO1xuXG4gIC8qKiBDbGFzcyB0byBhcHBseSB0byB0aGUgcGFuZWwgd2hlbiBpdCdzIGhpZGRlbi4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9oaWRkZW5DbGFzczogc3RyaW5nO1xuXG4gIC8qKiBNYW5hZ2VzIGFjdGl2ZSBpdGVtIGluIG9wdGlvbiBsaXN0IGJhc2VkIG9uIGtleSBldmVudHMuICovXG4gIF9rZXlNYW5hZ2VyOiBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcjxfTWF0T3B0aW9uQmFzZT47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBzaG91bGQgYmUgdmlzaWJsZSwgZGVwZW5kaW5nIG9uIG9wdGlvbiBsZW5ndGguICovXG4gIHNob3dQYW5lbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3Blbi4gKi9cbiAgZ2V0IGlzT3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNPcGVuICYmIHRoaXMuc2hvd1BhbmVsO1xuICB9XG4gIF9pc09wZW46IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSBTZXRzIHRoZSB0aGVtZSBjb2xvciBvZiB0aGUgcGFuZWwuICovXG4gIF9zZXRDb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgdGhpcy5fY29sb3IgPSB2YWx1ZTtcbiAgICB0aGlzLl9zZXRUaGVtZUNsYXNzZXModGhpcy5fY2xhc3NMaXN0KTtcbiAgfVxuICAvKiogQGRvY3MtcHJpdmF0ZSB0aGVtZSBjb2xvciBvZiB0aGUgcGFuZWwgKi9cbiAgcHJpdmF0ZSBfY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvLyBUaGUgQFZpZXdDaGlsZCBxdWVyeSBmb3IgVGVtcGxhdGVSZWYgaGVyZSBuZWVkcyB0byBiZSBzdGF0aWMgYmVjYXVzZSBzb21lIGNvZGUgcGF0aHNcbiAgLy8gbGVhZCB0byB0aGUgb3ZlcmxheSBiZWluZyBjcmVhdGVkIGJlZm9yZSBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyBmaW5pc2hlZCBmb3IgdGhpcyBjb21wb25lbnQuXG4gIC8vIE5vdGFibHksIGFub3RoZXIgY29tcG9uZW50IG1heSB0cmlnZ2VyIGBmb2N1c2Agb24gdGhlIGF1dG9jb21wbGV0ZS10cmlnZ2VyLlxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYsIHtzdGF0aWM6IHRydWV9KSB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKiogRWxlbWVudCBmb3IgdGhlIHBhbmVsIGNvbnRhaW5pbmcgdGhlIGF1dG9jb21wbGV0ZSBvcHRpb25zLiAqL1xuICBAVmlld0NoaWxkKCdwYW5lbCcpIHBhbmVsOiBFbGVtZW50UmVmO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gYWxsIG9wdGlvbnMgd2l0aGluIHRoZSBhdXRvY29tcGxldGUuICovXG4gIGFic3RyYWN0IG9wdGlvbnM6IFF1ZXJ5TGlzdDxfTWF0T3B0aW9uQmFzZT47XG5cbiAgLyoqIFJlZmVyZW5jZSB0byBhbGwgb3B0aW9uIGdyb3VwcyB3aXRoaW4gdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgYWJzdHJhY3Qgb3B0aW9uR3JvdXBzOiBRdWVyeUxpc3Q8X01hdE9wdGdyb3VwQmFzZT47XG5cbiAgLyoqIEFyaWEgbGFiZWwgb2YgdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIElucHV0IHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSB0aGUgYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpIGFyaWFMYWJlbGxlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIEZ1bmN0aW9uIHRoYXQgbWFwcyBhbiBvcHRpb24ncyBjb250cm9sIHZhbHVlIHRvIGl0cyBkaXNwbGF5IHZhbHVlIGluIHRoZSB0cmlnZ2VyLiAqL1xuICBASW5wdXQoKSBkaXNwbGF5V2l0aDogKCh2YWx1ZTogYW55KSA9PiBzdHJpbmcpIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGZpcnN0IG9wdGlvbiBzaG91bGQgYmUgaGlnaGxpZ2h0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW5lZC5cbiAgICogQ2FuIGJlIGNvbmZpZ3VyZWQgZ2xvYmFsbHkgdGhyb3VnaCB0aGUgYE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TYCB0b2tlbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBhdXRvQWN0aXZlRmlyc3RPcHRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2F1dG9BY3RpdmVGaXJzdE9wdGlvbjtcbiAgfVxuICBzZXQgYXV0b0FjdGl2ZUZpcnN0T3B0aW9uKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9hdXRvQWN0aXZlRmlyc3RPcHRpb24gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2F1dG9BY3RpdmVGaXJzdE9wdGlvbjogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgYWN0aXZlIG9wdGlvbiBzaG91bGQgYmUgc2VsZWN0ZWQgYXMgdGhlIHVzZXIgaXMgbmF2aWdhdGluZy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGF1dG9TZWxlY3RBY3RpdmVPcHRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2F1dG9TZWxlY3RBY3RpdmVPcHRpb247XG4gIH1cbiAgc2V0IGF1dG9TZWxlY3RBY3RpdmVPcHRpb24odmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2F1dG9TZWxlY3RBY3RpdmVPcHRpb24gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2F1dG9TZWxlY3RBY3RpdmVPcHRpb246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIHdpZHRoIG9mIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICBDYW4gYmUgYW55IENTUyBzaXppbmcgdmFsdWUsIG90aGVyd2lzZSBpdCB3aWxsXG4gICAqIG1hdGNoIHRoZSB3aWR0aCBvZiBpdHMgaG9zdC5cbiAgICovXG4gIEBJbnB1dCgpIHBhbmVsV2lkdGg6IHN0cmluZyB8IG51bWJlcjtcblxuICAvKiogRXZlbnQgdGhhdCBpcyBlbWl0dGVkIHdoZW5ldmVyIGFuIG9wdGlvbiBmcm9tIHRoZSBsaXN0IGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3B0aW9uU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50PigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb3NlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhbiBvcHRpb24gaXMgYWN0aXZhdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3B0aW9uQWN0aXZhdGVkOiBFdmVudEVtaXR0ZXI8TWF0QXV0b2NvbXBsZXRlQWN0aXZhdGVkRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdEF1dG9jb21wbGV0ZUFjdGl2YXRlZEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBUYWtlcyBjbGFzc2VzIHNldCBvbiB0aGUgaG9zdCBtYXQtYXV0b2NvbXBsZXRlIGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlbSB0byB0aGUgcGFuZWxcbiAgICogaW5zaWRlIHRoZSBvdmVybGF5IGNvbnRhaW5lciB0byBhbGxvdyBmb3IgZWFzeSBzdHlsaW5nLlxuICAgKi9cbiAgQElucHV0KCdjbGFzcycpXG4gIHNldCBjbGFzc0xpc3QodmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgdGhpcy5fY2xhc3NMaXN0ID0gY29lcmNlU3RyaW5nQXJyYXkodmFsdWUpLnJlZHVjZSgoY2xhc3NMaXN0LCBjbGFzc05hbWUpID0+IHtcbiAgICAgICAgY2xhc3NMaXN0W2NsYXNzTmFtZV0gPSB0cnVlO1xuICAgICAgICByZXR1cm4gY2xhc3NMaXN0O1xuICAgICAgfSwge30gYXMge1trZXk6IHN0cmluZ106IGJvb2xlYW59KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY2xhc3NMaXN0ID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5fc2V0VmlzaWJpbGl0eUNsYXNzZXModGhpcy5fY2xhc3NMaXN0KTtcbiAgICB0aGlzLl9zZXRUaGVtZUNsYXNzZXModGhpcy5fY2xhc3NMaXN0KTtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NOYW1lID0gJyc7XG4gIH1cbiAgX2NsYXNzTGlzdDoge1trZXk6IHN0cmluZ106IGJvb2xlYW59ID0ge307XG5cbiAgLyoqIFVuaXF1ZSBJRCB0byBiZSB1c2VkIGJ5IGF1dG9jb21wbGV0ZSB0cmlnZ2VyJ3MgXCJhcmlhLW93bnNcIiBwcm9wZXJ0eS4gKi9cbiAgaWQ6IHN0cmluZyA9IGBtYXQtYXV0b2NvbXBsZXRlLSR7X3VuaXF1ZUF1dG9jb21wbGV0ZUlkQ291bnRlcisrfWA7XG5cbiAgLyoqXG4gICAqIFRlbGxzIGFueSBkZXNjZW5kYW50IGBtYXQtb3B0Z3JvdXBgIHRvIHVzZSB0aGUgaW5lcnQgYTExeSBwYXR0ZXJuLlxuICAgKiBAZG9jcy1wcml2YXRlXG4gICAqL1xuICByZWFkb25seSBpbmVydEdyb3VwczogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgQEluamVjdChNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OUykgcHJvdGVjdGVkIF9kZWZhdWx0czogTWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnMsXG4gICAgcGxhdGZvcm0/OiBQbGF0Zm9ybSxcbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGUgcHJvYmxlbSB0aGF0IHRoZSBgaW5lcnRHcm91cHNgIG9wdGlvbiByZXNvbHZlcyBpcyBvbmx5IHByZXNlbnQgb25cbiAgICAvLyBTYWZhcmkgdXNpbmcgVm9pY2VPdmVyLiBXZSBzaG91bGQgb2NjYXNpb25hbGx5IGNoZWNrIGJhY2sgdG8gc2VlIHdoZXRoZXIgdGhlIGJ1Z1xuICAgIC8vIHdhc24ndCByZXNvbHZlZCBpbiBWb2ljZU92ZXIsIGFuZCBpZiBpdCBoYXMsIHdlIGNhbiByZW1vdmUgdGhpcyBhbmQgdGhlIGBpbmVydEdyb3Vwc2BcbiAgICAvLyBvcHRpb24gYWx0b2dldGhlci5cbiAgICB0aGlzLmluZXJ0R3JvdXBzID0gcGxhdGZvcm0/LlNBRkFSSSB8fCBmYWxzZTtcbiAgICB0aGlzLl9hdXRvQWN0aXZlRmlyc3RPcHRpb24gPSAhIV9kZWZhdWx0cy5hdXRvQWN0aXZlRmlyc3RPcHRpb247XG4gICAgdGhpcy5fYXV0b1NlbGVjdEFjdGl2ZU9wdGlvbiA9ICEhX2RlZmF1bHRzLmF1dG9TZWxlY3RBY3RpdmVPcHRpb247XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlciA9IG5ldyBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcjxfTWF0T3B0aW9uQmFzZT4odGhpcy5vcHRpb25zKVxuICAgICAgLndpdGhXcmFwKClcbiAgICAgIC5za2lwUHJlZGljYXRlKHRoaXMuX3NraXBQcmVkaWNhdGUpO1xuICAgIHRoaXMuX2FjdGl2ZU9wdGlvbkNoYW5nZXMgPSB0aGlzLl9rZXlNYW5hZ2VyLmNoYW5nZS5zdWJzY3JpYmUoaW5kZXggPT4ge1xuICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICAgIHRoaXMub3B0aW9uQWN0aXZhdGVkLmVtaXQoe3NvdXJjZTogdGhpcywgb3B0aW9uOiB0aGlzLm9wdGlvbnMudG9BcnJheSgpW2luZGV4XSB8fCBudWxsfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBTZXQgdGhlIGluaXRpYWwgdmlzaWJpbGl0eSBzdGF0ZS5cbiAgICB0aGlzLl9zZXRWaXNpYmlsaXR5KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyPy5kZXN0cm95KCk7XG4gICAgdGhpcy5fYWN0aXZlT3B0aW9uQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHBhbmVsIHNjcm9sbFRvcC4gVGhpcyBhbGxvd3MgdXMgdG8gbWFudWFsbHkgc2Nyb2xsIHRvIGRpc3BsYXkgb3B0aW9uc1xuICAgKiBhYm92ZSBvciBiZWxvdyB0aGUgZm9sZCwgYXMgdGhleSBhcmUgbm90IGFjdHVhbGx5IGJlaW5nIGZvY3VzZWQgd2hlbiBhY3RpdmUuXG4gICAqL1xuICBfc2V0U2Nyb2xsVG9wKHNjcm9sbFRvcDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgfVxuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIHBhbmVsJ3Mgc2Nyb2xsVG9wLiAqL1xuICBfZ2V0U2Nyb2xsVG9wKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMucGFuZWwgPyB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wIDogMDtcbiAgfVxuXG4gIC8qKiBQYW5lbCBzaG91bGQgaGlkZSBpdHNlbGYgd2hlbiB0aGUgb3B0aW9uIGxpc3QgaXMgZW1wdHkuICovXG4gIF9zZXRWaXNpYmlsaXR5KCkge1xuICAgIHRoaXMuc2hvd1BhbmVsID0gISF0aGlzLm9wdGlvbnMubGVuZ3RoO1xuICAgIHRoaXMuX3NldFZpc2liaWxpdHlDbGFzc2VzKHRoaXMuX2NsYXNzTGlzdCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKiogRW1pdHMgdGhlIGBzZWxlY3RgIGV2ZW50LiAqL1xuICBfZW1pdFNlbGVjdEV2ZW50KG9wdGlvbjogX01hdE9wdGlvbkJhc2UpOiB2b2lkIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50KHRoaXMsIG9wdGlvbik7XG4gICAgdGhpcy5vcHRpb25TZWxlY3RlZC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcmlhLWxhYmVsbGVkYnkgZm9yIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIF9nZXRQYW5lbEFyaWFMYWJlbGxlZGJ5KGxhYmVsSWQ6IHN0cmluZyB8IG51bGwpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5hcmlhTGFiZWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGxhYmVsRXhwcmVzc2lvbiA9IGxhYmVsSWQgPyBsYWJlbElkICsgJyAnIDogJyc7XG4gICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsbGVkYnkgPyBsYWJlbEV4cHJlc3Npb24gKyB0aGlzLmFyaWFMYWJlbGxlZGJ5IDogbGFiZWxJZDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBhdXRvY29tcGxldGUgdmlzaWJpbGl0eSBjbGFzc2VzIG9uIGEgY2xhc3NsaXN0IGJhc2VkIG9uIHRoZSBwYW5lbCBpcyB2aXNpYmxlLiAqL1xuICBwcml2YXRlIF9zZXRWaXNpYmlsaXR5Q2xhc3NlcyhjbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSkge1xuICAgIGNsYXNzTGlzdFt0aGlzLl92aXNpYmxlQ2xhc3NdID0gdGhpcy5zaG93UGFuZWw7XG4gICAgY2xhc3NMaXN0W3RoaXMuX2hpZGRlbkNsYXNzXSA9ICF0aGlzLnNob3dQYW5lbDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSB0aGVtaW5nIGNsYXNzZXMgb24gYSBjbGFzc2xpc3QgYmFzZWQgb24gdGhlIHRoZW1lIG9mIHRoZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfc2V0VGhlbWVDbGFzc2VzKGNsYXNzTGlzdDoge1trZXk6IHN0cmluZ106IGJvb2xlYW59KSB7XG4gICAgY2xhc3NMaXN0WydtYXQtcHJpbWFyeSddID0gdGhpcy5fY29sb3IgPT09ICdwcmltYXJ5JztcbiAgICBjbGFzc0xpc3RbJ21hdC13YXJuJ10gPSB0aGlzLl9jb2xvciA9PT0gJ3dhcm4nO1xuICAgIGNsYXNzTGlzdFsnbWF0LWFjY2VudCddID0gdGhpcy5fY29sb3IgPT09ICdhY2NlbnQnO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9za2lwUHJlZGljYXRlKG9wdGlvbjogX01hdE9wdGlvbkJhc2UpIHtcbiAgICByZXR1cm4gb3B0aW9uLmRpc2FibGVkO1xuICB9XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1hdXRvY29tcGxldGUnLFxuICB0ZW1wbGF0ZVVybDogJ2F1dG9jb21wbGV0ZS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ2F1dG9jb21wbGV0ZS5jc3MnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGV4cG9ydEFzOiAnbWF0QXV0b2NvbXBsZXRlJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVSaXBwbGUnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtbWRjLWF1dG9jb21wbGV0ZScsXG4gICAgJ25nU2tpcEh5ZHJhdGlvbic6ICcnLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULCB1c2VFeGlzdGluZzogTWF0QXV0b2NvbXBsZXRlfV0sXG4gIGFuaW1hdGlvbnM6IFtwYW5lbEFuaW1hdGlvbl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZSBleHRlbmRzIF9NYXRBdXRvY29tcGxldGVCYXNlIHtcbiAgLyoqIFJlZmVyZW5jZSB0byBhbGwgb3B0aW9uIGdyb3VwcyB3aXRoaW4gdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfT1BUR1JPVVAsIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbkdyb3VwczogUXVlcnlMaXN0PE1hdE9wdGdyb3VwPjtcbiAgLyoqIFJlZmVyZW5jZSB0byBhbGwgb3B0aW9ucyB3aXRoaW4gdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRPcHRpb24sIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbnM6IFF1ZXJ5TGlzdDxNYXRPcHRpb24+O1xuICBwcm90ZWN0ZWQgX3Zpc2libGVDbGFzcyA9ICdtYXQtbWRjLWF1dG9jb21wbGV0ZS12aXNpYmxlJztcbiAgcHJvdGVjdGVkIF9oaWRkZW5DbGFzcyA9ICdtYXQtbWRjLWF1dG9jb21wbGV0ZS1oaWRkZW4nO1xuXG4gIC8qKiBXaGV0aGVyIGNoZWNrbWFyayBpbmRpY2F0b3IgZm9yIHNpbmdsZS1zZWxlY3Rpb24gb3B0aW9ucyBpcyBoaWRkZW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9oaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yO1xuICB9XG4gIHNldCBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9oaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLl9zeW5jUGFyZW50UHJvcGVydGllcygpO1xuICB9XG4gIHByaXZhdGUgX2hpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3I6IGJvb2xlYW4gPVxuICAgIHRoaXMuX2RlZmF1bHRzLmhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IgPz8gZmFsc2U7XG5cbiAgLyoqIFN5bmNzIHRoZSBwYXJlbnQgc3RhdGUgd2l0aCB0aGUgaW5kaXZpZHVhbCBvcHRpb25zLiAqL1xuICBfc3luY1BhcmVudFByb3BlcnRpZXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgZm9yIChjb25zdCBvcHRpb24gb2YgdGhpcy5vcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbi5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gYHNraXBQcmVkaWNhdGVgIGRldGVybWluZXMgaWYga2V5IG1hbmFnZXIgc2hvdWxkIGF2b2lkIHB1dHRpbmcgYSBnaXZlbiBvcHRpb24gaW4gdGhlIHRhYlxuICAvLyBvcmRlci4gQWxsb3cgZGlzYWJsZWQgbGlzdCBpdGVtcyB0byByZWNlaXZlIGZvY3VzIHZpYSBrZXlib2FyZCB0byBhbGlnbiB3aXRoIFdBSSBBUklBXG4gIC8vIHJlY29tbWVuZGF0aW9uLlxuICAvL1xuICAvLyBOb3JtYWxseSBXQUkgQVJJQSdzIGluc3RydWN0aW9ucyBhcmUgdG8gZXhjbHVkZSBkaXNhYmxlZCBpdGVtcyBmcm9tIHRoZSB0YWIgb3JkZXIsIGJ1dCBpdFxuICAvLyBtYWtlcyBhIGZldyBleGNlcHRpb25zIGZvciBjb21wb3VuZCB3aWRnZXRzLlxuICAvL1xuICAvLyBGcm9tIFtEZXZlbG9waW5nIGEgS2V5Ym9hcmQgSW50ZXJmYWNlXShcbiAgLy8gaHR0cHM6Ly93d3cudzMub3JnL1dBSS9BUklBL2FwZy9wcmFjdGljZXMva2V5Ym9hcmQtaW50ZXJmYWNlLyk6XG4gIC8vICAgXCJGb3IgdGhlIGZvbGxvd2luZyBjb21wb3NpdGUgd2lkZ2V0IGVsZW1lbnRzLCBrZWVwIHRoZW0gZm9jdXNhYmxlIHdoZW4gZGlzYWJsZWQ6IE9wdGlvbnMgaW4gYVxuICAvLyAgIExpc3Rib3guLi5cIlxuICAvL1xuICAvLyBUaGUgdXNlciBjYW4gZm9jdXMgZGlzYWJsZWQgb3B0aW9ucyB1c2luZyB0aGUga2V5Ym9hcmQsIGJ1dCB0aGUgdXNlciBjYW5ub3QgY2xpY2sgZGlzYWJsZWRcbiAgLy8gb3B0aW9ucy5cbiAgcHJvdGVjdGVkIG92ZXJyaWRlIF9za2lwUHJlZGljYXRlKF9vcHRpb246IF9NYXRPcHRpb25CYXNlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCI8bmctdGVtcGxhdGUgbGV0LWZvcm1GaWVsZElkPVwiaWRcIj5cbiAgPGRpdlxuICAgIGNsYXNzPVwibWF0LW1kYy1hdXRvY29tcGxldGUtcGFuZWwgbWRjLW1lbnUtc3VyZmFjZSBtZGMtbWVudS1zdXJmYWNlLS1vcGVuXCJcbiAgICByb2xlPVwibGlzdGJveFwiXG4gICAgW2lkXT1cImlkXCJcbiAgICBbbmdDbGFzc109XCJfY2xhc3NMaXN0XCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbCB8fCBudWxsXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiX2dldFBhbmVsQXJpYUxhYmVsbGVkYnkoZm9ybUZpZWxkSWQpXCJcbiAgICBbQHBhbmVsQW5pbWF0aW9uXT1cImlzT3BlbiA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nXCJcbiAgICAjcGFuZWw+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=
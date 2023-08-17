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
        requireSelection: false,
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
     * Whether the user is required to make a selection when they're interacting with the
     * autocomplete. If the user moves away from the autocomplete without selecting an option from
     * the list, the value will be reset. If the user opens the panel and closes it without
     * interacting or selecting a value, the initial value will be kept.
     */
    get requireSelection() {
        return this._requireSelection;
    }
    set requireSelection(value) {
        this._requireSelection = coerceBooleanProperty(value);
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
        this._requireSelection = !!_defaults.requireSelection;
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
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.1", type: _MatAutocompleteBase, inputs: { ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], displayWith: "displayWith", autoActiveFirstOption: "autoActiveFirstOption", autoSelectActiveOption: "autoSelectActiveOption", requireSelection: "requireSelection", panelWidth: "panelWidth", classList: ["class", "classList"] }, outputs: { optionSelected: "optionSelected", opened: "opened", closed: "closed", optionActivated: "optionActivated" }, viewQueries: [{ propertyName: "template", first: true, predicate: TemplateRef, descendants: true, static: true }, { propertyName: "panel", first: true, predicate: ["panel"], descendants: true }], usesInheritance: true, ngImport: i0 }); }
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
            }], requireSelection: [{
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
        this._animationDone = new EventEmitter();
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
    ngOnDestroy() {
        super.ngOnDestroy();
        this._animationDone.complete();
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
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatAutocomplete, selector: "mat-autocomplete", inputs: { disableRipple: "disableRipple", hideSingleSelectionIndicator: "hideSingleSelectionIndicator" }, host: { attributes: { "ngSkipHydration": "" }, classAttribute: "mat-mdc-autocomplete" }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], queries: [{ propertyName: "optionGroups", predicate: MAT_OPTGROUP, descendants: true }, { propertyName: "options", predicate: MatOption, descendants: true }], exportAs: ["matAutocomplete"], usesInheritance: true, ngImport: i0, template: "<ng-template let-formFieldId=\"id\">\n  <div\n    class=\"mat-mdc-autocomplete-panel mdc-menu-surface mdc-menu-surface--open\"\n    role=\"listbox\"\n    [id]=\"id\"\n    [ngClass]=\"_classList\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n    [@panelAnimation]=\"isOpen ? 'visible' : 'hidden'\"\n    (@panelAnimation.done)=\"_animationDone.next($event)\"\n    #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: ["div.mat-mdc-autocomplete-panel{box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);width:100%;max-height:256px;visibility:hidden;transform-origin:center top;overflow:auto;padding:8px 0;border-radius:4px;box-sizing:border-box;position:static;background-color:var(--mat-autocomplete-background-color)}.cdk-high-contrast-active div.mat-mdc-autocomplete-panel{outline:solid 1px}.cdk-overlay-pane:not(.mat-mdc-autocomplete-panel-above) div.mat-mdc-autocomplete-panel{border-top-left-radius:0;border-top-right-radius:0}.mat-mdc-autocomplete-panel-above div.mat-mdc-autocomplete-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;transform-origin:center bottom}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-visible{visibility:visible}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-hidden{visibility:hidden}mat-autocomplete{display:none}"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], animations: [panelAnimation], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatAutocomplete, decorators: [{
            type: Component,
            args: [{ selector: 'mat-autocomplete', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, exportAs: 'matAutocomplete', inputs: ['disableRipple'], host: {
                        'class': 'mat-mdc-autocomplete',
                        'ngSkipHydration': '',
                    }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], animations: [panelAnimation], template: "<ng-template let-formFieldId=\"id\">\n  <div\n    class=\"mat-mdc-autocomplete-panel mdc-menu-surface mdc-menu-surface--open\"\n    role=\"listbox\"\n    [id]=\"id\"\n    [ngClass]=\"_classList\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n    [@panelAnimation]=\"isOpen ? 'visible' : 'hidden'\"\n    (@panelAnimation.done)=\"_animationDone.next($event)\"\n    #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: ["div.mat-mdc-autocomplete-panel{box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);width:100%;max-height:256px;visibility:hidden;transform-origin:center top;overflow:auto;padding:8px 0;border-radius:4px;box-sizing:border-box;position:static;background-color:var(--mat-autocomplete-background-color)}.cdk-high-contrast-active div.mat-mdc-autocomplete-panel{outline:solid 1px}.cdk-overlay-pane:not(.mat-mdc-autocomplete-panel-above) div.mat-mdc-autocomplete-panel{border-top-left-radius:0;border-top-right-radius:0}.mat-mdc-autocomplete-panel-above div.mat-mdc-autocomplete-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;transform-origin:center bottom}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-visible{visibility:visible}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-hidden{visibility:hidden}mat-autocomplete{display:none}"] }]
        }], propDecorators: { optionGroups: [{
                type: ContentChildren,
                args: [MAT_OPTGROUP, { descendants: true }]
            }], options: [{
                type: ContentChildren,
                args: [MatOption, { descendants: true }]
            }], hideSingleSelectionIndicator: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLGNBQWMsRUFDZCxLQUFLLEVBRUwsTUFBTSxFQUNOLFNBQVMsRUFDVCxXQUFXLEVBQ1gsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsWUFBWSxFQUNaLDJCQUEyQixFQUUzQixTQUFTLEVBQ1Qsa0JBQWtCLEdBS25CLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFDLDBCQUEwQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDN0QsT0FBTyxFQUFlLHFCQUFxQixFQUFFLGlCQUFpQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDN0YsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDNUMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLE1BQU0sQ0FBQzs7OztBQUVsQzs7O0dBR0c7QUFDSCxJQUFJLDRCQUE0QixHQUFHLENBQUMsQ0FBQztBQUVyQyw0RUFBNEU7QUFDNUUsTUFBTSxPQUFPLDRCQUE0QjtJQUN2QztJQUNFLGtFQUFrRTtJQUMzRCxNQUE0QjtJQUNuQyxnQ0FBZ0M7SUFDekIsTUFBc0I7UUFGdEIsV0FBTSxHQUFOLE1BQU0sQ0FBc0I7UUFFNUIsV0FB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RUFBQyxDQUFDLGNBQ3JFLENBQUMsY0FBYyxDQUFDOzhCQUl3QixZQUFZO3NCQUEvRCxlQUFlO3VCQUFDLFlBQVksRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUM7Z0JBRUQsT0FBTztzQkFBdkQsZUFBZTt1QkFBQyxTQUFTLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQU8zQyw0QkFBNEI7c0JBRC9CLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIE1BVF9PUFRHUk9VUCxcbiAgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULFxuICBNYXRPcHRncm91cCxcbiAgTWF0T3B0aW9uLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIF9NYXRPcHRpb25CYXNlLFxuICBfTWF0T3B0Z3JvdXBCYXNlLFxuICBUaGVtZVBhbGV0dGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgY29lcmNlU3RyaW5nQXJyYXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtwYW5lbEFuaW1hdGlvbn0gZnJvbSAnLi9hbmltYXRpb25zJztcbmltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcblxuLyoqXG4gKiBBdXRvY29tcGxldGUgSURzIG5lZWQgdG8gYmUgdW5pcXVlIGFjcm9zcyBjb21wb25lbnRzLCBzbyB0aGlzIGNvdW50ZXIgZXhpc3RzIG91dHNpZGUgb2ZcbiAqIHRoZSBjb21wb25lbnQgZGVmaW5pdGlvbi5cbiAqL1xubGV0IF91bmlxdWVBdXRvY29tcGxldGVJZENvdW50ZXIgPSAwO1xuXG4vKiogRXZlbnQgb2JqZWN0IHRoYXQgaXMgZW1pdHRlZCB3aGVuIGFuIGF1dG9jb21wbGV0ZSBvcHRpb24gaXMgc2VsZWN0ZWQuICovXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlU2VsZWN0ZWRFdmVudCB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IF9NYXRBdXRvY29tcGxldGVCYXNlLFxuICAgIC8qKiBPcHRpb24gdGhhdCB3YXMgc2VsZWN0ZWQuICovXG4gICAgcHVibGljIG9wdGlvbjogX01hdE9wdGlvbkJhc2UsXG4gICkge31cbn1cblxuLyoqIEV2ZW50IG9iamVjdCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiBhbiBhdXRvY29tcGxldGUgb3B0aW9uIGlzIGFjdGl2YXRlZC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0QXV0b2NvbXBsZXRlQWN0aXZhdGVkRXZlbnQge1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgdGhhdCBlbWl0dGVkIHRoZSBldmVudC4gKi9cbiAgc291cmNlOiBfTWF0QXV0b2NvbXBsZXRlQmFzZTtcblxuICAvKiogT3B0aW9uIHRoYXQgd2FzIHNlbGVjdGVkLiAqL1xuICBvcHRpb246IF9NYXRPcHRpb25CYXNlIHwgbnVsbDtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRBdXRvY29tcGxldGUuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdEF1dG9jb21wbGV0ZU1peGluQmFzZSA9IG1peGluRGlzYWJsZVJpcHBsZShjbGFzcyB7fSk7XG5cbi8qKiBEZWZhdWx0IGBtYXQtYXV0b2NvbXBsZXRlYCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEF1dG9jb21wbGV0ZURlZmF1bHRPcHRpb25zIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGZpcnN0IG9wdGlvbiBzaG91bGQgYmUgaGlnaGxpZ2h0ZWQgd2hlbiBhbiBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3BlbmVkLiAqL1xuICBhdXRvQWN0aXZlRmlyc3RPcHRpb24/OiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBhY3RpdmUgb3B0aW9uIHNob3VsZCBiZSBzZWxlY3RlZCBhcyB0aGUgdXNlciBpcyBuYXZpZ2F0aW5nLiAqL1xuICBhdXRvU2VsZWN0QWN0aXZlT3B0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdXNlciBpcyByZXF1aXJlZCB0byBtYWtlIGEgc2VsZWN0aW9uIHdoZW5cbiAgICogdGhleSdyZSBpbnRlcmFjdGluZyB3aXRoIHRoZSBhdXRvY29tcGxldGUuXG4gICAqL1xuICByZXF1aXJlU2VsZWN0aW9uPzogYm9vbGVhbjtcblxuICAvKiogQ2xhc3Mgb3IgbGlzdCBvZiBjbGFzc2VzIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGF1dG9jb21wbGV0ZSdzIG92ZXJsYXkgcGFuZWwuICovXG4gIG92ZXJsYXlQYW5lbENsYXNzPzogc3RyaW5nIHwgc3RyaW5nW107XG5cbiAgLyoqIFdoZXRlciBpY29uIGluZGljYXRvcnMgc2hvdWxkIGJlIGhpZGRlbiBmb3Igc2luZ2xlLXNlbGVjdGlvbi4gKi9cbiAgaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvcj86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdG8gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciBgbWF0LWF1dG9jb21wbGV0ZWAuICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnM+KFxuICAnbWF0LWF1dG9jb21wbGV0ZS1kZWZhdWx0LW9wdGlvbnMnLFxuICB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6IE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlksXG4gIH0sXG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnMge1xuICByZXR1cm4ge1xuICAgIGF1dG9BY3RpdmVGaXJzdE9wdGlvbjogZmFsc2UsXG4gICAgYXV0b1NlbGVjdEFjdGl2ZU9wdGlvbjogZmFsc2UsXG4gICAgaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvcjogZmFsc2UsXG4gICAgcmVxdWlyZVNlbGVjdGlvbjogZmFsc2UsXG4gIH07XG59XG5cbi8qKiBCYXNlIGNsYXNzIHdpdGggYWxsIG9mIHRoZSBgTWF0QXV0b2NvbXBsZXRlYCBmdW5jdGlvbmFsaXR5LiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdEF1dG9jb21wbGV0ZUJhc2VcbiAgZXh0ZW5kcyBfTWF0QXV0b2NvbXBsZXRlTWl4aW5CYXNlXG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQ2FuRGlzYWJsZVJpcHBsZSwgT25EZXN0cm95XG57XG4gIHByaXZhdGUgX2FjdGl2ZU9wdGlvbkNoYW5nZXMgPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIENsYXNzIHRvIGFwcGx5IHRvIHRoZSBwYW5lbCB3aGVuIGl0J3MgdmlzaWJsZS4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF92aXNpYmxlQ2xhc3M6IHN0cmluZztcblxuICAvKiogQ2xhc3MgdG8gYXBwbHkgdG8gdGhlIHBhbmVsIHdoZW4gaXQncyBoaWRkZW4uICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfaGlkZGVuQ2xhc3M6IHN0cmluZztcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgcGFuZWwgYW5pbWF0aW9uIGlzIGRvbmUuIE51bGwgaWYgdGhlIHBhbmVsIGRvZXNuJ3QgYW5pbWF0ZS4gKi9cbiAgYWJzdHJhY3QgX2FuaW1hdGlvbkRvbmU6IEV2ZW50RW1pdHRlcjxBbmltYXRpb25FdmVudD4gfCBudWxsO1xuXG4gIC8qKiBNYW5hZ2VzIGFjdGl2ZSBpdGVtIGluIG9wdGlvbiBsaXN0IGJhc2VkIG9uIGtleSBldmVudHMuICovXG4gIF9rZXlNYW5hZ2VyOiBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcjxfTWF0T3B0aW9uQmFzZT47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBzaG91bGQgYmUgdmlzaWJsZSwgZGVwZW5kaW5nIG9uIG9wdGlvbiBsZW5ndGguICovXG4gIHNob3dQYW5lbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3Blbi4gKi9cbiAgZ2V0IGlzT3BlbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faXNPcGVuICYmIHRoaXMuc2hvd1BhbmVsO1xuICB9XG4gIF9pc09wZW46IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQGRvY3MtcHJpdmF0ZSBTZXRzIHRoZSB0aGVtZSBjb2xvciBvZiB0aGUgcGFuZWwuICovXG4gIF9zZXRDb2xvcih2YWx1ZTogVGhlbWVQYWxldHRlKSB7XG4gICAgdGhpcy5fY29sb3IgPSB2YWx1ZTtcbiAgICB0aGlzLl9zZXRUaGVtZUNsYXNzZXModGhpcy5fY2xhc3NMaXN0KTtcbiAgfVxuICAvKiogQGRvY3MtcHJpdmF0ZSB0aGVtZSBjb2xvciBvZiB0aGUgcGFuZWwgKi9cbiAgcHJpdmF0ZSBfY29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvLyBUaGUgQFZpZXdDaGlsZCBxdWVyeSBmb3IgVGVtcGxhdGVSZWYgaGVyZSBuZWVkcyB0byBiZSBzdGF0aWMgYmVjYXVzZSBzb21lIGNvZGUgcGF0aHNcbiAgLy8gbGVhZCB0byB0aGUgb3ZlcmxheSBiZWluZyBjcmVhdGVkIGJlZm9yZSBjaGFuZ2UgZGV0ZWN0aW9uIGhhcyBmaW5pc2hlZCBmb3IgdGhpcyBjb21wb25lbnQuXG4gIC8vIE5vdGFibHksIGFub3RoZXIgY29tcG9uZW50IG1heSB0cmlnZ2VyIGBmb2N1c2Agb24gdGhlIGF1dG9jb21wbGV0ZS10cmlnZ2VyLlxuXG4gIC8qKiBAZG9jcy1wcml2YXRlICovXG4gIEBWaWV3Q2hpbGQoVGVtcGxhdGVSZWYsIHtzdGF0aWM6IHRydWV9KSB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKiogRWxlbWVudCBmb3IgdGhlIHBhbmVsIGNvbnRhaW5pbmcgdGhlIGF1dG9jb21wbGV0ZSBvcHRpb25zLiAqL1xuICBAVmlld0NoaWxkKCdwYW5lbCcpIHBhbmVsOiBFbGVtZW50UmVmO1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gYWxsIG9wdGlvbnMgd2l0aGluIHRoZSBhdXRvY29tcGxldGUuICovXG4gIGFic3RyYWN0IG9wdGlvbnM6IFF1ZXJ5TGlzdDxfTWF0T3B0aW9uQmFzZT47XG5cbiAgLyoqIFJlZmVyZW5jZSB0byBhbGwgb3B0aW9uIGdyb3VwcyB3aXRoaW4gdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgYWJzdHJhY3Qgb3B0aW9uR3JvdXBzOiBRdWVyeUxpc3Q8X01hdE9wdGdyb3VwQmFzZT47XG5cbiAgLyoqIEFyaWEgbGFiZWwgb2YgdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIElucHV0IHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSB0aGUgYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpIGFyaWFMYWJlbGxlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIEZ1bmN0aW9uIHRoYXQgbWFwcyBhbiBvcHRpb24ncyBjb250cm9sIHZhbHVlIHRvIGl0cyBkaXNwbGF5IHZhbHVlIGluIHRoZSB0cmlnZ2VyLiAqL1xuICBASW5wdXQoKSBkaXNwbGF5V2l0aDogKCh2YWx1ZTogYW55KSA9PiBzdHJpbmcpIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGZpcnN0IG9wdGlvbiBzaG91bGQgYmUgaGlnaGxpZ2h0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW5lZC5cbiAgICogQ2FuIGJlIGNvbmZpZ3VyZWQgZ2xvYmFsbHkgdGhyb3VnaCB0aGUgYE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TYCB0b2tlbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBhdXRvQWN0aXZlRmlyc3RPcHRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2F1dG9BY3RpdmVGaXJzdE9wdGlvbjtcbiAgfVxuICBzZXQgYXV0b0FjdGl2ZUZpcnN0T3B0aW9uKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9hdXRvQWN0aXZlRmlyc3RPcHRpb24gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2F1dG9BY3RpdmVGaXJzdE9wdGlvbjogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgYWN0aXZlIG9wdGlvbiBzaG91bGQgYmUgc2VsZWN0ZWQgYXMgdGhlIHVzZXIgaXMgbmF2aWdhdGluZy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGF1dG9TZWxlY3RBY3RpdmVPcHRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2F1dG9TZWxlY3RBY3RpdmVPcHRpb247XG4gIH1cbiAgc2V0IGF1dG9TZWxlY3RBY3RpdmVPcHRpb24odmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2F1dG9TZWxlY3RBY3RpdmVPcHRpb24gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2F1dG9TZWxlY3RBY3RpdmVPcHRpb246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHVzZXIgaXMgcmVxdWlyZWQgdG8gbWFrZSBhIHNlbGVjdGlvbiB3aGVuIHRoZXkncmUgaW50ZXJhY3Rpbmcgd2l0aCB0aGVcbiAgICogYXV0b2NvbXBsZXRlLiBJZiB0aGUgdXNlciBtb3ZlcyBhd2F5IGZyb20gdGhlIGF1dG9jb21wbGV0ZSB3aXRob3V0IHNlbGVjdGluZyBhbiBvcHRpb24gZnJvbVxuICAgKiB0aGUgbGlzdCwgdGhlIHZhbHVlIHdpbGwgYmUgcmVzZXQuIElmIHRoZSB1c2VyIG9wZW5zIHRoZSBwYW5lbCBhbmQgY2xvc2VzIGl0IHdpdGhvdXRcbiAgICogaW50ZXJhY3Rpbmcgb3Igc2VsZWN0aW5nIGEgdmFsdWUsIHRoZSBpbml0aWFsIHZhbHVlIHdpbGwgYmUga2VwdC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCByZXF1aXJlU2VsZWN0aW9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9yZXF1aXJlU2VsZWN0aW9uO1xuICB9XG4gIHNldCByZXF1aXJlU2VsZWN0aW9uKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9yZXF1aXJlU2VsZWN0aW9uID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9yZXF1aXJlU2VsZWN0aW9uOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IHRoZSB3aWR0aCBvZiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAgQ2FuIGJlIGFueSBDU1Mgc2l6aW5nIHZhbHVlLCBvdGhlcndpc2UgaXQgd2lsbFxuICAgKiBtYXRjaCB0aGUgd2lkdGggb2YgaXRzIGhvc3QuXG4gICAqL1xuICBASW5wdXQoKSBwYW5lbFdpZHRoOiBzdHJpbmcgfCBudW1iZXI7XG5cbiAgLyoqIEV2ZW50IHRoYXQgaXMgZW1pdHRlZCB3aGVuZXZlciBhbiBvcHRpb24gZnJvbSB0aGUgbGlzdCBpcyBzZWxlY3RlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wdGlvblNlbGVjdGVkOiBFdmVudEVtaXR0ZXI8TWF0QXV0b2NvbXBsZXRlU2VsZWN0ZWRFdmVudD4gPVxuICAgIG5ldyBFdmVudEVtaXR0ZXI8TWF0QXV0b2NvbXBsZXRlU2VsZWN0ZWRFdmVudD4oKTtcblxuICAvKiogRXZlbnQgdGhhdCBpcyBlbWl0dGVkIHdoZW4gdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBvcGVuZWQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogRXZlbnQgdGhhdCBpcyBlbWl0dGVkIHdoZW4gdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBjbG9zZWQuICovXG4gIEBPdXRwdXQoKSByZWFkb25seSBjbG9zZWQ6IEV2ZW50RW1pdHRlcjx2b2lkPiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKiogRW1pdHMgd2hlbmV2ZXIgYW4gb3B0aW9uIGlzIGFjdGl2YXRlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wdGlvbkFjdGl2YXRlZDogRXZlbnRFbWl0dGVyPE1hdEF1dG9jb21wbGV0ZUFjdGl2YXRlZEV2ZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVBY3RpdmF0ZWRFdmVudD4oKTtcblxuICAvKipcbiAgICogVGFrZXMgY2xhc3NlcyBzZXQgb24gdGhlIGhvc3QgbWF0LWF1dG9jb21wbGV0ZSBlbGVtZW50IGFuZCBhcHBsaWVzIHRoZW0gdG8gdGhlIHBhbmVsXG4gICAqIGluc2lkZSB0aGUgb3ZlcmxheSBjb250YWluZXIgdG8gYWxsb3cgZm9yIGVhc3kgc3R5bGluZy5cbiAgICovXG4gIEBJbnB1dCgnY2xhc3MnKVxuICBzZXQgY2xhc3NMaXN0KHZhbHVlOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2NsYXNzTGlzdCA9IGNvZXJjZVN0cmluZ0FycmF5KHZhbHVlKS5yZWR1Y2UoKGNsYXNzTGlzdCwgY2xhc3NOYW1lKSA9PiB7XG4gICAgICAgIGNsYXNzTGlzdFtjbGFzc05hbWVdID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGNsYXNzTGlzdDtcbiAgICAgIH0sIHt9IGFzIHtba2V5OiBzdHJpbmddOiBib29sZWFufSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NsYXNzTGlzdCA9IHt9O1xuICAgIH1cblxuICAgIHRoaXMuX3NldFZpc2liaWxpdHlDbGFzc2VzKHRoaXMuX2NsYXNzTGlzdCk7XG4gICAgdGhpcy5fc2V0VGhlbWVDbGFzc2VzKHRoaXMuX2NsYXNzTGlzdCk7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTmFtZSA9ICcnO1xuICB9XG4gIF9jbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuXG4gIC8qKiBVbmlxdWUgSUQgdG8gYmUgdXNlZCBieSBhdXRvY29tcGxldGUgdHJpZ2dlcidzIFwiYXJpYS1vd25zXCIgcHJvcGVydHkuICovXG4gIGlkOiBzdHJpbmcgPSBgbWF0LWF1dG9jb21wbGV0ZS0ke191bmlxdWVBdXRvY29tcGxldGVJZENvdW50ZXIrK31gO1xuXG4gIC8qKlxuICAgKiBUZWxscyBhbnkgZGVzY2VuZGFudCBgbWF0LW9wdGdyb3VwYCB0byB1c2UgdGhlIGluZXJ0IGExMXkgcGF0dGVybi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5lcnRHcm91cHM6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlMpIHByb3RlY3RlZCBfZGVmYXVsdHM6IE1hdEF1dG9jb21wbGV0ZURlZmF1bHRPcHRpb25zLFxuICAgIHBsYXRmb3JtPzogUGxhdGZvcm0sXG4gICkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvLyBUT0RPKGNyaXNiZXRvKTogdGhlIHByb2JsZW0gdGhhdCB0aGUgYGluZXJ0R3JvdXBzYCBvcHRpb24gcmVzb2x2ZXMgaXMgb25seSBwcmVzZW50IG9uXG4gICAgLy8gU2FmYXJpIHVzaW5nIFZvaWNlT3Zlci4gV2Ugc2hvdWxkIG9jY2FzaW9uYWxseSBjaGVjayBiYWNrIHRvIHNlZSB3aGV0aGVyIHRoZSBidWdcbiAgICAvLyB3YXNuJ3QgcmVzb2x2ZWQgaW4gVm9pY2VPdmVyLCBhbmQgaWYgaXQgaGFzLCB3ZSBjYW4gcmVtb3ZlIHRoaXMgYW5kIHRoZSBgaW5lcnRHcm91cHNgXG4gICAgLy8gb3B0aW9uIGFsdG9nZXRoZXIuXG4gICAgdGhpcy5pbmVydEdyb3VwcyA9IHBsYXRmb3JtPy5TQUZBUkkgfHwgZmFsc2U7XG4gICAgdGhpcy5fYXV0b0FjdGl2ZUZpcnN0T3B0aW9uID0gISFfZGVmYXVsdHMuYXV0b0FjdGl2ZUZpcnN0T3B0aW9uO1xuICAgIHRoaXMuX2F1dG9TZWxlY3RBY3RpdmVPcHRpb24gPSAhIV9kZWZhdWx0cy5hdXRvU2VsZWN0QWN0aXZlT3B0aW9uO1xuICAgIHRoaXMuX3JlcXVpcmVTZWxlY3Rpb24gPSAhIV9kZWZhdWx0cy5yZXF1aXJlU2VsZWN0aW9uO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8X01hdE9wdGlvbkJhc2U+KHRoaXMub3B0aW9ucylcbiAgICAgIC53aXRoV3JhcCgpXG4gICAgICAuc2tpcFByZWRpY2F0ZSh0aGlzLl9za2lwUHJlZGljYXRlKTtcbiAgICB0aGlzLl9hY3RpdmVPcHRpb25DaGFuZ2VzID0gdGhpcy5fa2V5TWFuYWdlci5jaGFuZ2Uuc3Vic2NyaWJlKGluZGV4ID0+IHtcbiAgICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgICB0aGlzLm9wdGlvbkFjdGl2YXRlZC5lbWl0KHtzb3VyY2U6IHRoaXMsIG9wdGlvbjogdGhpcy5vcHRpb25zLnRvQXJyYXkoKVtpbmRleF0gfHwgbnVsbH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2V0IHRoZSBpbml0aWFsIHZpc2liaWxpdHkgc3RhdGUuXG4gICAgdGhpcy5fc2V0VmlzaWJpbGl0eSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlcj8uZGVzdHJveSgpO1xuICAgIHRoaXMuX2FjdGl2ZU9wdGlvbkNoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwYW5lbCBzY3JvbGxUb3AuIFRoaXMgYWxsb3dzIHVzIHRvIG1hbnVhbGx5IHNjcm9sbCB0byBkaXNwbGF5IG9wdGlvbnNcbiAgICogYWJvdmUgb3IgYmVsb3cgdGhlIGZvbGQsIGFzIHRoZXkgYXJlIG5vdCBhY3R1YWxseSBiZWluZyBmb2N1c2VkIHdoZW4gYWN0aXZlLlxuICAgKi9cbiAgX3NldFNjcm9sbFRvcChzY3JvbGxUb3A6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBwYW5lbCdzIHNjcm9sbFRvcC4gKi9cbiAgX2dldFNjcm9sbFRvcCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBhbmVsID8gdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA6IDA7XG4gIH1cblxuICAvKiogUGFuZWwgc2hvdWxkIGhpZGUgaXRzZWxmIHdoZW4gdGhlIG9wdGlvbiBsaXN0IGlzIGVtcHR5LiAqL1xuICBfc2V0VmlzaWJpbGl0eSgpIHtcbiAgICB0aGlzLnNob3dQYW5lbCA9ICEhdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgICB0aGlzLl9zZXRWaXNpYmlsaXR5Q2xhc3Nlcyh0aGlzLl9jbGFzc0xpc3QpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIEVtaXRzIHRoZSBgc2VsZWN0YCBldmVudC4gKi9cbiAgX2VtaXRTZWxlY3RFdmVudChvcHRpb246IF9NYXRPcHRpb25CYXNlKTogdm9pZCB7XG4gICAgY29uc3QgZXZlbnQgPSBuZXcgTWF0QXV0b2NvbXBsZXRlU2VsZWN0ZWRFdmVudCh0aGlzLCBvcHRpb24pO1xuICAgIHRoaXMub3B0aW9uU2VsZWN0ZWQuZW1pdChldmVudCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgYXJpYS1sYWJlbGxlZGJ5IGZvciB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAqL1xuICBfZ2V0UGFuZWxBcmlhTGFiZWxsZWRieShsYWJlbElkOiBzdHJpbmcgfCBudWxsKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuYXJpYUxhYmVsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBsYWJlbEV4cHJlc3Npb24gPSBsYWJlbElkID8gbGFiZWxJZCArICcgJyA6ICcnO1xuICAgIHJldHVybiB0aGlzLmFyaWFMYWJlbGxlZGJ5ID8gbGFiZWxFeHByZXNzaW9uICsgdGhpcy5hcmlhTGFiZWxsZWRieSA6IGxhYmVsSWQ7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgYXV0b2NvbXBsZXRlIHZpc2liaWxpdHkgY2xhc3NlcyBvbiBhIGNsYXNzbGlzdCBiYXNlZCBvbiB0aGUgcGFuZWwgaXMgdmlzaWJsZS4gKi9cbiAgcHJpdmF0ZSBfc2V0VmlzaWJpbGl0eUNsYXNzZXMoY2xhc3NMaXN0OiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0pIHtcbiAgICBjbGFzc0xpc3RbdGhpcy5fdmlzaWJsZUNsYXNzXSA9IHRoaXMuc2hvd1BhbmVsO1xuICAgIGNsYXNzTGlzdFt0aGlzLl9oaWRkZW5DbGFzc10gPSAhdGhpcy5zaG93UGFuZWw7XG4gIH1cblxuICAvKiogU2V0cyB0aGUgdGhlbWluZyBjbGFzc2VzIG9uIGEgY2xhc3NsaXN0IGJhc2VkIG9uIHRoZSB0aGVtZSBvZiB0aGUgcGFuZWwuICovXG4gIHByaXZhdGUgX3NldFRoZW1lQ2xhc3NlcyhjbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSkge1xuICAgIGNsYXNzTGlzdFsnbWF0LXByaW1hcnknXSA9IHRoaXMuX2NvbG9yID09PSAncHJpbWFyeSc7XG4gICAgY2xhc3NMaXN0WydtYXQtd2FybiddID0gdGhpcy5fY29sb3IgPT09ICd3YXJuJztcbiAgICBjbGFzc0xpc3RbJ21hdC1hY2NlbnQnXSA9IHRoaXMuX2NvbG9yID09PSAnYWNjZW50JztcbiAgfVxuXG4gIHByb3RlY3RlZCBfc2tpcFByZWRpY2F0ZShvcHRpb246IF9NYXRPcHRpb25CYXNlKSB7XG4gICAgcmV0dXJuIG9wdGlvbi5kaXNhYmxlZDtcbiAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtYXV0b2NvbXBsZXRlJyxcbiAgdGVtcGxhdGVVcmw6ICdhdXRvY29tcGxldGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydhdXRvY29tcGxldGUuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBleHBvcnRBczogJ21hdEF1dG9jb21wbGV0ZScsXG4gIGlucHV0czogWydkaXNhYmxlUmlwcGxlJ10sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy1hdXRvY29tcGxldGUnLFxuICAgICduZ1NraXBIeWRyYXRpb24nOiAnJyxcbiAgfSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE1BVF9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCwgdXNlRXhpc3Rpbmc6IE1hdEF1dG9jb21wbGV0ZX1dLFxuICBhbmltYXRpb25zOiBbcGFuZWxBbmltYXRpb25dLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGUgZXh0ZW5kcyBfTWF0QXV0b2NvbXBsZXRlQmFzZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBSZWZlcmVuY2UgdG8gYWxsIG9wdGlvbiBncm91cHMgd2l0aGluIHRoZSBhdXRvY29tcGxldGUuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX09QVEdST1VQLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBvcHRpb25Hcm91cHM6IFF1ZXJ5TGlzdDxNYXRPcHRncm91cD47XG4gIC8qKiBSZWZlcmVuY2UgdG8gYWxsIG9wdGlvbnMgd2l0aGluIHRoZSBhdXRvY29tcGxldGUuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTWF0T3B0aW9uLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBvcHRpb25zOiBRdWVyeUxpc3Q8TWF0T3B0aW9uPjtcbiAgcHJvdGVjdGVkIF92aXNpYmxlQ2xhc3MgPSAnbWF0LW1kYy1hdXRvY29tcGxldGUtdmlzaWJsZSc7XG4gIHByb3RlY3RlZCBfaGlkZGVuQ2xhc3MgPSAnbWF0LW1kYy1hdXRvY29tcGxldGUtaGlkZGVuJztcbiAgb3ZlcnJpZGUgX2FuaW1hdGlvbkRvbmUgPSBuZXcgRXZlbnRFbWl0dGVyPEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBXaGV0aGVyIGNoZWNrbWFyayBpbmRpY2F0b3IgZm9yIHNpbmdsZS1zZWxlY3Rpb24gb3B0aW9ucyBpcyBoaWRkZW4uICovXG4gIEBJbnB1dCgpXG4gIGdldCBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9oaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yO1xuICB9XG4gIHNldCBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9oaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgICB0aGlzLl9zeW5jUGFyZW50UHJvcGVydGllcygpO1xuICB9XG4gIHByaXZhdGUgX2hpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3I6IGJvb2xlYW4gPVxuICAgIHRoaXMuX2RlZmF1bHRzLmhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IgPz8gZmFsc2U7XG5cbiAgLyoqIFN5bmNzIHRoZSBwYXJlbnQgc3RhdGUgd2l0aCB0aGUgaW5kaXZpZHVhbCBvcHRpb25zLiAqL1xuICBfc3luY1BhcmVudFByb3BlcnRpZXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgZm9yIChjb25zdCBvcHRpb24gb2YgdGhpcy5vcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbi5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLl9hbmltYXRpb25Eb25lLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvLyBgc2tpcFByZWRpY2F0ZWAgZGV0ZXJtaW5lcyBpZiBrZXkgbWFuYWdlciBzaG91bGQgYXZvaWQgcHV0dGluZyBhIGdpdmVuIG9wdGlvbiBpbiB0aGUgdGFiXG4gIC8vIG9yZGVyLiBBbGxvdyBkaXNhYmxlZCBsaXN0IGl0ZW1zIHRvIHJlY2VpdmUgZm9jdXMgdmlhIGtleWJvYXJkIHRvIGFsaWduIHdpdGggV0FJIEFSSUFcbiAgLy8gcmVjb21tZW5kYXRpb24uXG4gIC8vXG4gIC8vIE5vcm1hbGx5IFdBSSBBUklBJ3MgaW5zdHJ1Y3Rpb25zIGFyZSB0byBleGNsdWRlIGRpc2FibGVkIGl0ZW1zIGZyb20gdGhlIHRhYiBvcmRlciwgYnV0IGl0XG4gIC8vIG1ha2VzIGEgZmV3IGV4Y2VwdGlvbnMgZm9yIGNvbXBvdW5kIHdpZGdldHMuXG4gIC8vXG4gIC8vIEZyb20gW0RldmVsb3BpbmcgYSBLZXlib2FyZCBJbnRlcmZhY2VdKFxuICAvLyBodHRwczovL3d3dy53My5vcmcvV0FJL0FSSUEvYXBnL3ByYWN0aWNlcy9rZXlib2FyZC1pbnRlcmZhY2UvKTpcbiAgLy8gICBcIkZvciB0aGUgZm9sbG93aW5nIGNvbXBvc2l0ZSB3aWRnZXQgZWxlbWVudHMsIGtlZXAgdGhlbSBmb2N1c2FibGUgd2hlbiBkaXNhYmxlZDogT3B0aW9ucyBpbiBhXG4gIC8vICAgTGlzdGJveC4uLlwiXG4gIC8vXG4gIC8vIFRoZSB1c2VyIGNhbiBmb2N1cyBkaXNhYmxlZCBvcHRpb25zIHVzaW5nIHRoZSBrZXlib2FyZCwgYnV0IHRoZSB1c2VyIGNhbm5vdCBjbGljayBkaXNhYmxlZFxuICAvLyBvcHRpb25zLlxuICBwcm90ZWN0ZWQgb3ZlcnJpZGUgX3NraXBQcmVkaWNhdGUoX29wdGlvbjogX01hdE9wdGlvbkJhc2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiIsIjxuZy10ZW1wbGF0ZSBsZXQtZm9ybUZpZWxkSWQ9XCJpZFwiPlxuICA8ZGl2XG4gICAgY2xhc3M9XCJtYXQtbWRjLWF1dG9jb21wbGV0ZS1wYW5lbCBtZGMtbWVudS1zdXJmYWNlIG1kYy1tZW51LXN1cmZhY2UtLW9wZW5cIlxuICAgIHJvbGU9XCJsaXN0Ym94XCJcbiAgICBbaWRdPVwiaWRcIlxuICAgIFtuZ0NsYXNzXT1cIl9jbGFzc0xpc3RcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUxhYmVsIHx8IG51bGxcIlxuICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJfZ2V0UGFuZWxBcmlhTGFiZWxsZWRieShmb3JtRmllbGRJZClcIlxuICAgIFtAcGFuZWxBbmltYXRpb25dPVwiaXNPcGVuID8gJ3Zpc2libGUnIDogJ2hpZGRlbidcIlxuICAgIChAcGFuZWxBbmltYXRpb24uZG9uZSk9XCJfYW5pbWF0aW9uRG9uZS5uZXh0KCRldmVudClcIlxuICAgICNwYW5lbD5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==
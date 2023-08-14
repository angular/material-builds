/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Inject, InjectionToken, Input, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation, } from '@angular/core';
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
/** Autocomplete component. */
export class MatAutocomplete extends _MatAutocompleteMixinBase {
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
     * autocomplete. If the user moves away from the autcomplete without selecting an option from
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
    constructor(_changeDetectorRef, _elementRef, _defaults, platform) {
        super();
        this._changeDetectorRef = _changeDetectorRef;
        this._elementRef = _elementRef;
        this._defaults = _defaults;
        this._activeOptionChanges = Subscription.EMPTY;
        /** Class to apply to the panel when it's visible. */
        this._visibleClass = 'mat-mdc-autocomplete-visible';
        /** Class to apply to the panel when it's hidden. */
        this._hiddenClass = 'mat-mdc-autocomplete-hidden';
        /** Emits when the panel animation is done. Null if the panel doesn't animate. */
        this._animationDone = new EventEmitter();
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
        this._hideSingleSelectionIndicator = this._defaults.hideSingleSelectionIndicator ?? false;
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
        this._animationDone.complete();
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
    _skipPredicate() {
        return false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatAutocomplete, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS }, { token: i1.Platform }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatAutocomplete, selector: "mat-autocomplete", inputs: { disableRipple: "disableRipple", ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], displayWith: "displayWith", autoActiveFirstOption: "autoActiveFirstOption", autoSelectActiveOption: "autoSelectActiveOption", requireSelection: "requireSelection", panelWidth: "panelWidth", classList: ["class", "classList"], hideSingleSelectionIndicator: "hideSingleSelectionIndicator" }, outputs: { optionSelected: "optionSelected", opened: "opened", closed: "closed", optionActivated: "optionActivated" }, host: { attributes: { "ngSkipHydration": "" }, classAttribute: "mat-mdc-autocomplete" }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], queries: [{ propertyName: "options", predicate: MatOption, descendants: true }, { propertyName: "optionGroups", predicate: MAT_OPTGROUP, descendants: true }], viewQueries: [{ propertyName: "template", first: true, predicate: TemplateRef, descendants: true, static: true }, { propertyName: "panel", first: true, predicate: ["panel"], descendants: true }], exportAs: ["matAutocomplete"], usesInheritance: true, ngImport: i0, template: "<ng-template let-formFieldId=\"id\">\n  <div\n    class=\"mat-mdc-autocomplete-panel mdc-menu-surface mdc-menu-surface--open\"\n    role=\"listbox\"\n    [id]=\"id\"\n    [ngClass]=\"_classList\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n    [@panelAnimation]=\"isOpen ? 'visible' : 'hidden'\"\n    (@panelAnimation.done)=\"_animationDone.next($event)\"\n    #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: ["div.mat-mdc-autocomplete-panel{box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);width:100%;max-height:256px;visibility:hidden;transform-origin:center top;overflow:auto;padding:8px 0;border-radius:4px;box-sizing:border-box;position:static;background-color:var(--mat-autocomplete-background-color)}.cdk-high-contrast-active div.mat-mdc-autocomplete-panel{outline:solid 1px}.cdk-overlay-pane:not(.mat-mdc-autocomplete-panel-above) div.mat-mdc-autocomplete-panel{border-top-left-radius:0;border-top-right-radius:0}.mat-mdc-autocomplete-panel-above div.mat-mdc-autocomplete-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;transform-origin:center bottom}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-visible{visibility:visible}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-hidden{visibility:hidden}mat-autocomplete{display:none}"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], animations: [panelAnimation], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatAutocomplete, decorators: [{
            type: Component,
            args: [{ selector: 'mat-autocomplete', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, exportAs: 'matAutocomplete', inputs: ['disableRipple'], host: {
                        'class': 'mat-mdc-autocomplete',
                        'ngSkipHydration': '',
                    }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], animations: [panelAnimation], template: "<ng-template let-formFieldId=\"id\">\n  <div\n    class=\"mat-mdc-autocomplete-panel mdc-menu-surface mdc-menu-surface--open\"\n    role=\"listbox\"\n    [id]=\"id\"\n    [ngClass]=\"_classList\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n    [@panelAnimation]=\"isOpen ? 'visible' : 'hidden'\"\n    (@panelAnimation.done)=\"_animationDone.next($event)\"\n    #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: ["div.mat-mdc-autocomplete-panel{box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);width:100%;max-height:256px;visibility:hidden;transform-origin:center top;overflow:auto;padding:8px 0;border-radius:4px;box-sizing:border-box;position:static;background-color:var(--mat-autocomplete-background-color)}.cdk-high-contrast-active div.mat-mdc-autocomplete-panel{outline:solid 1px}.cdk-overlay-pane:not(.mat-mdc-autocomplete-panel-above) div.mat-mdc-autocomplete-panel{border-top-left-radius:0;border-top-right-radius:0}.mat-mdc-autocomplete-panel-above div.mat-mdc-autocomplete-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;transform-origin:center bottom}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-visible{visibility:visible}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-hidden{visibility:hidden}mat-autocomplete{display:none}"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_AUTOCOMPLETE_DEFAULT_OPTIONS]
                }] }, { type: i1.Platform }]; }, propDecorators: { template: [{
                type: ViewChild,
                args: [TemplateRef, { static: true }]
            }], panel: [{
                type: ViewChild,
                args: ['panel']
            }], options: [{
                type: ContentChildren,
                args: [MatOption, { descendants: true }]
            }], optionGroups: [{
                type: ContentChildren,
                args: [MAT_OPTGROUP, { descendants: true }]
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
            }], hideSingleSelectionIndicator: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBQ1QsaUJBQWlCLEdBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFDTCxZQUFZLEVBQ1osMkJBQTJCLEVBRTNCLFNBQVMsRUFDVCxrQkFBa0IsR0FHbkIsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RCxPQUFPLEVBQWUscUJBQXFCLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM3RixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7O0FBRWxDOzs7R0FHRztBQUNILElBQUksNEJBQTRCLEdBQUcsQ0FBQyxDQUFDO0FBRXJDLDRFQUE0RTtBQUM1RSxNQUFNLE9BQU8sNEJBQTRCO0lBQ3ZDO0lBQ0Usa0VBQWtFO0lBQzNELE1BQXVCO0lBQzlCLGdDQUFnQztJQUN6QixNQUFpQjtRQUZqQixXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUV2QixXQUFNLEdBQU4sTUFB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Ii8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIE1BVF9PUFRHUk9VUCxcbiAgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULFxuICBNYXRPcHRncm91cCxcbiAgTWF0T3B0aW9uLFxuICBtaXhpbkRpc2FibGVSaXBwbGUsXG4gIENhbkRpc2FibGVSaXBwbGUsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0Jvb2xlYW5JbnB1dCwgY29lcmNlQm9vbGVhblByb3BlcnR5LCBjb2VyY2VTdHJpbmdBcnJheX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge3BhbmVsQW5pbWF0aW9ufSBmcm9tICcuL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIEF1dG9jb21wbGV0ZSBJRHMgbmVlZCB0byBiZSB1bmlxdWUgYWNyb3NzIGNvbXBvbmVudHMsIHNvIHRoaXMgY291bnRlciBleGlzdHMgb3V0c2lkZSBvZlxuICogdGhlIGNvbXBvbmVudCBkZWZpbml0aW9uLlxuICovXG5sZXQgX3VuaXF1ZUF1dG9jb21wbGV0ZUlkQ291bnRlciA9IDA7XG5cbi8qKiBFdmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gYW4gYXV0b2NvbXBsZXRlIG9wdGlvbiBpcyBzZWxlY3RlZC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0QXV0b2NvbXBsZXRlLFxuICAgIC8qKiBPcHRpb24gdGhhdCB3YXMgc2VsZWN0ZWQuICovXG4gICAgcHVibGljIG9wdGlvbjogTWF0T3B0aW9uLFxuICApIHt9XG59XG5cbi8qKiBFdmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gYW4gYXV0b2NvbXBsZXRlIG9wdGlvbiBpcyBhY3RpdmF0ZWQuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEF1dG9jb21wbGV0ZUFjdGl2YXRlZEV2ZW50IHtcbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gIHNvdXJjZTogTWF0QXV0b2NvbXBsZXRlO1xuXG4gIC8qKiBPcHRpb24gdGhhdCB3YXMgc2VsZWN0ZWQuICovXG4gIG9wdGlvbjogTWF0T3B0aW9uIHwgbnVsbDtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRBdXRvY29tcGxldGUuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuY29uc3QgX01hdEF1dG9jb21wbGV0ZU1peGluQmFzZSA9IG1peGluRGlzYWJsZVJpcHBsZShjbGFzcyB7fSk7XG5cbi8qKiBEZWZhdWx0IGBtYXQtYXV0b2NvbXBsZXRlYCBvcHRpb25zIHRoYXQgY2FuIGJlIG92ZXJyaWRkZW4uICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEF1dG9jb21wbGV0ZURlZmF1bHRPcHRpb25zIHtcbiAgLyoqIFdoZXRoZXIgdGhlIGZpcnN0IG9wdGlvbiBzaG91bGQgYmUgaGlnaGxpZ2h0ZWQgd2hlbiBhbiBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3BlbmVkLiAqL1xuICBhdXRvQWN0aXZlRmlyc3RPcHRpb24/OiBib29sZWFuO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBhY3RpdmUgb3B0aW9uIHNob3VsZCBiZSBzZWxlY3RlZCBhcyB0aGUgdXNlciBpcyBuYXZpZ2F0aW5nLiAqL1xuICBhdXRvU2VsZWN0QWN0aXZlT3B0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdXNlciBpcyByZXF1aXJlZCB0byBtYWtlIGEgc2VsZWN0aW9uIHdoZW5cbiAgICogdGhleSdyZSBpbnRlcmFjdGluZyB3aXRoIHRoZSBhdXRvY29tcGxldGUuXG4gICAqL1xuICByZXF1aXJlU2VsZWN0aW9uPzogYm9vbGVhbjtcblxuICAvKiogQ2xhc3Mgb3IgbGlzdCBvZiBjbGFzc2VzIHRvIGJlIGFwcGxpZWQgdG8gdGhlIGF1dG9jb21wbGV0ZSdzIG92ZXJsYXkgcGFuZWwuICovXG4gIG92ZXJsYXlQYW5lbENsYXNzPzogc3RyaW5nIHwgc3RyaW5nW107XG5cbiAgLyoqIFdoZXRlciBpY29uIGluZGljYXRvcnMgc2hvdWxkIGJlIGhpZGRlbiBmb3Igc2luZ2xlLXNlbGVjdGlvbi4gKi9cbiAgaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvcj86IGJvb2xlYW47XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gdG8gYmUgdXNlZCB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciBgbWF0LWF1dG9jb21wbGV0ZWAuICovXG5leHBvcnQgY29uc3QgTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlMgPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnM+KFxuICAnbWF0LWF1dG9jb21wbGV0ZS1kZWZhdWx0LW9wdGlvbnMnLFxuICB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6IE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlksXG4gIH0sXG4pO1xuXG4vKiogQGRvY3MtcHJpdmF0ZSAqL1xuZXhwb3J0IGZ1bmN0aW9uIE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TX0ZBQ1RPUlkoKTogTWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnMge1xuICByZXR1cm4ge1xuICAgIGF1dG9BY3RpdmVGaXJzdE9wdGlvbjogZmFsc2UsXG4gICAgYXV0b1NlbGVjdEFjdGl2ZU9wdGlvbjogZmFsc2UsXG4gICAgaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvcjogZmFsc2UsXG4gICAgcmVxdWlyZVNlbGVjdGlvbjogZmFsc2UsXG4gIH07XG59XG5cbi8qKiBBdXRvY29tcGxldGUgY29tcG9uZW50LiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LWF1dG9jb21wbGV0ZScsXG4gIHRlbXBsYXRlVXJsOiAnYXV0b2NvbXBsZXRlLmh0bWwnLFxuICBzdHlsZVVybHM6IFsnYXV0b2NvbXBsZXRlLmNzcyddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZXhwb3J0QXM6ICdtYXRBdXRvY29tcGxldGUnLFxuICBpbnB1dHM6IFsnZGlzYWJsZVJpcHBsZSddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1tZGMtYXV0b2NvbXBsZXRlJyxcbiAgICAnbmdTa2lwSHlkcmF0aW9uJzogJycsXG4gIH0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQsIHVzZUV4aXN0aW5nOiBNYXRBdXRvY29tcGxldGV9XSxcbiAgYW5pbWF0aW9uczogW3BhbmVsQW5pbWF0aW9uXSxcbn0pXG5leHBvcnQgY2xhc3MgTWF0QXV0b2NvbXBsZXRlXG4gIGV4dGVuZHMgX01hdEF1dG9jb21wbGV0ZU1peGluQmFzZVxuICBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIENhbkRpc2FibGVSaXBwbGUsIE9uRGVzdHJveVxue1xuICBwcml2YXRlIF9hY3RpdmVPcHRpb25DaGFuZ2VzID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuXG4gIC8qKiBDbGFzcyB0byBhcHBseSB0byB0aGUgcGFuZWwgd2hlbiBpdCdzIHZpc2libGUuICovXG4gIHByaXZhdGUgX3Zpc2libGVDbGFzcyA9ICdtYXQtbWRjLWF1dG9jb21wbGV0ZS12aXNpYmxlJztcblxuICAvKiogQ2xhc3MgdG8gYXBwbHkgdG8gdGhlIHBhbmVsIHdoZW4gaXQncyBoaWRkZW4uICovXG4gIHByaXZhdGUgX2hpZGRlbkNsYXNzID0gJ21hdC1tZGMtYXV0b2NvbXBsZXRlLWhpZGRlbic7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIHBhbmVsIGFuaW1hdGlvbiBpcyBkb25lLiBOdWxsIGlmIHRoZSBwYW5lbCBkb2Vzbid0IGFuaW1hdGUuICovXG4gIF9hbmltYXRpb25Eb25lID0gbmV3IEV2ZW50RW1pdHRlcjxBbmltYXRpb25FdmVudD4oKTtcblxuICAvKiogTWFuYWdlcyBhY3RpdmUgaXRlbSBpbiBvcHRpb24gbGlzdCBiYXNlZCBvbiBrZXkgZXZlbnRzLiAqL1xuICBfa2V5TWFuYWdlcjogQWN0aXZlRGVzY2VuZGFudEtleU1hbmFnZXI8TWF0T3B0aW9uPjtcblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHNob3VsZCBiZSB2aXNpYmxlLCBkZXBlbmRpbmcgb24gb3B0aW9uIGxlbmd0aC4gKi9cbiAgc2hvd1BhbmVsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuLiAqL1xuICBnZXQgaXNPcGVuKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pc09wZW4gJiYgdGhpcy5zaG93UGFuZWw7XG4gIH1cbiAgX2lzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBAZG9jcy1wcml2YXRlIFNldHMgdGhlIHRoZW1lIGNvbG9yIG9mIHRoZSBwYW5lbC4gKi9cbiAgX3NldENvbG9yKHZhbHVlOiBUaGVtZVBhbGV0dGUpIHtcbiAgICB0aGlzLl9jb2xvciA9IHZhbHVlO1xuICAgIHRoaXMuX3NldFRoZW1lQ2xhc3Nlcyh0aGlzLl9jbGFzc0xpc3QpO1xuICB9XG4gIC8qKiBAZG9jcy1wcml2YXRlIHRoZW1lIGNvbG9yIG9mIHRoZSBwYW5lbCAqL1xuICBwcml2YXRlIF9jb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8vIFRoZSBAVmlld0NoaWxkIHF1ZXJ5IGZvciBUZW1wbGF0ZVJlZiBoZXJlIG5lZWRzIHRvIGJlIHN0YXRpYyBiZWNhdXNlIHNvbWUgY29kZSBwYXRoc1xuICAvLyBsZWFkIHRvIHRoZSBvdmVybGF5IGJlaW5nIGNyZWF0ZWQgYmVmb3JlIGNoYW5nZSBkZXRlY3Rpb24gaGFzIGZpbmlzaGVkIGZvciB0aGlzIGNvbXBvbmVudC5cbiAgLy8gTm90YWJseSwgYW5vdGhlciBjb21wb25lbnQgbWF5IHRyaWdnZXIgYGZvY3VzYCBvbiB0aGUgYXV0b2NvbXBsZXRlLXRyaWdnZXIuXG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZiwge3N0YXRpYzogdHJ1ZX0pIHRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIC8qKiBFbGVtZW50IGZvciB0aGUgcGFuZWwgY29udGFpbmluZyB0aGUgYXV0b2NvbXBsZXRlIG9wdGlvbnMuICovXG4gIEBWaWV3Q2hpbGQoJ3BhbmVsJykgcGFuZWw6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIFJlZmVyZW5jZSB0byBhbGwgb3B0aW9ucyB3aXRoaW4gdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNYXRPcHRpb24sIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbnM6IFF1ZXJ5TGlzdDxNYXRPcHRpb24+O1xuXG4gIC8qKiBSZWZlcmVuY2UgdG8gYWxsIG9wdGlvbiBncm91cHMgd2l0aGluIHRoZSBhdXRvY29tcGxldGUuICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTUFUX09QVEdST1VQLCB7ZGVzY2VuZGFudHM6IHRydWV9KSBvcHRpb25Hcm91cHM6IFF1ZXJ5TGlzdDxNYXRPcHRncm91cD47XG5cbiAgLyoqIEFyaWEgbGFiZWwgb2YgdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgQElucHV0KCdhcmlhLWxhYmVsJykgYXJpYUxhYmVsOiBzdHJpbmc7XG5cbiAgLyoqIElucHV0IHRoYXQgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSB0aGUgYGFyaWEtbGFiZWxsZWRieWAgYXR0cmlidXRlLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWxsZWRieScpIGFyaWFMYWJlbGxlZGJ5OiBzdHJpbmc7XG5cbiAgLyoqIEZ1bmN0aW9uIHRoYXQgbWFwcyBhbiBvcHRpb24ncyBjb250cm9sIHZhbHVlIHRvIGl0cyBkaXNwbGF5IHZhbHVlIGluIHRoZSB0cmlnZ2VyLiAqL1xuICBASW5wdXQoKSBkaXNwbGF5V2l0aDogKCh2YWx1ZTogYW55KSA9PiBzdHJpbmcpIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGZpcnN0IG9wdGlvbiBzaG91bGQgYmUgaGlnaGxpZ2h0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW5lZC5cbiAgICogQ2FuIGJlIGNvbmZpZ3VyZWQgZ2xvYmFsbHkgdGhyb3VnaCB0aGUgYE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TYCB0b2tlbi5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBhdXRvQWN0aXZlRmlyc3RPcHRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2F1dG9BY3RpdmVGaXJzdE9wdGlvbjtcbiAgfVxuICBzZXQgYXV0b0FjdGl2ZUZpcnN0T3B0aW9uKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9hdXRvQWN0aXZlRmlyc3RPcHRpb24gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2F1dG9BY3RpdmVGaXJzdE9wdGlvbjogYm9vbGVhbjtcblxuICAvKiogV2hldGhlciB0aGUgYWN0aXZlIG9wdGlvbiBzaG91bGQgYmUgc2VsZWN0ZWQgYXMgdGhlIHVzZXIgaXMgbmF2aWdhdGluZy4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGF1dG9TZWxlY3RBY3RpdmVPcHRpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2F1dG9TZWxlY3RBY3RpdmVPcHRpb247XG4gIH1cbiAgc2V0IGF1dG9TZWxlY3RBY3RpdmVPcHRpb24odmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2F1dG9TZWxlY3RBY3RpdmVPcHRpb24gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX2F1dG9TZWxlY3RBY3RpdmVPcHRpb246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIHVzZXIgaXMgcmVxdWlyZWQgdG8gbWFrZSBhIHNlbGVjdGlvbiB3aGVuIHRoZXkncmUgaW50ZXJhY3Rpbmcgd2l0aCB0aGVcbiAgICogYXV0b2NvbXBsZXRlLiBJZiB0aGUgdXNlciBtb3ZlcyBhd2F5IGZyb20gdGhlIGF1dGNvbXBsZXRlIHdpdGhvdXQgc2VsZWN0aW5nIGFuIG9wdGlvbiBmcm9tXG4gICAqIHRoZSBsaXN0LCB0aGUgdmFsdWUgd2lsbCBiZSByZXNldC4gSWYgdGhlIHVzZXIgb3BlbnMgdGhlIHBhbmVsIGFuZCBjbG9zZXMgaXQgd2l0aG91dFxuICAgKiBpbnRlcmFjdGluZyBvciBzZWxlY3RpbmcgYSB2YWx1ZSwgdGhlIGluaXRpYWwgdmFsdWUgd2lsbCBiZSBrZXB0LlxuICAgKi9cbiAgQElucHV0KClcbiAgZ2V0IHJlcXVpcmVTZWxlY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3JlcXVpcmVTZWxlY3Rpb247XG4gIH1cbiAgc2V0IHJlcXVpcmVTZWxlY3Rpb24odmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX3JlcXVpcmVTZWxlY3Rpb24gPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3JlcXVpcmVTZWxlY3Rpb246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIHdpZHRoIG9mIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICBDYW4gYmUgYW55IENTUyBzaXppbmcgdmFsdWUsIG90aGVyd2lzZSBpdCB3aWxsXG4gICAqIG1hdGNoIHRoZSB3aWR0aCBvZiBpdHMgaG9zdC5cbiAgICovXG4gIEBJbnB1dCgpIHBhbmVsV2lkdGg6IHN0cmluZyB8IG51bWJlcjtcblxuICAvKiogRXZlbnQgdGhhdCBpcyBlbWl0dGVkIHdoZW5ldmVyIGFuIG9wdGlvbiBmcm9tIHRoZSBsaXN0IGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3B0aW9uU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50PigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb3NlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhbiBvcHRpb24gaXMgYWN0aXZhdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3B0aW9uQWN0aXZhdGVkOiBFdmVudEVtaXR0ZXI8TWF0QXV0b2NvbXBsZXRlQWN0aXZhdGVkRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdEF1dG9jb21wbGV0ZUFjdGl2YXRlZEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBUYWtlcyBjbGFzc2VzIHNldCBvbiB0aGUgaG9zdCBtYXQtYXV0b2NvbXBsZXRlIGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlbSB0byB0aGUgcGFuZWxcbiAgICogaW5zaWRlIHRoZSBvdmVybGF5IGNvbnRhaW5lciB0byBhbGxvdyBmb3IgZWFzeSBzdHlsaW5nLlxuICAgKi9cbiAgQElucHV0KCdjbGFzcycpXG4gIHNldCBjbGFzc0xpc3QodmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgdGhpcy5fY2xhc3NMaXN0ID0gY29lcmNlU3RyaW5nQXJyYXkodmFsdWUpLnJlZHVjZSgoY2xhc3NMaXN0LCBjbGFzc05hbWUpID0+IHtcbiAgICAgICAgY2xhc3NMaXN0W2NsYXNzTmFtZV0gPSB0cnVlO1xuICAgICAgICByZXR1cm4gY2xhc3NMaXN0O1xuICAgICAgfSwge30gYXMge1trZXk6IHN0cmluZ106IGJvb2xlYW59KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY2xhc3NMaXN0ID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5fc2V0VmlzaWJpbGl0eUNsYXNzZXModGhpcy5fY2xhc3NMaXN0KTtcbiAgICB0aGlzLl9zZXRUaGVtZUNsYXNzZXModGhpcy5fY2xhc3NMaXN0KTtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NOYW1lID0gJyc7XG4gIH1cbiAgX2NsYXNzTGlzdDoge1trZXk6IHN0cmluZ106IGJvb2xlYW59ID0ge307XG5cbiAgLyoqIFdoZXRoZXIgY2hlY2ttYXJrIGluZGljYXRvciBmb3Igc2luZ2xlLXNlbGVjdGlvbiBvcHRpb25zIGlzIGhpZGRlbi4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3I7XG4gIH1cbiAgc2V0IGhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2hpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICAgIHRoaXMuX3N5bmNQYXJlbnRQcm9wZXJ0aWVzKCk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvcjogYm9vbGVhbiA9XG4gICAgdGhpcy5fZGVmYXVsdHMuaGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvciA/PyBmYWxzZTtcblxuICAvKiogU3luY3MgdGhlIHBhcmVudCBzdGF0ZSB3aXRoIHRoZSBpbmRpdmlkdWFsIG9wdGlvbnMuICovXG4gIF9zeW5jUGFyZW50UHJvcGVydGllcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XG4gICAgICBmb3IgKGNvbnN0IG9wdGlvbiBvZiB0aGlzLm9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9uLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogVW5pcXVlIElEIHRvIGJlIHVzZWQgYnkgYXV0b2NvbXBsZXRlIHRyaWdnZXIncyBcImFyaWEtb3duc1wiIHByb3BlcnR5LiAqL1xuICBpZDogc3RyaW5nID0gYG1hdC1hdXRvY29tcGxldGUtJHtfdW5pcXVlQXV0b2NvbXBsZXRlSWRDb3VudGVyKyt9YDtcblxuICAvKipcbiAgICogVGVsbHMgYW55IGRlc2NlbmRhbnQgYG1hdC1vcHRncm91cGAgdG8gdXNlIHRoZSBpbmVydCBhMTF5IHBhdHRlcm4uXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJlYWRvbmx5IGluZXJ0R3JvdXBzOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBASW5qZWN0KE1BVF9BVVRPQ09NUExFVEVfREVGQVVMVF9PUFRJT05TKSBwcm90ZWN0ZWQgX2RlZmF1bHRzOiBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyxcbiAgICBwbGF0Zm9ybT86IFBsYXRmb3JtLFxuICApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoZSBwcm9ibGVtIHRoYXQgdGhlIGBpbmVydEdyb3Vwc2Agb3B0aW9uIHJlc29sdmVzIGlzIG9ubHkgcHJlc2VudCBvblxuICAgIC8vIFNhZmFyaSB1c2luZyBWb2ljZU92ZXIuIFdlIHNob3VsZCBvY2Nhc2lvbmFsbHkgY2hlY2sgYmFjayB0byBzZWUgd2hldGhlciB0aGUgYnVnXG4gICAgLy8gd2Fzbid0IHJlc29sdmVkIGluIFZvaWNlT3ZlciwgYW5kIGlmIGl0IGhhcywgd2UgY2FuIHJlbW92ZSB0aGlzIGFuZCB0aGUgYGluZXJ0R3JvdXBzYFxuICAgIC8vIG9wdGlvbiBhbHRvZ2V0aGVyLlxuICAgIHRoaXMuaW5lcnRHcm91cHMgPSBwbGF0Zm9ybT8uU0FGQVJJIHx8IGZhbHNlO1xuICAgIHRoaXMuX2F1dG9BY3RpdmVGaXJzdE9wdGlvbiA9ICEhX2RlZmF1bHRzLmF1dG9BY3RpdmVGaXJzdE9wdGlvbjtcbiAgICB0aGlzLl9hdXRvU2VsZWN0QWN0aXZlT3B0aW9uID0gISFfZGVmYXVsdHMuYXV0b1NlbGVjdEFjdGl2ZU9wdGlvbjtcbiAgICB0aGlzLl9yZXF1aXJlU2VsZWN0aW9uID0gISFfZGVmYXVsdHMucmVxdWlyZVNlbGVjdGlvbjtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEFjdGl2ZURlc2NlbmRhbnRLZXlNYW5hZ2VyPE1hdE9wdGlvbj4odGhpcy5vcHRpb25zKVxuICAgICAgLndpdGhXcmFwKClcbiAgICAgIC5za2lwUHJlZGljYXRlKHRoaXMuX3NraXBQcmVkaWNhdGUpO1xuICAgIHRoaXMuX2FjdGl2ZU9wdGlvbkNoYW5nZXMgPSB0aGlzLl9rZXlNYW5hZ2VyLmNoYW5nZS5zdWJzY3JpYmUoaW5kZXggPT4ge1xuICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICAgIHRoaXMub3B0aW9uQWN0aXZhdGVkLmVtaXQoe3NvdXJjZTogdGhpcywgb3B0aW9uOiB0aGlzLm9wdGlvbnMudG9BcnJheSgpW2luZGV4XSB8fCBudWxsfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBTZXQgdGhlIGluaXRpYWwgdmlzaWJpbGl0eSBzdGF0ZS5cbiAgICB0aGlzLl9zZXRWaXNpYmlsaXR5KCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyPy5kZXN0cm95KCk7XG4gICAgdGhpcy5fYWN0aXZlT3B0aW9uQ2hhbmdlcy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX2FuaW1hdGlvbkRvbmUuY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwYW5lbCBzY3JvbGxUb3AuIFRoaXMgYWxsb3dzIHVzIHRvIG1hbnVhbGx5IHNjcm9sbCB0byBkaXNwbGF5IG9wdGlvbnNcbiAgICogYWJvdmUgb3IgYmVsb3cgdGhlIGZvbGQsIGFzIHRoZXkgYXJlIG5vdCBhY3R1YWxseSBiZWluZyBmb2N1c2VkIHdoZW4gYWN0aXZlLlxuICAgKi9cbiAgX3NldFNjcm9sbFRvcChzY3JvbGxUb3A6IG51bWJlcik6IHZvaWQge1xuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBSZXR1cm5zIHRoZSBwYW5lbCdzIHNjcm9sbFRvcC4gKi9cbiAgX2dldFNjcm9sbFRvcCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnBhbmVsID8gdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA6IDA7XG4gIH1cblxuICAvKiogUGFuZWwgc2hvdWxkIGhpZGUgaXRzZWxmIHdoZW4gdGhlIG9wdGlvbiBsaXN0IGlzIGVtcHR5LiAqL1xuICBfc2V0VmlzaWJpbGl0eSgpIHtcbiAgICB0aGlzLnNob3dQYW5lbCA9ICEhdGhpcy5vcHRpb25zLmxlbmd0aDtcbiAgICB0aGlzLl9zZXRWaXNpYmlsaXR5Q2xhc3Nlcyh0aGlzLl9jbGFzc0xpc3QpO1xuICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgLyoqIEVtaXRzIHRoZSBgc2VsZWN0YCBldmVudC4gKi9cbiAgX2VtaXRTZWxlY3RFdmVudChvcHRpb246IE1hdE9wdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50ID0gbmV3IE1hdEF1dG9jb21wbGV0ZVNlbGVjdGVkRXZlbnQodGhpcywgb3B0aW9uKTtcbiAgICB0aGlzLm9wdGlvblNlbGVjdGVkLmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGFyaWEtbGFiZWxsZWRieSBmb3IgdGhlIGF1dG9jb21wbGV0ZSBwYW5lbC4gKi9cbiAgX2dldFBhbmVsQXJpYUxhYmVsbGVkYnkobGFiZWxJZDogc3RyaW5nIHwgbnVsbCk6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICh0aGlzLmFyaWFMYWJlbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbGFiZWxFeHByZXNzaW9uID0gbGFiZWxJZCA/IGxhYmVsSWQgKyAnICcgOiAnJztcbiAgICByZXR1cm4gdGhpcy5hcmlhTGFiZWxsZWRieSA/IGxhYmVsRXhwcmVzc2lvbiArIHRoaXMuYXJpYUxhYmVsbGVkYnkgOiBsYWJlbElkO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIGF1dG9jb21wbGV0ZSB2aXNpYmlsaXR5IGNsYXNzZXMgb24gYSBjbGFzc2xpc3QgYmFzZWQgb24gdGhlIHBhbmVsIGlzIHZpc2libGUuICovXG4gIHByaXZhdGUgX3NldFZpc2liaWxpdHlDbGFzc2VzKGNsYXNzTGlzdDoge1trZXk6IHN0cmluZ106IGJvb2xlYW59KSB7XG4gICAgY2xhc3NMaXN0W3RoaXMuX3Zpc2libGVDbGFzc10gPSB0aGlzLnNob3dQYW5lbDtcbiAgICBjbGFzc0xpc3RbdGhpcy5faGlkZGVuQ2xhc3NdID0gIXRoaXMuc2hvd1BhbmVsO1xuICB9XG5cbiAgLyoqIFNldHMgdGhlIHRoZW1pbmcgY2xhc3NlcyBvbiBhIGNsYXNzbGlzdCBiYXNlZCBvbiB0aGUgdGhlbWUgb2YgdGhlIHBhbmVsLiAqL1xuICBwcml2YXRlIF9zZXRUaGVtZUNsYXNzZXMoY2xhc3NMaXN0OiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0pIHtcbiAgICBjbGFzc0xpc3RbJ21hdC1wcmltYXJ5J10gPSB0aGlzLl9jb2xvciA9PT0gJ3ByaW1hcnknO1xuICAgIGNsYXNzTGlzdFsnbWF0LXdhcm4nXSA9IHRoaXMuX2NvbG9yID09PSAnd2Fybic7XG4gICAgY2xhc3NMaXN0WydtYXQtYWNjZW50J10gPSB0aGlzLl9jb2xvciA9PT0gJ2FjY2VudCc7XG4gIH1cblxuICAvLyBgc2tpcFByZWRpY2F0ZWAgZGV0ZXJtaW5lcyBpZiBrZXkgbWFuYWdlciBzaG91bGQgYXZvaWQgcHV0dGluZyBhIGdpdmVuIG9wdGlvbiBpbiB0aGUgdGFiXG4gIC8vIG9yZGVyLiBBbGxvdyBkaXNhYmxlZCBsaXN0IGl0ZW1zIHRvIHJlY2VpdmUgZm9jdXMgdmlhIGtleWJvYXJkIHRvIGFsaWduIHdpdGggV0FJIEFSSUFcbiAgLy8gcmVjb21tZW5kYXRpb24uXG4gIC8vXG4gIC8vIE5vcm1hbGx5IFdBSSBBUklBJ3MgaW5zdHJ1Y3Rpb25zIGFyZSB0byBleGNsdWRlIGRpc2FibGVkIGl0ZW1zIGZyb20gdGhlIHRhYiBvcmRlciwgYnV0IGl0XG4gIC8vIG1ha2VzIGEgZmV3IGV4Y2VwdGlvbnMgZm9yIGNvbXBvdW5kIHdpZGdldHMuXG4gIC8vXG4gIC8vIEZyb20gW0RldmVsb3BpbmcgYSBLZXlib2FyZCBJbnRlcmZhY2VdKFxuICAvLyBodHRwczovL3d3dy53My5vcmcvV0FJL0FSSUEvYXBnL3ByYWN0aWNlcy9rZXlib2FyZC1pbnRlcmZhY2UvKTpcbiAgLy8gICBcIkZvciB0aGUgZm9sbG93aW5nIGNvbXBvc2l0ZSB3aWRnZXQgZWxlbWVudHMsIGtlZXAgdGhlbSBmb2N1c2FibGUgd2hlbiBkaXNhYmxlZDogT3B0aW9ucyBpbiBhXG4gIC8vICAgTGlzdGJveC4uLlwiXG4gIC8vXG4gIC8vIFRoZSB1c2VyIGNhbiBmb2N1cyBkaXNhYmxlZCBvcHRpb25zIHVzaW5nIHRoZSBrZXlib2FyZCwgYnV0IHRoZSB1c2VyIGNhbm5vdCBjbGljayBkaXNhYmxlZFxuICAvLyBvcHRpb25zLlxuICBwcm90ZWN0ZWQgX3NraXBQcmVkaWNhdGUoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCI8bmctdGVtcGxhdGUgbGV0LWZvcm1GaWVsZElkPVwiaWRcIj5cbiAgPGRpdlxuICAgIGNsYXNzPVwibWF0LW1kYy1hdXRvY29tcGxldGUtcGFuZWwgbWRjLW1lbnUtc3VyZmFjZSBtZGMtbWVudS1zdXJmYWNlLS1vcGVuXCJcbiAgICByb2xlPVwibGlzdGJveFwiXG4gICAgW2lkXT1cImlkXCJcbiAgICBbbmdDbGFzc109XCJfY2xhc3NMaXN0XCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFMYWJlbCB8fCBudWxsXCJcbiAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiX2dldFBhbmVsQXJpYUxhYmVsbGVkYnkoZm9ybUZpZWxkSWQpXCJcbiAgICBbQHBhbmVsQW5pbWF0aW9uXT1cImlzT3BlbiA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nXCJcbiAgICAoQHBhbmVsQW5pbWF0aW9uLmRvbmUpPVwiX2FuaW1hdGlvbkRvbmUubmV4dCgkZXZlbnQpXCJcbiAgICAjcGFuZWw+XG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICA8L2Rpdj5cbjwvbmctdGVtcGxhdGU+XG4iXX0=
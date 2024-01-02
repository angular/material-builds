/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Inject, InjectionToken, Input, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation, booleanAttribute, } from '@angular/core';
import { MAT_OPTGROUP, MAT_OPTION_PARENT_COMPONENT, MatOption, } from '@angular/material/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { coerceStringArray } from '@angular/cdk/coercion';
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
export class MatAutocomplete {
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
        this._hideSingleSelectionIndicator = value;
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
        /** Unique ID to be used by autocomplete trigger's "aria-owns" property. */
        this.id = `mat-autocomplete-${_uniqueAutocompleteIdCounter++}`;
        // TODO(crisbeto): the problem that the `inertGroups` option resolves is only present on
        // Safari using VoiceOver. We should occasionally check back to see whether the bug
        // wasn't resolved in VoiceOver, and if it has, we can remove this and the `inertGroups`
        // option altogether.
        this.inertGroups = platform?.SAFARI || false;
        this.autoActiveFirstOption = !!_defaults.autoActiveFirstOption;
        this.autoSelectActiveOption = !!_defaults.autoSelectActiveOption;
        this.requireSelection = !!_defaults.requireSelection;
        this._hideSingleSelectionIndicator = this._defaults.hideSingleSelectionIndicator ?? false;
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatAutocomplete, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: MAT_AUTOCOMPLETE_DEFAULT_OPTIONS }, { token: i1.Platform }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "17.0.4", type: MatAutocomplete, selector: "mat-autocomplete", inputs: { ariaLabel: ["aria-label", "ariaLabel"], ariaLabelledby: ["aria-labelledby", "ariaLabelledby"], displayWith: "displayWith", autoActiveFirstOption: ["autoActiveFirstOption", "autoActiveFirstOption", booleanAttribute], autoSelectActiveOption: ["autoSelectActiveOption", "autoSelectActiveOption", booleanAttribute], requireSelection: ["requireSelection", "requireSelection", booleanAttribute], panelWidth: "panelWidth", disableRipple: ["disableRipple", "disableRipple", booleanAttribute], classList: ["class", "classList"], hideSingleSelectionIndicator: ["hideSingleSelectionIndicator", "hideSingleSelectionIndicator", booleanAttribute] }, outputs: { optionSelected: "optionSelected", opened: "opened", closed: "closed", optionActivated: "optionActivated" }, host: { classAttribute: "mat-mdc-autocomplete" }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], queries: [{ propertyName: "options", predicate: MatOption, descendants: true }, { propertyName: "optionGroups", predicate: MAT_OPTGROUP, descendants: true }], viewQueries: [{ propertyName: "template", first: true, predicate: TemplateRef, descendants: true, static: true }, { propertyName: "panel", first: true, predicate: ["panel"], descendants: true }], exportAs: ["matAutocomplete"], ngImport: i0, template: "<ng-template let-formFieldId=\"id\">\n  <div\n    class=\"mat-mdc-autocomplete-panel mdc-menu-surface mdc-menu-surface--open\"\n    role=\"listbox\"\n    [id]=\"id\"\n    [ngClass]=\"_classList\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n    [@panelAnimation]=\"isOpen ? 'visible' : 'hidden'\"\n    (@panelAnimation.done)=\"_animationDone.next($event)\"\n    #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: ["div.mat-mdc-autocomplete-panel{box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);width:100%;max-height:256px;visibility:hidden;transform-origin:center top;overflow:auto;padding:8px 0;border-radius:4px;box-sizing:border-box;position:static;background-color:var(--mat-autocomplete-background-color)}.cdk-high-contrast-active div.mat-mdc-autocomplete-panel{outline:solid 1px}.cdk-overlay-pane:not(.mat-mdc-autocomplete-panel-above) div.mat-mdc-autocomplete-panel{border-top-left-radius:0;border-top-right-radius:0}.mat-mdc-autocomplete-panel-above div.mat-mdc-autocomplete-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;transform-origin:center bottom}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-visible{visibility:visible}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-hidden{visibility:hidden}mat-autocomplete{display:none}"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], animations: [panelAnimation], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.0.4", ngImport: i0, type: MatAutocomplete, decorators: [{
            type: Component,
            args: [{ selector: 'mat-autocomplete', encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, exportAs: 'matAutocomplete', host: {
                        'class': 'mat-mdc-autocomplete',
                    }, providers: [{ provide: MAT_OPTION_PARENT_COMPONENT, useExisting: MatAutocomplete }], animations: [panelAnimation], template: "<ng-template let-formFieldId=\"id\">\n  <div\n    class=\"mat-mdc-autocomplete-panel mdc-menu-surface mdc-menu-surface--open\"\n    role=\"listbox\"\n    [id]=\"id\"\n    [ngClass]=\"_classList\"\n    [attr.aria-label]=\"ariaLabel || null\"\n    [attr.aria-labelledby]=\"_getPanelAriaLabelledby(formFieldId)\"\n    [@panelAnimation]=\"isOpen ? 'visible' : 'hidden'\"\n    (@panelAnimation.done)=\"_animationDone.next($event)\"\n    #panel>\n    <ng-content></ng-content>\n  </div>\n</ng-template>\n", styles: ["div.mat-mdc-autocomplete-panel{box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);width:100%;max-height:256px;visibility:hidden;transform-origin:center top;overflow:auto;padding:8px 0;border-radius:4px;box-sizing:border-box;position:static;background-color:var(--mat-autocomplete-background-color)}.cdk-high-contrast-active div.mat-mdc-autocomplete-panel{outline:solid 1px}.cdk-overlay-pane:not(.mat-mdc-autocomplete-panel-above) div.mat-mdc-autocomplete-panel{border-top-left-radius:0;border-top-right-radius:0}.mat-mdc-autocomplete-panel-above div.mat-mdc-autocomplete-panel{border-bottom-left-radius:0;border-bottom-right-radius:0;transform-origin:center bottom}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-visible{visibility:visible}div.mat-mdc-autocomplete-panel.mat-mdc-autocomplete-hidden{visibility:hidden}mat-autocomplete{display:none}"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_AUTOCOMPLETE_DEFAULT_OPTIONS]
                }] }, { type: i1.Platform }], propDecorators: { template: [{
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
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], autoSelectActiveOption: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], requireSelection: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], panelWidth: [{
                type: Input
            }], disableRipple: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
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
                type: Input,
                args: [{ transform: booleanAttribute }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2F1dG9jb21wbGV0ZS9hdXRvY29tcGxldGUudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvYXV0b2NvbXBsZXRlL2F1dG9jb21wbGV0ZS5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsVUFBVSxFQUNWLFlBQVksRUFDWixNQUFNLEVBQ04sY0FBYyxFQUNkLEtBQUssRUFFTCxNQUFNLEVBQ04sU0FBUyxFQUNULFdBQVcsRUFDWCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2pCLGdCQUFnQixHQUNqQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsWUFBWSxFQUNaLDJCQUEyQixFQUUzQixTQUFTLEdBRVYsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUN4RCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUM1QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sTUFBTSxDQUFDOzs7O0FBRWxDOzs7R0FHRztBQUNILElBQUksNEJBQTRCLEdBQUcsQ0FBQyxDQUFDO0FBRXJDLDRFQUE0RTtBQUM1RSxNQUFNLE9BQU8sNEJBQTRCO0lBQ3ZDO0lBQ0Usa0VBQWtFO0lBQzNELE1BQXVCO0lBQzlCLGdDQUFnQztJQUN6QixNQUFpQjtRQUZqQixXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUV2QixXQUFNLEdBQU4sTUFBTSxDQUFXO0lBQ3ZC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Z0JBR2YsV0FBVztzQkFBbkIsS0FBSztnQkFNZ0MscUJBQXFCO3NCQUExRCxLQUFLO3VCQUFDLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFDO2dCQUdFLHNCQUFzQjtzQkFBM0QsS0FBSzt1QkFBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQztnQkFRRSxnQkFBZ0I7c0JBQXJELEtBQUs7dUJBQUMsRUFBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUM7Z0JBTTNCLFVBQVU7c0JBQWxCLEtBQUs7Z0JBR2dDLGFBQWE7c0JBQWxELEtBQUs7dUJBQUMsRUFBQyxTQUFTLEVBQUUsZ0JBQWdCLEVBQUM7Z0JBR2pCLGNBQWM7c0JBQWhDLE1BQU07Z0JBSVksTUFBTTtzQkFBeEIsTUFBTTtnQkFHWSxNQUFNO3NCQUF4QixNQUFNO2dCQUdZLGVBQWU7c0JBQWpDLE1BQU07Z0JBUUgsU0FBUztzQkFEWixLQUFLO3VCQUFDLE9BQU87Z0JBc0JWLDRCQUE0QjtzQkFEL0IsS0FBSzt1QkFBQyxFQUFDLFNBQVMsRUFBRSxnQkFBZ0IsRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgYm9vbGVhbkF0dHJpYnV0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0FuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7XG4gIE1BVF9PUFRHUk9VUCxcbiAgTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULFxuICBNYXRPcHRncm91cCxcbiAgTWF0T3B0aW9uLFxuICBUaGVtZVBhbGV0dGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtjb2VyY2VTdHJpbmdBcnJheX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7UGxhdGZvcm19IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge3BhbmVsQW5pbWF0aW9ufSBmcm9tICcuL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuXG4vKipcbiAqIEF1dG9jb21wbGV0ZSBJRHMgbmVlZCB0byBiZSB1bmlxdWUgYWNyb3NzIGNvbXBvbmVudHMsIHNvIHRoaXMgY291bnRlciBleGlzdHMgb3V0c2lkZSBvZlxuICogdGhlIGNvbXBvbmVudCBkZWZpbml0aW9uLlxuICovXG5sZXQgX3VuaXF1ZUF1dG9jb21wbGV0ZUlkQ291bnRlciA9IDA7XG5cbi8qKiBFdmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gYW4gYXV0b2NvbXBsZXRlIG9wdGlvbiBpcyBzZWxlY3RlZC4gKi9cbmV4cG9ydCBjbGFzcyBNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50IHtcbiAgY29uc3RydWN0b3IoXG4gICAgLyoqIFJlZmVyZW5jZSB0byB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gICAgcHVibGljIHNvdXJjZTogTWF0QXV0b2NvbXBsZXRlLFxuICAgIC8qKiBPcHRpb24gdGhhdCB3YXMgc2VsZWN0ZWQuICovXG4gICAgcHVibGljIG9wdGlvbjogTWF0T3B0aW9uLFxuICApIHt9XG59XG5cbi8qKiBFdmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gYW4gYXV0b2NvbXBsZXRlIG9wdGlvbiBpcyBhY3RpdmF0ZWQuICovXG5leHBvcnQgaW50ZXJmYWNlIE1hdEF1dG9jb21wbGV0ZUFjdGl2YXRlZEV2ZW50IHtcbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIHRoYXQgZW1pdHRlZCB0aGUgZXZlbnQuICovXG4gIHNvdXJjZTogTWF0QXV0b2NvbXBsZXRlO1xuXG4gIC8qKiBPcHRpb24gdGhhdCB3YXMgc2VsZWN0ZWQuICovXG4gIG9wdGlvbjogTWF0T3B0aW9uIHwgbnVsbDtcbn1cblxuLyoqIERlZmF1bHQgYG1hdC1hdXRvY29tcGxldGVgIG9wdGlvbnMgdGhhdCBjYW4gYmUgb3ZlcnJpZGRlbi4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0QXV0b2NvbXBsZXRlRGVmYXVsdE9wdGlvbnMge1xuICAvKiogV2hldGhlciB0aGUgZmlyc3Qgb3B0aW9uIHNob3VsZCBiZSBoaWdobGlnaHRlZCB3aGVuIGFuIGF1dG9jb21wbGV0ZSBwYW5lbCBpcyBvcGVuZWQuICovXG4gIGF1dG9BY3RpdmVGaXJzdE9wdGlvbj86IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFjdGl2ZSBvcHRpb24gc2hvdWxkIGJlIHNlbGVjdGVkIGFzIHRoZSB1c2VyIGlzIG5hdmlnYXRpbmcuICovXG4gIGF1dG9TZWxlY3RBY3RpdmVPcHRpb24/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSB1c2VyIGlzIHJlcXVpcmVkIHRvIG1ha2UgYSBzZWxlY3Rpb24gd2hlblxuICAgKiB0aGV5J3JlIGludGVyYWN0aW5nIHdpdGggdGhlIGF1dG9jb21wbGV0ZS5cbiAgICovXG4gIHJlcXVpcmVTZWxlY3Rpb24/OiBib29sZWFuO1xuXG4gIC8qKiBDbGFzcyBvciBsaXN0IG9mIGNsYXNzZXMgdG8gYmUgYXBwbGllZCB0byB0aGUgYXV0b2NvbXBsZXRlJ3Mgb3ZlcmxheSBwYW5lbC4gKi9cbiAgb3ZlcmxheVBhbmVsQ2xhc3M/OiBzdHJpbmcgfCBzdHJpbmdbXTtcblxuICAvKiogV2hldGVyIGljb24gaW5kaWNhdG9ycyBzaG91bGQgYmUgaGlkZGVuIGZvciBzaW5nbGUtc2VsZWN0aW9uLiAqL1xuICBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yPzogYm9vbGVhbjtcbn1cblxuLyoqIEluamVjdGlvbiB0b2tlbiB0byBiZSB1c2VkIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9wdGlvbnMgZm9yIGBtYXQtYXV0b2NvbXBsZXRlYC4gKi9cbmV4cG9ydCBjb25zdCBNQVRfQVVUT0NPTVBMRVRFX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucz4oXG4gICdtYXQtYXV0b2NvbXBsZXRlLWRlZmF1bHQtb3B0aW9ucycsXG4gIHtcbiAgICBwcm92aWRlZEluOiAncm9vdCcsXG4gICAgZmFjdG9yeTogTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSxcbiAgfSxcbik7XG5cbi8qKiBAZG9jcy1wcml2YXRlICovXG5leHBvcnQgZnVuY3Rpb24gTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNfRkFDVE9SWSgpOiBNYXRBdXRvY29tcGxldGVEZWZhdWx0T3B0aW9ucyB7XG4gIHJldHVybiB7XG4gICAgYXV0b0FjdGl2ZUZpcnN0T3B0aW9uOiBmYWxzZSxcbiAgICBhdXRvU2VsZWN0QWN0aXZlT3B0aW9uOiBmYWxzZSxcbiAgICBoaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yOiBmYWxzZSxcbiAgICByZXF1aXJlU2VsZWN0aW9uOiBmYWxzZSxcbiAgfTtcbn1cblxuLyoqIEF1dG9jb21wbGV0ZSBjb21wb25lbnQuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtYXV0b2NvbXBsZXRlJyxcbiAgdGVtcGxhdGVVcmw6ICdhdXRvY29tcGxldGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydhdXRvY29tcGxldGUuY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBleHBvcnRBczogJ21hdEF1dG9jb21wbGV0ZScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LW1kYy1hdXRvY29tcGxldGUnLFxuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTUFUX09QVElPTl9QQVJFTlRfQ09NUE9ORU5ULCB1c2VFeGlzdGluZzogTWF0QXV0b2NvbXBsZXRlfV0sXG4gIGFuaW1hdGlvbnM6IFtwYW5lbEFuaW1hdGlvbl0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdEF1dG9jb21wbGV0ZSBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2FjdGl2ZU9wdGlvbkNoYW5nZXMgPSBTdWJzY3JpcHRpb24uRU1QVFk7XG5cbiAgLyoqIENsYXNzIHRvIGFwcGx5IHRvIHRoZSBwYW5lbCB3aGVuIGl0J3MgdmlzaWJsZS4gKi9cbiAgcHJpdmF0ZSBfdmlzaWJsZUNsYXNzID0gJ21hdC1tZGMtYXV0b2NvbXBsZXRlLXZpc2libGUnO1xuXG4gIC8qKiBDbGFzcyB0byBhcHBseSB0byB0aGUgcGFuZWwgd2hlbiBpdCdzIGhpZGRlbi4gKi9cbiAgcHJpdmF0ZSBfaGlkZGVuQ2xhc3MgPSAnbWF0LW1kYy1hdXRvY29tcGxldGUtaGlkZGVuJztcblxuICAvKiogRW1pdHMgd2hlbiB0aGUgcGFuZWwgYW5pbWF0aW9uIGlzIGRvbmUuIE51bGwgaWYgdGhlIHBhbmVsIGRvZXNuJ3QgYW5pbWF0ZS4gKi9cbiAgX2FuaW1hdGlvbkRvbmUgPSBuZXcgRXZlbnRFbWl0dGVyPEFuaW1hdGlvbkV2ZW50PigpO1xuXG4gIC8qKiBNYW5hZ2VzIGFjdGl2ZSBpdGVtIGluIG9wdGlvbiBsaXN0IGJhc2VkIG9uIGtleSBldmVudHMuICovXG4gIF9rZXlNYW5hZ2VyOiBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcjxNYXRPcHRpb24+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgc2hvdWxkIGJlIHZpc2libGUsIGRlcGVuZGluZyBvbiBvcHRpb24gbGVuZ3RoLiAqL1xuICBzaG93UGFuZWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW4uICovXG4gIGdldCBpc09wZW4oKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzT3BlbiAmJiB0aGlzLnNob3dQYW5lbDtcbiAgfVxuICBfaXNPcGVuOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgU2V0cyB0aGUgdGhlbWUgY29sb3Igb2YgdGhlIHBhbmVsLiAqL1xuICBfc2V0Q29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIHRoaXMuX2NvbG9yID0gdmFsdWU7XG4gICAgdGhpcy5fc2V0VGhlbWVDbGFzc2VzKHRoaXMuX2NsYXNzTGlzdCk7XG4gIH1cbiAgLyoqIEBkb2NzLXByaXZhdGUgdGhlbWUgY29sb3Igb2YgdGhlIHBhbmVsICovXG4gIHByaXZhdGUgX2NvbG9yOiBUaGVtZVBhbGV0dGU7XG5cbiAgLy8gVGhlIEBWaWV3Q2hpbGQgcXVlcnkgZm9yIFRlbXBsYXRlUmVmIGhlcmUgbmVlZHMgdG8gYmUgc3RhdGljIGJlY2F1c2Ugc29tZSBjb2RlIHBhdGhzXG4gIC8vIGxlYWQgdG8gdGhlIG92ZXJsYXkgYmVpbmcgY3JlYXRlZCBiZWZvcmUgY2hhbmdlIGRldGVjdGlvbiBoYXMgZmluaXNoZWQgZm9yIHRoaXMgY29tcG9uZW50LlxuICAvLyBOb3RhYmx5LCBhbm90aGVyIGNvbXBvbmVudCBtYXkgdHJpZ2dlciBgZm9jdXNgIG9uIHRoZSBhdXRvY29tcGxldGUtdHJpZ2dlci5cblxuICAvKiogQGRvY3MtcHJpdmF0ZSAqL1xuICBAVmlld0NoaWxkKFRlbXBsYXRlUmVmLCB7c3RhdGljOiB0cnVlfSkgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgLyoqIEVsZW1lbnQgZm9yIHRoZSBwYW5lbCBjb250YWluaW5nIHRoZSBhdXRvY29tcGxldGUgb3B0aW9ucy4gKi9cbiAgQFZpZXdDaGlsZCgncGFuZWwnKSBwYW5lbDogRWxlbWVudFJlZjtcblxuICAvKiogUmVmZXJlbmNlIHRvIGFsbCBvcHRpb25zIHdpdGhpbiB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBAQ29udGVudENoaWxkcmVuKE1hdE9wdGlvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uczogUXVlcnlMaXN0PE1hdE9wdGlvbj47XG5cbiAgLyoqIFJlZmVyZW5jZSB0byBhbGwgb3B0aW9uIGdyb3VwcyB3aXRoaW4gdGhlIGF1dG9jb21wbGV0ZS4gKi9cbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfT1BUR1JPVVAsIHtkZXNjZW5kYW50czogdHJ1ZX0pIG9wdGlvbkdyb3VwczogUXVlcnlMaXN0PE1hdE9wdGdyb3VwPjtcblxuICAvKiogQXJpYSBsYWJlbCBvZiB0aGUgYXV0b2NvbXBsZXRlLiAqL1xuICBASW5wdXQoJ2FyaWEtbGFiZWwnKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAvKiogSW5wdXQgdGhhdCBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHRoZSBgYXJpYS1sYWJlbGxlZGJ5YCBhdHRyaWJ1dGUuICovXG4gIEBJbnB1dCgnYXJpYS1sYWJlbGxlZGJ5JykgYXJpYUxhYmVsbGVkYnk6IHN0cmluZztcblxuICAvKiogRnVuY3Rpb24gdGhhdCBtYXBzIGFuIG9wdGlvbidzIGNvbnRyb2wgdmFsdWUgdG8gaXRzIGRpc3BsYXkgdmFsdWUgaW4gdGhlIHRyaWdnZXIuICovXG4gIEBJbnB1dCgpIGRpc3BsYXlXaXRoOiAoKHZhbHVlOiBhbnkpID0+IHN0cmluZykgfCBudWxsID0gbnVsbDtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgZmlyc3Qgb3B0aW9uIHNob3VsZCBiZSBoaWdobGlnaHRlZCB3aGVuIHRoZSBhdXRvY29tcGxldGUgcGFuZWwgaXMgb3BlbmVkLlxuICAgKiBDYW4gYmUgY29uZmlndXJlZCBnbG9iYWxseSB0aHJvdWdoIHRoZSBgTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlNgIHRva2VuLlxuICAgKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KSBhdXRvQWN0aXZlRmlyc3RPcHRpb246IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGFjdGl2ZSBvcHRpb24gc2hvdWxkIGJlIHNlbGVjdGVkIGFzIHRoZSB1c2VyIGlzIG5hdmlnYXRpbmcuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSkgYXV0b1NlbGVjdEFjdGl2ZU9wdGlvbjogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgdXNlciBpcyByZXF1aXJlZCB0byBtYWtlIGEgc2VsZWN0aW9uIHdoZW4gdGhleSdyZSBpbnRlcmFjdGluZyB3aXRoIHRoZVxuICAgKiBhdXRvY29tcGxldGUuIElmIHRoZSB1c2VyIG1vdmVzIGF3YXkgZnJvbSB0aGUgYXV0b2NvbXBsZXRlIHdpdGhvdXQgc2VsZWN0aW5nIGFuIG9wdGlvbiBmcm9tXG4gICAqIHRoZSBsaXN0LCB0aGUgdmFsdWUgd2lsbCBiZSByZXNldC4gSWYgdGhlIHVzZXIgb3BlbnMgdGhlIHBhbmVsIGFuZCBjbG9zZXMgaXQgd2l0aG91dFxuICAgKiBpbnRlcmFjdGluZyBvciBzZWxlY3RpbmcgYSB2YWx1ZSwgdGhlIGluaXRpYWwgdmFsdWUgd2lsbCBiZSBrZXB0LlxuICAgKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IGJvb2xlYW5BdHRyaWJ1dGV9KSByZXF1aXJlU2VsZWN0aW9uOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IHRoZSB3aWR0aCBvZiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsLiAgQ2FuIGJlIGFueSBDU1Mgc2l6aW5nIHZhbHVlLCBvdGhlcndpc2UgaXQgd2lsbFxuICAgKiBtYXRjaCB0aGUgd2lkdGggb2YgaXRzIGhvc3QuXG4gICAqL1xuICBASW5wdXQoKSBwYW5lbFdpZHRoOiBzdHJpbmcgfCBudW1iZXI7XG5cbiAgLyoqIFdoZXRoZXIgcmlwcGxlcyBhcmUgZGlzYWJsZWQgd2l0aGluIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSkgZGlzYWJsZVJpcHBsZTogYm9vbGVhbjtcblxuICAvKiogRXZlbnQgdGhhdCBpcyBlbWl0dGVkIHdoZW5ldmVyIGFuIG9wdGlvbiBmcm9tIHRoZSBsaXN0IGlzIHNlbGVjdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3B0aW9uU2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50PiA9XG4gICAgbmV3IEV2ZW50RW1pdHRlcjxNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50PigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIG9wZW5lZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9wZW5lZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFdmVudCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgYXV0b2NvbXBsZXRlIHBhbmVsIGlzIGNsb3NlZC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb3NlZDogRXZlbnRFbWl0dGVyPHZvaWQ+ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKiBFbWl0cyB3aGVuZXZlciBhbiBvcHRpb24gaXMgYWN0aXZhdGVkLiAqL1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgb3B0aW9uQWN0aXZhdGVkOiBFdmVudEVtaXR0ZXI8TWF0QXV0b2NvbXBsZXRlQWN0aXZhdGVkRXZlbnQ+ID1cbiAgICBuZXcgRXZlbnRFbWl0dGVyPE1hdEF1dG9jb21wbGV0ZUFjdGl2YXRlZEV2ZW50PigpO1xuXG4gIC8qKlxuICAgKiBUYWtlcyBjbGFzc2VzIHNldCBvbiB0aGUgaG9zdCBtYXQtYXV0b2NvbXBsZXRlIGVsZW1lbnQgYW5kIGFwcGxpZXMgdGhlbSB0byB0aGUgcGFuZWxcbiAgICogaW5zaWRlIHRoZSBvdmVybGF5IGNvbnRhaW5lciB0byBhbGxvdyBmb3IgZWFzeSBzdHlsaW5nLlxuICAgKi9cbiAgQElucHV0KCdjbGFzcycpXG4gIHNldCBjbGFzc0xpc3QodmFsdWU6IHN0cmluZyB8IHN0cmluZ1tdKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgdGhpcy5fY2xhc3NMaXN0ID0gY29lcmNlU3RyaW5nQXJyYXkodmFsdWUpLnJlZHVjZShcbiAgICAgICAgKGNsYXNzTGlzdCwgY2xhc3NOYW1lKSA9PiB7XG4gICAgICAgICAgY2xhc3NMaXN0W2NsYXNzTmFtZV0gPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBjbGFzc0xpc3Q7XG4gICAgICAgIH0sXG4gICAgICAgIHt9IGFzIHtba2V5OiBzdHJpbmddOiBib29sZWFufSxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NsYXNzTGlzdCA9IHt9O1xuICAgIH1cblxuICAgIHRoaXMuX3NldFZpc2liaWxpdHlDbGFzc2VzKHRoaXMuX2NsYXNzTGlzdCk7XG4gICAgdGhpcy5fc2V0VGhlbWVDbGFzc2VzKHRoaXMuX2NsYXNzTGlzdCk7XG4gICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTmFtZSA9ICcnO1xuICB9XG4gIF9jbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSA9IHt9O1xuXG4gIC8qKiBXaGV0aGVyIGNoZWNrbWFyayBpbmRpY2F0b3IgZm9yIHNpbmdsZS1zZWxlY3Rpb24gb3B0aW9ucyBpcyBoaWRkZW4uICovXG4gIEBJbnB1dCh7dHJhbnNmb3JtOiBib29sZWFuQXR0cmlidXRlfSlcbiAgZ2V0IGhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2hpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3I7XG4gIH1cbiAgc2V0IGhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IodmFsdWU6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9oaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yID0gdmFsdWU7XG4gICAgdGhpcy5fc3luY1BhcmVudFByb3BlcnRpZXMoKTtcbiAgfVxuICBwcml2YXRlIF9oaWRlU2luZ2xlU2VsZWN0aW9uSW5kaWNhdG9yOiBib29sZWFuO1xuXG4gIC8qKiBTeW5jcyB0aGUgcGFyZW50IHN0YXRlIHdpdGggdGhlIGluZGl2aWR1YWwgb3B0aW9ucy4gKi9cbiAgX3N5bmNQYXJlbnRQcm9wZXJ0aWVzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgIGZvciAoY29uc3Qgb3B0aW9uIG9mIHRoaXMub3B0aW9ucykge1xuICAgICAgICBvcHRpb24uX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBVbmlxdWUgSUQgdG8gYmUgdXNlZCBieSBhdXRvY29tcGxldGUgdHJpZ2dlcidzIFwiYXJpYS1vd25zXCIgcHJvcGVydHkuICovXG4gIGlkOiBzdHJpbmcgPSBgbWF0LWF1dG9jb21wbGV0ZS0ke191bmlxdWVBdXRvY29tcGxldGVJZENvdW50ZXIrK31gO1xuXG4gIC8qKlxuICAgKiBUZWxscyBhbnkgZGVzY2VuZGFudCBgbWF0LW9wdGdyb3VwYCB0byB1c2UgdGhlIGluZXJ0IGExMXkgcGF0dGVybi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5lcnRHcm91cHM6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgIEBJbmplY3QoTUFUX0FVVE9DT01QTEVURV9ERUZBVUxUX09QVElPTlMpIHByb3RlY3RlZCBfZGVmYXVsdHM6IE1hdEF1dG9jb21wbGV0ZURlZmF1bHRPcHRpb25zLFxuICAgIHBsYXRmb3JtPzogUGxhdGZvcm0sXG4gICkge1xuICAgIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGUgcHJvYmxlbSB0aGF0IHRoZSBgaW5lcnRHcm91cHNgIG9wdGlvbiByZXNvbHZlcyBpcyBvbmx5IHByZXNlbnQgb25cbiAgICAvLyBTYWZhcmkgdXNpbmcgVm9pY2VPdmVyLiBXZSBzaG91bGQgb2NjYXNpb25hbGx5IGNoZWNrIGJhY2sgdG8gc2VlIHdoZXRoZXIgdGhlIGJ1Z1xuICAgIC8vIHdhc24ndCByZXNvbHZlZCBpbiBWb2ljZU92ZXIsIGFuZCBpZiBpdCBoYXMsIHdlIGNhbiByZW1vdmUgdGhpcyBhbmQgdGhlIGBpbmVydEdyb3Vwc2BcbiAgICAvLyBvcHRpb24gYWx0b2dldGhlci5cbiAgICB0aGlzLmluZXJ0R3JvdXBzID0gcGxhdGZvcm0/LlNBRkFSSSB8fCBmYWxzZTtcbiAgICB0aGlzLmF1dG9BY3RpdmVGaXJzdE9wdGlvbiA9ICEhX2RlZmF1bHRzLmF1dG9BY3RpdmVGaXJzdE9wdGlvbjtcbiAgICB0aGlzLmF1dG9TZWxlY3RBY3RpdmVPcHRpb24gPSAhIV9kZWZhdWx0cy5hdXRvU2VsZWN0QWN0aXZlT3B0aW9uO1xuICAgIHRoaXMucmVxdWlyZVNlbGVjdGlvbiA9ICEhX2RlZmF1bHRzLnJlcXVpcmVTZWxlY3Rpb247XG4gICAgdGhpcy5faGlkZVNpbmdsZVNlbGVjdGlvbkluZGljYXRvciA9IHRoaXMuX2RlZmF1bHRzLmhpZGVTaW5nbGVTZWxlY3Rpb25JbmRpY2F0b3IgPz8gZmFsc2U7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlciA9IG5ldyBBY3RpdmVEZXNjZW5kYW50S2V5TWFuYWdlcjxNYXRPcHRpb24+KHRoaXMub3B0aW9ucylcbiAgICAgIC53aXRoV3JhcCgpXG4gICAgICAuc2tpcFByZWRpY2F0ZSh0aGlzLl9za2lwUHJlZGljYXRlKTtcbiAgICB0aGlzLl9hY3RpdmVPcHRpb25DaGFuZ2VzID0gdGhpcy5fa2V5TWFuYWdlci5jaGFuZ2Uuc3Vic2NyaWJlKGluZGV4ID0+IHtcbiAgICAgIGlmICh0aGlzLmlzT3Blbikge1xuICAgICAgICB0aGlzLm9wdGlvbkFjdGl2YXRlZC5lbWl0KHtzb3VyY2U6IHRoaXMsIG9wdGlvbjogdGhpcy5vcHRpb25zLnRvQXJyYXkoKVtpbmRleF0gfHwgbnVsbH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2V0IHRoZSBpbml0aWFsIHZpc2liaWxpdHkgc3RhdGUuXG4gICAgdGhpcy5fc2V0VmlzaWJpbGl0eSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fa2V5TWFuYWdlcj8uZGVzdHJveSgpO1xuICAgIHRoaXMuX2FjdGl2ZU9wdGlvbkNoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLl9hbmltYXRpb25Eb25lLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcGFuZWwgc2Nyb2xsVG9wLiBUaGlzIGFsbG93cyB1cyB0byBtYW51YWxseSBzY3JvbGwgdG8gZGlzcGxheSBvcHRpb25zXG4gICAqIGFib3ZlIG9yIGJlbG93IHRoZSBmb2xkLCBhcyB0aGV5IGFyZSBub3QgYWN0dWFsbHkgYmVpbmcgZm9jdXNlZCB3aGVuIGFjdGl2ZS5cbiAgICovXG4gIF9zZXRTY3JvbGxUb3Aoc2Nyb2xsVG9wOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wYW5lbCkge1xuICAgICAgdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IHNjcm9sbFRvcDtcbiAgICB9XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgcGFuZWwncyBzY3JvbGxUb3AuICovXG4gIF9nZXRTY3JvbGxUb3AoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lbCA/IHRoaXMucGFuZWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgOiAwO1xuICB9XG5cbiAgLyoqIFBhbmVsIHNob3VsZCBoaWRlIGl0c2VsZiB3aGVuIHRoZSBvcHRpb24gbGlzdCBpcyBlbXB0eS4gKi9cbiAgX3NldFZpc2liaWxpdHkoKSB7XG4gICAgdGhpcy5zaG93UGFuZWwgPSAhIXRoaXMub3B0aW9ucy5sZW5ndGg7XG4gICAgdGhpcy5fc2V0VmlzaWJpbGl0eUNsYXNzZXModGhpcy5fY2xhc3NMaXN0KTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyB0aGUgYHNlbGVjdGAgZXZlbnQuICovXG4gIF9lbWl0U2VsZWN0RXZlbnQob3B0aW9uOiBNYXRPcHRpb24pOiB2b2lkIHtcbiAgICBjb25zdCBldmVudCA9IG5ldyBNYXRBdXRvY29tcGxldGVTZWxlY3RlZEV2ZW50KHRoaXMsIG9wdGlvbik7XG4gICAgdGhpcy5vcHRpb25TZWxlY3RlZC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhcmlhLWxhYmVsbGVkYnkgZm9yIHRoZSBhdXRvY29tcGxldGUgcGFuZWwuICovXG4gIF9nZXRQYW5lbEFyaWFMYWJlbGxlZGJ5KGxhYmVsSWQ6IHN0cmluZyB8IG51bGwpOiBzdHJpbmcgfCBudWxsIHtcbiAgICBpZiAodGhpcy5hcmlhTGFiZWwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGxhYmVsRXhwcmVzc2lvbiA9IGxhYmVsSWQgPyBsYWJlbElkICsgJyAnIDogJyc7XG4gICAgcmV0dXJuIHRoaXMuYXJpYUxhYmVsbGVkYnkgPyBsYWJlbEV4cHJlc3Npb24gKyB0aGlzLmFyaWFMYWJlbGxlZGJ5IDogbGFiZWxJZDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBhdXRvY29tcGxldGUgdmlzaWJpbGl0eSBjbGFzc2VzIG9uIGEgY2xhc3NsaXN0IGJhc2VkIG9uIHRoZSBwYW5lbCBpcyB2aXNpYmxlLiAqL1xuICBwcml2YXRlIF9zZXRWaXNpYmlsaXR5Q2xhc3NlcyhjbGFzc0xpc3Q6IHtba2V5OiBzdHJpbmddOiBib29sZWFufSkge1xuICAgIGNsYXNzTGlzdFt0aGlzLl92aXNpYmxlQ2xhc3NdID0gdGhpcy5zaG93UGFuZWw7XG4gICAgY2xhc3NMaXN0W3RoaXMuX2hpZGRlbkNsYXNzXSA9ICF0aGlzLnNob3dQYW5lbDtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSB0aGVtaW5nIGNsYXNzZXMgb24gYSBjbGFzc2xpc3QgYmFzZWQgb24gdGhlIHRoZW1lIG9mIHRoZSBwYW5lbC4gKi9cbiAgcHJpdmF0ZSBfc2V0VGhlbWVDbGFzc2VzKGNsYXNzTGlzdDoge1trZXk6IHN0cmluZ106IGJvb2xlYW59KSB7XG4gICAgY2xhc3NMaXN0WydtYXQtcHJpbWFyeSddID0gdGhpcy5fY29sb3IgPT09ICdwcmltYXJ5JztcbiAgICBjbGFzc0xpc3RbJ21hdC13YXJuJ10gPSB0aGlzLl9jb2xvciA9PT0gJ3dhcm4nO1xuICAgIGNsYXNzTGlzdFsnbWF0LWFjY2VudCddID0gdGhpcy5fY29sb3IgPT09ICdhY2NlbnQnO1xuICB9XG5cbiAgLy8gYHNraXBQcmVkaWNhdGVgIGRldGVybWluZXMgaWYga2V5IG1hbmFnZXIgc2hvdWxkIGF2b2lkIHB1dHRpbmcgYSBnaXZlbiBvcHRpb24gaW4gdGhlIHRhYlxuICAvLyBvcmRlci4gQWxsb3cgZGlzYWJsZWQgbGlzdCBpdGVtcyB0byByZWNlaXZlIGZvY3VzIHZpYSBrZXlib2FyZCB0byBhbGlnbiB3aXRoIFdBSSBBUklBXG4gIC8vIHJlY29tbWVuZGF0aW9uLlxuICAvL1xuICAvLyBOb3JtYWxseSBXQUkgQVJJQSdzIGluc3RydWN0aW9ucyBhcmUgdG8gZXhjbHVkZSBkaXNhYmxlZCBpdGVtcyBmcm9tIHRoZSB0YWIgb3JkZXIsIGJ1dCBpdFxuICAvLyBtYWtlcyBhIGZldyBleGNlcHRpb25zIGZvciBjb21wb3VuZCB3aWRnZXRzLlxuICAvL1xuICAvLyBGcm9tIFtEZXZlbG9waW5nIGEgS2V5Ym9hcmQgSW50ZXJmYWNlXShcbiAgLy8gaHR0cHM6Ly93d3cudzMub3JnL1dBSS9BUklBL2FwZy9wcmFjdGljZXMva2V5Ym9hcmQtaW50ZXJmYWNlLyk6XG4gIC8vICAgXCJGb3IgdGhlIGZvbGxvd2luZyBjb21wb3NpdGUgd2lkZ2V0IGVsZW1lbnRzLCBrZWVwIHRoZW0gZm9jdXNhYmxlIHdoZW4gZGlzYWJsZWQ6IE9wdGlvbnMgaW4gYVxuICAvLyAgIExpc3Rib3guLi5cIlxuICAvL1xuICAvLyBUaGUgdXNlciBjYW4gZm9jdXMgZGlzYWJsZWQgb3B0aW9ucyB1c2luZyB0aGUga2V5Ym9hcmQsIGJ1dCB0aGUgdXNlciBjYW5ub3QgY2xpY2sgZGlzYWJsZWRcbiAgLy8gb3B0aW9ucy5cbiAgcHJvdGVjdGVkIF9za2lwUHJlZGljYXRlKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiPG5nLXRlbXBsYXRlIGxldC1mb3JtRmllbGRJZD1cImlkXCI+XG4gIDxkaXZcbiAgICBjbGFzcz1cIm1hdC1tZGMtYXV0b2NvbXBsZXRlLXBhbmVsIG1kYy1tZW51LXN1cmZhY2UgbWRjLW1lbnUtc3VyZmFjZS0tb3BlblwiXG4gICAgcm9sZT1cImxpc3Rib3hcIlxuICAgIFtpZF09XCJpZFwiXG4gICAgW25nQ2xhc3NdPVwiX2NsYXNzTGlzdFwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWwgfHwgbnVsbFwiXG4gICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cIl9nZXRQYW5lbEFyaWFMYWJlbGxlZGJ5KGZvcm1GaWVsZElkKVwiXG4gICAgW0BwYW5lbEFuaW1hdGlvbl09XCJpc09wZW4gPyAndmlzaWJsZScgOiAnaGlkZGVuJ1wiXG4gICAgKEBwYW5lbEFuaW1hdGlvbi5kb25lKT1cIl9hbmltYXRpb25Eb25lLm5leHQoJGV2ZW50KVwiXG4gICAgI3BhbmVsPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgPC9kaXY+XG48L25nLXRlbXBsYXRlPlxuIl19
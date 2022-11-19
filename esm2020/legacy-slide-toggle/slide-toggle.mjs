/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, forwardRef, Inject, Optional, ViewChild, ViewEncapsulation, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { MAT_LEGACY_SLIDE_TOGGLE_DEFAULT_OPTIONS, } from './slide-toggle-config';
import { _MatSlideToggleBase } from '@angular/material/slide-toggle';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/a11y";
import * as i2 from "@angular/material/core";
import * as i3 from "@angular/cdk/observers";
/**
 * @docs-private
 * @deprecated Use `MAT_SLIDE_TOGGLE_VALUE_ACCESSOR` from `@angular/material/slide-toggle` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export const MAT_LEGACY_SLIDE_TOGGLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MatLegacySlideToggle),
    multi: true,
};
/**
 * Change event object emitted by a slide toggle.
 * @deprecated Use `MatSlideToggleChange` from `@angular/material/slide-toggle` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacySlideToggleChange {
    constructor(
    /** The source slide toggle of the event. */
    source, 
    /** The new `checked` value of the slide toggle. */
    checked) {
        this.source = source;
        this.checked = checked;
    }
}
/**
 * Represents a slidable "switch" toggle that can be moved between on and off.
 * @deprecated Use `MatSlideToggle` from `@angular/material/slide-toggle` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacySlideToggle extends _MatSlideToggleBase {
    constructor(elementRef, focusMonitor, changeDetectorRef, tabIndex, defaults, animationMode) {
        super(elementRef, focusMonitor, changeDetectorRef, tabIndex, defaults, animationMode, 'mat-slide-toggle-');
    }
    _createChangeEvent(isChecked) {
        return new MatLegacySlideToggleChange(this, isChecked);
    }
    /** Method being called whenever the underlying input emits a change event. */
    _onChangeEvent(event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the component's `change` output.
        event.stopPropagation();
        this.toggleChange.emit();
        // When the slide toggle's config disables toggle change event by setting
        // `disableToggleValue: true`, the slide toggle's value does not change, and the
        // checked state of the underlying input needs to be changed back.
        if (this.defaults.disableToggleValue) {
            this._inputElement.nativeElement.checked = this.checked;
            return;
        }
        // Sync the value from the underlying input element with the component instance.
        this.checked = this._inputElement.nativeElement.checked;
        // Emit our custom change event only if the underlying input emitted one. This ensures that
        // there is no change event, when the checked state changes programmatically.
        this._emitChangeEvent();
    }
    /** Method being called whenever the slide-toggle has been clicked. */
    _onInputClick(event) {
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    }
    /** Focuses the slide-toggle. */
    focus(options, origin) {
        if (origin) {
            this._focusMonitor.focusVia(this._inputElement, origin, options);
        }
        else {
            this._inputElement.nativeElement.focus(options);
        }
    }
    /** Method being called whenever the label text changes. */
    _onLabelTextChange() {
        // Since the event of the `cdkObserveContent` directive runs outside of the zone, the
        // slide-toggle component will be only marked for check, but no actual change detection runs
        // automatically. Instead of going back into the zone in order to trigger a change detection
        // which causes *all* components to be checked (if explicitly marked or not using OnPush),
        // we only trigger an explicit change detection for the slide-toggle view and its children.
        this._changeDetectorRef.detectChanges();
    }
}
MatLegacySlideToggle.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatLegacySlideToggle, deps: [{ token: i0.ElementRef }, { token: i1.FocusMonitor }, { token: i0.ChangeDetectorRef }, { token: 'tabindex', attribute: true }, { token: MAT_LEGACY_SLIDE_TOGGLE_DEFAULT_OPTIONS }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatLegacySlideToggle.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.0.0", type: MatLegacySlideToggle, selector: "mat-slide-toggle", inputs: { disabled: "disabled", disableRipple: "disableRipple", color: "color", tabIndex: "tabIndex" }, host: { properties: { "id": "id", "attr.tabindex": "null", "attr.aria-label": "null", "attr.aria-labelledby": "null", "attr.name": "null", "class.mat-checked": "checked", "class.mat-disabled": "disabled", "class.mat-slide-toggle-label-before": "labelPosition == \"before\"", "class._mat-animation-noopable": "_noopAnimations" }, classAttribute: "mat-slide-toggle" }, providers: [MAT_LEGACY_SLIDE_TOGGLE_VALUE_ACCESSOR], viewQueries: [{ propertyName: "_inputElement", first: true, predicate: ["input"], descendants: true }], exportAs: ["matSlideToggle"], usesInheritance: true, ngImport: i0, template: "<label [attr.for]=\"inputId\" class=\"mat-slide-toggle-label\" #label>\n  <span class=\"mat-slide-toggle-bar\"\n       [class.mat-slide-toggle-bar-no-side-margin]=\"!labelContent.textContent || !labelContent.textContent.trim()\">\n\n    <input #input class=\"mat-slide-toggle-input cdk-visually-hidden\" type=\"checkbox\"\n           role=\"switch\"\n           [id]=\"inputId\"\n           [required]=\"required\"\n           [tabIndex]=\"tabIndex\"\n           [checked]=\"checked\"\n           [disabled]=\"disabled\"\n           [attr.name]=\"name\"\n           [attr.aria-checked]=\"checked\"\n           [attr.aria-label]=\"ariaLabel\"\n           [attr.aria-labelledby]=\"ariaLabelledby\"\n           [attr.aria-describedby]=\"ariaDescribedby\"\n           (change)=\"_onChangeEvent($event)\"\n           (click)=\"_onInputClick($event)\">\n\n    <span class=\"mat-slide-toggle-thumb-container\">\n      <span class=\"mat-slide-toggle-thumb\"></span>\n      <span class=\"mat-slide-toggle-ripple mat-focus-indicator\" mat-ripple\n           [matRippleTrigger]=\"label\"\n           [matRippleDisabled]=\"disableRipple || disabled\"\n           [matRippleCentered]=\"true\"\n           [matRippleRadius]=\"20\"\n           [matRippleAnimation]=\"{enterDuration: _noopAnimations ? 0 : 150}\">\n\n        <span class=\"mat-ripple-element mat-slide-toggle-persistent-ripple\"></span>\n      </span>\n    </span>\n\n  </span>\n\n  <span class=\"mat-slide-toggle-content\" #labelContent (cdkObserveContent)=\"_onLabelTextChange()\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </span>\n</label>\n", styles: [".mat-slide-toggle{display:inline-block;height:24px;max-width:100%;line-height:24px;white-space:nowrap;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(16px, 0, 0)}[dir=rtl] .mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(-16px, 0, 0)}.mat-slide-toggle.mat-disabled{opacity:.38}.mat-slide-toggle.mat-disabled .mat-slide-toggle-label,.mat-slide-toggle.mat-disabled .mat-slide-toggle-thumb-container{cursor:default}.mat-slide-toggle-label{-webkit-user-select:none;user-select:none;display:flex;flex:1;flex-direction:row;align-items:center;height:inherit;cursor:pointer}.mat-slide-toggle-content{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-slide-toggle-label-before .mat-slide-toggle-label{order:1}.mat-slide-toggle-label-before .mat-slide-toggle-bar{order:2}[dir=rtl] .mat-slide-toggle-label-before .mat-slide-toggle-bar,.mat-slide-toggle-bar{margin-right:8px;margin-left:0}[dir=rtl] .mat-slide-toggle-bar,.mat-slide-toggle-label-before .mat-slide-toggle-bar{margin-left:8px;margin-right:0}.mat-slide-toggle-bar-no-side-margin{margin-left:0;margin-right:0}.mat-slide-toggle-thumb-container{position:absolute;z-index:1;width:20px;height:20px;top:-3px;left:0;transform:translate3d(0, 0, 0);transition:all 80ms linear;transition-property:transform}._mat-animation-noopable .mat-slide-toggle-thumb-container{transition:none}[dir=rtl] .mat-slide-toggle-thumb-container{left:auto;right:0}.mat-slide-toggle-thumb{height:20px;width:20px;border-radius:50%;display:block}.mat-slide-toggle-bar{position:relative;width:36px;height:14px;flex-shrink:0;border-radius:8px}.mat-slide-toggle-input{bottom:0;left:10px}[dir=rtl] .mat-slide-toggle-input{left:auto;right:10px}.mat-slide-toggle-bar,.mat-slide-toggle-thumb{transition:all 80ms linear;transition-property:background-color;transition-delay:50ms}._mat-animation-noopable .mat-slide-toggle-bar,._mat-animation-noopable .mat-slide-toggle-thumb{transition:none}.mat-slide-toggle .mat-slide-toggle-ripple{position:absolute;top:calc(50% - 20px);left:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.mat-slide-toggle .mat-slide-toggle-ripple .mat-ripple-element:not(.mat-slide-toggle-persistent-ripple){opacity:.12}.mat-slide-toggle-persistent-ripple{width:100%;height:100%;transform:none}.mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{opacity:.04}.mat-slide-toggle:not(.mat-disabled).cdk-keyboard-focused .mat-slide-toggle-persistent-ripple{opacity:.12}.mat-slide-toggle-persistent-ripple,.mat-slide-toggle.mat-disabled .mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{opacity:0}@media(hover: none){.mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{display:none}}.mat-slide-toggle-input:focus~.mat-slide-toggle-thumb-container .mat-focus-indicator::before{content:\"\"}.cdk-high-contrast-active .mat-slide-toggle-thumb,.cdk-high-contrast-active .mat-slide-toggle-bar{border:1px solid}"], dependencies: [{ kind: "directive", type: i2.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { kind: "directive", type: i3.CdkObserveContent, selector: "[cdkObserveContent]", inputs: ["cdkObserveContentDisabled", "debounce"], outputs: ["cdkObserveContent"], exportAs: ["cdkObserveContent"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.0.0", ngImport: i0, type: MatLegacySlideToggle, decorators: [{
            type: Component,
            args: [{ selector: 'mat-slide-toggle', exportAs: 'matSlideToggle', host: {
                        'class': 'mat-slide-toggle',
                        '[id]': 'id',
                        // Needs to be removed since it causes some a11y issues (see #21266).
                        '[attr.tabindex]': 'null',
                        '[attr.aria-label]': 'null',
                        '[attr.aria-labelledby]': 'null',
                        '[attr.name]': 'null',
                        '[class.mat-checked]': 'checked',
                        '[class.mat-disabled]': 'disabled',
                        '[class.mat-slide-toggle-label-before]': 'labelPosition == "before"',
                        '[class._mat-animation-noopable]': '_noopAnimations',
                    }, providers: [MAT_LEGACY_SLIDE_TOGGLE_VALUE_ACCESSOR], inputs: ['disabled', 'disableRipple', 'color', 'tabIndex'], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, template: "<label [attr.for]=\"inputId\" class=\"mat-slide-toggle-label\" #label>\n  <span class=\"mat-slide-toggle-bar\"\n       [class.mat-slide-toggle-bar-no-side-margin]=\"!labelContent.textContent || !labelContent.textContent.trim()\">\n\n    <input #input class=\"mat-slide-toggle-input cdk-visually-hidden\" type=\"checkbox\"\n           role=\"switch\"\n           [id]=\"inputId\"\n           [required]=\"required\"\n           [tabIndex]=\"tabIndex\"\n           [checked]=\"checked\"\n           [disabled]=\"disabled\"\n           [attr.name]=\"name\"\n           [attr.aria-checked]=\"checked\"\n           [attr.aria-label]=\"ariaLabel\"\n           [attr.aria-labelledby]=\"ariaLabelledby\"\n           [attr.aria-describedby]=\"ariaDescribedby\"\n           (change)=\"_onChangeEvent($event)\"\n           (click)=\"_onInputClick($event)\">\n\n    <span class=\"mat-slide-toggle-thumb-container\">\n      <span class=\"mat-slide-toggle-thumb\"></span>\n      <span class=\"mat-slide-toggle-ripple mat-focus-indicator\" mat-ripple\n           [matRippleTrigger]=\"label\"\n           [matRippleDisabled]=\"disableRipple || disabled\"\n           [matRippleCentered]=\"true\"\n           [matRippleRadius]=\"20\"\n           [matRippleAnimation]=\"{enterDuration: _noopAnimations ? 0 : 150}\">\n\n        <span class=\"mat-ripple-element mat-slide-toggle-persistent-ripple\"></span>\n      </span>\n    </span>\n\n  </span>\n\n  <span class=\"mat-slide-toggle-content\" #labelContent (cdkObserveContent)=\"_onLabelTextChange()\">\n    <!-- Add an invisible span so JAWS can read the label -->\n    <span style=\"display:none\">&nbsp;</span>\n    <ng-content></ng-content>\n  </span>\n</label>\n", styles: [".mat-slide-toggle{display:inline-block;height:24px;max-width:100%;line-height:24px;white-space:nowrap;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(16px, 0, 0)}[dir=rtl] .mat-slide-toggle.mat-checked .mat-slide-toggle-thumb-container{transform:translate3d(-16px, 0, 0)}.mat-slide-toggle.mat-disabled{opacity:.38}.mat-slide-toggle.mat-disabled .mat-slide-toggle-label,.mat-slide-toggle.mat-disabled .mat-slide-toggle-thumb-container{cursor:default}.mat-slide-toggle-label{-webkit-user-select:none;user-select:none;display:flex;flex:1;flex-direction:row;align-items:center;height:inherit;cursor:pointer}.mat-slide-toggle-content{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-slide-toggle-label-before .mat-slide-toggle-label{order:1}.mat-slide-toggle-label-before .mat-slide-toggle-bar{order:2}[dir=rtl] .mat-slide-toggle-label-before .mat-slide-toggle-bar,.mat-slide-toggle-bar{margin-right:8px;margin-left:0}[dir=rtl] .mat-slide-toggle-bar,.mat-slide-toggle-label-before .mat-slide-toggle-bar{margin-left:8px;margin-right:0}.mat-slide-toggle-bar-no-side-margin{margin-left:0;margin-right:0}.mat-slide-toggle-thumb-container{position:absolute;z-index:1;width:20px;height:20px;top:-3px;left:0;transform:translate3d(0, 0, 0);transition:all 80ms linear;transition-property:transform}._mat-animation-noopable .mat-slide-toggle-thumb-container{transition:none}[dir=rtl] .mat-slide-toggle-thumb-container{left:auto;right:0}.mat-slide-toggle-thumb{height:20px;width:20px;border-radius:50%;display:block}.mat-slide-toggle-bar{position:relative;width:36px;height:14px;flex-shrink:0;border-radius:8px}.mat-slide-toggle-input{bottom:0;left:10px}[dir=rtl] .mat-slide-toggle-input{left:auto;right:10px}.mat-slide-toggle-bar,.mat-slide-toggle-thumb{transition:all 80ms linear;transition-property:background-color;transition-delay:50ms}._mat-animation-noopable .mat-slide-toggle-bar,._mat-animation-noopable .mat-slide-toggle-thumb{transition:none}.mat-slide-toggle .mat-slide-toggle-ripple{position:absolute;top:calc(50% - 20px);left:calc(50% - 20px);height:40px;width:40px;z-index:1;pointer-events:none}.mat-slide-toggle .mat-slide-toggle-ripple .mat-ripple-element:not(.mat-slide-toggle-persistent-ripple){opacity:.12}.mat-slide-toggle-persistent-ripple{width:100%;height:100%;transform:none}.mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{opacity:.04}.mat-slide-toggle:not(.mat-disabled).cdk-keyboard-focused .mat-slide-toggle-persistent-ripple{opacity:.12}.mat-slide-toggle-persistent-ripple,.mat-slide-toggle.mat-disabled .mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{opacity:0}@media(hover: none){.mat-slide-toggle-bar:hover .mat-slide-toggle-persistent-ripple{display:none}}.mat-slide-toggle-input:focus~.mat-slide-toggle-thumb-container .mat-focus-indicator::before{content:\"\"}.cdk-high-contrast-active .mat-slide-toggle-thumb,.cdk-high-contrast-active .mat-slide-toggle-bar{border:1px solid}"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.FocusMonitor }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_LEGACY_SLIDE_TOGGLE_DEFAULT_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { _inputElement: [{
                type: ViewChild,
                args: ['input']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGUtdG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1zbGlkZS10b2dnbGUvc2xpZGUtdG9nZ2xlLnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1zbGlkZS10b2dnbGUvc2xpZGUtdG9nZ2xlLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFlBQVksRUFBYyxNQUFNLG1CQUFtQixDQUFDO0FBQzVELE9BQU8sRUFDTCxTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUNSLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDakQsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7QUFDM0UsT0FBTyxFQUNMLHVDQUF1QyxHQUV4QyxNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGdDQUFnQyxDQUFDOzs7OztBQUVuRTs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sc0NBQXNDLEdBQUc7SUFDcEQsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLG9CQUFvQixDQUFDO0lBQ25ELEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQUVGOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sMEJBQTBCO0lBQ3JDO0lBQ0UsNENBQTRDO0lBQ3JDLE1BQTRCO0lBQ25DLG1EQUFtRDtJQUM1QyxPQUFnQjtRQUZoQixXQUFNLEdBQU4sTUFBTSxDQUFzQjtRQUU1QixZQUFPLEdBQVAsT0FB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QUFVLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsaUJBQzNDLGlCQUFpQixDQUFDLElBQUksbUJBQ3BCLHVCQUF1QixDQUFDLE1BQU07OzBCQVU1QyxTQUFTOzJCQUFDLFVBQVU7OzBCQUNwQixNQUFNOzJCQUFDLHVDQUF1Qzs7MEJBRTlDLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzRDQVR2QixhQUFhO3NCQUFoQyxTQUFTO3VCQUFDLE9BQU8iLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtGb2N1c01vbml0b3IsIEZvY3VzT3JpZ2lufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge1xuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIE9wdGlvbmFsLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7QU5JTUFUSU9OX01PRFVMRV9UWVBFfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtcbiAgTUFUX0xFR0FDWV9TTElERV9UT0dHTEVfREVGQVVMVF9PUFRJT05TLFxuICBNYXRMZWdhY3lTbGlkZVRvZ2dsZURlZmF1bHRPcHRpb25zLFxufSBmcm9tICcuL3NsaWRlLXRvZ2dsZS1jb25maWcnO1xuaW1wb3J0IHtfTWF0U2xpZGVUb2dnbGVCYXNlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zbGlkZS10b2dnbGUnO1xuXG4vKipcbiAqIEBkb2NzLXByaXZhdGVcbiAqIEBkZXByZWNhdGVkIFVzZSBgTUFUX1NMSURFX1RPR0dMRV9WQUxVRV9BQ0NFU1NPUmAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvc2xpZGUtdG9nZ2xlYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjb25zdCBNQVRfTEVHQUNZX1NMSURFX1RPR0dMRV9WQUxVRV9BQ0NFU1NPUiA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE1hdExlZ2FjeVNsaWRlVG9nZ2xlKSxcbiAgbXVsdGk6IHRydWUsXG59O1xuXG4vKipcbiAqIENoYW5nZSBldmVudCBvYmplY3QgZW1pdHRlZCBieSBhIHNsaWRlIHRvZ2dsZS5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0U2xpZGVUb2dnbGVDaGFuZ2VgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3NsaWRlLXRvZ2dsZWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5leHBvcnQgY2xhc3MgTWF0TGVnYWN5U2xpZGVUb2dnbGVDaGFuZ2Uge1xuICBjb25zdHJ1Y3RvcihcbiAgICAvKiogVGhlIHNvdXJjZSBzbGlkZSB0b2dnbGUgb2YgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyBzb3VyY2U6IE1hdExlZ2FjeVNsaWRlVG9nZ2xlLFxuICAgIC8qKiBUaGUgbmV3IGBjaGVja2VkYCB2YWx1ZSBvZiB0aGUgc2xpZGUgdG9nZ2xlLiAqL1xuICAgIHB1YmxpYyBjaGVja2VkOiBib29sZWFuLFxuICApIHt9XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHNsaWRhYmxlIFwic3dpdGNoXCIgdG9nZ2xlIHRoYXQgY2FuIGJlIG1vdmVkIGJldHdlZW4gb24gYW5kIG9mZi5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0U2xpZGVUb2dnbGVgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3NsaWRlLXRvZ2dsZWAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdtYXQtc2xpZGUtdG9nZ2xlJyxcbiAgZXhwb3J0QXM6ICdtYXRTbGlkZVRvZ2dsZScsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnbWF0LXNsaWRlLXRvZ2dsZScsXG4gICAgJ1tpZF0nOiAnaWQnLFxuICAgIC8vIE5lZWRzIHRvIGJlIHJlbW92ZWQgc2luY2UgaXQgY2F1c2VzIHNvbWUgYTExeSBpc3N1ZXMgKHNlZSAjMjEyNjYpLlxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtbGFiZWxdJzogJ251bGwnLFxuICAgICdbYXR0ci5hcmlhLWxhYmVsbGVkYnldJzogJ251bGwnLFxuICAgICdbYXR0ci5uYW1lXSc6ICdudWxsJyxcbiAgICAnW2NsYXNzLm1hdC1jaGVja2VkXSc6ICdjaGVja2VkJyxcbiAgICAnW2NsYXNzLm1hdC1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LXNsaWRlLXRvZ2dsZS1sYWJlbC1iZWZvcmVdJzogJ2xhYmVsUG9zaXRpb24gPT0gXCJiZWZvcmVcIicsXG4gICAgJ1tjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV0nOiAnX25vb3BBbmltYXRpb25zJyxcbiAgfSxcbiAgdGVtcGxhdGVVcmw6ICdzbGlkZS10b2dnbGUuaHRtbCcsXG4gIHN0eWxlVXJsczogWydzbGlkZS10b2dnbGUuY3NzJ10sXG4gIHByb3ZpZGVyczogW01BVF9MRUdBQ1lfU0xJREVfVE9HR0xFX1ZBTFVFX0FDQ0VTU09SXSxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ2Rpc2FibGVSaXBwbGUnLCAnY29sb3InLCAndGFiSW5kZXgnXSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeVNsaWRlVG9nZ2xlIGV4dGVuZHMgX01hdFNsaWRlVG9nZ2xlQmFzZTxNYXRMZWdhY3lTbGlkZVRvZ2dsZUNoYW5nZT4ge1xuICAvKiogUmVmZXJlbmNlIHRvIHRoZSB1bmRlcmx5aW5nIGlucHV0IGVsZW1lbnQuICovXG4gIEBWaWV3Q2hpbGQoJ2lucHV0JykgX2lucHV0RWxlbWVudDogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIGZvY3VzTW9uaXRvcjogRm9jdXNNb25pdG9yLFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICAgQEluamVjdChNQVRfTEVHQUNZX1NMSURFX1RPR0dMRV9ERUZBVUxUX09QVElPTlMpXG4gICAgZGVmYXVsdHM6IE1hdExlZ2FjeVNsaWRlVG9nZ2xlRGVmYXVsdE9wdGlvbnMsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKFxuICAgICAgZWxlbWVudFJlZixcbiAgICAgIGZvY3VzTW9uaXRvcixcbiAgICAgIGNoYW5nZURldGVjdG9yUmVmLFxuICAgICAgdGFiSW5kZXgsXG4gICAgICBkZWZhdWx0cyxcbiAgICAgIGFuaW1hdGlvbk1vZGUsXG4gICAgICAnbWF0LXNsaWRlLXRvZ2dsZS0nLFxuICAgICk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NyZWF0ZUNoYW5nZUV2ZW50KGlzQ2hlY2tlZDogYm9vbGVhbikge1xuICAgIHJldHVybiBuZXcgTWF0TGVnYWN5U2xpZGVUb2dnbGVDaGFuZ2UodGhpcywgaXNDaGVja2VkKTtcbiAgfVxuXG4gIC8qKiBNZXRob2QgYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSB1bmRlcmx5aW5nIGlucHV0IGVtaXRzIGEgY2hhbmdlIGV2ZW50LiAqL1xuICBfb25DaGFuZ2VFdmVudChldmVudDogRXZlbnQpIHtcbiAgICAvLyBXZSBhbHdheXMgaGF2ZSB0byBzdG9wIHByb3BhZ2F0aW9uIG9uIHRoZSBjaGFuZ2UgZXZlbnQuXG4gICAgLy8gT3RoZXJ3aXNlIHRoZSBjaGFuZ2UgZXZlbnQsIGZyb20gdGhlIGlucHV0IGVsZW1lbnQsIHdpbGwgYnViYmxlIHVwIGFuZFxuICAgIC8vIGVtaXQgaXRzIGV2ZW50IG9iamVjdCB0byB0aGUgY29tcG9uZW50J3MgYGNoYW5nZWAgb3V0cHV0LlxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHRoaXMudG9nZ2xlQ2hhbmdlLmVtaXQoKTtcblxuICAgIC8vIFdoZW4gdGhlIHNsaWRlIHRvZ2dsZSdzIGNvbmZpZyBkaXNhYmxlcyB0b2dnbGUgY2hhbmdlIGV2ZW50IGJ5IHNldHRpbmdcbiAgICAvLyBgZGlzYWJsZVRvZ2dsZVZhbHVlOiB0cnVlYCwgdGhlIHNsaWRlIHRvZ2dsZSdzIHZhbHVlIGRvZXMgbm90IGNoYW5nZSwgYW5kIHRoZVxuICAgIC8vIGNoZWNrZWQgc3RhdGUgb2YgdGhlIHVuZGVybHlpbmcgaW5wdXQgbmVlZHMgdG8gYmUgY2hhbmdlZCBiYWNrLlxuICAgIGlmICh0aGlzLmRlZmF1bHRzLmRpc2FibGVUb2dnbGVWYWx1ZSkge1xuICAgICAgdGhpcy5faW5wdXRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuY2hlY2tlZCA9IHRoaXMuY2hlY2tlZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBTeW5jIHRoZSB2YWx1ZSBmcm9tIHRoZSB1bmRlcmx5aW5nIGlucHV0IGVsZW1lbnQgd2l0aCB0aGUgY29tcG9uZW50IGluc3RhbmNlLlxuICAgIHRoaXMuY2hlY2tlZCA9IHRoaXMuX2lucHV0RWxlbWVudC5uYXRpdmVFbGVtZW50LmNoZWNrZWQ7XG5cbiAgICAvLyBFbWl0IG91ciBjdXN0b20gY2hhbmdlIGV2ZW50IG9ubHkgaWYgdGhlIHVuZGVybHlpbmcgaW5wdXQgZW1pdHRlZCBvbmUuIFRoaXMgZW5zdXJlcyB0aGF0XG4gICAgLy8gdGhlcmUgaXMgbm8gY2hhbmdlIGV2ZW50LCB3aGVuIHRoZSBjaGVja2VkIHN0YXRlIGNoYW5nZXMgcHJvZ3JhbW1hdGljYWxseS5cbiAgICB0aGlzLl9lbWl0Q2hhbmdlRXZlbnQoKTtcbiAgfVxuXG4gIC8qKiBNZXRob2QgYmVpbmcgY2FsbGVkIHdoZW5ldmVyIHRoZSBzbGlkZS10b2dnbGUgaGFzIGJlZW4gY2xpY2tlZC4gKi9cbiAgX29uSW5wdXRDbGljayhldmVudDogRXZlbnQpIHtcbiAgICAvLyBXZSBoYXZlIHRvIHN0b3AgcHJvcGFnYXRpb24gZm9yIGNsaWNrIGV2ZW50cyBvbiB0aGUgdmlzdWFsIGhpZGRlbiBpbnB1dCBlbGVtZW50LlxuICAgIC8vIEJ5IGRlZmF1bHQsIHdoZW4gYSB1c2VyIGNsaWNrcyBvbiBhIGxhYmVsIGVsZW1lbnQsIGEgZ2VuZXJhdGVkIGNsaWNrIGV2ZW50IHdpbGwgYmVcbiAgICAvLyBkaXNwYXRjaGVkIG9uIHRoZSBhc3NvY2lhdGVkIGlucHV0IGVsZW1lbnQuIFNpbmNlIHdlIGFyZSB1c2luZyBhIGxhYmVsIGVsZW1lbnQgYXMgb3VyXG4gICAgLy8gcm9vdCBjb250YWluZXIsIHRoZSBjbGljayBldmVudCBvbiB0aGUgYHNsaWRlLXRvZ2dsZWAgd2lsbCBiZSBleGVjdXRlZCB0d2ljZS5cbiAgICAvLyBUaGUgcmVhbCBjbGljayBldmVudCB3aWxsIGJ1YmJsZSB1cCwgYW5kIHRoZSBnZW5lcmF0ZWQgY2xpY2sgZXZlbnQgYWxzbyB0cmllcyB0byBidWJibGUgdXAuXG4gICAgLy8gVGhpcyB3aWxsIGxlYWQgdG8gbXVsdGlwbGUgY2xpY2sgZXZlbnRzLlxuICAgIC8vIFByZXZlbnRpbmcgYnViYmxpbmcgZm9yIHRoZSBzZWNvbmQgZXZlbnQgd2lsbCBzb2x2ZSB0aGF0IGlzc3VlLlxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICB9XG5cbiAgLyoqIEZvY3VzZXMgdGhlIHNsaWRlLXRvZ2dsZS4gKi9cbiAgZm9jdXMob3B0aW9ucz86IEZvY3VzT3B0aW9ucywgb3JpZ2luPzogRm9jdXNPcmlnaW4pOiB2b2lkIHtcbiAgICBpZiAob3JpZ2luKSB7XG4gICAgICB0aGlzLl9mb2N1c01vbml0b3IuZm9jdXNWaWEodGhpcy5faW5wdXRFbGVtZW50LCBvcmlnaW4sIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pbnB1dEVsZW1lbnQubmF0aXZlRWxlbWVudC5mb2N1cyhvcHRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKiogTWV0aG9kIGJlaW5nIGNhbGxlZCB3aGVuZXZlciB0aGUgbGFiZWwgdGV4dCBjaGFuZ2VzLiAqL1xuICBfb25MYWJlbFRleHRDaGFuZ2UoKSB7XG4gICAgLy8gU2luY2UgdGhlIGV2ZW50IG9mIHRoZSBgY2RrT2JzZXJ2ZUNvbnRlbnRgIGRpcmVjdGl2ZSBydW5zIG91dHNpZGUgb2YgdGhlIHpvbmUsIHRoZVxuICAgIC8vIHNsaWRlLXRvZ2dsZSBjb21wb25lbnQgd2lsbCBiZSBvbmx5IG1hcmtlZCBmb3IgY2hlY2ssIGJ1dCBubyBhY3R1YWwgY2hhbmdlIGRldGVjdGlvbiBydW5zXG4gICAgLy8gYXV0b21hdGljYWxseS4gSW5zdGVhZCBvZiBnb2luZyBiYWNrIGludG8gdGhlIHpvbmUgaW4gb3JkZXIgdG8gdHJpZ2dlciBhIGNoYW5nZSBkZXRlY3Rpb25cbiAgICAvLyB3aGljaCBjYXVzZXMgKmFsbCogY29tcG9uZW50cyB0byBiZSBjaGVja2VkIChpZiBleHBsaWNpdGx5IG1hcmtlZCBvciBub3QgdXNpbmcgT25QdXNoKSxcbiAgICAvLyB3ZSBvbmx5IHRyaWdnZXIgYW4gZXhwbGljaXQgY2hhbmdlIGRldGVjdGlvbiBmb3IgdGhlIHNsaWRlLXRvZ2dsZSB2aWV3IGFuZCBpdHMgY2hpbGRyZW4uXG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG59XG4iLCI8bGFiZWwgW2F0dHIuZm9yXT1cImlucHV0SWRcIiBjbGFzcz1cIm1hdC1zbGlkZS10b2dnbGUtbGFiZWxcIiAjbGFiZWw+XG4gIDxzcGFuIGNsYXNzPVwibWF0LXNsaWRlLXRvZ2dsZS1iYXJcIlxuICAgICAgIFtjbGFzcy5tYXQtc2xpZGUtdG9nZ2xlLWJhci1uby1zaWRlLW1hcmdpbl09XCIhbGFiZWxDb250ZW50LnRleHRDb250ZW50IHx8ICFsYWJlbENvbnRlbnQudGV4dENvbnRlbnQudHJpbSgpXCI+XG5cbiAgICA8aW5wdXQgI2lucHV0IGNsYXNzPVwibWF0LXNsaWRlLXRvZ2dsZS1pbnB1dCBjZGstdmlzdWFsbHktaGlkZGVuXCIgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgcm9sZT1cInN3aXRjaFwiXG4gICAgICAgICAgIFtpZF09XCJpbnB1dElkXCJcbiAgICAgICAgICAgW3JlcXVpcmVkXT1cInJlcXVpcmVkXCJcbiAgICAgICAgICAgW3RhYkluZGV4XT1cInRhYkluZGV4XCJcbiAgICAgICAgICAgW2NoZWNrZWRdPVwiY2hlY2tlZFwiXG4gICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgIFthdHRyLm5hbWVdPVwibmFtZVwiXG4gICAgICAgICAgIFthdHRyLmFyaWEtY2hlY2tlZF09XCJjaGVja2VkXCJcbiAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIlxuICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkYnlcIlxuICAgICAgICAgICBbYXR0ci5hcmlhLWRlc2NyaWJlZGJ5XT1cImFyaWFEZXNjcmliZWRieVwiXG4gICAgICAgICAgIChjaGFuZ2UpPVwiX29uQ2hhbmdlRXZlbnQoJGV2ZW50KVwiXG4gICAgICAgICAgIChjbGljayk9XCJfb25JbnB1dENsaWNrKCRldmVudClcIj5cblxuICAgIDxzcGFuIGNsYXNzPVwibWF0LXNsaWRlLXRvZ2dsZS10aHVtYi1jb250YWluZXJcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwibWF0LXNsaWRlLXRvZ2dsZS10aHVtYlwiPjwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwibWF0LXNsaWRlLXRvZ2dsZS1yaXBwbGUgbWF0LWZvY3VzLWluZGljYXRvclwiIG1hdC1yaXBwbGVcbiAgICAgICAgICAgW21hdFJpcHBsZVRyaWdnZXJdPVwibGFiZWxcIlxuICAgICAgICAgICBbbWF0UmlwcGxlRGlzYWJsZWRdPVwiZGlzYWJsZVJpcHBsZSB8fCBkaXNhYmxlZFwiXG4gICAgICAgICAgIFttYXRSaXBwbGVDZW50ZXJlZF09XCJ0cnVlXCJcbiAgICAgICAgICAgW21hdFJpcHBsZVJhZGl1c109XCIyMFwiXG4gICAgICAgICAgIFttYXRSaXBwbGVBbmltYXRpb25dPVwie2VudGVyRHVyYXRpb246IF9ub29wQW5pbWF0aW9ucyA/IDAgOiAxNTB9XCI+XG5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJtYXQtcmlwcGxlLWVsZW1lbnQgbWF0LXNsaWRlLXRvZ2dsZS1wZXJzaXN0ZW50LXJpcHBsZVwiPjwvc3Bhbj5cbiAgICAgIDwvc3Bhbj5cbiAgICA8L3NwYW4+XG5cbiAgPC9zcGFuPlxuXG4gIDxzcGFuIGNsYXNzPVwibWF0LXNsaWRlLXRvZ2dsZS1jb250ZW50XCIgI2xhYmVsQ29udGVudCAoY2RrT2JzZXJ2ZUNvbnRlbnQpPVwiX29uTGFiZWxUZXh0Q2hhbmdlKClcIj5cbiAgICA8IS0tIEFkZCBhbiBpbnZpc2libGUgc3BhbiBzbyBKQVdTIGNhbiByZWFkIHRoZSBsYWJlbCAtLT5cbiAgICA8c3BhbiBzdHlsZT1cImRpc3BsYXk6bm9uZVwiPiZuYnNwOzwvc3Bhbj5cbiAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gIDwvc3Bhbj5cbjwvbGFiZWw+XG4iXX0=
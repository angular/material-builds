/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '@angular/cdk/observers';
import '@angular/cdk/platform';
import { forwardRef } from '@angular/core';
import { applyCssTransform, mixinColor, mixinDisableRipple, mixinDisabled, mixinTabIndex } from '@angular/material/core';
import '@angular/platform-browser';
import '@angular/cdk/a11y';
import { __extends } from 'tslib';
import * as tslib_1 from 'tslib';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var MAT_SLIDE_TOGGLE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return MatSlideToggle; }),
    multi: true
};
/**
 * Change event object emitted by a MatSlideToggle.
 */
var MatSlideToggleChange = /** @class */ (function () {
    function MatSlideToggleChange() {
    }
    return MatSlideToggleChange;
}());
/**
 * \@docs-private
 */
var MatSlideToggleBase = /** @class */ (function () {
    function MatSlideToggleBase(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
    }
    return MatSlideToggleBase;
}());
var _MatSlideToggleMixinBase = mixinTabIndex(mixinColor(mixinDisableRipple(mixinDisabled(MatSlideToggleBase)), 'accent'));
/**
 * Represents a slidable "switch" toggle that can be moved between on and off.
 */
var MatSlideToggle = /** @class */ (function (_super) {
    __extends(MatSlideToggle, _super);
    function MatSlideToggle(elementRef, renderer, _platform, _focusMonitor, _changeDetectorRef, tabIndex) {
        var _this = _super.call(this, renderer, elementRef) || this;
        _this._platform = _platform;
        _this._focusMonitor = _focusMonitor;
        _this._changeDetectorRef = _changeDetectorRef;
        _this.tabIndex = parseInt(tabIndex) || 0;
        return _this;
    }
    Object.defineProperty(MatSlideToggle.prototype, "required", {
        get: /**
         * Whether the slide-toggle is required.
         * @return {?}
         */
        function () { return this._required; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) { this._required = coerceBooleanProperty(value); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlideToggle.prototype, "checked", {
        get: /**
         * Whether the slide-toggle element is checked or not
         * @return {?}
         */
        function () { return this._checked; },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._checked = coerceBooleanProperty(value);
            this._changeDetectorRef.markForCheck();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatSlideToggle.prototype, "inputId", {
        /** Returns the unique id for the visual hidden input. */
        get: /**
         * Returns the unique id for the visual hidden input.
         * @return {?}
         */
        function () { return (this.id || this._uniqueId) + "-input"; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    MatSlideToggle.prototype.ngAfterContentInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        this._slideRenderer = new SlideToggleRenderer(this._elementRef, this._platform);
        this._focusMonitor.monitor(this._inputElement.nativeElement, false)
            .subscribe(function (focusOrigin) { return _this._onInputFocusChange(focusOrigin); });
    };
    /**
     * @return {?}
     */
    MatSlideToggle.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this._focusMonitor.stopMonitoring(this._inputElement.nativeElement);
    };
    /**
     * This function will called if the underlying input changed its value through user interaction.
     */
    /**
     * This function will called if the underlying input changed its value through user interaction.
     * @param {?} event
     * @return {?}
     */
    MatSlideToggle.prototype._onChangeEvent = /**
     * This function will called if the underlying input changed its value through user interaction.
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // We always have to stop propagation on the change event.
        // Otherwise the change event, from the input element, will bubble up and
        // emit its event object to the component's `change` output.
        event.stopPropagation();
        // Sync the value from the underlying input element with the slide-toggle component.
        this.checked = this._inputElement.nativeElement.checked;
        // Emit our custom change event if the native input emitted one.
        // It is important to only emit it, if the native input triggered one, because we don't want
        // to trigger a change event, when the `checked` variable changes programmatically.
        this._emitChangeEvent();
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MatSlideToggle.prototype._onInputClick = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        // In some situations the user will release the mouse on the label element. The label element
        // redirects the click to the underlying input element and will result in a value change.
        // Prevent the default behavior if dragging, because the value will be set after drag.
        if (this._slideRenderer.dragging) {
            event.preventDefault();
        }
        // We have to stop propagation for click events on the visual hidden input element.
        // By default, when a user clicks on a label element, a generated click event will be
        // dispatched on the associated input element. Since we are using a label element as our
        // root container, the click event on the `slide-toggle` will be executed twice.
        // The real click event will bubble up, and the generated click event also tries to bubble up.
        // This will lead to multiple click events.
        // Preventing bubbling for the second event will solve that issue.
        event.stopPropagation();
    };
    /** Implemented as part of ControlValueAccessor. */
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} value
     * @return {?}
     */
    MatSlideToggle.prototype.writeValue = /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this.checked = !!value;
    };
    /** Implemented as part of ControlValueAccessor. */
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    MatSlideToggle.prototype.registerOnChange = /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onChange = fn;
    };
    /** Implemented as part of ControlValueAccessor. */
    /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    MatSlideToggle.prototype.registerOnTouched = /**
     * Implemented as part of ControlValueAccessor.
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        this.onTouched = fn;
    };
    /** Implemented as a part of ControlValueAccessor. */
    /**
     * Implemented as a part of ControlValueAccessor.
     * @param {?} isDisabled
     * @return {?}
     */
    MatSlideToggle.prototype.setDisabledState = /**
     * Implemented as a part of ControlValueAccessor.
     * @param {?} isDisabled
     * @return {?}
     */
    function (isDisabled) {
        this.disabled = isDisabled;
        this._changeDetectorRef.markForCheck();
    };
    /** Focuses the slide-toggle. */
    /**
     * Focuses the slide-toggle.
     * @return {?}
     */
    MatSlideToggle.prototype.focus = /**
     * Focuses the slide-toggle.
     * @return {?}
     */
    function () {
        this._focusMonitor.focusVia(this._inputElement.nativeElement, 'keyboard');
    };
    /** Toggles the checked state of the slide-toggle. */
    /**
     * Toggles the checked state of the slide-toggle.
     * @return {?}
     */
    MatSlideToggle.prototype.toggle = /**
     * Toggles the checked state of the slide-toggle.
     * @return {?}
     */
    function () {
        this.checked = !this.checked;
    };
    /**
     * Function is called whenever the focus changes for the input element.
     * @param {?} focusOrigin
     * @return {?}
     */
    MatSlideToggle.prototype._onInputFocusChange = /**
     * Function is called whenever the focus changes for the input element.
     * @param {?} focusOrigin
     * @return {?}
     */
    function (focusOrigin) {
        if (!this._focusRipple && focusOrigin === 'keyboard') {
            // For keyboard focus show a persistent ripple as focus indicator.
            this._focusRipple = this._ripple.launch(0, 0, { persistent: true, centered: true });
        }
        else if (!focusOrigin) {
            this.onTouched();
            // Fade out and clear the focus ripple if one is currently present.
            if (this._focusRipple) {
                this._focusRipple.fadeOut();
                this._focusRipple = null;
            }
        }
    };
    /**
     * Emits a change event on the `change` output. Also notifies the FormControl about the change.
     * @return {?}
     */
    MatSlideToggle.prototype._emitChangeEvent = /**
     * Emits a change event on the `change` output. Also notifies the FormControl about the change.
     * @return {?}
     */
    function () {
        var /** @type {?} */ event = new MatSlideToggleChange();
        event.source = this;
        event.checked = this.checked;
        this.onChange(this.checked);
        this.change.emit(event);
    };
    /**
     * @return {?}
     */
    MatSlideToggle.prototype._onDragStart = /**
     * @return {?}
     */
    function () {
        if (!this.disabled) {
            this._slideRenderer.startThumbDrag(this.checked);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    MatSlideToggle.prototype._onDrag = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this._slideRenderer.dragging) {
            this._slideRenderer.updateThumbPosition(event.deltaX);
        }
    };
    /**
     * @return {?}
     */
    MatSlideToggle.prototype._onDragEnd = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this._slideRenderer.dragging) {
            var /** @type {?} */ _previousChecked = this.checked;
            this.checked = this._slideRenderer.dragPercentage > 50;
            if (_previousChecked !== this.checked) {
                this._emitChangeEvent();
            }
            // The drag should be stopped outside of the current event handler, because otherwise the
            // click event will be fired before and will revert the drag change.
            setTimeout(function () { return _this._slideRenderer.stopThumbDrag(); });
        }
    };
    /** Method being called whenever the label text changes. */
    /**
     * Method being called whenever the label text changes.
     * @return {?}
     */
    MatSlideToggle.prototype._onLabelTextChange = /**
     * Method being called whenever the label text changes.
     * @return {?}
     */
    function () {
        // This method is getting called whenever the label of the slide-toggle changes.
        // Since the slide-toggle uses the OnPush strategy we need to notify it about the change
        // that has been recognized by the cdkObserveContent directive.
        this._changeDetectorRef.markForCheck();
    };
    return MatSlideToggle;
}(_MatSlideToggleMixinBase));
/**
 * Renderer for the Slide Toggle component, which separates DOM modification in its own class
 */
var SlideToggleRenderer = /** @class */ (function () {
    function SlideToggleRenderer(elementRef, platform) {
        // We only need to interact with these elements when we're on the browser, so only grab
        // the reference in that case.
        if (platform.isBrowser) {
            this._thumbEl = elementRef.nativeElement.querySelector('.mat-slide-toggle-thumb-container');
            this._thumbBarEl = elementRef.nativeElement.querySelector('.mat-slide-toggle-bar');
        }
    }
    /** Initializes the drag of the slide-toggle. */
    /**
     * Initializes the drag of the slide-toggle.
     * @param {?} checked
     * @return {?}
     */
    SlideToggleRenderer.prototype.startThumbDrag = /**
     * Initializes the drag of the slide-toggle.
     * @param {?} checked
     * @return {?}
     */
    function (checked) {
        if (this.dragging) {
            return;
        }
        this._thumbBarWidth = this._thumbBarEl.clientWidth - this._thumbEl.clientWidth;
        this._thumbEl.classList.add('mat-dragging');
        this._previousChecked = checked;
        this.dragging = true;
    };
    /** Resets the current drag and returns the new checked value. */
    /**
     * Resets the current drag and returns the new checked value.
     * @return {?}
     */
    SlideToggleRenderer.prototype.stopThumbDrag = /**
     * Resets the current drag and returns the new checked value.
     * @return {?}
     */
    function () {
        if (!this.dragging) {
            return false;
        }
        this.dragging = false;
        this._thumbEl.classList.remove('mat-dragging');
        // Reset the transform because the component will take care of the thumb position after drag.
        applyCssTransform(this._thumbEl, '');
        return this.dragPercentage > 50;
    };
    /** Updates the thumb containers position from the specified distance. */
    /**
     * Updates the thumb containers position from the specified distance.
     * @param {?} distance
     * @return {?}
     */
    SlideToggleRenderer.prototype.updateThumbPosition = /**
     * Updates the thumb containers position from the specified distance.
     * @param {?} distance
     * @return {?}
     */
    function (distance) {
        this.dragPercentage = this._getDragPercentage(distance);
        // Calculate the moved distance based on the thumb bar width.
        var /** @type {?} */ dragX = (this.dragPercentage / 100) * this._thumbBarWidth;
        applyCssTransform(this._thumbEl, "translate3d(" + dragX + "px, 0, 0)");
    };
    /**
     * Retrieves the percentage of thumb from the moved distance. Percentage as fraction of 100.
     * @param {?} distance
     * @return {?}
     */
    SlideToggleRenderer.prototype._getDragPercentage = /**
     * Retrieves the percentage of thumb from the moved distance. Percentage as fraction of 100.
     * @param {?} distance
     * @return {?}
     */
    function (distance) {
        var /** @type {?} */ percentage = (distance / this._thumbBarWidth) * 100;
        // When the toggle was initially checked, then we have to start the drag at the end.
        if (this._previousChecked) {
            percentage += 100;
        }
        return Math.max(0, Math.min(percentage, 100));
    };
    return SlideToggleRenderer;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

var MatSlideToggleModule = /** @class */ (function () {
    function MatSlideToggleModule() {
    }
    return MatSlideToggleModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { MatSlideToggleModule, MAT_SLIDE_TOGGLE_VALUE_ACCESSOR, MatSlideToggleChange, MatSlideToggleBase, _MatSlideToggleMixinBase, MatSlideToggle };
//# sourceMappingURL=slide-toggle.es5.js.map

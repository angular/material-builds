/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
/** Harness for interacting with a standard mat-slider in tests. */
let MatSliderHarness = /** @class */ (() => {
    class MatSliderHarness extends ComponentHarness {
        constructor() {
            super(...arguments);
            this._textLabel = this.locatorFor('.mat-slider-thumb-label-text');
            this._wrapper = this.locatorFor('.mat-slider-wrapper');
        }
        /**
         * Gets a `HarnessPredicate` that can be used to search for a `MatSliderHarness` that meets
         * certain criteria.
         * @param options Options for filtering which slider instances are considered a match.
         * @return a `HarnessPredicate` configured with the given options.
         */
        static with(options = {}) {
            return new HarnessPredicate(MatSliderHarness, options);
        }
        /** Gets the slider's id. */
        getId() {
            return __awaiter(this, void 0, void 0, function* () {
                const id = yield (yield this.host()).getAttribute('id');
                // In case no id has been specified, the "id" property always returns
                // an empty string. To make this method more explicit, we return null.
                return id !== '' ? id : null;
            });
        }
        /**
         * Gets the current display value of the slider. Returns a null promise if the thumb label is
         * disabled.
         */
        getDisplayValue() {
            return __awaiter(this, void 0, void 0, function* () {
                const [host, textLabel] = yield Promise.all([this.host(), this._textLabel()]);
                if (yield host.hasClass('mat-slider-thumb-label-showing')) {
                    return textLabel.text();
                }
                return null;
            });
        }
        /** Gets the current percentage value of the slider. */
        getPercentage() {
            return __awaiter(this, void 0, void 0, function* () {
                return this._calculatePercentage(yield this.getValue());
            });
        }
        /** Gets the current value of the slider. */
        getValue() {
            return __awaiter(this, void 0, void 0, function* () {
                return coerceNumberProperty(yield (yield this.host()).getAttribute('aria-valuenow'));
            });
        }
        /** Gets the maximum value of the slider. */
        getMaxValue() {
            return __awaiter(this, void 0, void 0, function* () {
                return coerceNumberProperty(yield (yield this.host()).getAttribute('aria-valuemax'));
            });
        }
        /** Gets the minimum value of the slider. */
        getMinValue() {
            return __awaiter(this, void 0, void 0, function* () {
                return coerceNumberProperty(yield (yield this.host()).getAttribute('aria-valuemin'));
            });
        }
        /** Whether the slider is disabled. */
        isDisabled() {
            return __awaiter(this, void 0, void 0, function* () {
                const disabled = (yield this.host()).getAttribute('aria-disabled');
                return coerceBooleanProperty(yield disabled);
            });
        }
        /** Gets the orientation of the slider. */
        getOrientation() {
            return __awaiter(this, void 0, void 0, function* () {
                // "aria-orientation" will always be set to either "horizontal" or "vertical".
                return (yield this.host()).getAttribute('aria-orientation');
            });
        }
        /**
         * Sets the value of the slider by clicking on the slider track.
         *
         * Note that in rare cases the value cannot be set to the exact specified value. This
         * can happen if not every value of the slider maps to a single pixel that could be
         * clicked using mouse interaction. In such cases consider using the keyboard to
         * select the given value or expand the slider's size for a better user experience.
         */
        setValue(value) {
            return __awaiter(this, void 0, void 0, function* () {
                const [sliderEl, wrapperEl, orientation] = yield Promise.all([this.host(), this._wrapper(), this.getOrientation()]);
                let percentage = yield this._calculatePercentage(value);
                const { height, width } = yield wrapperEl.getDimensions();
                const isVertical = orientation === 'vertical';
                // In case the slider is inverted in LTR mode or not inverted in RTL mode,
                // we need to invert the percentage so that the proper value is set.
                if (yield sliderEl.hasClass('mat-slider-invert-mouse-coords')) {
                    percentage = 1 - percentage;
                }
                // We need to round the new coordinates because creating fake DOM
                // events will cause the coordinates to be rounded down.
                const relativeX = isVertical ? 0 : Math.round(width * percentage);
                const relativeY = isVertical ? Math.round(height * percentage) : 0;
                yield wrapperEl.click(relativeX, relativeY);
            });
        }
        /** Focuses the slider. */
        focus() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.host()).focus();
            });
        }
        /** Blurs the slider. */
        blur() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.host()).blur();
            });
        }
        /** Whether the slider is focused. */
        isFocused() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.host()).isFocused();
            });
        }
        /** Calculates the percentage of the given value. */
        _calculatePercentage(value) {
            return __awaiter(this, void 0, void 0, function* () {
                const [min, max] = yield Promise.all([this.getMinValue(), this.getMaxValue()]);
                return (value - min) / (max - min);
            });
        }
    }
    /** The selector for the host element of a `MatSlider` instance. */
    MatSliderHarness.hostSelector = 'mat-slider';
    return MatSliderHarness;
})();
export { MatSliderHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3Rlc3Rpbmcvc2xpZGVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBR2xGLG1FQUFtRTtBQUNuRTtJQUFBLE1BQWEsZ0JBQWlCLFNBQVEsZ0JBQWdCO1FBQXREOztZQWNVLGVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLDhCQUE4QixDQUFDLENBQUM7WUFDN0QsYUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQXVHNUQsQ0FBQztRQWxIQzs7Ozs7V0FLRztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBZ0MsRUFBRTtZQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUtELDRCQUE0QjtRQUN0QixLQUFLOztnQkFDVCxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3hELHFFQUFxRTtnQkFDckUsc0VBQXNFO2dCQUN0RSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQy9CLENBQUM7U0FBQTtRQUVEOzs7V0FHRztRQUNHLGVBQWU7O2dCQUNuQixNQUFNLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxD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LENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzlDLENBQUM7U0FBQTtRQUVELDBCQUEwQjtRQUNwQixLQUFLOztnQkFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNyQyxDQUFDO1NBQUE7UUFFRCx3QkFBd0I7UUFDbEIsSUFBSTs7Z0JBQ1IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDcEMsQ0FBQztTQUFBO1FBRUQscUNBQXFDO1FBQy9CLFNBQVM7O2dCQUNiLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3pDLENBQUM7U0FBQTtRQUVELG9EQUFvRDtRQUN0QyxvQkFBb0IsQ0FBQyxLQUFhOztnQkFDOUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDL0UsT0FBTyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNyQyxDQUFDO1NBQUE7O0lBcEhELG1FQUFtRTtJQUM1RCw2QkFBWSxHQUFHLFlBQVksQ0FBQztJQW9IckMsdUJBQUM7S0FBQTtTQXRIWSxnQkFBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgY29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1NsaWRlckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3NsaWRlci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1zbGlkZXIgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0U2xpZGVySGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFNsaWRlcmAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnbWF0LXNsaWRlcic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdFNsaWRlckhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHNsaWRlciBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTbGlkZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRTbGlkZXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFNsaWRlckhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdGV4dExhYmVsID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXNsaWRlci10aHVtYi1sYWJlbC10ZXh0Jyk7XG4gIHByaXZhdGUgX3dyYXBwZXIgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtc2xpZGVyLXdyYXBwZXInKTtcblxuICAvKiogR2V0cyB0aGUgc2xpZGVyJ3MgaWQuICovXG4gIGFzeW5jIGdldElkKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICBjb25zdCBpZCA9IGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdpZCcpO1xuICAgIC8vIEluIGNhc2Ugbm8gaWQgaGFzIGJlZW4gc3BlY2lmaWVkLCB0aGUgXCJpZFwiIHByb3BlcnR5IGFsd2F5cyByZXR1cm5zXG4gICAgLy8gYW4gZW1wdHkgc3RyaW5nLiBUbyBtYWtlIHRoaXMgbWV0aG9kIG1vcmUgZXhwbGljaXQsIHdlIHJldHVybiBudWxsLlxuICAgIHJldHVybiBpZCAhPT0gJycgPyBpZCA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgY3VycmVudCBkaXNwbGF5IHZhbHVlIG9mIHRoZSBzbGlkZXIuIFJldHVybnMgYSBudWxsIHByb21pc2UgaWYgdGhlIHRodW1iIGxhYmVsIGlzXG4gICAqIGRpc2FibGVkLlxuICAgKi9cbiAgYXN5bmMgZ2V0RGlzcGxheVZhbHVlKCk6IFByb21pc2U8c3RyaW5nfG51bGw+IHtcbiAgICBjb25zdCBbaG9zdCwgdGV4dExhYmVsXSA9IGF3YWl0IFByb21pc2UuYWxsKFt0aGlzLmhvc3QoKSwgdGhpcy5fdGV4dExhYmVsKCldKTtcbiAgICBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LXNsaWRlci10aHVtYi1sYWJlbC1zaG93aW5nJykpIHtcbiAgICAgIHJldHVybiB0ZXh0TGFiZWwudGV4dCgpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjdXJyZW50IHBlcmNlbnRhZ2UgdmFsdWUgb2YgdGhlIHNsaWRlci4gKi9cbiAgYXN5bmMgZ2V0UGVyY2VudGFnZSgpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiB0aGlzLl9jYWxjdWxhdGVQZXJjZW50YWdlKGF3YWl0IHRoaXMuZ2V0VmFsdWUoKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY3VycmVudCB2YWx1ZSBvZiB0aGUgc2xpZGVyLiAqL1xuICBhc3luYyBnZXRWYWx1ZSgpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eShhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtYXhpbXVtIHZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGdldE1heFZhbHVlKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGNvZXJjZU51bWJlclByb3BlcnR5KGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWF4JykpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG1pbmltdW0gdmFsdWUgb2YgdGhlIHNsaWRlci4gKi9cbiAgYXN5bmMgZ2V0TWluVmFsdWUoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtaW4nKSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IGRpc2FibGVkID0gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IGRpc2FibGVkKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc2xpZGVyLiAqL1xuICBhc3luYyBnZXRPcmllbnRhdGlvbigpOiBQcm9taXNlPCdob3Jpem9udGFsJ3wndmVydGljYWwnPiB7XG4gICAgLy8gXCJhcmlhLW9yaWVudGF0aW9uXCIgd2lsbCBhbHdheXMgYmUgc2V0IHRvIGVpdGhlciBcImhvcml6b250YWxcIiBvciBcInZlcnRpY2FsXCIuXG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLW9yaWVudGF0aW9uJykgYXMgYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgYnkgY2xpY2tpbmcgb24gdGhlIHNsaWRlciB0cmFjay5cbiAgICpcbiAgICogTm90ZSB0aGF0IGluIHJhcmUgY2FzZXMgdGhlIHZhbHVlIGNhbm5vdCBiZSBzZXQgdG8gdGhlIGV4YWN0IHNwZWNpZmllZCB2YWx1ZS4gVGhpc1xuICAgKiBjYW4gaGFwcGVuIGlmIG5vdCBldmVyeSB2YWx1ZSBvZiB0aGUgc2xpZGVyIG1hcHMgdG8gYSBzaW5nbGUgcGl4ZWwgdGhhdCBjb3VsZCBiZVxuICAgKiBjbGlja2VkIHVzaW5nIG1vdXNlIGludGVyYWN0aW9uLiBJbiBzdWNoIGNhc2VzIGNvbnNpZGVyIHVzaW5nIHRoZSBrZXlib2FyZCB0b1xuICAgKiBzZWxlY3QgdGhlIGdpdmVuIHZhbHVlIG9yIGV4cGFuZCB0aGUgc2xpZGVyJ3Mgc2l6ZSBmb3IgYSBiZXR0ZXIgdXNlciBleHBlcmllbmNlLlxuICAgKi9cbiAgYXN5bmMgc2V0VmFsdWUodmFsdWU6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IFtzbGlkZXJFbCwgd3JhcHBlckVsLCBvcmllbnRhdGlvbl0gPVxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbdGhpcy5ob3N0KCksIHRoaXMuX3dyYXBwZXIoKSwgdGhpcy5nZXRPcmllbnRhdGlvbigpXSk7XG4gICAgbGV0IHBlcmNlbnRhZ2UgPSBhd2FpdCB0aGlzLl9jYWxjdWxhdGVQZXJjZW50YWdlKHZhbHVlKTtcbiAgICBjb25zdCB7aGVpZ2h0LCB3aWR0aH0gPSBhd2FpdCB3cmFwcGVyRWwuZ2V0RGltZW5zaW9ucygpO1xuICAgIGNvbnN0IGlzVmVydGljYWwgPSBvcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJztcblxuICAgIC8vIEluIGNhc2UgdGhlIHNsaWRlciBpcyBpbnZlcnRlZCBpbiBMVFIgbW9kZSBvciBub3QgaW52ZXJ0ZWQgaW4gUlRMIG1vZGUsXG4gICAgLy8gd2UgbmVlZCB0byBpbnZlcnQgdGhlIHBlcmNlbnRhZ2Ugc28gdGhhdCB0aGUgcHJvcGVyIHZhbHVlIGlzIHNldC5cbiAgICBpZiAoYXdhaXQgc2xpZGVyRWwuaGFzQ2xhc3MoJ21hdC1zbGlkZXItaW52ZXJ0LW1vdXNlLWNvb3JkcycpKSB7XG4gICAgICBwZXJjZW50YWdlID0gMSAtIHBlcmNlbnRhZ2U7XG4gICAgfVxuXG4gICAgLy8gV2UgbmVlZCB0byByb3VuZCB0aGUgbmV3IGNvb3JkaW5hdGVzIGJlY2F1c2UgY3JlYXRpbmcgZmFrZSBET01cbiAgICAvLyBldmVudHMgd2lsbCBjYXVzZSB0aGUgY29vcmRpbmF0ZXMgdG8gYmUgcm91bmRlZCBkb3duLlxuICAgIGNvbnN0IHJlbGF0aXZlWCA9IGlzVmVydGljYWwgPyAwIDogTWF0aC5yb3VuZCh3aWR0aCAqIHBlcmNlbnRhZ2UpO1xuICAgIGNvbnN0IHJlbGF0aXZlWSA9IGlzVmVydGljYWwgPyBNYXRoLnJvdW5kKGhlaWdodCAqIHBlcmNlbnRhZ2UpIDogMDtcblxuICAgIGF3YWl0IHdyYXBwZXJFbC5jbGljayhyZWxhdGl2ZVgsIHJlbGF0aXZlWSk7XG4gIH1cblxuICAvKiogRm9jdXNlcyB0aGUgc2xpZGVyLiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5mb2N1cygpO1xuICB9XG5cbiAgLyoqIEJsdXJzIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBpcyBmb2N1c2VkLiAqL1xuICBhc3luYyBpc0ZvY3VzZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaXNGb2N1c2VkKCk7XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgcGVyY2VudGFnZSBvZiB0aGUgZ2l2ZW4gdmFsdWUuICovXG4gIHByaXZhdGUgYXN5bmMgX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodmFsdWU6IG51bWJlcikge1xuICAgIGNvbnN0IFttaW4sIG1heF0gPSBhd2FpdCBQcm9taXNlLmFsbChbdGhpcy5nZXRNaW5WYWx1ZSgpLCB0aGlzLmdldE1heFZhbHVlKCldKTtcbiAgICByZXR1cm4gKHZhbHVlIC0gbWluKSAvIChtYXggLSBtaW4pO1xuICB9XG59XG4iXX0=
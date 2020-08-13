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
export class MatSliderHarness extends ComponentHarness {
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
MatSliderHarness.hostSelector = '.mat-slider';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3Rlc3Rpbmcvc2xpZGVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBR2xGLG1FQUFtRTtBQUNuRSxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsZ0JBQWdCO0lBQXREOztRQWNVLGVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDN0QsYUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQXVHNUQsQ0FBQztJQWxIQzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBZ0MsRUFBRTtRQUM1QyxPQUFPLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUtELDRCQUE0QjtJQUN0QixLQUFLOztZQUNULE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4RCxxRUFBcUU7WUFDckUsc0VBQXNFO1lBQ3RFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDL0IsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ0csZUFBZTs7WUFDbkIsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJ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QztRQUM5QyxDQUFDO0tBQUE7SUFFRCwwQkFBMEI7SUFDcEIsS0FBSzs7WUFDVCxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQyxDQUFDO0tBQUE7SUFFRCx3QkFBd0I7SUFDbEIsSUFBSTs7WUFDUixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNwQyxDQUFDO0tBQUE7SUFFRCxxQ0FBcUM7SUFDL0IsU0FBUzs7WUFDYixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN6QyxDQUFDO0tBQUE7SUFFRCxvREFBb0Q7SUFDdEMsb0JBQW9CLENBQUMsS0FBYTs7WUFDOUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMvRSxPQUFPLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7S0FBQTs7QUFwSEQsbUVBQW1FO0FBQzVELDZCQUFZLEdBQUcsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHksIGNvZXJjZU51bWJlclByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTbGlkZXJIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9zbGlkZXItaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBtYXQtc2xpZGVyIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFNsaWRlckhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRTbGlkZXJgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc2xpZGVyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0U2xpZGVySGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggc2xpZGVyIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFNsaWRlckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFNsaWRlckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U2xpZGVySGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICBwcml2YXRlIF90ZXh0TGFiZWwgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtc2xpZGVyLXRodW1iLWxhYmVsLXRleHQnKTtcbiAgcHJpdmF0ZSBfd3JhcHBlciA9IHRoaXMubG9jYXRvckZvcignLm1hdC1zbGlkZXItd3JhcHBlcicpO1xuXG4gIC8qKiBHZXRzIHRoZSBzbGlkZXIncyBpZC4gKi9cbiAgYXN5bmMgZ2V0SWQoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIGNvbnN0IGlkID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgLy8gSW4gY2FzZSBubyBpZCBoYXMgYmVlbiBzcGVjaWZpZWQsIHRoZSBcImlkXCIgcHJvcGVydHkgYWx3YXlzIHJldHVybnNcbiAgICAvLyBhbiBlbXB0eSBzdHJpbmcuIFRvIG1ha2UgdGhpcyBtZXRob2QgbW9yZSBleHBsaWNpdCwgd2UgcmV0dXJuIG51bGwuXG4gICAgcmV0dXJuIGlkICE9PSAnJyA/IGlkIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXJyZW50IGRpc3BsYXkgdmFsdWUgb2YgdGhlIHNsaWRlci4gUmV0dXJucyBhIG51bGwgcHJvbWlzZSBpZiB0aGUgdGh1bWIgbGFiZWwgaXNcbiAgICogZGlzYWJsZWQuXG4gICAqL1xuICBhc3luYyBnZXREaXNwbGF5VmFsdWUoKTogUHJvbWlzZTxzdHJpbmd8bnVsbD4ge1xuICAgIGNvbnN0IFtob3N0LCB0ZXh0TGFiZWxdID0gYXdhaXQgUHJvbWlzZS5hbGwoW3RoaXMuaG9zdCgpLCB0aGlzLl90ZXh0TGFiZWwoKV0pO1xuICAgIGlmIChhd2FpdCBob3N0Lmhhc0NsYXNzKCdtYXQtc2xpZGVyLXRodW1iLWxhYmVsLXNob3dpbmcnKSkge1xuICAgICAgcmV0dXJuIHRleHRMYWJlbC50ZXh0KCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGN1cnJlbnQgcGVyY2VudGFnZSB2YWx1ZSBvZiB0aGUgc2xpZGVyLiAqL1xuICBhc3luYyBnZXRQZXJjZW50YWdlKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UoYXdhaXQgdGhpcy5nZXRWYWx1ZSgpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBjdXJyZW50IHZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGdldFZhbHVlKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGNvZXJjZU51bWJlclByb3BlcnR5KGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JykpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG1heGltdW0gdmFsdWUgb2YgdGhlIHNsaWRlci4gKi9cbiAgYXN5bmMgZ2V0TWF4VmFsdWUoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtYXgnKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWluaW11bSB2YWx1ZSBvZiB0aGUgc2xpZGVyLiAqL1xuICBhc3luYyBnZXRNaW5WYWx1ZSgpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eShhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1pbicpKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBzbGlkZXIgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgY29uc3QgZGlzYWJsZWQgPSAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcpO1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgZGlzYWJsZWQpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGdldE9yaWVudGF0aW9uKCk6IFByb21pc2U8J2hvcml6b250YWwnfCd2ZXJ0aWNhbCc+IHtcbiAgICAvLyBcImFyaWEtb3JpZW50YXRpb25cIiB3aWxsIGFsd2F5cyBiZSBzZXQgdG8gZWl0aGVyIFwiaG9yaXpvbnRhbFwiIG9yIFwidmVydGljYWxcIi5cbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtb3JpZW50YXRpb24nKSBhcyBhbnk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIHNsaWRlciBieSBjbGlja2luZyBvbiB0aGUgc2xpZGVyIHRyYWNrLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgaW4gcmFyZSBjYXNlcyB0aGUgdmFsdWUgY2Fubm90IGJlIHNldCB0byB0aGUgZXhhY3Qgc3BlY2lmaWVkIHZhbHVlLiBUaGlzXG4gICAqIGNhbiBoYXBwZW4gaWYgbm90IGV2ZXJ5IHZhbHVlIG9mIHRoZSBzbGlkZXIgbWFwcyB0byBhIHNpbmdsZSBwaXhlbCB0aGF0IGNvdWxkIGJlXG4gICAqIGNsaWNrZWQgdXNpbmcgbW91c2UgaW50ZXJhY3Rpb24uIEluIHN1Y2ggY2FzZXMgY29uc2lkZXIgdXNpbmcgdGhlIGtleWJvYXJkIHRvXG4gICAqIHNlbGVjdCB0aGUgZ2l2ZW4gdmFsdWUgb3IgZXhwYW5kIHRoZSBzbGlkZXIncyBzaXplIGZvciBhIGJldHRlciB1c2VyIGV4cGVyaWVuY2UuXG4gICAqL1xuICBhc3luYyBzZXRWYWx1ZSh2YWx1ZTogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgW3NsaWRlckVsLCB3cmFwcGVyRWwsIG9yaWVudGF0aW9uXSA9XG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKFt0aGlzLmhvc3QoKSwgdGhpcy5fd3JhcHBlcigpLCB0aGlzLmdldE9yaWVudGF0aW9uKCldKTtcbiAgICBsZXQgcGVyY2VudGFnZSA9IGF3YWl0IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodmFsdWUpO1xuICAgIGNvbnN0IHtoZWlnaHQsIHdpZHRofSA9IGF3YWl0IHdyYXBwZXJFbC5nZXREaW1lbnNpb25zKCk7XG4gICAgY29uc3QgaXNWZXJ0aWNhbCA9IG9yaWVudGF0aW9uID09PSAndmVydGljYWwnO1xuXG4gICAgLy8gSW4gY2FzZSB0aGUgc2xpZGVyIGlzIGludmVydGVkIGluIExUUiBtb2RlIG9yIG5vdCBpbnZlcnRlZCBpbiBSVEwgbW9kZSxcbiAgICAvLyB3ZSBuZWVkIHRvIGludmVydCB0aGUgcGVyY2VudGFnZSBzbyB0aGF0IHRoZSBwcm9wZXIgdmFsdWUgaXMgc2V0LlxuICAgIGlmIChhd2FpdCBzbGlkZXJFbC5oYXNDbGFzcygnbWF0LXNsaWRlci1pbnZlcnQtbW91c2UtY29vcmRzJykpIHtcbiAgICAgIHBlcmNlbnRhZ2UgPSAxIC0gcGVyY2VudGFnZTtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIHJvdW5kIHRoZSBuZXcgY29vcmRpbmF0ZXMgYmVjYXVzZSBjcmVhdGluZyBmYWtlIERPTVxuICAgIC8vIGV2ZW50cyB3aWxsIGNhdXNlIHRoZSBjb29yZGluYXRlcyB0byBiZSByb3VuZGVkIGRvd24uXG4gICAgY29uc3QgcmVsYXRpdmVYID0gaXNWZXJ0aWNhbCA/IDAgOiBNYXRoLnJvdW5kKHdpZHRoICogcGVyY2VudGFnZSk7XG4gICAgY29uc3QgcmVsYXRpdmVZID0gaXNWZXJ0aWNhbCA/IE1hdGgucm91bmQoaGVpZ2h0ICogcGVyY2VudGFnZSkgOiAwO1xuXG4gICAgYXdhaXQgd3JhcHBlckVsLmNsaWNrKHJlbGF0aXZlWCwgcmVsYXRpdmVZKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIHNsaWRlci4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSBwZXJjZW50YWdlIG9mIHRoZSBnaXZlbiB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfY2FsY3VsYXRlUGVyY2VudGFnZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgY29uc3QgW21pbiwgbWF4XSA9IGF3YWl0IFByb21pc2UuYWxsKFt0aGlzLmdldE1pblZhbHVlKCksIHRoaXMuZ2V0TWF4VmFsdWUoKV0pO1xuICAgIHJldHVybiAodmFsdWUgLSBtaW4pIC8gKG1heCAtIG1pbik7XG4gIH1cbn1cbiJdfQ==
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
/**
 * Harness for interacting with a standard mat-slider in tests.
 * @deprecated Use `MatSliderHarness` from `@angular/material/slider/testing` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
class MatLegacySliderHarness extends ComponentHarness {
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
        return new HarnessPredicate(MatLegacySliderHarness, options);
    }
    /** Gets the slider's id. */
    async getId() {
        const id = await (await this.host()).getAttribute('id');
        // In case no id has been specified, the "id" property always returns
        // an empty string. To make this method more explicit, we return null.
        return id !== '' ? id : null;
    }
    /**
     * Gets the current display value of the slider. Returns a null promise if the thumb label is
     * disabled.
     */
    async getDisplayValue() {
        const [host, textLabel] = await parallel(() => [this.host(), this._textLabel()]);
        if (await host.hasClass('mat-slider-thumb-label-showing')) {
            return textLabel.text();
        }
        return null;
    }
    /** Gets the current percentage value of the slider. */
    async getPercentage() {
        return this._calculatePercentage(await this.getValue());
    }
    /** Gets the current value of the slider. */
    async getValue() {
        return coerceNumberProperty(await (await this.host()).getAttribute('aria-valuenow'));
    }
    /** Gets the maximum value of the slider. */
    async getMaxValue() {
        return coerceNumberProperty(await (await this.host()).getAttribute('aria-valuemax'));
    }
    /** Gets the minimum value of the slider. */
    async getMinValue() {
        return coerceNumberProperty(await (await this.host()).getAttribute('aria-valuemin'));
    }
    /** Whether the slider is disabled. */
    async isDisabled() {
        const disabled = (await this.host()).getAttribute('aria-disabled');
        return coerceBooleanProperty(await disabled);
    }
    /** Gets the orientation of the slider. */
    async getOrientation() {
        // "aria-orientation" will always be set to either "horizontal" or "vertical".
        return (await this.host()).getAttribute('aria-orientation');
    }
    /**
     * Sets the value of the slider by clicking on the slider track.
     *
     * Note that in rare cases the value cannot be set to the exact specified value. This
     * can happen if not every value of the slider maps to a single pixel that could be
     * clicked using mouse interaction. In such cases consider using the keyboard to
     * select the given value or expand the slider's size for a better user experience.
     */
    async setValue(value) {
        const [sliderEl, wrapperEl, orientation] = await parallel(() => [
            this.host(),
            this._wrapper(),
            this.getOrientation(),
        ]);
        let percentage = await this._calculatePercentage(value);
        const { height, width } = await wrapperEl.getDimensions();
        const isVertical = orientation === 'vertical';
        // In case the slider is inverted in LTR mode or not inverted in RTL mode,
        // we need to invert the percentage so that the proper value is set.
        if (await sliderEl.hasClass('mat-slider-invert-mouse-coords')) {
            percentage = 1 - percentage;
        }
        // We need to round the new coordinates because creating fake DOM
        // events will cause the coordinates to be rounded down.
        const relativeX = isVertical ? 0 : Math.round(width * percentage);
        const relativeY = isVertical ? Math.round(height * percentage) : 0;
        await wrapperEl.click(relativeX, relativeY);
    }
    /** Focuses the slider. */
    async focus() {
        return (await this.host()).focus();
    }
    /** Blurs the slider. */
    async blur() {
        return (await this.host()).blur();
    }
    /** Whether the slider is focused. */
    async isFocused() {
        return (await this.host()).isFocused();
    }
    /** Calculates the percentage of the given value. */
    async _calculatePercentage(value) {
        const [min, max] = await parallel(() => [this.getMinValue(), this.getMaxValue()]);
        return (value - min) / (max - min);
    }
}
/** The selector for the host element of a `MatSlider` instance. */
MatLegacySliderHarness.hostSelector = '.mat-slider';
export { MatLegacySliderHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGVnYWN5LXNsaWRlci90ZXN0aW5nL3NsaWRlci1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRixPQUFPLEVBQUMscUJBQXFCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUdsRjs7OztHQUlHO0FBQ0gsTUFBYSxzQkFBdUIsU0FBUSxnQkFBZ0I7SUFBNUQ7O1FBY1UsZUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUM3RCxhQUFRLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBMEc1RCxDQUFDO0lBckhDOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFzQyxFQUFFO1FBQ2xELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxzQkFBc0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBS0QsNEJBQTRCO0lBQzVCLEtBQUssQ0FBQyxLQUFLO1FBQ1QsTUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hELHFFQUFxRTtRQUNyRSxzRUFBc0U7UUFDdEUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztJQUMvQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLGVBQWU7UUFDbkIsTUFBTSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsR0FBRyxNQUFNLFFB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LENBQUM7UUFFbkUsTUFBTSxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsMEJBQTBCO0lBQzFCLEtBQUssQ0FBQyxLQUFLO1FBQ1QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUVELHdCQUF3QjtJQUN4QixLQUFLLENBQUMsSUFBSTtRQUNSLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3BDLENBQUM7SUFFRCxxQ0FBcUM7SUFDckMsS0FBSyxDQUFDLFNBQVM7UUFDYixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN6QyxDQUFDO0lBRUQsb0RBQW9EO0lBQzVDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxLQUFhO1FBQzlDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsTUFBTSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsRixPQUFPLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7O0FBdkhELG1FQUFtRTtBQUM1RCxtQ0FBWSxHQUFHLGFBQWEsQUFBaEIsQ0FBaUI7U0FGekIsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZSwgcGFyYWxsZWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7Y29lcmNlQm9vbGVhblByb3BlcnR5LCBjb2VyY2VOdW1iZXJQcm9wZXJ0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7TGVnYWN5U2xpZGVySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vc2xpZGVyLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKlxuICogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1zbGlkZXIgaW4gdGVzdHMuXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdFNsaWRlckhhcm5lc3NgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3NsaWRlci90ZXN0aW5nYCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lTbGlkZXJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0U2xpZGVyYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXNsaWRlcic7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdFNsaWRlckhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHNsaWRlciBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBMZWdhY3lTbGlkZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRMZWdhY3lTbGlkZXJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdExlZ2FjeVNsaWRlckhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdGV4dExhYmVsID0gdGhpcy5sb2NhdG9yRm9yKCcubWF0LXNsaWRlci10aHVtYi1sYWJlbC10ZXh0Jyk7XG4gIHByaXZhdGUgX3dyYXBwZXIgPSB0aGlzLmxvY2F0b3JGb3IoJy5tYXQtc2xpZGVyLXdyYXBwZXInKTtcblxuICAvKiogR2V0cyB0aGUgc2xpZGVyJ3MgaWQuICovXG4gIGFzeW5jIGdldElkKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIGNvbnN0IGlkID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2lkJyk7XG4gICAgLy8gSW4gY2FzZSBubyBpZCBoYXMgYmVlbiBzcGVjaWZpZWQsIHRoZSBcImlkXCIgcHJvcGVydHkgYWx3YXlzIHJldHVybnNcbiAgICAvLyBhbiBlbXB0eSBzdHJpbmcuIFRvIG1ha2UgdGhpcyBtZXRob2QgbW9yZSBleHBsaWNpdCwgd2UgcmV0dXJuIG51bGwuXG4gICAgcmV0dXJuIGlkICE9PSAnJyA/IGlkIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBjdXJyZW50IGRpc3BsYXkgdmFsdWUgb2YgdGhlIHNsaWRlci4gUmV0dXJucyBhIG51bGwgcHJvbWlzZSBpZiB0aGUgdGh1bWIgbGFiZWwgaXNcbiAgICogZGlzYWJsZWQuXG4gICAqL1xuICBhc3luYyBnZXREaXNwbGF5VmFsdWUoKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgY29uc3QgW2hvc3QsIHRleHRMYWJlbF0gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbdGhpcy5ob3N0KCksIHRoaXMuX3RleHRMYWJlbCgpXSk7XG4gICAgaWYgKGF3YWl0IGhvc3QuaGFzQ2xhc3MoJ21hdC1zbGlkZXItdGh1bWItbGFiZWwtc2hvd2luZycpKSB7XG4gICAgICByZXR1cm4gdGV4dExhYmVsLnRleHQoKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgY3VycmVudCBwZXJjZW50YWdlIHZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGdldFBlcmNlbnRhZ2UoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gdGhpcy5fY2FsY3VsYXRlUGVyY2VudGFnZShhd2FpdCB0aGlzLmdldFZhbHVlKCkpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIGN1cnJlbnQgdmFsdWUgb2YgdGhlIHNsaWRlci4gKi9cbiAgYXN5bmMgZ2V0VmFsdWUoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gY29lcmNlTnVtYmVyUHJvcGVydHkoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbWF4aW11bSB2YWx1ZSBvZiB0aGUgc2xpZGVyLiAqL1xuICBhc3luYyBnZXRNYXhWYWx1ZSgpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eShhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1heCcpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtaW5pbXVtIHZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGdldE1pblZhbHVlKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGNvZXJjZU51bWJlclByb3BlcnR5KGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWluJykpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHNsaWRlciBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBkaXNhYmxlZCA9IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWRpc2FibGVkJyk7XG4gICAgcmV0dXJuIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eShhd2FpdCBkaXNhYmxlZCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHNsaWRlci4gKi9cbiAgYXN5bmMgZ2V0T3JpZW50YXRpb24oKTogUHJvbWlzZTwnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnPiB7XG4gICAgLy8gXCJhcmlhLW9yaWVudGF0aW9uXCIgd2lsbCBhbHdheXMgYmUgc2V0IHRvIGVpdGhlciBcImhvcml6b250YWxcIiBvciBcInZlcnRpY2FsXCIuXG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLW9yaWVudGF0aW9uJykgYXMgYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBzbGlkZXIgYnkgY2xpY2tpbmcgb24gdGhlIHNsaWRlciB0cmFjay5cbiAgICpcbiAgICogTm90ZSB0aGF0IGluIHJhcmUgY2FzZXMgdGhlIHZhbHVlIGNhbm5vdCBiZSBzZXQgdG8gdGhlIGV4YWN0IHNwZWNpZmllZCB2YWx1ZS4gVGhpc1xuICAgKiBjYW4gaGFwcGVuIGlmIG5vdCBldmVyeSB2YWx1ZSBvZiB0aGUgc2xpZGVyIG1hcHMgdG8gYSBzaW5nbGUgcGl4ZWwgdGhhdCBjb3VsZCBiZVxuICAgKiBjbGlja2VkIHVzaW5nIG1vdXNlIGludGVyYWN0aW9uLiBJbiBzdWNoIGNhc2VzIGNvbnNpZGVyIHVzaW5nIHRoZSBrZXlib2FyZCB0b1xuICAgKiBzZWxlY3QgdGhlIGdpdmVuIHZhbHVlIG9yIGV4cGFuZCB0aGUgc2xpZGVyJ3Mgc2l6ZSBmb3IgYSBiZXR0ZXIgdXNlciBleHBlcmllbmNlLlxuICAgKi9cbiAgYXN5bmMgc2V0VmFsdWUodmFsdWU6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IFtzbGlkZXJFbCwgd3JhcHBlckVsLCBvcmllbnRhdGlvbl0gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbXG4gICAgICB0aGlzLmhvc3QoKSxcbiAgICAgIHRoaXMuX3dyYXBwZXIoKSxcbiAgICAgIHRoaXMuZ2V0T3JpZW50YXRpb24oKSxcbiAgICBdKTtcbiAgICBsZXQgcGVyY2VudGFnZSA9IGF3YWl0IHRoaXMuX2NhbGN1bGF0ZVBlcmNlbnRhZ2UodmFsdWUpO1xuICAgIGNvbnN0IHtoZWlnaHQsIHdpZHRofSA9IGF3YWl0IHdyYXBwZXJFbC5nZXREaW1lbnNpb25zKCk7XG4gICAgY29uc3QgaXNWZXJ0aWNhbCA9IG9yaWVudGF0aW9uID09PSAndmVydGljYWwnO1xuXG4gICAgLy8gSW4gY2FzZSB0aGUgc2xpZGVyIGlzIGludmVydGVkIGluIExUUiBtb2RlIG9yIG5vdCBpbnZlcnRlZCBpbiBSVEwgbW9kZSxcbiAgICAvLyB3ZSBuZWVkIHRvIGludmVydCB0aGUgcGVyY2VudGFnZSBzbyB0aGF0IHRoZSBwcm9wZXIgdmFsdWUgaXMgc2V0LlxuICAgIGlmIChhd2FpdCBzbGlkZXJFbC5oYXNDbGFzcygnbWF0LXNsaWRlci1pbnZlcnQtbW91c2UtY29vcmRzJykpIHtcbiAgICAgIHBlcmNlbnRhZ2UgPSAxIC0gcGVyY2VudGFnZTtcbiAgICB9XG5cbiAgICAvLyBXZSBuZWVkIHRvIHJvdW5kIHRoZSBuZXcgY29vcmRpbmF0ZXMgYmVjYXVzZSBjcmVhdGluZyBmYWtlIERPTVxuICAgIC8vIGV2ZW50cyB3aWxsIGNhdXNlIHRoZSBjb29yZGluYXRlcyB0byBiZSByb3VuZGVkIGRvd24uXG4gICAgY29uc3QgcmVsYXRpdmVYID0gaXNWZXJ0aWNhbCA/IDAgOiBNYXRoLnJvdW5kKHdpZHRoICogcGVyY2VudGFnZSk7XG4gICAgY29uc3QgcmVsYXRpdmVZID0gaXNWZXJ0aWNhbCA/IE1hdGgucm91bmQoaGVpZ2h0ICogcGVyY2VudGFnZSkgOiAwO1xuXG4gICAgYXdhaXQgd3JhcHBlckVsLmNsaWNrKHJlbGF0aXZlWCwgcmVsYXRpdmVZKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmZvY3VzKCk7XG4gIH1cblxuICAvKiogQmx1cnMgdGhlIHNsaWRlci4gKi9cbiAgYXN5bmMgYmx1cigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5ibHVyKCk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgc2xpZGVyIGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSBwZXJjZW50YWdlIG9mIHRoZSBnaXZlbiB2YWx1ZS4gKi9cbiAgcHJpdmF0ZSBhc3luYyBfY2FsY3VsYXRlUGVyY2VudGFnZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgY29uc3QgW21pbiwgbWF4XSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFt0aGlzLmdldE1pblZhbHVlKCksIHRoaXMuZ2V0TWF4VmFsdWUoKV0pO1xuICAgIHJldHVybiAodmFsdWUgLSBtaW4pIC8gKG1heCAtIG1pbik7XG4gIH1cbn1cbiJdfQ==
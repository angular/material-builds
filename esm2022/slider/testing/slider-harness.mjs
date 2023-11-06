/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ThumbPosition } from './slider-harness-filters';
import { MatSliderThumbHarness } from './slider-thumb-harness';
/** Harness for interacting with a MDC mat-slider in tests. */
export class MatSliderHarness extends ComponentHarness {
    static { this.hostSelector = '.mat-mdc-slider'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a slider with specific attributes.
     * @param options Options for filtering which input instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options)
            .addOption('isRange', options.isRange, async (harness, value) => {
            return (await harness.isRange()) === value;
        })
            .addOption('disabled', options.disabled, async (harness, disabled) => {
            return (await harness.isDisabled()) === disabled;
        });
    }
    /** Gets the start thumb of the slider (only applicable for range sliders). */
    async getStartThumb() {
        if (!(await this.isRange())) {
            throw Error('`getStartThumb` is only applicable for range sliders. ' +
                'Did you mean to use `getEndThumb`?');
        }
        return this.locatorFor(MatSliderThumbHarness.with({ position: ThumbPosition.START }))();
    }
    /** Gets the thumb (for single point sliders), or the end thumb (for range sliders). */
    async getEndThumb() {
        return this.locatorFor(MatSliderThumbHarness.with({ position: ThumbPosition.END }))();
    }
    /** Gets whether the slider is a range slider. */
    async isRange() {
        return await (await this.host()).hasClass('mdc-slider--range');
    }
    /** Gets whether the slider is disabled. */
    async isDisabled() {
        return await (await this.host()).hasClass('mdc-slider--disabled');
    }
    /** Gets the value step increments of the slider. */
    async getStep() {
        // The same step value is forwarded to both thumbs.
        const startHost = await (await this.getEndThumb()).host();
        return coerceNumberProperty(await startHost.getProperty('step'));
    }
    /** Gets the maximum value of the slider. */
    async getMaxValue() {
        return (await this.getEndThumb()).getMaxValue();
    }
    /** Gets the minimum value of the slider. */
    async getMinValue() {
        const startThumb = (await this.isRange())
            ? await this.getStartThumb()
            : await this.getEndThumb();
        return startThumb.getMinValue();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2xpZGVyL3Rlc3Rpbmcvc2xpZGVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLGdCQUFnQixFQUVoQixnQkFBZ0IsR0FDakIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRCxPQUFPLEVBQXVCLGFBQWEsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQzdFLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBRTdELDhEQUE4RDtBQUM5RCxNQUFNLE9BQU8sZ0JBQWlCLFNBQVEsZ0JBQWdCO2FBQzdDLGlCQUFZLEdBQUcsaUJBQWlCLENBQUM7SUFFeEM7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBRVQsVUFBZ0MsRUFBRTtRQUVsQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQzthQUN2QyxTQUFTLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUM5RCxPQUFPLENBQUMsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxLQUFLLENBQUM7UUFDN0MsQ0FBQyxDQUFDO2FBQ0QsU0FBUyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUU7WUFDbkUsT0FBTyxDQUFDLE1BQU0sT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssUUFBUSxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDhFQUE4RTtJQUM5RSxLQUFLLENBQUMsYUFBYTtRQUNqQixJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFO1lBQzNCLE1BQU0sS0FBSyxDQUNULHdEQUF3RDtnQkFDdEQsb0NBQW9DLENBQ3ZDLENBQUM7U0FDSDtRQUNELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsRUFBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLEtBQUssRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3hGLENBQUM7SUFFRCx1RkFBdUY7SUFDdkYsS0FBSyxDQUFDLFdBQVc7UUFDZixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEVBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN0RixDQUFDO0lBRUQsaURBQWlEO0lBQ2pELEtBQUssQ0FBQyxPQUFPO1FBQ1gsT0FBTyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsMkNBQTJDO0lBQzNDLEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsb0RBQW9EO0lBQ3BELEtBQUssQ0FBQyxPQUFPO1FBQ1gsbURBQW1EO1FBQ25ELE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzFELE9BQU8sb0JBQW9CLENBQUMsTUFBTSxTQUFTLENBQUMsV0FBVyxDQUFTLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELDRDQUE0QztJQUM1QyxLQUFLLENBQUMsV0FBVztRQUNmLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2xELENBQUM7SUFFRCw0Q0FBNEM7SUFDNUMsS0FBSyxDQUFDLFdBQVc7UUFDZixNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDNUIsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzdCLE9BQU8sVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzUHJlZGljYXRlLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHtTbGlkZXJIYXJuZXNzRmlsdGVycywgVGh1bWJQb3NpdGlvbn0gZnJvbSAnLi9zbGlkZXItaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7TWF0U2xpZGVyVGh1bWJIYXJuZXNzfSBmcm9tICcuL3NsaWRlci10aHVtYi1oYXJuZXNzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBNREMgbWF0LXNsaWRlciBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTbGlkZXJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZGMtc2xpZGVyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBzbGlkZXIgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggaW5wdXQgaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGg8VCBleHRlbmRzIE1hdFNsaWRlckhhcm5lc3M+KFxuICAgIHRoaXM6IENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcjxUPixcbiAgICBvcHRpb25zOiBTbGlkZXJIYXJuZXNzRmlsdGVycyA9IHt9LFxuICApOiBIYXJuZXNzUHJlZGljYXRlPFQ+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUodGhpcywgb3B0aW9ucylcbiAgICAgIC5hZGRPcHRpb24oJ2lzUmFuZ2UnLCBvcHRpb25zLmlzUmFuZ2UsIGFzeW5jIChoYXJuZXNzLCB2YWx1ZSkgPT4ge1xuICAgICAgICByZXR1cm4gKGF3YWl0IGhhcm5lc3MuaXNSYW5nZSgpKSA9PT0gdmFsdWU7XG4gICAgICB9KVxuICAgICAgLmFkZE9wdGlvbignZGlzYWJsZWQnLCBvcHRpb25zLmRpc2FibGVkLCBhc3luYyAoaGFybmVzcywgZGlzYWJsZWQpID0+IHtcbiAgICAgICAgcmV0dXJuIChhd2FpdCBoYXJuZXNzLmlzRGlzYWJsZWQoKSkgPT09IGRpc2FibGVkO1xuICAgICAgfSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgc3RhcnQgdGh1bWIgb2YgdGhlIHNsaWRlciAob25seSBhcHBsaWNhYmxlIGZvciByYW5nZSBzbGlkZXJzKS4gKi9cbiAgYXN5bmMgZ2V0U3RhcnRUaHVtYigpOiBQcm9taXNlPE1hdFNsaWRlclRodW1iSGFybmVzcz4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaXNSYW5nZSgpKSkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICdgZ2V0U3RhcnRUaHVtYmAgaXMgb25seSBhcHBsaWNhYmxlIGZvciByYW5nZSBzbGlkZXJzLiAnICtcbiAgICAgICAgICAnRGlkIHlvdSBtZWFuIHRvIHVzZSBgZ2V0RW5kVGh1bWJgPycsXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yKE1hdFNsaWRlclRodW1iSGFybmVzcy53aXRoKHtwb3NpdGlvbjogVGh1bWJQb3NpdGlvbi5TVEFSVH0pKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRodW1iIChmb3Igc2luZ2xlIHBvaW50IHNsaWRlcnMpLCBvciB0aGUgZW5kIHRodW1iIChmb3IgcmFuZ2Ugc2xpZGVycykuICovXG4gIGFzeW5jIGdldEVuZFRodW1iKCk6IFByb21pc2U8TWF0U2xpZGVyVGh1bWJIYXJuZXNzPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvcihNYXRTbGlkZXJUaHVtYkhhcm5lc3Mud2l0aCh7cG9zaXRpb246IFRodW1iUG9zaXRpb24uRU5EfSkpKCk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBzbGlkZXIgaXMgYSByYW5nZSBzbGlkZXIuICovXG4gIGFzeW5jIGlzUmFuZ2UoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21kYy1zbGlkZXItLXJhbmdlJyk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBzbGlkZXIgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21kYy1zbGlkZXItLWRpc2FibGVkJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdmFsdWUgc3RlcCBpbmNyZW1lbnRzIG9mIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGdldFN0ZXAoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAvLyBUaGUgc2FtZSBzdGVwIHZhbHVlIGlzIGZvcndhcmRlZCB0byBib3RoIHRodW1icy5cbiAgICBjb25zdCBzdGFydEhvc3QgPSBhd2FpdCAoYXdhaXQgdGhpcy5nZXRFbmRUaHVtYigpKS5ob3N0KCk7XG4gICAgcmV0dXJuIGNvZXJjZU51bWJlclByb3BlcnR5KGF3YWl0IHN0YXJ0SG9zdC5nZXRQcm9wZXJ0eTxzdHJpbmc+KCdzdGVwJykpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG1heGltdW0gdmFsdWUgb2YgdGhlIHNsaWRlci4gKi9cbiAgYXN5bmMgZ2V0TWF4VmFsdWUoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuZ2V0RW5kVGh1bWIoKSkuZ2V0TWF4VmFsdWUoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtaW5pbXVtIHZhbHVlIG9mIHRoZSBzbGlkZXIuICovXG4gIGFzeW5jIGdldE1pblZhbHVlKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgY29uc3Qgc3RhcnRUaHVtYiA9IChhd2FpdCB0aGlzLmlzUmFuZ2UoKSlcbiAgICAgID8gYXdhaXQgdGhpcy5nZXRTdGFydFRodW1iKClcbiAgICAgIDogYXdhaXQgdGhpcy5nZXRFbmRUaHVtYigpO1xuICAgIHJldHVybiBzdGFydFRodW1iLmdldE1pblZhbHVlKCk7XG4gIH1cbn1cbiJdfQ==
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatStepHarness } from './step-harness';
/** Harness for interacting with a standard Material stepper in tests. */
export class MatStepperHarness extends ComponentHarness {
    /** The selector for the host element of a `MatStepper` instance. */
    static { this.hostSelector = '.mat-stepper-horizontal, .mat-stepper-vertical'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepperHarness` that meets
     * certain criteria.
     * @param options Options for filtering which stepper instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatStepperHarness, options).addOption('orientation', options.orientation, async (harness, orientation) => (await harness.getOrientation()) === orientation);
    }
    /**
     * Gets the list of steps in the stepper.
     * @param filter Optionally filters which steps are included.
     */
    async getSteps(filter = {}) {
        return this.locatorForAll(MatStepHarness.with(filter))();
    }
    /** Gets the orientation of the stepper. */
    async getOrientation() {
        const host = await this.host();
        return (await host.hasClass('mat-stepper-horizontal'))
            ? 0 /* StepperOrientation.HORIZONTAL */
            : 1 /* StepperOrientation.VERTICAL */;
    }
    /**
     * Selects a step in this stepper.
     * @param filter An optional filter to apply to the child steps. The first step matching the
     *    filter will be selected.
     */
    async selectStep(filter = {}) {
        const steps = await this.getSteps(filter);
        if (!steps.length) {
            throw Error(`Cannot find mat-step matching filter ${JSON.stringify(filter)}`);
        }
        await steps[0].select();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvdGVzdGluZy9zdGVwcGVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBTzlDLHlFQUF5RTtBQUN6RSxNQUFNLE9BQU8saUJBQWtCLFNBQVEsZ0JBQWdCO0lBQ3JELG9FQUFvRTthQUM3RCxpQkFBWSxHQUFHLGdEQUFnRCxDQUFDO0lBRXZFOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFpQyxFQUFFO1FBQzdDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQy9ELGFBQWEsRUFDYixPQUFPLENBQUMsV0FBVyxFQUNuQixLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxLQUFLLFdBQVcsQ0FDakYsQ0FBQztJQUNKLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQTZCLEVBQUU7UUFDNUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzNELENBQUM7SUFFRCwyQ0FBMkM7SUFDM0MsS0FBSyxDQUFDLGNBQWM7UUFDbEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3BELENBQUM7WUFDRCxDQUFDLG9DQUE0QixDQUFDO0lBQ2xDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFVBQVUsQ0FBQyxTQUE2QixFQUFFO1FBQzlDLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNqQixNQUFNLEtBQUssQ0FBQyx3Q0FBd0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDL0U7UUFDRCxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUMxQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXRTdGVwSGFybmVzc30gZnJvbSAnLi9zdGVwLWhhcm5lc3MnO1xuaW1wb3J0IHtcbiAgU3RlcHBlckhhcm5lc3NGaWx0ZXJzLFxuICBTdGVwSGFybmVzc0ZpbHRlcnMsXG4gIFN0ZXBwZXJPcmllbnRhdGlvbixcbn0gZnJvbSAnLi9zdGVwLWhhcm5lc3MtZmlsdGVycyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgTWF0ZXJpYWwgc3RlcHBlciBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTdGVwcGVySGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFN0ZXBwZXJgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc3RlcHBlci1ob3Jpem9udGFsLCAubWF0LXN0ZXBwZXItdmVydGljYWwnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRTdGVwcGVySGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggc3RlcHBlciBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBTdGVwcGVySGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0U3RlcHBlckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U3RlcHBlckhhcm5lc3MsIG9wdGlvbnMpLmFkZE9wdGlvbihcbiAgICAgICdvcmllbnRhdGlvbicsXG4gICAgICBvcHRpb25zLm9yaWVudGF0aW9uLFxuICAgICAgYXN5bmMgKGhhcm5lc3MsIG9yaWVudGF0aW9uKSA9PiAoYXdhaXQgaGFybmVzcy5nZXRPcmllbnRhdGlvbigpKSA9PT0gb3JpZW50YXRpb24sXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBsaXN0IG9mIHN0ZXBzIGluIHRoZSBzdGVwcGVyLlxuICAgKiBAcGFyYW0gZmlsdGVyIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCBzdGVwcyBhcmUgaW5jbHVkZWQuXG4gICAqL1xuICBhc3luYyBnZXRTdGVwcyhmaWx0ZXI6IFN0ZXBIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRTdGVwSGFybmVzc1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbChNYXRTdGVwSGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgb3JpZW50YXRpb24gb2YgdGhlIHN0ZXBwZXIuICovXG4gIGFzeW5jIGdldE9yaWVudGF0aW9uKCk6IFByb21pc2U8U3RlcHBlck9yaWVudGF0aW9uPiB7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IHRoaXMuaG9zdCgpO1xuICAgIHJldHVybiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LXN0ZXBwZXItaG9yaXpvbnRhbCcpKVxuICAgICAgPyBTdGVwcGVyT3JpZW50YXRpb24uSE9SSVpPTlRBTFxuICAgICAgOiBTdGVwcGVyT3JpZW50YXRpb24uVkVSVElDQUw7XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyBhIHN0ZXAgaW4gdGhpcyBzdGVwcGVyLlxuICAgKiBAcGFyYW0gZmlsdGVyIEFuIG9wdGlvbmFsIGZpbHRlciB0byBhcHBseSB0byB0aGUgY2hpbGQgc3RlcHMuIFRoZSBmaXJzdCBzdGVwIG1hdGNoaW5nIHRoZVxuICAgKiAgICBmaWx0ZXIgd2lsbCBiZSBzZWxlY3RlZC5cbiAgICovXG4gIGFzeW5jIHNlbGVjdFN0ZXAoZmlsdGVyOiBTdGVwSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHN0ZXBzID0gYXdhaXQgdGhpcy5nZXRTdGVwcyhmaWx0ZXIpO1xuICAgIGlmICghc3RlcHMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2Fubm90IGZpbmQgbWF0LXN0ZXAgbWF0Y2hpbmcgZmlsdGVyICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVyKX1gKTtcbiAgICB9XG4gICAgYXdhaXQgc3RlcHNbMF0uc2VsZWN0KCk7XG4gIH1cbn1cbiJdfQ==
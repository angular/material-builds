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
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatStepperHarness` that meets
     * certain criteria.
     * @param options Options for filtering which stepper instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatStepperHarness, options)
            .addOption('orientation', options.orientation, async (harness, orientation) => (await harness.getOrientation()) === orientation);
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
        return (await host.hasClass('mat-stepper-horizontal')) ?
            0 /* HORIZONTAL */ : 1 /* VERTICAL */;
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
/** The selector for the host element of a `MatStepper` instance. */
MatStepperHarness.hostSelector = '.mat-stepper-horizontal, .mat-stepper-vertical';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3N0ZXBwZXIvdGVzdGluZy9zdGVwcGVyLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBTzlDLHlFQUF5RTtBQUN6RSxNQUFNLE9BQU8saUJBQWtCLFNBQVEsZ0JBQWdCO0lBSXJEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFpQyxFQUFFO1FBQzdDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUM7YUFDbEQsU0FBUyxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsV0FBVyxFQUN6QyxLQUFLLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxLQUFLLFdBQVcsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQTZCLEVBQUU7UUFDNUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzNELENBQUM7SUFFRCwyQ0FBMkM7SUFDM0MsS0FBSyxDQUFDLGNBQWM7UUFDbEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzsrQkFDdEIsQ0FBQyxpQkFBNEIsQ0FBQztJQUNsRSxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxVQUFVLENBQUMsU0FBNkIsRUFBRTtRQUM5QyxNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDakIsTUFBTSxLQUFLLENBQUMsd0NBQXdDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQy9FO1FBQ0QsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDMUIsQ0FBQzs7QUF6Q0Qsb0VBQW9FO0FBQzdELDhCQUFZLEdBQUcsZ0RBQWdELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge01hdFN0ZXBIYXJuZXNzfSBmcm9tICcuL3N0ZXAtaGFybmVzcyc7XG5pbXBvcnQge1xuICBTdGVwcGVySGFybmVzc0ZpbHRlcnMsXG4gIFN0ZXBIYXJuZXNzRmlsdGVycyxcbiAgU3RlcHBlck9yaWVudGF0aW9uLFxufSBmcm9tICcuL3N0ZXAtaGFybmVzcy1maWx0ZXJzJztcblxuLyoqIEhhcm5lc3MgZm9yIGludGVyYWN0aW5nIHdpdGggYSBzdGFuZGFyZCBNYXRlcmlhbCBzdGVwcGVyIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFN0ZXBwZXJIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0U3RlcHBlcmAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1zdGVwcGVyLWhvcml6b250YWwsIC5tYXQtc3RlcHBlci12ZXJ0aWNhbCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYE1hdFN0ZXBwZXJIYXJuZXNzYCB0aGF0IG1lZXRzXG4gICAqIGNlcnRhaW4gY3JpdGVyaWEuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIGZpbHRlcmluZyB3aGljaCBzdGVwcGVyIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFN0ZXBwZXJIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRTdGVwcGVySGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTdGVwcGVySGFybmVzcywgb3B0aW9ucylcbiAgICAgICAgLmFkZE9wdGlvbignb3JpZW50YXRpb24nLCBvcHRpb25zLm9yaWVudGF0aW9uLFxuICAgICAgICAgICAgYXN5bmMgKGhhcm5lc3MsIG9yaWVudGF0aW9uKSA9PiAoYXdhaXQgaGFybmVzcy5nZXRPcmllbnRhdGlvbigpKSA9PT0gb3JpZW50YXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGxpc3Qgb2Ygc3RlcHMgaW4gdGhlIHN0ZXBwZXIuXG4gICAqIEBwYXJhbSBmaWx0ZXIgT3B0aW9uYWxseSBmaWx0ZXJzIHdoaWNoIHN0ZXBzIGFyZSBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldFN0ZXBzKGZpbHRlcjogU3RlcEhhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdFN0ZXBIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdFN0ZXBIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgc3RlcHBlci4gKi9cbiAgYXN5bmMgZ2V0T3JpZW50YXRpb24oKTogUHJvbWlzZTxTdGVwcGVyT3JpZW50YXRpb24+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgcmV0dXJuIChhd2FpdCBob3N0Lmhhc0NsYXNzKCdtYXQtc3RlcHBlci1ob3Jpem9udGFsJykpID9cbiAgICAgICAgU3RlcHBlck9yaWVudGF0aW9uLkhPUklaT05UQUwgOiBTdGVwcGVyT3JpZW50YXRpb24uVkVSVElDQUw7XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyBhIHN0ZXAgaW4gdGhpcyBzdGVwcGVyLlxuICAgKiBAcGFyYW0gZmlsdGVyIEFuIG9wdGlvbmFsIGZpbHRlciB0byBhcHBseSB0byB0aGUgY2hpbGQgc3RlcHMuIFRoZSBmaXJzdCBzdGVwIG1hdGNoaW5nIHRoZVxuICAgKiAgICBmaWx0ZXIgd2lsbCBiZSBzZWxlY3RlZC5cbiAgICovXG4gIGFzeW5jIHNlbGVjdFN0ZXAoZmlsdGVyOiBTdGVwSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHN0ZXBzID0gYXdhaXQgdGhpcy5nZXRTdGVwcyhmaWx0ZXIpO1xuICAgIGlmICghc3RlcHMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBFcnJvcihgQ2Fubm90IGZpbmQgbWF0LXN0ZXAgbWF0Y2hpbmcgZmlsdGVyICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVyKX1gKTtcbiAgICB9XG4gICAgYXdhaXQgc3RlcHNbMF0uc2VsZWN0KCk7XG4gIH1cbn1cbiJdfQ==
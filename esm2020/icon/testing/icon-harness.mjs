/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-icon in tests. */
export class MatIconHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatIconHarness` that meets
     * certain criteria.
     * @param options Options for filtering which icon instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatIconHarness, options)
            .addOption('type', options.type, async (harness, type) => (await harness.getType()) === type)
            .addOption('name', options.name, (harness, text) => HarnessPredicate.stringMatches(harness.getName(), text))
            .addOption('namespace', options.namespace, (harness, text) => HarnessPredicate.stringMatches(harness.getNamespace(), text));
    }
    /** Gets the type of the icon. */
    async getType() {
        const type = await (await this.host()).getAttribute('data-mat-icon-type');
        return type === 'svg' ? 0 /* SVG */ : 1 /* FONT */;
    }
    /** Gets the name of the icon. */
    async getName() {
        const host = await this.host();
        const nameFromDom = await host.getAttribute('data-mat-icon-name');
        // If we managed to figure out the name from the attribute, use it.
        if (nameFromDom) {
            return nameFromDom;
        }
        // Some icons support defining the icon as a ligature.
        // As a fallback, try to extract it from the DOM text.
        if (await this.getType() === 1 /* FONT */) {
            return host.text();
        }
        return null;
    }
    /** Gets the namespace of the icon. */
    async getNamespace() {
        return (await this.host()).getAttribute('data-mat-icon-namespace');
    }
    /** Gets whether the icon is inline. */
    async isInline() {
        return (await this.host()).hasClass('mat-icon-inline');
    }
}
/** The selector for the host element of a `MatIcon` instance. */
MatIconHarness.hostSelector = '.mat-icon';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2ljb24vdGVzdGluZy9pY29uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFJeEUsaUVBQWlFO0FBQ2pFLE1BQU0sT0FBTyxjQUFlLFNBQVEsZ0JBQWdCO0lBSWxEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUE4QixFQUFFO1FBQzFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDO2FBQy9DLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFDM0IsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUM7YUFDL0QsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUMzQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDOUUsU0FBUyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUNyQyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMzRixDQUFDO0lBRUQsaUNBQWlDO0lBQ2pDLEtBQUssQ0FBQyxPQUFPO1FBQ1gsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDMUUsT0FBTyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsYUFBYyxDQUFDLGFBQWMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsaUNBQWlDO0lBQ2pDLEtBQUssQ0FBQyxPQUFPO1FBQ1gsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFbEUsbUVBQW1FO1FBQ25FLElBQUksV0FBVyxFQUFFO1lBQ2YsT0FBTyxXQUFXLENBQUM7U0FDcEI7UUFFRCxzREFBc0Q7UUFDdEQsc0RBQXNEO1FBQ3RELElBQUksTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLGlCQUFrQixFQUFFO1lBQzFDLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3BCO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsc0NBQXNDO0lBQ3RDLEtBQUssQ0FBQyxZQUFZO1FBQ2hCLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ3JFLENBQUM7SUFFRCx1Q0FBdUM7SUFDdkMsS0FBSyxDQUFDLFFBQVE7UUFDWixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN6RCxDQUFDOztBQXBERCxpRUFBaUU7QUFDMUQsMkJBQVksR0FBRyxXQUFXLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0ljb25IYXJuZXNzRmlsdGVycywgSWNvblR5cGV9IGZyb20gJy4vaWNvbi1oYXJuZXNzLWZpbHRlcnMnO1xuXG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LWljb24gaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0SWNvbkhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRJY29uYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWljb24nO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIGBNYXRJY29uSGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggaWNvbiBpbnN0YW5jZXMgYXJlIGNvbnNpZGVyZWQgYSBtYXRjaC5cbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBJY29uSGFybmVzc0ZpbHRlcnMgPSB7fSk6IEhhcm5lc3NQcmVkaWNhdGU8TWF0SWNvbkhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0SWNvbkhhcm5lc3MsIG9wdGlvbnMpXG4gICAgICAgIC5hZGRPcHRpb24oJ3R5cGUnLCBvcHRpb25zLnR5cGUsXG4gICAgICAgICAgICBhc3luYyAoaGFybmVzcywgdHlwZSkgPT4gKGF3YWl0IGhhcm5lc3MuZ2V0VHlwZSgpKSA9PT0gdHlwZSlcbiAgICAgICAgLmFkZE9wdGlvbignbmFtZScsIG9wdGlvbnMubmFtZSxcbiAgICAgICAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXROYW1lKCksIHRleHQpKVxuICAgICAgICAuYWRkT3B0aW9uKCduYW1lc3BhY2UnLCBvcHRpb25zLm5hbWVzcGFjZSxcbiAgICAgICAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXROYW1lc3BhY2UoKSwgdGV4dCkpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHR5cGUgb2YgdGhlIGljb24uICovXG4gIGFzeW5jIGdldFR5cGUoKTogUHJvbWlzZTxJY29uVHlwZT4ge1xuICAgIGNvbnN0IHR5cGUgPSBhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnZGF0YS1tYXQtaWNvbi10eXBlJyk7XG4gICAgcmV0dXJuIHR5cGUgPT09ICdzdmcnID8gSWNvblR5cGUuU1ZHIDogSWNvblR5cGUuRk9OVDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYW1lIG9mIHRoZSBpY29uLiAqL1xuICBhc3luYyBnZXROYW1lKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcbiAgICBjb25zdCBuYW1lRnJvbURvbSA9IGF3YWl0IGhvc3QuZ2V0QXR0cmlidXRlKCdkYXRhLW1hdC1pY29uLW5hbWUnKTtcblxuICAgIC8vIElmIHdlIG1hbmFnZWQgdG8gZmlndXJlIG91dCB0aGUgbmFtZSBmcm9tIHRoZSBhdHRyaWJ1dGUsIHVzZSBpdC5cbiAgICBpZiAobmFtZUZyb21Eb20pIHtcbiAgICAgIHJldHVybiBuYW1lRnJvbURvbTtcbiAgICB9XG5cbiAgICAvLyBTb21lIGljb25zIHN1cHBvcnQgZGVmaW5pbmcgdGhlIGljb24gYXMgYSBsaWdhdHVyZS5cbiAgICAvLyBBcyBhIGZhbGxiYWNrLCB0cnkgdG8gZXh0cmFjdCBpdCBmcm9tIHRoZSBET00gdGV4dC5cbiAgICBpZiAoYXdhaXQgdGhpcy5nZXRUeXBlKCkgPT09IEljb25UeXBlLkZPTlQpIHtcbiAgICAgIHJldHVybiBob3N0LnRleHQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBuYW1lc3BhY2Ugb2YgdGhlIGljb24uICovXG4gIGFzeW5jIGdldE5hbWVzcGFjZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF0LWljb24tbmFtZXNwYWNlJyk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBpY29uIGlzIGlubGluZS4gKi9cbiAgYXN5bmMgaXNJbmxpbmUoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1pY29uLWlubGluZScpO1xuICB9XG59XG4iXX0=
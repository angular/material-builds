/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/**
 * Base class for the drawer harness functionality.
 * @docs-private
 */
export class MatDrawerHarnessBase extends ContentContainerComponentHarness {
    /** Whether the drawer is open. */
    async isOpen() {
        return (await this.host()).hasClass('mat-drawer-opened');
    }
    /** Gets the position of the drawer inside its container. */
    async getPosition() {
        const host = await this.host();
        return (await host.hasClass('mat-drawer-end')) ? 'end' : 'start';
    }
    /** Gets the mode that the drawer is in. */
    async getMode() {
        const host = await this.host();
        if (await host.hasClass('mat-drawer-push')) {
            return 'push';
        }
        if (await host.hasClass('mat-drawer-side')) {
            return 'side';
        }
        return 'over';
    }
}
/** Harness for interacting with a standard mat-drawer in tests. */
class MatDrawerHarness extends MatDrawerHarnessBase {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatDrawerHarness` that meets
     * certain criteria.
     * @param options Options for filtering which drawer instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatDrawerHarness, options).addOption('position', options.position, async (harness, position) => (await harness.getPosition()) === position);
    }
}
/** The selector for the host element of a `MatDrawer` instance. */
MatDrawerHarness.hostSelector = '.mat-drawer';
export { MatDrawerHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2lkZW5hdi90ZXN0aW5nL2RyYXdlci1oYXJuZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxnQ0FBZ0MsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBR3hGOzs7R0FHRztBQUNILE1BQU0sT0FBTyxvQkFBcUIsU0FBUSxnQ0FBd0M7SUFDaEYsa0NBQWtDO0lBQ2xDLEtBQUssQ0FBQyxNQUFNO1FBQ1YsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELDREQUE0RDtJQUM1RCxLQUFLLENBQUMsV0FBVztRQUNmLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQy9CLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUNuRSxDQUFDO0lBRUQsMkNBQTJDO0lBQzNDLEtBQUssQ0FBQyxPQUFPO1FBQ1gsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFL0IsSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUMxQyxPQUFPLE1BQU0sQ0FBQztTQUNmO1FBRUQsSUFBSSxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsRUFBRTtZQUMxQyxPQUFPLE1BQU0sQ0FBQztTQUNmO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztDQUNGO0FBRUQsbUVBQW1FO0FBQ25FLE1BQWEsZ0JBQWlCLFNBQVEsb0JBQW9CO0lBSXhEOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFnQyxFQUFFO1FBQzVDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQzlELFVBQVUsRUFDVixPQUFPLENBQUMsUUFBUSxFQUNoQixLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FDeEUsQ0FBQztJQUNKLENBQUM7O0FBZkQsbUVBQW1FO0FBQzVELDZCQUFZLEdBQUcsYUFBYSxDQUFDO1NBRnpCLGdCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0RyYXdlckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2RyYXdlci1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHRoZSBkcmF3ZXIgaGFybmVzcyBmdW5jdGlvbmFsaXR5LlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY2xhc3MgTWF0RHJhd2VySGFybmVzc0Jhc2UgZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzczxzdHJpbmc+IHtcbiAgLyoqIFdoZXRoZXIgdGhlIGRyYXdlciBpcyBvcGVuLiAqL1xuICBhc3luYyBpc09wZW4oKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1kcmF3ZXItb3BlbmVkJyk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgcG9zaXRpb24gb2YgdGhlIGRyYXdlciBpbnNpZGUgaXRzIGNvbnRhaW5lci4gKi9cbiAgYXN5bmMgZ2V0UG9zaXRpb24oKTogUHJvbWlzZTwnc3RhcnQnIHwgJ2VuZCc+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgcmV0dXJuIChhd2FpdCBob3N0Lmhhc0NsYXNzKCdtYXQtZHJhd2VyLWVuZCcpKSA/ICdlbmQnIDogJ3N0YXJ0JztcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBtb2RlIHRoYXQgdGhlIGRyYXdlciBpcyBpbi4gKi9cbiAgYXN5bmMgZ2V0TW9kZSgpOiBQcm9taXNlPCdvdmVyJyB8ICdwdXNoJyB8ICdzaWRlJz4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcblxuICAgIGlmIChhd2FpdCBob3N0Lmhhc0NsYXNzKCdtYXQtZHJhd2VyLXB1c2gnKSkge1xuICAgICAgcmV0dXJuICdwdXNoJztcbiAgICB9XG5cbiAgICBpZiAoYXdhaXQgaG9zdC5oYXNDbGFzcygnbWF0LWRyYXdlci1zaWRlJykpIHtcbiAgICAgIHJldHVybiAnc2lkZSc7XG4gICAgfVxuXG4gICAgcmV0dXJuICdvdmVyJztcbiAgfVxufVxuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1kcmF3ZXIgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0RHJhd2VySGFybmVzcyBleHRlbmRzIE1hdERyYXdlckhhcm5lc3NCYXNlIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXREcmF3ZXJgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtZHJhd2VyJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0RHJhd2VySGFybmVzc2AgdGhhdCBtZWV0c1xuICAgKiBjZXJ0YWluIGNyaXRlcmlhLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBmaWx0ZXJpbmcgd2hpY2ggZHJhd2VyIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IERyYXdlckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdERyYXdlckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0RHJhd2VySGFybmVzcywgb3B0aW9ucykuYWRkT3B0aW9uKFxuICAgICAgJ3Bvc2l0aW9uJyxcbiAgICAgIG9wdGlvbnMucG9zaXRpb24sXG4gICAgICBhc3luYyAoaGFybmVzcywgcG9zaXRpb24pID0+IChhd2FpdCBoYXJuZXNzLmdldFBvc2l0aW9uKCkpID09PSBwb3NpdGlvbixcbiAgICApO1xuICB9XG59XG4iXX0=
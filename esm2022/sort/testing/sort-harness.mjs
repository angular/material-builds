/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { MatSortHeaderHarness } from './sort-header-harness';
/** Harness for interacting with a standard `mat-sort` in tests. */
export class MatSortHarness extends ComponentHarness {
    static { this.hostSelector = '.mat-sort'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `mat-sort` with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatSortHarness, options);
    }
    /** Gets all of the sort headers in the `mat-sort`. */
    async getSortHeaders(filter = {}) {
        return this.locatorForAll(MatSortHeaderHarness.with(filter))();
    }
    /** Gets the selected header in the `mat-sort`. */
    async getActiveHeader() {
        const headers = await this.getSortHeaders();
        for (let i = 0; i < headers.length; i++) {
            if (await headers[i].isActive()) {
                return headers[i];
            }
        }
        return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NvcnQvdGVzdGluZy9zb3J0LWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFFeEUsT0FBTyxFQUFDLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFM0QsbUVBQW1FO0FBQ25FLE1BQU0sT0FBTyxjQUFlLFNBQVEsZ0JBQWdCO2FBQzNDLGlCQUFZLEdBQUcsV0FBVyxDQUFDO0lBRWxDOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQThCLEVBQUU7UUFDMUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsc0RBQXNEO0lBQ3RELEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBbUMsRUFBRTtRQUN4RCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNqRSxDQUFDO0lBRUQsa0RBQWtEO0lBQ2xELEtBQUssQ0FBQyxlQUFlO1FBQ25CLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzVDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLElBQUksTUFBTSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQy9CLE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ25CO1NBQ0Y7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1NvcnRIYXJuZXNzRmlsdGVycywgU29ydEhlYWRlckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3NvcnQtaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7TWF0U29ydEhlYWRlckhhcm5lc3N9IGZyb20gJy4vc29ydC1oZWFkZXItaGFybmVzcyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgYG1hdC1zb3J0YCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRTb3J0SGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtc29ydCc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgYG1hdC1zb3J0YCB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFNvcnRIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRTb3J0SGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRTb3J0SGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgb2YgdGhlIHNvcnQgaGVhZGVycyBpbiB0aGUgYG1hdC1zb3J0YC4gKi9cbiAgYXN5bmMgZ2V0U29ydEhlYWRlcnMoZmlsdGVyOiBTb3J0SGVhZGVySGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0U29ydEhlYWRlckhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0U29ydEhlYWRlckhhcm5lc3Mud2l0aChmaWx0ZXIpKSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHNlbGVjdGVkIGhlYWRlciBpbiB0aGUgYG1hdC1zb3J0YC4gKi9cbiAgYXN5bmMgZ2V0QWN0aXZlSGVhZGVyKCk6IFByb21pc2U8TWF0U29ydEhlYWRlckhhcm5lc3MgfCBudWxsPiB7XG4gICAgY29uc3QgaGVhZGVycyA9IGF3YWl0IHRoaXMuZ2V0U29ydEhlYWRlcnMoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhlYWRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChhd2FpdCBoZWFkZXJzW2ldLmlzQWN0aXZlKCkpIHtcbiAgICAgICAgcmV0dXJuIGhlYWRlcnNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXX0=
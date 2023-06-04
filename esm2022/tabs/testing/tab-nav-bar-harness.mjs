/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, parallel, } from '@angular/cdk/testing';
import { MatTabLinkHarness } from './tab-link-harness';
import { MatTabNavPanelHarness } from './tab-nav-panel-harness';
/** Harness for interacting with an MDC-based mat-tab-nav-bar in tests. */
export class MatTabNavBarHarness extends ComponentHarness {
    /** The selector for the host element of a `MatTabNavBar` instance. */
    static { this.hostSelector = '.mat-mdc-tab-nav-bar'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a tab nav bar with specific
     * attributes.
     * @param options Options for filtering which tab nav bar instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options);
    }
    /**
     * Gets the list of links in the nav bar.
     * @param filter Optionally filters which links are included.
     */
    async getLinks(filter = {}) {
        return this.locatorForAll(MatTabLinkHarness.with(filter))();
    }
    /** Gets the active link in the nav bar. */
    async getActiveLink() {
        const links = await this.getLinks();
        const isActive = await parallel(() => links.map(t => t.isActive()));
        for (let i = 0; i < links.length; i++) {
            if (isActive[i]) {
                return links[i];
            }
        }
        throw new Error('No active link could be found.');
    }
    /**
     * Clicks a link inside the nav bar.
     * @param filter An optional filter to apply to the child link. The first link matching the filter
     *     will be clicked.
     */
    async clickLink(filter = {}) {
        const tabs = await this.getLinks(filter);
        if (!tabs.length) {
            throw Error(`Cannot find mat-tab-link matching filter ${JSON.stringify(filter)}`);
        }
        await tabs[0].click();
    }
    /** Gets the panel associated with the nav bar. */
    async getPanel() {
        const link = await this.getActiveLink();
        const host = await link.host();
        const panelId = await host.getAttribute('aria-controls');
        if (!panelId) {
            throw Error('No panel is controlled by the nav bar.');
        }
        const filter = { selector: `#${panelId}` };
        return await this.documentRootLocatorFactory().locatorFor(MatTabNavPanelHarness.with(filter))();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLW5hdi1iYXItaGFybmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL3Rlc3RpbmcvdGFiLW5hdi1iYXItaGFybmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsZ0JBQWdCLEVBRWhCLGdCQUFnQixFQUNoQixRQUFRLEdBQ1QsTUFBTSxzQkFBc0IsQ0FBQztBQU05QixPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUU5RCwwRUFBMEU7QUFDMUUsTUFBTSxPQUFPLG1CQUFvQixTQUFRLGdCQUFnQjtJQUN2RCxzRUFBc0U7YUFDL0QsaUJBQVksR0FBRyxzQkFBc0IsQ0FBQztJQUU3Qzs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBRVQsVUFBbUMsRUFBRTtRQUVyQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQWdDLEVBQUU7UUFDL0MsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDOUQsQ0FBQztJQUVELDJDQUEyQztJQUMzQyxLQUFLLENBQUMsYUFBYTtRQUNqQixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDZixPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNqQjtTQUNGO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFnQyxFQUFFO1FBQ2hELE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixNQUFNLEtBQUssQ0FBQyw0Q0FBNEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDbkY7UUFDRCxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsa0RBQWtEO0lBQ2xELEtBQUssQ0FBQyxRQUFRO1FBQ1osTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDeEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixNQUFNLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1NBQ3ZEO1FBRUQsTUFBTSxNQUFNLEdBQThCLEVBQUMsUUFBUSxFQUFFLElBQUksT0FBTyxFQUFFLEVBQUMsQ0FBQztRQUNwRSxPQUFPLE1BQU0sSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDbEcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnRIYXJuZXNzLFxuICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3IsXG4gIEhhcm5lc3NQcmVkaWNhdGUsXG4gIHBhcmFsbGVsLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1xuICBUYWJOYXZCYXJIYXJuZXNzRmlsdGVycyxcbiAgVGFiTmF2UGFuZWxIYXJuZXNzRmlsdGVycyxcbiAgVGFiTGlua0hhcm5lc3NGaWx0ZXJzLFxufSBmcm9tICcuL3RhYi1oYXJuZXNzLWZpbHRlcnMnO1xuaW1wb3J0IHtNYXRUYWJMaW5rSGFybmVzc30gZnJvbSAnLi90YWItbGluay1oYXJuZXNzJztcbmltcG9ydCB7TWF0VGFiTmF2UGFuZWxIYXJuZXNzfSBmcm9tICcuL3RhYi1uYXYtcGFuZWwtaGFybmVzcyc7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGFuIE1EQy1iYXNlZCBtYXQtdGFiLW5hdi1iYXIgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0VGFiTmF2QmFySGFybmVzcyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3Mge1xuICAvKiogVGhlIHNlbGVjdG9yIGZvciB0aGUgaG9zdCBlbGVtZW50IG9mIGEgYE1hdFRhYk5hdkJhcmAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1tZGMtdGFiLW5hdi1iYXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHRhYiBuYXYgYmFyIHdpdGggc3BlY2lmaWNcbiAgICogYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIHRhYiBuYXYgYmFyIGluc3RhbmNlcyBhcmUgY29uc2lkZXJlZCBhIG1hdGNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoPFQgZXh0ZW5kcyBNYXRUYWJOYXZCYXJIYXJuZXNzPihcbiAgICB0aGlzOiBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8VD4sXG4gICAgb3B0aW9uczogVGFiTmF2QmFySGFybmVzc0ZpbHRlcnMgPSB7fSxcbiAgKTogSGFybmVzc1ByZWRpY2F0ZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKHRoaXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGxpc3Qgb2YgbGlua3MgaW4gdGhlIG5hdiBiYXIuXG4gICAqIEBwYXJhbSBmaWx0ZXIgT3B0aW9uYWxseSBmaWx0ZXJzIHdoaWNoIGxpbmtzIGFyZSBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldExpbmtzKGZpbHRlcjogVGFiTGlua0hhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPE1hdFRhYkxpbmtIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdFRhYkxpbmtIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBhY3RpdmUgbGluayBpbiB0aGUgbmF2IGJhci4gKi9cbiAgYXN5bmMgZ2V0QWN0aXZlTGluaygpOiBQcm9taXNlPE1hdFRhYkxpbmtIYXJuZXNzPiB7XG4gICAgY29uc3QgbGlua3MgPSBhd2FpdCB0aGlzLmdldExpbmtzKCk7XG4gICAgY29uc3QgaXNBY3RpdmUgPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBsaW5rcy5tYXAodCA9PiB0LmlzQWN0aXZlKCkpKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoaXNBY3RpdmVbaV0pIHtcbiAgICAgICAgcmV0dXJuIGxpbmtzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGFjdGl2ZSBsaW5rIGNvdWxkIGJlIGZvdW5kLicpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsaWNrcyBhIGxpbmsgaW5zaWRlIHRoZSBuYXYgYmFyLlxuICAgKiBAcGFyYW0gZmlsdGVyIEFuIG9wdGlvbmFsIGZpbHRlciB0byBhcHBseSB0byB0aGUgY2hpbGQgbGluay4gVGhlIGZpcnN0IGxpbmsgbWF0Y2hpbmcgdGhlIGZpbHRlclxuICAgKiAgICAgd2lsbCBiZSBjbGlja2VkLlxuICAgKi9cbiAgYXN5bmMgY2xpY2tMaW5rKGZpbHRlcjogVGFiTGlua0hhcm5lc3NGaWx0ZXJzID0ge30pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB0YWJzID0gYXdhaXQgdGhpcy5nZXRMaW5rcyhmaWx0ZXIpO1xuICAgIGlmICghdGFicy5sZW5ndGgpIHtcbiAgICAgIHRocm93IEVycm9yKGBDYW5ub3QgZmluZCBtYXQtdGFiLWxpbmsgbWF0Y2hpbmcgZmlsdGVyICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVyKX1gKTtcbiAgICB9XG4gICAgYXdhaXQgdGFic1swXS5jbGljaygpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBhbmVsIGFzc29jaWF0ZWQgd2l0aCB0aGUgbmF2IGJhci4gKi9cbiAgYXN5bmMgZ2V0UGFuZWwoKTogUHJvbWlzZTxNYXRUYWJOYXZQYW5lbEhhcm5lc3M+IHtcbiAgICBjb25zdCBsaW5rID0gYXdhaXQgdGhpcy5nZXRBY3RpdmVMaW5rKCk7XG4gICAgY29uc3QgaG9zdCA9IGF3YWl0IGxpbmsuaG9zdCgpO1xuICAgIGNvbnN0IHBhbmVsSWQgPSBhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpO1xuICAgIGlmICghcGFuZWxJZCkge1xuICAgICAgdGhyb3cgRXJyb3IoJ05vIHBhbmVsIGlzIGNvbnRyb2xsZWQgYnkgdGhlIG5hdiBiYXIuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsdGVyOiBUYWJOYXZQYW5lbEhhcm5lc3NGaWx0ZXJzID0ge3NlbGVjdG9yOiBgIyR7cGFuZWxJZH1gfTtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpLmxvY2F0b3JGb3IoTWF0VGFiTmF2UGFuZWxIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxufVxuIl19
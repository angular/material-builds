/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness } from '@angular/cdk/testing';
import { MatDividerHarness } from '@angular/material/divider/testing';
import { MatSubheaderHarness } from './list-item-harness-base';
/**
 * Shared behavior among the harnesses for the various `MatList` flavors.
 * @template T A constructor type for a list item harness type used by this list harness.
 * @template C The list item harness type that `T` constructs.
 * @template F The filter type used filter list item harness of type `C`.
 * @docs-private
 */
export class MatListHarnessBase extends ComponentHarness {
    /**
     * Gets a list of harnesses representing the items in this list.
     * @param filters Optional filters used to narrow which harnesses are included
     * @return The list of items matching the given filters.
     */
    getItems(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(this._itemHarness.with(filters))();
        });
    }
    /**
     * Gets a list of `ListSection` representing the list items grouped by subheaders. If the list has
     * no subheaders it is represented as a single `ListSection` with an undefined `heading` property.
     * @param filters Optional filters used to narrow which list item harnesses are included
     * @return The list of items matching the given filters, grouped into sections by subheader.
     */
    getItemsGroupedBySubheader(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const listSections = [];
            let currentSection = { items: [] };
            const itemsAndSubheaders = yield this.getItemsWithSubheadersAndDividers({ item: filters, divider: false });
            for (const itemOrSubheader of itemsAndSubheaders) {
                if (itemOrSubheader instanceof MatSubheaderHarness) {
                    if (currentSection.heading !== undefined || currentSection.items.length) {
                        listSections.push(currentSection);
                    }
                    currentSection = { heading: itemOrSubheader.getText(), items: [] };
                }
                else {
                    currentSection.items.push(itemOrSubheader);
                }
            }
            if (currentSection.heading !== undefined || currentSection.items.length ||
                !listSections.length) {
                listSections.push(currentSection);
            }
            // Concurrently wait for all sections to resolve their heading if present.
            return Promise.all(listSections.map((s) => __awaiter(this, void 0, void 0, function* () { return ({ items: s.items, heading: yield s.heading }); })));
        });
    }
    /**
     * Gets a list of sub-lists representing the list items grouped by dividers. If the list has no
     * dividers it is represented as a list with a single sub-list.
     * @param filters Optional filters used to narrow which list item harnesses are included
     * @return The list of items matching the given filters, grouped into sub-lists by divider.
     */
    getItemsGroupedByDividers(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const listSections = [[]];
            const itemsAndDividers = yield this.getItemsWithSubheadersAndDividers({ item: filters, subheader: false });
            for (const itemOrDivider of itemsAndDividers) {
                if (itemOrDivider instanceof MatDividerHarness) {
                    listSections.push([]);
                }
                else {
                    listSections[listSections.length - 1].push(itemOrDivider);
                }
            }
            return listSections;
        });
    }
    getItemsWithSubheadersAndDividers(filters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = [];
            if (filters.item !== false) {
                query.push(this._itemHarness.with(filters.item || {}));
            }
            if (filters.subheader !== false) {
                query.push(MatSubheaderHarness.with(filters.subheader));
            }
            if (filters.divider !== false) {
                query.push(MatDividerHarness.with(filters.divider));
            }
            return this.locatorForAll(...query)();
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1oYXJuZXNzLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvbGlzdC90ZXN0aW5nL2xpc3QtaGFybmVzcy1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7QUFFSCxPQUFPLEVBQ0wsZ0JBQWdCLEVBR2pCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUF3QixpQkFBaUIsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBRTNGLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBVzdEOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBZ0Isa0JBS2hCLFNBQVEsZ0JBQWdCO0lBRzVCOzs7O09BSUc7SUFDRyxRQUFRLENBQUMsT0FBVzs7WUFDeEIsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMvRCxDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNHLDBCQUEwQixDQUFDLE9BQVc7O1lBQzFDLE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQztZQUN4QixJQUFJLGNBQWMsR0FBNEMsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFDLENBQUM7WUFDMUUsTUFBTSxrQkFBa0IsR0FDcEIsTUFBTSxJQUFJLENBQUMsaUNBQWlDLENBQUMsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1lBQ2xGLEtBQUssTUFBTSxlQUFlLElBQUksa0JBQWtCLEVBQUU7Z0JBQ2hELElBQUksZUFBZSxZQUFZLG1CQUFtQixFQUFFO29CQUNsRCxJQUFJLGNBQWMsQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO3dCQUN2RSxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3FCQUNuQztvQkFDRCxjQUFjLEdBQUcsRUFBQyxPQUFPLEVBQUUsZUFBZSxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUMsQ0FBQztpQkFDbEU7cUJBQU07b0JBQ0wsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7aUJBQzVDO2FBQ0Y7WUFDRCxJQUFJLGNBQWMsQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLGNBQWMsQ0FBQyxLQUFLLENBQUMsTUFBTTtnQkFDbkUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFO2dCQUN4QixZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ25DO1lBRUQsMEVBQTBFO1lBQzFFLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQU8sQ0FBQyxFQUFFLEVBQUUsZ0RBQzlDLE9BQUEsQ0FBQyxFQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxPQUFPLEVBQUMsQ0FBQyxDQUFBLEdBQUEsQ0FBQyxDQUFDLENBQUM7UUFDbkQsQ0FBQztLQUFBO0lBRUQ7Ozs7O09BS0c7SUFDRyx5QkFBeUIsQ0FBQyxPQUFXOztZQUN6QyxNQUFNLFlBQVksR0FBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sZ0JBQWdCLEdBQ2xCLE1BQU0sSUFBSSxDQUFDLGlDQUFpQyxDQUFDLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUNwRixLQUFLLE1BQU0sYUFBYSxJQUFJLGdCQUFnQixFQUFFO2dCQUM1QyxJQUFJLGFBQWEsWUFBWSxpQkFBaUIsRUFBRTtvQkFDOUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztpQkFDdkI7cUJBQU07b0JBQ0wsWUFBWSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUMzRDthQUNGO1lBQ0QsT0FBTyxZQUFZLENBQUM7UUFDdEIsQ0FBQztLQUFBO0lBb0RLLGlDQUFpQyxDQUFDLFVBSXBDLEVBQUU7O1lBQ0osTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxLQUFLLEVBQUU7Z0JBQzFCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFPLENBQUMsQ0FBQyxDQUFDO2FBQzdEO1lBQ0QsSUFBSSxPQUFPLENBQUMsU0FBUyxLQUFLLEtBQUssRUFBRTtnQkFDL0IsS0FBSyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7YUFDekQ7WUFDRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEtBQUssS0FBSyxFQUFFO2dCQUM3QixLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzthQUNyRDtZQUNELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDeEMsQ0FBQztLQUFBO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzUHJlZGljYXRlXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7RGl2aWRlckhhcm5lc3NGaWx0ZXJzLCBNYXREaXZpZGVySGFybmVzc30gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZGl2aWRlci90ZXN0aW5nJztcbmltcG9ydCB7QmFzZUxpc3RJdGVtSGFybmVzc0ZpbHRlcnMsIFN1YmhlYWRlckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2xpc3QtaGFybmVzcy1maWx0ZXJzJztcbmltcG9ydCB7TWF0U3ViaGVhZGVySGFybmVzc30gZnJvbSAnLi9saXN0LWl0ZW0taGFybmVzcy1iYXNlJztcblxuLyoqIFJlcHJlc2VudHMgYSBzZWN0aW9uIG9mIGEgbGlzdCBmYWxsaW5nIHVuZGVyIGEgc3BlY2lmaWMgaGVhZGVyLiAqL1xuZXhwb3J0IGludGVyZmFjZSBMaXN0U2VjdGlvbjxJPiB7XG4gIC8qKiBUaGUgaGVhZGluZyBmb3IgdGhpcyBsaXN0IHNlY3Rpb24uIGB1bmRlZmluZWRgIGlmIHRoZXJlIGlzIG5vIGhlYWRpbmcuICovXG4gIGhlYWRpbmc/OiBzdHJpbmc7XG5cbiAgLyoqIFRoZSBpdGVtcyBpbiB0aGlzIGxpc3Qgc2VjdGlvbi4gKi9cbiAgaXRlbXM6IElbXTtcbn1cblxuLyoqXG4gKiBTaGFyZWQgYmVoYXZpb3IgYW1vbmcgdGhlIGhhcm5lc3NlcyBmb3IgdGhlIHZhcmlvdXMgYE1hdExpc3RgIGZsYXZvcnMuXG4gKiBAdGVtcGxhdGUgVCBBIGNvbnN0cnVjdG9yIHR5cGUgZm9yIGEgbGlzdCBpdGVtIGhhcm5lc3MgdHlwZSB1c2VkIGJ5IHRoaXMgbGlzdCBoYXJuZXNzLlxuICogQHRlbXBsYXRlIEMgVGhlIGxpc3QgaXRlbSBoYXJuZXNzIHR5cGUgdGhhdCBgVGAgY29uc3RydWN0cy5cbiAqIEB0ZW1wbGF0ZSBGIFRoZSBmaWx0ZXIgdHlwZSB1c2VkIGZpbHRlciBsaXN0IGl0ZW0gaGFybmVzcyBvZiB0eXBlIGBDYC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdExpc3RIYXJuZXNzQmFzZVxuICAgIDxcbiAgICAgIFQgZXh0ZW5kcyAoQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPEM+ICYge3dpdGg6IChvcHRpb25zPzogRikgPT4gSGFybmVzc1ByZWRpY2F0ZTxDPn0pLFxuICAgICAgQyBleHRlbmRzIENvbXBvbmVudEhhcm5lc3MsXG4gICAgICBGIGV4dGVuZHMgQmFzZUxpc3RJdGVtSGFybmVzc0ZpbHRlcnNcbiAgICA+IGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIHByb3RlY3RlZCBfaXRlbUhhcm5lc3M6IFQ7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIGhhcm5lc3NlcyByZXByZXNlbnRpbmcgdGhlIGl0ZW1zIGluIHRoaXMgbGlzdC5cbiAgICogQHBhcmFtIGZpbHRlcnMgT3B0aW9uYWwgZmlsdGVycyB1c2VkIHRvIG5hcnJvdyB3aGljaCBoYXJuZXNzZXMgYXJlIGluY2x1ZGVkXG4gICAqIEByZXR1cm4gVGhlIGxpc3Qgb2YgaXRlbXMgbWF0Y2hpbmcgdGhlIGdpdmVuIGZpbHRlcnMuXG4gICAqL1xuICBhc3luYyBnZXRJdGVtcyhmaWx0ZXJzPzogRik6IFByb21pc2U8Q1tdPiB7XG4gICAgcmV0dXJuIHRoaXMubG9jYXRvckZvckFsbCh0aGlzLl9pdGVtSGFybmVzcy53aXRoKGZpbHRlcnMpKSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIGBMaXN0U2VjdGlvbmAgcmVwcmVzZW50aW5nIHRoZSBsaXN0IGl0ZW1zIGdyb3VwZWQgYnkgc3ViaGVhZGVycy4gSWYgdGhlIGxpc3QgaGFzXG4gICAqIG5vIHN1YmhlYWRlcnMgaXQgaXMgcmVwcmVzZW50ZWQgYXMgYSBzaW5nbGUgYExpc3RTZWN0aW9uYCB3aXRoIGFuIHVuZGVmaW5lZCBgaGVhZGluZ2AgcHJvcGVydHkuXG4gICAqIEBwYXJhbSBmaWx0ZXJzIE9wdGlvbmFsIGZpbHRlcnMgdXNlZCB0byBuYXJyb3cgd2hpY2ggbGlzdCBpdGVtIGhhcm5lc3NlcyBhcmUgaW5jbHVkZWRcbiAgICogQHJldHVybiBUaGUgbGlzdCBvZiBpdGVtcyBtYXRjaGluZyB0aGUgZ2l2ZW4gZmlsdGVycywgZ3JvdXBlZCBpbnRvIHNlY3Rpb25zIGJ5IHN1YmhlYWRlci5cbiAgICovXG4gIGFzeW5jIGdldEl0ZW1zR3JvdXBlZEJ5U3ViaGVhZGVyKGZpbHRlcnM/OiBGKTogUHJvbWlzZTxMaXN0U2VjdGlvbjxDPltdPiB7XG4gICAgY29uc3QgbGlzdFNlY3Rpb25zID0gW107XG4gICAgbGV0IGN1cnJlbnRTZWN0aW9uOiB7aXRlbXM6IENbXSwgaGVhZGluZz86IFByb21pc2U8c3RyaW5nPn0gPSB7aXRlbXM6IFtdfTtcbiAgICBjb25zdCBpdGVtc0FuZFN1YmhlYWRlcnMgPVxuICAgICAgICBhd2FpdCB0aGlzLmdldEl0ZW1zV2l0aFN1YmhlYWRlcnNBbmREaXZpZGVycyh7aXRlbTogZmlsdGVycywgZGl2aWRlcjogZmFsc2V9KTtcbiAgICBmb3IgKGNvbnN0IGl0ZW1PclN1YmhlYWRlciBvZiBpdGVtc0FuZFN1YmhlYWRlcnMpIHtcbiAgICAgIGlmIChpdGVtT3JTdWJoZWFkZXIgaW5zdGFuY2VvZiBNYXRTdWJoZWFkZXJIYXJuZXNzKSB7XG4gICAgICAgIGlmIChjdXJyZW50U2VjdGlvbi5oZWFkaW5nICE9PSB1bmRlZmluZWQgfHwgY3VycmVudFNlY3Rpb24uaXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgbGlzdFNlY3Rpb25zLnB1c2goY3VycmVudFNlY3Rpb24pO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRTZWN0aW9uID0ge2hlYWRpbmc6IGl0ZW1PclN1YmhlYWRlci5nZXRUZXh0KCksIGl0ZW1zOiBbXX07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50U2VjdGlvbi5pdGVtcy5wdXNoKGl0ZW1PclN1YmhlYWRlcik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjdXJyZW50U2VjdGlvbi5oZWFkaW5nICE9PSB1bmRlZmluZWQgfHwgY3VycmVudFNlY3Rpb24uaXRlbXMubGVuZ3RoIHx8XG4gICAgICAgICFsaXN0U2VjdGlvbnMubGVuZ3RoKSB7XG4gICAgICBsaXN0U2VjdGlvbnMucHVzaChjdXJyZW50U2VjdGlvbik7XG4gICAgfVxuXG4gICAgLy8gQ29uY3VycmVudGx5IHdhaXQgZm9yIGFsbCBzZWN0aW9ucyB0byByZXNvbHZlIHRoZWlyIGhlYWRpbmcgaWYgcHJlc2VudC5cbiAgICByZXR1cm4gUHJvbWlzZS5hbGwobGlzdFNlY3Rpb25zLm1hcChhc3luYyAocykgPT5cbiAgICAgICh7aXRlbXM6IHMuaXRlbXMsIGhlYWRpbmc6IGF3YWl0IHMuaGVhZGluZ30pKSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIGxpc3Qgb2Ygc3ViLWxpc3RzIHJlcHJlc2VudGluZyB0aGUgbGlzdCBpdGVtcyBncm91cGVkIGJ5IGRpdmlkZXJzLiBJZiB0aGUgbGlzdCBoYXMgbm9cbiAgICogZGl2aWRlcnMgaXQgaXMgcmVwcmVzZW50ZWQgYXMgYSBsaXN0IHdpdGggYSBzaW5nbGUgc3ViLWxpc3QuXG4gICAqIEBwYXJhbSBmaWx0ZXJzIE9wdGlvbmFsIGZpbHRlcnMgdXNlZCB0byBuYXJyb3cgd2hpY2ggbGlzdCBpdGVtIGhhcm5lc3NlcyBhcmUgaW5jbHVkZWRcbiAgICogQHJldHVybiBUaGUgbGlzdCBvZiBpdGVtcyBtYXRjaGluZyB0aGUgZ2l2ZW4gZmlsdGVycywgZ3JvdXBlZCBpbnRvIHN1Yi1saXN0cyBieSBkaXZpZGVyLlxuICAgKi9cbiAgYXN5bmMgZ2V0SXRlbXNHcm91cGVkQnlEaXZpZGVycyhmaWx0ZXJzPzogRik6IFByb21pc2U8Q1tdW10+IHtcbiAgICBjb25zdCBsaXN0U2VjdGlvbnM6IENbXVtdID0gW1tdXTtcbiAgICBjb25zdCBpdGVtc0FuZERpdmlkZXJzID1cbiAgICAgICAgYXdhaXQgdGhpcy5nZXRJdGVtc1dpdGhTdWJoZWFkZXJzQW5kRGl2aWRlcnMoe2l0ZW06IGZpbHRlcnMsIHN1YmhlYWRlcjogZmFsc2V9KTtcbiAgICBmb3IgKGNvbnN0IGl0ZW1PckRpdmlkZXIgb2YgaXRlbXNBbmREaXZpZGVycykge1xuICAgICAgaWYgKGl0ZW1PckRpdmlkZXIgaW5zdGFuY2VvZiBNYXREaXZpZGVySGFybmVzcykge1xuICAgICAgICBsaXN0U2VjdGlvbnMucHVzaChbXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaXN0U2VjdGlvbnNbbGlzdFNlY3Rpb25zLmxlbmd0aCAtIDFdLnB1c2goaXRlbU9yRGl2aWRlcik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsaXN0U2VjdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIGxpc3Qgb2YgaGFybmVzc2VzIHJlcHJlc2VudGluZyBhbGwgb2YgdGhlIGl0ZW1zLCBzdWJoZWFkZXJzLCBhbmQgZGl2aWRlcnNcbiAgICogKGluIHRoZSBvcmRlciB0aGV5IGFwcGVhciBpbiB0aGUgbGlzdCkuIFVzZSBgaW5zdGFuY2VvZmAgdG8gY2hlY2sgd2hpY2ggdHlwZSBvZiBoYXJuZXNzIGEgZ2l2ZW5cbiAgICogaXRlbSBpcy5cbiAgICogQHBhcmFtIGZpbHRlcnMgT3B0aW9uYWwgZmlsdGVycyB1c2VkIHRvIG5hcnJvdyB3aGljaCBsaXN0IGl0ZW1zLCBzdWJoZWFkZXJzLCBhbmQgZGl2aWRlcnMgYXJlXG4gICAqICAgICBpbmNsdWRlZC4gQSB2YWx1ZSBvZiBgZmFsc2VgIGZvciB0aGUgYGl0ZW1gLCBgc3ViaGVhZGVyYCwgb3IgYGRpdmlkZXJgIHByb3BlcnRpZXMgaW5kaWNhdGVzXG4gICAqICAgICB0aGF0IHRoZSByZXNwZWN0aXZlIGhhcm5lc3MgdHlwZSBzaG91bGQgYmUgb21pdHRlZCBjb21wbGV0ZWx5LlxuICAgKiBAcmV0dXJuIFRoZSBsaXN0IG9mIGhhcm5lc3NlcyByZXByZXNlbnRpbmcgdGhlIGl0ZW1zLCBzdWJoZWFkZXJzLCBhbmQgZGl2aWRlcnMgbWF0Y2hpbmcgdGhlXG4gICAqICAgICBnaXZlbiBmaWx0ZXJzLlxuICAgKi9cbiAgZ2V0SXRlbXNXaXRoU3ViaGVhZGVyc0FuZERpdmlkZXJzKGZpbHRlcnM6IHtcbiAgICBpdGVtOiBmYWxzZSxcbiAgICBzdWJoZWFkZXI6IGZhbHNlLFxuICAgIGRpdmlkZXI6IGZhbHNlXG4gIH0pOiBQcm9taXNlPFtdPjtcbiAgZ2V0SXRlbXNXaXRoU3ViaGVhZGVyc0FuZERpdmlkZXJzKGZpbHRlcnM6IHtcbiAgICBpdGVtPzogRiB8IGZhbHNlLFxuICAgIHN1YmhlYWRlcjogZmFsc2UsXG4gICAgZGl2aWRlcjogZmFsc2VcbiAgfSk6IFByb21pc2U8Q1tdPjtcbiAgZ2V0SXRlbXNXaXRoU3ViaGVhZGVyc0FuZERpdmlkZXJzKGZpbHRlcnM6IHtcbiAgICBpdGVtOiBmYWxzZSxcbiAgICBzdWJoZWFkZXI/OiBTdWJoZWFkZXJIYXJuZXNzRmlsdGVycyB8IGZhbHNlLFxuICAgIGRpdmlkZXI6IGZhbHNlXG4gIH0pOiBQcm9taXNlPE1hdFN1YmhlYWRlckhhcm5lc3NbXT47XG4gIGdldEl0ZW1zV2l0aFN1YmhlYWRlcnNBbmREaXZpZGVycyhmaWx0ZXJzOiB7XG4gICAgaXRlbTogZmFsc2UsXG4gICAgc3ViaGVhZGVyOiBmYWxzZSxcbiAgICBkaXZpZGVyPzogRGl2aWRlckhhcm5lc3NGaWx0ZXJzIHwgZmFsc2VcbiAgfSk6IFByb21pc2U8TWF0RGl2aWRlckhhcm5lc3NbXT47XG4gIGdldEl0ZW1zV2l0aFN1YmhlYWRlcnNBbmREaXZpZGVycyhmaWx0ZXJzOiB7XG4gICAgaXRlbT86IEYgfCBmYWxzZSxcbiAgICBzdWJoZWFkZXI/OiBTdWJoZWFkZXJIYXJuZXNzRmlsdGVycyB8IGZhbHNlLFxuICAgIGRpdmlkZXI6IGZhbHNlXG4gIH0pOiBQcm9taXNlPChDIHwgTWF0U3ViaGVhZGVySGFybmVzcylbXT47XG4gIGdldEl0ZW1zV2l0aFN1YmhlYWRlcnNBbmREaXZpZGVycyhmaWx0ZXJzOiB7XG4gICAgaXRlbT86IEYgfCBmYWxzZSxcbiAgICBzdWJoZWFkZXI6IGZhbHNlLFxuICAgIGRpdmlkZXI/OiBmYWxzZSB8IERpdmlkZXJIYXJuZXNzRmlsdGVyc1xuICB9KTogUHJvbWlzZTwoQyB8IE1hdERpdmlkZXJIYXJuZXNzKVtdPjtcbiAgZ2V0SXRlbXNXaXRoU3ViaGVhZGVyc0FuZERpdmlkZXJzKGZpbHRlcnM6IHtcbiAgICBpdGVtOiBmYWxzZSxcbiAgICBzdWJoZWFkZXI/OiBmYWxzZSB8IFN1YmhlYWRlckhhcm5lc3NGaWx0ZXJzLFxuICAgIGRpdmlkZXI/OiBmYWxzZSB8IERpdmlkZXJIYXJuZXNzRmlsdGVyc1xuICB9KTogUHJvbWlzZTwoTWF0U3ViaGVhZGVySGFybmVzcyB8IE1hdERpdmlkZXJIYXJuZXNzKVtdPjtcbiAgZ2V0SXRlbXNXaXRoU3ViaGVhZGVyc0FuZERpdmlkZXJzKGZpbHRlcnM/OiB7XG4gICAgaXRlbT86IEYgfCBmYWxzZSxcbiAgICBzdWJoZWFkZXI/OiBTdWJoZWFkZXJIYXJuZXNzRmlsdGVycyB8IGZhbHNlLFxuICAgIGRpdmlkZXI/OiBEaXZpZGVySGFybmVzc0ZpbHRlcnMgfCBmYWxzZVxuICB9KTogUHJvbWlzZTwoQyB8IE1hdFN1YmhlYWRlckhhcm5lc3MgfCBNYXREaXZpZGVySGFybmVzcylbXT47XG4gIGFzeW5jIGdldEl0ZW1zV2l0aFN1YmhlYWRlcnNBbmREaXZpZGVycyhmaWx0ZXJzOiB7XG4gICAgaXRlbT86IEYgfCBmYWxzZSxcbiAgICBzdWJoZWFkZXI/OiBTdWJoZWFkZXJIYXJuZXNzRmlsdGVycyB8IGZhbHNlLFxuICAgIGRpdmlkZXI/OiBEaXZpZGVySGFybmVzc0ZpbHRlcnMgfCBmYWxzZVxuICB9ID0ge30pOiBQcm9taXNlPChDIHwgTWF0U3ViaGVhZGVySGFybmVzcyB8IE1hdERpdmlkZXJIYXJuZXNzKVtdPiB7XG4gICAgY29uc3QgcXVlcnkgPSBbXTtcbiAgICBpZiAoZmlsdGVycy5pdGVtICE9PSBmYWxzZSkge1xuICAgICAgcXVlcnkucHVzaCh0aGlzLl9pdGVtSGFybmVzcy53aXRoKGZpbHRlcnMuaXRlbSB8fCB7fSBhcyBGKSk7XG4gICAgfVxuICAgIGlmIChmaWx0ZXJzLnN1YmhlYWRlciAhPT0gZmFsc2UpIHtcbiAgICAgIHF1ZXJ5LnB1c2goTWF0U3ViaGVhZGVySGFybmVzcy53aXRoKGZpbHRlcnMuc3ViaGVhZGVyKSk7XG4gICAgfVxuICAgIGlmIChmaWx0ZXJzLmRpdmlkZXIgIT09IGZhbHNlKSB7XG4gICAgICBxdWVyeS5wdXNoKE1hdERpdmlkZXJIYXJuZXNzLndpdGgoZmlsdGVycy5kaXZpZGVyKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwoLi4ucXVlcnkpKCk7XG4gIH1cbn1cbiJdfQ==
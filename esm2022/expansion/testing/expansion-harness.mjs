/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
/** Selectors for the various `mat-expansion-panel` sections that may contain user content. */
export var MatExpansionPanelSection;
(function (MatExpansionPanelSection) {
    MatExpansionPanelSection["HEADER"] = ".mat-expansion-panel-header";
    MatExpansionPanelSection["TITLE"] = ".mat-expansion-panel-header-title";
    MatExpansionPanelSection["DESCRIPTION"] = ".mat-expansion-panel-header-description";
    MatExpansionPanelSection["CONTENT"] = ".mat-expansion-panel-content";
})(MatExpansionPanelSection || (MatExpansionPanelSection = {}));
/** Harness for interacting with a standard mat-expansion-panel in tests. */
export class MatExpansionPanelHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._header = this.locatorFor(MatExpansionPanelSection.HEADER);
        this._title = this.locatorForOptional(MatExpansionPanelSection.TITLE);
        this._description = this.locatorForOptional(MatExpansionPanelSection.DESCRIPTION);
        this._expansionIndicator = this.locatorForOptional('.mat-expansion-indicator');
        this._content = this.locatorFor(MatExpansionPanelSection.CONTENT);
    }
    static { this.hostSelector = '.mat-expansion-panel'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for an expansion-panel
     * with specific attributes.
     * @param options Options for narrowing the search:
     *   - `title` finds an expansion-panel with a specific title text.
     *   - `description` finds an expansion-panel with a specific description text.
     *   - `expanded` finds an expansion-panel that is currently expanded.
     *   - `disabled` finds an expansion-panel that is disabled.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatExpansionPanelHarness, options)
            .addOption('title', options.title, (harness, title) => HarnessPredicate.stringMatches(harness.getTitle(), title))
            .addOption('description', options.description, (harness, description) => HarnessPredicate.stringMatches(harness.getDescription(), description))
            .addOption('content', options.content, (harness, content) => HarnessPredicate.stringMatches(harness.getTextContent(), content))
            .addOption('expanded', options.expanded, async (harness, expanded) => (await harness.isExpanded()) === expanded)
            .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled);
    }
    /** Whether the panel is expanded. */
    async isExpanded() {
        return (await this.host()).hasClass('mat-expanded');
    }
    /**
     * Gets the title text of the panel.
     * @returns Title text or `null` if no title is set up.
     */
    async getTitle() {
        const titleEl = await this._title();
        return titleEl ? titleEl.text() : null;
    }
    /**
     * Gets the description text of the panel.
     * @returns Description text or `null` if no description is set up.
     */
    async getDescription() {
        const descriptionEl = await this._description();
        return descriptionEl ? descriptionEl.text() : null;
    }
    /** Whether the panel is disabled. */
    async isDisabled() {
        return (await (await this._header()).getAttribute('aria-disabled')) === 'true';
    }
    /**
     * Toggles the expanded state of the panel by clicking on the panel
     * header. This method will not work if the panel is disabled.
     */
    async toggle() {
        await (await this._header()).click();
    }
    /** Expands the expansion panel if collapsed. */
    async expand() {
        if (!(await this.isExpanded())) {
            await this.toggle();
        }
    }
    /** Collapses the expansion panel if expanded. */
    async collapse() {
        if (await this.isExpanded()) {
            await this.toggle();
        }
    }
    /** Gets the text content of the panel. */
    async getTextContent() {
        return (await this._content()).text();
    }
    /**
     * Gets a `HarnessLoader` that can be used to load harnesses for
     * components within the panel's content area.
     * @deprecated Use either `getChildLoader(MatExpansionPanelSection.CONTENT)`, `getHarness` or
     *    `getAllHarnesses` instead.
     * @breaking-change 12.0.0
     */
    async getHarnessLoaderForContent() {
        return this.getChildLoader(MatExpansionPanelSection.CONTENT);
    }
    /** Focuses the panel. */
    async focus() {
        return (await this._header()).focus();
    }
    /** Blurs the panel. */
    async blur() {
        return (await this._header()).blur();
    }
    /** Whether the panel is focused. */
    async isFocused() {
        return (await this._header()).isFocused();
    }
    /** Whether the panel has a toggle indicator displayed. */
    async hasToggleIndicator() {
        return (await this._expansionIndicator()) !== null;
    }
    /** Gets the position of the toggle indicator. */
    async getToggleIndicatorPosition() {
        // By default the expansion indicator will show "after" the panel header content.
        if (await (await this._header()).hasClass('mat-expansion-toggle-indicator-before')) {
            return 'before';
        }
        return 'after';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLWhhcm5lc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZXhwYW5zaW9uL3Rlc3RpbmcvZXhwYW5zaW9uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLGdDQUFnQyxFQUVoQyxnQkFBZ0IsR0FDakIsTUFBTSxzQkFBc0IsQ0FBQztBQUc5Qiw4RkFBOEY7QUFDOUYsTUFBTSxDQUFOLElBQVksd0JBS1g7QUFMRCxXQUFZLHdCQUF3QjtJQUNsQyxrRUFBc0MsQ0FBQTtJQUN0Qyx1RUFBMkMsQ0FBQTtJQUMzQyxtRkFBdUQsQ0FBQTtJQUN2RCxvRUFBd0MsQ0FBQTtBQUMxQyxDQUFDLEVBTFcsd0JBQXdCLEtBQXhCLHdCQUF3QixRQUtuQztBQUVELDRFQUE0RTtBQUM1RSxNQUFNLE9BQU8sd0JBQXlCLFNBQVEsZ0NBQTBEO0lBQXhHOztRQUdVLFlBQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNELFdBQU0sR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsd0JBQXdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakUsaUJBQVksR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsd0JBQXdCLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0Usd0JBQW1CLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDMUUsYUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFtSXZFLENBQUM7YUF6SVEsaUJBQVksR0FBRyxzQkFBc0IsQUFBekIsQ0FBMEI7SUFRN0M7Ozs7Ozs7OztPQVNHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FDVCxVQUF3QyxFQUFFO1FBRTFDLE9BQU8sSUFBSSxn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QUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxLQUFLLENBQUMsMEJBQTBCO1FBQzlCLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyx3QkFBd0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQseUJBQXlCO0lBQ3pCLEtBQUssQ0FBQyxLQUFLO1FBQ1QsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVELHVCQUF1QjtJQUN2QixLQUFLLENBQUMsSUFBSTtRQUNSLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxvQ0FBb0M7SUFDcEMsS0FBSyxDQUFDLFNBQVM7UUFDYixPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRUQsMERBQTBEO0lBQzFELEtBQUssQ0FBQyxrQkFBa0I7UUFDdEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsS0FBSyxJQUFJLENBQUM7SUFDckQsQ0FBQztJQUVELGlEQUFpRDtJQUNqRCxLQUFLLENBQUMsMEJBQTBCO1FBQzlCLGlGQUFpRjtRQUNqRixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyx1Q0FBdUMsQ0FBQyxFQUFFLENBQUM7WUFDbkYsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQztRQUNELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3MsXG4gIEhhcm5lc3NMb2FkZXIsXG4gIEhhcm5lc3NQcmVkaWNhdGUsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7RXhwYW5zaW9uUGFuZWxIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi9leHBhbnNpb24taGFybmVzcy1maWx0ZXJzJztcblxuLyoqIFNlbGVjdG9ycyBmb3IgdGhlIHZhcmlvdXMgYG1hdC1leHBhbnNpb24tcGFuZWxgIHNlY3Rpb25zIHRoYXQgbWF5IGNvbnRhaW4gdXNlciBjb250ZW50LiAqL1xuZXhwb3J0IGVudW0gTWF0RXhwYW5zaW9uUGFuZWxTZWN0aW9uIHtcbiAgSEVBREVSID0gJy5tYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlcicsXG4gIFRJVExFID0gJy5tYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci10aXRsZScsXG4gIERFU0NSSVBUSU9OID0gJy5tYXQtZXhwYW5zaW9uLXBhbmVsLWhlYWRlci1kZXNjcmlwdGlvbicsXG4gIENPTlRFTlQgPSAnLm1hdC1leHBhbnNpb24tcGFuZWwtY29udGVudCcsXG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LWV4cGFuc2lvbi1wYW5lbCBpbiB0ZXN0cy4gKi9cbmV4cG9ydCBjbGFzcyBNYXRFeHBhbnNpb25QYW5lbEhhcm5lc3MgZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzczxNYXRFeHBhbnNpb25QYW5lbFNlY3Rpb24+IHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LWV4cGFuc2lvbi1wYW5lbCc7XG5cbiAgcHJpdmF0ZSBfaGVhZGVyID0gdGhpcy5sb2NhdG9yRm9yKE1hdEV4cGFuc2lvblBhbmVsU2VjdGlvbi5IRUFERVIpO1xuICBwcml2YXRlIF90aXRsZSA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKE1hdEV4cGFuc2lvblBhbmVsU2VjdGlvbi5USVRMRSk7XG4gIHByaXZhdGUgX2Rlc2NyaXB0aW9uID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoTWF0RXhwYW5zaW9uUGFuZWxTZWN0aW9uLkRFU0NSSVBUSU9OKTtcbiAgcHJpdmF0ZSBfZXhwYW5zaW9uSW5kaWNhdG9yID0gdGhpcy5sb2NhdG9yRm9yT3B0aW9uYWwoJy5tYXQtZXhwYW5zaW9uLWluZGljYXRvcicpO1xuICBwcml2YXRlIF9jb250ZW50ID0gdGhpcy5sb2NhdG9yRm9yKE1hdEV4cGFuc2lvblBhbmVsU2VjdGlvbi5DT05URU5UKTtcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYW4gZXhwYW5zaW9uLXBhbmVsXG4gICAqIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2g6XG4gICAqICAgLSBgdGl0bGVgIGZpbmRzIGFuIGV4cGFuc2lvbi1wYW5lbCB3aXRoIGEgc3BlY2lmaWMgdGl0bGUgdGV4dC5cbiAgICogICAtIGBkZXNjcmlwdGlvbmAgZmluZHMgYW4gZXhwYW5zaW9uLXBhbmVsIHdpdGggYSBzcGVjaWZpYyBkZXNjcmlwdGlvbiB0ZXh0LlxuICAgKiAgIC0gYGV4cGFuZGVkYCBmaW5kcyBhbiBleHBhbnNpb24tcGFuZWwgdGhhdCBpcyBjdXJyZW50bHkgZXhwYW5kZWQuXG4gICAqICAgLSBgZGlzYWJsZWRgIGZpbmRzIGFuIGV4cGFuc2lvbi1wYW5lbCB0aGF0IGlzIGRpc2FibGVkLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKFxuICAgIG9wdGlvbnM6IEV4cGFuc2lvblBhbmVsSGFybmVzc0ZpbHRlcnMgPSB7fSxcbiAgKTogSGFybmVzc1ByZWRpY2F0ZTxNYXRFeHBhbnNpb25QYW5lbEhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0RXhwYW5zaW9uUGFuZWxIYXJuZXNzLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbigndGl0bGUnLCBvcHRpb25zLnRpdGxlLCAoaGFybmVzcywgdGl0bGUpID0+XG4gICAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRpdGxlKCksIHRpdGxlKSxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oJ2Rlc2NyaXB0aW9uJywgb3B0aW9ucy5kZXNjcmlwdGlvbiwgKGhhcm5lc3MsIGRlc2NyaXB0aW9uKSA9PlxuICAgICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXREZXNjcmlwdGlvbigpLCBkZXNjcmlwdGlvbiksXG4gICAgICApXG4gICAgICAuYWRkT3B0aW9uKCdjb250ZW50Jywgb3B0aW9ucy5jb250ZW50LCAoaGFybmVzcywgY29udGVudCkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dENvbnRlbnQoKSwgY29udGVudCksXG4gICAgICApXG4gICAgICAuYWRkT3B0aW9uKFxuICAgICAgICAnZXhwYW5kZWQnLFxuICAgICAgICBvcHRpb25zLmV4cGFuZGVkLFxuICAgICAgICBhc3luYyAoaGFybmVzcywgZXhwYW5kZWQpID0+IChhd2FpdCBoYXJuZXNzLmlzRXhwYW5kZWQoKSkgPT09IGV4cGFuZGVkLFxuICAgICAgKVxuICAgICAgLmFkZE9wdGlvbihcbiAgICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgICAgb3B0aW9ucy5kaXNhYmxlZCxcbiAgICAgICAgYXN5bmMgKGhhcm5lc3MsIGRpc2FibGVkKSA9PiAoYXdhaXQgaGFybmVzcy5pc0Rpc2FibGVkKCkpID09PSBkaXNhYmxlZCxcbiAgICAgICk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcGFuZWwgaXMgZXhwYW5kZWQuICovXG4gIGFzeW5jIGlzRXhwYW5kZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkuaGFzQ2xhc3MoJ21hdC1leHBhbmRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRpdGxlIHRleHQgb2YgdGhlIHBhbmVsLlxuICAgKiBAcmV0dXJucyBUaXRsZSB0ZXh0IG9yIGBudWxsYCBpZiBubyB0aXRsZSBpcyBzZXQgdXAuXG4gICAqL1xuICBhc3luYyBnZXRUaXRsZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICBjb25zdCB0aXRsZUVsID0gYXdhaXQgdGhpcy5fdGl0bGUoKTtcbiAgICByZXR1cm4gdGl0bGVFbCA/IHRpdGxlRWwudGV4dCgpIDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBkZXNjcmlwdGlvbiB0ZXh0IG9mIHRoZSBwYW5lbC5cbiAgICogQHJldHVybnMgRGVzY3JpcHRpb24gdGV4dCBvciBgbnVsbGAgaWYgbm8gZGVzY3JpcHRpb24gaXMgc2V0IHVwLlxuICAgKi9cbiAgYXN5bmMgZ2V0RGVzY3JpcHRpb24oKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgY29uc3QgZGVzY3JpcHRpb25FbCA9IGF3YWl0IHRoaXMuX2Rlc2NyaXB0aW9uKCk7XG4gICAgcmV0dXJuIGRlc2NyaXB0aW9uRWwgPyBkZXNjcmlwdGlvbkVsLnRleHQoKSA6IG51bGw7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgcGFuZWwgaXMgZGlzYWJsZWQuICovXG4gIGFzeW5jIGlzRGlzYWJsZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChhd2FpdCAoYXdhaXQgdGhpcy5faGVhZGVyKCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcpKSA9PT0gJ3RydWUnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIGV4cGFuZGVkIHN0YXRlIG9mIHRoZSBwYW5lbCBieSBjbGlja2luZyBvbiB0aGUgcGFuZWxcbiAgICogaGVhZGVyLiBUaGlzIG1ldGhvZCB3aWxsIG5vdCB3b3JrIGlmIHRoZSBwYW5lbCBpcyBkaXNhYmxlZC5cbiAgICovXG4gIGFzeW5jIHRvZ2dsZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCAoYXdhaXQgdGhpcy5faGVhZGVyKCkpLmNsaWNrKCk7XG4gIH1cblxuICAvKiogRXhwYW5kcyB0aGUgZXhwYW5zaW9uIHBhbmVsIGlmIGNvbGxhcHNlZC4gKi9cbiAgYXN5bmMgZXhwYW5kKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaXNFeHBhbmRlZCgpKSkge1xuICAgICAgYXdhaXQgdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ29sbGFwc2VzIHRoZSBleHBhbnNpb24gcGFuZWwgaWYgZXhwYW5kZWQuICovXG4gIGFzeW5jIGNvbGxhcHNlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmlzRXhwYW5kZWQoKSkge1xuICAgICAgYXdhaXQgdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB0aGUgdGV4dCBjb250ZW50IG9mIHRoZSBwYW5lbC4gKi9cbiAgYXN5bmMgZ2V0VGV4dENvbnRlbnQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2NvbnRlbnQoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc0xvYWRlcmAgdGhhdCBjYW4gYmUgdXNlZCB0byBsb2FkIGhhcm5lc3NlcyBmb3JcbiAgICogY29tcG9uZW50cyB3aXRoaW4gdGhlIHBhbmVsJ3MgY29udGVudCBhcmVhLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgZWl0aGVyIGBnZXRDaGlsZExvYWRlcihNYXRFeHBhbnNpb25QYW5lbFNlY3Rpb24uQ09OVEVOVClgLCBgZ2V0SGFybmVzc2Agb3JcbiAgICogICAgYGdldEFsbEhhcm5lc3Nlc2AgaW5zdGVhZC5cbiAgICogQGJyZWFraW5nLWNoYW5nZSAxMi4wLjBcbiAgICovXG4gIGFzeW5jIGdldEhhcm5lc3NMb2FkZXJGb3JDb250ZW50KCk6IFByb21pc2U8SGFybmVzc0xvYWRlcj4ge1xuICAgIHJldHVybiB0aGlzLmdldENoaWxkTG9hZGVyKE1hdEV4cGFuc2lvblBhbmVsU2VjdGlvbi5DT05URU5UKTtcbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSBwYW5lbC4gKi9cbiAgYXN5bmMgZm9jdXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9oZWFkZXIoKSkuZm9jdXMoKTtcbiAgfVxuXG4gIC8qKiBCbHVycyB0aGUgcGFuZWwuICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLl9oZWFkZXIoKSkuYmx1cigpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHBhbmVsIGlzIGZvY3VzZWQuICovXG4gIGFzeW5jIGlzRm9jdXNlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuX2hlYWRlcigpKS5pc0ZvY3VzZWQoKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZSBwYW5lbCBoYXMgYSB0b2dnbGUgaW5kaWNhdG9yIGRpc3BsYXllZC4gKi9cbiAgYXN5bmMgaGFzVG9nZ2xlSW5kaWNhdG9yKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fZXhwYW5zaW9uSW5kaWNhdG9yKCkpICE9PSBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHBvc2l0aW9uIG9mIHRoZSB0b2dnbGUgaW5kaWNhdG9yLiAqL1xuICBhc3luYyBnZXRUb2dnbGVJbmRpY2F0b3JQb3NpdGlvbigpOiBQcm9taXNlPCdiZWZvcmUnIHwgJ2FmdGVyJz4ge1xuICAgIC8vIEJ5IGRlZmF1bHQgdGhlIGV4cGFuc2lvbiBpbmRpY2F0b3Igd2lsbCBzaG93IFwiYWZ0ZXJcIiB0aGUgcGFuZWwgaGVhZGVyIGNvbnRlbnQuXG4gICAgaWYgKGF3YWl0IChhd2FpdCB0aGlzLl9oZWFkZXIoKSkuaGFzQ2xhc3MoJ21hdC1leHBhbnNpb24tdG9nZ2xlLWluZGljYXRvci1iZWZvcmUnKSkge1xuICAgICAgcmV0dXJuICdiZWZvcmUnO1xuICAgIH1cbiAgICByZXR1cm4gJ2FmdGVyJztcbiAgfVxufVxuIl19
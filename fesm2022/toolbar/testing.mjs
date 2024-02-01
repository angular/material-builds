import { ContentContainerComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';

/** Harness for interacting with a standard mat-toolbar in tests. */
class MatToolbarHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._getRows = this.locatorForAll(".mat-toolbar-row" /* MatToolbarSection.ROW */);
    }
    static { this.hostSelector = '.mat-toolbar'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a `MatToolbarHarness` that meets
     * certain criteria.
     * @param options Options for filtering which card instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatToolbarHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness._getText(), text));
    }
    /** Whether the toolbar has multiple rows. */
    async hasMultipleRows() {
        return (await this.host()).hasClass('mat-toolbar-multiple-rows');
    }
    /** Gets all of the toolbar's content as text. */
    async _getText() {
        return (await this.host()).text();
    }
    /** Gets the text of each row in the toolbar. */
    async getRowsAsText() {
        const rows = await this._getRows();
        return parallel(() => (rows.length ? rows.map(r => r.text()) : [this._getText()]));
    }
}

export { MatToolbarHarness };
//# sourceMappingURL=testing.mjs.map

import { ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

/** Harness for interacting with an MDC-based mat-card in tests. */
class MatCardHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._title = this.locatorForOptional('.mat-mdc-card-title');
        this._subtitle = this.locatorForOptional('.mat-mdc-card-subtitle');
    }
    /** The selector for the host element of a `MatCard` instance. */
    static { this.hostSelector = '.mat-mdc-card'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a card with specific attributes.
     * @param options Options for filtering which card instances are considered a match.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(this, options)
            .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
            .addOption('title', options.title, (harness, title) => HarnessPredicate.stringMatches(harness.getTitleText(), title))
            .addOption('subtitle', options.subtitle, (harness, subtitle) => HarnessPredicate.stringMatches(harness.getSubtitleText(), subtitle));
    }
    /** Gets all of the card's content as text. */
    async getText() {
        return (await this.host()).text();
    }
    /** Gets the cards's title text. */
    async getTitleText() {
        return (await this._title())?.text() ?? '';
    }
    /** Gets the cards's subtitle text. */
    async getSubtitleText() {
        return (await this._subtitle())?.text() ?? '';
    }
}

export { MatCardHarness };
//# sourceMappingURL=testing.mjs.map

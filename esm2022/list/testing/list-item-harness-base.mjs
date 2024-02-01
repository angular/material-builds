/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, ContentContainerComponentHarness, HarnessPredicate, parallel, } from '@angular/cdk/testing';
const iconSelector = '.mat-mdc-list-item-icon';
const avatarSelector = '.mat-mdc-list-item-avatar';
/**
 * Gets a `HarnessPredicate` that applies the given `BaseListItemHarnessFilters` to the given
 * list item harness.
 * @template H The type of list item harness to create a predicate for.
 * @param harnessType A constructor for a list item harness.
 * @param options An instance of `BaseListItemHarnessFilters` to apply.
 * @return A `HarnessPredicate` for the given harness type with the given options applied.
 */
export function getListItemPredicate(harnessType, options) {
    return new HarnessPredicate(harnessType, options)
        .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
        .addOption('fullText', options.fullText, (harness, fullText) => HarnessPredicate.stringMatches(harness.getFullText(), fullText))
        .addOption('title', options.title, (harness, title) => HarnessPredicate.stringMatches(harness.getTitle(), title))
        .addOption('secondaryText', options.secondaryText, (harness, secondaryText) => HarnessPredicate.stringMatches(harness.getSecondaryText(), secondaryText))
        .addOption('tertiaryText', options.tertiaryText, (harness, tertiaryText) => HarnessPredicate.stringMatches(harness.getTertiaryText(), tertiaryText));
}
/** Harness for interacting with a MDC-based list subheader. */
export class MatSubheaderHarness extends ComponentHarness {
    static { this.hostSelector = '.mat-mdc-subheader'; }
    static with(options = {}) {
        return new HarnessPredicate(MatSubheaderHarness, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
    }
    /** Gets the full text content of the list item (including text from any font icons). */
    async getText() {
        return (await this.host()).text();
    }
}
/**
 * Shared behavior among the harnesses for the various `MatListItem` flavors.
 * @docs-private
 */
export class MatListItemHarnessBase extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._lines = this.locatorForAll('.mat-mdc-list-item-line');
        this._primaryText = this.locatorFor('.mdc-list-item__primary-text');
        this._avatar = this.locatorForOptional('.mat-mdc-list-item-avatar');
        this._icon = this.locatorForOptional('.mat-mdc-list-item-icon');
        this._unscopedTextContent = this.locatorFor('.mat-mdc-list-item-unscoped-content');
    }
    /** Gets the type of the list item, currently describing how many lines there are. */
    async getType() {
        const host = await this.host();
        const [isOneLine, isTwoLine] = await parallel(() => [
            host.hasClass('mdc-list-item--with-one-line'),
            host.hasClass('mdc-list-item--with-two-lines'),
        ]);
        if (isOneLine) {
            return 0 /* MatListItemType.ONE_LINE_ITEM */;
        }
        else if (isTwoLine) {
            return 1 /* MatListItemType.TWO_LINE_ITEM */;
        }
        else {
            return 2 /* MatListItemType.THREE_LINE_ITEM */;
        }
    }
    /**
     * Gets the full text content of the list item, excluding text
     * from icons and avatars.
     *
     * @deprecated Use the `getFullText` method instead.
     * @breaking-change 16.0.0
     */
    async getText() {
        return this.getFullText();
    }
    /**
     * Gets the full text content of the list item, excluding text
     * from icons and avatars.
     */
    async getFullText() {
        return (await this.host()).text({ exclude: `${iconSelector}, ${avatarSelector}` });
    }
    /** Gets the title of the list item. */
    async getTitle() {
        return (await this._primaryText()).text();
    }
    /** Whether the list item is disabled. */
    async isDisabled() {
        return (await this.host()).hasClass('mdc-list-item--disabled');
    }
    /**
     * Gets the secondary line text of the list item. Null if the list item
     * does not have a secondary line.
     */
    async getSecondaryText() {
        const type = await this.getType();
        if (type === 0 /* MatListItemType.ONE_LINE_ITEM */) {
            return null;
        }
        const [lines, unscopedTextContent] = await parallel(() => [
            this._lines(),
            this._unscopedTextContent(),
        ]);
        // If there is no explicit line for the secondary text, the unscoped text content
        // is rendered as the secondary text (with potential text wrapping enabled).
        if (lines.length >= 1) {
            return lines[0].text();
        }
        else {
            return unscopedTextContent.text();
        }
    }
    /**
     * Gets the tertiary line text of the list item. Null if the list item
     * does not have a tertiary line.
     */
    async getTertiaryText() {
        const type = await this.getType();
        if (type !== 2 /* MatListItemType.THREE_LINE_ITEM */) {
            return null;
        }
        const [lines, unscopedTextContent] = await parallel(() => [
            this._lines(),
            this._unscopedTextContent(),
        ]);
        // First we check if there is an explicit line for the tertiary text. If so, we return it.
        // If there is at least an explicit secondary line though, then we know that the unscoped
        // text content corresponds to the tertiary line. If there are no explicit lines at all,
        // we know that the unscoped text content from the secondary text just wraps into the third
        // line, but there *no* actual dedicated tertiary text.
        if (lines.length === 2) {
            return lines[1].text();
        }
        else if (lines.length === 1) {
            return unscopedTextContent.text();
        }
        return null;
    }
    /** Whether this list item has an avatar. */
    async hasAvatar() {
        return !!(await this._avatar());
    }
    /** Whether this list item has an icon. */
    async hasIcon() {
        return !!(await this._icon());
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1pdGVtLWhhcm5lc3MtYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9saXN0L3Rlc3RpbmcvbGlzdC1pdGVtLWhhcm5lc3MtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsZ0JBQWdCLEVBRWhCLGdDQUFnQyxFQUNoQyxnQkFBZ0IsRUFDaEIsUUFBUSxHQUNULE1BQU0sc0JBQXNCLENBQUM7QUFHOUIsTUFBTSxZQUFZLEdBQUcseUJBQXlCLENBQUM7QUFDL0MsTUFBTSxjQUFjLEdBQUcsMkJBQTJCLENBQUM7QUFFbkQ7Ozs7Ozs7R0FPRztBQUNILE1BQU0sVUFBVSxvQkFBb0IsQ0FDbEMsV0FBMkMsRUFDM0MsT0FBbUM7SUFFbkMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUM7U0FDOUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQ2pELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQ3hEO1NBQ0EsU0FBUyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQzdELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQ2hFO1NBQ0EsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQ3BELGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQzFEO1NBQ0EsU0FBUyxDQUFDLGVBQWUs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QUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdEIsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDeEI7YUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzdCLE9BQU8sbUJBQW1CLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDbkM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCw0Q0FBNEM7SUFDNUMsS0FBSyxDQUFDLFNBQVM7UUFDYixPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELDBDQUEwQztJQUMxQyxLQUFLLENBQUMsT0FBTztRQUNYLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzcyxcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgcGFyYWxsZWwsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7QmFzZUxpc3RJdGVtSGFybmVzc0ZpbHRlcnMsIFN1YmhlYWRlckhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL2xpc3QtaGFybmVzcy1maWx0ZXJzJztcblxuY29uc3QgaWNvblNlbGVjdG9yID0gJy5tYXQtbWRjLWxpc3QtaXRlbS1pY29uJztcbmNvbnN0IGF2YXRhclNlbGVjdG9yID0gJy5tYXQtbWRjLWxpc3QtaXRlbS1hdmF0YXInO1xuXG4vKipcbiAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBhcHBsaWVzIHRoZSBnaXZlbiBgQmFzZUxpc3RJdGVtSGFybmVzc0ZpbHRlcnNgIHRvIHRoZSBnaXZlblxuICogbGlzdCBpdGVtIGhhcm5lc3MuXG4gKiBAdGVtcGxhdGUgSCBUaGUgdHlwZSBvZiBsaXN0IGl0ZW0gaGFybmVzcyB0byBjcmVhdGUgYSBwcmVkaWNhdGUgZm9yLlxuICogQHBhcmFtIGhhcm5lc3NUeXBlIEEgY29uc3RydWN0b3IgZm9yIGEgbGlzdCBpdGVtIGhhcm5lc3MuXG4gKiBAcGFyYW0gb3B0aW9ucyBBbiBpbnN0YW5jZSBvZiBgQmFzZUxpc3RJdGVtSGFybmVzc0ZpbHRlcnNgIHRvIGFwcGx5LlxuICogQHJldHVybiBBIGBIYXJuZXNzUHJlZGljYXRlYCBmb3IgdGhlIGdpdmVuIGhhcm5lc3MgdHlwZSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zIGFwcGxpZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaXN0SXRlbVByZWRpY2F0ZTxIIGV4dGVuZHMgTWF0TGlzdEl0ZW1IYXJuZXNzQmFzZT4oXG4gIGhhcm5lc3NUeXBlOiBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8SD4sXG4gIG9wdGlvbnM6IEJhc2VMaXN0SXRlbUhhcm5lc3NGaWx0ZXJzLFxuKTogSGFybmVzc1ByZWRpY2F0ZTxIPiB7XG4gIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShoYXJuZXNzVHlwZSwgb3B0aW9ucylcbiAgICAuYWRkT3B0aW9uKCd0ZXh0Jywgb3B0aW9ucy50ZXh0LCAoaGFybmVzcywgdGV4dCkgPT5cbiAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCksXG4gICAgKVxuICAgIC5hZGRPcHRpb24oJ2Z1bGxUZXh0Jywgb3B0aW9ucy5mdWxsVGV4dCwgKGhhcm5lc3MsIGZ1bGxUZXh0KSA9PlxuICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0RnVsbFRleHQoKSwgZnVsbFRleHQpLFxuICAgIClcbiAgICAuYWRkT3B0aW9uKCd0aXRsZScsIG9wdGlvbnMudGl0bGUsIChoYXJuZXNzLCB0aXRsZSkgPT5cbiAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRpdGxlKCksIHRpdGxlKSxcbiAgICApXG4gICAgLmFkZE9wdGlvbignc2Vjb25kYXJ5VGV4dCcsIG9wdGlvbnMuc2Vjb25kYXJ5VGV4dCwgKGhhcm5lc3MsIHNlY29uZGFyeVRleHQpID0+XG4gICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRTZWNvbmRhcnlUZXh0KCksIHNlY29uZGFyeVRleHQpLFxuICAgIClcbiAgICAuYWRkT3B0aW9uKCd0ZXJ0aWFyeVRleHQnLCBvcHRpb25zLnRlcnRpYXJ5VGV4dCwgKGhhcm5lc3MsIHRlcnRpYXJ5VGV4dCkgPT5cbiAgICAgIEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRlcnRpYXJ5VGV4dCgpLCB0ZXJ0aWFyeVRleHQpLFxuICAgICk7XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgTURDLWJhc2VkIGxpc3Qgc3ViaGVhZGVyLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFN1YmhlYWRlckhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LW1kYy1zdWJoZWFkZXInO1xuXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFN1YmhlYWRlckhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFN1YmhlYWRlckhhcm5lc3M+IHtcbiAgICByZXR1cm4gbmV3IEhhcm5lc3NQcmVkaWNhdGUoTWF0U3ViaGVhZGVySGFybmVzcywgb3B0aW9ucykuYWRkT3B0aW9uKFxuICAgICAgJ3RleHQnLFxuICAgICAgb3B0aW9ucy50ZXh0LFxuICAgICAgKGhhcm5lc3MsIHRleHQpID0+IEhhcm5lc3NQcmVkaWNhdGUuc3RyaW5nTWF0Y2hlcyhoYXJuZXNzLmdldFRleHQoKSwgdGV4dCksXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBmdWxsIHRleHQgY29udGVudCBvZiB0aGUgbGlzdCBpdGVtIChpbmNsdWRpbmcgdGV4dCBmcm9tIGFueSBmb250IGljb25zKS4gKi9cbiAgYXN5bmMgZ2V0VGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLnRleHQoKTtcbiAgfVxufVxuXG4vKiogU2VsZWN0b3JzIGZvciB0aGUgdmFyaW91cyBsaXN0IGl0ZW0gc2VjdGlvbnMgdGhhdCBtYXkgY29udGFpbiB1c2VyIGNvbnRlbnQuICovXG5leHBvcnQgY29uc3QgZW51bSBNYXRMaXN0SXRlbVNlY3Rpb24ge1xuICBDT05URU5UID0gJy5tZGMtbGlzdC1pdGVtX19jb250ZW50Jyxcbn1cblxuLyoqIEVudW0gZGVzY3JpYmluZyB0aGUgcG9zc2libGUgdmFyaWFudHMgb2YgYSBsaXN0IGl0ZW0uICovXG5leHBvcnQgY29uc3QgZW51bSBNYXRMaXN0SXRlbVR5cGUge1xuICBPTkVfTElORV9JVEVNLFxuICBUV09fTElORV9JVEVNLFxuICBUSFJFRV9MSU5FX0lURU0sXG59XG5cbi8qKlxuICogU2hhcmVkIGJlaGF2aW9yIGFtb25nIHRoZSBoYXJuZXNzZXMgZm9yIHRoZSB2YXJpb3VzIGBNYXRMaXN0SXRlbWAgZmxhdm9ycy5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hdExpc3RJdGVtSGFybmVzc0Jhc2UgZXh0ZW5kcyBDb250ZW50Q29udGFpbmVyQ29tcG9uZW50SGFybmVzczxNYXRMaXN0SXRlbVNlY3Rpb24+IHtcbiAgcHJpdmF0ZSBfbGluZXMgPSB0aGlzLmxvY2F0b3JGb3JBbGwoJy5tYXQtbWRjLWxpc3QtaXRlbS1saW5lJyk7XG4gIHByaXZhdGUgX3ByaW1hcnlUZXh0ID0gdGhpcy5sb2NhdG9yRm9yKCcubWRjLWxpc3QtaXRlbV9fcHJpbWFyeS10ZXh0Jyk7XG4gIHByaXZhdGUgX2F2YXRhciA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCcubWF0LW1kYy1saXN0LWl0ZW0tYXZhdGFyJyk7XG4gIHByaXZhdGUgX2ljb24gPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC1tZGMtbGlzdC1pdGVtLWljb24nKTtcbiAgcHJpdmF0ZSBfdW5zY29wZWRUZXh0Q29udGVudCA9IHRoaXMubG9jYXRvckZvcignLm1hdC1tZGMtbGlzdC1pdGVtLXVuc2NvcGVkLWNvbnRlbnQnKTtcblxuICAvKiogR2V0cyB0aGUgdHlwZSBvZiB0aGUgbGlzdCBpdGVtLCBjdXJyZW50bHkgZGVzY3JpYmluZyBob3cgbWFueSBsaW5lcyB0aGVyZSBhcmUuICovXG4gIGFzeW5jIGdldFR5cGUoKTogUHJvbWlzZTxNYXRMaXN0SXRlbVR5cGU+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgW2lzT25lTGluZSwgaXNUd29MaW5lXSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIGhvc3QuaGFzQ2xhc3MoJ21kYy1saXN0LWl0ZW0tLXdpdGgtb25lLWxpbmUnKSxcbiAgICAgIGhvc3QuaGFzQ2xhc3MoJ21kYy1saXN0LWl0ZW0tLXdpdGgtdHdvLWxpbmVzJyksXG4gICAgXSk7XG4gICAgaWYgKGlzT25lTGluZSkge1xuICAgICAgcmV0dXJuIE1hdExpc3RJdGVtVHlwZS5PTkVfTElORV9JVEVNO1xuICAgIH0gZWxzZSBpZiAoaXNUd29MaW5lKSB7XG4gICAgICByZXR1cm4gTWF0TGlzdEl0ZW1UeXBlLlRXT19MSU5FX0lURU07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBNYXRMaXN0SXRlbVR5cGUuVEhSRUVfTElORV9JVEVNO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBmdWxsIHRleHQgY29udGVudCBvZiB0aGUgbGlzdCBpdGVtLCBleGNsdWRpbmcgdGV4dFxuICAgKiBmcm9tIGljb25zIGFuZCBhdmF0YXJzLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIGBnZXRGdWxsVGV4dGAgbWV0aG9kIGluc3RlYWQuXG4gICAqIEBicmVha2luZy1jaGFuZ2UgMTYuMC4wXG4gICAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnVsbFRleHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBmdWxsIHRleHQgY29udGVudCBvZiB0aGUgbGlzdCBpdGVtLCBleGNsdWRpbmcgdGV4dFxuICAgKiBmcm9tIGljb25zIGFuZCBhdmF0YXJzLlxuICAgKi9cbiAgYXN5bmMgZ2V0RnVsbFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KHtleGNsdWRlOiBgJHtpY29uU2VsZWN0b3J9LCAke2F2YXRhclNlbGVjdG9yfWB9KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0aXRsZSBvZiB0aGUgbGlzdCBpdGVtLiAqL1xuICBhc3luYyBnZXRUaXRsZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5fcHJpbWFyeVRleHQoKSkudGV4dCgpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGxpc3QgaXRlbSBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWRjLWxpc3QtaXRlbS0tZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBzZWNvbmRhcnkgbGluZSB0ZXh0IG9mIHRoZSBsaXN0IGl0ZW0uIE51bGwgaWYgdGhlIGxpc3QgaXRlbVxuICAgKiBkb2VzIG5vdCBoYXZlIGEgc2Vjb25kYXJ5IGxpbmUuXG4gICAqL1xuICBhc3luYyBnZXRTZWNvbmRhcnlUZXh0KCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIGNvbnN0IHR5cGUgPSBhd2FpdCB0aGlzLmdldFR5cGUoKTtcbiAgICBpZiAodHlwZSA9PT0gTWF0TGlzdEl0ZW1UeXBlLk9ORV9MSU5FX0lURU0pIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IFtsaW5lcywgdW5zY29wZWRUZXh0Q29udGVudF0gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBbXG4gICAgICB0aGlzLl9saW5lcygpLFxuICAgICAgdGhpcy5fdW5zY29wZWRUZXh0Q29udGVudCgpLFxuICAgIF0pO1xuXG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gZXhwbGljaXQgbGluZSBmb3IgdGhlIHNlY29uZGFyeSB0ZXh0LCB0aGUgdW5zY29wZWQgdGV4dCBjb250ZW50XG4gICAgLy8gaXMgcmVuZGVyZWQgYXMgdGhlIHNlY29uZGFyeSB0ZXh0ICh3aXRoIHBvdGVudGlhbCB0ZXh0IHdyYXBwaW5nIGVuYWJsZWQpLlxuICAgIGlmIChsaW5lcy5sZW5ndGggPj0gMSkge1xuICAgICAgcmV0dXJuIGxpbmVzWzBdLnRleHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHVuc2NvcGVkVGV4dENvbnRlbnQudGV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB0ZXJ0aWFyeSBsaW5lIHRleHQgb2YgdGhlIGxpc3QgaXRlbS4gTnVsbCBpZiB0aGUgbGlzdCBpdGVtXG4gICAqIGRvZXMgbm90IGhhdmUgYSB0ZXJ0aWFyeSBsaW5lLlxuICAgKi9cbiAgYXN5bmMgZ2V0VGVydGlhcnlUZXh0KCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIGNvbnN0IHR5cGUgPSBhd2FpdCB0aGlzLmdldFR5cGUoKTtcbiAgICBpZiAodHlwZSAhPT0gTWF0TGlzdEl0ZW1UeXBlLlRIUkVFX0xJTkVfSVRFTSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgW2xpbmVzLCB1bnNjb3BlZFRleHRDb250ZW50XSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFtcbiAgICAgIHRoaXMuX2xpbmVzKCksXG4gICAgICB0aGlzLl91bnNjb3BlZFRleHRDb250ZW50KCksXG4gICAgXSk7XG5cbiAgICAvLyBGaXJzdCB3ZSBjaGVjayBpZiB0aGVyZSBpcyBhbiBleHBsaWNpdCBsaW5lIGZvciB0aGUgdGVydGlhcnkgdGV4dC4gSWYgc28sIHdlIHJldHVybiBpdC5cbiAgICAvLyBJZiB0aGVyZSBpcyBhdCBsZWFzdCBhbiBleHBsaWNpdCBzZWNvbmRhcnkgbGluZSB0aG91Z2gsIHRoZW4gd2Uga25vdyB0aGF0IHRoZSB1bnNjb3BlZFxuICAgIC8vIHRleHQgY29udGVudCBjb3JyZXNwb25kcyB0byB0aGUgdGVydGlhcnkgbGluZS4gSWYgdGhlcmUgYXJlIG5vIGV4cGxpY2l0IGxpbmVzIGF0IGFsbCxcbiAgICAvLyB3ZSBrbm93IHRoYXQgdGhlIHVuc2NvcGVkIHRleHQgY29udGVudCBmcm9tIHRoZSBzZWNvbmRhcnkgdGV4dCBqdXN0IHdyYXBzIGludG8gdGhlIHRoaXJkXG4gICAgLy8gbGluZSwgYnV0IHRoZXJlICpubyogYWN0dWFsIGRlZGljYXRlZCB0ZXJ0aWFyeSB0ZXh0LlxuICAgIGlmIChsaW5lcy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHJldHVybiBsaW5lc1sxXS50ZXh0KCk7XG4gICAgfSBlbHNlIGlmIChsaW5lcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiB1bnNjb3BlZFRleHRDb250ZW50LnRleHQoKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGlzIGxpc3QgaXRlbSBoYXMgYW4gYXZhdGFyLiAqL1xuICBhc3luYyBoYXNBdmF0YXIoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuICEhKGF3YWl0IHRoaXMuX2F2YXRhcigpKTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoaXMgbGlzdCBpdGVtIGhhcyBhbiBpY29uLiAqL1xuICBhc3luYyBoYXNJY29uKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAhIShhd2FpdCB0aGlzLl9pY29uKCkpO1xuICB9XG59XG4iXX0=
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
/** Harness for interacting with a standard mat-icon in tests. */
class MatIconHarness extends ComponentHarness {
    /** The selector for the host element of a `MatIcon` instance. */
    static { this.hostSelector = '.mat-icon'; }
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
        return type === 'svg' ? 0 /* IconType.SVG */ : 1 /* IconType.FONT */;
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
        if ((await this.getType()) === 1 /* IconType.FONT */) {
            // Other directives may add content to the icon (e.g. `MatBadge`), however only the direct
            // text nodes affect the name of the icon. Exclude all element descendants from the result.
            const text = await host.text({ exclude: '*' });
            // There are some internal cases where the icon name is wrapped in another node.
            // Fall back to extracting the entire text if we ended up excluding everything above.
            return text.length > 0 ? text : host.text();
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
export { MatIconHarness };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2ljb24vdGVzdGluZy9pY29uLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFHeEUsaUVBQWlFO0FBQ2pFLE1BQWEsY0FBZSxTQUFRLGdCQUFnQjtJQUNsRCxpRUFBaUU7YUFDMUQsaUJBQVksR0FBRyxXQUFXLENBQUM7SUFFbEM7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQThCLEVBQUU7UUFDMUMsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUM7YUFDakQsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssSUFBSSxDQUFDO2FBQzVGLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUNqRCxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUN4RDthQUNBLFNBQVMsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUMzRCxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLElBQUksQ0FBQyxDQUM3RCxDQUFDO0lBQ04sQ0FBQztJQUVELGlDQUFpQztJQUNqQyxLQUFLLENBQUMsT0FBTztRQUNYLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQzFFLE9BQU8sSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLHNCQUFjLENBQUMsc0JBQWMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsaUNBQWlDO0lBQ2pDLEtBQUssQ0FBQyxPQUFPO1FBQ1gsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0IsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFbEUsbUVBQW1FO1FBQ25FLElBQUksV0FBVyxFQUFFO1lBQ2YsT0FBTyxXQUFXLENBQUM7U0FDcEI7UUFFRCxzREFBc0Q7UUFDdEQsc0RBQXNEO1FBQ3RELElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQywwQkFBa0IsRUFBRTtZQUM1QywwRkFBMEY7WUFDMUYsMkZBQTJGO1lBQzNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO1lBRTdDLGdGQUFnRjtZQUNoRixxRkFBcUY7WUFDckYsT0FBTyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDN0M7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxzQ0FBc0M7SUFDdEMsS0FBSyxDQUFDLFlBQVk7UUFDaEIsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDckUsQ0FBQztJQUVELHVDQUF1QztJQUN2QyxLQUFLLENBQUMsUUFBUTtRQUNaLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3pELENBQUM7O1NBNURVLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlfSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0ljb25IYXJuZXNzRmlsdGVycywgSWNvblR5cGV9IGZyb20gJy4vaWNvbi1oYXJuZXNzLWZpbHRlcnMnO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC1pY29uIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdEljb25IYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0SWNvbmAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC1pY29uJztcblxuICAvKipcbiAgICogR2V0cyBhIGBIYXJuZXNzUHJlZGljYXRlYCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlYXJjaCBmb3IgYSBgTWF0SWNvbkhhcm5lc3NgIHRoYXQgbWVldHNcbiAgICogY2VydGFpbiBjcml0ZXJpYS5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgZmlsdGVyaW5nIHdoaWNoIGljb24gaW5zdGFuY2VzIGFyZSBjb25zaWRlcmVkIGEgbWF0Y2guXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogSWNvbkhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdEljb25IYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdEljb25IYXJuZXNzLCBvcHRpb25zKVxuICAgICAgLmFkZE9wdGlvbigndHlwZScsIG9wdGlvbnMudHlwZSwgYXN5bmMgKGhhcm5lc3MsIHR5cGUpID0+IChhd2FpdCBoYXJuZXNzLmdldFR5cGUoKSkgPT09IHR5cGUpXG4gICAgICAuYWRkT3B0aW9uKCduYW1lJywgb3B0aW9ucy5uYW1lLCAoaGFybmVzcywgdGV4dCkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TmFtZSgpLCB0ZXh0KSxcbiAgICAgIClcbiAgICAgIC5hZGRPcHRpb24oJ25hbWVzcGFjZScsIG9wdGlvbnMubmFtZXNwYWNlLCAoaGFybmVzcywgdGV4dCkgPT5cbiAgICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0TmFtZXNwYWNlKCksIHRleHQpLFxuICAgICAgKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0eXBlIG9mIHRoZSBpY29uLiAqL1xuICBhc3luYyBnZXRUeXBlKCk6IFByb21pc2U8SWNvblR5cGU+IHtcbiAgICBjb25zdCB0eXBlID0gYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtbWF0LWljb24tdHlwZScpO1xuICAgIHJldHVybiB0eXBlID09PSAnc3ZnJyA/IEljb25UeXBlLlNWRyA6IEljb25UeXBlLkZPTlQ7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbmFtZSBvZiB0aGUgaWNvbi4gKi9cbiAgYXN5bmMgZ2V0TmFtZSgpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG4gICAgY29uc3QgbmFtZUZyb21Eb20gPSBhd2FpdCBob3N0LmdldEF0dHJpYnV0ZSgnZGF0YS1tYXQtaWNvbi1uYW1lJyk7XG5cbiAgICAvLyBJZiB3ZSBtYW5hZ2VkIHRvIGZpZ3VyZSBvdXQgdGhlIG5hbWUgZnJvbSB0aGUgYXR0cmlidXRlLCB1c2UgaXQuXG4gICAgaWYgKG5hbWVGcm9tRG9tKSB7XG4gICAgICByZXR1cm4gbmFtZUZyb21Eb207XG4gICAgfVxuXG4gICAgLy8gU29tZSBpY29ucyBzdXBwb3J0IGRlZmluaW5nIHRoZSBpY29uIGFzIGEgbGlnYXR1cmUuXG4gICAgLy8gQXMgYSBmYWxsYmFjaywgdHJ5IHRvIGV4dHJhY3QgaXQgZnJvbSB0aGUgRE9NIHRleHQuXG4gICAgaWYgKChhd2FpdCB0aGlzLmdldFR5cGUoKSkgPT09IEljb25UeXBlLkZPTlQpIHtcbiAgICAgIC8vIE90aGVyIGRpcmVjdGl2ZXMgbWF5IGFkZCBjb250ZW50IHRvIHRoZSBpY29uIChlLmcuIGBNYXRCYWRnZWApLCBob3dldmVyIG9ubHkgdGhlIGRpcmVjdFxuICAgICAgLy8gdGV4dCBub2RlcyBhZmZlY3QgdGhlIG5hbWUgb2YgdGhlIGljb24uIEV4Y2x1ZGUgYWxsIGVsZW1lbnQgZGVzY2VuZGFudHMgZnJvbSB0aGUgcmVzdWx0LlxuICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IGhvc3QudGV4dCh7ZXhjbHVkZTogJyonfSk7XG5cbiAgICAgIC8vIFRoZXJlIGFyZSBzb21lIGludGVybmFsIGNhc2VzIHdoZXJlIHRoZSBpY29uIG5hbWUgaXMgd3JhcHBlZCBpbiBhbm90aGVyIG5vZGUuXG4gICAgICAvLyBGYWxsIGJhY2sgdG8gZXh0cmFjdGluZyB0aGUgZW50aXJlIHRleHQgaWYgd2UgZW5kZWQgdXAgZXhjbHVkaW5nIGV2ZXJ5dGhpbmcgYWJvdmUuXG4gICAgICByZXR1cm4gdGV4dC5sZW5ndGggPiAwID8gdGV4dCA6IGhvc3QudGV4dCgpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG5hbWVzcGFjZSBvZiB0aGUgaWNvbi4gKi9cbiAgYXN5bmMgZ2V0TmFtZXNwYWNlKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnZGF0YS1tYXQtaWNvbi1uYW1lc3BhY2UnKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIGljb24gaXMgaW5saW5lLiAqL1xuICBhc3luYyBpc0lubGluZSgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS5oYXNDbGFzcygnbWF0LWljb24taW5saW5lJyk7XG4gIH1cbn1cbiJdfQ==
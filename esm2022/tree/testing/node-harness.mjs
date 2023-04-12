/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ContentContainerComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
/** Harness for interacting with a standard Angular Material tree node. */
class MatTreeNodeHarness extends ContentContainerComponentHarness {
    constructor() {
        super(...arguments);
        this._toggle = this.locatorForOptional('[matTreeNodeToggle]');
    }
    /** The selector of the host element of a `MatTreeNode` instance. */
    static { this.hostSelector = '.mat-tree-node, .mat-nested-tree-node'; }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a tree node with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getNodePredicate(MatTreeNodeHarness, options);
    }
    /** Whether the tree node is expanded. */
    async isExpanded() {
        return coerceBooleanProperty(await (await this.host()).getAttribute('aria-expanded'));
    }
    /** Whether the tree node is disabled. */
    async isDisabled() {
        return coerceBooleanProperty(await (await this.host()).getProperty('aria-disabled'));
    }
    /** Gets the level of the tree node. Note that this gets the aria-level and is 1 indexed. */
    async getLevel() {
        return coerceNumberProperty(await (await this.host()).getAttribute('aria-level'));
    }
    /** Gets the tree node's text. */
    async getText() {
        return (await this.host()).text({ exclude: '.mat-tree-node, .mat-nested-tree-node, button' });
    }
    /** Toggles node between expanded/collapsed. Only works when node is not disabled. */
    async toggle() {
        const toggle = await this._toggle();
        if (toggle) {
            return toggle.click();
        }
    }
    /** Expands the node if it is collapsed. Only works when node is not disabled. */
    async expand() {
        if (!(await this.isExpanded())) {
            await this.toggle();
        }
    }
    /** Collapses the node if it is expanded. Only works when node is not disabled. */
    async collapse() {
        if (await this.isExpanded()) {
            await this.toggle();
        }
    }
}
export { MatTreeNodeHarness };
function getNodePredicate(type, options) {
    return new HarnessPredicate(type, options)
        .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
        .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled)
        .addOption('expanded', options.expanded, async (harness, expanded) => (await harness.isExpanded()) === expanded)
        .addOption('level', options.level, async (harness, level) => (await harness.getLevel()) === level);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvdGVzdGluZy9ub2RlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLGdDQUFnQyxFQUNoQyxnQkFBZ0IsR0FDakIsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBQUMscUJBQXFCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUVsRiwwRUFBMEU7QUFDMUUsTUFBYSxrQkFBbUIsU0FBUSxnQ0FBd0M7SUFBaEY7O1FBSUUsWUFBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBb0QzRCxDQUFDO0lBdkRDLG9FQUFvRTthQUM3RCxpQkFBWSxHQUFHLHVDQUF1QyxBQUExQyxDQUEyQztJQUk5RDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFrQyxFQUFFO1FBQzlDLE9BQU8sZ0JBQWdCLENBQUMsa0JBQWtCLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELHlDQUF5QztJQUN6QyxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8scUJBQXFCLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDeEYsQ0FBQztJQUVELHlDQUF5QztJQUN6QyxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8scUJBQXFCLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVELDRGQUE0RjtJQUM1RixLQUFLLENBQUMsUUFBUTtRQUNaLE9BQU8sb0JBQW9CLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUVELGlDQUFpQztJQUNqQyxLQUFLLENBQUMsT0FBTztRQUNYLE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSwrQ0FBK0MsRUFBQyxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVELHFGQUFxRjtJQUNyRixLQUFLLENBQUMsTUFBTTtRQUNWLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BDLElBQUksTUFBTSxFQUFFO1lBQ1YsT0FBTyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQsaUZBQWlGO0lBQ2pGLEtBQUssQ0FBQyxNQUFNO1FBQ1YsSUFBSSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRTtZQUM5QixNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFRCxrRkFBa0Y7SUFDbEYsS0FBSyxDQUFDLFFBQVE7UUFDWixJQUFJLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQzNCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQzs7U0F2RFUsa0JBQWtCO0FBMEQvQixTQUFTLGdCQUFnQixDQUN2QixJQUFvQyxFQUNwQyxPQUErQjtJQUUvQixPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztTQUN2QyxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FDakQsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FDeEQ7U0FDQSxTQUFTLENBQ1IsVUFBVSxFQUNWLE9BQU8sQ0FBQyxRQUFRLEVBQ2hCLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLEtBQUssUUFBUSxDQUN2RTtTQUNBLFNBQVMsQ0FDUixVQUFVLEVBQ1YsT0FBTyxDQUFDLFFBQVEsRUFDaEIsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxRQUFRLENBQ3ZFO1NBQ0EsU0FBUyxDQUNSLE9BQU8sRUFDUCxPQUFPLENBQUMsS0FBSyxFQUNiLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssS0FBSyxDQUMvRCxDQUFDO0FBQ04sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3IsXG4gIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzLFxuICBIYXJuZXNzUHJlZGljYXRlLFxufSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge1RyZWVOb2RlSGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vdHJlZS1oYXJuZXNzLWZpbHRlcnMnO1xuaW1wb3J0IHtjb2VyY2VCb29sZWFuUHJvcGVydHksIGNvZXJjZU51bWJlclByb3BlcnR5fSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIEFuZ3VsYXIgTWF0ZXJpYWwgdHJlZSBub2RlLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRyZWVOb2RlSGFybmVzcyBleHRlbmRzIENvbnRlbnRDb250YWluZXJDb21wb25lbnRIYXJuZXNzPHN0cmluZz4ge1xuICAvKiogVGhlIHNlbGVjdG9yIG9mIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0VHJlZU5vZGVgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtdHJlZS1ub2RlLCAubWF0LW5lc3RlZC10cmVlLW5vZGUnO1xuXG4gIF90b2dnbGUgPSB0aGlzLmxvY2F0b3JGb3JPcHRpb25hbCgnW21hdFRyZWVOb2RlVG9nZ2xlXScpO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHRyZWUgbm9kZSB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogVHJlZU5vZGVIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRUcmVlTm9kZUhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0Tm9kZVByZWRpY2F0ZShNYXRUcmVlTm9kZUhhcm5lc3MsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRyZWUgbm9kZSBpcyBleHBhbmRlZC4gKi9cbiAgYXN5bmMgaXNFeHBhbmRlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykpO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIHRyZWUgbm9kZSBpcyBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gY29lcmNlQm9vbGVhblByb3BlcnR5KGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0UHJvcGVydHkoJ2FyaWEtZGlzYWJsZWQnKSk7XG4gIH1cblxuICAvKiogR2V0cyB0aGUgbGV2ZWwgb2YgdGhlIHRyZWUgbm9kZS4gTm90ZSB0aGF0IHRoaXMgZ2V0cyB0aGUgYXJpYS1sZXZlbCBhbmQgaXMgMSBpbmRleGVkLiAqL1xuICBhc3luYyBnZXRMZXZlbCgpOiBQcm9taXNlPG51bWJlcj4ge1xuICAgIHJldHVybiBjb2VyY2VOdW1iZXJQcm9wZXJ0eShhd2FpdCAoYXdhaXQgdGhpcy5ob3N0KCkpLmdldEF0dHJpYnV0ZSgnYXJpYS1sZXZlbCcpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB0cmVlIG5vZGUncyB0ZXh0LiAqL1xuICBhc3luYyBnZXRUZXh0KCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIChhd2FpdCB0aGlzLmhvc3QoKSkudGV4dCh7ZXhjbHVkZTogJy5tYXQtdHJlZS1ub2RlLCAubWF0LW5lc3RlZC10cmVlLW5vZGUsIGJ1dHRvbid9KTtcbiAgfVxuXG4gIC8qKiBUb2dnbGVzIG5vZGUgYmV0d2VlbiBleHBhbmRlZC9jb2xsYXBzZWQuIE9ubHkgd29ya3Mgd2hlbiBub2RlIGlzIG5vdCBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgdG9nZ2xlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHRvZ2dsZSA9IGF3YWl0IHRoaXMuX3RvZ2dsZSgpO1xuICAgIGlmICh0b2dnbGUpIHtcbiAgICAgIHJldHVybiB0b2dnbGUuY2xpY2soKTtcbiAgICB9XG4gIH1cblxuICAvKiogRXhwYW5kcyB0aGUgbm9kZSBpZiBpdCBpcyBjb2xsYXBzZWQuIE9ubHkgd29ya3Mgd2hlbiBub2RlIGlzIG5vdCBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgZXhwYW5kKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghKGF3YWl0IHRoaXMuaXNFeHBhbmRlZCgpKSkge1xuICAgICAgYXdhaXQgdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ29sbGFwc2VzIHRoZSBub2RlIGlmIGl0IGlzIGV4cGFuZGVkLiBPbmx5IHdvcmtzIHdoZW4gbm9kZSBpcyBub3QgZGlzYWJsZWQuICovXG4gIGFzeW5jIGNvbGxhcHNlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmlzRXhwYW5kZWQoKSkge1xuICAgICAgYXdhaXQgdGhpcy50b2dnbGUoKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Tm9kZVByZWRpY2F0ZTxUIGV4dGVuZHMgTWF0VHJlZU5vZGVIYXJuZXNzPihcbiAgdHlwZTogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFQ+LFxuICBvcHRpb25zOiBUcmVlTm9kZUhhcm5lc3NGaWx0ZXJzLFxuKTogSGFybmVzc1ByZWRpY2F0ZTxUPiB7XG4gIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZSh0eXBlLCBvcHRpb25zKVxuICAgIC5hZGRPcHRpb24oJ3RleHQnLCBvcHRpb25zLnRleHQsIChoYXJuZXNzLCB0ZXh0KSA9PlxuICAgICAgSGFybmVzc1ByZWRpY2F0ZS5zdHJpbmdNYXRjaGVzKGhhcm5lc3MuZ2V0VGV4dCgpLCB0ZXh0KSxcbiAgICApXG4gICAgLmFkZE9wdGlvbihcbiAgICAgICdkaXNhYmxlZCcsXG4gICAgICBvcHRpb25zLmRpc2FibGVkLFxuICAgICAgYXN5bmMgKGhhcm5lc3MsIGRpc2FibGVkKSA9PiAoYXdhaXQgaGFybmVzcy5pc0Rpc2FibGVkKCkpID09PSBkaXNhYmxlZCxcbiAgICApXG4gICAgLmFkZE9wdGlvbihcbiAgICAgICdleHBhbmRlZCcsXG4gICAgICBvcHRpb25zLmV4cGFuZGVkLFxuICAgICAgYXN5bmMgKGhhcm5lc3MsIGV4cGFuZGVkKSA9PiAoYXdhaXQgaGFybmVzcy5pc0V4cGFuZGVkKCkpID09PSBleHBhbmRlZCxcbiAgICApXG4gICAgLmFkZE9wdGlvbihcbiAgICAgICdsZXZlbCcsXG4gICAgICBvcHRpb25zLmxldmVsLFxuICAgICAgYXN5bmMgKGhhcm5lc3MsIGxldmVsKSA9PiAoYXdhaXQgaGFybmVzcy5nZXRMZXZlbCgpKSA9PT0gbGV2ZWwsXG4gICAgKTtcbn1cbiJdfQ==
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
export class MatTreeNodeHarness extends ContentContainerComponentHarness {
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
function getNodePredicate(type, options) {
    return new HarnessPredicate(type, options)
        .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
        .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled)
        .addOption('expanded', options.expanded, async (harness, expanded) => (await harness.isExpanded()) === expanded)
        .addOption('level', options.level, async (harness, level) => (await harness.getLevel()) === level);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvdGVzdGluZy9ub2RlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLGdDQUFnQyxFQUNoQyxnQkFBZ0IsR0FDakIsTUFBTSxzQkFBc0IsQ0FBQztBQUU5QixPQUFPLEVBQUMscUJBQXFCLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUVsRiwwRUFBMEU7QUFDMUUsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGdDQUF3QztJQUFoRjs7UUFJRSxZQUFPLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFvRDNELENBQUM7SUF2REMsb0VBQW9FO2FBQzdELGlCQUFZLEdBQUcsdUNBQXVDLEFBQTFDLENBQTJDO0lBSTlEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWtDLEVBQUU7UUFDOUMsT0FBTyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQseUNBQXlDO0lBQ3pDLEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN4RixDQUFDO0lBRUQseUNBQXlDO0lBQ3pDLEtBQUssQ0FBQyxVQUFVO1FBQ2QsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBRUQsNEZBQTRGO0lBQzVGLEtBQUssQ0FBQyxRQUFRO1FBQ1osT0FBTyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBRUQsaUNBQWlDO0lBQ2pDLEtBQUssQ0FBQyxPQUFPO1FBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFFLCtDQUErQyxFQUFDLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUQscUZBQXFGO0lBQ3JGLEtBQUssQ0FBQyxNQUFNO1FBQ1YsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEMsSUFBSSxNQUFNLEVBQUU7WUFDVixPQUFPLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN2QjtJQUNILENBQUM7SUFFRCxpRkFBaUY7SUFDakYsS0FBSyxDQUFDLE1BQU07UUFDVixJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxFQUFFO1lBQzlCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUVELGtGQUFrRjtJQUNsRixLQUFLLENBQUMsUUFBUTtRQUNaLElBQUksTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDM0IsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDckI7SUFDSCxDQUFDOztBQUdILFNBQVMsZ0JBQWdCLENBQ3ZCLElBQW9DLEVBQ3BDLE9BQStCO0lBRS9CLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDO1NBQ3ZDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUNqRCxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxDQUN4RDtTQUNBLFNBQVMsQ0FDUixVQUFVLEVBQ1YsT0FBTyxDQUFDLFFBQVEsRUFDaEIsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxRQUFRLENBQ3ZFO1NBQ0EsU0FBUyxDQUNSLFVBQVUsRUFDVixPQUFPLENBQUMsUUFBUSxFQUNoQixLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FDdkU7U0FDQSxTQUFTLENBQ1IsT0FBTyxFQUNQLE9BQU8sQ0FBQyxLQUFLLEVBQ2IsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxLQUFLLENBQy9ELENBQUM7QUFDTixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcixcbiAgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3MsXG4gIEhhcm5lc3NQcmVkaWNhdGUsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7VHJlZU5vZGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi90cmVlLWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgY29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgQW5ndWxhciBNYXRlcmlhbCB0cmVlIG5vZGUuICovXG5leHBvcnQgY2xhc3MgTWF0VHJlZU5vZGVIYXJuZXNzIGV4dGVuZHMgQ29udGVudENvbnRhaW5lckNvbXBvbmVudEhhcm5lc3M8c3RyaW5nPiB7XG4gIC8qKiBUaGUgc2VsZWN0b3Igb2YgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRUcmVlTm9kZWAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC10cmVlLW5vZGUsIC5tYXQtbmVzdGVkLXRyZWUtbm9kZSc7XG5cbiAgX3RvZ2dsZSA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCdbbWF0VHJlZU5vZGVUb2dnbGVdJyk7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgdHJlZSBub2RlIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2hcbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBUcmVlTm9kZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFRyZWVOb2RlSGFybmVzcz4ge1xuICAgIHJldHVybiBnZXROb2RlUHJlZGljYXRlKE1hdFRyZWVOb2RlSGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdHJlZSBub2RlIGlzIGV4cGFuZGVkLiAqL1xuICBhc3luYyBpc0V4cGFuZGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdHJlZSBub2RlIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnYXJpYS1kaXNhYmxlZCcpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsZXZlbCBvZiB0aGUgdHJlZSBub2RlLiBOb3RlIHRoYXQgdGhpcyBnZXRzIHRoZSBhcmlhLWxldmVsIGFuZCBpcyAxIGluZGV4ZWQuICovXG4gIGFzeW5jIGdldExldmVsKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGNvZXJjZU51bWJlclByb3BlcnR5KGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxldmVsJykpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRyZWUgbm9kZSdzIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KHtleGNsdWRlOiAnLm1hdC10cmVlLW5vZGUsIC5tYXQtbmVzdGVkLXRyZWUtbm9kZSwgYnV0dG9uJ30pO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgbm9kZSBiZXR3ZWVuIGV4cGFuZGVkL2NvbGxhcHNlZC4gT25seSB3b3JrcyB3aGVuIG5vZGUgaXMgbm90IGRpc2FibGVkLiAqL1xuICBhc3luYyB0b2dnbGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgdG9nZ2xlID0gYXdhaXQgdGhpcy5fdG9nZ2xlKCk7XG4gICAgaWYgKHRvZ2dsZSkge1xuICAgICAgcmV0dXJuIHRvZ2dsZS5jbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFeHBhbmRzIHRoZSBub2RlIGlmIGl0IGlzIGNvbGxhcHNlZC4gT25seSB3b3JrcyB3aGVuIG5vZGUgaXMgbm90IGRpc2FibGVkLiAqL1xuICBhc3luYyBleHBhbmQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5pc0V4cGFuZGVkKCkpKSB7XG4gICAgICBhd2FpdCB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDb2xsYXBzZXMgdGhlIG5vZGUgaWYgaXQgaXMgZXhwYW5kZWQuIE9ubHkgd29ya3Mgd2hlbiBub2RlIGlzIG5vdCBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgY29sbGFwc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaXNFeHBhbmRlZCgpKSB7XG4gICAgICBhd2FpdCB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXROb2RlUHJlZGljYXRlPFQgZXh0ZW5kcyBNYXRUcmVlTm9kZUhhcm5lc3M+KFxuICB0eXBlOiBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8VD4sXG4gIG9wdGlvbnM6IFRyZWVOb2RlSGFybmVzc0ZpbHRlcnMsXG4pOiBIYXJuZXNzUHJlZGljYXRlPFQ+IHtcbiAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKHR5cGUsIG9wdGlvbnMpXG4gICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCwgKGhhcm5lc3MsIHRleHQpID0+XG4gICAgICBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUZXh0KCksIHRleHQpLFxuICAgIClcbiAgICAuYWRkT3B0aW9uKFxuICAgICAgJ2Rpc2FibGVkJyxcbiAgICAgIG9wdGlvbnMuZGlzYWJsZWQsXG4gICAgICBhc3luYyAoaGFybmVzcywgZGlzYWJsZWQpID0+IChhd2FpdCBoYXJuZXNzLmlzRGlzYWJsZWQoKSkgPT09IGRpc2FibGVkLFxuICAgIClcbiAgICAuYWRkT3B0aW9uKFxuICAgICAgJ2V4cGFuZGVkJyxcbiAgICAgIG9wdGlvbnMuZXhwYW5kZWQsXG4gICAgICBhc3luYyAoaGFybmVzcywgZXhwYW5kZWQpID0+IChhd2FpdCBoYXJuZXNzLmlzRXhwYW5kZWQoKSkgPT09IGV4cGFuZGVkLFxuICAgIClcbiAgICAuYWRkT3B0aW9uKFxuICAgICAgJ2xldmVsJyxcbiAgICAgIG9wdGlvbnMubGV2ZWwsXG4gICAgICBhc3luYyAoaGFybmVzcywgbGV2ZWwpID0+IChhd2FpdCBoYXJuZXNzLmdldExldmVsKCkpID09PSBsZXZlbCxcbiAgICApO1xufVxuIl19
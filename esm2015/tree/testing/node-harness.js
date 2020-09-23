/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
/** Harness for interacting with a standard Angular Material tree node. */
export class MatTreeNodeHarness extends ComponentHarness {
    constructor() {
        super(...arguments);
        this._toggle = this.locatorForOptional('[matTreeNodeToggle]');
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search for a tree node with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return getNodePredicate(MatTreeNodeHarness, options);
    }
    /** Whether the tree node is expanded. */
    isExpanded() {
        return __awaiter(this, void 0, void 0, function* () {
            return coerceBooleanProperty(yield (yield this.host()).getAttribute('aria-expanded'));
        });
    }
    /** Whether the tree node is disabled. */
    isDisabled() {
        return __awaiter(this, void 0, void 0, function* () {
            return coerceBooleanProperty(yield (yield this.host()).getProperty('aria-disabled'));
        });
    }
    /** Gets the level of the tree node. Note that this gets the aria-level and is 1 indexed. */
    getLevel() {
        return __awaiter(this, void 0, void 0, function* () {
            return coerceNumberProperty(yield (yield this.host()).getAttribute('aria-level'));
        });
    }
    /** Gets the tree node's text. */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.host()).text({ exclude: '.mat-tree-node, .mat-nested-tree-node, button' });
        });
    }
    /** Toggles node between expanded/collapsed. Only works when node is not disabled. */
    toggle() {
        return __awaiter(this, void 0, void 0, function* () {
            const toggle = yield this._toggle();
            if (toggle) {
                return toggle.click();
            }
        });
    }
    /** Expands the node if it is collapsed. Only works when node is not disabled. */
    expand() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isExpanded())) {
                yield this.toggle();
            }
        });
    }
    /** Collapses the node if it is expanded. Only works when node is not disabled. */
    collapse() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.isExpanded()) {
                yield this.toggle();
            }
        });
    }
}
/** The selector of the host element of a `MatTreeNode` instance. */
MatTreeNodeHarness.hostSelector = '.mat-tree-node, .mat-nested-tree-node';
function getNodePredicate(type, options) {
    return new HarnessPredicate(type, options)
        .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))
        .addOption('disabled', options.disabled, (harness, disabled) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isDisabled()) === disabled; }))
        .addOption('expanded', options.expanded, (harness, expanded) => __awaiter(this, void 0, void 0, function* () { return (yield harness.isExpanded()) === expanded; }))
        .addOption('level', options.level, (harness, level) => __awaiter(this, void 0, void 0, function* () { return (yield harness.getLevel()) === level; }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvdGVzdGluZy9ub2RlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFDTCxnQkFBZ0IsRUFFaEIsZ0JBQWdCLEVBQ2pCLE1BQU0sc0JBQXNCLENBQUM7QUFFOUIsT0FBTyxFQUFDLHFCQUFxQixFQUFFLG9CQUFvQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFbEYsMEVBQTBFO0FBQzFFLE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxnQkFBZ0I7SUFBeEQ7O1FBSUUsWUFBTyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBb0QzRCxDQUFDO0lBbERDOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWtDLEVBQUU7UUFDOUMsT0FBTyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQseUNBQXlDO0lBQ25DLFVBQVU7O1lBQ2QsT0FBTyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUN4RixDQUFDO0tBQUE7SUFFRCx5Q0FBeUM7SUFDbkMsVUFBVTs7WUFDZCxPQUFPLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQ3ZGLENBQUM7S0FBQTtJQUVELDRGQUE0RjtJQUN0RixRQUFROztZQUNaLE9BQU8sb0JBQW9CLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDcEYsQ0FBQztLQUFBO0lBRUQsaUNBQWlDO0lBQzNCLE9BQU87O1lBQ1gsT0FBTyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFFLCtDQUErQyxFQUFDLENBQUMsQ0FBQztRQUM5RixDQUFDO0tBQUE7SUFFRCxxRkFBcUY7SUFDL0UsTUFBTTs7WUFDVixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQyxJQUFJLE1BQU0sRUFBRTtnQkFDVixPQUFPLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUN2QjtRQUNILENBQUM7S0FBQTtJQUVELGlGQUFpRjtJQUMzRSxNQUFNOztZQUNWLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUU7Z0JBQzlCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ3JCO1FBQ0gsQ0FBQztLQUFBO0lBRUQsa0ZBQWtGO0lBQzVFLFFBQVE7O1lBQ1osSUFBSSxNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtnQkFDM0IsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDckI7UUFDSCxDQUFDO0tBQUE7O0FBdERELG9FQUFvRTtBQUM3RCwrQkFBWSxHQUFHLHVDQUF1QyxDQUFDO0FBd0RoRSxTQUFTLGdCQUFnQixDQUN2QixJQUFvQyxFQUNwQyxPQUErQjtJQUMvQixPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztTQUN2QyxTQUFTLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQzdCLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM1RSxTQUFTLENBQ1IsVUFBVSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQzVCLENBQU8sT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUFFLGdEQUFDLE9BQUEsQ0FBQyxNQUFNLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxLQUFLLFFBQVEsQ0FBQSxHQUFBLENBQUM7U0FDeEUsU0FBUyxDQUNSLFVBQVUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUM1QixDQUFPLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxnREFBQyxPQUFBLENBQUMsTUFBTSxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsS0FBSyxRQUFRLENBQUEsR0FBQSxDQUFDO1NBQ3hFLFNBQVMsQ0FDUixPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFDdEIsQ0FBTyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUUsZ0RBQUMsT0FBQSxDQUFDLE1BQU0sT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssS0FBSyxDQUFBLEdBQUEsQ0FBQyxDQUFDO0FBQ3RFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yLFxuICBIYXJuZXNzUHJlZGljYXRlXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7VHJlZU5vZGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi90cmVlLWhhcm5lc3MtZmlsdGVycyc7XG5pbXBvcnQge2NvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgY29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgQW5ndWxhciBNYXRlcmlhbCB0cmVlIG5vZGUuICovXG5leHBvcnQgY2xhc3MgTWF0VHJlZU5vZGVIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3Igb2YgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRUcmVlTm9kZWAgaW5zdGFuY2UuICovXG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC10cmVlLW5vZGUsIC5tYXQtbmVzdGVkLXRyZWUtbm9kZSc7XG5cbiAgX3RvZ2dsZSA9IHRoaXMubG9jYXRvckZvck9wdGlvbmFsKCdbbWF0VHJlZU5vZGVUb2dnbGVdJyk7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgdHJlZSBub2RlIHdpdGggc3BlY2lmaWMgYXR0cmlidXRlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgbmFycm93aW5nIHRoZSBzZWFyY2hcbiAgICogQHJldHVybiBhIGBIYXJuZXNzUHJlZGljYXRlYCBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqL1xuICBzdGF0aWMgd2l0aChvcHRpb25zOiBUcmVlTm9kZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFRyZWVOb2RlSGFybmVzcz4ge1xuICAgIHJldHVybiBnZXROb2RlUHJlZGljYXRlKE1hdFRyZWVOb2RlSGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdHJlZSBub2RlIGlzIGV4cGFuZGVkLiAqL1xuICBhc3luYyBpc0V4cGFuZGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSk7XG4gIH1cblxuICAvKiogV2hldGhlciB0aGUgdHJlZSBub2RlIGlzIGRpc2FibGVkLiAqL1xuICBhc3luYyBpc0Rpc2FibGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBjb2VyY2VCb29sZWFuUHJvcGVydHkoYXdhaXQgKGF3YWl0IHRoaXMuaG9zdCgpKS5nZXRQcm9wZXJ0eSgnYXJpYS1kaXNhYmxlZCcpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBsZXZlbCBvZiB0aGUgdHJlZSBub2RlLiBOb3RlIHRoYXQgdGhpcyBnZXRzIHRoZSBhcmlhLWxldmVsIGFuZCBpcyAxIGluZGV4ZWQuICovXG4gIGFzeW5jIGdldExldmVsKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIGNvZXJjZU51bWJlclByb3BlcnR5KGF3YWl0IChhd2FpdCB0aGlzLmhvc3QoKSkuZ2V0QXR0cmlidXRlKCdhcmlhLWxldmVsJykpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHRyZWUgbm9kZSdzIHRleHQuICovXG4gIGFzeW5jIGdldFRleHQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMuaG9zdCgpKS50ZXh0KHtleGNsdWRlOiAnLm1hdC10cmVlLW5vZGUsIC5tYXQtbmVzdGVkLXRyZWUtbm9kZSwgYnV0dG9uJ30pO1xuICB9XG5cbiAgLyoqIFRvZ2dsZXMgbm9kZSBiZXR3ZWVuIGV4cGFuZGVkL2NvbGxhcHNlZC4gT25seSB3b3JrcyB3aGVuIG5vZGUgaXMgbm90IGRpc2FibGVkLiAqL1xuICBhc3luYyB0b2dnbGUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgdG9nZ2xlID0gYXdhaXQgdGhpcy5fdG9nZ2xlKCk7XG4gICAgaWYgKHRvZ2dsZSkge1xuICAgICAgcmV0dXJuIHRvZ2dsZS5jbGljaygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBFeHBhbmRzIHRoZSBub2RlIGlmIGl0IGlzIGNvbGxhcHNlZC4gT25seSB3b3JrcyB3aGVuIG5vZGUgaXMgbm90IGRpc2FibGVkLiAqL1xuICBhc3luYyBleHBhbmQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCEoYXdhaXQgdGhpcy5pc0V4cGFuZGVkKCkpKSB7XG4gICAgICBhd2FpdCB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDb2xsYXBzZXMgdGhlIG5vZGUgaWYgaXQgaXMgZXhwYW5kZWQuIE9ubHkgd29ya3Mgd2hlbiBub2RlIGlzIG5vdCBkaXNhYmxlZC4gKi9cbiAgYXN5bmMgY29sbGFwc2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKGF3YWl0IHRoaXMuaXNFeHBhbmRlZCgpKSB7XG4gICAgICBhd2FpdCB0aGlzLnRvZ2dsZSgpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXROb2RlUHJlZGljYXRlPFQgZXh0ZW5kcyBNYXRUcmVlTm9kZUhhcm5lc3M+KFxuICB0eXBlOiBDb21wb25lbnRIYXJuZXNzQ29uc3RydWN0b3I8VD4sXG4gIG9wdGlvbnM6IFRyZWVOb2RlSGFybmVzc0ZpbHRlcnMpOiBIYXJuZXNzUHJlZGljYXRlPFQ+IHtcbiAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKHR5cGUsIG9wdGlvbnMpXG4gICAgLmFkZE9wdGlvbigndGV4dCcsIG9wdGlvbnMudGV4dCxcbiAgICAgIChoYXJuZXNzLCB0ZXh0KSA9PiBIYXJuZXNzUHJlZGljYXRlLnN0cmluZ01hdGNoZXMoaGFybmVzcy5nZXRUZXh0KCksIHRleHQpKVxuICAgIC5hZGRPcHRpb24oXG4gICAgICAnZGlzYWJsZWQnLCBvcHRpb25zLmRpc2FibGVkLFxuICAgICAgYXN5bmMgKGhhcm5lc3MsIGRpc2FibGVkKSA9PiAoYXdhaXQgaGFybmVzcy5pc0Rpc2FibGVkKCkpID09PSBkaXNhYmxlZClcbiAgICAuYWRkT3B0aW9uKFxuICAgICAgJ2V4cGFuZGVkJywgb3B0aW9ucy5leHBhbmRlZCxcbiAgICAgIGFzeW5jIChoYXJuZXNzLCBleHBhbmRlZCkgPT4gKGF3YWl0IGhhcm5lc3MuaXNFeHBhbmRlZCgpKSA9PT0gZXhwYW5kZWQpXG4gICAgLmFkZE9wdGlvbihcbiAgICAgICdsZXZlbCcsIG9wdGlvbnMubGV2ZWwsXG4gICAgICBhc3luYyAoaGFybmVzcywgbGV2ZWwpID0+IChhd2FpdCBoYXJuZXNzLmdldExldmVsKCkpID09PSBsZXZlbCk7XG59XG4iXX0=
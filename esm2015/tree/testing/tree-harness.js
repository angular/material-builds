/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { __awaiter } from "tslib";
import { ComponentHarness, HarnessPredicate, parallel } from '@angular/cdk/testing';
import { MatTreeNodeHarness } from './node-harness';
/** Harness for interacting with a standard mat-tree in tests. */
export class MatTreeHarness extends ComponentHarness {
    /**
     * Gets a `HarnessPredicate` that can be used to search for a tree with specific attributes.
     * @param options Options for narrowing the search
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTreeHarness, options);
    }
    /** Gets all of the nodes in the tree. */
    getNodes(filter = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locatorForAll(MatTreeNodeHarness.with(filter))();
        });
    }
    /**
     * Gets an object representation for the visible tree structure
     * If a node is under an unexpanded node it will not be included.
     * Eg.
     * Tree (all nodes expanded):
     * `
     * <mat-tree>
     *   <mat-tree-node>Node 1<mat-tree-node>
     *   <mat-nested-tree-node>
     *     Node 2
     *     <mat-nested-tree-node>
     *       Node 2.1
     *       <mat-tree-node>
     *         Node 2.1.1
     *       <mat-tree-node>
     *     <mat-nested-tree-node>
     *     <mat-tree-node>
     *       Node 2.2
     *     <mat-tree-node>
     *   <mat-nested-tree-node>
     * </mat-tree>`
     *
     * Tree structure:
     * {
     *  children: [
     *    {
     *      text: 'Node 1',
     *      children: [
     *        {
     *          text: 'Node 2',
     *          children: [
     *            {
     *              text: 'Node 2.1',
     *              children: [{text: 'Node 2.1.1'}]
     *            },
     *            {text: 'Node 2.2'}
     *          ]
     *        }
     *      ]
     *    }
     *  ]
     * };
     */
    getTreeStructure() {
        return __awaiter(this, void 0, void 0, function* () {
            const nodes = yield this.getNodes();
            const nodeInformation = yield parallel(() => nodes.map(node => {
                return Promise.all([node.getLevel(), node.getText(), node.isExpanded()]);
            }));
            return this._getTreeStructure(nodeInformation, 1, true);
        });
    }
    /**
     * Recursively collect the structured text of the tree nodes.
     * @param nodes A list of tree nodes
     * @param level The level of nodes that are being accounted for during this iteration
     * @param parentExpanded Whether the parent of the first node in param nodes is expanded
     */
    _getTreeStructure(nodes, level, parentExpanded) {
        var _a, _b, _c;
        const result = {};
        for (let i = 0; i < nodes.length; i++) {
            const [nodeLevel, text, expanded] = nodes[i];
            const nextNodeLevel = (_b = (_a = nodes[i + 1]) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : -1;
            // Return the accumulated value for the current level once we reach a shallower level node
            if (nodeLevel < level) {
                return result;
            }
            // Skip deeper level nodes during this iteration, they will be picked up in a later iteration
            if (nodeLevel > level) {
                continue;
            }
            // Only add to representation if it is visible (parent is expanded)
            if (parentExpanded) {
                // Collect the data under this node according to the following rules:
                // 1. If the next node in the list is a sibling of the current node add it to the child list
                // 2. If the next node is a child of the current node, get the sub-tree structure for the
                //    child and add it under this node
                // 3. If the next node has a shallower level, we've reached the end of the child nodes for
                //    the current parent.
                if (nextNodeLevel === level) {
                    this._addChildToNode(result, { text });
                }
                else if (nextNodeLevel > level) {
                    let children = (_c = this._getTreeStructure(nodes.slice(i + 1), nextNodeLevel, expanded)) === null || _c === void 0 ? void 0 : _c.children;
                    let child = children ? { text, children } : { text };
                    this._addChildToNode(result, child);
                }
                else {
                    this._addChildToNode(result, { text });
                    return result;
                }
            }
        }
        return result;
    }
    _addChildToNode(result, child) {
        result.children ? result.children.push(child) : result.children = [child];
    }
}
/** The selector for the host element of a `MatTableHarness` instance. */
MatTreeHarness.hostSelector = '.mat-tree';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvdGVzdGluZy90cmVlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOztBQUVILE9BQU8sRUFBQyxnQkFBZ0IsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRixPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQVFsRCxpRUFBaUU7QUFDakUsTUFBTSxPQUFPLGNBQWUsU0FBUSxnQkFBZ0I7SUFJbEQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBOEIsRUFBRTtRQUMxQyxPQUFPLElBQUksZ0JBQWdCLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCx5Q0FBeUM7SUFDbkMsUUFBUSxDQUFDLFNBQWlDLEVBQUU7O1lBQ2hELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQy9ELENBQUM7S0FBQTtJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0EwQ0c7SUFDRyxnQkFBZ0I7O1lBQ3BCLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3BDLE1BQU0sZUFBZSxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzVELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0osT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZUFBZSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxRCxDQUFDO0tBQUE7SUFFRDs7Ozs7T0FLRztJQUNLLGlCQUFpQixDQUFDLEtBQWtDLEVBQUUsS0FBYSxFQUN4QyxjQUF1Qjs7UUFDeEQsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxNQUFNLGFBQWEsZUFBRyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQywwQ0FBRyxDQUFDLG9DQUFLLENBQUMsQ0FBQyxDQUFDO1lBRTlDLDBGQUEwRjtZQUMxRixJQUFJLFNBQVMsR0FBRyxLQUFLLEVBQUU7Z0JBQ3JCLE9BQU8sTUFBTSxDQUFDO2FBQ2Y7WUFDRCw2RkFBNkY7WUFDN0YsSUFBSSxTQUFTLEdBQUcsS0FBSyxFQUFFO2dCQUNyQixTQUFTO2FBQ1Y7WUFDRCxtRUFBbUU7WUFDbkUsSUFBSSxjQUFjLEVBQUU7Z0JBQ2xCLHFFQUFxRTtnQkFDckUsNEZBQTRGO2dCQUM1Rix5RkFBeUY7Z0JBQ3pGLHNDQUFzQztnQkFDdEMsMEZBQTBGO2dCQUMxRix5QkFBeUI7Z0JBQ3pCLElBQUksYUFBYSxLQUFLLEtBQUssRUFBRTtvQkFDM0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO2lCQUN0QztxQkFBTSxJQUFJLGFBQWEsR0FBRyxLQUFLLEVBQUU7b0JBQ2hDLElBQUksUUFBUSxTQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFDdEQsYUFBYSxFQUNiLFFBQVEsQ0FBQywwQ0FBRSxRQUFRLENBQUM7b0JBQ3RCLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFDLENBQUM7b0JBQ2pELElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUNyQztxQkFBTTtvQkFDTCxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7b0JBQ3JDLE9BQU8sTUFBTSxDQUFDO2lCQUNmO2FBQ0Y7U0FDRjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTyxlQUFlLENBQUMsTUFBZ0IsRUFBRSxLQUFlO1FBQ3ZELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUUsQ0FBQzs7QUFwSEQseUVBQXlFO0FBQ2xFLDJCQUFZLEdBQUcsV0FBVyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q29tcG9uZW50SGFybmVzcywgSGFybmVzc1ByZWRpY2F0ZSwgcGFyYWxsZWx9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7TWF0VHJlZU5vZGVIYXJuZXNzfSBmcm9tICcuL25vZGUtaGFybmVzcyc7XG5pbXBvcnQge1RyZWVIYXJuZXNzRmlsdGVycywgVHJlZU5vZGVIYXJuZXNzRmlsdGVyc30gZnJvbSAnLi90cmVlLWhhcm5lc3MtZmlsdGVycyc7XG5cbmV4cG9ydCB0eXBlIFRleHRUcmVlID0ge1xuICB0ZXh0Pzogc3RyaW5nO1xuICBjaGlsZHJlbj86IFRleHRUcmVlW107XG59O1xuXG4vKiogSGFybmVzcyBmb3IgaW50ZXJhY3Rpbmcgd2l0aCBhIHN0YW5kYXJkIG1hdC10cmVlIGluIHRlc3RzLiAqL1xuZXhwb3J0IGNsYXNzIE1hdFRyZWVIYXJuZXNzIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcyB7XG4gIC8qKiBUaGUgc2VsZWN0b3IgZm9yIHRoZSBob3N0IGVsZW1lbnQgb2YgYSBgTWF0VGFibGVIYXJuZXNzYCBpbnN0YW5jZS4gKi9cbiAgc3RhdGljIGhvc3RTZWxlY3RvciA9ICcubWF0LXRyZWUnO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoIGZvciBhIHRyZWUgd2l0aCBzcGVjaWZpYyBhdHRyaWJ1dGVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciBuYXJyb3dpbmcgdGhlIHNlYXJjaFxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFRyZWVIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRUcmVlSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRUcmVlSGFybmVzcywgb3B0aW9ucyk7XG4gIH1cblxuICAvKiogR2V0cyBhbGwgb2YgdGhlIG5vZGVzIGluIHRoZSB0cmVlLiAqL1xuICBhc3luYyBnZXROb2RlcyhmaWx0ZXI6IFRyZWVOb2RlSGFybmVzc0ZpbHRlcnMgPSB7fSk6IFByb21pc2U8TWF0VHJlZU5vZGVIYXJuZXNzW10+IHtcbiAgICByZXR1cm4gdGhpcy5sb2NhdG9yRm9yQWxsKE1hdFRyZWVOb2RlSGFybmVzcy53aXRoKGZpbHRlcikpKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhbiBvYmplY3QgcmVwcmVzZW50YXRpb24gZm9yIHRoZSB2aXNpYmxlIHRyZWUgc3RydWN0dXJlXG4gICAqIElmIGEgbm9kZSBpcyB1bmRlciBhbiB1bmV4cGFuZGVkIG5vZGUgaXQgd2lsbCBub3QgYmUgaW5jbHVkZWQuXG4gICAqIEVnLlxuICAgKiBUcmVlIChhbGwgbm9kZXMgZXhwYW5kZWQpOlxuICAgKiBgXG4gICAqIDxtYXQtdHJlZT5cbiAgICogICA8bWF0LXRyZWUtbm9kZT5Ob2RlIDE8bWF0LXRyZWUtbm9kZT5cbiAgICogICA8bWF0LW5lc3RlZC10cmVlLW5vZGU+XG4gICAqICAgICBOb2RlIDJcbiAgICogICAgIDxtYXQtbmVzdGVkLXRyZWUtbm9kZT5cbiAgICogICAgICAgTm9kZSAyLjFcbiAgICogICAgICAgPG1hdC10cmVlLW5vZGU+XG4gICAqICAgICAgICAgTm9kZSAyLjEuMVxuICAgKiAgICAgICA8bWF0LXRyZWUtbm9kZT5cbiAgICogICAgIDxtYXQtbmVzdGVkLXRyZWUtbm9kZT5cbiAgICogICAgIDxtYXQtdHJlZS1ub2RlPlxuICAgKiAgICAgICBOb2RlIDIuMlxuICAgKiAgICAgPG1hdC10cmVlLW5vZGU+XG4gICAqICAgPG1hdC1uZXN0ZWQtdHJlZS1ub2RlPlxuICAgKiA8L21hdC10cmVlPmBcbiAgICpcbiAgICogVHJlZSBzdHJ1Y3R1cmU6XG4gICAqIHtcbiAgICogIGNoaWxkcmVuOiBbXG4gICAqICAgIHtcbiAgICogICAgICB0ZXh0OiAnTm9kZSAxJyxcbiAgICogICAgICBjaGlsZHJlbjogW1xuICAgKiAgICAgICAge1xuICAgKiAgICAgICAgICB0ZXh0OiAnTm9kZSAyJyxcbiAgICogICAgICAgICAgY2hpbGRyZW46IFtcbiAgICogICAgICAgICAgICB7XG4gICAqICAgICAgICAgICAgICB0ZXh0OiAnTm9kZSAyLjEnLFxuICAgKiAgICAgICAgICAgICAgY2hpbGRyZW46IFt7dGV4dDogJ05vZGUgMi4xLjEnfV1cbiAgICogICAgICAgICAgICB9LFxuICAgKiAgICAgICAgICAgIHt0ZXh0OiAnTm9kZSAyLjInfVxuICAgKiAgICAgICAgICBdXG4gICAqICAgICAgICB9XG4gICAqICAgICAgXVxuICAgKiAgICB9XG4gICAqICBdXG4gICAqIH07XG4gICAqL1xuICBhc3luYyBnZXRUcmVlU3RydWN0dXJlKCk6IFByb21pc2U8VGV4dFRyZWU+IHtcbiAgICBjb25zdCBub2RlcyA9IGF3YWl0IHRoaXMuZ2V0Tm9kZXMoKTtcbiAgICBjb25zdCBub2RlSW5mb3JtYXRpb24gPSBhd2FpdCBwYXJhbGxlbCgoKSA9PiBub2Rlcy5tYXAobm9kZSA9PiB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoW25vZGUuZ2V0TGV2ZWwoKSwgbm9kZS5nZXRUZXh0KCksIG5vZGUuaXNFeHBhbmRlZCgpXSk7XG4gICAgfSkpO1xuICAgIHJldHVybiB0aGlzLl9nZXRUcmVlU3RydWN0dXJlKG5vZGVJbmZvcm1hdGlvbiwgMSwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgY29sbGVjdCB0aGUgc3RydWN0dXJlZCB0ZXh0IG9mIHRoZSB0cmVlIG5vZGVzLlxuICAgKiBAcGFyYW0gbm9kZXMgQSBsaXN0IG9mIHRyZWUgbm9kZXNcbiAgICogQHBhcmFtIGxldmVsIFRoZSBsZXZlbCBvZiBub2RlcyB0aGF0IGFyZSBiZWluZyBhY2NvdW50ZWQgZm9yIGR1cmluZyB0aGlzIGl0ZXJhdGlvblxuICAgKiBAcGFyYW0gcGFyZW50RXhwYW5kZWQgV2hldGhlciB0aGUgcGFyZW50IG9mIHRoZSBmaXJzdCBub2RlIGluIHBhcmFtIG5vZGVzIGlzIGV4cGFuZGVkXG4gICAqL1xuICBwcml2YXRlIF9nZXRUcmVlU3RydWN0dXJlKG5vZGVzOiBbbnVtYmVyLCBzdHJpbmcsIGJvb2xlYW5dW10sIGxldmVsOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50RXhwYW5kZWQ6IGJvb2xlYW4pOiBUZXh0VHJlZSB7XG4gICAgY29uc3QgcmVzdWx0OiBUZXh0VHJlZSA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IFtub2RlTGV2ZWwsIHRleHQsIGV4cGFuZGVkXSA9IG5vZGVzW2ldO1xuICAgICAgY29uc3QgbmV4dE5vZGVMZXZlbCA9IG5vZGVzW2kgKyAxXT8uWzBdID8/IC0xO1xuXG4gICAgICAvLyBSZXR1cm4gdGhlIGFjY3VtdWxhdGVkIHZhbHVlIGZvciB0aGUgY3VycmVudCBsZXZlbCBvbmNlIHdlIHJlYWNoIGEgc2hhbGxvd2VyIGxldmVsIG5vZGVcbiAgICAgIGlmIChub2RlTGV2ZWwgPCBsZXZlbCkge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICAgLy8gU2tpcCBkZWVwZXIgbGV2ZWwgbm9kZXMgZHVyaW5nIHRoaXMgaXRlcmF0aW9uLCB0aGV5IHdpbGwgYmUgcGlja2VkIHVwIGluIGEgbGF0ZXIgaXRlcmF0aW9uXG4gICAgICBpZiAobm9kZUxldmVsID4gbGV2ZWwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICAvLyBPbmx5IGFkZCB0byByZXByZXNlbnRhdGlvbiBpZiBpdCBpcyB2aXNpYmxlIChwYXJlbnQgaXMgZXhwYW5kZWQpXG4gICAgICBpZiAocGFyZW50RXhwYW5kZWQpIHtcbiAgICAgICAgLy8gQ29sbGVjdCB0aGUgZGF0YSB1bmRlciB0aGlzIG5vZGUgYWNjb3JkaW5nIHRvIHRoZSBmb2xsb3dpbmcgcnVsZXM6XG4gICAgICAgIC8vIDEuIElmIHRoZSBuZXh0IG5vZGUgaW4gdGhlIGxpc3QgaXMgYSBzaWJsaW5nIG9mIHRoZSBjdXJyZW50IG5vZGUgYWRkIGl0IHRvIHRoZSBjaGlsZCBsaXN0XG4gICAgICAgIC8vIDIuIElmIHRoZSBuZXh0IG5vZGUgaXMgYSBjaGlsZCBvZiB0aGUgY3VycmVudCBub2RlLCBnZXQgdGhlIHN1Yi10cmVlIHN0cnVjdHVyZSBmb3IgdGhlXG4gICAgICAgIC8vICAgIGNoaWxkIGFuZCBhZGQgaXQgdW5kZXIgdGhpcyBub2RlXG4gICAgICAgIC8vIDMuIElmIHRoZSBuZXh0IG5vZGUgaGFzIGEgc2hhbGxvd2VyIGxldmVsLCB3ZSd2ZSByZWFjaGVkIHRoZSBlbmQgb2YgdGhlIGNoaWxkIG5vZGVzIGZvclxuICAgICAgICAvLyAgICB0aGUgY3VycmVudCBwYXJlbnQuXG4gICAgICAgIGlmIChuZXh0Tm9kZUxldmVsID09PSBsZXZlbCkge1xuICAgICAgICAgIHRoaXMuX2FkZENoaWxkVG9Ob2RlKHJlc3VsdCwge3RleHR9KTtcbiAgICAgICAgfSBlbHNlIGlmIChuZXh0Tm9kZUxldmVsID4gbGV2ZWwpIHtcbiAgICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLl9nZXRUcmVlU3RydWN0dXJlKG5vZGVzLnNsaWNlKGkgKyAxKSxcbiAgICAgICAgICAgIG5leHROb2RlTGV2ZWwsXG4gICAgICAgICAgICBleHBhbmRlZCk/LmNoaWxkcmVuO1xuICAgICAgICAgIGxldCBjaGlsZCA9IGNoaWxkcmVuID8ge3RleHQsIGNoaWxkcmVufSA6IHt0ZXh0fTtcbiAgICAgICAgICB0aGlzLl9hZGRDaGlsZFRvTm9kZShyZXN1bHQsIGNoaWxkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9hZGRDaGlsZFRvTm9kZShyZXN1bHQsIHt0ZXh0fSk7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgcHJpdmF0ZSBfYWRkQ2hpbGRUb05vZGUocmVzdWx0OiBUZXh0VHJlZSwgY2hpbGQ6IFRleHRUcmVlKSB7XG4gICAgcmVzdWx0LmNoaWxkcmVuID8gcmVzdWx0LmNoaWxkcmVuLnB1c2goY2hpbGQpIDogcmVzdWx0LmNoaWxkcmVuID0gW2NoaWxkXTtcbiAgfVxufVxuIl19
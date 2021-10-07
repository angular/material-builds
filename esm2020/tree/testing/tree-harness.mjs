/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
    async getNodes(filter = {}) {
        return this.locatorForAll(MatTreeNodeHarness.with(filter))();
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
    async getTreeStructure() {
        const nodes = await this.getNodes();
        const nodeInformation = await parallel(() => nodes.map(node => {
            return parallel(() => [node.getLevel(), node.getText(), node.isExpanded()]);
        }));
        return this._getTreeStructure(nodeInformation, 1, true);
    }
    /**
     * Recursively collect the structured text of the tree nodes.
     * @param nodes A list of tree nodes
     * @param level The level of nodes that are being accounted for during this iteration
     * @param parentExpanded Whether the parent of the first node in param nodes is expanded
     */
    _getTreeStructure(nodes, level, parentExpanded) {
        const result = {};
        for (let i = 0; i < nodes.length; i++) {
            const [nodeLevel, text, expanded] = nodes[i];
            const nextNodeLevel = nodes[i + 1]?.[0] ?? -1;
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
                    let children = this._getTreeStructure(nodes.slice(i + 1), nextNodeLevel, expanded)?.children;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3RyZWUvdGVzdGluZy90cmVlLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2xGLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBUWxELGlFQUFpRTtBQUNqRSxNQUFNLE9BQU8sY0FBZSxTQUFRLGdCQUFnQjtJQUlsRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUE4QixFQUFFO1FBQzFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVELHlDQUF5QztJQUN6QyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQWlDLEVBQUU7UUFDaEQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDL0QsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0EwQ0c7SUFDSCxLQUFLLENBQUMsZ0JBQWdCO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3BDLE1BQU0sZUFBZSxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUQsT0FBTyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNKLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssaUJBQWlCLENBQUMsS0FBa0MsRUFBRSxLQUFhLEVBQ3hDLGNBQXVCO1FBQ3hELE1BQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyQyxNQUFNLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRTlDLDBGQUEwRjtZQUMxRixJQUFJLFNBQVMsR0FBRyxLQUFLLEVBQUU7Z0JBQ3JCLE9BQU8sTUFBTSxDQUFDO2FBQ2Y7WUFDRCw2RkFBNkY7WUFDN0YsSUFBSSxTQUFTLEdBQUcsS0FBSyxFQUFFO2dCQUNyQixTQUFTO2FBQ1Y7WUFDRCxtRUFBbUU7WUFDbkUsSUFBSSxjQUFjLEVBQUU7Z0JBQ2xCLHFFQUFxRTtnQkFDckUsNEZBQTRGO2dCQUM1Rix5RkFBeUY7Z0JBQ3pGLHNDQUFzQztnQkFDdEMsMEZBQTBGO2dCQUMxRix5QkFBeUI7Z0JBQ3pCLElBQUksYUFBYSxLQUFLLEtBQUssRUFBRTtvQkFDM0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO2lCQUN0QztxQkFBTSxJQUFJLGFBQWEsR0FBRyxLQUFLLEVBQUU7b0JBQ2hDLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFDdEQsYUFBYSxFQUNiLFFBQVEsQ0FBQyxFQUFFLFFBQVEsQ0FBQztvQkFDdEIsSUFBSSxLQUFLLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLEVBQUMsQ0FBQztvQkFDakQsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ3JDO3FCQUFNO29CQUNMLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztvQkFDckMsT0FBTyxNQUFNLENBQUM7aUJBQ2Y7YUFDRjtTQUNGO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVPLGVBQWUsQ0FBQyxNQUFnQixFQUFFLEtBQWU7UUFDdkQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1RSxDQUFDOztBQXBIRCx5RUFBeUU7QUFDbEUsMkJBQVksR0FBRyxXQUFXLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBIYXJuZXNzUHJlZGljYXRlLCBwYXJhbGxlbH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtNYXRUcmVlTm9kZUhhcm5lc3N9IGZyb20gJy4vbm9kZS1oYXJuZXNzJztcbmltcG9ydCB7VHJlZUhhcm5lc3NGaWx0ZXJzLCBUcmVlTm9kZUhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3RyZWUtaGFybmVzcy1maWx0ZXJzJztcblxuZXhwb3J0IHR5cGUgVGV4dFRyZWUgPSB7XG4gIHRleHQ/OiBzdHJpbmc7XG4gIGNoaWxkcmVuPzogVGV4dFRyZWVbXTtcbn07XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXRyZWUgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0VHJlZUhhcm5lc3MgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgLyoqIFRoZSBzZWxlY3RvciBmb3IgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGBNYXRUYWJsZUhhcm5lc3NgIGluc3RhbmNlLiAqL1xuICBzdGF0aWMgaG9zdFNlbGVjdG9yID0gJy5tYXQtdHJlZSc7XG5cbiAgLyoqXG4gICAqIEdldHMgYSBgSGFybmVzc1ByZWRpY2F0ZWAgdGhhdCBjYW4gYmUgdXNlZCB0byBzZWFyY2ggZm9yIGEgdHJlZSB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoXG4gICAqIEByZXR1cm4gYSBgSGFybmVzc1ByZWRpY2F0ZWAgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKi9cbiAgc3RhdGljIHdpdGgob3B0aW9uczogVHJlZUhhcm5lc3NGaWx0ZXJzID0ge30pOiBIYXJuZXNzUHJlZGljYXRlPE1hdFRyZWVIYXJuZXNzPiB7XG4gICAgcmV0dXJuIG5ldyBIYXJuZXNzUHJlZGljYXRlKE1hdFRyZWVIYXJuZXNzLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGFsbCBvZiB0aGUgbm9kZXMgaW4gdGhlIHRyZWUuICovXG4gIGFzeW5jIGdldE5vZGVzKGZpbHRlcjogVHJlZU5vZGVIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRUcmVlTm9kZUhhcm5lc3NbXT4ge1xuICAgIHJldHVybiB0aGlzLmxvY2F0b3JGb3JBbGwoTWF0VHJlZU5vZGVIYXJuZXNzLndpdGgoZmlsdGVyKSkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGFuIG9iamVjdCByZXByZXNlbnRhdGlvbiBmb3IgdGhlIHZpc2libGUgdHJlZSBzdHJ1Y3R1cmVcbiAgICogSWYgYSBub2RlIGlzIHVuZGVyIGFuIHVuZXhwYW5kZWQgbm9kZSBpdCB3aWxsIG5vdCBiZSBpbmNsdWRlZC5cbiAgICogRWcuXG4gICAqIFRyZWUgKGFsbCBub2RlcyBleHBhbmRlZCk6XG4gICAqIGBcbiAgICogPG1hdC10cmVlPlxuICAgKiAgIDxtYXQtdHJlZS1ub2RlPk5vZGUgMTxtYXQtdHJlZS1ub2RlPlxuICAgKiAgIDxtYXQtbmVzdGVkLXRyZWUtbm9kZT5cbiAgICogICAgIE5vZGUgMlxuICAgKiAgICAgPG1hdC1uZXN0ZWQtdHJlZS1ub2RlPlxuICAgKiAgICAgICBOb2RlIDIuMVxuICAgKiAgICAgICA8bWF0LXRyZWUtbm9kZT5cbiAgICogICAgICAgICBOb2RlIDIuMS4xXG4gICAqICAgICAgIDxtYXQtdHJlZS1ub2RlPlxuICAgKiAgICAgPG1hdC1uZXN0ZWQtdHJlZS1ub2RlPlxuICAgKiAgICAgPG1hdC10cmVlLW5vZGU+XG4gICAqICAgICAgIE5vZGUgMi4yXG4gICAqICAgICA8bWF0LXRyZWUtbm9kZT5cbiAgICogICA8bWF0LW5lc3RlZC10cmVlLW5vZGU+XG4gICAqIDwvbWF0LXRyZWU+YFxuICAgKlxuICAgKiBUcmVlIHN0cnVjdHVyZTpcbiAgICoge1xuICAgKiAgY2hpbGRyZW46IFtcbiAgICogICAge1xuICAgKiAgICAgIHRleHQ6ICdOb2RlIDEnLFxuICAgKiAgICAgIGNoaWxkcmVuOiBbXG4gICAqICAgICAgICB7XG4gICAqICAgICAgICAgIHRleHQ6ICdOb2RlIDInLFxuICAgKiAgICAgICAgICBjaGlsZHJlbjogW1xuICAgKiAgICAgICAgICAgIHtcbiAgICogICAgICAgICAgICAgIHRleHQ6ICdOb2RlIDIuMScsXG4gICAqICAgICAgICAgICAgICBjaGlsZHJlbjogW3t0ZXh0OiAnTm9kZSAyLjEuMSd9XVxuICAgKiAgICAgICAgICAgIH0sXG4gICAqICAgICAgICAgICAge3RleHQ6ICdOb2RlIDIuMid9XG4gICAqICAgICAgICAgIF1cbiAgICogICAgICAgIH1cbiAgICogICAgICBdXG4gICAqICAgIH1cbiAgICogIF1cbiAgICogfTtcbiAgICovXG4gIGFzeW5jIGdldFRyZWVTdHJ1Y3R1cmUoKTogUHJvbWlzZTxUZXh0VHJlZT4ge1xuICAgIGNvbnN0IG5vZGVzID0gYXdhaXQgdGhpcy5nZXROb2RlcygpO1xuICAgIGNvbnN0IG5vZGVJbmZvcm1hdGlvbiA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IG5vZGVzLm1hcChub2RlID0+IHtcbiAgICAgIHJldHVybiBwYXJhbGxlbCgoKSA9PiBbbm9kZS5nZXRMZXZlbCgpLCBub2RlLmdldFRleHQoKSwgbm9kZS5pc0V4cGFuZGVkKCldKTtcbiAgICB9KSk7XG4gICAgcmV0dXJuIHRoaXMuX2dldFRyZWVTdHJ1Y3R1cmUobm9kZUluZm9ybWF0aW9uLCAxLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmVseSBjb2xsZWN0IHRoZSBzdHJ1Y3R1cmVkIHRleHQgb2YgdGhlIHRyZWUgbm9kZXMuXG4gICAqIEBwYXJhbSBub2RlcyBBIGxpc3Qgb2YgdHJlZSBub2Rlc1xuICAgKiBAcGFyYW0gbGV2ZWwgVGhlIGxldmVsIG9mIG5vZGVzIHRoYXQgYXJlIGJlaW5nIGFjY291bnRlZCBmb3IgZHVyaW5nIHRoaXMgaXRlcmF0aW9uXG4gICAqIEBwYXJhbSBwYXJlbnRFeHBhbmRlZCBXaGV0aGVyIHRoZSBwYXJlbnQgb2YgdGhlIGZpcnN0IG5vZGUgaW4gcGFyYW0gbm9kZXMgaXMgZXhwYW5kZWRcbiAgICovXG4gIHByaXZhdGUgX2dldFRyZWVTdHJ1Y3R1cmUobm9kZXM6IFtudW1iZXIsIHN0cmluZywgYm9vbGVhbl1bXSwgbGV2ZWw6IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRFeHBhbmRlZDogYm9vbGVhbik6IFRleHRUcmVlIHtcbiAgICBjb25zdCByZXN1bHQ6IFRleHRUcmVlID0ge307XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgW25vZGVMZXZlbCwgdGV4dCwgZXhwYW5kZWRdID0gbm9kZXNbaV07XG4gICAgICBjb25zdCBuZXh0Tm9kZUxldmVsID0gbm9kZXNbaSArIDFdPy5bMF0gPz8gLTE7XG5cbiAgICAgIC8vIFJldHVybiB0aGUgYWNjdW11bGF0ZWQgdmFsdWUgZm9yIHRoZSBjdXJyZW50IGxldmVsIG9uY2Ugd2UgcmVhY2ggYSBzaGFsbG93ZXIgbGV2ZWwgbm9kZVxuICAgICAgaWYgKG5vZGVMZXZlbCA8IGxldmVsKSB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICAvLyBTa2lwIGRlZXBlciBsZXZlbCBub2RlcyBkdXJpbmcgdGhpcyBpdGVyYXRpb24sIHRoZXkgd2lsbCBiZSBwaWNrZWQgdXAgaW4gYSBsYXRlciBpdGVyYXRpb25cbiAgICAgIGlmIChub2RlTGV2ZWwgPiBsZXZlbCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIC8vIE9ubHkgYWRkIHRvIHJlcHJlc2VudGF0aW9uIGlmIGl0IGlzIHZpc2libGUgKHBhcmVudCBpcyBleHBhbmRlZClcbiAgICAgIGlmIChwYXJlbnRFeHBhbmRlZCkge1xuICAgICAgICAvLyBDb2xsZWN0IHRoZSBkYXRhIHVuZGVyIHRoaXMgbm9kZSBhY2NvcmRpbmcgdG8gdGhlIGZvbGxvd2luZyBydWxlczpcbiAgICAgICAgLy8gMS4gSWYgdGhlIG5leHQgbm9kZSBpbiB0aGUgbGlzdCBpcyBhIHNpYmxpbmcgb2YgdGhlIGN1cnJlbnQgbm9kZSBhZGQgaXQgdG8gdGhlIGNoaWxkIGxpc3RcbiAgICAgICAgLy8gMi4gSWYgdGhlIG5leHQgbm9kZSBpcyBhIGNoaWxkIG9mIHRoZSBjdXJyZW50IG5vZGUsIGdldCB0aGUgc3ViLXRyZWUgc3RydWN0dXJlIGZvciB0aGVcbiAgICAgICAgLy8gICAgY2hpbGQgYW5kIGFkZCBpdCB1bmRlciB0aGlzIG5vZGVcbiAgICAgICAgLy8gMy4gSWYgdGhlIG5leHQgbm9kZSBoYXMgYSBzaGFsbG93ZXIgbGV2ZWwsIHdlJ3ZlIHJlYWNoZWQgdGhlIGVuZCBvZiB0aGUgY2hpbGQgbm9kZXMgZm9yXG4gICAgICAgIC8vICAgIHRoZSBjdXJyZW50IHBhcmVudC5cbiAgICAgICAgaWYgKG5leHROb2RlTGV2ZWwgPT09IGxldmVsKSB7XG4gICAgICAgICAgdGhpcy5fYWRkQ2hpbGRUb05vZGUocmVzdWx0LCB7dGV4dH0pO1xuICAgICAgICB9IGVsc2UgaWYgKG5leHROb2RlTGV2ZWwgPiBsZXZlbCkge1xuICAgICAgICAgIGxldCBjaGlsZHJlbiA9IHRoaXMuX2dldFRyZWVTdHJ1Y3R1cmUobm9kZXMuc2xpY2UoaSArIDEpLFxuICAgICAgICAgICAgbmV4dE5vZGVMZXZlbCxcbiAgICAgICAgICAgIGV4cGFuZGVkKT8uY2hpbGRyZW47XG4gICAgICAgICAgbGV0IGNoaWxkID0gY2hpbGRyZW4gPyB7dGV4dCwgY2hpbGRyZW59IDoge3RleHR9O1xuICAgICAgICAgIHRoaXMuX2FkZENoaWxkVG9Ob2RlKHJlc3VsdCwgY2hpbGQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX2FkZENoaWxkVG9Ob2RlKHJlc3VsdCwge3RleHR9KTtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIF9hZGRDaGlsZFRvTm9kZShyZXN1bHQ6IFRleHRUcmVlLCBjaGlsZDogVGV4dFRyZWUpIHtcbiAgICByZXN1bHQuY2hpbGRyZW4gPyByZXN1bHQuY2hpbGRyZW4ucHVzaChjaGlsZCkgOiByZXN1bHQuY2hpbGRyZW4gPSBbY2hpbGRdO1xuICB9XG59XG4iXX0=
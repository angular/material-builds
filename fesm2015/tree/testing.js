import { __awaiter } from 'tslib';
import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness } from '@angular/cdk/testing';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard Angular Material tree node. */
class MatTreeNodeHarness extends ContentContainerComponentHarness {
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

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Harness for interacting with a standard mat-tree in tests. */
class MatTreeHarness extends ComponentHarness {
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
}
/** The selector for the host element of a `MatTableHarness` instance. */
MatTreeHarness.hostSelector = '.mat-tree';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

export { MatTreeHarness, MatTreeNodeHarness };
//# sourceMappingURL=testing.js.map

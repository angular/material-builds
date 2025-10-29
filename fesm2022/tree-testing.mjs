import { ContentContainerComponentHarness, HarnessPredicate, ComponentHarness, parallel } from '@angular/cdk/testing';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';

class MatTreeNodeHarness extends ContentContainerComponentHarness {
  static hostSelector = '.mat-tree-node, .mat-nested-tree-node';
  _toggle = this.locatorForOptional('[matTreeNodeToggle]');
  static with(options = {}) {
    return getNodePredicate(MatTreeNodeHarness, options);
  }
  async isExpanded() {
    return coerceBooleanProperty(await (await this.host()).getAttribute('aria-expanded'));
  }
  async isExpandable() {
    return (await (await this.host()).getAttribute('aria-expanded')) !== null;
  }
  async isDisabled() {
    return coerceBooleanProperty(await (await this.host()).getProperty('aria-disabled'));
  }
  async getLevel() {
    return coerceNumberProperty(await (await this.host()).getAttribute('aria-level'));
  }
  async getText() {
    return (await this.host()).text({
      exclude: '.mat-tree-node, .mat-nested-tree-node, button'
    });
  }
  async toggle() {
    const toggle = await this._toggle();
    if (toggle) {
      return toggle.click();
    }
  }
  async expand() {
    if (!(await this.isExpanded())) {
      await this.toggle();
    }
  }
  async collapse() {
    if (await this.isExpanded()) {
      await this.toggle();
    }
  }
}
function getNodePredicate(type, options) {
  return new HarnessPredicate(type, options).addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text)).addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled).addOption('expanded', options.expanded, async (harness, expanded) => (await harness.isExpanded()) === expanded).addOption('level', options.level, async (harness, level) => (await harness.getLevel()) === level);
}

class MatTreeHarness extends ComponentHarness {
  static hostSelector = '.mat-tree';
  static with(options = {}) {
    return new HarnessPredicate(MatTreeHarness, options);
  }
  async getNodes(filter = {}) {
    return this.locatorForAll(MatTreeNodeHarness.with(filter))();
  }
  async getTreeStructure() {
    const nodes = await this.getNodes();
    const nodeInformation = await parallel(() => nodes.map(node => {
      return parallel(() => [node.getLevel(), node.getText(), node.isExpanded()]);
    }));
    return this._getTreeStructure(nodeInformation, 1, true);
  }
  _getTreeStructure(nodes, level, parentExpanded) {
    const result = {};
    for (let i = 0; i < nodes.length; i++) {
      const [nodeLevel, text, expanded] = nodes[i];
      const nextNodeLevel = nodes[i + 1]?.[0] ?? -1;
      if (nodeLevel < level) {
        return result;
      }
      if (nodeLevel > level) {
        continue;
      }
      if (parentExpanded) {
        if (nextNodeLevel === level) {
          this._addChildToNode(result, {
            text
          });
        } else if (nextNodeLevel > level) {
          let children = this._getTreeStructure(nodes.slice(i + 1), nextNodeLevel, expanded)?.children;
          let child = children ? {
            text,
            children
          } : {
            text
          };
          this._addChildToNode(result, child);
        } else {
          this._addChildToNode(result, {
            text
          });
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

export { MatTreeHarness, MatTreeNodeHarness };
//# sourceMappingURL=tree-testing.mjs.map

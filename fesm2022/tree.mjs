import { CdkTreeNode, CdkTreeNodeDef, CdkNestedTreeNode, CDK_TREE_NODE_OUTLET_NODE, CdkTreeNodePadding, CdkTreeNodeOutlet, CdkTree, CdkTreeNodeToggle, CdkTreeModule } from '@angular/cdk/tree';
import * as i0 from '@angular/core';
import { inject, HostAttributeToken, numberAttribute, booleanAttribute, Directive, Input, ViewContainerRef, Component, ViewEncapsulation, ChangeDetectionStrategy, ViewChild, NgModule } from '@angular/core';
import { BidiModule } from '@angular/cdk/bidi';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, merge } from 'rxjs';
import { take, map } from 'rxjs/operators';

function isNoopTreeKeyManager(keyManager) {
  return !!keyManager._isNoopTreeKeyManager;
}
class MatTreeNode extends CdkTreeNode {
  get tabIndexInputBinding() {
    return this._tabIndexInputBinding;
  }
  set tabIndexInputBinding(value) {
    this._tabIndexInputBinding = value;
  }
  _tabIndexInputBinding;
  defaultTabIndex = 0;
  _getTabindexAttribute() {
    if (isNoopTreeKeyManager(this._tree._keyManager)) {
      return this.tabIndexInputBinding;
    }
    return this._tabindex;
  }
  get disabled() {
    return this.isDisabled;
  }
  set disabled(value) {
    this.isDisabled = value;
  }
  constructor() {
    super();
    const tabIndex = inject(new HostAttributeToken('tabindex'), {
      optional: true
    });
    this.tabIndexInputBinding = Number(tabIndex) || this.defaultTabIndex;
  }
  ngOnInit() {
    super.ngOnInit();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatTreeNode,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "16.1.0",
    version: "21.0.0",
    type: MatTreeNode,
    isStandalone: true,
    selector: "mat-tree-node",
    inputs: {
      tabIndexInputBinding: ["tabIndex", "tabIndexInputBinding", value => value == null ? 0 : numberAttribute(value)],
      disabled: ["disabled", "disabled", booleanAttribute]
    },
    outputs: {
      activation: "activation",
      expandedChange: "expandedChange"
    },
    host: {
      listeners: {
        "click": "_focusItem()"
      },
      properties: {
        "attr.aria-expanded": "_getAriaExpanded()",
        "attr.aria-level": "level + 1",
        "attr.aria-posinset": "_getPositionInSet()",
        "attr.aria-setsize": "_getSetSize()",
        "tabindex": "_getTabindexAttribute()"
      },
      classAttribute: "mat-tree-node"
    },
    providers: [{
      provide: CdkTreeNode,
      useExisting: MatTreeNode
    }],
    exportAs: ["matTreeNode"],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatTreeNode,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'mat-tree-node',
      exportAs: 'matTreeNode',
      outputs: ['activation', 'expandedChange'],
      providers: [{
        provide: CdkTreeNode,
        useExisting: MatTreeNode
      }],
      host: {
        'class': 'mat-tree-node',
        '[attr.aria-expanded]': '_getAriaExpanded()',
        '[attr.aria-level]': 'level + 1',
        '[attr.aria-posinset]': '_getPositionInSet()',
        '[attr.aria-setsize]': '_getSetSize()',
        '(click)': '_focusItem()',
        '[tabindex]': '_getTabindexAttribute()'
      }
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    tabIndexInputBinding: [{
      type: Input,
      args: [{
        transform: value => value == null ? 0 : numberAttribute(value),
        alias: 'tabIndex'
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  }
});
class MatTreeNodeDef extends CdkTreeNodeDef {
  data;
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatTreeNodeDef,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0",
    type: MatTreeNodeDef,
    isStandalone: true,
    selector: "[matTreeNodeDef]",
    inputs: {
      when: ["matTreeNodeDefWhen", "when"],
      data: ["matTreeNode", "data"]
    },
    providers: [{
      provide: CdkTreeNodeDef,
      useExisting: MatTreeNodeDef
    }],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatTreeNodeDef,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matTreeNodeDef]',
      inputs: [{
        name: 'when',
        alias: 'matTreeNodeDefWhen'
      }],
      providers: [{
        provide: CdkTreeNodeDef,
        useExisting: MatTreeNodeDef
      }]
    }]
  }],
  propDecorators: {
    data: [{
      type: Input,
      args: ['matTreeNode']
    }]
  }
});
class MatNestedTreeNode extends CdkNestedTreeNode {
  node;
  get disabled() {
    return this.isDisabled;
  }
  set disabled(value) {
    this.isDisabled = value;
  }
  get tabIndex() {
    return this.isDisabled ? -1 : this._tabIndex;
  }
  set tabIndex(value) {
    this._tabIndex = value;
  }
  _tabIndex;
  ngOnInit() {
    super.ngOnInit();
  }
  ngAfterContentInit() {
    super.ngAfterContentInit();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatNestedTreeNode,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "16.1.0",
    version: "21.0.0",
    type: MatNestedTreeNode,
    isStandalone: true,
    selector: "mat-nested-tree-node",
    inputs: {
      node: ["matNestedTreeNode", "node"],
      disabled: ["disabled", "disabled", booleanAttribute],
      tabIndex: ["tabIndex", "tabIndex", value => value == null ? 0 : numberAttribute(value)]
    },
    outputs: {
      activation: "activation",
      expandedChange: "expandedChange"
    },
    host: {
      classAttribute: "mat-nested-tree-node"
    },
    providers: [{
      provide: CdkNestedTreeNode,
      useExisting: MatNestedTreeNode
    }, {
      provide: CdkTreeNode,
      useExisting: MatNestedTreeNode
    }, {
      provide: CDK_TREE_NODE_OUTLET_NODE,
      useExisting: MatNestedTreeNode
    }],
    exportAs: ["matNestedTreeNode"],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatNestedTreeNode,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'mat-nested-tree-node',
      exportAs: 'matNestedTreeNode',
      outputs: ['activation', 'expandedChange'],
      providers: [{
        provide: CdkNestedTreeNode,
        useExisting: MatNestedTreeNode
      }, {
        provide: CdkTreeNode,
        useExisting: MatNestedTreeNode
      }, {
        provide: CDK_TREE_NODE_OUTLET_NODE,
        useExisting: MatNestedTreeNode
      }],
      host: {
        'class': 'mat-nested-tree-node'
      }
    }]
  }],
  propDecorators: {
    node: [{
      type: Input,
      args: ['matNestedTreeNode']
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    tabIndex: [{
      type: Input,
      args: [{
        transform: value => value == null ? 0 : numberAttribute(value)
      }]
    }]
  }
});

class MatTreeNodePadding extends CdkTreeNodePadding {
  get level() {
    return this._level;
  }
  set level(value) {
    this._setLevelInput(value);
  }
  get indent() {
    return this._indent;
  }
  set indent(indent) {
    this._setIndentInput(indent);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatTreeNodePadding,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "16.1.0",
    version: "21.0.0",
    type: MatTreeNodePadding,
    isStandalone: true,
    selector: "[matTreeNodePadding]",
    inputs: {
      level: ["matTreeNodePadding", "level", numberAttribute],
      indent: ["matTreeNodePaddingIndent", "indent"]
    },
    providers: [{
      provide: CdkTreeNodePadding,
      useExisting: MatTreeNodePadding
    }],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatTreeNodePadding,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matTreeNodePadding]',
      providers: [{
        provide: CdkTreeNodePadding,
        useExisting: MatTreeNodePadding
      }]
    }]
  }],
  propDecorators: {
    level: [{
      type: Input,
      args: [{
        alias: 'matTreeNodePadding',
        transform: numberAttribute
      }]
    }],
    indent: [{
      type: Input,
      args: ['matTreeNodePaddingIndent']
    }]
  }
});

class MatTreeNodeOutlet {
  viewContainer = inject(ViewContainerRef);
  _node = inject(CDK_TREE_NODE_OUTLET_NODE, {
    optional: true
  });
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatTreeNodeOutlet,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0",
    type: MatTreeNodeOutlet,
    isStandalone: true,
    selector: "[matTreeNodeOutlet]",
    providers: [{
      provide: CdkTreeNodeOutlet,
      useExisting: MatTreeNodeOutlet
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatTreeNodeOutlet,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matTreeNodeOutlet]',
      providers: [{
        provide: CdkTreeNodeOutlet,
        useExisting: MatTreeNodeOutlet
      }]
    }]
  }]
});

class MatTree extends CdkTree {
  _nodeOutlet = undefined;
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatTree,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.0",
    type: MatTree,
    isStandalone: true,
    selector: "mat-tree",
    host: {
      classAttribute: "mat-tree"
    },
    providers: [{
      provide: CdkTree,
      useExisting: MatTree
    }],
    viewQueries: [{
      propertyName: "_nodeOutlet",
      first: true,
      predicate: MatTreeNodeOutlet,
      descendants: true,
      static: true
    }],
    exportAs: ["matTree"],
    usesInheritance: true,
    ngImport: i0,
    template: `<ng-container matTreeNodeOutlet></ng-container>`,
    isInline: true,
    styles: [".mat-tree{display:block;background-color:var(--mat-tree-container-background-color, var(--mat-sys-surface))}.mat-tree-node,.mat-nested-tree-node{color:var(--mat-tree-node-text-color, var(--mat-sys-on-surface));font-family:var(--mat-tree-node-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-tree-node-text-size, var(--mat-sys-body-large-size));font-weight:var(--mat-tree-node-text-weight, var(--mat-sys-body-large-weight))}.mat-tree-node{display:flex;align-items:center;flex:1;word-wrap:break-word;min-height:var(--mat-tree-node-min-height, 48px)}.mat-nested-tree-node{border-bottom-width:0}\n"],
    dependencies: [{
      kind: "directive",
      type: MatTreeNodeOutlet,
      selector: "[matTreeNodeOutlet]"
    }],
    changeDetection: i0.ChangeDetectionStrategy.Default,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatTree,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-tree',
      exportAs: 'matTree',
      template: `<ng-container matTreeNodeOutlet></ng-container>`,
      host: {
        'class': 'mat-tree'
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.Default,
      providers: [{
        provide: CdkTree,
        useExisting: MatTree
      }],
      imports: [MatTreeNodeOutlet],
      styles: [".mat-tree{display:block;background-color:var(--mat-tree-container-background-color, var(--mat-sys-surface))}.mat-tree-node,.mat-nested-tree-node{color:var(--mat-tree-node-text-color, var(--mat-sys-on-surface));font-family:var(--mat-tree-node-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-tree-node-text-size, var(--mat-sys-body-large-size));font-weight:var(--mat-tree-node-text-weight, var(--mat-sys-body-large-weight))}.mat-tree-node{display:flex;align-items:center;flex:1;word-wrap:break-word;min-height:var(--mat-tree-node-min-height, 48px)}.mat-nested-tree-node{border-bottom-width:0}\n"]
    }]
  }],
  propDecorators: {
    _nodeOutlet: [{
      type: ViewChild,
      args: [MatTreeNodeOutlet, {
        static: true
      }]
    }]
  }
});

class MatTreeNodeToggle extends CdkTreeNodeToggle {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatTreeNodeToggle,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.0",
    type: MatTreeNodeToggle,
    isStandalone: true,
    selector: "[matTreeNodeToggle]",
    inputs: {
      recursive: ["matTreeNodeToggleRecursive", "recursive"]
    },
    providers: [{
      provide: CdkTreeNodeToggle,
      useExisting: MatTreeNodeToggle
    }],
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatTreeNodeToggle,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matTreeNodeToggle]',
      providers: [{
        provide: CdkTreeNodeToggle,
        useExisting: MatTreeNodeToggle
      }],
      inputs: [{
        name: 'recursive',
        alias: 'matTreeNodeToggleRecursive'
      }]
    }]
  }]
});

const MAT_TREE_DIRECTIVES = [MatNestedTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle, MatTree, MatTreeNode, MatTreeNodeOutlet];
class MatTreeModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatTreeModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatTreeModule,
    imports: [CdkTreeModule, MatNestedTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle, MatTree, MatTreeNode, MatTreeNodeOutlet],
    exports: [BidiModule, MatNestedTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle, MatTree, MatTreeNode, MatTreeNodeOutlet]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.0",
    ngImport: i0,
    type: MatTreeModule,
    imports: [CdkTreeModule, BidiModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.0",
  ngImport: i0,
  type: MatTreeModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [CdkTreeModule, ...MAT_TREE_DIRECTIVES],
      exports: [BidiModule, MAT_TREE_DIRECTIVES]
    }]
  }]
});

class MatTreeFlattener {
  transformFunction;
  getLevel;
  isExpandable;
  getChildren;
  constructor(transformFunction, getLevel, isExpandable, getChildren) {
    this.transformFunction = transformFunction;
    this.getLevel = getLevel;
    this.isExpandable = isExpandable;
    this.getChildren = getChildren;
  }
  _flattenNode(node, level, resultNodes, parentMap) {
    const flatNode = this.transformFunction(node, level);
    resultNodes.push(flatNode);
    if (this.isExpandable(flatNode)) {
      const childrenNodes = this.getChildren(node);
      if (childrenNodes) {
        if (Array.isArray(childrenNodes)) {
          this._flattenChildren(childrenNodes, level, resultNodes, parentMap);
        } else {
          childrenNodes.pipe(take(1)).subscribe(children => {
            this._flattenChildren(children, level, resultNodes, parentMap);
          });
        }
      }
    }
    return resultNodes;
  }
  _flattenChildren(children, level, resultNodes, parentMap) {
    children.forEach((child, index) => {
      let childParentMap = parentMap.slice();
      childParentMap.push(index != children.length - 1);
      this._flattenNode(child, level + 1, resultNodes, childParentMap);
    });
  }
  flattenNodes(structuredData) {
    let resultNodes = [];
    structuredData.forEach(node => this._flattenNode(node, 0, resultNodes, []));
    return resultNodes;
  }
  expandFlattenedNodes(nodes, treeControl) {
    let results = [];
    let currentExpand = [];
    currentExpand[0] = true;
    nodes.forEach(node => {
      let expand = true;
      for (let i = 0; i <= this.getLevel(node); i++) {
        expand = expand && currentExpand[i];
      }
      if (expand) {
        results.push(node);
      }
      if (this.isExpandable(node)) {
        currentExpand[this.getLevel(node) + 1] = treeControl.isExpanded(node);
      }
    });
    return results;
  }
}
class MatTreeFlatDataSource extends DataSource {
  _treeControl;
  _treeFlattener;
  _flattenedData = new BehaviorSubject([]);
  _expandedData = new BehaviorSubject([]);
  get data() {
    return this._data.value;
  }
  set data(value) {
    this._data.next(value);
    this._flattenedData.next(this._treeFlattener.flattenNodes(this.data));
    this._treeControl.dataNodes = this._flattenedData.value;
  }
  _data = new BehaviorSubject([]);
  constructor(_treeControl, _treeFlattener, initialData) {
    super();
    this._treeControl = _treeControl;
    this._treeFlattener = _treeFlattener;
    if (initialData) {
      this.data = initialData;
    }
  }
  connect(collectionViewer) {
    return merge(collectionViewer.viewChange, this._treeControl.expansionModel.changed, this._flattenedData).pipe(map(() => {
      this._expandedData.next(this._treeFlattener.expandFlattenedNodes(this._flattenedData.value, this._treeControl));
      return this._expandedData.value;
    }));
  }
  disconnect() {}
}

class MatTreeNestedDataSource extends DataSource {
  get data() {
    return this._data.value;
  }
  set data(value) {
    this._data.next(value);
  }
  _data = new BehaviorSubject([]);
  connect(collectionViewer) {
    return merge(...[collectionViewer.viewChange, this._data]).pipe(map(() => this.data));
  }
  disconnect() {}
}

export { MatNestedTreeNode, MatTree, MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule, MatTreeNestedDataSource, MatTreeNode, MatTreeNodeDef, MatTreeNodeOutlet, MatTreeNodePadding, MatTreeNodeToggle };
//# sourceMappingURL=tree.mjs.map

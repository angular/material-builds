"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscClassInheritanceMigration = void 0;
const schematics_1 = require("@angular/cdk/schematics");
const ts = require("typescript");
/**
 * Migration that checks for classes that extend Angular Material classes which
 * have changed their API.
 */
class MiscClassInheritanceMigration extends schematics_1.Migration {
    constructor() {
        super(...arguments);
        // Only enable this rule if the migration targets version 6. The rule
        // currently only includes migrations for V6 deprecations.
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
    }
    visitNode(node) {
        if (ts.isClassDeclaration(node)) {
            this._visitClassDeclaration(node);
        }
    }
    _visitClassDeclaration(node) {
        const baseTypes = (0, schematics_1.determineBaseTypes)(node);
        const className = node.name ? node.name.text : '{unknown-name}';
        if (!baseTypes) {
            return;
        }
        // Migration for: https://github.com/angular/components/pull/10293 (v6)
        if (baseTypes.includes('MatFormFieldControl')) {
            const hasFloatLabelMember = node.members.filter(member => member.name)
                .find(member => member.name.getText() === 'shouldLabelFloat');
            if (!hasFloatLabelMember) {
                this.createFailureAtNode(node, `Found class "${className}" which extends ` +
                    `"${'MatFormFieldControl'}". This class must define ` +
                    `"${'shouldLabelFloat'}" which is now a required property.`);
            }
        }
    }
}
exports.MiscClassInheritanceMigration = MiscClassInheritanceMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1jbGFzcy1pbmhlcml0YW5jZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL21pc2MtY2hlY2tzL21pc2MtY2xhc3MtaW5oZXJpdGFuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsd0RBQXFGO0FBQ3JGLGlDQUFpQztBQUVqQzs7O0dBR0c7QUFDSCxNQUFhLDZCQUE4QixTQUFRLHNCQUFlO0lBQWxFOztRQUVFLHFFQUFxRTtRQUNyRSwwREFBMEQ7UUFDMUQsWUFBTyxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxFQUFFLENBQUM7SUErQnBELENBQUM7SUE3QlUsU0FBUyxDQUFDLElBQWE7UUFDOUIsSUFBSSxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDL0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVPLHNCQUFzQixDQUFDLElBQXlCO1FBQ3RELE1BQU0sU0FBUyxHQUFHLElBQUEsK0JBQWtCLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO1FBRWhFLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZCxPQUFPO1NBQ1I7UUFFRCx1RUFBdUU7UUFDdkUsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEVBQUU7WUFDN0MsTUFBTSxtQkFBbUIsR0FDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2lCQUNyQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLGtCQUFrQixDQUFDLENBQUM7WUFFdkUsSUFBSSxDQUFDLG1CQUFtQixFQUFFO2dCQUN4QixJQUFJLENBQUMsbUJBQW1CLENBQ3BCLElBQUksRUFDSixnQkFBZ0IsU0FBUyxrQkFBa0I7b0JBQ3ZDLElBQUkscUJBQXFCLDRCQUE0QjtvQkFDckQsSUFBSSxrQkFBa0IscUNBQXFDLENBQUMsQ0FBQzthQUN0RTtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBbkNELHNFQW1DQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge2RldGVybWluZUJhc2VUeXBlcywgTWlncmF0aW9uLCBUYXJnZXRWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBNaWdyYXRpb24gdGhhdCBjaGVja3MgZm9yIGNsYXNzZXMgdGhhdCBleHRlbmQgQW5ndWxhciBNYXRlcmlhbCBjbGFzc2VzIHdoaWNoXG4gKiBoYXZlIGNoYW5nZWQgdGhlaXIgQVBJLlxuICovXG5leHBvcnQgY2xhc3MgTWlzY0NsYXNzSW5oZXJpdGFuY2VNaWdyYXRpb24gZXh0ZW5kcyBNaWdyYXRpb248bnVsbD4ge1xuXG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdmVyc2lvbiA2LiBUaGUgcnVsZVxuICAvLyBjdXJyZW50bHkgb25seSBpbmNsdWRlcyBtaWdyYXRpb25zIGZvciBWNiBkZXByZWNhdGlvbnMuXG4gIGVuYWJsZWQgPSB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjY7XG5cbiAgb3ZlcnJpZGUgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAodHMuaXNDbGFzc0RlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICB0aGlzLl92aXNpdENsYXNzRGVjbGFyYXRpb24obm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRDbGFzc0RlY2xhcmF0aW9uKG5vZGU6IHRzLkNsYXNzRGVjbGFyYXRpb24pIHtcbiAgICBjb25zdCBiYXNlVHlwZXMgPSBkZXRlcm1pbmVCYXNlVHlwZXMobm9kZSk7XG4gICAgY29uc3QgY2xhc3NOYW1lID0gbm9kZS5uYW1lID8gbm9kZS5uYW1lLnRleHQgOiAne3Vua25vd24tbmFtZX0nO1xuXG4gICAgaWYgKCFiYXNlVHlwZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBNaWdyYXRpb24gZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAyOTMgKHY2KVxuICAgIGlmIChiYXNlVHlwZXMuaW5jbHVkZXMoJ01hdEZvcm1GaWVsZENvbnRyb2wnKSkge1xuICAgICAgY29uc3QgaGFzRmxvYXRMYWJlbE1lbWJlciA9XG4gICAgICAgICAgbm9kZS5tZW1iZXJzLmZpbHRlcihtZW1iZXIgPT4gbWVtYmVyLm5hbWUpXG4gICAgICAgICAgICAgIC5maW5kKG1lbWJlciA9PiBtZW1iZXIubmFtZSEuZ2V0VGV4dCgpID09PSAnc2hvdWxkTGFiZWxGbG9hdCcpO1xuXG4gICAgICBpZiAoIWhhc0Zsb2F0TGFiZWxNZW1iZXIpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIGBGb3VuZCBjbGFzcyBcIiR7Y2xhc3NOYW1lfVwiIHdoaWNoIGV4dGVuZHMgYCArXG4gICAgICAgICAgICAgICAgYFwiJHsnTWF0Rm9ybUZpZWxkQ29udHJvbCd9XCIuIFRoaXMgY2xhc3MgbXVzdCBkZWZpbmUgYCArXG4gICAgICAgICAgICAgICAgYFwiJHsnc2hvdWxkTGFiZWxGbG9hdCd9XCIgd2hpY2ggaXMgbm93IGEgcmVxdWlyZWQgcHJvcGVydHkuYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=
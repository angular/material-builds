/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/material/schematics/ng-update/upgrade-rules/misc-checks/misc-property-names-rule", ["require", "exports", "@angular/cdk/schematics", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const ts = require("typescript");
    /**
     * Rule that walks through every property access expression and and reports a failure if
     * a given property name no longer exists but cannot be automatically migrated.
     */
    class MiscPropertyNamesRule extends schematics_1.MigrationRule {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets version 6. The rule
            // currently only includes migrations for V6 deprecations.
            this.ruleEnabled = this.targetVersion === schematics_1.TargetVersion.V6;
        }
        visitNode(node) {
            if (ts.isPropertyAccessExpression(node)) {
                this._visitPropertyAccessExpression(node);
            }
        }
        _visitPropertyAccessExpression(node) {
            const hostType = this.typeChecker.getTypeAtLocation(node.expression);
            const typeName = hostType && hostType.symbol && hostType.symbol.getName();
            // Migration for: https://github.com/angular/components/pull/10398 (v6)
            if (typeName === 'MatListOption' && node.name.text === 'selectionChange') {
                this.createFailureAtNode(node, `Found deprecated property "selectionChange" of ` +
                    `class "MatListOption". Use the "selectionChange" property on the ` +
                    `parent "MatSelectionList" instead.`);
            }
            // Migration for: https://github.com/angular/components/pull/10413 (v6)
            if (typeName === 'MatDatepicker' && node.name.text === 'selectedChanged') {
                this.createFailureAtNode(node, `Found deprecated property "selectedChanged" of ` +
                    `class "MatDatepicker". Use the "dateChange" or "dateInput" methods ` +
                    `on "MatDatepickerInput" instead.`);
            }
        }
    }
    exports.MiscPropertyNamesRule = MiscPropertyNamesRule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1wcm9wZXJ0eS1uYW1lcy1ydWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL3VwZ3JhZGUtcnVsZXMvbWlzYy1jaGVja3MvbWlzYy1wcm9wZXJ0eS1uYW1lcy1ydWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsd0RBQXFFO0lBQ3JFLGlDQUFpQztJQUVqQzs7O09BR0c7SUFDSCxNQUFhLHFCQUFzQixTQUFRLDBCQUFtQjtRQUE5RDs7WUFFRSxxRUFBcUU7WUFDckUsMERBQTBEO1lBQzFELGdCQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsQ0FBQztRQThCeEQsQ0FBQztRQTVCQyxTQUFTLENBQUMsSUFBYTtZQUNyQixJQUFJLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdkMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzNDO1FBQ0gsQ0FBQztRQUVPLDhCQUE4QixDQUFDLElBQWlDO1lBQ3RFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sUUFBUSxHQUFHLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFMUUsdUVBQXVFO1lBQ3ZFLElBQUksUUFBUSxLQUFLLGVBQWUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxpQkFBaUIsRUFBRTtnQkFDeEUsSUFBSSxDQUFDLG1CQUFtQixDQUNwQixJQUFJLEVBQ0osaURBQWlEO29CQUM3QyxtRUFBbUU7b0JBQ25FLG9DQUFvQyxDQUFDLENBQUM7YUFDL0M7WUFFRCx1RUFBdUU7WUFDdkUsSUFBSSxRQUFRLEtBQUssZUFBZSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGlCQUFpQixFQUFFO2dCQUN4RSxJQUFJLENBQUMsbUJBQW1CLENBQ3BCLElBQUksRUFDSixpREFBaUQ7b0JBQzdDLHFFQUFxRTtvQkFDckUsa0NBQWtDLENBQUMsQ0FBQzthQUM3QztRQUNILENBQUM7S0FDRjtJQWxDRCxzREFrQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNaWdyYXRpb25SdWxlLCBUYXJnZXRWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBSdWxlIHRoYXQgd2Fsa3MgdGhyb3VnaCBldmVyeSBwcm9wZXJ0eSBhY2Nlc3MgZXhwcmVzc2lvbiBhbmQgYW5kIHJlcG9ydHMgYSBmYWlsdXJlIGlmXG4gKiBhIGdpdmVuIHByb3BlcnR5IG5hbWUgbm8gbG9uZ2VyIGV4aXN0cyBidXQgY2Fubm90IGJlIGF1dG9tYXRpY2FsbHkgbWlncmF0ZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBNaXNjUHJvcGVydHlOYW1lc1J1bGUgZXh0ZW5kcyBNaWdyYXRpb25SdWxlPG51bGw+IHtcblxuICAvLyBPbmx5IGVuYWJsZSB0aGlzIHJ1bGUgaWYgdGhlIG1pZ3JhdGlvbiB0YXJnZXRzIHZlcnNpb24gNi4gVGhlIHJ1bGVcbiAgLy8gY3VycmVudGx5IG9ubHkgaW5jbHVkZXMgbWlncmF0aW9ucyBmb3IgVjYgZGVwcmVjYXRpb25zLlxuICBydWxlRW5hYmxlZCA9IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WNjtcblxuICB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIGlmICh0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgdGhpcy5fdmlzaXRQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdmlzaXRQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZTogdHMuUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKSB7XG4gICAgY29uc3QgaG9zdFR5cGUgPSB0aGlzLnR5cGVDaGVja2VyLmdldFR5cGVBdExvY2F0aW9uKG5vZGUuZXhwcmVzc2lvbik7XG4gICAgY29uc3QgdHlwZU5hbWUgPSBob3N0VHlwZSAmJiBob3N0VHlwZS5zeW1ib2wgJiYgaG9zdFR5cGUuc3ltYm9sLmdldE5hbWUoKTtcblxuICAgIC8vIE1pZ3JhdGlvbiBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDM5OCAodjYpXG4gICAgaWYgKHR5cGVOYW1lID09PSAnTWF0TGlzdE9wdGlvbicgJiYgbm9kZS5uYW1lLnRleHQgPT09ICdzZWxlY3Rpb25DaGFuZ2UnKSB7XG4gICAgICB0aGlzLmNyZWF0ZUZhaWx1cmVBdE5vZGUoXG4gICAgICAgICAgbm9kZSxcbiAgICAgICAgICBgRm91bmQgZGVwcmVjYXRlZCBwcm9wZXJ0eSBcInNlbGVjdGlvbkNoYW5nZVwiIG9mIGAgK1xuICAgICAgICAgICAgICBgY2xhc3MgXCJNYXRMaXN0T3B0aW9uXCIuIFVzZSB0aGUgXCJzZWxlY3Rpb25DaGFuZ2VcIiBwcm9wZXJ0eSBvbiB0aGUgYCArXG4gICAgICAgICAgICAgIGBwYXJlbnQgXCJNYXRTZWxlY3Rpb25MaXN0XCIgaW5zdGVhZC5gKTtcbiAgICB9XG5cbiAgICAvLyBNaWdyYXRpb24gZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTA0MTMgKHY2KVxuICAgIGlmICh0eXBlTmFtZSA9PT0gJ01hdERhdGVwaWNrZXInICYmIG5vZGUubmFtZS50ZXh0ID09PSAnc2VsZWN0ZWRDaGFuZ2VkJykge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgYEZvdW5kIGRlcHJlY2F0ZWQgcHJvcGVydHkgXCJzZWxlY3RlZENoYW5nZWRcIiBvZiBgICtcbiAgICAgICAgICAgICAgYGNsYXNzIFwiTWF0RGF0ZXBpY2tlclwiLiBVc2UgdGhlIFwiZGF0ZUNoYW5nZVwiIG9yIFwiZGF0ZUlucHV0XCIgbWV0aG9kcyBgICtcbiAgICAgICAgICAgICAgYG9uIFwiTWF0RGF0ZXBpY2tlcklucHV0XCIgaW5zdGVhZC5gKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
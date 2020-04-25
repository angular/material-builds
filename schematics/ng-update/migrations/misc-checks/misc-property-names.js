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
        define("@angular/material/schematics/ng-update/migrations/misc-checks/misc-property-names", ["require", "exports", "@angular/cdk/schematics", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const ts = require("typescript");
    /**
     * Migration that walks through every property access expression and and reports a failure if
     * a given property name no longer exists but cannot be automatically migrated.
     */
    class MiscPropertyNamesMigration extends schematics_1.Migration {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets version 6. The rule
            // currently only includes migrations for V6 deprecations.
            this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
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
    exports.MiscPropertyNamesMigration = MiscPropertyNamesMigration;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1wcm9wZXJ0eS1uYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS9taWdyYXRpb25zL21pc2MtY2hlY2tzL21pc2MtcHJvcGVydHktbmFtZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCx3REFBaUU7SUFDakUsaUNBQWlDO0lBRWpDOzs7T0FHRztJQUNILE1BQWEsMEJBQTJCLFNBQVEsc0JBQWU7UUFBL0Q7O1lBRUUscUVBQXFFO1lBQ3JFLDBEQUEwRDtZQUMxRCxZQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsQ0FBQztRQThCcEQsQ0FBQztRQTVCQyxTQUFTLENBQUMsSUFBYTtZQUNyQixJQUFJLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdkMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzNDO1FBQ0gsQ0FBQztRQUVPLDhCQUE4QixDQUFDLElBQWlDO1lBQ3RFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sUUFBUSxHQUFHLFFBQVEsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFMUUsdUVBQXVFO1lBQ3ZFLElBQUksUUFBUSxLQUFLLGVBQWUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxpQkFBaUIsRUFBRTtnQkFDeEUsSUFBSSxDQUFDLG1CQUFtQixDQUNwQixJQUFJLEVBQ0osaURBQWlEO29CQUM3QyxtRUFBbUU7b0JBQ25FLG9DQUFvQyxDQUFDLENBQUM7YUFDL0M7WUFFRCx1RUFBdUU7WUFDdkUsSUFBSSxRQUFRLEtBQUssZUFBZSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLGlCQUFpQixFQUFFO2dCQUN4RSxJQUFJLENBQUMsbUJBQW1CLENBQ3BCLElBQUksRUFDSixpREFBaUQ7b0JBQzdDLHFFQUFxRTtvQkFDckUsa0NBQWtDLENBQUMsQ0FBQzthQUM3QztRQUNILENBQUM7S0FDRjtJQWxDRCxnRUFrQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNaWdyYXRpb24sIFRhcmdldFZlcnNpb259IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuXG4vKipcbiAqIE1pZ3JhdGlvbiB0aGF0IHdhbGtzIHRocm91Z2ggZXZlcnkgcHJvcGVydHkgYWNjZXNzIGV4cHJlc3Npb24gYW5kIGFuZCByZXBvcnRzIGEgZmFpbHVyZSBpZlxuICogYSBnaXZlbiBwcm9wZXJ0eSBuYW1lIG5vIGxvbmdlciBleGlzdHMgYnV0IGNhbm5vdCBiZSBhdXRvbWF0aWNhbGx5IG1pZ3JhdGVkLlxuICovXG5leHBvcnQgY2xhc3MgTWlzY1Byb3BlcnR5TmFtZXNNaWdyYXRpb24gZXh0ZW5kcyBNaWdyYXRpb248bnVsbD4ge1xuXG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdmVyc2lvbiA2LiBUaGUgcnVsZVxuICAvLyBjdXJyZW50bHkgb25seSBpbmNsdWRlcyBtaWdyYXRpb25zIGZvciBWNiBkZXByZWNhdGlvbnMuXG4gIGVuYWJsZWQgPSB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjY7XG5cbiAgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAodHMuaXNQcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHRoaXMuX3Zpc2l0UHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3Zpc2l0UHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKG5vZGU6IHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbikge1xuICAgIGNvbnN0IGhvc3RUeXBlID0gdGhpcy50eXBlQ2hlY2tlci5nZXRUeXBlQXRMb2NhdGlvbihub2RlLmV4cHJlc3Npb24pO1xuICAgIGNvbnN0IHR5cGVOYW1lID0gaG9zdFR5cGUgJiYgaG9zdFR5cGUuc3ltYm9sICYmIGhvc3RUeXBlLnN5bWJvbC5nZXROYW1lKCk7XG5cbiAgICAvLyBNaWdyYXRpb24gZm9yOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL3B1bGwvMTAzOTggKHY2KVxuICAgIGlmICh0eXBlTmFtZSA9PT0gJ01hdExpc3RPcHRpb24nICYmIG5vZGUubmFtZS50ZXh0ID09PSAnc2VsZWN0aW9uQ2hhbmdlJykge1xuICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgYEZvdW5kIGRlcHJlY2F0ZWQgcHJvcGVydHkgXCJzZWxlY3Rpb25DaGFuZ2VcIiBvZiBgICtcbiAgICAgICAgICAgICAgYGNsYXNzIFwiTWF0TGlzdE9wdGlvblwiLiBVc2UgdGhlIFwic2VsZWN0aW9uQ2hhbmdlXCIgcHJvcGVydHkgb24gdGhlIGAgK1xuICAgICAgICAgICAgICBgcGFyZW50IFwiTWF0U2VsZWN0aW9uTGlzdFwiIGluc3RlYWQuYCk7XG4gICAgfVxuXG4gICAgLy8gTWlncmF0aW9uIGZvcjogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9wdWxsLzEwNDEzICh2NilcbiAgICBpZiAodHlwZU5hbWUgPT09ICdNYXREYXRlcGlja2VyJyAmJiBub2RlLm5hbWUudGV4dCA9PT0gJ3NlbGVjdGVkQ2hhbmdlZCcpIHtcbiAgICAgIHRoaXMuY3JlYXRlRmFpbHVyZUF0Tm9kZShcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGBGb3VuZCBkZXByZWNhdGVkIHByb3BlcnR5IFwic2VsZWN0ZWRDaGFuZ2VkXCIgb2YgYCArXG4gICAgICAgICAgICAgIGBjbGFzcyBcIk1hdERhdGVwaWNrZXJcIi4gVXNlIHRoZSBcImRhdGVDaGFuZ2VcIiBvciBcImRhdGVJbnB1dFwiIG1ldGhvZHMgYCArXG4gICAgICAgICAgICAgIGBvbiBcIk1hdERhdGVwaWNrZXJJbnB1dFwiIGluc3RlYWQuYCk7XG4gICAgfVxuICB9XG59XG4iXX0=
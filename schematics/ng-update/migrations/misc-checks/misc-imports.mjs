"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiscImportsMigration = void 0;
const schematics_1 = require("@angular/cdk/schematics");
const ts = require("typescript");
/**
 * Migration that detects import declarations that refer to outdated identifiers from
 * Angular Material which cannot be updated automatically.
 */
class MiscImportsMigration extends schematics_1.Migration {
    constructor() {
        super(...arguments);
        // Only enable this rule if the migration targets version 6. The rule
        // currently only includes migrations for V6 deprecations.
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V6;
    }
    visitNode(node) {
        if (ts.isImportDeclaration(node)) {
            this._visitImportDeclaration(node);
        }
    }
    _visitImportDeclaration(node) {
        if (!(0, schematics_1.isMaterialImportDeclaration)(node) || !node.importClause ||
            !node.importClause.namedBindings) {
            return;
        }
        const namedBindings = node.importClause.namedBindings;
        if (ts.isNamedImports(namedBindings)) {
            // Migration for: https://github.com/angular/components/pull/10405 (v6)
            this._checkAnimationConstants(namedBindings);
        }
    }
    /**
     * Checks for named imports that refer to the deleted animation constants.
     * https://github.com/angular/components/commit/9f3bf274c4f15f0b0fbd8ab7dbf1a453076e66d9
     */
    _checkAnimationConstants(namedImports) {
        namedImports.elements.filter(element => ts.isIdentifier(element.name)).forEach(element => {
            const importName = element.name.text;
            if (importName === 'SHOW_ANIMATION' || importName === 'HIDE_ANIMATION') {
                this.createFailureAtNode(element, `Found deprecated symbol "${importName}" which has been removed`);
            }
        });
    }
}
exports.MiscImportsMigration = MiscImportsMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlzYy1pbXBvcnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvbWlzYy1jaGVja3MvbWlzYy1pbXBvcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7OztBQUVILHdEQUE4RjtBQUM5RixpQ0FBaUM7QUFFakM7OztHQUdHO0FBQ0gsTUFBYSxvQkFBcUIsU0FBUSxzQkFBZTtJQUF6RDs7UUFFRSxxRUFBcUU7UUFDckUsMERBQTBEO1FBQzFELFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsRUFBRSxDQUFDO0lBb0NwRCxDQUFDO0lBbENVLFNBQVMsQ0FBQyxJQUFhO1FBQzlCLElBQUksRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2hDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7SUFFTyx1QkFBdUIsQ0FBQyxJQUEwQjtRQUN4RCxJQUFJLENBQUMsSUFBQSx3Q0FBMkIsRUFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZO1lBQ3hELENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUU7WUFDcEMsT0FBTztTQUNSO1FBRUQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUM7UUFFdEQsSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQ3BDLHVFQUF1RTtZQUN2RSxJQUFJLENBQUMsd0JBQXdCLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDOUM7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssd0JBQXdCLENBQUMsWUFBNkI7UUFDNUQsWUFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN2RixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUVyQyxJQUFJLFVBQVUsS0FBSyxnQkFBZ0IsSUFBSSxVQUFVLEtBQUssZ0JBQWdCLEVBQUU7Z0JBQ3RFLElBQUksQ0FBQyxtQkFBbUIsQ0FDcEIsT0FBTyxFQUFFLDRCQUE0QixVQUFVLDBCQUEwQixDQUFDLENBQUM7YUFDaEY7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXhDRCxvREF3Q0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtpc01hdGVyaWFsSW1wb3J0RGVjbGFyYXRpb24sIE1pZ3JhdGlvbiwgVGFyZ2V0VmVyc2lvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogTWlncmF0aW9uIHRoYXQgZGV0ZWN0cyBpbXBvcnQgZGVjbGFyYXRpb25zIHRoYXQgcmVmZXIgdG8gb3V0ZGF0ZWQgaWRlbnRpZmllcnMgZnJvbVxuICogQW5ndWxhciBNYXRlcmlhbCB3aGljaCBjYW5ub3QgYmUgdXBkYXRlZCBhdXRvbWF0aWNhbGx5LlxuICovXG5leHBvcnQgY2xhc3MgTWlzY0ltcG9ydHNNaWdyYXRpb24gZXh0ZW5kcyBNaWdyYXRpb248bnVsbD4ge1xuXG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdmVyc2lvbiA2LiBUaGUgcnVsZVxuICAvLyBjdXJyZW50bHkgb25seSBpbmNsdWRlcyBtaWdyYXRpb25zIGZvciBWNiBkZXByZWNhdGlvbnMuXG4gIGVuYWJsZWQgPSB0aGlzLnRhcmdldFZlcnNpb24gPT09IFRhcmdldFZlcnNpb24uVjY7XG5cbiAgb3ZlcnJpZGUgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAodHMuaXNJbXBvcnREZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgdGhpcy5fdmlzaXRJbXBvcnREZWNsYXJhdGlvbihub2RlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF92aXNpdEltcG9ydERlY2xhcmF0aW9uKG5vZGU6IHRzLkltcG9ydERlY2xhcmF0aW9uKSB7XG4gICAgaWYgKCFpc01hdGVyaWFsSW1wb3J0RGVjbGFyYXRpb24obm9kZSkgfHwgIW5vZGUuaW1wb3J0Q2xhdXNlIHx8XG4gICAgICAgICFub2RlLmltcG9ydENsYXVzZS5uYW1lZEJpbmRpbmdzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmFtZWRCaW5kaW5ncyA9IG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3M7XG5cbiAgICBpZiAodHMuaXNOYW1lZEltcG9ydHMobmFtZWRCaW5kaW5ncykpIHtcbiAgICAgIC8vIE1pZ3JhdGlvbiBmb3I6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvcHVsbC8xMDQwNSAodjYpXG4gICAgICB0aGlzLl9jaGVja0FuaW1hdGlvbkNvbnN0YW50cyhuYW1lZEJpbmRpbmdzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGZvciBuYW1lZCBpbXBvcnRzIHRoYXQgcmVmZXIgdG8gdGhlIGRlbGV0ZWQgYW5pbWF0aW9uIGNvbnN0YW50cy5cbiAgICogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9jb21taXQvOWYzYmYyNzRjNGYxNWYwYjBmYmQ4YWI3ZGJmMWE0NTMwNzZlNjZkOVxuICAgKi9cbiAgcHJpdmF0ZSBfY2hlY2tBbmltYXRpb25Db25zdGFudHMobmFtZWRJbXBvcnRzOiB0cy5OYW1lZEltcG9ydHMpIHtcbiAgICBuYW1lZEltcG9ydHMuZWxlbWVudHMuZmlsdGVyKGVsZW1lbnQgPT4gdHMuaXNJZGVudGlmaWVyKGVsZW1lbnQubmFtZSkpLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICBjb25zdCBpbXBvcnROYW1lID0gZWxlbWVudC5uYW1lLnRleHQ7XG5cbiAgICAgIGlmIChpbXBvcnROYW1lID09PSAnU0hPV19BTklNQVRJT04nIHx8IGltcG9ydE5hbWUgPT09ICdISURFX0FOSU1BVElPTicpIHtcbiAgICAgICAgdGhpcy5jcmVhdGVGYWlsdXJlQXROb2RlKFxuICAgICAgICAgICAgZWxlbWVudCwgYEZvdW5kIGRlcHJlY2F0ZWQgc3ltYm9sIFwiJHtpbXBvcnROYW1lfVwiIHdoaWNoIGhhcyBiZWVuIHJlbW92ZWRgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19
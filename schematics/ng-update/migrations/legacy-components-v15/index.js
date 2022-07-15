"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegacyComponentsMigration = void 0;
const schematics_1 = require("@angular/cdk/schematics");
const ts = require("typescript");
class LegacyComponentsMigration extends schematics_1.Migration {
    constructor() {
        super(...arguments);
        this.enabled = this.targetVersion === schematics_1.TargetVersion.V15;
    }
    visitNode(node) {
        if (ts.isImportDeclaration(node)) {
            this._handleImportDeclaration(node);
            return;
        }
        if (this._isDestructuredAsyncImport(node)) {
            this._handleDestructuredAsyncImport(node);
            return;
        }
        if (this._isImportCallExpression(node)) {
            this._handleImportExpression(node);
            return;
        }
    }
    /** Handles updating the named bindings of awaited @angular/material import expressions. */
    _handleDestructuredAsyncImport(node) {
        for (let i = 0; i < node.name.elements.length; i++) {
            const n = node.name.elements[i];
            const name = n.propertyName ? n.propertyName : n.name;
            if (ts.isIdentifier(name)) {
                const oldExport = name.escapedText.toString();
                const suffix = oldExport.slice('Mat'.length);
                const newExport = n.propertyName
                    ? `MatLegacy${suffix}`
                    : `MatLegacy${suffix}: Mat${suffix}`;
                this._replaceAt(name, { old: oldExport, new: newExport });
            }
        }
    }
    /** Handles updating the module specifier of @angular/material imports. */
    _handleImportDeclaration(node) {
        const moduleSpecifier = node.moduleSpecifier;
        if (moduleSpecifier.text.startsWith('@angular/material/')) {
            this._replaceAt(node, { old: '@angular/material/', new: '@angular/material/legacy-' });
            if (node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)) {
                this._handleNamedImportBindings(node.importClause.namedBindings);
            }
        }
    }
    /** Handles updating the module specifier of @angular/material import expressions. */
    _handleImportExpression(node) {
        const moduleSpecifier = node.arguments[0];
        if (moduleSpecifier.text.startsWith('@angular/material/')) {
            this._replaceAt(node, { old: '@angular/material/', new: '@angular/material/legacy-' });
        }
    }
    /** Handles updating the named bindings of @angular/material imports. */
    _handleNamedImportBindings(node) {
        for (let i = 0; i < node.elements.length; i++) {
            const n = node.elements[i];
            const name = n.propertyName ? n.propertyName : n.name;
            const oldExport = name.escapedText.toString();
            const suffix = oldExport.slice('Mat'.length);
            const newExport = n.propertyName
                ? `MatLegacy${suffix}`
                : `MatLegacy${suffix} as Mat${suffix}`;
            this._replaceAt(name, { old: oldExport, new: newExport });
        }
    }
    /**
     * Returns true if the given node is a variable declaration assigns
     * the awaited result of an import expression using an object binding.
     */
    _isDestructuredAsyncImport(node) {
        return (ts.isVariableDeclaration(node) &&
            !!node.initializer &&
            ts.isAwaitExpression(node.initializer) &&
            ts.isCallExpression(node.initializer.expression) &&
            ts.SyntaxKind.ImportKeyword === node.initializer.expression.expression.kind &&
            ts.isObjectBindingPattern(node.name));
    }
    /** Gets whether the specified node is an import expression. */
    _isImportCallExpression(node) {
        return (ts.isCallExpression(node) &&
            node.expression.kind === ts.SyntaxKind.ImportKeyword &&
            node.arguments.length === 1 &&
            ts.isStringLiteralLike(node.arguments[0]));
    }
    /** Updates the source file of the given node with the given replacements. */
    _replaceAt(node, str) {
        const filePath = this.fileSystem.resolve(node.getSourceFile().fileName);
        const index = this.fileSystem.read(filePath).indexOf(str.old, node.pos);
        this.fileSystem.edit(filePath).remove(index, str.old.length).insertRight(index, str.new);
    }
}
exports.LegacyComponentsMigration = LegacyComponentsMigration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9sZWdhY3ktY29tcG9uZW50cy12MTUvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7O0FBRUgsd0RBQWlFO0FBQ2pFLGlDQUFpQztBQUVqQyxNQUFhLHlCQUEwQixTQUFRLHNCQUFlO0lBQTlEOztRQUNFLFlBQU8sR0FBRyxJQUFJLENBQUMsYUFBYSxLQUFLLDBCQUFhLENBQUMsR0FBRyxDQUFDO0lBd0dyRCxDQUFDO0lBdEdVLFNBQVMsQ0FBQyxJQUFhO1FBQzlCLElBQUksRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2hDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxPQUFPO1NBQ1I7UUFDRCxJQUFJLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QyxJQUFJLENBQUMsOEJBQThCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsT0FBTztTQUNSO1FBQ0QsSUFBSSxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdEMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25DLE9BQU87U0FDUjtJQUNILENBQUM7SUFFRCwyRkFBMkY7SUFDbkYsOEJBQThCLENBQ3BDLElBQThEO1FBRTlELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEQsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxJ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VUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0YsQ0FBQztDQUNGO0FBekdELDhEQXlHQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01pZ3JhdGlvbiwgVGFyZ2V0VmVyc2lvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmV4cG9ydCBjbGFzcyBMZWdhY3lDb21wb25lbnRzTWlncmF0aW9uIGV4dGVuZHMgTWlncmF0aW9uPG51bGw+IHtcbiAgZW5hYmxlZCA9IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WMTU7XG5cbiAgb3ZlcnJpZGUgdmlzaXROb2RlKG5vZGU6IHRzLk5vZGUpOiB2b2lkIHtcbiAgICBpZiAodHMuaXNJbXBvcnREZWNsYXJhdGlvbihub2RlKSkge1xuICAgICAgdGhpcy5faGFuZGxlSW1wb3J0RGVjbGFyYXRpb24obm9kZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9pc0Rlc3RydWN0dXJlZEFzeW5jSW1wb3J0KG5vZGUpKSB7XG4gICAgICB0aGlzLl9oYW5kbGVEZXN0cnVjdHVyZWRBc3luY0ltcG9ydChub2RlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2lzSW1wb3J0Q2FsbEV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHRoaXMuX2hhbmRsZUltcG9ydEV4cHJlc3Npb24obm9kZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgdXBkYXRpbmcgdGhlIG5hbWVkIGJpbmRpbmdzIG9mIGF3YWl0ZWQgQGFuZ3VsYXIvbWF0ZXJpYWwgaW1wb3J0IGV4cHJlc3Npb25zLiAqL1xuICBwcml2YXRlIF9oYW5kbGVEZXN0cnVjdHVyZWRBc3luY0ltcG9ydChcbiAgICBub2RlOiB0cy5WYXJpYWJsZURlY2xhcmF0aW9uICYge25hbWU6IHRzLk9iamVjdEJpbmRpbmdQYXR0ZXJufSxcbiAgKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2RlLm5hbWUuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG4gPSBub2RlLm5hbWUuZWxlbWVudHNbaV07XG4gICAgICBjb25zdCBuYW1lID0gbi5wcm9wZXJ0eU5hbWUgPyBuLnByb3BlcnR5TmFtZSA6IG4ubmFtZTtcbiAgICAgIGlmICh0cy5pc0lkZW50aWZpZXIobmFtZSkpIHtcbiAgICAgICAgY29uc3Qgb2xkRXhwb3J0ID0gbmFtZS5lc2NhcGVkVGV4dC50b1N0cmluZygpO1xuICAgICAgICBjb25zdCBzdWZmaXggPSBvbGRFeHBvcnQuc2xpY2UoJ01hdCcubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgbmV3RXhwb3J0ID0gbi5wcm9wZXJ0eU5hbWVcbiAgICAgICAgICA/IGBNYXRMZWdhY3kke3N1ZmZpeH1gXG4gICAgICAgICAgOiBgTWF0TGVnYWN5JHtzdWZmaXh9OiBNYXQke3N1ZmZpeH1gO1xuICAgICAgICB0aGlzLl9yZXBsYWNlQXQobmFtZSwge29sZDogb2xkRXhwb3J0LCBuZXc6IG5ld0V4cG9ydH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBIYW5kbGVzIHVwZGF0aW5nIHRoZSBtb2R1bGUgc3BlY2lmaWVyIG9mIEBhbmd1bGFyL21hdGVyaWFsIGltcG9ydHMuICovXG4gIHByaXZhdGUgX2hhbmRsZUltcG9ydERlY2xhcmF0aW9uKG5vZGU6IHRzLkltcG9ydERlY2xhcmF0aW9uKTogdm9pZCB7XG4gICAgY29uc3QgbW9kdWxlU3BlY2lmaWVyID0gbm9kZS5tb2R1bGVTcGVjaWZpZXIgYXMgdHMuU3RyaW5nTGl0ZXJhbDtcbiAgICBpZiAobW9kdWxlU3BlY2lmaWVyLnRleHQuc3RhcnRzV2l0aCgnQGFuZ3VsYXIvbWF0ZXJpYWwvJykpIHtcbiAgICAgIHRoaXMuX3JlcGxhY2VBdChub2RlLCB7b2xkOiAnQGFuZ3VsYXIvbWF0ZXJpYWwvJywgbmV3OiAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGVnYWN5LSd9KTtcblxuICAgICAgaWYgKG5vZGUuaW1wb3J0Q2xhdXNlPy5uYW1lZEJpbmRpbmdzICYmIHRzLmlzTmFtZWRJbXBvcnRzKG5vZGUuaW1wb3J0Q2xhdXNlLm5hbWVkQmluZGluZ3MpKSB7XG4gICAgICAgIHRoaXMuX2hhbmRsZU5hbWVkSW1wb3J0QmluZGluZ3Mobm9kZS5pbXBvcnRDbGF1c2UubmFtZWRCaW5kaW5ncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEhhbmRsZXMgdXBkYXRpbmcgdGhlIG1vZHVsZSBzcGVjaWZpZXIgb2YgQGFuZ3VsYXIvbWF0ZXJpYWwgaW1wb3J0IGV4cHJlc3Npb25zLiAqL1xuICBwcml2YXRlIF9oYW5kbGVJbXBvcnRFeHByZXNzaW9uKG5vZGU6IHRzLkNhbGxFeHByZXNzaW9uKTogdm9pZCB7XG4gICAgY29uc3QgbW9kdWxlU3BlY2lmaWVyID0gbm9kZS5hcmd1bWVudHNbMF0gYXMgdHMuU3RyaW5nTGl0ZXJhbDtcbiAgICBpZiAobW9kdWxlU3BlY2lmaWVyLnRleHQuc3RhcnRzV2l0aCgnQGFuZ3VsYXIvbWF0ZXJpYWwvJykpIHtcbiAgICAgIHRoaXMuX3JlcGxhY2VBdChub2RlLCB7b2xkOiAnQGFuZ3VsYXIvbWF0ZXJpYWwvJywgbmV3OiAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGVnYWN5LSd9KTtcbiAgICB9XG4gIH1cblxuICAvKiogSGFuZGxlcyB1cGRhdGluZyB0aGUgbmFtZWQgYmluZGluZ3Mgb2YgQGFuZ3VsYXIvbWF0ZXJpYWwgaW1wb3J0cy4gKi9cbiAgcHJpdmF0ZSBfaGFuZGxlTmFtZWRJbXBvcnRCaW5kaW5ncyhub2RlOiB0cy5OYW1lZEltcG9ydHMpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGUuZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG4gPSBub2RlLmVsZW1lbnRzW2ldO1xuICAgICAgY29uc3QgbmFtZSA9IG4ucHJvcGVydHlOYW1lID8gbi5wcm9wZXJ0eU5hbWUgOiBuLm5hbWU7XG4gICAgICBjb25zdCBvbGRFeHBvcnQgPSBuYW1lLmVzY2FwZWRUZXh0LnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBzdWZmaXggPSBvbGRFeHBvcnQuc2xpY2UoJ01hdCcubGVuZ3RoKTtcbiAgICAgIGNvbnN0IG5ld0V4cG9ydCA9IG4ucHJvcGVydHlOYW1lXG4gICAgICAgID8gYE1hdExlZ2FjeSR7c3VmZml4fWBcbiAgICAgICAgOiBgTWF0TGVnYWN5JHtzdWZmaXh9IGFzIE1hdCR7c3VmZml4fWA7XG4gICAgICB0aGlzLl9yZXBsYWNlQXQobmFtZSwge29sZDogb2xkRXhwb3J0LCBuZXc6IG5ld0V4cG9ydH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIG5vZGUgaXMgYSB2YXJpYWJsZSBkZWNsYXJhdGlvbiBhc3NpZ25zXG4gICAqIHRoZSBhd2FpdGVkIHJlc3VsdCBvZiBhbiBpbXBvcnQgZXhwcmVzc2lvbiB1c2luZyBhbiBvYmplY3QgYmluZGluZy5cbiAgICovXG4gIHByaXZhdGUgX2lzRGVzdHJ1Y3R1cmVkQXN5bmNJbXBvcnQoXG4gICAgbm9kZTogdHMuTm9kZSxcbiAgKTogbm9kZSBpcyB0cy5WYXJpYWJsZURlY2xhcmF0aW9uICYge25hbWU6IHRzLk9iamVjdEJpbmRpbmdQYXR0ZXJufSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRzLmlzVmFyaWFibGVEZWNsYXJhdGlvbihub2RlKSAmJlxuICAgICAgISFub2RlLmluaXRpYWxpemVyICYmXG4gICAgICB0cy5pc0F3YWl0RXhwcmVzc2lvbihub2RlLmluaXRpYWxpemVyKSAmJlxuICAgICAgdHMuaXNDYWxsRXhwcmVzc2lvbihub2RlLmluaXRpYWxpemVyLmV4cHJlc3Npb24pICYmXG4gICAgICB0cy5TeW50YXhLaW5kLkltcG9ydEtleXdvcmQgPT09IG5vZGUuaW5pdGlhbGl6ZXIuZXhwcmVzc2lvbi5leHByZXNzaW9uLmtpbmQgJiZcbiAgICAgIHRzLmlzT2JqZWN0QmluZGluZ1BhdHRlcm4obm9kZS5uYW1lKVxuICAgICk7XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZSBzcGVjaWZpZWQgbm9kZSBpcyBhbiBpbXBvcnQgZXhwcmVzc2lvbi4gKi9cbiAgcHJpdmF0ZSBfaXNJbXBvcnRDYWxsRXhwcmVzc2lvbihcbiAgICBub2RlOiB0cy5Ob2RlLFxuICApOiBub2RlIGlzIHRzLkNhbGxFeHByZXNzaW9uICYge2FyZ3VtZW50czogW3RzLlN0cmluZ0xpdGVyYWxMaWtlXX0ge1xuICAgIHJldHVybiAoXG4gICAgICB0cy5pc0NhbGxFeHByZXNzaW9uKG5vZGUpICYmXG4gICAgICBub2RlLmV4cHJlc3Npb24ua2luZCA9PT0gdHMuU3ludGF4S2luZC5JbXBvcnRLZXl3b3JkICYmXG4gICAgICBub2RlLmFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiZcbiAgICAgIHRzLmlzU3RyaW5nTGl0ZXJhbExpa2Uobm9kZS5hcmd1bWVudHNbMF0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBzb3VyY2UgZmlsZSBvZiB0aGUgZ2l2ZW4gbm9kZSB3aXRoIHRoZSBnaXZlbiByZXBsYWNlbWVudHMuICovXG4gIHByaXZhdGUgX3JlcGxhY2VBdChub2RlOiB0cy5Ob2RlLCBzdHI6IHtvbGQ6IHN0cmluZzsgbmV3OiBzdHJpbmd9KTogdm9pZCB7XG4gICAgY29uc3QgZmlsZVBhdGggPSB0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShub2RlLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZSk7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmZpbGVTeXN0ZW0ucmVhZChmaWxlUGF0aCkhLmluZGV4T2Yoc3RyLm9sZCwgbm9kZS5wb3MpO1xuICAgIHRoaXMuZmlsZVN5c3RlbS5lZGl0KGZpbGVQYXRoKS5yZW1vdmUoaW5kZXgsIHN0ci5vbGQubGVuZ3RoKS5pbnNlcnRSaWdodChpbmRleCwgc3RyLm5ldyk7XG4gIH1cbn1cbiJdfQ==
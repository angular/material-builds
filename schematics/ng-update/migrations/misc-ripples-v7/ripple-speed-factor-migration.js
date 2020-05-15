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
        define("@angular/material/schematics/ng-update/migrations/misc-ripples-v7/ripple-speed-factor-migration", ["require", "exports", "@angular/cdk/schematics", "typescript", "@angular/material/schematics/ng-update/migrations/misc-ripples-v7/ripple-speed-factor"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const ts = require("typescript");
    const ripple_speed_factor_1 = require("@angular/material/schematics/ng-update/migrations/misc-ripples-v7/ripple-speed-factor");
    /** Regular expression that matches [matRippleSpeedFactor]="$NUMBER" in templates. */
    const speedFactorNumberRegex = /\[matRippleSpeedFactor]="(\d+(?:\.\d+)?)"/g;
    /** Regular expression that matches [matRippleSpeedFactor]="$NOT_A_NUMBER" in templates. */
    const speedFactorNotParseable = /\[matRippleSpeedFactor]="(?!\d+(?:\.\d+)?")(.*)"/g;
    /**
     * Note that will be added whenever a speed factor expression has been converted to calculate
     * the according duration. This note should encourage people to clean up their code by switching
     * away from the speed factors to explicit durations.
     */
    const removeNote = `TODO: Cleanup duration calculation.`;
    /**
     * Migration that walks through every property assignment and switches the global `baseSpeedFactor`
     * ripple option to the new global animation config. Also updates every class member assignment
     * that refers to MatRipple#speedFactor.
     */
    class RippleSpeedFactorMigration extends schematics_1.Migration {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets version 7 as the ripple
            // speed factor has been removed in that version.
            this.enabled = this.targetVersion === schematics_1.TargetVersion.V7;
        }
        visitNode(node) {
            if (ts.isBinaryExpression(node)) {
                this._visitBinaryExpression(node);
            }
            else if (ts.isPropertyAssignment(node)) {
                this._visitPropertyAssignment(node);
            }
        }
        visitTemplate(template) {
            let match;
            while ((match = speedFactorNumberRegex.exec(template.content)) !== null) {
                const newEnterDuration = ripple_speed_factor_1.convertSpeedFactorToDuration(parseFloat(match[1]));
                this._replaceText(template.filePath, template.start + match.index, match[0].length, `[matRippleAnimation]="{enterDuration: ${newEnterDuration}}"`);
            }
            while ((match = speedFactorNotParseable.exec(template.content)) !== null) {
                const newDurationExpression = ripple_speed_factor_1.createSpeedFactorConvertExpression(match[1]);
                this._replaceText(template.filePath, template.start + match.index, match[0].length, `[matRippleAnimation]="{enterDuration: (${newDurationExpression})}"`);
            }
        }
        /** Switches binary expressions (e.g. myRipple.speedFactor = 0.5) to the new animation config. */
        _visitBinaryExpression(expression) {
            if (!ts.isPropertyAccessExpression(expression.left)) {
                return;
            }
            // Left side expression consists of target object and property name (e.g. myInstance.val)
            const leftExpression = expression.left;
            const targetTypeNode = this.typeChecker.getTypeAtLocation(leftExpression.expression);
            if (!targetTypeNode.symbol) {
                return;
            }
            const targetTypeName = targetTypeNode.symbol.getName();
            const propertyName = leftExpression.name.getText();
            const filePath = this.fileSystem.resolve(leftExpression.getSourceFile().fileName);
            if (targetTypeName === 'MatRipple' && propertyName === 'speedFactor') {
                if (ts.isNumericLiteral(expression.right)) {
                    const numericValue = parseFloat(expression.right.text);
                    const newEnterDurationValue = ripple_speed_factor_1.convertSpeedFactorToDuration(numericValue);
                    // Replace the `speedFactor` property name with `animation`.
                    this._replaceText(filePath, leftExpression.name.getStart(), leftExpression.name.getWidth(), 'animation');
                    // Replace the value assignment with the new animation config.
                    this._replaceText(filePath, expression.right.getStart(), expression.right.getWidth(), `{enterDuration: ${newEnterDurationValue}}`);
                }
                else {
                    // Handle the right expression differently if the previous speed factor value can't
                    // be resolved statically. In that case, we just create a TypeScript expression that
                    // calculates the explicit duration based on the non-static speed factor expression.
                    const newExpression = ripple_speed_factor_1.createSpeedFactorConvertExpression(expression.right.getText());
                    // Replace the `speedFactor` property name with `animation`.
                    this._replaceText(filePath, leftExpression.name.getStart(), leftExpression.name.getWidth(), 'animation');
                    // Replace the value assignment with the new animation config and remove TODO.
                    this._replaceText(filePath, expression.right.getStart(), expression.right.getWidth(), `/** ${removeNote} */ {enterDuration: ${newExpression}}`);
                }
            }
        }
        /**
         * Switches the global option `baseSpeedFactor` to the new animation config. For this
         * we assume that the `baseSpeedFactor` is not used in combination with individual
         * speed factors.
         */
        _visitPropertyAssignment(assignment) {
            // For switching the `baseSpeedFactor` global option we expect the property assignment
            // to be inside of a normal object literal. Custom ripple global options cannot be
            // witched automatically.
            if (!ts.isObjectLiteralExpression(assignment.parent)) {
                return;
            }
            // The assignment consists of a name (key) and initializer (value).
            if (assignment.name.getText() !== 'baseSpeedFactor') {
                return;
            }
            // We could technically lazily check for the MAT_RIPPLE_GLOBAL_OPTIONS injection token to
            // be present, but it's not right to assume that everyone sets the ripple global options
            // immediately in the provider object (e.g. it can happen that someone just imports the
            // config from a separate file).
            const { initializer, name } = assignment;
            const filePath = this.fileSystem.resolve(assignment.getSourceFile().fileName);
            if (ts.isNumericLiteral(initializer)) {
                const numericValue = parseFloat(initializer.text);
                const newEnterDurationValue = ripple_speed_factor_1.convertSpeedFactorToDuration(numericValue);
                // Replace the `baseSpeedFactor` property name with `animation`.
                this._replaceText(filePath, name.getStart(), name.getWidth(), 'animation');
                // Replace the value assignment initializer with the new animation config.
                this._replaceText(filePath, initializer.getStart(), initializer.getWidth(), `{enterDuration: ${newEnterDurationValue}}`);
            }
            else {
                // Handle the right expression differently if the previous speed factor value can't
                // be resolved statically. In that case, we just create a TypeScript expression that
                // calculates the explicit duration based on the non-static speed factor expression.
                const newExpression = ripple_speed_factor_1.createSpeedFactorConvertExpression(initializer.getText());
                // Replace the `baseSpeedFactor` property name with `animation`.
                this._replaceText(filePath, name.getStart(), name.getWidth(), 'animation');
                // Replace the value assignment with the new animation config and remove TODO.
                this._replaceText(filePath, initializer.getStart(), initializer.getWidth(), `/** ${removeNote} */ {enterDuration: ${newExpression}}`);
            }
        }
        _replaceText(filePath, start, width, newText) {
            const recorder = this.fileSystem.edit(filePath);
            recorder.remove(start, width);
            recorder.insertRight(start, newText);
        }
    }
    exports.RippleSpeedFactorMigration = RippleSpeedFactorMigration;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXNwZWVkLWZhY3Rvci1taWdyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9taXNjLXJpcHBsZXMtdjcvcmlwcGxlLXNwZWVkLWZhY3Rvci1taWdyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCx3REFBa0c7SUFDbEcsaUNBQWlDO0lBQ2pDLCtIQUcrQjtJQUUvQixxRkFBcUY7SUFDckYsTUFBTSxzQkFBc0IsR0FBRyw0Q0FBNEMsQ0FBQztJQUU1RSwyRkFBMkY7SUFDM0YsTUFBTSx1QkFBdUIsR0FBRyxtREFBbUQsQ0FBQztJQUVwRjs7OztPQUlHO0lBQ0gsTUFBTSxVQUFVLEdBQUcscUNBQXFDLENBQUM7SUFFekQ7Ozs7T0FJRztJQUNILE1BQWEsMEJBQTJCLFNBQVEsc0JBQWU7UUFBL0Q7O1lBRUUseUVBQXlFO1lBQ3pFLGlEQUFpRDtZQUNqRCxZQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsQ0FBQztRQXVJcEQsQ0FBQztRQXJJQyxTQUFTLENBQUMsSUFBYTtZQUNyQixJQUFJLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25DO2lCQUFNLElBQUksRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN4QyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDckM7UUFDSCxDQUFDO1FBRUQsYUFBYSxDQUFDLFFBQTBCO1lBQ3RDLElBQUksS0FBNEIsQ0FBQztZQUVqQyxPQUFPLENBQUMsS0FBSyxHQUFHLHNCQUFzQixDQUFDLElBQUksQ0FBQyxRQUFR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aWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge01pZ3JhdGlvbiwgUmVzb2x2ZWRSZXNvdXJjZSwgVGFyZ2V0VmVyc2lvbiwgV29ya3NwYWNlUGF0aH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge1xuICBjb252ZXJ0U3BlZWRGYWN0b3JUb0R1cmF0aW9uLFxuICBjcmVhdGVTcGVlZEZhY3RvckNvbnZlcnRFeHByZXNzaW9uLFxufSBmcm9tICcuL3JpcHBsZS1zcGVlZC1mYWN0b3InO1xuXG4vKiogUmVndWxhciBleHByZXNzaW9uIHRoYXQgbWF0Y2hlcyBbbWF0UmlwcGxlU3BlZWRGYWN0b3JdPVwiJE5VTUJFUlwiIGluIHRlbXBsYXRlcy4gKi9cbmNvbnN0IHNwZWVkRmFjdG9yTnVtYmVyUmVnZXggPSAvXFxbbWF0UmlwcGxlU3BlZWRGYWN0b3JdPVwiKFxcZCsoPzpcXC5cXGQrKT8pXCIvZztcblxuLyoqIFJlZ3VsYXIgZXhwcmVzc2lvbiB0aGF0IG1hdGNoZXMgW21hdFJpcHBsZVNwZWVkRmFjdG9yXT1cIiROT1RfQV9OVU1CRVJcIiBpbiB0ZW1wbGF0ZXMuICovXG5jb25zdCBzcGVlZEZhY3Rvck5vdFBhcnNlYWJsZSA9IC9cXFttYXRSaXBwbGVTcGVlZEZhY3Rvcl09XCIoPyFcXGQrKD86XFwuXFxkKyk/XCIpKC4qKVwiL2c7XG5cbi8qKlxuICogTm90ZSB0aGF0IHdpbGwgYmUgYWRkZWQgd2hlbmV2ZXIgYSBzcGVlZCBmYWN0b3IgZXhwcmVzc2lvbiBoYXMgYmVlbiBjb252ZXJ0ZWQgdG8gY2FsY3VsYXRlXG4gKiB0aGUgYWNjb3JkaW5nIGR1cmF0aW9uLiBUaGlzIG5vdGUgc2hvdWxkIGVuY291cmFnZSBwZW9wbGUgdG8gY2xlYW4gdXAgdGhlaXIgY29kZSBieSBzd2l0Y2hpbmdcbiAqIGF3YXkgZnJvbSB0aGUgc3BlZWQgZmFjdG9ycyB0byBleHBsaWNpdCBkdXJhdGlvbnMuXG4gKi9cbmNvbnN0IHJlbW92ZU5vdGUgPSBgVE9ETzogQ2xlYW51cCBkdXJhdGlvbiBjYWxjdWxhdGlvbi5gO1xuXG4vKipcbiAqIE1pZ3JhdGlvbiB0aGF0IHdhbGtzIHRocm91Z2ggZXZlcnkgcHJvcGVydHkgYXNzaWdubWVudCBhbmQgc3dpdGNoZXMgdGhlIGdsb2JhbCBgYmFzZVNwZWVkRmFjdG9yYFxuICogcmlwcGxlIG9wdGlvbiB0byB0aGUgbmV3IGdsb2JhbCBhbmltYXRpb24gY29uZmlnLiBBbHNvIHVwZGF0ZXMgZXZlcnkgY2xhc3MgbWVtYmVyIGFzc2lnbm1lbnRcbiAqIHRoYXQgcmVmZXJzIHRvIE1hdFJpcHBsZSNzcGVlZEZhY3Rvci5cbiAqL1xuZXhwb3J0IGNsYXNzIFJpcHBsZVNwZWVkRmFjdG9yTWlncmF0aW9uIGV4dGVuZHMgTWlncmF0aW9uPG51bGw+IHtcblxuICAvLyBPbmx5IGVuYWJsZSB0aGlzIHJ1bGUgaWYgdGhlIG1pZ3JhdGlvbiB0YXJnZXRzIHZlcnNpb24gNyBhcyB0aGUgcmlwcGxlXG4gIC8vIHNwZWVkIGZhY3RvciBoYXMgYmVlbiByZW1vdmVkIGluIHRoYXQgdmVyc2lvbi5cbiAgZW5hYmxlZCA9IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WNztcblxuICB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIGlmICh0cy5pc0JpbmFyeUV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihub2RlKTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KG5vZGUpKSB7XG4gICAgICB0aGlzLl92aXNpdFByb3BlcnR5QXNzaWdubWVudChub2RlKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdFRlbXBsYXRlKHRlbXBsYXRlOiBSZXNvbHZlZFJlc291cmNlKTogdm9pZCB7XG4gICAgbGV0IG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5fG51bGw7XG5cbiAgICB3aGlsZSAoKG1hdGNoID0gc3BlZWRGYWN0b3JOdW1iZXJSZWdleC5leGVjKHRlbXBsYXRlLmNvbnRlbnQpKSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgbmV3RW50ZXJEdXJhdGlvbiA9IGNvbnZlcnRTcGVlZEZhY3RvclRvRHVyYXRpb24ocGFyc2VGbG9hdChtYXRjaFsxXSkpO1xuXG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgICB0ZW1wbGF0ZS5maWxlUGF0aCwgdGVtcGxhdGUuc3RhcnQgKyBtYXRjaC5pbmRleCEsIG1hdGNoWzBdLmxlbmd0aCxcbiAgICAgICAgICBgW21hdFJpcHBsZUFuaW1hdGlvbl09XCJ7ZW50ZXJEdXJhdGlvbjogJHtuZXdFbnRlckR1cmF0aW9ufX1cImApO1xuICAgIH1cblxuICAgIHdoaWxlICgobWF0Y2ggPSBzcGVlZEZhY3Rvck5vdFBhcnNlYWJsZS5leGVjKHRlbXBsYXRlLmNvbnRlbnQpKSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgbmV3RHVyYXRpb25FeHByZXNzaW9uID0gY3JlYXRlU3BlZWRGYWN0b3JDb252ZXJ0RXhwcmVzc2lvbihtYXRjaFsxXSk7XG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgICB0ZW1wbGF0ZS5maWxlUGF0aCwgdGVtcGxhdGUuc3RhcnQgKyBtYXRjaC5pbmRleCEsIG1hdGNoWzBdLmxlbmd0aCxcbiAgICAgICAgICBgW21hdFJpcHBsZUFuaW1hdGlvbl09XCJ7ZW50ZXJEdXJhdGlvbjogKCR7bmV3RHVyYXRpb25FeHByZXNzaW9ufSl9XCJgKTtcbiAgICB9XG4gIH1cblxuICAvKiogU3dpdGNoZXMgYmluYXJ5IGV4cHJlc3Npb25zIChlLmcuIG15UmlwcGxlLnNwZWVkRmFjdG9yID0gMC41KSB0byB0aGUgbmV3IGFuaW1hdGlvbiBjb25maWcuICovXG4gIHByaXZhdGUgX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihleHByZXNzaW9uOiB0cy5CaW5hcnlFeHByZXNzaW9uKSB7XG4gICAgaWYgKCF0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihleHByZXNzaW9uLmxlZnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTGVmdCBzaWRlIGV4cHJlc3Npb24gY29uc2lzdHMgb2YgdGFyZ2V0IG9iamVjdCBhbmQgcHJvcGVydHkgbmFtZSAoZS5nLiBteUluc3RhbmNlLnZhbClcbiAgICBjb25zdCBsZWZ0RXhwcmVzc2lvbiA9IGV4cHJlc3Npb24ubGVmdCBhcyB0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb247XG4gICAgY29uc3QgdGFyZ2V0VHlwZU5vZGUgPSB0aGlzLnR5cGVDaGVja2VyLmdldFR5cGVBdExvY2F0aW9uKGxlZnRFeHByZXNzaW9uLmV4cHJlc3Npb24pO1xuXG4gICAgaWYgKCF0YXJnZXRUeXBlTm9kZS5zeW1ib2wpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRUeXBlTmFtZSA9IHRhcmdldFR5cGVOb2RlLnN5bWJvbC5nZXROYW1lKCk7XG4gICAgY29uc3QgcHJvcGVydHlOYW1lID0gbGVmdEV4cHJlc3Npb24ubmFtZS5nZXRUZXh0KCk7XG4gICAgY29uc3QgZmlsZVBhdGggPSB0aGlzLmZpbGVTeXN0ZW0ucmVzb2x2ZShsZWZ0RXhwcmVzc2lvbi5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUpO1xuXG4gICAgaWYgKHRhcmdldFR5cGVOYW1lID09PSAnTWF0UmlwcGxlJyAmJiBwcm9wZXJ0eU5hbWUgPT09ICdzcGVlZEZhY3RvcicpIHtcbiAgICAgIGlmICh0cy5pc051bWVyaWNMaXRlcmFsKGV4cHJlc3Npb24ucmlnaHQpKSB7XG4gICAgICAgIGNvbnN0IG51bWVyaWNWYWx1ZSA9IHBhcnNlRmxvYXQoZXhwcmVzc2lvbi5yaWdodC50ZXh0KTtcbiAgICAgICAgY29uc3QgbmV3RW50ZXJEdXJhdGlvblZhbHVlID0gY29udmVydFNwZWVkRmFjdG9yVG9EdXJhdGlvbihudW1lcmljVmFsdWUpO1xuXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIGBzcGVlZEZhY3RvcmAgcHJvcGVydHkgbmFtZSB3aXRoIGBhbmltYXRpb25gLlxuICAgICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgICAgIGZpbGVQYXRoLCBsZWZ0RXhwcmVzc2lvbi5uYW1lLmdldFN0YXJ0KCksIGxlZnRFeHByZXNzaW9uLm5hbWUuZ2V0V2lkdGgoKSwgJ2FuaW1hdGlvbicpO1xuXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIHZhbHVlIGFzc2lnbm1lbnQgd2l0aCB0aGUgbmV3IGFuaW1hdGlvbiBjb25maWcuXG4gICAgICAgIHRoaXMuX3JlcGxhY2VUZXh0KFxuICAgICAgICAgICAgZmlsZVBhdGgsIGV4cHJlc3Npb24ucmlnaHQuZ2V0U3RhcnQoKSwgZXhwcmVzc2lvbi5yaWdodC5nZXRXaWR0aCgpLFxuICAgICAgICAgICAgYHtlbnRlckR1cmF0aW9uOiAke25ld0VudGVyRHVyYXRpb25WYWx1ZX19YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBIYW5kbGUgdGhlIHJpZ2h0IGV4cHJlc3Npb24gZGlmZmVyZW50bHkgaWYgdGhlIHByZXZpb3VzIHNwZWVkIGZhY3RvciB2YWx1ZSBjYW4ndFxuICAgICAgICAvLyBiZSByZXNvbHZlZCBzdGF0aWNhbGx5LiBJbiB0aGF0IGNhc2UsIHdlIGp1c3QgY3JlYXRlIGEgVHlwZVNjcmlwdCBleHByZXNzaW9uIHRoYXRcbiAgICAgICAgLy8gY2FsY3VsYXRlcyB0aGUgZXhwbGljaXQgZHVyYXRpb24gYmFzZWQgb24gdGhlIG5vbi1zdGF0aWMgc3BlZWQgZmFjdG9yIGV4cHJlc3Npb24uXG4gICAgICAgIGNvbnN0IG5ld0V4cHJlc3Npb24gPSBjcmVhdGVTcGVlZEZhY3RvckNvbnZlcnRFeHByZXNzaW9uKGV4cHJlc3Npb24ucmlnaHQuZ2V0VGV4dCgpKTtcblxuICAgICAgICAvLyBSZXBsYWNlIHRoZSBgc3BlZWRGYWN0b3JgIHByb3BlcnR5IG5hbWUgd2l0aCBgYW5pbWF0aW9uYC5cbiAgICAgICAgdGhpcy5fcmVwbGFjZVRleHQoXG4gICAgICAgICAgICBmaWxlUGF0aCwgbGVmdEV4cHJlc3Npb24ubmFtZS5nZXRTdGFydCgpLCBsZWZ0RXhwcmVzc2lvbi5uYW1lLmdldFdpZHRoKCksICdhbmltYXRpb24nKTtcblxuICAgICAgICAvLyBSZXBsYWNlIHRoZSB2YWx1ZSBhc3NpZ25tZW50IHdpdGggdGhlIG5ldyBhbmltYXRpb24gY29uZmlnIGFuZCByZW1vdmUgVE9ETy5cbiAgICAgICAgdGhpcy5fcmVwbGFjZVRleHQoXG4gICAgICAgICAgICBmaWxlUGF0aCwgZXhwcmVzc2lvbi5yaWdodC5nZXRTdGFydCgpLCBleHByZXNzaW9uLnJpZ2h0LmdldFdpZHRoKCksXG4gICAgICAgICAgICBgLyoqICR7cmVtb3ZlTm90ZX0gKi8ge2VudGVyRHVyYXRpb246ICR7bmV3RXhwcmVzc2lvbn19YCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN3aXRjaGVzIHRoZSBnbG9iYWwgb3B0aW9uIGBiYXNlU3BlZWRGYWN0b3JgIHRvIHRoZSBuZXcgYW5pbWF0aW9uIGNvbmZpZy4gRm9yIHRoaXNcbiAgICogd2UgYXNzdW1lIHRoYXQgdGhlIGBiYXNlU3BlZWRGYWN0b3JgIGlzIG5vdCB1c2VkIGluIGNvbWJpbmF0aW9uIHdpdGggaW5kaXZpZHVhbFxuICAgKiBzcGVlZCBmYWN0b3JzLlxuICAgKi9cbiAgcHJpdmF0ZSBfdmlzaXRQcm9wZXJ0eUFzc2lnbm1lbnQoYXNzaWdubWVudDogdHMuUHJvcGVydHlBc3NpZ25tZW50KSB7XG4gICAgLy8gRm9yIHN3aXRjaGluZyB0aGUgYGJhc2VTcGVlZEZhY3RvcmAgZ2xvYmFsIG9wdGlvbiB3ZSBleHBlY3QgdGhlIHByb3BlcnR5IGFzc2lnbm1lbnRcbiAgICAvLyB0byBiZSBpbnNpZGUgb2YgYSBub3JtYWwgb2JqZWN0IGxpdGVyYWwuIEN1c3RvbSByaXBwbGUgZ2xvYmFsIG9wdGlvbnMgY2Fubm90IGJlXG4gICAgLy8gd2l0Y2hlZCBhdXRvbWF0aWNhbGx5LlxuICAgIGlmICghdHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihhc3NpZ25tZW50LnBhcmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgYXNzaWdubWVudCBjb25zaXN0cyBvZiBhIG5hbWUgKGtleSkgYW5kIGluaXRpYWxpemVyICh2YWx1ZSkuXG4gICAgaWYgKGFzc2lnbm1lbnQubmFtZS5nZXRUZXh0KCkgIT09ICdiYXNlU3BlZWRGYWN0b3InKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gV2UgY291bGQgdGVjaG5pY2FsbHkgbGF6aWx5IGNoZWNrIGZvciB0aGUgTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUyBpbmplY3Rpb24gdG9rZW4gdG9cbiAgICAvLyBiZSBwcmVzZW50LCBidXQgaXQncyBub3QgcmlnaHQgdG8gYXNzdW1lIHRoYXQgZXZlcnlvbmUgc2V0cyB0aGUgcmlwcGxlIGdsb2JhbCBvcHRpb25zXG4gICAgLy8gaW1tZWRpYXRlbHkgaW4gdGhlIHByb3ZpZGVyIG9iamVjdCAoZS5nLiBpdCBjYW4gaGFwcGVuIHRoYXQgc29tZW9uZSBqdXN0IGltcG9ydHMgdGhlXG4gICAgLy8gY29uZmlnIGZyb20gYSBzZXBhcmF0ZSBmaWxlKS5cblxuICAgIGNvbnN0IHtpbml0aWFsaXplciwgbmFtZX0gPSBhc3NpZ25tZW50O1xuICAgIGNvbnN0IGZpbGVQYXRoID0gdGhpcy5maWxlU3lzdGVtLnJlc29sdmUoYXNzaWdubWVudC5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWUpO1xuXG4gICAgaWYgKHRzLmlzTnVtZXJpY0xpdGVyYWwoaW5pdGlhbGl6ZXIpKSB7XG4gICAgICBjb25zdCBudW1lcmljVmFsdWUgPSBwYXJzZUZsb2F0KGluaXRpYWxpemVyLnRleHQpO1xuICAgICAgY29uc3QgbmV3RW50ZXJEdXJhdGlvblZhbHVlID0gY29udmVydFNwZWVkRmFjdG9yVG9EdXJhdGlvbihudW1lcmljVmFsdWUpO1xuXG4gICAgICAvLyBSZXBsYWNlIHRoZSBgYmFzZVNwZWVkRmFjdG9yYCBwcm9wZXJ0eSBuYW1lIHdpdGggYGFuaW1hdGlvbmAuXG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChmaWxlUGF0aCwgbmFtZS5nZXRTdGFydCgpLCBuYW1lLmdldFdpZHRoKCksICdhbmltYXRpb24nKTtcbiAgICAgIC8vIFJlcGxhY2UgdGhlIHZhbHVlIGFzc2lnbm1lbnQgaW5pdGlhbGl6ZXIgd2l0aCB0aGUgbmV3IGFuaW1hdGlvbiBjb25maWcuXG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgICBmaWxlUGF0aCwgaW5pdGlhbGl6ZXIuZ2V0U3RhcnQoKSwgaW5pdGlhbGl6ZXIuZ2V0V2lkdGgoKSxcbiAgICAgICAgICBge2VudGVyRHVyYXRpb246ICR7bmV3RW50ZXJEdXJhdGlvblZhbHVlfX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSGFuZGxlIHRoZSByaWdodCBleHByZXNzaW9uIGRpZmZlcmVudGx5IGlmIHRoZSBwcmV2aW91cyBzcGVlZCBmYWN0b3IgdmFsdWUgY2FuJ3RcbiAgICAgIC8vIGJlIHJlc29sdmVkIHN0YXRpY2FsbHkuIEluIHRoYXQgY2FzZSwgd2UganVzdCBjcmVhdGUgYSBUeXBlU2NyaXB0IGV4cHJlc3Npb24gdGhhdFxuICAgICAgLy8gY2FsY3VsYXRlcyB0aGUgZXhwbGljaXQgZHVyYXRpb24gYmFzZWQgb24gdGhlIG5vbi1zdGF0aWMgc3BlZWQgZmFjdG9yIGV4cHJlc3Npb24uXG4gICAgICBjb25zdCBuZXdFeHByZXNzaW9uID0gY3JlYXRlU3BlZWRGYWN0b3JDb252ZXJ0RXhwcmVzc2lvbihpbml0aWFsaXplci5nZXRUZXh0KCkpO1xuXG4gICAgICAvLyBSZXBsYWNlIHRoZSBgYmFzZVNwZWVkRmFjdG9yYCBwcm9wZXJ0eSBuYW1lIHdpdGggYGFuaW1hdGlvbmAuXG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChmaWxlUGF0aCwgbmFtZS5nZXRTdGFydCgpLCBuYW1lLmdldFdpZHRoKCksICdhbmltYXRpb24nKTtcblxuICAgICAgLy8gUmVwbGFjZSB0aGUgdmFsdWUgYXNzaWdubWVudCB3aXRoIHRoZSBuZXcgYW5pbWF0aW9uIGNvbmZpZyBhbmQgcmVtb3ZlIFRPRE8uXG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgICBmaWxlUGF0aCwgaW5pdGlhbGl6ZXIuZ2V0U3RhcnQoKSwgaW5pdGlhbGl6ZXIuZ2V0V2lkdGgoKSxcbiAgICAgICAgICBgLyoqICR7cmVtb3ZlTm90ZX0gKi8ge2VudGVyRHVyYXRpb246ICR7bmV3RXhwcmVzc2lvbn19YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcmVwbGFjZVRleHQoZmlsZVBhdGg6IFdvcmtzcGFjZVBhdGgsIHN0YXJ0OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIG5ld1RleHQ6IHN0cmluZykge1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5maWxlU3lzdGVtLmVkaXQoZmlsZVBhdGgpO1xuICAgIHJlY29yZGVyLnJlbW92ZShzdGFydCwgd2lkdGgpO1xuICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KHN0YXJ0LCBuZXdUZXh0KTtcbiAgfVxufVxuIl19
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
        define("@angular/material/schematics/ng-update/upgrade-rules/misc-ripples-v7/ripple-speed-factor-rule", ["require", "exports", "@angular/cdk/schematics", "typescript", "@angular/material/schematics/ng-update/upgrade-rules/misc-ripples-v7/ripple-speed-factor"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const ts = require("typescript");
    const ripple_speed_factor_1 = require("@angular/material/schematics/ng-update/upgrade-rules/misc-ripples-v7/ripple-speed-factor");
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
     * Rule that walks through every property assignment and switches the global `baseSpeedFactor`
     * ripple option to the new global animation config. Also updates every class member assignment
     * that refers to MatRipple#speedFactor.
     */
    class RippleSpeedFactorRule extends schematics_1.MigrationRule {
        constructor() {
            super(...arguments);
            // Only enable this rule if the migration targets version 7 as the ripple
            // speed factor has been removed in that version.
            this.ruleEnabled = this.targetVersion === schematics_1.TargetVersion.V7;
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
            const filePath = leftExpression.getSourceFile().fileName;
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
            const filePath = assignment.getSourceFile().fileName;
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
            const recorder = this.getUpdateRecorder(filePath);
            recorder.remove(start, width);
            recorder.insertRight(start, newText);
        }
    }
    exports.RippleSpeedFactorRule = RippleSpeedFactorRule;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXNwZWVkLWZhY3Rvci1ydWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL3VwZ3JhZGUtcnVsZXMvbWlzYy1yaXBwbGVzLXY3L3JpcHBsZS1zcGVlZC1mYWN0b3ItcnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILHdEQUF1RjtJQUN2RixpQ0FBaUM7SUFDakMsa0lBRytCO0lBRS9CLHFGQUFxRjtJQUNyRixNQUFNLHNCQUFzQixHQUFHLDRDQUE0QyxDQUFDO0lBRTVFLDJGQUEyRjtJQUMzRixNQUFNLHVCQUF1QixHQUFHLG1EQUFtRCxDQUFDO0lBRXBGOzs7O09BSUc7SUFDSCxNQUFNLFVBQVUsR0FBRyxxQ0FBcUMsQ0FBQztJQUV6RDs7OztPQUlHO0lBQ0gsTUFBYSxxQkFBc0IsU0FBUSwwQkFBbUI7UUFBOUQ7O1lBRUUseUVBQXlFO1lBQ3pFLGlEQUFpRDtZQUNqRCxnQkFBVyxHQUFHLElBQUksQ0FBQyxhQUFhLEtBQUssMEJBQWEsQ0FBQyxFQUFFLENBQUM7UUF1SXhELENBQUM7UUFySUMsU0FBUyxDQUFDLElBQWE7WUFDckIsSUFBSSxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNuQztpQkFBTSxJQUFJLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JDO1FBQ0gsQ0FBQztRQUVELGFBQWEsQ0FBQyxRQUEwQjtZQUN0QyxJQUFJLEtBQTRCLENBQUM7WUFFakMsT0FBTyxDQUFDLEtBQUssR0FBRyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFD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QUEwRTtnQkFDMUUsSUFBSSxDQUFDLFlBQVksQ0FDYixRQUFRLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFDeEQsbUJBQW1CLHFCQUFxQixHQUFHLENBQUMsQ0FBQzthQUNsRDtpQkFBTTtnQkFDTCxtRkFBbUY7Z0JBQ25GLG9GQUFvRjtnQkFDcEYsb0ZBQW9GO2dCQUNwRixNQUFNLGFBQWEsR0FBRyx3REFBa0MsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztnQkFFaEYsZ0VBQWdFO2dCQUNoRSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUUzRSw4RUFBOEU7Z0JBQzlFLElBQUksQ0FBQyxZQUFZLENBQ2IsUUFBUSxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFFLEVBQ3hELE9BQU8sVUFBVSx1QkFBdUIsYUFBYSxHQUFHLENBQUMsQ0FBQzthQUMvRDtRQUNILENBQUM7UUFFTyxZQUFZLENBQUMsUUFBZ0IsRUFBRSxLQUFhLEVBQUUsS0FBYSxFQUFFLE9BQWU7WUFDbEYsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2xELFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQzlCLFFBQVEsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7S0FDRjtJQTNJRCxzREEySUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNaWdyYXRpb25SdWxlLCBSZXNvbHZlZFJlc291cmNlLCBUYXJnZXRWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7XG4gIGNvbnZlcnRTcGVlZEZhY3RvclRvRHVyYXRpb24sXG4gIGNyZWF0ZVNwZWVkRmFjdG9yQ29udmVydEV4cHJlc3Npb24sXG59IGZyb20gJy4vcmlwcGxlLXNwZWVkLWZhY3Rvcic7XG5cbi8qKiBSZWd1bGFyIGV4cHJlc3Npb24gdGhhdCBtYXRjaGVzIFttYXRSaXBwbGVTcGVlZEZhY3Rvcl09XCIkTlVNQkVSXCIgaW4gdGVtcGxhdGVzLiAqL1xuY29uc3Qgc3BlZWRGYWN0b3JOdW1iZXJSZWdleCA9IC9cXFttYXRSaXBwbGVTcGVlZEZhY3Rvcl09XCIoXFxkKyg/OlxcLlxcZCspPylcIi9nO1xuXG4vKiogUmVndWxhciBleHByZXNzaW9uIHRoYXQgbWF0Y2hlcyBbbWF0UmlwcGxlU3BlZWRGYWN0b3JdPVwiJE5PVF9BX05VTUJFUlwiIGluIHRlbXBsYXRlcy4gKi9cbmNvbnN0IHNwZWVkRmFjdG9yTm90UGFyc2VhYmxlID0gL1xcW21hdFJpcHBsZVNwZWVkRmFjdG9yXT1cIig/IVxcZCsoPzpcXC5cXGQrKT9cIikoLiopXCIvZztcblxuLyoqXG4gKiBOb3RlIHRoYXQgd2lsbCBiZSBhZGRlZCB3aGVuZXZlciBhIHNwZWVkIGZhY3RvciBleHByZXNzaW9uIGhhcyBiZWVuIGNvbnZlcnRlZCB0byBjYWxjdWxhdGVcbiAqIHRoZSBhY2NvcmRpbmcgZHVyYXRpb24uIFRoaXMgbm90ZSBzaG91bGQgZW5jb3VyYWdlIHBlb3BsZSB0byBjbGVhbiB1cCB0aGVpciBjb2RlIGJ5IHN3aXRjaGluZ1xuICogYXdheSBmcm9tIHRoZSBzcGVlZCBmYWN0b3JzIHRvIGV4cGxpY2l0IGR1cmF0aW9ucy5cbiAqL1xuY29uc3QgcmVtb3ZlTm90ZSA9IGBUT0RPOiBDbGVhbnVwIGR1cmF0aW9uIGNhbGN1bGF0aW9uLmA7XG5cbi8qKlxuICogUnVsZSB0aGF0IHdhbGtzIHRocm91Z2ggZXZlcnkgcHJvcGVydHkgYXNzaWdubWVudCBhbmQgc3dpdGNoZXMgdGhlIGdsb2JhbCBgYmFzZVNwZWVkRmFjdG9yYFxuICogcmlwcGxlIG9wdGlvbiB0byB0aGUgbmV3IGdsb2JhbCBhbmltYXRpb24gY29uZmlnLiBBbHNvIHVwZGF0ZXMgZXZlcnkgY2xhc3MgbWVtYmVyIGFzc2lnbm1lbnRcbiAqIHRoYXQgcmVmZXJzIHRvIE1hdFJpcHBsZSNzcGVlZEZhY3Rvci5cbiAqL1xuZXhwb3J0IGNsYXNzIFJpcHBsZVNwZWVkRmFjdG9yUnVsZSBleHRlbmRzIE1pZ3JhdGlvblJ1bGU8bnVsbD4ge1xuXG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdmVyc2lvbiA3IGFzIHRoZSByaXBwbGVcbiAgLy8gc3BlZWQgZmFjdG9yIGhhcyBiZWVuIHJlbW92ZWQgaW4gdGhhdCB2ZXJzaW9uLlxuICBydWxlRW5hYmxlZCA9IHRoaXMudGFyZ2V0VmVyc2lvbiA9PT0gVGFyZ2V0VmVyc2lvbi5WNztcblxuICB2aXNpdE5vZGUobm9kZTogdHMuTm9kZSk6IHZvaWQge1xuICAgIGlmICh0cy5pc0JpbmFyeUV4cHJlc3Npb24obm9kZSkpIHtcbiAgICAgIHRoaXMuX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihub2RlKTtcbiAgICB9IGVsc2UgaWYgKHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KG5vZGUpKSB7XG4gICAgICB0aGlzLl92aXNpdFByb3BlcnR5QXNzaWdubWVudChub2RlKTtcbiAgICB9XG4gIH1cblxuICB2aXNpdFRlbXBsYXRlKHRlbXBsYXRlOiBSZXNvbHZlZFJlc291cmNlKTogdm9pZCB7XG4gICAgbGV0IG1hdGNoOiBSZWdFeHBNYXRjaEFycmF5fG51bGw7XG5cbiAgICB3aGlsZSAoKG1hdGNoID0gc3BlZWRGYWN0b3JOdW1iZXJSZWdleC5leGVjKHRlbXBsYXRlLmNvbnRlbnQpKSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgbmV3RW50ZXJEdXJhdGlvbiA9IGNvbnZlcnRTcGVlZEZhY3RvclRvRHVyYXRpb24ocGFyc2VGbG9hdChtYXRjaFsxXSkpO1xuXG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgICB0ZW1wbGF0ZS5maWxlUGF0aCwgdGVtcGxhdGUuc3RhcnQgKyBtYXRjaC5pbmRleCEsIG1hdGNoWzBdLmxlbmd0aCxcbiAgICAgICAgICBgW21hdFJpcHBsZUFuaW1hdGlvbl09XCJ7ZW50ZXJEdXJhdGlvbjogJHtuZXdFbnRlckR1cmF0aW9ufX1cImApO1xuICAgIH1cblxuICAgIHdoaWxlICgobWF0Y2ggPSBzcGVlZEZhY3Rvck5vdFBhcnNlYWJsZS5leGVjKHRlbXBsYXRlLmNvbnRlbnQpKSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgbmV3RHVyYXRpb25FeHByZXNzaW9uID0gY3JlYXRlU3BlZWRGYWN0b3JDb252ZXJ0RXhwcmVzc2lvbihtYXRjaFsxXSk7XG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgICB0ZW1wbGF0ZS5maWxlUGF0aCwgdGVtcGxhdGUuc3RhcnQgKyBtYXRjaC5pbmRleCEsIG1hdGNoWzBdLmxlbmd0aCxcbiAgICAgICAgICBgW21hdFJpcHBsZUFuaW1hdGlvbl09XCJ7ZW50ZXJEdXJhdGlvbjogKCR7bmV3RHVyYXRpb25FeHByZXNzaW9ufSl9XCJgKTtcbiAgICB9XG4gIH1cblxuICAvKiogU3dpdGNoZXMgYmluYXJ5IGV4cHJlc3Npb25zIChlLmcuIG15UmlwcGxlLnNwZWVkRmFjdG9yID0gMC41KSB0byB0aGUgbmV3IGFuaW1hdGlvbiBjb25maWcuICovXG4gIHByaXZhdGUgX3Zpc2l0QmluYXJ5RXhwcmVzc2lvbihleHByZXNzaW9uOiB0cy5CaW5hcnlFeHByZXNzaW9uKSB7XG4gICAgaWYgKCF0cy5pc1Byb3BlcnR5QWNjZXNzRXhwcmVzc2lvbihleHByZXNzaW9uLmxlZnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTGVmdCBzaWRlIGV4cHJlc3Npb24gY29uc2lzdHMgb2YgdGFyZ2V0IG9iamVjdCBhbmQgcHJvcGVydHkgbmFtZSAoZS5nLiBteUluc3RhbmNlLnZhbClcbiAgICBjb25zdCBsZWZ0RXhwcmVzc2lvbiA9IGV4cHJlc3Npb24ubGVmdCBhcyB0cy5Qcm9wZXJ0eUFjY2Vzc0V4cHJlc3Npb247XG4gICAgY29uc3QgdGFyZ2V0VHlwZU5vZGUgPSB0aGlzLnR5cGVDaGVja2VyLmdldFR5cGVBdExvY2F0aW9uKGxlZnRFeHByZXNzaW9uLmV4cHJlc3Npb24pO1xuXG4gICAgaWYgKCF0YXJnZXRUeXBlTm9kZS5zeW1ib2wpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRUeXBlTmFtZSA9IHRhcmdldFR5cGVOb2RlLnN5bWJvbC5nZXROYW1lKCk7XG4gICAgY29uc3QgcHJvcGVydHlOYW1lID0gbGVmdEV4cHJlc3Npb24ubmFtZS5nZXRUZXh0KCk7XG4gICAgY29uc3QgZmlsZVBhdGggPSBsZWZ0RXhwcmVzc2lvbi5nZXRTb3VyY2VGaWxlKCkuZmlsZU5hbWU7XG5cbiAgICBpZiAodGFyZ2V0VHlwZU5hbWUgPT09ICdNYXRSaXBwbGUnICYmIHByb3BlcnR5TmFtZSA9PT0gJ3NwZWVkRmFjdG9yJykge1xuICAgICAgaWYgKHRzLmlzTnVtZXJpY0xpdGVyYWwoZXhwcmVzc2lvbi5yaWdodCkpIHtcbiAgICAgICAgY29uc3QgbnVtZXJpY1ZhbHVlID0gcGFyc2VGbG9hdChleHByZXNzaW9uLnJpZ2h0LnRleHQpO1xuICAgICAgICBjb25zdCBuZXdFbnRlckR1cmF0aW9uVmFsdWUgPSBjb252ZXJ0U3BlZWRGYWN0b3JUb0R1cmF0aW9uKG51bWVyaWNWYWx1ZSk7XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgYHNwZWVkRmFjdG9yYCBwcm9wZXJ0eSBuYW1lIHdpdGggYGFuaW1hdGlvbmAuXG4gICAgICAgIHRoaXMuX3JlcGxhY2VUZXh0KFxuICAgICAgICAgICAgZmlsZVBhdGgsIGxlZnRFeHByZXNzaW9uLm5hbWUuZ2V0U3RhcnQoKSwgbGVmdEV4cHJlc3Npb24ubmFtZS5nZXRXaWR0aCgpLCAnYW5pbWF0aW9uJyk7XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgdmFsdWUgYXNzaWdubWVudCB3aXRoIHRoZSBuZXcgYW5pbWF0aW9uIGNvbmZpZy5cbiAgICAgICAgdGhpcy5fcmVwbGFjZVRleHQoXG4gICAgICAgICAgICBmaWxlUGF0aCwgZXhwcmVzc2lvbi5yaWdodC5nZXRTdGFydCgpLCBleHByZXNzaW9uLnJpZ2h0LmdldFdpZHRoKCksXG4gICAgICAgICAgICBge2VudGVyRHVyYXRpb246ICR7bmV3RW50ZXJEdXJhdGlvblZhbHVlfX1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEhhbmRsZSB0aGUgcmlnaHQgZXhwcmVzc2lvbiBkaWZmZXJlbnRseSBpZiB0aGUgcHJldmlvdXMgc3BlZWQgZmFjdG9yIHZhbHVlIGNhbid0XG4gICAgICAgIC8vIGJlIHJlc29sdmVkIHN0YXRpY2FsbHkuIEluIHRoYXQgY2FzZSwgd2UganVzdCBjcmVhdGUgYSBUeXBlU2NyaXB0IGV4cHJlc3Npb24gdGhhdFxuICAgICAgICAvLyBjYWxjdWxhdGVzIHRoZSBleHBsaWNpdCBkdXJhdGlvbiBiYXNlZCBvbiB0aGUgbm9uLXN0YXRpYyBzcGVlZCBmYWN0b3IgZXhwcmVzc2lvbi5cbiAgICAgICAgY29uc3QgbmV3RXhwcmVzc2lvbiA9IGNyZWF0ZVNwZWVkRmFjdG9yQ29udmVydEV4cHJlc3Npb24oZXhwcmVzc2lvbi5yaWdodC5nZXRUZXh0KCkpO1xuXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIGBzcGVlZEZhY3RvcmAgcHJvcGVydHkgbmFtZSB3aXRoIGBhbmltYXRpb25gLlxuICAgICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgICAgIGZpbGVQYXRoLCBsZWZ0RXhwcmVzc2lvbi5uYW1lLmdldFN0YXJ0KCksIGxlZnRFeHByZXNzaW9uLm5hbWUuZ2V0V2lkdGgoKSwgJ2FuaW1hdGlvbicpO1xuXG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIHZhbHVlIGFzc2lnbm1lbnQgd2l0aCB0aGUgbmV3IGFuaW1hdGlvbiBjb25maWcgYW5kIHJlbW92ZSBUT0RPLlxuICAgICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgICAgIGZpbGVQYXRoLCBleHByZXNzaW9uLnJpZ2h0LmdldFN0YXJ0KCksIGV4cHJlc3Npb24ucmlnaHQuZ2V0V2lkdGgoKSxcbiAgICAgICAgICAgIGAvKiogJHtyZW1vdmVOb3RlfSAqLyB7ZW50ZXJEdXJhdGlvbjogJHtuZXdFeHByZXNzaW9ufX1gKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU3dpdGNoZXMgdGhlIGdsb2JhbCBvcHRpb24gYGJhc2VTcGVlZEZhY3RvcmAgdG8gdGhlIG5ldyBhbmltYXRpb24gY29uZmlnLiBGb3IgdGhpc1xuICAgKiB3ZSBhc3N1bWUgdGhhdCB0aGUgYGJhc2VTcGVlZEZhY3RvcmAgaXMgbm90IHVzZWQgaW4gY29tYmluYXRpb24gd2l0aCBpbmRpdmlkdWFsXG4gICAqIHNwZWVkIGZhY3RvcnMuXG4gICAqL1xuICBwcml2YXRlIF92aXNpdFByb3BlcnR5QXNzaWdubWVudChhc3NpZ25tZW50OiB0cy5Qcm9wZXJ0eUFzc2lnbm1lbnQpIHtcbiAgICAvLyBGb3Igc3dpdGNoaW5nIHRoZSBgYmFzZVNwZWVkRmFjdG9yYCBnbG9iYWwgb3B0aW9uIHdlIGV4cGVjdCB0aGUgcHJvcGVydHkgYXNzaWdubWVudFxuICAgIC8vIHRvIGJlIGluc2lkZSBvZiBhIG5vcm1hbCBvYmplY3QgbGl0ZXJhbC4gQ3VzdG9tIHJpcHBsZSBnbG9iYWwgb3B0aW9ucyBjYW5ub3QgYmVcbiAgICAvLyB3aXRjaGVkIGF1dG9tYXRpY2FsbHkuXG4gICAgaWYgKCF0cy5pc09iamVjdExpdGVyYWxFeHByZXNzaW9uKGFzc2lnbm1lbnQucGFyZW50KSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBhc3NpZ25tZW50IGNvbnNpc3RzIG9mIGEgbmFtZSAoa2V5KSBhbmQgaW5pdGlhbGl6ZXIgKHZhbHVlKS5cbiAgICBpZiAoYXNzaWdubWVudC5uYW1lLmdldFRleHQoKSAhPT0gJ2Jhc2VTcGVlZEZhY3RvcicpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBXZSBjb3VsZCB0ZWNobmljYWxseSBsYXppbHkgY2hlY2sgZm9yIHRoZSBNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TIGluamVjdGlvbiB0b2tlbiB0b1xuICAgIC8vIGJlIHByZXNlbnQsIGJ1dCBpdCdzIG5vdCByaWdodCB0byBhc3N1bWUgdGhhdCBldmVyeW9uZSBzZXRzIHRoZSByaXBwbGUgZ2xvYmFsIG9wdGlvbnNcbiAgICAvLyBpbW1lZGlhdGVseSBpbiB0aGUgcHJvdmlkZXIgb2JqZWN0IChlLmcuIGl0IGNhbiBoYXBwZW4gdGhhdCBzb21lb25lIGp1c3QgaW1wb3J0cyB0aGVcbiAgICAvLyBjb25maWcgZnJvbSBhIHNlcGFyYXRlIGZpbGUpLlxuXG4gICAgY29uc3Qge2luaXRpYWxpemVyLCBuYW1lfSA9IGFzc2lnbm1lbnQ7XG4gICAgY29uc3QgZmlsZVBhdGggPSBhc3NpZ25tZW50LmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZTtcblxuICAgIGlmICh0cy5pc051bWVyaWNMaXRlcmFsKGluaXRpYWxpemVyKSkge1xuICAgICAgY29uc3QgbnVtZXJpY1ZhbHVlID0gcGFyc2VGbG9hdChpbml0aWFsaXplci50ZXh0KTtcbiAgICAgIGNvbnN0IG5ld0VudGVyRHVyYXRpb25WYWx1ZSA9IGNvbnZlcnRTcGVlZEZhY3RvclRvRHVyYXRpb24obnVtZXJpY1ZhbHVlKTtcblxuICAgICAgLy8gUmVwbGFjZSB0aGUgYGJhc2VTcGVlZEZhY3RvcmAgcHJvcGVydHkgbmFtZSB3aXRoIGBhbmltYXRpb25gLlxuICAgICAgdGhpcy5fcmVwbGFjZVRleHQoZmlsZVBhdGgsIG5hbWUuZ2V0U3RhcnQoKSwgbmFtZS5nZXRXaWR0aCgpLCAnYW5pbWF0aW9uJyk7XG4gICAgICAvLyBSZXBsYWNlIHRoZSB2YWx1ZSBhc3NpZ25tZW50IGluaXRpYWxpemVyIHdpdGggdGhlIG5ldyBhbmltYXRpb24gY29uZmlnLlxuICAgICAgdGhpcy5fcmVwbGFjZVRleHQoXG4gICAgICAgICAgZmlsZVBhdGgsIGluaXRpYWxpemVyLmdldFN0YXJ0KCksIGluaXRpYWxpemVyLmdldFdpZHRoKCksXG4gICAgICAgICAgYHtlbnRlckR1cmF0aW9uOiAke25ld0VudGVyRHVyYXRpb25WYWx1ZX19YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEhhbmRsZSB0aGUgcmlnaHQgZXhwcmVzc2lvbiBkaWZmZXJlbnRseSBpZiB0aGUgcHJldmlvdXMgc3BlZWQgZmFjdG9yIHZhbHVlIGNhbid0XG4gICAgICAvLyBiZSByZXNvbHZlZCBzdGF0aWNhbGx5LiBJbiB0aGF0IGNhc2UsIHdlIGp1c3QgY3JlYXRlIGEgVHlwZVNjcmlwdCBleHByZXNzaW9uIHRoYXRcbiAgICAgIC8vIGNhbGN1bGF0ZXMgdGhlIGV4cGxpY2l0IGR1cmF0aW9uIGJhc2VkIG9uIHRoZSBub24tc3RhdGljIHNwZWVkIGZhY3RvciBleHByZXNzaW9uLlxuICAgICAgY29uc3QgbmV3RXhwcmVzc2lvbiA9IGNyZWF0ZVNwZWVkRmFjdG9yQ29udmVydEV4cHJlc3Npb24oaW5pdGlhbGl6ZXIuZ2V0VGV4dCgpKTtcblxuICAgICAgLy8gUmVwbGFjZSB0aGUgYGJhc2VTcGVlZEZhY3RvcmAgcHJvcGVydHkgbmFtZSB3aXRoIGBhbmltYXRpb25gLlxuICAgICAgdGhpcy5fcmVwbGFjZVRleHQoZmlsZVBhdGgsIG5hbWUuZ2V0U3RhcnQoKSwgbmFtZS5nZXRXaWR0aCgpLCAnYW5pbWF0aW9uJyk7XG5cbiAgICAgIC8vIFJlcGxhY2UgdGhlIHZhbHVlIGFzc2lnbm1lbnQgd2l0aCB0aGUgbmV3IGFuaW1hdGlvbiBjb25maWcgYW5kIHJlbW92ZSBUT0RPLlxuICAgICAgdGhpcy5fcmVwbGFjZVRleHQoXG4gICAgICAgICAgZmlsZVBhdGgsIGluaXRpYWxpemVyLmdldFN0YXJ0KCksIGluaXRpYWxpemVyLmdldFdpZHRoKCksXG4gICAgICAgICAgYC8qKiAke3JlbW92ZU5vdGV9ICovIHtlbnRlckR1cmF0aW9uOiAke25ld0V4cHJlc3Npb259fWApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3JlcGxhY2VUZXh0KGZpbGVQYXRoOiBzdHJpbmcsIHN0YXJ0OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIG5ld1RleHQ6IHN0cmluZykge1xuICAgIGNvbnN0IHJlY29yZGVyID0gdGhpcy5nZXRVcGRhdGVSZWNvcmRlcihmaWxlUGF0aCk7XG4gICAgcmVjb3JkZXIucmVtb3ZlKHN0YXJ0LCB3aWR0aCk7XG4gICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoc3RhcnQsIG5ld1RleHQpO1xuICB9XG59XG4iXX0=
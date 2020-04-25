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
            const recorder = this.fileSystem.edit(filePath);
            recorder.remove(start, width);
            recorder.insertRight(start, newText);
        }
    }
    exports.RippleSpeedFactorMigration = RippleSpeedFactorMigration;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmlwcGxlLXNwZWVkLWZhY3Rvci1taWdyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy11cGRhdGUvbWlncmF0aW9ucy9taXNjLXJpcHBsZXMtdjcvcmlwcGxlLXNwZWVkLWZhY3Rvci1taWdyYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCx3REFBbUY7SUFDbkYsaUNBQWlDO0lBQ2pDLCtIQUcrQjtJQUUvQixxRkFBcUY7SUFDckYsTUFBTSxzQkFBc0IsR0FBRyw0Q0FBNEMsQ0FBQztJQUU1RSwyRkFBMkY7SUFDM0YsTUFBTSx1QkFBdUIsR0FBRyxtREFBbUQsQ0FBQztJQUVwRjs7OztPQUlHO0lBQ0gsTUFBTSxVQUFVLEdBQUcscUNBQXFDLENBQUM7SUFFekQ7Ozs7T0FJRztJQUNILE1BQWEsMEJBQTJCLFNBQVEsc0JBQWU7UUFBL0Q7O1lBRUUseUVBQXlFO1lBQ3pFLGlEQUFpRDtZQUNqRCxZQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSywwQkFBYSxDQUFDLEVBQUUsQ0FBQztRQXVJcEQsQ0FBQztRQXJJQyxTQUFTLENBQUMsSUFBYTtZQUNyQixJQUFJLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25DO2lCQUFNLElBQUksRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN4QyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDckM7UUFDSCxDQUFDO1FBRUQsYUFBYSxDQUFDLFFBQTBCO1lBQ3RDLElBQUksS0FBNEIsQ0FBQztZQUVqQyxPQUFPLENBQUMsS0FBSyxHQUFHLHNCQUFzQixDQUFDLElBQUksQ0FBQyxRQUFR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M0UsMEVBQTBFO2dCQUMxRSxJQUFJLENBQUMsWUFBWSxDQUNiLFFBQVEsRUFBRSxXQUFXLENBQUMsUUFBUSxFQUFFLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUN4RCxtQkFBbUIscUJBQXFCLEdBQUcsQ0FBQyxDQUFDO2FBQ2xEO2lCQUFNO2dCQUNMLG1GQUFtRjtnQkFDbkYsb0ZBQW9GO2dCQUNwRixvRkFBb0Y7Z0JBQ3BGLE1BQU0sYUFBYSxHQUFHLHdEQUFrQyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUVoRixnRUFBZ0U7Z0JBQ2hFLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7Z0JBRTNFLDhFQUE4RTtnQkFDOUUsSUFBSSxDQUFDLFlBQVksQ0FDYixRQUFRLEVBQUUsV0FBVyxDQUFDLFFBQVEsRUFBRSxFQUFFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFDeEQsT0FBTyxVQUFVLHVCQUF1QixhQUFhLEdBQUcsQ0FBQyxDQUFDO2FBQy9EO1FBQ0gsQ0FBQztRQUVPLFlBQVksQ0FBQyxRQUFnQixFQUFFLEtBQWEsRUFBRSxLQUFhLEVBQUUsT0FBZTtZQUNsRixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNoRCxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM5QixRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2QyxDQUFDO0tBQ0Y7SUEzSUQsZ0VBMklDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7TWlncmF0aW9uLCBSZXNvbHZlZFJlc291cmNlLCBUYXJnZXRWZXJzaW9ufSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcbmltcG9ydCB7XG4gIGNvbnZlcnRTcGVlZEZhY3RvclRvRHVyYXRpb24sXG4gIGNyZWF0ZVNwZWVkRmFjdG9yQ29udmVydEV4cHJlc3Npb24sXG59IGZyb20gJy4vcmlwcGxlLXNwZWVkLWZhY3Rvcic7XG5cbi8qKiBSZWd1bGFyIGV4cHJlc3Npb24gdGhhdCBtYXRjaGVzIFttYXRSaXBwbGVTcGVlZEZhY3Rvcl09XCIkTlVNQkVSXCIgaW4gdGVtcGxhdGVzLiAqL1xuY29uc3Qgc3BlZWRGYWN0b3JOdW1iZXJSZWdleCA9IC9cXFttYXRSaXBwbGVTcGVlZEZhY3Rvcl09XCIoXFxkKyg/OlxcLlxcZCspPylcIi9nO1xuXG4vKiogUmVndWxhciBleHByZXNzaW9uIHRoYXQgbWF0Y2hlcyBbbWF0UmlwcGxlU3BlZWRGYWN0b3JdPVwiJE5PVF9BX05VTUJFUlwiIGluIHRlbXBsYXRlcy4gKi9cbmNvbnN0IHNwZWVkRmFjdG9yTm90UGFyc2VhYmxlID0gL1xcW21hdFJpcHBsZVNwZWVkRmFjdG9yXT1cIig/IVxcZCsoPzpcXC5cXGQrKT9cIikoLiopXCIvZztcblxuLyoqXG4gKiBOb3RlIHRoYXQgd2lsbCBiZSBhZGRlZCB3aGVuZXZlciBhIHNwZWVkIGZhY3RvciBleHByZXNzaW9uIGhhcyBiZWVuIGNvbnZlcnRlZCB0byBjYWxjdWxhdGVcbiAqIHRoZSBhY2NvcmRpbmcgZHVyYXRpb24uIFRoaXMgbm90ZSBzaG91bGQgZW5jb3VyYWdlIHBlb3BsZSB0byBjbGVhbiB1cCB0aGVpciBjb2RlIGJ5IHN3aXRjaGluZ1xuICogYXdheSBmcm9tIHRoZSBzcGVlZCBmYWN0b3JzIHRvIGV4cGxpY2l0IGR1cmF0aW9ucy5cbiAqL1xuY29uc3QgcmVtb3ZlTm90ZSA9IGBUT0RPOiBDbGVhbnVwIGR1cmF0aW9uIGNhbGN1bGF0aW9uLmA7XG5cbi8qKlxuICogTWlncmF0aW9uIHRoYXQgd2Fsa3MgdGhyb3VnaCBldmVyeSBwcm9wZXJ0eSBhc3NpZ25tZW50IGFuZCBzd2l0Y2hlcyB0aGUgZ2xvYmFsIGBiYXNlU3BlZWRGYWN0b3JgXG4gKiByaXBwbGUgb3B0aW9uIHRvIHRoZSBuZXcgZ2xvYmFsIGFuaW1hdGlvbiBjb25maWcuIEFsc28gdXBkYXRlcyBldmVyeSBjbGFzcyBtZW1iZXIgYXNzaWdubWVudFxuICogdGhhdCByZWZlcnMgdG8gTWF0UmlwcGxlI3NwZWVkRmFjdG9yLlxuICovXG5leHBvcnQgY2xhc3MgUmlwcGxlU3BlZWRGYWN0b3JNaWdyYXRpb24gZXh0ZW5kcyBNaWdyYXRpb248bnVsbD4ge1xuXG4gIC8vIE9ubHkgZW5hYmxlIHRoaXMgcnVsZSBpZiB0aGUgbWlncmF0aW9uIHRhcmdldHMgdmVyc2lvbiA3IGFzIHRoZSByaXBwbGVcbiAgLy8gc3BlZWQgZmFjdG9yIGhhcyBiZWVuIHJlbW92ZWQgaW4gdGhhdCB2ZXJzaW9uLlxuICBlbmFibGVkID0gdGhpcy50YXJnZXRWZXJzaW9uID09PSBUYXJnZXRWZXJzaW9uLlY3O1xuXG4gIHZpc2l0Tm9kZShub2RlOiB0cy5Ob2RlKTogdm9pZCB7XG4gICAgaWYgKHRzLmlzQmluYXJ5RXhwcmVzc2lvbihub2RlKSkge1xuICAgICAgdGhpcy5fdmlzaXRCaW5hcnlFeHByZXNzaW9uKG5vZGUpO1xuICAgIH0gZWxzZSBpZiAodHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQobm9kZSkpIHtcbiAgICAgIHRoaXMuX3Zpc2l0UHJvcGVydHlBc3NpZ25tZW50KG5vZGUpO1xuICAgIH1cbiAgfVxuXG4gIHZpc2l0VGVtcGxhdGUodGVtcGxhdGU6IFJlc29sdmVkUmVzb3VyY2UpOiB2b2lkIHtcbiAgICBsZXQgbWF0Y2g6IFJlZ0V4cE1hdGNoQXJyYXl8bnVsbDtcblxuICAgIHdoaWxlICgobWF0Y2ggPSBzcGVlZEZhY3Rvck51bWJlclJlZ2V4LmV4ZWModGVtcGxhdGUuY29udGVudCkpICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBuZXdFbnRlckR1cmF0aW9uID0gY29udmVydFNwZWVkRmFjdG9yVG9EdXJhdGlvbihwYXJzZUZsb2F0KG1hdGNoWzFdKSk7XG5cbiAgICAgIHRoaXMuX3JlcGxhY2VUZXh0KFxuICAgICAgICAgIHRlbXBsYXRlLmZpbGVQYXRoLCB0ZW1wbGF0ZS5zdGFydCArIG1hdGNoLmluZGV4ISwgbWF0Y2hbMF0ubGVuZ3RoLFxuICAgICAgICAgIGBbbWF0UmlwcGxlQW5pbWF0aW9uXT1cIntlbnRlckR1cmF0aW9uOiAke25ld0VudGVyRHVyYXRpb259fVwiYCk7XG4gICAgfVxuXG4gICAgd2hpbGUgKChtYXRjaCA9IHNwZWVkRmFjdG9yTm90UGFyc2VhYmxlLmV4ZWModGVtcGxhdGUuY29udGVudCkpICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBuZXdEdXJhdGlvbkV4cHJlc3Npb24gPSBjcmVhdGVTcGVlZEZhY3RvckNvbnZlcnRFeHByZXNzaW9uKG1hdGNoWzFdKTtcbiAgICAgIHRoaXMuX3JlcGxhY2VUZXh0KFxuICAgICAgICAgIHRlbXBsYXRlLmZpbGVQYXRoLCB0ZW1wbGF0ZS5zdGFydCArIG1hdGNoLmluZGV4ISwgbWF0Y2hbMF0ubGVuZ3RoLFxuICAgICAgICAgIGBbbWF0UmlwcGxlQW5pbWF0aW9uXT1cIntlbnRlckR1cmF0aW9uOiAoJHtuZXdEdXJhdGlvbkV4cHJlc3Npb259KX1cImApO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTd2l0Y2hlcyBiaW5hcnkgZXhwcmVzc2lvbnMgKGUuZy4gbXlSaXBwbGUuc3BlZWRGYWN0b3IgPSAwLjUpIHRvIHRoZSBuZXcgYW5pbWF0aW9uIGNvbmZpZy4gKi9cbiAgcHJpdmF0ZSBfdmlzaXRCaW5hcnlFeHByZXNzaW9uKGV4cHJlc3Npb246IHRzLkJpbmFyeUV4cHJlc3Npb24pIHtcbiAgICBpZiAoIXRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKGV4cHJlc3Npb24ubGVmdCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBMZWZ0IHNpZGUgZXhwcmVzc2lvbiBjb25zaXN0cyBvZiB0YXJnZXQgb2JqZWN0IGFuZCBwcm9wZXJ0eSBuYW1lIChlLmcuIG15SW5zdGFuY2UudmFsKVxuICAgIGNvbnN0IGxlZnRFeHByZXNzaW9uID0gZXhwcmVzc2lvbi5sZWZ0IGFzIHRzLlByb3BlcnR5QWNjZXNzRXhwcmVzc2lvbjtcbiAgICBjb25zdCB0YXJnZXRUeXBlTm9kZSA9IHRoaXMudHlwZUNoZWNrZXIuZ2V0VHlwZUF0TG9jYXRpb24obGVmdEV4cHJlc3Npb24uZXhwcmVzc2lvbik7XG5cbiAgICBpZiAoIXRhcmdldFR5cGVOb2RlLnN5bWJvbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRhcmdldFR5cGVOYW1lID0gdGFyZ2V0VHlwZU5vZGUuc3ltYm9sLmdldE5hbWUoKTtcbiAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBsZWZ0RXhwcmVzc2lvbi5uYW1lLmdldFRleHQoKTtcbiAgICBjb25zdCBmaWxlUGF0aCA9IGxlZnRFeHByZXNzaW9uLmdldFNvdXJjZUZpbGUoKS5maWxlTmFtZTtcblxuICAgIGlmICh0YXJnZXRUeXBlTmFtZSA9PT0gJ01hdFJpcHBsZScgJiYgcHJvcGVydHlOYW1lID09PSAnc3BlZWRGYWN0b3InKSB7XG4gICAgICBpZiAodHMuaXNOdW1lcmljTGl0ZXJhbChleHByZXNzaW9uLnJpZ2h0KSkge1xuICAgICAgICBjb25zdCBudW1lcmljVmFsdWUgPSBwYXJzZUZsb2F0KGV4cHJlc3Npb24ucmlnaHQudGV4dCk7XG4gICAgICAgIGNvbnN0IG5ld0VudGVyRHVyYXRpb25WYWx1ZSA9IGNvbnZlcnRTcGVlZEZhY3RvclRvRHVyYXRpb24obnVtZXJpY1ZhbHVlKTtcblxuICAgICAgICAvLyBSZXBsYWNlIHRoZSBgc3BlZWRGYWN0b3JgIHByb3BlcnR5IG5hbWUgd2l0aCBgYW5pbWF0aW9uYC5cbiAgICAgICAgdGhpcy5fcmVwbGFjZVRleHQoXG4gICAgICAgICAgICBmaWxlUGF0aCwgbGVmdEV4cHJlc3Npb24ubmFtZS5nZXRTdGFydCgpLCBsZWZ0RXhwcmVzc2lvbi5uYW1lLmdldFdpZHRoKCksICdhbmltYXRpb24nKTtcblxuICAgICAgICAvLyBSZXBsYWNlIHRoZSB2YWx1ZSBhc3NpZ25tZW50IHdpdGggdGhlIG5ldyBhbmltYXRpb24gY29uZmlnLlxuICAgICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgICAgIGZpbGVQYXRoLCBleHByZXNzaW9uLnJpZ2h0LmdldFN0YXJ0KCksIGV4cHJlc3Npb24ucmlnaHQuZ2V0V2lkdGgoKSxcbiAgICAgICAgICAgIGB7ZW50ZXJEdXJhdGlvbjogJHtuZXdFbnRlckR1cmF0aW9uVmFsdWV9fWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSGFuZGxlIHRoZSByaWdodCBleHByZXNzaW9uIGRpZmZlcmVudGx5IGlmIHRoZSBwcmV2aW91cyBzcGVlZCBmYWN0b3IgdmFsdWUgY2FuJ3RcbiAgICAgICAgLy8gYmUgcmVzb2x2ZWQgc3RhdGljYWxseS4gSW4gdGhhdCBjYXNlLCB3ZSBqdXN0IGNyZWF0ZSBhIFR5cGVTY3JpcHQgZXhwcmVzc2lvbiB0aGF0XG4gICAgICAgIC8vIGNhbGN1bGF0ZXMgdGhlIGV4cGxpY2l0IGR1cmF0aW9uIGJhc2VkIG9uIHRoZSBub24tc3RhdGljIHNwZWVkIGZhY3RvciBleHByZXNzaW9uLlxuICAgICAgICBjb25zdCBuZXdFeHByZXNzaW9uID0gY3JlYXRlU3BlZWRGYWN0b3JDb252ZXJ0RXhwcmVzc2lvbihleHByZXNzaW9uLnJpZ2h0LmdldFRleHQoKSk7XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgYHNwZWVkRmFjdG9yYCBwcm9wZXJ0eSBuYW1lIHdpdGggYGFuaW1hdGlvbmAuXG4gICAgICAgIHRoaXMuX3JlcGxhY2VUZXh0KFxuICAgICAgICAgICAgZmlsZVBhdGgsIGxlZnRFeHByZXNzaW9uLm5hbWUuZ2V0U3RhcnQoKSwgbGVmdEV4cHJlc3Npb24ubmFtZS5nZXRXaWR0aCgpLCAnYW5pbWF0aW9uJyk7XG5cbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgdmFsdWUgYXNzaWdubWVudCB3aXRoIHRoZSBuZXcgYW5pbWF0aW9uIGNvbmZpZyBhbmQgcmVtb3ZlIFRPRE8uXG4gICAgICAgIHRoaXMuX3JlcGxhY2VUZXh0KFxuICAgICAgICAgICAgZmlsZVBhdGgsIGV4cHJlc3Npb24ucmlnaHQuZ2V0U3RhcnQoKSwgZXhwcmVzc2lvbi5yaWdodC5nZXRXaWR0aCgpLFxuICAgICAgICAgICAgYC8qKiAke3JlbW92ZU5vdGV9ICovIHtlbnRlckR1cmF0aW9uOiAke25ld0V4cHJlc3Npb259fWApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTd2l0Y2hlcyB0aGUgZ2xvYmFsIG9wdGlvbiBgYmFzZVNwZWVkRmFjdG9yYCB0byB0aGUgbmV3IGFuaW1hdGlvbiBjb25maWcuIEZvciB0aGlzXG4gICAqIHdlIGFzc3VtZSB0aGF0IHRoZSBgYmFzZVNwZWVkRmFjdG9yYCBpcyBub3QgdXNlZCBpbiBjb21iaW5hdGlvbiB3aXRoIGluZGl2aWR1YWxcbiAgICogc3BlZWQgZmFjdG9ycy5cbiAgICovXG4gIHByaXZhdGUgX3Zpc2l0UHJvcGVydHlBc3NpZ25tZW50KGFzc2lnbm1lbnQ6IHRzLlByb3BlcnR5QXNzaWdubWVudCkge1xuICAgIC8vIEZvciBzd2l0Y2hpbmcgdGhlIGBiYXNlU3BlZWRGYWN0b3JgIGdsb2JhbCBvcHRpb24gd2UgZXhwZWN0IHRoZSBwcm9wZXJ0eSBhc3NpZ25tZW50XG4gICAgLy8gdG8gYmUgaW5zaWRlIG9mIGEgbm9ybWFsIG9iamVjdCBsaXRlcmFsLiBDdXN0b20gcmlwcGxlIGdsb2JhbCBvcHRpb25zIGNhbm5vdCBiZVxuICAgIC8vIHdpdGNoZWQgYXV0b21hdGljYWxseS5cbiAgICBpZiAoIXRzLmlzT2JqZWN0TGl0ZXJhbEV4cHJlc3Npb24oYXNzaWdubWVudC5wYXJlbnQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIGFzc2lnbm1lbnQgY29uc2lzdHMgb2YgYSBuYW1lIChrZXkpIGFuZCBpbml0aWFsaXplciAodmFsdWUpLlxuICAgIGlmIChhc3NpZ25tZW50Lm5hbWUuZ2V0VGV4dCgpICE9PSAnYmFzZVNwZWVkRmFjdG9yJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFdlIGNvdWxkIHRlY2huaWNhbGx5IGxhemlseSBjaGVjayBmb3IgdGhlIE1BVF9SSVBQTEVfR0xPQkFMX09QVElPTlMgaW5qZWN0aW9uIHRva2VuIHRvXG4gICAgLy8gYmUgcHJlc2VudCwgYnV0IGl0J3Mgbm90IHJpZ2h0IHRvIGFzc3VtZSB0aGF0IGV2ZXJ5b25lIHNldHMgdGhlIHJpcHBsZSBnbG9iYWwgb3B0aW9uc1xuICAgIC8vIGltbWVkaWF0ZWx5IGluIHRoZSBwcm92aWRlciBvYmplY3QgKGUuZy4gaXQgY2FuIGhhcHBlbiB0aGF0IHNvbWVvbmUganVzdCBpbXBvcnRzIHRoZVxuICAgIC8vIGNvbmZpZyBmcm9tIGEgc2VwYXJhdGUgZmlsZSkuXG5cbiAgICBjb25zdCB7aW5pdGlhbGl6ZXIsIG5hbWV9ID0gYXNzaWdubWVudDtcbiAgICBjb25zdCBmaWxlUGF0aCA9IGFzc2lnbm1lbnQuZ2V0U291cmNlRmlsZSgpLmZpbGVOYW1lO1xuXG4gICAgaWYgKHRzLmlzTnVtZXJpY0xpdGVyYWwoaW5pdGlhbGl6ZXIpKSB7XG4gICAgICBjb25zdCBudW1lcmljVmFsdWUgPSBwYXJzZUZsb2F0KGluaXRpYWxpemVyLnRleHQpO1xuICAgICAgY29uc3QgbmV3RW50ZXJEdXJhdGlvblZhbHVlID0gY29udmVydFNwZWVkRmFjdG9yVG9EdXJhdGlvbihudW1lcmljVmFsdWUpO1xuXG4gICAgICAvLyBSZXBsYWNlIHRoZSBgYmFzZVNwZWVkRmFjdG9yYCBwcm9wZXJ0eSBuYW1lIHdpdGggYGFuaW1hdGlvbmAuXG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChmaWxlUGF0aCwgbmFtZS5nZXRTdGFydCgpLCBuYW1lLmdldFdpZHRoKCksICdhbmltYXRpb24nKTtcbiAgICAgIC8vIFJlcGxhY2UgdGhlIHZhbHVlIGFzc2lnbm1lbnQgaW5pdGlhbGl6ZXIgd2l0aCB0aGUgbmV3IGFuaW1hdGlvbiBjb25maWcuXG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgICBmaWxlUGF0aCwgaW5pdGlhbGl6ZXIuZ2V0U3RhcnQoKSwgaW5pdGlhbGl6ZXIuZ2V0V2lkdGgoKSxcbiAgICAgICAgICBge2VudGVyRHVyYXRpb246ICR7bmV3RW50ZXJEdXJhdGlvblZhbHVlfX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSGFuZGxlIHRoZSByaWdodCBleHByZXNzaW9uIGRpZmZlcmVudGx5IGlmIHRoZSBwcmV2aW91cyBzcGVlZCBmYWN0b3IgdmFsdWUgY2FuJ3RcbiAgICAgIC8vIGJlIHJlc29sdmVkIHN0YXRpY2FsbHkuIEluIHRoYXQgY2FzZSwgd2UganVzdCBjcmVhdGUgYSBUeXBlU2NyaXB0IGV4cHJlc3Npb24gdGhhdFxuICAgICAgLy8gY2FsY3VsYXRlcyB0aGUgZXhwbGljaXQgZHVyYXRpb24gYmFzZWQgb24gdGhlIG5vbi1zdGF0aWMgc3BlZWQgZmFjdG9yIGV4cHJlc3Npb24uXG4gICAgICBjb25zdCBuZXdFeHByZXNzaW9uID0gY3JlYXRlU3BlZWRGYWN0b3JDb252ZXJ0RXhwcmVzc2lvbihpbml0aWFsaXplci5nZXRUZXh0KCkpO1xuXG4gICAgICAvLyBSZXBsYWNlIHRoZSBgYmFzZVNwZWVkRmFjdG9yYCBwcm9wZXJ0eSBuYW1lIHdpdGggYGFuaW1hdGlvbmAuXG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChmaWxlUGF0aCwgbmFtZS5nZXRTdGFydCgpLCBuYW1lLmdldFdpZHRoKCksICdhbmltYXRpb24nKTtcblxuICAgICAgLy8gUmVwbGFjZSB0aGUgdmFsdWUgYXNzaWdubWVudCB3aXRoIHRoZSBuZXcgYW5pbWF0aW9uIGNvbmZpZyBhbmQgcmVtb3ZlIFRPRE8uXG4gICAgICB0aGlzLl9yZXBsYWNlVGV4dChcbiAgICAgICAgICBmaWxlUGF0aCwgaW5pdGlhbGl6ZXIuZ2V0U3RhcnQoKSwgaW5pdGlhbGl6ZXIuZ2V0V2lkdGgoKSxcbiAgICAgICAgICBgLyoqICR7cmVtb3ZlTm90ZX0gKi8ge2VudGVyRHVyYXRpb246ICR7bmV3RXhwcmVzc2lvbn19YCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcmVwbGFjZVRleHQoZmlsZVBhdGg6IHN0cmluZywgc3RhcnQ6IG51bWJlciwgd2lkdGg6IG51bWJlciwgbmV3VGV4dDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVjb3JkZXIgPSB0aGlzLmZpbGVTeXN0ZW0uZWRpdChmaWxlUGF0aCk7XG4gICAgcmVjb3JkZXIucmVtb3ZlKHN0YXJ0LCB3aWR0aCk7XG4gICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQoc3RhcnQsIG5ld1RleHQpO1xuICB9XG59XG4iXX0=
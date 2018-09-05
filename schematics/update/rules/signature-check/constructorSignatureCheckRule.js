"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const tslint_1 = require("tslint");
const ts = require("typescript");
const constructor_checks_1 = require("../../material/data/constructor-checks");
/**
 * Rule that visits every TypeScript new expression or super call and checks if the parameter
 * type signature is invalid and needs to be updated manually.
 */
class Rule extends tslint_1.Rules.TypedRule {
    applyWithProgram(sourceFile, program) {
        return this.applyWithWalker(new Walker(sourceFile, this.getOptions(), program));
    }
}
exports.Rule = Rule;
class Walker extends tslint_1.ProgramAwareRuleWalker {
    visitNewExpression(node) {
        this.checkExpressionSignature(node);
        super.visitNewExpression(node);
    }
    visitCallExpression(node) {
        if (node.expression.kind === ts.SyntaxKind.SuperKeyword) {
            this.checkExpressionSignature(node);
        }
        return super.visitCallExpression(node);
    }
    getParameterTypesFromSignature(signature) {
        return signature.getParameters()
            .map(param => param.declarations[0])
            .map(node => node.type)
            .map(node => this.getTypeChecker().getTypeFromTypeNode(node));
    }
    checkExpressionSignature(node) {
        const classType = this.getTypeChecker().getTypeAtLocation(node.expression);
        const className = classType.symbol && classType.symbol.name;
        const isNewExpression = ts.isNewExpression(node);
        // TODO(devversion): Consider handling pass-through classes better.
        // TODO(devversion): e.g. `export class CustomCalendar extends MatCalendar {}`
        if (!classType || !constructor_checks_1.constructorChecks.includes(className)) {
            return;
        }
        const callExpressionSignature = node.arguments
            .map(argument => this.getTypeChecker().getTypeAtLocation(argument));
        const classSignatures = classType.getConstructSignatures()
            .map(signature => this.getParameterTypesFromSignature(signature));
        // TODO(devversion): we should check if the type is assignable to the signature
        // TODO(devversion): blocked on https://github.com/Microsoft/TypeScript/issues/9879
        const doesMatchSignature = classSignatures.some(signature => {
            return signature.every((type, index) => callExpressionSignature[index] === type) &&
                signature.length === callExpressionSignature.length;
        });
        if (!doesMatchSignature) {
            const expressionName = isNewExpression ? `new ${className}` : 'super';
            const signatures = classSignatures
                .map(signature => signature.map(t => this.getTypeChecker().typeToString(t)))
                .map(signature => `${expressionName}(${signature.join(', ')})`)
                .join(' or ');
            this.addFailureAtNode(node, `Found "${chalk_1.bold(className)}" constructed with ` +
                `an invalid signature. Please manually update the ${chalk_1.bold(expressionName)} expression to ` +
                `match the new signature${classSignatures.length > 1 ? 's' : ''}: ${chalk_1.green(signatures)}`);
        }
    }
}
exports.Walker = Walker;
//# sourceMappingURL=constructorSignatureCheckRule.js.map
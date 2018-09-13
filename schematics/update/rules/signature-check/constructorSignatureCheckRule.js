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
 * List of diagnostic codes that refer to pre-emit diagnostics which indicate invalid
 * new expression or super call signatures. See the list of diagnostics here:
 *
 * https://github.com/Microsoft/TypeScript/blob/master/src/compiler/diagnosticMessages.json
 */
const signatureErrorDiagnostics = [
    // Type not assignable error diagnostic.
    2345,
    // Constructor argument length invalid diagnostics
    2554, 2555, 2556, 2557,
];
/**
 * Rule that visits every TypeScript new expression or super call and checks if the parameter
 * type signature is invalid and needs to be updated manually.
 */
class Rule extends tslint_1.Rules.TypedRule {
    applyWithProgram(sourceFile, program) {
        return this.applyWithFunction(sourceFile, visitSourceFile, null, program);
    }
}
exports.Rule = Rule;
/**
 * Function that will be called for each source file of the upgrade project. In order to properly
 * determine invalid constructor signatures, we take advantage of the pre-emit diagnostics from
 * TypeScript.
 *
 * By using the diagnostics we can properly respect type assignability because otherwise we
 * would need to rely on type equality checking which is too strict.
 * See related issue: https://github.com/Microsoft/TypeScript/issues/9879
 */
function visitSourceFile(context, program) {
    const sourceFile = context.sourceFile;
    const diagnostics = ts.getPreEmitDiagnostics(program, sourceFile)
        .filter(diagnostic => signatureErrorDiagnostics.includes(diagnostic.code))
        .filter(diagnostic => diagnostic.start !== undefined);
    for (const diagnostic of diagnostics) {
        const node = findConstructorNode(diagnostic, sourceFile);
        if (!node) {
            continue;
        }
        const classType = program.getTypeChecker().getTypeAtLocation(node.expression);
        const className = classType.symbol && classType.symbol.name;
        const isNewExpression = ts.isNewExpression(node);
        // TODO(devversion): Consider handling pass-through classes better.
        // TODO(devversion): e.g. `export class CustomCalendar extends MatCalendar {}`
        if (!constructor_checks_1.constructorChecks.includes(className)) {
            continue;
        }
        const classSignatures = classType.getConstructSignatures()
            .map(signature => getParameterTypesFromSignature(signature, program));
        const expressionName = isNewExpression ? `new ${className}` : 'super';
        const signatures = classSignatures
            .map(signature => signature.map(t => program.getTypeChecker().typeToString(t)))
            .map(signature => `${expressionName}(${signature.join(', ')})`)
            .join(' or ');
        context.addFailureAtNode(node, `Found "${chalk_1.bold(className)}" constructed with ` +
            `an invalid signature. Please manually update the ${chalk_1.bold(expressionName)} expression to ` +
            `match the new signature${classSignatures.length > 1 ? 's' : ''}: ${chalk_1.green(signatures)}`);
    }
}
/** Resolves the type for each parameter in the specified signature. */
function getParameterTypesFromSignature(signature, program) {
    return signature.getParameters()
        .map(param => param.declarations[0])
        .map(node => node.type)
        .map(typeNode => program.getTypeChecker().getTypeFromTypeNode(typeNode));
}
/**
 * Walks through each node of a source file in order to find a new-expression node or super-call
 * expression node that is captured by the specified diagnostic.
 */
function findConstructorNode(diagnostic, sourceFile) {
    let resolvedNode = null;
    const _visitNode = (node) => {
        // Check whether the current node contains the diagnostic. If the node contains the diagnostic,
        // walk deeper in order to find all constructor expression nodes.
        if (node.getStart() <= diagnostic.start && node.getEnd() >= diagnostic.start) {
            if (ts.isNewExpression(node) ||
                (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.SuperKeyword)) {
                resolvedNode = node;
            }
            ts.forEachChild(node, _visitNode);
        }
    };
    ts.forEachChild(sourceFile, _visitNode);
    return resolvedNode;
}
//# sourceMappingURL=constructorSignatureCheckRule.js.map
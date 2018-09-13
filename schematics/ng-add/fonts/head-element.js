"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const parse5_1 = require("parse5");
const parse5_element_1 = require("../../utils/parse5-element");
const project_index_html_1 = require("./project-index-html");
/** Appends the given element HTML fragment to the index.html head tag. */
function appendElementToHead(host, project, elementHtml) {
    const indexPath = project_index_html_1.getIndexHtmlPath(project);
    const indexHtmlBuffer = host.read(indexPath);
    if (!indexHtmlBuffer) {
        throw new schematics_1.SchematicsException(`Could not find file for path: ${indexPath}`);
    }
    const htmlContent = indexHtmlBuffer.toString();
    if (htmlContent.includes(elementHtml)) {
        return;
    }
    const headTag = getHeadTagElement(htmlContent);
    if (!headTag) {
        throw `Could not find '<head>' element in HTML file: ${indexPath}`;
    }
    // We always have access to the source code location here because the `getHeadTagElement`
    // function explicitly has the `sourceCodeLocationInfo` option enabled.
    const endTagOffset = headTag.sourceCodeLocation.endTag.startOffset;
    const indentationOffset = parse5_element_1.getChildElementIndentation(headTag);
    const insertion = `${' '.repeat(indentationOffset)}${elementHtml}`;
    const recordedChange = host
        .beginUpdate(indexPath)
        .insertRight(endTagOffset, `${insertion}\n`);
    host.commitUpdate(recordedChange);
}
exports.appendElementToHead = appendElementToHead;
/** Parses the given HTML file and returns the head element if available. */
function getHeadTagElement(src) {
    const document = parse5_1.parse(src, { sourceCodeLocationInfo: true });
    const nodeQueue = [...document.childNodes];
    while (nodeQueue.length) {
        const node = nodeQueue.shift();
        if (node.nodeName.toLowerCase() === 'head') {
            return node;
        }
        else if (node.childNodes) {
            nodeQueue.push(...node.childNodes);
        }
    }
    return null;
}
exports.getHeadTagElement = getHeadTagElement;
//# sourceMappingURL=head-element.js.map
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
        define("@angular/material/schematics/ng-update/migrations/hammer-gestures-v9/remove-element-from-html", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Removes the specified element. Additionally, preceding whitespace will be removed
     * to not leave empty lines in the resulting HTML.
     */
    function removeElementFromHtml(element, recorder) {
        // sourceCodeLocation is always set since we parse with location info enabled.
        const { startOffset, endOffset } = element.sourceCodeLocation;
        const parentIndex = element.parentNode.childNodes.indexOf(element);
        const precedingTextSibling = element.parentNode.childNodes.find((f, i) => f.nodeName === '#text' && i === parentIndex - 1);
        recorder.remove(startOffset, endOffset - startOffset);
        // If we found a preceding text node which just consists of whitespace, remove it.
        if (precedingTextSibling && /^\s+$/.test(precedingTextSibling.value)) {
            const textSiblingLocation = precedingTextSibling.sourceCodeLocation;
            recorder.remove(textSiblingLocation.startOffset, textSiblingLocation.endOffset - textSiblingLocation.startOffset);
        }
    }
    exports.removeElementFromHtml = removeElementFromHtml;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3ZlLWVsZW1lbnQtZnJvbS1odG1sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvaGFtbWVyLWdlc3R1cmVzLXY5L3JlbW92ZS1lbGVtZW50LWZyb20taHRtbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUtIOzs7T0FHRztJQUNILFNBQWdCLHFCQUFxQixDQUNqQyxPQUFrQyxFQUFFLFFBQXdCO1FBQzlELDhFQUE4RTtRQUM5RSxNQUFNLEVBQUMsV0FBVyxFQUFFLFNBQVMsRUFBQyxHQUFHLE9BQU8sQ0FBQyxrQkFBbUIsQ0FBQztRQUM3RCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbkUsTUFBTSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQzNELENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBbUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsS0FBSyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFaEcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsU0FBUyxHQUFHLFdBQVcsQ0FBQyxDQUFDO1FBRXRELGtGQUFrRjtRQUNsRixJQUFJLG9CQUFvQixJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDcEUsTUFBTSxtQkFBbUIsR0FBRyxvQkFBb0IsQ0FBQyxrQkFBbUIsQ0FBQztZQUNyRSxRQUFRLENBQUMsTUFBTSxDQUNYLG1CQUFtQixDQUFDLFdBQVcsRUFDL0IsbUJBQW1CLENBQUMsU0FBUyxHQUFHLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3RFO0lBQ0gsQ0FBQztJQWpCRCxzREFpQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtVcGRhdGVSZWNvcmRlcn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtwYXJzZTV9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBzcGVjaWZpZWQgZWxlbWVudC4gQWRkaXRpb25hbGx5LCBwcmVjZWRpbmcgd2hpdGVzcGFjZSB3aWxsIGJlIHJlbW92ZWRcbiAqIHRvIG5vdCBsZWF2ZSBlbXB0eSBsaW5lcyBpbiB0aGUgcmVzdWx0aW5nIEhUTUwuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVFbGVtZW50RnJvbUh0bWwoXG4gICAgZWxlbWVudDogcGFyc2U1LkRlZmF1bHRUcmVlRWxlbWVudCwgcmVjb3JkZXI6IFVwZGF0ZVJlY29yZGVyKSB7XG4gIC8vIHNvdXJjZUNvZGVMb2NhdGlvbiBpcyBhbHdheXMgc2V0IHNpbmNlIHdlIHBhcnNlIHdpdGggbG9jYXRpb24gaW5mbyBlbmFibGVkLlxuICBjb25zdCB7c3RhcnRPZmZzZXQsIGVuZE9mZnNldH0gPSBlbGVtZW50LnNvdXJjZUNvZGVMb2NhdGlvbiE7XG4gIGNvbnN0IHBhcmVudEluZGV4ID0gZWxlbWVudC5wYXJlbnROb2RlLmNoaWxkTm9kZXMuaW5kZXhPZihlbGVtZW50KTtcbiAgY29uc3QgcHJlY2VkaW5nVGV4dFNpYmxpbmcgPSBlbGVtZW50LnBhcmVudE5vZGUuY2hpbGROb2Rlcy5maW5kKFxuICAgICAgKGYsIGkpOiBmIGlzIHBhcnNlNS5EZWZhdWx0VHJlZVRleHROb2RlID0+IGYubm9kZU5hbWUgPT09ICcjdGV4dCcgJiYgaSA9PT0gcGFyZW50SW5kZXggLSAxKTtcblxuICByZWNvcmRlci5yZW1vdmUoc3RhcnRPZmZzZXQsIGVuZE9mZnNldCAtIHN0YXJ0T2Zmc2V0KTtcblxuICAvLyBJZiB3ZSBmb3VuZCBhIHByZWNlZGluZyB0ZXh0IG5vZGUgd2hpY2gganVzdCBjb25zaXN0cyBvZiB3aGl0ZXNwYWNlLCByZW1vdmUgaXQuXG4gIGlmIChwcmVjZWRpbmdUZXh0U2libGluZyAmJiAvXlxccyskLy50ZXN0KHByZWNlZGluZ1RleHRTaWJsaW5nLnZhbHVlKSkge1xuICAgIGNvbnN0IHRleHRTaWJsaW5nTG9jYXRpb24gPSBwcmVjZWRpbmdUZXh0U2libGluZy5zb3VyY2VDb2RlTG9jYXRpb24hO1xuICAgIHJlY29yZGVyLnJlbW92ZShcbiAgICAgICAgdGV4dFNpYmxpbmdMb2NhdGlvbi5zdGFydE9mZnNldCxcbiAgICAgICAgdGV4dFNpYmxpbmdMb2NhdGlvbi5lbmRPZmZzZXQgLSB0ZXh0U2libGluZ0xvY2F0aW9uLnN0YXJ0T2Zmc2V0KTtcbiAgfVxufVxuIl19
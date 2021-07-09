"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHammerJsUsedInTemplate = void 0;
const schematics_1 = require("@angular/cdk/schematics");
/** List of known events which are supported by the "HammerGesturesPlugin". */
const STANDARD_HAMMERJS_EVENTS = [
    // Events supported by the "HammerGesturesPlugin". See:
    // angular/angular/blob/0119f46d/packages/platform-browser/src/dom/events/hammer_gestures.ts#L19
    'pan', 'panstart', 'panmove', 'panend', 'pancancel', 'panleft',
    'panright', 'panup', 'pandown', 'pinch', 'pinchstart', 'pinchmove',
    'pinchend', 'pinchcancel', 'pinchin', 'pinchout', 'press', 'pressup',
    'rotate', 'rotatestart', 'rotatemove', 'rotateend', 'rotatecancel', 'swipe',
    'swipeleft', 'swiperight', 'swipeup', 'swipedown', 'tap',
];
/** List of events which are provided by the deprecated Angular Material "GestureConfig". */
const CUSTOM_MATERIAL_HAMMERJS_EVENS = ['longpress', 'slide', 'slidestart', 'slideend', 'slideright', 'slideleft'];
/**
 * Parses the specified HTML and searches for elements with Angular outputs listening to
 * one of the known HammerJS events. This check naively assumes that the bindings never
 * match on a component output, but only on the Hammer plugin.
 */
function isHammerJsUsedInTemplate(html) {
    const document = schematics_1.parse5.parseFragment(html, { sourceCodeLocationInfo: true });
    let customEvents = false;
    let standardEvents = false;
    const visitNodes = (nodes) => {
        nodes.forEach(node => {
            if (!isElement(node)) {
                return;
            }
            for (let attr of node.attrs) {
                if (!customEvents && CUSTOM_MATERIAL_HAMMERJS_EVENS.some(e => `(${e})` === attr.name)) {
                    customEvents = true;
                }
                if (!standardEvents && STANDARD_HAMMERJS_EVENTS.some(e => `(${e})` === attr.name)) {
                    standardEvents = true;
                }
            }
            // Do not continue traversing the AST if both type of HammerJS
            // usages have been detected already.
            if (!customEvents || !standardEvents) {
                visitNodes(node.childNodes);
            }
        });
    };
    visitNodes(document.childNodes);
    return { customEvents, standardEvents };
}
exports.isHammerJsUsedInTemplate = isHammerJsUsedInTemplate;
function isElement(node) {
    return !!node.attrs;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLXRlbXBsYXRlLWNoZWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvaGFtbWVyLWdlc3R1cmVzLXY5L2hhbW1lci10ZW1wbGF0ZS1jaGVjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCx3REFBK0M7QUFFL0MsOEVBQThFO0FBQzlFLE1BQU0sd0JBQXdCLEdBQUc7SUFDL0IsdURBQXVEO0lBQ3ZELGdHQUFnRztJQUNoRyxLQUFLLEVBQVEsVUFBVSxFQUFLLFNBQVMsRUFBSyxRQUFRLEVBQUssV0FBVyxFQUFLLFNBQVM7SUFDaEYsVUFBVSxFQUFHLE9BQU8sRUFBUSxTQUFTLEVBQUssT0FBTyxFQUFNLFlBQVksRUFBSSxXQUFXO0lBQ2xGLFVBQVUsRUFBRyxhQUFhLEVBQUUsU0FBUyxFQUFLLFVBQVUsRUFBRyxPQUFPLEVBQVMsU0FBUztJQUNoRixRQUFRLEVBQUssYUFBYSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLE9BQU87SUFDOUUsV0FBVyxFQUFFLFlBQVksRUFBRyxTQUFTLEVBQUssV0FBVyxFQUFFLEtBQUs7Q0FDN0QsQ0FBQztBQUVGLDRGQUE0RjtBQUM1RixNQUFNLDhCQUE4QixHQUNoQyxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFFaEY7Ozs7R0FJRztBQUNILFNBQWdCLHdCQUF3QixDQUFDLElBQVk7SUFFbkQsTUFBTSxRQUFRLEdBQUcsbUJBQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEVBQUMsc0JBQXNCLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUM1RSxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDekIsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO0lBQzNCLE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBeUIsRUFBRSxFQUFFO1FBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDcEIsT0FBTzthQUNSO1lBRUQsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUMzQixJQUFJLENBQUMsWUFBWSxJQUFJLDhCQUE4QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNyRixZQUFZLEdBQUcsSUFBSSxDQUFDO2lCQUNyQjtnQkFDRCxJQUFJLENBQUMsY0FBYyxJQUFJLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNqRixjQUFjLEdBQUcsSUFBSSxDQUFDO2lCQUN2QjthQUNGO1lBRUQsOERBQThEO1lBQzlELHFDQUFxQztZQUNyQyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUNwQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQzdCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7SUFDRixVQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hDLE9BQU8sRUFBQyxZQUFZLEVBQUUsY0FBYyxFQUFDLENBQUM7QUFDeEMsQ0FBQztBQTdCRCw0REE2QkM7QUFFRCxTQUFTLFNBQVMsQ0FBQyxJQUFTO0lBQzFCLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDdEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3BhcnNlNX0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuXG4vKiogTGlzdCBvZiBrbm93biBldmVudHMgd2hpY2ggYXJlIHN1cHBvcnRlZCBieSB0aGUgXCJIYW1tZXJHZXN0dXJlc1BsdWdpblwiLiAqL1xuY29uc3QgU1RBTkRBUkRfSEFNTUVSSlNfRVZFTlRTID0gW1xuICAvLyBFdmVudHMgc3VwcG9ydGVkIGJ5IHRoZSBcIkhhbW1lckdlc3R1cmVzUGx1Z2luXCIuIFNlZTpcbiAgLy8gYW5ndWxhci9hbmd1bGFyL2Jsb2IvMDExOWY0NmQvcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9zcmMvZG9tL2V2ZW50cy9oYW1tZXJfZ2VzdHVyZXMudHMjTDE5XG4gICdwYW4nLCAgICAgICAncGFuc3RhcnQnLCAgICAncGFubW92ZScsICAgICdwYW5lbmQnLCAgICAncGFuY2FuY2VsJywgICAgJ3BhbmxlZnQnLFxuICAncGFucmlnaHQnLCAgJ3BhbnVwJywgICAgICAgJ3BhbmRvd24nLCAgICAncGluY2gnLCAgICAgJ3BpbmNoc3RhcnQnLCAgICdwaW5jaG1vdmUnLFxuICAncGluY2hlbmQnLCAgJ3BpbmNoY2FuY2VsJywgJ3BpbmNoaW4nLCAgICAncGluY2hvdXQnLCAgJ3ByZXNzJywgICAgICAgICdwcmVzc3VwJyxcbiAgJ3JvdGF0ZScsICAgICdyb3RhdGVzdGFydCcsICdyb3RhdGVtb3ZlJywgJ3JvdGF0ZWVuZCcsICdyb3RhdGVjYW5jZWwnLCAnc3dpcGUnLFxuICAnc3dpcGVsZWZ0JywgJ3N3aXBlcmlnaHQnLCAgJ3N3aXBldXAnLCAgICAnc3dpcGVkb3duJywgJ3RhcCcsXG5dO1xuXG4vKiogTGlzdCBvZiBldmVudHMgd2hpY2ggYXJlIHByb3ZpZGVkIGJ5IHRoZSBkZXByZWNhdGVkIEFuZ3VsYXIgTWF0ZXJpYWwgXCJHZXN0dXJlQ29uZmlnXCIuICovXG5jb25zdCBDVVNUT01fTUFURVJJQUxfSEFNTUVSSlNfRVZFTlMgPVxuICAgIFsnbG9uZ3ByZXNzJywgJ3NsaWRlJywgJ3NsaWRlc3RhcnQnLCAnc2xpZGVlbmQnLCAnc2xpZGVyaWdodCcsICdzbGlkZWxlZnQnXTtcblxuLyoqXG4gKiBQYXJzZXMgdGhlIHNwZWNpZmllZCBIVE1MIGFuZCBzZWFyY2hlcyBmb3IgZWxlbWVudHMgd2l0aCBBbmd1bGFyIG91dHB1dHMgbGlzdGVuaW5nIHRvXG4gKiBvbmUgb2YgdGhlIGtub3duIEhhbW1lckpTIGV2ZW50cy4gVGhpcyBjaGVjayBuYWl2ZWx5IGFzc3VtZXMgdGhhdCB0aGUgYmluZGluZ3MgbmV2ZXJcbiAqIG1hdGNoIG9uIGEgY29tcG9uZW50IG91dHB1dCwgYnV0IG9ubHkgb24gdGhlIEhhbW1lciBwbHVnaW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0hhbW1lckpzVXNlZEluVGVtcGxhdGUoaHRtbDogc3RyaW5nKTpcbiAgICB7c3RhbmRhcmRFdmVudHM6IGJvb2xlYW4sIGN1c3RvbUV2ZW50czogYm9vbGVhbn0ge1xuICBjb25zdCBkb2N1bWVudCA9IHBhcnNlNS5wYXJzZUZyYWdtZW50KGh0bWwsIHtzb3VyY2VDb2RlTG9jYXRpb25JbmZvOiB0cnVlfSk7XG4gIGxldCBjdXN0b21FdmVudHMgPSBmYWxzZTtcbiAgbGV0IHN0YW5kYXJkRXZlbnRzID0gZmFsc2U7XG4gIGNvbnN0IHZpc2l0Tm9kZXMgPSAobm9kZXM6IHBhcnNlNS5DaGlsZE5vZGVbXSkgPT4ge1xuICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICBpZiAoIWlzRWxlbWVudChub2RlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGF0dHIgb2Ygbm9kZS5hdHRycykge1xuICAgICAgICBpZiAoIWN1c3RvbUV2ZW50cyAmJiBDVVNUT01fTUFURVJJQUxfSEFNTUVSSlNfRVZFTlMuc29tZShlID0+IGAoJHtlfSlgID09PSBhdHRyLm5hbWUpKSB7XG4gICAgICAgICAgY3VzdG9tRXZlbnRzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXN0YW5kYXJkRXZlbnRzICYmIFNUQU5EQVJEX0hBTU1FUkpTX0VWRU5UUy5zb21lKGUgPT4gYCgke2V9KWAgPT09IGF0dHIubmFtZSkpIHtcbiAgICAgICAgICBzdGFuZGFyZEV2ZW50cyA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gRG8gbm90IGNvbnRpbnVlIHRyYXZlcnNpbmcgdGhlIEFTVCBpZiBib3RoIHR5cGUgb2YgSGFtbWVySlNcbiAgICAgIC8vIHVzYWdlcyBoYXZlIGJlZW4gZGV0ZWN0ZWQgYWxyZWFkeS5cbiAgICAgIGlmICghY3VzdG9tRXZlbnRzIHx8ICFzdGFuZGFyZEV2ZW50cykge1xuICAgICAgICB2aXNpdE5vZGVzKG5vZGUuY2hpbGROb2Rlcyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIHZpc2l0Tm9kZXMoZG9jdW1lbnQuY2hpbGROb2Rlcyk7XG4gIHJldHVybiB7Y3VzdG9tRXZlbnRzLCBzdGFuZGFyZEV2ZW50c307XG59XG5cbmZ1bmN0aW9uIGlzRWxlbWVudChub2RlOiBhbnkpOiBub2RlIGlzIHBhcnNlNS5FbGVtZW50IHtcbiAgcmV0dXJuICEhbm9kZS5hdHRycztcbn1cbiJdfQ==
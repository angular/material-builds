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
        nodes.forEach((node) => {
            if (node.attrs) {
                for (let attr of node.attrs) {
                    if (!customEvents && CUSTOM_MATERIAL_HAMMERJS_EVENS.some(e => `(${e})` === attr.name)) {
                        customEvents = true;
                    }
                    if (!standardEvents && STANDARD_HAMMERJS_EVENTS.some(e => `(${e})` === attr.name)) {
                        standardEvents = true;
                    }
                }
            }
            // Do not continue traversing the AST if both type of HammerJS
            // usages have been detected already.
            if (node.childNodes && (!customEvents || !standardEvents)) {
                visitNodes(node.childNodes);
            }
        });
    };
    visitNodes(document.childNodes);
    return { customEvents, standardEvents };
}
exports.isHammerJsUsedInTemplate = isHammerJsUsedInTemplate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyLXRlbXBsYXRlLWNoZWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctdXBkYXRlL21pZ3JhdGlvbnMvaGFtbWVyLWdlc3R1cmVzLXY5L2hhbW1lci10ZW1wbGF0ZS1jaGVjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCx3REFBK0M7QUFFL0MsOEVBQThFO0FBQzlFLE1BQU0sd0JBQXdCLEdBQUc7SUFDL0IsdURBQXVEO0lBQ3ZELGdHQUFnRztJQUNoRyxLQUFLLEVBQVEsVUFBVSxFQUFLLFNBQVMsRUFBSyxRQUFRLEVBQUssV0FBVyxFQUFLLFNBQVM7SUFDaEYsVUFBVSxFQUFHLE9BQU8sRUFBUSxTQUFTLEVBQUssT0FBTyxFQUFNLFlBQVksRUFBSSxXQUFXO0lBQ2xGLFVBQVUsRUFBRyxhQUFhLEVBQUUsU0FBUyxFQUFLLFVBQVUsRUFBRyxPQUFPLEVBQVMsU0FBUztJQUNoRixRQUFRLEVBQUssYUFBYSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLE9BQU87SUFDOUUsV0FBVyxFQUFFLFlBQVksRUFBRyxTQUFTLEVBQUssV0FBVyxFQUFFLEtBQUs7Q0FDN0QsQ0FBQztBQUVGLDRGQUE0RjtBQUM1RixNQUFNLDhCQUE4QixHQUNoQyxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFFaEY7Ozs7R0FJRztBQUNILFNBQWdCLHdCQUF3QixDQUFDLElBQVk7SUFFbkQsTUFBTSxRQUFRLEdBQUcsbUJBQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLEVBQUMsc0JBQXNCLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUM1RSxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDekIsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO0lBQzNCLE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBeUIsRUFBRSxFQUFFO1FBQy9DLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFvQixFQUFFLEVBQUU7WUFDckMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNkLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtvQkFDM0IsSUFBSSxDQUFDLFlBQVksSUFBSSw4QkFBOEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDckYsWUFBWSxHQUFHLElBQUksQ0FBQztxQkFDckI7b0JBQ0QsSUFBSSxDQUFDLGNBQWMsSUFBSSx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTt3QkFDakYsY0FBYyxHQUFHLElBQUksQ0FBQztxQkFDdkI7aUJBQ0Y7YUFDRjtZQUVELDhEQUE4RDtZQUM5RCxxQ0FBcUM7WUFDckMsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxZQUFZLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRTtnQkFDekQsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUM3QjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0lBQ0YsVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoQyxPQUFPLEVBQUMsWUFBWSxFQUFFLGNBQWMsRUFBQyxDQUFDO0FBQ3hDLENBQUM7QUEzQkQsNERBMkJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7cGFyc2U1fSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5cbi8qKiBMaXN0IG9mIGtub3duIGV2ZW50cyB3aGljaCBhcmUgc3VwcG9ydGVkIGJ5IHRoZSBcIkhhbW1lckdlc3R1cmVzUGx1Z2luXCIuICovXG5jb25zdCBTVEFOREFSRF9IQU1NRVJKU19FVkVOVFMgPSBbXG4gIC8vIEV2ZW50cyBzdXBwb3J0ZWQgYnkgdGhlIFwiSGFtbWVyR2VzdHVyZXNQbHVnaW5cIi4gU2VlOlxuICAvLyBhbmd1bGFyL2FuZ3VsYXIvYmxvYi8wMTE5ZjQ2ZC9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9kb20vZXZlbnRzL2hhbW1lcl9nZXN0dXJlcy50cyNMMTlcbiAgJ3BhbicsICAgICAgICdwYW5zdGFydCcsICAgICdwYW5tb3ZlJywgICAgJ3BhbmVuZCcsICAgICdwYW5jYW5jZWwnLCAgICAncGFubGVmdCcsXG4gICdwYW5yaWdodCcsICAncGFudXAnLCAgICAgICAncGFuZG93bicsICAgICdwaW5jaCcsICAgICAncGluY2hzdGFydCcsICAgJ3BpbmNobW92ZScsXG4gICdwaW5jaGVuZCcsICAncGluY2hjYW5jZWwnLCAncGluY2hpbicsICAgICdwaW5jaG91dCcsICAncHJlc3MnLCAgICAgICAgJ3ByZXNzdXAnLFxuICAncm90YXRlJywgICAgJ3JvdGF0ZXN0YXJ0JywgJ3JvdGF0ZW1vdmUnLCAncm90YXRlZW5kJywgJ3JvdGF0ZWNhbmNlbCcsICdzd2lwZScsXG4gICdzd2lwZWxlZnQnLCAnc3dpcGVyaWdodCcsICAnc3dpcGV1cCcsICAgICdzd2lwZWRvd24nLCAndGFwJyxcbl07XG5cbi8qKiBMaXN0IG9mIGV2ZW50cyB3aGljaCBhcmUgcHJvdmlkZWQgYnkgdGhlIGRlcHJlY2F0ZWQgQW5ndWxhciBNYXRlcmlhbCBcIkdlc3R1cmVDb25maWdcIi4gKi9cbmNvbnN0IENVU1RPTV9NQVRFUklBTF9IQU1NRVJKU19FVkVOUyA9XG4gICAgWydsb25ncHJlc3MnLCAnc2xpZGUnLCAnc2xpZGVzdGFydCcsICdzbGlkZWVuZCcsICdzbGlkZXJpZ2h0JywgJ3NsaWRlbGVmdCddO1xuXG4vKipcbiAqIFBhcnNlcyB0aGUgc3BlY2lmaWVkIEhUTUwgYW5kIHNlYXJjaGVzIGZvciBlbGVtZW50cyB3aXRoIEFuZ3VsYXIgb3V0cHV0cyBsaXN0ZW5pbmcgdG9cbiAqIG9uZSBvZiB0aGUga25vd24gSGFtbWVySlMgZXZlbnRzLiBUaGlzIGNoZWNrIG5haXZlbHkgYXNzdW1lcyB0aGF0IHRoZSBiaW5kaW5ncyBuZXZlclxuICogbWF0Y2ggb24gYSBjb21wb25lbnQgb3V0cHV0LCBidXQgb25seSBvbiB0aGUgSGFtbWVyIHBsdWdpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSGFtbWVySnNVc2VkSW5UZW1wbGF0ZShodG1sOiBzdHJpbmcpOlxuICAgIHtzdGFuZGFyZEV2ZW50czogYm9vbGVhbiwgY3VzdG9tRXZlbnRzOiBib29sZWFufSB7XG4gIGNvbnN0IGRvY3VtZW50ID0gcGFyc2U1LnBhcnNlRnJhZ21lbnQoaHRtbCwge3NvdXJjZUNvZGVMb2NhdGlvbkluZm86IHRydWV9KTtcbiAgbGV0IGN1c3RvbUV2ZW50cyA9IGZhbHNlO1xuICBsZXQgc3RhbmRhcmRFdmVudHMgPSBmYWxzZTtcbiAgY29uc3QgdmlzaXROb2RlcyA9IChub2RlczogcGFyc2U1LkNoaWxkTm9kZVtdKSA9PiB7XG4gICAgbm9kZXMuZm9yRWFjaCgobm9kZTogcGFyc2U1LkVsZW1lbnQpID0+IHtcbiAgICAgIGlmIChub2RlLmF0dHJzKSB7XG4gICAgICAgIGZvciAobGV0IGF0dHIgb2Ygbm9kZS5hdHRycykge1xuICAgICAgICAgIGlmICghY3VzdG9tRXZlbnRzICYmIENVU1RPTV9NQVRFUklBTF9IQU1NRVJKU19FVkVOUy5zb21lKGUgPT4gYCgke2V9KWAgPT09IGF0dHIubmFtZSkpIHtcbiAgICAgICAgICAgIGN1c3RvbUV2ZW50cyA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghc3RhbmRhcmRFdmVudHMgJiYgU1RBTkRBUkRfSEFNTUVSSlNfRVZFTlRTLnNvbWUoZSA9PiBgKCR7ZX0pYCA9PT0gYXR0ci5uYW1lKSkge1xuICAgICAgICAgICAgc3RhbmRhcmRFdmVudHMgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBEbyBub3QgY29udGludWUgdHJhdmVyc2luZyB0aGUgQVNUIGlmIGJvdGggdHlwZSBvZiBIYW1tZXJKU1xuICAgICAgLy8gdXNhZ2VzIGhhdmUgYmVlbiBkZXRlY3RlZCBhbHJlYWR5LlxuICAgICAgaWYgKG5vZGUuY2hpbGROb2RlcyAmJiAoIWN1c3RvbUV2ZW50cyB8fCAhc3RhbmRhcmRFdmVudHMpKSB7XG4gICAgICAgIHZpc2l0Tm9kZXMobm9kZS5jaGlsZE5vZGVzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgdmlzaXROb2Rlcyhkb2N1bWVudC5jaGlsZE5vZGVzKTtcbiAgcmV0dXJuIHtjdXN0b21FdmVudHMsIHN0YW5kYXJkRXZlbnRzfTtcbn1cbiJdfQ==
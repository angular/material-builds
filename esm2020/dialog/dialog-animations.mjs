/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, state, style, transition, trigger, } from '@angular/animations';
/**
 * Animations used by MatDialog.
 * @docs-private
 */
export const matDialogAnimations = {
    /** Animation that is applied on the dialog container by default. */
    dialogContainer: trigger('dialogContainer', [
        // Note: The `enter` animation transitions to `transform: none`, because for some reason
        // specifying the transform explicitly, causes IE both to blur the dialog content and
        // decimate the animation performance. Leaving it as `none` solves both issues.
        state('void, exit', style({ opacity: 0, transform: 'scale(0.7)' })),
        state('enter', style({ transform: 'none' })),
        transition('* => enter', animate('150ms cubic-bezier(0, 0, 0.2, 1)', style({ transform: 'none', opacity: 1 }))),
        transition('* => void, * => exit', animate('75ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0 }))),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhbG9nLWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZGlhbG9nL2RpYWxvZy1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxPQUFPLEVBQ1AsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUVSLE1BQU0scUJBQXFCLENBQUM7QUFFN0I7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBRTVCO0lBQ0Ysb0VBQW9FO0lBQ3BFLGVBQWUsRUFBRSxPQUFPLENBQUMsaUJBQWlCLEVBQUU7UUFDMUMsd0ZBQXdGO1FBQ3hGLHFGQUFxRjtRQUNyRiwrRUFBK0U7UUFDL0UsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO1FBQ2pFLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDMUMsVUFBVSxDQUNSLFlBQVksRUFDWixPQUFPLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUNwRjtRQUNELFVBQVUsQ0FDUixzQkFBc0IsRUFDdEIsT0FBTyxDQUFDLHFDQUFxQyxFQUFFLEtBQUssQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQ3BFO0tBQ0YsQ0FBQztDQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIHN0YXRlLFxuICBzdHlsZSxcbiAgdHJhbnNpdGlvbixcbiAgdHJpZ2dlcixcbiAgQW5pbWF0aW9uVHJpZ2dlck1ldGFkYXRhLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqXG4gKiBBbmltYXRpb25zIHVzZWQgYnkgTWF0RGlhbG9nLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgbWF0RGlhbG9nQW5pbWF0aW9uczoge1xuICByZWFkb25seSBkaWFsb2dDb250YWluZXI6IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKiBBbmltYXRpb24gdGhhdCBpcyBhcHBsaWVkIG9uIHRoZSBkaWFsb2cgY29udGFpbmVyIGJ5IGRlZmF1bHQuICovXG4gIGRpYWxvZ0NvbnRhaW5lcjogdHJpZ2dlcignZGlhbG9nQ29udGFpbmVyJywgW1xuICAgIC8vIE5vdGU6IFRoZSBgZW50ZXJgIGFuaW1hdGlvbiB0cmFuc2l0aW9ucyB0byBgdHJhbnNmb3JtOiBub25lYCwgYmVjYXVzZSBmb3Igc29tZSByZWFzb25cbiAgICAvLyBzcGVjaWZ5aW5nIHRoZSB0cmFuc2Zvcm0gZXhwbGljaXRseSwgY2F1c2VzIElFIGJvdGggdG8gYmx1ciB0aGUgZGlhbG9nIGNvbnRlbnQgYW5kXG4gICAgLy8gZGVjaW1hdGUgdGhlIGFuaW1hdGlvbiBwZXJmb3JtYW5jZS4gTGVhdmluZyBpdCBhcyBgbm9uZWAgc29sdmVzIGJvdGggaXNzdWVzLlxuICAgIHN0YXRlKCd2b2lkLCBleGl0Jywgc3R5bGUoe29wYWNpdHk6IDAsIHRyYW5zZm9ybTogJ3NjYWxlKDAuNyknfSkpLFxuICAgIHN0YXRlKCdlbnRlcicsIHN0eWxlKHt0cmFuc2Zvcm06ICdub25lJ30pKSxcbiAgICB0cmFuc2l0aW9uKFxuICAgICAgJyogPT4gZW50ZXInLFxuICAgICAgYW5pbWF0ZSgnMTUwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSknLCBzdHlsZSh7dHJhbnNmb3JtOiAnbm9uZScsIG9wYWNpdHk6IDF9KSksXG4gICAgKSxcbiAgICB0cmFuc2l0aW9uKFxuICAgICAgJyogPT4gdm9pZCwgKiA9PiBleGl0JyxcbiAgICAgIGFuaW1hdGUoJzc1bXMgY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAwLjIsIDEpJywgc3R5bGUoe29wYWNpdHk6IDB9KSksXG4gICAgKSxcbiAgXSksXG59O1xuIl19
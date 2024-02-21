/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, ElementRef, InjectionToken, Input, inject, numberAttribute, } from '@angular/core';
import * as i0 from "@angular/core";
/** Class that is applied when a tab indicator is active. */
const ACTIVE_CLASS = 'mdc-tab-indicator--active';
/** Class that is applied when the tab indicator should not transition. */
const NO_TRANSITION_CLASS = 'mdc-tab-indicator--no-transition';
/**
 * Abstraction around the MDC tab indicator that acts as the tab header's ink bar.
 * @docs-private
 */
export class MatInkBar {
    constructor(_items) {
        this._items = _items;
    }
    /** Hides the ink bar. */
    hide() {
        this._items.forEach(item => item.deactivateInkBar());
    }
    /** Aligns the ink bar to a DOM node. */
    alignToElement(element) {
        const correspondingItem = this._items.find(item => item.elementRef.nativeElement === element);
        const currentItem = this._currentItem;
        if (correspondingItem === currentItem) {
            return;
        }
        currentItem?.deactivateInkBar();
        if (correspondingItem) {
            const domRect = currentItem?.elementRef.nativeElement.getBoundingClientRect?.();
            // The ink bar won't animate unless we give it the `DOMRect` of the previous item.
            correspondingItem.activateInkBar(domRect);
            this._currentItem = correspondingItem;
        }
    }
}
export class InkBarItem {
    constructor() {
        this._elementRef = inject(ElementRef);
        this._fitToContent = false;
    }
    /** Whether the ink bar should fit to the entire tab or just its content. */
    get fitInkBarToContent() {
        return this._fitToContent;
    }
    set fitInkBarToContent(newValue) {
        if (this._fitToContent !== newValue) {
            this._fitToContent = newValue;
            if (this._inkBarElement) {
                this._appendInkBarElement();
            }
        }
    }
    /** Aligns the ink bar to the current item. */
    activateInkBar(previousIndicatorClientRect) {
        const element = this._elementRef.nativeElement;
        // Early exit if no indicator is present to handle cases where an indicator
        // may be activated without a prior indicator state
        if (!previousIndicatorClientRect ||
            !element.getBoundingClientRect ||
            !this._inkBarContentElement) {
            element.classList.add(ACTIVE_CLASS);
            return;
        }
        // This animation uses the FLIP approach. You can read more about it at the link below:
        // https://aerotwist.com/blog/flip-your-animations/
        // Calculate the dimensions based on the dimensions of the previous indicator
        const currentClientRect = element.getBoundingClientRect();
        const widthDelta = previousIndicatorClientRect.width / currentClientRect.width;
        const xPosition = previousIndicatorClientRect.left - currentClientRect.left;
        element.classList.add(NO_TRANSITION_CLASS);
        this._inkBarContentElement.style.setProperty('transform', `translateX(${xPosition}px) scaleX(${widthDelta})`);
        // Force repaint before updating classes and transform to ensure the transform properly takes effect
        element.getBoundingClientRect();
        element.classList.remove(NO_TRANSITION_CLASS);
        element.classList.add(ACTIVE_CLASS);
        this._inkBarContentElement.style.setProperty('transform', '');
    }
    /** Removes the ink bar from the current item. */
    deactivateInkBar() {
        this._elementRef.nativeElement.classList.remove(ACTIVE_CLASS);
    }
    /** Initializes the foundation. */
    ngOnInit() {
        this._createInkBarElement();
    }
    /** Destroys the foundation. */
    ngOnDestroy() {
        this._inkBarElement?.remove();
        this._inkBarElement = this._inkBarContentElement = null;
    }
    /** Creates and appends the ink bar element. */
    _createInkBarElement() {
        const documentNode = this._elementRef.nativeElement.ownerDocument || document;
        const inkBarElement = (this._inkBarElement = documentNode.createElement('span'));
        const inkBarContentElement = (this._inkBarContentElement = documentNode.createElement('span'));
        inkBarElement.className = 'mdc-tab-indicator';
        inkBarContentElement.className =
            'mdc-tab-indicator__content mdc-tab-indicator__content--underline';
        inkBarElement.appendChild(this._inkBarContentElement);
        this._appendInkBarElement();
    }
    /**
     * Appends the ink bar to the tab host element or content, depending on whether
     * the ink bar should fit to content.
     */
    _appendInkBarElement() {
        if (!this._inkBarElement && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('Ink bar element has not been created and cannot be appended');
        }
        const parentElement = this._fitToContent
            ? this._elementRef.nativeElement.querySelector('.mdc-tab__content')
            : this._elementRef.nativeElement;
        if (!parentElement && (typeof ngDevMode === 'undefined' || ngDevMode)) {
            throw Error('Missing element to host the ink bar');
        }
        parentElement.appendChild(this._inkBarElement);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: InkBarItem, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "16.1.0", version: "17.2.0", type: InkBarItem, inputs: { fitInkBarToContent: ["fitInkBarToContent", "fitInkBarToContent", numberAttribute] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.2.0", ngImport: i0, type: InkBarItem, decorators: [{
            type: Directive
        }], propDecorators: { fitInkBarToContent: [{
                type: Input,
                args: [{ transform: numberAttribute }]
            }] } });
/**
 * The default positioner function for the MatInkBar.
 * @docs-private
 */
export function _MAT_INK_BAR_POSITIONER_FACTORY() {
    const method = (element) => ({
        left: element ? (element.offsetLeft || 0) + 'px' : '0',
        width: element ? (element.offsetWidth || 0) + 'px' : '0',
    });
    return method;
}
/** Injection token for the MatInkBar's Positioner. */
export const _MAT_INK_BAR_POSITIONER = new InjectionToken('MatInkBarPositioner', {
    providedIn: 'root',
    factory: _MAT_INK_BAR_POSITIONER_FACTORY,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5rLWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL2luay1iYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsY0FBYyxFQUNkLEtBQUssRUFJTCxNQUFNLEVBQ04sZUFBZSxHQUNoQixNQUFNLGVBQWUsQ0FBQzs7QUFhdkIsNERBQTREO0FBQzVELE1BQU0sWUFBWSxHQUFHLDJCQUEyQixDQUFDO0FBRWpELDBFQUEwRTtBQUMxRSxNQUFNLG1CQUFtQixHQUFHLGtDQUFrQyxDQUFDO0FBRS9EOzs7R0FHRztBQUNILE1BQU0sT0FBTyxTQUFTO0lBSXBCLFlBQW9CLE1BQWdDO1FBQWhDLFdBQU0sR0FBTixNQUFNLENBQTBCO0lBQUcsQ0FBQztJQUV4RCx5QkFBeUI7SUFDekIsSUFBSTtRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsd0NBQXdDO0lBQ3hDLGNBQWMsQ0FBQyxPQUFvQjtRQUNqQyxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEtBQUssT0FBTyxDQUFDLENBQUM7UUFDOUYsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUV0QyxJQUFJLGlCQUFpQixLQUFLLFdBQVcsRUFBRSxDQUFDO1lBQ3RDLE9BQU87UUFDVCxDQUFDO1FBRUQsV0FBVyxFQUFFLGdCQUFnQixFQUFFLENBQUM7UUFFaEMsSUFBSSxpQkFBaUIsRUFBRSxDQUFDO1lBQ3RCLE1BQU0sT0FBTyxHQUFHLFdBQVcsRUFBRSxVQUFVLENBQUMsYUFB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O2tCQUQvQixTQUFTOzhCQVNKLGtCQUFrQjtzQkFEckIsS0FBSzt1QkFBQyxFQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUM7O0FBNkdyQzs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsK0JBQStCO0lBQzdDLE1BQU0sTUFBTSxHQUFHLENBQUMsT0FBb0IsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN4QyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHO1FBQ3RELEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUc7S0FDekQsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELHNEQUFzRDtBQUN0RCxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBRyxJQUFJLGNBQWMsQ0FDdkQscUJBQXFCLEVBQ3JCO0lBQ0UsVUFBVSxFQUFFLE1BQU07SUFDbEIsT0FBTyxFQUFFLCtCQUErQjtDQUN6QyxDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbmplY3Rpb25Ub2tlbixcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBRdWVyeUxpc3QsXG4gIGluamVjdCxcbiAgbnVtYmVyQXR0cmlidXRlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBJdGVtIGluc2lkZSBhIHRhYiBoZWFkZXIgcmVsYXRpdmUgdG8gd2hpY2ggdGhlIGluayBiYXIgY2FuIGJlIGFsaWduZWQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0SW5rQmFySXRlbSBleHRlbmRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIGFjdGl2YXRlSW5rQmFyKHByZXZpb3VzSW5kaWNhdG9yQ2xpZW50UmVjdD86IERPTVJlY3QpOiB2b2lkO1xuICBkZWFjdGl2YXRlSW5rQmFyKCk6IHZvaWQ7XG4gIGZpdElua0JhclRvQ29udGVudDogYm9vbGVhbjtcbn1cblxuLyoqIENsYXNzIHRoYXQgaXMgYXBwbGllZCB3aGVuIGEgdGFiIGluZGljYXRvciBpcyBhY3RpdmUuICovXG5jb25zdCBBQ1RJVkVfQ0xBU1MgPSAnbWRjLXRhYi1pbmRpY2F0b3ItLWFjdGl2ZSc7XG5cbi8qKiBDbGFzcyB0aGF0IGlzIGFwcGxpZWQgd2hlbiB0aGUgdGFiIGluZGljYXRvciBzaG91bGQgbm90IHRyYW5zaXRpb24uICovXG5jb25zdCBOT19UUkFOU0lUSU9OX0NMQVNTID0gJ21kYy10YWItaW5kaWNhdG9yLS1uby10cmFuc2l0aW9uJztcblxuLyoqXG4gKiBBYnN0cmFjdGlvbiBhcm91bmQgdGhlIE1EQyB0YWIgaW5kaWNhdG9yIHRoYXQgYWN0cyBhcyB0aGUgdGFiIGhlYWRlcidzIGluayBiYXIuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRJbmtCYXIge1xuICAvKiogSXRlbSB0byB3aGljaCB0aGUgaW5rIGJhciBpcyBhbGlnbmVkIGN1cnJlbnRseS4gKi9cbiAgcHJpdmF0ZSBfY3VycmVudEl0ZW06IE1hdElua0Jhckl0ZW0gfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfaXRlbXM6IFF1ZXJ5TGlzdDxNYXRJbmtCYXJJdGVtPikge31cblxuICAvKiogSGlkZXMgdGhlIGluayBiYXIuICovXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5faXRlbXMuZm9yRWFjaChpdGVtID0+IGl0ZW0uZGVhY3RpdmF0ZUlua0JhcigpKTtcbiAgfVxuXG4gIC8qKiBBbGlnbnMgdGhlIGluayBiYXIgdG8gYSBET00gbm9kZS4gKi9cbiAgYWxpZ25Ub0VsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQpIHtcbiAgICBjb25zdCBjb3JyZXNwb25kaW5nSXRlbSA9IHRoaXMuX2l0ZW1zLmZpbmQoaXRlbSA9PiBpdGVtLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCA9PT0gZWxlbWVudCk7XG4gICAgY29uc3QgY3VycmVudEl0ZW0gPSB0aGlzLl9jdXJyZW50SXRlbTtcblxuICAgIGlmIChjb3JyZXNwb25kaW5nSXRlbSA9PT0gY3VycmVudEl0ZW0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjdXJyZW50SXRlbT8uZGVhY3RpdmF0ZUlua0JhcigpO1xuXG4gICAgaWYgKGNvcnJlc3BvbmRpbmdJdGVtKSB7XG4gICAgICBjb25zdCBkb21SZWN0ID0gY3VycmVudEl0ZW0/LmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3Q/LigpO1xuXG4gICAgICAvLyBUaGUgaW5rIGJhciB3b24ndCBhbmltYXRlIHVubGVzcyB3ZSBnaXZlIGl0IHRoZSBgRE9NUmVjdGAgb2YgdGhlIHByZXZpb3VzIGl0ZW0uXG4gICAgICBjb3JyZXNwb25kaW5nSXRlbS5hY3RpdmF0ZUlua0Jhcihkb21SZWN0KTtcbiAgICAgIHRoaXMuX2N1cnJlbnRJdGVtID0gY29ycmVzcG9uZGluZ0l0ZW07XG4gICAgfVxuICB9XG59XG5cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIElua0Jhckl0ZW0gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2VsZW1lbnRSZWYgPSBpbmplY3Q8RWxlbWVudFJlZjxIVE1MRWxlbWVudD4+KEVsZW1lbnRSZWYpO1xuICBwcml2YXRlIF9pbmtCYXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGw7XG4gIHByaXZhdGUgX2lua0JhckNvbnRlbnRFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGw7XG4gIHByaXZhdGUgX2ZpdFRvQ29udGVudCA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBpbmsgYmFyIHNob3VsZCBmaXQgdG8gdGhlIGVudGlyZSB0YWIgb3IganVzdCBpdHMgY29udGVudC4gKi9cbiAgQElucHV0KHt0cmFuc2Zvcm06IG51bWJlckF0dHJpYnV0ZX0pXG4gIGdldCBmaXRJbmtCYXJUb0NvbnRlbnQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2ZpdFRvQ29udGVudDtcbiAgfVxuICBzZXQgZml0SW5rQmFyVG9Db250ZW50KG5ld1ZhbHVlOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuX2ZpdFRvQ29udGVudCAhPT0gbmV3VmFsdWUpIHtcbiAgICAgIHRoaXMuX2ZpdFRvQ29udGVudCA9IG5ld1ZhbHVlO1xuXG4gICAgICBpZiAodGhpcy5faW5rQmFyRWxlbWVudCkge1xuICAgICAgICB0aGlzLl9hcHBlbmRJbmtCYXJFbGVtZW50KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEFsaWducyB0aGUgaW5rIGJhciB0byB0aGUgY3VycmVudCBpdGVtLiAqL1xuICBhY3RpdmF0ZUlua0JhcihwcmV2aW91c0luZGljYXRvckNsaWVudFJlY3Q/OiBET01SZWN0KSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIC8vIEVhcmx5IGV4aXQgaWYgbm8gaW5kaWNhdG9yIGlzIHByZXNlbnQgdG8gaGFuZGxlIGNhc2VzIHdoZXJlIGFuIGluZGljYXRvclxuICAgIC8vIG1heSBiZSBhY3RpdmF0ZWQgd2l0aG91dCBhIHByaW9yIGluZGljYXRvciBzdGF0ZVxuICAgIGlmIChcbiAgICAgICFwcmV2aW91c0luZGljYXRvckNsaWVudFJlY3QgfHxcbiAgICAgICFlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCB8fFxuICAgICAgIXRoaXMuX2lua0JhckNvbnRlbnRFbGVtZW50XG4gICAgKSB7XG4gICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoQUNUSVZFX0NMQVNTKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGlzIGFuaW1hdGlvbiB1c2VzIHRoZSBGTElQIGFwcHJvYWNoLiBZb3UgY2FuIHJlYWQgbW9yZSBhYm91dCBpdCBhdCB0aGUgbGluayBiZWxvdzpcbiAgICAvLyBodHRwczovL2Flcm90d2lzdC5jb20vYmxvZy9mbGlwLXlvdXItYW5pbWF0aW9ucy9cblxuICAgIC8vIENhbGN1bGF0ZSB0aGUgZGltZW5zaW9ucyBiYXNlZCBvbiB0aGUgZGltZW5zaW9ucyBvZiB0aGUgcHJldmlvdXMgaW5kaWNhdG9yXG4gICAgY29uc3QgY3VycmVudENsaWVudFJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHdpZHRoRGVsdGEgPSBwcmV2aW91c0luZGljYXRvckNsaWVudFJlY3Qud2lkdGggLyBjdXJyZW50Q2xpZW50UmVjdC53aWR0aDtcbiAgICBjb25zdCB4UG9zaXRpb24gPSBwcmV2aW91c0luZGljYXRvckNsaWVudFJlY3QubGVmdCAtIGN1cnJlbnRDbGllbnRSZWN0LmxlZnQ7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKE5PX1RSQU5TSVRJT05fQ0xBU1MpO1xuICAgIHRoaXMuX2lua0JhckNvbnRlbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KFxuICAgICAgJ3RyYW5zZm9ybScsXG4gICAgICBgdHJhbnNsYXRlWCgke3hQb3NpdGlvbn1weCkgc2NhbGVYKCR7d2lkdGhEZWx0YX0pYCxcbiAgICApO1xuXG4gICAgLy8gRm9yY2UgcmVwYWludCBiZWZvcmUgdXBkYXRpbmcgY2xhc3NlcyBhbmQgdHJhbnNmb3JtIHRvIGVuc3VyZSB0aGUgdHJhbnNmb3JtIHByb3Blcmx5IHRha2VzIGVmZmVjdFxuICAgIGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoTk9fVFJBTlNJVElPTl9DTEFTUyk7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKEFDVElWRV9DTEFTUyk7XG4gICAgdGhpcy5faW5rQmFyQ29udGVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJ3RyYW5zZm9ybScsICcnKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmVzIHRoZSBpbmsgYmFyIGZyb20gdGhlIGN1cnJlbnQgaXRlbS4gKi9cbiAgZGVhY3RpdmF0ZUlua0JhcigpIHtcbiAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShBQ1RJVkVfQ0xBU1MpO1xuICB9XG5cbiAgLyoqIEluaXRpYWxpemVzIHRoZSBmb3VuZGF0aW9uLiAqL1xuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLl9jcmVhdGVJbmtCYXJFbGVtZW50KCk7XG4gIH1cblxuICAvKiogRGVzdHJveXMgdGhlIGZvdW5kYXRpb24uICovXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX2lua0JhckVsZW1lbnQ/LnJlbW92ZSgpO1xuICAgIHRoaXMuX2lua0JhckVsZW1lbnQgPSB0aGlzLl9pbmtCYXJDb250ZW50RWxlbWVudCA9IG51bGwhO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYW5kIGFwcGVuZHMgdGhlIGluayBiYXIgZWxlbWVudC4gKi9cbiAgcHJpdmF0ZSBfY3JlYXRlSW5rQmFyRWxlbWVudCgpIHtcbiAgICBjb25zdCBkb2N1bWVudE5vZGUgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudDtcbiAgICBjb25zdCBpbmtCYXJFbGVtZW50ID0gKHRoaXMuX2lua0JhckVsZW1lbnQgPSBkb2N1bWVudE5vZGUuY3JlYXRlRWxlbWVudCgnc3BhbicpKTtcbiAgICBjb25zdCBpbmtCYXJDb250ZW50RWxlbWVudCA9ICh0aGlzLl9pbmtCYXJDb250ZW50RWxlbWVudCA9IGRvY3VtZW50Tm9kZS5jcmVhdGVFbGVtZW50KCdzcGFuJykpO1xuXG4gICAgaW5rQmFyRWxlbWVudC5jbGFzc05hbWUgPSAnbWRjLXRhYi1pbmRpY2F0b3InO1xuICAgIGlua0JhckNvbnRlbnRFbGVtZW50LmNsYXNzTmFtZSA9XG4gICAgICAnbWRjLXRhYi1pbmRpY2F0b3JfX2NvbnRlbnQgbWRjLXRhYi1pbmRpY2F0b3JfX2NvbnRlbnQtLXVuZGVybGluZSc7XG5cbiAgICBpbmtCYXJFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX2lua0JhckNvbnRlbnRFbGVtZW50KTtcbiAgICB0aGlzLl9hcHBlbmRJbmtCYXJFbGVtZW50KCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyB0aGUgaW5rIGJhciB0byB0aGUgdGFiIGhvc3QgZWxlbWVudCBvciBjb250ZW50LCBkZXBlbmRpbmcgb24gd2hldGhlclxuICAgKiB0aGUgaW5rIGJhciBzaG91bGQgZml0IHRvIGNvbnRlbnQuXG4gICAqL1xuICBwcml2YXRlIF9hcHBlbmRJbmtCYXJFbGVtZW50KCkge1xuICAgIGlmICghdGhpcy5faW5rQmFyRWxlbWVudCAmJiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSkge1xuICAgICAgdGhyb3cgRXJyb3IoJ0luayBiYXIgZWxlbWVudCBoYXMgbm90IGJlZW4gY3JlYXRlZCBhbmQgY2Fubm90IGJlIGFwcGVuZGVkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFyZW50RWxlbWVudCA9IHRoaXMuX2ZpdFRvQ29udGVudFxuICAgICAgPyB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignLm1kYy10YWJfX2NvbnRlbnQnKVxuICAgICAgOiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoIXBhcmVudEVsZW1lbnQgJiYgKHR5cGVvZiBuZ0Rldk1vZGUgPT09ICd1bmRlZmluZWQnIHx8IG5nRGV2TW9kZSkpIHtcbiAgICAgIHRocm93IEVycm9yKCdNaXNzaW5nIGVsZW1lbnQgdG8gaG9zdCB0aGUgaW5rIGJhcicpO1xuICAgIH1cblxuICAgIHBhcmVudEVsZW1lbnQhLmFwcGVuZENoaWxkKHRoaXMuX2lua0JhckVsZW1lbnQhKTtcbiAgfVxufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgYSBNYXRJbmtCYXIgcG9zaXRpb25lciBtZXRob2QsIGRlZmluaW5nIHRoZSBwb3NpdGlvbmluZyBhbmQgd2lkdGggb2YgdGhlIGlua1xuICogYmFyIGluIGEgc2V0IG9mIHRhYnMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgX01hdElua0JhclBvc2l0aW9uZXIge1xuICAoZWxlbWVudDogSFRNTEVsZW1lbnQpOiB7bGVmdDogc3RyaW5nOyB3aWR0aDogc3RyaW5nfTtcbn1cblxuLyoqXG4gKiBUaGUgZGVmYXVsdCBwb3NpdGlvbmVyIGZ1bmN0aW9uIGZvciB0aGUgTWF0SW5rQmFyLlxuICogQGRvY3MtcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gX01BVF9JTktfQkFSX1BPU0lUSU9ORVJfRkFDVE9SWSgpOiBfTWF0SW5rQmFyUG9zaXRpb25lciB7XG4gIGNvbnN0IG1ldGhvZCA9IChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gKHtcbiAgICBsZWZ0OiBlbGVtZW50ID8gKGVsZW1lbnQub2Zmc2V0TGVmdCB8fCAwKSArICdweCcgOiAnMCcsXG4gICAgd2lkdGg6IGVsZW1lbnQgPyAoZWxlbWVudC5vZmZzZXRXaWR0aCB8fCAwKSArICdweCcgOiAnMCcsXG4gIH0pO1xuXG4gIHJldHVybiBtZXRob2Q7XG59XG5cbi8qKiBJbmplY3Rpb24gdG9rZW4gZm9yIHRoZSBNYXRJbmtCYXIncyBQb3NpdGlvbmVyLiAqL1xuZXhwb3J0IGNvbnN0IF9NQVRfSU5LX0JBUl9QT1NJVElPTkVSID0gbmV3IEluamVjdGlvblRva2VuPF9NYXRJbmtCYXJQb3NpdGlvbmVyPihcbiAgJ01hdElua0JhclBvc2l0aW9uZXInLFxuICB7XG4gICAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxuICAgIGZhY3Rvcnk6IF9NQVRfSU5LX0JBUl9QT1NJVElPTkVSX0ZBQ1RPUlksXG4gIH0sXG4pO1xuIl19
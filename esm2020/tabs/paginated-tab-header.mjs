/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, ElementRef, NgZone, Optional, EventEmitter, Directive, Inject, Input, } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { ENTER, SPACE, hasModifierKey } from '@angular/cdk/keycodes';
import { merge, of as observableOf, Subject, timer, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Platform, normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/scrolling";
import * as i2 from "@angular/cdk/bidi";
import * as i3 from "@angular/cdk/platform";
/** Config used to bind passive event listeners */
const passiveEventListenerOptions = normalizePassiveListenerOptions({
    passive: true,
});
/**
 * The distance in pixels that will be overshot when scrolling a tab label into view. This helps
 * provide a small affordance to the label next to it.
 */
const EXAGGERATED_OVERSCROLL = 60;
/**
 * Amount of milliseconds to wait before starting to scroll the header automatically.
 * Set a little conservatively in order to handle fake events dispatched on touch devices.
 */
const HEADER_SCROLL_DELAY = 650;
/**
 * Interval in milliseconds at which to scroll the header
 * while the user is holding their pointer.
 */
const HEADER_SCROLL_INTERVAL = 100;
/**
 * Base class for a tab header that supported pagination.
 * @docs-private
 */
export class MatPaginatedTabHeader {
    constructor(_elementRef, _changeDetectorRef, _viewportRuler, _dir, _ngZone, _platform, _animationMode) {
        this._elementRef = _elementRef;
        this._changeDetectorRef = _changeDetectorRef;
        this._viewportRuler = _viewportRuler;
        this._dir = _dir;
        this._ngZone = _ngZone;
        this._platform = _platform;
        this._animationMode = _animationMode;
        /** The distance in pixels that the tab labels should be translated to the left. */
        this._scrollDistance = 0;
        /** Whether the header should scroll to the selected index after the view has been checked. */
        this._selectedIndexChanged = false;
        /** Emits when the component is destroyed. */
        this._destroyed = new Subject();
        /** Whether the controls for pagination should be displayed */
        this._showPaginationControls = false;
        /** Whether the tab list can be scrolled more towards the end of the tab label list. */
        this._disableScrollAfter = true;
        /** Whether the tab list can be scrolled more towards the beginning of the tab label list. */
        this._disableScrollBefore = true;
        /** Stream that will stop the automated scrolling. */
        this._stopScrolling = new Subject();
        /**
         * Whether pagination should be disabled. This can be used to avoid unnecessary
         * layout recalculations if it's known that pagination won't be required.
         */
        this.disablePagination = false;
        this._selectedIndex = 0;
        /** Event emitted when the option is selected. */
        this.selectFocusedIndex = new EventEmitter();
        /** Event emitted when a label is focused. */
        this.indexFocused = new EventEmitter();
        // Bind the `mouseleave` event on the outside since it doesn't change anything in the view.
        _ngZone.runOutsideAngular(() => {
            fromEvent(_elementRef.nativeElement, 'mouseleave')
                .pipe(takeUntil(this._destroyed))
                .subscribe(() => {
                this._stopInterval();
            });
        });
    }
    /** The index of the active tab. */
    get selectedIndex() {
        return this._selectedIndex;
    }
    set selectedIndex(value) {
        value = coerceNumberProperty(value);
        if (this._selectedIndex != value) {
            this._selectedIndexChanged = true;
            this._selectedIndex = value;
            if (this._keyManager) {
                this._keyManager.updateActiveItem(value);
            }
        }
    }
    ngAfterViewInit() {
        // We need to handle these events manually, because we want to bind passive event listeners.
        fromEvent(this._previousPaginator.nativeElement, 'touchstart', passiveEventListenerOptions)
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => {
            this._handlePaginatorPress('before');
        });
        fromEvent(this._nextPaginator.nativeElement, 'touchstart', passiveEventListenerOptions)
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => {
            this._handlePaginatorPress('after');
        });
    }
    ngAfterContentInit() {
        const dirChange = this._dir ? this._dir.change : observableOf('ltr');
        const resize = this._viewportRuler.change(150);
        const realign = () => {
            this.updatePagination();
            this._alignInkBarToSelectedTab();
        };
        this._keyManager = new FocusKeyManager(this._items)
            .withHorizontalOrientation(this._getLayoutDirection())
            .withHomeAndEnd()
            .withWrap();
        this._keyManager.updateActiveItem(this._selectedIndex);
        // Defer the first call in order to allow for slower browsers to lay out the elements.
        // This helps in cases where the user lands directly on a page with paginated tabs.
        typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame(realign) : realign();
        // On dir change or window resize, realign the ink bar and update the orientation of
        // the key manager if the direction has changed.
        merge(dirChange, resize, this._items.changes)
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => {
            // We need to defer this to give the browser some time to recalculate
            // the element dimensions. The call has to be wrapped in `NgZone.run`,
            // because the viewport change handler runs outside of Angular.
            this._ngZone.run(() => Promise.resolve().then(realign));
            this._keyManager.withHorizontalOrientation(this._getLayoutDirection());
        });
        // If there is a change in the focus key manager we need to emit the `indexFocused`
        // event in order to provide a public event that notifies about focus changes. Also we realign
        // the tabs container by scrolling the new focused tab into the visible section.
        this._keyManager.change.pipe(takeUntil(this._destroyed)).subscribe(newFocusIndex => {
            this.indexFocused.emit(newFocusIndex);
            this._setTabFocus(newFocusIndex);
        });
    }
    ngAfterContentChecked() {
        // If the number of tab labels have changed, check if scrolling should be enabled
        if (this._tabLabelCount != this._items.length) {
            this.updatePagination();
            this._tabLabelCount = this._items.length;
            this._changeDetectorRef.markForCheck();
        }
        // If the selected index has changed, scroll to the label and check if the scrolling controls
        // should be disabled.
        if (this._selectedIndexChanged) {
            this._scrollToLabel(this._selectedIndex);
            this._checkScrollingControls();
            this._alignInkBarToSelectedTab();
            this._selectedIndexChanged = false;
            this._changeDetectorRef.markForCheck();
        }
        // If the scroll distance has been changed (tab selected, focused, scroll controls activated),
        // then translate the header to reflect this.
        if (this._scrollDistanceChanged) {
            this._updateTabScrollPosition();
            this._scrollDistanceChanged = false;
            this._changeDetectorRef.markForCheck();
        }
    }
    ngOnDestroy() {
        this._destroyed.next();
        this._destroyed.complete();
        this._stopScrolling.complete();
    }
    /** Handles keyboard events on the header. */
    _handleKeydown(event) {
        // We don't handle any key bindings with a modifier key.
        if (hasModifierKey(event)) {
            return;
        }
        switch (event.keyCode) {
            case ENTER:
            case SPACE:
                if (this.focusIndex !== this.selectedIndex) {
                    this.selectFocusedIndex.emit(this.focusIndex);
                    this._itemSelected(event);
                }
                break;
            default:
                this._keyManager.onKeydown(event);
        }
    }
    /**
     * Callback for when the MutationObserver detects that the content has changed.
     */
    _onContentChanges() {
        const textContent = this._elementRef.nativeElement.textContent;
        // We need to diff the text content of the header, because the MutationObserver callback
        // will fire even if the text content didn't change which is inefficient and is prone
        // to infinite loops if a poorly constructed expression is passed in (see #14249).
        if (textContent !== this._currentTextContent) {
            this._currentTextContent = textContent || '';
            // The content observer runs outside the `NgZone` by default, which
            // means that we need to bring the callback back in ourselves.
            this._ngZone.run(() => {
                this.updatePagination();
                this._alignInkBarToSelectedTab();
                this._changeDetectorRef.markForCheck();
            });
        }
    }
    /**
     * Updates the view whether pagination should be enabled or not.
     *
     * WARNING: Calling this method can be very costly in terms of performance. It should be called
     * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
     * page.
     */
    updatePagination() {
        this._checkPaginationEnabled();
        this._checkScrollingControls();
        this._updateTabScrollPosition();
    }
    /** Tracks which element has focus; used for keyboard navigation */
    get focusIndex() {
        return this._keyManager ? this._keyManager.activeItemIndex : 0;
    }
    /** When the focus index is set, we must manually send focus to the correct label */
    set focusIndex(value) {
        if (!this._isValidIndex(value) || this.focusIndex === value || !this._keyManager) {
            return;
        }
        this._keyManager.setActiveItem(value);
    }
    /**
     * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
     * providing a valid index and return true.
     */
    _isValidIndex(index) {
        if (!this._items) {
            return true;
        }
        const tab = this._items ? this._items.toArray()[index] : null;
        return !!tab && !tab.disabled;
    }
    /**
     * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
     * scrolling is enabled.
     */
    _setTabFocus(tabIndex) {
        if (this._showPaginationControls) {
            this._scrollToLabel(tabIndex);
        }
        if (this._items && this._items.length) {
            this._items.toArray()[tabIndex].focus();
            // Do not let the browser manage scrolling to focus the element, this will be handled
            // by using translation. In LTR, the scroll left should be 0. In RTL, the scroll width
            // should be the full width minus the offset width.
            const containerEl = this._tabListContainer.nativeElement;
            const dir = this._getLayoutDirection();
            if (dir == 'ltr') {
                containerEl.scrollLeft = 0;
            }
            else {
                containerEl.scrollLeft = containerEl.scrollWidth - containerEl.offsetWidth;
            }
        }
    }
    /** The layout direction of the containing app. */
    _getLayoutDirection() {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    /** Performs the CSS transformation on the tab list that will cause the list to scroll. */
    _updateTabScrollPosition() {
        if (this.disablePagination) {
            return;
        }
        const scrollDistance = this.scrollDistance;
        const translateX = this._getLayoutDirection() === 'ltr' ? -scrollDistance : scrollDistance;
        // Don't use `translate3d` here because we don't want to create a new layer. A new layer
        // seems to cause flickering and overflow in Internet Explorer. For example, the ink bar
        // and ripples will exceed the boundaries of the visible tab bar.
        // See: https://github.com/angular/components/issues/10276
        // We round the `transform` here, because transforms with sub-pixel precision cause some
        // browsers to blur the content of the element.
        this._tabList.nativeElement.style.transform = `translateX(${Math.round(translateX)}px)`;
        // Setting the `transform` on IE will change the scroll offset of the parent, causing the
        // position to be thrown off in some cases. We have to reset it ourselves to ensure that
        // it doesn't get thrown off. Note that we scope it only to IE and Edge, because messing
        // with the scroll position throws off Chrome 71+ in RTL mode (see #14689).
        if (this._platform.TRIDENT || this._platform.EDGE) {
            this._tabListContainer.nativeElement.scrollLeft = 0;
        }
    }
    /** Sets the distance in pixels that the tab header should be transformed in the X-axis. */
    get scrollDistance() {
        return this._scrollDistance;
    }
    set scrollDistance(value) {
        this._scrollTo(value);
    }
    /**
     * Moves the tab list in the 'before' or 'after' direction (towards the beginning of the list or
     * the end of the list, respectively). The distance to scroll is computed to be a third of the
     * length of the tab list view window.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _scrollHeader(direction) {
        const viewLength = this._tabListContainer.nativeElement.offsetWidth;
        // Move the scroll distance one-third the length of the tab list's viewport.
        const scrollAmount = ((direction == 'before' ? -1 : 1) * viewLength) / 3;
        return this._scrollTo(this._scrollDistance + scrollAmount);
    }
    /** Handles click events on the pagination arrows. */
    _handlePaginatorClick(direction) {
        this._stopInterval();
        this._scrollHeader(direction);
    }
    /**
     * Moves the tab list such that the desired tab label (marked by index) is moved into view.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _scrollToLabel(labelIndex) {
        if (this.disablePagination) {
            return;
        }
        const selectedLabel = this._items ? this._items.toArray()[labelIndex] : null;
        if (!selectedLabel) {
            return;
        }
        // The view length is the visible width of the tab labels.
        const viewLength = this._tabListContainer.nativeElement.offsetWidth;
        const { offsetLeft, offsetWidth } = selectedLabel.elementRef.nativeElement;
        let labelBeforePos, labelAfterPos;
        if (this._getLayoutDirection() == 'ltr') {
            labelBeforePos = offsetLeft;
            labelAfterPos = labelBeforePos + offsetWidth;
        }
        else {
            labelAfterPos = this._tabListInner.nativeElement.offsetWidth - offsetLeft;
            labelBeforePos = labelAfterPos - offsetWidth;
        }
        const beforeVisiblePos = this.scrollDistance;
        const afterVisiblePos = this.scrollDistance + viewLength;
        if (labelBeforePos < beforeVisiblePos) {
            // Scroll header to move label to the before direction
            this.scrollDistance -= beforeVisiblePos - labelBeforePos + EXAGGERATED_OVERSCROLL;
        }
        else if (labelAfterPos > afterVisiblePos) {
            // Scroll header to move label to the after direction
            this.scrollDistance += labelAfterPos - afterVisiblePos + EXAGGERATED_OVERSCROLL;
        }
    }
    /**
     * Evaluate whether the pagination controls should be displayed. If the scroll width of the
     * tab list is wider than the size of the header container, then the pagination controls should
     * be shown.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _checkPaginationEnabled() {
        if (this.disablePagination) {
            this._showPaginationControls = false;
        }
        else {
            const isEnabled = this._tabListInner.nativeElement.scrollWidth > this._elementRef.nativeElement.offsetWidth;
            if (!isEnabled) {
                this.scrollDistance = 0;
            }
            if (isEnabled !== this._showPaginationControls) {
                this._changeDetectorRef.markForCheck();
            }
            this._showPaginationControls = isEnabled;
        }
    }
    /**
     * Evaluate whether the before and after controls should be enabled or disabled.
     * If the header is at the beginning of the list (scroll distance is equal to 0) then disable the
     * before button. If the header is at the end of the list (scroll distance is equal to the
     * maximum distance we can scroll), then disable the after button.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _checkScrollingControls() {
        if (this.disablePagination) {
            this._disableScrollAfter = this._disableScrollBefore = true;
        }
        else {
            // Check if the pagination arrows should be activated.
            this._disableScrollBefore = this.scrollDistance == 0;
            this._disableScrollAfter = this.scrollDistance == this._getMaxScrollDistance();
            this._changeDetectorRef.markForCheck();
        }
    }
    /**
     * Determines what is the maximum length in pixels that can be set for the scroll distance. This
     * is equal to the difference in width between the tab list container and tab header container.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    _getMaxScrollDistance() {
        const lengthOfTabList = this._tabListInner.nativeElement.scrollWidth;
        const viewLength = this._tabListContainer.nativeElement.offsetWidth;
        return lengthOfTabList - viewLength || 0;
    }
    /** Tells the ink-bar to align itself to the current label wrapper */
    _alignInkBarToSelectedTab() {
        const selectedItem = this._items && this._items.length ? this._items.toArray()[this.selectedIndex] : null;
        const selectedLabelWrapper = selectedItem ? selectedItem.elementRef.nativeElement : null;
        if (selectedLabelWrapper) {
            this._inkBar.alignToElement(selectedLabelWrapper);
        }
        else {
            this._inkBar.hide();
        }
    }
    /** Stops the currently-running paginator interval.  */
    _stopInterval() {
        this._stopScrolling.next();
    }
    /**
     * Handles the user pressing down on one of the paginators.
     * Starts scrolling the header after a certain amount of time.
     * @param direction In which direction the paginator should be scrolled.
     */
    _handlePaginatorPress(direction, mouseEvent) {
        // Don't start auto scrolling for right mouse button clicks. Note that we shouldn't have to
        // null check the `button`, but we do it so we don't break tests that use fake events.
        if (mouseEvent && mouseEvent.button != null && mouseEvent.button !== 0) {
            return;
        }
        // Avoid overlapping timers.
        this._stopInterval();
        // Start a timer after the delay and keep firing based on the interval.
        timer(HEADER_SCROLL_DELAY, HEADER_SCROLL_INTERVAL)
            // Keep the timer going until something tells it to stop or the component is destroyed.
            .pipe(takeUntil(merge(this._stopScrolling, this._destroyed)))
            .subscribe(() => {
            const { maxScrollDistance, distance } = this._scrollHeader(direction);
            // Stop the timer if we've reached the start or the end.
            if (distance === 0 || distance >= maxScrollDistance) {
                this._stopInterval();
            }
        });
    }
    /**
     * Scrolls the header to a given position.
     * @param position Position to which to scroll.
     * @returns Information on the current scroll distance and the maximum.
     */
    _scrollTo(position) {
        if (this.disablePagination) {
            return { maxScrollDistance: 0, distance: 0 };
        }
        const maxScrollDistance = this._getMaxScrollDistance();
        this._scrollDistance = Math.max(0, Math.min(maxScrollDistance, position));
        // Mark that the scroll distance has changed so that after the view is checked, the CSS
        // transformation can move the header.
        this._scrollDistanceChanged = true;
        this._checkScrollingControls();
        return { maxScrollDistance, distance: this._scrollDistance };
    }
}
MatPaginatedTabHeader.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatPaginatedTabHeader, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.ViewportRuler }, { token: i2.Directionality, optional: true }, { token: i0.NgZone }, { token: i3.Platform }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive });
MatPaginatedTabHeader.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.0.1", type: MatPaginatedTabHeader, inputs: { disablePagination: "disablePagination" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatPaginatedTabHeader, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }, { type: i1.ViewportRuler }, { type: i2.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.NgZone }, { type: i3.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { disablePagination: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGVkLXRhYi1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy9wYWdpbmF0ZWQtdGFiLWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUVSLFlBQVksRUFLWixTQUFTLEVBQ1QsTUFBTSxFQUNOLEtBQUssR0FDTixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQVksY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUFDLG9CQUFvQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDeEUsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBQyxlQUFlLEVBQWtCLE1BQU0sbUJBQW1CLENBQUM7QUFDbkUsT0FBTyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDbkUsT0FBTyxFQUFDLEtBQUssRUFBRSxFQUFFLElBQUksWUFBWSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzFFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUMsUUFBUSxFQUFFLCtCQUErQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDaEYsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7Ozs7O0FBRTNFLGtEQUFrRDtBQUNsRCxNQUFNLDJCQUEyQixHQUFHLCtCQUErQixDQUFDO0lBQ2xFLE9BQU8sRUFBRSxJQUFJO0NBQ2QsQ0FBeUIsQ0FBQztBQVMzQjs7O0dBR0c7QUFDSCxNQUFNLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztBQUVsQzs7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QUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBRTFFLHVGQUF1RjtRQUN2RixzQ0FBc0M7UUFDdEMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztRQUNuQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztRQUUvQixPQUFPLEVBQUMsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUMsQ0FBQztJQUM3RCxDQUFDOztrSEE5Z0JtQixxQkFBcUIsc01BcUZuQixxQkFBcUI7c0dBckZ2QixxQkFBcUI7MkZBQXJCLHFCQUFxQjtrQkFEMUMsU0FBUzs7MEJBbUZMLFFBQVE7OzBCQUdSLFFBQVE7OzBCQUFJLE1BQU07MkJBQUMscUJBQXFCOzRDQWpDM0MsaUJBQWlCO3NCQURoQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBFbGVtZW50UmVmLFxuICBOZ1pvbmUsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIEV2ZW50RW1pdHRlcixcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT25EZXN0cm95LFxuICBEaXJlY3RpdmUsXG4gIEluamVjdCxcbiAgSW5wdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEaXJlY3Rpb24sIERpcmVjdGlvbmFsaXR5fSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge2NvZXJjZU51bWJlclByb3BlcnR5LCBOdW1iZXJJbnB1dH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2NvZXJjaW9uJztcbmltcG9ydCB7Vmlld3BvcnRSdWxlcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Njcm9sbGluZyc7XG5pbXBvcnQge0ZvY3VzS2V5TWFuYWdlciwgRm9jdXNhYmxlT3B0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQge0VOVEVSLCBTUEFDRSwgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge21lcmdlLCBvZiBhcyBvYnNlcnZhYmxlT2YsIFN1YmplY3QsIHRpbWVyLCBmcm9tRXZlbnR9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7UGxhdGZvcm0sIG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuLyoqIENvbmZpZyB1c2VkIHRvIGJpbmQgcGFzc2l2ZSBldmVudCBsaXN0ZW5lcnMgKi9cbmNvbnN0IHBhc3NpdmVFdmVudExpc3RlbmVyT3B0aW9ucyA9IG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnMoe1xuICBwYXNzaXZlOiB0cnVlLFxufSkgYXMgRXZlbnRMaXN0ZW5lck9wdGlvbnM7XG5cbi8qKlxuICogVGhlIGRpcmVjdGlvbnMgdGhhdCBzY3JvbGxpbmcgY2FuIGdvIGluIHdoZW4gdGhlIGhlYWRlcidzIHRhYnMgZXhjZWVkIHRoZSBoZWFkZXIgd2lkdGguICdBZnRlcidcbiAqIHdpbGwgc2Nyb2xsIHRoZSBoZWFkZXIgdG93YXJkcyB0aGUgZW5kIG9mIHRoZSB0YWJzIGxpc3QgYW5kICdiZWZvcmUnIHdpbGwgc2Nyb2xsIHRvd2FyZHMgdGhlXG4gKiBiZWdpbm5pbmcgb2YgdGhlIGxpc3QuXG4gKi9cbmV4cG9ydCB0eXBlIFNjcm9sbERpcmVjdGlvbiA9ICdhZnRlcicgfCAnYmVmb3JlJztcblxuLyoqXG4gKiBUaGUgZGlzdGFuY2UgaW4gcGl4ZWxzIHRoYXQgd2lsbCBiZSBvdmVyc2hvdCB3aGVuIHNjcm9sbGluZyBhIHRhYiBsYWJlbCBpbnRvIHZpZXcuIFRoaXMgaGVscHNcbiAqIHByb3ZpZGUgYSBzbWFsbCBhZmZvcmRhbmNlIHRvIHRoZSBsYWJlbCBuZXh0IHRvIGl0LlxuICovXG5jb25zdCBFWEFHR0VSQVRFRF9PVkVSU0NST0xMID0gNjA7XG5cbi8qKlxuICogQW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBzdGFydGluZyB0byBzY3JvbGwgdGhlIGhlYWRlciBhdXRvbWF0aWNhbGx5LlxuICogU2V0IGEgbGl0dGxlIGNvbnNlcnZhdGl2ZWx5IGluIG9yZGVyIHRvIGhhbmRsZSBmYWtlIGV2ZW50cyBkaXNwYXRjaGVkIG9uIHRvdWNoIGRldmljZXMuXG4gKi9cbmNvbnN0IEhFQURFUl9TQ1JPTExfREVMQVkgPSA2NTA7XG5cbi8qKlxuICogSW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzIGF0IHdoaWNoIHRvIHNjcm9sbCB0aGUgaGVhZGVyXG4gKiB3aGlsZSB0aGUgdXNlciBpcyBob2xkaW5nIHRoZWlyIHBvaW50ZXIuXG4gKi9cbmNvbnN0IEhFQURFUl9TQ1JPTExfSU5URVJWQUwgPSAxMDA7XG5cbi8qKiBJdGVtIGluc2lkZSBhIHBhZ2luYXRlZCB0YWIgaGVhZGVyLiAqL1xuZXhwb3J0IHR5cGUgTWF0UGFnaW5hdGVkVGFiSGVhZGVySXRlbSA9IEZvY3VzYWJsZU9wdGlvbiAmIHtlbGVtZW50UmVmOiBFbGVtZW50UmVmfTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBhIHRhYiBoZWFkZXIgdGhhdCBzdXBwb3J0ZWQgcGFnaW5hdGlvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0UGFnaW5hdGVkVGFiSGVhZGVyXG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95XG57XG4gIGFic3RyYWN0IF9pdGVtczogUXVlcnlMaXN0PE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW0+O1xuICBhYnN0cmFjdCBfaW5rQmFyOiB7aGlkZTogKCkgPT4gdm9pZDsgYWxpZ25Ub0VsZW1lbnQ6IChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gdm9pZH07XG4gIGFic3RyYWN0IF90YWJMaXN0Q29udGFpbmVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgYWJzdHJhY3QgX3RhYkxpc3Q6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBhYnN0cmFjdCBfdGFiTGlzdElubmVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgYWJzdHJhY3QgX25leHRQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBhYnN0cmFjdCBfcHJldmlvdXNQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIC8qKiBUaGUgZGlzdGFuY2UgaW4gcGl4ZWxzIHRoYXQgdGhlIHRhYiBsYWJlbHMgc2hvdWxkIGJlIHRyYW5zbGF0ZWQgdG8gdGhlIGxlZnQuICovXG4gIHByaXZhdGUgX3Njcm9sbERpc3RhbmNlID0gMDtcblxuICAvKiogV2hldGhlciB0aGUgaGVhZGVyIHNob3VsZCBzY3JvbGwgdG8gdGhlIHNlbGVjdGVkIGluZGV4IGFmdGVyIHRoZSB2aWV3IGhhcyBiZWVuIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX3NlbGVjdGVkSW5kZXhDaGFuZ2VkID0gZmFsc2U7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByb3RlY3RlZCByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbHMgZm9yIHBhZ2luYXRpb24gc2hvdWxkIGJlIGRpc3BsYXllZCAqL1xuICBfc2hvd1BhZ2luYXRpb25Db250cm9scyA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0YWIgbGlzdCBjYW4gYmUgc2Nyb2xsZWQgbW9yZSB0b3dhcmRzIHRoZSBlbmQgb2YgdGhlIHRhYiBsYWJlbCBsaXN0LiAqL1xuICBfZGlzYWJsZVNjcm9sbEFmdGVyID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgdGFiIGxpc3QgY2FuIGJlIHNjcm9sbGVkIG1vcmUgdG93YXJkcyB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0YWIgbGFiZWwgbGlzdC4gKi9cbiAgX2Rpc2FibGVTY3JvbGxCZWZvcmUgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHRhYiBsYWJlbHMgdGhhdCBhcmUgZGlzcGxheWVkIG9uIHRoZSBoZWFkZXIuIFdoZW4gdGhpcyBjaGFuZ2VzLCB0aGUgaGVhZGVyXG4gICAqIHNob3VsZCByZS1ldmFsdWF0ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfdGFiTGFiZWxDb3VudDogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzY3JvbGwgZGlzdGFuY2UgaGFzIGNoYW5nZWQgYW5kIHNob3VsZCBiZSBhcHBsaWVkIGFmdGVyIHRoZSB2aWV3IGlzIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX3Njcm9sbERpc3RhbmNlQ2hhbmdlZDogYm9vbGVhbjtcblxuICAvKiogVXNlZCB0byBtYW5hZ2UgZm9jdXMgYmV0d2VlbiB0aGUgdGFicy4gKi9cbiAgcHJpdmF0ZSBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW0+O1xuXG4gIC8qKiBDYWNoZWQgdGV4dCBjb250ZW50IG9mIHRoZSBoZWFkZXIuICovXG4gIHByaXZhdGUgX2N1cnJlbnRUZXh0Q29udGVudDogc3RyaW5nO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCB3aWxsIHN0b3AgdGhlIGF1dG9tYXRlZCBzY3JvbGxpbmcuICovXG4gIHByaXZhdGUgX3N0b3BTY3JvbGxpbmcgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHBhZ2luYXRpb24gc2hvdWxkIGJlIGRpc2FibGVkLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGF2b2lkIHVubmVjZXNzYXJ5XG4gICAqIGxheW91dCByZWNhbGN1bGF0aW9ucyBpZiBpdCdzIGtub3duIHRoYXQgcGFnaW5hdGlvbiB3b24ndCBiZSByZXF1aXJlZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGRpc2FibGVQYWdpbmF0aW9uOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZSBpbmRleCBvZiB0aGUgYWN0aXZlIHRhYi4gKi9cbiAgZ2V0IHNlbGVjdGVkSW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRJbmRleDtcbiAgfVxuICBzZXQgc2VsZWN0ZWRJbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdmFsdWUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRJbmRleCAhPSB2YWx1ZSkge1xuICAgICAgdGhpcy5fc2VsZWN0ZWRJbmRleENoYW5nZWQgPSB0cnVlO1xuICAgICAgdGhpcy5fc2VsZWN0ZWRJbmRleCA9IHZhbHVlO1xuXG4gICAgICBpZiAodGhpcy5fa2V5TWFuYWdlcikge1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0odmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBwcml2YXRlIF9zZWxlY3RlZEluZGV4OiBudW1iZXIgPSAwO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIG9wdGlvbiBpcyBzZWxlY3RlZC4gKi9cbiAgcmVhZG9ubHkgc2VsZWN0Rm9jdXNlZEluZGV4OiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gYSBsYWJlbCBpcyBmb2N1c2VkLiAqL1xuICByZWFkb25seSBpbmRleEZvY3VzZWQ6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJvdGVjdGVkIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcm90ZWN0ZWQgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIF92aWV3cG9ydFJ1bGVyOiBWaWV3cG9ydFJ1bGVyLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgX2RpcjogRGlyZWN0aW9uYWxpdHksXG4gICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBfcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoQU5JTUFUSU9OX01PRFVMRV9UWVBFKSBwdWJsaWMgX2FuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIC8vIEJpbmQgdGhlIGBtb3VzZWxlYXZlYCBldmVudCBvbiB0aGUgb3V0c2lkZSBzaW5jZSBpdCBkb2Vzbid0IGNoYW5nZSBhbnl0aGluZyBpbiB0aGUgdmlldy5cbiAgICBfbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgIGZyb21FdmVudChfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnbW91c2VsZWF2ZScpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9zdG9wSW50ZXJ2YWwoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgaGFzIHNlbGVjdGVkIGFuIGl0ZW0gdmlhIHRoZSBrZXlib2FyZC4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9pdGVtU2VsZWN0ZWQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkO1xuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAvLyBXZSBuZWVkIHRvIGhhbmRsZSB0aGVzZSBldmVudHMgbWFudWFsbHksIGJlY2F1c2Ugd2Ugd2FudCB0byBiaW5kIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXJzLlxuICAgIGZyb21FdmVudCh0aGlzLl9wcmV2aW91c1BhZ2luYXRvci5uYXRpdmVFbGVtZW50LCAndG91Y2hzdGFydCcsIHBhc3NpdmVFdmVudExpc3RlbmVyT3B0aW9ucylcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2hhbmRsZVBhZ2luYXRvclByZXNzKCdiZWZvcmUnKTtcbiAgICAgIH0pO1xuXG4gICAgZnJvbUV2ZW50KHRoaXMuX25leHRQYWdpbmF0b3IubmF0aXZlRWxlbWVudCwgJ3RvdWNoc3RhcnQnLCBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9oYW5kbGVQYWdpbmF0b3JQcmVzcygnYWZ0ZXInKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIGNvbnN0IGRpckNoYW5nZSA9IHRoaXMuX2RpciA/IHRoaXMuX2Rpci5jaGFuZ2UgOiBvYnNlcnZhYmxlT2YoJ2x0cicpO1xuICAgIGNvbnN0IHJlc2l6ZSA9IHRoaXMuX3ZpZXdwb3J0UnVsZXIuY2hhbmdlKDE1MCk7XG4gICAgY29uc3QgcmVhbGlnbiA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgICAgdGhpcy5fYWxpZ25JbmtCYXJUb1NlbGVjdGVkVGFiKCk7XG4gICAgfTtcblxuICAgIHRoaXMuX2tleU1hbmFnZXIgPSBuZXcgRm9jdXNLZXlNYW5hZ2VyPE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW0+KHRoaXMuX2l0ZW1zKVxuICAgICAgLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24odGhpcy5fZ2V0TGF5b3V0RGlyZWN0aW9uKCkpXG4gICAgICAud2l0aEhvbWVBbmRFbmQoKVxuICAgICAgLndpdGhXcmFwKCk7XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0odGhpcy5fc2VsZWN0ZWRJbmRleCk7XG5cbiAgICAvLyBEZWZlciB0aGUgZmlyc3QgY2FsbCBpbiBvcmRlciB0byBhbGxvdyBmb3Igc2xvd2VyIGJyb3dzZXJzIHRvIGxheSBvdXQgdGhlIGVsZW1lbnRzLlxuICAgIC8vIFRoaXMgaGVscHMgaW4gY2FzZXMgd2hlcmUgdGhlIHVzZXIgbGFuZHMgZGlyZWN0bHkgb24gYSBwYWdlIHdpdGggcGFnaW5hdGVkIHRhYnMuXG4gICAgdHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSAhPT0gJ3VuZGVmaW5lZCcgPyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVhbGlnbikgOiByZWFsaWduKCk7XG5cbiAgICAvLyBPbiBkaXIgY2hhbmdlIG9yIHdpbmRvdyByZXNpemUsIHJlYWxpZ24gdGhlIGluayBiYXIgYW5kIHVwZGF0ZSB0aGUgb3JpZW50YXRpb24gb2ZcbiAgICAvLyB0aGUga2V5IG1hbmFnZXIgaWYgdGhlIGRpcmVjdGlvbiBoYXMgY2hhbmdlZC5cbiAgICBtZXJnZShkaXJDaGFuZ2UsIHJlc2l6ZSwgdGhpcy5faXRlbXMuY2hhbmdlcylcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVmZXIgdGhpcyB0byBnaXZlIHRoZSBicm93c2VyIHNvbWUgdGltZSB0byByZWNhbGN1bGF0ZVxuICAgICAgICAvLyB0aGUgZWxlbWVudCBkaW1lbnNpb25zLiBUaGUgY2FsbCBoYXMgdG8gYmUgd3JhcHBlZCBpbiBgTmdab25lLnJ1bmAsXG4gICAgICAgIC8vIGJlY2F1c2UgdGhlIHZpZXdwb3J0IGNoYW5nZSBoYW5kbGVyIHJ1bnMgb3V0c2lkZSBvZiBBbmd1bGFyLlxuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IFByb21pc2UucmVzb2x2ZSgpLnRoZW4ocmVhbGlnbikpO1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24odGhpcy5fZ2V0TGF5b3V0RGlyZWN0aW9uKCkpO1xuICAgICAgfSk7XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIGNoYW5nZSBpbiB0aGUgZm9jdXMga2V5IG1hbmFnZXIgd2UgbmVlZCB0byBlbWl0IHRoZSBgaW5kZXhGb2N1c2VkYFxuICAgIC8vIGV2ZW50IGluIG9yZGVyIHRvIHByb3ZpZGUgYSBwdWJsaWMgZXZlbnQgdGhhdCBub3RpZmllcyBhYm91dCBmb2N1cyBjaGFuZ2VzLiBBbHNvIHdlIHJlYWxpZ25cbiAgICAvLyB0aGUgdGFicyBjb250YWluZXIgYnkgc2Nyb2xsaW5nIHRoZSBuZXcgZm9jdXNlZCB0YWIgaW50byB0aGUgdmlzaWJsZSBzZWN0aW9uLlxuICAgIHRoaXMuX2tleU1hbmFnZXIuY2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShuZXdGb2N1c0luZGV4ID0+IHtcbiAgICAgIHRoaXMuaW5kZXhGb2N1c2VkLmVtaXQobmV3Rm9jdXNJbmRleCk7XG4gICAgICB0aGlzLl9zZXRUYWJGb2N1cyhuZXdGb2N1c0luZGV4KTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpOiB2b2lkIHtcbiAgICAvLyBJZiB0aGUgbnVtYmVyIG9mIHRhYiBsYWJlbHMgaGF2ZSBjaGFuZ2VkLCBjaGVjayBpZiBzY3JvbGxpbmcgc2hvdWxkIGJlIGVuYWJsZWRcbiAgICBpZiAodGhpcy5fdGFiTGFiZWxDb3VudCAhPSB0aGlzLl9pdGVtcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgICAgdGhpcy5fdGFiTGFiZWxDb3VudCA9IHRoaXMuX2l0ZW1zLmxlbmd0aDtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBzZWxlY3RlZCBpbmRleCBoYXMgY2hhbmdlZCwgc2Nyb2xsIHRvIHRoZSBsYWJlbCBhbmQgY2hlY2sgaWYgdGhlIHNjcm9sbGluZyBjb250cm9sc1xuICAgIC8vIHNob3VsZCBiZSBkaXNhYmxlZC5cbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRJbmRleENoYW5nZWQpIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRvTGFiZWwodGhpcy5fc2VsZWN0ZWRJbmRleCk7XG4gICAgICB0aGlzLl9jaGVja1Njcm9sbGluZ0NvbnRyb2xzKCk7XG4gICAgICB0aGlzLl9hbGlnbklua0JhclRvU2VsZWN0ZWRUYWIoKTtcbiAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXhDaGFuZ2VkID0gZmFsc2U7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgc2Nyb2xsIGRpc3RhbmNlIGhhcyBiZWVuIGNoYW5nZWQgKHRhYiBzZWxlY3RlZCwgZm9jdXNlZCwgc2Nyb2xsIGNvbnRyb2xzIGFjdGl2YXRlZCksXG4gICAgLy8gdGhlbiB0cmFuc2xhdGUgdGhlIGhlYWRlciB0byByZWZsZWN0IHRoaXMuXG4gICAgaWYgKHRoaXMuX3Njcm9sbERpc3RhbmNlQ2hhbmdlZCkge1xuICAgICAgdGhpcy5fdXBkYXRlVGFiU2Nyb2xsUG9zaXRpb24oKTtcbiAgICAgIHRoaXMuX3Njcm9sbERpc3RhbmNlQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9zdG9wU2Nyb2xsaW5nLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlib2FyZCBldmVudHMgb24gdGhlIGhlYWRlci4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBXZSBkb24ndCBoYW5kbGUgYW55IGtleSBiaW5kaW5ncyB3aXRoIGEgbW9kaWZpZXIga2V5LlxuICAgIGlmIChoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgRU5URVI6XG4gICAgICBjYXNlIFNQQUNFOlxuICAgICAgICBpZiAodGhpcy5mb2N1c0luZGV4ICE9PSB0aGlzLnNlbGVjdGVkSW5kZXgpIHtcbiAgICAgICAgICB0aGlzLnNlbGVjdEZvY3VzZWRJbmRleC5lbWl0KHRoaXMuZm9jdXNJbmRleCk7XG4gICAgICAgICAgdGhpcy5faXRlbVNlbGVjdGVkKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIHdoZW4gdGhlIE11dGF0aW9uT2JzZXJ2ZXIgZGV0ZWN0cyB0aGF0IHRoZSBjb250ZW50IGhhcyBjaGFuZ2VkLlxuICAgKi9cbiAgX29uQ29udGVudENoYW5nZXMoKSB7XG4gICAgY29uc3QgdGV4dENvbnRlbnQgPSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQudGV4dENvbnRlbnQ7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGRpZmYgdGhlIHRleHQgY29udGVudCBvZiB0aGUgaGVhZGVyLCBiZWNhdXNlIHRoZSBNdXRhdGlvbk9ic2VydmVyIGNhbGxiYWNrXG4gICAgLy8gd2lsbCBmaXJlIGV2ZW4gaWYgdGhlIHRleHQgY29udGVudCBkaWRuJ3QgY2hhbmdlIHdoaWNoIGlzIGluZWZmaWNpZW50IGFuZCBpcyBwcm9uZVxuICAgIC8vIHRvIGluZmluaXRlIGxvb3BzIGlmIGEgcG9vcmx5IGNvbnN0cnVjdGVkIGV4cHJlc3Npb24gaXMgcGFzc2VkIGluIChzZWUgIzE0MjQ5KS5cbiAgICBpZiAodGV4dENvbnRlbnQgIT09IHRoaXMuX2N1cnJlbnRUZXh0Q29udGVudCkge1xuICAgICAgdGhpcy5fY3VycmVudFRleHRDb250ZW50ID0gdGV4dENvbnRlbnQgfHwgJyc7XG5cbiAgICAgIC8vIFRoZSBjb250ZW50IG9ic2VydmVyIHJ1bnMgb3V0c2lkZSB0aGUgYE5nWm9uZWAgYnkgZGVmYXVsdCwgd2hpY2hcbiAgICAgIC8vIG1lYW5zIHRoYXQgd2UgbmVlZCB0byBicmluZyB0aGUgY2FsbGJhY2sgYmFjayBpbiBvdXJzZWx2ZXMuXG4gICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICAgIHRoaXMuX2FsaWduSW5rQmFyVG9TZWxlY3RlZFRhYigpO1xuICAgICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSB2aWV3IHdoZXRoZXIgcGFnaW5hdGlvbiBzaG91bGQgYmUgZW5hYmxlZCBvciBub3QuXG4gICAqXG4gICAqIFdBUk5JTkc6IENhbGxpbmcgdGhpcyBtZXRob2QgY2FuIGJlIHZlcnkgY29zdGx5IGluIHRlcm1zIG9mIHBlcmZvcm1hbmNlLiBJdCBzaG91bGQgYmUgY2FsbGVkXG4gICAqIGFzIGluZnJlcXVlbnRseSBhcyBwb3NzaWJsZSBmcm9tIG91dHNpZGUgb2YgdGhlIFRhYnMgY29tcG9uZW50IGFzIGl0IGNhdXNlcyBhIHJlZmxvdyBvZiB0aGVcbiAgICogcGFnZS5cbiAgICovXG4gIHVwZGF0ZVBhZ2luYXRpb24oKSB7XG4gICAgdGhpcy5fY2hlY2tQYWdpbmF0aW9uRW5hYmxlZCgpO1xuICAgIHRoaXMuX2NoZWNrU2Nyb2xsaW5nQ29udHJvbHMoKTtcbiAgICB0aGlzLl91cGRhdGVUYWJTY3JvbGxQb3NpdGlvbigpO1xuICB9XG5cbiAgLyoqIFRyYWNrcyB3aGljaCBlbGVtZW50IGhhcyBmb2N1czsgdXNlZCBmb3Iga2V5Ym9hcmQgbmF2aWdhdGlvbiAqL1xuICBnZXQgZm9jdXNJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9rZXlNYW5hZ2VyID8gdGhpcy5fa2V5TWFuYWdlci5hY3RpdmVJdGVtSW5kZXghIDogMDtcbiAgfVxuXG4gIC8qKiBXaGVuIHRoZSBmb2N1cyBpbmRleCBpcyBzZXQsIHdlIG11c3QgbWFudWFsbHkgc2VuZCBmb2N1cyB0byB0aGUgY29ycmVjdCBsYWJlbCAqL1xuICBzZXQgZm9jdXNJbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKCF0aGlzLl9pc1ZhbGlkSW5kZXgodmFsdWUpIHx8IHRoaXMuZm9jdXNJbmRleCA9PT0gdmFsdWUgfHwgIXRoaXMuX2tleU1hbmFnZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnNldEFjdGl2ZUl0ZW0odmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgaWYgYW4gaW5kZXggaXMgdmFsaWQuICBJZiB0aGUgdGFicyBhcmUgbm90IHJlYWR5IHlldCwgd2UgYXNzdW1lIHRoYXQgdGhlIHVzZXIgaXNcbiAgICogcHJvdmlkaW5nIGEgdmFsaWQgaW5kZXggYW5kIHJldHVybiB0cnVlLlxuICAgKi9cbiAgX2lzVmFsaWRJbmRleChpbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgaWYgKCF0aGlzLl9pdGVtcykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgdGFiID0gdGhpcy5faXRlbXMgPyB0aGlzLl9pdGVtcy50b0FycmF5KClbaW5kZXhdIDogbnVsbDtcbiAgICByZXR1cm4gISF0YWIgJiYgIXRhYi5kaXNhYmxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGZvY3VzIG9uIHRoZSBIVE1MIGVsZW1lbnQgZm9yIHRoZSBsYWJlbCB3cmFwcGVyIGFuZCBzY3JvbGxzIGl0IGludG8gdGhlIHZpZXcgaWZcbiAgICogc2Nyb2xsaW5nIGlzIGVuYWJsZWQuXG4gICAqL1xuICBfc2V0VGFiRm9jdXModGFiSW5kZXg6IG51bWJlcikge1xuICAgIGlmICh0aGlzLl9zaG93UGFnaW5hdGlvbkNvbnRyb2xzKSB7XG4gICAgICB0aGlzLl9zY3JvbGxUb0xhYmVsKHRhYkluZGV4KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5faXRlbXMgJiYgdGhpcy5faXRlbXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLl9pdGVtcy50b0FycmF5KClbdGFiSW5kZXhdLmZvY3VzKCk7XG5cbiAgICAgIC8vIERvIG5vdCBsZXQgdGhlIGJyb3dzZXIgbWFuYWdlIHNjcm9sbGluZyB0byBmb2N1cyB0aGUgZWxlbWVudCwgdGhpcyB3aWxsIGJlIGhhbmRsZWRcbiAgICAgIC8vIGJ5IHVzaW5nIHRyYW5zbGF0aW9uLiBJbiBMVFIsIHRoZSBzY3JvbGwgbGVmdCBzaG91bGQgYmUgMC4gSW4gUlRMLCB0aGUgc2Nyb2xsIHdpZHRoXG4gICAgICAvLyBzaG91bGQgYmUgdGhlIGZ1bGwgd2lkdGggbWludXMgdGhlIG9mZnNldCB3aWR0aC5cbiAgICAgIGNvbnN0IGNvbnRhaW5lckVsID0gdGhpcy5fdGFiTGlzdENvbnRhaW5lci5uYXRpdmVFbGVtZW50O1xuICAgICAgY29uc3QgZGlyID0gdGhpcy5fZ2V0TGF5b3V0RGlyZWN0aW9uKCk7XG5cbiAgICAgIGlmIChkaXIgPT0gJ2x0cicpIHtcbiAgICAgICAgY29udGFpbmVyRWwuc2Nyb2xsTGVmdCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250YWluZXJFbC5zY3JvbGxMZWZ0ID0gY29udGFpbmVyRWwuc2Nyb2xsV2lkdGggLSBjb250YWluZXJFbC5vZmZzZXRXaWR0aDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKiogVGhlIGxheW91dCBkaXJlY3Rpb24gb2YgdGhlIGNvbnRhaW5pbmcgYXBwLiAqL1xuICBfZ2V0TGF5b3V0RGlyZWN0aW9uKCk6IERpcmVjdGlvbiB7XG4gICAgcmV0dXJuIHRoaXMuX2RpciAmJiB0aGlzLl9kaXIudmFsdWUgPT09ICdydGwnID8gJ3J0bCcgOiAnbHRyJztcbiAgfVxuXG4gIC8qKiBQZXJmb3JtcyB0aGUgQ1NTIHRyYW5zZm9ybWF0aW9uIG9uIHRoZSB0YWIgbGlzdCB0aGF0IHdpbGwgY2F1c2UgdGhlIGxpc3QgdG8gc2Nyb2xsLiAqL1xuICBfdXBkYXRlVGFiU2Nyb2xsUG9zaXRpb24oKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZVBhZ2luYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzY3JvbGxEaXN0YW5jZSA9IHRoaXMuc2Nyb2xsRGlzdGFuY2U7XG4gICAgY29uc3QgdHJhbnNsYXRlWCA9IHRoaXMuX2dldExheW91dERpcmVjdGlvbigpID09PSAnbHRyJyA/IC1zY3JvbGxEaXN0YW5jZSA6IHNjcm9sbERpc3RhbmNlO1xuXG4gICAgLy8gRG9uJ3QgdXNlIGB0cmFuc2xhdGUzZGAgaGVyZSBiZWNhdXNlIHdlIGRvbid0IHdhbnQgdG8gY3JlYXRlIGEgbmV3IGxheWVyLiBBIG5ldyBsYXllclxuICAgIC8vIHNlZW1zIHRvIGNhdXNlIGZsaWNrZXJpbmcgYW5kIG92ZXJmbG93IGluIEludGVybmV0IEV4cGxvcmVyLiBGb3IgZXhhbXBsZSwgdGhlIGluayBiYXJcbiAgICAvLyBhbmQgcmlwcGxlcyB3aWxsIGV4Y2VlZCB0aGUgYm91bmRhcmllcyBvZiB0aGUgdmlzaWJsZSB0YWIgYmFyLlxuICAgIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvY29tcG9uZW50cy9pc3N1ZXMvMTAyNzZcbiAgICAvLyBXZSByb3VuZCB0aGUgYHRyYW5zZm9ybWAgaGVyZSwgYmVjYXVzZSB0cmFuc2Zvcm1zIHdpdGggc3ViLXBpeGVsIHByZWNpc2lvbiBjYXVzZSBzb21lXG4gICAgLy8gYnJvd3NlcnMgdG8gYmx1ciB0aGUgY29udGVudCBvZiB0aGUgZWxlbWVudC5cbiAgICB0aGlzLl90YWJMaXN0Lm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZVgoJHtNYXRoLnJvdW5kKHRyYW5zbGF0ZVgpfXB4KWA7XG5cbiAgICAvLyBTZXR0aW5nIHRoZSBgdHJhbnNmb3JtYCBvbiBJRSB3aWxsIGNoYW5nZSB0aGUgc2Nyb2xsIG9mZnNldCBvZiB0aGUgcGFyZW50LCBjYXVzaW5nIHRoZVxuICAgIC8vIHBvc2l0aW9uIHRvIGJlIHRocm93biBvZmYgaW4gc29tZSBjYXNlcy4gV2UgaGF2ZSB0byByZXNldCBpdCBvdXJzZWx2ZXMgdG8gZW5zdXJlIHRoYXRcbiAgICAvLyBpdCBkb2Vzbid0IGdldCB0aHJvd24gb2ZmLiBOb3RlIHRoYXQgd2Ugc2NvcGUgaXQgb25seSB0byBJRSBhbmQgRWRnZSwgYmVjYXVzZSBtZXNzaW5nXG4gICAgLy8gd2l0aCB0aGUgc2Nyb2xsIHBvc2l0aW9uIHRocm93cyBvZmYgQ2hyb21lIDcxKyBpbiBSVEwgbW9kZSAoc2VlICMxNDY4OSkuXG4gICAgaWYgKHRoaXMuX3BsYXRmb3JtLlRSSURFTlQgfHwgdGhpcy5fcGxhdGZvcm0uRURHRSkge1xuICAgICAgdGhpcy5fdGFiTGlzdENvbnRhaW5lci5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBkaXN0YW5jZSBpbiBwaXhlbHMgdGhhdCB0aGUgdGFiIGhlYWRlciBzaG91bGQgYmUgdHJhbnNmb3JtZWQgaW4gdGhlIFgtYXhpcy4gKi9cbiAgZ2V0IHNjcm9sbERpc3RhbmNlKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3Njcm9sbERpc3RhbmNlO1xuICB9XG4gIHNldCBzY3JvbGxEaXN0YW5jZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fc2Nyb2xsVG8odmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIHRoZSB0YWIgbGlzdCBpbiB0aGUgJ2JlZm9yZScgb3IgJ2FmdGVyJyBkaXJlY3Rpb24gKHRvd2FyZHMgdGhlIGJlZ2lubmluZyBvZiB0aGUgbGlzdCBvclxuICAgKiB0aGUgZW5kIG9mIHRoZSBsaXN0LCByZXNwZWN0aXZlbHkpLiBUaGUgZGlzdGFuY2UgdG8gc2Nyb2xsIGlzIGNvbXB1dGVkIHRvIGJlIGEgdGhpcmQgb2YgdGhlXG4gICAqIGxlbmd0aCBvZiB0aGUgdGFiIGxpc3QgdmlldyB3aW5kb3cuXG4gICAqXG4gICAqIFRoaXMgaXMgYW4gZXhwZW5zaXZlIGNhbGwgdGhhdCBmb3JjZXMgYSBsYXlvdXQgcmVmbG93IHRvIGNvbXB1dGUgYm94IGFuZCBzY3JvbGwgbWV0cmljcyBhbmRcbiAgICogc2hvdWxkIGJlIGNhbGxlZCBzcGFyaW5nbHkuXG4gICAqL1xuICBfc2Nyb2xsSGVhZGVyKGRpcmVjdGlvbjogU2Nyb2xsRGlyZWN0aW9uKSB7XG4gICAgY29uc3Qgdmlld0xlbmd0aCA9IHRoaXMuX3RhYkxpc3RDb250YWluZXIubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcblxuICAgIC8vIE1vdmUgdGhlIHNjcm9sbCBkaXN0YW5jZSBvbmUtdGhpcmQgdGhlIGxlbmd0aCBvZiB0aGUgdGFiIGxpc3QncyB2aWV3cG9ydC5cbiAgICBjb25zdCBzY3JvbGxBbW91bnQgPSAoKGRpcmVjdGlvbiA9PSAnYmVmb3JlJyA/IC0xIDogMSkgKiB2aWV3TGVuZ3RoKSAvIDM7XG5cbiAgICByZXR1cm4gdGhpcy5fc2Nyb2xsVG8odGhpcy5fc2Nyb2xsRGlzdGFuY2UgKyBzY3JvbGxBbW91bnQpO1xuICB9XG5cbiAgLyoqIEhhbmRsZXMgY2xpY2sgZXZlbnRzIG9uIHRoZSBwYWdpbmF0aW9uIGFycm93cy4gKi9cbiAgX2hhbmRsZVBhZ2luYXRvckNsaWNrKGRpcmVjdGlvbjogU2Nyb2xsRGlyZWN0aW9uKSB7XG4gICAgdGhpcy5fc3RvcEludGVydmFsKCk7XG4gICAgdGhpcy5fc2Nyb2xsSGVhZGVyKGRpcmVjdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogTW92ZXMgdGhlIHRhYiBsaXN0IHN1Y2ggdGhhdCB0aGUgZGVzaXJlZCB0YWIgbGFiZWwgKG1hcmtlZCBieSBpbmRleCkgaXMgbW92ZWQgaW50byB2aWV3LlxuICAgKlxuICAgKiBUaGlzIGlzIGFuIGV4cGVuc2l2ZSBjYWxsIHRoYXQgZm9yY2VzIGEgbGF5b3V0IHJlZmxvdyB0byBjb21wdXRlIGJveCBhbmQgc2Nyb2xsIG1ldHJpY3MgYW5kXG4gICAqIHNob3VsZCBiZSBjYWxsZWQgc3BhcmluZ2x5LlxuICAgKi9cbiAgX3Njcm9sbFRvTGFiZWwobGFiZWxJbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZVBhZ2luYXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzZWxlY3RlZExhYmVsID0gdGhpcy5faXRlbXMgPyB0aGlzLl9pdGVtcy50b0FycmF5KClbbGFiZWxJbmRleF0gOiBudWxsO1xuXG4gICAgaWYgKCFzZWxlY3RlZExhYmVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIHZpZXcgbGVuZ3RoIGlzIHRoZSB2aXNpYmxlIHdpZHRoIG9mIHRoZSB0YWIgbGFiZWxzLlxuICAgIGNvbnN0IHZpZXdMZW5ndGggPSB0aGlzLl90YWJMaXN0Q29udGFpbmVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgY29uc3Qge29mZnNldExlZnQsIG9mZnNldFdpZHRofSA9IHNlbGVjdGVkTGFiZWwuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgbGV0IGxhYmVsQmVmb3JlUG9zOiBudW1iZXIsIGxhYmVsQWZ0ZXJQb3M6IG51bWJlcjtcbiAgICBpZiAodGhpcy5fZ2V0TGF5b3V0RGlyZWN0aW9uKCkgPT0gJ2x0cicpIHtcbiAgICAgIGxhYmVsQmVmb3JlUG9zID0gb2Zmc2V0TGVmdDtcbiAgICAgIGxhYmVsQWZ0ZXJQb3MgPSBsYWJlbEJlZm9yZVBvcyArIG9mZnNldFdpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYWJlbEFmdGVyUG9zID0gdGhpcy5fdGFiTGlzdElubmVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGggLSBvZmZzZXRMZWZ0O1xuICAgICAgbGFiZWxCZWZvcmVQb3MgPSBsYWJlbEFmdGVyUG9zIC0gb2Zmc2V0V2lkdGg7XG4gICAgfVxuXG4gICAgY29uc3QgYmVmb3JlVmlzaWJsZVBvcyA9IHRoaXMuc2Nyb2xsRGlzdGFuY2U7XG4gICAgY29uc3QgYWZ0ZXJWaXNpYmxlUG9zID0gdGhpcy5zY3JvbGxEaXN0YW5jZSArIHZpZXdMZW5ndGg7XG5cbiAgICBpZiAobGFiZWxCZWZvcmVQb3MgPCBiZWZvcmVWaXNpYmxlUG9zKSB7XG4gICAgICAvLyBTY3JvbGwgaGVhZGVyIHRvIG1vdmUgbGFiZWwgdG8gdGhlIGJlZm9yZSBkaXJlY3Rpb25cbiAgICAgIHRoaXMuc2Nyb2xsRGlzdGFuY2UgLT0gYmVmb3JlVmlzaWJsZVBvcyAtIGxhYmVsQmVmb3JlUG9zICsgRVhBR0dFUkFURURfT1ZFUlNDUk9MTDtcbiAgICB9IGVsc2UgaWYgKGxhYmVsQWZ0ZXJQb3MgPiBhZnRlclZpc2libGVQb3MpIHtcbiAgICAgIC8vIFNjcm9sbCBoZWFkZXIgdG8gbW92ZSBsYWJlbCB0byB0aGUgYWZ0ZXIgZGlyZWN0aW9uXG4gICAgICB0aGlzLnNjcm9sbERpc3RhbmNlICs9IGxhYmVsQWZ0ZXJQb3MgLSBhZnRlclZpc2libGVQb3MgKyBFWEFHR0VSQVRFRF9PVkVSU0NST0xMO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFdmFsdWF0ZSB3aGV0aGVyIHRoZSBwYWdpbmF0aW9uIGNvbnRyb2xzIHNob3VsZCBiZSBkaXNwbGF5ZWQuIElmIHRoZSBzY3JvbGwgd2lkdGggb2YgdGhlXG4gICAqIHRhYiBsaXN0IGlzIHdpZGVyIHRoYW4gdGhlIHNpemUgb2YgdGhlIGhlYWRlciBjb250YWluZXIsIHRoZW4gdGhlIHBhZ2luYXRpb24gY29udHJvbHMgc2hvdWxkXG4gICAqIGJlIHNob3duLlxuICAgKlxuICAgKiBUaGlzIGlzIGFuIGV4cGVuc2l2ZSBjYWxsIHRoYXQgZm9yY2VzIGEgbGF5b3V0IHJlZmxvdyB0byBjb21wdXRlIGJveCBhbmQgc2Nyb2xsIG1ldHJpY3MgYW5kXG4gICAqIHNob3VsZCBiZSBjYWxsZWQgc3BhcmluZ2x5LlxuICAgKi9cbiAgX2NoZWNrUGFnaW5hdGlvbkVuYWJsZWQoKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZVBhZ2luYXRpb24pIHtcbiAgICAgIHRoaXMuX3Nob3dQYWdpbmF0aW9uQ29udHJvbHMgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaXNFbmFibGVkID1cbiAgICAgICAgdGhpcy5fdGFiTGlzdElubmVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsV2lkdGggPiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG5cbiAgICAgIGlmICghaXNFbmFibGVkKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsRGlzdGFuY2UgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNFbmFibGVkICE9PSB0aGlzLl9zaG93UGFnaW5hdGlvbkNvbnRyb2xzKSB7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zaG93UGFnaW5hdGlvbkNvbnRyb2xzID0gaXNFbmFibGVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFdmFsdWF0ZSB3aGV0aGVyIHRoZSBiZWZvcmUgYW5kIGFmdGVyIGNvbnRyb2xzIHNob3VsZCBiZSBlbmFibGVkIG9yIGRpc2FibGVkLlxuICAgKiBJZiB0aGUgaGVhZGVyIGlzIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGxpc3QgKHNjcm9sbCBkaXN0YW5jZSBpcyBlcXVhbCB0byAwKSB0aGVuIGRpc2FibGUgdGhlXG4gICAqIGJlZm9yZSBidXR0b24uIElmIHRoZSBoZWFkZXIgaXMgYXQgdGhlIGVuZCBvZiB0aGUgbGlzdCAoc2Nyb2xsIGRpc3RhbmNlIGlzIGVxdWFsIHRvIHRoZVxuICAgKiBtYXhpbXVtIGRpc3RhbmNlIHdlIGNhbiBzY3JvbGwpLCB0aGVuIGRpc2FibGUgdGhlIGFmdGVyIGJ1dHRvbi5cbiAgICpcbiAgICogVGhpcyBpcyBhbiBleHBlbnNpdmUgY2FsbCB0aGF0IGZvcmNlcyBhIGxheW91dCByZWZsb3cgdG8gY29tcHV0ZSBib3ggYW5kIHNjcm9sbCBtZXRyaWNzIGFuZFxuICAgKiBzaG91bGQgYmUgY2FsbGVkIHNwYXJpbmdseS5cbiAgICovXG4gIF9jaGVja1Njcm9sbGluZ0NvbnRyb2xzKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVQYWdpbmF0aW9uKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlU2Nyb2xsQWZ0ZXIgPSB0aGlzLl9kaXNhYmxlU2Nyb2xsQmVmb3JlID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBhZ2luYXRpb24gYXJyb3dzIHNob3VsZCBiZSBhY3RpdmF0ZWQuXG4gICAgICB0aGlzLl9kaXNhYmxlU2Nyb2xsQmVmb3JlID0gdGhpcy5zY3JvbGxEaXN0YW5jZSA9PSAwO1xuICAgICAgdGhpcy5fZGlzYWJsZVNjcm9sbEFmdGVyID0gdGhpcy5zY3JvbGxEaXN0YW5jZSA9PSB0aGlzLl9nZXRNYXhTY3JvbGxEaXN0YW5jZSgpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hhdCBpcyB0aGUgbWF4aW11bSBsZW5ndGggaW4gcGl4ZWxzIHRoYXQgY2FuIGJlIHNldCBmb3IgdGhlIHNjcm9sbCBkaXN0YW5jZS4gVGhpc1xuICAgKiBpcyBlcXVhbCB0byB0aGUgZGlmZmVyZW5jZSBpbiB3aWR0aCBiZXR3ZWVuIHRoZSB0YWIgbGlzdCBjb250YWluZXIgYW5kIHRhYiBoZWFkZXIgY29udGFpbmVyLlxuICAgKlxuICAgKiBUaGlzIGlzIGFuIGV4cGVuc2l2ZSBjYWxsIHRoYXQgZm9yY2VzIGEgbGF5b3V0IHJlZmxvdyB0byBjb21wdXRlIGJveCBhbmQgc2Nyb2xsIG1ldHJpY3MgYW5kXG4gICAqIHNob3VsZCBiZSBjYWxsZWQgc3BhcmluZ2x5LlxuICAgKi9cbiAgX2dldE1heFNjcm9sbERpc3RhbmNlKCk6IG51bWJlciB7XG4gICAgY29uc3QgbGVuZ3RoT2ZUYWJMaXN0ID0gdGhpcy5fdGFiTGlzdElubmVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsV2lkdGg7XG4gICAgY29uc3Qgdmlld0xlbmd0aCA9IHRoaXMuX3RhYkxpc3RDb250YWluZXIubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICByZXR1cm4gbGVuZ3RoT2ZUYWJMaXN0IC0gdmlld0xlbmd0aCB8fCAwO1xuICB9XG5cbiAgLyoqIFRlbGxzIHRoZSBpbmstYmFyIHRvIGFsaWduIGl0c2VsZiB0byB0aGUgY3VycmVudCBsYWJlbCB3cmFwcGVyICovXG4gIF9hbGlnbklua0JhclRvU2VsZWN0ZWRUYWIoKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtID1cbiAgICAgIHRoaXMuX2l0ZW1zICYmIHRoaXMuX2l0ZW1zLmxlbmd0aCA/IHRoaXMuX2l0ZW1zLnRvQXJyYXkoKVt0aGlzLnNlbGVjdGVkSW5kZXhdIDogbnVsbDtcbiAgICBjb25zdCBzZWxlY3RlZExhYmVsV3JhcHBlciA9IHNlbGVjdGVkSXRlbSA/IHNlbGVjdGVkSXRlbS5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuXG4gICAgaWYgKHNlbGVjdGVkTGFiZWxXcmFwcGVyKSB7XG4gICAgICB0aGlzLl9pbmtCYXIuYWxpZ25Ub0VsZW1lbnQoc2VsZWN0ZWRMYWJlbFdyYXBwZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pbmtCYXIuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTdG9wcyB0aGUgY3VycmVudGx5LXJ1bm5pbmcgcGFnaW5hdG9yIGludGVydmFsLiAgKi9cbiAgX3N0b3BJbnRlcnZhbCgpIHtcbiAgICB0aGlzLl9zdG9wU2Nyb2xsaW5nLm5leHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRoZSB1c2VyIHByZXNzaW5nIGRvd24gb24gb25lIG9mIHRoZSBwYWdpbmF0b3JzLlxuICAgKiBTdGFydHMgc2Nyb2xsaW5nIHRoZSBoZWFkZXIgYWZ0ZXIgYSBjZXJ0YWluIGFtb3VudCBvZiB0aW1lLlxuICAgKiBAcGFyYW0gZGlyZWN0aW9uIEluIHdoaWNoIGRpcmVjdGlvbiB0aGUgcGFnaW5hdG9yIHNob3VsZCBiZSBzY3JvbGxlZC5cbiAgICovXG4gIF9oYW5kbGVQYWdpbmF0b3JQcmVzcyhkaXJlY3Rpb246IFNjcm9sbERpcmVjdGlvbiwgbW91c2VFdmVudD86IE1vdXNlRXZlbnQpIHtcbiAgICAvLyBEb24ndCBzdGFydCBhdXRvIHNjcm9sbGluZyBmb3IgcmlnaHQgbW91c2UgYnV0dG9uIGNsaWNrcy4gTm90ZSB0aGF0IHdlIHNob3VsZG4ndCBoYXZlIHRvXG4gICAgLy8gbnVsbCBjaGVjayB0aGUgYGJ1dHRvbmAsIGJ1dCB3ZSBkbyBpdCBzbyB3ZSBkb24ndCBicmVhayB0ZXN0cyB0aGF0IHVzZSBmYWtlIGV2ZW50cy5cbiAgICBpZiAobW91c2VFdmVudCAmJiBtb3VzZUV2ZW50LmJ1dHRvbiAhPSBudWxsICYmIG1vdXNlRXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQXZvaWQgb3ZlcmxhcHBpbmcgdGltZXJzLlxuICAgIHRoaXMuX3N0b3BJbnRlcnZhbCgpO1xuXG4gICAgLy8gU3RhcnQgYSB0aW1lciBhZnRlciB0aGUgZGVsYXkgYW5kIGtlZXAgZmlyaW5nIGJhc2VkIG9uIHRoZSBpbnRlcnZhbC5cbiAgICB0aW1lcihIRUFERVJfU0NST0xMX0RFTEFZLCBIRUFERVJfU0NST0xMX0lOVEVSVkFMKVxuICAgICAgLy8gS2VlcCB0aGUgdGltZXIgZ29pbmcgdW50aWwgc29tZXRoaW5nIHRlbGxzIGl0IHRvIHN0b3Agb3IgdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuXG4gICAgICAucGlwZSh0YWtlVW50aWwobWVyZ2UodGhpcy5fc3RvcFNjcm9sbGluZywgdGhpcy5fZGVzdHJveWVkKSkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgY29uc3Qge21heFNjcm9sbERpc3RhbmNlLCBkaXN0YW5jZX0gPSB0aGlzLl9zY3JvbGxIZWFkZXIoZGlyZWN0aW9uKTtcblxuICAgICAgICAvLyBTdG9wIHRoZSB0aW1lciBpZiB3ZSd2ZSByZWFjaGVkIHRoZSBzdGFydCBvciB0aGUgZW5kLlxuICAgICAgICBpZiAoZGlzdGFuY2UgPT09IDAgfHwgZGlzdGFuY2UgPj0gbWF4U2Nyb2xsRGlzdGFuY2UpIHtcbiAgICAgICAgICB0aGlzLl9zdG9wSW50ZXJ2YWwoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2Nyb2xscyB0aGUgaGVhZGVyIHRvIGEgZ2l2ZW4gcG9zaXRpb24uXG4gICAqIEBwYXJhbSBwb3NpdGlvbiBQb3NpdGlvbiB0byB3aGljaCB0byBzY3JvbGwuXG4gICAqIEByZXR1cm5zIEluZm9ybWF0aW9uIG9uIHRoZSBjdXJyZW50IHNjcm9sbCBkaXN0YW5jZSBhbmQgdGhlIG1heGltdW0uXG4gICAqL1xuICBwcml2YXRlIF9zY3JvbGxUbyhwb3NpdGlvbjogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZVBhZ2luYXRpb24pIHtcbiAgICAgIHJldHVybiB7bWF4U2Nyb2xsRGlzdGFuY2U6IDAsIGRpc3RhbmNlOiAwfTtcbiAgICB9XG5cbiAgICBjb25zdCBtYXhTY3JvbGxEaXN0YW5jZSA9IHRoaXMuX2dldE1heFNjcm9sbERpc3RhbmNlKCk7XG4gICAgdGhpcy5fc2Nyb2xsRGlzdGFuY2UgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihtYXhTY3JvbGxEaXN0YW5jZSwgcG9zaXRpb24pKTtcblxuICAgIC8vIE1hcmsgdGhhdCB0aGUgc2Nyb2xsIGRpc3RhbmNlIGhhcyBjaGFuZ2VkIHNvIHRoYXQgYWZ0ZXIgdGhlIHZpZXcgaXMgY2hlY2tlZCwgdGhlIENTU1xuICAgIC8vIHRyYW5zZm9ybWF0aW9uIGNhbiBtb3ZlIHRoZSBoZWFkZXIuXG4gICAgdGhpcy5fc2Nyb2xsRGlzdGFuY2VDaGFuZ2VkID0gdHJ1ZTtcbiAgICB0aGlzLl9jaGVja1Njcm9sbGluZ0NvbnRyb2xzKCk7XG5cbiAgICByZXR1cm4ge21heFNjcm9sbERpc3RhbmNlLCBkaXN0YW5jZTogdGhpcy5fc2Nyb2xsRGlzdGFuY2V9O1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3NlbGVjdGVkSW5kZXg6IE51bWJlcklucHV0O1xufVxuIl19
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, ElementRef, NgZone, Optional, EventEmitter, Directive, Inject, Input, } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty, coerceNumberProperty, } from '@angular/cdk/coercion';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { ENTER, SPACE, hasModifierKey } from '@angular/cdk/keycodes';
import { merge, of as observableOf, Subject, EMPTY, Observable, timer, fromEvent, } from 'rxjs';
import { take, switchMap, startWith, skip, takeUntil, filter } from 'rxjs/operators';
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
    /**
     * Whether pagination should be disabled. This can be used to avoid unnecessary
     * layout recalculations if it's known that pagination won't be required.
     */
    get disablePagination() {
        return this._disablePagination;
    }
    set disablePagination(value) {
        this._disablePagination = coerceBooleanProperty(value);
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
        this._disablePagination = false;
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
            .withWrap()
            // Allow focus to land on disabled tabs, as per https://w3c.github.io/aria-practices/#kbd_disabled_controls
            .skipPredicate(() => false);
        this._keyManager.updateActiveItem(this._selectedIndex);
        // Defer the first call in order to allow for slower browsers to lay out the elements.
        // This helps in cases where the user lands directly on a page with paginated tabs.
        // Note that we use `onStable` instead of `requestAnimationFrame`, because the latter
        // can hold up tests that are in a background tab.
        this._ngZone.onStable.pipe(take(1)).subscribe(realign);
        // On dir change or window resize, realign the ink bar and update the orientation of
        // the key manager if the direction has changed.
        merge(dirChange, resize, this._items.changes, this._itemsResized())
            .pipe(takeUntil(this._destroyed))
            .subscribe(() => {
            // We need to defer this to give the browser some time to recalculate
            // the element dimensions. The call has to be wrapped in `NgZone.run`,
            // because the viewport change handler runs outside of Angular.
            this._ngZone.run(() => {
                Promise.resolve().then(() => {
                    // Clamp the scroll distance, because it can change with the number of tabs.
                    this._scrollDistance = Math.max(0, Math.min(this._getMaxScrollDistance(), this._scrollDistance));
                    realign();
                });
            });
            this._keyManager.withHorizontalOrientation(this._getLayoutDirection());
        });
        // If there is a change in the focus key manager we need to emit the `indexFocused`
        // event in order to provide a public event that notifies about focus changes. Also we realign
        // the tabs container by scrolling the new focused tab into the visible section.
        this._keyManager.change.subscribe(newFocusIndex => {
            this.indexFocused.emit(newFocusIndex);
            this._setTabFocus(newFocusIndex);
        });
    }
    /** Sends any changes that could affect the layout of the items. */
    _itemsResized() {
        if (typeof ResizeObserver !== 'function') {
            return EMPTY;
        }
        return this._items.changes.pipe(startWith(this._items), switchMap((tabItems) => new Observable((observer) => this._ngZone.runOutsideAngular(() => {
            const resizeObserver = new ResizeObserver(entries => observer.next(entries));
            tabItems.forEach(item => resizeObserver.observe(item.elementRef.nativeElement));
            return () => {
                resizeObserver.disconnect();
            };
        }))), 
        // Skip the first emit since the resize observer emits when an item
        // is observed for new items when the tab is already inserted
        skip(1), 
        // Skip emissions where all the elements are invisible since we don't want
        // the header to try and re-render with invalid measurements. See #25574.
        filter(entries => entries.some(e => e.contentRect.width > 0 && e.contentRect.height > 0)));
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
        this._keyManager?.destroy();
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
                    const item = this._items.get(this.focusIndex);
                    if (item && !item.disabled) {
                        this.selectFocusedIndex.emit(this.focusIndex);
                        this._itemSelected(event);
                    }
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
        return this._items ? !!this._items.toArray()[index] : true;
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
            this.scrollDistance -= beforeVisiblePos - labelBeforePos;
        }
        else if (labelAfterPos > afterVisiblePos) {
            // Scroll header to move label to the after direction
            this.scrollDistance += Math.min(labelAfterPos - afterVisiblePos, labelBeforePos - beforeVisiblePos);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatPaginatedTabHeader, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }, { token: i1.ViewportRuler }, { token: i2.Directionality, optional: true }, { token: i0.NgZone }, { token: i3.Platform }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.1", type: MatPaginatedTabHeader, inputs: { disablePagination: "disablePagination" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatPaginatedTabHeader, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGVkLXRhYi1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy9wYWdpbmF0ZWQtdGFiLWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUVSLFlBQVksRUFLWixTQUFTLEVBQ1QsTUFBTSxFQUNOLEtBQUssR0FDTixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQVksY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDNUQsT0FBTyxFQUVMLHFCQUFxQixFQUNyQixvQkFBb0IsR0FFckIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFDLGVBQWUsRUFBa0IsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRSxPQUFPLEVBQ0wsS0FBSyxFQUNMLEVBQUUsSUFBSSxZQUFZLEVBQ2xCLE9BQU8sRUFDUCxLQUFLLEVBRUwsVUFBVSxFQUNWLEtBQUssRUFDTCxTQUFTLEdBQ1YsTUFBTSxNQUFNLENBQUM7QUFDZCxPQUFPLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRixPQUFPLEVBQUMsUUFBUSxFQUFFLCtCQUErQixFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFDaEYsT0FBTyxFQUFDLHFCQUFxQixFQUFDLE1BQU0sc0NBQXNDLENBQUM7Ozs7O0FBRTNFLGtEQUFrRDtBQUNsRCxNQUFNLDJCQUEyQixHQUFHLCtCQUErQixDQUFDO0lBQ2xF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dGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIE5nWm9uZSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgRXZlbnRFbWl0dGVyLFxuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LFxuICBPbkRlc3Ryb3ksXG4gIERpcmVjdGl2ZSxcbiAgSW5qZWN0LFxuICBJbnB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RpcmVjdGlvbiwgRGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEJvb2xlYW5JbnB1dCxcbiAgY29lcmNlQm9vbGVhblByb3BlcnR5LFxuICBjb2VyY2VOdW1iZXJQcm9wZXJ0eSxcbiAgTnVtYmVySW5wdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtGb2N1c0tleU1hbmFnZXIsIEZvY3VzYWJsZU9wdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtFTlRFUiwgU1BBQ0UsIGhhc01vZGlmaWVyS2V5fSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgbWVyZ2UsXG4gIG9mIGFzIG9ic2VydmFibGVPZixcbiAgU3ViamVjdCxcbiAgRU1QVFksXG4gIE9ic2VydmVyLFxuICBPYnNlcnZhYmxlLFxuICB0aW1lcixcbiAgZnJvbUV2ZW50LFxufSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZSwgc3dpdGNoTWFwLCBzdGFydFdpdGgsIHNraXAsIHRha2VVbnRpbCwgZmlsdGVyfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge1BsYXRmb3JtLCBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtBTklNQVRJT05fTU9EVUxFX1RZUEV9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9ucyc7XG5cbi8qKiBDb25maWcgdXNlZCB0byBiaW5kIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXJzICovXG5jb25zdCBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMgPSBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtcbiAgcGFzc2l2ZTogdHJ1ZSxcbn0pIGFzIEV2ZW50TGlzdGVuZXJPcHRpb25zO1xuXG4vKipcbiAqIFRoZSBkaXJlY3Rpb25zIHRoYXQgc2Nyb2xsaW5nIGNhbiBnbyBpbiB3aGVuIHRoZSBoZWFkZXIncyB0YWJzIGV4Y2VlZCB0aGUgaGVhZGVyIHdpZHRoLiAnQWZ0ZXInXG4gKiB3aWxsIHNjcm9sbCB0aGUgaGVhZGVyIHRvd2FyZHMgdGhlIGVuZCBvZiB0aGUgdGFicyBsaXN0IGFuZCAnYmVmb3JlJyB3aWxsIHNjcm9sbCB0b3dhcmRzIHRoZVxuICogYmVnaW5uaW5nIG9mIHRoZSBsaXN0LlxuICovXG5leHBvcnQgdHlwZSBTY3JvbGxEaXJlY3Rpb24gPSAnYWZ0ZXInIHwgJ2JlZm9yZSc7XG5cbi8qKlxuICogQW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBzdGFydGluZyB0byBzY3JvbGwgdGhlIGhlYWRlciBhdXRvbWF0aWNhbGx5LlxuICogU2V0IGEgbGl0dGxlIGNvbnNlcnZhdGl2ZWx5IGluIG9yZGVyIHRvIGhhbmRsZSBmYWtlIGV2ZW50cyBkaXNwYXRjaGVkIG9uIHRvdWNoIGRldmljZXMuXG4gKi9cbmNvbnN0IEhFQURFUl9TQ1JPTExfREVMQVkgPSA2NTA7XG5cbi8qKlxuICogSW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzIGF0IHdoaWNoIHRvIHNjcm9sbCB0aGUgaGVhZGVyXG4gKiB3aGlsZSB0aGUgdXNlciBpcyBob2xkaW5nIHRoZWlyIHBvaW50ZXIuXG4gKi9cbmNvbnN0IEhFQURFUl9TQ1JPTExfSU5URVJWQUwgPSAxMDA7XG5cbi8qKiBJdGVtIGluc2lkZSBhIHBhZ2luYXRlZCB0YWIgaGVhZGVyLiAqL1xuZXhwb3J0IHR5cGUgTWF0UGFnaW5hdGVkVGFiSGVhZGVySXRlbSA9IEZvY3VzYWJsZU9wdGlvbiAmIHtlbGVtZW50UmVmOiBFbGVtZW50UmVmfTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBhIHRhYiBoZWFkZXIgdGhhdCBzdXBwb3J0ZWQgcGFnaW5hdGlvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWF0UGFnaW5hdGVkVGFiSGVhZGVyXG4gIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95XG57XG4gIGFic3RyYWN0IF9pdGVtczogUXVlcnlMaXN0PE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW0+O1xuICBhYnN0cmFjdCBfaW5rQmFyOiB7aGlkZTogKCkgPT4gdm9pZDsgYWxpZ25Ub0VsZW1lbnQ6IChlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4gdm9pZH07XG4gIGFic3RyYWN0IF90YWJMaXN0Q29udGFpbmVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgYWJzdHJhY3QgX3RhYkxpc3Q6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBhYnN0cmFjdCBfdGFiTGlzdElubmVyOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgYWJzdHJhY3QgX25leHRQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBhYnN0cmFjdCBfcHJldmlvdXNQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIC8qKiBUaGUgZGlzdGFuY2UgaW4gcGl4ZWxzIHRoYXQgdGhlIHRhYiBsYWJlbHMgc2hvdWxkIGJlIHRyYW5zbGF0ZWQgdG8gdGhlIGxlZnQuICovXG4gIHByaXZhdGUgX3Njcm9sbERpc3RhbmNlID0gMDtcblxuICAvKiogV2hldGhlciB0aGUgaGVhZGVyIHNob3VsZCBzY3JvbGwgdG8gdGhlIHNlbGVjdGVkIGluZGV4IGFmdGVyIHRoZSB2aWV3IGhhcyBiZWVuIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX3NlbGVjdGVkSW5kZXhDaGFuZ2VkID0gZmFsc2U7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByb3RlY3RlZCByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbHMgZm9yIHBhZ2luYXRpb24gc2hvdWxkIGJlIGRpc3BsYXllZCAqL1xuICBfc2hvd1BhZ2luYXRpb25Db250cm9scyA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0YWIgbGlzdCBjYW4gYmUgc2Nyb2xsZWQgbW9yZSB0b3dhcmRzIHRoZSBlbmQgb2YgdGhlIHRhYiBsYWJlbCBsaXN0LiAqL1xuICBfZGlzYWJsZVNjcm9sbEFmdGVyID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgdGFiIGxpc3QgY2FuIGJlIHNjcm9sbGVkIG1vcmUgdG93YXJkcyB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0YWIgbGFiZWwgbGlzdC4gKi9cbiAgX2Rpc2FibGVTY3JvbGxCZWZvcmUgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHRhYiBsYWJlbHMgdGhhdCBhcmUgZGlzcGxheWVkIG9uIHRoZSBoZWFkZXIuIFdoZW4gdGhpcyBjaGFuZ2VzLCB0aGUgaGVhZGVyXG4gICAqIHNob3VsZCByZS1ldmFsdWF0ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfdGFiTGFiZWxDb3VudDogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzY3JvbGwgZGlzdGFuY2UgaGFzIGNoYW5nZWQgYW5kIHNob3VsZCBiZSBhcHBsaWVkIGFmdGVyIHRoZSB2aWV3IGlzIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX3Njcm9sbERpc3RhbmNlQ2hhbmdlZDogYm9vbGVhbjtcblxuICAvKiogVXNlZCB0byBtYW5hZ2UgZm9jdXMgYmV0d2VlbiB0aGUgdGFicy4gKi9cbiAgcHJpdmF0ZSBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW0+O1xuXG4gIC8qKiBDYWNoZWQgdGV4dCBjb250ZW50IG9mIHRoZSBoZWFkZXIuICovXG4gIHByaXZhdGUgX2N1cnJlbnRUZXh0Q29udGVudDogc3RyaW5nO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCB3aWxsIHN0b3AgdGhlIGF1dG9tYXRlZCBzY3JvbGxpbmcuICovXG4gIHByaXZhdGUgX3N0b3BTY3JvbGxpbmcgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHBhZ2luYXRpb24gc2hvdWxkIGJlIGRpc2FibGVkLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGF2b2lkIHVubmVjZXNzYXJ5XG4gICAqIGxheW91dCByZWNhbGN1bGF0aW9ucyBpZiBpdCdzIGtub3duIHRoYXQgcGFnaW5hdGlvbiB3b24ndCBiZSByZXF1aXJlZC5cbiAgICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlUGFnaW5hdGlvbigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZVBhZ2luYXRpb247XG4gIH1cbiAgc2V0IGRpc2FibGVQYWdpbmF0aW9uKHZhbHVlOiBCb29sZWFuSW5wdXQpIHtcbiAgICB0aGlzLl9kaXNhYmxlUGFnaW5hdGlvbiA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfZGlzYWJsZVBhZ2luYXRpb246IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogVGhlIGluZGV4IG9mIHRoZSBhY3RpdmUgdGFiLiAqL1xuICBnZXQgc2VsZWN0ZWRJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZEluZGV4O1xuICB9XG4gIHNldCBzZWxlY3RlZEluZGV4KHZhbHVlOiBOdW1iZXJJbnB1dCkge1xuICAgIHZhbHVlID0gY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpO1xuXG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkSW5kZXggIT0gdmFsdWUpIHtcbiAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXhDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXggPSB2YWx1ZTtcblxuICAgICAgaWYgKHRoaXMuX2tleU1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSBfc2VsZWN0ZWRJbmRleDogbnVtYmVyID0gMDtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBvcHRpb24gaXMgc2VsZWN0ZWQuICovXG4gIHJlYWRvbmx5IHNlbGVjdEZvY3VzZWRJbmRleDogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICAvKiogRXZlbnQgZW1pdHRlZCB3aGVuIGEgbGFiZWwgaXMgZm9jdXNlZC4gKi9cbiAgcmVhZG9ubHkgaW5kZXhGb2N1c2VkOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByb3RlY3RlZCBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgcHJvdGVjdGVkIF9jaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBfdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIF9kaXI6IERpcmVjdGlvbmFsaXR5LFxuICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgX3BsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgcHVibGljIF9hbmltYXRpb25Nb2RlPzogc3RyaW5nLFxuICApIHtcbiAgICAvLyBCaW5kIHRoZSBgbW91c2VsZWF2ZWAgZXZlbnQgb24gdGhlIG91dHNpZGUgc2luY2UgaXQgZG9lc24ndCBjaGFuZ2UgYW55dGhpbmcgaW4gdGhlIHZpZXcuXG4gICAgX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICBmcm9tRXZlbnQoX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ21vdXNlbGVhdmUnKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fc3RvcEludGVydmFsKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGhhcyBzZWxlY3RlZCBhbiBpdGVtIHZpYSB0aGUga2V5Ym9hcmQuICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfaXRlbVNlbGVjdGVkKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZDtcblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgLy8gV2UgbmVlZCB0byBoYW5kbGUgdGhlc2UgZXZlbnRzIG1hbnVhbGx5LCBiZWNhdXNlIHdlIHdhbnQgdG8gYmluZCBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycy5cbiAgICBmcm9tRXZlbnQodGhpcy5fcHJldmlvdXNQYWdpbmF0b3IubmF0aXZlRWxlbWVudCwgJ3RvdWNoc3RhcnQnLCBwYXNzaXZlRXZlbnRMaXN0ZW5lck9wdGlvbnMpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLl9oYW5kbGVQYWdpbmF0b3JQcmVzcygnYmVmb3JlJyk7XG4gICAgICB9KTtcblxuICAgIGZyb21FdmVudCh0aGlzLl9uZXh0UGFnaW5hdG9yLm5hdGl2ZUVsZW1lbnQsICd0b3VjaHN0YXJ0JywgcGFzc2l2ZUV2ZW50TGlzdGVuZXJPcHRpb25zKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5faGFuZGxlUGFnaW5hdG9yUHJlc3MoJ2FmdGVyJyk7XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBjb25zdCBkaXJDaGFuZ2UgPSB0aGlzLl9kaXIgPyB0aGlzLl9kaXIuY2hhbmdlIDogb2JzZXJ2YWJsZU9mKCdsdHInKTtcbiAgICBjb25zdCByZXNpemUgPSB0aGlzLl92aWV3cG9ydFJ1bGVyLmNoYW5nZSgxNTApO1xuICAgIGNvbnN0IHJlYWxpZ24gPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oKTtcbiAgICAgIHRoaXMuX2FsaWduSW5rQmFyVG9TZWxlY3RlZFRhYigpO1xuICAgIH07XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcjxNYXRQYWdpbmF0ZWRUYWJIZWFkZXJJdGVtPih0aGlzLl9pdGVtcylcbiAgICAgIC53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2dldExheW91dERpcmVjdGlvbigpKVxuICAgICAgLndpdGhIb21lQW5kRW5kKClcbiAgICAgIC53aXRoV3JhcCgpXG4gICAgICAvLyBBbGxvdyBmb2N1cyB0byBsYW5kIG9uIGRpc2FibGVkIHRhYnMsIGFzIHBlciBodHRwczovL3czYy5naXRodWIuaW8vYXJpYS1wcmFjdGljZXMvI2tiZF9kaXNhYmxlZF9jb250cm9sc1xuICAgICAgLnNraXBQcmVkaWNhdGUoKCkgPT4gZmFsc2UpO1xuXG4gICAgdGhpcy5fa2V5TWFuYWdlci51cGRhdGVBY3RpdmVJdGVtKHRoaXMuX3NlbGVjdGVkSW5kZXgpO1xuXG4gICAgLy8gRGVmZXIgdGhlIGZpcnN0IGNhbGwgaW4gb3JkZXIgdG8gYWxsb3cgZm9yIHNsb3dlciBicm93c2VycyB0byBsYXkgb3V0IHRoZSBlbGVtZW50cy5cbiAgICAvLyBUaGlzIGhlbHBzIGluIGNhc2VzIHdoZXJlIHRoZSB1c2VyIGxhbmRzIGRpcmVjdGx5IG9uIGEgcGFnZSB3aXRoIHBhZ2luYXRlZCB0YWJzLlxuICAgIC8vIE5vdGUgdGhhdCB3ZSB1c2UgYG9uU3RhYmxlYCBpbnN0ZWFkIG9mIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgLCBiZWNhdXNlIHRoZSBsYXR0ZXJcbiAgICAvLyBjYW4gaG9sZCB1cCB0ZXN0cyB0aGF0IGFyZSBpbiBhIGJhY2tncm91bmQgdGFiLlxuICAgIHRoaXMuX25nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZShyZWFsaWduKTtcblxuICAgIC8vIE9uIGRpciBjaGFuZ2Ugb3Igd2luZG93IHJlc2l6ZSwgcmVhbGlnbiB0aGUgaW5rIGJhciBhbmQgdXBkYXRlIHRoZSBvcmllbnRhdGlvbiBvZlxuICAgIC8vIHRoZSBrZXkgbWFuYWdlciBpZiB0aGUgZGlyZWN0aW9uIGhhcyBjaGFuZ2VkLlxuICAgIG1lcmdlKGRpckNoYW5nZSwgcmVzaXplLCB0aGlzLl9pdGVtcy5jaGFuZ2VzLCB0aGlzLl9pdGVtc1Jlc2l6ZWQoKSlcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIFdlIG5lZWQgdG8gZGVmZXIgdGhpcyB0byBnaXZlIHRoZSBicm93c2VyIHNvbWUgdGltZSB0byByZWNhbGN1bGF0ZVxuICAgICAgICAvLyB0aGUgZWxlbWVudCBkaW1lbnNpb25zLiBUaGUgY2FsbCBoYXMgdG8gYmUgd3JhcHBlZCBpbiBgTmdab25lLnJ1bmAsXG4gICAgICAgIC8vIGJlY2F1c2UgdGhlIHZpZXdwb3J0IGNoYW5nZSBoYW5kbGVyIHJ1bnMgb3V0c2lkZSBvZiBBbmd1bGFyLlxuICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIENsYW1wIHRoZSBzY3JvbGwgZGlzdGFuY2UsIGJlY2F1c2UgaXQgY2FuIGNoYW5nZSB3aXRoIHRoZSBudW1iZXIgb2YgdGFicy5cbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbERpc3RhbmNlID0gTWF0aC5tYXgoXG4gICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgIE1hdGgubWluKHRoaXMuX2dldE1heFNjcm9sbERpc3RhbmNlKCksIHRoaXMuX3Njcm9sbERpc3RhbmNlKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICByZWFsaWduKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24odGhpcy5fZ2V0TGF5b3V0RGlyZWN0aW9uKCkpO1xuICAgICAgfSk7XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIGNoYW5nZSBpbiB0aGUgZm9jdXMga2V5IG1hbmFnZXIgd2UgbmVlZCB0byBlbWl0IHRoZSBgaW5kZXhGb2N1c2VkYFxuICAgIC8vIGV2ZW50IGluIG9yZGVyIHRvIHByb3ZpZGUgYSBwdWJsaWMgZXZlbnQgdGhhdCBub3RpZmllcyBhYm91dCBmb2N1cyBjaGFuZ2VzLiBBbHNvIHdlIHJlYWxpZ25cbiAgICAvLyB0aGUgdGFicyBjb250YWluZXIgYnkgc2Nyb2xsaW5nIHRoZSBuZXcgZm9jdXNlZCB0YWIgaW50byB0aGUgdmlzaWJsZSBzZWN0aW9uLlxuICAgIHRoaXMuX2tleU1hbmFnZXIuY2hhbmdlLnN1YnNjcmliZShuZXdGb2N1c0luZGV4ID0+IHtcbiAgICAgIHRoaXMuaW5kZXhGb2N1c2VkLmVtaXQobmV3Rm9jdXNJbmRleCk7XG4gICAgICB0aGlzLl9zZXRUYWJGb2N1cyhuZXdGb2N1c0luZGV4KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBTZW5kcyBhbnkgY2hhbmdlcyB0aGF0IGNvdWxkIGFmZmVjdCB0aGUgbGF5b3V0IG9mIHRoZSBpdGVtcy4gKi9cbiAgcHJpdmF0ZSBfaXRlbXNSZXNpemVkKCk6IE9ic2VydmFibGU8UmVzaXplT2JzZXJ2ZXJFbnRyeVtdPiB7XG4gICAgaWYgKHR5cGVvZiBSZXNpemVPYnNlcnZlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIEVNUFRZO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9pdGVtcy5jaGFuZ2VzLnBpcGUoXG4gICAgICBzdGFydFdpdGgodGhpcy5faXRlbXMpLFxuICAgICAgc3dpdGNoTWFwKFxuICAgICAgICAodGFiSXRlbXM6IFF1ZXJ5TGlzdDxNYXRQYWdpbmF0ZWRUYWJIZWFkZXJJdGVtPikgPT5cbiAgICAgICAgICBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXI6IE9ic2VydmVyPFJlc2l6ZU9ic2VydmVyRW50cnlbXT4pID0+XG4gICAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCByZXNpemVPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcihlbnRyaWVzID0+IG9ic2VydmVyLm5leHQoZW50cmllcykpO1xuICAgICAgICAgICAgICB0YWJJdGVtcy5mb3JFYWNoKGl0ZW0gPT4gcmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZShpdGVtLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCkpO1xuICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlc2l6ZU9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICksXG4gICAgICApLFxuICAgICAgLy8gU2tpcCB0aGUgZmlyc3QgZW1pdCBzaW5jZSB0aGUgcmVzaXplIG9ic2VydmVyIGVtaXRzIHdoZW4gYW4gaXRlbVxuICAgICAgLy8gaXMgb2JzZXJ2ZWQgZm9yIG5ldyBpdGVtcyB3aGVuIHRoZSB0YWIgaXMgYWxyZWFkeSBpbnNlcnRlZFxuICAgICAgc2tpcCgxKSxcbiAgICAgIC8vIFNraXAgZW1pc3Npb25zIHdoZXJlIGFsbCB0aGUgZWxlbWVudHMgYXJlIGludmlzaWJsZSBzaW5jZSB3ZSBkb24ndCB3YW50XG4gICAgICAvLyB0aGUgaGVhZGVyIHRvIHRyeSBhbmQgcmUtcmVuZGVyIHdpdGggaW52YWxpZCBtZWFzdXJlbWVudHMuIFNlZSAjMjU1NzQuXG4gICAgICBmaWx0ZXIoZW50cmllcyA9PiBlbnRyaWVzLnNvbWUoZSA9PiBlLmNvbnRlbnRSZWN0LndpZHRoID4gMCAmJiBlLmNvbnRlbnRSZWN0LmhlaWdodCA+IDApKSxcbiAgICApO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCk6IHZvaWQge1xuICAgIC8vIElmIHRoZSBudW1iZXIgb2YgdGFiIGxhYmVscyBoYXZlIGNoYW5nZWQsIGNoZWNrIGlmIHNjcm9sbGluZyBzaG91bGQgYmUgZW5hYmxlZFxuICAgIGlmICh0aGlzLl90YWJMYWJlbENvdW50ICE9IHRoaXMuX2l0ZW1zLmxlbmd0aCkge1xuICAgICAgdGhpcy51cGRhdGVQYWdpbmF0aW9uKCk7XG4gICAgICB0aGlzLl90YWJMYWJlbENvdW50ID0gdGhpcy5faXRlbXMubGVuZ3RoO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHNlbGVjdGVkIGluZGV4IGhhcyBjaGFuZ2VkLCBzY3JvbGwgdG8gdGhlIGxhYmVsIGFuZCBjaGVjayBpZiB0aGUgc2Nyb2xsaW5nIGNvbnRyb2xzXG4gICAgLy8gc2hvdWxkIGJlIGRpc2FibGVkLlxuICAgIGlmICh0aGlzLl9zZWxlY3RlZEluZGV4Q2hhbmdlZCkge1xuICAgICAgdGhpcy5fc2Nyb2xsVG9MYWJlbCh0aGlzLl9zZWxlY3RlZEluZGV4KTtcbiAgICAgIHRoaXMuX2NoZWNrU2Nyb2xsaW5nQ29udHJvbHMoKTtcbiAgICAgIHRoaXMuX2FsaWduSW5rQmFyVG9TZWxlY3RlZFRhYigpO1xuICAgICAgdGhpcy5fc2VsZWN0ZWRJbmRleENoYW5nZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBzY3JvbGwgZGlzdGFuY2UgaGFzIGJlZW4gY2hhbmdlZCAodGFiIHNlbGVjdGVkLCBmb2N1c2VkLCBzY3JvbGwgY29udHJvbHMgYWN0aXZhdGVkKSxcbiAgICAvLyB0aGVuIHRyYW5zbGF0ZSB0aGUgaGVhZGVyIHRvIHJlZmxlY3QgdGhpcy5cbiAgICBpZiAodGhpcy5fc2Nyb2xsRGlzdGFuY2VDaGFuZ2VkKSB7XG4gICAgICB0aGlzLl91cGRhdGVUYWJTY3JvbGxQb3NpdGlvbigpO1xuICAgICAgdGhpcy5fc2Nyb2xsRGlzdGFuY2VDaGFuZ2VkID0gZmFsc2U7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9rZXlNYW5hZ2VyPy5kZXN0cm95KCk7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9zdG9wU2Nyb2xsaW5nLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlib2FyZCBldmVudHMgb24gdGhlIGhlYWRlci4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBXZSBkb24ndCBoYW5kbGUgYW55IGtleSBiaW5kaW5ncyB3aXRoIGEgbW9kaWZpZXIga2V5LlxuICAgIGlmIChoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgRU5URVI6XG4gICAgICBjYXNlIFNQQUNFOlxuICAgICAgICBpZiAodGhpcy5mb2N1c0luZGV4ICE9PSB0aGlzLnNlbGVjdGVkSW5kZXgpIHtcbiAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5faXRlbXMuZ2V0KHRoaXMuZm9jdXNJbmRleCk7XG5cbiAgICAgICAgICBpZiAoaXRlbSAmJiAhaXRlbS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RGb2N1c2VkSW5kZXguZW1pdCh0aGlzLmZvY3VzSW5kZXgpO1xuICAgICAgICAgICAgdGhpcy5faXRlbVNlbGVjdGVkKGV2ZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLl9rZXlNYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciB3aGVuIHRoZSBNdXRhdGlvbk9ic2VydmVyIGRldGVjdHMgdGhhdCB0aGUgY29udGVudCBoYXMgY2hhbmdlZC5cbiAgICovXG4gIF9vbkNvbnRlbnRDaGFuZ2VzKCkge1xuICAgIGNvbnN0IHRleHRDb250ZW50ID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnRleHRDb250ZW50O1xuXG4gICAgLy8gV2UgbmVlZCB0byBkaWZmIHRoZSB0ZXh0IGNvbnRlbnQgb2YgdGhlIGhlYWRlciwgYmVjYXVzZSB0aGUgTXV0YXRpb25PYnNlcnZlciBjYWxsYmFja1xuICAgIC8vIHdpbGwgZmlyZSBldmVuIGlmIHRoZSB0ZXh0IGNvbnRlbnQgZGlkbid0IGNoYW5nZSB3aGljaCBpcyBpbmVmZmljaWVudCBhbmQgaXMgcHJvbmVcbiAgICAvLyB0byBpbmZpbml0ZSBsb29wcyBpZiBhIHBvb3JseSBjb25zdHJ1Y3RlZCBleHByZXNzaW9uIGlzIHBhc3NlZCBpbiAoc2VlICMxNDI0OSkuXG4gICAgaWYgKHRleHRDb250ZW50ICE9PSB0aGlzLl9jdXJyZW50VGV4dENvbnRlbnQpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRUZXh0Q29udGVudCA9IHRleHRDb250ZW50IHx8ICcnO1xuXG4gICAgICAvLyBUaGUgY29udGVudCBvYnNlcnZlciBydW5zIG91dHNpZGUgdGhlIGBOZ1pvbmVgIGJ5IGRlZmF1bHQsIHdoaWNoXG4gICAgICAvLyBtZWFucyB0aGF0IHdlIG5lZWQgdG8gYnJpbmcgdGhlIGNhbGxiYWNrIGJhY2sgaW4gb3Vyc2VsdmVzLlxuICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgICAgICB0aGlzLl9hbGlnbklua0JhclRvU2VsZWN0ZWRUYWIoKTtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgdmlldyB3aGV0aGVyIHBhZ2luYXRpb24gc2hvdWxkIGJlIGVuYWJsZWQgb3Igbm90LlxuICAgKlxuICAgKiBXQVJOSU5HOiBDYWxsaW5nIHRoaXMgbWV0aG9kIGNhbiBiZSB2ZXJ5IGNvc3RseSBpbiB0ZXJtcyBvZiBwZXJmb3JtYW5jZS4gSXQgc2hvdWxkIGJlIGNhbGxlZFxuICAgKiBhcyBpbmZyZXF1ZW50bHkgYXMgcG9zc2libGUgZnJvbSBvdXRzaWRlIG9mIHRoZSBUYWJzIGNvbXBvbmVudCBhcyBpdCBjYXVzZXMgYSByZWZsb3cgb2YgdGhlXG4gICAqIHBhZ2UuXG4gICAqL1xuICB1cGRhdGVQYWdpbmF0aW9uKCkge1xuICAgIHRoaXMuX2NoZWNrUGFnaW5hdGlvbkVuYWJsZWQoKTtcbiAgICB0aGlzLl9jaGVja1Njcm9sbGluZ0NvbnRyb2xzKCk7XG4gICAgdGhpcy5fdXBkYXRlVGFiU2Nyb2xsUG9zaXRpb24oKTtcbiAgfVxuXG4gIC8qKiBUcmFja3Mgd2hpY2ggZWxlbWVudCBoYXMgZm9jdXM7IHVzZWQgZm9yIGtleWJvYXJkIG5hdmlnYXRpb24gKi9cbiAgZ2V0IGZvY3VzSW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fa2V5TWFuYWdlciA/IHRoaXMuX2tleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4ISA6IDA7XG4gIH1cblxuICAvKiogV2hlbiB0aGUgZm9jdXMgaW5kZXggaXMgc2V0LCB3ZSBtdXN0IG1hbnVhbGx5IHNlbmQgZm9jdXMgdG8gdGhlIGNvcnJlY3QgbGFiZWwgKi9cbiAgc2V0IGZvY3VzSW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIGlmICghdGhpcy5faXNWYWxpZEluZGV4KHZhbHVlKSB8fCB0aGlzLmZvY3VzSW5kZXggPT09IHZhbHVlIHx8ICF0aGlzLl9rZXlNYW5hZ2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fa2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmVzIGlmIGFuIGluZGV4IGlzIHZhbGlkLiAgSWYgdGhlIHRhYnMgYXJlIG5vdCByZWFkeSB5ZXQsIHdlIGFzc3VtZSB0aGF0IHRoZSB1c2VyIGlzXG4gICAqIHByb3ZpZGluZyBhIHZhbGlkIGluZGV4IGFuZCByZXR1cm4gdHJ1ZS5cbiAgICovXG4gIF9pc1ZhbGlkSW5kZXgoaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9pdGVtcyA/ICEhdGhpcy5faXRlbXMudG9BcnJheSgpW2luZGV4XSA6IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBmb2N1cyBvbiB0aGUgSFRNTCBlbGVtZW50IGZvciB0aGUgbGFiZWwgd3JhcHBlciBhbmQgc2Nyb2xscyBpdCBpbnRvIHRoZSB2aWV3IGlmXG4gICAqIHNjcm9sbGluZyBpcyBlbmFibGVkLlxuICAgKi9cbiAgX3NldFRhYkZvY3VzKHRhYkluZGV4OiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5fc2hvd1BhZ2luYXRpb25Db250cm9scykge1xuICAgICAgdGhpcy5fc2Nyb2xsVG9MYWJlbCh0YWJJbmRleCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2l0ZW1zICYmIHRoaXMuX2l0ZW1zLmxlbmd0aCkge1xuICAgICAgdGhpcy5faXRlbXMudG9BcnJheSgpW3RhYkluZGV4XS5mb2N1cygpO1xuXG4gICAgICAvLyBEbyBub3QgbGV0IHRoZSBicm93c2VyIG1hbmFnZSBzY3JvbGxpbmcgdG8gZm9jdXMgdGhlIGVsZW1lbnQsIHRoaXMgd2lsbCBiZSBoYW5kbGVkXG4gICAgICAvLyBieSB1c2luZyB0cmFuc2xhdGlvbi4gSW4gTFRSLCB0aGUgc2Nyb2xsIGxlZnQgc2hvdWxkIGJlIDAuIEluIFJUTCwgdGhlIHNjcm9sbCB3aWR0aFxuICAgICAgLy8gc2hvdWxkIGJlIHRoZSBmdWxsIHdpZHRoIG1pbnVzIHRoZSBvZmZzZXQgd2lkdGguXG4gICAgICBjb25zdCBjb250YWluZXJFbCA9IHRoaXMuX3RhYkxpc3RDb250YWluZXIubmF0aXZlRWxlbWVudDtcbiAgICAgIGNvbnN0IGRpciA9IHRoaXMuX2dldExheW91dERpcmVjdGlvbigpO1xuXG4gICAgICBpZiAoZGlyID09ICdsdHInKSB7XG4gICAgICAgIGNvbnRhaW5lckVsLnNjcm9sbExlZnQgPSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGFpbmVyRWwuc2Nyb2xsTGVmdCA9IGNvbnRhaW5lckVsLnNjcm9sbFdpZHRoIC0gY29udGFpbmVyRWwub2Zmc2V0V2lkdGg7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIFRoZSBsYXlvdXQgZGlyZWN0aW9uIG9mIHRoZSBjb250YWluaW5nIGFwcC4gKi9cbiAgX2dldExheW91dERpcmVjdGlvbigpOiBEaXJlY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLl9kaXIgJiYgdGhpcy5fZGlyLnZhbHVlID09PSAncnRsJyA/ICdydGwnIDogJ2x0cic7XG4gIH1cblxuICAvKiogUGVyZm9ybXMgdGhlIENTUyB0cmFuc2Zvcm1hdGlvbiBvbiB0aGUgdGFiIGxpc3QgdGhhdCB3aWxsIGNhdXNlIHRoZSBsaXN0IHRvIHNjcm9sbC4gKi9cbiAgX3VwZGF0ZVRhYlNjcm9sbFBvc2l0aW9uKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVQYWdpbmF0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2Nyb2xsRGlzdGFuY2UgPSB0aGlzLnNjcm9sbERpc3RhbmNlO1xuICAgIGNvbnN0IHRyYW5zbGF0ZVggPSB0aGlzLl9nZXRMYXlvdXREaXJlY3Rpb24oKSA9PT0gJ2x0cicgPyAtc2Nyb2xsRGlzdGFuY2UgOiBzY3JvbGxEaXN0YW5jZTtcblxuICAgIC8vIERvbid0IHVzZSBgdHJhbnNsYXRlM2RgIGhlcmUgYmVjYXVzZSB3ZSBkb24ndCB3YW50IHRvIGNyZWF0ZSBhIG5ldyBsYXllci4gQSBuZXcgbGF5ZXJcbiAgICAvLyBzZWVtcyB0byBjYXVzZSBmbGlja2VyaW5nIGFuZCBvdmVyZmxvdyBpbiBJbnRlcm5ldCBFeHBsb3Jlci4gRm9yIGV4YW1wbGUsIHRoZSBpbmsgYmFyXG4gICAgLy8gYW5kIHJpcHBsZXMgd2lsbCBleGNlZWQgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIHZpc2libGUgdGFiIGJhci5cbiAgICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzEwMjc2XG4gICAgLy8gV2Ugcm91bmQgdGhlIGB0cmFuc2Zvcm1gIGhlcmUsIGJlY2F1c2UgdHJhbnNmb3JtcyB3aXRoIHN1Yi1waXhlbCBwcmVjaXNpb24gY2F1c2Ugc29tZVxuICAgIC8vIGJyb3dzZXJzIHRvIGJsdXIgdGhlIGNvbnRlbnQgb2YgdGhlIGVsZW1lbnQuXG4gICAgdGhpcy5fdGFiTGlzdC5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9IGB0cmFuc2xhdGVYKCR7TWF0aC5yb3VuZCh0cmFuc2xhdGVYKX1weClgO1xuXG4gICAgLy8gU2V0dGluZyB0aGUgYHRyYW5zZm9ybWAgb24gSUUgd2lsbCBjaGFuZ2UgdGhlIHNjcm9sbCBvZmZzZXQgb2YgdGhlIHBhcmVudCwgY2F1c2luZyB0aGVcbiAgICAvLyBwb3NpdGlvbiB0byBiZSB0aHJvd24gb2ZmIGluIHNvbWUgY2FzZXMuIFdlIGhhdmUgdG8gcmVzZXQgaXQgb3Vyc2VsdmVzIHRvIGVuc3VyZSB0aGF0XG4gICAgLy8gaXQgZG9lc24ndCBnZXQgdGhyb3duIG9mZi4gTm90ZSB0aGF0IHdlIHNjb3BlIGl0IG9ubHkgdG8gSUUgYW5kIEVkZ2UsIGJlY2F1c2UgbWVzc2luZ1xuICAgIC8vIHdpdGggdGhlIHNjcm9sbCBwb3NpdGlvbiB0aHJvd3Mgb2ZmIENocm9tZSA3MSsgaW4gUlRMIG1vZGUgKHNlZSAjMTQ2ODkpLlxuICAgIGlmICh0aGlzLl9wbGF0Zm9ybS5UUklERU5UIHx8IHRoaXMuX3BsYXRmb3JtLkVER0UpIHtcbiAgICAgIHRoaXMuX3RhYkxpc3RDb250YWluZXIubmF0aXZlRWxlbWVudC5zY3JvbGxMZWZ0ID0gMDtcbiAgICB9XG4gIH1cblxuICAvKiogU2V0cyB0aGUgZGlzdGFuY2UgaW4gcGl4ZWxzIHRoYXQgdGhlIHRhYiBoZWFkZXIgc2hvdWxkIGJlIHRyYW5zZm9ybWVkIGluIHRoZSBYLWF4aXMuICovXG4gIGdldCBzY3JvbGxEaXN0YW5jZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9zY3JvbGxEaXN0YW5jZTtcbiAgfVxuICBzZXQgc2Nyb2xsRGlzdGFuY2UodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3Njcm9sbFRvKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgdGFiIGxpc3QgaW4gdGhlICdiZWZvcmUnIG9yICdhZnRlcicgZGlyZWN0aW9uICh0b3dhcmRzIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGxpc3Qgb3JcbiAgICogdGhlIGVuZCBvZiB0aGUgbGlzdCwgcmVzcGVjdGl2ZWx5KS4gVGhlIGRpc3RhbmNlIHRvIHNjcm9sbCBpcyBjb21wdXRlZCB0byBiZSBhIHRoaXJkIG9mIHRoZVxuICAgKiBsZW5ndGggb2YgdGhlIHRhYiBsaXN0IHZpZXcgd2luZG93LlxuICAgKlxuICAgKiBUaGlzIGlzIGFuIGV4cGVuc2l2ZSBjYWxsIHRoYXQgZm9yY2VzIGEgbGF5b3V0IHJlZmxvdyB0byBjb21wdXRlIGJveCBhbmQgc2Nyb2xsIG1ldHJpY3MgYW5kXG4gICAqIHNob3VsZCBiZSBjYWxsZWQgc3BhcmluZ2x5LlxuICAgKi9cbiAgX3Njcm9sbEhlYWRlcihkaXJlY3Rpb246IFNjcm9sbERpcmVjdGlvbikge1xuICAgIGNvbnN0IHZpZXdMZW5ndGggPSB0aGlzLl90YWJMaXN0Q29udGFpbmVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG5cbiAgICAvLyBNb3ZlIHRoZSBzY3JvbGwgZGlzdGFuY2Ugb25lLXRoaXJkIHRoZSBsZW5ndGggb2YgdGhlIHRhYiBsaXN0J3Mgdmlld3BvcnQuXG4gICAgY29uc3Qgc2Nyb2xsQW1vdW50ID0gKChkaXJlY3Rpb24gPT0gJ2JlZm9yZScgPyAtMSA6IDEpICogdmlld0xlbmd0aCkgLyAzO1xuXG4gICAgcmV0dXJuIHRoaXMuX3Njcm9sbFRvKHRoaXMuX3Njcm9sbERpc3RhbmNlICsgc2Nyb2xsQW1vdW50KTtcbiAgfVxuXG4gIC8qKiBIYW5kbGVzIGNsaWNrIGV2ZW50cyBvbiB0aGUgcGFnaW5hdGlvbiBhcnJvd3MuICovXG4gIF9oYW5kbGVQYWdpbmF0b3JDbGljayhkaXJlY3Rpb246IFNjcm9sbERpcmVjdGlvbikge1xuICAgIHRoaXMuX3N0b3BJbnRlcnZhbCgpO1xuICAgIHRoaXMuX3Njcm9sbEhlYWRlcihkaXJlY3Rpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1vdmVzIHRoZSB0YWIgbGlzdCBzdWNoIHRoYXQgdGhlIGRlc2lyZWQgdGFiIGxhYmVsIChtYXJrZWQgYnkgaW5kZXgpIGlzIG1vdmVkIGludG8gdmlldy5cbiAgICpcbiAgICogVGhpcyBpcyBhbiBleHBlbnNpdmUgY2FsbCB0aGF0IGZvcmNlcyBhIGxheW91dCByZWZsb3cgdG8gY29tcHV0ZSBib3ggYW5kIHNjcm9sbCBtZXRyaWNzIGFuZFxuICAgKiBzaG91bGQgYmUgY2FsbGVkIHNwYXJpbmdseS5cbiAgICovXG4gIF9zY3JvbGxUb0xhYmVsKGxhYmVsSW5kZXg6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmRpc2FibGVQYWdpbmF0aW9uKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2VsZWN0ZWRMYWJlbCA9IHRoaXMuX2l0ZW1zID8gdGhpcy5faXRlbXMudG9BcnJheSgpW2xhYmVsSW5kZXhdIDogbnVsbDtcblxuICAgIGlmICghc2VsZWN0ZWRMYWJlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSB2aWV3IGxlbmd0aCBpcyB0aGUgdmlzaWJsZSB3aWR0aCBvZiB0aGUgdGFiIGxhYmVscy5cbiAgICBjb25zdCB2aWV3TGVuZ3RoID0gdGhpcy5fdGFiTGlzdENvbnRhaW5lci5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgIGNvbnN0IHtvZmZzZXRMZWZ0LCBvZmZzZXRXaWR0aH0gPSBzZWxlY3RlZExhYmVsLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgIGxldCBsYWJlbEJlZm9yZVBvczogbnVtYmVyLCBsYWJlbEFmdGVyUG9zOiBudW1iZXI7XG4gICAgaWYgKHRoaXMuX2dldExheW91dERpcmVjdGlvbigpID09ICdsdHInKSB7XG4gICAgICBsYWJlbEJlZm9yZVBvcyA9IG9mZnNldExlZnQ7XG4gICAgICBsYWJlbEFmdGVyUG9zID0gbGFiZWxCZWZvcmVQb3MgKyBvZmZzZXRXaWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFiZWxBZnRlclBvcyA9IHRoaXMuX3RhYkxpc3RJbm5lci5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoIC0gb2Zmc2V0TGVmdDtcbiAgICAgIGxhYmVsQmVmb3JlUG9zID0gbGFiZWxBZnRlclBvcyAtIG9mZnNldFdpZHRoO1xuICAgIH1cblxuICAgIGNvbnN0IGJlZm9yZVZpc2libGVQb3MgPSB0aGlzLnNjcm9sbERpc3RhbmNlO1xuICAgIGNvbnN0IGFmdGVyVmlzaWJsZVBvcyA9IHRoaXMuc2Nyb2xsRGlzdGFuY2UgKyB2aWV3TGVuZ3RoO1xuXG4gICAgaWYgKGxhYmVsQmVmb3JlUG9zIDwgYmVmb3JlVmlzaWJsZVBvcykge1xuICAgICAgLy8gU2Nyb2xsIGhlYWRlciB0byBtb3ZlIGxhYmVsIHRvIHRoZSBiZWZvcmUgZGlyZWN0aW9uXG4gICAgICB0aGlzLnNjcm9sbERpc3RhbmNlIC09IGJlZm9yZVZpc2libGVQb3MgLSBsYWJlbEJlZm9yZVBvcztcbiAgICB9IGVsc2UgaWYgKGxhYmVsQWZ0ZXJQb3MgPiBhZnRlclZpc2libGVQb3MpIHtcbiAgICAgIC8vIFNjcm9sbCBoZWFkZXIgdG8gbW92ZSBsYWJlbCB0byB0aGUgYWZ0ZXIgZGlyZWN0aW9uXG4gICAgICB0aGlzLnNjcm9sbERpc3RhbmNlICs9IE1hdGgubWluKFxuICAgICAgICBsYWJlbEFmdGVyUG9zIC0gYWZ0ZXJWaXNpYmxlUG9zLFxuICAgICAgICBsYWJlbEJlZm9yZVBvcyAtIGJlZm9yZVZpc2libGVQb3MsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFdmFsdWF0ZSB3aGV0aGVyIHRoZSBwYWdpbmF0aW9uIGNvbnRyb2xzIHNob3VsZCBiZSBkaXNwbGF5ZWQuIElmIHRoZSBzY3JvbGwgd2lkdGggb2YgdGhlXG4gICAqIHRhYiBsaXN0IGlzIHdpZGVyIHRoYW4gdGhlIHNpemUgb2YgdGhlIGhlYWRlciBjb250YWluZXIsIHRoZW4gdGhlIHBhZ2luYXRpb24gY29udHJvbHMgc2hvdWxkXG4gICAqIGJlIHNob3duLlxuICAgKlxuICAgKiBUaGlzIGlzIGFuIGV4cGVuc2l2ZSBjYWxsIHRoYXQgZm9yY2VzIGEgbGF5b3V0IHJlZmxvdyB0byBjb21wdXRlIGJveCBhbmQgc2Nyb2xsIG1ldHJpY3MgYW5kXG4gICAqIHNob3VsZCBiZSBjYWxsZWQgc3BhcmluZ2x5LlxuICAgKi9cbiAgX2NoZWNrUGFnaW5hdGlvbkVuYWJsZWQoKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZVBhZ2luYXRpb24pIHtcbiAgICAgIHRoaXMuX3Nob3dQYWdpbmF0aW9uQ29udHJvbHMgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaXNFbmFibGVkID1cbiAgICAgICAgdGhpcy5fdGFiTGlzdElubmVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsV2lkdGggPiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG5cbiAgICAgIGlmICghaXNFbmFibGVkKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsRGlzdGFuY2UgPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNFbmFibGVkICE9PSB0aGlzLl9zaG93UGFnaW5hdGlvbkNvbnRyb2xzKSB7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9zaG93UGFnaW5hdGlvbkNvbnRyb2xzID0gaXNFbmFibGVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFdmFsdWF0ZSB3aGV0aGVyIHRoZSBiZWZvcmUgYW5kIGFmdGVyIGNvbnRyb2xzIHNob3VsZCBiZSBlbmFibGVkIG9yIGRpc2FibGVkLlxuICAgKiBJZiB0aGUgaGVhZGVyIGlzIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGxpc3QgKHNjcm9sbCBkaXN0YW5jZSBpcyBlcXVhbCB0byAwKSB0aGVuIGRpc2FibGUgdGhlXG4gICAqIGJlZm9yZSBidXR0b24uIElmIHRoZSBoZWFkZXIgaXMgYXQgdGhlIGVuZCBvZiB0aGUgbGlzdCAoc2Nyb2xsIGRpc3RhbmNlIGlzIGVxdWFsIHRvIHRoZVxuICAgKiBtYXhpbXVtIGRpc3RhbmNlIHdlIGNhbiBzY3JvbGwpLCB0aGVuIGRpc2FibGUgdGhlIGFmdGVyIGJ1dHRvbi5cbiAgICpcbiAgICogVGhpcyBpcyBhbiBleHBlbnNpdmUgY2FsbCB0aGF0IGZvcmNlcyBhIGxheW91dCByZWZsb3cgdG8gY29tcHV0ZSBib3ggYW5kIHNjcm9sbCBtZXRyaWNzIGFuZFxuICAgKiBzaG91bGQgYmUgY2FsbGVkIHNwYXJpbmdseS5cbiAgICovXG4gIF9jaGVja1Njcm9sbGluZ0NvbnRyb2xzKCkge1xuICAgIGlmICh0aGlzLmRpc2FibGVQYWdpbmF0aW9uKSB7XG4gICAgICB0aGlzLl9kaXNhYmxlU2Nyb2xsQWZ0ZXIgPSB0aGlzLl9kaXNhYmxlU2Nyb2xsQmVmb3JlID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBhZ2luYXRpb24gYXJyb3dzIHNob3VsZCBiZSBhY3RpdmF0ZWQuXG4gICAgICB0aGlzLl9kaXNhYmxlU2Nyb2xsQmVmb3JlID0gdGhpcy5zY3JvbGxEaXN0YW5jZSA9PSAwO1xuICAgICAgdGhpcy5fZGlzYWJsZVNjcm9sbEFmdGVyID0gdGhpcy5zY3JvbGxEaXN0YW5jZSA9PSB0aGlzLl9nZXRNYXhTY3JvbGxEaXN0YW5jZSgpO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERldGVybWluZXMgd2hhdCBpcyB0aGUgbWF4aW11bSBsZW5ndGggaW4gcGl4ZWxzIHRoYXQgY2FuIGJlIHNldCBmb3IgdGhlIHNjcm9sbCBkaXN0YW5jZS4gVGhpc1xuICAgKiBpcyBlcXVhbCB0byB0aGUgZGlmZmVyZW5jZSBpbiB3aWR0aCBiZXR3ZWVuIHRoZSB0YWIgbGlzdCBjb250YWluZXIgYW5kIHRhYiBoZWFkZXIgY29udGFpbmVyLlxuICAgKlxuICAgKiBUaGlzIGlzIGFuIGV4cGVuc2l2ZSBjYWxsIHRoYXQgZm9yY2VzIGEgbGF5b3V0IHJlZmxvdyB0byBjb21wdXRlIGJveCBhbmQgc2Nyb2xsIG1ldHJpY3MgYW5kXG4gICAqIHNob3VsZCBiZSBjYWxsZWQgc3BhcmluZ2x5LlxuICAgKi9cbiAgX2dldE1heFNjcm9sbERpc3RhbmNlKCk6IG51bWJlciB7XG4gICAgY29uc3QgbGVuZ3RoT2ZUYWJMaXN0ID0gdGhpcy5fdGFiTGlzdElubmVyLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsV2lkdGg7XG4gICAgY29uc3Qgdmlld0xlbmd0aCA9IHRoaXMuX3RhYkxpc3RDb250YWluZXIubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICByZXR1cm4gbGVuZ3RoT2ZUYWJMaXN0IC0gdmlld0xlbmd0aCB8fCAwO1xuICB9XG5cbiAgLyoqIFRlbGxzIHRoZSBpbmstYmFyIHRvIGFsaWduIGl0c2VsZiB0byB0aGUgY3VycmVudCBsYWJlbCB3cmFwcGVyICovXG4gIF9hbGlnbklua0JhclRvU2VsZWN0ZWRUYWIoKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtID1cbiAgICAgIHRoaXMuX2l0ZW1zICYmIHRoaXMuX2l0ZW1zLmxlbmd0aCA/IHRoaXMuX2l0ZW1zLnRvQXJyYXkoKVt0aGlzLnNlbGVjdGVkSW5kZXhdIDogbnVsbDtcbiAgICBjb25zdCBzZWxlY3RlZExhYmVsV3JhcHBlciA9IHNlbGVjdGVkSXRlbSA/IHNlbGVjdGVkSXRlbS5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuXG4gICAgaWYgKHNlbGVjdGVkTGFiZWxXcmFwcGVyKSB7XG4gICAgICB0aGlzLl9pbmtCYXIuYWxpZ25Ub0VsZW1lbnQoc2VsZWN0ZWRMYWJlbFdyYXBwZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9pbmtCYXIuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTdG9wcyB0aGUgY3VycmVudGx5LXJ1bm5pbmcgcGFnaW5hdG9yIGludGVydmFsLiAgKi9cbiAgX3N0b3BJbnRlcnZhbCgpIHtcbiAgICB0aGlzLl9zdG9wU2Nyb2xsaW5nLm5leHQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIYW5kbGVzIHRoZSB1c2VyIHByZXNzaW5nIGRvd24gb24gb25lIG9mIHRoZSBwYWdpbmF0b3JzLlxuICAgKiBTdGFydHMgc2Nyb2xsaW5nIHRoZSBoZWFkZXIgYWZ0ZXIgYSBjZXJ0YWluIGFtb3VudCBvZiB0aW1lLlxuICAgKiBAcGFyYW0gZGlyZWN0aW9uIEluIHdoaWNoIGRpcmVjdGlvbiB0aGUgcGFnaW5hdG9yIHNob3VsZCBiZSBzY3JvbGxlZC5cbiAgICovXG4gIF9oYW5kbGVQYWdpbmF0b3JQcmVzcyhkaXJlY3Rpb246IFNjcm9sbERpcmVjdGlvbiwgbW91c2VFdmVudD86IE1vdXNlRXZlbnQpIHtcbiAgICAvLyBEb24ndCBzdGFydCBhdXRvIHNjcm9sbGluZyBmb3IgcmlnaHQgbW91c2UgYnV0dG9uIGNsaWNrcy4gTm90ZSB0aGF0IHdlIHNob3VsZG4ndCBoYXZlIHRvXG4gICAgLy8gbnVsbCBjaGVjayB0aGUgYGJ1dHRvbmAsIGJ1dCB3ZSBkbyBpdCBzbyB3ZSBkb24ndCBicmVhayB0ZXN0cyB0aGF0IHVzZSBmYWtlIGV2ZW50cy5cbiAgICBpZiAobW91c2VFdmVudCAmJiBtb3VzZUV2ZW50LmJ1dHRvbiAhPSBudWxsICYmIG1vdXNlRXZlbnQuYnV0dG9uICE9PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQXZvaWQgb3ZlcmxhcHBpbmcgdGltZXJzLlxuICAgIHRoaXMuX3N0b3BJbnRlcnZhbCgpO1xuXG4gICAgLy8gU3RhcnQgYSB0aW1lciBhZnRlciB0aGUgZGVsYXkgYW5kIGtlZXAgZmlyaW5nIGJhc2VkIG9uIHRoZSBpbnRlcnZhbC5cbiAgICB0aW1lcihIRUFERVJfU0NST0xMX0RFTEFZLCBIRUFERVJfU0NST0xMX0lOVEVSVkFMKVxuICAgICAgLy8gS2VlcCB0aGUgdGltZXIgZ29pbmcgdW50aWwgc29tZXRoaW5nIHRlbGxzIGl0IHRvIHN0b3Agb3IgdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuXG4gICAgICAucGlwZSh0YWtlVW50aWwobWVyZ2UodGhpcy5fc3RvcFNjcm9sbGluZywgdGhpcy5fZGVzdHJveWVkKSkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgY29uc3Qge21heFNjcm9sbERpc3RhbmNlLCBkaXN0YW5jZX0gPSB0aGlzLl9zY3JvbGxIZWFkZXIoZGlyZWN0aW9uKTtcblxuICAgICAgICAvLyBTdG9wIHRoZSB0aW1lciBpZiB3ZSd2ZSByZWFjaGVkIHRoZSBzdGFydCBvciB0aGUgZW5kLlxuICAgICAgICBpZiAoZGlzdGFuY2UgPT09IDAgfHwgZGlzdGFuY2UgPj0gbWF4U2Nyb2xsRGlzdGFuY2UpIHtcbiAgICAgICAgICB0aGlzLl9zdG9wSW50ZXJ2YWwoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU2Nyb2xscyB0aGUgaGVhZGVyIHRvIGEgZ2l2ZW4gcG9zaXRpb24uXG4gICAqIEBwYXJhbSBwb3NpdGlvbiBQb3NpdGlvbiB0byB3aGljaCB0byBzY3JvbGwuXG4gICAqIEByZXR1cm5zIEluZm9ybWF0aW9uIG9uIHRoZSBjdXJyZW50IHNjcm9sbCBkaXN0YW5jZSBhbmQgdGhlIG1heGltdW0uXG4gICAqL1xuICBwcml2YXRlIF9zY3JvbGxUbyhwb3NpdGlvbjogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuZGlzYWJsZVBhZ2luYXRpb24pIHtcbiAgICAgIHJldHVybiB7bWF4U2Nyb2xsRGlzdGFuY2U6IDAsIGRpc3RhbmNlOiAwfTtcbiAgICB9XG5cbiAgICBjb25zdCBtYXhTY3JvbGxEaXN0YW5jZSA9IHRoaXMuX2dldE1heFNjcm9sbERpc3RhbmNlKCk7XG4gICAgdGhpcy5fc2Nyb2xsRGlzdGFuY2UgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihtYXhTY3JvbGxEaXN0YW5jZSwgcG9zaXRpb24pKTtcblxuICAgIC8vIE1hcmsgdGhhdCB0aGUgc2Nyb2xsIGRpc3RhbmNlIGhhcyBjaGFuZ2VkIHNvIHRoYXQgYWZ0ZXIgdGhlIHZpZXcgaXMgY2hlY2tlZCwgdGhlIENTU1xuICAgIC8vIHRyYW5zZm9ybWF0aW9uIGNhbiBtb3ZlIHRoZSBoZWFkZXIuXG4gICAgdGhpcy5fc2Nyb2xsRGlzdGFuY2VDaGFuZ2VkID0gdHJ1ZTtcbiAgICB0aGlzLl9jaGVja1Njcm9sbGluZ0NvbnRyb2xzKCk7XG5cbiAgICByZXR1cm4ge21heFNjcm9sbERpc3RhbmNlLCBkaXN0YW5jZTogdGhpcy5fc2Nyb2xsRGlzdGFuY2V9O1xuICB9XG59XG4iXX0=
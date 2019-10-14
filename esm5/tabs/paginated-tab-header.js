/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectorRef, ElementRef, NgZone, Optional, EventEmitter, Directive, Inject, } from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { END, ENTER, HOME, SPACE, hasModifierKey } from '@angular/cdk/keycodes';
import { merge, of as observableOf, Subject, timer, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Platform, normalizePassiveListenerOptions } from '@angular/cdk/platform';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
/** Config used to bind passive event listeners */
var passiveEventListenerOptions = normalizePassiveListenerOptions({ passive: true });
/**
 * The distance in pixels that will be overshot when scrolling a tab label into view. This helps
 * provide a small affordance to the label next to it.
 */
var EXAGGERATED_OVERSCROLL = 60;
/**
 * Amount of milliseconds to wait before starting to scroll the header automatically.
 * Set a little conservatively in order to handle fake events dispatched on touch devices.
 */
var HEADER_SCROLL_DELAY = 650;
/**
 * Interval in milliseconds at which to scroll the header
 * while the user is holding their pointer.
 */
var HEADER_SCROLL_INTERVAL = 100;
/**
 * Base class for a tab header that supported pagination.
 * @docs-private
 */
var MatPaginatedTabHeader = /** @class */ (function () {
    function MatPaginatedTabHeader(_elementRef, _changeDetectorRef, _viewportRuler, _dir, _ngZone, 
    /**
     * @deprecated @breaking-change 9.0.0 `_platform` and `_animationMode`
     * parameters to become required.
     */
    _platform, _animationMode) {
        var _this = this;
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
        this._selectedIndex = 0;
        /** Event emitted when the option is selected. */
        this.selectFocusedIndex = new EventEmitter();
        /** Event emitted when a label is focused. */
        this.indexFocused = new EventEmitter();
        // Bind the `mouseleave` event on the outside since it doesn't change anything in the view.
        _ngZone.runOutsideAngular(function () {
            fromEvent(_elementRef.nativeElement, 'mouseleave')
                .pipe(takeUntil(_this._destroyed))
                .subscribe(function () {
                _this._stopInterval();
            });
        });
    }
    Object.defineProperty(MatPaginatedTabHeader.prototype, "selectedIndex", {
        /** The index of the active tab. */
        get: function () { return this._selectedIndex; },
        set: function (value) {
            value = coerceNumberProperty(value);
            if (this._selectedIndex != value) {
                this._selectedIndexChanged = true;
                this._selectedIndex = value;
                if (this._keyManager) {
                    this._keyManager.updateActiveItem(value);
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    MatPaginatedTabHeader.prototype.ngAfterViewInit = function () {
        var _this = this;
        // We need to handle these events manually, because we want to bind passive event listeners.
        fromEvent(this._previousPaginator.nativeElement, 'touchstart', passiveEventListenerOptions)
            .pipe(takeUntil(this._destroyed))
            .subscribe(function () {
            _this._handlePaginatorPress('before');
        });
        fromEvent(this._nextPaginator.nativeElement, 'touchstart', passiveEventListenerOptions)
            .pipe(takeUntil(this._destroyed))
            .subscribe(function () {
            _this._handlePaginatorPress('after');
        });
    };
    MatPaginatedTabHeader.prototype.ngAfterContentInit = function () {
        var _this = this;
        var dirChange = this._dir ? this._dir.change : observableOf(null);
        var resize = this._viewportRuler.change(150);
        var realign = function () {
            _this.updatePagination();
            _this._alignInkBarToSelectedTab();
        };
        this._keyManager = new FocusKeyManager(this._items)
            .withHorizontalOrientation(this._getLayoutDirection())
            .withWrap();
        this._keyManager.updateActiveItem(0);
        // Defer the first call in order to allow for slower browsers to lay out the elements.
        // This helps in cases where the user lands directly on a page with paginated tabs.
        typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame(realign) : realign();
        // On dir change or window resize, realign the ink bar and update the orientation of
        // the key manager if the direction has changed.
        merge(dirChange, resize, this._items.changes).pipe(takeUntil(this._destroyed)).subscribe(function () {
            realign();
            _this._keyManager.withHorizontalOrientation(_this._getLayoutDirection());
        });
        // If there is a change in the focus key manager we need to emit the `indexFocused`
        // event in order to provide a public event that notifies about focus changes. Also we realign
        // the tabs container by scrolling the new focused tab into the visible section.
        this._keyManager.change.pipe(takeUntil(this._destroyed)).subscribe(function (newFocusIndex) {
            _this.indexFocused.emit(newFocusIndex);
            _this._setTabFocus(newFocusIndex);
        });
    };
    MatPaginatedTabHeader.prototype.ngAfterContentChecked = function () {
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
    };
    MatPaginatedTabHeader.prototype.ngOnDestroy = function () {
        this._destroyed.next();
        this._destroyed.complete();
        this._stopScrolling.complete();
    };
    /** Handles keyboard events on the header. */
    MatPaginatedTabHeader.prototype._handleKeydown = function (event) {
        // We don't handle any key bindings with a modifier key.
        if (hasModifierKey(event)) {
            return;
        }
        switch (event.keyCode) {
            case HOME:
                this._keyManager.setFirstItemActive();
                event.preventDefault();
                break;
            case END:
                this._keyManager.setLastItemActive();
                event.preventDefault();
                break;
            case ENTER:
            case SPACE:
                this.selectFocusedIndex.emit(this.focusIndex);
                this._itemSelected(event);
                break;
            default:
                this._keyManager.onKeydown(event);
        }
    };
    /**
     * Callback for when the MutationObserver detects that the content has changed.
     */
    MatPaginatedTabHeader.prototype._onContentChanges = function () {
        var _this = this;
        var textContent = this._elementRef.nativeElement.textContent;
        // We need to diff the text content of the header, because the MutationObserver callback
        // will fire even if the text content didn't change which is inefficient and is prone
        // to infinite loops if a poorly constructed expression is passed in (see #14249).
        if (textContent !== this._currentTextContent) {
            this._currentTextContent = textContent || '';
            // The content observer runs outside the `NgZone` by default, which
            // means that we need to bring the callback back in ourselves.
            this._ngZone.run(function () {
                _this.updatePagination();
                _this._alignInkBarToSelectedTab();
                _this._changeDetectorRef.markForCheck();
            });
        }
    };
    /**
     * Updates the view whether pagination should be enabled or not.
     *
     * WARNING: Calling this method can be very costly in terms of performance. It should be called
     * as infrequently as possible from outside of the Tabs component as it causes a reflow of the
     * page.
     */
    MatPaginatedTabHeader.prototype.updatePagination = function () {
        this._checkPaginationEnabled();
        this._checkScrollingControls();
        this._updateTabScrollPosition();
    };
    Object.defineProperty(MatPaginatedTabHeader.prototype, "focusIndex", {
        /** Tracks which element has focus; used for keyboard navigation */
        get: function () {
            return this._keyManager ? this._keyManager.activeItemIndex : 0;
        },
        /** When the focus index is set, we must manually send focus to the correct label */
        set: function (value) {
            if (!this._isValidIndex(value) || this.focusIndex === value || !this._keyManager) {
                return;
            }
            this._keyManager.setActiveItem(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Determines if an index is valid.  If the tabs are not ready yet, we assume that the user is
     * providing a valid index and return true.
     */
    MatPaginatedTabHeader.prototype._isValidIndex = function (index) {
        if (!this._items) {
            return true;
        }
        var tab = this._items ? this._items.toArray()[index] : null;
        return !!tab && !tab.disabled;
    };
    /**
     * Sets focus on the HTML element for the label wrapper and scrolls it into the view if
     * scrolling is enabled.
     */
    MatPaginatedTabHeader.prototype._setTabFocus = function (tabIndex) {
        if (this._showPaginationControls) {
            this._scrollToLabel(tabIndex);
        }
        if (this._items && this._items.length) {
            this._items.toArray()[tabIndex].focus();
            // Do not let the browser manage scrolling to focus the element, this will be handled
            // by using translation. In LTR, the scroll left should be 0. In RTL, the scroll width
            // should be the full width minus the offset width.
            var containerEl = this._tabListContainer.nativeElement;
            var dir = this._getLayoutDirection();
            if (dir == 'ltr') {
                containerEl.scrollLeft = 0;
            }
            else {
                containerEl.scrollLeft = containerEl.scrollWidth - containerEl.offsetWidth;
            }
        }
    };
    /** The layout direction of the containing app. */
    MatPaginatedTabHeader.prototype._getLayoutDirection = function () {
        return this._dir && this._dir.value === 'rtl' ? 'rtl' : 'ltr';
    };
    /** Performs the CSS transformation on the tab list that will cause the list to scroll. */
    MatPaginatedTabHeader.prototype._updateTabScrollPosition = function () {
        var scrollDistance = this.scrollDistance;
        var platform = this._platform;
        var translateX = this._getLayoutDirection() === 'ltr' ? -scrollDistance : scrollDistance;
        // Don't use `translate3d` here because we don't want to create a new layer. A new layer
        // seems to cause flickering and overflow in Internet Explorer. For example, the ink bar
        // and ripples will exceed the boundaries of the visible tab bar.
        // See: https://github.com/angular/components/issues/10276
        // We round the `transform` here, because transforms with sub-pixel precision cause some
        // browsers to blur the content of the element.
        this._tabList.nativeElement.style.transform = "translateX(" + Math.round(translateX) + "px)";
        // Setting the `transform` on IE will change the scroll offset of the parent, causing the
        // position to be thrown off in some cases. We have to reset it ourselves to ensure that
        // it doesn't get thrown off. Note that we scope it only to IE and Edge, because messing
        // with the scroll position throws off Chrome 71+ in RTL mode (see #14689).
        // @breaking-change 9.0.0 Remove null check for `platform` after it can no longer be undefined.
        if (platform && (platform.TRIDENT || platform.EDGE)) {
            this._tabListContainer.nativeElement.scrollLeft = 0;
        }
    };
    Object.defineProperty(MatPaginatedTabHeader.prototype, "scrollDistance", {
        /** Sets the distance in pixels that the tab header should be transformed in the X-axis. */
        get: function () { return this._scrollDistance; },
        set: function (value) {
            this._scrollTo(value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Moves the tab list in the 'before' or 'after' direction (towards the beginning of the list or
     * the end of the list, respectively). The distance to scroll is computed to be a third of the
     * length of the tab list view window.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    MatPaginatedTabHeader.prototype._scrollHeader = function (direction) {
        var viewLength = this._tabListContainer.nativeElement.offsetWidth;
        // Move the scroll distance one-third the length of the tab list's viewport.
        var scrollAmount = (direction == 'before' ? -1 : 1) * viewLength / 3;
        return this._scrollTo(this._scrollDistance + scrollAmount);
    };
    /** Handles click events on the pagination arrows. */
    MatPaginatedTabHeader.prototype._handlePaginatorClick = function (direction) {
        this._stopInterval();
        this._scrollHeader(direction);
    };
    /**
     * Moves the tab list such that the desired tab label (marked by index) is moved into view.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    MatPaginatedTabHeader.prototype._scrollToLabel = function (labelIndex) {
        var selectedLabel = this._items ? this._items.toArray()[labelIndex] : null;
        if (!selectedLabel) {
            return;
        }
        // The view length is the visible width of the tab labels.
        var viewLength = this._tabListContainer.nativeElement.offsetWidth;
        var _a = selectedLabel.elementRef.nativeElement, offsetLeft = _a.offsetLeft, offsetWidth = _a.offsetWidth;
        var labelBeforePos, labelAfterPos;
        if (this._getLayoutDirection() == 'ltr') {
            labelBeforePos = offsetLeft;
            labelAfterPos = labelBeforePos + offsetWidth;
        }
        else {
            labelAfterPos = this._tabList.nativeElement.offsetWidth - offsetLeft;
            labelBeforePos = labelAfterPos - offsetWidth;
        }
        var beforeVisiblePos = this.scrollDistance;
        var afterVisiblePos = this.scrollDistance + viewLength;
        if (labelBeforePos < beforeVisiblePos) {
            // Scroll header to move label to the before direction
            this.scrollDistance -= beforeVisiblePos - labelBeforePos + EXAGGERATED_OVERSCROLL;
        }
        else if (labelAfterPos > afterVisiblePos) {
            // Scroll header to move label to the after direction
            this.scrollDistance += labelAfterPos - afterVisiblePos + EXAGGERATED_OVERSCROLL;
        }
    };
    /**
     * Evaluate whether the pagination controls should be displayed. If the scroll width of the
     * tab list is wider than the size of the header container, then the pagination controls should
     * be shown.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    MatPaginatedTabHeader.prototype._checkPaginationEnabled = function () {
        var isEnabled = this._tabList.nativeElement.scrollWidth > this._elementRef.nativeElement.offsetWidth;
        if (!isEnabled) {
            this.scrollDistance = 0;
        }
        if (isEnabled !== this._showPaginationControls) {
            this._changeDetectorRef.markForCheck();
        }
        this._showPaginationControls = isEnabled;
    };
    /**
     * Evaluate whether the before and after controls should be enabled or disabled.
     * If the header is at the beginning of the list (scroll distance is equal to 0) then disable the
     * before button. If the header is at the end of the list (scroll distance is equal to the
     * maximum distance we can scroll), then disable the after button.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    MatPaginatedTabHeader.prototype._checkScrollingControls = function () {
        // Check if the pagination arrows should be activated.
        this._disableScrollBefore = this.scrollDistance == 0;
        this._disableScrollAfter = this.scrollDistance == this._getMaxScrollDistance();
        this._changeDetectorRef.markForCheck();
    };
    /**
     * Determines what is the maximum length in pixels that can be set for the scroll distance. This
     * is equal to the difference in width between the tab list container and tab header container.
     *
     * This is an expensive call that forces a layout reflow to compute box and scroll metrics and
     * should be called sparingly.
     */
    MatPaginatedTabHeader.prototype._getMaxScrollDistance = function () {
        var lengthOfTabList = this._tabList.nativeElement.scrollWidth;
        var viewLength = this._tabListContainer.nativeElement.offsetWidth;
        return (lengthOfTabList - viewLength) || 0;
    };
    /** Tells the ink-bar to align itself to the current label wrapper */
    MatPaginatedTabHeader.prototype._alignInkBarToSelectedTab = function () {
        var selectedItem = this._items && this._items.length ?
            this._items.toArray()[this.selectedIndex] : null;
        var selectedLabelWrapper = selectedItem ? selectedItem.elementRef.nativeElement : null;
        if (selectedLabelWrapper) {
            this._inkBar.alignToElement(selectedLabelWrapper);
        }
        else {
            this._inkBar.hide();
        }
    };
    /** Stops the currently-running paginator interval.  */
    MatPaginatedTabHeader.prototype._stopInterval = function () {
        this._stopScrolling.next();
    };
    /**
     * Handles the user pressing down on one of the paginators.
     * Starts scrolling the header after a certain amount of time.
     * @param direction In which direction the paginator should be scrolled.
     */
    MatPaginatedTabHeader.prototype._handlePaginatorPress = function (direction) {
        var _this = this;
        // Avoid overlapping timers.
        this._stopInterval();
        // Start a timer after the delay and keep firing based on the interval.
        timer(HEADER_SCROLL_DELAY, HEADER_SCROLL_INTERVAL)
            // Keep the timer going until something tells it to stop or the component is destroyed.
            .pipe(takeUntil(merge(this._stopScrolling, this._destroyed)))
            .subscribe(function () {
            var _a = _this._scrollHeader(direction), maxScrollDistance = _a.maxScrollDistance, distance = _a.distance;
            // Stop the timer if we've reached the start or the end.
            if (distance === 0 || distance >= maxScrollDistance) {
                _this._stopInterval();
            }
        });
    };
    /**
     * Scrolls the header to a given position.
     * @param position Position to which to scroll.
     * @returns Information on the current scroll distance and the maximum.
     */
    MatPaginatedTabHeader.prototype._scrollTo = function (position) {
        var maxScrollDistance = this._getMaxScrollDistance();
        this._scrollDistance = Math.max(0, Math.min(maxScrollDistance, position));
        // Mark that the scroll distance has changed so that after the view is checked, the CSS
        // transformation can move the header.
        this._scrollDistanceChanged = true;
        this._checkScrollingControls();
        return { maxScrollDistance: maxScrollDistance, distance: this._scrollDistance };
    };
    MatPaginatedTabHeader.decorators = [
        { type: Directive, args: [{
                    // TODO(crisbeto): this selector can be removed when we update to Angular 9.0.
                    selector: 'do-not-use-abstract-mat-paginated-tab-header'
                },] }
    ];
    /** @nocollapse */
    MatPaginatedTabHeader.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ChangeDetectorRef },
        { type: ViewportRuler },
        { type: Directionality, decorators: [{ type: Optional }] },
        { type: NgZone },
        { type: Platform },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
    ]; };
    return MatPaginatedTabHeader;
}());
export { MatPaginatedTabHeader };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdGVkLXRhYi1oZWFkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy9wYWdpbmF0ZWQtdGFiLWhlYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLFVBQVUsRUFDVixNQUFNLEVBQ04sUUFBUSxFQUVSLFlBQVksRUFLWixTQUFTLEVBQ1QsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBWSxjQUFjLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDckQsT0FBTyxFQUFDLGVBQWUsRUFBa0IsTUFBTSxtQkFBbUIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQzlFLE9BQU8sRUFBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLFlBQVksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUMxRSxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekMsT0FBTyxFQUFDLFFBQVEsRUFBRSwrQkFBK0IsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2hGLE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLHNDQUFzQyxDQUFDO0FBRzNFLGtEQUFrRDtBQUNsRCxJQUFNLDJCQUEyQixHQUM3QiwrQkFBK0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUMsQ0FBeUIsQ0FBQztBQVM3RTs7O0dBR0c7QUFDSCxJQUFNLHNCQUFzQixHQUFH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LFNBQUMscUJBQXFCOztJQTRadkQsNEJBQUM7Q0FBQSxBQTdlRCxJQTZlQztTQXplcUIscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBFbGVtZW50UmVmLFxuICBOZ1pvbmUsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIEV2ZW50RW1pdHRlcixcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT25EZXN0cm95LFxuICBEaXJlY3RpdmUsXG4gIEluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RpcmVjdGlvbiwgRGlyZWN0aW9uYWxpdHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7Y29lcmNlTnVtYmVyUHJvcGVydHl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1ZpZXdwb3J0UnVsZXJ9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtGb2N1c0tleU1hbmFnZXIsIEZvY3VzYWJsZU9wdGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtFTkQsIEVOVEVSLCBIT01FLCBTUEFDRSwgaGFzTW9kaWZpZXJLZXl9IGZyb20gJ0Bhbmd1bGFyL2Nkay9rZXljb2Rlcyc7XG5pbXBvcnQge21lcmdlLCBvZiBhcyBvYnNlcnZhYmxlT2YsIFN1YmplY3QsIHRpbWVyLCBmcm9tRXZlbnR9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7UGxhdGZvcm0sIG5vcm1hbGl6ZVBhc3NpdmVMaXN0ZW5lck9wdGlvbnN9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcblxuXG4vKiogQ29uZmlnIHVzZWQgdG8gYmluZCBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycyAqL1xuY29uc3QgcGFzc2l2ZUV2ZW50TGlzdGVuZXJPcHRpb25zID1cbiAgICBub3JtYWxpemVQYXNzaXZlTGlzdGVuZXJPcHRpb25zKHtwYXNzaXZlOiB0cnVlfSkgYXMgRXZlbnRMaXN0ZW5lck9wdGlvbnM7XG5cbi8qKlxuICogVGhlIGRpcmVjdGlvbnMgdGhhdCBzY3JvbGxpbmcgY2FuIGdvIGluIHdoZW4gdGhlIGhlYWRlcidzIHRhYnMgZXhjZWVkIHRoZSBoZWFkZXIgd2lkdGguICdBZnRlcidcbiAqIHdpbGwgc2Nyb2xsIHRoZSBoZWFkZXIgdG93YXJkcyB0aGUgZW5kIG9mIHRoZSB0YWJzIGxpc3QgYW5kICdiZWZvcmUnIHdpbGwgc2Nyb2xsIHRvd2FyZHMgdGhlXG4gKiBiZWdpbm5pbmcgb2YgdGhlIGxpc3QuXG4gKi9cbmV4cG9ydCB0eXBlIFNjcm9sbERpcmVjdGlvbiA9ICdhZnRlcicgfCAnYmVmb3JlJztcblxuLyoqXG4gKiBUaGUgZGlzdGFuY2UgaW4gcGl4ZWxzIHRoYXQgd2lsbCBiZSBvdmVyc2hvdCB3aGVuIHNjcm9sbGluZyBhIHRhYiBsYWJlbCBpbnRvIHZpZXcuIFRoaXMgaGVscHNcbiAqIHByb3ZpZGUgYSBzbWFsbCBhZmZvcmRhbmNlIHRvIHRoZSBsYWJlbCBuZXh0IHRvIGl0LlxuICovXG5jb25zdCBFWEFHR0VSQVRFRF9PVkVSU0NST0xMID0gNjA7XG5cbi8qKlxuICogQW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBzdGFydGluZyB0byBzY3JvbGwgdGhlIGhlYWRlciBhdXRvbWF0aWNhbGx5LlxuICogU2V0IGEgbGl0dGxlIGNvbnNlcnZhdGl2ZWx5IGluIG9yZGVyIHRvIGhhbmRsZSBmYWtlIGV2ZW50cyBkaXNwYXRjaGVkIG9uIHRvdWNoIGRldmljZXMuXG4gKi9cbmNvbnN0IEhFQURFUl9TQ1JPTExfREVMQVkgPSA2NTA7XG5cbi8qKlxuICogSW50ZXJ2YWwgaW4gbWlsbGlzZWNvbmRzIGF0IHdoaWNoIHRvIHNjcm9sbCB0aGUgaGVhZGVyXG4gKiB3aGlsZSB0aGUgdXNlciBpcyBob2xkaW5nIHRoZWlyIHBvaW50ZXIuXG4gKi9cbmNvbnN0IEhFQURFUl9TQ1JPTExfSU5URVJWQUwgPSAxMDA7XG5cbi8qKiBJdGVtIGluc2lkZSBhIHBhZ2luYXRlZCB0YWIgaGVhZGVyLiAqL1xuZXhwb3J0IHR5cGUgTWF0UGFnaW5hdGVkVGFiSGVhZGVySXRlbSA9IEZvY3VzYWJsZU9wdGlvbiAmIHtlbGVtZW50UmVmOiBFbGVtZW50UmVmfTtcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBhIHRhYiBoZWFkZXIgdGhhdCBzdXBwb3J0ZWQgcGFnaW5hdGlvbi5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIC8vIFRPRE8oY3Jpc2JldG8pOiB0aGlzIHNlbGVjdG9yIGNhbiBiZSByZW1vdmVkIHdoZW4gd2UgdXBkYXRlIHRvIEFuZ3VsYXIgOS4wLlxuICBzZWxlY3RvcjogJ2RvLW5vdC11c2UtYWJzdHJhY3QtbWF0LXBhZ2luYXRlZC10YWItaGVhZGVyJ1xufSlcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNYXRQYWdpbmF0ZWRUYWJIZWFkZXIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkLCBBZnRlckNvbnRlbnRJbml0LFxuICBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBhYnN0cmFjdCBfaXRlbXM6IFF1ZXJ5TGlzdDxNYXRQYWdpbmF0ZWRUYWJIZWFkZXJJdGVtPjtcbiAgYWJzdHJhY3QgX2lua0Jhcjoge2hpZGU6ICgpID0+IHZvaWQsIGFsaWduVG9FbGVtZW50OiAoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHZvaWR9O1xuICBhYnN0cmFjdCBfdGFiTGlzdENvbnRhaW5lcjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIGFic3RyYWN0IF90YWJMaXN0OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgYWJzdHJhY3QgX25leHRQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBhYnN0cmFjdCBfcHJldmlvdXNQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIC8qKiBUaGUgZGlzdGFuY2UgaW4gcGl4ZWxzIHRoYXQgdGhlIHRhYiBsYWJlbHMgc2hvdWxkIGJlIHRyYW5zbGF0ZWQgdG8gdGhlIGxlZnQuICovXG4gIHByaXZhdGUgX3Njcm9sbERpc3RhbmNlID0gMDtcblxuICAvKiogV2hldGhlciB0aGUgaGVhZGVyIHNob3VsZCBzY3JvbGwgdG8gdGhlIHNlbGVjdGVkIGluZGV4IGFmdGVyIHRoZSB2aWV3IGhhcyBiZWVuIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX3NlbGVjdGVkSW5kZXhDaGFuZ2VkID0gZmFsc2U7XG5cbiAgLyoqIEVtaXRzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuICovXG4gIHByb3RlY3RlZCByZWFkb25seSBfZGVzdHJveWVkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICAvKiogV2hldGhlciB0aGUgY29udHJvbHMgZm9yIHBhZ2luYXRpb24gc2hvdWxkIGJlIGRpc3BsYXllZCAqL1xuICBfc2hvd1BhZ2luYXRpb25Db250cm9scyA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSB0YWIgbGlzdCBjYW4gYmUgc2Nyb2xsZWQgbW9yZSB0b3dhcmRzIHRoZSBlbmQgb2YgdGhlIHRhYiBsYWJlbCBsaXN0LiAqL1xuICBfZGlzYWJsZVNjcm9sbEFmdGVyID0gdHJ1ZTtcblxuICAvKiogV2hldGhlciB0aGUgdGFiIGxpc3QgY2FuIGJlIHNjcm9sbGVkIG1vcmUgdG93YXJkcyB0aGUgYmVnaW5uaW5nIG9mIHRoZSB0YWIgbGFiZWwgbGlzdC4gKi9cbiAgX2Rpc2FibGVTY3JvbGxCZWZvcmUgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHRhYiBsYWJlbHMgdGhhdCBhcmUgZGlzcGxheWVkIG9uIHRoZSBoZWFkZXIuIFdoZW4gdGhpcyBjaGFuZ2VzLCB0aGUgaGVhZGVyXG4gICAqIHNob3VsZCByZS1ldmFsdWF0ZSB0aGUgc2Nyb2xsIHBvc2l0aW9uLlxuICAgKi9cbiAgcHJpdmF0ZSBfdGFiTGFiZWxDb3VudDogbnVtYmVyO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBzY3JvbGwgZGlzdGFuY2UgaGFzIGNoYW5nZWQgYW5kIHNob3VsZCBiZSBhcHBsaWVkIGFmdGVyIHRoZSB2aWV3IGlzIGNoZWNrZWQuICovXG4gIHByaXZhdGUgX3Njcm9sbERpc3RhbmNlQ2hhbmdlZDogYm9vbGVhbjtcblxuICAvKiogVXNlZCB0byBtYW5hZ2UgZm9jdXMgYmV0d2VlbiB0aGUgdGFicy4gKi9cbiAgcHJpdmF0ZSBfa2V5TWFuYWdlcjogRm9jdXNLZXlNYW5hZ2VyPE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW0+O1xuXG4gIC8qKiBDYWNoZWQgdGV4dCBjb250ZW50IG9mIHRoZSBoZWFkZXIuICovXG4gIHByaXZhdGUgX2N1cnJlbnRUZXh0Q29udGVudDogc3RyaW5nO1xuXG4gIC8qKiBTdHJlYW0gdGhhdCB3aWxsIHN0b3AgdGhlIGF1dG9tYXRlZCBzY3JvbGxpbmcuICovXG4gIHByaXZhdGUgX3N0b3BTY3JvbGxpbmcgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKiBUaGUgaW5kZXggb2YgdGhlIGFjdGl2ZSB0YWIuICovXG4gIGdldCBzZWxlY3RlZEluZGV4KCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9zZWxlY3RlZEluZGV4OyB9XG4gIHNldCBzZWxlY3RlZEluZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICB2YWx1ZSA9IGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKTtcblxuICAgIGlmICh0aGlzLl9zZWxlY3RlZEluZGV4ICE9IHZhbHVlKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZEluZGV4Q2hhbmdlZCA9IHRydWU7XG4gICAgICB0aGlzLl9zZWxlY3RlZEluZGV4ID0gdmFsdWU7XG5cbiAgICAgIGlmICh0aGlzLl9rZXlNYW5hZ2VyKSB7XG4gICAgICAgIHRoaXMuX2tleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHByaXZhdGUgX3NlbGVjdGVkSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgb3B0aW9uIGlzIHNlbGVjdGVkLiAqL1xuICByZWFkb25seSBzZWxlY3RGb2N1c2VkSW5kZXg6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgLyoqIEV2ZW50IGVtaXR0ZWQgd2hlbiBhIGxhYmVsIGlzIGZvY3VzZWQuICovXG4gIHJlYWRvbmx5IGluZGV4Rm9jdXNlZDogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBfZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICAgKiBAZGVwcmVjYXRlZCBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIGBfcGxhdGZvcm1gIGFuZCBgX2FuaW1hdGlvbk1vZGVgXG4gICAgICAgICAgICAgICAqIHBhcmFtZXRlcnMgdG8gYmVjb21lIHJlcXVpcmVkLlxuICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcGxhdGZvcm0/OiBQbGF0Zm9ybSxcbiAgICAgICAgICAgICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIHB1YmxpYyBfYW5pbWF0aW9uTW9kZT86IHN0cmluZykge1xuXG4gICAgLy8gQmluZCB0aGUgYG1vdXNlbGVhdmVgIGV2ZW50IG9uIHRoZSBvdXRzaWRlIHNpbmNlIGl0IGRvZXNuJ3QgY2hhbmdlIGFueXRoaW5nIGluIHRoZSB2aWV3LlxuICAgIF9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgZnJvbUV2ZW50KF9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdtb3VzZWxlYXZlJylcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX3N0b3BJbnRlcnZhbCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgdXNlciBoYXMgc2VsZWN0ZWQgYW4gaXRlbSB2aWEgdGhlIGtleWJvYXJkLiAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2l0ZW1TZWxlY3RlZChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQ7XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIFdlIG5lZWQgdG8gaGFuZGxlIHRoZXNlIGV2ZW50cyBtYW51YWxseSwgYmVjYXVzZSB3ZSB3YW50IHRvIGJpbmQgcGFzc2l2ZSBldmVudCBsaXN0ZW5lcnMuXG4gICAgZnJvbUV2ZW50KHRoaXMuX3ByZXZpb3VzUGFnaW5hdG9yLm5hdGl2ZUVsZW1lbnQsICd0b3VjaHN0YXJ0JywgcGFzc2l2ZUV2ZW50TGlzdGVuZXJPcHRpb25zKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5faGFuZGxlUGFnaW5hdG9yUHJlc3MoJ2JlZm9yZScpO1xuICAgICAgfSk7XG5cbiAgICBmcm9tRXZlbnQodGhpcy5fbmV4dFBhZ2luYXRvci5uYXRpdmVFbGVtZW50LCAndG91Y2hzdGFydCcsIHBhc3NpdmVFdmVudExpc3RlbmVyT3B0aW9ucylcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95ZWQpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2hhbmRsZVBhZ2luYXRvclByZXNzKCdhZnRlcicpO1xuICAgICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgY29uc3QgZGlyQ2hhbmdlID0gdGhpcy5fZGlyID8gdGhpcy5fZGlyLmNoYW5nZSA6IG9ic2VydmFibGVPZihudWxsKTtcbiAgICBjb25zdCByZXNpemUgPSB0aGlzLl92aWV3cG9ydFJ1bGVyLmNoYW5nZSgxNTApO1xuICAgIGNvbnN0IHJlYWxpZ24gPSAoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oKTtcbiAgICAgIHRoaXMuX2FsaWduSW5rQmFyVG9TZWxlY3RlZFRhYigpO1xuICAgIH07XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcjxNYXRQYWdpbmF0ZWRUYWJIZWFkZXJJdGVtPih0aGlzLl9pdGVtcylcbiAgICAgIC53aXRoSG9yaXpvbnRhbE9yaWVudGF0aW9uKHRoaXMuX2dldExheW91dERpcmVjdGlvbigpKVxuICAgICAgLndpdGhXcmFwKCk7XG5cbiAgICB0aGlzLl9rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oMCk7XG5cbiAgICAvLyBEZWZlciB0aGUgZmlyc3QgY2FsbCBpbiBvcmRlciB0byBhbGxvdyBmb3Igc2xvd2VyIGJyb3dzZXJzIHRvIGxheSBvdXQgdGhlIGVsZW1lbnRzLlxuICAgIC8vIFRoaXMgaGVscHMgaW4gY2FzZXMgd2hlcmUgdGhlIHVzZXIgbGFuZHMgZGlyZWN0bHkgb24gYSBwYWdlIHdpdGggcGFnaW5hdGVkIHRhYnMuXG4gICAgdHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSAhPT0gJ3VuZGVmaW5lZCcgPyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVhbGlnbikgOiByZWFsaWduKCk7XG5cbiAgICAvLyBPbiBkaXIgY2hhbmdlIG9yIHdpbmRvdyByZXNpemUsIHJlYWxpZ24gdGhlIGluayBiYXIgYW5kIHVwZGF0ZSB0aGUgb3JpZW50YXRpb24gb2ZcbiAgICAvLyB0aGUga2V5IG1hbmFnZXIgaWYgdGhlIGRpcmVjdGlvbiBoYXMgY2hhbmdlZC5cbiAgICBtZXJnZShkaXJDaGFuZ2UsIHJlc2l6ZSwgdGhpcy5faXRlbXMuY2hhbmdlcykucGlwZSh0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHJlYWxpZ24oKTtcbiAgICAgIHRoaXMuX2tleU1hbmFnZXIud2l0aEhvcml6b250YWxPcmllbnRhdGlvbih0aGlzLl9nZXRMYXlvdXREaXJlY3Rpb24oKSk7XG4gICAgfSk7XG5cbiAgICAvLyBJZiB0aGVyZSBpcyBhIGNoYW5nZSBpbiB0aGUgZm9jdXMga2V5IG1hbmFnZXIgd2UgbmVlZCB0byBlbWl0IHRoZSBgaW5kZXhGb2N1c2VkYFxuICAgIC8vIGV2ZW50IGluIG9yZGVyIHRvIHByb3ZpZGUgYSBwdWJsaWMgZXZlbnQgdGhhdCBub3RpZmllcyBhYm91dCBmb2N1cyBjaGFuZ2VzLiBBbHNvIHdlIHJlYWxpZ25cbiAgICAvLyB0aGUgdGFicyBjb250YWluZXIgYnkgc2Nyb2xsaW5nIHRoZSBuZXcgZm9jdXNlZCB0YWIgaW50byB0aGUgdmlzaWJsZSBzZWN0aW9uLlxuICAgIHRoaXMuX2tleU1hbmFnZXIuY2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuX2Rlc3Ryb3llZCkpLnN1YnNjcmliZShuZXdGb2N1c0luZGV4ID0+IHtcbiAgICAgIHRoaXMuaW5kZXhGb2N1c2VkLmVtaXQobmV3Rm9jdXNJbmRleCk7XG4gICAgICB0aGlzLl9zZXRUYWJGb2N1cyhuZXdGb2N1c0luZGV4KTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpOiB2b2lkIHtcbiAgICAvLyBJZiB0aGUgbnVtYmVyIG9mIHRhYiBsYWJlbHMgaGF2ZSBjaGFuZ2VkLCBjaGVjayBpZiBzY3JvbGxpbmcgc2hvdWxkIGJlIGVuYWJsZWRcbiAgICBpZiAodGhpcy5fdGFiTGFiZWxDb3VudCAhPSB0aGlzLl9pdGVtcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMudXBkYXRlUGFnaW5hdGlvbigpO1xuICAgICAgdGhpcy5fdGFiTGFiZWxDb3VudCA9IHRoaXMuX2l0ZW1zLmxlbmd0aDtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSBzZWxlY3RlZCBpbmRleCBoYXMgY2hhbmdlZCwgc2Nyb2xsIHRvIHRoZSBsYWJlbCBhbmQgY2hlY2sgaWYgdGhlIHNjcm9sbGluZyBjb250cm9sc1xuICAgIC8vIHNob3VsZCBiZSBkaXNhYmxlZC5cbiAgICBpZiAodGhpcy5fc2VsZWN0ZWRJbmRleENoYW5nZWQpIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRvTGFiZWwodGhpcy5fc2VsZWN0ZWRJbmRleCk7XG4gICAgICB0aGlzLl9jaGVja1Njcm9sbGluZ0NvbnRyb2xzKCk7XG4gICAgICB0aGlzLl9hbGlnbklua0JhclRvU2VsZWN0ZWRUYWIoKTtcbiAgICAgIHRoaXMuX3NlbGVjdGVkSW5kZXhDaGFuZ2VkID0gZmFsc2U7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgc2Nyb2xsIGRpc3RhbmNlIGhhcyBiZWVuIGNoYW5nZWQgKHRhYiBzZWxlY3RlZCwgZm9jdXNlZCwgc2Nyb2xsIGNvbnRyb2xzIGFjdGl2YXRlZCksXG4gICAgLy8gdGhlbiB0cmFuc2xhdGUgdGhlIGhlYWRlciB0byByZWZsZWN0IHRoaXMuXG4gICAgaWYgKHRoaXMuX3Njcm9sbERpc3RhbmNlQ2hhbmdlZCkge1xuICAgICAgdGhpcy5fdXBkYXRlVGFiU2Nyb2xsUG9zaXRpb24oKTtcbiAgICAgIHRoaXMuX3Njcm9sbERpc3RhbmNlQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZGVzdHJveWVkLm5leHQoKTtcbiAgICB0aGlzLl9kZXN0cm95ZWQuY29tcGxldGUoKTtcbiAgICB0aGlzLl9zdG9wU2Nyb2xsaW5nLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBrZXlib2FyZCBldmVudHMgb24gdGhlIGhlYWRlci4gKi9cbiAgX2hhbmRsZUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBXZSBkb24ndCBoYW5kbGUgYW55IGtleSBiaW5kaW5ncyB3aXRoIGEgbW9kaWZpZXIga2V5LlxuICAgIGlmIChoYXNNb2RpZmllcktleShldmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgIGNhc2UgSE9NRTpcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRGaXJzdEl0ZW1BY3RpdmUoKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVORDpcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5zZXRMYXN0SXRlbUFjdGl2ZSgpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRU5URVI6XG4gICAgICBjYXNlIFNQQUNFOlxuICAgICAgICB0aGlzLnNlbGVjdEZvY3VzZWRJbmRleC5lbWl0KHRoaXMuZm9jdXNJbmRleCk7XG4gICAgICAgIHRoaXMuX2l0ZW1TZWxlY3RlZChldmVudCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5fa2V5TWFuYWdlci5vbktleWRvd24oZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3Igd2hlbiB0aGUgTXV0YXRpb25PYnNlcnZlciBkZXRlY3RzIHRoYXQgdGhlIGNvbnRlbnQgaGFzIGNoYW5nZWQuXG4gICAqL1xuICBfb25Db250ZW50Q2hhbmdlcygpIHtcbiAgICBjb25zdCB0ZXh0Q29udGVudCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC50ZXh0Q29udGVudDtcblxuICAgIC8vIFdlIG5lZWQgdG8gZGlmZiB0aGUgdGV4dCBjb250ZW50IG9mIHRoZSBoZWFkZXIsIGJlY2F1c2UgdGhlIE11dGF0aW9uT2JzZXJ2ZXIgY2FsbGJhY2tcbiAgICAvLyB3aWxsIGZpcmUgZXZlbiBpZiB0aGUgdGV4dCBjb250ZW50IGRpZG4ndCBjaGFuZ2Ugd2hpY2ggaXMgaW5lZmZpY2llbnQgYW5kIGlzIHByb25lXG4gICAgLy8gdG8gaW5maW5pdGUgbG9vcHMgaWYgYSBwb29ybHkgY29uc3RydWN0ZWQgZXhwcmVzc2lvbiBpcyBwYXNzZWQgaW4gKHNlZSAjMTQyNDkpLlxuICAgIGlmICh0ZXh0Q29udGVudCAhPT0gdGhpcy5fY3VycmVudFRleHRDb250ZW50KSB7XG4gICAgICB0aGlzLl9jdXJyZW50VGV4dENvbnRlbnQgPSB0ZXh0Q29udGVudCB8fCAnJztcblxuICAgICAgLy8gVGhlIGNvbnRlbnQgb2JzZXJ2ZXIgcnVucyBvdXRzaWRlIHRoZSBgTmdab25lYCBieSBkZWZhdWx0LCB3aGljaFxuICAgICAgLy8gbWVhbnMgdGhhdCB3ZSBuZWVkIHRvIGJyaW5nIHRoZSBjYWxsYmFjayBiYWNrIGluIG91cnNlbHZlcy5cbiAgICAgIHRoaXMuX25nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVBhZ2luYXRpb24oKTtcbiAgICAgICAgdGhpcy5fYWxpZ25JbmtCYXJUb1NlbGVjdGVkVGFiKCk7XG4gICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHZpZXcgd2hldGhlciBwYWdpbmF0aW9uIHNob3VsZCBiZSBlbmFibGVkIG9yIG5vdC5cbiAgICpcbiAgICogV0FSTklORzogQ2FsbGluZyB0aGlzIG1ldGhvZCBjYW4gYmUgdmVyeSBjb3N0bHkgaW4gdGVybXMgb2YgcGVyZm9ybWFuY2UuIEl0IHNob3VsZCBiZSBjYWxsZWRcbiAgICogYXMgaW5mcmVxdWVudGx5IGFzIHBvc3NpYmxlIGZyb20gb3V0c2lkZSBvZiB0aGUgVGFicyBjb21wb25lbnQgYXMgaXQgY2F1c2VzIGEgcmVmbG93IG9mIHRoZVxuICAgKiBwYWdlLlxuICAgKi9cbiAgdXBkYXRlUGFnaW5hdGlvbigpIHtcbiAgICB0aGlzLl9jaGVja1BhZ2luYXRpb25FbmFibGVkKCk7XG4gICAgdGhpcy5fY2hlY2tTY3JvbGxpbmdDb250cm9scygpO1xuICAgIHRoaXMuX3VwZGF0ZVRhYlNjcm9sbFBvc2l0aW9uKCk7XG4gIH1cblxuICAvKiogVHJhY2tzIHdoaWNoIGVsZW1lbnQgaGFzIGZvY3VzOyB1c2VkIGZvciBrZXlib2FyZCBuYXZpZ2F0aW9uICovXG4gIGdldCBmb2N1c0luZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2tleU1hbmFnZXIgPyB0aGlzLl9rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCEgOiAwO1xuICB9XG5cbiAgLyoqIFdoZW4gdGhlIGZvY3VzIGluZGV4IGlzIHNldCwgd2UgbXVzdCBtYW51YWxseSBzZW5kIGZvY3VzIHRvIHRoZSBjb3JyZWN0IGxhYmVsICovXG4gIHNldCBmb2N1c0luZGV4KHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAoIXRoaXMuX2lzVmFsaWRJbmRleCh2YWx1ZSkgfHwgdGhpcy5mb2N1c0luZGV4ID09PSB2YWx1ZSB8fCAhdGhpcy5fa2V5TWFuYWdlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2tleU1hbmFnZXIuc2V0QWN0aXZlSXRlbSh2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyBpZiBhbiBpbmRleCBpcyB2YWxpZC4gIElmIHRoZSB0YWJzIGFyZSBub3QgcmVhZHkgeWV0LCB3ZSBhc3N1bWUgdGhhdCB0aGUgdXNlciBpc1xuICAgKiBwcm92aWRpbmcgYSB2YWxpZCBpbmRleCBhbmQgcmV0dXJuIHRydWUuXG4gICAqL1xuICBfaXNWYWxpZEluZGV4KGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuX2l0ZW1zKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICBjb25zdCB0YWIgPSB0aGlzLl9pdGVtcyA/IHRoaXMuX2l0ZW1zLnRvQXJyYXkoKVtpbmRleF0gOiBudWxsO1xuICAgIHJldHVybiAhIXRhYiAmJiAhdGFiLmRpc2FibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZm9jdXMgb24gdGhlIEhUTUwgZWxlbWVudCBmb3IgdGhlIGxhYmVsIHdyYXBwZXIgYW5kIHNjcm9sbHMgaXQgaW50byB0aGUgdmlldyBpZlxuICAgKiBzY3JvbGxpbmcgaXMgZW5hYmxlZC5cbiAgICovXG4gIF9zZXRUYWJGb2N1cyh0YWJJbmRleDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuX3Nob3dQYWdpbmF0aW9uQ29udHJvbHMpIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRvTGFiZWwodGFiSW5kZXgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9pdGVtcyAmJiB0aGlzLl9pdGVtcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuX2l0ZW1zLnRvQXJyYXkoKVt0YWJJbmRleF0uZm9jdXMoKTtcblxuICAgICAgLy8gRG8gbm90IGxldCB0aGUgYnJvd3NlciBtYW5hZ2Ugc2Nyb2xsaW5nIHRvIGZvY3VzIHRoZSBlbGVtZW50LCB0aGlzIHdpbGwgYmUgaGFuZGxlZFxuICAgICAgLy8gYnkgdXNpbmcgdHJhbnNsYXRpb24uIEluIExUUiwgdGhlIHNjcm9sbCBsZWZ0IHNob3VsZCBiZSAwLiBJbiBSVEwsIHRoZSBzY3JvbGwgd2lkdGhcbiAgICAgIC8vIHNob3VsZCBiZSB0aGUgZnVsbCB3aWR0aCBtaW51cyB0aGUgb2Zmc2V0IHdpZHRoLlxuICAgICAgY29uc3QgY29udGFpbmVyRWwgPSB0aGlzLl90YWJMaXN0Q29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBjb25zdCBkaXIgPSB0aGlzLl9nZXRMYXlvdXREaXJlY3Rpb24oKTtcblxuICAgICAgaWYgKGRpciA9PSAnbHRyJykge1xuICAgICAgICBjb250YWluZXJFbC5zY3JvbGxMZWZ0ID0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRhaW5lckVsLnNjcm9sbExlZnQgPSBjb250YWluZXJFbC5zY3JvbGxXaWR0aCAtIGNvbnRhaW5lckVsLm9mZnNldFdpZHRoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBUaGUgbGF5b3V0IGRpcmVjdGlvbiBvZiB0aGUgY29udGFpbmluZyBhcHAuICovXG4gIF9nZXRMYXlvdXREaXJlY3Rpb24oKTogRGlyZWN0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZGlyICYmIHRoaXMuX2Rpci52YWx1ZSA9PT0gJ3J0bCcgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgLyoqIFBlcmZvcm1zIHRoZSBDU1MgdHJhbnNmb3JtYXRpb24gb24gdGhlIHRhYiBsaXN0IHRoYXQgd2lsbCBjYXVzZSB0aGUgbGlzdCB0byBzY3JvbGwuICovXG4gIF91cGRhdGVUYWJTY3JvbGxQb3NpdGlvbigpIHtcbiAgICBjb25zdCBzY3JvbGxEaXN0YW5jZSA9IHRoaXMuc2Nyb2xsRGlzdGFuY2U7XG4gICAgY29uc3QgcGxhdGZvcm0gPSB0aGlzLl9wbGF0Zm9ybTtcbiAgICBjb25zdCB0cmFuc2xhdGVYID0gdGhpcy5fZ2V0TGF5b3V0RGlyZWN0aW9uKCkgPT09ICdsdHInID8gLXNjcm9sbERpc3RhbmNlIDogc2Nyb2xsRGlzdGFuY2U7XG5cbiAgICAvLyBEb24ndCB1c2UgYHRyYW5zbGF0ZTNkYCBoZXJlIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudCB0byBjcmVhdGUgYSBuZXcgbGF5ZXIuIEEgbmV3IGxheWVyXG4gICAgLy8gc2VlbXMgdG8gY2F1c2UgZmxpY2tlcmluZyBhbmQgb3ZlcmZsb3cgaW4gSW50ZXJuZXQgRXhwbG9yZXIuIEZvciBleGFtcGxlLCB0aGUgaW5rIGJhclxuICAgIC8vIGFuZCByaXBwbGVzIHdpbGwgZXhjZWVkIHRoZSBib3VuZGFyaWVzIG9mIHRoZSB2aXNpYmxlIHRhYiBiYXIuXG4gICAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9jb21wb25lbnRzL2lzc3Vlcy8xMDI3NlxuICAgIC8vIFdlIHJvdW5kIHRoZSBgdHJhbnNmb3JtYCBoZXJlLCBiZWNhdXNlIHRyYW5zZm9ybXMgd2l0aCBzdWItcGl4ZWwgcHJlY2lzaW9uIGNhdXNlIHNvbWVcbiAgICAvLyBicm93c2VycyB0byBibHVyIHRoZSBjb250ZW50IG9mIHRoZSBlbGVtZW50LlxuICAgIHRoaXMuX3RhYkxpc3QubmF0aXZlRWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSBgdHJhbnNsYXRlWCgke01hdGgucm91bmQodHJhbnNsYXRlWCl9cHgpYDtcblxuICAgIC8vIFNldHRpbmcgdGhlIGB0cmFuc2Zvcm1gIG9uIElFIHdpbGwgY2hhbmdlIHRoZSBzY3JvbGwgb2Zmc2V0IG9mIHRoZSBwYXJlbnQsIGNhdXNpbmcgdGhlXG4gICAgLy8gcG9zaXRpb24gdG8gYmUgdGhyb3duIG9mZiBpbiBzb21lIGNhc2VzLiBXZSBoYXZlIHRvIHJlc2V0IGl0IG91cnNlbHZlcyB0byBlbnN1cmUgdGhhdFxuICAgIC8vIGl0IGRvZXNuJ3QgZ2V0IHRocm93biBvZmYuIE5vdGUgdGhhdCB3ZSBzY29wZSBpdCBvbmx5IHRvIElFIGFuZCBFZGdlLCBiZWNhdXNlIG1lc3NpbmdcbiAgICAvLyB3aXRoIHRoZSBzY3JvbGwgcG9zaXRpb24gdGhyb3dzIG9mZiBDaHJvbWUgNzErIGluIFJUTCBtb2RlIChzZWUgIzE0Njg5KS5cbiAgICAvLyBAYnJlYWtpbmctY2hhbmdlIDkuMC4wIFJlbW92ZSBudWxsIGNoZWNrIGZvciBgcGxhdGZvcm1gIGFmdGVyIGl0IGNhbiBubyBsb25nZXIgYmUgdW5kZWZpbmVkLlxuICAgIGlmIChwbGF0Zm9ybSAmJiAocGxhdGZvcm0uVFJJREVOVCB8fCBwbGF0Zm9ybS5FREdFKSkge1xuICAgICAgdGhpcy5fdGFiTGlzdENvbnRhaW5lci5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSBkaXN0YW5jZSBpbiBwaXhlbHMgdGhhdCB0aGUgdGFiIGhlYWRlciBzaG91bGQgYmUgdHJhbnNmb3JtZWQgaW4gdGhlIFgtYXhpcy4gKi9cbiAgZ2V0IHNjcm9sbERpc3RhbmNlKCk6IG51bWJlciB7IHJldHVybiB0aGlzLl9zY3JvbGxEaXN0YW5jZTsgfVxuICBzZXQgc2Nyb2xsRGlzdGFuY2UodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuX3Njcm9sbFRvKHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgdGFiIGxpc3QgaW4gdGhlICdiZWZvcmUnIG9yICdhZnRlcicgZGlyZWN0aW9uICh0b3dhcmRzIHRoZSBiZWdpbm5pbmcgb2YgdGhlIGxpc3Qgb3JcbiAgICogdGhlIGVuZCBvZiB0aGUgbGlzdCwgcmVzcGVjdGl2ZWx5KS4gVGhlIGRpc3RhbmNlIHRvIHNjcm9sbCBpcyBjb21wdXRlZCB0byBiZSBhIHRoaXJkIG9mIHRoZVxuICAgKiBsZW5ndGggb2YgdGhlIHRhYiBsaXN0IHZpZXcgd2luZG93LlxuICAgKlxuICAgKiBUaGlzIGlzIGFuIGV4cGVuc2l2ZSBjYWxsIHRoYXQgZm9yY2VzIGEgbGF5b3V0IHJlZmxvdyB0byBjb21wdXRlIGJveCBhbmQgc2Nyb2xsIG1ldHJpY3MgYW5kXG4gICAqIHNob3VsZCBiZSBjYWxsZWQgc3BhcmluZ2x5LlxuICAgKi9cbiAgX3Njcm9sbEhlYWRlcihkaXJlY3Rpb246IFNjcm9sbERpcmVjdGlvbikge1xuICAgIGNvbnN0IHZpZXdMZW5ndGggPSB0aGlzLl90YWJMaXN0Q29udGFpbmVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG5cbiAgICAvLyBNb3ZlIHRoZSBzY3JvbGwgZGlzdGFuY2Ugb25lLXRoaXJkIHRoZSBsZW5ndGggb2YgdGhlIHRhYiBsaXN0J3Mgdmlld3BvcnQuXG4gICAgY29uc3Qgc2Nyb2xsQW1vdW50ID0gKGRpcmVjdGlvbiA9PSAnYmVmb3JlJyA/IC0xIDogMSkgKiB2aWV3TGVuZ3RoIC8gMztcblxuICAgIHJldHVybiB0aGlzLl9zY3JvbGxUbyh0aGlzLl9zY3JvbGxEaXN0YW5jZSArIHNjcm9sbEFtb3VudCk7XG4gIH1cblxuICAvKiogSGFuZGxlcyBjbGljayBldmVudHMgb24gdGhlIHBhZ2luYXRpb24gYXJyb3dzLiAqL1xuICBfaGFuZGxlUGFnaW5hdG9yQ2xpY2soZGlyZWN0aW9uOiBTY3JvbGxEaXJlY3Rpb24pIHtcbiAgICB0aGlzLl9zdG9wSW50ZXJ2YWwoKTtcbiAgICB0aGlzLl9zY3JvbGxIZWFkZXIoZGlyZWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNb3ZlcyB0aGUgdGFiIGxpc3Qgc3VjaCB0aGF0IHRoZSBkZXNpcmVkIHRhYiBsYWJlbCAobWFya2VkIGJ5IGluZGV4KSBpcyBtb3ZlZCBpbnRvIHZpZXcuXG4gICAqXG4gICAqIFRoaXMgaXMgYW4gZXhwZW5zaXZlIGNhbGwgdGhhdCBmb3JjZXMgYSBsYXlvdXQgcmVmbG93IHRvIGNvbXB1dGUgYm94IGFuZCBzY3JvbGwgbWV0cmljcyBhbmRcbiAgICogc2hvdWxkIGJlIGNhbGxlZCBzcGFyaW5nbHkuXG4gICAqL1xuICBfc2Nyb2xsVG9MYWJlbChsYWJlbEluZGV4OiBudW1iZXIpIHtcbiAgICBjb25zdCBzZWxlY3RlZExhYmVsID0gdGhpcy5faXRlbXMgPyB0aGlzLl9pdGVtcy50b0FycmF5KClbbGFiZWxJbmRleF0gOiBudWxsO1xuXG4gICAgaWYgKCFzZWxlY3RlZExhYmVsKSB7IHJldHVybjsgfVxuXG4gICAgLy8gVGhlIHZpZXcgbGVuZ3RoIGlzIHRoZSB2aXNpYmxlIHdpZHRoIG9mIHRoZSB0YWIgbGFiZWxzLlxuICAgIGNvbnN0IHZpZXdMZW5ndGggPSB0aGlzLl90YWJMaXN0Q29udGFpbmVyLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgY29uc3Qge29mZnNldExlZnQsIG9mZnNldFdpZHRofSA9IHNlbGVjdGVkTGFiZWwuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgbGV0IGxhYmVsQmVmb3JlUG9zOiBudW1iZXIsIGxhYmVsQWZ0ZXJQb3M6IG51bWJlcjtcbiAgICBpZiAodGhpcy5fZ2V0TGF5b3V0RGlyZWN0aW9uKCkgPT0gJ2x0cicpIHtcbiAgICAgIGxhYmVsQmVmb3JlUG9zID0gb2Zmc2V0TGVmdDtcbiAgICAgIGxhYmVsQWZ0ZXJQb3MgPSBsYWJlbEJlZm9yZVBvcyArIG9mZnNldFdpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYWJlbEFmdGVyUG9zID0gdGhpcy5fdGFiTGlzdC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoIC0gb2Zmc2V0TGVmdDtcbiAgICAgIGxhYmVsQmVmb3JlUG9zID0gbGFiZWxBZnRlclBvcyAtIG9mZnNldFdpZHRoO1xuICAgIH1cblxuICAgIGNvbnN0IGJlZm9yZVZpc2libGVQb3MgPSB0aGlzLnNjcm9sbERpc3RhbmNlO1xuICAgIGNvbnN0IGFmdGVyVmlzaWJsZVBvcyA9IHRoaXMuc2Nyb2xsRGlzdGFuY2UgKyB2aWV3TGVuZ3RoO1xuXG4gICAgaWYgKGxhYmVsQmVmb3JlUG9zIDwgYmVmb3JlVmlzaWJsZVBvcykge1xuICAgICAgLy8gU2Nyb2xsIGhlYWRlciB0byBtb3ZlIGxhYmVsIHRvIHRoZSBiZWZvcmUgZGlyZWN0aW9uXG4gICAgICB0aGlzLnNjcm9sbERpc3RhbmNlIC09IGJlZm9yZVZpc2libGVQb3MgLSBsYWJlbEJlZm9yZVBvcyArIEVYQUdHRVJBVEVEX09WRVJTQ1JPTEw7XG4gICAgfSBlbHNlIGlmIChsYWJlbEFmdGVyUG9zID4gYWZ0ZXJWaXNpYmxlUG9zKSB7XG4gICAgICAvLyBTY3JvbGwgaGVhZGVyIHRvIG1vdmUgbGFiZWwgdG8gdGhlIGFmdGVyIGRpcmVjdGlvblxuICAgICAgdGhpcy5zY3JvbGxEaXN0YW5jZSArPSBsYWJlbEFmdGVyUG9zIC0gYWZ0ZXJWaXNpYmxlUG9zICsgRVhBR0dFUkFURURfT1ZFUlNDUk9MTDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXZhbHVhdGUgd2hldGhlciB0aGUgcGFnaW5hdGlvbiBjb250cm9scyBzaG91bGQgYmUgZGlzcGxheWVkLiBJZiB0aGUgc2Nyb2xsIHdpZHRoIG9mIHRoZVxuICAgKiB0YWIgbGlzdCBpcyB3aWRlciB0aGFuIHRoZSBzaXplIG9mIHRoZSBoZWFkZXIgY29udGFpbmVyLCB0aGVuIHRoZSBwYWdpbmF0aW9uIGNvbnRyb2xzIHNob3VsZFxuICAgKiBiZSBzaG93bi5cbiAgICpcbiAgICogVGhpcyBpcyBhbiBleHBlbnNpdmUgY2FsbCB0aGF0IGZvcmNlcyBhIGxheW91dCByZWZsb3cgdG8gY29tcHV0ZSBib3ggYW5kIHNjcm9sbCBtZXRyaWNzIGFuZFxuICAgKiBzaG91bGQgYmUgY2FsbGVkIHNwYXJpbmdseS5cbiAgICovXG4gIF9jaGVja1BhZ2luYXRpb25FbmFibGVkKCkge1xuICAgIGNvbnN0IGlzRW5hYmxlZCA9XG4gICAgICAgIHRoaXMuX3RhYkxpc3QubmF0aXZlRWxlbWVudC5zY3JvbGxXaWR0aCA+IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcblxuICAgIGlmICghaXNFbmFibGVkKSB7XG4gICAgICB0aGlzLnNjcm9sbERpc3RhbmNlID0gMDtcbiAgICB9XG5cbiAgICBpZiAoaXNFbmFibGVkICE9PSB0aGlzLl9zaG93UGFnaW5hdGlvbkNvbnRyb2xzKSB7XG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zaG93UGFnaW5hdGlvbkNvbnRyb2xzID0gaXNFbmFibGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEV2YWx1YXRlIHdoZXRoZXIgdGhlIGJlZm9yZSBhbmQgYWZ0ZXIgY29udHJvbHMgc2hvdWxkIGJlIGVuYWJsZWQgb3IgZGlzYWJsZWQuXG4gICAqIElmIHRoZSBoZWFkZXIgaXMgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgbGlzdCAoc2Nyb2xsIGRpc3RhbmNlIGlzIGVxdWFsIHRvIDApIHRoZW4gZGlzYWJsZSB0aGVcbiAgICogYmVmb3JlIGJ1dHRvbi4gSWYgdGhlIGhlYWRlciBpcyBhdCB0aGUgZW5kIG9mIHRoZSBsaXN0IChzY3JvbGwgZGlzdGFuY2UgaXMgZXF1YWwgdG8gdGhlXG4gICAqIG1heGltdW0gZGlzdGFuY2Ugd2UgY2FuIHNjcm9sbCksIHRoZW4gZGlzYWJsZSB0aGUgYWZ0ZXIgYnV0dG9uLlxuICAgKlxuICAgKiBUaGlzIGlzIGFuIGV4cGVuc2l2ZSBjYWxsIHRoYXQgZm9yY2VzIGEgbGF5b3V0IHJlZmxvdyB0byBjb21wdXRlIGJveCBhbmQgc2Nyb2xsIG1ldHJpY3MgYW5kXG4gICAqIHNob3VsZCBiZSBjYWxsZWQgc3BhcmluZ2x5LlxuICAgKi9cbiAgX2NoZWNrU2Nyb2xsaW5nQ29udHJvbHMoKSB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIHBhZ2luYXRpb24gYXJyb3dzIHNob3VsZCBiZSBhY3RpdmF0ZWQuXG4gICAgdGhpcy5fZGlzYWJsZVNjcm9sbEJlZm9yZSA9IHRoaXMuc2Nyb2xsRGlzdGFuY2UgPT0gMDtcbiAgICB0aGlzLl9kaXNhYmxlU2Nyb2xsQWZ0ZXIgPSB0aGlzLnNjcm9sbERpc3RhbmNlID09IHRoaXMuX2dldE1heFNjcm9sbERpc3RhbmNlKCk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lcyB3aGF0IGlzIHRoZSBtYXhpbXVtIGxlbmd0aCBpbiBwaXhlbHMgdGhhdCBjYW4gYmUgc2V0IGZvciB0aGUgc2Nyb2xsIGRpc3RhbmNlLiBUaGlzXG4gICAqIGlzIGVxdWFsIHRvIHRoZSBkaWZmZXJlbmNlIGluIHdpZHRoIGJldHdlZW4gdGhlIHRhYiBsaXN0IGNvbnRhaW5lciBhbmQgdGFiIGhlYWRlciBjb250YWluZXIuXG4gICAqXG4gICAqIFRoaXMgaXMgYW4gZXhwZW5zaXZlIGNhbGwgdGhhdCBmb3JjZXMgYSBsYXlvdXQgcmVmbG93IHRvIGNvbXB1dGUgYm94IGFuZCBzY3JvbGwgbWV0cmljcyBhbmRcbiAgICogc2hvdWxkIGJlIGNhbGxlZCBzcGFyaW5nbHkuXG4gICAqL1xuICBfZ2V0TWF4U2Nyb2xsRGlzdGFuY2UoKTogbnVtYmVyIHtcbiAgICBjb25zdCBsZW5ndGhPZlRhYkxpc3QgPSB0aGlzLl90YWJMaXN0Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsV2lkdGg7XG4gICAgY29uc3Qgdmlld0xlbmd0aCA9IHRoaXMuX3RhYkxpc3RDb250YWluZXIubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICByZXR1cm4gKGxlbmd0aE9mVGFiTGlzdCAtIHZpZXdMZW5ndGgpIHx8IDA7XG4gIH1cblxuICAvKiogVGVsbHMgdGhlIGluay1iYXIgdG8gYWxpZ24gaXRzZWxmIHRvIHRoZSBjdXJyZW50IGxhYmVsIHdyYXBwZXIgKi9cbiAgX2FsaWduSW5rQmFyVG9TZWxlY3RlZFRhYigpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSB0aGlzLl9pdGVtcyAmJiB0aGlzLl9pdGVtcy5sZW5ndGggP1xuICAgICAgICB0aGlzLl9pdGVtcy50b0FycmF5KClbdGhpcy5zZWxlY3RlZEluZGV4XSA6IG51bGw7XG4gICAgY29uc3Qgc2VsZWN0ZWRMYWJlbFdyYXBwZXIgPSBzZWxlY3RlZEl0ZW0gPyBzZWxlY3RlZEl0ZW0uZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50IDogbnVsbDtcblxuICAgIGlmIChzZWxlY3RlZExhYmVsV3JhcHBlcikge1xuICAgICAgdGhpcy5faW5rQmFyLmFsaWduVG9FbGVtZW50KHNlbGVjdGVkTGFiZWxXcmFwcGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5faW5rQmFyLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogU3RvcHMgdGhlIGN1cnJlbnRseS1ydW5uaW5nIHBhZ2luYXRvciBpbnRlcnZhbC4gICovXG4gIF9zdG9wSW50ZXJ2YWwoKSB7XG4gICAgdGhpcy5fc3RvcFNjcm9sbGluZy5uZXh0KCk7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgdXNlciBwcmVzc2luZyBkb3duIG9uIG9uZSBvZiB0aGUgcGFnaW5hdG9ycy5cbiAgICogU3RhcnRzIHNjcm9sbGluZyB0aGUgaGVhZGVyIGFmdGVyIGEgY2VydGFpbiBhbW91bnQgb2YgdGltZS5cbiAgICogQHBhcmFtIGRpcmVjdGlvbiBJbiB3aGljaCBkaXJlY3Rpb24gdGhlIHBhZ2luYXRvciBzaG91bGQgYmUgc2Nyb2xsZWQuXG4gICAqL1xuICBfaGFuZGxlUGFnaW5hdG9yUHJlc3MoZGlyZWN0aW9uOiBTY3JvbGxEaXJlY3Rpb24pIHtcbiAgICAvLyBBdm9pZCBvdmVybGFwcGluZyB0aW1lcnMuXG4gICAgdGhpcy5fc3RvcEludGVydmFsKCk7XG5cbiAgICAvLyBTdGFydCBhIHRpbWVyIGFmdGVyIHRoZSBkZWxheSBhbmQga2VlcCBmaXJpbmcgYmFzZWQgb24gdGhlIGludGVydmFsLlxuICAgIHRpbWVyKEhFQURFUl9TQ1JPTExfREVMQVksIEhFQURFUl9TQ1JPTExfSU5URVJWQUwpXG4gICAgICAvLyBLZWVwIHRoZSB0aW1lciBnb2luZyB1bnRpbCBzb21ldGhpbmcgdGVsbHMgaXQgdG8gc3RvcCBvciB0aGUgY29tcG9uZW50IGlzIGRlc3Ryb3llZC5cbiAgICAgIC5waXBlKHRha2VVbnRpbChtZXJnZSh0aGlzLl9zdG9wU2Nyb2xsaW5nLCB0aGlzLl9kZXN0cm95ZWQpKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBjb25zdCB7bWF4U2Nyb2xsRGlzdGFuY2UsIGRpc3RhbmNlfSA9IHRoaXMuX3Njcm9sbEhlYWRlcihkaXJlY3Rpb24pO1xuXG4gICAgICAgIC8vIFN0b3AgdGhlIHRpbWVyIGlmIHdlJ3ZlIHJlYWNoZWQgdGhlIHN0YXJ0IG9yIHRoZSBlbmQuXG4gICAgICAgIGlmIChkaXN0YW5jZSA9PT0gMCB8fCBkaXN0YW5jZSA+PSBtYXhTY3JvbGxEaXN0YW5jZSkge1xuICAgICAgICAgIHRoaXMuX3N0b3BJbnRlcnZhbCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY3JvbGxzIHRoZSBoZWFkZXIgdG8gYSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHBvc2l0aW9uIFBvc2l0aW9uIHRvIHdoaWNoIHRvIHNjcm9sbC5cbiAgICogQHJldHVybnMgSW5mb3JtYXRpb24gb24gdGhlIGN1cnJlbnQgc2Nyb2xsIGRpc3RhbmNlIGFuZCB0aGUgbWF4aW11bS5cbiAgICovXG4gIHByaXZhdGUgX3Njcm9sbFRvKHBvc2l0aW9uOiBudW1iZXIpIHtcbiAgICBjb25zdCBtYXhTY3JvbGxEaXN0YW5jZSA9IHRoaXMuX2dldE1heFNjcm9sbERpc3RhbmNlKCk7XG4gICAgdGhpcy5fc2Nyb2xsRGlzdGFuY2UgPSBNYXRoLm1heCgwLCBNYXRoLm1pbihtYXhTY3JvbGxEaXN0YW5jZSwgcG9zaXRpb24pKTtcblxuICAgIC8vIE1hcmsgdGhhdCB0aGUgc2Nyb2xsIGRpc3RhbmNlIGhhcyBjaGFuZ2VkIHNvIHRoYXQgYWZ0ZXIgdGhlIHZpZXcgaXMgY2hlY2tlZCwgdGhlIENTU1xuICAgIC8vIHRyYW5zZm9ybWF0aW9uIGNhbiBtb3ZlIHRoZSBoZWFkZXIuXG4gICAgdGhpcy5fc2Nyb2xsRGlzdGFuY2VDaGFuZ2VkID0gdHJ1ZTtcbiAgICB0aGlzLl9jaGVja1Njcm9sbGluZ0NvbnRyb2xzKCk7XG5cbiAgICByZXR1cm4ge21heFNjcm9sbERpc3RhbmNlLCBkaXN0YW5jZTogdGhpcy5fc2Nyb2xsRGlzdGFuY2V9O1xuICB9XG59XG4iXX0=
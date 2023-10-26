import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, Directive, QueryList, ViewEncapsulation, } from '@angular/core';
import { _countGroupLabelsBeforeLegacyOption, _getLegacyOptionScrollPosition, MAT_LEGACY_OPTGROUP, MAT_LEGACY_OPTION_PARENT_COMPONENT, MatLegacyOption, } from '@angular/material/legacy-core';
import { MAT_SELECT_TRIGGER, _MatSelectBase } from '@angular/material/select';
import { MatLegacyFormFieldControl } from '@angular/material/legacy-form-field';
import { take, takeUntil } from 'rxjs/operators';
import { matLegacySelectAnimations } from './select-animations';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/cdk/overlay";
/**
 * The following style constants are necessary to save here in order
 * to properly calculate the alignment of the selected option over
 * the trigger element.
 */
/**
 * The max height of the select's overlay panel.
 * @deprecated Use `SELECT_PANEL_MAX_HEIGHT` from `@angular/material/select` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export const SELECT_PANEL_MAX_HEIGHT = 256;
/**
 * The panel's padding on the x-axis.
 * @deprecated Use `SELECT_PANEL_PADDING_X` from `@angular/material/select` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export const SELECT_PANEL_PADDING_X = 16;
/**
 * The panel's x axis padding if it is indented (e.g. there is an option group).
 * @deprecated Use `SELECT_PANEL_INDENT_PADDING_X` from `@angular/material/select` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export const SELECT_PANEL_INDENT_PADDING_X = SELECT_PANEL_PADDING_X * 2;
/**
 * The height of the select items in `em` units.
 * @deprecated Use `SELECT_ITEM_HEIGHT_EM` from `@angular/material/select` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export const SELECT_ITEM_HEIGHT_EM = 3;
// TODO(josephperrott): Revert to a constant after 2018 spec updates are fully merged.
/**
 * Distance between the panel edge and the option text in
 * multi-selection mode.
 *
 * Calculated as:
 * (SELECT_PANEL_PADDING_X * 1.5) + 16 = 40
 * The padding is multiplied by 1.5 because the checkbox's margin is half the padding.
 * The checkbox width is 16px.
 *
 * @deprecated Use `SELECT_MULTIPLE_PANEL_PADDING_X` from `@angular/material/select` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export const SELECT_MULTIPLE_PANEL_PADDING_X = SELECT_PANEL_PADDING_X * 1.5 + 16;
/**
 * The select panel will only "fit" inside the viewport if it is positioned at
 * this value or more away from the viewport boundary.
 * @deprecated Use `SELECT_PANEL_VIEWPORT_PADDING` from `@angular/material/select` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export const SELECT_PANEL_VIEWPORT_PADDING = 8;
/**
 * Change event object that is emitted when the select value has changed.
 * @deprecated Use `MatSelectChange` from `@angular/material/select` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacySelectChange {
    constructor(
    /** Reference to the select that emitted the change event. */
    source, 
    /** Current value of the select that emitted the event. */
    value) {
        this.source = source;
        this.value = value;
    }
}
/**
 * Allows the user to customize the trigger that is displayed when the select has a value.
 * @deprecated Use `MatSelectTrigger` from `@angular/material/select` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacySelectTrigger {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatLegacySelectTrigger, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "16.1.1", type: MatLegacySelectTrigger, selector: "mat-select-trigger", providers: [{ provide: MAT_SELECT_TRIGGER, useExisting: MatLegacySelectTrigger }], ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatLegacySelectTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: 'mat-select-trigger',
                    providers: [{ provide: MAT_SELECT_TRIGGER, useExisting: MatLegacySelectTrigger }],
                }]
        }] });
/**
 * @deprecated Use `MatSelect` from `@angular/material/select` instead. See https://material.angular.io/guide/mdc-migration for information about migrating.
 * @breaking-change 17.0.0
 */
export class MatLegacySelect extends _MatSelectBase {
    constructor() {
        super(...arguments);
        /** The scroll position of the overlay panel, calculated to center the selected option. */
        this._scrollTop = 0;
        /** The cached font-size of the trigger element. */
        this._triggerFontSize = 0;
        /** The value of the select panel's transform-origin property. */
        this._transformOrigin = 'top';
        /**
         * The y-offset of the overlay panel in relation to the trigger's top start corner.
         * This must be adjusted to align the selected option text over the trigger text.
         * when the panel opens. Will change based on the y-position of the selected option.
         */
        this._offsetY = 0;
        this._positions = [
            {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'top',
            },
            {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'bottom',
            },
        ];
    }
    /**
     * Calculates the scroll position of the select's overlay panel.
     *
     * Attempts to center the selected option in the panel. If the option is
     * too high or too low in the panel to be scrolled to the center, it clamps the
     * scroll position to the min or max scroll positions respectively.
     */
    _calculateOverlayScroll(selectedIndex, scrollBuffer, maxScroll) {
        const itemHeight = this._getItemHeight();
        const optionOffsetFromScrollTop = itemHeight * selectedIndex;
        const halfOptionHeight = itemHeight / 2;
        // Starts at the optionOffsetFromScrollTop, which scrolls the option to the top of the
        // scroll container, then subtracts the scroll buffer to scroll the option down to
        // the center of the overlay panel. Half the option height must be re-added to the
        // scrollTop so the option is centered based on its middle, not its top edge.
        const optimalScrollPosition = optionOffsetFromScrollTop - scrollBuffer + halfOptionHeight;
        return Math.min(Math.max(0, optimalScrollPosition), maxScroll);
    }
    ngOnInit() {
        super.ngOnInit();
        this._viewportRuler
            .change()
            .pipe(takeUntil(this._destroy))
            .subscribe(() => {
            if (this.panelOpen) {
                this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();
                this._changeDetectorRef.markForCheck();
            }
        });
    }
    open() {
        if (super._canOpen()) {
            super.open();
            this._triggerRect = this.trigger.nativeElement.getBoundingClientRect();
            // Note: The computed font-size will be a string pixel value (e.g. "16px").
            // `parseInt` ignores the trailing 'px' and converts this to a number.
            this._triggerFontSize = parseInt(getComputedStyle(this.trigger.nativeElement).fontSize || '0');
            this._calculateOverlayPosition();
            // Set the font size on the panel element once it exists.
            this._ngZone.onStable.pipe(take(1)).subscribe(() => {
                if (this._triggerFontSize &&
                    this._overlayDir.overlayRef &&
                    this._overlayDir.overlayRef.overlayElement) {
                    this._overlayDir.overlayRef.overlayElement.style.fontSize = `${this._triggerFontSize}px`;
                }
            });
        }
    }
    /** Scrolls the active option into view. */
    _scrollOptionIntoView(index) {
        const labelCount = _countGroupLabelsBeforeLegacyOption(index, this.options, this.optionGroups);
        const itemHeight = this._getItemHeight();
        if (index === 0 && labelCount === 1) {
            // If we've got one group label before the option and we're at the top option,
            // scroll the list to the top. This is better UX than scrolling the list to the
            // top of the option, because it allows the user to read the top group's label.
            this.panel.nativeElement.scrollTop = 0;
        }
        else {
            this.panel.nativeElement.scrollTop = _getLegacyOptionScrollPosition((index + labelCount) * itemHeight, itemHeight, this.panel.nativeElement.scrollTop, SELECT_PANEL_MAX_HEIGHT);
        }
    }
    _positioningSettled() {
        this._calculateOverlayOffsetX();
        this.panel.nativeElement.scrollTop = this._scrollTop;
    }
    _panelDoneAnimating(isOpen) {
        if (this.panelOpen) {
            this._scrollTop = 0;
        }
        else {
            this._overlayDir.offsetX = 0;
            this._changeDetectorRef.markForCheck();
        }
        super._panelDoneAnimating(isOpen);
    }
    _getChangeEvent(value) {
        return new MatLegacySelectChange(this, value);
    }
    _getOverlayMinWidth() {
        return this._triggerRect?.width;
    }
    /**
     * Sets the x-offset of the overlay panel in relation to the trigger's top start corner.
     * This must be adjusted to align the selected option text over the trigger text when
     * the panel opens. Will change based on LTR or RTL text direction. Note that the offset
     * can't be calculated until the panel has been attached, because we need to know the
     * content width in order to constrain the panel within the viewport.
     */
    _calculateOverlayOffsetX() {
        const overlayRect = this._overlayDir.overlayRef.overlayElement.getBoundingClientRect();
        const viewportSize = this._viewportRuler.getViewportSize();
        const isRtl = this._isRtl();
        const paddingWidth = this.multiple
            ? SELECT_MULTIPLE_PANEL_PADDING_X + SELECT_PANEL_PADDING_X
            : SELECT_PANEL_PADDING_X * 2;
        let offsetX;
        // Adjust the offset, depending on the option padding.
        if (this.multiple) {
            offsetX = SELECT_MULTIPLE_PANEL_PADDING_X;
        }
        else if (this.disableOptionCentering) {
            offsetX = SELECT_PANEL_PADDING_X;
        }
        else {
            let selected = this._selectionModel.selected[0] || this.options.first;
            offsetX = selected && selected.group ? SELECT_PANEL_INDENT_PADDING_X : SELECT_PANEL_PADDING_X;
        }
        // Invert the offset in LTR.
        if (!isRtl) {
            offsetX *= -1;
        }
        // Determine how much the select overflows on each side.
        const leftOverflow = 0 - (overlayRect.left + offsetX - (isRtl ? paddingWidth : 0));
        const rightOverflow = overlayRect.right + offsetX - viewportSize.width + (isRtl ? 0 : paddingWidth);
        // If the element overflows on either side, reduce the offset to allow it to fit.
        if (leftOverflow > 0) {
            offsetX += leftOverflow + SELECT_PANEL_VIEWPORT_PADDING;
        }
        else if (rightOverflow > 0) {
            offsetX -= rightOverflow + SELECT_PANEL_VIEWPORT_PADDING;
        }
        // Set the offset directly in order to avoid having to go through change detection and
        // potentially triggering "changed after it was checked" errors. Round the value to avoid
        // blurry content in some browsers.
        this._overlayDir.offsetX = Math.round(offsetX);
        this._overlayDir.overlayRef.updatePosition();
    }
    /**
     * Calculates the y-offset of the select's overlay panel in relation to the
     * top start corner of the trigger. It has to be adjusted in order for the
     * selected option to be aligned over the trigger when the panel opens.
     */
    _calculateOverlayOffsetY(selectedIndex, scrollBuffer, maxScroll) {
        const itemHeight = this._getItemHeight();
        const optionHeightAdjustment = (itemHeight - this._triggerRect.height) / 2;
        const maxOptionsDisplayed = Math.floor(SELECT_PANEL_MAX_HEIGHT / itemHeight);
        let optionOffsetFromPanelTop;
        // Disable offset if requested by user by returning 0 as value to offset
        if (this.disableOptionCentering) {
            return 0;
        }
        if (this._scrollTop === 0) {
            optionOffsetFromPanelTop = selectedIndex * itemHeight;
        }
        else if (this._scrollTop === maxScroll) {
            const firstDisplayedIndex = this._getItemCount() - maxOptionsDisplayed;
            const selectedDisplayIndex = selectedIndex - firstDisplayedIndex;
            // The first item is partially out of the viewport. Therefore we need to calculate what
            // portion of it is shown in the viewport and account for it in our offset.
            let partialItemHeight = itemHeight - ((this._getItemCount() * itemHeight - SELECT_PANEL_MAX_HEIGHT) % itemHeight);
            // Because the panel height is longer than the height of the options alone,
            // there is always extra padding at the top or bottom of the panel. When
            // scrolled to the very bottom, this padding is at the top of the panel and
            // must be added to the offset.
            optionOffsetFromPanelTop = selectedDisplayIndex * itemHeight + partialItemHeight;
        }
        else {
            // If the option was scrolled to the middle of the panel using a scroll buffer,
            // its offset will be the scroll buffer minus the half height that was added to
            // center it.
            optionOffsetFromPanelTop = scrollBuffer - itemHeight / 2;
        }
        // The final offset is the option's offset from the top, adjusted for the height difference,
        // multiplied by -1 to ensure that the overlay moves in the correct direction up the page.
        // The value is rounded to prevent some browsers from blurring the content.
        return Math.round(optionOffsetFromPanelTop * -1 - optionHeightAdjustment);
    }
    /**
     * Checks that the attempted overlay position will fit within the viewport.
     * If it will not fit, tries to adjust the scroll position and the associated
     * y-offset so the panel can open fully on-screen. If it still won't fit,
     * sets the offset back to 0 to allow the fallback position to take over.
     */
    _checkOverlayWithinViewport(maxScroll) {
        const itemHeight = this._getItemHeight();
        const viewportSize = this._viewportRuler.getViewportSize();
        const topSpaceAvailable = this._triggerRect.top - SELECT_PANEL_VIEWPORT_PADDING;
        const bottomSpaceAvailable = viewportSize.height - this._triggerRect.bottom - SELECT_PANEL_VIEWPORT_PADDING;
        const panelHeightTop = Math.abs(this._offsetY);
        const totalPanelHeight = Math.min(this._getItemCount() * itemHeight, SELECT_PANEL_MAX_HEIGHT);
        const panelHeightBottom = totalPanelHeight - panelHeightTop - this._triggerRect.height;
        if (panelHeightBottom > bottomSpaceAvailable) {
            this._adjustPanelUp(panelHeightBottom, bottomSpaceAvailable);
        }
        else if (panelHeightTop > topSpaceAvailable) {
            this._adjustPanelDown(panelHeightTop, topSpaceAvailable, maxScroll);
        }
        else {
            this._transformOrigin = this._getOriginBasedOnOption();
        }
    }
    /** Adjusts the overlay panel up to fit in the viewport. */
    _adjustPanelUp(panelHeightBottom, bottomSpaceAvailable) {
        // Browsers ignore fractional scroll offsets, so we need to round.
        const distanceBelowViewport = Math.round(panelHeightBottom - bottomSpaceAvailable);
        // Scrolls the panel up by the distance it was extending past the boundary, then
        // adjusts the offset by that amount to move the panel up into the viewport.
        this._scrollTop -= distanceBelowViewport;
        this._offsetY -= distanceBelowViewport;
        this._transformOrigin = this._getOriginBasedOnOption();
        // If the panel is scrolled to the very top, it won't be able to fit the panel
        // by scrolling, so set the offset to 0 to allow the fallback position to take
        // effect.
        if (this._scrollTop <= 0) {
            this._scrollTop = 0;
            this._offsetY = 0;
            this._transformOrigin = `50% bottom 0px`;
        }
    }
    /** Adjusts the overlay panel down to fit in the viewport. */
    _adjustPanelDown(panelHeightTop, topSpaceAvailable, maxScroll) {
        // Browsers ignore fractional scroll offsets, so we need to round.
        const distanceAboveViewport = Math.round(panelHeightTop - topSpaceAvailable);
        // Scrolls the panel down by the distance it was extending past the boundary, then
        // adjusts the offset by that amount to move the panel down into the viewport.
        this._scrollTop += distanceAboveViewport;
        this._offsetY += distanceAboveViewport;
        this._transformOrigin = this._getOriginBasedOnOption();
        // If the panel is scrolled to the very bottom, it won't be able to fit the
        // panel by scrolling, so set the offset to 0 to allow the fallback position
        // to take effect.
        if (this._scrollTop >= maxScroll) {
            this._scrollTop = maxScroll;
            this._offsetY = 0;
            this._transformOrigin = `50% top 0px`;
            return;
        }
    }
    /** Calculates the scroll position and x- and y-offsets of the overlay panel. */
    _calculateOverlayPosition() {
        const itemHeight = this._getItemHeight();
        const items = this._getItemCount();
        const panelHeight = Math.min(items * itemHeight, SELECT_PANEL_MAX_HEIGHT);
        const scrollContainerHeight = items * itemHeight;
        // The farthest the panel can be scrolled before it hits the bottom
        const maxScroll = scrollContainerHeight - panelHeight;
        // If no value is selected we open the popup to the first item.
        let selectedOptionOffset;
        if (this.empty) {
            selectedOptionOffset = 0;
        }
        else {
            selectedOptionOffset = Math.max(this.options.toArray().indexOf(this._selectionModel.selected[0]), 0);
        }
        selectedOptionOffset += _countGroupLabelsBeforeLegacyOption(selectedOptionOffset, this.options, this.optionGroups);
        // We must maintain a scroll buffer so the selected option will be scrolled to the
        // center of the overlay panel rather than the top.
        const scrollBuffer = panelHeight / 2;
        this._scrollTop = this._calculateOverlayScroll(selectedOptionOffset, scrollBuffer, maxScroll);
        this._offsetY = this._calculateOverlayOffsetY(selectedOptionOffset, scrollBuffer, maxScroll);
        this._checkOverlayWithinViewport(maxScroll);
    }
    /** Sets the transform origin point based on the selected option. */
    _getOriginBasedOnOption() {
        const itemHeight = this._getItemHeight();
        const optionHeightAdjustment = (itemHeight - this._triggerRect.height) / 2;
        const originY = Math.abs(this._offsetY) - optionHeightAdjustment + itemHeight / 2;
        return `50% ${originY}px 0px`;
    }
    /** Calculates the height of the select's options. */
    _getItemHeight() {
        return this._triggerFontSize * SELECT_ITEM_HEIGHT_EM;
    }
    /** Calculates the amount of items in the select. This includes options and group labels. */
    _getItemCount() {
        return this.options.length + this.optionGroups.length;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatLegacySelect, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.1.1", type: MatLegacySelect, selector: "mat-select", inputs: { disabled: "disabled", disableRipple: "disableRipple", tabIndex: "tabIndex" }, host: { attributes: { "role": "combobox", "aria-autocomplete": "none", "aria-haspopup": "true", "ngSkipHydration": "" }, listeners: { "keydown": "_handleKeydown($event)", "focus": "_onFocus()", "blur": "_onBlur()" }, properties: { "attr.id": "id", "attr.tabindex": "tabIndex", "attr.aria-controls": "panelOpen ? id + \"-panel\" : null", "attr.aria-expanded": "panelOpen", "attr.aria-label": "ariaLabel || null", "attr.aria-required": "required.toString()", "attr.aria-disabled": "disabled.toString()", "attr.aria-invalid": "errorState", "attr.aria-activedescendant": "_getAriaActiveDescendant()", "class.mat-select-disabled": "disabled", "class.mat-select-invalid": "errorState", "class.mat-select-required": "required", "class.mat-select-empty": "empty", "class.mat-select-multiple": "multiple" }, classAttribute: "mat-select" }, providers: [
            { provide: MatLegacyFormFieldControl, useExisting: MatLegacySelect },
            { provide: MAT_LEGACY_OPTION_PARENT_COMPONENT, useExisting: MatLegacySelect },
        ], queries: [{ propertyName: "customTrigger", first: true, predicate: MAT_SELECT_TRIGGER, descendants: true }, { propertyName: "options", predicate: MatLegacyOption, descendants: true }, { propertyName: "optionGroups", predicate: MAT_LEGACY_OPTGROUP, descendants: true }], exportAs: ["matSelect"], usesInheritance: true, ngImport: i0, template: "<!--\n Note that the select trigger element specifies `aria-owns` pointing to the listbox overlay.\n While aria-owns is not required for the ARIA 1.2 `role=\"combobox\"` interaction pattern,\n it fixes an issue with VoiceOver when the select appears inside of an `aria-model=\"true\"`\n element (e.g. a dialog). Without this `aria-owns`, the `aria-modal` on a dialog prevents\n VoiceOver from \"seeing\" the select's listbox overlay for aria-activedescendant.\n Using `aria-owns` re-parents the select overlay so that it works again.\n See https://github.com/angular/components/issues/20694\n-->\n<div cdk-overlay-origin\n     [attr.aria-owns]=\"panelOpen ? id + '-panel' : null\"\n     class=\"mat-select-trigger\"\n     (click)=\"toggle()\"\n     #origin=\"cdkOverlayOrigin\"\n     #trigger>\n  <div class=\"mat-select-value\" [ngSwitch]=\"empty\" [attr.id]=\"_valueId\">\n    <span class=\"mat-select-placeholder mat-select-min-line\" *ngSwitchCase=\"true\">{{placeholder}}</span>\n    <span class=\"mat-select-value-text\" *ngSwitchCase=\"false\" [ngSwitch]=\"!!customTrigger\">\n      <span class=\"mat-select-min-line\" *ngSwitchDefault>{{triggerValue}}</span>\n      <ng-content select=\"mat-select-trigger\" *ngSwitchCase=\"true\"></ng-content>\n    </span>\n  </div>\n\n  <div class=\"mat-select-arrow-wrapper\"><div class=\"mat-select-arrow\"></div></div>\n</div>\n\n<ng-template\n  cdk-connected-overlay\n  cdkConnectedOverlayLockPosition\n  cdkConnectedOverlayHasBackdrop\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  [cdkConnectedOverlayPanelClass]=\"_overlayPanelClass\"\n  [cdkConnectedOverlayScrollStrategy]=\"_scrollStrategy\"\n  [cdkConnectedOverlayOrigin]=\"origin\"\n  [cdkConnectedOverlayOpen]=\"panelOpen\"\n  [cdkConnectedOverlayPositions]=\"_positions\"\n  [cdkConnectedOverlayMinWidth]=\"_getOverlayMinWidth()\"\n  [cdkConnectedOverlayOffsetY]=\"_offsetY\"\n  (backdropClick)=\"close()\"\n  (attach)=\"_onAttached()\"\n  (detach)=\"close()\">\n  <div class=\"mat-select-panel-wrap\" [@transformPanelWrap]>\n    <div\n      #panel\n      role=\"listbox\"\n      tabindex=\"-1\"\n      class=\"mat-select-panel {{ _getPanelTheme() }}\"\n      [attr.id]=\"id + '-panel'\"\n      [attr.aria-multiselectable]=\"multiple\"\n      [attr.aria-label]=\"ariaLabel || null\"\n      [attr.aria-labelledby]=\"_getPanelAriaLabelledby()\"\n      [ngClass]=\"panelClass\"\n      [@transformPanel]=\"multiple ? 'showing-multiple' : 'showing'\"\n      (@transformPanel.done)=\"_panelDoneAnimatingStream.next($event.toState)\"\n      [style.transformOrigin]=\"_transformOrigin\"\n      [style.font-size.px]=\"_triggerFontSize\"\n      (keydown)=\"_handleKeydown($event)\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: [".mat-select{display:inline-block;width:100%;outline:none}.mat-select-trigger{display:inline-flex;align-items:center;cursor:pointer;position:relative;box-sizing:border-box;width:100%}.mat-select-disabled .mat-select-trigger{-webkit-user-select:none;user-select:none;cursor:default}.mat-select-value{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mat-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-select-arrow-wrapper{height:16px;flex-shrink:0;display:inline-flex;align-items:center}.mat-form-field-appearance-fill .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-outline .mat-select-arrow-wrapper{transform:translateY(-25%)}.mat-form-field-appearance-standard.mat-form-field-has-label .mat-select:not(.mat-select-empty) .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:none}.mat-select-arrow{width:0;height:0;border-left:5px solid rgba(0,0,0,0);border-right:5px solid rgba(0,0,0,0);border-top:5px solid;margin:0 4px}.mat-form-field.mat-focused .mat-select-arrow{transform:translateX(0)}.mat-select-panel-wrap{flex-basis:100%}.mat-select-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;padding-top:0;padding-bottom:0;max-height:256px;min-width:100%;border-radius:4px;outline:0}.cdk-high-contrast-active .mat-select-panel{outline:solid 1px}.mat-select-panel .mat-optgroup-label,.mat-select-panel .mat-option{font-size:inherit;line-height:3em;height:3em}.mat-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-form-field-flex{cursor:pointer}.mat-form-field-type-mat-select .mat-form-field-label{width:calc(100% - 18px)}.mat-select-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable .mat-select-placeholder{transition:none}.mat-form-field-hide-placeholder .mat-select-placeholder{color:rgba(0,0,0,0);-webkit-text-fill-color:rgba(0,0,0,0);transition:none;display:block}.mat-select-min-line:empty::before{content:\" \";white-space:pre;width:1px;display:inline-block;visibility:hidden}"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: i1.NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: i1.NgSwitchDefault, selector: "[ngSwitchDefault]" }, { kind: "directive", type: i2.CdkConnectedOverlay, selector: "[cdk-connected-overlay], [connected-overlay], [cdkConnectedOverlay]", inputs: ["cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayPositionStrategy", "cdkConnectedOverlayOffsetX", "cdkConnectedOverlayOffsetY", "cdkConnectedOverlayWidth", "cdkConnectedOverlayHeight", "cdkConnectedOverlayMinWidth", "cdkConnectedOverlayMinHeight", "cdkConnectedOverlayBackdropClass", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayViewportMargin", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOpen", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayTransformOriginOn", "cdkConnectedOverlayHasBackdrop", "cdkConnectedOverlayLockPosition", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayGrowAfterOpen", "cdkConnectedOverlayPush"], outputs: ["backdropClick", "positionChange", "attach", "detach", "overlayKeydown", "overlayOutsideClick"], exportAs: ["cdkConnectedOverlay"] }, { kind: "directive", type: i2.CdkOverlayOrigin, selector: "[cdk-overlay-origin], [overlay-origin], [cdkOverlayOrigin]", exportAs: ["cdkOverlayOrigin"] }], animations: [
            matLegacySelectAnimations.transformPanelWrap,
            matLegacySelectAnimations.transformPanel,
        ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.1.1", ngImport: i0, type: MatLegacySelect, decorators: [{
            type: Component,
            args: [{ selector: 'mat-select', exportAs: 'matSelect', inputs: ['disabled', 'disableRipple', 'tabIndex'], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, host: {
                        'role': 'combobox',
                        'aria-autocomplete': 'none',
                        // TODO(crisbeto): the value for aria-haspopup should be `listbox`, but currently it's difficult
                        // to sync into Google, because of an outdated automated a11y check which flags it as an invalid
                        // value. At some point we should try to switch it back to being `listbox`.
                        'aria-haspopup': 'true',
                        'class': 'mat-select',
                        '[attr.id]': 'id',
                        '[attr.tabindex]': 'tabIndex',
                        '[attr.aria-controls]': 'panelOpen ? id + "-panel" : null',
                        '[attr.aria-expanded]': 'panelOpen',
                        '[attr.aria-label]': 'ariaLabel || null',
                        '[attr.aria-required]': 'required.toString()',
                        '[attr.aria-disabled]': 'disabled.toString()',
                        '[attr.aria-invalid]': 'errorState',
                        '[attr.aria-activedescendant]': '_getAriaActiveDescendant()',
                        '[class.mat-select-disabled]': 'disabled',
                        '[class.mat-select-invalid]': 'errorState',
                        '[class.mat-select-required]': 'required',
                        '[class.mat-select-empty]': 'empty',
                        '[class.mat-select-multiple]': 'multiple',
                        '(keydown)': '_handleKeydown($event)',
                        '(focus)': '_onFocus()',
                        '(blur)': '_onBlur()',
                        'ngSkipHydration': '',
                    }, animations: [
                        matLegacySelectAnimations.transformPanelWrap,
                        matLegacySelectAnimations.transformPanel,
                    ], providers: [
                        { provide: MatLegacyFormFieldControl, useExisting: MatLegacySelect },
                        { provide: MAT_LEGACY_OPTION_PARENT_COMPONENT, useExisting: MatLegacySelect },
                    ], template: "<!--\n Note that the select trigger element specifies `aria-owns` pointing to the listbox overlay.\n While aria-owns is not required for the ARIA 1.2 `role=\"combobox\"` interaction pattern,\n it fixes an issue with VoiceOver when the select appears inside of an `aria-model=\"true\"`\n element (e.g. a dialog). Without this `aria-owns`, the `aria-modal` on a dialog prevents\n VoiceOver from \"seeing\" the select's listbox overlay for aria-activedescendant.\n Using `aria-owns` re-parents the select overlay so that it works again.\n See https://github.com/angular/components/issues/20694\n-->\n<div cdk-overlay-origin\n     [attr.aria-owns]=\"panelOpen ? id + '-panel' : null\"\n     class=\"mat-select-trigger\"\n     (click)=\"toggle()\"\n     #origin=\"cdkOverlayOrigin\"\n     #trigger>\n  <div class=\"mat-select-value\" [ngSwitch]=\"empty\" [attr.id]=\"_valueId\">\n    <span class=\"mat-select-placeholder mat-select-min-line\" *ngSwitchCase=\"true\">{{placeholder}}</span>\n    <span class=\"mat-select-value-text\" *ngSwitchCase=\"false\" [ngSwitch]=\"!!customTrigger\">\n      <span class=\"mat-select-min-line\" *ngSwitchDefault>{{triggerValue}}</span>\n      <ng-content select=\"mat-select-trigger\" *ngSwitchCase=\"true\"></ng-content>\n    </span>\n  </div>\n\n  <div class=\"mat-select-arrow-wrapper\"><div class=\"mat-select-arrow\"></div></div>\n</div>\n\n<ng-template\n  cdk-connected-overlay\n  cdkConnectedOverlayLockPosition\n  cdkConnectedOverlayHasBackdrop\n  cdkConnectedOverlayBackdropClass=\"cdk-overlay-transparent-backdrop\"\n  [cdkConnectedOverlayPanelClass]=\"_overlayPanelClass\"\n  [cdkConnectedOverlayScrollStrategy]=\"_scrollStrategy\"\n  [cdkConnectedOverlayOrigin]=\"origin\"\n  [cdkConnectedOverlayOpen]=\"panelOpen\"\n  [cdkConnectedOverlayPositions]=\"_positions\"\n  [cdkConnectedOverlayMinWidth]=\"_getOverlayMinWidth()\"\n  [cdkConnectedOverlayOffsetY]=\"_offsetY\"\n  (backdropClick)=\"close()\"\n  (attach)=\"_onAttached()\"\n  (detach)=\"close()\">\n  <div class=\"mat-select-panel-wrap\" [@transformPanelWrap]>\n    <div\n      #panel\n      role=\"listbox\"\n      tabindex=\"-1\"\n      class=\"mat-select-panel {{ _getPanelTheme() }}\"\n      [attr.id]=\"id + '-panel'\"\n      [attr.aria-multiselectable]=\"multiple\"\n      [attr.aria-label]=\"ariaLabel || null\"\n      [attr.aria-labelledby]=\"_getPanelAriaLabelledby()\"\n      [ngClass]=\"panelClass\"\n      [@transformPanel]=\"multiple ? 'showing-multiple' : 'showing'\"\n      (@transformPanel.done)=\"_panelDoneAnimatingStream.next($event.toState)\"\n      [style.transformOrigin]=\"_transformOrigin\"\n      [style.font-size.px]=\"_triggerFontSize\"\n      (keydown)=\"_handleKeydown($event)\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n</ng-template>\n", styles: [".mat-select{display:inline-block;width:100%;outline:none}.mat-select-trigger{display:inline-flex;align-items:center;cursor:pointer;position:relative;box-sizing:border-box;width:100%}.mat-select-disabled .mat-select-trigger{-webkit-user-select:none;user-select:none;cursor:default}.mat-select-value{width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mat-select-value-text{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mat-select-arrow-wrapper{height:16px;flex-shrink:0;display:inline-flex;align-items:center}.mat-form-field-appearance-fill .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-outline .mat-select-arrow-wrapper{transform:translateY(-25%)}.mat-form-field-appearance-standard.mat-form-field-has-label .mat-select:not(.mat-select-empty) .mat-select-arrow-wrapper{transform:translateY(-50%)}.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:transform 400ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable.mat-form-field-appearance-standard .mat-select.mat-select-empty .mat-select-arrow-wrapper{transition:none}.mat-select-arrow{width:0;height:0;border-left:5px solid rgba(0,0,0,0);border-right:5px solid rgba(0,0,0,0);border-top:5px solid;margin:0 4px}.mat-form-field.mat-focused .mat-select-arrow{transform:translateX(0)}.mat-select-panel-wrap{flex-basis:100%}.mat-select-panel{min-width:112px;max-width:280px;overflow:auto;-webkit-overflow-scrolling:touch;padding-top:0;padding-bottom:0;max-height:256px;min-width:100%;border-radius:4px;outline:0}.cdk-high-contrast-active .mat-select-panel{outline:solid 1px}.mat-select-panel .mat-optgroup-label,.mat-select-panel .mat-option{font-size:inherit;line-height:3em;height:3em}.mat-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-form-field-flex{cursor:pointer}.mat-form-field-type-mat-select .mat-form-field-label{width:calc(100% - 18px)}.mat-select-placeholder{transition:color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1)}._mat-animation-noopable .mat-select-placeholder{transition:none}.mat-form-field-hide-placeholder .mat-select-placeholder{color:rgba(0,0,0,0);-webkit-text-fill-color:rgba(0,0,0,0);transition:none;display:block}.mat-select-min-line:empty::before{content:\" \";white-space:pre;width:1px;display:inline-block;visibility:hidden}"] }]
        }], propDecorators: { options: [{
                type: ContentChildren,
                args: [MatLegacyOption, { descendants: true }]
            }], optionGroups: [{
                type: ContentChildren,
                args: [MAT_LEGACY_OPTGROUP, { descendants: true }]
            }], customTrigger: [{
                type: ContentChild,
                args: [MAT_SELECT_TRIGGER]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1zZWxlY3Qvc2VsZWN0LnRzIiwiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL2xlZ2FjeS1zZWxlY3Qvc2VsZWN0Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBU0EsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLGVBQWUsRUFDZixTQUFTLEVBRVQsU0FBUyxFQUNULGlCQUFpQixHQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsbUNBQW1DLEVBQ25DLDhCQUE4QixFQUM5QixtQkFBbUIsRUFDbkIsa0NBQWtDLEVBQ2xDLGVBQWUsR0FFaEIsTUFBTSwrQkFBK0IsQ0FBQztBQUN2QyxPQUFPLEVBQUMsa0JBQWtCLEVBQUUsY0FBYyxFQUFrQixNQUFNLDBCQUEwQixDQUFDO0FBQzdGLE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBQzlFLE9BQU8sRUFBQyxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDL0MsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0scUJBQXFCLENBQUM7Ozs7QUFFOUQ7Ozs7R0FJRztBQUVIOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSx1QkFBdUIsR0FBRyxHQUFHLENBQUM7QUFFM0M7Ozs7R0FJRztBQUNILE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFHLEVBQUUsQ0FBQztBQUV6Qzs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQUcsc0JBQXNCLEdBQUcsQ0FBQyxDQUFDO0FBRXhFOzs7O0dBSUc7QUFDSCxNQUFNLENBQUMsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLENBQUM7QUFFdkMsc0ZBQXNGO0FBQ3RGOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBTSxDQUFD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NkIsRUFBRSxVQUFVO3dCQUN6QyxXQUFXLEVBQUUsd0JBQXdCO3dCQUNyQyxTQUFTLEVBQUUsWUFBWTt3QkFDdkIsUUFBUSxFQUFFLFdBQVc7d0JBQ3JCLGlCQUFpQixFQUFFLEVBQUU7cUJBQ3RCLGNBQ1c7d0JBQ1YseUJBQXlCLENBQUMsa0JBQWtCO3dCQUM1Qyx5QkFBeUIsQ0FBQyxjQUFjO3FCQUN6QyxhQUNVO3dCQUNULEVBQUMsT0FBTyxFQUFFLHlCQUF5QixFQUFFLFdBQVcsaUJBQWlCLEVBQUM7d0JBQ2xFLEVBQUMsT0FBTyxFQUFFLGtDQUFrQyxFQUFFLFdBQVcsaUJBQWlCLEVBQUM7cUJBQzVFOzhCQXNCc0QsT0FBTztzQkFBN0QsZUFBZTt1QkFBQyxlQUFlLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUdyRCxZQUFZO3NCQURYLGVBQWU7dUJBQUMsbUJBQW1CLEVBQUUsRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDO2dCQUd2QixhQUFhO3NCQUE5QyxZQUFZO3VCQUFDLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0Nvbm5lY3RlZFBvc2l0aW9ufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBPbkluaXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgX2NvdW50R3JvdXBMYWJlbHNCZWZvcmVMZWdhY3lPcHRpb24sXG4gIF9nZXRMZWdhY3lPcHRpb25TY3JvbGxQb3NpdGlvbixcbiAgTUFUX0xFR0FDWV9PUFRHUk9VUCxcbiAgTUFUX0xFR0FDWV9PUFRJT05fUEFSRU5UX0NPTVBPTkVOVCxcbiAgTWF0TGVnYWN5T3B0aW9uLFxuICBNYXRMZWdhY3lPcHRncm91cCxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbGVnYWN5LWNvcmUnO1xuaW1wb3J0IHtNQVRfU0VMRUNUX1RSSUdHRVIsIF9NYXRTZWxlY3RCYXNlLCBNYXRTZWxlY3RDb25maWd9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NlbGVjdCc7XG5pbXBvcnQge01hdExlZ2FjeUZvcm1GaWVsZENvbnRyb2x9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2xlZ2FjeS1mb3JtLWZpZWxkJztcbmltcG9ydCB7dGFrZSwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge21hdExlZ2FjeVNlbGVjdEFuaW1hdGlvbnN9IGZyb20gJy4vc2VsZWN0LWFuaW1hdGlvbnMnO1xuXG4vKipcbiAqIFRoZSBmb2xsb3dpbmcgc3R5bGUgY29uc3RhbnRzIGFyZSBuZWNlc3NhcnkgdG8gc2F2ZSBoZXJlIGluIG9yZGVyXG4gKiB0byBwcm9wZXJseSBjYWxjdWxhdGUgdGhlIGFsaWdubWVudCBvZiB0aGUgc2VsZWN0ZWQgb3B0aW9uIG92ZXJcbiAqIHRoZSB0cmlnZ2VyIGVsZW1lbnQuXG4gKi9cblxuLyoqXG4gKiBUaGUgbWF4IGhlaWdodCBvZiB0aGUgc2VsZWN0J3Mgb3ZlcmxheSBwYW5lbC5cbiAqIEBkZXByZWNhdGVkIFVzZSBgU0VMRUNUX1BBTkVMX01BWF9IRUlHSFRgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3NlbGVjdGAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQgPSAyNTY7XG5cbi8qKlxuICogVGhlIHBhbmVsJ3MgcGFkZGluZyBvbiB0aGUgeC1heGlzLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBTRUxFQ1RfUEFORUxfUEFERElOR19YYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9zZWxlY3RgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuZXhwb3J0IGNvbnN0IFNFTEVDVF9QQU5FTF9QQURESU5HX1ggPSAxNjtcblxuLyoqXG4gKiBUaGUgcGFuZWwncyB4IGF4aXMgcGFkZGluZyBpZiBpdCBpcyBpbmRlbnRlZCAoZS5nLiB0aGVyZSBpcyBhbiBvcHRpb24gZ3JvdXApLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBTRUxFQ1RfUEFORUxfSU5ERU5UX1BBRERJTkdfWGAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0YCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjb25zdCBTRUxFQ1RfUEFORUxfSU5ERU5UX1BBRERJTkdfWCA9IFNFTEVDVF9QQU5FTF9QQURESU5HX1ggKiAyO1xuXG4vKipcbiAqIFRoZSBoZWlnaHQgb2YgdGhlIHNlbGVjdCBpdGVtcyBpbiBgZW1gIHVuaXRzLlxuICogQGRlcHJlY2F0ZWQgVXNlIGBTRUxFQ1RfSVRFTV9IRUlHSFRfRU1gIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3NlbGVjdGAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX0lURU1fSEVJR0hUX0VNID0gMztcblxuLy8gVE9ETyhqb3NlcGhwZXJyb3R0KTogUmV2ZXJ0IHRvIGEgY29uc3RhbnQgYWZ0ZXIgMjAxOCBzcGVjIHVwZGF0ZXMgYXJlIGZ1bGx5IG1lcmdlZC5cbi8qKlxuICogRGlzdGFuY2UgYmV0d2VlbiB0aGUgcGFuZWwgZWRnZSBhbmQgdGhlIG9wdGlvbiB0ZXh0IGluXG4gKiBtdWx0aS1zZWxlY3Rpb24gbW9kZS5cbiAqXG4gKiBDYWxjdWxhdGVkIGFzOlxuICogKFNFTEVDVF9QQU5FTF9QQURESU5HX1ggKiAxLjUpICsgMTYgPSA0MFxuICogVGhlIHBhZGRpbmcgaXMgbXVsdGlwbGllZCBieSAxLjUgYmVjYXVzZSB0aGUgY2hlY2tib3gncyBtYXJnaW4gaXMgaGFsZiB0aGUgcGFkZGluZy5cbiAqIFRoZSBjaGVja2JveCB3aWR0aCBpcyAxNnB4LlxuICpcbiAqIEBkZXByZWNhdGVkIFVzZSBgU0VMRUNUX01VTFRJUExFX1BBTkVMX1BBRERJTkdfWGAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0YCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbmV4cG9ydCBjb25zdCBTRUxFQ1RfTVVMVElQTEVfUEFORUxfUEFERElOR19YID0gU0VMRUNUX1BBTkVMX1BBRERJTkdfWCAqIDEuNSArIDE2O1xuXG4vKipcbiAqIFRoZSBzZWxlY3QgcGFuZWwgd2lsbCBvbmx5IFwiZml0XCIgaW5zaWRlIHRoZSB2aWV3cG9ydCBpZiBpdCBpcyBwb3NpdGlvbmVkIGF0XG4gKiB0aGlzIHZhbHVlIG9yIG1vcmUgYXdheSBmcm9tIHRoZSB2aWV3cG9ydCBib3VuZGFyeS5cbiAqIEBkZXByZWNhdGVkIFVzZSBgU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkdgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3NlbGVjdGAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5leHBvcnQgY29uc3QgU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkcgPSA4O1xuXG4vKipcbiAqIENoYW5nZSBldmVudCBvYmplY3QgdGhhdCBpcyBlbWl0dGVkIHdoZW4gdGhlIHNlbGVjdCB2YWx1ZSBoYXMgY2hhbmdlZC5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0U2VsZWN0Q2hhbmdlYCBmcm9tIGBAYW5ndWxhci9tYXRlcmlhbC9zZWxlY3RgIGluc3RlYWQuIFNlZSBodHRwczovL21hdGVyaWFsLmFuZ3VsYXIuaW8vZ3VpZGUvbWRjLW1pZ3JhdGlvbiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgbWlncmF0aW5nLlxuICogQGJyZWFraW5nLWNoYW5nZSAxNy4wLjBcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeVNlbGVjdENoYW5nZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIC8qKiBSZWZlcmVuY2UgdG8gdGhlIHNlbGVjdCB0aGF0IGVtaXR0ZWQgdGhlIGNoYW5nZSBldmVudC4gKi9cbiAgICBwdWJsaWMgc291cmNlOiBNYXRMZWdhY3lTZWxlY3QsXG4gICAgLyoqIEN1cnJlbnQgdmFsdWUgb2YgdGhlIHNlbGVjdCB0aGF0IGVtaXR0ZWQgdGhlIGV2ZW50LiAqL1xuICAgIHB1YmxpYyB2YWx1ZTogYW55LFxuICApIHt9XG59XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIGBNYXRTZWxlY3RDb25maWdgIGZyb20gYEBhbmd1bGFyL21hdGVyaWFsL3NlbGVjdGAgaW5zdGVhZC4gU2VlIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9ndWlkZS9tZGMtbWlncmF0aW9uIGZvciBpbmZvcm1hdGlvbiBhYm91dCBtaWdyYXRpbmcuXG4gKiBAYnJlYWtpbmctY2hhbmdlIDE3LjAuMFxuICovXG5leHBvcnQgdHlwZSBNYXRMZWdhY3lTZWxlY3RDb25maWcgPSBPbWl0PE1hdFNlbGVjdENvbmZpZywgJ3BhbmVsV2lkdGgnPjtcblxuLyoqXG4gKiBBbGxvd3MgdGhlIHVzZXIgdG8gY3VzdG9taXplIHRoZSB0cmlnZ2VyIHRoYXQgaXMgZGlzcGxheWVkIHdoZW4gdGhlIHNlbGVjdCBoYXMgYSB2YWx1ZS5cbiAqIEBkZXByZWNhdGVkIFVzZSBgTWF0U2VsZWN0VHJpZ2dlcmAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0YCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ21hdC1zZWxlY3QtdHJpZ2dlcicsXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBNQVRfU0VMRUNUX1RSSUdHRVIsIHVzZUV4aXN0aW5nOiBNYXRMZWdhY3lTZWxlY3RUcmlnZ2VyfV0sXG59KVxuZXhwb3J0IGNsYXNzIE1hdExlZ2FjeVNlbGVjdFRyaWdnZXIge31cblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBVc2UgYE1hdFNlbGVjdGAgZnJvbSBgQGFuZ3VsYXIvbWF0ZXJpYWwvc2VsZWN0YCBpbnN0ZWFkLiBTZWUgaHR0cHM6Ly9tYXRlcmlhbC5hbmd1bGFyLmlvL2d1aWRlL21kYy1taWdyYXRpb24gZm9yIGluZm9ybWF0aW9uIGFib3V0IG1pZ3JhdGluZy5cbiAqIEBicmVha2luZy1jaGFuZ2UgMTcuMC4wXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21hdC1zZWxlY3QnLFxuICBleHBvcnRBczogJ21hdFNlbGVjdCcsXG4gIHRlbXBsYXRlVXJsOiAnc2VsZWN0Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnc2VsZWN0LmNzcyddLFxuICBpbnB1dHM6IFsnZGlzYWJsZWQnLCAnZGlzYWJsZVJpcHBsZScsICd0YWJJbmRleCddLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdyb2xlJzogJ2NvbWJvYm94JyxcbiAgICAnYXJpYS1hdXRvY29tcGxldGUnOiAnbm9uZScsXG4gICAgLy8gVE9ETyhjcmlzYmV0byk6IHRoZSB2YWx1ZSBmb3IgYXJpYS1oYXNwb3B1cCBzaG91bGQgYmUgYGxpc3Rib3hgLCBidXQgY3VycmVudGx5IGl0J3MgZGlmZmljdWx0XG4gICAgLy8gdG8gc3luYyBpbnRvIEdvb2dsZSwgYmVjYXVzZSBvZiBhbiBvdXRkYXRlZCBhdXRvbWF0ZWQgYTExeSBjaGVjayB3aGljaCBmbGFncyBpdCBhcyBhbiBpbnZhbGlkXG4gICAgLy8gdmFsdWUuIEF0IHNvbWUgcG9pbnQgd2Ugc2hvdWxkIHRyeSB0byBzd2l0Y2ggaXQgYmFjayB0byBiZWluZyBgbGlzdGJveGAuXG4gICAgJ2FyaWEtaGFzcG9wdXAnOiAndHJ1ZScsXG4gICAgJ2NsYXNzJzogJ21hdC1zZWxlY3QnLFxuICAgICdbYXR0ci5pZF0nOiAnaWQnLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAndGFiSW5kZXgnLFxuICAgICdbYXR0ci5hcmlhLWNvbnRyb2xzXSc6ICdwYW5lbE9wZW4gPyBpZCArIFwiLXBhbmVsXCIgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1leHBhbmRlZF0nOiAncGFuZWxPcGVuJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbF0nOiAnYXJpYUxhYmVsIHx8IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLXJlcXVpcmVkXSc6ICdyZXF1aXJlZC50b1N0cmluZygpJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQudG9TdHJpbmcoKScsXG4gICAgJ1thdHRyLmFyaWEtaW52YWxpZF0nOiAnZXJyb3JTdGF0ZScsXG4gICAgJ1thdHRyLmFyaWEtYWN0aXZlZGVzY2VuZGFudF0nOiAnX2dldEFyaWFBY3RpdmVEZXNjZW5kYW50KCknLFxuICAgICdbY2xhc3MubWF0LXNlbGVjdC1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LXNlbGVjdC1pbnZhbGlkXSc6ICdlcnJvclN0YXRlJyxcbiAgICAnW2NsYXNzLm1hdC1zZWxlY3QtcmVxdWlyZWRdJzogJ3JlcXVpcmVkJyxcbiAgICAnW2NsYXNzLm1hdC1zZWxlY3QtZW1wdHldJzogJ2VtcHR5JyxcbiAgICAnW2NsYXNzLm1hdC1zZWxlY3QtbXVsdGlwbGVdJzogJ211bHRpcGxlJyxcbiAgICAnKGtleWRvd24pJzogJ19oYW5kbGVLZXlkb3duKCRldmVudCknLFxuICAgICcoZm9jdXMpJzogJ19vbkZvY3VzKCknLFxuICAgICcoYmx1ciknOiAnX29uQmx1cigpJyxcbiAgICAnbmdTa2lwSHlkcmF0aW9uJzogJycsXG4gIH0sXG4gIGFuaW1hdGlvbnM6IFtcbiAgICBtYXRMZWdhY3lTZWxlY3RBbmltYXRpb25zLnRyYW5zZm9ybVBhbmVsV3JhcCxcbiAgICBtYXRMZWdhY3lTZWxlY3RBbmltYXRpb25zLnRyYW5zZm9ybVBhbmVsLFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTWF0TGVnYWN5Rm9ybUZpZWxkQ29udHJvbCwgdXNlRXhpc3Rpbmc6IE1hdExlZ2FjeVNlbGVjdH0sXG4gICAge3Byb3ZpZGU6IE1BVF9MRUdBQ1lfT1BUSU9OX1BBUkVOVF9DT01QT05FTlQsIHVzZUV4aXN0aW5nOiBNYXRMZWdhY3lTZWxlY3R9LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRMZWdhY3lTZWxlY3QgZXh0ZW5kcyBfTWF0U2VsZWN0QmFzZTxNYXRMZWdhY3lTZWxlY3RDaGFuZ2U+IGltcGxlbWVudHMgT25Jbml0IHtcbiAgLyoqIFRoZSBzY3JvbGwgcG9zaXRpb24gb2YgdGhlIG92ZXJsYXkgcGFuZWwsIGNhbGN1bGF0ZWQgdG8gY2VudGVyIHRoZSBzZWxlY3RlZCBvcHRpb24uICovXG4gIHByaXZhdGUgX3Njcm9sbFRvcCA9IDA7XG5cbiAgLyoqIFRoZSBsYXN0IG1lYXN1cmVkIHZhbHVlIGZvciB0aGUgdHJpZ2dlcidzIGNsaWVudCBib3VuZGluZyByZWN0LiAqL1xuICBwcml2YXRlIF90cmlnZ2VyUmVjdDogQ2xpZW50UmVjdDtcblxuICAvKiogVGhlIGNhY2hlZCBmb250LXNpemUgb2YgdGhlIHRyaWdnZXIgZWxlbWVudC4gKi9cbiAgX3RyaWdnZXJGb250U2l6ZSA9IDA7XG5cbiAgLyoqIFRoZSB2YWx1ZSBvZiB0aGUgc2VsZWN0IHBhbmVsJ3MgdHJhbnNmb3JtLW9yaWdpbiBwcm9wZXJ0eS4gKi9cbiAgX3RyYW5zZm9ybU9yaWdpbjogc3RyaW5nID0gJ3RvcCc7XG5cbiAgLyoqXG4gICAqIFRoZSB5LW9mZnNldCBvZiB0aGUgb3ZlcmxheSBwYW5lbCBpbiByZWxhdGlvbiB0byB0aGUgdHJpZ2dlcidzIHRvcCBzdGFydCBjb3JuZXIuXG4gICAqIFRoaXMgbXVzdCBiZSBhZGp1c3RlZCB0byBhbGlnbiB0aGUgc2VsZWN0ZWQgb3B0aW9uIHRleHQgb3ZlciB0aGUgdHJpZ2dlciB0ZXh0LlxuICAgKiB3aGVuIHRoZSBwYW5lbCBvcGVucy4gV2lsbCBjaGFuZ2UgYmFzZWQgb24gdGhlIHktcG9zaXRpb24gb2YgdGhlIHNlbGVjdGVkIG9wdGlvbi5cbiAgICovXG4gIF9vZmZzZXRZID0gMDtcblxuICBAQ29udGVudENoaWxkcmVuKE1hdExlZ2FjeU9wdGlvbiwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgb3B0aW9uczogUXVlcnlMaXN0PE1hdExlZ2FjeU9wdGlvbj47XG5cbiAgQENvbnRlbnRDaGlsZHJlbihNQVRfTEVHQUNZX09QVEdST1VQLCB7ZGVzY2VuZGFudHM6IHRydWV9KVxuICBvcHRpb25Hcm91cHM6IFF1ZXJ5TGlzdDxNYXRMZWdhY3lPcHRncm91cD47XG5cbiAgQENvbnRlbnRDaGlsZChNQVRfU0VMRUNUX1RSSUdHRVIpIGN1c3RvbVRyaWdnZXI6IE1hdExlZ2FjeVNlbGVjdFRyaWdnZXI7XG5cbiAgX3Bvc2l0aW9uczogQ29ubmVjdGVkUG9zaXRpb25bXSA9IFtcbiAgICB7XG4gICAgICBvcmlnaW5YOiAnc3RhcnQnLFxuICAgICAgb3JpZ2luWTogJ3RvcCcsXG4gICAgICBvdmVybGF5WDogJ3N0YXJ0JyxcbiAgICAgIG92ZXJsYXlZOiAndG9wJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIG9yaWdpblg6ICdzdGFydCcsXG4gICAgICBvcmlnaW5ZOiAnYm90dG9tJyxcbiAgICAgIG92ZXJsYXlYOiAnc3RhcnQnLFxuICAgICAgb3ZlcmxheVk6ICdib3R0b20nLFxuICAgIH0sXG4gIF07XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHNjcm9sbCBwb3NpdGlvbiBvZiB0aGUgc2VsZWN0J3Mgb3ZlcmxheSBwYW5lbC5cbiAgICpcbiAgICogQXR0ZW1wdHMgdG8gY2VudGVyIHRoZSBzZWxlY3RlZCBvcHRpb24gaW4gdGhlIHBhbmVsLiBJZiB0aGUgb3B0aW9uIGlzXG4gICAqIHRvbyBoaWdoIG9yIHRvbyBsb3cgaW4gdGhlIHBhbmVsIHRvIGJlIHNjcm9sbGVkIHRvIHRoZSBjZW50ZXIsIGl0IGNsYW1wcyB0aGVcbiAgICogc2Nyb2xsIHBvc2l0aW9uIHRvIHRoZSBtaW4gb3IgbWF4IHNjcm9sbCBwb3NpdGlvbnMgcmVzcGVjdGl2ZWx5LlxuICAgKi9cbiAgX2NhbGN1bGF0ZU92ZXJsYXlTY3JvbGwoc2VsZWN0ZWRJbmRleDogbnVtYmVyLCBzY3JvbGxCdWZmZXI6IG51bWJlciwgbWF4U2Nyb2xsOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG4gICAgY29uc3Qgb3B0aW9uT2Zmc2V0RnJvbVNjcm9sbFRvcCA9IGl0ZW1IZWlnaHQgKiBzZWxlY3RlZEluZGV4O1xuICAgIGNvbnN0IGhhbGZPcHRpb25IZWlnaHQgPSBpdGVtSGVpZ2h0IC8gMjtcblxuICAgIC8vIFN0YXJ0cyBhdCB0aGUgb3B0aW9uT2Zmc2V0RnJvbVNjcm9sbFRvcCwgd2hpY2ggc2Nyb2xscyB0aGUgb3B0aW9uIHRvIHRoZSB0b3Agb2YgdGhlXG4gICAgLy8gc2Nyb2xsIGNvbnRhaW5lciwgdGhlbiBzdWJ0cmFjdHMgdGhlIHNjcm9sbCBidWZmZXIgdG8gc2Nyb2xsIHRoZSBvcHRpb24gZG93biB0b1xuICAgIC8vIHRoZSBjZW50ZXIgb2YgdGhlIG92ZXJsYXkgcGFuZWwuIEhhbGYgdGhlIG9wdGlvbiBoZWlnaHQgbXVzdCBiZSByZS1hZGRlZCB0byB0aGVcbiAgICAvLyBzY3JvbGxUb3Agc28gdGhlIG9wdGlvbiBpcyBjZW50ZXJlZCBiYXNlZCBvbiBpdHMgbWlkZGxlLCBub3QgaXRzIHRvcCBlZGdlLlxuICAgIGNvbnN0IG9wdGltYWxTY3JvbGxQb3NpdGlvbiA9IG9wdGlvbk9mZnNldEZyb21TY3JvbGxUb3AgLSBzY3JvbGxCdWZmZXIgKyBoYWxmT3B0aW9uSGVpZ2h0O1xuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heCgwLCBvcHRpbWFsU2Nyb2xsUG9zaXRpb24pLCBtYXhTY3JvbGwpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkluaXQoKSB7XG4gICAgc3VwZXIubmdPbkluaXQoKTtcbiAgICB0aGlzLl92aWV3cG9ydFJ1bGVyXG4gICAgICAuY2hhbmdlKClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9kZXN0cm95KSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYW5lbE9wZW4pIHtcbiAgICAgICAgICB0aGlzLl90cmlnZ2VyUmVjdCA9IHRoaXMudHJpZ2dlci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG92ZXJyaWRlIG9wZW4oKTogdm9pZCB7XG4gICAgaWYgKHN1cGVyLl9jYW5PcGVuKCkpIHtcbiAgICAgIHN1cGVyLm9wZW4oKTtcbiAgICAgIHRoaXMuX3RyaWdnZXJSZWN0ID0gdGhpcy50cmlnZ2VyLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAvLyBOb3RlOiBUaGUgY29tcHV0ZWQgZm9udC1zaXplIHdpbGwgYmUgYSBzdHJpbmcgcGl4ZWwgdmFsdWUgKGUuZy4gXCIxNnB4XCIpLlxuICAgICAgLy8gYHBhcnNlSW50YCBpZ25vcmVzIHRoZSB0cmFpbGluZyAncHgnIGFuZCBjb252ZXJ0cyB0aGlzIHRvIGEgbnVtYmVyLlxuICAgICAgdGhpcy5fdHJpZ2dlckZvbnRTaXplID0gcGFyc2VJbnQoXG4gICAgICAgIGdldENvbXB1dGVkU3R5bGUodGhpcy50cmlnZ2VyLm5hdGl2ZUVsZW1lbnQpLmZvbnRTaXplIHx8ICcwJyxcbiAgICAgICk7XG4gICAgICB0aGlzLl9jYWxjdWxhdGVPdmVybGF5UG9zaXRpb24oKTtcblxuICAgICAgLy8gU2V0IHRoZSBmb250IHNpemUgb24gdGhlIHBhbmVsIGVsZW1lbnQgb25jZSBpdCBleGlzdHMuXG4gICAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5fdHJpZ2dlckZvbnRTaXplICYmXG4gICAgICAgICAgdGhpcy5fb3ZlcmxheURpci5vdmVybGF5UmVmICYmXG4gICAgICAgICAgdGhpcy5fb3ZlcmxheURpci5vdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50XG4gICAgICAgICkge1xuICAgICAgICAgIHRoaXMuX292ZXJsYXlEaXIub3ZlcmxheVJlZi5vdmVybGF5RWxlbWVudC5zdHlsZS5mb250U2l6ZSA9IGAke3RoaXMuX3RyaWdnZXJGb250U2l6ZX1weGA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBTY3JvbGxzIHRoZSBhY3RpdmUgb3B0aW9uIGludG8gdmlldy4gKi9cbiAgcHJvdGVjdGVkIF9zY3JvbGxPcHRpb25JbnRvVmlldyhpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgbGFiZWxDb3VudCA9IF9jb3VudEdyb3VwTGFiZWxzQmVmb3JlTGVnYWN5T3B0aW9uKGluZGV4LCB0aGlzLm9wdGlvbnMsIHRoaXMub3B0aW9uR3JvdXBzKTtcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy5fZ2V0SXRlbUhlaWdodCgpO1xuXG4gICAgaWYgKGluZGV4ID09PSAwICYmIGxhYmVsQ291bnQgPT09IDEpIHtcbiAgICAgIC8vIElmIHdlJ3ZlIGdvdCBvbmUgZ3JvdXAgbGFiZWwgYmVmb3JlIHRoZSBvcHRpb24gYW5kIHdlJ3JlIGF0IHRoZSB0b3Agb3B0aW9uLFxuICAgICAgLy8gc2Nyb2xsIHRoZSBsaXN0IHRvIHRoZSB0b3AuIFRoaXMgaXMgYmV0dGVyIFVYIHRoYW4gc2Nyb2xsaW5nIHRoZSBsaXN0IHRvIHRoZVxuICAgICAgLy8gdG9wIG9mIHRoZSBvcHRpb24sIGJlY2F1c2UgaXQgYWxsb3dzIHRoZSB1c2VyIHRvIHJlYWQgdGhlIHRvcCBncm91cCdzIGxhYmVsLlxuICAgICAgdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFuZWwubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgPSBfZ2V0TGVnYWN5T3B0aW9uU2Nyb2xsUG9zaXRpb24oXG4gICAgICAgIChpbmRleCArIGxhYmVsQ291bnQpICogaXRlbUhlaWdodCxcbiAgICAgICAgaXRlbUhlaWdodCxcbiAgICAgICAgdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCxcbiAgICAgICAgU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfcG9zaXRpb25pbmdTZXR0bGVkKCkge1xuICAgIHRoaXMuX2NhbGN1bGF0ZU92ZXJsYXlPZmZzZXRYKCk7XG4gICAgdGhpcy5wYW5lbC5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCA9IHRoaXMuX3Njcm9sbFRvcDtcbiAgfVxuXG4gIHByb3RlY3RlZCBvdmVycmlkZSBfcGFuZWxEb25lQW5pbWF0aW5nKGlzT3BlbjogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLnBhbmVsT3Blbikge1xuICAgICAgdGhpcy5fc2Nyb2xsVG9wID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fb3ZlcmxheURpci5vZmZzZXRYID0gMDtcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIHN1cGVyLl9wYW5lbERvbmVBbmltYXRpbmcoaXNPcGVuKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZ2V0Q2hhbmdlRXZlbnQodmFsdWU6IGFueSkge1xuICAgIHJldHVybiBuZXcgTWF0TGVnYWN5U2VsZWN0Q2hhbmdlKHRoaXMsIHZhbHVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZ2V0T3ZlcmxheU1pbldpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3RyaWdnZXJSZWN0Py53aWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB4LW9mZnNldCBvZiB0aGUgb3ZlcmxheSBwYW5lbCBpbiByZWxhdGlvbiB0byB0aGUgdHJpZ2dlcidzIHRvcCBzdGFydCBjb3JuZXIuXG4gICAqIFRoaXMgbXVzdCBiZSBhZGp1c3RlZCB0byBhbGlnbiB0aGUgc2VsZWN0ZWQgb3B0aW9uIHRleHQgb3ZlciB0aGUgdHJpZ2dlciB0ZXh0IHdoZW5cbiAgICogdGhlIHBhbmVsIG9wZW5zLiBXaWxsIGNoYW5nZSBiYXNlZCBvbiBMVFIgb3IgUlRMIHRleHQgZGlyZWN0aW9uLiBOb3RlIHRoYXQgdGhlIG9mZnNldFxuICAgKiBjYW4ndCBiZSBjYWxjdWxhdGVkIHVudGlsIHRoZSBwYW5lbCBoYXMgYmVlbiBhdHRhY2hlZCwgYmVjYXVzZSB3ZSBuZWVkIHRvIGtub3cgdGhlXG4gICAqIGNvbnRlbnQgd2lkdGggaW4gb3JkZXIgdG8gY29uc3RyYWluIHRoZSBwYW5lbCB3aXRoaW4gdGhlIHZpZXdwb3J0LlxuICAgKi9cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlT3ZlcmxheU9mZnNldFgoKTogdm9pZCB7XG4gICAgY29uc3Qgb3ZlcmxheVJlY3QgPSB0aGlzLl9vdmVybGF5RGlyLm92ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3Qgdmlld3BvcnRTaXplID0gdGhpcy5fdmlld3BvcnRSdWxlci5nZXRWaWV3cG9ydFNpemUoKTtcbiAgICBjb25zdCBpc1J0bCA9IHRoaXMuX2lzUnRsKCk7XG4gICAgY29uc3QgcGFkZGluZ1dpZHRoID0gdGhpcy5tdWx0aXBsZVxuICAgICAgPyBTRUxFQ1RfTVVMVElQTEVfUEFORUxfUEFERElOR19YICsgU0VMRUNUX1BBTkVMX1BBRERJTkdfWFxuICAgICAgOiBTRUxFQ1RfUEFORUxfUEFERElOR19YICogMjtcbiAgICBsZXQgb2Zmc2V0WDogbnVtYmVyO1xuXG4gICAgLy8gQWRqdXN0IHRoZSBvZmZzZXQsIGRlcGVuZGluZyBvbiB0aGUgb3B0aW9uIHBhZGRpbmcuXG4gICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgIG9mZnNldFggPSBTRUxFQ1RfTVVMVElQTEVfUEFORUxfUEFERElOR19YO1xuICAgIH0gZWxzZSBpZiAodGhpcy5kaXNhYmxlT3B0aW9uQ2VudGVyaW5nKSB7XG4gICAgICBvZmZzZXRYID0gU0VMRUNUX1BBTkVMX1BBRERJTkdfWDtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHNlbGVjdGVkID0gdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWRbMF0gfHwgdGhpcy5vcHRpb25zLmZpcnN0O1xuICAgICAgb2Zmc2V0WCA9IHNlbGVjdGVkICYmIHNlbGVjdGVkLmdyb3VwID8gU0VMRUNUX1BBTkVMX0lOREVOVF9QQURESU5HX1ggOiBTRUxFQ1RfUEFORUxfUEFERElOR19YO1xuICAgIH1cblxuICAgIC8vIEludmVydCB0aGUgb2Zmc2V0IGluIExUUi5cbiAgICBpZiAoIWlzUnRsKSB7XG4gICAgICBvZmZzZXRYICo9IC0xO1xuICAgIH1cblxuICAgIC8vIERldGVybWluZSBob3cgbXVjaCB0aGUgc2VsZWN0IG92ZXJmbG93cyBvbiBlYWNoIHNpZGUuXG4gICAgY29uc3QgbGVmdE92ZXJmbG93ID0gMCAtIChvdmVybGF5UmVjdC5sZWZ0ICsgb2Zmc2V0WCAtIChpc1J0bCA/IHBhZGRpbmdXaWR0aCA6IDApKTtcbiAgICBjb25zdCByaWdodE92ZXJmbG93ID1cbiAgICAgIG92ZXJsYXlSZWN0LnJpZ2h0ICsgb2Zmc2V0WCAtIHZpZXdwb3J0U2l6ZS53aWR0aCArIChpc1J0bCA/IDAgOiBwYWRkaW5nV2lkdGgpO1xuXG4gICAgLy8gSWYgdGhlIGVsZW1lbnQgb3ZlcmZsb3dzIG9uIGVpdGhlciBzaWRlLCByZWR1Y2UgdGhlIG9mZnNldCB0byBhbGxvdyBpdCB0byBmaXQuXG4gICAgaWYgKGxlZnRPdmVyZmxvdyA+IDApIHtcbiAgICAgIG9mZnNldFggKz0gbGVmdE92ZXJmbG93ICsgU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkc7XG4gICAgfSBlbHNlIGlmIChyaWdodE92ZXJmbG93ID4gMCkge1xuICAgICAgb2Zmc2V0WCAtPSByaWdodE92ZXJmbG93ICsgU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkc7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBvZmZzZXQgZGlyZWN0bHkgaW4gb3JkZXIgdG8gYXZvaWQgaGF2aW5nIHRvIGdvIHRocm91Z2ggY2hhbmdlIGRldGVjdGlvbiBhbmRcbiAgICAvLyBwb3RlbnRpYWxseSB0cmlnZ2VyaW5nIFwiY2hhbmdlZCBhZnRlciBpdCB3YXMgY2hlY2tlZFwiIGVycm9ycy4gUm91bmQgdGhlIHZhbHVlIHRvIGF2b2lkXG4gICAgLy8gYmx1cnJ5IGNvbnRlbnQgaW4gc29tZSBicm93c2Vycy5cbiAgICB0aGlzLl9vdmVybGF5RGlyLm9mZnNldFggPSBNYXRoLnJvdW5kKG9mZnNldFgpO1xuICAgIHRoaXMuX292ZXJsYXlEaXIub3ZlcmxheVJlZi51cGRhdGVQb3NpdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIHktb2Zmc2V0IG9mIHRoZSBzZWxlY3QncyBvdmVybGF5IHBhbmVsIGluIHJlbGF0aW9uIHRvIHRoZVxuICAgKiB0b3Agc3RhcnQgY29ybmVyIG9mIHRoZSB0cmlnZ2VyLiBJdCBoYXMgdG8gYmUgYWRqdXN0ZWQgaW4gb3JkZXIgZm9yIHRoZVxuICAgKiBzZWxlY3RlZCBvcHRpb24gdG8gYmUgYWxpZ25lZCBvdmVyIHRoZSB0cmlnZ2VyIHdoZW4gdGhlIHBhbmVsIG9wZW5zLlxuICAgKi9cbiAgcHJpdmF0ZSBfY2FsY3VsYXRlT3ZlcmxheU9mZnNldFkoXG4gICAgc2VsZWN0ZWRJbmRleDogbnVtYmVyLFxuICAgIHNjcm9sbEJ1ZmZlcjogbnVtYmVyLFxuICAgIG1heFNjcm9sbDogbnVtYmVyLFxuICApOiBudW1iZXIge1xuICAgIGNvbnN0IGl0ZW1IZWlnaHQgPSB0aGlzLl9nZXRJdGVtSGVpZ2h0KCk7XG4gICAgY29uc3Qgb3B0aW9uSGVpZ2h0QWRqdXN0bWVudCA9IChpdGVtSGVpZ2h0IC0gdGhpcy5fdHJpZ2dlclJlY3QuaGVpZ2h0KSAvIDI7XG4gICAgY29uc3QgbWF4T3B0aW9uc0Rpc3BsYXllZCA9IE1hdGguZmxvb3IoU0VMRUNUX1BBTkVMX01BWF9IRUlHSFQgLyBpdGVtSGVpZ2h0KTtcbiAgICBsZXQgb3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wOiBudW1iZXI7XG5cbiAgICAvLyBEaXNhYmxlIG9mZnNldCBpZiByZXF1ZXN0ZWQgYnkgdXNlciBieSByZXR1cm5pbmcgMCBhcyB2YWx1ZSB0byBvZmZzZXRcbiAgICBpZiAodGhpcy5kaXNhYmxlT3B0aW9uQ2VudGVyaW5nKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fc2Nyb2xsVG9wID09PSAwKSB7XG4gICAgICBvcHRpb25PZmZzZXRGcm9tUGFuZWxUb3AgPSBzZWxlY3RlZEluZGV4ICogaXRlbUhlaWdodDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3Njcm9sbFRvcCA9PT0gbWF4U2Nyb2xsKSB7XG4gICAgICBjb25zdCBmaXJzdERpc3BsYXllZEluZGV4ID0gdGhpcy5fZ2V0SXRlbUNvdW50KCkgLSBtYXhPcHRpb25zRGlzcGxheWVkO1xuICAgICAgY29uc3Qgc2VsZWN0ZWREaXNwbGF5SW5kZXggPSBzZWxlY3RlZEluZGV4IC0gZmlyc3REaXNwbGF5ZWRJbmRleDtcblxuICAgICAgLy8gVGhlIGZpcnN0IGl0ZW0gaXMgcGFydGlhbGx5IG91dCBvZiB0aGUgdmlld3BvcnQuIFRoZXJlZm9yZSB3ZSBuZWVkIHRvIGNhbGN1bGF0ZSB3aGF0XG4gICAgICAvLyBwb3J0aW9uIG9mIGl0IGlzIHNob3duIGluIHRoZSB2aWV3cG9ydCBhbmQgYWNjb3VudCBmb3IgaXQgaW4gb3VyIG9mZnNldC5cbiAgICAgIGxldCBwYXJ0aWFsSXRlbUhlaWdodCA9XG4gICAgICAgIGl0ZW1IZWlnaHQgLSAoKHRoaXMuX2dldEl0ZW1Db3VudCgpICogaXRlbUhlaWdodCAtIFNFTEVDVF9QQU5FTF9NQVhfSEVJR0hUKSAlIGl0ZW1IZWlnaHQpO1xuXG4gICAgICAvLyBCZWNhdXNlIHRoZSBwYW5lbCBoZWlnaHQgaXMgbG9uZ2VyIHRoYW4gdGhlIGhlaWdodCBvZiB0aGUgb3B0aW9ucyBhbG9uZSxcbiAgICAgIC8vIHRoZXJlIGlzIGFsd2F5cyBleHRyYSBwYWRkaW5nIGF0IHRoZSB0b3Agb3IgYm90dG9tIG9mIHRoZSBwYW5lbC4gV2hlblxuICAgICAgLy8gc2Nyb2xsZWQgdG8gdGhlIHZlcnkgYm90dG9tLCB0aGlzIHBhZGRpbmcgaXMgYXQgdGhlIHRvcCBvZiB0aGUgcGFuZWwgYW5kXG4gICAgICAvLyBtdXN0IGJlIGFkZGVkIHRvIHRoZSBvZmZzZXQuXG4gICAgICBvcHRpb25PZmZzZXRGcm9tUGFuZWxUb3AgPSBzZWxlY3RlZERpc3BsYXlJbmRleCAqIGl0ZW1IZWlnaHQgKyBwYXJ0aWFsSXRlbUhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhlIG9wdGlvbiB3YXMgc2Nyb2xsZWQgdG8gdGhlIG1pZGRsZSBvZiB0aGUgcGFuZWwgdXNpbmcgYSBzY3JvbGwgYnVmZmVyLFxuICAgICAgLy8gaXRzIG9mZnNldCB3aWxsIGJlIHRoZSBzY3JvbGwgYnVmZmVyIG1pbnVzIHRoZSBoYWxmIGhlaWdodCB0aGF0IHdhcyBhZGRlZCB0b1xuICAgICAgLy8gY2VudGVyIGl0LlxuICAgICAgb3B0aW9uT2Zmc2V0RnJvbVBhbmVsVG9wID0gc2Nyb2xsQnVmZmVyIC0gaXRlbUhlaWdodCAvIDI7XG4gICAgfVxuXG4gICAgLy8gVGhlIGZpbmFsIG9mZnNldCBpcyB0aGUgb3B0aW9uJ3Mgb2Zmc2V0IGZyb20gdGhlIHRvcCwgYWRqdXN0ZWQgZm9yIHRoZSBoZWlnaHQgZGlmZmVyZW5jZSxcbiAgICAvLyBtdWx0aXBsaWVkIGJ5IC0xIHRvIGVuc3VyZSB0aGF0IHRoZSBvdmVybGF5IG1vdmVzIGluIHRoZSBjb3JyZWN0IGRpcmVjdGlvbiB1cCB0aGUgcGFnZS5cbiAgICAvLyBUaGUgdmFsdWUgaXMgcm91bmRlZCB0byBwcmV2ZW50IHNvbWUgYnJvd3NlcnMgZnJvbSBibHVycmluZyB0aGUgY29udGVudC5cbiAgICByZXR1cm4gTWF0aC5yb3VuZChvcHRpb25PZmZzZXRGcm9tUGFuZWxUb3AgKiAtMSAtIG9wdGlvbkhlaWdodEFkanVzdG1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB0aGF0IHRoZSBhdHRlbXB0ZWQgb3ZlcmxheSBwb3NpdGlvbiB3aWxsIGZpdCB3aXRoaW4gdGhlIHZpZXdwb3J0LlxuICAgKiBJZiBpdCB3aWxsIG5vdCBmaXQsIHRyaWVzIHRvIGFkanVzdCB0aGUgc2Nyb2xsIHBvc2l0aW9uIGFuZCB0aGUgYXNzb2NpYXRlZFxuICAgKiB5LW9mZnNldCBzbyB0aGUgcGFuZWwgY2FuIG9wZW4gZnVsbHkgb24tc2NyZWVuLiBJZiBpdCBzdGlsbCB3b24ndCBmaXQsXG4gICAqIHNldHMgdGhlIG9mZnNldCBiYWNrIHRvIDAgdG8gYWxsb3cgdGhlIGZhbGxiYWNrIHBvc2l0aW9uIHRvIHRha2Ugb3Zlci5cbiAgICovXG4gIHByaXZhdGUgX2NoZWNrT3ZlcmxheVdpdGhpblZpZXdwb3J0KG1heFNjcm9sbDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCB2aWV3cG9ydFNpemUgPSB0aGlzLl92aWV3cG9ydFJ1bGVyLmdldFZpZXdwb3J0U2l6ZSgpO1xuXG4gICAgY29uc3QgdG9wU3BhY2VBdmFpbGFibGUgPSB0aGlzLl90cmlnZ2VyUmVjdC50b3AgLSBTRUxFQ1RfUEFORUxfVklFV1BPUlRfUEFERElORztcbiAgICBjb25zdCBib3R0b21TcGFjZUF2YWlsYWJsZSA9XG4gICAgICB2aWV3cG9ydFNpemUuaGVpZ2h0IC0gdGhpcy5fdHJpZ2dlclJlY3QuYm90dG9tIC0gU0VMRUNUX1BBTkVMX1ZJRVdQT1JUX1BBRERJTkc7XG5cbiAgICBjb25zdCBwYW5lbEhlaWdodFRvcCA9IE1hdGguYWJzKHRoaXMuX29mZnNldFkpO1xuICAgIGNvbnN0IHRvdGFsUGFuZWxIZWlnaHQgPSBNYXRoLm1pbih0aGlzLl9nZXRJdGVtQ291bnQoKSAqIGl0ZW1IZWlnaHQsIFNFTEVDVF9QQU5FTF9NQVhfSEVJR0hUKTtcbiAgICBjb25zdCBwYW5lbEhlaWdodEJvdHRvbSA9IHRvdGFsUGFuZWxIZWlnaHQgLSBwYW5lbEhlaWdodFRvcCAtIHRoaXMuX3RyaWdnZXJSZWN0LmhlaWdodDtcblxuICAgIGlmIChwYW5lbEhlaWdodEJvdHRvbSA+IGJvdHRvbVNwYWNlQXZhaWxhYmxlKSB7XG4gICAgICB0aGlzLl9hZGp1c3RQYW5lbFVwKHBhbmVsSGVpZ2h0Qm90dG9tLCBib3R0b21TcGFjZUF2YWlsYWJsZSk7XG4gICAgfSBlbHNlIGlmIChwYW5lbEhlaWdodFRvcCA+IHRvcFNwYWNlQXZhaWxhYmxlKSB7XG4gICAgICB0aGlzLl9hZGp1c3RQYW5lbERvd24ocGFuZWxIZWlnaHRUb3AsIHRvcFNwYWNlQXZhaWxhYmxlLCBtYXhTY3JvbGwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSB0aGlzLl9nZXRPcmlnaW5CYXNlZE9uT3B0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEFkanVzdHMgdGhlIG92ZXJsYXkgcGFuZWwgdXAgdG8gZml0IGluIHRoZSB2aWV3cG9ydC4gKi9cbiAgcHJpdmF0ZSBfYWRqdXN0UGFuZWxVcChwYW5lbEhlaWdodEJvdHRvbTogbnVtYmVyLCBib3R0b21TcGFjZUF2YWlsYWJsZTogbnVtYmVyKSB7XG4gICAgLy8gQnJvd3NlcnMgaWdub3JlIGZyYWN0aW9uYWwgc2Nyb2xsIG9mZnNldHMsIHNvIHdlIG5lZWQgdG8gcm91bmQuXG4gICAgY29uc3QgZGlzdGFuY2VCZWxvd1ZpZXdwb3J0ID0gTWF0aC5yb3VuZChwYW5lbEhlaWdodEJvdHRvbSAtIGJvdHRvbVNwYWNlQXZhaWxhYmxlKTtcblxuICAgIC8vIFNjcm9sbHMgdGhlIHBhbmVsIHVwIGJ5IHRoZSBkaXN0YW5jZSBpdCB3YXMgZXh0ZW5kaW5nIHBhc3QgdGhlIGJvdW5kYXJ5LCB0aGVuXG4gICAgLy8gYWRqdXN0cyB0aGUgb2Zmc2V0IGJ5IHRoYXQgYW1vdW50IHRvIG1vdmUgdGhlIHBhbmVsIHVwIGludG8gdGhlIHZpZXdwb3J0LlxuICAgIHRoaXMuX3Njcm9sbFRvcCAtPSBkaXN0YW5jZUJlbG93Vmlld3BvcnQ7XG4gICAgdGhpcy5fb2Zmc2V0WSAtPSBkaXN0YW5jZUJlbG93Vmlld3BvcnQ7XG4gICAgdGhpcy5fdHJhbnNmb3JtT3JpZ2luID0gdGhpcy5fZ2V0T3JpZ2luQmFzZWRPbk9wdGlvbigpO1xuXG4gICAgLy8gSWYgdGhlIHBhbmVsIGlzIHNjcm9sbGVkIHRvIHRoZSB2ZXJ5IHRvcCwgaXQgd29uJ3QgYmUgYWJsZSB0byBmaXQgdGhlIHBhbmVsXG4gICAgLy8gYnkgc2Nyb2xsaW5nLCBzbyBzZXQgdGhlIG9mZnNldCB0byAwIHRvIGFsbG93IHRoZSBmYWxsYmFjayBwb3NpdGlvbiB0byB0YWtlXG4gICAgLy8gZWZmZWN0LlxuICAgIGlmICh0aGlzLl9zY3JvbGxUb3AgPD0gMCkge1xuICAgICAgdGhpcy5fc2Nyb2xsVG9wID0gMDtcbiAgICAgIHRoaXMuX29mZnNldFkgPSAwO1xuICAgICAgdGhpcy5fdHJhbnNmb3JtT3JpZ2luID0gYDUwJSBib3R0b20gMHB4YDtcbiAgICB9XG4gIH1cblxuICAvKiogQWRqdXN0cyB0aGUgb3ZlcmxheSBwYW5lbCBkb3duIHRvIGZpdCBpbiB0aGUgdmlld3BvcnQuICovXG4gIHByaXZhdGUgX2FkanVzdFBhbmVsRG93bihwYW5lbEhlaWdodFRvcDogbnVtYmVyLCB0b3BTcGFjZUF2YWlsYWJsZTogbnVtYmVyLCBtYXhTY3JvbGw6IG51bWJlcikge1xuICAgIC8vIEJyb3dzZXJzIGlnbm9yZSBmcmFjdGlvbmFsIHNjcm9sbCBvZmZzZXRzLCBzbyB3ZSBuZWVkIHRvIHJvdW5kLlxuICAgIGNvbnN0IGRpc3RhbmNlQWJvdmVWaWV3cG9ydCA9IE1hdGgucm91bmQocGFuZWxIZWlnaHRUb3AgLSB0b3BTcGFjZUF2YWlsYWJsZSk7XG5cbiAgICAvLyBTY3JvbGxzIHRoZSBwYW5lbCBkb3duIGJ5IHRoZSBkaXN0YW5jZSBpdCB3YXMgZXh0ZW5kaW5nIHBhc3QgdGhlIGJvdW5kYXJ5LCB0aGVuXG4gICAgLy8gYWRqdXN0cyB0aGUgb2Zmc2V0IGJ5IHRoYXQgYW1vdW50IHRvIG1vdmUgdGhlIHBhbmVsIGRvd24gaW50byB0aGUgdmlld3BvcnQuXG4gICAgdGhpcy5fc2Nyb2xsVG9wICs9IGRpc3RhbmNlQWJvdmVWaWV3cG9ydDtcbiAgICB0aGlzLl9vZmZzZXRZICs9IGRpc3RhbmNlQWJvdmVWaWV3cG9ydDtcbiAgICB0aGlzLl90cmFuc2Zvcm1PcmlnaW4gPSB0aGlzLl9nZXRPcmlnaW5CYXNlZE9uT3B0aW9uKCk7XG5cbiAgICAvLyBJZiB0aGUgcGFuZWwgaXMgc2Nyb2xsZWQgdG8gdGhlIHZlcnkgYm90dG9tLCBpdCB3b24ndCBiZSBhYmxlIHRvIGZpdCB0aGVcbiAgICAvLyBwYW5lbCBieSBzY3JvbGxpbmcsIHNvIHNldCB0aGUgb2Zmc2V0IHRvIDAgdG8gYWxsb3cgdGhlIGZhbGxiYWNrIHBvc2l0aW9uXG4gICAgLy8gdG8gdGFrZSBlZmZlY3QuXG4gICAgaWYgKHRoaXMuX3Njcm9sbFRvcCA+PSBtYXhTY3JvbGwpIHtcbiAgICAgIHRoaXMuX3Njcm9sbFRvcCA9IG1heFNjcm9sbDtcbiAgICAgIHRoaXMuX29mZnNldFkgPSAwO1xuICAgICAgdGhpcy5fdHJhbnNmb3JtT3JpZ2luID0gYDUwJSB0b3AgMHB4YDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICAvKiogQ2FsY3VsYXRlcyB0aGUgc2Nyb2xsIHBvc2l0aW9uIGFuZCB4LSBhbmQgeS1vZmZzZXRzIG9mIHRoZSBvdmVybGF5IHBhbmVsLiAqL1xuICBwcml2YXRlIF9jYWxjdWxhdGVPdmVybGF5UG9zaXRpb24oKTogdm9pZCB7XG4gICAgY29uc3QgaXRlbUhlaWdodCA9IHRoaXMuX2dldEl0ZW1IZWlnaHQoKTtcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2dldEl0ZW1Db3VudCgpO1xuICAgIGNvbnN0IHBhbmVsSGVpZ2h0ID0gTWF0aC5taW4oaXRlbXMgKiBpdGVtSGVpZ2h0LCBTRUxFQ1RfUEFORUxfTUFYX0hFSUdIVCk7XG4gICAgY29uc3Qgc2Nyb2xsQ29udGFpbmVySGVpZ2h0ID0gaXRlbXMgKiBpdGVtSGVpZ2h0O1xuXG4gICAgLy8gVGhlIGZhcnRoZXN0IHRoZSBwYW5lbCBjYW4gYmUgc2Nyb2xsZWQgYmVmb3JlIGl0IGhpdHMgdGhlIGJvdHRvbVxuICAgIGNvbnN0IG1heFNjcm9sbCA9IHNjcm9sbENvbnRhaW5lckhlaWdodCAtIHBhbmVsSGVpZ2h0O1xuXG4gICAgLy8gSWYgbm8gdmFsdWUgaXMgc2VsZWN0ZWQgd2Ugb3BlbiB0aGUgcG9wdXAgdG8gdGhlIGZpcnN0IGl0ZW0uXG4gICAgbGV0IHNlbGVjdGVkT3B0aW9uT2Zmc2V0OiBudW1iZXI7XG5cbiAgICBpZiAodGhpcy5lbXB0eSkge1xuICAgICAgc2VsZWN0ZWRPcHRpb25PZmZzZXQgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RlZE9wdGlvbk9mZnNldCA9IE1hdGgubWF4KFxuICAgICAgICB0aGlzLm9wdGlvbnMudG9BcnJheSgpLmluZGV4T2YodGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0ZWRbMF0pLFxuICAgICAgICAwLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBzZWxlY3RlZE9wdGlvbk9mZnNldCArPSBfY291bnRHcm91cExhYmVsc0JlZm9yZUxlZ2FjeU9wdGlvbihcbiAgICAgIHNlbGVjdGVkT3B0aW9uT2Zmc2V0LFxuICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgdGhpcy5vcHRpb25Hcm91cHMsXG4gICAgKTtcblxuICAgIC8vIFdlIG11c3QgbWFpbnRhaW4gYSBzY3JvbGwgYnVmZmVyIHNvIHRoZSBzZWxlY3RlZCBvcHRpb24gd2lsbCBiZSBzY3JvbGxlZCB0byB0aGVcbiAgICAvLyBjZW50ZXIgb2YgdGhlIG92ZXJsYXkgcGFuZWwgcmF0aGVyIHRoYW4gdGhlIHRvcC5cbiAgICBjb25zdCBzY3JvbGxCdWZmZXIgPSBwYW5lbEhlaWdodCAvIDI7XG4gICAgdGhpcy5fc2Nyb2xsVG9wID0gdGhpcy5fY2FsY3VsYXRlT3ZlcmxheVNjcm9sbChzZWxlY3RlZE9wdGlvbk9mZnNldCwgc2Nyb2xsQnVmZmVyLCBtYXhTY3JvbGwpO1xuICAgIHRoaXMuX29mZnNldFkgPSB0aGlzLl9jYWxjdWxhdGVPdmVybGF5T2Zmc2V0WShzZWxlY3RlZE9wdGlvbk9mZnNldCwgc2Nyb2xsQnVmZmVyLCBtYXhTY3JvbGwpO1xuXG4gICAgdGhpcy5fY2hlY2tPdmVybGF5V2l0aGluVmlld3BvcnQobWF4U2Nyb2xsKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSB0cmFuc2Zvcm0gb3JpZ2luIHBvaW50IGJhc2VkIG9uIHRoZSBzZWxlY3RlZCBvcHRpb24uICovXG4gIHByaXZhdGUgX2dldE9yaWdpbkJhc2VkT25PcHRpb24oKTogc3RyaW5nIHtcbiAgICBjb25zdCBpdGVtSGVpZ2h0ID0gdGhpcy5fZ2V0SXRlbUhlaWdodCgpO1xuICAgIGNvbnN0IG9wdGlvbkhlaWdodEFkanVzdG1lbnQgPSAoaXRlbUhlaWdodCAtIHRoaXMuX3RyaWdnZXJSZWN0LmhlaWdodCkgLyAyO1xuICAgIGNvbnN0IG9yaWdpblkgPSBNYXRoLmFicyh0aGlzLl9vZmZzZXRZKSAtIG9wdGlvbkhlaWdodEFkanVzdG1lbnQgKyBpdGVtSGVpZ2h0IC8gMjtcbiAgICByZXR1cm4gYDUwJSAke29yaWdpbll9cHggMHB4YDtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGVzIHRoZSBoZWlnaHQgb2YgdGhlIHNlbGVjdCdzIG9wdGlvbnMuICovXG4gIHByaXZhdGUgX2dldEl0ZW1IZWlnaHQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fdHJpZ2dlckZvbnRTaXplICogU0VMRUNUX0lURU1fSEVJR0hUX0VNO1xuICB9XG5cbiAgLyoqIENhbGN1bGF0ZXMgdGhlIGFtb3VudCBvZiBpdGVtcyBpbiB0aGUgc2VsZWN0LiBUaGlzIGluY2x1ZGVzIG9wdGlvbnMgYW5kIGdyb3VwIGxhYmVscy4gKi9cbiAgcHJpdmF0ZSBfZ2V0SXRlbUNvdW50KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5sZW5ndGggKyB0aGlzLm9wdGlvbkdyb3Vwcy5sZW5ndGg7XG4gIH1cbn1cbiIsIjwhLS1cbiBOb3RlIHRoYXQgdGhlIHNlbGVjdCB0cmlnZ2VyIGVsZW1lbnQgc3BlY2lmaWVzIGBhcmlhLW93bnNgIHBvaW50aW5nIHRvIHRoZSBsaXN0Ym94IG92ZXJsYXkuXG4gV2hpbGUgYXJpYS1vd25zIGlzIG5vdCByZXF1aXJlZCBmb3IgdGhlIEFSSUEgMS4yIGByb2xlPVwiY29tYm9ib3hcImAgaW50ZXJhY3Rpb24gcGF0dGVybixcbiBpdCBmaXhlcyBhbiBpc3N1ZSB3aXRoIFZvaWNlT3ZlciB3aGVuIHRoZSBzZWxlY3QgYXBwZWFycyBpbnNpZGUgb2YgYW4gYGFyaWEtbW9kZWw9XCJ0cnVlXCJgXG4gZWxlbWVudCAoZS5nLiBhIGRpYWxvZykuIFdpdGhvdXQgdGhpcyBgYXJpYS1vd25zYCwgdGhlIGBhcmlhLW1vZGFsYCBvbiBhIGRpYWxvZyBwcmV2ZW50c1xuIFZvaWNlT3ZlciBmcm9tIFwic2VlaW5nXCIgdGhlIHNlbGVjdCdzIGxpc3Rib3ggb3ZlcmxheSBmb3IgYXJpYS1hY3RpdmVkZXNjZW5kYW50LlxuIFVzaW5nIGBhcmlhLW93bnNgIHJlLXBhcmVudHMgdGhlIHNlbGVjdCBvdmVybGF5IHNvIHRoYXQgaXQgd29ya3MgYWdhaW4uXG4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzIwNjk0XG4tLT5cbjxkaXYgY2RrLW92ZXJsYXktb3JpZ2luXG4gICAgIFthdHRyLmFyaWEtb3duc109XCJwYW5lbE9wZW4gPyBpZCArICctcGFuZWwnIDogbnVsbFwiXG4gICAgIGNsYXNzPVwibWF0LXNlbGVjdC10cmlnZ2VyXCJcbiAgICAgKGNsaWNrKT1cInRvZ2dsZSgpXCJcbiAgICAgI29yaWdpbj1cImNka092ZXJsYXlPcmlnaW5cIlxuICAgICAjdHJpZ2dlcj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1zZWxlY3QtdmFsdWVcIiBbbmdTd2l0Y2hdPVwiZW1wdHlcIiBbYXR0ci5pZF09XCJfdmFsdWVJZFwiPlxuICAgIDxzcGFuIGNsYXNzPVwibWF0LXNlbGVjdC1wbGFjZWhvbGRlciBtYXQtc2VsZWN0LW1pbi1saW5lXCIgKm5nU3dpdGNoQ2FzZT1cInRydWVcIj57e3BsYWNlaG9sZGVyfX08L3NwYW4+XG4gICAgPHNwYW4gY2xhc3M9XCJtYXQtc2VsZWN0LXZhbHVlLXRleHRcIiAqbmdTd2l0Y2hDYXNlPVwiZmFsc2VcIiBbbmdTd2l0Y2hdPVwiISFjdXN0b21UcmlnZ2VyXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cIm1hdC1zZWxlY3QtbWluLWxpbmVcIiAqbmdTd2l0Y2hEZWZhdWx0Pnt7dHJpZ2dlclZhbHVlfX08L3NwYW4+XG4gICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJtYXQtc2VsZWN0LXRyaWdnZXJcIiAqbmdTd2l0Y2hDYXNlPVwidHJ1ZVwiPjwvbmctY29udGVudD5cbiAgICA8L3NwYW4+XG4gIDwvZGl2PlxuXG4gIDxkaXYgY2xhc3M9XCJtYXQtc2VsZWN0LWFycm93LXdyYXBwZXJcIj48ZGl2IGNsYXNzPVwibWF0LXNlbGVjdC1hcnJvd1wiPjwvZGl2PjwvZGl2PlxuPC9kaXY+XG5cbjxuZy10ZW1wbGF0ZVxuICBjZGstY29ubmVjdGVkLW92ZXJsYXlcbiAgY2RrQ29ubmVjdGVkT3ZlcmxheUxvY2tQb3NpdGlvblxuICBjZGtDb25uZWN0ZWRPdmVybGF5SGFzQmFja2Ryb3BcbiAgY2RrQ29ubmVjdGVkT3ZlcmxheUJhY2tkcm9wQ2xhc3M9XCJjZGstb3ZlcmxheS10cmFuc3BhcmVudC1iYWNrZHJvcFwiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5UGFuZWxDbGFzc109XCJfb3ZlcmxheVBhbmVsQ2xhc3NcIlxuICBbY2RrQ29ubmVjdGVkT3ZlcmxheVNjcm9sbFN0cmF0ZWd5XT1cIl9zY3JvbGxTdHJhdGVneVwiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5T3JpZ2luXT1cIm9yaWdpblwiXG4gIFtjZGtDb25uZWN0ZWRPdmVybGF5T3Blbl09XCJwYW5lbE9wZW5cIlxuICBbY2RrQ29ubmVjdGVkT3ZlcmxheVBvc2l0aW9uc109XCJfcG9zaXRpb25zXCJcbiAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlNaW5XaWR0aF09XCJfZ2V0T3ZlcmxheU1pbldpZHRoKClcIlxuICBbY2RrQ29ubmVjdGVkT3ZlcmxheU9mZnNldFldPVwiX29mZnNldFlcIlxuICAoYmFja2Ryb3BDbGljayk9XCJjbG9zZSgpXCJcbiAgKGF0dGFjaCk9XCJfb25BdHRhY2hlZCgpXCJcbiAgKGRldGFjaCk9XCJjbG9zZSgpXCI+XG4gIDxkaXYgY2xhc3M9XCJtYXQtc2VsZWN0LXBhbmVsLXdyYXBcIiBbQHRyYW5zZm9ybVBhbmVsV3JhcF0+XG4gICAgPGRpdlxuICAgICAgI3BhbmVsXG4gICAgICByb2xlPVwibGlzdGJveFwiXG4gICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgIGNsYXNzPVwibWF0LXNlbGVjdC1wYW5lbCB7eyBfZ2V0UGFuZWxUaGVtZSgpIH19XCJcbiAgICAgIFthdHRyLmlkXT1cImlkICsgJy1wYW5lbCdcIlxuICAgICAgW2F0dHIuYXJpYS1tdWx0aXNlbGVjdGFibGVdPVwibXVsdGlwbGVcIlxuICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWwgfHwgbnVsbFwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiX2dldFBhbmVsQXJpYUxhYmVsbGVkYnkoKVwiXG4gICAgICBbbmdDbGFzc109XCJwYW5lbENsYXNzXCJcbiAgICAgIFtAdHJhbnNmb3JtUGFuZWxdPVwibXVsdGlwbGUgPyAnc2hvd2luZy1tdWx0aXBsZScgOiAnc2hvd2luZydcIlxuICAgICAgKEB0cmFuc2Zvcm1QYW5lbC5kb25lKT1cIl9wYW5lbERvbmVBbmltYXRpbmdTdHJlYW0ubmV4dCgkZXZlbnQudG9TdGF0ZSlcIlxuICAgICAgW3N0eWxlLnRyYW5zZm9ybU9yaWdpbl09XCJfdHJhbnNmb3JtT3JpZ2luXCJcbiAgICAgIFtzdHlsZS5mb250LXNpemUucHhdPVwiX3RyaWdnZXJGb250U2l6ZVwiXG4gICAgICAoa2V5ZG93bik9XCJfaGFuZGxlS2V5ZG93bigkZXZlbnQpXCI+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9uZy10ZW1wbGF0ZT5cbiJdfQ==
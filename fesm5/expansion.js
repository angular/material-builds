import { CdkAccordionItem, CdkAccordion, CdkAccordionModule } from '@angular/cdk/accordion';
import { TemplatePortal, PortalModule } from '@angular/cdk/portal';
import { DOCUMENT, CommonModule } from '@angular/common';
import { InjectionToken, Directive, TemplateRef, EventEmitter, Component, ViewEncapsulation, ChangeDetectionStrategy, Optional, SkipSelf, Inject, ChangeDetectorRef, ViewContainerRef, Input, Output, ContentChild, ViewChild, Host, ElementRef, QueryList, ContentChildren, NgModule } from '@angular/core';
import { __extends } from 'tslib';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FocusMonitor, FocusKeyManager } from '@angular/cdk/a11y';
import { ENTER, hasModifierKey, SPACE, HOME, END } from '@angular/cdk/keycodes';
import { distinctUntilChanged, startWith, filter, take } from 'rxjs/operators';
import { Subject, Subscription, EMPTY, merge } from 'rxjs';
import { trigger, state, style, transition, animate, group, query, animateChild } from '@angular/animations';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Token used to provide a `MatAccordion` to `MatExpansionPanel`.
 * Used primarily to avoid circular imports between `MatAccordion` and `MatExpansionPanel`.
 */
var MAT_ACCORDION = new InjectionToken('MAT_ACCORDION');

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Time and timing curve for expansion panel animations. */
var EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';
/**
 * Animations used by the Material expansion panel.
 *
 * A bug in angular animation's `state` when ViewContainers are moved using ViewContainerRef.move()
 * causes the animation state of moved components to become `void` upon exit, and not update again
 * upon reentry into the DOM.  This can lead a to situation for the expansion panel where the state
 * of the panel is `expanded` or `collapsed` but the animation state is `void`.
 *
 * To correctly handle animating to the next state, we animate between `void` and `collapsed` which
 * are defined to have the same styles. Since angular animates from the current styles to the
 * destination state's style definition, in situations where we are moving from `void`'s styles to
 * `collapsed` this acts a noop since no style values change.
 *
 * In the case where angular's animation state is out of sync with the expansion panel's state, the
 * expansion panel being `expanded` and angular animations being `void`, the animation from the
 * `expanded`'s effective styles (though in a `void` animation state) to the collapsed state will
 * occur as expected.
 *
 * Angular Bug: https://github.com/angular/angular/issues/18847
 *
 * @docs-private
 */
var matExpansionAnimations = {
    /** Animation that rotates the indicator arrow. */
    indicatorRotate: trigger('indicatorRotate', [
        state('collapsed, void', style({ transform: 'rotate(0deg)' })),
        state('expanded', style({ transform: 'rotate(180deg)' })),
        transition('expanded <=> collapsed, void => collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ]),
    /** Animation that expands and collapses the panel header height. */
    expansionHeaderHeight: trigger('expansionHeight', [
        state('collapsed, void', style({
            height: '{{collapsedHeight}}',
        }), {
            params: { collapsedHeight: '48px' },
        }),
        state('expanded', style({
            height: '{{expandedHeight}}'
        }), {
            params: { expandedHeight: '64px' }
        }),
        transition('expanded <=> collapsed, void => collapsed', group([
            query('@indicatorRotate', animateChild(), { optional: true }),
            animate(EXPANSION_PANEL_ANIMATION_TIMING),
        ])),
    ]),
    /** Animation that expands and collapses the panel content. */
    bodyExpansion: trigger('bodyExpansion', [
        state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
        state('expanded', style({ height: '*', visibility: 'visible' })),
        transition('expanded <=> collapsed, void => collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ])
};

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Expansion panel content that will be rendered lazily
 * after the panel is opened for the first time.
 */
var MatExpansionPanelContent = /** @class */ (function () {
    function MatExpansionPanelContent(_template) {
        this._template = _template;
    }
    MatExpansionPanelContent.decorators = [
        { type: Directive, args: [{
                    selector: 'ng-template[matExpansionPanelContent]'
                },] }
    ];
    /** @nocollapse */
    MatExpansionPanelContent.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    return MatExpansionPanelContent;
}());

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Counter for generating unique element ids. */
var uniqueId = 0;
/**
 * Injection token that can be used to configure the defalt
 * options for the expansion panel component.
 */
var MAT_EXPANSION_PANEL_DEFAULT_OPTIONS = new InjectionToken('MAT_EXPANSION_PANEL_DEFAULT_OPTIONS');
var ɵ0 = undefined;
/**
 * `<mat-expansion-panel>`
 *
 * This component can be used as a single element to show expandable content, or as one of
 * multiple children of an element with the MatAccordion directive attached.
 */
var MatExpansionPanel = /** @class */ (function (_super) {
    __extends(MatExpansionPanel, _super);
    function MatExpansionPanel(accordion, _changeDetectorRef, _uniqueSelectionDispatcher, _viewContainerRef, _document, _animationMode, defaultOptions) {
        var _this = _super.call(this, accordion, _changeDetectorRef, _uniqueSelectionDispatcher) || this;
        _this._viewContainerRef = _viewContainerRef;
        _this._animationMode = _animationMode;
        _this._hideToggle = false;
        /** An event emitted after the body's expansion animation happens. */
        _this.afterExpand = new EventEmitter();
        /** An event emitted after the body's collapse animation happens. */
        _this.afterCollapse = new EventEmitter();
        /** Stream that emits for changes in `@Input` properties. */
        _this._inputChanges = new Subject();
        /** ID for the associated header element. Used for a11y labelling. */
        _this._headerId = "mat-expansion-panel-header-" + uniqueId++;
        /** Stream of body animation done events. */
        _this._bodyAnimationDone = new Subject();
        _this.accordion = accordion;
        _this._document = _document;
        // We need a Subject with distinctUntilChanged, because the `done` event
        // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
        _this._bodyAnimationDone.pipe(distinctUntilChanged(function (x, y) {
            return x.fromState === y.fromState && x.toState === y.toState;
        })).subscribe(function (event) {
            if (event.fromState !== 'void') {
                if (event.toState === 'expanded') {
                    _this.afterExpand.emit();
                }
                else if (event.toState === 'collapsed') {
                    _this.afterCollapse.emit();
                }
            }
        });
        if (defaultOptions) {
            _this.hideToggle = defaultOptions.hideToggle;
        }
        return _this;
    }
    Object.defineProperty(MatExpansionPanel.prototype, "hideToggle", {
        /** Whether the toggle indicator should be hidden. */
        get: function () {
            return this._hideToggle || (this.accordion && this.accordion.hideToggle);
        },
        set: function (value) {
            this._hideToggle = coerceBooleanProperty(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MatExpansionPanel.prototype, "togglePosition", {
        /** The position of the expansion indicator. */
        get: function () {
            return this._togglePosition || (this.accordion && this.accordion.togglePosition);
        },
        set: function (value) {
            this._togglePosition = value;
        },
        enumerable: true,
        configurable: true
    });
    /** Determines whether the expansion panel should have spacing between it and its siblings. */
    MatExpansionPanel.prototype._hasSpacing = function () {
        if (this.accordion) {
            return this.expanded && this.accordion.displayMode === 'default';
        }
        return false;
    };
    /** Gets the expanded state string. */
    MatExpansionPanel.prototype._getExpandedState = function () {
        return this.expanded ? 'expanded' : 'collapsed';
    };
    /** Toggles the expanded state of the expansion panel. */
    MatExpansionPanel.prototype.toggle = function () {
        this.expanded = !this.expanded;
    };
    /** Sets the expanded state of the expansion panel to false. */
    MatExpansionPanel.prototype.close = function () {
        this.expanded = false;
    };
    /** Sets the expanded state of the expansion panel to true. */
    MatExpansionPanel.prototype.open = function () {
        this.expanded = true;
    };
    MatExpansionPanel.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (this._lazyContent) {
            // Render the content as soon as the panel becomes open.
            this.opened.pipe(startWith(null), filter(function () { return _this.expanded && !_this._portal; }), take(1)).subscribe(function () {
                _this._portal = new TemplatePortal(_this._lazyContent._template, _this._viewContainerRef);
            });
        }
    };
    MatExpansionPanel.prototype.ngOnChanges = function (changes) {
        this._inputChanges.next(changes);
    };
    MatExpansionPanel.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this._bodyAnimationDone.complete();
        this._inputChanges.complete();
    };
    /** Checks whether the expansion panel's content contains the currently-focused element. */
    MatExpansionPanel.prototype._containsFocus = function () {
        if (this._body) {
            var focusedElement = this._document.activeElement;
            var bodyElement = this._body.nativeElement;
            return focusedElement === bodyElement || bodyElement.contains(focusedElement);
        }
        return false;
    };
    MatExpansionPanel.decorators = [
        { type: Component, args: [{
                    selector: 'mat-expansion-panel',
                    exportAs: 'matExpansionPanel',
                    template: "<ng-content select=\"mat-expansion-panel-header\"></ng-content>\n<div class=\"mat-expansion-panel-content\"\n     role=\"region\"\n     [@bodyExpansion]=\"_getExpandedState()\"\n     (@bodyExpansion.done)=\"_bodyAnimationDone.next($event)\"\n     [attr.aria-labelledby]=\"_headerId\"\n     [id]=\"id\"\n     #body>\n  <div class=\"mat-expansion-panel-body\">\n    <ng-content></ng-content>\n    <ng-template [cdkPortalOutlet]=\"_portal\"></ng-template>\n  </div>\n  <ng-content select=\"mat-action-row\"></ng-content>\n</div>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    inputs: ['disabled', 'expanded'],
                    outputs: ['opened', 'closed', 'expandedChange'],
                    animations: [matExpansionAnimations.bodyExpansion],
                    providers: [
                        // Provide MatAccordion as undefined to prevent nested expansion panels from registering
                        // to the same accordion.
                        { provide: MAT_ACCORDION, useValue: ɵ0 },
                    ],
                    host: {
                        'class': 'mat-expansion-panel',
                        '[class.mat-expanded]': 'expanded',
                        '[class._mat-animation-noopable]': '_animationMode === "NoopAnimations"',
                        '[class.mat-expansion-panel-spacing]': '_hasSpacing()',
                    },
                    styles: [".mat-expansion-panel{box-sizing:content-box;display:block;margin:0;border-radius:4px;overflow:hidden;transition:margin 225ms cubic-bezier(0.4, 0, 0.2, 1),box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);position:relative}.mat-accordion .mat-expansion-panel:not(.mat-expanded),.mat-accordion .mat-expansion-panel:not(.mat-expansion-panel-spacing){border-radius:0}.mat-accordion .mat-expansion-panel:first-of-type{border-top-right-radius:4px;border-top-left-radius:4px}.mat-accordion .mat-expansion-panel:last-of-type{border-bottom-right-radius:4px;border-bottom-left-radius:4px}.cdk-high-contrast-active .mat-expansion-panel{outline:solid 1px}.mat-expansion-panel.ng-animate-disabled,.ng-animate-disabled .mat-expansion-panel,.mat-expansion-panel._mat-animation-noopable{transition:none}.mat-expansion-panel-content{display:flex;flex-direction:column;overflow:visible}.mat-expansion-panel-body{padding:0 24px 16px}.mat-expansion-panel-spacing{margin:16px 0}.mat-accordion>.mat-expansion-panel-spacing:first-child,.mat-accordion>*:first-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-top:0}.mat-accordion>.mat-expansion-panel-spacing:last-child,.mat-accordion>*:last-child:not(.mat-expansion-panel) .mat-expansion-panel-spacing{margin-bottom:0}.mat-action-row{border-top-style:solid;border-top-width:1px;display:flex;flex-direction:row;justify-content:flex-end;padding:16px 8px 16px 24px}.mat-action-row button.mat-button-base,.mat-action-row button.mat-mdc-button-base{margin-left:8px}[dir=rtl] .mat-action-row button.mat-button-base,[dir=rtl] .mat-action-row button.mat-mdc-button-base{margin-left:0;margin-right:8px}\n"]
                }] }
    ];
    /** @nocollapse */
    MatExpansionPanel.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Optional }, { type: SkipSelf }, { type: Inject, args: [MAT_ACCORDION,] }] },
        { type: ChangeDetectorRef },
        { type: UniqueSelectionDispatcher },
        { type: ViewContainerRef },
        { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_EXPANSION_PANEL_DEFAULT_OPTIONS,] }, { type: Optional }] }
    ]; };
    MatExpansionPanel.propDecorators = {
        hideToggle: [{ type: Input }],
        togglePosition: [{ type: Input }],
        afterExpand: [{ type: Output }],
        afterCollapse: [{ type: Output }],
        _lazyContent: [{ type: ContentChild, args: [MatExpansionPanelContent,] }],
        _body: [{ type: ViewChild, args: ['body',] }]
    };
    return MatExpansionPanel;
}(CdkAccordionItem));
var MatExpansionPanelActionRow = /** @class */ (function () {
    function MatExpansionPanelActionRow() {
    }
    MatExpansionPanelActionRow.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-action-row',
                    host: {
                        class: 'mat-action-row'
                    }
                },] }
    ];
    return MatExpansionPanelActionRow;
}());

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * `<mat-expansion-panel-header>`
 *
 * This component corresponds to the header element of an `<mat-expansion-panel>`.
 */
var MatExpansionPanelHeader = /** @class */ (function () {
    function MatExpansionPanelHeader(panel, _element, _focusMonitor, _changeDetectorRef, defaultOptions) {
        var _this = this;
        this.panel = panel;
        this._element = _element;
        this._focusMonitor = _focusMonitor;
        this._changeDetectorRef = _changeDetectorRef;
        this._parentChangeSubscription = Subscription.EMPTY;
        /** Whether Angular animations in the panel header should be disabled. */
        this._animationsDisabled = true;
        var accordionHideToggleChange = panel.accordion ?
            panel.accordion._stateChanges.pipe(filter(function (changes) { return !!(changes['hideToggle'] || changes['togglePosition']); })) :
            EMPTY;
        // Since the toggle state depends on an @Input on the panel, we
        // need to subscribe and trigger change detection manually.
        this._parentChangeSubscription =
            merge(panel.opened, panel.closed, accordionHideToggleChange, panel._inputChanges.pipe(filter(function (changes) {
                return !!(changes['hideToggle'] ||
                    changes['disabled'] ||
                    changes['togglePosition']);
            })))
                .subscribe(function () { return _this._changeDetectorRef.markForCheck(); });
        // Avoids focus being lost if the panel contained the focused element and was closed.
        panel.closed
            .pipe(filter(function () { return panel._containsFocus(); }))
            .subscribe(function () { return _focusMonitor.focusVia(_element, 'program'); });
        _focusMonitor.monitor(_element).subscribe(function (origin) {
            if (origin && panel.accordion) {
                panel.accordion._handleHeaderFocus(_this);
            }
        });
        if (defaultOptions) {
            this.expandedHeight = defaultOptions.expandedHeight;
            this.collapsedHeight = defaultOptions.collapsedHeight;
        }
    }
    MatExpansionPanelHeader.prototype._animationStarted = function () {
        // Currently the `expansionHeight` animation has a `void => collapsed` transition which is
        // there to work around a bug in Angular (see #13088), however this introduces a different
        // issue. The new transition will cause the header to animate in on init (see #16067), if the
        // consumer has set a header height that is different from the default one. We work around it
        // by disabling animations on the header and re-enabling them after the first animation has run.
        // Note that Angular dispatches animation events even if animations are disabled. Ideally this
        // wouldn't be necessary if we remove the `void => collapsed` transition, but we have to wait
        // for https://github.com/angular/angular/issues/18847 to be resolved.
        this._animationsDisabled = false;
    };
    Object.defineProperty(MatExpansionPanelHeader.prototype, "disabled", {
        /**
         * Whether the associated panel is disabled. Implemented as a part of `FocusableOption`.
         * @docs-private
         */
        get: function () {
            return this.panel.disabled;
        },
        enumerable: true,
        configurable: true
    });
    /** Toggles the expanded state of the panel. */
    MatExpansionPanelHeader.prototype._toggle = function () {
        if (!this.disabled) {
            this.panel.toggle();
        }
    };
    /** Gets whether the panel is expanded. */
    MatExpansionPanelHeader.prototype._isExpanded = function () {
        return this.panel.expanded;
    };
    /** Gets the expanded state string of the panel. */
    MatExpansionPanelHeader.prototype._getExpandedState = function () {
        return this.panel._getExpandedState();
    };
    /** Gets the panel id. */
    MatExpansionPanelHeader.prototype._getPanelId = function () {
        return this.panel.id;
    };
    /** Gets the toggle position for the header. */
    MatExpansionPanelHeader.prototype._getTogglePosition = function () {
        return this.panel.togglePosition;
    };
    /** Gets whether the expand indicator should be shown. */
    MatExpansionPanelHeader.prototype._showToggle = function () {
        return !this.panel.hideToggle && !this.panel.disabled;
    };
    /** Handle keydown event calling to toggle() if appropriate. */
    MatExpansionPanelHeader.prototype._keydown = function (event) {
        switch (event.keyCode) {
            // Toggle for space and enter keys.
            case SPACE:
            case ENTER:
                if (!hasModifierKey(event)) {
                    event.preventDefault();
                    this._toggle();
                }
                break;
            default:
                if (this.panel.accordion) {
                    this.panel.accordion._handleHeaderKeydown(event);
                }
                return;
        }
    };
    /**
     * Focuses the panel header. Implemented as a part of `FocusableOption`.
     * @param origin Origin of the action that triggered the focus.
     * @docs-private
     */
    MatExpansionPanelHeader.prototype.focus = function (origin, options) {
        if (origin === void 0) { origin = 'program'; }
        this._focusMonitor.focusVia(this._element, origin, options);
    };
    MatExpansionPanelHeader.prototype.ngOnDestroy = function () {
        this._parentChangeSubscription.unsubscribe();
        this._focusMonitor.stopMonitoring(this._element);
    };
    MatExpansionPanelHeader.decorators = [
        { type: Component, args: [{
                    selector: 'mat-expansion-panel-header',
                    template: "<span class=\"mat-content\">\n  <ng-content select=\"mat-panel-title\"></ng-content>\n  <ng-content select=\"mat-panel-description\"></ng-content>\n  <ng-content></ng-content>\n</span>\n<span [@indicatorRotate]=\"_getExpandedState()\" *ngIf=\"_showToggle()\"\n      class=\"mat-expansion-indicator\"></span>\n",
                    encapsulation: ViewEncapsulation.None,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    animations: [
                        matExpansionAnimations.indicatorRotate,
                        matExpansionAnimations.expansionHeaderHeight
                    ],
                    host: {
                        'class': 'mat-expansion-panel-header mat-focus-indicator',
                        'role': 'button',
                        '[attr.id]': 'panel._headerId',
                        '[attr.tabindex]': 'disabled ? -1 : 0',
                        '[attr.aria-controls]': '_getPanelId()',
                        '[attr.aria-expanded]': '_isExpanded()',
                        '[attr.aria-disabled]': 'panel.disabled',
                        '[class.mat-expanded]': '_isExpanded()',
                        '[class.mat-expansion-toggle-indicator-after]': "_getTogglePosition() === 'after'",
                        '[class.mat-expansion-toggle-indicator-before]': "_getTogglePosition() === 'before'",
                        '(click)': '_toggle()',
                        '(keydown)': '_keydown($event)',
                        '[@.disabled]': '_animationsDisabled',
                        '(@expansionHeight.start)': '_animationStarted()',
                        '[@expansionHeight]': "{\n        value: _getExpandedState(),\n        params: {\n          collapsedHeight: collapsedHeight,\n          expandedHeight: expandedHeight\n        }\n    }",
                    },
                    styles: [".mat-expansion-panel-header{display:flex;flex-direction:row;align-items:center;padding:0 24px;border-radius:inherit;position:relative}.mat-expansion-panel-header:focus,.mat-expansion-panel-header:hover{outline:none}.mat-expansion-panel-header.mat-expanded:focus,.mat-expansion-panel-header.mat-expanded:hover{background:inherit}.mat-expansion-panel-header:not([aria-disabled=true]){cursor:pointer}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before{flex-direction:row-reverse}.mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 16px 0 0}[dir=rtl] .mat-expansion-panel-header.mat-expansion-toggle-indicator-before .mat-expansion-indicator{margin:0 0 0 16px}.mat-content{display:flex;flex:1;flex-direction:row;overflow:hidden}.mat-expansion-panel-header-title,.mat-expansion-panel-header-description{display:flex;flex-grow:1;margin-right:16px}[dir=rtl] .mat-expansion-panel-header-title,[dir=rtl] .mat-expansion-panel-header-description{margin-right:0;margin-left:16px}.mat-expansion-panel-header-description{flex-grow:2}.mat-expansion-indicator::after{border-style:solid;border-width:0 2px 2px 0;content:\"\";display:inline-block;padding:3px;transform:rotate(45deg);vertical-align:middle}\n"]
                }] }
    ];
    /** @nocollapse */
    MatExpansionPanelHeader.ctorParameters = function () { return [
        { type: MatExpansionPanel, decorators: [{ type: Host }] },
        { type: ElementRef },
        { type: FocusMonitor },
        { type: ChangeDetectorRef },
        { type: undefined, decorators: [{ type: Inject, args: [MAT_EXPANSION_PANEL_DEFAULT_OPTIONS,] }, { type: Optional }] }
    ]; };
    MatExpansionPanelHeader.propDecorators = {
        expandedHeight: [{ type: Input }],
        collapsedHeight: [{ type: Input }]
    };
    return MatExpansionPanelHeader;
}());
/**
 * `<mat-panel-description>`
 *
 * This directive is to be used inside of the MatExpansionPanelHeader component.
 */
var MatExpansionPanelDescription = /** @class */ (function () {
    function MatExpansionPanelDescription() {
    }
    MatExpansionPanelDescription.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-panel-description',
                    host: {
                        class: 'mat-expansion-panel-header-description'
                    }
                },] }
    ];
    return MatExpansionPanelDescription;
}());
/**
 * `<mat-panel-title>`
 *
 * This directive is to be used inside of the MatExpansionPanelHeader component.
 */
var MatExpansionPanelTitle = /** @class */ (function () {
    function MatExpansionPanelTitle() {
    }
    MatExpansionPanelTitle.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-panel-title',
                    host: {
                        class: 'mat-expansion-panel-header-title'
                    }
                },] }
    ];
    return MatExpansionPanelTitle;
}());

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Directive for a Material Design Accordion.
 */
var MatAccordion = /** @class */ (function (_super) {
    __extends(MatAccordion, _super);
    function MatAccordion() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Headers belonging to this accordion. */
        _this._ownHeaders = new QueryList();
        _this._hideToggle = false;
        /**
         * Display mode used for all expansion panels in the accordion. Currently two display
         * modes exist:
         *  default - a gutter-like spacing is placed around any expanded panel, placing the expanded
         *     panel at a different elevation from the rest of the accordion.
         *  flat - no spacing is placed around expanded panels, showing all panels at the same
         *     elevation.
         */
        _this.displayMode = 'default';
        /** The position of the expansion indicator. */
        _this.togglePosition = 'after';
        return _this;
    }
    Object.defineProperty(MatAccordion.prototype, "hideToggle", {
        /** Whether the expansion indicator should be hidden. */
        get: function () { return this._hideToggle; },
        set: function (show) { this._hideToggle = coerceBooleanProperty(show); },
        enumerable: true,
        configurable: true
    });
    MatAccordion.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._headers.changes
            .pipe(startWith(this._headers))
            .subscribe(function (headers) {
            _this._ownHeaders.reset(headers.filter(function (header) { return header.panel.accordion === _this; }));
            _this._ownHeaders.notifyOnChanges();
        });
        this._keyManager = new FocusKeyManager(this._ownHeaders).withWrap();
    };
    /** Handles keyboard events coming in from the panel headers. */
    MatAccordion.prototype._handleHeaderKeydown = function (event) {
        var keyCode = event.keyCode;
        var manager = this._keyManager;
        if (keyCode === HOME) {
            if (!hasModifierKey(event)) {
                manager.setFirstItemActive();
                event.preventDefault();
            }
        }
        else if (keyCode === END) {
            if (!hasModifierKey(event)) {
                manager.setLastItemActive();
                event.preventDefault();
            }
        }
        else {
            this._keyManager.onKeydown(event);
        }
    };
    MatAccordion.prototype._handleHeaderFocus = function (header) {
        this._keyManager.updateActiveItem(header);
    };
    MatAccordion.decorators = [
        { type: Directive, args: [{
                    selector: 'mat-accordion',
                    exportAs: 'matAccordion',
                    inputs: ['multi'],
                    providers: [{
                            provide: MAT_ACCORDION,
                            useExisting: MatAccordion
                        }],
                    host: {
                        class: 'mat-accordion',
                        // Class binding which is only used by the test harness as there is no other
                        // way for the harness to detect if multiple panel support is enabled.
                        '[class.mat-accordion-multi]': 'this.multi',
                    }
                },] }
    ];
    MatAccordion.propDecorators = {
        _headers: [{ type: ContentChildren, args: [MatExpansionPanelHeader, { descendants: true },] }],
        hideToggle: [{ type: Input }],
        displayMode: [{ type: Input }],
        togglePosition: [{ type: Input }]
    };
    return MatAccordion;
}(CdkAccordion));

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var MatExpansionModule = /** @class */ (function () {
    function MatExpansionModule() {
    }
    MatExpansionModule.decorators = [
        { type: NgModule, args: [{
                    imports: [CommonModule, CdkAccordionModule, PortalModule],
                    exports: [
                        MatAccordion,
                        MatExpansionPanel,
                        MatExpansionPanelActionRow,
                        MatExpansionPanelHeader,
                        MatExpansionPanelTitle,
                        MatExpansionPanelDescription,
                        MatExpansionPanelContent,
                    ],
                    declarations: [
                        MatAccordion,
                        MatExpansionPanel,
                        MatExpansionPanelActionRow,
                        MatExpansionPanelHeader,
                        MatExpansionPanelTitle,
                        MatExpansionPanelDescription,
                        MatExpansionPanelContent,
                    ],
                },] }
    ];
    return MatExpansionModule;
}());

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */

export { EXPANSION_PANEL_ANIMATION_TIMING, MAT_ACCORDION, MAT_EXPANSION_PANEL_DEFAULT_OPTIONS, MatAccordion, MatExpansionModule, MatExpansionPanel, MatExpansionPanelActionRow, MatExpansionPanelContent, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle, matExpansionAnimations, ɵ0 };
//# sourceMappingURL=expansion.js.map

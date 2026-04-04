import * as i0 from '@angular/core';
import { InjectionToken, inject, ElementRef, Directive, signal, NgZone, Injector, Input, ContentChildren, ChangeDetectionStrategy, ViewEncapsulation, Component, ViewChild, ChangeDetectorRef, EventEmitter, Output, forwardRef, Renderer2, NgModule } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { Platform, _getFocusedElementPierceShadowDom } from '@angular/cdk/platform';
import { _CdkPrivateStyleLoader } from '@angular/cdk/private';
import { Subscription, merge, Subject } from 'rxjs';
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleRenderer } from './_ripple-chunk.mjs';
import { _animationsDisabled } from './_animation-chunk.mjs';
import { _StructuralStylesLoader } from './_structural-styles-chunk.mjs';
import { CdkObserveContent, ObserversModule } from '@angular/cdk/observers';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { ENTER, SPACE, A, hasModifierKey } from '@angular/cdk/keycodes';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { NgTemplateOutlet } from '@angular/common';
import { MatDividerModule } from './divider.mjs';
export { MatDivider } from './divider.mjs';
import { BidiModule } from '@angular/cdk/bidi';
import { MatPseudoCheckboxModule } from './_pseudo-checkbox-module-chunk.mjs';
import { MatRippleModule } from './_ripple-module-chunk.mjs';
import '@angular/cdk/layout';
import './_pseudo-checkbox-chunk.mjs';

const LIST_OPTION = new InjectionToken('ListOption');

class MatListItemTitle {
  _elementRef = inject(ElementRef);
  constructor() {}
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatListItemTitle,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatListItemTitle,
    isStandalone: true,
    selector: "[matListItemTitle]",
    host: {
      classAttribute: "mat-mdc-list-item-title mdc-list-item__primary-text"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatListItemTitle,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matListItemTitle]',
      host: {
        'class': 'mat-mdc-list-item-title mdc-list-item__primary-text'
      }
    }]
  }],
  ctorParameters: () => []
});
class MatListItemLine {
  _elementRef = inject(ElementRef);
  constructor() {}
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatListItemLine,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatListItemLine,
    isStandalone: true,
    selector: "[matListItemLine]",
    host: {
      classAttribute: "mat-mdc-list-item-line mdc-list-item__secondary-text"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatListItemLine,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matListItemLine]',
      host: {
        'class': 'mat-mdc-list-item-line mdc-list-item__secondary-text'
      }
    }]
  }],
  ctorParameters: () => []
});
class MatListItemMeta {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatListItemMeta,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatListItemMeta,
    isStandalone: true,
    selector: "[matListItemMeta]",
    host: {
      classAttribute: "mat-mdc-list-item-meta mdc-list-item__end"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatListItemMeta,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matListItemMeta]',
      host: {
        'class': 'mat-mdc-list-item-meta mdc-list-item__end'
      }
    }]
  }]
});
class _MatListItemGraphicBase {
  _listOption = inject(LIST_OPTION, {
    optional: true
  });
  constructor() {}
  _isAlignedAtStart() {
    return !this._listOption || this._listOption?._getTogglePosition() === 'after';
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: _MatListItemGraphicBase,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: _MatListItemGraphicBase,
    isStandalone: true,
    host: {
      properties: {
        "class.mdc-list-item__start": "_isAlignedAtStart()",
        "class.mdc-list-item__end": "!_isAlignedAtStart()"
      }
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: _MatListItemGraphicBase,
  decorators: [{
    type: Directive,
    args: [{
      host: {
        '[class.mdc-list-item__start]': '_isAlignedAtStart()',
        '[class.mdc-list-item__end]': '!_isAlignedAtStart()'
      }
    }]
  }],
  ctorParameters: () => []
});
class MatListItemAvatar extends _MatListItemGraphicBase {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatListItemAvatar,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatListItemAvatar,
    isStandalone: true,
    selector: "[matListItemAvatar]",
    host: {
      classAttribute: "mat-mdc-list-item-avatar"
    },
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatListItemAvatar,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matListItemAvatar]',
      host: {
        'class': 'mat-mdc-list-item-avatar'
      }
    }]
  }]
});
class MatListItemIcon extends _MatListItemGraphicBase {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatListItemIcon,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatListItemIcon,
    isStandalone: true,
    selector: "[matListItemIcon]",
    host: {
      classAttribute: "mat-mdc-list-item-icon"
    },
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatListItemIcon,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matListItemIcon]',
      host: {
        'class': 'mat-mdc-list-item-icon'
      }
    }]
  }]
});

const MAT_LIST_CONFIG = new InjectionToken('MAT_LIST_CONFIG');

class MatListBase {
  _isNonInteractive = true;
  get disableRipple() {
    return this._disableRipple;
  }
  set disableRipple(value) {
    this._disableRipple = coerceBooleanProperty(value);
  }
  _disableRipple = false;
  get disabled() {
    return this._disabled();
  }
  set disabled(value) {
    this._disabled.set(coerceBooleanProperty(value));
  }
  _disabled = signal(false, ...(ngDevMode ? [{
    debugName: "_disabled"
  }] : []));
  _defaultOptions = inject(MAT_LIST_CONFIG, {
    optional: true
  });
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatListBase,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatListBase,
    isStandalone: true,
    inputs: {
      disableRipple: "disableRipple",
      disabled: "disabled"
    },
    host: {
      properties: {
        "attr.aria-disabled": "disabled"
      }
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatListBase,
  decorators: [{
    type: Directive,
    args: [{
      host: {
        '[attr.aria-disabled]': 'disabled'
      }
    }]
  }],
  propDecorators: {
    disableRipple: [{
      type: Input
    }],
    disabled: [{
      type: Input
    }]
  }
});
class MatListItemBase {
  _elementRef = inject(ElementRef);
  _ngZone = inject(NgZone);
  _listBase = inject(MatListBase, {
    optional: true
  });
  _platform = inject(Platform);
  _hostElement;
  _isButtonElement;
  _noopAnimations = _animationsDisabled();
  _avatars;
  _icons;
  set lines(lines) {
    this._explicitLines = coerceNumberProperty(lines, null);
    this._updateItemLines(false);
  }
  _explicitLines = null;
  get disableRipple() {
    return this.disabled || this._disableRipple || this._noopAnimations || !!this._listBase?.disableRipple;
  }
  set disableRipple(value) {
    this._disableRipple = coerceBooleanProperty(value);
  }
  _disableRipple = false;
  get disabled() {
    return this._disabled() || !!this._listBase?.disabled;
  }
  set disabled(value) {
    this._disabled.set(coerceBooleanProperty(value));
  }
  _disabled = signal(false, ...(ngDevMode ? [{
    debugName: "_disabled"
  }] : []));
  _subscriptions = new Subscription();
  _rippleRenderer = null;
  _hasUnscopedTextContent = false;
  rippleConfig;
  get rippleDisabled() {
    return this.disableRipple || !!this.rippleConfig.disabled;
  }
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
    const globalRippleOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, {
      optional: true
    });
    this.rippleConfig = globalRippleOptions || {};
    this._hostElement = this._elementRef.nativeElement;
    this._isButtonElement = this._hostElement.nodeName.toLowerCase() === 'button';
    if (this._listBase && !this._listBase._isNonInteractive) {
      this._initInteractiveListItem();
    }
    if (this._isButtonElement && !this._hostElement.hasAttribute('type')) {
      this._hostElement.setAttribute('type', 'button');
    }
  }
  ngAfterViewInit() {
    this._monitorProjectedLinesAndTitle();
    this._updateItemLines(true);
  }
  ngOnDestroy() {
    this._subscriptions.unsubscribe();
    if (this._rippleRenderer !== null) {
      this._rippleRenderer._removeTriggerEvents();
    }
  }
  _hasIconOrAvatar() {
    return !!(this._avatars.length || this._icons.length);
  }
  _initInteractiveListItem() {
    this._hostElement.classList.add('mat-mdc-list-item-interactive');
    this._rippleRenderer = new RippleRenderer(this, this._ngZone, this._hostElement, this._platform, inject(Injector));
    this._rippleRenderer.setupTriggerEvents(this._hostElement);
  }
  _monitorProjectedLinesAndTitle() {
    this._ngZone.runOutsideAngular(() => {
      this._subscriptions.add(merge(this._lines.changes, this._titles.changes).subscribe(() => this._updateItemLines(false)));
    });
  }
  _updateItemLines(recheckUnscopedContent) {
    if (!this._lines || !this._titles || !this._unscopedContent) {
      return;
    }
    if (recheckUnscopedContent) {
      this._checkDomForUnscopedTextContent();
    }
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      sanityCheckListItemContent(this);
    }
    const numberOfLines = this._explicitLines ?? this._inferLinesFromContent();
    const unscopedContentEl = this._unscopedContent.nativeElement;
    this._hostElement.classList.toggle('mat-mdc-list-item-single-line', numberOfLines <= 1);
    this._hostElement.classList.toggle('mdc-list-item--with-one-line', numberOfLines <= 1);
    this._hostElement.classList.toggle('mdc-list-item--with-two-lines', numberOfLines === 2);
    this._hostElement.classList.toggle('mdc-list-item--with-three-lines', numberOfLines === 3);
    if (this._hasUnscopedTextContent) {
      const treatAsTitle = this._titles.length === 0 && numberOfLines === 1;
      unscopedContentEl.classList.toggle('mdc-list-item__primary-text', treatAsTitle);
      unscopedContentEl.classList.toggle('mdc-list-item__secondary-text', !treatAsTitle);
    } else {
      unscopedContentEl.classList.remove('mdc-list-item__primary-text');
      unscopedContentEl.classList.remove('mdc-list-item__secondary-text');
    }
  }
  _inferLinesFromContent() {
    let numOfLines = this._titles.length + this._lines.length;
    if (this._hasUnscopedTextContent) {
      numOfLines += 1;
    }
    return numOfLines;
  }
  _checkDomForUnscopedTextContent() {
    this._hasUnscopedTextContent = Array.from(this._unscopedContent.nativeElement.childNodes).filter(node => node.nodeType !== node.COMMENT_NODE).some(node => !!(node.textContent && node.textContent.trim()));
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatListItemBase,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatListItemBase,
    isStandalone: true,
    inputs: {
      lines: "lines",
      disableRipple: "disableRipple",
      disabled: "disabled"
    },
    host: {
      properties: {
        "class.mdc-list-item--disabled": "disabled",
        "attr.aria-disabled": "disabled",
        "attr.disabled": "(_isButtonElement && disabled) || null"
      }
    },
    queries: [{
      propertyName: "_avatars",
      predicate: MatListItemAvatar
    }, {
      propertyName: "_icons",
      predicate: MatListItemIcon
    }],
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatListItemBase,
  decorators: [{
    type: Directive,
    args: [{
      host: {
        '[class.mdc-list-item--disabled]': 'disabled',
        '[attr.aria-disabled]': 'disabled',
        '[attr.disabled]': '(_isButtonElement && disabled) || null'
      }
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    _avatars: [{
      type: ContentChildren,
      args: [MatListItemAvatar, {
        descendants: false
      }]
    }],
    _icons: [{
      type: ContentChildren,
      args: [MatListItemIcon, {
        descendants: false
      }]
    }],
    lines: [{
      type: Input
    }],
    disableRipple: [{
      type: Input
    }],
    disabled: [{
      type: Input
    }]
  }
});
function sanityCheckListItemContent(item) {
  const numTitles = item._titles.length;
  const numLines = item._lines.length;
  if (numTitles > 1) {
    console.warn('A list item cannot have multiple titles.');
  }
  if (numTitles === 0 && numLines > 0) {
    console.warn('A list item line can only be used if there is a list item title.');
  }
  if (numTitles === 0 && item._hasUnscopedTextContent && item._explicitLines !== null && item._explicitLines > 1) {
    console.warn('A list item cannot have wrapping content without a title.');
  }
  if (numLines > 2 || numLines === 2 && item._hasUnscopedTextContent) {
    console.warn('A list item can have at maximum three lines.');
  }
}

class MatActionList extends MatListBase {
  _isNonInteractive = false;
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatActionList,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatActionList,
    isStandalone: true,
    selector: "mat-action-list",
    host: {
      attributes: {
        "role": "group"
      },
      classAttribute: "mat-mdc-action-list mat-mdc-list-base mdc-list"
    },
    providers: [{
      provide: MatListBase,
      useExisting: MatActionList
    }],
    exportAs: ["matActionList"],
    usesInheritance: true,
    ngImport: i0,
    template: '<ng-content></ng-content>',
    isInline: true,
    styles: [".mdc-list {\n  margin: 0;\n  padding: 8px 0;\n  list-style-type: none;\n}\n.mdc-list:focus {\n  outline: none;\n}\n\n.mdc-list-item {\n  display: flex;\n  position: relative;\n  justify-content: flex-start;\n  overflow: hidden;\n  padding: 0;\n  align-items: stretch;\n  cursor: pointer;\n  padding-left: 16px;\n  padding-right: 16px;\n  background-color: var(--mat-list-list-item-container-color, transparent);\n  border-radius: var(--mat-list-list-item-container-shape, var(--mat-sys-corner-none));\n}\n.mdc-list-item.mdc-list-item--selected {\n  background-color: var(--mat-list-list-item-selected-container-color);\n}\n.mdc-list-item:focus {\n  outline: 0;\n}\n.mdc-list-item.mdc-list-item--disabled {\n  cursor: auto;\n}\n.mdc-list-item.mdc-list-item--with-one-line {\n  height: var(--mat-list-list-item-one-line-container-height, 48px);\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__start {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-two-lines {\n  height: var(--mat-list-list-item-two-line-container-height, 64px);\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-three-lines {\n  height: var(--mat-list-list-item-three-line-container-height, 88px);\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--selected::before, .mdc-list-item.mdc-list-item--selected:focus::before, .mdc-list-item:not(.mdc-list-item--selected):focus::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  content: \"\";\n  pointer-events: none;\n}\n\na.mdc-list-item {\n  color: inherit;\n  text-decoration: none;\n}\n\n.mdc-list-item__start {\n  fill: currentColor;\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-leading-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-leading-icon-size, 24px);\n  height: var(--mat-list-list-item-leading-icon-size, 24px);\n  margin-left: 16px;\n  margin-right: 32px;\n}\n[dir=rtl] .mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-left: 32px;\n  margin-right: 16px;\n}\n.mdc-list-item--with-leading-icon:hover .mdc-list-item__start {\n  color: var(--mat-list-list-item-hover-leading-icon-color);\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  width: var(--mat-list-list-item-leading-avatar-size, 40px);\n  height: var(--mat-list-list-item-leading-avatar-size, 40px);\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start, [dir=rtl] .mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n\n.mdc-list-item__end {\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  font-family: var(--mat-list-list-item-trailing-supporting-text-font, var(--mat-sys-label-small-font));\n  line-height: var(--mat-list-list-item-trailing-supporting-text-line-height, var(--mat-sys-label-small-line-height));\n  font-size: var(--mat-list-list-item-trailing-supporting-text-size, var(--mat-sys-label-small-size));\n  font-weight: var(--mat-list-list-item-trailing-supporting-text-weight, var(--mat-sys-label-small-weight));\n  letter-spacing: var(--mat-list-list-item-trailing-supporting-text-tracking, var(--mat-sys-label-small-tracking));\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-trailing-icon-size, 24px);\n  height: var(--mat-list-list-item-trailing-icon-size, 24px);\n}\n.mdc-list-item--with-trailing-icon:hover .mdc-list-item__end {\n  color: var(--mat-list-list-item-hover-trailing-icon-color);\n}\n.mdc-list-item.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-supporting-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-list-item--selected.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-selected-trailing-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-list-item__content {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  align-self: center;\n  flex: 1;\n  pointer-events: none;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__content, .mdc-list-item--with-three-lines .mdc-list-item__content {\n  align-self: stretch;\n}\n\n.mdc-list-item__primary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  color: var(--mat-list-list-item-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-list-list-item-label-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-list-list-item-label-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-list-list-item-label-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-list-list-item-label-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-list-list-item-label-text-tracking, var(--mat-sys-body-large-tracking));\n}\n.mdc-list-item:hover .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-hover-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item:focus .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-focus-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text, .mdc-list-item--with-three-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n\n.mdc-list-item__secondary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  display: block;\n  margin-top: 0;\n  color: var(--mat-list-list-item-supporting-text-color, var(--mat-sys-on-surface-variant));\n  font-family: var(--mat-list-list-item-supporting-text-font, var(--mat-sys-body-medium-font));\n  line-height: var(--mat-list-list-item-supporting-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-list-list-item-supporting-text-size, var(--mat-sys-body-medium-size));\n  font-weight: var(--mat-list-list-item-supporting-text-weight, var(--mat-sys-body-medium-weight));\n  letter-spacing: var(--mat-list-list-item-supporting-text-tracking, var(--mat-sys-body-medium-tracking));\n}\n.mdc-list-item__secondary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-three-lines .mdc-list-item__secondary-text {\n  white-space: normal;\n  line-height: 20px;\n}\n.mdc-list-item--with-overline .mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: auto;\n}\n\n.mdc-list-item--with-leading-radio.mdc-list-item,\n.mdc-list-item--with-leading-checkbox.mdc-list-item,\n.mdc-list-item--with-leading-icon.mdc-list-item,\n.mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-checkbox.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-icon.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-trailing-icon.mdc-list-item, [dir=rtl] .mdc-list-item--with-trailing-icon.mdc-list-item {\n  padding-left: 0;\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 16px;\n}\n\n.mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  -webkit-user-select: none;\n  user-select: none;\n  margin-left: 28px;\n  margin-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 28px;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end {\n  display: block;\n  line-height: normal;\n  align-self: flex-start;\n  margin-top: 0;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end::before, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-leading-radio .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio .mdc-list-item__start,\n[dir=rtl] .mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-item--with-trailing-radio.mdc-list-item,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-left: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, [dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-radio .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio .mdc-list-item__end,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-three-lines .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-group__subheader {\n  margin: 0.75rem 16px;\n}\n\n.mdc-list-item--disabled .mdc-list-item__start,\n.mdc-list-item--disabled .mdc-list-item__content,\n.mdc-list-item--disabled .mdc-list-item__end {\n  opacity: 1;\n}\n.mdc-list-item--disabled .mdc-list-item__primary-text,\n.mdc-list-item--disabled .mdc-list-item__secondary-text {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n.mdc-list-item--disabled.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-disabled-leading-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-leading-icon-opacity, 0.38);\n}\n.mdc-list-item--disabled.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-disabled-trailing-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-trailing-icon-opacity, 0.38);\n}\n\n.mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing, [dir=rtl] .mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.mdc-list-item.mdc-list-item--disabled .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-disabled-label-text-color, var(--mat-sys-on-surface));\n}\n\n.mdc-list-item:hover::before {\n  background-color: var(--mat-list-list-item-hover-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n\n.mdc-list-item.mdc-list-item--disabled::before {\n  background-color: var(--mat-list-list-item-disabled-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item:focus::before {\n  background-color: var(--mat-list-list-item-focus-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item--disabled .mdc-radio,\n.mdc-list-item--disabled .mdc-checkbox {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n\n.mdc-list-item--with-leading-avatar .mat-mdc-list-item-avatar {\n  border-radius: var(--mat-list-list-item-leading-avatar-shape, var(--mat-sys-corner-full));\n  background-color: var(--mat-list-list-item-leading-avatar-color, var(--mat-sys-primary-container));\n}\n\n.mat-mdc-list-item-icon {\n  font-size: var(--mat-list-list-item-leading-icon-size, 24px);\n}\n\n@media (forced-colors: active) {\n  a.mdc-list-item--activated::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  a.mdc-list-item--activated [dir=rtl]::after {\n    right: auto;\n    left: 16px;\n  }\n}\n\n.mat-mdc-list-base {\n  display: block;\n}\n.mat-mdc-list-base .mdc-list-item__start,\n.mat-mdc-list-base .mdc-list-item__end,\n.mat-mdc-list-base .mdc-list-item__content {\n  pointer-events: auto;\n}\n\n.mat-mdc-list-item,\n.mat-mdc-list-option {\n  width: 100%;\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-list-item:not(.mat-mdc-list-item-interactive),\n.mat-mdc-list-option:not(.mat-mdc-list-item-interactive) {\n  cursor: default;\n}\n.mat-mdc-list-item .mat-divider-inset,\n.mat-mdc-list-option .mat-divider-inset {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n.mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-left: 72px;\n}\n[dir=rtl] .mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n[dir=rtl] .mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-right: 72px;\n}\n\n.mat-mdc-list-item-interactive::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  content: \"\";\n  opacity: 0;\n  pointer-events: none;\n  border-radius: inherit;\n}\n\n.mat-mdc-list-item > .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n.mat-mdc-list-item:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n}\n\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-line.mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: normal;\n}\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-unscoped-content.mdc-list-item__secondary-text {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n\nmat-action-list button {\n  background: none;\n  color: inherit;\n  border: none;\n  font: inherit;\n  outline: inherit;\n  -webkit-tap-highlight-color: transparent;\n  text-align: start;\n}\nmat-action-list button::-moz-focus-inner {\n  border: 0;\n}\n\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-inline-start: var(--mat-list-list-item-leading-icon-start-space, 16px);\n  margin-inline-end: var(--mat-list-list-item-leading-icon-end-space, 16px);\n}\n\n.mat-mdc-nav-list .mat-mdc-list-item {\n  border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n  --mat-focus-indicator-border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-nav-list .mat-mdc-list-item.mdc-list-item--activated {\n  background-color: var(--mat-list-active-indicator-color, var(--mat-sys-secondary-container));\n}\n"],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatActionList,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-action-list',
      exportAs: 'matActionList',
      template: '<ng-content></ng-content>',
      host: {
        'class': 'mat-mdc-action-list mat-mdc-list-base mdc-list',
        'role': 'group'
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [{
        provide: MatListBase,
        useExisting: MatActionList
      }],
      styles: [".mdc-list {\n  margin: 0;\n  padding: 8px 0;\n  list-style-type: none;\n}\n.mdc-list:focus {\n  outline: none;\n}\n\n.mdc-list-item {\n  display: flex;\n  position: relative;\n  justify-content: flex-start;\n  overflow: hidden;\n  padding: 0;\n  align-items: stretch;\n  cursor: pointer;\n  padding-left: 16px;\n  padding-right: 16px;\n  background-color: var(--mat-list-list-item-container-color, transparent);\n  border-radius: var(--mat-list-list-item-container-shape, var(--mat-sys-corner-none));\n}\n.mdc-list-item.mdc-list-item--selected {\n  background-color: var(--mat-list-list-item-selected-container-color);\n}\n.mdc-list-item:focus {\n  outline: 0;\n}\n.mdc-list-item.mdc-list-item--disabled {\n  cursor: auto;\n}\n.mdc-list-item.mdc-list-item--with-one-line {\n  height: var(--mat-list-list-item-one-line-container-height, 48px);\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__start {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-two-lines {\n  height: var(--mat-list-list-item-two-line-container-height, 64px);\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-three-lines {\n  height: var(--mat-list-list-item-three-line-container-height, 88px);\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--selected::before, .mdc-list-item.mdc-list-item--selected:focus::before, .mdc-list-item:not(.mdc-list-item--selected):focus::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  content: \"\";\n  pointer-events: none;\n}\n\na.mdc-list-item {\n  color: inherit;\n  text-decoration: none;\n}\n\n.mdc-list-item__start {\n  fill: currentColor;\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-leading-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-leading-icon-size, 24px);\n  height: var(--mat-list-list-item-leading-icon-size, 24px);\n  margin-left: 16px;\n  margin-right: 32px;\n}\n[dir=rtl] .mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-left: 32px;\n  margin-right: 16px;\n}\n.mdc-list-item--with-leading-icon:hover .mdc-list-item__start {\n  color: var(--mat-list-list-item-hover-leading-icon-color);\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  width: var(--mat-list-list-item-leading-avatar-size, 40px);\n  height: var(--mat-list-list-item-leading-avatar-size, 40px);\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start, [dir=rtl] .mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n\n.mdc-list-item__end {\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  font-family: var(--mat-list-list-item-trailing-supporting-text-font, var(--mat-sys-label-small-font));\n  line-height: var(--mat-list-list-item-trailing-supporting-text-line-height, var(--mat-sys-label-small-line-height));\n  font-size: var(--mat-list-list-item-trailing-supporting-text-size, var(--mat-sys-label-small-size));\n  font-weight: var(--mat-list-list-item-trailing-supporting-text-weight, var(--mat-sys-label-small-weight));\n  letter-spacing: var(--mat-list-list-item-trailing-supporting-text-tracking, var(--mat-sys-label-small-tracking));\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-trailing-icon-size, 24px);\n  height: var(--mat-list-list-item-trailing-icon-size, 24px);\n}\n.mdc-list-item--with-trailing-icon:hover .mdc-list-item__end {\n  color: var(--mat-list-list-item-hover-trailing-icon-color);\n}\n.mdc-list-item.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-supporting-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-list-item--selected.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-selected-trailing-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-list-item__content {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  align-self: center;\n  flex: 1;\n  pointer-events: none;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__content, .mdc-list-item--with-three-lines .mdc-list-item__content {\n  align-self: stretch;\n}\n\n.mdc-list-item__primary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  color: var(--mat-list-list-item-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-list-list-item-label-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-list-list-item-label-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-list-list-item-label-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-list-list-item-label-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-list-list-item-label-text-tracking, var(--mat-sys-body-large-tracking));\n}\n.mdc-list-item:hover .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-hover-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item:focus .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-focus-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text, .mdc-list-item--with-three-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n\n.mdc-list-item__secondary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  display: block;\n  margin-top: 0;\n  color: var(--mat-list-list-item-supporting-text-color, var(--mat-sys-on-surface-variant));\n  font-family: var(--mat-list-list-item-supporting-text-font, var(--mat-sys-body-medium-font));\n  line-height: var(--mat-list-list-item-supporting-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-list-list-item-supporting-text-size, var(--mat-sys-body-medium-size));\n  font-weight: var(--mat-list-list-item-supporting-text-weight, var(--mat-sys-body-medium-weight));\n  letter-spacing: var(--mat-list-list-item-supporting-text-tracking, var(--mat-sys-body-medium-tracking));\n}\n.mdc-list-item__secondary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-three-lines .mdc-list-item__secondary-text {\n  white-space: normal;\n  line-height: 20px;\n}\n.mdc-list-item--with-overline .mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: auto;\n}\n\n.mdc-list-item--with-leading-radio.mdc-list-item,\n.mdc-list-item--with-leading-checkbox.mdc-list-item,\n.mdc-list-item--with-leading-icon.mdc-list-item,\n.mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-checkbox.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-icon.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-trailing-icon.mdc-list-item, [dir=rtl] .mdc-list-item--with-trailing-icon.mdc-list-item {\n  padding-left: 0;\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 16px;\n}\n\n.mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  -webkit-user-select: none;\n  user-select: none;\n  margin-left: 28px;\n  margin-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 28px;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end {\n  display: block;\n  line-height: normal;\n  align-self: flex-start;\n  margin-top: 0;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end::before, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-leading-radio .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio .mdc-list-item__start,\n[dir=rtl] .mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-item--with-trailing-radio.mdc-list-item,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-left: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, [dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-radio .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio .mdc-list-item__end,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-three-lines .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-group__subheader {\n  margin: 0.75rem 16px;\n}\n\n.mdc-list-item--disabled .mdc-list-item__start,\n.mdc-list-item--disabled .mdc-list-item__content,\n.mdc-list-item--disabled .mdc-list-item__end {\n  opacity: 1;\n}\n.mdc-list-item--disabled .mdc-list-item__primary-text,\n.mdc-list-item--disabled .mdc-list-item__secondary-text {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n.mdc-list-item--disabled.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-disabled-leading-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-leading-icon-opacity, 0.38);\n}\n.mdc-list-item--disabled.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-disabled-trailing-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-trailing-icon-opacity, 0.38);\n}\n\n.mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing, [dir=rtl] .mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.mdc-list-item.mdc-list-item--disabled .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-disabled-label-text-color, var(--mat-sys-on-surface));\n}\n\n.mdc-list-item:hover::before {\n  background-color: var(--mat-list-list-item-hover-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n\n.mdc-list-item.mdc-list-item--disabled::before {\n  background-color: var(--mat-list-list-item-disabled-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item:focus::before {\n  background-color: var(--mat-list-list-item-focus-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item--disabled .mdc-radio,\n.mdc-list-item--disabled .mdc-checkbox {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n\n.mdc-list-item--with-leading-avatar .mat-mdc-list-item-avatar {\n  border-radius: var(--mat-list-list-item-leading-avatar-shape, var(--mat-sys-corner-full));\n  background-color: var(--mat-list-list-item-leading-avatar-color, var(--mat-sys-primary-container));\n}\n\n.mat-mdc-list-item-icon {\n  font-size: var(--mat-list-list-item-leading-icon-size, 24px);\n}\n\n@media (forced-colors: active) {\n  a.mdc-list-item--activated::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  a.mdc-list-item--activated [dir=rtl]::after {\n    right: auto;\n    left: 16px;\n  }\n}\n\n.mat-mdc-list-base {\n  display: block;\n}\n.mat-mdc-list-base .mdc-list-item__start,\n.mat-mdc-list-base .mdc-list-item__end,\n.mat-mdc-list-base .mdc-list-item__content {\n  pointer-events: auto;\n}\n\n.mat-mdc-list-item,\n.mat-mdc-list-option {\n  width: 100%;\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-list-item:not(.mat-mdc-list-item-interactive),\n.mat-mdc-list-option:not(.mat-mdc-list-item-interactive) {\n  cursor: default;\n}\n.mat-mdc-list-item .mat-divider-inset,\n.mat-mdc-list-option .mat-divider-inset {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n.mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-left: 72px;\n}\n[dir=rtl] .mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n[dir=rtl] .mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-right: 72px;\n}\n\n.mat-mdc-list-item-interactive::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  content: \"\";\n  opacity: 0;\n  pointer-events: none;\n  border-radius: inherit;\n}\n\n.mat-mdc-list-item > .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n.mat-mdc-list-item:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n}\n\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-line.mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: normal;\n}\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-unscoped-content.mdc-list-item__secondary-text {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n\nmat-action-list button {\n  background: none;\n  color: inherit;\n  border: none;\n  font: inherit;\n  outline: inherit;\n  -webkit-tap-highlight-color: transparent;\n  text-align: start;\n}\nmat-action-list button::-moz-focus-inner {\n  border: 0;\n}\n\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-inline-start: var(--mat-list-list-item-leading-icon-start-space, 16px);\n  margin-inline-end: var(--mat-list-list-item-leading-icon-end-space, 16px);\n}\n\n.mat-mdc-nav-list .mat-mdc-list-item {\n  border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n  --mat-focus-indicator-border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-nav-list .mat-mdc-list-item.mdc-list-item--activated {\n  background-color: var(--mat-list-active-indicator-color, var(--mat-sys-secondary-container));\n}\n"]
    }]
  }]
});

const MAT_LIST = new InjectionToken('MatList');
class MatList extends MatListBase {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatList,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatList,
    isStandalone: true,
    selector: "mat-list",
    host: {
      classAttribute: "mat-mdc-list mat-mdc-list-base mdc-list"
    },
    providers: [{
      provide: MatListBase,
      useExisting: MatList
    }],
    exportAs: ["matList"],
    usesInheritance: true,
    ngImport: i0,
    template: '<ng-content></ng-content>',
    isInline: true,
    styles: [".mdc-list {\n  margin: 0;\n  padding: 8px 0;\n  list-style-type: none;\n}\n.mdc-list:focus {\n  outline: none;\n}\n\n.mdc-list-item {\n  display: flex;\n  position: relative;\n  justify-content: flex-start;\n  overflow: hidden;\n  padding: 0;\n  align-items: stretch;\n  cursor: pointer;\n  padding-left: 16px;\n  padding-right: 16px;\n  background-color: var(--mat-list-list-item-container-color, transparent);\n  border-radius: var(--mat-list-list-item-container-shape, var(--mat-sys-corner-none));\n}\n.mdc-list-item.mdc-list-item--selected {\n  background-color: var(--mat-list-list-item-selected-container-color);\n}\n.mdc-list-item:focus {\n  outline: 0;\n}\n.mdc-list-item.mdc-list-item--disabled {\n  cursor: auto;\n}\n.mdc-list-item.mdc-list-item--with-one-line {\n  height: var(--mat-list-list-item-one-line-container-height, 48px);\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__start {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-two-lines {\n  height: var(--mat-list-list-item-two-line-container-height, 64px);\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-three-lines {\n  height: var(--mat-list-list-item-three-line-container-height, 88px);\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--selected::before, .mdc-list-item.mdc-list-item--selected:focus::before, .mdc-list-item:not(.mdc-list-item--selected):focus::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  content: \"\";\n  pointer-events: none;\n}\n\na.mdc-list-item {\n  color: inherit;\n  text-decoration: none;\n}\n\n.mdc-list-item__start {\n  fill: currentColor;\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-leading-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-leading-icon-size, 24px);\n  height: var(--mat-list-list-item-leading-icon-size, 24px);\n  margin-left: 16px;\n  margin-right: 32px;\n}\n[dir=rtl] .mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-left: 32px;\n  margin-right: 16px;\n}\n.mdc-list-item--with-leading-icon:hover .mdc-list-item__start {\n  color: var(--mat-list-list-item-hover-leading-icon-color);\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  width: var(--mat-list-list-item-leading-avatar-size, 40px);\n  height: var(--mat-list-list-item-leading-avatar-size, 40px);\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start, [dir=rtl] .mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n\n.mdc-list-item__end {\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  font-family: var(--mat-list-list-item-trailing-supporting-text-font, var(--mat-sys-label-small-font));\n  line-height: var(--mat-list-list-item-trailing-supporting-text-line-height, var(--mat-sys-label-small-line-height));\n  font-size: var(--mat-list-list-item-trailing-supporting-text-size, var(--mat-sys-label-small-size));\n  font-weight: var(--mat-list-list-item-trailing-supporting-text-weight, var(--mat-sys-label-small-weight));\n  letter-spacing: var(--mat-list-list-item-trailing-supporting-text-tracking, var(--mat-sys-label-small-tracking));\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-trailing-icon-size, 24px);\n  height: var(--mat-list-list-item-trailing-icon-size, 24px);\n}\n.mdc-list-item--with-trailing-icon:hover .mdc-list-item__end {\n  color: var(--mat-list-list-item-hover-trailing-icon-color);\n}\n.mdc-list-item.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-supporting-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-list-item--selected.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-selected-trailing-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-list-item__content {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  align-self: center;\n  flex: 1;\n  pointer-events: none;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__content, .mdc-list-item--with-three-lines .mdc-list-item__content {\n  align-self: stretch;\n}\n\n.mdc-list-item__primary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  color: var(--mat-list-list-item-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-list-list-item-label-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-list-list-item-label-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-list-list-item-label-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-list-list-item-label-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-list-list-item-label-text-tracking, var(--mat-sys-body-large-tracking));\n}\n.mdc-list-item:hover .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-hover-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item:focus .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-focus-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text, .mdc-list-item--with-three-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n\n.mdc-list-item__secondary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  display: block;\n  margin-top: 0;\n  color: var(--mat-list-list-item-supporting-text-color, var(--mat-sys-on-surface-variant));\n  font-family: var(--mat-list-list-item-supporting-text-font, var(--mat-sys-body-medium-font));\n  line-height: var(--mat-list-list-item-supporting-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-list-list-item-supporting-text-size, var(--mat-sys-body-medium-size));\n  font-weight: var(--mat-list-list-item-supporting-text-weight, var(--mat-sys-body-medium-weight));\n  letter-spacing: var(--mat-list-list-item-supporting-text-tracking, var(--mat-sys-body-medium-tracking));\n}\n.mdc-list-item__secondary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-three-lines .mdc-list-item__secondary-text {\n  white-space: normal;\n  line-height: 20px;\n}\n.mdc-list-item--with-overline .mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: auto;\n}\n\n.mdc-list-item--with-leading-radio.mdc-list-item,\n.mdc-list-item--with-leading-checkbox.mdc-list-item,\n.mdc-list-item--with-leading-icon.mdc-list-item,\n.mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-checkbox.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-icon.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-trailing-icon.mdc-list-item, [dir=rtl] .mdc-list-item--with-trailing-icon.mdc-list-item {\n  padding-left: 0;\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 16px;\n}\n\n.mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  -webkit-user-select: none;\n  user-select: none;\n  margin-left: 28px;\n  margin-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 28px;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end {\n  display: block;\n  line-height: normal;\n  align-self: flex-start;\n  margin-top: 0;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end::before, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-leading-radio .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio .mdc-list-item__start,\n[dir=rtl] .mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-item--with-trailing-radio.mdc-list-item,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-left: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, [dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-radio .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio .mdc-list-item__end,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-three-lines .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-group__subheader {\n  margin: 0.75rem 16px;\n}\n\n.mdc-list-item--disabled .mdc-list-item__start,\n.mdc-list-item--disabled .mdc-list-item__content,\n.mdc-list-item--disabled .mdc-list-item__end {\n  opacity: 1;\n}\n.mdc-list-item--disabled .mdc-list-item__primary-text,\n.mdc-list-item--disabled .mdc-list-item__secondary-text {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n.mdc-list-item--disabled.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-disabled-leading-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-leading-icon-opacity, 0.38);\n}\n.mdc-list-item--disabled.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-disabled-trailing-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-trailing-icon-opacity, 0.38);\n}\n\n.mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing, [dir=rtl] .mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.mdc-list-item.mdc-list-item--disabled .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-disabled-label-text-color, var(--mat-sys-on-surface));\n}\n\n.mdc-list-item:hover::before {\n  background-color: var(--mat-list-list-item-hover-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n\n.mdc-list-item.mdc-list-item--disabled::before {\n  background-color: var(--mat-list-list-item-disabled-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item:focus::before {\n  background-color: var(--mat-list-list-item-focus-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item--disabled .mdc-radio,\n.mdc-list-item--disabled .mdc-checkbox {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n\n.mdc-list-item--with-leading-avatar .mat-mdc-list-item-avatar {\n  border-radius: var(--mat-list-list-item-leading-avatar-shape, var(--mat-sys-corner-full));\n  background-color: var(--mat-list-list-item-leading-avatar-color, var(--mat-sys-primary-container));\n}\n\n.mat-mdc-list-item-icon {\n  font-size: var(--mat-list-list-item-leading-icon-size, 24px);\n}\n\n@media (forced-colors: active) {\n  a.mdc-list-item--activated::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  a.mdc-list-item--activated [dir=rtl]::after {\n    right: auto;\n    left: 16px;\n  }\n}\n\n.mat-mdc-list-base {\n  display: block;\n}\n.mat-mdc-list-base .mdc-list-item__start,\n.mat-mdc-list-base .mdc-list-item__end,\n.mat-mdc-list-base .mdc-list-item__content {\n  pointer-events: auto;\n}\n\n.mat-mdc-list-item,\n.mat-mdc-list-option {\n  width: 100%;\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-list-item:not(.mat-mdc-list-item-interactive),\n.mat-mdc-list-option:not(.mat-mdc-list-item-interactive) {\n  cursor: default;\n}\n.mat-mdc-list-item .mat-divider-inset,\n.mat-mdc-list-option .mat-divider-inset {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n.mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-left: 72px;\n}\n[dir=rtl] .mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n[dir=rtl] .mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-right: 72px;\n}\n\n.mat-mdc-list-item-interactive::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  content: \"\";\n  opacity: 0;\n  pointer-events: none;\n  border-radius: inherit;\n}\n\n.mat-mdc-list-item > .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n.mat-mdc-list-item:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n}\n\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-line.mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: normal;\n}\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-unscoped-content.mdc-list-item__secondary-text {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n\nmat-action-list button {\n  background: none;\n  color: inherit;\n  border: none;\n  font: inherit;\n  outline: inherit;\n  -webkit-tap-highlight-color: transparent;\n  text-align: start;\n}\nmat-action-list button::-moz-focus-inner {\n  border: 0;\n}\n\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-inline-start: var(--mat-list-list-item-leading-icon-start-space, 16px);\n  margin-inline-end: var(--mat-list-list-item-leading-icon-end-space, 16px);\n}\n\n.mat-mdc-nav-list .mat-mdc-list-item {\n  border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n  --mat-focus-indicator-border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-nav-list .mat-mdc-list-item.mdc-list-item--activated {\n  background-color: var(--mat-list-active-indicator-color, var(--mat-sys-secondary-container));\n}\n"],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatList,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-list',
      exportAs: 'matList',
      template: '<ng-content></ng-content>',
      host: {
        'class': 'mat-mdc-list mat-mdc-list-base mdc-list'
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [{
        provide: MatListBase,
        useExisting: MatList
      }],
      styles: [".mdc-list {\n  margin: 0;\n  padding: 8px 0;\n  list-style-type: none;\n}\n.mdc-list:focus {\n  outline: none;\n}\n\n.mdc-list-item {\n  display: flex;\n  position: relative;\n  justify-content: flex-start;\n  overflow: hidden;\n  padding: 0;\n  align-items: stretch;\n  cursor: pointer;\n  padding-left: 16px;\n  padding-right: 16px;\n  background-color: var(--mat-list-list-item-container-color, transparent);\n  border-radius: var(--mat-list-list-item-container-shape, var(--mat-sys-corner-none));\n}\n.mdc-list-item.mdc-list-item--selected {\n  background-color: var(--mat-list-list-item-selected-container-color);\n}\n.mdc-list-item:focus {\n  outline: 0;\n}\n.mdc-list-item.mdc-list-item--disabled {\n  cursor: auto;\n}\n.mdc-list-item.mdc-list-item--with-one-line {\n  height: var(--mat-list-list-item-one-line-container-height, 48px);\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__start {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-two-lines {\n  height: var(--mat-list-list-item-two-line-container-height, 64px);\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-three-lines {\n  height: var(--mat-list-list-item-three-line-container-height, 88px);\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--selected::before, .mdc-list-item.mdc-list-item--selected:focus::before, .mdc-list-item:not(.mdc-list-item--selected):focus::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  content: \"\";\n  pointer-events: none;\n}\n\na.mdc-list-item {\n  color: inherit;\n  text-decoration: none;\n}\n\n.mdc-list-item__start {\n  fill: currentColor;\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-leading-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-leading-icon-size, 24px);\n  height: var(--mat-list-list-item-leading-icon-size, 24px);\n  margin-left: 16px;\n  margin-right: 32px;\n}\n[dir=rtl] .mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-left: 32px;\n  margin-right: 16px;\n}\n.mdc-list-item--with-leading-icon:hover .mdc-list-item__start {\n  color: var(--mat-list-list-item-hover-leading-icon-color);\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  width: var(--mat-list-list-item-leading-avatar-size, 40px);\n  height: var(--mat-list-list-item-leading-avatar-size, 40px);\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start, [dir=rtl] .mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n\n.mdc-list-item__end {\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  font-family: var(--mat-list-list-item-trailing-supporting-text-font, var(--mat-sys-label-small-font));\n  line-height: var(--mat-list-list-item-trailing-supporting-text-line-height, var(--mat-sys-label-small-line-height));\n  font-size: var(--mat-list-list-item-trailing-supporting-text-size, var(--mat-sys-label-small-size));\n  font-weight: var(--mat-list-list-item-trailing-supporting-text-weight, var(--mat-sys-label-small-weight));\n  letter-spacing: var(--mat-list-list-item-trailing-supporting-text-tracking, var(--mat-sys-label-small-tracking));\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-trailing-icon-size, 24px);\n  height: var(--mat-list-list-item-trailing-icon-size, 24px);\n}\n.mdc-list-item--with-trailing-icon:hover .mdc-list-item__end {\n  color: var(--mat-list-list-item-hover-trailing-icon-color);\n}\n.mdc-list-item.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-supporting-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-list-item--selected.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-selected-trailing-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-list-item__content {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  align-self: center;\n  flex: 1;\n  pointer-events: none;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__content, .mdc-list-item--with-three-lines .mdc-list-item__content {\n  align-self: stretch;\n}\n\n.mdc-list-item__primary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  color: var(--mat-list-list-item-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-list-list-item-label-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-list-list-item-label-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-list-list-item-label-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-list-list-item-label-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-list-list-item-label-text-tracking, var(--mat-sys-body-large-tracking));\n}\n.mdc-list-item:hover .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-hover-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item:focus .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-focus-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text, .mdc-list-item--with-three-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n\n.mdc-list-item__secondary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  display: block;\n  margin-top: 0;\n  color: var(--mat-list-list-item-supporting-text-color, var(--mat-sys-on-surface-variant));\n  font-family: var(--mat-list-list-item-supporting-text-font, var(--mat-sys-body-medium-font));\n  line-height: var(--mat-list-list-item-supporting-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-list-list-item-supporting-text-size, var(--mat-sys-body-medium-size));\n  font-weight: var(--mat-list-list-item-supporting-text-weight, var(--mat-sys-body-medium-weight));\n  letter-spacing: var(--mat-list-list-item-supporting-text-tracking, var(--mat-sys-body-medium-tracking));\n}\n.mdc-list-item__secondary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-three-lines .mdc-list-item__secondary-text {\n  white-space: normal;\n  line-height: 20px;\n}\n.mdc-list-item--with-overline .mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: auto;\n}\n\n.mdc-list-item--with-leading-radio.mdc-list-item,\n.mdc-list-item--with-leading-checkbox.mdc-list-item,\n.mdc-list-item--with-leading-icon.mdc-list-item,\n.mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-checkbox.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-icon.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-trailing-icon.mdc-list-item, [dir=rtl] .mdc-list-item--with-trailing-icon.mdc-list-item {\n  padding-left: 0;\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 16px;\n}\n\n.mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  -webkit-user-select: none;\n  user-select: none;\n  margin-left: 28px;\n  margin-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 28px;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end {\n  display: block;\n  line-height: normal;\n  align-self: flex-start;\n  margin-top: 0;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end::before, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-leading-radio .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio .mdc-list-item__start,\n[dir=rtl] .mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-item--with-trailing-radio.mdc-list-item,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-left: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, [dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-radio .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio .mdc-list-item__end,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-three-lines .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-group__subheader {\n  margin: 0.75rem 16px;\n}\n\n.mdc-list-item--disabled .mdc-list-item__start,\n.mdc-list-item--disabled .mdc-list-item__content,\n.mdc-list-item--disabled .mdc-list-item__end {\n  opacity: 1;\n}\n.mdc-list-item--disabled .mdc-list-item__primary-text,\n.mdc-list-item--disabled .mdc-list-item__secondary-text {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n.mdc-list-item--disabled.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-disabled-leading-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-leading-icon-opacity, 0.38);\n}\n.mdc-list-item--disabled.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-disabled-trailing-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-trailing-icon-opacity, 0.38);\n}\n\n.mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing, [dir=rtl] .mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.mdc-list-item.mdc-list-item--disabled .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-disabled-label-text-color, var(--mat-sys-on-surface));\n}\n\n.mdc-list-item:hover::before {\n  background-color: var(--mat-list-list-item-hover-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n\n.mdc-list-item.mdc-list-item--disabled::before {\n  background-color: var(--mat-list-list-item-disabled-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item:focus::before {\n  background-color: var(--mat-list-list-item-focus-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item--disabled .mdc-radio,\n.mdc-list-item--disabled .mdc-checkbox {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n\n.mdc-list-item--with-leading-avatar .mat-mdc-list-item-avatar {\n  border-radius: var(--mat-list-list-item-leading-avatar-shape, var(--mat-sys-corner-full));\n  background-color: var(--mat-list-list-item-leading-avatar-color, var(--mat-sys-primary-container));\n}\n\n.mat-mdc-list-item-icon {\n  font-size: var(--mat-list-list-item-leading-icon-size, 24px);\n}\n\n@media (forced-colors: active) {\n  a.mdc-list-item--activated::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  a.mdc-list-item--activated [dir=rtl]::after {\n    right: auto;\n    left: 16px;\n  }\n}\n\n.mat-mdc-list-base {\n  display: block;\n}\n.mat-mdc-list-base .mdc-list-item__start,\n.mat-mdc-list-base .mdc-list-item__end,\n.mat-mdc-list-base .mdc-list-item__content {\n  pointer-events: auto;\n}\n\n.mat-mdc-list-item,\n.mat-mdc-list-option {\n  width: 100%;\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-list-item:not(.mat-mdc-list-item-interactive),\n.mat-mdc-list-option:not(.mat-mdc-list-item-interactive) {\n  cursor: default;\n}\n.mat-mdc-list-item .mat-divider-inset,\n.mat-mdc-list-option .mat-divider-inset {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n.mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-left: 72px;\n}\n[dir=rtl] .mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n[dir=rtl] .mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-right: 72px;\n}\n\n.mat-mdc-list-item-interactive::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  content: \"\";\n  opacity: 0;\n  pointer-events: none;\n  border-radius: inherit;\n}\n\n.mat-mdc-list-item > .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n.mat-mdc-list-item:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n}\n\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-line.mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: normal;\n}\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-unscoped-content.mdc-list-item__secondary-text {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n\nmat-action-list button {\n  background: none;\n  color: inherit;\n  border: none;\n  font: inherit;\n  outline: inherit;\n  -webkit-tap-highlight-color: transparent;\n  text-align: start;\n}\nmat-action-list button::-moz-focus-inner {\n  border: 0;\n}\n\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-inline-start: var(--mat-list-list-item-leading-icon-start-space, 16px);\n  margin-inline-end: var(--mat-list-list-item-leading-icon-end-space, 16px);\n}\n\n.mat-mdc-nav-list .mat-mdc-list-item {\n  border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n  --mat-focus-indicator-border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-nav-list .mat-mdc-list-item.mdc-list-item--activated {\n  background-color: var(--mat-list-active-indicator-color, var(--mat-sys-secondary-container));\n}\n"]
    }]
  }]
});
class MatListItem extends MatListItemBase {
  _lines;
  _titles;
  _meta;
  _unscopedContent;
  _itemText;
  get activated() {
    return this._activated;
  }
  set activated(activated) {
    this._activated = coerceBooleanProperty(activated);
  }
  _activated = false;
  _getAriaCurrent() {
    return this._hostElement.nodeName === 'A' && this._activated ? 'page' : null;
  }
  _hasBothLeadingAndTrailing() {
    return this._meta.length !== 0 && (this._avatars.length !== 0 || this._icons.length !== 0);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatListItem,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatListItem,
    isStandalone: true,
    selector: "mat-list-item, a[mat-list-item], button[mat-list-item]",
    inputs: {
      activated: "activated"
    },
    host: {
      properties: {
        "class.mdc-list-item--activated": "activated",
        "class.mdc-list-item--with-leading-avatar": "_avatars.length !== 0",
        "class.mdc-list-item--with-leading-icon": "_icons.length !== 0",
        "class.mdc-list-item--with-trailing-meta": "_meta.length !== 0",
        "class.mat-mdc-list-item-both-leading-and-trailing": "_hasBothLeadingAndTrailing()",
        "class._mat-animation-noopable": "_noopAnimations",
        "attr.aria-current": "_getAriaCurrent()"
      },
      classAttribute: "mat-mdc-list-item mdc-list-item"
    },
    queries: [{
      propertyName: "_lines",
      predicate: MatListItemLine,
      descendants: true
    }, {
      propertyName: "_titles",
      predicate: MatListItemTitle,
      descendants: true
    }, {
      propertyName: "_meta",
      predicate: MatListItemMeta,
      descendants: true
    }],
    viewQueries: [{
      propertyName: "_unscopedContent",
      first: true,
      predicate: ["unscopedContent"],
      descendants: true
    }, {
      propertyName: "_itemText",
      first: true,
      predicate: ["text"],
      descendants: true
    }],
    exportAs: ["matListItem"],
    usesInheritance: true,
    ngImport: i0,
    template: "<ng-content select=\"[matListItemAvatar],[matListItemIcon]\"></ng-content>\n\n<span class=\"mdc-list-item__content\">\n  <ng-content select=\"[matListItemTitle]\"></ng-content>\n  <ng-content select=\"[matListItemLine]\"></ng-content>\n  <span #unscopedContent class=\"mat-mdc-list-item-unscoped-content\"\n        (cdkObserveContent)=\"_updateItemLines(true)\">\n    <ng-content></ng-content>\n  </span>\n</span>\n\n<ng-content select=\"[matListItemMeta]\"></ng-content>\n\n<ng-content select=\"mat-divider\"></ng-content>\n\n<!--\n  Strong focus indicator element. MDC uses the `::before` pseudo element for the default\n  focus/hover/selected state, so we need a separate element.\n-->\n<div class=\"mat-focus-indicator\"></div>\n",
    dependencies: [{
      kind: "directive",
      type: CdkObserveContent,
      selector: "[cdkObserveContent]",
      inputs: ["cdkObserveContentDisabled", "debounce"],
      outputs: ["cdkObserveContent"],
      exportAs: ["cdkObserveContent"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatListItem,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-list-item, a[mat-list-item], button[mat-list-item]',
      exportAs: 'matListItem',
      host: {
        'class': 'mat-mdc-list-item mdc-list-item',
        '[class.mdc-list-item--activated]': 'activated',
        '[class.mdc-list-item--with-leading-avatar]': '_avatars.length !== 0',
        '[class.mdc-list-item--with-leading-icon]': '_icons.length !== 0',
        '[class.mdc-list-item--with-trailing-meta]': '_meta.length !== 0',
        '[class.mat-mdc-list-item-both-leading-and-trailing]': '_hasBothLeadingAndTrailing()',
        '[class._mat-animation-noopable]': '_noopAnimations',
        '[attr.aria-current]': '_getAriaCurrent()'
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CdkObserveContent],
      template: "<ng-content select=\"[matListItemAvatar],[matListItemIcon]\"></ng-content>\n\n<span class=\"mdc-list-item__content\">\n  <ng-content select=\"[matListItemTitle]\"></ng-content>\n  <ng-content select=\"[matListItemLine]\"></ng-content>\n  <span #unscopedContent class=\"mat-mdc-list-item-unscoped-content\"\n        (cdkObserveContent)=\"_updateItemLines(true)\">\n    <ng-content></ng-content>\n  </span>\n</span>\n\n<ng-content select=\"[matListItemMeta]\"></ng-content>\n\n<ng-content select=\"mat-divider\"></ng-content>\n\n<!--\n  Strong focus indicator element. MDC uses the `::before` pseudo element for the default\n  focus/hover/selected state, so we need a separate element.\n-->\n<div class=\"mat-focus-indicator\"></div>\n"
    }]
  }],
  propDecorators: {
    _lines: [{
      type: ContentChildren,
      args: [MatListItemLine, {
        descendants: true
      }]
    }],
    _titles: [{
      type: ContentChildren,
      args: [MatListItemTitle, {
        descendants: true
      }]
    }],
    _meta: [{
      type: ContentChildren,
      args: [MatListItemMeta, {
        descendants: true
      }]
    }],
    _unscopedContent: [{
      type: ViewChild,
      args: ['unscopedContent']
    }],
    _itemText: [{
      type: ViewChild,
      args: ['text']
    }],
    activated: [{
      type: Input
    }]
  }
});

const SELECTION_LIST = new InjectionToken('SelectionList');
class MatListOption extends MatListItemBase {
  _selectionList = inject(SELECTION_LIST);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _lines;
  _titles;
  _unscopedContent;
  selectedChange = new EventEmitter();
  togglePosition = 'after';
  get checkboxPosition() {
    return this.togglePosition;
  }
  set checkboxPosition(value) {
    this.togglePosition = value;
  }
  get color() {
    return this._color || this._selectionList.color;
  }
  set color(newValue) {
    this._color = newValue;
  }
  _color;
  get value() {
    return this._value;
  }
  set value(newValue) {
    if (this.selected && newValue !== this.value && this._inputsInitialized) {
      this.selected = false;
    }
    this._value = newValue;
  }
  _value;
  get selected() {
    return this._selectionList.selectedOptions.isSelected(this);
  }
  set selected(value) {
    const isSelected = coerceBooleanProperty(value);
    if (isSelected !== this._selected) {
      this._setSelected(isSelected);
      if (isSelected || this._selectionList.multiple) {
        this._selectionList._reportValueChange();
      }
    }
  }
  _selected = false;
  _inputsInitialized = false;
  ngOnInit() {
    const list = this._selectionList;
    if (list._value && list._value.some(value => list.compareWith(this._value, value))) {
      this._setSelected(true);
    }
    const wasSelected = this._selected;
    Promise.resolve().then(() => {
      if (this._selected || wasSelected) {
        this.selected = true;
        this._changeDetectorRef.markForCheck();
      }
    });
    this._inputsInitialized = true;
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.selected) {
      Promise.resolve().then(() => {
        this.selected = false;
      });
    }
  }
  toggle() {
    this.selected = !this.selected;
  }
  focus() {
    this._hostElement.focus();
  }
  getLabel() {
    const titleElement = this._titles?.get(0)?._elementRef.nativeElement;
    const labelEl = titleElement || this._unscopedContent?.nativeElement;
    return labelEl?.textContent || '';
  }
  _hasCheckboxAt(position) {
    return this._selectionList.multiple && this._getTogglePosition() === position;
  }
  _hasRadioAt(position) {
    return !this._selectionList.multiple && this._getTogglePosition() === position && !this._selectionList.hideSingleSelectionIndicator;
  }
  _hasIconsOrAvatarsAt(position) {
    return this._hasProjected('icons', position) || this._hasProjected('avatars', position);
  }
  _hasProjected(type, position) {
    return this._getTogglePosition() !== position && (type === 'avatars' ? this._avatars.length !== 0 : this._icons.length !== 0);
  }
  _handleBlur() {
    this._selectionList._onTouched();
  }
  _getTogglePosition() {
    return this.togglePosition || 'after';
  }
  _setSelected(selected) {
    if (selected === this._selected) {
      return false;
    }
    this._selected = selected;
    if (selected) {
      this._selectionList.selectedOptions.select(this);
    } else {
      this._selectionList.selectedOptions.deselect(this);
    }
    this.selectedChange.emit(selected);
    this._changeDetectorRef.markForCheck();
    return true;
  }
  _markForCheck() {
    this._changeDetectorRef.markForCheck();
  }
  _toggleOnInteraction() {
    if (!this.disabled) {
      if (this._selectionList.multiple) {
        this.selected = !this.selected;
        this._selectionList._emitChangeEvent([this]);
      } else if (!this.selected) {
        this.selected = true;
        this._selectionList._emitChangeEvent([this]);
      }
    }
  }
  _setTabindex(value) {
    this._hostElement.setAttribute('tabindex', value + '');
  }
  _hasBothLeadingAndTrailing() {
    const hasLeading = this._hasProjected('avatars', 'before') || this._hasProjected('icons', 'before') || this._hasCheckboxAt('before') || this._hasRadioAt('before');
    const hasTrailing = this._hasProjected('icons', 'after') || this._hasProjected('avatars', 'after') || this._hasCheckboxAt('after') || this._hasRadioAt('after');
    return hasLeading && hasTrailing;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatListOption,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "17.0.0",
    version: "22.0.0-next.6",
    type: MatListOption,
    isStandalone: true,
    selector: "mat-list-option",
    inputs: {
      togglePosition: "togglePosition",
      checkboxPosition: "checkboxPosition",
      color: "color",
      value: "value",
      selected: "selected"
    },
    outputs: {
      selectedChange: "selectedChange"
    },
    host: {
      attributes: {
        "role": "option"
      },
      listeners: {
        "blur": "_handleBlur()",
        "click": "_toggleOnInteraction()"
      },
      properties: {
        "class.mdc-list-item--selected": "selected && !_selectionList.multiple && _selectionList.hideSingleSelectionIndicator",
        "class.mdc-list-item--with-leading-avatar": "_hasProjected(\"avatars\", \"before\")",
        "class.mdc-list-item--with-leading-icon": "_hasProjected(\"icons\", \"before\")",
        "class.mdc-list-item--with-trailing-icon": "_hasProjected(\"icons\", \"after\")",
        "class.mat-mdc-list-option-with-trailing-avatar": "_hasProjected(\"avatars\", \"after\")",
        "class.mdc-list-item--with-leading-checkbox": "_hasCheckboxAt(\"before\")",
        "class.mdc-list-item--with-trailing-checkbox": "_hasCheckboxAt(\"after\")",
        "class.mdc-list-item--with-leading-radio": "_hasRadioAt(\"before\")",
        "class.mdc-list-item--with-trailing-radio": "_hasRadioAt(\"after\")",
        "class.mat-mdc-list-item-both-leading-and-trailing": "_hasBothLeadingAndTrailing()",
        "class.mat-accent": "color !== \"primary\" && color !== \"warn\"",
        "class.mat-warn": "color === \"warn\"",
        "class._mat-animation-noopable": "_noopAnimations",
        "attr.aria-selected": "selected"
      },
      classAttribute: "mat-mdc-list-item mat-mdc-list-option mdc-list-item"
    },
    providers: [{
      provide: MatListItemBase,
      useExisting: MatListOption
    }, {
      provide: LIST_OPTION,
      useExisting: MatListOption
    }],
    queries: [{
      propertyName: "_lines",
      predicate: MatListItemLine,
      descendants: true
    }, {
      propertyName: "_titles",
      predicate: MatListItemTitle,
      descendants: true
    }],
    viewQueries: [{
      propertyName: "_unscopedContent",
      first: true,
      predicate: ["unscopedContent"],
      descendants: true
    }],
    exportAs: ["matListOption"],
    usesInheritance: true,
    ngImport: i0,
    template: "<!--\n  Save icons and the pseudo checkbox/radio so that they can be re-used in the template without\n  duplication. Also content can only be injected once so we need to extract icons/avatars\n  into a template since we use it in multiple places.\n-->\n<ng-template #icons>\n  <ng-content select=\"[matListItemAvatar],[matListItemIcon]\">\n  </ng-content>\n</ng-template>\n\n<ng-template #checkbox>\n  <div class=\"mdc-checkbox\" [class.mdc-checkbox--disabled]=\"disabled\">\n    <input type=\"checkbox\" class=\"mdc-checkbox__native-control\"\n           [checked]=\"selected\" [disabled]=\"disabled\"/>\n    <div class=\"mdc-checkbox__background\">\n      <svg class=\"mdc-checkbox__checkmark\"\n           viewBox=\"0 0 24 24\"\n           aria-hidden=\"true\">\n        <path class=\"mdc-checkbox__checkmark-path\"\n              fill=\"none\"\n              d=\"M1.73,12.91 8.1,19.28 22.79,4.59\"/>\n      </svg>\n      <div class=\"mdc-checkbox__mixedmark\"></div>\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #radio>\n  <div class=\"mdc-radio\" [class.mdc-radio--disabled]=\"disabled\">\n    <input type=\"radio\" class=\"mdc-radio__native-control\"\n           [checked]=\"selected\" [disabled]=\"disabled\"/>\n    <div class=\"mdc-radio__background\">\n      <div class=\"mdc-radio__outer-circle\"></div>\n      <div class=\"mdc-radio__inner-circle\"></div>\n    </div>\n  </div>\n</ng-template>\n\n@if (_hasCheckboxAt('before')) {\n  <!-- Container for the checkbox at start. -->\n  <span class=\"mdc-list-item__start mat-mdc-list-option-checkbox-before\">\n    <ng-template [ngTemplateOutlet]=\"checkbox\"></ng-template>\n  </span>\n} @else if (_hasRadioAt('before')) {\n  <!-- Container for the radio at the start. -->\n  <span class=\"mdc-list-item__start mat-mdc-list-option-radio-before\">\n    <ng-template [ngTemplateOutlet]=\"radio\"></ng-template>\n  </span>\n}\n<!-- Conditionally renders icons/avatars before the list item text. -->\n@if (_hasIconsOrAvatarsAt('before')) {\n  <ng-template [ngTemplateOutlet]=\"icons\"></ng-template>\n}\n\n<!-- Text -->\n<span class=\"mdc-list-item__content\">\n  <ng-content select=\"[matListItemTitle]\"></ng-content>\n  <ng-content select=\"[matListItemLine]\"></ng-content>\n  <span #unscopedContent class=\"mat-mdc-list-item-unscoped-content\"\n        (cdkObserveContent)=\"_updateItemLines(true)\">\n    <ng-content></ng-content>\n  </span>\n</span>\n\n@if (_hasCheckboxAt('after')) {\n  <!-- Container for the checkbox at the end. -->\n  <span class=\"mdc-list-item__end\">\n    <ng-template [ngTemplateOutlet]=\"checkbox\"></ng-template>\n  </span>\n} @else if (_hasRadioAt('after')) {\n  <!-- Container for the radio at the end. -->\n  <span class=\"mdc-list-item__end\">\n    <ng-template [ngTemplateOutlet]=\"radio\"></ng-template>\n  </span>\n}\n\n<!-- Conditionally renders icons/avatars after the list item text. -->\n@if (_hasIconsOrAvatarsAt('after')) {\n  <ng-template [ngTemplateOutlet]=\"icons\"></ng-template>\n}\n\n<!-- Divider -->\n<ng-content select=\"mat-divider\"></ng-content>\n\n<!--\n  Strong focus indicator element. MDC uses the `::before` pseudo element for the default\n  focus/hover/selected state, so we need a separate element.\n-->\n<div class=\"mat-focus-indicator\"></div>\n",
    styles: [".mat-mdc-list-option-with-trailing-avatar.mdc-list-item, [dir=rtl] .mat-mdc-list-option-with-trailing-avatar.mdc-list-item {\n  padding-left: 0;\n  padding-right: 0;\n}\n.mat-mdc-list-option-with-trailing-avatar .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 16px;\n  width: 40px;\n  height: 40px;\n}\n.mat-mdc-list-option-with-trailing-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mat-mdc-list-option-with-trailing-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mat-mdc-list-option-with-trailing-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n.mat-mdc-list-option-with-trailing-avatar .mdc-list-item__end {\n  border-radius: 50%;\n}\n\n.mat-mdc-list-option .mdc-checkbox {\n  display: inline-block;\n  position: relative;\n  flex: 0 0 18px;\n  box-sizing: content-box;\n  width: 18px;\n  height: 18px;\n  line-height: 0;\n  white-space: nowrap;\n  cursor: pointer;\n  vertical-align: bottom;\n  padding: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);\n  margin: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n}\n.mat-mdc-list-option .mdc-checkbox .mdc-checkbox__native-control {\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  opacity: 0;\n  cursor: inherit;\n  z-index: 1;\n  width: var(--mat-checkbox-state-layer-size, 40px);\n  height: var(--mat-checkbox-state-layer-size, 40px);\n  top: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n  right: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n  left: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n}\n.mat-mdc-list-option .mdc-checkbox--disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-list-option .mdc-checkbox__background {\n  display: inline-flex;\n  position: absolute;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 18px;\n  height: 18px;\n  border: 2px solid currentColor;\n  border-radius: 2px;\n  background-color: transparent;\n  pointer-events: none;\n  will-change: background-color, border-color;\n  transition: background-color 90ms cubic-bezier(0.4, 0, 0.6, 1), border-color 90ms cubic-bezier(0.4, 0, 0.6, 1);\n  -webkit-print-color-adjust: exact;\n  color-adjust: exact;\n  border-color: var(--mat-checkbox-unselected-icon-color, var(--mat-sys-on-surface-variant));\n  top: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);\n  left: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-selected-icon-color, var(--mat-sys-primary));\n  background-color: var(--mat-checkbox-selected-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-list-option .mdc-checkbox--disabled .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox--disabled .mdc-checkbox__background {\n    border-color: GrayText;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {\n  background-color: var(--mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  border-color: transparent;\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,\n  .mat-mdc-list-option .mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {\n    border-color: GrayText;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox:hover > .mdc-checkbox__native-control:not(:checked) ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox:hover > .mdc-checkbox__native-control:not(:indeterminate) ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-unselected-hover-icon-color, var(--mat-sys-on-surface));\n  background-color: transparent;\n}\n.mat-mdc-list-option .mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox:hover > .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-selected-hover-icon-color, var(--mat-sys-primary));\n  background-color: var(--mat-checkbox-selected-hover-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:focus:focus:not(:checked) ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox__native-control:focus:focus:not(:indeterminate) ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-unselected-focus-icon-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:focus:focus:checked ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox__native-control:focus:focus:indeterminate ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-selected-focus-icon-color, var(--mat-sys-primary));\n  background-color: var(--mat-checkbox-selected-focus-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,\n  .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,\n  .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {\n    border-color: GrayText;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {\n  background-color: var(--mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  border-color: transparent;\n}\n.mat-mdc-list-option .mdc-checkbox__checkmark {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  opacity: 0;\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.6, 1);\n  color: var(--mat-checkbox-selected-checkmark-color, var(--mat-sys-on-primary));\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox__checkmark {\n    color: CanvasText;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox--disabled .mdc-checkbox__checkmark, .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {\n  color: var(--mat-checkbox-disabled-selected-checkmark-color, var(--mat-sys-surface));\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox--disabled .mdc-checkbox__checkmark, .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {\n    color: GrayText;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox__checkmark-path {\n  transition: stroke-dashoffset 180ms cubic-bezier(0.4, 0, 0.6, 1);\n  stroke: currentColor;\n  stroke-width: 3.12px;\n  stroke-dashoffset: 29.7833385;\n  stroke-dasharray: 29.7833385;\n}\n.mat-mdc-list-option .mdc-checkbox__mixedmark {\n  width: 100%;\n  height: 0;\n  transform: scaleX(0) rotate(0deg);\n  border-width: 1px;\n  border-style: solid;\n  opacity: 0;\n  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);\n  border-color: var(--mat-checkbox-selected-checkmark-color, var(--mat-sys-on-primary));\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox__mixedmark {\n    margin: 0 1px;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {\n  border-color: var(--mat-checkbox-disabled-selected-checkmark-color, var(--mat-sys-surface));\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {\n    border-color: GrayText;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background {\n  animation-duration: 180ms;\n  animation-timing-function: linear;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path {\n  animation: mdc-checkbox-unchecked-checked-checkmark-path 180ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path {\n  animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark {\n  animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark {\n  animation: mdc-checkbox-indeterminate-checked-checkmark 500ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-indeterminate-checked-mixedmark 500ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {\n  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,\n.mat-mdc-list-option .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path {\n  stroke-dashoffset: 0;\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {\n  transition: opacity 180ms cubic-bezier(0, 0, 0.2, 1), transform 180ms cubic-bezier(0, 0, 0.2, 1);\n  opacity: 1;\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {\n  transform: scaleX(1) rotate(-45deg);\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {\n  transform: rotate(45deg);\n  opacity: 0;\n  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {\n  transform: scaleX(1) rotate(0deg);\n  opacity: 1;\n}\n@keyframes mdc-checkbox-unchecked-checked-checkmark-path {\n  0%, 50% {\n    stroke-dashoffset: 29.7833385;\n  }\n  50% {\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  100% {\n    stroke-dashoffset: 0;\n  }\n}\n@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {\n  0%, 68.2% {\n    transform: scaleX(0);\n  }\n  68.2% {\n    animation-timing-function: cubic-bezier(0, 0, 0, 1);\n  }\n  100% {\n    transform: scaleX(1);\n  }\n}\n@keyframes mdc-checkbox-checked-unchecked-checkmark-path {\n  from {\n    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);\n    opacity: 1;\n    stroke-dashoffset: 0;\n  }\n  to {\n    opacity: 0;\n    stroke-dashoffset: -29.7833385;\n  }\n}\n@keyframes mdc-checkbox-checked-indeterminate-checkmark {\n  from {\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    transform: rotate(0deg);\n    opacity: 1;\n  }\n  to {\n    transform: rotate(45deg);\n    opacity: 0;\n  }\n}\n@keyframes mdc-checkbox-indeterminate-checked-checkmark {\n  from {\n    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    transform: rotate(45deg);\n    opacity: 0;\n  }\n  to {\n    transform: rotate(360deg);\n    opacity: 1;\n  }\n}\n@keyframes mdc-checkbox-checked-indeterminate-mixedmark {\n  from {\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    transform: rotate(-45deg);\n    opacity: 0;\n  }\n  to {\n    transform: rotate(0deg);\n    opacity: 1;\n  }\n}\n@keyframes mdc-checkbox-indeterminate-checked-mixedmark {\n  from {\n    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    transform: rotate(0deg);\n    opacity: 1;\n  }\n  to {\n    transform: rotate(315deg);\n    opacity: 0;\n  }\n}\n@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {\n  0% {\n    animation-timing-function: linear;\n    transform: scaleX(1);\n    opacity: 1;\n  }\n  32.8%, 100% {\n    transform: scaleX(0);\n    opacity: 0;\n  }\n}\n.mat-mdc-list-option .mdc-radio {\n  display: inline-block;\n  position: relative;\n  flex: 0 0 auto;\n  box-sizing: content-box;\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n  will-change: opacity, transform, border-color, color;\n  padding: calc((var(--mat-radio-state-layer-size, 40px) - 20px) / 2);\n}\n.mat-mdc-list-option .mdc-radio__background {\n  display: inline-block;\n  position: relative;\n  box-sizing: border-box;\n  width: 20px;\n  height: 20px;\n}\n.mat-mdc-list-option .mdc-radio__background::before {\n  position: absolute;\n  transform: scale(0, 0);\n  border-radius: 50%;\n  opacity: 0;\n  pointer-events: none;\n  content: \"\";\n  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);\n  width: var(--mat-radio-state-layer-size, 40px);\n  height: var(--mat-radio-state-layer-size, 40px);\n  top: calc(-1 * (var(--mat-radio-state-layer-size, 40px) - 20px) / 2);\n  left: calc(-1 * (var(--mat-radio-state-layer-size, 40px) - 20px) / 2);\n}\n.mat-mdc-list-option .mdc-radio__outer-circle {\n  position: absolute;\n  top: 0;\n  left: 0;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  border-width: 2px;\n  border-style: solid;\n  border-radius: 50%;\n  transition: border-color 90ms cubic-bezier(0.4, 0, 0.6, 1);\n}\n.mat-mdc-list-option .mdc-radio__inner-circle {\n  position: absolute;\n  top: 0;\n  left: 0;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  transform: scale(0);\n  border-radius: 50%;\n  transition: transform 90ms cubic-bezier(0.4, 0, 0.6, 1), background-color 90ms cubic-bezier(0.4, 0, 0.6, 1);\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-radio__inner-circle {\n    background-color: CanvasText !important;\n  }\n}\n.mat-mdc-list-option .mdc-radio__native-control {\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  opacity: 0;\n  top: 0;\n  right: 0;\n  left: 0;\n  cursor: inherit;\n  z-index: 1;\n  width: var(--mat-radio-state-layer-size, 40px);\n  height: var(--mat-radio-state-layer-size, 40px);\n}\n.mat-mdc-list-option .mdc-radio__native-control:checked + .mdc-radio__background, .mat-mdc-list-option .mdc-radio__native-control:disabled + .mdc-radio__background {\n  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 1), transform 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-list-option .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__outer-circle, .mat-mdc-list-option .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__outer-circle {\n  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-list-option .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__inner-circle, .mat-mdc-list-option .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__inner-circle {\n  transition: transform 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-list-option .mdc-radio__native-control:disabled:not(:checked) + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-disabled-unselected-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-radio-disabled-unselected-icon-opacity, 0.38);\n}\n.mat-mdc-list-option .mdc-radio__native-control:disabled + .mdc-radio__background {\n  cursor: default;\n}\n.mat-mdc-list-option .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-disabled-selected-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-radio-disabled-selected-icon-opacity, 0.38);\n}\n.mat-mdc-list-option .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-disabled-selected-icon-color, var(--mat-sys-on-surface, currentColor));\n  opacity: var(--mat-radio-disabled-selected-icon-opacity, 0.38);\n}\n.mat-mdc-list-option .mdc-radio__native-control:enabled:not(:checked) + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-unselected-icon-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-list-option .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-selected-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-list-option .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-selected-icon-color, var(--mat-sys-primary, currentColor));\n}\n.mat-mdc-list-option .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  transform: scale(0.5);\n  transition: transform 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-list-option._mat-animation-noopable .mdc-radio__background::before,\n.mat-mdc-list-option._mat-animation-noopable .mdc-radio__outer-circle,\n.mat-mdc-list-option._mat-animation-noopable .mdc-radio__inner-circle {\n  transition: none !important;\n}\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mat-mdc-checkbox-touch-target,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mdc-checkbox__native-control,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mdc-checkbox__ripple,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mat-mdc-checkbox-ripple::before,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mdc-checkbox__background,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__mixedmark, .mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mat-mdc-checkbox-touch-target,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mdc-checkbox__native-control,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mdc-checkbox__ripple,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mat-mdc-checkbox-ripple::before,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mdc-checkbox__background,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__mixedmark {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-list-option .mdc-checkbox__native-control, .mat-mdc-list-option .mdc-radio__native-control {\n  display: none;\n}\n\n@media (forced-colors: active) {\n  .mat-mdc-list-option.mdc-list-item--selected::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  .mat-mdc-list-option.mdc-list-item--selected [dir=rtl]::after {\n    right: auto;\n    left: 16px;\n  }\n}\n"],
    dependencies: [{
      kind: "directive",
      type: NgTemplateOutlet,
      selector: "[ngTemplateOutlet]",
      inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"]
    }, {
      kind: "directive",
      type: CdkObserveContent,
      selector: "[cdkObserveContent]",
      inputs: ["cdkObserveContentDisabled", "debounce"],
      outputs: ["cdkObserveContent"],
      exportAs: ["cdkObserveContent"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatListOption,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-list-option',
      exportAs: 'matListOption',
      host: {
        'class': 'mat-mdc-list-item mat-mdc-list-option mdc-list-item',
        'role': 'option',
        '[class.mdc-list-item--selected]': 'selected && !_selectionList.multiple && _selectionList.hideSingleSelectionIndicator',
        '[class.mdc-list-item--with-leading-avatar]': '_hasProjected("avatars", "before")',
        '[class.mdc-list-item--with-leading-icon]': '_hasProjected("icons", "before")',
        '[class.mdc-list-item--with-trailing-icon]': '_hasProjected("icons", "after")',
        '[class.mat-mdc-list-option-with-trailing-avatar]': '_hasProjected("avatars", "after")',
        '[class.mdc-list-item--with-leading-checkbox]': '_hasCheckboxAt("before")',
        '[class.mdc-list-item--with-trailing-checkbox]': '_hasCheckboxAt("after")',
        '[class.mdc-list-item--with-leading-radio]': '_hasRadioAt("before")',
        '[class.mdc-list-item--with-trailing-radio]': '_hasRadioAt("after")',
        '[class.mat-mdc-list-item-both-leading-and-trailing]': '_hasBothLeadingAndTrailing()',
        '[class.mat-accent]': 'color !== "primary" && color !== "warn"',
        '[class.mat-warn]': 'color === "warn"',
        '[class._mat-animation-noopable]': '_noopAnimations',
        '[attr.aria-selected]': 'selected',
        '(blur)': '_handleBlur()',
        '(click)': '_toggleOnInteraction()'
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [{
        provide: MatListItemBase,
        useExisting: MatListOption
      }, {
        provide: LIST_OPTION,
        useExisting: MatListOption
      }],
      imports: [NgTemplateOutlet, CdkObserveContent],
      template: "<!--\n  Save icons and the pseudo checkbox/radio so that they can be re-used in the template without\n  duplication. Also content can only be injected once so we need to extract icons/avatars\n  into a template since we use it in multiple places.\n-->\n<ng-template #icons>\n  <ng-content select=\"[matListItemAvatar],[matListItemIcon]\">\n  </ng-content>\n</ng-template>\n\n<ng-template #checkbox>\n  <div class=\"mdc-checkbox\" [class.mdc-checkbox--disabled]=\"disabled\">\n    <input type=\"checkbox\" class=\"mdc-checkbox__native-control\"\n           [checked]=\"selected\" [disabled]=\"disabled\"/>\n    <div class=\"mdc-checkbox__background\">\n      <svg class=\"mdc-checkbox__checkmark\"\n           viewBox=\"0 0 24 24\"\n           aria-hidden=\"true\">\n        <path class=\"mdc-checkbox__checkmark-path\"\n              fill=\"none\"\n              d=\"M1.73,12.91 8.1,19.28 22.79,4.59\"/>\n      </svg>\n      <div class=\"mdc-checkbox__mixedmark\"></div>\n    </div>\n  </div>\n</ng-template>\n\n<ng-template #radio>\n  <div class=\"mdc-radio\" [class.mdc-radio--disabled]=\"disabled\">\n    <input type=\"radio\" class=\"mdc-radio__native-control\"\n           [checked]=\"selected\" [disabled]=\"disabled\"/>\n    <div class=\"mdc-radio__background\">\n      <div class=\"mdc-radio__outer-circle\"></div>\n      <div class=\"mdc-radio__inner-circle\"></div>\n    </div>\n  </div>\n</ng-template>\n\n@if (_hasCheckboxAt('before')) {\n  <!-- Container for the checkbox at start. -->\n  <span class=\"mdc-list-item__start mat-mdc-list-option-checkbox-before\">\n    <ng-template [ngTemplateOutlet]=\"checkbox\"></ng-template>\n  </span>\n} @else if (_hasRadioAt('before')) {\n  <!-- Container for the radio at the start. -->\n  <span class=\"mdc-list-item__start mat-mdc-list-option-radio-before\">\n    <ng-template [ngTemplateOutlet]=\"radio\"></ng-template>\n  </span>\n}\n<!-- Conditionally renders icons/avatars before the list item text. -->\n@if (_hasIconsOrAvatarsAt('before')) {\n  <ng-template [ngTemplateOutlet]=\"icons\"></ng-template>\n}\n\n<!-- Text -->\n<span class=\"mdc-list-item__content\">\n  <ng-content select=\"[matListItemTitle]\"></ng-content>\n  <ng-content select=\"[matListItemLine]\"></ng-content>\n  <span #unscopedContent class=\"mat-mdc-list-item-unscoped-content\"\n        (cdkObserveContent)=\"_updateItemLines(true)\">\n    <ng-content></ng-content>\n  </span>\n</span>\n\n@if (_hasCheckboxAt('after')) {\n  <!-- Container for the checkbox at the end. -->\n  <span class=\"mdc-list-item__end\">\n    <ng-template [ngTemplateOutlet]=\"checkbox\"></ng-template>\n  </span>\n} @else if (_hasRadioAt('after')) {\n  <!-- Container for the radio at the end. -->\n  <span class=\"mdc-list-item__end\">\n    <ng-template [ngTemplateOutlet]=\"radio\"></ng-template>\n  </span>\n}\n\n<!-- Conditionally renders icons/avatars after the list item text. -->\n@if (_hasIconsOrAvatarsAt('after')) {\n  <ng-template [ngTemplateOutlet]=\"icons\"></ng-template>\n}\n\n<!-- Divider -->\n<ng-content select=\"mat-divider\"></ng-content>\n\n<!--\n  Strong focus indicator element. MDC uses the `::before` pseudo element for the default\n  focus/hover/selected state, so we need a separate element.\n-->\n<div class=\"mat-focus-indicator\"></div>\n",
      styles: [".mat-mdc-list-option-with-trailing-avatar.mdc-list-item, [dir=rtl] .mat-mdc-list-option-with-trailing-avatar.mdc-list-item {\n  padding-left: 0;\n  padding-right: 0;\n}\n.mat-mdc-list-option-with-trailing-avatar .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 16px;\n  width: 40px;\n  height: 40px;\n}\n.mat-mdc-list-option-with-trailing-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mat-mdc-list-option-with-trailing-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mat-mdc-list-option-with-trailing-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n.mat-mdc-list-option-with-trailing-avatar .mdc-list-item__end {\n  border-radius: 50%;\n}\n\n.mat-mdc-list-option .mdc-checkbox {\n  display: inline-block;\n  position: relative;\n  flex: 0 0 18px;\n  box-sizing: content-box;\n  width: 18px;\n  height: 18px;\n  line-height: 0;\n  white-space: nowrap;\n  cursor: pointer;\n  vertical-align: bottom;\n  padding: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);\n  margin: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n}\n.mat-mdc-list-option .mdc-checkbox .mdc-checkbox__native-control {\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  opacity: 0;\n  cursor: inherit;\n  z-index: 1;\n  width: var(--mat-checkbox-state-layer-size, 40px);\n  height: var(--mat-checkbox-state-layer-size, 40px);\n  top: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n  right: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n  left: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n}\n.mat-mdc-list-option .mdc-checkbox--disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-list-option .mdc-checkbox__background {\n  display: inline-flex;\n  position: absolute;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 18px;\n  height: 18px;\n  border: 2px solid currentColor;\n  border-radius: 2px;\n  background-color: transparent;\n  pointer-events: none;\n  will-change: background-color, border-color;\n  transition: background-color 90ms cubic-bezier(0.4, 0, 0.6, 1), border-color 90ms cubic-bezier(0.4, 0, 0.6, 1);\n  -webkit-print-color-adjust: exact;\n  color-adjust: exact;\n  border-color: var(--mat-checkbox-unselected-icon-color, var(--mat-sys-on-surface-variant));\n  top: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);\n  left: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-selected-icon-color, var(--mat-sys-primary));\n  background-color: var(--mat-checkbox-selected-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-list-option .mdc-checkbox--disabled .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox--disabled .mdc-checkbox__background {\n    border-color: GrayText;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {\n  background-color: var(--mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  border-color: transparent;\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,\n  .mat-mdc-list-option .mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {\n    border-color: GrayText;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox:hover > .mdc-checkbox__native-control:not(:checked) ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox:hover > .mdc-checkbox__native-control:not(:indeterminate) ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-unselected-hover-icon-color, var(--mat-sys-on-surface));\n  background-color: transparent;\n}\n.mat-mdc-list-option .mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox:hover > .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-selected-hover-icon-color, var(--mat-sys-primary));\n  background-color: var(--mat-checkbox-selected-hover-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:focus:focus:not(:checked) ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox__native-control:focus:focus:not(:indeterminate) ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-unselected-focus-icon-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:focus:focus:checked ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox__native-control:focus:focus:indeterminate ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-selected-focus-icon-color, var(--mat-sys-primary));\n  background-color: var(--mat-checkbox-selected-focus-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,\n  .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,\n  .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {\n    border-color: GrayText;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {\n  background-color: var(--mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  border-color: transparent;\n}\n.mat-mdc-list-option .mdc-checkbox__checkmark {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  opacity: 0;\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.6, 1);\n  color: var(--mat-checkbox-selected-checkmark-color, var(--mat-sys-on-primary));\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox__checkmark {\n    color: CanvasText;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox--disabled .mdc-checkbox__checkmark, .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {\n  color: var(--mat-checkbox-disabled-selected-checkmark-color, var(--mat-sys-surface));\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox--disabled .mdc-checkbox__checkmark, .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {\n    color: GrayText;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox__checkmark-path {\n  transition: stroke-dashoffset 180ms cubic-bezier(0.4, 0, 0.6, 1);\n  stroke: currentColor;\n  stroke-width: 3.12px;\n  stroke-dashoffset: 29.7833385;\n  stroke-dasharray: 29.7833385;\n}\n.mat-mdc-list-option .mdc-checkbox__mixedmark {\n  width: 100%;\n  height: 0;\n  transform: scaleX(0) rotate(0deg);\n  border-width: 1px;\n  border-style: solid;\n  opacity: 0;\n  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);\n  border-color: var(--mat-checkbox-selected-checkmark-color, var(--mat-sys-on-primary));\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox__mixedmark {\n    margin: 0 1px;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {\n  border-color: var(--mat-checkbox-disabled-selected-checkmark-color, var(--mat-sys-surface));\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mat-mdc-list-option .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {\n    border-color: GrayText;\n  }\n}\n.mat-mdc-list-option .mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background {\n  animation-duration: 180ms;\n  animation-timing-function: linear;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path {\n  animation: mdc-checkbox-unchecked-checked-checkmark-path 180ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path {\n  animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark {\n  animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark {\n  animation: mdc-checkbox-indeterminate-checked-checkmark 500ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-indeterminate-checked-mixedmark 500ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear;\n  transition: none;\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,\n.mat-mdc-list-option .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {\n  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,\n.mat-mdc-list-option .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path {\n  stroke-dashoffset: 0;\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {\n  transition: opacity 180ms cubic-bezier(0, 0, 0.2, 1), transform 180ms cubic-bezier(0, 0, 0.2, 1);\n  opacity: 1;\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {\n  transform: scaleX(1) rotate(-45deg);\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {\n  transform: rotate(45deg);\n  opacity: 0;\n  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);\n}\n.mat-mdc-list-option .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {\n  transform: scaleX(1) rotate(0deg);\n  opacity: 1;\n}\n@keyframes mdc-checkbox-unchecked-checked-checkmark-path {\n  0%, 50% {\n    stroke-dashoffset: 29.7833385;\n  }\n  50% {\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  100% {\n    stroke-dashoffset: 0;\n  }\n}\n@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {\n  0%, 68.2% {\n    transform: scaleX(0);\n  }\n  68.2% {\n    animation-timing-function: cubic-bezier(0, 0, 0, 1);\n  }\n  100% {\n    transform: scaleX(1);\n  }\n}\n@keyframes mdc-checkbox-checked-unchecked-checkmark-path {\n  from {\n    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);\n    opacity: 1;\n    stroke-dashoffset: 0;\n  }\n  to {\n    opacity: 0;\n    stroke-dashoffset: -29.7833385;\n  }\n}\n@keyframes mdc-checkbox-checked-indeterminate-checkmark {\n  from {\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    transform: rotate(0deg);\n    opacity: 1;\n  }\n  to {\n    transform: rotate(45deg);\n    opacity: 0;\n  }\n}\n@keyframes mdc-checkbox-indeterminate-checked-checkmark {\n  from {\n    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    transform: rotate(45deg);\n    opacity: 0;\n  }\n  to {\n    transform: rotate(360deg);\n    opacity: 1;\n  }\n}\n@keyframes mdc-checkbox-checked-indeterminate-mixedmark {\n  from {\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    transform: rotate(-45deg);\n    opacity: 0;\n  }\n  to {\n    transform: rotate(0deg);\n    opacity: 1;\n  }\n}\n@keyframes mdc-checkbox-indeterminate-checked-mixedmark {\n  from {\n    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    transform: rotate(0deg);\n    opacity: 1;\n  }\n  to {\n    transform: rotate(315deg);\n    opacity: 0;\n  }\n}\n@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {\n  0% {\n    animation-timing-function: linear;\n    transform: scaleX(1);\n    opacity: 1;\n  }\n  32.8%, 100% {\n    transform: scaleX(0);\n    opacity: 0;\n  }\n}\n.mat-mdc-list-option .mdc-radio {\n  display: inline-block;\n  position: relative;\n  flex: 0 0 auto;\n  box-sizing: content-box;\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n  will-change: opacity, transform, border-color, color;\n  padding: calc((var(--mat-radio-state-layer-size, 40px) - 20px) / 2);\n}\n.mat-mdc-list-option .mdc-radio__background {\n  display: inline-block;\n  position: relative;\n  box-sizing: border-box;\n  width: 20px;\n  height: 20px;\n}\n.mat-mdc-list-option .mdc-radio__background::before {\n  position: absolute;\n  transform: scale(0, 0);\n  border-radius: 50%;\n  opacity: 0;\n  pointer-events: none;\n  content: \"\";\n  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);\n  width: var(--mat-radio-state-layer-size, 40px);\n  height: var(--mat-radio-state-layer-size, 40px);\n  top: calc(-1 * (var(--mat-radio-state-layer-size, 40px) - 20px) / 2);\n  left: calc(-1 * (var(--mat-radio-state-layer-size, 40px) - 20px) / 2);\n}\n.mat-mdc-list-option .mdc-radio__outer-circle {\n  position: absolute;\n  top: 0;\n  left: 0;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  border-width: 2px;\n  border-style: solid;\n  border-radius: 50%;\n  transition: border-color 90ms cubic-bezier(0.4, 0, 0.6, 1);\n}\n.mat-mdc-list-option .mdc-radio__inner-circle {\n  position: absolute;\n  top: 0;\n  left: 0;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  transform: scale(0);\n  border-radius: 50%;\n  transition: transform 90ms cubic-bezier(0.4, 0, 0.6, 1), background-color 90ms cubic-bezier(0.4, 0, 0.6, 1);\n}\n@media (forced-colors: active) {\n  .mat-mdc-list-option .mdc-radio__inner-circle {\n    background-color: CanvasText !important;\n  }\n}\n.mat-mdc-list-option .mdc-radio__native-control {\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  opacity: 0;\n  top: 0;\n  right: 0;\n  left: 0;\n  cursor: inherit;\n  z-index: 1;\n  width: var(--mat-radio-state-layer-size, 40px);\n  height: var(--mat-radio-state-layer-size, 40px);\n}\n.mat-mdc-list-option .mdc-radio__native-control:checked + .mdc-radio__background, .mat-mdc-list-option .mdc-radio__native-control:disabled + .mdc-radio__background {\n  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 1), transform 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-list-option .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__outer-circle, .mat-mdc-list-option .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__outer-circle {\n  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-list-option .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__inner-circle, .mat-mdc-list-option .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__inner-circle {\n  transition: transform 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-list-option .mdc-radio__native-control:disabled:not(:checked) + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-disabled-unselected-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-radio-disabled-unselected-icon-opacity, 0.38);\n}\n.mat-mdc-list-option .mdc-radio__native-control:disabled + .mdc-radio__background {\n  cursor: default;\n}\n.mat-mdc-list-option .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-disabled-selected-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-radio-disabled-selected-icon-opacity, 0.38);\n}\n.mat-mdc-list-option .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-disabled-selected-icon-color, var(--mat-sys-on-surface, currentColor));\n  opacity: var(--mat-radio-disabled-selected-icon-opacity, 0.38);\n}\n.mat-mdc-list-option .mdc-radio__native-control:enabled:not(:checked) + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-unselected-icon-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-list-option .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-selected-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-list-option .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-selected-icon-color, var(--mat-sys-primary, currentColor));\n}\n.mat-mdc-list-option .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  transform: scale(0.5);\n  transition: transform 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-list-option._mat-animation-noopable .mdc-radio__background::before,\n.mat-mdc-list-option._mat-animation-noopable .mdc-radio__outer-circle,\n.mat-mdc-list-option._mat-animation-noopable .mdc-radio__inner-circle {\n  transition: none !important;\n}\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mat-mdc-checkbox-touch-target,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mdc-checkbox__native-control,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mdc-checkbox__ripple,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mat-mdc-checkbox-ripple::before,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mdc-checkbox__background,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__start > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__mixedmark, .mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mat-mdc-checkbox-touch-target,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mdc-checkbox__native-control,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mdc-checkbox__ripple,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mat-mdc-checkbox-ripple::before,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mdc-checkbox__background,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,\n.mat-mdc-list-option._mat-animation-noopable > .mdc-list-item__end > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__mixedmark {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-list-option .mdc-checkbox__native-control, .mat-mdc-list-option .mdc-radio__native-control {\n  display: none;\n}\n\n@media (forced-colors: active) {\n  .mat-mdc-list-option.mdc-list-item--selected::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  .mat-mdc-list-option.mdc-list-item--selected [dir=rtl]::after {\n    right: auto;\n    left: 16px;\n  }\n}\n"]
    }]
  }],
  propDecorators: {
    _lines: [{
      type: ContentChildren,
      args: [MatListItemLine, {
        descendants: true
      }]
    }],
    _titles: [{
      type: ContentChildren,
      args: [MatListItemTitle, {
        descendants: true
      }]
    }],
    _unscopedContent: [{
      type: ViewChild,
      args: ['unscopedContent']
    }],
    selectedChange: [{
      type: Output
    }],
    togglePosition: [{
      type: Input
    }],
    checkboxPosition: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    selected: [{
      type: Input
    }]
  }
});

class MatListSubheaderCssMatStyler {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatListSubheaderCssMatStyler,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatListSubheaderCssMatStyler,
    isStandalone: true,
    selector: "[mat-subheader], [matSubheader]",
    host: {
      classAttribute: "mat-mdc-subheader mdc-list-group__subheader"
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatListSubheaderCssMatStyler,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[mat-subheader], [matSubheader]',
      host: {
        'class': 'mat-mdc-subheader mdc-list-group__subheader'
      }
    }]
  }]
});

const MAT_NAV_LIST = new InjectionToken('MatNavList');
class MatNavList extends MatListBase {
  _isNonInteractive = false;
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatNavList,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatNavList,
    isStandalone: true,
    selector: "mat-nav-list",
    host: {
      attributes: {
        "role": "navigation"
      },
      classAttribute: "mat-mdc-nav-list mat-mdc-list-base mdc-list"
    },
    providers: [{
      provide: MatListBase,
      useExisting: MatNavList
    }],
    exportAs: ["matNavList"],
    usesInheritance: true,
    ngImport: i0,
    template: '<ng-content></ng-content>',
    isInline: true,
    styles: [".mdc-list {\n  margin: 0;\n  padding: 8px 0;\n  list-style-type: none;\n}\n.mdc-list:focus {\n  outline: none;\n}\n\n.mdc-list-item {\n  display: flex;\n  position: relative;\n  justify-content: flex-start;\n  overflow: hidden;\n  padding: 0;\n  align-items: stretch;\n  cursor: pointer;\n  padding-left: 16px;\n  padding-right: 16px;\n  background-color: var(--mat-list-list-item-container-color, transparent);\n  border-radius: var(--mat-list-list-item-container-shape, var(--mat-sys-corner-none));\n}\n.mdc-list-item.mdc-list-item--selected {\n  background-color: var(--mat-list-list-item-selected-container-color);\n}\n.mdc-list-item:focus {\n  outline: 0;\n}\n.mdc-list-item.mdc-list-item--disabled {\n  cursor: auto;\n}\n.mdc-list-item.mdc-list-item--with-one-line {\n  height: var(--mat-list-list-item-one-line-container-height, 48px);\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__start {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-two-lines {\n  height: var(--mat-list-list-item-two-line-container-height, 64px);\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-three-lines {\n  height: var(--mat-list-list-item-three-line-container-height, 88px);\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--selected::before, .mdc-list-item.mdc-list-item--selected:focus::before, .mdc-list-item:not(.mdc-list-item--selected):focus::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  content: \"\";\n  pointer-events: none;\n}\n\na.mdc-list-item {\n  color: inherit;\n  text-decoration: none;\n}\n\n.mdc-list-item__start {\n  fill: currentColor;\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-leading-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-leading-icon-size, 24px);\n  height: var(--mat-list-list-item-leading-icon-size, 24px);\n  margin-left: 16px;\n  margin-right: 32px;\n}\n[dir=rtl] .mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-left: 32px;\n  margin-right: 16px;\n}\n.mdc-list-item--with-leading-icon:hover .mdc-list-item__start {\n  color: var(--mat-list-list-item-hover-leading-icon-color);\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  width: var(--mat-list-list-item-leading-avatar-size, 40px);\n  height: var(--mat-list-list-item-leading-avatar-size, 40px);\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start, [dir=rtl] .mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n\n.mdc-list-item__end {\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  font-family: var(--mat-list-list-item-trailing-supporting-text-font, var(--mat-sys-label-small-font));\n  line-height: var(--mat-list-list-item-trailing-supporting-text-line-height, var(--mat-sys-label-small-line-height));\n  font-size: var(--mat-list-list-item-trailing-supporting-text-size, var(--mat-sys-label-small-size));\n  font-weight: var(--mat-list-list-item-trailing-supporting-text-weight, var(--mat-sys-label-small-weight));\n  letter-spacing: var(--mat-list-list-item-trailing-supporting-text-tracking, var(--mat-sys-label-small-tracking));\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-trailing-icon-size, 24px);\n  height: var(--mat-list-list-item-trailing-icon-size, 24px);\n}\n.mdc-list-item--with-trailing-icon:hover .mdc-list-item__end {\n  color: var(--mat-list-list-item-hover-trailing-icon-color);\n}\n.mdc-list-item.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-supporting-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-list-item--selected.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-selected-trailing-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-list-item__content {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  align-self: center;\n  flex: 1;\n  pointer-events: none;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__content, .mdc-list-item--with-three-lines .mdc-list-item__content {\n  align-self: stretch;\n}\n\n.mdc-list-item__primary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  color: var(--mat-list-list-item-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-list-list-item-label-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-list-list-item-label-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-list-list-item-label-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-list-list-item-label-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-list-list-item-label-text-tracking, var(--mat-sys-body-large-tracking));\n}\n.mdc-list-item:hover .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-hover-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item:focus .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-focus-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text, .mdc-list-item--with-three-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n\n.mdc-list-item__secondary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  display: block;\n  margin-top: 0;\n  color: var(--mat-list-list-item-supporting-text-color, var(--mat-sys-on-surface-variant));\n  font-family: var(--mat-list-list-item-supporting-text-font, var(--mat-sys-body-medium-font));\n  line-height: var(--mat-list-list-item-supporting-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-list-list-item-supporting-text-size, var(--mat-sys-body-medium-size));\n  font-weight: var(--mat-list-list-item-supporting-text-weight, var(--mat-sys-body-medium-weight));\n  letter-spacing: var(--mat-list-list-item-supporting-text-tracking, var(--mat-sys-body-medium-tracking));\n}\n.mdc-list-item__secondary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-three-lines .mdc-list-item__secondary-text {\n  white-space: normal;\n  line-height: 20px;\n}\n.mdc-list-item--with-overline .mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: auto;\n}\n\n.mdc-list-item--with-leading-radio.mdc-list-item,\n.mdc-list-item--with-leading-checkbox.mdc-list-item,\n.mdc-list-item--with-leading-icon.mdc-list-item,\n.mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-checkbox.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-icon.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-trailing-icon.mdc-list-item, [dir=rtl] .mdc-list-item--with-trailing-icon.mdc-list-item {\n  padding-left: 0;\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 16px;\n}\n\n.mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  -webkit-user-select: none;\n  user-select: none;\n  margin-left: 28px;\n  margin-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 28px;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end {\n  display: block;\n  line-height: normal;\n  align-self: flex-start;\n  margin-top: 0;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end::before, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-leading-radio .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio .mdc-list-item__start,\n[dir=rtl] .mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-item--with-trailing-radio.mdc-list-item,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-left: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, [dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-radio .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio .mdc-list-item__end,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-three-lines .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-group__subheader {\n  margin: 0.75rem 16px;\n}\n\n.mdc-list-item--disabled .mdc-list-item__start,\n.mdc-list-item--disabled .mdc-list-item__content,\n.mdc-list-item--disabled .mdc-list-item__end {\n  opacity: 1;\n}\n.mdc-list-item--disabled .mdc-list-item__primary-text,\n.mdc-list-item--disabled .mdc-list-item__secondary-text {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n.mdc-list-item--disabled.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-disabled-leading-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-leading-icon-opacity, 0.38);\n}\n.mdc-list-item--disabled.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-disabled-trailing-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-trailing-icon-opacity, 0.38);\n}\n\n.mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing, [dir=rtl] .mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.mdc-list-item.mdc-list-item--disabled .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-disabled-label-text-color, var(--mat-sys-on-surface));\n}\n\n.mdc-list-item:hover::before {\n  background-color: var(--mat-list-list-item-hover-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n\n.mdc-list-item.mdc-list-item--disabled::before {\n  background-color: var(--mat-list-list-item-disabled-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item:focus::before {\n  background-color: var(--mat-list-list-item-focus-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item--disabled .mdc-radio,\n.mdc-list-item--disabled .mdc-checkbox {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n\n.mdc-list-item--with-leading-avatar .mat-mdc-list-item-avatar {\n  border-radius: var(--mat-list-list-item-leading-avatar-shape, var(--mat-sys-corner-full));\n  background-color: var(--mat-list-list-item-leading-avatar-color, var(--mat-sys-primary-container));\n}\n\n.mat-mdc-list-item-icon {\n  font-size: var(--mat-list-list-item-leading-icon-size, 24px);\n}\n\n@media (forced-colors: active) {\n  a.mdc-list-item--activated::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  a.mdc-list-item--activated [dir=rtl]::after {\n    right: auto;\n    left: 16px;\n  }\n}\n\n.mat-mdc-list-base {\n  display: block;\n}\n.mat-mdc-list-base .mdc-list-item__start,\n.mat-mdc-list-base .mdc-list-item__end,\n.mat-mdc-list-base .mdc-list-item__content {\n  pointer-events: auto;\n}\n\n.mat-mdc-list-item,\n.mat-mdc-list-option {\n  width: 100%;\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-list-item:not(.mat-mdc-list-item-interactive),\n.mat-mdc-list-option:not(.mat-mdc-list-item-interactive) {\n  cursor: default;\n}\n.mat-mdc-list-item .mat-divider-inset,\n.mat-mdc-list-option .mat-divider-inset {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n.mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-left: 72px;\n}\n[dir=rtl] .mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n[dir=rtl] .mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-right: 72px;\n}\n\n.mat-mdc-list-item-interactive::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  content: \"\";\n  opacity: 0;\n  pointer-events: none;\n  border-radius: inherit;\n}\n\n.mat-mdc-list-item > .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n.mat-mdc-list-item:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n}\n\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-line.mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: normal;\n}\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-unscoped-content.mdc-list-item__secondary-text {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n\nmat-action-list button {\n  background: none;\n  color: inherit;\n  border: none;\n  font: inherit;\n  outline: inherit;\n  -webkit-tap-highlight-color: transparent;\n  text-align: start;\n}\nmat-action-list button::-moz-focus-inner {\n  border: 0;\n}\n\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-inline-start: var(--mat-list-list-item-leading-icon-start-space, 16px);\n  margin-inline-end: var(--mat-list-list-item-leading-icon-end-space, 16px);\n}\n\n.mat-mdc-nav-list .mat-mdc-list-item {\n  border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n  --mat-focus-indicator-border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-nav-list .mat-mdc-list-item.mdc-list-item--activated {\n  background-color: var(--mat-list-active-indicator-color, var(--mat-sys-secondary-container));\n}\n"],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatNavList,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-nav-list',
      exportAs: 'matNavList',
      template: '<ng-content></ng-content>',
      host: {
        'class': 'mat-mdc-nav-list mat-mdc-list-base mdc-list',
        'role': 'navigation'
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [{
        provide: MatListBase,
        useExisting: MatNavList
      }],
      styles: [".mdc-list {\n  margin: 0;\n  padding: 8px 0;\n  list-style-type: none;\n}\n.mdc-list:focus {\n  outline: none;\n}\n\n.mdc-list-item {\n  display: flex;\n  position: relative;\n  justify-content: flex-start;\n  overflow: hidden;\n  padding: 0;\n  align-items: stretch;\n  cursor: pointer;\n  padding-left: 16px;\n  padding-right: 16px;\n  background-color: var(--mat-list-list-item-container-color, transparent);\n  border-radius: var(--mat-list-list-item-container-shape, var(--mat-sys-corner-none));\n}\n.mdc-list-item.mdc-list-item--selected {\n  background-color: var(--mat-list-list-item-selected-container-color);\n}\n.mdc-list-item:focus {\n  outline: 0;\n}\n.mdc-list-item.mdc-list-item--disabled {\n  cursor: auto;\n}\n.mdc-list-item.mdc-list-item--with-one-line {\n  height: var(--mat-list-list-item-one-line-container-height, 48px);\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__start {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-two-lines {\n  height: var(--mat-list-list-item-two-line-container-height, 64px);\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-three-lines {\n  height: var(--mat-list-list-item-three-line-container-height, 88px);\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--selected::before, .mdc-list-item.mdc-list-item--selected:focus::before, .mdc-list-item:not(.mdc-list-item--selected):focus::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  content: \"\";\n  pointer-events: none;\n}\n\na.mdc-list-item {\n  color: inherit;\n  text-decoration: none;\n}\n\n.mdc-list-item__start {\n  fill: currentColor;\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-leading-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-leading-icon-size, 24px);\n  height: var(--mat-list-list-item-leading-icon-size, 24px);\n  margin-left: 16px;\n  margin-right: 32px;\n}\n[dir=rtl] .mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-left: 32px;\n  margin-right: 16px;\n}\n.mdc-list-item--with-leading-icon:hover .mdc-list-item__start {\n  color: var(--mat-list-list-item-hover-leading-icon-color);\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  width: var(--mat-list-list-item-leading-avatar-size, 40px);\n  height: var(--mat-list-list-item-leading-avatar-size, 40px);\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start, [dir=rtl] .mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n\n.mdc-list-item__end {\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  font-family: var(--mat-list-list-item-trailing-supporting-text-font, var(--mat-sys-label-small-font));\n  line-height: var(--mat-list-list-item-trailing-supporting-text-line-height, var(--mat-sys-label-small-line-height));\n  font-size: var(--mat-list-list-item-trailing-supporting-text-size, var(--mat-sys-label-small-size));\n  font-weight: var(--mat-list-list-item-trailing-supporting-text-weight, var(--mat-sys-label-small-weight));\n  letter-spacing: var(--mat-list-list-item-trailing-supporting-text-tracking, var(--mat-sys-label-small-tracking));\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-trailing-icon-size, 24px);\n  height: var(--mat-list-list-item-trailing-icon-size, 24px);\n}\n.mdc-list-item--with-trailing-icon:hover .mdc-list-item__end {\n  color: var(--mat-list-list-item-hover-trailing-icon-color);\n}\n.mdc-list-item.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-supporting-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-list-item--selected.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-selected-trailing-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-list-item__content {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  align-self: center;\n  flex: 1;\n  pointer-events: none;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__content, .mdc-list-item--with-three-lines .mdc-list-item__content {\n  align-self: stretch;\n}\n\n.mdc-list-item__primary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  color: var(--mat-list-list-item-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-list-list-item-label-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-list-list-item-label-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-list-list-item-label-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-list-list-item-label-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-list-list-item-label-text-tracking, var(--mat-sys-body-large-tracking));\n}\n.mdc-list-item:hover .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-hover-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item:focus .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-focus-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text, .mdc-list-item--with-three-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n\n.mdc-list-item__secondary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  display: block;\n  margin-top: 0;\n  color: var(--mat-list-list-item-supporting-text-color, var(--mat-sys-on-surface-variant));\n  font-family: var(--mat-list-list-item-supporting-text-font, var(--mat-sys-body-medium-font));\n  line-height: var(--mat-list-list-item-supporting-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-list-list-item-supporting-text-size, var(--mat-sys-body-medium-size));\n  font-weight: var(--mat-list-list-item-supporting-text-weight, var(--mat-sys-body-medium-weight));\n  letter-spacing: var(--mat-list-list-item-supporting-text-tracking, var(--mat-sys-body-medium-tracking));\n}\n.mdc-list-item__secondary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-three-lines .mdc-list-item__secondary-text {\n  white-space: normal;\n  line-height: 20px;\n}\n.mdc-list-item--with-overline .mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: auto;\n}\n\n.mdc-list-item--with-leading-radio.mdc-list-item,\n.mdc-list-item--with-leading-checkbox.mdc-list-item,\n.mdc-list-item--with-leading-icon.mdc-list-item,\n.mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-checkbox.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-icon.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-trailing-icon.mdc-list-item, [dir=rtl] .mdc-list-item--with-trailing-icon.mdc-list-item {\n  padding-left: 0;\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 16px;\n}\n\n.mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  -webkit-user-select: none;\n  user-select: none;\n  margin-left: 28px;\n  margin-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 28px;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end {\n  display: block;\n  line-height: normal;\n  align-self: flex-start;\n  margin-top: 0;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end::before, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-leading-radio .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio .mdc-list-item__start,\n[dir=rtl] .mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-item--with-trailing-radio.mdc-list-item,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-left: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, [dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-radio .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio .mdc-list-item__end,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-three-lines .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-group__subheader {\n  margin: 0.75rem 16px;\n}\n\n.mdc-list-item--disabled .mdc-list-item__start,\n.mdc-list-item--disabled .mdc-list-item__content,\n.mdc-list-item--disabled .mdc-list-item__end {\n  opacity: 1;\n}\n.mdc-list-item--disabled .mdc-list-item__primary-text,\n.mdc-list-item--disabled .mdc-list-item__secondary-text {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n.mdc-list-item--disabled.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-disabled-leading-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-leading-icon-opacity, 0.38);\n}\n.mdc-list-item--disabled.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-disabled-trailing-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-trailing-icon-opacity, 0.38);\n}\n\n.mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing, [dir=rtl] .mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.mdc-list-item.mdc-list-item--disabled .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-disabled-label-text-color, var(--mat-sys-on-surface));\n}\n\n.mdc-list-item:hover::before {\n  background-color: var(--mat-list-list-item-hover-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n\n.mdc-list-item.mdc-list-item--disabled::before {\n  background-color: var(--mat-list-list-item-disabled-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item:focus::before {\n  background-color: var(--mat-list-list-item-focus-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item--disabled .mdc-radio,\n.mdc-list-item--disabled .mdc-checkbox {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n\n.mdc-list-item--with-leading-avatar .mat-mdc-list-item-avatar {\n  border-radius: var(--mat-list-list-item-leading-avatar-shape, var(--mat-sys-corner-full));\n  background-color: var(--mat-list-list-item-leading-avatar-color, var(--mat-sys-primary-container));\n}\n\n.mat-mdc-list-item-icon {\n  font-size: var(--mat-list-list-item-leading-icon-size, 24px);\n}\n\n@media (forced-colors: active) {\n  a.mdc-list-item--activated::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  a.mdc-list-item--activated [dir=rtl]::after {\n    right: auto;\n    left: 16px;\n  }\n}\n\n.mat-mdc-list-base {\n  display: block;\n}\n.mat-mdc-list-base .mdc-list-item__start,\n.mat-mdc-list-base .mdc-list-item__end,\n.mat-mdc-list-base .mdc-list-item__content {\n  pointer-events: auto;\n}\n\n.mat-mdc-list-item,\n.mat-mdc-list-option {\n  width: 100%;\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-list-item:not(.mat-mdc-list-item-interactive),\n.mat-mdc-list-option:not(.mat-mdc-list-item-interactive) {\n  cursor: default;\n}\n.mat-mdc-list-item .mat-divider-inset,\n.mat-mdc-list-option .mat-divider-inset {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n.mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-left: 72px;\n}\n[dir=rtl] .mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n[dir=rtl] .mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-right: 72px;\n}\n\n.mat-mdc-list-item-interactive::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  content: \"\";\n  opacity: 0;\n  pointer-events: none;\n  border-radius: inherit;\n}\n\n.mat-mdc-list-item > .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n.mat-mdc-list-item:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n}\n\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-line.mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: normal;\n}\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-unscoped-content.mdc-list-item__secondary-text {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n\nmat-action-list button {\n  background: none;\n  color: inherit;\n  border: none;\n  font: inherit;\n  outline: inherit;\n  -webkit-tap-highlight-color: transparent;\n  text-align: start;\n}\nmat-action-list button::-moz-focus-inner {\n  border: 0;\n}\n\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-inline-start: var(--mat-list-list-item-leading-icon-start-space, 16px);\n  margin-inline-end: var(--mat-list-list-item-leading-icon-end-space, 16px);\n}\n\n.mat-mdc-nav-list .mat-mdc-list-item {\n  border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n  --mat-focus-indicator-border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-nav-list .mat-mdc-list-item.mdc-list-item--activated {\n  background-color: var(--mat-list-active-indicator-color, var(--mat-sys-secondary-container));\n}\n"]
    }]
  }]
});

const MAT_SELECTION_LIST_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatSelectionList),
  multi: true
};
class MatSelectionListChange {
  source;
  options;
  constructor(source, options) {
    this.source = source;
    this.options = options;
  }
}
class MatSelectionList extends MatListBase {
  _element = inject(ElementRef);
  _ngZone = inject(NgZone);
  _renderer = inject(Renderer2);
  _initialized = false;
  _keyManager;
  _listenerCleanups;
  _destroyed = new Subject();
  _isDestroyed = false;
  _onChange = _ => {};
  _items;
  selectionChange = new EventEmitter();
  color = 'accent';
  compareWith = (a1, a2) => a1 === a2;
  get multiple() {
    return this._multiple;
  }
  set multiple(value) {
    const newValue = coerceBooleanProperty(value);
    if (newValue !== this._multiple) {
      if ((typeof ngDevMode === 'undefined' || ngDevMode) && this._initialized) {
        throw new Error('Cannot change `multiple` mode of mat-selection-list after initialization.');
      }
      this._multiple = newValue;
      this.selectedOptions = new SelectionModel(this._multiple, this.selectedOptions.selected);
    }
  }
  _multiple = true;
  get hideSingleSelectionIndicator() {
    return this._hideSingleSelectionIndicator;
  }
  set hideSingleSelectionIndicator(value) {
    this._hideSingleSelectionIndicator = coerceBooleanProperty(value);
  }
  _hideSingleSelectionIndicator = this._defaultOptions?.hideSingleSelectionIndicator ?? false;
  selectedOptions = new SelectionModel(this._multiple);
  _value = null;
  _onTouched = () => {};
  _changeDetectorRef = inject(ChangeDetectorRef);
  constructor() {
    super();
    this._isNonInteractive = false;
  }
  ngAfterViewInit() {
    this._initialized = true;
    this._setupRovingTabindex();
    this._ngZone.runOutsideAngular(() => {
      this._listenerCleanups = [this._renderer.listen(this._element.nativeElement, 'focusin', this._handleFocusin), this._renderer.listen(this._element.nativeElement, 'focusout', this._handleFocusout)];
    });
    if (this._value) {
      this._setOptionsFromValues(this._value);
    }
    this._watchForSelectionChange();
  }
  ngOnChanges(changes) {
    const disabledChanges = changes['disabled'];
    const disableRippleChanges = changes['disableRipple'];
    const hideSingleSelectionIndicatorChanges = changes['hideSingleSelectionIndicator'];
    if (disableRippleChanges && !disableRippleChanges.firstChange || disabledChanges && !disabledChanges.firstChange || hideSingleSelectionIndicatorChanges && !hideSingleSelectionIndicatorChanges.firstChange) {
      this._markOptionsForCheck();
    }
  }
  ngOnDestroy() {
    this._keyManager?.destroy();
    this._listenerCleanups?.forEach(current => current());
    this._destroyed.next();
    this._destroyed.complete();
    this._isDestroyed = true;
  }
  focus(options) {
    this._element.nativeElement.focus(options);
  }
  selectAll() {
    return this._setAllOptionsSelected(true);
  }
  deselectAll() {
    return this._setAllOptionsSelected(false);
  }
  _reportValueChange() {
    if (this.options && !this._isDestroyed) {
      const value = this._getSelectedOptionValues();
      this._onChange(value);
      this._value = value;
    }
  }
  _emitChangeEvent(options) {
    this.selectionChange.emit(new MatSelectionListChange(this, options));
  }
  writeValue(values) {
    this._value = values;
    if (this.options) {
      this._setOptionsFromValues(values || []);
    }
  }
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
    this._markOptionsForCheck();
  }
  get disabled() {
    return this._selectionListDisabled();
  }
  set disabled(value) {
    this._selectionListDisabled.set(coerceBooleanProperty(value));
    if (this._selectionListDisabled()) {
      this._keyManager?.setActiveItem(-1);
    }
  }
  _selectionListDisabled = signal(false, ...(ngDevMode ? [{
    debugName: "_selectionListDisabled"
  }] : []));
  registerOnChange(fn) {
    this._onChange = fn;
  }
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  _watchForSelectionChange() {
    this.selectedOptions.changed.pipe(takeUntil(this._destroyed)).subscribe(event => {
      for (let item of event.added) {
        item.selected = true;
      }
      for (let item of event.removed) {
        item.selected = false;
      }
      if (!this._containsFocus()) {
        this._resetActiveOption();
      }
    });
  }
  _setOptionsFromValues(values) {
    this.options.forEach(option => option._setSelected(false));
    values.forEach(value => {
      const correspondingOption = this.options.find(option => {
        return option.selected ? false : this.compareWith(option.value, value);
      });
      if (correspondingOption) {
        correspondingOption._setSelected(true);
      }
    });
  }
  _getSelectedOptionValues() {
    return this.options.filter(option => option.selected).map(option => option.value);
  }
  _markOptionsForCheck() {
    if (this.options) {
      this.options.forEach(option => option._markForCheck());
    }
  }
  _setAllOptionsSelected(isSelected, skipDisabled) {
    const changedOptions = [];
    this.options.forEach(option => {
      if ((!skipDisabled || !option.disabled) && option._setSelected(isSelected)) {
        changedOptions.push(option);
      }
    });
    if (changedOptions.length) {
      this._reportValueChange();
    }
    return changedOptions;
  }
  get options() {
    return this._items;
  }
  _handleKeydown(event) {
    const activeItem = this._keyManager.activeItem;
    if ((event.keyCode === ENTER || event.keyCode === SPACE) && !this._keyManager.isTyping() && activeItem && !activeItem.disabled) {
      event.preventDefault();
      activeItem._toggleOnInteraction();
    } else if (event.keyCode === A && this.multiple && !this._keyManager.isTyping() && hasModifierKey(event, 'ctrlKey', 'metaKey')) {
      const shouldSelect = this.options.some(option => !option.disabled && !option.selected);
      event.preventDefault();
      this._emitChangeEvent(this._setAllOptionsSelected(shouldSelect, true));
    } else {
      this._keyManager.onKeydown(event);
    }
  }
  _handleFocusout = () => {
    setTimeout(() => {
      if (!this._containsFocus()) {
        this._resetActiveOption();
      }
    });
  };
  _handleFocusin = event => {
    if (this.disabled) {
      return;
    }
    const activeIndex = this._items.toArray().findIndex(item => item._elementRef.nativeElement.contains(event.target));
    if (activeIndex > -1) {
      this._setActiveOption(activeIndex);
    } else {
      this._resetActiveOption();
    }
  };
  _setupRovingTabindex() {
    this._keyManager = new FocusKeyManager(this._items).withHomeAndEnd().withTypeAhead().withWrap().skipPredicate(() => this.disabled);
    this._resetActiveOption();
    this._keyManager.change.subscribe(activeItemIndex => this._setActiveOption(activeItemIndex));
    this._items.changes.pipe(takeUntil(this._destroyed)).subscribe(() => {
      const activeItem = this._keyManager.activeItem;
      if (!activeItem || this._items.toArray().indexOf(activeItem) === -1) {
        this._resetActiveOption();
      }
    });
  }
  _setActiveOption(index) {
    this._items.forEach((item, itemIndex) => item._setTabindex(itemIndex === index ? 0 : -1));
    this._keyManager.updateActiveItem(index);
  }
  _resetActiveOption() {
    if (this.disabled) {
      this._setActiveOption(-1);
      return;
    }
    const activeItem = this._items.find(item => item.selected && !item.disabled) || this._items.first;
    this._setActiveOption(activeItem ? this._items.toArray().indexOf(activeItem) : -1);
  }
  _containsFocus() {
    const activeElement = _getFocusedElementPierceShadowDom();
    return activeElement && this._element.nativeElement.contains(activeElement);
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatSelectionList,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    type: MatSelectionList,
    isStandalone: true,
    selector: "mat-selection-list",
    inputs: {
      color: "color",
      compareWith: "compareWith",
      multiple: "multiple",
      hideSingleSelectionIndicator: "hideSingleSelectionIndicator",
      disabled: "disabled"
    },
    outputs: {
      selectionChange: "selectionChange"
    },
    host: {
      attributes: {
        "role": "listbox"
      },
      listeners: {
        "keydown": "_handleKeydown($event)"
      },
      properties: {
        "attr.aria-multiselectable": "multiple"
      },
      classAttribute: "mat-mdc-selection-list mat-mdc-list-base mdc-list"
    },
    providers: [MAT_SELECTION_LIST_VALUE_ACCESSOR, {
      provide: MatListBase,
      useExisting: MatSelectionList
    }, {
      provide: SELECTION_LIST,
      useExisting: MatSelectionList
    }],
    queries: [{
      propertyName: "_items",
      predicate: MatListOption,
      descendants: true
    }],
    exportAs: ["matSelectionList"],
    usesInheritance: true,
    usesOnChanges: true,
    ngImport: i0,
    template: '<ng-content></ng-content>',
    isInline: true,
    styles: [".mdc-list {\n  margin: 0;\n  padding: 8px 0;\n  list-style-type: none;\n}\n.mdc-list:focus {\n  outline: none;\n}\n\n.mdc-list-item {\n  display: flex;\n  position: relative;\n  justify-content: flex-start;\n  overflow: hidden;\n  padding: 0;\n  align-items: stretch;\n  cursor: pointer;\n  padding-left: 16px;\n  padding-right: 16px;\n  background-color: var(--mat-list-list-item-container-color, transparent);\n  border-radius: var(--mat-list-list-item-container-shape, var(--mat-sys-corner-none));\n}\n.mdc-list-item.mdc-list-item--selected {\n  background-color: var(--mat-list-list-item-selected-container-color);\n}\n.mdc-list-item:focus {\n  outline: 0;\n}\n.mdc-list-item.mdc-list-item--disabled {\n  cursor: auto;\n}\n.mdc-list-item.mdc-list-item--with-one-line {\n  height: var(--mat-list-list-item-one-line-container-height, 48px);\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__start {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-two-lines {\n  height: var(--mat-list-list-item-two-line-container-height, 64px);\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-three-lines {\n  height: var(--mat-list-list-item-three-line-container-height, 88px);\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--selected::before, .mdc-list-item.mdc-list-item--selected:focus::before, .mdc-list-item:not(.mdc-list-item--selected):focus::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  content: \"\";\n  pointer-events: none;\n}\n\na.mdc-list-item {\n  color: inherit;\n  text-decoration: none;\n}\n\n.mdc-list-item__start {\n  fill: currentColor;\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-leading-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-leading-icon-size, 24px);\n  height: var(--mat-list-list-item-leading-icon-size, 24px);\n  margin-left: 16px;\n  margin-right: 32px;\n}\n[dir=rtl] .mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-left: 32px;\n  margin-right: 16px;\n}\n.mdc-list-item--with-leading-icon:hover .mdc-list-item__start {\n  color: var(--mat-list-list-item-hover-leading-icon-color);\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  width: var(--mat-list-list-item-leading-avatar-size, 40px);\n  height: var(--mat-list-list-item-leading-avatar-size, 40px);\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start, [dir=rtl] .mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n\n.mdc-list-item__end {\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  font-family: var(--mat-list-list-item-trailing-supporting-text-font, var(--mat-sys-label-small-font));\n  line-height: var(--mat-list-list-item-trailing-supporting-text-line-height, var(--mat-sys-label-small-line-height));\n  font-size: var(--mat-list-list-item-trailing-supporting-text-size, var(--mat-sys-label-small-size));\n  font-weight: var(--mat-list-list-item-trailing-supporting-text-weight, var(--mat-sys-label-small-weight));\n  letter-spacing: var(--mat-list-list-item-trailing-supporting-text-tracking, var(--mat-sys-label-small-tracking));\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-trailing-icon-size, 24px);\n  height: var(--mat-list-list-item-trailing-icon-size, 24px);\n}\n.mdc-list-item--with-trailing-icon:hover .mdc-list-item__end {\n  color: var(--mat-list-list-item-hover-trailing-icon-color);\n}\n.mdc-list-item.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-supporting-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-list-item--selected.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-selected-trailing-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-list-item__content {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  align-self: center;\n  flex: 1;\n  pointer-events: none;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__content, .mdc-list-item--with-three-lines .mdc-list-item__content {\n  align-self: stretch;\n}\n\n.mdc-list-item__primary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  color: var(--mat-list-list-item-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-list-list-item-label-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-list-list-item-label-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-list-list-item-label-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-list-list-item-label-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-list-list-item-label-text-tracking, var(--mat-sys-body-large-tracking));\n}\n.mdc-list-item:hover .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-hover-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item:focus .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-focus-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text, .mdc-list-item--with-three-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n\n.mdc-list-item__secondary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  display: block;\n  margin-top: 0;\n  color: var(--mat-list-list-item-supporting-text-color, var(--mat-sys-on-surface-variant));\n  font-family: var(--mat-list-list-item-supporting-text-font, var(--mat-sys-body-medium-font));\n  line-height: var(--mat-list-list-item-supporting-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-list-list-item-supporting-text-size, var(--mat-sys-body-medium-size));\n  font-weight: var(--mat-list-list-item-supporting-text-weight, var(--mat-sys-body-medium-weight));\n  letter-spacing: var(--mat-list-list-item-supporting-text-tracking, var(--mat-sys-body-medium-tracking));\n}\n.mdc-list-item__secondary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-three-lines .mdc-list-item__secondary-text {\n  white-space: normal;\n  line-height: 20px;\n}\n.mdc-list-item--with-overline .mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: auto;\n}\n\n.mdc-list-item--with-leading-radio.mdc-list-item,\n.mdc-list-item--with-leading-checkbox.mdc-list-item,\n.mdc-list-item--with-leading-icon.mdc-list-item,\n.mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-checkbox.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-icon.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-trailing-icon.mdc-list-item, [dir=rtl] .mdc-list-item--with-trailing-icon.mdc-list-item {\n  padding-left: 0;\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 16px;\n}\n\n.mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  -webkit-user-select: none;\n  user-select: none;\n  margin-left: 28px;\n  margin-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 28px;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end {\n  display: block;\n  line-height: normal;\n  align-self: flex-start;\n  margin-top: 0;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end::before, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-leading-radio .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio .mdc-list-item__start,\n[dir=rtl] .mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-item--with-trailing-radio.mdc-list-item,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-left: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, [dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-radio .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio .mdc-list-item__end,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-three-lines .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-group__subheader {\n  margin: 0.75rem 16px;\n}\n\n.mdc-list-item--disabled .mdc-list-item__start,\n.mdc-list-item--disabled .mdc-list-item__content,\n.mdc-list-item--disabled .mdc-list-item__end {\n  opacity: 1;\n}\n.mdc-list-item--disabled .mdc-list-item__primary-text,\n.mdc-list-item--disabled .mdc-list-item__secondary-text {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n.mdc-list-item--disabled.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-disabled-leading-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-leading-icon-opacity, 0.38);\n}\n.mdc-list-item--disabled.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-disabled-trailing-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-trailing-icon-opacity, 0.38);\n}\n\n.mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing, [dir=rtl] .mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.mdc-list-item.mdc-list-item--disabled .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-disabled-label-text-color, var(--mat-sys-on-surface));\n}\n\n.mdc-list-item:hover::before {\n  background-color: var(--mat-list-list-item-hover-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n\n.mdc-list-item.mdc-list-item--disabled::before {\n  background-color: var(--mat-list-list-item-disabled-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item:focus::before {\n  background-color: var(--mat-list-list-item-focus-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item--disabled .mdc-radio,\n.mdc-list-item--disabled .mdc-checkbox {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n\n.mdc-list-item--with-leading-avatar .mat-mdc-list-item-avatar {\n  border-radius: var(--mat-list-list-item-leading-avatar-shape, var(--mat-sys-corner-full));\n  background-color: var(--mat-list-list-item-leading-avatar-color, var(--mat-sys-primary-container));\n}\n\n.mat-mdc-list-item-icon {\n  font-size: var(--mat-list-list-item-leading-icon-size, 24px);\n}\n\n@media (forced-colors: active) {\n  a.mdc-list-item--activated::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  a.mdc-list-item--activated [dir=rtl]::after {\n    right: auto;\n    left: 16px;\n  }\n}\n\n.mat-mdc-list-base {\n  display: block;\n}\n.mat-mdc-list-base .mdc-list-item__start,\n.mat-mdc-list-base .mdc-list-item__end,\n.mat-mdc-list-base .mdc-list-item__content {\n  pointer-events: auto;\n}\n\n.mat-mdc-list-item,\n.mat-mdc-list-option {\n  width: 100%;\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-list-item:not(.mat-mdc-list-item-interactive),\n.mat-mdc-list-option:not(.mat-mdc-list-item-interactive) {\n  cursor: default;\n}\n.mat-mdc-list-item .mat-divider-inset,\n.mat-mdc-list-option .mat-divider-inset {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n.mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-left: 72px;\n}\n[dir=rtl] .mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n[dir=rtl] .mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-right: 72px;\n}\n\n.mat-mdc-list-item-interactive::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  content: \"\";\n  opacity: 0;\n  pointer-events: none;\n  border-radius: inherit;\n}\n\n.mat-mdc-list-item > .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n.mat-mdc-list-item:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n}\n\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-line.mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: normal;\n}\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-unscoped-content.mdc-list-item__secondary-text {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n\nmat-action-list button {\n  background: none;\n  color: inherit;\n  border: none;\n  font: inherit;\n  outline: inherit;\n  -webkit-tap-highlight-color: transparent;\n  text-align: start;\n}\nmat-action-list button::-moz-focus-inner {\n  border: 0;\n}\n\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-inline-start: var(--mat-list-list-item-leading-icon-start-space, 16px);\n  margin-inline-end: var(--mat-list-list-item-leading-icon-end-space, 16px);\n}\n\n.mat-mdc-nav-list .mat-mdc-list-item {\n  border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n  --mat-focus-indicator-border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-nav-list .mat-mdc-list-item.mdc-list-item--activated {\n  background-color: var(--mat-list-active-indicator-color, var(--mat-sys-secondary-container));\n}\n"],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatSelectionList,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-selection-list',
      exportAs: 'matSelectionList',
      host: {
        'class': 'mat-mdc-selection-list mat-mdc-list-base mdc-list',
        'role': 'listbox',
        '[attr.aria-multiselectable]': 'multiple',
        '(keydown)': '_handleKeydown($event)'
      },
      template: '<ng-content></ng-content>',
      encapsulation: ViewEncapsulation.None,
      providers: [MAT_SELECTION_LIST_VALUE_ACCESSOR, {
        provide: MatListBase,
        useExisting: MatSelectionList
      }, {
        provide: SELECTION_LIST,
        useExisting: MatSelectionList
      }],
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [".mdc-list {\n  margin: 0;\n  padding: 8px 0;\n  list-style-type: none;\n}\n.mdc-list:focus {\n  outline: none;\n}\n\n.mdc-list-item {\n  display: flex;\n  position: relative;\n  justify-content: flex-start;\n  overflow: hidden;\n  padding: 0;\n  align-items: stretch;\n  cursor: pointer;\n  padding-left: 16px;\n  padding-right: 16px;\n  background-color: var(--mat-list-list-item-container-color, transparent);\n  border-radius: var(--mat-list-list-item-container-shape, var(--mat-sys-corner-none));\n}\n.mdc-list-item.mdc-list-item--selected {\n  background-color: var(--mat-list-list-item-selected-container-color);\n}\n.mdc-list-item:focus {\n  outline: 0;\n}\n.mdc-list-item.mdc-list-item--disabled {\n  cursor: auto;\n}\n.mdc-list-item.mdc-list-item--with-one-line {\n  height: var(--mat-list-list-item-one-line-container-height, 48px);\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__start {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-one-line .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-two-lines {\n  height: var(--mat-list-list-item-two-line-container-height, 64px);\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-two-lines .mdc-list-item__end {\n  align-self: center;\n  margin-top: 0;\n}\n.mdc-list-item.mdc-list-item--with-three-lines {\n  height: var(--mat-list-list-item-three-line-container-height, 88px);\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 16px;\n}\n.mdc-list-item.mdc-list-item--selected::before, .mdc-list-item.mdc-list-item--selected:focus::before, .mdc-list-item:not(.mdc-list-item--selected):focus::before {\n  position: absolute;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  content: \"\";\n  pointer-events: none;\n}\n\na.mdc-list-item {\n  color: inherit;\n  text-decoration: none;\n}\n\n.mdc-list-item__start {\n  fill: currentColor;\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-leading-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-leading-icon-size, 24px);\n  height: var(--mat-list-list-item-leading-icon-size, 24px);\n  margin-left: 16px;\n  margin-right: 32px;\n}\n[dir=rtl] .mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-left: 32px;\n  margin-right: 16px;\n}\n.mdc-list-item--with-leading-icon:hover .mdc-list-item__start {\n  color: var(--mat-list-list-item-hover-leading-icon-color);\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  width: var(--mat-list-list-item-leading-avatar-size, 40px);\n  height: var(--mat-list-list-item-leading-avatar-size, 40px);\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n.mdc-list-item--with-leading-avatar .mdc-list-item__start, [dir=rtl] .mdc-list-item--with-leading-avatar .mdc-list-item__start {\n  margin-left: 16px;\n  margin-right: 16px;\n  border-radius: 50%;\n}\n\n.mdc-list-item__end {\n  flex-shrink: 0;\n  pointer-events: none;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  font-family: var(--mat-list-list-item-trailing-supporting-text-font, var(--mat-sys-label-small-font));\n  line-height: var(--mat-list-list-item-trailing-supporting-text-line-height, var(--mat-sys-label-small-line-height));\n  font-size: var(--mat-list-list-item-trailing-supporting-text-size, var(--mat-sys-label-small-size));\n  font-weight: var(--mat-list-list-item-trailing-supporting-text-weight, var(--mat-sys-label-small-weight));\n  letter-spacing: var(--mat-list-list-item-trailing-supporting-text-tracking, var(--mat-sys-label-small-tracking));\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-icon-color, var(--mat-sys-on-surface-variant));\n  width: var(--mat-list-list-item-trailing-icon-size, 24px);\n  height: var(--mat-list-list-item-trailing-icon-size, 24px);\n}\n.mdc-list-item--with-trailing-icon:hover .mdc-list-item__end {\n  color: var(--mat-list-list-item-hover-trailing-icon-color);\n}\n.mdc-list-item.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  color: var(--mat-list-list-item-trailing-supporting-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-list-item--selected.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-selected-trailing-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-list-item__content {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  align-self: center;\n  flex: 1;\n  pointer-events: none;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__content, .mdc-list-item--with-three-lines .mdc-list-item__content {\n  align-self: stretch;\n}\n\n.mdc-list-item__primary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  color: var(--mat-list-list-item-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-list-list-item-label-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-list-list-item-label-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-list-list-item-label-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-list-list-item-label-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-list-list-item-label-text-tracking, var(--mat-sys-body-large-tracking));\n}\n.mdc-list-item:hover .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-hover-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item:focus .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-focus-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text, .mdc-list-item--with-three-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after, .mdc-list-item--with-three-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n\n.mdc-list-item__secondary-text {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n  display: block;\n  margin-top: 0;\n  color: var(--mat-list-list-item-supporting-text-color, var(--mat-sys-on-surface-variant));\n  font-family: var(--mat-list-list-item-supporting-text-font, var(--mat-sys-body-medium-font));\n  line-height: var(--mat-list-list-item-supporting-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-list-list-item-supporting-text-size, var(--mat-sys-body-medium-size));\n  font-weight: var(--mat-list-list-item-supporting-text-weight, var(--mat-sys-body-medium-weight));\n  letter-spacing: var(--mat-list-list-item-supporting-text-tracking, var(--mat-sys-body-medium-tracking));\n}\n.mdc-list-item__secondary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-three-lines .mdc-list-item__secondary-text {\n  white-space: normal;\n  line-height: 20px;\n}\n.mdc-list-item--with-overline .mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: auto;\n}\n\n.mdc-list-item--with-leading-radio.mdc-list-item,\n.mdc-list-item--with-leading-checkbox.mdc-list-item,\n.mdc-list-item--with-leading-icon.mdc-list-item,\n.mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-checkbox.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-icon.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-leading-avatar.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n  margin-bottom: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after {\n  display: inline-block;\n  width: 0;\n  height: 20px;\n  content: \"\";\n  vertical-align: -20px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  display: block;\n  margin-top: 0;\n  line-height: normal;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-icon.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before,\n.mdc-list-item--with-leading-avatar.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 32px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-trailing-icon.mdc-list-item, [dir=rtl] .mdc-list-item--with-trailing-icon.mdc-list-item {\n  padding-left: 0;\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 16px;\n}\n\n.mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  -webkit-user-select: none;\n  user-select: none;\n  margin-left: 28px;\n  margin-right: 16px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-meta .mdc-list-item__end {\n  margin-left: 16px;\n  margin-right: 28px;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end {\n  display: block;\n  line-height: normal;\n  align-self: flex-start;\n  margin-top: 0;\n}\n.mdc-list-item--with-trailing-meta.mdc-list-item--with-three-lines .mdc-list-item__end::before, .mdc-list-item--with-trailing-meta.mdc-list-item--with-two-lines .mdc-list-item__end::before {\n  display: inline-block;\n  width: 0;\n  height: 28px;\n  content: \"\";\n  vertical-align: 0;\n}\n\n.mdc-list-item--with-leading-radio .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n[dir=rtl] .mdc-list-item--with-leading-radio .mdc-list-item__start,\n[dir=rtl] .mdc-list-item--with-leading-checkbox .mdc-list-item__start {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n.mdc-list-item--with-leading-radio.mdc-list-item--with-two-lines .mdc-list-item__start,\n.mdc-list-item--with-leading-checkbox.mdc-list-item--with-two-lines .mdc-list-item__start {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-item--with-trailing-radio.mdc-list-item,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 16px;\n  padding-right: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item {\n  padding-left: 0;\n  padding-right: 16px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-left: 0;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-icon, [dir=rtl] .mdc-list-item--with-trailing-radio.mdc-list-item--with-leading-avatar,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-icon,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox.mdc-list-item--with-leading-avatar {\n  padding-right: 0;\n}\n.mdc-list-item--with-trailing-radio .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 24px;\n  margin-right: 8px;\n}\n[dir=rtl] .mdc-list-item--with-trailing-radio .mdc-list-item__end,\n[dir=rtl] .mdc-list-item--with-trailing-checkbox .mdc-list-item__end {\n  margin-left: 8px;\n  margin-right: 24px;\n}\n.mdc-list-item--with-trailing-radio.mdc-list-item--with-three-lines .mdc-list-item__end,\n.mdc-list-item--with-trailing-checkbox.mdc-list-item--with-three-lines .mdc-list-item__end {\n  align-self: flex-start;\n  margin-top: 8px;\n}\n\n.mdc-list-group__subheader {\n  margin: 0.75rem 16px;\n}\n\n.mdc-list-item--disabled .mdc-list-item__start,\n.mdc-list-item--disabled .mdc-list-item__content,\n.mdc-list-item--disabled .mdc-list-item__end {\n  opacity: 1;\n}\n.mdc-list-item--disabled .mdc-list-item__primary-text,\n.mdc-list-item--disabled .mdc-list-item__secondary-text {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n.mdc-list-item--disabled.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  color: var(--mat-list-list-item-disabled-leading-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-leading-icon-opacity, 0.38);\n}\n.mdc-list-item--disabled.mdc-list-item--with-trailing-icon .mdc-list-item__end {\n  color: var(--mat-list-list-item-disabled-trailing-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-trailing-icon-opacity, 0.38);\n}\n\n.mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing, [dir=rtl] .mat-mdc-list-item.mat-mdc-list-item-both-leading-and-trailing {\n  padding-left: 0;\n  padding-right: 0;\n}\n\n.mdc-list-item.mdc-list-item--disabled .mdc-list-item__primary-text {\n  color: var(--mat-list-list-item-disabled-label-text-color, var(--mat-sys-on-surface));\n}\n\n.mdc-list-item:hover::before {\n  background-color: var(--mat-list-list-item-hover-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n\n.mdc-list-item.mdc-list-item--disabled::before {\n  background-color: var(--mat-list-list-item-disabled-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-disabled-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item:focus::before {\n  background-color: var(--mat-list-list-item-focus-state-layer-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-list-list-item-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n}\n\n.mdc-list-item--disabled .mdc-radio,\n.mdc-list-item--disabled .mdc-checkbox {\n  opacity: var(--mat-list-list-item-disabled-label-text-opacity, 0.3);\n}\n\n.mdc-list-item--with-leading-avatar .mat-mdc-list-item-avatar {\n  border-radius: var(--mat-list-list-item-leading-avatar-shape, var(--mat-sys-corner-full));\n  background-color: var(--mat-list-list-item-leading-avatar-color, var(--mat-sys-primary-container));\n}\n\n.mat-mdc-list-item-icon {\n  font-size: var(--mat-list-list-item-leading-icon-size, 24px);\n}\n\n@media (forced-colors: active) {\n  a.mdc-list-item--activated::after {\n    content: \"\";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  a.mdc-list-item--activated [dir=rtl]::after {\n    right: auto;\n    left: 16px;\n  }\n}\n\n.mat-mdc-list-base {\n  display: block;\n}\n.mat-mdc-list-base .mdc-list-item__start,\n.mat-mdc-list-base .mdc-list-item__end,\n.mat-mdc-list-base .mdc-list-item__content {\n  pointer-events: auto;\n}\n\n.mat-mdc-list-item,\n.mat-mdc-list-option {\n  width: 100%;\n  box-sizing: border-box;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-list-item:not(.mat-mdc-list-item-interactive),\n.mat-mdc-list-option:not(.mat-mdc-list-item-interactive) {\n  cursor: default;\n}\n.mat-mdc-list-item .mat-divider-inset,\n.mat-mdc-list-option .mat-divider-inset {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n.mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-left: 72px;\n}\n[dir=rtl] .mat-mdc-list-item .mat-mdc-list-item-avatar ~ .mat-divider-inset,\n[dir=rtl] .mat-mdc-list-option .mat-mdc-list-item-avatar ~ .mat-divider-inset {\n  margin-right: 72px;\n}\n\n.mat-mdc-list-item-interactive::before {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  content: \"\";\n  opacity: 0;\n  pointer-events: none;\n  border-radius: inherit;\n}\n\n.mat-mdc-list-item > .mat-focus-indicator {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n.mat-mdc-list-item:focus-visible > .mat-focus-indicator::before {\n  content: \"\";\n}\n\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-line.mdc-list-item__secondary-text {\n  white-space: nowrap;\n  line-height: normal;\n}\n.mat-mdc-list-item.mdc-list-item--with-three-lines .mat-mdc-list-item-unscoped-content.mdc-list-item__secondary-text {\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n}\n\nmat-action-list button {\n  background: none;\n  color: inherit;\n  border: none;\n  font: inherit;\n  outline: inherit;\n  -webkit-tap-highlight-color: transparent;\n  text-align: start;\n}\nmat-action-list button::-moz-focus-inner {\n  border: 0;\n}\n\n.mdc-list-item--with-leading-icon .mdc-list-item__start {\n  margin-inline-start: var(--mat-list-list-item-leading-icon-start-space, 16px);\n  margin-inline-end: var(--mat-list-list-item-leading-icon-end-space, 16px);\n}\n\n.mat-mdc-nav-list .mat-mdc-list-item {\n  border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n  --mat-focus-indicator-border-radius: var(--mat-list-active-indicator-shape, var(--mat-sys-corner-full));\n}\n.mat-mdc-nav-list .mat-mdc-list-item.mdc-list-item--activated {\n  background-color: var(--mat-list-active-indicator-color, var(--mat-sys-secondary-container));\n}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    _items: [{
      type: ContentChildren,
      args: [MatListOption, {
        descendants: true
      }]
    }],
    selectionChange: [{
      type: Output
    }],
    color: [{
      type: Input
    }],
    compareWith: [{
      type: Input
    }],
    multiple: [{
      type: Input
    }],
    hideSingleSelectionIndicator: [{
      type: Input
    }],
    disabled: [{
      type: Input
    }]
  }
});

class MatListModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatListModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatListModule,
    imports: [ObserversModule, MatRippleModule, MatPseudoCheckboxModule, MatList, MatActionList, MatNavList, MatSelectionList, MatListItem, MatListOption, MatListSubheaderCssMatStyler, MatListItemAvatar, MatListItemIcon, MatListItemLine, MatListItemTitle, MatListItemMeta],
    exports: [BidiModule, MatList, MatActionList, MatNavList, MatSelectionList, MatListItem, MatListOption, MatListItemAvatar, MatListItemIcon, MatListSubheaderCssMatStyler, MatDividerModule, MatListItemLine, MatListItemTitle, MatListItemMeta]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "22.0.0-next.6",
    ngImport: i0,
    type: MatListModule,
    imports: [ObserversModule, MatRippleModule, MatPseudoCheckboxModule, BidiModule, MatDividerModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "22.0.0-next.6",
  ngImport: i0,
  type: MatListModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [ObserversModule, MatRippleModule, MatPseudoCheckboxModule, MatList, MatActionList, MatNavList, MatSelectionList, MatListItem, MatListOption, MatListSubheaderCssMatStyler, MatListItemAvatar, MatListItemIcon, MatListItemLine, MatListItemTitle, MatListItemMeta],
      exports: [BidiModule, MatList, MatActionList, MatNavList, MatSelectionList, MatListItem, MatListOption, MatListItemAvatar, MatListItemIcon, MatListSubheaderCssMatStyler, MatDividerModule, MatListItemLine, MatListItemTitle, MatListItemMeta]
    }]
  }]
});

export { MAT_LIST, MAT_LIST_CONFIG, MAT_NAV_LIST, MAT_SELECTION_LIST_VALUE_ACCESSOR, MatActionList, MatList, MatListItem, MatListItemAvatar, MatListItemIcon, MatListItemLine, MatListItemMeta, MatListItemTitle, MatListModule, MatListOption, MatListSubheaderCssMatStyler, MatNavList, MatSelectionList, MatSelectionListChange, SELECTION_LIST, _MatListItemGraphicBase };
//# sourceMappingURL=list.mjs.map

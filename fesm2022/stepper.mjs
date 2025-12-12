import { BidiModule } from '@angular/cdk/bidi';
import { TemplatePortal, CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import { CdkStepLabel, CdkStepHeader, CdkStep, CdkStepper, CdkStepperNext, CdkStepperPrevious, CdkStepperModule } from '@angular/cdk/stepper';
import * as i0 from '@angular/core';
import { Directive, Injectable, inject, ChangeDetectorRef, Component, ViewEncapsulation, ChangeDetectionStrategy, Input, TemplateRef, ViewContainerRef, ContentChild, NgZone, Renderer2, signal, QueryList, EventEmitter, ElementRef, ViewChildren, ContentChildren, Output, NgModule } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject, Subscription } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';
import { _CdkPrivateStyleLoader, _VisuallyHiddenLoader } from '@angular/cdk/private';
import { MatIcon, MatIconModule } from './icon.mjs';
import { _StructuralStylesLoader } from './_structural-styles-chunk.mjs';
import { MatRipple } from './_ripple-chunk.mjs';
import { Platform } from '@angular/cdk/platform';
import { switchMap, map, startWith, takeUntil } from 'rxjs/operators';
import { ErrorStateMatcher } from './_error-options-chunk.mjs';
import { _animationsDisabled } from './_animation-chunk.mjs';
import { MatRippleModule } from './_ripple-module-chunk.mjs';
import './_icon-registry-chunk.mjs';
import '@angular/common/http';
import '@angular/platform-browser';
import '@angular/cdk/coercion';
import '@angular/cdk/layout';

class MatStepLabel extends CdkStepLabel {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStepLabel,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatStepLabel,
    isStandalone: true,
    selector: "[matStepLabel]",
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatStepLabel,
  decorators: [{
    type: Directive,
    args: [{
      selector: '[matStepLabel]'
    }]
  }]
});

class MatStepperIntl {
  changes = new Subject();
  optionalLabel = 'Optional';
  completedLabel = 'Completed';
  editableLabel = 'Editable';
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStepperIntl,
    deps: [],
    target: i0.ɵɵFactoryTarget.Injectable
  });
  static ɵprov = i0.ɵɵngDeclareInjectable({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStepperIntl,
    providedIn: 'root'
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatStepperIntl,
  decorators: [{
    type: Injectable,
    args: [{
      providedIn: 'root'
    }]
  }]
});

class MatStepHeader extends CdkStepHeader {
  _intl = inject(MatStepperIntl);
  _focusMonitor = inject(FocusMonitor);
  _intlSubscription;
  state;
  label;
  errorMessage;
  iconOverrides;
  index;
  selected;
  active;
  optional;
  disableRipple;
  color;
  constructor() {
    super();
    const styleLoader = inject(_CdkPrivateStyleLoader);
    styleLoader.load(_StructuralStylesLoader);
    styleLoader.load(_VisuallyHiddenLoader);
    const changeDetectorRef = inject(ChangeDetectorRef);
    this._intlSubscription = this._intl.changes.subscribe(() => changeDetectorRef.markForCheck());
  }
  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true);
  }
  ngOnDestroy() {
    this._intlSubscription.unsubscribe();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
  focus(origin, options) {
    if (origin) {
      this._focusMonitor.focusVia(this._elementRef, origin, options);
    } else {
      this._elementRef.nativeElement.focus(options);
    }
  }
  _stringLabel() {
    return this.label instanceof MatStepLabel ? null : this.label;
  }
  _templateLabel() {
    return this.label instanceof MatStepLabel ? this.label : null;
  }
  _getHostElement() {
    return this._elementRef.nativeElement;
  }
  _getDefaultTextForState(state) {
    if (state == 'number') {
      return `${this.index + 1}`;
    }
    if (state == 'edit') {
      return 'create';
    }
    if (state == 'error') {
      return 'warning';
    }
    return state;
  }
  _hasEmptyLabel() {
    return !this._stringLabel() && !this._templateLabel() && !this._hasOptionalLabel() && !this._hasErrorLabel();
  }
  _hasOptionalLabel() {
    return this.optional && this.state !== 'error';
  }
  _hasErrorLabel() {
    return this.state === 'error';
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStepHeader,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "17.0.0",
    version: "21.0.3",
    type: MatStepHeader,
    isStandalone: true,
    selector: "mat-step-header",
    inputs: {
      state: "state",
      label: "label",
      errorMessage: "errorMessage",
      iconOverrides: "iconOverrides",
      index: "index",
      selected: "selected",
      active: "active",
      optional: "optional",
      disableRipple: "disableRipple",
      color: "color"
    },
    host: {
      attributes: {
        "role": ""
      },
      properties: {
        "class.mat-step-header-empty-label": "_hasEmptyLabel()",
        "class": "\"mat-\" + (color || \"primary\")"
      },
      classAttribute: "mat-step-header"
    },
    usesInheritance: true,
    ngImport: i0,
    template: "<div class=\"mat-step-header-ripple mat-focus-indicator\" matRipple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disableRipple\"></div>\n\n<div class=\"mat-step-icon-state-{{state}} mat-step-icon\" [class.mat-step-icon-selected]=\"selected\">\n  <div class=\"mat-step-icon-content\">\n    @if (iconOverrides && iconOverrides[state]) {\n      <ng-container\n        [ngTemplateOutlet]=\"iconOverrides[state]\"\n        [ngTemplateOutletContext]=\"{index, active, optional}\"></ng-container>\n    } @else {\n      @switch (state) {\n        @case ('number') {\n          <span aria-hidden=\"true\">{{_getDefaultTextForState(state)}}</span>\n        }\n\n        @default {\n          @if (state === 'done') {\n            <span class=\"cdk-visually-hidden\">{{_intl.completedLabel}}</span>\n          } @else if (state === 'edit') {\n            <span class=\"cdk-visually-hidden\">{{_intl.editableLabel}}</span>\n          }\n\n          <mat-icon aria-hidden=\"true\">{{_getDefaultTextForState(state)}}</mat-icon>\n        }\n      }\n    }\n  </div>\n</div>\n<div class=\"mat-step-label\"\n     [class.mat-step-label-active]=\"active\"\n     [class.mat-step-label-selected]=\"selected\"\n     [class.mat-step-label-error]=\"state == 'error'\">\n  @if (_templateLabel(); as templateLabel) {\n    <!-- If there is a label template, use it. -->\n    <div class=\"mat-step-text-label\">\n      <ng-container [ngTemplateOutlet]=\"templateLabel.template\"></ng-container>\n    </div>\n  } @else if (_stringLabel()) {\n    <!-- If there is no label template, fall back to the text label. -->\n    <div class=\"mat-step-text-label\">{{label}}</div>\n  }\n\n  @if (_hasOptionalLabel()) {\n    <div class=\"mat-step-optional\">{{_intl.optionalLabel}}</div>\n  }\n\n  @if (_hasErrorLabel()) {\n    <div class=\"mat-step-sub-label-error\">{{errorMessage}}</div>\n  }\n</div>\n\n",
    styles: [".mat-step-header{overflow:hidden;outline:none;cursor:pointer;position:relative;box-sizing:content-box;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-step-header:focus-visible .mat-focus-indicator::before{content:\"\"}.mat-step-header:hover[aria-disabled=true]{cursor:default}.mat-step-header:hover:not([aria-disabled]),.mat-step-header:hover[aria-disabled=false]{background-color:var(--mat-stepper-header-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));border-radius:var(--mat-stepper-header-hover-state-layer-shape, var(--mat-sys-corner-medium))}.mat-step-header.cdk-keyboard-focused,.mat-step-header.cdk-program-focused{background-color:var(--mat-stepper-header-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));border-radius:var(--mat-stepper-header-focus-state-layer-shape, var(--mat-sys-corner-medium))}@media(hover: none){.mat-step-header:hover{background:none}}@media(forced-colors: active){.mat-step-header{outline:solid 1px}.mat-step-header[aria-selected=true] .mat-step-label{text-decoration:underline}.mat-step-header[aria-disabled=true]{outline-color:GrayText}.mat-step-header[aria-disabled=true] .mat-step-label,.mat-step-header[aria-disabled=true] .mat-step-icon,.mat-step-header[aria-disabled=true] .mat-step-optional{color:GrayText}}.mat-step-optional{font-size:12px;color:var(--mat-stepper-header-optional-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-sub-label-error{font-size:12px;font-weight:normal}.mat-step-icon{border-radius:50%;height:24px;width:24px;flex-shrink:0;position:relative;color:var(--mat-stepper-header-icon-foreground-color, var(--mat-sys-surface));background-color:var(--mat-stepper-header-icon-background-color, var(--mat-sys-on-surface-variant))}.mat-step-icon-content{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);display:flex}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-icon-state-error{background-color:var(--mat-stepper-header-error-state-icon-background-color, transparent);color:var(--mat-stepper-header-error-state-icon-foreground-color, var(--mat-sys-error))}.mat-step-icon-state-error .mat-icon{font-size:24px;height:24px;width:24px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle;font-family:var(--mat-stepper-header-label-text-font, var(--mat-sys-title-small-font));font-size:var(--mat-stepper-header-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-stepper-header-label-text-weight, var(--mat-sys-title-small-weight));color:var(--mat-stepper-header-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-label.mat-step-label-active{color:var(--mat-stepper-header-selected-state-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-label.mat-step-label-error{color:var(--mat-stepper-header-error-state-label-text-color, var(--mat-sys-error));font-size:var(--mat-stepper-header-error-state-label-text-size, var(--mat-sys-title-small-size))}.mat-step-label.mat-step-label-selected{font-size:var(--mat-stepper-header-selected-state-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-stepper-header-selected-state-label-text-weight, var(--mat-sys-title-small-weight))}.mat-step-header-empty-label .mat-step-label{min-width:0}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header .mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-step-icon-selected{background-color:var(--mat-stepper-header-selected-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-selected-state-icon-foreground-color, var(--mat-sys-on-primary))}.mat-step-icon-state-done{background-color:var(--mat-stepper-header-done-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-done-state-icon-foreground-color, var(--mat-sys-on-primary))}.mat-step-icon-state-edit{background-color:var(--mat-stepper-header-edit-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-edit-state-icon-foreground-color, var(--mat-sys-on-primary))}\n"],
    dependencies: [{
      kind: "directive",
      type: MatRipple,
      selector: "[mat-ripple], [matRipple]",
      inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"],
      exportAs: ["matRipple"]
    }, {
      kind: "directive",
      type: NgTemplateOutlet,
      selector: "[ngTemplateOutlet]",
      inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"]
    }, {
      kind: "component",
      type: MatIcon,
      selector: "mat-icon",
      inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"],
      exportAs: ["matIcon"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatStepHeader,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-step-header',
      host: {
        'class': 'mat-step-header',
        '[class.mat-step-header-empty-label]': '_hasEmptyLabel()',
        '[class]': '"mat-" + (color || "primary")',
        'role': ''
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [MatRipple, NgTemplateOutlet, MatIcon],
      template: "<div class=\"mat-step-header-ripple mat-focus-indicator\" matRipple\n     [matRippleTrigger]=\"_getHostElement()\"\n     [matRippleDisabled]=\"disableRipple\"></div>\n\n<div class=\"mat-step-icon-state-{{state}} mat-step-icon\" [class.mat-step-icon-selected]=\"selected\">\n  <div class=\"mat-step-icon-content\">\n    @if (iconOverrides && iconOverrides[state]) {\n      <ng-container\n        [ngTemplateOutlet]=\"iconOverrides[state]\"\n        [ngTemplateOutletContext]=\"{index, active, optional}\"></ng-container>\n    } @else {\n      @switch (state) {\n        @case ('number') {\n          <span aria-hidden=\"true\">{{_getDefaultTextForState(state)}}</span>\n        }\n\n        @default {\n          @if (state === 'done') {\n            <span class=\"cdk-visually-hidden\">{{_intl.completedLabel}}</span>\n          } @else if (state === 'edit') {\n            <span class=\"cdk-visually-hidden\">{{_intl.editableLabel}}</span>\n          }\n\n          <mat-icon aria-hidden=\"true\">{{_getDefaultTextForState(state)}}</mat-icon>\n        }\n      }\n    }\n  </div>\n</div>\n<div class=\"mat-step-label\"\n     [class.mat-step-label-active]=\"active\"\n     [class.mat-step-label-selected]=\"selected\"\n     [class.mat-step-label-error]=\"state == 'error'\">\n  @if (_templateLabel(); as templateLabel) {\n    <!-- If there is a label template, use it. -->\n    <div class=\"mat-step-text-label\">\n      <ng-container [ngTemplateOutlet]=\"templateLabel.template\"></ng-container>\n    </div>\n  } @else if (_stringLabel()) {\n    <!-- If there is no label template, fall back to the text label. -->\n    <div class=\"mat-step-text-label\">{{label}}</div>\n  }\n\n  @if (_hasOptionalLabel()) {\n    <div class=\"mat-step-optional\">{{_intl.optionalLabel}}</div>\n  }\n\n  @if (_hasErrorLabel()) {\n    <div class=\"mat-step-sub-label-error\">{{errorMessage}}</div>\n  }\n</div>\n\n",
      styles: [".mat-step-header{overflow:hidden;outline:none;cursor:pointer;position:relative;box-sizing:content-box;-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-step-header:focus-visible .mat-focus-indicator::before{content:\"\"}.mat-step-header:hover[aria-disabled=true]{cursor:default}.mat-step-header:hover:not([aria-disabled]),.mat-step-header:hover[aria-disabled=false]{background-color:var(--mat-stepper-header-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));border-radius:var(--mat-stepper-header-hover-state-layer-shape, var(--mat-sys-corner-medium))}.mat-step-header.cdk-keyboard-focused,.mat-step-header.cdk-program-focused{background-color:var(--mat-stepper-header-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));border-radius:var(--mat-stepper-header-focus-state-layer-shape, var(--mat-sys-corner-medium))}@media(hover: none){.mat-step-header:hover{background:none}}@media(forced-colors: active){.mat-step-header{outline:solid 1px}.mat-step-header[aria-selected=true] .mat-step-label{text-decoration:underline}.mat-step-header[aria-disabled=true]{outline-color:GrayText}.mat-step-header[aria-disabled=true] .mat-step-label,.mat-step-header[aria-disabled=true] .mat-step-icon,.mat-step-header[aria-disabled=true] .mat-step-optional{color:GrayText}}.mat-step-optional{font-size:12px;color:var(--mat-stepper-header-optional-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-sub-label-error{font-size:12px;font-weight:normal}.mat-step-icon{border-radius:50%;height:24px;width:24px;flex-shrink:0;position:relative;color:var(--mat-stepper-header-icon-foreground-color, var(--mat-sys-surface));background-color:var(--mat-stepper-header-icon-background-color, var(--mat-sys-on-surface-variant))}.mat-step-icon-content{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);display:flex}.mat-step-icon .mat-icon{font-size:16px;height:16px;width:16px}.mat-step-icon-state-error{background-color:var(--mat-stepper-header-error-state-icon-background-color, transparent);color:var(--mat-stepper-header-error-state-icon-foreground-color, var(--mat-sys-error))}.mat-step-icon-state-error .mat-icon{font-size:24px;height:24px;width:24px}.mat-step-label{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:50px;vertical-align:middle;font-family:var(--mat-stepper-header-label-text-font, var(--mat-sys-title-small-font));font-size:var(--mat-stepper-header-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-stepper-header-label-text-weight, var(--mat-sys-title-small-weight));color:var(--mat-stepper-header-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-label.mat-step-label-active{color:var(--mat-stepper-header-selected-state-label-text-color, var(--mat-sys-on-surface-variant))}.mat-step-label.mat-step-label-error{color:var(--mat-stepper-header-error-state-label-text-color, var(--mat-sys-error));font-size:var(--mat-stepper-header-error-state-label-text-size, var(--mat-sys-title-small-size))}.mat-step-label.mat-step-label-selected{font-size:var(--mat-stepper-header-selected-state-label-text-size, var(--mat-sys-title-small-size));font-weight:var(--mat-stepper-header-selected-state-label-text-weight, var(--mat-sys-title-small-weight))}.mat-step-header-empty-label .mat-step-label{min-width:0}.mat-step-text-label{text-overflow:ellipsis;overflow:hidden}.mat-step-header .mat-step-header-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none}.mat-step-icon-selected{background-color:var(--mat-stepper-header-selected-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-selected-state-icon-foreground-color, var(--mat-sys-on-primary))}.mat-step-icon-state-done{background-color:var(--mat-stepper-header-done-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-done-state-icon-foreground-color, var(--mat-sys-on-primary))}.mat-step-icon-state-edit{background-color:var(--mat-stepper-header-edit-state-icon-background-color, var(--mat-sys-primary));color:var(--mat-stepper-header-edit-state-icon-foreground-color, var(--mat-sys-on-primary))}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    state: [{
      type: Input
    }],
    label: [{
      type: Input
    }],
    errorMessage: [{
      type: Input
    }],
    iconOverrides: [{
      type: Input
    }],
    index: [{
      type: Input
    }],
    selected: [{
      type: Input
    }],
    active: [{
      type: Input
    }],
    optional: [{
      type: Input
    }],
    disableRipple: [{
      type: Input
    }],
    color: [{
      type: Input
    }]
  }
});

class MatStepperIcon {
  templateRef = inject(TemplateRef);
  name;
  constructor() {}
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStepperIcon,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatStepperIcon,
    isStandalone: true,
    selector: "ng-template[matStepperIcon]",
    inputs: {
      name: ["matStepperIcon", "name"]
    },
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatStepperIcon,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'ng-template[matStepperIcon]'
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    name: [{
      type: Input,
      args: ['matStepperIcon']
    }]
  }
});

class MatStepContent {
  _template = inject(TemplateRef);
  constructor() {}
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStepContent,
    deps: [],
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatStepContent,
    isStandalone: true,
    selector: "ng-template[matStepContent]",
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatStepContent,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'ng-template[matStepContent]'
    }]
  }],
  ctorParameters: () => []
});

class MatStep extends CdkStep {
  _errorStateMatcher = inject(ErrorStateMatcher, {
    skipSelf: true
  });
  _viewContainerRef = inject(ViewContainerRef);
  _isSelected = Subscription.EMPTY;
  stepLabel = undefined;
  color;
  _lazyContent;
  _portal;
  ngAfterContentInit() {
    this._isSelected = this._stepper.steps.changes.pipe(switchMap(() => {
      return this._stepper.selectionChange.pipe(map(event => event.selectedStep === this), startWith(this._stepper.selected === this));
    })).subscribe(isSelected => {
      if (isSelected && this._lazyContent && !this._portal) {
        this._portal = new TemplatePortal(this._lazyContent._template, this._viewContainerRef);
      }
    });
  }
  ngOnDestroy() {
    this._isSelected.unsubscribe();
  }
  isErrorState(control, form) {
    const originalErrorState = this._errorStateMatcher.isErrorState(control, form);
    const customErrorState = !!(control && control.invalid && this.interacted);
    return originalErrorState || customErrorState;
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStep,
    deps: null,
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatStep,
    isStandalone: true,
    selector: "mat-step",
    inputs: {
      color: "color"
    },
    host: {
      attributes: {
        "hidden": ""
      }
    },
    providers: [{
      provide: ErrorStateMatcher,
      useExisting: MatStep
    }, {
      provide: CdkStep,
      useExisting: MatStep
    }],
    queries: [{
      propertyName: "stepLabel",
      first: true,
      predicate: MatStepLabel,
      descendants: true
    }, {
      propertyName: "_lazyContent",
      first: true,
      predicate: MatStepContent,
      descendants: true
    }],
    exportAs: ["matStep"],
    usesInheritance: true,
    ngImport: i0,
    template: "<ng-template>\n  <ng-content></ng-content>\n  <ng-template [cdkPortalOutlet]=\"_portal\"></ng-template>\n</ng-template>\n",
    dependencies: [{
      kind: "directive",
      type: CdkPortalOutlet,
      selector: "[cdkPortalOutlet]",
      inputs: ["cdkPortalOutlet"],
      outputs: ["attached"],
      exportAs: ["cdkPortalOutlet"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatStep,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-step',
      providers: [{
        provide: ErrorStateMatcher,
        useExisting: MatStep
      }, {
        provide: CdkStep,
        useExisting: MatStep
      }],
      encapsulation: ViewEncapsulation.None,
      exportAs: 'matStep',
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [CdkPortalOutlet],
      host: {
        'hidden': ''
      },
      template: "<ng-template>\n  <ng-content></ng-content>\n  <ng-template [cdkPortalOutlet]=\"_portal\"></ng-template>\n</ng-template>\n"
    }]
  }],
  propDecorators: {
    stepLabel: [{
      type: ContentChild,
      args: [MatStepLabel]
    }],
    color: [{
      type: Input
    }],
    _lazyContent: [{
      type: ContentChild,
      args: [MatStepContent, {
        static: false
      }]
    }]
  }
});
class MatStepper extends CdkStepper {
  _ngZone = inject(NgZone);
  _renderer = inject(Renderer2);
  _animationsDisabled = _animationsDisabled();
  _cleanupTransition;
  _isAnimating = signal(false, ...(ngDevMode ? [{
    debugName: "_isAnimating"
  }] : []));
  _stepHeader = undefined;
  _animatedContainers;
  _steps = undefined;
  steps = new QueryList();
  _icons;
  animationDone = new EventEmitter();
  disableRipple;
  color;
  labelPosition = 'end';
  headerPosition = 'top';
  _iconOverrides = {};
  get animationDuration() {
    return this._animationDuration;
  }
  set animationDuration(value) {
    this._animationDuration = /^\d+$/.test(value) ? value + 'ms' : value;
  }
  _animationDuration = '';
  _isServer = !inject(Platform).isBrowser;
  constructor() {
    super();
    const elementRef = inject(ElementRef);
    const nodeName = elementRef.nativeElement.nodeName.toLowerCase();
    this.orientation = nodeName === 'mat-vertical-stepper' ? 'vertical' : 'horizontal';
  }
  ngAfterContentInit() {
    super.ngAfterContentInit();
    this._icons.forEach(({
      name,
      templateRef
    }) => this._iconOverrides[name] = templateRef);
    this.steps.changes.pipe(takeUntil(this._destroyed)).subscribe(() => this._stateChanged());
    this.selectedIndexChange.pipe(takeUntil(this._destroyed)).subscribe(() => {
      const duration = this._getAnimationDuration();
      if (duration === '0ms' || duration === '0s') {
        this._onAnimationDone();
      } else {
        this._isAnimating.set(true);
      }
    });
    this._ngZone.runOutsideAngular(() => {
      if (!this._animationsDisabled) {
        setTimeout(() => {
          this._elementRef.nativeElement.classList.add('mat-stepper-animations-enabled');
          this._cleanupTransition = this._renderer.listen(this._elementRef.nativeElement, 'transitionend', this._handleTransitionend);
        }, 200);
      }
    });
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (typeof queueMicrotask === 'function') {
      let hasEmittedInitial = false;
      this._animatedContainers.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => queueMicrotask(() => {
        if (!hasEmittedInitial) {
          hasEmittedInitial = true;
          this.animationDone.emit();
        }
        this._stateChanged();
      }));
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this._cleanupTransition?.();
  }
  _getAnimationDuration() {
    if (this._animationsDisabled) {
      return '0ms';
    }
    if (this.animationDuration) {
      return this.animationDuration;
    }
    return this.orientation === 'horizontal' ? '500ms' : '225ms';
  }
  _handleTransitionend = event => {
    const target = event.target;
    if (!target) {
      return;
    }
    const isHorizontalActiveElement = this.orientation === 'horizontal' && event.propertyName === 'transform' && target.classList.contains('mat-horizontal-stepper-content-current');
    const isVerticalActiveElement = this.orientation === 'vertical' && event.propertyName === 'grid-template-rows' && target.classList.contains('mat-vertical-content-container-active');
    const shouldEmit = (isHorizontalActiveElement || isVerticalActiveElement) && this._animatedContainers.find(ref => ref.nativeElement === target);
    if (shouldEmit) {
      this._onAnimationDone();
    }
  };
  _onAnimationDone() {
    this._isAnimating.set(false);
    this.animationDone.emit();
  }
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStepper,
    deps: [],
    target: i0.ɵɵFactoryTarget.Component
  });
  static ɵcmp = i0.ɵɵngDeclareComponent({
    minVersion: "17.0.0",
    version: "21.0.3",
    type: MatStepper,
    isStandalone: true,
    selector: "mat-stepper, mat-vertical-stepper, mat-horizontal-stepper, [matStepper]",
    inputs: {
      disableRipple: "disableRipple",
      color: "color",
      labelPosition: "labelPosition",
      headerPosition: "headerPosition",
      animationDuration: "animationDuration"
    },
    outputs: {
      animationDone: "animationDone"
    },
    host: {
      properties: {
        "class.mat-stepper-horizontal": "orientation === \"horizontal\"",
        "class.mat-stepper-vertical": "orientation === \"vertical\"",
        "class.mat-stepper-label-position-end": "orientation === \"horizontal\" && labelPosition == \"end\"",
        "class.mat-stepper-label-position-bottom": "orientation === \"horizontal\" && labelPosition == \"bottom\"",
        "class.mat-stepper-header-position-bottom": "headerPosition === \"bottom\"",
        "class.mat-stepper-animating": "_isAnimating()",
        "style.--mat-stepper-animation-duration": "_getAnimationDuration()"
      }
    },
    providers: [{
      provide: CdkStepper,
      useExisting: MatStepper
    }],
    queries: [{
      propertyName: "_steps",
      predicate: MatStep,
      descendants: true
    }, {
      propertyName: "_icons",
      predicate: MatStepperIcon,
      descendants: true
    }],
    viewQueries: [{
      propertyName: "_stepHeader",
      predicate: MatStepHeader,
      descendants: true
    }, {
      propertyName: "_animatedContainers",
      predicate: ["animatedContainer"],
      descendants: true
    }],
    exportAs: ["matStepper", "matVerticalStepper", "matHorizontalStepper"],
    usesInheritance: true,
    ngImport: i0,
    template: "<!--\n  We need to project the content somewhere to avoid hydration errors. Some observations:\n  1. This is only necessary on the server.\n  2. We get a hydration error if there aren't any nodes after the `ng-content`.\n  3. We get a hydration error if `ng-content` is wrapped in another element.\n-->\n@if (_isServer) {\n  <ng-content/>\n}\n\n@switch (orientation) {\n  @case ('horizontal') {\n    <div class=\"mat-horizontal-stepper-wrapper\">\n      <div \n        aria-orientation=\"horizontal\"\n        class=\"mat-horizontal-stepper-header-container\" \n        role=\"tablist\">\n        @for (step of steps; track step) {\n          <ng-container\n            [ngTemplateOutlet]=\"stepTemplate\"\n            [ngTemplateOutletContext]=\"{step}\"/>\n          @if (!$last) {\n            <div class=\"mat-stepper-horizontal-line\"></div>\n          }\n        }\n      </div>\n\n      <div class=\"mat-horizontal-content-container\">\n        @for (step of steps; track step) {\n          <div\n            #animatedContainer\n            class=\"mat-horizontal-stepper-content\"\n            role=\"tabpanel\"\n            [id]=\"_getStepContentId($index)\"\n            [attr.aria-labelledby]=\"_getStepLabelId($index)\"\n            [class]=\"'mat-horizontal-stepper-content-' + _getAnimationDirection($index)\"\n            [attr.inert]=\"selectedIndex === $index ? null : ''\">\n            <ng-container [ngTemplateOutlet]=\"step.content\"/>\n          </div>\n        }\n      </div>\n    </div>\n  }\n\n  @case ('vertical') {\n    <div class=\"mat-vertical-stepper-wrapper\">\n      @for (step of steps; track step) {\n        <div class=\"mat-step\">\n          <ng-container\n            [ngTemplateOutlet]=\"stepTemplate\"\n            [ngTemplateOutletContext]=\"{step}\"/>\n          <div\n            #animatedContainer\n            class=\"mat-vertical-content-container\"\n            [class.mat-stepper-vertical-line]=\"!$last\"\n            [class.mat-vertical-content-container-active]=\"selectedIndex === $index\"\n            [attr.inert]=\"selectedIndex === $index ? null : ''\">\n            <div \n              class=\"mat-vertical-stepper-content\"\n              role=\"region\"\n              [id]=\"_getStepContentId($index)\"\n              [attr.aria-labelledby]=\"_getStepLabelId($index)\">\n              <div class=\"mat-vertical-content\">\n                <ng-container [ngTemplateOutlet]=\"step.content\"/>\n              </div>\n            </div>\n          </div>\n        </div>\n      }\n    </div>\n  }\n}\n\n<!-- Common step templating -->\n<ng-template let-step=\"step\" #stepTemplate>\n  <mat-step-header\n    [class.mat-horizontal-stepper-header]=\"orientation === 'horizontal'\"\n    [class.mat-vertical-stepper-header]=\"orientation === 'vertical'\"\n    (click)=\"step.select()\"\n    (keydown)=\"_onKeydown($event)\"\n    [tabIndex]=\"_getFocusIndex() === step.index() ? 0 : -1\"\n    [id]=\"_getStepLabelId(step.index())\"\n    [attr.role]=\"orientation === 'horizontal' ? 'tab' : 'button'\"\n    [attr.aria-posinset]=\"orientation === 'horizontal' ? step.index() + 1 : null\"\n    [attr.aria-setsize]=\"orientation === 'horizontal' ? steps.length : null\"\n    [attr.aria-selected]=\"orientation === 'horizontal' ? step.isSelected() : null\"\n    [attr.aria-current]=\"orientation === 'vertical' && step.isSelected() ? 'step' : null\"\n    [attr.aria-disabled]=\"orientation === 'vertical' && step.isSelected() ? 'true' : null\"\n    [attr.aria-expanded]=\"orientation === 'vertical' ? step.isSelected() : null\"\n    [attr.aria-controls]=\"_getStepContentId(step.index())\"\n    [attr.aria-label]=\"step.ariaLabel || null\"\n    [attr.aria-labelledby]=\"(!step.ariaLabel && step.ariaLabelledby) ? step.ariaLabelledby : null\"\n    [attr.aria-disabled]=\"step.isNavigable() ? null : true\"\n    [index]=\"step.index()\"\n    [state]=\"step.indicatorType()\"\n    [label]=\"step.stepLabel || step.label\"\n    [selected]=\"step.isSelected()\"\n    [active]=\"step.isNavigable()\"\n    [optional]=\"step.optional\"\n    [errorMessage]=\"step.errorMessage\"\n    [iconOverrides]=\"_iconOverrides\"\n    [disableRipple]=\"disableRipple || !step.isNavigable()\"\n    [color]=\"step.color || color\"/>\n</ng-template>\n",
    styles: [".mat-stepper-vertical,.mat-stepper-horizontal{display:block;font-family:var(--mat-stepper-container-text-font, var(--mat-sys-body-medium-font));background:var(--mat-stepper-container-color, var(--mat-sys-surface))}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-header-position-bottom .mat-horizontal-stepper-header-container{order:1}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px;border-top-color:var(--mat-stepper-line-color, var(--mat-sys-outline))}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative;top:calc(calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:\"\";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;overflow:hidden;align-items:center;padding:0 24px;height:var(--mat-stepper-header-height, 72px)}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-horizontal-stepper-header.mat-step-header-empty-label .mat-step-icon{margin:0}.mat-horizontal-stepper-header::before,.mat-horizontal-stepper-header::after{border-top-color:var(--mat-stepper-line-color, var(--mat-sys-outline))}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{padding:calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) 24px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::after{top:calc(calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px;padding:calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) 24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-wrapper{display:flex;flex-direction:column}.mat-horizontal-stepper-content{visibility:hidden;overflow:hidden;outline:0;height:0}.mat-stepper-animations-enabled .mat-horizontal-stepper-content{transition:transform var(--mat-stepper-animation-duration, 0) cubic-bezier(0.35, 0, 0.25, 1)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-previous{transform:translate3d(-100%, 0, 0)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-next{transform:translate3d(100%, 0, 0)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-current{visibility:visible;transform:none;height:auto}.mat-stepper-horizontal:not(.mat-stepper-animating) .mat-horizontal-stepper-content.mat-horizontal-stepper-content-current{overflow:visible}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}@media(forced-colors: active){.mat-horizontal-content-container{outline:solid 1px}}.mat-stepper-header-position-bottom .mat-horizontal-content-container{padding:24px 24px 0 24px}.mat-vertical-content-container{display:grid;grid-template-rows:0fr;grid-template-columns:100%;margin-left:36px;border:0;position:relative}.mat-stepper-animations-enabled .mat-vertical-content-container{transition:grid-template-rows var(--mat-stepper-animation-duration, 0) cubic-bezier(0.4, 0, 0.2, 1)}.mat-vertical-content-container.mat-vertical-content-container-active{grid-template-rows:1fr}.mat-step:last-child .mat-vertical-content-container{border:none}@media(forced-colors: active){.mat-vertical-content-container{outline:solid 1px}}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}@supports not (grid-template-rows: 0fr){.mat-vertical-content-container{height:0}.mat-vertical-content-container.mat-vertical-content-container-active{height:auto}}.mat-stepper-vertical-line::before{content:\"\";position:absolute;left:0;border-left-width:1px;border-left-style:solid;border-left-color:var(--mat-stepper-line-color, var(--mat-sys-outline));top:calc(8px - calc((var(--mat-stepper-header-height, 72px) - 24px) / 2));bottom:calc(8px - calc((var(--mat-stepper-header-height, 72px) - 24px) / 2))}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0;visibility:hidden}.mat-stepper-animations-enabled .mat-vertical-stepper-content{transition:visibility var(--mat-stepper-animation-duration, 0) linear}.mat-vertical-content-container-active>.mat-vertical-stepper-content{visibility:visible}.mat-vertical-content{padding:0 24px 24px 24px}\n"],
    dependencies: [{
      kind: "directive",
      type: NgTemplateOutlet,
      selector: "[ngTemplateOutlet]",
      inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"]
    }, {
      kind: "component",
      type: MatStepHeader,
      selector: "mat-step-header",
      inputs: ["state", "label", "errorMessage", "iconOverrides", "index", "selected", "active", "optional", "disableRipple", "color"]
    }],
    changeDetection: i0.ChangeDetectionStrategy.OnPush,
    encapsulation: i0.ViewEncapsulation.None
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatStepper,
  decorators: [{
    type: Component,
    args: [{
      selector: 'mat-stepper, mat-vertical-stepper, mat-horizontal-stepper, [matStepper]',
      exportAs: 'matStepper, matVerticalStepper, matHorizontalStepper',
      host: {
        '[class.mat-stepper-horizontal]': 'orientation === "horizontal"',
        '[class.mat-stepper-vertical]': 'orientation === "vertical"',
        '[class.mat-stepper-label-position-end]': 'orientation === "horizontal" && labelPosition == "end"',
        '[class.mat-stepper-label-position-bottom]': 'orientation === "horizontal" && labelPosition == "bottom"',
        '[class.mat-stepper-header-position-bottom]': 'headerPosition === "bottom"',
        '[class.mat-stepper-animating]': '_isAnimating()',
        '[style.--mat-stepper-animation-duration]': '_getAnimationDuration()'
      },
      providers: [{
        provide: CdkStepper,
        useExisting: MatStepper
      }],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [NgTemplateOutlet, MatStepHeader],
      template: "<!--\n  We need to project the content somewhere to avoid hydration errors. Some observations:\n  1. This is only necessary on the server.\n  2. We get a hydration error if there aren't any nodes after the `ng-content`.\n  3. We get a hydration error if `ng-content` is wrapped in another element.\n-->\n@if (_isServer) {\n  <ng-content/>\n}\n\n@switch (orientation) {\n  @case ('horizontal') {\n    <div class=\"mat-horizontal-stepper-wrapper\">\n      <div \n        aria-orientation=\"horizontal\"\n        class=\"mat-horizontal-stepper-header-container\" \n        role=\"tablist\">\n        @for (step of steps; track step) {\n          <ng-container\n            [ngTemplateOutlet]=\"stepTemplate\"\n            [ngTemplateOutletContext]=\"{step}\"/>\n          @if (!$last) {\n            <div class=\"mat-stepper-horizontal-line\"></div>\n          }\n        }\n      </div>\n\n      <div class=\"mat-horizontal-content-container\">\n        @for (step of steps; track step) {\n          <div\n            #animatedContainer\n            class=\"mat-horizontal-stepper-content\"\n            role=\"tabpanel\"\n            [id]=\"_getStepContentId($index)\"\n            [attr.aria-labelledby]=\"_getStepLabelId($index)\"\n            [class]=\"'mat-horizontal-stepper-content-' + _getAnimationDirection($index)\"\n            [attr.inert]=\"selectedIndex === $index ? null : ''\">\n            <ng-container [ngTemplateOutlet]=\"step.content\"/>\n          </div>\n        }\n      </div>\n    </div>\n  }\n\n  @case ('vertical') {\n    <div class=\"mat-vertical-stepper-wrapper\">\n      @for (step of steps; track step) {\n        <div class=\"mat-step\">\n          <ng-container\n            [ngTemplateOutlet]=\"stepTemplate\"\n            [ngTemplateOutletContext]=\"{step}\"/>\n          <div\n            #animatedContainer\n            class=\"mat-vertical-content-container\"\n            [class.mat-stepper-vertical-line]=\"!$last\"\n            [class.mat-vertical-content-container-active]=\"selectedIndex === $index\"\n            [attr.inert]=\"selectedIndex === $index ? null : ''\">\n            <div \n              class=\"mat-vertical-stepper-content\"\n              role=\"region\"\n              [id]=\"_getStepContentId($index)\"\n              [attr.aria-labelledby]=\"_getStepLabelId($index)\">\n              <div class=\"mat-vertical-content\">\n                <ng-container [ngTemplateOutlet]=\"step.content\"/>\n              </div>\n            </div>\n          </div>\n        </div>\n      }\n    </div>\n  }\n}\n\n<!-- Common step templating -->\n<ng-template let-step=\"step\" #stepTemplate>\n  <mat-step-header\n    [class.mat-horizontal-stepper-header]=\"orientation === 'horizontal'\"\n    [class.mat-vertical-stepper-header]=\"orientation === 'vertical'\"\n    (click)=\"step.select()\"\n    (keydown)=\"_onKeydown($event)\"\n    [tabIndex]=\"_getFocusIndex() === step.index() ? 0 : -1\"\n    [id]=\"_getStepLabelId(step.index())\"\n    [attr.role]=\"orientation === 'horizontal' ? 'tab' : 'button'\"\n    [attr.aria-posinset]=\"orientation === 'horizontal' ? step.index() + 1 : null\"\n    [attr.aria-setsize]=\"orientation === 'horizontal' ? steps.length : null\"\n    [attr.aria-selected]=\"orientation === 'horizontal' ? step.isSelected() : null\"\n    [attr.aria-current]=\"orientation === 'vertical' && step.isSelected() ? 'step' : null\"\n    [attr.aria-disabled]=\"orientation === 'vertical' && step.isSelected() ? 'true' : null\"\n    [attr.aria-expanded]=\"orientation === 'vertical' ? step.isSelected() : null\"\n    [attr.aria-controls]=\"_getStepContentId(step.index())\"\n    [attr.aria-label]=\"step.ariaLabel || null\"\n    [attr.aria-labelledby]=\"(!step.ariaLabel && step.ariaLabelledby) ? step.ariaLabelledby : null\"\n    [attr.aria-disabled]=\"step.isNavigable() ? null : true\"\n    [index]=\"step.index()\"\n    [state]=\"step.indicatorType()\"\n    [label]=\"step.stepLabel || step.label\"\n    [selected]=\"step.isSelected()\"\n    [active]=\"step.isNavigable()\"\n    [optional]=\"step.optional\"\n    [errorMessage]=\"step.errorMessage\"\n    [iconOverrides]=\"_iconOverrides\"\n    [disableRipple]=\"disableRipple || !step.isNavigable()\"\n    [color]=\"step.color || color\"/>\n</ng-template>\n",
      styles: [".mat-stepper-vertical,.mat-stepper-horizontal{display:block;font-family:var(--mat-stepper-container-text-font, var(--mat-sys-body-medium-font));background:var(--mat-stepper-container-color, var(--mat-sys-surface))}.mat-horizontal-stepper-header-container{white-space:nowrap;display:flex;align-items:center}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container{align-items:flex-start}.mat-stepper-header-position-bottom .mat-horizontal-stepper-header-container{order:1}.mat-stepper-horizontal-line{border-top-width:1px;border-top-style:solid;flex:auto;height:0;margin:0 -16px;min-width:32px;border-top-color:var(--mat-stepper-line-color, var(--mat-sys-outline))}.mat-stepper-label-position-bottom .mat-stepper-horizontal-line{margin:0;min-width:0;position:relative;top:calc(calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{border-top-width:1px;border-top-style:solid;content:\"\";display:inline-block;height:0;position:absolute;width:calc(50% - 20px)}.mat-horizontal-stepper-header{display:flex;overflow:hidden;align-items:center;padding:0 24px;height:var(--mat-stepper-header-height, 72px)}.mat-horizontal-stepper-header .mat-step-icon{margin-right:8px;flex:none}[dir=rtl] .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:8px}.mat-horizontal-stepper-header.mat-step-header-empty-label .mat-step-icon{margin:0}.mat-horizontal-stepper-header::before,.mat-horizontal-stepper-header::after{border-top-color:var(--mat-stepper-line-color, var(--mat-sys-outline))}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{padding:calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) 24px}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::before,.mat-stepper-label-position-bottom .mat-horizontal-stepper-header::after{top:calc(calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) + 12px)}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header{box-sizing:border-box;flex-direction:column;height:auto}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::after,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::after{right:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:first-child)::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:not(:last-child)::before{left:0}[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:last-child::before,[dir=rtl] .mat-stepper-label-position-bottom .mat-horizontal-stepper-header:first-child::after{display:none}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-icon{margin-right:0;margin-left:0}.mat-stepper-label-position-bottom .mat-horizontal-stepper-header .mat-step-label{padding:16px 0 0 0;text-align:center;width:100%}.mat-vertical-stepper-header{display:flex;align-items:center;height:24px;padding:calc((var(--mat-stepper-header-height, 72px) - 24px) / 2) 24px}.mat-vertical-stepper-header .mat-step-icon{margin-right:12px}[dir=rtl] .mat-vertical-stepper-header .mat-step-icon{margin-right:0;margin-left:12px}.mat-horizontal-stepper-wrapper{display:flex;flex-direction:column}.mat-horizontal-stepper-content{visibility:hidden;overflow:hidden;outline:0;height:0}.mat-stepper-animations-enabled .mat-horizontal-stepper-content{transition:transform var(--mat-stepper-animation-duration, 0) cubic-bezier(0.35, 0, 0.25, 1)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-previous{transform:translate3d(-100%, 0, 0)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-next{transform:translate3d(100%, 0, 0)}.mat-horizontal-stepper-content.mat-horizontal-stepper-content-current{visibility:visible;transform:none;height:auto}.mat-stepper-horizontal:not(.mat-stepper-animating) .mat-horizontal-stepper-content.mat-horizontal-stepper-content-current{overflow:visible}.mat-horizontal-content-container{overflow:hidden;padding:0 24px 24px 24px}@media(forced-colors: active){.mat-horizontal-content-container{outline:solid 1px}}.mat-stepper-header-position-bottom .mat-horizontal-content-container{padding:24px 24px 0 24px}.mat-vertical-content-container{display:grid;grid-template-rows:0fr;grid-template-columns:100%;margin-left:36px;border:0;position:relative}.mat-stepper-animations-enabled .mat-vertical-content-container{transition:grid-template-rows var(--mat-stepper-animation-duration, 0) cubic-bezier(0.4, 0, 0.2, 1)}.mat-vertical-content-container.mat-vertical-content-container-active{grid-template-rows:1fr}.mat-step:last-child .mat-vertical-content-container{border:none}@media(forced-colors: active){.mat-vertical-content-container{outline:solid 1px}}[dir=rtl] .mat-vertical-content-container{margin-left:0;margin-right:36px}@supports not (grid-template-rows: 0fr){.mat-vertical-content-container{height:0}.mat-vertical-content-container.mat-vertical-content-container-active{height:auto}}.mat-stepper-vertical-line::before{content:\"\";position:absolute;left:0;border-left-width:1px;border-left-style:solid;border-left-color:var(--mat-stepper-line-color, var(--mat-sys-outline));top:calc(8px - calc((var(--mat-stepper-header-height, 72px) - 24px) / 2));bottom:calc(8px - calc((var(--mat-stepper-header-height, 72px) - 24px) / 2))}[dir=rtl] .mat-stepper-vertical-line::before{left:auto;right:0}.mat-vertical-stepper-content{overflow:hidden;outline:0;visibility:hidden}.mat-stepper-animations-enabled .mat-vertical-stepper-content{transition:visibility var(--mat-stepper-animation-duration, 0) linear}.mat-vertical-content-container-active>.mat-vertical-stepper-content{visibility:visible}.mat-vertical-content{padding:0 24px 24px 24px}\n"]
    }]
  }],
  ctorParameters: () => [],
  propDecorators: {
    _stepHeader: [{
      type: ViewChildren,
      args: [MatStepHeader]
    }],
    _animatedContainers: [{
      type: ViewChildren,
      args: ['animatedContainer']
    }],
    _steps: [{
      type: ContentChildren,
      args: [MatStep, {
        descendants: true
      }]
    }],
    _icons: [{
      type: ContentChildren,
      args: [MatStepperIcon, {
        descendants: true
      }]
    }],
    animationDone: [{
      type: Output
    }],
    disableRipple: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    labelPosition: [{
      type: Input
    }],
    headerPosition: [{
      type: Input
    }],
    animationDuration: [{
      type: Input
    }]
  }
});

class MatStepperNext extends CdkStepperNext {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStepperNext,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatStepperNext,
    isStandalone: true,
    selector: "button[matStepperNext]",
    host: {
      properties: {
        "type": "type"
      },
      classAttribute: "mat-stepper-next"
    },
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatStepperNext,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'button[matStepperNext]',
      host: {
        'class': 'mat-stepper-next',
        '[type]': 'type'
      }
    }]
  }]
});
class MatStepperPrevious extends CdkStepperPrevious {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStepperPrevious,
    deps: null,
    target: i0.ɵɵFactoryTarget.Directive
  });
  static ɵdir = i0.ɵɵngDeclareDirective({
    minVersion: "14.0.0",
    version: "21.0.3",
    type: MatStepperPrevious,
    isStandalone: true,
    selector: "button[matStepperPrevious]",
    host: {
      properties: {
        "type": "type"
      },
      classAttribute: "mat-stepper-previous"
    },
    usesInheritance: true,
    ngImport: i0
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatStepperPrevious,
  decorators: [{
    type: Directive,
    args: [{
      selector: 'button[matStepperPrevious]',
      host: {
        'class': 'mat-stepper-previous',
        '[type]': 'type'
      }
    }]
  }]
});

class MatStepperModule {
  static ɵfac = i0.ɵɵngDeclareFactory({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStepperModule,
    deps: [],
    target: i0.ɵɵFactoryTarget.NgModule
  });
  static ɵmod = i0.ɵɵngDeclareNgModule({
    minVersion: "14.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStepperModule,
    imports: [PortalModule, CdkStepperModule, MatIconModule, MatRippleModule, MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, MatStepHeader, MatStepperIcon, MatStepContent],
    exports: [BidiModule, MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, MatStepHeader, MatStepperIcon, MatStepContent]
  });
  static ɵinj = i0.ɵɵngDeclareInjector({
    minVersion: "12.0.0",
    version: "21.0.3",
    ngImport: i0,
    type: MatStepperModule,
    providers: [ErrorStateMatcher],
    imports: [PortalModule, CdkStepperModule, MatIconModule, MatRippleModule, MatStepper, MatStepHeader, BidiModule]
  });
}
i0.ɵɵngDeclareClassMetadata({
  minVersion: "12.0.0",
  version: "21.0.3",
  ngImport: i0,
  type: MatStepperModule,
  decorators: [{
    type: NgModule,
    args: [{
      imports: [PortalModule, CdkStepperModule, MatIconModule, MatRippleModule, MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, MatStepHeader, MatStepperIcon, MatStepContent],
      exports: [BidiModule, MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious, MatStepHeader, MatStepperIcon, MatStepContent],
      providers: [ErrorStateMatcher]
    }]
  }]
});

export { MatStep, MatStepContent, MatStepHeader, MatStepLabel, MatStepper, MatStepperIcon, MatStepperIntl, MatStepperModule, MatStepperNext, MatStepperPrevious };
//# sourceMappingURL=stepper.mjs.map

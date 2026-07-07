import { isSignal } from '@angular/core';

class _ErrorStateTracker {
  _defaultMatcher;
  _parentFormGroup;
  _parentForm;
  _stateChanges;
  errorState = false;
  matcher;
  ngControl;
  formField;
  constructor(_defaultMatcher, directive, _parentFormGroup, _parentForm, _stateChanges) {
    this._defaultMatcher = _defaultMatcher;
    this._parentFormGroup = _parentFormGroup;
    this._parentForm = _parentForm;
    this._stateChanges = _stateChanges;
    if (!directive) {
      this.ngControl = this.formField = null;
    } else if (isSignal(directive.field) && !directive.updateValueAndValidity) {
      this.formField = directive;
      this.ngControl = null;
    } else {
      this.formField = null;
      this.ngControl = directive;
    }
  }
  updateErrorState() {
    const oldState = this.errorState;
    const matcher = this.matcher || this._defaultMatcher;
    let newState;
    if (this.formField) {
      if ((typeof ngDevMode === 'undefined' || ngDevMode) && matcher && !matcher.isSignalErrorState) {
        throw new Error('Current error state matcher does not support signal forms. ' + 'Please implement the `isSignalErrorState` method.');
      }
      newState = matcher?.isSignalErrorState?.(this.formField.field()) ?? false;
    } else {
      const parent = this._parentFormGroup || this._parentForm;
      const control = this.ngControl ? this.ngControl.control : null;
      newState = matcher?.isErrorState(control, parent) ?? false;
    }
    if (newState !== oldState) {
      this.errorState = newState;
      this._stateChanges.next();
    }
  }
}

export { _ErrorStateTracker };
//# sourceMappingURL=_error-state-chunk.mjs.map

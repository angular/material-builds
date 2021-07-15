(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define('@angular/material', ['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.ng = global.ng || {}, global.ng.material = {})));
}(this, (function (exports) { 'use strict';

	/**
	 * @license
	 * Copyright Google LLC All Rights Reserved.
	 *
	 * Use of this source code is governed by an MIT-style license that can be
	 * found in the LICENSE file at https://angular.io/license
	 */
	// primary entry-point which is empty as of version 9. All components should
	// be imported through their individual entry-points. This file is needed to
	// satisfy the "ng_package" bazel rule which also requires a primary entry-point.
	// Workaround for: https://github.com/microsoft/rushstack/issues/2806.
	// This is a private export that can be removed at any time.
	var ɵɵtsModuleIndicatorApiExtractorWorkaround = true;

	exports.ɵɵtsModuleIndicatorApiExtractorWorkaround = ɵɵtsModuleIndicatorApiExtractorWorkaround;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=material.umd.js.map

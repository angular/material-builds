"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
exports.methodCallChecks = {
    [index_1.TargetVersion.V6]: [
        {
            pr: 'https://github.com/angular/material2/pull/10325',
            changes: [
                {
                    className: 'FocusMonitor',
                    method: 'monitor',
                    invalidArgCounts: [
                        {
                            count: 3,
                            message: 'The "renderer" argument has been removed'
                        }
                    ]
                }
            ]
        }
    ]
};
//# sourceMappingURL=method-call-checks.js.map
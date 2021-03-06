"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIGRATION_PATH = exports.COLLECTION_PATH = void 0;
const path_1 = require("path");
/** Path to the schematic collection for non-migration schematics. */
exports.COLLECTION_PATH = path_1.join(__dirname, 'collection.json');
/** Path to the schematic collection that includes the migrations. */
exports.MIGRATION_PATH = path_1.join(__dirname, 'migration.json');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9wYXRocy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7QUFFSCwrQkFBMEI7QUFFMUIscUVBQXFFO0FBQ3hELFFBQUEsZUFBZSxHQUFHLFdBQUksQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUVsRSxxRUFBcUU7QUFDeEQsUUFBQSxjQUFjLEdBQUcsV0FBSSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7am9pbn0gZnJvbSAncGF0aCc7XG5cbi8qKiBQYXRoIHRvIHRoZSBzY2hlbWF0aWMgY29sbGVjdGlvbiBmb3Igbm9uLW1pZ3JhdGlvbiBzY2hlbWF0aWNzLiAqL1xuZXhwb3J0IGNvbnN0IENPTExFQ1RJT05fUEFUSCA9IGpvaW4oX19kaXJuYW1lLCAnY29sbGVjdGlvbi5qc29uJyk7XG5cbi8qKiBQYXRoIHRvIHRoZSBzY2hlbWF0aWMgY29sbGVjdGlvbiB0aGF0IGluY2x1ZGVzIHRoZSBtaWdyYXRpb25zLiAqL1xuZXhwb3J0IGNvbnN0IE1JR1JBVElPTl9QQVRIID0gam9pbihfX2Rpcm5hbWUsICdtaWdyYXRpb24uanNvbicpO1xuIl19
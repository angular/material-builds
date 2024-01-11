"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
/**
 * Scaffolds a new table component.
 * Internally it bootstraps the base component schematic
 */
function default_1(options) {
    return (0, schematics_1.chain)([
        (0, schematics_2.buildComponent)({ ...options }, {
            template: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.html.template',
            stylesheet: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.__style__.template',
        }),
        options.skipImport ? (0, schematics_1.noop)() : addTableModulesToModule(options),
    ]);
}
exports.default = default_1;
/**
 * Adds the required modules to the relative module.
 */
function addTableModulesToModule(options) {
    return async (host) => {
        const isStandalone = await (0, schematics_2.isStandaloneSchematic)(host, options);
        if (!isStandalone) {
            const modulePath = (await (0, schematics_2.findModuleFromOptions)(host, options));
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatTableModule', '@angular/material/table');
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatPaginatorModule', '@angular/material/paginator');
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatSortModule', '@angular/material/sort');
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1nZW5lcmF0ZS90YWJsZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDJEQUFtRTtBQUNuRSx3REFLaUM7QUFHakM7OztHQUdHO0FBQ0gsbUJBQXlCLE9BQWU7SUFDdEMsT0FBTyxJQUFBLGtCQUFLLEVBQUM7UUFDWCxJQUFBLDJCQUFjLEVBQ1osRUFBQyxHQUFHLE9BQU8sRUFBQyxFQUNaO1lBQ0UsUUFBUSxFQUNOLGtGQUFrRjtZQUNwRixVQUFVLEVBQ1IsdUZBQXVGO1NBQzFGLENBQ0Y7UUFDRCxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFBLGlCQUFJLEdBQUUsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLENBQUMsT0FBTyxDQUFDO0tBQy9ELENBQUMsQ0FBQztBQUNMLENBQUM7QUFiRCw0QkFhQztBQUVEOztHQUVHO0FBQ0gsU0FBUyx1QkFBdUIsQ0FBQyxPQUFlO0lBQzlDLE9BQU8sS0FBSyxFQUFFLElBQVUsRUFBRSxFQUFFO1FBQzFCLE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBQSxrQ0FBcUIsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFaEUsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ2xCLE1BQU0sVUFBVSxHQUFHLENBQUMsTUFBTSxJQUFBLGtDQUFxQixFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBRSxDQUFDO1lBQ2pFLElBQUEsb0NBQXVCLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3ZGLElBQUEsb0NBQXVCLEVBQ3JCLElBQUksRUFDSixVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLDZCQUE2QixDQUM5QixDQUFDO1lBQ0YsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3ZGLENBQUM7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y2hhaW4sIG5vb3AsIFJ1bGUsIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlLFxuICBidWlsZENvbXBvbmVudCxcbiAgZmluZE1vZHVsZUZyb21PcHRpb25zLFxuICBpc1N0YW5kYWxvbmVTY2hlbWF0aWMsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuL3NjaGVtYSc7XG5cbi8qKlxuICogU2NhZmZvbGRzIGEgbmV3IHRhYmxlIGNvbXBvbmVudC5cbiAqIEludGVybmFsbHkgaXQgYm9vdHN0cmFwcyB0aGUgYmFzZSBjb21wb25lbnQgc2NoZW1hdGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgcmV0dXJuIGNoYWluKFtcbiAgICBidWlsZENvbXBvbmVudChcbiAgICAgIHsuLi5vcHRpb25zfSxcbiAgICAgIHtcbiAgICAgICAgdGVtcGxhdGU6XG4gICAgICAgICAgJy4vX19wYXRoX18vX19uYW1lQGRhc2hlcml6ZUBpZi1mbGF0X18vX19uYW1lQGRhc2hlcml6ZV9fLmNvbXBvbmVudC5odG1sLnRlbXBsYXRlJyxcbiAgICAgICAgc3R5bGVzaGVldDpcbiAgICAgICAgICAnLi9fX3BhdGhfXy9fX25hbWVAZGFzaGVyaXplQGlmLWZsYXRfXy9fX25hbWVAZGFzaGVyaXplX18uY29tcG9uZW50Ll9fc3R5bGVfXy50ZW1wbGF0ZScsXG4gICAgICB9LFxuICAgICksXG4gICAgb3B0aW9ucy5za2lwSW1wb3J0ID8gbm9vcCgpIDogYWRkVGFibGVNb2R1bGVzVG9Nb2R1bGUob3B0aW9ucyksXG4gIF0pO1xufVxuXG4vKipcbiAqIEFkZHMgdGhlIHJlcXVpcmVkIG1vZHVsZXMgdG8gdGhlIHJlbGF0aXZlIG1vZHVsZS5cbiAqL1xuZnVuY3Rpb24gYWRkVGFibGVNb2R1bGVzVG9Nb2R1bGUob3B0aW9uczogU2NoZW1hKSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IGlzU3RhbmRhbG9uZSA9IGF3YWl0IGlzU3RhbmRhbG9uZVNjaGVtYXRpYyhob3N0LCBvcHRpb25zKTtcblxuICAgIGlmICghaXNTdGFuZGFsb25lKSB7XG4gICAgICBjb25zdCBtb2R1bGVQYXRoID0gKGF3YWl0IGZpbmRNb2R1bGVGcm9tT3B0aW9ucyhob3N0LCBvcHRpb25zKSkhO1xuICAgICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdFRhYmxlTW9kdWxlJywgJ0Bhbmd1bGFyL21hdGVyaWFsL3RhYmxlJyk7XG4gICAgICBhZGRNb2R1bGVJbXBvcnRUb01vZHVsZShcbiAgICAgICAgaG9zdCxcbiAgICAgICAgbW9kdWxlUGF0aCxcbiAgICAgICAgJ01hdFBhZ2luYXRvck1vZHVsZScsXG4gICAgICAgICdAYW5ndWxhci9tYXRlcmlhbC9wYWdpbmF0b3InLFxuICAgICAgKTtcbiAgICAgIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlKGhvc3QsIG1vZHVsZVBhdGgsICdNYXRTb3J0TW9kdWxlJywgJ0Bhbmd1bGFyL21hdGVyaWFsL3NvcnQnKTtcbiAgICB9XG4gIH07XG59XG4iXX0=
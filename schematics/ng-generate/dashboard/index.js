"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
/**
 * Scaffolds a new dashboard component.
 * Internally it bootstraps the base component schematic
 */
function default_1(options) {
    return (0, schematics_1.chain)([
        (0, schematics_2.buildComponent)({ ...options }, {
            template: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.html.template',
            stylesheet: './__path__/__name@dasherize@if-flat__/__name@dasherize__.component.__style__.template',
        }),
        options.skipImport ? (0, schematics_1.noop)() : addNavModulesToModule(options),
    ]);
}
/**
 * Adds the required modules to the relative module.
 */
function addNavModulesToModule(options) {
    return async (host) => {
        const isStandalone = await (0, schematics_2.isStandaloneSchematic)(host, options);
        if (!isStandalone) {
            const modulePath = (await (0, schematics_2.findModuleFromOptions)(host, options));
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatGridListModule', '@angular/material/grid-list');
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatCardModule', '@angular/material/card');
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatMenuModule', '@angular/material/menu');
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatIconModule', '@angular/material/icon');
            (0, schematics_2.addModuleImportToModule)(host, modulePath, 'MatButtonModule', '@angular/material/button');
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1nZW5lcmF0ZS9kYXNoYm9hcmQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFlSCw0QkFhQztBQTFCRCwyREFBbUU7QUFDbkUsd0RBS2lDO0FBR2pDOzs7R0FHRztBQUNILG1CQUF5QixPQUFlO0lBQ3RDLE9BQU8sSUFBQSxrQkFBSyxFQUFDO1FBQ1gsSUFBQSwyQkFBYyxFQUNaLEVBQUMsR0FBRyxPQUFPLEVBQUMsRUFDWjtZQUNFLFFBQVEsRUFDTixrRkFBa0Y7WUFDcEYsVUFBVSxFQUNSLHVGQUF1RjtTQUMxRixDQUNGO1FBQ0QsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBQSxpQkFBSSxHQUFFLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQztLQUM3RCxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFTLHFCQUFxQixDQUFDLE9BQWU7SUFDNUMsT0FBTyxLQUFLLEVBQUUsSUFBVSxFQUFFLEVBQUU7UUFDMUIsTUFBTSxZQUFZLEdBQUcsTUFBTSxJQUFBLGtDQUFxQixFQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVoRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDbEIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFNLElBQUEsa0NBQXFCLEVBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFFLENBQUM7WUFDakUsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLG1CQUFtQixFQUFFLDZCQUE2QixDQUFDLENBQUM7WUFDOUYsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3JGLElBQUEsb0NBQXVCLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztZQUNyRixJQUFBLG9DQUF1QixFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLHdCQUF3QixDQUFDLENBQUM7WUFDckYsSUFBQSxvQ0FBdUIsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLDBCQUEwQixDQUFDLENBQUM7UUFDM0YsQ0FBQztJQUNILENBQUMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5kZXYvbGljZW5zZVxuICovXG5cbmltcG9ydCB7Y2hhaW4sIG5vb3AsIFJ1bGUsIFRyZWV9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIGFkZE1vZHVsZUltcG9ydFRvTW9kdWxlLFxuICBidWlsZENvbXBvbmVudCxcbiAgZmluZE1vZHVsZUZyb21PcHRpb25zLFxuICBpc1N0YW5kYWxvbmVTY2hlbWF0aWMsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY2hlbWF0aWNzJztcbmltcG9ydCB7U2NoZW1hfSBmcm9tICcuL3NjaGVtYSc7XG5cbi8qKlxuICogU2NhZmZvbGRzIGEgbmV3IGRhc2hib2FyZCBjb21wb25lbnQuXG4gKiBJbnRlcm5hbGx5IGl0IGJvb3RzdHJhcHMgdGhlIGJhc2UgY29tcG9uZW50IHNjaGVtYXRpY1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiBjaGFpbihbXG4gICAgYnVpbGRDb21wb25lbnQoXG4gICAgICB7Li4ub3B0aW9uc30sXG4gICAgICB7XG4gICAgICAgIHRlbXBsYXRlOlxuICAgICAgICAgICcuL19fcGF0aF9fL19fbmFtZUBkYXNoZXJpemVAaWYtZmxhdF9fL19fbmFtZUBkYXNoZXJpemVfXy5jb21wb25lbnQuaHRtbC50ZW1wbGF0ZScsXG4gICAgICAgIHN0eWxlc2hlZXQ6XG4gICAgICAgICAgJy4vX19wYXRoX18vX19uYW1lQGRhc2hlcml6ZUBpZi1mbGF0X18vX19uYW1lQGRhc2hlcml6ZV9fLmNvbXBvbmVudC5fX3N0eWxlX18udGVtcGxhdGUnLFxuICAgICAgfSxcbiAgICApLFxuICAgIG9wdGlvbnMuc2tpcEltcG9ydCA/IG5vb3AoKSA6IGFkZE5hdk1vZHVsZXNUb01vZHVsZShvcHRpb25zKSxcbiAgXSk7XG59XG5cbi8qKlxuICogQWRkcyB0aGUgcmVxdWlyZWQgbW9kdWxlcyB0byB0aGUgcmVsYXRpdmUgbW9kdWxlLlxuICovXG5mdW5jdGlvbiBhZGROYXZNb2R1bGVzVG9Nb2R1bGUob3B0aW9uczogU2NoZW1hKSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IGlzU3RhbmRhbG9uZSA9IGF3YWl0IGlzU3RhbmRhbG9uZVNjaGVtYXRpYyhob3N0LCBvcHRpb25zKTtcblxuICAgIGlmICghaXNTdGFuZGFsb25lKSB7XG4gICAgICBjb25zdCBtb2R1bGVQYXRoID0gKGF3YWl0IGZpbmRNb2R1bGVGcm9tT3B0aW9ucyhob3N0LCBvcHRpb25zKSkhO1xuICAgICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdEdyaWRMaXN0TW9kdWxlJywgJ0Bhbmd1bGFyL21hdGVyaWFsL2dyaWQtbGlzdCcpO1xuICAgICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdENhcmRNb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZCcpO1xuICAgICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdE1lbnVNb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudScpO1xuICAgICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdEljb25Nb2R1bGUnLCAnQGFuZ3VsYXIvbWF0ZXJpYWwvaWNvbicpO1xuICAgICAgYWRkTW9kdWxlSW1wb3J0VG9Nb2R1bGUoaG9zdCwgbW9kdWxlUGF0aCwgJ01hdEJ1dHRvbk1vZHVsZScsICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nKTtcbiAgICB9XG4gIH07XG59XG4iXX0=
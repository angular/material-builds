/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/material/schematics/ng-add/gestures/hammerjs-import", ["require", "exports", "@angular/cdk/schematics", "@schematics/angular/utility/config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const schematics_1 = require("@angular/cdk/schematics");
    const config_1 = require("@schematics/angular/utility/config");
    const hammerjsImportStatement = `import 'hammerjs';`;
    /** Adds HammerJS to the main file of the specified Angular CLI project. */
    function addHammerJsToMain(options) {
        return (host) => {
            const workspace = config_1.getWorkspace(host);
            const project = schematics_1.getProjectFromWorkspace(workspace, options.project);
            const mainFile = schematics_1.getProjectMainFile(project);
            const recorder = host.beginUpdate(mainFile);
            const buffer = host.read(mainFile);
            if (!buffer) {
                return console.error(`Could not read the project main file (${mainFile}). Please manually ` +
                    `import HammerJS in your main TypeScript file.`);
            }
            const fileContent = buffer.toString('utf8');
            if (fileContent.includes(hammerjsImportStatement)) {
                return console.log(`HammerJS is already imported in the project main file (${mainFile}).`);
            }
            recorder.insertRight(0, `${hammerjsImportStatement}\n`);
            host.commitUpdate(recorder);
        };
    }
    exports.addHammerJsToMain = addHammerJsToMain;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtbWVyanMtaW1wb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3NjaGVtYXRpY3MvbmctYWRkL2dlc3R1cmVzL2hhbW1lcmpzLWltcG9ydC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUdILHdEQUFvRjtJQUNwRiwrREFBZ0U7SUFHaEUsTUFBTSx1QkFBdUIsR0FBRyxvQkFBb0IsQ0FBQztJQUVyRCwyRUFBMkU7SUFDM0UsU0FBZ0IsaUJBQWlCLENBQUMsT0FBZTtRQUMvQyxPQUFPLENBQUMsSUFBVSxFQUFFLEVBQUU7WUFDcEIsTUFBTSxTQUFTLEdBQUcscUJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNyQyxNQUFNLE9BQU8sR0FBRyxvQ0FBdUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sUUFBUSxHQUFHLCtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTdDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDNUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUVuQyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNYLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsUUFBUSxxQkFBcUI7b0JBQ3pGLCtDQUErQyxDQUFDLENBQUM7YUFDcEQ7WUFFRCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTVDLElBQUksV0FBVyxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFO2dCQUNqRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsMERBQTBELFFBQVEsSUFBSSxDQUFDLENBQUM7YUFDNUY7WUFFRCxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxHQUFHLHVCQUF1QixJQUFJLENBQUMsQ0FBQztZQUN4RCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQztJQUNKLENBQUM7SUF2QkQsOENBdUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UnVsZSwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtnZXRQcm9qZWN0RnJvbVdvcmtzcGFjZSwgZ2V0UHJvamVjdE1haW5GaWxlfSBmcm9tICdAYW5ndWxhci9jZGsvc2NoZW1hdGljcyc7XG5pbXBvcnQge2dldFdvcmtzcGFjZX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L2NvbmZpZyc7XG5pbXBvcnQge1NjaGVtYX0gZnJvbSAnLi4vc2NoZW1hJztcblxuY29uc3QgaGFtbWVyanNJbXBvcnRTdGF0ZW1lbnQgPSBgaW1wb3J0ICdoYW1tZXJqcyc7YDtcblxuLyoqIEFkZHMgSGFtbWVySlMgdG8gdGhlIG1haW4gZmlsZSBvZiB0aGUgc3BlY2lmaWVkIEFuZ3VsYXIgQ0xJIHByb2plY3QuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkSGFtbWVySnNUb01haW4ob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IG1haW5GaWxlID0gZ2V0UHJvamVjdE1haW5GaWxlKHByb2plY3QpO1xuXG4gICAgY29uc3QgcmVjb3JkZXIgPSBob3N0LmJlZ2luVXBkYXRlKG1haW5GaWxlKTtcbiAgICBjb25zdCBidWZmZXIgPSBob3N0LnJlYWQobWFpbkZpbGUpO1xuXG4gICAgaWYgKCFidWZmZXIpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGBDb3VsZCBub3QgcmVhZCB0aGUgcHJvamVjdCBtYWluIGZpbGUgKCR7bWFpbkZpbGV9KS4gUGxlYXNlIG1hbnVhbGx5IGAgK1xuICAgICAgICBgaW1wb3J0IEhhbW1lckpTIGluIHlvdXIgbWFpbiBUeXBlU2NyaXB0IGZpbGUuYCk7XG4gICAgfVxuXG4gICAgY29uc3QgZmlsZUNvbnRlbnQgPSBidWZmZXIudG9TdHJpbmcoJ3V0ZjgnKTtcblxuICAgIGlmIChmaWxlQ29udGVudC5pbmNsdWRlcyhoYW1tZXJqc0ltcG9ydFN0YXRlbWVudCkpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLmxvZyhgSGFtbWVySlMgaXMgYWxyZWFkeSBpbXBvcnRlZCBpbiB0aGUgcHJvamVjdCBtYWluIGZpbGUgKCR7bWFpbkZpbGV9KS5gKTtcbiAgICB9XG5cbiAgICByZWNvcmRlci5pbnNlcnRSaWdodCgwLCBgJHtoYW1tZXJqc0ltcG9ydFN0YXRlbWVudH1cXG5gKTtcbiAgICBob3N0LmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG4gIH07XG59XG4iXX0=
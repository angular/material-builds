"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFontsToIndex = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
const workspace_1 = require("@schematics/angular/utility/workspace");
/** Adds the Material Design fonts to the index HTML file. */
function addFontsToIndex(options) {
    return (host) => __awaiter(this, void 0, void 0, function* () {
        const workspace = yield workspace_1.getWorkspace(host);
        const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
        const projectIndexFiles = schematics_2.getProjectIndexFiles(project);
        if (!projectIndexFiles.length) {
            throw new schematics_1.SchematicsException('No project index HTML file could be found.');
        }
        const fonts = [
            'https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
        ];
        fonts.forEach(f => {
            projectIndexFiles.forEach(indexFilePath => {
                schematics_2.appendHtmlElementToHead(host, indexFilePath, `<link href="${f}" rel="stylesheet">`);
            });
        });
    });
}
exports.addFontsToIndex = addFontsToIndex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtZm9udHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvc2NoZW1hdGljcy9uZy1hZGQvZm9udHMvbWF0ZXJpYWwtZm9udHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsMkRBQTJFO0FBQzNFLHdEQUlpQztBQUNqQyxxRUFBbUU7QUFHbkUsNkRBQTZEO0FBQzdELFNBQWdCLGVBQWUsQ0FBQyxPQUFlO0lBQzdDLE9BQU8sQ0FBTyxJQUFVLEVBQUUsRUFBRTtRQUMxQixNQUFNLFNBQVMsR0FBRyxNQUFNLHdCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDM0MsTUFBTSxPQUFPLEdBQUcsb0NBQXVCLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwRSxNQUFNLGlCQUFpQixHQUFHLGlDQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXhELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUU7WUFDN0IsTUFBTSxJQUFJLGdDQUFtQixDQUFDLDRDQUE0QyxDQUFDLENBQUM7U0FDN0U7UUFFRCxNQUFNLEtBQUssR0FBRztZQUNaLHlFQUF5RTtZQUN6RSx5REFBeUQ7U0FDMUQsQ0FBQztRQUVGLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDaEIsaUJBQWlCLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUN4QyxvQ0FBdUIsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLGVBQWUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ3RGLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUEsQ0FBQztBQUNKLENBQUM7QUFyQkQsMENBcUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7UnVsZSwgU2NoZW1hdGljc0V4Y2VwdGlvbiwgVHJlZX0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgYXBwZW5kSHRtbEVsZW1lbnRUb0hlYWQsXG4gIGdldFByb2plY3RGcm9tV29ya3NwYWNlLFxuICBnZXRQcm9qZWN0SW5kZXhGaWxlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtnZXRXb3Jrc3BhY2V9IGZyb20gJ0BzY2hlbWF0aWNzL2FuZ3VsYXIvdXRpbGl0eS93b3Jrc3BhY2UnO1xuaW1wb3J0IHtTY2hlbWF9IGZyb20gJy4uL3NjaGVtYSc7XG5cbi8qKiBBZGRzIHRoZSBNYXRlcmlhbCBEZXNpZ24gZm9udHMgdG8gdGhlIGluZGV4IEhUTUwgZmlsZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRGb250c1RvSW5kZXgob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIHJldHVybiBhc3luYyAoaG9zdDogVHJlZSkgPT4ge1xuICAgIGNvbnN0IHdvcmtzcGFjZSA9IGF3YWl0IGdldFdvcmtzcGFjZShob3N0KTtcbiAgICBjb25zdCBwcm9qZWN0ID0gZ2V0UHJvamVjdEZyb21Xb3Jrc3BhY2Uod29ya3NwYWNlLCBvcHRpb25zLnByb2plY3QpO1xuICAgIGNvbnN0IHByb2plY3RJbmRleEZpbGVzID0gZ2V0UHJvamVjdEluZGV4RmlsZXMocHJvamVjdCk7XG5cbiAgICBpZiAoIXByb2plY3RJbmRleEZpbGVzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ05vIHByb2plY3QgaW5kZXggSFRNTCBmaWxlIGNvdWxkIGJlIGZvdW5kLicpO1xuICAgIH1cblxuICAgIGNvbnN0IGZvbnRzID0gW1xuICAgICAgJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1Sb2JvdG86MzAwLDQwMCw1MDAmZGlzcGxheT1zd2FwJyxcbiAgICAgICdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2ljb24/ZmFtaWx5PU1hdGVyaWFsK0ljb25zJyxcbiAgICBdO1xuXG4gICAgZm9udHMuZm9yRWFjaChmID0+IHtcbiAgICAgIHByb2plY3RJbmRleEZpbGVzLmZvckVhY2goaW5kZXhGaWxlUGF0aCA9PiB7XG4gICAgICAgIGFwcGVuZEh0bWxFbGVtZW50VG9IZWFkKGhvc3QsIGluZGV4RmlsZVBhdGgsIGA8bGluayBocmVmPVwiJHtmfVwiIHJlbD1cInN0eWxlc2hlZXRcIj5gKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xufVxuIl19
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
        define("@angular/material/schematics/ng-update/upgrade-rules/hammer-gestures-v9/cli-workspace", ["require", "exports", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const path_1 = require("path");
    /** Finds all projects which contain the given path. */
    function getMatchingProjectsByPath(workspace, searchPath) {
        const projectNames = Object.keys(workspace.projects);
        const isProjectMatching = (relativeProjectPath) => {
            // Build the relative path from the real project path to the
            // possible project path based on the specified search path.
            const relativePath = path_1.relative(relativeProjectPath, searchPath);
            // If the relative path does not start with two dots and is not absolute, we
            // know that the search path is inside the given project path.
            return !relativePath.startsWith('..') && !path_1.isAbsolute(relativePath);
        };
        return projectNames.map(name => workspace.projects[name])
            .filter(p => isProjectMatching(p.root))
            .sort((a, b) => b.root.length - a.root.length);
    }
    exports.getMatchingProjectsByPath = getMatchingProjectsByPath;
    /**
     * Gets the matching Angular CLI workspace project from the given program. Project
     * is determined by checking root file names of the program against project paths.
     *
     * If there is only one project set up, the project will be returned regardless of
     * whether it matches any of the specified program files.
     */
    function getProjectFromProgram(workspace, program) {
        const projectNames = Object.keys(workspace.projects);
        // If there is only one project, we just return it without looking
        // for other matching projects.
        if (projectNames.length === 1) {
            return workspace.projects[projectNames[0]];
        }
        const basePath = program.getCurrentDirectory();
        // Go through the root file names of the program and return the first project
        // that matches a given root file. We can't just take any arbitrary file in the
        // list since sometimes there can be root files which do not belong to any project.
        for (let filePath of program.getRootFileNames()) {
            const matchingProjects = getMatchingProjectsByPath(workspace, path_1.relative(basePath, filePath));
            if (matchingProjects.length) {
                return matchingProjects[0];
            }
        }
        return null;
    }
    exports.getProjectFromProgram = getProjectFromProgram;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLXdvcmtzcGFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9zY2hlbWF0aWNzL25nLXVwZGF0ZS91cGdyYWRlLXJ1bGVzL2hhbW1lci1nZXN0dXJlcy12OS9jbGktd29ya3NwYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBR0gsK0JBQTBDO0lBRzFDLHVEQUF1RDtJQUN2RCxTQUFnQix5QkFBeUIsQ0FDckMsU0FBMEIsRUFBRSxVQUFrQjtRQUNoRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxNQUFNLGlCQUFpQixHQUFHLENBQUMsbUJBQTJCLEVBQVcsRUFBRTtZQUNqRSw0REFBNEQ7WUFDNUQsNERBQTREO1lBQzVELE1BQU0sWUFBWSxHQUFHLGVBQVEsQ0FBQyxtQkFBbUIsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUMvRCw0RUFBNEU7WUFDNUUsOERBQThEO1lBQzlELE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNyRSxDQUFDLENBQUM7UUFFRixPQUFPLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3BELE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN0QyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFmRCw4REFlQztJQUVEOzs7Ozs7T0FNRztJQUNILFNBQWdCLHFCQUFxQixDQUNqQyxTQUEwQixFQUFFLE9BQW1CO1FBQ2pELE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXJELGtFQUFrRTtRQUNsRSwrQkFBK0I7UUFDL0IsSUFBSSxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUM3QixPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUM7UUFFRCxNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMvQyw2RUFBNkU7UUFDN0UsK0VBQStFO1FBQy9FLG1GQUFtRjtRQUNuRixLQUFLLElBQUksUUFBUSxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFO1lBQy9DLE1BQU0sZ0JBQWdCLEdBQUcseUJBQXlCLENBQUMsU0FBUyxFQUFFLGVBQVEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM1RixJQUFJLGdCQUFnQixDQUFDLE1BQU0sRUFBRTtnQkFDM0IsT0FBTyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM1QjtTQUNGO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBckJELHNEQXFCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1dvcmtzcGFjZVByb2plY3QsIFdvcmtzcGFjZVNjaGVtYX0gZnJvbSAnQHNjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3dvcmtzcGFjZS1tb2RlbHMnO1xuaW1wb3J0IHtpc0Fic29sdXRlLCByZWxhdGl2ZX0gZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqIEZpbmRzIGFsbCBwcm9qZWN0cyB3aGljaCBjb250YWluIHRoZSBnaXZlbiBwYXRoLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1hdGNoaW5nUHJvamVjdHNCeVBhdGgoXG4gICAgd29ya3NwYWNlOiBXb3Jrc3BhY2VTY2hlbWEsIHNlYXJjaFBhdGg6IHN0cmluZyk6IFdvcmtzcGFjZVByb2plY3RbXSB7XG4gIGNvbnN0IHByb2plY3ROYW1lcyA9IE9iamVjdC5rZXlzKHdvcmtzcGFjZS5wcm9qZWN0cyk7XG4gIGNvbnN0IGlzUHJvamVjdE1hdGNoaW5nID0gKHJlbGF0aXZlUHJvamVjdFBhdGg6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIC8vIEJ1aWxkIHRoZSByZWxhdGl2ZSBwYXRoIGZyb20gdGhlIHJlYWwgcHJvamVjdCBwYXRoIHRvIHRoZVxuICAgIC8vIHBvc3NpYmxlIHByb2plY3QgcGF0aCBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIHNlYXJjaCBwYXRoLlxuICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHJlbGF0aXZlKHJlbGF0aXZlUHJvamVjdFBhdGgsIHNlYXJjaFBhdGgpO1xuICAgIC8vIElmIHRoZSByZWxhdGl2ZSBwYXRoIGRvZXMgbm90IHN0YXJ0IHdpdGggdHdvIGRvdHMgYW5kIGlzIG5vdCBhYnNvbHV0ZSwgd2VcbiAgICAvLyBrbm93IHRoYXQgdGhlIHNlYXJjaCBwYXRoIGlzIGluc2lkZSB0aGUgZ2l2ZW4gcHJvamVjdCBwYXRoLlxuICAgIHJldHVybiAhcmVsYXRpdmVQYXRoLnN0YXJ0c1dpdGgoJy4uJykgJiYgIWlzQWJzb2x1dGUocmVsYXRpdmVQYXRoKTtcbiAgfTtcblxuICByZXR1cm4gcHJvamVjdE5hbWVzLm1hcChuYW1lID0+IHdvcmtzcGFjZS5wcm9qZWN0c1tuYW1lXSlcbiAgICAgIC5maWx0ZXIocCA9PiBpc1Byb2plY3RNYXRjaGluZyhwLnJvb3QpKVxuICAgICAgLnNvcnQoKGEsIGIpID0+IGIucm9vdC5sZW5ndGggLSBhLnJvb3QubGVuZ3RoKTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBtYXRjaGluZyBBbmd1bGFyIENMSSB3b3Jrc3BhY2UgcHJvamVjdCBmcm9tIHRoZSBnaXZlbiBwcm9ncmFtLiBQcm9qZWN0XG4gKiBpcyBkZXRlcm1pbmVkIGJ5IGNoZWNraW5nIHJvb3QgZmlsZSBuYW1lcyBvZiB0aGUgcHJvZ3JhbSBhZ2FpbnN0IHByb2plY3QgcGF0aHMuXG4gKlxuICogSWYgdGhlcmUgaXMgb25seSBvbmUgcHJvamVjdCBzZXQgdXAsIHRoZSBwcm9qZWN0IHdpbGwgYmUgcmV0dXJuZWQgcmVnYXJkbGVzcyBvZlxuICogd2hldGhlciBpdCBtYXRjaGVzIGFueSBvZiB0aGUgc3BlY2lmaWVkIHByb2dyYW0gZmlsZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm9qZWN0RnJvbVByb2dyYW0oXG4gICAgd29ya3NwYWNlOiBXb3Jrc3BhY2VTY2hlbWEsIHByb2dyYW06IHRzLlByb2dyYW0pOiBXb3Jrc3BhY2VQcm9qZWN0fG51bGwge1xuICBjb25zdCBwcm9qZWN0TmFtZXMgPSBPYmplY3Qua2V5cyh3b3Jrc3BhY2UucHJvamVjdHMpO1xuXG4gIC8vIElmIHRoZXJlIGlzIG9ubHkgb25lIHByb2plY3QsIHdlIGp1c3QgcmV0dXJuIGl0IHdpdGhvdXQgbG9va2luZ1xuICAvLyBmb3Igb3RoZXIgbWF0Y2hpbmcgcHJvamVjdHMuXG4gIGlmIChwcm9qZWN0TmFtZXMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIHdvcmtzcGFjZS5wcm9qZWN0c1twcm9qZWN0TmFtZXNbMF1dO1xuICB9XG5cbiAgY29uc3QgYmFzZVBhdGggPSBwcm9ncmFtLmdldEN1cnJlbnREaXJlY3RvcnkoKTtcbiAgLy8gR28gdGhyb3VnaCB0aGUgcm9vdCBmaWxlIG5hbWVzIG9mIHRoZSBwcm9ncmFtIGFuZCByZXR1cm4gdGhlIGZpcnN0IHByb2plY3RcbiAgLy8gdGhhdCBtYXRjaGVzIGEgZ2l2ZW4gcm9vdCBmaWxlLiBXZSBjYW4ndCBqdXN0IHRha2UgYW55IGFyYml0cmFyeSBmaWxlIGluIHRoZVxuICAvLyBsaXN0IHNpbmNlIHNvbWV0aW1lcyB0aGVyZSBjYW4gYmUgcm9vdCBmaWxlcyB3aGljaCBkbyBub3QgYmVsb25nIHRvIGFueSBwcm9qZWN0LlxuICBmb3IgKGxldCBmaWxlUGF0aCBvZiBwcm9ncmFtLmdldFJvb3RGaWxlTmFtZXMoKSkge1xuICAgIGNvbnN0IG1hdGNoaW5nUHJvamVjdHMgPSBnZXRNYXRjaGluZ1Byb2plY3RzQnlQYXRoKHdvcmtzcGFjZSwgcmVsYXRpdmUoYmFzZVBhdGgsIGZpbGVQYXRoKSk7XG4gICAgaWYgKG1hdGNoaW5nUHJvamVjdHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gbWF0Y2hpbmdQcm9qZWN0c1swXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG4iXX0=
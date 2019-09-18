/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export { MatCommonModule, MATERIAL_SANITY_CHECKS, } from './common-module';
export { mixinDisabled } from './disabled';
export { mixinColor } from './color';
export { mixinDisableRipple } from './disable-ripple';
export { mixinTabIndex } from './tabindex';
export { mixinErrorState } from './error-state';
export { mixinInitialized } from './initialized';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvY29yZS9jb21tb24tYmVoYXZpb3JzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxlQUFlLEVBQ2Ysc0JBQXNCLEdBR3ZCLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUE2QixhQUFhLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDckUsT0FBTyxFQUF5QixVQUFVLEVBQWUsTUFBTSxTQUFTLENBQUM7QUFDekUsT0FBTyxFQUF5QyxrQkFBa0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQzVGLE9BQU8sRUFBK0IsYUFBYSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3ZFLE9BQU8sRUFBK0MsZUFBZSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVGLE9BQU8sRUFBcUMsZ0JBQWdCLEVBQUMsTUFBTSxlQUFlLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuZXhwb3J0IHtcbiAgTWF0Q29tbW9uTW9kdWxlLFxuICBNQVRFUklBTF9TQU5JVFlfQ0hFQ0tTLFxuICBTYW5pdHlDaGVja3MsXG4gIEdyYW51bGFyU2FuaXR5Q2hlY2tzLFxufSBmcm9tICcuL2NvbW1vbi1tb2R1bGUnO1xuZXhwb3J0IHtDYW5EaXNhYmxlLCBDYW5EaXNhYmxlQ3RvciwgbWl4aW5EaXNhYmxlZH0gZnJvbSAnLi9kaXNhYmxlZCc7XG5leHBvcnQge0NhbkNvbG9yLCBDYW5Db2xvckN0b3IsIG1peGluQ29sb3IsIFRoZW1lUGFsZXR0ZX0gZnJvbSAnLi9jb2xvcic7XG5leHBvcnQge0NhbkRpc2FibGVSaXBwbGUsIENhbkRpc2FibGVSaXBwbGVDdG9yLCBtaXhpbkRpc2FibGVSaXBwbGV9IGZyb20gJy4vZGlzYWJsZS1yaXBwbGUnO1xuZXhwb3J0IHtIYXNUYWJJbmRleCwgSGFzVGFiSW5kZXhDdG9yLCBtaXhpblRhYkluZGV4fSBmcm9tICcuL3RhYmluZGV4JztcbmV4cG9ydCB7Q2FuVXBkYXRlRXJyb3JTdGF0ZSwgQ2FuVXBkYXRlRXJyb3JTdGF0ZUN0b3IsIG1peGluRXJyb3JTdGF0ZX0gZnJvbSAnLi9lcnJvci1zdGF0ZSc7XG5leHBvcnQge0hhc0luaXRpYWxpemVkLCBIYXNJbml0aWFsaXplZEN0b3IsIG1peGluSW5pdGlhbGl6ZWR9IGZyb20gJy4vaW5pdGlhbGl6ZWQnO1xuIl19
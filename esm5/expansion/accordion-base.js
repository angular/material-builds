/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { InjectionToken } from '@angular/core';
/**
 * Token used to provide a `MatAccordion` to `MatExpansionPanel`.
 * Used primarily to avoid circular imports between `MatAccordion` and `MatExpansionPanel`.
 */
export var MAT_ACCORDION = new InjectionToken('MAT_ACCORDION');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZXhwYW5zaW9uL2FjY29yZGlvbi1iYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7QUErQjdDOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxJQUFNLGFBQWEsR0FBRyxJQUFJLGNBQWMsQ0FBbUIsZUFBZSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtJbmplY3Rpb25Ub2tlbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Nka0FjY29yZGlvbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2FjY29yZGlvbic7XG5cbi8qKiBNYXRBY2NvcmRpb24ncyBkaXNwbGF5IG1vZGVzLiAqL1xuZXhwb3J0IHR5cGUgTWF0QWNjb3JkaW9uRGlzcGxheU1vZGUgPSAnZGVmYXVsdCcgfCAnZmxhdCc7XG5cbi8qKiBNYXRBY2NvcmRpb24ncyB0b2dnbGUgcG9zaXRpb25zLiAqL1xuZXhwb3J0IHR5cGUgTWF0QWNjb3JkaW9uVG9nZ2xlUG9zaXRpb24gPSAnYmVmb3JlJyB8ICdhZnRlcic7XG5cbi8qKlxuICogQmFzZSBpbnRlcmZhY2UgZm9yIGEgYE1hdEFjY29yZGlvbmAuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0QWNjb3JkaW9uQmFzZSBleHRlbmRzIENka0FjY29yZGlvbiB7XG4gIC8qKiBXaGV0aGVyIHRoZSBleHBhbnNpb24gaW5kaWNhdG9yIHNob3VsZCBiZSBoaWRkZW4uICovXG4gIGhpZGVUb2dnbGU6IGJvb2xlYW47XG5cbiAgLyoqIERpc3BsYXkgbW9kZSB1c2VkIGZvciBhbGwgZXhwYW5zaW9uIHBhbmVscyBpbiB0aGUgYWNjb3JkaW9uLiAqL1xuICBkaXNwbGF5TW9kZTogTWF0QWNjb3JkaW9uRGlzcGxheU1vZGU7XG5cbiAgLyoqIFRoZSBwb3NpdGlvbiBvZiB0aGUgZXhwYW5zaW9uIGluZGljYXRvci4gKi9cbiAgdG9nZ2xlUG9zaXRpb246IE1hdEFjY29yZGlvblRvZ2dsZVBvc2l0aW9uO1xuXG4gIC8qKiBIYW5kbGVzIGtleWJvYXJkIGV2ZW50cyBjb21pbmcgaW4gZnJvbSB0aGUgcGFuZWwgaGVhZGVycy4gKi9cbiAgX2hhbmRsZUhlYWRlcktleWRvd246IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZDtcblxuICAvKiogSGFuZGxlcyBmb2N1cyBldmVudHMgb24gdGhlIHBhbmVsIGhlYWRlcnMuICovXG4gIF9oYW5kbGVIZWFkZXJGb2N1czogKGhlYWRlcjogYW55KSA9PiB2b2lkO1xufVxuXG5cbi8qKlxuICogVG9rZW4gdXNlZCB0byBwcm92aWRlIGEgYE1hdEFjY29yZGlvbmAgdG8gYE1hdEV4cGFuc2lvblBhbmVsYC5cbiAqIFVzZWQgcHJpbWFyaWx5IHRvIGF2b2lkIGNpcmN1bGFyIGltcG9ydHMgYmV0d2VlbiBgTWF0QWNjb3JkaW9uYCBhbmQgYE1hdEV4cGFuc2lvblBhbmVsYC5cbiAqL1xuZXhwb3J0IGNvbnN0IE1BVF9BQ0NPUkRJT04gPSBuZXcgSW5qZWN0aW9uVG9rZW48TWF0QWNjb3JkaW9uQmFzZT4oJ01BVF9BQ0NPUkRJT04nKTtcbiJdfQ==
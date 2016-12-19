import { MdGestureConfig } from '../core';
/**
 * An extension of MdGestureConfig that exposes the underlying HammerManager instances.
 * Tests can use these instances to emit fake gesture events.
 */
export declare class TestGestureConfig extends MdGestureConfig {
    /**
     * A map of Hammer instances to element.
     * Used to emit events over instances for an element.
     */
    hammerInstances: Map<HTMLElement, HammerManager[]>;
    /**
     * Create a mapping of Hammer instances to element so that events can be emitted during testing.
     */
    buildHammer(element: HTMLElement): HammerManager;
    /**
     * The Angular event plugin for Hammer creates a new HammerManager instance for each listener,
     * so we need to apply our event on all instances to hit the correct listener.
     */
    emitEventForElement(eventType: string, element: HTMLElement, eventData?: {}): void;
}

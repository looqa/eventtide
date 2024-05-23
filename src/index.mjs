import { Bus } from "./Models/Bus.mjs";
import { Listener } from "./Models/Listener.mjs";
import { Event } from "./Models/Event.mjs";

const buses = {};

/**
 * @typedef {Object} BusConfig
 * @property {boolean} debug
 * @property {boolean} suppress
 * @property {boolean} async
 */

/**
 * @typedef {Object} ListenerConfig
 * @property {number} priority
 */

/**
 * @typedef {Object} EventConfig
 * @property {boolean} exact
 */

/**
 * Initializes or retrieves a bus instance.
 *
 * @param {string} [busId='default'] - The ID of the bus.
 * @param {BusConfig} [busConfig={}] - The configuration for the bus.
 */
export const bus = (busId = 'default', busConfig = {}) => {
    if (!buses[busId]) {
        buses[busId] = new Bus(busId, busConfig);
    } else if (Object.keys(busConfig).length) {
        console.warn(`Bus ${busId} was already defined, but there is another call with config. This config was not applied`);
    }

    /**
     * @type Bus
     */
    const busInstance = buses[busId];

    /**
     * Registers an event listener.
     * @method on
     * @param {string} path - The event path.
     * @param {Function} handler - The handler function for the event.
     * @param {ListenerConfig} [listenConfig={}] - The configuration for the listener.
     * @returns {Listener} The registered listener.
     */
    const on = (path, handler, listenConfig = {}) => {
        const listener = new Listener(handler, path, busInstance, listenConfig);
        return busInstance.addListener(listener);
    };

    /**
     * Emits an event.
     * @method emit
     * @param {string} path - The event path.
     * @param {any} [payload=null] - The event payload.
     * @param {EventConfig} [eventConfig={}] - The configuration for the event.
     * @returns {Promise<void>} A promise that resolves when the event has been processed.
     */
    const emit = (path, payload = null, eventConfig = {}) => {
        const event = new Event(path, payload, eventConfig);
        return busInstance.call(event);
    };

    return { on, emit };
};
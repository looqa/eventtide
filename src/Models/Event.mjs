import {Path} from "./Path.mjs";
import {defaultEventConfig} from "../Configs.mjs";
import {assignConfig} from "../Utils.mjs";

/**
 * @typedef Event
 * @property {string} path
 * @property {EventConfig} config
 */

/**
 * @type Event
 */
export class Event {
    constructor(path, payload = null, config = {}) {
        this.config = assignConfig(config, defaultEventConfig)
        this.path = new Path(path, true)
        this.payload = payload
    }

    isExact = () => this.config.exact
}
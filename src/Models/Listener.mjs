
import {defaultListenerConfig} from "../Configs.mjs";
import {Path} from "./Path.mjs";
import {assignConfig, MD5} from "../Utils.mjs";


/**
 * @typedef {Object} Listener
 * @property {ListenerConfig} config
 * @property {Function} handler
 * @property {Bus} bus
 * @property {string} handlerHash
 * @property {Path} path
 * @property {Function} off - Turns off listener
 */

/**
 * @type Listener
 */
export class Listener {
    constructor(handler, path, bus, config = {}) {
        this.config = assignConfig(config, defaultListenerConfig)
        this.handler = handler
        this.path = new Path(path)
        this.bus = bus
        this.handlerHash = MD5(handler.toString())
        this.node = null
    }

    async call(payload = null) {
        await this.handler(payload)
    }

    off() {
        this.bus.offListener(this)
    }
    setNode(node) {
        this.node = node
    }
    getNode = () => this.node

    getPath = () => this.path

    isDeep = () => this.path.deep

    getPriority = () => this.config.priority ?? 0
}
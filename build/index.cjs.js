'use strict';

const defaultListenerConfig = {
    priority: 1
};

/**
 * @type {EventConfig}
 */
const defaultEventConfig = {
    exact: false
};

const defaultBusConfig = {
    debug: false,
    suppress: true,
    async: false
};

const MD5 = function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r),f+=m.charAt(_>>>4&15)+m.charAt(15&_);return f}function X(d){for(var _=Array(d.length>>2),m=0;m<_.length;m++)_[m]=0;for(m=0;m<8*d.length;m+=8)_[m>>5]|=(255&d.charCodeAt(m/8))<<m%32;return _}function V(d){for(var _="",m=0;m<32*d.length;m+=8)_+=String.fromCharCode(d[m>>5]>>>m%32&255);return _}function Y(d,_){d[_>>5]|=128<<_%32,d[14+(_+64>>>9<<4)]=_;for(var m=1732584193,f=-271733879,r=-1732584194,i=271733878,n=0;n<d.length;n+=16){var h=m,t=f,g=r,e=i;f=md5_ii(f=md5_ii(f=md5_ii(f=md5_ii(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_hh(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_gg(f=md5_ff(f=md5_ff(f=md5_ff(f=md5_ff(f,r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+0],7,-680876936),f,r,d[n+1],12,-389564586),m,f,d[n+2],17,606105819),i,m,d[n+3],22,-1044525330),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+4],7,-176418897),f,r,d[n+5],12,1200080426),m,f,d[n+6],17,-1473231341),i,m,d[n+7],22,-45705983),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+8],7,1770035416),f,r,d[n+9],12,-1958414417),m,f,d[n+10],17,-42063),i,m,d[n+11],22,-1990404162),r=md5_ff(r,i=md5_ff(i,m=md5_ff(m,f,r,i,d[n+12],7,1804603682),f,r,d[n+13],12,-40341101),m,f,d[n+14],17,-1502002290),i,m,d[n+15],22,1236535329),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+1],5,-165796510),f,r,d[n+6],9,-1069501632),m,f,d[n+11],14,643717713),i,m,d[n+0],20,-373897302),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+5],5,-701558691),f,r,d[n+10],9,38016083),m,f,d[n+15],14,-660478335),i,m,d[n+4],20,-405537848),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+9],5,568446438),f,r,d[n+14],9,-1019803690),m,f,d[n+3],14,-187363961),i,m,d[n+8],20,1163531501),r=md5_gg(r,i=md5_gg(i,m=md5_gg(m,f,r,i,d[n+13],5,-1444681467),f,r,d[n+2],9,-51403784),m,f,d[n+7],14,1735328473),i,m,d[n+12],20,-1926607734),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+5],4,-378558),f,r,d[n+8],11,-2022574463),m,f,d[n+11],16,1839030562),i,m,d[n+14],23,-35309556),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+1],4,-1530992060),f,r,d[n+4],11,1272893353),m,f,d[n+7],16,-155497632),i,m,d[n+10],23,-1094730640),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+13],4,681279174),f,r,d[n+0],11,-358537222),m,f,d[n+3],16,-722521979),i,m,d[n+6],23,76029189),r=md5_hh(r,i=md5_hh(i,m=md5_hh(m,f,r,i,d[n+9],4,-640364487),f,r,d[n+12],11,-421815835),m,f,d[n+15],16,530742520),i,m,d[n+2],23,-995338651),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+0],6,-198630844),f,r,d[n+7],10,1126891415),m,f,d[n+14],15,-1416354905),i,m,d[n+5],21,-57434055),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+12],6,1700485571),f,r,d[n+3],10,-1894986606),m,f,d[n+10],15,-1051523),i,m,d[n+1],21,-2054922799),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+8],6,1873313359),f,r,d[n+15],10,-30611744),m,f,d[n+6],15,-1560198380),i,m,d[n+13],21,1309151649),r=md5_ii(r,i=md5_ii(i,m=md5_ii(m,f,r,i,d[n+4],6,-145523070),f,r,d[n+11],10,-1120210379),m,f,d[n+2],15,718787259),i,m,d[n+9],21,-343485551),m=safe_add(m,h),f=safe_add(f,t),r=safe_add(r,g),i=safe_add(i,e);}return Array(m,f,r,i)}function md5_cmn(d,_,m,f,r,i){return safe_add(bit_rol(safe_add(safe_add(_,d),safe_add(f,i)),r),m)}function md5_ff(d,_,m,f,r,i,n){return md5_cmn(_&m|~_&f,d,_,r,i,n)}function md5_gg(d,_,m,f,r,i,n){return md5_cmn(_&f|m&~f,d,_,r,i,n)}function md5_hh(d,_,m,f,r,i,n){return md5_cmn(_^m^f,d,_,r,i,n)}function md5_ii(d,_,m,f,r,i,n){return md5_cmn(m^(_|~f),d,_,r,i,n)}function safe_add(d,_){var m=(65535&d)+(65535&_);return (d>>16)+(_>>16)+(m>>16)<<16|65535&m}function bit_rol(d,_){return d<<_|d>>>32-_}

const assignConfig = (config, defaultConfig) => {
    for (let key in defaultConfig) {
        if (!config.hasOwnProperty(key)) {
            config[key] = defaultConfig[key];
        }
    }
    return config
};

/**
 * @typedef Path
 * @property {Array<string>} parts
 * @property {boolean} deep
 * @property {string} original
 */

/**
 * @type Path
 */
class Path {
    constructor(path, exact = false) {
        this.original = path;
        const parts = path.split('.');
        this.#validatePath(parts, exact);

        if (parts.length && parts[parts.length - 1] === '*') {
            this.deep = true;
            parts.pop();
        } else {
            this.deep = false;
        }
        if (this.original !== '')
            parts.unshift('');
        this.parts = parts;
    }

    /**
     * @param {Array<string>} path
     * @param {boolean} exact
     */
    #validatePath(path, exact) {
        let violations = [];
        let asteriskIndex = null;
        path.forEach((entry, i) => {
            if (entry === '*') {
                if (exact) {
                    violations.push("Asterisk is not allowed when emitting event");
                } else {
                    if (asteriskIndex !== null) {
                        violations.push('Multiple asterisks found, only one expected');
                    }
                    asteriskIndex = i;
                    if (asteriskIndex < path.length - 1) {
                        violations.push('Asterisk allowed only at the end of the path');
                    }
                }
            }
        });
        if (violations.length) {
            throw new Error(`Path ${this.original}, found violations: ` + violations.toString())
        }
    }

    *iterateHashes(desc = false) {
        for (let i = !desc ? 1 : this.parts.length - 1; !desc ? i <= this.parts.length : i >= 0; !desc ? i++ : i--) {
            const nodePath = this.parts.slice(0, i);
            if (!nodePath.length) return
            let nodeString = nodePath.join('.');
            yield {hash: MD5(nodeString), path: nodeString};
        }
    }

    getTailHash = () => MD5(this.parts.join('.'))
}

/**
 * @typedef {Object} Listener
 * @property {ListenerConfig} config
 * @property {Function} handler
 * @property {Bus} bus
 * @property {Path} path
 * @property {Function} off - Turns off listener
 */

/**
 * @type Listener
 */
class Listener {
    constructor(handler, path, bus, config = {}) {
        this.config = assignConfig(config, defaultListenerConfig);
        this.handler = handler;
        this.path = new Path(path);
        this.bus = bus;
        this.node = null;
    }

    async call(payload = null) {
        await this.handler(payload);
    }

    off() {
        this.handler = null;
        delete this.path;
        this.bus.removeListener(this);
    }
    setNode(node) {
        this.node = node;
    }
    getNode = () => this.node

    getPath = () => this.path

    isDeep = () => this.path.deep

    getPriority = () => this.config.priority ?? 0
}

/**
 * @typedef Node
 * @property {string} name
 * @property {Number} level
 * @property {Node|null} parent
 * @property {Array<Node>} children
 * @property {Array<Listener>} listeners
 */

/**
 * @type Node
 */
class Node {
    constructor(name, level, path) {
        this.name = name;
        this.path = path;
        this.level = level;
        this.parent = null;
        this.children = [];
        this.listeners = [];
    }

    setParent(parent) {
        if (this.parent) return
        this.parent = parent;
        this.parent.setChild(this);
    }

    setChild(child) {
        this.children.push(child);
    }

    addListener(listener) {
        this.listeners.push(listener);
        listener.setNode(this);
    }



    /**
     *
     * @param {Listener} listener
     */
    off(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1)
            this.listeners.splice(index, 1);
        listener.setNode(null);
    }

    /**
     * Gets direct listeners of the node.
     * @return {Array<Listener>}
     */
    getDirectListeners() {
        return Array.from(this.listeners);
    }

    isChainEmpty() {
        if (this.getDirectListeners().length) return false
        let nodes = this.getChilds();
        for (let node of nodes) {
            if (node.getDirectListeners().length
                || node.getChilds().length
                || !node.isChainEmpty()) return false
        }
        return true
    }

    cleanupChildren() {
        let ret = [];
        let nodes = this.children;
        for (let i in nodes) {
            ret.push(...nodes[i].cleanupChildren());
            if (!nodes[i].getChilds().length && !nodes[i].getDirectListeners().length) {
                ret.push(nodes[i]);
                this.children.splice(i, 1);
            }
        }
        return ret
    }

    /**
     * Gets deep listeners from the current node up to the root.
     * @return {Array<Listener>}
     */
    getDeepListeners = () => this.listeners.filter(it => it.isDeep())

    getParent = () => this.parent

    /**
     *
     * @return {Array<Node>}
     */
    getChilds = () => Array.from(this.children)

}

/**
 * @typedef {object} Bus
 * @property {BusConfig} config
 * @property {string} id
 */

/**
 * @type Bus
 */
class Bus {

    /**
     * @param {string} id
     * @param {BusConfig} config
     */
    constructor(id, config = {}) {
        this.config = assignConfig(config, defaultBusConfig);
        this.id = id;
        this.nodes = {};
    }

    /**
     *
     * @param {Listener} listener
     * @return {Listener}
     */
    addListener(listener) {
        let node = this.#initNode(listener.getPath());
        node.addListener(listener);
        return listener
    }

    /**
     * @param {Listener} listener
     */
    removeListener(listener) {
        let node = listener.getNode();
        if (node) {
            node.off(listener);
            this.#clearNode(node);
        }
    }

    /**
     *
     * @param {Node} node
     */
    #clearNode(node) {
        let toRemove = node.cleanupChildren();
        if (node.isChainEmpty()) {
            toRemove.push(node);
        }
        for (let n of toRemove) {
                delete this.nodes[n.name];
        }
    }


    call(event) {
        const listenersToCall = [];
        let node = this.#getTailNode(event.path);
        if (event.isExact() && !node) {
            if (this.isDebug()) {
                console.info(`${event.path.original}: no listeners on exact path`);
            }
            return
        }

        if (node) {
            listenersToCall.push(...node.getDirectListeners());

            node = node.getParent();
            while (node) {
                listenersToCall.push(...node.getDeepListeners());
                node = node.getParent();
            }
        } else {
            let nodeGen = this.#iterateNodes(event.path, true);
            for (let nextNode of nodeGen) {
                listenersToCall.push(...nextNode.getDeepListeners());
            }
        }

        listenersToCall.sort((a, b) => a.getPriority() - b.getPriority());

        if (this.isAsync()) {
            return Promise.all(
                listenersToCall.map(listener =>
                    listener.call(event.payload).catch(e => {
                        if (!this.isSuppressing()) throw e;
                        console.warn('Suppressed exception from listener', e);
                    })
                )
            );
        }
        return listenersToCall.reduce((promiseChain, listener) => {
            return promiseChain.then(() => listener.call(event.payload).catch(e => {
                if (!this.isSuppressing()) throw e;
                console.warn('Suppressed exception from listener', e);
            }));
        }, Promise.resolve());
    }

    /**
     * @param {Path} path
     * @return {Node}
     */
    #initNode = (path) => {
        const nodeHashGen = path.iterateHashes();
        let level = 0;
        let latestNode = null;
        for (let {hash, path} of nodeHashGen) {
            let nextNode = this.#getNode(hash) || (this.nodes[hash] = new Node(hash, level, path));
            if (latestNode) nextNode.setParent(latestNode);
            latestNode = nextNode;
            level++;
        }
        return latestNode
    }
    #getTailNode = (path) => this.#getNode(path.getTailHash()) ?? null

    #iterateNodes = function* (path, desc = false) {
        const nodeHashGen = path.iterateHashes(desc);
        for (let {hash} of nodeHashGen) {
            let node = this.#getNode(hash);
            if (node) yield node;
        }
    }
    #getNode = (hash) => this.nodes[hash]

    isSuppressing = () => this.config.suppress
    isDebug = () => this.config.debug
    isAsync = () => this.config.async
}

/**
 * @typedef Event
 * @property {string} path
 * @property {EventConfig} config
 */

/**
 * @type Event
 */
class Event {
    constructor(path, payload = null, config = {}) {
        this.config = assignConfig(config, defaultEventConfig);
        this.path = new Path(path, true);
        this.payload = payload;
    }

    isExact = () => this.config.exact
}

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
const bus = (busId = 'default', busConfig = {}) => {
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

exports.bus = bus;

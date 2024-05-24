import {Node} from "./Node.mjs";
import {defaultBusConfig} from "../Configs.mjs";
import {assignConfig} from "../Utils.mjs";

/**
 * @typedef {object} Bus
 * @property {BusConfig} config
 * @property {string} id
 */

/**
 * @type Bus
 */
export class Bus {

    /**
     * @param {string} id
     * @param {BusConfig} config
     */
    constructor(id, config = {}) {
        this.config = assignConfig(config, defaultBusConfig)
        this.id = id
        this.nodes = {}
    }

    /**
     *
     * @param {Listener} listener
     * @return {Listener}
     */
    addListener(listener) {
        let node = this.#initNode(listener.getPath())
        node.addListener(listener)
        return listener
    }

    /**
     * @param {Listener} listener
     */
    removeListener(listener) {
        let node = listener.getNode()
        if (node) {
            node.off(listener)
            this.#clearNode(node)
        }
    }

    /**
     *
     * @param {Node} node
     */
    #clearNode(node) {
        let toRemove = node.cleanupChildren()
        if (node.isChainEmpty()) {
            toRemove.push(node)
        }
        for (let n of toRemove) {
                delete this.nodes[n.name]
        }
    }


    call(event) {
        const listenersToCall = []
        let node = this.#getTailNode(event.path)
        if (event.isExact() && !node) {
            if (this.isDebug()) {
                console.info(`${event.path.original}: no listeners on exact path`)
            }
            return
        }

        if (node) {
            listenersToCall.push(...node.getDirectListeners())

            node = node.getParent()
            while (node) {
                listenersToCall.push(...node.getDeepListeners())
                node = node.getParent()
            }
        } else {
            let nodeGen = this.#iterateNodes(event.path, true)
            for (let nextNode of nodeGen) {
                listenersToCall.push(...nextNode.getDeepListeners())
            }
        }

        listenersToCall.sort((a, b) => a.getPriority() - b.getPriority())

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
        const nodeHashGen = path.iterateHashes()
        let level = 0
        let latestNode = null
        for (let {hash, path} of nodeHashGen) {
            let nextNode = this.#getNode(hash) || (this.nodes[hash] = new Node(hash, level, path))
            if (latestNode) nextNode.setParent(latestNode)
            latestNode = nextNode
            level++
        }
        return latestNode
    }
    #getTailNode = (path) => this.#getNode(path.getTailHash()) ?? null

    #iterateNodes = function* (path, desc = false) {
        const nodeHashGen = path.iterateHashes(desc)
        for (let {hash} of nodeHashGen) {
            let node = this.#getNode(hash)
            if (node) yield node
        }
    }
    #getNode = (hash) => this.nodes[hash]

    isSuppressing = () => this.config.suppress
    isDebug = () => this.config.debug
    isAsync = () => this.config.async
}



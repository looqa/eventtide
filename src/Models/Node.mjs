import {Listener} from "./Listener.mjs";

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
export class Node {
    constructor(name, level, path) {
        this.name = name
        this.path = path
        this.level = level
        this.parent = null
        this.children = []
        this.listeners = []
    }

    setParent(parent) {
        if (this.parent) return
        this.parent = parent
        this.parent.setChild(this)
    }

    setChild(child) {
        this.children.push(child)
    }

    addListener(listener) {
        this.listeners.push(listener)
        listener.setNode(this)
    }



    /**
     *
     * @param {Listener} listener
     */
    off(listener) {
        const index = this.listeners.indexOf(listener)
        if (index !== -1)
            this.listeners.splice(index, 1)
        listener.setNode(null)
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
        let nodes = this.getChilds()
        for (let node of nodes) {
            if (node.getDirectListeners().length
                || node.getChilds().length
                || !node.isChainEmpty()) return false
        }
        return true
    }

    cleanupChildren() {
        let ret = []
        let nodes = this.children
        for (let i in nodes) {
            ret.push(...nodes[i].cleanupChildren())
            if (!nodes[i].getChilds().length && !nodes[i].getDirectListeners().length) {
                ret.push(nodes[i])
                this.children.splice(i, 1)
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
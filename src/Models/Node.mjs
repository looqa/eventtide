import { Listener } from "./Listener.mjs";

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
    constructor(name, level) {
        this.name = name;
        this.level = level;
        this.parent = null;
        this.children = [];
        this.listeners = [];
    }

    setParent(parent) {
        if (this.parent) return;
        this.parent = parent;
        this.parent.setChild(this);
    }

    setChild(child) {
        this.children.push(child);
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
        const index = this.listeners.findIndex(it => it === listener)
        if (index !== -1)
            this.listeners.splice(index, 1)
    }

    /**
     * Gets direct listeners of the node.
     * @return {Array<Listener>}
     */
    getDirectListeners() {
        return Array.from(this.listeners);
    }

    /**
     * Gets deep listeners from the current node up to the root.
     * @return {Array<Listener>}
     */
    getDeepListeners = ()=> this.listeners.filter(it => it.isDeep())

    getParent = () => this.parent
    getChilds = () => Array.from(this.children)
}
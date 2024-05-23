import {MD5} from "../Utils.mjs";


/**
 * @typedef Path
 * @property {Array<string>} parts
 * @property {boolean} deep
 * @property {string} original
 */

/**
 * @type Path
 */
export class Path {
    constructor(path, exact = false) {
        this.original = path
        const parts = path.split('.')
        this.#validatePath(parts, exact)

        if (parts.length && parts[parts.length - 1] === '*') {
            this.deep = true
            parts.pop()
        } else {
            this.deep = false
        }
        if (this.original !== '')
            parts.unshift('')
        this.parts = parts
    }

    /**
     * @param {Array<string>} path
     * @param {boolean} exact
     */
    #validatePath(path, exact) {
        let violations = []
        let asteriskIndex = null
        path.forEach((entry, i) => {
            if (entry === '*') {
                if (exact) {
                    violations.push("Asterisk is not allowed when emitting event")
                } else {
                    if (asteriskIndex !== null) {
                        violations.push('Multiple asterisks found, only one expected')
                    }
                    asteriskIndex = i
                    if (asteriskIndex < path.length - 1) {
                        violations.push('Asterisk allowed only at the end of the path')
                    }
                }
            }
        })
        if (violations.length) {
            throw new Error(`Path ${this.original}, found violations: ` + violations.toString())
        }
    }

    /**
     * Generates unique node hash identifier.
     *
     * @param {Number|null} i
     * @return {string}
     */
    getNodeHash(i = null) {
        if (i === null) i = this.parts.length - 1
        const previousPath = this.parts.slice(0, i + 1)
        return MD5(previousPath.join('.') + String(this.parts[i]) + i)
    }

    *iterateHashes (desc = false){
        for (let i = !desc ? 1 : this.parts.length - 1; !desc ? i <= this.parts.length : i >= 0; !desc ? i++ : i--) {
            const nodePath = this.parts.slice(0, i)
            if (!nodePath.length) return
            yield MD5(nodePath.join('.'))
        }
    }

    getTailHash = () => MD5(this.parts.join('.'))
}


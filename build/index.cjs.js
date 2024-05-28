"use strict";const t={priority:1},e={exact:!1},s={debug:!1,suppress:!0,async:!1};
/**
 * @type {EventConfig}
 */function i(t){let e=5381;for(let s=0;s<t.length;s++)e=(e<<5)+e+t.charCodeAt(s),e|=0;return e>>>0^t.length}const n=(t,e)=>{for(let s in e)t.hasOwnProperty(s)||(t[s]=e[s]);return t};
/**
 * @typedef Path
 * @property {Array<string>} parts
 * @property {boolean} deep
 * @property {string} original
 */
/**
 * @type Path
 */class r{constructor(t,e=!1){this.original=t;const s=t.split(".");this.#t(s,e),s.length&&"*"===s[s.length-1]?(this.deep=!0,s.pop()):this.deep=!1,""!==this.original&&s.unshift(""),this.parts=s}
/**
     * @param {Array<string>} path
     * @param {boolean} exact
     */#t(t,e){let s=[],i=null;if(t.forEach(((n,r)=>{"*"===n&&(e?s.push("Asterisk is not allowed when emitting event"):(null!==i&&s.push("Multiple asterisks found, only one expected"),i=r,i<t.length-1&&s.push("Asterisk allowed only at the end of the path")))})),s.length)throw new Error(`Path ${this.original}, found violations: `+s.toString())}*iterateHashes(t=!1){for(let e=t?this.parts.length-1:1;t?e>=0:e<=this.parts.length;t?e--:e++){const t=this.parts.slice(0,e);if(!t.length)return;let s=t.join(".");yield{hash:i(s),path:s}}}getTailHash=()=>i(this.parts.join("."))
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
 */}class h{constructor(e,s,i,h={}){this.config=n(h,t),this.handler=e,this.path=new r(s),this.bus=i,this.node=null}async call(t=null){await this.handler(t)}off(){this.handler=null,delete this.path,this.bus.removeListener(this)}setNode(t){this.node=t}getNode=()=>this.node;getPath=()=>this.path;isDeep=()=>this.path.deep;getPriority=()=>this.config.priority??0
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
 */}class l{constructor(t,e,s){this.name=t,this.path=s,this.level=e,this.parent=null,this.children=[],this.listeners=[]}setParent(t){this.parent||(this.parent=t,this.parent.setChild(this))}setChild(t){this.children.push(t)}addListener(t){this.listeners.push(t),t.setNode(this)}
/**
     *
     * @param {Listener} listener
     */off(t){const e=this.listeners.indexOf(t);-1!==e&&this.listeners.splice(e,1),t.setNode(null)}
/**
     * Gets direct listeners of the node.
     * @return {Array<Listener>}
     */getDirectListeners(){return Array.from(this.listeners)}isChainEmpty(){if(this.getDirectListeners().length)return!1;let t=this.getChilds();for(let e of t)if(e.getDirectListeners().length||e.getChilds().length||!e.isChainEmpty())return!1;return!0}cleanupChildren(){let t=[],e=this.children;for(let s in e)t.push(...e[s].cleanupChildren()),e[s].getChilds().length||e[s].getDirectListeners().length||(t.push(e[s]),this.children.splice(s,1));return t}
/**
     * Gets deep listeners from the current node up to the root.
     * @return {Array<Listener>}
     */getDeepListeners=()=>this.listeners.filter((t=>t.isDeep()));getParent=()=>this.parent
/**
     *
     * @return {Array<Node>}
     */;getChilds=()=>Array.from(this.children)
/**
 * @typedef {object} Bus
 * @property {BusConfig} config
 * @property {string} id
 */
/**
 * @type Bus
 */}class o{
/**
     * @param {string} id
     * @param {BusConfig} config
     */
constructor(t,e={}){this.config=n(e,s),this.id=t,this.nodes={}}
/**
     *
     * @param {Listener} listener
     * @return {Listener}
     */addListener(t){return this.#e(t.getPath()).addListener(t),t}
/**
     * @param {Listener} listener
     */removeListener(t){let e=t.getNode();e&&(e.off(t),this.#s(e))}
/**
     *
     * @param {Node} node
     */#s(t){let e=t.cleanupChildren();t.isChainEmpty()&&e.push(t);for(let t of e)delete this.nodes[t.name]}call(t){const e=[];let s=this.#i(t.path);if(!t.isExact()||s){if(s)for(e.push(...s.getDirectListeners()),s=s.getParent();s;)e.push(...s.getDeepListeners()),s=s.getParent();else{let s=this.#n(t.path,!0);for(let t of s)e.push(...t.getDeepListeners())}return e.sort(((t,e)=>t.getPriority()-e.getPriority())),this.isAsync()?Promise.all(e.map((e=>e.call(t.payload).catch((t=>{if(!this.isSuppressing())throw t;console.warn("Suppressed exception from listener",t)}))))):e.reduce(((e,s)=>e.then((()=>s.call(t.payload).catch((t=>{if(!this.isSuppressing())throw t;console.warn("Suppressed exception from listener",t)}))))),Promise.resolve())}this.isDebug()&&console.info(`${t.path.original}: no listeners on exact path`)}
/**
     * @param {Path} path
     * @return {Node}
     */#e=t=>{const e=t.iterateHashes();let s=0,i=null;for(let{hash:t,path:n}of e){let e=this.#r(t)||(this.nodes[t]=new l(t,s,n));i&&e.setParent(i),i=e,s++}return i};#i=t=>this.#r(t.getTailHash())??null;#n=function*(t,e=!1){const s=t.iterateHashes(e);for(let{hash:t}of s){let e=this.#r(t);e&&(yield e)}};#r=t=>this.nodes[t];isSuppressing=()=>this.config.suppress;isDebug=()=>this.config.debug;isAsync=()=>this.config.async
/**
 * @typedef Event
 * @property {string} path
 * @property {EventConfig} config
 */
/**
 * @type Event
 */}class a{constructor(t,s=null,i={}){this.config=n(i,e),this.path=new r(t,!0),this.payload=s}isExact=()=>this.config.exact}const c={};
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
 */exports.bus=(t="default",e={})=>{c[t]?Object.keys(e).length&&console.warn(`Bus ${t} was already defined, but there is another call with config. This config was not applied`)
/**
     * @type Bus
     */:c[t]=new o(t,e);const s=c[t];
/**
     * Registers an event listener.
     * @method on
     * @param {string} path - The event path.
     * @param {Function} handler - The handler function for the event.
     * @param {ListenerConfig} [listenConfig={}] - The configuration for the listener.
     * @returns {Listener} The registered listener.
     */return{on:(t,e,i={})=>{const n=new h(e,t,s,i);return s.addListener(n)},emit:(t,e=null,i={})=>{const n=new a(t,e,i);return s.call(n)}}};

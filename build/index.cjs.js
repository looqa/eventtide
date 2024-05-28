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
 */class r{constructor(path,t=!1){this.original=path;const e=path.split(".");this.#t(e,t),e.length&&"*"===e[e.length-1]?(this.deep=!0,e.pop()):this.deep=!1,""!==this.original&&e.unshift(""),this.parts=e}
/**
     * @param {Array<string>} path
     * @param {boolean} exact
     */#t(path,t){let e=[],s=null;if(path.forEach(((i,n)=>{"*"===i&&(t?e.push("Asterisk is not allowed when emitting event"):(null!==s&&e.push("Multiple asterisks found, only one expected"),s=n,s<path.length-1&&e.push("Asterisk allowed only at the end of the path")))})),e.length)throw new Error(`Path ${this.original}, found violations: `+e.toString())}*iterateHashes(t=!1){for(let e=t?this.parts.length-1:1;t?e>=0:e<=this.parts.length;t?e--:e++){const t=this.parts.slice(0,e);if(!t.length)return;let s=t.join(".");yield{hash:i(s),path:s}}}getTailHash=()=>i(this.parts.join("."))
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
 */}class h{constructor(handler,path,e,s={}){this.config=n(s,t),this.handler=handler,this.path=new r(path),this.bus=e,this.node=null}async call(payload=null){await this.handler(payload)}off(){this.handler=null,delete this.path,this.bus.removeListener(this)}setNode(t){this.node=t}getNode=()=>this.node;getPath=()=>this.path;isDeep=()=>this.path.deep;getPriority=()=>this.config.priority??0
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
 */}class l{constructor(t,e,path){this.name=t,this.path=path,this.level=e,this.parent=null,this.children=[],this.listeners=[]}setParent(t){this.parent||(this.parent=t,this.parent.setChild(this))}setChild(t){this.children.push(t)}addListener(t){this.listeners.push(t),t.setNode(this)}
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
     */#e=path=>{const t=path.iterateHashes();let e=0,s=null;for(let{hash:i,path:path}of t){let t=this.#r(i)||(this.nodes[i]=new l(i,e,path));s&&t.setParent(s),s=t,e++}return s};#i=path=>this.#r(path.getTailHash())??null;#n=function*(path,t=!1){const e=path.iterateHashes(t);for(let{hash:t}of e){let e=this.#r(t);e&&(yield e)}};#r=t=>this.nodes[t];isSuppressing=()=>this.config.suppress;isDebug=()=>this.config.debug;isAsync=()=>this.config.async
/**
 * @typedef Event
 * @property {string} path
 * @property {EventConfig} config
 */
/**
 * @type Event
 */}class a{constructor(path,payload=null,t={}){this.config=n(t,e),this.path=new r(path,!0),this.payload=payload}isExact=()=>this.config.exact}const c={};
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
 */exports.bus=(busId="default",busConfig={})=>{c[busId]?Object.keys(busConfig).length&&console.warn(`Bus ${busId} was already defined, but there is another call with config. This config was not applied`)
/**
     * @type Bus
     */:c[busId]=new o(busId,busConfig);const t=c[busId];
/**
     * Registers an event listener.
     * @method on
     * @param {string} path - The event path.
     * @param {Function} handler - The handler function for the event.
     * @param {ListenerConfig} [listenConfig={}] - The configuration for the listener.
     * @returns {Listener} The registered listener.
     */return{on:(path,handler,listenConfig={})=>{const e=new h(handler,path,t,listenConfig);return t.addListener(e)},emit:(path,payload=null,eventConfig={})=>{const e=new a(path,payload,eventConfig);return t.call(e)}}};

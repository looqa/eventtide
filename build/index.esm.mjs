const defaultListenerConfig={priority:1};
/**
 * @type {EventConfig}
 */const defaultEventConfig={exact:false};const defaultBusConfig={debug:false,suppress:true,async:false};function DJB2(str){let hash=5381;for(let i=0;i<str.length;i++){hash=(hash<<5)+hash+str.charCodeAt(i);hash&=hash}return hash>>>0^str.length}const assignConfig=(config,defaultConfig)=>{for(let key in defaultConfig)if(!config.hasOwnProperty(key))config[key]=defaultConfig[key];return config};
/**
 * @typedef Path
 * @property {Array<string>} parts
 * @property {boolean} deep
 * @property {string} original
 */
/**
 * @type Path
 */class Path{constructor(path,exact=false){this.original=path;const parts=path.split(".");this.#validatePath(parts,exact);if(parts.length&&parts[parts.length-1]==="*"){this.deep=true;parts.pop()}else this.deep=false;if(this.original!=="")parts.unshift("");this.parts=parts}
/**
     * @param {Array<string>} path
     * @param {boolean} exact
     */#validatePath(path,exact){let violations=[];let asteriskIndex=null;path.forEach(((entry,i)=>{if(entry==="*")if(exact)violations.push("Asterisk is not allowed when emitting event");else{if(asteriskIndex!==null)violations.push("Multiple asterisks found, only one expected");asteriskIndex=i;if(asteriskIndex<path.length-1)violations.push("Asterisk allowed only at the end of the path")}}));if(violations.length)throw new Error(`Path ${this.original}, found violations: `+violations.toString())}*iterateHashes(desc=false){for(let i=!desc?1:this.parts.length-1;!desc?i<=this.parts.length:i>=0;!desc?i++:i--){const nodePath=this.parts.slice(0,i);if(!nodePath.length)return;let nodeString=nodePath.join(".");yield{hash:DJB2(nodeString),path:nodeString}}}getTailHash=()=>DJB2(this.parts.join("."))
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
 */}class Listener{constructor(handler,path,bus,config={}){this.config=assignConfig(config,defaultListenerConfig);this.handler=handler;this.path=new Path(path);this.bus=bus;this.node=null}async call(payload=null){await this.handler(payload)}off(){this.handler=null;delete this.path;this.bus.removeListener(this)}setNode(node){this.node=node}getNode=()=>this.node;getPath=()=>this.path;isDeep=()=>this.path.deep;getPriority=()=>this.config.priority??0
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
 */}class Node{constructor(name,level,path){this.name=name;this.path=path;this.level=level;this.parent=null;this.children=[];this.listeners=[]}setParent(parent){if(this.parent)return;this.parent=parent;this.parent.setChild(this)}setChild(child){this.children.push(child)}addListener(listener){this.listeners.push(listener);listener.setNode(this)}
/**
     *
     * @param {Listener} listener
     */off(listener){const index=this.listeners.indexOf(listener);if(index!==-1)this.listeners.splice(index,1);listener.setNode(null)}
/**
     * Gets direct listeners of the node.
     * @return {Array<Listener>}
     */getDirectListeners(){return Array.from(this.listeners)}isChainEmpty(){if(this.getDirectListeners().length)return false;let nodes=this.getChilds();for(let node of nodes)if(node.getDirectListeners().length||node.getChilds().length||!node.isChainEmpty())return false;return true}cleanupChildren(){let ret=[];let nodes=this.children;for(let i in nodes){ret.push(...nodes[i].cleanupChildren());if(!nodes[i].getChilds().length&&!nodes[i].getDirectListeners().length){ret.push(nodes[i]);this.children.splice(i,1)}}return ret}
/**
     * Gets deep listeners from the current node up to the root.
     * @return {Array<Listener>}
     */getDeepListeners=()=>this.listeners.filter((it=>it.isDeep()));getParent=()=>this.parent
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
 */}class Bus{
/**
     * @param {string} id
     * @param {BusConfig} config
     */
constructor(id,config={}){this.config=assignConfig(config,defaultBusConfig);this.id=id;this.nodes={}}
/**
     *
     * @param {Listener} listener
     * @return {Listener}
     */addListener(listener){let node=this.#initNode(listener.getPath());node.addListener(listener);return listener}
/**
     * @param {Listener} listener
     */removeListener(listener){let node=listener.getNode();if(node){node.off(listener);this.#clearNode(node)}}
/**
     *
     * @param {Node} node
     */#clearNode(node){let toRemove=node.cleanupChildren();if(node.isChainEmpty())toRemove.push(node);for(let n of toRemove)delete this.nodes[n.name]}call(event){const listenersToCall=[];let node=this.#getTailNode(event.path);if(event.isExact()&&!node){if(this.isDebug())console.info(`${event.path.original}: no listeners on exact path`);return}if(node){listenersToCall.push(...node.getDirectListeners());node=node.getParent();while(node){listenersToCall.push(...node.getDeepListeners());node=node.getParent()}}else{let nodeGen=this.#iterateNodes(event.path,true);for(let nextNode of nodeGen)listenersToCall.push(...nextNode.getDeepListeners())}listenersToCall.sort(((a,b)=>a.getPriority()-b.getPriority()));if(this.isAsync())return Promise.all(listenersToCall.map((listener=>listener.call(event.payload).catch((e=>{if(!this.isSuppressing())throw e;console.warn("Suppressed exception from listener",e)})))));return listenersToCall.reduce(((promiseChain,listener)=>promiseChain.then((()=>listener.call(event.payload).catch((e=>{if(!this.isSuppressing())throw e;console.warn("Suppressed exception from listener",e)}))))),Promise.resolve())}
/**
     * @param {Path} path
     * @return {Node}
     */#initNode=path=>{const nodeHashGen=path.iterateHashes();let level=0;let latestNode=null;for(let{hash:hash,path:path}of nodeHashGen){let nextNode=this.#getNode(hash)||(this.nodes[hash]=new Node(hash,level,path));if(latestNode)nextNode.setParent(latestNode);latestNode=nextNode;level++}return latestNode};#getTailNode=path=>this.#getNode(path.getTailHash())??null;#iterateNodes=function*(path,desc=false){const nodeHashGen=path.iterateHashes(desc);for(let{hash:hash}of nodeHashGen){let node=this.#getNode(hash);if(node)yield node}};#getNode=hash=>this.nodes[hash];isSuppressing=()=>this.config.suppress;isDebug=()=>this.config.debug;isAsync=()=>this.config.async
/**
 * @typedef Event
 * @property {string} path
 * @property {EventConfig} config
 */
/**
 * @type Event
 */}class Event{constructor(path,payload=null,config={}){this.config=assignConfig(config,defaultEventConfig);this.path=new Path(path,true);this.payload=payload}isExact=()=>this.config.exact}const buses={};
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
 */const bus=(busId="default",busConfig={})=>{if(!buses[busId])buses[busId]=new Bus(busId,busConfig);else if(Object.keys(busConfig).length)console.warn(`Bus ${busId} was already defined, but there is another call with config. This config was not applied`);
/**
     * @type Bus
     */const busInstance=buses[busId];
/**
     * Registers an event listener.
     * @method on
     * @param {string} path - The event path.
     * @param {Function} handler - The handler function for the event.
     * @param {ListenerConfig} [listenConfig={}] - The configuration for the listener.
     * @returns {Listener} The registered listener.
     */const on=(path,handler,listenConfig={})=>{const listener=new Listener(handler,path,busInstance,listenConfig);return busInstance.addListener(listener)};
/**
     * Emits an event.
     * @method emit
     * @param {string} path - The event path.
     * @param {any} [payload=null] - The event payload.
     * @param {EventConfig} [eventConfig={}] - The configuration for the event.
     * @returns {Promise<void>} A promise that resolves when the event has been processed.
     */const emit=(path,payload=null,eventConfig={})=>{const event=new Event(path,payload,eventConfig);return busInstance.call(event)};return{on:on,emit:emit}};export{bus};

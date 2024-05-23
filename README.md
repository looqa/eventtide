

# Eventtide - Event bus library

An efficient and flexible event bus library for JavaScript, enabling event-driven architecture with ease. This library supports hierarchical event listening, asynchronous event handling, and various configurations to suit your needs.

## Features

- **Asynchronous Event Handling**: Handle events asynchronously with promise support.
- **Configurable Priorities**: Set priorities for listeners to control the order of execution.
- **Path Matching**: Support for exact and wildcard path matching.
- **Debugging and Error Suppression**: Configurable debugging and error suppression options.

## Installation

Install the library using npm:

```bash
npm install @looqey/eventtide
```
________

## Usage

### Creating a Bus

You can create a new bus or retrieve an existing one using the `bus` function. Optionally, you can pass a configuration object.
If you will try to pass configuration for bus which is already initialized, this config will not be applied.

Every bus is global, so you can initialize and then get bus instance in every place of your code by id.
```javascript
import { bus } from '@looqey/eventtide';

const myBus = bus('myBus', { debug: true, suppress: false, async: true });
```
Please refer to [API section](#api) to get more info about config.

### Asynchrony
To avoid misunderstanding about `async` parameter, let's define what does it mean:
asyncrony of bus affects only method of executing listeners for event, not matters, if listeners callbacks is sync nor async.

When `async` is set to `true`, all listeners will be fired without awaiting resolving of previous listener.

Otherwise, when `async` is `false`, every listener's callback will be awaited, then next listeners callback called. It is useful when you need to set priorities for listeners.

### Suppress
When `suppress` is set to `true`, exception on listener handler will not stop executing chain, but throw console warning.
When `suppress` is set to `false`, exception on listener will stop chain executing.
________

### Listeners

#### Adding a Listener

Add a listener to the bus for a specific event path. You can use an asterisk (`*`) at the end of the path to create a deep listener, which will listen to all events matching the path before the asterisk. You can also pass a configuration object for the listener.

```javascript
// Listener for a specific path
const listener = myBus.on('user.created', async (payload) => {
    console.log('User created:', payload);
}, {priority: 2});

// Deep listener for all user-related events
const deepListener = myBus.on('user.*', (payload) => {
    console.log('User event:', payload);
}, {priority: 1});
```
#### Listener priority
In listener config, you can set `priority` property. If bus is not `async`, it guarantees that listeners for given event will be executed in `priority` order. `priority` is ascending. By default, all listeners has `priority` set to 1.

#### Removing a Listener
You can unsubscribe listener using `off()` function:
```javascript
listener.off();
```
_________
### Events

#### Emitting an Event

Emit an event on the bus. You must use determined paths only; asterisks are not allowed in event path. You can pass a payload and an optional configuration object for the event.

```javascript
// This listener will not be executed on next event, because event is set to exact
myBus.on('user.*', (payload) => {
    console.log(`User created: ${payload.name}`)
})
myBus.emit('user.created', { id: 1, name: 'Alice' }, { exact: true });
```
#### Exact events
Set `exact: true` in event config to exclude all deep listeners, which may be fired on this path.

________

### API

#### `bus(busId = 'default', busConfig = {})`

Initializes or retrieves a bus instance.

- **Parameters:**
    - `busId` (string): The ID of the bus. Default: `default`.
    - `busConfig` (object): [BusConfig](#BusConfig)

- **Returns:** An object with `emit` and `on` methods.

#### `busInstance.on(path, handler, config = {})`

Adds a listener for the specified path.

- **Parameters:**
    - `path` (string): The event path. Use an asterisk (`*`) at the end for deep listeners.
    - `handler` (function): The function to call when the event is emitted.
    - `config` (object): [ListenerConfig](#ListenerConfig).

- **Returns:** A listener object with an `off` method.

#### `busInstance.emit(path, payload = null, config = {})`

Emits an event on the specified path.

- **Parameters:**
    - `path` (string): The event path. Asterisks are not allowed.
    - `payload` (any): The payload to pass to the listeners.
    - `config` (object): [EventConfig](#EventConfig)

- **Returns:** A promise that resolves when all listeners have been called.

#### `listener.off()`

Removes the listener from the bus.

## Configuration Objects

### BusConfig

- `debug` (boolean): Enable or disable debugging. Default `false`
- `suppress` (boolean): Suppress or propagate errors. Default `true`
- `async` (boolean): Handle events asynchronously. Default `false`

### ListenerConfig

- `priority` (number): Priority of the listener (lower number means higher priority). Default `1`

### EventConfig

- `exact` (boolean): Whether to match the path exactly. Default `false`

## License

This project is licensed under the MIT License.

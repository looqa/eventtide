# Eventtide: Type safe, SSR-friendly event bus

A robust, type-safe event bus library for TypeScript, enabling seamless event-driven communication within your applications. Designed with developer experience in mind, this library leverages TypeScript’s powerful type system to ensure type safety, IntelliSense support, and an intuitive chain-based API.

## 📦 Features

- **Type-Safe Event Definitions**: Define any event with custom payloads, ensuring compile-time type safety.
- **Chain-Based API**: Fluent and intuitive syntax for subscribing and emitting events.
- **Subscription Management**: Easily unsubscribe or manually trigger listeners.
- **Error Handling Options**: Configure the bus to suppress or handle listener errors gracefully.
- **Dependency Injection Friendly**: No any global objects. You will rule the initializing and storing bus instances.
- **Minimal Runtime Overhead**: Efficient listener management without unnecessary runtime objects.

## 🚀 Installation

Install the library via npm or yarn:

```bash
npm install @looqey/eventtide
# or
yarn @looqey/eventtide
```

## 🔧 Usage

### 1. Define Your Event Schema

Start by defining a TypeScript type that outlines your event names and their corresponding payloads.

```ts
// mySchema.ts

export type MyBusSchema = {
  userCreated: { userId: string; name: string };
  orderPlaced: { orderId: string; amount: number };
  paymentProcessed: number; // Example of a simple payload type
};
```

### 2. Create an Event Bus Instance

Instantiate the event bus with your defined schema. Optionally, configure error handling behavior.

```ts
// main.ts

import { createBus } from 'typesafe-event-bus';
import { MyBusSchema } from './mySchema';

const bus = createBus<MyBusSchema>({ suppress: true }); // Suppress listener errors
```

### 3. Subscribe to Events

Use the chain-based API to subscribe to events. Subscriptions return an object allowing you to unsubscribe or manually trigger the listener.

```ts
// subscribing.ts

const userCreatedSubscription = bus.on().userCreated((payload) => {
  console.log(`User created: ${payload.userId}, Name: ${payload.name}`);
});

const orderPlacedSubscription = bus.on().orderPlaced((payload) => {
  console.log(`Order placed: ${payload.orderId}, Amount: $${payload.amount}`);
});
```

### 4. Emit Events

Emit events using the chain-based API. TypeScript ensures that the payload matches the defined schema.

```ts
// emitting.ts

// Emit userCreated event
bus.emit().userCreated({ userId: 'u123', name: 'Alice' });

// Emit orderPlaced event
bus.emit().orderPlaced({ orderId: 'o456', amount: 250 });

// Emit paymentProcessed event
bus.emit().paymentProcessed(1000);
```

### 5. Manage Subscriptions

Unsubscribe from events or manually trigger listeners as needed.

```ts
// managingSubscriptions.ts

// Unsubscribe from userCreated event
userCreatedSubscription.off();

// Manually trigger orderPlaced listener
orderPlacedSubscription.fire({ orderId: 'o789', amount: 300 });
```


## 📚 API Reference

### `createBus<Schema>(options?: BusOptions): EventBus<Schema>`

Creates a new event bus instance with the specified schema and options.

- **Generics:**
  - `Schema`: Defines the structure of events and their payloads.

- **Parameters:**
  - `options` *(optional)*: Configuration options for the event bus.
    - `suppress?: boolean`: If `true`, errors thrown by listeners during event emission are logged to the console instead of being thrown, preventing the interruption of subsequent listeners. Default is `false`.

- **Returns:**
  - `EventBus<Schema>`: The event bus instance.

### `EventBus<Schema>`

Interface defining the structure and methods of the event bus.

#### Methods:

- **`on(): OnBuilder<Schema>`**

  Subscribes to events using a chain-based approach.

  - **Usage:**
    ```ts
    bus.on().eventName(callback);
    ```

  - **Returns:**
    - An object where each key corresponds to an event name defined in `Schema`, and each value is a function to register a listener for that event. The listener registration function returns a `Subscription` object.

- **`emit(): EmitBuilder<Schema>`**

  Emits events using a chain-based approach.

  - **Usage:**
    ```ts
    bus.emit().eventName(payload);
    ```

  - **Returns:**
    - An object where each key corresponds to an event name defined in `Schema`, and each value is a function to emit the event with the specified payload.

### `Subscription<Payload>`

Represents a subscription to an event, providing methods to manage the listener.

- **Methods:**
  - **`off(): void`**
    - Unsubscribes the listener from the event.
  - **`fire(payload: Payload): void`**
    - Manually triggers the listener with the provided payload.

### `BusOptions`

Configuration options for creating the event bus.

- **Properties:**
  - **`suppress?: boolean`**
    - If `true`, suppresses exceptions thrown by listeners during event emission, logging them to the console instead.

## 🛠️ Error Handling

By default, if a listener throws an error during event emission, the error propagates, potentially interrupting the execution of subsequent listeners. To change this behavior, enable the `suppress` option when creating the bus:

```ts
const bus = createBus<MyBusSchema>({ suppress: true });
```

With `suppress` enabled, errors thrown by listeners are caught and logged to the console, allowing other listeners to continue executing.

## 🔒 Type Safety

This library leverages TypeScript’s generics and mapped types to ensure:

- **Event Names**: Only defined event names in the schema can be subscribed to or emitted.
- **Payloads**: Payloads must match the type specified for each event.
- **IntelliSense Support**: Full auto-completion for event names and payloads in supported IDEs.

### Example of Type Safety in Action

```ts
// Correct usage
bus.emit().orderPlaced({ orderId: 'o123', amount: 250 });

// TypeScript Error: Argument of type 'string' is not assignable to parameter of type 'number'.
bus.emit().paymentProcessed('not-a-number');
```


## 🧩 Integration

This library is framework-agnostic. Nevertheless, there is at least one catchy moment.

> **Important Note:**  
> Event bus instances cannot be serialized. If you are using server-side rendering (SSR) frameworks like Nuxt, ensure that event bus instances are only created and used in appropriate contexts. To avoid SSR-related issues, you can use a mock event bus during server-side execution and switch to the real event bus on the client side.



### Using a Mock Bus for SSR

For SSR scenarios, we recommend using the `createMockBus` utility to initialize a no-op event bus instance. This avoids issues with serialization and ensures smooth server-client handoff.

#### Example Integration in Nuxt

```ts
// plugins/buses.ts

import { createBus } from 'typesafe-event-bus';
import { createMockBus } from 'typesafe-event-bus/mockBus';
import { MyBusSchema } from '@/mySchema';

export default defineNuxtPlugin((nuxtApp) => {
  // Use the mock bus during SSR
  const isSSR = import.meta.server;
  const bus = isSSR ? createMockBus<MyBusSchema>() : createBus<MyBusSchema>({ suppress: true });

  nuxtApp.provide('bus', bus);
});
```


---

### **Key Benefits of Using the Mock Bus**

1. **SSR Safety**: Avoids issues with serialization and hydration by ensuring no listeners or events are retained on the server.
2. **Uniform API**: Maintains the same API as the real event bus, so no additional changes are required in your client-side or shared logic.
3. **Testing**: Useful for environments where you don’t need the real bus, such as tests focused on unrelated logic.


## 👩‍💻 Contributing

Contributions are welcome! Please open issues or submit pull requests for any enhancements, bug fixes, or new features.

## 📜 License

This library is licensed under the MIT license.

## 🙏 Acknowledgements

Inspired by common patterns in event-driven architectures and modern TypeScript practices to ensure type safety and developer productivity.

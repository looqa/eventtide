
export interface Payload {}

export type Handler<Payload> = (payload: Payload) => void;


export type Listener<Payload> = {
    id: symbol;
    func: Handler<Payload>;
};


export interface Subscription<Payload> {

    off: () => void;

    fire: (payload: Payload) => void;
}

/**
 * EventBus interface defining the structure of the bus.
 */
export interface EventBus<Schema> {
    on(): {
        [K in keyof Schema]: (callback: Handler<Schema[K]>) => Subscription<Schema[K]>;
    };
    emit(): {
        [K in keyof Schema]: (payload: Schema[K]) => void;
    };
}

/**
 * Bus options to configure the behavior of the event bus.
 */
export interface BusOptions {
    suppress?: boolean;
}


export function createBus<Schema>(options?: BusOptions): EventBus<Schema> {
    const listenersMap: Partial<{ [K in keyof Schema]: Array<Listener<Schema[K]>> }> = {};
    const suppressErrors = options?.suppress ?? false;

    return {
        on() {
            return new Proxy({} as Record<keyof Schema, any>, {
                get(_target, prop: PropertyKey, _receiver: any) {
                    if (typeof prop !== 'string') {
                        // If the property is not a string, ignore it.
                        return undefined;
                    }
                    const key = prop as keyof Schema;

                    return (callback: Handler<Schema[typeof key]>): Subscription<Schema[typeof key]> => {
                        const listener: Listener<Schema[typeof key]> = {
                            id: Symbol(),
                            func: callback,
                        };

                        // Initialize the listeners array if it doesn't exist
                        if (!listenersMap[key]) {
                            listenersMap[key] = [];
                        }

                        // Add the listener to the map
                        listenersMap[key]!.push(listener);

                        return {
                            off: () => {
                                const listeners = listenersMap[key];
                                if (listeners) {
                                    const index = listeners.findIndex((l) => l.id === listener.id);
                                    if (index !== -1) {
                                        listeners.splice(index, 1);
                                    }
                                }
                            },
                            fire: (payload: Schema[typeof key]) => {
                                try {
                                    listener.func(payload);
                                } catch (error) {
                                    if (suppressErrors) {
                                        console.error(`Error in manually firing listener for event "${String(key)}":`, error);
                                    } else {
                                        throw error;
                                    }
                                }
                            },
                        };
                    };
                },
            }) as {
                [K in keyof Schema]: (callback: Handler<Schema[K]>) => Subscription<Schema[K]>;
            };
        },
        emit() {
            return new Proxy({} as Record<keyof Schema, any>, {
                get(_target, prop: PropertyKey, _receiver: any) {
                    if (typeof prop !== 'string') {
                        // If the property is not a string, ignore it.
                        return undefined;
                    }
                    const key = prop as keyof Schema;

                    return (payload: Schema[typeof key]) => {
                        const listeners = listenersMap[key];
                        if (listeners) {
                            // Create a copy to prevent issues if listeners are modified during emission
                            for (const listener of [...listeners]) {
                                try {
                                    listener.func(payload);
                                } catch (error) {
                                    if (suppressErrors) {
                                        console.error(`Error in listener for event "${String(key)}":`, error);
                                    } else {
                                        throw error;
                                    }
                                }
                            }
                        }
                    };
                },
            }) as {
                [K in keyof Schema]: (payload: Schema[K]) => void;
            };
        },
    };
}

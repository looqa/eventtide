// event-bus.ts

export interface EventBus<Schema> {
    // We use a chain approach: bus.on().someEvent(callback)
    on(): {
        [K in keyof Schema]: (callback: (payload: Schema[K]) => void) => void;
    };
    // We also do: bus.emit().someEvent(payload)
    emit(): {
        [K in keyof Schema]: (payload: Schema[K]) => void;
    };
}

export type Listener<Payload> = {
    func: (payload: Payload) => void,

}
/**
 * createBus() - returns an EventBus<Schema>.
 * The one-level approach uses a single Proxy for `.on()` and `.emit()`
 * so we can do chain calls like bus.on().myEvent(...) or bus.emit().myEvent(...).
 */
export function createBus<Schema>(): EventBus<Schema> {
    // We'll store all listeners in a map keyed by event name.
    const listenersMap = new Map<string, Array<(payload: unknown) => void>>();

    return {
        on() {
            // We'll produce an object typed as `[K in keyof Schema]: ...`
            // so TS can auto-complete event names. At runtime, we fill it with a Proxy.
            const result = {} as any;
            return new Proxy(result, {
                get(_target, prop: string) {
                    // prop is the event name, e.g. "someEvent" or "anotherEvent"
                    return (callback: (payload: unknown) => void) => {
                        if (!listenersMap.has(prop)) {
                            listenersMap.set(prop, []);
                        }
                        listenersMap.get(prop)!.push(callback);
                    };
                },
            });
        },
        emit() {
            const result = {} as any;
            return new Proxy(result, {
                get(_target, prop: string) {
                    return (payload: unknown) => {
                        const cbs = listenersMap.get(prop) || [];
                        for (const cb of cbs) {
                            cb(payload);
                        }
                    };
                },
            });
        },
    };
}

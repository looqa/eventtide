interface Payload {
}
type Handler<Payload> = (payload: Payload) => void;
type Listener<Payload> = {
    id: symbol;
    func: Handler<Payload>;
};
interface Subscription<Payload> {
    off: () => void;
    fire: (payload: Payload) => void;
}
interface EventBus<Schema> {
    on(): {
        [K in keyof Schema]: (callback: Handler<Schema[K]>) => Subscription<Schema[K]>;
    };
    emit(): {
        [K in keyof Schema]: (payload: Schema[K]) => void;
    };
}
interface BusOptions {
    suppress?: boolean;
}
declare function createBus<Schema>(options?: BusOptions): EventBus<Schema>;

export { BusOptions, EventBus, Handler, Listener, Payload, Subscription, createBus };

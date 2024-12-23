export interface Payload {
}
export type Handler<Payload> = (payload: Payload) => void;
export type Listener<Payload> = {
    id: symbol;
    func: Handler<Payload>;
};
export interface Subscription<Payload> {
    off: () => void;
    fire: (payload: Payload) => void;
}
export interface EventBus<Schema> {
    on(): {
        [K in keyof Schema]: (callback: Handler<Schema[K]>) => Subscription<Schema[K]>;
    };
    emit(): {
        [K in keyof Schema]: (payload: Schema[K]) => void;
    };
}
export interface BusOptions {
    suppress?: boolean;
}
export declare function createBus<Schema>(options?: BusOptions): EventBus<Schema>;
//# sourceMappingURL=index.d.ts.map
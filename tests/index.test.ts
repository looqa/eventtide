// tests/index.test.ts
import { describe, it, expect, jest } from '@jest/globals';
import { createBus } from '../src';

// Define a simple schema for testing:
type TestSchema = {
    someEvent: { userId: string };
    anotherEvent: number;
};

describe('createBus()', () => {
    it('calls the correct listener with the correct payload', () => {
        const bus = createBus<TestSchema>();
        const mockFn = jest.fn();

        bus.on().someEvent(mockFn);
        bus.emit().someEvent({ userId: 'abc' });

        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith({ userId: 'abc' });
    });

    it('supports multiple listeners for the same event', () => {
        const bus = createBus<TestSchema>();
        const fn1 = jest.fn();
        const fn2 = jest.fn();

        bus.on().anotherEvent(fn1);
        bus.on().anotherEvent(fn2);

        bus.emit().anotherEvent(42);

        expect(fn1).toHaveBeenCalledWith(42);
        expect(fn2).toHaveBeenCalledWith(42);
        expect(fn1).toHaveBeenCalledTimes(1);
        expect(fn2).toHaveBeenCalledTimes(1);
    });

    it('does not call listeners of other events', () => {
        const bus = createBus<TestSchema>();
        const fnSomeEvent = jest.fn();
        const fnAnotherEvent = jest.fn();

        bus.on().someEvent(fnSomeEvent);
        bus.on().anotherEvent(fnAnotherEvent);

        // Emit someEvent => only fnSomeEvent should be called
        bus.emit().someEvent({ userId: 'xyz' });
        expect(fnSomeEvent).toHaveBeenCalledWith({ userId: 'xyz' });
        expect(fnAnotherEvent).not.toHaveBeenCalled();

        // Emit anotherEvent => only fnAnotherEvent should be called
        bus.emit().anotherEvent(123);
        expect(fnAnotherEvent).toHaveBeenCalledWith(123);
        expect(fnSomeEvent).toHaveBeenCalledTimes(1); // no new calls
    });
});

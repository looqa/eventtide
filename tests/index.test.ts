// tests/index.test.ts
import { describe, it, expect, jest } from '@jest/globals';
import {createBus, createMockBus, Subscription} from '../src';

// Define a simple schema for testing:
type TestSchema = {
    someEvent: { userId: string };
    anotherEvent: number;
    errorEvent: string;
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

    it('allows unsubscribing from an event', () => {
        const bus = createBus<TestSchema>();
        const mockFn = jest.fn();

        const subscription = bus.on().someEvent(mockFn);
        bus.emit().someEvent({ userId: 'abc' });

        expect(mockFn).toHaveBeenCalledTimes(1);

        // Unsubscribe
        subscription.off();
        bus.emit().someEvent({ userId: 'def' });

        expect(mockFn).toHaveBeenCalledTimes(1); // No new calls
    });

    it('allows manually firing a listener via subscription', () => {
        const bus = createBus<TestSchema>();
        const mockFn = jest.fn();

        const subscription = bus.on().anotherEvent(mockFn);

        // Manually fire the listener
        subscription.fire(99);

        expect(mockFn).toHaveBeenCalledWith(99);

        // Also ensure that emit works as usual
        bus.emit().anotherEvent(100);
        expect(mockFn).toHaveBeenCalledWith(100);
        expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('handles errors in listeners based on suppress option', () => {
        // Without suppress
        const bus1 = createBus<TestSchema>();
        const errorFn1 = jest.fn(() => {
            throw new Error('Listener error');
        });
        const normalFn1 = jest.fn();

        bus1.on().errorEvent(errorFn1);
        bus1.on().errorEvent(normalFn1);

        expect(() => {
            bus1.emit().errorEvent('test');
        }).toThrow('Listener error');

        expect(normalFn1).not.toHaveBeenCalled(); // Emission stops at the first error

        // With suppress
        const bus2 = createBus<TestSchema>({ suppress: true });
        const errorFn2 = jest.fn(() => {
            throw new Error('Listener error');
        });
        const normalFn2 = jest.fn();

        bus2.on().errorEvent(errorFn2);
        bus2.on().errorEvent(normalFn2);

        expect(() => {
            bus2.emit().errorEvent('test suppressed');
        }).not.toThrow();

        expect(errorFn2).toHaveBeenCalledWith('test suppressed');
        expect(normalFn2).toHaveBeenCalledWith('test suppressed');
    });

    it('allows multiple subscriptions and independent unsubscriptions', () => {
        const bus = createBus<TestSchema>();
        const mockFn1 = jest.fn();
        const mockFn2 = jest.fn();

        const subscription1 = bus.on().someEvent(mockFn1);
        const subscription2 = bus.on().someEvent(mockFn2);

        bus.emit().someEvent({ userId: 'user1' });

        expect(mockFn1).toHaveBeenCalledWith({ userId: 'user1' });
        expect(mockFn2).toHaveBeenCalledWith({ userId: 'user1' });

        // Unsubscribe the first listener
        subscription1.off();
        bus.emit().someEvent({ userId: 'user2' });

        expect(mockFn1).toHaveBeenCalledTimes(1); // No new call
        expect(mockFn2).toHaveBeenCalledTimes(2);
        expect(mockFn2).toHaveBeenCalledWith({ userId: 'user2' });
    });
});

describe('createMockBus()', () => {
    it('does not call any listeners when emitting events', () => {
        const mockBus = createMockBus<TestSchema>();
        const mockFn = jest.fn();

        const subscription = mockBus.on().someEvent(mockFn);

        mockBus.emit().someEvent({ userId: 'abc' });

        expect(mockFn).not.toHaveBeenCalled();
    });

    it('allows unsubscribing without errors', () => {
        const mockBus = createMockBus<TestSchema>();
        const mockFn = jest.fn();

        const subscription = mockBus.on().anotherEvent(mockFn);

        subscription.off();

        mockBus.emit().anotherEvent(42);

        expect(mockFn).not.toHaveBeenCalled();
    });

    it('allows manually firing a listener via subscription but does nothing', () => {
        const mockBus = createMockBus<TestSchema>();
        const mockFn = jest.fn();

        const subscription = mockBus.on().someEvent(mockFn);

        subscription.fire({ userId: 'abc' });

        expect(mockFn).not.toHaveBeenCalled();
    });

    it('does not throw errors when emitting events with multiple listeners', () => {
        const mockBus = createMockBus<TestSchema>();
        const mockFn1 = jest.fn();
        const mockFn2 = jest.fn();

        mockBus.on().someEvent(mockFn1);
        mockBus.on().someEvent(mockFn2);

        expect(() => {
            mockBus.emit().someEvent({ userId: 'xyz' });
        }).not.toThrow();

        expect(mockFn1).not.toHaveBeenCalled();
        expect(mockFn2).not.toHaveBeenCalled();
    });

    it('does not throw errors when unsubscribing multiple times', () => {
        const mockBus = createMockBus<TestSchema>();
        const mockFn = jest.fn();

        const subscription = mockBus.on().someEvent(mockFn);

        expect(() => {
            subscription.off();
            subscription.off();
        }).not.toThrow();
    });

    it('provides a valid API matching the real bus', () => {
        const mockBus = createMockBus<TestSchema>();

        expect(typeof mockBus.on).toBe('function');

        expect(typeof mockBus.emit).toBe('function');

        const onProxy = mockBus.on();
        expect(typeof onProxy.someEvent).toBe('function');

        const emitProxy = mockBus.emit();
        expect(typeof emitProxy.someEvent).toBe('function');
    });
});

import {bus} from "../src/index.mjs";


describe('Event Bus', () => {
    let defaultBus = bus('default', {suppress: false})
    let asyncBus = bus('asyncBus', { async: true })
    let suppressBus = bus('suppressBus')
    let priorityBus = bus('priorityBus', {withPriority: true})
    let unsubscribeBus = bus('unsubscribeBus')

    test('should call listeners for emitted events', async () => {
        const handler = jest.fn();

        defaultBus.on('event.path', handler)

        await defaultBus.emit('event.path', { data: 'test' })

        expect(handler).toHaveBeenCalledWith({ data: 'test' });
    });

    test('should call listeners up the path tree', async () => {
        const tripleHandler = jest.fn();
        const twiceHandler = jest.fn();
        const onceHandler = jest.fn();
        defaultBus.on('*', tripleHandler);
        defaultBus.on('event.*', twiceHandler);
        defaultBus.on('event.path', onceHandler);
        await defaultBus.emit('', { data: 'test' });
        await defaultBus.emit('event.some', { data: 'test' });
        await defaultBus.emit('event.path', { data: 'test' });

        expect(tripleHandler).toHaveBeenCalledWith({ data: 'test' });
        expect(twiceHandler).toHaveBeenCalledWith({ data: 'test' });
        expect(onceHandler).toHaveBeenCalledWith({ data: 'test' });

        expect(tripleHandler.mock.calls.length).toBe(3)
        expect(twiceHandler.mock.calls.length).toBe(2)
        expect(onceHandler.mock.calls.length).toBe(1)
    });

    test('should not call listeners in other trees', async() => {
        const handlerRoot = jest.fn()
        const handlerNotToCall = jest.fn()

        defaultBus.on('*', handlerRoot)

        defaultBus.on('event.other.*', handlerNotToCall)

        await defaultBus.emit('event.path')

        expect(handlerRoot).toHaveBeenCalled()
        expect(handlerNotToCall).not.toHaveBeenCalled()
    })

      test('should correctly call listeners with async configuration', async () => {
           const handler = jest.fn().mockImplementation(() => Promise.resolve());
           asyncBus.on('event.path', handler);

           await asyncBus.emit('event.path', { data: 'test' });

           expect(handler).toHaveBeenCalledWith({ data: 'test' });
       });

    test('should run listeners asynchronously in async mode', async () => {
        const mockFn1 = jest.fn(() => new Promise(resolve => setTimeout(() => {
            resolve('mockFn1')
        }, 100)))
        const mockFn2 = jest.fn(() => new Promise(resolve => setTimeout(() => {
            resolve('mockFn2')
        }, 100)))

        asyncBus.on('*', mockFn1)
        asyncBus.on('event.path', mockFn2)

        const startTime = Date.now()
        await asyncBus.emit('event.path')
        const endTime = Date.now()
        const elapsedTime = endTime - startTime

        expect(mockFn1).toHaveBeenCalled()
        expect(mockFn2).toHaveBeenCalled()
        expect(elapsedTime).toBeLessThan(105)
    })

    test('should run listeners synchronously in sync mode', async () => {
        const mockFn1 = jest.fn(() => new Promise(resolve => setTimeout(() => {
            resolve('mockFn1')
        }, 100)))
        const mockFn2 = jest.fn(() => new Promise(resolve => setTimeout(() => {
            resolve('mockFn2')
        }, 100)))

        defaultBus.on('event.*', mockFn1)
        defaultBus.on('event.path', mockFn2)

        const startTime = Date.now()
        await defaultBus.emit('event.path')
        const endTime = Date.now()
        const elapsedTime = endTime - startTime

        expect(mockFn1).toHaveBeenCalled()
        expect(mockFn2).toHaveBeenCalled()
        expect(elapsedTime).toBeGreaterThan(110)
    })

    test('should suppress errors from listeners if suppress mode is on', async () => {
        const brokenHandler = jest.fn().mockImplementation(() => { throw new Error('Listener error'); });
        suppressBus.on('*', brokenHandler)

        await expect(suppressBus.emit('event')).resolves.not.toThrow()

        expect(brokenHandler).toHaveBeenCalled()
    })

    test ('should not suppress errors from listeners if suppress mode is off', async () => {
        const brokenHandler = jest.fn().mockImplementation(() => { throw new Error('Listener error'); });
        defaultBus.on('*', brokenHandler)

        await expect(defaultBus.emit('event')).rejects.toThrow('Listener error')
        expect(brokenHandler).toHaveBeenCalled()

    })

    test('bus calls listeners in priority key order', async () => {
        const result = []
        const handler1 = jest.fn(() => result.push(2))
        const handler2 = jest.fn(() => result.push(1))

        priorityBus.on('*', handler1, {priority: 2})
        priorityBus.on('*', handler2, {priority: 1})

        await priorityBus.emit('test')

        expect(result).toEqual([1, 2])
    })

    test('bus events may be unsubscribed', async () => {
        const handler = jest.fn()
        const handlerToRemove = jest.fn()

        const listener = unsubscribeBus.on('event.path.*', handlerToRemove)
        unsubscribeBus.on('event.path.deep', handler)

        await unsubscribeBus.emit('event.path.deep')

        expect(handler).toBeCalled()
        expect(handlerToRemove).toBeCalled()

        listener.off()

        await unsubscribeBus.emit('event.path.deep')
        expect(handler.mock.calls.length).toBe(2)
        expect(handlerToRemove.mock.calls.length).toBe(1)
    })
});
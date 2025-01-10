import MessageBus from "./MessageBus.js";

it('MessageBus correctly stores subscriber callbacks', () => {
    const mb = new MessageBus();

    const obj1 = { cb : (data) => { return true; }}
    const obj2 = { cb : (data) => { return true; }}
    const obj3 = { cb : (data) => { return true; }}

    mb.subscribe('zoinks', obj1.cb);
    mb.subscribe('zoinks', obj2.cb);
    mb.subscribe('jinkies', obj3.cb);

    expect(mb.events['zoinks']).toEqual([ { id: 0, cb: obj1.cb }, { id: 1, cb: obj2.cb } ]);
    expect(mb.events['jinkies']).toEqual([ { id: 2, cb: obj3.cb } ]);
})

it('MessageBus correctly calls all subscriber functions', () => {
    const mb = new MessageBus();

    const obj1 = { cb : (data) => { return data; }}
    const obj1Spy = jest.spyOn(obj1, 'cb');

    const obj2 = { cb : (data) => { return data; }}
    const obj2Spy = jest.spyOn(obj2, 'cb');

    const obj3 = { cb : (data) => { return data; }}
    const obj3Spy = jest.spyOn(obj3, 'cb');

    mb.subscribe('zoinks', obj1.cb);
    mb.subscribe('zoinks', obj2.cb);
    mb.subscribe('jinkies', obj3.cb);

    mb.publish('zoinks', { character: "Shaggy" });

    expect(obj1Spy).toHaveBeenCalledWith({ character: "Shaggy" });
    expect(obj2Spy).toHaveBeenCalledWith({ character: "Shaggy" });
    expect(obj3Spy.mock.calls.length).toBe(0);

    mb.publish('jinkies', { character: "Velma" });
    mb.publish('jinkies', { character: "Velma" });

    expect(obj1Spy.mock.calls.length).toBe(1);
    expect(obj2Spy.mock.calls.length).toBe(1);
    expect(obj3Spy).toHaveBeenCalledWith({ character: "Velma" });
    expect(obj3Spy.mock.calls.length).toBe(2);
})

it('MessageBus successfully unsubscribes a callback', () => {
    const mb = new MessageBus();

    const obj1 = { cb : (data) => { return true; }}
    const obj2 = { cb : (data) => { return true; }}
    const obj3 = { cb : (data) => { return true; }}

    const obj1cbID = mb.subscribe('zoinks', obj1.cb);
    const obj2cbID = mb.subscribe('zoinks', obj2.cb);
    const obj3cbID = mb.subscribe('jinkies', obj3.cb);

    expect(mb.events['zoinks']).toEqual([ { id: 0, cb: obj1.cb }, { id: 1, cb: obj2.cb } ]);
    expect(mb.events['jinkies']).toEqual([ { id: 2, cb: obj3.cb } ]);

    mb.unsubscribe('zoinks', obj1cbID);

    expect(mb.events['zoinks']).toEqual([ { id: 1, cb: obj2.cb } ]);

    mb.unsubscribe('zoinks', obj2cbID);
    
    expect(mb.events['zoinks']).toEqual([]);
})
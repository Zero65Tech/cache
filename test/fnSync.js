const { fn, fnSync } = require('./index');



class MockCache {

  constructor() {
    this.cache = new Map();
  }

  get(key) {
    return this.cache.get(key);
  }

  put(key, value) {
    this.cache.set(key, value);
  }

}


  it('should cache and return the result for synchronous function', () => {

    const mockCache = new MockCache();
    const keyFn = (...args) => args.join('-');
    const syncFn = (a, b) => a + b;

    const cachedFn = fnSync(syncFn, mockCache, keyFn);

    const result1 = cachedFn(2, 3);
    expect(result1).toBe(5);

    const result2 = cachedFn(2, 3);
    expect(result2).toBe(5);

    const result3 = cachedFn(4, 5);
    expect(result3).toBe(9);

  });

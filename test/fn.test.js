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



  it('should cache and return the result for async function', async () => {

    const mockCache = new MockCache();
    const keyFn = (...args) => args.join('-');
    const asyncFn = async (a, b) => a + b;

    const cachedFn = fn(asyncFn, mockCache, keyFn);

    const result1 = await cachedFn(2, 3);
    expect(result1).toBe(5);

    const result2 = await cachedFn(2, 3);
    expect(result2).toBe(5);

    const result3 = await cachedFn(4, 5);
    expect(result3).toBe(9);

  });
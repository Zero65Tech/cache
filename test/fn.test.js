const { fn } = require('../src/index');



class Cache {

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

test('.fn()', async () => {

  const mockFn = jest.fn(async (a, b) => a + b);

  const cachedFn = fn(mockFn, new Cache(), (...args) => args.join('-'));

  expect(await cachedFn(1, 2)).toBe(3);
  expect(mockFn.mock.calls).toHaveLength(1);

  expect(await cachedFn(1, 2)).toBe(3);
  expect(mockFn.mock.calls).toHaveLength(1);

  expect(await cachedFn(3, 4)).toBe(7);
  expect(mockFn.mock.calls).toHaveLength(2);

});

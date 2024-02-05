const { fnSync } = require('../src/index');



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

test('.fnSync()', () => {

  const mockFn = jest.fn((a, b) => a + b);

  const cachedFn = fnSync(mockFn, new Cache(), (...args) => args.join('-'));

  expect(cachedFn(1, 2)).toBe(3);
  expect(mockFn.mock.calls).toHaveLength(1);

  expect(cachedFn(1, 2)).toBe(3);
  expect(mockFn.mock.calls).toHaveLength(1);

  expect(cachedFn(3, 4)).toBe(7);
  expect(mockFn.mock.calls).toHaveLength(2);

});

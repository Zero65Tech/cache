const { ttl } = require('../src/index.js');

describe('TTL', () => {
  let cache;

  beforeEach(() => {
    cache = new ttl();
  });

  it('should retrieve a cached value', () => {
    const key = 'testKey';
    const value = 'testValue';

    cache.put(key, value);

    const result = cache.get(key);

    expect(result).toBe(value);
  });

  it('should not retrieve an expired value', async () => {
    const key = 'testKey';
    const value = 'testValue';
    cache.put(key, value, 1);
    jest.advanceTimersByTime(301 * 1000);
    const result = cache.get(key);
    expect(result).toBeUndefined();
  });

  it('should clone the value when retrieving if clone is set to true', () => {
    const key = 'testKey';
    const originalObject = { nested: { prop: 'value' } };

    cache.put(key, originalObject);

    const result = cache.get(key);

    expect(result).toEqual(originalObject);
    expect(result).not.toBe(originalObject);
  });

  it('should not clone the value when retrieving if clone is set to false', async () => {
    const key = 'testKey';
    const originalObject = { nested: { prop: 'value' } };

    const nonCloningCache = new ttl(60, false);
    nonCloningCache.put(key, originalObject);

    const result = nonCloningCache.get(key);

    expect(result).toBe(originalObject);
  });

  it('should delete a cached value', () => {
    const key = 'testKey';
    const value = 'testValue';

    cache.put(key, value);

    cache.delete(key);

    const result = cache.get(key);

    expect(result).toBeUndefined();
  });
});

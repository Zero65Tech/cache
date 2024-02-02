const { lru } = require('./index.js');
const {ttl} = require('./index.js');

describe('LRUCache', () => {
  let cache;

  beforeEach(() => {
    cache = new lru();
  });

  afterEach(() => {
    jest.clearAllTimers(); 
  });

  test('get returns undefined for non-existent key', () => {
    const result = cache.get('nonexistent');
    expect(result).toBeUndefined();
  });

  test('put and get work correctly', () => {
    cache.put('key1', 'value1');
    const result = cache.get('key1');
    expect(result).toBe('value1');
  });

  test('put and get work correctly with object values', () => {
    const obj = { key: 'value' };
    cache.put('key2', obj);
    const result = cache.get('key2');
    expect(result).toEqual(obj);
    expect(result).not.toBe(obj);
  });

  test('put and get work correctly with object values and cloning disabled', () => {
    const obj = { key: 'value' };
    cache = new lru(1024, false);
    cache.put('key3', obj);
    const result = cache.get('key3');
    expect(result).toBe(obj);
  });

  test('put removes least recently used item when exceeding size', () => {
    cache = new lru(2);
    cache.put('key4', 'value4');
    cache.put('key5', 'value5');
    cache.put('key6', 'value6');
    console.log(cache);
    jest.advanceTimersByTime(1000);
    console.log(cache);
    const result = cache.get('key4');
    expect(result).toBeUndefined();
  });
  

  test('put and get work correctly with timestamps updated', () => {
    jest.useFakeTimers();
    cache.put('key7', 'value7');
    jest.advanceTimersByTime(2000);
    const resultBefore = cache.get('key7');
    expect(resultBefore).toBe('value7');

    cache.put('key7', 'newvalue7');
    jest.advanceTimersByTime(1000);
    const resultAfter = cache.get('key7');
    expect(resultAfter).toBe('newvalue7');
  });
});

describe('Cache TTL', () => {
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

    jest.advanceTimersByTime(1100);

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

  it('should not clone the value when retrieving if clone is set to false', async() => {
    const key = 'testKey';
    const originalObject = { nested: { prop: 'value' } };

    const nonCloningCache = new ttl(60, false);
    nonCloningCache.put(key, originalObject);

    const result = nonCloningCache.get(key);

    expect(result).toBe(originalObject);
    expect(result).not.toBe(originalObject); 
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

describe('fn', () => {
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
});

describe('fnSync', () => {
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
});

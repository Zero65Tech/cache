const { lru } = require('../src/index.js');

describe('LRU', () => {

  test('get returns undefined for non-existent key', () => {
    const cache = new lru();
    const result = cache.get('nonexistent');
    expect(result).toBeUndefined();
  });

  test('put and get work correctly', () => {
    const cache = new lru();
    cache.put('key', 'value');
    const result = cache.get('key');
    expect(result).toBe('value');
  });

  test('put and get work correctly with object values', () => {
    const obj = { key: 'value' };
    const cache = new lru();
    cache.put('key', obj);
    const result = cache.get('key');
    expect(result).not.toBe(obj);
    expect(result).toEqual(obj);
  });

  test('put and get work correctly with object values and cloning disabled', () => {
    const obj = { key: 'value' };
    const cache = new lru(undefined, false);
    cache.put('key', obj);
    const result = cache.get('key');
    expect(result).toBe(obj);
    expect(result).toEqual(obj);
  });

  test('put removes least recently used item when exceeding size', () => {
    const cache = new lru(2);
    cache.put('key1', 'value1');
    cache.put('key2', 'value2');
    cache.put('key3', 'value3');
    expect(cache.get('key1')).toBeUndefined();
  });
  
  test('put and get work correctly with timestamps updated', () => {
    const cache = new lru();
    cache.put('key7', 'value7');
    const resultBefore = cache.get('key7');
    expect(resultBefore).toBe('value7');

    cache.put('key7', 'newvalue7');
    const resultAfter = cache.get('key7');
    expect(resultAfter).toBe('newvalue7');
  });

});

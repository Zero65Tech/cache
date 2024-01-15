const { lru } = require('./index.js');

const _ = require('lodash');

describe('LRUCache', () => {
  let cache;

  beforeEach(() => {
    cache = new lru();
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
    const result = cache.get('key4');
    expect(result).toBeUndefined();
  });

  test('put and get work correctly with timestamps updated', () => {
    jest.useFakeTimers();
    cache.put('key7', 'value7');
    jest.advanceTimersByTime(1000);
    const resultBefore = cache.get('key7');
    expect(resultBefore).toBe('value7');
    
    cache.put('key7', 'newvalue7');
    jest.advanceTimersByTime(1000);
    const resultAfter = cache.get('key7');
    expect(resultAfter).toBe('newvalue7');
  });
});

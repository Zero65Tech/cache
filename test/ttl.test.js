const { ttl } = require('../src/index.js');



test('.get() with non-existent key', () => {
  const cache = new ttl();
  const result = cache.get('nonexistent');
  expect(result).toBeUndefined();
});

test('.put() with null value', () => {
  const cache = new ttl();
  cache.put('key', null);
  const result = cache.get('key');
  expect(result).toBeNull();
});

test('.put() & .get()', () => {
  const cache = new ttl();
  cache.put('key', 'value');
  const result = cache.get('key');
  expect(result).toBe('value');
});

test('.put() & .get() with object values', () => {
  const obj = { key: 'value' };
  const cache = new ttl();
  cache.put('key', obj);
  const result = cache.get('key');
  expect(result).not.toBe(obj);
  expect(result).toEqual(obj);
});

test('.put() & .get() with object values, clone == false', () => {
  const obj = { key: 'value' };
  const cache = new ttl(undefined, false);
  cache.put('key', obj);
  const result = cache.get('key');
  expect(result).toBe(obj);
  expect(result).toEqual(obj);
});

test('.put(), with existing key', () => {

  const cache = new ttl();
  cache.put('key', 'value');

  let result = cache.get('key');
  expect(result).toBe('value');

  cache.put('key', 'new value');

  result = cache.get('key');
  expect(result).toBe('new value');

});

test('.delete()', () => {

  const cache = new ttl();
  cache.put('key', 'value');

  let result = cache.get('key');
  expect(result).toBe('value');

  cache.delete('key');

  result = cache.get('key');
  expect(result).toBeUndefined();

});



test('evection', () => {

  jest.useFakeTimers();

  const cache = new ttl(60);

  cache.put('key1', 'value1');

  jest.advanceTimersByTime(20 * 1000);
  cache.put('key2', 'value2');

  jest.advanceTimersByTime(20 * 1000);
  cache.put('key3', 'value3');

  jest.advanceTimersByTime(20 * 1000 - 1);
  expect(cache.get('key1')).toBe('value1');
  expect(cache.get('key2')).toBe('value2');
  expect(cache.get('key3')).toBe('value3');

  jest.advanceTimersByTime(20 * 1000);
  expect(cache.get('key1')).toBeUndefined();
  expect(cache.get('key2')).toBe('value2');
  expect(cache.get('key3')).toBe('value3');

  jest.advanceTimersByTime(20 * 1000);
  expect(cache.get('key1')).toBeUndefined();
  expect(cache.get('key2')).toBeUndefined();
  expect(cache.get('key3')).toBe('value3');

  jest.advanceTimersByTime(20 * 1000);
  expect(cache.get('key1')).toBeUndefined();
  expect(cache.get('key2')).toBeUndefined();
  expect(cache.get('key3')).toBeUndefined();

  jest.clearAllTimers();

});

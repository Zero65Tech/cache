const { ttl } = require('../src/index.js');



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

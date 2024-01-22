const { lru } = require('../src/index.js');



test('evection, without .get()', () => {
  const cache = new lru(2);
  cache.put('key1', 'value1');
  cache.put('key2', 'value2');
  cache.put('key3', 'value3');
  expect(cache.get('key1')).toBeUndefined();
  expect(cache.get('key2')).toBe('value2');
  expect(cache.get('key3')).toBe('value3');
});

test('evection, with .get()', () => {

  jest.useFakeTimers();

  const cache = new lru(2);
  cache.put('key1', 'value1');
  cache.put('key2', 'value2');

  jest.advanceTimersByTime(1);
  expect(cache.get('key1')).toBe('value1');

  cache.put('key3', 'value3');

  expect(cache.get('key1')).toBe('value1');
  expect(cache.get('key2')).toBeUndefined();
  expect(cache.get('key3')).toBe('value3');

  jest.clearAllTimers();

});

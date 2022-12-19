const { compareAnyTags, parseTags } = require('../src/utils')

describe('compareAnyTags', () => {
  it('should return true if the objects have any tags in common', () => {
    const a = { tag1: 'value1', tag2: 'value2' }
    const b = { tag3: 'value3', tag1: 'value1' }
    const c = { tag4: 'value4', tag5: 'value5' }
    const d = { tag6: 'value6', tag7: 'value7' }

    expect(compareAnyTags(a, b)).toBe(true)
    expect(compareAnyTags(a, c)).toBe(false)
    expect(compareAnyTags(c, d)).toBe(false)
  })

  it('should return false if either or both objects are empty', () => {
    const a = {}
    const b = { tag1: 'value1' }
    const c = {}

    expect(compareAnyTags(a, b)).toBe(false)
    expect(compareAnyTags(a, c)).toBe(false)
    expect(compareAnyTags(b, c)).toBe(false)
  })
})

describe('parseTags', () => {
  it('should return an empty object for an empty string', () => {
    expect(parseTags('')).toEqual({})
  })

  it('should return an object with a single property for a string with a single tag', () => {
    expect(parseTags('foo=1')).toEqual({ foo: '1' })
  })

  it('should return an object with multiple properties for a string with multiple tags', () => {
    expect(parseTags('foo=1, bar=2')).toEqual({ foo: '1', bar: '2' })
  })

  it('should ignore tags without values', () => {
    expect(parseTags('foo=1, bar')).toEqual({ foo: '1' })
  })
})

function compareAnyTags (a, b) {
  for (const [tagNameA, tagValueA] of Object.entries(a)) {
    for (const [tagNameB, tagValueB] of Object.entries(b)) {
      if (tagNameB === tagNameA && tagValueB === tagValueA) {
        return true
      }
    }
  }
  return false
}

function parseTags (str) {
  const tags = {}

  if (str.length === 0) {
    return tags
  }

  str.trim().split(',').forEach(val => {
    const [tagName, tagValue] = val.split('=')
    if (typeof tagName === 'string' && typeof tagValue === 'string') {
      tags[tagName.trim()] = tagValue.trim()
    }
  })

  return tags
}

module.exports.compareAnyTags = compareAnyTags
module.exports.parseTags = parseTags

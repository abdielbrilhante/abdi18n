function getPhrase (config, path = '', count) {
  const keys = path.split('.')

  let node = config.dictionary
  try {
    for (let i = 0; i < keys.length; i++) {
      node = node[keys[i]]
    }

    if (Array.isArray(node)) {
      return node[Math.min(count || 0, 2)]
    } else {
      return node
    }
  } catch (e) {
    console.error(`[i18n] ${path} not found`)
    return path
  }
}

export function t (config, path, params = {}) {
  let phrase = getPhrase(config, path, params.count)

  const keys = Object.keys(params)
  for (let i = 0; i < keys.length; i++) {
    const regex = new RegExp(`{${keys[i]}}`, 'g')
    phrase = phrase.replace(regex, params[keys[i]])
  }

  const refs = phrase.match(/\[\w+\]/g) || []
  for (let i = 0; i < refs.length; i++) {
    phrase = phrase.replace(
      refs[i],
      t(config, refs[i].substring(1, refs[i].length - 1), params),
    )
  }

  return phrase
}

export function c (config, value) {
  const safeValue = value || 0
  const { locale, currency } = config
  return safeValue.toLocaleString(locale, {
    style: 'currency',
    currency,
  })
}

export function n (config, value = '') {
  const digits = value.replace(/[^0-9]+/g, '')
  const cutoff = digits.length - 2
  return parseFloat(`${digits.slice(0, cutoff)}.${digits.slice(cutoff)}`)
}

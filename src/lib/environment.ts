/**
 * Pattern to match environment variables in the format {{variableName}}
 */
export const VARIABLE_PATTERN = /\{\{([^}]+)\}\}/g

/**
 * Checks if a string contains environment variable references
 */
export function hasVariables(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false
  }
  VARIABLE_PATTERN.lastIndex = 0
  return VARIABLE_PATTERN.test(input)
}

/**
 * Substitutes environment variables in a string using {{variableName}} syntax
 * @param input - The input string that may contain variable references
 * @param getVariableValue - Function to get variable value from store
 * @returns The string with variables substituted, or the original string if no variables found
 */
export function substituteVariables(input: string, getVariableValue: (key: string) => string | null): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  VARIABLE_PATTERN.lastIndex = 0
  return input.replace(VARIABLE_PATTERN, (match, variableName) => {
    const trimmedName = variableName.trim()
    const value = getVariableValue(trimmedName)
    return value !== null ? value : match
  })
}

export interface VariablePart {
  type: 'text' | 'variable'
  content: string
  variableName?: string
  brackets?: {
    open: string
    close: string
  }
}

/**
 * Parses a string into parts, separating text and variable references
 * @param input - The input string that may contain variable references
 * @returns Array of parts (text or variable)
 */
export function parseVariableParts(input: string): VariablePart[] {
  if (!input || typeof input !== 'string') {
    return []
  }

  if (!hasVariables(input)) {
    return [{ type: 'text', content: input }]
  }

  const parts: VariablePart[] = []
  let lastIndex = 0
  let match

  VARIABLE_PATTERN.lastIndex = 0

  while ((match = VARIABLE_PATTERN.exec(input)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: input.slice(lastIndex, match.index),
      })
    }

    const variableName = match[1].trim()
    parts.push({
      type: 'variable',
      content: match[0],
      variableName,
      brackets: {
        open: '{{',
        close: '}}',
      },
    })

    lastIndex = VARIABLE_PATTERN.lastIndex
  }

  if (lastIndex < input.length) {
    parts.push({
      type: 'text',
      content: input.slice(lastIndex),
    })
  }

  return parts.length > 0 ? parts : [{ type: 'text', content: input }]
}

import yaml from 'js-yaml'
import _ from 'lodash'

import { SearchEntry } from 'src/types'
import validateSearchEntry from 'src/utils/validateSearchEntry'
import { ValidationError } from 'yup'

export interface ParseResult {
  data?: SearchEntry[]
  error?: {
    message?: string
    location?: string
  }
}

export const parseYamlString = (value: string): ParseResult => {
  if (!value || typeof value !== 'string') {
    return {}
  }
  let doc: any
  let data: SearchEntry[]
  let errorEntryNum: number
  try {
    doc = yaml.load(value)
    if (!_.isArray(doc)) {
      return {
        error: { message: 'format error: format should be a bullet list' }
      }
    }
    data = _.flatten(
      doc.map((v: any, index: number) => {
        try {
          if (!v?.items) {
            // assume single search entry
            return validateSearchEntry(v)
          }
          if (!_.isArray(v?.items)) {
            throw new Error('format error: items must be a bullet list')
          }
          if (!v.label) {
            throw new Error('format error: label missing')
          }
          // assume list containg search entry
          return v.items.map((i: any) =>
            validateSearchEntry({
              ...i,
              label: v.label
            })
          )
        } catch (err) {
          errorEntryNum = index + 1
          throw err
        }
      })
    )
    return {
      data
    }
  } catch (err) {
    if (err instanceof yaml.YAMLException) {
      return {
        error: {
          message: err.reason,
          location: `line ${err.mark.line}, col ${err.mark.column}`
        }
      }
    } else if (err instanceof ValidationError) {
      return {
        error: {
          message: `${err.message}`,
          location: `entry #${errorEntryNum}`
        }
      }
    } else {
      return {
        error: {
          message: err?.toString(),
          location: _.isNumber(errorEntryNum) ? `entry #${errorEntryNum}` : null
        }
      }
    }
  }
}

import yaml from 'js-yaml'
import _ from 'lodash'

import { SearchItem } from 'src/types'
import validateSearchItem from 'src/utils/validateSearchItem'
import { ValidationError } from 'yup'

export interface ParseResult {
  data?: SearchItem[]
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
  let data: SearchItem[]
  let errorItemNum: number
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
            // assume single search item
            return validateSearchItem(v)
          }
          if (!_.isArray(v?.items)) {
            throw new Error('format error: items must be a bullet list')
          }
          if (!v.label) {
            throw new Error('format error: label missing')
          }
          // assume list containg search item
          return v.items.map((i: any) =>
            validateSearchItem({
              ...i,
              label: v.label
            })
          )
        } catch (err) {
          errorItemNum = index + 1
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
          location: `item #${errorItemNum}`
        }
      }
    } else {
      return {
        error: {
          message: err?.toString(),
          location: _.isNumber(errorItemNum) ? `item #${errorItemNum}` : null
        }
      }
    }
  }
}

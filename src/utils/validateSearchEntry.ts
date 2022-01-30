import { SearchEntry } from 'src/types'
import * as yup from 'yup'

export const schema: yup.SchemaOf<SearchEntry> = yup
  .object({
    url: yup
      .string()
      .typeError('url is required')
      .required('url is required')
      .url('url must be valid'),
    description: yup.string().typeError('description must be text'),
    icon: yup.string().url().typeError('icon must be a valid url'),
    tags: yup
      .array()
      .of(yup.string().typeError('tag item must be text'))
      .typeError('tags must be a bullet list'),
    label: yup.string().typeError('label must be text'),
    title: yup.string().typeError('title must be text'),
    priority: yup.number().typeError('priority must be a number')
  })
  .typeError('url is required')

export default (object: any) => {
  const result = schema.validateSync(object)
  return result
}
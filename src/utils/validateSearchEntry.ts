import { SearchEntry } from 'src/types'
import * as yup from 'yup'

export const schema: yup.SchemaOf<SearchEntry> = yup.object({
  url: yup
    .string()
    .typeError('url is required')
    .required('url is required')
    .url('url must be valid'),
  description: yup.string(),
  icon: yup.string(),
  tags: yup.array().of(yup.string()),
  label: yup.string(),
  title: yup.string(),
  priority: yup.number()
})

export default (object: any) => {
  const result = schema.validateSync(object)
  return result
}

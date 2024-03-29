import * as yup from 'yup'
import { CallExternalOptions } from './callExternal'
import { LocalStorage } from './browser/storage'

const externalRequestConfigSchema: yup.SchemaOf<CallExternalOptions> =
  yup.object({
    requestConfig: yup.object(),
    propertyMap: yup.object(),
    includeLists: yup.array(yup.string()),
    pathToData: yup.string(),
    label: yup.string(),
    enabled: yup.boolean(),
    name: yup.string().required()
  })

export const schema: yup.SchemaOf<LocalStorage> = yup
  .object({
    myList: yup.string(),
    externalRequestsConfig: yup.array(externalRequestConfigSchema),
    includeLists: yup.array(yup.string()),
    searchDebounce: yup.number(),
    isDarkMode: yup.boolean()
  })
  .typeError('url is required')

export default (object: any) => {
  const result = schema.validateSync(object)
  return result
}

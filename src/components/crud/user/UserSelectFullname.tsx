import { SelectField } from '@payloadcms/ui'
import { SelectFieldServerComponent } from 'payload'

const CustomSelectFieldServer: SelectFieldServerComponent = async ({
  clientField,
  path,
  schemaPath,
  permissions,
  payload,
}) => {
  const users = await payload.find({
    collection: 'users',
  })
  const options = users.docs.map((user) => ({
    label: `${user.name} ${user.surname}`,
    value: user.id,
  }))
  return (
    <SelectField
      field={clientField}
      path={path}
      schemaPath={schemaPath}
      permissions={permissions}
    />
  )
}
export default CustomSelectFieldServer

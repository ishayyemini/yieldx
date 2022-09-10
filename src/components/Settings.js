import { Card, FormField, Main, TextInput } from 'grommet'
import { useCallback, useContext } from 'react'
import { useForm } from 'react-hook-form'

import API from '../data/API'
import { FormButtons } from './app/AppComponents'
import GlobalContext from './app/GlobalContext'

const Settings = () => {
  const { settings } = useContext(GlobalContext)

  const {
    register,
    handleSubmit,
    formState: { submitCount },
  } = useForm({
    defaultValues: {
      mqttAddress: settings.mqttAddress ?? 'broker.mqttdashboard.com',
      mqttPort: settings.mqttPort ?? '1883',
    },
  })

  const onSubmit = useCallback(({ mqttAddress, mqttPort }) => {
    API.updateSettings({ mqttAddress, mqttPort })
  }, [])

  return (
    <Main align={'center'} justify={'center'}>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField label={'MQTT Address'} required>
            <TextInput {...register('mqttAddress')} />
          </FormField>
          <FormField label={'MQTT Port'} required>
            <TextInput {...register('mqttPort')} />
          </FormField>

          <FormButtons submit={['Save', 'Saved!']} submitCount={submitCount} />
        </form>
      </Card>
    </Main>
  )
}

export default Settings

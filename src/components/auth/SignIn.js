import { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, FormField, Main, TextInput } from 'grommet'
import { useForm } from 'react-hook-form'

import GlobalContext from '../app/GlobalContext'
import { CHeader, FormButtons, LoadingIndicator } from '../app/AppComponents'

const SignIn = () => {
  const { user } = useContext(GlobalContext)

  const [loading, toggleLoading] = useState(false)

  const { t } = useTranslation()

  const { register, handleSubmit } = useForm({ defaultValues: { user: '' } })

  const onSubmit = useCallback((values) => {
    toggleLoading(true)
    console.log(values)
  }, [])

  return (
    <Main align={'center'} justify={'center'}>
      <Card>
        <CHeader style={{ fontWeight: 'bold' }}>{t('signIn.header')}</CHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField label={'Username'} required>
            <TextInput {...register('user')} />
          </FormField>

          <FormButtons submit clear />
        </form>
      </Card>

      <LoadingIndicator loading={loading} />
    </Main>
  )
}

export default SignIn

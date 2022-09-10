import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, FormField, Main, TextInput } from 'grommet'
import { useForm } from 'react-hook-form'

import { CHeader, FormButtons, LoadingIndicator } from '../app/AppComponents'
import API from '../../data/API'

const SignIn = ({ signIn }) => {
  const [loading, toggleLoading] = useState(false)
  const [error, setError] = useState('')

  const { t } = useTranslation()

  const { register, handleSubmit } = useForm({ defaultValues: { user: '' } })

  const onSubmit = useCallback(
    async ({ user }) => {
      toggleLoading(true)
      await API.login(user)
        .then((exists) => {
          if (exists) signIn(user)
          else setError('ERR_USER_DOESNT_EXIST')
        })
        .catch(() => setError('ERR_NETWORK'))
        .finally(() => toggleLoading(false))
    },
    [signIn]
  )

  return (
    <Main align={'center'} justify={'center'}>
      <Card>
        <CHeader style={{ fontWeight: 'bold' }}>{t('signIn.header')}</CHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label={'Username'}
            error={error ? t(`signIn.${error}`) : ''}
            required
          >
            <TextInput {...register('user')} />
          </FormField>

          <FormButtons submit={t('signIn.submit')} />
        </form>
      </Card>

      <LoadingIndicator loading={loading} />
    </Main>
  )
}

export default SignIn

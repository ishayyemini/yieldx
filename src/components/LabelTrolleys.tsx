import { FC, useCallback } from 'react'
import { Box, Button, DateInput, FormField, Main, TextInput } from 'grommet'
import { useForm } from 'react-hook-form'
import queryString from 'query-string'
import styled from 'styled-components'

type TrolleyFormType = {
  flock: string
  label: string
  date: string
  wh: string
}

const Wrapper = styled(Box).attrs({
  background: { light: 'brand' },
  pad: 'small',
  round: 'small',
})``

const LabelTrolleys: FC = () => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      flock: '',
      label: '',
      wh: '',
      date: new Date().toISOString(),
    },
  })

  const watchDate = watch('date')

  const onSubmit = useCallback((values: TrolleyFormType) => {
    fetch(
      'https://ls72mt05m4.execute-api.us-east-1.amazonaws.com/dev/default?' +
        queryString.stringify({ ...values, db: 'ishay' })
    )
      .then((res) => res.json())
      .then((res) => console.log(res))
  }, [])

  return (
    <Main align={'center'} justify={'center'}>
      <Wrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField label={'Label *'} required>
            <TextInput {...register('label')} />
          </FormField>
          <FormField label={'Flock *'} required>
            <TextInput {...register('flock')} />
          </FormField>
          <FormField label={'Warehouse'}>
            <TextInput {...register('wh')} />
          </FormField>
          <FormField label={'Date'}>
            <DateInput
              {...register('date')}
              format={'mm/dd/yyyy'}
              value={watchDate}
              onChange={({ value }) => {
                if (typeof value === 'string') setValue('date', value)
              }}
            />
          </FormField>

          <Box align={'center'}>
            <Button
              label={'Submit'}
              type={'submit'}
              style={{ background: 'var(--accent1)', fontWeight: 'bold' }}
              primary
            />
          </Box>
        </form>
      </Wrapper>
    </Main>
  )
}

export default LabelTrolleys

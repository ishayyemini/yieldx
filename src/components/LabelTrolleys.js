import { useCallback, useEffect, useState } from 'react'
import { Box, DateInput, FormField, Main, Select, TextInput } from 'grommet'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import API from '../data/API'
import { FormButtons, LoadingIndicator } from './app/AppComponents'

const Wrapper = styled(Box).attrs({
  background: { light: 'brand' },
  pad: 'small',
  round: 'small',
})``

const LabelTrolleys = () => {
  const [data, setData] = useState({})
  const [loading, toggleLoading] = useState(false)

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      flock: '',
      label: '',
      wh: '',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const watchDate = watch('date')
  const watchFlock = watch('flock')
  const watchWH = watch('wh')

  useEffect(() => {
    API.getFlockWHDate().then((res) => setData(res))
  }, [])

  const onSubmit = useCallback(({ label, flock, wh, date }) => {
    toggleLoading(true)
    API.labelTrolleys({
      label,
      flock,
      wh: wh === 'All' ? null : wh,
      date:
        (new Date() - new Date(date)) / (1000 * 60 * 60 * 24) < 1 ? null : date,
    }).then((res) => {
      toggleLoading(false)
      reset()
      console.log(res)
    })
  }, [])

  return (
    <Main align={'center'} justify={'center'}>
      <Wrapper>
        <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset()}>
          <FormField label={'Text to display on trolley *'} required>
            <TextInput {...register('label')} />
          </FormField>
          <FormField label={'Flock *'} required>
            <Select
              options={Object.keys(data)}
              {...register('flock')}
              onChange={(e) => setValue('flock', e.target.value)}
              value={watchFlock}
              placeholder={'Choose flock'}
            />
          </FormField>
          <FormField label={'Warehouse'}>
            <Select
              options={['All', ...Object.keys(data[watchFlock] ?? {})]}
              {...register('wh')}
              onChange={(e) => setValue('wh', e.target.value)}
              value={watchWH}
              disabled={!watchFlock}
              placeholder={
                watchFlock ? 'Choose warehouse' : 'First choose flock'
              }
            />
          </FormField>
          <FormField label={'Date'}>
            <DateInput
              {...register('date')}
              format={'yyyy-mm-dd'}
              value={watchDate}
              onChange={({ value }) => {
                console.log(value)
                if (typeof value === 'string') setValue('date', value)
                else if (typeof value === 'object') setValue('date', value[0])
              }}
              calendarProps={{
                bounds: data[watchFlock]?.[watchWH]
                  ? [data[watchFlock][watchWH], new Date().toISOString()]
                  : null,
                range: false,
              }}
              dropProps={{ align: { bottom: 'top', left: 'left' } }}
              disabled={!watchWH}
            />
          </FormField>

          <FormButtons submit clear />
        </form>
      </Wrapper>

      <LoadingIndicator loading={loading} />
    </Main>
  )
}

export default LabelTrolleys

import { useCallback, useEffect, useState } from 'react'
import {
  Box,
  CheckBox,
  DateInput,
  FormField,
  Main,
  Select,
  TextInput,
} from 'grommet'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'

import API from '../data/API'
import { FormButtons, LoadingIndicator } from './app/AppComponents'

const Wrapper = styled(Box).attrs({
  background: { light: 'brand' },
  pad: 'small',
  round: 'small',
})``

const diffDays = (a, b) => {
  const aDate = new Date(a)
  const bDate = new Date(b)
  aDate.setHours(0, 0, 0, 0)
  bDate.setHours(0, 0, 0, 0)
  return Math.abs((aDate - bDate) / (1000 * 60 * 60 * 24))
}

const genDates = (from, till, except) => {
  const thisDate = new Date(from)
  thisDate.setDate(thisDate.getDate() - 1)
  return Array.from({ length: diffDays(from, till) + 1 }, () => {
    thisDate.setDate(thisDate.getDate() + 1)
    return thisDate.toISOString().split('T')[0]
  }).filter((date) => !except.includes(date))
}

const LabelTrolleys = () => {
  const [data, setData] = useState({})
  const [loading, toggleLoading] = useState(false)

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      flock: '',
      label: '',
      wh: '',
      filterDate: false,
      date: new Date().toISOString().split('T')[0],
    },
  })

  const watchDate = watch('date')
  const watchFilterDate = watch('filterDate')
  const watchFlock = watch('flock')
  const watchWH = watch('wh')

  useEffect(() => {
    API.getFlockWHDate()
      .then((res) => setData(res))
      .catch((e) => console.log(e))
  }, [])

  const onSubmit = useCallback(
    ({ label, flock, wh, date, filterDate }) => {
      toggleLoading(true)
      API.labelTrolleys({
        label,
        flock,
        wh: wh === 'All' ? null : wh,
        date: filterDate ? date : null,
      }).then((res) => {
        toggleLoading(false)
        reset()
        console.log(res)
      })
    },
    [reset]
  )

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
          <Box direction={'row'} pad={'small'} gap={'medium'}>
            Filter by date?
            <CheckBox
              {...register('filterDate')}
              checked={watchFilterDate}
              disabled={!watchFlock}
            />
          </Box>
          <FormField label={'Date (mm/dd/yyyy)'}>
            <DateInput
              {...register('date')}
              format={'mm/dd/yyyy'}
              value={watchDate}
              onChange={({ value }) => {
                if (typeof value === 'string') setValue('date', value)
                else if (typeof value === 'object') setValue('date', value[0])
              }}
              calendarProps={{
                bounds: data[watchFlock]?.[watchWH]
                  ? [data[watchFlock][watchWH][0], new Date().toISOString()]
                  : null,
                range: false,
                disabled: data[watchFlock]?.[watchWH]
                  ? genDates(
                      data[watchFlock][watchWH][0],
                      new Date(),
                      data[watchFlock][watchWH]
                    )
                  : null,
              }}
              dropProps={{ align: { bottom: 'top', left: 'left' } }}
              disabled={!watchFilterDate}
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

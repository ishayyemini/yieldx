import { useCallback, useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CheckBox,
  DataTable,
  DateInput,
  FormField,
  Layer,
  Main,
  Select,
  Text,
  TextInput,
} from 'grommet'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useTranslation } from 'react-i18next'

import API from '../data/API'
import { FormButtons, LoadingIndicator } from './app/AppComponents'
import GlobalContext from './app/GlobalContext'

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
  const { settings } = useContext(GlobalContext)

  const [data, setData] = useState({})
  const [loading, toggleLoading] = useState(false)
  const [result, setResult] = useState(null)

  const { t } = useTranslation(null, { keyPrefix: 'labelTrolleys' })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      flock: '',
      label1: '',
      label2: '',
      wh: '',
      filterDate: false,
      date: new Date().toISOString().split('T')[0],
    },
    resolver: yupResolver(
      yup.object({
        label1: yup
          .string()
          .required(t('errors.label1.required'))
          .max(39, t('errors.label1.max')),
        label2: yup.string().max(39, t('errors.label2.max')),
        flock: yup.string().required(t('errors.flock.required')),
      })
    ),
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
    ({ label1, label2, flock, wh, date, filterDate }) => {
      toggleLoading(true)
      API.labelTrolleys({
        label1,
        label2,
        flock,
        wh: wh === t('all') ? null : wh,
        date: filterDate ? date : null,
        mqttAddress: settings.mqttAddress,
        mqttPort: settings.mqttPort,
      }).then((res) => {
        setResult(res)
        toggleLoading(false)
        reset()
      })
    },
    [reset, settings.mqttAddress, settings.mqttPort]
  )

  return (
    <Main align={'center'} justify={'center'}>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} onReset={() => reset()}>
          <FormField label={t('label') + ' *'} error={errors.label1?.message}>
            <TextInput {...register('label1')} />
          </FormField>
          <FormField error={errors.label2?.message}>
            <TextInput {...register('label2', { maxLength: 39 })} />
          </FormField>
          <FormField
            label={t('flock.label') + ' *'}
            error={errors.flock?.message}
          >
            <Select
              options={Object.keys(data)}
              {...register('flock', { required: true })}
              onChange={(e) => setValue('flock', e.target.value)}
              value={watchFlock}
              placeholder={t('flock.placeholder')}
            />
          </FormField>
          <FormField label={t('wh.label')}>
            <Select
              options={['All', ...Object.keys(data[watchFlock] ?? {})]}
              {...register('wh')}
              onChange={(e) => setValue('wh', e.target.value)}
              value={watchWH}
              disabled={!watchFlock}
              placeholder={t(`wh.placeholder.${watchFlock ? 1 : 0}`)}
            />
          </FormField>
          <Box direction={'row'} pad={'small'} gap={'medium'}>
            {t('filterDate')}
            <CheckBox
              {...register('filterDate')}
              checked={watchFilterDate}
              disabled={!watchFlock}
            />
          </Box>
          <FormField label={t('date') + ' (mm/dd/yyyy)'}>
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
      </Card>

      {result ? (
        <Layer responsive={false}>
          <Box align={'center'} gap={'small'} pad={'small'}>
            <Text weight={'bold'}>
              {t('success', { trolleys: result.length })}
            </Text>

            <Box height={{ max: '300px' }} overflow={'auto'}>
              <DataTable
                columns={[
                  { property: 'Warehouse', header: 'Warehouse', primary: true },
                  { property: 'Type', header: 'Type' },
                  { property: 'Amount', header: 'Egg Count' },
                ]}
                sort={{ property: 'Amount', direction: 'desc' }}
                background={{ header: 'white', body: ['white', 'light-2'] }}
                primaryKey={'ProdID'}
                data={result}
              />
            </Box>

            <Button
              label={t('successButton')}
              onClick={() => setResult(null)}
              primary
            />
          </Box>
        </Layer>
      ) : null}

      <LoadingIndicator loading={loading} />
    </Main>
  )
}

export default LabelTrolleys

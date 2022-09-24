import { useCallback, useContext, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  DataTable,
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

const parseData = (data, idKey, nameKey, filterBy) => [
  ...new Map(
    data
      .filter(
        (item) =>
          !filterBy ||
          Object.entries(filterBy).every(
            ([key, value]) => !value || item[key] === value
          )
      )
      .map((item) => [item[idKey], { name: item[nameKey], ID: item[idKey] }])
  ).values(),
]

const LabelTrolleys = () => {
  const { settings } = useContext(GlobalContext)

  const [data, setData] = useState([])
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
      label1: '',
      label2: '',
      flock: { name: '', ID: '' },
      sourceWH: { name: '', ID: '' },
      destWH: { name: '', ID: '' },
      rolling: 1,
    },
    resolver: yupResolver(
      yup.object({
        label1: yup
          .string()
          .required(t('errors.label1.required'))
          .max(39, t('errors.label1.max')),
        label2: yup.string().max(39, t('errors.label2.max')),
        flock: yup.object({
          ID: yup.string().required(t('errors.flock.required')),
        }),
      })
    ),
  })

  const values = watch()

  useEffect(() => {
    API.getFlockWHDate()
      .then((res) => setData(res))
      .catch((e) => console.log(e))
  }, [])

  const onSubmit = useCallback(
    (values) => {
      toggleLoading(true)

      const earliest = new Date(
        data
          .filter(
            (item) =>
              item.FlockID === values.flock.ID &&
              item.SourceID === values.sourceWH.ID &&
              item.DestID === values.destWH.ID
          )
          .map((item) => item.EarliestLaying)
          .sort()[0] || Date.now()
      )
      earliest.setDate(earliest.getDate() + Number(values.rolling))

      API.labelTrolleys({
        label1: values.label1,
        label2: values.label2,
        flock: values.flock.ID,
        sourceWH: values.sourceWH.ID,
        destWH: values.destWH.ID,
        date: earliest,
        rolling: Number(values.rolling),
        mqttAddress: settings.mqttAddress,
        mqttPort: settings.mqttPort,
      }).then((res) => {
        setResult(res)
        toggleLoading(false)
        reset({
          label1: '',
          label2: '',
          flock: { name: '', ID: '' },
          sourceWH: { name: '', ID: '' },
          destWH: { name: '', ID: '' },
          rolling: 1,
        })
      })
    },
    [data, settings.mqttAddress, settings.mqttPort]
  )

  const flocks = parseData(data, 'FlockID', 'FlockName')
  const sourceWHs = parseData(data, 'SourceID', 'SourceName', {
    FlockID: values.flock.ID,
    DestID: values.destWH.ID,
  })
  const destWHs = parseData(data, 'DestID', 'DestName', {
    FlockID: values.flock.ID,
    SourceID: values.sourceWH.ID,
  })

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
            error={errors.flock?.ID?.message}
          >
            <Select
              options={flocks}
              onChange={(e) => setValue('flock', e.option)}
              value={values.flock}
              labelKey={'name'}
              valueKey={'ID'}
              placeholder={t('flock.placeholder')}
            />
          </FormField>
          <FormField label={t('sourceWH.label')}>
            <Select
              options={sourceWHs}
              onChange={(e) => setValue('sourceWH', e.option)}
              value={values.sourceWH}
              labelKey={'name'}
              valueKey={'ID'}
              placeholder={t('sourceWH.placeholder')}
              disabled={!values.flock.ID}
            />
          </FormField>
          <FormField label={t('destWH.label')}>
            <Select
              options={destWHs}
              onChange={(e) => setValue('destWH', e.option)}
              value={values.destWH}
              labelKey={'name'}
              valueKey={'ID'}
              placeholder={t('destWH.placeholder')}
              disabled={!values.flock.ID}
            />
          </FormField>
          <FormField label={t('rolling')}>
            <TextInput
              {...register('rolling')}
              disabled={!values.flock.ID}
              type={'number'}
              min={1}
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
                  { property: 'DestName', header: 'Warehouse', primary: true },
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

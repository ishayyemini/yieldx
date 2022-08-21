import { FC, useCallback } from 'react'
import { Box, Button, DateInput, FormField, TextInput } from 'grommet'
import { useForm } from 'react-hook-form'

type TrolleyFormType = {
  flock: string
  label: string
  date: string
  wh: string
}

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
    console.log(values)
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box>
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

        <Button label={'Submit'} type={'submit'} alignSelf={'center'} />
      </Box>
    </form>
  )
}

export default LabelTrolleys

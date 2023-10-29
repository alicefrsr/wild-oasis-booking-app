import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createCabin } from '../../services/apiCabins';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';

function CreateCabinForm() {
  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;
  const queryClient = useQueryClient();
  const { mutate, isLoading: isCreating } = useMutation({
    // mutationFn: newCabin=> createCabin(newCabin),
    mutationFn: createCabin,
    onSuccess: () => {
      toast.success('New cabin successfully created');
      // invalidate cache so that it refetches data
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
      // reset fields
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    // console.log(data);
    // mutate(data);
    // uploading an image
    mutate({ ...data, image: data.image[0] });
  }
  function onError(errors) {
    console.log(errors);
  } // errors coming from formState

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label='Cabin name' error={errors?.name?.message}>
        {/* <Label htmlFor='name'>Cabin name</Label> */}
        <Input
          type='text'
          id='name'
          disabled={isCreating}
          {...register('name', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label='Maximum capacity' error={errors?.maxCapacity?.message}>
        {/* <Label htmlFor='maxCapacity'>Maximum capacity</Label> */}
        <Input
          type='number'
          id='maxCapacity'
          disabled={isCreating}
          {...register('maxCapacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label='Regular price' error={errors?.regularPrice?.message}>
        {/* <Label htmlFor='regularPrice'>Regular price</Label> */}
        <Input
          type='number'
          id='regularPrice'
          disabled={isCreating}
          {...register('regularPrice', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Price should be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label='Discount' error={errors?.discount?.message}>
        {/* <Label htmlFor='discount'>Discount</Label> */}
        <Input
          type='number'
          id='discount'
          disabled={isCreating}
          defaultValue={0}
          {...register('discount', {
            required: 'This field is required',
            validate: (value) =>
              value <= getValues().regularPrice * 0.5 ||
              'Discount should be less or equal to 50% of the regular price',
          })}
        />
      </FormRow>

      <FormRow
        label='Description for website'
        error={errors?.description?.message}
      >
        {/* <Label htmlFor='description'>Description for website</Label> */}
        <Textarea
          type='number'
          id='description'
          disabled={isCreating}
          defaultValue=''
          {...register('description', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label='Cabin Photo' error={errors?.image?.message}>
        {/* <Label htmlFor='image'>Cabin photo</Label> */}
        <FileInput
          id='image'
          accept='image/*'
          // type='file' // set with styled components in FileInput
          {...register('image', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation='secondary' type='reset'>
          Cancel
        </Button>
        <Button disabled={isCreating}>Add cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;

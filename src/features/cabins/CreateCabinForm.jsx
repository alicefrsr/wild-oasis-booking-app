import { useForm } from 'react-hook-form';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import toast from 'react-hot-toast';
// import { createAndEditCabin } from '../../services/apiCabins';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';
import { useCreateCabin } from './useCreateCabin';
import { useUpdateCabin } from './useUpdateCabin';

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabinToEdit;
  // Form: are we adding a new cabin (values = {}) or editing an existing one (values ={editValues})?
  const editMode = Boolean(editId);
  console.log(editMode);

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: editMode ? editValues : {},
  });
  const { errors } = formState;

  // custom hooks, react query refactor
  const { isCreating, createCabin } = useCreateCabin();
  const { isEditing, editCabin } = useUpdateCabin();

  // REFACTOR IN CUSTOM HOOK useCreateCabin
  // const queryClient = useQueryClient();

  // create cabin
  // const { mutate: createCabin, isLoading: isCreating } = useMutation({
  //   // mutationFn: newCabin=> createCabin(newCabin),
  //   mutationFn: createAndEditCabin,
  //   onSuccess: () => {
  //     toast.success('New cabin successfully created');
  //     // invalidate cache so that it refetches data
  //     queryClient.invalidateQueries({
  //       queryKey: ['cabins'],
  //     });
  //     // reset fields
  //     reset();
  //   },
  //   onError: (err) => toast.error(err.message),
  // });

  // REFACTOR IN CUSTOM HOOK useCreateCabin
  // edit cabin
  // const { mutate: editCabin, isLoading: isEditing } = useMutation({
  //   // mutationFn: newCabin=> createCabin(newCabin),
  //   mutationFn: ({ newCabinData, id }) => createAndEditCabin(newCabinData, id),
  //   onSuccess: () => {
  //     toast.success('Cabin successfully edited');
  //     // invalidate cache so that it refetches data
  //     queryClient.invalidateQueries({
  //       queryKey: ['cabins'],
  //     });
  //     // reset fields
  //     reset();
  //   },
  //   onError: (err) => toast.error(err.message),
  // });

  const isWorking = isCreating || isEditing;

  function onSubmit(data) {
    const image = typeof data.image === 'string' ? data.image : data.image[0];
    // console.log(data);
    // mutate(data);
    // uploading an image
    // mutate({ ...data, image: data.image[0] });
    if (editMode)
      editCabin(
        { newCabinData: { ...data, image }, id: editId },
        {
          onSuccess: (data, editId) => {
            console.log(data);
            reset(editId);
          },
        }
      );
    // else createCabin({ ...data, image: data.image[0] });
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: (data) => {
            console.log(data);
            reset();
            onCloseModal?.();
          },
        }
      );
  }
  function onError(errors) {
    console.log(errors);
  } // errors coming from formState

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      <FormRow label='Cabin name' error={errors?.name?.message}>
        {/* <Label htmlFor='name'>Cabin name</Label> */}
        <Input
          type='text'
          id='name'
          disabled={isWorking}
          {...register('name', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label='Maximum capacity' error={errors?.maxCapacity?.message}>
        {/* <Label htmlFor='maxCapacity'>Maximum capacity</Label> */}
        <Input
          type='number'
          id='maxCapacity'
          disabled={isWorking}
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
          disabled={isWorking}
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
          disabled={isWorking}
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
          {...register('image', {
            required: editMode ? false : 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation='secondary'
          type='reset'
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {editMode ? 'Edit cabin' : 'Create new cabin'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;

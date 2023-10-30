import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import { useUpdateSetting } from './UseUpdateSetting';
import { useSettings } from './useSettings';

function UpdateSettingsForm() {
  // const { isLoading, settings } = useSettings();
  const {
    isLoading,
    settings: {
      minBookingLength,
      maxBookingLength,
      maxGuestsPerBooking,
      breakfastPrice,
    } = {}, // hack for when settings is undefined initially
  } = useSettings();

  const { isUpdating, updateSetting } = useUpdateSetting();

  // function handleUpdate(e, fieldName) {
  function handleUpdate(e) {
    // improvements:
    // assigning the same value to the id of the <Input> as the variable, e.g. minBookingLength, rather than min-nights, then we don't need to pass an additional field into the handleUpdate, and instead simply get the id from the target
    // const { value } = e.target;
    const { value, id, defaultValue } = e.target;

    // if (!value) return;
    if (!value || !id || defaultValue === value) return;
    updateSetting({
      [id]: value,
    });
    // this line helps handle the case where if we click in and out of the input multiple times, then it will update multiple times because the defaultValue differs from the new value
    e.target.defaultValue === value;
  }

  if (isLoading) return <Spinner />;

  return (
    <Form>
      <FormRow label='Minimum nights/booking'>
        <Input
          type='number'
          // id='min-nights'
          id='minBookingLength'
          defaultValue={minBookingLength}
          // onBlur={(e) => handleUpdate(e, 'minBookingLength')}
          onBlur={(e) => handleUpdate(e)}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label='Maximum nights/booking'>
        <Input
          type='number'
          // id='max-nights'
          id='maxBookingLength'
          defaultValue={maxBookingLength}
          // onBlur={(e) => handleUpdate(e, 'maxBookingLength')}
          onBlur={(e) => handleUpdate(e)}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label='Maximum guests/booking'>
        <Input
          type='number'
          // id='max-guests'
          id='maxGuestsPerBooking'
          defaultValue={maxGuestsPerBooking}
          // onBlur={(e) => handleUpdate(e, 'maxGuestsPerBooking')}
          onBlur={(e) => handleUpdate(e)}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label='Breakfast price'>
        <Input
          type='number'
          // id='breakfast-price'
          id='breakfastPrice'
          defaultValue={breakfastPrice}
          // onBlur={(e) => handleUpdate(e, 'breakfastPrice')}
          onBlur={(e) => handleUpdate(e)}
          disabled={isUpdating}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;

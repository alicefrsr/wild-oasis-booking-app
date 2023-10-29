import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');
  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }
  return data;
}

export async function createCabin(newCabin) {
  // To upload image: create unique name + image path
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    '/',
    ''
  );
  // https://mhrmpbmfuesesuyejzmo.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
  const imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // Create cabin
  const { data, error } = await supabase
    .from('cabins')
    // .insert([{ some_column: 'someValue', other_column: 'otherValue' }])
    // .insert([newCabin])
    // image upload:
    .insert([{ ...newCabin, image: imagePath }])
    .select();
  if (error) {
    console.error(error);
    throw new Error('Cabin could not be created');
  }

  // If create cabin successful, then upload image
  const { error: storageError } = await supabase.storage
    .from('cabin-images')
    .upload(imageName, newCabin.image); // image name, actual image

  // Don't create cabin if upload fails, ie delete cabin if error
  if (storageError) {
    await supabase.from('cabins').delete().eq('id', data.id); // data from line 22 contains the new id
    console.error(storageError);
    throw new Error('Cabin image could not be uploaded, new cabin not created');
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from('cabins').delete().eq('id', id);
  if (error) {
    console.error(error);
    throw new Error('Cabin could not be deleted');
  }
  return data;
}

import supabase, { supabaseUrl } from './supabase';

export async function getCabins() {
  const { data, error } = await supabase.from('cabins').select('*');
  if (error) {
    console.error(error);
    throw new Error('Cabins could not be loaded');
  }
  return data;
}

export async function createAndEditCabin(newCabin, id) {
  console.log(newCabin, id);
  // To check if there's already an image when editing
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);
  // To upload image: create unique name + image path
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    '/',
    ''
  );
  // https://mhrmpbmfuesesuyejzmo.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
  // if there's already an image, ie the same, use it, if not create one
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // Create/Edit cabin
  let query = supabase.from('cabins');

  // CREATE  -- if not in editing mode
  if (!id)
    query = query
      // .insert([newCabin])
      // image upload:
      .insert([{ ...newCabin, image: imagePath }]);
  // .select()
  // .single(); // takes it out of the array it's in

  // EDIT
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq('id', id);
  // .select();

  const { data, error } = await query.select();
  // .single(); // single takes it out of the array it's in;
  // error if I leave this in: "The result contains 4 rows" 'JSON object requested, multiple (or no) rows returned'

  if (error) {
    console.error(error);
    throw new Error('Cabin could not be created');
  }

  // IMAGE UPLOAD:
  // If create cabin successful, then upload image
  // already has image, return
  if (hasImagePath) return data;
  // else upload image
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

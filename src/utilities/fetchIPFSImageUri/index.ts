export const fetchIPFSImageUri = async (image: string) => {
  try {
    const resp = await fetch(image);
    if (!resp.ok) {
      throw new Error("Failed to fetch image");
    }

    // Convert the response to a blob
    const blob = await resp.blob();

    // Create a data URL from the blob
    const dataUrl = URL.createObjectURL(blob);

    // Set the data URL as the image source
    return dataUrl;
  } catch (error) {
    console.error(error as string);
    return "";
  }
};

export default fetchIPFSImageUri;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((res, rej) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      res(reader.result as string);
    };

    reader.onerror = (error) => {
      rej(error);
    };
  });
};

export const serializeFile = async (
  file: File | null,
): Promise<{
  name: string;
  size: number;
  type: string;
  data: string;
} | null> => {
  if (!file) return null;

  try {
    const data = await fileToBase64(file);
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      data,
    };
  } catch (e) {
    throw new Error("Error serializing file");
  }
};

export const formatPrice = (n: number | undefined): string => {
  const number = n ?? 0;

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(number / 1000);
};

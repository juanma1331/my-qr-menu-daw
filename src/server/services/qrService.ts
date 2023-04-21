import * as QRCode from "qrcode";

const generateQr = async (content: string): Promise<string | null> => {
  try {
    return await QRCode.toDataURL(content);
  } catch (_e) {
    return null;
  }
};

export const qrService = {
  generateQr,
};

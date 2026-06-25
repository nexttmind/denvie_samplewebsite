export const BRAND = {
  name: "Dénvie",
  fullName: "Dénvie by Denise",
  tagline: "Comfortable and Luxurious Style",
  founder: "Denise Al Chalouhy",
  phone: "+961 71 713 236",
  phoneRaw: "96171713236",
  whatsapp: "https://wa.me/96171713236",
  instagramBrand: "https://instagram.com/denvie_lb",
  instagramOwner: "https://instagram.com/denise.joee",
  email: "hello@denvie.com",
  delivery: "All Over Lebanon",
};

export const whatsappLink = (message?: string) =>
  message ? `${BRAND.whatsapp}?text=${encodeURIComponent(message)}` : BRAND.whatsapp;
export type RawItem = {
  _id: string;
  name?: string;
  city?: string;
  country?: string;
  description?: string;
  price?: number;
  images?: string[];
  image?: string;
  photo?: string;
  hotel?: {
    name?: string;
    city?: string;
    country?: string;
    images?: string[];
    image?: string;
  };
};

export type Item = {
  _id: string;
  name: string;
  city?: string;
  country?: string;
  description?: string;
  price?: number;
  image?: string | null;
  type: string;
};

export const normalizeItem = (x: RawItem, type: string): Item => {
  return {
    _id: x._id,
    name: x.name || x.hotel?.name || "No name",
    city: x.city || x.hotel?.city || "—",
    country: x.country || x.hotel?.country || "",
    description: x.description || "",
    price: x.price || 0,
    image:
      x.images?.[0] ||
      x.image ||
      x.photo ||
      x.hotel?.images?.[0] ||
      x.hotel?.image ||
      null,
    type,
  };
};
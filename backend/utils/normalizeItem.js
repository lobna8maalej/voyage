 export const normalizeItem = (x) => {
  const image =
    x.image ||
    x.images?.[0] ||
    x.photo ||
    x.hotel?.image ||
    x.hotel?.images?.[0] ||
    null;

  return {
    _id: x._id,
    name: x.name || x.hotel?.name || "No name",
    city: x.city || x.hotel?.city || "—",
    country: x.country || x.hotel?.country || "—",
    description: x.description || "",
    price: Number(x.price ?? 0),
    image,
    type: (x.type || "unknown").toLowerCase().trim(),
  };
};
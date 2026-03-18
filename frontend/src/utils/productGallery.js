export const getProductGallery = (product) => {
  if (!product) {
    return [];
  }

  if (Array.isArray(product.gallery_images) && product.gallery_images.length > 0) {
    return product.gallery_images.map((item, index) => ({
      ...item,
      alt_text: item.alt_text || `${product.name} view ${index + 1}`,
    }));
  }

  if (product.image) {
    return [
      {
        id: `fallback-${product.id}`,
        image: product.image,
        alt_text: product.name,
        sort_order: 0,
      },
    ];
  }

  return [];
};

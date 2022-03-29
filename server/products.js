'use strict';

const knex = require('../db/connection').knex;

const getProducts = async (req, res) => {
  const products = await knex.select().table('products');
  const productImages = await knex.select().table('product_images');
  const images = await knex.select().table('images');

  const result = products.map((product) => {
    const currentProductImages = productImages.filter((productImage) => productImage.product_id === product.id);
    const imageIds = currentProductImages.map((currentProductImage) => currentProductImage.image_id);
    const currentProductImagesImages = images
      .filter((image) => imageIds.includes(image.id))
      .map((image) => {
        const order = currentProductImages.find((productImage) => productImage.image_id === image.id)?.order;
        return {
          ...image,
          order
        };
      });
    return {
      ...product,
      images: currentProductImagesImages
    }
  });
  res.status(200).send(result);
};

module.exports = {
  getProducts
};

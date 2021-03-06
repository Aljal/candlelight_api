'use strict';

const knex = require('./connection').knex;

const productOptions = [
  {
    name: 'coton_wick',
    description: 'Mèche en coton',
    price: 0,
    quantity: 100,
    active: true,
  },
  {
    name: 'wood_wick',
    description: 'Mèche en bois',
    price: 3,
    quantity: 60,
    active: true,
  },
];

const COLLECTION_NAMES = {
  LES_GOURMANDES: 'Les gourmandes',
  LES_SOLAIRES: 'Les solaires',
  LES_ELEGANTES: 'Les Élégantes',
}

/*
  Image path template
  public/product_images/Milkshake_close.jpeg
  public/product_images/Milkshake_wood_wick.jpeg
  public/product_images/Milkshake_coton_wick.jpeg

  public/product_images/${product_name}_close.jpeg
  public/product_images/${product_name}_${product_option}.jpeg
  */
const products = [
  {
    reference: "#2203001",
    name: "Milkshake",
    description: "Bougie coulée en pot (argenté) faite à la main. Effet irisé nacré pendant la fonte. Parfum délicat, gourmand et envoûtant de Vanille.",
    price: "22",
    weigth: "205",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_GOURMANDES,
  },
  {
    reference: "#2203002",
    name: "Crumble",
    description: "Bougie coulée en pot (doré) faite à la main. Effet velours bordeaux irisé pendant la fonte. Parfum savoureux et gourmand de Cerise et de Vanille.",
    price: "20",
    weigth: "205",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_GOURMANDES,
  },
  {
    reference: "#2203003",
    name: "Cherry Dream",
    description: "Bougie coulée en pot (doré) faite à la main.Effet velours rouge irisé pendant la fonte. Parfum doux et savoureux de Cerise.",
    price: "22",
    price: "25",
    weigth: "205",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_GOURMANDES,
  },
  {
    reference: "#2203004",
    name: "Sunkissed",
    description: "Bougie coulée en pot (argenté) faite à la main. Effet turquoise irisé pendant la fonte. Parfum solaire et exotique de Monoï.",
    price: "22",
    price: "25",
    weigth: "205",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_SOLAIRES,
  },
  {
    reference: "#2203005",
    name: "Sunny Day",
    description: "Bougie coulée en pot (doré) faite à la main. Effet or liquide pendant la fonte. Parfum frais et lumineux d'agrumes et d'épices.",
    price: "22",
    price: "25",
    weigth: "205",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_SOLAIRES,
  },
  {
    reference: "#2203006",
    name: "Precious",
    description: "Bougie coulée en pot (doré) faite à la main. Effet Cuivre liquide pendant la fonte. Parfum envoûtant et sulfureux avec des notes de Monoï, d'agrumes et d'épices.",
    price: "22",
    price: "25",
    weigth: "205",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_SOLAIRES,
  },
  {
    reference: "#2203007",
    name: "Violet Lady",
    description: "Bougie coulée en pot (argenté) faite à la main. Effet satin violet et nacre pendant la fonte. Parfum élégant, frais, tendre et poudré de Violette et de Lavande Musquée.",
    price: "22",
    weigth: "205",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_ELEGANTES,
  },
  {
    reference: "#2203008",
    name: "Purple Rain",
    description: "Bougie coulée en pot (argenté) faite à la main. Effet bleu hypnotique pendant la fonte. Parfum tendre et chaleureux de violette avec des notes d'ambre orientale.",
    price: "20",
    weigth: "205",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_ELEGANTES,
  },
  {
    reference: "#2203009",
    name: "Lavender Wish",
    description: "Bougie coulée en pot (argenté) faite à la main. Effet violet nacré pendant la fonte. Parfum intense et frais de Lavande de Provence.",
    price: "20",
    weigth: "205",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_ELEGANTES,
  },
  {
    reference: "#2203010",
    name: "Warm Embrace",
    description: "Bougie coulée en pot (doré) faite à la main. Effet Bronze Pailleté pendant la fonte. Parfum élégant et chaleureux délicatement Vanillé et Ambré.",
    price: "22",
    weigth: "205",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_ELEGANTES,
  },
];

// Populate product_options table
(async () => {
  for (let productOption of productOptions) {
    const result = await knex('product_options').where({ name: productOption.name });
    if (result.length === 0) {
      const data = await knex('product_options').insert(productOption);
    }
  }
})();


// Populate products table
(async () => {
  for (let entireProduct of products) {
    const { collectionName, ...product } = entireProduct;
    const collectionIds = {};
    const imageCoton = product.name.replaceAll(' ', '_') + '_coton_wick.jpeg';
    const imageWood = product.name.replaceAll(' ', '_') + '_wood_wick.jpeg';
    const imageClose = product.name.replaceAll(' ', '_') + '_close.jpeg';

    const productImages = [
      {
        name: imageCoton,
        src: '/api/public/products/' + imageCoton,
        alt: imageCoton.split('.')[0].replaceAll('_', ' '),
        order: 1
      },
      {
        name: imageWood,
        src: '/api/public/products/' + imageWood,
        alt: imageWood.split('.')[0].replaceAll('_', ' '),
        order: 2
      },
      {
        name: imageClose,
        src: '/api/public/products/' + imageClose,
        alt: imageClose.split('.')[0].replaceAll('_', ' '),
        order: 3
      },
    ];

    if (!collectionIds[collectionName]) {
      let collectionId = await knex('collections').where({ name: collectionName }).select('id');
      if (collectionId.length === 0) {
        collectionId = await knex('collections').insert({ name: collectionName }, 'id');
        collectionIds[collectionName] = collectionId[0].id;
      } else {
        collectionIds[collectionName] = collectionId[0].id;
      }
    }
    const productId = await knex('products').insert({ ...product, collection_id: collectionIds[collectionName] }, 'id');
    for (let entireProductImage of productImages) {
      const { order, ...productImage } = entireProductImage;
      const imageId = await knex('images').insert(productImage, 'id');
      await knex('product_images').insert({ order, product_id: productId[0].id, image_id: imageId[0].id });
    }
  }
})();

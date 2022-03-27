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
    ref: "#2203001",
    name: "Milkshake",
    description: "Bougie coulée en pot (argenté) faite à la main. Effet irisé nacré pendant la fonte. Parfum délicat, gourmand et envoûtant de Vanille.",
    price: "22",
    weigth: "205g",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_GOURMANDES,
  },
  {
    ref: "#2203002",
    name: "Crumble",
    description: "Bougie coulée en pot (doré) faite à la main. Effet velours bordeaux irisé pendant la fonte. Parfum savoureux et gourmand de Cerise et de Vanille.",
    price: "20",
    weigth: "205g",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_GOURMANDES,
  },
  {
    ref: "#2203003",
    name: "Cherry Dream",
    description: "Bougie coulée en pot (doré) faite à la main.Effet velours rouge irisé pendant la fonte. Parfum doux et savoureux de Cerise.",
    price: "22",
    price: "25",
    weigth: "205g",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_GOURMANDES,
  },
  {
    ref: "#2203004",
    name: "Sunkissed",
    description: "Bougie coulée en pot (argenté) faite à la main. Effet turquoise irisé pendant la fonte. Parfum solaire et exotique de Monoï.",
    price: "22",
    price: "25",
    weigth: "205g",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_SOLAIRES,
  },
  {
    ref: "#2203005",
    name: "Sunny Day",
    description: "Bougie coulée en pot (doré) faite à la main. Effet or liquide pendant la fonte. Parfum frais et lumineux d'agrumes et d'épices.",
    price: "22",
    price: "25",
    weigth: "205g",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_SOLAIRES,
  },
  {
    ref: "#2203006",
    name: "Precious",
    description: "Bougie coulée en pot (doré) faite à la main. Effet Cuivre liquide pendant la fonte. Parfum envoûtant et sulfureux avec des notes de Monoï, d'agrumes et d'épices.",
    price: "22",
    price: "25",
    weigth: "205g",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_SOLAIRES,
  },
  {
    ref: "#2203007",
    name: "Violet Lady",
    description: "Bougie coulée en pot (argenté) faite à la main. Effet satin violet et nacre pendant la fonte. Parfum élégant, frais, tendre et poudré de Violette et de Lavande Musquée.",
    price: "22",
    price: "25",
    weigth: "205g",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_ELEGANTES,
  },
  {
    ref: "#2203008",
    name: "Purple Rain",
    description: "Bougie coulée en pot (argenté) faite à la main. Effet bleu hypnotique pendant la fonte. Parfum tendre et chaleureux de violette avec des notes d'ambre orientale.",
    price: "20",
    weigth: "205g",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_ELEGANTES,
  },
  {
    ref: "#2203009",
    name: "Lavender Wish",
    description: "Bougie coulée en pot (argenté) faite à la main. Effet violet nacré pendant la fonte. Parfum intense et frais de Lavande de Provence.",
    price: "20",
    weigth: "205g",
    quantity: 1,
    collectionName: COLLECTION_NAMES.LES_ELEGANTES,
  },
  {
    ref: "#2203010",
    name: "Warm Embrace",
    description: "Bougie coulée en pot (doré) faite à la main. Effet Bronze Pailleté pendant la fonte. Parfum élégant et chaleureux délicatement Vanillé et Ambré.",
    price: "22",
    price: "25",
    weigth: "205g",
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
    let id = await knex('collections').where({ name: collectionName }).select('id');
    if (id.length === 0) {
      id = knex('collections').insert({ name: collectionName }, 'id');
      collectionIds[collectionName] = id[0];
    } else {
      collectionIds[collectionName] = id[0];
    }
    await knex('products').insert({ ...product, collection_id: collectionIds[collectionName] });
  }
})();

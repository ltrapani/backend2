export const addProductErrorInfo = (product) => {
  return `One or more properties were incomplete or not valid.
    List of required properties:
    * title: needs to be String, received ${product.title}
    * description: needs to be String, received ${product.description}
    * code: needs to be String, received ${product.code}
    * price: needs to be Number, received ${product.price}
    * stock: needs to be Number, received ${product.stock}
    * category: needs to be String, received ${product.category}
    `;
};

export const addDuplicateProductErrorInfo = (code) => {
  return `Code "${code}" already exists!!!`;
};

export const invalidIdErrorInfo = () => {
  return `You entered an invalid id!!!`;
};

export const notFoundErrorInfo = (item) => {
  return `${item} not found!!!`;
};

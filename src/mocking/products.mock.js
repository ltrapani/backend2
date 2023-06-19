import { faker } from "@faker-js/faker";

export const generateProduct = () => {
  const numOfImages = parseInt(
    faker.random.numeric(1, { bannedDigits: ["0"] })
  );
  const thumbnail = [];
  for (let i = 0; i < numOfImages; i++) thumbnail.push(faker.image.imageUrl());

  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.random.alphaNumeric(5),
    price: faker.commerce.price(),
    status: faker.datatype.boolean(),
    stock: faker.random.numeric(),
    category: faker.random.word(),
    thumbnail,
    owner: "admin",
  };
};

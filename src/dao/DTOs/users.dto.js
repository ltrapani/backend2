export default class UsersDto {
  constructor(user) {
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.cart = user.cart;
    this.role = user.role;
  }

  static formatGitHubUser = (user) => {
    const [first_name, last_name] = user.name.split(" ");
    return {
      first_name,
      last_name,
      email: user.email,
      age: "",
      cart: "",
      password: "",
    };
  };
}

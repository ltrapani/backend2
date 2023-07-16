export default class UsersDto {
  constructor(user) {
    this._id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.age = user.age;
    this.cart = user.cart;
    this.role = user.role;
    this.last_connection = user.last_connection;
    this.documents = user.documents;
    this.profile = user.profile;
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
      last_connection: new Date(),
      documents: [],
      profile: user.avatar_url,
    };
  };
}

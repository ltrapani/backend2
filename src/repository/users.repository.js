import UsersDto from "../dao/DTOs/users.dto.js";

export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getUsers = async () => {
    const users = await this.dao.getUsers();

    return users.map((user) => new UsersDto(user));
  };

  create = async (user) => await this.dao.create(user);

  createGitHubUser = async (user) =>
    await this.dao.create(UsersDto.formatGitHubUser(user));

  login = async (user) => (user = new UsersDto(user));

  findById = async (id) => await this.dao.findById(id);

  findByEmail = async (email) => await this.dao.findByEmail(email);

  update = async (email, user) => await this.dao.update(email, user);

  delete = async (id) => await this.dao.delete(id);
}

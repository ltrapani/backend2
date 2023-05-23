export default class TicketsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create = async (ticket) => await this.dao.create(ticket);

  findById = async (tid) => await this.dao.findById(tid);

  findByCode = async (code) => await this.dao.findByCode(code);

  update = async (code, ticket) => await this.dao.update(code, ticket);

  delete = async (tid) => await this.dao.delete(tid);
}

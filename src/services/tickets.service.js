import { ticketsManager } from "../dao/index.js";
import TicketsRepository from "../repository/tickets.repository.js";

const ticketsRepository = new TicketsRepository(ticketsManager);

export const createTicket = async (ticket) =>
  await ticketsRepository.create(ticket);

export const findById = async (tid) => await ticketsRepository.findById(tid);

export const findByCode = async (code) =>
  await ticketsRepository.findByCode(code);

export const updateTicket = async (code, ticket) =>
  await ticketsRepository.update(code, ticket);

export const deleteTicket = async (tid) => await ticketsRepository.delete(tid);

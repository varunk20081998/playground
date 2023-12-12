import { Publisher } from "./base-publisher";
import { TicketCreatedEvent } from "./ticket-creted-event";
import { Subjects } from "./subject";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated;
}

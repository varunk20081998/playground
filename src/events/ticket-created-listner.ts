import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subject";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated;
  queueGroupName = "payments-srv";
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log(`data :`, data);
    msg.ack();
  }
}

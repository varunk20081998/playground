import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";

export class TicketCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "payments-srv";
  onMessage(data: any, msg: Message): void {
    console.log(`data :`, data);
    msg.ack();
  }
}

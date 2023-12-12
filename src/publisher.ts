import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedPublisher } from "./events/ticket-creted-publisher";
console.clear();

const client = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

client.on("connect", async () => {
  console.log("publisher connected to nats.");
  const Publisher = new TicketCreatedPublisher(client);
  try {
    await Publisher.publish({ id: "123", title: "concert", price: "23" });
  } catch (e) {
    console.error(e);
  }
});

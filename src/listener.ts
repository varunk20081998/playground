import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listner";
console.clear();
const client = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("listener connected to nats");
  client.on("close", () => {
    console.log("closing the listener!!");
    process.exit();
  });
  new TicketCreatedListener(client).listen();
});

process.on("SIGINT", () => {
  client.close();
});
process.on("SIGTERM", () => {
  client.close();
});

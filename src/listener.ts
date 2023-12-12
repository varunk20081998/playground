import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";
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
  const options = client
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("accounting-srv");

  const subs = client.subscribe("ticket:created", "queue-grp-name", options);

  subs.on("message", (msg: Message) => {
    const data = msg.getData();
    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()},with data : ${data}`);
    }
    msg.ack();
  });
});

process.on("SIGINT", () => {
  client.close();
});
process.on("SIGTERM", () => {
  client.close();
});

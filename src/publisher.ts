import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
console.clear();

const client = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("publisher connected to nats.");

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: "20",
  });
  client.publish("ticket:created", data, () => {
    console.log("event got published");
  });
});

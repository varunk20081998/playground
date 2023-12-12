## This change is to separate publish logic and add few type checks to it too.

create a file where we can create a abstract class just for different custom Publishers.

```typescript
------base - publisher.ts;

import { Stan } from "node-nats-streaming";
import { Subjects } from "./subject";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];

  private client: Stan;
  constructor(client: Stan) {
    this.client = client;
  }
  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log("event published");
        resolve();
      });
    });
  }
}
```

### all the type chect methods are same as the listener approach.

```ts
import { Publisher } from "./base-publisher";
import { TicketCreatedEvent } from "./ticket-creted-event";
import { Subjects } from "./subject";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated;
}
```

## Added few await thing just in case to fallback and stop once the promise not resolved and the msg not delevered.

```ts
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
```

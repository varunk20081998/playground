# This kind of check is necessary due to the humman error of typos in many places may cause to listen to wrong channel in order to avoid that

## all the subjects are enumized and exported from common place.

```typescript - > Subject.ts
export enum Subjects {
  TicketCreated = "ticket:created",
  orderUpdated = "order:updated",
}
```

### since we created a dedicated enum to all of the subject available we might also need to bind these subjects to the event using these subjects and possible data emmited by them. To achieve that we need to "create a separate event interface " and export it

```typescript
import { Subjects } from "./subject";

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: string;
  };
}
```

### here we are creating a bond between the subject and the possible data output type. Once this binding is done we need to some how make ts understand how this particular event type is what we should expect from our subclass listner once given subject.

### So to achive that kind of binding we need to modify the base class a little bit. like we need to crete a reference interface which gets invoked whenever this class is extended to some other class..

```typescript TicketCreatedEvent.ts
import {Subjects} from './subject'
interface Event {
  subject: Subjects;
  data: any;
} // this is the ref interface which is triggered when it gets extended by subclasses

export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;

```

### now the implementation of all the definition comes to our subclass created form extending Abstract class of Listener.In this extend we need to add the event interface created above.

```typescript
import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-creted-event";
import { Subjects } from "./subject";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: TicketCreatedEvent["subject"] = Subjects.TicketCreated;
  queueGroupName = "payments-srv";
  onMessage(data: TicketCreatedEvent["data"], msg: Message): void {
    console.log(`data :`, data);
    msg.ack();
  }
}
```

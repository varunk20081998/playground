# creating an abstract class to reuse the boiler plate code while setting up the publisher and listner

## this class contains folloing property.

1. subject - string //abstract
2. onMessage - (event:eventData)=> void //abstract
3. client - stan
4. queueGroupName - string
5. ackWait - number
6. subscriptionOptions - SubscriptionOptions
7. listen - ()=> void
8. parseMessage. - (msg:Message)=>any

```typescript
import nats, { Message, Stan } from "node-nats-streaming";
// The purpose of this abstract class is to reduce the repeated code used to setup the listener and in order to do that we are segregating the properties which are required to create a listener and making the abstract properties of it.
export abstract class Listener {
  abstract subject: string; // each listener might have different subject name so we are declaring this as abstract.
  abstract queueGroupName: string; //each listener might have different queueGroupName so we are declaring this as abstract.
  //queueGroupName  mandates the different listener running for same subscription to coordinate the msg within them.
  //this is also important because there is an option added called .setDeliverAllAvailable() which sends all the stored msgs to the newly created listener to that subscription. in order to just send them once when it is created newly
  abstract onMessage(data: any, msg: Message): void; //each listener might have different onMessage functionality so we are declaring this as abstract.
  //this function basically do some different business logic with the data with each listener.

  protected ackWait = 5 * 1000; // its a time taken by nats to basically restart new client whenever something happens to the old one. or whenever there is a msg not received by any of listener it requires some waiting time for the listner to start listen again otherwise the msg comes back after the ackwait time.
  private client: Stan; // client instance derived from nats.
  constructor(client: Stan) {
    this.client = client; // needed to add in constructor because the following client is passed in to the listener class to establish the con.
  }
  //subs options optimised based on the requirement
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }
  //this is a method used to start a subscription by giving following properties.
  listen() {
    const subs = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );
    subs.on("message", (msg: Message) => {
      console.log(`message received${this.subject}/${this.queueGroupName}`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}
```

```typescript
import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";

// this class basically used to create a separate instance from the listener it make use of all the abstract props of the base class to build a brand new listener to specifically listen to given subject.
export class TicketCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "payments-srv";
  onMessage(data: any, msg: Message): void {
    console.log(`data :`, data);
    msg.ack(); // this acknowledges the nats-streaming server that the msg has been received.
  }
}
```

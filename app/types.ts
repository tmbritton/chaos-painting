export interface Payload {
  [key: string]: any;
}

export interface Message {
  type: string;
  payload?: Payload;
}

export type Dispatch = (e: Message) => void;

import {EventObject, PayloadSender, State} from "xstate";

declare global {
    type UseService = [State<any>, PayloadSender<EventObject>];
}

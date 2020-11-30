import {useState} from "react";

export function useMergeState<T>(initialState: T): [T, { (state: T): void }] {
    const [state, setState] = useState<T>(initialState);
    const setMergedState = (newState: T) =>
        setState((prevState: T) => Object.assign({}, prevState, newState));
    return [state, setMergedState];
}

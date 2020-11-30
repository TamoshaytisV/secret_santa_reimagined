import React, {useState} from "react";
import {LoginError} from "./LoginError";
import {LoginForm} from "./LoginForm";


const Login = () => {
    const [error, setError] = useState<null | ErrorEvent>(null);
    return !error ?
        <LoginForm onError={setError} />:
        <LoginError error={error} reset={setError}/>;
};

export {Login};

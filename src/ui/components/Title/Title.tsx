import React from "react";
import styles from "./styles.scss";

const Title = ({text, size}: {text: string, size?: number}) => {
    return React.createElement(
        `h${size || 1}`,
        {className: styles.title},
        `(${text})`
    );
};

export {Title};

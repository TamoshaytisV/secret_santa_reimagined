import Send from "./assets/send.svg";
import Done from "./assets/done.svg";
import Error from "./assets/error.svg";

import styles from "../../../user/styles.scss";



export const Icon = ({comp, ...props}: { comp: typeof Send | typeof Done | typeof Error }) => {
    return <div className={styles.bounce}>{comp(props)}</div>;
};

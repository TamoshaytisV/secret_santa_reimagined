import styles from './styles.scss';

interface ButtonProps {
    children: any;
    onClick?: { (): void };
    disabled?: boolean
}


const Button = ({children, onClick, disabled}: ButtonProps) => {
    return <button className={styles.button}
                   onClick={onClick ? onClick : () => {}}
                   disabled={disabled}>
        {children}
    </button>
};

export {Button};

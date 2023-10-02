import styles from './header.module.css';
import { headerConfig } from '../../common/config/header.config.js'

export default function Header() {
    return (
        <div className={styles.floatingHeader}>
            <div className={styles.headerLeftMargin}></div>
            <div className={styles.headerItems}>
                {headerConfig.map((item: string) => {
                    return <div className={styles.headerItem} key={item}>{item}</div>
                })}
            </div>
        </div>
    );
}
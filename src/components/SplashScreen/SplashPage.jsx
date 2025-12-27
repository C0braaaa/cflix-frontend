import classNames from 'classnames/bind';
import styles from './SplashPage.module.scss';

const cx = classNames.bind(styles);
function SplashScreen() {
    return (
        <div className={cx('splash-screen')}>
            <img src="/assets/images/logo.png" alt="logo-cflix" />
        </div>
    );
}

export default SplashScreen;

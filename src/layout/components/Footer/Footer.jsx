import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './Footer.module.scss';
import {
    faDiscord,
    faFacebookF,
    faInstagram,
    faTelegram,
    faThreads,
    faYoutube,
} from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('footer-elements')}>
                <div className={cx('line-1')}>
                    <div className={cx('logo')}>
                        <img src="/assets/images/logo.png" alt="logo" />
                    </div>
                    <div className={cx('social')}>
                        <a
                            className={cx('social-icon')}
                            href="https://github.com/C0braaaa/CFlix"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FontAwesomeIcon icon={faDiscord} />
                        </a>
                        <a
                            className={cx('social-icon')}
                            href="https://github.com/C0braaaa/CFlix"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a
                            className={cx('social-icon')}
                            href="https://github.com/C0braaaa/CFlix"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a
                            className={cx('social-icon')}
                            href="https://github.com/C0braaaa/CFlix"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FontAwesomeIcon icon={faThreads} />
                        </a>
                        <a
                            className={cx('social-icon')}
                            href="https://github.com/C0braaaa/CFlix"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FontAwesomeIcon icon={faTelegram} />
                        </a>
                        <a
                            className={cx('social-icon')}
                            href="https://www.youtube.com/shorts/SXHMnicI6Pg"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FontAwesomeIcon icon={faYoutube} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

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
import { faAt } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <footer className={cx('wrapper')}>
            <div className={cx('footer-elements')}>
                <div className={cx('left-side')}>
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
                                href="https://www.facebook.com/c0bra.0f"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FontAwesomeIcon icon={faFacebookF} />
                            </a>
                            <a
                                className={cx('social-icon')}
                                href="https://www.instagram.com/th__hieu/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FontAwesomeIcon icon={faInstagram} />
                            </a>
                            <a
                                className={cx('social-icon')}
                                href="https://www.threads.com/@th__hieu"
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
                    <div className={cx('l-2')}>
                        <p className={cx('content')}>
                            CFLIX là website xem phim trực tuyến được xây dựng trong khuôn khổ đồ án tốt nghiệp, với mục
                            tiêu ứng dụng các kiến thức đã học vào thực tế. Nền tảng cung cấp giao diện xem phim hiện
                            đại, hỗ trợ Vietsub, thuyết minh và lồng tiếng với chất lượng hiển thị Full HD. Dự án tập
                            trung phát triển hệ thống quản lý phim, phân loại thể loại, tìm kiếm, và trải nghiệm người
                            dùng mượt mà. CFLIX được thực hiện hoàn toàn cho mục đích học tập và nghiên cứu, "không mang
                            tính thương mại".
                        </p>
                    </div>
                </div>
                <div className={cx('right-side')}>
                    <div className={cx('contact')}>
                        <h4 className={cx('contact-title')}>Liên hệ</h4>
                        <p className={cx('contact-email')}>
                            <FontAwesomeIcon icon={faAt} style={{ color: 'var(--primary-color)' }} />
                            <a href="mailto:cobragaming0fo@gmail.com" className={cx('link')}>
                                cobragaming0fo@gmail.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <div className={cx('footer-divider')}></div>
            <div className={cx('l-3')}>
                <p className={cx('copyright')}>© 2026 CFLIX – Đồ án tốt nghiệp của C0bra</p>
            </div>
        </footer>
    );
}

export default Footer;

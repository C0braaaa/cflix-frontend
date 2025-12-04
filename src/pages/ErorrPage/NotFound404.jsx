import { useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './ErorrPage.module.scss';
import Button from '../../components/Button/index-button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function NotFound404() {
    useEffect(() => {
        document.title = 'Lỗi 404 - Lỗi không tìm thấy trang';
    });

    return (
        <div className={cx('wrapper-404')}>
            <img src="/assets/images/404.png" alt="404-icon" />
            <h1>Oops! Trang bạn tìm không tồn tại.</h1>
            <h3>Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang chủ</h3>
            <Button to="/" className={cx('btn')} primary large leftIcon={<FontAwesomeIcon icon={faCaretLeft} />}>
                Trang Chủ
            </Button>
        </div>
    );
}

export default NotFound404;

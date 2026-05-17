import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button/index-button';
import styles from './DisclaimerModal.module.scss';

const cx = classNames.bind(styles);

function DisclaimerModal() {
    const [showDisclaimer, setShowDisclaimer] = useState(true);

    const handleCloseDisclaimer = () => {
        setShowDisclaimer(false);
    };

    if (!showDisclaimer) return null;

    return (
        <div className={cx('disclaimer-modal')}>
            <div className={cx('overlay')} onClick={handleCloseDisclaimer}></div>
            <div className={cx('disclaimer-content')}>
                <button className={cx('close-btn')} onClick={handleCloseDisclaimer}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2>Thông báo từ CFlix</h2>
                <p>
                    Chào mừng bạn đến với <strong>CFlix</strong>!
                </p>
                <p>
                    Đây là một <strong>dự án cá nhân (portfolio)</strong> được xây dựng hoàn toàn vì mục đích{' '}
                    <strong>học thuật</strong> và <strong>ứng tuyển công việc</strong>.
                </p>
                <p>
                    Do website có sử dụng một số tài liệu và nội dung có bản quyền từ bên thứ ba, dự án này mang tính
                    chất <strong>phi thương mại</strong> và tuyệt đối <strong>không tạo ra bất kỳ doanh thu nào</strong>
                    .
                </p>
                <p>Cảm ơn bạn đã ghé thăm và trải nghiệm hệ thống của chúng tôi!</p>
                <Button primary className={cx('btn-understand')} onClick={handleCloseDisclaimer}>
                    Đã hiểu
                </Button>
            </div>
        </div>
    );
}

export default DisclaimerModal;

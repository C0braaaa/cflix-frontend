import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Button from '../Button/index-button';
import styles from './DisclaimerModal.module.scss';

const cx = classNames.bind(styles);

function DisclaimerModal() {
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    useEffect(() => {
        const isGranted = sessionStorage.getItem('cflix_access_granted');
        if (!isGranted) {
            setShowDisclaimer(true);
        }
    }, []);

    const handleAccept = () => {
        sessionStorage.setItem('cflix_access_granted', 'true');
        setShowDisclaimer(false);
    };

    if (!showDisclaimer) return null;

    return (
        <div className={cx('disclaimer-modal')}>
            <div className={cx('overlay')} onClick={handleAccept}></div>
            <div className={cx('disclaimer-content')}>
                <button className={cx('close-btn')} onClick={handleAccept} aria-label="Close">
                    &times;
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
                <div className={cx('button-container')}>
                    <Button primary className={cx('btn-accept')} onClick={handleAccept}>
                        Đã hiểu
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default DisclaimerModal;

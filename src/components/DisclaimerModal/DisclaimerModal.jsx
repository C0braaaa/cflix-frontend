import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Button from '../Button/index-button';
import styles from './DisclaimerModal.module.scss';
// [ACCESS_KEY] Uncomment to enable access key verification
// import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function DisclaimerModal() {
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    // [ACCESS_KEY] Uncomment to enable access key verification
    // const [accessKey, setAccessKey] = useState('');

    useEffect(() => {
        const isGranted = sessionStorage.getItem('cflix_access_granted');
        if (!isGranted) {
            setShowDisclaimer(true);
        }
    }, []);

    // [ACCESS_KEY] Uncomment to enable access key verification
    // const handleSubmitKey = () => {
    //     const envKey = import.meta.env.VITE_ACCESS_KEY;
    //     if (accessKey === envKey) {
    //         sessionStorage.setItem('cflix_access_granted', 'true');
    //         setShowDisclaimer(false);
    //         toast.success('Truy cập thành công!');
    //     } else {
    //         toast.error('Mã truy cập không chính xác!');
    //     }
    // };

    // [ACCESS_KEY] Uncomment to enable access key verification
    // const handleKeyDown = (e) => {
    //     if (e.key === 'Enter') {
    //         handleSubmitKey();
    //     }
    // };

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

                {/* [ACCESS_KEY] Uncomment this block and remove the "Đã hiểu" section below to enable access key verification */}
                {/* <p>Vui lòng nhập mã truy cập gồm 6 chữ số để tiếp tục trải nghiệm hệ thống của chúng tôi.</p>
                <div className={cx('access-key-container')}>
                    <input
                        type="text"
                        maxLength="6"
                        placeholder="000000"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={cx('access-key-input')}
                    />
                    <Button primary className={cx('btn-submit')} onClick={handleSubmitKey}>
                        Xác nhận
                    </Button>
                </div> */}

                {/* [ACCESS_KEY] Remove this section when enabling access key verification */}
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

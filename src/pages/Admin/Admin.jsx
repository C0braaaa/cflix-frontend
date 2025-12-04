import { useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './Admin.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function DashBoard() {
    useEffect(() => {
        document.title = 'Dashboard - Admin';
    });

    return (
        <div className={cx('wrapper')}>
            <div className={cx('sidebar')}>
                <div className={cx('admin-info')}>
                    <div className={cx('avatar')}>
                        <img
                            src="https://media-cdn-v2.laodong.vn/storage/newsportal/2025/2/4/1458351/Ronaldo-1.jpg"
                            alt="avatar"
                        />
                    </div>
                    <div className={cx('name')}>Thanh Hieu</div>
                </div>
                <div className={cx('menu')}>
                    <div className={cx('menu-item')}>
                        <FontAwesomeIcon icon={faHome} />
                        <span className={cx('title')}>Trang Chu</span>
                    </div>
                </div>
            </div>
            <div className={cx('content')}></div>
        </div>
    );
}

export default DashBoard;

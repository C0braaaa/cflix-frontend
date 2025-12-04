import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useParams } from 'react-router-dom';

import styles from './UserPage.module.scss';
import {
    faClockRotateLeft,
    faHeart,
    faInfinity,
    faPlus,
    faRightFromBracket,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import Profile from './mainContent/Profile/Profile';

const cx = classNames.bind(styles);

function UserPage() {
    const { slug } = useParams();
    return (
        <div className={cx('wrapper')}>
            <div className={cx('sidebar')}>
                <h3 className={cx('sidebar__title')}>Quản lý tài khoản</h3>
                <div className={cx('sidebar__items')}>
                    <Link to="/user/favorite" className={cx('item', { active: slug === 'favorite' })}>
                        <FontAwesomeIcon icon={faHeart} />
                        <span>Yêu thích</span>
                    </Link>
                    <Link to="/user/playlist" className={cx('item', { active: slug === 'playlist' })}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Danh sách</span>
                    </Link>
                    <Link to="/user/xem-tiep" className={cx('item', { active: slug === 'xem-tiep' })}>
                        <FontAwesomeIcon icon={faClockRotateLeft} />
                        <span>Xem tiếp</span>
                    </Link>
                    <Link to="/user/profile" className={cx('item', { active: slug === 'profile' })}>
                        <FontAwesomeIcon icon={faUser} />
                        <span>Tài khoản</span>
                    </Link>
                </div>

                <div className={cx('sidebar__user')}>
                    <div className={cx('user-logo')}>
                        <img
                            src="//assets.manutd.com/AssetPicker/images/0/0/22/86/1464036/8_Bruno_Fernandes1751376440402.webp"
                            alt="user-logo"
                        />
                    </div>
                    <div className={cx('user-info')}>
                        <div className={cx('name-gender')}>
                            <p>C0bra</p>
                            <FontAwesomeIcon icon={faInfinity} />
                        </div>
                        <p>abcd1234@gmail.com</p>
                    </div>
                    <div className={cx('logout')}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        <span>Thoát</span>
                    </div>
                </div>
            </div>
            <div className={cx('main-content')}>
                {slug === 'favorite' && <p st> Yêu thích</p>}
                {slug === 'playlist' && <p>Danh sách</p>}
                {slug === 'xem-tiep' && <p>Xem tiếp</p>}
                {slug === 'profile' && <Profile />}
            </div>
        </div>
    );
}

export default UserPage;

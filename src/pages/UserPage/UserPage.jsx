import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { useAuth } from '../../features/auth/context/AuthContext';
import styles from './UserPage.module.scss';
import {
    faClockRotateLeft,
    faHeart,
    faInfinity,
    faMars,
    faPlus,
    faRightFromBracket,
    faUser,
    faVenus,
} from '@fortawesome/free-solid-svg-icons';
import Profile from './mainContent/Profile/Profile';

const cx = classNames.bind(styles);

function UserPage() {
    const { user, logout } = useAuth();
    const { slug } = useParams();
    const nevigate = useNavigate();

    if (!user) return null;

    const genderClass = user?.gender;

    const GENDER_ICONS = {
        male: faMars,
        female: faVenus,
        unknown: faInfinity,
    };
    const handleLogout = () => {
        logout();
        nevigate('/');
    };
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
                            src={user?.avatar_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                            alt={`${user?.username}-avatar`}
                        />
                    </div>
                    <div className={cx('user-info')}>
                        <div className={cx('name-gender')}>
                            <p>{user?.username}</p>
                            <FontAwesomeIcon icon={GENDER_ICONS[user?.gender]} className={cx(genderClass)} />
                        </div>
                        <p>{user?.email}</p>
                    </div>
                    <div className={cx('logout')} onClick={handleLogout}>
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

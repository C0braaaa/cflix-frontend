import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Admin.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faHome, faServer, faTableCellsLarge, faUser } from '@fortawesome/free-solid-svg-icons';
import { Overview, Users, Views } from './DashboardContents';
import { useAuth } from '../../features/auth/context/AuthContext';

const cx = classNames.bind(styles);

function DashBoard() {
    const { user } = useAuth();
    useEffect(() => {
        document.title = 'Dashboard - Admin';
    });

    const [activeMenu, setActiveMenu] = useState('overview');

    return (
        <div className={cx('wrapper')}>
            <header className={cx('header')}>
                <div className={cx('admin-options')}>
                    <div className={cx('admin-info')}>
                        <div className={cx('name')}>
                            <span className={cx('username')}>{user?.username}</span>
                            <span className={cx('desc')}>Administator</span>
                        </div>
                        <div className={cx('avatar')}>
                            <img src={user?.avatar_url || '/assets/images/defaultimg.jpg'} alt="avatar" />
                        </div>
                    </div>
                </div>
            </header>
            <div className={cx('sidebar')}>
                <div className={cx('logo')}>
                    <div className={cx('logo-img')}>
                        <img src="/assets/images/logo.png" alt="logo" />
                    </div>
                </div>
                <div className={cx('menu')}>
                    <div
                        className={cx('menu-item', { active: activeMenu === 'overview' })}
                        onClick={() => setActiveMenu('overview')}
                    >
                        <span className={cx('title')}>Tổng quan</span>
                        <FontAwesomeIcon icon={faTableCellsLarge} />
                    </div>
                    <div
                        className={cx('menu-item', { active: activeMenu === 'users' })}
                        onClick={() => setActiveMenu('users')}
                    >
                        <span className={cx('title')}>Danh sách người dùng</span>
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div
                        className={cx('menu-item', { active: activeMenu === 'view' })}
                        onClick={() => setActiveMenu('view')}
                    >
                        <span className={cx('title')}>Lượt xem</span>
                        <FontAwesomeIcon icon={faEye} />
                    </div>
                    <div
                        className={cx('menu-item', { active: activeMenu === 'api' })}
                        onClick={() => setActiveMenu('api')}
                    >
                        <span className={cx('title')}>APIs</span>
                        <FontAwesomeIcon icon={faServer} />
                    </div>
                    <Link to="/" className={cx('menu-link')} style={{ color: 'var(--text-black)' }}>
                        <div className={cx('menu-item')}>
                            <span className={cx('title')}>Trang chủ</span>
                            <FontAwesomeIcon icon={faHome} />
                        </div>
                    </Link>
                </div>
            </div>
            <div className={cx('content')}>
                {activeMenu === 'overview' && <Overview />}
                {activeMenu === 'users' && <Users />}
                {activeMenu === 'view' && <Views />}
            </div>
        </div>
    );
}

export default DashBoard;

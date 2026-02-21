import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Admin.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faHome, faServer, faTableCellsLarge, faUser } from '@fortawesome/free-solid-svg-icons';
import { Overview, Users, Views, Movies } from './DashboardContents';
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
                        <FontAwesomeIcon icon={faTableCellsLarge} />
                        <span className={cx('title')}>Tổng quan</span>
                    </div>
                    <div
                        className={cx('menu-item', { active: activeMenu === 'users' })}
                        onClick={() => setActiveMenu('users')}
                    >
                        <FontAwesomeIcon icon={faUser} />
                        <span className={cx('title')}>Danh sách người dùng</span>
                    </div>
                    <div
                        className={cx('menu-item', { active: activeMenu === 'movies' })}
                        onClick={() => setActiveMenu('movies')}
                    >
                        <FontAwesomeIcon icon={faFilm} />
                        <span className={cx('title')}>Phim</span>
                    </div>
                    <div
                        className={cx('menu-item', { active: activeMenu === 'api' })}
                        onClick={() => setActiveMenu('api')}
                    >
                        <FontAwesomeIcon icon={faServer} />
                        <span className={cx('title')}>APIs</span>
                    </div>
                    <hr />
                    <Link to="/" className={cx('menu-link')} style={{ color: 'var(--text-black)' }}>
                        <div className={cx('menu-item')}>
                            <FontAwesomeIcon icon={faHome} />
                            <span className={cx('title')}>Trang chủ</span>
                        </div>
                    </Link>
                </div>
            </div>
            <div className={cx('content')}>
                {activeMenu === 'overview' && <Overview />}
                {activeMenu === 'users' && <Users />}
                {activeMenu === 'view' && <Views />}
                {activeMenu === 'movies' && <Movies />}
            </div>
        </div>
    );
}

export default DashBoard;

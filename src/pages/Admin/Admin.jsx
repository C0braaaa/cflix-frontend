import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Admin.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFilm,
    faFlag,
    faHome,
    faMoon,
    faSun,
    faTableCellsLarge,
    faUser,
    faBars,
} from '@fortawesome/free-solid-svg-icons';
import { Overview, Users, Movies, Report } from './DashboardContents';
import { useAuth } from '../../features/auth/context/AuthContext';

const cx = classNames.bind(styles);

function DashBoard() {
    const { user } = useAuth();
    useEffect(() => {
        document.title = 'Dashboard - Admin';
        // document.documentElement.removeAttribute('data-theme');
    });

    const [activeMenu, setActiveMenu] = useState('overview');
    const [toggleTheme, setToggleTheme] = useState(() => {
        return localStorage.getItem('admin-theme') || 'dark';
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('admin-theme', toggleTheme);
    }, [toggleTheme]);

    return (
        <div className={cx('wrapper')} data-admin-theme={toggleTheme}>
            {isSidebarOpen && <div className={cx('backdrop')} onClick={() => setIsSidebarOpen(false)}></div>}
            <header className={cx('header')}>
                <div className={cx('toggle-sidebar')} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <FontAwesomeIcon icon={faBars} />
                </div>
                <div className={cx('toggle-theme')}>
                    <div className={cx('toggle')}>
                        <span
                            onClick={() => setToggleTheme('light')}
                            className={cx({ active: toggleTheme === 'light' })}
                        >
                            <FontAwesomeIcon icon={faSun} color="#FFD700" />
                        </span>
                        <span onClick={() => setToggleTheme('dark')} className={cx({ active: toggleTheme === 'dark' })}>
                            <FontAwesomeIcon icon={faMoon} />
                        </span>
                    </div>
                </div>
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
            <div className={cx('sidebar', { open: isSidebarOpen })}>
                <Link to="/" className={cx('logo')}>
                    <div className={cx('logo-img')}>
                        <img
                            src={toggleTheme === 'dark' ? '/assets/images/logo.png' : '/assets/images/logo_mau_den.png'}
                            alt="logo"
                        />
                    </div>
                </Link>
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
                        <span className={cx('title')}>Người dùng</span>
                    </div>
                    <div
                        className={cx('menu-item', { active: activeMenu === 'movies' })}
                        onClick={() => setActiveMenu('movies')}
                    >
                        <FontAwesomeIcon icon={faFilm} />
                        <span className={cx('title')}>Phim</span>
                    </div>
                    <div
                        className={cx('menu-item', { active: activeMenu === 'reports' })}
                        onClick={() => setActiveMenu('reports')}
                    >
                        <FontAwesomeIcon icon={faFlag} />
                        <span className={cx('title')}>Phản hồi</span>
                    </div>
                    {/* <div
                        className={cx('menu-item', { active: activeMenu === 'api' })}
                        onClick={() => setActiveMenu('api')}
                    >
                        <FontAwesomeIcon icon={faServer} />
                        <span className={cx('title')}>APIs</span>
                    </div> */}
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
                {/* {activeMenu === 'view' && <Views />} */}
                {activeMenu === 'movies' && <Movies />}
                {activeMenu === 'reports' && <Report />}
            </div>
        </div>
    );
}

export default DashBoard;

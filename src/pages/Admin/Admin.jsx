import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './Admin.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faMoon, faSun, faTableCellsLarge, faUser } from '@fortawesome/free-solid-svg-icons';
import { Overview, Users } from './DashboardContents';

const cx = classNames.bind(styles);

function DashBoard() {
    useEffect(() => {
        document.title = 'Dashboard - Admin';
    });

    const [activeMenu, setActiveMenu] = useState('overview');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'light';
    });

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('theme', newMode ? 'light' : 'dark');
    };

    return (
        <div className={cx('wrapper')} data-theme={isDarkMode ? 'dark' : 'light'}>
            <header className={cx('header')}>
                <Link to="/" className={cx('logo')}>
                    {isDarkMode ? (
                        <img src="/assets/images/logo.png" alt="logo-cflix" />
                    ) : (
                        <img src="/assets/images/logo_mau_den.png" alt="logo-cflix" />
                    )}
                </Link>
                <div className={cx('admin-options')}>
                    <div className={cx('admin-info')}>
                        <div className={cx('avatar')}>
                            <img
                                src="https://media-cdn-v2.laodong.vn/storage/newsportal/2025/2/4/1458351/Ronaldo-1.jpg"
                                alt="avatar"
                            />
                        </div>
                        <div className={cx('name')}>Thanh Hieu</div>
                        <div className={cx('toggle-theme')} onClick={toggleTheme}>
                            <div className={cx('slider', { active: !isDarkMode })}></div>

                            <div className={cx('icon-wrapper', { active: isDarkMode })}>
                                <FontAwesomeIcon icon={faMoon} />
                            </div>
                            <div className={cx('icon-wrapper', { active: !isDarkMode })}>
                                <FontAwesomeIcon icon={faSun} />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className={cx('sidebar')}>
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
                        <span className={cx('title')}>Danh sách users</span>
                        <FontAwesomeIcon icon={faUser} />
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
            </div>
        </div>
    );
}

export default DashBoard;

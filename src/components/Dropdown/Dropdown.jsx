import Tippy from '@tippyjs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Dropdown.module.scss';

const cx = classNames.bind(styles);

function Dropdown({
    label,
    name,
    data,
    type = null,
    showDropdown,
    setShowDropdown,
    closeMenu,
    userInfo,
    columns = 1,
    width = '20rem',
    height = 'auto',
}) {
    const isVisible = showDropdown === name;
    const isAdmin = true;

    const handleToggle = () => {
        setShowDropdown(isVisible ? null : name);
    };

    const handleHide = () => {
        setShowDropdown(null);
    };

    if (type === 'user') {
        return (
            <Tippy
                interactive
                offset={[-15, 0]}
                onClickOutside={handleHide}
                visible={isVisible}
                placement="bottom-end"
                render={(attrs) => (
                    <div className={cx('user-dropdown')} tabIndex="-1" {...attrs}>
                        <span className={cx('username')}>{userInfo?.name}</span>
                        <hr />
                        <div className={cx('user-menu-2')}>
                            {data
                                .filter((value) => {
                                    if (value.to === '/dashboard' && !isAdmin) {
                                        return false;
                                    }
                                    return true;
                                })
                                .map((value, index) => (
                                    <Link
                                        to={value.to}
                                        className={cx('user-menu-item')}
                                        key={index}
                                        onClick={handleHide}
                                    >
                                        <FontAwesomeIcon icon={value.icon} />
                                        <span>{value.name}</span>
                                    </Link>
                                ))}
                        </div>
                        <hr />
                        <div className={cx('user-logout')}>
                            <FontAwesomeIcon icon={faRightFromBracket} />
                            <span>Thoát</span>
                        </div>
                    </div>
                )}
            >
                <div className={cx('user')} onClick={handleToggle}>
                    <div className={cx('avatar')}>
                        <img src={userInfo?.avatar} alt="avatar" className={cx('avatar-img')} />
                    </div>
                    <div className={cx('arrow-down')}>
                        <FontAwesomeIcon icon={faCaretDown} />
                    </div>
                </div>
            </Tippy>
        );
    }

    return (
        <Tippy
            interactive
            visible={isVisible}
            onClickOutside={handleHide}
            placement="bottom-start"
            render={(attrs) => (
                <div
                    className={cx('dropdown-list', `grid-${columns}`)}
                    style={{ width, height }}
                    tabIndex="-1"
                    {...attrs}
                >
                    {data.map((item, i) => (
                        <Link
                            key={i}
                            to={item.to}
                            className={cx('dropdown-item')}
                            onClick={() => {
                                handleHide();
                                closeMenu && closeMenu();
                            }}
                        >
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>
            )}
        >
            <div className={cx('menu-item-toggle')} onClick={handleToggle}>
                {label}
                <FontAwesomeIcon icon={faCaretDown} />
            </div>
        </Tippy>
    );
}

export default Dropdown;

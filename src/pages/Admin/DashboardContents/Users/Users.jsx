import classNames from 'classnames/bind';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faSearch } from '@fortawesome/free-solid-svg-icons';

import styles from './Users.module.scss';
const cx = classNames.bind(styles);
function Users() {
    const [showDropdown, setShowDropdown] = useState(false);

    const data = [
        {
            id: 1,
            avatar: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2025/2/4/1458351/Ronaldo-1.jpg',
            name: 'Thanh Hiếu',
            role: 'Admin',
            status: 'Online',
            createDate: '2025/12/15 03:06:36',
        },
        {
            id: 2,
            avatar: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2025/2/4/1458351/Ronaldo-1.jpg',
            name: 'Thanh Hiếu',
            role: 'User',
            status: 'Offline',
            createDate: '2025/12/15 03:06:36',
        },
    ];

    const handleToggleDropdown = (userId) => {
        setShowDropdown((prev) => (prev === userId ? null : userId));
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <div className={cx('filter-btn')}>
                    <button type="button" className={cx('btn', 'active')}>
                        Tất cả
                    </button>
                    <button type="button" className={cx('btn')}>
                        Admin
                    </button>
                    <button type="button" className={cx('btn')}>
                        User
                    </button>
                    <button type="button" className={cx('btn')}>
                        Online
                    </button>
                    <button type="button" className={cx('btn')}>
                        Offline
                    </button>
                </div>
                <div className={cx('search')}>
                    <input type="text" placeholder="Tìm kiếm user..." className={cx('search-input')} />
                    <div className={cx('search-icon')}>
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                </div>
            </div>
            <table border="0" cellPadding="10" cellSpacing="0" className={cx('table')}>
                <thead className={cx('table-head')}>
                    <tr>
                        <th>STT</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Create Date</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody className={cx('table-body')}>
                    {data.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>
                                <div className={cx('avatar')}>
                                    <img src={user.avatar} alt="avatar" />
                                </div>
                            </td>
                            <td>{user.name}</td>
                            <td>thanhhieu1512@gmail.com</td>
                            <td>
                                <span className={cx(user.role.toLowerCase())}>{user.role}</span>
                            </td>
                            <td>
                                <span className={cx(user.status.toLowerCase())}>{user.status}</span>
                            </td>
                            <td>{user.createDate}</td>
                            <td>
                                <div className={cx('actions')}>
                                    <FontAwesomeIcon icon={faGear} onClick={() => handleToggleDropdown(user.id)} />
                                    {showDropdown === user.id && (
                                        <div className={cx('dropdown-test')}>
                                            <h1>ABCDSA</h1>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Users;

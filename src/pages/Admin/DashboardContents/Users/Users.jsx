import classNames from 'classnames/bind';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faPen, faSearch, faTrash } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '../../../../components/Button/index-button';
import styles from './Users.module.scss';
const cx = classNames.bind(styles);

const validationSchema = yup.object().shape({
    username: yup
        .string()
        .required('Vui lòng nhập tên hiển thị')
        .min(6, 'Ten hien thong phai co it nhat 6 ky tu')
        .max(20, 'Ten hien thong khong vuot qua 20 ky tu'),
});
function Users() {
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [edittingUSer, setEdittingUSer] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const onSubmit = (data) => {
        console.log('Dữ liệu form:', data);
    };

    const handleCloseMenu = () => {
        setActiveMenuId(null);
    };

    const handleShewEdittingUSer = () => {
        setEdittingUSer((prev) => !prev);
        setActiveMenuId(null);
    };

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
        {
            id: 3,
            avatar: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2025/2/4/1458351/Ronaldo-1.jpg',
            name: 'Thanh Hiếu',
            role: 'User',
            status: 'Offline',
            createDate: '2025/12/15 03:06:36',
        },
        {
            id: 5,
            avatar: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2025/2/4/1458351/Ronaldo-1.jpg',
            name: 'Thanh Hiếu',
            role: 'User',
            status: 'Offline',
            createDate: '2025/12/15 03:06:36',
        },
        {
            id: 6,
            avatar: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2025/2/4/1458351/Ronaldo-1.jpg',
            name: 'Thanh Hiếu',
            role: 'User',
            status: 'Offline',
            createDate: '2025/12/15 03:06:36',
        },
        {
            id: 7,
            avatar: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2025/2/4/1458351/Ronaldo-1.jpg',
            name: 'Thanh Hiếu',
            role: 'User',
            status: 'Offline',
            createDate: '2025/12/15 03:06:36',
        },
        {
            id: 8,
            avatar: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2025/2/4/1458351/Ronaldo-1.jpg',
            name: 'Thanh Hiếu',
            role: 'User',
            status: 'Offline',
            createDate: '2025/12/15 03:06:36',
        },
        {
            id: 9,
            avatar: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2025/2/4/1458351/Ronaldo-1.jpg',
            name: 'Thanh Hiếu',
            role: 'User',
            status: 'Offline',
            createDate: '2025/12/15 03:06:36',
        },
    ];

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
                                    <Tippy
                                        interactive
                                        visible={activeMenuId === user.id}
                                        placement="bottom-end"
                                        arrow={false}
                                        offset={[30, 5]}
                                        onClickOutside={handleCloseMenu}
                                        render={(attrs) => (
                                            <>
                                                <div className={cx('dropdown-actions')} tabIndex="-1" {...attrs}>
                                                    <div className={cx('dropdown-item')}>
                                                        <FontAwesomeIcon icon={faTrash} />
                                                        <span>Xóa</span>
                                                    </div>
                                                    <div
                                                        className={cx('dropdown-item')}
                                                        onClick={handleShewEdittingUSer}
                                                    >
                                                        <FontAwesomeIcon icon={faPen} />
                                                        <span>Chỉnh sửa</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    >
                                        {/* Trigger element */}
                                        <div
                                            className={cx('gear-icon', { active: activeMenuId === user.id })}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuId(activeMenuId === user.id ? null : user.id);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faGear} />
                                        </div>
                                    </Tippy>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {edittingUSer && <div className={cx('overlay-users')} onClick={() => setEdittingUSer(false)}></div>}
            {edittingUSer && (
                <div className={cx('modal-edit')}>
                    <form className={cx('edit-form')} onSubmit={handleSubmit(onSubmit)}>
                        <span className={cx('close')} onClick={() => setEdittingUSer(false)}>
                            &times;
                        </span>
                        <div className={cx('form-group')}>
                            <label htmlFor="ID">ID</label>
                            <input id="ID" className={cx('form-control')} type="text" value="1" disabled />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="email">Email</label>
                            <input id="email" className={cx('form-control')} type="text" value="test" disabled />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="username">Tên hiển thị</label>
                            <input
                                id="username"
                                className={cx('form-control', { invalid: errors.username })}
                                type="text"
                                placeholder="Tên hiển thị"
                                {...register('username')}
                            />
                            {errors.username && <span className={cx('form-message')}>{errors.username.message}</span>}
                        </div>
                        <div className={cx('btn-update')}>
                            <Button type="submit" primary className={cx('btn')}>
                                Cập nhật
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Users;

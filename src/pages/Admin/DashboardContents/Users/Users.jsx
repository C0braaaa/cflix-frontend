import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleXmark,
    faGear,
    faLock,
    faPen,
    faSearch,
    faTrash,
    faUnlock,
    faWarning,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import Button from '../../../../components/Button/index-button';
import styles from './Users.module.scss';
import { getAllUSersAPI, updateUserByIDAPI } from '../../../../services/authServices';
const cx = classNames.bind(styles);

const validationSchema = yup.object().shape({
    username: yup
        .string()
        .required('Vui lòng nhập tên hiển thị')
        .min(6, 'Tên hiển thị phải có ít nhất 6 ký tự')
        .max(20, 'Tên hiển thị không vượt quá 20 ký tự'),
    role: yup.string().required('Vui lòng chọn quyen'),
});
function Users() {
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [edittingUSer, setEdittingUSer] = useState(false);
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState('');
    const [isActive, setIsActive] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [submittingSearch, setSubmittingSearch] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });
    const onSubmit = (data) => {
        console.log('ID cần sửa:', edittingUSer._id);
        console.log('Dữ liệu mới:', data);
    };

    const handleToggleActive = async (user) => {
        try {
            const newStatus = !user.isActive;

            await updateUserByIDAPI(user._id, {
                isActive: newStatus,
            });
            toast.success(newStatus ? 'Mở khóa tài khoản thành công' : 'Khóa tài khoản thành công');
            setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, isActive: newStatus } : u)));
        } catch (error) {
            console.error('Update user failed:', error);
            toast.error(error?.response?.data?.message || 'Cập nhật trạng thái thất bại');
        }
    };

    const handleCloseMenu = () => {
        setActiveMenuId(null);
    };

    const handleShowEdittingUSer = (user) => {
        setEdittingUSer(user); // Lưu user đang chọn vào state
        setActiveMenuId(null); // Đóng menu dropdown
    };

    const handleSearch = () => {
        setSubmittingSearch(searchTerm);
    };

    const handleDeleteValue = () => {
        setSearchTerm('');
        setSubmittingSearch('');
    };

    // reset username
    useEffect(() => {
        if (edittingUSer) {
            reset({
                username: edittingUSer.username,
                role: edittingUSer.role,
                isActive: edittingUSer.isActive,
            });
        }
    }, [edittingUSer, reset]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getAllUSersAPI(submittingSearch, role, isActive);
                setUsers(res.users);
            } catch (error) {
                console.log(error);
            }
        };
        fetchUsers();
    }, [submittingSearch, role, isActive]);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <div className={cx('filter-btn')}>
                    <button
                        type="button"
                        className={cx('btn', { active: role === '' && !isActive })}
                        onClick={() => {
                            setRole('');
                            setIsActive();
                        }}
                    >
                        Tất cả
                    </button>
                    <button
                        type="button"
                        className={cx('btn', { active: role === 'admin' })}
                        onClick={() => setRole('admin')}
                    >
                        Admin
                    </button>
                    <button
                        type="button"
                        className={cx('btn', { active: role === 'user' })}
                        onClick={() => setRole('user')}
                    >
                        User
                    </button>
                    <button
                        type="button"
                        className={cx('btn', { active: isActive === true })}
                        onClick={() => setIsActive(true)}
                    >
                        Normal
                    </button>
                    <button
                        type="button"
                        className={cx('btn', { active: isActive === false })}
                        onClick={() => setIsActive(false)}
                    >
                        Lock
                    </button>
                </div>
                <div className={cx('search')}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm user..."
                        value={searchTerm}
                        className={cx('search-input')}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm !== '' && (
                        <div className={cx('delete-value')} onClick={handleDeleteValue}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </div>
                    )}
                    <div className={cx('search-icon')} onClick={handleSearch}>
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
                        <th>isActive</th>
                        <th>Create Date</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody className={cx('table-body')}>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>
                                <div className={cx('avatar')}>
                                    <img src={user.avatar_url} alt={user.username} />
                                </div>
                            </td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <span className={cx(user.role)}>{user.role}</span>
                            </td>
                            <td>
                                <span className={cx('isActive')}>
                                    {user.isActive ? (
                                        <FontAwesomeIcon icon={faUnlock} />
                                    ) : (
                                        <FontAwesomeIcon icon={faLock} />
                                    )}
                                </span>
                            </td>
                            <td>{user.createdAt.slice(0, 10)}</td>
                            <td>
                                <div className={cx('actions')}>
                                    <Tippy
                                        interactive
                                        visible={activeMenuId === user._id}
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
                                                        onClick={() => handleToggleActive(user)}
                                                    >
                                                        {user.isActive ? (
                                                            <>
                                                                <FontAwesomeIcon icon={faLock} />
                                                                <span>Khóa</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FontAwesomeIcon icon={faUnlock} />
                                                                <span>Mở khóa</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div
                                                        className={cx('dropdown-item')}
                                                        onClick={() => handleShowEdittingUSer(user)}
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
                                            className={cx('gear-icon', { active: activeMenuId === user._id })}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveMenuId(activeMenuId === user._id ? null : user._id);
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
            {users.length === 0 && (
                <div className={cx('no-data')}>
                    <FontAwesomeIcon icon={faWarning} />
                    <p>Không tìm thấy dữ liệu!</p>
                </div>
            )}
            {edittingUSer && <div className={cx('overlay-users')} onClick={() => setEdittingUSer(false)}></div>}
            {edittingUSer && (
                <div className={cx('modal-edit')}>
                    <form className={cx('edit-form')} onSubmit={handleSubmit(onSubmit)}>
                        <span className={cx('close')} onClick={() => setEdittingUSer(false)}>
                            &times;
                        </span>
                        <div className={cx('form-group')}>
                            <label htmlFor="ID">ID</label>
                            <input
                                id="ID"
                                className={cx('form-control')}
                                type="text"
                                value={edittingUSer._id}
                                disabled
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                className={cx('form-control')}
                                type="text"
                                value={edittingUSer.email}
                                disabled
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="role">Role</label>
                            <select name="role" id="role" className={cx('role')} defaultValue={edittingUSer.role}>
                                <option value="admin">admin</option>
                                <option value="user">user</option>
                            </select>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="username">Tên hiển thị</label>
                            <input
                                id="username"
                                className={cx('form-control', { invalid: errors.username })}
                                type="text"
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

import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faArrowRight,
    faBan,
    faCircleXmark,
    faGear,
    faLock,
    faPen,
    faSearch,
    faSpinner,
    faTrash,
    faUnlock,
    faUserCheck,
    faUserPlus,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import Button from '../../../../components/Button/index-button';
import styles from './Users.module.scss';
import { updateUserByIDAPI, deleteUserAPI } from '../../../../services/userServices';
import { getAllUSersAPI } from '../../../../services/userServices';
import { useAuth } from '../../../../features/auth/context/AuthContext';
const cx = classNames.bind(styles);
const ITEMS_PER_PAGE = 10;

const validationSchema = yup.object().shape({
    username: yup
        .string()
        .required('Vui lòng nhập tên hiển thị')
        .min(6, 'Tên hiển thị phải có ít nhất 6 ký tự')
        .max(20, 'Tên hiển thị không vượt quá 20 ký tự'),
    role: yup.string().required('Vui lòng chọn quyen'),
});
function Users() {
    const { user: currentUser } = useAuth();
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [edittingUSer, setEdittingUSer] = useState(false);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState([]);
    const [role, setRole] = useState('');
    const [isActive, setIsActive] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [submittingSearch, setSubmittingSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });
    const onSubmit = async (data) => {
        try {
            await updateUserByIDAPI(edittingUSer._id, {
                username: data.username,
                role: data.role,
            });

            toast.success('Cập nhật user thành công');

            setUsers((prev) =>
                prev.map((u) => (u._id === edittingUSer._id ? { ...u, username: data.username, role: data.role } : u)),
            );
            setEdittingUSer(false);
        } catch (error) {
            console.error('Update info failed:', error);
            toast.error(error?.response?.data?.message || 'Cập nhật thất bại');
        }
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

    const handleDeleteUser = async () => {
        if (!confirmDelete || !confirmDelete._id) return;

        try {
            await deleteUserAPI(confirmDelete._id);

            toast.success('Xóa user thành công');

            setUsers((prev) => prev.filter((u) => u._id !== confirmDelete._id));

            setConfirmDelete(false);
        } catch (error) {
            console.error('Delete user failed:', error);
            toast.error(error?.response?.data?.message || 'Xóa người dùng thất bại');
        }
    };

    const handleShowEdittingUSer = (user) => {
        setEdittingUSer(user); // Lưu user đang chọn vào state
        setActiveMenuId(null); // Đóng menu dropdown
    };

    const handleShowDeleteUser = (user) => {
        setConfirmDelete(user);
        setActiveMenuId(null);
    };

    const handleSearch = () => {
        setSubmittingSearch(searchTerm);
        setCurrentPage(1);
    };

    const handleDeleteValue = () => {
        setSearchTerm('');
        setSubmittingSearch('');
        setCurrentPage(1);
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
                setLoading(true);
                const res = await getAllUSersAPI(submittingSearch, role, isActive, currentPage, 10);
                setUsers(res.users);
                setStats(res);
                setCurrentPage(res.currentPage);
                setTotalPages(res.totalPages);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [submittingSearch, role, isActive, currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('stat-cards')}>
                <div className={cx('card')}>
                    <div className={cx('card-icon')}>
                        <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <span className={cx('card-title')}>Tổng người dùng</span>
                    <span className={cx('card-value')}>
                        {stats.totalUsers === undefined ? <FontAwesomeIcon icon={faSpinner} spin /> : stats.totalUsers}
                    </span>
                </div>
                <div className={cx('card')}>
                    <div className={cx('card-icon')}>
                        <FontAwesomeIcon icon={faUserCheck} />
                    </div>
                    <span className={cx('card-title')}>Đang hoạt động</span>
                    <span className={cx('card-value')}>
                        {stats.totalActive === undefined ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                            stats.totalActive
                        )}
                    </span>
                </div>
                <div className={cx('card')}>
                    <div className={cx('card-icon')}>
                        <FontAwesomeIcon icon={faLock} />
                    </div>
                    <span className={cx('card-title')}>Bị khóa</span>
                    <span className={cx('card-value')}>
                        {stats.totalInactive === undefined ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                            stats.totalInactive
                        )}
                    </span>
                </div>
                <div className={cx('card')}>
                    <div className={cx('card-icon')}>
                        <FontAwesomeIcon icon={faUserPlus} />
                    </div>
                    <span className={cx('card-title')}>Mới hôm nay</span>
                    <span className={cx('card-value')}>
                        {stats.totalNewToday === undefined ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                            stats.totalNewToday
                        )}
                    </span>
                </div>
            </div>
            <div className={cx('heading')}>
                <div className={cx('filter-btn')}>
                    <div className={cx('all')}>
                        <button
                            type="button"
                            className={cx('btn', { active: role === '' && !isActive })}
                            onClick={() => {
                                setRole('');
                                setIsActive();
                                setCurrentPage(1);
                            }}
                        >
                            Tất cả
                        </button>
                    </div>
                    <div className={cx('roles')}>
                        <span>Vai trò: </span>
                        <button
                            type="button"
                            className={cx('btn', { active: role === 'admin' })}
                            onClick={() => {
                                setRole('admin');
                                setCurrentPage(1);
                            }}
                        >
                            Admin
                        </button>
                        <button
                            type="button"
                            className={cx('btn', { active: role === 'user' })}
                            onClick={() => {
                                setRole('user');
                                setCurrentPage(1);
                            }}
                        >
                            User
                        </button>
                    </div>
                    <div className={cx('status')}>
                        <span>Trạng thái: </span>
                        <button
                            type="button"
                            className={cx('btn', { active: isActive === true })}
                            onClick={() => {
                                setIsActive(true);
                                setCurrentPage(1);
                            }}
                        >
                            Hoạt động
                        </button>
                        <button
                            type="button"
                            className={cx('btn', { active: isActive === false })}
                            onClick={() => {
                                setIsActive(false);
                                setCurrentPage(1);
                            }}
                        >
                            Bị khóa
                        </button>
                    </div>
                </div>
                <div className={cx('search')}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm user..."
                        value={searchTerm}
                        className={cx('search-input')}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
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
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody className={cx('table-body')}>
                    {loading ? (
                        <tr className={cx('loader')}></tr>
                    ) : (
                        users
                            ?.filter((user) => user._id !== currentUser?._id)
                            ?.map((user, index) => {
                                const indexNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                                return (
                                    <tr key={user._id}>
                                        <td>{indexNumber}</td>
                                        <td>
                                            <div className={cx('avatar')}>
                                                <img
                                                    src={user.avatar_url}
                                                    alt={user.username}
                                                    referrerPolicy="no-referrer"
                                                />
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
                                                    <FontAwesomeIcon icon={faUnlock} style={{ color: '#059669' }} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faLock} style={{ color: '#D97706' }} />
                                                )}
                                            </span>
                                        </td>
                                        <td>{user.createdAt.slice(0, 10)}</td>
                                        <td>
                                            <div className={cx('actions')}>
                                                <Tippy
                                                    interactive
                                                    trigger="click"
                                                    placement="bottom-end"
                                                    arrow={false}
                                                    offset={[30, 5]}
                                                    onShow={() => setActiveMenuId(user._id)}
                                                    onHide={() =>
                                                        setActiveMenuId((prev) => (prev === user._id ? null : prev))
                                                    }
                                                    render={(attrs) => (
                                                        <>
                                                            {user.role !== 'admin' ? (
                                                                <div
                                                                    className={cx('dropdown-actions')}
                                                                    tabIndex="-1"
                                                                    {...attrs}
                                                                >
                                                                    <div
                                                                        className={cx('dropdown-item')}
                                                                        onClick={() => handleShowDeleteUser(user)}
                                                                    >
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
                                                            ) : (
                                                                <div
                                                                    className={cx('dropdown-actions')}
                                                                    tabIndex="-1"
                                                                    {...attrs}
                                                                >
                                                                    <div className={cx('dropdown-item')}>
                                                                        <FontAwesomeIcon icon={faBan} />
                                                                        <span>Not Allowed</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                >
                                                    {/* Trigger element */}
                                                    <div
                                                        className={cx('gear-icon', {
                                                            active: activeMenuId === user._id,
                                                        })}
                                                    >
                                                        <FontAwesomeIcon icon={faGear} />
                                                    </div>
                                                </Tippy>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                    )}
                </tbody>
            </table>
            {totalPages > 1 && (
                <div className={cx('pagination-wrapper')}>
                    <div className={cx('pagination')}>
                        <button
                            className={cx('page-btn')}
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <span className={cx('page-info')}>
                            Trang {currentPage} / {totalPages}
                        </span>
                        <button
                            className={cx('page-btn')}
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                </div>
            )}
            {users.length === 0 && (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '3rem 0',
                        fontSize: '1.6rem',
                        color: 'var(--text-black)',
                        backgroundColor: 'var(--warning-color)',
                        fontWeight: 'bold',
                    }}
                >
                    Không có dữ liệu hiển thị!
                </div>
            )}
            {edittingUSer && <div className={cx('overlay-users')} onClick={() => setEdittingUSer(false)}></div>}
            {confirmDelete && <div className={cx('overlay-delete')} onClick={() => setConfirmDelete(false)}></div>}
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
                            <select
                                name="role"
                                id="role"
                                className={cx('role')}
                                {...register('role')}
                                defaultValue={edittingUSer.role}
                            >
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
            {confirmDelete && (
                <div className={cx('confirm-delete')}>
                    <div className={cx('delete-box')}>
                        <span className={cx('close-confirm-delete')} onClick={() => setConfirmDelete(false)}>
                            &times;
                        </span>
                        <p className={cx('title')}>
                            Xác nhận xóa người dùng <strong>{confirmDelete.username}</strong>
                        </p>
                        <div className={cx('delete-btn')}>
                            <Button primary className={cx('btn')} onClick={handleDeleteUser}>
                                Xóa
                            </Button>
                            <Button primary className={cx('btn')} onClick={() => setConfirmDelete(false)}>
                                Hủy
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Users;

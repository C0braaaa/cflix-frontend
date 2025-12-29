import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import styles from './Users.module.scss';
const cx = classNames.bind(styles);
function Users() {
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
                </div>
                <div className={cx('search')}>
                    <input type="text" placeholder="Tìm kiếm user..." className={cx('search-input')} />
                    <div className={cx('search-icon')}>
                        <FontAwesomeIcon icon={faSearch} />
                    </div>
                </div>
            </div>
            <table border="1" cellpadding="10" cellspacing="0">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên Phim</th>
                        <th>Thể Loại</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Iron Man</td>
                        <td>Hành động</td>
                        <td>Công chiếu</td>
                        <td>
                            <button>Sửa</button>
                        </td>
                    </tr>

                    <tr>
                        <td>2</td>
                        <td>Titanic</td>
                        <td>Tình cảm</td>
                        <td>Đã ẩn</td>
                        <td>
                            <button>Sửa</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Users;

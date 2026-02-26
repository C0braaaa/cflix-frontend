import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import {
    faAngleDown,
    faAngleUp,
    faClapperboard,
    faClipboardCheck,
    faClipboardList,
    faCommentDots,
    faSpinner,
    faUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';

import styles from './Report.module.scss';
import { getStatsReportsAPI } from '../../../../services/reportService';
const cx = classNames.bind(styles);

function Report() {
    const [stats, setStats] = useState([]);
    const [expanded, setExpanded] = useState(false);
    // const [type, setType] = useState('');

    useEffect(() => {
        const getStats = async () => {
            try {
                const res = await getStatsReportsAPI();
                setStats(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getStats();
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('stats')}>
                <div className={cx('stat__card')}>
                    <div className={cx('stat__info')}>
                        <h3 className={cx('stat__title')}>Tổng số phản hồi</h3>
                        <span className={cx('stat__number')}>
                            {stats?.totalReport !== undefined ? (
                                stats?.totalReport
                            ) : (
                                <FontAwesomeIcon icon={faSpinner} spin />
                            )}
                        </span>
                    </div>
                    <div className={cx('stat__icon')}>
                        <FontAwesomeIcon icon={faClipboardList} />
                    </div>
                </div>
                <div className={cx('stat__card')}>
                    <div className={cx('stat__info')}>
                        <h3 className={cx('stat__title')}>Chờ xử lý</h3>
                        <span className={cx('stat__number')}>
                            {stats?.pendingReport !== undefined ? (
                                stats?.pendingReport
                            ) : (
                                <FontAwesomeIcon icon={faSpinner} spin />
                            )}
                        </span>
                    </div>
                    <div className={cx('stat__icon')}>
                        <FontAwesomeIcon icon={faClipboardCheck} />
                    </div>
                </div>
                <div className={cx('stat__card')}>
                    <div className={cx('stat__info')}>
                        <h3 className={cx('stat__title')}>Báo lỗi phim</h3>
                        <span className={cx('stat__number')}>
                            {stats?.movieReport !== undefined ? (
                                stats?.movieReport
                            ) : (
                                <FontAwesomeIcon icon={faSpinner} spin />
                            )}
                        </span>
                    </div>
                    <div className={cx('stat__icon')}>
                        <FontAwesomeIcon icon={faClapperboard} />
                    </div>
                </div>
                <div className={cx('stat__card')}>
                    <div className={cx('stat__info')}>
                        <h3 className={cx('stat__title')}>Báo cáo bình luận</h3>
                        <span className={cx('stat__number')}>
                            {stats?.commentReport !== undefined ? (
                                stats?.commentReport
                            ) : (
                                <FontAwesomeIcon icon={faSpinner} spin />
                            )}
                        </span>
                    </div>
                    <div className={cx('stat__icon')}>
                        <FontAwesomeIcon icon={faCommentDots} />
                    </div>
                </div>
            </div>
            <div className={cx('filters')}>
                <div className={cx('filter__type')}>
                    <h4>Loại phản hồi:</h4>
                    <span className={cx('active')}>Tất cả</span>
                    <span>Phim</span>
                    <span>Bình luận</span>
                </div>
            </div>
            <div className={cx('reports-list')}>
                <div className={cx('report-item', { expanded: expanded })}>
                    <div className={cx('report-item__heading')}>
                        <div className={cx('heading-left')}>
                            <div className={cx('type')}>Báo lỗi phim</div>
                            <div className={cx('stt')}>#1</div>
                        </div>
                        <div className={cx('heading-right')}>
                            <div className={cx('status-pending')}>CHỜ XỬ LÍ</div>
                            <div className={cx('access')}>
                                Truy cập <FontAwesomeIcon icon={faUpRightFromSquare} />
                            </div>
                            <div className={cx('expand')} onClick={() => setExpanded((prev) => !prev)}>
                                {expanded ? (
                                    <FontAwesomeIcon icon={faAngleUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faAngleDown} style={{ color: 'var(--primary-color)' }} />
                                )}
                            </div>
                        </div>
                    </div>
                    <table className={cx('report-table')} cellPadding="0" cellSpacing="0">
                        <thead className={cx('table-header')}>
                            <tr>
                                <th>Người gửi</th>
                                <th>Slug</th>
                                <th>Tập phim</th>
                                <th>Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody className={cx('table-body')}>
                            <tr>
                                <td>Thanh Hiếu</td>
                                <td>sup-do-phan-2</td>
                                <td>Tập 2</td>
                                <td>2026/02/26</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={cx('report-item__reasons')}>
                        <span className={cx('reasons-title')}>Lý do</span>
                        <div className={cx('reasons-list')}>
                            <span className={cx('reason')}>Không xem được</span>
                            <span className={cx('reason')}>Không xem được</span>
                            <span className={cx('reason')}>Không xem được</span>
                        </div>
                    </div>
                    <div className={cx('report-item__details')}>
                        <span className={cx('details-title')}>Lý do chi tiết</span>
                        <textarea
                            name="details"
                            id="details"
                            value={'phim nay bị cai gi rồi bạn ơi'}
                            readOnly
                            rows={4}
                            className={cx('details-textarea')}
                        />
                    </div>
                    <div className={cx('report-item__actions')}>
                        <button className={cx('action-btn')}>Xóa phản hồi</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Report;

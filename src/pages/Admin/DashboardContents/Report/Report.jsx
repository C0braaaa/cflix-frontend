import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import {
    faAngleDown,
    faAngleUp,
    faArrowLeft,
    faArrowRight,
    faCaretDown,
    faCaretUp,
    faClapperboard,
    faClipboardCheck,
    faClipboardList,
    faCommentDots,
    faSpinner,
    faUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import styles from './Report.module.scss';
import {
    getStatsReportsAPI,
    getReportsAPI,
    deleteReportAPI,
    updateStatusAPI,
} from '../../../../services/reportService';
const cx = classNames.bind(styles);

const ITEMS_PER_PAGE = 10;
function Report() {
    const [stats, setStats] = useState([]);
    const [expanded, setExpanded] = useState('');
    const [expandedStatus, setExpandedStatus] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isChangeStatus, setIsChangeStatus] = useState('');

    const listStatus = [
        {
            name: 'Chờ xử lý',
            value: 'pending',
        },
        {
            name: 'Đang xử lý',
            value: 'processing',
        },
        {
            name: 'Đã xử lý',
            value: 'resolved',
        },
    ];

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    //Get stats
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
    }, [reports]);

    // get reports
    useEffect(() => {
        const getReports = async () => {
            try {
                setLoading(true);
                const res = await getReportsAPI(currentPage, type, status);
                setReports(res?.data);
                setTotalPages(res?.pagination?.totalPages);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        getReports();
    }, [currentPage, type, status]);

    // delete report
    const handleDeleteReport = async (id) => {
        try {
            const res = await deleteReportAPI(id);
            if (res && res.status) {
                toast.success('Xóa phản hồi thành công!');
                setReports((prev) => prev.filter((report) => report._id !== id));
            }
        } catch (error) {
            console.log(error);
        }
    };

    // update status
    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await updateStatusAPI(id, { status: status });
            if (res && res.status) {
                toast.success('Cập nhật trạng thái thành công!');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };
    const translateToVietNamese = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lý';
            case 'processing':
                return 'Đang xử lý';
            case 'resolved':
                return 'Đã xử lý';
            default:
                return '';
        }
    };
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
                    <span className={cx({ active: type === '' })} onClick={() => setType('')}>
                        Tất cả
                    </span>
                    <span className={cx({ active: type === 'movie' })} onClick={() => setType('movie')}>
                        Phim
                    </span>
                    <span className={cx({ active: type === 'comment' })} onClick={() => setType('comment')}>
                        Bình luận
                    </span>
                </div>
                <div className={cx('filter__status')}>
                    <h4>Trạng thái:</h4>
                    <span className={cx({ active: status === '' })} onClick={() => setStatus('')}>
                        Tất cả
                    </span>
                    <span className={cx({ active: status === 'pending' })} onClick={() => setStatus('pending')}>
                        Chờ xử lý
                    </span>
                    <span className={cx({ active: status === 'processing' })} onClick={() => setStatus('processing')}>
                        Đang xử lý
                    </span>
                    <span className={cx({ active: status === 'resolved' })} onClick={() => setStatus('resolved')}>
                        Đã xử lý
                    </span>
                </div>
            </div>
            <div className={cx('reports-list')}>
                {loading ? (
                    <div className={cx('loader')}></div>
                ) : (
                    reports?.map((rep, index) => {
                        const indexNumber = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                        return (
                            <div className={cx('report-item', { expanded: expanded === rep?._id })} key={rep?._id}>
                                <div className={cx('report-item__heading')}>
                                    <div className={cx('heading-left')}>
                                        <div className={cx('stt')}>{`#${indexNumber}`}</div>
                                        <div className={cx('type')}>
                                            {rep?.type === 'movie' ? 'Báo lỗi phim' : 'Báo cáo bình luận'}
                                        </div>
                                    </div>
                                    <div className={cx('heading-right')}>
                                        <div className={cx('status', { expanded: expandedStatus === rep?._id })}>
                                            <div
                                                className={cx(`status-${rep?.status}`)}
                                                onClick={() => {
                                                    setIsChangeStatus((prev) => (prev === rep?._id ? null : rep?._id));
                                                    setExpandedStatus((prev) => (prev === rep?._id ? null : rep?._id));
                                                }}
                                            >
                                                {translateToVietNamese(rep?.status)}
                                                {isChangeStatus === rep?._id ? (
                                                    <FontAwesomeIcon icon={faCaretUp} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faCaretDown} />
                                                )}
                                            </div>
                                            <div className={cx('list-status')}>
                                                {listStatus
                                                    .filter((item) => item.value !== rep?.status)
                                                    .map((item, index) => (
                                                        <span
                                                            key={index}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setReports((prev) =>
                                                                    prev.map((r) =>
                                                                        r._id === rep._id
                                                                            ? { ...r, status: item.value }
                                                                            : r,
                                                                    ),
                                                                );
                                                                handleUpdateStatus(rep._id, item.value);
                                                                setExpandedStatus('');
                                                                setIsChangeStatus('');
                                                            }}
                                                        >
                                                            {item.name}
                                                        </span>
                                                    ))}
                                            </div>
                                        </div>
                                        <Link className={cx('access')} to={`/phim/${rep?.movie_slug}`}>
                                            Truy cập <FontAwesomeIcon icon={faUpRightFromSquare} />
                                        </Link>
                                        <div
                                            className={cx('expand')}
                                            onClick={() => setExpanded((prev) => (prev === rep?._id ? null : rep?._id))}
                                        >
                                            {expanded !== rep?._id ? (
                                                <FontAwesomeIcon icon={faAngleDown} />
                                            ) : (
                                                <FontAwesomeIcon
                                                    icon={faAngleUp}
                                                    style={{ color: 'var(--primary-color)' }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <table className={cx('report-table')} cellPadding="0" cellSpacing="0">
                                    <thead className={cx('table-header')}>
                                        {rep?.type === 'movie' ? (
                                            <tr>
                                                <th>Người gửi</th>
                                                <th>Slug</th>
                                                <th>Tập phim</th>
                                                <th>Ngày tạo</th>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <th>Người gửi</th>
                                                <th>Slug</th>
                                                <th>Người bình luận</th>
                                                <th>Ngày tạo</th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody className={cx('table-body')}>
                                        {rep?.type === 'movie' ? (
                                            <tr>
                                                <td>{rep?.reporter_name}</td>
                                                <td>{rep?.movie_slug}</td>
                                                <td>{rep?.episode}</td>
                                                <td>{rep?.createdAt.slice(0, 10)}</td>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <td>{rep?.reporter_name}</td>
                                                <td>{rep?.movie_slug}</td>
                                                <td>{rep?.username}</td>
                                                <td>{rep?.createdAt.slice(0, 10)}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <div className={cx('report-item__reasons')}>
                                    <span className={cx('reasons-title')}>Lý do</span>
                                    <div className={cx('reasons-list')}>
                                        {rep?.reason?.map((rea, index) => (
                                            <span className={cx('reason')} key={index}>
                                                {rea}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className={cx('report-item__details')}>
                                    <span className={cx('details-title')}>Lý do chi tiết</span>
                                    <textarea
                                        name="details"
                                        id={`details-${rep?._id}`}
                                        value={rep?.details === '' ? 'N/A' : rep?.details}
                                        readOnly
                                        rows={4}
                                        className={cx('details-textarea')}
                                    />
                                </div>
                                <div
                                    className={cx('report-item__actions')}
                                    onClick={() => handleDeleteReport(rep?._id)}
                                >
                                    <button className={cx('action-btn')}>Xóa phản hồi</button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            {reports?.length === 0 && (
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
                            Trang {currentPage}/ {totalPages}
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
        </div>
    );
}

export default Report;

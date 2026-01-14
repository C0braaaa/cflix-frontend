import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faX } from '@fortawesome/free-solid-svg-icons';

import styles from './MainContents.module.scss';

const cx = classNames.bind(styles);

// Nhận thêm props 'api' (hàm lấy dữ liệu)
function MainContents({ title = '', api = null, apiToggle = null, field = '' }) {
    const formatDuration = (totalSeconds) => {
        const seconds = Math.round(totalSeconds);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}p` : `${m}p`;
    };

    // State lưu dữ liệu trang hiện tại
    const [movies, setMovies] = useState([]);
    const [isLoader, setIsLoader] = useState(true);

    // State pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Hàm gọi API lấy dữ liệu
    const fetchMovies = async (page) => {
        if (!api) return;

        try {
            setIsLoader(true);
            const limit = 18;

            const res = await api(page, limit);

            if (res && res.data) {
                setMovies(res.data.items);
                setTotalPages(res.data.totalPages);
                setTotalItems(res.data.totalItems);
                setCurrentPage(res.data.currentPage);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoader(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        fetchMovies(1);
        // eslint-disable-next-line
    }, [api]); // Khi props 'api' đổi (tức là đổi tab), gọi lại

    // Gọi API khi bấm chuyển trang
    useEffect(() => {
        fetchMovies(currentPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // eslint-disable-next-line
    }, [currentPage]);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleRemoved = async (e, item) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const res = await apiToggle({ slug: item.slug });

            if (res) {
                toast.success('Đã xóa khỏi danh sách thành công!');
                if (movies.length === 1 && currentPage > 1) {
                    setCurrentPage((prev) => prev - 1);
                    return;
                }

                setMovies((prev) => prev.filter((movie) => movie.slug !== item.slug));
                setTotalItems((prev) => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.log(error);
            toast.error('Xóa khỏi danh sách thất bại!');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>
                {title} {`(${totalItems})`}
            </h3>

            <div className={cx('list-movies')}>
                {isLoader ? (
                    <div className={cx('loader')}></div>
                ) : movies && movies.length > 0 ? (
                    movies.map((item) => (
                        <Link
                            to={
                                field !== 'continue_watching'
                                    ? `/phim/${item.slug}`
                                    : `/xem-phim/${item.slug}/${item.episode_slug}`
                            }
                            className={cx('movie')}
                            key={item.slug}
                        >
                            <div className={cx('poster')}>
                                <img src={item.poster_url} alt="poster" />
                                <Tippy content="Xóa">
                                    <div className={cx('remove')} onClick={(e) => handleRemoved(e, item)}>
                                        <FontAwesomeIcon icon={faX} />
                                    </div>
                                </Tippy>
                            </div>

                            {field === 'continue_watching' && (
                                <>
                                    <div className={cx('progress')}>
                                        <div
                                            className={cx('progress-bar')}
                                            style={{
                                                width: `${Math.min((item.current_time / item.duration) * 100, 100)}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className={cx('time')}>
                                        {item.episode_name.toLowerCase() !== 'full' && (
                                            <span className={cx('episode-name')}>{item.episode_name}&nbsp;•&nbsp;</span>
                                        )}
                                        <span className={cx('current-time')}>
                                            {`${formatDuration(item.current_time)} / ${formatDuration(item.duration)}`}
                                        </span>
                                    </div>
                                </>
                            )}

                            <div className={cx('info')}>
                                <h5 className={cx('name')}>{item.name}</h5>
                                <p className={cx('origin-name')}>{item.origin_name}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className={cx('no-data')}>
                        <p>Không có dữ liệu</p>
                    </div>
                )}
            </div>

            {/* Pagination Logic */}
            {totalPages > 1 && (
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
            )}
        </div>
    );
}

export default MainContents;

import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useState, useEffect } from 'react';

import styles from './MainContents.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faX } from '@fortawesome/free-solid-svg-icons';
import { getMeAPI } from '../../../../services/authServices';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function MainContents({ title = '', api = null, field = '' }) {
    const formatDuration = (totalSeconds) => {
        const seconds = Math.round(totalSeconds);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) {
            return `${h}h ${m}p`;
        }
        return `${m}p`;
    };
    const [allItems, setAllItems] = useState([]);
    const [isLoader, setIsLoader] = useState(true);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 18;

    useEffect(() => {
        const fecthUser = async () => {
            try {
                const res = await getMeAPI();
                setAllItems(res.user?.[field] || []);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoader(false);
            }
        };
        fecthUser();
    }, [field]);

    const totalPages = Math.ceil(allItems.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allItems.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [currentPage]);

    const handleRemoved = async (e, item) => {
        e.preventDefault();
        try {
            const res = await api({
                slug: item.slug,
            });

            if (res) {
                toast.success('Đã xóa khỏi danh sách thành công!');
                const newListItems = allItems.filter((movie) => movie.slug !== item.slug);
                setAllItems(newListItems);
                const newTotalPages = Math.ceil(newListItems.length / itemsPerPage);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('Xóa khỏi danh sách thất bại!');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>
                {title} {`(${allItems.length})`}
            </h3>
            <div className={cx('list-movies')}>
                {isLoader ? (
                    <div className={cx('loader')}></div>
                ) : currentItems && currentItems.length > 0 ? (
                    currentItems.map((item) => (
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
            {/* Pagination */}
            {allItems.length > itemsPerPage && (
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

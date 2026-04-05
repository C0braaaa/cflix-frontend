import classNames from 'classnames/bind';
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '../../../../hooks';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faArrowRight,
    faSearch,
    faCircleXmark,
    faArrowTrendUp,
    faGear,
    faLock,
    faUnlock,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import styles from './Movies.module.scss';
import { search } from '../../../../services/searchService';
import { allMovies } from '../../../../services/moviesServices';
import { getTopViewedAPI } from '../../../../services/viewsService';
import {
    blockMovieAPI,
    unblockMovieAPI,
    getAllBlockedSlugsAPI,
    getAllBlockedAPI,
} from '../../../../services/movieBlockService';
import MoviePieChart from './MoviePieChart';

const cx = classNames.bind(styles);

function Movies() {
    const [movies, setMovies] = useState([]);
    const [views, setViews] = useState([]);
    const [animatedTotal, setAnimatedTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [inputPage, setInputPage] = useState(currentPage);
    const [inputText, setInputText] = useState('');
    const [openActions, setOpenActions] = useState(null);
    const [showBlockedOnly, setShowBlockedOnly] = useState(false);
    const [blockedSlugs, setBlockedSlugs] = useState(new Set());
    const [stats, setStats] = useState({
        viewsByType: {},
    });

    const inputRef = useRef(null);
    const debouncedInput = useDebounce(inputText, 500);

    const normalizeMoviesData = (res) => {
        if (res?.items && res?.params?.pagination) {
            return {
                items: res.items,
                pagination: res.params.pagination,
            };
        }

        if (res?.items) {
            return {
                items: res.items,
                pagination: res.pagination,
            };
        }

        return { items: [], pagination: { totalPages: 0, totalItems: 0 } };
    };

    const formatViews = (views) => {
        if (!views) return 0;

        return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(views);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setAnimatedTotal(0);
                let rawRes;
                let cleanData;

                if (showBlockedOnly) {
                    const blockRes = await getAllBlockedAPI(currentPage);
                    cleanData = {
                        items: blockRes?.data || [],
                        pagination: blockRes?.pagination || { totalPages: 0, totalItems: 0 },
                    };
                } else if (debouncedInput.trim()) {
                    rawRes = await search(debouncedInput, 1, 24);
                    cleanData = normalizeMoviesData(rawRes);
                } else {
                    rawRes = await allMovies(currentPage);
                    cleanData = normalizeMoviesData(rawRes);
                }

                setMovies(cleanData);
                setTotalPages(cleanData.pagination?.totalPages || 0);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentPage, debouncedInput, showBlockedOnly]);

    useEffect(() => {
        const fetchViews = async () => {
            try {
                const res = await getTopViewedAPI();
                setViews(res || []);
                setStats({ viewsByType: res.viewsByType || {} });
            } catch (error) {
                console.log(error);
            }
        };
        fetchViews();
    }, []);

    useEffect(() => {
        const fetchBlocked = async () => {
            try {
                const res = await getAllBlockedSlugsAPI();
                if (res?.data) {
                    setBlockedSlugs(new Set(res.data));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchBlocked();
    }, []);

    useEffect(() => {
        const total = movies?.pagination?.totalItems;
        if (!total) return;
        const duration = 800;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const value = Math.floor(progress * total);

            setAnimatedTotal(value);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [movies?.pagination?.totalItems, currentPage]);

    const parseToVietnamese = (type) => {
        switch (type) {
            case 'series':
                return 'Phim Bộ';
            case 'single':
                return 'Phim Lẻ';
            case 'hoathinh':
                return 'Hoạt Hình';
            case 'tvshows':
                return 'TV Shows';
            default:
                return type;
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            setInputPage(pageNumber);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('stats')}>
                <div className={cx('stat__card')}>
                    <div className={cx('stat__card-icon')}>
                        <FontAwesomeIcon icon={faArrowTrendUp} />
                    </div>
                    <h4>Tổng số lượt xem</h4>
                    <span>{views?.totalView}</span>
                </div>
                <div className={cx('stat__card')}>
                    <h4>Phim có lượt xem cao nhất</h4>
                    <div className={cx('stat__card-movie')}>
                        <div className={cx('stat__card-movie-img')}>
                            <img src={views?.viewHighest?.poster_url} alt="poster" />
                        </div>
                        <div className={cx('stat__card-movie-info')}>
                            <p>{views?.viewHighest?.name}</p>
                            <p>{views?.viewHighest?.origin_name}</p>
                        </div>
                    </div>
                    <p style={{ fontSize: '1.3rem', color: '#a6a5a5' }}>
                        Lượt xem: <span>{formatViews(views?.viewHighest?.views)}</span>
                    </p>
                </div>
                <div className={cx('stat__card')}>
                    <h4>Thống kê theo thể loại</h4>
                    <MoviePieChart viewsByType={stats.viewsByType} />
                </div>
            </div>
            <div className={cx('heading')}>
                <div className={cx('heading-top')}>
                    <div className={cx('heading__title')}>
                        <h3>Danh sách phim hiện có trên hệ thống</h3>
                        <h4>
                            {debouncedInput.trim() ? (
                                <>
                                    Kết quả tìm kiếm của "<span>{debouncedInput}</span>"
                                </>
                            ) : (
                                <>
                                    Tổng số lượng phim <span>{animatedTotal}</span>
                                </>
                            )}
                        </h4>
                    </div>
                    <div className={cx('heading__search')}>
                        <input
                            type="text"
                            ref={inputRef}
                            value={inputText}
                            placeholder="Tìm kiếm phim..."
                            onChange={(e) => setInputText(e.target.value)}
                            disabled={showBlockedOnly}
                        />
                        <div className={cx('search-icons')}>
                            {inputText && (
                                <FontAwesomeIcon
                                    icon={faCircleXmark}
                                    onClick={() => {
                                        setInputText('');
                                        inputRef.current?.blur();
                                    }}
                                    className={cx('clear-icon')}
                                />
                            )}
                            <FontAwesomeIcon icon={faSearch} className={cx('search-icon')} />
                        </div>
                    </div>
                </div>
                <div className={cx('heading-bottom')}>
                    <p className={cx('heading-bottom__title')}>Hiển thị danh sách phim bị khóa</p>
                    <label className={cx('heading-bottom__container')}>
                        <input
                            type="checkbox"
                            checked={showBlockedOnly}
                            onChange={(e) => {
                                setShowBlockedOnly(e.target.checked);
                                setCurrentPage(1);
                                setInputPage(1);
                                setInputText('');
                            }}
                        />
                        <div className={cx('heading-bottom__checkmark')}></div>
                    </label>
                </div>
            </div>
            <div className={cx('content')}>
                <table cellPadding={0} cellSpacing={0} className={cx('table')}>
                    <thead className={cx('thead')}>
                        <tr>
                            <th>TÊN</th>
                            <th>NĂM</th>
                            <th>TÌNH TRẠNG</th>
                            <th>ĐỊNH DẠNG</th>
                            <th>QUỐC GIA</th>
                            <th>NGÀY CẬP NHẬT</th>
                            <th>LƯỢT XEM</th>
                            <th>TRẠNG THÁI</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody className={cx('tbody')}>
                        {loading ? (
                            <tr className={cx('loader')}></tr>
                        ) : movies?.items?.length > 0 ? (
                            movies?.items?.map((movie) => (
                                <tr key={movie?._id}>
                                    <td>
                                        <Link to={`/phim/${movie?.slug}`} className={cx('movie-info')}>
                                            <div className={cx('poster')}>
                                                {movie?.poster_url ? (
                                                    <img
                                                        src={
                                                            movie?.poster_url?.startsWith('http')
                                                                ? movie.poster_url
                                                                : `https://phimimg.com/${movie?.poster_url}`
                                                        }
                                                        alt={`Poster phim ${movie?.name}`}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            backgroundColor: '#333',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            borderRadius: '4px',
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faLock} color="#777" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className={cx('name')}>
                                                <p>{movie?.name}</p>
                                                <p>({movie?.origin_name})</p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td>{movie?.year || 'null'}</td>
                                    <td>
                                        {movie?.episode_current ? (
                                            <span
                                                className={cx('episodes', {
                                                    notfull:
                                                        !movie?.episode_current?.startsWith('Hoàn') &&
                                                        !movie?.episode_current?.startsWith('Full'),
                                                })}
                                            >
                                                {movie?.episode_current}
                                            </span>
                                        ) : (
                                            <span className={cx('episodes', 'notfull')}>null</span>
                                        )}
                                    </td>
                                    <td>{parseToVietnamese(movie?.type)}</td>
                                    <td>{movie?.country?.[0]?.name || 'null'}</td>
                                    <td>
                                        {movie?.modified?.time
                                            ? movie?.modified?.time.slice(0, 10)
                                            : movie?.update_at?.slice(0, 10) || 'null'}
                                    </td>
                                    <td>
                                        <Tippy
                                            content={`Lượt xem đầy đủ: ${views?.data?.find((v) => v.slug === movie?.slug)?.views || 0}`}
                                        >
                                            <span style={{ fontSize: '1.4rem' }}>
                                                {formatViews(
                                                    views?.data?.find((v) => v.slug === movie?.slug)?.views || 0,
                                                )}
                                            </span>
                                        </Tippy>
                                    </td>
                                    <td>
                                        <span className={cx('status', { active: movie?.isActive })}>
                                            {blockedSlugs.has(movie?.slug) ? (
                                                <FontAwesomeIcon icon={faLock} color="#D97706" />
                                            ) : (
                                                <FontAwesomeIcon icon={faUnlock} color="#059669" />
                                            )}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={cx('actions')}>
                                            <HeadlessTippy
                                                interactive
                                                trigger="click"
                                                placement="bottom-end"
                                                arrow={false}
                                                offset={[-60, 5]}
                                                onShow={() => setOpenActions(movie?.slug)}
                                                onHide={() =>
                                                    setOpenActions((prev) => (prev === movie?.slug ? null : prev))
                                                }
                                                render={(attrs) => {
                                                    const isBlocked = blockedSlugs.has(movie?.slug);
                                                    return (
                                                        <div
                                                            className={cx('dropdown-actions')}
                                                            tabIndex="-1"
                                                            {...attrs}
                                                        >
                                                            <div
                                                                className={cx('dropdown-item')}
                                                                onClick={async () => {
                                                                    setOpenActions(null);
                                                                    try {
                                                                        if (isBlocked) {
                                                                            await unblockMovieAPI(movie?.slug);
                                                                            setBlockedSlugs((prev) => {
                                                                                const newSet = new Set(prev);
                                                                                newSet.delete(movie?.slug);
                                                                                return newSet;
                                                                            });
                                                                            toast.success('Mở khóa phim thành công!');
                                                                        } else {
                                                                            await blockMovieAPI(
                                                                                movie?.slug,
                                                                                movie?.name,
                                                                                movie?.origin_name,
                                                                                movie?.type,
                                                                                movie?.poster_url,
                                                                            );
                                                                            setBlockedSlugs((prev) =>
                                                                                new Set(prev).add(movie?.slug),
                                                                            );
                                                                            toast.success('Đã khóa phim!');
                                                                        }
                                                                    } catch (error) {
                                                                        console.log(error);
                                                                        toast.error('Có lỗi xảy ra!');
                                                                    }
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={isBlocked ? faUnlock : faLock} />
                                                                <span>{isBlocked ? 'Mở khóa' : 'Khóa'}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                            >
                                                <div
                                                    className={cx('gear-icon', {
                                                        open: openActions === movie?.slug,
                                                    })}
                                                >
                                                    <FontAwesomeIcon icon={faGear} />
                                                </div>
                                            </HeadlessTippy>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={9}
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
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {movies?.pagination?.totalPages > 1 && (
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
                                Trang{' '}
                                <input
                                    type="number"
                                    min="1"
                                    max={movies?.pagination?.totalPages}
                                    value={inputPage}
                                    onChange={(e) => setInputPage(e.target.value)}
                                    className={cx('page-input')}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const newPage = Number(inputPage);
                                            if (newPage >= 1 && newPage <= totalPages) {
                                                handlePageChange(newPage);
                                            } else {
                                                alert(`Vui lòng nhập trang từ 1 đến ${totalPages}`);
                                                setInputPage(currentPage);
                                            }
                                        }
                                    }}
                                />{' '}
                                / {totalPages}
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
        </div>
    );
}

export default Movies;

import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link, useSearchParams, useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faFilter } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

import { nations, genres } from '../Dropdown/listDropdown';
import styles from './MovieList.module.scss';
import Button from '../Button/index-button';

const cx = classNames.bind(styles);

function MovieList({ title, fetchFunction, type, slug }) {
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoader, setIsLoader] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [titlePage, setTitlePage] = useState('');

    const location = useLocation();
    const params = useParams();

    // State quản lí trên URL
    const [searchParams, setSearchParams] = useSearchParams();
    const urlCountry = searchParams.get('country') || '';
    const urlYear = searchParams.get('year') || '';
    const urlGenre = searchParams.get('category') || '';
    const urlLang = searchParams.get('sort_lang') || '';
    const urlSort = searchParams.get('sort_field') || 'modified.time';

    const [selectedCountry, setSelectedCountry] = useState(urlCountry);
    const [selectedYear, setSelectedYear] = useState(urlYear);
    const [selectedGenre, setSelectedGenre] = useState(urlGenre);
    const [selectedLang, setSelectedLang] = useState(urlLang);
    const [selectedSort, setSelectedSort] = useState(urlSort);

    const page = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;
    const [inputPage, setInputPage] = useState(page);

    const years = new Date().getFullYear();

    useEffect(() => {
        document.title = title;
    }, [title]);

    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };
    useEffect(() => {
        if (location.pathname.includes('/quoc-gia/')) {
            setSelectedCountry(params.slug);
        } else {
            setSelectedCountry(urlCountry);
        }
        setSelectedYear(urlYear);
        if (location.pathname.includes('/the-loai/')) {
            setSelectedGenre(params.slug);
        } else {
            setSelectedGenre(urlGenre);
        }
        setSelectedLang(urlLang);
        setSelectedSort(urlSort);
        setInputPage(page);
    }, [urlCountry, urlYear, urlGenre, urlLang, urlSort, page, location.pathname, params.slug]);

    const fetchMovies = useCallback(
        async (pageNum) => {
            setIsLoader(true);
            try {
                const data = await fetchFunction(pageNum, 32, slug, urlCountry, urlYear, urlGenre, urlLang, urlSort);
                setMovies(data.items || []);
                setTitlePage(data.titlePage || []);
                setTotalPages(data.params?.pagination?.totalPages || data.totalPages || 1);
            } catch (error) {
                console.error('API Error:', error);
            } finally {
                setIsLoader(false);
            }
        },
        [fetchFunction, slug, urlCountry, urlYear, urlGenre, urlLang, urlSort],
    );

    useEffect(() => {
        fetchMovies(page);
    }, [page, fetchMovies]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            // Giữ lại các params cũ nếu có (ví dụ filter), chỉ update page
            const params = Object.fromEntries([...searchParams]);
            setSearchParams({ ...params, page: newPage }); // <--- Cập nhật URL
        }
    };

    const handleSubmitFilter = () => {
        const params = {};

        if (selectedCountry) params.country = selectedCountry;
        if (selectedYear) params.year = selectedYear;
        if (selectedGenre) params.category = selectedGenre;
        if (selectedLang) params.sort_lang = selectedLang;
        if (selectedSort) params.sort_field = selectedSort;

        params.page = 1;

        setSearchParams(params);
        setShowFilter(false);
    };

    const renderExtraInfo = (movie) => {
        switch (type) {
            case 'single':
                return (
                    <>
                        <Tippy content="Chất lượng">
                            <span>{movie.quality}</span>
                        </Tippy>
                        <Tippy content="Năm phát hành">
                            <span>{movie.year}</span>
                        </Tippy>
                    </>
                );
            case 'series':
            case 'cartoon':
                return (
                    <>
                        {!movie.episode_current?.match(/\d+/)?.[0] ? (
                            <Tippy content="Movies">
                                <span>MV</span>
                            </Tippy>
                        ) : (
                            <Tippy content="Tập hiện tại">
                                <span>{movie.episode_current.match(/\d+/)?.[0] || 'MV'}</span>
                            </Tippy>
                        )}
                        <Tippy content="Năm phát hành">
                            <span>{movie.year}</span>
                        </Tippy>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>{titlePage}</h2>
            <div className={cx('filter')}>
                <div
                    className={cx('filter__icon', { active: showFilter })}
                    onClick={() => setShowFilter((prev) => !prev)}
                >
                    <FontAwesomeIcon icon={faFilter} />
                    <span>Bộ lọc</span>
                </div>
                {showFilter && (
                    <div className={cx('filter__selection')}>
                        <div className={cx('country')}>
                            <p className={cx('country__label')}>Quốc Gia: </p>
                            <div className={cx('country__list')}>
                                <span
                                    className={cx({ active: selectedCountry === '' })}
                                    onClick={() => setSelectedCountry('')}
                                >
                                    Tất cả
                                </span>
                                {nations.map((nation, index) => (
                                    <span
                                        key={index}
                                        className={cx({ active: selectedCountry === nation.to.split('/').pop() })}
                                        onClick={() => {
                                            const slug = nation.to.split('/').pop();
                                            setSelectedCountry(slug);
                                        }}
                                    >
                                        {nation.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className={cx('category')}>
                            <p className={cx('category__label')}>Thể loại: </p>
                            <div className={cx('category__list')}>
                                <span
                                    className={cx({ active: selectedGenre === '' })}
                                    onClick={() => setSelectedGenre('')}
                                >
                                    Tất cả
                                </span>
                                {genres.map((genre, index) => (
                                    <span
                                        key={index}
                                        className={cx({ active: selectedGenre === genre.to.split('/').pop() })}
                                        onClick={() => {
                                            const slug = genre.to.split('/').pop();
                                            setSelectedGenre(slug);
                                        }}
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className={cx('version')}>
                            <p className={cx('version__label')}>Phiên bản: </p>
                            <div className={cx('version__list')}>
                                <span
                                    className={cx({ active: selectedLang === '' })}
                                    onClick={() => setSelectedLang('')}
                                >
                                    Tất cả
                                </span>
                                <span
                                    className={cx({ active: selectedLang === 'vietsub' })}
                                    onClick={() => setSelectedLang('vietsub')}
                                >
                                    Vietsub
                                </span>
                                <span
                                    className={cx({ active: selectedLang === 'thuyet-minh' })}
                                    onClick={() => setSelectedLang('thuyet-minh')}
                                >
                                    Thuyết Minh
                                </span>
                            </div>
                        </div>
                        <div className={cx('years')}>
                            <p className={cx('years__label')}>Năm sản xuất: </p>
                            <div className={cx('years__list')}>
                                <span
                                    className={cx({ active: selectedYear === '' })}
                                    onClick={() => setSelectedYear('')}
                                >
                                    Tất cả
                                </span>
                                {[...Array(16)].map((_, index) => {
                                    const y = years - index;
                                    return (
                                        <span
                                            key={y}
                                            className={cx({ active: selectedYear === y.toString() })}
                                            onClick={() => setSelectedYear(y.toString())}
                                        >
                                            {y}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                        <div className={cx('sort')}>
                            <p className={cx('sort__label')}>Sắp xếp: </p>
                            <div className={cx('sort__list')}>
                                <span
                                    className={cx({ active: selectedSort === 'modified.time' })}
                                    onClick={() => setSelectedSort('modified.time')}
                                >
                                    Thời gian cập nhật
                                </span>
                                <span
                                    className={cx({ active: selectedSort === '_id' })}
                                    onClick={() => setSelectedSort('_id')}
                                >
                                    Thời gian đăng
                                </span>
                                <span
                                    className={cx({ active: selectedSort === 'year' })}
                                    onClick={() => setSelectedSort('year')}
                                >
                                    Năm sản xuất
                                </span>
                            </div>
                        </div>
                        <Button primary className={cx('submit-btn')} onClick={handleSubmitFilter}>
                            Lọc
                        </Button>
                    </div>
                )}
            </div>
            <div className={cx('content')}>
                {isLoader ? (
                    <div className={cx('loader')}></div>
                ) : (
                    <div className={cx('list-items')}>
                        {movies.map((movie) => (
                            <Link to={`/phim/${movie.slug}`} key={movie._id}>
                                <div className={cx('item')}>
                                    <div className={cx('poster')}>
                                        {movie.poster_url ? (
                                            <img
                                                src={`https://phimapi.com/image.php?url=https://phimimg.com/${movie.poster_url}`}
                                                alt={movie.name}
                                            />
                                        ) : (
                                            <img src="assets/images/defaultimg.jpg" alt="not found" />
                                        )}
                                        <div className={cx('quality')}>{renderExtraInfo(movie)}</div>
                                    </div>
                                    <div className={cx('info')}>
                                        <h4 className={cx('name')}>{decodeHTML(movie.name)}</h4>
                                        <h4 className={cx('original-name')}>{decodeHTML(movie.origin_name)}</h4>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {/* Phân trang */}
                {!isLoader && totalPages > 1 && (
                    <div className={cx('pagination')}>
                        <button className={cx('prev')} disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <span className={cx('page')}>
                            Trang{' '}
                            <input
                                type="number"
                                min="1"
                                max={totalPages}
                                value={inputPage}
                                onChange={(e) => setInputPage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const newPage = Number(inputPage);
                                        if (newPage >= 1 && newPage <= totalPages) {
                                            handlePageChange(newPage);
                                        } else {
                                            alert(`Vui lòng nhập trang từ 1 đến ${totalPages}`);
                                            setInputPage(page);
                                        }
                                    }
                                }}
                                className={cx('page-input')}
                            />{' '}
                            / {totalPages}
                        </span>
                        <button
                            className={cx('next')}
                            disabled={page >= totalPages}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

MovieList.propTypes = {
    title: PropTypes.string.isRequired,
    fetchFunction: PropTypes.func.isRequired,
    slug: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
};

export default MovieList;

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faFilter } from '@fortawesome/free-solid-svg-icons';

import Button from '../../components/Button/index-button';
import styles from './FullLatestMovies.module.scss';
import { nations, genres } from '../../components/Dropdown/listDropdown';
import { typeList } from '../../services/moviesServices';

const cx = classNames.bind(styles);

function FullLatestMovies() {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const typeSlug = slug ? slug.split('-').slice(0, 2).join('-') : '';
    let titleBg = '';
    if (typeSlug === 'phim-le') {
        titleBg = 'linear-gradient(90deg, #6ffacf, #ffffff, #6ffacf)';
    } else if (typeSlug === 'phim-bo') {
        titleBg = 'linear-gradient(90deg, #ffe082, #ffffff, #ffe082)';
    }

    // --- 1. LẤY GIÁ TRỊ TỪ URL (Nguồn sự thật) ---
    // Nếu URL không có, trả về '' (Tất cả)
    const urlCountry = searchParams.get('country') || '';
    const urlPage = searchParams.get('page') ? parseInt(searchParams.get('page')) : 1;
    const urlGenre = searchParams.get('category') || '';
    const urlLang = searchParams.get('sort_lang') || '';
    const urlSort = searchParams.get('sort_field') || 'modified.time';

    // State quản lý UI (Hiển thị active trong dropdown)
    // Khởi tạo giá trị ban đầu dựa trên URL để khi F5 vẫn giữ đúng lựa chọn
    const [selectedCountry, setSelectedCountry] = useState(urlCountry);
    const [selectedGenre, setSelectedGenre] = useState(urlGenre);
    const [selectedLang, setSelectedLang] = useState(urlLang);
    const [selectedSort, setSelectedSort] = useState(urlSort);

    // State dữ liệu phim
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoader, setIsLoader] = useState(false);
    const [titlePage, setTitlePage] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [inputPage, setInputPage] = useState(urlPage);

    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    // --- 2. GỌI API DỰA TRÊN URL ---
    // Không cần filterState nữa, dùng thẳng urlCountry, urlYear
    const fetchMovies = useCallback(async () => {
        setIsLoader(true);
        try {
            // Truyền urlPage, urlCountry, urlYear vào API
            const data = await typeList(urlPage, 32, typeSlug, urlCountry, 2025, urlGenre, urlLang, urlSort);

            setMovies(data.items || []);
            setTitlePage(data.titlePage || 'Danh sách phim');
            setTotalPages(data.params?.pagination?.totalPages || data.totalPages || 1);
        } catch (error) {
            console.error('API Error:', error);
        } finally {
            setIsLoader(false);
        }
    }, [urlPage, typeSlug, urlCountry, urlGenre, urlLang, urlSort]); // Dependency là các biến từ URL

    // Effect này chạy khi URL thay đổi (do fetchMovies phụ thuộc vào URL)
    useEffect(() => {
        fetchMovies();
        setInputPage(urlPage);
        window.scrollTo(0, 0);
    }, [fetchMovies, urlPage]);

    useEffect(() => {
        // Cập nhật Title trang
        const titleCountry = nations.find((n) => n.to.includes(urlCountry))?.name;
        document.title = `${titlePage} mới nhất 2025 ${urlCountry ? `- ${titleCountry}` : ''}`;
    }, [titlePage, urlCountry]);

    // --- 3. CẬP NHẬT URL KHI CHUYỂN TRANG ---
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            // Giữ nguyên các params cũ (country, year), chỉ thay đổi page
            const params = Object.fromEntries([...searchParams]);
            setSearchParams({ ...params, page: newPage });
        }
    };

    // --- 4. CẬP NHẬT URL KHI BẤM NÚT LỌC ---
    const handleSubmitFilter = () => {
        const params = {};

        // Chỉ thêm vào URL nếu giá trị khác rỗng
        if (selectedCountry) params.country = selectedCountry;
        if (selectedGenre) params.category = selectedGenre;
        if (selectedLang) params.sort_lang = selectedLang;
        if (selectedSort) params.sort_field = selectedSort;

        params.page = 1;
        setSearchParams(params);
        setShowFilter(false);
    };

    const renderExtraInfo = (movie) => {
        if (typeSlug === 'phim-bo') {
            return (
                <>
                    <Tippy content="Tập hiện tại">
                        <span>{movie.episode_current?.match(/\d+/)?.[0] || 'N/A'}</span>
                    </Tippy>
                    <Tippy content="Năm phát hành">
                        <span>{movie.year}</span>
                    </Tippy>
                </>
            );
        } else
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
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('background')} style={{ backgroundImage: titleBg }}></div>
            <h2
                className={cx('title')}
                style={{ backgroundImage: titleBg }}
            >{`Danh sách ${titlePage} mới nhất 2025`}</h2>

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

            {/* Content & Pagination (Giữ nguyên) */}
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
                                                onError={(e) => (e.target.src = 'assets/images/defaultimg.jpg')}
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
                {!isLoader && movies.length > 0 && (
                    <div className={cx('pagination')}>
                        <button
                            className={cx('prev')}
                            disabled={urlPage <= 1}
                            onClick={() => handlePageChange(urlPage - 1)}
                        >
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
                                            setInputPage(urlPage);
                                        }
                                    }
                                }}
                                className={cx('page-input')}
                            />{' '}
                            / {totalPages}
                        </span>
                        <button
                            className={cx('next')}
                            disabled={urlPage >= totalPages}
                            onClick={() => handlePageChange(urlPage + 1)}
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FullLatestMovies;

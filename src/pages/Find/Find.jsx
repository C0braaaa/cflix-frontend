import { useLocation } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import styles from './Find.module.scss';
import { search } from '../../services/searchService';

const cx = classNames.bind(styles);

function Find() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const query = params.get('q');

    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    const [movies, setMovies] = useState([]);
    const [isLoader, setIsLoader] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [inputPage, setInputPage] = useState(page);

    const fetchMovie = useCallback(async () => {
        setIsLoader(true);
        try {
            const data = await search(query, page);
            setMovies(data.items || []);
            setTotalPages(data.params?.pagination?.totalPages || data.totalPages || 1);
        } catch (error) {
            console.error('Lỗi khi fetch API:', error);
        } finally {
            setIsLoader(false);
        }
    }, [query, page]);

    useEffect(() => {
        document.title = `Tìm kiếm "${query}"`;
    }, [query]);

    useEffect(() => {
        fetchMovie();
        setInputPage(page);
    }, [fetchMovie, page]);

    useEffect(() => {
        setPage(1);
    }, [query]);

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>Kết quả tìm kiếm của "{query}"</h2>
            <div className={cx('content')}>
                {isLoader ? (
                    <div className={cx('loader')}></div>
                ) : movies && movies.length > 0 ? (
                    <>
                        <div className={cx('list-items')}>
                            {movies.map((movie) => (
                                <Link to={`/phim/${movie.slug}`} key={movie._id}>
                                    <div className={cx('item')}>
                                        <div className={cx('poster')}>
                                            <img
                                                src={`https://images.weserv.nl/?url=phimimg.com/${movie.poster_url}`}
                                                alt={movie.name}
                                            />
                                            <div className={cx('quality')}>
                                                <Tippy content="Chất lượng">
                                                    <span>{movie.quality}</span>
                                                </Tippy>
                                                <Tippy content="Năm phát hành">
                                                    <span>{movie.year}</span>
                                                </Tippy>
                                            </div>
                                        </div>
                                        <div className={cx('info')}>
                                            <h4 className={cx('name')}>{decodeHTML(movie.name)}</h4>
                                            <h4 className={cx('original-name')}>{decodeHTML(movie.origin_name)}</h4>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Phân trang */}
                        <div className={cx('pagination')}>
                            <button className={cx('prev')} disabled={page <= 1} onClick={() => setPage(page - 1)}>
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
                                                setPage(newPage);
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
                                onClick={() => setPage(page + 1)}
                            >
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className={cx('not-found')}>
                        <img src="assets/images/no-result.png" alt="not-found" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Find;

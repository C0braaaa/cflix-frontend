import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';

import styles from './RelatedMovies.module.scss';
import { type as getMoviesByType } from '../../../services/moviesServices';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function RelatedMovies({ currentSlug, categorySlug }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!categorySlug) return;
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const randomPage = Math.floor(Math.random() * 3) + 1;
                const res = await getMoviesByType(randomPage, 24, categorySlug);
                const listMovies = res?.items || [];
                if (listMovies.length > 0) {
                    let filterList = listMovies.filter((item) => item.slug !== currentSlug);
                    for (let i = filterList.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [filterList[i], filterList[j]] = [filterList[j], filterList[i]];
                    }
                    setMovies(filterList.slice(0, 6));
                }
            } catch (error) {
                console.log('Error: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, [currentSlug, categorySlug]);

    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Đề xuất cho bạn</h3>

            <div className={cx('movies-list')}>
                {loading ? (
                    <div className={cx('loader')}></div>
                ) : (
                    movies.map((movie) => (
                        <Link to={`/phim/${movie.slug}`} className={cx('movie')} key={movie._id}>
                            <div className={cx('left-side')}>
                                <div className={cx('poster')}>
                                    <img
                                        src={`https://phimimg.com/${movie.poster_url}`}
                                        alt={`Poster của phim ${movie.name}`}
                                    />
                                </div>
                            </div>
                            <div className={cx('right-side')}>
                                <h4 className={cx('name')}>{movie.name}</h4>
                                <p className={cx('origin-name')}>{movie.origin_name}</p>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

export default RelatedMovies;

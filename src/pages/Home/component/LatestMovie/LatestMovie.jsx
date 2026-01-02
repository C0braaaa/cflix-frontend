import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './LatestSingleMovie.module.scss';
import { typeList } from '../../../../services/moviesServices';

const cx = classNames.bind(styles);
function LatestMovie({ slug = '', year = '', bg = '', title = '', link = '' }) {
    const listCountries = [
        {
            id: 1,
            name: 'Âu Mỹ',
            slug: 'au-my',
        },
        {
            id: 2,
            name: 'Hàn Quốc',
            slug: 'han-quoc',
        },
        {
            id: 3,
            name: 'Trung Quốc',
            slug: 'trung-quoc',
        },
        {
            id: 4,
            name: 'Nhật Bản',
            slug: 'nhat-ban',
        },
    ];

    const [movies, setMovies] = useState([]);
    const [country, setCountry] = useState('au-my');
    const [isLoader, setIsLoader] = useState(false);

    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    useEffect(() => {
        const fetchMovie = async () => {
            setIsLoader(true);
            try {
                const data = await typeList(1, 12, slug, country, year);
                setMovies(data.items || []);
            } catch (error) {
                console.error('Lỗi khi fetch API:', error);
            } finally {
                setIsLoader(false);
            }
        };
        fetchMovie();
    }, [year, country, slug]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading-1')}>
                <h2 className={cx('title')} style={{ backgroundImage: bg }}>
                    {title}
                </h2>
                <Link to={link} className={cx('cat-more')}>
                    <span>Xem thêm</span>
                    <FontAwesomeIcon icon={faAngleRight} />
                </Link>
            </div>
            <div className={cx('heading-2')}>
                <div className={cx('select-country')}>
                    {listCountries.map((value) => (
                        <div
                            className={cx('country', { active: value.slug === country })}
                            key={value.id}
                            onClick={() => {
                                setCountry(value.slug);
                            }}
                        >
                            <span>{value.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className={cx('content')}>
                {isLoader ? (
                    <div className={cx('loader')}></div>
                ) : (
                    movies.map((movie, index) => (
                        <Link to={`/phim/${movie.slug}`} className={cx('item')} key={index}>
                            <img
                                src={`https://images.weserv.nl/?url=phimimg.com/${movie.thumb_url}`}
                                onError={(e) => (e.target.src = 'assets/images/defaultimg.jpg')}
                                alt={movie.name}
                            />
                            <div className={cx('info')}>
                                <h2 className={cx('name')}>{decodeHTML(movie.name)}</h2>
                                <p className={cx('origin-name')}>{decodeHTML(movie.origin_name)}</p>
                            </div>
                            <div className={cx('quality')}>
                                <span>{movie.quality}</span>
                            </div>
                            {slug === 'phim-bo' && (
                                <div className={cx('current-episode')}>
                                    <span>{movie.episode_current}</span>
                                </div>
                            )}
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

LatestMovie.propTypes = {
    slug: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    bg: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};

export default LatestMovie;

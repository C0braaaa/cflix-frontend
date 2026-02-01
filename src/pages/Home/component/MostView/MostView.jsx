import classnames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { Link } from 'react-router-dom';

import styles from './MostView.module.scss';
import { getTopViewedAPI } from '../../../../services/viewsService';
const cx = classnames.bind(styles);

function MostView({ title, type }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const res = await getTopViewedAPI(type);
                setMovies(res.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, [type]);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h2 className={cx('title')}>{title}</h2>
            </div>
            <Swiper
                modules={FreeMode}
                freeMode={true}
                grabCursor={true}
                spaceBetween={20}
                slidesPerView={'auto'}
                className={cx('content')}
            >
                {loading ? (
                    <div className={cx('loader')}></div>
                ) : (
                    movies.map((movie, index) => (
                        <SwiperSlide className={cx('item')} key={movie._id}>
                            <Link to={`/phim/${movie.slug}/`}>
                                <div className={cx('card')}>
                                    <img src={movie.poster_url} alt={movie.name} />
                                    <span className={cx('number', { 'is-double': index + 1 >= 10 })}>{index + 1}</span>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))
                )}
            </Swiper>
        </div>
    );
}

export default MostView;

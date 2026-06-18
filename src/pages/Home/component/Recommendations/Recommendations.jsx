import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

import styles from './Recommendations.module.scss';
import { useRecommendations } from '../../../../hooks/useRecommendations';

const cx = classNames.bind(styles);

function Recommendations() {
    const { movies, reason, loading } = useRecommendations();

    if (loading || movies.length === 0) return null;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h2 className={cx('title')}>
                    {reason ? `Vì bạn đã xem "${reason.movieName}"` : 'Có thể bạn sẽ thích'}
                </h2>
                {reason && <span className={cx('genre-badge')}>#{reason.genreName}</span>}
            </div>

            <Swiper
                modules={[FreeMode]}
                freeMode={true}
                grabCursor={true}
                spaceBetween={16}
                slidesPerView="auto"
                className={cx('slider')}
            >
                {movies.map((movie) => (
                    <SwiperSlide key={movie.slug} className={cx('slide')}>
                        <Link to={`/phim/${movie.slug}`}>
                            <div className={cx('poster')}>
                                <img
                                    src={`https://phimimg.com/${movie.poster_url}`}
                                    alt={movie.name}
                                    onError={(e) => (e.target.src = '/assets/images/defaultimg.jpg')}
                                />
                            </div>
                            <div className={cx('info')}>
                                <p className={cx('name')}>{movie.name}</p>
                                <p className={cx('origin')}>{movie.origin_name}</p>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default Recommendations;

import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

import styles from './Recommendations.module.scss';
import { useRecommendations } from '../../../../hooks/useRecommendations';

const cx = classNames.bind(styles);

function RecommendationSection({ section }) {
    if (!section || section.items.length === 0) return null;

    return (
        <div className={cx('section', { franchise: section.type === 'franchise' })}>
            <div className={cx('heading')}>
                <h2 className={cx('title')}>
                    {section.type === 'franchise' && <span className={cx('franchise-icon')}></span>}
                    {section.title}
                </h2>
                {section.badge && <span className={cx('genre-badge')}>{section.badge}</span>}
            </div>

            <Swiper
                modules={[FreeMode]}
                freeMode={true}
                grabCursor={true}
                spaceBetween={16}
                slidesPerView="auto"
                className={cx('slider')}
            >
                {section.items.map((movie) => (
                    <SwiperSlide key={movie.slug} className={cx('slide')}>
                        <Link to={`/phim/${movie.slug}`}>
                            <div className={cx('poster')}>
                                <img
                                    src={`https://phimimg.com/${movie.poster_url}`}
                                    alt={movie.name}
                                    loading="lazy"
                                    onError={(e) => (e.target.src = '/assets/images/defaultimg.jpg')}
                                />
                                {movie.quality && <span className={cx('quality-tag')}>{movie.quality}</span>}
                                {movie.lang && <span className={cx('lang-tag')}>{movie.lang}</span>}
                            </div>
                            <div className={cx('info')}>
                                <p className={cx('name')}>{movie.name}</p>
                                <p className={cx('origin')}>{movie.origin_name}</p>
                                {movie.year && <span className={cx('year')}>{movie.year}</span>}
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

function Recommendations() {
    const { sections, loading } = useRecommendations();

    if (loading || sections.length === 0) return null;

    return (
        <div className={cx('wrapper')}>
            {sections.map((section, index) => (
                <RecommendationSection key={`${section.type}-${index}`} section={section} />
            ))}
        </div>
    );
}

export default Recommendations;

import { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';
import { faHeart, faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { slidesInfo } from './list';
import { LatestSingleMovie, Topics, LatestSeriesMovie } from './component/index';

const cx = classNames.bind(styles);

function Home() {
    const user = true;

    useEffect(() => {
        document.title = 'CFlix - Phim Hay Xem Là Ngất Ngay';
    }, []);

    // Ham ho trợ chạy animation không cần slide mount lại
    const handleSlideAnimation = (swiper, index) => {
        const slide = swiper.slides[index];
        if (!slide) return;

        const img = slide.querySelector(`.${cx('cover-image')}`);
        const info = slide.querySelector(`.${cx('slide-info')}`);

        img?.classList.add(cx('slideInRight'));
        info?.classList.add(cx('slideInLeft'));
    };

    const resetSlideAnimation = (slide) => {
        if (!slide) return;
        slide.querySelector(`.${cx('cover-image')}`)?.classList.remove(cx('slideInRight'));
        slide.querySelector(`.${cx('slide-info')}`)?.classList.remove(cx('slideInLeft'));
    };

    const playSlideAnimation = (slide) => {
        if (!slide) return;
        const img = slide.querySelector(`.${cx('cover-image')}`);
        const info = slide.querySelector(`.${cx('slide-info')}`);

        requestAnimationFrame(() => {
            img?.classList.add(cx('slideInRight'));
            info?.classList.add(cx('slideInLeft'));
        });
    };
    return (
        <div className={cx('wrapper')}>
            <Swiper
                modules={[Pagination, Autoplay, EffectFade]}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) => {
                        return `<span class="${className}">
                    <img src="${slidesInfo[index].imgUrl}" alt="thumb" />
                </span>`;
                    },
                }}
                autoplay={{ delay: 50000, disableOnInteraction: false }}
                loop={true}
                slidesPerView={1}
                resistance={true}
                resistanceRatio={0.85}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={1200}
                className={cx('slide')}
                onInit={(swiper) => handleSlideAnimation(swiper, swiper.activeIndex)}
                onSlideChangeTransitionStart={(swiper) => {
                    resetSlideAnimation(swiper.slides[swiper.previousIndex]);
                    playSlideAnimation(swiper.slides[swiper.activeIndex]);
                }}
            >
                {slidesInfo.map((item, index) => {
                    return (
                        <SwiperSlide key={index}>
                            <div className={cx('slide')}>
                                <div className={cx('slide-elements')}>
                                    <div className={cx('cover-fade')}>
                                        <div className={cx('cover-image')}>
                                            <img className={cx('cover-img')} src={item.imgUrl} alt="cover" />
                                        </div>
                                    </div>
                                    <div className={cx('slide-info')}>
                                        <Link to={item.infoPage}>
                                            <h2 className={cx('movie-title')}>{item.title}</h2>
                                            <p className={cx('movie-eng-title')}>{item.engTitle}</p>
                                        </Link>
                                        <div className={cx('movie-tags-1')}>
                                            <div className={cx('IMDb-tag')}>
                                                <span>{item.imdb}</span>
                                            </div>
                                            {item.quality && (
                                                <div className={cx('quality-tag')}>
                                                    <span>{item.quality}</span>
                                                </div>
                                            )}
                                            <div className={cx('tag-model')}>
                                                <span>{item.tagModel}</span>
                                            </div>
                                            {item.releaseInfo.map((info, index) => {
                                                return (
                                                    <div className={cx('tag-classic')} key={index}>
                                                        <span>{info}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className={cx('movie-tags-2')}>
                                            {item.types.slice(0, 6).map((topic, index) => {
                                                return (
                                                    <div className={cx('tag-topic')} key={index}>
                                                        <span>{topic}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <p className={cx('movie-description')}>{item.description}</p>
                                        <div className={cx('movie-actions')}>
                                            <Link to={item.to} className={cx('play')}>
                                                <FontAwesomeIcon className={cx('play-icon')} icon={faPlay} />
                                            </Link>
                                            {user && (
                                                <div className={cx('group-actions')}>
                                                    <Tippy content="Yêu thích" offset={[0, -5]} placement="bottom">
                                                        <div className={cx('action-item')}>
                                                            <FontAwesomeIcon icon={faHeart} />
                                                        </div>
                                                    </Tippy>
                                                    <Tippy content="Xem sau" offset={[0, -5]} placement="bottom">
                                                        <div className={cx('action-item')}>
                                                            <FontAwesomeIcon icon={faPlus} />
                                                        </div>
                                                    </Tippy>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
            <Topics />
            <LatestSingleMovie />
            <LatestSeriesMovie />
        </div>
    );
}

export default Home;

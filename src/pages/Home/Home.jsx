import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { toast } from 'react-toastify';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';
import { faHeart, faPlay, faPlus } from '@fortawesome/free-solid-svg-icons';
import { slidesInfo } from './list';
import { LatestMovie, Topics } from './component/index';
import { useAuth } from '../../features/auth/context/AuthContext';
import { getMeAPI, toggleFavoriteAPI } from '../../services/authServices';

const cx = classNames.bind(styles);

function Home() {
    const { user } = useAuth();
    const [favoritesList, setFavoritesList] = useState([]);

    useEffect(() => {
        document.title = 'CFlix - Phim Hay Xem Là Ngất Ngay';
    }, []);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (user) {
                try {
                    const res = await getMeAPI();
                    if (res && res.user && res.user.favorite) {
                        setFavoritesList(res.user.favorite);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchFavorites();
    }, [user]);

    const handleSliderFavorite = async (item) => {
        console.log('item gom gi: ', item);

        try {
            const dataToSave = {
                slug: item.slug,
                name: item.name,
                origin_name: item.origin_name,
                poster_url: item.poster_url,
            };

            const res = await toggleFavoriteAPI(dataToSave);

            if (res && res.status) {
                toast.success(res.msg);

                setFavoritesList((prev) => {
                    // Kiểm tra xem phim này đã có trong list chưa
                    const exists = prev.find((f) => f.slug === item.slug);

                    if (exists) {
                        // Nếu có rồi -> Đang thực hiện XÓA -> Lọc bỏ ra khỏi mảng
                        return prev.filter((f) => f.slug !== item.slug);
                    } else {
                        // Nếu chưa có -> Đang thực hiện THÊM -> Push vào mảng
                        return [...prev, { slug: item.slug }];
                    }
                });
            }
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra!');
        }
    };

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
                    <img src="${slidesInfo[index].thumb_url}" alt="thumb" />
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
                    const isFav = favoritesList.some((fav) => fav.slug === item.slug);
                    return (
                        <SwiperSlide key={index}>
                            <div className={cx('slide')}>
                                <div className={cx('slide-elements')}>
                                    <div className={cx('cover-fade')}>
                                        <div className={cx('cover-image')}>
                                            <img className={cx('cover-img')} src={item.thumb_url} alt="cover" />
                                        </div>
                                    </div>
                                    <div className={cx('slide-info')}>
                                        <Link to={item.infoPage}>
                                            <h2 className={cx('movie-title')}>{item.name}</h2>
                                            <p className={cx('movie-eng-title')}>{item.origin_name}</p>
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
                                                        <div
                                                            className={cx('action-item')}
                                                            onClick={() => handleSliderFavorite(item)}
                                                            style={{
                                                                color: isFav ? '#ff0000' : 'white',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
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
            <LatestMovie
                slug="phim-le"
                year="2025"
                bg="linear-gradient(90deg, #6ffacf, #ffffff, #6ffacf)"
                title="Phim lẻ mới nhất 2025"
                link="f/phim-le-moi-nhat"
            />
            <LatestMovie
                slug="phim-bo"
                year="2025"
                bg="linear-gradient(90deg, #ffe082, #ffffff, #ffe082)"
                title="Phim bộ mới nhất 2025"
                link="f/phim-bo-moi-nhat"
            />
        </div>
    );
}

export default Home;

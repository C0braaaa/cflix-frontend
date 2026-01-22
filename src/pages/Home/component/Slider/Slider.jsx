import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-creative';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { toast } from 'react-toastify';

import styles from './Slider.module.scss';
import { faHeart, faPen, faPlay, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toggleFavoriteAPI, togglePlaylistAPI, checkMovieStatusAPI } from '../../../../services/userServices';
import { useAuth } from '../../../../features/auth/context/AuthContext';
import { deleteSliderAPI } from '../../../../services/sliderServices';
const cx = classNames.bind(styles);

function Slider({ sliders, onSuccess, onEdit }) {
    const [favoritesList, setFavoritesList] = useState([]);
    const [playlistList, setPlaylistList] = useState([]);
    const { user } = useAuth();

    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    useEffect(() => {
        const fetchSliderStatus = async () => {
            if (user && sliders.length > 0) {
                try {
                    const promises = sliders.map((item) => checkMovieStatusAPI(item.slug));

                    const results = await Promise.all(promises);

                    const newFavs = [];
                    const newPlaylists = [];

                    results.forEach((res, index) => {
                        if (res?.data?.isFavorite) {
                            newFavs.push({ slug: sliders[index].slug });
                        }
                        if (res?.data?.isPlaylist) {
                            newPlaylists.push({ slug: sliders[index].slug });
                        }
                    });

                    setFavoritesList(newFavs);
                    setPlaylistList(newPlaylists);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchSliderStatus();
    }, [user, sliders]);

    // favorite slider action
    const handleSliderFavorite = async (item) => {
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

    // playlist slider action
    const handleSliderPlaylist = async (item) => {
        try {
            const dataToSave = {
                slug: item.slug,
                name: item.name,
                origin_name: item.origin_name,
                poster_url: item.poster_url,
            };

            const res = await togglePlaylistAPI(dataToSave);

            if (res && res.status) {
                toast.success(res.msg);

                setPlaylistList((prev) => {
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

    const handleDeleteSlider = async (id) => {
        try {
            const res = await deleteSliderAPI(id);
            if (res && res.status) {
                toast.success('Xóa slide thành công!');
                if (onSuccess) onSuccess();
            } else {
                toast.error('Xóa slide thất bại!');
            }
        } catch (error) {
            console.log(error);
            toast.error('Có lỗi xảy ra khi xóa!');
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
        <Swiper
            modules={[Pagination, Autoplay, EffectFade]}
            pagination={{
                clickable: true,
                renderBullet: (index, className) => {
                    return `<span class="${className}">
                            <img src="${sliders[index]?.poster_url || ''}" alt="thumb" />
                            </span>
                            `;
                },
            }}
            autoplay={{ delay: 50000, disableOnInteraction: false }}
            loop={sliders.length > 1}
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
            {sliders.map((item) => {
                const isFav = favoritesList.some((fav) => fav.slug === item.slug);
                const isPla = playlistList.some((pla) => pla.slug === item.slug);
                return (
                    <SwiperSlide key={item._id}>
                        <div className={cx('slide')}>
                            <div className={cx('slide-elements')}>
                                <div className={cx('cover-fade')}>
                                    <div className={cx('cover-image')}>
                                        <img className={cx('cover-img')} src={item?.thumb_url} alt="cover" />
                                    </div>
                                </div>
                                <div className={cx('slide-info')}>
                                    <Link to={item?.to_info_page}>
                                        <h2 className={cx('movie-title')}>{item?.name}</h2>
                                        <p className={cx('movie-eng-title')}>{item?.origin_name}</p>
                                    </Link>
                                    <div className={cx('movie-tags-1')}>
                                        <div className={cx('IMDb-tag')}>
                                            <span>{item?.imdb}</span>
                                        </div>
                                        <div className={cx('quality-tag')}>
                                            <span>{item.quality}</span>
                                        </div>

                                        <div className={cx('tag-model')}>
                                            <span>{item.tag_model}</span>
                                        </div>
                                        {item.tag_classic.map((info, index) => {
                                            return (
                                                <div className={cx('tag-classic')} key={index}>
                                                    <span>{info}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className={cx('movie-tags-2')}>
                                        {item.types.map((topic, index) => {
                                            return (
                                                <div className={cx('tag-topic')} key={index}>
                                                    <span>{topic}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className={cx('movie-description')}>{decodeHTML(item.content)}</p>
                                    <div className={cx('movie-actions')}>
                                        <Link to={item.to_watch_page} className={cx('play')}>
                                            <FontAwesomeIcon className={cx('play-icon')} icon={faPlay} />
                                        </Link>
                                        {user && (
                                            <div className={cx('group-actions')}>
                                                <Tippy content="Yêu thích" offset={[0, -5]} placement="bottom">
                                                    <div
                                                        className={cx('action-item')}
                                                        onClick={() => handleSliderFavorite(item)}
                                                        style={{
                                                            color: isFav ? '#EC4899' : 'white',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faHeart} />
                                                    </div>
                                                </Tippy>
                                                <Tippy content="Xem sau" offset={[0, -5]} placement="bottom">
                                                    <div
                                                        className={cx('action-item')}
                                                        onClick={() => handleSliderPlaylist(item)}
                                                        style={{
                                                            color: isPla ? 'var(--primary-color)' : 'white',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} />
                                                    </div>
                                                </Tippy>
                                                {user.role === 'admin' && (
                                                    <>
                                                        <Tippy
                                                            content="Xóa khỏi Slide"
                                                            offset={[0, -5]}
                                                            placement="bottom"
                                                        >
                                                            <div
                                                                className={cx('action-item')}
                                                                onClick={() => handleDeleteSlider(item._id)}
                                                            >
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </div>
                                                        </Tippy>
                                                        <Tippy
                                                            content="Chỉnh sửa Slide"
                                                            offset={[0, -5]}
                                                            placement="bottom"
                                                        >
                                                            <div
                                                                className={cx('action-item')}
                                                                onClick={() => {
                                                                    if (onEdit) onEdit(item);
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faPen} />
                                                            </div>
                                                        </Tippy>
                                                    </>
                                                )}
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
    );
}

export default Slider;

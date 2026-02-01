import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faX } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

import { getContinueWatchingAPI } from '../../../../services/userServices';
import styles from './ContinueWatching.module.scss';

const cx = classNames.bind(styles);
function ContinueWatching() {
    const formatDuration = (totalSeconds) => {
        const seconds = Math.round(totalSeconds);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) {
            return `${h}h ${m}p`;
        }
        return `${m}p`;
    };
    const [continueWatchingList, setContinueWatchingList] = useState([]);
    const [isLoader, setIsLoader] = useState(false);

    useEffect(() => {
        const fetchContinueWatching = async () => {
            try {
                setIsLoader(true);
                const res = await getContinueWatchingAPI();
                setContinueWatchingList(res.data.items || []);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách xem tiếp:', error);
            } finally {
                setIsLoader(false);
            }
        };
        fetchContinueWatching();
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h2 className={cx('title')}>Xem tiếp</h2>
                <Link to="user/xem-tiep" className={cx('cat-more')}>
                    <span>Xem thêm</span>
                    <FontAwesomeIcon icon={faAngleRight} />
                </Link>
            </div>
            {isLoader ? (
                <div className={cx('loader')}></div>
            ) : (
                <div className={cx('content')}>
                    <Swiper
                        modules={[FreeMode, Navigation]}
                        // navigation={true}
                        freeMode={true}
                        grabCursor={true}
                        spaceBetween={20}
                        slidesPerView={'auto'}
                        className={cx('list-items')}
                    >
                        {continueWatchingList.map((item) => (
                            <SwiperSlide key={item.slug} className={cx('item')}>
                                <Link to={`/xem-phim/${item.slug}/${item.episode_slug}`}>
                                    <div className={cx('poster')}>
                                        <img src={item.poster_url} alt={`Poster của ${item.name}`} />
                                        <Tippy content="Xóa">
                                            <div className={cx('removed')}>
                                                <FontAwesomeIcon icon={faX} />
                                            </div>
                                        </Tippy>
                                    </div>
                                    <div className={cx('progress')}>
                                        <div
                                            className={cx('progress-bar')}
                                            style={{
                                                width: `${Math.min((item.current_time / item.duration) * 100, 100)}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className={cx('time')}>
                                        {item.episode_name.toLowerCase() !== 'full' && (
                                            <span className={cx('episode-name')}>{item.episode_name}&nbsp;•&nbsp;</span>
                                        )}
                                        <span className={cx('current-time')}>
                                            {`${formatDuration(item.current_time)} / ${formatDuration(item.duration)}`}
                                        </span>
                                    </div>
                                    <div className={cx('info')}>
                                        <h5 className={cx('name')}>{item.name}</h5>
                                        <p className={cx('origin-name')}>{item.origin_name}</p>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
}

export default ContinueWatching;

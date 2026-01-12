import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faX } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import { getMeAPI } from '../../../../services/authServices';
import 'tippy.js/dist/tippy.css';

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

    useEffect(() => {
        const fetchContinueWatching = async () => {
            try {
                const res = await getMeAPI();
                setContinueWatchingList(res.user?.continue_watching || []);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách xem tiếp:', error);
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
            <div className={cx('content')}>
                <div className={cx('list-items')}>
                    {continueWatchingList.reverse().map((item) => (
                        <Link to={`/xem-phim/${item.slug}/${item.episode_slug}`} className={cx('item')} key={item.slug}>
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
                                    style={{ width: `${Math.min((item.current_time / item.duration) * 100, 100)}%` }}
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
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ContinueWatching;

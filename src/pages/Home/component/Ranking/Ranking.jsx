import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Ranking.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faEye, faFilm, faHeart } from '@fortawesome/free-solid-svg-icons';
import { getTopViewedAPI } from '../../../../services/viewsService';
import { getTopLikedAPI } from '../../../../services/ratingService';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Ranking() {
    const [topViewed, setTopViewed] = useState([]);
    const [topLiked, setTopLiked] = useState([]);
    const [showFullList, setShowFullList] = useState(null);
    useEffect(() => {
        const run = async () => {
            try {
                const res = await getTopViewedAPI();
                setTopViewed(res?.data);
            } catch (error) {
                console.log(error);
            }
        };
        run();
    }, []);

    useEffect(() => {
        const run = async () => {
            try {
                const res = await getTopLikedAPI();
                setTopLiked(res?.data);
            } catch (error) {
                console.log(error);
            }
        };
        run();
    }, []);

    useEffect(() => {
        if (showFullList !== null) {
            // const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            // document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = '';
            // document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [showFullList]);
    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('left')}>
                        <div className={cx('header')}>
                            <FontAwesomeIcon icon={faFilm} />
                            <h2 className={cx('title')}>XEM NHIỀU NHẤT</h2>
                        </div>
                        <div className={cx('content')}>
                            {topViewed?.slice(0, 5).map((item, index) => (
                                <Link to={`/phim/${item.slug}`} className={cx('item')} key={item?.slug}>
                                    <span className={cx('rank')}>{index + 1}.</span>
                                    <div className={cx('poster')}>
                                        <img src={item.poster_url} alt={`${item.name} poster`} />
                                    </div>
                                    <p className={cx('name')}>{item.name}</p>
                                    <span className={cx('views')}>
                                        <FontAwesomeIcon icon={faEye} /> {item.views}
                                    </span>
                                </Link>
                            ))}
                        </div>
                        <div className={cx('footer')}>
                            <div className={cx('view-all')} onClick={() => setShowFullList(1)}>
                                {showFullList !== null && showFullList === 1 ? (
                                    <FontAwesomeIcon icon={faCaretUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faCaretDown} />
                                )}
                                <span>Xem thêm</span>
                            </div>
                        </div>
                    </div>
                    <div className={cx('right')}>
                        <div className={cx('header')}>
                            <FontAwesomeIcon icon={faHeart} />
                            <h2 className={cx('title')}>YÊU THÍCH NHẤT</h2>
                        </div>
                        <div className={cx('content')}>
                            {topLiked?.slice(0, 5).map((item, index) => (
                                <Link to={`/phim/${item.slug}`} className={cx('item')} key={item?.slug}>
                                    <span className={cx('rank')}>{index + 1}.</span>
                                    <div className={cx('poster')}>
                                        <img src={item.poster_url} alt={`${item.name} poster`} />
                                    </div>
                                    <p className={cx('name')}>{item.name}</p>
                                    <span className={cx('views')}>
                                        <FontAwesomeIcon icon={faHeart} /> {item.likesCount}
                                    </span>
                                </Link>
                            ))}
                        </div>
                        <div className={cx('footer')}>
                            <div className={cx('view-all')} onClick={() => setShowFullList(2)}>
                                {showFullList !== null && showFullList === 2 ? (
                                    <FontAwesomeIcon icon={faCaretUp} />
                                ) : (
                                    <FontAwesomeIcon icon={faCaretDown} />
                                )}
                                <span>Xem thêm</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showFullList !== null && (
                <div className={cx('full-list')}>
                    <div className={cx('overlay')}></div>
                    <div className={cx('modal')}>
                        <div className={cx('header')}>
                            {showFullList === 1 && <FontAwesomeIcon icon={faFilm} />}
                            {showFullList === 2 && <FontAwesomeIcon icon={faHeart} />}
                            <h2 className={cx('title')}>
                                {showFullList === 1 && 'XEM NHIỀU NHẤT'}
                                {showFullList === 2 && 'YÊU THÍCH NHẤT'}
                            </h2>
                            <span className={cx('close')} onClick={() => setShowFullList(null)}>
                                &times;
                            </span>
                        </div>
                        {showFullList === 1 ? (
                            <div className={cx('content')}>
                                {topViewed?.slice(0, 10).map((item, index) => (
                                    <Link to={`/phim/${item.slug}`} className={cx('item')} key={item?.slug}>
                                        <span className={cx('rank')}>{index + 1}.</span>
                                        <div className={cx('poster')}>
                                            <img src={item.poster_url} alt={`${item.name} poster`} />
                                        </div>
                                        <p className={cx('name')}>{item.name}</p>
                                        <span className={cx('views')}>
                                            <FontAwesomeIcon icon={faEye} /> {item.views}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className={cx('content')}>
                                {topLiked?.slice(0, 10).map((item, index) => (
                                    <Link to={`/phim/${item.slug}`} className={cx('item')} key={item?.slug}>
                                        <span className={cx('rank')}>{index + 1}.</span>
                                        <div className={cx('poster')}>
                                            <img src={item.poster_url} alt={`${item.name} poster`} />
                                        </div>
                                        <p className={cx('name')}>{item.name}</p>
                                        <span className={cx('views')}>
                                            <FontAwesomeIcon icon={faHeart} /> {item.likesCount}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Ranking;

import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    faBookmark,
    faCaretDown,
    faCaretUp,
    faHeart,
    faPlay,
    faShare,
    faThumbsDown,
    faThumbsUp,
    faLock,
} from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../features/auth/context/AuthContext';
import styles from './MovieInfo.module.scss';
import Button from '../../components/Button/index-button';
import { toggleFavoriteAPI, togglePlaylistAPI, checkMovieStatusAPI } from '../../services/userServices';
import { checkMovieBlockedAPI } from '../../services/movieBlockService';
import { toggleDislikeAPI, toggleLikeAPI, getRatingAPI } from '../../services/ratingService';
import { detail } from '../../services/moviesServices';
import Comment from '../../layout/components/Comments/Comments';

const cx = classNames.bind(styles);
function MovieInfo() {
    const { slug } = useParams();
    const { openModal, user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showMore, setShowMore] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isPlaylist, setIsPlaylist] = useState(false);
    const [ratingInfo, setRatingInfo] = useState({
        totalLikes: 0,
        totalDislikes: 0,
        userStatus: 'neutral',
    });

    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    useEffect(() => {
        const checkStatus = async () => {
            if (slug && user) {
                try {
                    const res = await checkMovieStatusAPI(slug);
                    if (res && res.data) {
                        setIsFavorite(res.data.isFavorite);
                        setIsPlaylist(res.data.isPlaylist);
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                setIsFavorite(false);
                setIsPlaylist(false);
            }
        };
        checkStatus();

        const checkBlocked = async () => {
            if (slug) {
                try {
                    const res = await checkMovieBlockedAPI(slug);
                    if (res?.data?.isBlocked) {
                        setIsBlocked(true);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };
        checkBlocked();
    }, [slug, user]);

    // handle click favorite
    const handleAddFavorite = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để thêm yêu thích!');
            openModal('login');
            return;
        }
        try {
            const res = await toggleFavoriteAPI({
                slug: movie.slug,
                name: movie.name,
                origin_name: movie.origin_name,
                poster_url: movie.poster_url,
            });

            if (res && res.status) {
                setIsFavorite((prev) => !prev);
                toast.success(res.msg);
            }
        } catch (error) {
            console.log(error);
            toast.error('Vui lòng đăng nhập để lưu phim!');
            openModal('login');
        }
    };

    // handle click playlist
    const handleAddPlaylist = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để thêm vào danh sách xem sau!');
            openModal('login');
            return;
        }
        try {
            const res = await togglePlaylistAPI({
                slug: movie.slug,
                name: movie.name,
                origin_name: movie.origin_name,
                poster_url: movie.poster_url,
            });

            if (res && res.status) {
                setIsPlaylist((prev) => !prev);
                toast.success(res.msg);
            }
        } catch (error) {
            console.log(error);
            toast.error('Vui lòng đăng nhập để lưu phim!');
            openModal('login');
        }
    };

    // rating movie
    useEffect(() => {
        const fetchRating = async () => {
            if (slug) {
                try {
                    const res = await getRatingAPI(slug);
                    if (res && res.status && res.data) {
                        setRatingInfo({
                            ...res.data,
                            userStatus: user ? res.data.userStatus : 'neutral',
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchRating();
    }, [slug, user]);
    // toggle like
    const handleToggleLike = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để đánh giá phim!');
            return;
        }
        const oldStatus = ratingInfo.userStatus;
        let newStatus = oldStatus === 'liked' ? 'neutral' : 'liked';
        let newLikes = ratingInfo.totalLikes + (newStatus === 'liked' ? 1 : -1);
        let newDislikes = ratingInfo.totalDislikes;
        if (oldStatus === 'disliked' && newStatus === 'liked') {
            newDislikes -= 1;
        }
        setRatingInfo({
            totalLikes: newLikes,
            totalDislikes: newDislikes,
            userStatus: newStatus,
        });
        try {
            await toggleLikeAPI({ slug, name: movie.name, poster_url: movie.poster_url });
        } catch (error) {
            setRatingInfo({ ...ratingInfo, userStatus: oldStatus });
            toast.error('Lỗi kết nối');
            console.log(error);
        }
    };
    // toggle dislike
    const handleToggleDislike = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để đánh giá phim!');
            return;
        }
        const oldStatus = ratingInfo.userStatus;
        let newStatus = oldStatus === 'disliked' ? 'neutral' : 'disliked';
        let newDislikes = ratingInfo.totalDislikes + (newStatus === 'disliked' ? 1 : -1);
        let newLikes = ratingInfo.totalLikes;
        if (oldStatus === 'liked' && newStatus === 'disliked') {
            newLikes -= 1;
        }
        setRatingInfo({
            totalLikes: newLikes,
            totalDislikes: newDislikes,
            userStatus: newStatus,
        });
        try {
            await toggleDislikeAPI({ slug, name: movie.name, poster_url: movie.poster_url });
        } catch (error) {
            setRatingInfo({ ...ratingInfo, userStatus: oldStatus });
            toast.error('Lỗi kết nối');
            console.log(error);
        }
    };
    // rating point
    const caculateRatingPoint = () => {
        const { totalLikes, totalDislikes } = ratingInfo;
        if (totalLikes === 0 && totalDislikes === 0) return '0';
        const point = (totalLikes / (totalLikes + totalDislikes)) * 9;
        return point.toFixed(1);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        movie.name ? (document.title = `Thông tin phim ${movie.name}`) : (document.title = 'Thông tin phim');
    }, [movie]);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                const data = await detail(slug);
                setMovie(data.movie);
                setEpisodes(data.episodes);
            } catch (error) {
                console.error('Chet me API no loi cho nao roi:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [slug]);

    const DetailContent = (
        <>
            <div className={cx('tags')}>
                <div className={cx('tag-tmdb')}>
                    <span>{movie?.tmdb?.vote_average ? movie?.tmdb?.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
                <div className={cx('tag-quality')}>
                    <span>{movie.quality}</span>
                </div>
                <div className={cx('tag-year')}>
                    <span>{movie.year}</span>
                </div>
                <div className={cx('tag-duration')}>
                    <span>{movie.time}</span>
                </div>
            </div>
            <div className={cx('types')}>
                {movie?.category?.map((item, index) => (
                    <div className={cx('type')} key={index}>
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
            <div className={cx('description')}>
                <h2 className={cx('title')}>Nội dung:</h2>
                <p className={cx('desc')}>{decodeHTML(movie.content)}</p>
            </div>
            <p className={cx('country')}>
                Quốc gia: <span>{movie?.country?.[0]?.name}</span>
            </p>
            <p className={cx('actor')}>
                Diễn viên:{' '}
                {movie?.actor?.map((actor, index) => (
                    <a href={`https://www.google.com/search?q=${actor}`} target="_blank" rel="noreferrer" key={index}>
                        {decodeHTML(actor)}
                        {index < movie.actor.length - 1 && ', '}
                    </a>
                ))}
            </p>
            <p className={cx('director')}>
                Đạo diễn:{' '}
                <a
                    href={`https://www.google.com/search?q=${movie?.director?.join(', ')}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    {movie?.director?.join(', ')}
                </a>
            </p>
        </>
    );

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: movie.name,
                    text: `Xem phim ${movie.name} tại CFLIX`,
                    url: url,
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                toast.success('Đã copy link phim!');
            } catch (error) {
                toast.error('Không thể copy link!');
                console.log('Lỗi share: ', error);
            }
        }
    };

    // UI Load Skeleton
    const SkeletonDetailContent = (
        <div className={cx('skeleton-container')}>
            {/* Giả lập Tags */}
            <div className={cx('skeleton-tags')}>
                <div className={cx('skeleton', 'skeleton-tag')}></div>
                <div className={cx('skeleton', 'skeleton-tag')}></div>
                <div className={cx('skeleton', 'skeleton-tag')}></div>
                <div className={cx('skeleton', 'skeleton-tag')}></div>
            </div>

            {/* Giả lập Types */}
            <div className={cx('skeleton-tags')} style={{ marginTop: '0' }}>
                <div className={cx('skeleton', 'skeleton-tag')} style={{ width: '8rem' }}></div>
                <div className={cx('skeleton', 'skeleton-tag')} style={{ width: '8rem' }}></div>
            </div>

            {/* Giả lập Description */}
            <div className={cx('skeleton', 'skeleton-text', 'short')} style={{ marginTop: '2rem' }}></div>
            <div className={cx('skeleton', 'skeleton-text')}></div>
            <div className={cx('skeleton', 'skeleton-text')}></div>
            <div className={cx('skeleton', 'skeleton-text')}></div>
            <div className={cx('skeleton', 'skeleton-text', 'medium')}></div>

            {/* Giả lập Country, Actor, Director */}
            <div className={cx('skeleton', 'skeleton-text', 'short')} style={{ marginTop: '1rem' }}></div>
            <div className={cx('skeleton', 'skeleton-text', 'medium')}></div>
            <div className={cx('skeleton', 'skeleton-text', 'medium')}></div>
        </div>
    );

    if (isBlocked) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('thumbnail')}>
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#000',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <FontAwesomeIcon icon={faLock} color="#333" style={{ fontSize: '10rem' }} />
                    </div>
                </div>
                <div className={cx('content')}>
                    <div className={cx('left-side')}>
                        <div
                            className={cx('poster')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faLock}
                                color="#ff4d4f"
                                style={{ fontSize: '4rem', marginBottom: '1rem' }}
                            />
                        </div>
                        <h2 className={cx('name')}>Nội dung đã khóa</h2>
                        <p className={cx('origin-name')}>Không khả dụng</p>
                        <div className={cx('description')} style={{ marginTop: '2rem' }}>
                            <h2 className={cx('title')}>Lý do:</h2>
                            <p className={cx('desc')} style={{ color: '#ff4d4f' }}>
                                Phim này tạm thời bị khóa do vi phạm các điều khoản dịch vụ của chúng tôi.
                            </p>
                        </div>
                    </div>
                    <div className={cx('right-side')} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <FontAwesomeIcon
                                icon={faLock}
                                style={{ fontSize: '6rem', marginBottom: '20px', color: '#ff4d4f' }}
                            />
                            <h2 style={{ fontSize: '2.4rem', marginBottom: '10px', color: 'white' }}>
                                Nội Dung Đã Bị Khóa
                            </h2>
                            <p style={{ fontSize: '1.6rem', color: '#ccc', marginBottom: '30px' }}>
                                Rất tiếc! Bộ phim bạn yêu cầu hiện không thể xem được vì lý do bản quyền hoặc vi phạm
                                nội dung.
                            </p>
                            <Link to="/">
                                <Button primary>Về trang chủ</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('thumbnail')}>
                <img src={movie.thumb_url} alt={movie.name} />
            </div>
            <div className={cx('content')}>
                <div className={cx('left-side')}>
                    <div className={cx('poster', { skeleton: loading, 'skeleton-box': loading })}>
                        {!loading && <img src={movie.poster_url} alt={movie.name} />}
                    </div>
                    {loading ? (
                        <>
                            <div className={cx('skeleton', 'skeleton-title')}></div>
                            <div className={cx('skeleton', 'skeleton-text', 'short')}></div>
                        </>
                    ) : (
                        <>
                            <h2 className={cx('name')}>{movie.name}</h2>
                            <p className={cx('origin-name')}>{movie.origin_name}</p>
                        </>
                    )}
                    {isMobile ? (
                        <>
                            {!loading && (
                                <p className={cx('more')} onClick={() => setShowMore((prev) => !prev)}>
                                    Thông tin thêm{' '}
                                    {showMore ? (
                                        <FontAwesomeIcon icon={faCaretUp} />
                                    ) : (
                                        <FontAwesomeIcon icon={faCaretDown} />
                                    )}
                                </p>
                            )}
                            {loading ? SkeletonDetailContent : showMore && DetailContent}
                        </>
                    ) : loading ? (
                        SkeletonDetailContent
                    ) : (
                        DetailContent
                    )}
                </div>
                <div className={cx('right-side')}>
                    <div className={cx('l-1')}>
                        <Link
                            to={`/xem-phim/${movie.slug}/${episodes?.[0]?.server_data?.[0]?.slug}`}
                            className={cx('btn-play')}
                        >
                            <Button primary className={cx('btn')} leftIcon={<FontAwesomeIcon icon={faPlay} />}>
                                Xem ngay
                            </Button>
                        </Link>
                        <div className={cx('actions')}>
                            <div
                                className={cx('action')}
                                onClick={handleAddFavorite}
                                style={{ color: isFavorite ? '#ff0000' : 'white', cursor: 'pointer' }}
                            >
                                <FontAwesomeIcon icon={faHeart} />
                                <span className={cx('title')}>Yêu thích</span>
                            </div>
                            <div
                                className={cx('action')}
                                onClick={handleAddPlaylist}
                                style={{ color: isPlaylist ? 'var(--primary-color)' : 'white', cursor: 'pointer' }}
                            >
                                <FontAwesomeIcon icon={faBookmark} />
                                <span className={cx('title')}>Xem sau</span>
                            </div>
                            <div className={cx('action')} onClick={handleShare}>
                                <FontAwesomeIcon icon={faShare} />
                                <span className={cx('title')}>Chia sẻ</span>
                            </div>
                            <div className={cx('action')} onClick={handleToggleLike}>
                                <FontAwesomeIcon
                                    icon={faThumbsUp}
                                    color={ratingInfo.userStatus === 'liked' ? 'greenyellow' : ''}
                                />
                                <span className={cx('title')}>{ratingInfo.totalLikes}</span>
                            </div>
                            <div className={cx('action')} onClick={handleToggleDislike}>
                                <FontAwesomeIcon
                                    icon={faThumbsDown}
                                    color={ratingInfo.userStatus === 'disliked' ? 'red' : ''}
                                />
                                <span className={cx('title')}>{ratingInfo.totalDislikes}</span>
                            </div>
                        </div>
                        <div className={cx('rating')}>
                            <span>{caculateRatingPoint()}</span>
                        </div>
                    </div>
                    {movie?.episode_total > 1 && (
                        <div className={cx('l-2')}>
                            <div className={cx('episodes')}>
                                <h2 className={cx('total-episodes')}>Số tập: {movie.episode_total}</h2>
                                <h2 className={cx('status')}>Trạng thái: {movie.episode_current}</h2>
                            </div>
                            <div className={cx('items')}>
                                {episodes?.[0]?.server_data?.map((ep, index) => (
                                    <Link to={`/xem-phim/${slug}/${ep.slug}`} className={cx('item')} key={index}>
                                        {ep.name.split(' ')[1]}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Comments */}
                    <Comment />
                </div>
            </div>
        </div>
    );
}

export default MovieInfo;

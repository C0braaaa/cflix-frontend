import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { toast } from 'react-toastify';

import styles from './Watch.module.scss';
import { detail } from '../../services/moviesServices';
import { getProgressAPI } from '../../services/userServices';
import { useAuth } from '../../features/auth/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleRight,
    faBookmark,
    faCircleLeft,
    faClosedCaptioning,
    faEye,
    faFlag,
    faHeart,
    faMicrophone,
    faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import Comment from '../../layout/components/Comments/Comments';
import Player from '../../components/Player/Player';
import RelatedMovies from './Content/RelatedMovies';
import { useReportModal } from '../../features/report/context/ReportModalContext';
import { toggleFavoriteAPI, togglePlaylistAPI } from '../../services/userServices';
import { checkMovieStatusAPI } from '../../services/userServices';
import { getRatingAPI } from '../../services/ratingService';
import { getViewsBySlugAPI } from '../../services/viewsService';

const cx = classNames.bind(styles);

function Wacth() {
    const { user, openModal } = useAuth();
    const { slug, episode } = useParams();
    const { openReportModal } = useReportModal();
    const [movie, setMovie] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [server, setServer] = useState(0);
    const [savedTime, setSavedTime] = useState(0);
    const [isProgressChecked, setIsProgressChecked] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isPlaylist, setIsPlaylist] = useState(false);
    const [rating, setRating] = useState([]);
    const [views, setViews] = useState([]);

    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    //get views
    useEffect(() => {
        const fetchViews = async () => {
            try {
                const res = await getViewsBySlugAPI(slug);
                if (res && res.data) {
                    setViews(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchViews();
    }, [slug]);

    // get rating
    useEffect(() => {
        const fetchRating = async () => {
            try {
                const res = await getRatingAPI(slug);
                if (res && res.data) {
                    setRating(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchRating();
    }, [slug]);

    // rating point
    const caculateRatingPoint = () => {
        const { totalLikes, totalDislikes } = rating;
        if (totalLikes === 0 && totalDislikes === 0) return '0';
        const point = (totalLikes / (totalLikes + totalDislikes)) * 9;
        return point.toFixed(1);
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
            }
        };
        checkStatus();
    }, [slug, user]);

    // handle click favorite
    const handleAddFavorite = async () => {
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

    const firstCategorySlug = movie?.category?.[0]?.slug;

    useEffect(() => {
        movie.name ? (document.title = `Xem Phim ${movie.name}`) : (document.title = 'Xem Phim');
    }, [movie]);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await detail(slug);
                setMovie(data.movie);
                setEpisodes(data.episodes);
            } catch (error) {
                console.error('Chet me API no loi cho nao roi:', error);
            }
        };

        fetchMovie();
    }, [slug]);

    useEffect(() => {
        const fetchProgress = async () => {
            if (!user) {
                setIsProgressChecked(true);
                return;
            }
            try {
                setIsProgressChecked(false);

                const res = await getProgressAPI(slug);

                const savedData = res.data;

                const currentEpSlug = episode || episodes?.[server]?.server_data?.[0]?.slug;

                if (savedData && savedData.episode_slug === currentEpSlug && savedData.current_time > 0) {
                    setSavedTime(savedData.current_time);
                } else {
                    setSavedTime(0);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsProgressChecked(true);
            }
        };

        if (episodes.length > 0) {
            fetchProgress();
        }
    }, [user, slug, episode, episodes, server]);

    const currentEpisode =
        episodes?.[server]?.server_data?.find((ep) => ep.slug === episode) ?? episodes?.[server]?.server_data?.[0];

    const m3u8Url = currentEpisode?.link_m3u8;

    if (!m3u8Url) {
        return <div className={cx('loader')}></div>;
    }
    const shouldRenderPlayer = m3u8Url && isProgressChecked;

    function getTextInBrackets(str) {
        const match = str.match(/\(([^)]+)\)/);
        return match ? match[1] : '';
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('left-side')}>
                <div className={cx('l-1')}>
                    <Link to={`/phim/${slug}`}>
                        <FontAwesomeIcon icon={faCircleLeft} />
                    </Link>
                    <h2 className={cx('title')}>
                        <span>{movie.name}</span>
                    </h2>
                </div>
                <div className={cx('video')}>
                    {shouldRenderPlayer ? (
                        <Player
                            option={{
                                url: m3u8Url,
                                seekTime: savedTime, // Thời gian cần tua tới
                                poster: movie.poster_url, // Ảnh nền khi chưa play
                                title: currentEpisode?.name,
                            }}
                            movieData={{
                                slug: movie.slug,
                                name: movie.name,
                                origin_name: movie.origin_name,
                                poster_url: movie.poster_url,
                                episode_slug: currentEpisode?.slug,
                                episode_name: currentEpisode?.name,
                                type: movie.type,
                            }}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '1rem 1rem 0 0',
                                overflow: 'hidden',
                            }}
                        />
                    ) : (
                        <div className={cx('loader')}></div>
                    )}
                    <div className={cx('actions')}>
                        <div
                            className={cx('action')}
                            onClick={handleAddFavorite}
                            style={{ color: isFavorite ? '#ff0000' : 'white', cursor: 'pointer' }}
                        >
                            <FontAwesomeIcon icon={faHeart} />
                            <span>Yêu thích</span>
                        </div>
                        <div
                            className={cx('action')}
                            onClick={handleAddPlaylist}
                            style={{ color: isPlaylist ? 'var(--primary-color)' : 'white', cursor: 'pointer' }}
                        >
                            <FontAwesomeIcon icon={faBookmark} />
                            <span>Xem sau</span>
                        </div>
                        <div
                            className={cx('action')}
                            onClick={() => {
                                if (!user) {
                                    toast.error('Vui lòng đăng nhập để xử dung tính năng này!');
                                    openModal('login');
                                } else {
                                    openReportModal({
                                        type: 'movie',
                                        movie_slug: movie.slug,
                                        episode: currentEpisode?.name,
                                    });
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faFlag} />
                            <span>Phản hồi</span>
                        </div>
                        <div className={cx('view')}>
                            <FontAwesomeIcon icon={faEye} />
                            <span>{views?.views || 0}</span>
                        </div>
                    </div>
                </div>
                <div className={cx('content')}>
                    <div className={cx('movie-meta')}>
                        <div className={cx('movie-info')}>
                            <div className={cx('poster')}>
                                <img src={movie?.poster_url} alt={movie?.name} />
                            </div>
                            <div className={cx('details')}>
                                <h4 className={cx('movie-name')}>{decodeHTML(movie?.name)}</h4>
                                <p className={cx('origin-name')}>{decodeHTML(movie?.origin_name)}</p>
                                <div className={cx('tags')}>
                                    {movie?.category?.map((cat) => (
                                        <Link className={cx('tag')} key={cat.id} to={`/the-loai/${cat.slug}`}>
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className={cx('description')}>
                                <p className={cx('descr')}>{decodeHTML(movie?.content)}</p>
                                <div className={cx('more-info')}>
                                    <Link to={`/phim/${slug}`} className={cx('view-more')}>
                                        Thông tin phim <FontAwesomeIcon icon={faAngleRight} />
                                    </Link>
                                    <div className={cx('rating')}>{caculateRatingPoint()}</div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('options')}>
                            <h2>Các bản chiếu</h2>
                            <div className={cx('options-list')}>
                                {episodes?.map((sv, i) => (
                                    <div
                                        key={i}
                                        className={cx('option', { active: server === i })}
                                        onClick={() => setServer(i)}
                                    >
                                        {/* Icon Vietsub */}
                                        {sv.server_name.toLowerCase().includes('viet') && (
                                            <FontAwesomeIcon icon={faClosedCaptioning} />
                                        )}

                                        {sv.server_name.toLowerCase().includes('lồng') && (
                                            <FontAwesomeIcon icon={faMicrophone} />
                                        )}
                                        {sv.server_name.toLowerCase().includes('thuy') && (
                                            <FontAwesomeIcon icon={faVolumeHigh} />
                                        )}

                                        <span>{getTextInBrackets(sv.server_name)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {movie?.episode_total > 1 && (
                            <>
                                <h2 className={cx('title-2')}>Danh sách tập</h2>
                                <div className={cx('episodes')}>
                                    {episodes?.[server]?.server_data?.map((ep, index) => (
                                        <Link
                                            to={`/xem-phim/${slug}/${ep.slug}`}
                                            className={cx('episode', { active: ep.slug === episode })}
                                            key={index}
                                        >
                                            {ep.name.split(' ')[1]?.replace(/\D/g, '')}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                        {/* Comments */}
                        <Comment />
                    </div>
                </div>
            </div>
            <div className={cx('realated-movies')}>
                <RelatedMovies currentSlug={slug} categorySlug={firstCategorySlug} />
            </div>
        </div>
    );
}

export default Wacth;

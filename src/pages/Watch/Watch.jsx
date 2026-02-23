import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Watch.module.scss';
import { detail } from '../../services/moviesServices';
import { getProgressAPI } from '../../services/userServices';
import { useAuth } from '../../features/auth/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleRight,
    faCircleLeft,
    faClosedCaptioning,
    faFlag,
    faHeart,
    faMicrophone,
    faPlus,
    faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import Comment from '../../layout/components/Comments/Comments';
import Player from '../../components/Player/Player';
import RelatedMovies from './Content/RelatedMovies';

const cx = classNames.bind(styles);

function Wacth() {
    const { user } = useAuth();
    const { slug, episode } = useParams();
    const [movie, setMovie] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [server, setServer] = useState(0);
    const [savedTime, setSavedTime] = useState(0);
    const [isProgressChecked, setIsProgressChecked] = useState(false);

    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
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
                                url: m3u8Url, // Link m3u8
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
                                // aspectRatio: '16/9',
                                // height: 'auto',
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
                        <div className={cx('action')}>
                            <FontAwesomeIcon icon={faHeart} />
                            <span>Yêu thích</span>
                        </div>
                        <div className={cx('action')}>
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Xem sau</span>
                        </div>
                        <div className={cx('action')}>
                            <FontAwesomeIcon icon={faFlag} />
                            <span>Phản hồi</span>
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
                                <Link to={`/phim/${slug}`} className={cx('view-more')}>
                                    Thông tin phim <FontAwesomeIcon icon={faAngleRight} />
                                </Link>
                            </div>
                        </div>
                        <div className={cx('options')}>
                            <h2>Các bản chiếu</h2>

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

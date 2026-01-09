import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Watch.module.scss';
import { detail } from '../../services/moviesServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleLeft, faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';
import Comment from '../../layout/components/Comments/Comments';

const cx = classNames.bind(styles);

function Wacth() {
    const { slug, episode } = useParams();
    const [movie, setMovie] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [server, setServer] = useState(0);

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

    const currentEpisode =
        episodes?.[server]?.server_data?.find((ep) => ep.slug === episode) ?? episodes?.[server]?.server_data?.[0];

    const m3u8Url = currentEpisode?.link_m3u8;

    if (!m3u8Url) {
        return <div className={cx('loading')}>Đang tải video...</div>;
    }

    // console.log(currentEpisode);

    function getTextInBrackets(str) {
        const match = str.match(/\(([^)]+)\)/);
        return match ? match[1] : '';
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('l-1')}>
                <Link to={`/phim/${slug}`}>
                    <FontAwesomeIcon icon={faCircleLeft} />
                </Link>
                <h2 className={cx('title')}>
                    Xem thông tin phim: <span>{movie.name}</span>
                </h2>
            </div>
            <div className={cx('video')}>
                <iframe
                    key={movie._id}
                    src={currentEpisode?.link_embed}
                    width="100%"
                    height="100%"
                    allowFullScreen
                    loading="lazy"
                    frameBorder="0"
                    title={movie.name}
                    style={{ borderRadius: ' 1rem 1rem 0 0' }}
                ></iframe>
                <div className={cx('actions')}>
                    <div className={cx('action')}>
                        <FontAwesomeIcon icon={faHeart} />
                        <span>Yêu thích</span>
                    </div>
                    <div className={cx('action')}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Xem sau</span>
                    </div>
                </div>
            </div>
            <div className={cx('options')}>
                <h2>Các bản chiếu</h2>

                {episodes?.map((sv, i) => (
                    <div key={i} className={cx('option', { active: server === i })} onClick={() => setServer(i)}>
                        {/* Icon Vietsub */}
                        {sv.server_name.toLowerCase().includes('viet') && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="21"
                                height="21"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                                <line x1="7" y1="12" x2="17" y2="12" />
                                <line x1="7" y1="16" x2="13" y2="16" />
                            </svg>
                        )}

                        {/* Icon Thuyết Minh */}
                        {sv.server_name.toLowerCase().includes('thuy') && (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1 -8 0V5a4 4 0 0 1 4 -4z" />
                                <path d="M19 10v2a7 7 0 0 1 -14 0v-2" />
                                <line x1="12" y1="19" x2="12" y2="23" />
                                <line x1="8" y1="23" x2="16" y2="23" />
                            </svg>
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
    );
}

export default Wacth;

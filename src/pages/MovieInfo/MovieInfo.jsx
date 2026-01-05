import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams, Link } from 'react-router-dom';

import styles from './MovieInfo.module.scss';
import Button from '../../components/Button/index-button';
import {
    faCaretDown,
    faCaretUp,
    faHeart,
    faPlay,
    faPlus,
    faThumbsDown,
    faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';
import { detail } from '../../services/moviesServices';
import Comment from '../../layout/components/Comments/Comments';

const cx = classNames.bind(styles);

function MovieInfo() {
    const { slug } = useParams();

    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showMore, setShowMore] = useState(false);

    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
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
                            <div className={cx('action')}>
                                <FontAwesomeIcon icon={faHeart} />
                                <span className={cx('title')}>Yêu thích</span>
                            </div>
                            <div className={cx('action')}>
                                <FontAwesomeIcon icon={faPlus} />
                                <span className={cx('title')}>Thêm vào</span>
                            </div>
                            <div className={cx('action')}>
                                <FontAwesomeIcon icon={faThumbsUp} />
                                <span className={cx('title')}>Thích</span>
                            </div>
                            <div className={cx('action')}>
                                <FontAwesomeIcon icon={faThumbsDown} />
                                <span className={cx('title')}>Không thích</span>
                            </div>
                        </div>
                        <div className={cx('rating')}>
                            <span>{movie?.tmdb?.vote_average ? movie?.tmdb?.vote_average.toFixed(1) : 'N/A'}</span>
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

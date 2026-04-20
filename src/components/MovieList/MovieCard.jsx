import classNames from 'classnames/bind';
import TippyHeadless from '@tippyjs/react/headless'; // dùng headless để custom UI panel
import Tippy from '@tippyjs/react'; // dùng cho quality badge
import 'tippy.js/dist/tippy.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import styles from './MovieList.module.scss';

const cx = classNames.bind(styles);

function MovieCard({ movie, type }) {
    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    const renderExtraInfo = () => {
        switch (type) {
            case 'single':
                return (
                    <>
                        <Tippy content="Chất lượng">
                            <span>{movie.quality}</span>
                        </Tippy>
                        <Tippy content="Năm phát hành">
                            <span>{movie.year}</span>
                        </Tippy>
                    </>
                );
            case 'series':
            case 'cartoon':
                return (
                    <>
                        {!movie.episode_current?.match(/\d+/)?.[0] ? (
                            <Tippy content="Movies">
                                <span>MV</span>
                            </Tippy>
                        ) : (
                            <Tippy content="Tập hiện tại">
                                <span>{movie.episode_current.match(/\d+/)?.[0] || 'TV'}</span>
                            </Tippy>
                        )}
                        <Tippy content="Năm phát hành">
                            <span>{movie.year}</span>
                        </Tippy>
                    </>
                );
            default:
                return null;
        }
    };

    const posterUrl = movie?.poster_url?.startsWith('http')
        ? movie.poster_url
        : `https://phimimg.com/${movie?.poster_url}`;

    const thumbUrl = movie?.thumb_url?.startsWith('http') ? movie.thumb_url : `https://phimimg.com/${movie?.thumb_url}`;

    // Panel hiển thị khi hover
    const HoverPanel = (attrs) => (
        <div className={cx('hover-panel')} {...attrs}>
            <div className={cx('hover-panel__thumb')}>
                <img src={thumbUrl} alt={movie.name} onError={(e) => (e.target.src = 'assets/images/defaultimg.jpg')} />
            </div>
            <div className={cx('hover-panel__body')}>
                <h4 className={cx('hover-panel__name')}>{decodeHTML(movie?.name)}</h4>
                <p className={cx('hover-panel__origin')}>{decodeHTML(movie?.origin_name)}</p>
                <div className={cx('hover-panel__meta')}>
                    {movie?.year && <span>{movie?.year}</span>}
                    {movie?.quality && <span>{movie?.quality}</span>}
                    {movie?.episode_current && <span>{movie?.episode_current}</span>}
                </div>
                <div className={cx('hover-panel__actions')}>
                    <Link
                        to={`/xem-phim/${movie?.slug}/${movie?.episode_current?.startsWith('F') ? 'full' : 'tap-01'}`}
                        className={cx('hover-panel__btn-play')}
                    >
                        <FontAwesomeIcon icon={faPlay} /> Xem ngay
                    </Link>
                    <Link to={`/phim/${movie?.slug}`} className={cx('hover-panel__btn-info')}>
                        <FontAwesomeIcon icon={faCircleInfo} /> Chi tiết
                    </Link>
                </div>
                {movie.category?.length > 0 && (
                    <div className={cx('hover-panel__genres')}>
                        {movie.category.slice(0, 3).map((cat) => (
                            <Link to={`/the-loai/${cat.slug}`} key={cat.id} className={cx('hover-panel__genre-tag')}>
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <TippyHeadless
            delay={[500, 0]}
            placement="bottom"
            offset={[-20, -380]}
            interactive
            zIndex={999}
            render={(attrs) => <HoverPanel {...attrs} />}
        >
            <div className={cx('card-wrapper')}>
                <Link to={`/phim/${movie.slug}`}>
                    <div className={cx('item')}>
                        <div className={cx('poster')}>
                            <img
                                src={posterUrl}
                                alt={movie.name}
                                onError={(e) => (e.target.src = 'assets/images/defaultimg.jpg')}
                            />
                            <div className={cx('quality')}>{renderExtraInfo()}</div>
                        </div>
                        <div className={cx('info')}>
                            <h4 className={cx('name')}>{decodeHTML(movie.name)}</h4>
                            <h4 className={cx('original-name')}>{decodeHTML(movie.origin_name)}</h4>
                        </div>
                    </div>
                </Link>
            </div>
        </TippyHeadless>
    );
}

export default MovieCard;

import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './MovieItem.module.scss';

const cx = classNames.bind(styles);
function MovieItem({ data, onClick }) {
    const decodeHTML = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    return (
        <Link to={`/phim/${data.slug}`} className={cx('wrapper')} onClick={onClick}>
            <img
                className={cx('poster')}
                src={`https://images.weserv.nl/?url=phimimg.com/${data.poster_url}`}
                alt={data.name}
                onError={(e) => (e.target.src = 'assets/images/defaultimg.jpg ')}
            />
            <div className={cx('info')}>
                <h4 className={cx('movie-name')}>
                    <span>{decodeHTML(data.name)}</span>
                </h4>
                <span className={cx('original-name')}>{decodeHTML(data.origin_name)}</span>
                <span className={cx('more-info')}>
                    {data.year} • {data.time}
                </span>
            </div>
        </Link>
    );
}

MovieItem.propTypes = {
    data: PropTypes.object.isRequired,
};

export default MovieItem;

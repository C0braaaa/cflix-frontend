import classnames from 'classnames/bind';
import { useState, useEffect } from 'react';

import styles from './MostView.module.scss';
import { getTopViewedAPI } from '../../../../services/viewsService';
const cx = classnames.bind(styles);

function MostView({ title }) {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await getTopViewedAPI('series');
                setMovies(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchMovies();
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h2 className={cx('title')}>{title}</h2>
            </div>
            <div className={cx('content')}>
                {movies.map((movie, index) => (
                    <div className={cx('item')} key={movie._id}>
                        <div className={cx('card')}>
                            <img src={movie.poster_url} alt={movie.name} />
                            <span className={cx('number', { 'is-double': index + 1 >= 10 })}>{index + 1}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MostView;

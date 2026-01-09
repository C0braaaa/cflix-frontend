import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useState, useEffect } from 'react';

import styles from './Favorite.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { getMeAPI, toggleFavoriteAPI } from '../../../../services/authServices';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Favorite() {
    const [user, setUser] = useState([]);

    useEffect(() => {
        const fecthUser = async () => {
            try {
                const res = await getMeAPI();
                setUser(res.user.favorite || []);
            } catch (error) {
                console.log(error);
            }
        };
        fecthUser();
    }, []);

    const handleRemoved = async (e, item) => {
        e.preventDefault();
        try {
            const res = await toggleFavoriteAPI({
                slug: item.slug,
            });

            if (res) {
                toast.success('Bỏ yêu thích thành công!');
                setUser((prev) => prev.filter((movie) => movie.id !== item.id));
            }
        } catch (error) {
            console.log(error);
            toast.error('Bỏ yêu thích thất bại!');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Yêu thích</h3>
            <div className={cx('list-movies')}>
                {user?.map((item) => (
                    <Link to={`/phim/${item.slug}`} className={cx('movie')} key={item._id}>
                        <div className={cx('poster')}>
                            <img src={item.poster_url} alt="poster" />
                            <Tippy content="Bỏ thích">
                                <div className={cx('remove')} onClick={(e) => handleRemoved(e, item)}>
                                    <FontAwesomeIcon icon={faX} />
                                </div>
                            </Tippy>
                        </div>
                        <div className={cx('info')}>
                            <h5 className={cx('name')}>{item.name}</h5>
                            <p className={cx('origin-name')}>{item.origin_name}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Favorite;

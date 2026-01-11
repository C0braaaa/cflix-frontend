import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useState, useEffect } from 'react';

import styles from './Favorite.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faX } from '@fortawesome/free-solid-svg-icons';
import { getMeAPI, toggleFavoriteAPI } from '../../../../services/authServices';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function Favorite() {
    const [allFavorites, setAllFavorites] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 18;

    useEffect(() => {
        const fecthUser = async () => {
            try {
                const res = await getMeAPI();
                setAllFavorites(res.user.favorite || []);
            } catch (error) {
                console.log(error);
            }
        };
        fecthUser();
    }, []);

    const totalPages = Math.ceil(allFavorites.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allFavorites.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [currentPage]);

    const handleRemoved = async (e, item) => {
        e.preventDefault();
        try {
            const res = await toggleFavoriteAPI({
                slug: item.slug,
            });

            if (res) {
                toast.success('Bỏ yêu thích thành công!');
                const newFavorites = allFavorites.filter((movie) => movie.slug !== item.slug);
                setAllFavorites(newFavorites);
                const newTotalPages = Math.ceil(newFavorites.length / itemsPerPage);
                if (currentPage > newTotalPages && newTotalPages > 0) {
                    setCurrentPage(newTotalPages);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error('Bỏ yêu thích thất bại!');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Yêu thích {`(${allFavorites.length})`}</h3>
            <div className={cx('list-movies')}>
                {currentItems?.map((item) => (
                    <Link to={`/phim/${item.slug}`} className={cx('movie')} key={item.id}>
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
            {/* Pagination */}
            {allFavorites.length > itemsPerPage && (
                <div className={cx('pagination')}>
                    <button
                        className={cx('page-btn')}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <span className={cx('page-info')}>
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        className={cx('page-btn')}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            )}
        </div>
    );
}

export default Favorite;

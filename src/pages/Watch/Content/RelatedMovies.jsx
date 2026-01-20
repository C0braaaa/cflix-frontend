import classNames from 'classnames/bind';

import styles from './RelatedMovies.module.scss';
const cx = classNames.bind(styles);

function RelatedMovies() {
    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Đề xuất cho bạn</h3>

            <div className={cx('movies-list')}>
                <div className={cx('movie')}>
                    <div className={cx('left-side')}>
                        <div className={cx('poster')}>
                            <img
                                src="https://phimimg.com/upload/vod/20251218-1/97fcfb8cfdae35b08e3b22a7e3fd3b5a.jpg"
                                alt="poster"
                            />
                        </div>
                    </div>
                    <div className={cx('right-side')}>
                        <h4 className={cx('name')}>Fallout Phần 2</h4>
                        <p className={cx('origin-name')}>Fallout Seasson 2</p>
                    </div>
                </div>
                <div className={cx('movie')}>
                    <div className={cx('left-side')}>
                        <div className={cx('poster')}>
                            <img
                                src="https://static.nutscdn.com/vimg/300-0/8dec307bdc76a4b8707e6a6b29066c9d.jpg"
                                alt="poster"
                            />
                        </div>
                    </div>
                    <div className={cx('right-side')}>
                        <h4 className={cx('name')}>Huyền Sử Pendragon: Truyền Thuyết Merlin</h4>
                        <p className={cx('origin-name')}>The Pendragon Cycle: Rise of the Merlin</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RelatedMovies;

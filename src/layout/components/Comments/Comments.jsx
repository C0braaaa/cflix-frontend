import classNames from 'classnames/bind';

import styles from './Comments.module.scss';

const cx = classNames.bind(styles);

function Comment() {
    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Bình luận (0)</h3>
            <div className={cx('main-comment')}>
                <div className={cx('left-side')}>
                    <div className={cx('avatar')}>
                        <img
                            src="https://phimimg.com/upload/vod/20260117-1/26e75bfd8f6000b6bf257285283e4730.jpg"
                            alt="avatar"
                        />
                    </div>
                </div>
                <div className={cx('right-side')}>
                    <textarea placeholder="Viết bình luận..." rows={1} maxLength={1000} />
                </div>
            </div>
        </div>
    );
}

export default Comment;

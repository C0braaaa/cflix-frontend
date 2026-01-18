import classNames from 'classnames/bind';
import { useState } from 'react';
import { toast } from 'react-toastify';

import styles from './Comments.module.scss';
import { useAuth } from '../../../features/auth/context/AuthContext';

const cx = classNames.bind(styles);

function Comment() {
    const [text, setText] = useState('');
    const { user, openModal } = useAuth();
    // console.log(user);

    const handleTextArea = (e) => {
        setText(e.target.value);
    };

    const handleCancel = () => {
        setText('');
    };
    const handleSend = () => {
        if (!user) {
            toast.error('Bạn phải đăng nhập để bình luận!');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Bình luận (0)</h3>
            {!user && (
                <h3 className={cx('warning')}>
                    Vui lòng{' '}
                    <span
                        style={{
                            color: 'var(--primary-color',
                            fontSize: '1.4rem',
                            fontWeight: '400',
                            cursor: 'pointer',
                        }}
                        onClick={() => openModal('login')}
                    >
                        đăng nhập
                    </span>{' '}
                    để bình luận
                </h3>
            )}
            <div className={cx('main-comment')}>
                {user && (
                    <div className={cx('left-side')}>
                        <div className={cx('avatar')}>
                            <img
                                src="https://phimimg.com/upload/vod/20260117-1/26e75bfd8f6000b6bf257285283e4730.jpg"
                                alt="avatar"
                            />
                        </div>
                    </div>
                )}
                <div className={cx('right-side')}>
                    <textarea
                        placeholder="Viết bình luận..."
                        rows={1}
                        maxLength={1000}
                        value={text}
                        onChange={handleTextArea}
                    />
                    <div className={cx('actions-btn')}>
                        <div className={cx('cancel')} onClick={handleCancel}>
                            <span>Hủy</span>
                        </div>
                        <div className={cx('send')} onClick={handleSend}>
                            <span>Bình luận</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;

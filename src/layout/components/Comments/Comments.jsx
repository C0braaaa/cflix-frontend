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
            <div className={cx('heading')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <g clip-path="url(#clip0_281_3026)">
                        <path
                            d="M14.499 0.5H6.50109C3.19363 0.5 0.502686 3.19095 0.502686 6.4984V11.1638C0.502686 14.3596 3.01468 16.9796 6.16784 17.1532V19.9338C6.16784 20.2461 6.42244 20.5 6.73536 20.5C6.88498 20.5 7.02661 20.4407 7.13358 20.3337L7.75875 19.7085C9.40031 18.0666 11.5834 17.1622 13.9054 17.1622H14.499C17.8064 17.1622 20.4974 14.4713 20.4974 11.1638V6.4984C20.4974 3.19095 17.8064 0.5 14.499 0.5ZM6.16784 10.1641C5.4327 10.1641 4.83486 9.56625 4.83486 8.83111C4.83486 8.09597 5.4327 7.49813 6.16784 7.49813C6.90298 7.49813 7.50082 8.09597 7.50082 8.83111C7.50082 9.56625 6.90265 10.1641 6.16784 10.1641ZM10.5 10.1641C9.76488 10.1641 9.16704 9.56625 9.16704 8.83111C9.16704 8.09597 9.76488 7.49813 10.5 7.49813C11.2352 7.49813 11.833 8.09597 11.833 8.83111C11.833 9.56625 11.2348 10.1641 10.5 10.1641ZM14.8322 10.1641C14.0971 10.1641 13.4992 9.56625 13.4992 8.83111C13.4992 8.09597 14.0971 7.49813 14.8322 7.49813C15.5673 7.49813 16.1652 8.09597 16.1652 8.83111C16.1652 9.56625 15.567 10.1641 14.8322 10.1641Z"
                            fill="currentColor"
                        ></path>
                    </g>
                </svg>
                <h3 className={cx('title')}>Bình luận (0)</h3>
            </div>

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

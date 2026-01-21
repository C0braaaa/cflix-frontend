import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

import styles from './Comments.module.scss';
import { useAuth } from '../../../features/auth/context/AuthContext';
import {
    addCommentAPI,
    getCommentBySlugAPI,
    toggleVoteCommentAPI,
    deleteCommentAPI,
} from '../../../services/commentServices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faInfinity,
    faReply,
    faThumbsDown,
    faThumbsUp,
    faMars,
    faVenus,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Comment() {
    const { user, openModal } = useAuth();
    const { slug } = useParams();
    const [text, setText] = useState('');
    const [commentList, setCommentList] = useState([]);

    // format time
    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const created = new Date(dateString);

        // Tính khoảng cách thời gian bằng giây
        const seconds = Math.floor((now - created) / 1000);

        // Cấu hình các mốc thời gian (giây)
        const intervals = [
            { label: 'năm', seconds: 31536000 },
            { label: 'tháng', seconds: 2592000 },
            { label: 'ngày', seconds: 86400 },
            { label: 'giờ', seconds: 3600 },
            { label: 'phút', seconds: 60 },
        ];

        // Vòng lặp thần thánh: Tự động tìm mốc phù hợp
        for (const interval of intervals) {
            // Lấy tổng giây chia cho số giây của đơn vị (ví dụ chia 60 để ra phút)
            const count = Math.floor(seconds / interval.seconds);

            // Nếu kết quả >= 1 thì trả về ngay (Ví dụ: 2 phút, 5 giờ)
            if (count >= 1) {
                return `${count} ${interval.label} trước`;
            }
        }

        // Nếu nhỏ hơn 60 giây
        return 'Vừa xong';
    };
    const GENDER_ICONS = {
        male: faMars,
        female: faVenus,
        unknown: faInfinity,
    };

    useEffect(() => {
        const fetchComment = async () => {
            if (slug) {
                try {
                    const res = await getCommentBySlugAPI(slug);
                    setCommentList(res.data);
                } catch (error) {
                    console.log(error);
                }
            }
        };
        fetchComment();
    }, [slug]);

    // send comment
    const handleSend = async () => {
        if (!user) {
            toast.error('Bạn phải đăng nhập để bình luận!');
        }
        if (!text.trim()) return;
        try {
            const dataPayload = {
                user_id: user._id,
                username: user.username,
                user_avatar: user.avatar_url,
                user_role: user.role,
                gender: user.gender,
                movie_slug: slug,
                content: text,
            };

            const newComment = await addCommentAPI(dataPayload);
            if (newComment) {
                setCommentList([newComment.data, ...commentList]);
                setText('');
                toast.success('Bình luận thành công!');
            }
        } catch (error) {
            console.log(error);
            toast.error('Bình luận không thành công!');
        }
    };

    // vote comment
    const handleVoteComment = async (commentId, type) => {
        if (!user) {
            toast.error('Vui lòng đăng nhập!');
            openModal('login');
            return;
        }
        try {
            const res = await toggleVoteCommentAPI(commentId, type);
            if (res && res.status) {
                setCommentList((prev) => prev.map((comment) => (comment._id === commentId ? res.data : comment)));
            }
        } catch (error) {
            console.log(error);
        }
    };

    // delete comment
    const handleDeleteComment = async (commentId) => {
        try {
            const res = await deleteCommentAPI(commentId);
            if (res && res.status) {
                setCommentList((prev) => prev.filter((comment) => comment._id !== commentId));
                toast.success('Xóa bình luận thành công!');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleTextArea = (e) => {
        setText(e.target.value);
    };

    const handleCancel = () => {
        setText('');
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <g clipPath="url(#clip0_281_3026)">
                        <path
                            d="M14.499 0.5H6.50109C3.19363 0.5 0.502686 3.19095 0.502686 6.4984V11.1638C0.502686 14.3596 3.01468 16.9796 6.16784 17.1532V19.9338C6.16784 20.2461 6.42244 20.5 6.73536 20.5C6.88498 20.5 7.02661 20.4407 7.13358 20.3337L7.75875 19.7085C9.40031 18.0666 11.5834 17.1622 13.9054 17.1622H14.499C17.8064 17.1622 20.4974 14.4713 20.4974 11.1638V6.4984C20.4974 3.19095 17.8064 0.5 14.499 0.5ZM6.16784 10.1641C5.4327 10.1641 4.83486 9.56625 4.83486 8.83111C4.83486 8.09597 5.4327 7.49813 6.16784 7.49813C6.90298 7.49813 7.50082 8.09597 7.50082 8.83111C7.50082 9.56625 6.90265 10.1641 6.16784 10.1641ZM10.5 10.1641C9.76488 10.1641 9.16704 9.56625 9.16704 8.83111C9.16704 8.09597 9.76488 7.49813 10.5 7.49813C11.2352 7.49813 11.833 8.09597 11.833 8.83111C11.833 9.56625 11.2348 10.1641 10.5 10.1641ZM14.8322 10.1641C14.0971 10.1641 13.4992 9.56625 13.4992 8.83111C13.4992 8.09597 14.0971 7.49813 14.8322 7.49813C15.5673 7.49813 16.1652 8.09597 16.1652 8.83111C16.1652 9.56625 15.567 10.1641 14.8322 10.1641Z"
                            fill="currentColor"
                        ></path>
                    </g>
                </svg>
                <h3 className={cx('title')}>Bình luận ({commentList.length})</h3>
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
                            <img src={user.avatar_url} alt={`avatar-${user.username}`} />
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
            <div className={cx('list-comments')}>
                {commentList.map((comment) => {
                    const isLiked = comment?.likes?.includes(user?._id);
                    const isDisliked = comment?.dislikes?.includes(user?._id);
                    const isOwner = comment?.user_id === user?._id;
                    const isAdmin = user?.role === 'admin';
                    const commentByAdmin = comment?.user_role === 'admin';

                    const canDelete = isOwner || (isAdmin && !commentByAdmin);
                    return (
                        <div className={cx('comment')} key={comment?._id}>
                            <div className={cx('left-side')}>
                                <div className={cx('avatar')}>
                                    <img src={comment?.user_avatar} alt={`avatar-${comment?.username}`} />
                                </div>
                            </div>
                            <div className={cx('right-side')}>
                                <div className={cx('username')}>
                                    <span className={cx({ usernameadmin: comment?.user_role === 'admin' })}>
                                        {comment?.username}
                                    </span>
                                    <span className={cx('gender')}>
                                        <FontAwesomeIcon
                                            icon={GENDER_ICONS[comment?.gender]}
                                            className={cx(comment?.gender)}
                                        />
                                    </span>
                                    {comment?.user_role === 'admin' && <span className={cx('admin')}>ADMIN</span>}
                                    <span className={cx('time')}>{formatTimeAgo(comment?.createdAt)}</span>
                                </div>
                                <div className={cx('content')}>
                                    <p>{comment?.content}</p>
                                </div>
                                <div className={cx('actions')}>
                                    <span
                                        className={cx('like', { active: isLiked })}
                                        onClick={() => handleVoteComment(comment._id, 'like')}
                                    >
                                        <FontAwesomeIcon icon={faThumbsUp} /> {comment?.likes?.length || 0}
                                    </span>
                                    <span
                                        className={cx('dislike', { active: isDisliked })}
                                        onClick={() => handleVoteComment(comment._id, 'dislike')}
                                    >
                                        <FontAwesomeIcon icon={faThumbsDown} /> {comment?.dislikes?.length || 0}
                                    </span>
                                    <span className={cx('reply')}>
                                        <FontAwesomeIcon icon={faReply} />
                                        Trả lời
                                    </span>
                                    {canDelete && (
                                        <span className={cx('delete')} onClick={() => handleDeleteComment(comment._id)}>
                                            <FontAwesomeIcon icon={faTrash} /> Xóa
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Comment;

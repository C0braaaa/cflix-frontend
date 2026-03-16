import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { socket } from '../../../utils/socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faInfinity,
    faReply,
    faThumbsDown,
    faThumbsUp,
    faMars,
    faVenus,
    faTrash,
    faChevronUp,
    faChevronDown,
    faFlag,
    faWarning,
} from '@fortawesome/free-solid-svg-icons';

import styles from './Comments.module.scss';
import { useAuth } from '../../../features/auth/context/AuthContext';
import {
    addCommentAPI,
    getCommentBySlugAPI,
    toggleVoteCommentAPI,
    deleteCommentAPI,
} from '../../../services/commentServices';
import { formatTimeAgo } from '../../../utils/formatDate';
import CensoredText from '../../../components/CensoredText/CensoredText';
import { useReportModal } from '../../../features/report/context/ReportModalContext';

const cx = classNames.bind(styles);

function Comment() {
    const { user, openModal } = useAuth();
    const { slug } = useParams();
    const { openReportModal } = useReportModal();
    const [text, setText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [replyInputId, setReplyInputId] = useState(null);
    const [commentList, setCommentList] = useState([]);
    const [expandedComments, setExpandedComments] = useState({});
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

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

    // config socket.io
    useEffect(() => {
        socket.connect();

        if (slug) {
            socket.emit('join_room', slug);
        }

        socket.on('receive_comment', (newComment) => {
            setCommentList((prev) => {
                const isExist = prev.some((c) => c._id === newComment._id);
                if (isExist) return prev;
                return [newComment, ...prev];
            });
        });

        socket.on('delete_comment', (deletedId) => {
            setCommentList((prev) => prev.filter((c) => c._id !== deletedId));
        });

        return () => {
            socket.emit('leave_room', slug);
            socket.off('receive_comment');
            socket.off('delete_comment');
            socket.disconnect();
        };
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

            const res = await addCommentAPI(dataPayload);
            if (res && res.status) {
                setText('');
                toast.success('Bình luận thành công!');
            }
        } catch (error) {
            console.log(error);
            toast.error('Bình luận không thành công!');
        }
    };

    // send reply
    const handleSendReply = async (parentId, replyToId) => {
        if (!user) {
            toast.error('Vui lòng đăng nhập!');
            openModal('login');
            return;
        }
        if (!replyText.trim()) return;
        try {
            const dataPayload = {
                user_id: user._id,
                username: user.username,
                user_avatar: user.avatar_url,
                user_role: user.role,
                gender: user.gender,
                movie_slug: slug,
                content: replyText,
                parent_id: parentId,
                reply_to_id: replyToId,
            };
            const res = await addCommentAPI(dataPayload);

            if (res && res.data) {
                setReplyText('');
                setReplyInputId(null);
                toast.success('Đã trả lời!');
                setExpandedComments((prev) => ({ ...prev, [parentId]: true }));
            }
        } catch (error) {
            console.log(error);
            toast.error('Trả lời thất bại!');
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

    const handleOnChangeReply = (e, username) => {
        const value = e.target.value;
        const prefix = `@${username} `;

        if (!value.startsWith(prefix)) {
            return;
        }

        setReplyText(value);
    };

    // toggle expand comment
    const toggleReplyVisibility = (commentId) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    // filter root comments
    const rootComments = commentList.filter((c) => !c.parent_id);
    // filter replies
    const getReplies = (parentId) => {
        return commentList
            .filter((c) => c.parent_id === parentId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    };

    // render comments for root and replies
    const renderSingleComment = (comment) => {
        const isLiked = comment?.likes?.includes(user?._id);
        const isDisliked = comment?.dislikes?.includes(user?._id);
        const isOwner = comment?.user_id === user?._id;
        const isAdmin = user?.role === 'admin';
        const commentByAdmin = comment?.user_role === 'admin';
        const canDelete = isOwner || (isAdmin && !commentByAdmin);

        return (
            <div className={cx('comment')} key={comment?._id}>
                <div className={cx('left-side')}>
                    <div className={cx('avatar', { avatarreply: comment?.parent_id })}>
                        <img src={comment?.user_avatar} alt={`avatar`} />
                    </div>
                </div>
                <div className={cx('right-side')}>
                    <div className={cx('username')}>
                        <span className={cx({ usernameadmin: comment?.user_role === 'admin' })}>
                            {comment?.username}
                        </span>
                        <span className={cx('gender')}>
                            <FontAwesomeIcon icon={GENDER_ICONS[comment?.gender]} className={cx(comment?.gender)} />
                        </span>
                        {comment?.user_role === 'admin' && <span className={cx('admin')}>ADMIN</span>}
                        <span className={cx('time')}>{formatTimeAgo(comment?.createdAt)}</span>
                    </div>
                    <div className={cx('content')}>
                        <CensoredText content={comment?.content} />
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

                        <span
                            className={cx('reply')}
                            onClick={() => {
                                if (replyInputId === comment._id) {
                                    setReplyInputId(null);
                                    setReplyText('');
                                } else {
                                    setReplyInputId(comment._id);
                                    setReplyText(`@${comment.username} `);
                                }
                            }}
                        >
                            <FontAwesomeIcon icon={faReply} /> Trả lời
                        </span>

                        {canDelete && (
                            <span className={cx('delete')} onClick={() => setConfirmDeleteId(comment._id)}>
                                <FontAwesomeIcon icon={faTrash} /> Xóa
                            </span>
                        )}
                        {user?._id !== comment?.user_id && (
                            <span
                                className={cx('report')}
                                onClick={() => {
                                    if (!user) {
                                        toast.error('Vui lòng đăng nhập để xử dung tính năng này!');
                                        openModal('login');
                                    } else {
                                        openReportModal({
                                            type: 'comment',
                                            movie_slug: slug,
                                            comment_id: comment._id,
                                            username: comment.username,
                                        });
                                    }
                                }}
                            >
                                <FontAwesomeIcon icon={faFlag} /> Báo cáo
                            </span>
                        )}
                    </div>

                    {/* FORM NHẬP REPLY */}
                    {replyInputId === comment._id && (
                        <div className={cx('reply-input')}>
                            <textarea
                                className={cx('reply-textarea')}
                                placeholder={`Trả lời ${comment.username}...`}
                                rows={1}
                                maxLength={1000}
                                value={replyText}
                                onChange={(e) => handleOnChangeReply(e, comment.username)}
                                autoFocus
                                onFocus={(e) => {
                                    const val = e.target.value;
                                    e.target.value = '';
                                    e.target.value = val;
                                }}
                                onKeyDown={(e) => {
                                    const rootId = comment.parent_id ? comment.parent_id : comment._id;
                                    if (!replyText.trim()) return;
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSendReply(rootId, comment._id);
                                    }
                                }}
                            />
                            <div className={cx('actions-btn-reply')}>
                                <div
                                    className={cx('cancel')}
                                    onClick={() => {
                                        setReplyText('');
                                        setReplyInputId(null);
                                    }}
                                >
                                    <span>Hủy</span>
                                </div>

                                <div
                                    className={cx('send')}
                                    onClick={() => {
                                        const rootId = comment.parent_id ? comment.parent_id : comment._id;
                                        handleSendReply(rootId);
                                    }}
                                >
                                    <span>Bình luận</span>
                                </div>
                            </div>
                        </div>
                    )}
                    {confirmDeleteId === comment._id && (
                        <div className={cx('confirm-delete')}>
                            <p className={cx('confirm-delete__text')}>
                                <FontAwesomeIcon icon={faWarning} /> Xác nhận xóa!
                            </p>
                            <div className={cx('confirm-delete__btn')}>
                                <div className={cx('cancel-btn')} onClick={() => setConfirmDeleteId(null)}>
                                    Hủy
                                </div>
                                <div className={cx('delete-btn')} onClick={() => handleDeleteComment(confirmDeleteId)}>
                                    Xóa
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
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
                        style={{ color: 'var(--primary-color)', cursor: 'pointer' }}
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
                            <img src={user.avatar_url} alt="avatar" />
                        </div>
                    </div>
                )}
                <div className={cx('right-side')}>
                    <textarea
                        className={cx('main-textarea')}
                        placeholder="Viết bình luận..."
                        rows={1}
                        value={text}
                        onChange={handleTextArea}
                        onKeyDown={(e) => {
                            if (!text.trim()) return;
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
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

            {/* replies comment and thread ui */}
            <div className={cx('list-comments')}>
                {rootComments.map((root) => {
                    const replies = getReplies(root._id);
                    const isExpanded = expandedComments[root._id];
                    return (
                        <div
                            key={root._id}
                            className={cx('comment-thread', { adminStyle: root.user_role === 'admin' })}
                        >
                            {renderSingleComment(root)}
                            {replies.length > 0 && (
                                <div className={cx('view-replies')} onClick={() => toggleReplyVisibility(root._id)}>
                                    <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                                    <span>{`${replies.length} câu trả lời`}</span>
                                </div>
                            )}
                            {isExpanded && (
                                <div className={cx('replies-container')}>
                                    {replies.map((reply) => (
                                        <div key={reply._id} className={cx('reply-item')}>
                                            <div className={cx('tree-line')}>
                                                <div className={cx('vertical')}></div>
                                                <div className={cx('horizontal')}></div>
                                            </div>
                                            {renderSingleComment(reply)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Comment;

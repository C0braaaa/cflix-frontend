import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faHeart, faReply, faTrash } from '@fortawesome/free-solid-svg-icons';
import HeadlessTippy from '@tippyjs/react/headless';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { getNotificationAPI, deleteNotificationAPI } from '../../../../services/notificationServices';
import styles from './Notification.module.scss';
import { useAuth } from '../../../../features/auth/context/AuthContext';
import { formatTimeAgo } from '../../../../utils/formatDate';
import { markAllAsReadAPI, markAsReadAPI } from '../../../../services/notificationServices';

const cx = classNames.bind(styles);

function Notification() {
    const [showBoard, setShowBoard] = useState(false);
    const [notification, setNotification] = useState([]);

    const { user } = useAuth();

    const cleanMessage = (msg) => {
        if (!msg) return '';
        const myTag = `@${user?.username}`;
        if (msg.startsWith(myTag)) {
            return msg.substring(myTag.length).trim();
        }
        return msg;
    };

    const getActionText = (type) => {
        switch (type) {
            case 'reply_comment':
                return ' đã trả lời bình luận của bạn: ';
            case 'like_comment':
                return ' đã thích bình luận của bạn! ';
            default:
                return 'Có thông báo mới';
        }
    };

    const handleReadOne = async (notifyId, isread) => {
        setShowBoard(false);

        if (isread) return;
        try {
            markAsReadAPI(notifyId);
            setNotification((prev) => {
                const newUnreadCount = Math.max(0, prev.unreadCount - 1);
                const newList = prev.notification.map((item) =>
                    item._id === notifyId ? { ...item, is_read: true } : item,
                );
                return { ...prev, notification: newList, unreadCount: newUnreadCount };
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleReadAll = async () => {
        if (notification.unreadCount === 0) return;

        try {
            await markAllAsReadAPI();

            // Reset State về sạch sẽ
            setNotification((prev) => ({
                ...prev,
                unreadCount: 0,
                notification: prev.notification.map((item) => ({ ...item, is_read: true })),
            }));
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (e, notifyId, isRead) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            deleteNotificationAPI(notifyId);
            setNotification((prev) => {
                const newUnreadCount = !isRead ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount;
                const newList = prev.notification.filter((item) => item._id !== notifyId);
                return { ...prev, notification: newList, unreadCount: newUnreadCount };
            });
        } catch (error) {
            console.log('Error: ', error);
        }
    };

    useEffect(() => {
        getNotificationAPI().then((res) => {
            setNotification(res.data);
        });
    }, []);

    return (
        <div>
            <HeadlessTippy
                visible={showBoard}
                interactive
                placement="bottom-end"
                offset={[30, 15]}
                onClickOutside={() => setShowBoard(false)}
                render={(attrs) => (
                    <div className={cx('notification-board')} tabIndex="-1" {...attrs}>
                        <div className={cx('header')}>
                            <h3 className={cx('title')}>Thông báo</h3>
                            <span className={cx('close')} onClick={() => setShowBoard(false)}>
                                &times;
                            </span>
                        </div>
                        <div className={cx('main')}>
                            <div className={cx('notification-list')}>
                                {notification?.notification?.length === 0 ? (
                                    <p className={cx('empty')}>Hiện không có thông báo nào</p>
                                ) : (
                                    notification.notification?.map((notify) => (
                                        <div className={cx('container')} key={notify._id}>
                                            <div
                                                className={cx('delete-notify')}
                                                onClick={(e) => handleDelete(e, notify._id, notify.is_read)}
                                            >
                                                <span>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </span>
                                            </div>
                                            <Link
                                                to={notify.target_url}
                                                className={cx('notify', { active: !notify.is_read })}
                                                key={notify._id}
                                                onClick={() => handleReadOne(notify._id, notify.is_read)}
                                            >
                                                <div className={cx('left')}>
                                                    <img className={cx('avatar')} src={notify.image} alt="avatar" />
                                                    <span className={cx('icon')}>
                                                        {notify.type === 'reply_comment' ? (
                                                            <FontAwesomeIcon icon={faReply} className={cx('reply')} />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faHeart} className={cx('like')} />
                                                        )}
                                                    </span>
                                                </div>
                                                <div className={cx('right')}>
                                                    <p className={cx('content')}>
                                                        <span>{notify.sender_name}</span>
                                                        {`${getActionText(notify.type)}${notify.type === 'reply_comment' ? cleanMessage(notify.message) : ''} `}
                                                    </p>
                                                    <span className={cx('time')}>
                                                        {formatTimeAgo(notify.created_at)}
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className={cx('footer')} onClick={handleReadAll}>
                            <p className={cx('footer-text')}>Đánh dấu tất cả là đã đọc</p>
                        </div>
                    </div>
                )}
            >
                <div className={cx('notification')} onClick={() => setShowBoard(!showBoard)}>
                    <div className={cx('notification-icon')}>
                        <FontAwesomeIcon icon={faBell} />
                    </div>
                    <div className={cx('badge')}>
                        {notification.unreadCount > 0 && (
                            <span>{notification.unreadCount > 99 ? '99+' : notification.unreadCount}</span>
                        )}
                    </div>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Notification;

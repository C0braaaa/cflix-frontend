import { useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faInfinity, faPaperPlane, faReply, faTrash } from '@fortawesome/free-solid-svg-icons';
import styles from './Comments.module.scss';

const cx = classNames.bind(styles);
function Comment() {
    const [input, setInput] = useState('');
    const [comments, setComments] = useState([]);
    // const [reply, setReply] = useState(false);

    let isAdmin = true;

    const handleSend = () => {
        if (!input.trim()) return;

        const newComment = {
            id: Date.now(),
            text: input.trim(),
            time: new Date().toISOString(),
        };

        setComments([newComment, ...comments]);
        setInput('');
    };

    const handleDelete = (id) => {
        setComments(comments.filter((comment) => comment.id !== id));
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('text')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <g clipPath="url(#clip0_281_3026)">
                        <path
                            d="M14.499 0.5H6.50109C3.19363 0.5 0.502686 3.19095 0.502686 6.4984V11.1638C0.502686 14.3596 3.01468 16.9796 6.16784 17.1532V19.9338C6.16784 20.2461 6.42244 20.5 6.73536 20.5C6.88498 20.5 7.02661 20.4407 7.13358 20.3337L7.75875 19.7085C9.40031 18.0666 11.5834 17.1622 13.9054 17.1622H14.499C17.8064 17.1622 20.4974 14.4713 20.4974 11.1638V6.4984C20.4974 3.19095 17.8064 0.5 14.499 0.5ZM6.16784 10.1641C5.4327 10.1641 4.83486 9.56625 4.83486 8.83111C4.83486 8.09597 5.4327 7.49813 6.16784 7.49813C6.90298 7.49813 7.50082 8.09597 7.50082 8.83111C7.50082 9.56625 6.90265 10.1641 6.16784 10.1641ZM10.5 10.1641C9.76488 10.1641 9.16704 9.56625 9.16704 8.83111C9.16704 8.09597 9.76488 7.49813 10.5 7.49813C11.2352 7.49813 11.833 8.09597 11.833 8.83111C11.833 9.56625 11.2348 10.1641 10.5 10.1641ZM14.8322 10.1641C14.0971 10.1641 13.4992 9.56625 13.4992 8.83111C13.4992 8.09597 14.0971 7.49813 14.8322 7.49813C15.5673 7.49813 16.1652 8.09597 16.1652 8.83111C16.1652 9.56625 15.567 10.1641 14.8322 10.1641Z"
                            fill="currentColor"
                        ></path>
                    </g>
                </svg>
                <h2>
                    Bình luận <span>{`(${comments.length})` || `(${0})`}</span>
                </h2>
            </div>
            <div className={cx('comments')}>
                <textarea
                    rows="4"
                    cols="3"
                    maxLength="1000"
                    value={input}
                    placeholder="Viết bình luận"
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                ></textarea>
                <div className={cx('send')} onClick={handleSend}>
                    <span>Gửi</span>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </div>
                <span className={cx('count')}>{input.length}/1000</span>
            </div>
            <div className={cx('list')}>
                {comments.map((c) => (
                    <div key={c.id} className={cx('item')}>
                        <div className={cx('left-side')}>
                            <img
                                src="https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aphelios_20.jpg"
                                alt="avatar"
                            />
                        </div>
                        <div className={cx('right-side')}>
                            <div className={cx('l-1')}>
                                <span>Aphelios</span>
                                {isAdmin && <span>ADMIN</span>}
                                <span>
                                    <FontAwesomeIcon icon={faInfinity} />
                                </span>
                                <span>{c.time.slice(0, 10)}</span>
                            </div>
                            <div className={cx('l-2')}>
                                <p>{c.text}</p>
                            </div>
                            <div className={cx('l-3')}>
                                <div className={cx('answer')}>
                                    <FontAwesomeIcon icon={faReply} />
                                    <span>Trả lời</span>
                                </div>
                                <div className={cx('delete')} onClick={() => handleDelete(c.id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                    <span>Xoá</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Comment;

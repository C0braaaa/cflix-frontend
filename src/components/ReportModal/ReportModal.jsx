import classNames from 'classnames/bind';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../features/auth/context/AuthContext';

import styles from './ReportModal.module.scss';
import { createReportAPI } from '../../services/reportService';

const cx = classNames.bind(styles);

function ReportModal({ isClose, reportTarget }) {
    const [reason, setReason] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const [otherReason, setOtherReason] = useState('');
    const listReasonComment = ['Spam', 'Xúc phạm', 'Phân biệt vùng miền', 'Phản cảm', 'Ngôn từ kích động', 'Lừa đảo'];
    const listReasonMovie = [
        'Không phát được',
        'Nội dung vi phạm',
        'Mất tiếng',
        'Mất hình',
        'Chất lượng kém',
        'Sai nội dung',
    ];

    const listReason = reportTarget?.type === 'movie' ? listReasonMovie : listReasonComment;

    const handleClickReason = (item) => {
        if (reason.includes(item)) {
            setReason(reason.filter((reason) => reason !== item));
        } else {
            setReason([...reason, item]);
        }
    };

    const onSubmit = async () => {
        const data = {
            reporter_id: user?._id,
            reporter_name: user?.username,
            type: reportTarget?.type,
            movie_slug: reportTarget?.movie_slug,
            reason: reason,
            details: otherReason,
            comment_id: reportTarget?.comment_id,
            username: reportTarget?.username,
            episode: reportTarget?.episode,
        };
        try {
            setIsLoading(true);
            await createReportAPI(data);
            isClose(false);
            toast.success('Cảm ơn bạn đã phản hồi!');
        } catch (error) {
            const backendMessage = error.response?.data?.message || error.message;
            setErrorMsg(backendMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h3 className={cx('heading__title')}>
                    {reportTarget?.type === 'movie' ? 'Báo lỗi phim' : 'Báo cáo bình luận'}
                </h3>
                <span className={cx('heading__close')} onClick={() => isClose(false)}>
                    &times;
                </span>
            </div>
            <div className={cx('reason-list')}>
                <p className={cx('error-msg')}>{errorMsg}</p>
                <h4 className={cx('reason-list__title')}>Lý do</h4>
                <div className={cx('reason-item')}>
                    {listReason.map((item, index) => (
                        <p
                            className={cx('reason-item__title', { active: reason.includes(item) })}
                            key={index}
                            onClick={() => handleClickReason(item)}
                        >
                            {item}
                        </p>
                    ))}
                </div>
            </div>
            <div className={cx('other')}>
                <h4 className={cx('other__title')}>Khác</h4>
                <textarea
                    name="other"
                    id="other"
                    rows="7"
                    className={cx('other__input')}
                    placeholder="Mô tả thêm..."
                    maxLength={1000}
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                />
            </div>
            <div className={cx('button')}>
                {isLoading ? (
                    <button className={cx('button__loading')} disabled>
                        Đang gửi... <FontAwesomeIcon icon={faSpinner} spin />
                    </button>
                ) : (
                    <>
                        <button className={cx('button__cancel')} onClick={() => isClose(false)}>
                            Hủy
                        </button>
                        <button className={cx('button__report')} onClick={onSubmit}>
                            Báo cáo
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ReportModal;

import classNames from 'classnames/bind';

import styles from './AboutCflix.module.scss';

const cx = classNames.bind(styles);

function Contact() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h2 className={cx('heading__title')} style={{ display: 'flex', justifyContent: 'center' }}>
                    Liên Hệ
                </h2>
                <p className={cx('heading__desc')}>
                    Chào mừng bạn đến với trang hỗ trợ và phản hồi của dự án CFlix. Là một sản phẩm được phát triển
                    trong khuôn khổ nghiên cứu và học thuật, chúng tôi luôn trân trọng mọi ý kiến đóng góp, câu hỏi hoặc
                    báo cáo lỗi từ phía người dùng để không ngừng cải thiện và hoàn thiện hệ thống. Nếu bạn cần hỗ trợ
                    kỹ thuật hoặc muốn chia sẻ ý tưởng phát triển cho dự án, hãy liên hệ với chúng tôi qua các kênh
                    thông tin dưới đây.
                </p>
            </div>
            <div className={cx('heading')}>
                <h2 className={cx('heading__title')}>Thông Tin Liên Hệ Chính</h2>
                <p className={cx('heading__desc')}>
                    Email hỗ trợ nếu có vấn đề: <a href="mailto:cobragaming0fo@gmail.com">cobragaming0fo@gmail.com</a>
                </p>
                <ul className={cx('heading__list')}>
                    <li className={cx('heading__item')}>
                        Vấn đề tài khoản: Quên mật khẩu, không thể truy cập, và các vấn đề liên quan đến tài khoản.
                    </li>
                    <li className={cx('heading__item')}>
                        Hỗ trợ kỹ thuật: Sự cố khi xem phim, chất lượng video hoặc các lỗi khác khi sử dụng trang web.
                    </li>
                    <li className={cx('heading__item')}>
                        Đóng góp ý kiến: Chúng tôi trân trọng mọi ý kiến đóng góp từ bạn để nâng cao chất lượng dịch vụ.
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Contact;

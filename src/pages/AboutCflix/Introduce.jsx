import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import styles from './AboutCflix.module.scss';

const cx = classNames.bind(styles);

function Introduce() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h2 className={cx('heading__title')}>
                    CFlix – Hệ Thống Trải Nghiệm Điện Ảnh Trực Tuyến (Đồ Án Tốt Nghiệp)
                </h2>
                <p className={cx('heading__desc')}>
                    Cflix là một dự án web xem phim trực tuyến được xây dựng trong khuôn khổ đồ án tốt nghiệp, với mục
                    tiêu nghiên cứu, ứng dụng và thực hành các kiến thức đã học trong lĩnh vực phát triển phần mềm và
                    công nghệ web. Dự án tập trung vào việc thiết kế và xây dựng một hệ thống xem phim có giao diện thân
                    thiện, khả năng quản lý nội dung và tối ưu trải nghiệm người dùng. Cflix không mang mục đích thương
                    mại, mà hướng đến việc áp dụng công nghệ vào xây dựng một sản phẩm thực tế.
                </p>
            </div>
            <div className={cx('heading')}>
                <h2 className={cx('heading__title')}>Giao Diện Hiện Đại, Tương Tác Thông Minh</h2>
                <p className={cx('heading__desc')}>
                    CFlix được thiết kế với giao diện tối giản, tập trung vào trải nghiệm điện ảnh nhờ sự kết hợp giữa
                    kiến trúc Single Page Application (SPA) và các công nghệ giao diện hiện đại. Người dùng có thể dễ
                    dàng khám phá kho phim phong phú chỉ với vài thao tác đơn giản, đảm bảo tốc độ phản hồi nhanh chóng
                    và mượt mà trên mọi thiết bị. Đặc biệt, sự hiện diện của trợ lý ảo C-Bot luôn sẵn sàng hỗ trợ tìm
                    kiếm và giải đáp thắc mắc, giúp hành trình thưởng thức nội dung giải trí của bạn trở nên cá nhân hóa
                    và thú vị hơn bao giờ hết.
                </p>
            </div>
            <div className={cx('heading')}>
                <h2 className={cx('heading__title')}>Kho Dữ Liệu Điện Ảnh Đa Dạng, Cập Nhật Liên Tục</h2>
                <p className={cx('heading__desc')}>
                    CFlix sở hữu khả năng truy xuất và quản lý hàng ngàn tiêu đề phim thuộc nhiều thể loại khác nhau, từ
                    hành động, lãng mạn, khoa học viễn tưởng đến hoạt hình và kinh dị. Thông qua việc tối ưu hóa các
                    truy vấn API từ hệ thống dữ liệu phim mã nguồn mở, dự án cam kết mang đến những nội dung mới nhất
                    với chất lượng hiển thị tối ưu.
                </p>
                <p className={cx('heading__desc')}>Hệ thống phân loại của CFlix được cấu trúc khoa học bao gồm:</p>
                <ul className={cx('heading__list')}>
                    <li className={cx('heading__item')}>
                        Phim Bộ (TV Series): Hỗ trợ quản lý dữ liệu theo từng tập phim, từ các series kinh điển đến
                        những bộ phim truyền hình đang gây sốt trên thị trường.
                    </li>
                    <li className={cx('heading__item')}>
                        Phim Lẻ (Movies): Tuyển tập các tác phẩm điện ảnh đình đám, từ những bom tấn quốc tế đến các dự
                        án phim độc lập có nội dung sâu sắc.
                    </li>
                    <li className={cx('heading__item')}>
                        Điện Ảnh Việt Nam: Chú trọng phát triển và cập nhật danh mục phim nội địa, đáp ứng nhu cầu
                        nghiên cứu và thưởng thức điện ảnh nước nhà của người dùng.
                    </li>
                </ul>
            </div>
            <div className={cx('heading')}>
                <h2 className={cx('heading__title')}>Chất Lượng Hình Ảnh Sắc Nét – Tối Ưu Trải Nghiệm Full HD</h2>
                <p className={cx('heading__desc')}>
                    Trong phát triển ứng dụng giải trí, chất lượng hình ảnh là yếu tố cốt lõi quyết định sự hài lòng của
                    người dùng. CFlix tập trung tối ưu hóa các luồng truyền tải dữ liệu để cung cấp chất lượng hình ảnh
                    lên tới mức Full HD (1080p), đảm bảo sự cân bằng hoàn hảo giữa độ sắc nét và tốc độ tải trang.
                </p>
            </div>
            <div className={cx('heading')}>
                <h2 className={cx('heading__title')}>Các Tính Năng Công Nghệ Nổi Bật Tại CFLIX</h2>
                <p className={cx('heading__desc')}>
                    CFlix không chỉ là một nền tảng xem phim thông thường mà còn là nơi thử nghiệm các giải pháp công
                    nghệ mới nhất nhằm tối ưu hóa hành trình giải trí của người dùng.
                </p>
                <ul className={cx('heading__list')}>
                    <li className={cx('heading__item')}>
                        Trải Nghiệm Phi Thương Mại & Học Thuật: Dự án được xây dựng trên tinh thần chia sẻ kiến thức,
                        cung cấp quyền truy cập hoàn toàn miễn phí vào kho tư liệu điện ảnh phong phú cho mục đích
                        nghiên cứu và giải trí cá nhân.
                    </li>
                    <li className={cx('heading__item')}>
                        Trợ Lý Ảo C-Bot Thông Minh (AI Integration): Tích hợp mô hình ngôn ngữ lớn (LLM) thông qua
                        Gemini API, giúp người dùng tìm kiếm phim bằng ngôn ngữ tự nhiên và cung cấp thông tin link phim
                        chính xác nhờ kỹ thuật Function Calling.
                    </li>
                    <li className={cx('heading__item')}>
                        Tương Tác Thời Gian Thực (Real-time Interaction): Hệ thống bình luận được vận hành bởi công nghệ
                        Socket.io, cho phép bình luận và phản hồi ngay lập tức, tạo nên một không gian giao lưu trực
                        tuyến sống động.
                    </li>
                    <li className={cx('heading__item')}>
                        Môi Trường Thảo Luận Văn Minh: Cơ chế lọc từ ngữ nhạy cảm tự động (CensoredText) giúp duy trì
                        nội dung bình luận tích cực, đồng thời cho phép người dùng linh hoạt ẩn hoặc hiện nội dung khi
                        cần thiết.
                    </li>
                    <li className={cx('heading__item')}>
                        Khả Năng Thích Ứng Đa Nền Tảng (Responsive Design): Với việc áp dụng CSS Grid, Flexbox và SCSS
                        Modules, giao diện CFlix tự động co giãn và tối ưu hóa hiển thị trên mọi kích thước màn hình, từ
                        PC đến smartphone.
                    </li>
                </ul>
            </div>
            <div className={cx('heading')}>
                <h2 className={cx('heading__title')}>Liên Hệ với CFLIX</h2>
                <p className={cx('heading__desc')}>
                    Để biết thêm chi tiết hoặc có thắc mắc về dịch vụ, bạn vui lòng liên hệ với tôi qua email{' '}
                    <a href="mailto:cobragaming0fo@gmail.com">cobragaming0fo@gmail.com</a> hoặc qua trang{' '}
                    <Link to="/lien-he" className={cx('link')}>
                        Liên Hệ
                    </Link>{' '}
                    trên website chính thức của tôi.
                </p>
            </div>
        </div>
    );
}

export default Introduce;

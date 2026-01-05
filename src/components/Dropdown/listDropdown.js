import { faChartLine, faHeart, faHistory, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';

export const genres = [
    { name: 'Hành Động', to: '/the-loai/hanh-dong' },
    { name: 'Miền Tây', to: '/the-loai/mien-tay' },
    { name: 'Trẻ Em', to: '/the-loai/tre-em' },
    { name: 'Lịch Sử', to: '/the-loai/lich-su' },
    { name: 'Cổ Trang', to: '/the-loai/co-trang' },
    { name: 'Chiến Tranh', to: '/the-loai/chien-tranh' },
    { name: 'Viễn Tưởng', to: '/the-loai/vien-tuong' },
    { name: 'Kinh Dị', to: '/the-loai/kinh-di' },
    { name: 'Tài Liệu', to: '/the-loai/tai-lieu' },
    { name: 'Bí Ẩn', to: '/the-loai/bi-an' },
    { name: 'Tình Cảm', to: '/the-loai/tinh-cam' },
    { name: 'Tâm Lý', to: '/the-loai/tam-ly' },
    { name: 'Thể Thao', to: '/the-loai/the-thao' },
    { name: 'Phiêu Lưu', to: '/the-loai/phieu-luu' },
    { name: 'Âm Nhạc', to: '/the-loai/am-nhac' },
    { name: 'Gia Đình', to: '/the-loai/gia-dinh' },
    { name: 'Học Đường', to: '/the-loai/hoc-duong' },
    { name: 'Hài Hước', to: '/the-loai/hai-huoc' },
    { name: 'Hình Sự', to: '/the-loai/hinh-su' },
    { name: 'Võ Thuật', to: '/the-loai/vo-thuat' },
    { name: 'Khoa Học', to: '/the-loai/khoa-hoc' },
    { name: 'Thần Thoại', to: '/the-loai/than-thoai' },
    { name: 'Chính Kịch', to: '/the-loai/chinh-kich' },
    { name: 'Kinh Điển', to: '/the-loai/kinh-dien' },
];

export const nations = [
    { name: 'Việt Nam', to: '/quoc-gia/viet-nam' },
    { name: 'Trung Quốc', to: '/quoc-gia/trung-quoc' },
    { name: 'Thái Lan', to: '/quoc-gia/thai-lan' },
    { name: 'Hồng Kông', to: '/quoc-gia/hong-kong' },
    { name: 'Pháp', to: '/quoc-gia/phap' },
    { name: 'Đức', to: '/quoc-gia/duc' },
    { name: 'Hà Lan', to: '/quoc-gia/ha-lan' },
    { name: 'Mexico', to: '/quoc-gia/mexico' },
    { name: 'Thụy Điển', to: '/quoc-gia/thuy-dien' },
    { name: 'Philippines', to: '/quoc-gia/philippines' },
    { name: 'Đan Mạch', to: '/quoc-gia/dan-mach' },
    { name: 'Thụy Sĩ', to: '/quoc-gia/thuy-si' },
    { name: 'Ukraina', to: '/quoc-gia/ukraina' },
    { name: 'Hàn Quốc', to: '/quoc-gia/han-quoc' },
    { name: 'Âu Mỹ', to: '/quoc-gia/au-my' },
    { name: 'Ấn Độ', to: '/quoc-gia/an-do' },
    { name: 'Canada', to: '/quoc-gia/canada' },
    { name: 'Tây Ban Nha', to: '/quoc-gia/tay-ban-nha' },
    { name: 'Indonesia', to: '/quoc-gia/indonesia' },
    { name: 'Ba Lan', to: '/quoc-gia/ba-lan' },
    { name: 'Malaysia', to: '/quoc-gia/malaysia' },
    { name: 'Bồ Đào Nha', to: '/quoc-gia/bo-dao-nha' },
    { name: 'UAE', to: '/quoc-gia/uae' },
    { name: 'Châu Phi', to: '/quoc-gia/chau-phi' },
    { name: 'Ả Rập Xê Út', to: '/quoc-gia/a-rap-xe-ut' },
    { name: 'Nhật Bản', to: '/quoc-gia/nhat-ban' },
    { name: 'Đài Loan', to: '/quoc-gia/dai-loan' },
    { name: 'Anh', to: '/quoc-gia/anh' },
    { name: 'Thổ Nhĩ Kỳ', to: '/quoc-gia/tho-nhi-ky' },
    { name: 'Nga', to: '/quoc-gia/nga' },
    { name: 'Úc', to: '/quoc-gia/uc' },
    { name: 'Brazil', to: '/quoc-gia/brazil' },
    { name: 'Ý', to: '/quoc-gia/y' },
    { name: 'Na Uy', to: '/quoc-gia/na-uy' },
    { name: 'Nam Phi', to: '/quoc-gia/nam-phi' },
];

export const more = [
    {
        name: 'Phim Thuyết Minh',
        to: '/phim-thuyet-minh',
    },
    {
        name: 'Phim mới cập nhật',
        to: '/phim-moi-cap-nhat',
    },
    {
        name: 'Chủ đề',
        to: '/chu-de',
    },
    {
        name: 'Diễn viên',
        to: '/dien-vien',
    },
];

export const userList = [
    {
        name: 'Yêu thích',
        icon: faHeart,
        to: '/user/favorite',
    },
    {
        name: 'Danh sách',
        icon: faPlus,
        to: '/user/playlist',
    },
    {
        name: 'Xem tiếp',
        icon: faHistory,
        to: '/user/xem-tiep',
    },
    {
        name: 'Dashboard',
        icon: faChartLine,
        to: '/dashboard',
    },
    {
        name: 'Tài khoản',
        icon: faUser,
        to: '/user/profile',
    },
];

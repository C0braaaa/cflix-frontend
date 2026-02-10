import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);

dayjs.locale('vi');

export const formatTimeAgo = (date) => {
    return dayjs(date).fromNow();
};

export const formatDate = (date) => {
    return dayjs(date).format('DD/MM/YYYY HH:mm');
};

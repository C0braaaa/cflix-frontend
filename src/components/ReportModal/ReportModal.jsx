import classNames from 'classnames/bind';

import styles from './ReportModal.module.scss';

const cx = classNames.bind(styles);

function ReportModal({ isClose, reportTarget }) {
    console.log('data la: ', isClose, reportTarget);

    return <div className={cx('wrapper')}></div>;
}

export default ReportModal;

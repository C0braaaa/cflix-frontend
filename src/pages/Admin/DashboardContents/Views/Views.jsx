import classNames from 'classnames/bind';

import styles from './Views.module.scss';

const cx = classNames.bind(styles);
function Views() {
    return <div className={cx('wrapper')}></div>;
}

export default Views;

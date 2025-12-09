import classNames from 'classnames/bind';

import styles from './Topics.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
function Topics() {
    const list = [
        {
            name: 'Marvel',
            bgColor: '#ED1B24',
            to: '/chu-de/marvel',
        },
        {
            name: '4K',
            bgColor: '#7E7EA9',
            to: '/chu-de/4k',
        },
        {
            name: 'Sitcom',
            bgColor: '#429A85',
            to: '/chu-de/sitcom',
        },
        {
            name: 'DC',
            bgColor: '#0472E9',
            to: '/chu-de/dc',
        },
        {
            name: 'Đỉnh Cao',
            bgColor: '#479EA2',
            to: '/chu-de/dinh-cao',
        },
        {
            name: 'Cổ Trang',
            bgColor: '#B65B5B',
            to: '/chu-de/co-trang',
        },
        {
            name: '+3 Chủ đề',
            bgColor: '#505363',
            to: '/chu-de',
        },
    ];

    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Khám phá những chủ đề hay!</h3>
            <div className={cx('topics-list')}>
                {list.map((item, index) => {
                    return (
                        <Link to={item.to} key={index}>
                            <div className={cx('topic-item')} style={{ backgroundColor: item.bgColor }}>
                                <h2 className={cx('line-1')}>{item.name}</h2>
                                <div className={cx('line-2')}>
                                    <span>Xem chủ đề</span>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default Topics;

import { useEffect } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import styles from './FullTopics.module.scss';

const cx = classNames.bind(styles);
export const list = [
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
        name: 'Phù Thủy',
        bgColor: '#C55B92',
        to: '/chu-de/phu-thuy',
    },
    {
        name: 'Chữa Lành',
        bgColor: '#F088B0',
        to: '/chu-de/chua-lanh',
    },
    {
        name: 'Chiến Tranh',
        bgColor: '#003815',
        to: '/chu-de/chien-tranh',
    },
];
function FullTopics() {
    useEffect(() => {
        document.title = 'Chủ đề';
    });

    return (
        <div className={cx('wrapper')}>
            <h3>Các chủ đề có tại CFlix</h3>
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

export default FullTopics;

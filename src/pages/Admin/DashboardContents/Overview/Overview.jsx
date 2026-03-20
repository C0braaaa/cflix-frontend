import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faSignal, faSpinner, faUser, faUserClock } from '@fortawesome/free-solid-svg-icons';
import { socket } from '../../../../utils/socket';

import styles from './Overview.module.scss';
import TrafficBarChart from './TrafficBarChart';
import { getAllUSersAPI } from '../../../../services/userServices';
import { getTrafficStatsAPI } from '../../../../services/trafficService';

const cx = classNames.bind(styles);

const GrowthBadge = ({ rate, filterDays }) => {
    if (rate === null || rate === undefined) return null;

    if (rate === 0) {
        return <span className={cx('growth-badge', 'neutral')}>🟡 Không đổi so với {filterDays} ngày trước</span>;
    }

    const isUp = rate > 0;
    return (
        <span className={cx('growth-badge', isUp ? 'up' : 'down')}>
            {isUp ? '🟢' : '🔴'} {isUp ? 'Tăng' : 'Giảm'} {Math.abs(rate)}% so với {filterDays} ngày trước
        </span>
    );
};
function Overview() {
    const [countUser, setCountUser] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState(0);

    const [trafficData, setTrafficData] = useState([]);
    const [filterDays, setFilterDays] = useState(7);
    const [highestTraffic, setHighestTraffic] = useState(null);
    const [totalViews, setTotalViews] = useState(null);
    const [growthRate, setGrowthRate] = useState(null);

    useEffect(() => {
        const fetchTrafficStats = async () => {
            try {
                const res = await getTrafficStatsAPI(filterDays);
                if (res && res.data) {
                    setTrafficData(res.data.chartData || []);
                    setHighestTraffic(res.data.trafficHighestInDay?.views ?? null);
                    setTotalViews(res.data.totalViews ?? null);
                    setGrowthRate(res.data.growthRate ?? null);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchTrafficStats();
    }, [filterDays]);

    // total users
    useEffect(() => {
        const getAllUser = async () => {
            try {
                const res = await getAllUSersAPI();
                setCountUser(res.totalUsers);
            } catch (error) {
                console.log(error);
            }
        };
        getAllUser();
    }, []);

    // socket io - online users
    useEffect(() => {
        socket.on('online_users', (count) => {
            setOnlineUsers(count);
        });

        socket.emit('req_online_users');
        return () => {
            socket.off('online_users');
        };
    }, []);
    return (
        <>
            <div className={cx('stats-card')}>
                <div className={cx('card')}>
                    <div className={cx('card-left-side')}>
                        <h3 className={cx('card-title')}>Tổng User</h3>
                        <span className={cx('card-value')}>
                            {countUser === 0 ? <FontAwesomeIcon icon={faSpinner} spin /> : countUser}
                        </span>
                    </div>
                    <FontAwesomeIcon icon={faUser} />
                </div>
                <div className={cx('card')}>
                    <div className={cx('card-left-side')}>
                        <h3 className={cx('card-title')}>Đang truy cập</h3>
                        <span className={cx('card-value')}>
                            {onlineUsers === 0 ? <FontAwesomeIcon icon={faSpinner} spin /> : onlineUsers}
                        </span>
                    </div>
                    <FontAwesomeIcon icon={faSignal} />
                </div>
                <div className={cx('card')}>
                    <div className={cx('card-left-side')}>
                        <h3 className={cx('card-title')}>Lưu lượng truy cập nhiều nhất trong 1 ngày</h3>
                        <span className={cx('card-value')}>{highestTraffic}</span>
                    </div>
                    <FontAwesomeIcon icon={faUserClock} />
                </div>
                <div className={cx('card')}>
                    <div className={cx('card-left-side')}>
                        <h3 className={cx('card-title')}>Lưu lượng {filterDays} ngày qua</h3>
                        <span className={cx('card-value')}>
                            {totalViews === null ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                            ) : (
                                totalViews.toLocaleString('vi-VN')
                            )}
                        </span>
                        <GrowthBadge rate={growthRate} filterDays={filterDays} />
                    </div>
                    <FontAwesomeIcon icon={faChartLine} />
                </div>
            </div>
            {/* Chart Section */}
            <div className={cx('charts-section')}>
                <div className={cx('chart-container', 'main-chart')}>
                    <div className={cx('chart-header')}>
                        <h3>Lưu lượng truy cập</h3>
                        <select
                            className={cx('chart-filter')}
                            value={filterDays}
                            onChange={(e) => setFilterDays(Number(e.target.value))}
                        >
                            <option value={7}>7 ngày qua</option>
                            <option value={14}>14 ngày qua</option>
                        </select>
                    </div>

                    <div className={cx('chart-body')}>
                        {/* 👇 3. Gọi Component biểu đồ cột vào đây cho sạch sẽ */}
                        <TrafficBarChart data={trafficData} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Overview;

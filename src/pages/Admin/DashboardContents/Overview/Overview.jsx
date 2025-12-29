import classNames from 'classnames/bind';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignal, faUser, faUserClock } from '@fortawesome/free-solid-svg-icons';

import styles from './Overview.module.scss';

const cx = classNames.bind(styles);
// Mock data cho biểu đồ lưu lượng truy cập
const dataTraffic = [
    { name: 'T2', uv: 4000, pv: 2400 },
    { name: 'T3', uv: 3000, pv: 1398 },
    { name: 'T4', uv: 2000, pv: 9800 },
    { name: 'T5', uv: 2780, pv: 3908 },
    { name: 'T6', uv: 1890, pv: 4800 },
    { name: 'T7', uv: 2390, pv: 3800 },
    { name: 'CN', uv: 3490, pv: 4300 },
];

// Mock data cho biểu đồ phân bổ thiết bị
// Data mẫu
const dataDevice = [
    { name: 'Mobile', value: 4000 }, // Xem trên điện thoại
    { name: 'Desktop', value: 3000 }, // Xem trên PC
    { name: 'Tablet', value: 1000 },
];
const COLORS = ['#2E86DE', '#1DD1A1', '#FF9F43']; // Blue, Green, Orange
function Overview() {
    return (
        <>
            <div className={cx('stats-card')}>
                <div className={cx('card')}>
                    <div className={cx('card-left-side')}>
                        <h3 className={cx('card-title')}>Tổng User</h3>
                        <span className={cx('card-value')}>100</span>
                    </div>
                    <FontAwesomeIcon icon={faUser} />
                </div>
                <div className={cx('card')}>
                    <div className={cx('card-left-side')}>
                        <h3 className={cx('card-title')}>Đang truy cập</h3>
                        <span className={cx('card-value')}>50</span>
                    </div>
                    <FontAwesomeIcon icon={faSignal} />
                </div>
                <div className={cx('card')}>
                    <div className={cx('card-left-side')}>
                        <h3 className={cx('card-title')}>Phiên lâu nhất</h3>
                        <span className={cx('card-value')}>4h 30m</span>
                    </div>
                    <FontAwesomeIcon icon={faUserClock} />
                </div>
            </div>
            {/* Chart Section */}
            <div className={cx('charts-section')}>
                {/* Biểu đồ chính: Lưu lượng truy cập */}
                <div className={cx('chart-container', 'main-chart')}>
                    <div className={cx('chart-header')}>
                        <h3>Lưu lượng truy cập</h3>
                        {/* Dropdown filter giả lập */}
                        <select className={cx('chart-filter')}>
                            <option>7 ngày qua</option>
                            <option>Tháng này</option>
                        </select>
                    </div>

                    <div className={cx('chart-body')}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dataTraffic} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                {/* Định nghĩa màu Gradient cho đẹp */}
                                <defs>
                                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2E86DE" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#2E86DE" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <XAxis dataKey="name" stroke="#a0aec0" />
                                <YAxis stroke="#a0aec0" />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    }}
                                />

                                {/* Vẽ đường biểu đồ */}
                                <Area
                                    type="monotone"
                                    dataKey="pv"
                                    stroke="#2E86DE"
                                    fillOpacity={1}
                                    fill="url(#colorPv)"
                                    name="Lượt xem"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="uv"
                                    stroke="#FF6B6B"
                                    fillOpacity={1}
                                    fill="url(#colorUv)"
                                    name="Người dùng"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* Biểu đồ phân bộ thiết bị */}
                <div className={cx('chart-container', 'sub-chart')}>
                    <h3 className={cx('chart-title')} style={{ color: 'var(--text-black)', fontSize: '1.8rem' }}>
                        Thiết bị truy cập
                    </h3>
                    <div className={cx('chart-body')}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataDevice}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60} // Tạo biểu đồ hình cái nhẫn (Donut)
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {dataDevice.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Overview;

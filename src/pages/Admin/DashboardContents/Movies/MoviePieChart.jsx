// MoviePieChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
    series: '#3a86ff',
    single: '#8338ec',
    hoathinh: '#06d6a0',
    tvshows: '#ff006e',
};

const NAME_MAP = {
    series: 'Phim bộ',
    single: 'Phim lẻ',
    hoathinh: 'Hoạt hình',
    tvshows: 'TV Shows',
};

function MoviePieChart({ viewsByType }) {
    const chartData = Object.entries(viewsByType || {}).map(([key, value]) => ({
        name: NAME_MAP[key] || key,
        value: value,
        key: key,
    }));

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
            }}
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="65%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.key] || '#ccc'} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(26, 26, 26, 0.95)',
                            borderRadius: '6px',
                            border: '1px solid rgba(0, 255, 255, 0.3)',
                            color: '#fff',
                            fontSize: '1.2rem',
                            padding: '10px 8px',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
                            width: 'fit-content',
                            lineHeight: '1.4rem',
                        }}
                        labelStyle={{ display: 'none' }}
                        itemStyle={{ padding: '0px', margin: '0px' }}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="left"
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{
                            lineHeight: '2.5rem',
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

export default MoviePieChart;

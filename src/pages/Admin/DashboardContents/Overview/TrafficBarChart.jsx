import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TrafficBarChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                {/* Lưới ngang nét đứt */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />

                {/* Trục X hiển thị Ngày/Tháng */}
                <XAxis dataKey="date" stroke="var(--text-color-1)" axisLine={false} tickLine={false} dy={10} />

                {/* Trục Y hiển thị số lượng */}
                <YAxis stroke="var(--text-color-1)" axisLine={false} tickLine={false} dx={-10} />

                {/* Tooltip khi hover vào cột */}
                <Tooltip
                    cursor={{ fill: 'var(--background-color-2)' }} // Nền mờ khi hover
                    contentStyle={{
                        backgroundColor: 'var(--dashboard-color)',
                        borderRadius: '1rem',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-color)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                />

                {/* Cột hiển thị dữ liệu */}
                <Bar
                    dataKey="views"
                    fill="var(--primary-color)"
                    radius={[6, 6, 0, 0]} // Bo tròn góc trên
                    barSize={35} // Độ mập của cột
                    name="Lượt truy cập"
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default TrafficBarChart;

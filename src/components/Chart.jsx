import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const Chart = ({ data }) => {
    // Pastikan data terdefinisi dan memiliki panjang lebih dari 0
    if (!data || data.length === 0) {
        return <p>No data available</p>;
    }

    const chartData = {
        labels: data.map((item) => item.name), // Mengambil label dari data
        datasets: [
            {
                label: 'Total',
                data: data.map((item) => item.total), // Mengambil nilai total dari data
                backgroundColor: '#8884d8',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Name',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Total',
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

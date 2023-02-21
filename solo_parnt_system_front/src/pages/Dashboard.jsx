import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactToPrint from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ALL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const data = {
    labels: ['Red', 'Blue'],
    datasets: [
        {
            label: 'Value',
            data: [12, 19],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

const data2 = {
    labels: ['Male', 'Female'],
    datasets: [
        {
            label: 'Value',
            data: [12, 19],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
        },
    ],
};
const data3 = {
    labels: ['Active', 'Inactive'],
    datasets: [
        {
            label: 'Value',
            data: [0, 1],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
        },
    ],
};

const Dashboard = () => {

    const chartsToPrintRef = useRef();

    const [actIncVal, setActIncVal] = useState({
        labels: [],
        values: [],
        colors: [],
    });
    const [byGenderVal, setByGenderVal] = useState({
        labels: [],
        values: [],
        colors: [],
    });
    const [perBrngData, setPerBrngData] = useState({
        labels: [],
        values: [],
    });

    useEffect(() => {
        __load_dashboard__();
    }, []);

    const __load_dashboard__ = () => {
        axios.get('http://localhost:8000/api/parents/dashboard/').then((resp) => {
            const {
                num_act_inact_solo_parent,
                num_solo_parent_by_gender,
                tot_solo_parent_per_brng,
            } = resp.data;

            let newActIncVal = { ...actIncVal };

            num_act_inact_solo_parent.forEach((data) => {
                newActIncVal.labels.push(data.active ? `Active=${data.column}` : `Inactive=${data.column}`);
                newActIncVal.colors.push(data.active ? 'rgb(0,255,0, 0.7)' : 'rgb(255,0,0, 0.7)');
                newActIncVal.values.push(data.column);
            });

            setActIncVal(newActIncVal);
// rgb(255,105,180), rgb(0,0,255)
            let newBenderVal = { ...byGenderVal };
            num_solo_parent_by_gender.forEach((data) => {
                newBenderVal.labels.push(`${data.gender}=${data.column}`);
                newBenderVal.colors.push(data.gender === "Male" ? 'rgb(0,0,255)' : 'rgb(255,105,180)');
                newBenderVal.values.push(data.column);
            });

            setByGenderVal(newBenderVal);

            let newPerBrngData = { ...perBrngData };
            tot_solo_parent_per_brng.forEach((data) => {
                newPerBrngData.labels.push(`${data.barangay}=${data.column}`);
                newPerBrngData.values.push(data.column);
            });
            setPerBrngData(newPerBrngData);

        }).catch((err) => { });
    }

    return (
        <div className="container mx-3 flex justify-center" ref={chartsToPrintRef}>
            <div className="flex flex-col bg-blue-100 p-3 rounded-lg my-4 shadow min-w-[60%] relative">
                <h1 className="my-3 text-3xl font-extrabold">Dashboard</h1>
                <div className="absolute top-2 right-4">
                    <ReactToPrint
                        trigger={() => (
                            <button className="bg-gray-300 p-2 rounded-lg hover:bg-gray-400 flex">
                                <p className="mr-2">Generate reports</p>
                                <FontAwesomeIcon
                                    icon={faPrint}
                                    size={"xl"}
                                />
                            </button>
                        )}
                        content={() => chartsToPrintRef.current}
                    />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 w-full">
                    <div className="max-w-sm bg-blue-500 p-4 rounded-lg shadow  flex items-center justify-center">
                        <div className="max-w-sm bg-gray-100 p-4 rounded-lg shadow">
                            <h1 className="text-xl underline mb-2">Solo Parents Count by Membership Status</h1>
                            <Pie
                                data={{
                                    labels: actIncVal.labels,
                                    datasets: [
                                        {
                                            label: 'Value',
                                            data: actIncVal.values,
                                            backgroundColor: [
                                                ...actIncVal.colors
                                            ],
                                            borderColor: [
                                                ...actIncVal.colors,
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                        </div>
                    </div>
                    <div className="max-w-sm bg-blue-500 p-4 rounded-lg shadow  flex items-center justify-center">
                        <div className="max-w-sm bg-gray-100 p-4 rounded-lg shadow">
                            <h1 className="text-xl underline mb-2">Number of Solo Parent by Gender</h1>
                            <Pie
                                data={{
                                    labels: byGenderVal.labels,
                                    datasets: [
                                        {
                                            label: 'Value',
                                            data: byGenderVal.values,
                                            backgroundColor: [
                                                ...byGenderVal.colors,
                                            ],
                                            borderColor: [
                                                ...byGenderVal.colors,
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                }}
                            />
                        </div>
                    </div>
                    <div className="w-full flex justify-center col-span-2">
                        <div className="max-w-2xl bg-blue-500 p-4 rounded-lg shadow flex items-center justify-center">
                            <div className="max-w-sm bg-gray-100 p-4 rounded-lg shadow">
                                <h1 className="text-xl underline mb-2">{`Total Solo Parents per Barangay this month of ${ALL_MONTHS[new Date().getMonth()]}`}</h1>
                                <Bar
                                    data={{
                                        labels: perBrngData.labels,
                                        datasets: [
                                            {
                                                data: perBrngData.values,
                                                backgroundColor: [
                                                    'rgba(255, 99, 132, 0.2)',
                                                    'rgba(54, 162, 235, 0.2)',
                                                    'rgba(255, 206, 86, 0.2)',
                                                    'rgba(75, 192, 192, 0.2)',
                                                    'rgba(153, 102, 255, 0.2)',
                                                    'rgba(255, 159, 64, 0.2)',
                                                ],
                                                borderColor: [
                                                    'rgba(255, 99, 132, 1)',
                                                    'rgba(54, 162, 235, 1)',
                                                    'rgba(255, 206, 86, 1)',
                                                    'rgba(75, 192, 192, 1)',
                                                    'rgba(153, 102, 255, 1)',
                                                    'rgba(255, 159, 64, 1)',
                                                ],
                                                borderWidth: 1,
                                            },
                                        ],
                                        
                                    }}
                                    options={{
                                        plugins: {
                                            legend:{ 
                                                display: false,
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
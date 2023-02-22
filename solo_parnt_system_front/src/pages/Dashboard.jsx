import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactToPrint from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
    PieChart,
    Pie
} from "recharts";
import lungsod_logo from "../lungsod_logo.png";
import cssd_logo from "../cssd_logo.png";

const BAR_COLORS = [
    "#715ed1",
    "#6460ea",
    "#0e62a3",
    "#59c7ff",
    "#3419d1",
    "#1b7484",
    "#1652f7",
    "#3091a0",
    "#5431e0",
    "#477cb2",
    "#014db7",
    "#2d5ea8",
    "#2ef4ee",
    "#5d72d3",
]

const ALL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${name}=${value}|${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const Dashboard = () => {

    const chartsToPrintRef = useRef();

    const [actIncVal, setActIncVal] = useState([]);
    const [byGenderVal, setByGenderVal] = useState([]);
    const [perBrngData, setPerBrngData] = useState([]);

    const [printMode, setPrintMode] = useState(false);

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

            let newActIncVal = num_act_inact_solo_parent.map((data) => ({
                name: data.active ? `Active` : `Inactive`,
                value: data.column,
                color: data.active ? 'rgb(0,255,0, 0.7)' : 'rgb(255,0,0, 0.7)',
            }));

            setActIncVal(newActIncVal);
            // rgb(255,105,180), rgb(0,0,255)
            let newBenderVal = num_solo_parent_by_gender.map((data) => ({
                name: data.gender,
                value: data.column,
                color: data.gender === "Male" ? 'rgb(0,0,255)' : 'rgb(255,105,180)',
            }));

            setByGenderVal(newBenderVal);

            let newPerBrngData = tot_solo_parent_per_brng.map((data) => ({
                name: data.barangay,
                value: data.column,
            }));
            setPerBrngData(newPerBrngData);

        }).catch((err) => { });
    }



    return (
        <div className="container mx-3 flex justify-center">
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
                <div className='hidden'>
                    <div className='w-full' ref={chartsToPrintRef}>
                        <div className="my-3 ml-3 w-full flex items-center justify-center">
                            <div className="flex items-center justify-center">
                                <div className="w-16">
                                    <img src={lungsod_logo} />
                                </div>
                                <div className="font-serif text-sm text-center mx-3">
                                    <p className="font-semibold">Republic of the Philippines</p>
                                    <p className="font-semibold">Province of laguna</p>
                                    <p className="font-semibold">City of Calamba</p>
                                    <p>Telephone No.(049) 545- 6789 loc. 8120, 8226 & 8022</p>
                                </div>
                                <div className="">
                                    <img className="h-10" src={cssd_logo} />
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 w-full">
                            <div className="bg-blue-500 p-4 rounded-lg shadow  flex items-center justify-center">
                                <div className="bg-gray-100 p-4 rounded-lg shadow">
                                    <h1 className="text-xl underline mb-2">Solo Parents Count by Membership Status</h1>
                                    <PieChart width={400} height={400}>
                                        <Pie
                                            data={actIncVal}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={164}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Legend />
                                            {actIncVal.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color || 'green'} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </div>
                            </div>
                            <div className="bg-blue-500 p-4 rounded-lg shadow  flex items-center justify-center">
                                <div className="bg-gray-100 p-4 rounded-lg shadow">
                                    <h1 className="text-xl underline mb-2">Number of Solo Parent by Gender</h1>
                                    <PieChart width={400} height={400}>
                                        <Pie
                                            data={byGenderVal}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={164}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Legend />
                                            {byGenderVal.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color || 'green'} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </div>
                            </div>
                            <div className="w-full flex justify-center col-span-2">
                                <div className=" bg-blue-500 p-4 rounded-lg shadow flex items-center justify-center">
                                    <div className=" bg-gray-100 p-4 rounded-lg shadow">
                                        <h1 className="text-xl underline mb-2">{`Total Solo Parents per Barangay this month of ${ALL_MONTHS[new Date().getMonth()]}`}</h1>
                                        <BarChart
                                            width={764}
                                            height={300}
                                            data={perBrngData}
                                            margin={{
                                                top: 5,
                                                right: 30,
                                                left: 20,
                                                bottom: 5
                                            }}

                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            {/* <Legend /> */}
                                            <Bar
                                                dataKey="value"
                                                fill={`${BAR_COLORS[0]}`}
                                                label={{
                                                    position: "center",
                                                    fill: '#000000',
                                                }}
                                            >
                                                {perBrngData.map((d, di) => (
                                                    <Cell
                                                        key={`cell-${di}`}
                                                        fill={BAR_COLORS[di % BAR_COLORS.length]}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full'>
                    <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-6 w-full">
                        <div className="bg-blue-500 p-4 rounded-lg shadow  flex items-center justify-center">
                            <div className="bg-gray-100 p-4 rounded-lg shadow">
                                <h1 className="text-xl underline mb-2">Solo Parents Count by Membership Status</h1>
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={actIncVal}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={164}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        <Legend />
                                        {actIncVal.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || 'green'} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </div>
                        </div>
                        <div className="bg-blue-500 p-4 rounded-lg shadow  flex items-center justify-center">
                            <div className="bg-gray-100 p-4 rounded-lg shadow">
                                <h1 className="text-xl underline mb-2">Number of Solo Parent by Gender</h1>
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={byGenderVal}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={164}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        <Legend />
                                        {byGenderVal.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || 'green'} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </div>
                        </div>
                        <div className="w-full flex justify-center col-span-2">
                            <div className=" bg-blue-500 p-4 rounded-lg shadow flex items-center justify-center">
                                <div className=" bg-gray-100 p-4 rounded-lg shadow">
                                    <h1 className="text-xl underline mb-2">{`Total Solo Parents per Barangay this month of ${ALL_MONTHS[new Date().getMonth()]}`}</h1>
                                    <BarChart
                                        width={764}
                                        height={300}
                                        data={perBrngData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5
                                        }}

                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        {/* <Legend /> */}
                                        <Bar
                                            dataKey="value"
                                            fill={`${BAR_COLORS[0]}`}
                                            label={{
                                                position: "center",
                                                fill: '#000000',
                                            }}
                                        >
                                            {perBrngData.map((d, di) => (
                                                <Cell
                                                    key={`cell-${di}`}
                                                    fill={BAR_COLORS[di % BAR_COLORS.length]}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
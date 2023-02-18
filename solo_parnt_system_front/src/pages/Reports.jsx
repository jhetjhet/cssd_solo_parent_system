import {
    faEdit,
    faPrint,

} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Form, Link, useLoaderData, useSearchParams } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { useAthenticationContext } from "../components/Authentication";
import { Input, Options, Switch } from "../components/FormInputs";


export async function loader({ request }) {

    let url = new URL(request.url);
    let params = {};
    let searchVal = url.searchParams.get("search");
    let activeVal = url.searchParams.get("active");

    if (searchVal) params.search = searchVal;
    if (activeVal && activeVal !== 'all') params.active = activeVal;


    let req = axios.get('http://localhost:8000/api/parents/', {
        params,
    });

    let parents = [];

    try {
        let resp = await req;
        parents = resp.data;
    } catch (error) {

    }

    return { parents };
}

async function setUserActive(activeStatus, id) {

    try {
        const req = axios.post(`http://localhost:8000/api/parents/${id}/deactivate/`);
        if (activeStatus)
            req = axios.post(`http://localhost:8000/api/parents/${id}/activate/`);

        const resp = await req;

        return true;

    } catch (error) {
        return false;
    }

}

const ReportsTablePrintable = React.forwardRef((props, ref) => {

    return (
        <div ref={ref} className="w-screen overflow-x-hidden">
            <div className="my-3 ml-3">
                <h1 className="text-xl font-semibold">Total = {props.datas.length}</h1>
            </div>
            <ReportsTable
                {...props}
            />
        </div>
    );
});

const ReportsTable = ({ cols, fields_row_name, datas, setDatas, printMode = false }) => {

    const {
        user,
    } = useAthenticationContext();

    const __on_switch_toggle__ = async (e) => {
        let { name: nameID, checked } = e.target;

        let [name, id] = nameID.split(".");

        let stat = await setUserActive(checked, id);

        if (!stat)
            checked = !checked;

        const newDatas = datas.map((data) => {

            if (data.id === id) {

                let newData = { ...data };
                newData[name] = checked;
                return newData;
            }

            return data;
        });
        setDatas(newDatas);
    }



    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
                <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                        <table className="min-w-full">
                            <thead className="">
                                <tr>
                                    <th scope="col" className="border border-gray-500 text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                        #
                                    </th>
                                    {cols && cols.map((col, i) => (
                                        <th scope="col" className="border border-gray-500 text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                            key={i}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                    {!printMode && (
                                        <th scope="col" className="border border-gray-500 text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {datas && datas.map((data, i) => (
                                    <tr className="even:bg-blue-200"
                                        key={data.id}
                                    >
                                        <td className="border border-gray-500 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {i + 1}
                                        </td>
                                        {fields_row_name.map((fr_name, i) => (
                                            <td className="border border-gray-500 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                                key={i}
                                            >
                                                {data[fr_name]}
                                            </td>
                                        ))}
                                        {!printMode && (
                                            <td className={`
                                            border border-gray-500 text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap
                                                ${user.is_admin ? "" : "opacity-50 pointer-events-none"}
                                            `}>
                                                <div className="space-x-2 flex items-center">
                                                    <Link to={`/form/${data.id}/`}>
                                                        <FontAwesomeIcon
                                                            className="bg-gray-400 p-1 rounded-md hover:bg-gray-300"
                                                            icon={faEdit}
                                                            size={"lg"}
                                                        />
                                                    </Link>
                                                    <div>
                                                        <Switch
                                                            name={`active.${data.id}`}
                                                            checked={data.active}
                                                            onChange={__on_switch_toggle__}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Reports = () => {

    const { parents } = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();

    const [parentsData, setParentsData] = useState([]);

    const [searchVal, setSearchVal] = useState("");
    const [activeVal, setActiveVal] = useState(true);

    const reportTablePrintRef = useRef();

    useEffect(() => {
        setParentsData([...parents]);
    }, [parents]);

    useEffect(() => {
        setSearchParams({
            active: activeVal,
        });
    }, []);

    const __on_active_opt_change__ = (e) => {
        let newActiveVal = e.target.value;
        setActiveVal(newActiveVal);
        setSearchParams({
            active: newActiveVal,
        });
    }

    return (
        <div className="container mx-3 flex justify-center">
            <div className="flex flex-col bg-blue-100 p-3 rounded-lg my-4 shadow relative">
                <h1 className="my-3 text-3xl font-extrabold">Records</h1>
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
                        content={() => reportTablePrintRef.current}
                    />
                </div>
                <Form role={"search"}>
                    <div className="mt-3 p-3 border border-gray-400 flex items-center">
                        <div className="relative mt-1 w-full mb-3">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                            </div>
                            <input type="search" name="search" id="table-search" className="block p-2 pl-10 text-lg text-gray-900 border-2 border-gray-300 rounded-lg w-full bg-gray-50 outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Search for items"
                                value={searchVal}
                                onChange={(e) => setSearchVal(e.target.value)}
                            />
                        </div>
                        <div className="max-w-[12rem] ml-3">
                            <Options
                                label={"Active Filter"}
                                name={"active"}
                                value={activeVal}
                                options={[
                                    { value: 'all', label: "All" },
                                    { value: true, label: "Active" },
                                    { value: false, label: "Inactive" },
                                ]}
                                onChange={__on_active_opt_change__}
                            />
                        </div>
                    </div>
                </Form>
                <div className="mt-4">
                    <div className="hidden">
                        <ReportsTablePrintable
                            cols={[
                                "Name",
                                "Contact #",
                                "Gender",
                                "Age",
                                "Civil Status",
                            ]}
                            fields_row_name={[
                                "full_name",
                                "contact_number",
                                "gender",
                                "age",
                                "civil_status",
                            ]}
                            datas={parentsData}
                            printMode={true}
                            ref={reportTablePrintRef}
                        />
                    </div>
                    <ReportsTable
                        cols={[
                            "Name",
                            "Contact #",
                            "Gender",
                            "Age",
                            "Civil Status",
                        ]}
                        fields_row_name={[
                            "full_name",
                            "contact_number",
                            "gender",
                            "age",
                            "civil_status",
                        ]}
                        datas={parentsData}
                        setDatas={setParentsData}
                    />
                </div>
            </div>
        </div>
    )
}

export default Reports;
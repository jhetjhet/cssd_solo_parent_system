import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const { default: Sidebar } = require("../components/Sidebar")


const Root = () => {

    return (
        <div>
            <Sidebar />
            <div className="ml-[300px]">
                {/* <Navbar /> */}
                <div className="bg-gray-100 min-h-[calc(100vh-52px)] overflow-x-hidden">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Root;
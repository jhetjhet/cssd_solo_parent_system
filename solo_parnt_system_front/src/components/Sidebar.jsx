import { Link, useNavigate } from "react-router-dom";
import { useAthenticationContext } from "./Authentication";


const Sidebar = () => {

    const {
        logout,
        user,
    } = useAthenticationContext();

    const navigate = useNavigate();

    return (
        <div
            className="sidebar fixed top-0 bottom-0 lg:left-0 p-4 w-[300px] overflow-y-auto text-center bg-blue-400 shadow-lg"
        >
            <div className="text-gray-100 text-xl">
                <div className="p-2.5 mt-1 flex items-center">
                    <h1 className="font-bold text-blue-900 text-2xl ml-3">Solo Parents Records in Calamba City</h1>
                    <i
                        className="bi bi-x cursor-pointer ml-28 lg:hidden"
                    ></i>
                </div>
                <div className="my-2 bg-gray-600 h-[1px]"></div>
            </div>
            <Link
                className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                to={"/dashboard/"}
                replace
            >
                <i className="bi bi-house-door-fill"></i>
                <span className="text-[15px] ml-4 text-gray-200 font-bold">Dashboard</span>
            </Link>
            <Link
                className={`
                    p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white
                    ${ user.is_admin ? "" : "opacity-50 pointer-events-none" }
                `}
                to={"/form/"}
                replace

            >
                <i className="bi bi-bookmark-fill"></i>
                <span className="text-[15px] ml-4 text-gray-200 font-bold">Application Form</span>
            </Link>
            <Link
                className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                to={"/records/"}
            >
                <i className="bi bi-bookmark-fill"></i>
                <span className="text-[15px] ml-4 text-gray-200 font-bold">Records</span>
            </Link>
            <Link
                className={`
                    p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white
                    ${ user.is_admin ? "" : "opacity-50 pointer-events-none" }
                `}
                to={"/announcements/"}
                replace
            >
                <i className="bi bi-bookmark-fill"></i>
                <span className="text-[15px] ml-4 text-gray-200 font-bold">Announcements</span>
            </Link>
            <Link
                className={`
                    p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white
                    ${ user.is_admin ? "" : "opacity-50 pointer-events-none" }
                `}
                to={"/presidents/"}
                replace
            >
                <i className="bi bi-bookmark-fill"></i>
                <span className="text-[15px] ml-4 text-gray-200 font-bold">Barangay Presidents'</span>
            </Link>
            <div className="my-4 bg-gray-600 h-[1px]"></div>
            {/* <div
                className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                onclick="dropdown()"
            >
                <i className="bi bi-chat-left-text-fill"></i>
                <div className="flex justify-between w-full items-center">
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Chatbox</span>
                    <span className="text-sm rotate-180" id="arrow">
                        <i className="bi bi-chevron-down"></i>
                    </span>
                </div>
            </div>
            <div
                className="text-left text-sm mt-2 w-4/5 mx-auto text-gray-200 font-bold"
                id="submenu"
            >
                <h1 className="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
                    Social
                </h1>
                <h1 className="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
                    Personal
                </h1>
                <h1 className="cursor-pointer p-2 hover:bg-blue-600 rounded-md mt-1">
                    Friends
                </h1>
            </div> */}
            <button
                className="p-2.5 mt-3 w-full flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-600 text-white"
                onClick={() => {
                    navigate('/login/', { replace: true, state: {
                        logout: true
                    } });
                    logout();
                }}
            >
                <i className="bi bi-box-arrow-in-right"></i>
                <span className="text-[15px] ml-4 text-gray-200 font-bold">Logout</span>
            </button>
        </div>
    );
}

export default Sidebar;
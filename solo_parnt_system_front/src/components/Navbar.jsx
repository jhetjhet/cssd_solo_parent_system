

const Navbar = () => {

    return (
        <nav className="w-full flex flex-wrap items-center justify-between py-3 bg-blue-400 shadow-lg">
            <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6">
                <div className="flex w-full">
                    <a className="text-xl text-black font-semibold" href="#">Navbar</a>

                    <div className="ml-auto">
                        <button>Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
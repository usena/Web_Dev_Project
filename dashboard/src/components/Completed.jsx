import React, { useEffect, useState } from "react";
import { getDoneTickets, getUsername } from "../service/ticketService";
import { Timestamp } from "firebase/firestore";

const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString();
}

const Completed = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [category, setCategory] = useState(null);
    const [sort, setSort] = useState(null);
    const [inputSearch, setInputSearch] = useState("");

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);

        try {
            const ticketsData = await getDoneTickets();
            const ticketsUsers = await Promise.all(
                ticketsData.map(async (ticket) => {
                    const username = await getUsername(ticket.userID);
                    return {...ticket, username: username || "None"};
                })
            )
            setTickets(ticketsUsers);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategory = async (selectedCategory) => {
        setLoading(true);
        setCategory(selectedCategory);
        try{
            const ticketsData = await getDoneTickets();
            const ticketsUsers = await Promise.all(
                ticketsData.map(async (ticket) => {
                    const username = await getUsername(ticket.userID);
                    return {...ticket, username: username || "None"};
                })
            )
            const filteredTickets = ticketsUsers.filter(ticket => ticket.Category === selectedCategory);
            setTickets(filteredTickets);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const sortTickets = async (selectedSort) => {
        setLoading(true);
        setSort(selectedSort)
        try{
            let sortTickets = [...tickets];

            if (selectedSort === "most urgent"){
                sortTickets = tickets.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            } else if (selectedSort === "least urgent") {
                sortTickets = tickets.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
            } else if (selectedSort === "latest") {
                sortTickets = tickets.sort((a, b) => new Date(b.createdAt) - new Date (a.createdAt));
            } else if (selectedSort === "oldest") {
                sortTickets = tickets.sort((a, b) => new Date(a.createdAt) - new Date (b.createdAt));
            }
            setTickets(sortTickets);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleSearch = (e) => {
        setInputSearch(e.target.value);
    }

    const searchTickets = tickets.filter((ticket) =>
        ticket.title.toLowerCase().includes(inputSearch.toLowerCase()) ||
        ticket.username?.toLowerCase().includes(inputSearch.toLowerCase())
    );

    return (
        <div>
            <div className="searchBar flex justify-center items-center mt-3 p-3">
                <label className="input w-3/5 border-2 border-gray-700">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" onChange={handleSearch} className="grow bg-transparent outline-none placeholder-gray-400" placeholder="Search" />
                </label>
            </div>
            <div className="flex justify-evenly items-center mt-2 p-3">
                <div className="Category">
                    <button className="btn" popoverTarget="category" style={{ anchorName: "--anchor-1" }}>
                        Category
                    </button>
                    <span className="text-sm">: {category?.toUpperCase() || "All"}</span>

                    <ul className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
                        popover="auto" id="category" style={{ positionAnchor: "--anchor-1" }}>
                        <li><button onClick={() => fetchTickets() && setCategory("all")}>All</button></li>
                        <li><button onClick={() => handleCategory("inquiries")}>Inquiries</button></li>
                        <li><button onClick={() => handleCategory("booking")}>Booking</button></li>
                        <li><button onClick={() => handleCategory("refund")}>Refund</button></li>
                        <li><button onClick={() => handleCategory("technical")}>Technical</button></li>
                        <li><button onClick={() => handleCategory("complaints")}>Complaints</button></li>
                    </ul>
                </div>

                <div className="SortBy">
                    <button className="btn" popoverTarget="sortBy" style={{ anchorName: "--anchor-2" }}>
                        Sort by
                    </button>

                    <ul className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
                        popover="auto" id="sortBy" style={{ positionAnchor: "--anchor-2" }}>
                        <li><button onClick={() => sortTickets("most urgent")}>Most Urgent</button></li>
                        <li><button onClick={() => sortTickets("latest")}>Latest</button></li>
                        <li><button onClick={() => sortTickets("oldest")}>Oldest</button></li>
                        <li><button onClick={() => sortTickets("least urgent")}>Least Urgent</button></li>
                    </ul>
                </div>
            </div>

            <div
                className="flex justify-between items-center mt-2 p-3 text-white bg-green-700"
                >
                    <span className="text-sm text-gray-100 basis-1/3 text-left">Title</span>
                    <span className="text-sm text-gray-100 basis-1/3 text-left">Staff</span>
                    <span className="text-sm text-gray-100 basis-1/3 text-left">Completed Date</span>
                    <span className="text-sm text-gray-100 basis-1/3 text-right">Created Date</span>
            </div>

            {loading && <p className="text-gray-600">Loading tickets...</p>}

            {!loading && searchTickets.length === 0 && (
                <p className="text-gray-500">No tickets availble!</p>
            )}

            {!loading &&
                searchTickets.map((ticket) => (
                    <div 
                    key={ticket.id}
                    className="flex justify-between items-center mt-2 p-3 text-black bg-white rounded-md shadow-md"
                    >
                        <span className="text-sm basis-1/3 text-left">{ticket.title}</span>
                        <span className="text-sm basis-1/3 text-left">{ticket.username}</span>
                        <span className="text-sm basis-1/3 text-left">{formatDate(ticket.completedAt)}</span>
                        <span className="text-sm basis-1/3 text-right">{formatDate(ticket.createdAt)}</span>
                    </div>
                ))
            }
        </div>
    )
}

export default Completed;
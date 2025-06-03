import React, { useEffect, useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';

const CreateTicket = () => {

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("inquiries");
    const [desc, setDesc] = useState("");

    const categories = ['technical', 'complaints', 'inquiries', 'booking', 'refund', 'other'];

    const handleCreateTicket = async (e) => {
        e.preventDefault();

        const url = `${import.meta.env.VITE_API_URL}/service/ticket/add_ticket`;
        console.log("Post to: ", `${import.meta.env.VITE_API_URL}/service/ticket/add_ticket`);

        try {
            const response = await axios.post(url, {
                ticketTitle: title,
                ticketCategory: category,
                ticketDesc: desc
            });

            toast.success("Ticket created successfully!");

            setTitle("")
            setCategory("")
            setDesc("")
        } catch (error) {
            if (error.response) {
                // Backend responded with an error
                const status = error.response.status;
                const msg = error.response.data.message;

                if (status === 400) {
                    toast.error(msg || "Please fill all required fields.");
                } else {
                    toast.error(msg || "An unexpected server error occurred.");
                }
            } else if (error.request) {
                // Request was made but no response
                toast.error("No response from server. Check your network.");
            } else {
                // Something else happened
                toast.error("An error occurred while creating the ticket.");
            }

            console.error("Create ticket error:", error);
        }
    };

    return (
        <>
            <div className="p-4">           
                <form className="flex flex-col gap-3 w-80" onSubmit={handleCreateTicket}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 rounded-md"
                    />
                    <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="select select-bordered"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Description"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="border p-2 rounded-md"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
};

export default CreateTicket;

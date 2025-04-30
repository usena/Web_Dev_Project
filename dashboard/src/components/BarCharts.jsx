'use client';
import { BarChart, Bar, ResponsiveContainer, 
    XAxis, YAxis, CartesianGrid, Legend, Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import { getAllTickets } from "../service/ticketService";
import {format, subDays, isAfter} from "date-fns";

const IssuedChart = () => {
    const [chartData, setChartData] = useState([]);
    const [filter, setFilter] = useState("week");

    useEffect(() => {
            fetchTickets();
        }, [filter]);
    
        const fetchTickets = async () => {
            try {
                const ticketsData = await getAllTickets();
                const filtered = filterTickets(ticketsData, filter);
                const grouped = groupByDate(filtered);
                setChartData(grouped);
            } catch (error) {
                console.log(error);
            }
        };

        const filterTickets = (tickets) => {
            const now = new Date();
            const cutoff = new Date();
            cutoff.setDate(now.getDate() - 7);

            return tickets.filter(ticket => new Date(ticket.createdAt) >= cutoff);
        };

        const groupByDate = (tickets) => {
            const counts = {};

            tickets.forEach(ticket => {
                const dateStr = format(new Date(ticket.createdAt), "dd-MM-yyy");
                counts[dateStr] = (counts[dateStr] || 0) + 1;
            });

            return Object.keys(counts).map(date => ({
                date, 
                count: counts[date],
            }));
        };

{/**https://www.youtube.com/watch?v=Fu_YFp-9xoQ&t=58s */}
    return (
        
        <ResponsiveContainer width="100%" height="100%">
            <BarChart width={500} height={300} data={chartData} margin={{right: 30}}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="count" fill="#2563eb" name="Tickets"/>
            </BarChart>
        </ResponsiveContainer>
        
    )
}

export default IssuedChart;

const CustomTooltip = ({active, payload, label}) => {
    if (active && payload && payload.length) {
        return (
            <div className="p4 bg-slate-900 flex flex-col gap-4 rounded-md">
                <p className="text-medium text-lg">{label}</p>
                <p className="text-sm text-blue-400">
                    Counts:
                    <span className="ml-2">{payload[0].value}</span>
                </p>
            </div>
        )
    }

    return null;
};
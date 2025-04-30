import IssuedChart from "./BarCharts"
import CategoryChart from "./categoryChart"
import DeadlineChart from "./deadlineChart"

export default function AllCharts() {
    return (
        <div className="flex flex-col items-center justify-center px-4 md:px-8 xl:px-10">
            <div className="grid xl:grid-cols-3 lg:grid-cols-2 w-full gap-10 max-w-[1400px]">
                <GridItem title="Weekly Tickets">
                    <IssuedChart />
                </GridItem>
                <GridItem title="Categories">
                    <CategoryChart />
                </GridItem>
                <GridItem title="Deadline in 3 Days">
                    <DeadlineChart />
                </GridItem>
            </div>
        </div>
    )
}

function GridItem({title, children}) {
    return (
        <div className="flex flex-col items-center justify-center p-4 border border-slate-900 bg-green-100 rounded-xl h-[250px]">
            <h3 className="text-2xl font-semibold text-black mb-4">{title}</h3>
            <div className="w-full h-full">{children}</div>
        </div>
    )
}
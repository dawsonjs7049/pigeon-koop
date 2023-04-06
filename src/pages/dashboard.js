import Calendar from "@/components/Calender";


export default function Dashboard() {

    return (
        <div>
            <div className="widget-div">
                <a 
                    className="weatherwidget-io" 
                    href="https://forecast7.com/en/45d88n92d37/webster/?unit=us" 
                    data-label_1="WEBSTER" 
                    data-label_2="WEATHER" 
                    data-theme="original" 
                    >WEBSTER WEATHER
                </a>
            </div>
            <Calendar />
        </div>
    )
}
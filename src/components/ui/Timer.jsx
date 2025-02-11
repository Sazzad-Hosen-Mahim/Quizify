/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";



const Timer = ({endTime}) => {

    const calculateTimeLeft = ()=>{
        const now = new Date().getTime();
        const reminingTime = endTime - now;
        return reminingTime > 0 ? reminingTime : 0;
    }

    const [TimeLeft, setTimeLeft]= useState(calculateTimeLeft());

    useEffect(()=>{
        const interval = setInterval(()=>{
            setTimeLeft(calculateTimeLeft())
        }, 1000)
        return ()=> clearInterval(interval);
    }, [])

    const formatTIme = (milisecond)=>{
        const totalSeconds = Math.floor(milisecond / 1000);
        const hours = Math.floor(totalSeconds/3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}:${String(seconds).padStart(2, "0")}`;
    }

    return (
        <div className="text-center bg-gray-800 text-white p-4 rounded-md">
        <h2 className="text-lg font-semibold">Countdown Timer</h2>
        <p className="text-2xl font-bold">{formatTIme(TimeLeft)}</p>
      </div>
  )
}

export default Timer
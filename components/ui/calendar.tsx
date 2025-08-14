import React, { useEffect, useState } from 'react';
import Button from './button';
import { NextArrow, PrevArrow } from './arrows/arrows';
import { ConfirmedDate } from "@/app/types/date";

interface CalendarProps {
  onHandleChange: (date: string | null, hour: string | null) => void;
  confirmedDates: ConfirmedDate[] | null;
  dentistID: string | null;
}

const Calendar: React.FC<CalendarProps> = ({ onHandleChange, confirmedDates, dentistID }) => {
  // State variables for dates array and selected date
  const [dates, setDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // State variables for hours array and selected hour
  const [hours, setHours] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);

  useEffect(() => {
    generateDates();
  }, []);
  
  // Date generator
  const generateDates = () => {
    const today = new Date();
    const generatedDates: Date[] = [];

    for (let i = 0; i < 120; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);

      if (i === 0) {
        const currentHour = today.getHours();
        if (currentHour >= 14) continue;
      }

      generatedDates.push(date);
    }

    setDates(generatedDates);
  };

  // Day formatter
  const formatDay = (date: Date) => date.getDate();

  // Weekday formatter
  const formatWeekday = (date: Date) => {
    const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    return weekdays[date.getDay()];
  };  
  
  // ------------------------------------------------------------------
  
  useEffect(() => {
    if (selectedDate && confirmedDates && dentistID) {
      generateHours(confirmedDates, dentistID, selectedDate);
    }
  }, [selectedDate, confirmedDates, dentistID]);

  // Hour generator
  const generateHours = (confirmedDates: ConfirmedDate[] | null, dentistID: string | null, selectedDate: Date, start = 8, end = 14, interval = 30) => {
    const availableHours: string[] = [];

    const pickedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")}`;

    const filteredDates = confirmedDates?.filter((d) => {
      const confirmedDate = new Date(d.fecha).toISOString().split("T")[0];
      return (d.odontologo_id === dentistID) && (confirmedDate === pickedDate);
    });

    const now = new Date();
    const isToday = selectedDate.getDate() === now.getDate() && selectedDate.getMonth() === now.getMonth() && selectedDate.getFullYear() === now.getFullYear();

    for (let h = start; h < end; h++) {
      for (let m = 0; m < 60; m += interval) {
        const hour = h % 12 === 0 ? 12 : h % 12;
        const meridian = h < 12 ? "AM" : "PM";
        const minutes = m.toString().padStart(2, "0");

        const fullDate = new Date(`${pickedDate}T${h.toString().padStart(2, "0")}:${minutes}:00-04:00`);

        if (isToday && fullDate <= now) {
          continue;
        }

        const isTaken = filteredDates?.some((d) => {
          const start = new Date(d.fecha);
          const end = new Date(d.fin_tentativo);
          const current = fullDate;

          const bufferedStart = new Date(start.getTime() - 30 * 60 * 1000); // Add a 30 minutes buffer

          return current >= bufferedStart && current < end;
        });

        if (!isTaken) {
          availableHours.push(`${hour}:${minutes} ${meridian}`);
        }
      }
    }

    setHours(availableHours);
  };

  // ------------------------------------------------------------------

  // Date picker's handler
  const handleDateSelect = (date: Date) => {
    const isSameDate = selectedDate && selectedDate.getDate() === date.getDate() && selectedDate.getMonth() === date.getMonth() && selectedDate.getFullYear() === date.getFullYear();

    if (formatWeekday(date) != "Dom") {
      const newDate = isSameDate ? null : date;
      setSelectedDate(newDate);

      const formattedDate = newDate ? newDate.toISOString().split("T")[0] : null;

      onHandleChange(formattedDate, selectedHour);
    }
  };

  // Hour picker's handler
  const handleHourSelect = (hour: string) => {
    const newHour = hour === selectedHour ? null : hour;
    setSelectedHour(newHour);

    const formattedDate = selectedDate ? selectedDate.toISOString().split("T")[0] : null;

    onHandleChange(formattedDate, newHour);
  };

  return (
    <section className="space-y-12">
      <div className="w-full justify-center overflow-hidden space-y-4">
        <div className="flex justify-between items-center px-1.5">
          <span className="text-sm text-gray-800 font-semibold">
            {(selectedDate ?? new Date()).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', })}
          </span>

          <div className="flex gap-2">
            <button type="button" className="w-fit h-fit transform text-gray-300 text-2xl rounded-full cursor-pointer" onClick={() => document.querySelector('.scroll-container')?.scrollBy({ left: -192, behavior: 'smooth' })}>
              <PrevArrow></PrevArrow>
            </button>
            
            <button type="button" className="w-fit h-fit transform text-gray-300 text-2xl rounded-full cursor-pointer" onClick={() => document.querySelector('.scroll-container')?.scrollBy({ left: 192, behavior: 'smooth' })}>
              <NextArrow></NextArrow>
            </button>
          </div>   
        </div>

        <div className="flex w-full justify-center items-center pl-1.5">
          <div className="w-full flex space-x-4 overflow-hidden scroll-container scroll-smooth">
            {dates.map((date, index) => {
              const isSelected = selectedDate && selectedDate.getDate() === date.getDate() && selectedDate.getMonth() === date.getMonth() && selectedDate.getFullYear() === date.getFullYear();

              return (
                <div key={index} id={`date-${index}`} className={`flex flex-col items-center justify-center cursor-pointer ${ isSelected ? 'font-semibold' : '' }`} onClick={() => handleDateSelect(date)}>
                  <div className={`flex w-12 h-12 rounded-full justify-center items-center ${ isSelected ? "bg-[#003366] text-white" : "" } ${ formatWeekday(date) === "Dom" ? "bg-gray-300" : "" } ${ !isSelected && formatWeekday(date) != "Dom" ? "bg-gray-100 text-gray-800 border-3 border-gray-300 hover:bg-gray-300" : ""}`}>
                    {formatDay(date)}
                  </div>
                  <span className="text-xs text-gray-500 my-1">
                    {formatWeekday(date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-2">
          {hours.map((hour, index) => {
            return (
              <div key={index}>
                <Button key={index} type="button" className={`${hour === selectedHour ? "border-[#003366]" : "border-gray-200"} w-full bg-white border-3 shadow-none py-1`} onClick={() => handleHourSelect(hour)}>     
                  <span className="text-sm">{hour}</span>
                </Button>
              </div>
            )
          })}
      </div>
    </section>
  );
};

export default Calendar;
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X, AlertOctagon } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, isBefore, startOfDay, addDays } from 'date-fns';
import { Vendor } from '../types';

interface CalendarModalProps {
    vendor: Vendor;
    isOpen: boolean;
    onClose: () => void;
    onUnlock: (vendor: Vendor, isUrgent: boolean, selectedDate: Date) => void;
    onKeepDate?: (vendor: Vendor, selectedDate: Date) => void;
    isUnlocked: boolean;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ vendor, isOpen, onClose, onUnlock, onKeepDate, isUnlocked }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [viewMode, setViewMode] = useState<'month' | 'two-weeks'>('month');

    if (!isOpen) return null;

    const today = startOfDay(new Date());

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => {
        const newDate = subMonths(currentDate, 1);
        if (!isBefore(endOfMonth(newDate), today)) {
            setCurrentDate(newDate);
        }
    };

    const maxDate = addMonths(today, 2);
    const canGoNext = !isBefore(maxDate, endOfMonth(currentDate));
    const canGoPrev = !isBefore(endOfMonth(subMonths(currentDate, 1)), today);

    const getDaysArray = () => {
        if (viewMode === 'month') {
            const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 });
            const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 });
            return eachDayOfInterval({ start, end });
        } else {
            const start = today;
            const end = addDays(today, 13);
            const calendarStart = startOfWeek(start, { weekStartsOn: 1 });
            const calendarEnd = endOfWeek(end, { weekStartsOn: 1 });
            return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
        }
    };

    const days = getDaysArray();

    const getDateStatus = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        if (isBefore(date, today)) return 'UNAVAILABLE';
        if (vendor.blockedDates?.includes(dateStr) || vendor.availabilityStatus === 'BOOKED') return 'BOOKED';
        if (vendor.availabilityStatus === 'LIMITED') return 'LIMITED';
        return 'AVAILABLE';
    };

    const handleDateClick = (date: Date) => {
        if (isBefore(date, today)) return;
        setSelectedDate(date);
    };

    const selectedStatus = selectedDate ? getDateStatus(selectedDate) : null;
    const isPanicAvailable = selectedDate && vendor.panicModeOptIn && selectedStatus !== 'BOOKED' && selectedStatus !== 'UNAVAILABLE';

    return (
        <div className="fixed inset-0 z-[600] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm sm:p-6 animate-in fade-in duration-300">
            <div
                className="absolute inset-0"
                onClick={onClose}
            />
            <div className="relative bg-white w-full md:w-[480px] max-h-[90vh] md:max-h-[85vh] rounded-t-[40px] md:rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-500">

                {/* Header */}
                <div className="px-8 py-6 border-b border-black/5 flex items-start justify-between bg-white relative z-10">
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter pr-8">{vendor.businessName}</h3>
                        <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mt-1">
                            {vendor.category} • {vendor.location}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-[#f5f5f7] hover:bg-black/5 rounded-full transition-colors shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    <div className="p-8 pb-32 md:pb-8">
                        {/* View Toggles */}
                        <div className="flex gap-2 mb-8 bg-[#f5f5f7] p-1.5 rounded-full">
                            <button
                                onClick={() => setViewMode('month')}
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${viewMode === 'month' ? 'bg-white shadow-sm text-black' : 'text-[#86868b] hover:text-black'}`}
                            >
                                Month View
                            </button>
                            <button
                                onClick={() => setViewMode('two-weeks')}
                                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${viewMode === 'two-weeks' ? 'bg-white shadow-sm text-black' : 'text-[#86868b] hover:text-black'}`}
                            >
                                Next 14 Days
                            </button>
                        </div>

                        {/* Calendar Navigation */}
                        {viewMode === 'month' && (
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={prevMonth}
                                    disabled={!canGoPrev}
                                    className="p-3 hover:bg-[#f5f5f7] rounded-full disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <h4 className="text-sm font-black uppercase tracking-widest">
                                    {format(currentDate, 'MMMM yyyy')}
                                </h4>
                                <button
                                    onClick={nextMonth}
                                    disabled={!canGoNext}
                                    className="p-3 hover:bg-[#f5f5f7] rounded-full disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* Weekdays */}
                        <div className="grid grid-cols-7 gap-2 mb-4">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="text-center text-[9px] font-black text-[#86868b] uppercase tracking-widest">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {days.map((day, i) => {
                                const status = getDateStatus(day);
                                const isSelected = selectedDate && isSameDay(day, selectedDate);
                                const isPast = isBefore(day, today);
                                const isCurrentMonth = isSameMonth(day, currentDate);
                                const showPanic = vendor.panicModeOptIn && (status === 'AVAILABLE' || status === 'LIMITED') && !isPast;

                                let bgClass = 'bg-[#f5f5f7] hover:bg-black/5';
                                let textClass = 'text-black';

                                if (isPast) {
                                    bgClass = 'bg-transparent';
                                    textClass = 'text-black/20';
                                } else if (status === 'BOOKED') {
                                    bgClass = 'bg-red-50/50';
                                    textClass = 'text-red-300 line-through';
                                } else if (status === 'LIMITED') {
                                    bgClass = 'bg-amber-50';
                                    textClass = 'text-amber-600';
                                } else if (status === 'AVAILABLE') {
                                    bgClass = 'bg-green-50/50';
                                    textClass = 'text-green-600';
                                }

                                if (isSelected) {
                                    bgClass = 'bg-black scale-105 shadow-xl';
                                    textClass = 'text-white';
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleDateClick(day)}
                                        disabled={isPast}
                                        className={`relative aspect-square rounded-[20px] flex flex-col items-center justify-center p-1 transition-all ${bgClass} ${!isCurrentMonth && viewMode === 'month' ? 'opacity-40' : ''}`}
                                    >
                                        <span className={`text-sm sm:text-lg font-black ${textClass}`}>
                                            {format(day, 'd')}
                                        </span>
                                        {showPanic && (
                                            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                        )}
                                        {status === 'LIMITED' && !isSelected && (
                                            <div className="absolute bottom-1.5 w-1 h-1 bg-amber-500 rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-8 flex flex-wrap gap-4 justify-center bg-[#f5f5f7] p-4 rounded-3xl">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#86868b]">Available</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#86868b]">Limited</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-200" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#86868b]">Booked</span>
                            </div>
                            {vendor.panicModeOptIn && (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#86868b]">Panic Mode</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Panel */}
                <div className={`absolute bottom-0 left-0 right-0 bg-white border-t border-black/5 p-6 md:p-8 transform transition-transform duration-500 ${selectedDate ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Selected Date</p>
                            <p className="text-lg font-black uppercase">{selectedDate ? format(selectedDate, 'MMM do, yyyy') : ''}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Status</p>
                            <p className={`text-sm font-black uppercase ${selectedStatus === 'AVAILABLE' ? 'text-green-500' :
                                selectedStatus === 'LIMITED' ? 'text-amber-500' :
                                    selectedStatus === 'BOOKED' ? 'text-red-500' : 'text-black'
                                }`}>
                                {selectedStatus}
                            </p>
                        </div>
                    </div>

                    {selectedStatus === 'BOOKED' ? (
                        <div className="w-full py-4 bg-[#f5f5f7] text-center rounded-full text-[11px] font-black text-[#86868b] uppercase tracking-widest">
                            Date Unavailable
                        </div>
                    ) : isUnlocked ? (
                        <button
                            onClick={() => selectedDate && onKeepDate && onKeepDate(vendor, selectedDate)}
                            className="w-full flex-1 btn-apple py-5 text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                        >
                            <span>Keep Date</span>
                            <span className="opacity-50">|</span>
                            <span>1 Coin</span>
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => selectedDate && onUnlock(vendor, false, selectedDate)}
                                className="flex-1 btn-apple py-5 text-[11px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                            >
                                <span>Unlock Contact</span>
                                <span className="opacity-50">|</span>
                                <span>1 Coin</span>
                            </button>

                            {isPanicAvailable && (
                                <button
                                    onClick={() => selectedDate && onUnlock(vendor, true, selectedDate)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-[32px] py-5 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-red-200 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <AlertOctagon size={16} />
                                    <span>Panic Unlock</span>
                                    <span className="opacity-50">|</span>
                                    <span>2 Coins</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CalendarModal;

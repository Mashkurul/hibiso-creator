"use client";

import { createPortal } from "react-dom";
import { useMemo, useState } from "react";

type DateRangePickerProps = {
  isOpen: boolean;
  initialStartDate?: string;
  initialEndDate?: string;
  onClose: () => void;
  onConfirm: (range: { startDate: string; endDate: string }) => void;
  selectionMode?: "range" | "single";
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function parseInputDate(value?: string) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getTodayDate() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function formatInputDate(date: Date | null) {
  if (!date) return "";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(date: Date | null) {
  if (!date) return "Select date";
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${day} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`;
}

function sameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBetween(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const startValue = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endValue = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  return current > startValue && current < endValue;
}

function buildCalendarDays(month: number, year: number) {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const startDate = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
}

function isPastDate(date: Date) {
  const today = getTodayDate();
  return date.getTime() < today.getTime();
}

export default function DateRangePicker({
  isOpen,
  initialStartDate,
  initialEndDate,
  onClose,
  onConfirm,
  selectionMode = "range",
}: DateRangePickerProps) {
  const defaultStartDate = parseInputDate(initialStartDate) ?? getTodayDate();
  const defaultEndDate = parseInputDate(initialEndDate) ?? defaultStartDate;

  const [draftStart, setDraftStart] = useState<Date | null>(defaultStartDate);
  const [draftEnd, setDraftEnd] = useState<Date | null>(defaultEndDate);
  const [visibleMonth, setVisibleMonth] = useState(defaultStartDate.getMonth());
  const [visibleYear, setVisibleYear] = useState(defaultStartDate.getFullYear());

  const calendarDays = useMemo(
    () => buildCalendarDays(visibleMonth, visibleYear),
    [visibleMonth, visibleYear]
  );

  const handleDayClick = (date: Date) => {
    if (isPastDate(date)) {
      return;
    }

    if (selectionMode === "single") {
      setDraftStart(date);
      setDraftEnd(date);
      return;
    }

    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(date);
      setDraftEnd(null);
      return;
    }

    if (date.getTime() < draftStart.getTime()) {
      setDraftStart(date);
      setDraftEnd(draftStart);
      return;
    }

    setDraftEnd(date);
  };

  const handleDismiss = () => {
    const resetStart = parseInputDate(initialStartDate) ?? getTodayDate();
    const resetEnd = parseInputDate(initialEndDate) ?? resetStart;
    setDraftStart(resetStart);
    setDraftEnd(resetEnd);
    setVisibleMonth(resetStart.getMonth());
    setVisibleYear(resetStart.getFullYear());
    onClose();
  };

  const handleConfirm = () => {
    onConfirm({
      startDate: formatInputDate(draftStart),
      endDate: formatInputDate(selectionMode === "single" ? draftStart : draftEnd ?? draftStart),
    });
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#7fb2c8]/18 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[460px]">
        <div className="relative z-10 rounded-[28px] border border-white/60 bg-[#eaf3f7] px-5 py-5 shadow-[0_18px_44px_rgba(66,97,120,0.16)]">
          <h2 className="text-[28px] font-semibold leading-none text-[#182033]">Select Date</h2>
          <div className={`mt-5 grid gap-3 ${selectionMode === "single" ? "grid-cols-1" : "sm:grid-cols-2"}`}>
            <div className={`flex ${selectionMode === "single" ? "" : "items-center gap-3"}`}>
              {selectionMode === "range" && (
                <span className="w-10 shrink-0 text-sm font-semibold text-[#39445a]">From</span>
              )}
              <button
                type="button"
                className="flex-1 rounded-full border border-[#e0e5ec] bg-[#fdfdfd] px-4 py-2.5 text-left text-sm font-medium text-[#606b80] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_6px_14px_rgba(24,32,51,0.06)] transition hover:border-[#cfd7e2] focus:outline-none focus:ring-4 focus:ring-[#49b7ef]/15"
              >
                <span className="flex items-center justify-between gap-3">
                  <span>{formatDisplayDate(draftStart)}</span>
                  <span className="text-[#8f99ad]">{"\u25BE"}</span>
                </span>
              </button>
            </div>
            {selectionMode === "range" && (
              <div className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-sm font-semibold text-[#39445a]">To</span>
                <button
                  type="button"
                  className="flex-1 rounded-full border border-[#e0e5ec] bg-[#fdfdfd] px-4 py-2.5 text-left text-sm font-medium text-[#606b80] shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_6px_14px_rgba(24,32,51,0.06)] transition hover:border-[#cfd7e2] focus:outline-none focus:ring-4 focus:ring-[#49b7ef]/15"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span>{formatDisplayDate(draftEnd ?? draftStart)}</span>
                    <span className="text-[#8f99ad]">{"\u25BE"}</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 rounded-[28px] border border-[#eef1f5] bg-white px-4 pb-5 pt-5 shadow-[0_18px_44px_rgba(31,44,68,0.12)]">
          <div className="flex flex-wrap justify-center gap-2.5">
            <div className="ui-select-wrap !min-w-[140px]">
              <select
                aria-label="Select month"
                value={visibleMonth}
                onChange={(event) => setVisibleMonth(Number(event.target.value))}
                className="ui-select rounded-full !bg-[#f7f7f8] !py-2.5 !pl-4"
              >
                {monthNames.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="ui-select-wrap !min-w-[120px]">
              <select
                aria-label="Select year"
                value={visibleYear}
                onChange={(event) => setVisibleYear(Number(event.target.value))}
                className="ui-select rounded-full !bg-[#f7f7f8] !py-2.5 !pl-4"
              >
                {[2024, 2025, 2026, 2027].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-y-3 text-center">
            {weekDays.map((day) => (
              <div key={day} className="text-[11px] font-semibold tracking-[0.08em] text-[#9aa3b5]">
                {day}
              </div>
            ))}
          </div>

          <div className="mt-3 border-t border-[#edf0f4] pt-3">
            <div className="grid grid-cols-7 gap-y-2.5 text-center">
              {calendarDays.map((date) => {
                const inMonth = date.getMonth() === visibleMonth;
                const isPast = isPastDate(date);
                const selected = sameDay(date, draftEnd ?? draftStart);
                const rangeEdge = sameDay(date, draftStart) || sameDay(date, draftEnd);
                const inRange = selectionMode === "range" && isBetween(date, draftStart, draftEnd);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => handleDayClick(date)}
                    disabled={isPast}
                    className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-[#49b7ef]/15 disabled:cursor-not-allowed ${
                      selected
                        ? "bg-[#27aef0] text-white shadow-[0_10px_22px_rgba(39,174,240,0.35)]"
                        : isPast
                          ? "text-[#d7dce6]"
                          : rangeEdge || inRange
                            ? "bg-[#eaf7ff] text-[#2197d2]"
                            : inMonth
                              ? "text-[#30384a] hover:bg-[#f2f7fb]"
                              : "text-[#c2c8d4] hover:bg-[#f7f8fa]"
                    }`}
                  >
                    {`${date.getDate()}`.padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-full bg-[#fff2eb] px-6 py-2.5 text-sm font-semibold text-[#ea8f63] shadow-[0_8px_18px_rgba(234,143,99,0.12)] transition hover:brightness-[0.98] focus:outline-none focus:ring-4 focus:ring-[#ea8f63]/15"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-full bg-gradient-to-r from-[#de8b34] to-[#e36d58] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(227,109,88,0.22)] transition hover:brightness-[1.02] focus:outline-none focus:ring-4 focus:ring-[#de8b34]/15"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}





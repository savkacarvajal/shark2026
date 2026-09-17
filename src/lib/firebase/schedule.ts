import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	onSnapshot,
	query,
	setDoc,
	where,
	type Timestamp,
} from "firebase/firestore";
import { db } from "./client";

// Turnos are global (not nested under a module) because sellers rotate across all modules —
// each shift records which module the seller is assigned to that day.
export interface Shift {
	id: string;
	sellerId: string;
	sellerName: string;
	moduleId: string;
	date: string; // YYYY-MM-DD
	start: string; // HH:mm
	end: string; // HH:mm
}

const turnosRef = collection(db, "turnos");

function shiftId(date: string, sellerId: string) {
	return `${date}_${sellerId}`;
}

/** Range is inclusive on both ends, dates as YYYY-MM-DD strings (sort correctly as strings). */
export function watchWeekShifts(startDate: string, endDate: string, callback: (shifts: Shift[]) => void) {
	const q = query(turnosRef, where("date", ">=", startDate), where("date", "<=", endDate));
	return onSnapshot(q, (snap) => {
		callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Shift, "id">) })));
	});
}

/** Pass an empty moduleId to clear the shift for that day (day off / unassigned). */
export function setShift(
	sellerId: string,
	sellerName: string,
	moduleId: string,
	date: string,
	start: string,
	end: string,
) {
	const ref = doc(db, "turnos", shiftId(date, sellerId));
	if (!moduleId) {
		return deleteDoc(ref);
	}
	return setDoc(ref, { sellerId, sellerName, moduleId, date, start, end });
}

export type AttendanceEventType = "llegada" | "colacion_salida" | "colacion_vuelta" | "salida";

export const ATTENDANCE_EVENTS: { id: AttendanceEventType; label: string }[] = [
	{ id: "llegada", label: "Llegada" },
	{ id: "colacion_salida", label: "Salida a colación" },
	{ id: "colacion_vuelta", label: "Vuelta de colación" },
	{ id: "salida", label: "Salida" },
];

export interface AttendanceEvent {
	id: string;
	sellerId: string;
	sellerName: string;
	date: string;
	event: AttendanceEventType;
	at: Timestamp;
	createdByUid: string;
}

export function watchDayAttendance(moduleId: string, date: string, callback: (events: AttendanceEvent[]) => void) {
	const q = query(collection(db, "modules", moduleId, "asistencia"), where("date", "==", date));
	return onSnapshot(q, (snap) => {
		const events = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AttendanceEvent, "id">) }));
		events.sort((a, b) => (a.at?.toMillis?.() ?? 0) - (b.at?.toMillis?.() ?? 0));
		callback(events);
	});
}

export function markAttendance(
	moduleId: string,
	sellerId: string,
	sellerName: string,
	event: AttendanceEventType,
	createdByUid: string,
) {
	const date = new Date().toISOString().slice(0, 10);
	return addDoc(collection(db, "modules", moduleId, "asistencia"), {
		sellerId,
		sellerName,
		date,
		event,
		at: new Date(),
		createdByUid,
	});
}

export interface WeekDay {
	date: string; // YYYY-MM-DD
	label: string; // "Lun 15"
}

/** Monday-start week, offsetWeeks 0 = current week, -1 = previous, 1 = next. */
export function getWeekDays(offsetWeeks: number): WeekDay[] {
	const now = new Date();
	const dayOfWeek = (now.getDay() + 6) % 7; // 0 = Monday
	const monday = new Date(now);
	monday.setHours(0, 0, 0, 0);
	monday.setDate(now.getDate() - dayOfWeek + offsetWeeks * 7);

	const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date(monday);
		d.setDate(monday.getDate() + i);
		const date = d.toISOString().slice(0, 10);
		return { date, label: `${dayNames[i]} ${d.getDate()}` };
	});
}

export function todayString() {
	return new Date().toISOString().slice(0, 10);
}

import React, { useState, useEffect } from "react";
import api from "../services/api";

const BloodIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#c80040"><path d="M12 2C12 2 4 10.5 4 15a8 8 0 0016 0C20 10.5 12 2 12 2z" /></svg>;
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const InfoIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;

const typeStyles = {
    DARURAT: {
        border: "border-l-[#c80040]",
        badge: "bg-red-50 text-[#c80040] border-red-100",
        iconBg: "bg-red-50",
        icon: <BloodIcon />
    },
    SUKSES: {
        border: "border-l-blue-400",
        badge: "bg-blue-50 text-blue-600 border-blue-100",
        iconBg: "bg-blue-50",
        icon: <CheckIcon />
    },
    PENGINGAT: {
        border: "border-l-indigo-500",
        badge: "bg-indigo-50 text-indigo-600 border-indigo-100",
        iconBg: "bg-indigo-50",
        icon: <CalendarIcon />
    },
    INFORMASI: {
        border: "border-l-gray-400",
        badge: "bg-gray-100 text-gray-600 border-gray-200",
        iconBg: "bg-gray-100",
        icon: <InfoIcon />
    }
    };

const formatRelativeTime = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 1) return "Baru saja";
    if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Kemarin";
    return `${diffDays} hari lalu`;
    };

    export default function NotificationPage({ onBack, onNavigateToDetail }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
        setError("Anda belum login. Silakan masuk untuk melihat notifikasi.");
        setLoading(false);
        return;
        }

        setLoading(true);
        api.get(`/notifications/user/${userId}`)
        .then((res) => {
            setNotifications(res.data || []);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Gagal memuat notifikasi:", err);
            setError("Gagal memuat notifikasi. Silakan coba lagi nanti.");
            setLoading(false);
        });
    }, []);

    const renderActionButton = (notification) => {
        if (notification.type === "DARURAT") {
        return (
            <div className="flex flex-wrap items-center gap-2">
            <button
                onClick={() => onNavigateToDetail(notification.request_id)}
                className="bg-[#c80040] hover:bg-[#a80034] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
                Bantu Sekarang
            </button>
            <button
                onClick={() => alert("Menampilkan detail rumah sakit yang membutuhkan bantuan...")}
                className="bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2 rounded-lg border border-gray-200 transition-colors"
            >
                Lihat Lokasi
            </button>
            </div>
        );
        }

        if (notification.type === "SUKSES") {
        return (
            <button
            onClick={() => alert("Menampilkan ringkasan hasil notifikasi sukses...")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
            Lihat Detail
            </button>
        );
        }

        if (notification.type === "PENGINGAT") {
        return (
            <button
            onClick={() => alert("Mengarahkan ke pengingat donor berikutnya...")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
            >
            Atur Jadwal
            </button>
        );
        }

        if (notification.type === "INFORMASI") {
        return (
            <button
            onClick={() => alert("Membuka informasi terbaru untuk Anda...")}
            className="text-xs font-bold text-red-700 hover:underline bg-transparent border-none cursor-pointer p-0"
            >
            Baca Selengkapnya
            </button>
        );
        }

        return null;
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-10 font-sans min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4">
            <div>
            <button
                onClick={onBack}
                className="text-xs font-bold text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer mb-2 flex items-center gap-1"
            >
                ← Kembali ke Halaman Sebelumnya
            </button>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notifikasi</h1>
            <p className="text-sm text-gray-500 mt-1">Notifikasi ini merekam aktivitas Anda dengan gaya timeline ringkas, tanpa status baca.</p>
            </div>
        </div>

        {loading ? (
            <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-500">
            Memuat notifikasi terbaru...
            </div>
        ) : error ? (
            <div className="rounded-3xl bg-red-50 border border-red-100 shadow-sm p-8 text-center text-sm text-red-600">
            {error}
            </div>
        ) : notifications.length === 0 ? (
            <div className="rounded-3xl bg-white border border-dashed border-gray-200 p-10 text-center text-sm text-gray-500">
            Tidak ada notifikasi baru untuk saat ini. Kunjungi kembali nanti untuk kabar terbaru dari sistem.
            </div>
        ) : (
            <>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                <p className="text-sm text-gray-500">Notifikasi ini merekam aktivitas penting Anda secara ringkas, mirip riwayat, tetapi dengan tanda khusus untuk setiap aksi.</p>
                </div>
                <button
                onClick={async () => {
                    const userId = localStorage.getItem("user_id");
                    if (!userId) {
                    setError("Silakan login ulang untuk menggunakan fitur ini.");
                    return;
                    }
                    setLoading(true);
                    setError(null);
                    try {
                    await api.post("/notifications/mark-all-read", null, { params: { user_id: userId } });
                    const res = await api.get(`/notifications/user/${userId}`);
                    setNotifications(res.data || []);
                    } catch (err) {
                    console.error("Gagal menandai semua notifikasi dibaca:", err);
                    setError("Gagal menandai semua notifikasi dibaca. Silakan coba lagi.");
                    } finally {
                    setLoading(false);
                    }
                }}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                Tandai semua dibaca
                </button>
            </div>
            <div className="space-y-4">
                {notifications.map((n) => {
                const styles = typeStyles[n.type] || typeStyles.INFORMASI;
                return (
                    <div
                    key={n.id}
                    className={`rounded-2xl border ${styles.border} p-5 shadow-sm transition-shadow bg-white hover:shadow-md`}
                    >
                    <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-start">
                        <div className={`flex items-center justify-center w-11 h-11 rounded-full ${styles.iconBg}`}>
                        {styles.icon}
                        </div>
                        <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded-md border ${styles.badge}`}>
                            {n.type}
                            </span>
                            <h3 className="text-sm font-bold text-gray-900">{n.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500 leading-6">{n.description}</p>
                        </div>
                        <div className="text-right">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                            {formatRelativeTime(n.created_at)}
                        </span>
                        {renderActionButton(n)}
                        </div>
                    </div>
                    </div>
                );
                })}
            </div>
            </>
        )}
        </div>
    );
    }

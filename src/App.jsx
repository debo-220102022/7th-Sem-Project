import React, { useEffect, useMemo, useState } from "react";
import Auth from "./components/Auth";
import ProfilePanel from "./components/ProfilePanel";
import WaterTracker from "./components/WaterTracker";
import CalendarView from "./components/CalendarView";
import DailyPlanComposer from "./components/DailyPlanComposer";
import HealthGraphs from "./components/HealthGraphs";

import {
  loadActiveUser,
  loadUserData,
  saveUserData,
  createEmptyUser
} from "./utils/storage";

import { calcCalories } from "./utils/calculations";
import { todayISO } from "./utils/helpers";

export default function App() {
  /* ================= STATE ================= */
  const [authUser, setAuthUser] = useState(() => loadActiveUser());
  const [userdata, setUserdata] = useState(() =>
    authUser
      ? loadUserData(authUser.username) ||
        createEmptyUser(authUser.username, authUser.displayName)
      : null
  );
  const [now, setNow] = useState(new Date());

  /* ================= EFFECTS ================= */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (authUser) {
      const d =
        loadUserData(authUser.username) ||
        createEmptyUser(authUser.username, authUser.displayName);
      setUserdata(d);
    } else {
      setUserdata(null);
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser && userdata) {
      saveUserData(authUser.username, userdata);
    }
  }, [authUser, userdata]);

  /* ================= HELPERS ================= */
  function handleLogout() {
    localStorage.removeItem("dp_active_user");
    setAuthUser(null);
  }

  function ensureUser() {
    if (!authUser) {
      alert("Please login.");
      return false;
    }
    return true;
  }

  /* ================= WATER ================= */
  function addWaterIntake(ml) {
    if (!ensureUser()) return;
    const date = todayISO();
    const w = userdata.water || { goalMl: 2000, drankMlByDate: {} };
    const drank = w.drankMlByDate[date] || 0;
    w.drankMlByDate = { ...w.drankMlByDate, [date]: drank + ml };
    setUserdata(u => ({ ...u, water: w }));
  }

  function setWaterGoal(ml) {
    if (!ensureUser()) return;
    setUserdata(u => ({
      ...u,
      water: { ...(u.water || {}), goalMl: ml }
    }));
  }

  /* ================= BIOMETRICS ================= */
  function updateBiometrics(newProfile) {
    if (!ensureUser()) return;
    const snap = { date: new Date().toISOString(), profile: newProfile };
    setUserdata(prev => ({
      ...prev,
      profile: newProfile,
      lastBiometricsAt: todayISO(),
      history: [snap, ...(prev.history || [])]
    }));
  }

  /* ================= MEALS ================= */
  function addMealToDate(dateISO, mealName, option) {
    if (!ensureUser()) return;
    const cal = { ...(userdata.calendar || {}) };
    cal[dateISO] = [
      ...(cal[dateISO] || []),
      {
        id: Math.random().toString(36).slice(2, 9),
        mealName,
        option,
        eaten: false,
        time: new Date().toISOString()
      }
    ];
    setUserdata(u => ({ ...u, calendar: cal }));
  }

  function addPlanToDate(date, plan) {
    if (!ensureUser()) return;
    const cal = { ...(userdata.calendar || {}) };
    cal[date] = [
      ...(cal[date] || []),
      ...plan.meals.map(m => ({
        id: Math.random().toString(36).slice(2, 9),
        mealName: m.name,
        option: m.option,
        eaten: false,
        time: new Date().toISOString()
      }))
    ];
    setUserdata(u => ({ ...u, calendar: cal }));
  }

  /* ================= CALENDAR ================= */
  const calendarDates = useMemo(() => {
    const arr = [];
    const d0 = new Date();
    d0.setDate(1);
    const startDay = d0.getDay();
    const month = d0.getMonth();
    const year = d0.getFullYear();
    const last = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < startDay; i++) arr.push(null);
    for (let d = 1; d <= last; d++)
      arr.push(new Date(year, month, d).toISOString().slice(0, 10));
    return arr;
  }, [now]);

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {!authUser ? (
        <Auth onLogin={setAuthUser} />
      ) : (
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">
                Diet Planner — {authUser.displayName}
              </h1>
              <div className="text-sm text-gray-600">
                {now.toLocaleString()}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 border rounded"
            >
              Logout
            </button>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <section>
              <ProfilePanel
                userdata={userdata}
                onUpdateBiometrics={updateBiometrics}
              />
              <div className="mt-3">
                <WaterTracker
                  userdata={userdata}
                  onAdd={addWaterIntake}
                  onSetGoal={setWaterGoal}
                />
              </div>
            </section>

            <section className="lg:col-span-2">
              <div className="bg-white p-3 rounded">
                <h3 className="font-semibold">Calendar</h3>
                <CalendarView
                  userdata={userdata}
                  calendarDates={calendarDates}
                  onQuickAdd={dt => {
                    const cal = calcCalories(userdata.profile);
                    addMealToDate(dt, "Lunch", {
                      kcal: Math.round(cal * 0.33)
                    });
                  }}
                />

                <div className="mt-3">
                  <h4 className="font-semibold">Compose Daily Plan</h4>
                  <DailyPlanComposer
                    userdata={userdata}
                    onCreate={addPlanToDate}
                  />
                </div>
              </div>

              {/* ✅ HEALTH GRAPHS */}
              <HealthGraphs userdata={userdata} />
            </section>
          </main>
        </div>
      )}
    </div>
  );
}

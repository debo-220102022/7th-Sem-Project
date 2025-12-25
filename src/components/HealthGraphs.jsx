import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function HealthGraphs({ userdata }) {
  if (!userdata) return null;

  /* --------- FORCE SAMPLE DATA IF EMPTY --------- */

  const history =
    userdata.history && userdata.history.length > 0
      ? userdata.history
      : [
          { profile: { weight: 70, height: 170 } },
          { profile: { weight: 68, height: 170 } },
          { profile: { weight: 66, height: 170 } }
        ];

  const waterEntries =
    userdata.water?.drankMlByDate &&
    Object.keys(userdata.water.drankMlByDate).length > 0
      ? userdata.water.drankMlByDate
      : {
          "2025-01-01": 1200,
          "2025-01-02": 1800,
          "2025-01-03": 2000
        };

  /* --------- Weight Data --------- */
  const weightData = history.map((entry, index) => ({
    name: `Check ${index + 1}`,
    weight: entry.profile.weight
  }));

  /* --------- BMI Data --------- */
  const bmiData = history.map((entry, index) => {
    const h = entry.profile.height / 100;
    return {
      name: `Check ${index + 1}`,
      bmi: +(entry.profile.weight / (h * h)).toFixed(1)
    };
  });

  /* --------- Water Data --------- */
  const waterData = Object.entries(waterEntries).map(
    ([date, intake]) => ({
      date,
      intake,
      goal: userdata.water?.goalMl || 2000
    })
  );

  return (
    <div className="bg-white p-4 rounded mt-4">
      <h2 className="text-xl font-bold mb-4">Health Analytics</h2>

      {/* ===== WEIGHT GRAPH ===== */}
      <h3 className="font-semibold mb-2">Weight Progress</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={weightData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="weight" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== BMI GRAPH ===== */}
      <h3 className="font-semibold mt-6 mb-2">BMI Trend</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={bmiData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="bmi" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== WATER GRAPH ===== */}
      <h3 className="font-semibold mt-6 mb-2">
        Water Intake vs Goal
      </h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={waterData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="intake" fill="#3b82f6" />
            <Bar dataKey="goal" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

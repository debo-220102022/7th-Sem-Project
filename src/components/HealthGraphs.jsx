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
  ResponsiveContainer,
  ReferenceArea
} from "recharts";

export default function HealthGraphs({ userdata }) {
  if (!userdata) return null;

  /* ================= BMI DEMO DATA (NO SPIKES) ================= */
  const bmiData = [
    { name: "Overweight", bmi: 28.4 },
    { name: "Normal", bmi: 22.5 },
    { name: "Underweight", bmi: 17.3 }
  ];

  /* ================= WEIGHT DEMO DATA ================= */
  const weightData = [
    { name: "Check 1", weight: 82 },
    { name: "Check 2", weight: 65 },
    { name: "Check 3", weight: 50 }
  ];

  /* ================= WATER DEMO DATA ================= */
  const waterData = [
    { date: "2025-01-01", intake: 1200, goal: 2000 },
    { date: "2025-01-02", intake: 1800, goal: 2000 },
    { date: "2025-01-03", intake: 2000, goal: 2000 }
  ];

  return (
    <div className="bg-white p-4 rounded mt-4">
      <h2 className="text-xl font-bold mb-4">Health Analytics</h2>

      {/* ================= WEIGHT GRAPH ================= */}
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

      {/* ================= BMI GRAPH ================= */}
      <h3 className="font-semibold mt-6 mb-2">BMI Trend</h3>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={bmiData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[10, 35]} />
            <Tooltip />
            <Legend />

            {/* BMI CATEGORY ZONES */}
            <ReferenceArea y1={0} y2={18.5} fill="#60a5fa" fillOpacity={0.25} />
            <ReferenceArea y1={18.5} y2={24.9} fill="#4ade80" fillOpacity={0.25} />
            <ReferenceArea y1={25} y2={29.9} fill="#facc15" fillOpacity={0.25} />
            <ReferenceArea y1={30} y2={40} fill="#f87171" fillOpacity={0.25} />

            <Line dataKey="bmi" stroke="#ef4444" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= WATER GRAPH ================= */}
      <h3 className="font-semibold mt-6 mb-2">Water Intake vs Goal</h3>
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

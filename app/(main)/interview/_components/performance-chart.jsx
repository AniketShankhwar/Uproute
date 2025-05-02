"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Cards from "@/components/ui/cards";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function PerformanceChart({ assessments }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (assessments) {
      const formattedData = assessments.map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.quizScore,
      }));
      setChartData(formattedData);
    }
  }, [assessments]);

  return (
    <Cards>
      <div>
        <div className="gradient-title text-3xl md:text-4xl">
          Performance Trend
        </div>
        <div className="text-base text-muted-foreground">
          Your quiz scores over time
        </div>
      </div>
      <div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 15,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid horizontal="true" vertical="" stroke="#243240" />
              <XAxis dataKey="date" tick={{ fill: "#1e9e76" }} />
              <YAxis domain={[0, 100]} tick={{ fill: "#1e9e76" }} />
              <Tooltip
                cursor={false}
                content={({ active, payload, label }) =>
                  active && payload?.length ? (
                    <div className="bg-neutral-800 border border-gray-700 rounded-lg p-2 shadow-lg text-white">
                      <p className="font-medium mb-1">{label}</p>
                      {payload.map((item) => (
                        <p
                          key={item.name}
                          className="text-sm flex items-center"
                        >
                          <span
                            className="inline-block w-2 h-2 rounded-full mr-1"
                            style={{
                              backgroundColor: item.color || item.stroke,
                            }}
                          />
                          {item.name}: {item.value}%
                        </p>
                      ))}
                    </div>
                  ) : null
                }
              />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#18cb96"
                strokeWidth={5}
                dot={{
                  fill: "#18cb96",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                  r: 5,
                }}
                activeDot={{
                  fill: "#18cb96",
                  stroke: "#ffffff",
                  strokeWidth: 3,
                  r: 10,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Cards>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import Cards from "@/components/ui/cards";
import { Progress } from "@/components/ui/progress";
import { format, formatDistanceToNow } from "date-fns";
import {
  Brain,
  BriefcaseIcon,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Legend,
} from "recharts";
import React from "react";

const DashboardView = ({ insights }) => {
  const salaryData = insights.salaryRanges.map((range) => ({
    name: range.role,
    min: range.min / 1000,
    max: range.max / 1000,
    median: range.median / 1000,
  }));

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  const lastUpdatedDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
  const nextUpdateDistance = formatDistanceToNow(
    new Date(insights.lastUpdated),
    { addSuffix: true }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="brand" className="font-semibold">
          Last Updated: {lastUpdatedDate}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Cards>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-lg font-semibold">Market Outlook</div>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </div>
          <div>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <p className="text-sm text-muted-foreground">
              Next update: {nextUpdateDistance}
            </p>
          </div>
        </Cards>

        <Cards>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-lg font-semibold">Industry Growth</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2" />
          </div>
        </Cards>

        <Cards>
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-lg font-semibold">Demand Level</div>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </div>
        </Cards>

        <Cards className="w-full">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-lg font-semibold">Top Skills</div>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </Cards>
      </div>

      <Cards className="col-span-full w-full">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold">Salary Ranges by Role</h3>
          <p className="text-sm text-gray-500">
            Displaying min, median & max (in thousands)
          </p>
        </div>

        {/* CHART */}
        <div className="w-full h-[400px] px-6 py-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salaryData} barGap={8}>
              <CartesianGrid stroke="#2c2c2c" vertical={false} />

              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#aaa" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#aaa" }}
              />

              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingTop: 16 }}
              />

              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
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
                            style={{ backgroundColor: item.fill }}
                          />
                          {item.name}: ${item.value}K
                        </p>
                      ))}
                    </div>
                  ) : null
                }
              />

              <Bar
                dataKey="min"
                name="Min"
                fill="#4DE2B3"
                radius={[8, 8, 0, 0]}
                barSize={60}
              />
              <Bar
                dataKey="median"
                name="Median"
                fill="#18CB96"
                radius={[8, 8, 0, 0]}
                barSize={60}
              />
              <Bar
                dataKey="max"
                name="Max"
                fill="#0FA67A"
                radius={[8, 8, 0, 0]}
                barSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Cards>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Cards>
          <div>
            <div className="text-lg font-semibold">Key Industry Trends</div>
            <div className="text-sm text-muted-foreground mb-2">
              Current trends shaping the industry
            </div>
          </div>
          <div>
            <ul className="space-y-2">
              {insights.keyTrends.map((trend, index)=>(
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary"/>
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </div>
        </Cards>

        <Cards>
          <div>
            <div className="text-lg font-semibold">Recommended Skills</div>
            <div className="text-sm text-muted-foreground mb-2">
              Skills to concider 
            </div>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill)=>(
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </Cards>
      </div>
    </div>
  );
};

export default DashboardView;

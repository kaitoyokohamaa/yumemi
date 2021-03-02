import React from "react";

import HighchartsReact from "highcharts-react-official";
import { UseGraphData } from "../hooks/useGraphData/useGraphData";

export default function index() {
  const { handleChange, prefectures, graphData } = UseGraphData();
  const options = {
    chart: {
      type: "spline",
    },
    title: {
      text: "人口グラフ",
    },
    xAxis: {
      categories: [
        "1960",
        "1965",
        "1970",
        "1975",
        "1980",
        "1985",
        "1990",
        "1995",
        "2000",
        "2005",
        "2010",
        "2015",
        "2020",
        "2025",
        "2030",
        "2035",
        "2040",
        "2045",
      ],
    },
    series: graphData,
  };

  return (
    <div className="mt-10">
      <h1 className="w-9/12 m-auto ">
        <span className="border-2 border-black">都道府県</span>
      </h1>
      <div className="flex  flex-wrap w-9/12 m-auto">
        {prefectures?.map((item) => {
          return (
            <label key={item.prefCode} className="flex mr-14 mt-4">
              <input
                type="checkbox"
                value={item.prefCode}
                onChange={(e) => handleChange(e, item.prefCode)}
              />
              <div>{item.prefName}</div>
            </label>
          );
        })}
      </div>
      <div className="md:w-9/12 m-auto mt-28 sm:w-full">
        <HighchartsReact constructorType={"chart"} options={options} />
      </div>
    </div>
  );
}

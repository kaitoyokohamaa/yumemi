import React, { useEffect, useState } from "react";
import { getPrefectureData } from "./api/prefecture";
import { getPopulationData } from "./api/population";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface PrefectureInfo {
  prefCode: number;
  prefName: string;
}
type PopulationInfo = {
  year: number;
  value: number;
};

interface graphTypes {
  year: number;
  population: number;
}

export default function index() {
  const [prefectures, setPrefectures] = useState<PrefectureInfo[]>([]);
  const [populations, setPopulations] = useState<PopulationInfo[]>([]);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [checkedName, setCheckedName] = useState<string>();

  const [graphData, setGraphData] = useState<any[]>([]);

  // 都道府県一覧の取得
  useEffect(() => {
    const fetchPrefecture = async () => {
      const res = getPrefectureData.FetchPrefecture();
      await res.then((data) => setPrefectures(data));
    };
    fetchPrefecture();
  }, []);

  // チエックリストでチェックした人口を取得
  useEffect(() => {
    const fetchPopulation = async () => {
      const res = checkedIds?.map(
        async (id: number) => await getPopulationData.FetchPopulation(id)
      );

      res?.map(async (item) => {
        await item.then((response) => {
          setPopulations(response[0].data);
        });
      });
    };

    fetchPopulation();
  }, [checkedIds]);

  useEffect(() => {
    const data = populations?.map((item) => {
      if (checkedName) {
        return {
          year: item.year,
          population: item.value,
          name: checkedName,
        };
      }
    });
    data && setGraphData(data);
  }, [checkedIds, populations]);
  console.log(graphData);
  const handleChange = (
    e: React.FormEvent<HTMLInputElement>,
    prefectureName: string
  ) => {
    if ((e.target as HTMLInputElement).checked === true) {
      const deleteDuplicateId = new Set([...checkedIds]);
      setCheckedIds([...deleteDuplicateId, Number(e.currentTarget.value)]);
      // checkした県名の取得
      setCheckedName(prefectureName);
    } else if ((e.target as HTMLInputElement).checked === false) {
      const removedId = Number(e.currentTarget.value);
      const newIds = checkedIds.filter((value) => {
        return value !== removedId;
      });
      setCheckedIds(newIds);
      // checkした県名を外す
      setCheckedName("");
    }
  };

  return (
    <div className="mt-10">
      <h1 className="w-9/12 m-auto">
        <span className="border-2 border-black">都道府県</span>
      </h1>
      <div className="flex  flex-wrap w-9/12 m-auto">
        {prefectures?.map((item) => {
          return (
            <label key={item.prefCode} className="flex mr-14 mt-4">
              <input
                type="checkbox"
                value={item.prefCode}
                onChange={(e) => handleChange(e, item.prefName)}
              />
              <div>{item.prefName}</div>
            </label>
          );
        })}
      </div>
      <div className="w-9/12 m-auto mt-28">
        <LineChart
          width={1000}
          height={300}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            data={graphData}
            type="monotone"
            name={graphData[0]?.name}
            dataKey="population"
            stroke="#8884d8"
            layout="vertical"
            activeDot={{ r: 8 }}
          />
          {/* <Line type="monotone" dataKey="population" stroke="#82ca9d" /> */}
        </LineChart>
      </div>
    </div>
  );
}

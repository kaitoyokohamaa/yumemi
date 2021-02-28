import React, { useEffect, useState, Fragment } from "react";
import { getPrefectureData } from "./api/prefecture";
import { getPopulationData } from "./api/population";
import HighchartsReact from "highcharts-react-official";

interface PrefectureInfo {
  prefCode: number;
  prefName: string;
}
type PopulationInfo = {
  year: number;
  value: number;
};

export default function index() {
  const [prefectures, setPrefectures] = useState<PrefectureInfo[]>([]);
  const [populations, setPopulations] = useState<PopulationInfo[]>([]);
  // const [selectedPopulations, setSelectedPopulations] = useState<number[]>([]);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);
  const [checkedId, setCheckedId] = useState<number>();
  const [checkedNames, setCheckedNames] = useState<string[]>([]);
  const [checkedName, setCheckedName] = useState<string>();
  const [graphData, setGraphData] = useState<
    { data: number[]; name: string | undefined }[]
  >([]);

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
    series: graphData && graphData.slice(1, 42),
  };

  useEffect(() => {
    const fetchPrefecture = async () => {
      const res = getPrefectureData.FetchPrefecture();

      await res.then((data) => {
        setPrefectures(data);
      });
    };
    fetchPrefecture();
  }, []);

  useEffect(() => {
    const fetchPopulation = async () => {
      if (checkedId) {
        const res = await getPopulationData.FetchPopulation(checkedId);

        setPopulations(res[0].data);
      }
    };
    fetchPopulation();
  }, [checkedIds]);

  useEffect(() => {
    const data = populations?.map((item) => {
      return item.value;
    });
    setGraphData([...new Set(graphData), { data, name: checkedName }]);
  }, [populations]);

  const handleChange = (
    e: React.FormEvent<HTMLInputElement>,
    prefectureName: string
  ) => {
    if ((e.target as HTMLInputElement).checked === true) {
      const deleteDuplicateId = new Set([...checkedIds]);
      setCheckedIds([...deleteDuplicateId, Number(e.currentTarget.value)]);
      // checkした県名の取得
      setCheckedName(prefectureName);
      setCheckedId(Number(e.currentTarget.value));
      const deleteDuplicateName = new Set([...checkedNames]);
      setCheckedNames([...deleteDuplicateName, prefectureName]);
    } else if ((e.target as HTMLInputElement).checked === false) {
      const removedId = Number(e.currentTarget.value);
      const newIds = checkedIds.filter((value) => {
        return value !== removedId;
      });

      setCheckedIds(newIds);

      // checkした県名を外す TODO:filterで自分がチェックを外した県名を外す
      setCheckedName("");
      const newNames = checkedNames.filter((value) => {
        return value !== prefectureName;
      });
      setCheckedNames(newNames);
      setCheckedId(0);
    }
  };
  // console.log(graphData);

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
        <HighchartsReact constructorType={"chart"} options={options} />
      </div>
    </div>
  );
}

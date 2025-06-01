import React, { useState, useEffect } from "react";
import {
  VisDonut,
  VisSingleContainer,
  VisBulletLegend,
  VisTooltip,
} from "@unovis/react";
import { CategoryStatistics } from "../../api/listings";
import { Donut } from "@unovis/ts";
const value = (d) => d;

let curComponent;
function CategoryDonut({ setCategory }) {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const triggers = {
    [Donut.selectors.segment]: (d) => {
      curComponent = d.index;
      return `${d.data} ${d.data === 1 ? "listing" : "listings"}`;
    },
  };
  useEffect(() => {
    const fetchData = async () => {
      const stats = (await CategoryStatistics()).Listings;
      const statsData = stats.filter((stat) => stat.count !== 0);
      const statsLabels = statsData.map((stat) => stat.name);
      const statsCount = statsData.map((stat) => stat.count);
      setLabels(statsLabels);
      setData(statsCount);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      onClick={(e) => {
        setCategory(labels[curComponent]);
      }}
      style={{
        padding: "2em",
        width: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <VisSingleContainer data={data}>
        <VisDonut
          value={value}
          centralLabel="Top Categories"
          centralSubLabel="Click category to view listings"
          arcWidth={80}
          cornerRadius={2}
        />
        <VisTooltip triggers={triggers} />
      </VisSingleContainer>
      <VisBulletLegend items={labels.map((label) => ({ name: label }))} />
    </div>
  );
}

export default CategoryDonut;

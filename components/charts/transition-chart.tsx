import React, { FC } from "react"
import { ApexOptions } from "apexcharts"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })
import { DataList } from "@types"

const TransitionChart: FC<{
  dataList: DataList[]
}> = ({ dataList }) => {
  const options: ApexOptions = {
    chart: {
      zoom: {
        enabled: false,
      },
      animations: {
        easing: "linear",
        dynamicAnimation: {
          speed: 100,
        },
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      title: { text: "人数" },
    },
    theme: {
      palette: "palette1",
    },
    stroke: {
      curve: "smooth",
      width: 5,
    },
  }

  return (
    <>
      <Chart
        type="line"
        options={options}
        series={dataList}
        width={800}
        height={400}
      />
    </>
  )
}

export default TransitionChart

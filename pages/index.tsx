import React, { ReactElement, useState, useEffect } from "react"
import { Container, Section, Title } from "components/elements"
import TransitionChart from "components/charts/transition-chart"
import { DataList } from "@types"
import { initialData } from "../constants"

const IndexPage = (): ReactElement => {
  const [dataList, setDataList] = useState<DataList[]>([])
  const [textData, setTextData] = useState<string>(initialData)
  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const htmlItem = [...event.clipboardData.items].find(
      (item) => item.type == "text/html"
    )
    if (htmlItem) {
      htmlItem.getAsString((data) => {
        const dom = new DOMParser().parseFromString(data, "text/html")
        const table = dom.getElementsByTagName("table")[0]
        if (!table) return
        const rawData = [...table.rows].map((row) =>
          [...row.cells].map((cell) => cell.textContent ?? "")
        )
        setTextData(
          rawData
            .map((row) =>
              row.map((col) => col.replace(/\r?\n/g, "")).join("\t")
            )
            .join("\n")
        )
      })
    }
  }
  useEffect(() => {
    const [header, ...content] = textData
      .split("\n")
      .map((row) => row.split("\t"))
    if (header.length < 2) return
    const dataList = header.slice(1).map((name, i) => {
      return {
        name: name,
        data: content.map((row) => {
          return {
            x: row[0],
            y: Number(row[i + 1]),
          }
        }),
      }
    })
    setDataList(dataList)
  }, [textData])
  return (
    <>
      <main>
        <Container>
          <Section>
            <Title>国会議員会派別議員数の推移</Title>
            <TransitionChart dataList={dataList} />
          </Section>

          <Section>
            <table>
              {dataList.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  {row.data.map((col, i) => (
                    <td key={i}>{col.y}</td>
                  ))}
                </tr>
              ))}
            </table>
          </Section>

          <Section>
            <textarea onPaste={handlePaste} value={textData}></textarea>
          </Section>
        </Container>
      </main>
      <footer>
        <Container>
          <Section>
            <div style={{ margin: "1rem 0", textAlign: "right" }}>
              Ref.
              <a
                href="https://www.shugiin.go.jp/internet/itdb_annai.nsf/html/statics/ugoki/h12ugoki/h12tokei/h12to02a.htm"
                target="_blank"
                rel="noreferrer"
              >
                国会議員会派別議員数の推移
              </a>
            </div>
            <div style={{ textAlign: "center" }}>&copy;&nbsp;kixixixixi</div>
          </Section>
        </Container>
      </footer>
    </>
  )
}

export default IndexPage

import { SFC } from "react"

interface GaugeProps {
  color: string
  n: number
}
const Gauge: SFC<GaugeProps> = ({ color, n }) => (
  <div className="gauge">
    <div className="bg">
      <div
        className="fg"
        style={{ width: `${Math.min((100 * n) / 6, 6) | 0}px` }}
      />
    </div>
    {n}
    <style jsx>{`
      .fg {
        background-color: ${color};
      }
    `}</style>
    <style jsx>{`
      .gauge {
        display: flex;
        flex-flow: row nowrap;
      }
      .bg {
        width: 100px;
        height: 10px;
        background: #eeeeee;
        position: relative;
        margin-bottom: 10px;
        border: 1px solid black;
      }
      .fg {
        top: 0;
        left: 0;
        height: 10px;
        position: absolute;
      }
    `}</style>
  </div>
)

declare namespace QuantityDisplay {
  interface Props {
    n: [number, number, number, number]
  }
}
const QuantityDisplay: SFC<QuantityDisplay.Props> = ({ n }) => (
  <div>
    <Gauge n={n[0]} color="red" />
    <Gauge n={n[1]} color="white" />
    <Gauge n={n[2]} color="green" />
    <Gauge n={n[3]} color="blue" />
  </div>
)

export default QuantityDisplay

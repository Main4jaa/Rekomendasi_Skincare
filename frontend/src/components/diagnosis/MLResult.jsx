import ConfidenceGauge from '../visualization/ConfidenceGauge';
import ProbabilityChart from '../visualization/ProbabilityChart';
export default function MLResult({ data }){ if(!data) return null; return <section className="card space-y-3"><h3 className="text-lg font-bold">ML Prediction</h3><div><span className="badge">{data.class_name}</span><span className="badge ml-2">Class {data.class_id}</span></div><ConfidenceGauge value={data.confidence || 0} label="ML Confidence"/><ProbabilityChart probabilities={data.probabilities}/></section>; }

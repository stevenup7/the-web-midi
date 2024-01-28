import "./BPMDisplay.css";

function BPMDisplay() {
  return (
    <div className="BPM-display">
      {[...Array(16)].map((_, index) => {
        let cls = "BPM-display-beat";
        if (index % 4 == 0) {
          cls += " BPM-quarter";
        }
        return (
          <div key={index} className={cls}>
            {index}
          </div>
        );
      })}
    </div>
  );
}
export default BPMDisplay;

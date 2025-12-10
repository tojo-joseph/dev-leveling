import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

interface CommitData {
  date: string | Date;
  count: number;
  [key: string]: any; // Allow for additional properties
}

interface CommitActivityProps {
  commitData: CommitData[];
}

const colorMap = {
  0: "#ebedf0", // Lightest green
  1: "#9be9a8", // Light green
  2: "#40c463", // Medium green
  3: "#30a14e", // Dark green
  4: "#216e39", // Darkest green
};

export function CommitActivity({ commitData }: CommitActivityProps) {
  console.log("CommitActivity received data:", commitData);
  return (
    <div>
      <style jsx global>{`
        .react-calendar-heatmap rect {
          rx: 2;
          ry: 2;
        }
        .react-calendar-heatmap .color-empty {
          fill: #ebedf0;
        }
        .react-calendar-heatmap .color-scale-1 {
          fill: ${colorMap[1]};
        }
        .react-calendar-heatmap .color-scale-2 {
          fill: ${colorMap[2]};
        }
        .react-calendar-heatmap .color-scale-3 {
          fill: ${colorMap[3]};
        }
        .react-calendar-heatmap .color-scale-4 {
          fill: ${colorMap[4]};
        }
      `}</style>

      <CalendarHeatmap
        startDate={
          new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        }
        endDate={new Date()}
        values={commitData}
        classForValue={(value) => {
          if (!value) {
            return "color-empty";
          }
          const level = Math.min(4, Math.max(1, value.count)); // Ensure at least 1
          return `color-scale-${level}`;
        }}
        showWeekdayLabels={true}
      />
    </div>
  );
}

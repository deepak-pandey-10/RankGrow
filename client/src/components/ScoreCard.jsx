import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function getScoreColor(score) {
  if (score >= 80) return { path: "#10b981", text: "#ffffff", trail: "#27272a" }; // Emerald vs White text / Dark trail
  if (score >= 60) return { path: "#f59e0b", text: "#ffffff", trail: "#27272a" }; // Amber
  return { path: "#ef4444", text: "#ffffff", trail: "#27272a" }; // Red
}

export default function ScoreCard({ title, score, icon: Icon, description }) {
  const colors = getScoreColor(score);

  return (
    <div className="saas-card saas-card-interactive p-6 flex items-center justify-between">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center gap-2 text-surface-500 mb-6">
          {Icon && <Icon className="w-5 h-5 text-primary-500" />}
          <h3 className="text-[13px] font-semibold tracking-wide uppercase text-surface-600">{title}</h3>
        </div>
        <div>
           {description && (
            <p className="text-[15px] font-medium text-surface-900">
              {description}
            </p>
           )}
           <p className="text-[12px] font-medium text-surface-500 mt-1">
             Dynamic rating scale
           </p>
        </div>
      </div>
      
      <div className="w-20 h-20 shrink-0 relative">
        <CircularProgressbar
          value={score}
          text={`${score}`}
          styles={buildStyles({
            pathColor: colors.path,
            textColor: colors.text, 
            trailColor: colors.trail,
            textSize: "28px",
            pathTransitionDuration: 1.2,
          })}
        />
      </div>
    </div>
  );
}

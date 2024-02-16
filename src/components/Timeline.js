import { Gantt } from "gantt-task-react";

import { useModelStore } from "../components/store/ModelStore";
import { useScheduleStore } from "../components/store/ScheduleStore";
import { modelTypeMap } from "../components/PipelineUtils";
import { nodeColors } from "../components/GraphProps";
import { useProjectStore } from "../components/store/ProjectStore";
import { useProjectRunStore } from "./store/ProjectRunStore";

// const modelTypeMap = {
//   rpm: "Capacity Expansion",
//   dsgrid: "dsgrid",
//   dgen: "Distributed Generation",
// };

export default function PipelineTimeline({ viewMode, showSidebar, divId }) {
  const currentProjectRunName = useProjectRunStore(
    (state) => state.currentProjectRun
  );
  const milestones = useProjectStore((state) => state.project.milestones);
  const projectName = useProjectStore((state) => state.project.full_name);
  const projectSchedule = useScheduleStore((state) => state.project);
  const models = useModelStore((state) => state.models);

  const projectRun = useProjectRunStore((state) =>
    state.runs.find((run) => run.name === currentProjectRunName)
  );

  const projectRunSchedule = useScheduleStore((state) => state.project_runs);

  const currentProjectRunSchedule =
    projectRunSchedule[0].name === ""
      ? projectRunSchedule[0]
      : projectRunSchedule.find((pr) => pr.name === currentProjectRunName);

  let ganttTasks = [];

  if (!isNaN(new Date(projectSchedule.start))) {
    const prstartDate = new Date(projectSchedule.start);
    const prendDate = new Date(projectSchedule.end);

    ganttTasks.push({
      start: prstartDate,
      end: prendDate,
      name: projectName,
      id: "project",
      progress: getProgress(prstartDate, prendDate),
      isDisabled: true,
    });

    milestones.forEach((milestone) => {
      const startDate = new Date(milestone.milestone_date);
      const endDate = new Date(milestone.milestone_date);

      ganttTasks.push({
        start: startDate,
        end: endDate,
        name: milestone.name,
        type: "milestone",
        progress: getProgress(startDate, endDate),
        id: milestone.name,
        isDisabled: true,
      });
    });

    if (models.length > 0) {
      currentProjectRunSchedule.models.forEach((modelSched, index) => {
        const model = models.find((model) => model.name === modelSched.id);

        let modelDependencies = [];
        let inEdges =
          projectRun && model
            ? projectRun.edges.filter((edge) => edge.to_model === model.name)
            : [];
        if (inEdges.length > 0) {
          modelDependencies = inEdges.map((edge) => edge.from_model);
        }

        if (model) {
          const startDate = new Date(modelSched.start);
          const endDate = new Date(modelSched.end);
          ganttTasks.push({
            start: startDate,
            end: endDate,
            name: model.display_name,
            id: model.name,
            type: "task",
            isDisabled: true,
            dependencies: modelDependencies,
            progress: getProgress(startDate, endDate),
            styles: {
              progressColor: nodeColors(modelTypeMap(model.name)),
              progressSelectedColor: "lightgrey",
            },
          });
        }
      });
    }
  }
  //   function setSelected(selected, isSelected) {
  //     if (
  //       isSelected &&
  //       selected.id !== "project" &&
  //       selected.type !== "milestone"
  //     ) {
  //       setSelectedModel({ id: selected.name });
  //     }
  //   }
  return (
    <div
      id={divId}
      style={{
        textAlign: "center",
        border: "solid",
        resize: "vertical",
        maxHeight: 500,
        overflow: "auto",
      }}
    >
      {ganttTasks.length > 0 ? (
        <Gantt
          tasks={ganttTasks}
          viewMode={viewMode}
          viewDate={new Date()}
          listCellWidth={showSidebar ? 200 : ""}
          rowHeight={70}
          arrowColor={"#93a2bf"}
          //   onSelect={setSelected}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

function getProgress(startDate, endDate) {
  const todaysDate = new Date();
  if (endDate < todaysDate) {
    return 100;
  } else {
    const t1 = startDate.getTime();
    const t2 = endDate.getTime();
    const tt = todaysDate.getTime();
    const progress = 100 * ((tt - t1) / (t2 - t1));
    return progress > 0 ? progress.toFixed(0) : 0;
  }
}

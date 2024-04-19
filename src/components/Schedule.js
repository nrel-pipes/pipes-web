import React from "react";
import {
  Gantt,
  Task,
  EventOption,
  StylingOption,
  ViewMode,
  DisplayOption,
} from "gantt-task-react";

import { useModelStoreV1 } from "../components/store/ModelStore";
import { useScheduleStoreV1 } from "../components/store/ScheduleStore";

import { nodeColors } from "../components/PipelineUtils";

export default function PipelineSchedule(props) {
  const models = useModelStoreV1((state) => state.models);
  const scheduleTasks = useScheduleStoreV1((state) => state.tasks);
  const scheduleProject = useScheduleStoreV1((state) => state.project);
  const scheduleMilestones = useScheduleStoreV1((state) => state.milestones);

  console.log("PipelineSchedule", props.period);

  let project = {
    start: scheduleProject.start,
    end: scheduleProject.end,
    progress: scheduleProject.progress,
    name: "project",
    id: 0,
    type: "project",
    isDisabled: true,
    styles: {
      progressColor: "#898989",
      progressSelectedColor: "#898989",
      backgroundColor: "#606060",
      backgroundSelectedColor: "#606060",
    },
  };

  let tasks = scheduleTasks.map((task, index) => {
    return {
      start: task.start,
      end: task.end,
      name: task.name,
      id: task.id,
      type: "task",
      progress: task.progress,
      dependencies: task.dependencies,
      isDisabled: true,
      styles: {
        progressColor: nodeColors(task.type),
        progressSelectedColor: "#ff9e0d",
      },
    };
  });

  tasks.unshift(project);

  let milestones = scheduleMilestones.map((milestone, index) => {
    return {
      start: milestone.end,
      end: milestone.end,
      name: milestone.name,
      id: milestone.name,
      type: "task",
      dependencies: milestone.dependencies,
      isDisabled: true,
      styles: {
        progressColor: "#ff9e0d",
        progressSelectedColor: "#ff9e0d",
      },
    };
  });

  tasks.push(...milestones);

  return (
    <div id="schedule" style={{ resize: "both" }}>
      <Gantt
        tasks={tasks}
        viewMode={props.period}
        listCellWidth={props.showSidebar ? 200 : ""}
        rowHeight={70}
        arrowColor={"black"}
      />
    </div>
  );
}

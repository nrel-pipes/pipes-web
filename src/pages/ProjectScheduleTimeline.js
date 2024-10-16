
import { Gantt } from "gantt-task-react";

import useDataStore from "./stores/DataStore";

import "./PageStyles.css"


const ProjectScheduleTimeline = ({ viewMode, showSidebar, divId }) => {
  const { currentProject, projectRuns, models } = useDataStore();

  let ganttTasks = [];

  // Project timeline
  const projectStartDate = new Date(currentProject.scheduled_start);
  const projectEndDate = new Date(currentProject.scheduled_end);
  ganttTasks.push(
    {
      start: projectStartDate,
      end: projectEndDate,
      name: "Project: " + currentProject.name,
      id: "project",
      styles: {progressColor: '#0079C2', progressSelectedColor: '#0B5E90'},
      progress: getGanttTaskProgress(projectStartDate, projectEndDate),
      hideChildren: false,
      type: "project"
    }
  )

  // Project milestone timeline
  currentProject.milestones.forEach((milestone) => {
    const milestoneStartDate = new Date(milestone.milestone_date);
    const milestoneEndDate = new Date(milestone.milestone_date);

    ganttTasks.push({
      start: milestoneStartDate,
      end: milestoneEndDate,
      name: "Milestone: " + milestone.name,
      id: milestone.name,
      type: "milestone",
      progress: getGanttTaskProgress(milestoneStartDate, milestoneEndDate),
      project: currentProject.name,
    });
  });

  projectRuns.forEach((projectRun) => {
    const projectRunStartDate = new Date(projectRun.scheduled_start);
    const projectRunEndDate = new Date(projectRun.scheduled_end);

    // Project runs timeline
    ganttTasks.push({
      start: projectRunStartDate,
      end: projectRunEndDate,
      name: "Project Run: " + projectRun.name,
      id: projectRun.name,
      type: "task",
      progress: getGanttTaskProgress(projectRunStartDate, projectRunEndDate),
      project: currentProject.name,
      styles: { progressColor: '#5DD2FF', progressSelectedColor: '#00A4E4' },
      hideChildren: false
    });

    // Project run models timeline
    models.forEach((model, index) => {
      const modelStartDate = new Date(model.scheduled_start);
      const modelEndDate = new Date(model.scheduled_end);

      if (model.context["projectrun"] === projectRun.name) {
        ganttTasks.push({
          start: modelStartDate,
          end: modelEndDate,
          name: "Model: " + model.name,
          id: model.name + index,
          type: "task",
          styles: {progressColor: '#5D9732', progressSelectedColor: '#3D6321' },
          progress: getGanttTaskProgress(modelStartDate, modelEndDate),
          project: projectRun.name,
        });
      }
    });
  });

  return (
    <div
      id={divId}
      style={{
        textAlign: "center",
        border: "2px solid",
        resize: "vertical",
        minHeight: 500,
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
          arrowColor={"#FFC423"}
          //   onSelect={setSelected}
        />
      ) : (
        <></>
      )}
    </div>
  );
}


function getGanttTaskProgress(startDate, endDate) {
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


export default ProjectScheduleTimeline;

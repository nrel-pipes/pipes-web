import { Gantt } from "gantt-task-react";
import "../../PageStyles.css";

// Import the necessary hooks
import { useGetModelsQuery } from "../../../hooks/useModelQuery";
import { useGetProjectQuery } from "../../../hooks/useProjectQuery";
import { useGetProjectRunsQuery } from "../../../hooks/useProjectRunQuery";
import useDataStore from "../../../stores/DataStore";

const TimelineComponent = ({ viewMode, showSidebar, divId }) => {
  const { effectivePname } = useDataStore();
  const { data: project } = useGetProjectQuery(effectivePname);
  const { data: projectRuns = [] } = useGetProjectRunsQuery(effectivePname);
  const { data: models = [] } = useGetModelsQuery(effectivePname, null);

  if (!project) {
    return <div>Loading project data...</div>;
  }

  let ganttTasks = [];

  // Project timeline
  const projectStartDate = new Date(project.scheduled_start);
  const projectEndDate = new Date(project.scheduled_end);
  ganttTasks.push(
    {
      start: projectStartDate,
      end: projectEndDate,
      name: "Project: " + project.name,
      id: "project",
      styles: {progressColor: '#0079C2', progressSelectedColor: '#0B5E90'},
      progress: getGanttTaskProgress(projectStartDate, projectEndDate),
      hideChildren: false,
      type: "project"
    }
  )

  // Project milestone timeline
  project.milestones.forEach((milestone) => {
    const milestoneStartDate = new Date(milestone.milestone_date);
    const milestoneEndDate = new Date(milestone.milestone_date);

    ganttTasks.push({
      start: milestoneStartDate,
      end: milestoneEndDate,
      name: "Milestone: " + milestone.name,
      id: milestone.name,
      type: "milestone",
      progress: getGanttTaskProgress(milestoneStartDate, milestoneEndDate),
      project: project.name,
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
      project: project.name,
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


export default TimelineComponent;

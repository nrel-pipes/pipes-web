import React, { useState, useEffect, useMemo } from "react";
// import ListGroup from "react-bootstrap/ListGroup";
import { useModelStore } from "./store/ModelStore";
import { useProjectRunStore } from "./store/ProjectRunStore";
import { useProjectStore } from "./store/ProjectStore";
import { useScheduleStore } from "./store/ScheduleStore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";

import getUrl from "./store/OriginSetup";


export default function EventStream() {
  const project = useProjectStore((state) => state.project);
  const projectRuns = useProjectRunStore((state) => state.runs);
  const currentProjectRun = useProjectRunStore(
    (state) => state.currentProjectRun
  );

  const theModelRuns = useModelStore((state) => state.runs);

  const setNumWarnings = useScheduleStore((state) => state.setNumWarnings);
  const schedule = useScheduleStore();

  const [warnings, setWarnings] = useState([]);
  const [dangers, setDangers] = useState([]);
  const [infos, setInfos] = useState([]);
  const [orderBy, setOrderBy] = useState("date");
  const [order, setOrder] = useState("asc");
  function handleSortClick(header) {
    if (orderBy !== header) {
      setOrderBy(header);
    } else {
      setOrder(order === "asc" ? "desc" : "asc");
    }
  }
  const modelRuns = useMemo(() => {
    setWarnings([]);
    setDangers([]);
    setInfos([]);
    return theModelRuns;
  }, [theModelRuns]);

  useEffect(() => {
    setNumWarnings(dangers.length);
  }, [dangers, setNumWarnings, modelRuns]);

  const todaysDate = new Date();
  const daysProjectEnds = getDaysBetweenDates(
    todaysDate,
    getDate(project.scheduled_end)
  );

  function addWarning(
    msg,
    date,
    days,
    user,
    projectRun,
    model,
    modelRun,
    name
  ) {
    const obj = {
      msg: msg,
      projectRun: projectRun,
      name: name,
      model: model,
      modelRun: modelRun,
      user: user,
      date: date,
      days: days,
      rowColor: "warning.main",
    };
    if (!hasObj(warnings, obj)) {
      setWarnings([...warnings, obj]);
    }
  }
  function addInfo(msg, date, days, user, projectRun, model, modelRun, name) {
    const obj = {
      msg: msg,
      projectRun: projectRun,
      name: name,
      model: model,
      modelRun: modelRun,
      user: user,
      date: date,
      days: days,
      rowColor: "text.main",
    };

    if (!hasObj(infos, obj)) {
      setInfos([...infos, obj]);
    }
  }

  function addDanger(msg, date, days, user, projectRun, model, modelRun, name) {
    const obj = {
      msg: msg,
      projectRun: projectRun,
      name: name,
      model: model,
      modelRun: modelRun,
      user: user,
      date: date,
      days: days,
      rowColor: "error.main",
    };

    if (!hasObj(dangers, obj)) {
      setDangers([...dangers, obj]);
    }
  }
  if (daysProjectEnds > 1 && daysProjectEnds < 8) {
    //check if project is near end
    let msg =
      "Project " +
      project.title +
      " ends in " +
      Math.floor(daysProjectEnds) +
      " days";

    addWarning(
      msg,
      getDate(project.scheduled_end),
      daysProjectEnds,
      null,
      null,
      null,
      null,
      project.name
    );
  }
  project.milestones.forEach((milestone) => {
    //check if milestones are near end
    const milestoneDate = getDate(milestone.milestone_date);
    const numDays = getDaysBetweenDates(todaysDate, milestoneDate);
    if (numDays < 8 && numDays > 1) {
      const msg = "Project milestone is in " + Math.floor(numDays) + " days";
      addWarning(
        msg,
        milestoneDate,
        numDays,
        null,
        null,
        null,
        null,
        milestone.name
      );
    }
  });

  projectRuns.forEach(async (run) => {
    const numDaysStart = getDaysBetweenDates(
      getDate(run.scheduled_start)
    );
    const numDaysEnd = getDaysBetweenDates(
      todaysDate,
      getDate(run.scheduled_end)
    );

    // check if project run is near start
    if (numDaysStart > 1 && numDaysStart < 8) {
      let msg =
        "Project run will start in " + Math.floor(numDaysStart) + " days";
      addWarning(
        msg,
        getDate(run.scheduled_start),
        numDaysStart,
        null,
        run.name,
        null,
        null,
        run.name
      );
    }

    // check if project run is near end
    if (numDaysEnd > 1 && numDaysEnd < 8) {
      let msg = "Project run ends in " + Math.floor(numDaysEnd) + " days";
      addWarning(
        msg,
        getDate(run.scheduled_end),
        numDaysEnd,
        null,
        run.name,
        null,
        null,
        run.name
      );
    }

    // check if models are starting or ending soon
    let models = null;
    try {
      const projectRunContext = new URLSearchParams({
        project: project.name,
        projectrun: run.name
      })
      const mUrl=  getUrl(`api/models/?${projectRunContext}`);
      const response = await fetch(mUrl, {
        headers: {
          accept: "application/json",
          Authorization:
            `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        models = await response.json();
      }
    } catch (error) {
      console.log("Failed to fetch project models.")
    }

    models.forEach((model) => {
      const modelStartDate = getDate(model.scheduled_start);
      const numDaysModelStart = getDaysBetweenDates(todaysDate, modelStartDate);
      const modelEndDate = getDate(model.scheduled_end);
      const numDaysModelEnd = getDaysBetweenDates(todaysDate, modelEndDate);
      if (numDaysModelStart > 1 && numDaysModelStart < 8) {
        let msg =
          "Modeling work will start in " +
          Math.floor(numDaysModelStart) +
          " days.";
        addWarning(
          msg,
          modelStartDate,
          numDaysModelStart,
          null,
          run.name,
          model.model_name,
          null,
          null
        );
      }
      if (numDaysModelEnd > 1 && numDaysModelEnd < 8) {
        let msg =
          "Modeling work will end in " + Math.floor(numDaysModelEnd) + " days.";
        addWarning(
          msg,
          modelEndDate,
          numDaysModelEnd,
          null,
          run.name,
          model.model_name,
          null,
          null
        );
      }
    });
  });

  Object.entries(modelRuns).forEach((entry) => {
    //check model runs
    const model = entry[0];

    const runs = entry[1];
    const modelEndDate = getDate(
      schedule.project_runs
        .find((run) => run.name === currentProjectRun)
        .models.find((m) => m.id === model).end
    );
    if (runs.length > 0) {
      runs.forEach((run) => {
        run.tasks.forEach((task) => {
          if (task.task_status !== "PASS") {
            /// check for task failure

            const msg = "Task failed!";
            addDanger(
              msg,
              getDate(task.created),
              null,
              null,
              currentProjectRun,
              model,
              run.model_run_props.name,
              task.task_name
            );
          } else {
            // show info on passed and submitted tasks
            const msg = "Task was completed.";
            addInfo(
              msg,
              getDate(task.created),
              null,
              null,
              currentProjectRun,
              model,
              run.model_run_props.name,
              task.task_name
            );
          }
        });

        run.model_run_props.handoffs.forEach((handoff) => {
          // check handoffs
          const numDays = getDaysBetweenDates(
            todaysDate,
            getDate(handoff.scheduled_end)
          );
          if (numDays > 1 && numDays < 8) {
            const msg =
              "Handoff from model " +
              model +
              " to model " +
              handoff.to_model +
              " is due in " +
              Math.floor(numDays) +
              " days";
            addWarning(
              msg,
              getDate(handoff.scheduled_end),
              numDays,
              null,
              currentProjectRun,
              model,
              run.model_run_props.name,
              handoff.id
            );
          }
        });

        run.model_run_props.datasets.forEach((dataset) => {
          // check expected datasets
          const datasetDate = dataset.scheduled_checkin
            ? dataset.scheduled_checkin !== ""
              ? getDate(dataset.scheduled_checkin)
              : modelEndDate
            : modelEndDate;
          const numDays = getDaysBetweenDates(todaysDate, datasetDate);
          const isCheckedin = run.datasets
            .map((d) => d.dataset_id)
            .includes(dataset.dataset_id);

          if (!isCheckedin) {
            if (numDays >= 0 && numDays < 8) {
              const msg = "Dataset is due in " + Math.floor(numDays) + " days";
              addWarning(
                msg,
                datasetDate,
                numDays,
                null,
                currentProjectRun,
                model,
                run.model_run_props.name,
                dataset.dataset_id
              );
            } else if (numDays < 0) {
              const msg = "Dataset is overdue!";
              addDanger(
                msg,
                datasetDate,
                numDays,
                null,
                currentProjectRun,
                model,
                run.model_run_props.name,
                dataset.dataset_id
              );
            }
          }
        });
        run.datasets.forEach((dataset) => {
          // loop through checked-in datasets

          const datasetDate = getDate(dataset.created);
          const msg = "Dataset was checked in.";

          addInfo(
            msg,
            datasetDate,
            0,
            dataset.registration_author.username,
            currentProjectRun,
            model,
            run.model_run_props.name,
            dataset.dataset_id
          );
        });
      });
    }
  });

  const rows = useMemo(() => {
    let rs = [...dangers, ...infos, ...warnings];
    function compareDates(a, b) {
      let d1 = a.date.getTime();
      let d2 = b.date.getTime();
      const ordering = order === "asc" ? -1 : 1;
      if (d1 < d2) {
        return -1 * ordering;
      }
      if (d1 > d2) {
        return 1 * ordering;
      }
      return 0;
    }
    function compareStrings(a, b) {
      let d1 = a[orderBy];
      let d2 = b[orderBy];
      const ordering = order === "asc" ? -1 : 1;
      if (d1 === null || d1 === undefined) {
        return -1 * ordering;
      }
      if (d2 === null || d2 === undefined) {
        return 1 * ordering;
      }

      if (d1 < d2) {
        return -1 * ordering;
      }
      if (d1 > d2) {
        return 1 * ordering;
      }
      return 0;
    }
    if (orderBy === "date") {
      rs.sort(compareDates);
    } else {
      rs.sort(compareStrings);
    }
    return rs;
  }, [dangers, infos, warnings, orderBy, order]);

  return (
    <EventTable
      rows={rows}
      handleHeaderClick={handleSortClick}
      order={order}
      orderBy={orderBy}
    />
  );
}

function TableHeader({ handleClick, order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        <TableCell sx={{ color: "azure", fontWeight: "bold", fontSize: 18 }}>
          <TableSortLabel
            onClick={() => handleClick("date")}
            direction={order}
            active={orderBy === "date"}
          >
            Date
          </TableSortLabel>
        </TableCell>
        <TableCell sx={{ color: "azure", fontWeight: "bold", fontSize: 18 }}>
          <TableSortLabel
            onClick={() => handleClick("name")}
            direction={order}
            active={orderBy === "name"}
          >
            Name
          </TableSortLabel>
        </TableCell>
        <TableCell sx={{ color: "azure", fontWeight: "bold", fontSize: 18 }}>
          <TableSortLabel
            onClick={() => handleClick("user")}
            direction={order}
            active={orderBy === "user"}
          >
            User
          </TableSortLabel>
        </TableCell>
        <TableCell sx={{ color: "azure", fontWeight: "bold", fontSize: 18 }}>
          <TableSortLabel
            onClick={() => handleClick("projectRun")}
            direction={order}
            active={orderBy === "projectRun"}
          >
            Project Run
          </TableSortLabel>
        </TableCell>
        <TableCell sx={{ color: "azure", fontWeight: "bold", fontSize: 18 }}>
          <TableSortLabel
            onClick={() => handleClick("model")}
            direction={order}
            active={orderBy === "model"}
          >
            Model
          </TableSortLabel>
        </TableCell>
        <TableCell sx={{ color: "azure", fontWeight: "bold", fontSize: 18 }}>
          <TableSortLabel
            onClick={() => handleClick("modelRun")}
            direction={order}
            active={orderBy === "modelRun"}
          >
            Model Run
          </TableSortLabel>
        </TableCell>
        <TableCell sx={{ color: "azure", fontWeight: "bold", fontSize: 18 }}>
          <TableSortLabel
            onClick={() => handleClick("msg")}
            direction={order}
            active={orderBy === "msg"}
          >
            Details
          </TableSortLabel>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}
function EventTable({ rows, handleHeaderClick, order, orderBy }) {
  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "#2f3337" }}>
      <Table>
        <TableHeader
          handleClick={handleHeaderClick}
          order={order}
          orderBy={orderBy}
        />
        <TableBody>
          {rows.map((row, i) => {
            return (
              <TableRow key={"row_" + i} sx={{ backgroundColor: row.rowColor }}>
                <TableCell sx={{ color: "azure" }}>
                  {row.date.toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ color: "azure" }}>{row.name}</TableCell>
                <TableCell sx={{ color: "azure" }}>{row.user}</TableCell>
                <TableCell sx={{ color: "azure" }}>{row.projectRun}</TableCell>
                <TableCell sx={{ color: "azure" }}>{row.model}</TableCell>
                <TableCell sx={{ color: "azure" }}>{row.modelRun}</TableCell>
                <TableCell sx={{ color: "azure" }}>{row.msg}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
function getDaysBetweenDates(date1, date2) {
  let d1 = new Date(date1);
  let d2 = new Date(date2);
  return (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24);
}

function getDate(stringDate) {
  return new Date(stringDate);
}

function hasObj(objList, obj) {
  let isObjInList = false;
  objList.forEach((o) => {
    if (
      o.msg === obj.msg &&
      o.date.getTime() === obj.date.getTime() &&
      o.user === obj.user &&
      o.projectRun === obj.projectRun &&
      o.model === obj.model &&
      o.modelRun === obj.modelRun &&
      o.name === obj.name
    ) {
      isObjInList = true;
    }
  });

  return isObjInList;
}

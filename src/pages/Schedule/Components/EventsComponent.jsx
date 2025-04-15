
import { useMemo, useState } from "react";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

import "../../PageStyles.css";


const EventsComponent = ({ viewMode, showSidebar, divId }) => {
  const [warnings] = useState([]);
  const [dangers] = useState([]);
  const [infos] = useState([]);
  const [orderBy, setOrderBy] = useState("date");
  const [order, setOrder] = useState("asc");

  function handleSortClick(header) {
    if (orderBy !== header) {
      setOrderBy(header);
    } else {
      setOrder(order === "asc" ? "desc" : "asc");
    }
  }

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
      handleHeadClick={handleSortClick}
      order={order}
      orderBy={orderBy}
    />
  );
}

function EventTable({ rows, handleHeadClick, order, orderBy }) {
  return (
    <TableContainer component={Paper} sx={{ backgroundColor: "#D5D8DC" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "#2C3E50", fontWeight: "bold", fontSize: 14 }}>
              <TableSortLabel
                onClick={() => handleHeadClick("date")}
                direction={order}
                active={orderBy === "date"}
              >
                Date
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "#2C3E50", fontWeight: "bold", fontSize: 14 }}>
              <TableSortLabel
                onClick={() => handleHeadClick("name")}
                direction={order}
                active={orderBy === "name"}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "#2C3E50", fontWeight: "bold", fontSize: 14 }}>
              <TableSortLabel
                onClick={() => handleHeadClick("user")}
                direction={order}
                active={orderBy === "user"}
              >
                User
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "#2C3E50", fontWeight: "bold", fontSize: 14 }}>
              <TableSortLabel
                onClick={() => handleHeadClick("projectRun")}
                direction={order}
                active={orderBy === "projectRun"}
              >
                Project Run
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "#2C3E50", fontWeight: "bold", fontSize: 14 }}>
              <TableSortLabel
                onClick={() => handleHeadClick("model")}
                direction={order}
                active={orderBy === "model"}
              >
                Model
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "#2C3E50", fontWeight: "bold", fontSize: 14 }}>
              <TableSortLabel
                onClick={() => handleHeadClick("modelRun")}
                direction={order}
                active={orderBy === "modelRun"}
              >
                Model Run
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ color: "#2C3E50", fontWeight: "bold", fontSize: 14 }}>
              <TableSortLabel
                onClick={() => handleHeadClick("msg")}
                direction={order}
                active={orderBy === "msg"}
              >
                Details
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
            return (
              <TableRow key={"row_" + i} sx={{ backgroundColor: row.rowColor }}>
                <TableCell sx={{ color: "#2C3E50" }}>
                  {row.date.toLocaleDateString()}
                </TableCell>
                <TableCell sx={{ color: "#2C3E50" }}>{row.name}</TableCell>
                <TableCell sx={{ color: "#2C3E50" }}>{row.user}</TableCell>
                <TableCell sx={{ color: "#2C3E50" }}>{row.projectRun}</TableCell>
                <TableCell sx={{ color: "#2C3E50" }}>{row.model}</TableCell>
                <TableCell sx={{ color: "#2C3E50" }}>{row.modelRun}</TableCell>
                <TableCell sx={{ color: "#2C3E50" }}>{row.msg}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


export default EventsComponent;

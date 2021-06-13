import {
  Table as BetterTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import React, { Fragment } from "react";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const useStyles = makeStyles({
  table: {
    width: "70%",
  },
  sortIcon: {
    position: "absolute",
    marginTop: "0.4em",
    marginLeft: "0.4em",
  },
  tableContainer: {
    display: "flex",
    justifyContent: "center",
  },
});

// returns array containing object values with correct type inferred
function objectValues<T extends {}>(obj: T) {
  return Object.keys(obj).map((key) => obj[key as keyof T]);
}

// type guard for primitives
// https://www.typescriptlang.org/docs/handbook/advanced-types.html
// items of this type will just be printed directly
type PrimitiveType = string | number | boolean | Symbol;
function isPrimitive(value: any): value is PrimitiveType {
  return (
    typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "symbol"
  );
}
function accessNestedValues(path: string, object: {}) {
  const properties = path.split(".");
  return properties.reduce((accumulator: any, current) => accumulator && accumulator[current], object);
}

// every item should have an id, that we can identify it by. This is used as a key for its row.
interface SimplestItem {
  id: string | number;
}

interface Header<T> {
  label: string;
  minWidth?: number;
  align?: "right" | "left";
  children?: { [key: string]: Header<T> };
  format?: (value: any) => JSX.Element;
}

// object type with property keys from T whose property values are of type string
export type TableHeaders<T extends SimplestItem> = Record<keyof T, Header<T>>;

interface TableProps<T extends SimplestItem> {
  tableHeaders: TableHeaders<T>;
  rows: Array<T>;
  sort?: Array<string>;
}

export default function Table<T extends SimplestItem>({ tableHeaders, rows, sort }: TableProps<T>) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("asc");
  const classes = useStyles();

  function RenderValue(
    element: T,
    key: keyof T & keyof SimplestItem,
    nestedKey: string = "",
    id?: string | number
  ): JSX.Element {
    const uniqueId = id ? id : element.id;
    const value = element[key];
    if (!nestedKey) nestedKey = key;

    if (typeof value === "object") {
      const keys = Object.keys(value) as (keyof T & keyof SimplestItem)[];
      return (
        <React.Fragment key={`${uniqueId}.${nestedKey}`}>
          {keys.map((innerNestedKey) => {
            return RenderValue(value, key, nestedKey.concat(`.children.${innerNestedKey}`), uniqueId);
          })}
        </React.Fragment>
      );
    }

    const trimmedKey = nestedKey.slice(nestedKey.lastIndexOf(".") === -1 ? 0 : nestedKey.lastIndexOf(".") + 1);
    const valueToRender = !value ? accessNestedValues(trimmedKey, element) : value;
    const uniqueKey = `${uniqueId}.${nestedKey}`;
    const header: Header<T> = accessNestedValues(nestedKey, tableHeaders);
    return (
      <TableCell key={uniqueKey} align={header.align}>
        {header.format ? header.format(valueToRender) : valueToRender}
      </TableCell>
    );
  }

  function RenderRow(row: T) {
    const keys = Object.keys(tableHeaders) as (keyof T & keyof SimplestItem)[];
    return (
      <TableRow hover key={`row.${row.id}`}>
        {keys.map((key) => {
          return RenderValue(row, key);
        })}
      </TableRow>
    );
  }

  function RenderHeader(header: Header<T>) {
    const isAscending = direction === "asc";
    const isDescending = direction === "desc";
    const isCurrentlySortedBy = sortBy === header.label;

    const isAscendingAndActive = isAscending && isCurrentlySortedBy ? " active" : "";
    const isDescendingAndActive = isDescending && isCurrentlySortedBy ? " active" : "";

    const toggleDirection = () => {
      setDirection(direction === "asc" ? "desc" : "asc");
    };

    function doTheThing() {
      if (sortBy === header.label) {
        toggleDirection();
      } else {
        setSortBy(header.label);
        setDirection("asc");
      }
      console.log(sortBy, direction);
    }

    return (
      <TableCell key={`${header.label}`}>
        {sort?.includes(header.label) ? (
          <label
            onClick={() => {
              doTheThing();
            }}
            key={`${header.label}.label`}
            className="sortIcon"
          >
            <span key={`${header.label}.span`}>{header.label}</span>
            <FontAwesomeIcon
              className={`${classes.sortIcon} ${isAscendingAndActive}`}
              icon={faSortUp}
              key={`${header.label}.up`}
            />
            <FontAwesomeIcon
              className={`${classes.sortIcon} ${isDescendingAndActive}`}
              icon={faSortDown}
              key={`${header.label}.down`}
            />
          </label>
        ) : (
          header.label
        )}
      </TableCell>
    );
  }

  function RenderHeaders(headers: TableHeaders<T>): JSX.Element {
    return (
      <React.Fragment key="header">
        {objectValues(headers).map((header) => {
          if (!header.children) {
            return RenderHeader(header);
          }
          return RenderHeaders(header.children as TableHeaders<T>);
        })}
      </React.Fragment>
    );
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <BetterTable stickyHeader className={classes.table}>
          <TableHead>
            <TableRow key="headerRow">{RenderHeaders(tableHeaders)}</TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return RenderRow(row);
            })}
          </TableBody>
        </BetterTable>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}

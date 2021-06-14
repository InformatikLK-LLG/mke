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
import React, { Fragment, useState } from "react";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  sortIcon: {
    position: "absolute",
    marginTop: "0.4em",
    marginLeft: "0.4em",
    color: "var(--border)",
    "&.active": {
      color: "black",
    },
  },
  sortLabel: {
    cursor: "pointer",
    "& > span::selection": {
      backgroundColor: "transparent",
    },
  },
  tableContainer: {
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
    maxHeight: "60%",
    maxWidth: "70%",
    "&::-webkit-scrollbar": {
      width: "0.5em",
      backgroundColor: "var(--input)",
      borderRadius: "1em",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "var(--border)",
      borderRadius: "1em",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "var(--highlighting)",
    },
  },
});

// returns array containing object values with correct type inferred
function objectValues<T extends {}>(obj: T) {
  return Object.keys(obj).map((key) => obj[key as keyof T]);
}

function comparator<T>(a: T, b: T, orderBy: string) {
  const newA = accessNestedValues(String(orderBy), a);
  const newB = accessNestedValues(String(orderBy), b);
  if (newA > newB) return -1;
  if (newA < newB) return 1;
  return 0;
}

function getComparator<Key extends keyof any, T>(
  order: "asc" | "desc",
  orderBy: string
): (a: T, b: T) => number {
  return order === "desc"
    ? (a, b) => comparator(a, b, orderBy)
    : (a, b) => -comparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  array.sort((a, b) => {
    const order = comparator(a, b);
    if (order !== 0) return order;
    return -1;
  });
  return array;
}

// type guard for primitives
// https://www.typescriptlang.org/docs/handbook/advanced-types.html
// items of this type will just be printed directly
type PrimitiveType = string | number | boolean | Symbol;
function isPrimitive(value: any): value is PrimitiveType {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "symbol"
  );
}
function accessNestedValues(path: string, object: {}) {
  const properties = path.split(".");
  return properties.reduce(
    (accumulator: any, current) => accumulator && accumulator[current],
    object
  );
}

// every item should have an id, that we can identify it by. This is used as a key for its row.
interface SimplestItem {
  id: string | number;
}

interface Header {
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any) => JSX.Element;
}

export type TableHeaders<T extends SimplestItem> = AllTableHeaders<T>;
export type AllTableHeaders<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]: K extends string ? AllTableHeaders<T[K]> : never;
    }
  : Header;

interface TableProps<T extends SimplestItem> {
  tableHeaders: TableHeaders<T>;
  rows: T[];
  sort?: Array<string>;
}

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
];

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

type Leaves<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : "";

type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string
        ? `${K}` | Paths<T[K], Prev[D]>
        : never;
    }[keyof T]
  : "";

export default function Table<T extends SimplestItem>({
  tableHeaders,
  rows,
  sort,
}: TableProps<T>) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const classes = useStyles();
  const [accessKeys, setAccessKeys] = useState<Array<Leaves<T>>>([]);

  useEffect(() => {
    const keys = Object.keys(tableHeaders) as (keyof T & keyof SimplestItem)[];

    const generateAccessKey = (key: string): Leaves<T> => {
      const childObject = accessNestedValues(key, tableHeaders);
      const hasChildren = !childObject.label;
      if (!hasChildren) return key;

      const nestedKeys = Object.keys(childObject) as (keyof T &
        keyof SimplestItem)[];
      return nestedKeys.map((nestedKey) =>
        generateAccessKey(`${key}.${nestedKey}`)
      );
    };
    // (typeof tableHeaders[key]) extends Header ? key : generateAccessKey(blub);
    // setAccessKeys
    setAccessKeys(keys.map((key) => generateAccessKey(key)));
  }, []);

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
        <Fragment key={`${uniqueId}.${nestedKey}`}>
          {keys.map((innerNestedKey) => {
            return RenderValue(
              value,
              key,
              nestedKey.concat(`.children.${innerNestedKey}`),
              uniqueId
            );
          })}
        </Fragment>
      );
    }

    const trimmedKey = nestedKey.slice(
      nestedKey.lastIndexOf(".") === -1 ? 0 : nestedKey.lastIndexOf(".") + 1
    );
    const valueToRender = !value
      ? accessNestedValues(trimmedKey, element)
      : value;
    const uniqueKey = `${uniqueId}.${nestedKey}`;
    const header: Header = accessNestedValues(nestedKey, tableHeaders);
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

  function RenderHeader(header: Header, orderBy: string) {
    const isAscending = direction === "asc";
    const isDescending = direction === "desc";
    const isCurrentlySortedBy = sortBy === orderBy;

    const isAscendingAndActive =
      isAscending && isCurrentlySortedBy ? " active" : "";
    const isDescendingAndActive =
      isDescending && isCurrentlySortedBy ? " active" : "";

    const toggleDirection = () => {
      setDirection(direction === "asc" ? "desc" : "asc");
    };

    function doTheThing() {
      if (sortBy === orderBy) {
        toggleDirection();
      } else {
        setSortBy(orderBy);
        setDirection("asc");
      }
      console.log(orderBy, direction, header);
    }

    return (
      <TableCell key={`${orderBy}`}>
        {sort?.includes(header.label) ? (
          <label
            onClick={() => {
              doTheThing();
            }}
            key={`${orderBy}.label`}
            className={classes.sortLabel}
          >
            <span key={`${orderBy}.span`}>{header.label}</span>
            <FontAwesomeIcon
              className={`${classes.sortIcon} ${isAscendingAndActive}`}
              icon={faSortUp}
              key={`${orderBy}.up`}
            />
            <FontAwesomeIcon
              className={`${classes.sortIcon} ${isDescendingAndActive}`}
              icon={faSortDown}
              key={`${orderBy}.down`}
            />
          </label>
        ) : (
          header.label
        )}
      </TableCell>
    );
  }

  function RenderHeaders(
    headers: TableHeaders<T>,
    nestedKey: string = ""
  ): JSX.Element {
    const keys = Object.keys(headers) as (keyof T)[];
    return (
      <Fragment key="header">
        {/* {objectValues(headers).map((header, index) => {
          if (!header.children) {
            if (!nestedKey) return RenderHeader(header, String(keys[index]));
            return RenderHeader(header, nestedKey);
          }
          const childrenKeys = Object.keys(header.children);
          childrenKeys.map((childKey) => {
            const nestedPath = `${keys[index]}.children.${childKey}`;
            const innerChildren = accessNestedValues(nestedPath, header);
            if (!innerChildren.children)
              return RenderHeader(
                innerChildren.children as Header,
                nestedPath
              );
            return RenderHeaders(
              header.children as TableHeaders<T>,
              nestedPath
            );
          });
        })} */}
      </Fragment>
    );
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  stableSort(rows, getComparator(direction, sortBy));

  return (
    <div className="table">
      <ul>
        {accessKeys.map((e, index) => (
          <li key={index}>{e}</li>
        ))}
      </ul>
      <table cellSpacing={0}>
        <thead>
          <tr>{RenderHeaders(tableHeaders)}</tr>
        </thead>
        <tbody>
          {/* {rows.map((row) => {
            return RenderRow(row);
          })} */}
        </tbody>
      </table>
    </div>
  );
}

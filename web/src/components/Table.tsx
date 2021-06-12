import { Table as BetterTable, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { faSortDown, faSortUp, faStreetView } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
//"foo.bar", {foo: {bar: "blub"}}
function accessNestedValues(path: string, object: {}) {
  const properties = path.split(".");
  return properties.reduce((accumulator: any, current) => accumulator && accumulator[current], object);
}

// every item should have an id, that we can identify it by. This is used as a key for its row.
interface SimplestItem {
  id: string | number;
}

interface Header {
  label: string;
  minWidth?: number;
  align?: "right" | "left";
  children?: { [key: string]: Header };
}

// object type with property keys from T whose property values are of type string (or object bc. of nesting TODO)
export type TableHeaders<T extends SimplestItem> = Record<keyof T, Header>;

interface TableProps<T extends SimplestItem> {
  tableHeaders: TableHeaders<T>;
  rows: Array<T>;
  sort?: Array<string>;
}

/* TODO add possibility for custom rendering for advanced types (like objects and stuff) */
export default function Table<T extends SimplestItem>({ tableHeaders, rows, sort }: TableProps<T>) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("asc");

  function RenderNestedValue(row: T, value: T[keyof T][keyof T[keyof T]]): JSX.Element {
    const isCheckedIcon = typeof value === "boolean" && value ? faCheckSquare : faSquare;

    return (
      <>
        {objectValues(value).map((nestedValue) => {
          if (isPrimitive(nestedValue)) {
            return (
              <td key={`${row.id}.${nestedValue}`}>
                {typeof nestedValue !== "boolean" ? (
                  nestedValue
                ) : (
                  <FontAwesomeIcon className="checkbox" icon={isCheckedIcon} />
                )}
              </td>
            );
          } else return RenderNestedValue(row, nestedValue);
        })}
      </>
    );
  }

  function RenderValue(
    element: T,
    key: keyof T & keyof SimplestItem,
    nestedKey: string = "",
    id?: string | number
  ): JSX.Element {
    const uniqueId = id ? id : element.id;
    const value = element[key];
    // const isCheckedIcon = typeof value === "boolean" && value ? faCheckSquare : faSquare;
    if (!nestedKey) nestedKey = key;

    if (typeof value === "object") {
      const keys = Object.keys(value) as (keyof T & keyof SimplestItem)[];
      return (
        <>
          {keys.map((innerNestedKey) => {
            // console.log(`now at nested ${nestedKey.concat(`.children.${innerNestedKey}`)}`);
            return RenderValue(value, key, nestedKey.concat(`.children.${innerNestedKey}`), uniqueId);
          })}
        </>
      );
    }

    const trimmedKey = nestedKey.slice(nestedKey.lastIndexOf(".") === -1 ? 0 : nestedKey.lastIndexOf(".") + 1);
    const valueToRender = !value ? accessNestedValues(trimmedKey, element) : value;
    const uniqueKey = `${uniqueId}.${nestedKey}`;
    return (
      <TableCell key={uniqueKey} align={accessNestedValues(nestedKey, tableHeaders).align}>
        {/* {console.log(`rendering ${nestedKey}: ${accessNestedValues(trimmedKey, element)}`)} */}
        {console.log(`key: ${uniqueKey}`)}
        {/* {!value ? accessNestedValues(trimmedKey, element) : value} */}
        {valueToRender}
      </TableCell>
    );
  }

  function RenderRow(row: T) {
    const keys = Object.keys(tableHeaders) as (keyof T & keyof SimplestItem)[];
    return (
      <TableRow
        hover
        key={`row${row.id}`}
        // onClick={() => { console.log("click", row.id); navigate("./".concat(`${row.id}`)); }}
        className="link"
      >
        {keys.map((key) => {
          return RenderValue(row, key);
        })}
      </TableRow>
    );
  }

  function RenderHeader(header: Header) {
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
      <TableCell key={header.label}>
        {sort?.includes(header.label) ? (
          <label
            onClick={() => {
              doTheThing();
            }}
            key={`${header}.label`}
          >
            <span key={`${header.label}.span`}>{header.label}</span>
            <FontAwesomeIcon className={`sortIcon${isAscendingAndActive}`} icon={faSortUp} key={`${header}.up`} />
            <FontAwesomeIcon className={`sortIcon${isDescendingAndActive}`} icon={faSortDown} key={`${header}.down`} />
          </label>
        ) : (
          header.label
        )}
      </TableCell>
    );
  }

  function RenderHeaders(headers: TableHeaders<T>): JSX.Element {
    return (
      <>
        {objectValues(headers).map((header) => {
          if (!header.children) {
            return RenderHeader(header);
          }
          return RenderHeaders(header.children as TableHeaders<T>);
        })}
      </>
    );
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  return (
    <TableContainer>
      <BetterTable stickyHeader>
        <TableHead>
          <TableRow>{RenderHeaders(tableHeaders)}</TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
            return RenderRow(row);
          })}
        </TableBody>
      </BetterTable>
    </TableContainer>
  );
}

import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

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
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "symbol"
  );
}

// every item should have an id, that we can identify it by. This is used as a key for its row.
interface SimplestItem {
  id: string | number;
}

// object type with property keys from T whose property values are of type string (or object bc. of nesting TODO)
type TableHeaders<T extends SimplestItem> = Record<keyof T, string | {}>;

interface TableProps<T extends SimplestItem> {
  tableHeaders: TableHeaders<T>;
  rows: Array<T>;
  sort?: Array<string>;
}

/* TODO add possibility for custom rendering for advanced types (like objects and stuff) */
export default function Table<T extends SimplestItem>({
  tableHeaders,
  rows,
  sort,
}: TableProps<T>) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("asc");

  function RenderNestedValue(
    row: T,
    value: T[keyof T][keyof T[keyof T]]
  ): JSX.Element {
    const isCheckedIcon =
      typeof value === "boolean" && value ? faCheckSquare : faSquare;

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

  function RenderValue(row: T, value: T[keyof T]) {
    const isCheckedIcon =
      typeof value === "boolean" && value ? faCheckSquare : faSquare;

    if (isPrimitive(value))
      return (
        <td key={`${row.id}.${value}`}>
          {typeof value !== "boolean" ? (
            value
          ) : (
            <FontAwesomeIcon className="checkbox" icon={isCheckedIcon} />
          )}
        </td>
      );
    else return RenderNestedValue(row, value);
  }

  function RenderRow(row: T) {
    return (
      <tr
        key={`row${row.id}`}
        onClick={() => {
          console.log("click", row.id);
          navigate("./".concat(`${row.id}`));
        }}
        className="link"
      >
        {objectValues(row).map((value) => {
          return RenderValue(row, value);
        })}
      </tr>
    );
  }

  function RenderHeader(header: string) {
    const isAscending = direction === "asc";
    const isDescending = direction === "desc";
    const isCurrentlySortedBy = sortBy === header;

    const isAscendingAndActive =
      isAscending && isCurrentlySortedBy ? " active" : "";
    const isDescendingAndActive =
      isDescending && isCurrentlySortedBy ? " active" : "";

    const toggleDirection = () => {
      setDirection(direction === "asc" ? "desc" : "asc");
    };

    function doTheThing() {
      if (sortBy === header) {
        toggleDirection();
      } else {
        setSortBy(header);
        setDirection("asc");
      }
      console.log(sortBy, direction);
    }

    return (
      <th key={header}>
        {sort?.includes(header) ? (
          <label
            onClick={() => {
              doTheThing();
            }}
            key={`${header}.label`}
          >
            <span key={`${header}.span`}>{header}</span>
            <FontAwesomeIcon
              className={`sortIcon${isAscendingAndActive}`}
              icon={faSortUp}
              key={`${header}.up`}
            />
            <FontAwesomeIcon
              className={`sortIcon${isDescendingAndActive}`}
              icon={faSortDown}
              key={`${header}.down`}
            />
          </label>
        ) : (
          header
        )}
      </th>
    );
  }

  function RenderHeaders(headers: TableHeaders<T>): JSX.Element {
    return (
      <>
        {objectValues(headers).map((header) => {
          if (typeof header === "string") {
            return RenderHeader(header);
          }
          return RenderHeaders(header as TableHeaders<T>);
        })}
      </>
    );
  }

  return (
    <div className="table">
      <table cellSpacing={0}>
        <thead>
          <tr>{RenderHeaders(tableHeaders)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            return RenderRow(row);
          })}
        </tbody>
      </table>
    </div>
  );
}

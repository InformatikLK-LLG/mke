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
}

/* TODO improve nested headers and rows stuff*/
/* TODO fix keys */
/* TODO add possibility for custom rendering for advanced types (like objects and stuff) */
export default function Table<T extends SimplestItem>({
  tableHeaders,
  rows,
}: TableProps<T>) {
  function renderNestedValue(row: T, value: T[keyof T] | any): any {
    return objectValues(value).map((nestedValue) => {
      return isPrimitive(nestedValue) ? (
        <td key={`${row.id}.${nestedValue}`}>
          {nestedValue}
          {console.log(
            `nested value of ${row.id}: ${nestedValue} with key ${row.id}.${nestedValue}`
          )}
        </td>
      ) : typeof nestedValue === "object" ? (
        (console.log("Double Nested!!!"), renderNestedValue(row, nestedValue))
      ) : (
        console.log("was denn hier los")
      );
    });
  }
  // if (typeof nestedValue === "object") {
  //   console.log("DOUBLE NESTED");
  //   renderNestedValue(row, nestedValue);
  // }

  // <td key={`${row.id}.${nestedValue}`}>
  //   {nestedValue}
  //   {console.log(`nestedValue of ${row.id}: ${nestedValue} with key ${row.id}.${nestedValue}`)}
  // </td>
  // );

  function renderValue(row: T, value: T[keyof T]) {
    return isPrimitive(value) ? (
      <td key={`${row.id}.${value}`}>
        {value}
        {console.log(
          `primitive value of ${row.id}: ${value} with key ${row.id}.${value}`
        )}
      </td>
    ) : typeof value === "object" ? (
      (console.log("nested!!!"), renderNestedValue(row, value))
    ) : (
      console.log("was denn hier los")
    );
    // (
    //       renderNestedValue(row, value)
    //     );
  }

  function renderRow(row: T) {
    return (
      <tr key={`row${row.id}`}>
        {console.log(`Row with key row${row.id}`)}
        {objectValues(row).map((value) => {
          return renderValue(row, value);
        })}
      </tr>
    );
  }

  function renderNestedHeader(header: object): any {
    return objectValues(header).map((thing) => {
      return typeof thing === "string" ? (
        <th key={`${thing}`}>
          {thing}
          {/* potentially not unique if there are other nested headers with same attr */}
          {console.log(`header ${thing} with key ${thing}`)}
        </th>
      ) : (
        renderNestedHeader(thing)
      );
    });
  }

  function renderHeader(tableHeaders: TableHeaders<T>) {
    return (
      <tr>
        {objectValues(tableHeaders).map((header) => {
          return typeof header === "string" ? (
            <th key={`${header}`}>
              {header}
              {console.log(`header ${header} with key ${header}`)}
            </th>
          ) : (
            objectValues(header).map((nestedHeader) => {
              return typeof nestedHeader === "string" ? (
                <th key={`${nestedHeader}`}>
                  {nestedHeader}
                  {/* potentially not unique key if there are other nested headers with same attr */}
                  {console.log(
                    `nestedHeader ${nestedHeader} with key ${nestedHeader}`
                  )}
                </th>
              ) : (
                <th>empty</th>
              );
            })
          );
        })}
      </tr>
    );
  }
  // renderNestedHeader(nestedHeader)
  // ) : typeof header !== "string" ? (
  //   ""
  // ) : (
  //   renderNestedHeader(header)
  // );
  // )

  return (
    <table>
      <thead>{renderHeader(tableHeaders)}</thead>
      <tbody>
        {rows.map((row) => {
          return renderRow(row);
        })}

        {/*rows.map((row) => {
          console.log(row);
          tableHeaders.map((tableHeader) => {
            //   console.log(row.[tableHeader.identifier]);
            console.log(tableHeader.identifier);
            console.log(row[tableHeader.identifier]);
          });
        })}
      */}
      </tbody>
    </table>
  );
}

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
  return (
    <table>
      <thead>
        <tr>
          {objectValues(tableHeaders).map((header) => {
            return typeof header === "string" ? (
              <th key={header}>
                {header}
                {console.log(`header ${header} with key ${header}`)}
              </th>
            ) : (
              objectValues(header).map((nestedHeader) => {
                return (
                  <th key={`${nestedHeader}`}>
                    {nestedHeader}
                    {/* potentially not unique if there are other nested headers with same attr */}
                    {console.log(
                      `nestedHeader ${nestedHeader} without a key. Do I need one? idk`
                    )}
                  </th>
                );
              })
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          return (
            <tr key={`row${row.id}`}>
              {console.log(`Row with key row${row.id}`)}
              {objectValues(row).map((value) => {
                return isPrimitive(value) ? (
                  <td key={`${row.id}.${value}`}>
                    {value}
                    {console.log(
                      `primitive value of ${row.id}: ${value} with key ${row.id}.${value}`
                    )}
                  </td>
                ) : (
                  objectValues(value).map((nestedValue) => {
                    return (
                      <td key={`${row.id}.${nestedValue}`}>
                        {nestedValue}
                        {console.log(
                          `nestedValue of ${row.id}: ${nestedValue} with key ${row.id}.${nestedValue}`
                        )}
                      </td>
                    );
                  })
                );
              })}
            </tr>
          );
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

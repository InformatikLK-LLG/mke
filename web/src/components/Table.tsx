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

/* TODO add possibility for custom rendering for advanced types (like objects and stuff) */
export default function Table<T extends SimplestItem>({
  tableHeaders,
  rows,
}: TableProps<T>) {
  function renderNestedValue(
    row: T,
    value: T[keyof T][keyof T[keyof T]]
  ): JSX.Element {
    return (
      <>
        {objectValues(value).map((nestedValue) => {
          if (isPrimitive(nestedValue))
            return <td key={`${row.id}.${nestedValue}`}>{nestedValue}</td>;
          else return renderNestedValue(row, nestedValue);
        })}
      </>
    );
  }

  function renderValue(row: T, value: T[keyof T]) {
    if (isPrimitive(value)) return <td key={`${row.id}.${value}`}>{value}</td>;
    else return renderNestedValue(row, value);
  }

  function renderRow(row: T) {
    return (
      <tr key={`row${row.id}`}>
        {objectValues(row).map((value) => {
          return renderValue(row, value);
        })}
      </tr>
    );
  }

  function renderNestedHeader(header: {}): any {
    return objectValues(header).map((nestedHeader) => {
      return typeof nestedHeader === "string" ? (
        <th key={`${nestedHeader}`}>{nestedHeader}</th>
      ) : (
        renderNestedHeader(nestedHeader)
      );
    });
  }

  function renderHeader(headers: TableHeaders<T>) {
    return (
      <tr>
        {objectValues(headers).map((header) => {
          return typeof header === "string" ? (
            <th key={header}>{header}</th>
          ) : (
            renderNestedHeader(header)
          );
        })}
      </tr>
    );
  }

  return (
    <table>
      <thead>{renderHeader(tableHeaders)}</thead>
      <tbody>
        {rows.map((row) => {
          return renderRow(row);
        })}
      </tbody>
    </table>
  );
}

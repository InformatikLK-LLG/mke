import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table as BetterTable,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import {
  IconDefinition,
  faFilter,
  faSortDown,
  faSortUp,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import React, { Fragment, useState } from "react";
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";

import Button from "./Button";
import Delayed from "./Delayed";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HomeRounded } from "@material-ui/icons";
import { InstitutionsSearchParams } from "../hooks/useInstitutions";
import Loading from "./Loading";
import flower from "../resources/blume.jpg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  headerIcon: {
    color: "var(--border)",
    marginRight: "0.2em",
  },
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
  row: {
    "&:hover": {
      backgroundColor: "var(--input)",
    },
  },
  clickable: {
    cursor: "pointer",
  },
  table: {
    tableLayout: "fixed",
    width: "fill-available",
    fallbacks: [
      { width: "-moz-available" },
      { width: "-webkit-fill-available" },
    ],
  },
  tableHeader: {
    position: "sticky",
    top: 0,
    backgroundColor: "white",
    zIndex: 1,
  },
  tableContainer: {
    height: "100%",
    maxWidth: "100%",
    overflowX: "auto",
    overflowY: "auto",
  },
  pagination: {
    alignSelf: "flex-end",
    overflow: "visible",
  },
  searchParams: {
    alignSelf: "flex-start",
  },
  flowerBody: {
    backgroundImage: `url(${flower})`,
    backgroundSize: "100%",
  },
  flowerRow: {
    "&:hover": {
      backgroundColor: "transparent",
      backdropFilter: "brightness(120%)",
    },
  },
  buttonHover: {
    "&:hover": {
      color: "var(--highlighting)",
    },
    color: "var(--border)",
  },
  clearSearchIcon: {
    cursor: "pointer",
    fontSize: "1.2em",
    padding: "6px",
  },
});

export function accessNestedValues(path: string, object: {}) {
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
  icon?: IconDefinition;
  minWidth?: number;
  align?: "right" | "left" | "center";
  format?: (value: any) => JSX.Element;
  width: number;
}

export type TableHeaders<T extends SimplestItem> = AllTableHeaders<T>;
export type AllTableHeaders<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]?: K extends string ? AllTableHeaders<T[K]> : never;
    }
  : Header;

interface TableProps<T extends SimplestItem, K> {
  tableHeaders: TableHeaders<T>;
  rows: T[];
  sort?: Array<string>;
  search?: (parameter?: keyof K, query?: string) => void;
  searchParams?: Array<{ [key in keyof T]?: "number" | "string" }>;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
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
    ? P extends ""
      ? `${K}`
      : `${K}.${P}`
    : never
  : never;

export type Leaves<T, D extends number = 5> = [D] extends [never]
  ? never
  : T extends object
  ? { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]
  : "";

function comparator<T>(a: T, b: T, orderBy: Leaves<T>) {
  let newA = accessNestedValues(orderBy, a);
  let newB = accessNestedValues(orderBy, b);
  if (!isNaN(newA) && !isNaN(newB)) {
    newA = parseInt(newA);
    newB = parseInt(newB);
  } else {
    newA = newA.toLowerCase();
    newB = newB.toLowerCase();
  }

  if (newA > newB) return -1;
  if (newA < newB) return 1;
  return 0;
}

function getComparator<T>(
  order: "asc" | "desc",
  orderBy: Leaves<T>
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

export default function Table<T extends SimplestItem, K>({
  tableHeaders,
  rows,
  sort,
  search,
  searchParams = [],
  onRowClick,
  isLoading,
}: TableProps<T, K>) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<Leaves<T>>("id" as Leaves<T>);
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [searchValues, setSearchValues] = useState<
    { [key in keyof T]: string } | undefined
  >(() => {
    if (!searchParams || searchParams.length === 0) return undefined;

    const tempSearchParams = searchParams.map(
      (searchParam) => Object.keys(searchParam)[0] as keyof T
    );
    const searchArray = tempSearchParams.map((value) => {
      return {
        [value]:
          searchParams[tempSearchParams.indexOf(value)][value] === "number"
            ? "-1"
            : "",
      } as { [key in keyof T]: string };
    });
    return searchArray.reduce((prev, curr) => {
      return { ...prev, ...curr };
    });
  });

  const classes = useStyles();
  const [accessKeys, setAccessKeys] = useState<Array<Leaves<T>>>([]);
  let keyThing = 0;

  useEffect(() => {
    const keys = Object.keys(tableHeaders) as (keyof T & keyof SimplestItem)[];

    const generateAccessKeys = (
      keys: string | (keyof T & keyof SimplestItem)[],
      tmpAccessKeys: Leaves<T>[] = []
    ): Leaves<T>[] => {
      if (Array.isArray(keys)) {
        keys.forEach((key) => {
          pushAccessKey(key, tmpAccessKeys);
        });
      } else {
        pushAccessKey(keys, tmpAccessKeys);
      }
      return tmpAccessKeys;
    };

    const pushAccessKey = (key: string, tmpAccessKeys: Leaves<T>[]) => {
      const childObject = accessNestedValues(key, tableHeaders);
      const hasChildren = !childObject.label;
      if (!hasChildren) tmpAccessKeys.push(key as Leaves<T>);
      else {
        const nestedKeys = Object.keys(childObject) as (keyof T &
          keyof SimplestItem)[];
        nestedKeys.forEach((nestedKey) =>
          generateAccessKeys(`${key}.${nestedKey}`, tmpAccessKeys)
        );
      }
    };

    setAccessKeys(generateAccessKeys(keys));
  }, [tableHeaders]);

  function RenderValue(element: T, key: Leaves<T>, id?: string | number) {
    const uniqueId = id ? id : element.id;
    const uniqueKey = `${uniqueId}.${key}`;

    const header = accessNestedValues(key, tableHeaders);
    const value = accessNestedValues(key, element);
    return (
      <TableCell key={uniqueKey} align={header.align}>
        {header.format ? header.format(value) : value}
      </TableCell>
    );
  }

  function RenderRow(row: T) {
    return (
      <TableRow
        key={`row.${row.id}`}
        onClick={() => onRowClick && onRowClick(row)}
        className={`${classes.row} ${onRowClick && classes.clickable} ${
          isBlume && classes.flowerRow
        }`}
      >
        {accessKeys.map((nestedKey) => {
          return RenderValue(row, nestedKey);
        })}
      </TableRow>
    );
  }

  function RenderHeader(header: Header, orderBy: Leaves<T>) {
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
            {header.icon && (
              <FontAwesomeIcon
                className={classes.headerIcon}
                icon={header.icon}
              />
            )}
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
    nestedKeys: Leaves<T> | Leaves<T>[] = accessKeys
  ): JSX.Element {
    keyThing++;
    return (
      <Fragment key={`headers.${keyThing}`}>
        {Array.isArray(nestedKeys)
          ? nestedKeys.map((innerNestedKey) =>
              RenderHeaders(headers, innerNestedKey)
            )
          : RenderHeader(accessNestedValues(nestedKeys, headers), nestedKeys)}
      </Fragment>
    );
  }
  const useButtonStyles = makeStyles({
    button: {
      marginTop: "2em",
      // padding: "0.5em max(10%, 3em)",
    },
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const formButton = useButtonStyles();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [isBlume, setIsBlume] = useState(false);

  const columnWidths = accessKeys.map((key) => {
    const header = accessNestedValues(key, tableHeaders) as Header;
    return header.width;
  });
  const relativeWidth = columnWidths.reduce((prev, curr) => prev + curr, 0);

  return (
    <>
      {searchValues && (
        <Accordion
          style={{
            width: "100%",
            boxShadow: "none",
            marginBottom: "1.5em",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            Filter
          </AccordionSummary>
          <AccordionDetails>
            {search && (
              <Grid container spacing={2} alignItems="center">
                {searchParams.map((searchParam) => {
                  const parameter = Object.keys(searchParam)[0] as keyof T;
                  return searchParam[parameter] === "number" ? (
                    <Grid
                      container
                      item
                      key={parameter as string}
                      xs
                      alignItems="center"
                    >
                      <Grid item key={`${parameter}-checkbox`}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              id={parameter as string}
                              onChange={(e) => {
                                setPage(0);
                                setSearchValues((values) => {
                                  return (
                                    values && {
                                      ...values,
                                      [parameter]:
                                        e.target.value === "-1"
                                          ? "1"
                                          : String(Number(e.target.checked)),
                                    }
                                  );
                                });
                                search(
                                  parameter as keyof K,
                                  e.target.value === "-1"
                                    ? "1"
                                    : String(Number(e.target.checked))
                                );
                              }}
                              value={searchValues[parameter]}
                              checked={searchValues[parameter] === "1"}
                              indeterminate={searchValues[parameter] === "-1"}
                              indeterminateIcon={
                                <FontAwesomeIcon
                                  icon={faSquare}
                                  style={{ color: "var(--input)" }}
                                />
                              }
                              icon={<FontAwesomeIcon icon={faSquare} />}
                              checkedIcon={
                                <FontAwesomeIcon icon={faCheckSquare} />
                              }
                              color="primary"
                            />
                          }
                          label={
                            (
                              accessNestedValues(
                                String(parameter),
                                tableHeaders
                              ) as Header
                            ).label
                          }
                        />
                      </Grid>
                      <Grid item key={`${parameter}-icon`}>
                        <FontAwesomeIcon
                          className={`inputIcon ${classes.buttonHover} ${classes.clickable}`}
                          icon={faTimes}
                          tabIndex={0}
                          onClick={() => {
                            setPage(0);
                            setSearchValues((values) => {
                              return (
                                values && {
                                  ...values,
                                  [parameter]: "-1",
                                }
                              );
                            });
                            search(parameter as keyof K, "-1");
                          }}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid item key={parameter as string}>
                      <TextField
                        size="small"
                        id={parameter as string}
                        label={
                          (
                            accessNestedValues(
                              String(parameter),
                              tableHeaders
                            ) as Header
                          ).label
                        }
                        variant="outlined"
                        onChange={(e) => {
                          setPage(0);
                          setSearchValues((values) => {
                            return (
                              values && {
                                ...values,
                                [parameter]: e.target.value,
                              }
                            );
                          });
                          search(parameter as keyof K, e.target.value);
                          e.target.value === "blume" && setIsBlume(true);
                          e.target.value === "wtf" && setIsBlume(false);
                        }}
                        value={searchValues[parameter]}
                      />
                    </Grid>
                  );
                })}
                <Grid container item xs justify="flex-end" alignItems="center">
                  <Grid item>
                    <FontAwesomeIcon
                      icon={faTimes}
                      className={`${classes.clearSearchIcon} ${classes.buttonHover} ${classes.clickable}`}
                      onClick={() => {
                        const tempSearchParams = searchParams.map(
                          (searchParam) =>
                            Object.keys(searchParam)[0] as keyof T
                        );
                        const searchArray = tempSearchParams.map((value) => {
                          return {
                            [value]:
                              searchParams[tempSearchParams.indexOf(value)][
                                value
                              ] === "number"
                                ? "-1"
                                : "",
                          } as { [key in keyof T]: string };
                        });
                        setSearchValues(
                          searchArray.reduce((prev, curr) => {
                            return { ...prev, ...curr };
                          })
                        );
                        search();
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            )}
          </AccordionDetails>
        </Accordion>
      )}
      <Grid
        container
        alignItems="flex-start"
        direction="row"
        spacing={2}
      ></Grid>
      <TableContainer className={classes.tableContainer}>
        <BetterTable className={classes.table}>
          <colgroup>
            {columnWidths.map((width, index) => {
              return (
                <col width={`${100 * (width / relativeWidth)}%`} key={index} />
              );
            })}
          </colgroup>
          <TableHead className={classes.tableHeader}>
            <TableRow>{RenderHeaders(tableHeaders)}</TableRow>
          </TableHead>
          <TableBody classes={{ root: isBlume ? classes.flowerBody : "" }}>
            {isLoading ? (
              <tr>
                <td colSpan={accessKeys.length}>
                  <Delayed delay={750}>
                    <Loading />
                  </Delayed>
                </td>
              </tr>
            ) : (
              stableSort(rows, getComparator(direction, sortBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => RenderRow(row))
            )}
          </TableBody>
        </BetterTable>
      </TableContainer>
      {rows.length === 0 && !isLoading ? (
        <Button
          label="zeugs"
          type="button"
          buttonStyle={formButton}
          backgroundColor={theme.palette.primary.main}
        />
      ) : (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          className={classes.pagination}
        />
      )}
    </>
  );
}

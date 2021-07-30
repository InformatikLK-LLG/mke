import {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteRenderInputParams,
  Autocomplete as MuiAutocomplete,
} from "@material-ui/lab";
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";

import { Checkbox } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Fragment } from "react";

export default function Autocomplete<T extends string>({
  data,
  inputField,
  onChange,
  value,
}: {
  data: Array<T>;
  inputField: (params: AutocompleteRenderInputParams) => JSX.Element;
  onChange: (
    event: React.ChangeEvent<{}>,
    values: Array<T>,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<T>
  ) => void;
  value: Array<T> | undefined;
}) {
  return (
    <MuiAutocomplete
      multiple
      disableCloseOnSelect
      options={data}
      renderInput={inputField}
      onChange={onChange}
      value={value}
      renderOption={(option, { selected }) => (
        <Fragment>
          <Checkbox
            icon={<FontAwesomeIcon icon={faSquare} />}
            checkedIcon={<FontAwesomeIcon icon={faCheckSquare} />}
            checked={selected}
          />
          {option}
        </Fragment>
      )}
    />
  );
}

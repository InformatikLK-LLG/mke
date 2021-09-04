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

export default function Autocomplete<T>({
  data,
  inputField,
  onChange,
  value,
  loading,
  loadingText,
  renderText = (option) => option as unknown as string,
  disabled,
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
  loading?: boolean;
  loadingText?: React.ReactNode;
  renderText?: (option: T) => string;
  disabled?: boolean;
}) {
  return (
    <MuiAutocomplete
      multiple
      disableCloseOnSelect
      options={data}
      renderInput={inputField}
      onChange={onChange}
      value={value}
      loading={loading}
      loadingText={loadingText}
      getOptionLabel={renderText}
      disabled={disabled}
      getOptionSelected={(option, value) =>
        renderText(option) === renderText(value)
      }
      renderOption={(option, { selected }) => (
        <Fragment>
          <Checkbox
            icon={<FontAwesomeIcon icon={faSquare} />}
            checkedIcon={<FontAwesomeIcon icon={faCheckSquare} />}
            checked={selected}
          />
          {renderText(option)}
        </Fragment>
      )}
    />
  );
}

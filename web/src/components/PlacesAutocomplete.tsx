import {
  ControllerRenderProps,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from "react-hook-form";
import { cloneElement, useEffect } from "react";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";

import { Autocomplete } from "@material-ui/lab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormInstitutionType } from "../pages/Institution";
import InputAdornment from "@material-ui/core/InputAdornment";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

// const loader = new Loader({
//   apiKey: API_KEY,
//   version: "weekly",
//   libraries: ["places"],
// });

export default function PlacesAutocomplete({
  watch,
  setValueInForm,
  children,
  params,
  searchFor,
  value,
}: {
  watch: UseFormWatch<FormInstitutionType>;
  setValueInForm: UseFormSetValue<FormInstitutionType>;
  children: JSX.Element;
  params: ControllerRenderProps<FormInstitutionType, "address.street" | "name">;
  searchFor?: "school" | "address";
  value: string;
}) {
  const {
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  const handleSelect =
    ({ place_id, description }: { place_id: string; description: string }) =>
    async () => {
      setValue(description, false);
      clearSuggestions();
      const parameter = {
        placeId: place_id,
        fields: ["address_components", "formatted_phone_number", "name"],
      };

      try {
        const details = await getDetails(parameter);
        if (typeof details === "string") return;
        if (!details.address_components) return;
        if (searchFor !== "address") {
          details.formatted_phone_number &&
            setValueInForm("phoneNumber", details.formatted_phone_number, {
              shouldValidate: true,
            });
          details.name &&
            setValueInForm("name", details.name, { shouldValidate: true });
        }

        details.address_components.forEach((component: any) => {
          switch (component.types[0]) {
            case "street_number":
              setValueInForm("address.streetNumber", component.long_name, {
                shouldValidate: true,
              });
              break;
            case "route":
              setValueInForm("address.street", component.long_name, {
                shouldValidate: true,
              });
              break;
            case "locality":
              setValueInForm("address.town", component.long_name, {
                shouldValidate: true,
              });
              break;
            case "postal_code":
              setValueInForm("address.zipCode", component.long_name, {
                shouldValidate: true,
              });
              break;

            default:
              break;
          }
        });
      } catch (error) {
        console.log("OOOPS");
      }
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const data = suggestion;
      return (
        <li key={data.place_id} onClick={handleSelect(suggestion)}>
          <strong>{data.structured_formatting.main_text}</strong>{" "}
          <small>{data.structured_formatting.secondary_text}</small>
        </li>
      );
    });

  useEffect(() => {
    setValue(value);
  }, [value, setValue]);

  // useEffect(() => {
  //   async function load() {
  //     await loader.load();
  //   }
  //   load();
  // }, []);

  return (
    <Autocomplete
      freeSolo
      autoComplete
      includeInputInList
      filterSelectedOptions
      inputValue={params.value}
      onInputChange={(e, value) => params.onChange(value)}
      onChange={(e, option) => {
        if (typeof option !== "string" && option) {
          const callbackFunction = handleSelect(option);
          callbackFunction();
        }
      }}
      filterOptions={(options) =>
        searchFor
          ? options.filter((option) =>
              searchFor === "address"
                ? ["premise", "route"].some((value) =>
                    option.types.includes(value)
                  )
                : option.types.includes(searchFor)
            )
          : options
      }
      options={data}
      renderInput={(params) =>
        cloneElement(children, {
          ...params,
          InputProps: {
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon className="inputIcon" icon={faEdit} />
              </InputAdornment>
            ),
          },
        })
      }
      getOptionLabel={(option) =>
        option && option.structured_formatting
          ? `${option.structured_formatting.main_text} ${option.structured_formatting.secondary_text}`
          : ""
      }
    />
  );
}

import {
  ControllerRenderProps,
  Path,
  PathValue,
  UnpackNestedValue,
  UseFormSetValue,
} from "react-hook-form";
import { cloneElement, useEffect } from "react";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";

import { Autocomplete } from "@material-ui/lab";
import { Autocomplete as AutocompleteType } from "../pages/Institution";
import { InputProps } from "@material-ui/core";

// const loader = new Loader({
//   apiKey: API_KEY,
//   version: "weekly",
//   libraries: ["places"],
// });

export default function PlacesAutocomplete<
  T extends {
    address: {
      street: string;
      streetNumber: string;
      town: string;
      zipCode: string;
    };
    name: string;
    phoneNumber: string;
  }
>({
  setValueInForm,
  children,
  params,
  searchFor,
  InputProps,
  autoComplete,
  disabled = false,
}: {
  setValueInForm: UseFormSetValue<T>;
  children: JSX.Element;
  params: ControllerRenderProps<T>;
  searchFor?: "school" | "address" | "point_of_interest";
  InputProps: InputProps;
  autoComplete?: AutocompleteType;
  disabled?: boolean;
}) {
  const types = searchFor === "address" ? ["geocode"] : ["establishment"];
  const {
    suggestions: { data },
    value,
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    requestOptions: {
      componentRestrictions: { country: "de" },
      types,
    },
  });

  const handleSelect =
    ({ place_id, description }: { place_id: any; description: string }) =>
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
              setValueInForm(
                "phoneNumber" as Path<T>,
                details.formatted_phone_number as PathValue<T, Path<T>>,
                {
                  shouldValidate: true,
                }
              );
            details.name &&
              setValueInForm(
                "name" as Path<T>,
                details.name as PathValue<T, Path<T>>,
                {
                  shouldValidate: true,
                }
              );
          }

          details.address_components.forEach((component: any) => {
            switch (component.types[0]) {
              case "street_number":
                setValueInForm(
                  "address.streetNumber" as Path<T>,
                  component.long_name as PathValue<T, Path<T>>,
                  {
                    shouldValidate: true,
                  }
                );
                break;
              case "route":
                setValueInForm(
                  "address.street" as Path<T>,
                  component.long_name as PathValue<T, Path<T>>,
                  {
                    shouldValidate: true,
                  }
                );
                break;
              case "locality":
                setValueInForm(
                  "address.town" as Path<T>,
                  component.long_name as PathValue<T, Path<T>>,
                  {
                    shouldValidate: true,
                  }
                );
                break;
              case "postal_code":
                setValueInForm(
                  "address.zipCode" as Path<T>,
                  component.long_name as PathValue<T, Path<T>>,
                  {
                    shouldValidate: true,
                  }
                );
                break;

              default:
                break;
            }
          });
        } catch (error) {
          console.log("OOOPS");
        }
      };

  useEffect(() => {
    setValue(params.value as string);
  }, [params.value, setValue]);

  return (
    <Autocomplete
      freeSolo
      autoComplete
      includeInputInList
      filterSelectedOptions
      disableClearable
      disabled={disabled}
      style={{ display: "inline" }}
      inputValue={value || ""}
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
          InputProps: { ...params.InputProps, ...InputProps, className: "" },
          inputProps: { ...params.inputProps, autoComplete },
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

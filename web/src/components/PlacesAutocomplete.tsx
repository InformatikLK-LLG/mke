<<<<<<< HEAD
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
=======
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";

import { Autocomplete } from "@material-ui/lab";
import { FormInstitutionType } from "../pages/Institution";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
>>>>>>> e474087 (First draft autocomplete)

// const loader = new Loader({
//   apiKey: API_KEY,
//   version: "weekly",
//   libraries: ["places"],
// });

<<<<<<< HEAD
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
    suggestions: { status, data },
    value,
=======
export default function PlacesAutocomplete({
  watch,
  setValueInForm,
  children,
}: {
  watch: UseFormWatch<FormInstitutionType>;
  setValueInForm: UseFormSetValue<FormInstitutionType>;
  children: JSX.Element;
}) {
  const {
    suggestions: { status, data },
>>>>>>> e474087 (First draft autocomplete)
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
<<<<<<< HEAD
    requestOptions: {
      componentRestrictions: { country: "de" },
      types,
    },
  });

  const handleSelect =
    ({ place_id, description }: { place_id: string; description: string }) =>
=======
  });
  const address = watch("address.street");

  const handleSelect =
    ({ place_id, description }: { place_id: any; description: string }) =>
>>>>>>> e474087 (First draft autocomplete)
    async () => {
      setValue(description, false);
      clearSuggestions();
      const parameter = {
        placeId: place_id,
<<<<<<< HEAD
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
              details.formatted_phone_number as UnpackNestedValue<
                PathValue<T, Path<T>>
              >,
              {
                shouldValidate: true,
              }
            );
          details.name &&
            setValueInForm(
              "name" as Path<T>,
              details.name as UnpackNestedValue<PathValue<T, Path<T>>>,
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
                component.long_name as UnpackNestedValue<PathValue<T, Path<T>>>,
                {
                  shouldValidate: true,
                }
              );
              break;
            case "route":
              setValueInForm(
                "address.street" as Path<T>,
                component.long_name as UnpackNestedValue<PathValue<T, Path<T>>>,
                {
                  shouldValidate: true,
                }
              );
              break;
            case "locality":
              setValueInForm(
                "address.town" as Path<T>,
                component.long_name as UnpackNestedValue<PathValue<T, Path<T>>>,
                {
                  shouldValidate: true,
                }
              );
              break;
            case "postal_code":
              setValueInForm(
                "address.zipCode" as Path<T>,
                component.long_name as UnpackNestedValue<PathValue<T, Path<T>>>,
                {
                  shouldValidate: true,
                }
              );
=======
        fields: ["address_components"],
      };
      console.log(await getDetails({ placeId: place_id }));

      try {
        const { address_components }: { address_components: any } =
          await getDetails(parameter);
        address_components.forEach((component: any) => {
          switch (component.types[0]) {
            case "street_number":
              setValueInForm("address.streetNumber", component.long_name);
              console.log(component.long_name);
              break;
            case "route":
              setValueInForm("address.street", component.long_name);
              console.log(component.long_name);
              break;
            case "locality":
              setValueInForm("address.town", component.long_name);
              console.log(component.long_name);
              break;
            case "postal_code":
              setValueInForm("address.zipCode", component.long_name);
              console.log(component.long_name);
>>>>>>> e474087 (First draft autocomplete)
              break;

            default:
              break;
          }
        });
      } catch (error) {
        console.log("OOOPS");
      }
    };

<<<<<<< HEAD
  const renderSuggestions = () =>
    data.map((suggestion) => {
      const data = suggestion;
=======
  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const data = suggestion;
      console.log(data);
>>>>>>> e474087 (First draft autocomplete)
      return (
        <li key={data.place_id} onClick={handleSelect(suggestion)}>
          <strong>{data.structured_formatting.main_text}</strong>{" "}
          <small>{data.structured_formatting.secondary_text}</small>
        </li>
      );
    });

  useEffect(() => {
<<<<<<< HEAD
    setValue(params.value as string);
  }, [params.value, setValue]);
=======
    setValue(address);
  }, [address, setValue]);
>>>>>>> e474087 (First draft autocomplete)

  // useEffect(() => {
  //   async function load() {
  //     await loader.load();
  //   }
  //   load();
  // }, []);

  return (
<<<<<<< HEAD
    <Autocomplete
      freeSolo
      autoComplete
      includeInputInList
      filterSelectedOptions
      disableClearable
      disabled={disabled}
      style={{ display: "inline" }}
      inputValue={value as string}
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
=======
    <>
      <Autocomplete
        freeSolo
        autoComplete
        includeInputInList
        filterSelectedOptions
        ref={ref}
        renderInput={() => children}
        options={data}
        renderOption={(option) => (
          <span key={option.place_id}>
            {option.structured_formatting.main_text}{" "}
            {option.structured_formatting.secondary_text}
          </span>
        )}
      />
      {status === "OK" && (
        <ul
          style={{
            zIndex: 5,
            position: "absolute",
            backgroundColor: "white",
            boxShadow: "0 0 5px var(--border)",
          }}
        >
          {renderSuggestions()}
        </ul>
      )}
    </>
>>>>>>> e474087 (First draft autocomplete)
  );
}

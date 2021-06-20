import {
  ControllerRenderProps,
  Path,
  PathValue,
  UnpackNestedValue,
  UseFormSetValue,
<<<<<<< HEAD
<<<<<<< HEAD
=======
  UseFormTrigger,
=======
>>>>>>> f7b8c98 (Try styling end adornment (clear button for input field))
  UseFormWatch,
>>>>>>> 33f7c01 (Fix validation not being triggered on autofill)
} from "react-hook-form";
import { cloneElement, useEffect } from "react";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";

import { Autocomplete } from "@material-ui/lab";
import { Autocomplete as AutocompleteType } from "../pages/Institution";
import { FormInstitutionType } from "../pages/Institution";
<<<<<<< HEAD
import { InputProps } from "@material-ui/core";
import { Loader } from "@googlemaps/js-api-loader";
import useOnclickOutside from "react-cool-onclickoutside";
=======
import InputAdornment from "@material-ui/core/InputAdornment";
import { InputProps } from "@material-ui/core";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
>>>>>>> f7b8c98 (Try styling end adornment (clear button for input field))

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
<<<<<<< HEAD
  InputProps,
  autoComplete,
  disabled = false,
=======
  value,
<<<<<<< HEAD
>>>>>>> 0f99dfe (Split up search for institution by name and address)
=======
  InputProps,
>>>>>>> f7b8c98 (Try styling end adornment (clear button for input field))
}: {
  setValueInForm: UseFormSetValue<T>;
  children: JSX.Element;
<<<<<<< HEAD
  params: ControllerRenderProps<T>;
  searchFor?: "school" | "address" | "point_of_interest";
  InputProps: InputProps;
  autoComplete?: AutocompleteType;
  disabled?: boolean;
=======
  params: ControllerRenderProps<FormInstitutionType, "address.street" | "name">;
  searchFor?: "school" | "address";
  value: string;
<<<<<<< HEAD
>>>>>>> 0f99dfe (Split up search for institution by name and address)
=======
  InputProps: InputProps;
>>>>>>> f7b8c98 (Try styling end adornment (clear button for input field))
}) {
  const types = searchFor === "address" ? ["geocode"] : ["establishment"];
  const {
    suggestions: { status, data },
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
<<<<<<< HEAD
=======

>>>>>>> 0f99dfe (Split up search for institution by name and address)
      try {
        const details = await getDetails(parameter);
        if (typeof details === "string") return;
        if (!details.address_components) return;
        if (searchFor !== "address") {
          details.formatted_phone_number &&
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
            setValueInForm("phoneNumber", details.formatted_phone_number);
          details.name && setValueInForm("name", details.name);
>>>>>>> 0f99dfe (Split up search for institution by name and address)
=======
            setValueInForm("phoneNumber", details.formatted_phone_number, {
              shouldValidate: true,
            });
          details.name &&
            setValueInForm("name", details.name, { shouldValidate: true });
>>>>>>> 33f7c01 (Fix validation not being triggered on autofill)
=======
            setValueInForm("phoneNumber", details.formatted_phone_number);
          details.name && setValueInForm("name", details.name);
>>>>>>> f7b8c98 (Try styling end adornment (clear button for input field))
        }

        details.address_components.forEach((component: any) => {
          switch (component.types[0]) {
            case "street_number":
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
              setValueInForm("address.streetNumber", component.long_name);
=======
              setValueInForm("address.streetNumber", component.long_name, {
                shouldValidate: true,
              });
>>>>>>> 33f7c01 (Fix validation not being triggered on autofill)
=======
              setValueInForm("address.streetNumber", component.long_name);
>>>>>>> f7b8c98 (Try styling end adornment (clear button for input field))
              break;
            case "route":
              setValueInForm("address.street", component.long_name);
              break;
            case "locality":
              setValueInForm("address.town", component.long_name);
              break;
            case "postal_code":
<<<<<<< HEAD
<<<<<<< HEAD
              setValueInForm("address.zipCode", component.long_name);
>>>>>>> 0f99dfe (Split up search for institution by name and address)
=======
              setValueInForm("address.zipCode", component.long_name, {
                shouldValidate: true,
              });
>>>>>>> 33f7c01 (Fix validation not being triggered on autofill)
=======
              setValueInForm("address.zipCode", component.long_name);
>>>>>>> f7b8c98 (Try styling end adornment (clear button for input field))
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
<<<<<<< HEAD
    setValue(params.value as string);
  }, [params.value, setValue]);

=======
    setValue(value);
  }, [value, setValue]);
>>>>>>> 0f99dfe (Split up search for institution by name and address)

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
      disableClearable
<<<<<<< HEAD
      disabled={disabled}
      style={{ display: "inline" }}
      inputValue={value as string}
=======
      inputValue={params.value}
>>>>>>> f7b8c98 (Try styling end adornment (clear button for input field))
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
<<<<<<< HEAD
<<<<<<< HEAD
          InputProps: { ...params.InputProps, ...InputProps, className: "" },
          inputProps: { ...params.inputProps, autoComplete },
=======
          InputProps: {
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon className="inputIcon" icon={faEdit} />
              </InputAdornment>
            ),
          },
>>>>>>> 0f99dfe (Split up search for institution by name and address)
=======
          InputProps: { ...params.InputProps, ...InputProps, className: "" },
>>>>>>> f7b8c98 (Try styling end adornment (clear button for input field))
        })
      }
    />
  );
}

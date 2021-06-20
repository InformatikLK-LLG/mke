import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";

import { Autocomplete } from "@material-ui/lab";
import { FormInstitutionType } from "../pages/Institution";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect } from "react";
import useOnclickOutside from "react-cool-onclickoutside";

// const loader = new Loader({
//   apiKey: API_KEY,
//   version: "weekly",
//   libraries: ["places"],
// });

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
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });
  const address = watch("address.street");

  const handleSelect =
    ({ place_id, description }: { place_id: any; description: string }) =>
    async () => {
      setValue(description, false);
      clearSuggestions();
      const parameter = {
        placeId: place_id,
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
              break;

            default:
              break;
          }
        });
      } catch (error) {
        console.log("OOOPS");
      }
    };

  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const data = suggestion;
      console.log(data);
      return (
        <li key={data.place_id} onClick={handleSelect(suggestion)}>
          <strong>{data.structured_formatting.main_text}</strong>{" "}
          <small>{data.structured_formatting.secondary_text}</small>
        </li>
      );
    });

  useEffect(() => {
    setValue(address);
  }, [address, setValue]);

  // useEffect(() => {
  //   async function load() {
  //     await loader.load();
  //   }
  //   load();
  // }, []);

  return (
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
  );
}

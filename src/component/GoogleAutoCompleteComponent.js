import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { TextInput } from "react-native-paper";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function PlacesAutocompleteInput({
  apiKey,
  onPlaceSelected,
  placeholder = "Street Address",
}) {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [focused, setFocused] = useState(false);

  const debouncedInput = useDebounce(input, 300);
  const inputRef = useRef(null);
  const justSelected = useRef(false);

  // ---------------------------
  // AUTOCOMPLETE (Old API)
  // ---------------------------
  useEffect(() => {
    async function fetchPredictions() {
      if (justSelected.current) {
        justSelected.current = false;
        return;
      }

      if (!debouncedInput.trim()) {
        setPredictions([]);
        return;
      }

      try {
        const res = await axios.get(
          "https://maps.googleapis.com/maps/api/place/autocomplete/json",
          {
            params: {
              input: debouncedInput,
              key: apiKey,
              language: "en",
            },
          }
        );

        if (res.data.predictions) {
          const list = res.data.predictions.map((p) => ({
            placeId: p.place_id,
            description: p.description,
            mainText: p.structured_formatting.main_text,
            secondaryText: p.structured_formatting.secondary_text,
          }));

          setPredictions(list);
        } else {
          setPredictions([]);
        }
      } catch (e) {
        console.log("Autocomplete error", e);
        setPredictions([]);
      }
    }

    fetchPredictions();
  }, [debouncedInput, apiKey]);

  // ---------------------------
  // PARSE PLACE DETAILS
  // ---------------------------
  const formatPlaceDetails = (place, placeId) => {
    const comps = place.address_components || [];

    const find = (type) =>
      comps.find((c) => c.types.includes(type))?.long_name || "";

    return {
      placeId,
      name: place.name || "",
      formattedAddress: place.formatted_address || "",
      location: place.geometry?.location || {},
      street: find("route"),
      streetNumber: find("street_number"),
      city: find("locality"),
      district: find("sublocality"),
      state: find("administrative_area_level_1"),
      country: find("country"),
      postalCode: find("postal_code"),
      addressComponents: comps, // include raw components
    };
  };

  // ---------------------------
  // FETCH DETAILS (Old API)
  // ---------------------------
  const fetchPlaceDetails = async (placeId) => {
    try {
      const res = await axios.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        {
          params: {
            place_id: placeId,
            key: apiKey,
            fields:
              "address_component,formatted_address,name,geometry",
          },
        }
      );

      return formatPlaceDetails(res.data.result, placeId);
    } catch (err) {
      console.log("Details error", err);
      return null;
    }
  };

  // ---------------------------
  // ON SELECT
  // ---------------------------
  const handleSelect = async (prediction) => {
    justSelected.current = true;
    setPredictions([]);
    inputRef.current?.blur();

    const details = await fetchPlaceDetails(prediction.placeId);

    if (details) {
      onPlaceSelected({
        ...prediction,
        details,
      });

      setInput(prediction.description);
    }
  };

  return (
    <View style={{ zIndex: 999 }}>
      {/* <View
        style={[
          styles.inputWrapper,
          focused && { borderColor: "#5D20D3", borderWidth: 2 },
        ]}
      > */}
      <TextInput
        label={placeholder}
        value={input}
        multiline
        onChangeText={setInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        // placeholderTextColor="#999"  // paper me label handle karta hai
        // style={styles.input}         // custom style add kar sakte ho

        mode="flat"                  // 👈 filled / underline style
        underlineColor="#999"        // inactive underline
        activeUnderlineColor="#6e5af4"  // focused / active underline

        style={{
          backgroundColor: "#fff",   // white background
          paddingHorizontal: 0,      // input start aligned
        }}

        contentStyle={{
          paddingHorizontal: 0,      // inner text padding
        }}

        theme={{
          colors: {
            background: "#fff",
            surface: "#fff",
            onSurfaceVariant: "#999", // label inactive color
            primary: "#6e5af4",       // label + underline active color
          },
        }}
      />

      {/* </View> */}

      {predictions.length > 0 && (
        <ScrollView style={styles.dropdown}>
          {predictions.map((p) => (
            <TouchableOpacity
              key={p.placeId}
              style={styles.item}
              onPress={() => handleSelect(p)}
            >
              <Text style={styles.itemText}>{p.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
  },
  input: {
    padding: 14,
    fontSize: 14,
    color: "#000",
  },
  dropdown: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    maxHeight: 250,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemText: {
    fontSize: 14,
    color: "#000",
  },
});

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,

  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { TextField } from "rn-material-ui-textfield";
import { launchImageLibrary } from "react-native-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, { showMessage } from "react-native-flash-message";
import Header from "../component/Header";
import { ProgressLoader } from "../component/ProgressLoader";
import { ButtonCustom } from "../component/ButtonCustom";
import EndUrl from "../api/EndUrl";
import thumsImg from "../../assets/img/thumbs.png";
import AlertModal from "../component/AlertModal";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";

const ContactUsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [showBodyLogin, setShowBodyLogin] = useState(false);

  const [reasons, setReasons] = useState([
    "Placing an Order related",
    "Delivery related",
    "Product Quality related",
    "Seller enrolment related",
    "Marketing Related",
    "Media query",
    "Investor query",
    "Job related",
  ]);

  const validateField = (field, value) => {
    let error = {};
    switch (field) {
      case "firstname":
        if (!value.trim()) error.firstname = "First name is required.";
        break;
      case "lastname":
        if (!value.trim()) error.lastname = "Last name is required.";
        break;
      case "email":
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)+$/;
        if (!emailRegex.test(value))
          error.email = "Please enter a valid email address.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (field, value) => {
    switch (field) {
      case "firstname":
        setFirstname(value);
        break;
      case "lastname":
        setLastname(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "comment":
        setComment(value);
        break;
      default:
        break;
    }
    if (errors[field]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[field];
      setErrors(updatedErrors);
    }
  };

  const handleSubmit = async () => {
    const userToken = await AsyncStorage.getItem("usertoken");
    if (userToken) {
      const validationErrors = {
        ...validateField("firstname", firstname),
        ...validateField("lastname", lastname),
        ...validateField("email", email),
      };

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setLoading(true);

      try {
        const payload = {
          reason,
          email,
          first_name: firstname,
          last_name: lastname,
          comment,
        };

        const response = await fetch(EndUrl.savecontactus, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: JSON.parse(userToken),
            Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
            Platform: Platform.OS,
          },
          body: JSON.stringify(payload),
        });

        const updateAvailable = response.headers.get("updateAvailable");
        const forceUpdate = response.headers.get("forceUpdate");
        const isOldFordeUpdatePopup = response.headers.get(
          "useOldFordeUpdatePopup"
        );
        if (updateAvailable === 1) {
          await AsyncStorage.setItem("updateAvailable", "true");
        }
        if (forceUpdate === 1) {
          await AsyncStorage.setItem("forceUpdate", "true");
        }
        if (isOldFordeUpdatePopup === 1) {
          await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
        }

        const json = await response.json();
        if (json.status == 200) {
          showMessage({
            message: "Thank you for contacting us. We'll respond shortly.",
            duration: 2000,
            position: "center",
            icon: (props) => <Image source={thumsImg} {...props} />,
            type: "success",
          });

          setFirstname("");
          setLastname("");
          setEmail("");
          setComment("");
          setReason("");

          setTimeout(() => {
            navigation.replace("TabNavigators", { screen: "Home" });
          }, 2000);
        } else {
          showMessage({
            message: "Something went wrong. Please try again later.",
            type: "danger",
          });
        }
      } catch (error) {
        showMessage({
          message: "An error occurred. Please try again.",
          type: "danger",
        });
      } finally {
        setLoading(false);
      }
    } else {
      setShowBodyLogin(true);
    }
  };
  const onCloseModal = () => {
    setShowBodyLogin(false);
  };

  const RadioButton = ({ text, isSelected, onPress }) => (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
      <View style={styles.radioCircle}>
        {isSelected && <View style={styles.radioInnerCircle} />}
      </View>
      <Text style={styles.radioText}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlashMessage />
      <Header categoryTitle="Contact Us" backButtonwithtext />
      <ProgressLoader isVisible={loading} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView>
          <View style={styles.form}>
            <Text style={styles.label}>Reason for contacting*</Text>
            {reasons.map((item, index) => (
              <RadioButton
                key={index}
                text={item}
                isSelected={reason === item}
                onPress={() => setReason(item)}
              />
            ))}
            <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ width: "48%" }}>
                <TextInput
                  label="First Name*"
                  value={firstname}
                  onChangeText={(text) => handleInputChange("firstname", text)}
                  mode="flat"
                  underlineColor="#999"
                  activeUnderlineColor="#6e5af4"
                  style={{ backgroundColor: "#fff", paddingHorizontal: 0 }}
                  contentStyle={{ paddingHorizontal: 0 }}
                  theme={{
                    colors: {
                      background: "#fff",
                      surface: "#fff",
                      onSurfaceVariant: "#999",
                      primary: "#6e5af4",
                    },
                  }}
                />
                {errors.firstname !== "" && <Text style={styles.error}>{errors.firstname}</Text>}
              </View>

              <View style={{ width: "48%" }}>
                <TextInput
                  label="Last Name*"
                  value={lastname}
                  onChangeText={(text) => handleInputChange("lastname", text)}
                  mode="flat"
                  underlineColor="#999"
                  activeUnderlineColor="#6e5af4"
                  style={{ backgroundColor: "#fff", paddingHorizontal: 0 }}
                  contentStyle={{ paddingHorizontal: 0 }}
                  theme={{
                    colors: {
                      background: "#fff",
                      surface: "#fff",
                      onSurfaceVariant: "#999",
                      primary: "#6e5af4",
                    },
                  }}
                />
                {errors.lastname !== "" && <Text style={styles.error}>{errors.lastname}</Text>}
              </View>
            </View>

            <View>
              <TextInput
                label="Email*"
                value={email}
                onChangeText={(text) => handleInputChange("email", text)}
                autoCapitalize="none"
                mode="flat"
                underlineColor="#999"
                activeUnderlineColor="#6e5af4"
                style={{ backgroundColor: "#fff", paddingHorizontal: 0 }}
                contentStyle={{ paddingHorizontal: 0 }}
                theme={{
                  colors: {
                    background: "#fff",
                    surface: "#fff",
                    onSurfaceVariant: "#999",
                    primary: "#6e5af4",
                  },
                }}
              />
              {errors.email !== "" && <Text style={styles.error}>{errors.email}</Text>}
            </View>

            <TextInput
              label="Write a comment"
              value={comment}
              onChangeText={(text) => handleInputChange("comment", text)}
              multiline
              mode="flat"
              underlineColor="#999"
              activeUnderlineColor="#6e5af4"
              style={{ backgroundColor: "#fff", paddingHorizontal: 0 }}
              contentStyle={{ paddingHorizontal: 0 }}
              theme={{
                colors: {
                  background: "#fff",
                  surface: "#fff",
                  onSurfaceVariant: "#999",
                  primary: "#6e5af4",
                },
              }}
            />

            <ButtonCustom
              containerStyle={{ marginTop: 20 }}
              title="Submit"
              onPress={handleSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {showBodyLogin && (
        <AlertModal
          isVisible={showBodyLogin}
          onClose={onCloseModal}
          navigation={navigation}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioInnerCircle: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#132742",
  },
  radioText: {
    fontSize: 16,
  },
  error: {
    color: "red",
  },
});

export default ContactUsScreen;

import React, { useState } from "react";
import {
  Platform,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import StarRating from "react-native-star-rating-widget";
import { TextField } from "rn-material-ui-textfield";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, { showMessage } from "react-native-flash-message";
import Header from "../component/Header";
import { ButtonCustom } from "../component/ButtonCustom.js";
import EndUrl from "../api/EndUrl";
import reviews from "../../assets/icons/reviews.jpg";
import thumsImg from "../../assets/img/thumbs.png";
import { scale } from "react-native-size-matters";
import fonts from "../utils/fonts";
import AlertModal from "../component/AlertModal.js";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-native-safe-area-context";
const ReviewsScreen = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [showBodyLogin, setShowBodyLogin] = useState(false);

  const [ratings, setRatings] = useState({
    overall: false,
    dietService: false,
    productQuality: false,
    delivery: false,
    bloodTest: false,
  });

  const toggleRating = (key) => {
    setRatings((prev) => ({ ...prev, [key]: !prev[key] }));
    setError(""); // Clear error when toggling
  };

  const validateRatings = () => {
    return Object.values(ratings).some((value) => value);
  };

  const onCloseModal = () => {
    setShowBodyLogin(false);
  };

  const saveReview = async () => {
    const userToken = await AsyncStorage.getItem("usertoken");
    if (userToken) {
      if (!validateRatings()) {
        setError("Please select at least one service.");
        return;
      }

      try {
        console.log("TOKEN:::", userToken);
        // Prepare the payload
        const payload = {
          rating,
          rating_for: [],
          comment,
        };

        // Add selected services to the `rating_for` array
        if (ratings.overall) payload.rating_for.push("Overall Experience");
        if (ratings.dietService) payload.rating_for.push("Diet Service");
        if (ratings.productQuality) payload.rating_for.push("Product Quality");
        if (ratings.delivery) payload.rating_for.push("Delivery");
        if (ratings.bloodTest) payload.rating_for.push("Blood Test");

        // Make the API call
        const response = await fetch(EndUrl.saverating, {
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
        if (updateAvailable) {
          await AsyncStorage.setItem("updateAvailable", "true");
        }
        if (forceUpdate) {
          await AsyncStorage.setItem("forceUpdate", "true");
        }

        const json = await response.json();

        if (json.status == 200) {
          showMessage({
            message: "Thank you for submitting your review.",
            duration: 2000,
            position: "center",
            icon: (props) => <Image source={thumsImg} {...props} />,
            type: "success",
          });
          setTimeout(() => {
            navigation.replace("TabNavigators", { screen: "Home" });
          }, 2000);
        } else {
          showMessage({
            message: json.message,
            duration: 2000,
            type: "warning",
          });
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowBodyLogin(true);
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <FlashMessage />
      <Header categoryTitle="Reviews & Ratings" backButtonwithtext />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <View style={styles.contentContainer}>
            <Image source={reviews} style={styles.headerImage} />
            <Text style={styles.title}>Rate Your Experience</Text>
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <StarRating
                rating={rating}
                onChange={setRating}
                enableHalfStar={false}
              />
            </View>

            <View style={styles.ratingOptions}>
              <TouchableOpacity
                style={
                  ratings.overall ? styles.activeButton : styles.inactiveButton
                }
                onPress={() => toggleRating("overall")}
              >
                <Text
                  style={
                    ratings.overall
                      ? styles.activeButtonText
                      : styles.inactiveButtonText
                  }
                >
                  Overall Experience
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={
                  ratings.dietService
                    ? styles.activeButton
                    : styles.inactiveButton
                }
                onPress={() => toggleRating("dietService")}
              >
                <Text
                  style={
                    ratings.dietService
                      ? styles.activeButtonText
                      : styles.inactiveButtonText
                  }
                >
                  Diet Service
                </Text>
              </TouchableOpacity>
              <View style={styles.halfHolder}>
                <TouchableOpacity
                  style={[
                    ratings.productQuality
                      ? styles.activeButton
                      : styles.inactiveButton,
                    { width: "48%" },
                  ]}
                  onPress={() => toggleRating("productQuality")}
                >
                  <Text
                    style={
                      ratings.productQuality
                        ? styles.activeButtonText
                        : styles.inactiveButtonText
                    }
                  >
                    Product Quality
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    ratings.delivery
                      ? styles.activeButton
                      : styles.inactiveButton,
                    { width: "48%" },
                  ]}
                  onPress={() => toggleRating("delivery")}
                >
                  <Text
                    style={
                      ratings.delivery
                        ? styles.activeButtonText
                        : styles.inactiveButtonText
                    }
                  >
                    Delivery
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={
                  ratings.bloodTest
                    ? styles.activeButton
                    : styles.inactiveButton
                }
                onPress={() => toggleRating("bloodTest")}
              >
                <Text
                  style={
                    ratings.bloodTest
                      ? styles.activeButtonText
                      : styles.inactiveButtonText
                  }
                >
                  Blood Test
                </Text>
              </TouchableOpacity>
            </View>
            {error !== "" && <Text style={styles.errorText}>{error}</Text>}
            <TextField
              label="Write a comment"
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <ButtonCustom title="Submit" onPress={saveReview} />
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
  screenContainer: { flex: 1, backgroundColor: "white" },
  contentContainer: { padding: 15 },
  headerImage: { height: scale(180), width: "100%" },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
    fontFamily: fonts.whitneySemiBold,
  },
  ratingOptions: { alignItems: "center", marginVertical: 10 },
  halfHolder: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 10,
  },
  inactiveButton: {
    backgroundColor: "#FFF",
    marginVertical: 5,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    // borderWidth:1,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: "#132742",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  inactiveButtonText: { color: "#000", textAlign: "center" },
  activeButtonText: { color: "#FFF", textAlign: "center" },
  errorText: { color: "red", textAlign: "center", marginVertical: 5 },
});

export default ReviewsScreen;

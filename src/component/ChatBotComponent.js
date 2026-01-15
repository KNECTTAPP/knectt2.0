import { useState } from "react";
import { FlatList, Image, Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import backarrow from "../../assets/img/back.jpeg";
import checked from "../../assets/img/checked_checkbox.png";
import forwardArrow from "../../assets/img/forwardpinkarrow.png";
import unChecked from "../../assets/img/unCheck_checkbox.png";
import { Centimeter, feet, Kilograms } from "../Array/ArrayList";
import ButtonComponent from "./ButtonComponent";
import Inputtext from "./InputText";

const ChatBotComponent = ({
  countQuestion,
  message,
  count,
  id,
  value,
  onChangeText,
  select1,
  select2,
  toggleData,
  food,
  decrimentCount,
  backQuestion,
  toValue,
  ShowpopUp,
  selectedData,
  setSelectedData,
}) => {
  const [arrData, setArrData] = useState([]);
  const [msg, setMsg] = useState([]);
  const [foodData, setFoodData] = useState("");
  const [kilograms, setKilograms] = useState(Kilograms);
  const [centimeter, setCentimeter] = useState(Centimeter);
  const [feets, setFeet] = useState(feet);
  // console.log("selectedData===", selectedData)
  const handlePress = (item, index) => {
    const check = [...arrData];
    const message = [...msg];
    let megs = "";
    if (check && check[index]) {
      check[index] = false;
      const i = message.indexOf(item.data);
      message.splice(i, 1);
    } else {
      check[index] = true;
      megs = item.data;
      message.push(megs);
    }
    setMsg(message);
    setArrData(check);
    let msgString = message.toString();
    onChangeText(msgString);
  };

  const Decrease = (count, id) => {
    let decreaseCount = count - 1;
    let decreaseId = id - 1;
    backQuestion(decreaseCount, decreaseId);
  };
  const clickButton = (item) => {
    if (id === 4 && item === "cms") {
      ShowpopUp(centimeter, item);
    } else if (id == 4 && item === "feet.inch") {
      ShowpopUp(feets, item);
    } else if (id === 5) {
      ShowpopUp(kilograms, item);
    } else {
      onChangeText(item);
      console.log("press");
    }
  };
  return (
    <View
      style={[
        styles.container,
        {
          height:
            id == 9 && foodData !== "Vegeterian" && foodData !== ""
              ? "90%"
              : null,
        },
      ]}
    >
      <Text
        style={{
          color: "black",
          alignSelf: "flex-start",
          margin: 10,
          color: id === 3 ? "#F79489" : "#999999",
        }}
      >
        {message} {id === 3 && <Text style={{ fontSize: 38 }}>😃</Text>}
      </Text>
      {id == 5 && (
        <View
          style={{
            margin: 12,
            borderWidth: 0.9,
            // padding: 10,
            borderColor: "gray",
            height: 35,
            justifyContent: "center",
            borderRadius: 10,
          }}
        >
          <Text
            style={{ left: 10, color: selectedData ? "#F79489" : "#999999" }}
          >
            {selectedData ? selectedData : "Type here"}
          </Text>
        </View>
      )}
      {id === 3 || id == 9 || id == 10 || id === 2 || id === 5 ? null : (
        <View>
          <Inputtext
            placeholder={"Type here"}
            inputStyle={{ borderWidth: 0 }}
            value={id == 5 ? selectedData : value}
            inputStyle={{
              color: value != "" ? "#F79489" : "white",
              borderRadius: 10,
            }}
            onChangeText={onChangeText}
            keyboardType={id == 1 ? "numeric" : null}
            editable={
              id === 2 || id === 4 || id === 5 || id === 6 ? false : true
            }
            onPress
          />
          {id == 8 && (
            <Text style={{ color: "#F79489", marginLeft: 14 }}>
              Comma seperated, if multiple
            </Text>
          )}
        </View>
      )}

      {id === 2 || id == 4 || id == 5 ? (
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <ButtonComponent
            buttonStyle={{
              width: 100,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#999999",
              backgroundColor: select1 === value ? "#F79489" : "white",
            }}
            text={select1}
            // textStyle={{ color: (select1 === value) ? 'white' : 'black' }}
            onPress={() => clickButton(select1)}
            // textStyle={{ color: '#999999' }}
            textStyle={{
              color: select1 === value ? "white" : "#999999",
            }}
          />
          <ButtonComponent
            buttonStyle={{
              width: 100,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: "#999999",
              backgroundColor: select2 === value ? "#F79489" : "white",
            }}
            text={select2}
            // textStyle={{ color: (select2 === value) ? 'white' : 'black' }}
            onPress={() => clickButton(select2)}
            // textStyle={{ color: '#999999' }}
            textStyle={{
              color: select2 === value ? "white" : "#999999",
            }}
          />
        </View>
      ) : null}

      {(id === 11 || id === 8) && (
        <ButtonComponent
          buttonStyle={{
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "lightgray",
            backgroundColor:
              (id === 8 || id === 11) && select1 ? "#F79489" : "white",
            width: id === 8 ? 100 : null,
          }}
          text={select1}
          onPress={() => {
            id === 11 ? console.log("submit") : onChangeText(select1);
          }}
          textStyle={{ color: "white" }}
        />
      )}

      {(id === 9 || id === 10 || id === 7 || id === 6) && (
        <View>
          <FlatList
            data={food}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setFoodData(item.food), onChangeText(item.food);
                  }}
                  style={{
                    flexDirection: "row",
                    margin: 10,
                    alignItems: "center",
                    width: id !== 6 ? "55%" : "75%",
                  }}
                >
                  <Image
                    source={item.food === foodData ? checked : unChecked}
                    style={{ height: 30, width: 30, borderRadius: 25 }}
                  />
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 14,
                      color: item.food === foodData ? "#F79489" : "#999999",
                    }}
                  >
                    {item.food}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}

      {((id == 9 && foodData !== "Vegeterian" && foodData !== "") ||
        (id == 10 &&
          foodData !== "none" &&
          foodData !== "" &&
          foodData !== "Vegeterian")) && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "800",
            alignSelf: "flex-start",
            margin: 10,
            color: "#F79489",
          }}
        >
          {id == 9 ? "Eggs/Non Veg NOT allowed days" : "Pick fixed fasting Day"}
        </Text>
      )}

      {((id === 9 && foodData !== "Vegeterian" && foodData !== "") ||
        (id === 10 &&
          foodData != "none" &&
          foodData !== "" &&
          foodData !== "Vegeterian")) && (
        <FlatList
          data={toggleData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => handlePress(item, index)}
                style={{
                  flexDirection: "row",
                  margin: 10,
                  alignItems: "center",
                  width: id !== 6 ? "45%" : null,
                }}
              >
                <Image
                  source={arrData[index] ? checked : unChecked}
                  style={{ height: 30, width: 30, borderRadius: 25 }}
                />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 14,
                    color: arrData[index] ? "#F79489" : "#999999",
                  }}
                >
                  {item.data}
                </Text>
              </TouchableOpacity>
            );
          }}
          numColumns={id === 9 || id === 10 ? 2 : 1}
        />
      )}

      <View
        style={{
          color: "black",
          alignSelf: "flex-end",
          marginRight: 20,
          fontSize: 17,
          margin: 10,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <TouchableOpacity onPress={() => Decrease(count, id)}>
                    <Image
                        source={value !== "" ? forwardArrow : backarrow}
                        style={{ height: 30, width: 30, borderRadius: 25, transform: [{ rotate: value !== "" ? '180deg' : '0deg' }], }}
                        onPress={decrimentCount}

                    />
                </TouchableOpacity> */}
        <Text style={{ color: "#999999" }}>{count} of 12</Text>
        <TouchableOpacity
          disabled={value == "" && id !== 3 ? true : false}
          onPress={() => {
            countQuestion(),
              setMsg([]),
              setArrData([]),
              Keyboard.dismiss(),
              setSelectedData("");
          }}
        >
          <Image
            source={value !== "" || id === 3 ? forwardArrow : backarrow}
            style={{
              height: 30,
              width: 30,
              borderRadius: 25,
              transform: [
                { rotate: value !== "" || id === 3 ? "0deg" : "180deg" },
              ],
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: "90%",
    backgroundColor: "white",
    elevation: 10,
    borderRadius: 20,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
});
export default ChatBotComponent;

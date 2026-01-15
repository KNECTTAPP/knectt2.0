import React from "react";
import { Platform } from "react-native";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCircle,
  DollarSign,
  Download,
  MapPin,
  Menu,
  Paperclip,
  PhoneCall,
  Play,
  Search,
  Share,
  ShoppingCart,
  Trash,
  XCircle
} from "react-native-feather";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from "react-native-vector-icons/Ionicons";

export const IconShare = () => {
  return <Share style={{ height: 16, width: 16 }} color={"#132742"} />;
};

export const IconPlayCircle = () => {
  return <Play style={{ height: 16, width: 16 }} color={"#132742"} />;
};

export const IconMenu = () => {
  if (Platform.OS === "ios1") {
    return (
      <Menu
        width={30}
        height={30}
        color={"#424553"}
        style={{ paddingVertical: 20 }}
      />
    );
  }
  return (
    <Feather
      name={"menu"}
      style={{
        color: "#424553",
        width: 30,
        fontSize: 29,
        right: 2,
        backgroundColor: "white",
        fontWeight: 300,
        paddingVertical: 6,
      }}
    />
  );
};

export const IconArrowLeft = () => {
  if (Platform.OS === "ios1") {
    return (
      <ArrowLeft
        width={30}
        height={30}
        color={"#424553"}
        // style={{ paddingVertical: 20 }}
      />
    );
  }
  return (
    <Feather
      name={"arrow-left"}
      style={{
        color: "#424553",
        width: 30,
        fontSize: 20,
        right: 2,
        backgroundColor: "white",
        fontWeight: 300,
        paddingVertical: 6,
      }}
    />
  );
};

export const IconSearch = () => {
  if (Platform.OS === "ios1") {
    return (
      <Search
        color={"#424553"}
        style={{ padding: 5, paddingLeft: 20, paddingLeft: 0 }}
      />
    );
  }
  return (
    <Feather
      name={"search"}
      style={{
        color: "#424553",
        fontSize: 20,
        fontWeight: 300,
        backgroundColor: "white",
        textAlign: "right",
        padding: 5,
        paddingLeft: 20,
        paddingLeft: 0,
      }}
    />
  );
};

export const IconBell = () => {
  if (Platform.OS === "ios1") {
    return (
      <Bell
        color={"#424553"}
        height={25}
        width={25}
        style={{
          padding: 5,
          paddingHorizontal: 0,
          paddingLeft: 20,
          paddingLeft: 20,
        }}
      />
    );
  }
  return (
    <Feather
      name={"bell"}
      style={{
        color: "#424553",
        fontSize: 25,
        fontWeight: 300,
        backgroundColor: "white",
        textAlign: "right",
        padding: 5,
        paddingHorizontal: 0,
        paddingLeft: 20,
        paddingLeft: 20,
      }}
    />
  );
};

export const IconDollar = () => {
  if (Platform.OS === "ios1") {
    return (
      <DollarSign
        color={"#F79489"}
        height={20}
        width={20}
        style={{
          padding: 5,
          paddingHorizontal: 0,
          paddingLeft: 20,
          paddingLeft: 20,
        }}
      />
    );
  }
  return (
    <Feather
      name={"dollar-sign"}
      style={{
        color: "#F79489",
        fontSize: 20,
        fontWeight: 300,
        backgroundColor: "white",
        textAlign: "right",
        padding: 5,
        paddingHorizontal: 0,
        paddingLeft: 20,
        paddingLeft: 20,
      }}
    />
  );
};

export const IconPhoneCall = () => {
  if (Platform.OS === "ios1") {
    return (
      <PhoneCall
        color={"#F79489"}
        style={{
          padding: 5,
          paddingHorizontal: 0,
          paddingLeft: 20,
          paddingLeft: 20,
        }}
      />
    );
  }
  return (
    <Feather
      name={"phone-call"}
      style={{
        color: "#F79489",
        fontSize: 25,
        fontWeight: 600,
        backgroundColor: "white",
        textAlign: "right",
        padding: 5,
        paddingHorizontal: 0,
        paddingLeft: 20,
        paddingLeft: 20,
      }}
    />
  );
};

export const IconMessageCircle = () => {
  if (Platform.OS === "ios1") {
    return (
     
      <Feather name="message-circle" size={24} color="#000" />
    );
  }
  return (
    <Feather
      name={"message-circle"}
      style={{
        color: "#F79489",
        fontSize: 25,
        fontWeight: 600,
        backgroundColor: "white",
        textAlign: "right",
        padding: 5,
        paddingHorizontal: 0,
        paddingLeft: 20,
        paddingLeft: 20,
      }}
    />
  );
};

export const IconShoppingCart = () => {
  if (Platform.OS === "ios1") {
    return (
      <ShoppingCart
        color={"#F79489"}
        style={{
          padding: 5,
          paddingHorizontal: 0,
          paddingLeft: 20,
          paddingLeft: 20,
        }}
      />
    );
  }
  return (
    <Feather
      name={"shopping-cart"}
      style={{
        color: "#F79489",
        fontSize: 25,
        fontWeight: 600,
        backgroundColor: "white",
        textAlign: "right",
        padding: 5,
        paddingHorizontal: 0,
        paddingLeft: 20,
        paddingLeft: 20,
      }}
    />
  );
};

export const IconTrash = () => {
  if (Platform.OS === "ios1") {
    return <Trash color={"#F79489"} style={{ height: 15, width: 15 }} />;
  }
  return (
    <Feather
      style={{ color: "#F79489", fontWeight: "bold" }}
      name="trash-2"
      size={25}
    />
  );
};

export const IconArrowDown = () => {
  if (Platform.OS === "ios1") {
    return <ArrowDown color={"red"} />;
  }
  return <Feather name={"arrow-down"} size={30} color={"red"} />;
};

export const IconClose = () => {
  if (Platform.OS === "ios1") {
    return <XCircle color={"red"} />;
  }
  return <Feather name={"x-circle"} size={30} color={"red"} />;
};

export const IconPaperClip = () => {
  if (Platform.OS === "ios1") {
    return <Paperclip style={{ height: 16, marginRight: 5 }} color={"grey"} />;
  }
  return (
    <Feather
      name={"paperclip"}
      style={{ fontSize: 16, marginRight: 5, fontWeight: "bold" }}
    />
  );
};

export const IconIosCheckMark = () => {
  if (Platform.OS === "ios1") {
    return <CheckCircle style={{ height: 16, width: 16 }} color={"#132742"} />;
  }
  return <Ionicons name="ios-checkmark-circle" size={16} color={"#132742"} />;
};

export const IconArrowRight = ({ color }) => {
  if (Platform.OS === "ios1") {
    return <ArrowRight width={30} height={30} color={color || "#F79489"} />;
  }
  return (
    <Feather
      name={"arrow-right"}
      style={{
        color: color || "#F79489",
        width: 30,
        right: 2,
        fontSize: 20,
        fontWeight: 100,
        position: "absolute",
      }}
    />
  );
};

export const IconCheck = () => {
  if (Platform.OS === "ios1") {
    return <Check color="#424553" style={{ height: 30, width: 30 }} />;
  }
  return (
    <Feather
      name={"check"}
      style={{
        color: "#424553",
        width: 30,
        fontSize: 29,
        right: 2,
        fontWeight: 600,
        paddingVertical: 6,
      }}
    />
  );
};

export const IconMapPin = () => {
  if (Platform.OS === "ios1") {
    return <MapPin color="#000" style={{ height: 16, width: 16 }} />;
  }
  return (
    <Feather
      name="map-pin"
      size={16}
      color="#000"
      style={{ marginRight: 10 }}
    />
  );
};

export const IconDownload = () => {
  if (Platform.OS === "ios1") {
    return <Download color="#424553" style={{ height: 30, width: 30 }} />;
  }
  return (
    <Feather
      name={"download"}
      style={{
        color: "#424553",
        width: 30,
        fontSize: 29,
        right: 2,
        backgroundColor: "white",
        fontWeight: 300,
        paddingVertical: 6,
      }}
    />
  );
};

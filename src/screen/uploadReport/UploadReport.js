import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  Alert,
  Animated
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { pick, types } from "react-native-document-picker";
// import { pick, types } from '@react-native-documents/picker';
import colors from "../../utils/colors";
import fonts from "../../utils/fonts";
import ProcessingModal from "../../component/ProcessingModal";
import checkedBox from '../../assets/checkedBox.png';
import uncheckedBox from '../../assets/uncheckedBox.png';

const UploadReport = ({ navigation }) => {
  const [fileName, setFileName] = useState(null);
  const [fileUri, setFileUri] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [selectedPdf,setSelectedPdf]=useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skipUpload, setSkipUpload] = useState(false);
  const [animationText, setAnimationText] = useState("Processing...");
  const [responseData, setResponseData] = useState(null);

  // For the text animation during processing
  const animationInterval = React.useRef(null);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      if (result && result[0]) {
        setFileName(result[0].name);
        setFileUri(result[0].uri);
        setFileType(result[0].type);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled document picker");
      } else {
        console.log("Unknown error: ", err);
      }
    }
  };

  const handleUpload = async () => {
    if (!fileUri || !fileName) {
      Alert.alert("No file selected", "Please pick a file first.");
      return;
    }
    handleUploadReport();
  };

const uploadPdf = async () => {
  try {
    // Open the document picker for PDF selection
    const [selectedFile] = await pick({
      type: [types.pdf], // Only allow PDF files
      allowMultiSelection: false, // Single file selection
    });

    // Validate the file size: should be less than 10MB
    if (selectedFile.size && selectedFile.size > 10 * 1024 * 1024) {
      console.log('The file should be less than 10MB');
      return; // Early exit if the file is too large
    }

    // Check if the file is actually a PDF (even though it's already filtered by type)
    if (selectedFile.type !== 'application/pdf') {
      console.log('Selected file is not a PDF');
      return;
    }

    console.log('PDF selected:', selectedFile);
    setSelectedPdf(selectedFile); // Store the selected file

  } catch (err) {
    // Handle user cancellation (when they press the back or cancel button)
    if (err.code === 'USER_CANCELLED') {
      console.log('PDF selection cancelled');
    } else {
      // For other errors, log the error message
      console.error('PDF picker error:', err);
      // Optionally, show an alert or toast to inform the user
    }
  }
};

  const handleReplace = () => {
    setFileName(null);
    handleFilePick();
  };

  const handleUploadReport = async (file) => {
    setModalVisible(true);
    let usertoken = await AsyncStorage.getItem("usertoken");
    const postpayload = {};

    let formData = new FormData();
    formData.append("file", {
      uri: file?.uri,
      type: file?.type || "application/octet-stream",
      name: file.name,
    });

    // Start the text animation
    let counter = 0;
    animationInterval.current = setInterval(() => {
      setAnimationText(prevText => {
        const dots = ".".repeat(counter % 4);
        counter++;
        return `Processing${dots}`;
      });
    }, 500);

    try {
      const response = await fetch(endUrls.medicalhistory, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
        body: JSON.stringify(postpayload),
      });

      const json = await response.json();
      if (response.status === 200) {
        setResponseData(json);
        setShowSuccess(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      clearInterval(animationInterval.current);
      setLoading(false);
    }
  };

  const ProfileHeader = () => (
    <View style={styles.profileContainer}>
      <View style={styles.labelValueWrapper}>
        <View style={styles.labelValueItemWrapper}>
          <Text style={styles.profileLabel}>Name: </Text>
          <Text style={styles.profileText}>Ankush Kumar</Text>
        </View>
        <View style={styles.labelValueItemWrapper}>
          <Text style={styles.profileLabel}>Email: </Text>
          <Text style={styles.profileText}>akvashist98@gmail.com</Text>
        </View>
      </View>
      <View style={styles.labelValueWrapper}>
        <View style={styles.labelValueItemWrapper}>
          <Text style={styles.profileLabel}>Age: </Text>
          <Text style={styles.profileText}>27</Text>
        </View>
        <View style={styles.labelValueItemWrapper}>
          <Text style={styles.profileLabel}>Gender: </Text>
          <Text style={styles.profileText}>Male</Text>
        </View>
      </View>
    </View>
  );

  const renderTableData = () => {
    return responseData?.data?.map(item => (
      <View style={styles.tableRow} key={item.id}>
        <Text style={styles.tableCell}>{item.test_name}</Text>
        <Text style={styles.tableCell}>{item.value}</Text>
        <Text style={styles.tableCell}>{item.range}</Text>
      </View>
    ));
  };

  const renderAIData = () => (
    <View style={styles.aiDataContainer}>
      <Text style={styles.aiDataTitle}>Predictions:</Text>
      <Text style={styles.aiDataText}>{responseData?.ai_data?.predictions}</Text>
      <Text style={styles.aiDataTitle}>Things to Avoid:</Text>
      <Text style={styles.aiDataText}>{responseData?.ai_data?.thingsToAvoid}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <View style={{ flex: 1, margin: 20, marginTop: 50 }}>
        {!fileName ? (
          <View style={styles.uploadBox}>
            <Image
              source={require('../../assets/bgRemovedLogo.png')}
              resizeMode="contain"
              style={{ width: 80, height: 80, marginBottom: 10 }}
            />
            <Text style={styles.uploadTitle}>
              Upload your latest{"\n"}blood test report here
            </Text>
            <Text style={styles.description}>
              Ensure test report is less than 90 days.
            </Text>

            <View style={styles.checkboxRow}>
              <TouchableOpacity onPress={() => setSkipUpload(!skipUpload)}>
                {skipUpload ? (
                  <Image source={checkedBox} style={{ width: 30, height: 30 }} />
                ) : (
                  <Image source={uncheckedBox} style={{ width: 30, height: 30 }} />
                )}
              </TouchableOpacity>
              <Text style={styles.skipText}>
                I want to proceed without uploading my blood test reports.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.uploadButton, !fileName && { backgroundColor: "#ccc" }]}
              onPress={uploadPdf}
            >
              <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.fileBox}>
            <View style={styles.fileNameBox}>
              <Text style={styles.fileName}>{fileName}</Text>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionButton} onPress={handleReplace}>
                <Text style={styles.actionButtonText}>Replace</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={(uploadPdf)}>
                <Text style={styles.actionButtonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {loading && (
        <Text style={styles.loadingText}>{animationText}</Text>
      )}

      {responseData && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>User Details</Text>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.tableHeader}>Test</Text>
            <Text style={styles.tableHeader}>Value</Text>
            <Text style={styles.tableHeader}>Reference Range</Text>
          </View>
          {renderTableData()}
          {renderAIData()}
        </View>
      )}

      <ProcessingModal visible={modalVisible} showSuccess={showSuccess} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  uploadBox: {
    alignItems: "center",
  },
  uploadTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.themeColor,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: fonts.whitneySemiBold,
  },
  description: {
    fontSize: 16,
    color: colors.themeColor,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: fonts.whitneyMedium,
    width: "100%",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 50,
  },
  skipText: {
    color: "green",
    marginLeft: 10,
    fontSize: 14,
    flexShrink: 1,
    fontFamily: fonts.whitneyMedium,
  },
  uploadButton: {
    backgroundColor: colors._eeeeee,
    paddingVertical: 13,
    paddingHorizontal: 45,
    borderRadius: 5,
    marginTop: 50,
  },
  uploadButtonText: {
    color: colors.themeColor,
    fontSize: 16,
    fontFamily: fonts.whitneySemiBold,
  },
  fileBox: {
    marginTop: 30,
  },
  fileNameBox: {
    padding: 15,
    backgroundColor: colors._eeeeee,
    marginBottom: 15,
    borderRadius: 5,
  },
  fileName: {
    fontFamily: fonts.whitneyMedium,
    fontSize: 18,
    color: colors.black,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    backgroundColor: colors.themeColor,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  actionButtonText: {
    fontFamily: fonts.whitneySemiBold,
    color: colors.white,
    fontSize: 16,
  },
  tableHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.lightGray,
    padding: 10,
  },
  tableHeader: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.darkGray,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  tableCell: {
    fontSize: 14,
    color: colors.black,
  },
  aiDataContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: colors._eeeeee,
    borderRadius: 5,
  },
  aiDataTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.themeColor,
    marginBottom: 5,
  },
  aiDataText: {
    fontSize: 14,
    color: colors.black,
  },
  loadingText: {
    fontSize: 18,
    color: colors.themeColor,
    textAlign: "center",
    marginTop: 20,
  },
  profileContainer: {
    marginTop: 20,
    marginBottom: 15,
    padding: 20,
  },
  labelValueWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  labelValueItemWrapper: {
    flexDirection: "row",
    flex: 1,
    marginBottom: 10,
  },
  profileLabel: {
    fontFamily: fonts.whitneySemiBold,
    fontSize: 16,
    color: colors.darkGray,
  },
  profileText: {
    fontFamily: fonts.whitneyMedium,
    fontSize: 16,
    color: colors.black,
  },
});

export default UploadReport;

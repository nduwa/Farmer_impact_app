import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import { ToastAndroid } from "react-native";
import { Asset } from "expo-asset";

const displayToast = (msg) => {
  ToastAndroid.show(msg, ToastAndroid.SHORT);
};

const getFileExtension = async (uri) => {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  const uriParts = fileInfo.uri.split(".");
  return uriParts[uriParts.length - 1];
};

const generateFileName = () => {
  const timestamp = Math.floor(Date.now() / 1000);
  return `wetmillaudit-report-${timestamp}`;
};

const saveFile = async (uri) => {
  try {
    const fileExt = await getFileExtension(uri);
    const fileName = generateFileName();
    const fileNameFull = `${fileName}.${fileExt}`; // You can customize the file name and extension here
    const directory = `${FileSystem.documentDirectory}rtc_app/wetmill/`;

    // Check if the directory exists, if not, create it
    if (!directory.exists) {
      await FileSystem.makeDirectoryAsync(directory, {
        intermediates: true,
      });
    }

    const fileUri = `${directory}${fileNameFull}`;

    await FileSystem.moveAsync({
      from: uri,
      to: fileUri,
    });

    displayToast("file saved");
    console.log("file saved to:", fileUri);
  } catch (error) {
    displayToast("Error: file not saved");
    console.error("Error saving file:", error);
  }
};

const uritoBase64 = async (uri) => {
  const data = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const imageData = `data:image/png;base64,${data}`;

  return imageData;
};

export const prepareReportFile = async (
  auditData,
  stationName,
  date,
  setCompleted
) => {
  const hmtlString = `
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
    />
    <title>Wet Mill Audit</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
      }
      h1 {
        text-align: center;
        color: #864100;
        margin-bottom: 40px;
      }
      .section {
        margin-bottom: 40px;
      }
      .section-title {
        font-size: 20px;
        color: #864100;
        border-bottom: 2px solid #864100;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      .section-content {
        font-size: 16px;
        color: #555;
        margin-bottom: 20px;
      }
      .question {
        font-weight: bold;
        margin-bottom: 10px;
      }
      .answer {
        margin-bottom: 20px;
        padding-left: 20px;
      }
      .header {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        margin-bottom: 50px;
      }

      .details {
        display: flex;
        flex-direction: column;
      }
      .details label {
        font-size: 15px;
        font-weight: 600;
      }
      .logo {
        height: 120px;
        width: 120px;
      }
      .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 50%;
        border: none;
        border-bottom: solid 1px #6c4b02;
      }
      .row .attr {
        font-weight: 400;
      }
      .row .val {
        font-weight: 500;
        color: black !important;
      }
      .highlight {
        font-weight: 700 !important;
        color: #6c4b02;
      }
      .wide {
        width: 70% !important;
      }
      .img-op {
        max-height: 250px;
        border: solid transparent;
        border-radius: 20px;
      }
      .four-pictures {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        column-gap: 8px;
        row-gap: 8px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img
          src="${Asset.fromModule(require("../data/images/rtclogo.png")).uri}"
          alt="logo"
          class="logo"
        />
        <div class="details">
          <label>Rwanda Trading Company</label>
          <label>Kigali, Masoro, PEZ Phase I</label>
          <label>Wet Mill Audit Report</label>
          <label>${date}</label>
        </div>
      </div>
      <h1>REPORT - ${stationName} - ${date}</h1>

      <!-- Section 1 -->
      <div class="section">
        <div class="section-title">INVENTORY MANAGEMENT</div>
        <div class="section-content">
          <div class="row">
            <label class="attr">Cheeries reported</label>
            <label class="val">${parseFloat(
              auditData?.cherries_sms
            ).toLocaleString()} kgs</label>
          </div>
          <div class="row">
            <label class="attr">Cheeries in books</label>
            <label class="val">${parseFloat(
              auditData?.cherries_books
            ).toLocaleString()} kgs</label>
          </div>
          <div class="row">
            <label class="attr highlight">Discrepancy</label>
            <label class="val highlight">${parseFloat(
              auditData?.discrepancy_kgs_cherries
            ).toLocaleString()} kgs(${
    auditData?.discrepancy_perc_cherries
  }%)</label>
          </div>
        </div>

        <div class="section-content">
          <div class="row">
            <label class="attr">Parchment in theory</label>
            <label class="val">${parseFloat(
              auditData?.parch_theory
            ).toLocaleString()} kgs</label>
          </div>
          <div class="row">
            <label class="attr">Parchment delivered to Kigali</label>
            <label class="val">${parseFloat(
              auditData?.parch_delivered
            ).toLocaleString()} kgs</label>
          </div>
          <div class="row">
            <label class="attr">Parchment in storehouse</label>
            <label class="val">${parseFloat(
              auditData?.parch_storehouse
            ).toLocaleString()} kgs</label>
          </div>
          <div class="row">
            <label class="attr">Parchment in tanks</label>
            <label class="val">${parseFloat(
              auditData?.parch_tanks
            ).toLocaleString()} kgs</label>
          </div>
          <div class="row">
            <label class="attr">Parchment on tables</label>
            <label class="val">${parseFloat(
              auditData?.parch_tables
            ).toLocaleString()} kgs</label>
          </div>
          <div class="row">
            <label class="attr highlight">Discrepancy</label>
            <label class="val highlight">${parseFloat(
              auditData?.discrepancy_kgs_parch
            ).toLocaleString()} kgs(${
    auditData?.discrepancy_perc_parch
  }%)</label>
          </div>
        </div>

        <div class="section-content">
          <div class="row">
            <label class="attr">Volumetric Participant</label>
            <label class="val">${auditData?.vol_participant}</label>
          </div>
          <div class="row">
            <label class="attr">Buckets in theory</label>
            <label class="val">${parseFloat(
              auditData?.buckets_theory
            ).toLocaleString()}</label>
          </div>
          <div class="row">
            <label class="attr">Actual buckets</label>
            <label class="val">${parseFloat(
              auditData?.buckets_actual
            ).toLocaleString()}</label>
          </div>
          <div class="row">
            <label class="attr highlight">Discrepancy</label>
            <label class="val highlight">${parseFloat(
              auditData?.discrepancy_buckets_pricing
            ).toLocaleString()}(${auditData?.discrepancy_perc_pricing}%)</label>
          </div>
        </div>
      </div>

      <!-- Section 2 -->
      <div class="section">
        <div class="section-title">MONEY MANAGEMENT</div>
        <div class="section-content">
          <div class="row">
            <label class="attr">STD Price</label>
            <label class="val">${parseFloat(
              auditData?.std_price
            ).toLocaleString()} RWF</label>
          </div>
          <div class="row">
            <label class="attr">STD total paid</label>
            <label class="val">${parseFloat(
              auditData?.std_total_paid
            ).toLocaleString()} RWF</label>
          </div>
          <div class="row">
            <label class="attr">Expected STD cherries</label>
            <label class="val">${parseFloat(
              auditData?.expected_std_cherries
            ).toLocaleString()} kgs</label>
          </div>
          <div class="row">
            <label class="attr highlight">Discrepancy</label>
            <label class="val highlight">${parseFloat(
              auditData?.discrepancy_kgs_expenses
            ).toLocaleString()}(${
    auditData?.discrepancy_perc_expenses
  }%)</label>
          </div>
        </div>

        <div class="section-content">
          <div class="row">
            <label class="attr">STD salary expense</label>
            <label class="val">${parseFloat(
              auditData?.std_salary_expense
            ).toLocaleString()} RWF</label>
          </div>
          <div class="row">
            <label class="attr">STD fuel expense</label>
            <label class="val">${parseFloat(
              auditData?.std_fuel_expense
            ).toLocaleString()} RWF</label>
          </div>
          <div class="row">
            <label class="attr">STD other expense</label>
            <label class="val">${parseFloat(
              auditData?.std_other_expense
            ).toLocaleString()} RWF</label>
          </div>
        </div>
        <div class="section-content">
          <div class="row wide">
            <label class="attr">Manpower count today</label>
            <label class="val">${parseFloat(
              auditData?.manpower_count
            ).toLocaleString()}</label>
            <label class="attr">Parch / Person / Day</label>
            <label class="val">${parseFloat(
              auditData?.parch_person_day_manpower
            ).toLocaleString()} kgs</label>
          </div>
          <div class="row wide">
            <label class="attr">Handsorter count today</label>
            <label class="val">${parseFloat(
              auditData?.handsorter_count
            ).toLocaleString()}</label>
            <label class="attr">Parch / Person / Day</label>
            <label class="val">${parseFloat(
              auditData?.parch_person_day_handsorter
            ).toLocaleString()} kgs</label>
          </div>
        </div>
      </div>

      <!-- Repeat for Sections 3, 4, and 5 -->
      <div class="section">
        <div class="section-title">STATE OF OPERATIONS</div>
        <div class="section-content">
          <div class="question">Leftover beans in machine?</div>
          <div class="answer">> ${auditData?.leftover_beans}</div>
          <div class="answer">
            > ${auditData?.leftover_comment}
          </div>
          <img
            src="${await uritoBase64(auditData?.leftover_photo)}"
            alt="leftoverbeans"
            class="img-op"
          />
        </div>
        <div class="section-content">
          <div class="question">Quality of Water</div>
          <div class="answer">> ${auditData?.water_quality}</div>
          <div class="answer">> ${auditData?.water_quality_comment}</div>
          <img
            src="${await uritoBase64(auditData?.water_quality_photo)}"
            alt="waterquality"
            class="img-op"
          />
        </div>
        <div class="section-content">
          <div class="question">Water Sufficient?</div>
          <div class="answer">> ${auditData?.water_suffient}</div>
          <div class="answer">> ${auditData?.water_suffient_comment}</div>
          <img
            src="${await uritoBase64(auditData?.water_suffient_photo)}"
            alt="watersufficient"
            class="img-op"
          />
        </div>
        <div class="section-content">
          <div class="question">Color / Smell Coffee in Tanks</div>
          <div class="answer">> ${auditData?.color_smell_tanks}</div>         
          <img
            src="${await uritoBase64(auditData?.color_smell_tanks_photo)}"
            alt="colorsmell"
            class="img-op"
          />
        </div>
        <div class="section-content">
          <div class="question">Parchment Appearance</div>
          <div class="answer">> ${auditData?.parchment_appearance}</div>
          <img
            src="${await uritoBase64(auditData?.parchment_appearance_photo)}"
            alt="appearance"
            class="img-op"
          />
        </div>
        <div class="section-content">
          <div class="question">Drying Congestion</div>
          <div class="answer">> ${auditData?.drying_congestion}</div>
          <div class="answer">
            > ${auditData?.drying_congestion_comment}
          </div>
          <img
            src="${await uritoBase64(auditData?.drying_congestion_photo1)}"
            alt="congestion"
            class="img-op"
          />
        </div>
      </div>

      <div class="section">
        <div class="section-title">ON-SITE IMAGES</div>
        <div class="section-content">
          <div class="four-pictures">
            <img
              src="${await uritoBase64(auditData?.siteImages[0])}"
              alt="siteImage1"
              class="img-op"
            /><img
              src="${await uritoBase64(auditData?.siteImages[1])}"
              alt="siteImage2"
              class="img-op"
            /><img
              src="${await uritoBase64(auditData?.siteImages[2])}"
              alt="siteImage3"
              class="img-op"
            /><img
              src="${await uritoBase64(auditData?.siteImages[3])}"
              alt="siteImage4"
              class="img-op"
            />
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">APPROVAL DECISION</div>
        <div class="section-content">
          <div class="answer">> ${auditData?.approve}</div>
          <div class="answer">
            > ${auditData?.approve_comment}
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;

  printToFile(hmtlString, setCompleted);
};
export const printToFile = async (html, setCompleted) => {
  const { uri } = await Print.printToFileAsync({ html });
  if (uri) {
    saveFile(uri);
    setCompleted(true);
  }
};

/**
 * ========================================================================
 * Google Apps Script Backend - Computer Vision Webinar Integration
 * Organization: TAITS TECH
 * Purpose: Expose an API to capture registration data & upload screens to Drive
 * ========================================================================
 */

// Global configuration details
const GOOGLE_SHEET_NAME = "Sheet1";
const DRIVE_FOLDER_NAME = "Webinar Payments Screenshot";

/**
 * Handle incoming HTTP POST requests from the front-end fetch API.
 * Google Apps Script requires incoming cross-origin payloads to run under doPost(e).
 * Plain text header avoids preflight request blocks on custom headers.
 */
function doPost(e) {
  try {
    // Parse the incoming JSON string payload
    const data = JSON.parse(e.postData.contents);
    
    // Open the Active Spreadsheet and get the Sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(GOOGLE_SHEET_NAME) || 
                  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
                  
    // Ensure sheet headers exist if the sheet is completely empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Timestamp", "Name", "Email", "Mobile", "WhatsApp", 
        "Institution", "District", "State", "Profession", 
        "Subject", "Teaching Experience", "AI Familiarity", "Transaction ID", 
        "Screenshot URL", "Source", "Future Updates", "Status"
      ];
      sheet.appendRow(headers);
      // Format headers bold
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f1f5f9");
    }

    // Process payment screenshot base64 file upload if provided
    let screenshotUrl = "No Upload";
    if (data.screenshotBase64 && data.screenshotBase64.includes("base64,")) {
      try {
        screenshotUrl = uploadScreenshotToDrive(data.screenshotBase64, data.screenshotName, data.name);
      } catch (fileError) {
        Logger.log("Drive Upload Error: " + fileError.toString());
        screenshotUrl = "Drive Error: " + fileError.toString();
      }
    }

    // Construct the new row array matching the spreadsheet column layout
    const newRow = [
      data.timestamp || new Date().toISOString(),
      data.name,
      data.email,
      data.mobile,
      data.whatsapp,
      data.institution,
      data.district,
      data.state,
      data.profession,
      data.subject || "N/A",
      data.experience || "N/A",
      data.aiExperience,
      data.transactionId,
      screenshotUrl,
      data.source || "Direct",
      data.updates || "No",
      data.status || "Pending Verification"
    ];

    // Append the row to Google Sheets
    sheet.appendRow(newRow);

    // Return successful JSON output
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Registration logged successfully!"
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*"); // Allow CORS requests

  } catch (error) {
    // Return failed error output
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Server script error: " + error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
  }
}

/**
 * Decodes the base64 image data string and uploads it to a dedicated folder in Google Drive.
 * Generates a public shareable view link for administrative review.
 */
function uploadScreenshotToDrive(base64Data, originalFileName, registrantName) {
  // Locate or dynamically create the target folder in Google Drive
  let folder;
  const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
  }

  // Extract pure raw base64 data bytes from standard dataUri string
  const base64Parts = base64Data.split("base64,");
  const contentType = base64Parts[0].split(":")[1].split(";")[0];
  const decodedBytes = Utilities.base64Decode(base64Parts[1]);
  
  // Format target file name: "[Name]_[Timestamp]_[OriginalName]"
  const formattedTimestamp = Utilities.formatDate(new Date(), "GMT+5:30", "yyyy-MM-dd_HH-mm-ss");
  const fileName = registrantName.replace(/\s+/g, '_') + "_" + formattedTimestamp + "_" + (originalFileName || "payment_screenshot.jpg");

  // Create file blob in Drive folder
  const fileBlob = Utilities.newBlob(decodedBytes, contentType, fileName);
  const file = folder.createFile(fileBlob);
  
  // Set permissions so the file link is shareable/viewable by the administrator review team
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  return file.getUrl(); // Returns the direct view link
}

/**
 * Handle HTTP GET requests - useful for simple API connectivity status testing.
 */
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "Google Apps Script API endpoint is online and functioning."
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeader("Access-Control-Allow-Origin", "*");
}

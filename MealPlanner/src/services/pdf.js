import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export const generatePDF = async (data) => {
  const { name, disease, stage, personalDetails, nutritionalAnalysis, foodLogs, progressTracking, feedback } = data;

  const htmlContent = `
    <h1>Report Plan</h1>
    <h2>Patient Details</h2>
    <p>Name: ${name}</p>
    <p>Disease: ${disease}</p>
    <p>Stage: ${stage.name}</p>
    <p>Description: ${stage.description}</p>
    <h2>Nutritional Analysis</h2>
    <table border="1" style="width: 100%; text-align: left; border-collapse: collapse;">
      <tr>
        <th style="padding: 8px; border: 1px solid black;">Day</th>
        <th style="padding: 8px; border: 1px solid black;">Calories</th>
        <th style="padding: 8px; border: 1px solid black;">Protein</th>
        <th style="padding: 8px; border: 1px solid black;">Carbs</th>
        <th style="padding: 8px; border: 1px solid black;">Fats</th>
      </tr>
      ${nutritionalAnalysis
        .map(
          (data) => `
          <tr>
            <td style="padding: 8px; border: 1px solid black;">${data.day}</td>
            <td style="padding: 8px; border: 1px solid black;">${data.calories}</td>
            <td style="padding: 8px; border: 1px solid black;">${data.protein}</td>
            <td style="padding: 8px; border: 1px solid black;">${data.carbs}</td>
            <td style="padding: 8px; border: 1px solid black;">${data.fats}</td>
          </tr>
        `
        )
        .join("")}
    </table>
    <h2>Food Logs</h2>
    <ul>
      ${foodLogs
        .map((log) => `<li>${log.meal}: ${log.item} (${log.portion}) - ${log.calories} kcal</li>`)
        .join("")}
    </ul>
    <h2>Progress Tracking</h2>
    <p>Weight: ${progressTracking.weight.join(", ")} (kg)</p>
    <p>Blood Pressure: ${progressTracking.bloodPressure.join(", ")} (mmHg)</p>
    <p>Sugar Level: ${progressTracking.sugarLevel.join(", ")} (mg/dL)</p>
    <h2>User Feedback</h2>
    <p>${feedback}</p>
  `;

  try {
    // Generate PDF from HTML
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      fileName: "ReportPlan.pdf",
    });

    // Check if sharing is available, and share the PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      alert("Sharing is not available on this device");
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

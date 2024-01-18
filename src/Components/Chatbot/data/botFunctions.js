import Papa from 'papaparse';
import diseaseFile from './disease.csv';
import { getRandomAlternativeResponse } from './botMessagesHandle';

export async function readDiseaseDataFromCsv(disease) {
  try {
    const response = await fetch(diseaseFile);
    const csvData = await response.text();

    const parsedData = Papa.parse(csvData, { header: true });
    const rows = parsedData.data;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const diseaseFromCsv = row['Disease'];

      if (diseaseFromCsv.toLowerCase() === disease.toLowerCase()) {
        const symptoms = row['Symptoms'];
        const precautions = row['Precautions'];
        const drugs = row['Drugs'];

        const message = `<table class="bot-table">
        <tr class="bot-row"><td><b>Disease:</b></td><td>${disease}</td></tr>
        <tr class="bot-row"><td><b>Symptoms:</b></td><td>${symptoms.replace(/-/g, ',')}</td></tr>
        <tr class="bot-row"><td><b>Precautions:</b></td><td>${precautions.replace(/-/g, ',')}</td></tr>
        <tr class="bot-row"><td><b>Drugs:</b></td><td>${drugs.replace(/-/g, ',')}</td></tr>
      </table>`;

        return {
          text: message,
          delay: 2500,
          typing: `Searching for details about ${disease}...`
        };
      }
    }

    return {
      text: getRandomAlternativeResponse([
        "Hmmm... I couldn't find information for that disease. 😕 Please try selecting from the given options.",
        "Please try selecting from the provided options as I couldn't find data for the specified disease. 🤔"]
      )
    };

  } catch (error) {
    console.error('Error loading the Data:', error);
    return { text: 'Error loading the Data.' };
  }
}

export async function recommendDiseases(inputText) {
  try {
    const response = await fetch(diseaseFile);
    if (!response.ok) {
      throw new Error(`Failed to fetch disease data. Status: ${response.status}`);
    }
    const csvData = await response.text();
    const parsedData = Papa.parse(csvData, { header: true });
    const rows = parsedData.data;

    const recommendedDiseases = rows
      .filter(row => row['Disease'].toLowerCase().includes(inputText))
      .map(row => row['Disease']);

    if (recommendedDiseases.length > 0) {
      return { disease: recommendedDiseases };
    } else {
      return {
        message: getRandomAlternativeResponse([
          "Hmmm... I couldn't find information for that disease. 😕 Please try selecting from the given options.",
          "Please try selecting from the provided options as I couldn't find data for the specified disease. 🤔",
        ]),
      };
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
}

export async function readDiseaseTableCsv(disease) {
  try {
    const response = await fetch(diseaseFile);
    const csvData = await response.text();

    const parsedData = Papa.parse(csvData, { header: true });
    const rows = parsedData.data;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const diseaseFromCsv = row['Disease'];

      if (diseaseFromCsv.toLowerCase() === disease.toLowerCase()) {
        const symptoms = row['Symptoms'];
        const precautions = row['Precautions'];
        const drugs = row['Drugs'];

        return {
          name: diseaseFromCsv,
          symptoms,
          precautions,
          drugs,
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error loading the Data:', error);
    return null;
  }
}
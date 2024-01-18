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
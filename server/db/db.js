import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Путь к файлу JSON DB
const dbFilePath = join(__dirname, 'db.json');

// Функция для чтения данных из JSON DB
export const readDB = () => {
    try {
        const data = readFileSync(dbFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading DB:', error);
        return { devices: {} };
    }
}

// Функция для записи данных в JSON DB
export const writeDB = (data) => {
    try {
        writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing DB:', error);
    }
}


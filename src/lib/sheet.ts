import { GoogleSheetService } from 'google-sheet-crud';

const client_email = process.env.GOOGLE_CLIENT_EMAIL!;
const private_key = process.env.GOOGLE_PRIVATE_KEY!;

const credentials = {
  client_email,
  private_key: private_key.replace(/\\n/g, '\n'),
};

const sheetService = new GoogleSheetService(credentials);

const sheetId = process.env.SPREADSHEET_ID!;

export class Sheet {
  static async create(range: string, data: any) {
    return await sheetService.create({ sheetId, range, data });
  }

  static async read(range: string) {
    return await sheetService.get({ sheetId, range });
  }

  static async update(range: string, id: number, data: any) {
    return await sheetService.update({ sheetId, range, data, id });
  }

  static async delete(range: string, id: number) {
    return await sheetService.delete({
      sheetId,
      range,
      id,
    });
  }
}

export const SHEET_RANGE = {
  summary: 'SUMMARY!A1:X',
  ds: 'DS!A1:J',
  ns: 'NS!A1:J',
  fuel: 'FUEL!A1:G',
  plant: 'PLANT!A1:G',
  user: 'USER!A1:C',
  errorLog: 'ERROR!A1:D',
  asset: 'ASSET!A1:L',
};

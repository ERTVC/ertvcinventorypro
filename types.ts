

export enum UnitType {
  PCS = 'pcs',
  KGS = 'kgs',
}

export enum RecipientType {
  TRAINEE = 'Trainee',
  TRAINER = 'Trainer',
  NON_TEACHING_STAFF = 'Non-teaching Staff',
  HOD = 'HOD',
  DP_ACADEMICS_OFFICE = 'DP Academics Office',
  PRINCIPALS_OFFICE = 'Principals Office',
  EXAMINATION_OFFICE = 'Examination Office',
  ACCOUNTS_OFFICE = 'Accounts Office',
  PROCUREMENT_OFFICE = 'Procurement Office',
  DP_ADMINISTRATION_OFFICE = 'DP Administration Office',
  KITCHEN = 'Kitchen',
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
  category: string;
  dateAdded: string;
  unit: UnitType;
  isAsset: boolean;
  department: string;
}

export interface IssueRecord {
  id:string;
  itemId: string;
  itemName: string;
  quantityIssued: number;
  recipientName: string;
  recipientType: RecipientType;
  dateIssued: string;
  unit: UnitType;
  returnDate?: string;
}

export interface Recipient {
  id: string;
  name: string;
  identifier: string; // Admission or ID number
  type: RecipientType;
}

export enum Page {
    DASHBOARD = 'Dashboard',
    INVENTORY = 'Inventory',
    ISSUE_LOG = 'Issue Log',
    RECIPIENTS = 'Recipients',
}
declare const React: any;
declare const ReactDOM: any;
declare const useState: any;
declare const useEffect: any;
declare const generateInvoiceHTML: any;

declare function require(moduleName: string): any;

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}

interface Window {
  Icons: Record<string, any>;
  Header: any;
  Sidebar: any;
  GroupedTypeSelector: any;
  GroupedClientSelector: any;
  InputModal: any;
  CustomPopup: any;
  InvoicePage: any;
  PaymentHistoryPage: any;
  SettingsPage: any;
  PrintView: any;
  SavedFilesPage: any;
  loadInvoiceTemplate: any;
  getDefaultInvoiceTemplate: any;
  generateInvoiceHTML: any;
  Calculations: any;
  FileOperations: any;
  GroupManagement: any;
  AppStorage: any;
}

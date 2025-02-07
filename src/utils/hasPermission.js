import store from "store";

export const ACCESS = {
  READ: "read",
  WRITE: "edit",
  DELETE: "delete",
};

export const MODULE = {
  SUBUSERS: "sub-user",
  COMPANY: "company",
  PHYSICIAN: "physician",
  PATIENT: "patient",
  STAFF: "staff",
  PROVIDER: "provider",
  SERVICEORDER: "service-order",
  DElIVERYRECEIPT: "delivery-receipt",
  MEDICALNECESSITY: "medical-necessity",
  ECOMORDER: "ecom-order",
  CANCELREQUEST: "cancel-request",
  CATEGORIES: "categories",
  PRODUCTS: "products",
  CUSTOMERS: "customers",
  CODES: "codes",
  COUPONS: "coupons",
  INSURANCES: "insurance",
  TYPESOFDEVICES: "types-of-devices",
  LOCATIONS: "locations",
  USERFEEDBACK: "users-feedback",
  CONTACTQUERIES: "contact-queries",
  NOTIFICATION: "notification",
  STOCKENTRY: "stock-entry"
};
/**
 *
 * @param {*} columns
 * @param {*} module
 * @param {*} type
 * @returns
 */
export const newColumn = (columns, module, type) => {
  let newColumn1 = [];
  if (
    !hasPermisson(module, ACCESS.DELETE) &&
    !hasPermisson(module, ACCESS.WRITE) &&
    type === 1
  ) {
    newColumn1 = columns?.filter((col, index) => {
      return index !== 4 && index !== 5;
    });
  } else if (
    (!hasPermisson(module, ACCESS.DELETE) && type === 2) ||
    (!hasPermisson(module, ACCESS.DELETE) &&
      !hasPermisson(module, ACCESS.WRITE) &&
      type === 3) ||
    (!hasPermisson(module, ACCESS.WRITE) && type === 4)
  ) {
    newColumn1 = columns?.filter((col, index) => {
      return index !== 0;
    });
  } else if (!hasPermisson(module, ACCESS.WRITE) && type === 1) {
    newColumn1 = columns?.filter((col, index) => {
      return index !== 5;
    });
  } else {
    newColumn1 = columns;
  }
  return newColumn1;
};

export const userColumn = (columns, module, type) => {
  let newColumn1 = [];
  if (
    !hasPermisson(module, ACCESS.DELETE) &&
    !hasPermisson(module, ACCESS.WRITE)
  ) {
    newColumn1 = columns?.filter((col, index) => {
      return index !== 6 && index !== 7;
    });
  } else if (!hasPermisson(module, ACCESS.WRITE)) {
    newColumn1 = columns?.filter((col, index) => {
      return index !== 6;
    });
  } else {
    newColumn1 = columns;
  }
  return newColumn1;
};

export const userActionMenu = (module, buttons) => {
  let newButtons = [];
  if (!hasPermisson(module, ACCESS.DELETE)) {
    newButtons = buttons.slice(0, 2);
  } else if (!hasPermisson(module, ACCESS.WRITE)) {
    newButtons = buttons.slice(2, 3);
  } else {
    newButtons = buttons;
  }
  return newButtons;
};
const hasPermisson = (module, access) => {

  // console.log("module", module, "access", access);
  
  const { roles, superAdmin } = store?.getState()?.auth?.user;

  if (superAdmin) {
    return true;
  }

  const check = roles?.find((x) => x.name === module);
  if (check?.[access]) {
    return true;
  }
  return false;
};

export default hasPermisson;

export const getFormattedPhoneNum = (text) => {
  var cleaned = ("" + text).replace(/\D/g, "");
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? "+1 " : "",
      number = [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join(
        ""
      );
    return number;
  }
};

export function formatAsSSN(input) {
  const numericValue = input.replace(/\D/g, "");
  const formattedSSN = numericValue.replace(
    /^(\d{3})(\d{2})(\d{4})$/,
    "$1-$2-$3"
  );

  return formattedSSN;
}

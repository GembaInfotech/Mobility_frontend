import { Input } from "components/ui";
export const PRODUCTS_FIELDS1 = [
  {
    name: "sku",
    label: "Product ID (SKU)",
    type: "text",
    component: Input,
    placeholder: "Enter SKU",
  },
  {
    name: "name",
    label: "Product Name",
    type: "text",
    component: Input,
    placeholder: "Enter Name",
  },
  {
    name: "description",
    label: "Product Description",
    type: "text",
    component: Input,
    placeholder: "Enter Description",
    textArea: true,
  },

  {
    name: "price",
    label: "Product Price in ($)",
    type: "number",
    component: Input,
    placeholder: "Enter Price",
  },
  {
    name: "totalQuantity",
    label: "Total Quantity",
    type: "number",
    component: Input,
    placeholder: "Enter Total Quantity",
  },
];
export const PRODUCTS_FIELDS2 = [
  {
    name: "material",
    label: "Material (Add multiple material with comma separate)",
    type: "text",
    component: Input,
    placeholder: "Enter Material",
  },

  {
    name: "color",
    label: "Color (Add multiple color with comma separate)",
    type: "text",
    component: Input,
    placeholder: "Enter Color",
  },
  {
    name: "instructions",
    label: "Care of Instructions",
    type: "text",
    component: Input,
    placeholder: "Enter Instructions",
    textArea: true,
  },

  {
    name: "country",
    label: "Country of Origin",
    type: "text",
    component: Input,
    placeholder: "Enter Country",
  },
  {
    name: "additionalInfo",
    label: "Additional Information",
    type: "text",
    component: Input,
    placeholder: "Enter Additional Information",
    textArea: true,
  },
  {
    name: "manufacture",
    label: "Manufacture",
    type: "text",
    component: Input,
    placeholder: "Enter Manufacture",
  },
  {
    name: "weight",
    label: "Product Weight",
    type: "text",
    component: Input,
    placeholder: "Enter Weight",
  },
  {
    name: "dimensions",
    label: "Dimensions",
    type: "text",
    component: Input,
    placeholder: "Enter Dimensions",
  },
  {
    name: "shippingCharge",
    label: "Shipping Charge in US $",
    type: "number",
    component: Input,
    placeholder: "Enter Shipping Charge",
  },
];

export const ADMINS_FIELDS = [
  {
    name: "name",
    label: "Name",
    type: "text",
    component: Input,
    placeholder: "Enter Name",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    component: Input,
    placeholder: "Enter Email",
  },
];

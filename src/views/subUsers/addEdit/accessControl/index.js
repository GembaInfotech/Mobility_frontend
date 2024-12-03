import { Checkbox, Table } from "components/ui";
import TBody from "components/ui/Table/TBody";
import Td from "components/ui/Table/Td";
import Th from "components/ui/Table/Th";
import THead from "components/ui/Table/THead";
import Tr from "components/ui/Table/Tr";
import React from "react";

export const PERMISSIONS = [
  {
    label: "Sub Admin",
    name: "sub-user",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Patient Management",
    name: "patient",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Physicians",
    name: "physician",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Patient Prescriptions",
    name: "service-order",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Insurance Companies",
    name: "insurance",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Codes (LCode / ICD)",
    name: "codes",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Types Of Devices",
    name: "types-of-devices",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Locations",
    name: "locations",
    read: true,
    edit: false,
    delete: false,
  },
  {
    label: "Stock Entry",
    name: "stock-entry",
    read: true,
    edit: false,
    delete: false,
  },
];

const AccessControl = ({ touched, errors, values, setFieldValue }) => {
  const selectHandler = (role, value, name) => {
    const newRoles = (values?.roles || []).map((x) => {
      if (x?.name === name) {
        if ((role === "edit" || role === "delete") && value) {
          return { ...x, [role]: value, read: true };
        } else {
          return { ...x, [role]: value };
        }
      }
      return x;
    });
    setFieldValue("roles", newRoles);
  };
 
  return (
    <div>
      <h4 className="my-4">Access Control</h4>
      <Table>
        <THead>
          <Tr>
            <Th>Menu</Th>
            <Th>Read</Th>
            <Th>Add/Edit</Th>
            <Th>Delete</Th>
          </Tr>
        </THead>
        <TBody>
          {PERMISSIONS?.map((permission, index) => {
            const valueObj = values?.roles?.find(
              (x) => x?.name === permission?.name
            );
            return (
              <Tr key={index}>
                <Td>{permission?.label} </Td>
                <Td>  
                  <Checkbox
                    checked={valueObj?.read}
                    onChange={(e) => selectHandler("read", e, permission?.name)}
                  />
                </Td>
                <Td>
                  <Checkbox
                    checked={valueObj?.edit}
                    onChange={(e) => selectHandler("edit", e, permission?.name)}
                  />
                </Td>
                <Td>
                  <Checkbox
                    checked={valueObj?.delete}
                    onChange={(e) =>
                      selectHandler("delete", e, permission?.name)
                    }
                  />
                </Td>
              </Tr>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
};

export default AccessControl;

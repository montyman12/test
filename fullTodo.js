import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Table, Input, Button } from "antd";

const colors = [  "red",  "green",  "blue",  "brown",  "black",  "purple"];


function HierarchyView({ rows, parentId = null, level = 0 }) {
  const children = rows.filter((row) => row.parentId === parentId);

  return (
    <div style={{ marginLeft: 20 }}>
      {children.map((child) => (
        <div
          key={child.id}
          style={{
            backgroundColor: colors[level % colors.length],
            padding: 5,
            margin: 5,
          }}
        >
          {child.name}
          <HierarchyView
            rows={rows}
            parentId={child.id}
            level={level + 1}
          />
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [rows, setRows] = useState([{ id: "1", name: "ID", level: 0, parentId: null }]);
  const [selectedRow, setSelectedRow] = useState(null);

  const addRow = (parentId = null) => {
    const newId = uuidv4();
    const newLevel = parentId !== null ? getParentLevel(parentId) + 1 : 0;
    const newRow = {
      id: newId,
      name: "",
      level: newLevel,
      parentId,
      bgColor: colors[newLevel % colors.length]
    };
  
    const parentIndex = rows.findIndex((row) => row.id === parentId);
    const childIndex = parentIndex !== -1 ? parentIndex + 1 : rows.length;
    const updatedRows = [...rows];
    updatedRows.splice(childIndex, 0, newRow);
    setRows(updatedRows);
    setSelectedRow(newRow);
  };
  

  const getParentLevel = (parentId) => {
    const parent = rows.find((row) => row.id === parentId);
    return parent ? parent.level : null;
  };

  const deleteRow = (id) => {
    const rowToDelete = rows.find((row) => row.id === id);
    const indexToDelete = rows.findIndex((row) => row.id === id);
    const updatedRows = [...rows];
  
    // recursively delete all child rows
    const deleteChildren = (parentId) => {
      const children = updatedRows.filter((row) => row.parentId === parentId);
      children.forEach((child) => {
        updatedRows.splice(updatedRows.indexOf(child), 1);
        deleteChildren(child.id);
      });
    };
    deleteChildren(id);
  
    // delete the row itself
    updatedRows.splice(indexToDelete, 1);
    setRows(updatedRows);
  
    if (selectedRow && selectedRow.id === id) {
      setSelectedRow(null);
    } else if (selectedRow && selectedRow.parentId === id) {
      setSelectedRow(rowToDelete.parentId);
    }
  };
  
  

  const updateRow = (id, name) => {
    const indexToUpdate = rows.findIndex((row) => row.id === id);
    const updatedRows = [...rows];
    updatedRows[indexToUpdate].name = name;
    setRows(updatedRows);
  };

  const getRowBgColor = (level) => {
    return colors[level % colors.length];
  };

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} style={{ backgroundColor: getRowBgColor(row.level) }}>
              <td>{row.id}</td>
              <td>
                <Input
                  value={row.name}
                  onChange={(e) => updateRow(row.id, e.target.value)}
                />
              </td>
              <td>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button onClick={() => addRow(row.id)}>+ Add Field</Button>
                  <Button onClick={() => deleteRow(row.id)}> delete </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-end">
        <Button onClick={() => addRow()}>+ Add Field</Button>
      </div>
      <HierarchyView rows={rows}/>
    </div>
  );
}

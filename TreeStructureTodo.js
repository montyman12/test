import React , {useState} from "react";
import { v4 as uuidv4 } from "uuid";

const TreeNode = ({node,onDelete,onAddChild,onEdit}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNode, setEditedNode] = useState({ ...node });

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    }
    const handleDelete = () => {
        onDelete(node.fieldId);
    }
    const handleAddChild = () => {
        onAddChild(node.fieldId);
    }
    const handleEdit = () => {
        setIsEditing(true);
      };
      const handleSave = () => {
        onEdit(node.fieldId, editedNode);
        setIsEditing(false);
        console.log(node,editedNode)
      };
    
      const handleCancel = () => {
        setIsEditing(false);
      };
    
      const handleChange = e => {
        const { name, value } = e.target;
        setEditedNode({ ...editedNode, [name]: value });
      };
    return (
        <div>
            <span onClick={handleToggle}>
                {isExpanded ? "[-]" : "[+]"}
            </span>
            {node.fieldName}
            <span className="tree-node-delete" onClick={handleDelete}>
                &#x2716;
            </span>
            <span className="tree-node-add" onClick={handleAddChild}>
                &#x2b;
            </span>
            <span className="tree-node-edit" onClick={handleEdit}>
                &#x270e;
            </span>
            <div className="childNodes">
                {isExpanded && node.children.map(childNode => (
                    <TreeNode node={childNode} onDelete={onDelete} onAddChild={onAddChild} onEdit={onEdit} />
                ))}
            </div>
            {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Node Details</h2>
            <div className="form-group">
              <label>Field Name:</label>
              <input
                type="text"
                name="fieldName"
                value={editedNode.fieldName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Field Type:</label>
              <input
                type="text"
                name="fieldType"
                value={editedNode.fieldType}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Null Percent:</label>
              <input
                type="text"
                name="nullPercent"
                value={editedNode.nullPercent}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Formula:</label>
              <input
                type="text"
                name="fieldFormula"
                value={editedNode.fieldFormula}
                onChange={handleChange}
              />
            </div>
            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
        </div>
    )
}
export default function Tree({initialData}){
    const [treeData,setTreeData] = useState(initialData);
    const onAddChild = nodeId => {
        const newNode = { 
            fieldId: uuidv4(), 
            fieldName: "New Node", 
            fieldType:"String",
            nullPercent:0,
            fieldFormula:"add",
            children: [] 
        };
        const addChildNode = (node, newNode) => {
          if (node.fieldId === nodeId) {
            return {
              ...node,
              children: [...node.children, newNode],
            };
          }
          return {
            ...node,
            children: node.children.map(childNode => addChildNode(childNode, newNode)),
          };
        };
        const updatedTreeData = treeData.map(node => addChildNode(node, newNode))
        setTreeData(updatedTreeData);
      };
      
    const onDelete = fieldId => {
        const removeNode = (node, fieldId) => {
          if (node.fieldId === fieldId) {
            return null;
          }
          return {
            ...node,
            children: node.children.map(childNode => removeNode(childNode, fieldId)).filter(Boolean),
          };
        };
        const updatedTreeData = treeData.map(node => removeNode(node, fieldId)).filter(Boolean);
        setTreeData(updatedTreeData);
      };
     
      const onEdit = (fieldId, updatedNode) => {
        const updatedTreeData = updateNode(treeData, fieldId, updatedNode);
        setTreeData(updatedTreeData);
        };
        
        const updateNode = (treeData, fieldId, updatedNode) => {
        return treeData.map((node) => {
        if (node.fieldId === fieldId) {
            return {
                ...node,
                ...updatedNode
            };
        } else if (node.children.length > 0) {
            node.children = updateNode(node.children, fieldId, updatedNode);
            return node; 
        } else {
            return node; 
        }
        });
        };

    return(
        <div>
            {treeData.map(node => (
                <TreeNode node={node} onDelete={onDelete} onAddChild={onAddChild} onEdit={onEdit} />
            ))}
        </div>
    );
}

// ActionIcons.js
import React from "react";
import { ReactComponent as EditIcon } from "../assets/edit.svg"; 
import { ReactComponent as DeleteIcon } from "../assets/icons8-delete.svg";

const ActionIcons = ({ onEditClick, onDeleteClick }) => {
  return (
    <div className="action-icons">
      <EditIcon onClick={onEditClick} className="edit-icon" />
      <DeleteIcon onClick={onDeleteClick} className="delete-icon" />
    </div>
  );
};



export default ActionIcons;

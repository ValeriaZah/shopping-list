import React, { useState } from 'react';
import './ShoppingListDetail.css';
import { isOwner, canAddMember, canRemoveMember, canEditTitle } from '../utils/permissions';

// current user is the owner of the list
const currentUser = { id: "ownerId", role: "owner" };

const ShoppingListDetail = () => {
  const initialShoppingList = {
    id: 1,
    name: "Weekly Groceries",
    owner: "ownerId",
    members: ["memberId1", "memberId2"],
    items: [
      { id: 1, name: "Milk", resolved: false },
      { id: 2, name: "Bread", resolved: false },
      { id: 3, name: "Eggs", resolved: true }
    ]
  };

  const [shoppingList, setShoppingList] = useState(initialShoppingList);
  const [newTitle, setNewTitle] = useState(shoppingList.name);
  const [showResolved, setShowResolved] = useState(false);

  // сhange the list title (only owner)
  const changeTitle = () => {
    if (currentUser.role === "owner") {
      setShoppingList(prevList => ({ ...prevList, name: newTitle }));
    } else {
      alert("Only the owner can change the list title.");
    }
  };

  // add a new member (only owner)
  const addMember = (memberId) => {
    if (currentUser.role === "owner") {
      setShoppingList(prevList => ({
        ...prevList,
        members: [...prevList.members, memberId]
      }));
    } else {
      alert("Only the owner can add members.");
    }
  };

  // remove a member (only owner)
  const removeMember = (memberId) => {
    if (currentUser.role === "owner") {
      setShoppingList(prevList => ({
        ...prevList,
        members: prevList.members.filter(id => id !== memberId)
      }));
    } else {
      alert("Only the owner can remove members.");
    }
  };

  // function for a member to leave the list
  const leaveList = () => {
    setShoppingList(prevList => ({
      ...prevList,
      members: prevList.members.filter(id => id !== currentUser.id)
    }));
  };

  // add a new item
  const addItem = (name) => {
    setShoppingList(prevList => ({
      ...prevList,
      items: [...prevList.items, { id: Date.now(), name, resolved: false }]
    }));
  };

  // remove an item
  const removeItem = (itemId) => {
    setShoppingList(prevList => ({
      ...prevList,
      items: prevList.items.filter(item => item.id !== itemId)
    }));
  };

  // toggle item as resolved/unresolved
  const toggleResolve = (itemId) => {
    setShoppingList(prevList => ({
      ...prevList,
      items: prevList.items.map(item =>
        item.id === itemId ? { ...item, resolved: !item.resolved } : item
      )
    }));
  };

  // filter items (show unresolved or all)
  const filteredItems = showResolved ? shoppingList.items : shoppingList.items.filter(item => !item.resolved);

  return (
    <div>
      {/* Change list title */}
      <h1>
        {currentUser.role === "owner" ? (
          <>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button onClick={changeTitle}>Change Title</button>
          </>
        ) : (
          <span>{shoppingList.name}</span>
        )}
      </h1>

      {/* Add and remove members (for owner) */}
      {currentUser.role === "owner" && (
        <div>
          <button onClick={() => addMember("newMemberId")}>Add Member</button>
          <button onClick={() => removeMember("memberId1")}>Remove Member</button>
        </div>
      )}

      {/* Option for members to leave the list */}
      {currentUser.role !== "owner" && (
        <button onClick={leaveList}>Leave List</button>
      )}

      {/* List items */}
      <button onClick={() => setShowResolved(!showResolved)}>
        {showResolved ? "Hide Resolved" : "Show All"}
      </button>
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>
            <span style={{ textDecoration: item.resolved ? "line-through" : "none" }}>
              {item.name}
            </span>
            <button onClick={() => toggleResolve(item.id)}>
              {item.resolved ? "Undo" : "Resolve"}
            </button>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>

      {/* Add a new item */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const name = e.target.elements.itemName.value.trim();
        if (name) {
          addItem(name);
          e.target.elements.itemName.value = '';
        }
      }}>
        <input type="text" name="itemName" placeholder="Add new item" />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default ShoppingListDetail;
export const isOwner = (currentUser, list) => currentUser.id === list.owner;

export const canAddMember = (currentUser) => currentUser.role === "owner";

export const canRemoveMember = (currentUser) => currentUser.role === "owner";

export const canEditTitle = (currentUser) => currentUser.role === "owner";
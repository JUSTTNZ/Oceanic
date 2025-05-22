
export const setUser = (user) => ({
    type: "SET_USER",
    payload:user
})
export const updateUser = (updatedFields) => ({
  type: "UPDATE_USER",
  payload: updatedFields
});
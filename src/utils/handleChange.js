export const handleChange = (e, setState) => {
  const { name, type, checked, value } = e.target;
  setState((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};
//hna we used setState instead of state bc state is immutable and react cannot track it 
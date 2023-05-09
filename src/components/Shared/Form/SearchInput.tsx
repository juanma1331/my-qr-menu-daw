import { IconSearch } from "@tabler/icons-react";

import TextInput, { type TextInputProps } from "./TextInput";

const SearchInput: React.FC<TextInputProps> = (props) => {
  return <TextInput {...props} icon={<IconSearch size={16} />} />;
};

export default SearchInput;

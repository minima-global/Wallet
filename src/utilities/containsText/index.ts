export function containsText(text: string, searchText: string) {
  return text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
}

export default containsText;

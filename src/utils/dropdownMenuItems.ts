export function getRangeDropdownItems(tFilters: (key: string) => string) {
  return [
    { label: tFilters("range.day"), param: "range", value: "day" },
    { label: tFilters("range.week"), param: "range", value: "week" },
    { label: tFilters("range.month"), param: "range", value: "month" },
    { label: tFilters("range.all_time"), param: "range", value: "all-time" },
  ];
}

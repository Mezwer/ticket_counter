import { createSignal, For, Show } from "solid-js";
import ChevronUp from "~icons/heroicons/chevron-up";
import ChevronDown from "~icons/heroicons/chevron-down";
import ChevronUpDown from "~icons/heroicons/chevron-up-down";
import { ActionButtons } from "~/components/ActionButtons";
import type { ColumnDef, SortingState } from "@tanstack/solid-table";
import {
  createSolidTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
} from "@tanstack/solid-table";

type User = {
  name: string;
  email: string;
  tickets: number;
};

const defaultData: User[] = [
  {
    name: "killme",
    email: "killme@gmail.com",
    tickets: 0,
  },
  {
    name: "killme2",
    email: "killme@gmail.com",
    tickets: 0,
  },
  {
    name: "killme3",
    email: "killme@gmail.com",
    tickets: 0,
  },
];

const columnHelper = createColumnHelper<User>();
const defaultColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: () => "Name",
  },
  {
    accessorKey: "email",
    header: () => "Email",
  },
  {
    accessorKey: "tickets",
    header: () => "Tickets",
  },
  columnHelper.display({
    id: "action",
  }),
];

export default function AdminPage() {
  const [data, setData] = createSignal<User[]>(defaultData);
  const [sort, setSort] = createSignal<SortingState>([]);

  const table = createSolidTable({
    get data() {
      return data();
    },
    state: {
      get sorting() {
        return sort();
      },
    },
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSort,
    sortDescFirst: true,
  });

  const modifyTickets = (index: number, inc: boolean): void => {
    // do stuff with backend
    const newData = [...data()];
    newData[index]["tickets"] += inc ? 1 : -1;
    setData(newData);
    table.setSorting(table.getState().sorting);
  };

  return (
    <div class="w-11/12 text-center">
      <span class="inline-block text-2xl font-bold dark:text-zinc-100">Admin Panel</span>
      <table class="m-2 w-11/12">
        <thead class="bg-sky-500 dark:bg-blue-900">
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <Show when={header.id !== "action"}>
                      <th
                        class="cursor-pointer align-middle font-bold first:rounded-tl-md last:rounded-tr-md hover:bg-sky-600 dark:text-white dark:hover:bg-blue-950"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        <Show
                          when={header.column.getIsSorted() !== false}
                          fallback={<ChevronUpDown class="inline-block align-middle -mt-0.5" />}
                        >
                          {(header.column.getIsSorted() as string) === "asc" ? (
                            <ChevronUp class="inline-block align-middle -mt-0.5" />
                          ) : (
                            <ChevronDown class="inline-block align-middle -mt-0.5" />
                          )}
                        </Show>
                      </th>
                    </Show>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row, index) => (
              <tr class="even:bg-slate-200 odd:bg-slate-100 dark:(even:bg-gray-900 odd:bg-gray-800)">
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td class="text-center">
                      {cell.column.id !== "action" ? (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      ) : (
                        <ActionButtons
                          pAction={() => modifyTickets(index(), true)}
                          mAction={() => modifyTickets(index(), false)}
                        />
                      )}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    // DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ChevronDown } from 'lucide-react';

// ? this will come from JSON
const headers = [
    { id: 1, hname: 'Name' },
    { id: 2, hname: 'Email' },
    { id: 3, hname: 'Phone' },
];

/**
 * ? this is a mock data => coming from DB via controller
 * ? of a table
 * ? of a user
 * ? of a module
 */
const tableData = [
    { id: 1, uname: 'test1', uemail: 'email01@com', uphone: '01234567891' },
    { id: 2, uname: 'test2', uemail: 'email02@com', uphone: '01234567892' },
    { id: 3, uname: 'test3', uemail: 'email03@com', uphone: '01234567893' },
];

export default function CommonModuleTable() {
    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter emails..."
                    // value={
                    //     (table
                    //         .getColumn('email')
                    //         ?.getFilterValue() as string) ?? ''
                    // }
                    // onChange={(event) =>
                    //     table
                    //         .getColumn('email')
                    //         ?.setFilterValue(event.target.value)
                    // }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })} */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {headers?.map((header) => (
                                <TableHead key={header.id}>
                                    {header.hname}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData.length ? (
                            tableData.map((row) => (
                                <TableRow key={row.id}>
                                    {Object.entries(row)
                                        .filter(([key, value]) => key !== 'id')
                                        .map(([key, value]) => (
                                            <TableCell
                                                key={key + value}
                                                className="h-24 text-center"
                                            >
                                                {String(value)}
                                            </TableCell>
                                        ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={headers.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* pagination */}
            <div className="flex justify-end items-center space-x-2 py-4">
                <div className="flex-1 text-muted-foreground text-sm">
                    {/* {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected. */}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        // onClick={() => table.previousPage()}
                        // disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        // onClick={() => table.nextPage()}
                        // disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}

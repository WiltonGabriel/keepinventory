import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

type DataItem = {
  id: string;
  [key: string]: any;
};

type ColumnDef<T> = {
  accessorKey: keyof T | 'actions';
  header: string;
  cell: (item: T) => React.ReactNode;
};

interface DataTableProps<T extends DataItem> {
  columns: ColumnDef<T>[];
  data: T[];
  emptyStateMessage: string;
}

export function DataTable<T extends DataItem>({ columns, data, emptyStateMessage }: DataTableProps<T>) {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column, index) => (
                    <TableCell key={index}>{column.cell(item)}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyStateMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

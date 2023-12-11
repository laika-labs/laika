import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableRow } from '@/components/ui/table'

export default function StateTab() {
  return (
    <div className="flex flex-col w-full lg:w-1/2 gap-6">
      <Card className="w-full rounded-none">
        <CardHeader>
          <CardTitle>INFO</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Values have been pre-fetched.</TableCaption>
            <TableBody>
              <TableRow>
                <TableCell>decimals</TableCell>
                <TableCell>18</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>name</TableCell>
                <TableCell>"Dai Stablecoin"</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>symbol</TableCell>
                <TableCell>"DAI"</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>totalSupply</TableCell>
                <TableCell>0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

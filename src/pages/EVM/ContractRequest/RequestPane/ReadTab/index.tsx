import { CardTitle, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ReadTab() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex flex-col w-full gap-6">
        <Card className="w-full rounded-none">
          <CardHeader>
            <CardTitle>balanceOf</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="balanceOf_address">address</Label>
                  <Input id="balanceOf_address" placeholder="address" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>🔍 Read</Button>
          </CardFooter>
        </Card>
        <Card className="w-full rounded-none">
          <CardHeader>
            <CardTitle>nonces</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="nonces_address">address</Label>
                  <Input id="nonces_address" placeholder="address" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>🔍 Read</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

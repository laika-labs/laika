import { CardTitle, CardHeader, CardContent, CardFooter, Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function WriteTab() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex flex-col w-full gap-6">
        <Card className="w-full rounded-none">
          <CardHeader>
            <CardTitle>burn</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="burn_address_usr">address usr</Label>
                  <Input id="burn_address_usr" placeholder="address" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="burn_uint256_wad">uint256 wad</Label>
                  <Input id="burn_uint256_wad" placeholder="uint256" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>📝 Send</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

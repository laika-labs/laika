import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import ReadTab from './ReadTab'
import WriteTab from './WriteTab'
import StateTab from './StateTab'

export default function RequestPane() {
  return (
    <>
      <Tabs defaultValue="state" className="w-full">
        <TabsList className="grid grid-cols-4 rounded-none w-[600px]">
          <TabsTrigger value="state">State</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="abi">ABI</TabsTrigger>
        </TabsList>
        <TabsContent value="state">
          <StateTab />
        </TabsContent>
        <TabsContent value="read">
          <ReadTab />
        </TabsContent>
        <TabsContent value="write">
          <WriteTab />
        </TabsContent>
        <TabsContent value="abi">ABI</TabsContent>
      </Tabs>
    </>
  )
}

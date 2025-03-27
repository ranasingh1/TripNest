import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StaysTab from "./Tabs/StaysTab"
import ExperiencesTab from "./Tabs/ExperiencesTab"
import FlightsTab from "./Tabs/FlightTab"

export default function SearchTabs() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl text-black">
      <Tabs defaultValue="stays">
        <TabsList className="mb-4">
          <TabsTrigger value="stays">Stays</TabsTrigger>
          <TabsTrigger value="experiences">Experiences</TabsTrigger>
          <TabsTrigger value="flights">Flights</TabsTrigger>
        </TabsList>
        <TabsContent value="stays"><StaysTab /></TabsContent>
        <TabsContent value="experiences"><ExperiencesTab /></TabsContent>
        <TabsContent value="flights"><FlightsTab /></TabsContent>
      </Tabs>
    </div>
  )
}

import React from "react";
import CrudModule from "@/components/admin/shared/CrudModule";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUS_OPTS = [
  { value: "active", label: "સક્રિય" },
  { value: "inactive", label: "નિષ્ક્રિય" },
];

export default function Testimonials() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">વાલીઓના અભિપ્રાય</h1>
        <p className="text-muted-foreground mt-1">વાલીઓના લિખિત અને વિડિઓ રિવ્યૂ મેનેજ કરો</p>
      </div>

      <Tabs defaultValue="text" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="text">લેખિત અભિપ્રાય (Text Reviews)</TabsTrigger>
          <TabsTrigger value="video">વિડિઓ રિવ્યૂ (Video Reviews)</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-0 border-none p-0">
          <CrudModule
            entityName="Testimonial"
            title="લેખિત અભિપ્રાય"
            description="વાલીઓના લિખિત અભિપ્રાય મેનેજ કરો"
            filter={{ type: 'text' }}
            defaultValues={{ type: 'text' }}
            searchFields={["student_name", "mobile", "review"]}
            columns={[
              { key: "student_name", label: "નામ", sortable: true },
              { key: "mobile", label: "મોબાઈલ નંબર" },
              { key: "review", label: "અભિપ્રાય" },
              { key: "status", label: "સ્ટેટસ", type: "status", sortable: true },
            ]}
            formFields={[
              { key: "student_name", label: "નામ", required: true, placeholder: "દા.ત. રાહુલ ભાઈ" },
              { key: "mobile", label: "મોબાઈલ નંબર", placeholder: "દા.ત. 9876543210" },
              { key: "review", label: "અભિપ્રાય", type: "textarea", required: true },
              { key: "type", type: "hidden", defaultValue: "text" },
              { key: "status", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
            ]}
          />
        </TabsContent>

        <TabsContent value="video" className="mt-0 border-none p-0">
          <CrudModule
            entityName="Testimonial"
            title="વિડિઓ રિવ્યૂ"
            description="વાલીઓના વિડિઓ રિવ્યૂ અને YouTube Shorts મેનેજ કરો"
            filter={{ type: 'video' }}
            defaultValues={{ type: 'video' }}
            searchFields={["student_name", "video_url"]}
            columns={[
              { key: "photo_url", label: "વિડિઓ થમ્બનેલ", type: "image" },
              { key: "student_name", label: "વિડિઓ શીર્ષક / નામ", sortable: true },
              { key: "video_url", label: "YouTube લિંક" },
              { key: "status", label: "સ્ટેટસ", type: "status", sortable: true },
            ]}
            formFields={[
              { key: "student_name", label: "વિડિઓ શીર્ષક / નામ", required: true, placeholder: "દા.ત. વિવેકાનંદ ક્લાસીસ વાલી રિવ્યૂ" },
              { key: "video_url", label: "YouTube Shorts / વિડિઓ લિંક", required: true, placeholder: "https://youtube.com/shorts/..." },
              { key: "type", type: "hidden", defaultValue: "video" },
              { key: "review", type: "hidden", defaultValue: "Video review" }, 
              { key: "status", label: "સ્ટેટસ", type: "select", options: STATUS_OPTS },
            ]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"

export default function Resources() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Link href="https://ubc.ca1.qualtrics.com/jfe/form/SV_0iatNPaGA9vrtNs">
        <Card className="h-full transition-colors hover:bg-muted/50">
          <CardHeader>
            <CardTitle className="text-xl font-normal">Learning Tool Consent Form</CardTitle>
            <CardDescription className="text-base">
              If you want to participate in the study, please carefully read and fill out this consent form.
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>

      <Link href="https://ubc.ca1.qualtrics.com/jfe/form/SV_8dJXEAiEY8taLK6">
        <Card className="h-full transition-colors hover:bg-muted/50">
          <CardHeader>
            <CardTitle className="text-xl font-normal">Questionnaire Consent Form</CardTitle>
            <CardDescription className="text-base">
              If consented to participating in the study, please carefully read and fill out this work to answer the questionnaire about your experience using the tool.
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>

      <Link href="https://ubc.ca1.qualtrics.com/jfe/form/SV_9GH46OEAUicbf4a">
        <Card className="h-full transition-colors hover:bg-muted/50">
          <CardHeader>
            <CardTitle className="text-xl font-normal">Questionnaire</CardTitle>
            <CardDescription className="text-base">
              Fill out the following questionnaire to tell me about your experience using the tool and it&apos;s effectiveness.
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>

      <div className="pointer-events-none">
        <Card className="h-full bg-muted/30">
          <CardHeader>
            <CardTitle className="text-xl font-normal">Tutorial: How to use this tool?</CardTitle>
            <CardDescription className="text-base">
              A comprehensive guide on how to effectively use this learning tool, including key features, navigation tips, and best practices for maximizing your learning experience.
              Coming soon!
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

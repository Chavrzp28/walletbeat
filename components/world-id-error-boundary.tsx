"use client"

import { Component, type ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircleIcon, RefreshCwIcon } from "./simple-icons"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class WorldIdErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("[v0] World ID Error Boundary caught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircleIcon className="h-5 w-5" />
              World ID Load Error
            </CardTitle>
            <CardDescription>There was an issue loading the World ID verification widget.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {this.state.error?.message || "Failed to load World ID widget"}
              </AlertDescription>
            </Alert>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Possible solutions:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Check your internet connection</li>
                <li>Ensure NEXT_PUBLIC_WORLDCOIN_APP_ID is configured</li>
                <li>Try refreshing the page</li>
                <li>Clear your browser cache</li>
              </ul>
            </div>
            <Button
              onClick={() => {
                this.setState({ hasError: false })
                window.location.reload()
              }}
              variant="outline"
              className="w-full"
            >
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Reload Page
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

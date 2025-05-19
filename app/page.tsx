"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Mic, ImageIcon, Video, FileText, Plus, Search, X, ChevronRight, Settings, QrCode } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

type WorkflowStep = {
  id: string
  type: string
  title: string
  config: {
    model?: string
    quality?: number
    [key: string]: any
  }
}

const stepTypes = [
  { value: "image", label: "Generate Image", icon: <ImageIcon className="h-4 w-4 mr-2" /> },
  { value: "text", label: "Generate Text", icon: <FileText className="h-4 w-4 mr-2" /> },
  { value: "research", label: "Research", icon: <Search className="h-4 w-4 mr-2" /> },
  { value: "video", label: "Generate Video", icon: <Video className="h-4 w-4 mr-2" /> },
  { value: "audio", label: "Generate Audio", icon: <Mic className="h-4 w-4 mr-2" /> },
]

const modelOptions = {
  image: ["DALL-E 3", "Midjourney", "Stable Diffusion"],
  text: ["GPT-4o", "Claude 3", "Llama 3"],
  research: ["Web Search", "Academic Papers", "Knowledge Base"],
  video: ["Sora", "Runway", "Pika"],
  audio: ["ElevenLabs", "OpenAI TTS", "MURF AI"],
}

export default function Home() {
  const [selectedType, setSelectedType] = useState<string | null>("text")
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([])
  const [activeStepId, setActiveStepId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const handleToggle = (type: string) => {
    setSelectedType(type === selectedType ? null : type)
  }

  const addWorkflowStep = (type: string) => {
    const stepType = stepTypes.find((s) => s.value === type)
    if (!stepType) return

    const newStep = {
      id: Date.now().toString(),
      type,
      title: stepType.label,
      config: {
        model: modelOptions[type as keyof typeof modelOptions]?.[0] || "",
        quality: 50,
      },
    }

    setWorkflowSteps([...workflowSteps, newStep])
    setActiveStepId(newStep.id)
  }

  const removeWorkflowStep = (id: string) => {
    setWorkflowSteps(workflowSteps.filter((step) => step.id !== id))
    if (activeStepId === id) {
      setActiveStepId(workflowSteps.length > 1 ? workflowSteps[0].id : null)
    }
  }

  const openStepSettings = (step: WorkflowStep) => {
    setEditingStep(step)
    setModalOpen(true)
  }

  const saveStepSettings = (config: any) => {
    if (!editingStep) return

    setWorkflowSteps(
      workflowSteps.map((step) =>
        step.id === editingStep.id ? { ...step, config: { ...step.config, ...config } } : step,
      ),
    )
    setModalOpen(false)
    setEditingStep(null)
  }

  const getPlaceholderForType = (type: string) => {
    switch (type) {
      case "image":
        return "Describe the image you want to generate..."
      case "text":
        return "Describe the text you want to generate..."
      case "research":
        return "Enter your research query..."
      case "video":
        return "Describe the video you want to generate..."
      case "audio":
        return "Describe the audio you want to generate..."
      default:
        return "Type your message..."
    }
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5" />
      case "text":
        return <FileText className="h-5 w-5" />
      case "research":
        return <Search className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "audio":
        return <Mic className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const activeStep = workflowSteps.find((step) => step.id === activeStepId)

  return (
    <div className="flex flex-col min-h-screen bg-white text-black p-4 font-nunito">
      {/* Header with Logo and Turn Flow Button */}
      <header className="w-full flex justify-between items-center mb-8 mt-2">
        <div className="flex items-center">
          <div className="w-[60px] h-[60px] rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 mr-2"></div>
          <span className="font-bold text-[2.5rem]">vibecode</span>
        </div>

        {workflowSteps.length > 0 && (
          <div className="flex gap-2">
            <Button
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white border-none"
              onClick={() => setQrModalOpen(true)}
            >
              <QrCode className="h-4 w-4 mr-2" />
              Turn flow into app
            </Button>
            <Button
              className="bg-gray-100 text-black border-none hover:bg-gray-200"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        )}
      </header>

      <div className="w-full max-w-3xl mx-auto">
        {/* User Input Section */}
        <div className="mb-6">
          <p className="mb-4 text-lg font-semibold">User input</p>

          <div className="flex justify-start gap-3 mb-4 w-full">
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${selectedType === "audio" ? "bg-gray-200" : "bg-white border-gray-300"}`}
              onClick={() => handleToggle("audio")}
            >
              <Mic className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${selectedType === "image" ? "bg-gray-200" : "bg-white border-gray-300"}`}
              onClick={() => handleToggle("image")}
            >
              <ImageIcon className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${selectedType === "video" ? "bg-gray-200" : "bg-white border-gray-300"}`}
              onClick={() => handleToggle("video")}
            >
              <Video className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className={`rounded-full ${selectedType === "text" ? "bg-gray-200" : "bg-white border-gray-300"}`}
              onClick={() => handleToggle("text")}
            >
              <FileText className="h-5 w-5" />
            </Button>
          </div>

          <Textarea
            className="bg-white border-gray-300 text-black min-h-[80px] resize-none"
            placeholder={activeStep ? getPlaceholderForType(activeStep.type) : "Type your message..."}
            disabled={selectedType !== "text" && !activeStep}
            rows={2}
          />
        </div>

        <Separator className="my-6" />

        {/* Workflow Steps Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Workflow Steps</h2>

          <div className="space-y-2">
            {workflowSteps.length > 0 ? (
              workflowSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <Card
                    className={`flex items-center p-3 w-full cursor-pointer ${
                      activeStepId === step.id ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"
                    }`}
                    onClick={() => setActiveStepId(step.id)}
                  >
                    <div className="flex-1 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        {getIconForType(step.type)}
                      </div>
                      <div>
                        <span>{step.title}</span>
                        {step.config.model && <p className="text-xs text-gray-500">{step.config.model}</p>}
                      </div>
                    </div>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-gray-200 mr-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          openStepSettings(step)
                        }}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-gray-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeWorkflowStep(step.id)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                  {index < workflowSteps.length - 1 && (
                    <div className="flex justify-center my-1">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div
                className="flex items-center p-3 w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400"
                onClick={() => document.getElementById("add-step-trigger")?.click()}
              >
                <div className="flex-1 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <Plus className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <span className="text-gray-500">Add a step</span>
                    <p className="text-xs text-gray-400">Click to add your first workflow step</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <Select onValueChange={addWorkflowStep}>
              <SelectTrigger id="add-step-trigger" className="bg-black text-white border-none w-40">
                <div className="flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  <span>Add Step</span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {stepTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-black">
                    <div className="flex items-center">
                      {type.icon}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Step Configuration Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-white border-gray-200 text-black">
          <DialogHeader>
            <DialogTitle>{editingStep?.title} Settings</DialogTitle>
            <DialogDescription className="text-gray-500">Configure the settings for this step.</DialogDescription>
          </DialogHeader>

          {editingStep && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Model</Label>
                <RadioGroup
                  defaultValue={editingStep.config.model}
                  onValueChange={(value) => saveStepSettings({ model: value })}
                >
                  {modelOptions[editingStep.type as keyof typeof modelOptions]?.map((model) => (
                    <div key={model} className="flex items-center space-x-2">
                      <RadioGroupItem value={model} id={model} />
                      <Label htmlFor={model}>{model}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Quality</Label>
                  <span className="text-sm text-gray-500">{editingStep.config.quality}%</span>
                </div>
                <Slider
                  defaultValue={[editingStep.config.quality || 50]}
                  max={100}
                  step={1}
                  onValueChange={(value) => saveStepSettings({ quality: value[0] })}
                />
              </div>

              <Button
                className="w-full mt-4 bg-black text-white hover:bg-gray-800"
                onClick={() => saveStepSettings(editingStep.config)}
              >
                Save Settings
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="bg-white border-gray-200 text-black">
          <DialogHeader>
            <DialogTitle className="text-center">App Settings</DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Customize your experience
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <Button className="w-full bg-gray-100 text-black hover:bg-gray-200">
              Enable Dark Mode
            </Button>
            <Button className="w-full bg-gray-100 text-black hover:bg-gray-200">
              Notification Preferences
            </Button>
            <Button className="w-full bg-gray-100 text-black hover:bg-gray-200">
              Account Settings
            </Button>
            <Button className="w-full bg-gray-100 text-black hover:bg-gray-200">
              Privacy Options
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="bg-white border-gray-200 text-black">
          <DialogHeader>
            <DialogTitle className="text-center">Turn flow into app</DialogTitle>
            <DialogDescription className="text-center text-gray-500">
              Scan this QR code to create your app
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
              <Image src="/qr-code.png" alt="QR Code" width={200} height={200} className="mx-auto" />
            </div>
            <p className="text-sm text-gray-500 text-center">
              This will convert your workflow into a fully functional app
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

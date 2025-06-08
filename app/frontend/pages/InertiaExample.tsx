import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, Brain, Sparkles, Zap, Github, Mail, Chrome, MessageSquare, Code, FileText, Lightbulb } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">A5 Chat</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#models" className="text-gray-600 hover:text-gray-900 transition-colors">
              AI Models
            </a>
            <a href="#signin" className="text-gray-600 hover:text-gray-900 transition-colors">
              Sign In
            </a>
            <Button variant="outline">Get Started</Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Bot className="h-20 w-20 text-indigo-600" />
              <Sparkles className="h-8 w-8 text-purple-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Chat with the World's Most <span className="text-indigo-600">Advanced AI Models</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Access GPT-4, Claude, Gemini, and more in one unified interface. Get instant answers, generate content,
            write code, and unlock your creativity with A5 Chat.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-3 bg-indigo-600 hover:bg-indigo-700">
              <MessageSquare className="h-5 w-5 mr-2" />
              Start Chatting with AI
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful AI at Your Fingertips</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the next generation of AI conversation with features designed for productivity and creativity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <Brain className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <CardTitle>Multiple AI Models</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access GPT-4, Claude, Gemini, and other leading AI models in one unified chat interface.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <Code className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Code Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate, debug, and explain code in any programming language with AI-powered assistance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Content Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Write articles, emails, stories, and any content with AI that understands context and style.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader>
              <Lightbulb className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>Smart Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Engage in intelligent conversations that remember context and provide personalized responses.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AI Models Section */}
      <section id="models" className="container mx-auto px-4 py-20 bg-white/50 rounded-3xl mx-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your AI Assistant</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Switch between different AI models based on your needs - from creative writing to technical problem-solving.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Bot className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>GPT-4 & GPT-3.5</CardTitle>
              <CardDescription>OpenAI's most capable models</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Perfect for general conversations, creative writing, and complex problem-solving tasks.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Claude 3</CardTitle>
              <CardDescription>Anthropic's advanced AI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Excellent for analysis, research, and detailed explanations with strong reasoning capabilities.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Gemini Pro</CardTitle>
              <CardDescription>Google's multimodal AI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Great for multimodal tasks, image understanding, and Google-integrated workflows.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Sign In Section */}
      <section id="signin" className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl">Start Chatting with AI</CardTitle>
              <CardDescription>Sign in to access powerful AI models and save your conversations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Social Sign In Buttons */}
              <Button variant="outline" className="w-full flex items-center justify-center space-x-2" size="lg">
                <Chrome className="h-5 w-5" />
                <span>Continue with Google</span>
              </Button>

              <Button variant="outline" className="w-full flex items-center justify-center space-x-2" size="lg">
                <Github className="h-5 w-5" />
                <span>Continue with GitHub</span>
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Email Sign In Form */}
              <div className="space-y-3">
                <Input type="email" placeholder="Enter your email" className="w-full" />
                <Input type="password" placeholder="Enter your password" className="w-full" />
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700" size="lg">
                  <Mail className="h-4 w-4 mr-2" />
                  Sign In with Email
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                {"Don't have an account? "}
                <a href="#" className="text-indigo-600 hover:underline">
                  Sign up here
                </a>
              </div>

              <div className="text-center text-xs text-gray-500 pt-4">
                Free tier includes 10 messages per day. Upgrade for unlimited access.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Experience AI-Powered Conversations?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of users who are already leveraging the power of multiple AI models in one platform.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            <Zap className="h-5 w-5 mr-2" />
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="h-6 w-6" />
                <span className="text-xl font-bold">A5 Chat</span>
              </div>
              <p className="text-gray-400">
                The ultimate AI chat platform. Access multiple AI models, generate content, and boost your productivity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">AI Models</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GPT-4 & GPT-3.5
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Claude 3
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Gemini Pro
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Code Generation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Content Writing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Chat History
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Access
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 A5 Chat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

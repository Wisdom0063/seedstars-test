import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Building2, BarChart3, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Customer Segments",
      description: "Manage customer segments and personas",
      icon: Users,
      href: "/customer-segments",
      count: "4 segments",
      color: "text-blue-600 bg-blue-100"
    },
    {
      title: "Value Propositions", 
      description: "Define and manage value propositions",
      icon: Target,
      href: "/value-propositions",
      count: "12 propositions",
      color: "text-purple-600 bg-purple-100"
    },
    {
      title: "Business Models",
      description: "Business model canvas and strategies", 
      icon: Building2,
      href: "/business-models",
      count: "15,118 models",
      color: "text-green-600 bg-green-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to your business canvas platform. Manage customer segments, value propositions, and business models.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.count}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
                <div className="flex items-center mt-3 text-sm text-blue-600">
                  View details
                  <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Stats
            </CardTitle>
            <CardDescription>
              Overview of your business canvas data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Segments</span>
              <span className="font-semibold">4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Personas</span>
              <span className="font-semibold">24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Value Propositions</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Business Models</span>
              <span className="font-semibold">15,118</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              New to the platform? Start with these steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                1
              </div>
              <div>
                <p className="text-sm font-medium">Define Customer Segments</p>
                <p className="text-xs text-gray-600">Identify your target customer groups</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-semibold">
                2
              </div>
              <div>
                <p className="text-sm font-medium">Create Value Propositions</p>
                <p className="text-xs text-gray-600">Define what value you provide</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-semibold">
                3
              </div>
              <div>
                <p className="text-sm font-medium">Build Business Models</p>
                <p className="text-xs text-gray-600">Complete your business canvas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

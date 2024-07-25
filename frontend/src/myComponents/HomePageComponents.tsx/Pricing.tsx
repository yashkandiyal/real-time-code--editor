import React from 'react';
import { useState } from 'react';
import { Button } from "../../shadcn/components/ui/button";
import { Switch } from "../../shadcn/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../shadcn/components/ui/card";
import { Badge } from "../../shadcn/components/ui/badge";
import { FiCheck, FiInfo } from 'react-icons/fi';
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";

const pricingData = [
  {
    title: "Free",
    monthlyPrice: "$0",
    annualPrice: "$0",
    period: "Lifetime",
    description: "Completely free for 30 days, all features are free so you can acutely work out if it's for you.",
    features: [
      { name: "Up to 2 users", included: true },
      { name: "2GB Cloud Storage", included: true },
      { name: "5GB Memory", included: true },
      { name: "Free domain", included: true },
      { name: "SSL certificate", included: false },
      { name: "Chat Support 24/7", included: false },
    ],
    popular: false,
  },
  {
    title: "Premium",
    monthlyPrice: "$79",
    annualPrice: "$790",  
    period: "Per month",
    description: "Completely free for 30 days, all features are free so you can acutely work out if it's for you.",
    features: [
      { name: "Up to 5 users", included: true },
      { name: "25GB Cloud Storage", included: true },
      { name: "50GB Memory", included: true },
      { name: "Free domain", included: true },
      { name: "SSL certificate", included: true },
      { name: "Chat Support 24/7", included: false },
    ],
    popular: true,
  },
  {
    title: "Enterprise",
    monthlyPrice: "$199",
    annualPrice: "$1990",  
    period: "Per month",
    description: "Completely free for 30 days, all features are free so you can acutely work out if it's for you.",
    features: [
      { name: "Up to 15 users", included: true },
      { name: "25GB Cloud Storage", included: true },
      { name: "50GB Memory", included: true },
      { name: "Free domain", included: true },
      { name: "SSL certificate", included: true },
      { name: "Chat Support 24/7", included: true },
    ],
    popular: false,
  },
];

const Pricing: React.FC = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
    <Navbar />

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-2">CodeSync PRO Plans</h1>
        <p className="text-center text-gray-600 mb-8">
          Our services are designed to cater to your specific needs and goals
        </p>
        
        <div className="flex justify-center items-center space-x-4 mb-12">
          <span className={`font-medium ${isMonthly ? 'text-blue-600' : 'text-gray-500'}`}>Monthly</span>
          <Switch
            checked={!isMonthly}
            onCheckedChange={() => setIsMonthly(!isMonthly)}
          />
          <span className={`font-medium ${!isMonthly ? 'text-blue-600' : 'text-gray-500'}`}>Annually</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingData.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-blue-500">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">
                  {isMonthly ? plan.monthlyPrice : plan.annualPrice}
                </div>
                <div className="text-gray-500 mb-4">
                  {isMonthly ? plan.period : 'Per year'}
                </div>
                <p className="text-sm text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      {feature.included ? (
                        <FiCheck className="text-green-500 mr-2" />
                      ) : (
                        <span className="w-4 h-4 mr-2" />
                      )}
                      <span className={feature.included ? '' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                      <FiInfo className="ml-auto text-gray-400" />
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3">
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Get started
                </Button>
                <Button variant="ghost" className="w-full">
                  See all features
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Pricing;
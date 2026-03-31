"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import NewsletterSignup from "@/components/newsletter";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/logo";

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-purple-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Logo />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                {t("nav.features")}
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                {t("nav.howItWorks")}
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                {t("nav.pricing")}
              </a>
              <LanguageSwitcher />
              <Button 
                onClick={() => navigate("/enhancer")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full"
              >
                {t("nav.getStarted")}
              </Button>
            </nav>
            <div className="md:hidden flex items-center gap-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
            {t("hero.badge")}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t("hero.title1")}
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t("hero.title2")}
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t("hero.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/enhancer")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {t("hero.startNow")}
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg border-2">
              {t("hero.watchDemo")}
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("features.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: t("feature.smartEnhancement.title"),
                description: t("feature.smartEnhancement.desc"),
                icon: "✨",
                color: "from-blue-500 to-blue-600"
              },
              {
                title: t("feature.backgroundRemover.title"),
                description: t("feature.backgroundRemover.desc"),
                icon: "🎯",
                color: "from-purple-500 to-purple-600"
              },
              {
                title: t("feature.photoRestorer.title"),
                description: t("feature.photoRestorer.desc"),
                icon: "🔧",
                color: "from-pink-500 to-pink-600"
              },
              {
                title: t("feature.upscale.title"),
                description: t("feature.upscale.desc"),
                icon: "🔍",
                color: "from-green-500 to-green-600"
              },
              {
                title: t("feature.colorCorrection.title"),
                description: t("feature.colorCorrection.desc"),
                icon: "🎨",
                color: "from-yellow-500 to-yellow-600"
              },
              {
                title: t("feature.noiseReduction.title"),
                description: t("feature.noiseReduction.desc"),
                icon: "🌙",
                color: "from-indigo-500 to-indigo-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("testimonials.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("testimonials.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: t("testimonial.sarah.name"),
                role: t("testimonial.sarah.role"),
                quote: t("testimonial.sarah.quote"),
                avatar: "https://picsum.photos/60/60?random=1"
              },
              {
                name: t("testimonial.michael.name"),
                role: t("testimonial.michael.role"),
                quote: t("testimonial.michael.quote"),
                avatar: "https://picsum.photos/60/60?random=2"
              },
              {
                name: t("testimonial.emily.name"),
                role: t("testimonial.emily.role"),
                quote: t("testimonial.emily.quote"),
                avatar: "https://picsum.photos/60/60?random=3"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{testimonial.name}</h3>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{testimonial.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("howItWorks.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("howItWorks.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200"></div>
            
            {[
              {
                step: "1",
                title: t("step.upload.title"),
                description: t("step.upload.desc"),
                color: "blue"
              },
              {
                step: "2",
                title: t("step.process.title"),
                description: t("step.process.desc"),
                color: "purple"
              },
              {
                step: "3",
                title: t("step.download.title"),
                description: t("step.download.desc"),
                color: "pink"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 text-white text-2xl font-bold mb-6 shadow-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Before/After Showcase */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("beforeAfter.title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("beforeAfter.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-sm opacity-80">Before - Upload your image</p>
                </div>
              </div>
              <CardContent className="p-4 bg-white">
                <p className="text-center font-medium text-gray-700">{t("beforeAfter.before")}</p>
              </CardContent>
            </Card>
                        <Card className="overflow-hidden border-0 shadow-xl">
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <div className="text-4xl mb-2">✨</div>
                  <p className="text-sm opacity-80">After - AI Enhanced</p>
                </div>
              </div>
              <CardContent className="p-4 bg-white">
                <p className="text-center font-medium text-gray-700">{t("beforeAfter.after")}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("pricing.title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("pricing.subtitle")}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: t("plan.free.name"),
                price: "$0",
                period: t("plan.free.period"),
                features: [
                  t("plan.free.feature1"),
                  t("plan.free.feature2"),
                  t("plan.free.feature3"),
                  t("plan.free.feature4")
                ],
                highlighted: false
              },
              {
                name: t("plan.pro.name"),
                price: "$19",
                period: t("plan.pro.period"),
                features: [
                  t("plan.pro.feature1"),
                  t("plan.pro.feature2"),
                  t("plan.pro.feature3"),
                  t("plan.pro.feature4"),
                  t("plan.pro.feature5")
                ],
                highlighted: true
              },
              {
                name: t("plan.enterprise.name"),
                price: "Custom",
                period: t("plan.enterprise.period"),
                features: [
                  t("plan.enterprise.feature1"),
                  t("plan.enterprise.feature2"),
                  t("plan.enterprise.feature3"),
                  t("plan.enterprise.feature4"),
                  t("plan.enterprise.feature5")
                ],
                highlighted: false              }
            ].map((plan, index) => (
              <Card key={index} className={`${plan.highlighted ? 'border-2 border-purple-500 shadow-2xl scale-105' : 'border'} bg-white`}>
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => navigate("/enhancer")}
                    className={`w-full ${plan.highlighted ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gray-900 hover:bg-gray-800'} text-white rounded-full`}
                  >
                    {t("pricing.getStarted")}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-12 md:p-20 text-white text-center">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {t("cta.title")}
              </h2>
              <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                {t("cta.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate("/enhancer")}
                  className="bg-white text-blue-600 hover:bg-gray-100 rounded-full px-8 py-6 text-lg shadow-xl"
                >
                  {t("cta.freeTrial")}
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg">
                  {t("cta.scheduleDemo")}
                </Button>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mb-20">
          <div className="max-w-2xl mx-auto">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8">
                <NewsletterSignup />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-lg font-bold text-white">IPOW</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                {t("footer.description")}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t("footer.product")}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t("footer.features")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("footer.pricing")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("footer.api")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("footer.integrations")}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t("footer.company")}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t("footer.about")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("footer.blog")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("footer.careers")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("footer.contact")}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">{t("footer.legal")}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t("footer.privacy")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("footer.terms")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("footer.cookies")}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t("footer.gdpr")}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 IPOW. {t("footer.rights")}.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>{t("footer.madeWith")}</span>
              <span className="text-red-500">❤️</span>
              <span>{t("footer.by")}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
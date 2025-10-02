import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { designTokens, styleHelpers } from '../styles/design-tokens';

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-8 pb-24 px-6"
         style={{ background: styleHelpers.gradients.warm }}>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(-1)}
            className="transition-all duration-300 hover:scale-105"
            style={{
              border: `2px solid ${designTokens.colors.stone}`,
              borderRadius: designTokens.radius.lg,
              color: designTokens.colors.charcoal,
              backgroundColor: designTokens.colors.ivory,
              fontFamily: designTokens.typography.body
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Title Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight"
              style={{ 
                fontFamily: designTokens.typography.heading,
                color: designTokens.colors.charcoal,
                letterSpacing: '-0.02em'
              }}>
            Terms of Service
          </h1>
          <p className="text-base leading-relaxed"
             style={{ 
               color: designTokens.colors.slate,
               fontFamily: designTokens.typography.body
             }}>
            Your agreement for using Clozet
          </p>
        </div>

        {/* Content */}
        <Card className="overflow-hidden"
              style={{ 
                background: designTokens.colors.pure,
                border: `1px solid ${designTokens.colors.stone}`,
                borderRadius: designTokens.radius.xl,
                boxShadow: designTokens.shadows.lg
              }}>
          <CardHeader className="pb-4">
            <div className="text-center">
              <p className="text-sm"
                 style={{ 
                   color: designTokens.colors.slate,
                   fontFamily: designTokens.typography.body
                 }}>
                Effective Date: September 17, 2025
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8 pt-0">
            <div className="prose prose-neutral max-w-none">
              <div className="space-y-6">
                <div>
                  <p className="text-base leading-relaxed mb-4"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    By using Clozet, you agree to these Terms of Service.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    1. Use of the App
                  </h2>
                  <ul className="space-y-2 ml-4">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      You must be at least 13 years old to use the app.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      You agree to use the app for personal, non-commercial purposes only.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      You are responsible for the content you upload. Do not upload unlawful, harmful, or copyrighted materials.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    2. Subscriptions & Payments
                  </h2>
                  <ul className="space-y-2 ml-4">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Clozet offers subscription tiers that provide a set number of image generations ("credits").
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Payments are processed via the Apple App Store and Google Play Store.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      All subscriptions automatically renew unless canceled at least 24 hours before renewal.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      To cancel, you must use your Apple/Google account settings.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    3. Credits & Usage
                  </h2>
                  <ul className="space-y-2 ml-4">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Each image generation consumes one credit.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      If you exceed your credits, you will be prompted to upgrade.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Credits reset monthly according to your plan.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    4. Intellectual Property
                  </h2>
                  <ul className="space-y-2 ml-4">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Generated images are for your personal use.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Clozet retains ownership of the app and its technology.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    5. Limitation of Liability
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    The app is provided "as is." We are not liable for damages arising from the use of AI-generated images.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    6. Modifications
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    We may update these Terms at any time. Updates will be posted in the app.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    7. Contact
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    For questions, contact us at: <a href="mailto:marketing@fitvueapp.com" className="font-semibold hover:underline">marketing@fitvueapp.com</a>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
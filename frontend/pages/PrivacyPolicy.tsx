import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield } from 'lucide-react';
import { designTokens, styleHelpers } from '../styles/design-tokens';

export default function PrivacyPolicy() {
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
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-4">
            <img
              src="/clozet-logo.svg"
              alt="Clozet"
              className="h-12 transition-opacity duration-300 hover:opacity-80"
              style={{
                filter: 'none',
                maxWidth: '250px',
                width: 'auto'
              }}
            />
          </div>
          
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
               style={{ 
                 background: `linear-gradient(135deg, ${designTokens.colors.sage}20 0%, ${designTokens.colors.blush}20 100%)`,
                 border: `1px solid ${designTokens.colors.stone}`
               }}>
            <Shield className="w-8 h-8" style={{ color: designTokens.colors.charcoal, strokeWidth: 1.5 }} />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight"
                style={{ 
                  fontFamily: designTokens.typography.heading,
                  color: designTokens.colors.charcoal,
                  letterSpacing: '-0.02em'
                }}>
              Privacy Policy
            </h1>
            <p className="text-base leading-relaxed"
               style={{ 
                 color: designTokens.colors.slate,
                 fontFamily: designTokens.typography.body
               }}>
              How we protect and handle your information
            </p>
          </div>
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
                    Clozet ("the App," "we," "us," or "our") is committed to protecting your privacy. 
                    This Privacy Policy explains how we collect, use, and safeguard your information when you use our app.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    1. Information We Collect
                  </h2>
                  <ul className="space-y-2 ml-4">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      <strong>Account Information:</strong> Email address, profile details when you sign up.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      <strong>Images:</strong> Avatars and outfit photos you upload for virtual try-on.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      <strong>Usage Data:</strong> Analytics data on how you use the app (e.g., features, subscriptions).
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      <strong>Payments:</strong> Subscription payments are handled securely through Apple App Store and Google Play Store. We do not store your credit card details.
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
                    2. How We Use Your Information
                  </h2>
                  <ul className="space-y-2 ml-4">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      To create your avatars and generate try-on images using AI (Gemini/NanoBanana).
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      To provide, personalize, and improve the app experience.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      To manage subscriptions, upgrades, and account access.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      To comply with legal obligations.
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
                    3. Sharing of Information
                  </h2>
                  <ul className="space-y-2 ml-4">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      <strong>Third-Party Services:</strong> We use Google's Gemini AI API to generate images. Uploaded images are processed securely through their service.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      <strong>Analytics:</strong> We may use analytics providers to improve the app.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      <strong>Legal:</strong> We may disclose information if required by law.
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
                    4. Data Retention
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    We retain your data only as long as necessary to provide the service. You may delete your account and associated data at any time.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    5. Security
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    We use encryption, signed URLs, and secure storage to protect your information.
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    6. Your Rights
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    You may access, update, or delete your information from within the app.
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
                    If you have questions, contact us at: <strong>info@clozet.com</strong>
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
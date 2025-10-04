import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { designTokens, styleHelpers } from '../styles/design-tokens';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-8 pb-24 px-6"
         style={{ background: styleHelpers.gradients.warm }}>
      <div className="max-w-2xl mx-auto space-y-8">
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

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight"
              style={{ 
                fontFamily: designTokens.typography.heading,
                color: designTokens.colors.charcoal,
                letterSpacing: '-0.02em'
              }}>
            Fitvue – Privacy Policy
          </h1>
          <p className="text-base leading-relaxed"
             style={{ 
               color: designTokens.colors.slate,
               fontFamily: designTokens.typography.body
             }}>
            Last Updated: October 3, 2025
          </p>
        </div>

        <Card className="overflow-hidden"
              style={{ 
                background: designTokens.colors.pure,
                border: `1px solid ${designTokens.colors.stone}`,
                borderRadius: designTokens.radius.xl,
                boxShadow: designTokens.shadows.lg
              }}>
          <CardContent className="space-y-8 pt-8">
            <div className="prose prose-neutral max-w-none">
              <div className="space-y-6">
                <p className="text-base leading-relaxed"
                   style={{ 
                     color: designTokens.colors.charcoal,
                     fontFamily: designTokens.typography.body
                   }}>
                  At Fitvue, we respect your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our mobile application and website ("App").
                </p>

                <div className="w-full h-px"
                     style={{ backgroundColor: designTokens.colors.stone }}></div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    1. Information We Collect
                  </h2>
                  <p className="text-base leading-relaxed mb-4"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    When you use Fitvue, we may collect:
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      <strong>Account Information:</strong> such as your email address and subscription details when you sign up.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      <strong>Uploaded Content:</strong> images you upload (garments and model photos) to generate virtual try-ons.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      <strong>Usage Data:</strong> interactions with the App, device type, IP address, and performance logs.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      <strong>Payment Information:</strong> handled securely by Apple through your Apple ID account. Fitvue does not store or process payment details.
                    </li>
                  </ul>
                </div>

                <div className="w-full h-px"
                     style={{ backgroundColor: designTokens.colors.stone }}></div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    2. How We Use Your Information
                  </h2>
                  <p className="text-base leading-relaxed mb-4"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    We use your information to:
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Provide and improve the Fitvue service.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Generate previews and outputs based on your uploads.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Manage subscriptions and deliver paid features.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Communicate updates, features, and support information.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Ensure compliance with legal obligations.
                    </li>
                  </ul>
                </div>

                <div className="w-full h-px"
                     style={{ backgroundColor: designTokens.colors.stone }}></div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    3. Data Storage and Retention
                  </h2>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Uploaded images are stored temporarily to generate results and may be deleted automatically after processing.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      User account and subscription data are retained as long as your account is active or as required by law.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      We take reasonable security measures to protect your data but cannot guarantee absolute security.
                    </li>
                  </ul>
                </div>

                <div className="w-full h-px"
                     style={{ backgroundColor: designTokens.colors.stone }}></div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    4. Sharing of Information
                  </h2>
                  <p className="text-base leading-relaxed mb-4"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    We do not sell your personal information. We may share limited data with:
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      <strong>Service Providers</strong> assisting with hosting, analytics, and support.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      <strong>Legal Authorities</strong> when required to comply with law or protect our rights.
                    </li>
                  </ul>
                </div>

                <div className="w-full h-px"
                     style={{ backgroundColor: designTokens.colors.stone }}></div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    5. Your Rights
                  </h2>
                  <p className="text-base leading-relaxed mb-4"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    You may:
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Access and update your account information at any time.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Cancel your subscription in your Apple ID account settings.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Request deletion of your account and related data by contacting us at marketing@fitvueapp.com.
                    </li>
                  </ul>
                </div>

                <div className="w-full h-px"
                     style={{ backgroundColor: designTokens.colors.stone }}></div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    6. Children's Privacy
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    Fitvue is not intended for children under 13. We do not knowingly collect information from children under 13.
                  </p>
                </div>

                <div className="w-full h-px"
                     style={{ backgroundColor: designTokens.colors.stone }}></div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    7. Third-Party Services
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    Fitvue integrates with third-party services such as Apple and Google for authentication and subscriptions. These providers may collect and process data under their own privacy policies.
                  </p>
                </div>

                <div className="w-full h-px"
                     style={{ backgroundColor: designTokens.colors.stone }}></div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    8. Changes to This Policy
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    We may update this Privacy Policy from time to time. Updates will be posted on this page with a new "Last Updated" date.
                  </p>
                </div>

                <div className="w-full h-px"
                     style={{ backgroundColor: designTokens.colors.stone }}></div>

                <div>
                  <h2 className="text-xl font-semibold mb-4"
                      style={{ 
                        fontFamily: designTokens.typography.heading,
                        color: designTokens.colors.charcoal,
                        letterSpacing: '-0.02em'
                      }}>
                    9. Contact Information
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    For privacy-related questions, please contact us at:<br />
                    Email: <a href="mailto:marketing@fitvueapp.com" className="font-semibold hover:underline">marketing@fitvueapp.com</a>
                  </p>
                </div>

                <div className="w-full h-px"
                     style={{ backgroundColor: designTokens.colors.stone }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { designTokens, styleHelpers } from '../styles/design-tokens';

export default function TermsOfService() {
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
            Fitvue – Terms of Use
          </h1>
          <p className="text-base leading-relaxed"
             style={{ 
               color: designTokens.colors.slate,
               fontFamily: designTokens.typography.body
             }}>
            Last Updated: [3/10/25]
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
                  Welcome to Fitvue. These Terms of Use govern your access to and use of the Fitvue mobile application and website ("App"). By downloading, accessing, or using the App, you agree to these Terms and Apple's Standard End User License Agreement (EULA). If you do not agree, do not use the App.
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
                    1. License Grant and Restrictions
                  </h2>
                  <p className="text-base leading-relaxed mb-4"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    You are granted a non-transferable, limited, and revocable license to use Fitvue solely for personal, non-commercial purposes on Apple-branded devices you own or control.
                  </p>
                  <p className="text-base leading-relaxed mb-2"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    You may not:
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      rent, lease, sublicense, sell, or redistribute the App;
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      copy, reverse engineer, or attempt to derive source code;
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      use the App in any manner not permitted by these Terms or applicable law.
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
                    2. Subscriptions and Payments
                  </h2>
                  <p className="text-base leading-relaxed mb-4"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    Fitvue offers auto-renewable subscription plans: Starter, Premium, and Exclusive. Subscriptions are billed monthly through your Apple ID account.
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Subscriptions renew automatically unless canceled at least 24 hours before the current billing period ends.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      You can manage and cancel subscriptions in your Apple ID account settings after purchase.
                    </li>
                    <li className="text-base leading-relaxed"
                        style={{ 
                          color: designTokens.colors.charcoal,
                          fontFamily: designTokens.typography.body
                        }}>
                      Payment will be charged to your Apple ID account upon confirmation of purchase.
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
                    3. Account Responsibilities
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to provide accurate information and to promptly update it as necessary.
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
                    4. Content Ownership and Usage
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    Generated images, previews, and outputs created through Fitvue are licensed to you for personal use only. You may not resell, redistribute, or commercially exploit them.
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
                    5. Data and Privacy
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    By using Fitvue, you agree that certain technical data and usage information may be collected (such as device type, system performance, and error logs) to help improve the App. For details, please review our Privacy Policy.
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
                    6. Termination
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    We may suspend or terminate your account or access to the App at any time if you violate these Terms. Termination does not affect any rights or obligations accrued prior to termination.
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
                    7. Disclaimer of Warranties
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    The App is provided "as is" and "as available", without warranties of any kind. We do not guarantee that the App will be error-free, uninterrupted, or that it will meet your requirements.
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
                    8. Limitation of Liability
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    To the maximum extent permitted by law, Fitvue and its affiliates shall not be liable for any indirect, incidental, or consequential damages arising from your use of the App.
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
                    9. Governing Law
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    These Terms shall be governed by and construed in accordance with the laws of California, USA, without regard to its conflict of law principles. Local consumer protection laws may still apply.
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
                    10. Contact Information
                  </h2>
                  <p className="text-base leading-relaxed"
                     style={{ 
                       color: designTokens.colors.charcoal,
                       fontFamily: designTokens.typography.body
                     }}>
                    For any questions or concerns about these Terms, please contact us at:<br />
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

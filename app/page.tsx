"use client";

import { useState, useMemo } from "react";

const OWNERS = ["Engineering", "HR", "Legal", "Ops", "Founder", "Security", "Finance"];
const STATUSES = ["Not Started", "In Progress", "Done", "N/A"];

const SS: Record<string, { bg: string; color: string }> = {
  "Done":        { bg: "#eaf3de", color: "#3b6d11" },
  "In Progress": { bg: "#faeeda", color: "#854f0b" },
  "Not Started": { bg: "#f1efe8", color: "#5f5e5a" },
  "N/A":         { bg: "#e6f1fb", color: "#185fa5" },
};

type Control = {
  id: number;
  cat: string;
  ref: string;
  control: string;
  owner: string;
  status: string;
  notes: string;
};

const ALL: Control[] = [
  // CC1 Control Environment
  { id: 1,   cat: "CC1 · Control Environment",           ref: "CC1.1",  control: "Management has defined organizational structure with clear reporting lines",          owner: "Founder",     status: "Not Started", notes: "" },
  { id: 2,   cat: "CC1 · Control Environment",           ref: "CC1.2",  control: "Board or equivalent oversight body reviews security program annually",                 owner: "Founder",     status: "Not Started", notes: "" },
  { id: 3,   cat: "CC1 · Control Environment",           ref: "CC1.3",  control: "Security policies formally documented and approved by leadership",                      owner: "Legal",       status: "Not Started", notes: "" },
  { id: 4,   cat: "CC1 · Control Environment",           ref: "CC1.4",  control: "Roles and responsibilities for security documented across functions",                   owner: "Ops",         status: "Not Started", notes: "" },
  { id: 5,   cat: "CC1 · Control Environment",           ref: "CC1.5",  control: "Code of conduct or ethics policy in place and signed by all employees",                 owner: "HR",          status: "Not Started", notes: "" },
  { id: 6,   cat: "CC1 · Control Environment",           ref: "CC1.6",  control: "Background checks completed for all employees and contractors",                         owner: "HR",          status: "Done",        notes: "" },
  { id: 7,   cat: "CC1 · Control Environment",           ref: "CC1.7",  control: "Performance reviews include security responsibilities",                                  owner: "HR",          status: "Not Started", notes: "" },
  { id: 8,   cat: "CC1 · Control Environment",           ref: "CC1.8",  control: "Disciplinary process defined for security policy violations",                           owner: "HR",          status: "Not Started", notes: "" },
  { id: 9,   cat: "CC1 · Control Environment",           ref: "CC1.9",  control: "Organizational chart maintained and up to date",                                         owner: "Ops",         status: "In Progress", notes: "" },
  { id: 10,  cat: "CC1 · Control Environment",           ref: "CC1.10", control: "Security awareness training completed annually by all staff",                            owner: "HR",          status: "Not Started", notes: "" },
  { id: 11,  cat: "CC1 · Control Environment",           ref: "CC1.11", control: "New hire security onboarding process documented",                                        owner: "HR",          status: "Not Started", notes: "" },
  { id: 12,  cat: "CC1 · Control Environment",           ref: "CC1.12", control: "Employee termination includes immediate access revocation procedure",                    owner: "HR",          status: "In Progress", notes: "" },
  // CC2 Communication & Information
  { id: 13,  cat: "CC2 · Communication & Information",   ref: "CC2.1",  control: "Security policies communicated to all employees on hire and annually",                  owner: "HR",          status: "Not Started", notes: "" },
  { id: 14,  cat: "CC2 · Communication & Information",   ref: "CC2.2",  control: "Internal process for employees to report security concerns or incidents",               owner: "Security",    status: "Not Started", notes: "" },
  { id: 15,  cat: "CC2 · Communication & Information",   ref: "CC2.3",  control: "Customer-facing security and privacy documentation published",                          owner: "Legal",       status: "Not Started", notes: "" },
  { id: 16,  cat: "CC2 · Communication & Information",   ref: "CC2.4",  control: "Vendor and third-party security requirements communicated in contracts",                 owner: "Legal",       status: "Not Started", notes: "" },
  { id: 17,  cat: "CC2 · Communication & Information",   ref: "CC2.5",  control: "Incident notification process for customers defined and documented",                     owner: "Legal",       status: "Not Started", notes: "" },
  { id: 18,  cat: "CC2 · Communication & Information",   ref: "CC2.6",  control: "Security updates and changes communicated to affected stakeholders",                     owner: "Ops",         status: "Not Started", notes: "" },
  { id: 19,  cat: "CC2 · Communication & Information",   ref: "CC2.7",  control: "Acceptable Use Policy distributed and acknowledged by all staff",                       owner: "HR",          status: "Not Started", notes: "" },
  // CC3 Risk Assessment
  { id: 20,  cat: "CC3 · Risk Assessment",               ref: "CC3.1",  control: "Annual formal risk assessment process completed",                                       owner: "Security",    status: "Not Started", notes: "Q3 target" },
  { id: 21,  cat: "CC3 · Risk Assessment",               ref: "CC3.2",  control: "Risk register created, maintained, and reviewed quarterly",                             owner: "Ops",         status: "Not Started", notes: "" },
  { id: 22,  cat: "CC3 · Risk Assessment",               ref: "CC3.3",  control: "Threat modeling completed for core product architecture",                               owner: "Engineering", status: "Not Started", notes: "" },
  { id: 23,  cat: "CC3 · Risk Assessment",               ref: "CC3.4",  control: "Penetration testing conducted by third party annually",                                 owner: "Security",    status: "Not Started", notes: "Vendor shortlisted" },
  { id: 24,  cat: "CC3 · Risk Assessment",               ref: "CC3.5",  control: "Vulnerability scanning runs automatically on production systems",                       owner: "Engineering", status: "In Progress", notes: "Snyk integrated" },
  { id: 25,  cat: "CC3 · Risk Assessment",               ref: "CC3.6",  control: "Risk appetite and tolerance defined by leadership",                                     owner: "Founder",     status: "Not Started", notes: "" },
  { id: 26,  cat: "CC3 · Risk Assessment",               ref: "CC3.7",  control: "Findings from risk assessments tracked to remediation",                                 owner: "Security",    status: "Not Started", notes: "" },
  { id: 27,  cat: "CC3 · Risk Assessment",               ref: "CC3.8",  control: "Supply chain and dependency risks assessed",                                            owner: "Engineering", status: "Not Started", notes: "" },
  { id: 28,  cat: "CC3 · Risk Assessment",               ref: "CC3.9",  control: "Data classification policy defined (public, internal, confidential, restricted)",       owner: "Legal",       status: "Not Started", notes: "" },
  // CC4 Monitoring Activities
  { id: 29,  cat: "CC4 · Monitoring Activities",         ref: "CC4.1",  control: "Security controls monitored continuously or reviewed on defined schedule",              owner: "Security",    status: "Not Started", notes: "" },
  { id: 30,  cat: "CC4 · Monitoring Activities",         ref: "CC4.2",  control: "Internal audits or control reviews conducted at least annually",                        owner: "Ops",         status: "Not Started", notes: "" },
  { id: 31,  cat: "CC4 · Monitoring Activities",         ref: "CC4.3",  control: "Deficiencies identified in monitoring are tracked and remediated",                      owner: "Security",    status: "Not Started", notes: "" },
  { id: 32,  cat: "CC4 · Monitoring Activities",         ref: "CC4.4",  control: "Third-party audit or assessment results reviewed by management",                        owner: "Founder",     status: "Not Started", notes: "" },
  { id: 33,  cat: "CC4 · Monitoring Activities",         ref: "CC4.5",  control: "Key performance indicators for security defined and tracked",                           owner: "Security",    status: "Not Started", notes: "" },
  { id: 34,  cat: "CC4 · Monitoring Activities",         ref: "CC4.6",  control: "Management reviews security metrics at regular leadership cadence",                     owner: "Founder",     status: "Not Started", notes: "" },
  // CC5 Control Activities
  { id: 35,  cat: "CC5 · Control Activities",            ref: "CC5.1",  control: "Information security policy formally documented and version-controlled",                owner: "Legal",       status: "Not Started", notes: "" },
  { id: 36,  cat: "CC5 · Control Activities",            ref: "CC5.2",  control: "Acceptable use of technology resources policy in place",                                owner: "HR",          status: "Not Started", notes: "" },
  { id: 37,  cat: "CC5 · Control Activities",            ref: "CC5.3",  control: "Password policy enforced: minimum length, complexity, rotation",                        owner: "Engineering", status: "In Progress", notes: "" },
  { id: 38,  cat: "CC5 · Control Activities",            ref: "CC5.4",  control: "Clean desk and screen lock policy defined for remote/office workers",                   owner: "HR",          status: "Not Started", notes: "" },
  { id: 39,  cat: "CC5 · Control Activities",            ref: "CC5.5",  control: "Mobile device management (MDM) policy and tooling in place",                           owner: "Engineering", status: "Not Started", notes: "" },
  { id: 40,  cat: "CC5 · Control Activities",            ref: "CC5.6",  control: "Bring-your-own-device (BYOD) policy defined if applicable",                            owner: "Legal",       status: "N/A",         notes: "Company devices only" },
  { id: 41,  cat: "CC5 · Control Activities",            ref: "CC5.7",  control: "Software and asset inventory maintained and reviewed",                                  owner: "Engineering", status: "Not Started", notes: "" },
  { id: 42,  cat: "CC5 · Control Activities",            ref: "CC5.8",  control: "Patch management policy: critical patches applied within defined SLA",                  owner: "Engineering", status: "Not Started", notes: "" },
  { id: 43,  cat: "CC5 · Control Activities",            ref: "CC5.9",  control: "Endpoint protection (antivirus/EDR) deployed on all devices",                          owner: "Engineering", status: "Not Started", notes: "" },
  // CC6 Access Control
  { id: 44,  cat: "CC6 · Access Control",                ref: "CC6.1",  control: "MFA enforced on all production systems and cloud infrastructure",                      owner: "Engineering", status: "In Progress", notes: "AWS done, internal tooling pending" },
  { id: 45,  cat: "CC6 · Access Control",                ref: "CC6.2",  control: "MFA enforced on email and collaboration tools (Google Workspace, Slack)",              owner: "Engineering", status: "Done",        notes: "" },
  { id: 46,  cat: "CC6 · Access Control",                ref: "CC6.3",  control: "Unique user accounts — no shared or generic credentials",                              owner: "Engineering", status: "Done",        notes: "" },
  { id: 47,  cat: "CC6 · Access Control",                ref: "CC6.4",  control: "Role-based access control (RBAC) implemented across systems",                          owner: "Engineering", status: "In Progress", notes: "" },
  { id: 48,  cat: "CC6 · Access Control",                ref: "CC6.5",  control: "Principle of least privilege enforced — users have minimum necessary access",          owner: "Engineering", status: "Not Started", notes: "" },
  { id: 49,  cat: "CC6 · Access Control",                ref: "CC6.6",  control: "Access provisioning process documented and requires manager approval",                  owner: "Ops",         status: "Not Started", notes: "" },
  { id: 50,  cat: "CC6 · Access Control",                ref: "CC6.7",  control: "Access deprovisioning completed within 24h of employee termination",                   owner: "HR",          status: "In Progress", notes: "" },
  { id: 51,  cat: "CC6 · Access Control",                ref: "CC6.8",  control: "Quarterly access reviews conducted across all critical systems",                        owner: "Security",    status: "Not Started", notes: "" },
  { id: 52,  cat: "CC6 · Access Control",                ref: "CC6.9",  control: "Privileged/admin access limited to named individuals with justification",              owner: "Engineering", status: "Not Started", notes: "" },
  { id: 53,  cat: "CC6 · Access Control",                ref: "CC6.10", control: "SSH key management policy — rotation schedule and inventory",                          owner: "Engineering", status: "Not Started", notes: "" },
  { id: 54,  cat: "CC6 · Access Control",                ref: "CC6.11", control: "API keys and secrets stored in secrets manager (not hardcoded)",                       owner: "Engineering", status: "In Progress", notes: "AWS Secrets Manager in use" },
  { id: 55,  cat: "CC6 · Access Control",                ref: "CC6.12", control: "VPN or zero-trust access required for internal systems",                               owner: "Engineering", status: "Not Started", notes: "" },
  { id: 56,  cat: "CC6 · Access Control",                ref: "CC6.13", control: "Physical access to office restricted to authorized personnel",                         owner: "Ops",         status: "Done",        notes: "Keycard access in place" },
  { id: 57,  cat: "CC6 · Access Control",                ref: "CC6.14", control: "Server infrastructure hosted in SOC 2 certified data centers (e.g. AWS)",              owner: "Engineering", status: "Done",        notes: "AWS us-east-1" },
  { id: 58,  cat: "CC6 · Access Control",                ref: "CC6.15", control: "Guest WiFi network separated from internal/corporate network",                         owner: "Engineering", status: "Done",        notes: "" },
  { id: 59,  cat: "CC6 · Access Control",                ref: "CC6.16", control: "SSO (single sign-on) deployed for SaaS tool access",                                  owner: "Engineering", status: "Not Started", notes: "Evaluating Okta" },
  // CC7 System Operations
  { id: 60,  cat: "CC7 · System Operations",             ref: "CC7.1",  control: "Audit logging enabled on all production systems and cloud accounts",                   owner: "Engineering", status: "In Progress", notes: "CloudTrail on, app logs pending" },
  { id: 61,  cat: "CC7 · System Operations",             ref: "CC7.2",  control: "Log retention policy defined — minimum 90 days, 1 year preferred",                    owner: "Engineering", status: "Not Started", notes: "" },
  { id: 62,  cat: "CC7 · System Operations",             ref: "CC7.3",  control: "Centralized log aggregation in place (e.g. CloudWatch, Datadog)",                     owner: "Engineering", status: "In Progress", notes: "" },
  { id: 63,  cat: "CC7 · System Operations",             ref: "CC7.4",  control: "Alerts configured for unauthorized or anomalous access attempts",                      owner: "Engineering", status: "Not Started", notes: "" },
  { id: 64,  cat: "CC7 · System Operations",             ref: "CC7.5",  control: "Uptime and performance monitoring in place with alerting",                             owner: "Engineering", status: "Done",        notes: "" },
  { id: 65,  cat: "CC7 · System Operations",             ref: "CC7.6",  control: "On-call rotation defined with documented escalation path",                             owner: "Engineering", status: "In Progress", notes: "PagerDuty setup" },
  { id: 66,  cat: "CC7 · System Operations",             ref: "CC7.7",  control: "Malware and intrusion detection tooling deployed",                                     owner: "Security",    status: "Not Started", notes: "" },
  { id: 67,  cat: "CC7 · System Operations",             ref: "CC7.8",  control: "Network firewall rules documented and reviewed quarterly",                             owner: "Engineering", status: "Not Started", notes: "" },
  { id: 68,  cat: "CC7 · System Operations",             ref: "CC7.9",  control: "Production database access restricted and logged",                                     owner: "Engineering", status: "In Progress", notes: "" },
  { id: 69,  cat: "CC7 · System Operations",             ref: "CC7.10", control: "Security event correlation and SIEM tooling in place or planned",                     owner: "Security",    status: "Not Started", notes: "" },
  // CC8 Change Management
  { id: 70,  cat: "CC8 · Change Management",             ref: "CC8.1",  control: "Code review (PR approval) required before production deployment",                     owner: "Engineering", status: "Done",        notes: "GitHub branch protection" },
  { id: 71,  cat: "CC8 · Change Management",             ref: "CC8.2",  control: "Automated CI/CD pipeline with security checks integrated",                            owner: "Engineering", status: "In Progress", notes: "" },
  { id: 72,  cat: "CC8 · Change Management",             ref: "CC8.3",  control: "Separate staging and production environments enforced",                               owner: "Engineering", status: "Done",        notes: "" },
  { id: 73,  cat: "CC8 · Change Management",             ref: "CC8.4",  control: "Emergency change procedure documented for hotfixes",                                  owner: "Engineering", status: "Not Started", notes: "" },
  { id: 74,  cat: "CC8 · Change Management",             ref: "CC8.5",  control: "Deployment runbooks documented for all critical services",                            owner: "Engineering", status: "Not Started", notes: "" },
  { id: 75,  cat: "CC8 · Change Management",             ref: "CC8.6",  control: "Rollback procedures documented and tested",                                           owner: "Engineering", status: "Not Started", notes: "" },
  { id: 76,  cat: "CC8 · Change Management",             ref: "CC8.7",  control: "Dependency and open-source library scanning in pipeline",                             owner: "Engineering", status: "In Progress", notes: "Snyk" },
  { id: 77,  cat: "CC8 · Change Management",             ref: "CC8.8",  control: "Static application security testing (SAST) integrated in CI",                        owner: "Engineering", status: "Not Started", notes: "" },
  { id: 78,  cat: "CC8 · Change Management",             ref: "CC8.9",  control: "Infrastructure changes tracked in code (IaC — Terraform, CDK, etc.)",                owner: "Engineering", status: "Not Started", notes: "" },
  { id: 79,  cat: "CC8 · Change Management",             ref: "CC8.10", control: "Change log maintained for significant configuration changes",                         owner: "Engineering", status: "Not Started", notes: "" },
  // CC9 Risk Mitigation
  { id: 80,  cat: "CC9 · Risk Mitigation",               ref: "CC9.1",  control: "Vendor risk assessment process documented",                                           owner: "Ops",         status: "Not Started", notes: "" },
  { id: 81,  cat: "CC9 · Risk Mitigation",               ref: "CC9.2",  control: "Critical vendor SOC 2 reports reviewed annually",                                     owner: "Security",    status: "Not Started", notes: "" },
  { id: 82,  cat: "CC9 · Risk Mitigation",               ref: "CC9.3",  control: "Data processing agreements (DPAs) signed with all data processors",                  owner: "Legal",       status: "Not Started", notes: "3 vendors outstanding" },
  { id: 83,  cat: "CC9 · Risk Mitigation",               ref: "CC9.4",  control: "Business associate agreements (BAAs) in place where applicable",                     owner: "Legal",       status: "N/A",         notes: "Not handling PHI currently" },
  { id: 84,  cat: "CC9 · Risk Mitigation",               ref: "CC9.5",  control: "Cyber liability insurance policy in place",                                           owner: "Finance",     status: "Not Started", notes: "" },
  { id: 85,  cat: "CC9 · Risk Mitigation",               ref: "CC9.6",  control: "Insurance coverage reviewed and updated annually",                                    owner: "Finance",     status: "Not Started", notes: "" },
  { id: 86,  cat: "CC9 · Risk Mitigation",               ref: "CC9.7",  control: "Third-party contractor access reviewed and time-limited",                             owner: "Ops",         status: "Not Started", notes: "" },
  // Incident Response
  { id: 88,  cat: "Incident Response",                   ref: "IR.1",   control: "Incident response plan documented and approved by leadership",                        owner: "Ops",         status: "Not Started", notes: "" },
  { id: 89,  cat: "Incident Response",                   ref: "IR.2",   control: "Incident severity classification defined (P1/P2/P3)",                                 owner: "Engineering", status: "Not Started", notes: "" },
  { id: 90,  cat: "Incident Response",                   ref: "IR.3",   control: "Incident response roles and responsibilities assigned",                               owner: "Ops",         status: "Not Started", notes: "" },
  { id: 91,  cat: "Incident Response",                   ref: "IR.4",   control: "Incident tracking and logging system in place",                                       owner: "Engineering", status: "In Progress", notes: "PagerDuty" },
  { id: 92,  cat: "Incident Response",                   ref: "IR.5",   control: "Post-incident review (PIR) process defined and practiced",                           owner: "Engineering", status: "Not Started", notes: "" },
  { id: 93,  cat: "Incident Response",                   ref: "IR.6",   control: "Customer notification process for security incidents defined",                        owner: "Legal",       status: "Not Started", notes: "" },
  { id: 94,  cat: "Incident Response",                   ref: "IR.7",   control: "Regulatory breach notification timeline documented (72h GDPR, etc.)",                owner: "Legal",       status: "Not Started", notes: "" },
  { id: 95,  cat: "Incident Response",                   ref: "IR.8",   control: "Incident response tabletop exercise conducted annually",                              owner: "Security",    status: "Not Started", notes: "" },
  { id: 96,  cat: "Incident Response",                   ref: "IR.9",   control: "Contact list for incident response team maintained and tested",                      owner: "Ops",         status: "Not Started", notes: "" },
  // Availability
  { id: 97,  cat: "Availability",                        ref: "A1.1",   control: "Uptime SLA defined and communicated to customers",                                    owner: "Founder",     status: "Not Started", notes: "" },
  { id: 98,  cat: "Availability",                        ref: "A1.2",   control: "Status page in place for real-time uptime communication",                             owner: "Engineering", status: "Not Started", notes: "" },
  { id: 99,  cat: "Availability",                        ref: "A1.3",   control: "Infrastructure designed for high availability (multi-AZ or redundancy)",              owner: "Engineering", status: "In Progress", notes: "" },
  { id: 100, cat: "Availability",                        ref: "A1.4",   control: "Load testing conducted to validate capacity under peak load",                         owner: "Engineering", status: "Not Started", notes: "" },
  { id: 101, cat: "Availability",                        ref: "A1.5",   control: "Auto-scaling configured for production workloads",                                    owner: "Engineering", status: "Done",        notes: "AWS Auto Scaling" },
  { id: 102, cat: "Availability",                        ref: "A1.6",   control: "Disaster recovery plan documented with RTO and RPO defined",                         owner: "Engineering", status: "Not Started", notes: "" },
  { id: 103, cat: "Availability",                        ref: "A1.7",   control: "DR plan tested at least annually",                                                    owner: "Engineering", status: "Not Started", notes: "" },
  { id: 104, cat: "Availability",                        ref: "A1.8",   control: "DDoS protection in place (e.g. AWS Shield, Cloudflare)",                             owner: "Engineering", status: "In Progress", notes: "Cloudflare" },
  // Data Protection
  { id: 105, cat: "Data Protection",                     ref: "DP.1",   control: "Encryption at rest for all sensitive customer data",                                  owner: "Engineering", status: "Done",        notes: "AES-256 on RDS and S3" },
  { id: 106, cat: "Data Protection",                     ref: "DP.2",   control: "Encryption in transit enforced (TLS 1.2 minimum)",                                   owner: "Engineering", status: "Done",        notes: "" },
  { id: 107, cat: "Data Protection",                     ref: "DP.3",   control: "Database encryption keys managed and rotated",                                        owner: "Engineering", status: "Not Started", notes: "" },
  { id: 108, cat: "Data Protection",                     ref: "DP.4",   control: "Customer data backup automated and tested",                                           owner: "Engineering", status: "Not Started", notes: "" },
  { id: 109, cat: "Data Protection",                     ref: "DP.5",   control: "Backup restoration tested at least quarterly",                                        owner: "Engineering", status: "Not Started", notes: "" },
  { id: 110, cat: "Data Protection",                     ref: "DP.6",   control: "Data retention and deletion policy defined",                                          owner: "Legal",       status: "Not Started", notes: "" },
  { id: 111, cat: "Data Protection",                     ref: "DP.7",   control: "Customer data deletion process upon contract termination documented",                 owner: "Legal",       status: "Not Started", notes: "" },
  { id: 112, cat: "Data Protection",                     ref: "DP.8",   control: "Production data not used in development or testing environments",                     owner: "Engineering", status: "Not Started", notes: "" },
  { id: 113, cat: "Data Protection",                     ref: "DP.9",   control: "Data loss prevention (DLP) tooling or controls in place",                            owner: "Security",    status: "Not Started", notes: "" },
  // Confidentiality
  { id: 114, cat: "Confidentiality",                     ref: "C1.1",   control: "Confidential information classification defined and documented",                      owner: "Legal",       status: "Not Started", notes: "" },
  { id: 115, cat: "Confidentiality",                     ref: "C1.2",   control: "NDAs executed with all employees and contractors",                                    owner: "Legal",       status: "Done",        notes: "" },
  { id: 116, cat: "Confidentiality",                     ref: "C1.3",   control: "NDAs executed with vendors who access confidential data",                             owner: "Legal",       status: "In Progress", notes: "2 outstanding" },
  { id: 117, cat: "Confidentiality",                     ref: "C1.4",   control: "Confidential data handling procedures documented",                                    owner: "Legal",       status: "Not Started", notes: "" },
  { id: 118, cat: "Confidentiality",                     ref: "C1.5",   control: "Confidential data sharing with third parties requires approval",                      owner: "Legal",       status: "Not Started", notes: "" },
  { id: 119, cat: "Confidentiality",                     ref: "C1.6",   control: "Confidential data disposal procedure documented (e.g. secure wipe)",                 owner: "Ops",         status: "Not Started", notes: "" },
  { id: 120, cat: "Confidentiality",                     ref: "C1.7",   control: "Customer contracts include confidentiality obligations",                              owner: "Legal",       status: "Done",        notes: "" },
  // Privacy
  { id: 121, cat: "Privacy",                             ref: "P1.1",   control: "Privacy policy published and accessible to end users",                                owner: "Legal",       status: "Not Started", notes: "" },
  { id: 122, cat: "Privacy",                             ref: "P1.2",   control: "Privacy policy updated to reflect actual data practices",                             owner: "Legal",       status: "Not Started", notes: "" },
  { id: 123, cat: "Privacy",                             ref: "P2.1",   control: "User consent mechanism for data collection in place",                                 owner: "Engineering", status: "Not Started", notes: "" },
  { id: 124, cat: "Privacy",                             ref: "P3.1",   control: "Data collection limited to what is necessary for stated purpose",                     owner: "Engineering", status: "Not Started", notes: "" },
  { id: 125, cat: "Privacy",                             ref: "P4.1",   control: "Data use limited to purposes communicated to users",                                  owner: "Legal",       status: "Not Started", notes: "" },
  { id: 126, cat: "Privacy",                             ref: "P5.1",   control: "User data access and portability request process documented",                         owner: "Ops",         status: "Not Started", notes: "" },
  { id: 127, cat: "Privacy",                             ref: "P5.2",   control: "User data deletion request process documented and tested",                            owner: "Engineering", status: "Not Started", notes: "" },
  { id: 128, cat: "Privacy",                             ref: "P6.1",   control: "Third-party data sharing disclosed in privacy policy",                                owner: "Legal",       status: "Not Started", notes: "" },
  { id: 129, cat: "Privacy",                             ref: "P7.1",   control: "Data quality processes in place — inaccurate data corrected on request",              owner: "Engineering", status: "Not Started", notes: "" },
  { id: 130, cat: "Privacy",                             ref: "P8.1",   control: "GDPR applicability assessed (EU customers or employees)",                             owner: "Legal",       status: "Not Started", notes: "" },
  { id: 131, cat: "Privacy",                             ref: "P8.2",   control: "GDPR DPA agreements in place with all EU data processors",                           owner: "Legal",       status: "Not Started", notes: "" },
  { id: 132, cat: "Privacy",                             ref: "P8.3",   control: "CCPA applicability assessed (California users)",                                      owner: "Legal",       status: "Not Started", notes: "" },
  { id: 133, cat: "Privacy",                             ref: "P8.4",   control: "Privacy impact assessment (PIA) process defined for new features",                   owner: "Legal",       status: "Not Started", notes: "" },
  // Business Continuity
  { id: 134, cat: "Business Continuity",                 ref: "BC.1",   control: "Business continuity plan (BCP) documented",                                          owner: "Founder",     status: "Not Started", notes: "" },
  { id: 135, cat: "Business Continuity",                 ref: "BC.2",   control: "Critical business functions and systems identified",                                  owner: "Ops",         status: "Not Started", notes: "" },
  { id: 136, cat: "Business Continuity",                 ref: "BC.3",   control: "RTO (Recovery Time Objective) defined per critical system",                          owner: "Engineering", status: "Not Started", notes: "" },
  { id: 137, cat: "Business Continuity",                 ref: "BC.4",   control: "RPO (Recovery Point Objective) defined per critical system",                         owner: "Engineering", status: "Not Started", notes: "" },
  { id: 138, cat: "Business Continuity",                 ref: "BC.5",   control: "BCP tested and results documented annually",                                          owner: "Ops",         status: "Not Started", notes: "" },
  { id: 139, cat: "Business Continuity",                 ref: "BC.6",   control: "Key person dependency risk documented and mitigated",                                 owner: "Founder",     status: "Not Started", notes: "" },
  { id: 140, cat: "Business Continuity",                 ref: "BC.7",   control: "Alternate communication channels documented if primary tools are down",               owner: "Ops",         status: "Not Started", notes: "" },
];

const CATS = ["All", ...Array.from(new Set(ALL.map((c) => c.cat)))];

export default function Page() {
  const [controls, setControls] = useState<Control[]>(ALL);
  const [activeCat, setActiveCat] = useState("All");
  const [editNote, setEditNote] = useState<number | null>(null);
  const [noteVal, setNoteVal] = useState("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let r = activeCat === "All" ? controls : controls.filter((c) => c.cat === activeCat);
    if (search.trim())
      r = r.filter(
        (c) =>
          c.control.toLowerCase().includes(search.toLowerCase()) ||
          c.cat.toLowerCase().includes(search.toLowerCase()) ||
          c.ref.toLowerCase().includes(search.toLowerCase())
      );
    return r;
  }, [controls, activeCat, search]);

  const total = controls.length;
  const done = controls.filter((c) => c.status === "Done").length;
  const inProg = controls.filter((c) => c.status === "In Progress").length;
  const na = controls.filter((c) => c.status === "N/A").length;
  const notStarted = total - done - inProg - na;
  const pct = Math.round((done / total) * 100);

  function upd(id: number, field: keyof Control, val: string) {
    setControls((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: val } : c)));
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "1.5rem 2rem", background: "#fff", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 14 }}>
        <img src="/uniblox-logo.png" alt="Uniblox" style={{ width: 36, height: 36, flexShrink: 0 }} />
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#9ca3af", textTransform: "uppercase", margin: "0 0 2px" }}>
            Uniblox · Internal
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 2px", color: "#111827" }}>SOC 2 Readiness Tracker</h1>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
            Trust Services Criteria — Security + optional categories · {total} controls
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: "1.5rem" }}>
        {(
          [
            ["Total", total, "#111827"],
            ["Done", done, "#3b6d11"],
            ["In progress", inProg, "#854f0b"],
            ["Not started", notStarted, "#5f5e5a"],
            ["N/A", na, "#185fa5"],
          ] as [string, number, string][]
        ).map(([label, val, col]) => (
          <div key={label} style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 14px", border: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 2px" }}>{label}</p>
            <p style={{ fontSize: 22, fontWeight: 600, margin: 0, color: col }}>{val}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>Completion</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: "#639922", borderRadius: 99, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Search */}
      <input
        placeholder="Search controls, categories, or ref codes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: "100%", marginBottom: "0.75rem", fontSize: 13, padding: "8px 12px", borderRadius: 8, border: "1px solid #d1d5db", boxSizing: "border-box", outline: "none" }}
      />

      {/* Category filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: "1rem" }}>
        {CATS.map((cat) => {
          const count = cat === "All" ? total : controls.filter((c) => c.cat === cat).length;
          const catDone = cat === "All" ? done : controls.filter((c) => c.cat === cat && c.status === "Done").length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{
                fontSize: 11, padding: "4px 10px", borderRadius: 99, cursor: "pointer",
                border: activeCat === cat ? "1.5px solid #111827" : "1px solid #e5e7eb",
                background: activeCat === cat ? "#111827" : "#fff",
                color: activeCat === cat ? "#fff" : "#6b7280",
                fontWeight: activeCat === cat ? 600 : 400,
              }}
            >
              {cat === "All" ? `All (${total})` : `${cat.split("·")[0].trim()} (${catDone}/${count})`}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "31%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "30%" }} />
          </colgroup>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Ref", "Control", "Owner", "Status", "Notes"].map((h) => (
                <th key={h} style={{ padding: "9px 10px", textAlign: "left", fontWeight: 500, fontSize: 12, color: "#6b7280", borderBottom: "1px solid #e5e7eb" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>
                  No controls match your search.
                </td>
              </tr>
            ) : (
              filtered.map((c, i) => {
                const s = SS[c.status];
                return (
                  <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none", background: "#fff" }}>
                    <td style={{ padding: "8px 10px", color: "#9ca3af", fontFamily: "monospace", fontSize: 11 }}>{c.ref}</td>
                    <td style={{ padding: "8px 10px", color: "#111827", lineHeight: 1.5, fontSize: 13 }}>{c.control}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <select
                        value={c.owner}
                        onChange={(e) => upd(c.id, "owner", e.target.value)}
                        style={{ fontSize: 12, padding: "3px 5px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", width: "100%" }}
                      >
                        {OWNERS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      <select
                        value={c.status}
                        onChange={(e) => upd(c.id, "status", e.target.value)}
                        style={{ fontSize: 11, padding: "3px 6px", borderRadius: 99, border: "none", background: s.bg, color: s.color, fontWeight: 600, width: "100%", cursor: "pointer" }}
                      >
                        {STATUSES.map((st) => <option key={st}>{st}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "8px 10px" }}>
                      {editNote === c.id ? (
                        <input
                          autoFocus
                          value={noteVal}
                          onChange={(e) => setNoteVal(e.target.value)}
                          onBlur={() => { upd(c.id, "notes", noteVal); setEditNote(null); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { upd(c.id, "notes", noteVal); setEditNote(null); } }}
                          style={{ fontSize: 12, padding: "3px 6px", width: "100%", borderRadius: 6, border: "1px solid #d1d5db", boxSizing: "border-box" }}
                        />
                      ) : (
                        <span
                          onClick={() => { setEditNote(c.id); setNoteVal(c.notes); }}
                          style={{ fontSize: 12, color: c.notes ? "#6b7280" : "#d1d5db", cursor: "text", display: "block", minHeight: 18 }}
                        >
                          {c.notes || "Add note..."}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 11, color: "#9ca3af", marginTop: "0.75rem", textAlign: "right" }}>
        {filtered.length} of {total} controls shown · click any field to edit
      </p>
    </div>
  );
}
